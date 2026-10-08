// Trouvailles de climat (lot 9d) : leur icône, leurs gisements, ceux que l'île montre et ceux qui sont prêts. Le
// serveur décide de tout (vue de l'île : finds, deposits) ; ici, seulement l'affichage.

export const FIND_GLYPH = { glace: 'ui:glace', laine: 'ui:laine', roseau: 'ui:roseau', sel: 'ui:sel', fruits: 'ui:fruits', obsidienne: 'ui:obsidienne' };
// Ce qu'est le gisement de chaque trouvaille, et ce qu'on y fait
export const DEPOSIT_NAMES = {
  glace: ['Cristaux de glace', 'les détacher'], laine: ['Moutons à tondre', 'les tondre'], roseau: ['Roseaux', 'les couper'],
  sel: ['Croûte de sel', 'la gratter'], fruits: ['Arbre à fruits', 'le cueillir'], obsidienne: ['Éclats d’obsidienne', 'les ramasser'],
  // Ce que la mer rend sur la Grève (pickups : bois, vivres, pierre pour les réserves)
  bois: ['Bois flotté', 'le ramasser'], coquillage: ['Coquillages', 'les ramasser'], galet: ['Galets', 'les ramasser']
};

// Gisements que montre l'île (ceux des quartiers connus, envoyés par le serveur)
export const depositsShown = state => (state && state.deposits ? state.deposits : []);

// Ce que la mer a rendu sur la Grève (vue de l'île : pickups ; v6, étape 4) : un toucher le verse dans les réserves,
// puis il en revient. Montré et touché comme un gisement (find : sa sorte, pickup : vrai)
export const pickupsShown = state => (state && state.pickups ? state.pickups.map(p => ({ ...p, find: p.kind, pickup: true })) : []);

// Temps avant qu'un gisement repousse, elapsed ms après le chargement de la vue (0 : prêt)
export const depositWait = (deposit, elapsed = 0) => Math.max(0, deposit.readyIn - elapsed);

// Gisements prêts d'un quartier à soi
export function depositsReady(state, elapsed = 0) {
  const owned = new Set(state && state.map ? state.map.zones.filter(z => z.owned).map(z => z.id) : []);
  return depositsShown(state).filter(d => owned.has(d.zone) && !depositWait(d, elapsed));
}

// Durée lisible (« 3 h 05 », « 12 min »)
export function waitText(ms) {
  const minutes = Math.max(1, Math.ceil(ms / 60000));
  return minutes >= 60 ? `${Math.floor(minutes / 60)} h${minutes % 60 ? ` ${String(minutes % 60).padStart(2, '0')}` : ''}` : `${minutes} min`;
}
