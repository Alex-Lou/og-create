// Le sol de la grande île en relief (Canvas 2D, unités du monde) : chaque case a un sol (herbe, sable, prairie,
// forêt, roche, chemin, eau…) et une hauteur de 0 à 3 ; ses faces avant (vers +x et +y) descendent jusqu'au voisin,
// ou jusqu'à la mer. Le sol est préparé par blocs de 8 × 8 cases, gardés en images (TerrainCache) : seuls les blocs
// visibles sont dessinés, deux nouveaux au plus par image (le reste vient d'une vue d'ensemble basse résolution).
// L'eau (reflets, cascades) et l'écume sont animées par-dessus, case par case visible.

export const TW = 64;
export const TH = TW / 2;
// Hauteur d'un palier de relief, et niveau de la mer (en paliers, sous la terre la plus basse)
export const HS = 22;
export const SEA_Z = -1.36;
const CHUNK = 8;
// Blocs gardés en images au plus (les plus anciens partent d'abord) ; résolution maximale d'un bloc
const MAX_CHUNKS = 12;
const MAX_RES = 2;
const OVERVIEW_RES = 0.3;

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

// Sol de l'île en blocs gardés en images. veilOf(x, y) : voile de brume d'une case (0 si son quartier est à soi)
export class TerrainCache {
  constructor(M, veilOf) {
    this.M = M;
    this.veilOf = veilOf;
    this.chunks = new Map();
    this.overview = null;
    this.span = Math.ceil(M.n / CHUNK);
  }

  // Rectangle du monde couvert par un bloc (cases du bloc, faces et relief compris)
  box(cx, cy) {
    const x0 = cx * CHUNK, y0 = cy * CHUNK, x1 = x0 + CHUNK - 1, y1 = y0 + CHUNK - 1;
    return {
      x: ((x0 - y1) * TW) / 2 - TW / 2 - 2,
      y: ((x0 + y0) * TH) / 2 - TH / 2 - 3 * HS - 4,
      w: ((x1 - x0 + y1 - y0) * TW) / 2 + TW + 4,
      h: ((x1 + y1 - x0 - y0) * TH) / 2 + TH + (3 - SEA_Z) * HS + HS * 1.6 + 8
    };
  }

  paint(ctx, x0, y0, x1, y1) {
    const M = this.M;
    for (let d = x0 + y0; d <= x1 + y1; d++) {
      for (let x = Math.max(x0, d - y1); x <= Math.min(x1, d - y0); x++) drawCell(ctx, M, x, d - x, this.veilOf(x, d - x));
    }
  }

  render(cx, cy, res) {
    const b = this.box(cx, cy);
    const canvas = document.createElement('canvas');
    canvas.width = Math.ceil(b.w * res);
    canvas.height = Math.ceil(b.h * res);
    const ctx = canvas.getContext('2d');
    ctx.setTransform(res, 0, 0, res, -b.x * res, -b.y * res);
    const n = this.M.n;
    this.paint(ctx, cx * CHUNK, cy * CHUNK, Math.min(n - 1, cx * CHUNK + CHUNK - 1), Math.min(n - 1, cy * CHUNK + CHUNK - 1));
    return { canvas, b, res };
  }

  // Vue d'ensemble de toute l'île en basse résolution : ce qu'on montre d'un bloc pas encore prêt
  overviewOf() {
    if (this.overview) return this.overview;
    const n = this.M.n;
    const b = { x: (-n * TW) / 2 - TW, y: -TH - 3 * HS - 4 };
    b.w = n * TW + 2 * TW;
    b.h = n * TH + TH * 2 + (3 - SEA_Z) * HS + HS * 2 + 8;
    const canvas = document.createElement('canvas');
    canvas.width = Math.ceil(b.w * OVERVIEW_RES);
    canvas.height = Math.ceil(b.h * OVERVIEW_RES);
    const ctx = canvas.getContext('2d');
    ctx.setTransform(OVERVIEW_RES, 0, 0, OVERVIEW_RES, -b.x * OVERVIEW_RES, -b.y * OVERVIEW_RES);
    this.paint(ctx, 0, 0, n - 1, n - 1);
    this.overview = { canvas, b };
    return this.overview;
  }

  // Dessine les blocs visibles (view : rectangle du monde) ; renvoie le nombre de blocs encore à préparer
  draw(ctx, view, scale, budget = 2) {
    const res = Math.min(MAX_RES, Math.pow(2, Math.ceil(Math.log2(Math.max(0.25, scale)))));
    const list = [];
    for (let cy = 0; cy < this.span; cy++) {
      for (let cx = 0; cx < this.span; cx++) {
        const b = this.box(cx, cy);
        if (b.x > view.x + view.w || b.x + b.w < view.x || b.y > view.y + view.h || b.y + b.h < view.y) continue;
        list.push({ cx, cy, b });
      }
    }
    list.sort((p, q) => p.cx + p.cy - (q.cx + q.cy) || p.cx - q.cx);
    let missing = 0;
    for (const { cx, cy, b } of list) {
      const key = `${cx},${cy},${res}`;
      let chunk = this.chunks.get(key);
      if (!chunk && budget > 0) {
        chunk = this.render(cx, cy, res);
        budget--;
      }
      if (chunk) {
        // Le plus récemment utilisé passe en dernier : les plus anciens partent d'abord
        this.chunks.delete(key);
        this.chunks.set(key, chunk);
        ctx.drawImage(chunk.canvas, b.x, b.y, b.w, b.h);
      } else {
        missing++;
        // Une autre résolution déjà prête, sinon la vue d'ensemble
        const other = [...this.chunks.entries()].find(([k]) => k.startsWith(`${cx},${cy},`));
        if (other) ctx.drawImage(other[1].canvas, b.x, b.y, b.w, b.h);
        else {
          const o = this.overviewOf();
          ctx.drawImage(o.canvas, (b.x - o.b.x) * OVERVIEW_RES, (b.y - o.b.y) * OVERVIEW_RES, b.w * OVERVIEW_RES, b.h * OVERVIEW_RES, b.x, b.y, b.w, b.h);
        }
      }
    }
    while (this.chunks.size > MAX_CHUNKS) {
      const [oldest, chunk] = this.chunks.entries().next().value;
      chunk.canvas.width = chunk.canvas.height = 0;
      this.chunks.delete(oldest);
    }
    return missing;
  }

  // Brume changée (quartier acheté) : tout est à refaire
  invalidate() {
    this.clear();
  }

  // Libère toutes les images (sortie de l'île)
  clear() {
    for (const chunk of this.chunks.values()) chunk.canvas.width = chunk.canvas.height = 0;
    this.chunks.clear();
    if (this.overview) this.overview.canvas.width = this.overview.canvas.height = 0;
    this.overview = null;
  }
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

