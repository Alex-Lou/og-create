import { describe, it, expect } from 'vitest';
import { talkLine, giftLine, rewardText, awaits } from '@/world/friends';

describe('amitié des habitants', () => {
  it('chaque habitant a une réplique par cœur, de 0 à 5', () => {
    for (const id of ['potager', 'carriere', 'bosquet', 'puits', 'ponton', 'atelier', 'foyer']) {
      const lines = [0, 1, 2, 3, 4, 5].map(h => talkLine(id, h));
      expect(new Set(lines).size).toBe(6);
      expect(talkLine(id, 9)).toBe(lines[5]);
    }
  });
  it('remercie selon le cadeau, nomme les récompenses, sait qui attend une visite', () => {
    const rose = { loves: 'water', likes: 'food' };
    expect(giftLine('potager', rose, 'water')).toMatch(/eau/);
    expect(giftLine('potager', rose, 'food')).toMatch(/merci/i);
    expect(giftLine('potager', rose, 'stone')).toMatch(/intention/);
    expect(rewardText({ kind: 'coins', amount: 40 })).toBe('40 écus');
    expect(rewardText({ kind: 'chest', rarity: 'epique' })).toBe('Coffre épique');
    expect(awaits({ talked: true, gifted: false })).toBe(true);
    expect(awaits({ talked: true, gifted: true })).toBe(false);
  });
});
