// Les créations d'île de la bibliothèque (design/bibliotheque/svg/decor/creations) dans le jeu : chaque création a son
// dessin, au cadre des décors du jeu × 1,25 ; son animation suit decor.json ; ses lumières recalées restent les siennes.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { CRAFT_SPRITES, craftLayers, craftLight } from '@/world/craftSprites';
import { creationLayer, ART_LIGHTS } from '@/world/creations';
import { PROP_BOX } from '@/world/palette';
import DECOR from '../design/bibliotheque/svg/decor/decor.json';

const ROOT = fileURLToPath(new URL('../design/bibliotheque/svg/decor/', import.meta.url));

describe('les créations d\'île de la bibliothèque', () => {
  it('chaque création du jeu a son dessin dans la bibliothèque, et rien que lui', () => {
    for (const id of Object.keys(CRAFT_SPRITES)) {
      expect(creationLayer(id), id).not.toBe(null);
      expect(craftLayers(id).map(l => l.key), id).toEqual([`creation-${id}-0`]);
    }
  });

  it('chaque image est calée sur le cadre des décors du jeu × 1,25', () => {
    const want = [PROP_BOX.x, PROP_BOX.y, PROP_BOX.w, PROP_BOX.h].map(v => v * 1.25).join(' ');
    for (const [id, art] of Object.entries(DECOR.creations)) {
      for (const file of art.fichiers) {
        expect(readFileSync(ROOT + file, 'utf8').match(/viewBox="([^"]+)"/)[1], `${id} ${file}`).toBe(want);
      }
    }
  });

  it('l\'animation suit ses images et leur durée (girouette : 4 images de 300 ms)', () => {
    expect(DECOR.creations.girouette.fichiers.length).toBe(4);
    const frames = [0, 0.29, 0.31, 0.61, 0.91, 1.21].map(t => creationLayer('girouette', t).key);
    expect(frames).toEqual(['creation-girouette-0', 'creation-girouette-0', 'creation-girouette-1', 'creation-girouette-2', 'creation-girouette-3', 'creation-girouette-0']);
    expect(creationLayer('cloture', 12.3).key).toBe('creation-cloture-0');
  });

  it('les lumières recalées gardent leur rayon et leur couleur ; les autres ne bougent pas', () => {
    expect(craftLight('lanterne')).toEqual([...ART_LIGHTS.lanterne, 20, '255,214,130']);
    expect(craftLight('igloo')).toEqual([...ART_LIGHTS.igloo, 12, '255,214,140']);
    expect(craftLight('brasero')).toEqual([0, 0, 24, 22, '255,170,90', true]);
    expect(craftLight('banc')).toBe(null);
  });
});
