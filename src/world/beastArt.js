// Les bêtes de l'île dessinées dans la bibliothèque (design/bibliotheque/svg/animaux).
// Celles qui marchent (orientees.json : la ferme, les bois, le héron, les bêtes des climats, la mésange, la mouette,
// Mousse le renardeau) ont trois vues : de profil (tournée vers la droite, l'île la retourne pour la gauche, comme ses
// dessins par code), de trois quarts avant (elle vient vers le bas de l'écran) et de trois quarts dos (elle s'éloigne
// vers le haut) ; le miroir donne l'autre côté. Poses : marche (deux images, 260 ms chacune), repos (couchée),
// clignement (couchée, les yeux fermés : elle dort), joie (un cœur) ; le dos n'a ni clignement ni joie (on ne voit pas
// le visage). Cadre du jeu × 1,25 autour de l'ancre, aux pieds : celui de orientees.json de trois quarts ; de profil, le
// même sans les pieds qui descendent sous l'ancre (bas à +2,5).
// Les autres n'ont qu'une vue (SINGLE) : l'abeille, la luciole, Tic-Tac et son amie volent de profil ; le hibou et les
// papillons, de face (jamais retournés) ; les koï, le dauphin, la baleine et les poissons nagent de profil ; le bocal de
// Bulle n'a que ses images.
// Ce que la bibliothèque n'a pas (le cerf blanc d'Anya, le papillon rose du Foyer, les mouettes en vol, le bol de
// soupe) garde son dessin par code (animals.js, nature.js, seaSprites.js).
import { betes as BEASTS } from '../../design/bibliotheque/svg/animaux/orientees.json';
import { reactive } from 'vue';
import { librarySprite, paintedBox, cropTo, BLANK } from './library';

// Chargés à la demande, un fichier à la fois (le jeu ne lit que ce qui est sur l'île)
const FILES = {
  ...import.meta.glob('/design/bibliotheque/svg/animaux/*/*/*_{profil,avant,dos,face}_{marche_1,marche_2,vol_1,vol_2,nage_1,nage_2,nage_3,repos,clignement,joie}.svg', { query: '?raw', import: 'default' }),
  ...import.meta.glob('/design/bibliotheque/svg/animaux/familiers/bocal-*/*.svg', { query: '?raw', import: 'default' })
};
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
  kit: 'mousse', bird: 'mesange', gull: 'mouette',
  butterfly: { '': 'papillon-jaune', jaune: 'papillon-jaune', bleu: 'papillon-bleu', lune: 'papillon-lune' },
  firefly: 'luciole', bee: { '': 'abeille', amie: 'amie-tictac' }, owl: 'hibou', tictac: 'tictac',
  bowl: { '': 'bocal-vide', bulle: 'bocal-bulle' },
  koi: { '#F08A3A': 'koi-orange', '#FFFFFF': 'koi-blanc', '#F2C04B': 'koi-or' },
  dolphin: 'dauphin', whaleBack: 'baleine-dos', whaleFluke: 'baleine-queue',
  fish: { sardine: 'poisson-sardine', dorade: 'poisson-dorade', volant: 'poisson-volant' }
};
// Les bêtes à une seule vue (catalogue.json, relevé ici : le catalogue est trop lourd pour le jeu) : leur dossier, leur
// vue (face : jamais retournée ; null : le bocal, qui n'a que ses images), leur mouvement (vol, nage, marche) et leur
// cadre (celui du jeu × 1,25)
const single = (groupe, view, move, cadre) => ({ groupe, view, move, cadre });
const FLIER = [-7.5, -12.5, 15, 13.75];
const BUTTERFLY = [-7.5, -11.25, 15, 11.25];
const KOI = [-12.5, -5, 25, 10];
const FISH = [-20, -35, 40, 40];
const SINGLE = {
  abeille: single('bestiaire', 'profil', 'vol', [-6.25, -8.75, 12.5, 10]),
  luciole: single('bestiaire', 'profil', 'vol', [-6.25, -6.25, 12.5, 12.5]),
  hibou: single('bestiaire', 'face', 'marche', [-7.5, -17.5, 15, 18.75]),
  'papillon-jaune': single('bestiaire', 'face', 'vol', BUTTERFLY),
  'papillon-bleu': single('bestiaire', 'face', 'vol', BUTTERFLY),
  'papillon-lune': single('bestiaire', 'face', 'vol', BUTTERFLY),
  tictac: single('familiers', 'profil', 'vol', FLIER),
  'amie-tictac': single('familiers', 'profil', 'vol', FLIER),
  'bocal-bulle': single('familiers', null, null, FLIER),
  'bocal-vide': single('familiers', null, null, FLIER),
  'koi-orange': single('eau', 'profil', 'nage', KOI),
  'koi-blanc': single('eau', 'profil', 'nage', KOI),
  'koi-or': single('eau', 'profil', 'nage', KOI),
  dauphin: single('mer', 'profil', 'nage', [-32.5, -27.5, 65, 45]),
  'baleine-dos': single('mer', 'profil', 'nage', [-62.5, -22.5, 125, 33.75]),
  'baleine-queue': single('mer', 'profil', 'nage', [-32.5, -37.5, 65, 47.5]),
  'poisson-sardine': single('mer', 'profil', 'nage', FISH),
  'poisson-dorade': single('mer', 'profil', 'nage', FISH),
  'poisson-volant': single('mer', 'profil', 'nage', FISH)
};
// Le nom de la bête dans la bibliothèque, ou null
export function subjectOf(species, variant = '') {
  const subject = SUBJECTS[species];
  if (!subject) return null;
  return typeof subject === 'string' ? subject : subject[variant] || null;
}

