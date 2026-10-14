// Les paliers féeriques des mini-jeux (choix de l'auteur, 14 oct. : les mêmes dans tous les jeux, le plus haut salue
// Brumelune ; design/conception/onomatopees.md). Chaque jeu dit seulement à partir de quand on atteint chacun : la
// longueur d'une chaîne à la Récolte, les prises d'affilée à la Pêche… Rang 0 : pas de palier, l'onomatopée suffit.
// Chaque palier : son mot, ses couleurs (clair, couleur), et la force du coup (secousse en px, éclats, éclair, arrêt
// sur image en ms). Les mots : texts/game/onomatopees.js
import { TIER_WORDS } from '@/texts/game/onomatopees';

export const TIERS = [
  { rank: 0, label: null, fill: null, shake: 2, bits: 6, flash: null, freeze: 0 },
  { rank: 1, label: TIER_WORDS.joli, fill: ['#FFF3C4', '#F2B33D'], shake: 3, bits: 7, flash: null, freeze: 0 },
  { rank: 2, label: TIER_WORDS.superbe, fill: ['#FFF3C4', '#F08A3A'], shake: 5, bits: 8, flash: null, freeze: 0 },
  { rank: 3, label: TIER_WORDS.magique, fill: ['#E6F8D2', '#5FB34E'], shake: 7, bits: 9, flash: 'rgba(255, 244, 205, 1)', freeze: 0 },
  { rank: 4, label: TIER_WORDS.feerique, fill: ['#F3E2FF', '#A86BE8'], shake: 9, bits: 10, flash: 'rgba(240, 225, 255, 1)', freeze: 90 },
  { rank: 5, label: TIER_WORDS.lune, fill: ['#FFF6D6', '#E9A23B'], shake: 12, bits: 11, flash: 'rgba(255, 236, 170, 1)', freeze: 160 }
];

// Le palier atteint par n, selon les seuils d'un jeu (steps : à partir de quand chaque rang, du rang 1 au rang 5)
export function tierAt(n, steps) {
  let rank = 0;
  steps.forEach((min, i) => {
    if (n >= min) rank = i + 1;
  });
  return TIERS[rank];
}
