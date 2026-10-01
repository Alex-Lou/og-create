import { describe, expect, it } from 'vitest';
import { ringsFor, sigilPaths } from '@/utils/sigil';
import { DEFAULT_EMBLEM, DEFAULT_FRAME, EMBLEM_ART, FRAME_ART } from '@/utils/cabinet';

const PATH = /^[MLAQZaz0-9.\s-]+$/;

describe('sceau vivant', () => {
  it('le même état redonne le même sceau', () => {
    expect(sigilPaths([0.5, 1, 0.2], 2)).toEqual(sigilPaths([0.5, 1, 0.2], 2));
  });
  it('une famille complète porte une pointe d’or', () => {
    expect(sigilPaths([1, 0.2, 0.2]).gold).not.toBe('');
    expect(sigilPaths([0.9, 0.2, 0.2]).gold).toBe('');
  });
  it('un anneau tous les cinq succès, quatre au plus', () => {
    expect([0, 4, 5, 19, 20, 99].map(ringsFor)).toEqual([0, 0, 1, 3, 4, 4]);
  });
});

describe('gravures du Cabinet', () => {
  it('les pièces de départ existent', () => {
    expect(FRAME_ART[DEFAULT_FRAME]).toBeDefined();
    expect(EMBLEM_ART[DEFAULT_EMBLEM]).toBeDefined();
  });
  it('chaque gravure est faite de tracés SVG valides, dans le repère du sceau', () => {
    for (const art of [...Object.values(FRAME_ART), ...Object.values(EMBLEM_ART)]) {
      expect(art.length).toBeGreaterThan(0);
      for (const stroke of art) {
        expect(stroke.d).toMatch(PATH);
        const numbers = stroke.d.match(/-?\d+(\.\d+)?/g).map(Number);
        expect(Math.max(...numbers)).toBeLessThanOrEqual(480);
        expect(Number.isNaN(Math.max(...numbers))).toBe(false);
      }
    }
  });
});
