// L'arrivée sur l'île (game/loading.js, IslandLoader) : ses étapes dans le ton du jeu, leurs comptes, et la part du
// chemin faite, d'après ce que l'île a déjà prêt (WorldView : loading).
import { describe, it, expect } from 'vitest';
import { islandSteps, islandShare } from '@/game/loading';

describe('l’arrivée sur l’île', () => {
  it('avant tout : rien de fait ; le code arrivé, la première étape est cochée', () => {
    expect(islandSteps({}).every(step => !step.done)).toBe(true);
    expect(islandShare({})).toBe(0);
    const steps = islandSteps({ code: true });
    expect(steps.map(step => step.done)).toEqual([true, false, false, false, false, false]);
    expect(steps[4].label).toBe('Les bâtiments sortent de la brume');
  });

  it('chaque groupe compté : ses dessins prêts sur demandés ; un groupe absent d’une image comptée n’attend rien', () => {
    const progress = { code: true, map: true, sol: [12, 16], decor: [80, 96], batiments: [14, 14] };
    const steps = islandSteps(progress);
    expect(steps.map(step => step.count)).toEqual([null, null, [12, 16], [80, 96], [14, 14], null]);
    expect(steps.map(step => step.done)).toEqual([true, true, false, false, true, true]);
    expect(islandShare(progress)).toBeCloseTo((1 + 1 + 12 / 16 + 80 / 96 + 1 + 1) / 6);
  });

  it('tout prêt : tout coché, la barre pleine', () => {
    const progress = { code: true, map: true, sol: [16, 16], decor: [96, 96], batiments: [14, 14], vivants: [7, 7] };
    expect(islandSteps(progress).every(step => step.done)).toBe(true);
    expect(islandShare(progress)).toBe(1);
  });
});
