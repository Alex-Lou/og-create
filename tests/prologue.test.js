// Lot H4 (HISTOIRE.md, § 9 et § 16) : le tutoriel ne commence que pour un invité tout neuf, suit le jeu (pages
// écrites, compte, nom) et s'arrête pour de bon avec « Passer » ; ses répliques tiennent en une bulle (§ 7.4).
import { describe, it, expect } from 'vitest';
import { prologueStep, loadPrologue } from '@/game/prologue';
import { SCENES, LINES } from '@/game/prologueScenes';

const BASE = ['Eau', 'Feu', 'Terre', 'Air'];
const state = (over = {}) => ({ ...loadPrologue(), ...over });
const step = (over, loggedIn = false, elements = BASE) => prologueStep({ state: state(over), loggedIn, elements });

describe('le tutoriel', () => {
  it('ne commence que pour un invité qui n’a que les quatre Souffles', () => {
    expect(step({})).toEqual({ phase: 'start' });
    expect(step({}, true)).toBe(null);
    expect(step({}, false, [...BASE, 'Vent'])).toBe(null);
    expect(step({ skipped: true })).toBe(null);
  });
  it('étape 1 : la scène d’arrivée, puis Vent (avec la main), Pluie, et une page seul', () => {
    expect(step({ started: true })).toEqual({ phase: 'scene', scene: 'arrivee' });
    const seen = ['arrivee'];
    expect(step({ started: true, seen })).toEqual({ phase: 'vent' });
    expect(step({ started: true, seen }, false, [...BASE, 'Vent'])).toEqual({ phase: 'pluie' });
    expect(step({ started: true, seen }, false, [...BASE, 'Vent', 'Pluie'])).toEqual({ phase: 'seul' });
    // Une autre page que Vent d'abord : Brume demande encore Vent
    expect(step({ started: true, seen }, false, [...BASE, 'Boue'])).toEqual({ phase: 'vent' });
  });
  it('étape 2 : Aster, la page de garde (compte puis nom), puis la Grève', () => {
    const three = [...BASE, 'Vent', 'Pluie', 'Brasier'];
    expect(step({ started: true, seen: ['arrivee'] }, false, three)).toEqual({ phase: 'scene', scene: 'aster' });
    const seen = ['arrivee', 'aster'];
    expect(step({ started: true, seen }, false, three)).toEqual({ phase: 'name', account: true });
    expect(step({ started: true, seen, registered: true }, true, three)).toEqual({ phase: 'name', account: false });
    expect(step({ started: true, seen, registered: true, named: true }, true, three)).toEqual({ phase: 'greve' });
  });
  it('un compte ouvert autrement que par la page de garde arrête le tutoriel', () => {
    expect(step({ started: true, seen: ['arrivee'] }, true, [...BASE, 'Vent'])).toBe(null);
  });
  it('chaque réplique tient en une bulle et ne cite ni un ancien prénom ni le Livre', () => {
    const texts = [...Object.values(SCENES).flat().map(frame => frame.text || frame.caption), ...Object.values(LINES)];
    for (const text of texts) {
      expect(text.length, text).toBeLessThanOrEqual(140);
      expect(text).not.toMatch(/Paulette|Marine|Ferdinand|Anatole|Léonie|Gaspard|\bRose\b|\bLivre\b|Codex/);
    }
    // Chaque image a un dessin connu
    const ARTS = ['storm', 'beach', 'wisp', 'rock', 'fire', 'book', 'seal', 'aster'];
    expect(Object.values(SCENES).flat().every(frame => ARTS.includes(frame.art))).toBe(true);
  });
});
