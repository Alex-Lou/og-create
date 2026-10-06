// La mer vivante, en unités du monde et en fonction du temps (rien à garder, rien à nettoyer) : reflets accrochés à
// la mer, vagues qui roulent vers les côtes, bancs de poissons sous l'eau, dauphins, baleine, méduses la nuit,
// mouettes en vol. seaOf(M) cherche une fois par île les eaux où chacun peut vivre : les bancs dans les eaux peu
// profondes, dauphins, baleine et méduses en eau libre, là où aucune terre ne se dresse devant eux.
import { TW, TH, SEA_Z, SEA_PAD, SHALLOW, worldOf } from './terrain.js';
import { hash } from './scene.js';

// Cases devant (vers +x et +y, vers le joueur) qui doivent rester de la mer pour qu'aucune falaise ne cache un
// animal qui saute
const FRONT = 6;
// Trajets des dauphins et de la baleine (en cases), directions possibles
const TRAVEL = 3;
const DIRS = [[-1, 0], [0, -1], [1, 0], [0, 1]];
export const DOLPHIN_EVERY = 38;
export const DOLPHIN_FOR = 7.5;
export const WHALE_EVERY = 95;
export const WHALE_FOR = 15;
const WAVE_T = 3.6;

const frac = v => v - Math.floor(v);
const smooth = k => k * k * (3 - 2 * k);
const ramp = (v, a, b) => smooth(Math.min(1, Math.max(0, (v - a) / (b - a))));

// Les eaux de l'île : open, eau libre ({ x, y, d : distance à la terre, dirs : trajets possibles }) ; shallow, les
// cases d'eaux peu profondes par distance à la terre (1 à SHALLOW) ; schools, les centres des bancs de poissons (au
// bord des eaux peu profondes, la mer tout autour)
export function seaOf(M) {
  const lo = -SEA_PAD, hi = M.n - 1 + SEA_PAD;
  const water = (x, y) => !M.land(x, y) && M.ground(x, y) !== 'b';
  const clear = (x, y) => {
    for (let j = 0; j <= FRONT; j++) for (let i = 0; i <= FRONT; i++) if (!water(x + i, y + j)) return false;
    return true;
  };
  const open = [], candidates = [], shallow = Array.from({ length: SHALLOW }, () => []);
  for (let y = lo; y <= hi; y++) {
    for (let x = lo; x <= hi; x++) {
      const d = M.depth(x, y);
      if (d >= 1 && d <= SHALLOW && water(x, y)) shallow[d - 1].push({ x, y });
      if (d === SHALLOW) candidates.push({ x, y });
      if (d < 3 || !clear(x, y)) continue;
      const dirs = DIRS.filter(([dx, dy]) => [1, 2, TRAVEL].every(k => clear(x + dx * k, y + dy * k)));
      if (dirs.length) open.push({ x, y, d, dirs });
    }
  }
  return { open, shallow, schools: spread(candidates, 7, 8) };
}

// Quelques cases bien réparties (ordre fixe tiré du hasard de chaque case, écart minimal en cases)
export function spread(cells, gap, most) {
  const out = [];
  for (const c of [...cells].sort((a, b) => hash(a.x, a.y) - hash(b.x, b.y))) {
    if (out.length >= most) break;
    if (out.every(o => Math.max(Math.abs(o.x - c.x), Math.abs(o.y - c.y)) >= gap)) out.push(c);
  }
  return out;
}

// Eau libre la plus proche d'un point (en cases), au moins à la distance voulue de la terre
export function nearestOpen(open, x, y, far = 3) {
  let best = null, bd = Infinity;
  for (const o of open) {
    if (o.d < far) continue;
    const d = Math.hypot(o.x - x, o.y - y);
    if (d < bd) { bd = d; best = o; }
  }
  return best;
}

// Qui vit dans la mer de ce joueur : la mer grandit avec l'île (quartiers achetés)
export function seaGuests(owned) {
  return { dolphins: owned.has('crique'), whale: owned.has('hameau'), jellies: owned.has('phare') };
}

