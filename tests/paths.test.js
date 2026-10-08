// Les chemins de la bibliothèque sur l'île (terrain.pathDraws) : une case de large, son raccord ; plus large, un seul
// chemin au milieu, sur les coins partagés, et le bout qui relie un chemin d'une case
import { describe, it, expect } from 'vitest';
import { pathDraws } from '@/world/terrain';

// Une carte : '#' chemin, 'k' gué, '.' herbe ; tout au même niveau
const mapOf = rows => ({
  ground: (x, y) => { const c = (rows[y] || '')[x]; return c === '#' ? 'p' : c === 'k' ? 'k' : 'g'; },
  surface: () => 0
});

describe('les chemins de la bibliothèque', () => {
  it('un chemin d’une case : son raccord vers ses voisines (gué compris), sans découpe', () => {
    const M = mapOf(['.....', '.###k', '.....']);
    const { clip, draws } = pathDraws(M, 2, 1);
    expect(clip).toBe(false);
    expect(draws).toHaveLength(1);
    expect(draws[0].file).toMatch(/^chemin_se-no(_b)?\.svg$/);
    expect(pathDraws(M, 1, 1).draws[0].file).toMatch(/^chemin_se(_b)?\.svg$/);
  });

  it('un chemin de deux cases : un seul chemin au milieu, sur les coins, découpé dans chaque case', () => {
    const M = mapOf(['......', '.####.', '.####.', '......']);
    const { clip, draws } = pathDraws(M, 2, 1);
    expect(clip).toBe(true);
    // Les coins (1½, 1½) et (2½, 1½) : le chemin du milieu va d'est en ouest
    expect(draws.map(d => [d.dx, d.dy])).toEqual([[-32, 0], [0, 16]]);
    expect(draws.every(d => /^chemin_(se|no|se-no)(_b)?\.svg$/.test(d.file))).toBe(true);
  });

  it('un chemin d’une case qui arrive sur un chemin large : la case large trace le bout qui les relie', () => {
    const M = mapOf(['..#...', '.####.', '.####.', '......']);
    const { draws } = pathDraws(M, 2, 1);
    expect(draws.some(d => d.dx === 0 && d.dy === 0 && /ne/.test(d.file))).toBe(true);
  });
});
