// Les lieux remarquables (world/landmarks.js) : ce que dit Brume à la découverte de chaque lieu, puis le renvoi au
// Carnet d'explorateur. Clés : l'identifiant du lieu (serveur : vue de l'île, landmarks).

// Ce que dit Brume à la découverte de chaque lieu
export const BRUME_LINES = {
  grotte: 'La glace chante, entends-tu ? Ce souffle-là gardera une partie de Récolte de plus au chaud pour toi.',
  lac: 'Sous la glace, le temps dort. Tes bâtiments garderont leur production plus longtemps.',
  col: 'Le vent du col te poussera dans le dos : tes parties de Récolte reviendront plus vite.',
  menhirs: 'Les pierres te reconnaissent. Leur force guidera ta main : deux coups de plus à chaque Récolte.',
  arche: 'La mer a taillé cette pierre pendant mille ans. Ta Carrière en tirera profit.',
  saule: 'Ce vieux saule connaît chaque graine de l’île. Ton Potager poussera mieux.',
  pilotis: 'Les lucioles t’ont ouvert la porte du vieux pêcheur. Ton Ponton pêchera davantage.',
  oasis: 'Une eau si pure, au milieu du sable… Ton Puits en profitera.',
  pyramide: 'Les signes de la pyramide parlent de mains habiles : deux coups de plus à chaque Récolte.',
  arbre: 'Le cœur de la jungle bat dans ce tronc. Ton Bosquet en sera plus généreux.',
  cascade: 'L’arc-en-ciel ne quitte jamais ses embruns. Tes bâtiments garderont leur production plus longtemps.',
  geyser: 'La terre respire ici. Son souffle ramènera tes parties de Récolte plus vite.',
  cratere: 'Le cœur brûlant de l’île… Sa chaleur gardera une partie de Récolte de plus pour toi.'
};

// (après la réplique : le renvoi au Carnet)
export const LANDMARK_TIP = line => `${line} Sa page s’ajoute à ton Carnet d’explorateur.`;
