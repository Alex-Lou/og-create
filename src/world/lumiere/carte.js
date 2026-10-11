// Carte de lumière : au lieu de poser la teinte de l'heure à plat sur toute la scène, on peint une carte (en quart de
// résolution) remplie de la lumière ambiante, où chaque source (fenêtre, feu, lanterne, luciole…) ajoute sa lumière
// autour d'elle ; la carte est ensuite multipliée sur la scène. Les sources éclairent donc vraiment ce qui les entoure
// (murs, sol, feuillage), et la nuit peut être plus profonde sans tout éteindre.
import { mixHex } from '../iso';

// Finesse de la carte (un pixel de la carte pour Q × Q pixels de l'écran : la lumière est douce, un quart suffit)
const Q = 4;
// Portée de la lumière par rapport au halo d'une source, et force de la lumière dans la carte
const REACH = 2.6;
const GAIN = 0.95;
// Bleu de la nuit profonde vers lequel l'ambiante descend quand la nuit est pleine (la lune reste douce et bleutée)
const NUIT_PROFONDE = '#2A3264';

// Textures de lumière : une par couleur, dessinées une fois (dégradé radial au cœur blanc chaud)
const textures = new Map();
function texture(color) {
  let c = textures.get(color);
  if (c) return c;
  c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, `rgba(${color},1)`);
  grad.addColorStop(0.18, `rgba(${color},0.82)`);
  grad.addColorStop(0.45, `rgba(${color},0.38)`);
  grad.addColorStop(0.75, `rgba(${color},0.1)`);
  grad.addColorStop(1, `rgba(${color},0)`);
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  textures.set(color, c);
  return c;
}

// Lumière ambiante de l'heure : la teinte du ciel, plus profonde au cœur de la nuit
// (au flash d'un éclair, elle vire d'un coup au blanc froid)
export const ambientOf = (phase, flash = 0) => {
  const base = phase.night > 0 ? mixHex(phase.tint, NUIT_PROFONDE, 0.42 * phase.night) : phase.tint;
  return flash > 0.01 ? mixHex(base, '#DCE4FF', Math.min(0.9, flash * 0.85)) : base;
};

let map = null;
let mctx = null;
// Peint la carte et la multiplie sur la scène. sources : [{ x, y, r, k, color }] en unités du monde (celles de
// drawLights), worldTransform : la transformation du monde à l'écran (pixels de l'appareil). Rend false quand il n'y a
// rien à éclairer (la teinte à plat suffit alors).
export function drawLightmap(ctx, geo, phase, worldTransform, sources, flash = 0) {
  const lit = sources.filter(s => s.k > 0.01);
  if (!lit.length || phase.lit <= 0.01) return false;
  const { width, height, dpr } = geo;
  const w = Math.max(1, Math.ceil((width * dpr) / Q));
  const h = Math.max(1, Math.ceil((height * dpr) / Q));
  if (!map) { map = document.createElement('canvas'); mctx = map.getContext('2d'); }
  if (map.width !== w || map.height !== h) { map.width = w; map.height = h; }
  mctx.setTransform(1, 0, 0, 1, 0, 0);
  mctx.globalCompositeOperation = 'source-over';
  mctx.globalAlpha = 1;
  mctx.fillStyle = ambientOf(phase, flash);
  mctx.fillRect(0, 0, w, h);
  const m = worldTransform;
  mctx.setTransform(m.a / Q, m.b / Q, m.c / Q, m.d / Q, m.e / Q, m.f / Q);
  mctx.globalCompositeOperation = 'lighter';
  for (const s of lit) {
    // la source elle-même, puis la flaque de lumière qu'elle pose au sol, un peu plus bas et plus large
    const r = s.r * REACH;
    mctx.globalAlpha = Math.min(1, s.k * GAIN);
    mctx.drawImage(texture(s.color), s.x - r, s.y - r, r * 2, r * 2);
    if (s.pool !== false) {
      const rp = s.r * 1.9;
      mctx.globalAlpha = Math.min(1, s.k * GAIN * 0.55);
      mctx.drawImage(texture(s.color), s.x - rp, s.y + s.r * 0.6 - rp * 0.55, rp * 2, rp * 1.1);
    }
  }
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalCompositeOperation = 'multiply';
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(map, 0, 0, width * dpr, height * dpr);
  ctx.restore();
  return true;
}
