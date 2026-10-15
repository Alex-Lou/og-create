// Le fil conducteur du tutoriel sur l'île (choix de l'auteur, 11 oct.) : à chaque étape, où en est chaque personnage.
// C'est le seul endroit qui le décide : App le calcule (islandStory.js : islandStage), WorldView le lit (castaways.js :
// qui paraît, son chantier, son coin, où il se tient ; terrain.js et world/reveal.js : sa zone). Le serveur reste seul
// juge de qui est sur l'île (world/people.js) ; ceci ne règle que ce qui se montre, scène après scène. Un personnage
// absent de la table, ou dont aucun état ne convient, est chez lui : tout de lui se voit.

// Ce que chaque état change à ce qui se voit (le reste, comme chez soi) :
// - vagues : il n'a pas encore paru (sa scène d'abord) : ni lui, ni son chantier, ni son coin, ni sa zone ;
// - lisiere : il sort de la brume, au pied du chemin de son chantier (on le touche : sa scène) ; ni son chantier, ni
//   son coin, ni sa zone ;
// - nage : il nage vers notre plage, au pied de son chantier (on le touche : sa scène) ; ni son chantier, ni son coin,
//   ni sa zone ;
// - loin : pas encore paru non plus, mais son bâtiment est déjà au joueur (le Feu d’Agathe, bâti le premier soir) :
//   ni elle, ni son coin, ni sa zone ;
// - plage : débarqué sur notre plage, son camp pas encore choisi : il se tient sur le sable, au pied de son chantier ;
//   son chantier, son coin et sa zone attendent ;
// - campe : son camp choisi, il reste au pied de son chantier jusqu'à la fin de l'étape ;
// - planche : il dort sur une planche échouée au bord de notre plage (on le réveille : sa scène) ; ni son chantier, ni
//   son coin, ni sa zone ;
// - large : la cage des poules, encore au large (on l'entend, on ne la voit pas) ;
// - echappee : une poule sortie de la cage, qu'il faut attraper (WorldView, henCatch.js).
const LOOKS = {
  vagues: { arrived: false, site: false, coin: false, zone: false },
  loin: { arrived: false, coin: false, zone: false },
  nage: { site: false, coin: false, zone: false, eau: true },
  lisiere: { site: false, coin: false, zone: false, lisiere: true },
  plage: { site: false, coin: false, zone: false, rive: true },
  campe: { rive: true },
  planche: { site: false, coin: false, zone: false, planche: true },
  large: { coin: false },
  echappee: { loose: true }
};
const SHOWN = { arrived: true, site: true, coin: true, zone: true, eau: false, lisiere: false, rive: false, planche: false, loose: false };

// Les trois poules d’Agathe (serveur : services/beasts.js) : Caramel, Flocon et Réglisse
export const HENS = ['poule-rousse', 'poule-blanche', 'poule-noire'];

// Chaque personnage (l'id de son bâtiment ; une chose ou une bête du tutoriel, son id) et ses états, dans l'ordre : le
// premier qui convient. during : les quêtes où il vaut (toutes, sinon) ; until : la scène vue qui le clôt
export const TIMELINE = {
  // Lorena (jour 2) : elle nage au pied de son Ponton, un « ! » au-dessus ; touchée, sa scène ; elle sort de l'eau, choisit
  // son camp à la longue-vue, y va au retour de sa Récolte (choix de l'auteur, 12 oct. : jamais à l'épave)
  ponton: [
    { is: 'nage', during: ['caisse'], until: 'recolte' },
    { is: 'plage', during: ['caisse', 'recolte'], until: 'longue-vue' },
    { is: 'campe', during: ['caisse', 'recolte'] }
  ],
  // Agathe (jour 3) : elle sort de la brume par sa scène ; son coin et sa zone, au bout de la plage, avec elle
  foyer: [{ is: 'loin', until: 'cannelle' }],
  // Jovin (jour 4)
  // (au matin de son jour, il sort de la brume au nord du feu, un « ! » au-dessus ; choix de l'auteur, 13 oct.)
  atelier: [{ is: 'lisiere', during: ['deco'], until: 'rivet' }, { is: 'vagues', until: 'rivet' }],
  // Léo (jour 5 ; choix de l'auteur, 14 oct.) : au matin, Lorena voit une planche sur la vague (vu : « planche ») ; elle
  // s'échoue un peu plus loin que son Ponton, Léo endormi dessus ; réveillé, sa scène, puis il gagne son Puits. Rien de
  // lui avant son jour (une partie commencée avant la planche la trouve déjà échouée)
  puits: [
    { is: 'vagues', during: ['eveil-ondin'], until: 'planche' },
    { is: 'planche', during: ['eveil-ondin', 'souvenir-ondin'], until: 'ondin' },
    { is: 'vagues', until: 'ondin' }
  ],
  // Le jour d’Agathe : sa cage, au large (invisible) jusqu'à ce que la longue-vue de Lorena la voie, à son étape
  // (choix de l'auteur, 13 oct. : rien ne se montre avant son tour) ; ses poules, échappées de la cage ouverte jusqu'à
  // ce qu'on les attrape, une à une
  cage: [{ is: 'large', until: 'cage-vue' }],
  ...Object.fromEntries(HENS.map(id => [id, [{ is: 'echappee', during: ['cage', 'poules'], until: `poule:${id}` }]]))
};

// L'étape de l'île : { id du personnage : état } (ceux qui sont chez eux n'y figurent pas). running : le tutoriel est en
// cours ; quest : l'id de la quête active ; seen : les scènes vues
export function stageOf({ running, quest, seen = [] }) {
  if (!running) return {};
  const stage = {};
  for (const [id, steps] of Object.entries(TIMELINE)) {
    const step = steps.find(s => (!s.during || s.during.includes(quest)) && !(s.until && seen.includes(s.until)));
    if (step) stage[id] = step.is;
  }
  return stage;
}

// Ce qui se voit d'un personnage à cette étape : { arrived, site, coin, zone, eau, lisiere, rive, planche, loose }
export const looksOf = (stage, id) => ({ ...SHOWN, ...LOOKS[stage[id]] });
// Les personnages dont ceci est caché à cette étape (what : 'arrived', 'site', 'coin' ou 'zone')
export const hiddenOf = (stage, what) => Object.keys(stage).filter(id => !looksOf(stage, id)[what]);
