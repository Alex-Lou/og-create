// L'arc du Phare dans le jeu (choix de l'auteur, 15 oct. : ecriture/arc_phare.md ; répliques : lot 08, validé) : la
// courbe du vol de la caméra du conseil, les scènes (six bulles au plus), ce que disent les lieux au feu rallumé
import { describe, it, expect } from 'vitest';
import { along, ease, softPath } from '@/world/flight';
import { SCENES } from '@/texts/tutorial/scenes';
import { FIRE_LINES, FIRST_FIRE, FIRE } from '@/texts/world/phare';
import { NAMES } from '@/world/faces';

// Les lieux remarquables qui ont un feu (serveur : landmarks.hasFire ; le Lac de lave n'en a pas)
const FIRES = ['grotte', 'lac', 'col', 'menhirs', 'arche', 'saule', 'pilotis', 'oasis', 'pyramide', 'arbre', 'cascade', 'geyser'];

describe('le vol du conseil', () => {
  it('la courbe part du premier point, passe par chacun, finit au dernier', () => {
    const pts = [{ x: 0, y: 0 }, { x: 100, y: 40 }, { x: 220, y: -30 }, { x: 400, y: 10 }];
    expect(along(pts, 0)).toEqual({ x: 0, y: 0 });
    expect(along(pts, 1)).toEqual({ x: 400, y: 10 });
    const mid = along(pts, 1 / 3);
    expect([Math.round(mid.x), Math.round(mid.y)]).toEqual([100, 40]);
    expect(along([{ x: 5, y: 6 }], 0.5)).toEqual({ x: 5, y: 6 });
    expect([ease(0), ease(0.5), ease(1)]).toEqual([0, 0.5, 1]);
  });
  it('le trajet adouci garde ses bouts et son ordre, et tire les quartiers à mi-chemin de la ligne droite', () => {
    const soft = softPath([{ x: 0, y: 0 }, { x: 50, y: 100 }, { x: 100, y: -100 }, { x: 200, y: 0 }]);
    expect([soft[0], soft[3]]).toEqual([{ x: 0, y: 0 }, { x: 200, y: 0 }]);
    expect([soft[1].y, soft[2].y]).toEqual([50, -50]);
    expect(soft[1].x).toBeLessThan(soft[2].x);
  });
});

describe('les scènes de l’arc', () => {
  const bubbles = id => SCENES[id].filter(frame => frame.text).length;
  it('le conseil : le geste de la bûche, puis deux fois trois bulles ; la traversée, six bulles au plus', () => {
    expect(SCENES.conseil[0].gesture.label).toBe('Remettre une bûche dans le feu');
    expect([bubbles('conseil'), bubbles('conseil-suite')]).toEqual([3, 3]);
    expect(bubbles('traversee')).toBeLessThanOrEqual(6);
  });
});

describe('la Route des feux', () => {
  it('chaque réplique appartient à un lieu qui a un feu, parle par un maître, Brume ou un carnet, et tient en 140 caractères', () => {
    const lines = Object.entries(FIRE_LINES).flatMap(([id, entry]) => {
      expect(FIRES, id).toContain(id);
      return Array.isArray(entry) ? entry : [...entry.before, ...entry.after];
    });
    for (const line of [...lines, FIRST_FIRE]) {
      expect(line.who === 'brume' || Boolean(NAMES[line.who]) || /^Le carnet/.test(line.who), line.who).toBe(true);
      expect(line.text.length, line.text).toBeLessThanOrEqual(140);
    }
    expect(FIRE.done('L’Arche')).toContain('L’Arche');
  });
});
