// Lieux remarquables (lot 9c) : ceux que l'île montre, ceux qui attendent d'être découverts, ce que Brume en dit. Le
// serveur décide de tout (vue de l'île : landmarks) ; un lieu d'un quartier inconnu n'y dit rien d'autre que son
// existence (known: false).

// Lieux des quartiers connus (case, nom, effet…), dans l'ordre du serveur
export const landmarksShown = state => (state && state.landmarks ? state.landmarks.filter(l => l.known !== false) : []);

// Lieux d'un quartier à soi pas encore découverts : un toucher sur l'île les découvre
export function landmarksWaiting(state) {
  const owned = new Set(state && state.map ? state.map.zones.filter(z => z.owned).map(z => z.id) : []);
  return landmarksShown(state).filter(l => !l.found && owned.has(l.zone));
}

// Ce que dit Brume à la découverte de chaque lieu
const BRUME_LINES = {
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

// Réplique de Brume à la découverte d'un lieu (une seule fois), qui renvoie au Carnet
export function landmarkTip(landmark) {
  const line = BRUME_LINES[landmark.id];
  return line ? { id: `landmark-${landmark.id}`, text: `${line} Sa page s’ajoute à ton Carnet d’explorateur.` } : null;
}
