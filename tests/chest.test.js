import { describe, it, expect } from 'vitest';
import { RARITY, prizeText, sourceText, noteOf, BOTTLE } from '@/world/chest';

describe('coffres', () => {
  it('nomme chaque rareté et chaque lot', () => {
    expect(Object.keys(RARITY)).toEqual(['commun', 'rare', 'epique', 'legendaire']);
    expect(prizeText({ kind: 'coins', amount: 25 })).toBe('25 écus');
    expect(prizeText({ kind: 'stock', stock: { wood: 20, water: 30 } })).toBe('🪵 20 bois · 💧 30 eau');
    expect(prizeText({ kind: 'tint', item: 'craie-foyer', name: 'Craie' })).toBe('Teinte Craie');
    expect(prizeText({ kind: 'rare', item: 'papillons', name: 'Papillons' })).toBe('Papillons');
  });
  it('dit d’où vient un coffre', () => {
    expect(sourceText('jour:2026-10-04', 3)).toBe('Coffre du jour · jour 3');
    expect(sourceText('recolte:12')).toBe('Coffre de la Récolte');
    expect(sourceText('bouteille:2026-10-04-2')).toBe('Bouteille à la mer');
    expect(sourceText('chapitre:IV')).toBe('Coffre du chapitre IV');
    expect(sourceText('quete:source')).toBe('Coffre de Brume');
  });
  it('glisse toujours le même mot dans une même bouteille, et dessine la bouteille', () => {
    expect(noteOf('bouteille:2026-10-04-2')).toBe(noteOf('bouteille:2026-10-04-2'));
    expect(noteOf('a').length).toBeGreaterThan(20);
    for (const make of BOTTLE) expect(make().svg).toMatch(/^<svg/);
  });
});
