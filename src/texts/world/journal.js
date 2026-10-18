// Le journal de l'île (choix de l'auteur, 16 oct. : tenu par Brume, à la première personne ; world/journal.js) : ce
// qu'elle écrit de chaque jour, selon ce que la troupe a vécu et le temps qu'il a fait
export const JOURNAL = {
  // L'onglet, le titre du carnet
  tab: 'Journal',
  title: 'Le Journal de l’île',
  // Personne ne vit encore ici (le tutoriel) ; un jour sans rien de notable ; aujourd'hui, avant la première ligne
  vide: 'Je n’ai encore rien écrit. Il faut d’abord que des gens vivent ici.',
  calme: 'Une journée tranquille. Rien à écrire, et c’est bien aussi.',
  debut: 'La journée commence. Je n’ai encore rien vu.',
  // Le titre de chaque jour, du plus récent au plus ancien
  jour: n => (n === 0 ? 'Aujourd’hui' : n === 1 ? 'Hier' : n === 2 ? 'Avant-hier' : `Il y a ${n} jours`),
  // Lorena guette l'îlot à l'aube, selon le temps
  aube: {
    clair: 'À l’aube, Lorena a guetté l’îlot. Il était net. Elle n’a rien dit, mais elle a souri.',
    brume: 'À l’aube, Lorena a guetté l’îlot. Ma brume le cachait. Je me suis faite toute petite.',
    pluie: 'À l’aube, Lorena a guetté l’îlot sous la pluie. Elle est rentrée trempée, et contente.'
  },
  carriere: 'Robby était à la carrière avant le jour. J’ai entendu la pierre avant de le voir.',
  eau: 'Léo a écouté l’eau ce matin. Il dit qu’elle a parlé de toi.',
  // Le repas de midi au Foyer, selon le temps
  repas: {
    clair: 'À midi, tout le monde au Foyer. Agathe a resservi ceux qui n’avaient rien demandé.',
    pluie: 'À midi, la pluie. On s’est serrés autour du feu, et la soupe a eu meilleur goût. Agathe l’avait dit.',
    orage: 'À midi, l’orage. Personne n’a parlé pendant le tonnerre. Puis quelqu’un a ri, et tout le monde avec.'
  },
  // Le jour de marché au Foyer, selon le temps
  marche: {
    clair: 'Jour de marché au Foyer. Chacun a apporté quelque chose, et chacun est reparti avec autre chose.',
    pluie: 'Jour de marché sous la pluie. On a tendu une toile au Foyer, et personne n’est rentré plus tôt.'
  },
  // Une visite (a : le visiteur, b : son hôte ; elle : le visiteur est une femme ; line : ce qu'ils se sont dit, la
  // première bulle de leur rencontre, texts/village.js : MEETINGS)
  // (des espaces insécables autour des guillemets : le « » » ne reste jamais seul en fin de ligne)
  visite: (a, b, elle, line) => `${a} est ${elle ? 'passée' : 'passé'} voir ${b}. J’ai entendu\u00a0: «\u00a0${line}\u00a0»`,
  oree: {
    clair: 'Au crépuscule, Maerys a compté les bêtes à l’orée. Toutes là.',
    pluie: 'Au crépuscule, sous la pluie, Maerys a compté les bêtes à l’orée. Elle a compté deux fois.'
  },
  veille: {
    calme: 'Tard dans la nuit, la lanterne de Nathan brillait encore à l’Atelier.',
    orage: 'Orage cette nuit. Nathan a veillé à l’Atelier quand même ; j’ai vu sa lanterne trembler.'
  },
  lune: {
    claire: 'Maggy a présenté ses nouveaux semis à la lune. La lune n’a rien dit. Les semis, si.',
    nuages: 'Pas de lune cette nuit. Maggy a parlé aux nuages, à la place.'
  }
};
