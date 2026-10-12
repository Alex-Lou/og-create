// L'averse sur l'île : une pluie qui vit (elle respire par rafales), des ronds sur l'eau (rivières, mares, mer proche,
// flaques), un sol qui se mouille (des flaques qui brillent, grandissent, puis sèchent après la pluie). Elle s'adapte
// à l'appareil (moins de gouttes quand il peine) et au zoom (fine et dense de loin, grosses gouttes de près). Tout se
// déduit du temps ; seuls la qualité (rainQuality) et le mouillé (wetnessAt, recalculé une fois par minute) se gardent.
import { hash } from '../scene';
import { worldOf, TW, TH, SEA_Z } from '../terrain';

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

// Rafales : la pluie ressentie à l'instant t (0 à 1), sa force qui ondule lentement (deux houles de 23 s et 37 s) ;
// rien sans pluie ; constante en mouvement réduit (t = 0)
export function gustOf(t) {
  return 0.5 + 0.3 * Math.sin(t * 0.27) + 0.2 * Math.sin(t * 0.17 + 1.3);
}
export function rainFelt(rain, t) {
  if (rain <= 0.02) return 0;
  return rain * (0.55 + 0.45 * gustOf(t));
}
// Pente des gouttes : le vent penche davantage la pluie dans une rafale
export const slantOf = t => 0.16 + 0.16 * gustOf(t);

// Le mouillé du sol (0 à 1) à une date : la pluie des trois dernières heures, la plus récente comptant le plus. Il
// monte en quelques minutes d'averse, sèche en une heure environ après. rainAt(date) : la pluie à une date (0 à 1)
const STEP_MIN = 10;
const SAMPLES = 19;
export function wetnessAt(date, rainAt) {
  let sum = 0;
  for (let i = 0; i < SAMPLES; i++) sum += rainAt(new Date(date.getTime() - i * STEP_MIN * 60000)) * (1 - i / (SAMPLES - 1));
  return clamp(sum * 0.35);
}

// Qualité de la pluie selon l'appareil (0,35 à 1) : elle baisse vite quand une image coûte trop, remonte doucement
export function rainQuality(q, ms) {
  if (ms > 26) return Math.max(0.35, q - 0.05);
  if (ms < 14) return Math.min(1, q + 0.02);
  return q;
}

// La pluie selon le zoom : de loin, plus de gouttes, fines et courtes ; de près, moins, plus longues et plus lentes
export function zoomOfRain(s) {
  const z = clamp(s, 0.4, 2);
  return { count: clamp(1.35 - 0.45 * z, 0.5, 1.2), len: clamp(0.55 + 0.45 * z, 0.7, 1.45), width: 0.8 + 0.2 * z, speed: clamp(1.12 - 0.12 * z, 0.88, 1.1) };
}

