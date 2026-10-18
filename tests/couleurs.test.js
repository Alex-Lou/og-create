// Les couleurs des personnages (design/personnages/couleurs.js), la règle du papier néon : les ombres gardent leur
// teinte et refroidissent vers le violet, le délavé de la mer ne tourne jamais au beige, le trait des personnages est
// l'encre indigo ; et le cache des calculs reste borné
import { describe, it, expect } from 'vitest';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const C = require('../design/personnages/couleurs.js');
const rgb = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16));
// l'écart de teinte (en degrés) entre une couleur et la nuit violette
const versNuit = c => { const d = Math.abs(C.hsl(c)[0] - C.hsl(C.NUIT)[0]) % 360; return Math.min(d, 360 - d); };

describe('couleurs des personnages', () => {
  it('une ombre descend vers la nuit violette, jamais vers le brun', () => {
    for (const c of ['#E8705A', '#F2C04B', '#C9B080', '#5E3A22', '#7EC4A0', '#3E5A8C', '#F2C9A0']) {
      // l'ombre d'avant : la même teinte, assombrie, sans plus (elle tirait vers le brun)
      const [h, s, l] = C.hsl(c), brune = C.hex([h, s, l * 0.74]);
      // sa teinte se rapproche du violet de la nuit (couleurs.js : NUIT)
      expect(versNuit(C.ton(c, 0.74))).toBeLessThan(versNuit(brune));
      expect(C.clarte(C.ton(c, 0.74))).toBeLessThan(C.clarte(c));
    }
  });
  it('un éclaircissement garde la teinte', () => {
    const [h] = C.hsl('#3E5A8C'), [h2] = C.hsl(C.ton('#3E5A8C', 1.28));
    expect(Math.abs(h - h2)).toBeLessThan(1);
  });
  it('le délavé des tissus chauds tire vers le pastel froid, pas vers le beige', () => {
    for (const c of ['#F2C04B', '#F2A65A', '#C9B080', '#B07A48']) {
      const [r, , b] = rgb(C.delave(c)), [r0, , b0] = rgb(c);
      expect(b / r).toBeGreaterThan(b0 / r0);
      expect(C.clarte(C.delave(c))).toBeGreaterThan(C.clarte(c) - 0.02);
    }
  });
  it('un dessin de personnage passe à l\'encre indigo', () => {
    expect(C.enPersonnage(`<path stroke="${C.ENCRE_KIT}"/><g fill="${C.ENCRE_KIT}"/>`)).toBe(`<path stroke="${C.ENCRE}"/><g fill="${C.ENCRE}"/>`);
  });
  it('le cache est borné et rend toujours le même résultat', () => {
    let appels = 0;
    const f = C.memo(x => { appels++; return x * 2; }, 3);
    expect(f(1)).toBe(2); expect(f(1)).toBe(2);
    expect(appels).toBe(1);
    for (let i = 2; i < 10; i++) f(i);
    // plein, il s'est vidé : 1 est recalculé, mais juste
    expect(f(1)).toBe(2);
    expect(appels).toBe(10);
  });
});
