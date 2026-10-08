// Le coach du tutoriel (comme les grands jeux mobiles) : une seule leçon à la fois. L'écran s'assombrit sauf ce qu'il
// faut toucher, une main le montre, une bulle dit pourquoi. La première fois, le geste est forcé (le reste de l'écran
// ne répond pas le temps de ce geste) ; ensuite la même leçon revient libre (rien n'est bloqué). Le tutoriel choisit
// la leçon selon l'étape, qui se déduit du jeu (game/prologue.js) : le coach ne garde rien d'autre que les gestes déjà
// faits, sur l'appareil.
import { reactive } from 'vue';
import * as storage from '@/utils/storage';

const SEEN_KEY = 'oc_coach_seen';

const state = reactive({
  // La leçon montrée : { id, target, mode, text?, who?, face?, place? }, ou null. target : un sélecteur CSS, ou
  // « île:<nom> » (une cible sur le canvas de l'île : brume, site:<id>, habitant:<id>, quartier:<id>)
  lesson: null,
  seen: new Set(storage.load(SEEN_KEY, []))
});

// Les cibles dessinées sur un canvas (l'île) : un nom → { x, y, w, h } à l'écran, ou null (hors de vue)
let islandAnchor = null;

export const coach = {
  state,
  // La leçon de l'étape (null : aucune). Forcée tant que son geste n'a jamais été fait
  show(lesson) {
    if (!lesson) {
      state.lesson = null;
      return;
    }
    const same = state.lesson && state.lesson.id === lesson.id && state.lesson.target === lesson.target;
    if (!same) state.lesson = { ...lesson, block: !state.seen.has(lesson.id) };
  },
  clear(id) {
    if (!id || (state.lesson && state.lesson.id === id)) state.lesson = null;
  },
  // Le geste a été fait : la leçon ne bloquera plus jamais
  done(id) {
    if (!state.seen.has(id)) {
      state.seen.add(id);
      storage.save(SEEN_KEY, [...state.seen]);
    }
    if (state.lesson && state.lesson.id === id) state.lesson = { ...state.lesson, block: false };
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
