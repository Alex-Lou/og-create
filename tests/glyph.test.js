import { describe, expect, it } from 'vitest';
import { glyphSrc } from '@/utils/glyph';

describe('glyphe d’un élément', () => {
  it('un dessin du jeu donne son image', () => {
    expect(glyphSrc('svg:phare')).toBe('/icons/elements/phare.svg');
    expect(glyphSrc('svg:etoile-de-mer')).toBe('/icons/elements/etoile-de-mer.svg');
  });
  it('un emoji reste un emoji', () => {
    expect(glyphSrc('🔥')).toBeNull();
    expect(glyphSrc('')).toBeNull();
    expect(glyphSrc(undefined)).toBeNull();
  });
  it('aucune valeur ne peut devenir une adresse arbitraire', () => {
    for (const bad of ['svg:../secret', 'svg:https://x.fr/a', 'svg:Phare', 'svg:a b', 'svg:', 'svg:a.svg', 'javascript:alert(1)', `svg:${'a'.repeat(41)}`]) {
      expect(glyphSrc(bad)).toBeNull();
    }
  });
});
