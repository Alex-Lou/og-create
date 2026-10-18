// Le papier néon (design/personnages/couleurs.js) : tous les dessins de personnages de la bibliothèque (l'avatar et ses
// exemples, les maîtres, les naufragés, les visiteurs, les nouveaux venus, Anya, le Passeur, les portraits, les icônes
// des accessoires) ont le trait indigo ; plus un seul trait brun du kit. Une image qui sortirait du kit sans passer par
// enPersonnage (une pose nouvelle, un nouveau personnage) se verrait ici.
import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const SVG = fileURLToPath(new URL('../design/bibliotheque/svg/', import.meta.url));
const PERSONNAGES = ['personnages', 'vivants/anya', 'vivants/passeur', 'portraits'];
const KIT = '#3C2819';
const fichiers = dir => readdirSync(dir).flatMap(n => { const p = join(dir, n); return statSync(p).isDirectory() ? fichiers(p) : n.endsWith('.svg') ? [p] : []; });

describe('encre des personnages', () => {
  it('aucun dessin de personnage ne garde le trait brun du kit', () => {
    const tous = PERSONNAGES.flatMap(d => fichiers(join(SVG, d)));
    expect(tous.length).toBeGreaterThan(1000);
    const bruns = tous.filter(f => readFileSync(f, 'utf8').includes(KIT)).map(f => f.slice(SVG.length));
    expect(bruns).toEqual([]);
  });
});
