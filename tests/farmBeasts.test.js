import { describe, it, expect } from 'vitest';
import { LIKES, GIVES, isShe, moodLine, givesLine, readyLine, eyebrowOf } from '@/world/farmBeasts';

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
    expect(givesLine(hen)).toBe('Contente, elle remplit sa bulle d’œufs : 4 œufs par jour, comptés en vivres.');
    expect(givesLine(pig)).toBe('Content, il remplit sa bulle de truffes : 6 vivres par jour.');
  });
  it('le poulailler de Marcelle : des œufs dans la bulle ; le coq veille, le poussin grandit, Réglisse juge', () => {
    const coq = { id: 'coq', species: 'rooster', name: 'Coquelicot', daily: 0 };
    const chick = { id: 'poulette-muscade', species: 'chick', name: 'Pépite', daily: 0, chick: true };
    expect([readyLine({ ...hen, ready: 1 }), readyLine({ ...hen, ready: 3 }), readyLine({ ...pig, ready: 2 })])
      .toEqual(['1 œuf dans sa bulle', '3 œufs dans sa bulle', '2 vivres dans sa bulle']);
    expect([givesLine(coq), givesLine(chick), givesLine({ species: 'hen', name: 'Réglisse', daily: 0 })])
      .toEqual(['Coquelicot ne pond pas. Il veille.', 'Trop petit pour pondre : il grandit.', 'Réglisse ne pond pas. Elle juge.']);
    expect([isShe(coq), isShe(chick)]).toEqual([false, false]);
    expect([eyebrowOf(hen), eyebrowOf(coq), eyebrowOf(chick), eyebrowOf(pig)]).toEqual(['Poule de Marcelle', 'Coq de Marcelle', 'Poussin de Marcelle', 'Bête de la ferme']);
    expect([LIKES.rooster, LIKES.chick].every(Boolean)).toBe(true);
  });
});
