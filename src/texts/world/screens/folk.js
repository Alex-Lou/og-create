// Les gens et les bêtes de l'île (components/World/Folk) : la fiche d'une bête de ferme (BeastSheet), d'un habitant
// (VillagerSheet), l'accueil d'un arrivant (ArrivalWelcome).

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

// L'accueil d'un arrivant (ArrivalWelcome) : sa phrase, selon le moment du récit qui l'amène (serveur :
// services/visitors.js, MOMENTS) ; on compose son allure, on choisit son métier et son prénom
export const ARRIVAL_WELCOME = {
  moments: {
    ponton: 'Une barque accoste au Ponton. Quelqu’un a vu nos lanternes.',
    maison: 'Une autre barque. On parle de notre île, de l’autre côté de l’eau.',
    peuple: 'Notre peuple a un nom, maintenant. Quelqu’un a traversé la mer pour le rejoindre.',
    tour: 'La Tour se voit de loin. Quelqu’un est venu voir qui l’a bâtie.'
  },
  name: 'Son prénom',
  work: 'Son métier',
  role: (role, place) => `${role} · ${place}`,
  noHouse: 'Il lui faut une maison : pose une Maison près du Foyer.',
  later: 'Plus tard',
  welcome: 'Accueillir',
  wait: 'Une barque approche…'
};
