// Le coach du tutoriel (game/coach.js) : une leçon à la fois, forcée la première fois, libre ensuite ; la leçon de
// chaque étape de l'île (game/prologue.js : islandLesson)
import { describe, it, expect, beforeEach } from 'vitest';
import { coach } from '@/game/coach';
import { islandLesson, questShort } from '@/game/prologue';

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
  const first = quest => islandLesson(quest).steps[0].target;
  it('chaque quête du prologue montre son geste ; accomplie, Brume et sa récompense', () => {
    expect(islandLesson({ id: 'recolte', done: false })).toMatchObject({ id: 'quest-recolte', mode: 'world' });
    expect(first({ id: 'recolte', done: false })).toBe('.world__play');
    expect(first({ id: 'soupe', done: false })).toBe('île:habitant:foyer');
    expect(first({ id: 'achat-source', done: false })).toBe('île:quartier:source');
    expect(first({ id: 'puits-ondin', done: false })).toBe('île:site:puits');
    expect(islandLesson({ id: 'soupe', done: true }).id).toBe('claim');
    expect(first({ id: 'soupe', done: true })).toBe('île:brume');
    // Hors du prologue, rien ; une quête sans geste (les pages, au Grimoire) non plus
    expect(islandLesson({ id: 'lisiere', done: false })).toBeNull();
    expect(islandLesson({ id: 'pages', done: false })).toBeNull();
    expect(islandLesson(null)).toBeNull();
  });
  it('de l’île à la fiche : toucher, le bouton de la bulle, puis le bouton de la fiche', () => {
    const steps = islandLesson({ id: 'soupe', done: false }).steps.map(st => st.target);
    expect(steps).toHaveLength(3);
    expect(steps[1]).toContain('[data-pick="vil:foyer"]');
    expect(steps[1]).toContain('[data-pick="ask:foyer"]');
    expect(steps[2]).toContain('.friend__fill');
    expect(islandLesson({ id: 'eveil-ondin', done: false }).steps[1].target).toContain('[data-pick="vil:puits"]');
    // La récompense : une fiche encore ouverte se referme d'abord
    expect(islandLesson({ id: 'deco', done: true }).steps[1].target).toContain('.g-modal__close');
  });
  it('la v6 : ramasser sur la Grève, bâtir le feu de camp, ouvrir la cage et nourrir une poule', () => {
    const targets = id => islandLesson({ id, done: false }).steps.map(st => st.target);
    expect(targets('ramasser')).toEqual(['île:trouvaille', '.world__tip-btn[data-pick^="deposit:greve-"]']);
    // (le bouton pour bâtir, seulement actif)
    expect(targets('feu')).toEqual(['île:site:foyer', '.world__tip-btn[data-pick="site:foyer"]', '[data-coach="site-build"]:not(:disabled)']);
    const hens = targets('poules');
    expect(hens.slice(0, 3)).toEqual(['île:cage', '.world__tip-btn[data-pick="cage"]', 'île:faim']);
    expect(hens[3]).toContain('[data-pick="ask:beast:poule-rousse"]');
    // (sans vivres, le bouton est grisé : le coach ne le montre pas, la fiche dit où en trouver)
    expect(hens[4]).toBe('.beast__feed:not(:disabled)');
  });
  it('ce que la quête fait payer manque : la main mène d’abord à la Récolte', () => {
    for (const id of ['feu', 'soupe', 'poules', 'puits-ondin']) {
      expect(islandLesson({ id, done: false, short: true })).toMatchObject({ id: `short-${id}`, steps: [{ target: '.world__play' }] });
    }
    // (une quête sans rien à payer, ou accomplie, garde sa leçon)
    expect(islandLesson({ id: 'ramasser', done: false, short: true }).id).toBe('quest-ramasser');
    expect(islandLesson({ id: 'soupe', done: true, short: true }).id).toBe('claim');
    const site = (id, level, cost) => ({ id, level, next: { cost } });
    const state = {
      sites: [site('foyer', 0, { wood: 4, stone: 2 }), site('puits', 0, { stone: 10 })],
      villagers: [{ id: 'foyer', needs: [{ id: 'manger', refill: true, cost: { food: 10 } }] }],
      camp: [{ id: 'cage', art: 'cage_ouverte' }], beasts: { cost: { food: 2 } }
    };
    const short = (id, stock) => questShort({ id, done: false }, state, stock);
    expect([short('feu', { wood: 2, stone: 2 }), short('feu', { wood: 4, stone: 2 })]).toEqual([true, false]);
    expect([short('soupe', { food: 9 }), short('soupe', { food: 10 })]).toEqual([true, false]);
    expect([short('poules', { food: 1 }), short('poules', { food: 2 })]).toEqual([true, false]);
    expect(short('puits-ondin', { stone: 3 })).toBe(true);
    // La cage encore coincée : l'ouvrir ne coûte rien
    expect(questShort({ id: 'poules', done: false }, { ...state, camp: [{ id: 'cage', art: 'cage_coincee' }] }, { food: 0 })).toBe(false);
    expect(short('ramasser', {})).toBe(false);
  });
  it('chaque geste d’une leçon est forcé la première fois, puis libre', () => {
    coach.state.seen.clear();
    coach.show(islandLesson({ id: 'soupe', done: false }));
    const lesson = coach.state.lesson;
    expect(lesson.target).toBe('île:habitant:foyer');
    expect([coach.stepId(lesson, 0), coach.stepId(lesson, 2)]).toEqual(['quest-soupe', 'quest-soupe#2']);
    expect(coach.blocks('quest-soupe#1')).toBe(true);
    coach.done('quest-soupe#1');
    expect(coach.blocks('quest-soupe#1')).toBe(false);
    expect(coach.blocks('quest-soupe')).toBe(true);
    coach.show(null);
  });
});
