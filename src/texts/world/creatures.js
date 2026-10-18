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
  geant: ['Géant des profondeurs', 'Une baleine plus grande qu’une plage. Elle glisse parfois sous la mer.'],
  kraken: ['Kraken', 'Il surgit au large, certaines nuits, presque toujours sous l’orage.'],
  macareux: ['Macareux', 'Il bat des ailes au bord des falaises.'],
  poney: ['Poney', 'Il broute la bruyère de la lande.'],
  bouquetin: ['Bouquetin', 'Il grimpe entre les rochers des sommets.'],
  'renard-polaire': ['Renard polaire', 'Il ne sort que dans la brume des neiges.'],
  chameau: ['Dromadaire', 'Il traverse l’oasis à pas lents.'],
  fennec: ['Fennec', 'Il dort le jour et trotte les nuits claires dans les dunes.'],
  toucan: ['Toucan', 'Il penche la tête sous les feuilles de la canopée.'],
  cameleon: ['Caméléon', 'Il ne se montre que sous la pluie, et change de teinte.'],
  corbeau: ['Corbeau des cendres', 'Il croasse sur les pentes du volcan, même sous l’orage.'],
  salamandre: ['Salamandre', 'Elle ne sort que pendant l’orage, sur les cendres du cratère.'],
  fantome: ['Le Sans-Nom', 'Le Voile lui a pris son nom. Il suit la moindre lumière.'],
  zombie: ['Le Dormeur', 'Il marche les yeux clos. Une clôture l’arrête et l’endort.'],
  noye: ['Le Noyé de l’Hirondelle', 'Il sort de la mer, plus souvent les nuits de pluie.'],
  racine: ['La Racine errante', 'Elle sort de la lisière et passe sous les clôtures.'],
  esprit: ['L’Esprit sylvestre revenant', 'Repoussé, il revient une fois, par un autre chemin.'],
  'lapin-de-brume': ['Lapin de brume', 'Une bête de brume des terres tempérées, vive et muette.'],
  'bouquetin-de-brume': ['Bouquetin de brume', 'Il descend des Cimes avec la brume du soir.'],
  'poney-de-brume': ['Poney de brume', 'Il galope sans bruit hors des Landes.'],
  'grenouille-de-brume': ['Grenouille de brume', 'Elle saute sans bruit hors des eaux du Marais.'],
  'fennec-de-brume': ['Fennec de brume', 'Il trotte hors des Dunes, léger comme le sable.'],
  'cameleon-de-brume': ['Caméléon de brume', 'Il sort de la Jungle, de la couleur de la nuit.'],
  'salamandre-de-brume': ['Salamandre de brume', 'Elle sort du Volcan, froide comme la cendre.']
};

export const CATEGORY_TITLES = {
  bois: 'Bois et prés',
  fleurs: 'Fleurs et lucioles',
  eau: 'Eau douce',
  mer: 'Rivage et mer',
  lointain: 'Contrées lointaines',
  brume: 'Créatures de la brume'
};

// Le « où et quand » : les heures, le temps, la pleine lune, et les lieux qui ne sont pas des zones
export const WHEN = {
  hours: { aube: 'à l’aube', jour: 'le jour', crepuscule: 'au crépuscule', nuit: 'la nuit', toujours: 'à toute heure' },
  weather: { clair: 'ciel clair', voile: 'ciel voilé', brume: 'brume', pluie: 'pluie', orage: 'orage' },
  moon: 'pleine lune',
  places: {
    potager: 'Autour du Potager', eau: 'L’eau douce des zones à soi', anya: 'Au bord de l’eau, quand Anya est là', plages: 'Les plages', mer: 'La mer',
    large: 'Au large',
    // (les égarés : d'où ils sortent ; les bêtes de brume, de quel climat)
    voile: 'Au bord de la brume', rivage: 'Hors de la mer', lisiere: 'À la lisière des bois',
    tempere: 'Au bord de la brume, en terre tempérée', cimes: 'Au bord de la brume, dans les Cimes', landes: 'Au bord de la brume, dans les Landes',
    marais: 'Au bord de la brume, dans le Marais', dunes: 'Au bord de la brume, dans les Dunes', jungle: 'Au bord de la brume, dans la Jungle',
    volcan: 'Au bord de la brume, sur le Volcan'
  },
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
  rarity: { commun: 'Commun', 'peu commun': 'Peu commun', rare: 'Rare', légendaire: 'Légendaire' },
  stamp: 'Rencontré',
  metOn: date => `Rencontré le ${date}`,
  notYet: 'Pas encore rencontré : touche-le sur l’île pour l’inscrire ici.',
  // (un égaré s'inscrit quand on le repousse)
  notYetStray: 'Pas encore rencontré : repousse-le, la nuit, pour l’inscrire ici.',
  // Le sceau d'une catégorie complète (sa légende, lue à voix haute)
  complete: 'Catégorie complète',
  close: 'Fermer le Bestiaire',
  toc: 'Sommaire',
  // L'île, à la première rencontre (une pastille)
  met: name => `Nouvelle créature au Bestiaire : ${name}`,
  // Le petit signe des raretés : Brume, la première fois qu'une créature rare ou légendaire pas encore rencontrée sort
  // près de ce qu'on regarde (le Géant ; le Kraken a déjà la sienne : texts/world/kraken.js)
  rareLine: 'Chut… Regarde là-bas ! Une rareté : approche doucement, et touche-la pour le Bestiaire.',
  legendLine: 'Tu sens l’eau frémir ? Le Géant des profondeurs passe sous nous… Touche-le, vite !',
  // L'onglet du Carnet d'explorateur
  tab: 'Animaux'
};
