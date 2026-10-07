// La torche de bois flotté (torche.js), objet de la boutique : allumée (3 images), éteinte, son icône, dans
// lib/decor/defenses/ avec leur index (defenses.json : le cadre, la vitesse, la lumière de nuit pour le jeu) ; une planche
// (les états, l'échelle à côté de la lanterne et de la clôture, la nuit et sa lumière, l'icône en vraie taille).
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const DIR = path.dirname(fileURLToPath(import.meta.url));
const { unique, row, sheet, write, shoot } = require('./planche.js');
const { torche, torcheIcone, LUMIERE, TETE } = require('./torche.js');
const LIB = path.join(DIR, 'lib', 'decor', 'defenses');
const BIB = path.join(DIR, '..', 'bibliotheque', 'svg');
const PNG = path.join(DIR, 'planches');
const CADRE = [-50, -115, 100, 140]; // le cadre des créations posées sur une case (decor.json)
const MS = 111;
const svgOf = (frame, body, s = 1) => `<svg xmlns="http://www.w3.org/2000/svg" width="${frame[2] * s}" height="${frame[3] * s}" viewBox="${frame.join(' ')}">${body}</svg>`;
const inner = f => fs.readFileSync(path.join(BIB, f), 'utf8').replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');

const allumee = [0, 1, 2].map(n => torche('allumee', n));
const eteinte = torche('eteinte');
const icone = torcheIcone();
allumee.forEach((b, n) => write(path.join(LIB, `torche_allumee_${n + 1}.svg`), svgOf(CADRE, b)));
write(path.join(LIB, 'torche_eteinte.svg'), svgOf(CADRE, eteinte));
write(path.join(LIB, 'torche_icone.svg'), svgOf([0, 0, 32, 32], icone));
const [u, v, z, rayon, couleur] = LUMIERE;
write(path.join(LIB, 'defenses.json'), JSON.stringify({ _lisez_moi: [
  'Les défenses de la nuit (HISTOIRE.md § 6.15, § 14) : la torche de bois flotté. Elle s\'achète à la boutique (étape 12e) et se pose librement sur une case, comme une création : sur le chemin des égarés, sur les cases dorées (étape 12f). Sa lumière les repousse et les change en lucioles.',
  'Ancre (0, 0) au centre de la case, échelle du jeu × 1,25 (case de 80 × 40), le cadre des créations. allumee : 3 images en boucle (ms_par_image) ; eteinte : le jour, ou avant d\'être allumée ; icone : 32 × 32, pour la boutique et l\'inventaire.',
  'lumiere : la lumière de nuit, aux valeurs des créations du jeu (craftSprites.js, craftLight : [u, v, z, rayon, couleur]) ; z, la hauteur de la flamme, et rayon sont en px du jeu.',
  'Le même dessin sert la torche du camp (decor/camp/objets/torche) et celle de la veillée (scène 12_veillee).'
], defenses: { torche: {
  nom: 'Torche de bois flotté', cadre: CADRE,
  allumee: { nom: 'Torche de bois flotté, allumée', cadre: CADRE, ms_par_image: MS, fichiers: allumee.map((_, n) => `torche_allumee_${n + 1}.svg`) },
  eteinte: { nom: 'Torche de bois flotté, éteinte', cadre: CADRE, fichiers: ['torche_eteinte.svg'] },
  icone: { nom: 'Torche de bois flotté (icône)', cadre: [0, 0, 32, 32], fichiers: ['torche_icone.svg'] },
  lumiere: { u, v, z, rayon, couleur, jour: false }
} } }, null, 1));

// ---- la planche ----
const cells = [];
cells.push(row('Les états', [...allumee.map((b, n) => [svgOf(CADRE, unique(b), 2), `allumée ${n + 1}`]), [svgOf(CADRE, unique(eteinte), 2), 'éteinte']]));
// l'échelle : la clôture et la lanterne (créations de l'établi), la torche, sur des cases d'herbe
const cases = xs => xs.map(x => `<path d="M${x - 50},0 L${x},-25 L${x + 50},0 L${x},25 Z" fill="#9CC97A" stroke="#86B566" stroke-width="1"/>`).join('');
const ech = [-160, -115, 320, 150];
cells.push(row('À l\'échelle', [[svgOf(ech, cases([-100, 0, 100]) + `<g transform="translate(-100 0)">${unique(inner('decor/creations/cloture.svg'))}</g>` + unique(inner('decor/creations/lanterne_1.svg')) + `<g transform="translate(100 0)">${unique(allumee[0])}</g>`, 1.6), 'la clôture, la lanterne, la torche']]));
// la nuit : la lumière de la torche (rayon du jeu × 1,25), un égaré qui rôde dehors, un autre changé en luciole dedans
const R = rayon * 1.25, fy = TETE - 9;
const nuit = [-140, -100, 280, 140];
const scene = cases([-100, 0, 100, -50, 50]) + `<rect x="-140" y="-100" width="280" height="140" fill="rgba(16,24,52,.62)"/>`
  + `<circle cx="0" cy="${fy}" r="${R * 0.7}" fill="rgba(255,190,100,.12)"/>`
  + `<ellipse cx="0" cy="0" rx="${R}" ry="${R / 2}" fill="rgba(255,190,100,.2)" stroke="rgba(255,214,140,.75)" stroke-width="1" stroke-dasharray="4 3"/>`
  + `<g transform="translate(26 14)">${unique(inner('egares/fantome/fantome_avant_luciole_3.svg'))}</g>` + unique(allumee[1])
  + `<g transform="translate(96 16)">${unique(inner('egares/fantome/fantome_avant_marche_1.svg'))}</g>`;
cells.push(row('La nuit', [[svgOf(nuit, scene, 2), `sa lumière au sol (rayon ${rayon} px du jeu) : un égaré rôde dehors, un autre devient luciole dedans`]]));
const fonds = [['#FBF5E8', 'papier'], ['rgb(30,22,16)', 'verre'], ['#E0A93A', 'or']];
cells.push(row('L\'icône', [[svgOf([0, 0, 32, 32], unique(icone), 3), '× 3'], ...fonds.map(([bg, lab]) => [`<div style="display:flex;gap:6px;align-items:center;padding:6px 8px;border-radius:8px;background:${bg}">${[32, 24, 16].map(px => `<svg xmlns="http://www.w3.org/2000/svg" width="${px}" height="${px}" viewBox="0 0 32 32">${unique(icone)}</svg>`).join('')}</div>`, lab])]));
await shoot([[path.join(PNG, 'torche.png'), sheet('La torche de bois flotté', 'Objet de la boutique, posée sur une case sur le chemin des égarés (HISTOIRE.md § 9, étape 12). Le même dessin sert le camp et la veillée. Échelle du jeu × 1,25.', cells), 1100]]);
console.log('torche : 3 images allumée, éteinte, icône');
