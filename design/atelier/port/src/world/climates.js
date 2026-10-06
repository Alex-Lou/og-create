// Micro-climats de la très grande île (lot 9) : chaque quartier des terres nouvelles a son climat (le cœur est
// tempéré). Là où regarde la caméra, le climat prend le dessus sur le temps de l'île : sa lumière (une teinte) et ce
// qui flotte dans l'air (flocons, rafales, brume du marais, ondes de chaleur, averse tropicale, cendres et braises).
// Le passage d'un climat à l'autre se fond (mix).
import { hash } from './scene.js';

export const CLIMATE_NAMES = {
  tempere: 'Tempéré', cimes: 'Les Cimes', landes: 'Les Landes', marais: 'Le Marais', dunes: 'Les Dunes', jungle: 'La Jungle', volcan: 'Le Volcan'
};
// Ce que dit le climat d'un quartier découvert (fiche du quartier)
export const CLIMATE_TEXT = {
  cimes: 'Neige et glace : l’air est vif, les sommets blancs.',
  landes: 'Le vent court sur la bruyère et les falaises.',
  marais: 'Une brume tiède flotte sur les eaux dormantes.',
  dunes: 'La chaleur fait trembler l’air au-dessus du sable.',
  jungle: 'Une pluie tiède tombe sur les grandes feuilles.',
  volcan: 'Des cendres tombent ; la lave rougeoie dans les fissures.'
};
// Teinte de la lumière (par-dessus la scène, à l'écran)
const TINTS = {
  cimes: 'rgba(200, 222, 255, .16)',
  landes: 'rgba(170, 160, 190, .12)',
  marais: 'rgba(150, 175, 140, .16)',
  dunes: 'rgba(255, 210, 140, .15)',
  jungle: 'rgba(90, 160, 110, .14)',
  volcan: 'rgba(120, 60, 50, .2)'
};

// Climat d'une case (quartiers de l'île vus par le joueur ; un quartier inconnu n'en dit rien), ou null
export function climateAt(M, zones, x, y) {
  const zone = zones[M.zone(Math.round(x), Math.round(y))];
  return zone && zone.known !== false ? zone.climate || null : null;
}

// Mélange qui suit le climat visé : chaque climat monte vers 1 s'il est visé, descend vers 0 sinon (rate : part du
// chemin faite par seconde ; dt en secondes). Renvoie un nouveau mélange, sans les climats éteints
export function mixToward(mix, target, dt, rate = 1.5) {
  const k = Math.min(1, dt * rate);
  const out = {};
  for (const id of new Set([...Object.keys(mix), ...(target && target !== 'tempere' ? [target] : [])])) {
    const goal = id === target ? 1 : 0;
    const w = (mix[id] || 0) + (goal - (mix[id] || 0)) * k;
    if (w > 0.01) out[id] = w;
  }
  return out;
}

