// Les gestes sur l'île (world/view/gestures.js) : la bulle d'info de ce qui est sous le doigt (son texte, et l'aide qui
// dit ce que fait le toucher), les bêtes de passage (nom et fiche courte) et la cage aux poules. Les libellés des
// boutons et les titres restent dans le code.

// Les bêtes de passage, à l'appui long : [nom, ce que dit la bulle]
export const ANIMALS = {
  chicken: ['Poule', 'Elle picore autour du Foyer et dort contre lui la nuit.'],
  butterfly: ['Papillon', 'Il butine les fleurs par beau temps.'],
  bee: ['Abeille', 'Elle butine les fleurs par beau temps.'],
  frog: ['Grenouille', 'Elle saute plus souvent quand il pleut.'],
  pod: ['Dauphins', 'Ils passent au large de temps en temps.'],
  whale: ['Baleine', 'Elle souffle quand on la touche.'],
  perch: ['Mouettes', 'Elles s’envolent puis reviennent sur la plage.'],
  school: ['Banc de poissons', 'Il fuse quand on le touche, puis se regroupe.'],
  phenix: ['Brume en Phénix', 'Ta flamme, notre vie.']
};
// La cage aux poules, échouée (le premier toucher)
export const CAGE_TEXT = 'Échouée au bout de la plage : les poules d’Agathe ont tenu bon !';
// La cage vide, le poulailler posé (choix de l'auteur, 15 oct. ; texte validé) : la démonter rend son bois
export const CAGE_EMPTY_TEXT = 'Vide : les poules ont leur poulailler. Démontée, elle rend son bois.';

// Ce que dit la bulle (tipOf) : la mer, la bouteille, une bête qui a faim ou dont la bulle est pleine (n, food : ce
// qu'elle a donné), la production à encaisser, les quartiers (inconnu, à soi, à faire naître dans l'Athanor, à acheter,
// à ouvrir avec un chapitre), un bâtiment (fermé, ce qu'il produit par heure), une création d'île, une trouvaille (son
// quartier à acheter : zone, ou thisZone ; verb : ce qu'on en fait ; elle repousse : wait ; prête, avec son bonus de
// climat), un lieu remarquable
export const TAP_TEXTS = {
  sea: 'Dauphins, baleine et méduses passent au large.',
  bottle: 'Un mot signé « H. », et un coffre.',
  hungry: 'A faim : un peu de nourriture, et sa bulle se remplit.',
  ready: (n, food) => `${n} ${food} dans sa bulle.`,
  pending: 'Ressources et écus à encaisser.',
  unknown: 'Une expédition révélera ce qu’elle cache.',
  owned: 'Quartier à toi.',
  plan: plan => `À découvrir : fais naître « ${plan} » dans l’Athanor.`,
  price: price => `Quartier à acheter : ${price} écus.`,
  chapter: chapter => `S’ouvre avec le chapitre ${chapter} du Grimoire.`,
  locked: 'Dans un quartier encore fermé.',
  perHour: (level, amount, what, coins) => `Palier ${level} · ${amount} ${what} et ${coins} écus par heure`,
  craft: 'Une création d’île, assemblée à l’établi.',
  thisZone: 'ce quartier',
  buyFor: (zone, verb) => `Achète ${zone} pour ${verb}.`,
  seaBrings: wait => `La mer en rapportera dans ${wait}.`,
  regrows: wait => `Repousse dans ${wait}.`,
  depositReady: (verb, bonus) => `Prêt : touche pour ${verb}${bonus ? ` (+${bonus} grâce aux créations de climat)` : ''}.`,
  landmark: 'Un lieu remarquable à découvrir.',
  buyLandmark: zone => `Achète ${zone} pour découvrir ce lieu.`
};
// L'aide de la bulle : ce que fait le toucher (ou l'appui long) ; où va une trouvaille ramassée (stock : les réserves ;
// bag : le sac)
export const TAP_HINTS = {
  sea: 'Toucher : des ronds dans l’eau',
  bottle: 'Toucher deux fois : l’ouvrir',
  sign: 'Appui long : la changer',
  animal: 'Toucher : la faire réagir',
  sheet: 'Toucher deux fois : sa fiche',
  gather: 'Toucher : ramasser toutes les bulles',
  collect: 'Toucher : tout ramasser',
  expedition: 'Toucher deux fois : préparer l’expédition',
  zone: 'Toucher deux fois : voir le quartier',
  build: 'Toucher deux fois : ce qu’il faut pour bâtir',
  site: 'Toucher deux fois : sa fiche et sa boutique',
  craft: 'Appui long : la déplacer ou la ranger',
  stock: 'Il va dans tes réserves, en haut',
  bag: 'Le sac, en haut à gauche : tes trouvailles',
  follow: 'Toucher deux fois : suivre dans le Grimoire',
  pick: 'Toucher deux fois : ramasser',
  page: 'Appui long : sa page du Carnet',
  find: 'Toucher deux fois : le découvrir',
  log: 'Appui long : le Carnet d’explorateur'
};
