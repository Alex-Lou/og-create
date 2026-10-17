import { describe, expect, it } from 'vitest';
import { createRequire } from 'node:module';
import DATA from '../design/bibliotheque/svg/scenes/tutoriel/scenes.json';
import { clipA, imageA, prochain, gravee } from '../src/game/acteur';

// Les animations du kit de l'avatar (le jeu les lit dans generateur/avatar.mjs : MOUVEMENTS, les mêmes)
const { ANIMS, DIRECTIONS } = createRequire(import.meta.url)('../design/personnages/refonte/mouvements.js');
const ACTEUR = [[0, { anim: 'marche', dir: 'bas_droite' }], [1000, { anim: 'arret', dir: 'bas_droite' }], [1600, { anim: 'repos', dir: 'face' }]];

describe('le jeu de l\'avatar dans une scène en plans', () => {
  it('le clip joué à chaque instant', () => {
    expect(clipA(ACTEUR, 0).clip.anim).toBe('marche');
    expect(clipA(ACTEUR, 999).rang).toBe(0);
    expect(clipA(ACTEUR, 1000)).toEqual({ rang: 1, debut: 1000, clip: ACTEUR[1][1] });
    expect(clipA(ACTEUR, 9000).clip.anim).toBe('repos');
  });
  it('ses images : en boucle, sauf l\'arrêt, qui finit sur sa dernière', () => {
    expect(imageA('marche', 0, ANIMS)).toBe(0);
    expect(imageA('marche', 850, ANIMS)).toBe(0);
    expect(imageA('marche', 150, ANIMS)).toBe(1);
    expect(imageA('arret', 5000, ANIMS)).toBe(ANIMS.arret.images - 1);
    expect(imageA('inconnue', 100, ANIMS)).toBe(0);
  });
  it('le prochain changement d\'image (jamais trop tôt)', () => {
    expect(prochain(ACTEUR, 0, ANIMS)).toBe(100);
    expect(prochain(ACTEUR, 950, ANIMS)).toBe(50);
    expect(prochain(ACTEUR, 999.9, ANIMS)).toBe(16);
  });
  it('son dessin gravé : cerne, découpe, hachures, sans filtre', () => {
    const svg = gravee('<path d="M1,1 L9,9" fill="red"/>', 'x', { cote: -1 });
    expect(svg).toMatch(/^<svg [^>]*viewBox="0 0 48 64"/);
    expect(svg.match(/<path d="M1,1 L9,9" fill="red"\/>/g)).toHaveLength(3);
    expect(svg).not.toMatch(/<filter|filter=/);
  });
});

// Les pistes « acteur » des scènes : des clips dans l'ordre, dans leur temps, d'animations que le kit joue dans cette
// direction
const JOUEES = Object.entries(DATA.scenes).flatMap(([id, sc]) => (sc.plans && sc.partition ? sc.partition.temps.map((t, n) => [`${id} ${n}`, t, sc]) : [])).filter(([, t]) => t.acteur);
describe('les pistes « acteur » des scènes', () => {
  it('il y en a', () => expect(JOUEES.length).toBeGreaterThan(0));
  it.each(JOUEES)('%s', (nom, temps, scene) => {
    expect(scene.avatar).toBeTruthy();
    expect(scene.plans.map(p => p.id)).toContain('avatar');
    temps.acteur.forEach(([t, clip], i) => {
      expect(t).toBeGreaterThanOrEqual(i ? temps.acteur[i - 1][0] : 0);
      expect(t).toBeLessThanOrEqual(temps.duree);
      expect(ANIMS[clip.anim]).toBeTruthy();
      expect(DIRECTIONS[clip.dir]).toBeTruthy();
      expect(ANIMS[clip.anim].dirs).toContain(clip.dir);
    });
  });
});
