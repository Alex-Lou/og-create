// L'étalonnage de l'heure, en trois couleurs, comme une image peinte : les ombres prennent la couleur froide du moment
// (sarcelle le jour, violet à l'aube, pourpre au couchant, bleu profond la nuit), les tons moyens sa teinte, les
// lumières sa chaleur (crème le jour, or au couchant, ambre des lampes la nuit). Sous un ciel gris, tout se rapproche
// d'un gris bleuté. Trois aplats sur l'écran, chacun dans le mode qui touche surtout sa part de l'image : « color-burn »
// creuse les ombres, « soft-light » teinte les tons moyens, « color-dodge » réchauffe les lumières.
import { mixHex } from '../iso';
import { clamp } from '../maths';

// Les moments : [ombres, tons moyens, lumières] et la force de chacun
const JOUR = { ombres: '#2C7A9C', milieux: '#F0D49A', lumieres: '#FFE2B0', force: [0.14, 0.1, 0.1] };
const AUBE = { ombres: '#5B4FA8', milieux: '#F4A6B6', lumieres: '#FFD2BC', force: [0.16, 0.12, 0.1] };
const DORE = { ombres: '#6E3C92', milieux: '#FF9A58', lumieres: '#FFC46A', force: [0.18, 0.14, 0.12] };
const NUIT = { ombres: '#34437A', milieux: '#4A7E9E', lumieres: '#FFB050', force: [0.1, 0.07, 0.14] };
const GRIS = { ombres: '#4C5E72', milieux: '#AEB6BE', lumieres: '#E6ECF2', force: [0.1, 0.06, 0.04] };

const KEYS = ['ombres', 'milieux', 'lumieres'];
function blend(a, b, k) {
  const out = { force: a.force.map((f, i) => f + (b.force[i] - f) * k) };
  for (const key of KEYS) out[key] = mixHex(a[key], b[key], k);
  return out;
}

// L'étalonnage d'une heure (phase : le ciel de sky.js) : { ombres, milieux, lumieres, force: [ombres, milieux, lumières] }.
// La nuit, puis la chaleur (l'aube le matin, le couchant le soir), le jour pour le reste ; le gris du ciel par-dessus.
export function etalonnageOf(phase) {
  const night = clamp(phase.night || 0);
  const warm = clamp(phase.warm || 0) * (1 - night);
  const chaud = phase.sun && phase.sun.progress < 0.5 ? AUBE : DORE;
  let g = blend(JOUR, chaud, warm / Math.max(1e-6, 1 - night));
  g = blend(g, NUIT, night);
  const { cover = 0, rain = 0 } = phase.weather || {};
  return blend(g, GRIS, clamp(cover * 0.8 + rain * 0.4));
}

// Une couleur ramenée à sa teinte pure (son canal le plus fort à 255) : [r, g, b] de 0 à 1
function hueOf(hex) {
  const n = parseInt(hex.slice(1), 16);
  const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  const top = Math.max(1, ...c);
  return c.map(v => v / top);
}
const rgb = c => `rgb(${c.map(v => Math.round(clamp(v) * 255)).join(',')})`;

// Les trois aplats d'une heure : { ks, km, kh (leurs forces), ombres, milieux, lumieres (leurs couleurs) }. Le ciel
// bouge un rien à chaque image : ils ne se refont que quand il a changé d'un millième (rien qui se voie)
const millieme = v => Math.round((v || 0) * 1000);
let dernier = null;
export function aplatsOf(phase, dose = 1) {
  const { cover, rain } = phase.weather || {};
  const cle = [phase.night, phase.warm, cover, rain, dose].map(millieme).join() + (phase.sun && phase.sun.progress < 0.5 ? 'm' : 's');
  if (dernier && dernier.cle === cle) return dernier;
  const g = etalonnageOf(phase);
  const [ks, km, kh] = g.force.map(f => f * dose);
  dernier = {
    cle, ks, km, kh,
    // les ombres : un blanc auquel il manque un peu de la teinte opposée ; les lumières : un peu de leur teinte
    ombres: rgb(hueOf(g.ombres).map(v => 1 - ks * (1 - v))),
    milieux: g.milieux,
    lumieres: rgb(hueOf(g.lumieres).map(v => kh * v))
  };
  return dernier;
}

// Les trois aplats, à l'écran (w, h en pixels CSS ; dose : 1 par défaut)
export function drawEtalonnage(ctx, w, h, phase, dose = 1) {
  const a = aplatsOf(phase, dose);
  ctx.save();
  // Les ombres (color-burn mord surtout le sombre)
  if (a.ks > 0.005) {
    ctx.globalCompositeOperation = 'color-burn';
    ctx.fillStyle = a.ombres;
    ctx.fillRect(0, 0, w, h);
  }
  // Les tons moyens : la teinte du moment, en lumière douce
  if (a.km > 0.005) {
    ctx.globalCompositeOperation = 'soft-light';
    ctx.globalAlpha = a.km;
    ctx.fillStyle = a.milieux;
    ctx.fillRect(0, 0, w, h);
    ctx.globalAlpha = 1;
  }
  // Les lumières (color-dodge pousse surtout le clair)
  if (a.kh > 0.005) {
    ctx.globalCompositeOperation = 'color-dodge';
    ctx.fillStyle = a.lumieres;
    ctx.fillRect(0, 0, w, h);
  }
  ctx.restore();
}
