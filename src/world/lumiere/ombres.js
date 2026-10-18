// Ombres vivantes : d'où vient la lumière qui porte les ombres (soleil, lune selon sa phase réelle, éclair) et les
// ombres portées des bâtiments sur le sol (mauves à l'heure dorée).
import { goldenOf } from './heureDoree';
import { soleilOf } from './soleil';

// Lune : âge dans sa lunaison (jours) et part éclairée (0 nouvelle lune, 1 pleine lune), d'après la date réelle
const LUNAISON = 29.530588853;
const NOUVELLE_LUNE = Date.UTC(2000, 0, 6, 18, 14);
// Où se tient la lune, la nuit (choix de l'auteur, 15 oct. : elle se lève au nord-ouest) : au large du rivage nord-ouest
// de l'île, en fractions de son étendue dans le monde (terrain.bounds). Sa lueur à la veillée (view/draw/veillee.js), son
// chemin sur la mer (rivage.js : glitterOf), son halo (aurore.js) et les ombres qu'elle porte en partent
export const PLACE_LUNE = { x: 0.22, y: 0.04 };
export function moonOf(date) {
  const age = ((((date - NOUVELLE_LUNE) / 864e5) % LUNAISON) + LUNAISON) % LUNAISON;
  return { age, light: (1 - Math.cos((2 * Math.PI * age) / LUNAISON)) / 2 };
}

// Enveloppe convexe de points (monotone chain)
function hull(points) {
  const p = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lower = [];
  for (const q of p) { while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], q) <= 0) lower.pop(); lower.push(q); }
  const upper = [];
  for (const q of p.reverse()) { while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], q) <= 0) upper.pop(); upper.push(q); }
  return lower.slice(0, -1).concat(upper.slice(0, -1));
}

// D'où vient la lumière qui porte les ombres, et avec quelle force : le soleil le jour (de son côté : soleil.js ; long le
// matin et le soir, court à midi, pâle sous les nuages), la lune la nuit (selon sa phase), rien entre les deux. dx, dy :
// où tombe l'ombre (à l'opposé de la lumière)
export function shadowLight(phase, date, orage = null) {
  const { sun, weather } = phase;
  // l'éclair : une lumière dure et brève venue de son côté
  if (orage && orage.flash > 0.12) return { dx: (0.5 - orage.x) * 2.6, dy: -0.35, a: 0.55 * Math.min(1, orage.flash) };
  if (sun.up > 0.02) {
    const { est, sud } = soleilOf(sun);
    const along = 0.55 + 1.9 * Math.pow(1 - sun.up, 1.4);
    return { dx: -est * along, dy: -0.42 * sud * along - 0.12, a: 0.24 * Math.min(1, sun.up * 4) * (1 - 0.85 * weather.cover), golden: goldenOf(phase).k };
  }
  if (phase.night > 0.5) {
    const moon = moonOf(date);
    // (venue du nord-ouest, en haut à gauche : les ombres tombent vers le bas à droite)
    return { dx: 0.49, dy: 0.4, a: 0.11 * moon.light * (phase.night - 0.5) * 2 * (1 - 0.9 * weather.cover) };
  }
  return null;
}

// La teinte d'une ombre : bleu nuit, qui vire au mauve à l'heure dorée (golden : 0 à 1)
export function shadowTint(golden = 0) {
  return [[52, 92], [56, 58], [96, 118]].map(([a, b]) => Math.round(a + (b - a) * golden)).join(',');
}

// Ombres portées des bâtiments sur le sol. shapes : [{ x, y, hw, hh, h }] (centre de l'emprise dans le monde, demi-
// emprise en cases, hauteur en unités du monde). Trois passes de plus en plus longues et légères : la pénombre.
export function drawShadows(ctx, shapes, light) {
  if (!light || light.a <= 0.005 || !shapes.length) return;
  const tint = shadowTint(light.golden || 0);
  ctx.save();
  ctx.globalCompositeOperation = 'multiply';
  for (const [k, w] of [[0.8, 0.5], [1, 0.32], [1.22, 0.18]]) {
    ctx.fillStyle = `rgba(${tint},${(light.a * w * 2.2).toFixed(3)})`;
    ctx.beginPath();
    for (const s of shapes) {
      const base = [[-s.hw, -s.hh], [s.hw, -s.hh], [s.hw, s.hh], [-s.hw, s.hh]].map(([u, v]) => [s.x + (u - v) * 32, s.y + (u + v) * 16]);
      const ox = light.dx * s.h * k, oy = light.dy * s.h * k;
      const poly = hull([...base, ...base.map(([x, y]) => [x + ox, y + oy])]);
      ctx.moveTo(poly[0][0], poly[0][1]);
      for (let i = 1; i < poly.length; i++) ctx.lineTo(poly[i][0], poly[i][1]);
      ctx.closePath();
    }
    ctx.fill();
  }
  ctx.restore();
}
