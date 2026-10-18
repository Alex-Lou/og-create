// Les bêtes sauvages vivent (world/village/wildLife.js ; choix de l'auteur, 18 oct.) : chacune dans ses zones, à son
// coin, sous ses conditions (heures, temps, pleine lune) ; elle sort, se promène case à case, rentre ; rien sous la
// brume ni hors de ses conditions
import { describe, it, expect, vi, afterEach } from 'vitest';
import { villageOf } from '@/world/village';
import { skyAt } from '@/world/sky';
import { hourIn } from '@/world/gameClock';
import { moonOf } from '@/world/lumiere/ombres';
import { homesOf } from '@/world/village/wildLife';
import { gridOf } from '@/world/village/paths';

// Petite île de 16 × 16 : de l'herbe, un bois au nord-ouest, une mare au sud-est, du sable au sud ; deux quartiers, le
// cœur (x < 8) et les jardins (x ≥ 8)
const N = 16;
const groundAt = (x, y) => {
  if (x <= 0 || y <= 0 || x >= N - 1 || y >= N - 1) return '~';
  if (x < 4 && y < 4) return 'f';
  if (x > 11 && y > 10 && y < 13) return 'w';
  if (y >= 13) return 's';
  return 'g';
};
const M = { ground: (x, y) => (x < 0 || y < 0 || x >= N || y >= N ? '~' : groundAt(x, y)), height: () => 1, zone: (x, y) => (x < 0 || y < 0 || x >= N || y >= N ? -1 : x < 8 ? 0 : 1) };
const props = [{ kind: 'tree', x: 5, y: 2 }, { kind: 'apple', x: 6, y: 3 }, { kind: 'tree', x: 4, y: 5 }];
const make = (owned, more = {}) => villageOf({ n: N, M, sites: [], owned, crafts: [], props, zoneIds: ['coeur', 'jardins'], acts: ['T', 'I', 'II'], ...more });
// La vue à la minute m du cycle du jeu (0 : 6 h de l'île), sous ce temps (l'heure de l'île à la seconde, comme le jeu)
const phaseAt = (m, weather = 'clair') => {
  const h = hourIn(m) % 24;
  return skyAt(new Date(2026, 5, 21, 0, 0, Math.round(h * 3600)), { weather });
};
const wild = (village, m, weather, t = 3) => village.at(t, phaseAt(m, weather)).list.filter(c => c.id && c.id.startsWith('wild:'));
afterEach(() => vi.useRealTimers());

describe('les bêtes sauvages vivent', () => {
  it('les coins d’une zone : lisière, prés, berges, rivage, sable, arbres', () => {
    const grid = gridOf({ n: N, M, sites: [], owned: new Set([0, 1]), crafts: [], props, annexes: [] });
    const homes = homesOf({ n: N, M, owned: new Set([0, 1]), grid, props });
    const has = (z, kind, x, y) => homes.get(z)[kind].some(c => c.x === x && c.y === y);
    expect(has(0, 'lisiere', 4, 2)).toBe(true);
    expect(has(0, 'pres', 6, 6)).toBe(true);
    expect(has(1, 'berges', 11, 11)).toBe(true);
    expect(has(1, 'sable', 9, 13)).toBe(true);
    expect(homes.get(0).arbres.length).toBe(3);
    // (sous la brume : rien)
    expect(homesOf({ n: N, M, owned: new Set([0]), grid, props }).has(1)).toBe(false);
  });

  it('à ses heures et sous son ciel : le lapin le jour par temps clair, jamais la nuit ni sous la pluie ; aucune bête hors des zones à soi', () => {
    vi.useFakeTimers({ now: new Date(2026, 9, 18, 12) });
    const village = make(new Set([0, 1]));
    const minutes = Array.from({ length: 120 }, (_, i) => 6 + i * 0.48);
    const rabbits = (m, w) => wild(village, m, w).filter(c => c.species === 'rabbit').length;
    expect(minutes.some(m => rabbits(m, 'clair') > 0)).toBe(true);
    expect(minutes.some(m => rabbits(m, 'pluie') > 0)).toBe(false);
    const night = Array.from({ length: 30 }, (_, i) => 72 + i * 0.5);
    expect(night.some(m => rabbits(m, 'clair') > 0)).toBe(false);
    // (le crabe, lui, sort la nuit, sur le sable)
    expect(night.some(m => wild(village, m, 'clair').some(c => c.species === 'crab'))).toBe(true);
    // Rien sous la brume : sans zone à soi, aucune bête
    const none = make(new Set());
    expect([...minutes, ...night].some(m => wild(none, m, 'clair').length)).toBe(false);
  });

  it('chacune dans ses zones : le lapin au cœur, jamais aux jardins', () => {
    vi.useFakeTimers({ now: new Date(2026, 9, 18, 12) });
    const village = make(new Set([0, 1]));
    for (let m = 6; m < 64; m += 0.5) {
      for (const c of wild(village, m, 'clair').filter(b => b.species === 'rabbit')) expect(M.zone(Math.round(c.x), Math.round(c.y))).toBe(0);
    }
  });

  it('elle marche case à case : d’une minute à l’autre, aucun saut', () => {
    vi.useFakeTimers({ now: new Date(2026, 9, 18, 12) });
    const village = make(new Set([0, 1]));
    let before = new Map();
    let walked = 0;
    for (let m = 6; m < 64; m += 0.004) {
      const now = new Map(wild(village, m, 'clair').map(c => [c.id, c]));
      for (const [id, c] of now) {
        const b = before.get(id);
        if (!b) continue;
        const d = Math.hypot(c.x - b.x, c.y - b.y);
        // (un papillon qui volette, un écureuil qui saute d'un arbre à l'autre : un peu plus d'une case par pas, au plus)
        expect(d).toBeLessThan(c.species === 'butterfly' || c.species === 'squirrel' ? 1.2 : 0.5);
        if (d > 0.01) walked++;
      }
      before = now;
    }
    expect(walked).toBeGreaterThan(50);
  });

  it('le papillon de lune ne sort qu’à la pleine lune', () => {
    // (une date de pleine lune, une de nouvelle lune)
    const fullAt = [...Array(30)].map((_, d) => new Date(2026, 9, 1 + d, 22)).find(date => moonOf(date).light > 0.97);
    const newAt = [...Array(30)].map((_, d) => new Date(2026, 9, 1 + d, 22)).find(date => moonOf(date).light < 0.03);
    const night = Array.from({ length: 40 }, (_, i) => 71 + i * 0.45);
    const moths = when => {
      vi.useFakeTimers({ now: when });
      const village = make(new Set([0, 1]), { written: ['Papillon'] });
      // (rare : un cycle du jeu sur deux ; sur quelques cycles de suite, elle se montre au moins une fois)
      let seen = 0;
      for (let c = 0; c < 6; c++) {
        vi.setSystemTime(new Date(when.getTime() + c * 90 * 60000));
        seen += night.filter(m => wild(village, m, 'clair').some(b => b.id.startsWith('wild:papillon-lune'))).length;
      }
      return seen;
    };
    expect(moths(fullAt)).toBeGreaterThan(0);
    expect(moths(newAt)).toBe(0);
  });
});
