// Les scènes plein écran du tutoriel dessinées dans la bibliothèque (design/bibliotheque/svg/scenes/tutoriel,
// scenes.json) : un carré 400 × 400, un fond et parfois un devant, leurs images en boucle. Entre les deux se pose
// l'avatar du joueur, à la place notée par la scène : ses pieds en (x, y), son cadre 48 × 64 (pieds en 24, 62)
// agrandi « echelle » fois, sa vue, sa pose, sa tenue (naufragée ou de croisière), le miroir ; sur la carte
// d'embarquement, il n'est visible que dans la photo (« cadre »).
// L'avatar est l'un des exemples de la bibliothèque (svg/personnages/avatar), ou l'avatar composé du joueur (ses
// choix, dessinés par le générateur : game/avatarKit.js).
import DATA from '../../design/bibliotheque/svg/scenes/tutoriel/scenes.json';
import { isCustom, customFrames, kitFailed } from './avatarKit';

const ROOT = '/design/bibliotheque/svg/';
const SCENE_URLS = import.meta.glob('/design/bibliotheque/svg/scenes/tutoriel/*/*.svg', { query: '?url', import: 'default', eager: true });
const AVATAR_URLS = import.meta.glob('/design/bibliotheque/svg/personnages/avatar/*/*_{face_repos,face_grelotter,face_salut,avant_marche,dos_marche}_*.svg', { query: '?url', import: 'default', eager: true });

// Les avatars de la bibliothèque (avatar-01, avatar-02…), chacun avec sa tenue naufragée (avatar-01-naufrage…)
export const LOOKS = [...new Set(Object.keys(AVATAR_URLS).map(path => path.split('/')[6]))].filter(dir => !dir.endsWith('-naufrage')).sort();
// Celui d'un appareil qui n'en a pas choisi (un tutoriel commencé avant l'avatar, ou passé)
export const DEFAULT_LOOK = LOOKS[0];
// Pieds de l'avatar dans son cadre 48 × 64
const FEET = [24, 62];
// La ligne « Nom » de la carte d'embarquement (00_carte), où le jeu écrit le nom du joueur
export const NAME_LINE = { x: 210, y: 217, w: 104 };

// Les images d'une pose (fichiers _1, _2… dans l'ordre)
function framesOf(dir, pose) {
  const out = [];
  for (let n = 1; AVATAR_URLS[`${ROOT}personnages/avatar/${dir}/${dir}_${pose}_${n}.svg`]; n++) out.push(AVATAR_URLS[`${ROOT}personnages/avatar/${dir}/${dir}_${pose}_${n}.svg`]);
  return out;
}

// Les images de l'avatar pour une scène. Les exemples n'ont pas toutes les poses : de trois quarts, le repos est
// l'image de la marche où les pieds se rejoignent (la 2e), et le salut se fait de face. Un avatar composé : ses images
// dessinées par le générateur ([] le temps qu'il se charge ; l'exemple par défaut s'il n'a pas pu l'être)
export function avatarFrames(look, { vue = 'face', pose = 'repos', naufrage = true } = {}) {
  if (isCustom(look)) {
    const frames = customFrames(look, { vue, pose, naufrage });
    if (frames.length || !kitFailed()) return frames;
    look = DEFAULT_LOOK;
  }
  const dir = `${LOOKS.includes(look) ? look : DEFAULT_LOOK}${naufrage ? '-naufrage' : ''}`;
  if (vue === 'face' || pose === 'salut') {
    const list = framesOf(dir, `face_${pose}`);
    return list.length ? list : framesOf(dir, 'face_repos');
  }
  return framesOf(dir, `${vue}_marche`).slice(1, 2);
}

// La place de l'avatar dans le carré : son cadre agrandi, posé sur ses pieds ; mirror : la transformation du miroir
// (autour de ses pieds), ou null ; clip : la photo de la carte, ou null
export function avatarBox(spot) {
  const k = spot.echelle;
  const [x, y, w, h] = spot.cadre || [];
  return {
    x: spot.x - FEET[0] * k, y: spot.y - FEET[1] * k, w: 48 * k, h: 64 * k,
    mirror: spot.miroir ? `translate(${spot.x * 2} 0) scale(-1 1)` : null,
    clip: spot.cadre ? { x, y, width: w, height: h } : null
  };
}

// Une scène de la bibliothèque : ses images (back : le fond, front : le devant, chacun dans l'ordre), la durée d'une
// image (ms), la place de l'avatar (null s'il n'est pas à l'écran) ; null si la bibliothèque ne l'a pas
export function sceneOf(id) {
  const scene = DATA.scenes[id];
  if (!scene) return null;
  const urls = layer => (layer ? layer.fichiers.map(file => SCENE_URLS[`${ROOT}scenes/tutoriel/${file}`]) : []);
  return { frames: scene.images, ms: scene.ms_par_image, back: urls(scene.calques.fond), front: urls(scene.calques.devant), avatar: scene.avatar };
}
