import { describe, expect, it } from 'vitest';
import { islandOf, liveOf, SHALLOW, SEA_FAR, SEA_PAD } from '../src/world/terrain';
import { seaOf, seaGuests, spread, nearestOpen, schoolFish, podAt, whaleAt, jelliesAt, DOLPHIN_FOR, WHALE_FOR } from '../src/world/sea';
import { SEA_SPRITES, FISH_SPECIES } from '../src/world/seaSprites';

// Mer de 16 × 16 avec une île de 4 × 4 (cases 2 à 5) et un rocher isolé en (12, 3)
const N = 16;
const rows = (fn) => Array.from({ length: N }, (_, y) => Array.from({ length: N }, (_, x) => fn(x, y)).join(''));
const isLand = (x, y) => (x >= 2 && x <= 5 && y >= 2 && y <= 5) || (x === 12 && y === 3);
const M = islandOf({
  height: rows((x, y) => (isLand(x, y) ? '1' : ' ')),
  ground: rows((x, y) => (isLand(x, y) ? 'g' : '~')),
  grid: rows((x, y) => (isLand(x, y) ? '0' : '.'))
}, N);
const water = (x, y) => !M.land(x, y);
const frontClear = (x, y) => {
  for (let j = 0; j <= 6; j++) for (let i = 0; i <= 6; i++) if (!water(x + i, y + j)) return false;
  return true;
};

describe('profondeur de la mer', () => {
  it('distance à la terre la plus proche, en cases (diagonales comprises), bornée au large', () => {
    expect(M.depth(3, 3)).toBe(0);
    expect(M.depth(6, 3)).toBe(1);
    expect(M.depth(7, 7)).toBe(2);
    expect(M.depth(9, 4)).toBe(3);
    expect(M.depth(-2, 3)).toBe(4);
    expect(M.depth(400, 400)).toBe(SEA_FAR);
  });
  it('les eaux peu profondes, rangées par distance à la terre, jusqu’à quelques cases hors de la carte', () => {
    const { shallow } = seaOf(M);
    expect(shallow).toHaveLength(SHALLOW);
    shallow.forEach((cells, k) => cells.forEach(c => { expect(M.depth(c.x, c.y)).toBe(k + 1); expect(M.land(c.x, c.y)).toBe(false); }));
    const all = shallow.flat().map(c => `${c.x},${c.y}`);
    expect(all).toContain('-1,3');
    expect(all).toContain(`${2 - SHALLOW},3`);
    expect(all).not.toContain(`${1 - SHALLOW},3`);
    expect(all).not.toContain('10,10');
  });
  it('les bords de mer de derrière (la mer en −x ou en −y) sont repérés, comme ceux de devant', () => {
    const live = liveOf(M);
    expect(live.back).toContainEqual({ x: 2, y: 3, side: 1 });
    expect(live.back).toContainEqual({ x: 3, y: 2, side: 0 });
    expect(live.shore).toContainEqual({ x: 5, y: 3, side: 1 });
    expect(live.back.every(s => M.land(s.x, s.y))).toBe(true);
  });
});

