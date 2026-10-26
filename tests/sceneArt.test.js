// Les scènes du tutoriel dessinées par la bibliothèque (game/sceneArt.js) : chaque scène a ses images, et l'avatar du
// joueur trouve un dessin pour chacune de ses places, quel que soit l'exemple choisi sur la carte d'embarquement
import { describe, it, expect } from 'vitest';
import { sceneOf, avatarFrames, avatarBox, photoBox, playerFace, LOOKS, DEFAULT_LOOK } from '@/game/sceneArt';
import { SCENES } from '@/texts/tutorial/scenes';

const used = [...new Set(Object.values(SCENES).flat().map(frame => frame.scene).filter(Boolean))];

describe('les scènes de la bibliothèque', () => {
  it('douze avatars, chacun avec sa tenue naufragée', () => {
    expect(LOOKS).toHaveLength(12);
    expect(DEFAULT_LOOK).toBe('avatar-01');
    for (const look of LOOKS) expect(avatarFrames(look, { naufrage: true })[0], look).toMatch(/-naufrage_face_repos_1\.svg/);
  });
  it('le joueur parle sur l’île avec son avatar de naufragé, de face ; l’exemple par défaut tant que le sien n’est pas dessiné', () => {
    expect(playerFace('avatar-03')).toMatch(/avatar-03-naufrage_face_repos_1\.svg/);
    expect(playerFace({ genre: 'femme' })).toMatch(/avatar-01-naufrage_face_repos_1\.svg/);
  });
  it('chaque scène du tutoriel a toutes ses images, fond, ce qui bouge (s’il est à part) et devant', () => {
    for (const id of [...used, '00_carte']) {
      const scene = sceneOf(id);
      expect(scene, id).toBeTruthy();
      // (une scène en plans : chacun de ses plans peints a son image, à la place du fond)
      // (la photo et le nom du joueur sur une carte : SceneArt les peint, game/sceneArt.js : CARTES)
      if (scene.plans) expect(scene.plans.every(p => p.href || ['anime', 'avatar', 'photo'].includes(p.id)), id).toBe(true);
      else expect(scene.back, id).toHaveLength(scene.frames);
      expect(scene.back.every(Boolean) && scene.live.every(Boolean) && scene.front.every(Boolean), id).toBe(true);
    }
    expect(sceneOf('inconnue')).toBe(null);
  });
  it('les scènes à plusieurs images gardent la plus parlante et respirent (pas d’à-coups) ; Agathe reste cuisinière', () => {
    const scene = sceneOf('07_souvenir');
    expect([scene.frames, scene.still, scene.back.length]).toEqual([1, true, 1]);
    expect(scene.back[0]).toMatch(/fond_4/);
    for (const id of used) {
      const s = sceneOf(id);
      expect(s.frames === 1, id).toBe(true);
    }
    expect(sceneOf('05_feu').still).toBe(false);
  });
  it('l’avatar a un dessin à chaque place, de face, de trois quarts (au repos) ou en saluant', () => {
    // (une scène en néon fait passer tout avatar par le kit et son rendu néon : ces dessins de la bibliothèque sont alors
    // son secours, si le kit n'a pas pu se charger)
    for (const id of [...used, '00_carte']) {
      const spot = sceneOf(id).avatar;
      if (!spot) continue;
      for (const look of LOOKS) {
        const frames = avatarFrames(look, { ...spot, neon: false });
        expect(frames.length, `${id} ${look}`).toBeGreaterThan(0);
        expect(frames.every(Boolean), `${id} ${look}`).toBe(true);
        expect(frames[0], `${id} ${look}`).toContain(spot.naufrage ? `${look}-naufrage/` : `${look}/`);
      }
    }
    // De trois quarts, au repos : l'image de la marche où les pieds se rejoignent
    expect(avatarFrames('avatar-02', { vue: 'dos', pose: 'repos' })).toEqual([expect.stringMatching(/avatar-02-naufrage_dos_marche_2\.svg/)]);
    // Assis les mains tendues vers le feu, ou debout les mains tendues : les gestes de la bibliothèque
    expect(avatarFrames('avatar-03', { vue: 'avant', pose: 'assis-mains-tendues', naufrage: false })).toEqual([expect.stringMatching(/avatar-03_avant_assis-mains-tendues_1\.svg/), expect.stringMatching(/_2\.svg/)]);
    expect(avatarFrames('avatar-03', { vue: 'avant', pose: 'mains-tendues' })[0]).toMatch(/avatar-03-naufrage_avant_mains-tendues_1\.svg/);
    // De dos, assis les mains tendues vers le feu qui est devant lui (le conseil)
    expect(avatarFrames('avatar-03', { vue: 'dos', pose: 'assis-mains-tendues', naufrage: false })).toEqual([expect.stringMatching(/avatar-03_dos_assis-mains-tendues_1\.svg/), expect.stringMatching(/_2\.svg/)]);
    // Un avatar inconnu (un appareil d'avant) : celui par défaut
    expect(avatarFrames('autre')[0]).toMatch(/avatar-01-naufrage_face_repos_1/);
  });
  it('l’avatar se pose sur ses pieds, agrandi, en miroir autour d’eux ; sur la carte, dans la photo', () => {
    expect(avatarBox({ x: 200, y: 344, echelle: 2 })).toEqual({ x: 152, y: 220, w: 96, h: 128, mirror: null, clip: null });
    expect(avatarBox({ x: 336, y: 396, echelle: 1, miroir: true }).mirror).toBe('translate(672 0) scale(-1 1)');
    expect(avatarBox(sceneOf('00_carte').avatar).clip).toEqual({ x: 92, y: 150, width: 96, height: 116 });
  });

  it('la carte que le vent emporte porte déjà la photo et le nom du joueur, attachés à elle', () => {
    const { carte, plans } = sceneOf('00_tampon');
    expect(carte).toBeTruthy();
    expect(plans.find(p => p.id === 'photo')).toMatchObject({ dans: 'carte', href: null });
    // (la photo, cadrée comme sur la carte du prologue : sa largeur à l'échelle du tirage, plus grande que lui)
    const box = photoBox(carte.photo);
    expect(box.w).toBeGreaterThan(carte.photo[2]);
    expect(box.x).toBeLessThan(carte.photo[0]);
    // (les autres scènes n'en ont pas)
    expect(sceneOf('02_plage').carte).toBe(null);
  });
});
