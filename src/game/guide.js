// Brume, le guide : une file de répliques montrées une à une par BrumeGuide.vue (au niveau de l'application). Chaque
// écran signale seulement un moment (guide.tip('reach')) ; ce qui a déjà été dit est retenu sur l'appareil et n'est
// jamais redit. born : la naissance de Brume (sortie de la brume) n'est jouée qu'à sa toute première apparition.
import { reactive } from 'vue';
import * as storage from '@/utils/storage';
import { TIPS } from './guideTips';

const SEEN_KEY = 'oc_guide_seen';
const BORN_KEY = 'oc_brume_born';

const state = reactive({
  queue: [],
  seen: new Set(storage.load(SEEN_KEY, [])),
  born: Boolean(storage.load(BORN_KEY, false))
});

// Une réplique ({ id, text, action?, top? : en haut de l'écran }) si elle n'a encore été ni dite ni mise en attente
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
    return state.queue[0] || null;
  },
  // La réplique affichée est lue : elle ne reviendra plus
  dismiss() {
    const entry = state.queue.shift();
    if (!entry) return;
    state.seen.add(entry.id);
    storage.save(SEEN_KEY, [...state.seen]);
  },
  // Une réplique qui n'a plus lieu d'être (le tutoriel la dit autrement) : retirée de la file et tenue pour dite
  drop(id) {
    state.queue = state.queue.filter(entry => entry.id !== id);
    state.seen.add(id);
    storage.save(SEEN_KEY, [...state.seen]);
  },
  // Brume est né (sa naissance ne se rejoue pas)
  markBorn() {
    state.born = true;
    storage.save(BORN_KEY, true);
  }
};
