// Les poses de travail de la bibliothèque : au travail sur son annexe, un maître prend le geste de son métier
import { describe, it, expect } from 'vitest';
import { masterSprite } from '@/world/masterArt';

describe('les gestes de métier des maîtres', () => {
  it('au travail avec un geste : son dessin ; sans geste, ou s’il ne l’a pas, le travail ordinaire', () => {
    expect(masterSprite('potager', false, { pose: 'work', chore: 'becher' }).key).toMatch(/^lib-melisse_avant_becher_1$/);
    expect(masterSprite('bosquet', false, { pose: 'work', chore: 'tailler', view: 'ne', frame: 1 }).key).toMatch(/^lib-sylve_dos_tailler_2$/);
    expect(masterSprite('potager', false, { pose: 'work' }).key).toMatch(/_avant_travail_1$/);
    expect(masterSprite('potager', false, { pose: 'work', chore: 'inconnu' }).key).toMatch(/_avant_travail_1$/);
    // (en marchant, le geste ne compte pas)
    expect(masterSprite('potager', false, { pose: 'walk', chore: 'becher' }).key).toMatch(/_avant_marche_1$/);
  });
});
