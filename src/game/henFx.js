// Le spectacle de la chasse aux poules (choix de l'auteur, 14 oct. ; design/conception/onomatopees.md) : ce que dit une
// poule prise, ses plumes et ses étoiles, et la fin (toutes au nid). Les « Cot ! » de l'esquive sont ceux des textes de la
// scène (texts/tutorial/henChase.js, validés). Rien ici ne change la chasse (game/henChase.js). Les mots :
// texts/game/onomatopees.js
import { HEN_WORDS } from '@/texts/game/onomatopees';

// Une poule prise : un mot, à tour de rôle
export const CATCH_WORDS = HEN_WORDS.catch;
// Toutes rentrées
export const HOME_WORD = HEN_WORDS.home;
// Les plumes qui volent (crème, beige), les étoiles d'une prise (or)
export const FEATHERS = ['#FFFDF6', '#F2E6CC', '#E9D2AA'];
export const STARS = ['#FFF3C4', '#F2B33D', '#FFFFFF'];
// Les couleurs des mots : l'esquive (un caquet orangé), la prise (or), la fin (rose de Marcelle)
export const FILLS = { squawk: ['#FFFFFF', '#E09A45'], catch: ['#FFF3C4', '#E9A23B'], home: ['#FFE0E6', '#E8607A'] };

export const nth = (words, n) => words[n % words.length];
