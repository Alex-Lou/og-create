// Le sol de la grande île en relief (Canvas 2D, unités du monde) : chaque case a un sol (herbe, sable, prairie,
// forêt, roche, chemin, eau…) et une hauteur de 0 à 3 ; ses faces avant (vers +x et +y) descendent jusqu'au voisin,
// ou jusqu'à la mer. Le sol est préparé en carrés alignés sur l'écran, gardés en images (TerrainCache) : seuls les
// carrés visibles sont dessinés, les nouveaux préparés dans un budget de temps par image.
// L'eau (reflets, cascades) et l'écume sont animées par-dessus, case par case visible.

export const TW = 64;
export const TH = TW / 2;
// Hauteur d'un palier de relief, et niveau de la mer (en paliers, sous la terre la plus basse)
export const HS = 22;
export const SEA_Z = -1.36;
// Carrés du sol : côté en pixels, marge qui recouvre les voisins, nombre gardé en images (hors de ceux à l'écran,
// toujours gardés), résolution maximale ; vue d'ensemble de toute l'île
const TILE_PX = 512;
const PAD_PX = 2;
const MAX_TILES = 24;
const MAX_RES = 2;
const OVERVIEW_RES = 0.25;
// Ce qu'une case peut couvrir au-dessus de son centre (relief, détails) et au-dessous (faces jusqu'à la mer, piles
// du pont), en unités du monde
const cellAbove = h => TH / 2 + Math.max(0, h) * HS + 8;
const CELL_ABOVE_MAX = TH / 2 + 3 * HS + 8;
const CELL_BELOW = TH / 2 - SEA_Z * HS + 8;

// Lecture des calques du serveur (state.map) : relief, sol, quartier
export function islandOf(map, n) {
  const ground = (x, y) => (x < 0 || y < 0 || x >= n || y >= n ? '~' : map.ground[y][x]);
  const height = (x, y) => {
    const c = x < 0 || y < 0 || x >= n || y >= n ? ' ' : map.height[y][x];
    return c === ' ' ? -1 : Number(c);
  };
  const zone = (x, y) => {
    const c = x < 0 || y < 0 || x >= n || y >= n ? '.' : map.grid[y][x];
    return c === '.' ? -1 : parseInt(c, 36);
  };
  const land = (x, y) => { const g = ground(x, y); return g !== '~' && g !== 'b'; };
  // Hauteur de la surface (en paliers) : l'eau douce est un peu sous ses rives ; la mer (et le pont qui la
  // traverse) au niveau de la mer
  const surface = (x, y) => {
    const g = ground(x, y);
    if (g === '~' || g === 'b') return SEA_Z;
    return g === 'w' ? height(x, y) - 0.25 : height(x, y);
  };
  return { n, ground, height, zone, land, surface };
}

// Centre d'une case (ou d'un point fractionnaire) à une hauteur donnée (en paliers)
export const worldOf = (x, y, z = 0) => ({ x: ((x - y) * TW) / 2, y: ((x + y) * TH) / 2 - z * HS });

// Hasard fixe par case
const rnd = (x, y, k = 0) => { const v = Math.sin(x * 12.9898 + y * 78.233 + k * 37.719) * 43758.5453; return v - Math.floor(v); };

const TOPS = {
  g: [['#93CE70', '#9ED67B'], ['#8CC66A', '#97CF74'], ['#85BC63', '#90C56D'], ['#9DB86E', '#A6C077']],
  m: [['#A6D873', '#B0DF7E']],
  f: [['#6FA458', '#78AD60']],
  r: [['#A9A294', '#B2AB9D']],
  s: [['#EBD49B', '#F0DBA6']],
  p: [['#DCC28B', '#E1C892'], ['#D6BC83', '#DBC28A']],
  w: [['#5FB0DD', '#66B6E1']]
};
const topColor = (g, h, odd) => {
  const key = g === 't' ? 'g' : g === 'd' ? 's' : g === 'k' ? 'w' : g;
  const set = TOPS[key] || TOPS.g;
  return set[Math.min(set.length - 1, Math.max(0, h))][odd ? 1 : 0];
};
// Faces : terre (sous l'herbe), sable, roche, eau qui tombe, marches de pierre ; [gauche, droite]
const FACES = {
  earth: ['#9C6A3A', '#7E5229'],
  sand: ['#D2B47A', '#BC9C63'],
  rock: ['#8E8578', '#766D61'],
  fall: ['#9AD3F0', '#86C6E8'],
  stairs: ['#CDBB94', '#B8A57D']
};

