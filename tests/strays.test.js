// Les nuits sur l'île (HISTOIRE.md § 6.15) : où est un égaré et ce qu'il fait (le serveur décide de son chemin et de
// son sort), ses dessins de la bibliothèque, le bâtiment embrumé, le bilan de Brume au matin
import { describe, it, expect } from 'vitest';
import { strayAt, nightNow, recapOf, lineOf, MS_PER_CELL } from '@/world/strays';
import { EGARES } from '@/game/prologue';
import { strayKind, strayLayer, strayName, blightLayer, cloudLayer, repairIcon } from '@/world/nightArt';

const AT = Date.parse('2026-10-08T19:30:00Z');
const PATH = [{ x: 10, y: 10 }, { x: 11, y: 10 }, { x: 12, y: 11 }, { x: 12, y: 12 }];
const stray = (end, step) => ({ id: '2026-10-08:0', site: 'puits', path: PATH, at: AT, arrives: AT + 3 * MS_PER_CELL, end, step });

describe('un égaré dans la nuit', () => {
  it('pas encore sorti de la brume ; puis il marche, une case toutes les 2 minutes, tourné où il va', () => {
    const c = stray('arrive', 3);
    expect(strayAt(c, AT - 1)).toBeNull();
    const half = strayAt(c, AT + MS_PER_CELL / 2);
    expect([half.x, half.y, half.pose, half.view, half.flip]).toEqual([10.5, 10, 'marche', 'avant', false]);
    // Vers le bas de l'écran (y croissant) : de trois quarts avant, en miroir
    const down = strayAt(c, AT + 2.5 * MS_PER_CELL);
    expect([down.x, down.y, down.view, down.flip]).toEqual([12, 11.5, 'avant', true]);
  });
  it('arrivé, il se fond dans son bâtiment ; changé en luciole, il luit jusqu’au matin', () => {
    const arrived = AT + 3 * MS_PER_CELL;
    expect(strayAt(stray('arrive', 3), arrived + 100).pose).toBe('brume');
    expect(strayAt(stray('arrive', 3), arrived + 5000)).toBeNull();
    const lit = AT + MS_PER_CELL;
    expect(strayAt(stray('luciole', 1), lit + 250)).toMatchObject({ pose: 'luciole', n: 2, x: 11, y: 10 });
    expect(strayAt(stray('luciole', 1), lit + 3 * 3600 * 1000)).toMatchObject({ glow: true, x: 11, y: 10 });
  });
  it('barré, renvoyé ou repoussé : il boude, puis retourne dans la brume', () => {
    const stop = AT + 2 * MS_PER_CELL;
    expect(strayAt(stray('barre', 2), stop + 600)).toMatchObject({ pose: 'bouderie', n: 2 });
    expect(strayAt(stray('camarade', 2), stop + 2100)).toMatchObject({ pose: 'brume', n: 1 });
    expect(strayAt(stray('barre', 2), stop + 5000)).toBeNull();
    // Repoussé d'un toucher sur cet appareil : sa bouderie se joue là où il était ; vu d'ailleurs (sans l'instant), il est parti
    const touched = AT + 1.5 * MS_PER_CELL;
    expect(strayAt(stray('touche', null), touched + 100, touched)).toMatchObject({ pose: 'bouderie', x: 11.5, y: 10.5 });
    expect(strayAt(stray('touche', null), touched + 100)).toBeNull();
    // Repoussé alors que le serveur ne le sait pas encore : le toucher compte déjà
    expect(strayAt(stray('arrive', 3), touched + 100, touched).pose).toBe('bouderie');
  });
  it('chacun sa manière : son pas, le Dormeur qui s’endort contre la clôture, le Noyé qui sort de la mer, la Racine sous la clôture', () => {
    // Le Dormeur, lent (pace) : il dodeline, puis dort jusqu'au matin ; réveillé (wakeAt), il boude et rentre
    const sleeper = { ...stray('dort', 2), kind: 'zombie', pace: 1.5 * MS_PER_CELL };
    const stop = AT + 3 * MS_PER_CELL;
    expect(strayAt(sleeper, AT + 1.5 * MS_PER_CELL)).toMatchObject({ pose: 'marche', x: 11, y: 10 });
    expect(strayAt(sleeper, stop + 600)).toMatchObject({ pose: 'bouderie', n: 2, x: 12, y: 11 });
    expect(strayAt(sleeper, stop + 2000 + 750)).toMatchObject({ pose: 'dort', n: 2 });
    expect(strayAt(sleeper, stop + 5 * 3600 * 1000)).toMatchObject({ pose: 'dort' });
    const woken = { ...sleeper, wakeAt: stop + 10000 };
    expect(strayAt(woken, stop + 10100)).toMatchObject({ pose: 'bouderie' });
    expect(strayAt(woken, stop + 20000)).toBeNull();
    // Le Noyé sort de la mer, et l'Esprit revient, en sortant de la brume (sa pose brume, à l'envers)
    expect(strayAt({ ...stray('arrive', 3), kind: 'noye' }, AT + 100)).toMatchObject({ pose: 'brume', n: 3 });
    expect(strayAt({ ...stray('arrive', 3), kind: 'esprit', back: 'x' }, AT + 500)).toMatchObject({ pose: 'brume', n: 1 });
    expect(strayAt({ ...stray('arrive', 3), kind: 'noye' }, AT + 700)).toMatchObject({ pose: 'marche' });
    // La Racine s'enfonce avant la clôture (12, 11), y passe dessous, ressort après
    const root = { ...stray('arrive', 3), kind: 'racine' };
    const under = (x, y) => x === 12 && y === 11;
    expect(strayAt(root, AT + 1.2 * MS_PER_CELL, null, under)).toMatchObject({ pose: 'marche' });
    expect(strayAt(root, AT + 1.9 * MS_PER_CELL, null, under)).toMatchObject({ pose: 'terre', n: 3 });
    expect(strayAt(root, AT + 2.1 * MS_PER_CELL, null, under)).toMatchObject({ pose: 'terre', n: 3 });
    expect(strayAt(root, AT + 2.5 * MS_PER_CELL, null, under)).toMatchObject({ pose: 'terre', n: 1 });
    expect(strayAt(root, AT + 2.7 * MS_PER_CELL, null, under)).toMatchObject({ pose: 'marche' });
  });
  it('la nuit est là entre son début et sa fin, une fois les nuits présentées', () => {
    const nights = { started: true, night: { start: AT - 1000, end: AT + 1000 } };
    expect([nightNow(nights, AT), nightNow(nights, AT + 1000), nightNow({ started: false }, AT), nightNow(null, AT)]).toEqual([true, false, false, false]);
  });
});

