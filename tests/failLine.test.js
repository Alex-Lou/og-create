import { describe, expect, it } from 'vitest';
import { failLine } from '@/utils/failLine';

const FAMILY = { Eau: 'Elements Fondamentaux', Feu: 'Elements Fondamentaux', Chat: 'Vie et Créatures', Orage: 'Phénomènes Naturels', Licorne: 'Légendes' };
const familyOf = name => FAMILY[name] || '';
const first = () => 0;

describe('phrase d’un mélange raté', () => {
  it('donne une image selon les familles mélangées', () => {
    expect(failLine(['Chat', 'Orage'], { familyOf, rand: first })).toMatch(/^La créature s’enfuit devant l’orage\./);
    expect(failLine(['Eau', 'Feu'], { familyOf, rand: first })).toMatch(/^Les éléments se repoussent/);
  });
  it('signale l’ingrédient qui cache le plus de mélanges inconnus', () => {
    const line = failLine(['Eau', 'Chat'], { familyOf, unexplored: { Eau: 1, Chat: 4 }, rand: first });
    expect(line).toMatch(/Mais Chat cache encore 4 mélanges\.$/);
    expect(failLine(['Eau', 'Feu'], { familyOf, unexplored: { Feu: 1 }, rand: first })).toMatch(/Feu cache encore 1 mélange\.$/);
  });
  it('arrondit un grand nombre de mélanges', () => {
    expect(failLine(['Eau', 'Feu'], { familyOf, unexplored: { Eau: 136 }, rand: first })).toMatch(/Mais Eau cache encore bien des mélanges\.$/);
  });
  it('dit quand les éléments ont tout livré', () => {
    expect(failLine(['Eau', 'Licorne'], { familyOf, unexplored: {}, rand: first })).toMatch(/ont livré tous leurs secrets\.$/);
  });
  it('ne révèle jamais un autre élément que ceux du mélange', () => {
    const line = failLine(['Eau', 'Feu'], { familyOf, unexplored: { Vapeur: 9, Eau: 2 }, rand: first });
    expect(line).not.toContain('Vapeur');
    expect(line).toContain('Eau');
  });
  it('reste lisible pour une famille inconnue ou sans aléa fourni', () => {
    expect(failLine(['Xyz', 'Abc'], {})).toMatch(/ont livré tous leurs secrets\.$/);
  });
});
