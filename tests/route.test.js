// Le plus court chemin du village (world/village/paths.js : route, cherché vers le but) : sur des îles tirées au hasard,
// il coûte toujours autant que celui d'une recherche de référence qui fouille tout (Dijkstra simple), et il se marche
import { describe, it, expect } from 'vitest';
import { route } from '@/world/village/paths';

// (un tirage pseudo-aléatoire reproductible)
const rand = seed => () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const COST = { g: 6, p: 3, s: 6 };
function islandOf(n, r) {
  const ground = Array.from({ length: n * n }, () => { const v = r(); return v < 0.18 ? '#' : v < 0.4 ? 'p' : v < 0.5 ? 's' : 'g'; });
  const paved = new Set(Array.from({ length: n * n }, (_, i) => i).filter(() => r() < 0.08));
  const at = (x, y) => (x < 0 || y < 0 || x >= n || y >= n ? '#' : ground[y * n + x]);
  const M = { ground: at, height: () => 0, zone: () => 0, isPaved: (x, y) => paved.has(y * n + x) && at(x, y) !== '#' };
  return { n, M, walk: (x, y) => at(x, y) !== '#', step: () => true };
}
const stepCost = (grid, x, y) => (grid.M.isPaved(x, y) ? 2 : grid.M.ground(x, y) === 'p' ? 3 : COST[grid.M.ground(x, y)]);
function reference(grid, a, b) {
  const { n } = grid;
  const dist = new Map([[a.y * n + a.x, 0]]);
  const open = [a.y * n + a.x];
  while (open.length) {
    open.sort((p, q) => dist.get(p) - dist.get(q));
    const i = open.shift();
    const [x, y] = [i % n, Math.floor(i / n)];
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const [nx, ny] = [x + dx, y + dy];
      if (!grid.walk(nx, ny)) continue;
      const j = ny * n + nx;
      const d = dist.get(i) + stepCost(grid, nx, ny);
      if (d < (dist.has(j) ? dist.get(j) : Infinity)) {
        dist.set(j, d);
        open.push(j);
      }
    }
  }
  return dist.has(b.y * n + b.x) ? dist.get(b.y * n + b.x) : null;
}
const costOf = (grid, path) => path.slice(1).reduce((sum, c) => sum + stepCost(grid, c.x, c.y), 0);

describe('le plus court chemin', () => {
  it('cherché vers le but, il coûte autant que la recherche de référence, et chaque pas va d’une case à sa voisine', () => {
    const r = rand(7);
    for (let k = 0; k < 200; k++) {
      const grid = islandOf(14, r);
      const cell = () => { for (;;) { const c = { x: Math.floor(r() * 14), y: Math.floor(r() * 14) }; if (grid.walk(c.x, c.y)) return c; } };
      const [a, b] = [cell(), cell()];
      const path = route(grid, a, b);
      const best = reference(grid, a, b);
      if (best === null) {
        expect(path).toBeNull();
        continue;
      }
      expect(costOf(grid, path), `${k}`).toBe(best);
      expect(path[0]).toEqual(a);
      expect(path[path.length - 1]).toEqual(b);
      for (let i = 1; i < path.length; i++) expect(Math.abs(path[i].x - path[i - 1].x) + Math.abs(path[i].y - path[i - 1].y)).toBe(1);
    }
  });
});
