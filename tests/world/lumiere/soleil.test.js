// Une seule convention pour le côté du soleil (world/lumiere/soleil.js) : le soleil se lève à l'est, à droite de
// l'écran, et se couche à l'ouest, à gauche. Les ombres, l'heure dorée et son liseré, la lueur du soleil bas, son chemin
// sur la mer, les éclats du phare et les rayons le mettent tous du même côté, à toute heure du jour, sur l'horloge de
// l'île comme sur celle du tutoriel.
import { describe, it, expect, afterEach } from 'vitest';
import { soleilOf } from '@/world/lumiere/soleil';
import { shadowLight } from '@/world/lumiere/ombres';
import { goldenOf } from '@/world/lumiere/heureDoree';
import { raysFrom } from '@/world/lumiere/ambiance';
import { glitterOf } from '@/world/rivage';
import { lueurAt } from '@/world/scene';
import { refletDuPhare } from '@/world/phareLumiere';
import { skyAt, fixSun } from '@/world/sky';
import { GAME_SUN } from '@/world/gameClock';
import { TUTO_SUN } from '@/world/tutoClock';
import { phase } from './phase';

const at = progress => phase({ sun: { up: Math.sin(Math.PI * progress), progress } });
const now = new Date(Date.UTC(2026, 9, 18, 12));
// Le côté où chaque effet met le soleil : 1 à droite, -1 à gauche
function cotes(ph) {
  const glitter = glitterOf(ph, now);
  return {
    // (l'ombre tombe à l'opposé de la lumière)
    ombres: -Math.sign(shadowLight(ph, now).dx),
    heureDoree: goldenOf(ph).side,
    lueur: Math.sign(lueurAt(ph.sun) - 0.5),
    mer: Math.sign(glitter.at - 0.5),
    phare: refletDuPhare(ph, glitter).eclat.cote,
    // (un rayon qui part vers la gauche vient de la droite)
    rayons: -Math.sign(Math.cos(raysFrom(ph).ang))
  };
}

describe('le côté du soleil', () => {
  afterEach(() => fixSun(null));

  it('à droite le matin, au sud à midi, à gauche le soir', () => {
    expect(soleilOf({ progress: 0 })).toMatchObject({ est: 1, cote: 1 });
    expect(soleilOf({ progress: 0.5 }).est).toBeCloseTo(0);
    expect(soleilOf({ progress: 0.5 }).sud).toBeCloseTo(1);
    expect(soleilOf({ progress: 1 })).toMatchObject({ est: -1, cote: -1 });
  });

  it('chaque effet met le soleil du même côté, à toute heure du jour', () => {
    for (let p = 0.02; p < 0.99; p += 0.04) {
      if (Math.abs(p - 0.5) < 0.03) continue;
      const cote = p < 0.5 ? 1 : -1;
      const all = cotes(at(p));
      expect(all, `progress ${p.toFixed(2)}`).toEqual({ ombres: cote, heureDoree: cote, lueur: cote, mer: cote, phare: cote, rayons: cote });
    }
  });

  it('sur l’horloge de l’île comme sur celle du tutoriel', () => {
    for (const [sun, matin, soir] of [[GAME_SUN, 7.5, 18.5], [TUTO_SUN, 8, 17.3]]) {
      fixSun(sun);
      const day = h => skyAt(new Date(2026, 9, 18, Math.floor(h), Math.round((h % 1) * 60)), { weather: 'clair' });
      expect(soleilOf(day(matin).sun).cote).toBe(1);
      expect(soleilOf(day(soir).sun).cote).toBe(-1);
      expect(goldenOf(day(soir)).side).toBe(-1);
    }
  });
});
