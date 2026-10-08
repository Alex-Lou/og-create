// Les annexes, les gisements, les enseignes et les îlots dessinés dans la bibliothèque (design/bibliotheque/svg/decor :
// annexes/, gisements/, enseignes/, ilots/, decor.json), au cadre du jeu × 1,25 et autour de la même ancre : chaque annexe prend son dessin et son animation (et
// sa variante : le blé, les carottes ou les citrouilles d'un champ, les toits d'une maison…, dans l'ordre du jeu :
// variante_jeu), chaque gisement son dessin prêt (animé) ou ramassé. Ce que la bibliothèque n'a pas garde son dessin
// par code (annexSprites.js, depositSprites.js). Les lumières de nuit restent celles du jeu : la bibliothèque les a
// mesurées au même endroit (decor.json, lumiere).
import { reactive } from 'vue';
import DECOR from '../../design/bibliotheque/svg/decor/decor.json';
import CULTURES from '../../design/bibliotheque/svg/decor/cultures/cultures.json';
import { librarySprite, cropTo, paintedBox, BLANK, frameAt } from './library';

// Chargés à la demande, un fichier à la fois (le jeu ne lit que ce qui est posé sur l'île)
const FILES = import.meta.glob('/design/bibliotheque/svg/decor/{annexes,gisements,enseignes,ilots,lieux,cultures}/**/*.svg', { query: '?raw', import: 'default' });
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
// Les noms des couleurs dessinées d'une annexe, dans l'ordre du jeu (« blé », « toit rouge »… : ce qui suit le tiret
// de son nom dans la bibliothèque)
export const annexLookNames = id => (ANNEXES[id] || []).map(e => (e ? e.art.nom.split('— ')[1] || e.art.nom : ''));
// L'entrée d'une annexe pour une variante du jeu (elles tournent : la 4e d'un champ refait du blé), ou null
function annexEntry(id, variant) {
  const list = ANNEXES[id];
  return list ? list[variant % list.length] || null : null;
}

const makes = new Map();
// Le calque d'un dessin à l'instant t : { key, make }, ou null si son fichier manque
const layerOf = (name, art, t) => frameLayer(name, art, frameAt(art, t));
// Le calque de l'image f d'un dessin
function frameLayer(name, art, f) {
  const path = ROOT + art.fichiers[f % art.fichiers.length];
  if (!FILES[path]) return null;
  if (!makes.has(path)) makes.set(path, librarySprite(FILES[path], boxOf(art.cadre)));
  return { key: `lib-${name}-${f % art.fichiers.length}`, make: makes.get(path) };
}

// Le calque d'une annexe (sa variante) à l'instant t (secondes), ou null si la bibliothèque ne l'a pas
export function annexArtLayer(id, variant = 0, t = 0) {
  const entry = annexEntry(id, variant);
  return entry ? layerOf(entry.name, entry.art, t) : null;
}

// Les cultures par étapes (cultures/cultures.json) : un champ bêché, ses sillons, le semis, les pousses, la croissance,
// puis le champ mûr de l'annexe. part : de 0 à 1, où en est la pousse ; le calque de l'étape à l'instant t (secondes),
// ou null quand le champ est mûr (ou si la bibliothèque n'a pas cette culture)
const CROPS = ['ble', 'carottes', 'citrouilles'];
export const cropOf = variant => CROPS[variant % CROPS.length];
export function cultureLayer(crop, part, t = 0) {
  const culture = CULTURES.cultures[crop];
  if (!culture || part >= 1) return null;
  const stages = Object.entries(culture.etapes).filter(([, art]) => art.part < 1 && art.part <= part);
  if (!stages.length) return null;
  const [stage, art] = stages[stages.length - 1];
  const f = frameAt(art, t);
  const path = `${ROOT}cultures/${art.fichiers[f]}`;
  if (!FILES[path]) return null;
  if (!makes.has(path)) makes.set(path, librarySprite(FILES[path], boxOf(art.cadre)));
  return { key: `lib-culture-${crop}-${stage}-${f}`, make: makes.get(path) };
}

