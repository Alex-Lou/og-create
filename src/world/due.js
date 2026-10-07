// Ce qui change sur l'île sans que le joueur touche à rien (lot 1 : les comptes à rebours avancent) : une partie de
// Récolte ou de mini-jeu qui revient, une expédition de retour, un voyageur qui repart, un gisement qui repousse, la
// réserve d'un bâtiment qui se remplit, un habitant ou une bête qui a faim (ou qu'on peut de nouveau nourrir : la
// moitié de sa durée passée, comme au serveur), la bouteille à la mer et le coffre du jour (créneaux de 6 h, heure de
// Paris : services/loot.js côté serveur). La production des bâtiments et les bulles des bêtes avancent sans cesse : la
// vue se refait au moins toutes les 5 minutes.

const HOUR = 3600000;
const BOTTLE_HOURS = 6;
export const ACCRUE_MS = 5 * 60000;

// Millisecondes avant le prochain créneau de la bouteille (minuit en fait partie : le coffre du jour), heure de Paris
export function slotLeft(now = Date.now()) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Paris', hour: 'numeric', minute: 'numeric', second: 'numeric', hourCycle: 'h23'
  }).formatToParts(new Date(now)).map(p => [p.type, p.value]));
  const into = ((Number(parts.hour) % BOTTLE_HOURS) * 60 + Number(parts.minute)) * 60000 + Number(parts.second) * 1000 + (now % 1000);
  return BOTTLE_HOURS * HOUR - into;
}

// Un besoin (ou une bête) de durée hours, comblé encore left ms : on peut le renouveler à mi-durée, il manque à zéro
const fedTimes = (left, hours) => (left > 0 ? [left - (hours * HOUR) / 2, left] : []);

// Dans combien de millisecondes (depuis l'instant now où state a été reçu) l'île aura changé d'elle-même ; null si
// rien n'est attendu
export function dueIn(state, now = Date.now()) {
  if (!state) return null;
  const times = [];
  const add = ms => {
    if (Number.isFinite(ms) && ms > 0) times.push(ms);
  };
  if (state.charges) add(state.charges.nextIn);
  if (state.expedition) add(state.expedition.endsIn);
  (state.games || []).forEach(g => g.open !== false && add(g.nextIn));
  if (state.visitor) add(state.visitor.leavesIn);
  (state.deposits || []).forEach(d => add(d.readyIn));
  (state.sites || []).forEach(s => add(s.fullIn));
  const kinds = (state.needs && state.needs.kinds) || {};
  (state.villagers || []).forEach(v => (v.needs || []).forEach(n => {
    if (kinds[n.id] && kinds[n.id].hours && n.left !== undefined) fedTimes(n.left, kinds[n.id].hours).forEach(add);
  }));
  const beasts = state.beasts && state.beasts.list ? state.beasts : null;
  if (beasts) beasts.list.forEach(b => fedTimes(b.left, beasts.hours).forEach(add));
  if (state.chests) add(slotLeft(now));
  const produces = (state.sites || []).some(s => s.produce && s.level > 0 && !s.locked);
  if (produces || (beasts && beasts.list.some(b => b.fed))) add(ACCRUE_MS);
  return times.length ? Math.min(...times) : null;
}