function face(ctx, x0, y0, x1, y1, drop, kind, side, grassy) {
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  ctx.lineTo(x1, y1 + drop);
  ctx.lineTo(x0, y0 + drop);
  ctx.closePath();
  ctx.fillStyle = FACES[kind][side];
  ctx.fill();
  if (kind === 'stairs') {
    // Marches : une bande claire et une ombre par demi-palier
    const steps = Math.max(2, Math.round(drop / (HS / 3)));
    for (let k = 0; k < steps; k++) {
      const a = (k / steps) * drop, b = a + drop / steps * 0.35;
      ctx.fillStyle = 'rgba(255, 248, 225, .45)';
      ctx.beginPath();
      ctx.moveTo(x0, y0 + a); ctx.lineTo(x1, y1 + a); ctx.lineTo(x1, y1 + b); ctx.lineTo(x0, y0 + b);
      ctx.closePath();
      ctx.fill();
    }
    return;
  }
  if (kind === 'fall') return;
  // Strates sur les hautes faces, ombre au pied, liseré d'herbe en haut
  if (drop > HS * 0.9) {
    ctx.strokeStyle = 'rgba(60, 35, 15, .16)';
    ctx.lineWidth = 1;
    for (let z = HS * 0.5; z < drop - 3; z += HS * 0.5) {
      ctx.beginPath();
      ctx.moveTo(x0, y0 + z);
      ctx.lineTo(x1, y1 + z);
      ctx.stroke();
    }
  }
  ctx.fillStyle = 'rgba(40, 22, 10, .16)';
  ctx.beginPath();
  ctx.moveTo(x0, y0 + drop * 0.7); ctx.lineTo(x1, y1 + drop * 0.7); ctx.lineTo(x1, y1 + drop); ctx.lineTo(x0, y0 + drop);
  ctx.closePath();
  ctx.fill();
  if (grassy) {
    ctx.fillStyle = side ? '#5F8F41' : '#6E9E4C';
    ctx.beginPath();
    ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.lineTo(x1, y1 + 3.5); ctx.lineTo(x0, y0 + 3.5);
    ctx.closePath();
    ctx.fill();
  }
}

function diamond(ctx, cx, cy, w = TW, h = TH) {
  ctx.beginPath();
  ctx.moveTo(cx, cy - h / 2);
  ctx.lineTo(cx + w / 2, cy);
  ctx.lineTo(cx, cy + h / 2);
  ctx.lineTo(cx - w / 2, cy);
  ctx.closePath();
}

// Pont de planches sur la mer (vers l'îlot du Phare), posé au ras de la terre
function seaBridge(ctx, M, x, y) {
  const c = worldOf(x, y, 0.15);
  ctx.fillStyle = '#6B4A2A';
  for (const [dx, dy] of [[-0.35, -0.35], [0.35, 0.35]]) {
    const p = worldOf(x + dx, y + dy, 0.15);
    ctx.fillRect(p.x - 2, p.y, 4, HS * 1.5);
  }
  diamond(ctx, c.x, c.y, TW * 0.92, TH * 0.6);
  ctx.fillStyle = '#A47A4A';
  ctx.fill();
  ctx.strokeStyle = '#7A5530';
  ctx.lineWidth = 1;
  for (let k = -3; k <= 3; k++) {
    ctx.beginPath();
    ctx.moveTo(c.x + k * 6 - 9, c.y + k * 3 - 4.5 + (k * 0.2));
    ctx.lineTo(c.x + k * 6 + 9, c.y + k * 3 + 4.5 - (k * 0.2));
    ctx.stroke();
  }
}

