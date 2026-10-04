import { describe, expect, it } from 'vitest';
import { guide } from '../src/game/guide';
import { TIPS, questTip } from '../src/game/guideTips';
import { CHAPTER_IDS } from '../src/book/grimoire';

describe('les répliques de Brume', () => {
  it('une réplique pour l’arrivée, la page à portée, le premier échec, l’île, et chaque chapitre qui s’ouvre', () => {
    ['welcome', 'reach', 'fail', 'island'].forEach(id => expect(TIPS[id].length).toBeGreaterThan(30));
    CHAPTER_IDS.filter(id => id !== 'I').forEach(id => expect(TIPS[`chapter-${id}`]).toBeTruthy());
  });
  it('une quête accomplie : son intitulé, sa récompense, et l’île pour la réclamer', () => {
    const tip = questTip({ id: 'livre5', label: 'Inscris 5 découvertes au Livre', coins: 60 });
    expect(tip.id).toBe('quest-livre5');
    expect(tip.text).toContain('Inscris 5 découvertes au Livre');
    expect(tip.text).toContain('60 écus');
    expect(tip.action).toEqual({ label: 'Aller sur l’île', mode: 'world' });
  });
});

describe('le guide', () => {
  it('dit chaque réplique une seule fois, dans l’ordre, et la retient une fois lue', () => {
    expect(guide.current).toBe(null);
    expect(guide.tip('welcome')).toBe(true);
    expect(guide.tip('welcome')).toBe(false);
    expect(guide.tip('reach')).toBe(true);
    expect(guide.tip('inconnue')).toBe(false);
    expect(guide.current.id).toBe('welcome');
    guide.dismiss();
    expect(guide.current.id).toBe('reach');
    expect(guide.tip('welcome')).toBe(false);
    guide.dismiss();
    expect(guide.current).toBe(null);
    expect(guide.state.seen.has('welcome') && guide.state.seen.has('reach')).toBe(true);
  });
  it('annonce une quête accomplie une seule fois, même redemandée', () => {
    const tip = questTip({ id: 'livre12', label: 'Inscris 12 découvertes au Livre', coins: 100 });
    expect(guide.say(tip)).toBe(true);
    expect(guide.say(tip)).toBe(false);
    guide.dismiss();
    expect(guide.say(tip)).toBe(false);
  });
  it('Brume ne naît qu’une fois', () => {
    expect(guide.state.born).toBe(false);
    guide.markBorn();
    expect(guide.state.born).toBe(true);
  });
});