describe('les dessins des nuits', () => {
  it('chaque égaré a ses poses : son espèce (le serveur la décide), la bête de brume de son climat (le lapin au cœur)', () => {
    expect(['fantome', 'zombie'].map(kind => strayKind(kind, 'dunes'))).toEqual(['fantome', 'zombie']);
    expect([strayKind('bete', 'dunes'), strayKind('bete', null)]).toEqual(['fennec-de-brume', 'lapin-de-brume']);
    // (le Noyé, la Racine, l'Esprit ont leurs dessins ; une espèce inconnue : celui du Sans-Nom)
    expect(['noye', 'racine', 'esprit', undefined].map(kind => strayKind(kind, null))).toEqual(['noye', 'racine', 'esprit', 'fantome']);
    // Sans sa pose terre, la Racine sous la clôture ne se voit pas ; sans sa pose dort, le Dormeur dort debout
    expect(strayLayer('fantome', 'avant', 'terre', 2)).toBeNull();
    expect(strayLayer('zombie', 'avant', 'dort', 1)).not.toBeNull();
    for (const kind of ['fantome', 'zombie', 'lapin-de-brume', 'fennec-de-brume', 'salamandre-de-brume']) {
      for (const [view, pose, n] of [['avant', 'marche', 1], ['dos', 'marche', 2], ['avant', 'bouderie', 2], ['avant', 'luciole', 4], ['avant', 'brume', 3]]) {
        expect(strayLayer(kind, view, pose, n), `${kind} ${view} ${pose} ${n}`).not.toBeNull();
      }
      expect(strayName(kind)).not.toBe('Un égaré');
    }
  });
  it('le bâtiment embrumé : sa brume par emprise, sa guérison une fois, le nuage, l’icône « Réparer »', () => {
    expect(blightLayer(2, 0)).not.toBeNull();
    expect(blightLayer(3, 0.5).key).toMatch(/^embrume-3x3-/);
    expect(blightLayer(2, 0, 100).key).toBe('embrume-2x2_guerison-0');
    expect(blightLayer(2, 0, 400).key).toBe('embrume-2x2_guerison-2');
    expect(blightLayer(2, 0, 2000)).toBeNull();
    expect(cloudLayer(0)).not.toBeNull();
    expect(repairIcon()).toBeTruthy();
  });
});

