// Les saisons dans l'air (lumiere/saisons.js) : l'automne, son tapis de feuilles, ses tourbillons, ses brumes du matin.
import { describe, expect, it, afterEach } from 'vitest';
import { tapisDe, tourbillonsOf, brumeAutomne, tourbillonForce } from '@/world/lumiere/saisons';
import { setQualiteFx } from '@/world/perf';

const vue = { x: 0, y: 0, w: 1200, h: 1600 };
const partout = () => true;
// Des tourbillons au fil d'une minute (ils naissent aux rafales)
const surUneMinute = (v, surTerre = partout) => {
  const vus = [];
  for (let t = 0; t < 60; t += 0.5) vus.push(...tourbillonsOf(v, t, 1, surTerre).map(f => ({ ...f, t })));
  return vus;
};

describe('l’automne', () => {
  afterEach(() => setQualiteFx(1));

  it('chaque feuillu a son tapis, parmi trois, le même à chaque fois', () => {
    const vus = new Set();
    for (let x = 0; x < 40; x++) vus.add(tapisDe(x, 7));
    expect([...vus].sort()).toEqual([0, 1, 2]);
    expect(tapisDe(12, 7)).toBe(tapisDe(12, 7));
  });

  it('les tourbillons naissent aux rafales, sur la terre seulement, et ne suivent pas la caméra', () => {
    const vus = surUneMinute(vue);
    expect(vus.length).toBeGreaterThan(0);
    expect(vus.every(f => f.a > 0 && f.a <= 1)).toBe(true);
    expect(surUneMinute(vue, () => false)).toEqual([]);
    expect(tourbillonsOf(vue, 12, 0, partout)).toEqual([]);
    // (les carreaux communs à deux vues voisines portent les mêmes feuilles)
    const t = vus[0].t;
    const a = tourbillonsOf(vue, t, 1, partout), b = tourbillonsOf({ ...vue, x: 40 }, t, 1, partout);
    const cle = f => `${f.x.toFixed(2)},${f.y.toFixed(2)}`;
    const dansB = new Set(b.map(cle));
    expect(a.some(f => dansB.has(cle(f)))).toBe(true);
  });

  it('moins de feuilles quand l’appareil peine', () => {
    const vus = surUneMinute(vue);
    const t = vus[0].t;
    const plein = tourbillonsOf(vue, t, 1, partout).length;
    setQualiteFx(0.35);
    expect(tourbillonsOf(vue, t, 1, partout).length).toBeLessThan(plein);
  });

  it('ni sous la pluie, ni vus de loin ; plus faibles la nuit', () => {
    const jour = { night: 0, weather: { rain: 0 } };
    expect(tourbillonForce(jour, 1)).toBe(1);
    expect(tourbillonForce({ night: 0, weather: { rain: 0.5 } }, 1)).toBe(0);
    expect(tourbillonForce(jour, 0.3)).toBe(0);
    expect(tourbillonForce({ night: 1, weather: { rain: 0 } }, 1)).toBeLessThan(0.5);
  });

  it('la brume monte certains matins d’automne autour du lever, et se lève dans la matinée', () => {
    const ciel = (hour, weather = {}) => ({ hour, rise: 7.5, night: 0, weather: { rain: 0, cover: 0, ...weather } });
    const matins = [];
    for (let j = 0; j < 30; j++) matins.push(brumeAutomne(ciel(7.6), new Date(2026, 9, 1 + j), 'automne'));
    const brumeux = matins.filter(k => k > 0.4).length;
    expect(brumeux).toBeGreaterThan(8);
    expect(brumeux).toBeLessThan(28);
    const jour = new Date(2026, 9, 1 + matins.findIndex(k => k > 0.4));
    expect(brumeAutomne(ciel(13), jour, 'automne')).toBe(0);
    expect(brumeAutomne(ciel(7.6), jour, 'ete')).toBe(0);
    expect(brumeAutomne(ciel(7.6, { rain: 1 }), jour, 'automne')).toBe(0);
  });
});
