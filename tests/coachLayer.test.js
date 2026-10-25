import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// La bulle du coach (CoachLayer) choisit sa place sans tenir compte de sa propre hauteur : plus étroite à côté de sa
// cible, elle s'allongeait et ne tenait plus ; revenue au-dessus, elle tenait de nouveau. Elle sautait de l'une à
// l'autre à chaque image (la tuile Feu, au Brasier : retour de l'auteur, 25 oct.)
const SOURCE = readFileSync(fileURLToPath(new URL('../src/components/Guide/CoachLayer/CoachLayer.vue', import.meta.url)), 'utf8');

describe('la bulle du coach', () => {
  it('se met à côté de sa cible, ou non, sans regarder sa propre hauteur (elle ne saute plus d’une place à l’autre)', () => {
    const side = SOURCE.match(/\n {4}side\(\) \{\n([\s\S]*?)\n {4}\},/);
    expect(side).toBeTruthy();
    expect(side[1].replace(/\/\/.*$/gm, '')).not.toMatch(/sayH/);
  });
});
