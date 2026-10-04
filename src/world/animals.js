// Bêtes de l'île (vie ambiante) : la ferme (poules de races, poussins, vache, moutons, cochon, chèvre), les bois
// (cerf, renard, lapin, hérisson, écureuil) et l'eau (carpes koï, héron). Vues de profil, tournées vers la droite
// (l'île les retourne pour la gauche) ; ancrage aux pieds, cadre serré. Images : 0 et 1 (pas, picore, broute),
// rest (couchée, la nuit).
import { sprite } from './iso';

const f2 = n => Math.round(n * 100) / 100;
const ell = (x, y, rx, ry, fill, extra = '') => `<ellipse cx="${f2(x)}" cy="${f2(y)}" rx="${f2(rx)}" ry="${f2(ry)}" fill="${fill}"${extra}/>`;
const ln = (a, b, color, w = 1) => `<line x1="${f2(a[0])}" y1="${f2(a[1])}" x2="${f2(b[0])}" y2="${f2(b[1])}" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/>`;
const dot = (x, y, r, fill) => `<circle cx="${f2(x)}" cy="${f2(y)}" r="${f2(r)}" fill="${fill}"/>`;
const OUT = ' stroke="rgba(60,40,25,.35)" stroke-width="0.5"';
const shadow = (rx = 7) => ell(0, 0, rx, 2, 'rgba(40,55,20,.22)');
const EYE = '#2A2420';
const SMALL = { x: -12, y: -18, w: 24, h: 20 };
const MID = { x: -16, y: -24, w: 32, h: 26 };
const TALL = { x: -16, y: -34, w: 32, h: 36 };

// Pattes : quatre traits, qui s'écartent à la marche
function legs(xs, y0, len, color, frame, w = 1.4) {
  return xs.map((x, i) => {
    const step = frame === 1 ? (i % 2 ? 1.4 : -1.4) : 0;
    return ln([x, y0], [x + step, y0 + len], color, w);
  }).join('');
}

