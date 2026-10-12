import { describe, it, expect } from 'vitest';
import { solve, covered } from '@/world/crafts';

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
