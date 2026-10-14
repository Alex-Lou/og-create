// Les créations d'île (world/crafts.js ; l'établi) : ce qui ouvre un palier (stars : les découvertes inscrites au
// Grimoire ; epreuves : les questions réussies de l'Épreuve ; have : « 3/5 ») ; un savoir-faire qui manque à une
// création, avec ses pages jusqu'au Grimoire (« Lumière : à écrire au Grimoire · 3 pages »).

export const TIER_HINT = {
  stars: (stars, starsHave, epreuves, epreuvesHave) => `Inscris ${stars} découvertes au Grimoire (${starsHave}), ou réussis ${epreuves} questions de l’Épreuve (${epreuvesHave}).`,
  first: (epreuves, epreuvesHave) => `Finis le chapitre I du Grimoire, ou réussis ${epreuves} questions de l’Épreuve (${epreuvesHave}).`,
  chapter: tier => `Finis le chapitre ${tier} du Grimoire.`
};
export const KNOW_TEXT = (name, pages) => `${name} : à écrire au Grimoire${pages ? ` · ${pages} page${pages > 1 ? 's' : ''}` : ''}`;
