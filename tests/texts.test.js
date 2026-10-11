// Les textes rangés à part (src/texts/) : chaque geste du coach du tutoriel a sa phrase (une clé mal tapée donnerait
// undefined), y compris les gestes du Grimoire, ce qui manque (la Récolte d'abord) et la récompense
import { describe, it, expect } from 'vitest';
import { islandLesson, PROLOGUE } from '@/game/prologue';

const texts = lesson => lesson.steps.map(step => step.text);
const real = text => typeof text === 'string' && text.trim().length > 10;

describe('les textes du coach', () => {
  it('chaque leçon d’une quête du tutoriel a une phrase par geste (la première page : l’Air, sans phrase, dite par le Grimoire)', () => {
    for (const id of PROLOGUE) {
      const lesson = islandLesson({ id, done: false });
      if (!lesson) continue;
      const said = id === 'pages' ? texts(lesson).slice(1) : texts(lesson);
      expect(said.every(real), id).toBe(true);
    }
  });
  it('les gestes du Grimoire (un plan à écrire), ce qui manque et la récompense', () => {
    for (const id of ['feu', 'puits-ondin', 'premier-ponton']) {
      expect(texts(islandLesson({ id, done: false, plan: 'Brasier' })).every(real), `plan ${id}`).toBe(true);
    }
    for (const id of ['feu', 'soupe', 'poules', 'puits-ondin', 'premier-ponton']) {
      expect(texts(islandLesson({ id, done: false, short: true })).every(real), `short ${id}`).toBe(true);
    }
    expect(texts(islandLesson({ id: 'feu', done: true })).every(real)).toBe(true);
  });
  it('le plan et l’Encre se disent avec leur élément', () => {
    const [ariane, , ink] = texts(islandLesson({ id: 'feu', done: false, plan: 'Brasier' }));
    expect(ariane).toContain('« Brasier »');
    expect(ink).toContain('pour ce chantier');
  });
});
