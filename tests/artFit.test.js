import { describe, it, expect } from 'vitest';
import { artFit } from '@/world/crafts';

// Le dessin d'une création sur son gabarit (CraftPuzzle, choix de l'auteur, 15 oct.) : son corps (sans halo ni ombre
// douce, world/artBody.js) le plus grand possible et centré ; le halo déborde autour
describe('le dessin d’une création sur son gabarit', () => {
  it('sans corps mesuré : tout le gabarit (le dessin s’y loge entier)', () => {
    expect(artFit(null, 3, 4)).toEqual({ x: 0, y: 0, w: 3, h: 4 });
  });
  it('une torche haute et fine, son halo autour : le corps remplit la hauteur, centré', () => {
    // vignette 1 × 2 (ratio 0,5) ; le corps : la moitié du milieu en largeur, toute la hauteur
    const fit = artFit({ x: 0.25, y: 0, w: 0.5, h: 1, ratio: 0.5 }, 1, 4);
    expect(fit.h).toBeCloseTo(4);
    expect(fit.w).toBeCloseTo(2);
    // le corps (de x + 0,25 × w à x + 0,75 × w) tient pile dans la case ; le halo déborde des deux côtés
    expect(fit.x + 0.25 * fit.w).toBeCloseTo(0);
    expect(fit.x + 0.75 * fit.w).toBeCloseTo(1);
    expect(fit.y).toBeCloseTo(0);
  });
  it('une porte petite dans une grande vignette : son corps prend tout le gabarit', () => {
    const body = { x: 0.3, y: 0.2, w: 0.4, h: 0.6, ratio: 72 / 56 };
    const fit = artFit(body, 3, 4);
    const [bw, bh] = [body.w * fit.w, body.h * fit.h];
    // le corps touche deux bords du gabarit, reste dedans, et ses proportions sont gardées
    expect(Math.max(bw / 3, bh / 4)).toBeCloseTo(1);
    expect(bw).toBeLessThanOrEqual(3 + 1e-9);
    expect(bh).toBeLessThanOrEqual(4 + 1e-9);
    expect(fit.w / fit.h).toBeCloseTo(body.ratio);
    // centré
    expect(fit.x + (body.x + body.w / 2) * fit.w).toBeCloseTo(1.5);
    expect(fit.y + (body.y + body.h / 2) * fit.h).toBeCloseTo(2);
  });
});