// Comment la montrer d'après l'image du jeu (animals.js), de profil : rest, elle dort ; 0 et 1, les deux images de
// son mouvement (deux pas, deux battements d'ailes ; ou, quand l'image 1 du jeu est un geste que la bibliothèque n'a
// pas, picorer, brouter, bondir…, elle change d'appui). Le hibou cligne des yeux (image 1) ; la luciole s'allume à
// l'image 1 du jeu, la première de son vol dans la bibliothèque (celle qui porte son halo)
export function lookOf(frame, species = '') {
  if (frame === 'rest' || (species === 'owl' && frame === 1)) return { view: 'profil', pose: 'clignement' };
  if (species === 'firefly') return { view: 'profil', pose: 'marche', n: frame === 1 ? 1 : 2 };
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

// Cadre du jeu d'une bête à une seule vue
const singleBox = ([x, y, w, h]) => ({ x: x / SCALE, y: y / SCALE, w: w / SCALE, h: h / SCALE });

// Les fichiers possibles d'une bête à une seule vue, du plus juste au plus proche : son mouvement (marche : vol, nage
// ou marche), l'image n, sinon la première ; dort : clignement, sinon repos, sinon immobile ; joie, sinon immobile
function singleNames(subject, art, pose, n) {
  if (!art.view) return [`${subject}_${n}`, `${subject}_1`];
  const move = [`${art.move}_${n}`, `${art.move}_1`];
  const poses = pose === 'marche' ? move : pose === 'clignement' ? ['clignement', 'repos', ...move] : [pose, ...move];
  return poses.map(p => `${subject}_${art.view}_${p}`);
}

const makes = new Map();
// Le dessin d'une bête du jeu : { key, make, face }, ou null si la bibliothèque ne l'a pas. look : { view, pose, n }
// (vue, pose, image de son mouvement : 1, 2 ou 3) ; face : dessinée de face, elle ne se retourne jamais
export function beastSprite(species, variant, { view = 'profil', pose = 'marche', n = 1 } = {}) {
  const subject = subjectOf(species, variant);
  const walker = subject && BEASTS[subject];
  const alone = subject && SINGLE[subject];
  if (!walker && !alone) return null;
  let names;
  let box;
  if (walker) {
    // (de dos, le visage ne se voit pas : elle dort ou se réjouit de trois quarts avant)
    const drawn = view === 'dos' && (pose === 'clignement' || pose === 'joie') ? 'avant' : view;
    names = [`${subject}_${drawn}_${pose === 'marche' ? `marche_${n}` : pose}`];
    box = boxOf(walker, drawn);
  } else {
    names = singleNames(subject, alone, pose, n);
    box = singleBox(alone.cadre);
  }
  const art = walker || alone;
  const name = names.find(name => FILES[`${ROOT}${art.groupe}/${subject}/${name}.svg`]);
  if (!name) return null;
  const path = `${ROOT}${art.groupe}/${subject}/${name}.svg`;
  if (!makes.has(path)) makes.set(path, librarySprite(FILES[path], box));
  return { key: `lib-${name}`, make: makes.get(path), face: !walker && alone.view === 'face' };
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
