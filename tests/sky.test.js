import { describe, it, expect } from 'vitest';
import { slotKind } from '@/world/sky';

// La météo de l'île : même vecteur que test/nights.test.js côté serveur (services/weather.js) ; si l'un change, la
// pluie que le serveur compte la nuit n'est plus celle que le jeu montre
describe('la météo de l’île, partagée avec le serveur', () => {
  it('le temps des créneaux de 6 h, jour par jour', () => {
    const days = Array.from({ length: 12 }, (_, i) => [0, 1, 2, 3].map(slot => slotKind(280 + i, slot)[0]).join(''));
    expect(days.join(' ')).toBe('ccbc vccc cvvc vvvv vvvv pppv vccv bcbb vccc vpvv cccc bccb');
  });
});
