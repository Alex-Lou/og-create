// Bêtes de l'île (vie ambiante) : la ferme (poules de races, poussins, vache, moutons, cochon, chèvre), les bois
// (cerf, renard, lapin, hérisson, écureuil), l'eau (carpes koï, héron), deux bêtes par climat (renard des neiges,
// bouquetin, macareux, poney, grenouille, tortue, fennec, dromadaire, caméléon, toucan, salamandre, corbeau des
// cendres), le Bestiaire (mésange, papillons, lucioles, abeilles, hibou) et les familiers (Tic-Tac, le bocal de
// Bulle, Mousse le renardeau ; les autres réutilisent les bêtes des climats). Vues de profil, tournées vers la droite
// (l'île les retourne pour la gauche) ; ancrage aux pieds, cadre serré. Images : 0 et 1 (pas, picore, broute, geste),
// rest (couchée, la nuit).
import { sprite } from './iso';
import { anyaSprite } from './anyaSprite';

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
// Œil mignon : rond sombre et reflet ; fermé (la nuit) : petit arc
const eye = (x, y, r = 0.8) => dot(x, y, r, EYE) + dot(x - r * 0.3, y - r * 0.35, r * 0.36, '#FFFFFF');
const shut = (x, y, r = 0.8) => `<path d="M${f2(x - r)},${f2(y)} q${f2(r)},${f2(r * 0.9)} ${f2(r * 2)},0" fill="none" stroke="${EYE}" stroke-width=".5" stroke-linecap="round"/>`;
const cheek = (x, y, r = 0.9) => ell(x, y, r, r * 0.6, '#F4A0A8', ' opacity=".75"');
const path = (d, fill, extra = '') => `<path d="${d}" fill="${fill}"${extra}/>`;

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
// Vache blanche à taches noires (rousse : taches rousses, Bestiaire) ; 1 : broute ; rest : couchée
export function cow(frame, variant = '') {
  const SPOT = variant === 'rousse' ? '#A0562C' : '#2E2A26';
  if (frame === 'rest') {
    return sprite(shadow(11) + ell(-1, -5, 10, 5, '#FFFDF8', OUT) + ell(-4, -6, 3, 2.2, SPOT) + ell(3, -4, 2.4, 1.8, SPOT)
      + ell(9, -6, 3.6, 3, '#FFFDF8', OUT) + ell(11, -5, 2, 1.4, '#F2B8A8') + dot(9.6, -7.4, 0.6, EYE) + `<path d="M7,-9 l-1.6,-1.8 M10.6,-9 l1.4,-1.8" stroke="#C9C4BA" stroke-width="1"/>`, MID);
  }
  const graze = frame === 1;
  const [hx, hy] = graze ? [11, -6] : [11, -13];
  return sprite(shadow(11) + legs([-7, -4, 4, 7], -6, 6, '#3D3A36', graze ? 0 : frame, 1.6)
    + ell(0, -10, 10, 5.6, '#FFFDF8', OUT) + ell(-4, -11.4, 3.2, 2.4, SPOT) + ell(3.4, -9, 2.6, 2, SPOT) + ell(-7.6, -8, 1.6, 1.4, SPOT)
    + ell(1, -5.4, 1.8, 1.2, '#F2B8A8') + ln([-9.6, -11], [-11.6, -6], '#3D3A36', 0.8)
    + ell(hx, hy, 3.6, 3.2, '#FFFDF8', OUT) + ell(hx + 2, hy + 1, 2, 1.5, '#F2B8A8') + dot(hx + 0.6, hy - 1.2, 0.65, EYE)
    + `<path d="M${hx - 2},${hy - 2.6} l-1.4,-2 M${hx + 1.4},${hy - 2.8} l1,-2" stroke="#C9C4BA" stroke-width="1.1" stroke-linecap="round"/>`, MID);
}
// Mouton : toison en boules, tête et pattes noires (noir : toison sombre, Bestiaire)
export function sheep(frame, variant = '') {
  const fleece = variant === 'noir' ? '#5E5650' : '#FBF8F0';
  const wool = (cx, cy) => [[-5, 0], [-1.6, -1.6], [2, -1.4], [5, 0.2], [-3, 2], [1, 2.2], [4, 1.8]].map(([x, y]) => dot(cx + x, cy + y, 3, fleece)).join('');
  if (frame === 'rest') return sprite(shadow(9) + `<g${OUT}>${wool(-1, -5)}</g>` + ell(7, -5.6, 2.6, 2.2, '#2E2A26') + dot(7.6, -6.4, 0.55, '#FFFFFF'), MID);
  const graze = frame === 1;
  const [hx, hy] = graze ? [8.4, -5] : [8.4, -11];
  return sprite(shadow(9) + legs([-5, -2, 2.6, 5.4], -5, 5, '#2E2A26', graze ? 0 : frame, 1.4)
    + `<g${OUT}>${wool(0, -9)}</g>` + ell(hx, hy, 2.8, 2.4, '#2E2A26') + ell(hx - 2.4, hy - 1.6, 1.4, 0.8, '#2E2A26') + dot(hx + 0.8, hy - 0.6, 0.55, '#FFFFFF'), MID);
}
// Cochon rose, queue en tire-bouchon (tacheté : taches sombres, Bestiaire)
export function pig(frame, variant = '') {
  const spots = (y, k = 1) => (variant === 'tachete' ? ell(-3, y - 1, 2.4 * k, 1.8 * k, '#5E4A44') + ell(2.6, y + 0.4, 1.8 * k, 1.4 * k, '#5E4A44') : '');
  if (frame === 'rest') return sprite(shadow(9) + ell(0, -4.6, 8.6, 4.4, '#F4A9B4', OUT) + spots(-4.6, 0.8) + ell(7.6, -4.6, 2, 1.8, '#E88E9C') + dot(6, -6.4, 0.6, EYE), MID);
  const snuffle = frame === 1 ? 1 : 0;
  return sprite(shadow(9) + legs([-5, -2.4, 2.4, 5], -4.4, 4.4, '#E88E9C', snuffle ? 0 : frame, 1.8)
    + ell(0, -8, 8.4, 5, '#F4A9B4', OUT) + spots(-8) + `<path d="M-8.4,-9 q-2.6,-1 -1.6,-3 q1.4,-.8 1.2,1.2" fill="none" stroke="#E88E9C" stroke-width=".9"/>`
    + ell(8.6, -8 + snuffle * 2, 2.2, 2, '#E88E9C', OUT) + dot(8.2, -8.4 + snuffle * 2, 0.4, '#B85A6A') + dot(9.4, -8.4 + snuffle * 2, 0.4, '#B85A6A')
    + dot(5.6, -10.4 + snuffle, 0.65, EYE) + `<path d="M3.4,-12.4 l1.6,-2.2 l1,2.4 Z" fill="#E88E9C"/>`, MID);
}
// Chèvre beige, petites cornes et barbiche (brune : robe brune, Bestiaire) ; 1 : broute
export function goat(frame, variant = '') {
  const COAT = variant === 'brune' ? '#A9825C' : '#E6D2B0';
  if (frame === 'rest') return sprite(shadow(8) + ell(-1, -4.6, 7.4, 4, COAT, OUT) + ell(6.6, -6.6, 2.4, 2.4, COAT, OUT) + dot(7, -7.4, 0.55, EYE), MID);
  const graze = frame === 1;
  const [hx, hy] = graze ? [8, -5.4] : [8, -13];
  return sprite(shadow(8) + legs([-5, -2.4, 2.4, 5], -6, 6, '#8E7A5A', graze ? 0 : frame, 1.3)
    + ell(0, -9.6, 7.6, 4.4, COAT, OUT) + `<path d="M-7.4,-11 l-2.4,-2" stroke="#8E7A5A" stroke-width="1.2" stroke-linecap="round"/>`
    + ell(hx, hy, 2.6, 2.6, COAT, OUT) + `<path d="M${hx - 1},${hy - 2} q-1,-3 -3,-3.4 M${hx + 0.6},${hy - 2.2} q.4,-3 -1.4,-4" fill="none" stroke="#8E7A5A" stroke-width="1"/>`
    + `<path d="M${hx + 1},${hy + 2} l.4,2.6 l.8,-2.4 Z" fill="#B8A07A"/>` + dot(hx + 0.8, hy - 0.4, 0.55, EYE), MID);
}

