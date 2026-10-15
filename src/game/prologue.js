// Le tutoriel « Le Naufrage de l'Hirondelle » (HISTOIRE.md, § 9) : où en est le joueur, déduit de ce que le jeu sait
// déjà (compte, éléments du Grimoire, quête de Brume) ; l'appareil ne retient que ce qui ne se déduit pas : le
// prologue commencé ici, les scènes vues, l'avatar choisi et le nom écrit avant le compte, « Passer ».
// Les joueurs actuels ne le voient pas : il ne commence que pour un invité qui n'a encore que les quatre Souffles, et
// un compte ne le poursuit que s'il a été créé par lui.
// Le livre d'abord (choix de l'auteur, 8 puis 10 oct.) : après le naufrage, la carte d'embarquement et l'arrivée, un
// compte provisoire est ouvert en coulisse (serveur : /auth/provisional) ; Brume a confié le Grimoire, il s'ouvre nu sur
// la page du Vent (la première quête de Brume) ; le vent levé, la page de garde « signe » le compte (adresse et mot de
// passe : /auth/claim), puis Brume invite sur l'île, où le joueur débarque une seule fois. Si le compte provisoire ne
// peut pas s'ouvrir (noProvisional), l'ancien chemin reste : le Vent, puis la page de garde crée le compte.
import { COACH } from '@/texts/tutorial/coach';
import { HENS } from '@/game/stages';
import * as storage from '@/utils/storage';
import { BASE_ELEMENTS } from '@/utils/gameConstants';

const KEY = 'oc_prologue';
// look : l'avatar choisi sur la carte d'embarquement (game/sceneArt.js), gardé sur l'appareil jusqu'au compte, qui le
// garde ensuite (App, keepAvatar)
// provisional : le compte a été ouvert en coulisse par le tutoriel ; signed : sa page de garde est signée ;
// noProvisional : il n'a pas pu s'ouvrir (l'ancien chemin, le Grimoire d'abord) ; restarted : tout a été recommencé
// (Mon compte), l'ouverture se rejoue sur cet appareil avant l'île (App, story.js : openingReplay)
const blank = () => ({ started: false, skipped: false, registered: false, named: false, finished: false, name: null, look: null, seen: [], provisional: false, signed: false, noProvisional: false, restarted: false });

export function loadPrologue() {
  const saved = storage.load(KEY, null);
  return saved && typeof saved === 'object' ? { ...blank(), ...saved, seen: Array.isArray(saved.seen) ? saved.seen : [] } : blank();
}
export function savePrologue(state) {
  storage.save(KEY, state);
}

// Découvertes au-delà des quatre Souffles
export const discoveriesOf = elements => elements.filter(name => !BASE_ELEMENTS.includes(name)).length;

// Le Grimoire nu (choix de l'auteur, 8 oct.) : à la page du Vent et pendant le vent qui se lève, le joueur ne voit que
// le livre, l'étagère et l'Athanor ; ni en-tête, ni onglets, ni sommaire, ni filtres, ni Encre ; l'étagère ne montre que
// l'Air. Chaque commande arrive le jour où elle sert. Rend null (rien de nu), ou { shelf } (les éléments de l'étagère ;
// null : tous)
export function bareGrimoire(ctx) {
  const step = prologueStep(ctx);
  if (!step) return null;
  if (step.phase === 'vent') return { shelf: ['Air'] };
  return step.phase === 'scene' && step.scene === 'souffle' ? { shelf: null } : null;
}

// Ce que le tutoriel montre maintenant : { phase, … } ou null (rien : pas de tutoriel, ou étape finie ici)
// ctx : { state, loggedIn, elements, quest } (quest : l'identifiant de la quête active de Brume, s'il est connu)
export function prologueStep({ state, loggedIn, elements, quest = null }) {
  if (state.skipped) return null;
  const found = discoveriesOf(elements);
  if (!state.started) {
    // Seul un invité tout neuf commence le tutoriel
    if (loggedIn || found > 0) return null;
    return { phase: 'start' };
  }
  // Un compte ouvert autrement que par la page de garde : c'est un joueur qui a déjà sa partie
  if (loggedIn && !state.registered) return null;
  const seen = new Set(state.seen);
  // Étapes 1 à 3 : le naufrage, la carte d'embarquement (l'avatar et le nom), Brume et le livre. Un appareil qui a vu
  // l'arrivée d'avant (Brume y venait d'abord) ne revient pas en arrière
  if (!seen.has('arrivee')) {
    if (!seen.has('naufrage')) return { phase: 'scene', scene: 'naufrage' };
    if (!state.look) return { phase: 'avatar' };
    return { phase: 'scene', scene: 'arrivee' };
  }
  if (!loggedIn) {
    // L'île d'abord : le compte s'ouvre en coulisse (le Monde demande un compte côté serveur)
    if (!state.noProvisional) return { phase: 'account' };
    // Sans compte possible, l'ancien chemin : une seule page avant l'île, le Vent, guidé ; puis la page de garde crée
    // le compte
    if (!elements.includes('Vent')) return { phase: 'vent' };
    if (!seen.has('souffle')) return { phase: 'scene', scene: 'souffle' };
    return { phase: 'name', account: true };
  }
  // Le nom de la carte d'embarquement part au serveur
  if (!state.named) return { phase: 'name', account: false };
  // Le livre d'abord : la page du Vent (la première quête de Brume), au Grimoire nu. Le Brasier viendra ensuite, au
  // moment où le camp en aura besoin : le joueur apprend une chose, l'utilise, puis seulement en apprend une autre.
  if (!elements.includes('Vent')) return { phase: 'vent' };
  if (!seen.has('souffle')) return { phase: 'scene', scene: 'souffle' };
  // Le vent levé : le compte ouvert en coulisse se signe sur la page de garde (adresse et mot de passe)
  if (state.provisional && !state.signed) return { phase: 'sign' };
  // Le Brasier dans la même visite (choix de l'auteur, 11 oct.) : « Quel jour ? », puis la nuit qui vient et le vieux
  // cercle de flammes (choix de l'auteur, 14 oct. : ecriture/lots/01_ouverture.md), puis sa page ; le joueur ne va sur
  // l'île qu'une fois, le livre écrit. (Un joueur déjà passé sur l'île : son chantier du feu le mène au Grimoire)
  if (!elements.includes('Brasier') && (!quest || quest === 'pages')) {
    if (!seen.has('jour')) return { phase: 'scene', scene: 'jour' };
    if (!seen.has('cercle')) return { phase: 'scene', scene: 'cercle' };
    return { phase: 'brasier' };
  }
  // Le Brasier écrit, avant la plage : l'épave promise (pour qui a vu le cercle : un tutoriel commencé avant ne la voit pas)
  if (seen.has('cercle') && !seen.has('epave')) return { phase: 'scene', scene: 'epave' };
  return { phase: 'greve' };
}

