// Le liseré vivant des personnages (world/lumiere/lisere.js) : la lumière qui domine là où chacun se tient (le feu le
// plus proche, sinon la lune, sinon le soleil bas), de son côté, retourné avec son image ; rien en plein jour ; trois
// couleurs fixes ; il respire, immobile en mouvement réduit.
import { describe, it, expect } from 'vitest';
import { lisereOf, luneOf, graineOf, LISERE } from '@/world/lumiere/lisere';
import { phase } from './phase';

const nuit = phase({ night: 1, lit: 1, sun: { up: 0, progress: 1 } });
const at = { x: 100, y: 100 };
const feu = (x, k = 1) => ({ x, y: 100, r: 30, k, color: '255,196,110' });

describe('le liseré vivant', () => {
  it('en plein jour, rien', () => {
    expect(lisereOf({ phase: phase(), at })).toBe(null);
    // (une lanterne de jour ne compte pas : sa force suit la nuit, carte.js)
    expect(lisereOf({ phase: phase(), at, lumieres: [feu(120, 0.02)] })).toBe(null);
  });

  it('la nuit, la lune, de son côté (en haut à gauche) ; retourné, de l’autre côté de son image', () => {
    const l = lisereOf({ phase: nuit, lune: 0.8, at });
    expect(l).toMatchObject({ color: LISERE.lune, side: -1 });
    expect(lisereOf({ phase: nuit, lune: 0.8, at, flip: true }).side).toBe(1);
    // (sans lune, rien)
    expect(lisereOf({ phase: nuit, lune: 0, at })).toBe(null);
  });

  it('près d’un feu, le feu l’emporte sur la lune, de son côté ; loin, la lune', () => {
    expect(lisereOf({ phase: nuit, lune: 0.6, at, lumieres: [feu(130)] })).toMatchObject({ color: LISERE.feu, side: 1 });
    expect(lisereOf({ phase: nuit, lune: 0.6, at, lumieres: [feu(70)] })).toMatchObject({ color: LISERE.feu, side: -1 });
    expect(lisereOf({ phase: nuit, lune: 0.6, at, lumieres: [feu(400)] })).toMatchObject({ color: LISERE.lune });
    // (une lumière froide, Brume, prend la couleur de la lune)
    expect(lisereOf({ phase: nuit, lune: 0, at, lumieres: [{ ...feu(120), color: '150,220,255' }] }).color).toBe(LISERE.lune);
  });

  it('au soleil bas, le corail, du côté du soleil : à droite le matin, à gauche le soir', () => {
    const matin = phase({ sun: { up: 0.05, progress: 0.03 } });
    const soir = phase({ sun: { up: 0.05, progress: 0.97 } });
    expect(lisereOf({ phase: matin, at })).toMatchObject({ color: LISERE.soleil, side: 1 });
    expect(lisereOf({ phase: soir, at })).toMatchObject({ color: LISERE.soleil, side: -1 });
  });

  it('il respire (de 3,4 s en 3,4 s, chacun à son rythme) ; immobile en mouvement réduit ; toujours une des trois couleurs', () => {
    const ks = Array.from({ length: 35 }, (_, i) => lisereOf({ phase: nuit, lune: 0.8, at, t: i * 0.1 }).k);
    // (de son creux à son plein : plus du double)
    expect(Math.min(...ks) / Math.max(...ks)).toBeLessThan(0.5);
    expect(lisereOf({ phase: nuit, lune: 0.8, at, t: 0 }).k).toBeCloseTo(lisereOf({ phase: nuit, lune: 0.8, at, t: 3.4 }).k);
    expect(lisereOf({ phase: nuit, lune: 0.8, at, t: 1, still: true }).k).toBe(lisereOf({ phase: nuit, lune: 0.8, at, t: 2, still: true }).k);
    expect(graineOf('vil:puits')).not.toBe(graineOf('vil:potager'));
    for (const lumieres of [[], [feu(120)], [{ ...feu(120), color: '150,220,255' }]]) {
      const l = lisereOf({ phase: nuit, lune: 0.8, at, lumieres });
      expect(Object.values(LISERE)).toContain(l.color);
    }
  });

  it('la lune éclaire selon la nuit, sa phase et les nuages', () => {
    const pleine = new Date(Date.UTC(2026, 9, 26, 4)), nouvelle = new Date(Date.UTC(2026, 9, 10, 16));
    expect(luneOf(phase(), pleine)).toBe(0);
    expect(luneOf(nuit, pleine)).toBeGreaterThan(luneOf(nuit, nouvelle));
    expect(luneOf({ ...nuit, weather: { cover: 1 } }, pleine)).toBeLessThan(luneOf(nuit, pleine));
  });
});
