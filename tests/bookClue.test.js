import { describe, it, expect } from 'vitest';
import { clueText } from '../src/book/painter';
import { aimNote, aimMessage } from '../src/book/aim';

// Indice d'une page à portée : les familles des ingrédients, jamais l'élément
describe('clueText', () => {
  it('nomme les familles de deux ingrédients', () => {
    expect(clueText(['Elements Fondamentaux', 'Matériaux'])).toBe('Mêle un élément premier et un matériau.');
  });
  it('dit « un autre » quand une famille revient', () => {
    expect(clueText(['Elements Fondamentaux', 'Elements Fondamentaux'])).toBe('Mêle un élément premier et un autre élément premier.');
  });
  it('accepte trois ingrédients et une famille inconnue', () => {
    expect(clueText(['Flore', 'Cosmos', 'Inconnue'])).toBe('Mêle une plante, un astre du cosmos et un élément.');
  });
  it('dit « deux fois le même » quand un ingrédient revient (Eau + Eau)', () => {
    expect(clueText(['Elements Fondamentaux', 'Elements Fondamentaux'], [0, 0])).toBe('Mêle deux fois le même élément premier.');
  });
  it('garde « un autre » pour deux ingrédients différents de la même famille', () => {
    expect(clueText(['Elements Fondamentaux', 'Elements Fondamentaux'], [0, 1])).toBe('Mêle un élément premier et un autre élément premier.');
  });
  it('mêle répétition et ingrédient différent', () => {
    expect(clueText(['Elements Fondamentaux', 'Elements Fondamentaux', 'Flore'], [0, 0, 1])).toBe('Mêle deux fois le même élément premier et une plante.');
    expect(clueText(['Flore', 'Flore', 'Flore'], [0, 0, 0])).toBe('Mêle trois fois la même plante.');
  });
});

// Verdict d'un mélange visé : le nombre d'ingrédients justes, jamais lesquels
describe('aim', () => {
  const aim = { tried: ['Terre', 'Air'], right: 1, of: 2, misses: 1, need: 3, freeInk: false };
  it('peint le dernier essai sur la page', () => {
    expect(aimNote(aim, 1, 3)).toBe('Terre + Air → 1 ingrédient juste sur 2');
    expect(aimNote({ ...aim, right: 0, tried: ['Terre', 'Air', 'Feu'] }, 1, 3)).toBe('Terre + Air + Feu → aucun ingrédient juste · il en faut 2');
  });
  it('rappelle les essais ratés après un rechargement, sans verdict', () => {
    expect(aimNote(null, 2, 3)).toBe('2 essais ratés · encre offerte à 3');
    expect(aimNote(null, 3, 3)).toBe('');
    expect(aimNote(null, 0, 3)).toBe('');
  });
  it('dit à l’Athanor ce qu’il reste avant l’encre offerte', () => {
    expect(aimMessage(aim)).toBe('Pas cette page : 1 ingrédient juste sur 2. Encore 2 essais et l’encre est offerte.');
    expect(aimMessage({ ...aim, right: 2, misses: 3, freeInk: true })).toBe('Pas cette page : 2 ingrédients justes sur 2. L’encre de la page est offerte.');
    expect(aimMessage({ ...aim, misses: null })).toBe('Pas cette page : 1 ingrédient juste sur 2.');
  });
});
