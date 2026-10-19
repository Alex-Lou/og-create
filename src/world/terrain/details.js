// Les détails peints sur le dessus d'une case : un sol qui déborde sur son voisin, brins d'herbe, fleurs, litière de la
// jungle, berges de l'eau douce, sable mouillé.
import { mixHex } from '../iso';
import { TW, TH, diamond } from './geo';
import { rnd, vnoise, paintColor, RANK, familyOf } from './paint';

// Les quatre bords d'une case : la voisine, et ses deux coins à l'écran (sens de la case vers la voisine)
const EDGES = [[1, 0, 'right', 'bottom'], [-1, 0, 'top', 'left'], [0, 1, 'left', 'bottom'], [0, -1, 'top', 'right']];

const cornerOf = (c, k) => (k === 'top' ? [c.x, c.y - TH / 2] : k === 'right' ? [c.x + TW / 2, c.y] : k === 'bottom' ? [c.x, c.y + TH / 2] : [c.x - TW / 2, c.y]);

// Bord festonné : le sol de la voisine déborde sur la case en vagues irrégulières, avec un liseré d'ombre (léger relief)
function spill(ctx, M, x, y, c, top) {
  const g = M.ground(x, y);
  for (const [dx, dy, ka, kb] of EDGES) {
    const nx = x + dx, ny = y + dy;
    if (!M.land(nx, ny)) continue;
    const ng = M.ground(nx, ny);
    if (RANK[ng] === undefined || RANK[g] === undefined || familyOf(ng) === familyOf(g) || RANK[ng] <= RANK[g]) continue;
    if (Math.abs(M.surface(nx, ny) - top) > 0.01) continue;
    const A = cornerOf(c, ka), B = cornerOf(c, kb);
    const ix = c.x - (A[0] + B[0]) / 2, iy = c.y - (A[1] + B[1]) / 2;
    const L = Math.hypot(ix, iy) || 1;
    const seed = (x + nx) * 31 + (y + ny) * 17;
    const pts = [];
    const N = 9;
    for (let i = 0; i <= N; i++) {
      const t = i / N;
      const ends = Math.sin(Math.PI * t);
      const depth = (3 + 5 * rnd(seed, i, 3) + 3 * Math.sin(t * Math.PI * 3 + rnd(seed, 0, 4) * 6)) * (0.35 + 0.65 * ends);
      pts.push([A[0] + (B[0] - A[0]) * t + (ix / L) * depth, A[1] + (B[1] - A[1]) * t + (iy / L) * depth]);
    }
    ctx.save();
    diamond(ctx, c.x, c.y);
    ctx.clip();
    ctx.beginPath();
    ctx.moveTo(...A);
    pts.forEach(p => ctx.lineTo(...p));
    ctx.lineTo(...B);
    ctx.closePath();
    ctx.fillStyle = paintColor(ng, M.height(nx, ny), (x + nx) / 2, (y + ny) / 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(...pts[0]);
    pts.slice(1).forEach(p => ctx.lineTo(...p));
    ctx.strokeStyle = RANK[ng] === 4 ? 'rgba(40, 70, 25, .32)' : 'rgba(60, 45, 30, .22)';
    ctx.lineWidth = 1.2;
    ctx.stroke();
    ctx.restore();
  }
}

// Teintes des brins d'une herbe (sombre, claire, trèfle, olive), gardées par teinte d'herbe (l'herbe variant d'une case à
// l'autre, la réserve est vidée quand elle déborde)
const blades = new Map();

function bladeColors(base) {
  let out = blades.get(base);
  if (!out) {
    if (blades.size > 4096) blades.clear();
    out = [mixHex(base, '#1F3A18', 0.2), mixHex(base, '#F0F8C8', 0.3), mixHex(base, '#2F6B2A', 0.45), mixHex(base, '#5E5A2E', 0.3)];
    blades.set(base, out);
  }
  return out;
}

// Les fleurs des champs (choix de l'auteur, 12 oct. : « rares, dessinées, en massifs ») : elles ne poussent qu'en
// nappes (un bruit lent, de moyenne ½ : bloom est le seuil ; 0,44 : la prairie fleurit sur la moitié, 0,76 :
// une case d'herbe sur quinze environ), chaque nappe
// d'une espèce, quelques intruses ; chaque fleur dessinée : une ombre, une tige, et sa tête vue de trois quarts.
// Palette retenue : marguerite crème, lavande pâle, bouton d'or éteint. Vrai si la case en porte.
const FLOWERS = [
  // marguerite : cinq pétales crème (les deux du bas un peu ombrés), cœur doré
  (ctx, x, y) => {
    for (let k = 0; k < 5; k++) {
      const a = (k / 5) * Math.PI * 2 - Math.PI / 2;
      ctx.fillStyle = Math.sin(a) > 0.3 ? '#DCD5C0' : '#F4EFDF';
      ctx.beginPath(); ctx.ellipse(x + Math.cos(a) * 1.25, y + Math.sin(a) * 0.8, 1.1, 0.75, a, 0, Math.PI * 2); ctx.fill();
    }
    ctx.fillStyle = '#D6A43E'; ctx.beginPath(); ctx.ellipse(x, y, 0.85, 0.65, 0, 0, Math.PI * 2); ctx.fill();
  },
  // lavande : un épi de trois grains, du plus soutenu au plus pâle
  (ctx, x, y) => {
    [['#9C8CC6', 1.5, 1.05], ['#AE9FD3', 0, 0.95], ['#C2B7E0', -1.4, 0.8]].forEach(([col, dy, r]) => {
      ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(x, y + dy, r * 0.8, r, 0, 0, Math.PI * 2); ctx.fill();
    });
  },
  // bouton d'or : une coupe, son fond ombré, un reflet
  (ctx, x, y) => {
    ctx.fillStyle = '#B9963A'; ctx.beginPath(); ctx.ellipse(x, y + 0.3, 1.7, 1.25, 0, 0, Math.PI); ctx.fill();
    ctx.fillStyle = '#E2C460'; ctx.beginPath(); ctx.ellipse(x, y, 1.7, 0.9, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#F2E19A'; ctx.beginPath(); ctx.ellipse(x - 0.5, y - 0.2, 0.7, 0.4, 0, 0, Math.PI * 2); ctx.fill();
  }
];

function flowerBed(ctx, x, y, c, base, bloom) {
  const d = vnoise(x * 0.21 + 41, y * 0.21 + 23, 97);
  if (d < bloom) return false;
  const rich = Math.min(1, (d - bloom) / 0.15);
  // (la nappe s'éclaircit vers ses bords : des cases sans fleur, puis de petites touffes, plus fournies au cœur)
  if (rnd(x, y, 190) > 0.15 + rich * 0.6) return false;
  const count = 2 + Math.floor(rich * 4 * rnd(x, y, 191) + rich);
  const kind = Math.floor(vnoise(x * 0.09 + 7, y * 0.09 + 61, 98) * 2.999);
  const stem = bladeColors(base)[0];
  // (une touffe par case, serrée autour d'un point ; de l'arrière à l'avant : une fleur devant recouvre celle de derrière)
  const u0 = (rnd(x, y, 192) - 0.5) * 0.5, v0 = (rnd(x, y, 193) - 0.5) * 0.5;
  const spots = [];
  for (let k = 0; k < count; k++) {
    const u = u0 + (rnd(x, y, k + 200) - 0.5) * 0.34, v = v0 + (rnd(x, y, k + 210) - 0.5) * 0.34;
    spots.push([c.x + (u - v) * TW * 0.5, c.y + (u + v) * TH * 0.5, k]);
  }
  spots.sort((a, b) => a[1] - b[1]);
  ctx.lineCap = 'round';
  for (const [px, py, k] of spots) {
    const tall = 3 + rnd(x, y, k + 220) * 2.2, lean = (rnd(x, y, k + 230) - 0.5) * 1.6;
    ctx.fillStyle = 'rgba(28, 58, 40, .2)';
    ctx.beginPath(); ctx.ellipse(px + 0.8, py + 0.2, 1.9, 0.65, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = stem; ctx.lineWidth = 0.85;
    ctx.beginPath(); ctx.moveTo(px, py); ctx.quadraticCurveTo(px, py - tall * 0.6, px + lean, py - tall); ctx.stroke();
    const own = rnd(x, y, k + 240) < 0.85 ? kind : (kind + 1 + Math.floor(rnd(x, y, k + 250) * 2)) % 3;
    FLOWERS[own](ctx, px + lean, py - tall - 0.6);
  }
  return true;
}

// Semis de l'herbe : touffes à trois brins (vert sombre ou olive, un brin clair), parfois trèfle, fleurettes, caillou ;
// groupées par endroits, et quelques touffes isolées ailleurs
function grassSeed(ctx, x, y, c, base, bloom = 0.76) {
  // (discrètes : des brins à peine plus sombres que l'herbe, de deux tons)
  const dense = vnoise(x * 0.5 + 11, y * 0.5 + 5, 93);
  const count = dense < 0.36 ? (rnd(x, y, 170) < 0.3 ? 1 : 0) : 1 + Math.floor((dense - 0.36) * 7);
  const [deep, light, , olive] = bladeColors(base);
  ctx.lineCap = 'round';
  for (let k = 0; k < count; k++) {
    const u = rnd(x, y, k + 100) - 0.5, v = rnd(x, y, k + 120) - 0.5;
    const px = c.x + (u - v) * TW * 0.42, py = c.y + (u + v) * TH * 0.42;
    const s = 0.6 + rnd(x, y, k + 140) * 0.4;
    ctx.strokeStyle = rnd(x, y, k + 180) < 0.35 ? olive : deep;
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    ctx.moveTo(px - 2 * s, py); ctx.quadraticCurveTo(px - 2.5 * s, py - 3 * s, px - 3.5 * s, py - 5 * s);
    ctx.moveTo(px, py); ctx.quadraticCurveTo(px, py - 4 * s, px + 0.5 * s, py - 6.5 * s);
    ctx.moveTo(px + 2 * s, py); ctx.quadraticCurveTo(px + 2.5 * s, py - 3 * s, px + 3.8 * s, py - 4.5 * s);
    ctx.stroke();
    ctx.strokeStyle = light;
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(px, py - 3 * s); ctx.quadraticCurveTo(px, py - 5 * s, px + 0.5 * s, py - 6.5 * s);
    ctx.stroke();
  }
  const r = rnd(x, y, 160);
  // (quelques fleurs, seulement là où la prairie fleurit en nappes : flowerBed)
  if (flowerBed(ctx, x, y, c, base, bloom)) return;
  if (r < 0.08) {
    // trèfle : trois petites feuilles rondes
    const px = c.x + (rnd(x, y, 164) - 0.5) * 24, py = c.y + (rnd(x, y, 165) - 0.5) * 9;
    ctx.fillStyle = bladeColors(base)[2];
    [[-1.4, 0], [1.4, 0], [0, -1.6]].forEach(([ox, oy]) => { ctx.beginPath(); ctx.arc(px + ox, py + oy, 1.6, 0, Math.PI * 2); ctx.fill(); });
  } else if (r < 0.24) {
    // caillou : un galet gris, clair dessus
    const px = c.x + (rnd(x, y, 166) - 0.5) * 24, py = c.y + (rnd(x, y, 167) - 0.5) * 9;
    ctx.fillStyle = '#8F887C'; ctx.beginPath(); ctx.ellipse(px, py, 2.6, 1.6, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#C9C2B4'; ctx.beginPath(); ctx.ellipse(px - 0.5, py - 0.6, 1.5, 0.8, 0, 0, Math.PI * 2); ctx.fill();
  }
}

// Le semis de la jungle du départ, à la place des brins et des fleurs (choix de l'auteur, 18 oct.) : des feuilles
// tombées (émeraude, sarcelle, vert acide, rarement un pétale magenta), leur nervure claire, parfois un brin de
// fougère, des points de mousse
const LITTER = ['#0B5A46', '#1C9A6A', '#0E6E6C', '#8CCB34', '#0B5A46', '#E2348E'];

function jungleSeed(ctx, x, y, c) {
  const count = 2 + Math.floor(rnd(x, y, 300) * 3);
  for (let k = 0; k < count; k++) {
    const u = rnd(x, y, k + 310) - 0.5, v = rnd(x, y, k + 320) - 0.5;
    const px = c.x + (u - v) * TW * 0.44, py = c.y + (u + v) * TH * 0.44, a = rnd(x, y, k + 330) * Math.PI;
    const tone = LITTER[Math.floor(rnd(x, y, k + 340) * (rnd(x, y, k + 350) < 0.15 ? LITTER.length : LITTER.length - 1))];
    const L = 2.6 + rnd(x, y, k + 360) * 1.6;
    ctx.fillStyle = 'rgba(6, 30, 26, .28)';
    ctx.beginPath(); ctx.ellipse(px + 0.8, py + 0.6, L, L * 0.42, a, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = tone;
    ctx.beginPath(); ctx.ellipse(px, py, L, L * 0.42, a, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(220, 255, 200, .45)';
    ctx.lineWidth = 0.5;
    ctx.beginPath(); ctx.moveTo(px - Math.cos(a) * L * 0.8, py - Math.sin(a) * L * 0.8); ctx.lineTo(px + Math.cos(a) * L * 0.8, py + Math.sin(a) * L * 0.8); ctx.stroke();
  }
  const r = rnd(x, y, 370);
  if (r < 0.3) {
    // un brin de fougère : une nervure, ses folioles
    const px = c.x + (rnd(x, y, 371) - 0.5) * 22, py = c.y + (rnd(x, y, 372) - 0.5) * 8;
    ctx.strokeStyle = '#1FA070';
    ctx.lineWidth = 0.9;
    ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(px, py); ctx.quadraticCurveTo(px + 1, py - 4, px + 3.5, py - 6.5);
    for (let i = 1; i <= 4; i++) { const qx = px + i * 0.8, qy = py - i * 1.5; ctx.moveTo(qx, qy); ctx.lineTo(qx - 2, qy - 0.8); ctx.moveTo(qx, qy); ctx.lineTo(qx + 1.8, qy + 0.4); }
    ctx.stroke();
  } else if (r < 0.55) {
    // des points de mousse claire
    ctx.fillStyle = 'rgba(170, 240, 120, .55)';
    for (let k = 0; k < 4; k++) ctx.fillRect(c.x - 12 + rnd(x, y, k + 380) * 24, c.y - 4 + rnd(x, y, k + 390) * 8, 1.4, 1.4);
  }
}

// Eau douce : claire et turquoise le long des berges (le milieu paraît plus profond), un liseré lumineux au bord
function waterBanks(ctx, M, x, y, c) {
  for (const [dx, dy, ka, kb] of EDGES) {
    const ng = M.ground(x + dx, y + dy);
    if (ng === 'w' || ng === 'k' || ng === '~') continue;
    const A = cornerOf(c, ka), B = cornerOf(c, kb);
    const ix = c.x - (A[0] + B[0]) / 2, iy = c.y - (A[1] + B[1]) / 2;
    const L = Math.hypot(ix, iy) || 1;
    const w = 9;
    const mx = (A[0] + B[0]) / 2, my = (A[1] + B[1]) / 2;
    const g = ctx.createLinearGradient(mx, my, mx + (ix / L) * w, my + (iy / L) * w);
    g.addColorStop(0, 'rgba(170, 238, 236, .7)');
    g.addColorStop(1, 'rgba(170, 238, 236, 0)');
    ctx.save();
    diamond(ctx, c.x, c.y);
    ctx.clip();
    ctx.beginPath();
    ctx.moveTo(...A); ctx.lineTo(...B);
    ctx.lineTo(B[0] + (ix / L) * w, B[1] + (iy / L) * w); ctx.lineTo(A[0] + (ix / L) * w, A[1] + (iy / L) * w);
    ctx.closePath();
    ctx.fillStyle = g;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, .7)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(A[0] + (ix / L) * 1.2, A[1] + (iy / L) * 1.2); ctx.lineTo(B[0] + (ix / L) * 1.2, B[1] + (iy / L) * 1.2);
    ctx.stroke();
    ctx.restore();
  }
}

// Sable mouillé au bord de la mer : une bande plus sombre et luisante le long des bords qui touchent l'eau
function wetSand(ctx, M, x, y, c) {
  for (const [dx, dy, ka, kb] of EDGES) {
    if (M.land(x + dx, y + dy)) continue;
    if (dx < 0 || dy < 0) continue;
    const A = cornerOf(c, ka), B = cornerOf(c, kb);
    const ix = c.x - (A[0] + B[0]) / 2, iy = c.y - (A[1] + B[1]) / 2;
    const L = Math.hypot(ix, iy) || 1;
    const w = 7;
    const g = ctx.createLinearGradient((A[0] + B[0]) / 2, (A[1] + B[1]) / 2, (A[0] + B[0]) / 2 + (ix / L) * w, (A[1] + B[1]) / 2 + (iy / L) * w);
    g.addColorStop(0, 'rgba(150, 118, 70, .45)');
    g.addColorStop(0.7, 'rgba(170, 140, 90, .18)');
    g.addColorStop(1, 'rgba(170, 140, 90, 0)');
    ctx.save();
    diamond(ctx, c.x, c.y);
    ctx.clip();
    ctx.beginPath();
    ctx.moveTo(...A); ctx.lineTo(...B);
    ctx.lineTo(B[0] + (ix / L) * w, B[1] + (iy / L) * w); ctx.lineTo(A[0] + (ix / L) * w, A[1] + (iy / L) * w);
    ctx.closePath();
    ctx.fillStyle = g;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, .45)';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(A[0] + (ix / L) * 2.2, A[1] + (iy / L) * 2.2); ctx.lineTo(B[0] + (ix / L) * 2.2, B[1] + (iy / L) * 2.2);
    ctx.stroke();
    ctx.restore();
  }
}

export { spill, grassSeed, jungleSeed, waterBanks, wetSand };
