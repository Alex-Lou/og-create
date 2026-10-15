// Les ciels rares (lumiere/aurore.js) : l'aurore sur les plus hauts sommets, le halo de lune sur la mer.
import { describe, expect, it } from 'vitest';
import { auroreCetteNuit, auroreOf, creteDe, colonnesOf, lumieresAurore, haloOf } from '@/world/lumiere/aurore';
import { moonOf } from '@/world/lumiere/ombres';

const nuitClaire = { night: 1, weather: { cover: 0, rain: 0 } };
const soir = jour => new Date(2026, 0, 1 + jour, 23, 0);
// La première nuit d'aurore après une date
const prochaine = (de = 0) => { let j = de; while (!auroreCetteNuit(soir(j))) j++; return j; };

describe('l’aurore', () => {
  it('une nuit sur dix environ, un peu plus souvent l’hiver', () => {
    const part = (de, n) => { let k = 0; for (let j = de; j < de + n; j++) if (auroreCetteNuit(soir(j))) k++; return k / n; };
    expect(part(0, 3650)).toBeGreaterThan(0.07);
    expect(part(0, 3650)).toBeLessThan(0.13);
    let hiver = 0, ete = 0;
    for (let an = 0; an < 20; an++) { hiver += part(an * 365 - 40, 80); ete += part(an * 365 + 140, 80); }
    expect(hiver).toBeGreaterThan(ete);
  });

  it('le soir et le petit matin qui suit sont la même nuit', () => {
    for (let j = 0; j < 200; j++) {
      const matin = new Date(2026, 0, 2 + j, 3, 0);
      expect(auroreCetteNuit(matin)).toBe(auroreCetteNuit(soir(j)));
    }
  });

  it('seulement une nuit d’aurore franche et claire ; elle ne s’éteint pas en ondulant', () => {
    const j = prochaine();
    expect(auroreOf(nuitClaire, soir(j))).toBeGreaterThan(0.5);
    expect(auroreOf({ night: 0, weather: { cover: 0, rain: 0 } }, soir(j))).toBe(0);
    expect(auroreOf({ night: 1, weather: { cover: 1, rain: 0 } }, soir(j))).toBe(0);
    expect(auroreOf({ night: 1, weather: { cover: 0.2, rain: 1 } }, soir(j))).toBe(0);
    let j2 = 0;
    while (auroreCetteNuit(soir(j2))) j2++;
    expect(auroreOf(nuitClaire, soir(j2))).toBe(0);
    for (let m = 0; m < 120; m++) expect(auroreOf(nuitClaire, new Date(soir(j).getTime() + m * 6e4))).toBeGreaterThan(0.5);
  });

  const sommets = [];
  for (let i = 0; i < 40; i++) if (i < 12 || i > 18) sommets.push({ x: 1000 + i * 30, y: 800 + i * 10 });
  const crete = creteDe(sommets);
  const vue = { x: 900, y: 300, w: 800, h: 900 };

  it('la crête suit les sommets, ses trous comblés entre voisines ; rien sans sommets', () => {
    expect(creteDe(sommets.slice(0, 2))).toBe(null);
    expect(crete.x0).toBe(1000);
    expect(crete.ys.every(y => Number.isFinite(y))).toBe(true);
    expect(crete.ys[crete.ys.length - 1]).toBeGreaterThan(crete.ys[0]);
  });

  it('ses rideaux sont posés dans le monde : ils ne suivent pas la caméra, et pendent au-dessus des sommets', () => {
    const a = colonnesOf(crete, vue, 12.5, 1);
    const b = colonnesOf(crete, { ...vue, x: vue.x + 160 }, 12.5, 1);
    expect(a.length).toBeGreaterThan(20);
    const cle = c => `${c.r}:${c.x}`;
    const vus = new Map(b.map(c => [cle(c), c]));
    const communs = a.filter(c => vus.has(cle(c)));
    expect(communs.length).toBeGreaterThan(10);
    expect(communs.every(c => vus.get(cle(c)).y === c.y && vus.get(cle(c)).h === c.h)).toBe(true);
    expect(a.every(c => c.y < 800 + 40 * 10 && c.h > 100 && c.a > 0 && c.a <= 1)).toBe(true);
    expect(colonnesOf(crete, vue, 12.5, 0)).toEqual([]);
    expect(colonnesOf(crete, { x: 5000, y: 300, w: 400, h: 400 }, 12.5, 1)).toEqual([]);
  });

  it('sa lumière n’a pas de flaque au sol et suit sa force', () => {
    const l = lumieresAurore(crete, 0.8);
    expect(l.length).toBe(4);
    expect(l.every(s => s.pool === false && s.k > 0)).toBe(true);
    expect(lumieresAurore(crete, 0)).toEqual([]);
  });
});

describe('le halo de lune', () => {
  // Une nuit de pleine lune, et une de nouvelle lune
  let pleine = soir(0), nouvelle = soir(0);
  for (let j = 0; j < 40; j++) {
    if (moonOf(soir(j)).light > moonOf(pleine).light) pleine = soir(j);
    if (moonOf(soir(j)).light < moonOf(nouvelle).light) nouvelle = soir(j);
  }
  const voilee = { night: 1, weather: { cover: 0.72, rain: 0 } };

  it('les nuits voilées, la lune assez pleine ; pas par ciel clair, ni couvert, ni sous la pluie', () => {
    expect(haloOf(voilee, pleine)).toBeGreaterThan(0.8);
    expect(haloOf(voilee, nouvelle)).toBe(0);
    expect(haloOf({ night: 1, weather: { cover: 0, rain: 0 } }, pleine)).toBe(0);
    expect(haloOf({ night: 1, weather: { cover: 1, rain: 0 } }, pleine)).toBe(0);
    expect(haloOf({ night: 1, weather: { cover: 0.72, rain: 1 } }, pleine)).toBe(0);
    expect(haloOf({ night: 0, weather: { cover: 0.72, rain: 0 } }, pleine)).toBe(0);
  });
});
