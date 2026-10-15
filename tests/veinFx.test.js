import { describe, it, expect } from 'vitest';
import { nth, nextFind, tierOfFinds, GEM_FX, HIT_WORDS } from '@/game/veinFx';

// Le spectacle du Filon : mots, pierres d'affilée, paliers
describe('le spectacle du Filon', () => {
  it('donne ses mots à chaque pierre et à chaque coup, à tour de rôle', () => {
    expect(nth(GEM_FX.diamant.words, 0)).toBe('Clinnng !');
    expect(nth(HIT_WORDS, 4)).toBe('Toc !');
  });
  it('allonge la série d’une pierre, la casse sur un bloc vide', () => {
    expect(nextFind(2, 'rubis')).toBe(3);
    expect(nextFind(2, null)).toBe(0);
  });
  it('monte de palier avec les pierres d’affilée', () => {
    expect(tierOfFinds(1).label).toBe(null);
    expect(tierOfFinds(2).label).toBe('Joli !');
    expect(tierOfFinds(9).label).toBe('Clair de lune !');
  });
});
