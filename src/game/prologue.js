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
// ctx : { state, loggedIn, elements }
export function prologueStep({ state, loggedIn, elements }) {
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
  return { phase: 'greve' };
}

// Les quêtes guidées (serveur : services/quests.js). La première séquence est désormais nette : Vent, six trouvailles,
// Brasier, feu, la première nuit (seul), puis Aster et sa Récolte. La suite conserve provisoirement la chaîne existante.
const PROLOGUE = ['pages', 'ramasser', 'feu', 'nuit', 'recolte', 'veille', 'soupe', 'poules', 'deco', 'achat-source', 'eveil-ondin', 'souvenir-ondin', 'puits-ondin', 'chemin'];
export const inPrologue = id => PROLOGUE.includes(id);
// La quête id est dans le prologue, au plus tard à l'étape ref (encore à faire ou à réclamer)
export const upTo = (id, ref) => inPrologue(id) && PROLOGUE.indexOf(id) <= PROLOGUE.indexOf(ref);

// Les commandes de l'île pendant le tutoriel (choix de l'auteur, 10 oct. : grisées, pas masquées) : seules celles qu'une
// leçon a déjà montrées répondent ; la Récolte avec la sienne (Aster), le tracé des chemins avec le sien. Rend null
// (hors du tutoriel : tout répond) ou { harvest, road } (vrai : la commande répond ; les autres sont grisées).
// quest : l'identifiant de la quête active
export function islandTaught({ tutorial, quest }) {
  if (!tutorial || !inPrologue(quest)) return null;
  return { harvest: !upTo(quest, 'nuit'), road: quest === 'chemin' };
}
// La quête où chaque scène de l'île se joue, et les scènes d'avant l'île (vues avant le compte)
// La première nuit se passe seul avec Brume ; Aster arrive au matin et ouvre son propre tutoriel par la Récolte ; les
// autres personnages viendront ensuite, chacun avec sa séquence.
const SCENE_AT = { nuit: 'nuit', recolte: 'recolte', cannelle: 'soupe', rivet: 'deco', ondin: 'souvenir-ondin' };
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
    { target: '.book-view:has(.book-view__hot[data-marked]) .book-view__shelf', text: 'Voici la page qui manque : son énigme dit ce qu’il faut mêler. Touche ici les bons éléments, ils iront dans l’Athanor.', free: true },
    { target: '.book-view__hot[data-marked] .book-view__spot[data-spot="ink"]', text: `Son énigme dit ce qu’il faut mêler : touche ces éléments en bas. Bloqué ? L’Encre est offerte ${why} : elle révèle un ingrédient.`, free: true },
    // (l'Encre a parlé : la main va sur l'ingrédient révélé, pas sur toute l'étagère)
    { target: '.book-view:has(.book-view__hot[data-marked]) .book-view__shelf .tile.is-ink', text: 'L’Encre a révélé cet ingrédient : touche-le, il va dans l’Athanor.', free: true },
    // (le premier posé, sur une page guidée : la main va sur celui qui manque, le même s'il entre deux fois ; Feu et Feu
    // pour le Brasier. BookView/shelf.js : nextPick)
    { target: '.book-view:has(.book-view__hot[data-marked]) .book-view__shelf .tile[data-next]:not(.is-ink)', text: 'Encore un : touche-le, il rejoint le premier dans l’Athanor.', free: true },
    FUSE
  ];
}
// Dans la fiche d'un chantier : le bouton pour bâtir, seulement actif (le coach ne montre jamais un bouton grisé : s'il
// manque de quoi payer, la leçon mène d'abord à la Récolte, SHORT)
const BUILD = '[data-coach="site-build"]:not(:disabled)';
// « Transmuer », dans l'Athanor (le dernier geste des pages à écrire)
const FUSE = { target: '.athanor__fuse:not(:disabled)', text: 'Les éléments sont dans l’Athanor : touche « Transmuer ». Si ce n’est pas le bon mélange, l’Athanor te le dit : essaie un autre élément.', free: true };
const LESSONS = {
  // La première quête, depuis l'île : le Grimoire (le coach montre son onglet), l'Air deux fois, « Transmuer » (la
  // consigne est dite par le Grimoire : LINES.vent)
  pages: [{ target: '.book-view__shelf [data-name="Air"]' }, FUSE],
  ramasser: [
    { target: 'île:trouvaille', text: 'La mer a rendu du bois flotté, des coquillages, des galets : touche-en un.' },
    { target: '.world__tip-btn[data-pick^="deposit:greve-"]', text: 'Touche « Ramasser » : il ira dans tes réserves, en haut. Prends les six trouvailles du rivage pour préparer le camp.' }
  ],
  recolte: [{ target: '.world__play', text: 'Touche la Récolte : l’île t’y donne de quoi bâtir.' }],
  // La première nuit : dormir, c'est toucher Brume (WorldView, draw/brume.js : sleep), qui veille ; la deuxième aussi
  nuit: [{ target: 'île:brume', text: 'Touche Brume pour dormir : elle veille sur le feu.' }],
  veille: [{ target: 'île:brume', text: 'Touche Brume pour dormir : elle veille sur le feu.' }],
  // Le matin d'Aster : elle attend dans les vagues (WorldView : waiting) ; la toucher lance sa scène
  'recolte-eau': [{ target: 'île:eau', text: 'Quelqu’un dans les vagues : touche-la.' }],
  feu: [
    { target: 'île:site:foyer', text: 'Le chantier du feu de camp est ici, sur la plage de Brumelune : touche-le.' },
    { target: tipOf('site:foyer'), text: 'Touche « Bâtir ».' },
    { target: BUILD, text: 'Quatre bois flottés, deux galets : bâtis le feu de camp.' }
  ],
  // (toucher la bulle d'un besoin le comble : WorldView/folk.js, tapNeed)
  soupe: [
    { target: 'île:besoin:foyer', text: 'Cannelle a faim : touche la bulle au-dessus d’elle, tu lui donnes à manger.' }
  ],
  // La cage, ses poules affamées, la fiche de l'une d'elles ; nourrir (2 vivres : seulement s'il y en a, sinon la fiche
  // dit où en trouver)
  poules: [
    { target: 'île:cage', text: 'Des caquets, sous les rochers : touche la cage.' },
    { target: tipOf('cage'), text: 'Touche « L’ouvrir ».' },
    { target: 'île:faim', text: 'Elles ont faim : touche la bulle d’une poule pour la nourrir (deux vivres). Nourrie, elle pondra.' }
  ],
  deco: [
    { target: 'île:site:foyer', text: 'L’établi est au Foyer : touche-le.' },
    { target: tipOf('site:foyer'), text: 'Touche « Sa fiche » pour entrer au Foyer.' },
    { target: '[aria-label="Ouvrir l’établi"]', text: 'L’établi de Rivet : ouvre-le pour assembler ta première création.' }
  ],
  'achat-source': [
    { target: 'île:quartier:source', text: 'La Source est juste là : touche son panneau.' },
    { target: tipOf('zone:source'), text: 'Touche « Voir le quartier ».' },
    { target: '[data-coach="zone-buy"]', text: 'Touche ce bouton : La Source s’ouvre.' }
  ],
  'eveil-ondin': [
    { target: 'île:habitant:puits', text: 'Ondin dort contre son rocher : touche-le.' },
    { target: tipOf('vil:puits'), text: 'Touche « Le réveiller » : parle-lui doucement.' }
  ],
  // Dans le Grimoire (le coach montre d'abord son onglet, depuis l'île) : le ruban, puis la page marquée, son énigme
  // et l'Encre. Les recettes restent au serveur : le Livre guide par ses pages, jamais par la réponse. Sur la page, rien
  // n'est bloqué (l'étagère doit rester sous le doigt)
  'souvenir-ondin': bookSteps('Le Puits naît de mélanges, page après page : suis le ruban, il te montre quoi mêler dans l’Athanor.', 'pendant que tu aides Ondin'),
  'puits-ondin': [
    { target: 'île:site:puits', text: 'Le chantier du Puits : touche-le.' },
    { target: tipOf('site:puits'), text: 'Touche « Bâtir ».' },
    { target: BUILD, text: 'Tout est réuni : bâtis le Puits.' }
  ],
  // Le premier chemin : le bouton des chemins, les cases à toucher une à une du Puits au sentier du Feu (la main suit
  // les pointillés ; rien n'est bloqué : l'île doit pouvoir bouger), puis « Tracer » quand le tracé les relie
  // (roads.js : roadGuide, data-linked)
  chemin: [
    { target: '[data-coach="road"]:not(.is-on)', text: 'Touche ce bouton : il ouvre le tracé des chemins.' },
    { target: 'île:chemin', text: 'Touche les cases en pointillés, une à une, du Puits jusqu’au sentier. Glisse pour bouger l’île ; un appui long puis glisse trace tout un trait.', free: true },
    { target: '[data-coach="road-go"][data-linked]:not(:disabled)', text: 'Le Puits rejoint le Feu : touche « Tracer ». Les premières pierres sont offertes.' }
  ]
};
// Ce qui se paie manque (quest.short : questShort) : la Récolte d'abord, qui en donne
const SHORT = {
  feu: { target: 'île:trouvaille', text: 'Il manque du bois ou des galets pour le feu : ramasse les trouvailles encore visibles sur la plage de Brumelune.' },
  soupe: { target: '.world__play', text: 'Pas assez de vivres pour sa soupe : touche la Récolte, l’île en donne.' },
  poules: { target: '.world__play', text: 'Deux vivres pour nourrir une poule : touche la Récolte, ou ramasse des coquillages sur le rivage.' },
  'puits-ondin': { target: '.world__play', text: 'Il manque de quoi bâtir le Puits : touche la Récolte, l’île en donne.' }
};
// La quête active demande de payer (le feu, la soupe, une poule, le Puits) et le stock n'y suffit pas encore (ce qui
// attend dans les bâtiments compte : stock, celui que montrent les fiches). state : la vue de l'île
export function questShort(quest, state, stock) {
  if (!quest || quest.done || !state || !SHORT[quest.id]) return false;
  const lacks = cost => Object.entries(cost || {}).some(([r, n]) => (stock[r] || 0) < n);
  if (quest.id === 'soupe') {
    const cannelle = (state.villagers || []).find(v => v.id === 'foyer');
    const need = cannelle && (cannelle.needs || []).find(n => n.id === 'manger');
    return Boolean(need && need.refill && lacks(need.cost));
  }
  // (la cage s'ouvre sans rien payer : seul le repas compte)
  if (quest.id === 'poules') return !(state.camp || []).some(c => c.art === 'cage_coincee') && Boolean(state.beasts && lacks(state.beasts.cost));
  const site = (state.sites || []).find(s => s.id === (quest.id === 'feu' ? 'foyer' : 'puits'));
  return Boolean(site && site.next && !site.level && lacks(site.next.cost));
}

