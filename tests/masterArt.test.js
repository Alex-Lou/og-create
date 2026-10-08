// Les sept maîtres de la bibliothèque (design/bibliotheque/svg/personnages : maitres/, naufrages/) sur l'île : chaque pose
// a ses images au bon cadre ; un maître reste naufragé tant que son bâtiment n'est pas fondé ; la lanterne et le parapluie
// se portent comme la bibliothèque les dessine ; la face n'est jamais en miroir.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { masterSprite, masterPortrait, masterGesture, MASTERS } from '@/world/masterArt';
import { ROLES } from '@/world/villagers';
import DATA from '../design/bibliotheque/svg/personnages/quotidien.json';

const ROOT = fileURLToPath(new URL('../design/bibliotheque/svg/personnages/', import.meta.url));
const viewBox = file => readFileSync(ROOT + file, 'utf8').match(/viewBox="([^"]+)"/)[1];
const name = sprite => sprite.key.replace(/^lib-/, '');

describe('les maîtres de la bibliothèque', () => {
  it('chaque bâtiment a son maître, en naufragé et en maître', () => {
    expect(Object.keys(MASTERS).sort()).toEqual(Object.keys(ROLES).sort());
    for (const who of Object.values(MASTERS)) {
      expect(DATA.maitres[who], who).toBeTruthy();
      expect(DATA.naufrages[who], who).toBeTruthy();
    }
  });

  it('chaque image est au cadre de sa pose : debout 48 × 64, parapluie plus haut, couché 64 × 48', () => {
    for (const set of [DATA.maitres, DATA.naufrages]) {
      for (const [who, { fichiers }] of Object.entries(set)) {
        for (const [pose, files] of Object.entries(fichiers)) {
          const want = pose === 'couche' ? '0 0 64 48' : pose.endsWith('_parapluie') ? '0 -18 48 82' : '0 0 48 64';
          files.forEach(file => expect(viewBox(file), `${who} ${pose}`).toBe(want));
        }
      }
    }
  });

  it('chaque pose du jeu prend les images de la bibliothèque, dans la bonne vue', () => {
    expect(name(masterSprite('ponton', false, { pose: 'walk', view: 'se', frame: 2 }))).toBe('aster_avant_marche_3');
    expect(name(masterSprite('ponton', false, { pose: 'walk', view: 'ne', frame: 5 }))).toBe('aster_dos_marche_6'); // la marche compte 8 images
    expect(name(masterSprite('ponton', false, { pose: 'idle', view: 'front', frame: 1 }))).toBe('aster_face_repos_2');
    expect(name(masterSprite('atelier', false, { pose: 'work', view: 'se' }))).toBe('rivet_avant_travail_1');
    expect(name(masterSprite('foyer', false, { pose: 'wave', view: 'front', frame: 1 }))).toBe('cannelle_face_salut_2');
    expect(name(masterSprite('potager', true, { pose: 'sleep', frame: 1 }))).toBe('melisse-naufrage_couche_2');
    expect(masterSprite('ponton', false, { pose: 'walk', view: 'front' }).view).toBe('face');
    expect(masterSprite('phare', false, {})).toBe(null);
  });

  it('chaque maître, naufragé ou non, a une image pour chaque pose, vue et objet porté du jeu', () => {
    for (const role of Object.keys(MASTERS)) {
      for (const castaway of [false, true]) {
        for (const pose of ['idle', 'walk', 'work', 'wave', 'sleep']) {
          for (const view of ['front', 'se', 'ne']) {
            for (const [lantern, umbrella] of [[false, false], [true, false], [false, true]]) {
              for (const frame of [0, 1, 2, 3]) {
                expect(masterSprite(role, castaway, { pose, view, frame, lantern, umbrella }), `${role} ${castaway} ${pose} ${view} ${frame}`).not.toBe(null);
              }
            }
          }
        }
      }
    }
  });

  it('sans le geste de son métier (Galet et Sylve naufragés), il attend au repos, les yeux ouverts', () => {
    expect(name(masterSprite('carriere', true, { pose: 'work', view: 'se', frame: 1 }))).toBe('galet-naufrage_avant_repos_1');
    expect(name(masterSprite('bosquet', true, { pose: 'work', view: 'ne', frame: 0 }))).toBe('sylve-naufrage_dos_repos_1');
    expect(name(masterSprite('carriere', false, { pose: 'work', view: 'se', frame: 1 }))).toBe('galet_avant_travail_2');
  });

  it('lanterne et parapluie : en marchant, de trois quarts ; à l\'arrêt, pieds joints ; jamais en travaillant ou en saluant', () => {
    expect(name(masterSprite('ponton', false, { pose: 'walk', view: 'ne', frame: 3, lantern: true }))).toBe('aster_dos_lanterne_4');
    const still = masterSprite('ponton', false, { pose: 'idle', view: 'front', lantern: true });
    expect([name(still), still.view]).toEqual(['aster_avant_lanterne_2', 'avant']);
    expect(name(masterSprite('ponton', false, { pose: 'work', view: 'se', lantern: true }))).toBe('aster_avant_lanterne_2');
    expect(name(masterSprite('ponton', false, { pose: 'wave', view: 'front', lantern: true, umbrella: true }))).toBe('aster_avant_parapluie_2');
    // La flamme luit dans la main qui la tient : à gauche de trois quarts avant, à droite de dos
    expect(still.lantern).toEqual([-7.9, -7.6]);
    expect(masterSprite('ponton', false, { pose: 'walk', view: 'ne', lantern: true }).lantern).toEqual([7.9, -7.6]);
    expect(masterSprite('ponton', false, { pose: 'walk', view: 'se', umbrella: true }).lantern).toBe(null);
    // Naufragés : seuls Aster et Rivet ont une lanterne et un parapluie ; les autres marchent sans
    const cannelle = masterSprite('foyer', true, { pose: 'walk', view: 'se', lantern: true });
    expect([name(cannelle), cannelle.lantern]).toEqual(['cannelle-naufrage_avant_marche_1', null]);
    expect(name(masterSprite('atelier', true, { pose: 'walk', view: 'se', umbrella: true }))).toBe('rivet-naufrage_avant_parapluie_1');
  });

  it('le dessin se pose sur les pieds, avec l\'ombre du jeu ; couché, sur son ombre', async () => {
    const standing = masterSprite('ponton', false, { pose: 'idle', view: 'se' }).make();
    expect(standing.box).toEqual({ x: -19.2, y: -49.6, w: 38.4, h: 51.2 });
    const svg = await standing.load();
    expect(svg).toMatch(/^<svg[^>]*width="38.4" height="51.2"[^>]*><ellipse cx="24.5" cy="62"/);
    expect(masterSprite('ponton', false, { pose: 'walk', view: 'se', umbrella: true }).make().box.h).toBeCloseTo(65.6, 5);
    const bed = masterSprite('ponton', false, { pose: 'sleep' }).make();
    expect(bed.box).toEqual({ x: -25.6, y: -20.8, w: 51.2, h: 38.4 });
    expect((await bed.load()).match(/<ellipse/g).length).toBeGreaterThan(0);
  });

  it('le portrait d\'un maître : de face, au repos, en naufragé ou en maître', () => {
    expect(masterPortrait('bosquet', true)).toMatch(/sylve-naufrage_face_repos_1\.svg$|^data:image\/svg\+xml/);
    expect(masterPortrait('bosquet', false)).toMatch(/sylve_face_repos_1\.svg$|^data:image\/svg\+xml/);
    expect(masterPortrait('phare', false)).toBe(null);
  });

  it('le portrait d\'une scène : de face ou de trois quarts, au repos, au travail, en marche ou assis ; sans geste, au repos', () => {
    expect(masterPortrait('atelier', true, { view: 'se', pose: 'work' })).toMatch(/rivet-naufrage_avant_travail_1\.svg$/);
    expect(masterPortrait('foyer', false, { view: 'front', pose: 'walk' })).toMatch(/cannelle_face_marche_1\.svg$/);
    expect(masterPortrait('ponton', false, { view: 'se' })).toMatch(/aster_avant_repos_1\.svg$/);
    expect(masterPortrait('carriere', true, { view: 'se', pose: 'work' })).toMatch(/galet-naufrage_avant_repos_1\.svg$/);
    // Assis, à la veillée (le siège n'est pas dessiné : PrologueArt pose une souche dessous)
    expect(masterPortrait('ponton', true, { view: 'se', pose: 'sit' })).toMatch(/aster-naufrage_avant_assis_1\.svg$/);
    // Chaque maître a son portrait dans chaque vue et pose des scènes, en naufragé et en maître
    for (const role of Object.keys(MASTERS)) {
      for (const castaway of [false, true]) {
        for (const view of ['front', 'se']) {
          for (const pose of ['idle', 'work', 'walk', 'sit']) expect(masterPortrait(role, castaway, { view, pose }), `${role} ${castaway} ${view} ${pose}`).toBeTruthy();
        }
      }
    }
  });
  it('le geste du mini-jeu de son bâtiment : pêcher au Ponton, piocher à la Carrière, cueillir au Bosquet (deux images)', () => {
    for (const [role, gesture, name] of [['ponton', 'pecher', 'aster'], ['carriere', 'piocher', 'galet'], ['bosquet', 'cueillir', 'sylve']]) {
      const urls = masterGesture(role, gesture);
      expect(urls, role).toHaveLength(2);
      urls.forEach((url, k) => expect(url).toContain(`${name}_avant_${gesture}_${k + 1}`));
    }
    expect(masterGesture('ponton', 'voler')).toBe(null);
    expect(masterGesture('nulle-part', 'pecher')).toBe(null);
  });
});
