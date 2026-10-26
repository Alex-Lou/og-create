// Les scènes plein écran du tutoriel dessinées dans la bibliothèque (design/bibliotheque/svg/scenes/tutoriel,
// scenes.json) : un carré 400 × 400, un fond et parfois un devant, leurs images en boucle. Entre les deux se pose
// l'avatar du joueur, à la place notée par la scène : ses pieds en (x, y), son cadre 48 × 64 (pieds en 24, 62)
// agrandi « echelle » fois, sa vue, sa pose, sa tenue (naufragée ou de croisière), le miroir ; sur la carte
// d'embarquement, il n'est visible que dans la photo (« cadre »).
// L'avatar est l'un des exemples de la bibliothèque (svg/personnages/avatar), ou l'avatar composé du joueur (ses
// choix, dessinés par le générateur : game/avatarKit.js).
import DATA from '../../design/bibliotheque/svg/scenes/tutoriel/scenes.json';
import CONSEIL from '../assets/scenes/conseil/conseil.json';
import { isCustom, customFrames, kitFailed, choixDe } from './avatarKit';

const ROOT = '/design/bibliotheque/svg/';
const SCENE_URLS = import.meta.glob('/design/bibliotheque/svg/scenes/tutoriel/*/*.svg', { query: '?url', import: 'default', eager: true });
const AVATAR_URLS = import.meta.glob('/design/bibliotheque/svg/personnages/avatar/*/*_{face_repos,face_grelotter,face_salut,avant_marche,dos_marche,avant_mains-tendues,avant_assis-mains-tendues,dos_assis-mains-tendues}_*.svg', { query: '?url', import: 'default', eager: true });
// Les scènes dessinées hors de la bibliothèque (outils/scenes : leurs générateurs) : la veillée du conseil, sous l'orage
// qui vient (choix de l'auteur, 16 oct.) ; rangées comme celles de scenes.json
const OWN_URLS = import.meta.glob('/src/assets/scenes/*/*.svg', { query: '?url', import: 'default', eager: true });
const OWN = {
  conseil_veillee: { ...CONSEIL, calques: { fond: ['conseil/conseil_fond.svg'], anime: ['conseil/conseil_anime.svg'], devant: ['conseil/conseil_devant.svg'] } }
};

// Les avatars de la bibliothèque (avatar-01, avatar-02…), chacun avec sa tenue naufragée (avatar-01-naufrage…)
export const LOOKS = [...new Set(Object.keys(AVATAR_URLS).map(path => path.split('/')[6]))].filter(dir => !dir.endsWith('-naufrage')).sort();
// Celui d'un appareil qui n'en a pas choisi (un tutoriel commencé avant l'avatar, ou passé)
export const DEFAULT_LOOK = LOOKS[0];
// Pieds de l'avatar dans son cadre 48 × 64
const FEET = [24, 62];
// La ligne « Nom » de la carte d'embarquement (00_carte), où le jeu écrit le nom du joueur
export const NAME_LINE = { x: 210, y: 217, w: 104 };

// La carte d'embarquement que le tampon marque et que le vent emporte (00_tampon ; choix de l'auteur, 25 oct.) : la photo
// et le nom du joueur y sont déjà, posés sur la pièce « photo », attachée à la carte (elle en suit tous les mouvements).
// Sa place dans le carré (design/atelier/gravure_plage.js : CARTE, carteGravee) : son milieu (x, y), son angle, son coin
// haut gauche depuis son milieu (coin) ; en unités de la carte, le tirage de la photo (x, y, largeur, hauteur) et le
// début de la ligne « Nom »
const CARTES = {
  '00_tampon': { dans: 'carte', x: 200, y: 206, angle: -14, coin: [130, 84], photo: [22, 56, 51, 57], nom: [112, 82] }
};

// Les images d'une pose (fichiers _1, _2… dans l'ordre)
function framesOf(dir, pose) {
  const out = [];
  for (let n = 1; AVATAR_URLS[`${ROOT}personnages/avatar/${dir}/${dir}_${pose}_${n}.svg`]; n++) out.push(AVATAR_URLS[`${ROOT}personnages/avatar/${dir}/${dir}_${pose}_${n}.svg`]);
  return out;
}

