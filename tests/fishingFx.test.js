import { describe, it, expect } from 'vitest';
import { fishWord, nextStreak, tierOfStreak, FISH_FX, MISS_WORDS } from '@/game/fishingFx';
import { tierAt, TIERS } from '@/game/stage/tiers';

// Le spectacle de la Pêche : mots, prises d'affilée, paliers
describe('le spectacle de la Pêche', () => {
  it('donne ses mots à chaque prise, à tour de rôle, et un mot gentil au raté', () => {
    expect(fishWord('dore', 0)).toBe(FISH_FX.dore.words[0]);
    expect(fishWord('gardon', 4)).toBe(FISH_FX.gardon.words[1]);
    expect(fishWord(null, 1)).toBe(MISS_WORDS[1]);
  });
  it('allonge la série d’un poisson, la garde sur une botte, la casse sur un raté', () => {
    expect(nextStreak(2, 'truite')).toBe(3);
    expect(nextStreak(2, 'botte')).toBe(2);
    expect(nextStreak(2, null)).toBe(0);
  });
  it('monte de palier avec les prises d’affilée', () => {
    expect(tierOfStreak(2).label).toBe(null);
    expect(tierOfStreak(3).label).toBe('Joli !');
    expect(tierOfStreak(14).label).toBe('Clair de lune !');
  });
  it('partage les mêmes paliers féeriques entre les jeux', () => {
    expect(tierAt(0, [1, 2, 3, 4, 5])).toBe(TIERS[0]);
    expect(tierAt(9, [1, 2, 3, 4, 5]).rank).toBe(5);
  });
});
