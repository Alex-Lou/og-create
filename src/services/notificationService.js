// Les notifications : des billets empilés (en bas sur grand écran, en haut sur téléphone, toujours hors du HUD de l'île :
// utils/cadre.js). Choix de l'auteur, 13 oct. : au plus MAX_TOASTS à la fois (la plus ancienne s'en va, jamais une
// erreur avant une autre) ; un même gain qui revient pendant qu'il est affiché s'additionne au lieu d'en ajouter un.
// Les règles se calculent à part (toastRules.js, testées) ; une seule pile (ToastStack) les affiche.
import { createApp, nextTick, reactive } from 'vue';
import ToastStack from '@/components/ui/ToastNotification/ToastStack.vue';
import { garderDansLEcran } from '@/utils/cadre';
import { addGains, toEvict } from './toastRules';

const toasts = reactive([]);
let next = 0;
let stack = null;

function remove(id) {
  const i = toasts.findIndex(t => t.id === id);
  if (i >= 0) toasts.splice(i, 1);
  place();
}

// La pile, montée une fois
function mount() {
  if (stack) return;
  const host = document.createElement('div');
  document.body.appendChild(host);
  createApp(ToastStack, { toasts, onClose: remove }).mount(host);
  stack = document.querySelector('.toast-stack');
}

// La pile repart de sa place (sa feuille de style) puis glisse hors du HUD de l'île
function place() {
  nextTick(() => {
    if (!stack || !toasts.length) return;
    stack.style.top = stack.style.bottom = stack.style.left = '';
    garderDansLEcran(stack, undefined, { parBas: window.matchMedia('(min-width: 860px)').matches });
  });
}

const notificationService = {
  show(options) {
    const { message = '', duration = 3000, type = 'info', gains = [] } = options;
    if (!message && !gains.length) return;
    mount();
    // (le même message est déjà là : ses gains s'additionnent, et il reste le temps d'être lu)
    const key = `${type} ${message}`;
    const same = toasts.find(t => t.key === key);
    if (same) {
      if (gains.length) same.gains = addGains(same.gains, gains);
      same.stamp += 1;
      return;
    }
    toasts.push({ id: ++next, key, message, type, gains, duration, stamp: 0 });
    for (let gone = toEvict(toasts); gone; gone = toEvict(toasts)) toasts.splice(toasts.indexOf(gone), 1);
    place();
  },

  error(message, duration) {
    this.show({ message, duration, type: 'error' });
  },

  info(message, duration) {
    this.show({ message, duration, type: 'info' });
  }
};

export default notificationService;
