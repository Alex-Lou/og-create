// Le générateur d'avatar, pour le jeu (l'éditeur d'avatar, l'avatar sur l'île) : build_bundle.js en fait un module ESM,
// publié dans la bibliothèque (generateur/avatar.mjs). Les sources restent en CommonJS (design/personnages,
// design/atelier) ; cette liste est ce que le jeu peut importer.
import choix from '../personnages/avatar.js';
import troupe from '../personnages/troupe.js';
import gestes from './gestes.js';
import pose from './assis.js';
import naufrage from './avatar_naufrage.js';
import icones from '../personnages/avatar_icones.js';
import portraits from '../personnages/portraits.js';
import membres from '../personnages/refonte/membres.js';
import mouvements from '../personnages/refonte/mouvements.js';
import noms from './noms_personnages.js';

// Les choix du joueur (catalogue, nuanciers, objets, prix) et le personnage qu'ils donnent ; sa tenue naufragée
export const {
  avatar, verifier, auHasard, assorti, graine, libelle, couleur, couleursAccessoire, naufrageChoix,
  CHOIX, FORMES, NUANCIERS, NOMS_NUANCIERS, EMPLACEMENTS, ACCESSOIRES, TEINTURES_GAINS, PRIX, DEFAUT
} = choix;
export const { avatarNaufrage } = naufrage;
// Une image : frame(personnage, vue, pose, n, expression), le contenu du cadre 48 × 64 ; svg(contenu, échelle) l'entoure
export const { frame, svg, POSES, EXPRS } = troupe;
// Les gestes : avec…(personnage) se dessine en pose « action » ; avecLanterne, avecParapluie, avecValise en marche ;
// couche(personnage, n) dans CADRE_COUCHE ; tendre, applaudir, reparer, ecrire se passent aussi à assis
export const {
  avecMainsTendues, avecApplaudir, avecPecher, avecPiocher, avecCueillir, avecArroser, avecBecher, avecSemer, avecRecolter, avecScier, avecTailler, avecPorter, avecReparer, avecRepousser, avecEcrire,
  avecLanterne, avecParapluie, avecValise, couche, CADRE_PARAPLUIE, CADRE_COUCHE, tendre, applaudir, reparer, ecrire
} = gestes;
// Assis (la veillée) : assis(personnage, vue, n, expression, geste) ; SEAT, le dessus du siège
export const { assis, SEAT } = pose;
// L'icône d'un objet : icone(objet, couleurs), 32 × 32
export const { icone, ICONES } = icones;
// Le portrait HD de l'avatar, pour les dialogues : portrait(personnage, expression, { fixe }) rend { svg, cadre, corps }
// (21 expressions animées en SMIL, affiché en 96 × 96 px, déclaré × 4) ; bulle(clé) : une bulle d'émotion à poser par-dessus
export const { portrait, bulle, EXPRESSIONS_PORTRAIT, BULLES_PORTRAIT, TAILLE_PORTRAIT, HD_PORTRAIT } = portraits;
// Les mouvements de la refonte (membres.js : bras et jambes à longueur fixe, marche en 8 poses clés ; l'avatar les a
// déjà, avatar() les lui donne) : mouvement(personnage, anim, direction, n, expression), le contenu du cadre 48 × 64 ;
// MOUVEMENTS : repos, marche, course, arret, salut et les poses (pose_…), leurs images, durées et directions ;
// DIRECTIONS : face, bas_gauche, bas_droite, haut_droite, haut_gauche. (frame(avatar, vue, 'marche', n) marche déjà
// ainsi.) marcher(personnage, vue, n, expression) : une image de la marche ; avecOs(personnage) : donne ces membres à
// un personnage du kit qui ne les a pas.
export const { ANIMS: MOUVEMENTS, DIRECTIONS, dessiner: mouvement } = mouvements;
export const { marcher, avecOs } = membres;

// Un habitant venu d'ailleurs (un arrivant), dessiné par ses choix comme les visiteurs de la bibliothèque, dans les poses
// que l'île montre, une image à la fois, à la demande (les mêmes appels que troupe_liste.js : poses ; le même SVG, à
// l'octet près, que les fichiers des visiteurs : tests/arrivantArt.test.js) : quotidien(choix, uid, { couverture,
// parapluie }) → { images(pose) : son nombre d'images (0 : il ne l'a pas), image(pose, n) : le SVG complet de l'image n
// (de 1 à images(pose)) }. Poses : <face|avant|dos>_<marche|repos|salut|un geste>, <avant|dos>_<lanterne|parapluie>,
// couche ; le trois quarts avant en miroir, comme la bibliothèque
const GESTES = {
  pecher: 'avecPecher', piocher: 'avecPiocher', cueillir: 'avecCueillir', arroser: 'avecArroser', becher: 'avecBecher', semer: 'avecSemer',
  recolter: 'avecRecolter', scier: 'avecScier', tailler: 'avecTailler', porter: 'avecPorter', reparer: 'avecReparer'
};
const VUES_KIT = { face: 'front', avant: 'se', dos: 'ne' };
const STD = [0, 0, 48, 64];
const r2 = n => Math.round(n * 100) / 100;
export function quotidien(choixArrivant, uid, { couverture, parapluie = '#D9443A' } = {}) {
  const c = choix.avatar(choixArrivant, { uid });
  let porte = null;
  const tenus = () => (porte ??= { l: gestes.avecLanterne(c), u: gestes.avecParapluie(c, parapluie) });
  // [cadre, nombre d'images, le corps de l'image n (de 0)], ou null
  const de = nom => {
    if (nom === 'couche') return [gestes.CADRE_COUCHE, 2, n => gestes.couche(c, n, couverture)];
    const [vue, pose, plus] = nom.split('_');
    const v = VUES_KIT[vue];
    if (!v || plus !== undefined) return null;
    if (pose === 'marche' || pose === 'repos' || pose === 'salut') return [STD, troupe.IMAGES[pose], n => troupe.frame(c, v, pose, n)];
    if (pose === 'lanterne' && v !== 'front') return [STD, troupe.IMAGES.marche, n => troupe.frame(tenus().l, v, 'marche', n)];
    if (pose === 'parapluie' && v !== 'front') return [gestes.CADRE_PARAPLUIE, troupe.IMAGES.marche, n => troupe.frame(tenus().u, v, 'marche', n)];
    if (GESTES[pose]) return [STD, 2, n => troupe.frame(gestes[GESTES[pose]](c), v, 'action', n)];
    return null;
  };
  return {
    images: nom => (de(nom) || [, 0])[1],
    image(nom, n) {
      const [vb, k, corps] = de(nom) || [];
      if (!(n >= 1 && n <= k)) throw new Error(`arrivant : pas d'image ${n} pour ${nom}`);
      const s = `<svg xmlns="http://www.w3.org/2000/svg" width="${r2(vb[2])}" height="${r2(vb[3])}" viewBox="${vb.join(' ')}">${corps(n - 1)}</svg>`;
      return nom.startsWith('avant_') ? noms.miroir(s) : s;
    }
  };
}
