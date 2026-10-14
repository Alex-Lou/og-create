// La planche de Pierrot (choix de l'auteur, 14 oct.) : au matin du jour 5, la longue-vue d'Hermine la voit sur la vague ;
// elle dérive jusqu'au sable, un peu plus loin que le Ponton, Pierrot endormi dessus (game/stages.js : planche). Le dessin
// du code, en attendant celui de la bibliothèque.
import { shadow, sprite } from '../iso';
import { WOOD, PROP_BOX } from '../palette';

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

// Une planche de bois flotté, en long sous le dormeur (couché de gauche à droite à l'écran) : son chant, son dessus, deux
// lattes, un clou ; le trait brun de la bibliothèque
const INK = '#3C2819';
export const PLANK_SPRITE = ['planche-ondin', () => sprite(shadow(0, 0, 0.5, 0.18)
  + `<rect x="-32" y="-7" width="64" height="11" rx="4" fill="${WOOD.right}" stroke="${INK}" stroke-width="1"/>`
  + `<rect x="-32" y="-${7 + PLANK_LIFT}" width="64" height="11" rx="4" fill="${WOOD.top}" stroke="${INK}" stroke-width="1"/>`
  + `<path d="M-29,-${6 + PLANK_LIFT} H29" stroke="#F3C58C" stroke-width="1.2" stroke-linecap="round"/>`
  + `<path d="M-30,-${2 + PLANK_LIFT} H30 M-22,${1 - PLANK_LIFT} H6" stroke="${WOOD.left}" stroke-width="0.9" stroke-linecap="round"/>`
  + `<circle cx="24" cy="-${1 + PLANK_LIFT}" r="1.1" fill="${INK}"/>`, PROP_BOX)];
