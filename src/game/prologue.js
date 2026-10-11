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
  // Le Brasier dans la même visite (choix de l'auteur, 11 oct.) : la nuit tombe, il faudra un feu ; le joueur ne va sur
  // l'île qu'une fois, le livre écrit. (Un joueur déjà passé sur l'île : son chantier du feu le mène au Grimoire)
  if (!elements.includes('Brasier') && (!quest || quest === 'pages')) return { phase: 'brasier' };
  return { phase: 'greve' };
}

// Les quêtes guidées (serveur : services/quests.js). La première séquence est désormais nette : Vent, six trouvailles,
// Brasier, feu, la première nuit (seul), puis le jour d'Aster (sa caisse, sa Récolte, son Ponton, le chemin entre les deux
// camps, ses quatre piquets) et la deuxième nuit. La suite conserve provisoirement la chaîne existante.
export const PROLOGUE = ['pages', 'ramasser', 'feu', 'nuit', 'caisse', 'recolte', 'premier-ponton', 'chemin-aster', 'clotures', 'veille', 'soupe', 'cage', 'poules', 'poulailler', 'nuit-cannelle', 'deco', 'eveil-ondin', 'souvenir-ondin', 'puits-ondin', 'chemin'];
export const inPrologue = id => PROLOGUE.includes(id);
// La quête id est dans le prologue, au plus tard à l'étape ref (encore à faire ou à réclamer)
export const upTo = (id, ref) => inPrologue(id) && PROLOGUE.indexOf(id) <= PROLOGUE.indexOf(ref);

