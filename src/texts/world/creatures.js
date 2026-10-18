// Le Bestiaire des animaux rencontrés (world/creatures.js ; le livre : BestiaryBook) : le nom et la phrase de chaque
// créature (aussi sa fiche courte sur l'île, appui long), les catégories, ce que disent le livre, sa fiche et l'île à
// une rencontre, et les mots du « où et quand » (tirés des règles de chacune)
export const CREATURE_TEXTS = {
  lapin: ['Lapin', 'Il ne tient pas en place, sauf quand on ne le regarde pas.'],
  ecureuil: ['Écureuil', 'Il saute d’arbre en arbre et cache ses noisettes partout.'],
  mesange: ['Mésange', 'Elle sautille dans les branches et chante pour le matin.'],
  renard: ['Renard', 'Il rôde au crépuscule, l’œil curieux.'],
  herisson: ['Hérisson', 'Il renifle les buissons la nuit, et la pluie ne lui fait pas peur.'],
  cerf: ['Cerf', 'Il sort du bois à l’aube et au crépuscule. On le voit rarement.'],
  hibou: ['Hibou', 'Il veille la nuit, perché dans un arbre.'],
  papillon: ['Papillon', 'Il volette de fleur en fleur, les jours de beau temps.'],
  'papillon-lune': ['Papillon de lune', 'Ses ailes ont la couleur de la lune. Il ne sort qu’à la pleine lune.'],
  luciole: ['Luciole', 'Elle s’allume à la tombée du jour.'],
  abeille: ['Abeille', 'Elle butine autour du Potager.'],
  grenouille: ['Grenouille', 'Elle saute au bord de l’eau, de jour comme de nuit.'],
  tortue: ['Tortue', 'Elle avance tout doucement au bord de l’eau.'],
  heron: ['Héron', 'Il pêche à l’aube, immobile au bord de l’eau.'],
  koi: ['Carpe koï', 'Elle tourne sans fin dans l’eau douce.'],
  loutre: ['Loutre', 'Une créature d’Anya : elle joue au bord de l’eau.'],
  crabe: ['Crabe', 'Il sort sur le sable la nuit, et marche de côté.'],
  mouette: ['Mouette', 'Elle se pose sur les plages et s’envole au moindre bruit.'],
  sardines: ['Banc de sardines', 'Ils filent en banc et fusent quand on les touche.'],
  dauphin: ['Dauphin', 'Ils bondissent en groupe au large de la Crique.'],
  baleine: ['Baleine', 'Elle passe au large du Hameau, de loin en loin.'],
  macareux: ['Macareux', 'Il bat des ailes au bord des falaises.'],
  poney: ['Poney', 'Il broute la bruyère de la lande.'],
  bouquetin: ['Bouquetin', 'Il grimpe entre les rochers des sommets.'],
  'renard-polaire': ['Renard polaire', 'Il ne sort que dans la brume des neiges.'],
  chameau: ['Dromadaire', 'Il traverse l’oasis à pas lents.'],
  fennec: ['Fennec', 'Il dort le jour et trotte les nuits claires dans les dunes.'],
  toucan: ['Toucan', 'Il penche la tête sous les feuilles de la canopée.'],
  cameleon: ['Caméléon', 'Il ne se montre que sous la pluie, et change de teinte.'],
  corbeau: ['Corbeau des cendres', 'Il croasse sur les pentes du volcan, même sous l’orage.'],
  salamandre: ['Salamandre', 'Elle ne sort que pendant l’orage, sur les cendres du cratère.']
};

export const CATEGORY_TITLES = {
  bois: 'Bois et prés',
  fleurs: 'Fleurs et lucioles',
  eau: 'Eau douce',
  mer: 'Rivage et mer',
  lointain: 'Contrées lointaines'
};

// Le « où et quand » : les heures, le temps, la pleine lune, et les lieux qui ne sont pas des zones
export const WHEN = {
  hours: { aube: 'à l’aube', jour: 'le jour', crepuscule: 'au crépuscule', nuit: 'la nuit', toujours: 'à toute heure' },
  weather: { clair: 'ciel clair', voile: 'ciel voilé', brume: 'brume', pluie: 'pluie', orage: 'orage' },
  moon: 'pleine lune',
  places: { potager: 'Autour du Potager', eau: 'L’eau douce des zones à soi', anya: 'Au bord de l’eau, quand Anya est là', plages: 'Les plages', mer: 'La mer' },
  unknownZone: 'Une terre inconnue',
  // Ce qui la fait venir sur l'île, tant qu'elle n'y est pas
  element: name => `Écris « ${name} » au Grimoire pour la faire venir.`,
  act: act => `Elle viendra après l’acte ${act}.`
};

export const BESTIARY = {
  title: 'Bestiaire',
  subtitle: (found, total) => (found ? `${found} sur ${total} créatures rencontrées` : `${total} créatures à rencontrer`),
  tocHint: 'Touche une catégorie pour t’y rendre.',
  index: 'Index',
  unknownName: '???',
  rarity: { commun: 'Commun', 'peu commun': 'Peu commun', rare: 'Rare' },
  stamp: 'Rencontré',
  metOn: date => `Rencontré le ${date}`,
  notYet: 'Pas encore rencontré : touche-le sur l’île pour l’inscrire ici.',
  close: 'Fermer le Bestiaire',
  toc: 'Sommaire',
  // L'île, à la première rencontre (une pastille)
  met: name => `Nouvel animal au Bestiaire : ${name}`,
  // L'onglet du Carnet d'explorateur
  tab: 'Animaux'
};
