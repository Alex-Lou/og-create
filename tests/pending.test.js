import { describe, it, expect } from 'vitest';
import { pendingOf, gatheredBetween, gatheredText } from '@/world/pending';
import { LABEL } from '@/game/resources';

describe('ce qui attend dans les bâtiments (lot 1b)', () => {
  it('lit la vue du serveur, en unités entières', () => {
    expect(pendingOf({ pending: 12.9, pendingStock: { wood: 7, food: 3.5 } })).toEqual({ stone: 0, wood: 7, water: 0, food: 3, coins: 12 });
    expect(pendingOf(null)).toEqual({ stone: 0, wood: 0, water: 0, food: 0, coins: 0 });
  });

  it('ce qui a baissé entre deux vues a été ramassé en passant ; ce qui a monté non', () => {
    const before = { pending: 8, pendingStock: { wood: 12, food: 2 } };
    expect(gatheredBetween(before, { pending: 0, pendingStock: { wood: 0, food: 0 } })).toEqual({ wood: 12, food: 2, coins: 8 });
    expect(gatheredBetween(before, { pending: 9, pendingStock: { wood: 13, food: 2 } })).toEqual({});
    expect(gatheredText({ wood: 12, coins: 1 })).toBe(`+12 ${LABEL.wood} · +1 écu`);
    expect(gatheredText({ coins: 8 })).toBe('+8 écus');
    expect(gatheredText({})).toBe('');
  });
});
