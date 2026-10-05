import { describe, it, expect } from 'vitest';
import { cellsOf, turn, sizeOf, coverOf, fits, covered, tierHint, TIER_LABEL } from '@/world/crafts';

describe('créations d’île', () => {
  it('lit un gabarit et tourne une pièce comme le serveur', () => {
    expect(cellsOf(['x.x', 'xxx'])).toEqual([[0, 0], [2, 0], [0, 1], [1, 1], [2, 1]]);
    // Mêmes vecteurs que test/crafts.test.js (serveur)
    expect(turn([[0, 0], [1, 0]], 1)).toEqual([[0, 0], [0, 1]]);
    expect(turn([[0, 0], [1, 0], [1, 1]], 4)).toEqual(turn([[0, 0], [1, 0], [1, 1]], 0));
    expect(turn([[0, 0], [1, 0], [1, 1]], 1)).toEqual([[1, 0], [0, 1], [1, 1]]);
    expect(turn([[0, 0], [1, 0], [1, 1]], -1)).toEqual(turn([[0, 0], [1, 0], [1, 1]], 3));
    expect(sizeOf([[0, 0], [1, 0], [1, 1]])).toEqual({ w: 2, h: 2 });
  });

  it('sait si une pièce tient et si le gabarit est rempli', () => {
    const shape = ['xx', 'xx'];
    const pieces = [[[0, 0], [1, 0]], [[0, 0], [1, 0]]];
    const a = { piece: 0, rot: 0, x: 0, y: 0 };
    expect(coverOf(pieces, a)).toEqual(['0,0', '1,0']);
    expect(fits(shape, pieces, [], a)).toBe(true);
    expect(fits(shape, pieces, [], { piece: 0, rot: 0, x: 1, y: 0 })).toBe(false);
    expect(fits(shape, pieces, [a], { piece: 1, rot: 0, x: 0, y: 0 })).toBe(false);
    // La pièce elle-même ne se gêne pas (déplacement sur le gabarit)
    expect(fits(shape, pieces, [a], { piece: 0, rot: 1, x: 0, y: 0 })).toBe(true);
    expect(covered(shape, pieces, [a])).toBe(false);
    expect(covered(shape, pieces, [a, { piece: 1, rot: 0, x: 0, y: 1 }])).toBe(true);
    expect(covered(shape, pieces, [{ piece: 0, rot: 1, x: 0, y: 0 }, { piece: 1, rot: 1, x: 1, y: 0 }])).toBe(true);
  });

  it('dit ce qui ouvre un palier', () => {
    expect(TIER_LABEL.start).toBe('Débuts');
    expect(tierHint('I', { have: 12, need: 10 })).toBe('Finis le chapitre I du Livre, ou réussis 10 questions de l’Épreuve (10/10).');
    expect(tierHint('II', { have: 0, need: 10 })).toBe('Finis le chapitre II du Livre.');
  });
});
