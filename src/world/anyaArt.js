// Anya et son cerf de lune dessinés dans la bibliothèque (design/bibliotheque/svg/vivants : anya/, cerf-blanc/), à
// l'échelle des maîtres (masterArt.js : le jeu × 1,25). Anya : l'initiale, la chevelure argentée (choix de l'auteur,
// 16 oct.) ; son repos, sa marche, apparaître et disparaître dans ses lucioles, et le murmure (trois phrases, une bulle),
// de face, de trois quarts avant (vers le bas à droite) et de dos (vers le haut à droite) ; le miroir donne les deux
// autres ; son manteau change avec la saison. Le cerf, refondu : debout et la marche, dans les mêmes vues. Chargés à la
// demande, un fichier à la fois.
import { librarySprite } from './library';

const FILES = import.meta.glob([
  '/design/bibliotheque/svg/vivants/anya/anya_{face,avant,dos}_{repos,marche,apparaitre,disparaitre,murmure1,murmure2,murmure3}_*.svg',
  '/design/bibliotheque/svg/vivants/cerf-blanc/cerf-blanc_{face,avant,dos}_{debout,marche}_[0-9].svg'
], { query: '?raw', import: 'default' });
const ROOT = '/design/bibliotheque/svg/vivants/';
const SCALE = 1.25;

// Leurs animations : [images, ms par image, ou la durée de chacune] (la cadence de la bibliothèque : noms_personnages.js) ;
// son repos respire et cligne à la 4e image ; son éveil (la Révélation : PrologueArt.vue) ouvre les bras
export const ANYA_POSES = { repos: [4, [1100, 900, 1100, 180]], marche: [8, 130], apparaitre: [6, 260], disparaitre: [6, 260], murmure: [4, 420], eveil: [2, [700, 900]] };
export const CERF_POSES = { debout: [4, 420], marche: [8, 120] };
// Le nombre de phrases de son murmure (son écriture de lune : anya_anims.js, BULLES)
export const PHRASES = 3;
// La durée de chaque image d'une animation (ms)
const timesOf = ([images, ms]) => (Array.isArray(ms) ? ms : Array(images).fill(ms));
// La durée d'une animation (s) ; une animation jouée une fois (apparaître, disparaître, le murmure) en dure autant
export const durationOf = anim => timesOf(anim).reduce((a, b) => a + b, 0) / 1000;

// Leurs cadres : 80 × 128, les pieds d'Anya en (40, 125) ; 120 × 144, le sabot du cerf en (60, 141). Le cerf se
// voit à 80 % (choix de l'auteur, 16 oct. : à la taille de ses planches, il dépassait Anya d'une tête ; ses bois
// arrivent maintenant à sa couronne)
const CERF_SIZE = 0.8;
const boxOf = (w, h, [ax, ay], k = 1) => ({ x: (-ax / SCALE) * k, y: (-ay / SCALE) * k, w: (w / SCALE) * k, h: (h / SCALE) * k });
const ANYA_BOX = boxOf(80, 128, [40, 125]);
const CERF_BOX = boxOf(120, 144, [60, 141], CERF_SIZE);

// L'image d'une animation à s secondes de son début (once : jouée une fois, elle reste sur sa dernière image), de 1 à n
export function frameOf(anim, s, once = false) {
  const times = timesOf(anim);
  const total = durationOf(anim) * 1000;
  let at = Math.max(0, s) * 1000;
  if (once && at >= total) return times.length;
  at %= total;
  let k = 0;
  while (k < times.length - 1 && at >= times[k]) at -= times[k++];
  return k + 1;
}

const makes = new Map();
function spriteOf(path, box) {
  if (!FILES[path]) return null;
  if (!makes.has(path)) makes.set(path, librarySprite(FILES[path], box));
  return { key: `lib-${path.split('/').pop().replace(/\.svg$/, '')}`, make: makes.get(path) };
}

// Anya : pose (repos, marche, apparaitre, disparaitre, murmure), vue (face, avant, dos), image n ; sa saison (son manteau
// d'été sinon) ; phrase : celle du murmure (0 à 2). { key, make }, ou null si la bibliothèque ne l'a pas
export function anyaArt(pose, view, n, { season = 'ete', phrase = 0 } = {}) {
  const name = pose === 'murmure' ? `murmure${(phrase % PHRASES) + 1}` : pose;
  const at = suffix => `${ROOT}anya/anya_${view}_${name}${suffix}_${n}.svg`;
  return spriteOf(season !== 'ete' && FILES[at(`_${season}`)] ? at(`_${season}`) : at(''), ANYA_BOX);
}

// Le cerf de lune : pose (debout, marche), vue (face, avant, dos), image n. { key, make }, ou null
export function cerfArt(pose, view, n) {
  return spriteOf(`${ROOT}cerf-blanc/cerf-blanc_${view}_${pose}_${n}.svg`, CERF_BOX);
}
