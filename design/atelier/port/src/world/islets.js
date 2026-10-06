// Les îlots des chapitres VI et VII (lot 5e). L'Île des Légendes flotte au-dessus de la mer (son relief : terrain.js) :
// une ombre douce sur l'eau, des volutes de brume dessous, une source qui jaillit de son flanc. La barque volante du
// passeur fait la navette entre un petit ponton de l'Îlot aux Mouettes et elle. Calculs purs, puis dessins Canvas 2D
// de ce qui bouge (unités du monde).
import { TW, TH, HS, SEA_Z, CRUST, worldOf, bridgeLamp } from './terrain.js';

export const FLOATING_ZONE = 'legendes';
export const COLONY_ZONE = 'phare';
// Barque : un aller-retour en FERRY_CYCLE secondes, dont FERRY_WAIT à chaque bout
export const FERRY_CYCLE = 44;
export const FERRY_WAIT = 9;
const FERRY_TRIP = (FERRY_CYCLE - 2 * FERRY_WAIT) / 2;
// Hauteur de l'arc de la barque au milieu du trajet (paliers)
const FERRY_ARC = 1.4;

const smooth = k => k * k * (3 - 2 * k);
const near = (cells, p) => cells.reduce((best, c) => (Math.hypot(c.x - p.x, c.y - p.y) < Math.hypot(best.x - p.x, best.y - p.y) ? c : best));

// Ce que les îlots montrent pour une île donnée : l'île flottante (M.float), les cases de l'Îlot aux Mouettes, la
// source, le trajet de la barque, les lanternes du pont. zoneOf(x, y) : identifiant du quartier d'une case
export function isletsOf(M, zoneOf) {
  const colony = [];
  const lamps = [];
  for (let y = 0; y < M.n; y++) {
    for (let x = 0; x < M.n; x++) {
      if (M.land(x, y) && zoneOf(x, y) === COLONY_ZONE) colony.push({ x, y });
      if (M.ground(x, y) !== 'b') continue;
      for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) if (M.land(x + dx, y + dy)) lamps.push(bridgeLamp(x, y, dx, dy));
    }
  }
  const float = M.float;
  return { float, colony, lamps, spring: float ? springOf(M) : null, route: float && colony.length ? ferryRoute(M, colony) : null };
}

// Source de l'île flottante : la case du bord la plus en avant, sur sa face côté mer (side 0 : vers +y, 1 : vers +x)
export function springOf(M) {
  let best = null;
  for (const c of M.float.cells) {
    for (const [dx, dy, side] of [[0, 1, 0], [1, 0, 1]]) {
      if (M.land(c.x + dx, c.y + dy)) continue;
      const score = c.x + c.y + (side ? 0 : 0.1);
      if (!best || score > best.score) best = { x: c.x, y: c.y, side, score };
    }
  }
  return best && { x: best.x, y: best.y, side: best.side, top: M.surface(best.x, best.y) };
}

// Bord d'une liste de cases tourné vers le joueur : chaque case qui a la mer devant elle (en +x ou en +y), avec ce
// côté (dx, dy) ; un ponton ou un quai posé là reste visible, devant la falaise
const frontEdges = (M, cells) => cells.flatMap(c => [[1, 0], [0, 1]].filter(([dx, dy]) => !M.land(c.x + dx, c.y + dy)).map(([dx, dy]) => ({ x: c.x, y: c.y, dx, dy })));

// Trajet de la barque : du ponton (dans la mer, devant le bord de l'Îlot aux Mouettes le plus proche de l'île
// flottante) au quai (en l'air, devant le bord de l'île flottante le plus proche du ponton), en cases, à la hauteur z
// (paliers)
export function ferryRoute(M, colony) {
  const float = M.float;
  const shore = near(frontEdges(M, colony), { x: float.cx, y: float.cy });
  const dock = { x: shore.x + shore.dx * 1.05, y: shore.y + shore.dy * 1.05, z: SEA_Z + 0.1 };
  const rim = near(frontEdges(M, float.cells), dock);
  return { dock, quay: { x: rim.x + rim.dx * 0.95, y: rim.y + rim.dy * 0.95, z: M.surface(rim.x, rim.y) - 0.35 } };
}