// Une case : faces avant puis dessus, détails du sol, voile de brume (quartier à acheter)
export function drawCell(ctx, M, x, y, veil = 0) {
  const g = M.ground(x, y);
  if (g === '~') return;
  if (g === 'b') { seaBridge(ctx, M, x, y); return; }
  const h = M.height(x, y);
  const top = M.surface(x, y);
  const c = worldOf(x, y, top);
  const odd = (x + y) % 2;
  const grassy = 'gtmf'.includes(g);
  const kindOf = (nx, ny) => {
    if (g === 'w') return M.ground(nx, ny) === 'w' || M.ground(nx, ny) === 'k' ? 'fall' : 'earth';
    if ((g === 'p' || g === 'k') && 'pk'.includes(M.ground(nx, ny))) return 'stairs';
    if (g === 's' || g === 'd') return 'sand';
    if (g === 'r') return 'rock';
    return h >= 2 && !grassy ? 'rock' : 'earth';
  };
  const zl = M.surface(x, y + 1), zr = M.surface(x + 1, y);
  if (zl < top) face(ctx, c.x - TW / 2, c.y, c.x, c.y + TH / 2, (top - zl) * HS, kindOf(x, y + 1), 0, grassy);
  if (zr < top) face(ctx, c.x, c.y + TH / 2, c.x + TW / 2, c.y, (top - zr) * HS, kindOf(x + 1, y), 1, grassy);
  diamond(ctx, c.x, c.y);
  ctx.fillStyle = topColor(g, h, odd);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, .12)';
  ctx.lineWidth = 0.8;
  ctx.stroke();
  // Détails : cailloux du chemin, fleurs de la prairie, ondulations du sable, brins d'herbe, fissures de la roche
  if (g === 'p' || g === 'k') {
    ctx.fillStyle = 'rgba(120, 90, 50, .28)';
    for (let k = 0; k < 4; k++) ctx.fillRect(c.x - 14 + rnd(x, y, k) * 28, c.y - 5 + rnd(x, y, k + 9) * 10, 2, 2);
  } else if (g === 'm') {
    const colors = ['#F2E36B', '#F49AC1', '#FFFFFF', '#B7A6F2'];
    for (let k = 0; k < 5; k++) {
      ctx.fillStyle = colors[Math.floor(rnd(x, y, k + 3) * colors.length)];
      ctx.fillRect(c.x - 16 + rnd(x, y, k) * 32, c.y - 6 + rnd(x, y, k + 7) * 12, 2.4, 2.4);
    }
  } else if (g === 's' || g === 'd') {
    ctx.strokeStyle = 'rgba(190, 150, 90, .25)';
    ctx.lineWidth = 1;
    const k = rnd(x, y, 2) * 8 - 4;
    ctx.beginPath();
    ctx.moveTo(c.x - 12, c.y + k);
    ctx.quadraticCurveTo(c.x, c.y + k - 3, c.x + 12, c.y + k);
    ctx.stroke();
  } else if (g === 'r') {
    ctx.strokeStyle = 'rgba(70, 60, 50, .3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(c.x - 10 + rnd(x, y) * 6, c.y - 4);
    ctx.lineTo(c.x + rnd(x, y, 1) * 4, c.y + 1);
    ctx.lineTo(c.x + 8, c.y - 2 + rnd(x, y, 2) * 5);
    ctx.stroke();
  } else if (grassy && g !== 'f') {
    ctx.fillStyle = 'rgba(60, 110, 40, .22)';
    for (let k = 0; k < 3; k++) ctx.fillRect(c.x - 15 + rnd(x, y, k) * 30, c.y - 5 + rnd(x, y, k + 4) * 10, 1.4, 3);
  }
  if (g === 'k') {
    // Petit pont de bois sur la rivière
    ctx.fillStyle = '#A47A4A';
    diamond(ctx, c.x, c.y - 3, TW * 0.7, TH * 0.7);
    ctx.fill();
    ctx.strokeStyle = '#7A5530';
    ctx.lineWidth = 1;
    for (let k = -2; k <= 2; k++) {
      ctx.beginPath();
      ctx.moveTo(c.x + k * 6 - 8, c.y - 3 + k * 3 - 4);
      ctx.lineTo(c.x + k * 6 + 8, c.y - 3 + k * 3 + 4);
      ctx.stroke();
    }
  }
  if (veil > 0) {
    ctx.fillStyle = `rgba(236, 238, 242, ${veil.toFixed(3)})`;
    diamond(ctx, c.x, c.y, TW + 1, TH + 1);
    ctx.fill();
    if (zl < top) { ctx.beginPath(); ctx.moveTo(c.x - TW / 2, c.y); ctx.lineTo(c.x, c.y + TH / 2); ctx.lineTo(c.x, c.y + TH / 2 + (top - zl) * HS); ctx.lineTo(c.x - TW / 2, c.y + (top - zl) * HS); ctx.closePath(); ctx.fill(); }
    if (zr < top) { ctx.beginPath(); ctx.moveTo(c.x, c.y + TH / 2); ctx.lineTo(c.x + TW / 2, c.y); ctx.lineTo(c.x + TW / 2, c.y + (top - zr) * HS); ctx.lineTo(c.x, c.y + TH / 2 + (top - zr) * HS); ctx.closePath(); ctx.fill(); }
  }
}

