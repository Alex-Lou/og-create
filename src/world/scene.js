// Ambiance de l'île : fond de la mer, nuages, teinte de l'heure, temps qu'il fait (soleil bas, brume, pluie, éclairs),
// lumières et lucioles. Le ciel lui-même (soleil, météo, couleurs minute par minute) est dans sky.js ;
// la vie de la mer (reflets, vagues, animaux, mouettes) dans sea.js.
// Tout est déterministe en fonction du temps : pas d'état, rien à nettoyer.
import { skyAt, sunTimes, WEATHERS, OPUS } from './sky';
import { tuilesOf, TUILE } from './tuiles';
import { rond } from './textures';

// Ciel de l'île à une date (voir sky.js) : moment, nuit, chaleur, lumières, teinte, mer, nuages, soleil, météo
export const phaseAt = (date = new Date(), forced = {}) => skyAt(date, forced);

// Moment, temps ou étape du Grand Œuvre imposés (essais) : ?heure=nuit|aube|matin|jour|couchant|crepuscule,
// ?meteo=clair|voile|brume|pluie|orage et ?oeuvre=noir|blanc|jaune|rouge
export function forcedPhase() {
  const query = new URLSearchParams(window.location.search);
  const wanted = query.get('heure');
  const weather = query.get('meteo');
  const opus = query.get('oeuvre');
  const d = new Date();
  const { rise, set, noon } = sunTimes(d);
  const hours = { aube: rise - 0.2, matin: rise + 0.6, jour: noon, couchant: set - 0.15, crepuscule: set + 0.45, nuit: 23.5 };
  const date = wanted in hours ? new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, Math.round(hours[wanted] * 60)) : null;
  const forced = weather in WEATHERS ? weather : null;
  const oeuvre = opus in OPUS ? opus : null;
  return date || forced || oeuvre ? { date, weather: forced, opus: oeuvre } : null;
}

// Fond de la mer (écran) : dégradé selon le ciel (reflets dorés ou roses au lever et au couchant) ; les reflets
// sont accrochés au monde (sea.js)
export function drawSea(ctx, w, h, t, phase) {
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, phase.sea[0]);
  g.addColorStop(1, phase.sea[1]);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  // La nuit, des étoiles se reflètent dans l'eau (pas sous un ciel couvert)
  const stars = (phase.night - 0.2) * (1 - phase.weather.cover);
  if (stars > 0) {
    for (let k = 0; k < 40; k++) {
      const a = stars * (0.5 + 0.5 * Math.sin(t * 2 + k * 3.1));
      ctx.fillStyle = `rgba(255,248,220,${(a * 0.7).toFixed(3)})`;
      ctx.fillRect(hash(k, 21) * w, hash(k, 29) * h, 1.6, 1.6);
    }
  }
}

