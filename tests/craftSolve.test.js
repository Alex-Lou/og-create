import { describe, it, expect } from 'vitest';
import { solve, covered, turn, turnKeep, homesOf, cellsOf } from '@/world/crafts';

// Le casse-tête d'une création : la main du tutoriel suit une solution calculée (CraftPuzzle, guided)
describe('la solution d’un gabarit', () => {
  it('remplit exactement le gabarit de la lanterne, chaque pièce une fois', () => {
    const shape = ['xxx', 'xxx', '.x.', '.x.'];
    const pieces = [[[0, 0], [0, 1], [1, 1]], [[0, 0], [1, 0], [1, 1]], [[0, 0], [0, 1]]];
    const plan = solve(shape, pieces);
    expect(plan).not.toBe(null);
    expect(covered(shape, pieces, plan)).toBe(true);
    expect(new Set(plan.map(s => s.piece)).size).toBe(pieces.length);
  });
  it('part de ce qui est déjà posé, et rend null quand c’est impossible', () => {
    const shape = ['xx'];
    const pieces = [[[0, 0]], [[0, 0]]];
    expect(solve(shape, pieces, [{ piece: 0, rot: 0, x: 1, y: 0 }])).toEqual([{ piece: 0, rot: 0, x: 1, y: 0 }, { piece: 1, rot: 0, x: 0, y: 0 }]);
    expect(solve(['x'], [[[0, 0], [1, 0]]])).toBe(null);
  });
});

// Les pièces portent chacune leur morceau du dessin : la place de chaque case dans une solution
describe('les morceaux du dessin', () => {
  it('tourne une pièce comme turn, sans changer l’ordre de ses cases', () => {
    const piece = [[0, 0], [1, 0], [0, 1]];
    for (let k = 0; k < 4; k++) {
      const kept = turnKeep(piece, k);
      expect([...kept].sort((a, b) => a[1] - b[1] || a[0] - b[0])).toEqual(turn(piece, k));
    }
    expect(turnKeep(piece, 1)).toEqual([[1, 0], [1, 1], [0, 0]]);
  });
  it('donne à chaque case de chaque pièce une case du gabarit, toutes différentes', () => {
    const shape = ['.xx.', 'xxxx', 'xxxx', '.xx.'];
    const pieces = [[[0, 0], [1, 0]], [[0, 0], [1, 0], [0, 1]], [[0, 0], [1, 0], [1, 1]], [[0, 0], [1, 0], [0, 1], [1, 1]]];
    const homes = homesOf(shape, pieces);
    const keys = homes.flatMap(h => h.cells.map(([x, y]) => `${x},${y}`));
    expect(new Set(keys)).toEqual(new Set(cellsOf(shape).map(([x, y]) => `${x},${y}`)));
    expect(homes.map(h => h.cells.length)).toEqual(pieces.map(p => p.length));
    expect(homesOf(['x'], [[[0, 0], [1, 0]]])).toBe(null);
  });
});
