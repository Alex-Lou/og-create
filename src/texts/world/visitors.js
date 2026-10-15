// Les visiteurs de passage (world/visitors.js ; fiche : VisitorSheet.vue, remerciement : WorldView, folk.js) : ce qu'ils
// racontent d'eux selon leur métier (le bâtiment où ils travailleraient), leur demande en clair, ce qu'ils disent quand
// on leur parle et quand on les a comblés.

// Ce qu'il raconte de lui, selon son métier (le bâtiment où il travaillerait)
export const STORIES = {
  potager: 'Je ramasse des graines d’île en île. Les vôtres ont l’air de savoir où elles sont.',
  carriere: 'J’étudie les roches. Les vôtres sont plus vieilles que la mer, je crois.',
  bosquet: 'Je travaille le bois rare. On parle de vos arbres, de l’autre côté de l’eau.',
  puits: 'Je suis les sources d’île en île. La vôtre chante juste.',
  ponton: 'Je dessine les côtes. Votre crique n’est sur aucune carte. Elle le sera.',
  atelier: 'Je taille des bijoux. Il me faut des pierres qui ont une histoire.',
  foyer: 'J’écris des poèmes sur les îles. La vôtre ne se laisse pas écrire facilement.'
};
// La demande en clair : « Livrer 30 vivres », « Faire 2 Récoltes (1/2) » (what : la ressource, au pluriel)
export const REQUEST = {
  deliver: (amount, what) => `Livrer ${amount} ${what}`,
  harvest: (count, have) => `Faire ${count} Récolte${count > 1 ? 's' : ''} pendant son séjour (${have}/${count})`
};
// Ce qu'il demande quand on lui parle : déjà comblé ; une livraison ; des Récoltes faites, ou à faire
export const ASK = {
  satisfied: 'Merci encore. Je profite de l’île avant de reprendre la mer.',
  deliver: (amount, what) => `Il me faudrait ${amount} ${what} pour la suite de mon voyage. Vous pourriez m’aider ?`,
  harvested: 'Quelles Récoltes. C’est exactement ce que je voulais voir.',
  harvest: count => `J’aimerais voir vos Récoltes : ${count} pendant mon séjour.`
};
// Quand on comble sa demande
export const THANKS = 'Merci. Prenez ceci : là où je vais, ça ne me servira pas.';
