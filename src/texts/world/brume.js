// Brume sur l'île (world/view/draw/brume.js) : les alertes d'un toucher sur elle (la quête à faire, le nom du peuple
// donné, la quête accomplie) et les messages quand le serveur refuse (le nom, le sommeil, la récompense).

export const BRUME_ALERTS = {
  quest: label => `Brume : ${label}.`,
  people: people => `Le peuple de « ${people} »`,
  done: 'Quête accomplie !'
};
// Quand le serveur refuse (repli si l'erreur ne dit rien)
export const BRUME_ERRORS = {
  people: 'Ce nom n’a pas pu être donné.',
  sleep: 'Tu ne peux pas dormir pour l’instant.',
  reward: 'La récompense n’a pas pu être reçue.'
};
