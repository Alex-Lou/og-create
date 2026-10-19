// Les carrés du sol gardés en images (TerrainCache) : leur taille, leur résolution selon l'échelle, ce que couvrent des
// cases, le décor peint dedans, la vue d'ensemble.
import { TW, TH, aboveOf, CELL_ABOVE_MAX, CELL_BELOW, worldOf } from './geo';
import { drawCell } from './cell';
import { featheredVeil } from './veil';

// Carrés du sol : côté en pixels, marge qui recouvre les voisins, nombre gardé en images (hors de ceux à l'écran,
// toujours gardés), résolution maximale ; vue d'ensemble de toute l'île
const TILE_PX = 512;

const PAD_PX = 2;

const MAX_TILES = 24;

const MAX_RES = 2;

const OVERVIEW_RES = 0.25;

// De près, seule la jungle du départ est cuite dans le sol (NEAR_BAKE : ses plantes, si nombreuses, se dessinaient une à
// une à chaque image ; elles ne plient plus au vent de près ; draw(…, bake), standOf(ctx, x, y, bake))
export const NEAR_BAKE = 'jungle';

const tagOf = bake => (bake === NEAR_BAKE ? 'j' : bake ? 'b' : '');

// Sauf de près (l'île en décide à chaque image : draw(…, bake)), le décor fixe (arbres, rochers…) est peint dans les
// carrés du sol, une fois, dans l'ordre du relief : l'île n'a plus à le redessiner à chaque image. Un carré est fait
// avec ou sans décor (clé distincte) ; la vue d'ensemble l'a toujours
// Vue d'ensemble peinte avant que tous les dessins du décor soient prêts : refaite au plus tant de fois
const OVERVIEW_RETRIES = 6;

// Ce qu'un élément du décor dépasse de sa case : vers le haut, sur les côtés (unités du monde, cadre des dessins)
const STAND_ABOVE = 96;

const STAND_SIDE = 10;

// Sol de l'île en carrés gardés en images, alignés sur l'écran (aucun chevauchement) : un carré fait TILE_PX pixels
// de côté, quelle que soit la résolution, et couvre donc TILE_PX / res unités du monde. Les carrés à l'écran ne
// sont jamais jetés ; au-delà de MAX_TILES, les plus anciens hors de l'écran partent d'abord (sauf ceux d'un trajet
// préparé d'avance : prepare, jusqu'à release). Vue de toute l'île :
// une seule image basse résolution (la vue d'ensemble), qui sert aussi en attendant un carré pas encore prêt.
// veilOf(x, y) : voile de brume d'une case (0 si son quartier est à soi) ; standOf(ctx, x, y) : peint le décor fixe
// d'une case, vrai si tout était prêt (les carrés cuits avant que tous les dessins soient chargés seront refaits)
// Un carré pas encore prêt (une image du décor manque) : refait STALE_TRIES fois au plus, à STALE_GAP_MS d'écart
const STALE_TRIES = 8;

export const STALE_GAP_MS = 300;

// (une image du décor qui ne vient pas ne le fait pas refaire à chaque image, sans fin)
const retryable = (tile, now) => tile.stale && (tile.tries || 0) < STALE_TRIES && now - (tile.at || 0) > STALE_GAP_MS;

// Une peinture par pas (painting, rendering), déroulée d'un trait : son résultat
const finish = steps => {
  let step = steps.next();
  while (!step.done) step = steps.next();
  return step.value;
};

export class TerrainCache {
  constructor(M, veilOf, standOf = null) {
    this.M = M;
    this.veilOf = veilOf;
    this.standOf = standOf;
    this.tiles = new Map();
    // Les carrés d'un trajet préparé d'avance (prepare : clé → où les repeindre) : gardés au-delà de MAX_TILES jusqu'à
    // release (le vol du conseil en prépare une quarantaine ; jetés dès ses premières images, ils étaient repeints
    // pendant qu'il passait)
    this.kept = new Map();
    // Le carré du trajet en cours de préparation, peint par morceaux ({ key, steps, version }) ; version : comptée à
    // chaque changement du sol ou du décor (un carré peint pendant l'un d'eux se refera)
    this.job = null;
    this.version = 0;
    this.overview = null;
    const n = M.n;
    // Rectangle du monde où il y a du sol (au-delà, la mer)
    this.bounds = { x: (-n * TW) / 2 - TW, y: -CELL_ABOVE_MAX, w: n * TW + 2 * TW, h: n * TH + CELL_ABOVE_MAX + CELL_BELOW };
  }