/* ---------- Ferme ---------- */
// Poules de race : plumage et aile ; image 1 : elle picore
export const HEN_BREEDS = {
  blanche: ['#FFFDF8', '#E6DCC8'], rousse: ['#D9844E', '#B5612E'], noire: ['#3D3A36', '#26241F'], grise: ['#C9C4BA', '#8E897F']
};
export function hen(breed, frame) {
  const [body, wing] = HEN_BREEDS[breed] || HEN_BREEDS.blanche;
  const peck = frame === 1;
  const [hx, hy] = peck ? [6, -6] : [4.4, -12.6];
  return sprite(shadow(6) + ln([-1, -3], [-1.4, 0], '#E8A13A', 1) + ln([2, -3], [2.4, 0], '#E8A13A', 1)
    + `<path d="M-8,-8 Q-9,-14 -5,-13 Q-1,-13 4,-10 Q7,-5 2,-2.6 Q-6,-2 -8,-8 Z" fill="${body}"${OUT}/>`
    + `<path d="M-4,-8.4 Q-1,-10.6 2,-7.4" stroke="${wing}" stroke-width="1.4" fill="none"/>`
    + dot(hx, hy, 3, body) + `<path d="M${hx - 1},${hy - 2.8} q1,-3 3,0 q1,-2 2,1" fill="#E2574C"/>`
    + `<path d="M${hx + 2.8},${hy} l2.8,1 l-2.8,1 Z" fill="#E8A13A"/>` + dot(hx + 1, hy - 0.5, 0.65, breed === 'noire' ? '#F2C04B' : EYE), SMALL);
}
export function chick(frame) {
  const y = frame === 1 ? -1 : 0;
  return sprite(shadow(3) + ell(0, -3.4 + y, 3.2, 2.8, '#FFE07A', OUT) + dot(2, -5.4 + y, 1.9, '#FFE07A')
    + `<path d="M3.6,${-5.4 + y} l1.6,.6 l-1.6,.6 Z" fill="#E8A13A"/>` + dot(2.4, -5.8 + y, 0.45, EYE), SMALL);
}
// Vache blanche à taches noires ; 1 : broute ; rest : couchée
export function cow(frame) {
  if (frame === 'rest') {
    return sprite(shadow(11) + ell(-1, -5, 10, 5, '#FFFDF8', OUT) + ell(-4, -6, 3, 2.2, '#2E2A26') + ell(3, -4, 2.4, 1.8, '#2E2A26')
      + ell(9, -6, 3.6, 3, '#FFFDF8', OUT) + ell(11, -5, 2, 1.4, '#F2B8A8') + dot(9.6, -7.4, 0.6, EYE) + `<path d="M7,-9 l-1.6,-1.8 M10.6,-9 l1.4,-1.8" stroke="#C9C4BA" stroke-width="1"/>`, MID);
  }
  const graze = frame === 1;
  const [hx, hy] = graze ? [11, -6] : [11, -13];
  return sprite(shadow(11) + legs([-7, -4, 4, 7], -6, 6, '#3D3A36', graze ? 0 : frame, 1.6)
    + ell(0, -10, 10, 5.6, '#FFFDF8', OUT) + ell(-4, -11.4, 3.2, 2.4, '#2E2A26') + ell(3.4, -9, 2.6, 2, '#2E2A26') + ell(-7.6, -8, 1.6, 1.4, '#2E2A26')
    + ell(1, -5.4, 1.8, 1.2, '#F2B8A8') + ln([-9.6, -11], [-11.6, -6], '#3D3A36', 0.8)
    + ell(hx, hy, 3.6, 3.2, '#FFFDF8', OUT) + ell(hx + 2, hy + 1, 2, 1.5, '#F2B8A8') + dot(hx + 0.6, hy - 1.2, 0.65, EYE)
    + `<path d="M${hx - 2},${hy - 2.6} l-1.4,-2 M${hx + 1.4},${hy - 2.8} l1,-2" stroke="#C9C4BA" stroke-width="1.1" stroke-linecap="round"/>`, MID);
}
// Mouton : toison en boules, tête et pattes noires
export function sheep(frame) {
  const wool = (cx, cy) => [[-5, 0], [-1.6, -1.6], [2, -1.4], [5, 0.2], [-3, 2], [1, 2.2], [4, 1.8]].map(([x, y]) => dot(cx + x, cy + y, 3, '#FBF8F0')).join('');
  if (frame === 'rest') return sprite(shadow(9) + `<g${OUT}>${wool(-1, -5)}</g>` + ell(7, -5.6, 2.6, 2.2, '#2E2A26') + dot(7.6, -6.4, 0.55, '#FFFFFF'), MID);
  const graze = frame === 1;
  const [hx, hy] = graze ? [8.4, -5] : [8.4, -11];
  return sprite(shadow(9) + legs([-5, -2, 2.6, 5.4], -5, 5, '#2E2A26', graze ? 0 : frame, 1.4)
    + `<g${OUT}>${wool(0, -9)}</g>` + ell(hx, hy, 2.8, 2.4, '#2E2A26') + ell(hx - 2.4, hy - 1.6, 1.4, 0.8, '#2E2A26') + dot(hx + 0.8, hy - 0.6, 0.55, '#FFFFFF'), MID);
}
// Cochon rose, queue en tire-bouchon
export function pig(frame) {
  if (frame === 'rest') return sprite(shadow(9) + ell(0, -4.6, 8.6, 4.4, '#F4A9B4', OUT) + ell(7.6, -4.6, 2, 1.8, '#E88E9C') + dot(6, -6.4, 0.6, EYE), MID);
  const snuffle = frame === 1 ? 1 : 0;
  return sprite(shadow(9) + legs([-5, -2.4, 2.4, 5], -4.4, 4.4, '#E88E9C', snuffle ? 0 : frame, 1.8)
    + ell(0, -8, 8.4, 5, '#F4A9B4', OUT) + `<path d="M-8.4,-9 q-2.6,-1 -1.6,-3 q1.4,-.8 1.2,1.2" fill="none" stroke="#E88E9C" stroke-width=".9"/>`
    + ell(8.6, -8 + snuffle * 2, 2.2, 2, '#E88E9C', OUT) + dot(8.2, -8.4 + snuffle * 2, 0.4, '#B85A6A') + dot(9.4, -8.4 + snuffle * 2, 0.4, '#B85A6A')
    + dot(5.6, -10.4 + snuffle, 0.65, EYE) + `<path d="M3.4,-12.4 l1.6,-2.2 l1,2.4 Z" fill="#E88E9C"/>`, MID);
}
// Chèvre beige, petites cornes et barbiche ; 1 : broute
export function goat(frame) {
  if (frame === 'rest') return sprite(shadow(8) + ell(-1, -4.6, 7.4, 4, '#E6D2B0', OUT) + ell(6.6, -6.6, 2.4, 2.4, '#E6D2B0', OUT) + dot(7, -7.4, 0.55, EYE), MID);
  const graze = frame === 1;
  const [hx, hy] = graze ? [8, -5.4] : [8, -13];
  return sprite(shadow(8) + legs([-5, -2.4, 2.4, 5], -6, 6, '#8E7A5A', graze ? 0 : frame, 1.3)
    + ell(0, -9.6, 7.6, 4.4, '#E6D2B0', OUT) + `<path d="M-7.4,-11 l-2.4,-2" stroke="#8E7A5A" stroke-width="1.2" stroke-linecap="round"/>`
    + ell(hx, hy, 2.6, 2.6, '#E6D2B0', OUT) + `<path d="M${hx - 1},${hy - 2} q-1,-3 -3,-3.4 M${hx + 0.6},${hy - 2.2} q.4,-3 -1.4,-4" fill="none" stroke="#8E7A5A" stroke-width="1"/>`
    + `<path d="M${hx + 1},${hy + 2} l.4,2.6 l.8,-2.4 Z" fill="#B8A07A"/>` + dot(hx + 0.8, hy - 0.4, 0.55, EYE), MID);
}

