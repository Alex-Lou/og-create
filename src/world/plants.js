// Les plantes et le décor naturel de l'île, dessinés dans la bibliothèque (design/bibliotheque/svg/plantes) : à chaque
// sorte du jeu, son dessin et ses variantes (choix de l'auteur : variées par case). Chaque plante garde sa variante,
// tirée de sa place, d'une visite à l'autre. Une sorte sans dessin dans la bibliothèque garde son dessin par code.
import { PROP_BOX } from './palette';
import { hash } from './scene';
import { librarySprite } from './library';
import SEASONS from '../../design/bibliotheque/svg/plantes/saisons.json';

// Chargés à la demande, un fichier à la fois (le jeu ne lit que ce qui pousse sur l'île)
const FILES = import.meta.glob('/design/bibliotheque/svg/plantes/*.svg', { query: '?raw', import: 'default' });
const DIR = '/design/bibliotheque/svg/plantes/';

// Sorte du jeu → son dessin dans la bibliothèque. Ses variantes sont les fichiers « <dessin>_<mots> » : un dessin
// redessiné en variantes là-bas varie aussitôt sur l'île
const PLANTS = {
  tree: 'arbre', apple: 'pommier', autumn: 'arbre_automne', birch: 'bouleau', pine: 'sapin', snowpine: 'sapin_neige',
  palm: 'palmier', deadtree: 'arbre_mort', tuft: 'touffe', bush: 'buisson', rock: 'rocher', rocks: 'rochers',
  crag: 'aiguille', mossy: 'rochers_moussus', flowers: 'fleurs', stump: 'souche', log: 'rondin', mushrooms: 'champignons',
  reeds: 'roseaux', lily: 'nenuphars', shells: 'coquillages', driftwood: 'bois_flotte', heather: 'bruyere',
  cactus: 'cactus', nest: 'nid'
};
// Les dessins de nuit (« champignons_bruns_nuit ») sont d'un autre moment, pas des variantes : ils ne se tirent pas
const NIGHT = /(^|_)nuit(_|$)/;

const NAMES = Object.keys(FILES).map(path => path.slice(DIR.length, -'.svg'.length)).sort();
const BASES = Object.values(PLANTS);

// Le dessin dont un fichier est une variante : le plus long qui le commence (« arbre_mort_petit » est un arbre mort)
const baseOf = name => BASES.filter(base => name === base || name.startsWith(`${base}_`)).sort((a, b) => b.length - a.length)[0];

// La saison du calendrier (hémisphère nord) : printemps de mars à mai, été de juin à août, automne de septembre à
// novembre, hiver de décembre à février
export function seasonOf(date = new Date()) {
  const month = date.getMonth();
  return ['hiver', 'hiver', 'printemps', 'printemps', 'printemps', 'ete', 'ete', 'ete', 'automne', 'automne', 'automne', 'hiver'][month];
}
// Les arbres de saison (saisons.json : par saison, chaque essence et ses fichiers) : la saison de chaque fichier. Les
// autres dessins de saison le disent dans leur nom (« buisson_hiver », « rocher_printemps », « touffe_automne ») ; un
// dessin fleuri est du printemps et de l'été. Rien ne se mélange : l'île ne pioche que dans la saison en cours
const SEASON_OF = Object.fromEntries(['printemps', 'ete', 'automne', 'hiver']
  .flatMap(season => Object.values(SEASONS[season]).flat().map(file => [file.replace(/\.svg$/, ''), season])));
const NAMED = /(^|_)(printemps|ete|automne|hiver)(_|$)/;
const FLOWERED = /(^|_)fleurie?s?(_|$)/;
function seasonsOf(name) {
  if (SEASON_OF[name]) return [SEASON_OF[name]];
  const named = name.match(NAMED);
  if (named) return [named[2]];
  return FLOWERED.test(name) ? ['printemps', 'ete'] : null;
}
const seasonal = (name, season) => !seasonsOf(name) || seasonsOf(name).includes(season);
// Le sapin enneigé est d'un climat (les hauteurs), pas d'une saison : il reste toute l'année
const CLIMATE = new Set(['snowpine']);

// Les feuillus suivent la saison (saisons.json laisse au jeu les arbres « sans saison » ; choix de l'auteur, 8 oct. :
// pas d'arbres de saisons différentes dans une même saison) : fleuris au printemps, verts en été, roux en automne,
// nus en hiver. Par sorte et par saison, les dessins qu'elle prend (une expression sur leur nom), ou « autumn » : les
// arbres de la saison (le bouleau n'a pas de dessin d'automne). Palmiers et sapins restent verts toute l'année
const DECIDUOUS = {
  tree: { printemps: /^arbre(_petit)?(_profond)?_fleuri$|^arbre_printemps/, ete: /^arbre(_petit)?(_profond)?$/, automne: /^arbre_automne/, hiver: /^arbre_hiver/ },
  birch: { printemps: /^bouleau(_petit)?(_profond)?_fleuri$/, ete: /^bouleau(_petit)?(_profond)?$/, automne: 'autumn', hiver: /^bouleau_nu/ },
  bush: { printemps: /^buisson(_petit)?(_profond)?$/, ete: /^buisson(_petit)?(_profond)?(_baies)?$/, automne: /^buisson_automne|^buisson(_petit)?(_profond)?_baies$/, hiver: /^buisson_hiver/ },
  apple: { printemps: /^pommier(_petit)?(_profond)?_fleurs/, ete: /^pommier(_petit)?(_profond)?$/, automne: /^pommier(_petit)?(_profond)?_tombees$/, hiver: /^arbre_hiver/ }
};
function deciduous(kind, season) {
  const rule = DECIDUOUS[kind] && DECIDUOUS[kind][season];
  if (!rule) return null;
  const names = rule === 'autumn' ? seasonTrees(season) : NAMES.filter(name => !NIGHT.test(name) && rule.test(name));
  return names.length ? names : null;
}

// Les dessins d'une sorte : le sien et ses variantes, dans un ordre fixe (le dessin par défaut en tête), ceux d'une
// autre saison écartés
function variantsOf(base, season) {
  const own = NAMES.filter(name => name !== base && !NIGHT.test(name) && baseOf(name) === base);
  return (NAMES.includes(base) ? [base, ...own] : own).filter(name => !season || seasonal(name, season));
}
// L'arbre de saison (la sorte « autumn », semée en forêt et dans l'herbe) : toutes les essences de la saison en cours
function seasonTrees(season) {
  return NAMES.filter(name => !NIGHT.test(name) && SEASON_OF[name] === season);
}
export function variantsFor(season) {
  return Object.fromEntries(Object.entries(PLANTS).map(([kind, base]) => [
    kind, kind === 'autumn' ? seasonTrees(season) : deciduous(kind, season) || variantsOf(base, CLIMATE.has(kind) ? null : season)
  ]));
}
export const SEASON = seasonOf();
export const VARIANTS = variantsFor(SEASON);

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
