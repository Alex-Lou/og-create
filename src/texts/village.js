// Les paroles du village (world/village.js) : ce que disent les habitants qu'on touche, les poules d’Agathe, les
// cris des bêtes de la ferme et le nom de chaque bête avec sa fiche courte ; Agathe quand sa cage s'ouvre, Anya qui
// a déjà soufflé.

// Paroles des habitants (toucher), par métier et selon le moment
export const WORK_LINES = {
  potager: ['Chaque chose en sa lune. Les carottes aussi.', 'Les courges ne se parlent plus depuis mardi. Tu sais ce qu’elles ont ?'],
  carriere: ['Hm.', 'Hm. Belle pierre.'],
  bosquet: ['Chut. L’arbre dort.', 'Allez. Pousse. Je t’écoute.'],
  puits: ['Chut… l’eau parle.', 'Ma baguette tremble. Il y a de l’eau là-dessous.'],
  ponton: ['Vent d’ouest. Ça mord, aujourd’hui.', 'Mer d’huile. Je n’aime pas ça. Elle prépare quelque chose.'],
  atelier: ['Attends. Voilà. … Non. Attends.', 'Encore une vis et ça tourne. … Clic.'],
  foyer: ['Ce qui mijote ne se presse pas.', 'Goûte-moi ça. Alors ? Dis-moi franchement.']
};
// Les poules d’Agathe (serveur : services/beasts.js) : ce que dit leur fiche
export const HEN_LINES = {
  'poule-rousse': 'La meneuse : ses poussins la suivent partout.',
  'poule-blanche': 'Douce comme une mie de pain, elle picore près du feu.',
  'poule-noire': 'Réglisse ne pond pas. Elle juge.',
  // (le coq et sa couvée : choix de l'auteur, 14 oct., textes validés)
  coq: 'Il chante à l’aube. Et à midi. Et quand ça lui chante.',
  'poulette-muscade': 'Née sur l’île. Elle ne connaît que le sable et le feu.',
  'poulette-praline': 'Née sur l’île. Elle ne connaît que le sable et le feu.',
  'poulette-noisette': 'Née sur l’île. Elle ne connaît que le sable et le feu.'
};
// Agathe et son poulailler (WorldView, hens.js) : le coq échoué, le premier œuf ramassé (bible, étape 8d), le premier
// poussin
export const COOP_LINES = {
  coq: 'Un coq ! Échoué sur une caisse, la crête rouge comme un coquelicot. Mes filles, tenez-vous droites.',
  oeuf: 'Avec un œuf, je fais une omelette. Avec deux, un miracle.',
  poussin: 'Un poussin ! Regarde-le : il a déjà mon caractère.'
};
// Agathe, sa cage ouverte (WorldView, hens.js)
export const HENS_FREED = 'Mes filles… Elles ont tenu bon.';
// Anya, son Souffle déjà donné pour ce passage (WorldView, folk.js)
export const ANYA_RESTED = 'Va. La terre se repose, elle aussi.';
// Les cris des bêtes de la ferme, sur l'île : une didascalie sobre (choix de l'auteur, 15 oct. : décision 24)
export const SOUNDS = { hen: '(Elle caquette.)', rooster: '(Il chante.)', chick: '(Il pépie.)', cow: '(Elle meugle.)', sheep: '(Il bêle.)', pig: '(Il grogne.)', goat: '(Elle bêle.)' };
export const BEAST_NAMES = {
  hen: ['Poule', 'Elle picore au camp, près du feu.'], chick: ['Poussin', 'Il suit sa mère partout.'],
  cow: ['Vache', 'Elle broute près du Potager et dort couchée la nuit.'], sheep: ['Mouton', 'Il broute en troupeau près du Potager.'],
  pig: ['Cochon', 'Il fouille la terre du bout du groin.'], goat: ['Chèvre', 'Elle grimpe partout où elle peut.'],
  deer: ['Cerf', 'Il sort du bois à l’aube et au crépuscule.'], fox: ['Renard', 'Il rôde au crépuscule et la nuit.'],
  rabbit: ['Lapin', 'Il gambade près du bois le jour.'], hedgehog: ['Hérisson', 'Il renifle les buissons la nuit.'],
  squirrel: ['Écureuil', 'Il saute d’arbre en arbre.'], koi: ['Carpe koï', 'Elle nage dans l’eau douce.'], heron: ['Héron', 'Il pêche au bord de l’eau le matin.'],
  snowFox: ['Renard des neiges', 'Il trotte sur la neige des Cimes.'], ibex: ['Bouquetin', 'Il broute entre les rochers des Cimes.'],
  puffin: ['Macareux', 'Il bat des ailes au bord des Landes.'], pony: ['Poney', 'Il broute la bruyère des Landes.'],
  frog: ['Grenouille', 'Elle saute dans le Marais, même sous la pluie.'], tortoise: ['Tortue', 'Elle avance tout doucement dans le Marais.'],
  fennec: ['Fennec', 'Il dort le jour et trotte la nuit dans les Dunes.'], camel: ['Dromadaire', 'Il traverse les Dunes à pas lents.'],
  chameleon: ['Caméléon', 'Il change de teinte sous les feuilles de la Jungle.'], toucan: ['Toucan', 'Il penche la tête sous les feuilles de la Jungle.'],
  salamander: ['Salamandre', 'Elle sort la nuit et sous la pluie, sur les cendres du Volcan.'], crow: ['Corbeau des cendres', 'Il croasse sur les pentes du Volcan.'],
  otter: ['Loutre', 'Une créature d’Anya : elle joue au bord de l’eau douce.'],
  bird: ['Mésange', 'Elle sautille dans les arbres, le jour.'], butterfly: ['Papillon', 'Il volette au bord des bois, le jour.'],
  firefly: ['Luciole', 'Elle s’allume la nuit, près de l’eau.'], bee: ['Abeille', 'Elle butine autour du Potager.'], owl: ['Hibou', 'Il veille la nuit, perché dans un arbre.']
};

