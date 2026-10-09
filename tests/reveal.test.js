// L'île se découvre peu à peu (world/reveal.js) : la brume épaisse ne se lève plus d'un coup à la fin du prologue
import { describe, it, expect } from 'vitest';
import { neighborsOf, zoneThick, veiledCellsOf } from '@/world/reveal';

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

describe('le cœur se découvre', () => {
  // Une île de 12 × 12 : le cœur (0) partout, du sable (s) sur la dernière rangée ; l'épave en (2, 9), le Feu en (8, 2)
  const n = 12;
  const zoneOf = (x, y) => (x < 0 || y < 0 || x >= n || y >= n ? -1 : 0);
  const groundOf = (x, y) => (y === n - 1 ? 's' : 'g');
  const state = (quest, over = {}) => ({
    brume: { tutorial: true, skipped: false, quest: { id: quest } },
    map: { zones: [{ id: 'coeur', owned: true }] },
    camp: [{ id: 'hirondelle', x: 2, y: 9, w: 2, h: 2 }, ...(over.camp || [])],
    sites: [{ id: 'foyer', x: 8, y: 2, w: 2, h: 2 }, ...(over.sites || [])]
  });
  const veiled = (st, prologue = true) => veiledCellsOf({ state: st, n, zoneOf, groundOf, prologue });
  const shown = (set, x, y) => !set.has(y * n + x);
  it('Brume seule : la plage, l’épave et le Feu ; le reste sous la brume', () => {
    const v = veiled(state('ramasser', { camp: [{ id: 'aster', x: 9, y: 9, w: 2, h: 2 }] }));
    expect(shown(v, 11, 11)).toBe(true); // le sable
    expect(shown(v, 2, 8)).toBe(true); // près de l'épave
    expect(shown(v, 8, 3)).toBe(true); // le Feu
    expect(shown(v, 0, 0)).toBe(false);
    expect(shown(v, 10, 9)).toBe(false); // un camp ne compte pas tant que Brume est seule
  });
  it('ensuite : un morceau autour de chaque camp et de chaque chantier qui se montre', () => {
    const st = state('recolte', { camp: [{ id: 'aster', x: 9, y: 9, w: 2, h: 2 }], sites: [{ id: 'puits', x: 0, y: 0, w: 2, h: 2, hidden: true }] });
    const v = veiled(st);
    expect(shown(v, 10, 9)).toBe(true);
    expect(shown(v, 0, 0)).toBe(false); // chantier caché : rien autour
  });
  it('hors du prologue, ou pour un compte d’avant la bible : rien sous la brume', () => {
    expect(veiled(state('ramasser'), false).size).toBe(0);
    expect(veiled({ ...state('ramasser'), brume: { tutorial: false, quest: { id: 'ramasser' } } }).size).toBe(0);
  });
});
