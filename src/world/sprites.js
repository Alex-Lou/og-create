// Éléments de nature de l'île (arbre, pin, palmier, buisson, rochers, fleurs, touffe), dessinés en SVG sur la
// géométrie isométrique commune (world/iso.js) : emprise d'une case (u, v ∈ [-0.5, 0.5]), ancrés au centre de la case.
import { P, box, shadow, foliage, sprite, boulder } from './iso';
import { WOOD, WOOD_DARK, LEAVES, PINE, PROP_BOX, pebble, roundTree } from './palette';

function treeProp() {
  return sprite(roundTree(0, 0, 1), PROP_BOX);
}
function pineProp() {
  const [x, y] = P(0, 0, 0);
  const tier = (yy, w, h, k) => `<path d="M${x - w},${yy} L${x},${yy - h} L${x + w},${yy} Z" fill="${PINE.dark}"/><path d="M${x - w + 2},${yy - 1} L${x},${yy - h} L${x + 1},${yy - 1} Z" fill="${k ? PINE.mid : PINE.light}"/>`;
  return sprite(shadow(0, 0, 0.3) + box(-0.05, -0.05, 0.05, 0.05, 0, 12, WOOD_DARK) + tier(y - 8, 15, 22, 1) + tier(y - 20, 12, 20, 1) + tier(y - 31, 9, 18, 0), PROP_BOX);
}
function palmProp() {
  const [x, y] = P(0, 0, 0);
  const tx = x + 8;
  const ty = y - 50;
  // Tronc courbe, anneaux sombres
  const trunk = `<path d="M${x - 2},${y} C${x - 4},${y - 20} ${x + 2},${y - 36} ${tx},${ty}" stroke="${WOOD.left}" stroke-width="5.5" fill="none" stroke-linecap="round"/>`
    + `<path d="M${x - 2},${y} C${x - 4},${y - 20} ${x + 2},${y - 36} ${tx},${ty}" stroke="${WOOD.right}" stroke-width="5.5" fill="none" stroke-dasharray="1.6 3.4"/>`;
  // Palme : feuille pleine et arquée, du cœur vers (dx, dy)
  const frond = (dx, dy, c) => {
    const mx = tx + dx * 0.5;
    const my = ty + dy * 0.5 - 9;
    // Largeur de la feuille : décalage perpendiculaire des deux bords autour de la nervure
    const len = Math.hypot(dx, dy) || 1;
    const nx = (-dy / len) * 5;
    const ny = (dx / len) * 5;
    return `<path d="M${tx},${ty} Q${mx + nx},${my + ny} ${tx + dx},${ty + dy} Q${mx - nx},${my - ny} ${tx},${ty} Z" fill="${c}"/>`
      + `<path d="M${tx},${ty} Q${mx},${my} ${tx + dx},${ty + dy}" stroke="rgba(30,70,30,.35)" stroke-width="0.8" fill="none"/>`;
  };
  return sprite(shadow(0.1, 0, 0.3) + trunk
    + frond(-22, 4, PINE.dark) + frond(22, 6, PINE.dark)
    + frond(-15, 14, PINE.mid) + frond(16, 15, PINE.mid)
    + frond(-8, -12, LEAVES.mid) + frond(10, -11, LEAVES.light)
    + `<circle cx="${tx - 2}" cy="${ty + 3}" r="2.6" fill="#8A5A2B"/><circle cx="${tx + 3}" cy="${ty + 4}" r="2.6" fill="#6E4520"/>`, PROP_BOX);
}
function bushProp() {
  const [x, y] = P(0, 0, 0);
  return sprite(shadow(0, 0, 0.32) + foliage(x - 7, y - 6, 8, LEAVES) + foliage(x + 7, y - 6, 8.5, LEAVES) + foliage(x, y - 12, 9, LEAVES)
    + `<circle cx="${x - 5}" cy="${y - 14}" r="1.8" fill="#F27A9A"/><circle cx="${x + 6}" cy="${y - 10}" r="1.8" fill="#F27A9A"/><circle cx="${x + 1}" cy="${y - 4}" r="1.8" fill="#FFFFFF"/>`, PROP_BOX);
}
// Rochers du sol rocheux, en granit à facettes : un bloc, un amas, une aiguille ; lichen sur les plus gros
const GRANITE = { top: '#CBC6BA', left: '#A6A094', right: '#7E786E' };
const lichen = (u, v, z) => { const [x, y] = P(u, v, z); return `<ellipse cx="${x}" cy="${y}" rx="2.6" ry="1.3" fill="#B7C46C" opacity=".85"/>`; };
const rockProp = () => sprite(shadow(0, 0, 0.3) + boulder(0, 0, 0.3, 0.26, 12, GRANITE, 1) + lichen(-0.06, -0.08, 11) + pebble(-0.32, 0.26, 3, GRANITE), PROP_BOX);
const rocksProp = () => sprite(shadow(0, 0, 0.34) + boulder(-0.12, -0.1, 0.26, 0.22, 13, GRANITE, 2) + boulder(0.2, 0.14, 0.16, 0.14, 7, GRANITE, 3)
  + boulder(-0.26, 0.22, 0.1, 0.09, 4, GRANITE, 4) + lichen(-0.17, -0.16, 12), PROP_BOX);
const cragProp = () => sprite(shadow(0, 0, 0.3) + boulder(0, 0, 0.27, 0.23, 26, GRANITE, 5, 0.35, 0.35) + boulder(0.22, 0.14, 0.13, 0.11, 8, GRANITE, 6)
  + pebble(-0.3, 0.2, 2.6, GRANITE), PROP_BOX);
function flowersProp() {
  let out = '';
  const spots = [[-0.25, -0.2, '#F27A9A'], [0.15, -0.25, '#FFD45E'], [0.25, 0.1, '#FFFFFF'], [-0.1, 0.2, '#B9A0F0'], [-0.3, 0.1, '#FFD45E'], [0.05, 0.0, '#F27A9A']];
  spots.forEach(([u, v, c]) => {
    const [x, y] = P(u, v, 0);
    out += `<path d="M${x},${y} q-1,-4 0,-8" stroke="#5DAA45" stroke-width="1.4" fill="none"/>`
      + [0, 72, 144, 216, 288].map(a => `<circle cx="${x + Math.cos((a * Math.PI) / 180) * 2.2}" cy="${y - 9 + Math.sin((a * Math.PI) / 180) * 2.2}" r="1.7" fill="${c}"/>`).join('')
      + `<circle cx="${x}" cy="${y - 9}" r="1.2" fill="#E8A13A"/>`;
  });
  return sprite(out, PROP_BOX);
}
function tuftProp() {
  const [x, y] = P(0, 0, 0);
  return sprite(`<path d="M${x - 6},${y} q1,-8 -2,-12 M${x - 2},${y} q0,-10 1,-14 M${x + 2},${y} q1,-9 4,-12 M${x + 6},${y} q0,-6 3,-9" stroke="#5DAA45" stroke-width="2" fill="none" stroke-linecap="round"/>`, PROP_BOX);
}

export const NATURE = { tree: treeProp, pine: pineProp, palm: palmProp, bush: bushProp, rock: rockProp, rocks: rocksProp, crag: cragProp, flowers: flowersProp, tuft: tuftProp };
