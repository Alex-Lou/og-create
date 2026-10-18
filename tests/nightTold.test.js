// Le bilan de la nuit (WorldView, nights.js : checkNights) : lu une fois, il ne revient plus. L'appareil garde le
// numéro de la nuit en texte, le serveur l'envoie en nombre (16 oct. : la fenêtre revenait à chaque vue de l'île)
import { describe, it, expect, beforeEach, vi } from 'vitest';
import nights from '@/components/World/WorldView/nights.js';

const store = new Map();
beforeEach(() => {
  store.clear();
  vi.stubGlobal('localStorage', { getItem: k => (store.has(k) ? store.get(k) : null), setItem: (k, v) => store.set(k, String(v)), removeItem: k => store.delete(k) });
});

const island = () => ({
  ...nights.methods,
  state: { sites: [], nights: { started: true, last: { id: 4242, counts: { brule: 2, barre: 0, dort: 0, coq: 0, camarade: 1, touche: 0, arrive: 0, revenu: 0 }, kinds: { fantome: 3 }, burnt: { fantome: 2 }, under: 0, panne: null } } },
  nightSheet: null, wreck: null, reveal: null, haul: null, nightsWait: false, actsDone: ['T'], thickMist: () => false, coopOf: () => null
});

describe('le bilan de la nuit', () => {
  it('se montre une fois ; fermé, il ne revient plus, même après une nouvelle vue de l’île', async () => {
    const w = island();
    w.checkNights();
    expect(w.nightSheet && w.nightSheet.mode).toBe('recap');
    await w.closeNightSheet();
    expect(w.nightSheet).toBe(null);
    w.checkNights();
    expect(w.nightSheet).toBe(null);
    // (la nuit suivante, son bilan à elle)
    w.state.nights.last = { ...w.state.nights.last, id: 4243 };
    w.checkNights();
    expect(w.nightSheet && w.nightSheet.id).toBe(4243);
  });
});
