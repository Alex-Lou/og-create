import { describe, it, expect } from 'vitest';
import { trackOf } from '@/game/levelTrack';

// La piste des niveaux du choix du niveau
describe('la piste des niveaux', () => {
  it('montre les 10 cases de la saison du niveau choisi, leurs étoiles et celles qui sont ouvertes', () => {
    const t = trackOf([3, 2, 3, 1], 2);
    expect(t.season).toBe(1);
    expect(t.pips).toHaveLength(10);
    expect(t.pips.map(p => p.stars).slice(0, 5)).toEqual([3, 2, 3, 1, 0]);
    expect(t.pips.filter(p => p.open).map(p => p.level)).toEqual([1, 2, 3, 4, 5]);
    expect(t.pips.find(p => p.current).level).toBe(2);
  });
  it('dit ce qui manque pour ouvrir la saison suivante, plus rien une fois ouverte', () => {
    expect(trackOf([3, 2, 3, 1], 1).next).toEqual({ season: 2, have: 9, need: 20 });
    const full = [3, 3, 3, 3, 3, 3, 2, 0, 0, 0];
    expect(trackOf(full, 1).next).toBe(null);
    expect(trackOf(full, 11).season).toBe(2);
    expect(trackOf(full, 11).next).toEqual({ season: 3, have: 0, need: 20 });
  });
});
