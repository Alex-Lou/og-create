import { describe, it, expect } from 'vitest';
import { moonOf, shadowLight, ambientOf } from '@/world/lumiere';
import { eclairAt } from '@/world/eclairs';

const phase = (over = {}) => ({ tint: '#ffffff', night: 0, lit: 0, sun: { up: 0.6, progress: 0.5 }, weather: { cover: 0, rain: 0, storm: 0 }, ...over });

describe('éclairage de l\'île', () => {
  it('la lune suit sa lunaison : nouvelle le 6 janvier 2000, pleine environ 14,8 jours plus tard', () => {
    expect(moonOf(new Date(Date.UTC(2000, 0, 6, 18, 14))).light).toBeLessThan(0.01);
    expect(moonOf(new Date(Date.UTC(2000, 0, 21, 12))).light).toBeGreaterThan(0.99);
  });

  it('l\'ombre part à l\'opposé du soleil : vers la gauche le matin, vers la droite le soir, courte à midi', () => {
    const matin = shadowLight(phase({ sun: { up: 0.3, progress: 0.1 } }), new Date());
    const soir = shadowLight(phase({ sun: { up: 0.3, progress: 0.9 } }), new Date());
    const midi = shadowLight(phase({ sun: { up: 1, progress: 0.5 } }), new Date());
    expect(matin.dx).toBeLessThan(0);
    expect(soir.dx).toBeGreaterThan(0);
    expect(Math.hypot(midi.dx, midi.dy)).toBeLessThan(Math.hypot(matin.dx, matin.dy));
  });

  it('sous un ciel couvert, l\'ombre pâlit ; au crépuscule (ni soleil ni nuit pleine), il n\'y en a pas', () => {
    const clair = shadowLight(phase(), new Date());
    const couvert = shadowLight(phase({ weather: { cover: 1, rain: 1, storm: 0 } }), new Date());
    expect(couvert.a).toBeLessThan(clair.a * 0.3);
    expect(shadowLight(phase({ sun: { up: 0, progress: 1 }, night: 0.3 }), new Date())).toBeNull();
  });

  it('la nuit pleine assombrit l\'ambiante ; le flash d\'un éclair la blanchit', () => {
    const nuit = phase({ tint: '#5a68a6', night: 1 });
    expect(ambientOf(nuit)).not.toBe('#5a68a6');
    const lum = hex => parseInt(hex.slice(1, 3), 16) + parseInt(hex.slice(3, 5), 16) + parseInt(hex.slice(5, 7), 16);
    expect(lum(ambientOf(nuit, 1))).toBeGreaterThan(lum(ambientOf(nuit)) + 200);
  });

  it('un éclair est le même pour un même instant, et l\'orage seul en donne', () => {
    let seen = null;
    for (let t = 0; t < 120 && !seen; t += 0.02) { const e = eclairAt(t, 1); if (e && e.bolt) seen = t; }
    expect(seen).not.toBeNull();
    expect(eclairAt(seen, 1)).toEqual(eclairAt(seen, 1));
    expect(eclairAt(seen, 0)).toBeNull();
  });

  it('le flash d\'un coup de foudre retombe : la rémanence finit par s\'éteindre', () => {
    let start = null;
    for (let t = 0; t < 120 && start === null; t += 0.01) { const e = eclairAt(t, 1); if (e && e.bolt && e.flash > 0.9) start = t; }
    expect(start).not.toBeNull();
    const later = eclairAt(start + 2.5, 1);
    expect(later === null || later.flash < 0.05).toBe(true);
  });
});
