import { describe, it, expect } from 'vitest';
import { guideOf, guideKind } from '@/world/itemGuide';

const site = { name: 'Potager' };

describe('mode d’emploi des articles de la boutique', () => {
  it('range chaque article dans sa sorte : bonus, compagnon, skin, teinte, pièce rare', () => {
    expect(guideKind({ kind: 'outil', gain: { prod: 0.2 } })).toBe('prod');
    expect(guideKind({ kind: 'objet', gain: { coins: 3 } })).toBe('coins');
    expect(guideKind({ kind: 'outil', gain: { moves: 1 } })).toBe('moves');
    expect(guideKind({ kind: 'objet', gain: { charges: 1 } })).toBe('charges');
    expect(guideKind({ kind: 'outil', gain: { regenMs: 1200000 } })).toBe('regen');
    expect(guideKind({ kind: 'objet', gain: null })).toBe('compagnon');
    expect(guideKind({ id: 'toit-bleu', kind: 'skin' })).toBe('skin');
    expect(guideKind({ id: 'sakura-potager', kind: 'skin' })).toBe('teinte');
    expect(guideKind({ id: 'papillons', kind: 'skin', rare: true })).toBe('rare');
  });
  it('dit où le trouver, comment s’en servir et pourquoi, pour chaque sorte', () => {
    const items = [
      { kind: 'outil', gain: { prod: 0.2 } }, { kind: 'objet', gain: { coins: 3 } }, { kind: 'outil', gain: { moves: 1 } },
      { kind: 'objet', gain: { charges: 1 } }, { kind: 'outil', gain: { regenMs: 1 } }, { kind: 'objet' },
      { id: 'toit-bleu', kind: 'skin' }, { id: 'sakura-potager', kind: 'skin' }, { id: 'papillons', kind: 'skin', rare: true }
    ];
    for (const item of items) {
      const guide = guideOf(item, site);
      expect(guide.where).toMatch(/Potager/);
      expect(guide.how.length).toBeGreaterThan(20);
      expect(guide.why.length).toBeGreaterThan(15);
    }
    expect(guideOf(items[0], site).where).toBe('Posé à côté de « Potager », sur ton île.');
    expect(guideOf(items[2], site).how).toMatch(/Récolte/);
    expect(guideOf(items[7], site).where).toMatch(/tous ses paliers/);
    expect(guideOf(items[8], site).how).toMatch(/butins/);
  });
});
