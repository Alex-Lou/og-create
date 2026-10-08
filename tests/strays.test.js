// Les nuits sur l'île (HISTOIRE.md § 6.15) : où est un égaré et ce qu'il fait (le serveur décide de son chemin et de
// son sort), ses dessins de la bibliothèque, le bâtiment embrumé, le bilan de Brume au matin
import { describe, it, expect } from 'vitest';
import { strayAt, nightNow, recapOf, MS_PER_CELL } from '@/world/strays';
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
  it('la nuit est là entre son début et sa fin, une fois les nuits présentées', () => {
    const nights = { started: true, night: { start: AT - 1000, end: AT + 1000 } };
    expect([nightNow(nights, AT), nightNow(nights, AT + 1000), nightNow({ started: false }, AT), nightNow(null, AT)]).toEqual([true, false, false, false]);
  });
});

describe('les dessins des nuits', () => {
  it('chaque égaré a ses poses : fantôme, zombie, ou la bête de brume de son climat (le lapin au cœur)', () => {
    const kinds = ['a', 'b', 'c', 'd', 'e', 'f'].map(id => strayKind(id, 'dunes'));
    expect(kinds.every(k => ['fantome', 'zombie', 'fennec-de-brume'].includes(k))).toBe(true);
    expect(new Set(['0', '1', '2', '3', '4', '5', '6', '7', '8'].map(id => strayKind(id, null)))).toContain('lapin-de-brume');
    expect(strayKind('x', 'dunes')).toBe(strayKind('x', 'dunes'));
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
      '2 sont devenus des lucioles près de tes lumières.',
      '1 a boudé devant une clôture.',
      'Tu en as repoussé 1 toi-même.',
      'Un bâtiment est embrumé (Carrière) : répare-le depuis sa fiche.'
    ]);
    expect(recapOf({ counts: { luciole: 1, barre: 0, camarade: 0, touche: 0, arrive: 0 }, panne: null }, name).at(-1)).toBe('Rien n’a été embrumé : le camp a tenu.');
    expect(recapOf({ counts: { luciole: 0, barre: 0, camarade: 0, touche: 0, arrive: 0 }, panne: null }, name)).toEqual([]);
  });
});
