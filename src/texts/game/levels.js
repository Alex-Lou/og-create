// L'objectif d'un niveau des jeux à grille (game/levels.js), affiché avant de jouer : need, le nombre à atteindre
export const GOALS = {
  recolte: need => `Récolte ${need} ressources`,
  filon: need => `Trouve ${need} pierres précieuses`,
  cueillette: need => `Remplis ton panier : ${need} cueillettes`
};