// Les commandes de l'île pendant le tutoriel (choix de l'auteur, 10 oct. : grisées, pas masquées) : seules celles qu'une
// leçon a déjà montrées répondent ; la Récolte avec la sienne (Aster), le tracé des chemins avec le sien. Rend null
// (hors du tutoriel : tout répond) ou { harvest, road } (vrai : la commande répond ; les autres sont grisées).
// quest : l'identifiant de la quête active
export function islandTaught({ tutorial, quest }) {
  if (!tutorial || !inPrologue(quest)) return null;
  // (le tracé des chemins s'apprend avec Aster, entre son camp et le nôtre)
  return { harvest: !upTo(quest, 'nuit'), road: !upTo(quest, 'premier-ponton') };
}
// La quête où chaque scène de l'île se joue, et les scènes d'avant l'île (vues avant le compte)
// La première nuit se passe seul avec Brume ; Aster arrive au matin et ouvre son propre tutoriel par la Récolte ; les
// autres personnages viendront ensuite, chacun avec sa séquence.
const SCENE_AT = { nuit: 'nuit', recolte: 'caisse', cannelle: 'soupe', rivet: 'deco', ondin: 'souvenir-ondin' };
const BEFORE_ISLAND = ['naufrage', 'arrivee', 'souffle'];
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
// Les gestes du Grimoire vers un élément à écrire (la quête d'Ondin, le plan d'un bâtiment) : le ruban, l'Encre offerte
// de la page marquée, les éléments à poser, « Transmuer ». intro : ce que dit le ruban ; why : pendant quoi l'Encre est
// offerte (serveur : quests.GUIDED_INK)
function bookSteps(intro, why) {
  return [
    { target: '.book-view__ariane', text: intro },
    { target: '.book-view:has(.book-view__hot[data-marked]) .book-view__shelf', text: COACH.book.page, free: true },
    { target: '.book-view__hot[data-marked] .book-view__spot[data-spot="ink"]', text: COACH.book.ink(why), free: true },
    // (l'Encre a parlé : la main va sur l'ingrédient révélé, pas sur toute l'étagère)
    { target: '.book-view:has(.book-view__hot[data-marked]) .book-view__shelf .tile.is-ink', text: COACH.book.inked, free: true },
    // (le premier posé, sur une page guidée : la main va sur celui qui manque, le même s'il entre deux fois ; Feu et Feu
    // pour le Brasier. BookView/shelf.js : nextPick)
    { target: '.book-view:has(.book-view__hot[data-marked]) .book-view__shelf .tile[data-next]:not(.is-ink)', text: COACH.book.next, free: true },
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
  // Le jour d'Aster (choix de l'auteur, 11 oct.) : chaque geste porte un « ! » au-dessus de ce qu'il faut toucher
  // (WorldView : marks) ; toucher Aster lance ce que l'étape demande (App, story.js : islandAct)
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
  // Ses quatre piquets : toucher Aster ouvre l'établi sur la réserve ; une case dorée (seulement celles du passage des
  // égarés : BARRAGE), « Poser ici » ; la pose reprend tant qu'il en reste (WorldView, workshop.js : CHAIN_LESSONS)
  clotures: [
    { target: 'île:habitant:ponton', text: COACH.clotures.aster },
    { target: '.bench__btn--place', text: COACH.clotures.reserve },
    { target: 'île:pose', text: COACH.clotures.cells },
    { target: '[data-coach="craft-confirm"]:not(:disabled)', text: COACH.clotures.confirm }
  ],
  // Déplacer une création : l'appui long, « Déplacer », une autre case dorée (le jour de Rivet, avec les bâtiments :
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
  // Le jour de Cannelle (choix de l'auteur, 11 oct.) : sa scène vue, un « ! » au-dessus d'elle (on va vers elle) ;
  // ses coquillages d'abord, puis sa bulle (toucher la bulle d'un besoin le comble : WorldView/folk.js, tapNeed). Le coach
  // montre le geste le plus avancé à l'écran : tant qu'un coquillage attend sur le rivage, c'est lui
  'cannelle-parle': [{ target: 'île:habitant:foyer', text: COACH['cannelle-parle'].cannelle }],
  soupe: [
    { target: 'île:besoin:foyer', text: COACH.soupe.bulle },
    { target: 'île:trouvaille:coquillage', text: COACH.soupe.coquillage },
    { target: '.world__tip-btn[data-pick^="deposit:greve-coquillage"]', text: COACH.ramasser.ramasser }
  ],
  // La longue-vue d'Aster voit la cage dériver (la leçon d'hier, rappelée) ; la cage échouée, on l'ouvre d'un toucher
  // (App, islandStory.js : islandAct) ; les poules échappées, une à la fois (WorldView, henCatch.js) ; puis la bulle de
  // faim de chacune (deux vivres)
  'cage-vue': [{ target: 'île:habitant:ponton', text: COACH['cage-vue'].aster }],
  cage: [{ target: 'île:cage', text: COACH.cage.cage }],
  attraper: [{ target: 'île:poule', text: COACH.attraper.poule }],
  poules: [{ target: 'île:faim', text: COACH.poules.hungry }],
  // Leur poulailler, la leçon des annexes : le Feu, sa fiche, « Annexes », le Poulailler (offert), une case dorée près
  // du coin de Cannelle, « Poser ici »
  poulailler: [
    { target: 'île:site:foyer', text: COACH.poulailler.site },
    { target: tipOf('site:foyer'), text: COACH.poulailler.sheet },
    { target: '[data-coach="tab-annexes"]', text: COACH.poulailler.tab },
    { target: '[data-coach="annex-poulailler"]:not(:disabled)', text: COACH.poulailler.annex },
    { target: 'île:pose', text: COACH.poulailler.cells },
    { target: '[data-coach="annex-confirm"]:not(:disabled)', text: COACH.poulailler.confirm }
  ],
  'nuit-cannelle': [{ target: 'île:brume', text: COACH.sleep }],
  deco: [
    { target: 'île:site:foyer', text: COACH.deco.site },
    { target: tipOf('site:foyer'), text: COACH.deco.sheet },
    { target: '[aria-label="Ouvrir l’établi"]', text: COACH.deco.bench }
  ],
  'eveil-ondin': [
    { target: 'île:habitant:puits', text: COACH['eveil-ondin'].ondin },
    { target: tipOf('vil:puits'), text: COACH['eveil-ondin'].wake }
  ],
  // Dans le Grimoire (le coach montre d'abord son onglet, depuis l'île) : le ruban, puis la page marquée, son énigme
  // et l'Encre. Les recettes restent au serveur : le Livre guide par ses pages, jamais par la réponse. Sur la page, rien
  // n'est bloqué (l'étagère doit rester sous le doigt)
  'souvenir-ondin': bookSteps(COACH['souvenir-ondin'].ariane, COACH['souvenir-ondin'].why),
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
  'premier-ponton': { target: 'île:habitant:ponton', text: COACH.short['premier-ponton'] }
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

// Le passage des égarés vers le camp d'Aster, sur une île à la plage (serveur : world/places.js, BEACH : le Ponton en
// (92, 96), contre l'épave ; world/camp.js, son camp autour) : ils sortent de la brume au nord. Les quatre piquets se
// plantent en travers, sur cette ligne (WorldView, workshop.js : ses seules cases dorées pendant la leçon) ; le soir,
// l'égaré que montre Brume part de EGARE_FROM vers le Ponton et bute dessus (folk.js, strayDemo)
export const BARRAGE = [{ x: 89, y: 93 }, { x: 90, y: 93 }, { x: 91, y: 93 }, { x: 92, y: 93 }];
export const EGARE_FROM = { x: 90, y: 88 };
// Les leçons qui se jouent dans le Grimoire (les autres, sur l'île)
const BOOK_LESSONS = new Set(['pages', 'souvenir-ondin']);
// La récompense : Brume, sur l'île ; si une fiche est encore ouverte, d'abord la refermer ; au bilan d'une Récolte,
// revenir sur l'île (jamais « Niveau 2 » pendant le tutoriel)
const CLAIM = [
  { target: 'île:brume', text: COACH.claim.brume },
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
    return { id: `plan-${quest.id}`, mode: 'infinite', steps: bookSteps(intro, PLAN_WHY[quest.id] || PLAN_WHY.default) };
  }
  if (quest.short && SHORT[quest.id]) return { id: `short-${quest.id}`, mode: 'world', steps: [SHORT[quest.id]] };
  return { id: `quest-${quest.id}`, mode: BOOK_LESSONS.has(quest.id) ? 'infinite' : 'world', steps: LESSONS[quest.id] };
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
  // vient ensuite, seule, avant qu'Aster n'arrive au matin.
  if (quest.id === 'ramasser') return { phase: 'lines', lines: quest.done ? lines : ['epaves'] };
  if (quest.id === 'feu') return { phase: 'lines', lines: quest.done ? ['flambe'] : [quest.plan ? 'cendres' : 'feu-pret'] };
  // La première nuit : la scène de Brume près du feu, puis on explore seul, et on dort (l'action « Dormir »)
  if (quest.id === 'nuit') return seen.has('nuit') ? { phase: 'sleep' } : { phase: 'scene', scene: 'nuit' };
  // Le jour d'Aster (choix de l'auteur, 11 oct.). Sa scène d'abord, dès le réveil (elle sort de l'eau sur notre plage :
  // un personnage paraît par sa scène, puis sur l'île) ; sa caisse échouée
  // (sa scène vue, un « ! » au-dessus d'elle : on la touche, elle parle de sa caisse ; vu : « aster-caisse », choix de
  // l'auteur, 11 oct. : on va vers chaque personnage, il ne parle pas tout seul)
  if (quest.id === 'caisse') {
    if (!seen.has('recolte')) return { phase: 'scene', scene: 'recolte' };
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
  if (quest.id === 'clotures') return { phase: 'lines', lines: quest.done ? ['chez-nous'] : ['joli-camp', 'egares-nuit', 'egares-nord'] };
  // Le soir : un égaré sort de la brume et bute sur la clôture (Brume le montre) ; puis, autour du feu, personne ne sait
  // cuisiner (Cannelle viendra au matin) ; la deuxième nuit, près de Brume
  if (quest.id === 'veille') return { phase: 'sleep', lines: ['egare-la', 'cloture-voyez', 'aster-dormir', 'cloture-deux', 'cuisiner', 'manger', 'debrouiller'], line: 'soir' };
  // Le jour de Cannelle (choix de l'auteur, 11 oct.). Sa scène au réveil ; un « ! » au-dessus d'elle : on la touche, on
  // fait connaissance (vu : « cannelle-parle ») ; ses coquillages, sa soupe ; un fil d'histoire, sans tâche
  if (quest.id === 'soupe') {
    if (!seen.has('cannelle')) return { phase: 'scene', scene: 'cannelle' };
    if (!quest.done && !seen.has('cannelle-parle')) return { phase: 'lines', lines: [], lesson: 'cannelle-parle' };
    return { phase: 'lines', lines: quest.done ? ['soupe', 'bulles-reviennent', 'brume-avale', 'brume-retient', ...lines] : ['faim-aster', 'faim-cannelle', 'faim-bulle', 'bulle'] };
  }
  // Des caquets sur l'eau : la longue-vue d'Aster (vu : « cage-vue ») voit la cage dériver jusqu'au bout de la plage ;
  // ouverte, les poules s'échappent
  if (quest.id === 'cage') {
    if (!quest.done && !seen.has('cage-vue')) return { phase: 'lines', lines: ['caquets-eau'], lesson: 'cage-vue' };
    return { phase: 'lines', lines: quest.done ? ['doucement', ...lines] : ['mes-filles'] };
  }
  // On les attrape une à une (vu : « poule:<id> » ; game/stages.js, HENS), puis on les nourrit
  if (quest.id === 'poules') {
    if (!quest.done && !HENS.every(id => seen.has(`poule:${id}`))) return { phase: 'lines', lines: [], lesson: 'attraper' };
    return { phase: 'lines', lines: quest.done ? lines : ['tout-le-monde', 'deux-vivres', ...(quest.short ? ['recolte-nourrit'] : [])] };
  }
  // Leur poulailler ; le soir à trois autour du feu, la troisième nuit
  if (quest.id === 'poulailler') return { phase: 'lines', lines: quest.done ? ['un-coq', 'village', ...lines] : ['un-toit'] };
  if (quest.id === 'nuit-cannelle') return { phase: 'sleep', lines: ['a-table', 'trois-feu', 'chaise'], line: 'soir-trois' };
  if (quest.id === 'deco') {
    if (!seen.has('rivet')) return { phase: 'scene', scene: 'rivet' };
    return { phase: 'lines', lines: quest.done ? lines : ['puzzle', 'or'] };
  }
  if (quest.id === 'souvenir-ondin') {
    if (!seen.has('ondin')) return { phase: 'scene', scene: 'ondin' };
    return { phase: 'lines', lines: quest.done ? lines : ['baguette', 'ruban'] };
  }
  if (quest.id === 'puits-ondin') return { phase: 'lines', lines: quest.done ? ['chut', 'produit', ...lines] : [] };
  // Ondin glisse dans l'herbe mouillée avec ses seaux : le premier chemin
  if (quest.id === 'chemin') return { phase: 'lines', lines: quest.done ? ['sentier', ...lines] : ['glisse', 'pierres'] };
  return { phase: 'lines', lines };
}
