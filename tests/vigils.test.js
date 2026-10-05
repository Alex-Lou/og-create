// Lot H5 (HISTOIRE.md, § 6.8 à 6.11 et § 16) : sept veillées jouables, une par acte fini ; l'étape de civilisation et
// le nom du peuple se déduisent des actes finis ; sur un autre appareil, seule la dernière veillée peut attendre.
import { describe, it, expect } from 'vitest';
import { ACTS, LINKS, stageOf, vigilDue, vigilFrames, linksOf } from '@/game/vigils';
import { ROLES } from '@/world/villagers';

const ARTS = ['veillee', 'rite', 'lien', 'horizon'];

describe('les veillées et la civilisation', () => {
  it('l’étape suit le dernier acte fini, avec le nom du peuple', () => {
    expect(stageOf([], null)).toBe(null);
    expect(stageOf(['T'], null)).toBe('Le Campement');
    expect(stageOf(['T', 'I'], null)).toBe('Le Camp des naufragés');
    expect(stageOf(['T', 'I', 'II', 'III'], null)).toBe('Le Village');
    expect(stageOf(['T', 'I', 'II', 'III', 'IV', 'V'], 'Les Lucioles')).toBe('Le peuple de « Les Lucioles »');
    expect(stageOf(['T', 'I', 'II', 'III', 'IV', 'V'], null)).toBe('Le peuple de « … »');
    expect(stageOf([...ACTS], null)).toBe('La Légende');
  });
  it('une veillée attend à la fin d’un acte, une seule fois ; ailleurs, seule la dernière', () => {
    expect(vigilDue(['T'], [])).toBe(null);
    expect(vigilDue(['T', 'I'], [])).toBe('I');
    expect(vigilDue(['T', 'I'], ['I'])).toBe(null);
    expect(vigilDue(['T', 'I', 'II', 'III'], [])).toBe('III');
  });
  it('les sept veillées se jouent : rite, liens, étape, et le nom du peuple aux veillées V et VII', () => {
    for (const act of ACTS) {
      const frames = vigilFrames(act, { people: 'Les Lucioles' });
      expect(frames.length, act).toBeGreaterThan(2);
      expect(frames.every(frame => ARTS.includes(frame.art)), act).toBe(true);
      for (const frame of frames) expect((frame.text || '').length, frame.text).toBeLessThanOrEqual(140);
      // La dernière image annonce l'étape
      expect(frames[frames.length - 1].art).toBe('horizon');
    }
    expect(vigilFrames('V', { people: 'Les Lucioles' }).some(frame => /Les Lucioles/.test(frame.text))).toBe(true);
    expect(vigilFrames('VII', { people: 'Les Lucioles' }).some(frame => /Les Lucioles/.test(frame.text))).toBe(true);
    // Les nouveaux venus se présentent : Sylve à la veillée I
    expect(vigilFrames('I').some(frame => frame.who === 'Sylve')).toBe(true);
  });
  it('les neuf liens réunissent des naufragés de la troupe, chacun avec sa recette', () => {
    expect(LINKS.length).toBe(9);
    for (const link of LINKS) {
      expect(link.cast.every(id => ROLES[id]), link.id).toBe(true);
      expect(link.recipe, link.id).toMatch(/=/);
      expect(ACTS).toContain(link.act);
    }
    expect(linksOf(['T', 'I']).map(link => link.id)).toEqual(['vie', 'soupe']);
  });
});
