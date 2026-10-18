// Le tirage des arrivants et du bouton « Au hasard » de l'atelier (design/personnages/avatar_choix.js : assorti ; choix de
// l'auteur, 18 oct.) : une tenue prise dans une palette accordée, des cheveux et des yeux naturels presque toujours, des cheveux qui vont avec l'âge, au plus
// deux accessoires sobres dans les couleurs de la tenue ; toujours la même tenue pour la même graine ; auHasard ne bouge
// pas (les dessins de la bibliothèque en dépendent). Le module du jeu (generateur/avatar.mjs) tire les mêmes.
import { describe, it, expect } from 'vitest';
import { createRequire } from 'node:module';
import * as KIT from '../design/bibliotheque/generateur/avatar.mjs';

const require = createRequire(import.meta.url);
const A = require('../design/personnages/avatar_choix.js');
const SEEDS = Array.from({ length: 400 }, (_, i) => i * 7919 + 13);
const SOBRES = new Set(['bonnet', 'paille', 'casquette', 'bandana', 'beret', 'lunettesRondes', 'lunettesCarrees', 'foulard', 'echarpe', 'coquillage', 'puces', 'anneaux', 'sacDos', 'besace']);

describe('le tirage assorti des arrivants', () => {
  it('toujours le même pour une graine, valide, et le même dans le module du jeu', () => {
    for (const n of SEEDS.slice(0, 50)) {
      expect(A.assorti(n)).toEqual(A.assorti(n));
      expect(A.verifier(A.assorti(n))).toEqual(A.assorti(n));
      expect(KIT.assorti(n)).toEqual(A.assorti(n));
    }
  });

  it('le haut, le bas et les chaussures viennent d\'une même palette ; les accessoires, de son accent et de son métal', () => {
    for (const n of SEEDS) {
      const o = A.assorti(n);
      const palettes = A.TENUES.filter(([h, b, p]) => h.includes(o.couleurHaut) && b.includes(o.couleurBas) && p.includes(o.chaussures));
      expect(palettes.length, `graine ${n}`).toBeGreaterThan(0);
      const accessoires = Object.values(o.accessoires);
      expect(accessoires.length).toBeLessThanOrEqual(2);
      for (const a of accessoires) {
        expect(SOBRES.has(a.id), a.id).toBe(true);
        expect(palettes.some(([, , , accents, metal]) => a.couleurs.every(c => accents.includes(c) || c === 'creme' || c === metal)), `${n} ${a.id}`).toBe(true);
      }
    }
  });

  it('gratuit : seulement ce qui est libre ; jamais rien à la main ni de tenue de saison', () => {
    for (const n of SEEDS) {
      for (const a of Object.values(A.assorti(n).accessoires)) {
        expect(A.ACCESSOIRES[a.id].source).toBe('gratuit');
        expect(A.ACCESSOIRES[a.id].emplacement).not.toBe('main');
        expect(A.ACCESSOIRES[a.id].saison).toBeUndefined();
      }
    }
  });

  it('des cheveux naturels presque toujours, gris ou blancs le plus souvent pour les âgés, jamais de fantaisie passé l\'âge mûr', () => {
    const naturels = new Set(['jais', 'noir', 'chocolat', 'brun', 'auburn', 'roux', 'cuivre', 'chatain', 'venitien', 'blond', 'platine', 'gris', 'blanc']);
    const tous = SEEDS.map(n => A.assorti(n));
    expect(tous.filter(o => naturels.has(o.cheveux)).length / tous.length).toBeGreaterThan(0.9);
    const ages = tous.filter(o => o.age === 'age');
    expect(ages.filter(o => o.cheveux === 'gris' || o.cheveux === 'blanc').length / ages.length).toBeGreaterThan(0.7);
    for (const o of tous.filter(o => o.age === 'mur' || o.age === 'age')) expect(naturels.has(o.cheveux), o.cheveux).toBe(true);
    // ni barbe ni moustache pour un jeune ou une femme
    for (const o of tous.filter(o => o.age === 'jeune' || o.genre === 'femme')) expect([o.barbe, o.moustache]).toEqual(['sans', 'sans']);
  });

  // (la graine du visiteur 1 de la bibliothèque, troupe_liste.js : son tirage d'avant assorti, relevé sur master)
  it('auHasard ne change pas', () => {
    const o = A.auHasard(1007, { gratuit: false });
    expect([o.coupe, o.cheveux, o.couleurHaut, o.couleurBas, Object.values(o.accessoires).map(a => a.id)]).toEqual(['locks', 'blanc', 'charbon', 'caramel', ['bandana', 'canne']]);
  });
});
