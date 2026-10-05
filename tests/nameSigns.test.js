import { describe, it, expect } from 'vitest';
import { NAME_SIGNS, NAME_SIGN_STYLES, nameSignLayers, nameSignSwing, nameSignLight, fitName, cleanSignName } from '@/world/nameSigns';

describe('enseignes', () => {
  it('dessine les six styles du serveur, calque par calque, avec un cadre pour le nom', () => {
    expect(NAME_SIGN_STYLES).toEqual(['bois', 'ardoise', 'fer', 'laiton', 'fleurie', 'lanterne']);
    for (const style of NAME_SIGN_STYLES) {
      for (const t of [0, 0.37, 1.9]) {
        const layers = nameSignLayers(style, t);
        expect(layers.length).toBeGreaterThan(0);
        for (const layer of layers) {
          expect(layer.key).toMatch(new RegExp(`^name-sign-${style}-\\d+-\\d+$`));
          expect(layer.make().svg).toMatch(/^<svg/);
        }
      }
      const { text } = NAME_SIGNS[style];
      expect(text.w).toBeGreaterThan(20);
      expect(text.size).toBeGreaterThan(6);
    }
    // Style inconnu : la planche de bois
    expect(nameSignLayers('neon', 0)[0].key).toBe('name-sign-neon-0-0');
  });
  it('balance le fer forgé au rythme de son calque, éclaire la lanterne la nuit', () => {
    expect(nameSignSwing('bois', 1)).toBeNull();
    const swing = nameSignSwing('fer', 0.3);
    expect(swing.pivot).toEqual([0, -43]);
    expect(Math.abs(swing.angle)).toBeLessThanOrEqual(0.06);
    expect(nameSignSwing('fer', 0).angle).toBe(0);
    expect(nameSignLight('lanterne')).toHaveLength(2);
    expect(nameSignLight('bois')).toEqual([]);
  });
  it('fait tenir le nom dans son cadre : corps réduit, puis resserré', () => {
    const look = NAME_SIGNS.bois;
    const measure = per => size => size * per;
    expect(fitName(look, measure(2))).toEqual({ size: look.text.size, scale: 1 });
    const smaller = fitName(look, measure(5));
    expect(smaller.scale).toBe(1);
    expect(smaller.size * 5).toBeCloseTo(look.text.w);
    const squeezed = fitName(look, measure(12));
    expect(squeezed.size).toBe(6);
    expect(squeezed.scale).toBeCloseTo(look.text.w / 72);
  });
  it('nettoie le nom saisi comme le serveur', () => {
    expect(cleanSignName('  Zoé   des Îles ')).toBe('Zoé des Îles');
    expect(cleanSignName('Jean-Pierre')).toBe('Jean-Pierre');
    expect(cleanSignName('L’Île')).toBe('L’Île');
    for (const bad of ['A', '', 'a--b', '-ab', '<b>', 'abcdefghijklmno', null]) expect(cleanSignName(bad)).toBeNull();
  });
});

describe('noms choisis (bâtiments, quartiers)', async () => {
  const { cleanName, NAME_MAX } = await import('@/utils/names');
  it('suivent les règles du serveur, jusqu’à 22 caractères', () => {
    expect(NAME_MAX).toBe(22);
    expect(cleanName('  Port   de la Lune bleue ')).toBe('Port de la Lune bleue');
    expect(cleanName('L’Anse-aux-Fées')).toBe('L’Anse-aux-Fées');
    for (const bad of ['x', 'x'.repeat(23), '-ab', '<b>', '']) expect(cleanName(bad)).toBeNull();
    expect(cleanName('Port de la Lune', 14)).toBeNull();
  });
});
