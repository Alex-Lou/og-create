// Les sept maîtres dessinés dans la bibliothèque (design/bibliotheque/svg/personnages : maitres/ et naufrages/), au
// grand format (48 × 64, pieds en (24, 62), à l'échelle du jeu × 1,25). Un maître garde sa tenue de naufragé tant que
// son bâtiment n'est pas fondé (au camp, endormi ou en attente), puis prend celle de maître (naufrages.json).
// Vues : face, avant (vers le bas à droite), dos (vers le haut à droite) ; le miroir donne les deux autres, jamais pour la
// face. Poses : marche (4 images), repos (2 : la 2e cligne), travail (2), salut (2), couché (2) ; sans geste, le repos. La lanterne et le
// parapluie se portent de trois quarts, en marchant (4 images) ; à l'arrêt, l'image où les pieds se rejoignent (la 2e) :
// lanterne ou parapluie en main, on ne travaille pas et on ne salue pas.
// L'ombre au sol, absente des dessins debout, est celle du jeu. L'hiver ou sous la pluie, un maître porte sa tenue (tenues :
// hiver, pluie) en repos et en marche : mêmes cadres, mêmes vitesses, on échange le fichier.
// Les visiteurs (visiteurs/visiteur-01 à -12, tirés du générateur de l'avatar) : les mêmes cadres et les mêmes poses, sans le
// geste « travail » ; à la porte de son métier, un visiteur installé fait celui du bâtiment (VISITOR_WORK).
import { maitres, naufrages, tenues, visiteurs } from '../../design/bibliotheque/svg/personnages/quotidien.json';
import { fitTo, textsOf } from './library';
import { MASTERS, VIEWS, POSES } from './masterPortraits';

// Seules les poses que l'île montre sont référencées (la bibliothèque en a bien d'autres : veillée, métiers,
// expressions) : la liste de tous les fichiers alourdissait de plusieurs centaines de Ko le code chargé au démarrage
const FILES = textsOf(import.meta.glob([
  '/design/bibliotheque/svg/personnages/{maitres,naufrages}/*/*_{face,avant,dos}_{marche,repos,travail,salut,assis,lanterne,parapluie,arroser,becher,semer,recolter,scier,tailler}_[0-9].svg',
  '/design/bibliotheque/svg/personnages/{maitres,naufrages}/*/*_couche_[0-9].svg',
  // (les tenues d'hiver et de pluie des maîtres, en repos et en marche)
  '/design/bibliotheque/svg/personnages/maitres/*/*_{face,avant,dos}_{marche,repos}_{hiver,pluie}_[0-9].svg',
  // (la marche épuisée d'un naufragé, hors quotidien.json : Lorena qui nage vers la plage, pose « tired »)
  '/design/bibliotheque/svg/personnages/naufrages/*/*_avant_marche_triste_[0-9].svg',
  // (les visiteurs : seulement ce que l'île leur fait faire ; de face, ils ne font que se tenir et saluer)
  '/design/bibliotheque/svg/personnages/visiteurs/*/*_face_{repos,salut}_[0-9].svg',
  '/design/bibliotheque/svg/personnages/visiteurs/*/*_{avant,dos}_{marche,repos,salut,lanterne,parapluie,arroser,becher,semer,recolter,scier,tailler,pecher,piocher}_[0-9].svg',
  '/design/bibliotheque/svg/personnages/visiteurs/*/*_couche_[0-9].svg'
], { query: '?url', import: 'default', eager: true }));
// Les gestes des mini-jeux (quotidien.json : pecher, piocher, cueillir), de trois quarts avant, en maître (le jeu s'ouvre
// au palier III : le bâtiment est fondé)
const GESTURES = import.meta.glob('/design/bibliotheque/svg/personnages/maitres/*/*_avant_{pecher,piocher,cueillir}_[12].svg', { query: '?url', import: 'default', eager: true });
const ROOT = '/design/bibliotheque/svg/personnages/';
const SCALE = 1.25;

