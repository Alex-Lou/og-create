// Le spectacle du Filon (choix de l'auteur, 14 oct. ; design/conception/onomatopees.md) : ce que dit chaque coup de
// pioche, chaque bloc qui cède, chaque pierre trouvée, et les paliers féeriques selon les pierres trouvées d'affilée.
// Rien ici ne change le jeu : les coups sont rejoués par le serveur (game/minigames.js).
import { tierAt } from './stage/tiers';

export const HIT_WORDS = ['Tic !', 'Toc !', 'Tac !'];
// Un bloc très dur qui s'écroule (les autres disent ce qu'ils cachaient : une pierre, des éclats, ou rien)
export const BREAK_WORDS = { 3: ['Patatras !'] };
// Un bloc vide : avec des éclats autour (une pierre dort tout près), ou sans rien
export const HINT_WORDS = ['Crr…', 'Gling !'];
export const EMPTY_WORDS = ['Pof…', 'Fff…'];
// Chaque pierre : ses mots, ses couleurs (clair, couleur) et celles de ses éclats
export const GEM_FX = {
  quartz: { words: ['Ting !', 'Gling !'], fill: ['#FFFFFF', '#9FC3D8'], colors: ['#FFFFFF', '#CFE6F2', '#9FC3D8'] },
  amethyste: { words: ['Ding !', 'Dong !'], fill: ['#F3E2FF', '#9B62D8'], colors: ['#E4C8FF', '#B48AE0', '#FFFFFF'] },
  rubis: { words: ['Diling !', 'Tilin !'], fill: ['#FFE0E0', '#D8404A'], colors: ['#FF9AA0', '#E8604C', '#FFFFFF'] },
  diamant: { words: ['Tadaaa !', 'Diliiing !'], fill: ['#FFFFFF', '#6FC8E8'], colors: ['#FFFFFF', '#CFF2FF', '#FFF3C4'] }
};
// Les éclats de pierre d'un coup, selon la dureté du bloc
export const STONE = { 1: ['#C2B8A8', '#A39887', '#E2DACB'], 2: ['#9E958A', '#7E766C', '#C2B8A8'], 3: ['#77716B', '#57524D', '#9E958A'] };

// Le n-ième mot d'une liste (à tour de rôle)
export const nth = (words, n) => words[n % words.length];

// Les pierres trouvées d'affilée : une pierre l'allonge, un bloc vide ouvert la casse
export const nextFind = (streak, gem) => (gem ? streak + 1 : 0);

// Les paliers selon les pierres d'affilée : Joli ! à 2, Superbe ! à 3, Magique ! à 5, Féerique ! à 7, Clair de lune ! à 9
const FIND_STEPS = [2, 3, 5, 7, 9];
export const tierOfFinds = n => tierAt(n, FIND_STEPS);
