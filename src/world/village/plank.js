// La planche de Léo (choix de l'auteur, 14 oct.) : au matin du jour 5, la longue-vue de Lorena la voit sur la vague ;
// elle dérive jusqu'au sable, Léo endormi dessus (game/stages.js : planche ; où elle s'échoue : WorldView castaways.js).
import { shadow, sprite } from '../iso';

// La dérive : sa durée (s), d'où elle part (cases vers le large) ; ce qui se pose dessus, à quelle hauteur (px)
const DRIFT_S = 4.5;
const DRIFT_FROM = 3;
export const PLANK_LIFT = 3;

// Où est la planche à l'instant t (s) : posée à (x, y), ou encore sur la vague, plus au large, bercée (plank : { at },
// l'instant où elle a commencé à dériver, ou null : déjà échouée)
export function plankAt(plank, x, y, t) {
  const k = plank.at === null ? 1 : (t - plank.at) / DRIFT_S;
  if (k >= 1) return { x, y, z: 0 };
  const sea = (1 - Math.max(0, k)) ** 3;
  return { x: x + Math.sin(t * 2.4) * 0.08 * sea, y: y + sea * DRIFT_FROM, z: Math.sin(t * 1.8) * 1.2 * sea };
}

// La planche de Léo (choix de l'auteur, 18 oct. : un vrai morceau de l'Hirondelle, à la hauteur du décor) : trois
// planches de pont clouées, arrachées net au bout, sur un éclat de sa coque peinte (blanc, bleu marine, liseré rouge,
// filet d'or) ; une corde nouée qui traîne sur le sable, des algues prises au passage, un coquillage ; le sable mouillé
// et l'écume de la vague qui l'a posée là. Le dormeur s'y couche (PLANK_LIFT), de gauche à droite à l'écran ; le trait
// brun et les couleurs de la bibliothèque (l'Hirondelle : decor/camp/epave)
const INK = '#3C2819';
const HULL = { white: '#F6F2E8', navy: '#2E4E8C', side: '#5E7A9E', red: '#B8483A', gold: '#C9A24A' };
const DECK = { a: '#D9AE74', b: '#CF9F63', c: '#D6A96B', edge: '#946339', end: '#A9703F', light: '#F0CC97', grain: '#B07A45', batten: '#8B5631' };
const ROPE = { body: '#E3C78E', twist: '#B89150' };
const WEED = { dark: '#5E9A3C', light: '#7DB850' };
const line = (d, color, w, extra = '') => `<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"${extra}/>`;
const shape = (d, fill, w = 0.9) => `<path d="${d}" fill="${fill}" stroke="${INK}" stroke-width="${w}" stroke-linejoin="round"/>`;
// (une corde : son trait d'encre, sa couleur, sa torsade)
const rope = d => line(d, INK, 3.1) + line(d, ROPE.body, 1.9) + line(d, ROPE.twist, 0.7, ' stroke-dasharray="1 1.5"');
// (une algue : son trait d'encre, son vert)
const weed = (d, green) => line(d, INK, 2.9) + line(d, green, 1.7);
const sparkle = (x, y, r) => `<path d="M${x},${y - r} Q${x + r * 0.2},${y - r * 0.2} ${x + r},${y} Q${x + r * 0.2},${y + r * 0.2} ${x},${y + r} Q${x - r * 0.2},${y + r * 0.2} ${x - r},${y} Q${x - r * 0.2},${y - r * 0.2} ${x},${y - r} Z" fill="#FFFFFF" opacity=".9"/>`;

