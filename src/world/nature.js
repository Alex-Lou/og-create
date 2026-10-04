// Nature variée (planche 2), animaux et socle des décorations. Emprise d'une case, ancrage au centre de la case.
import { P, box, disc, cylinder, shadow, foliage, sprite } from './iso';
import { WOOD, WOOD_DARK, STONE, LEAVES, PROP_BOX, pebble } from './palette';

const line = (a, b, color, width = 1.2) => `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${color}" stroke-width="${width}" stroke-linecap="round"/>`;
const CRITTER_BOX = { x: -16, y: -28, w: 32, h: 32 };

// Arbre générique : tronc (couleur, hauteur), houppier de trois boules, fruits éventuels
function tree(trunk, colors, fruits = null, h = 16) {
  const [x, y] = P(0, 0, 0);
  let out = shadow(0, 0, 0.34) + box(-0.06, -0.06, 0.06, 0.06, 0, h, trunk)
    + foliage(x - 7, y - h - 8, 10, colors) + foliage(x + 7, y - h - 9, 10.5, colors) + foliage(x, y - h - 18, 12, colors);
  if (fruits) {
    [[-9, -26], [5, -22], [9, -31], [-3, -36], [-6, -18]].forEach(([dx, dy]) => {
      out += `<circle cx="${x + dx}" cy="${y + dy - (h - 16)}" r="2.2" fill="${fruits}"/><circle cx="${x + dx - 0.7}" cy="${y + dy - 0.7 - (h - 16)}" r="0.7" fill="#FFFFFF" opacity=".7"/>`;
    });
  }
  return out;
}
const BIRCH_TRUNK = { top: '#F4F1EA', left: '#ECE8DE', right: '#C9C3B5' };