  // Le décor fixe a changé : les carrés où il est cuit et la vue d'ensemble seront refaits
  restand() {
    this.version++;
    for (const tile of this.tiles.values()) {
      if (!tile.bake) continue;
      tile.stale = true;
      tile.tries = 0;
    }
    if (this.overview) { this.overview.stale = true; this.overview.retries = 0; }
  }

  // Peint les cases qui touchent un rectangle du monde, dans l'ordre du relief (diagonale après diagonale, de gauche
  // à droite) ; le canvas ou la découpe coupe ce qui dépasse. stand : avec le décor fixe de chaque case. Renvoie le
  // nombre de cases peintes (this.ready dit si tout le décor était prêt)
  paint(ctx, r, stand = false) {
    const { count, ready } = finish(this.painting(ctx, r, stand));
    this.ready = ready;
    return count;
  }

  // Les mêmes cases, une diagonale à chaque pas (la préparation d'un trajet s'arrête entre deux : prepare) ; à la fin,
  // { count, ready }
  *painting(ctx, r, stand = false) {
    let ready = true;
    const M = this.M, n = M.n;
    // Centre d'une case : ((x - y) · TW/2, (x + y) · TH/2) ; d = x + y, u = x - y
    // (cases qui touchent le rectangle sur plus qu'un bord ; avec le décor, aussi celles dont un arbre y dépasse)
    const side = TW / 2 + 2 + (stand ? STAND_SIDE : 0), above = stand ? STAND_ABOVE : 0;
    const umin = Math.floor(((r.x - side) * 2) / TW) + 1, umax = Math.ceil(((r.x + r.w + side) * 2) / TW) - 1;
    const dmin = Math.max(0, Math.floor(((r.y - CELL_BELOW) * 2) / TH) + 1), dmax = Math.min(2 * n - 2, Math.ceil(((r.y + r.h + CELL_ABOVE_MAX + above) * 2) / TH) - 1);
    let count = 0;
    // (le voile brut de chaque case, lu une fois pour cette préparation : le bord fondu relit ses voisines ; les cases
    // à lire sont celles des diagonales peintes)
    const raw = new Map();
    const box = { x0: Math.ceil((dmin + umin) / 2), x1: Math.floor((dmax + umax) / 2), y0: Math.ceil((dmin - umax) / 2), y1: Math.floor((dmax - umin) / 2) };
    const veil = featheredVeil(M, (x, y) => {
      const key = y * n + x;
      let v = raw.get(key);
      if (v === undefined) raw.set(key, (v = this.veilOf(x, y)));
      return v;
    }, box);
    for (let d = dmin; d <= dmax; d++) {
      const xa = Math.max(0, d - n + 1, Math.ceil((d + umin) / 2)), xb = Math.min(n - 1, d, Math.floor((d + umax) / 2));
      for (let x = xa; x <= xb; x++) {
        const y = d - x;
        if (!M.land(x, y) && M.ground(x, y) !== 'b') continue;
        if ((d * TH) / 2 - aboveOf(M, x, y) - above >= r.y + r.h || (d * TH) / 2 + CELL_BELOW <= r.y) continue;
        drawCell(ctx, M, x, y, veil(x, y));
        if (stand && !this.standOf(ctx, x, y, stand)) ready = false;
        count++;
      }
      yield;
    }
    return { count, ready };
  }

  // Un carré : sa case de la grille à cette résolution, avec une marge de PAD_PX pixels qui recouvre ses voisins
  // (aucune couture entre deux carrés). Un carré de pleine mer ne garde pas d'image
  render(tx, ty, res, bake = false) {
    return finish(this.rendering(tx, ty, res, bake));
  }

