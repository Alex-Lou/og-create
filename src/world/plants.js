// Les plantes et le décor naturel de l'île, dessinés dans la bibliothèque (design/bibliotheque/svg/plantes) : à chaque
// sorte du jeu, son dessin et ses variantes (choix de l'auteur : variées par case). Chaque plante garde sa variante,
// tirée de sa place, d'une visite à l'autre. Une sorte sans dessin dans la bibliothèque garde son dessin par code.
import { PROP_BOX } from './palette';
import { hash } from './scene';
import { librarySprite } from './library';

// Chargés à la demande, un fichier à la fois (le jeu ne lit que ce qui pousse sur l'île)
const FILES = import.meta.glob('/design/bibliotheque/svg/plantes/*.svg', { query: '?raw', import: 'default' });
const DIR = '/design/bibliotheque/svg/plantes/';

// Sorte du jeu → dessin de la bibliothèque, et les mots qui en font les variantes (« arbre_petit_profond_fleuri »)
const PLANTS = {
  tree: ['arbre', 'petit profond fleuri'],
  apple: ['pommier', 'petit profond fleurs tombees'],
  autumn: ['arbre_automne', 'petit rouge feuilles'],
  birch: ['bouleau', 'petit profond fleuri'],
  pine: ['sapin', 'petit profond pommes de pin'],
  snowpine: ['sapin_neige', 'petit profond congere'],
  palm: ['palmier', 'petit profond cocos'],
  deadtree: ['arbre_mort', 'petit brun champignons'],
  tuft: ['touffe', 'motte petite profond fleurie'],
  bush: ['buisson', ''],
  rock: ['rocher', ''],
  rocks: ['rochers', ''],
  crag: ['aiguille', ''],
  mossy: ['rochers_moussus', ''],
  flowers: ['fleurs', ''],
  stump: ['souche', ''],
  log: ['rondin', ''],
  mushrooms: ['champignons', ''],
  reeds: ['roseaux', ''],
  lily: ['nenuphars', ''],
  shells: ['coquillages', ''],
  driftwood: ['bois_flotte', ''],
  heather: ['bruyere', ''],
  cactus: ['cactus', ''],
  nest: ['nid', '']
};

const NAMES = Object.keys(FILES).map(path => path.slice(DIR.length, -'.svg'.length)).sort();

// Les dessins d'une sorte : le sien et ses variantes, dans un ordre fixe (le dessin par défaut en tête)
function variantsOf(base, words) {
  const allowed = new Set(words.split(' ').filter(Boolean));
  const own = NAMES.filter(name => name.startsWith(`${base}_`) && name.slice(base.length + 1).split('_').every(w => allowed.has(w)));
  return NAMES.includes(base) ? [base, ...own] : own;
}
export const VARIANTS = Object.fromEntries(Object.entries(PLANTS).map(([kind, [base, words]]) => [kind, variantsOf(base, words)]));

// Tirage de la variante : propre à la place, sans lien avec celui qui choisit la sorte (hash(x, y) dans natureOf)
const pick = (x, y) => hash(x * 1.618 + 41.3, y * 2.414 + 17.9);

const makes = new Map();
function makeOf(name) {
  if (!makes.has(name)) makes.set(name, librarySprite(FILES[`${DIR}${name}.svg`], PROP_BOX));
  return makes.get(name);
}

// Le dessin d'une plante posée en (x, y) (en cases, fractions comprises) : { name, key, make }, ou null si la
// bibliothèque n'a rien pour cette sorte
export function plantLook(kind, x, y) {
  const variants = VARIANTS[kind];
  if (!variants || !variants.length) return null;
  const name = variants[Math.floor(pick(x, y) * variants.length)];
  return { name, key: `plante-${name}`, make: makeOf(name) };
}
