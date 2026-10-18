// Les rencontres d'une créature sur cet appareil (world/sightings.js) : une série de touchers n'en fait qu'une ; une
// nouvelle rencontre compte GAP ms après la précédente
import { describe, it, expect } from 'vitest';
import { recordSighting, sightingOf, GAP } from '@/world/sightings';

describe('les rencontres sur cet appareil', () => {
  it('jamais croisée : zéro ; une série de touchers : une ; plus tard, une de plus, et la dernière avance', () => {
    expect(sightingOf('cerf')).toEqual({ count: 0, last: null });
    recordSighting('cerf', 1000);
    recordSighting('cerf', 1000 + GAP - 1);
    expect(sightingOf('cerf')).toEqual({ count: 1, last: 1000 });
    recordSighting('cerf', 1000 + GAP);
    expect(sightingOf('cerf')).toEqual({ count: 2, last: 1000 + GAP });
    // (chacune les siennes)
    expect(sightingOf('lapin').count).toBe(0);
  });
});
