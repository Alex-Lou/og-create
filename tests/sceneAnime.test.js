import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import DATA from '../design/bibliotheque/svg/scenes/tutoriel/scenes.json';

// Les scènes lourdes du tutoriel (demande de l'auteur, 16 oct.) : le jeu les peint une fois, figées (SceneArt) ; leur
// fond n'a plus aucune animation, et leur calque « anime » (design/atelier/figer.js), transparent, au même cadre
// 400 × 400, ne garde que l'essentiel vivant : au plus 30 animations, sans filtre
const read = file => readFileSync(fileURLToPath(new URL(`../design/bibliotheque/svg/scenes/tutoriel/${file}`, import.meta.url)), 'utf8');
const ANIMATIONS = /<(animate|animateTransform|animateMotion|set)\b/g;
const LOURDES = ['30_phare_porte', '12_veillee', '12_habits', '05_feu', '05_cercle', '03_livre', '06_silhouette', '02_rocher'];

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


// Les scènes en plans (game/scenePlans.js) : chaque plan de papier, peint une fois, n'a aucune animation (le jeu le bouge
// lui-même) ; le plan « anime », au cadre 400 × 400, au plus 30, sans filtre ; leur partition, un temps par bulle
const EN_PLANS = Object.keys(DATA.scenes).filter(id => DATA.scenes[id].plans);
const croissant = cles => cles.every(([t], i) => typeof t === 'number' && t >= 0 && (i === 0 || t >= cles[i - 1][0]));

describe('les scènes en plans : des plans immobiles, une partition', () => {
  it('il y en a', () => expect(EN_PLANS.length).toBeGreaterThan(0));
  it.each(EN_PLANS)('%s', id => {
    const { plans, partition } = DATA.scenes[id];
    const ids = plans.map(p => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const plan of plans) {
      if (plan.id === 'avatar') continue;
      const svg = read(plan.fichier);
      expect(svg).not.toMatch(/<filter[\s>]|\sfilter="/);
      if (plan.id === 'anime') {
        expect(svg).toMatch(/^<svg [^>]*viewBox="0 0 400 400"/);
        expect((svg.match(ANIMATIONS) || []).length).toBeLessThanOrEqual(30);
      } else {
        const m = plan.marge || 0;
        expect(svg).toMatch(new RegExp(`^<svg [^>]*viewBox="${-m} ${-m} ${400 + 2 * m} ${400 + 2 * m}"`));
        expect(svg.match(ANIMATIONS)).toBeNull();
      }
    }
    expect(partition.temps.length).toBeGreaterThan(0);
    for (const temps of partition.temps) {
      expect(temps.duree).toBeGreaterThan(0);
      expect(croissant(temps.camera || [])).toBe(true);
      for (const [plan, cles] of Object.entries(temps.pistes || {})) {
        expect(ids).toContain(plan);
        expect(croissant(cles)).toBe(true);
        expect(cles[cles.length - 1][0]).toBeLessThanOrEqual(temps.duree);
      }
    }
  });
});