// À la Récolte, d'où vient le multiplicateur d'une ressource (HarvestGame.vue : harvest__boost ; serveur : le bâtiment
// qui la produit double sa Récolte, puis davantage à chaque palier)
export const BOOSTED_BY = { wood: 'grâce au Bosquet', stone: 'grâce à la Carrière', water: 'grâce au Puits', food: 'grâce au Potager' };

// Un habitant qu'on touche (sa bulle : world/village.js, say) : selon le temps et l'heure (sinon ses paroles de métier,
// WORK_LINES) ; une réplique par maître, et la commune (common) pour les voyageurs installés. Endormi, il ne dit rien :
// sa pose et ses « z » suffisent (choix de l'auteur, 15 oct. : ecriture/lots/04_maitres.md)
export const VILLAGER_SAYS = {
  storm: {
    ponton: 'Celui-là vient de loin. Rentre tes affaires, on aura un coup de vent.',
    foyer: 'Ferme les volets de ma cuisine, tu veux ? L’orage, ça fait tourner le lait.',
    atelier: 'Un orage, c’est de l’énergie gaspillée. Si seulement… Attends. Non.',
    puits: 'L’eau du ciel est en colère. Elle se calmera dans mon puits.',
    bosquet: 'Les arbres ont peur. Je reste avec eux.',
    carriere: 'Hm. Orage. (Il ne bouge pas d’un pouce.)',
    potager: 'L’orage arrose sans demander. Mes laitues n’aiment pas qu’on les brusque.',
    common: 'L’orage arrive. Mieux vaut se mettre à l’abri.'
  },
  rain: {
    ponton: 'Pluie de mer. Elle sent le sel et la route.',
    foyer: 'Il pleut. Tant mieux : la soupe a meilleur goût sous la pluie. On me l’a dit.',
    atelier: 'La pluie rouille tout. Sauf mes idées.',
    puits: 'Chut… Tu entends ? Tout le ciel tombe dans mon puits.',
    bosquet: 'La pluie. Les racines boivent. Écoute.',
    carriere: 'Hm. La pierre aime la pluie.',
    potager: 'Il pleut. Mes radis vont être insupportables.',
    common: 'Il pleut sur toute l’île.'
  },
  evening: {
    ponton: 'Le vent tombe avec le soleil. Il reviendra au matin, il revient toujours.',
    foyer: 'Ce soir, on mange chaud. Comme tous les soirs.',
    atelier: 'Le soir, je démonte. Le matin, je remonte. Entre les deux, je rêve.',
    puits: 'La lune arrive. Elle va me raconter sa journée.',
    bosquet: 'La forêt s’endort. Moi, pas encore.',
    carriere: 'Hm. Bonne journée de pierre.',
    potager: 'La lune monte. C’est l’heure des choses qui poussent sans qu’on les regarde.',
    common: 'Le soir tombe. Les lanternes s’allument.'
  },
  dawn: {
    ponton: 'Ciel rouge au matin… Ma grand-mère n’aurait pas pris la mer.',
    foyer: 'Debout. La marmite n’attend personne.',
    atelier: 'Le soleil se lève à l’heure. C’est bien le seul.',
    puits: 'J’ai rêvé d’un poisson qui savait lire. … C’était peut-être vrai.',
    bosquet: 'Les oiseaux d’abord. Puis moi.',
    carriere: 'Hm.',
    potager: 'Le matin, les plantes sont honnêtes. Après, elles font semblant.',
    common: 'Le jour se lève.'
  }
};
// Sa fiche courte (appui long : world/village.js, describe) ; site : le nom de son bâtiment
export const VILLAGER_SHEETS = {
  guest: 'De passage sur l’île : son bateau attend au Ponton.',
  plank: 'Il dort sur sa planche. Parle-lui pour le réveiller.',
  asleep: 'Il dort dans la brume. Parle-lui pour le réveiller.',
  camp: site => `Vit au camp, près de « ${site} », en attendant son bâtiment.`,
  waiting: site => `Attend que « ${site} » sorte de terre, tout près.`,
  work: site => `Travaille à « ${site} » le jour, rentre au Foyer le soir.`
};
// Ce que fait un toucher, sous une fiche courte
export const TOUCH_HINTS = {
  talk: 'Toucher : lui parler',
  greet: 'Toucher : le saluer',
  reactShe: 'Toucher : la faire réagir',
  reactHe: 'Toucher : le faire réagir',
  startle: 'Toucher : il sursaute'
};
// Les familiers qu'on touche (court) ou dont on lit la fiche (long) : l'amie de Tic-Tac, le bocal de Léo vide, Bulle
export const PET_SAYS = {
  amie: { title: 'L’amie de Tic-Tac', short: '(Elle tourne autour de Tic-Tac.)', long: 'Une abeille de laiton : Nathan l’a fabriquée pour Tic-Tac quand Abeille a été écrite.' },
  bocal: { title: 'Le bocal de Léo', short: '« Bulle est retourné dans la mer. »', long: 'Vide. « Bulle est retourné dans la mer. »' },
  bulle: { title: 'Bulle', short: '(Il fait le tour du bocal.)', long: 'Le petit poisson de Léo, revenu quand Poisson a été écrit.' }
};
// Une bête sans nom connu
export const UNKNOWN_BEAST = 'Une bête';
