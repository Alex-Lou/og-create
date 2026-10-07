// Lot H4 (HISTOIRE.md, § 9 et § 16) : le tutoriel ne commence que pour un invité tout neuf, suit le jeu (pages
// écrites, compte, nom) et s'arrête pour de bon avec « Passer » ; ses répliques tiennent en une bulle (§ 7.4).
import { describe, it, expect } from 'vitest';
import { prologueStep, islandStep, loadPrologue } from '@/game/prologue';
import { SCENES, LINES } from '@/game/prologueScenes';
import { sceneOf } from '@/game/sceneArt';

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
  it('étapes 1 à 3 : seul sur la Grève, la carte d’embarquement (l’avatar), puis Brume et le livre', () => {
    expect(step({ started: true })).toEqual({ phase: 'scene', scene: 'naufrage' });
    expect(step({ started: true, seen: ['naufrage'] })).toEqual({ phase: 'avatar' });
    expect(step({ started: true, seen: ['naufrage'], look: 'avatar-03' })).toEqual({ phase: 'scene', scene: 'arrivee' });
    // Un appareil qui a vu l'arrivée d'avant ne revient pas en arrière (ni naufrage ni carte)
    expect(step({ started: true, seen: ['arrivee'] })).toEqual({ phase: 'vent' });
  });
  it('les trois premières pages : Vent (avec la main), le vent qui se lève, Pluie, et une page seul', () => {
    const seen = ['naufrage', 'arrivee'];
    expect(step({ started: true, seen })).toEqual({ phase: 'vent' });
    expect(step({ started: true, seen }, false, [...BASE, 'Vent'])).toEqual({ phase: 'scene', scene: 'souffle' });
    seen.push('souffle');
    expect(step({ started: true, seen }, false, [...BASE, 'Vent'])).toEqual({ phase: 'pluie' });
    expect(step({ started: true, seen }, false, [...BASE, 'Vent', 'Pluie'])).toEqual({ phase: 'seul' });
    // Une autre page que Vent d'abord : Brume demande encore Vent
    expect(step({ started: true, seen }, false, [...BASE, 'Boue'])).toEqual({ phase: 'vent' });
  });
  it('après trois pages : le sceau et le feu, la page de garde (compte puis nom), puis la Grève', () => {
    const three = [...BASE, 'Vent', 'Pluie', 'Brasier'];
    expect(step({ started: true, seen: ['arrivee', 'souffle'] }, false, three)).toEqual({ phase: 'scene', scene: 'sceau' });
    // « aster » : l'ancien nom de la scène, déjà vue sur certains appareils
    expect(step({ started: true, seen: ['arrivee', 'aster'] }, false, three)).toEqual({ phase: 'name', account: true });
    const seen = ['arrivee', 'souffle', 'sceau'];
    expect(step({ started: true, seen }, false, three)).toEqual({ phase: 'name', account: true });
    expect(step({ started: true, seen, registered: true }, true, three)).toEqual({ phase: 'name', account: false });
    expect(step({ started: true, seen, registered: true, named: true }, true, three)).toEqual({ phase: 'greve' });
  });
  it('un compte ouvert autrement que par la page de garde arrête le tutoriel', () => {
    expect(step({ started: true, seen: ['arrivee'] }, true, [...BASE, 'Vent'])).toBe(null);
  });
  it('étapes 2 à 5 sur l’île : chaque quête du prologue a sa scène, ses répliques, puis Le Campement', () => {
    const ready = { started: true, registered: true, named: true, seen: ['arrivee', 'aster'] };
    const island = (quest, seen = []) => islandStep({ state: state({ ...ready, seen: [...ready.seen, ...seen] }), quest });
    // Pas avant le nom, ni après « Passer »
    expect(islandStep({ state: state({ ...ready, named: false }), quest: { id: 'recolte' } })).toBe(null);
    expect(islandStep({ state: state({ ...ready, skipped: true }), quest: { id: 'recolte' } })).toBe(null);
    expect(island({ id: 'pages', done: true })).toEqual({ phase: 'scene', scene: 'recolte' });
    const all = ['recolte', 'cannelle', 'rivet', 'ondin'];
    expect(island({ id: 'pages', done: true }, all)).toEqual({ phase: 'lines', lines: ['claim'] });
    expect(island({ id: 'recolte', done: false }, all)).toEqual({ phase: 'harvest' });
    expect(island({ id: 'recolte', done: true }, all)).toEqual({ phase: 'lines', lines: ['chaine', 'claim'] });
    expect(island({ id: 'soupe', done: false }, ['recolte'])).toEqual({ phase: 'scene', scene: 'cannelle' });
    expect(island({ id: 'soupe', done: false }, all)).toEqual({ phase: 'lines', lines: ['bulle'] });
    expect(island({ id: 'deco', done: false }, ['recolte', 'cannelle'])).toEqual({ phase: 'scene', scene: 'rivet' });
    expect(island({ id: 'deco', done: false }, all)).toEqual({ phase: 'lines', lines: ['puzzle', 'or'] });
    expect(island({ id: 'achat-source', done: false }, all)).toEqual({ phase: 'lines', lines: ['souci', 'source'] });
    expect(island({ id: 'souvenir-ondin', done: false }, ['recolte', 'cannelle', 'rivet'])).toEqual({ phase: 'scene', scene: 'ondin' });
    expect(island({ id: 'souvenir-ondin', done: false }, all)).toEqual({ phase: 'lines', lines: ['baguette', 'ruban'] });
    expect(island({ id: 'puits-ondin', done: true }, all)).toEqual({ phase: 'lines', lines: ['chut', 'produit', 'claim'] });
    expect(island({ id: 'lisiere', done: false }, all)).toEqual({ phase: 'scene', scene: 'campement' });
    expect(island({ id: 'lisiere', done: false }, [...all, 'campement'])).toEqual({ phase: 'finish' });
    // Chaque réplique nommée existe
    for (const line of ['claim', 'chaine', 'bulle', 'soupe', 'puzzle', 'or', 'souci', 'source', 'baguette', 'ruban', 'chut', 'produit']) expect(LINES[line], line).toBeTruthy();
  });
  it('chaque réplique tient en une bulle et ne cite ni un ancien prénom ni le Livre', () => {
    const texts = [...Object.values(SCENES).flat().filter(frame => frame.text || frame.caption).map(frame => frame.text || frame.caption), ...Object.values(LINES).map(line => line.text || line)];
    for (const text of texts) {
      expect(text.length, text).toBeLessThanOrEqual(140);
      expect(text).not.toMatch(/Paulette|Marine|Ferdinand|Anatole|Léonie|Gaspard|\bRose\b|\bLivre\b|Codex/);
    }
    // Chaque image a un dessin connu : une scène de la bibliothèque, ou le sceau de PrologueArt
    for (const frame of Object.values(SCENES).flat()) expect(frame.scene ? sceneOf(frame.scene) : frame.art === 'seal', frame.scene || frame.art).toBeTruthy();
  });
});