/* ---------- Eaux peu profondes et reflets ---------- */

// Turquoise près de la terre, qui s'efface vers le large (plus discret la nuit) : un seul tracé par distance, sans
// couture entre les cases
const SHALLOW_ALPHA = [0.42, 0.25, 0.11];
export function drawShallows(ctx, shallow, view, night) {
  const k = 1 - night * 0.55;
  shallow.forEach((cells, level) => {
    ctx.beginPath();
    for (const cell of cells) {
      const c = worldOf(cell.x, cell.y, SEA_Z);
      if (c.x < view.x - TW || c.x > view.x + view.w + TW || c.y < view.y - TH || c.y > view.y + view.h + TH) continue;
      ctx.moveTo(c.x, c.y - TH / 2);
      ctx.lineTo(c.x + TW / 2, c.y);
      ctx.lineTo(c.x, c.y + TH / 2);
      ctx.lineTo(c.x - TW / 2, c.y);
      ctx.closePath();
    }
    ctx.fillStyle = `rgba(124,214,222,${(SHALLOW_ALPHA[level] * k).toFixed(3)})`;
    ctx.fill();
  });
}

// Petits traits clairs posés sur la mer (accrochés au monde : ils suivent la caméra), une poignée par écran ; taille
// constante à l'écran (s : échelle de la caméra)
export function drawSparkles(ctx, view, t, night, s) {
  let L = 64;
  while (view.w / L > 6) L *= 2;
  ctx.lineCap = 'round';
  ctx.lineWidth = 1.6 / s;
  for (let j = Math.floor(view.y / L) - 1; j <= Math.ceil((view.y + view.h) / L); j++) {
    for (let i = Math.floor(view.x / L) - 1; i <= Math.ceil((view.x + view.w) / L); i++) {
      const h = hash(i * 1.37 + L, j * 0.73);
      if (h < 0.3) continue;
      const x = (i + hash(i, j + 3)) * L + Math.sin(t * 0.3 + h * 6) * 4 / s;
      const y = (j + hash(i + 5, j)) * L + Math.sin(t * 0.8 + h * 9) * 2 / s;
      const len = (6 + h * 10) / s;
      const a = (0.16 + 0.24 * Math.sin(t * 1.3 + h * 17) ** 2) * (1 - night * 0.6);
      ctx.strokeStyle = `rgba(255,255,255,${a.toFixed(3)})`;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.quadraticCurveTo(x + len / 2, y - 2 / s, x + len, y);
      ctx.stroke();
    }
  }
}

/* ---------- Vagues ---------- */

// Bord d'une case de terre au niveau de la mer, et la direction du large (à l'écran) : devant (shore), la mer en +y
// (côté 0) ou en +x (côté 1) ; derrière (back), en −y (côté 0) ou en −x (côté 1)
function edgeOf(seg, front) {
  const c = worldOf(seg.x, seg.y, SEA_Z);
  const k = 2 / Math.sqrt(5);
  if (front) {
    return seg.side
      ? { x0: c.x, y0: c.y + TH / 2, x1: c.x + TW / 2, y1: c.y, nx: k, ny: k / 2 }
      : { x0: c.x - TW / 2, y0: c.y, x1: c.x, y1: c.y + TH / 2, nx: -k, ny: k / 2 };
  }
  return seg.side
    ? { x0: c.x - TW / 2, y0: c.y, x1: c.x, y1: c.y - TH / 2, nx: -k, ny: -k / 2 }
    : { x0: c.x, y0: c.y - TH / 2, x1: c.x + TW / 2, y1: c.y, nx: k, ny: -k / 2 };
}
// Moment de la vague sur ce bord (0 au large → 1 sur la côte) : elle longe la côte d'un bord à l'autre
const waveOf = (seg, t) => frac(t / WAVE_T + (seg.x + seg.y) * 0.07 + seg.side * 0.13);
const seenEdge = (e, view) => e.x1 > view.x - TW && e.x0 < view.x + view.w + TW && e.y0 > view.y - TW && e.y0 < view.y + view.h + TW;

