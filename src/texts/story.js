// Les textes du récit sur l'île (world/story.js : quand et pour qui) : les naufrages annoncés, les souvenirs retrouvés.

// Chaque manque amène un naufrage, annoncé par Brume quand la quête qui ouvre son acte devient active
export const WRECK_TEXTS = {
  lisiere: 'Cette nuit, un autre bateau s’est brisé… Un radeau de bois flotté, à l’ouest.',
  colline: 'Cette nuit, un autre bateau s’est brisé… Un caboteur chargé de pierres, au nord-est.',
  jardins: 'Cette nuit, un autre bateau s’est brisé… Une barque pleine de graines, au nord.'
};

// Ce que dit le naufragé quand on réclame la quête qui lui rend un souvenir (et Freya, son Bosquet planté : choix de
// l'auteur, 14 oct., texte validé)
export const MEMORY_LINES = {
  'souvenir-ondin': 'Là… Elle tire. L’eau est là-dessous. Ma baguette se souvient.',
  'souvenir-sylve': 'Arbre… Je me souviens. Ma forêt. Mes mains savent planter.',
  bosquet: 'Mon Bosquet garde le bois mort pour toi. À la Récolte, chaque bûche comptera double.',
  'souvenir-galet': 'Hm. (Brume : “Il dit qu’il se souvient de la pierre. Et qu’il a faim.”) Hm !',
  'eveil-melisse': 'Tes pages m’ont réveillée avant toi. La Plante… je m’en souviens.',
  'souvenir-aster': 'Un bateau… Par tous les alizés, je sais encore tenir une barre !'
};
