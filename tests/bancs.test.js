import { describe, expect, it } from 'vitest';
import { bancsOf, bouleAt, centreOf, plongeons, FUITE, BOULE_FOR } from '../src/world/faune';

const SCHOOLS = [{ x: 4, y: 9 }, { x: 12, y: 2 }];
const duBanc = (fish, k) => fish.filter(f => f.banc === k);
const loin = (fish, c) => Math.max(...fish.map(f => Math.hypot(f.x - c.x, f.y - c.y)));

describe('les bancs de poissons', () => {
  it('vingt à trente-six poissons par banc, toujours les mêmes à un instant donné, l’éclat entre 0 et 1', () => {
    const a = bancsOf(SCHOOLS, 42.5);
    expect(a).toEqual(bancsOf(SCHOOLS, 42.5));
    for (const k of [0, 1]) {
      const n = duBanc(a, k).length;
      expect(n).toBeGreaterThanOrEqual(22);
      expect(n).toBeLessThanOrEqual(36);
    }
    for (let t = 0; t < 120; t += 1.3) for (const f of bancsOf(SCHOOLS, t)) {
      expect(f.eclat).toBeGreaterThanOrEqual(0);
      expect(f.eclat).toBeLessThanOrEqual(1);
      expect(Math.hypot(f.x - SCHOOLS[f.banc].x, f.y - SCHOOLS[f.banc].y)).toBeLessThanOrEqual(2.1 + 1e-9);
    }
  });
  it('un ruban, pas un tas : les poissons s’étirent le long du chemin du banc', () => {
    const fish = duBanc(bancsOf(SCHOOLS, 30), 0);
    expect(loin(fish, centreOf(SCHOOLS[0], 0, 30))).toBeGreaterThan(0.5);
  });
  it('touché, le banc fuse loin de son cœur, puis se regroupe', () => {
    const at = 50;
    const calme = t => duBanc(bancsOf(SCHOOLS, t), 0);
    const touche = t => duBanc(bancsOf(SCHOOLS, t, k => (k === 0 ? at : null)), 0);
    const ecart = t => touche(t).reduce((sum, f, i) => sum + Math.hypot(f.x - calme(t)[i].x, f.y - calme(t)[i].y), 0) / touche(t).length;
    expect(ecart(at)).toBeLessThan(0.01);
    expect(ecart(at + 0.5)).toBeGreaterThan(0.3);
    expect(ecart(at + FUITE - 0.2)).toBeLessThan(ecart(at + 0.5) / 2);
    expect(ecart(at + FUITE + 0.1)).toBeLessThan(0.01);
    // l'autre banc ne bouge pas
    expect(duBanc(bancsOf(SCHOOLS, at + 0.5, k => (k === 0 ? at : null)), 1)).toEqual(duBanc(bancsOf(SCHOOLS, at + 0.5), 1));
  });
  it('la boule de sardines se forme, tient, puis se défait ; serrée autour de son centre', () => {
    expect(bouleAt(SCHOOLS, 1, 0).m).toBe(0);
    expect(bouleAt(SCHOOLS, 1, BOULE_FOR / 2).m).toBeCloseTo(1, 5);
    expect(bouleAt(SCHOOLS, 1, BOULE_FOR).m).toBe(0);
    const b = bouleAt(SCHOOLS, 1, BOULE_FOR / 2);
    const fish = duBanc(bancsOf(SCHOOLS, 100, () => null, b), 1);
    expect(loin(fish, b)).toBeLessThan(0.65);
    expect(fish.every(f => f.eclat >= 0 && f.eclat <= 1)).toBe(true);
    // touchée, la boule fuse depuis son centre
    const fuse = duBanc(bancsOf(SCHOOLS, 100.5, k => (k === 1 ? 100 : null), b), 1);
    expect(loin(fuse, b)).toBeGreaterThan(loin(fish, b) + 0.3);
  });
  it('les mouettes plongent dans la boule (des ronds là où elles entrent), pas avant qu’elle soit formée', () => {
    expect(plongeons(bouleAt(SCHOOLS, 0, 1), 10)).toEqual({ gulls: [], rings: [] });
    const b = bouleAt(SCHOOLS, 0, BOULE_FOR / 2);
    let plonge = 0, ronds = 0;
    for (let t = 0; t < 10; t += 0.1) {
      const p = plongeons(b, t);
      expect(p.gulls.length).toBeLessThanOrEqual(4);
      for (const g of p.gulls) {
        expect(g.alt).toBeGreaterThanOrEqual(0);
        expect(g.alt).toBeLessThanOrEqual(90);
        if (g.alt < 20) plonge++;
      }
      for (const r of p.rings) {
        expect(r.k).toBeGreaterThanOrEqual(0);
        expect(r.k).toBeLessThan(1);
        expect(Math.hypot(r.x - b.x, r.y - b.y)).toBeLessThan(0.8);
        ronds++;
      }
    }
    expect(plonge).toBeGreaterThan(0);
    expect(ronds).toBeGreaterThan(0);
  });
});
