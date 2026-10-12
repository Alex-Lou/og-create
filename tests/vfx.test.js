// Le moteur des effets (utils/vfx.js) : hors d'un navigateur (ou sans canevas), il ne fait rien et ne garde rien ; ses
// ancres : un effet ancré suit son point (Brume quand on fait glisser l'île), une particule qui le quitte reste où on la voit
import { describe, it, expect } from 'vitest';
import { particule, gerbe, forme, etat, ancre, decale, decroche, anneau } from '../src/utils/vfx';

describe('moteur des effets', () => {
  it('ne fait rien hors d’un navigateur', () => {
    expect(particule({ x: 0, y: 0, vie: 1 })).toBeNull();
    gerbe({ x: 0, y: 0 }, 10, () => ({ vie: 1 }));
    forme(0, 1, () => {});
    expect(etat()).toEqual({ particules: 0, formes: 0, actif: false, qualite: 1 });
  });

  it('une ancre rend de combien son point a bougé depuis le départ (relue une fois par image)', () => {
    let moved = { x: 0, y: 0 };
    const a = ancre(() => moved);
    expect(decale(a)).toMatchObject({ x: 0, y: 0 });
    moved = { x: 30, y: -12 };
    expect(decale(a)).toMatchObject({ x: 0, y: 0 });
    a.image = -1;
    expect(decale(a)).toMatchObject({ x: 30, y: -12 });
  });

  it('une particule qui quitte son ancre garde sa place à l’écran', () => {
    const p = { x: 100, y: 200, ancre: ancre(() => ({ x: 40, y: 10 })) };
    decroche(p);
    expect(p).toMatchObject({ x: 140, y: 210, ancre: null });
    decroche(p);
    expect(p).toMatchObject({ x: 140, y: 210 });
  });

  it('l’anneau magique : un fil d’or dans un halo bleu ; rien pour un rayon nul ou négatif, ni éteint', () => {
    const traits = [];
    const g = { ellipse: (x, y, rx, ry) => traits.push([rx, ry]), beginPath() {}, stroke() { traits.at(-1).push(this.strokeStyle, this.lineWidth); } };
    anneau(g, 0, 0, 40, 20, 1, 2);
    expect(traits.map(t => t[2])).toEqual(['rgb(96,164,255)', 'rgb(66,128,236)', 'rgb(96,164,255)', 'rgb(242,188,72)', 'rgb(255,236,178)']);
    expect(traits[0][3]).toBeGreaterThan(traits[3][3]);
    traits.length = 0;
    anneau(g, 0, 0, -3, 20, 1, 2);
    anneau(g, 0, 0, 40, 20, 0, 2);
    expect(traits).toEqual([]);
  });
});
