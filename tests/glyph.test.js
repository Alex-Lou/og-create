import { describe, expect, it } from 'vitest';
import { glyphSrc } from '@/utils/glyph';
import { ICONS } from '@/utils/icons';

describe('glyphe d’un élément', () => {
  it('un dessin du jeu donne son image', () => {
    expect(glyphSrc('svg:phare')).toBe('/icons/elements/phare.svg');
    expect(glyphSrc('svg:etoile-de-mer')).toBe('/icons/elements/etoile-de-mer.svg');
  });
  it('une icône de l’interface donne son dessin, à taille fixe pour un canvas', () => {
    for (const name of Object.keys(ICONS)) {
      const src = glyphSrc(`ui:${name}`);
      expect(src.startsWith('data:image/svg+xml')).toBe(true);
      expect(decodeURIComponent(src)).toMatch(/<svg width="256" height="256" xmlns="http:\/\/www\.w3\.org\/2000\/svg" viewBox="0 0 64 64">/);
    }
    expect(glyphSrc('ui:nope')).toBeNull();
    expect(glyphSrc('ui:toString')).toBeNull();
    expect(glyphSrc('ui:../coin')).toBeNull();
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
