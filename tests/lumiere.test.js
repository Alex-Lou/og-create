import { describe, it, expect } from 'vitest';
import { moonOf, shadowLight, ambientOf } from '@/world/lumiere';
import { eclairAt } from '@/world/eclairs';

const now = new Date();

const phase = (over = {}) => ({
  tint: '#ffffff',
  night: 0,
  lit: 0,
  sun: { up: 0.6, progress: 0.5 },
  weather: { cover: 0, rain: 0, storm: 0 },
  ...over
});

const sun = (up, progress) => shadowLight(phase({ sun: { up, progress } }), now);
const length = s => Math.hypot(s.dx, s.dy);
const lum = hex => [1, 3, 5].reduce((sum, i) => sum + parseInt(hex.slice(i, i + 2), 16), 0);

// Premier instant (au pas de 10 ms) où un coup de foudre est visible et répond au critère
const firstBolt = (ok = () => true) => {
  for (let t = 0; t < 120; t += 0.01) {
    const e = eclairAt(t, 1);
    if (e && e.bolt && ok(e)) return t;
  }
  return null;
};

describe('lune', () => {
  it('nouvelle le 6 janvier 2000, pleine ~15 jours après', () => {
    expect(moonOf(new Date(Date.UTC(2000, 0, 6, 18, 14))).light).toBeLessThan(0.01);
    expect(moonOf(new Date(Date.UTC(2000, 0, 21, 12))).light).toBeGreaterThan(0.99);
  });
});

describe('ombres', () => {
  it('partent à l\'opposé du soleil, courtes à midi', () => {
    expect(sun(0.3, 0.1).dx).toBeLessThan(0);
    expect(sun(0.3, 0.9).dx).toBeGreaterThan(0);
    expect(length(sun(1, 0.5))).toBeLessThan(length(sun(0.3, 0.1)));
  });

  it('pâlissent sous un ciel couvert, disparaissent au crépuscule', () => {
    const couvert = phase({ weather: { cover: 1, rain: 1, storm: 0 } });
    const crepuscule = phase({ sun: { up: 0, progress: 1 }, night: 0.3 });

    expect(shadowLight(couvert, now).a).toBeLessThan(shadowLight(phase(), now).a * 0.3);
    expect(shadowLight(crepuscule, now)).toBeNull();
  });
});

describe('ambiante', () => {
  it('s\'assombrit la nuit, blanchit au flash', () => {
    const nuit = phase({ tint: '#5a68a6', night: 1 });

    expect(ambientOf(nuit)).not.toBe('#5a68a6');
    expect(lum(ambientOf(nuit, 1))).toBeGreaterThan(lum(ambientOf(nuit)) + 200);
  });
});

describe('éclairs', () => {
  it('sont déterministes et réservés à l\'orage', () => {
    const t = firstBolt();

    expect(t).not.toBeNull();
    expect(eclairAt(t, 1)).toEqual(eclairAt(t, 1));
    expect(eclairAt(t, 0)).toBeNull();
  });

  it('leur flash retombe', () => {
    const t = firstBolt(e => e.flash > 0.9);
    const later = eclairAt(t + 2.5, 1);

    expect(t).not.toBeNull();
    expect(later === null || later.flash < 0.05).toBe(true);
  });
});
