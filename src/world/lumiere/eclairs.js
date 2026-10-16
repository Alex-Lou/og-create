// Éclairs d'orage : tout se déduit du temps (même ciel pour un même instant). Un coup de foudre se joue en quatre
// temps : le traceur qui descend en quelques images, le coup de retour (le flash le plus fort), un à trois rallumages
// rapides, puis la rémanence qui s'éteint. Entre deux coups, des éclairs de chaleur lointains illuminent les nuages
// sans tracé. eclairAt donne l'état à l'instant t ; la lumière de la scène (flash, ombres dures, liseré blanc) s'en
// sert (carte.js, ombres.js, heureDoree.js), drawEclair dessine le tracé et sa lumière diffuse, dans le monde (la foudre
// frappe un point de l'île ou de la mer : impactOf) ; les gros
// coups illuminent l'île par paliers (eclat.js), le tonnerre suit (tonnerre.js).
import { hash } from '../scene';

const CYCLE = 6.4; // secondes : au plus un coup de foudre par cycle
export const LEADER = 0.07; // descente du traceur (le coup de retour suit)
const RETOUR = 0.05; // coup de retour

// Forme du flash d'un coup : [début, durée, force] du traceur, du retour et des rallumages, puis la rémanence
function strokesOf(cycle) {
  const n = 1 + Math.floor(hash(cycle, 13) * 3);
  const strokes = [[0, LEADER, 0.14], [LEADER, RETOUR, 1]];
  let at = LEADER + RETOUR + 0.08;
  for (let k = 0; k < n; k++) { strokes.push([at, 0.045, 0.75 - k * 0.15]); at += 0.1 + hash(cycle, 20 + k) * 0.12; }
  return { strokes, end: at };
}
// Le coup d'un cycle : son début (en secondes), son côté, s'il n'est qu'un éclair de chaleur lointain (un cycle sur
// trois environ : deux lueurs dans les nuages, sans tracé ni tonnerre), et s'il est gros (un coup de foudre sur dix :
// l'éclat en paliers, eclat.js)
export function coupOf(cycle) {
  return { start: cycle * CYCLE + hash(cycle, 3) * (CYCLE - 2), x: 0.12 + hash(cycle, 5) * 0.76, lointain: hash(cycle, 9) < 0.32, gros: hash(cycle, 29) < 0.1 };
}
export const cycleOf = t => Math.floor(t / CYCLE);

// État de l'orage à l'instant t : { flash (0..1, la scène blanchit), bolt (le tracé et son éclat) ou null, x (côté
// d'où vient la lumière, 0 gauche, 1 droite), lointain (éclair de chaleur, sans tracé), cycle (le coup : impactOf) }
export function eclairAt(t, storm) {
  if (storm < 0.5) return null;
  const cycle = cycleOf(t);
  const { start, x, lointain } = coupOf(cycle);
  const tau = t - start;
  if (tau < 0) return null;
  if (lointain) {
    if (tau > 0.7) return null;
    const pulse = tau < 0.18 ? Math.sin((tau / 0.18) * Math.PI) : tau > 0.3 && tau < 0.58 ? 0.6 * Math.sin(((tau - 0.3) / 0.28) * Math.PI) : 0;
    return pulse > 0.01 ? { flash: 0.32 * pulse * storm, bolt: null, x, lointain: true, cycle } : null;
  }
  return coupAt(tau, cycle, x, storm);
}
// Un coup de foudre (ni lointain ni de chaleur), tau secondes après son départ : son état (eclairAt), ou null une fois
// éteint
function coupAt(tau, cycle, x, storm) {
  const { strokes, end } = strokesOf(cycle);
  if (tau > end + 0.6) return null;
  let flash = 0;
  let glow = 0;
  for (const [s, d, f] of strokes) {
    if (tau >= s && tau < s + d) { flash = Math.max(flash, s === 0 ? f * (tau / d) : f); glow = Math.max(glow, s === 0 ? 0.55 : f); }
    else if (tau >= s + d && s > 0) { const after = tau - s - d; flash = Math.max(flash, f * Math.exp(-after / 0.09)); glow = Math.max(glow, f * Math.exp(-after / 0.06)); }
  }
  // rémanence : la scène garde une lueur qui retombe doucement
  if (tau > end) flash = Math.max(flash, 0.25 * Math.exp(-(tau - end) / 0.22));
  const grow = Math.min(1, tau / LEADER);
  return { flash: flash * storm, bolt: glow > 0.02 ? { cycle, grow, a: glow * storm } : null, x, lointain: false, cycle };
}
// Un coup de foudre imposé (la nuit du conseil, deux coups près du phare : WorldView, phare.js), tau secondes après son
// départ : l'état d'eclairAt, son point d'impact donné (at : { x, y } dans le monde ; drawEclair et l'éclat le prennent
// tel quel) ; cycle : sa forme (un nombre à part de ceux de l'orage) ; x : le côté d'où vient sa lumière. null éteint
export function foudreAt(tau, cycle, at, x) {
  if (tau < 0) return null;
  const coup = coupAt(tau, cycle, x, 1);
  return coup && { ...coup, at };
}

// Le liseré blanc que l'éclair pose sur les silhouettes tournées vers lui (lumiere/heureDoree.js : rimImage), le temps
// que sa lumière est assez forte pour durcir les ombres (ombres.js) : { side, alpha, color }, ou null
const BLANC = '#F2F5FF';
export function eclairRimOf(orage) {
  if (!orage || orage.flash <= 0.12) return null;
  return { side: orage.x < 0.5 ? -1 : 1, alpha: 0.75 * Math.min(1, orage.flash), color: BLANC };
}

