import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import DATA from '../design/bibliotheque/svg/scenes/tutoriel/scenes.json';

// Les scènes lourdes du tutoriel (demande de l'auteur, 16 oct.) : le jeu les peint une fois, figées (SceneArt) ; leur
// fond n'a plus aucune animation, et leur calque « anime » (design/atelier/figer.js), transparent, au même cadre
// 400 × 400, ne garde que l'essentiel vivant : au plus 30 animations, sans filtre
const read = file => readFileSync(fileURLToPath(new URL(`../design/bibliotheque/svg/scenes/tutoriel/${file}`, import.meta.url)), 'utf8');
const ANIMATIONS = /<(animate|animateTransform|animateMotion|set)\b/g;
const LOURDES = ['30_phare_porte', '12_veillee', '12_habits', '01_racines', '01_paupieres', '05_feu', '01_pont', '05_cercle', '03_livre', '06_silhouette', '01_carte', '02_rocher'];

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

