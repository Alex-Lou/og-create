// Les niveaux des jeux à grille (game/levels.js) : mêmes vecteurs que test/niveaux.test.js du serveur
import { describe, it, expect } from 'vitest';
import { goalOf, starsOf, bonusOf, outcomeOf, openOf, playable } from '@/game/levels';
import { veinOf, pickingOf, fishingOf, replay, limitOf, VEIN } from '@/game/minigames';
import { replay as replayHarvest } from '@/game/harvest';

describe('les niveaux et les étoiles', () => {
  it('les objectifs montent doucement ; les étoiles suivent la marge ; le bonus ne paie que les nouvelles', () => {
    expect([1, 15, 30].map(n => goalOf('recolte', n).need)).toEqual([30, 59, 90]);
    expect([1, 15, 30].map(n => goalOf('filon', n).need)).toEqual([2, 4, 7]);
    expect([1, 15, 30].map(n => goalOf('cueillette', n).need)).toEqual([6, 15, 24]);
    expect(goalOf('filon', 1).text).toBe('Trouve 2 pierres précieuses');
    expect([null, 15, 12, 11, 8, 7].map(at => starsOf(at, 15))).toEqual([0, 1, 1, 2, 2, 3]);
    expect([bonusOf(0, 3), bonusOf(1, 3), bonusOf(2, 1), bonusOf(0, 1)]).toEqual([20, 15, 0, 5]);
    expect(outcomeOf('recolte', 1, { totals: [6, 18, 31, 40] }, 15)).toEqual({ need: 30, at: 3, stars: 3 });
    expect(outcomeOf('filon', 1, { at: [9, 20] }, 26)).toEqual({ need: 2, at: 20, stars: 1 });
    expect(outcomeOf('cueillette', 1, { at: [1000, 2000] }, 40000)).toEqual({ need: 6, at: null, stars: 0 });
    expect(openOf([])).toEqual({ seasons: 1, max: 1, stars: 0 });
    expect(openOf([1, 2])).toEqual({ seasons: 1, max: 3, stars: 3 });
    expect(openOf(Array(10).fill(1))).toEqual({ seasons: 1, max: 10, stars: 10 });
    expect(openOf(Array(10).fill(2))).toEqual({ seasons: 2, max: 11, stars: 20 });
    expect([playable([1], 2), playable([1], 3), playable([], 0)]).toEqual([true, false, false]);
  });

  it('les rejeux disent quand chaque prise arrive', () => {
    const vein = veinOf(1234);
    const taps = [];
    for (const i of [2, 8, 14, 20, 26, 32, 38]) for (let k = 0; k < vein.hard[i] && taps.length < VEIN.strokes; k++) taps.push(i);
    const dug = replay('filon', 1234, taps);
    expect(dug.at.length).toBe(dug.detail.length);
    expect(dug.at.every((s, i) => s >= 1 && s <= taps.length && (i === 0 || s > dug.at[i - 1]))).toBe(true);
    const events = pickingOf(77).filter(e => e.kind !== 'guepes').slice(0, 3);
    expect(replay('cueillette', 77, events.map(e => [e.at, e.cell])).at).toEqual(events.map(e => e.at));
    expect(replayHarvest(5, ['stone', 'wood', 'water', 'food'], [], 15).totals).toEqual([]);
  });

  it('les deux premières parties sont courtes : moins de coups, moins de temps (mêmes vecteurs que le serveur)', () => {
    expect([limitOf('filon', true), limitOf('cueillette', true), limitOf('peche', true), limitOf('filon')]).toEqual([12, 20000, 25000, 26]);
    expect(replay('filon', 1234, Array(13).fill(0), true).ok).toBe(false);
    expect(fishingOf(9, 25000).every(f => f.t0 < 23500)).toBe(true);
    expect(pickingOf(9, 20000).every(e => e.until <= 20000)).toBe(true);
    expect(fishingOf(9).length).toBeGreaterThan(fishingOf(9, 25000).length);
  });
});
