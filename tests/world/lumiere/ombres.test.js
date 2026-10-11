import { describe, it, expect } from 'vitest';
import { moonOf, shadowLight } from '@/world/lumiere/ombres';
import { phase } from './phase';

const now = new Date();
const sun = (up, progress) => shadowLight(phase({ sun: { up, progress } }), now);
const length = s => Math.hypot(s.dx, s.dy);

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
