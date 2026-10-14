// Le spectacle de la Pêche (choix de l'auteur, 14 oct. ; design/conception/onomatopees.md) : ce que dit chaque prise,
// ses éclats, et les paliers féeriques selon les prises d'affilée. Rien ici ne change le jeu : les lancers sont rejoués
// par le serveur (game/minigames.js).
import { tierAt } from './stage/tiers';

// Chaque prise : ses onomatopées (à tour de rôle), ses couleurs (clair, couleur) et celles de ses éclats
export const FISH_FX = {
  gardon: { words: ['Flic !', 'Hop !', 'Frrt !'], fill: ['#EEF5FA', '#6F93A8'], colors: ['#BFD6E2', '#8FA9B8', '#FFFFFF'] },
  truite: { words: ['Flip-flap !', 'Splash !'], fill: ['#F0F7DA', '#7E9A45'], colors: ['#C9D89E', '#A7B87A', '#FFFFFF'] },
  dore: { words: ['Diling !', 'Tilin-tilin !'], fill: ['#FFF6D6', '#E9A23B'], colors: ['#FFE38A', '#F2C04B', '#FFF6D6'] },
  botte: { words: ['Floc…', 'Bof !'], fill: ['#F0E4D4', '#8A6A50'], colors: ['#8A6A50', '#C9B79F'] }
};
// Un lancer à vide : un mot gentil
export const MISS_WORDS = ['Plic…', 'Zut…'];

// L'onomatopée de la n-ième prise de cette sorte, ou du n-ième raté (à tour de rôle)
export const fishWord = (kind, n) => {
  const words = kind ? (FISH_FX[kind] || FISH_FX.gardon).words : MISS_WORDS;
  return words[n % words.length];
};

// Les prises d'affilée : un poisson l'allonge, un raté la casse, une botte ne compte pas
export const nextStreak = (streak, kind) => (kind === null ? 0 : kind === 'botte' ? streak : streak + 1);

// Les paliers selon les prises d'affilée : Joli ! à 3, Superbe ! à 5, Magique ! à 7, Féerique ! à 10, Clair de lune ! à 14
const STREAK_STEPS = [3, 5, 7, 10, 14];
export const tierOfStreak = n => tierAt(n, STREAK_STEPS);
