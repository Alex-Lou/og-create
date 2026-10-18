import { describe, expect, it } from 'vitest';
import { cameraTransform, pisteTransform, imagesCles, stylePiste, tempsDe, derniere, premiere, cleRepos, rangBulle } from '../src/game/scenePlans';
import { SCENES } from '../src/texts/tutorial/scenes';
import DATA from '../design/bibliotheque/svg/scenes/tutoriel/scenes.json';

describe('la cinématique en plans', () => {
  it('un plan suit la caméra selon sa profondeur', () => {
    expect(cameraTransform({ x: 40, y: -20, z: 1.5, r: 10 }, 0)).toBe('translate(0%, 0%) scale(1) rotate(0deg)');
    expect(cameraTransform({ x: 40, y: -20, z: 1.5, r: 10 }, 1)).toBe('translate(-10%, 5%) scale(1.5) rotate(10deg)');
    expect(cameraTransform({ x: 40 }, 0.5)).toBe('translate(-5%, 0%) scale(1) rotate(0deg)');
  });
  it('le mouvement propre d\'un plan', () => {
    expect(pisteTransform({})).toBe('translate(0%, 0%) rotate(0deg) scale(1)');
    expect(pisteTransform({ y: -200, s: 2 })).toBe('translate(0%, -50%) rotate(0deg) scale(2)');
    expect(stylePiste({ o: 0 }).opacity).toBe(0);
    expect(stylePiste({}).opacity).toBe(1);
  });
  it('des clés aux images clés du navigateur', () => {
    const images = imagesCles([[0, { y: 0 }], [500, { y: 40, e: 'linear' }], [2000, { y: 0 }]], 1000, stylePiste);
    expect(images.map(i => i.offset)).toEqual([0, 0.5, 1]);
    expect(images.map(i => i.easing)).toEqual(['ease-in-out', 'linear', 'ease-in-out']);
  });
  it('les temps de la partition', () => {
    const partition = { temps: [{ duree: 1 }, { duree: 2 }] };
    expect(tempsDe(partition, 1)).toEqual({ duree: 2 });
    expect(tempsDe(partition, 2)).toBeNull();
    expect(tempsDe(null, 0)).toBeNull();
    expect(premiere([[0, { x: 1 }], [9, { x: 2 }]])).toEqual({ x: 1 });
    expect(derniere([[0, { x: 1 }], [9, { x: 2 }]])).toEqual({ x: 2 });
    expect(derniere(undefined, { z: 3 })).toEqual({ z: 3 });
  });
  it('la dérive au repos', () => {
    expect(cleRepos({ x: 10, z: 1.5 }, { camera: { x: -5, z: 0.25 } })).toEqual({ x: 5, y: 0, z: 1.75, r: 0 });
  });
});

describe('le temps que chaque bulle joue', () => {
  it('son rang dans sa scène, même quand une autre image s\'intercale', () => {
    const b = [{ scene: 'a' }, { scene: 'a' }, { scene: 'c' }, { scene: 'a' }, { scene: 'b' }];
    expect([0, 1, 2, 3, 4].map(k => rangBulle(b, k))).toEqual([0, 1, 0, 2, 0]);
    // (« Quel jour ? », le ciel, puis la trouée reprend à sa quatrième réplique)
    const jour = SCENES.jour, k = jour.findIndex(l => l.text && l.text.startsWith('Peu importe'));
    expect(jour[k].scene).toBe('03_trouee');
    expect(rangBulle(jour, k)).toBe(3);
  });
  it('les scènes du naufrage, du livre, du Vent et du cercle ont un temps pour chaque bulle de leur suite', () => {
    for (const [suite, ids] of [['naufrage', ['01_pont']], ['arrivee', ['03_livre']], ['souffle', ['03_vent']], ['jour', ['03_trouee', '03_ciel']], ['cercle', ['03_nuit', '05_cercle']], ['epave', ['05_promesse']]]) {
      for (const id of ids) expect(SCENES[suite].filter(l => l.scene === id).length).toBe(DATA.scenes[id].partition.temps.length);
    }
  });
});
