// Lots H8 et H9.1 (HISTOIRE.md, § 4.5, § 6.14, § 8 et § 16, v6) : les traces d'Anya, les pressentiments, la Révélation
// (deux répliques finales, selon le Phare), son errance (le passage du jour, à l'aube ou au crépuscule), ses créatures,
// le Cercle fleuri.
import { describe, it, expect } from 'vitest';
import { TRACES, TRACE_COUNT, traceDue, traceFrames, tracesOf, seenOf, PRESENTIMENTS, revelationFrames, anyaHere, anyaSceneOf } from '@/game/anya';
import { villageOf } from '@/world/village';
import { skyAt } from '@/world/sky';
import { landmarkLayers } from '@/world/landmarkSprites';
import { ANIMAL_SPRITES } from '@/world/animals';

describe('Anya : traces, pressentiments, Révélation', () => {
  it('huit traces, dans l’ordre ; la plus récente pas encore vue d’abord', () => {
    expect(TRACE_COUNT).toBe(8);
    expect(TRACES[0]).toBe('Les pierres sont tièdes, comme une main.');
    expect(TRACES[7]).toBe('Sous tes pieds, un battement : un cœur qui s’éveille.');
    for (const text of TRACES) expect(text.length).toBeLessThanOrEqual(140);
    expect(traceDue([], [])).toBe(null);
    expect(traceDue([1, 2], [])).toBe(2);
    expect(traceDue([1, 2], [2])).toBe(1);
    expect(traceDue([1, 2], [1, 2])).toBe(null);
    expect(traceFrames('7', 7)).toEqual([{ art: 'trace', caption: 'Traces d’Anya : 7 / 8', text: 'Le vent chante deux syllabes : « A… nya ».' }]);
  });
  it('les traces d’avant la v6 (nommées par terre) comptent une à une, sans aller jusqu’à la huitième', () => {
    // Ancien serveur : des terres ; nouveau : des numéros
    expect(tracesOf({ traces: ['menhirs', 'roselieres'] })).toEqual([1, 2]);
    expect(tracesOf({ traces: [1, 2, 3] })).toEqual([1, 2, 3]);
    expect(tracesOf({ traces: Array.from({ length: 12 }, (_, i) => `terre${i}`) })).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(tracesOf(null)).toEqual([]);
    // Mémoire de l'appareil : trois terres déjà vues valent les traces 1 à 3 (elles ne se rejouent pas)
    expect(seenOf(['menhirs', 'roselieres', 'falaises'])).toEqual([1, 2, 3]);
    expect(seenOf('abîmé')).toEqual([]);
    expect(traceDue([1, 2, 3], ['menhirs', 'roselieres', 'falaises'])).toBe(null);
    expect(traceDue([1, 2, 3, 4], ['menhirs', 'roselieres', 'falaises'])).toBe(4);
    // Des valeurs hors d'usage sont ignorées
    expect(tracesOf({ traces: [0, 9, 2.5, null, 3] })).toEqual([3]);
  });
  it('les pressentiments et la Révélation tiennent en une bulle ; deux répliques finales, selon le Phare', () => {
    const lines = [...Object.values(PRESENTIMENTS).flat(), ...revelationFrames()];
    for (const line of lines) expect(line.text.length, line.text).toBeLessThanOrEqual(140);
    const ARTS = ['cercle', 'cercle-sceaux', 'anya', 'gemme'];
    expect(revelationFrames().every(frame => ARTS.includes(frame.art))).toBe(true);
    expect(revelationFrames({ lit: false }).pop().text).toBe('Allume ton phare, petite flamme. Je veillerai sur la terre.');
    expect(revelationFrames({ lit: true }).pop().text).toBe('Ta lumière guide la mer. La mienne gardera la terre.');
    expect(revelationFrames().some(frame => frame.who === 'Brume' && frame.text === '… Tu es revenue.')).toBe(true);
    expect(PRESENTIMENTS.vie[0]).toMatchObject({ who: 'Une voix', text: '« … Merci. »' });
  });
  it('sur l’île : la huitième trace d’abord, puis la Révélation, une seule fois', () => {
    const all = [1, 2, 3, 4, 5, 6, 7, 8];
    expect(anyaSceneOf(null, [])).toBe(null);
    expect(anyaSceneOf({ traces: all, awake: true, revealed: false }, all.slice(0, 7))).toBe('trace-8');
    expect(anyaSceneOf({ traces: all, awake: true, revealed: false }, all)).toBe('revelation');
    expect(anyaSceneOf({ traces: all, awake: true, revealed: true }, all)).toBe(null);
    expect(anyaSceneOf({ traces: [1], awake: false, revealed: false }, [])).toBe('trace-1');
  });
  it('son passage : autour du lever (aube) ou du coucher (crépuscule) seulement', () => {
    expect(anyaHere(6.2, 6, 21.5, 'aube')).toBe(true);
    expect(anyaHere(21.9, 6, 21.5, 'aube')).toBe(false);
    expect(anyaHere(21.9, 6, 21.5, 'crepuscule')).toBe(true);
    expect(anyaHere(6.2, 6, 21.5, 'crepuscule')).toBe(false);
    expect(anyaHere(13, 6, 21.5, 'aube')).toBe(false);
    // Sans moment donné : l'un ou l'autre
    expect(anyaHere(6.2, 6, 21.5)).toBe(true);
    expect(anyaHere(21.9, 6, 21.5)).toBe(true);
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

  it('le jour de son passage, à son moment : là où le serveur l’a tirée, avec son cerf blanc et ses lucioles', () => {
    const v = island({ anya: { visit: { slot: 'aube', x: 3, y: 9 } } });
    const dawn = at(6);
    const life = v.at(30, dawn).list;
    expect(life.map(c => c.id)).toEqual(expect.arrayContaining(['anya:dame', 'anya:cerf', 'anya:luciole:0']));
    const dame = life.find(c => c.id === 'anya:dame');
    expect([dame.x, dame.y]).toEqual([3.5, 9.5]);
    expect(v.say(dame, dawn).title).toBe('Anya');
    expect(v.describe(dame).hint).toBe('Toucher : son Souffle, une fois par passage');
    // Pas au crépuscule ce jour-là, ni à midi ; ses loutres jouent le jour
    expect(ids(v, 21.6).some(id => id === 'anya:dame')).toBe(false);
    expect(ids(v, 13).some(id => id === 'anya:dame')).toBe(false);
    expect(ids(v, 13).some(id => id.startsWith('anya:otter'))).toBe(true);
    // (le dessin de la bibliothèque se lit à la demande : load)
    for (const c of life.filter(c => c.kind === 'beast')) {
      const { svg, load } = c.sprite[1]();
      expect(Boolean(svg || load), c.id).toBe(true);
      if (svg) expect(svg, c.id).not.toMatch(/NaN|undefined/);
    }
  });
  it('révélée mais pas de passage aujourd’hui : seulement ses loutres ; pas révélée : rien', () => {
    const away = island({ anya: { visit: null } });
    expect(ids(away, 6).some(id => ['anya:dame', 'anya:cerf'].includes(id))).toBe(false);
    expect(ids(away, 13).some(id => id.startsWith('anya:otter'))).toBe(true);
    expect(ids(island({}), 13).some(id => id.startsWith('anya:'))).toBe(false);
  });
  it('le signe de son passage : les bêtes alentour se tournent toutes vers elle', () => {
    // Une tortue au bord de la mare (écrite dans le Grimoire) ; Anya passe juste à côté, d'un côté puis de l'autre
    const facing = visit => {
      const b = island({ written: ['Tortue'], anya: { visit } }).at(30, at(6)).list.find(c => c.id === 'best:tortoise');
      return { b, toward: (visit.x - b.x) - (visit.y - b.y) < 0 };
    };
    const sides = [{ slot: 'aube', x: 9, y: 12 }, { slot: 'aube', x: 12, y: 9 }].map(facing);
    for (const { b, toward } of sides) expect(b.flip).toBe(toward);
    // D'un côté, puis de l'autre : elle se retourne vraiment
    expect(sides[0].b.flip).not.toBe(sides[1].b.flip);
  });
  it('le bol de soupe « pour la Dame », le soir, au bord du Foyer', () => {
    expect(ids(island({ dame: true }), 23)).toContain('dame:bol');
    expect(ids(island({ dame: true }), 13)).not.toContain('dame:bol');
    expect(ids(island({}), 23)).not.toContain('dame:bol');
  });
  it('le Cercle fleuri, et les dessins d’Anya', () => {
    // Le Cercle fleuri a son dessin (bibliothèque : menhirs_fleuri ; code : un calque de fleurs de plus) ; pas le lac
    const keys = (id, bloom) => landmarkLayers(id, 0, bloom).map(l => l.key);
    expect(keys('menhirs', true)).not.toEqual(keys('menhirs', false));
    expect(keys('lac', true)).toEqual(keys('lac', false));
    for (const layer of landmarkLayers('menhirs', 0, true)) {
      const { svg, load } = layer.make();
      expect(Boolean(load) || !/NaN|undefined/.test(svg)).toBe(true);
    }
    for (const species of ['anya', 'otter', 'soup']) for (const frame of [0, 1, 'rest']) expect(ANIMAL_SPRITES[species](frame, '').svg).toMatch(/^<svg/);
    expect(ANIMAL_SPRITES.deer(0, 'blanc').svg).not.toBe(ANIMAL_SPRITES.deer(0, '').svg);
  });
});
