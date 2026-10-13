import { describe, it, expect } from 'vitest';
import { chaseOf, stepChase, throwGrain, tapHen, caughtAt, chaseDone, CAGE, CATCH, NATURES } from '@/game/henChase';

const HENS = ['poule-rousse', 'poule-blanche', 'poule-noire'];
// Un hasard rejouable
const seeded = (s = 7) => () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
const run = (chase, s, dt = 1 / 30) => { for (let t = 0; t < s; t += dt) stepChase(chase, dt); };

describe('la chasse aux poules', () => {
  it('trois poules qui trottent sans s’arrêter, dans l’enclos', () => {
    const chase = chaseOf(HENS, seeded());
    run(chase, 10);
    for (const hen of chase.hens) {
      expect(hen.state).toBe('trot');
      expect(hen.x >= 8 && hen.x <= 92 && hen.y >= 30 && hen.y <= 92).toBe(true);
    }
  });
  it('touchée en pleine course, elle s’esquive loin du doigt ; elle n’est pas prise', () => {
    const chase = chaseOf(HENS, seeded());
    const hen = chase.hens[0];
    const before = { x: hen.x, y: hen.y };
    expect(tapHen(chase, hen.id, { x: before.x - 5, y: before.y })).toBe('dodge');
    run(chase, 0.4);
    expect(hen.state).toBe('flee');
    expect(hen.x).toBeGreaterThan(before.x);
    expect(chase.caught).toEqual([]);
  });
  it('le grain l’attire ; elle picore : touchée à ce moment, elle est prise, puis rentre dans la cage', () => {
    const chase = chaseOf(['poule-blanche'], seeded());
    const hen = chase.hens[0];
    expect(throwGrain(chase, { x: hen.x + 10, y: hen.y })).toBe(true);
    run(chase, 1);
    expect(hen.state).toBe('peck');
    expect(tapHen(chase, hen.id)).toBe('caught');
    expect(chase.caught).toEqual(['poule-blanche']);
    run(chase, CATCH.joy + CATCH.hop / 2);
    const mid = caughtAt(hen);
    expect(mid.k).toBeGreaterThan(0);
    run(chase, CATCH.hop);
    expect(hen.state).toBe('home');
    const home = caughtAt(hen);
    expect([home.x, home.k]).toEqual([CAGE.x, 1]);
    expect(home.y).toBeCloseTo(CAGE.y);
    expect(chaseDone(chase)).toBe(true);
    expect(tapHen(chase, hen.id)).toBe(null);
  });
  it('chacune son caractère : Paprika picore vite, Brioche voit le grain de loin, Madame hésite avant d’y aller', () => {
    expect(NATURES['poule-rousse'].peck).toBeLessThan(NATURES['poule-blanche'].peck);
    const chase = chaseOf(['poule-noire', 'poule-blanche'], seeded());
    const [madame, brioche] = chase.hens;
    Object.assign(madame, { x: 20, y: 60 });
    Object.assign(brioche, { x: 85, y: 85 });
    throwGrain(chase, { x: 30, y: 60 });
    expect(madame.state).toBe('doubt');
    expect(brioche.grain).not.toBe(null);
    run(chase, 0.3);
    expect(madame.state).toBe('doubt');
    run(chase, 0.5);
    expect(madame.state).not.toBe('doubt');
  });
  it('le grain hors de l’enclos ou en trop ne part pas ; il s’épuise en trois picorées', () => {
    const chase = chaseOf(HENS, seeded());
    expect(throwGrain(chase, { x: 80, y: 10 })).toBe(false);
    expect([1, 2, 3, 4].map(i => throwGrain(chase, { x: 20 * i, y: 50 }))).toEqual([true, true, true, false]);
  });
  it('après trois esquives, elle picore plus longtemps (personne ne reste coincé)', () => {
    const chase = chaseOf(['poule-rousse'], seeded());
    const hen = chase.hens[0];
    for (let i = 0; i < 3; i++) tapHen(chase, hen.id);
    run(chase, 1);
    throwGrain(chase, { x: hen.x + 5, y: hen.y });
    run(chase, 0.5);
    expect(hen.state).toBe('peck');
    // (au-delà de son picorage ordinaire, elle picore encore)
    while (hen.state === 'peck' && hen.t < NATURES['poule-rousse'].peck + 0.1) stepChase(chase, 1 / 30);
    expect(hen.state).toBe('peck');
  });
});