describe('le bilan de Brume au matin', () => {
  const name = id => ({ carriere: 'Carrière' })[id] || id;
  it('ce qui s’est passé, et le bâtiment embrumé ; rien à dire d’une nuit sans égaré', () => {
    expect(recapOf({ counts: { luciole: 2, barre: 1, camarade: 0, touche: 1, arrive: 1 }, panne: 'carriere' }, name)).toEqual([
      'Cette nuit, 5 égarés sont sortis de la brume.',
      '2 se sont changés en lucioles, près de tes lumières.',
      'L’un s’est arrêté au bord de tes clôtures, puis il est rentré dans la brume.',
      'Tu en as renvoyé un toi-même.',
      'Un égaré s’est posé sur la Carrière. Il a oublié son travail : il faudra le réparer.'
    ]);
    expect(recapOf({ counts: { luciole: 1, barre: 0, camarade: 0, touche: 0, arrive: 0 }, panne: null }, name).at(-1)).toBe('Rien n’a été embrumé. Le camp a tenu.');
    // (le coq chante, une fois par nuit)
    expect(recapOf({ counts: { luciole: 0, barre: 0, coq: 1, camarade: 0, touche: 0, arrive: 0 }, panne: null }, name)).toEqual([
      'Cette nuit, un égaré est sorti de la brume.',
      'Coquelicot a chanté : un égaré a filé dans la brume.',
      'Rien n’a été embrumé. Le camp a tenu.'
    ]);
    expect(recapOf({ counts: { luciole: 0, barre: 0, camarade: 0, touche: 0, arrive: 0 }, panne: null }, name)).toEqual([]);
    // Qui était là : une ligne par espèce, après le total (lot 03, § 7.2) ; un Sans-Nom seulement s'il s'est changé en
    // luciole, une Racine seulement passée sous une clôture
    const all = { counts: { luciole: 2, barre: 0, camarade: 0, touche: 0, arrive: 4, revenu: 1 }, kinds: { fantome: 1, noye: 1, racine: 1, esprit: 1, bete: 1 }, lit: { fantome: 1, bete: 1 }, under: 1, panne: null };
    expect(recapOf(all, name).slice(0, 6)).toEqual([
      'Cette nuit, 6 égarés sont sortis de la brume.',
      'Avant de s’éteindre, l’un a murmuré quelque chose. La moitié d’un nom, je crois.',
      'L’un est sorti de la mer, pas de la brume. J’ai entendu une cloche, très loin.',
      'L’une est passée sous tes clôtures, comme une racine sous un mur.',
      'L’un est revenu, après que tu l’as renvoyé. Il voulait quelque chose, je crois. Seule la lumière l’a apaisé.',
      'Une bête est sortie de la brume, cette nuit. Une bête que plus personne n’a écrite.'
    ]);
    expect(recapOf({ ...all, counts: { ...all.counts, revenu: 0 }, kinds: { fantome: 1 }, lit: {}, under: 0 }, name)[1]).toBe('2 se sont changés en lucioles, près de tes lumières.');
    // Le Dormeur endormi contre la clôture a sa ligne, à part de ceux qu'elle a barrés ; l'Esprit revenu, une sortie de plus
    expect(recapOf({ counts: { luciole: 1, barre: 1, dort: 2, coq: 0, camarade: 0, touche: 0, arrive: 0, revenu: 1 }, panne: null }, name).slice(0, 5)).toEqual([
      'Cette nuit, 4 égarés sont sortis de la brume.',
      'L’un est revenu, après que tu l’as renvoyé. Il voulait quelque chose, je crois. Seule la lumière l’a apaisé.',
      'L’un s’est changé en luciole, près de tes lumières.',
      'L’un s’est arrêté au bord de tes clôtures, puis il est rentré dans la brume.',
      '2 Dormeurs se sont endormis contre tes clôtures. Ils sont repartis à l’aube.'
    ]);
    expect(recapOf({ counts: { luciole: 0, barre: 0, dort: 1, coq: 0, camarade: 2, touche: 0, arrive: 0 }, panne: null }, name)).toEqual([
      'Cette nuit, 3 égarés sont sortis de la brume.',
      'Le Dormeur s’est endormi contre tes clôtures. Il est reparti à l’aube, sans se réveiller tout à fait.',
      'Tes camarades en ont renvoyé 2.',
      'Rien n’a été embrumé. Le camp a tenu.'
    ]);
  });
});

