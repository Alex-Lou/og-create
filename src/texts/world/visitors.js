// Les visiteurs de passage (world/visitors.js ; fiche : VisitorSheet.vue, remerciement : WorldView, folk.js) : ce qu'ils
// racontent d'eux selon leur métier (le bâtiment où ils travailleraient), leur demande en clair, ce qu'ils disent quand
// on leur parle et quand on les a comblés.

// Ce qu'il raconte de lui, selon son métier (le bâtiment où il travaillerait)
export const STORIES = {
  potager: 'Je collectionne les graines des îles. Les vôtres poussent si bien…',
  carriere: 'J’étudie les roches. Votre île cache des veines superbes.',
  bosquet: 'Je travaille le bois rare. On m’a parlé de vos arbres.',
  puits: 'Je suis les sources d’île en île. La vôtre chante joliment.',
  ponton: 'Je dessine les côtes. Votre crique n’est sur aucune carte !',
  atelier: 'Je façonne des bijoux. Il me faut de belles pierres.',
  foyer: 'J’écris des poèmes sur les îles. La vôtre m’inspire déjà.'
};
// La demande en clair : « Livrer 30 vivres », « Faire 2 Récoltes (1/2) » (what : la ressource, au pluriel)
export const REQUEST = {
  deliver: (amount, what) => `Livrer ${amount} ${what}`,
  harvest: (count, have) => `Faire ${count} Récolte${count > 1 ? 's' : ''} pendant son séjour (${have}/${count})`
};
// Ce qu'il demande quand on lui parle : déjà comblé ; une livraison ; des Récoltes faites, ou à faire
export const ASK = {
  satisfied: 'Merci encore ! Je profite de votre île avant de repartir.',
  deliver: (amount, what) => `Il me faudrait ${amount} ${what} pour la suite de mon voyage. Vous pourriez m’aider ?`,
  harvested: 'Quelles Récoltes ! C’est exactement ce que je voulais voir.',
  harvest: count => `J’aimerais voir vos Récoltes : ${count} pendant mon séjour !`
};
// Quand on comble sa demande
export const THANKS = 'Merci infiniment ! Voici pour vous, de bon cœur.';
