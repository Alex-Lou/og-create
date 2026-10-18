// La case d'une bête sauvage (world/village/wild.js : wildPainter) : tirée pour toute sa sortie, elle n'en change que
// hors de la vue (régression du 18 oct. : tirée à chaque heure de l'île, la bête disparaissait d'un coup pour reparaître
// ailleurs, sous les yeux du joueur)
import { describe, it, expect } from 'vitest';
import { wildPainter } from '@/world/village/wild';

const cells = Array.from({ length: 40 }, (_, i) => ({ x: i, y: 0 }));
// La case où se tient la bête à l'heure h du jour de l'île islandDay (day : le jour réel)
const at = (turn, islandDay, h, day = 20000) => {
  const out = [];
  const { wild } = wildPainter({ t: 0, h, day, islandDay, tapped: () => null, out }, false);
  wild('wild:essai', 'deer', cells, true, turn, c => ({ ...c, frame: 0, flip: false }));
  return out[0].x;
};

describe('la case d’une bête sauvage', () => {
  it('une bête du jour garde sa case toute la journée de l’île ; elle en change d’un jour à l’autre', () => {
    const hours = [6, 9, 12, 15, 18, 20];
    expect(new Set(hours.map(h => at('jour', 100, h))).size).toBe(1);
    expect(new Set([100, 101, 102, 103, 104].map(d => at('jour', d, 9))).size).toBeGreaterThan(1);
  });
  it('une bête de la nuit garde sa case du soir au matin, minuit passé', () => {
    const night = [[100, 18], [100, 21], [100, 23.9], [101, 0.5], [101, 3], [101, 6]].map(([d, h]) => at('nuit', d, h));
    expect(new Set(night).size).toBe(1);
  });
  it('une bête toujours là garde sa case tout le jour réel, quelles que soient l’heure et la journée de l’île', () => {
    expect(new Set([[100, 3], [100, 15], [101, 9], [107, 22]].map(([d, h]) => at('toujours', d, h))).size).toBe(1);
  });
});