// Vagues qui roulent vers la côte ; devant, l'écume au pied de la falaise s'éclaire quand la vague arrive (derrière,
// la terre la cache)
export function drawWaves(ctx, segs, view, t, front) {
  ctx.lineCap = 'round';
  for (const seg of segs) {
    const e = edgeOf(seg, front);
    if (!seenEdge(e, view)) continue;
    const w = waveOf(seg, t);
    const off = 3 + (1 - w) * 20;
    const a = 0.5 * Math.sin(Math.PI * w) ** 1.5;
    if (a > 0.02) {
      const shrink = (1 - w) * 0.18;
      const ox = e.nx * off, oy = e.ny * off;
      ctx.strokeStyle = `rgba(255,255,255,${a.toFixed(3)})`;
      ctx.lineWidth = 1.4 + w;
      ctx.beginPath();
      ctx.moveTo(e.x0 + (e.x1 - e.x0) * shrink + ox, e.y0 + (e.y1 - e.y0) * shrink + oy);
      ctx.lineTo(e.x1 - (e.x1 - e.x0) * shrink + ox, e.y1 - (e.y1 - e.y0) * shrink + oy);
      ctx.stroke();
    }
    if (!front) continue;
    // L'écume s'éclaire quand la vague arrive, puis retombe
    const burst = w > 0.85 ? (w - 0.85) / 0.15 : 0;
    const after = w < 0.15 ? 1 - w / 0.15 : 0;
    const foam = 0.3 + 0.4 * burst + 0.3 * after;
    ctx.strokeStyle = `rgba(255,255,255,${foam.toFixed(3)})`;
    ctx.lineWidth = 2.4 + burst * 1.6;
    const wob = k => 1.5 + Math.sin(t * 2 + k * 0.05) * 1.2;
    ctx.beginPath();
    ctx.moveTo(e.x0 + e.nx * wob(e.x0), e.y0 + e.ny * wob(e.x0) + 1);
    ctx.lineTo(e.x1 + e.nx * wob(e.x1), e.y1 + e.ny * wob(e.x1) + 1);
    ctx.stroke();
  }
}

// La nuit, l'écume s'éclaire de plancton bleu au moment où la vague se brise (à dessiner après le voile de la nuit)
export function drawPlankton(ctx, segs, view, t, night) {
  if (night < 0.3) return;
  ctx.lineCap = 'round';
  for (const seg of segs) {
    const e = edgeOf(seg, true);
    if (!seenEdge(e, view)) continue;
    const w = waveOf(seg, t);
    const glow = w > 0.82 ? (w - 0.82) / 0.18 : w < 0.25 ? 1 - w / 0.25 : 0;
    if (glow <= 0.02) continue;
    const a = (night - 0.3) / 0.7 * glow;
    for (const [width, alpha] of [[7, 0.18], [3, 0.6]]) {
      ctx.strokeStyle = `rgba(120,240,255,${(a * alpha).toFixed(3)})`;
      ctx.lineWidth = width;
      ctx.beginPath();
      ctx.moveTo(e.x0 + e.nx * 2, e.y0 + e.ny * 2 + 1);
      ctx.lineTo(e.x1 + e.nx * 2, e.y1 + e.ny * 2 + 1);
      ctx.stroke();
    }
  }
}

/* ---------- Bancs de poissons ---------- */

