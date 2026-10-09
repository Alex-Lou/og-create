// L'île se découvre peu à peu (world/reveal.js) : la brume épaisse ne se lève plus d'un coup à la fin du prologue
import { describe, it, expect } from 'vitest';
import { neighborsOf, zoneThick } from '@/world/reveal';

describe('quartiers voisins', () => {
  it('se lisent sur la grille (côté de case), la mer n’en est pas', () => {
    // 0 0 1
    // 2 . 1
    const grid = ['001', '2.1'];
    const zoneOf = (x, y) => (y < 0 || x < 0 || y >= 2 || x >= 3 || grid[y][x] === '.' ? -1 : Number(grid[y][x]));
    const near = neighborsOf(zoneOf, 3);
    expect([...near.get(0)].sort()).toEqual([1, 2]);
    expect([...near.get(1)]).toEqual([0]);
    expect([...near.get(2)]).toEqual([0]);
  });
});

describe('brume épaisse', () => {
  const brume = (questZone = null, over = {}) => ({ tutorial: true, skipped: false, quest: { id: 'x', target: questZone ? { zone: questZone } : null }, ...over });
  const zone = over => ({ id: 'lisiere', known: true, open: true, owned: false, ...over });
  it('pendant le prologue : tout ce qui n’est pas à soi, sauf le quartier de la quête', () => {
    expect(zoneThick({ zone: zone(), brume: brume(), prologue: true, touchesOwned: true })).toBe(true);
    expect(zoneThick({ zone: zone({ id: 'source' }), brume: brume('source'), prologue: true, touchesOwned: true })).toBe(false);
    expect(zoneThick({ zone: zone({ owned: true }), brume: brume(), prologue: true })).toBe(false);
  });
  it('après le prologue : seuls se montrent les voisins de l’île qui peuvent s’ouvrir maintenant', () => {
    const after = z => zoneThick({ zone: z, brume: brume(), prologue: false, touchesOwned: true });
    expect(after(zone())).toBe(false);
    expect(after(zone({ open: false }))).toBe(true); // chapitre du Grimoire fermé
    expect(zoneThick({ zone: zone(), brume: brume(), prologue: false, touchesOwned: false })).toBe(true); // loin
    expect(after(zone({ known: false, explorable: true }))).toBe(false);
    expect(after(zone({ known: false, explorable: false }))).toBe(true);
  });
  it('un compte d’avant la bible, ou qui a passé le tutoriel : son île comme avant', () => {
    expect(zoneThick({ zone: zone({ open: false }), brume: brume(null, { tutorial: false }), prologue: false, touchesOwned: false })).toBe(false);
    expect(zoneThick({ zone: zone({ open: false }), brume: brume(null, { skipped: true }), prologue: true, touchesOwned: false })).toBe(false);
    expect(zoneThick({ zone: zone(), brume: null, prologue: false })).toBe(false);
  });
});
