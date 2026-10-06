import { describe, it, expect } from 'vitest';
import { LIKES, GIVES, isShe, moodLine, givesLine } from '@/world/farmBeasts';

// Les mots de la fiche d'une bête de ferme (bible, § 6.16) : le serveur décide, la fiche le dit
describe('fiche d’une bête de ferme', () => {
  const hen = { id: 'poule-rousse', species: 'hen', name: 'La poule rousse', daily: 4, fed: true, left: 9 * 3600000 };
  const pig = { id: 'cochon', species: 'pig', name: 'Le cochon', daily: 6, fed: false, left: 0 };
  it('chaque espèce de la ferme dit ce qu’elle aime et ce qu’elle donne', () => {
    for (const species of ['hen', 'cow', 'sheep', 'pig', 'goat']) {
      expect(LIKES[species]).toBeTruthy();
      expect(GIVES[species]).toBeTruthy();
    }
  });
  it('elle ou il, contente ou content, et combien d’heures encore', () => {
    expect(isShe(hen)).toBe(true);
    expect(isShe(pig)).toBe(false);
    expect(moodLine(hen)).toBe('Contente encore 9 h');
    expect(moodLine({ ...pig, fed: true, left: 20 * 60000 })).toBe('Content encore 1 h');
    expect(moodLine(pig)).toBe('A faim');
    expect(givesLine(hen)).toBe('Contente, elle remplit sa bulle d’œufs : 4 vivres par jour.');
    expect(givesLine(pig)).toBe('Content, il remplit sa bulle de truffes : 6 vivres par jour.');
  });
});