// Six poissons par banc, qui tournent doucement autour de leur centre (en cases) ; a : cap à l'écran
export function schoolFish(schools, t) {
  const out = [];
  schools.forEach((s, k) => {
    const w1 = 0.11 + hash(k, 3) * 0.08, w2 = 0.09 + hash(k, 5) * 0.08;
    const p1 = t * w1 + k * 1.7, p2 = t * w2 + k * 2.9;
    const cx = s.x + 0.85 * Math.sin(p1), cy = s.y + 0.85 * Math.sin(p2);
    const vx = Math.cos(p1) * w1, vy = Math.cos(p2) * w2;
    const a = Math.atan2((vx + vy) / 2, vx - vy);
    for (let i = 0; i < 6; i++) {
      out.push({
        x: cx + (hash(k, i + 10) - 0.5) * 0.7 + Math.sin(t * 1.3 + i) * 0.05,
        y: cy + (hash(k, i + 20) - 0.5) * 0.7 + Math.cos(t * 1.1 + i * 2) * 0.05,
        a: a + Math.sin(t * 6 + i * 1.9) * 0.12
      });
    }
  });
  return out;
}

// Ombres des poissons sous la surface (avant le sol : les eaux peu profondes et la terre passent par-dessus)
export function drawSchools(ctx, fish, view, night) {
  ctx.fillStyle = `rgba(22,52,72,${(0.34 * (1 - night * 0.6)).toFixed(3)})`;
  ctx.beginPath();
  for (const f of fish) {
    const c = worldOf(f.x, f.y, SEA_Z);
    if (c.x < view.x - 10 || c.x > view.x + view.w + 10 || c.y < view.y - 10 || c.y > view.y + view.h + 10) continue;
    const ca = Math.cos(f.a), sa = Math.sin(f.a);
    const p = (u, v) => [c.x + u * ca - v * sa, c.y + u * sa + v * ca];
    const pts = [p(4.4, 0), p(1, -1.6), p(-2.6, -1), p(-3.2, 0), p(-5.6, -1.6), p(-5, 0), p(-5.6, 1.6), p(-3.2, 0), p(-2.6, 1), p(1, 1.6)];
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (let k = 1; k < pts.length; k++) ctx.lineTo(pts[k][0], pts[k][1]);
    ctx.closePath();
  }
  ctx.fill();
}

/* ---------- Dauphins et baleine ---------- */

// Un groupe de trois dauphins qui bondissent l'un après l'autre en filant sur TRAVEL cases (τ : secondes depuis le
// début du passage) ; rings : ronds dans l'eau où ils replongent
export function podAt(spot, dir, τ) {
  const ARC = 1.15, GAP = 0.45, DUR = DOLPHIN_FOR - 1.2;
  const [dx, dy] = dir;
  const flip = dx - dy < 0;
  const dolphins = [], rings = [];
  for (let i = 0; i < 3; i++) {
    const p = τ - i * 0.5;
    if (p < 0 || p > DUR) continue;
    const along = (p / DUR) * TRAVEL, side = (i - 1) * 0.42;
    const x = spot.x + dx * along - dy * side, y = spot.y + dy * along + dx * side;
    const cyc = p % (ARC + GAP), a = cyc / ARC;
    if (a <= 1) {
      dolphins.push({ id: i, x, y, z: Math.sin(Math.PI * a) * 20, frame: a < 0.36 ? 0 : a < 0.64 ? 1 : 2, flip });
      if (a < 0.15) rings.push({ x, y, k: a / 0.15 * 0.4 });
    } else if (cyc - ARC < 0.4) rings.push({ x, y, k: (cyc - ARC) / 0.4 });
  }
  return { dolphins, rings };
}

// La baleine (τ : secondes depuis le début du passage) : remous, dos qui affleure, deux souffles, queue dressée
// avant la plongée ; e de 0 à 1 : à quel point la pièce sort de l'eau
export function whaleAt(spot, dir, τ) {
  const [dx, dy] = dir;
  const along = (τ / WHALE_FOR) * 1.6;
  const x = spot.x + dx * along, y = spot.y + dy * along;
  const out = { flip: dx - dy < 0, rings: [], spouts: [], back: null, fluke: null };
  if (τ < 2) out.rings.push({ x: spot.x, y: spot.y, k: τ / 2 });
  const eb = ramp(τ, 1, 2.6) * (1 - ramp(τ, 9, 10.2));
  if (eb > 0) out.back = { x, y, e: eb };
  for (const at of [3.2, 6.6]) if (τ >= at && τ < at + 1.8) out.spouts.push({ x: x + dx * 0.25, y: y + dy * 0.25, k: (τ - at) / 1.8 });
  const ef = ramp(τ, 10.4, 11.3) * (1 - ramp(τ, 12.6, 13.6));
  if (ef > 0) {
    out.fluke = { x: x - dx * 0.35, y: y - dy * 0.35, e: ef };
    if (τ > 12.8) out.rings.push({ x: x - dx * 0.35, y: y - dy * 0.35, k: (τ - 12.8) / 2.2 });
  }
  return out;
}

