// Les annexes et les gisements dessinés dans la bibliothèque (design/bibliotheque/svg/decor : annexes/ et gisements/,
// decor.json), au cadre du jeu × 1,25 et autour de la même ancre : chaque annexe prend son dessin et son animation (et
// sa variante : le blé, les carottes ou les citrouilles d'un champ, les toits d'une maison…, dans l'ordre du jeu :
// variante_jeu), chaque gisement son dessin prêt (animé) ou ramassé. Ce que la bibliothèque n'a pas garde son dessin
// par code (annexSprites.js, depositSprites.js). Les lumières de nuit restent celles du jeu : la bibliothèque les a
// mesurées au même endroit (decor.json, lumiere).
import { reactive } from 'vue';
import DECOR from '../../design/bibliotheque/svg/decor/decor.json';
import { librarySprite, cropTo, paintedBox, BLANK, frameAt } from './library';

// Chargés à la demande, un fichier à la fois (le jeu ne lit que ce qui est posé sur l'île)
const FILES = import.meta.glob('/design/bibliotheque/svg/decor/{annexes,gisements}/**/*.svg', { query: '?raw', import: 'default' });
const ROOT = '/design/bibliotheque/svg/decor/';
const SCALE = 1.25;

// Le cadre du jeu d'un dessin de la bibliothèque
const boxOf = ([x, y, w, h]) => ({ x: x / SCALE, y: y / SCALE, w: w / SCALE, h: h / SCALE });

// Les dessins de chaque annexe, rangés par variante du jeu (« champ_ble » est la variante 0 du champ)
const ANNEXES = {};
for (const [name, art] of Object.entries(DECOR.annexes)) {
  const id = name.split('_')[0];
  (ANNEXES[id] = ANNEXES[id] || [])[art.variante_jeu || 0] = { name, art };
}
// L'entrée d'une annexe pour une variante du jeu (elles tournent : la 4e d'un champ refait du blé), ou null
function annexEntry(id, variant) {
  const list = ANNEXES[id];
  return list ? list[variant % list.length] || null : null;
}

const makes = new Map();
// Le calque d'un dessin à l'instant t : { key, make }, ou null si son fichier manque
function layerOf(name, art, t) {
  const f = frameAt(art, t);
  const path = ROOT + art.fichiers[f];
  if (!FILES[path]) return null;
  if (!makes.has(path)) makes.set(path, librarySprite(FILES[path], boxOf(art.cadre)));
  return { key: `lib-${name}-${f}`, make: makes.get(path) };
}

// Le calque d'une annexe (sa variante) à l'instant t (secondes), ou null si la bibliothèque ne l'a pas
export function annexArtLayer(id, variant = 0, t = 0) {
  const entry = annexEntry(id, variant);
  return entry ? layerOf(entry.name, entry.art, t) : null;
}

// Le calque d'un gisement, prêt (animé) ou ramassé, à l'instant t (secondes), ou null si la bibliothèque ne l'a pas
export function depositArtLayer(find, ready, t = 0) {
  const name = `${find}_${ready ? 'pret' : 'ramasse'}`;
  const art = DECOR.gisements[name];
  return art ? layerOf(name, art, t) : null;
}

// Vignette d'une annexe (sa fiche, le choix des annexes d'un bâtiment) : la première image de son dessin, recadrée sur
// ce qu'elle peint. Lue et mesurée une fois, à la première demande ; une image vide pendant ce temps. null si la
// bibliothèque ne l'a pas ou si la lecture échoue : l'ancienne vignette reste
const started = new Set();
const thumbs = reactive({});
export function annexArtThumb(id, variant = 0) {
  const entry = annexEntry(id, variant);
  const load = entry && FILES[ROOT + entry.art.fichiers[0]];
  if (!load) return null;
  if (!started.has(entry.name)) {
    started.add(entry.name);
    load()
      .then(svg => paintedBox(svg).then(box => cropTo(svg, box)))
      .then(svg => { thumbs[entry.name] = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`; }, () => { thumbs[entry.name] = null; });
  }
  return entry.name in thumbs ? thumbs[entry.name] : BLANK;
}
