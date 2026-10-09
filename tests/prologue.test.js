// Lot H4 (HISTOIRE.md, § 9 et § 16) : le tutoriel ne commence que pour un invité tout neuf, suit le jeu (pages
// écrites, compte, nom) et reprend toujours l'étape imposée par le serveur ; ses répliques tiennent en une bulle (§ 7.4).
import { describe, it, expect } from 'vitest';
import { prologueStep, islandStep, loadPrologue, scenesBefore, inPrologue, resumedPrologue } from '@/game/prologue';
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
  it('étapes 1 à 3 : seul sur la plage de Brumelune, la carte d’embarquement (l’avatar), puis Brume et le livre', () => {
    expect(step({ started: true })).toEqual({ phase: 'scene', scene: 'naufrage' });
    expect(step({ started: true, seen: ['naufrage'] })).toEqual({ phase: 'avatar' });
    expect(step({ started: true, seen: ['naufrage'], look: 'avatar-03' })).toEqual({ phase: 'scene', scene: 'arrivee' });
    // Un appareil qui a vu l'arrivée d'avant ne revient pas en arrière (ni naufrage ni carte)
    expect(step({ started: true, seen: ['arrivee'] })).toEqual({ phase: 'vent' });
  });
  it('une seule page avant l’île : Vent, guidé, puis le vent se lève', () => {
    const seen = ['naufrage', 'arrivee'];
    expect(step({ started: true, seen })).toEqual({ phase: 'vent' });
    expect(step({ started: true, seen }, false, [...BASE, 'Vent'])).toEqual({ phase: 'scene', scene: 'souffle' });
    seen.push('souffle');
    expect(step({ started: true, seen }, false, [...BASE, 'Vent'])).toEqual({ phase: 'name', account: true });
    // Une autre page que Vent d'abord : Brume demande encore Vent
    expect(step({ started: true, seen }, false, [...BASE, 'Boue'])).toEqual({ phase: 'vent' });
  });
  it('après le Vent : la page de garde (compte puis nom), puis la plage de Brumelune', () => {
    const vent = [...BASE, 'Vent'];
    const seen = ['arrivee', 'souffle'];
    expect(step({ started: true, seen }, false, vent)).toEqual({ phase: 'name', account: true });
    expect(step({ started: true, seen, registered: true }, true, vent)).toEqual({ phase: 'name', account: false });
    expect(step({ started: true, seen, registered: true, named: true }, true, vent)).toEqual({ phase: 'greve' });
  });
  it('un compte ouvert autrement que par la page de garde arrête le tutoriel', () => {
    expect(step({ started: true, seen: ['arrivee'] }, true, [...BASE, 'Vent'])).toBe(null);
  });
  it('étapes 2 à 5 sur l’île : chaque quête du prologue a sa scène, ses répliques, puis Le Campement', () => {
    const ready = { started: true, registered: true, named: true, seen: ['arrivee', 'souffle'] };
    const island = (quest, seen = []) => islandStep({ state: state({ ...ready, seen: [...ready.seen, ...seen] }), quest });
    // Pas avant le nom, ni après « Passer »
    expect(islandStep({ state: state({ ...ready, named: false }), quest: { id: 'recolte' } })).toBe(null);
    expect(islandStep({ state: state({ ...ready, skipped: true }), quest: { id: 'recolte' } })).toBe(null);
    // Brume seule au début : ramassage, Brasier, feu, première nuit. Aster arrive ensuite au matin.
    expect(island({ id: 'pages', done: true })).toEqual({ phase: 'lines', lines: ['claim'] });
    expect(island({ id: 'ramasser', done: false })).toEqual({ phase: 'lines', lines: ['epaves'] });
    expect(island({ id: 'ramasser', done: true })).toEqual({ phase: 'lines', lines: ['claim'] });
    expect(island({ id: 'feu', done: false })).toEqual({ phase: 'lines', lines: ['cendres'] });
    expect(island({ id: 'feu', done: true })).toEqual({ phase: 'lines', lines: ['flambe', 'claim'] });
    expect(island({ id: 'recolte', done: false })).toEqual({ phase: 'scene', scene: 'nuit' });
    expect(island({ id: 'recolte', done: false }, ['nuit'])).toEqual({ phase: 'scene', scene: 'recolte' });
    expect(island({ id: 'recolte', done: false }, ['nuit', 'recolte'])).toEqual({ phase: 'harvest' });
    const all = ['nuit', 'recolte', 'cannelle', 'rivet', 'ondin'];
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
    // Le premier chemin réclamé : Le Campement clôt l'ancien prologue global.
    expect(island({ id: 'lisiere', done: false }, all)).toEqual({ phase: 'scene', scene: 'campement' });
    expect(island({ id: 'lisiere', done: false }, [...all, 'campement'])).toEqual({ phase: 'finish' });
    // Les poules restent dans la suite existante, hors de la phase Brume corrigée ici.
    expect(island({ id: 'poules', done: false }, all)).toEqual({ phase: 'lines', lines: ['caquets'] });
    expect(island({ id: 'poules', done: true }, all)).toEqual({ phase: 'lines', lines: ['ponte', 'claim'] });
    // Chaque réplique nommée existe
    for (const line of ['claim', 'chaine', 'bulle', 'soupe', 'puzzle', 'or', 'souci', 'source', 'baguette', 'ruban', 'chut', 'produit', 'epaves', 'cendres', 'flambe', 'caquets', 'ponte']) expect(LINES[line], line).toBeTruthy();
    // La séquence de Brume ne simule aucun lever du jour : le joueur campe sur la plage jusqu'au matin d'Aster.
    expect([LINES.greve, LINES.epaves, LINES.cendres, ...SCENES.nuit.map(frame => frame.text || '')].join(' ')).toContain('Brumelune');
    expect([LINES.greve, LINES.cendres].join(' ')).not.toMatch(/jour se lève|nuit approche/i);
  });
  it('repris par le compte : les scènes des étapes passées comptent comme vues, celle de l’étape en cours se joue', () => {
    expect(inPrologue('feu')).toBe(true);
    expect(inPrologue('lisiere')).toBe(false);
    const before = ['naufrage', 'arrivee', 'souffle'];
    expect(scenesBefore('ramasser')).toEqual(before);
    expect(scenesBefore('feu')).toEqual(before);
    expect(scenesBefore('recolte')).toEqual(before);
    expect(scenesBefore('soupe')).toEqual([...before, 'nuit', 'recolte']);
    expect(scenesBefore('souvenir-ondin')).toEqual([...before, 'nuit', 'recolte', 'cannelle', 'rivet']);
    expect(scenesBefore('chemin')).toEqual([...before, 'nuit', 'recolte', 'cannelle', 'rivet', 'ondin']);
    expect(scenesBefore('lisiere')).toEqual([...before, 'nuit', 'recolte', 'cannelle', 'rivet', 'ondin']);
    // Un appareil qui n'a rien retenu, à l'étape de la soupe : la nuit et l'arrivée d'Aster comptent comme vues.
    const resumed = { started: true, registered: true, named: true, seen: scenesBefore('soupe') };
    expect(islandStep({ state: state(resumed), quest: { id: 'soupe', done: false } })).toEqual({ phase: 'scene', scene: 'cannelle' });
    // Un état local d'un autre compte ou d'une ancienne version ne peut pas annuler la reprise serveur.
    const stale = resumedPrologue(state({ skipped: true, finished: true, seen: [] }), 'feu');
    expect(stale).toMatchObject({ started: true, skipped: false, registered: true, named: true, finished: false });
    expect(islandStep({ state: stale, quest: { id: 'feu', done: false } })).toEqual({ phase: 'lines', lines: ['cendres'] });
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
