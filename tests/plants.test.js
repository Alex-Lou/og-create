// Les plantes de la bibliothèque (design/bibliotheque/svg/plantes) dans le jeu : chaque sorte que l'île fait pousser a
// son dessin ; chaque dessin est calé sur le cadre du jeu × 1,25 ; la variante d'une plante ne dépend que de sa place.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { VARIANTS, plantLook } from '@/world/plants';
import { fitTo } from '@/world/library';
import { PROP_BOX } from '@/world/palette';
import { hash } from '@/world/scene';

const DIR = fileURLToPath(new URL('../design/bibliotheque/svg/plantes/', import.meta.url));
// Ce que natureOf (WorldView/terrain.js) fait pousser
const GROWN = ['tree', 'apple', 'birch', 'pine', 'autumn', 'palm', 'rock', 'rocks', 'crag', 'mossy', 'tuft', 'reeds', 'lily',
  'stump', 'heather', 'bush', 'snowpine', 'deadtree', 'cactus', 'flowers', 'mushrooms', 'log', 'shells', 'driftwood', 'nest'];

describe('les plantes de la bibliothèque', () => {
  it('chaque sorte qui pousse sur l\'île a son dessin, le dessin par défaut en tête', () => {
    for (const kind of GROWN) {
      expect(VARIANTS[kind]?.length, kind).toBeGreaterThan(0);
    }
    expect(VARIANTS.tree[0]).toBe('arbre');
    expect(VARIANTS.apple[0]).toBe('pommier');
    expect(VARIANTS.tuft[0]).toBe('touffe');
  });

  it('les variantes restent dans leur sorte (l\'arbre ne prend ni l\'automne ni l\'arbre mort)', () => {
    expect(VARIANTS.tree.every(name => !/automne|mort/.test(name))).toBe(true);
    expect(VARIANTS.pine.every(name => !name.includes('neige'))).toBe(true);
    expect(VARIANTS.deadtree.every(name => name.startsWith('arbre_mort'))).toBe(true);
    expect(VARIANTS.rocks).not.toContain('rochers_moussus');
    expect(VARIANTS.mushrooms).not.toContain('champignons_nuit');
    expect(VARIANTS.mushrooms.some(name => name.includes('nuit'))).toBe(false);
  });

  it('un dessin redessiné en variantes dans la bibliothèque varie sur l\'île', () => {
    expect(VARIANTS.cactus).toContain('cactus_boule');
    expect(VARIANTS.stump).toContain('souche_grise_champignons');
    expect(VARIANTS.log).toContain('rondin_petit_gris');
  });

  it('chaque dessin est calé sur le cadre du jeu × 1,25 et se ramène à sa taille', () => {
    const want = [PROP_BOX.x, PROP_BOX.y, PROP_BOX.w, PROP_BOX.h].map(v => v * 1.25).join(' ');
    for (const name of new Set(Object.values(VARIANTS).flat())) {
      const svg = readFileSync(`${DIR}${name}.svg`, 'utf8');
      expect(svg.match(/viewBox="([^"]+)"/)[1], name).toBe(want);
      const fitted = fitTo(svg, PROP_BOX);
      expect(fitted.match(/<svg[^>]*>/)[0], name).toContain(`width="${PROP_BOX.w}" height="${PROP_BOX.h}" viewBox="${want}"`);
    }
  });

  it('la variante ne dépend que de la place : la même d\'une fois à l\'autre, variée d\'une case à l\'autre', () => {
    expect(plantLook('tree', 12, 7)).toEqual(plantLook('tree', 12, 7));
    const seen = new Set();
    for (let y = 0; y < 40; y++) for (let x = 0; x < 40; x++) seen.add(plantLook('tree', x, y).name);
    expect([...seen].sort()).toEqual([...VARIANTS.tree].sort());
  });

  it('le tirage de la variante est libre de celui de la sorte (les cases où pousse une touffe ont toutes ses variantes)', () => {
    const seen = new Set();
    for (let y = 0; y < 80; y++) for (let x = 0; x < 80; x++) if (hash(x, y) < 0.1) seen.add(plantLook('tuft', x, y).name);
    expect([...seen].sort()).toEqual([...VARIANTS.tuft].sort());
  });

  it('une sorte sans dessin dans la bibliothèque garde son dessin par code', () => {
    expect(plantLook('lantern', 3, 4)).toBe(null);
  });
});