// Les quêtes guidées (serveur : services/quests.js). La première séquence est désormais nette : Vent, six trouvailles,
// Brasier, feu, la première nuit (seul), puis le jour d'Hermine (sa caisse, sa Récolte, son Ponton, le chemin entre les deux
// camps, ses quatre piquets) et la deuxième nuit. La suite conserve provisoirement la chaîne existante.
export const PROLOGUE = ['pages', 'ramasser', 'feu', 'nuit', 'caisse', 'recolte', 'premier-ponton', 'chemin-aster', 'clotures', 'portes', 'veille', 'soupe', 'cage', 'poules', 'poulailler', 'abri-cannelle', 'enclos-cannelle', 'nuit-cannelle', 'deco', 'torches-rivet', 'nuit-rivet', 'eveil-ondin', 'souvenir-ondin', 'puits-ondin', 'chemin'];
export const inPrologue = id => PROLOGUE.includes(id);
// La quête id est dans le prologue, au plus tard à l'étape ref (encore à faire ou à réclamer)
export const upTo = (id, ref) => inPrologue(id) && PROLOGUE.indexOf(id) <= PROLOGUE.indexOf(ref);

// Les commandes de l'île pendant le tutoriel (choix de l'auteur, 10 oct. : grisées, pas masquées) : seules celles qu'une
// leçon a déjà montrées répondent ; la Récolte avec la sienne (Hermine), le tracé des chemins avec le sien. Rend null
// (hors du tutoriel : tout répond) ou { harvest, road } (vrai : la commande répond ; les autres sont grisées).
// quest : l'identifiant de la quête active
export function islandTaught({ tutorial, quest }) {
  if (!tutorial || !inPrologue(quest)) return null;
  // (le tracé des chemins s'apprend avec Hermine, entre son camp et le nôtre)
  return { harvest: !upTo(quest, 'nuit'), road: !upTo(quest, 'premier-ponton') };
}
// La quête où chaque scène de l'île se joue, et les scènes d'avant l'île (vues avant le compte)
// La première nuit se passe seul avec Brume ; Hermine arrive au matin et ouvre son propre tutoriel par la Récolte ; les
// autres personnages viendront ensuite, chacun avec sa séquence.
const SCENE_AT = { nuit: 'nuit', recolte: 'caisse', cannelle: 'soupe', rivet: 'deco', ondin: 'souvenir-ondin' };
const BEFORE_ISLAND = ['naufrage', 'arrivee', 'souffle', 'jour', 'cercle', 'epave'];
// Le tutoriel repris par le compte, sur un appareil qui n'en a rien retenu (game : App, story.js) : les scènes des
// étapes déjà passées comptent comme vues (on ne les rejoue pas), celle de l'étape en cours se joue
// (la scène active n'est jamais comptée comme vue d'avance)
export function scenesBefore(questId) {
  const at = PROLOGUE.indexOf(questId);
  if (at < 0) return [...BEFORE_ISLAND, ...Object.keys(SCENE_AT).filter(scene => SCENE_AT[scene] !== 'chemin')];
  return [...BEFORE_ISLAND, ...Object.keys(SCENE_AT).filter(scene => PROLOGUE.indexOf(SCENE_AT[scene]) < at)];
}

// Un compte repris par le serveur prime sur ce que cet appareil a retenu d'un autre compte ou d'une ancienne version.
// On conserve seulement les scènes réellement vues ici ; « terminé » ou « passé » en local ne peut pas court-circuiter
// une première nuit encore incomplète côté serveur.
export function resumedPrologue(state, questId) {
  const seen = [...new Set([...(state.seen || []), ...scenesBefore(questId)])];
  return { ...state, started: true, skipped: false, registered: true, named: true, finished: false, seen };
}