// (le maître de chaque bâtiment, les vues et les poses : masterPortraits.js, avec les portraits hors de l'île)
export { MASTERS };
// Ancres : les pieds d'un personnage debout ; le centre de l'ombre d'un dormeur couché (cadre 64 × 48)
const FEET = [24, 62];
const BED = [32, 26];
// Ombre au sol du jeu (villagers.js), dans les unités de la bibliothèque
const SHADOW = '<ellipse cx="24.5" cy="62" rx="8.5" ry="2.75" fill="rgba(40,55,20,.22)"/>';
// Flamme de la lanterne, de trois quarts avant, debout (unités du jeu, depuis les pieds), mesurée sur chaque dessin ; de
// dos, la lanterne est dans l'autre main
const LANTERNS = { aster: [-7.9, -7.6], cannelle: [-9.1, -6.5], galet: [-7.4, -5.2], melisse: [-7.8, -7.5], ondin: [-7.4, -5.2], rivet: [-7.8, -7.8], sylve: [-7.5, -7.8] };
// (celle des visiteurs, au centre du verre, sur l'image debout : leur taille et leur bras changent d'un visiteur à l'autre)
const VISITOR_LANTERNS = {
  'visiteur-01': [-7.3, -5.4], 'visiteur-02': [-8.9, -9.1], 'visiteur-03': [-8.7, -9.1], 'visiteur-04': [-10.6, -7.5], 'visiteur-05': [-8.1, -9.1], 'visiteur-06': [-10.6, -9.1],
  'visiteur-07': [-8.1, -5.4], 'visiteur-08': [-10.6, -5.4], 'visiteur-09': [-10.6, -7.5], 'visiteur-10': [-7.3, -9.1], 'visiteur-11': [-8.1, -7.5], 'visiteur-12': [-8.1, -9.1]
};
// Le geste d'un visiteur installé à la porte de son métier (sur l'annexe, ceux du maître : residents.js, CHORES)
export const VISITOR_WORK = { potager: 'becher', bosquet: 'tailler', atelier: 'scier', foyer: 'recolter', puits: 'arroser', ponton: 'pecher', carriere: 'piocher' };
// Les douze visiteurs de la bibliothèque
export const VISITORS = Object.keys(visiteurs);

// Les gestes dont les deux images n'ont pas le même visage (Léo au travail : calme, puis bouche bée) : une seule image,
// la première, pour que sa tête ne change pas sous les yeux (choix de l'auteur, 11 oct.)
const STEADY = { ondin: ['travail'] };

const setOf = (role, castaway) => (MASTERS[role] ? (castaway ? naufrages : maitres)[MASTERS[role]] : null);

// Cadre du jeu d'un dessin : son viewBox autour de l'ancre, ramené à l'échelle du jeu
function boxOf(svgViewBox, [ax, ay]) {
  const [x, y, w, h] = svgViewBox;
  return { x: (x - ax) / SCALE, y: (y - ay) / SCALE, w: w / SCALE, h: h / SCALE };
}

// Le dessin d'un maître pour l'île, selon sa pose (mêmes options que villagerSprite) : { key, make, view, lantern } ;
// view : la vue dessinée ; lantern : où luit la flamme [dx, dy] (unités du jeu, sans miroir), ou null. null si la
// bibliothèque n'a pas ce maître
// chore : au travail sur son annexe, le geste de son métier (arroser, becher, semer, recolter, scier, tailler), s'il l'a ;
// tenue : 'hiver' ou 'pluie' (un maître seulement, en repos et en marche ; le parapluie ou la lanterne en main passent avant)
export function masterSprite(role, castaway, { pose = 'idle', view = 'se', frame = 0, lantern = false, umbrella = false, chore = null, tenue = null } = {}) {
  const set = setOf(role, castaway);
  if (!set) return null;
  const name = MASTERS[role];
  if (pose === 'tired') {
    // Épuisé, de trois quarts avant (choix de l'auteur, 13 oct. : Lorena ne sourit pas dans l'eau) : sa marche triste
    const list = castaway ? [1, 2, 3, 4, 5, 6, 7, 8].map(n => `naufrages/${name}/${name}-naufrage_avant_marche_triste_${n}.svg`).filter(file => FILES[ROOT + file]) : [];
    return list.length ? artOf(list[frame % list.length], pose, 'avant', null, null) : null;
  }
  const worn = (drawn, gesture) => tenue && !castaway && tenues[tenue]?.[name]?.fichiers[`${drawn}_${gesture}`];
  return poseOf(set.fichiers, { pose, view, frame, lantern, umbrella, chore, work: POSES.work, worn, steady: STEADY[name], flame: LANTERNS[name] });
}

