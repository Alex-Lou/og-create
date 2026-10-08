// Les dialogues de première fois (design/dialogues/chantiers.json) : chaque moment par celui qui le montre, quand il
// est là ; la suite après le geste
import { describe, it, expect } from 'vitest';
import { momentsDue, momentLines } from '@/game/firstTimes';

const island = (sites, met, { ready = () => true, deposits = 0, said = () => false } = {}) => ({
  state: { sites }, met: new Set(met), ready, deposits, said
});

describe('les dialogues de première fois', () => {
  it('les bulles viennent du design, avant et après le geste', () => {
    expect(momentLines('premier-chantier').map(l => l.id)).toEqual(['dlg-premier-chantier-1', 'dlg-premier-chantier-2']);
    expect(momentLines('premier-chantier', true)).toMatchObject([{ id: 'dlg-premier-chantier-3', who: 'puits' }]);
    expect(momentLines('inconnu')).toEqual([]);
  });

  it('bâtir : le Puits prêt et Ondin là ; sans Ondin, ou sans de quoi payer, rien', () => {
    const puits = { id: 'puits', level: 0, next: { cost: {} } };
    expect(momentsDue(island([puits], ['puits']))).toEqual([{ id: 'premier-chantier' }]);
    expect(momentsDue(island([puits], ['ponton']))).toEqual([]);
    expect(momentsDue(island([puits], ['puits'], { ready: () => false }))).toEqual([]);
    // Bâti, après la première bulle : la suite
    expect(momentsDue(island([{ ...puits, level: 1 }], [], { said: id => id === 'dlg-premier-chantier-1' }))).toEqual([{ id: 'premier-chantier', after: true }]);
  });

  it('évoluer avec Rivet, ramasser avec Cannelle, un gisement avec Galet', () => {
    const foyer = { id: 'foyer', level: 1, next: { cost: {} }, pending: { coins: 3 } };
    const due = momentsDue(island([foyer], ['atelier', 'foyer', 'carriere'], { deposits: 2 })).map(m => m.id);
    expect(due).toEqual(['premiere-evolution', 'premiere-production', 'premier-gisement']);
    expect(momentsDue(island([foyer], [], { deposits: 2 }))).toEqual([]);
  });
});
