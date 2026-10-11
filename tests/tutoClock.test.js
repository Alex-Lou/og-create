// L'horloge du tutoriel (world/tutoClock.js) : son moment par étape, accéléré, jamais au-delà de sa fin
import { describe, it, expect } from 'vitest';
import { tutorialDate, MOMENTS, TUTO_SUN } from '@/world/tutoClock';
import { fixSun, skyAt, sunTimes } from '@/world/sky';

const today = new Date(2026, 9, 10, 15, 0, 0);
const hm = date => `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;

describe('l’horloge du tutoriel', () => {
  it('chaque étape a son moment ; le temps y avance d’une minute par seconde, sans dépasser sa fin', () => {
    expect(hm(tutorialDate('pages', 0, today))).toBe('17:30');
    expect(hm(tutorialDate('pages', 10000, today))).toBe('17:40');
    expect(hm(tutorialDate('pages', 3600000, today))).toBe('18:00');
    // La première nuit est la nuit ; après avoir dormi, le matin d'Aster
    expect(tutorialDate('nuit', 0, today).getHours()).toBe(21);
    expect(hm(tutorialDate('recolte', 0, today))).toBe('7:30');
  });
  it('hors du tutoriel : rien (l’heure réelle)', () => {
    expect(tutorialDate('lisiere', 0, today)).toBeNull();
    expect(tutorialDate(undefined, 0, today)).toBeNull();
  });
  it('les moments se suivent dans la journée (aucun ne finit avant de commencer)', () => {
    Object.values(MOMENTS).forEach(([from, to]) => expect(to).toBeGreaterThan(from));
  });
  it('son soleil ne suit pas la saison : 18 h affiché, c’est le couchant (retour de l’auteur, 11 oct.)', () => {
    const summer = new Date(2026, 6, 1, 18, 0, 0);
    expect(skyAt(summer).label).not.toBe('Couchant');
    fixSun(TUTO_SUN);
    try {
      expect(skyAt(summer).label).toBe('Couchant');
      expect(skyAt(tutorialDate('nuit', 0, summer)).night).toBe(1);
      expect(skyAt(tutorialDate('recolte', 0, summer)).label).toBe('Matin');
    } finally {
      fixSun(null);
    }
    expect(sunTimes(summer).set).toBeGreaterThan(20);
  });
});
