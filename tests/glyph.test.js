import { describe, expect, it } from 'vitest';
import { glyphSrc } from '@/utils/glyph';
import { ICONS, libraryIcon } from '@/utils/icons';

describe('glyphe d’un élément', () => {
  it('un dessin du jeu donne son image', () => {
    expect(glyphSrc('svg:phare')).toBe('/icons/elements/phare.svg');
    expect(glyphSrc('svg:etoile-de-mer')).toBe('/icons/elements/etoile-de-mer.svg');
  });
  it('une icône de l’interface donne le dessin de la bibliothèque (les anciens noms y mènent aussi)', () => {
    for (const name of Object.keys(ICONS)) {
      expect(libraryIcon(name), name).toBeTruthy();
      expect(glyphSrc(`ui:${name}`)).toBe(libraryIcon(name));
    }
    expect(libraryIcon('stone')).toBe(libraryIcon('pierre'));
    expect(libraryIcon('coin')).toBe(libraryIcon('ecu'));
    for (const name of ['zoom_plus', 'coffre', 'grimoire', 'plein_ecran', 'garde_robe']) expect(glyphSrc(`ui:${name}`)).toBe(libraryIcon(name));
    expect(glyphSrc('ui:nope')).toBeNull();
    expect(glyphSrc('ui:toString')).toBeNull();
    expect(glyphSrc('ui:__proto__')).toBeNull();
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
