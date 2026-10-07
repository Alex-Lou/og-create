// Ce qui attend dans les bâtiments (vue du serveur : pending, pendingStock) et ce qu'une action en a ramassé en passant
// (le serveur encaisse la production avant chaque dépense : lot 1b)
import { LABEL } from '@/game/resources';

const KEYS = ['stone', 'wood', 'water', 'food', 'coins'];

// Ce qui attend : { stone, wood, water, food, coins }, en unités entières
export function pendingOf(state) {
  const stock = (state && state.pendingStock) || {};
  return Object.fromEntries(KEYS.map(k => [k, Math.floor((k === 'coins' ? state && state.pending : stock[k]) || 0)]));
}

// Ramassé entre deux vues : ce qui attendait avant et n'attend plus après ({} si rien n'a baissé). La production ne fait
// que monter tant qu'on ne la ramasse pas : une baisse veut dire qu'elle a été encaissée
export function gatheredBetween(before, after) {
  const was = pendingOf(before), now = pendingOf(after);
  return Object.fromEntries(KEYS.filter(k => was[k] > now[k]).map(k => [k, was[k] - now[k]]));
}

// « +12 bûches · +8 écus »
export function gatheredText(got) {
  return KEYS.filter(k => got[k] > 0).map(k => (k === 'coins' ? `+${got[k]} écu${got[k] > 1 ? 's' : ''}` : `+${got[k]} ${LABEL[k]}`)).join(' · ');
}
