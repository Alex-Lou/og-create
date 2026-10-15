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

// Ce que dit un habitant à qui il manque quelque chose, et quand on le comble : une phrase par maître, et la phrase
// commune (common) pour les voyageurs installés (choix de l'auteur, 15 oct. : ecriture/lots/04_maitres.md)
export const ASKS = {
  manger: {
    ponton: 'On ne navigue pas le ventre vide. Tu as quelque chose ?',
    foyer: 'La cuisinière a faim. Ça arrive, figure-toi.',
    atelier: 'Mon estomac fait un bruit de roue voilée. Tu aurais quelque chose ?',
    puits: 'Mon ventre fait le bruit de l’eau dans un puits vide.',
    bosquet: 'J’ai faim. Tu as quelque chose ?',
    carriere: 'Hm. (Brume : « Il a faim. Il ne le dira pas deux fois. »)',
    potager: 'Mes plantes mangent bien. Moi, moins. Curieux, non ?',
    common: 'J’ai faim. Tu aurais de quoi manger ?'
  },
  outils: {
    ponton: 'Mes nœuds lâchent, mes outils aussi. Il me faudrait du neuf.',
    foyer: 'Ma louche a rendu l’âme. Pas ma meilleure, mais quand même.',
    atelier: 'Mes outils sont usés jusqu’à l’âme. On ne répare rien avec rien.',
    puits: 'Ma corde s’effiloche. Le seau va finir au fond.',
    bosquet: 'Mon couteau ne coupe plus le bois mort.',
    carriere: 'Hm. (Brume : « Son ciseau est usé. Il en voudrait un neuf. »)',
    potager: 'Ma bêche est fatiguée. On l’est tous un peu, en fin de saison.',
    common: 'Mes outils sont usés. Il m’en faudrait des neufs.'
  },
  deco: {
    ponton: 'Mon ponton est tout nu. Un peu d’allure autour ? Pour les bateaux qui passent.',
    foyer: 'Une cuisine, ça se soigne. Quelques jolies choses autour, tu veux bien ?',
    atelier: 'Un atelier sans rien autour, c’est triste. Même les vis s’ennuient.',
    puits: 'Autour du puits, c’est vide. L’eau aimerait avoir de la compagnie.',
    bosquet: 'Autour de mon bosquet, rien ne fleurit. Tu m’aides ?',
    carriere: 'Hm. (Brume : « Il trouve ça nu, autour de sa carrière. Il ne se plaint pas. Il constate. »)',
    potager: 'Un jardin, ça a besoin de voisins. Quelques belles choses autour ?',
    common: 'C’est un peu nu, autour de chez moi. Quelques créations, peut-être ?'
  }
};
export const THANKS = {
  manger: {
    ponton: 'Merci. Cap sur la suite.',
    foyer: 'Merci. Ce qui se partage ne se perd pas.',
    atelier: 'Merci. La machine repart.',
    puits: 'Merci. Chut… mon ventre dit merci aussi.',
    bosquet: 'Merci. (Elle mange en regardant les arbres.)',
    carriere: 'Hm.',
    potager: 'Merci. Je vais manger lentement. Chaque chose en sa lune.',
    common: 'Merci, ça tombait bien.'
  },
  outils: {
    ponton: 'Du neuf ! La mer n’a qu’à bien se tenir.',
    foyer: 'Une louche neuve. Je vais faire des miracles. Des petits, mais des miracles.',
    atelier: 'Des outils neufs. Attends… Si. Je vais tout refaire.',
    puits: 'Une corde neuve. Le seau ne tombera plus. Enfin, moins.',
    bosquet: 'Il coupe de nouveau. Le bois mort, seulement.',
    carriere: 'Hm ! (Brume : « Ça, c’est un vrai merci. »)',
    potager: 'Une bêche neuve. Les vers de terre vont m’en vouloir.',
    common: 'Des outils neufs. Merci.'
  }
};
