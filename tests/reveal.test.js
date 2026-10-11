// L'île se découvre peu à peu (world/reveal.js) : la brume épaisse ne se lève plus d'un coup à la fin du prologue
import { describe, it, expect } from 'vitest';
import { neighborsOf, zoneThick, veiledCellsOf } from '@/world/reveal';
import { ZONES, inRect } from '@/world/zones';

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
  const state = (quest, over = {}) => ({
    brume: { tutorial: true, skipped: false, quest: { id: quest } },
    map: { zones: [{ id: 'coeur', owned: true }] },
    camp: [{ id: 'hirondelle', x: 2, y: 9, w: 2, h: 2 }, ...(over.camp || [])],
    sites: [{ id: 'foyer', x: 8, y: 2, w: 2, h: 2 }, ...(over.sites || [])]
  });
  const veiled = (st, prologue = true) => veiledCellsOf({ state: st, n, zoneOf, prologue });
  const shown = (set, x, y) => !set.has(y * n + x);
  it('Brume seule : seule la plage du débarquement se voit (le quadrilatère 22-74-205-131), le reste attend Aster', () => {
    // (le quadrilatère est en coordonnées de la grande carte : 94-103 × 91-98 ; on teste donc sur une île de 144)
    const big = {
      brume: { tutorial: true, skipped: false, quest: { id: 'ramasser' } },
      map: { zones: [{ id: 'coeur', owned: true }] },
      camp: [{ id: 'hirondelle', x: 96, y: 96, w: 2, h: 2 }, { id: 'aster', x: 100, y: 88, w: 2, h: 2 }],
      sites: [{ id: 'foyer', x: 98, y: 92, w: 2, h: 2 }]
    };
    const v = veiledCellsOf({ state: big, n: 144, zoneOf: () => 0, prologue: true });
    const shown = (x, y) => !v.has(y * 144 + x);
    expect(shown(96, 96)).toBe(true); // l'épave, dans la plage
    expect(shown(100, 95)).toBe(true); // dans le quadrilatère
    expect(shown(90, 96)).toBe(false); // à l'ouest, sous la brume
    expect(shown(96, 88)).toBe(false); // au nord, sous la brume
    expect(shown(11, 11)).toBe(false); // un camp ne compte pas tant que Brume est seule
  });
  it('tout le sable de l’anse se voit dès le début (choix de l’auteur, 11 oct.) ; pas l’herbe, pas un sable qui n’y touche pas', () => {
    const big = {
      brume: { tutorial: true, skipped: false, quest: { id: 'ramasser' } },
      map: { zones: [{ id: 'coeur', owned: true }] },
      camp: [{ id: 'hirondelle', x: 96, y: 96, w: 2, h: 2 }],
      sites: [{ id: 'foyer', x: 98, y: 92, w: 2, h: 2 }]
    };
    // Le sable : celui de la plage (96-100 × 96-97), la rangée 98 de 82 à 104 (l'anse, qui dépasse la plage), et un
    // sable isolé en (60, 98)
    const groundOf = (x, y) => (y >= 96 && y <= 97 && x >= 96 && x <= 100) || (y === 98 && x >= 82 && x <= 104) || (x === 60 && y === 98) ? 's' : 'g';
    const v = veiledCellsOf({ state: big, n: 144, zoneOf: () => 0, prologue: true, groundOf });
    const shown = (x, y) => !v.has(y * 144 + x);
    expect(shown(82, 98)).toBe(true); // le bout ouest de l'anse
    expect(shown(104, 98)).toBe(true); // le bout est
    expect(shown(90, 96)).toBe(false); // l'herbe, sous la brume
    expect(shown(60, 98)).toBe(false); // un sable qui ne touche pas l'anse
  });
  it('ensuite : un morceau autour de chaque camp et de chaque chantier qui se montre', () => {
    const st = state('recolte', { camp: [{ id: 'aster', x: 9, y: 9, w: 2, h: 2 }], sites: [{ id: 'puits', x: 0, y: 0, w: 2, h: 2, hidden: true }] });
    const v = veiled(st);
    expect(shown(v, 10, 9)).toBe(true);
    expect(shown(v, 0, 0)).toBe(false); // chantier caché : rien autour
  });
  it('un personnage arrivé : sa zone entière se découvre ; celles des autres attendent (jamais tous mélangés)', () => {
    // La grande carte (144) : Aster est là (son chantier se montre), Rivet et Ondin pas encore
    const big = {
      brume: { tutorial: true, skipped: false, quest: { id: 'recolte' } },
      map: { zones: [{ id: 'coeur', owned: true }] },
      camp: [{ id: 'hirondelle', x: 96, y: 96, w: 2, h: 2 }],
      sites: [{ id: 'foyer', x: 99, y: 93, w: 2, h: 2 }, { id: 'ponton', x: 88, y: 99, w: 2, h: 2 }, { id: 'atelier', x: 96, y: 83, w: 2, h: 2, hidden: true }],
      villagers: [{ id: 'ponton' }]
    };
    const v = veiledCellsOf({ state: big, n: 144, zoneOf: () => 0, prologue: true });
    const shown = (x, y) => !v.has(y * 144 + x);
    expect([shown(85, 92), shown(92, 100), shown(100, 95)]).toEqual([true, true, true]); // la zone d'Aster, la plage
    expect([shown(93, 85), shown(84, 86)]).toEqual([false, false]); // les zones de Rivet et d'Ondin
    // Ondin là (même endormi) : sa zone, le ruisseau compris
    const v2 = veiledCellsOf({ state: { ...big, villagers: [{ id: 'ponton' }, { id: 'puits' }] }, n: 144, zoneOf: () => 0, prologue: true });
    expect(v2.has(87 * 144 + 82)).toBe(false);
    // Aster attend encore dans les vagues (le matin, avant sa scène) : rien ne se découvre que la plage
    const v3 = veiledCellsOf({ state: big, n: 144, zoneOf: () => 0, prologue: true, waiting: ['ponton'] });
    expect([v3.has(92 * 144 + 85), v3.has(100 * 144 + 92), v3.has(95 * 144 + 100)]).toEqual([true, true, false]);
  });
  it('les zones : une par personnage, sans se chevaucher, chacune contient la place de son bâtiment (serveur : world/places.js)', () => {
    // Les places d'une île à la plage, coin de la grande emprise 3 × 3 (mêmes valeurs que le serveur)
    const BEACH = { foyer: [98, 92], ponton: [87, 98], atelier: [95, 82], puits: [86, 86], carriere: [86, 69], potager: [73, 70], bosquet: [72, 86] };
    for (const z of ZONES) {
      const [x, y] = BEACH[z.site];
      expect([inRect(x, y, z.rect), inRect(x + 2, y + 2, z.rect)], z.id).toEqual([true, true]);
      for (const o of ZONES) {
        if (o === z) continue;
        const [ax, ay, aw, ah] = z.rect, [bx, by, bw, bh] = o.rect;
        expect(ax + aw <= bx || bx + bw <= ax || ay + ah <= by || by + bh <= ay, `${z.id} / ${o.id}`).toBe(true);
      }
    }
  });
  it('hors du prologue, ou pour un compte d’avant la bible : rien sous la brume', () => {
    expect(veiled(state('ramasser'), false).size).toBe(0);
    expect(veiled({ ...state('ramasser'), brume: { tutorial: false, quest: { id: 'ramasser' } } }).size).toBe(0);
  });
});
