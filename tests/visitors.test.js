import { describe, it, expect } from 'vitest';
import { visitorLook, storyOf, requestText, askLine, readyOf, leavesText, visitorBoat, THANKS } from '@/world/visitors';
import { villagerSprite } from '@/world/villagers';

const H = 3600000;
const guest = (request, over = {}) => ({ id: 3, seed: 77, name: 'Iris', site: 'ponton', role: 'Cartographe', request, leavesIn: 30 * H, satisfied: false, ...over });
const livrer = { kind: 'livrer', resource: 'food', amount: 30, reward: 60 };
const recolter = (have = 0) => ({ kind: 'recolter', count: 2, reward: 60, have });
// Aucune balise ne porte deux fois le même attribut (une image data: invalide ne s'affiche pas)
const wellFormed = svg => (svg.match(/<[a-zA-Z][^>]*>/g) || []).every(tag => {
  const names = [...tag.matchAll(/\s([a-zA-Z:-]+)="/g)].map(m => m[1]);
  return new Set(names).size === names.length;
});

describe('visiteurs', () => {
  it('dit sa demande, ce qu’il demande et quand il repart', () => {
    expect(requestText(livrer)).toBe('Livrer 30 vivres');
    expect(requestText(recolter(1))).toBe('Faire 2 Récoltes pendant son séjour (1/2)');
    expect(askLine(guest(livrer))).toMatch(/30 vivres/);
    expect(askLine(guest(recolter(0)))).toMatch(/2 pendant mon séjour/);
    expect(askLine(guest(recolter(2)))).toMatch(/Quelles Récoltes/);
    expect(askLine(guest(livrer, { satisfied: true }))).toMatch(/Merci encore/);
    expect(THANKS).toBeTruthy();
    expect(storyOf(guest(livrer))).toMatch(/côtes/);
    expect(leavesText(50 * H)).toBe('dans 2 j');
    expect(leavesText(47.9 * H)).toBe('dans 2 j');
    expect(leavesText(25 * H)).toBe('dans 1 j');
    expect(leavesText(5.5 * H)).toBe('dans 5 h');
    expect(leavesText(20 * 60000)).toBe('dans 20 min');
  });

  it('sait si la demande peut être comblée', () => {
    expect(readyOf(guest(livrer), { food: 29 })).toBe(false);
    expect(readyOf(guest(livrer), { food: 30 })).toBe(true);
    expect(readyOf(guest(recolter(1)), {})).toBe(false);
    expect(readyOf(guest(recolter(2)), {})).toBe(true);
    expect(readyOf(guest(livrer, { satisfied: true }), { food: 99 })).toBe(false);
  });

  it('un visiteur est toujours un adulte, dessiné proprement ; son bateau aussi', () => {
    for (let seed = 1; seed < 200; seed++) {
      const look = visitorLook(seed, 'Poète');
      expect(look.build).not.toBe('child');
      expect(look.label).toBe('Poète');
    }
    expect(wellFormed(villagerSprite(visitorLook(9)).svg)).toBe(true);
    for (const frame of [0, 1]) {
      const boat = visitorBoat(frame);
      expect(boat.svg.startsWith('<svg')).toBe(true);
      expect(wellFormed(boat.svg)).toBe(true);
    }
  });
});