  // Le même carré, une diagonale de cases à chaque pas (prepare)
  *rendering(tx, ty, res, bake = false) {
    const size = TILE_PX / res, pad = PAD_PX / res;
    const r = { x: tx * size - pad, y: ty * size - pad, w: size + 2 * pad, h: size + 2 * pad };
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = TILE_PX + 2 * PAD_PX;
    const ctx = canvas.getContext('2d');
    ctx.setTransform(res, 0, 0, res, -r.x * res, -r.y * res);
    const { count, ready } = yield* this.painting(ctx, r, bake);
    if (count) return { canvas, r, res, bake, stale: bake && !ready };
    canvas.width = canvas.height = 0;
    return { canvas: null, r, res, bake };
  }

  // Toute l'île en basse résolution
  // (avec le décor fixe ; peinte trop tôt, elle est refaite un peu plus tard, OVERVIEW_RETRIES fois au plus)
  overviewOf() {
    const now = performance.now();
    const o = this.overview;
    if (o && !(o.stale && o.retries < OVERVIEW_RETRIES && now - o.at > 400)) return o;
    const b = this.bounds;
    const canvas = o ? o.canvas : document.createElement('canvas');
    canvas.width = Math.ceil(b.w * OVERVIEW_RES);
    canvas.height = Math.ceil(b.h * OVERVIEW_RES);
    const ctx = canvas.getContext('2d');
    ctx.setTransform(OVERVIEW_RES, 0, 0, OVERVIEW_RES, -b.x * OVERVIEW_RES, -b.y * OVERVIEW_RES);
    this.paint(ctx, b, Boolean(this.standOf));
    this.overview = { canvas, ctx, at: now, stale: !this.ready, retries: o ? o.retries + 1 : 0 };
    return this.overview;
  }

  // Dessine le sol visible (view : rectangle du monde, scale : pixels par unité du monde ; bake : avec le décor fixe).
  // Les carrés manquants sont préparés tant qu'il reste du temps (budget en ms, au moins un par image ; tous d'un coup
  // à l'arrivée sur l'île), puis, tout étant prêt, un voisin de l'écran d'avance. Renvoie le nombre de carrés encore à
  // préparer
  draw(ctx, view, scale, budget = 8, bake = false) {
    const res = resOf(scale);
    bake = this.standOf ? bake : false;
    const tag = `${res}${tagOf(bake)}`;
    const b = this.bounds;
    if (res <= OVERVIEW_RES) {
      ctx.drawImage(this.overviewOf().canvas, b.x, b.y, b.w, b.h);
      this.seen = 0;
      return 0;
    }
    const size = TILE_PX / res;
    const x0 = Math.floor(Math.max(view.x, b.x) / size), x1 = Math.floor(Math.min(view.x + view.w, b.x + b.w) / size);
    const y0 = Math.floor(Math.max(view.y, b.y) / size), y1 = Math.floor(Math.min(view.y + view.h, b.y + b.h) / size);
    const start = performance.now();
    const all = !this.tiles.size;
    const seen = new Set();
    let rendered = 0, missing = 0;
    for (let ty = y0; ty <= y1; ty++) {
      for (let tx = x0; tx <= x1; tx++) {
        const key = `${tag}:${tx},${ty}`;
        seen.add(key);
        let tile = this.tiles.get(key);
        // (un carré pas encore prêt est refait quelques fois, espacées)
        if ((!tile || retryable(tile, start)) && (all || !rendered || performance.now() - start < budget)) {
          const tries = tile ? (tile.tries || 0) + 1 : 0;
          if (tile && tile.canvas) tile.canvas.width = tile.canvas.height = 0;
          tile = this.render(tx, ty, res, bake);
          tile.tries = tries;
          tile.at = start;
          rendered++;
        }
        if (tile) {
          // Le plus récemment vu passe en dernier : les plus anciens partent d'abord
          this.tiles.delete(key);
          this.tiles.set(key, tile);
          if (tile.stale) missing++;
          if (tile.canvas) ctx.drawImage(tile.canvas, tile.r.x, tile.r.y, tile.r.w, tile.r.h);
        } else {
          missing++;
          this.stand(ctx, { x: tx * size, y: ty * size, w: size, h: size });
        }
      }
    }
    if (!missing && this.tiles.size < MAX_TILES && performance.now() - start < budget) this.ahead(res, bake, x0 - 1, y0 - 1, x1 + 1, y1 + 1);
    for (const [key, tile] of this.tiles) {
      if (this.tiles.size <= MAX_TILES) break;
      if (seen.has(key) || this.kept.has(key)) continue;
      if (tile.canvas) tile.canvas.width = tile.canvas.height = 0;
      this.tiles.delete(key);
    }
    // (carrés à l'écran : le chargement de l'île compte ceux qui sont prêts)
    this.seen = seen.size;
    return missing;
  }

