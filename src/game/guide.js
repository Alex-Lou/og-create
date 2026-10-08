// Brume, le guide : une file de répliques montrées une à une par BrumeGuide.vue (au niveau de l'application). Chaque
// écran signale seulement un moment (guide.tip('reach')) ; ce qui a déjà été dit est retenu sur l'appareil et n'est
// jamais redit. born : la naissance de Brume (sortie de la brume) n'est jouée qu'à sa toute première apparition.
import { reactive } from 'vue';
import * as storage from '@/utils/storage';
import { TIPS } from './guideTips';

const SEEN_KEY = 'oc_guide_seen';
const BORN_KEY = 'oc_brume_born';
// Au plus deux répliques à la suite (choix de l'auteur, 8 oct. : laisser respirer) : après la deuxième, la suivante
// attend REST_MS
const STREAK = 2;
const REST_MS = 2500;
let streak = 0;
let restTimer = 0;

const state = reactive({
  queue: [],
  seen: new Set(storage.load(SEEN_KEY, [])),
  born: Boolean(storage.load(BORN_KEY, false)),
  // Le temps de souffler entre deux séries de répliques (rien ne s'affiche, le coach non plus)
  resting: false
});

// Une réplique ({ id, text, action?, top? : en haut de l'écran, who? et face? : un autre que Brume parle, et son
// portrait }) si elle n'a encore été ni dite ni mise en attente
function say(entry) {
  if (!entry || !entry.text || state.seen.has(entry.id) || state.queue.some(q => q.id === entry.id)) return false;
  state.queue.push(entry);
  return true;
}

export const guide = {
  state,
  // Réplique d'un moment clé (TIPS)
  tip(id) {
    return say({ id, text: TIPS[id] });
  },
  say,
  // Réplique affichée (la première de la file), ou null
  get current() {
    return state.resting ? null : state.queue[0] || null;
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
      state.resting = true;
      clearTimeout(restTimer);
      restTimer = setTimeout(() => { state.resting = false; }, REST_MS);
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
