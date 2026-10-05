// Le tutoriel « Le Naufrage de l'Hirondelle » (HISTOIRE.md, § 9) : où en est le joueur, déduit de ce que le jeu sait
// déjà (compte, éléments du Grimoire, quête de Brume) ; l'appareil ne retient que ce qui ne se déduit pas : le
// prologue commencé ici, les scènes vues, le nom écrit avant l'inscription, « Passer ».
// Les joueurs actuels ne le voient pas : il ne commence que pour un invité qui n'a encore que les quatre Souffles, et
// un compte ne le poursuit que s'il a été créé par lui (sur la page de garde du Grimoire).
import * as storage from '@/utils/storage';
import { BASE_ELEMENTS } from '@/utils/gameConstants';

const KEY = 'oc_prologue';
// Les trois premières pages de l'étape 1 (Vent, Pluie, Brasier) ouvrent le chapitre II
export const FIRST_PAGES = 3;

const blank = () => ({ started: false, skipped: false, registered: false, named: false, name: null, seen: [] });

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
  // Étape 1 : la rencontre, puis les trois premières pages (Vent d'abord, avec une main qui montre l'Air)
  if (!seen.has('arrivee')) return { phase: 'scene', scene: 'arrivee' };
  if (found < FIRST_PAGES) {
    if (!elements.includes('Vent')) return { phase: 'vent' };
    return { phase: found === 1 ? 'pluie' : 'seul' };
  }
  // Étape 2 : Aster demande ton nom ; la page de garde du Grimoire crée le compte
  if (!seen.has('aster')) return { phase: 'scene', scene: 'aster' };
  if (!loggedIn) return { phase: 'name', account: true };
  if (!state.named) return { phase: 'name', account: false };
  return { phase: 'greve' };
}