/* ---------- Bois ---------- */
// Cerf : pelage brun, taches claires, bois ; 1 : tête baissée (il broute). Blanc : le grand cerf blanc d'Anya
export function deer(frame, variant = '') {
  const graze = frame === 1;
  const [hx, hy] = graze ? [9, -9] : [9.4, -19];
  const [coat, leg] = variant === 'blanc' ? ['#F4F6F8', '#C8D0D6'] : ['#B5793F', '#7A4E2C'];
  return sprite(shadow(9) + legs([-5, -3, 3.4, 5.4], -9, 9, leg, 0, 1.2)
    + ell(0, -12, 8, 4.4, coat, OUT) + [[-3, -13.4], [0, -14.2], [2.6, -13], [-1, -11.6]].map(([x, y]) => dot(x, y, 0.7, '#F4E2C0')).join('')
    + `<path d="M5,-14 Q7,-17 ${hx - 1},${hy + 2}" fill="none" stroke="${coat}" stroke-width="3"/>`
    + ell(hx, hy, 2.6, 2.1, coat, OUT) + dot(hx + 2.2, hy + 0.6, 0.6, EYE) + dot(hx + 0.4, hy - 0.4, 0.55, EYE)
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

/* ---------- Les Cimes ---------- */
// Renard des neiges : blanc, bout de queue et oreilles bleutés ; 0 et 1 : il trotte ; rest : roulé en boule
export function snowFox(frame) {
  if (frame === 'rest') {
    return sprite(shadow(8) + ell(0, -3.6, 6.6, 3.4, '#FDFCF8', OUT) + ell(5, -5, 2.6, 2.2, '#FDFCF8', OUT)
      + path('M5.4,-6.8 l.6,-2.4 l1.4,2 Z', '#FDFCF8', OUT) + shut(5.6, -5.2, 0.6) + cheek(6.2, -4.2, 0.7)
      + path('M-6,-3.4 Q-4,0.4 4,-1.2 Q6.6,-1.6 7,-2.6 Q2,-1.4 -6,-3.4 Z', '#FDFCF8', OUT) + ell(6.2, -2.4, 1.2, 0.9, '#B7D2EC'), SMALL);
  }
  return sprite(shadow(9) + legs([-4, -2, 3, 5], -5, 5, '#C9D3DD', frame, 1.3)
    + path('M-6,-8 Q-13.4,-11 -13.4,-5.2 Q-10,-2.6 -6,-6 Z', '#FDFCF8', OUT) + ell(-12.2, -5.2, 2, 1.5, '#B7D2EC')
    + ell(0, -8, 6.4, 3.4, '#FDFCF8', OUT)
    + ell(6.6, -9.4, 2.8, 2.4, '#FDFCF8', OUT) + path('M8.4,-10.2 L11.4,-9.2 L8.6,-7.6 Z', '#FDFCF8', OUT) + dot(11.2, -9.2, 0.55, EYE)
    + path('M5,-11 l.8,-3.2 l1.8,2.4 Z M6.8,-11.4 l1.6,-2.8 l.9,3 Z', '#FDFCF8', OUT) + path('M5.5,-11.3 l.4,-1.6 l.9,1.2 Z', '#B7D2EC')
    + eye(7.6, -9.8) + cheek(7, -8.2), MID);
}
// Bouquetin : brun gris, ventre clair, grandes cornes annelées en arc ; 1 : il broute ; rest : couché
export function ibex(frame) {
  // Cornes en arc vers l'arrière ; tête baissée, elles se couchent le long du cou (low)
  const horns = (hx, hy, low = false) => {
    const [cx, cy, ex, ey] = low ? [hx - 3.6, hy - 4.4, hx - 6.4, hy - 2.8] : [hx - 2.6, hy - 8, hx - 7.4, hy - 7.4];
    const q = t => [(1 - t) ** 2 * (hx - 0.6) + 2 * t * (1 - t) * cx + t * t * ex, (1 - t) ** 2 * (hy - 2) + 2 * t * (1 - t) * cy + t * t * ey];
    return `<path d="M${hx - 0.6},${hy - 2} Q${cx},${cy} ${ex},${ey}" fill="none" stroke="#8A7560" stroke-width="1.6" stroke-linecap="round"/>`
      + [0.3, 0.55, 0.8].map(t => { const [x, y] = q(t); return ln([x - 0.5, y - 0.5], [x + 0.5, y + 0.5], '#6E5A44', 0.5); }).join('');
  };
  if (frame === 'rest') {
    return sprite(shadow(8) + ell(-1, -4.4, 7.4, 3.8, '#B39A7A', OUT) + ell(-0.4, -2.6, 5, 1.6, '#E8D9C0') + horns(6.6, -6.6)
      + ell(6.6, -6.6, 2.4, 2.3, '#B39A7A', OUT) + shut(7.2, -7, 0.6) + cheek(7.6, -5.6, 0.7), MID);
  }
  const graze = frame === 1;
  const [hx, hy] = graze ? [8, -5.6] : [8, -13];
  return sprite(shadow(8) + legs([-5, -2.4, 2.4, 5], -6, 6, '#6E5A44', 0, 1.4)
    + ell(0, -9.6, 7.4, 4.2, '#B39A7A', OUT) + ell(0.6, -7.4, 5, 1.6, '#E8D9C0') + path('M-7.2,-11 l-1.6,-1.6 l.6,2.4 Z', '#6E5A44')
    + horns(hx, hy, graze) + ell(hx, hy, 2.5, 2.4, '#B39A7A', OUT) + path(`M${hx + 1.2},${hy + 1.8} l.3,2.4 l.9,-2.2 Z`, '#6E5A44')
    + eye(hx + 0.8, hy - 0.4, 0.75) + cheek(hx + 1.2, hy + 1, 0.7), MID);
}

/* ---------- Les Landes ---------- */
// Macareux : dos noir, ventre et joues blancs, bec orange à base jaune ; 1 : il bat des ailes ; rest : ramassé
export function puffin(frame) {
  const flap = frame === 1;
  const sit = frame === 'rest';
  const y = sit ? 1.6 : 0;
  return sprite(shadow(5) + (sit ? '' : ln([-1, -2], [-1.2, 0], '#F58A4C', 1) + ln([1.4, -2], [1.8, 0], '#F58A4C', 1)
    + ell(-1.4, 0, 1.2, 0.5, '#F58A4C') + ell(2, 0, 1.2, 0.5, '#F58A4C'))
    + ell(0, -6.4 + y, 4.4, 5, '#2F2A36', OUT) + ell(1.2, -5 + y, 3, 3.6, '#FFFDF7')
    + (flap ? path(`M-2,${-8 + y} Q-6,${-15 + y} -3,${-14 + y} Q-1,${-11 + y} 0,${-8 + y} Z`, '#2F2A36', OUT) : path(`M-3.4,${-8 + y} Q-5,${-4 + y} -2,${-2.4 + y} Q-2,${-6 + y} -3.4,${-8 + y} Z`, '#24202A'))
    + ell(1.4, -11.6 + y, 3.4, 3.2, '#2F2A36', OUT) + ell(2.2, -11 + y, 2.2, 2.1, '#FFFDF7')
    + path(`M3.8,${-12.8 + y} Q7.4,${-12.2 + y} 7.6,${-10.2 + y} Q6.2,${-9 + y} 3.8,${-9.6 + y} Z`, '#F2683A', OUT) + path(`M3.8,${-12.8 + y} L4.8,${-12.6 + y} L4.8,${-9.6 + y} L3.8,${-9.6 + y} Z`, '#FFC24B')
    + (sit ? shut(2, -12.2 + y, 0.65) : eye(2.2, -12.2 + y, 0.75)) + cheek(2.2, -10.2 + y, 0.65), SMALL);
}
// Poney : brun, crinière et queue sombres, liste blanche ; 1 : il broute ; rest : couché
export function pony(frame) {
  const BODY = '#9A6A44', MANE = '#4A3426', MUZ = '#7E5434';
  // Tête allongée inclinée de a degrés autour de (hx, hy) : crâne, museau plus sombre, oreille, liste blanche
  const head = (hx, hy, a, shut0 = false) => `<g transform="rotate(${a} ${hx} ${hy})">`
    + ell(hx, hy, 3.4, 1.9, BODY, OUT) + ell(hx + 2.4, hy + 0.3, 1.5, 1.5, MUZ) + dot(hx + 3.2, hy, 0.35, '#2A2420')
    + path(`M${hx - 1.6},${hy - 1.4} l-.4,-2.2 l1.6,1.4 Z`, BODY, OUT) + path(`M${hx - 0.6},${hy - 1.6} Q${hx + 1.4},${hy - 1.2} ${hx + 2.2},${hy - 0.6}`, 'none', ' stroke="#FFFDF7" stroke-width=".7" stroke-linecap="round"')
    + (shut0 ? shut(hx - 0.4, hy - 0.3, 0.6) : eye(hx - 0.4, hy - 0.4, 0.72)) + cheek(hx + 0.6, hy + 0.9, 0.65) + `</g>`;
  if (frame === 'rest') {
    return sprite(shadow(10) + path('M-8,-5 Q-12,-4 -11,-0.6 Q-9,-2 -8,-3 Z', MANE) + ell(-0.6, -4.6, 8.4, 4, BODY, OUT)
      + path('M5,-6 Q6.6,-10.6 8.6,-11 L9.6,-8 Q8,-7.4 7.4,-4.6 Z', BODY, OUT) + path('M4.6,-6.4 Q6,-11 8.4,-11.6 Q7,-9.4 6.4,-6 Z', MANE)
      + head(10, -9.6, 20, true), MID);
  }
  const graze = frame === 1;
  const neck = graze ? 'M4.6,-12.6 Q8.4,-11 9.6,-5.6 L7.4,-5 Q6.4,-8.6 4,-9.2 Z' : 'M4.4,-12.4 Q6.4,-17.6 9,-18.4 L10,-15.4 Q8.4,-14 7.6,-10.4 Z';
  const mane = graze ? 'M4.4,-13.2 Q8.8,-11.8 9.8,-6.6 Q8.6,-10 5,-11.4 Z' : 'M4,-12.6 Q5.8,-18.8 9,-19.2 Q7,-17 6,-12.4 Z';
  return sprite(shadow(10) + legs([-6, -3.6, 3.4, 5.8], -7, 7, BODY, 0, 1.7)
    + [-6, -3.6, 3.4, 5.8].map(x => ln([x, -0.6], [x, 0], '#2A2420', 1.8)).join('')
    + path('M-7.6,-12 Q-11.4,-10 -10.6,-4.6 Q-9,-7.6 -7.4,-9.4 Z', MANE) + ell(0, -10.6, 8, 4.4, BODY, OUT)
    + path(neck, BODY, OUT) + path(mane, MANE) + (graze ? head(9.6, -3.6, 62) : head(10.6, -17.2, 28)), MID);
}

/* ---------- Le Marais ---------- */
// Grenouille : verte, yeux en bosses, ventre clair ; 1 : elle bondit ; rest : aplatie, yeux fermés
export function frog(frame) {
  const G = '#6CC15A', L = '#D8F0A2', D = '#4E9C46';
  if (frame === 1) {
    return sprite(shadow(4) + ell(-3.4, -6.6, 2.4, 1.4, G, OUT) + ln([-5, -6], [-8, -3.6], G, 1.3) + ell(-8.8, -3, 1.4, 0.6, G)
      + ell(0.4, -8, 4.6, 2.6, G, OUT) + ell(1.4, -7, 3, 1.4, L) + dot(3.4, -10.4, 1.6, G) + eye(3.6, -10.6, 0.8)
      + ln([3.6, -6.6], [6.4, -4.4], G, 1.2) + `<path d="M2.6,-8.4 q1.4,1 2.8,0" fill="none" stroke="${EYE}" stroke-width=".45" stroke-linecap="round"/>`, SMALL);
  }
  const rest = frame === 'rest';
  return sprite(shadow(6) + ell(-3.6, -1.6, 2.6, 1.6, G, OUT) + ell(-1.6, -0.4, 2.2, 0.6, G)
    + ell(0, -3.4, 5.4, 3.2, G, OUT) + ell(1.4, -2.2, 3.4, 1.8, L) + dot(-2, -4.4, 0.6, D)
    + dot(1, -6.4, 1.7, G) + dot(3.6, -6.2, 1.7, G)
    + (rest ? shut(1, -6.6, 0.7) + shut(3.6, -6.4, 0.7) : eye(1.2, -6.6, 0.85) + eye(3.8, -6.4, 0.85))
    + `<path d="M2.2,-3.8 q1.6,1.2 3.2,0" fill="none" stroke="${EYE}" stroke-width=".45" stroke-linecap="round"/>` + cheek(5, -4.2, 0.6)
    + ln([3.6, -2], [4.2, 0], G, 1.1), SMALL);
}
// Tortue : carapace bombée à écailles, tête qui sort ; 1 : elle avance ; rest : rentrée dans sa carapace
export function tortoise(frame) {
  const SH = '#7A8F4A', SC = '#5E7238', SK = '#B9C27A';
  const step = frame === 1 ? 1 : 0;
  const shell = ell(0, -4, 6, 4, SH, OUT) + ell(0, -0.6, 6.2, 0.9, SC)
    + `<path d="M-3.4,-7 L-1.6,-4.4 L1.6,-4.4 L3.4,-7 M-1.6,-4.4 L-2.6,-1.4 M1.6,-4.4 L2.6,-1.4 M-5.4,-3.4 L-1.6,-4.4 M1.6,-4.4 L5.4,-3.4" fill="none" stroke="${SC}" stroke-width=".6"/>`;
  if (frame === 'rest') return sprite(shadow(6) + shell + ell(6, -1.2, 0.8, 0.6, SK), SMALL);
  return sprite(shadow(7) + ln([-3.6, -1], [-3.6 - step, 0], SK, 1.6) + ln([3.4, -1], [3.4 + step, 0], SK, 1.6)
    + path(`M5,-3 Q7.6,-5.4 ${9 + step},-4.6 Q${10 + step},-3 ${8.6 + step},-2 Q7,-1.6 5.4,-1.4 Z`, SK, OUT) + shell
    + eye(8 + step, -4, 0.7) + cheek(8.6 + step, -2.8, 0.55) + `<path d="M${8.8 + step},-2.6 q.6,.3 1,-.2" fill="none" stroke="${EYE}" stroke-width=".4" stroke-linecap="round"/>`, SMALL);
}

/* ---------- Les Dunes ---------- */
// Fennec : sable, très grandes oreilles, bout de queue noir ; 0 et 1 : il trotte ; rest : couché, oreilles basses
export function fennec(frame) {
  const S = '#F2BF73', C = '#FFF0D2';
  if (frame === 'rest') {
    return sprite(shadow(7) + path('M-5,-3 Q-10,-3.6 -9.6,-0.6 Q-6,0 -4,-1.4 Z', S, OUT) + ell(-9.2, -1.2, 1, 0.8, '#3D2A1E')
      + ell(0, -3.2, 5.6, 2.8, S, OUT) + ell(5, -4, 2.4, 2, S, OUT) + path('M3.8,-5.4 Q2,-9 0.6,-8.6 Q2,-6.4 3,-4.6 Z M5.6,-5.6 Q5,-9.4 3.6,-9.6 Q4.2,-7 4.6,-5 Z', S, OUT)
      + path('M6.4,-4 L8.2,-3.4 L6.6,-2.6 Z', C) + shut(5.4, -4.4, 0.55) + cheek(6, -3.2, 0.6), SMALL);
  }
  return sprite(shadow(7) + legs([-3, -1.4, 2.2, 3.8], -3.6, 3.6, '#D9A25E', frame, 1.1)
    + path('M-4.6,-6 Q-10.6,-8 -10.4,-3.4 Q-8,-2 -4.4,-4.6 Z', S, OUT) + ell(-10, -3.6, 1.2, 1, '#3D2A1E')
    + ell(0, -5.8, 5, 2.8, S, OUT) + ell(1.6, -4.4, 2.6, 1.4, C)
    + path('M4.2,-8.6 Q1.8,-15.4 0.4,-15.2 Q1.2,-11 2.8,-7.6 Z', S, OUT) + path('M2.4,-8.6 Q1.4,-12.8 1,-13.6 Q1.8,-11 2.6,-8.6 Z', C)
    + path('M6,-8.8 Q6.4,-15.8 4.8,-16 Q3.6,-12 4.4,-8.4 Z', S, OUT) + path('M5.6,-9 Q5.6,-13.6 5,-14.4 Q4.4,-12 4.8,-9 Z', C)
    + ell(5.4, -7, 2.8, 2.4, S, OUT) + path('M7,-7.6 L10.4,-6.6 L7.4,-5 Z', S, OUT) + ell(7.6, -5.8, 1.6, 0.8, C) + dot(10.2, -6.6, 0.5, EYE)
    + eye(6.4, -7.6, 0.8) + cheek(6, -5.8, 0.65), MID);
}
// Dromadaire : une bosse, long cou, lèvres tombantes ; 1 : il marche ; rest : couché, pattes repliées
export function camel(frame) {
  const B = '#C99A5E', D = '#A87C46';
  if (frame === 'rest') {
    return sprite(shadow(11) + ell(-1, -5, 9, 4.4, B, OUT) + path('M-5,-8 Q-1,-15 3,-8 Z', B, OUT)
      + path('M6.4,-7 Q8.4,-14 11,-14.6 Q13.4,-14.6 13.4,-12.4 Q11.6,-12 10.6,-11.4 Q9.4,-8 8.8,-5 Z', B, OUT)
      + shut(11.2, -13.4, 0.6) + cheek(12, -12, 0.7) + ell(-1, -1, 7, 1, D), TALL);
  }
  return sprite(shadow(11) + legs([-6, -3.8, 3.6, 6], -10, 10, D, frame, 1.5)
    + [-6, -3.8, 3.6, 6].map((x, i) => dot(x + (frame === 1 ? (i % 2 ? 0.7 : -0.7) : 0), -5, 0.9, D)).join('')
    + path('M-9,-15 Q-11,-13 -10,-9.6', 'none', ' stroke="#8A6236" stroke-width="1" stroke-linecap="round"')
    + ell(0, -14, 9, 4.6, B, OUT) + path('M-5,-17 Q-1,-27 3.6,-17 Z', B, OUT)
    + path('M6.6,-15.4 Q8.6,-25 11.4,-27 Q14,-28.6 14.6,-26 Q13.6,-25 12.4,-24.6 Q10.6,-20 9.6,-13.4 Z', B, OUT)
    + path('M12.6,-25 Q14,-24.6 14.6,-25.6 L14.4,-24 Q13.4,-23.6 12.4,-24 Z', D)
    + eye(12, -26.2, 0.75) + cheek(12.8, -24.8, 0.65) + path('M11,-28 l.4,-1.6 l1,1.2 Z', D), TALL);
}

/* ---------- La Jungle ---------- */
// Caméléon : vert, queue en spirale, casque, œil en tourelle ; 1 : il change de teinte ; rest : immobile, œil fermé
export function chameleon(frame) {
  const G = frame === 1 ? '#C9D24A' : '#3CBF9C', D = frame === 1 ? '#A9B23A' : '#2E9C7E', Y = '#F6D04E';
  return sprite(shadow(7) + ln([-3, -3], [-4, 0], D, 1.1) + ln([-1.4, -3], [-0.6, 0], D, 1.1) + ln([2.4, -3], [1.8, 0], D, 1.1) + ln([4, -3], [4.8, 0], D, 1.1)
    + `<path d="M-5,-5 Q-9,-5 -9,-8 Q-9,-10.4 -6.8,-10 Q-5.6,-9.4 -6.6,-8.2" fill="none" stroke="${G}" stroke-width="1.6" stroke-linecap="round"/>`
    + path('M-5.4,-4.4 Q-5.4,-9 0,-9.4 Q4.6,-9.6 5.6,-6 Q5,-3 0,-3 Q-4,-3 -5.4,-4.4 Z', G, OUT)
    + path('M-4,-3.8 Q0,-2.6 4.8,-3.8 L4.6,-3.2 Q0,-2.2 -4,-3.4 Z', Y)
    + path('M4,-6.6 Q4.4,-11 7.6,-10 Q9.6,-8.4 9,-6 Q8,-4.2 5.6,-4.4 Z', G, OUT) + path('M4.4,-8.6 Q5,-10.6 7,-10.4', 'none', ` stroke="${Y}" stroke-width=".7"`)
    + dot(7, -7.4, 1.5, G) + (frame === 'rest' ? shut(7.1, -7.4, 0.6) : eye(7.3, -7.5, 0.7))
    + `<path d="M6.6,-5.2 q1.2,.6 2.2,-.4" fill="none" stroke="${EYE}" stroke-width=".4" stroke-linecap="round"/>`, SMALL);
}
// Toucan : noir, gorge jaune, grand bec orange à pointe noire ; 1 : il penche la tête ; rest : bec sous l'aile
export function toucan(frame) {
  const tilt = frame === 1 ? 8 : 0;
  if (frame === 'rest') {
    return sprite(shadow(4) + ln([-0.6, -2], [-0.8, 0], '#5A6FB0', 0.9) + ln([1, -2], [1.2, 0], '#5A6FB0', 0.9)
      + ell(-0.4, -6, 3.6, 4.4, '#2A2630', OUT) + ell(0.8, -8.6, 2.4, 1.8, '#FFD23E') + ell(-0.6, -9.6, 3, 2.6, '#2A2630', OUT)
      + path('M-1,-10.6 Q3,-11.4 4.4,-9 Q2,-8.6 -0.6,-9 Z', '#F2A33A', OUT) + shut(0.4, -10.6, 0.55), SMALL);
  }
  return sprite(shadow(4) + ln([-0.6, -2], [-0.8, 0], '#5A6FB0', 0.9) + ln([1, -2], [1.2, 0], '#5A6FB0', 0.9)
    + path('M-2.6,-4 L-5.6,-1 L-3.6,-1 L-1.4,-3 Z', '#2A2630')
    + ell(-0.4, -6.4, 3.4, 4.8, '#2A2630', OUT) + ell(1.2, -8.4, 2.2, 2.6, '#FFD23E')
    + `<g transform="rotate(${tilt} 0.6 -11.4)">` + ell(0.6, -11.6, 2.6, 2.4, '#2A2630', OUT)
    + path('M2.4,-13 Q7.6,-14.4 9.6,-11.4 Q7.6,-9.4 2.6,-10 Z', '#F2A33A', OUT) + path('M8.4,-12.4 Q9.6,-12 9.6,-11.4 Q9,-10.6 8.2,-10.4 Z', '#2A2630')
    + path('M2.6,-11.6 Q6,-12 9.2,-11.4', 'none', ' stroke="#D9822A" stroke-width=".4"')
    + dot(1.2, -12.2, 1.1, '#7FC6E8') + eye(1.2, -12.2, 0.6) + `</g>`, SMALL);
}

/* ---------- Le Volcan ---------- */
// Salamandre : noire à taches orange ; 0 et 1 : elle marche ; rest : immobile, yeux fermés
export function salamander(frame) {
  const B = '#38333F', S = '#FFB23E';
  const st = frame === 1 ? 1 : 0;
  return sprite(shadow(9) + ln([-3, -1.6], [-4.4 + st, 0], B, 1.2) + ln([3, -1.6], [4.4 - st, 0], B, 1.2)
    + `<path d="M-4,-2.4 Q-8,-2 -11,-1" fill="none" stroke="${B}" stroke-width="2" stroke-linecap="round"/>`
    + ell(0, -2.6, 5, 1.8, B, OUT) + ell(6, -3, 2.4, 1.9, B, OUT)
    + ln([-1.6, -1.4], [-2.8 - st, 0], B, 1.2) + ln([2.2, -1.4], [3 + st, 0], B, 1.2)
    + [[-8, -1.8, 0.5], [-4.6, -3.2, 0.7], [-1.4, -3.6, 0.8], [2, -3.4, 0.7], [5, -4.2, 0.55]].map(([x, y, r]) => dot(x, y, r, S)).join('')
    + (frame === 'rest' ? shut(6.6, -3.8, 0.55) : eye(6.8, -3.9, 0.7)) + cheek(7.6, -2.6, 0.55), SMALL);
}
// Corbeau des cendres : noir bleuté, bec gris ; 1 : il croasse (bec ouvert) ; rest : en boule
export function crow(frame) {
  const B = '#3A3848', D = '#2C2A36';
  if (frame === 'rest') {
    return sprite(shadow(5) + ell(0, -4, 4.4, 3.8, B, OUT) + ell(2.6, -6.4, 2.2, 2, B, OUT) + path('M4.4,-6.8 L6.4,-6.2 L4.4,-5.6 Z', '#6A6672')
      + shut(3, -6.8, 0.55), SMALL);
  }
  const caw = frame === 1;
  return sprite(shadow(5) + ln([-0.6, -2.6], [-0.8, 0], '#4A4652', 0.8) + ln([1, -2.6], [1.4, 0], '#4A4652', 0.8)
    + path('M-3,-5 L-7,-3.4 L-6.6,-2.6 L-2.6,-3.4 Z', D)
    + ell(0, -5.4, 4, 3.4, B, OUT) + path('M-3.4,-6 Q-1,-8 2,-5.6 Q-1,-4 -3.4,-6 Z', D)
    + ell(3, -8.8, 2.4, 2.2, B, OUT)
    + (caw ? path('M4.8,-9.6 L8.2,-10.4 L5,-8.8 Z M4.8,-8.6 L7.8,-7.4 L4.8,-7.8 Z', '#6A6672') : path('M4.8,-9.6 L8,-8.6 L4.8,-7.8 Z', '#6A6672'))
    + eye(3.6, -9.4, 0.7) + cheek(3.8, -7.8, 0.55), SMALL);
}

/* ---------- Le Bestiaire (HISTOIRE.md, § 6.5) et les familiers (§ 14) ---------- */
// Mésange : calotte bleue, joues blanches, ventre jaune, dos olive ; 1 : elle picore ; rest : en boule
export function bird(frame) {
  const sit = frame === 'rest';
  const y = sit ? 1 : 0;
  const [hx, hy] = frame === 1 ? [3.4, -3.8] : [2.6, -6 + y];
  return sprite(shadow(3.2) + (sit ? '' : ln([-0.4, -1.6], [-0.6, 0], '#7A6A5A', 0.6) + ln([0.8, -1.6], [1, 0], '#7A6A5A', 0.6))
    + path(`M-2.8,${-3.6 + y} L-6.4,${-4.8 + y} L-5.8,${-2.8 + y} Z`, '#3F5F8E')
    + ell(0, -3.4 + y, 3.2, 2.3, '#F2D04B', OUT) + path(`M-3,${-3.8 + y} Q-0.6,${-6.2 + y} 2.2,${-4.8 + y} Q0,${-3.2 + y} -3,${-3.8 + y} Z`, '#8FA65A')
    + ell(-0.8, -3.8 + y, 1.7, 1, '#4A7FC1')
    + dot(hx, hy, 1.9, '#FFFDF7', OUT) + path(`M${hx - 1.9},${hy} Q${hx},${hy - 2.9} ${hx + 1.9},${hy} Q${hx},${hy - 1} ${hx - 1.9},${hy} Z`, '#4A7FC1')
    + ln([hx - 0.6, hy + 0.4], [hx + 1.6, hy + 0.2], '#2A3A5A', 0.5) + path(`M${hx + 1.8},${hy - 0.2} l1.4,.5 l-1.4,.5 Z`, '#3A3A3A')
    + (sit ? shut(hx + 0.6, hy - 0.1, 0.5) : eye(hx + 0.7, hy - 0.2, 0.55)), { x: -8, y: -10, w: 14, h: 11 });
}
// Papillon de profil, ailes ouvertes (0) ou levées (1) ; variante : jaune, bleu, ou « lune » (Lunette, le papillon de
// nuit de Mélisse : ailes lilas à croissants pâles, corps duveteux)
const WINGS = { jaune: ['#F2C04B', '#C98A2E'], bleu: ['#8EC5F0', '#4A7FC1'], lune: ['#C8BEDC', '#F6EDB0'] };
export function butterfly(frame, variant = 'jaune') {
  const [wing, mark] = WINGS[variant] || WINGS.jaune;
  const moth = variant === 'lune';
  const wings = frame === 1
    ? ell(-0.6, -5.6, 1.4, 3.2, wing, `${OUT} transform="rotate(-12 -0.6 -5.6)"`) + ell(-0.4, -5.6, 0.6, 1.4, mark)
    : ell(-2.2, -4.2, 2.8, 2.2, wing, `${OUT} transform="rotate(-28 -2.2 -4.2)"`) + ell(1.6, -4.4, 2.4, 2, wing, `${OUT} transform="rotate(24 1.6 -4.4)"`)
      + ell(-2.6, -2.2, 1.6, 1.2, wing, OUT) + ell(1.4, -2.2, 1.4, 1.1, wing, OUT)
      + (moth ? path('M-3,-4.6 q.8,-.9 1.6,0 q-.8,-.4 -1.6,0 Z M1,-4.8 q.8,-.9 1.6,0 q-.8,-.4 -1.6,0 Z', mark) : dot(-2.4, -4.4, 0.6, mark) + dot(1.8, -4.6, 0.55, mark));
  return sprite(wings + ell(0, -2.8, moth ? 0.8 : 0.5, 2, moth ? '#8E82AA' : '#3D2A1E')
    + `<path d="M0.3,-4.6 q.6,-1.8 1.8,-2.2 M0.1,-4.6 q-.2,-1.9 -1,-2.6" fill="none" stroke="#3D2A1E" stroke-width=".3" stroke-linecap="round"/>`, { x: -6, y: -9, w: 12, h: 9 });
}
// Luciole : un point de lumière qui palpite (1 : plus vif)
export function firefly(frame) {
  const glow = frame === 1 ? 0.95 : 0.5;
  return sprite(`<defs><radialGradient id="ff"><stop offset="0" stop-color="#FFF6A8" stop-opacity="${glow}"/><stop offset="1" stop-color="#FFE45C" stop-opacity="0"/></radialGradient></defs>`
    + `<circle r="4.4" fill="url(#ff)"/>` + dot(0.3, 0.2, 0.85, '#FFFBD6') + ell(-0.5, -0.3, 0.6, 0.35, '#5A4A3A'), { x: -5, y: -5, w: 10, h: 10 });
}
// Abeille : rayée, ailes qui vibrent (0 et 1)
export function bee(frame) {
  const up = frame === 1;
  return sprite(ell(-0.6, up ? -4.4 : -3.8, 1.8, up ? 0.9 : 1.4, 'rgba(232,242,255,.85)', ' stroke="rgba(60,40,25,.25)" stroke-width=".3"')
    + ell(0, -2, 2.4, 1.7, '#F2C04B', OUT) + `<path d="M-1,-3.5 L-1,-0.5 M0.6,-3.6 L0.6,-0.4" stroke="#3D2A1E" stroke-width=".8"/>`
    + path('M-2.4,-2.1 L-3.4,-1.9 L-2.3,-1.6 Z', '#3D2A1E') + dot(2.2, -2.3, 1.1, '#3D2A1E') + dot(2.5, -2.6, 0.3, '#FFFFFF'), { x: -5, y: -7, w: 10, h: 8 });
}
// Hibou perché, de face : aigrettes, disque facial, grands yeux ; 1 : il cligne
export function owl(frame) {
  const B = '#8B6A4A', L = '#E6D2B0', D = '#5E4632';
  const blink = frame === 1;
  return sprite(ell(0, -5, 3.8, 4.8, B, OUT) + ell(0, -3.8, 2.4, 3, L)
    + `<path d="M-1.6,-4.4 l.8,.6 l.8,-.6 M-1.2,-2.6 l.8,.6 l.8,-.6" fill="none" stroke="${D}" stroke-width=".4"/>`
    + path('M-3.6,-9.6 L-2.8,-12.2 L-1.4,-9.8 Z M3.6,-9.6 L2.8,-12.2 L1.4,-9.8 Z', B) + ell(0, -9.2, 3.6, 2.8, B, OUT)
    + ell(-1.4, -9.2, 1.4, 1.4, '#FFF4D6') + ell(1.4, -9.2, 1.4, 1.4, '#FFF4D6')
    + (blink ? shut(-1.4, -9.2, 0.7) + shut(1.4, -9.2, 0.7) : eye(-1.4, -9.2, 0.8) + eye(1.4, -9.2, 0.8))
    + path('M-0.45,-8.4 L0.45,-8.4 L0,-7.3 Z', '#E8A13A') + ln([-1, -0.4], [-1, 0.2], '#E8A13A', 0.6) + ln([1, -0.4], [1, 0.2], '#E8A13A', 0.6), { x: -6, y: -14, w: 12, h: 15 });
}
// Tic-Tac, l'abeille mécanique de Rivet : laiton, clé de remontoir, œil de verre ; 1 : ailes levées ; rest : arrêtée
export function tictac(frame) {
  const rest = frame === 'rest';
  const up = frame === 1;
  const BR = '#C9A04A', DK = '#8A6A2A';
  return sprite((rest ? shadow(3.4) : '') + (rest ? '' : ell(-0.4, up ? -6.2 : -5.4, 2.6, up ? 1.1 : 1.8, 'rgba(225,235,245,.8)', ' stroke="#8A9AA8" stroke-width=".35"'))
    + ell(0, -3, 3.4, 2.4, BR, OUT) + `<path d="M-1.4,-5.2 L-1.4,-0.8 M0.6,-5.3 L0.6,-0.7" stroke="${DK}" stroke-width=".7"/>` + dot(-0.4, -3, 0.45, DK)
    + ln([-0.6, -5.4], [-1.2, -7.4], DK, 0.6) + `<path d="M-2.6,-8.2 h2.8 M-1.2,-7.4 v-1.6" stroke="${DK}" stroke-width=".7" stroke-linecap="round"/>`
    + path('M-3.4,-3.1 L-4.6,-2.8 L-3.4,-2.5 Z', DK) + dot(3, -3.4, 1.5, '#6E7A84') + dot(3.4, -3.8, 0.55, '#BFE3F2')
    + (rest ? ln([2.4, -1.4], [2.8, 0], DK, 0.5) + ln([-1.6, -0.9], [-2, 0], DK, 0.5) : ''), { x: -6, y: -10, w: 12, h: 11 });
}
// Le bocal d'Ondin : du verre, de l'eau, un caillou ; Bulle dedans (variante « bulle ») qui fait l'aller-retour (0 et 1)
export function bowl(frame, variant = '') {
  const fx = frame === 1 ? 1.2 : -1.2;
  const fish = variant === 'bulle'
    ? `<g transform="translate(${fx} -3.6)${frame === 1 ? ' scale(-1 1)' : ''}">` + ell(0, 0, 1.7, 1, '#F08A3A', OUT) + path('M-1.5,0 L-2.8,-0.9 L-2.8,0.9 Z', '#F08A3A') + dot(0.8, -0.2, 0.3, EYE) + `</g>`
      + dot(fx * 0.6 + 0.4, -6.4, 0.35, 'rgba(255,255,255,.9)') + dot(fx * 0.6 + 0.9, -7.4, 0.25, 'rgba(255,255,255,.8)')
    : '';
  return sprite(shadow(4.6) + ell(0, -3.9, 4.1, 3.3, 'rgba(110,175,215,.55)') + ell(-1, -1.2, 1.1, 0.6, '#9A9A90') + fish
    + ell(0, -4.6, 4.6, 4.4, 'rgba(210,235,248,.28)', ' stroke="rgba(90,130,150,.75)" stroke-width=".6"')
    + ell(0, -8.7, 2.3, 0.7, 'rgba(210,235,248,.5)', ' stroke="rgba(90,130,150,.75)" stroke-width=".5"')
    + `<path d="M-3,-6.4 Q-3.2,-4 -2,-2.6" fill="none" stroke="rgba(255,255,255,.8)" stroke-width=".6" stroke-linecap="round"/>`, { x: -6, y: -10, w: 12, h: 11 });
}
// Mousse, le renardeau de Sylve : rond, grandes oreilles, queue à bout blanc ; 0 et 1 : il trotte ; rest : roulé en boule
export function kit(frame) {
  const O = '#E58A3E';
  const sit = frame === 'rest';
  return sprite(shadow(5) + (sit ? '' : legs([-2.4, -0.8, 1.6, 3], -2.6, 2.6, '#3D2A1E', frame, 1))
    + `<path d="M-3.4,-4.2 Q-8,-5.6 -7.6,-2.4 Q-5.6,-1.4 -3.4,-3 Z" fill="${O}"${OUT}/>` + ell(-7.2, -2.6, 1.1, 0.9, '#FFFDF8')
    + ell(0, -4.2, 4, 2.6, O, OUT) + ell(1.2, -3.4, 2, 1.2, '#FFF4E4')
    + path('M2.4,-8.8 L2.4,-11.6 L4,-9.4 Z M4.6,-9.2 L5.6,-11.8 L6.2,-9 Z', O, OUT) + path('M2.8,-9.4 L2.8,-10.8 L3.6,-9.6 Z', '#3D2A1E')
    + ell(4, -7, 2.8, 2.5, O, OUT) + ell(5.4, -6.2, 1.4, 1, '#FFF4E4') + dot(6.7, -6.4, 0.45, '#2A2420')
    + (sit ? shut(4.6, -7.4, 0.6) : eye(4.6, -7.4, 0.75)) + cheek(5.2, -6, 0.55), SMALL);
}

// Loutre (une créature d'Anya) : brune, ventre clair, queue épaisse ; 1 : elle se dresse ; rest : roulée
export function otter(frame) {
  const B = '#7A5236', L = '#E6D2B0';
  if (frame === 'rest') return sprite(shadow(6) + ell(0, -3, 6, 3, B, OUT) + ell(4.4, -4, 2.4, 2, B, OUT) + ell(4.8, -3.4, 1.2, 0.9, L) + shut(4.4, -4.6, 0.55), SMALL);
  if (frame === 1) {
    return sprite(shadow(4) + path('M-2,-1 Q-7,0 -8,-3 Q-5,-2 -2,-3 Z', B) + ell(0, -6, 2.8, 5, B, OUT) + ell(0.6, -5, 1.6, 3.4, L)
      + dot(0.4, -12, 2.6, B) + ell(1.2, -11.4, 1.4, 1, L) + eye(1.6, -12.6, 0.6) + dot(2.8, -11.6, 0.4, EYE) + cheek(1.4, -10.8, 0.5), SMALL);
  }
  return sprite(shadow(7) + path('M-5,-3 Q-11,-2 -12,-5 Q-8,-4 -5,-5 Z', B) + ell(0, -3.6, 6, 2.8, B, OUT) + ell(1, -2.6, 3.6, 1.2, L)
    + dot(5.4, -5.2, 2.4, B) + ell(6.2, -4.6, 1.3, 0.9, L) + eye(6, -5.8, 0.6) + dot(7.4, -4.8, 0.4, EYE) + cheek(6.2, -4.2, 0.5)
    + ln([-3, -1.4], [-3.4, 0], B, 1) + ln([3, -1.4], [3.4, 0], B, 1), SMALL);
}
// Le bol de soupe que Cannelle pose chaque soir « pour la Dame » au bord du Foyer ; 0 et 1 : la vapeur monte
export function soup(frame) {
  const up = frame === 1 ? -1 : 0;
  return sprite(shadow(4) + path('M-4.6,-3 Q-4.4,0 0,0.4 Q4.4,0 4.6,-3 Z', '#C46E45', OUT) + ell(0, -3, 4.6, 1.2, '#E8A86A', OUT)
    + `<path d="M-1.2,${f2(-5 + up)} q-1,-1.6 0,-3.2 M1.4,${f2(-5.6 + up)} q1,-1.6 0,-3.2" fill="none" stroke="rgba(255,255,255,.7)" stroke-width=".6" stroke-linecap="round"/>`, { x: -6, y: -10, w: 12, h: 11 });
}

// Toutes les bêtes de l'île par sorte : dessin d'une image (0, 1 ou rest)
export const ANIMAL_SPRITES = {
  hen: (frame, breed) => hen(breed, frame), chick, cow, sheep, pig, goat, deer, fox, rabbit, hedgehog, squirrel,
  koi: (frame, color) => koi(color, frame), heron,
  snowFox, ibex, puffin, pony, frog, tortoise, fennec, camel, chameleon, toucan, salamander, crow,
  bird, butterfly, firefly, bee, owl, tictac, bowl, kit, otter, soup, anya: anyaSprite
};
