import { describe, it, expect } from 'vitest';
import { nth, PLACE_WORDS, MISS_WORD, FULL_WORD, MADE_WORD } from '@/game/craftFx';

// Le spectacle de l'assemblage
describe("le spectacle de l'assemblage", () => {
  it('donne un mot à chaque pièce posée, à tour de rôle', () => {
    expect(nth(PLACE_WORDS, 0)).toBe('Clac !');
    expect(nth(PLACE_WORDS, 1)).toBe('Tic !');
    expect(nth(PLACE_WORDS, 2)).toBe('Clac !');
  });
  it('donne un mot au raté, au gabarit rempli et à la création', () => {
    expect([MISS_WORD, FULL_WORD, MADE_WORD]).toEqual(['Hmm ?', 'Tadam !', 'Ziiing !']);
  });
});
