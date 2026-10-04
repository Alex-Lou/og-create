// Appui long sur un élément : un toucher garde son action (clic), un appui d'environ 450 ms sans bouger appelle le
// gestionnaire et le clic qui suit est avalé. Pas de menu du navigateur ni de sélection pendant l'appui.
// Usage : v-longpress="handler" (handler reçoit l'événement pointerdown)
export const HOLD_MS = 450;
const SLOP = 10;

export default {
  mounted(el, binding) {
    const press = { handler: binding.value, timer: 0, x: 0, y: 0, fired: false };
    const cancel = () => {
      clearTimeout(press.timer);
      press.timer = 0;
    };
    press.down = event => {
      if (event.button > 0) return;
      cancel();
      press.fired = false;
      press.x = event.clientX;
      press.y = event.clientY;
      press.timer = setTimeout(() => {
        press.timer = 0;
        press.fired = true;
        press.handler(event);
      }, HOLD_MS);
    };
    press.move = event => {
      if (press.timer && Math.hypot(event.clientX - press.x, event.clientY - press.y) > SLOP) cancel();
    };
    press.click = event => {
      if (!press.fired) return;
      press.fired = false;
      event.preventDefault();
      event.stopImmediatePropagation();
    };
    press.menu = event => event.preventDefault();
    press.cancel = cancel;
    el._press = press;
    el.style.webkitTouchCallout = 'none';
    el.style.userSelect = 'none';
    el.addEventListener('pointerdown', press.down);
    el.addEventListener('pointermove', press.move);
    ['pointerup', 'pointerleave', 'pointercancel'].forEach(type => el.addEventListener(type, cancel));
    el.addEventListener('click', press.click, true);
    el.addEventListener('contextmenu', press.menu);
  },
  updated(el, binding) {
    el._press.handler = binding.value;
  },
  unmounted(el) {
    const press = el._press;
    if (!press) return;
    press.cancel();
    el.removeEventListener('pointerdown', press.down);
    el.removeEventListener('pointermove', press.move);
    ['pointerup', 'pointerleave', 'pointercancel'].forEach(type => el.removeEventListener(type, press.cancel));
    el.removeEventListener('click', press.click, true);
    el.removeEventListener('contextmenu', press.menu);
    delete el._press;
  }
};