/* ---------- Bois ---------- */
// Cerf : pelage brun, taches claires, bois ; 1 : tête baissée (il broute)
export function deer(frame) {
  const graze = frame === 1;
  const [hx, hy] = graze ? [9, -9] : [9.4, -19];
  return sprite(shadow(9) + legs([-5, -3, 3.4, 5.4], -9, 9, '#7A4E2C', 0, 1.2)
    + ell(0, -12, 8, 4.4, '#B5793F', OUT) + [[-3, -13.4], [0, -14.2], [2.6, -13], [-1, -11.6]].map(([x, y]) => dot(x, y, 0.7, '#F4E2C0')).join('')
    + `<path d="M5,-14 Q7,-17 ${hx - 1},${hy + 2}" fill="none" stroke="#B5793F" stroke-width="3"/>`
    + ell(hx, hy, 2.6, 2.1, '#B5793F', OUT) + dot(hx + 2.2, hy + 0.6, 0.6, EYE) + dot(hx + 0.4, hy - 0.4, 0.55, EYE)
    + `<path d="M${hx - 1},${hy - 1.6} l-1.6,-5 l-2,-1.6 M${hx - 2.2},${hy - 4.6} l1.6,-1.8 M${hx + 0.4},${hy - 1.8} l1,-5 l2,-1.4 M${hx + 1},${hy - 4.6} l-1.4,-1.8" fill="none" stroke="#8B6A4A" stroke-width=".8" stroke-linecap="round"/>`
    + ell(-8, -13, 1.4, 1, '#F4E2C0'), TALL);
}
// Renard : orange, poitrail blanc, queue touffue à bout blanc ; 0 et 1 : il trotte
export function fox(frame) {
  return sprite(shadow(9) + legs([-4, -2, 3, 5], -5, 5, '#3D2A1E', frame, 1.2)
    + `<path d="M-6,-8 Q-13,-10 -13,-5 Q-10,-3 -6,-6 Z" fill="#E07A2E"${OUT}/>` + ell(-12, -5, 1.8, 1.4, '#FFFDF8')
    + ell(0, -8, 6.6, 3.4, '#E07A2E', OUT) + ell(2.4, -6.4, 3, 1.6, '#FFF4E4')
    + `<path d="M5,-9 L10.6,-9.6 L7.4,-6 Z" fill="#E07A2E"${OUT}/>` + `<path d="M9,-9.6 L10.6,-9.6 L10.2,-8.6 Z" fill="#2A2420"/>`
    + `<path d="M5.2,-10.4 l.8,-3 l1.6,2.4 Z M7.4,-10.2 l1.4,-2.6 l.8,2.8 Z" fill="#C9632A"/>` + dot(7.6, -8.8, 0.5, EYE), MID);
}
// Lapin gris-brun ; 0 : assis, 1 : bond
export function rabbit(frame) {
  const up = frame === 1 ? -3 : 0;
  return sprite(shadow(5) + ell(-0.4, -4 + up, 4.6, 3.6, '#A8927A', OUT) + dot(-4.6, -4.6 + up, 1.6, '#FFFFFF')
    + ell(3.4, -7 + up, 2.6, 2.2, '#A8927A', OUT) + `<path d="M2.4,${-8.6 + up} q-.6,-5 1,-6 q1,1.6 .2,6 Z M3.8,${-8.6 + up} q1,-4.6 2.6,-5 q.4,1.8 -1.4,5.4 Z" fill="#A8927A"${OUT}/>`
    + dot(4.4, -7.4 + up, 0.5, EYE) + dot(5.8, -6.6 + up, 0.4, '#E88E9C'), SMALL);
}
// Hérisson : dôme de piquants, museau pointu ; 1 : il renifle
export function hedgehog(frame) {
  const snout = frame === 1 ? 0.8 : 0;
  let spikes = '';
  for (let i = 0; i < 9; i++) {
    const a = Math.PI + (i / 8) * Math.PI;
    spikes += ln([Math.cos(a) * 4, -3 + Math.sin(a) * 3], [Math.cos(a) * 6.4, -3 + Math.sin(a) * 5.2], '#5E4632', 1);
  }
  return sprite(shadow(6) + spikes + ell(0, -3, 5.4, 3.4, '#7A5E44', OUT) + `<path d="M3.6,-3.6 L${7.4 + snout},-2 L3.6,-1.2 Z" fill="#D9B98F"/>`
    + dot(7.4 + snout, -2, 0.6, EYE) + dot(4.8, -3.2, 0.45, EYE), SMALL);
}
// Écureuil roux, grande queue en volute ; 0 et 1 : la queue frémit
export function squirrel(frame) {
  const tail = frame === 1 ? -1 : 0;
  return sprite(`<path d="M-2,-4 Q-9,${-6 + tail} -7,${-13 + tail} Q-3,${-16 + tail} -2,${-11 + tail} Q-5,${-10 + tail} -3.6,-7 Z" fill="#C9632A"${OUT}/>`
    + ell(1, -4.6, 3, 3, '#D9773A', OUT) + dot(3, -8.4, 2.4, '#D9773A') + `<path d="M2,-10.4 l.6,-2 l1,1.8 Z" fill="#D9773A"/>`
    + dot(3.8, -8.8, 0.5, EYE) + ell(2.4, -3.4, 1.4, 1.8, '#F4E2C0'), SMALL);
}

