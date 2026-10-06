// Lot H8 (HISTOIRE.md, § 4.5, § 6.14, § 8 et § 16) : les traces d'Anya, les pressentiments, la Révélation (deux
// répliques finales, selon le Phare), Anya au Cercle à l'aube et au crépuscule, ses créatures, le Cercle fleuri.
import { describe, it, expect } from 'vitest';
import { TRACES, TRACE_COUNT, traceDue, traceFrames, PRESENTIMENTS, revelationFrames, anyaHere } from '@/game/anya';
import { villageOf } from '@/world/village';
import { skyAt } from '@/world/sky';
import { landmarkLayers } from '@/world/landmarkSprites';
import { ANIMAL_SPRITES } from '@/world/animals';

const LANDS = ['menhirs', 'roselieres', 'falaises', 'bayou', 'contreforts', 'oasis', 'neiges', 'dunes', 'canopee', 'cascade', 'coulees', 'cratere'];

describe('Anya : traces, pressentiments, Révélation', () => {
  it('douze traces, une par terre nouvelle ; la plus récente pas encore vue d’abord', () => {
    expect(Object.keys(TRACES).sort()).toEqual([...LANDS].sort());
    expect(TRACE_COUNT).toBe(12);
    expect(traceDue([], [])).toBe(null);
    expect(traceDue(['menhirs', 'roselieres'], [])).toBe('roselieres');
    expect(traceDue(['menhirs', 'roselieres'], ['roselieres'])).toBe('menhirs');
    expect(traceDue(['menhirs', 'phare'], ['menhirs'])).toBe(null);
    expect(traceFrames('dunes', 5)).toEqual([{ art: 'trace', caption: 'Traces d’Anya : 5 / 12', text: 'Le vent chante deux syllabes : « A… nya ».' }]);
  });
  it('les pressentiments et la Révélation tiennent en une bulle ; deux répliques finales, selon le Phare', () => {
    const lines = [...Object.values(PRESENTIMENTS).flat(), ...revelationFrames()];
    for (const line of lines) expect(line.text.length, line.text).toBeLessThanOrEqual(140);
    const ARTS = ['cercle', 'cercle-sceaux', 'anya', 'gemme'];
    expect(revelationFrames().every(frame => ARTS.includes(frame.art))).toBe(true);
    expect(revelationFrames({ lit: false }).pop().text).toBe('Allume ton phare, petite flamme. Je veillerai sur la terre.');
    expect(revelationFrames({ lit: true }).pop().text).toBe('Ta lumière guide la mer. La mienne gardera la terre.');
    expect(revelationFrames().some(frame => frame.who === 'Brume' && frame.text === '… Tu es revenue.')).toBe(true);
    expect(PRESENTIMENTS.vie[0].text).toBe('… merci.');
  });
  it('Anya est au Cercle à l’aube et au crépuscule seulement', () => {
    expect(anyaHere(6.2, 6, 21.5)).toBe(true);
    expect(anyaHere(21.9, 6, 21.5)).toBe(true);
    expect(anyaHere(13, 6, 21.5)).toBe(false);
  });
});

describe('Anya sur l’île', () => {
  // Petite île de 14 × 14 : un chemin en croix, de l'herbe, une mare au sud-est ; le Cercle de menhirs en (3, 9)
  const N = 14;
  const ground = Array.from({ length: N }, (_, y) => Array.from({ length: N }, (_, x) => {
    if (x === 0 || y === 0 || x === N - 1 || y === N - 1) return '~';
    if (x === 7 || y === 7) return 'p';
    if (x > 10 && y > 10) return 'w';
    return 'g';
  }).join(''));
  const M = { ground: (x, y) => (x < 0 || y < 0 || x >= N || y >= N ? '~' : ground[y][x]), height: () => 1, zone: (x, y) => (x < 0 || y < 0 || x >= N || y >= N ? -1 : 0) };
  const sites = [{ id: 'foyer', name: 'Maison', x: 4, y: 4, w: 2, h: 2, level: 3 }];
  const island = opts => villageOf({ n: N, M, sites, owned: new Set([0]), crafts: [], props: [], ...opts });
  const at = h => skyAt(new Date(2026, 5, 21, Math.floor(h), Math.round((h % 1) * 60)), { weather: 'clair' });
  const ids = (v, h) => v.at(30, at(h)).list.map(c => c.id);

  it('révélée : au Cercle à l’aube et au crépuscule, son cerf blanc et ses lucioles ; ses loutres le jour', () => {
    const v = island({ anya: { x: 3, y: 9 } });
    const dawn = at(6);
    const life = v.at(30, dawn).list;
    expect(life.map(c => c.id)).toEqual(expect.arrayContaining(['anya:dame', 'anya:cerf', 'anya:luciole:0']));
    expect(v.say(life.find(c => c.id === 'anya:dame'), dawn).title).toBe('Anya');
    expect(ids(v, 13).some(id => id === 'anya:dame')).toBe(false);
    expect(ids(v, 13).some(id => id.startsWith('anya:otter'))).toBe(true);
    // Pas révélée : rien de tout cela
    expect(ids(island({}), 13).some(id => id.startsWith('anya:'))).toBe(false);
    for (const c of life.filter(c => c.kind === 'beast')) expect(c.sprite[1]().svg, c.id).not.toMatch(/NaN|undefined/);
  });
  it('le bol de soupe « pour la Dame », le soir, au bord du Foyer', () => {
    expect(ids(island({ dame: true }), 23)).toContain('dame:bol');
    expect(ids(island({ dame: true }), 13)).not.toContain('dame:bol');
    expect(ids(island({}), 23)).not.toContain('dame:bol');
  });
  it('le Cercle fleuri, et les dessins d’Anya', () => {
    expect(landmarkLayers('menhirs', 0)).toHaveLength(1);
    expect(landmarkLayers('menhirs', 0, true)).toHaveLength(2);
    expect(landmarkLayers('lac', 0, true)).toHaveLength(landmarkLayers('lac', 0).length);
    expect(landmarkLayers('menhirs', 0, true)[1].make().svg).not.toMatch(/NaN|undefined/);
    for (const species of ['anya', 'otter', 'soup']) for (const frame of [0, 1, 'rest']) expect(ANIMAL_SPRITES[species](frame, '').svg).toMatch(/^<svg/);
    expect(ANIMAL_SPRITES.deer(0, 'blanc').svg).not.toBe(ANIMAL_SPRITES.deer(0, '').svg);
  });
});
