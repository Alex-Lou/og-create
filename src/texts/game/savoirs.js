// Les Savoirs des maîtres (game/savoirs.js ; HISTOIRE.md, § 6.4) : la ligne de la fiche d'un maître, et l'indice qu'il
// souffle au premier bavardage du jour (chacun à sa façon ; Saturnin dit « Hm. », Brume traduit). Les Arts (familles)
// restent dans le code.
export const SAVOIRS = {
  // Sur la fiche du maître : son Art et son chapitre
  art: (art, chapter) => `Son Savoir : ${art} (chapitre ${chapter}). Un indice par jour, en bavardant.`,
  // Ce que dit le maître en soufflant, par maître ; sinon, opener
  openers: {
    ponton: 'Le vent me l’a dit :',
    foyer: 'Une recette, rien que pour toi :',
    atelier: 'Attends… Si. J’ai trouvé :',
    puits: 'Chut… l’eau me dit :',
    bosquet: 'Les feuilles disent :',
    carriere: 'Hm. (Brume traduit :)',
    potager: 'La lune me l’a dit, cette nuit :',
    brume: 'Le livre m’a soufflé :'
  },
  opener: 'Écoute :',
  // Ce qui est soufflé : un ingrédient, ou sa famille dite en mots (texts/book/painter.js : FAMILY_WORDS)
  ingredient: name => `il faut « ${name} »`,
  family: words => `un ingrédient est ${words}`,
  line: (opener, chapter, what) => `${opener} sur une page du chapitre ${chapter}, ${what}. C’est noté au Grimoire.`
};
