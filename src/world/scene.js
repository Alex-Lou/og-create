// Ambiance de l'île : fond de la mer, nuages, teinte de l'heure, temps qu'il fait (soleil bas, brume, pluie, éclairs,
// arc-en-ciel), lumières et lucioles. Le ciel lui-même (soleil, météo, couleurs minute par minute) est dans sky.js ;
// la vie de la mer (reflets, vagues, animaux, mouettes) dans sea.js.
// Tout est déterministe en fonction du temps : pas d'état, rien à nettoyer.
import { skyAt, sunTimes, WEATHERS } from './sky';

// Ciel de l'île à une date (voir sky.js) : moment, nuit, chaleur, lumières, teinte, mer, nuages, soleil, météo
export const phaseAt = (date = new Date(), forced = {}) => skyAt(date, forced);

// Moment ou temps imposés (essais) : ?heure=nuit|aube|matin|jour|couchant|crepuscule et ?meteo=clair|voile|brume|pluie|orage
export function forcedPhase() {
  const query = new URLSearchParams(window.location.search);
  const wanted = query.get('heure');
  const weather = query.get('meteo');
  const d = new Date();
  const { rise, set, noon } = sunTimes(d);
  const hours = { aube: rise - 0.2, matin: rise + 0.6, jour: noon, couchant: set - 0.15, crepuscule: set + 0.45, nuit: 23.5 };
  const date = wanted in hours ? new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, Math.round(hours[wanted] * 60)) : null;
  const forced = weather in WEATHERS ? weather : null;
  return date || forced ? { date, weather: forced } : null;
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
export function drawCloudShadows(ctx, bounds, t, phase) {
  // Sous un ciel couvert la lumière est diffuse : les ombres s'effacent
  const shade = 0.08 * (1 - phase.night) * (1 - phase.weather.cover * 0.7);
  if (shade < 0.01) return;
  ctx.fillStyle = `rgba(30,50,40,${shade.toFixed(3)})`;
  // Ombres projetées vers le bas, à côté de leur nuage (le soleil est haut)
  for (const c of cloudsOf(phase)) {
    const p = cloudAt(c, bounds, t);
    blob(ctx, p.x + 40, p.y, c.s * 1.2);
  }
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

// Temps qu'il fait, par-dessus la scène (écran) : lumière rasante du soleil bas, brume du matin, arc-en-ciel après la
// pluie, pluie, éclairs d'orage
export function drawWeather(ctx, w, h, t, phase) {
  const { weather, sun } = phase;
  ctx.save();
  // Soleil bas : une grande lueur chaude venue du côté du soleil (de la droite le matin, de la gauche le soir)
  const low = sun.up > 0 ? Math.pow(1 - sun.up, 1.6) * (1 - weather.cover) : 0;
  if (low > 0.02) {
    const x = w * (0.95 - 0.9 * sun.progress);
    const r = Math.max(w, h) * 0.95;
    const g = ctx.createRadialGradient(x, -h * 0.05, 0, x, -h * 0.05, r);
    const color = sun.progress < 0.5 ? '255,214,150' : '255,158,112';
    g.addColorStop(0, `rgba(${color},${(0.32 * low).toFixed(3)})`);
    g.addColorStop(0.55, `rgba(${color},${(0.1 * low).toFixed(3)})`);
    g.addColorStop(1, `rgba(${color},0)`);
    ctx.globalCompositeOperation = 'screen';
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'source-over';
  }
  // Brume : un voile laiteux et des bancs clairs qui dérivent lentement
  if (weather.mist > 0.02) {
    ctx.fillStyle = `rgba(236,239,243,${(0.3 * weather.mist).toFixed(3)})`;
    ctx.fillRect(0, 0, w, h);
    for (let k = 0; k < 4; k++) {
      const y = h * (0.2 + k * 0.22) + Math.sin(t * 0.07 + k) * 12;
      const x = ((t * (6 + k * 2) + hash(k, 61) * w) % (w * 1.6)) - w * 0.3;
      const g = ctx.createRadialGradient(x, y, 0, x, y, w * 0.45);
      g.addColorStop(0, `rgba(244,246,249,${(0.32 * weather.mist).toFixed(3)})`);
      g.addColorStop(1, 'rgba(244,246,249,0)');
      ctx.fillStyle = g;
      ctx.fillRect(x - w * 0.45, y - w * 0.45, w * 0.9, w * 0.9);
    }
  }
  // Arc-en-ciel, à l'opposé du soleil, juste après une averse
  if (weather.rainbow > 0.02 && sun.up > 0) {
    const cx = w * (0.15 + 0.7 * sun.progress);
    const r = h * 0.85;
    ['#E2463A', '#F08A3A', '#F2C04B', '#7EC45B', '#5AAED7', '#5C6FC2', '#9C6FD0'].forEach((c, i) => {
      ctx.strokeStyle = c;
      ctx.globalAlpha = 0.2 * weather.rainbow;
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.arc(cx, h * 1.02, r - i * 7, Math.PI, Math.PI * 2);
      ctx.stroke();
    });
    ctx.globalAlpha = 1;
  }
  // Pluie : traits fins qui tombent en biais (un seul tracé)
  if (weather.rain > 0.02) {
    const count = Math.round(220 * weather.rain);
    ctx.strokeStyle = phase.night > 0.5 ? 'rgba(205,218,242,.42)' : 'rgba(168,186,212,.6)';
    ctx.lineWidth = 1.15;
    ctx.beginPath();
    for (let k = 0; k < count; k++) {
      const speed = 0.9 + hash(k, 3) * 0.5;
      const y = (((hash(k, 2) + t * speed) % 1) * (h + 40)) - 20;
      const x = ((hash(k, 1) * (w + 60) + t * 40 + y * 0.25) % (w + 60)) - 30;
      const len = 9 + hash(k, 4) * 8;
      ctx.moveTo(x, y);
      ctx.lineTo(x - len * 0.25, y - len);
    }
    ctx.stroke();
  }
  // Orage : un éclair de temps en temps (double clignement), toute la scène blanchit un instant
  if (weather.storm > 0.5) {
    const period = 9.7;
    const cycle = Math.floor(t / period);
    const into = t - cycle * period;
    if (hash(cycle, 71) > 0.35 && into < 0.45) {
      const flash = into < 0.12 ? 1 - into / 0.12 : into > 0.22 && into < 0.45 ? 0.7 * (1 - (into - 0.22) / 0.23) : 0;
      ctx.fillStyle = `rgba(240,244,255,${(0.42 * flash * weather.storm).toFixed(3)})`;
      ctx.fillRect(0, 0, w, h);
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
