// L'horloge du tutoriel (world/tutoClock.js) : son moment par étape, accéléré, jamais au-delà de sa fin
import { describe, it, expect } from 'vitest';
import { tutorialDate, MOMENTS } from '@/world/tutoClock';

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
});