/* ---------- Eau ---------- */
// Carpe koï vue de dessus, sous la surface ; 0 et 1 : la queue ondule
export function koi(color, frame) {
  const flick = frame === 1 ? 2 : -2;
  return sprite(`<g opacity=".85"><path d="M-6,0 L${-9},${flick - 1.6} L${-9},${flick + 1.6} Z" fill="${color}"/>`
    + ell(0, 0, 6, 2.2, color) + ell(1.6, -0.4, 1.6, 0.9, '#FFFFFF') + ell(-2.4, 0.4, 1.4, 0.8, color === '#FFFFFF' ? '#E2574C' : '#FFFFFF') + `</g>`, { x: -10, y: -4, w: 20, h: 8 });
}
// Héron cendré sur ses longues pattes ; 1 : il pique du bec
export function heron(frame) {
  const strike = frame === 1;
  const neck = strike ? 'M2,-17 Q8,-15 10,-7' : 'M2,-17 Q0,-24 4,-27';
  const [hx, hy] = strike ? [10.6, -6] : [5, -27.6];
  return sprite(shadow(5) + ln([-1, -12], [-1.6, 0], '#8E7A5A', 0.9) + ln([1.6, -12], [2.4, 0], '#8E7A5A', 0.9)
    + ell(0, -15, 6, 3.6, '#A9B3BE', OUT) + `<path d="M-5,-15 Q-9,-13 -8,-11 Q-4,-12 -2,-14 Z" fill="#7D8794"/>`
    + `<path d="${neck}" fill="none" stroke="#C9D0D8" stroke-width="2.2" stroke-linecap="round"/>`
    + dot(hx, hy, 1.9, '#E8ECF0') + `<path d="M${hx + 1.4},${hy - 0.4} l${strike ? 2.6 : 4.4},${strike ? 3 : 0.8} l${strike ? -3.2 : -4.4},${strike ? -1.6 : 0.6} Z" fill="#E8A13A"/>`
    + dot(hx + 0.4, hy - 0.6, 0.45, EYE) + ln([hx - 1.4, hy - 1], [hx - 4.6, hy - 1.6], '#2A2420', 0.6), TALL);
}

// Toutes les bêtes de l'île par sorte : dessin d'une image (0, 1 ou rest)
export const ANIMAL_SPRITES = {
  hen: (frame, breed) => hen(breed, frame), chick, cow, sheep, pig, goat, deer, fox, rabbit, hedgehog, squirrel,
  koi: (frame, color) => koi(color, frame), heron
};
