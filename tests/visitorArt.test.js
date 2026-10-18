// Les visiteurs de la bibliothèque (design/bibliotheque/svg/personnages/visiteurs) sur l'île et dans les portraits
// (world/masterArt.js : visitorSprite ; world/masterPortraits.js : visitorPortraitUrl ; world/visitors.js : visitorCast) :
// une image pour chaque pose, vue et objet porté du jeu ; jamais deux pareils ; le même sur l'île et dans le portrait.
import { describe, it, expect } from 'vitest';
import { visitorSprite, VISITORS, MASTERS } from '@/world/masterArt';
import { visitorPortraitUrl } from '@/world/masterPortraits';
import { visitorCast, visitorName } from '@/world/visitors';
import DATA from '../design/bibliotheque/svg/personnages/quotidien.json';

const name = sprite => sprite.key.replace(/^lib-/, '');
const SITES = [...Object.keys(MASTERS), 'visitor'];

describe('les visiteurs de la bibliothèque', () => {
  it('les douze de quotidien.json, aux noms que donne visitorCast', () => {
    expect(VISITORS).toEqual(Object.keys(DATA.visiteurs));
    expect(VISITORS).toEqual(Array.from({ length: 12 }, (_, n) => visitorName(n)));
  });

  it('chacun a une image pour chaque pose, vue et objet porté du jeu, à chaque métier', () => {
    for (const who of VISITORS) {
      for (const site of SITES) {
        for (const pose of ['idle', 'walk', 'work', 'wave', 'sleep']) {
          for (const view of ['front', 'se', 'ne']) {
            for (const [lantern, umbrella] of [[false, false], [true, false], [false, true]]) {
              for (const chore of [null, 'becher', 'semer', 'arroser', 'recolter', 'tailler', 'scier']) {
                for (const frame of [0, 1, 2, 3]) {
                  expect(visitorSprite(who, site, { pose, view, frame, lantern, umbrella, chore }), `${who} ${site} ${pose} ${view} ${frame}`).not.toBe(null);
                }
              }
            }
          }
        }
      }
      expect(visitorPortraitUrl(who), who).toBeTruthy();
    }
    expect(visitorSprite('visiteur-99', 'ponton', {})).toBe(null);
  });

  it('chaque pose prend ses images, dans la bonne vue ; à la porte de son métier, le geste du bâtiment', () => {
    expect(name(visitorSprite('visiteur-03', 'visitor', { pose: 'walk', view: 'se', frame: 2 }))).toBe('visiteur-03_avant_marche_3');
    expect(name(visitorSprite('visiteur-03', 'visitor', { pose: 'walk', view: 'ne', frame: 5 }))).toBe('visiteur-03_dos_marche_6');
    expect(name(visitorSprite('visiteur-03', 'visitor', { pose: 'wave', view: 'front', frame: 1 }))).toBe('visiteur-03_face_salut_2');
    expect(name(visitorSprite('visiteur-03', 'visitor', { pose: 'sleep', frame: 1 }))).toBe('visiteur-03_couche_2');
    expect(name(visitorSprite('visiteur-03', 'potager', { pose: 'work', view: 'se' }))).toBe('visiteur-03_avant_becher_1');
    expect(name(visitorSprite('visiteur-03', 'potager', { pose: 'work', view: 'se', chore: 'semer', frame: 1 }))).toBe('visiteur-03_avant_semer_2');
    expect(name(visitorSprite('visiteur-03', 'carriere', { pose: 'work', view: 'ne' }))).toBe('visiteur-03_dos_piocher_1');
    // (de face, il ne fait que se tenir et saluer : au travail, il se tient)
    expect(name(visitorSprite('visiteur-03', 'potager', { pose: 'work', view: 'front' }))).toBe('visiteur-03_face_repos_1');
    // la lanterne : de trois quarts, à la main de devant ; de dos, dans l'autre
    const lamp = visitorSprite('visiteur-03', 'visitor', { pose: 'idle', view: 'front', lantern: true });
    expect([name(lamp), lamp.view]).toEqual(['visiteur-03_avant_lanterne_2', 'avant']);
    const back = visitorSprite('visiteur-03', 'visitor', { pose: 'walk', view: 'ne', lantern: true });
    expect(back.lantern).toEqual([-lamp.lantern[0], lamp.lantern[1]]);
    expect(visitorSprite('visiteur-03', 'visitor', { pose: 'walk', view: 'se', umbrella: true }).make().box.h).toBeCloseTo(82 / 1.25);
  });

  it('jamais deux pareils, tant qu’ils sont douze au plus ; une arrivée ne change pas ceux qui sont là', () => {
    const seeds = [99, 77, 4, 123456, 7, 8, 9, 10, 11, 12, 13, 14];
    const all = visitorCast(seeds);
    expect(new Set(all.values()).size).toBe(12);
    for (let k = 1; k <= seeds.length; k++) {
      const few = visitorCast(seeds.slice(0, k));
      for (const seed of seeds.slice(0, k)) expect(few.get(seed)).toBe(all.get(seed));
    }
    expect(visitorCast([5, 5, undefined, null]).size).toBe(1);
    // au-delà de douze, on se ressemble, mais chacun a son visiteur
    expect(visitorCast(Array.from({ length: 20 }, (_, i) => i * 31)).size).toBe(20);
  });
});