// Les gestes de trois quarts avant que les scènes demandent (choix de l'auteur, 15 oct. : à la veillée, assis les mains
// tendues vers le feu ; pour recevoir ses habits recousus, les mains tendues) ; de dos, assis les mains tendues vers le
// feu qui est devant lui (le conseil, 16 oct. : de face, ses mains tendues ne tenaient rien)
export const GESTES_AVANT = ['assis-mains-tendues', 'mains-tendues'];
export const GESTES_DOS = ['assis-mains-tendues'];
// Les images de l'avatar pour une scène. Les exemples n'ont pas toutes les poses : de trois quarts, le repos est
// l'image de la marche où les pieds se rejoignent (la 2e), et le salut se fait de face. Un avatar composé : ses images
// dessinées par le générateur ([] le temps qu'il se charge ; l'exemple par défaut s'il n'a pas pu l'être)
// En néon (une scène en papier néon, son avatar.neon, sa lumière avatar.lumiere) : l'avatar, composé ou exemple, passe par
// le kit et son rendu néon
export function avatarFrames(look, { vue = 'face', pose = 'repos', naufrage = true, neon = false, lumiere = {} } = {}) {
  if (neon) {
    const choix = choixDe(look), frames = choix ? customFrames(choix, { vue, pose, naufrage, neon, lumiere }) : [];
    if (frames.length || !kitFailed()) return frames;
  }
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
  if ((vue === 'avant' && GESTES_AVANT.includes(pose)) || (vue === 'dos' && GESTES_DOS.includes(pose))) {
    const list = framesOf(dir, `${vue}_${pose}`);
    if (list.length) return list;
  }
  return framesOf(dir, `${vue}_marche`).slice(1, 2);
}

// L'avatar du joueur quand il parle dans une bulle de l'île : de face, au repos, en naufragé ; l'exemple par défaut le
// temps que son avatar composé se dessine
export function playerFace(look) {
  return avatarFrames(look)[0] || avatarFrames(DEFAULT_LOOK)[0];
}

