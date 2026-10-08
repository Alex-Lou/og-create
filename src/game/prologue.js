// Le tutoriel « Le Naufrage de l'Hirondelle » (HISTOIRE.md, § 9) : où en est le joueur, déduit de ce que le jeu sait
// déjà (compte, éléments du Grimoire, quête de Brume) ; l'appareil ne retient que ce qui ne se déduit pas : le
// prologue commencé ici, les scènes vues, l'avatar choisi et le nom écrit avant l'inscription, « Passer ».
// Les joueurs actuels ne le voient pas : il ne commence que pour un invité qui n'a encore que les quatre Souffles, et
// un compte ne le poursuit que s'il a été créé par lui (sur la page de garde du Grimoire).
import * as storage from '@/utils/storage';
import { BASE_ELEMENTS } from '@/utils/gameConstants';

const KEY = 'oc_prologue';
// Les trois premières pages de l'étape 1 (Vent, Pluie, Brasier) ouvrent le chapitre II
export const FIRST_PAGES = 3;

// look : l'avatar choisi sur la carte d'embarquement (game/sceneArt.js), gardé sur l'appareil jusqu'au compte, qui le
// garde ensuite (App, keepAvatar)
const blank = () => ({ started: false, skipped: false, registered: false, named: false, finished: false, name: null, look: null, seen: [] });

export function loadPrologue() {
  const saved = storage.load(KEY, null);
  return saved && typeof saved === 'object' ? { ...blank(), ...saved, seen: Array.isArray(saved.seen) ? saved.seen : [] } : blank();
}
export function savePrologue(state) {
  storage.save(KEY, state);
}

// Découvertes au-delà des quatre Souffles
export const discoveriesOf = elements => elements.filter(name => !BASE_ELEMENTS.includes(name)).length;

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
  // Les trois premières pages : Vent d'abord (avec une main qui montre l'Air), le vent qui se lève, puis deux pages
  if (found < FIRST_PAGES) {
    if (!elements.includes('Vent')) return { phase: 'vent' };
    if (!seen.has('souffle')) return { phase: 'scene', scene: 'souffle' };
    return { phase: found === 1 ? 'pluie' : 'seul' };
  }
  // Un sceau se brise, le feu, quelqu'un sur les rochers ; puis la page de garde du Grimoire crée le compte (« aster » :
  // l'ancien nom de cette scène, déjà vue sur certains appareils)
  if (!seen.has('sceau') && !seen.has('aster')) return { phase: 'scene', scene: 'sceau' };
  if (!loggedIn) return { phase: 'name', account: true };
  if (!state.named) return { phase: 'name', account: false };
  return { phase: 'greve' };
}

// Les quêtes du prologue (T1 à T8, serveur : services/quests.js), dans l'ordre
const PROLOGUE = ['pages', 'recolte', 'soupe', 'deco', 'achat-source', 'eveil-ondin', 'souvenir-ondin', 'puits-ondin'];

