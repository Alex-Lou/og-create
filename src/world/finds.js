// Trouvailles de climat (lot 9d) : leur icône, leurs gisements, ceux que l'île montre et ceux qui sont prêts. Le
// serveur décide de tout (vue de l'île : finds, deposits) ; ici, seulement l'affichage.

import { DEPOSIT_NAMES, LOCK_TEXT } from '@/texts/world/finds';

export const FIND_GLYPH = { glace: 'ui:glace', laine: 'ui:laine', roseau: 'ui:roseau', sel: 'ui:sel', fruits: 'ui:fruits', obsidienne: 'ui:obsidienne' };
// Ce qu'est le gisement de chaque trouvaille, et ce qu'on y fait
export { DEPOSIT_NAMES };

// Gisements que montre l'île (ceux des quartiers connus, envoyés par le serveur)
export const depositsShown = state => (state && state.deposits ? state.deposits : []);

// Ce que la mer a rendu sur la plage de Brumelune (vue de l'île : pickups ; v6, étape 4) : un toucher le verse dans les réserves,
// puis il en revient. Montré et touché comme un gisement (find : sa sorte, pickup : vrai)
export const pickupsShown = state => (state && state.pickups ? state.pickups.map(p => ({ ...p, find: p.kind, pickup: true })) : []);

// Temps avant qu'un gisement repousse, elapsed ms après le chargement de la vue (0 : prêt)
export const depositWait = (deposit, elapsed = 0) => Math.max(0, deposit.readyIn - elapsed);

// La trouvaille d'un gisement dont la clé du Grimoire n'est pas encore écrite (serveur : finds, key ; choix de l'auteur,
// 12 oct. : chaque climat a sa clé), avec sa clé et les pages jusqu'à elle ; null s'il se ramasse (ou la mer l'a rendu)
export function lockOf(state, deposit) {
  if (!deposit || deposit.pickup || !state || !state.finds) return null;
  const find = state.finds.find(f => f.id === deposit.find);
  return find && find.known === false ? find : null;
}
// Le verrou parlant d'une trouvaille (« Laine : il faut d'abord connaître « Falaise » — à écrire au Grimoire, 5 pages. »)
export const lockText = find => LOCK_TEXT(find.name, find.key, find.pages);

// Gisements prêts d'un quartier à soi (leur clé écrite)
export function depositsReady(state, elapsed = 0) {
  const owned = new Set(state && state.map ? state.map.zones.filter(z => z.owned).map(z => z.id) : []);
  return depositsShown(state).filter(d => owned.has(d.zone) && !depositWait(d, elapsed) && !lockOf(state, d));
}

// Durée lisible (« 3 h 05 », « 12 min »)
export function waitText(ms) {
  const minutes = Math.max(1, Math.ceil(ms / 60000));
  return minutes >= 60 ? `${Math.floor(minutes / 60)} h${minutes % 60 ? ` ${String(minutes % 60).padStart(2, '0')}` : ''}` : `${minutes} min`;
}