// Nuages (monde) : ils traversent l'île avec le vent, haut dans le ciel, et leur ombre glisse sur la mer et le relief.
// bounds : rectangle du monde de l'île ; de près (échelle s de la caméra), ils s'effacent pour laisser voir l'île
// Les cinq premiers passent par tous les temps ; les suivants arrivent avec un ciel couvert
const CLOUDS = [
  { x: 0.08, y: 0.18, s: 2.2, v: 9 }, { x: 0.52, y: 0.38, s: 1.7, v: 12 }, { x: 0.3, y: 0.64, s: 2.6, v: 7 },
  { x: 0.78, y: 0.82, s: 1.9, v: 10 }, { x: 0.64, y: 0.06, s: 1.6, v: 8 },
  { x: 0.2, y: 0.45, s: 2.4, v: 8 }, { x: 0.9, y: 0.3, s: 2.1, v: 11 }, { x: 0.45, y: 0.9, s: 2.3, v: 9 },
  { x: 0.7, y: 0.55, s: 2.6, v: 7 }, { x: 0.02, y: 0.75, s: 2, v: 10 }, { x: 0.38, y: 0.12, s: 2.2, v: 12 }
];
const cloudsOf = phase => CLOUDS.slice(0, 5 + Math.round(phase.weather.cover * 6));
const CLOUD_ALT = 170;
function cloudAt(c, bounds, t) {
  const span = bounds.w + 600;
  const k = (c.x * span + t * c.v) / span;
  return { x: bounds.x - 300 + (k - Math.floor(k)) * span, y: bounds.y + c.y * bounds.h };
}
function blob(ctx, x, y, s) {
  ctx.beginPath();
  ctx.ellipse(x, y, 46 * s, 16 * s, 0, 0, Math.PI * 2);
  ctx.ellipse(x - 24 * s, y + 3 * s, 24 * s, 12 * s, 0, 0, Math.PI * 2);
  ctx.ellipse(x + 26 * s, y + 4 * s, 26 * s, 11 * s, 0, 0, Math.PI * 2);
  ctx.ellipse(x - 4 * s, y - 10 * s, 26 * s, 15 * s, 0, 0, Math.PI * 2);
  ctx.fill();
}
// L'ombre d'un nuage : des ronds fondus qui se chevauchent, d'un bleu-gris de sous-bois, dessinés une fois (des bords
// doux, jamais un ovale net)
let cloudShade = null;
function shadeSprite() {
  if (cloudShade || typeof document === 'undefined') return cloudShade;
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const g = canvas.getContext('2d');
  if (!g) return null;
  for (const [x, y, r] of [[128, 64, 60], [78, 70, 42], [178, 72, 44], [122, 46, 44], [100, 84, 36], [158, 84, 34]]) {
    const gr = g.createRadialGradient(x, y, 0, x, y, r);
    gr.addColorStop(0, 'rgba(18,34,44,.6)');
    gr.addColorStop(0.6, 'rgba(18,34,44,.35)');
    gr.addColorStop(1, 'rgba(18,34,44,0)');
    g.fillStyle = gr;
    g.beginPath();
    g.arc(x, y, r, 0, Math.PI * 2);
    g.fill();
  }
  cloudShade = canvas;
  return canvas;
}
// Ombres des nuages : de grandes ombres douces qui glissent sur l'île avec leur nuage, par-dessus le sol et ce qui s'y
// tient (de jour, par beau temps : sous un ciel couvert ou la pluie, la lumière est diffuse et elles s'effacent)
export function drawCloudShadows(ctx, bounds, t, phase) {
  const shade = 0.34 * (1 - phase.night) * (1 - phase.weather.cover) * (1 - Math.min(1, phase.weather.rain * 2));
  const sprite = shade >= 0.02 && shadeSprite();
  if (!sprite) return;
  ctx.save();
  ctx.globalAlpha = shade;
  // (projetées vers le bas, à côté de leur nuage : le soleil est haut)
  for (const c of cloudsOf(phase)) {
    const p = cloudAt(c, bounds, t), w = 250 * c.s;
    ctx.drawImage(sprite, p.x + 40 - w / 2, p.y - w / 4, w, w / 2);
  }
  ctx.restore();
}
export function drawClouds(ctx, bounds, t, phase, s) {
  const fade = Math.min(1, Math.max(0, (1.1 - s) / 0.5));
  if (fade <= 0) return;
  ctx.fillStyle = phase.cloud;
  ctx.globalAlpha = (0.78 - phase.night * 0.42) * (0.75 + phase.weather.cover * 0.25) * fade;
  for (const c of cloudsOf(phase)) {
    const p = cloudAt(c, bounds, t);
    blob(ctx, p.x, p.y - CLOUD_ALT, c.s);
  }
  ctx.globalAlpha = 1;
}

// Lumière de l'heure (aube grise ou dorée, midi blanc, couchant orange, crépuscule rosé, nuit bleue), en
// multiplication sur toute la scène
export function drawTint(ctx, w, h, phase) {
  if (phase.tint === '#ffffff') return;
  ctx.save();
  ctx.globalCompositeOperation = 'multiply';
  ctx.fillStyle = phase.tint;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
}

