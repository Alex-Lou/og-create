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
