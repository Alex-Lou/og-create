import { describe, it, expect } from 'vitest';
import { nth, nextPick, tierOfPicks, BERRY_FX } from '@/game/pickFx';

// Le spectacle de la Cueillette : mots, cueillettes d'affilée, paliers
describe('le spectacle de la Cueillette', () => {
  it('donne ses mots à chaque cueillette, à tour de rôle', () => {
    expect(nth(BERRY_FX.cepe.words, 0)).toBe('Ooh !');
    expect(nth(BERRY_FX.mure.words, 3)).toBe('Plop !');
  });
  it('allonge la série d’une baie, la casse sur les guêpes ou une baie perdue', () => {
    expect(nextPick(4, 'fraise')).toBe(5);
    expect(nextPick(4, 'guepes')).toBe(0);
    expect(nextPick(4, null)).toBe(0);
  });
  it('monte de palier avec les cueillettes d’affilée', () => {
    expect(tierOfPicks(2).label).toBe(null);
    expect(tierOfPicks(3).label).toBe('Joli !');
    expect(tierOfPicks(20).label).toBe('Clair de lune !');
  });
});
