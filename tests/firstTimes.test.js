// Les dialogues de première fois (design/dialogues/chantiers.json) : chaque moment par celui qui le montre, quand il
// est là ; la suite après le geste
import { describe, it, expect } from 'vitest';
import { momentsDue, momentLines } from '@/game/firstTimes';

const island = (sites, met, { ready = () => true, deposits = 0, said = () => false } = {}) => ({
  state: { sites }, met: new Set(met), ready, deposits, said
});

describe('les dialogues de première fois', () => {
  it('les bulles viennent du design, avant et après le geste', () => {
    expect(momentLines('premier-chantier').map(l => l.id)).toEqual(['dlg-premier-chantier-1', 'dlg-premier-chantier-1b', 'dlg-premier-chantier-1c', 'dlg-premier-chantier-2']);
    // (Lorena et Agathe s'en mêlent, avec leur expression ; après le Puits, la quête parle : plus de bulle ici)
    expect(momentLines('premier-chantier')[1]).toMatchObject({ who: 'ponton', mood: 'surpris' });
    expect(momentLines('premier-chantier', true)).toEqual([]);
    expect(momentLines('premiere-evolution', true)).toMatchObject([{ id: 'dlg-premiere-evolution-3', who: 'atelier' }]);
    expect(momentLines('inconnu')).toEqual([]);
  });

  it('bâtir : le Puits prêt et Léo là ; sans Léo, ou sans de quoi payer, rien', () => {
    const puits = { id: 'puits', level: 0, next: { cost: {} } };
    expect(momentsDue(island([puits], ['puits']))).toEqual([{ id: 'premier-chantier' }]);
    expect(momentsDue(island([puits], ['ponton']))).toEqual([]);
    expect(momentsDue(island([puits], ['puits'], { ready: () => false }))).toEqual([]);
    // Bâti, après la première bulle : la suite
    expect(momentsDue(island([{ ...puits, level: 1 }], [], { said: id => id === 'dlg-premier-chantier-1' }))).toEqual([{ id: 'premier-chantier', after: true }]);
  });

  it('évoluer avec Nathan, ramasser avec Agathe, un gisement avec Robby', () => {
    const foyer = { id: 'foyer', level: 1, next: { cost: {} }, pending: { coins: 3 } };
    const due = momentsDue(island([foyer], ['atelier', 'foyer', 'carriere'], { deposits: 2 })).map(m => m.id);
    expect(due).toEqual(['premiere-evolution', 'premiere-production', 'premier-gisement']);
    expect(momentsDue(island([foyer], [], { deposits: 2 }))).toEqual([]);
  });
});
