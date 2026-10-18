// Les annonces de l'île (components/World/WorldView/*.js, les mixins de WorldView.vue) : les toasts qui suivent une
// action, et les replis quand le serveur ne dit pas pourquoi une action a échoué (messageOf).

// Replis d'erreur (messageOf), mixin par mixin
export const FAILED = {
  // (annexes.js)
  annexPose: 'L’annexe n’a pas pu être posée.',
  annexMove: 'L’annexe n’a pas pu être déplacée.',
  annexLook: 'L’annexe n’a pas pu changer.',
  // (chests.js)
  chest: 'Le coffre ne s’est pas ouvert.',
  chests: 'Les coffres ne se sont pas ouverts.',
  sign: 'L’enseigne n’a pas pu changer.',
  // (chests.js, sites.js)
  rename: 'Le nom n’a pas pu changer.',
  // (cooking.js, folk.js)
  need: 'Ce besoin n’a pas pu être comblé.',
  // (explore.js)
  zone: 'Le quartier n’a pas pu être acheté.',
  expedition: 'L’expédition n’a pas pu partir.',
  landmark: 'Ce lieu n’a pas pu être découvert.',
  deposit: 'Ce gisement n’a pas pu être ramassé.',
  // (folk.js)
  arrival: 'L’accueil n’a pas pu se faire.',
  anya: 'Anya n’a pas pu souffler.',
  brume: 'Brume n’a pas pu répondre.',
  villager: 'L’habitant n’a pas pu répondre.',
  beast: 'La bête n’a pas pu être nourrie.',
  bubbles: 'Les bulles n’ont pas pu être ramassées.',
  needs: 'Les besoins n’ont pas pu être comblés.',
  // (games.js : la Récolte, les mini-jeux)
  harvest: 'La Récolte n’a pas pu commencer.',
  weigh: 'Le serveur n’a pas pu peser ta récolte.',
  game: 'La partie n’a pas pu commencer.',
  count: 'Le serveur n’a pas pu compter tes prises.',
  // (hens.js)
  cage: 'La cage n’a pas pu s’ouvrir.',
  // (la cage vide, démontée : choix de l'auteur, 15 oct. ; texte validé)
  cageBreak: 'La cage n’a pas pu être démontée.',
  // (nights.js)
  brumeLines: 'Brume n’a pas pu finir sa phrase. Réessaie plus tard.',
  stray: 'Cet égaré n’a pas pu être repoussé.',
  repair: 'Le bâtiment n’a pas pu être réparé.',
  // (roads.js)
  road: 'Le chemin n’a pas pu être tracé.',
  // (siteMove.js)
  siteMoveStart: 'Le bâtiment ne peut pas être déplacé pour l’instant.',
  siteMove: 'Le bâtiment n’a pas pu être déplacé.',
  // (sites.js)
  build: 'Le chantier n’a pas pu être bâti.',
  collect: 'La production n’a pas pu être ramassée.',
  buy: 'L’achat n’a pas pu se faire.',
  undo: 'L’achat n’a pas pu être annulé.',
  skin: 'Le skin n’a pas pu être changé.',
  // (workshop.js)
  assemble: 'L’assemblage n’a pas pu commencer.',
  check: 'L’assemblage n’a pas pu être vérifié.',
  shelter: 'L’abri n’a pas pu être bâti.',
  line: 'Le trait n’a pas pu être posé.',
  craftPose: 'La création n’a pas pu être posée.',
  craftMove: 'La création n’a pas pu être déplacée.',
  craftTurn: 'La création n’a pas pu pivoter.',
  craftStore: 'La création n’a pas pu être rangée.'
};

// Toasts, mixin par mixin
export const TOASTS = {
  // (annexes.js : la case touchée n'est pas dorée)
  annexAround: site => `Choisis une case dorée autour de ${site ? site.name : 'son bâtiment'}.`,
  // (explore.js)
  expedition: trip => `L’expédition est partie ! Retour dans ${trip} h.`,
  // (folk.js : un visiteur comblé, installé ; un cœur qui rapporte des écus ; une bête nourrie ; « Tout combler »)
  settled: name => `${name} s’installe sur ton île : bienvenue !`,
  friendCoins: name => `${name} t’offre ces écus pour votre amitié !`,
  beastBubble: 'Sa bulle, ramassée d’abord',
  needsFilled: n => `${n} besoin${n > 1 ? 's' : ''} comblé${n > 1 ? 's' : ''} : tes habitants te remercient !`,
  // (serve.js : les décorations remboursées, un dormeur réveillé, une expédition revenue hors de l'écran, ce qu'une
  // action a ramassé en passant)
  refund: (count, coins) => `Les décorations laissent place aux créations d’île : ${count} décoration${count > 1 ? 's' : ''} remboursée${count > 1 ? 's' : ''}, ${coins} écus. Assemble tes créations à l’établi du Foyer.`,
  awake: name => `${name} se réveille !`,
  expeditionBack: (name, climate) => `Expédition revenue : ${name} découvert (${climate || 'climat inconnu'}) !`,
  gathered: 'Ramassé en passant',
  // (siteMove.js)
  siteNoRoom: 'Aucune place libre pour ce bâtiment pour l’instant.',
  siteChoose: 'Choisis une case dorée : le bâtiment s’y pose, centré.',
  // (sites.js : renommer trop tôt, un achat annulé)
  renameLater: (name, level) => `${name} se renommera au palier ${level}.`,
  undone: name => `Achat annulé : ${name}.`,
  // (workshop.js : aucune case pour une création, un trait arrêté en route, la case touchée n'est pas dorée, une
  // création rangée)
  craftNoRoom: 'Aucune case libre ne convient pour l’instant : sa règle de pose est dans l’établi.',
  linePlaced: (placed, stopped) => `${placed} posé${placed > 1 ? 's' : ''} : ${stopped}`,
  craftChooseFor: place => `Choisis une case dorée : ${place}`,
  craftChoose: 'Choisis une case dorée.',
  craftStored: name => `${name} rangée dans la réserve de l’établi.`
};
