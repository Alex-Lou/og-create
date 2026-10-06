// Planche de la mer : dauphins, baleine, poissons qui sautent, mouettes posées. Ancrage : le point à la surface
// de l'eau (ou au sol pour la mouette), en unités du monde. Les dessins regardent vers la droite.
import { sprite } from './iso.js';

const DOLPHIN_BOX = { x: -26, y: -22, w: 52, h: 36 };
const FISH_BOX = { x: -16, y: -28, w: 32, h: 32 };
const GULL_BOX = { x: -12, y: -15, w: 24, h: 17 };

// Dauphin, penché selon le moment du saut : 0 il sort de l'eau, 1 au sommet, 2 il replonge
function dolphin(frame) {
  const a = [-32, 0, 32][frame];
  return sprite(`<g transform="rotate(${a})">`
    + '<path d="M-15,0 L-20.5,-4.4 L-18.2,0 L-20.5,4.4 Z" fill="#5A82A8"/>'
    + '<path d="M-15,0 C-8,-6.6 5,-7.6 11.6,-4.2 C13.4,-3.2 14,-2.2 14.4,-1.4 L18.4,-0.8 L13.6,0.8 C6,3.6 -6,3.2 -15,0 Z" fill="#729DC6"/>'
    + '<path d="M-12,0.8 C-4,3.2 6,3.3 13,0.7 C6,2 -4,2.3 -12,0.8 Z" fill="#DCE8F1"/>'
    + '<path d="M-3,-5.4 Q-0.6,-10.4 3.6,-9.6 Q1.6,-7.6 2.6,-5.2 Z" fill="#5A82A8"/>'
    + '<path d="M3,1.6 L-0.4,5.4 L6.2,2.2 Z" fill="#5A82A8"/>'
    + '<path d="M-10,-3.4 C-3,-6.2 5,-6.4 10,-3.8" stroke="#8FB0CC" stroke-width="1" fill="none" opacity=".7"/>'
    + '<circle cx="10.8" cy="-2.6" r="0.95" fill="#13212E"/>'
    + '<path d="M13.6,-0.9 q2,0.7 3.8,0" stroke="#3B5872" stroke-width=".6" fill="none"/>'
    + '</g>', DOLPHIN_BOX);
}

// Dos de la baleine qui affleure, son évent et l'écume autour
function whaleBack() {
  return sprite('<ellipse cx="0" cy="3" rx="47" ry="5.4" fill="rgba(255,255,255,.18)" stroke="rgba(255,255,255,.7)" stroke-width="1.3"/>'
    + '<path d="M-44,2.4 C-30,-10 10,-14.5 36,-5.2 C42,-2.4 44.5,0.8 40,3 C10,5.2 -20,5.2 -44,2.4 Z" fill="#3E5468"/>'
    + '<path d="M-30,-4.4 C-10,-11.4 14,-11.6 30,-6.2" stroke="#7690A6" stroke-width="1.6" fill="none" opacity=".75"/>'
    + '<path d="M-17,-8.2 L-12,-15 L-7.6,-8.8 Z" fill="#33475A"/>'
    + '<ellipse cx="27" cy="-6.6" rx="2" ry="0.9" fill="#26384A"/>'
    + '<path d="M-40,3.2 C-20,4.6 14,4.8 39,3.4" stroke="rgba(255,255,255,.85)" stroke-width="1.2" fill="none"/>',
  { x: -50, y: -18, w: 100, h: 27 });
}

// Queue de la baleine dressée avant la plongée, qui s'égoutte
function whaleFluke() {
  return sprite('<ellipse cx="0" cy="4" rx="13" ry="3.2" fill="rgba(255,255,255,.2)" stroke="rgba(255,255,255,.8)" stroke-width="1.2"/>'
    + '<path d="M-2.4,4 C-2.4,-6 -1.2,-12 0,-16 C1.2,-12 2.4,-6 2.4,4 Z" fill="#3E5468"/>'
    + '<path d="M0,-15.4 C-6,-20 -14,-24.6 -23,-22.4 C-16,-17 -8,-14.6 0,-13.6 C8,-14.6 16,-17 23,-22.4 C14,-24.6 6,-20 0,-15.4 Z" fill="#33475A"/>'
    + '<path d="M-19,-21.6 C-12,-21 -6,-18.6 -1,-15.6" stroke="#7690A6" stroke-width="1" fill="none" opacity=".7"/>'
    + '<circle cx="-16" cy="-17" r="1" fill="#E8F6FF"/><circle cx="14" cy="-15.4" r="1.1" fill="#E8F6FF"/><circle cx="6" cy="-9" r="0.8" fill="#E8F6FF"/>',
  { x: -26, y: -30, w: 52, h: 38 });
}

