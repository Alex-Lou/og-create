// L'horloge du tutoriel (world/tutoClock.js) : son moment par étape, accéléré, jamais au-delà de sa fin
import { describe, it, expect } from 'vitest';
import { tutorialDate, tutorialDay, MOMENTS, TUTO_SUN } from '@/world/tutoClock';
import { PROLOGUE } from '@/game/prologue';
import { fixSun, skyAt, sunTimes } from '@/world/sky';

const today = new Date(2026, 9, 10, 15, 0, 0);
const hm = date => `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;

describe('l’horloge du tutoriel', () => {
  it('chaque étape a son moment ; le temps y avance d’une minute par seconde, sans dépasser sa fin', () => {
    expect(hm(tutorialDate('pages', 0, today))).toBe('18:54');
    expect(hm(tutorialDate('pages', 5000, today))).toBe('18:59');
    expect(hm(tutorialDate('pages', 3600000, today))).toBe('19:06');
    // La première nuit est la nuit ; après avoir dormi, le matin de Lorena
    expect(tutorialDate('nuit', 0, today).getHours()).toBe(21);
    expect(hm(tutorialDate('caisse', 0, today))).toBe('7:30');
    // Le jour de Lorena : l'heure avance à chaque étape, jusqu'au soir autour du feu
    expect(['caisse', 'recolte', 'premier-ponton', 'chemin-aster', 'clotures', 'veille'].map(id => tutorialDate(id, 0, today).getHours())).toEqual([7, 10, 12, 14, 16, 19]);
    // Le jour d’Agathe de même, jusqu'à la troisième nuit ; Nathan au matin
    expect(['soupe', 'cage', 'poules', 'poulailler', 'nuit-cannelle', 'deco'].map(id => tutorialDate(id, 0, today).getHours())).toEqual([8, 11, 12, 14, 19, 8]);
    // Le jour de Nathan finit par la quatrième nuit ; Léo au matin suivant, jamais le même jour (choix de l'auteur, 13 oct.)
    expect(['deco', 'torches-rivet', 'outil-rivet', 'nuit-rivet', 'eveil-ondin', 'souvenir-ondin', 'puits-ondin', 'chemin'].map(id => tutorialDate(id, 0, today).getHours())).toEqual([8, 11, 14, 19, 8, 10, 12, 15]);
  });
  it('chaque quête du prologue a son moment (l’île ne retombe jamais sur l’heure réelle en plein tutoriel)', () => {
    for (const id of PROLOGUE) expect(MOMENTS[id], id).toBeTruthy();
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
      // Le premier soir : l'arrivée au crépuscule, le feu en pleine nuit
      expect(skyAt(tutorialDate('pages', 0, summer)).label).toBe('Crépuscule');
      expect(skyAt(tutorialDate('feu', 0, summer)).night).toBe(1);
      expect(skyAt(tutorialDate('caisse', 0, summer)).label).toBe('Matin');
    } finally {
      fixSun(null);
    }
    expect(sunTimes(summer).set).toBeGreaterThan(20);
  });
  it('le jour de chaque étape (le compteur de jours) : un par personnage, un de plus à chaque matin', () => {
    expect(['pages', 'nuit', 'caisse', 'veille', 'soupe', 'nuit-cannelle', 'deco', 'outil-rivet', 'nuit-rivet', 'eveil-ondin', 'chemin'].map(tutorialDay)).toEqual([1, 1, 2, 2, 3, 3, 4, 4, 4, 5, 5]);
    expect(tutorialDay('acte-1')).toBe(null);
    expect(tutorialDay(null)).toBe(null);
  });
});
