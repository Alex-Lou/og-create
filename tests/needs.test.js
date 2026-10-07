import { describe, it, expect } from 'vitest';
import { costText, leftText, needState, missingOf, affordable, fillAllOf, askOr, ASKS, NEED_GLYPH, MOOD_GLYPH } from '@/world/needs';
import { ICONS } from '@/utils/icons';

const H = 3600000;
const manger = (over = {}) => ({ id: 'manger', met: true, left: 14 * H + 5, refill: false, cost: { food: 10 }, ...over });
const outils = (over = {}) => ({ id: 'outils', met: true, left: 30 * H, refill: false, cost: { stone: 5, wood: 5 }, ...over });
const deco = (over = {}) => ({ id: 'deco', met: false, have: 1, need: 3, reach: 3, ...over });

describe('besoins des habitants', () => {
  it('dit le prix et le temps qui reste en clair', () => {
    expect(costText({ food: 10 })).toBe('10 vivres');
    expect(costText({ stone: 5, wood: 5 })).toBe('5 pierres et 5 bûches');
    expect(leftText(14 * H + 5)).toBe('14 h');
    expect(leftText(40 * 60000)).toBe('40 min');
    expect(leftText(10)).toBe('1 min');
  });

  it('dit où en est chaque besoin', () => {
    expect(needState(manger(), 'Carrière')).toBe('Le ventre plein encore 14 h');
    expect(needState(manger({ met: false, left: 0 }), 'Carrière')).toBe('A faim');
    expect(needState(outils(), 'Carrière')).toBe('Outils en bon état encore 30 h');
    expect(needState(outils({ met: false }), 'Carrière')).toBe('Outils usés');
    expect(needState(deco(), 'Carrière')).toBe('1 / 3 créations d’île à 3 cases au plus de « Carrière »');
    expect(needState(deco({ met: true, have: 3 }), 'Carrière')).toBe('3 créations d’île autour de « Carrière »');
  });

  it('dit quand un besoin comblé pourra se renouveler (à mi-durée)', () => {
    expect(needState(manger(), 'Carrière', 24)).toBe('Le ventre plein encore 14 h · à renouveler dans 2 h');
    expect(needState(manger({ left: 10 * H, refill: true }), 'Carrière', 24)).toBe('Le ventre plein encore 10 h · tu peux déjà le renouveler');
    expect(needState(manger({ met: false, left: 0, refill: true }), 'Carrière', 24)).toBe('A faim');
  });

  it('sait ce qui manque, ce qui se paie, et ce que « Tout combler » coûterait', () => {
    const rose = { id: 'potager', needs: [manger({ met: false, refill: true }), outils({ refill: true }), deco()] };
    const paulette = { id: 'foyer', needs: [manger(), deco({ met: true })] };
    expect(missingOf(rose).map(n => n.id)).toEqual(['manger', 'deco']);
    expect(missingOf(paulette)).toEqual([]);
    expect(affordable(manger(), { food: 10 })).toBe(true);
    expect(affordable(outils(), { stone: 5, wood: 4 })).toBe(false);
    const all = fillAllOf([rose, paulette]);
    expect(all).toEqual({ count: 2, cost: { stone: 5, wood: 5, food: 10 } });
    expect(Object.keys(all.cost)).toEqual(['stone', 'wood', 'food']);
    expect(fillAllOf([paulette])).toEqual({ count: 0, cost: {} });
  });

  it('un habitant qu’on touche parle d’abord de ce qui lui manque', () => {
    expect(askOr({ needs: [manger(), deco()] }, 'Bonjour !')).toBe(ASKS.deco);
    expect(askOr({ needs: [manger(), deco({ met: true })] }, 'Bonjour !')).toBe('Bonjour !');
    expect(askOr({}, 'Bonjour !')).toBe('Bonjour !');
  });

  it('chaque besoin et chaque humeur a son icône', () => {
    for (const glyph of [...Object.values(NEED_GLYPH), ...Object.values(MOOD_GLYPH)]) expect(ICONS[glyph.slice(3)]).toBeTruthy();
  });
});
