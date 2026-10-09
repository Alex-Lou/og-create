// Les sept maîtres dessinés dans la bibliothèque (design/bibliotheque/svg/personnages : maitres/ et naufrages/), au
// grand format (48 × 64, pieds en (24, 62), à l'échelle du jeu × 1,25). Un maître garde sa tenue de naufragé tant que
// son bâtiment n'est pas fondé (au camp, endormi ou en attente), puis prend celle de maître (naufrages.json).
// Vues : face, avant (vers le bas à droite), dos (vers le haut à droite) ; le miroir donne les deux autres, jamais pour la
// face. Poses : marche (4 images), repos (2 : la 2e cligne), travail (2), salut (2), couché (2) ; sans geste, le repos. La lanterne et le
// parapluie se portent de trois quarts, en marchant (4 images) ; à l'arrêt, l'image où les pieds se rejoignent (la 2e) :
// lanterne ou parapluie en main, on ne travaille pas et on ne salue pas.
// L'ombre au sol, absente des dessins debout, est celle du jeu.
import { maitres, naufrages } from '../../design/bibliotheque/svg/personnages/quotidien.json';
import { fitTo } from './library';
import { MASTERS, VIEWS, POSES } from './masterPortraits';

// Seules les poses que l'île montre sont référencées (la bibliothèque en a bien d'autres : veillée, métiers,
// expressions) : la liste de tous les fichiers alourdissait de plusieurs centaines de Ko le code chargé au démarrage
const FILES = import.meta.glob([
  '/design/bibliotheque/svg/personnages/{maitres,naufrages}/*/*_{face,avant,dos}_{marche,repos,travail,salut,assis,lanterne,parapluie,arroser,becher,semer,recolter,scier,tailler}_[0-9].svg',
  '/design/bibliotheque/svg/personnages/{maitres,naufrages}/*/*_couche_[0-9].svg'
], { query: '?raw', import: 'default' });
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

const setOf = (role, castaway) => (MASTERS[role] ? (castaway ? naufrages : maitres)[MASTERS[role]] : null);

// Cadre du jeu d'un dessin : son viewBox autour de l'ancre, ramené à l'échelle du jeu
function boxOf(svgViewBox, [ax, ay]) {
  const [x, y, w, h] = svgViewBox;
  return { x: (x - ax) / SCALE, y: (y - ay) / SCALE, w: w / SCALE, h: h / SCALE };
}

// Le dessin d'un maître pour l'île, selon sa pose (mêmes options que villagerSprite) : { key, make, view, lantern } ;
// view : la vue dessinée ; lantern : où luit la flamme [dx, dy] (unités du jeu, sans miroir), ou null. null si la
// bibliothèque n'a pas ce maître
// chore : au travail sur son annexe, le geste de son métier (arroser, becher, semer, recolter, scier, tailler), s'il l'a
export function masterSprite(role, castaway, { pose = 'idle', view = 'se', frame = 0, lantern = false, umbrella = false, chore = null } = {}) {
  const set = setOf(role, castaway);
  if (!set) return null;
  const files = set.fichiers;
  let list;
  let drawn = VIEWS[view];
  let held = null;
  if (pose === 'sleep') list = files.couche;
  else {
    const carry = umbrella ? 'parapluie' : lantern ? 'lanterne' : null;
    const turned = drawn === 'face' ? 'avant' : drawn;
    const carried = carry && files[`${turned}_${carry}`];
    if (carried) {
      list = pose === 'walk' ? carried : [carried[1]];
      drawn = turned;
      held = carry;
    } else {
      // Sans le geste dans la bibliothèque (Galet et Sylve naufragés ont oublié leur don), il attend, au repos
      list = (pose === 'work' && chore && files[`${drawn}_${chore}`]) || files[`${drawn}_${POSES[pose]}`] || (files[`${drawn}_repos`] && [files[`${drawn}_repos`][0]]);
    }
  }
  if (!list) return null;
  const file = list[frame % list.length];
  if (!FILES[ROOT + file]) return null;
  const anchor = pose === 'sleep' ? BED : FEET;
  const name = MASTERS[role];
  const flame = held === 'lanterne' ? LANTERNS[name] : null;
  return {
    key: `lib-${file.split('/').pop().replace(/\.svg$/, '')}`,
    make: () => {
      // Le cadre se lit dans le fichier : celui du parapluie est plus haut, celui du dormeur couché plus large
      const box = boxOf(pose === 'sleep' ? [0, 0, 64, 48] : held === 'parapluie' ? [0, -18, 48, 82] : [0, 0, 48, 64], anchor);
      return { box, load: () => FILES[ROOT + file]().then(svg => fitTo(pose === 'sleep' ? svg : svg.replace(/(<svg[^>]*>)/, `$1${SHADOW}`), box)) };
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
