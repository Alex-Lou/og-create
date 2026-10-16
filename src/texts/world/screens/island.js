// L'île elle-même (components/World) : WorldView.vue (l'invité, la panne, la note sous l'île, ce que lit un lecteur
// d'écran), les bandeaux de pose et les bulles de ses mixins (WorldView/*.js, hors toasts : alerts.js), IslandLoader
// et PanelLoading.

// Invité : l'île demande un compte (WorldView.vue)
export const GUEST = {
  title: 'Ton île t’attend.',
  text: 'Crée un compte pour bâtir ton île : chantiers, récoltes et créations y sont gardés pour toi.'
};
// L'île n'a pas pu se charger (WorldView.vue)
export const LOAD_ERROR = 'L’île ne répond pas.';
// Le « ! » près du suivi des quêtes, quand la leçon du tutoriel a été refermée (WorldView : recallLesson)
export const RECALL = 'Revenir à l’objectif';
// La note sous l'île (WorldView.vue)
export const ISLAND_NOTE = 'Tes bâtiments produisent ressources et écus, la Récolte aussi. À l’établi du Foyer, assemble des créations pour embellir l’île.';
// L'île pour un lecteur d'écran (WorldView.vue, canvasLabel) : ses bâtiments, ses annexes, ses créations
export const CANVAS_LABEL = (built, annexes, names) => `Ton île : ${built.join(', ')} bâtis${annexes ? ` ; ${annexes} annexe${annexes > 1 ? 's' : ''}` : ''}${names.length ? ` ; créations : ${names.join(', ')}` : ''}.`;

// Les bandeaux de pose : un bâtiment, une annexe, une création à déplacer ou à poser (WorldView.vue, annexes.js,
// workshop.js), un trait (workshop.js), les chemins (roads.js)
export const BANNERS = {
  move: name => `Touche une case dorée pour y déplacer : ${name}.`,
  pose: name => `Touche une case dorée pour poser : ${name}.`,
  line: name => `Appui long sur une case dorée, puis glisse : ${name} sur chaque case.`,
  roadErase: n => `${n} case${n > 1 ? 's' : ''} à effacer.`,
  roadEraser: 'Touche tes chemins pour les effacer.',
  roadLay: 'Touche une case pour y poser un chemin. Appui long puis glisse : tout un trait.',
  // (le pavé : roads.js, la Carrière bâtie)
  roadPaver: stone => `Touche un chemin pour le paver (${stone} pierres la case), un pavé pour le dépaver.`,
  // (la porte d'un enclos : WorldView, enclosures.js)
  door: 'Touche une case dorée du mur pour y poser la porte.',
  // (la boucle suggérée d'un trait, en pointillés : ce qu'il manque pour fermer l'enclos, ou qu'il se ferme ; choix de
  // l'auteur, 15 oct.)
  loopLeft: n => ` · encore ${n} pour fermer`,
  loopClosed: ' · l’enclos se ferme'
};

// Un enclos qui se ferme (choix de l'auteur, 15 oct. : WorldView, enclosures.js ; Hud/DoorOffer) : la proposition d'une
// porte, avec son verrou ou sans (cost : ce qu'elle coûte, ou ce qui l'attend en réserve) ; le verrou d'une porte posée
export const DOOR_OFFER = {
  closed: 'L’enclos est fermé. Une porte ?',
  almost: n => (n > 1 ? `L’enclos est presque fermé : il manque ${n} portes.` : 'L’enclos est presque fermé : il manque une porte.'),
  lock: 'Avec verrou',
  plain: 'Sans verrou',
  // (pour les lecteurs d'écran : le choix et son prix)
  choice: (label, cost) => `${label} : ${cost}`,
  reserve: 'en réserve',
  later: 'Plus tard',
  done: 'L’enclos est fermé.'
};
export const DOOR_MENU = {
  lock: cost => `Verrouiller · ${cost}`,
  unlock: 'Ôter le verrou'
};

// Les bulles de l'île
export const BUBBLES = {
  // (l'appui long sur une annexe, un habitant : annexes.js, folk.js)
  hold: 'Appui long : sa fiche',
  // (un naufragé qui débarque, au tutoriel : castaways.js ; son nom vient devant)
  landedCamp: 'débarque et rejoint le camp.',
  landed: 'débarque sur l’île.',
  // (Anya souffle une page, ou n'en a pas : folk.js)
  anyaBreath: (line, chapter, ingredient) => `${line} Sur une page du chapitre ${chapter}, il faut « ${ingredient} ».`,
  anyaNoPage: 'Le Grimoire n’a pas de page qui m’attende. Écris encore.',
  // (Brume n'a pas de page des Légendes : folk.js)
  brumeNoPage: 'Rien pour moi dans le livre, pas encore. Écris encore, et reviens me voir.',
  // (la bulle d'un besoin touchée, la réserve ne suffit pas : folk.js)
  lackingTitle: 'Il te manque de quoi',
  lackingItem: (n, label, have) => `${n} ${label} (tu en as ${have})`,
  lacking: list => `Il faut ${list}. La Récolte en donne ; la mer en rend aussi sur le rivage, et les poules nourries pondent.`,
  // (une case refusée au tracé des chemins : roads.js)
  roadNotMine: 'Touche un chemin que tu as tracé pour l’effacer.',
  paveOnPath: 'Le pavé se pose sur un chemin de tes quartiers.',
  roadMax: max => `Un tracé fait au plus ${max} cases : touche « Tracer », puis continue.`
};

// La fanfare d'un quartier acheté, au pied de son panneau (explore.js)
export const NEW_ZONE = name => `Nouveau quartier · ${name}`;

// L'île se prépare : la dernière étape (IslandLoader)
export const ISLAND_READY = 'L’île est prête.';
// Un mini-jeu ou l'établi se charge, une partie ou un assemblage démarre (PanelLoading, MiniGame, CraftPuzzle)
export const WAIT = 'Un instant…';
