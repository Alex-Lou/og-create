import { describe, it, expect } from 'vitest';
import { IN_WORDS, READY_WORD, stirWord, soupAt, SOUP } from '@/game/cookFx';
import { ITEMS, TURNS } from '@/game/cooking';

// Le spectacle de la marmite d’Agathe
describe('le spectacle de la marmite', () => {
  it('donne un bruit à chaque ingrédient', () => {
    ITEMS.forEach(id => expect(IN_WORDS[id]).toMatch(/!$/));
  });
  it('donne un mot à chaque tour de louche, le dernier pour le bouillon prêt', () => {
    expect(stirWord(1, 3)).toBe('Flic-flac !');
    expect(stirWord(2, 3)).toBe('Blop blop !');
    expect(stirWord(TURNS, TURNS)).toBe(READY_WORD);
  });
  it('donne une teinte de bouillon à chaque cran, bornée', () => {
    expect(soupAt(-1)).toBe(SOUP[0]);
    expect(soupAt(ITEMS.length + TURNS)).toBe(SOUP[ITEMS.length + TURNS]);
    expect(soupAt(99)).toBe(SOUP[SOUP.length - 1]);
  });
});
