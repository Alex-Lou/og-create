// Le coach du tutoriel (game/coach.js) : une leçon à la fois, forcée la première fois, libre ensuite ; la leçon de
// chaque étape de l'île (game/prologue.js : islandLesson)
import { describe, it, expect, beforeEach } from 'vitest';
import { coach } from '@/game/coach';
import { islandLesson } from '@/game/prologue';

describe('le coach', () => {
  beforeEach(() => {
    coach.show(null);
    coach.state.seen.clear();
  });
  it('un geste jamais fait est forcé ; fait, la même leçon revient libre', () => {
    coach.show({ id: 'claim', target: 'île:brume', mode: 'world' });
    expect(coach.state.lesson.block).toBe(true);
    coach.done('claim');
    expect(coach.state.lesson.block).toBe(false);
    coach.show(null);
    coach.show({ id: 'claim', target: 'île:brume', mode: 'world' });
    expect(coach.state.lesson.block).toBe(false);
  });
  it('une seule leçon à la fois ; la même leçon montrée deux fois ne repart pas de zéro', () => {
    coach.show({ id: 'a', target: '.x', mode: 'world' });
    const first = coach.state.lesson;
    coach.show({ id: 'a', target: '.x', mode: 'world' });
    expect(coach.state.lesson).toBe(first);
    coach.show({ id: 'b', target: '.y', mode: 'world' });
    expect(coach.state.lesson.id).toBe('b');
    coach.clear('a');
    expect(coach.state.lesson.id).toBe('b');
    coach.clear('b');
    expect(coach.state.lesson).toBeNull();
  });
  it('une cible absente de l’écran n’a pas de rectangle (rien ne se montre ni ne bloque)', () => {
    expect(coach.rectOf('île:brume')).toBeNull();
    const off = coach.island(name => (name === 'brume' ? { x: 10, y: 20, w: 40, h: 40 } : null));
    expect(coach.rectOf('île:brume')).toMatchObject({ x: 10, y: 20, w: 40, h: 40 });
    expect(coach.rectOf('île:site:puits')).toBeNull();
    off();
    expect(coach.rectOf('île:brume')).toBeNull();
  });
});

describe('les leçons de l’île', () => {
  it('chaque quête du prologue montre son geste ; accomplie, Brume et sa récompense', () => {
    expect(islandLesson({ id: 'recolte', done: false })).toMatchObject({ id: 'quest-recolte', target: '.world__play', mode: 'world' });
    expect(islandLesson({ id: 'soupe', done: false }).target).toBe('île:habitant:foyer');
    expect(islandLesson({ id: 'achat-source', done: false }).target).toBe('île:quartier:source');
    expect(islandLesson({ id: 'puits-ondin', done: false }).target).toBe('île:site:puits');
    expect(islandLesson({ id: 'soupe', done: true })).toMatchObject({ id: 'claim', target: 'île:brume' });
    // Hors du prologue, rien ; une quête sans geste (les pages, au Grimoire) non plus
    expect(islandLesson({ id: 'lisiere', done: false })).toBeNull();
    expect(islandLesson({ id: 'pages', done: false })).toBeNull();
    expect(islandLesson(null)).toBeNull();
  });
});
