// Brume, le guide : une file de répliques montrées une à une par BrumeGuide.vue (au niveau de l'application). Chaque
// écran signale seulement un moment (guide.tip('reach')) ; ce qui a déjà été dit est retenu sur l'appareil et n'est
// jamais redit. born : la naissance de Brume (sortie de la brume) n'est jouée qu'à sa toute première apparition.
import { reactive } from 'vue';
import * as storage from '@/utils/storage';
import { TIPS } from '@/texts/guide/tips';

const SEEN_KEY = 'oc_guide_seen';
const BORN_KEY = 'oc_brume_born';
// Au plus deux répliques à la suite (choix de l'auteur, 8 oct. : laisser respirer) : après la deuxième, la suivante
// attend REST_MS
const STREAK = 2;
const REST_MS = 2500;
let streak = 0;
let restTimer = 0;

// Pendant le tutoriel, Brume ne dit que ce qui sert l'étape en cours (choix de l'auteur, 9 oct.) : les aides générales
// (TIPS) attendent sa fin, sauf celles-ci. (Se présenter, présenter l'île : le tutoriel le fait, pour tout le monde)
const DURING_TUTORIAL = new Set(['fail']);

const state = reactive({
  queue: [],
  tutorial: false,
  seen: new Set(storage.load(SEEN_KEY, [])),
  born: Boolean(storage.load(BORN_KEY, false)),
  // Le temps de souffler entre deux séries de répliques (rien ne s'affiche, le coach non plus)
  resting: false,
  // Fenêtres ouvertes (coffre, succès, fiche, mini-jeu, fête de Brume…) : tant qu'il y en a, seules les répliques du
  // scénario passent ; les autres attendent (choix de l'auteur, 12 oct. : le rythme visuel, une chose à la fois)
  held: 0
});

// Une pause de REST_MS (rien ne s'affiche, le coach non plus)
function rest() {
  state.resting = true;
  clearTimeout(restTimer);
  restTimer = setTimeout(() => { state.resting = false; }, REST_MS);
}

// Une réplique ({ id, text, action?, top? : en haut de l'écran, who? et face? : un autre que Brume parle, et son
// portrait }) si elle n'a encore été ni dite ni mise en attente. Dite pendant le tutoriel, elle est du scénario (scene) :
// les fenêtres ouvertes ne la retiennent pas
function say(entry, { first = false } = {}) {
  if (!entry || !entry.text || state.seen.has(entry.id) || state.queue.some(q => q.id === entry.id)) return false;
  const line = { ...entry, scene: state.tutorial };
  // first : la réplique passe avant ce qui attend (jamais avant celle qui est à l'écran)
  if (first) state.queue.splice(guide.current ? 1 : 0, 0, line);
  else state.queue.push(line);
  return true;
}

export const guide = {
  state,
  // Réplique d'un moment clé (TIPS)
  tip(id) {
    if (state.tutorial && !DURING_TUTORIAL.has(id)) return false;
    return say({ id, text: TIPS[id] });
  },
  // Le tutoriel commence ou finit (App : prologueRunning)
  setTutorial(on) {
    state.tutorial = Boolean(on);
    if (!on) return;
    state.queue = state.queue.filter(entry => !(entry.id in TIPS) || DURING_TUTORIAL.has(entry.id));
  },
  say,
  // Réplique affichée (la première de la file), ou null ; hors scénario, aucune tant qu'une fenêtre est ouverte
  get current() {
    const entry = state.resting ? null : state.queue[0];
    return entry && (entry.scene || !state.held) ? entry : null;
  },
  // Une fenêtre s'ouvre : les répliques hors scénario attendent ; renvoie de quoi la dire fermée (une seule fois). La
  // dernière fermée, une réplique qui attendait passe après une pause
  hold() {
    state.held++;
    let open = true;
    return () => {
      if (!open) return;
      open = false;
      state.held--;
      if (!state.held && state.queue[0] && !state.queue[0].scene) rest();
    };
  },
  // La réplique affichée est lue : elle ne reviendra plus
  dismiss() {
    const entry = state.queue.shift();
    if (!entry) return;
    state.seen.add(entry.id);
    storage.save(SEEN_KEY, [...state.seen]);
    streak = state.queue.length ? streak + 1 : 0;
    if (streak >= STREAK) {
      streak = 0;
      rest();
    }
  },
  // Une réplique qui n'a plus lieu d'être (le tutoriel la dit autrement) : retirée de la file et tenue pour dite
  drop(id) {
    state.queue = state.queue.filter(entry => entry.id !== id);
    state.seen.add(id);
    storage.save(SEEN_KEY, [...state.seen]);
  },
  // Tout oublier (« Recommencer l'île » : le tutoriel se rejoue en entier) : ce qui a été dit, la file
  forget() {
    clearTimeout(restTimer);
    streak = 0;
    state.resting = false;
    state.queue = [];
    state.seen = new Set();
    storage.save(SEEN_KEY, []);
  },
  // Brume est né (sa naissance ne se rejoue pas)
  markBorn() {
    state.born = true;
    storage.save(BORN_KEY, true);
  }
};