// Poisson qui saute (0 en l'air, 1 qui replonge), éclaboussure au pied ; ailes déployées pour le poisson volant
function fishJump(frame, { body, back, band, wings, size = 1 }) {
  const y = frame === 0 ? -14 : -6;
  const a = frame === 0 ? -25 : 35;
  const wing = wings ? `<path d="M-1,-0.6 L-5,-7.5 L3,-1.4 Z" fill="${wings}" opacity=".9"/><path d="M-1,0.6 L-4,6 L2.6,1.2 Z" fill="${wings}" opacity=".75"/>` : '';
  const stripe = band ? `<path d="M-1.5,-3.2 Q0,0 -1.5,3.2" stroke="${band}" stroke-width="1.4" fill="none"/>` : '';
  return sprite('<ellipse cx="0" cy="0" rx="7" ry="2.4" fill="none" stroke="rgba(255,255,255,.8)" stroke-width="1"/>'
    + `<g transform="translate(0 ${y}) rotate(${a}) scale(${size})">${wing}`
    + `<path d="M-6,0 Q0,-4 6,0 Q0,4 -6,0 Z" fill="${body}"/><path d="M-5,-0.6 Q0,-3.6 5.4,-0.4 Q0,-1.6 -5,-0.6 Z" fill="${back}"/>${stripe}`
    + `<path d="M-6,0 l-4,-3 l0,6 Z" fill="${back}"/><circle cx="3.4" cy="-0.6" r="0.8" fill="#1E2A36"/></g>`, FISH_BOX);
}
const SPECIES = {
  sardine: { body: '#C7D7E2', back: '#5B7A92', size: 0.85 },
  dorade: { body: '#F0C4B2', back: '#C98A78', band: '#E7C35A' },
  volant: { body: '#7FB0DE', back: '#3F6FA8', wings: '#B9DBF7' }
};

// Mouette posée : 0 au repos, 1 la tête tournée, le bec ouvert
function gull(frame) {
  const head = frame === 0 ? { x: 4.2, y: -10 } : { x: 4.8, y: -9.3 };
  const beak = frame === 0
    ? `<path d="M${head.x + 2.1},${head.y} L${head.x + 4.8},${head.y + 0.6} L${head.x + 2.1},${head.y + 1} Z" fill="#F2C443"/>`
    : `<path d="M${head.x + 2},${head.y - 0.2} L${head.x + 4.6},${head.y - 0.9} L${head.x + 2.2},${head.y + 0.4} L${head.x + 4.4},${head.y + 1.4} L${head.x + 2},${head.y + 0.9} Z" fill="#F2C443"/>`;
  return sprite('<ellipse cx="0.5" cy="0.2" rx="4.6" ry="1.3" fill="rgba(40,55,20,.2)"/>'
    + '<line x1="-1.2" y1="0" x2="-1.6" y2="-3.8" stroke="#E79A3C" stroke-width="0.9" stroke-linecap="round"/><line x1="1.2" y1="0" x2="1" y2="-3.8" stroke="#E79A3C" stroke-width="0.9" stroke-linecap="round"/>'
    + '<ellipse cx="0" cy="-6.6" rx="5.2" ry="3.4" fill="#FFFFFF"/>'
    + '<path d="M-5.2,-7.2 C-2,-9.8 3,-9.2 4.6,-6.6 C2,-5 -2,-4.6 -6.6,-5.6 Z" fill="#A9B4BF"/>'
    + '<path d="M-6.6,-5.6 L-9.4,-5 L-5.2,-6.8 Z" fill="#2B2B2B"/>'
    + `<circle cx="${head.x}" cy="${head.y}" r="2.4" fill="#FFFFFF"/><circle cx="${head.x + 0.8}" cy="${head.y - 0.4}" r="0.48" fill="#222222"/>${beak}`, GULL_BOX);
}

export const SEA_SPRITES = {
  dolphin: [0, 1, 2].map(f => () => dolphin(f)),
  whaleBack,
  whaleFluke,
  fish: Object.fromEntries(Object.entries(SPECIES).map(([id, look]) => [id, [0, 1].map(f => () => fishJump(f, look))])),
  gull: [0, 1].map(f => () => gull(f))
};
export const FISH_SPECIES = Object.keys(SPECIES);
