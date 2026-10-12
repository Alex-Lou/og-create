// La règle des lumières de l'île (world/view/draw/air.js : lightGate) : rien ne brille dans un quartier pas encore à
// soi ni sur une case encore cachée ; un quartier qu'on vient d'acheter s'allume à mesure que sa brume s'efface ; la
// mer n'est d'aucun quartier.
import { describe, expect, it } from 'vitest';
import air from '@/world/view/draw/air';

function view({ hidden = [], mist = {} } = {}) {
  const zones = [{ id: 'coeur', owned: true }, { id: 'colline', owned: false }, { id: 'crique', owned: true }];
  return {
    // (le quartier d'une case : x < 10 cœur, x < 20 colline, x < 30 crique, au-delà la mer)
    M: { zone: x => (x < 10 ? 0 : x < 20 ? 1 : x < 30 ? 2 : -1) },
    state: { map: { zones } },
    hiddenCell: (x, y) => hidden.some(([hx, hy]) => hx === x && hy === y),
    mistOf: zone => (zone.owned ? mist[zone.id] || 0 : 1)
  };
}

describe('lumières et quartiers', () => {
  it('un quartier à soi brille, un quartier à acheter non, la mer toujours', () => {
    const shown = air.lightGate.call(view(), 0);
    expect(shown(3, 4)).toBe(1);
    expect(shown(12.4, 4)).toBe(0);
    expect(shown(40, 4)).toBe(1);
  });

  it('une case encore cachée reste éteinte ; un quartier qu’on vient d’acheter s’allume avec sa brume qui part', () => {
    const shown = air.lightGate.call(view({ hidden: [[3, 4]], mist: { crique: 0.75 } }), 0);
    expect(shown(2.6, 4.2)).toBe(0);
    expect(shown(25, 1)).toBeCloseTo(0.25);
  });
});
