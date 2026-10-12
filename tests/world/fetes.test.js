// Les fêtes de l'île (world/fetes.js) : le chef d'orchestre en joue une à la fois, le palier IV a son Grand moment, le mot
// dit le nom et le palier, le projecteur monte, tient et s'efface au toucher.
import { describe, expect, it } from 'vitest';
import { orchestra, enqueue, tick, kindOf, wordsOf, spotlightOf, DURATION, BURST_MS, RAISE_MS } from '@/world/fetes';

const fete = (site, level, name = 'Le Ponton') => ({ id: `${site}:${level}`, kind: kindOf(level), site, from: level - 1, level, name });

describe('fêtes de l’île', () => {
  it('le chef d’orchestre joue une fête à la fois, les autres attendent leur tour', () => {
    const o = orchestra();
    expect(enqueue(o, fete('ponton', 2), 1000)).toHaveLength(1);
    expect(enqueue(o, fete('puits', 3), 1100)).toEqual([]);
    expect(o.playing.map(f => f.site)).toEqual(['ponton']);
    // tant que la première joue, rien ne commence
    expect(tick(o, 1000 + DURATION.fete - 1)).toEqual([]);
    // elle finit : la suivante commence à cet instant
    const started = tick(o, 1000 + DURATION.fete);
    expect(started.map(f => [f.site, f.start])).toEqual([['puits', 1000 + DURATION.fete]]);
    expect(o.waiting).toEqual([]);
    expect(tick(o, 1000 + DURATION.fete * 2 + 1)).toEqual([]);
    expect(o.playing).toEqual([]);
  });

  it('le palier IV a son Grand moment, les autres paliers leur Fête', () => {
    expect([1, 2, 3, 4, 5].map(kindOf)).toEqual(['fete', 'fete', 'fete', 'grand', 'fete']);
    expect(DURATION.grand).toBeGreaterThan(DURATION.fete);
  });

  it('l’éclat tombe au rebond du bâtiment qui s’élève', () => {
    expect(BURST_MS).toBeCloseTo(RAISE_MS * 0.85);
  });

  it('le mot dit le nom et le palier, toujours le même pour un bâtiment et un palier', () => {
    const a = wordsOf(fete('ponton', 3));
    expect(a.line).toBe('Le Ponton · palier III');
    expect(a.word).toMatch(/!$/);
    expect(wordsOf(fete('ponton', 3)).word).toBe(a.word);
    expect(['Merveilleux !', 'Quelle splendeur !']).toContain(wordsOf(fete('ponton', 4)).word);
  });

  it('le projecteur du Grand moment monte, tient, s’efface au toucher ; rien pour une Fête', () => {
    const g = { ...fete('ponton', 4), start: 0 };
    expect(spotlightOf(g, 0)).toBe(0);
    expect(spotlightOf(g, 2000)).toBe(1);
    expect(spotlightOf(g, DURATION.grand)).toBe(0);
    // un toucher à 2 s : effacé 400 ms plus tard
    expect(spotlightOf(g, 2200, 2000)).toBeGreaterThan(0);
    expect(spotlightOf(g, 2400, 2000)).toBe(0);
    expect(spotlightOf({ ...fete('ponton', 2), start: 0 }, 2000)).toBe(0);
  });
});
