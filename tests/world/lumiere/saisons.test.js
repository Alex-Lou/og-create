// Les saisons dans l'air (lumiere/saisons.js) : l'automne, son tapis de feuilles, ses tourbillons, ses brumes du matin.
import { describe, expect, it, afterEach } from 'vitest';
import { tapisDe, tourbillonsOf, brumeAutomne, tourbillonForce, givreOf, roseeOf, aTapis, aTourbillons } from '@/world/lumiere/saisons';
import { setQualiteFx } from '@/world/perf';
import { chaleurOf } from '@/world/lumiere/saisons';
import { pluieOf } from '@/world/lumiere/filantes';
import { motesOf } from '@/world/lumiere/ambiance';

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

describe('l’hiver', () => {
  const ciel = (hour, night, weather = {}) => ({ hour, rise: 6.6, night, weather: { rain: 0, cover: 0, ...weather } });

  it('le givre prend la nuit, culmine à l’aube et fond dans la matinée ; seulement l’hiver', () => {
    const aube = givreOf(ciel(6.7, 0.2), 'hiver');
    expect(aube).toBeGreaterThan(0.9);
    expect(givreOf(ciel(2, 1), 'hiver')).toBeGreaterThan(0.9);
    expect(givreOf(ciel(8.5, 0), 'hiver')).toBeLessThan(aube);
    expect(givreOf(ciel(14, 0), 'hiver')).toBe(0);
    expect(givreOf(ciel(6.7, 0.2), 'automne')).toBe(0);
  });

  it('ni sous la pluie ; moins sous un ciel couvert', () => {
    expect(givreOf(ciel(6.7, 0.2, { rain: 1 }), 'hiver')).toBe(0);
    expect(givreOf(ciel(6.7, 0.2, { cover: 1 }), 'hiver')).toBeLessThan(0.5);
  });
});

describe('le printemps', () => {
  const ciel = (hour, weather = {}) => ({ hour, rise: 6.6, night: 0, weather: { rain: 0, cover: 0, ...weather } });

  it('un tapis et des tourbillons à l’automne et au printemps seulement', () => {
    expect(['printemps', 'ete', 'automne', 'hiver'].filter(aTapis)).toEqual(['printemps', 'automne']);
    expect(['printemps', 'ete', 'automne', 'hiver'].filter(aTourbillons)).toEqual(['printemps', 'automne']);
  });

  it('la rosée perle à l’aube et sèche dans la matinée ; ni sous la pluie ; seulement au printemps', () => {
    expect(roseeOf(ciel(7.1), 'printemps')).toBeGreaterThan(0.8);
    expect(roseeOf(ciel(5), 'printemps')).toBe(0);
    expect(roseeOf(ciel(11), 'printemps')).toBe(0);
    expect(roseeOf(ciel(7.1, { rain: 1 }), 'printemps')).toBe(0);
    expect(roseeOf(ciel(7.1), 'ete')).toBe(0);
  });
});

describe('l’été', () => {
  const ciel = (up, weather = {}, night = 0) => ({ sun: { up }, night, weather: { rain: 0, cover: 0, ...weather } });

  it('l’air tremble aux heures chaudes d’un jour clair d’été ; pas le matin, ni sous la pluie, ni une autre saison', () => {
    expect(chaleurOf(ciel(1), 'ete')).toBe(1);
    expect(chaleurOf(ciel(0.4), 'ete')).toBe(0);
    expect(chaleurOf(ciel(1, { rain: 1 }), 'ete')).toBe(0);
    expect(chaleurOf(ciel(1, { cover: 0.7 }), 'ete')).toBeLessThan(0.2);
    expect(chaleurOf(ciel(1), 'automne')).toBe(0);
  });

  it('ses nuits ont plus de pluies d’étoiles, ses soirs plus d’éclats dorés', () => {
    const nuits = s => Array.from({ length: 600 }, (_, i) => pluieOf(new Date(2026, 0, 1 + i), s)).filter(Boolean).length;
    expect(nuits('ete')).toBeGreaterThan(nuits('automne') * 1.8);
    const soir = ciel(0.05);
    expect(motesOf(soir, 'ete')).toBeGreaterThan(motesOf(soir, 'automne'));
    expect(motesOf(ciel(1), 'ete')).toBe(motesOf(ciel(1), 'automne'));
  });
});
