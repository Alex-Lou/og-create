// Les nuits dessinées dans la bibliothèque (HISTOIRE.md § 6.15) : les égarés (design/bibliotheque/svg/egares,
// egares.json) et le bâtiment embrumé (svg/decor/embrume, embrume.json). Cadres du jeu × 1,25, ancres comme la
// bibliothèque les note : l'égaré à ses pieds, la brume au centre de l'emprise du bâtiment, le petit nuage à son pied.
import EGARES from '../../design/bibliotheque/svg/egares/egares.json';
import EMBRUME from '../../design/bibliotheque/svg/decor/embrume/embrume.json';
import { librarySprite, portraitOf, frameAt, textsOf } from './library';

const FILES = textsOf({
  ...import.meta.glob('/design/bibliotheque/svg/egares/**/*.svg', { query: '?url', import: 'default', eager: true }),
  ...import.meta.glob('/design/bibliotheque/svg/decor/embrume/*.svg', { query: '?url', import: 'default', eager: true })
});
const URLS = import.meta.glob('/design/bibliotheque/svg/decor/embrume/reparer_icone.svg', { query: '?url', import: 'default', eager: true });
const STRAYS = '/design/bibliotheque/svg/egares/';
const MIST = '/design/bibliotheque/svg/decor/embrume/';
const SCALE = 1.25;
const boxOf = ([x, y, w, h]) => ({ x: x / SCALE, y: y / SCALE, w: w / SCALE, h: h / SCALE });

// Le dessin d'un égaré, selon son espèce (le serveur la décide : services/nights.js, KINDS) : le sien dans la
// bibliothèque ; la bête de brume (bete), celle du climat d'où il sort (climate : null, le cœur, tempéré). Une espèce
// sans dessin prend celui du Sans-Nom
const BEASTS = Object.fromEntries(Object.entries(EGARES.egares).filter(([, e]) => e.climat).map(([id, e]) => [e.climat, id]));
export function strayKind(kind, climate) {
  if (kind === 'bete') return BEASTS[climate] || BEASTS.tempere;
  return EGARES.egares[kind] ? kind : 'fantome';
}
// Le portrait d'un égaré (le Bestiaire) : debout, de face (sa pose repos), recadré (library.js : portraitOf) ; null s'il
// n'a pas de dessin
export function strayPortraitUrl(kind) {
  const art = EGARES.egares[kind];
  const load = art && FILES[STRAYS + art.fichiers.avant.repos];
  return load ? portraitOf(`stray:${kind}`, load) : null;
}

export const strayName = kind => (EGARES.egares[kind] && EGARES.egares[kind].nom) || 'Un égaré';

const makes = new Map();
const layerOf = (path, box, key) => {
  if (!FILES[path]) return null;
  if (!makes.has(path)) makes.set(path, librarySprite(FILES[path], box));
  return { key, make: makes.get(path) };
};

// Le dessin d'un égaré : sa sorte, sa vue (avant, dos), sa pose (marche, repos, bouderie, luciole, brume, fuite ; dort,
// le Dormeur contre une clôture ; terre, la Racine qui passe dessous) et son image (1, 2…) ; { key, make }, ou null. De
// dos, les poses d'une fois se jouent de trois quarts avant. Sans sa pose terre, la Racine sous la clôture ne se voit
// pas ; sans sa pose dort, le Dormeur dort debout (repos)
export function strayLayer(kind, view, pose, n = 1) {
  const art = EGARES.egares[kind];
  if (!art) return null;
  const files = art.fichiers[view] || art.fichiers.avant;
  const name = pose === 'repos' ? 'repos' : `${pose}${n}`;
  if (pose === 'terre' && !art.fichiers.avant[name]) return null;
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