// Ronds dans l'eau (k de 0 à 1 : ils s'élargissent et s'effacent)
export function drawRings(ctx, rings, scale = 1) {
  ctx.lineWidth = 1.4;
  for (const r of rings) {
    const c = worldOf(r.x, r.y, SEA_Z);
    for (const lag of [0, 0.3]) {
      const k = r.k - lag;
      if (k <= 0 || k >= 1) continue;
      ctx.strokeStyle = `rgba(255,255,255,${(0.7 * (1 - k)).toFixed(3)})`;
      ctx.beginPath();
      ctx.ellipse(c.x, c.y, (6 + k * 16) * scale, (2.4 + k * 6.4) * scale, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
}

// Souffle de la baleine : une gerbe de gouttes qui monte, s'ouvre et retombe (k de 0 à 1)
export function drawSpout(ctx, spout) {
  const c = worldOf(spout.x, spout.y, SEA_Z);
  const k = spout.k;
  for (let i = 0; i < 14; i++) {
    const spreadX = (hash(i, 4) - 0.5) * 22 * k;
    const rise = 46 * Math.sin(Math.min(1, k * 1.4 + hash(i, 6) * 0.15) * Math.PI * 0.62) - 18 * k * k;
    const r = 1.4 + hash(i, 8) * 2.2 * (1 - k * 0.4);
    ctx.fillStyle = `rgba(240,250,255,${(0.85 * (1 - k) ** 0.8).toFixed(3)})`;
    ctx.beginPath();
    ctx.arc(c.x + spreadX, c.y - 8 - rise * (0.75 + hash(i, 2) * 0.35), r, 0, Math.PI * 2);
    ctx.fill();
  }
}

/* ---------- Méduses ---------- */

// Méduses qui dérivent en eau libre, la nuit
export function jelliesAt(open, t) {
  return spread(open.filter(o => o.d >= 4), 5, 5).map((o, k) => ({
    x: o.x + Math.sin(t * 0.05 + k * 2) * 0.7,
    y: o.y + Math.cos(t * 0.04 + k * 3) * 0.7,
    pulse: 0.5 + 0.5 * Math.sin(t * 1.6 + k * 2.3),
    hue: k % 2 ? '255,150,220' : '140,220,255'
  }));
}

// À dessiner après le voile de la nuit : elles luisent
export function drawJellies(ctx, list, view, t, night) {
  if (night < 0.3) return;
  const a = (night - 0.3) / 0.7;
  for (const j of list) {
    const c = worldOf(j.x, j.y, SEA_Z);
    if (c.x < view.x - 40 || c.x > view.x + view.w + 40 || c.y < view.y - 40 || c.y > view.y + view.h + 40) continue;
    const r = 7 + j.pulse * 1.6;
    const g = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, r * 3.2);
    g.addColorStop(0, `rgba(${j.hue},${(0.45 * a).toFixed(3)})`);
    g.addColorStop(1, `rgba(${j.hue},0)`);
    ctx.fillStyle = g;
    ctx.fillRect(c.x - r * 3.2, c.y - r * 3.2, r * 6.4, r * 6.4);
    ctx.fillStyle = `rgba(${j.hue},${(0.75 * a).toFixed(3)})`;
    ctx.beginPath();
    ctx.ellipse(c.x, c.y - 2, r, r * (0.55 + j.pulse * 0.1), 0, Math.PI, 0);
    ctx.fill();
    ctx.strokeStyle = `rgba(${j.hue},${(0.6 * a).toFixed(3)})`;
    ctx.lineWidth = 0.9;
    for (let k = -2; k <= 2; k++) {
      ctx.beginPath();
      ctx.moveTo(c.x + k * 2.6, c.y - 2);
      ctx.quadraticCurveTo(c.x + k * 2.6 + Math.sin(t * 2 + k) * 2.4, c.y + 5, c.x + k * 2.2, c.y + 10 + j.pulse * 2);
      ctx.stroke();
    }
  }
}

/* ---------- Mouettes en vol ---------- */

// Un vol de mouettes qui tourne au-dessus d'un point du monde (cx, cy), à 70-110 unités de haut
export function circling(cx, cy, t, seed, count = 4) {
  return Array.from({ length: count }, (_, i) => {
    const a = t * (0.32 + hash(seed, i) * 0.08) + i * 1.6 + seed;
    const r = 70 + hash(seed, i + 9) * 50;
    return { wx: cx + Math.cos(a) * r, wy: cy + Math.sin(a) * r * 0.5, alt: 70 + hash(seed, i + 4) * 40, flip: Math.sin(a) > 0, phase: i * 1.3 + seed };
  });
}

// Un vol qui traverse toute l'île de temps en temps (bounds : rectangle du monde de l'île)
export function crossing(bounds, t) {
  const cycle = Math.floor(t / 34), k = (t % 34) / 34;
  if (k > 0.62) return [];
  const x0 = bounds.x - 120 + (k / 0.62) * (bounds.w + 240);
  const y0 = bounds.y + bounds.h * (0.2 + 0.6 * hash(cycle, 9));
  return [[0, 0], [-26, 14], [-48, -8], [-70, 10]].map(([dx, dy], i) => ({ wx: x0 + dx, wy: y0 + dy + Math.sin(t * 0.6 + i) * 6, alt: 110, flip: false, phase: i * 1.3 }));
}

// Ombre d'une mouette en vol, sur la mer ou le sol
export function drawGullShadow(ctx, g, s) {
  const size = Math.max(1, 0.5 / s);
  ctx.fillStyle = 'rgba(30,45,40,.13)';
  ctx.beginPath();
  ctx.ellipse(g.wx + g.alt * 0.35, g.wy, 5 * size, 1.8 * size, 0, 0, Math.PI * 2);
  ctx.fill();
}

// Mouette en vol : corps blanc, ailes grises qui battent, bouts noirs ; taille minimale à l'écran (île entière)
export function drawFlyingGull(ctx, g, t, s) {
  const size = Math.max(1, 0.5 / s);
  const x = g.wx, y = g.wy - g.alt;
  const flap = Math.sin(t * 8 + g.phase) * 4 * size;
  const dir = g.flip ? -1 : 1;
  ctx.lineCap = 'round';
  ctx.strokeStyle = 'rgba(150,160,170,.95)';
  ctx.lineWidth = 1.7 * size;
  ctx.beginPath();
  ctx.moveTo(x - 8 * size, y - flap);
  ctx.quadraticCurveTo(x - 3 * size, y - 3 * size, x, y);
  ctx.quadraticCurveTo(x + 3 * size, y - 3 * size, x + 8 * size, y - flap);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(40,40,40,.85)';
  ctx.lineWidth = 1.4 * size;
  ctx.beginPath();
  ctx.moveTo(x - 8 * size, y - flap);
  ctx.lineTo(x - 6.4 * size, y - flap * 0.85 - 0.4 * size);
  ctx.moveTo(x + 8 * size, y - flap);
  ctx.lineTo(x + 6.4 * size, y - flap * 0.85 - 0.4 * size);
  ctx.stroke();
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.ellipse(x + dir * 0.6 * size, y + 0.6 * size, 2.8 * size, 1.4 * size, 0, 0, Math.PI * 2);
  ctx.fill();
}
