// La côte, faite une fois par île (sea.js : edgesOf, centresOf) : mêmes bords et mêmes centres qu'avant, sans les
// refaire à chaque image.
import { describe, expect, it } from 'vitest';
import { shoreEdges, centresOf } from '@/world/sea';
import { worldOf, SEA_Z, TW, TH } from '@/world/terrain';

const segs = [{ x: 10, y: 12, side: 0 }, { x: 11, y: 12, side: 1 }, { x: 40, y: 3, side: 0 }];
const tout = { x: -1e5, y: -1e5, w: 2e5, h: 2e5 };

describe('la côte, faite une fois', () => {
  it('les bords devant sont ceux de chaque case, au niveau de la mer, et suivent la vague', () => {
    const [a, b] = shoreEdges(segs, tout, 3);
    const c = worldOf(10, 12, SEA_Z), d = worldOf(11, 12, SEA_Z);
    expect([a.x0, a.y0, a.x1, a.y1]).toEqual([c.x - TW / 2, c.y, c.x, c.y + TH / 2]);
    expect([b.x0, b.y0, b.x1, b.y1]).toEqual([d.x, d.y + TH / 2, d.x + TW / 2, d.y]);
    expect(a.w).toBeGreaterThanOrEqual(0);
    expect(a.w).toBeLessThan(1);
    expect(shoreEdges(segs, tout, 3.5)[0].w).not.toBe(a.w);
  });

  it('seuls les bords à l’écran sont rendus', () => {
    const c = worldOf(40, 3, SEA_Z);
    const vue = { x: c.x - 10, y: c.y - 10, w: 20, h: 20 };
    expect(shoreEdges(segs, vue, 0).map(e => e.seg)).toEqual([segs[2]]);
  });

  it('les centres des eaux peu profondes se font une fois par liste', () => {
    const cells = [{ x: 5, y: 7 }, { x: 6, y: 7 }];
    const une = centresOf(cells);
    expect(centresOf(cells)).toBe(une);
    expect(une[1]).toEqual(worldOf(6, 7, SEA_Z));
  });
});
