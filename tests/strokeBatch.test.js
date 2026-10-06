// Traits blancs regroupés (vagues, écume, reflets de l'eau douce) : un seul tracé par teinte et épaisseur
import { describe, it, expect } from 'vitest';
import { strokeBatch } from '@/world/terrain';

// Contexte de dessin qui note ce qu'on lui demande
function recorder() {
  const calls = [];
  const ctx = {
    calls,
    set strokeStyle(v) { calls.push(['style', v]); },
    set lineWidth(v) { calls.push(['width', v]); },
    beginPath: () => calls.push(['begin']),
    moveTo: (x, y) => calls.push(['move', x, y]),
    lineTo: (x, y) => calls.push(['line', x, y]),
    stroke: () => calls.push(['stroke'])
  };
  return ctx;
}
const seg = (x, y) => c => { c.moveTo(x, y); c.lineTo(x + 1, y); };

describe('strokeBatch', () => {
  it('même teinte et même épaisseur (au 1/50 et au 1/10 près) : un seul tracé', () => {
    const ctx = recorder();
    const lines = strokeBatch();
    lines.add(0.301, 1.42, seg(0, 0));
    lines.add(0.299, 1.38, seg(5, 0));
    lines.add(0.5, 2.4, seg(9, 9));
    lines.flush(ctx);
    expect(ctx.calls.filter(c => c[0] === 'stroke')).toHaveLength(2);
    expect(ctx.calls.slice(0, 8)).toEqual([
      ['style', 'rgba(255,255,255,0.3)'], ['width', 1.4], ['begin'], ['move', 0, 0], ['line', 1, 0], ['move', 5, 0], ['line', 6, 0], ['stroke']
    ]);
  });
  it('rien d’invisible ; une fois tracé, le lot repart vide', () => {
    const ctx = recorder();
    const lines = strokeBatch();
    lines.add(0.004, 1.4, seg(0, 0));
    lines.add(-0.2, 1.4, seg(0, 0));
    lines.flush(ctx);
    expect(ctx.calls).toEqual([]);
    lines.add(0.4, 2, seg(0, 0));
    lines.flush(ctx);
    lines.flush(ctx);
    expect(ctx.calls.filter(c => c[0] === 'stroke')).toHaveLength(1);
  });
});
