// Ambiance de l'île : heure du jour, mer, nuages, mouettes, nuit (voile, lumières, lucioles).
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

// Mer : dégradé selon l'heure, reflets qui dérivent
export function drawSea(ctx, w, h, t, phase) {
  const top = mix('#6CC0E6', '#1D3557', phase.night);
  const bottom = mix('#3E8DBF', '#13263F', phase.night);
  const g = ctx.createLinearGradient(0, 0, 0, h);
  // Au crépuscule et à l'aube, le ciel rose se reflète en haut de la mer
  g.addColorStop(0, phase.warm > 0 ? mix(top, '#E9A6C0', phase.warm * 0.45) : top);
  g.addColorStop(1, bottom);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  // Reflets : petits traits clairs qui dérivent lentement
  ctx.lineCap = 'round';
  for (let k = 0; k < 26; k++) {
    const seed = hash(k, 7);
    const x = ((seed * w * 1.3 + t * (6 + seed * 8)) % (w + 60)) - 30;
    const y = (hash(k, 13) * h * 0.98) + Math.sin(t * 0.8 + k) * 2;
    const len = 6 + hash(k, 3) * 12;
    const a = (0.18 + 0.22 * Math.sin(t * 1.3 + k * 1.7) ** 2) * (1 - phase.night * 0.6);
    ctx.strokeStyle = `rgba(255,255,255,${a.toFixed(3)})`;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + len / 2, y - 2, x + len, y);
    ctx.stroke();
  }
  // La nuit, des étoiles se reflètent dans l'eau
  if (phase.night > 0.2) {
    for (let k = 0; k < 40; k++) {
      const a = (phase.night - 0.2) * (0.5 + 0.5 * Math.sin(t * 2 + k * 3.1));
      ctx.fillStyle = `rgba(255,248,220,${(a * 0.7).toFixed(3)})`;
      ctx.fillRect(hash(k, 21) * w, hash(k, 29) * h, 1.6, 1.6);
    }
  }
}

// Nuages (écran) : ombres sur l'île puis nuages légers, qui traversent lentement
// Les nuages restent au-dessus de la mer (haut et bas de la scène) : seules leurs ombres passent sur l'île
const CLOUDS = [{ y: 0.07, s: 0.9, v: 7, o: 0 }, { y: 0.95, s: 0.75, v: 10, o: 0.45 }, { y: 0.03, s: 0.55, v: 5, o: 0.75 }];
function cloudX(c, w, t) {
  const span = w + 260;
  return ((t * c.v + c.o * span) % span) - 130;
}
function blob(ctx, x, y, s) {
  ctx.beginPath();
  ctx.ellipse(x, y, 46 * s, 16 * s, 0, 0, Math.PI * 2);
  ctx.ellipse(x - 24 * s, y + 3 * s, 24 * s, 12 * s, 0, 0, Math.PI * 2);
  ctx.ellipse(x + 26 * s, y + 4 * s, 26 * s, 11 * s, 0, 0, Math.PI * 2);
  ctx.ellipse(x - 4 * s, y - 10 * s, 26 * s, 15 * s, 0, 0, Math.PI * 2);
  ctx.fill();
}
export function drawCloudShadows(ctx, w, h, t, phase) {
  if (phase.night > 0.6) return;
  ctx.fillStyle = `rgba(30,50,40,${(0.09 * (1 - phase.night)).toFixed(3)})`;
  // Ombres projetées vers le bas de l'écran, loin de leur nuage (le soleil est haut)
  for (const c of CLOUDS) blob(ctx, cloudX(c, w, t) + 50 * c.s, (c.y < 0.5 ? 0.42 : 0.62) * h, c.s * 1.25);
}
export function drawClouds(ctx, w, h, t, phase) {
  const tone = mix('#FFFFFF', '#8E9AC0', phase.night);
  for (const c of CLOUDS) {
    const x = cloudX(c, w, t);
    ctx.fillStyle = mixWarm(tone, phase.warm * 0.6);
    ctx.globalAlpha = 0.82 - phase.night * 0.45;
    blob(ctx, x, c.y * h, c.s);
    ctx.globalAlpha = 1;
  }
}

// Mouettes : un petit vol traverse l'écran de temps en temps, ailes battantes
export function drawBirds(ctx, w, h, t, phase) {
  if (phase.night > 0.6) return;
  const cycle = 26;
  const k = (t % cycle) / cycle;
  if (k > 0.55) return;
  const x0 = -40 + (k / 0.55) * (w + 80);
  const y0 = h * 0.22 + Math.sin(k * 6) * 10;
  ctx.strokeStyle = `rgba(60,55,50,${(0.75 * (1 - phase.night)).toFixed(3)})`;
  ctx.lineWidth = 1.6;
  ctx.lineCap = 'round';
  [[0, 0], [-16, 9], [-30, -4]].forEach(([dx, dy], i) => {
    const flap = Math.sin(t * 9 + i * 1.3) * 4;
    const x = x0 + dx;
    const y = y0 + dy;
    ctx.beginPath();
    ctx.moveTo(x - 7, y - flap);
    ctx.quadraticCurveTo(x - 3, y - 3, x, y);
    ctx.quadraticCurveTo(x + 3, y - 3, x + 7, y - flap);
    ctx.stroke();
  });
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
