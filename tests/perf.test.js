import { describe, it, expect, vi, afterEach } from 'vitest';
import { perfWanted, perfMeter, qualiteSuivante, setQualiteFx, selonQualite } from '@/world/perf';

describe('compteur d’images (?perf)', () => {
  afterEach(() => vi.unstubAllGlobals());
  it('ne s’active qu’avec « perf » dans l’adresse', () => {
    vi.stubGlobal('window', { location: { search: '?perf' } });
    expect(perfWanted()).toBe(true);
    vi.stubGlobal('window', { location: { search: '?heure=nuit&perf=1' } });
    expect(perfWanted()).toBe(true);
    vi.stubGlobal('window', { location: { search: '?heure=nuit' } });
    expect(perfWanted()).toBe(false);
  });
  it('compte les images de la dernière seconde, le temps de dessin moyen et la pire image', () => {
    const m = perfMeter();
    for (let i = 0; i < 30; i++) m.frame(i * 33.4, i === 10 ? 20 : 4);
    const s = m.stats(29 * 33.4);
    expect(s.fps).toBe(30);
    expect(s.worst).toBe(20);
    expect(s.avg).toBeCloseTo((29 * 4 + 20) / 30, 5);
    // Une seconde plus tard sans image : plus rien à compter
    expect(m.stats(29 * 33.4 + 1100)).toEqual({ fps: 0, avg: 0, worst: 0 });
  });
  it('donne un texte lisible, deux fois par seconde au plus', () => {
    const m = perfMeter();
    m.frame(0, 4.25);
    m.frame(33, 5.75);
    expect(m.text(40, 1.2)).toBe('2 i/s · 5,0 ms · pire 5,8 · ×1,2');
    expect(m.text(300, 1.2)).toBeNull();
    expect(m.text(560, 1.2)).not.toBeNull();
  });
});

describe('la qualité des effets', () => {
  afterEach(() => setQualiteFx(1));
  it('baisse vite quand une image coûte trop, remonte doucement, reste entre 0,35 et 1', () => {
    expect(qualiteSuivante(1, 40)).toBeCloseTo(0.95);
    expect(qualiteSuivante(0.36, 40)).toBe(0.35);
    expect(qualiteSuivante(0.5, 10)).toBeCloseTo(0.52);
    expect(qualiteSuivante(1, 10)).toBe(1);
    expect(qualiteSuivante(0.7, 20)).toBe(0.7);
  });
  it('les particules suivent la qualité du moment', () => {
    expect(selonQualite(60)).toBe(60);
    setQualiteFx(0.5);
    expect(selonQualite(60)).toBe(30);
  });
});
