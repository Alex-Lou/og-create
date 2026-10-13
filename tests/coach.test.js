// Le coach du tutoriel (game/coach.js) : une leçon à la fois, forcée la première fois, libre ensuite ; la leçon de
// chaque étape de l'île (game/prologue.js : islandLesson)
import { describe, it, expect, beforeEach } from 'vitest';
import { coach } from '@/game/coach';
import { islandLesson, questShort, questPlan } from '@/game/prologue';

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
  it('une leçon qui se répète : chaque consigne dite une fois, le compteur suit ; une autre leçon, tout est oublié', () => {
    const steps = [{ target: '.a', text: 'A' }, { target: '.b', text: 'B' }];
    coach.show({ id: 'quest-ramasser', mode: 'world', steps, once: true, tally: { have: 0, need: 3 } });
    expect(coach.said('quest-ramasser', 1)).toBe(false);
    coach.say('quest-ramasser', 1);
    coach.show({ id: 'quest-ramasser', mode: 'world', steps, once: true, tally: { have: 1, need: 3 } });
    expect(coach.said('quest-ramasser', 1)).toBe(true);
    expect(coach.said('quest-ramasser', 0)).toBe(false);
    expect(coach.state.lesson.tally).toEqual({ have: 1, need: 3 });
    coach.show({ id: 'b', target: '.y', mode: 'world' });
    coach.show({ id: 'quest-ramasser', mode: 'world', steps, once: true, tally: { have: 1, need: 3 } });
    expect(coach.said('quest-ramasser', 1)).toBe(false);
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
    // Le jour d'Aster : un « ! » sur ce qu'il faut toucher (sa caisse, Aster elle-même, son chantier)
    expect(first({ id: 'recolte', done: false })).toBe('île:habitant:ponton');
    expect(first({ id: 'caisse', done: false })).toBe('île:caisse');
    expect(first({ id: 'premier-ponton', done: false })).toBe('île:site:ponton');
    expect(first({ id: 'premier-ponton', done: false, short: true })).toBe('île:habitant:ponton');
    expect(first({ id: 'clotures', done: false })).toBe('île:habitant:ponton');
    expect(islandLesson({ id: 'chemin-aster', done: false }).steps.map(st => st.target)[1]).toBe('île:chemin');
    expect(first({ id: 'soupe', done: false })).toBe('île:besoin:foyer');
    expect(first({ id: 'puits-ondin', done: false })).toBe('île:site:puits');
    expect(islandLesson({ id: 'soupe', done: true }).id).toBe('claim');
    expect(first({ id: 'soupe', done: true })).toBe('île:brume');
    // Hors du prologue, rien
    expect(islandLesson({ id: 'lisiere', done: false })).toBeNull();
    // L'île d'abord : la première quête se joue au Grimoire (l'Air, puis « Transmuer »)
    const pages = islandLesson({ id: 'pages', done: false });
    expect([pages.id, pages.mode]).toEqual(['quest-pages', 'infinite']);
    expect(pages.steps.map(st => st.target)).toEqual(['.book-view__shelf [data-name="Air"]', '.athanor__fuse:not(:disabled)']);
    expect(islandLesson(null)).toBeNull();
  });
  it('ramasser et les clôtures comptent (consigne dite une fois) ; la récompense : la main seule sur Brume', () => {
    expect(islandLesson({ id: 'ramasser', done: false, have: 1, need: 3 })).toMatchObject({ once: true, tally: { have: 1, need: 3 } });
    expect(islandLesson({ id: 'clotures', done: false, have: 2, need: 4 })).toMatchObject({ once: true, tally: { have: 2, need: 4 } });
    expect(islandLesson({ id: 'recolte', done: false }).once).toBeUndefined();
    const claim = islandLesson({ id: 'soupe', done: true }).steps;
    expect(claim[0]).toMatchObject({ target: 'île:brume', hush: true });
    expect(claim[0].text).toBeTruthy();
    expect(claim.slice(1).some(st => st.hush)).toBe(false);
  });
  it('un besoin se comble en touchant sa bulle ; un dormeur, toucher puis le bouton de la bulle', () => {
    // (ses coquillages d'abord, tant qu'il en reste sur le rivage : le geste le plus avancé à l'écran ; puis sa bulle)
    expect(islandLesson({ id: 'soupe', done: false }).steps.map(st => st.target)).toEqual(['île:besoin:foyer', 'île:trouvaille:coquillage', '.world__tip-btn[data-pick^="deposit:greve-coquillage"]']);
    expect(islandLesson({ id: 'eveil-ondin', done: false }).steps[1].target).toContain('[data-pick="vil:puits"]');
    // La récompense : une fiche encore ouverte se referme d'abord ; au bilan d'une Récolte, retour à l'île
    expect(islandLesson({ id: 'deco', done: true }).steps[1].target).toContain('.g-modal__close');
    expect(islandLesson({ id: 'recolte', done: true }).steps[2].target).toBe('[data-coach="harvest-close"]');
  });
  it('la première nuit : la main montre Brume (la toucher fait dormir) ; le joueur n’est jamais sans geste', () => {
    expect(islandLesson({ id: 'nuit', done: false })).toMatchObject({ id: 'quest-nuit', mode: 'world' });
    expect(first({ id: 'nuit', done: false })).toBe('île:brume');
  });
  it('ramasser sur la plage de Brumelune, bâtir le feu de camp ; le jour de Cannelle : la cage, les poules, leur poulailler', () => {
    const targets = id => islandLesson({ id, done: false }).steps.map(st => st.target);
    expect(targets('ramasser')).toEqual(['île:trouvaille', '.world__tip-btn[data-pick^="deposit:greve-"]']);
    // (le bouton pour bâtir, seulement actif)
    expect(targets('feu')).toEqual(['île:site:foyer', '.world__tip-btn[data-pick="site:foyer"]', '[data-coach="site-build"]:not(:disabled)']);
    // (la cage d'un toucher ; les poules une à une ; la bulle d'une poule qui a faim : la toucher la nourrit)
    expect([targets('cage-vue'), targets('cage'), targets('attraper'), targets('poules')]).toEqual([['île:habitant:ponton'], ['île:cage'], ['île:poule'], ['île:faim']]);
    // (la leçon des annexes : le Feu, sa fiche, l'onglet, le Poulailler, une case dorée, « Poser ici »)
    expect(targets('poulailler')).toEqual(['île:site:foyer', '.world__tip-btn[data-pick="site:foyer"]', '[data-coach="tab-annexes"]', '[data-coach="annex-poulailler"]:not(:disabled)', 'île:pose', '[data-coach="annex-confirm"]:not(:disabled)']);
  });
  it('le bâtiment de la quête demande un élément pas encore écrit : la main mène au Grimoire, par le ruban', () => {
    const lesson = islandLesson({ id: 'feu', done: false, plan: 'Brasier' });
    expect([lesson.id, lesson.mode]).toEqual(['plan-feu', 'infinite']);
    expect(lesson.steps[0]).toMatchObject({ target: '.book-view__ariane' });
    expect(lesson.steps[0].text).toContain('« Brasier »');
    expect(lesson.steps.map(st => st.target)).toContain('.athanor__fuse:not(:disabled)');
    // Écrit (plan : null) : la leçon de l'île revient
    expect(islandLesson({ id: 'feu', done: false, plan: null }).id).toBe('quest-feu');
    // Le plan se lit sur le chantier : seulement s'il n'est pas encore écrit, au palier 0
    const site = (planOwned, level = 0) => ({ sites: [{ id: 'foyer', level, next: { plan: 'Brasier', planOwned } }] });
    expect(questPlan({ id: 'feu', done: false }, site(false))).toBe('Brasier');
    expect(questPlan({ id: 'feu', done: false }, site(true))).toBeNull();
    expect(questPlan({ id: 'feu', done: false }, site(false, 1))).toBeNull();
    expect(questPlan({ id: 'soupe', done: false }, site(false))).toBeNull();
  });
  it('ce que la quête fait payer manque : la main mène d’abord à la Récolte', () => {
    expect(islandLesson({ id: 'feu', done: false, short: true })).toMatchObject({ id: 'short-feu', steps: [{ target: 'île:trouvaille' }] });
    for (const id of ['soupe', 'poules', 'puits-ondin']) {
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
    coach.show(islandLesson({ id: 'feu', done: false }));
    const lesson = coach.state.lesson;
    expect(lesson.target).toBe('île:site:foyer');
    expect([coach.stepId(lesson, 0), coach.stepId(lesson, 2)]).toEqual(['quest-feu', 'quest-feu#2']);
    expect(coach.blocks('quest-feu#1')).toBe(true);
    coach.done('quest-feu#1');
    expect(coach.blocks('quest-feu#1')).toBe(false);
    expect(coach.blocks('quest-feu')).toBe(true);
    coach.show(null);
  });
});