// Tracé fractal d'un éclair (déplacement du milieu), en fractions de l'écran, mis en cache par cycle
const formes = new Map();
function zigzag(a, b, depth, seed, rough) {
  if (depth === 0) return [a, b];
  const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const m = [mx + (hash(seed, depth * 7) - 0.5) * len * rough, my + (hash(seed, depth * 11) - 0.5) * len * rough * 0.25];
  return [...zigzag(a, m, depth - 1, seed * 2 + 1, rough), ...zigzag(m, b, depth - 1, seed * 2 + 2, rough).slice(1)];
}
function formeOf(cycle) {
  let f = formes.get(cycle);
  if (f) return f;
  const x0 = 0.12 + hash(cycle, 5) * 0.76;
  const x1 = x0 + (hash(cycle, 6) - 0.5) * 0.22;
  const y1 = 0.42 + hash(cycle, 7) * 0.3;
  const main = zigzag([x0, -0.03], [x1, y1], 7, cycle * 31 + 1, 0.55);
  const branches = [];
  const nb = 3 + Math.floor(hash(cycle, 8) * 3);
  for (let k = 0; k < nb; k++) {
    const from = main[Math.floor((0.15 + hash(cycle, 40 + k) * 0.6) * (main.length - 1))];
    const side = hash(cycle, 50 + k) > 0.5 ? 1 : -1;
    const to = [from[0] + side * (0.06 + hash(cycle, 60 + k) * 0.12), from[1] + 0.06 + hash(cycle, 70 + k) * 0.16];
    branches.push(zigzag(from, to, 5, cycle * 97 + k, 0.6));
  }
  f = { main, branches, impact: [x1, y1] };
  formes.set(cycle, f);
  if (formes.size > 8) formes.delete(formes.keys().next().value);
  return f;
}

// Où frappe le coup d'un cycle, dans le monde : choisi une fois, au premier regard (view : le rectangle du monde à
// l'écran), du côté de l'éclair ; il ne bouge plus ensuite, même si la caméra glisse. Un éclair de chaleur lointain luit
// au-dessus de la vue, dans les nuages
const impacts = new Map();
export function impactOf(cycle, view, lointain = false) {
  let p = impacts.get(cycle);
  if (p) return p;
  const { x } = coupOf(cycle);
  p = { x: view.x + x * view.w, y: lointain ? view.y : view.y + view.h * (0.4 + 0.3 * hash(cycle, 7)) };
  impacts.set(cycle, p);
  if (impacts.size > 8) impacts.delete(impacts.keys().next().value);
  return p;
}
// La taille d'un éclair dans le monde (sa forme est tirée en fractions : formeOf)
const L = 1100;
const tracer = (ctx, pts, f, p, upto = 1) => {
  const n = Math.max(2, Math.ceil(pts.length * upto));
  const at = q => [p.x + (q[0] - f.impact[0]) * L, p.y + (q[1] - f.impact[1]) * L];
  ctx.beginPath();
  ctx.moveTo(...at(pts[0]));
  for (let i = 1; i < n; i++) ctx.lineTo(...at(pts[i]));
  ctx.stroke();
};
// Le tracé (halo bleuté large, puis plus serré, puis cœur blanc ; branches plus fines qui s'éteignent avant) et sa
// lumière diffuse : les nuages illuminés au-dessus du point d'impact, le halo autour de lui. Dans la transformation du
// monde ; view : le rectangle du monde à l'écran
export function drawEclair(ctx, view, e) {
  if (!e) return;
  const p = e.at || impactOf(e.cycle, view, e.lointain);
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  // nuages illuminés par en dessous, au-dessus du coup
  const cy = p.y - L * 0.55;
  const top = ctx.createRadialGradient(p.x, cy, 0, p.x, cy, L * (e.lointain ? 0.55 : 0.75));
  top.addColorStop(0, `rgba(205,214,255,${(0.55 * e.flash).toFixed(3)})`);
  top.addColorStop(1, 'rgba(205,214,255,0)');
  ctx.fillStyle = top;
  ctx.fillRect(view.x, view.y, view.w, view.h);
  if (e.bolt) {
    const f = formeOf(e.bolt.cycle);
    const a = e.bolt.a;
    // halo autour de l'impact
    const imp = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, L * 0.3);
    imp.addColorStop(0, `rgba(220,228,255,${(0.45 * a * e.bolt.grow).toFixed(3)})`);
    imp.addColorStop(1, 'rgba(220,228,255,0)');
    ctx.fillStyle = imp;
    ctx.fillRect(view.x, view.y, view.w, view.h);
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    const passes = [[16, `rgba(120,140,255,${(0.16 * a).toFixed(3)})`], [7, `rgba(170,185,255,${(0.35 * a).toFixed(3)})`], [2.4, `rgba(255,255,255,${Math.min(1, a).toFixed(3)})`]];
    for (const [lw, color] of passes) {
      ctx.strokeStyle = color;
      ctx.lineWidth = lw;
      tracer(ctx, f.main, f, p, e.bolt.grow);
      if (e.bolt.grow >= 1) {
        ctx.lineWidth = lw * 0.5;
        for (const b of f.branches) tracer(ctx, b, f, p);
      }
    }
  }
  ctx.restore();
}
