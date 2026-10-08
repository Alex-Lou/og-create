// Lot H4 (HISTOIRE.md, § 9 et § 16) : le tutoriel ne commence que pour un invité tout neuf, suit le jeu (pages
// écrites, compte, nom) et s'arrête pour de bon avec « Passer » ; ses répliques tiennent en une bulle (§ 7.4).
import { describe, it, expect } from 'vitest';
import { prologueStep, islandStep, loadPrologue, scenesBefore, inPrologue } from '@/game/prologue';
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
    // Brume seule au début : Aster ne débarque qu'à la fin du tutoriel (choix de l'auteur, 8 oct.)
    expect(island({ id: 'pages', done: true })).toEqual({ phase: 'lines', lines: ['claim'] });
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
    // Puis le premier chemin, du Puits au Feu (l'île neuve n'a que son sentier)
    expect(island({ id: 'chemin', done: false }, all)).toEqual({ phase: 'lines', lines: ['glisse', 'pierres'] });
    expect(island({ id: 'chemin', done: true }, all)).toEqual({ phase: 'lines', lines: ['sentier', 'claim'] });
    // Le premier chemin réclamé : Aster débarque (sa scène), puis Le Campement
    expect(island({ id: 'lisiere', done: false }, ['cannelle', 'rivet', 'ondin'])).toEqual({ phase: 'scene', scene: 'recolte' });
    expect(island({ id: 'lisiere', done: false }, all)).toEqual({ phase: 'scene', scene: 'campement' });
    expect(island({ id: 'lisiere', done: false }, [...all, 'campement'])).toEqual({ phase: 'finish' });
    // La v6 : la Grève (Brume seule), le feu de camp, les poules de Cannelle ; elles restent dans le prologue
    expect(island({ id: 'ramasser', done: false })).toEqual({ phase: 'lines', lines: ['epaves'] });
    expect(island({ id: 'ramasser', done: false }, all)).toEqual({ phase: 'lines', lines: ['epaves'] });
    expect(island({ id: 'ramasser', done: true }, all)).toEqual({ phase: 'lines', lines: ['claim'] });
    expect(island({ id: 'feu', done: false }, all)).toEqual({ phase: 'lines', lines: ['cendres'] });
    expect(island({ id: 'feu', done: true }, all)).toEqual({ phase: 'lines', lines: ['flambe', 'claim'] });
    expect(island({ id: 'poules', done: false }, all)).toEqual({ phase: 'lines', lines: ['caquets'] });
    expect(island({ id: 'poules', done: true }, all)).toEqual({ phase: 'lines', lines: ['ponte', 'claim'] });
    // Chaque réplique nommée existe
    for (const line of ['claim', 'chaine', 'bulle', 'soupe', 'puzzle', 'or', 'souci', 'source', 'baguette', 'ruban', 'chut', 'produit', 'epaves', 'cendres', 'flambe', 'caquets', 'ponte']) expect(LINES[line], line).toBeTruthy();
  });
  it('repris par le compte : les scènes des étapes passées comptent comme vues, celle de l’étape en cours se joue', () => {
    expect(inPrologue('feu')).toBe(true);
    expect(inPrologue('lisiere')).toBe(false);
    const before = ['naufrage', 'arrivee', 'souffle', 'sceau'];
    expect(scenesBefore('ramasser')).toEqual(before);
    expect(scenesBefore('soupe')).toEqual(before);
    expect(scenesBefore('souvenir-ondin')).toEqual([...before, 'cannelle', 'rivet']);
    // (la scène d'Aster se joue après le premier chemin)
    expect(scenesBefore('chemin')).toEqual([...before, 'cannelle', 'rivet', 'ondin']);
    // Après le prologue : toutes, sauf l'arrivée d'Aster et le Campement (elles se jouent une fois, à sa fin)
    expect(scenesBefore('lisiere')).toEqual([...before, 'cannelle', 'rivet', 'ondin']);
    // Un appareil qui n'a rien retenu, à l'étape de la soupe : la scène de Cannelle, pas celle d'Aster
    const resumed = { started: true, registered: true, named: true, seen: scenesBefore('soupe') };
    expect(islandStep({ state: state(resumed), quest: { id: 'soupe', done: false } })).toEqual({ phase: 'scene', scene: 'cannelle' });
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
