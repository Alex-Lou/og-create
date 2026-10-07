// Le générateur d'avatar, pour le jeu (l'éditeur d'avatar, l'avatar sur l'île) : build_bundle.js en fait un module ESM,
// publié dans la bibliothèque (generateur/avatar.mjs). Les sources restent en CommonJS (design/personnages,
// design/atelier) ; cette liste est ce que le jeu peut importer.
import choix from '../personnages/avatar.js';
import troupe from '../personnages/troupe.js';
import gestes from './gestes.js';
import pose from './assis.js';
import naufrage from './avatar_naufrage.js';
import icones from '../personnages/avatar_icones.js';

// Les choix du joueur (catalogue, nuanciers, objets, prix) et le personnage qu'ils donnent ; sa tenue naufragée
export const {
  avatar, verifier, auHasard, graine, libelle, couleur, couleursAccessoire, naufrageChoix,
  CHOIX, FORMES, NUANCIERS, NOMS_NUANCIERS, EMPLACEMENTS, ACCESSOIRES, TEINTURES_GAINS, PRIX, DEFAUT
} = choix;
export const { avatarNaufrage } = naufrage;
// Une image : frame(personnage, vue, pose, n, expression), le contenu du cadre 48 × 64 ; svg(contenu, échelle) l'entoure
export const { frame, svg, POSES, EXPRS } = troupe;
// Les gestes : avec…(personnage) se dessine en pose « action » ; avecLanterne, avecParapluie, avecValise en marche ;
// couche(personnage, n) dans CADRE_COUCHE ; tendre, applaudir, reparer, ecrire se passent aussi à assis
export const {
  avecMainsTendues, avecApplaudir, avecPecher, avecPiocher, avecCueillir, avecPorter, avecReparer, avecRepousser, avecEcrire,
  avecLanterne, avecParapluie, avecValise, couche, CADRE_PARAPLUIE, CADRE_COUCHE, tendre, applaudir, reparer, ecrire
} = gestes;
// Assis (la veillée) : assis(personnage, vue, n, expression, geste) ; SEAT, le dessus du siège
export const { assis, SEAT } = pose;
// L'icône d'un objet : icone(objet, couleurs), 32 × 32
export const { icone, ICONES } = icones;
