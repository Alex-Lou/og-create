// Les objets de la boutique dessinés par la bibliothèque (design/bibliotheque/svg/batiments/objets) dans le jeu : chaque
// objet du jeu a ses calques, aux mêmes places, devant ou derrière comme dans le jeu, avec ses images et sa cadence ; le
// glissement et les lumières restent ceux du jeu (les mêmes que ceux de la bibliothèque).
import { describe, it, expect, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { objectLayers, objectThumb, framesAt } from '@/world/objectArt';
import { SHOP_SPRITES, itemLayers, itemLight } from '@/world/shopSprites';
import { RARE_SPRITES } from '@/world/rareSprites';
import { BLANK } from '@/world/library';
import { P } from '@/world/iso';
import DATA from '../design/bibliotheque/svg/batiments/batiments.json';

const ROOT = fileURLToPath(new URL('../design/bibliotheque/svg/batiments/', import.meta.url));
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
const OBJECTS = Object.keys(SHOP_SPRITES).filter(id => !RARE_SPRITES[id]);
// Paliers où l'objet est dans la bibliothèque (« I à VII » ou « V à VII »)
const levelsOf = id => [1, 2, 3, 4, 5, 6, 7].filter(level => DATA.objets[id].calques.every(c => c.place[ROMAN[level - 1]]));

describe('les objets de la boutique de la bibliothèque', () => {
  it('chaque objet du jeu a ses calques : devant ou derrière, images, cadence et glissement comme dans le jeu', () => {
    expect(OBJECTS.length).toBe(48);
    for (const id of OBJECTS) {
      const lib = DATA.objets[id];
      const game = SHOP_SPRITES[id];
      expect(lib.calques.length, id).toBe(game.layers.length);
      game.layers.forEach((layer, k) => {
        const c = lib.calques[k];
        expect(c.derriere, `${id} ${k}`).toBe(Boolean(layer.back));
        expect(Boolean(c.mouvement), `${id} ${k}`).toBe(Boolean(layer.motion));
        for (const level of levelsOf(id)) {
          expect(framesAt(c, level).files.length, `${id} ${k} ${level}`).toBe(layer.n || 1);
        }
        if (layer.n) expect(c.ms_par_image, `${id} ${k}`).toBeCloseTo(1000 / layer.fps, -1);
      });
    }
  });

  it('chaque calque est à la place du jeu, à chaque palier, et son cadre contient celui du jeu', () => {
    // La bibliothèque arrondit les places au centième de case (0,01 case : 0,32 px)
    const EPS = 0.35;
    for (const id of OBJECTS) {
      for (const level of levelsOf(id)) {
        const mine = objectLayers(id, level);
        const game = itemLayers(id, level);
        mine.forEach((layer, k) => {
          const box = layer.make().box;
          const was = game[k].make().box;
          expect(box.x, `${id} ${k} ${level}`).toBeLessThanOrEqual(was.x + EPS);
          expect(box.y, `${id} ${k} ${level}`).toBeLessThanOrEqual(was.y + EPS);
          expect(box.x + box.w, `${id} ${k} ${level}`).toBeGreaterThanOrEqual(was.x + was.w - EPS);
          expect(box.y + box.h, `${id} ${k} ${level}`).toBeGreaterThanOrEqual(was.y + was.h - EPS);
          // Le cadre de la bibliothèque est autour de sa place, comme celui du jeu
          const [px, py] = P(...DATA.objets[id].calques[k].place[ROMAN[level - 1]], 0);
          expect(box.x - px, `${id} ${k} ${level}`).toBeCloseTo(framesAt(DATA.objets[id].calques[k], level).cadre[0] / 1.25, 5);
          expect(box.y - py, `${id} ${k} ${level}`).toBeCloseTo(framesAt(DATA.objets[id].calques[k], level).cadre[1] / 1.25, 5);
        });
      }
    }
  });

  it('chaque image est calée sur son cadre', () => {
    for (const [id, e] of Object.entries(DATA.objets)) {
      for (const c of e.calques) {
        for (const level of [1, 2, 3, 4, 5, 6, 7]) {
          const { files, cadre } = framesAt(c, level);
          files.forEach(file => expect(readFileSync(ROOT + file, 'utf8').match(/viewBox="([^"]+)"/)[1], `${id} ${file}`).toBe(cadre.join(' ')));
        }
      }
    }
  });

  it('un calque dessiné autrement selon le palier prend son groupe d\'images', () => {
    const poulie = DATA.objets.poulie.calques[0];
    expect(framesAt(poulie, 1).files).toEqual(['objets/puits/poulie/poulie_des_palier1.svg']);
    expect(framesAt(poulie, 5).files).toEqual(['objets/puits/poulie/poulie_des_palier2.svg']);
    const canne = DATA.objets.canne.calques[0];
    expect(framesAt(canne, 1).files.every(file => file.includes('_des_palier1_'))).toBe(true);
    expect(framesAt(canne, 2).files.every(file => file.includes('_des_palier2_'))).toBe(true);
  });

  it('l\'image et le glissement suivent le temps ; la pièce rare garde les calques du jeu', () => {
    const at = t => objectLayers('chat', 2, t)[0].key;
    expect(at(0)).toBe('lib-shop-chat-2-0-0');
    expect(at(0.34)).toBe('lib-shop-chat-2-0-1');
    expect(objectLayers('barque', 3, 2.5).map(l => l.offset)).toEqual(itemLayers('barque', 3, 2.5).map(l => l.offset));
    expect(objectLayers('barque', 3)[0].back).toBe(true);
    expect(objectLayers('papillons', 3)).toBe(null);
    expect(objectLayers('grimoire', 4)).toBe(null);
  });

  it('les lumières de la bibliothèque sont celles du jeu (objets écartés : palier IV)', () => {
    for (const id of OBJECTS) {
      const l = DATA.objets[id].lumiere;
      const game = itemLight(id, 4);
      expect(Boolean(l), id).toBe(Boolean(game));
      if (l) expect([l.u, l.v, l.z / 1.25, l.rayon / 1.25].map(v => Math.round(v * 100) / 100), id).toEqual(game.slice(0, 4).map(v => Math.round(v * 100) / 100));
    }
  });

  it('la vignette d\'un objet : ses calques réunis, à leur cadre, ceux de derrière d\'abord', async () => {
    expect(objectThumb('papillons', 3)).toBe(null);
    expect(objectThumb('poulailler', 2)).toBe(BLANK);
    await vi.waitFor(() => expect(objectThumb('poulailler', 2)).not.toBe(BLANK));
    const svg = decodeURIComponent(objectThumb('poulailler', 2).split(',')[1]);
    const layers = objectLayers('poulailler', 2).map(l => l.make().box);
    const nested = [...svg.matchAll(/<svg x="([-\d.]+)" y="([-\d.]+)"[^>]*width="([\d.]+)" height="([\d.]+)"/g)].map(m => m.slice(1).map(Number));
    // Derrière (calque 1) d'abord, puis devant (calque 2)
    expect(nested).toEqual(layers.map(b => [b.x, b.y, b.w, b.h]));
  });
});