// La barque à l'instant t (secondes) : position (cases, hauteur en paliers), sens à l'écran, en route ou à quai.
// À l'arrêt (active faux) : au ponton, bercée
export function ferryPose(route, t, active) {
  const bob = Math.sin(t * 1.4) * 0.06;
  const { dock: a, quay: b } = route;
  const right = (b.x - b.y) - (a.x - a.y) > 0;
  if (!active) return { x: a.x, y: a.y, z: a.z + bob, flip: !right, moving: false };
  const τ = ((t % FERRY_CYCLE) + FERRY_CYCLE) % FERRY_CYCLE;
  let k = 1, out = false;
  if (τ < FERRY_WAIT) { k = 0; out = true; } else if (τ < FERRY_WAIT + FERRY_TRIP) { k = smooth((τ - FERRY_WAIT) / FERRY_TRIP); out = true; } else if (τ >= 2 * FERRY_WAIT + FERRY_TRIP) k = 1 - smooth((τ - 2 * FERRY_WAIT - FERRY_TRIP) / FERRY_TRIP);
  return {
    x: a.x + (b.x - a.x) * k,
    y: a.y + (b.y - a.y) * k,
    z: a.z + (b.z - a.z) * k + Math.sin(Math.PI * k) * FERRY_ARC + bob,
    flip: out ? !right : right,
    moving: k > 0 && k < 1
  };
}

/* ---------- Dessins ---------- */

// Sous l'île flottante, sur la mer : son ombre, et des volutes de brume qui dérivent lentement (avant le sol)
export function drawFloatBelow(ctx, float, view, t, night) {
  if (!float) return;
  const c = worldOf(float.cx, float.cy, SEA_Z);
  const rx = float.r * TW * 0.62, ry = float.r * TH * 0.62;
  if (c.x + rx < view.x || c.x - rx > view.x + view.w || c.y + ry < view.y || c.y - ry > view.y + view.h + HS * 4) return;
  ctx.fillStyle = `rgba(16, 36, 58, ${(0.2 - night * 0.08).toFixed(3)})`;
  ctx.beginPath();
  ctx.ellipse(c.x + 14, c.y + 8, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
  for (let i = 0; i < 6; i++) {
    const a = t * 0.06 + (i / 6) * Math.PI * 2;
    const p = worldOf(float.cx + Math.cos(a) * float.r * 0.55, float.cy + Math.sin(a) * float.r * 0.55, SEA_Z + 0.55 + 0.15 * Math.sin(t * 0.4 + i));
    const r = 16 + 6 * Math.sin(t * 0.3 + i * 1.7);
    ctx.fillStyle = `rgba(238, 244, 250, ${(0.34 - night * 0.14).toFixed(3)})`;
    ctx.beginPath();
    ctx.ellipse(p.x, p.y, r * 1.6, r * 0.6, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

// La source qui jaillit du flanc de l'île flottante et tombe dans la mer : un filet d'eau qui s'évase, des traits qui
// descendent, l'écume au pied (après le sol)
export function drawSpring(ctx, spring, view, t) {
  if (!spring) return;
  const u = spring.side ? spring.x + 0.5 : spring.x, v = spring.side ? spring.y : spring.y + 0.5;
  const top = worldOf(u, v, spring.top - CRUST - 0.35);
  const foot = worldOf(u, v, SEA_Z);
  if (foot.x < view.x - TW || foot.x > view.x + view.w + TW || top.y > view.y + view.h || foot.y < view.y) return;
  const out = spring.side ? 5 : -5;
  ctx.save();
  ctx.lineCap = 'round';
  ctx.fillStyle = 'rgba(160, 215, 245, .85)';
  ctx.beginPath();
  ctx.moveTo(top.x - 2.5, top.y);
  ctx.quadraticCurveTo(top.x + out, top.y + 6, top.x + out - 3, foot.y);
  ctx.lineTo(top.x + out + 4, foot.y);
  ctx.quadraticCurveTo(top.x + out + 4, top.y + 6, top.x + 2.5, top.y);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, .8)';
  ctx.lineWidth = 1.2;
  const fall = foot.y - top.y;
  for (let k = 0; k < 4; k++) {
    const y = top.y + 6 + ((t * 60 + k * fall / 4) % (fall - 6));
    ctx.beginPath();
    ctx.moveTo(top.x + out - 1, y);
    ctx.lineTo(top.x + out - 1, Math.min(foot.y, y + 7));
    ctx.stroke();
  }
  const pulse = (t * 1.2) % 1;
  ctx.strokeStyle = `rgba(255, 255, 255, ${(0.7 * (1 - pulse)).toFixed(3)})`;
  ctx.beginPath();
  ctx.ellipse(top.x + out + 0.5, foot.y, 6 + pulse * 10, 2.4 + pulse * 4, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}
