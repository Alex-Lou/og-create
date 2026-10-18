import { describe, expect, it } from 'vitest';
import { createRequire } from 'node:module';
import DATA from '../design/bibliotheque/svg/scenes/tutoriel/scenes.json';
import { clipA, imageA, prochain, gravee, neonCouleur } from '../src/game/acteur';

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
  it('en néon : ses couleurs ravivées, le cerne indigo, le liseré cyan du côté de la lumière, sans hachures', () => {
    const svg = gravee('<path d="M1,1 L9,9" fill="#B08060" stroke="#3C2819"/><use href="#abc"/>', 'x', { cote: -1, neon: true });
    expect(svg).toMatch(/^<svg [^>]*viewBox="0 0 48 64"/);
    expect(svg).toContain(`fill="${neonCouleur('#B08060')}"`);
    expect(svg).toContain('#0A0418');
    expect(svg).toMatch(/\.lx \*\{fill:#7AF8EE/);
    expect(svg).toContain('translate(1.3 -0.5)');
    expect(svg).not.toMatch(/l36,-76/);
    expect(svg).toContain('href="#abc"');
    expect(svg).not.toMatch(/<filter|filter=/);
  });
  it('une couleur en néon : plus saturée, la même teinte ; les sombres vers l\'indigo', () => {
    expect(neonCouleur('#B08060')).not.toBe('#B08060');
    expect(neonCouleur('#B08060').slice(1, 3) > neonCouleur('#B08060').slice(5, 7)).toBe(true);
    expect(neonCouleur('#0A0A0A')).toMatch(/^#[0-9A-F]{6}$/);
  });
});

// Les pistes « acteur » des scènes : des clips dans l'ordre, dans leur temps, d'animations que le kit joue dans cette
// direction
const JOUEES = Object.entries(DATA.scenes).flatMap(([id, sc]) => (sc.plans && sc.partition ? sc.partition.temps.map((t, n) => [`${id} ${n}`, t, sc]) : [])).filter(([, t]) => t.acteur);
// (le naufrage se voit par ses yeux : aucune scène ne fait encore jouer l'avatar ; celles qui le feront sont vérifiées ici)
describe('les pistes « acteur » des scènes', () => {
  it('des clips dans l\'ordre, dans leur temps, que le kit joue dans cette direction', () => {
    for (const [nom, temps, scene] of JOUEES) {
      expect(scene.avatar, nom).toBeTruthy();
      expect(scene.plans.map(p => p.id), nom).toContain('avatar');
      temps.acteur.forEach(([t, clip], i) => {
        expect(t, nom).toBeGreaterThanOrEqual(i ? temps.acteur[i - 1][0] : 0);
        expect(t, nom).toBeLessThanOrEqual(temps.duree);
        expect(ANIMS[clip.anim], nom).toBeTruthy();
        expect(DIRECTIONS[clip.dir], nom).toBeTruthy();
        expect(ANIMS[clip.anim].dirs, nom).toContain(clip.dir);
      });
    }
  });
});
