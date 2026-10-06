// La liste des coûts (CostList : établi et annexes) dit en toutes lettres ce qu'une chose coûte
import { describe, it, expect } from 'vitest';
import { costLabel } from '@/game/resources';

describe('costLabel', () => {
  it('ressources, puis trouvailles, puis écus', () => {
    expect(costLabel({ wood: 6, stone: 6 })).toBe('6 bois, 6 pierre');
    expect(costLabel({ wood: 8 }, { Ambre: 2 })).toBe('8 bois, 2 Ambre');
    expect(costLabel({ wood: 8 }, { Ambre: 2 }, 500)).toBe('8 bois, 2 Ambre, 500 écus');
  });
  it('des écus à zéro se disent ; pas d’écus, rien', () => {
    expect(costLabel({ food: 3 }, null, 0)).toBe('3 nourriture, 0 écus');
    expect(costLabel({}, {}, null)).toBe('');
  });
});
