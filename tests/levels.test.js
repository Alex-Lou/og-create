// Les paliers d'un bâtiment côté navigateur : où en est chacun, et si le suivant peut se bâtir (le serveur reste seul juge)
import { describe, it, expect } from 'vitest';
import { stepState, levelAffordable, coinsEnough, levelReady } from '@/world/levels';

const next = (extra = {}) => ({ planOwned: true, chapterOpen: true, cost: { stone: 10, wood: 5 }, coins: 200, ...extra });
const stock = { stone: 10, wood: 5, water: 0, food: 0 };

describe('stepState', () => {
  it('atteint, prochain, à venir', () => {
    const site = { level: 2 };
    expect([0, 1, 2, 3].map(i => stepState(site, i))).toEqual(['done', 'done', 'next', 'later']);
  });
});

describe('levelAffordable et coinsEnough', () => {
  it('toutes les ressources du palier suivant, sinon non', () => {
    expect(levelAffordable({ next: next() }, stock)).toBe(true);
    expect(levelAffordable({ next: next({ cost: { stone: 11 } }) }, stock)).toBe(false);
    expect(levelAffordable({ next: null }, stock)).toBe(false);
  });
  it('pas de prix, ou solde inconnu : assez ; sinon le solde décide', () => {
    expect(coinsEnough(0, 0)).toBe(true);
    expect(coinsEnough(undefined, 0)).toBe(true);
    expect(coinsEnough(500, null)).toBe(true);
    expect(coinsEnough(500, 500)).toBe(true);
    expect(coinsEnough(500, 499)).toBe(false);
  });
});

describe('levelReady', () => {
  it('plan trouvé, chapitre ouvert (ou sans chapitre), ressources et écus réunis', () => {
    expect(levelReady({ next: next() }, stock, 200)).toBe(true);
    expect(levelReady({ next: next({ chapterOpen: undefined }) }, stock, 200)).toBe(true);
    expect(levelReady({ next: next() }, stock, null)).toBe(true);
  });
  it('il manque une seule chose : non', () => {
    expect(levelReady({ next: next({ planOwned: false }) }, stock, 200)).toBeFalsy();
    expect(levelReady({ next: next({ chapterOpen: false }) }, stock, 200)).toBe(false);
    expect(levelReady({ next: next({ cost: { stone: 11 } }) }, stock, 200)).toBe(false);
    expect(levelReady({ next: next() }, stock, 199)).toBe(false);
    expect(levelReady({ next: null }, stock, 200)).toBe(false);
  });
});
