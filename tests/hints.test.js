import { describe, expect, it } from 'vitest';
import { knownOrigins, nearbyDiscoveries, nextStep, unexploredUses } from '@/utils/hints';

const R = { 'Eau+Feu': 'Vapeur', 'Air+Vapeur': 'Nuage', 'Eau+Nuage': 'Pluie', 'Feu+Terre': 'Lave' };
const BASE = ['Eau', 'Feu', 'Terre', 'Air'];

describe('indices', () => {
  it('donne la première fusion de la chaîne vers la cible', () => {
    expect(nextStep(R, BASE, ['Pluie'])).toEqual({ ingredients: ['Eau', 'Feu'], result: 'Vapeur' });
    expect(nextStep(R, [...BASE, 'Vapeur'], ['Pluie'])).toEqual({ ingredients: ['Air', 'Vapeur'], result: 'Nuage' });
  });
  it('ne promet rien d’inatteignable', () => {
    expect(nextStep(R, ['Eau'], ['Pluie'])).toBeNull();
  });
  it('trouve ce qui est à une fusion, sans ce qui est déjà connu', () => {
    expect(nearbyDiscoveries(R, BASE)).toEqual(['Lave', 'Vapeur']);
    expect(nearbyDiscoveries(R, [...BASE, 'Vapeur', 'Lave'])).toEqual(['Nuage']);
  });
  it('compte les recettes encore inexplorées et retrouve les origines', () => {
    expect(unexploredUses(R, [...BASE, 'Vapeur'])).toEqual({ Air: 1, Vapeur: 1, Eau: 1, Feu: 1, Terre: 1 });
    expect(knownOrigins(R, BASE, 'Vapeur')).toEqual([['Eau', 'Feu']]);
  });
});