// Le geste que le coach montre pour chaque quête du prologue (game/coach.js) : les étapes, dans l'ordre (sur l'île, la
// cible ; un toucher ouvre une petite bulle et son bouton entre dans la fiche ; dans la fiche, le bon bouton). Le coach
// montre la plus avancée qui est à l'écran : le joueur n'est jamais lâché, même s'il referme une bulle en route.
// target : un sélecteur, ou « île:… » sur le canvas de l'île ; text : ce que dit la bulle du coach
const tipOf = (...keys) => keys.map(key => `.world__tip-btn[data-pick="${key}"]`).join(', ');
// Les gestes du Grimoire vers un élément à écrire (la quête de Pierrot, le plan d'un bâtiment) : le ruban, l'Encre offerte
// de la page marquée, les éléments à poser, « Transmuer ». intro : ce que dit le ruban ; why : pendant quoi l'Encre est
// offerte (serveur : quests.GUIDED_INK), ou null : pas d'Encre (le Brasier, Feu + Feu : l'énigme suffit, choix de
// l'auteur, 12 oct. ; elle s'apprend avec Pierrot, sur la Pluie et ses leurres, où elle sert vraiment)
function bookSteps(intro, why, ink = null) {
  return [
    { target: '.book-view__ariane', text: intro },
    { target: '.book-view:has(.book-view__hot[data-marked]) .book-view__shelf', text: COACH.book.page, free: true },
    ...(why ? [
      { target: '.book-view__hot[data-marked] .book-view__spot[data-spot="ink"]', text: ink || COACH.book.ink(why), free: true },
      // (l'Encre a parlé : la main va sur l'ingrédient révélé, pas sur toute l'étagère)
      { target: '.book-view:has(.book-view__hot[data-marked]) .book-view__shelf .tile.is-ink', text: COACH.book.inked, free: true },
      // (l'ingrédient révélé posé, sur une page à leurres : le second se lit dans l'énigme, la main s'y pose ; elle ne le
      // donne pas)
      { target: '.book-view:has(.book-view__shelf .tile.is-slot[data-ink]) .book-view__hot[data-marked] .book-view__spot[data-spot="riddle"]', text: COACH.book.guess, free: true }
    ] : []),
    // (le premier posé, sur une page guidée : la main va sur celui qui manque, le même s'il entre deux fois ; sans
    // Encre, le Brasier : la main va tout de suite sur le Feu, deux fois. BookView/shelf.js : nextPick)
    { target: '.book-view:has(.book-view__hot[data-marked]) .book-view__shelf .tile[data-next]:not(.is-ink)', text: why ? COACH.book.next : COACH.book.twice, free: true },
    FUSE
  ];
}
// Dans la fiche d'un chantier : le bouton pour bâtir, seulement actif (le coach ne montre jamais un bouton grisé : s'il
// manque de quoi payer, la leçon mène d'abord à la Récolte, SHORT)
const BUILD = '[data-coach="site-build"]:not(:disabled)';
// « Transmuer », dans l'Athanor (le dernier geste des pages à écrire)
// Déplacer une création posée
const MOVE = COACH.move;
const FUSE = { target: '.athanor__fuse:not(:disabled)', text: COACH.fuse, free: true };
// Une création assemblée à l'établi de Jovin, puis posée, geste par geste (la lanterne, les torches) : le toucher sur
// Jovin ouvre son établi (App, story.js : islandAct), « Assembler », son casse-tête (la main montre chaque pièce, son
// quart de tour, sa case, puis « Assembler » ; CraftPuzzle, guided), « Poser » (dans le casse-tête, ou à l'établi s'il a
// été refermé), une case dorée (WorldView, workshop.js : craftSpots), « Poser ici ». text : ses consignes
const assembleSteps = (id, text) => [
  { target: 'île:habitant:atelier', text: text.rivet },
  { target: `[data-coach="craft-${id}"]:not(:disabled)`, text: text.assemble },
  { target: '[data-coach="puzzle-take"]', text: text.take, free: true },
  { target: '[data-coach="puzzle-turn"]', text: text.turn, free: true },
  { target: '[data-coach="puzzle-drop"]', text: text.drop, free: true },
  { target: '[data-coach="puzzle-done"]:not(:disabled)', text: text.done, free: true },
  { target: `[data-coach="place-${id}"]:not(:disabled)`, text: text.place },
  { target: '[data-coach="puzzle-place"]', text: text.place },
  { target: 'île:pose', text: text.cells },
  { target: '[data-coach="craft-confirm"]:not(:disabled)', text: COACH.clotures.confirm }
];
const LESSONS = {
  // La première quête, depuis l'île : le Grimoire (le coach montre son onglet), l'Air deux fois, « Transmuer » (la
  // consigne est dite par le Grimoire : LINES.vent)
  pages: [{ target: '.book-view__shelf [data-name="Air"]' }, FUSE],
  ramasser: [
    { target: 'île:trouvaille', text: COACH.ramasser.trouvaille },
    { target: '.world__tip-btn[data-pick^="deposit:greve-"]', text: COACH.ramasser.ramasser }
  ],
  // La première nuit : dormir, c'est toucher Brume (WorldView, draw/brume.js : sleep), qui veille ; la deuxième aussi
  nuit: [{ target: 'île:brume', text: COACH.sleep }],
  veille: [{ target: 'île:brume', text: COACH.sleep }],
  // Le jour d'Hermine (choix de l'auteur, 11 oct.) : chaque geste porte un « ! » au-dessus de ce qu'il faut toucher
  // (WorldView : marks) ; toucher Hermine lance ce que l'étape demande (App, story.js : islandAct)
  'aster-eau': [{ target: 'île:habitant:ponton', text: COACH['aster-eau'].aster }],
  'aster-caisse': [{ target: 'île:habitant:ponton', text: COACH['aster-caisse'].aster }],
  caisse: [{ target: 'île:caisse', text: COACH.caisse.caisse }],
  // (sa longue-vue, sortie de la caisse : elle choisit son camp, la caméra suit son regard)
  'longue-vue': [{ target: 'île:habitant:ponton', text: COACH['longue-vue'].aster }],
  recolte: [{ target: 'île:habitant:ponton', text: COACH.recolte.aster }],
  'premier-ponton': [
    { target: 'île:site:ponton', text: COACH['premier-ponton'].site },
    { target: tipOf('site:ponton'), text: COACH.build },
    { target: BUILD, text: COACH['premier-ponton'].build }
  ],
  // Le premier chemin, entre son camp et le nôtre (même geste que celui du Puits, plus loin dans l'histoire)
  'chemin-aster': [
    { target: '[data-coach="road"]:not(.is-on)', text: COACH.road },
    { target: 'île:chemin', text: COACH['chemin-aster'].cells, free: true },
    { target: '[data-coach="road-go"][data-linked]:not(:disabled)', text: COACH['chemin-aster'].trace }
  ],
  // Ses quatre piquets : toucher Hermine ouvre l'établi sur la réserve ; une case dorée (seulement celles du passage des
  // égarés : BARRAGE), « Poser ici » ; la pose reprend tant qu'il en reste (WorldView, workshop.js : CHAIN_LESSONS)
  clotures: [
    { target: 'île:habitant:ponton', text: COACH.clotures.aster },
    { target: '.bench__btn--place', text: COACH.clotures.reserve },
    { target: 'île:pose', text: COACH.clotures.cells, free: true },
    { target: '[data-coach="craft-confirm"]:not(:disabled)', text: COACH.clotures.confirm }
  ],
  // (les deux premiers piquets posés à la main : le reste de l'enclos d'un trait, jusqu'à le boucler ; « Valider »
  // seulement quand le trait le boucle : LineBar, full. Les gestes sur l'île restent libres : ↶ et « Annuler » se
  // touchent, pour défaire un trait parti dans le mauvais sens, jusqu'au premier piquet ; choix de l'auteur, 15 oct.)
  'clotures-trait': [
    { target: 'île:habitant:ponton', text: COACH.clotures.aster },
    { target: '.bench__btn--place', text: COACH.clotures.reserve },
    { target: 'île:trace', text: COACH.clotures.trace, free: true },
    { target: '[data-coach="line-go"][data-full="anneau"]:not(:disabled)', text: COACH.clotures.go }
  ],
  // Ses deux portes (choix de l'auteur, 15 oct.) : une sur chaque sentier qui traverse l'enclos. L'île les propose d'elle-
  // même (WorldView, enclosures.js : lessonDoor) ; « Avec verrou » (sa caisse les a), une case dorée du mur, « Poser
  // ici » ; la pose reprend sur le trou qui reste
  portes: [
    { target: '[data-coach="door-lock"]:not(:disabled)', text: COACH.portes.lock },
    { target: 'île:pose', text: COACH.portes.cells },
    { target: '[data-coach="craft-confirm"]:not(:disabled)', text: COACH.clotures.confirm }
  ],
  // Déplacer une création : l'appui long, « Déplacer », une autre case dorée (le jour de Jovin, avec les bâtiments :
  // déplacer une clôture bien plantée n'aurait pas de sens, choix de l'auteur, 11 oct.)
  deplacer: [
    { target: 'île:creation:cloture', text: MOVE },
    { target: '[data-coach="craft-move"]', text: MOVE },
    { target: 'île:pose', text: MOVE }
  ],
  feu: [
    { target: 'île:site:foyer', text: COACH.feu.site },
    { target: tipOf('site:foyer'), text: COACH.build },
    { target: BUILD, text: COACH.feu.build }
  ],
  // Le jour de Marcelle (choix de l'auteur, 11 oct.) : sa scène vue, un « ! » au-dessus d'elle (on va vers elle) ;
  // ses coquillages d'abord, puis sa bulle (elle ouvre sa marmite, choix de l'auteur, 13 oct. : WorldView/cooking.js). Le coach
  // montre le geste le plus avancé à l'écran : tant qu'un coquillage attend sur le rivage, c'est lui
  'cannelle-parle': [{ target: 'île:habitant:foyer', text: COACH['cannelle-parle'].cannelle }],
  soupe: [
    { target: 'île:besoin:foyer', text: COACH.soupe.bulle },
    { target: 'île:trouvaille:coquillage', text: COACH.soupe.coquillage },
    { target: '.world__tip-btn[data-pick^="deposit:greve-coquillage"]', text: COACH.ramasser.ramasser }
  ],
  // La longue-vue d'Hermine voit la cage dériver (la leçon d'hier, rappelée) ; la cage échouée, on l'ouvre d'un toucher
  // (App, islandStory.js : islandAct) ; les poules échappées, une à la fois (WorldView, henCatch.js) ; puis la bulle de
  // faim de chacune (deux vivres)
  'cage-vue': [{ target: 'île:habitant:ponton', text: COACH['cage-vue'].aster }],
  cage: [{ target: 'île:cage', text: COACH.cage.cage }],
  attraper: [{ target: 'île:poule', text: COACH.attraper.poule }],
  poules: [{ target: 'île:faim', text: COACH.poules.hungry }],
  // Leur poulailler, la leçon des annexes : le Feu, sa fiche, « Annexes », le Poulailler (offert), une case dorée près
  // du coin de Marcelle, « Poser ici »
  poulailler: [
    { target: 'île:site:foyer', text: COACH.poulailler.site },
    { target: tipOf('site:foyer'), text: COACH.poulailler.sheet },
    { target: '[data-coach="tab-annexes"]', text: COACH.poulailler.tab },
    { target: '[data-coach="annex-poulailler"]:not(:disabled)', text: COACH.poulailler.annex },
    { target: 'île:pose', text: COACH.poulailler.cells },
    { target: '[data-coach="annex-confirm"]:not(:disabled)', text: COACH.poulailler.confirm }
  ],
  // Son abri (choix de l'auteur, 13 oct.) : son coin touché, sa bulle, « Bâtir son abri » ; puis son enclos, que le
  // joueur fabrique et paie : Marcelle touchée ouvre l'établi, « Tracer », l'anneau autour de son coin, « Poser »
  'abri-cannelle': [
    { target: 'île:coin:cannelle', text: COACH['abri-cannelle'].coin },
    { target: '.world__tip-btn[data-pick="coin:cannelle"]', text: COACH['abri-cannelle'].build }
  ],
  'enclos-cannelle': [
    { target: 'île:habitant:foyer', text: COACH['enclos-cannelle'].cannelle },
    { target: '[data-coach="bench-trace"]:not(:disabled)', text: COACH['enclos-cannelle'].trace },
    { target: 'île:trace', text: COACH['enclos-cannelle'].glide, free: true },
    { target: '[data-coach="line-go"][data-full="anneau"]:not(:disabled)', text: COACH.clotures.go },
    // (pas assez de bois pour tout l'anneau : on pose ce qu'on peut, la Récolte donnera le reste)
    { target: '[data-coach="line-go"][data-full="bois"]:not(:disabled)', text: COACH['enclos-cannelle'].room }
  ],
  'nuit-cannelle': [{ target: 'île:brume', text: COACH.sleep }],
  // Le jour de Jovin (choix de l'auteur, 13 oct.) : il sort de la brume, un « ! » au-dessus ; touché, sa scène. Puis sa
  // lanterne, geste par geste : le toucher ouvre son établi (App, story.js : islandAct), « Assembler », « Poser », une
  // case dorée au bord du chemin près du feu (WorldView, workshop.js : craftSpots), « Poser ici »
  'rivet-brume': [{ target: 'île:habitant:atelier', text: COACH['rivet-brume'].rivet }],
  deco: assembleSteps('lanterne', COACH.deco),
  // Ses trois torches (choix de l'auteur, 13 oct.) : la même leçon, trois fois (la consigne dite une fois, puis la main
  // et le compteur « 1 / 3 » ; COUNTED) ; une case dorée par côté d'où venaient les égarés (workshop.js : torchSpotsOf)
  'torches-rivet': assembleSteps('torche', { ...COACH.deco, ...COACH['torches-rivet'] }),
  // La quatrième nuit (choix de l'auteur, 13 oct.) : le jour de Jovin finit ; dormir, c'est toucher Brume
  'nuit-rivet': [{ target: 'île:brume', text: COACH.sleep }],
  // Le jour de Pierrot (choix de l'auteur, 14 oct.) : au matin, Hermine voit une planche sur la vague ; touchée, la planche
  // s'échoue, Pierrot endormi dessus ; on le réveille
  'planche-vue': [{ target: 'île:habitant:ponton', text: COACH['planche-vue'].aster }],
  'eveil-ondin': [
    { target: 'île:habitant:puits', text: COACH['eveil-ondin'].ondin },
    { target: tipOf('vil:puits'), text: COACH['eveil-ondin'].wake }
  ],
  // Dans le Grimoire (le coach montre d'abord son onglet, depuis l'île) : le ruban, puis la page marquée, son énigme
  // et l'Encre. Les recettes restent au serveur : le Livre guide par ses pages, jamais par la réponse. Sur la page, rien
  // n'est bloqué (l'étagère doit rester sous le doigt)
  'souvenir-ondin': bookSteps(COACH['souvenir-ondin'].ariane, COACH['souvenir-ondin'].why, COACH['souvenir-ondin'].ink),
  'puits-ondin': [
    { target: 'île:site:puits', text: COACH['puits-ondin'].site },
    { target: tipOf('site:puits'), text: COACH.build },
    { target: BUILD, text: COACH['puits-ondin'].build }
  ],
  // Le premier chemin : le bouton des chemins, les cases à toucher une à une du Puits au sentier du Feu (la main suit
  // les pointillés ; rien n'est bloqué : l'île doit pouvoir bouger), puis « Tracer » quand le tracé les relie
  // (roads.js : roadGuide, data-linked)
  chemin: [
    { target: '[data-coach="road"]:not(.is-on)', text: COACH.road },
    { target: 'île:chemin', text: COACH.chemin.cells, free: true },
    { target: '[data-coach="road-go"][data-linked]:not(:disabled)', text: COACH.chemin.trace }
  ]
};
// Ce qui se paie manque (quest.short : questShort) : la Récolte d'abord, qui en donne
const SHORT = {
  feu: { target: 'île:trouvaille', text: COACH.short.feu },
  soupe: { target: '.world__play', text: COACH.short.soupe },
  poules: { target: '.world__play', text: COACH.short.poules },
  'puits-ondin': { target: '.world__play', text: COACH.short['puits-ondin'] },
  deco: { target: '.world__play', text: COACH.short.deco },
  'torches-rivet': { target: '.world__play', text: COACH.short['torches-rivet'] },
  'premier-ponton': { target: 'île:habitant:ponton', text: COACH.short['premier-ponton'] },
  'abri-cannelle': { target: '.world__play', text: COACH.short['abri-cannelle'] },
  'enclos-cannelle': { target: '.world__play', text: COACH.short['enclos-cannelle'] }
};
// Le chantier de chaque quête qui en bâtit un
const SITE_OF = { feu: 'foyer', 'puits-ondin': 'puits', 'premier-ponton': 'ponton' };
// La quête active demande de payer (le feu, la soupe, une poule, le Puits) et le stock n'y suffit pas encore (ce qui
// attend dans les bâtiments compte : stock, celui que montrent les fiches). state : la vue de l'île
export function questShort(quest, state, stock) {
  if (!quest || quest.done || !state || !SHORT[quest.id]) return false;
  const lacks = cost => Object.entries(cost || {}).some(([r, n]) => (stock[r] || 0) < n);
  if (quest.id === 'soupe') {
    // (ses coquillages d'abord, tant qu'il en reste sur le rivage : ils la nourrissent)
    if ((state.pickups || []).some(p => p.kind === 'coquillage' && !p.readyIn)) return false;
    const cannelle = (state.villagers || []).find(v => v.id === 'foyer');
    const need = cannelle && (cannelle.needs || []).find(n => n.id === 'manger');
    return Boolean(need && need.refill && lacks(need.cost));
  }
  // (la lanterne de Jovin, puis ses torches : tant que la suivante n'est ni assemblée ni posée)
  if (quest.id === 'deco' || quest.id === 'torches-rivet') {
    const made = state.crafts && (state.crafts.catalog || []).find(c => c.id === (quest.id === 'deco' ? 'lanterne' : 'torche'));
    return Boolean(made && !made.reserve && lacks(made.cost));
  }
  // (l'abri de Marcelle ; son enclos, tant qu'il n'y a pas de quoi payer un piquet)
  if (quest.id === 'abri-cannelle') {
    const shelter = state.shelters && state.shelters.cannelle;
    return Boolean(shelter && !shelter.built && lacks(shelter.cost));
  }
  if (quest.id === 'enclos-cannelle') {
    const fence = state.crafts && (state.crafts.catalog || []).find(c => c.id === 'cloture');
    return Boolean(fence && !fence.reserve && lacks(fence.cost));
  }
  // (la cage s'ouvre sans rien payer : seul le repas compte)
  if (quest.id === 'poules') return !(state.camp || []).some(c => c.art === 'cage_coincee') && Boolean(state.beasts && lacks(state.beasts.cost));
  const site = (state.sites || []).find(s => s.id === SITE_OF[quest.id]);
  return Boolean(site && site.next && !site.level && lacks(site.next.cost));
}