// La photo du joueur dans un tirage (x, y, largeur, hauteur) : cadrée comme sur la carte du prologue (00_carte : à
// mi-corps), mise à l'échelle du tirage ; la place de son image
export function photoBox([x, y, w]) {
  const spot = DATA.scenes['00_carte'].avatar, box = avatarBox(spot);
  const [cx, cy, cw] = spot.cadre, k = w / cw;
  return { x: x + (box.x - cx) * k, y: y + (box.y - cy) * k, w: box.w * k, h: box.h * k };
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

// Une scène de la bibliothèque : ses images (back : le fond, live : ce qui bouge par-dessus le fond, front : le devant,
// chacun dans l'ordre), la durée d'une image (ms), sa hauteur (h, unités de ses dessins : 400 pour un carré, plus pour une
// scène en hauteur), la place de l'avatar (null s'il n'est pas à l'écran) ; null si la
// bibliothèque ne l'a pas. Une scène en plans (plans, partition : game/scenePlans.js) n'a ni fond ni devant : ScenePlans
// peint ses plans. Le calque « anime » (facultatif) : une scène lourde livre un fond immobile, que le navigateur
// peint une fois, et à part ce qui bouge (SceneArt ; choix de l'auteur, 15 oct. : rien ne se perd en qualité)
// Les scènes des personnages sont encore des suites de 2 à 4 images qui tournent : à l'écran, des à-coups (choix de
// l'auteur, 11 oct. : au niveau des scènes fluides, le Feu et le Grimoire). En attendant leur version animée en continu
// (l'agent design : un seul SVG par calque), chacune garde son image la plus parlante (n° à partir de 0), et la scène
// respire doucement (SceneArt : still). Le souvenir d’Agathe garde sa tenue de cuisinière : elle ne repasse plus
// par la naufragée. Une scène livrée en une image sort de cette liste
const STILL = {
  '07_cannelle': 0, '07_souvenir': 3, '09_rivet': 0, '10_aster': 1,
  '11_ondin': 0, '11_reveil': 1, '12_chantier': 3, '12_veillee': 0, '12_habits': 0
};
// Les images nouvelles des lots d'écriture (choix de l'auteur, 14 oct. : ecriture/lots/01 et 02), en attendant leurs
// dessins : une image proche de la bibliothèque. Une image livrée prend la place de la sienne
const STANDIN = {
  '01_paupieres': '01_greve', '01_carte': '01_gilet', '02_plage': '01_greve',
  '03_ciel': '03_vent', '05_cercle': '02_village', '10_epave': '02_epave',
  // (la traversée manquée, lot 08 § 8 : la barque, la brume autour de la tour, le retour, une voile)
  t_depart: '10_aster', t_brume: '03_vent', t_retour: '02_plage', t_voile: '02_plage',
  // (l'intérieur du phare, lot 08 § 8 : la porte et sa serrure de pierre est livrée ; le journal, la lentille l'attendent)
  p_porte: '30_phare_porte', p_journal: '30_phare_porte', p_lentille: '30_phare_porte',
  // (le navire des parents de Léo : dans le faisceau, au Ponton devant le village, la baguette vers le nord)
  n_voile: '02_plage', n_ponton: '12_habits', n_nord: '02_plage'
};
export function sceneOf(id) {
  if (OWN[id]) {
    const own = OWN[id];
    const urls = layer => (own.calques[layer] || []).map(file => OWN_URLS[`/src/assets/scenes/${file}`]);
    return { frames: own.images, ms: own.ms_par_image, still: false, h: own.hauteur || 400, back: urls('fond'), live: urls('anime'), front: urls('devant'), avatar: own.avatar };
  }
  // (une image d'attente garde l'image fixe de la scène qui la remplace)
  const shown = DATA.scenes[id] ? id : STANDIN[id];
  const scene = DATA.scenes[shown];
  if (!scene) return null;
  const url = file => SCENE_URLS[`${ROOT}scenes/tutoriel/${file}`];
  // (une scène en plans, game/scenePlans.js : ses plans du fond vers nous, sa partition ; son calque anime et l'avatar
  // ont leur place dans la pile)
  if (scene.plans) {
    const plans = scene.plans.map(p => ({ id: p.id, href: p.fichier && p.id !== 'anime' ? url(p.fichier) : null, profondeur: p.profondeur || 0, marge: p.marge || 0, flou: p.flou || 1, pivot: p.pivot || null, cadre: p.cadre || null, dans: p.dans || null, derriere: !!p.derriere,
      // (un figurant : ses images, par clé, et ses animations)
      ...(p.images ? { images: Object.fromEntries(Object.entries(p.images).map(([cle, f]) => [cle, url(f)])), anims: p.anims } : {}) }));
    const anime = scene.plans.find(p => p.id === 'anime');
    const carte = CARTES[shown] || null;
    if (carte) plans.push({ id: 'photo', href: null, profondeur: 0, marge: 0, flou: 1, pivot: null, cadre: null, dans: carte.dans, derriere: false });
    return { frames: 1, ms: scene.ms_par_image, still: false, h: 400, plans, partition: scene.partition || null, back: [], live: anime && anime.fichier ? [url(anime.fichier)] : [], front: [], avatar: scene.avatar, carte };
  }
  const kept = Object.hasOwn(STILL, shown) && scene.images > 1 ? STILL[shown] : null;
  const urls = layer => (layer ? layer.fichiers.filter((file, k) => kept === null || k === kept).map(file => SCENE_URLS[`${ROOT}scenes/tutoriel/${file}`]) : []);
  return {
    frames: kept === null ? scene.images : 1, ms: scene.ms_par_image, still: kept !== null, h: 400,
    back: urls(scene.calques.fond), live: urls(scene.calques.anime), front: urls(scene.calques.devant), avatar: scene.avatar
  };
}
