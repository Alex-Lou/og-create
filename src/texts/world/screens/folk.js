// Les gens et les bêtes de l'île (components/World/Folk) : la fiche d'une bête de ferme (BeastSheet), d'un habitant
// (VillagerSheet), d'un visiteur (VisitorSheet).

// La fiche d'une bête de ferme (BeastSheet) ; she : c'est une femelle
export const BEAST_SHEET = {
  likes: (she, what) => `${she ? 'Elle' : 'Il'} aime ${what}.`,
  empty: 'Sa bulle est vide',
  notHungry: she => `${she ? 'Elle' : 'Il'} n’a pas encore faim`,
  short: cost => `Il te faut ${cost} : la Récolte en donne, le Potager aussi.`
};

// La fiche d'un habitant (VillagerSheet)
export const VILLAGER_SHEET = {
  // (son dernier cœur gagné)
  forLife: 'Amis pour la vie !',
  // (ce que fait son humeur, ou ce que ferait une humeur heureuse)
  moodEffect: (effect, site) => `${effect} à « ${site} ».`,
  happy: effect => `Tous ses besoins comblés : ${effect.charAt(0).toLowerCase()}${effect.slice(1)}.`,
  talked: 'Vous avez bavardé aujourd’hui',
  gifted: '· cadeau déjà offert aujourd’hui'
};

// La fiche d'un visiteur (VisitorSheet)
export const VISITOR_SHEET = {
  leaves: when => `Son bateau repart ${when}`,
  done: 'Demande comblée : merci !',
  house: (name, work) => `Une maison est libre : ${name} pourrait s’installer et travailler à « ${work} ».`,
  noHouse: name => `Pour que ${name} reste, pose une Maison près du Foyer (onglet Annexes du Foyer).`
};
