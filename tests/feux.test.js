// La Route des feux (world/feux.js) : quels fanaux l'île montre, et comment brûle un feu selon l'heure et le temps.
import { describe, expect, it } from 'vitest';
import { feuxOf, feuAt, flammeOf } from '@/world/feux';
import { phase } from './world/lumiere/phase';

const state = (landmarks, owned = ['neiges']) => ({
  map: { zones: [{ id: 'neiges', owned: owned.includes('neiges') }, { id: 'dunes', owned: owned.includes('dunes') }] },
  landmarks
});
const lieu = over => ({ id: 'grotte', zone: 'neiges', x: 78, y: 15, fire: true, found: true, lit: false, ...over });

describe('les fanaux que l’île montre', () => {
  it('un lieu découvert, qui a son feu, dans un quartier à soi : éteint, puis rallumé', () => {
    expect(feuxOf(state([lieu()]))).toEqual([{ id: 'grotte', x: 78, y: 15, lit: false }]);
    expect(feuxOf(state([lieu({ lit: true })]))[0].lit).toBe(true);
  });

  it('rien tant que le lieu n’est pas découvert, ni dans un quartier qu’on n’a pas, ni sans feu, ni pour un lieu inconnu', () => {
    expect(feuxOf(state([lieu({ found: false })]))).toEqual([]);
    expect(feuxOf(state([lieu()], []))).toEqual([]);
    expect(feuxOf(state([lieu({ id: 'cratere', fire: false })]))).toEqual([]);
    expect(feuxOf(state([{ id: 'pyramide', zone: 'dunes', known: false }], ['dunes']))).toEqual([]);
    expect(feuxOf(null)).toEqual([]);
  });

  it('le fanal se tient hors du dessin de son lieu, sur le devant', () => {
    const [u, v] = feuAt('grotte');
    expect(u + v).toBeGreaterThan(0);
    expect(u - v).toBeGreaterThan(1);
  });
});

describe('comment brûle un feu rallumé', () => {
  const nuit = phase({ night: 1, lit: 1, sun: { up: 0, progress: 0 } });
  const jour = phase();

  it('il brûle de jour sans éclairer grand-chose ; la nuit il porte loin', () => {
    const j = flammeOf(jour, 10, 10, 1.3), n = flammeOf(nuit, 10, 10, 1.3);
    expect(j.lumiere).toBeGreaterThan(0.2);
    expect(n.lumiere).toBeGreaterThan(j.lumiere);
    expect(n.portee).toBeGreaterThan(j.portee * 1.6);
    expect(n.braises).toBeGreaterThan(j.braises);
  });

  it('la pluie tasse la flamme, raccourcit sa lumière, éteint les braises et fait fumer', () => {
    const sec = flammeOf(nuit, 10, 10, 2), mouille = flammeOf({ ...nuit, weather: { cover: 1, rain: 1, storm: 0 } }, 10, 10, 2);
    expect(mouille.haut).toBeLessThan(sec.haut);
    expect(mouille.portee).toBeLessThan(sec.portee);
    expect(mouille.braises).toBeLessThan(sec.braises * 0.3);
    expect(mouille.fumee).toBeGreaterThan(sec.fumee);
  });

  it('elle penche avec le vent, davantage dans l’orage, sans jamais se coucher', () => {
    const at = (p, t) => flammeOf(p, 10, 10, t).penche;
    const ts = Array.from({ length: 40 }, (_, i) => i * 0.37);
    const calme = Math.max(...ts.map(t => at(jour, t)));
    const orage = Math.max(...ts.map(t => at({ ...jour, weather: { cover: 1, rain: 1, storm: 1 } }, t)));
    expect(calme).toBeGreaterThan(0);
    expect(orage).toBeGreaterThan(calme);
    expect(orage).toBeLessThanOrEqual(0.7);
  });

  it('deux feux ne battent pas ensemble ; en mouvement réduit (t = 0), la flamme est fixe', () => {
    expect(flammeOf(nuit, 10, 10, 1, 1).vif).not.toBeCloseTo(flammeOf(nuit, 10, 10, 1, 4).vif, 3);
    expect(flammeOf(nuit, 10, 10, 0, 2)).toEqual(flammeOf(nuit, 10, 10, 0, 2));
  });
});