// Sol de l'île en carrés gardés en images, alignés sur l'écran (aucun chevauchement) : un carré fait TILE_PX pixels
// de côté, quelle que soit la résolution, et couvre donc TILE_PX / res unités du monde. Les carrés à l'écran ne
// sont jamais jetés ; au-delà de MAX_TILES, les plus anciens hors de l'écran partent d'abord. Vue de toute l'île :
// une seule image basse résolution (la vue d'ensemble), qui sert aussi en attendant un carré pas encore prêt.
// veilOf(x, y) : voile de brume d'une case (0 si son quartier est à soi)
export class TerrainCache {
  constructor(M, veilOf) {
    this.M = M;
    this.veilOf = veilOf;
    this.tiles = new Map();
    this.overview = null;
    const n = M.n;
    // Rectangle du monde où il y a du sol (au-delà, la mer)
    this.bounds = { x: (-n * TW) / 2 - TW, y: -CELL_ABOVE_MAX, w: n * TW + 2 * TW, h: n * TH + CELL_ABOVE_MAX + CELL_BELOW };
  }

  // Peint les cases qui touchent un rectangle du monde, dans l'ordre du relief (diagonale après diagonale, de gauche
  // à droite) ; le canvas ou la découpe coupe ce qui dépasse. Renvoie le nombre de cases peintes
  paint(ctx, r) {
    const M = this.M, n = M.n;
    // Centre d'une case : ((x - y) · TW/2, (x + y) · TH/2) ; d = x + y, u = x - y
    // (cases qui touchent le rectangle sur plus qu'un bord)
    const umin = Math.floor(((r.x - TW / 2 - 2) * 2) / TW) + 1, umax = Math.ceil(((r.x + r.w + TW / 2 + 2) * 2) / TW) - 1;
    const dmin = Math.max(0, Math.floor(((r.y - CELL_BELOW) * 2) / TH) + 1), dmax = Math.min(2 * n - 2, Math.ceil(((r.y + r.h + CELL_ABOVE_MAX) * 2) / TH) - 1);
    let count = 0;
    for (let d = dmin; d <= dmax; d++) {
      const xa = Math.max(0, d - n + 1, Math.ceil((d + umin) / 2)), xb = Math.min(n - 1, d, Math.floor((d + umax) / 2));
      for (let x = xa; x <= xb; x++) {
        const y = d - x;
        if (!M.land(x, y) && M.ground(x, y) !== 'b') continue;
        if ((d * TH) / 2 - cellAbove(M.height(x, y)) >= r.y + r.h || (d * TH) / 2 + CELL_BELOW <= r.y) continue;
        drawCell(ctx, M, x, y, this.veilOf(x, y));
        count++;
      }
    }
    return count;
  }

  // Un carré : sa case de la grille à cette résolution, avec une marge de PAD_PX pixels qui recouvre ses voisins
  // (aucune couture entre deux carrés). Un carré de pleine mer ne garde pas d'image
  render(tx, ty, res) {
    const size = TILE_PX / res, pad = PAD_PX / res;
    const r = { x: tx * size - pad, y: ty * size - pad, w: size + 2 * pad, h: size + 2 * pad };
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = TILE_PX + 2 * PAD_PX;
    const ctx = canvas.getContext('2d');
    ctx.setTransform(res, 0, 0, res, -r.x * res, -r.y * res);
    if (this.paint(ctx, r)) return { canvas, r };
    canvas.width = canvas.height = 0;
    return { canvas: null, r };
  }

