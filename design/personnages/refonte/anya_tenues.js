// Anya : ses saisons et ses états. habiller(saison, etat) rend Anya prête à passer à anya() ou aux animations
// (anya_anims.js : dessiner) :
//   dessiner(habiller('automne', 'eveillee'), 'repos', 'face', 0)
// La saison change son manteau vivant (anya_refonte.js : SAISONS) ; l'état, ce que le Voile fait d'elle.
const { SAISONS } = require('./anya_refonte');

// Les états : éveillée (elle flotte, sa lumière), ou endormie sous le Voile (la statue grise, la mousse, le lierre et
// ses fleurs fermées, sans lumière ; HISTOIRE.md § 6.14 : la nuit où l'étoile est tombée, elle s'est endormie sous le
// Voile). pierre, lierre : les réglages d'anya() que l'état impose ; chaque animation se joue dans un état (anya_anims.js :
// etat) et règle elle-même ces réglages
const ETATS = {
  eveillee: { nom: 'Éveillée', quand: 'après la Révélation : elle erre, on la croise rarement, à l\'aube ou au crépuscule', pierre: 0, lierre: 0 },
  voilee: { nom: 'Endormie sous le Voile', quand: 'avant la Révélation : au centre du Cercle de menhirs, la statue que personne ne voit', pierre: 1, lierre: 1 }
};

function habiller(saison = 'ete', etat = 'eveillee') {
  if (!SAISONS[saison]) throw new Error(`saison inconnue : ${saison}`);
  const E = ETATS[etat];
  if (!E) throw new Error(`état inconnu : ${etat}`);
  return { uid: `an${saison.slice(0, 2)}${etat.slice(0, 2)}`, saison, etat, pierre: E.pierre, lierre: E.lierre };
}

module.exports = { habiller, ETATS, SAISONS };
