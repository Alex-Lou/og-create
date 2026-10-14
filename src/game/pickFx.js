// Le spectacle de la Cueillette (choix de l'auteur, 14 oct. ; design/conception/onomatopees.md) : ce que dit chaque
// cueillette, ses éclats, et les paliers féeriques selon les cueillettes d'affilée sans baie perdue. Rien ici ne change
// le jeu : les gestes sont rejoués par le serveur (game/minigames.js).
import { tierAt } from './stage/tiers';
import { PICK_WORDS as W } from '@/texts/game/onomatopees';

// Chaque chose cueillie : ses mots (à tour de rôle), ses couleurs (clair, couleur) et celles de ses éclats (le jus)
export const BERRY_FX = {
  mure: { words: W.mure, fill: ['#EBD9FF', '#5B3A8C'], colors: ['#5B3A8C', '#8E6BC4', '#2E1E4A'] },
  fraise: { words: W.fraise, fill: ['#FFE0DC', '#E2453A'], colors: ['#E2453A', '#FF8A7A', '#7DB46E'] },
  myrtille: { words: W.myrtille, fill: ['#E0ECFF', '#3E5FB0'], colors: ['#3E5FB0', '#7FA0E0', '#2A3F78'] },
  cepe: { words: W.cepe, fill: ['#FFF3C4', '#A0642E'], colors: ['#C98A4A', '#F2DEC0', '#F2B33D'] },
  guepes: { words: W.guepes, fill: ['#FFF3C4', '#E0A020'], colors: ['#F2C04B', '#3A2618'] }
};
// Une baie tombée sans être cueillie : un mot doux
export const FALL_WORDS = W.fall;

// Le n-ième mot d'une liste (à tour de rôle)
export const nth = (words, n) => words[n % words.length];

// Les cueillettes d'affilée : une baie (ou un cèpe) l'allonge ; les guêpes ou une baie perdue la cassent
export const nextPick = (streak, kind) => (kind && kind !== 'guepes' ? streak + 1 : 0);

// Les paliers selon les cueillettes d'affilée : Joli ! à 3, Superbe ! à 6, Magique ! à 10, Féerique ! à 15, Clair de
// lune ! à 20
const PICK_STEPS = [3, 6, 10, 15, 20];
export const tierOfPicks = n => tierAt(n, PICK_STEPS);
