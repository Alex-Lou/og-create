// Les bêtes qui marchent, dessinées dans la bibliothèque (design/bibliotheque/svg/animaux, orientees.json), sur l'île :
// chaque sorte du jeu qui a sa bête dans la bibliothèque la prend, dans ses trois vues et ses poses, au cadre du jeu
// × 1,25 autour de l'ancre (celui de orientees.json de trois quarts ; de profil, bas à +2,5) ; le reste garde son
// dessin par code.
import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { beastSprite, lookOf, viewOf, subjectOf, stepAt, beastPortraitUrl } from '@/world/beastArt';
import { ANIMAL_SPRITES } from '@/world/animals';
import { betes as BEASTS } from '../design/bibliotheque/svg/animaux/orientees.json';

const ROOT = fileURLToPath(new URL('../design/bibliotheque/svg/animaux/', import.meta.url));
const round = v => Math.round(v * 1000) / 1000;
const viewBox = file => readFileSync(file, 'utf8').match(/viewBox="([^"]+)"/)[1].split(/\s+/).map(Number);
// Les sortes et variantes que le jeu montre (animals.js, village.js, bestiary.js)
const SHOWN = [['hen', 'rousse'], ['hen', 'noire'], ['hen', 'blanche'], ['hen', 'grise'], ['chick', ''], ['cow', ''], ['cow', 'rousse'],
  ['sheep', ''], ['sheep', 'noir'], ['pig', ''], ['pig', 'tachete'], ['goat', ''], ['goat', 'brune'], ['deer', ''], ['fox', ''],
  ['rabbit', ''], ['hedgehog', ''], ['squirrel', ''], ['otter', ''], ['heron', ''], ['snowFox', ''], ['ibex', ''], ['puffin', ''],
  ['pony', ''], ['frog', ''], ['tortoise', ''], ['fennec', ''], ['camel', ''], ['chameleon', ''], ['toucan', ''], ['salamander', ''],
  ['crow', ''], ['kit', '']];
const POSES = { profil: ['marche', 'repos', 'clignement', 'joie'], avant: ['marche', 'repos', 'clignement', 'joie'], dos: ['marche', 'repos'] };

describe('les bêtes de la bibliothèque', () => {
  it('chaque bête du jeu qui marche a la sienne, dans ses trois vues et toutes ses poses', () => {
    for (const [species, variant] of SHOWN) {
      expect(ANIMAL_SPRITES[species], species).toBeTruthy();
      const subject = subjectOf(species, variant);
      expect(BEASTS[subject], `${species} ${variant}`).toBeTruthy();
      for (const [view, poses] of Object.entries(POSES)) {
        for (const pose of poses) {
          for (const n of pose === 'marche' ? [1, 2] : [1]) {
            const art = beastSprite(species, variant, { view, pose, n });
            expect(art, `${subject} ${view} ${pose} ${n}`).not.toBe(null);
            expect(art.key).toBe(`lib-${subject}_${view}_${pose === 'marche' ? `marche_${n}` : pose}`);
          }
        }
      }
    }
  });

  it('au cadre du jeu × 1,25 autour de l’ancre : celui de orientees.json de trois quarts ; de profil, bas à +2,5', () => {
    for (const [subject, art] of Object.entries(BEASTS)) {
      const dir = `${ROOT}${art.groupe}/${subject}/`;
      for (const view of ['avant', 'dos', 'profil']) {
        const file = `${dir}${subject}_${view}_marche_1.svg`;
        if (!existsSync(file)) continue;
        const cadre = view === 'profil' ? [art.cadre[0], art.cadre[1], art.cadre[2], 2.5 - art.cadre[1]] : art.cadre;
        expect(viewBox(file), `${subject} ${view}`).toEqual(cadre);
      }
    }
    for (const [species, variant] of SHOWN) {
      const art = BEASTS[subjectOf(species, variant)];
      const { box } = beastSprite(species, variant, { view: 'dos' }).make();
      expect([box.x, box.y, box.w, box.h].map(round)).toEqual(art.cadre.map(v => round(v / 1.25)));
      const side = beastSprite(species, variant).make().box;
      expect(round(side.y + side.h)).toBe(2);
    }
  });

  it('ce que la bibliothèque n’a pas garde son dessin par code', () => {
    expect(beastSprite('deer', 'blanc')).toBe(null);
    for (const species of ['koi', 'bird', 'butterfly', 'firefly', 'bee', 'owl', 'tictac', 'bowl', 'soup', 'anya']) expect(beastSprite(species, '')).toBe(null);
    expect(beastSprite('hen', '').key).toBe('lib-poule-blanche_profil_marche_1');
  });

  it('vue selon la direction, pose selon l’image du jeu ; de dos, ni clignement ni joie', () => {
    expect([viewOf(1, 0), viewOf(0, 1), viewOf(-1, 0), viewOf(0, -1), viewOf(1, -1)]).toEqual(['avant', 'avant', 'dos', 'dos', 'profil']);
    expect(lookOf('rest')).toEqual({ view: 'profil', pose: 'clignement' });
    expect([lookOf(0).n, lookOf(1).n]).toEqual([1, 2]);
    expect(beastSprite('cow', '', { view: 'dos', pose: 'joie' }).key).toBe('lib-vache_avant_joie');
    expect(beastSprite('cow', '', { view: 'dos', pose: 'clignement' }).key).toBe('lib-vache_avant_clignement');
    // Ses pas à 260 ms
    expect([0, 0.25, 0.27, 0.53].map(t => stepAt(t))).toEqual([1, 1, 2, 1]);
  });

  it('le portrait d’une bête de ferme attend sa lecture (image vide) ; rien pour une bête que la bibliothèque n’a pas', () => {
    expect(beastPortraitUrl('cow', 'rousse')).toMatch(/^data:image\/svg\+xml/);
    expect(beastPortraitUrl('deer', 'blanc')).toBe(null);
  });
});
