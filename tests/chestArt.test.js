// Les coffres de la bibliothèque (design/bibliotheque/svg/coffres, coffres.json) : un par rareté du jeu, au cadre du
// coffre du jeu (120 × 100), son ouverture (4 images : 140, 140, 220, 220 ms) puis ouvert (2 images de 700 ms) ;
// l'icône des listes (32 × 32).
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { chestFrames, chestIcon } from '@/world/chestArt';
import { RARITY } from '@/world/chest';
import { coffres as CHESTS } from '../design/bibliotheque/svg/coffres/coffres.json';

const ROOT = fileURLToPath(new URL('../design/bibliotheque/svg/coffres/', import.meta.url));
const viewBox = file => readFileSync(ROOT + file, 'utf8').match(/viewBox="([^"]+)"/)[1];

describe('les coffres de la bibliothèque', () => {
  it('chaque rareté du jeu a son coffre : son ouverture, puis ouvert, à la cadence de la bibliothèque', () => {
    for (const rarity of Object.keys(RARITY)) {
      const art = chestFrames(rarity);
      expect(art, rarity).not.toBe(null);
      expect(art.opening.map(f => f.ms)).toEqual([140, 140, 220, 220]);
      expect(art.open.map(f => f.ms)).toEqual([700, 700]);
      // (une adresse par image, toutes différentes : fichier en production, data: en test pour les petits dessins)
      const srcs = [...art.opening, ...art.open].map(f => f.src);
      expect(srcs.every(src => typeof src === 'string' && src.length > 0)).toBe(true);
      expect(new Set(srcs).size).toBe(6);
      expect(typeof chestIcon(rarity)).toBe('string');
    }
    expect(chestFrames('mythique')).toBe(null);
    expect(chestIcon('mythique')).toBe(null);
  });

  it('au cadre du coffre du jeu (120 × 100) ; l’icône en 32 × 32', () => {
    for (const art of Object.values(CHESTS)) {
      for (const file of [...art.fichiers.ouverture, ...art.fichiers.ouvert]) expect(viewBox(file), file).toBe('0 0 120 100');
      expect(viewBox(art.fichiers.icone)).toBe('0 0 32 32');
    }
  });
});
