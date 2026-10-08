// Les nuits dessinées dans la bibliothèque (HISTOIRE.md § 6.15) : les égarés (design/bibliotheque/svg/egares,
// egares.json) et le bâtiment embrumé (svg/decor/embrume, embrume.json). Cadres du jeu × 1,25, ancres comme la
// bibliothèque les note : l'égaré à ses pieds, la brume au centre de l'emprise du bâtiment, le petit nuage à son pied.
import EGARES from '../../design/bibliotheque/svg/egares/egares.json';
import EMBRUME from '../../design/bibliotheque/svg/decor/embrume/embrume.json';
import { librarySprite, frameAt } from './library';

const FILES = {
  ...import.meta.glob('/design/bibliotheque/svg/egares/**/*.svg', { query: '?raw', import: 'default' }),
  ...import.meta.glob('/design/bibliotheque/svg/decor/embrume/*.svg', { query: '?raw', import: 'default' })
};
const URLS = import.meta.glob('/design/bibliotheque/svg/decor/embrume/reparer_icone.svg', { query: '?url', import: 'default', eager: true });
const STRAYS = '/design/bibliotheque/svg/egares/';
const MIST = '/design/bibliotheque/svg/decor/embrume/';
const SCALE = 1.25;
const boxOf = ([x, y, w, h]) => ({ x: x / SCALE, y: y / SCALE, w: w / SCALE, h: h / SCALE });

// Cadence des poses (egares.json) : marche, bouderie, luciole, brume (ms par image)
export const STRAY_MS = { marche: 240, bouderie: 500, luciole: 200, brume: 220 };
// Les images de chaque pose jouée une fois
export const STRAY_FRAMES = { bouderie: 2, luciole: 4, brume: 3 };

// La sorte d'un égaré : un petit fantôme, un petit zombie, ou la bête de brume du climat d'où il vient (tirée de son
// identifiant : la même à chaque fois) ; climate : le climat de la case d'où il sort (null : le cœur, tempéré)
const BEASTS = Object.fromEntries(Object.entries(EGARES.egares).filter(([, e]) => e.climat).map(([id, e]) => [e.climat, id]));
export function strayKind(id, climate) {
  const k = [...String(id)].reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) >>> 0, 7) % 3;
  if (k === 0) return 'fantome';
  if (k === 1) return 'zombie';
  return BEASTS[climate] || BEASTS.tempere;
}
export const strayName = kind => (EGARES.egares[kind] && EGARES.egares[kind].nom) || 'Un égaré';

const makes = new Map();
const layerOf = (path, box, key) => {
  if (!FILES[path]) return null;
  if (!makes.has(path)) makes.set(path, librarySprite(FILES[path], box));
  return { key, make: makes.get(path) };
};

// Le dessin d'un égaré : sa sorte, sa vue (avant, dos), sa pose (marche, repos, bouderie, luciole, brume, fuite) et
// son image (1, 2…) ; { key, make }, ou null. De dos, les poses d'une fois se jouent de trois quarts avant
export function strayLayer(kind, view, pose, n = 1) {
  const art = EGARES.egares[kind];
  if (!art) return null;
  const files = art.fichiers[view] || art.fichiers.avant;
  const name = pose === 'repos' ? 'repos' : `${pose}${n}`;
  const file = files[name] || art.fichiers.avant[name] || files.repos;
  return file ? layerOf(STRAYS + file, boxOf(art.cadre), `stray-${file}`) : null;
}

// La brume d'un bâtiment embrumé (emprise size × size) à l'instant t (secondes) ; heal : sa guérison, ms depuis la
// réparation (une fois). { key, make }, ou null (guérison finie, ou dessin absent)
export function blightLayer(size, t, heal = null) {
  const name = heal === null ? `${size}x${size}` : `${size}x${size}_guerison`;
  const art = EMBRUME.calques[name];
  if (!art) return null;
  let f;
  if (heal === null) f = frameAt(art, t);
  else {
    const steps = art.ms_par_image;
    let left = heal;
    f = steps.findIndex(ms => (left -= ms) < 0);
    if (f < 0) return null;
  }
  return layerOf(MIST + art.fichiers[f], boxOf(art.cadre), `embrume-${name}-${f}`);
}
// Le petit nuage grognon au-dessus du bâtiment embrumé
export function cloudLayer(t) {
  const art = EMBRUME.calques.nuage;
  const f = frameAt(art, t);
  return layerOf(MIST + art.fichiers[f], boxOf(art.cadre), `embrume-nuage-${f}`);
}
// L'icône « Réparer » de la fiche (32 × 32), ou null
export const repairIcon = () => URLS[`${MIST}reparer_icone.svg`] || null;
