// La chasse aux poules (choix de l'auteur, 13 oct. : une scène à part ; textes validés) : Marcelle ouvre et ferme la
// scène, chaque poule prise a sa carte, la consigne dit la règle (game/henChase.js)
export const HEN_CHASE = {
  title: 'La chasse aux poules',
  open: 'Mes filles ont filé ! Caramel court comme le vent, Flocon ne résiste pas au grain… et Réglisse fait ce qu’elle veut.',
  rule: 'Lance du grain d’un toucher. Une poule qui picore se laisse prendre.',
  // (sous le nom de la poule prise)
  cards: {
    'poule-rousse': 'la plus rapide du poulailler',
    'poule-blanche': 'elle aurait suivi le grain jusqu’au bout du monde',
    'poule-noire': 'elle te pardonnera. Peut-être.'
  },
  // (les bruits de l'esquive, gardés : choix de l'auteur, 15 oct., décision 23)
  squawk: ['Cot !', 'Cot cot !'],
  end: 'Les voilà toutes.',
  go: 'Commencer',
  later: 'Plus tard',
  next: 'Continuer',
  // (le joueur n'a pas encore lancé de grain : la main montre le sable)
  hint: 'Touche le sable'
};