// Son cadre (px, depuis l'ancre) : plus large que celui d'un objet du camp, la corde traîne loin
const PLANK_BOX = { x: -50, y: -92, w: 100, h: 116 };
const PLANK_BODY = () => '<g transform="scale(1.12)">' + [
  // Le sable mouillé autour, l'écume de la vague côté mer
  shadow(0, 0, 0.5, 0.16),
  '<ellipse cx="2" cy="4" rx="40" ry="11" fill="#B08A57" opacity=".26"/>',
  '<ellipse cx="-2" cy="5" rx="30" ry="7.5" fill="#9C774A" opacity=".2"/>',
  line('M-39,10 Q-30,14.5 -17,13.4 Q-7,12.6 1,15.4', '#FFFFFF', 1.4, ' opacity=".75"'),
  line('M-33,14.6 Q-24,17 -14,16.4', '#FFFFFF', 1, ' opacity=".5" stroke-dasharray="2.4 2"'),
  // L'éclat de coque, sous les planches : sa tranche, sa peinture (le bleu marine, le liseré rouge, le filet d'or)
  shape('M-34,8.2 L-20,10.2 L-20,12 L-34,10 Z', HULL.side, 0.8),
  '<clipPath id="planche-coque"><path d="M-39,0 L-31,-9 L-17,-11 L-10,-6 L-13,1 L-7,6 L-20,10.2 L-34,8.2 Z"/></clipPath>',
  '<path d="M-39,0 L-31,-9 L-17,-11 L-10,-6 L-13,1 L-7,6 L-20,10.2 L-34,8.2 Z" fill="' + HULL.white + '"/>',
  '<g clip-path="url(#planche-coque)">'
    + '<path d="M-41,2.4 L-10,0.4 L-5,6 L-20,12 L-36,10 Z" fill="' + HULL.navy + '"/>'
    + line('M-41,1.2 L-10,-0.8', HULL.red, 1.4)
    + line('M-32,-7.6 L-17,-9.6', HULL.gold, 1)
    + line('M-36,4.8 L-24,4', '#FFFFFF', 0.8, ' opacity=".35"')
    + '</g>',
  '<path d="M-39,0 L-31,-9 L-17,-11 L-10,-6 L-13,1 L-7,6 L-20,10.2 L-34,8.2 Z" fill="none" stroke="' + INK + '" stroke-width="1" stroke-linejoin="round"/>',
  // Les planches de pont, un peu de biais : les tasseaux qui les tenaient, puis chacune, arrachée à son bout
  '<g transform="rotate(-9)">',
  shape('M-27,-14 h4 v2.4 h-4 Z', DECK.batten, 0.8),
  shape('M-27,3 h4 v3 h-4 Z', DECK.batten, 0.8),
  shape('M-31.6,-11.4 L-30,-12 L-30,-7 L-31.6,-6.4 Z', DECK.end, 0.7),
  shape('M-30,-12 H22 L25,-10.5 L23,-9.5 L28,-8 L24,-7 H-30 Z', DECK.a),
  shape('M-34.6,-6.4 L-33,-7 L-33,-2 L-34.6,-1.4 Z', DECK.end, 0.7),
  shape('M-33,-7 H31 L34,-5 L30,-3.6 L33,-2 H-33 Z', DECK.b),
  shape('M-29,3 H22 L22,5.6 H-29 Z', DECK.edge, 0.8),
  shape('M-29,-2 H24 L27,0.5 L22,3 H-29 Z', DECK.c),
  // (leur bois : un fil de lumière, quelques veines, les clous rouillés)
  line('M-28,-11 H18', DECK.light, 0.8, ' opacity=".85"'),
  line('M-31,-6 H26', DECK.light, 0.8, ' opacity=".75"'),
  line('M-27,-1 H19', DECK.light, 0.8, ' opacity=".8"'),
  line('M-14,-9.4 H-4 M6,-9.8 H13 M-22,-4.6 H-12 M2,-4.2 H16 M-10,0.8 H4', DECK.grain, 0.6, ' opacity=".7"'),
  ...[[-25, -9.5], [-25, -4.5], [-25, 0.6], [15, -9.5], [18, -4.5], [15, 0.6]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.3" fill="${DECK.batten}" opacity=".45"/><circle cx="${x}" cy="${y}" r=".7" fill="${INK}"/>`),
  '</g>',
  // La corde nouée autour des planches, qui traîne jusqu'au sable, effilochée au bout
  rope('M11.5,-13 C13.6,-7.6 13.6,-2.4 12.2,3.6'),
  rope('M15.2,-13.3 C17.3,-7.9 17.3,-2.7 15.9,3.4'),
  `<circle cx="14.2" cy="4.4" r="2" fill="${ROPE.body}" stroke="${INK}" stroke-width=".8"/>`,
  rope('M15.4,5.6 C21,9.4 27,6.6 33,9.4 C36,10.8 38,9.2 39.4,10.2'),
  line('M39.4,10.2 L41,9.4 M39.4,10.2 L41,11 M39.4,10.2 L40.6,12', ROPE.twist, 0.6),
  // Les algues prises au passage, sur le bout gauche, qui retombent sur le sable
  weed('M-22,-11.6 C-25,-6.4 -21,-2.2 -25,3 C-27,6.2 -24,8.2 -27,10.4', WEED.dark),
  weed('M-18,-12 C-16,-6.4 -20,-3 -17,2 C-15,5 -18,7.2 -16,9.4', WEED.light),
  `<ellipse cx="-24.6" cy="-1.2" rx="2.1" ry="1.1" fill="${WEED.light}" stroke="${INK}" stroke-width=".7" transform="rotate(-30 -24.6 -1.2)"/>`,
  `<ellipse cx="-17.6" cy="4.8" rx="1.9" ry="1" fill="${WEED.dark}" stroke="${INK}" stroke-width=".7" transform="rotate(25 -17.6 4.8)"/>`,
  // Un coquillage et un galet, posés par la vague ; quelques gouttes qui brillent
  shape('M7,9.6 L3.4,6 Q7,3.4 10.6,6 Z', '#F2B7A6', 0.8),
  line('M7,9.2 L5.2,6.2 M7,9.2 L7,5 M7,9.2 L8.8,6.2', '#C9806F', 0.5),
  '<ellipse cx="25" cy="13" rx="2.6" ry="1.6" fill="#C3BBA9" stroke="' + INK + '" stroke-width=".7"/>',
  sparkle(-12, -12.6, 1.6), sparkle(27, -6.4, 1.3), sparkle(-30, 12.2, 1.1)
].join('') + '</g>';
export const PLANK_SPRITE = ['planche-ondin', () => sprite(PLANK_BODY(), PLANK_BOX)];
