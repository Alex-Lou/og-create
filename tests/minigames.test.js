import { describe, it, expect } from 'vitest';
import { fishingOf, veinOf, pickingOf, replay, catchAt, earnedOf, multOf, GAMES } from '@/game/minigames';

// Mêmes vecteurs que test/minigames.test.js du serveur : la graine 42 donne la même partie des deux côtés
describe('mini-jeux (moteur partagé avec le serveur)', () => {
  it('tire les mêmes parties que le serveur', () => {
    const fish = fishingOf(42);
    expect(fish).toHaveLength(40);
    expect(fish[0]).toEqual({ id: 0, lane: 2, kind: 'truite', dir: 1, speed: 0.314, t0: 400 });
    expect(fish[39]).toEqual({ id: 39, lane: 2, kind: 'gardon', dir: -1, speed: 0.221, t0: 41995 });
    const vein = veinOf(42);
    expect(vein.hard.join('')).toBe('213212123113211222112121111221121211112212');
    expect(vein.gems.map(g => (g ? g[0] : '.')).join('')).toBe('.......aq....aaqq...rrr....q......q......a');
    const berries = pickingOf(42);
    expect(berries).toHaveLength(47);
    expect(berries[0]).toEqual({ id: 0, cell: 9, kind: 'mure', at: 500, until: 2582 });
    expect(berries[46]).toEqual({ id: 46, cell: 12, kind: 'mure', at: 37445, until: 39157 });
  });
  it('rejoue les gestes comme le serveur', () => {
    const fish = fishingOf(42);
    const t = Math.round(fish[0].t0 + (0.6 / fish[0].speed) * 1000);
    expect(catchAt(fish, new Set(), t, 2).id).toBe(0);
    expect(replay('peche', 42, [[t, 2], [t + 300, 2]])).toEqual({ ok: true, raw: 4, detail: ['truite'], last: t + 300 });
    expect(replay('filon', 42, [20]).ok).toBe(false);
    expect(replay('cueillette', 42, [[600, 9], [700, 9]]).detail).toEqual(['mure']);
    expect([3, 5, 7].map(multOf)).toEqual([1, 1.4, 1.8]);
    expect(earnedOf(200, 5)).toBe(84);
    expect(Object.keys(GAMES)).toEqual(['peche', 'filon', 'cueillette']);
  });
});
