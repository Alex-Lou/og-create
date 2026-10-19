import { describe, it, expect, afterEach, vi } from 'vitest';
import gestures from '@/world/view/gestures';

// Un doigt dont le lâcher ne s'est jamais reçu restait retenu : le toucher suivant comptait pour deux doigts, un pincement,
// et l'île sautait (retour de l'auteur, 19 oct.)
const island = () => ({
  state: {},
  pointers: new Map(),
  roadMode: false,
  lineCraft: false,
  hideTip() {},
  stopGlide() {},
  roadEnd() {},
  onHold() {},
  pinchOf: gestures.pinchOf,
  point: e => ({ x: e.clientX, y: e.clientY }),
  $refs: { canvas: { setPointerCapture() {} } }
});
const down = (ctx, pointerId, isPrimary, x = 10) => gestures.onDown.call(ctx, { pointerId, isPrimary, clientX: x, clientY: 10 });

describe('les doigts posés sur l’île', () => {
  afterEach(() => vi.useRealTimers());

  it('un premier doigt oublie les restes : un toucher, pas un pincement', () => {
    vi.useFakeTimers();
    const ctx = island();
    ctx.pointers.set(7, { x: 300, y: 300 });
    down(ctx, 8, true);
    expect([...ctx.pointers.keys()]).toEqual([8]);
    expect(ctx.gesture.pinch).toBeUndefined();
  });

  it('un second doigt, lui, pince', () => {
    vi.useFakeTimers();
    const ctx = island();
    down(ctx, 1, true);
    down(ctx, 2, false, 120);
    expect(ctx.pointers.size).toBe(2);
    expect(ctx.gesture.pinch).toBeTruthy();
  });
});
