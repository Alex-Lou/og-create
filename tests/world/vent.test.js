// Le vent sur l'herbe (world/lumiere/vent.js) : une vague ne se pose qu'au milieu d'une herbe (ni au bord de l'eau, ni
// d'un chemin, ni d'une falaise) ; elle va et vient, de 0 à 1, par bandes qui avancent avec le temps.
import { describe, expect, it } from 'vitest';
import { herbMask, sheenAt } from '@/world/lumiere/vent';

function mapOf(rows, high = []) {
  const n = rows.length;
  const ground = (x, y) => (rows[y] && rows[y][x]) || '~';
  return { n, ground, land: (x, y) => ground(x, y) !== '~', surface: (x, y) => (high.some(([hx, hy]) => hx === x && hy === y) ? 2 : 1) };
}

describe('vent sur l’herbe', () => {
  it('au milieu d’une herbe seulement : pas au bord de l’eau, d’un chemin ou d’une marche', () => {
    const M = mapOf(['ggggg', 'ggggg', 'ggggw', 'gpggg', 'ggggg']);
    const at = (x, y) => herbMask(M)[y * M.n + x];
    expect(at(1, 1)).toBe(1);
    expect(at(3, 2)).toBe(0);
    expect(at(1, 2)).toBe(0);
    expect(at(0, 0)).toBe(0);
    const H = mapOf(['ggggg', 'ggggg', 'ggggg', 'ggggg', 'ggggg'], [[2, 1]]);
    expect(herbMask(H)[2 * 5 + 2]).toBe(0);
    expect(herbMask(H)[3 * 5 + 3]).toBe(1);
  });

  it('la vague va de 0 à 1, par bandes, et avance avec le temps', () => {
    const values = [];
    for (let x = 0; x < 30; x++) values.push(sheenAt(x, 0, 3));
    expect(Math.min(...values)).toBe(0);
    expect(Math.max(...values)).toBeGreaterThan(0.05);
    expect(Math.max(...values)).toBeLessThanOrEqual(1);
    expect(values.filter(v => v > 0).length).toBeLessThan(values.length);
    // (une case dans une bande : un instant plus tard, la bande a avancé)
    const lit = values.findIndex(v => v > 0.05);
    expect(sheenAt(lit, 0, 3.5)).not.toBeCloseTo(sheenAt(lit, 0, 3), 3);
  });
});
