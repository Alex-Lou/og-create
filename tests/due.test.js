import { describe, it, expect } from 'vitest';
import { dueIn, slotLeft, ACCRUE_MS } from '@/world/due';

const H = 3600000;
const MIN = 60000;

describe('ce qui change sur l’île sans y toucher (lot 1)', () => {
  it('le prochain changement : partie, expédition, mini-jeu, voyageur, gisement, réserve pleine', () => {
    expect(dueIn(null)).toBe(null);
    expect(dueIn({})).toBe(null);
    expect(dueIn({ charges: { nextIn: 12 * MIN } })).toBe(12 * MIN);
    expect(dueIn({ charges: { nextIn: null }, expedition: { endsIn: 40 * MIN } })).toBe(40 * MIN);
    expect(dueIn({ games: [{ open: true, nextIn: 30 * MIN }, { open: false, nextIn: 5 * MIN }] })).toBe(30 * MIN);
    expect(dueIn({ visitor: { leavesIn: 3 * H }, deposits: [{ readyIn: 0 }, { readyIn: 2 * H }] })).toBe(2 * H);
    expect(dueIn({ sites: [{ fullIn: 0 }, { fullIn: null }, { fullIn: 7 * MIN }] })).toBe(7 * MIN);
  });

  it('un besoin : on peut le renouveler à mi-durée, il manque à zéro ; une bête de même', () => {
    const needs = { kinds: { manger: { hours: 24 }, deco: { decos: 3 } } };
    const villager = left => ({ needs: [{ id: 'manger', left }, { id: 'deco', met: false }] });
    // Comblé encore 14 h : renouvelable dans 2 h
    expect(dueIn({ needs, villagers: [villager(14 * H)] })).toBe(2 * H);
    // Déjà renouvelable : il manquera dans 10 h
    expect(dueIn({ needs, villagers: [villager(10 * H)] })).toBe(10 * H);
    expect(dueIn({ needs, villagers: [villager(0)] })).toBe(null);
    expect(dueIn({ beasts: { hours: 24, list: [{ fed: true, left: 20 * H }] } })).toBe(ACCRUE_MS);
    expect(dueIn({ beasts: { hours: 24, list: [{ fed: false, left: 0 }] } })).toBe(null);
  });

  it('la production avance : la vue se refait toutes les 5 minutes au plus', () => {
    const potager = level => ({ id: 'potager', produce: 'food', level, locked: false });
    expect(dueIn({ sites: [potager(1)] })).toBe(ACCRUE_MS);
    expect(dueIn({ sites: [potager(0)] })).toBe(null);
    expect(dueIn({ sites: [potager(1)], charges: { nextIn: MIN } })).toBe(MIN);
  });

  it('bouteille et coffre du jour : créneaux de 6 h, heure de Paris', () => {
    // 7 octobre 2026, 14 h 30 à Paris (UTC+2) : prochain créneau à 18 h
    const now = Date.UTC(2026, 9, 7, 12, 30);
    expect(slotLeft(now)).toBe(3.5 * H);
    // 23 h 59 à Paris : minuit (le coffre du jour) dans une minute
    expect(slotLeft(Date.UTC(2026, 9, 7, 21, 59))).toBe(MIN);
    expect(dueIn({ chests: {} }, now)).toBe(3.5 * H);
  });
});