// Le voile de la brume, sur toute la scène (un étalonnage laiteux, sans forme) ; ses bancs, eux, dérivent sur l'île
// (drawWeatherMonde)
export function drawWeather(ctx, w, h, t, phase) {
  const mist = phase.weather.mist;
  if (mist <= 0.02) return;
  ctx.save();
  ctx.fillStyle = `rgba(236,239,243,${(0.3 * mist).toFixed(3)})`;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
}

// Un banc de brume : une image douce, dessinée une fois
const bancImg = () => rond('banc-de-brume', 128, [[0, 'rgba(244,246,249,1)'], [1, 'rgba(244,246,249,0)']]);
// Le temps qu'il fait, posé sur l'île (transformation du monde ; view : le rectangle du monde à l'écran ; bounds : celui
// de l'île) : la grande lueur chaude du soleil bas, venue du bord de l'île où il se lève ou se couche ; les bancs de
// brume qui dérivent lentement au-dessus des terres (par carreaux : climates.js, tuilesOf). brumeSaison : la brume des
// matins d'automne (lumiere/saisons.js), qui n'épaissit que ces bancs
export function drawWeatherMonde(ctx, view, t, phase, bounds, brumeSaison = 0) {
  const { weather, sun } = phase;
  ctx.save();
  const low = sun.up > 0 ? Math.pow(1 - sun.up, 1.6) * (1 - weather.cover) : 0;
  if (low > 0.02) {
    const x = bounds.x + bounds.w * (0.95 - 0.9 * sun.progress);
    const y = bounds.y - bounds.h * 0.05;
    const r = Math.max(bounds.w, bounds.h) * 0.6;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    const color = sun.progress < 0.5 ? '255,214,150' : '255,158,112';
    g.addColorStop(0, `rgba(${color},${(0.32 * low).toFixed(3)})`);
    g.addColorStop(0.55, `rgba(${color},${(0.1 * low).toFixed(3)})`);
    g.addColorStop(1, `rgba(${color},0)`);
    ctx.globalCompositeOperation = 'screen';
    ctx.fillStyle = g;
    ctx.fillRect(view.x, view.y, view.w, view.h);
    ctx.globalCompositeOperation = 'source-over';
  }
  const mist = Math.max(weather.mist, brumeSaison);
  if (mist > 0.02) {
    const img = bancImg();
    ctx.globalAlpha = 0.32 * mist;
    for (const T of tuilesOf(view, 0)) {
      const r = 180 + hash(T.n, 63) * 120;
      const x = T.X + ((hash(T.n, 61) * TUILE + t * (6 + hash(T.n, 62) * 4)) % TUILE);
      const y = T.Y + hash(T.n, 64) * TUILE + Math.sin(t * 0.07 + T.n) * 12;
      ctx.drawImage(img, x - r, y - r * 0.6, r * 2, r * 1.2);
    }
  }
  ctx.restore();
}

// Halo chaud (fenêtre, feu) en coordonnées de l'écran
export function glow(ctx, x, y, r, strength, color = '255,196,110') {
  if (strength <= 0) return;
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, `rgba(${color},${(0.55 * strength).toFixed(3)})`);
  g.addColorStop(0.4, `rgba(${color},${(0.22 * strength).toFixed(3)})`);
  g.addColorStop(1, `rgba(${color},0)`);
  ctx.fillStyle = g;
  ctx.fillRect(x - r, y - r, r * 2, r * 2);
}

// Lucioles : points dorés qui errent au-dessus de l'herbe, la nuit (positions dans le monde)
export function fireflies(t, n, count = 16) {
  return Array.from({ length: count }, (_, k) => {
    const cx = 1.5 + hash(k, 41) * (n - 3);
    const cy = 1.5 + hash(k, 47) * (n - 3);
    return {
      x: cx + Math.sin(t * (0.3 + hash(k, 5) * 0.3) + k) * 0.7,
      y: cy + Math.cos(t * (0.25 + hash(k, 9) * 0.3) + k * 2) * 0.7,
      z: 10 + Math.sin(t * 1.7 + k) * 6,
      a: 0.5 + 0.5 * Math.sin(t * 3 + k * 2.3)
    };
  });
}

/* ---------- Hasard déterministe ---------- */
export function hash(a, b) {
  const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
  return s - Math.floor(s);
}
