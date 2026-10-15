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
  // steps : les gestes de la leçon, dans l'ordre ([{ target, text }] : toucher Marcelle, puis « Sa fiche » dans sa
  // bulle, puis le bouton de sa fiche) ; le coach montre le plus avancé qui est à l'écran (CoachLayer)
  lesson: null,
  seen: new Set(storage.load(SEEN_KEY, [])),
  // La leçon refermée d'une croix (son id ; choix de l'auteur, 15 oct. : on peut toujours fermer, explorer, puis revenir
  // à l'objectif par le « ! » du suivi des quêtes) : elle ne se montre plus jusqu'au rappel (recall) ou à la leçon suivante
  hidden: null,
  // Hors du tutoriel, l'objectif montré à la demande (le suivi des quêtes : la caméra y va, la main le montre) : une
  // leçon libre { id, mode, pointer: true, steps }, ou null ; il s'efface quand on touche sa cible ou sa croix
  pointer: null
});

// Les cibles dessinées sur un canvas (l'île) : un nom → { x, y, w, h } à l'écran, ou null (hors de vue) ; et la caméra
// de l'île, qui amène une cible à l'écran (nom → vrai si la cible existe)
let islandAnchor = null;
let islandFocus = null;
// Les consignes déjà dites dans la leçon qui se répète (once : ramasser trois trouvailles, planter quatre piquets ;
// choix de l'auteur, 13 oct.) : chacune une fois, ensuite la main seule. Oubliées quand une autre leçon vient
const said = { id: null, steps: new Set() };

export const coach = {
  // Tout oublier (« Recommencer l'île ») : chaque geste redevient montré, forcé la première fois
  forget() {
    state.lesson = null;
    state.hidden = null;
    state.pointer = null;
    state.seen = new Set();
    said.id = null;
    said.steps.clear();
    storage.save(SEEN_KEY, []);
  },
  state,
  // La leçon de l'étape (null : aucune). Forcée tant que son geste n'a jamais été fait
  show(lesson) {
    // (une autre leçon, ou plus aucune : la croix ne vaut que pour celle qu'elle a fermée)
    if (state.hidden && (!lesson || lesson.id !== state.hidden)) state.hidden = null;
    if (!lesson) {
      state.lesson = null;
      return;
    }
    const steps = lesson.steps || [{ target: lesson.target, text: lesson.text }];
    const same = state.lesson && state.lesson.id === lesson.id && state.lesson.steps.map(st => st.target).join('|') === steps.map(st => st.target).join('|');
    if (said.id !== lesson.id) {
      said.id = lesson.id;
      said.steps.clear();
    }
    if (!same) state.lesson = { ...lesson, target: steps[0].target, text: steps[0].text, steps, block: !state.seen.has(lesson.id) };
    // (la même leçon, un pas plus loin : le compteur suit)
    else if (lesson.tally?.have !== state.lesson.tally?.have) state.lesson.tally = lesson.tally || null;
  },
  // La consigne d'un geste de cette leçon (k : sa cible) a déjà été dite / vient d'être dite
  said(id, k) {
    return said.id === id && said.steps.has(k);
  },
  say(id, k) {
    if (said.id === id) said.steps.add(k);
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
  // La croix : la leçon se referme (l'objectif montré, lui, s'efface)
  close(lesson) {
    if (lesson && lesson.pointer) state.pointer = null;
    else if (state.lesson) state.hidden = state.lesson.id;
  },
  // La leçon refermée revient (le « ! » du suivi des quêtes) : elle se montre, et la caméra ou la page va vers sa cible
  // (le geste le plus avancé qui existe)
  recall() {
    state.hidden = null;
    const steps = state.lesson ? state.lesson.steps || [{ target: state.lesson.target }] : [];
    for (let k = steps.length - 1; k >= 0; k--) if (coach.reveal(steps[k].target)) return;
  },
  // Montrer un objectif hors du tutoriel (pointer : { id, mode, steps }) : la caméra va vers sa cible, la main le montre
  point(pointer) {
    state.pointer = pointer ? { ...pointer, pointer: true, steps: pointer.steps.map(step => ({ ...step, free: true })) } : null;
    if (pointer) coach.reveal(pointer.steps[0].target);
  },
  // Le geste a été fait : il ne bloquera plus jamais (l'objectif montré, touché, s'efface)
  done(id) {
    if (state.pointer && (id === state.pointer.id || id.startsWith(`${state.pointer.id}#`))) {
      state.pointer = null;
      return;
    }
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
