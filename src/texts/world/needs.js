// Les besoins des habitants (world/needs.js ; fiche : VillagerSheet.vue, bulle : WorldView, folk.js) : où en est un
// besoin, ce que dit un habitant à qui il manque quelque chose, et quand on le comble. Clés : manger, outils, deco
// (serveur : services/villagers.js).

// Où en est un besoin (fiche de l'habitant) : les créations d'île autour de son bâtiment (place : son nom), comblé ou
// non ; un besoin comblé (state : « Le ventre plein », « Outils en bon état » ; left : le temps qui reste), déjà
// renouvelable ou à renouveler plus tard
export const NEED_STATE = {
  decoMet: (need, place) => `${need} créations d’île autour de « ${place} »`,
  decoMissing: (have, need, reach, place) => `${have} / ${need} créations d’île à ${reach} cases au plus de « ${place} »`,
  still: (state, left) => `${state} encore ${left}`,
  refill: full => `${full} · tu peux déjà le renouveler`,
  later: (full, left) => `${full} · à renouveler dans ${left}`
};

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
