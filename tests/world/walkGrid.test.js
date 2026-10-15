// La grille où l'on marche (world/village/paths.js : gridOf) : les objets du camp des naufragés (l'épave, les caisses…)
// sont des obstacles, comme les bâtiments ; personne ne s'y tient, ni ne s'y cache derrière le dessin (régression du
// 12 oct. : Lorena, au tutoriel, debout sur une case de l'épave, cachée par elle)
import { describe, it, expect } from 'vitest';
import { gridOf, nearestWalk, route } from '@/world/village/paths';

const N = 8;
const M = { ground: () => 's', height: () => 0, zone: () => 0 };
const base = { n: N, M, sites: [], owned: new Set([0]), crafts: [], props: [], annexes: [] };
// L'épave : 2 × 2 en (4, 4)
const wreck = [{ x: 4, y: 4 }, { x: 5, y: 4 }, { x: 4, y: 5 }, { x: 5, y: 5 }];

describe('la grille où l’on marche', () => {
  it('sans camp, les cases de l’épave sont praticables', () => {
    const grid = gridOf(base);
    expect(wreck.every(c => grid.walk(c.x, c.y))).toBe(true);
  });

  it('les cases du camp sont bloquées ; la case praticable la plus proche est à côté', () => {
    const grid = gridOf({ ...base, camp: wreck });
    expect(wreck.some(c => grid.walk(c.x, c.y))).toBe(false);
    expect(grid.walkable.some(c => wreck.some(w => w.x === c.x && w.y === c.y))).toBe(false);
    const near = nearestWalk(grid, { x: 5, y: 5 });
    expect(near && grid.walk(near.x, near.y)).toBe(true);
  });
});

describe('les portes d’enclos', () => {
  // (une clôture en travers de l'île, x = 4, sa porte en (4, 2))
  const fence = Array.from({ length: N }, (_, y) => ({ x: 4, y, craft: y === 2 ? 'porte' : 'cloture' }));
  it('un habitant passe par la porte, verrou ou pas, sans jamais s’y arrêter', () => {
    const grid = gridOf({ ...base, crafts: fence });
    const path = route(grid, { x: 1, y: 6 }, { x: 7, y: 6 });
    expect(path.some(c => c.x === 4 && c.y === 2)).toBe(true);
    expect(path.filter(c => c.x === 4).length).toBe(1);
    expect(grid.walk(4, 2)).toBe(false);
    expect(grid.walkable.some(c => c.x === 4)).toBe(false);
  });
  it('sans porte, la clôture ne se traverse pas', () => {
    const closed = fence.map(c => ({ ...c, craft: 'cloture' }));
    expect(route(gridOf({ ...base, crafts: closed }), { x: 1, y: 6 }, { x: 7, y: 6 })).toBe(null);
  });
});