function birch() {
  const [x, y] = P(0, 0, 0);
  // Tronc blanc fin et ses marques sombres
  const marks = [5, 10, 15, 20].map(z => line([x - 2, y - z], [x + 1, y - z - 1], '#3D3A36', 1)).join('');
  return sprite(shadow(0, 0, 0.3) + box(-0.04, -0.04, 0.04, 0.04, 0, 24, BIRCH_TRUNK) + marks
    + foliage(x - 6, y - 30, 8, { light: '#DDF2A8', mid: '#B2DB78', dark: '#7FAF52' })
    + foliage(x + 6, y - 32, 8, { light: '#DDF2A8', mid: '#B2DB78', dark: '#7FAF52' })
    + foliage(x, y - 40, 9.5, { light: '#DDF2A8', mid: '#B2DB78', dark: '#7FAF52' }), PROP_BOX);
}
const appleTree = () => sprite(tree(WOOD_DARK, LEAVES, '#E2574C'), PROP_BOX);
const autumnTree = () => sprite(tree(WOOD_DARK, { light: '#FFD27A', mid: '#F2994A', dark: '#C8622A' }), PROP_BOX);
function stump() {
  const [x, y] = P(0, 0, 9);
  return sprite(shadow(0, 0, 0.22) + cylinder(0, 0, 0, 9, 0.16, { top: '#E7C08A', left: WOOD.left, right: WOOD.right }, 'stg')
    + `<ellipse cx="${x}" cy="${y}" rx="5.4" ry="2.7" fill="none" stroke="#B98552" stroke-width="0.8"/><ellipse cx="${x}" cy="${y}" rx="2.4" ry="1.2" fill="none" stroke="#B98552" stroke-width="0.8"/>`
    + `<path d="M${x + 7},${y + 6} q5,-1 7,3" stroke="#6DB64C" stroke-width="1.6" fill="none" stroke-linecap="round"/>`, PROP_BOX);
}
// Rondin couché : boîte le long de u et section ronde visible au bout
function log() {
  const [ex, ey] = P(0.3, 0, 5);
  return sprite(shadow(0, 0, 0.3, 0.18) + box(-0.3, -0.07, 0.3, 0.07, 0, 9, WOOD_DARK)
    + `<ellipse cx="${ex}" cy="${ey}" rx="3.4" ry="5" fill="#E7C08A" stroke="#8B5631" stroke-width="0.8"/><ellipse cx="${ex}" cy="${ey}" rx="1.3" ry="2" fill="none" stroke="#B98552" stroke-width="0.6"/>`
    + foliage(P(-0.1, 0, 10)[0], P(-0.1, 0, 10)[1], 2.6, { light: '#B3E386', mid: '#7EC45B', dark: '#4F8F3A' }), PROP_BOX);
}
function mushrooms() {
  const one = (u, v, s, cap) => {
    const [x, y] = P(u, v, 0);
    return `<rect x="${x - 1.6 * s}" y="${y - 6 * s}" width="${3.2 * s}" height="${6 * s}" rx="${1.2 * s}" fill="#FBF6EA"/>`
      + `<path d="M${x - 6 * s},${y - 5 * s} Q${x},${y - 14 * s} ${x + 6 * s},${y - 5 * s} Z" fill="${cap}"/>`
      + `<circle cx="${x - 2 * s}" cy="${y - 8 * s}" r="${1 * s}" fill="#FFFFFF"/><circle cx="${x + 2.2 * s}" cy="${y - 7 * s}" r="${0.8 * s}" fill="#FFFFFF"/>`;
  };
  return sprite(one(-0.15, -0.1, 1.2, '#E2574C') + one(0.15, 0.05, 0.85, '#E2574C') + one(-0.05, 0.2, 0.7, '#C98A4A'), PROP_BOX);
}
function reeds() {
  let out = disc(0, 0, 0, 0.36, 'rgba(90,174,215,.55)');
  [[-0.15, -0.1, 22], [0.05, -0.15, 26], [0.15, 0.05, 20], [-0.05, 0.12, 18]].forEach(([u, v, h]) => {
    const [x, y] = P(u, v, 0);
    out += line([x, y], [x + 1, y - h], '#5E9E48', 1.4) + `<rect x="${x - 1.4}" y="${y - h - 1}" width="2.8" height="7" rx="1.4" fill="#7A4E25"/>`;
  });
  return sprite(out, PROP_BOX);
}
function lilyPond() {
  const [x, y] = P(0, 0, 0);
  return sprite(disc(0, 0, 0, 0.46, '#6FC0E4') + disc(0, 0, 0, 0.38, '#5AAED7')
    + `<path d="M${x - 9},${y - 2} a5,2.6 0 1 0 4,-2 l-4,2 Z" fill="#6DB64C"/><path d="M${x + 5},${y + 3} a4,2 0 1 0 3,-2 l-3,2 Z" fill="#86CB5E"/>`
    + `<circle cx="${x - 9}" cy="${y - 4}" r="2" fill="#F7A8C8"/><circle cx="${x - 9}" cy="${y - 4}" r="0.8" fill="#FFE07A"/>`, PROP_BOX);
}
function shells() {
  const shell = (u, v, c) => {
    const [x, y] = P(u, v, 0);
    return `<path d="M${x - 3},${y} Q${x},${y - 6} ${x + 3},${y} Z" fill="${c}" stroke="rgba(120,80,60,.4)" stroke-width="0.5"/>`
      + line([x, y], [x, y - 3.5], 'rgba(120,80,60,.4)', 0.5);
  };
  return sprite(shell(-0.2, 0, '#F7C6B5') + shell(0.15, -0.15, '#FFF1DE') + shell(0.1, 0.2, '#F3D6A6') + `<circle cx="${P(-0.1, 0.25, 0)[0]}" cy="${P(-0.1, 0.25, 0)[1]}" r="2.2" fill="#EBA8C0"/>`, PROP_BOX);
}
function driftwood() {
  const a = P(-0.3, 0.1, 2);
  const b = P(0.3, -0.05, 2);
  return sprite(shadow(0, 0, 0.3, 0.14)
    + `<path d="M${a[0]},${a[1]} Q${(a[0] + b[0]) / 2},${a[1] - 4} ${b[0]},${b[1]}" stroke="#C9B39A" stroke-width="4.5" fill="none" stroke-linecap="round"/>`
    + `<path d="M${a[0] + 6},${a[1] - 3} l-4,-6" stroke="#C9B39A" stroke-width="2.4" stroke-linecap="round"/>`, PROP_BOX);
}
// Rochers ronds moussus (remplace le rocher cubique)
function mossyRocks() {
  const [x, y] = P(-0.05, -0.05, 0);
  return sprite(shadow(0, 0, 0.32)
    + `<path d="M${x - 13},${y + 2} Q${x - 14},${y - 13} ${x - 2},${y - 15} Q${x + 12},${y - 15} ${x + 12},${y} Q${x},${y + 6} ${x - 13},${y + 2} Z" fill="${STONE.left}"/>`
    + `<path d="M${x + 1},${y - 15} Q${x + 12},${y - 15} ${x + 12},${y} Q${x + 6},${y + 4} ${x + 2},${y + 3} Q${x + 6},${y - 6} ${x + 1},${y - 15} Z" fill="${STONE.right}"/>`
    + `<path d="M${x - 9},${y - 11} Q${x - 3},${y - 17} ${x + 5},${y - 13} Q${x - 1},${y - 12} ${x - 9},${y - 11} Z" fill="#8FCB6B"/>`
    + pebble(0.3, 0.2, 3.4), PROP_BOX);
}
// Lanterne sur poteau (s'allume la nuit)
function lanternPost() {
  return sprite(shadow(0, 0, 0.16, 0.18) + box(-0.03, -0.03, 0.03, 0.03, 0, 30, WOOD_DARK)
    + box(-0.07, -0.07, 0.07, 0.07, 30, 39, { top: '#3D3A36', left: '#FFE08A', right: '#E9BF4E' })
    + box(-0.09, -0.09, 0.09, 0.09, 39, 41, { top: '#55504A', left: '#3D3A36', right: '#2C2925' }), PROP_BOX);
}
function bench() {
  return sprite(shadow(0, 0, 0.3, 0.18)
    + box(-0.28, -0.05, -0.22, 0.05, 0, 6, WOOD_DARK) + box(0.22, -0.05, 0.28, 0.05, 0, 6, WOOD_DARK)
    + box(-0.32, -0.08, 0.32, 0.08, 6, 8, WOOD) + box(-0.32, -0.1, 0.32, -0.07, 8, 15, WOOD), PROP_BOX);
}
// Socle des décorations posées : dalle de pierre, plateau de bois ; l'élément flotte au-dessus
function plinth() {
  return sprite(shadow(0, 0, 0.3, 0.2) + box(-0.24, -0.24, 0.24, 0.24, 0, 4, STONE) + box(-0.18, -0.18, 0.18, 0.18, 4, 7, WOOD), PROP_BOX);
}

