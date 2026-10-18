// Les habitants venus d'ailleurs (world/arrivantArt.js) : dessinés à la volée par le générateur de l'avatar
// (generateur/avatar.mjs : quotidien), à la même qualité que la bibliothèque (les mêmes images, octet pour octet, que
// celles qu'en tire l'atelier : design/atelier/troupe_liste.js, poses ; generateur_personnages.mjs) ; une image pour
// chaque pose du jeu ; rien tant que le générateur n'est pas chargé ; jamais l'ancien générateur.
import { describe, it, expect, beforeAll } from 'vitest';
import { createRequire } from 'node:module';
import * as KIT from '../design/bibliotheque/generateur/avatar.mjs';
import { loadKit } from '@/game/avatarKit';
import { arrivantSprite, arrivantPortrait } from '@/world/arrivantArt';
import { MASTERS } from '@/world/masterArt';

// (l'atelier, tel que la bibliothèque le publie : le cadre de chaque pose, le trois quarts avant en miroir)
const require = createRequire(import.meta.url);
const Q = require('../design/atelier/troupe_liste.js');
const A = require('../design/personnages/avatar.js');
const { miroir } = require('../design/atelier/noms_personnages.js');
const r2 = n => Math.round(n * 100) / 100;
const svgOf = (vb, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${r2(vb[2])}" height="${r2(vb[3])}" viewBox="${vb.join(' ')}">${body}</svg>`;

describe('les habitants venus d’ailleurs', () => {
  beforeAll(() => loadKit());

  it('quotidien dessine les mêmes images que l’atelier', () => {
    const choix = KIT.assorti(42, { gratuit: true });
    const opts = { couverture: { fond: '#6E8FC4', motif: '#DDE7F4' }, parapluie: '#3E78C8' };
    const q = KIT.quotidien(choix, 'a1', opts);
    let seen = 0;
    for (const [pose, , vb, images] of Q.poses(A.avatar(choix, { uid: 'a1' }), { lanterne: true, ...opts })) {
      if (!q.images(pose)) continue;
      expect(q.images(pose), pose).toBe(images.length);
      images.forEach((body, n) => {
        const svg = svgOf(vb, body);
        expect(q.image(pose, n + 1) === (pose.startsWith('avant_') ? miroir(svg) : svg), `${pose} ${n + 1}`).toBe(true);
        seen++;
      });
    }
    expect(seen).toBeGreaterThan(100);
  });

  it('une image pour chaque pose, vue et objet porté du jeu, à chaque métier ; d’après ses choix ou sa graine', () => {
    const chosen = { seed: 7, look: KIT.assorti(42, { gratuit: true }) };
    for (const who of [{ seed: 7, look: null }, chosen]) {
      for (const site of [...Object.keys(MASTERS), 'visitor']) {
        for (const pose of ['idle', 'walk', 'work', 'wave', 'sleep']) {
          for (const view of ['front', 'se', 'ne']) {
            for (const [lantern, umbrella] of [[false, false], [true, false], [false, true]]) {
              for (const chore of [null, 'becher', 'semer', 'arroser', 'recolter', 'tailler', 'scier']) {
                const art = arrivantSprite(who, site, { pose, view, frame: 1, lantern, umbrella, chore });
                expect(art, `${site} ${pose} ${view} ${lantern} ${umbrella} ${chore}`).not.toBe(null);
                expect(art.key.startsWith('arr-')).toBe(true);
              }
            }
          }
        }
      }
      expect(arrivantPortrait(who).startsWith('data:image/svg+xml')).toBe(true);
    }
    // ses choix, et non ceux que sa graine tirerait ; sa lanterne luit à sa main
    expect(arrivantSprite(chosen, 'ponton', {}).key).not.toBe(arrivantSprite({ seed: 7, look: null }, 'ponton', {}).key);
    const lamp = arrivantSprite(chosen, 'ponton', { pose: 'walk', view: 'se', lantern: true });
    expect(lamp.lantern).toHaveLength(2);
    expect(lamp.make().svg).toContain('<svg');
    expect(arrivantSprite(null, 'ponton', {})).toBe(null);
  });
});
