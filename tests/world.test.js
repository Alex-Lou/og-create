import { describe, it, expect } from 'vitest';
import { P, TW, TH, box } from '@/world/iso';
import { phaseAt } from '@/world/scene';
import { BUILDINGS, NATURE } from '@/world/sprites';

const at = (h, m = 0) => {
  const d = new Date(2026, 9, 4, h, m);
  return phaseAt(d);
};

describe('géométrie isométrique', () => {
  it('projette une case en losange 2:1, z vers le haut', () => {
    expect(P(0, 0, 0)).toEqual([0, 0]);
    expect(P(1, 0, 0)).toEqual([TW / 2, TH / 2]);
    expect(P(0, 1, 0)).toEqual([-TW / 2, TH / 2]);
    expect(P(0, 0, 10)).toEqual([0, -10]);
  });
  it('une boîte ne montre que ses trois faces visibles', () => {
    expect(box(0, 0, 1, 1, 0, 10, { top: '#a', left: '#b', right: '#c' }).match(/<polygon/g)).toHaveLength(3);
  });
});

describe('sprites', () => {
  it('chaque bâtiment et chaque élément de nature donne un SVG cadré', () => {
    const all = [...Object.values(BUILDINGS).flat(), ...Object.values(NATURE)];
    for (const make of all) {
      const { svg, box: frame } = make();
      expect(svg.startsWith('<svg')).toBe(true);
      expect(frame.w).toBeGreaterThan(0);
      expect(svg).not.toMatch(/NaN|undefined/);
    }
  });
  it('le chantier a trois phases', () => {
    expect(BUILDINGS.chantier).toHaveLength(3);
  });
});

describe('heure de l’île', () => {
  it('suit l’heure locale : aube, jour, crépuscule, nuit', () => {
    expect(at(6).id).toBe('dawn');
    expect(at(12).id).toBe('day');
    expect(at(19).id).toBe('dusk');
    expect(at(23).id).toBe('night');
    expect(at(2).id).toBe('night');
  });
  it('la nuit monte doucement : nulle le jour, pleine à minuit', () => {
    expect(at(12).night).toBe(0);
    expect(at(0).night).toBe(1);
    expect(at(20, 30).night).toBeGreaterThan(0);
    expect(at(20, 30).night).toBeLessThan(1);
  });
});