/* ---------- Animaux (2 images chacun) ---------- */
function chicken(f) {
  const peck = f === 1;
  const hx = peck ? 6 : 4;
  const hy = peck ? -7 : -14;
  return sprite(`<ellipse cx="0" cy="0" rx="6" ry="1.8" fill="rgba(40,55,20,.22)"/>`
    + line([-1, -3], [-1.5, 0], '#E8A13A', 1) + line([2, -3], [2.5, 0], '#E8A13A', 1)
    + `<path d="M-8,-9 Q-9,-15 -5,-14 Q-1,-14 4,-11 Q7,-6 2,-3 Q-6,-2 -8,-9 Z" fill="#FFFDF8" stroke="rgba(60,40,25,.3)" stroke-width="0.6"/>`
    + `<path d="M-4,-9 Q-1,-11 2,-8" stroke="#E6DCC8" stroke-width="1.2" fill="none"/>`
    + `<circle cx="${hx}" cy="${hy}" r="3.2" fill="#FFFDF8"/><path d="M${hx - 1},${hy - 3} q1,-3 3,0 q1,-2 2,1" fill="#E2574C"/>`
    + `<path d="M${hx + 3},${hy} l3,1 l-3,1 Z" fill="#E8A13A"/><circle cx="${hx + 1}" cy="${hy - 0.5}" r="0.7" fill="#2A2420"/>`, CRITTER_BOX);
}
function butterfly(f, color = '#F2A8D2') {
  const w = f === 0 ? 1 : 0.35;
  return sprite(`<ellipse cx="${-4 * w}" cy="-14" rx="${4 * w}" ry="3.4" fill="${color}"/><ellipse cx="${4 * w}" cy="-14" rx="${4 * w}" ry="3.4" fill="${color}"/>`
    + `<ellipse cx="${-3 * w}" cy="-10.5" rx="${2.6 * w}" ry="2.2" fill="${color}" opacity=".85"/><ellipse cx="${3 * w}" cy="-10.5" rx="${2.6 * w}" ry="2.2" fill="${color}" opacity=".85"/>`
    + `<rect x="-0.7" y="-16" width="1.4" height="8" rx="0.7" fill="#3D3A36"/>`, CRITTER_BOX);
}
function bee(f) {
  const wy = f === 0 ? -17 : -15;
  return sprite(`<ellipse cx="-2" cy="${wy}" rx="2.6" ry="1.8" fill="rgba(220,240,255,.85)"/><ellipse cx="2" cy="${wy}" rx="2.6" ry="1.8" fill="rgba(220,240,255,.85)"/>`
    + `<ellipse cx="0" cy="-12" rx="4" ry="2.8" fill="#FFD45E"/><rect x="-1.5" y="-14.6" width="1.2" height="5.2" fill="#3D3A36"/><rect x="1" y="-14.6" width="1.2" height="5.2" fill="#3D3A36"/>`, CRITTER_BOX);
}
function frog(f) {
  const hop = f === 1 ? -5 : 0;
  return sprite(`<ellipse cx="0" cy="0" rx="6" ry="1.8" fill="rgba(40,55,20,.22)"/>`
    + `<ellipse cx="0" cy="${-5 + hop}" rx="6.5" ry="4.6" fill="#7EC45B"/><ellipse cx="0" cy="${-4 + hop}" rx="4" ry="2.4" fill="#C7E98F"/>`
    + `<circle cx="-3" cy="${-9 + hop}" r="2.2" fill="#7EC45B"/><circle cx="3" cy="${-9 + hop}" r="2.2" fill="#7EC45B"/>`
    + `<circle cx="-3" cy="${-9.4 + hop}" r="1" fill="#2A2420"/><circle cx="3" cy="${-9.4 + hop}" r="1" fill="#2A2420"/>`
    + `<path d="M-2,${-5 + hop} q2,1.5 4,0" stroke="#3E7A32" stroke-width="0.8" fill="none"/>`, CRITTER_BOX);
}
function fish(f) {
  // Le poisson saute hors de l'eau (f = 0 en l'air, f = 1 qui replonge), éclaboussure au pied
  const y = f === 0 ? -14 : -6;
  const a = f === 0 ? -25 : 35;
  return sprite(`<ellipse cx="0" cy="0" rx="7" ry="2.4" fill="none" stroke="rgba(255,255,255,.8)" stroke-width="1"/>`
    + `<g transform="translate(0 ${y}) rotate(${a})"><path d="M-6,0 Q0,-4 6,0 Q0,4 -6,0 Z" fill="#7FA9C9"/><path d="M-6,0 l-4,-3 l0,6 Z" fill="#5E86A6"/><circle cx="3.4" cy="-0.6" r="0.8" fill="#1E2A36"/></g>`, CRITTER_BOX);
}

export const NATURE2 = { birch, apple: appleTree, autumn: autumnTree, stump, log, mushrooms, reeds, lily: lilyPond, shells, driftwood, mossy: mossyRocks, lantern: lanternPost, bench };
export const PLINTH = plinth;
export const CRITTERS = {
  chicken: [0, 1].map(f => () => chicken(f)),
  butterfly: [0, 1].map(f => () => butterfly(f)),
  bee: [0, 1].map(f => () => bee(f)),
  frog: [0, 1].map(f => () => frog(f)),
  fish: [0, 1].map(f => () => fish(f))
};
