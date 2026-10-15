// Les lieux remarquables (world/landmarks.js) : ce que dit Brume à la découverte de chaque lieu, puis la ligne d'aide
// (ce que le lieu donne, et le renvoi au Carnet d'explorateur), en annonce quand sa bulle s'affiche (App, story.js ;
// choix de l'auteur, 15 oct. : ecriture/lots/05_village.md). Clés : l'identifiant du lieu (serveur : vue de l'île,
// landmarks).

// Ce que dit Brume à la découverte de chaque lieu
export const BRUME_LINES = {
  grotte: 'La glace chante, entends-tu ?',
  lac: 'Sous la glace, le temps dort.',
  col: 'Le vent du col pousse dans le dos. Il ne s’arrête jamais.',
  menhirs: 'Les pierres te reconnaissent. … Je ne sais pas pourquoi j’ai dit ça.',
  arche: 'La mer a taillé cette pierre pendant mille ans. Elle n’a pas fini.',
  saule: 'Ce vieux saule connaît chaque graine de l’île. Il se tait sur la plupart.',
  pilotis: 'Les lucioles t’ont ouvert la porte du vieux pêcheur. Lui n’est plus là. Ses filets, si.',
  oasis: 'Une eau si pure, au milieu du sable… Pierrot va vouloir la goûter.',
  pyramide: 'Des signes, sur la pyramide. Des mains les ont gravés. Des mains comme les tiennes.',
  arbre: 'Le cœur de la jungle bat dans ce tronc. Pose ta main. Tu sens ?',
  cascade: 'L’arc-en-ciel ne quitte jamais ses embruns.',
  geyser: 'La terre respire, ici.',
  cratere: 'Le cœur brûlant de l’île… Ne t’approche pas trop.'
};
// Ce que le lieu donne (la ligne d'aide)
export const LANDMARK_HELP = {
  grotte: 'Une partie de Récolte de plus, gardée en réserve.',
  lac: 'Tes bâtiments gardent leur production plus longtemps.',
  col: 'Tes parties de Récolte reviennent plus vite.',
  menhirs: 'Deux coups de plus à chaque Récolte.',
  arche: 'Ta Carrière produit davantage.',
  saule: 'Ton Potager produit davantage.',
  pilotis: 'Ton Ponton produit davantage.',
  oasis: 'Ton Puits produit davantage.',
  pyramide: 'Deux coups de plus à chaque Récolte.',
  arbre: 'Ton Bosquet produit davantage.',
  cascade: 'Tes bâtiments gardent leur production plus longtemps.',
  geyser: 'Tes parties de Récolte reviennent plus vite.',
  cratere: 'Une partie de Récolte de plus, gardée en réserve.'
};

// (après ce que le lieu donne, dans la même ligne d'aide : le renvoi au Carnet)
export const LANDMARK_TIP = help => `${help} Sa page s’ajoute à ton Carnet d’explorateur.`;