// Le plan (un élément du Grimoire) que demande le bâtiment de la quête et qui n'est pas encore écrit, ou null.
// state : la vue de l'île
export function questPlan(quest, state) {
  if (!quest || quest.done || !state || !PLAN_INTRO[quest.id]) return null;
  const site = (state.sites || []).find(s => s.id === SITE_OF[quest.id]);
  return site && !site.level && site.next && site.next.plan && !site.next.planOwned ? site.next.plan : null;
}

// La seule récompense qu'on va chercher auprès de Brume : la première (on apprend le geste) ; les suivantes arrivent seules
export const CLAIM_TAUGHT = 'pages';

// Le passage des égarés vers le feu de camp, sur une île à la plage (serveur : world/places.js, BEACH : le Feu en
// (98, 92), son emprise en (99, 93)) : ils sortent de la brume au nord (BARRAGE, sur l'enclos : là où la caméra regarde
// quand Brume le dit). La nuit de la veillée, les égarés de EGARES (d'où ils sortent, et quand, en s ; side 'x' : ils viennent de
// côté) descendent droit sur le feu et butent sur l'enclos (demos.js, strayDemo)
export const BARRAGE = [{ x: 98, y: 90 }, { x: 99, y: 90 }, { x: 100, y: 90 }, { x: 101, y: 90 }];
// (qui : le Sans-Nom au nord, le Dormeur à l'ouest, l'Esprit à l'est, choix de l'auteur, 14 oct. ; kind : leur espèce,
// serveur : services/nights.js, KINDS)
export const EGARES = [
  { x: 99, y: 86, at: 0, kind: 'fantome' }, { x: 92, y: 93, at: 1.2, side: 'x', kind: 'zombie' }, { x: 101, y: 85, at: 2.2, kind: 'fantome' },
  { x: 106, y: 94, at: 3.2, side: 'x', kind: 'esprit' }, { x: 98, y: 85, at: 4.1, kind: 'fantome' }
];
// L'enclos du camp (choix de l'auteur, 13 oct. ; à deux cases, 15 oct. : une rangée libre dedans, pour ce qu'on défend) :
// les cases de clôture permises (spots) à ENCLOS_GAP cases de la grande emprise du Feu (3 × 3 : elle ne bouge pas quand
// il grandit), dans l'ordre d'un tour, en partant de la brèche ; foyer : le Feu de la vue (son emprise du moment). Les
// sentiers qui le traversent restent libres (les portes, ensuite). [{ x, y }]
const ENCLOS_GAP = 2;
const gapTo = (v, a, w) => Math.max(a - v, 0, v - (a + w - 1));
// La grande emprise du Feu (3 × 3), de la place de la vue (2 × 2 avant le palier IV : au coin bas-droit de la grande)
const bigOf = foyer => (foyer.w >= 3 ? { x: foyer.x, y: foyer.y, w: 3, h: 3 } : { x: foyer.x - 1, y: foyer.y - 1, w: 3, h: 3 });
export function enclosOf(foyer, spots) {
  return ringOf(bigOf(foyer), spots, ENCLOS_GAP);
}
// Les trois torches de Jovin (choix de l'auteur, 13 oct.) : une par côté d'où venaient les égarés de la veillée (EGARES :
// le nord, l'ouest, l'est), à TORCH_GAP cases de la grande emprise du Feu. Pour chaque côté encore sans torche (une
// torche à deux cases de sa place le garde), la case libre la plus proche de sa place, parmi spots. torches : celles
// posées ({ x, y }). [{ x, y }]
const TORCH_GAP = 3;
export function torchSpotsOf(foyer, spots, torches = []) {
  const big = bigOf(foyer);
  const middle = { x: big.x + 1, y: big.y + 1 };
  const sides = [{ x: middle.x, y: big.y - TORCH_GAP }, { x: big.x - TORCH_GAP, y: middle.y }, { x: big.x + big.w - 1 + TORCH_GAP, y: middle.y }];
  const far = (a, b) => Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y));
  return sides.filter(side => !torches.some(t => far(t, side) <= 2))
    .map(side => spots.reduce((best, sp) => (!best || far(sp, side) < far(best, side) ? sp : best), null))
    .filter(Boolean);
}
// L'enclos d'un coin du camp (celui de Marcelle : state.camp, { x, y, w, h }) : à une case de lui, sauf ce qui borde le
// Feu (son enclos à lui) ; même ordre (serveur : world/creations.js, fenceRingOf)
export function cornerRingOf(corner, foyer, spots) {
  const big = bigOf(foyer);
  return ringOf(corner, spots.filter(sp => Math.max(gapTo(sp.x, big.x, 3), gapTo(sp.y, big.y, 3)) > 1));
}
// Les cases (parmi spots) à d cases du rectangle r, dans l'ordre d'un tour, en partant après le plus grand trou
function ringOf(r, spots, d = 1) {
  const ring = spots.filter(sp => Math.max(gapTo(sp.x, r.x, r.w), gapTo(sp.y, r.y, r.h)) === d);
  const angle = sp => Math.atan2(sp.y - (r.y + (r.h - 1) / 2), sp.x - (r.x + (r.w - 1) / 2));
  ring.sort((a, b) => angle(a) - angle(b));
  if (ring.length < 2) return ring;
  // (le tour commence juste après le plus grand trou : la brèche)
  let cut = 0;
  let widest = -1;
  ring.forEach((sp, i) => {
    const next = ring[(i + 1) % ring.length];
    const d = (angle(next) - angle(sp) + 2 * Math.PI) % (2 * Math.PI);
    if (d > widest) {
      widest = d;
      cut = (i + 1) % ring.length;
    }
  });
  return [...ring.slice(cut), ...ring.slice(0, cut)];
}
// La nuit de la veillée (choix de l'auteur, 12 oct.) : touchée pour dormir, Brume joue la scène sur l'île, ces répliques
// dans l'ordre (texts/tutorial/scenes.js : demo, ce que chacune fait voir ; App, islandStory.js : veillee), puis on dort.
// Le Dormeur endormi contre l'enclos a sa réplique, et Hermine parle après la démonstration (choix de l'auteur, 15 oct. :
// ecriture/lots/03_egares.md ; six bulles au plus, comme une scène)
export const VEILLEE = ['cachons', 'egare-la', 'visiteurs', 'dormeur-pique', 'cloture-voyez', 'aster-dormir'];
// Les leçons qui se répètent (trois trouvailles, les piquets de l'enclos ; choix de l'auteur, 13 oct.) : chaque consigne dite une
// fois, ensuite la main seule, et un compteur « 2 / 4 » (game/coach.js, CoachLayer)
const COUNTED = new Set(['ramasser', 'clotures', 'portes', 'enclos-cannelle', 'torches-rivet']);
// Les piquets de l'enclos posés un à un, à la main, avant le trait
const BY_HAND = 2;
// Les leçons qui se jouent dans le Grimoire (les autres, sur l'île)
const BOOK_LESSONS = new Set(['pages', 'souvenir-ondin']);
// La récompense : Brume, sur l'île ; si une fiche est encore ouverte, d'abord la refermer ; au bilan d'une Récolte,
// revenir sur l'île (jamais « Niveau 2 » pendant le tutoriel). Brume la dit déjà : sur l'île, la main seule (hush ; la
// consigne reste pour la bulle « Me montrer », quand Brume est hors de vue ; choix de l'auteur, 13 oct.)
const CLAIM = [
  { target: 'île:brume', text: COACH.claim.brume, hush: true },
  { target: '.g-modal__close, .world__sheet-backdrop .world__link', text: COACH.claim.sheet },
  { target: '[data-coach="harvest-close"]', text: COACH.claim.harvest }
];
// Ce qui demande un élément du Grimoire (le plan de son bâtiment ; La Source, à découvrir) : la consigne, et pour quoi
// l'Encre est offerte
const PLAN_INTRO = COACH.book.plans;
const PLAN_WHY = COACH.book.why;
// La leçon du coach à une étape de l'île (la quête active : { id, done, short, plan }), ou null. plan : l'élément que
// le bâtiment de la quête demande et qui n'est pas encore écrit : la récompense à réclamer auprès de
// Brume, sinon les gestes de la quête
export function islandLesson(quest) {
  if (!quest || (!quest.done && !LESSONS[quest.id])) return null;
  if (quest.done) return { id: 'claim', mode: 'world', steps: CLAIM };
  // Le bâtiment de la quête demande un élément pas encore écrit (son plan : le Brasier du feu de camp) : au Grimoire
  if (quest.plan) {
    const intro = PLAN_INTRO[quest.id] ? PLAN_INTRO[quest.id](quest.plan) : COACH.book.plan(quest.plan);
    return { id: `plan-${quest.id}`, mode: 'infinite', steps: bookSteps(intro, quest.id in PLAN_WHY ? PLAN_WHY[quest.id] : PLAN_WHY.default) };
  }
  if (quest.short && SHORT[quest.id]) return { id: `short-${quest.id}`, mode: 'world', steps: [SHORT[quest.id]] };
  // (l'enclos : deux piquets à la main, puis le reste d'un trait)
  const steps = quest.id === 'clotures' && (quest.have || 0) >= BY_HAND ? LESSONS['clotures-trait'] : LESSONS[quest.id];
  const lesson = { id: `quest-${quest.id}`, mode: BOOK_LESSONS.has(quest.id) ? 'infinite' : 'world', steps };
  return COUNTED.has(quest.id) ? { ...lesson, once: true, tally: quest.need ? { have: quest.have || 0, need: quest.need } : null } : lesson;
}

