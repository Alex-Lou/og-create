import { describe, it, expect } from 'vitest';
import { pluieOf, cielOf, filanteAt, refletOf, teteOf, eclatOf, cielDe } from '@/world/lumiere/filantes';
import { phase } from './phase';

// Les étoiles vues sur [0, s) secondes (au pas de 50 ms, comptées une fois chacune)
const vues = (s, pluie = null) => {
  const seen = new Map();
  for (let t = 0; t < s; t += 0.05) { const f = filanteAt(t, pluie); if (f && !seen.has(f.cycle)) seen.set(f.cycle, f); }
  return [...seen.values()];
};

describe('étoiles filantes', () => {
  it('passent de temps en temps, bien plus souvent une nuit de pluie d\'étoiles', () => {
    const rares = vues(3600).length / 60;
    const pluie = vues(3600, { x: -0.3, y: 0.05 }).length / 60;

    expect(rares).toBeGreaterThan(1);
    expect(rares).toBeLessThan(3);
    expect(pluie).toBeGreaterThan(rares * 3);
  });

  it('filent tout en haut du ciel, presque à l\'horizontale ; leur reflet, renversé, plus bas sur l\'eau', () => {
    for (const f of vues(600)) {
      const r = refletOf(f);

      expect(f.y0).toBeLessThan(0.13);
      expect(Math.abs(f.dy)).toBeLessThan(Math.abs(f.dx) * 0.25);
      expect(r.y0).toBeGreaterThan(0.3);
      expect(Math.sign(r.dy)).toBe(-Math.sign(f.dy));
    }
  });

  it('fuient le radiant une nuit de pluie d\'étoiles', () => {
    const radiant = { x: -0.3, y: 0.05 };
    for (const f of vues(600, radiant)) {
      const avant = Math.hypot(f.x0 - radiant.x, f.y0 - radiant.y);
      const apres = Math.hypot(f.x0 + f.dx - radiant.x, f.y0 + f.dy - radiant.y);
      expect(apres).toBeGreaterThan(avant);
    }
  });

  it('une nuit sur huit environ est une pluie d\'étoiles', () => {
    const nuits = Array.from({ length: 800 }, (_, i) => pluieOf(new Date(2026, 0, 1 + i)));
    const part = nuits.filter(Boolean).length / nuits.length;

    expect(part).toBeGreaterThan(0.07);
    expect(part).toBeLessThan(0.18);
  });

  it('ne se voient que par nuit claire', () => {
    expect(cielOf(phase({ night: 1 }))).toBe(1);
    expect(cielOf(phase({ night: 0 }))).toBe(0);
    expect(cielOf(phase({ night: 1, weather: { cover: 1, rain: 0 } }))).toBe(0);
    expect(cielOf(phase({ night: 1, weather: { cover: 0, rain: 1 } }))).toBe(0);
  });

  it('filent du départ au bout de leur chemin, et flambent avant de mourir', () => {
    const f = { x0: 0.2, y0: 0.1, dx: 0.3, dy: 0.2, k: 0 };

    const ciel = { x: 0, y: 0, w: 100, h: 100 };
    expect(teteOf(f, ciel, 0)).toEqual({ x: 20, y: 10 });
    expect(teteOf(f, ciel, 1).x).toBeCloseTo(50);
    // (posée dans le monde : un ciel décalé la décale d'autant)
    expect(teteOf(f, { ...ciel, x: 500, y: -40 }, 0)).toEqual({ x: 520, y: -30 });
    expect(eclatOf(0)).toBe(0);
    expect(eclatOf(0.86)).toBeGreaterThan(eclatOf(0.5));
    expect(eclatOf(1.2)).toBe(0);
  });

  it('son ciel est figé à son départ : elle ne suit pas la caméra', () => {
    const c = cielDe(4242, { x: 10, y: 20, w: 400, h: 800 });
    expect(cielDe(4242, { x: 900, y: -300, w: 400, h: 800 })).toEqual(c);
  });
});
