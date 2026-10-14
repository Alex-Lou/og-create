import { describe, it, expect } from 'vitest';
import { fxOf, stepOf, startOf, DEAL_MS } from '@/game/chestFx';

// Le spectacle de « Tout ouvrir »
describe('le spectacle de « Tout ouvrir »', () => {
  it('donne un mot féerique à chaque rareté, et un repli pour une rareté inconnue', () => {
    expect(fxOf('commun').word).toBe('Joli !');
    expect(fxOf('legendaire').word).toBe('Féerique !');
    expect(fxOf('legendaire').flash).toBeTruthy();
    expect(fxOf('???')).toBe(fxOf('commun'));
  });
  it('tient la rafale en moins de 3 s, même avec beaucoup de coffres', () => {
    expect(stepOf(1)).toBe(650);
    expect(stepOf(20)).toBe(240);
    expect(startOf(0, 4)).toBe(DEAL_MS);
    expect(startOf(9, 10) - DEAL_MS).toBeLessThanOrEqual(2600);
  });
});