// Le geste que le coach montre pour chaque quête du prologue (game/coach.js) : les étapes, dans l'ordre (sur l'île, la
// cible ; un toucher ouvre une petite bulle et son bouton entre dans la fiche ; dans la fiche, le bon bouton). Le coach
// montre la plus avancée qui est à l'écran : le joueur n'est jamais lâché, même s'il referme une bulle en route.
// target : un sélecteur, ou « île:… » sur le canvas de l'île ; text : ce que dit la bulle du coach
const tipOf = (...keys) => keys.map(key => `.world__tip-btn[data-pick="${key}"]`).join(', ');
const LESSONS = {
  recolte: [{ target: '.world__play', text: 'Touche la Récolte : l’île t’y donne de quoi bâtir.' }],
  soupe: [
    { target: 'île:habitant:foyer', text: 'Cannelle a faim : touche-la.' },
    { target: tipOf('vil:foyer', 'ask:foyer'), text: 'Une bulle s’ouvre : touche « Sa fiche » pour entrer dans sa fiche.' },
    { target: '.friend__need.is-missing .friend__fill', text: 'Sa fiche dit ce qui lui manque : touche ce bouton pour lui donner à manger.' }
  ],
  deco: [
    { target: 'île:site:foyer', text: 'L’établi est au Foyer : touche-le.' },
    { target: tipOf('site:foyer'), text: 'Touche « Sa fiche » pour entrer au Foyer.' },
    { target: '[aria-label="Ouvrir l’établi"]', text: 'L’établi de Rivet : ouvre-le pour assembler ta première création.' }
  ],
  'achat-source': [
    { target: 'île:quartier:source', text: 'La Source est juste là : touche son panneau.' },
    { target: tipOf('zone:source'), text: 'Touche « Voir le quartier ».' },
    { target: '[data-coach="zone-buy"]', text: 'Tes écus suffisent : achète La Source.' }
  ],
  'eveil-ondin': [
    { target: 'île:habitant:puits', text: 'Ondin dort contre son rocher : touche-le.' },
    { target: tipOf('vil:puits'), text: 'Touche « Le réveiller » : parle-lui doucement.' }
  ],
  // Dans le Grimoire (le coach montre d'abord son onglet, depuis l'île) : le ruban, puis la page marquée, son énigme
  // et l'Encre. Les recettes restent au serveur : le Livre guide par ses pages, jamais par la réponse. Sur la page, rien
  // n'est bloqué (l'étagère doit rester sous le doigt)
  'souvenir-ondin': [
    { target: '.book-view__ariane', text: 'Le Puits s’écrit dans le Grimoire. Suis le ruban : il mène, page après page, à ce qui manque.' },
    { target: '.book-view__hot[data-marked]', text: 'Voici la page qui manque : son énigme dit ce qu’il faut mêler. Touche ces éléments en bas, ils iront dans l’Athanor.', free: true },
    { target: '.book-view__hot[data-marked] .book-view__spot[data-spot="ink"]', text: 'Son énigme dit ce qu’il faut mêler : touche ces éléments en bas. Bloqué ? L’Encre, ici, révèle un ingrédient.', free: true }
  ],
  'puits-ondin': [
    { target: 'île:site:puits', text: 'Le chantier du Puits : touche-le.' },
    { target: tipOf('site:puits'), text: 'Touche « Bâtir ».' },
    { target: '[data-coach="site-build"]', text: 'Tout est réuni : bâtis le Puits.' }
  ]
};
// Les leçons qui se jouent dans le Grimoire (les autres, sur l'île)
const BOOK_LESSONS = new Set(['souvenir-ondin']);
// La récompense : Brume, sur l'île ; si une fiche est encore ouverte, d'abord la refermer
const CLAIM = [
  { target: 'île:brume', text: 'Touche Brume : ta récompense t’attend.' },
  { target: '.g-modal__close, .world__sheet-backdrop .world__link', text: 'Referme cette fiche : Brume t’attend avec ta récompense.' }
];
// La leçon du coach à une étape de l'île (la quête active : { id, done }), ou null : la récompense à réclamer auprès de
// Brume, sinon les gestes de la quête
export function islandLesson(quest) {
  if (!quest || (!quest.done && !LESSONS[quest.id])) return null;
  if (quest.done) return { id: 'claim', mode: 'world', steps: CLAIM };
  return { id: `quest-${quest.id}`, mode: BOOK_LESSONS.has(quest.id) ? 'infinite' : 'world', steps: LESSONS[quest.id] };
}

// Étapes 2 (sur l'île) à 5 : la quête active de Brume ({ id, done }, vue de l'île) dit où l'on en est. Rend une scène,
// la main sur la Récolte, des répliques (ids du guide : chacune n'est dite qu'une fois), la fin ; ou null
export function islandStep({ state, quest }) {
  if (state.skipped || state.finished || !state.registered || !state.named || !quest) return null;
  const seen = new Set(state.seen);
  const at = PROLOGUE.indexOf(quest.id);
  // Le Puits réclamé : l'étape « Le Campement », puis le tutoriel est fini
  if (at < 0) return seen.has('campement') ? { phase: 'finish' } : { phase: 'scene', scene: 'campement' };
  const lines = [];
  // Une quête accomplie se réclame auprès de Brume (dit une fois)
  if (quest.done) lines.push('claim');
  if (!seen.has('recolte')) return { phase: 'scene', scene: 'recolte' };
  if (quest.id === 'recolte') return quest.done ? { phase: 'lines', lines: ['chaine', ...lines] } : { phase: 'harvest' };
  if (quest.id === 'soupe') {
    if (!seen.has('cannelle')) return { phase: 'scene', scene: 'cannelle' };
    return { phase: 'lines', lines: quest.done ? ['soupe', ...lines] : ['bulle'] };
  }
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
  return { phase: 'lines', lines };
}
