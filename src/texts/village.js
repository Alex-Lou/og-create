// Les paroles du village (world/village.js) : ce que disent les habitants qu'on touche, les poules de Cannelle, les
// cris des bêtes de la ferme et le nom de chaque bête avec sa fiche courte.

// Paroles des habitants (toucher), par métier et selon le moment
export const WORK_LINES = {
  potager: ['Chaque chose en sa lune. Les carottes aussi.', 'Tu entends ? Les courges se disputent encore.'],
  carriere: ['Hm.', 'Hm. Belle pierre.'],
  bosquet: ['Chut. Arbre dort.', 'Graine, pousse… pousse…'],
  puits: ['Chut… l’eau parle.', 'Ma baguette tremble. Il y a de l’eau là-dessous.'],
  ponton: ['Ce nuage, c’est Gaston. Il apporte la pluie.', 'Vent d’ouest ! Ça mord, aujourd’hui !'],
  atelier: ['Clic… tac… Attends. Voilà !', 'Encore une vis et ça tourne. Tac !'],
  foyer: ['Ce qui mijote ne se presse pas !', 'Goûte-moi ça, ma brindille. Alors ?']
};
// Les poules de Cannelle (serveur : services/beasts.js) : ce que dit leur fiche
export const HEN_LINES = {
  'poule-rousse': 'La meneuse : ses poussins la suivent partout.',
  'poule-blanche': 'Douce comme une mie de pain, elle picore près du feu.',
  'poule-noire': 'Madame ne pond pas. Elle juge.'
};
export const SOUNDS = { hen: 'Cot cot !', chick: 'Piou piou !', cow: 'Meuh !', sheep: 'Bêêê !', pig: 'Groin groin !', goat: 'Mêêê !' };
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