// Un gisement ramassé repousse en 6 h (serveur : finds.REGROW_MS) : ramassé, puis à moitié repoussé (repousse1),
// puis presque (repousse2), chacun un tiers du temps
const REGROW_MS = 6 * 3600 * 1000;
const stageOf = wait => (wait > (REGROW_MS * 2) / 3 ? 'ramasse' : wait > REGROW_MS / 3 ? 'repousse1' : 'repousse2');
// Le calque d'un gisement, prêt (animé), ou ramassé et qui repousse (wait : ms avant qu'il soit prêt), à l'instant t
// (secondes), ou null si la bibliothèque ne l'a pas
export function depositArtLayer(find, ready, t = 0, wait = REGROW_MS) {
  const names = ready ? [`${find}_pret`] : [`${find}_${stageOf(wait)}`, `${find}_ramasse`];
  const name = names.find(n => DECOR.gisements[n]);
  return name ? layerOf(name, DECOR.gisements[name], t) : null;
}

// Le dessin d'une enseigne (decor.json, enseignes : la planche, la plaque ou le panneau, sans le nom) à l'instant t
// (secondes) : { key, make, frame, frames } (frame : son image parmi frames), ou null si la bibliothèque ne l'a pas
export function signArtLayer(style, t = 0) {
  const art = DECOR.enseignes[style];
  const layer = art && layerOf(`enseigne-${style}`, art, t);
  return layer ? { ...layer, frame: frameAt(art, t), frames: art.fichiers.length } : null;
}

// Les îlots et les objets de la mer (decor.json, ilots : ponton d'amarrage, barque volante du passeur, bateau des
// visiteurs, bouteille à la mer, panneau de quartier) : le calque de l'image f, ou null si la bibliothèque ne l'a pas
export function isletArtLayer(name, f = 0) {
  const art = DECOR.ilots[name];
  return art ? frameLayer(name, art, f) : null;
}
// Son image à l'instant t (secondes), à sa cadence
export function isletFrameAt(name, t) {
  const art = DECOR.ilots[name];
  return art ? frameAt(art, t) : 0;
}

// Les lieux remarquables (decor.json, lieux) : le calque d'un lieu à l'instant t (secondes) ; le Cercle de menhirs
// fleuri une fois Anya révélée (bloom). null si la bibliothèque ne l'a pas. Même cadre pour tous ; l'île les agrandit
// à son échelle (landmarkScale : echelle_jeu)
export function landmarkArtLayer(id, t = 0, bloom = false) {
  const name = bloom && id === 'menhirs' ? 'menhirs_fleuri' : id;
  const art = DECOR.lieux[name];
  return art ? layerOf(`lieu-${name}`, art, t) : null;
}

// Vignette d'un dessin (la fiche d'une annexe, le Carnet d'explorateur) : sa première image, recadrée sur ce qu'elle
// peint. Lue et mesurée une fois, à la première demande ; une image vide pendant ce temps. null si la lecture échoue :
// l'ancienne vignette reste
const started = new Set();
const thumbs = reactive({});
function thumbOf(name, load) {
  if (!started.has(name)) {
    started.add(name);
    load()
      .then(svg => paintedBox(svg).then(box => cropTo(svg, box)))
      .then(svg => { thumbs[name] = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`; }, () => { thumbs[name] = null; });
  }
  return name in thumbs ? thumbs[name] : BLANK;
}
// Vignette d'une annexe (sa fiche, le choix des annexes d'un bâtiment), ou null si la bibliothèque ne l'a pas
export function annexArtThumb(id, variant = 0) {
  const entry = annexEntry(id, variant);
  const load = entry && FILES[ROOT + entry.art.fichiers[0]];
  return load ? thumbOf(entry.name, load) : null;
}
// Vignette d'un lieu remarquable (Carnet d'explorateur), ou null si la bibliothèque ne l'a pas
export function landmarkArtThumb(id) {
  const art = DECOR.lieux[id];
  const load = art && FILES[ROOT + art.fichiers[0]];
  return load ? thumbOf(`lieu-${id}`, load) : null;
}
