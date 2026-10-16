import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import DATA from '../design/bibliotheque/svg/scenes/tutoriel/scenes.json';
import { SCENES } from '../src/texts/tutorial/scenes.js';
import { sceneOf } from '@/game/sceneArt';

// Les scènes lourdes du tutoriel (demande de l'auteur, 16 oct.) : le jeu les peint une fois, figées (SceneArt) ; leur
// fond n'a plus aucune animation, et leur calque « anime » (design/atelier/figer.js), transparent, au même cadre
// 400 × 400, ne garde que l'essentiel vivant : au plus 30 animations, sans filtre
const read = file => readFileSync(fileURLToPath(new URL(`../design/bibliotheque/svg/scenes/tutoriel/${file}`, import.meta.url)), 'utf8');
const ANIMATIONS = /<(animate|animateTransform|animateMotion|set)\b/g;
const LOURDES = ['30_phare_porte', '12_veillee', '12_veillee_longuevue', '12_habits', '01_racines', '01_paupieres', '05_feu', '01_pont', '05_cercle', '03_livre', '06_silhouette', '01_carte', '02_rocher'];

describe('les scènes lourdes : un fond figé, un calque anime léger', () => {
  it.each(LOURDES)('%s', id => {
    const { calques } = DATA.scenes[id];
    expect(calques.anime).toBeTruthy();
    for (const file of calques.fond.fichiers) expect(read(file).match(ANIMATIONS)).toBeNull();
    for (const file of calques.anime.fichiers) {
      const svg = read(file);
      expect(svg).toMatch(/^<svg [^>]*viewBox="0 0 400 400"/);
      expect((svg.match(ANIMATIONS) || []).length).toBeLessThanOrEqual(30);
      expect(svg).not.toMatch(/<filter[\s>]|\sfilter="/);
    }
  });
});


// Le papier découpé (choix de l'auteur, 16 oct.) : la veillée refaite, la caméra du jeu s'y avance ; la réplique de Lorena
// sur le phare se joue sur la variante où elle vise l'îlot à la longue-vue (même cadre, même avatar, mêmes calques)
describe('la veillée en papier découpé', () => {
  it('la caméra s’avance sur les trois scènes du camp', () => {
    for (const id of ['12_veillee', '12_veillee_longuevue', '12_habits']) expect(sceneOf(id).camera, id).toBe(true);
    expect(sceneOf('05_feu').camera).toBe(false);
  });
  it('Lorena et sa longue-vue, pour sa réplique sur le phare', () => {
    const veillee = DATA.scenes['12_veillee'], longuevue = DATA.scenes['12_veillee_longuevue'];
    expect(longuevue.cadre).toEqual(veillee.cadre);
    expect(longuevue.avatar).toEqual(veillee.avatar);
    expect(Object.keys(longuevue.calques)).toEqual(Object.keys(veillee.calques));
    const replique = SCENES['conseil-suite'].find(b => b.who === 'Lorena' && b.text.startsWith('Un phare. Éteint.'));
    expect(replique.scene).toBe('12_veillee_longuevue');
  });
});
