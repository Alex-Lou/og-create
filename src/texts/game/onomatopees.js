// Les onomatopées et les mots de fanfare des spectacles (design/conception/onomatopees.md) : les paliers féeriques,
// communs à tous les mini-jeux et aux coffres (game/stage/tiers.js, game/chestFx.js), puis le bruit propre à chaque
// jeu (game/*Fx.js). Les listes se disent à tour de rôle. Des bruits, pas des interjections (choix de l'auteur, 15 oct. :
// décision 23).

// Les paliers féeriques, du plus petit au plus haut (le plus haut salue Brumelune) ; les coffres disent les quatre
// premiers selon leur rareté (commun, rare, épique, légendaire)
export const TIER_WORDS = {
  joli: 'Joli !',
  superbe: 'Superbe !',
  magique: 'Magique !',
  feerique: 'Féerique !',
  lune: 'Clair de lune !'
};

// La Récolte (game/harvestFx.js) : chaque ressource, une par coup
export const HARVEST_WORDS = {
  wood: ['Toc !', 'Toc toc !', 'Cric-crac !'],
  stone: ['Cloc !', 'Clic-clac !', 'Tac !'],
  water: ['Plic !', 'Ploc !', 'Flic-floc !'],
  food: ['Frou-frou !', 'Hop !', 'Crac !'],
  fish: ['Bloup !', 'Flip-flap !', 'Plouf !']
};

// La Pêche (game/fishingFx.js) : chaque prise, puis un lancer à vide (un mot gentil)
export const FISHING_WORDS = {
  gardon: ['Flic !', 'Hop !', 'Frrt !'],
  truite: ['Flip-flap !', 'Splash !'],
  dore: ['Diling !', 'Tilin-tilin !'],
  botte: ['Floc…', 'Splotch…'],
  miss: ['Plic…', 'Plouf…']
};

// Le Filon (game/veinFx.js) : un coup de pioche ; un bloc très dur qui s'écroule ; un bloc vide, avec des éclats autour
// (une pierre dort tout près) ou sans rien ; chaque pierre trouvée
export const VEIN_WORDS = {
  hit: ['Tic !', 'Toc !', 'Tac !'],
  break: ['Patatras !'],
  hint: ['Crr…', 'Gling !'],
  empty: ['Pof…', 'Fff…'],
  quartz: ['Ting !', 'Gling !'],
  amethyste: ['Ding !', 'Dong !'],
  rubis: ['Diling !', 'Tilin !'],
  diamant: ['Clinnng !', 'Diliiing !']
};

// La Cueillette (game/pickFx.js) : chaque chose cueillie, puis une baie tombée sans être cueillie (un mot doux)
export const PICK_WORDS = {
  mure: ['Pop !', 'Plop !'],
  fraise: ['Pic !', 'Hop !'],
  myrtille: ['Pic !', 'Tip !'],
  cepe: ['Crac !', 'Trouvé !'],
  guepes: ['Bzzz !', 'Zzzt !'],
  fall: ['Ploc…']
};

// La marmite d’Agathe (game/cookFx.js) : chaque ingrédient qui tombe, un tour de louche (le premier, puis le
// bouillon qui frémit), le dernier tour (prêt), la louche versée dans le bol, puis la fin. « Doucement ! » et « Plouf ! »
// de la scène sont dans texts/tutorial/cooking.js
export const COOK_WORDS = {
  in: { coquillages: 'Ploc !', algues: 'Plouf !', eau: 'Glou-glou !' },
  stir: ['Flic-flac !', 'Blop blop !'],
  ready: 'Blop !',
  serve: 'Glou !',
  end: 'Fumant !',
  // (l'eau juste au trait ; l'eau ou la soupe qui déborde ; la louche pleine lâchée hors du bol)
  line: 'Pile au trait !',
  over: 'Ça déborde !',
  spill: 'Oups !'
};

// L'assemblage à l'établi (game/craftFx.js) : une pièce posée, une pièce qui ne tient pas, le gabarit rempli, la
// création assemblée
export const CRAFT_WORDS = {
  place: ['Clac !', 'Tic !'],
  miss: 'Clonk…',
  full: 'Clac-clac !',
  made: 'Ziiing !'
};

// La chasse aux poules (game/henFx.js) : une poule prise, puis toutes rentrées. Les « Cot ! » de l'esquive sont dans
// texts/tutorial/henChase.js
export const HEN_WORDS = {
  catch: ['Hop !', 'Attrapée !'],
  home: 'Au nid !'
};
