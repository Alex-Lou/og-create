// Les annexes et les gisements de la bibliothèque (design/bibliotheque/svg/decor : annexes/, gisements/) dans le jeu :
// chaque annexe et chaque gisement a son dessin, au cadre du jeu × 1,25 (le même que celui du dessin par code qu'il
// remplace) ; les variantes suivent l'ordre du jeu ; les animations suivent decor.json ; les lumières ne bougent pas.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { ANNEX_SPRITES, annexLayers, annexLight } from '@/world/annexSprites';
import { DEPOSIT_SPRITES, depositLayer } from '@/world/depositSprites';
import { annexArtLayer, depositArtLayer, annexArtThumb, signArtLayer } from '@/world/decorArt';
import { NAME_SIGNS, NAME_SIGN_FRAME, nameSignSwing, nameSignLight } from '@/world/nameSigns';
import DECOR from '../design/bibliotheque/svg/decor/decor.json';

const ROOT = fileURLToPath(new URL('../design/bibliotheque/svg/decor/', import.meta.url));
const round = v => Math.round(v * 1000) / 1000;
// Le cadre (x, y, w, h) qui contient tous les calques d'un dessin par code
const union = frames => {
  const x = Math.min(...frames.map(f => f[0])), y = Math.min(...frames.map(f => f[1]));
  return [x, y, Math.max(...frames.map(f => f[0] + f[2])) - x, Math.max(...frames.map(f => f[1] + f[3])) - y];
};

describe('les annexes de la bibliothèque', () => {
  it('chaque annexe du jeu a son dessin, à la place de ses calques par code', () => {
    for (const id of Object.keys(ANNEX_SPRITES)) {
      const layers = annexLayers(id, 0, 0);
      expect(layers, id).toHaveLength(1);
      expect(layers[0].key, id).toMatch(new RegExp(`^lib-${id}(_[a-z_]+)?-0$`));
    }
  });

  it('au cadre du dessin par code qu’il remplace, × 1,25, et le fichier a ce cadre', () => {
    for (const [name, art] of Object.entries(DECOR.annexes)) {
      const id = name.split('_')[0];
      const game = union(ANNEX_SPRITES[id].layers.map(l => l.frame)).map(v => round(v * 1.25));
      expect(art.cadre, name).toEqual(game);
      for (const file of art.fichiers) expect(readFileSync(ROOT + file, 'utf8').match(/viewBox="([^"]+)"/)[1], file).toBe(art.cadre.join(' '));
      const { box } = annexArtLayer(id, art.variante_jeu || 0).make();
      expect([box.x, box.y, box.w, box.h].map(round), name).toEqual(art.cadre.map(v => round(v / 1.25)));
    }
  });

  it('les variantes suivent l’ordre du jeu, et tournent', () => {
    expect([0, 1, 2, 3].map(v => annexArtLayer('champ', v).key)).toEqual(['lib-champ_ble-0', 'lib-champ_carottes-0', 'lib-champ_citrouilles-0', 'lib-champ_ble-0']);
    expect([0, 1, 2, 3, 4].map(v => annexArtLayer('maison', v).key.slice(4, -2))).toEqual(['maison_toit_rouge', 'maison_toit_bleu', 'maison_chaume', 'maison_ardoise', 'maison_toit_rouge']);
    expect(annexArtLayer('grenier', 5).key).toBe('lib-grenier-0');
    expect(annexArtLayer('inconnue')).toBe(null);
  });

  it('l’animation suit ses images (champ : 6 images de 333 ms) ; une annexe fixe garde la sienne', () => {
    expect([0, 0.34, 0.67, 1.99, 2.0].map(t => annexArtLayer('champ', 0, t).key)).toEqual(['lib-champ_ble-0', 'lib-champ_ble-1', 'lib-champ_ble-2', 'lib-champ_ble-5', 'lib-champ_ble-0']);
    expect(annexArtLayer('remise', 0, 7.3).key).toBe('lib-remise-0');
  });

  it('les lumières de nuit restent celles du jeu', () => {
    for (const [name, art] of Object.entries(DECOR.annexes)) {
      const light = annexLight(name.split('_')[0]);
      expect(Boolean(light), name).toBe(Boolean(art.lumiere));
    }
  });

  it('la vignette attend sa lecture (image vide), et rien pour une annexe inconnue', () => {
    expect(annexArtThumb('champ', 1)).toMatch(/^data:image\/svg\+xml/);
    expect(annexArtThumb('inconnue')).toBe(null);
  });
});

describe('les gisements de la bibliothèque', () => {
  it('chaque gisement a son dessin prêt (animé) et ramassé, au cadre du jeu × 1,25', () => {
    for (const find of Object.keys(DEPOSIT_SPRITES)) {
      for (const [ready, state] of [[true, 'ready'], [false, 'spent']]) {
        const name = `${find}_${ready ? 'pret' : 'ramasse'}`;
        const art = DECOR.gisements[name];
        expect(art.cadre, name).toEqual(DEPOSIT_SPRITES[find][state].frame.map(v => round(v * 1.25)));
        expect(depositLayer(find, ready, 0).key, name).toBe(`lib-${name}-0`);
      }
    }
    expect([0, 0.46, 0.91].map(t => depositArtLayer('glace', true, t).key)).toEqual(['lib-glace_pret-0', 'lib-glace_pret-1', 'lib-glace_pret-0']);
    expect(depositArtLayer('glace', false, 3).key).toBe('lib-glace_ramasse-0');
  });
});

describe('les enseignes de la bibliothèque', () => {
  it('chaque style a son dessin, au cadre du jeu × 1,25 ; le nom s’écrit à la même place, les lumières aussi', () => {
    for (const [style, art] of Object.entries(DECOR.enseignes)) {
      expect(art.cadre, style).toEqual(NAME_SIGN_FRAME.map(v => round(v * 1.25)));
      for (const file of art.fichiers) expect(readFileSync(ROOT + file, 'utf8').match(/viewBox="([^"]+)"/)[1], file).toBe(art.cadre.join(' '));
      const { text } = NAME_SIGNS[style];
      const nom = art.cadre_du_nom;
      // (la bibliothèque arrondit au centième après × 1,25 : comparés au centième près)
      const near = v => Math.round(v * 100) / 100;
      const back = v => Math.round(v / 1.25 * 50) / 50;
      expect([nom.x, nom.y, nom.w, nom.h, nom.size].map(back), style).toEqual([text.x, text.y, text.w, text.h, text.size].map(near));
      expect((nom.light || []).map(l => l.map(back)), style).toEqual(nameSignLight(style).map(l => l.slice(0, 3)));
      expect(signArtLayer(style, 0).key).toBe(`lib-enseigne-${style}-0`);
    }
    expect(signArtLayer('neon')).toBe(null);
  });

  it('le nom du fer forgé penche avec l’image montrée (4 images de 200 ms)', () => {
    expect([0.1, 0.3, 0.5, 0.7].map(t => signArtLayer('fer', t).frame)).toEqual([0, 1, 2, 3]);
    expect([0.1, 0.3, 0.5, 0.7].map(t => round(nameSignSwing('fer', t).angle))).toEqual([0, 0.06, 0, -0.06]);
    expect(nameSignSwing('fer', 0.3).pivot.map(v => v * 1.25)).toEqual(DECOR.enseignes.fer.cadre_du_nom.pivot);
  });
});
