// La nuit du conseil (world/lumiere/nuitDuConseil.js) : le vol de la caméra garde la nuit, puis l'île revient à son heure.
import { describe, expect, it } from 'vitest';
import { nuitVolOf, nuitDe, mixPhase, luneDuVol } from '@/world/lumiere/nuitDuConseil';

const jour = { id: 'noon', label: 'Midi', hour: 12, tint: '#ffffff', sea: ['#6cc0e6', '#3e8dbf'], cloud: '#ffffff', night: 0, warm: 0, lit: 0, sun: { progress: 0.5, up: 1 }, weather: { cover: 0.2, rain: 0.4, storm: 0 } };
const nuit = { id: 'night', label: 'Nuit', hour: 23.5, tint: '#5a68a6', sea: ['#1d3557', '#13263f'], cloud: '#8e9ac0', night: 1, warm: 0, lit: 1, sun: { progress: 1, up: 0 }, weather: { cover: 0, rain: 0, storm: 0 } };

describe('la nuit du conseil', () => {
  it('monte en moins d’une seconde au départ du vol, redescend plus doucement après le retour', () => {
    let k = nuitVolOf(null, true, 0);
    expect(k.k).toBe(0);
    k = nuitVolOf(k, true, 450);
    expect(k.k).toBeCloseTo(0.5, 2);
    k = nuitVolOf(k, true, 1000);
    expect(k.k).toBe(1);
    k = nuitVolOf(k, false, 1700);
    expect(k.k).toBeCloseTo(0.5, 2);
    k = nuitVolOf(k, false, 5000);
    expect(k.k).toBe(0);
  });

  it('d’un coup en mouvement réduit', () => {
    expect(nuitVolOf(null, true, 0, true).k).toBe(1);
    expect(nuitVolOf({ k: 1, at: 0 }, false, 16, true).k).toBe(0);
  });

  it('les deux ciels se mêlent ; le temps qu’il fait reste celui de l’heure du jeu', () => {
    expect(mixPhase(jour, nuit, 0)).toBe(jour);
    const tout = mixPhase(jour, nuit, 1);
    expect(tout.tint).toBe('#5a68a6');
    expect(tout.night).toBe(1);
    expect(tout.label).toBe('Nuit');
    expect(tout.weather).toBe(jour.weather);
    const mi = mixPhase(jour, nuit, 0.5);
    expect(mi.night).toBeCloseTo(0.5, 5);
    expect(mi.sun.up).toBeCloseTo(0.5, 5);
  });

  it('la nuit du vol est celle du même jour, en pleine nuit', () => {
    const d = nuitDe(new Date(2026, 0, 9, 12, 41));
    expect([d.getDate(), d.getHours(), d.getMinutes()]).toEqual([9, 23, 30]);
  });

  it('pendant le vol, la lune éclaire la tour (sans halo, au-dessus de son pied) ; rien sans vol ni phare', () => {
    const lune = luneDuVol(1, { x: 100, y: 900 });
    expect(lune).toMatchObject({ x: 100, gy: 900, pool: false });
    expect(lune.y).toBeLessThan(900);
    expect(luneDuVol(0, { x: 100, y: 900 })).toBe(null);
    expect(luneDuVol(1, null)).toBe(null);
  });
});