  // Un carré manquant d'une vue du monde à cette échelle, préparé d'avance (le vol du conseil : WorldView, phare.js),
  // peint par morceaux jusqu'à until (performance.now(), au moins une diagonale de cases) : true s'il a peint, false
  // quand la vue est toute prête. Le carré commencé se finit d'abord
  prepare(view, scale, bake = false, until = Infinity) {
    if (this.job) return this.advance(until);
    const res = resOf(scale);
    if (res <= OVERVIEW_RES) return false;
    bake = this.standOf ? bake : false;
    const size = TILE_PX / res, b = this.bounds;
    const x0 = Math.floor(Math.max(view.x, b.x) / size), x1 = Math.floor(Math.min(view.x + view.w, b.x + b.w) / size);
    const y0 = Math.floor(Math.max(view.y, b.y) / size), y1 = Math.floor(Math.min(view.y + view.h, b.y + b.h) / size);
    for (let ty = y0; ty <= y1; ty++) {
      for (let tx = x0; tx <= x1; tx++) {
        const key = `${res}${tagOf(bake)}:${tx},${ty}`;
        this.kept.set(key, { tx, ty, res, bake });
        if (this.tiles.has(key)) continue;
        this.job = { key, steps: this.rendering(tx, ty, res, bake), version: this.version };
        return this.advance(until);
      }
    }
    return false;
  }

  // Un carré du trajet préparé à refaire (un chemin ou un dessin du décor arrivé depuis), refait à son tour, comme à
  // l'écran, et par morceaux comme prepare : true s'il a peint (repeint pendant le vol, il le faisait saccader)
  retouch(until = Infinity) {
    if (this.job) return this.advance(until);
    const now = performance.now();
    for (const [key, { tx, ty, res, bake }] of this.kept) {
      const tile = this.tiles.get(key);
      if (!tile || !retryable(tile, now)) continue;
      this.job = { key, steps: this.rendering(tx, ty, res, bake), version: this.version };
      return this.advance(until);
    }
    return false;
  }

  // Le carré en cours, peint jusqu'à until (au moins une diagonale) ; fini, il prend sa place : l'image qu'il remplace
  // est libérée, et un carré refait compte ses essais. Toujours true (il y avait à peindre)
  advance(until) {
    const job = this.job;
    let step;
    do step = job.steps.next(); while (!step.done && performance.now() < until);
    if (!step.done) return true;
    this.job = null;
    const tile = step.value;
    // (le sol ou le décor a changé pendant qu'il se peignait : il se refera)
    if (job.version !== this.version) tile.stale = true;
    const old = this.tiles.get(job.key);
    if (old && old.canvas) old.canvas.width = old.canvas.height = 0;
    tile.tries = old ? (old.tries || 0) + 1 : 0;
    tile.at = performance.now();
    this.tiles.set(job.key, tile);
    return true;
  }

  // Le trajet préparé est passé : ses carrés redeviennent des carrés comme les autres
  release() {
    this.kept.clear();
    this.job = null;
  }

