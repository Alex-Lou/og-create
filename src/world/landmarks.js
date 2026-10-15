// Lieux remarquables (lot 9c) : ceux que l'île montre, ceux qui attendent d'être découverts, ce que Brume en dit. Le
// serveur décide de tout (vue de l'île : landmarks) ; un lieu d'un quartier inconnu n'y dit rien d'autre que son
// existence (known: false).

import { BRUME_LINES, LANDMARK_HELP, LANDMARK_TIP } from '@/texts/world/landmarks';

// Lieux des quartiers connus (case, nom, effet…), dans l'ordre du serveur
export const landmarksShown = state => (state && state.landmarks ? state.landmarks.filter(l => l.known !== false) : []);

// Lieux d'un quartier à soi pas encore découverts : un toucher sur l'île les découvre
export function landmarksWaiting(state) {
  const owned = new Set(state && state.map ? state.map.zones.filter(z => z.owned).map(z => z.id) : []);
  return landmarksShown(state).filter(l => !l.found && owned.has(l.zone));
}

// Réplique de Brume à la découverte d'un lieu (une seule fois) ; sa ligne d'aide (help : ce qu'il donne, et le renvoi
// au Carnet), en annonce quand elle s'affiche (App, story.js)
export function landmarkTip(landmark) {
  const line = BRUME_LINES[landmark.id];
  return line ? { id: `landmark-${landmark.id}`, text: line, help: LANDMARK_TIP(LANDMARK_HELP[landmark.id]) } : null;
}
