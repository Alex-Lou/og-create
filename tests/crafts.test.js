import { describe, it, expect } from 'vitest';
import { cellsOf, turn, sizeOf, coverOf, fits, covered, tierHint, TIER_LABEL, moveSpots, missingKnow, knowText, batchRoom, batchChoices, timesBag, BATCH_MAX, straighten } from '@/world/crafts';
import { CRAFT_SPRITES, craftLayers, craftThumb, craftLight } from '@/world/craftSprites';

describe('créations d’île', () => {
  it('lit un gabarit et tourne une pièce comme le serveur', () => {
    expect(cellsOf(['x.x', 'xxx'])).toEqual([[0, 0], [2, 0], [0, 1], [1, 1], [2, 1]]);
    // Mêmes vecteurs que test/crafts.test.js (serveur)
    expect(turn([[0, 0], [1, 0]], 1)).toEqual([[0, 0], [0, 1]]);
    expect(turn([[0, 0], [1, 0], [1, 1]], 4)).toEqual(turn([[0, 0], [1, 0], [1, 1]], 0));
    expect(turn([[0, 0], [1, 0], [1, 1]], 1)).toEqual([[1, 0], [0, 1], [1, 1]]);
    expect(turn([[0, 0], [1, 0], [1, 1]], -1)).toEqual(turn([[0, 0], [1, 0], [1, 1]], 3));
    expect(sizeOf([[0, 0], [1, 0], [1, 1]])).toEqual({ w: 2, h: 2 });
  });

  it('sait si une pièce tient et si le gabarit est rempli', () => {
    const shape = ['xx', 'xx'];
    const pieces = [[[0, 0], [1, 0]], [[0, 0], [1, 0]]];
    const a = { piece: 0, rot: 0, x: 0, y: 0 };
    expect(coverOf(pieces, a)).toEqual(['0,0', '1,0']);
    expect(fits(shape, pieces, [], a)).toBe(true);
    expect(fits(shape, pieces, [], { piece: 0, rot: 0, x: 1, y: 0 })).toBe(false);
    expect(fits(shape, pieces, [a], { piece: 1, rot: 0, x: 0, y: 0 })).toBe(false);
    // La pièce elle-même ne se gêne pas (déplacement sur le gabarit)
    expect(fits(shape, pieces, [a], { piece: 0, rot: 1, x: 0, y: 0 })).toBe(true);
    expect(covered(shape, pieces, [a])).toBe(false);
    expect(covered(shape, pieces, [a, { piece: 1, rot: 0, x: 0, y: 1 }])).toBe(true);
    expect(covered(shape, pieces, [{ piece: 0, rot: 1, x: 0, y: 0 }, { piece: 1, rot: 1, x: 1, y: 0 }])).toBe(true);
  });

  it('dit ce qui ouvre un palier', () => {
    expect(TIER_LABEL.start).toBe('Débuts');
    expect(tierHint('I', { have: 12, need: 10 })).toBe('Finis le chapitre I du Grimoire, ou réussis 10 questions de l’Épreuve (10/10).');
    expect(tierHint('II', { have: 0, need: 10 })).toBe('Finis le chapitre II du Grimoire.');
    // Palier I : 10 découvertes au Grimoire (bible, D7), ou l'Épreuve
    expect(tierHint('I', { have: 2, need: 10 }, { have: 4, need: 10 })).toBe('Inscris 10 découvertes au Grimoire (4/10), ou réussis 10 questions de l’Épreuve (2/10).');
    // Paliers II et III en cascade : ce que dit le serveur
    expect(tierHint('II', { have: 0, need: 10 }, { have: 4, need: 10 }, { II: 'S’ouvre avec le palier I.' })).toBe('S’ouvre avec le palier I.');
  });

  it('le verrou parlant d’une création : le savoir-faire qui manque et ses pages, quand c’est lui qui la retient', () => {
    const catalog = [{ id: 'cloture', made: 1 }, { id: 'muret', made: 0 }];
    const lanterne = { open: true, after: [], elements: [{ name: 'Feu', have: true }, { name: 'Lumière', have: false, pages: 3 }] };
    expect(missingKnow(lanterne, catalog)).toEqual([{ name: 'Lumière', have: false, pages: 3 }]);
    expect(knowText(missingKnow(lanterne, catalog)[0])).toBe('Lumière : à écrire au Grimoire · 3 pages');
    expect(knowText({ name: 'Corde', pages: 1 })).toBe('Corde : à écrire au Grimoire · 1 page');
    // Une création d'avant à faire, un palier fermé, la leçon du tutoriel : le verrou du serveur parle seul
    expect(missingKnow({ ...lanterne, after: ['muret'] }, catalog)).toEqual([]);
    expect(missingKnow({ ...lanterne, open: false }, catalog)).toEqual([]);
    expect(missingKnow({ ...lanterne, tutorial: true }, catalog)).toEqual([]);
  });

  it('chaque création du serveur a son dessin (les 18 premières, la porte d’un enclos et son verrou, les 12 de climat)', async () => {
    const ids = ['cloture', 'porte', 'porte-verrou', 'massif', 'muret', 'lanterne', 'banc', 'epouvantail', 'nichoir', 'girouette', 'fontaine', 'brasero', 'pergola', 'statue',
      'arche', 'etal', 'kiosque', 'cadran', 'bassin', 'longuevue', 'igloo', 'sculpture', 'parc', 'cairn', 'passerelle', 'heron', 'tente', 'cadransel',
      'hamac', 'totem', 'obelisque', 'bassinchaud'];
    expect(Object.keys(CRAFT_SPRITES).sort()).toEqual([...ids].sort());
    for (const id of ids) {
      for (const t of [0, 0.7, 2.3]) {
        for (const layer of craftLayers(id, t)) {
          // Dessiné par code (svg), ou lu dans la bibliothèque (load)
          const sprite = layer.make();
          const svg = sprite.svg ?? await sprite.load();
          expect(svg).toContain('<svg');
          expect(svg).not.toMatch(/NaN|undefined|Infinity/);
        }
      }
      expect(craftThumb(id).svg).toContain('<svg');
    }
    expect(TIER_LABEL.climat).toBe('Climats');
    expect(craftLight('obelisque')[4]).toMatch(/^\d+,\d+,\d+$/);
  });
});

