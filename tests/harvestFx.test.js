import { describe, it, expect } from 'vitest';
import { tierOf, wordOf, streakOf, TIERS, KIND_FX } from '@/game/harvestFx';

// Le spectacle de la Récolte : paliers, onomatopées, séries
describe('le spectacle d’un coup', () => {
  it('monte de palier avec la longueur de la chaîne', () => {
    expect(tierOf(3).label).toBe(null);
    expect(tierOf(4).label).toBe('Bien !');
    expect(tierOf(6).label).toBe('Super !');
    expect(tierOf(8).label).toBe('Génial !');
    expect(tierOf(11).label).toBe('Fabuleux !');
    expect(tierOf(36).label).toBe('LÉGENDAIRE !');
    // (chaque palier secoue plus fort que le précédent)
    TIERS.slice(1).forEach((t, i) => expect(t.shake).toBeGreaterThan(TIERS[i].shake));
  });
  it('donne à chaque ressource ses onomatopées, à tour de rôle', () => {
    expect(wordOf('wood', 0)).toBe(KIND_FX.wood.words[0]);
    expect(wordOf('wood', 4)).toBe(KIND_FX.wood.words[1]);
    expect(wordOf('inconnue', 0)).toBe(KIND_FX.stone.words[0]);
  });
  it('compte la série de belles chaînes jusqu’au dernier coup', () => {
    expect(streakOf([])).toBe(0);
    expect(streakOf([5, 3, 6, 7])).toBe(2);
    expect(streakOf([5, 6, 3])).toBe(0);
  });
});
