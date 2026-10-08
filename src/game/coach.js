// Le coach du tutoriel (comme les grands jeux mobiles) : une seule leçon à la fois. L'écran s'assombrit sauf ce qu'il
// faut toucher, une main le montre, une bulle dit pourquoi. La première fois, le geste est forcé (le reste de l'écran
// ne répond pas le temps de ce geste) ; ensuite la même leçon revient libre (rien n'est bloqué). Le tutoriel choisit
// la leçon selon l'étape, qui se déduit du jeu (game/prologue.js) : le coach ne garde rien d'autre que les gestes déjà
// faits, sur l'appareil.
import { reactive } from 'vue';
import * as storage from '@/utils/storage';

const SEEN_KEY = 'oc_coach_seen';

const state = reactive({
  // La leçon montrée : { id, target, mode, text?, who?, face?, steps }, ou null. target : un sélecteur CSS, ou
  // « île:<nom> » (une cible sur le canvas de l'île : brume, site:<id>, habitant:<id>, quartier:<id>).
  // steps : les gestes de la leçon, dans l'ordre ([{ target, text }] : toucher Cannelle, puis « Sa fiche » dans sa
  // bulle, puis le bouton de sa fiche) ; le coach montre le plus avancé qui est à l'écran (CoachLayer)
  lesson: null,
  seen: new Set(storage.load(SEEN_KEY, []))
});

// Les cibles dessinées sur un canvas (l'île) : un nom → { x, y, w, h } à l'écran, ou null (hors de vue) ; et la caméra
// de l'île, qui amène une cible à l'écran (nom → vrai si la cible existe)
let islandAnchor = null;
let islandFocus = null;

export const coach = {
  state,
  // La leçon de l'étape (null : aucune). Forcée tant que son geste n'a jamais été fait
  show(lesson) {
    if (!lesson) {
      state.lesson = null;
      return;
    }
    const steps = lesson.steps || [{ target: lesson.target, text: lesson.text }];
    const same = state.lesson && state.lesson.id === lesson.id && state.lesson.steps.map(st => st.target).join('|') === steps.map(st => st.target).join('|');
    if (!same) state.lesson = { ...lesson, target: steps[0].target, text: steps[0].text, steps, block: !state.seen.has(lesson.id) };
  },
  // L'identifiant d'un geste de la leçon (le premier porte celui de la leçon), retenu une fois fait
  stepId(lesson, k) {
    return k ? `${lesson.id}#${k}` : lesson.id;
  },
  // Ce geste n'a jamais été fait : il est forcé
  blocks(id) {
    return !state.seen.has(id);
  },
  clear(id) {
    if (!id || (state.lesson && state.lesson.id === id)) state.lesson = null;
  },
  // Le geste a été fait : il ne bloquera plus jamais
  done(id) {
    if (!state.seen.has(id)) {
      state.seen.add(id);
      storage.save(SEEN_KEY, [...state.seen]);
    }
    if (state.lesson && state.lesson.id === id) state.lesson = { ...state.lesson, block: false };
  },
  // L'île publie sa caméra (WorldView) : fn(nom) l'amène vers la cible, vrai si elle existe
  focusIsland(fn) {
    islandFocus = fn;
    return () => {
      if (islandFocus === fn) islandFocus = null;
    };
  },
  // Amener une cible à l'écran (« Me montrer ») : la caméra de l'île vers elle, ou la page qui défile jusqu'à elle ;
  // vrai si la cible existe
  reveal(target) {
    if (!target) return false;
    if (target.startsWith('île:')) return Boolean(islandFocus && islandFocus(target.slice(4)));
    const el = typeof document === 'undefined' ? null : document.querySelector(target);
    if (!el) return false;
    if (el.scrollIntoView) el.scrollIntoView({ block: 'center', behavior: 'smooth' });
    return true;
  },
  // L'île publie où sont ses cibles (WorldView) ; fn(nom) → rectangle à l'écran, ou null
  island(fn) {
    islandAnchor = fn;
    return () => {
      if (islandAnchor === fn) islandAnchor = null;
    };
  },
  // Le rectangle d'une cible à l'écran ({ x, y, w, h, el }), ou null si elle n'est pas là
  rectOf(target) {
    if (!target) return null;
    if (target.startsWith('île:')) {
      const rect = islandAnchor && islandAnchor(target.slice(4));
      return rect ? { ...rect, el: typeof document === 'undefined' ? null : document.querySelector('.world canvas') } : null;
    }
    const el = document.querySelector(target);
    const r = el && el.getBoundingClientRect();
    return r && r.width > 0 ? { x: r.left, y: r.top, w: r.width, h: r.height, el } : null;
  }
};