// Étapes 2 (sur l'île) à 5 : la quête active de Brume ({ id, done }, vue de l'île) dit où l'on en est. Rend une scène,
// la main sur la Récolte, des répliques (ids du guide : chacune n'est dite qu'une fois), la fin ; ou null
export function islandStep({ state, quest }) {
  if (state.skipped || state.finished || !state.registered || !state.named || !quest) return null;
  const seen = new Set(state.seen);
  const at = PROLOGUE.indexOf(quest.id);
  // Après la chaîne guidée existante, l'étape « Le Campement » clôt encore le tutoriel global.
  if (at < 0) return seen.has('campement') ? { phase: 'finish' } : { phase: 'scene', scene: 'campement' };
  const lines = [];
  // Une quête accomplie : la première se réclame auprès de Brume (dit une fois) ; ensuite, ses répliques lues, la
  // récompense arrive seule (choix de l'auteur, 11 oct. : App, story.js, autoClaim)
  if (quest.done && quest.id === CLAIM_TAUGHT) lines.push('claim');
  // L'arrivée sur l'île : tout dort, la première page est au Grimoire
  if (quest.id === 'pages') return { phase: 'lines', lines: quest.done ? lines : ['ile'] };
  // Ce que la mer a rendu, puis le vrai feu (le Brasier déjà écrit au Grimoire ; un ancien parcours y retourne). La nuit
  // vient ensuite, seule, avant qu'Hermine n'arrive au matin.
  if (quest.id === 'ramasser') return { phase: 'lines', lines: quest.done ? lines : ['epaves'] };
  if (quest.id === 'feu') return { phase: 'lines', lines: quest.done ? ['flambe'] : [quest.plan ? 'cendres' : 'feu-pret'] };
  // La première nuit : la scène de Brume près du feu, puis on explore seul, et on dort (l'action « Dormir »)
  if (quest.id === 'nuit') return seen.has('nuit') ? { phase: 'sleep' } : { phase: 'scene', scene: 'nuit' };
  // Le jour d'Hermine (choix de l'auteur, 11 oct.). Au réveil, elle nage au pied de son Ponton, un « ! » au-dessus : on la
  // touche, sa scène se joue (choix de l'auteur, 12 oct. ; App, story.js : islandAct) ; sa caisse échouée
  // (sa scène vue, un « ! » au-dessus d'elle : on la touche, elle parle de sa caisse ; vu : « aster-caisse », choix de
  // l'auteur, 11 oct. : on va vers chaque personnage, il ne parle pas tout seul)
  if (quest.id === 'caisse') {
    if (!seen.has('recolte')) return { phase: 'lines', lines: [], lesson: 'aster-eau' };
    if (!quest.done && !seen.has('aster-caisse')) return { phase: 'lines', lines: [], lesson: 'aster-caisse' };
    return { phase: 'lines', lines: quest.done ? ['tresors', 'rend'] : ['caisse'] };
  }
  // Sa longue-vue choisit son camp (vu : « longue-vue ») ; puis sa Récolte
  if (quest.id === 'recolte') {
    if (!seen.has('longue-vue')) return { phase: 'lines', lines: [], lesson: 'longue-vue' };
    return quest.done ? { phase: 'lines', lines: ['chaine', 'bois-ponton'] } : { phase: 'harvest', lines: ['rivage'] };
  }
  if (quest.id === 'premier-ponton') return { phase: 'lines', lines: quest.done ? ['ponton-tient', 'ponton-promesse'] : ['ponton-bois'] };
  // Le chemin entre son camp et le nôtre
  if (quest.id === 'chemin-aster') return { phase: 'lines', lines: quest.done ? ['voisins'] : ['chemin-camps', 'chemin-pieds'] };
  // Ses quatre piquets, en travers du passage des égarés (BARRAGE) : Brume vous dit à quoi ils servent
  if (quest.id === 'clotures') return { phase: 'lines', lines: quest.done ? ['chez-nous'] : ['joli-camp', 'egares-nuit', 'egares-nord', 'cloture-deux'] };
  // Le soir : autour du feu, personne ne sait cuisiner (Marcelle viendra au matin) ; la deuxième nuit, près de Brume, et
  // sa scène quand on la touche pour dormir (VEILLEE : les égarés butent sur la clôture)
  if (quest.id === 'veille') return { phase: 'sleep', lines: ['cuisiner', 'manger', 'debrouiller'], line: 'soir' };
  // Le jour de Marcelle (choix de l'auteur, 11 oct.). Sa scène au réveil ; un « ! » au-dessus d'elle : on la touche, on
  // fait connaissance (vu : « cannelle-parle ») ; ses coquillages, sa soupe ; un fil d'histoire, sans tâche
  if (quest.id === 'soupe') {
    if (!seen.has('cannelle')) return { phase: 'scene', scene: 'cannelle' };
    if (!quest.done && !seen.has('cannelle-parle')) return { phase: 'lines', lines: [], lesson: 'cannelle-parle' };
    return { phase: 'lines', lines: quest.done ? ['soupe', 'bulles-reviennent', 'brume-avale', 'brume-retient', ...lines] : ['faim-aster', 'faim-cannelle', 'faim-bulle', 'bulle'] };
  }
  // Des caquets sur l'eau : la longue-vue d'Hermine (vu : « cage-vue ») voit la cage dériver jusqu'au bout de la plage ;
  // ouverte, les poules s'échappent
  if (quest.id === 'cage') {
    if (!quest.done && !seen.has('cage-vue')) return { phase: 'lines', lines: ['caquets-eau'], lesson: 'cage-vue' };
    return { phase: 'lines', lines: quest.done ? ['doucement', ...lines] : ['mes-filles'] };
  }
  // On les attrape (la chasse aux poules, une scène à part : vu « poule:<id> » ; game/stages.js, HENS), puis on les
  // nourrit (la scène finit sur « Les voilà toutes ! » : l'île passe à leur faim, choix de l'auteur, 13 oct.)
  if (quest.id === 'poules') {
    if (!quest.done && !HENS.every(id => seen.has(`poule:${id}`))) return { phase: 'lines', lines: [], lesson: 'attraper' };
    return { phase: 'lines', lines: quest.done ? lines : ['deux-vivres', ...(quest.short ? ['recolte-nourrit'] : [])] };
  }
  // Leur poulailler ; le soir à trois autour du feu, la troisième nuit
  if (quest.id === 'poulailler') return { phase: 'lines', lines: quest.done ? ['un-coq', 'village', ...lines] : ['un-toit'] };
  // Son abri, puis son enclos (choix de l'auteur, 13 oct.)
  if (quest.id === 'abri-cannelle') return { phase: 'lines', lines: quest.done ? ['toit-a-moi'] : ['marmite', 'se-plaint'] };
  if (quest.id === 'enclos-cannelle') return { phase: 'lines', lines: quest.done ? ['en-ville'] : ['cuisines', 'casseroles'] };
  if (quest.id === 'nuit-cannelle') return { phase: 'sleep', lines: ['a-table', 'trois-feu', 'chaise'], line: 'soir-trois' };
  // Le jour de Jovin : il sort de la brume, un « ! » au-dessus ; touché, sa scène (choix de l'auteur, 13 oct.)
  if (quest.id === 'deco') {
    if (!seen.has('rivet')) return { phase: 'lines', lines: [], lesson: 'rivet-brume' };
    return { phase: 'lines', lines: quest.done ? lines : ['puzzle', 'or'] };
  }
  // Ses trois torches (choix de l'auteur, 13 oct.)
  if (quest.id === 'torches-rivet') return { phase: 'lines', lines: quest.done ? ['torches-tiennent'] : ['torches-idee'] };
  // Le soir à quatre (choix de l'auteur, 13 oct. : textes validés) : Jovin autour du feu, Marcelle inquiète pour son
  // Pierrot, la veille du jour où on le trouve ; la quatrième nuit
  if (quest.id === 'nuit-rivet') return { phase: 'sleep', lines: ['quatre-feu', 'souci'], line: 'soir-quatre' };
  // Le jour de Pierrot (choix de l'auteur, 14 oct.) : au matin, Hermine voit une planche sur la vague, un « ! » au-dessus
  // d'elle (vu : « planche ») ; la planche s'échoue, Pierrot endormi dessus : on le réveille
  if (quest.id === 'eveil-ondin' && !quest.done && !seen.has('planche')) return { phase: 'lines', lines: ['planche-vue'], lesson: 'planche-vue' };
  if (quest.id === 'souvenir-ondin') {
    if (!seen.has('ondin')) return { phase: 'scene', scene: 'ondin' };
    // (la Pluie écrite : elle tombe sur l'île, la baguette frémit)
    return { phase: 'lines', lines: quest.done ? ['pluie-brume', 'pluie-ondin', ...lines] : ['baguette', 'ruban'] };
  }
  if (quest.id === 'puits-ondin') return { phase: 'lines', lines: quest.done ? ['chut', 'produit', ...lines] : [] };
  // Pierrot glisse dans l'herbe mouillée avec ses seaux : le premier chemin
  if (quest.id === 'chemin') return { phase: 'lines', lines: quest.done ? ['sentier', ...lines] : ['glisse', 'pierres'] };
  return { phase: 'lines', lines };
}
