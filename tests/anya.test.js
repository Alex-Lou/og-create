// Lots H8 et H9.1 (HISTOIRE.md, § 4.5, § 6.14, § 8 et § 16, v6) : les traces d'Anya, les pressentiments, la Révélation
// (deux répliques finales, selon le Phare), son errance (le passage du jour, à l'aube ou au crépuscule), ses créatures,
// le Cercle fleuri.
import { describe, it, expect } from 'vitest';
import { TRACES, TRACE_COUNT, traceDue, traceFrames, tracesOf, seenOf, PRESENTIMENTS, revelationFrames, anyaHere, anyaSceneOf, anyaVisitClock } from '@/game/anya';
import { anyaPath, anyaPose, anyaSign } from '@/world/village/anya';
import { anyaArt, cerfArt, frameOf, durationOf, ANYA_POSES } from '@/world/anyaArt';
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
    // (elle erre autour du point tiré, dans un petit rayon : 2,4 cases)
    const dame = life.find(c => c.id === 'anya:dame');
    expect(Math.hypot(dame.x - 3.5, dame.y - 9.5)).toBeLessThanOrEqual(2.4);
    expect(dame.sprite[0]).toMatch(/^lib-anya_/);
    expect(life.find(c => c.id === 'anya:cerf').sprite[0]).toMatch(/^lib-cerf-blanc_/);
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
    // Une bête à côté d'elle, d'un côté puis de l'autre : elle se retourne vers Anya ; trop loin, elle ne bouge pas
    const turned = (x, y, flip) => {
      const out = [{ id: 'wild:tortue:coeur:0', species: 'tortoise', x, y, flip }];
      anyaSign(out, { x: 9, y: 9 });
      return out[0].flip;
    };
    expect(turned(6, 12, true)).toBe(false);
    expect(turned(12, 6, false)).toBe(true);
    expect(turned(30, 30, false)).toBe(false);
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
    for (const species of ['otter']) for (const frame of [0, 1, 'rest']) expect(ANIMAL_SPRITES[species](frame, '').svg).toMatch(/^<svg/);
  });
  it('son errance : elle se repose, puis flotte vers l’étape suivante, sans jamais quitter son rayon', () => {
    const center = { x: 10, y: 10 };
    const pts = Array.from({ length: 400 }, (_, i) => anyaPath(i * 0.7, center, 7));
    for (const p of pts) expect(Math.hypot(p.x - center.x, p.y - center.y)).toBeLessThanOrEqual(2.4 + 1e-9);
    expect(pts.some(p => p.moving)).toBe(true);
    expect(pts.some(p => !p.moving)).toBe(true);
    // (elle glisse sans à-coup : d'un instant au suivant, elle ne saute pas)
    for (let t = 0; t < 60; t += 0.1) {
      const a = anyaPath(t, center, 7), b = anyaPath(t + 0.1, center, 7);
      expect(Math.hypot(b.x - a.x, b.y - a.y)).toBeLessThan(0.2);
    }
  });
  it('son passage : elle apparaît au début, disparaît à la fin ; touchée, rarement, elle murmure', () => {
    const { rise, set } = { rise: 6.6, set: 19.3 };
    expect(anyaVisitClock(13, rise, set)).toBe(null);
    const start = anyaVisitClock(rise - 1.2 + 1e-4, rise, set, 'aube');
    expect(start.since).toBeLessThan(1);
    expect(start.until).toBeGreaterThan(60);
    const rest = { x: 0, y: 0, dx: 0, dy: 0, moving: false };
    expect(anyaPose(30, { clock: start, path: rest, touch: null }).pose).toBe('apparaitre');
    expect(anyaPose(30, { clock: { since: 300, until: 0.5 }, path: rest, touch: null }).pose).toBe('disparaitre');
    expect(anyaPose(30, { clock: { since: 300, until: 300 }, path: rest, touch: null }).pose).toBe('repos');
    expect(anyaPose(30, { clock: { since: 300, until: 300 }, path: { ...rest, dx: 1, dy: 0.5, moving: true }, touch: null })).toMatchObject({ pose: 'marche', view: 'avant', flip: false });
    // le murmure : une fois sur huit environ, selon l'instant du toucher ; trois phrases
    const murmures = Array.from({ length: 400 }, (_, i) => anyaPose(100 + i * 0.37, { clock: null, path: rest, touch: 0.5 })).filter(l => l.pose === 'murmure');
    expect(murmures.length).toBeGreaterThan(20);
    expect(murmures.length).toBeLessThan(100);
    expect(new Set(murmures.map(l => l.phrase)).size).toBe(3);
  });
  it('les dessins d’Anya et de son cerf de lune dans la bibliothèque', () => {
    for (const [pose, n] of [['repos', 4], ['marche', 8], ['apparaitre', 6], ['disparaitre', 6], ['murmure', 4]]) {
      for (const view of pose === 'marche' ? ['avant', 'dos'] : ['face', 'avant', 'dos']) expect(anyaArt(pose, view, n, { season: 'hiver', phrase: 2 }), `${view} ${pose}`).not.toBe(null);
    }
    expect(anyaArt('repos', 'face', 1, { season: 'hiver' }).key).toBe('lib-anya_face_repos_hiver_1');
    expect(anyaArt('marche', 'face', 1)).toBe(null);
    for (const view of ['face', 'avant', 'dos']) expect(cerfArt('marche', view, 8)).not.toBe(null);
    // (le cerf un peu plus petit qu'elle : ses bois arrivent à sa couronne)
    const cerf = cerfArt('debout', 'avant', 1).make().box, dame = anyaArt('repos', 'face', 1).make().box;
    expect(cerf.h).toBeLessThan(dame.h);
    expect(cerf.h).toBeGreaterThan(dame.h * 0.8);
  });
  it('ses animations aux images de durées différentes (son repos : elle respire, cligne à la 4e)', () => {
    const repos = ANYA_POSES.repos;
    expect(durationOf(repos)).toBeCloseTo(3.28);
    expect([0, 1.05, 1.1, 2.0, 3.1, 3.27, 3.28, 4.4].map(s => frameOf(repos, s))).toEqual([1, 1, 2, 3, 4, 4, 1, 2]);
    // (jouée une fois, elle reste sur sa dernière image)
    expect(frameOf(ANYA_POSES.eveil, 0.69, true)).toBe(1);
    expect(frameOf(ANYA_POSES.eveil, 0.71, true)).toBe(2);
    expect(frameOf(ANYA_POSES.eveil, 40, true)).toBe(2);
    expect(frameOf(ANYA_POSES.apparaitre, 0.53, true)).toBe(3);
  });
});
