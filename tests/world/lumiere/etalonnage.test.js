// L'étalonnage en trois couleurs (world/lumiere/etalonnage.js) : quelle couleur pour les ombres, les tons moyens et les
// lumières, selon l'heure et le temps.
import { describe, expect, it } from 'vitest';
import { etalonnageOf } from '@/world/lumiere/etalonnage';
import { phase } from './phase';

const rgb = hex => { const n = parseInt(hex.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };

describe('étalonnage', () => {
  it('le jour : ombres sarcelle, lumières crème', () => {
    const g = etalonnageOf(phase());
    const [r, , b] = rgb(g.ombres);
    expect(b).toBeGreaterThan(r);
    const [lr, , lb] = rgb(g.lumieres);
    expect(lr).toBeGreaterThan(lb);
  });

  it('la nuit : ombres bleu profond, lumières ambre des lampes, ombres un peu moins creusées que le jour (la nuit est déjà sombre)', () => {
    const jour = etalonnageOf(phase());
    const nuit = etalonnageOf(phase({ night: 1, sun: { up: 0, progress: 0 } }));
    expect(nuit.ombres).toBe('#34437a');
    expect(nuit.lumieres).toBe('#ffb050');
    expect(nuit.force[0]).toBeLessThan(jour.force[0]);
  });

  it('la chaleur du matin donne l’aube, celle du soir le couchant', () => {
    const aube = etalonnageOf(phase({ warm: 1, sun: { up: 0.1, progress: 0.05 } }));
    const soir = etalonnageOf(phase({ warm: 1, sun: { up: 0.1, progress: 0.95 } }));
    expect(aube.milieux).toBe('#f4a6b6');
    expect(soir.milieux).toBe('#ff9a58');
  });

  it('sous un ciel couvert et la pluie, tout se rapproche du gris et s’adoucit', () => {
    const clair = etalonnageOf(phase());
    const gris = etalonnageOf(phase({ weather: { cover: 1, rain: 1, storm: 0 } }));
    const ecart = hex => { const c = rgb(hex); return Math.max(...c) - Math.min(...c); };
    expect(ecart(gris.ombres)).toBeLessThan(ecart(clair.ombres));
    expect(gris.force[2]).toBeLessThan(clair.force[2]);
  });
});
