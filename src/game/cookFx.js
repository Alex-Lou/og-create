// Le spectacle de la marmite d’Agathe (choix de l'auteur, 14 oct. ; design/conception/onomatopees.md) : le bruit de
// chaque ingrédient qui tombe, du bouillon qu'on touille, puis prêt, et du service. « Doucement ! » (trop vite) et la
// ligne lue à voix haute restent ceux des textes de la scène (texts/tutorial/cooking.js, validés). Rien ici ne change la
// marmite (game/cooking.js). Les mots : texts/game/onomatopees.js
import { COOK_WORDS } from '@/texts/game/onomatopees';

// Un ingrédient dans la marmite : son bruit à lui
export const IN_WORDS = COOK_WORDS.in;
// Un tour de louche (le premier, puis le bouillon qui frémit) ; le dernier : prêt
export const STIR_WORDS = COOK_WORDS.stir;
export const READY_WORD = COOK_WORDS.ready;
// La louche versée dans le bol, puis la fin
export const SERVE_WORD = COOK_WORDS.serve;
export const END_WORD = COOK_WORDS.end;
// L'eau juste au trait ; ce qui déborde ; la louche pleine lâchée hors du bol
export const LINE_WORD = COOK_WORDS.line;
export const OVER_WORD = COOK_WORDS.over;
export const SPILL_WORD = COOK_WORDS.spill;
// Le bouillon, cran par cran (l'eau de mer, puis un cran par ingrédient et par tour de louche : CookingPot, cookScene.js)
export const SOUP = ['#9CC3CF', '#9CC3CF', '#A9C29A', '#C7BB8A', '#D6B474', '#E2AC5C', '#E8A44C'];
export const STARS = ['#FFF3C4', '#F2B33D', '#FFFFFF'];
// Les couleurs des mots : ce qui tombe (bleu d'eau de mer), le bouillon (ambre), trop vite (crème), la fin (rose de
// Agathe)
export const FILLS = { in: ['#E8F6FA', '#4FA3C0'], stir: ['#FFF3C4', '#E09A45'], fast: ['#FFFFFF', '#C9925A'], end: ['#FFE0E6', '#E8607A'] };

// Le mot d'un tour de louche (turn : de 1 à turns)
export function stirWord(turn, turns) {
  if (turn >= turns) return READY_WORD;
  return STIR_WORDS[Math.min(turn - 1, STIR_WORDS.length - 1)];
}
// La teinte du bouillon à un cran (0 : vide)
export const soupAt = level => SOUP[Math.max(0, Math.min(level, SOUP.length - 1))];