// Le plan (un élément du Grimoire) que demande le bâtiment de la quête et qui n'est pas encore écrit, ou null.
// state : la vue de l'île
export function questPlan(quest, state) {
  if (!quest || quest.done || !state || !PLAN_INTRO[quest.id]) return null;
  // (au tutoriel, La Source se découvre en écrivant son élément)
  if (quest.id === 'achat-source') {
    const zone = ((state.map && state.map.zones) || []).find(z => z.id === 'source');
    return zone && !zone.owned && zone.plan && !zone.planOwned ? zone.plan : null;
  }
  const site = (state.sites || []).find(s => s.id === (quest.id === 'feu' ? 'foyer' : 'puits'));
  return site && !site.level && site.next && site.next.plan && !site.next.planOwned ? site.next.plan : null;
}

// Les leçons qui se jouent dans le Grimoire (les autres, sur l'île)
const BOOK_LESSONS = new Set(['pages', 'souvenir-ondin']);
// La récompense : Brume, sur l'île ; si une fiche est encore ouverte, d'abord la refermer ; au bilan d'une Récolte,
// revenir sur l'île (jamais « Niveau 2 » pendant le tutoriel)
const CLAIM = [
  { target: 'île:brume', text: 'Touche Brume : ta récompense t’attend.' },
  { target: '.g-modal__close, .world__sheet-backdrop .world__link', text: 'Referme cette fiche : Brume t’attend avec ta récompense.' },
  { target: '[data-coach="harvest-close"]', text: 'Retourne sur l’île : Brume t’attend avec ta récompense.' }
];
// Ce qui demande un élément du Grimoire (le plan de son bâtiment ; La Source, à découvrir) : la consigne, et pour quoi
// l'Encre est offerte
const PLAN_INTRO = {
  feu: plan => `Le feu de camp naît d’un mélange : fais naître « ${plan} » dans l’Athanor. Le ruban du Grimoire te montre quoi mêler.`,
  'puits-ondin': plan => `Le Puits naît d’un mélange : fais naître « ${plan} » dans l’Athanor. Le ruban du Grimoire te montre quoi mêler.`,
  'achat-source': plan => `La Source dort sous la brume : mêle les bons éléments dans l’Athanor pour faire naître « ${plan} », et elle se lèvera. Suis le ruban.`
};
const PLAN_WHY = { 'achat-source': 'pour la découvrir' };
// La leçon du coach à une étape de l'île (la quête active : { id, done, short, plan }), ou null. plan : l'élément que
// le bâtiment de la quête demande et qui n'est pas encore écrit : la récompense à réclamer auprès de
// Brume, sinon les gestes de la quête
export function islandLesson(quest) {
  if (!quest || (!quest.done && !LESSONS[quest.id])) return null;
  if (quest.done) return { id: 'claim', mode: 'world', steps: CLAIM };
  // Le bâtiment de la quête demande un élément pas encore écrit (son plan : le Brasier du feu de camp) : au Grimoire
  if (quest.plan) {
    const intro = PLAN_INTRO[quest.id] ? PLAN_INTRO[quest.id](quest.plan) : `Ce chantier naît d’un mélange : fais naître « ${quest.plan} » dans l’Athanor. Suis le ruban.`;
    return { id: `plan-${quest.id}`, mode: 'infinite', steps: bookSteps(intro, PLAN_WHY[quest.id] || 'pour ce chantier') };
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
  // Une quête accomplie se réclame auprès de Brume (dit une fois)
  if (quest.done) lines.push('claim');
  // L'arrivée sur l'île : tout dort, la première page est au Grimoire
  if (quest.id === 'pages') return { phase: 'lines', lines: quest.done ? lines : ['ile'] };
  // Ce que la mer a rendu, puis le vrai feu. La nuit vient ensuite, seule, avant qu'Aster n'arrive au matin.
  if (quest.id === 'ramasser') return { phase: 'lines', lines: quest.done ? lines : ['epaves'] };
  if (quest.id === 'feu') return { phase: 'lines', lines: quest.done ? ['flambe', ...lines] : ['cendres'] };
  // La première nuit : la scène de Brume près du feu, puis on explore seul, et on dort (l'action « Dormir »)
  if (quest.id === 'nuit') return seen.has('nuit') ? { phase: 'sleep' } : { phase: 'scene', scene: 'nuit' };
  // Le jour d'Aster (choix de l'auteur, 10 oct.) : au matin, elle attend dans les vagues ; on la touche, sa scène se
  // joue ; elle débarque et montre son coin, puis sa Récolte
  if (quest.id === 'recolte') {
    if (!seen.has('recolte')) return { phase: 'lines', lines: ['aube'], lesson: 'recolte-eau' };
    return quest.done ? { phase: 'lines', lines: ['chaine', ...lines] } : { phase: 'harvest', lines: ['coin'] };
  }
  // Le soir d'Aster (le jour a passé jusqu'au couchant, world/tutoClock.js) : sa longue-vue montre l'îlot au large, puis
  // son chantier ; et la deuxième nuit : on dort près de Brume ; Cannelle viendra au matin
  if (quest.id === 'veille') return { phase: 'sleep', lines: ['vue', 'mener'], line: 'soir' };
  if (quest.id === 'soupe') {
    if (!seen.has('cannelle')) return { phase: 'scene', scene: 'cannelle' };
    return { phase: 'lines', lines: quest.done ? ['soupe', ...lines] : ['bulle'] };
  }
  // (v6) Les poules de la cuisine du bord, coincées sous les rochers
  if (quest.id === 'poules') return { phase: 'lines', lines: quest.done ? ['ponte', ...lines] : ['caquets'] };
  if (quest.id === 'deco') {
    if (!seen.has('rivet')) return { phase: 'scene', scene: 'rivet' };
    return { phase: 'lines', lines: quest.done ? lines : ['puzzle', 'or'] };
  }
  // Cannelle s'inquiète pour son petit-neveu ; Aster entend ronfler une source
  if (quest.id === 'achat-source') return { phase: 'lines', lines: quest.done ? lines : ['souci', 'source'] };
  if (quest.id === 'souvenir-ondin') {
    if (!seen.has('ondin')) return { phase: 'scene', scene: 'ondin' };
    return { phase: 'lines', lines: quest.done ? lines : ['baguette', 'ruban'] };
  }
  if (quest.id === 'puits-ondin') return { phase: 'lines', lines: quest.done ? ['chut', 'produit', ...lines] : [] };
  // Ondin glisse dans l'herbe mouillée avec ses seaux : le premier chemin
  if (quest.id === 'chemin') return { phase: 'lines', lines: quest.done ? ['sentier', ...lines] : ['glisse', 'pierres'] };
  return { phase: 'lines', lines };
}
