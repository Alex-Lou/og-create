import { describe, expect, it, vi } from 'vitest';
import { guide, birthOf } from '../src/game/guide';
import { TIPS, questTip } from '../src/texts/guide/tips';
import { CHAPTER_IDS } from '../src/book/grimoire';

describe('les répliques de Brume', () => {
  it('une réplique pour l’arrivée, la page à portée, le premier échec, l’île, et chaque chapitre qui s’ouvre', () => {
    ['reach', 'fail', 'annexes', 'needs'].forEach(id => expect(TIPS[id].length).toBeGreaterThan(30));
    CHAPTER_IDS.filter(id => id !== 'I').forEach(id => expect(TIPS[`chapter-${id}`]).toBeTruthy());
  });
  it('une quête accomplie : son intitulé, sa récompense, et l’île pour la réclamer', () => {
    const tip = questTip({ id: 'livre5', label: 'Inscris 5 découvertes au Grimoire', coins: 60 });
    expect(tip.id).toBe('quest-livre5');
    expect(tip.text).toContain('Inscris 5 découvertes au Grimoire');
    expect(tip.text).toContain('60 écus');
    expect(tip.action).toEqual({ label: 'Aller sur l’île', mode: 'world' });
  });
});

describe('le guide', () => {
  it('dit chaque réplique une seule fois, dans l’ordre, et la retient une fois lue', () => {
    expect(guide.current).toBe(null);
    expect(guide.tip('annexes')).toBe(true);
    expect(guide.tip('annexes')).toBe(false);
    expect(guide.tip('reach')).toBe(true);
    expect(guide.tip('inconnue')).toBe(false);
    expect(guide.current.id).toBe('annexes');
    guide.dismiss();
    expect(guide.current.id).toBe('reach');
    expect(guide.tip('annexes')).toBe(false);
    guide.dismiss();
    expect(guide.current).toBe(null);
    expect(guide.state.seen.has('annexes') && guide.state.seen.has('reach')).toBe(true);
  });
  it('annonce une quête accomplie une seule fois, même redemandée', () => {
    const tip = questTip({ id: 'livre12', label: 'Inscris 12 découvertes au Grimoire', coins: 100 });
    expect(guide.say(tip)).toBe(true);
    expect(guide.say(tip)).toBe(false);
    guide.dismiss();
    expect(guide.say(tip)).toBe(false);
  });
  it('Brume naît à chaque réplique : complète quand elle paraît, courte quand elle enchaîne ; pas pour un portrait', () => {
    const saturnin = { id: 'c', text: 'Hm.', who: 'Saturnin', face: 'carriere' };
    expect(birthOf({ id: 'a', text: 'x' }, null)).toBe('full');
    expect(birthOf({ id: 'b', text: 'y' }, { id: 'a', text: 'x' })).toBe('short');
    expect(birthOf(saturnin, { id: 'b', text: 'y' })).toBeNull();
    expect(birthOf({ id: 'd', text: 'z', who: 'Brume' }, saturnin)).toBe('full');
  });
  it('au plus deux répliques à la suite : la troisième attend un souffle', () => {
    vi.useFakeTimers();
    try {
      ['a', 'b', 'c'].forEach(id => guide.say({ id: `souffle-${id}`, text: id }));
      guide.dismiss();
      expect(guide.current.id).toBe('souffle-b');
      guide.dismiss();
      expect(guide.current).toBe(null);
      expect(guide.state.resting).toBe(true);
      vi.advanceTimersByTime(2600);
      expect(guide.current.id).toBe('souffle-c');
      guide.dismiss();
      expect(guide.state.resting).toBe(false);
    } finally {
      vi.useRealTimers();
    }
  });
  it('pendant le tutoriel, seulement ce qui sert l’étape : les aides générales attendent sa fin', () => {
    guide.say({ id: 'avant', text: 'déjà là' });
    guide.tip('annexes');
    guide.setTutorial(true);
    // (l'aide générale en attente est retirée)
    expect(guide.state.queue.map(entry => entry.id)).toEqual(['avant']);
    expect(guide.tip('needs')).toBe(false);
    expect(guide.tip('fail')).toBe(true);
    expect(guide.say({ id: 'prologue-ile', text: 'Voici Brumelune' })).toBe(true);
    guide.setTutorial(false);
    expect(guide.tip('needs')).toBe(true);
  });
  it('une fenêtre ouverte : la réplique hors scénario attend, puis passe après un souffle ; le scénario passe', () => {
    vi.useFakeTimers();
    guide.forget();
    const release = guide.hold();
    expect(guide.say({ id: 'aide-coffre', text: 'Une aide.' })).toBe(true);
    expect(guide.current).toBe(null);
    // Fermée : un souffle, puis la réplique
    release();
    release();
    expect(guide.state.held).toBe(0);
    expect(guide.current).toBe(null);
    vi.advanceTimersByTime(2500);
    expect(guide.current.id).toBe('aide-coffre');
    guide.dismiss();
    // Pendant le tutoriel : le scénario passe, même fenêtre ouverte
    guide.setTutorial(true);
    const again = guide.hold();
    guide.say({ id: 'scene-veillee', text: 'Chut…' });
    expect(guide.current.id).toBe('scene-veillee');
    guide.dismiss();
    again();
    guide.setTutorial(false);
    vi.useRealTimers();
  });
  it('une réplique de l’île (la bouteille) n’est dite que sur l’île : au Grimoire, elle attend et les autres passent', () => {
    guide.forget();
    guide.setIsland(false);
    guide.say({ id: 'bouteille-ecume', text: 'Une bouteille.', island: true });
    guide.say({ id: 'aide-livre', text: 'Une page.' });
    expect(guide.current.id).toBe('aide-livre');
    guide.dismiss();
    expect(guide.current).toBe(null);
    expect(guide.state.queue.map(entry => entry.id)).toEqual(['bouteille-ecume']);
    guide.setIsland(true);
    expect(guide.current.id).toBe('bouteille-ecume');
    guide.dismiss();
    expect(guide.state.queue).toEqual([]);
    guide.forget();
  });
  it('les conseils de l’île : sur l’île seulement, un seul par arrivée, le suivant au prochain retour (choix de l’auteur, 13 oct.)', () => {
    guide.forget();
    guide.setIsland(true);
    ['friends', 'needs', 'savoirs'].forEach(id => guide.tip(id));
    expect(guide.current.id).toBe('friends');
    guide.dismiss();
    // (le suivant attend : rien d'autre à l'écran, ni ici ni au Grimoire)
    expect(guide.current).toBe(null);
    guide.setIsland(false);
    expect(guide.current).toBe(null);
    // Le Grimoire a les siens, qui passent
    guide.tip('grimoire');
    expect(guide.current.id).toBe('grimoire');
    guide.dismiss();
    // De retour sur l'île : le conseil suivant, un seul
    guide.setIsland(true);
    expect(guide.current.id).toBe('needs');
    guide.dismiss();
    expect(guide.current).toBe(null);
    expect(guide.state.queue.map(entry => entry.id)).toEqual(['savoirs']);
    guide.forget();
  });
  it('le Grimoire ouvert seul : une réplique qui dit ce qu’il est, sans lire l’interface', () => {
    expect(TIPS.grimoire.length).toBeLessThanOrEqual(140);
    expect(TIPS.grimoire).not.toMatch(/touche|bouton|Athanor/i);
  });
  it('first : une réplique passe avant ce qui attend, jamais avant celle qui est à l’écran', () => {
    guide.forget();
    guide.say({ id: 'aide-a', text: 'A' });
    guide.say({ id: 'aide-b', text: 'B' });
    guide.say({ id: 'devant', text: 'Devant' }, { first: true });
    expect(guide.state.queue.map(entry => entry.id)).toEqual(['aide-a', 'devant', 'aide-b']);
    // Une fenêtre ouverte : rien n'est à l'écran, elle passe en tête
    const release = guide.hold();
    guide.say({ id: 'tete', text: 'Tête' }, { first: true });
    expect(guide.state.queue[0].id).toBe('tete');
    release();
    guide.forget();
  });
});
