// Besoins des habitants (lot 7c) : comment les dire et les montrer. Les règles (durées, prix, créations d'île, humeur et
// son effet) viennent du serveur (services/villagers.js, mêmes identifiants : manger, outils, deco).

export const NEED_GLYPH = { manger: 'ui:food', outils: 'ui:tools', deco: 'ui:flower' };
export const MOOD_GLYPH = { heureux: 'ui:smile', content: 'ui:calm', triste: 'ui:frown' };
export const MOOD_LABEL = { heureux: 'Aux anges', content: 'Ça va', triste: 'Le moral en berne' };

// Ressources au pluriel, dans les prix (besoins, expéditions)
export const WORDS = { stone: 'pierres', wood: 'bûches', water: 'seaux d’eau', food: 'vivres' };
// Prix d'un besoin : « 10 vivres », « 5 pierres et 5 bûches »
export const costText = cost => Object.entries(cost).map(([r, n]) => `${n} ${WORDS[r] || r}`).join(' et ');

// Temps qui reste, en clair : « 14 h », « 40 min »
export function leftText(ms) {
  const hours = Math.floor(ms / 3600000);
  return hours >= 1 ? `${hours} h` : `${Math.max(1, Math.ceil(ms / 60000))} min`;
}

// Où en est un besoin (fiche de l'habitant) ; place : nom du bâtiment de l'habitant
export function needState(need, place) {
  if (need.id === 'deco') {
    return need.met ? `${need.need} créations d’île autour de « ${place} »` : `${need.have} / ${need.need} créations d’île à ${need.reach} cases au plus de « ${place} »`;
  }
  if (!need.met) return need.id === 'manger' ? 'A faim' : 'Outils usés';
  return `${need.id === 'manger' ? 'Le ventre plein' : 'Outils en bon état'} encore ${leftText(need.left)}`;
}

// Besoins qui manquent
export const missingOf = villager => (villager.needs || []).filter(n => !n.met);
// Le stock suffit pour ce besoin
export const affordable = (need, stock) => Object.entries(need.cost || {}).every(([r, n]) => (stock[r] || 0) >= n);
// Ce que « Tout combler » donnerait : besoins renouvelables de tous les habitants et leur prix total (le serveur comble
// dans l'ordre, tant que le stock suffit)
const ORDER = ['stone', 'wood', 'water', 'food'];
export function fillAllOf(villagers) {
  const needs = villagers.flatMap(v => (v.needs || []).filter(n => n.cost && n.refill));
  const total = r => needs.reduce((sum, n) => sum + (n.cost[r] || 0), 0);
  return { count: needs.length, cost: Object.fromEntries(ORDER.filter(total).map(r => [r, total(r)])) };
}

// Ce que dit un habitant à qui il manque quelque chose, et quand on le comble
export const ASKS = {
  manger: 'J’ai un petit creux… Tu n’aurais pas de quoi manger ?',
  outils: 'Mes outils sont tout usés. Il m’en faudrait des neufs.',
  deco: 'C’est un peu triste, autour de chez moi. Quelques créations de l’établi ?'
};
export const THANKS = {
  manger: 'Merci ! Ça tombait bien, j’avais un creux.',
  outils: 'Des outils neufs ! Le travail va filer tout seul.'
};
// Ce que dit un habitant qu'on touche : son premier besoin qui manque, sinon line
export const askOr = (villager, line) => {
  const [first] = missingOf(villager);
  return first ? ASKS[first.id] : line;
};
