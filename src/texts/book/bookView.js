// Le Livre (components/Book/BookView) : ce que disent l'en-tête, le fil d'Ariane, l'étagère des éléments et la fiche
// d'un élément, les alertes de l'Encre, et les boutons pour les lecteurs d'écran. Les libellés (« Tes éléments »,
// « Réessayer », « Dans l'Athanor », les filtres) restent dans le code. Deux phrases avec des balises restent aussi dans
// le gabarit : le fil d'Ariane (« Vers : <strong>…</strong> — encore n pages ») et « Il cache encore <strong>n</strong>
// mélanges inédits. »
export const BOOK_VIEW = {
  // (lecteurs d'écran) la puce de chapitre, dans un chapitre et au sommaire ; les découvertes
  chip: (id, name) => `Chapitre ${id}, ${name} : changer de chapitre`,
  chipToc: title => `${title} : choisir un chapitre`,
  stars: n => `${n} découvertes : revenir au sommaire`,
  // (lecteurs d'écran) le « ! » du fil d'Ariane
  arianeCalls: 'la page suivante t’attend',
  // (bouton du sommaire, lecteurs d'écran et bulle) revenir à la table du chapitre, puis au sommaire
  backToIndex: id => `Revenir à la table du chapitre ${id}`,
  backToToc: 'Revenir au sommaire du Grimoire',
  loadError: 'Le Grimoire ne s’ouvre pas.',
  // L'étagère : la recherche, et quand rien ne s'y montre
  search: n => `Chercher parmi ${n}…`,
  noMatch: query => `Aucun élément ne ressemble à « ${query} ».`,
  emptyFamily: 'Aucun élément dans cette famille.',
  // La fiche d'un élément (appui long sur sa tuile)
  infoChapter: n => `Chapitre ${n} du Grimoire`,
  infoDone: 'Tous ses mélanges sont découverts.',
  infoInk: 'L’Encre l’a révélé pour la page ouverte.',
  // L'Encre : sans compte, puis en échec
  inkNeedsAccount: 'L’Encre demande un compte : tes écus y sont gardés.',
  inkFailed: 'L’Encre n’a pas pu être utilisée.'
};
