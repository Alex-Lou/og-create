import { describe, it, expect } from 'vitest';
import { glitterOf, glitterEclair } from '@/world/rivage';
import { raysOf, motesOf, motesIn } from '@/world/lumiere/ambiance';

const phase = (over = {}) => ({ night: 0, sun: { up: 0.6, progress: 0.5 }, weather: { cover: 0, rain: 0 }, ...over });
const pleineLune = new Date(Date.UTC(2000, 0, 21, 12));
const nouvelleLune = new Date(Date.UTC(2000, 0, 6, 18, 14));

describe('chemin de lumière sur la mer', () => {
  it('suit le soleil : étroit et doré quand il est bas, large à midi', () => {
    const bas = glitterOf(phase({ sun: { up: 0.2, progress: 0.9 } }), pleineLune);
    const haut = glitterOf(phase({ sun: { up: 1, progress: 0.5 } }), pleineLune);
    expect(bas.spread).toBeLessThan(haut.spread);
    expect(bas.color).toBe('255,214,150');
    // (le soir, le soleil est à gauche : lumiere/soleil.js)
    expect(bas.at).toBeLessThan(haut.at);
  });

  it('la nuit, la lune selon sa phase ; rien sous un ciel couvert', () => {
    const nuit = { night: 1, sun: { up: 0, progress: 1 } };
    expect(glitterOf(phase(nuit), pleineLune).strength).toBeGreaterThan(0.5);
    expect(glitterOf(phase(nuit), nouvelleLune).strength).toBeLessThan(0.01);
    expect(glitterOf(phase({ weather: { cover: 1, rain: 1 } }), pleineLune).strength).toBe(0);
  });
});

describe('ambiance', () => {
  it('des rayons seulement au soleil bas et par ciel clair', () => {
    expect(raysOf(phase({ sun: { up: 1, progress: 0.5 } }))).toBe(0);
    expect(raysOf(phase({ sun: { up: 0.17, progress: 0.06 } }))).toBeGreaterThan(0.3);
    expect(raysOf(phase({ sun: { up: 0.17, progress: 0.06 }, weather: { cover: 1, rain: 0 } }))).toBe(0);
    expect(raysOf(phase({ sun: { up: 0, progress: 1 }, night: 1 }))).toBe(0);
  });

  it('des éclats discrets le jour, plus nombreux la nuit, rares sous la pluie', () => {
    const jour = motesOf(phase({ sun: { up: 1, progress: 0.5 } }));
    const nuit = motesOf(phase({ night: 1, sun: { up: 0, progress: 1 } }));
    const pluie = motesOf(phase({ night: 1, sun: { up: 0, progress: 1 }, weather: { cover: 1, rain: 1 } }));
    expect(jour).toBeLessThan(nuit);
    expect(pluie).toBeLessThan(nuit / 2);
    expect(nuit).toBeLessThanOrEqual(50);
  });

  it('les éclats flottent dans l’air de l’île, pas sur l’écran : ils restent en place quand la vue glisse', () => {
    const nuit = phase({ night: 1, sun: { up: 0, progress: 1 } });
    const a = motesIn({ x: 0, y: 0, w: 400, h: 800 }, 3, nuit);
    const b = motesIn({ x: 150, y: 90, w: 400, h: 800 }, 3, nuit);
    const key = m => `${m.x.toFixed(3)},${m.y.toFixed(3)}`;
    const inB = new Set(b.map(key));
    const shared = a.filter(m => m.x > 150 && m.y > 90 && m.x < 400 && m.y < 800);
    expect(shared.length).toBeGreaterThan(5);
    for (const m of shared) expect(inB.has(key(m))).toBe(true);
    // vus de très loin, ils s'effacent
    expect(motesIn({ x: 0, y: 0, w: 4000, h: 8000 }, 3, nuit, 0.25)).toEqual([]);
  });
});

describe('chemin de l\'éclair sur la mer', () => {
  it('ne vit que le temps du flash, de son côté', () => {
    expect(glitterEclair(null)).toBeNull();
    expect(glitterEclair({ flash: 0.05, x: 0.2 })).toBeNull();
    expect(glitterEclair({ flash: 1, x: 0.2 })).toMatchObject({ at: 0.2 });
  });
});
