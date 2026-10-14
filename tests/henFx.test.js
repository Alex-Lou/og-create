import { describe, it, expect } from 'vitest';
import { nth, CATCH_WORDS, HOME_WORD } from '@/game/henFx';

// Le spectacle de la chasse aux poules
describe('le spectacle de la chasse aux poules', () => {
  it('donne un mot à chaque poule prise, à tour de rôle, et un mot à la fin', () => {
    expect(nth(CATCH_WORDS, 0)).toBe('Hop !');
    expect(nth(CATCH_WORDS, 3)).toBe('Attrapée !');
    expect(HOME_WORD).toBe('Au nid !');
  });
});
