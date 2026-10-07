// Les scènes du tutoriel dessinées par la bibliothèque (game/sceneArt.js) : chaque scène a ses images, et l'avatar du
// joueur trouve un dessin pour chacune de ses places, quel que soit l'exemple choisi sur la carte d'embarquement
import { describe, it, expect } from 'vitest';
import { sceneOf, avatarFrames, avatarBox, LOOKS, DEFAULT_LOOK } from '@/game/sceneArt';
import { SCENES } from '@/game/prologueScenes';

const used = [...new Set(Object.values(SCENES).flat().map(frame => frame.scene).filter(Boolean))];

describe('les scènes de la bibliothèque', () => {
  it('douze avatars, chacun avec sa tenue naufragée', () => {
    expect(LOOKS).toHaveLength(12);
    expect(DEFAULT_LOOK).toBe('avatar-01');
    for (const look of LOOKS) expect(avatarFrames(look, { naufrage: true })[0], look).toMatch(/-naufrage_face_repos_1\.svg/);
  });
  it('chaque scène du tutoriel a toutes ses images, fond et devant', () => {
    for (const id of [...used, '00_carte']) {
      const scene = sceneOf(id);
      expect(scene, id).toBeTruthy();
      expect(scene.back, id).toHaveLength(scene.frames);
      expect(scene.back.every(Boolean) && scene.front.every(Boolean), id).toBe(true);
    }
    expect(sceneOf('inconnue')).toBe(null);
  });
  it('l’avatar a un dessin à chaque place, de face, de trois quarts (au repos) ou en saluant', () => {
    for (const id of [...used, '00_carte']) {
      const spot = sceneOf(id).avatar;
      if (!spot) continue;
      for (const look of LOOKS) {
        const frames = avatarFrames(look, spot);
        expect(frames.length, `${id} ${look}`).toBeGreaterThan(0);
        expect(frames.every(Boolean), `${id} ${look}`).toBe(true);
        expect(frames[0], `${id} ${look}`).toContain(spot.naufrage ? `${look}-naufrage/` : `${look}/`);
      }
    }
    // De trois quarts, au repos : l'image de la marche où les pieds se rejoignent
    expect(avatarFrames('avatar-02', { vue: 'dos', pose: 'repos' })).toEqual([expect.stringMatching(/avatar-02-naufrage_dos_marche_2\.svg/)]);
    // Un avatar inconnu (un appareil d'avant) : celui par défaut
    expect(avatarFrames('autre')[0]).toMatch(/avatar-01-naufrage_face_repos_1/);
  });
  it('l’avatar se pose sur ses pieds, agrandi, en miroir autour d’eux ; sur la carte, dans la photo', () => {
    expect(avatarBox({ x: 200, y: 344, echelle: 2 })).toEqual({ x: 152, y: 220, w: 96, h: 128, mirror: null, clip: null });
    expect(avatarBox({ x: 336, y: 396, echelle: 1, miroir: true }).mirror).toBe('translate(672 0) scale(-1 1)');
    expect(avatarBox(sceneOf('00_carte').avatar).clip).toEqual({ x: 92, y: 150, width: 96, height: 116 });
  });
});
