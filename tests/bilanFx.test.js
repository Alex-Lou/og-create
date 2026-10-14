import { describe, it, expect } from 'vitest';
import { tierOfStars, clapAt, STAR_MS, IMPACT_MS } from '@/game/bilanFx';

// Le spectacle du bilan d'un niveau
describe('le spectacle du bilan', () => {
  it('fait dire à la dernière étoile le palier de son compte, rien sans étoile', () => {
    expect(tierOfStars(0)).toBe(null);
    expect(tierOfStars(1).label).toBe('Joli !');
    expect(tierOfStars(2).label).toBe('Superbe !');
    expect(tierOfStars(3).label).toBe('Clair de lune !');
  });
  it('fait claquer les étoiles l’une après l’autre, à leur image de frappe', () => {
    expect(clapAt(1)).toBe(IMPACT_MS);
    expect(clapAt(3) - clapAt(2)).toBe(STAR_MS);
  });
});
