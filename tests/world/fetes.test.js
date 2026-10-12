// Les fêtes de l'île (world/fetes.js) : le chef d'orchestre en joue une à la fois, le palier IV a son Grand moment, le mot
// dit le nom et le palier, le projecteur monte, tient et s'efface au toucher.
import { describe, expect, it, vi } from 'vitest';
import { orchestra, enqueue, tick, kindOf, wordsOf, spotlightOf, drawFete, drawSmall, DURATION, BURST_MS, RAISE_MS, addSmall, smallNow, gainsOf, SMALL_MS, MAX_SMALL, MAX_WAITING } from '@/world/fetes';

// Les sprites de lumière sont des toiles : ici, un simple repère
vi.mock('@/utils/vfx', () => ({
  lueur: () => 'lueur',
  etoile: () => 'etoile',
  // (l'anneau magique, comme le vrai : jamais un rayon négatif ; utils/vfx.js, testé à part)
  anneau: (g, x, y, rx, ry) => { if (rx < 0 || ry < 0) throw new RangeError('rayon négatif'); }
}));

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

  it('une Fête sans bâtiment (un quartier, un lieu) a sa propre ligne sous le mot', () => {
    const f = { id: 'quartier:est', kind: 'fete', at: { x: 0, y: 0, top: 40 }, line: 'Nouveau quartier · Les Hauts' };
    expect(wordsOf(f).line).toBe('Nouveau quartier · Les Hauts');
    expect(wordsOf(f).word).toMatch(/!$/);
    // sa lumière se dessine sans bâtiment ni palier
    const calls = [];
    const ctx = new Proxy({}, { get: (o, k) => k in o ? o[k] : (...a) => { calls.push([k, ...a]); return { addColorStop() {} }; }, set: (o, k, v) => { o[k] = v; return true; } });
    expect(() => [100, 1500, 2500].forEach(ms => drawFete(ctx, { ...f, ...f.at, start: 0 }, ms))).not.toThrow();
    expect(calls.filter(([k, , x]) => k === 'drawImage' && Number.isNaN(x))).toEqual([]);
  });

  it('les petits gestes passent tout de suite, s’en vont à leur fin, et jamais plus de MAX_SMALL à la fois', () => {
    let list = addSmall([], { kind: 'petille', x: 1, y: 2 }, 1000);
    list = addSmall(list, { kind: 'eclat', x: 3, y: 4 }, 1100);
    expect(list.map(s => s.kind)).toEqual(['petille', 'eclat']);
    expect(smallNow(list, 1000 + SMALL_MS.petille).map(s => s.kind)).toEqual(['eclat']);
    for (let i = 0; i < 20; i++) list = addSmall(list, { kind: 'petille', x: i, y: 0 }, 1200 + i);
    expect(list).toHaveLength(MAX_SMALL);
    expect(list.at(-1).x).toBe(19);
  });

  it('une image datée d’avant le geste ne casse pas le dessin (un rayon négatif laisserait la toile en mode lumière)', () => {
    const ctx = new Proxy({}, {
      get: (o, k) => k in o ? o[k] : k === 'ellipse' ? (x, y, rx, ry) => { if (rx < 0 || ry < 0) throw new RangeError('rayon négatif'); } : () => {},
      set: (o, k, v) => { o[k] = v; return true; }
    });
    for (const kind of ['eclat', 'petille']) expect(() => drawSmall(ctx, { kind, x: 0, y: 0, top: 40, start: 1000, seed: 3 }, 900)).not.toThrow();
  });

  it('ce qu’on gagne : chaque ressource avec son icône, puis les écus ; rien de ce qui vaut zéro', () => {
    expect(gainsOf({ stock: { wood: 3, stone: 0, food: 2 }, coins: 5, glyphOf: r => `res:${r}` })).toEqual([
      { glyph: 'res:wood', text: '+3' }, { glyph: 'res:food', text: '+2' }, { glyph: 'ui:coin', text: '+5' }
    ]);
    expect(gainsOf({})).toEqual([]);
  });

  it('la file d’attente : la plus récente pour un même bâtiment, au plus MAX_WAITING, jamais un Grand moment écarté', () => {
    const o = orchestra();
    enqueue(o, fete('ponton', 2), 0);
    enqueue(o, fete('puits', 2), 1);
    enqueue(o, fete('puits', 3), 2);
    expect(o.waiting.map(f => f.id)).toEqual(['puits:3']);
    enqueue(o, fete('foyer', 4), 3);
    for (const site of ['atelier', 'bosquet', 'carriere', 'potager']) enqueue(o, fete(site, 2), 4);
    expect(o.waiting).toHaveLength(MAX_WAITING);
    expect(o.waiting.map(f => f.id)).toContain('foyer:4');
  });

  it('rien n’est recréé à chaque image tant que rien ne finit', () => {
    const o = orchestra();
    enqueue(o, fete('ponton', 2), 0);
    const playing = o.playing;
    expect(tick(o, 10)).toBe(tick(o, 20));
    expect(o.playing).toBe(playing);
    const list = addSmall([], { kind: 'petille', x: 0, y: 0 }, 0);
    expect(smallNow(list, 10)).toBe(list);
    expect(smallNow(list, SMALL_MS.petille)).toEqual([]);
  });
});