// Les flaques possibles d'une île, une fois : sur les chemins et l'herbe à plat (même hauteur que leurs voisines),
// clairsemées ; { x, y, cx, cy, r, s } (centre dans le monde, rayon, graine)
export function puddlesOf(M) {
  const out = [];
  for (let y = 0; y < M.n; y++) {
    for (let x = 0; x < M.n; x++) {
      const g = M.ground(x, y);
      if (g !== 'p' && g !== 'g') continue;
      const h = M.height(x, y);
      if ([[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => !M.land(x + dx, y + dy) || M.height(x + dx, y + dy) !== h)) continue;
      const s = hash(x * 1.7, y * 2.3);
      if (s > (g === 'p' ? 0.16 : 0.05)) continue;
      const c = worldOf(x + (hash(y, x) - 0.5) * 0.4, y + (hash(x, y * 3) - 0.5) * 0.4, M.surface(x, y));
      out.push({ x, y, cx: c.x, cy: c.y, r: 7 + hash(x * 3, y) * 7, s });
    }
  }
  return out;
}

const seen = (view, x, y, m = TW) => x > view.x - m && x < view.x + view.w + m && y > view.y - m && y < view.y + view.h + m;

// Les flaques (dans le monde, avant ce qui se tient debout) : une auréole de sol mouillé, l'eau qui reflète le ciel, un
// éclat. wet : le mouillé (0 à 1) ; elles grandissent avec lui, et sèchent en rapetissant. shown(p) : la case de la
// flaque est-elle à découvert (pas sous la brume) ?
export function drawPuddles(ctx, puddles, view, wet, shown = () => true) {
  if (wet < 0.04) return;
  ctx.save();
  for (const p of puddles) {
    if (!seen(view, p.cx, p.cy) || !shown(p)) continue;
    // (les plus petites sèchent les premières)
    const k = clamp((wet - p.s * 1.5) / 0.6);
    if (k <= 0.02) continue;
    const r = p.r * (0.45 + 0.55 * k);
    ctx.fillStyle = `rgba(58,62,78,${(0.16 * k).toFixed(3)})`;
    ctx.beginPath();
    ctx.ellipse(p.cx, p.cy, r * 1.35, r * 0.62, 0, 0, Math.PI * 2);
    ctx.fill();
    const g = ctx.createLinearGradient(p.cx, p.cy - r * 0.45, p.cx, p.cy + r * 0.45);
    g.addColorStop(0, `rgba(196,212,232,${(0.62 * k).toFixed(3)})`);
    g.addColorStop(1, `rgba(120,140,170,${(0.5 * k).toFixed(3)})`);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(p.cx, p.cy, r, r * 0.45, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = `rgba(255,255,255,${(0.5 * k).toFixed(3)})`;
    ctx.beginPath();
    ctx.ellipse(p.cx - r * 0.35, p.cy - r * 0.12, r * 0.28, r * 0.07, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

// Les ronds de la pluie sur l'eau (dans le monde) : chaque goutte ouvre un anneau qui s'efface. spots : [{ cx, cy, w }]
// (centre, demi-largeur de la surface), k : la pluie ressentie, q : la qualité, wet : le mouillé (une flaque n'a ses
// ronds qu'une fois formée). Trois tracés (selon l'âge du rond)
const RING_S = 0.9;
export function drawRipples(ctx, spots, view, t, k, q = 1, wet = 1, shown = () => true) {
  if (k <= 0.03 || !spots.length) return;
  const per = Math.max(1, Math.round(3 * k * q));
  const paths = [new Path2D(), new Path2D(), new Path2D()];
  for (const [i, sp] of spots.entries()) {
    if (!seen(view, sp.cx, sp.cy) || (sp.puddle && (wet < 0.3 + sp.puddle.s * 1.5 || !shown(sp.puddle)))) continue;
    for (let j = 0; j < per; j++) {
      const period = RING_S * (1 + hash(i, j * 7 + 1) * 0.6);
      const phase = t / period + hash(i * 3 + j, 2);
      const age = phase % 1;
      const cyc = Math.floor(phase);
      const x = sp.cx + (hash(i + cyc, j + 5) - 0.5) * sp.w * 1.6;
      const y = sp.cy + (hash(j + cyc, i + 9) - 0.5) * sp.w * 0.6;
      const r = 1 + age * 6;
      const path = paths[Math.min(2, Math.floor(age * 3))];
      path.moveTo(x + r, y);
      path.ellipse(x, y, r, r * 0.42, 0, 0, Math.PI * 2);
    }
  }
  ctx.save();
  ctx.lineWidth = 0.8;
  for (const [n, a] of [[0, 0.55], [1, 0.32], [2, 0.14]]) {
    ctx.strokeStyle = `rgba(235,244,255,${(a * Math.min(1, k * 1.3)).toFixed(3)})`;
    ctx.stroke(paths[n]);
  }
  ctx.restore();
}

// Où la pluie fait des ronds : l'eau douce (cells : eauDouce.js, { x, y, z }), la mer la plus proche de la côte
// (shallow : sea.js, le premier rang) et les flaques ; une fois par île
export function rippleSpotsOf(fresh, shallow, puddles) {
  const out = [];
  for (const c of fresh) {
    const p = worldOf(c.x, c.y, c.z);
    out.push({ cx: p.x, cy: p.y, w: TW * 0.3 });
  }
  for (const c of shallow || []) {
    const p = worldOf(c.x, c.y, SEA_Z);
    out.push({ cx: p.x, cy: p.y, w: TH * 0.6 });
  }
  for (const p of puddles) out.push({ cx: p.cx, cy: p.cy, w: p.r * 0.5, puddle: p });
  return out;
}
