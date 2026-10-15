// Les textes du récit sur l'île (world/story.js : quand et pour qui) : les naufrages annoncés, les souvenirs retrouvés.

// Chaque manque amène un naufragé, annoncé par Brume quand la quête qui ouvre son acte devient active. Maerys et
// Robby vivaient déjà sur l'île : une découverte, pas un naufrage ; Maggy seule fait naufrage (choix de l'auteur,
// 15 oct. : ecriture/lots/04_maitres.md)
export const WRECK_TEXTS = {
  lisiere: 'Là-bas, à la lisière, une lueur entre les arbres. Pas une lanterne. Quelqu’un vit là, je crois.',
  colline: 'Écoute… Du côté de la Colline. Quelqu’un taille la pierre. Il y a longtemps qu’on n’entendait plus ça.',
  jardins: 'Cette nuit, un autre bateau s’est brisé dans ma brume. Une barque pleine de graines, au nord.'
};

// Ce que dit le naufragé quand on réclame la quête qui lui rend un souvenir (et Maerys, son Bosquet planté : choix de
// l'auteur, 14 oct. ; ce qu'il donne à la Récolte est dans l'aide, texts/tutorial/coach.js : MEMORY_HELP)
export const MEMORY_LINES = {
  'souvenir-ondin': 'Là… Elle tire. L’eau est là-dessous. Ma baguette se souvient.',
  'souvenir-sylve': 'Arbre… Je me souviens. Ma forêt. Mes mains savent planter.',
  bosquet: 'Mon Bosquet garde le bois mort pour toi.',
  'souvenir-galet': 'Hm. (Brume : « Il dit qu’il se souvient de la pierre. Et qu’il a faim. ») Hm.',
  'eveil-melisse': 'Tes pages m’ont réveillée avant toi. La Plante… je m’en souviens.',
  'souvenir-aster': 'Un bateau. (Elle pose les mains sur la barre.) Elles ne tremblent pas.'
};