describe('les eaux où vivent les animaux', () => {
  const sea = seaOf(M);
  it('eau libre : assez loin de la terre, et aucune terre devant (rien ne cache un animal qui saute)', () => {
    expect(sea.open.length).toBeGreaterThan(20);
    for (const o of sea.open) {
      expect(o.d).toBeGreaterThanOrEqual(3);
      expect(frontClear(o.x, o.y)).toBe(true);
      // Chaque trajet possible reste en eau libre jusqu'au bout
      for (const [dx, dy] of o.dirs) for (let k = 1; k <= 3; k++) expect(frontClear(o.x + dx * k, o.y + dy * k)).toBe(true);
    }
    expect(sea.open.some(o => o.x < 0 || o.y < 0 || o.x >= N || o.y >= N)).toBe(true);
  });
  it('les bancs se tiennent au bord des eaux peu profondes, bien répartis, et y restent', () => {
    expect(sea.schools.length).toBeGreaterThan(0);
    sea.schools.forEach(s => expect(M.depth(s.x, s.y)).toBe(SHALLOW));
    for (let t = 0; t < 400; t += 3.7) {
      for (const f of schoolFish(sea.schools, t)) expect(water(Math.round(f.x), Math.round(f.y))).toBe(true);
    }
  });
  it('quelques cases bien réparties, toujours les mêmes', () => {
    const cells = Array.from({ length: 30 }, (_, k) => ({ x: k, y: (k * 7) % 11 }));
    const a = spread(cells, 4, 5);
    expect(a).toEqual(spread(cells, 4, 5));
    expect(a.length).toBeLessThanOrEqual(5);
    a.forEach((p, i) => a.slice(i + 1).forEach(q => expect(Math.max(Math.abs(p.x - q.x), Math.abs(p.y - q.y))).toBeGreaterThanOrEqual(4)));
  });
  it('dauphins : trois sauts à la suite sur leur trajet, hauteur bornée, rien après le passage', () => {
    const spot = nearestOpen(sea.open, 8, 8, 3);
    expect(spot).toBeTruthy();
    const dir = spot.dirs[0];
    let seen = 0;
    for (let τ = 0; τ < DOLPHIN_FOR; τ += 0.05) {
      const { dolphins } = podAt(spot, dir, τ);
      seen = Math.max(seen, dolphins.length);
      for (const d of dolphins) {
        expect(d.z).toBeGreaterThanOrEqual(0);
        expect(d.z).toBeLessThanOrEqual(20);
        expect(water(Math.round(d.x), Math.round(d.y))).toBe(true);
      }
    }
    expect(seen).toBeGreaterThan(1);
    expect(podAt(spot, dir, DOLPHIN_FOR + 0.1).dolphins).toHaveLength(0);
  });
  it('baleine : remous, dos qui affleure, deux souffles, queue dressée, puis plus rien', () => {
    const spot = nearestOpen(sea.open, 8, 8, 4) || sea.open[0];
    const at = τ => whaleAt(spot, spot.dirs[0], τ);
    expect(at(0.5).rings).toHaveLength(1);
    expect(at(5).back.e).toBe(1);
    expect(at(3.5).spouts).toHaveLength(1);
    expect(at(7).spouts).toHaveLength(1);
    expect(at(12).fluke.e).toBe(1);
    expect(at(12).back).toBeNull();
    const end = at(WHALE_FOR);
    expect(end.back || end.fluke).toBeFalsy();
  });
  it('méduses : en eau libre, un peu au large', () => {
    const list = jelliesAt(sea.open, 100);
    expect(list.length).toBeGreaterThan(0);
    list.forEach(j => expect(M.depth(Math.round(j.x), Math.round(j.y))).toBeGreaterThanOrEqual(3));
  });
});

describe('la mer grandit avec l’île', () => {
  it('dauphins avec la Crique, baleine avec le Hameau, méduses avec l’Îlot du Phare', () => {
    expect(seaGuests(new Set(['coeur']))).toEqual({ dolphins: false, whale: false, jellies: false });
    expect(seaGuests(new Set(['coeur', 'crique']))).toMatchObject({ dolphins: true, whale: false });
    expect(seaGuests(new Set(['crique', 'hameau', 'phare']))).toEqual({ dolphins: true, whale: true, jellies: true });
  });
  it('chaque animal a son dessin', () => {
    expect(FISH_SPECIES).toEqual(['sardine', 'dorade', 'volant']);
    const all = [...SEA_SPRITES.dolphin, SEA_SPRITES.whaleBack, SEA_SPRITES.whaleFluke, ...SEA_SPRITES.gull, ...FISH_SPECIES.flatMap(id => SEA_SPRITES.fish[id])];
    all.forEach(make => {
      const { svg, box } = make();
      expect(svg.startsWith('<svg')).toBe(true);
      expect(box.w).toBeGreaterThan(0);
    });
    expect(SEA_PAD).toBeGreaterThanOrEqual(SHALLOW);
  });
});
