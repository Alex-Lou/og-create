// La tournée d'un habitant (world/village/residents.js : plannerOf) : il marche d'une place à l'autre, rien ne saute.
// Une place qu'aucun chemin ne rejoint (une marche du relief) n'est pas visitée : il reste où il est (régression du
// 18 oct. : Lorena, au tutoriel, sautait d'une case ou deux sur la plage, au pied de la falaise, canne à pêche en main)
import { describe, it, expect } from 'vitest';
import { gridOf, route } from '@/world/village/paths';
import { plannerOf } from '@/world/village/residents';

const N = 8;
// Du sable partout ; à partir de x = 4, deux marches plus haut : on ne monte pas d'une case à l'autre
const M = { ground: () => 's', height: x => (x >= 4 ? 2 : 0), zone: () => 0 };
const grid = gridOf({ n: N, M, sites: [], owned: new Set([0]), crafts: [], props: [], annexes: [] });
const routeOf = (a, b) => route(grid, a, b);
const same = (a, b) => a.x === b.x && a.y === b.y;
const near = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y) === 1;

describe('la tournée d’un habitant', () => {
  it('chaque marche part de là où la précédente s’est arrêtée, case à case, même quand une place tirée ne se rejoint pas', () => {
    const work = { x: 3, y: 3 };
    // (la flânerie tire parmi les cases à deux pas, celles d'en haut comprises : le cas se présente)
    expect(grid.walkable.some(c => c.x >= 4 && Math.abs(c.x - work.x) + Math.abs(c.y - work.y) <= 2)).toBe(true);
    const { planOf } = plannerOf({ grid, stops: [work], home: work, calm: true, routeOf });
    for (let k = 0; k < 12; k++) {
      for (let day = 0; day < 6; day++) {
        const { legs } = planOf({ id: `vil:${k}`, k, work }, false, day);
        legs.forEach((leg, i) => {
          const before = legs[(i + legs.length - 1) % legs.length].path;
          expect(same(leg.path[0], before[before.length - 1])).toBe(true);
          leg.path.slice(1).forEach((c, j) => expect(near(c, leg.path[j])).toBe(true));
          expect(leg.path.every(c => c.x < 4)).toBe(true);
        });
      }
    }
  });
});
