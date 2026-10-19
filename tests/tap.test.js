import { describe, it, expect, vi, afterEach } from 'vitest';
import gestures from '@/world/view/gestures';
import { guide } from '@/game/guide';

// Un toucher sur l'île : ce qui le prend avant l'île (une bulle, un mode), ce qui réagit tout de suite, ce qui se choisit
// d'abord (le second toucher ouvre), la mer
const DOES = ['roadTap', 'tapAnnexSpot', 'meetCreature', 'tapFerry', 'repelStray', 'collect', 'showTip', 'hideTip', 'drawSoon'];
function island(hit, parts = {}) {
  const done = [];
  return {
    ...gestures,
    done,
    hitAt: (px, py, ok = () => true) => (hit && ok(hit) ? hit : null),
    thickMist: () => false, reduced: () => false, busy: false, picked: null, tip: null, filanteHit: null,
    needBubbles: [], looseHens: new Map(), acts: {}, scared: new Map(), ripples: [], state: { sites: [] },
    toWorld: () => ({ x: 0, y: 0 }), cellAt: () => ({ x: 0, y: 0 }), toScreen: () => ({ x: 0, y: 0 }), canvasPoint: () => ({}),
    tipOf: () => ({}), centerOf: () => ({ x: 0, y: 0 }),
    ...Object.fromEntries(DOES.map(name => [name, () => done.push(name)])),
    ...parts
  };
}
const foyer = { id: 'foyer', level: 1, w: 2, h: 2 };

describe('un toucher sur l’île', () => {
  afterEach(() => vi.restoreAllMocks());

  it('une bulle à lire : rien de l’île ne se touche ; en mode chemin ou en pose, seule compte la case', () => {
    vi.spyOn(guide, 'current', 'get').mockReturnValue({ id: 'bulle' });
    const read = island({ site: foyer });
    read.tap(0, 0);
    expect(read.done).toEqual([]);
    vi.restoreAllMocks();
    for (const [mode, does] of [['roadMode', 'roadTap'], ['annexPlacing', 'tapAnnexSpot']]) {
      const placing = island({ site: foyer }, { [mode]: {} });
      placing.tap(0, 0);
      expect(placing.done).toEqual([does]);
    }
  });

  it('la mer fait des ronds dans l’eau', () => {
    const sea = island(null);
    sea.tap(0, 0);
    expect(sea.ripples).toHaveLength(1);
    expect(sea.done).toEqual(['drawSoon']);
  });

  it('ce qui réagit tout de suite : la barque, un égaré, une bulle de production', () => {
    const ferry = island({ ferry: true });
    ferry.tap(0, 0);
    expect(ferry.done).toEqual(['tapFerry']);
    const stray = island({ animal: { stray: { id: 's1' } } });
    stray.tap(0, 0);
    expect(stray.done).toEqual(['meetCreature', 'repelStray']);
    const bubble = island({ bubble: { x: 0, y: 0 } });
    bubble.tap(0, 0);
    expect(bubble.done).toEqual(['collect', 'drawSoon']);
  });

  it('un bâtiment se choisit au premier toucher, sa fiche s’ouvre au second', () => {
    const ctx = island({ site: foyer });
    ctx.tap(0, 0);
    expect(ctx.picked.key).toBe('site:foyer');
    expect(ctx.site).toBe(undefined);
    ctx.tap(0, 0);
    expect(ctx.picked).toBe(null);
    expect(ctx.site).toBe(foyer);
  });

  it('au tutoriel, une chose hors de l’étape, sans cible de l’étape autour : le toucher ne fait rien', () => {
    const ctx = island({ site: foyer }, { thickMist: () => true });
    ctx.tap(0, 0);
    expect(ctx.done).toEqual([]);
    expect(ctx.picked).toBe(null);
  });
});
