// Le moteur des effets (utils/vfx.js) : hors d'un navigateur (ou sans canevas), il ne fait rien et ne garde rien
import { describe, it, expect } from 'vitest';
import { particule, gerbe, forme, etat } from '../src/utils/vfx';

describe('moteur des effets', () => {
  it('ne fait rien hors d’un navigateur', () => {
    expect(particule({ x: 0, y: 0, vie: 1 })).toBeNull();
    gerbe({ x: 0, y: 0 }, 10, () => ({ vie: 1 }));
    forme(0, 1, () => {});
    expect(etat()).toEqual({ particules: 0, formes: 0, actif: false, qualite: 1 });
  });
});