/* ---------- Ce qui flotte dans l'air (écran) ---------- */
function snow(ctx, w, h, t, a) {
  ctx.fillStyle = `rgba(255, 255, 255, ${(0.85 * a).toFixed(3)})`;
  for (let k = 0; k < 110; k++) {
    const speed = 0.06 + hash(k, 3) * 0.06;
    const y = ((hash(k, 2) + t * speed) % 1) * (h + 20) - 10;
    const x = ((hash(k, 1) * w + Math.sin(t * 0.8 + k) * 14) % w + w) % w;
    const r = 1 + hash(k, 4) * 1.8;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
}
function wind(ctx, w, h, t, a) {
  ctx.strokeStyle = `rgba(255, 255, 255, ${(0.45 * a).toFixed(3)})`;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  for (let k = 0; k < 18; k++) {
    const y = hash(k, 5) * h;
    const x = ((hash(k, 6) + t * (0.35 + hash(k, 7) * 0.3)) % 1.3) * w * 1.1 - w * 0.2;
    const len = 40 + hash(k, 8) * 60;
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + len * 0.5, y - 6 * Math.sin(t * 2 + k), x + len, y);
  }
  ctx.stroke();
}
function fog(ctx, w, h, t, a) {
  ctx.fillStyle = `rgba(228, 236, 228, ${(0.22 * a).toFixed(3)})`;
  ctx.fillRect(0, 0, w, h);
  for (let k = 0; k < 5; k++) {
    const y = h * (0.15 + k * 0.18) + Math.sin(t * 0.09 + k) * 14;
    const x = ((t * (5 + k * 1.5) + hash(k, 63) * w) % (w * 1.6)) - w * 0.3;
    const g = ctx.createRadialGradient(x, y, 0, x, y, w * 0.4);
    g.addColorStop(0, `rgba(236, 242, 236, ${(0.34 * a).toFixed(3)})`);
    g.addColorStop(1, 'rgba(236, 242, 236, 0)');
    ctx.fillStyle = g;
    ctx.fillRect(x - w * 0.4, y - w * 0.4, w * 0.8, w * 0.8);
  }
}
function heat(ctx, w, h, t, a) {
  // Ondes de chaleur : de longues lignes claires qui ondulent et montent lentement
  ctx.strokeStyle = `rgba(255, 244, 220, ${(0.28 * a).toFixed(3)})`;
  ctx.lineWidth = 2;
  for (let k = 0; k < 7; k++) {
    const y = h - ((t * 12 + k * (h / 7)) % h);
    ctx.beginPath();
    for (let x = 0; x <= w; x += 16) ctx.lineTo(x, y + Math.sin(x * 0.03 + t * 2 + k) * 3);
    ctx.stroke();
  }
}
function downpour(ctx, w, h, t, a) {
  ctx.fillStyle = `rgba(120, 170, 140, ${(0.1 * a).toFixed(3)})`;
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = `rgba(190, 215, 225, ${(0.55 * a).toFixed(3)})`;
  ctx.lineWidth = 1.3;
  ctx.beginPath();
  for (let k = 0; k < 260; k++) {
    const speed = 1.4 + hash(k, 13) * 0.6;
    const y = ((hash(k, 12) + t * speed) % 1) * (h + 40) - 20;
    const x = ((hash(k, 11) * (w + 40) + y * 0.12) % (w + 40)) - 20;
    ctx.moveTo(x, y);
    ctx.lineTo(x - 2, y - 14 - hash(k, 14) * 8);
  }
  ctx.stroke();
}
function ash(ctx, w, h, t, a) {
  for (let k = 0; k < 70; k++) {
    const ember = k % 9 === 0;
    const speed = ember ? -0.08 - hash(k, 23) * 0.05 : 0.04 + hash(k, 23) * 0.04;
    const y = (((hash(k, 22) + t * speed) % 1) + 1) % 1 * (h + 20) - 10;
    const x = ((hash(k, 21) * w + Math.sin(t * 0.6 + k) * 18) % w + w) % w;
    ctx.fillStyle = ember ? `rgba(255, 150, 70, ${(0.9 * a * (0.6 + 0.4 * Math.sin(t * 6 + k))).toFixed(3)})` : `rgba(90, 84, 80, ${(0.6 * a).toFixed(3)})`;
    ctx.fillRect(x, y, ember ? 2 : 2.4, ember ? 2 : 1.6);
  }
}
const AIR = { cimes: snow, landes: wind, marais: fog, dunes: heat, jungle: downpour, volcan: ash };

// Climat(s) visé(s) par la caméra, par-dessus la scène : teinte puis ce qui flotte dans l'air, chacun à son poids.
// reduced : mouvement réduit (la teinte seule)
export function drawClimate(ctx, w, h, t, mix, reduced = false) {
  const entries = Object.entries(mix).filter(([id]) => TINTS[id]);
  if (!entries.length) return;
  ctx.save();
  for (const [id, weight] of entries) {
    ctx.globalAlpha = weight;
    ctx.fillStyle = TINTS[id];
    ctx.fillRect(0, 0, w, h);
    ctx.globalAlpha = 1;
    if (!reduced) AIR[id](ctx, w, h, t, weight);
  }
  ctx.restore();
}
