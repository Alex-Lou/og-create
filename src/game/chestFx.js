// Le spectacle de « Tout ouvrir » (choix de l'auteur, 14 oct. : refaire la fenêtre, ses animations et ses effets) : ce
// que fait chaque coffre en s'ouvrant, selon sa rareté (les mots sont les paliers féeriques des mini-jeux, de Joli ! à
// Féerique !), et le rythme de la rafale. Rien ici ne change ce que donnent les coffres (le serveur les a déjà ouverts).

// Par rareté : le mot (word) et ses couleurs (fill : [clair, couleur]), les étincelles (sparks, n), la secousse (shake,
// px), l'éclair (flash, ou null), la vibration
export const CHEST_FX = {
  commun: { word: 'Joli !', fill: ['#F4FBE6', '#7FA552'], sparks: ['#FFFFFF', '#D6EBB4', '#9DBB6E'], n: 10, shake: 0, flash: null, buzz: 8 },
  rare: { word: 'Superbe !', fill: ['#E6F1FF', '#3F7FD8'], sparks: ['#FFFFFF', '#B4D2FF', '#4C8FE8'], n: 16, shake: 0, flash: null, buzz: 10 },
  epique: { word: 'Magique !', fill: ['#F6ECFF', '#9A5CE0'], sparks: ['#FFFFFF', '#DEC2FF', '#A86BE8', '#FFE08A'], n: 22, shake: 2, flash: null, buzz: [10, 30, 12] },
  legendaire: { word: 'Féerique !', fill: ['#FFF6D6', '#E39A2E'], sparks: ['#FFFFFF', '#FFE08A', '#F2C04B', '#FFB070'], n: 32, shake: 4, flash: 'rgba(255, 240, 200, 1)', buzz: [12, 40, 18, 40, 24] }
};
// Les pièces d'or d'un lot d'écus
export const COINS = ['#FFE58A', '#F2C04B', '#D99A2B'];

export const fxOf = rarity => CHEST_FX[rarity] || CHEST_FX.commun;

// La rafale : les cartes arrivent (DEAL_MS), puis un coffre s'ouvre tous les stepOf(n) ms — la rafale entière tient en
// moins de 3 s, même avec beaucoup de coffres, et chacun a le temps de briller quand ils sont peu nombreux
export const DEAL_MS = 450;
export const stepOf = n => Math.round(Math.min(650, Math.max(240, 2600 / Math.max(n, 1))));
export const startOf = (i, n) => DEAL_MS + i * stepOf(n);
