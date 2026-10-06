// Les créations d'île de la bibliothèque (design/bibliotheque/svg/decor/creations) dans le jeu : chaque création a son
// dessin, au cadre des décors du jeu × 1,25 ; son animation suit decor.json ; ses lumières recalées restent les siennes.
import { describe, it, expect, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { CRAFT_SPRITES, craftLayers, craftLight } from '@/world/craftSprites';
import { creationLayer, ART_LIGHTS, cropTo, creationThumb } from '@/world/creations';
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

  it('une vignette se recadre sur la boîte donnée, le dessin restant le même', () => {
    for (const [id, art] of Object.entries(DECOR.creations)) {
      const svg = readFileSync(ROOT + art.fichiers[0], 'utf8');
      const cropped = cropTo(svg, { x: -20.5, y: -40, w: 41, h: 46.5 });
      expect(cropped.match(/<svg[^>]*>/)[0], id).toContain('width="41" height="46.5" viewBox="-20.5 -40 41 46.5"');
      expect(cropped.replace(/<svg[^>]*>/, ''), id).toBe(svg.replace(/<svg[^>]*>/, ''));
    }
  });

  it('la vignette : une image vide pendant la lecture ; l\'ancienne si la bibliothèque n\'a rien ou si la mesure échoue', async () => {
    expect(creationThumb('inconnue')).toBe(null);
    expect(creationThumb('banc')).toMatch(/^data:image\/svg\+xml/);
    expect(decodeURIComponent(creationThumb('banc'))).toContain('width="1" height="1"');
    // Sans navigateur (ici), la mesure échoue : null, l'ancienne vignette revient
    await vi.waitFor(() => expect(creationThumb('banc')).toBe(null));
  });
});
