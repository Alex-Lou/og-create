import { describe, expect, it } from 'vitest';
import { cameraTransform, pisteTransform, imagesCles, stylePiste, tempsDe, derniere, premiere, cleRepos } from '../src/game/scenePlans';

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