  // Toute l'île en basse résolution
  overviewOf() {
    if (this.overview) return this.overview;
    const b = this.bounds;
    const canvas = document.createElement('canvas');
    canvas.width = Math.ceil(b.w * OVERVIEW_RES);
    canvas.height = Math.ceil(b.h * OVERVIEW_RES);
    const ctx = canvas.getContext('2d');
    ctx.setTransform(OVERVIEW_RES, 0, 0, OVERVIEW_RES, -b.x * OVERVIEW_RES, -b.y * OVERVIEW_RES);
    this.paint(ctx, b);
    this.overview = { canvas, ctx };
    return this.overview;
  }

  // Dessine le sol visible (view : rectangle du monde, scale : pixels par unité du monde). Les carrés manquants sont
  // préparés tant qu'il reste du temps (budget en ms, au moins un par image ; tous d'un coup à l'arrivée sur l'île),
  // puis, tout étant prêt, un voisin de l'écran d'avance. Renvoie le nombre de carrés encore à préparer
  draw(ctx, view, scale, budget = 8) {
    const res = resOf(scale);
    const b = this.bounds;
    if (res <= OVERVIEW_RES) {
      ctx.drawImage(this.overviewOf().canvas, b.x, b.y, b.w, b.h);
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
        const key = `${res}:${tx},${ty}`;
        seen.add(key);
        let tile = this.tiles.get(key);
        if ((!tile || tile.stale) && (all || !rendered || performance.now() - start < budget)) {
          if (tile && tile.canvas) tile.canvas.width = tile.canvas.height = 0;
          tile = this.render(tx, ty, res);
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
    if (!missing && this.tiles.size < MAX_TILES && performance.now() - start < budget) this.ahead(res, x0 - 1, y0 - 1, x1 + 1, y1 + 1);
    for (const [key, tile] of this.tiles) {
      if (this.tiles.size <= MAX_TILES) break;
      if (seen.has(key)) continue;
      if (tile.canvas) tile.canvas.width = tile.canvas.height = 0;
      this.tiles.delete(key);
    }
    return missing;
  }

  // Un carré pas encore prêt autour de l'écran (sur l'île), préparé d'avance
  ahead(res, x0, y0, x1, y1) {
    const size = TILE_PX / res, b = this.bounds;
    for (let ty = y0; ty <= y1; ty++) {
      for (let tx = x0; tx <= x1; tx++) {
        const key = `${res}:${tx},${ty}`;
        if (this.tiles.has(key) || (tx + 1) * size < b.x || tx * size > b.x + b.w || (ty + 1) * size < b.y || ty * size > b.y + b.h) continue;
        this.tiles.set(key, this.render(tx, ty, res));
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
  invalidate(cells) {
    if (!cells.length) return;
    const r = cellsBox(this.M, cells);
    for (const tile of this.tiles.values()) {
      const t = tile.r;
      if (t.x < r.x + r.w && t.x + t.w > r.x && t.y < r.y + r.h && t.y + t.h > r.y) tile.stale = true;
    }
    if (this.overview) {
      const { ctx } = this.overview;
      ctx.save();
      ctx.beginPath();
      ctx.rect(r.x, r.y, r.w, r.h);
      ctx.clip();
      ctx.clearRect(r.x, r.y, r.w, r.h);
      this.paint(ctx, r);
      ctx.restore();
    }
  }

  // Libère toutes les images (sortie de l'île)
  clear() {
    for (const tile of this.tiles.values()) if (tile.canvas) tile.canvas.width = tile.canvas.height = 0;
    this.tiles.clear();
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
    y0 = Math.min(y0, c.y - cellAbove(M.height(x, y)));
    y1 = Math.max(y1, c.y + CELL_BELOW);
  }
  return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
}

// Ce qui bouge sur le sol, précalculé une fois par île : cases d'eau douce, faces de cascade, bords de mer
export function liveOf(M) {
  const water = [], falls = [], shore = [];
  for (let y = 0; y < M.n; y++) {
    for (let x = 0; x < M.n; x++) {
      const g = M.ground(x, y);
      if (g === 'w') {
        water.push({ x, y });
        const top = M.surface(x, y);
        for (const [dx, dy, side] of [[0, 1, 0], [1, 0, 1]]) {
          const ng = M.ground(x + dx, y + dy);
          if ((ng === 'w' || ng === 'k') && M.surface(x + dx, y + dy) < top - 0.5) falls.push({ x, y, side, drop: (top - M.surface(x + dx, y + dy)) * HS });
        }
      }
      if (M.land(x, y)) {
        for (const [dx, dy, side] of [[0, 1, 0], [1, 0, 1]]) if (M.ground(x + dx, y + dy) === '~') shore.push({ x, y, side });
      }
    }
  }
  return { water, falls, shore };
}

// Animation de l'eau sur les cases visibles : reflets qui glissent, cascades qui tombent, écume au pied des falaises
export function drawLive(ctx, M, live, view, t) {
  const seen = c => c.x > view.x - TW && c.x < view.x + view.w + TW && c.y > view.y - TW * 2 && c.y < view.y + view.h + TW;
  ctx.lineCap = 'round';
  for (const cell of live.water) {
    const c = worldOf(cell.x, cell.y, M.surface(cell.x, cell.y));
    if (!seen(c)) continue;
    const k = (t * 0.35 + rnd(cell.x, cell.y) ) % 1;
    ctx.strokeStyle = `rgba(255, 255, 255, ${(0.45 * Math.sin(k * Math.PI)).toFixed(3)})`;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(c.x - 10 + k * 8, c.y - 3 + k * 4);
    ctx.quadraticCurveTo(c.x - 2 + k * 8, c.y - 6 + k * 4, c.x + 6 + k * 8, c.y - 3 + k * 4);
    ctx.stroke();
  }
  for (const f of live.falls) {
    const c = worldOf(f.x, f.y, M.surface(f.x, f.y));
    if (!seen(c)) continue;
    const [x0, y0, x1, y1] = f.side ? [c.x, c.y + TH / 2, c.x + TW / 2, c.y] : [c.x - TW / 2, c.y, c.x, c.y + TH / 2];
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.lineTo(x1, y1 + f.drop); ctx.lineTo(x0, y0 + f.drop);
    ctx.closePath();
    ctx.clip();
    ctx.strokeStyle = 'rgba(255, 255, 255, .7)';
    ctx.lineWidth = 2;
    for (let k = 0; k < 6; k++) {
      const u = (k + 0.5) / 6;
      const sx = x0 + (x1 - x0) * u, sy = y0 + (y1 - y0) * u;
      const off = ((t * 60 + k * 17) % (f.drop + 12)) - 12;
      ctx.beginPath();
      ctx.moveTo(sx, sy + off);
      ctx.lineTo(sx, sy + off + 9);
      ctx.stroke();
    }
    ctx.restore();
    // Écume au pied de la cascade
    const fx = (x0 + x1) / 2, fy = (y0 + y1) / 2 + f.drop;
    ctx.fillStyle = `rgba(255, 255, 255, ${(0.55 + 0.25 * Math.sin(t * 6 + f.x)).toFixed(3)})`;
    ctx.beginPath();
    ctx.ellipse(fx, fy, 11, 4.5, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  const foam = 0.32 + 0.22 * Math.sin(t * 1.6);
  ctx.strokeStyle = `rgba(255, 255, 255, ${foam.toFixed(3)})`;
  ctx.lineWidth = 2.6;
  for (const s of live.shore) {
    const c = worldOf(s.x, s.y, SEA_Z);
    if (!seen(c)) continue;
    const [x0, y0, x1, y1] = s.side ? [c.x, c.y + TH / 2, c.x + TW / 2, c.y] : [c.x - TW / 2, c.y, c.x, c.y + TH / 2];
    ctx.beginPath();
    ctx.moveTo(x0, y0 + 1.5 + Math.sin(t * 2 + x0 * 0.05) * 1.2);
    ctx.lineTo(x1, y1 + 1.5 + Math.sin(t * 2 + x1 * 0.05) * 1.2);
    ctx.stroke();
  }
}

