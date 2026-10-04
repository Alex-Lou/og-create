import { describe, expect, it } from 'vitest';
import { islandOf, liveOf, underAt, CRUST, SEA_Z, SHALLOW } from '../src/world/terrain';
import { isletsOf, ferryPose, FERRY_CYCLE, FERRY_WAIT } from '../src/world/islets';

// Carte de 14 × 14 : une île flottante en haut (quartier 2), l'îlot de la colonie (quartier 1) relié par un pont à
// la terre (quartier 0)
const map = {
  height: [
    '              ',
    ' 2222         ',
    ' 2332         ',
    ' 2222         ',
    '              ',
    '              ',
    '              ',
    '        111   ',
    '        111   ',
    ' 11111  111   ',
    ' 11111        ',
    ' 11111        ',
    ' 11111        ',
    '              '
  ],
  ground: [
    '~~~~~~~~~~~~~~',
    '~gggg~~~~~~~~~',
    '~grrg~~~~~~~~~',
    '~gggg~~~~~~~~~',
    '~~~~~~~~~~~~~~',
    '~~~~~~~~~~~~~~',
    '~~~~~~~~~~~~~~',
    '~~~~~~~~ggg~~~',
    '~~~~~~~~ggg~~~',
    '~gggggbbggg~~~',
    '~ggggg~~~~~~~~',
    '~ggggg~~~~~~~~',
    '~ggggg~~~~~~~~',
    '~~~~~~~~~~~~~~'
  ],
  grid: [
    '..............',
    '.2222.........',
    '.2222.........',
    '.2222.........',
    '..............',
    '..............',
    '..............',
    '........111...',
    '........111...',
    '.00000..111...',
    '.00000........',
    '.00000........',
    '.00000........',
    '..............'
  ]
};
const IDS = ['coeur', 'phare', 'legendes'];
const M = islandOf(map, 14, 2);
const zoneOf = (x, y) => IDS[M.zone(x, y)];
const islets = isletsOf(M, zoneOf);

describe('l’île flottante', () => {
  it('ses cases, son centre ; la mer passe dessous (ni eaux peu profondes ni écume autour)', () => {
    expect(M.float.cells).toHaveLength(12);
    expect([M.float.cx, M.float.cy]).toEqual([2.5, 2]);
    expect(M.floats(2, 2)).toBe(true);
    expect(M.floats(9, 8)).toBe(false);
    expect(M.depth(2, 5)).toBeGreaterThan(SHALLOW);
    expect(islandOf(map, 14).depth(2, 5)).toBe(2);
    const { shore, back } = liveOf(M);
    expect([...shore, ...back].some(c => M.floats(c.x, c.y))).toBe(false);
    expect(shore.length).toBeGreaterThan(0);
  });
  it('son dessous est plus profond vers le centre et ne touche jamais la mer', () => {
    expect(underAt(M.float, M.float.cx, M.float.cy)).toBeGreaterThan(underAt(M.float, 0.5, 0.5));
    // Pointes comprises (au plus 0,55 × 1,6 palier sous le bord), sur chaque face côté mer
    for (const c of M.float.cells) {
      for (const [dx, dy, corners] of [[0, 1, [[c.x - 0.5, c.y + 0.5], [c.x + 0.5, c.y + 0.5]]], [1, 0, [[c.x + 0.5, c.y + 0.5], [c.x + 0.5, c.y - 0.5]]]]) {
        if (M.land(c.x + dx, c.y + dy)) continue;
        corners.forEach(([x, y]) => expect(CRUST + underAt(M.float, x, y) + 0.88).toBeLessThan(M.surface(c.x, c.y) - SEA_Z));
      }
    }
  });
});

describe('les îlots', () => {
  it('la colonie, les deux lanternes aux bouts du pont, la source au bord avant de l’île flottante', () => {
    expect(islets.colony).toHaveLength(9);
    expect(islets.lamps).toHaveLength(2);
    const { spring } = islets;
    expect(M.floats(spring.x, spring.y)).toBe(true);
    expect(M.land(spring.x + spring.side, spring.y + 1 - spring.side)).toBe(false);
  });
  it('le ponton dans la mer devant l’îlot, le quai en l’air devant l’île flottante', () => {
    const { dock, quay } = islets.route;
    expect(M.land(Math.round(dock.x), Math.round(dock.y))).toBe(false);
    expect(islets.colony.some(c => Math.hypot(dock.x - c.x, dock.y - c.y) < 1.1 && dock.x + dock.y > c.x + c.y)).toBe(true);
    expect(M.land(Math.round(quay.x), Math.round(quay.y))).toBe(false);
    expect(M.float.cells.some(c => Math.hypot(quay.x - c.x, quay.y - c.y) < 1 && quay.x + quay.y > c.x + c.y)).toBe(true);
    expect(quay.z).toBeGreaterThan(dock.z + 1);
  });
});

describe('la barque du passeur', () => {
  const { route } = islets;
  const at = (pose, p) => Math.hypot(pose.x - p.x, pose.y - p.y) < 1e-9;
  it('à l’arrêt (île flottante pas à soi) : au ponton, bercée', () => {
    expect(at(ferryPose(route, 17.3, false), route.dock)).toBe(true);
  });
  it('attend au ponton, monte, attend au quai, redescend, sans à-coups', () => {
    expect(at(ferryPose(route, FERRY_WAIT / 2, true), route.dock)).toBe(true);
    const half = FERRY_CYCLE / 2;
    expect(at(ferryPose(route, half + FERRY_WAIT / 2, true), route.quay)).toBe(true);
    const mid = ferryPose(route, FERRY_WAIT + (half - FERRY_WAIT) / 2, true);
    expect(mid.moving).toBe(true);
    // En arc : au-dessus de la ligne droite entre le ponton et le quai
    expect(mid.z).toBeGreaterThan((route.dock.z + route.quay.z) / 2 + 1);
    let last = ferryPose(route, 0, true);
    for (let t = 0.05; t <= FERRY_CYCLE * 2; t += 0.05) {
      const pose = ferryPose(route, t, true);
      expect(Math.hypot(pose.x - last.x, pose.y - last.y)).toBeLessThan(0.12);
      expect(Math.abs(pose.z - last.z)).toBeLessThan(0.12);
      last = pose;
    }
  });
  it('tournée vers l’île à l’aller, vers le ponton au retour', () => {
    const out = ferryPose(route, FERRY_WAIT + 2, true);
    const back = ferryPose(route, FERRY_CYCLE / 2 + FERRY_WAIT + 2, true);
    expect(out.flip).toBe(!back.flip);
  });
});
