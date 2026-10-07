// Les bêtes qui marchent, dessinées dans la bibliothèque (design/bibliotheque/svg/animaux, orientees.json) : la ferme,
// les bois, le héron, les bêtes des climats et Mousse le renardeau. Trois vues : de profil (tournée vers la droite,
// l'île la retourne pour la gauche, comme ses dessins par code), de trois quarts avant (elle vient vers le bas de
// l'écran) et de trois quarts dos (elle s'éloigne vers le haut) ; le miroir donne l'autre côté. Poses : marche (deux
// images, 260 ms chacune), repos (couchée), clignement (couchée, les yeux fermés : elle dort), joie (un cœur) ; le dos
// n'a ni clignement ni joie (on ne voit pas le visage). Cadre du jeu × 1,25 autour de l'ancre, aux pieds : celui de
// orientees.json de trois quarts ; de profil, le même sans les pieds qui descendent sous l'ancre (bas à +2,5).
// Ce que la bibliothèque n'a pas (le cerf blanc d'Anya, les bêtes du Bestiaire, les familiers qui volent, le bol de
// soupe) garde son dessin par code (animals.js).
import { betes as BEASTS } from '../../design/bibliotheque/svg/animaux/orientees.json';
import { reactive } from 'vue';
import { librarySprite, paintedBox, cropTo, BLANK } from './library';

// Chargés à la demande, un fichier à la fois (le jeu ne lit que ce qui est sur l'île)
const FILES = import.meta.glob('/design/bibliotheque/svg/animaux/*/*/*_{profil,avant,dos}_{marche_1,marche_2,repos,clignement,joie}.svg', { query: '?raw', import: 'default' });
const ROOT = '/design/bibliotheque/svg/animaux/';
const SCALE = 1.25;
// Durée d'une image de marche (ms)
export const STEP_MS = 260;

// La bête de la bibliothèque de chaque sorte du jeu ; par variante quand elle en a ('' : sans variante)
const SUBJECTS = {
  hen: { '': 'poule-blanche', blanche: 'poule-blanche', rousse: 'poule-rousse', noire: 'poule-noire', grise: 'poule-grise' },
  chick: 'poussin',
  cow: { '': 'vache', rousse: 'vache-rousse' },
  sheep: { '': 'mouton', noir: 'mouton-noir' },
  pig: { '': 'cochon', tachete: 'cochon-tachete' },
  goat: { '': 'chevre', brune: 'chevre-brune' },
  deer: { '': 'cerf' },
  fox: 'renard', rabbit: 'lapin', hedgehog: 'herisson', squirrel: 'ecureuil', otter: 'loutre', heron: 'heron',
  snowFox: 'renard-polaire', ibex: 'bouquetin', puffin: 'macareux', pony: 'poney', frog: 'grenouille', tortoise: 'tortue',
  fennec: 'fennec', camel: 'chameau', chameleon: 'cameleon', toucan: 'toucan', salamander: 'salamandre', crow: 'corbeau',
  kit: 'mousse'
};
// Le nom de la bête dans la bibliothèque, ou null
export function subjectOf(species, variant = '') {
  const subject = SUBJECTS[species];
  if (!subject) return null;
  return typeof subject === 'string' ? subject : subject[variant] || null;
}

// Comment la montrer d'après l'image du jeu (animals.js), de profil : rest, elle dort ; 0 et 1, les deux images de
// marche (deux pas ; ou, quand l'image 1 du jeu est un geste que la bibliothèque n'a pas, picorer, brouter, bondir…,
// elle change d'appui)
export function lookOf(frame) {
  if (frame === 'rest') return { view: 'profil', pose: 'clignement' };
  return { view: 'profil', pose: 'marche', n: frame === 1 ? 2 : 1 };
}

// La vue d'une bête qui va de (x, y) vers (x + dx, y + dy) sur l'île : vers le bas de l'écran, de trois quarts avant ;
// vers le haut, de dos ; tout droit à gauche ou à droite, de profil (le miroir : dx - dy < 0, comme le flip de l'île)
export function viewOf(dx, dy) {
  return dx + dy > 0 ? 'avant' : dx + dy < 0 ? 'dos' : 'profil';
}

// Cadre du jeu d'une bête dans une vue (orientees.json : celui de trois quarts)
function boxOf(art, view) {
  const [x, y, w, h] = view === 'profil' ? [art.cadre[0], art.cadre[1], art.cadre[2], 2.5 - art.cadre[1]] : art.cadre;
  return { x: x / SCALE, y: y / SCALE, w: w / SCALE, h: h / SCALE };
}

const makes = new Map();
// Le dessin d'une bête du jeu : { key, make }, ou null si la bibliothèque ne l'a pas. look : { view, pose, n } (vue,
// pose, image de marche 1 ou 2)
export function beastSprite(species, variant, { view = 'profil', pose = 'marche', n = 1 } = {}) {
  const subject = subjectOf(species, variant);
  const art = subject && BEASTS[subject];
  if (!art) return null;
  // (de dos, le visage ne se voit pas : elle dort ou se réjouit de trois quarts avant)
  const drawn = view === 'dos' && (pose === 'clignement' || pose === 'joie') ? 'avant' : view;
  const name = `${subject}_${drawn}_${pose === 'marche' ? `marche_${n}` : pose}`;
  const path = `${ROOT}${art.groupe}/${subject}/${name}.svg`;
  if (!FILES[path]) return null;
  if (!makes.has(path)) makes.set(path, librarySprite(FILES[path], boxOf(art, drawn)));
  return { key: `lib-${name}`, make: makes.get(path) };
}

// Image de marche (1 ou 2) à l'instant t (secondes), à la cadence de la bibliothèque ; k décale les bêtes entre elles
export const stepAt = (t, k = 0) => (Math.floor((t * 1000) / STEP_MS + k) % 2) + 1;

// Portrait d'une bête (sa fiche) : de trois quarts avant, debout, recadré sur ce qu'il peint (le cadre de la
// bibliothèque garde de la place autour d'elle). Lu et mesuré une fois, à la première demande ; une image vide pendant
// ce temps. null si la bibliothèque ne l'a pas ou si la lecture échoue : le portrait par code reste
const started = new Set();
const portraits = reactive({});
export function beastPortraitUrl(species, variant) {
  const subject = subjectOf(species, variant);
  const art = subject && BEASTS[subject];
  const load = art && FILES[`${ROOT}${art.groupe}/${subject}/${subject}_avant_marche_1.svg`];
  if (!load) return null;
  if (!started.has(subject)) {
    started.add(subject);
    load()
      .then(svg => paintedBox(svg).then(box => cropTo(svg, box)))
      .then(svg => { portraits[subject] = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`; }, () => { portraits[subject] = null; });
  }
  return subject in portraits ? portraits[subject] : BLANK;
}
