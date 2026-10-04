// Ambiance de l'île : heure du jour, fond de la mer, nuages, nuit (voile, lumières, lucioles). La vie de la mer
// (reflets, vagues, animaux, mouettes) est dans sea.js.
// Tout est déterministe en fonction du temps : pas d'état, rien à nettoyer.

const lerp = (a, b, k) => a + (b - a) * k;
const smooth = k => k * k * (3 - 2 * k);
const ramp = (h, a, b) => smooth(Math.min(1, Math.max(0, (h - a) / (b - a))));

// Moment de la journée sur l'heure locale : nuit (0 → 1), crépuscule ou aube (teinte chaude 0 → 1), nom affiché
export function phaseAt(date = new Date()) {
  const h = date.getHours() + date.getMinutes() / 60;
  // Nuit pleine de 21 h 30 à 5 h, transitions douces à l'aube et au crépuscule
  const night = h < 12 ? 1 - ramp(h, 5, 7) : ramp(h, 19.5, 21.5);
  const warm = Math.max(1 - Math.abs(h - 19.6) / 1.6, 1 - Math.abs(h - 6.4) / 1.2, 0);
  let id = 'day';
  if (h >= 5 && h < 8) id = 'dawn';
  else if (h >= 18 && h < 21) id = 'dusk';
  else if (h >= 21 || h < 5) id = 'night';
  return { id, night, warm: smooth(warm), ...PHASES[id] };
}
export const PHASES = {
  dawn: { label: 'Aube', glyph: '🌅' },
  day: { label: 'Jour', glyph: '☀️' },
  dusk: { label: 'Crépuscule', glyph: '🌸' },
  night: { label: 'Nuit', glyph: '🌙' }
};
// Moment imposé (essais) : ?heure=nuit|aube|jour|crepuscule
export function forcedPhase() {
  const wanted = new URLSearchParams(window.location.search).get('heure');
  const hours = { aube: 6.3, jour: 12, crepuscule: 19.4, nuit: 23 };
  if (!wanted || !(wanted in hours)) return null;
  const d = new Date();
  d.setHours(Math.floor(hours[wanted]), Math.round((hours[wanted] % 1) * 60), 0, 0);
  return d;
}

// Fond de la mer (écran) : dégradé selon l'heure ; les reflets sont accrochés au monde (sea.js)
export function drawSea(ctx, w, h, t, phase) {
  const top = mix('#6CC0E6', '#1D3557', phase.night);
  const bottom = mix('#3E8DBF', '#13263F', phase.night);
  const g = ctx.createLinearGradient(0, 0, 0, h);
  // Au crépuscule et à l'aube, le ciel rose se reflète en haut de la mer
  g.addColorStop(0, phase.warm > 0 ? mix(top, '#E9A6C0', phase.warm * 0.45) : top);
  g.addColorStop(1, bottom);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  // La nuit, des étoiles se reflètent dans l'eau
  if (phase.night > 0.2) {
    for (let k = 0; k < 40; k++) {
      const a = (phase.night - 0.2) * (0.5 + 0.5 * Math.sin(t * 2 + k * 3.1));
      ctx.fillStyle = `rgba(255,248,220,${(a * 0.7).toFixed(3)})`;
      ctx.fillRect(hash(k, 21) * w, hash(k, 29) * h, 1.6, 1.6);
    }
  }
}

// Nuages (monde) : ils traversent l'île avec le vent, haut dans le ciel, et leur ombre glisse sur la mer et le relief.
// bounds : rectangle du monde de l'île ; de près (échelle s de la caméra), ils s'effacent pour laisser voir l'île
const CLOUDS = [
  { x: 0.08, y: 0.18, s: 2.2, v: 9 }, { x: 0.52, y: 0.38, s: 1.7, v: 12 }, { x: 0.3, y: 0.64, s: 2.6, v: 7 },
  { x: 0.78, y: 0.82, s: 1.9, v: 10 }, { x: 0.64, y: 0.06, s: 1.6, v: 8 }
];
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
  if (phase.night > 0.6) return;
  ctx.fillStyle = `rgba(30,50,40,${(0.08 * (1 - phase.night)).toFixed(3)})`;
  // Ombres projetées vers le bas, à côté de leur nuage (le soleil est haut)
  for (const c of CLOUDS) {
    const p = cloudAt(c, bounds, t);
    blob(ctx, p.x + 40, p.y, c.s * 1.2);
  }
}
export function drawClouds(ctx, bounds, t, phase, s) {
  const fade = Math.min(1, Math.max(0, (1.1 - s) / 0.5));
  if (fade <= 0) return;
  const tone = mix('#FFFFFF', '#8E9AC0', phase.night);
  ctx.fillStyle = mixWarm(tone, phase.warm * 0.6);
  ctx.globalAlpha = (0.78 - phase.night * 0.42) * fade;
  for (const c of CLOUDS) {
    const p = cloudAt(c, bounds, t);
    blob(ctx, p.x, p.y - CLOUD_ALT, c.s);
  }
  ctx.globalAlpha = 1;
}

// Voile de la nuit et teinte du crépuscule, en multiplication sur toute la scène
export function drawTint(ctx, w, h, phase) {
  const night = mix('#FFFFFF', '#4A5A9C', phase.night * 0.9);
  const color = mixWarm(night, phase.warm * 0.45);
  if (color === '#ffffff') return;
  ctx.save();
  ctx.globalCompositeOperation = 'multiply';
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, w, h);
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

/* ---------- Couleurs et hasard déterministe ---------- */
export function hash(a, b) {
  const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
  return s - Math.floor(s);
}
function rgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function mix(a, b, k) {
  const [r1, g1, b1] = rgb(a);
  const [r2, g2, b2] = rgb(b);
  const c = [lerp(r1, r2, k), lerp(g1, g2, k), lerp(b1, b2, k)].map(v => Math.round(v).toString(16).padStart(2, '0'));
  return `#${c.join('')}`;
}
// Teinte dorée du soir et du matin
function mixWarm(hex, k) {
  return k > 0 ? mix(hex, '#FFB27A', k * 0.5) : hex;
}
