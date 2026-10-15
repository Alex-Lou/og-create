import { describe, it, expect } from 'vitest';
import { phareOmbre, refletDuPhare, eclatsDuReflet, PROFIL } from '@/world/phareLumiere';
import { shadowLight } from '@/world/lumiere/ombres';
import { glitterOf } from '@/world/rivage';
import { phase } from './lumiere/phase';

const now = new Date(Date.UTC(2000, 0, 21, 12)); // pleine lune
// le reflet, comme l'appellera la boucle : l'éclat de la mer calculé par rivage.js
const reflet = (ph, ...rest) => refletDuPhare(ph, glitterOf(ph, now), ...rest);
const loin = poly => Math.max(...poly.map(([x, y]) => Math.hypot(x, y)));

describe('ombre du phare', () => {
  it('part dans le sens de la lumière, à toute la hauteur du phare', () => {
    const light = shadowLight(phase({ sun: { up: 0.3, progress: 0.9 } }), now);
    const poly = phareOmbre(light);
    const top = PROFIL[PROFIL.length - 1][0];
    const bout = poly[Math.floor(poly.length / 2)];
    expect(Math.sign(bout[0])).toBe(Math.sign(light.dx));
    expect(Math.hypot(...bout)).toBeGreaterThan(Math.hypot(light.dx, light.dy) * top * 0.9);
  });

  it('longue le soir, courte à midi ; rien sans lumière', () => {
    const soir = phareOmbre(shadowLight(phase({ sun: { up: 0.15, progress: 0.9 } }), now));
    const midi = phareOmbre(shadowLight(phase({ sun: { up: 1, progress: 0.5 } }), now));
    expect(loin(soir)).toBeGreaterThan(loin(midi) * 1.5);
    expect(phareOmbre(null)).toBeNull();
  });

  it('suit le soleil : à l\'opposé le matin et le soir', () => {
    const matin = phareOmbre(shadowLight(phase({ sun: { up: 0.3, progress: 0.1 } }), now));
    const soir = phareOmbre(shadowLight(phase({ sun: { up: 0.3, progress: 0.9 } }), now));
    expect(matin[Math.floor(matin.length / 2)][0]).toBeLessThan(0);
    expect(soir[Math.floor(soir.length / 2)][0]).toBeGreaterThan(0);
  });
});

describe('reflet du phare', () => {
  it('prend le bleu du ciel le jour, l\'or au couchant, l\'argent sous la lune', () => {
    const jour = reflet(phase({ sun: { up: 0.8, progress: 0.5 } }));
    const couchant = reflet(phase({ sun: { up: 0.08, progress: 0.95 } }));
    const lune = reflet(phase({ sun: { up: 0, progress: 1 }, night: 1 }));
    const [rj, , bj] = jour.tint.split(',').map(Number), [rc, , bc] = couchant.tint.split(',').map(Number), [rl, , bl] = lune.tint.split(',').map(Number);
    expect(bj).toBeGreaterThan(rj);
    expect(rc).toBeGreaterThan(bc);
    expect(bl).toBeGreaterThan(rl);
    expect(lune.alpha).toBeLessThan(jour.alpha);
  });

  it('se brise sous la pluie, s\'éclaire à l\'éclair', () => {
    const sec = reflet(phase({ sun: { up: 0.8, progress: 0.5 } }));
    const pluie = reflet(phase({ sun: { up: 0.8, progress: 0.5 }, weather: { cover: 0.8, rain: 1, storm: 0 } }));
    const eclair = reflet(phase({ sun: { up: 0, progress: 1 }, night: 1 }), { flash: 1, x: 0.8 });
    expect(pluie.alpha).toBeLessThan(sec.alpha * 0.5);
    expect(eclair.alpha).toBeGreaterThan(0.7);
    expect(eclair.eclat.cote).toBe(1);
  });

  it('l\'éclat vient du côté du soleil', () => {
    const matin = reflet(phase({ sun: { up: 0.4, progress: 0.15 } }));
    const soir = reflet(phase({ sun: { up: 0.4, progress: 0.85 } }));
    expect(matin.eclat.cote).toBe(-1);
    expect(soir.eclat.cote).toBe(1);
    expect(matin.eclat.force).toBeGreaterThan(0);
  });
});

describe('éclats du reflet', () => {
  it('scintillent du côté de la source, et s\'éteignent sans elle', () => {
    const soir = refletDuPhare(phase({ sun: { up: 0.4, progress: 0.85 } }), glitterOf(phase({ sun: { up: 0.4, progress: 0.85 } }), now));
    const e = eclatsDuReflet(soir, 1.3);
    expect(e.length).toBeGreaterThan(0);
    expect(e.filter(p => p.x > 0).length).toBeGreaterThan(e.length / 2);
    expect(eclatsDuReflet({ eclat: { force: 0 } }, 1)).toEqual([]);
  });
});
