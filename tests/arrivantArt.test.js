// Les habitants venus d'ailleurs (world/arrivantArt.js) : dessinés à la volée par le générateur de l'avatar
// (generateur/avatar.mjs : quotidien), à la même qualité que la bibliothèque (les mêmes images, octet pour octet, que
// celles d'un visiteur de design/bibliotheque/svg/personnages/visiteurs) ; une image pour chaque pose du jeu ; rien
// tant que le générateur n'est pas chargé ; jamais l'ancien générateur.
import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'node:fs';
import * as KIT from '../design/bibliotheque/generateur/avatar.mjs';
import DATA from '../design/bibliotheque/svg/personnages/quotidien.json';
import { loadKit } from '@/game/avatarKit';
import { arrivantSprite, arrivantPortrait } from '@/world/arrivantArt';
import { MASTERS } from '@/world/masterArt';

const DIR = 'design/bibliotheque/svg/personnages/visiteurs';
// (les options de la bibliothèque pour le visiteur i : design/atelier/troupe_liste.js, VISITEURS)
const PARAPLUIES = ['#D9443A', '#3E78C8', '#F2C04B', '#7EC45B', '#C46AA8', '#2E3E66'];
const COUV = [{ fond: '#C98F5A', motif: '#E8C07A' }, { fond: '#6E8FC4', motif: '#DDE7F4' }, { fond: '#8BAE6A', motif: '#E2EDC9' }, { fond: '#B86A7A', motif: '#F2D2D8' }];

describe('les habitants venus d’ailleurs', () => {
  beforeAll(() => loadKit());

  it('quotidien dessine les mêmes images que la bibliothèque', () => {
    const i = 3, cle = 'visiteur-03';
    const q = KIT.quotidien(DATA.visiteurs[cle].choix, `v${i}`, { couverture: COUV[i % COUV.length], parapluie: PARAPLUIES[i % PARAPLUIES.length] });
    const files = Object.values(DATA.visiteurs[cle].fichiers).flat().map(f => f.split('/').pop());
    let seen = 0;
    for (const file of files) {
      const [, name, n] = file.match(new RegExp(`^${cle}_(.+)_(\\d+)\\.svg$`));
      if (!q.images(name)) continue;
      // (le fichier finit par un saut de ligne)
      expect(q.image(name, Number(n)) === readFileSync(`${DIR}/${cle}/${file}`, 'utf8').replace(/\n$/, ''), file).toBe(true);
      seen++;
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