  // Un carré pas encore prêt autour de l'écran (sur l'île), préparé d'avance
  ahead(res, bake, x0, y0, x1, y1) {
    const size = TILE_PX / res, b = this.bounds;
    for (let ty = y0; ty <= y1; ty++) {
      for (let tx = x0; tx <= x1; tx++) {
        const key = `${res}${tagOf(bake)}:${tx},${ty}`;
        if (this.tiles.has(key) || (tx + 1) * size < b.x || tx * size > b.x + b.w || (ty + 1) * size < b.y || ty * size > b.y + b.h) continue;
        this.tiles.set(key, this.render(tx, ty, res, bake));
        return;
      }
    }
  }

  // En attendant un carré : la vue d'ensemble si elle existe déjà (vue de toute l'île), puis les carrés d'une autre
  // résolution qui le recouvrent (découpés à sa place)
  stand(ctx, r) {
    const b = this.bounds;
    if (this.overview) {
      const k = OVERVIEW_RES;
      ctx.drawImage(this.overview.canvas, (r.x - b.x) * k, (r.y - b.y) * k, r.w * k, r.h * k, r.x, r.y, r.w, r.h);
    }
    ctx.save();
    ctx.beginPath();
    ctx.rect(r.x, r.y, r.w, r.h);
    ctx.clip();
    for (const tile of this.tiles.values()) {
      const t = tile.r;
      if (tile.canvas && t.x < r.x + r.w && t.x + t.w > r.x && t.y < r.y + r.h && t.y + t.h > r.y) ctx.drawImage(tile.canvas, t.x, t.y, t.w, t.h);
    }
    ctx.restore();
  }

  // La brume de ces cases a changé (quartier acheté) : leurs carrés sont refaits au fil des images (l'ancien reste
  // affiché d'ici là), la vue d'ensemble est repeinte à leur place
  // pad : en cases, autour des cases changées (le voile d'un quartier qui change s'épaissit ou s'éclaircit sur FEATHER
  // cases chez ses voisins)
  invalidate(cells, pad = 0) {
    if (!cells.length) return;
    this.version++;
    const box = cellsBox(this.M, cells);
    const r = { x: box.x - pad * TW, y: box.y - pad * TH, w: box.w + 2 * pad * TW, h: box.h + 2 * pad * TH };
    for (const tile of this.tiles.values()) {
      const t = tile.r;
      if (t.x < r.x + r.w && t.x + t.w > r.x && t.y < r.y + r.h && t.y + t.h > r.y) {
        tile.stale = true;
        tile.tries = 0;
      }
    }
    if (this.overview) {
      const { ctx } = this.overview;
      ctx.save();
      ctx.beginPath();
      ctx.rect(r.x, r.y, r.w, r.h);
      ctx.clip();
      ctx.clearRect(r.x, r.y, r.w, r.h);
      this.paint(ctx, r, Boolean(this.standOf));
      ctx.restore();
    }
  }

  // Libère toutes les images (sortie de l'île)
  clear() {
    for (const tile of this.tiles.values()) if (tile.canvas) tile.canvas.width = tile.canvas.height = 0;
    this.tiles.clear();
    this.kept.clear();
    this.job = null;
    if (this.overview) this.overview.canvas.width = this.overview.canvas.height = 0;
    this.overview = null;
  }
}

// Résolution des images du sol pour une échelle d'affichage : par paliers de √2 (une image n'est jamais agrandie,
// et pas plus de 1,41 fois réduite), entre la vue d'ensemble et MAX_RES
export function resOf(scale) {
  return Math.min(MAX_RES, 2 ** (Math.ceil(2 * Math.log2(Math.max(OVERVIEW_RES, scale))) / 2));
}

// Rectangle du monde que couvrent des cases ([x, y]), relief et faces compris
export function cellsBox(M, cells) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const [x, y] of cells) {
    const c = worldOf(x, y, 0);
    x0 = Math.min(x0, c.x - TW / 2 - 2);
    x1 = Math.max(x1, c.x + TW / 2 + 2);
    y0 = Math.min(y0, c.y - aboveOf(M, x, y));
    y1 = Math.max(y1, c.y + CELL_BELOW);
  }
  return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
}