describe('moveSpots', () => {
  const spots = [{ x: 4, y: 4 }, { x: 5, y: 5 }, { x: 6, y: 4 }, { x: 9, y: 9 }];
  it('sans création qui compte sur elle : toutes ses cases, sauf la sienne', () => {
    expect(moveSpots(spots, { x: 4, y: 4 })).toEqual([{ x: 5, y: 5 }, { x: 6, y: 4 }, { x: 9, y: 9 }]);
  });
  it('une Lanterne qui garde un Banc (2 cases) : seulement à portée de lui ; deux Bancs : à portée des deux', () => {
    expect(moveSpots(spots, { x: 4, y: 4 }, [{ x: 3, y: 3, reach: 2 }])).toEqual([{ x: 5, y: 5 }]);
    expect(moveSpots(spots, { x: 4, y: 4 }, [{ x: 3, y: 3, reach: 2 }, { x: 8, y: 8, reach: 2 }])).toEqual([]);
  });
});

describe('plusieurs pièces d’un coup (choix de l’auteur, 15 oct.)', () => {
  it('ce que le stock paie, les quantités proposées, ce qu’elles coûtent', () => {
    const torch = { cost: { wood: 2 }, finds: {} };
    expect(batchRoom(torch, { wood: 7 })).toBe(3);
    expect(batchRoom(torch, { wood: 999 })).toBe(BATCH_MAX);
    expect(batchRoom({ cost: { wood: 4 }, finds: { sel: 2 } }, { wood: 40, sel: 3 })).toBe(1);
    expect(batchChoices(0)).toEqual([1, 3, 5]);
    expect(batchChoices(3)).toEqual([1, 3, 5]);
    expect(batchChoices(7)).toEqual([1, 3, 5, 7]);
    expect(timesBag({ wood: 2, stone: 1 }, 3)).toEqual({ wood: 6, stone: 3 });
  });
});

describe('l’aimant d’un trait', () => {
  it('un doigt qui s’écarte d’une case garde la ligne droite ; de deux, elle tourne depuis là où elle en est', () => {
    const line = { from: { x: 0, y: 0 }, last: { x: 0, y: 0 }, axis: null };
    const go = (x, y, ok) => {
      const c = straighten(line, { x, y }, ok);
      line.last = c;
      return c;
    };
    expect(go(1, 0)).toEqual({ x: 1, y: 0 });
    expect(go(3, 1)).toEqual({ x: 3, y: 0 });
    expect(go(5, -1)).toEqual({ x: 5, y: 0 });
    // (deux cases au-dessus : la ligne tourne au coin où elle en était, et reste droite)
    expect(go(6, 2)).toEqual({ x: 5, y: 2 });
    expect(go(6, 5)).toEqual({ x: 5, y: 5 });
  });
  it('la case droite refusée et celle du doigt permise : la ligne lâche, pour contourner', () => {
    const line = { from: { x: 0, y: 0 }, last: { x: 2, y: 0 }, axis: 'x' };
    const tree = c => !(c.x === 3 && c.y === 0);
    expect(straighten(line, { x: 3, y: 1 }, tree)).toEqual({ x: 3, y: 1 });
    expect(line.axis).toBe(null);
  });
});
