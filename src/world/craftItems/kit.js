// Ce que partagent les créations d'île : feuillage, eau, fleurs, laiton, mousse, et les petits outils (piquets, rails,
// fleurs, feuilles, flammes).
import { WOOD, WOOD_DARK } from '../palette';
import { ln, dot, f2 } from '../spriteKit';

const TAU = Math.PI * 2;

const LEAF = '#5FA04A';

const LEAF_LIGHT = '#8FCB6A';

const LEAF_DARK = '#3F7A34';

const WATER = '#5BAFD8';

const WATER_LIGHT = '#9AD6F0';

const FLOWERS = ['#E8566A', '#F2C04B', '#B48AE0', '#FFFFFF', '#F08A3A'];

const BRASS = { top: '#F4D67A', left: '#E2B546', right: '#B88A2E' };

const MOSS = 'rgba(95,160,74,.75)';

/* ---------- Petits outils ---------- */
// Poteau de bois carré, de z0 à z1
const post = (T, du, dv, z0, z1, colors = WOOD_DARK, w = 0.024) => T.box(du - w, dv - w, du + w, dv + w, z0, z1, colors);

// Lisse entre deux points du sol, à la hauteur z
const rail = (T, a, b, z, w = 2.2) => ln(T.p(a[0], a[1], z), T.p(b[0], b[1], z), WOOD_DARK.right, w) + ln(T.p(a[0], a[1], z + 0.6), T.p(b[0], b[1], z + 0.6), WOOD.top, w * 0.45);

// Fleur (en pixels) : tige, corolle de cinq pétales, cœur
function flower(x, y, h, color, sway = 0, r = 1.6) {
  const tx = x + sway, ty = y - h;
  const petals = Array.from({ length: 5 }, (_, k) => {
    const a = (k / 5) * TAU;
    return dot(tx + Math.cos(a) * r * 0.8, ty + Math.sin(a) * r * 0.55, r * 0.62, color);
  }).join('');
  return `<path d="M${f2(x)},${f2(y)} q${f2(sway * 0.2)},${f2(-h * 0.5)} ${f2(sway)},${f2(-h)}" stroke="${LEAF_DARK}" stroke-width="0.8" fill="none"/>` + petals + dot(tx, ty, r * 0.4, '#F7E27A');
}

// Touffe de feuilles (en pixels)
const leaves = (x, y, r) => dot(x + r * 0.2, y + r * 0.2, r, LEAF_DARK) + dot(x, y, r * 0.9, LEAF) + dot(x - r * 0.3, y - r * 0.3, r * 0.4, LEAF_LIGHT);

// Flamme (en pixels) : trois couches, du rouge au blanc ; k : battement (0 à 1)
function flame(x, y, h, w, k) {
  const tip = (s, dx) => `M${f2(x - w * s)},${f2(y)} Q${f2(x - w * s * 1.1)},${f2(y - h * s * 0.55)} ${f2(x + dx)},${f2(y - h * s)} Q${f2(x + w * s * 1.1)},${f2(y - h * s * 0.55)} ${f2(x + w * s)},${f2(y)} Z`;
  const sway = Math.sin(k * TAU) * w * 0.35;
  return `<path d="${tip(1, sway)}" fill="#E8573A"/><path d="${tip(0.72, sway * 0.6)}" fill="#F59A3C"/><path d="${tip(0.42, sway * 0.3)}" fill="#FFE08A"/>`;
}

export { TAU, LEAF, LEAF_LIGHT, LEAF_DARK, WATER, WATER_LIGHT, FLOWERS, BRASS, MOSS, post, rail, flower, leaves, flame };