// Le dessin d'un visiteur de la bibliothèque (VISITORS ; visitors.js : visitorCast), selon sa pose (celles de masterSprite) ;
// site : le bâtiment de son métier, s'il s'est installé. null s'il n'est pas dans la bibliothèque
export function visitorSprite(who, site, { pose = 'idle', view = 'se', frame = 0, lantern = false, umbrella = false, chore = null } = {}) {
  const set = visiteurs[who];
  if (!set || pose === 'tired') return null;
  return poseOf(set.fichiers, { pose, view, frame, lantern, umbrella, chore, work: VISITOR_WORK[site] || 'repos', flame: VISITOR_LANTERNS[who] });
}

// Les dessins de la bibliothèque : seules les poses que l'île montre sont chargées ; la clé de cache d'un fichier ; son
// texte, lu à la demande (une promesse ; poseOf, artOf). Un arrivant dessiné à la volée a sa propre source (arrivantArt.js)
const LIBRARY = {
  has: file => Boolean(FILES[ROOT + file]),
  key: file => `lib-${file.split('/').pop().replace(/\.svg$/, '')}`,
  text: file => FILES[ROOT + file]()
};

// Le tronc commun : l'image d'une pose dans les fichiers d'un personnage. work : le geste de « work » sans chore ; worn :
// la tenue de saison d'une vue et d'un geste, s'il la porte ; steady : les gestes à une seule image ; flame : sa lanterne ;
// source : d'où viennent ses dessins (LIBRARY)
export function poseOf(files, { pose, view, frame, lantern, umbrella, chore, work, worn = () => null, steady = [], flame }, source = LIBRARY) {
  // Les images d'une pose (seules celles que la source a : une autre manque, et l'on se rabat)
  const at = key => (files[key] && source.has(files[key][0]) ? files[key] : null);
  let list;
  let drawn = VIEWS[view];
  let held = null;
  const gesture = pose === 'work' ? work : POSES[pose];
  if (pose === 'sleep') list = at('couche');
  else {
    const carry = umbrella ? 'parapluie' : lantern ? 'lanterne' : null;
    const turned = drawn === 'face' ? 'avant' : drawn;
    const carried = carry && at(`${turned}_${carry}`);
    if (carried) {
      list = pose === 'walk' ? carried : [carried[1]];
      drawn = turned;
      held = carry;
    } else {
      // Sans le geste dans la bibliothèque (Robby et Maerys naufragés ont oublié leur don), il attend, au repos
      list = (pose === 'work' && chore && at(`${drawn}_${chore}`)) || at(`${drawn}_${gesture}`) || (at(`${drawn}_repos`) && [at(`${drawn}_repos`)[0]]);
      const dressed = worn(drawn, gesture);
      if (dressed && list === at(`${drawn}_${gesture}`)) list = dressed;
    }
  }
  if (!list) return null;
  if (steady.includes(gesture) && list === at(`${drawn}_${gesture}`)) list = [list[0]];
  const file = list[frame % list.length];
  if (!source.has(file)) return null;
  return artOf(file, pose, drawn, held, held === 'lanterne' ? flame : null, source);
}

// Un fichier, prêt pour l'île : { key, make, view, lantern } (drawn : sa vue ; de dos, la lanterne est dans l'autre main).
// Le dessin d'une source qui le rend tout de suite (source.now : un texte, pas une promesse) se donne sans attendre
function artOf(file, pose, drawn, held, flame, source = LIBRARY) {
  const anchor = pose === 'sleep' ? BED : FEET;
  return {
    key: source.key(file),
    make: () => {
      // Le cadre se lit dans le fichier : celui du parapluie est plus haut, celui du dormeur couché plus large
      const box = boxOf(pose === 'sleep' ? [0, 0, 64, 48] : held === 'parapluie' ? [0, -18, 48, 82] : [0, 0, 48, 64], anchor);
      const ready = svg => fitTo(pose === 'sleep' ? svg : svg.replace(/(<svg[^>]*>)/, `$1${SHADOW}`), box);
      return source.now ? { box, svg: ready(source.text(file)) } : { box, load: () => source.text(file).then(ready) };
    },
    view: drawn,
    lantern: flame ? (drawn === 'dos' ? [-flame[0], flame[1]] : flame) : null
  };
}

// Le geste d'un maître dans le mini-jeu de son bâtiment (pecher, piocher, cueillir), de trois quarts avant : les adresses
// de ses deux images, ou null
export function masterGesture(role, gesture) {
  const set = setOf(role, false);
  const urls = set && (set.fichiers[`avant_${gesture}`] || []).map(file => GESTURES[ROOT + file]);
  return urls && urls.length === 2 && urls.every(Boolean) ? urls : null;
}