describe('l’égaré que Brume montre au tutoriel', () => {
  it('marche à son allure (cellMs), bute sur la clôture, boude, puis s’en retourne', () => {
    const c = { id: 'tuto-egare', path: PATH, at: AT, step: 2, end: 'barre', cellMs: 500 };
    expect(strayAt(c, AT + 750)).toMatchObject({ pose: 'marche', x: 11.5 });
    expect(strayAt(c, AT + 1000 + 300)).toMatchObject({ pose: 'bouderie', x: 12, y: 11 });
    expect(strayAt(c, AT + 1000 + 10000)).toBe(null);
  });
  it('leur trait, de la brume (au nord, ou de côté) au feu de camp, passe par l’anneau de l’enclos', () => {
    // (le feu : son emprise en (99, 93), serveur : world/places.js ; l'enclos, à deux cases de sa grande emprise, 3 × 3
    // en (98, 92) : game/prologue.js, enclosOf ; ses sentiers en (96, 92) et (96, 95), où vont les portes)
    const ring = [[96, 90], [97, 90], [98, 90], [99, 90], [100, 90], [101, 90], [102, 90], [102, 91], [102, 92], [102, 93], [102, 94], [102, 95],
      [102, 96], [101, 96], [100, 96], [99, 96], [98, 96], [96, 94], [96, 93], [96, 91]];
    expect(EGARES.some(e => e.side === 'x')).toBe(true);
    // (le Sans-Nom, le Dormeur, l'Esprit)
    expect(new Set(EGARES.map(e => e.kind))).toEqual(new Set(['fantome', 'zombie', 'esprit']));
    for (const from of EGARES) {
      const to = from.side === 'x' ? { x: 99, y: from.y } : { x: from.x, y: 93 };
      const path = lineOf(from, to);
      expect([path[0], path[path.length - 1]]).toEqual([{ x: from.x, y: from.y }, to]);
      expect(path.every((c, i) => !i || Math.max(Math.abs(c.x - path[i - 1].x), Math.abs(c.y - path[i - 1].y)) === 1)).toBe(true);
      expect(path.some(c => ring.some(([x, y]) => x === c.x && y === c.y)), JSON.stringify(from)).toBe(true);
    }
  });
});
