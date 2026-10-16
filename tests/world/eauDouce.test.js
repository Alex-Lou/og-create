import { describe, it, expect } from 'vitest';
import { freshOf, fishAt, hopOf, SPECIES_IDS } from '@/world/eauDouce';

// Une rivière de 6 cases sur la ligne y = 2, qui se jette dans une cascade en (5, 2) ; une mare isolée en (1, 6)–(2, 6)
const water = new Set(['0,2', '1,2', '2,2', '3,2', '4,2', '5,2', '1,6', '2,6']);
const M = {
  n: 10,
  ground: (x, y) => (water.has(`${x},${y}`) ? 'w' : 'g'),
  surface: () => 1
};
const live = { water: [...water].map(k => { const [x, y] = k.split(',').map(Number); return { x, y }; }), falls: [{ x: 5, y: 2, side: 1, drop: 22 }] };

describe('eau douce', () => {
  it('le courant descend vers la cascade ; une mare sans sortie n\'a pas de courant', () => {
    const { cells } = freshOf(M, live);
    const at = (x, y) => cells.find(c => c.x === x && c.y === y);
    for (let x = 0; x < 5; x++) expect(at(x, 2).flow, `case ${x}`).toEqual([1, 0]);
    expect(at(5, 2).flow).toEqual([1, 0]);
    expect(at(1, 6).flow).toBeNull();
  });

  it('seule la mare sans sortie est une mare (elle gèle l\'hiver) ; la rivière, même à sa cascade, n\'en est pas une', () => {
    const { cells, fish } = freshOf(M, live);
    const at = (x, y) => cells.find(c => c.x === x && c.y === y);
    expect(at(1, 6).mare).toBe(true);
    expect(at(2, 6).mare).toBe(true);
    for (let x = 0; x <= 5; x++) expect(at(x, 2).mare, `case ${x}`).toBe(false);
    // (les poissons savent dans quelle eau ils vivent)
    fish.forEach(f => expect(f.mare).toBe(at(f.x, f.y).mare));
  });

  it('des poissons dans l\'eau calme seulement, d\'une espèce connue ; la truite seulement dans le courant', () => {
    const big = new Set();
    for (let y = 0; y < 40; y++) for (let x = 0; x < 40; x++) big.add(`${x},${y}`);
    const pond = { n: 40, ground: (x, y) => (big.has(`${x},${y}`) ? 'w' : '~'), surface: () => 1 };
    const { fish } = freshOf(pond, { water: [...big].map(k => { const [x, y] = k.split(',').map(Number); return { x, y }; }), falls: [] });
    expect(fish.length).toBeGreaterThan(40 * 40 * 0.1);
    expect(fish.length).toBeLessThan(40 * 40 * 0.3);
    expect(fish.every(f => SPECIES_IDS.includes(f.species))).toBe(true);
    expect(fish.filter(f => f.species === 'truite').every(f => f.flow)).toBe(true);
    expect(fish.some(f => f.species === 'saumon')).toBe(false);
  });

  it('les vairons vont par trois ; chaque poisson reste dans sa case', () => {
    for (const species of SPECIES_IDS.filter(id => id !== 'saumon')) {
      const f = { x: 0, y: 0, z: 1, species, phase: 3, speed: 0.4, flow: [1, 0] };
      for (const t of [0, 1.7, 5.2, 13]) {
        const all = fishAt(f, t);
        expect(all.length, species).toBe(species === 'vairons' ? 3 : 1);
        all.forEach(p => { expect(Math.abs(p.u)).toBeLessThan(0.5); expect(Math.abs(p.v)).toBeLessThan(0.5); });
      }
    }
  });

  it('une truite saute de temps en temps, puis retourne nager', () => {
    const f = { x: 3, y: 2, species: 'truite' };
    let inAir = 0;
    for (let t = 0; t < 60; t += 0.05) if (hopOf(f, t) < 1) inAir++;
    expect(inAir).toBeGreaterThan(0);
    expect(inAir * 0.05).toBeLessThan(60 * 0.2);
  });
});
