// La composition de la jungle du départ (world/jungleLayout.js) : un noyau dégagé au bord de la plage (la zone du Feu,
// world/zones.js), des massifs serrés autour, rien hors de la bande ; fixe d'une fois à l'autre, chaque plante dans sa
// case et dessinée dans la bibliothèque
import { describe, it, expect } from 'vitest';
import { CLEARINGS, inJungle, thicknessAt, jungleAt, glowAt } from '@/world/jungleLayout';
import { ZONES } from '@/world/zones';
import { VARIANTS } from '@/world/plants';

const [cx, cy, cw, ch] = CLEARINGS[0];
const area = [];
for (let y = 70; y < 112; y++) for (let x = 70; x < 120; x++) area.push([x, y]);

describe('la jungle du départ', () => {
  it('le noyau : la zone du Feu, sans sa première rangée ni sa première colonne', () => {
    const [px, py, pw, ph] = ZONES.find(z => z.id === 'plage').rect;
    expect(CLEARINGS).toEqual([[px + 1, py + 1, pw - 1, ph - 1]]);
  });

  it('rien ne pousse au milieu du noyau ; à son bord, une lisière basse seulement', () => {
    for (let y = cy + 1; y < cy + ch - 1; y++) for (let x = cx + 1; x < cx + cw - 1; x++) expect(jungleAt(x, y), `${x},${y}`).toEqual([]);
    const TALL = new Set(['banana', 'treefern', 'kapok', 'ravenala']);
    for (let x = cx; x < cx + cw; x++) for (const y of [cy, cy + ch - 1]) expect(jungleAt(x, y).some(p => TALL.has(p.kind)), `${x},${y}`).toBe(false);
  });

  it('serrée autour du noyau, et bornée : loin de lui et hors du cœur, l\'île garde sa flore', () => {
    expect(inJungle(cx - 3, cy - 3, false)).toBe(true);
    expect(inJungle(cx + cw + 3, cy, false)).toBe(true);
    expect(inJungle(10, 10, false)).toBe(false);
    expect(inJungle(10, 10, true)).toBe(true);
    // (au nord, à l'est et à l'ouest du noyau, à trois cases : des plantes presque partout)
    const ring = [];
    for (let x = cx - 3; x < cx + cw + 3; x++) ring.push([x, cy - 3]);
    for (let y = cy; y < cy + ch; y++) ring.push([cx - 3, y], [cx + cw + 2, y]);
    expect(ring.filter(([x, y]) => jungleAt(x, y).length).length / ring.length).toBeGreaterThan(0.8);
  });

  it('fixe d\'une fois à l\'autre, chaque plante dans sa case, chaque sorte dessinée, ses lueurs entre 0 et 1', () => {
    for (const [x, y] of area) {
      const t = thicknessAt(x, y);
      expect(t >= 0 && t <= 1, `${x},${y}`).toBe(true);
      const plants = jungleAt(x, y);
      expect(jungleAt(x, y)).toEqual(plants);
      for (const p of plants) {
        expect(Math.abs(p.dx) <= 0.5 && Math.abs(p.dy) <= 0.5, `${x},${y} ${p.kind}`).toBe(true);
        expect(VARIANTS[p.kind]?.length, p.kind).toBeGreaterThan(0);
        const g = glowAt(p.kind, x + p.dx, y + p.dy);
        expect(g >= 0 && g <= 1, `${x},${y} ${p.kind}`).toBe(true);
      }
      // (au plus quatre plantes par case : le rendu reste léger)
      expect(plants.length).toBeLessThanOrEqual(4);
    }
  });
});
