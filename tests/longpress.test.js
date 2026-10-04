import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import longpress, { HOLD_MS } from '../src/directives/longpress';

// Un élément minimal (EventTarget de Node) : la directive n'a besoin que des écouteurs et du style
function element() {
  const el = new EventTarget();
  el.style = {};
  return el;
}
function fire(el, type, props = {}) {
  const event = Object.assign(new Event(type, { cancelable: true }), { button: 0, clientX: 0, clientY: 0, ...props });
  el.dispatchEvent(event);
  return event;
}

describe('appui long (v-longpress)', () => {
  let el;
  let held;
  let clicked;
  beforeEach(() => {
    vi.useFakeTimers();
    el = element();
    held = vi.fn();
    clicked = vi.fn();
    longpress.mounted(el, { value: held });
    el.addEventListener('click', clicked);
  });
  afterEach(() => {
    longpress.unmounted(el);
    vi.useRealTimers();
  });

  it('un toucher bref garde son clic, sans appeler le gestionnaire', () => {
    fire(el, 'pointerdown');
    vi.advanceTimersByTime(HOLD_MS - 50);
    fire(el, 'pointerup');
    fire(el, 'click');
    vi.advanceTimersByTime(HOLD_MS);
    expect(held).not.toHaveBeenCalled();
    expect(clicked).toHaveBeenCalledTimes(1);
  });
  it('un appui tenu appelle le gestionnaire une fois et avale le clic qui suit, pas le suivant', () => {
    fire(el, 'pointerdown');
    vi.advanceTimersByTime(HOLD_MS);
    expect(held).toHaveBeenCalledTimes(1);
    fire(el, 'pointerup');
    expect(fire(el, 'click').defaultPrevented).toBe(true);
    expect(clicked).not.toHaveBeenCalled();
    fire(el, 'click');
    expect(clicked).toHaveBeenCalledTimes(1);
  });
  it('le doigt qui glisse (défilement) annule l’appui', () => {
    fire(el, 'pointerdown', { clientX: 10, clientY: 10 });
    fire(el, 'pointermove', { clientX: 10, clientY: 30 });
    vi.advanceTimersByTime(HOLD_MS * 2);
    expect(held).not.toHaveBeenCalled();
  });
  it('pas de menu du navigateur ; le gestionnaire suit les mises à jour ; plus rien après démontage', () => {
    expect(fire(el, 'contextmenu').defaultPrevented).toBe(true);
    const next = vi.fn();
    longpress.updated(el, { value: next });
    fire(el, 'pointerdown');
    vi.advanceTimersByTime(HOLD_MS);
    expect(next).toHaveBeenCalledTimes(1);
    fire(el, 'pointerdown');
    longpress.unmounted(el);
    vi.advanceTimersByTime(HOLD_MS);
    expect(next).toHaveBeenCalledTimes(1);
  });
});
