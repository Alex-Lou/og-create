// Le montage des bâtiments (montage.mjs) : les six étapes du chantier, en 2 × 2 et 3 × 3 cases (3 images chacune), le
// dévoilement (4 images), l'échafaudage d'évolution (derrière, devant ; 3 images), dans lib/batiments/montage/ avec leur
// index (montage.json : cadres, vitesses, ordre du spectacle, parts du temps du chantier qui dure) ; une planche. Les
// fichiers sortent des fonctions du générateur des chantiers (generateur_chantiers.mjs) : le jeu dessine les mêmes.
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { montage, devoilement, echafaudage } from './montage.mjs';
import { EMPRISES, ETAPES, PART, MS, IMAGES, etapeDuMontage, devoilementDuBatiment, echafaudageDEvolution } from './generateur_chantiers.mjs';

const require = createRequire(import.meta.url);
const DIR = path.dirname(fileURLToPath(import.meta.url));
const { unique, row, sheet, write, shoot } = require('./planche.js');
const LIB = path.join(DIR, 'lib', 'batiments', 'montage');
const BIB = path.join(DIR, '..', 'bibliotheque', 'svg');
const PNG = path.join(DIR, 'planches');
const K = 1.25;
const up = body => `<g transform="scale(${K})">${body}</g>`;
const svgOf = (frame, body, s = 1) => `<svg xmlns="http://www.w3.org/2000/svg" width="${frame[2] * s}" height="${frame[3] * s}" viewBox="${frame.join(' ')}">${body}</svg>`;
const inner = f => fs.readFileSync(path.join(BIB, f), 'utf8').replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');

const R = { '2x2': 1, '3x3': 1.5 }; // la demi-emprise, pour le sol des planches
const NOMS = {
  piquets: 'le terrain marqué (piquets, guirlande, tracé à la chaux, le plan sur sa caisse)',
  terrassement: 'la terre retournée (le tas et la pelle, la brouette)',
  fondations: 'les fondations (la dalle de pierre, le mortier, les pierres de taille)',
  charpente: 'la charpente (poteaux, sablières, écharpes, l\'échelle, le seau pendu)',
  murs: 'les murs (colombages, porte et fenêtres, l\'échafaudage)',
  toit: 'le toit (tuiles à moitié posées, le bouquet de faîte)'
};
const index = { _lisez_moi: [
  'Le montage d\'un bâtiment, étape par étape : le terrain marqué, la terre retournée, les fondations, la charpente, les murs, le toit. Les mêmes étapes servent au petit spectacle (elles défilent quand on bâtit) et au chantier qui dure (une étape par part du temps).',
  'Ancre (0, 0) au centre de l\'emprise au sol, échelle du jeu × 1,25 (case de 80 × 40), comme les paliers : 2 × 2 cases (paliers I à III), 3 × 3 (paliers IV à VII). Toutes les images d\'une emprise ont le même cadre : on passe d\'une étape à l\'autre sans rien déplacer.',
  'Chaque étape : 3 images en boucle (ms_par_image) ; la guirlande et les rubans flottent, le seau se balance, la poussière vole.',
  'spectacle : quand on bâtit, les étapes défilent dans l\'ordre (ms_par_etape chacune), puis le bâtiment paraît (le dessin du palier) et le dévoilement se joue par-dessus lui, une fois (4 images).',
  'chantier_qui_dure : part, de 0 à 1, où chaque étape commence ; à 1, le bâtiment est là, et le dévoilement se joue.',
  'echafaudage : pour une évolution qui dure, autour du bâtiment déjà là ; derriere se dessine avant lui, devant après lui, dans son repère. De III à IV (2 × 2 vers 3 × 3), prendre celui de 3 × 3.',
  'Les trois phases du chantier qui attend (batiments/chantier : plan pas trouvé, plan trouvé, prêt à bâtir) restent ce qu\'elles sont.'
], spectacle: { ordre: ETAPES, ms_par_etape: MS.spectacle, puis: 'le bâtiment, et le dévoilement par-dessus' }, chantier_qui_dure: { part: PART }, montage: {} };

const cells = [];
const ecrire = (f, r) => { write(path.join(LIB, f), r.svg); return f; };
const n1 = k => Array.from({ length: k }, (_, i) => i + 1);
for (const [em, E] of Object.entries(EMPRISES)) {
  const entree = { nom: `Montage d'un bâtiment, ${E.nom}`, cadre: E.cadre, etapes: {} };
  for (const etape of ETAPES) {
    const fichiers = n1(IMAGES.etape).map(n => ecrire(`${em}/montage_${em}_${etape}_${n}.svg`, etapeDuMontage(em, etape, n)));
    entree.etapes[etape] = { nom: `Montage ${E.nom} : ${NOMS[etape]}`, cadre: E.cadre, ms_par_image: MS.etape, part: PART[etape], fichiers };
  }
  entree.devoilement = { nom: `Dévoilement du bâtiment fini, ${E.nom} (une fois, par-dessus le bâtiment)`, cadre: E.cadre, ms_par_image: MS.devoilement, fichiers: n1(IMAGES.devoilement).map(n => ecrire(`${em}/devoilement_${em}_${n}.svg`, devoilementDuBatiment(em, n))) };
  entree.echafaudage = {};
  for (const couche of ['derriere', 'devant']) {
    entree.echafaudage[couche] = { nom: `Échafaudage d'évolution, ${E.nom}, ${couche === 'derriere' ? 'derrière le bâtiment' : 'devant le bâtiment'}`, cadre: E.cadre, ms_par_image: MS.etape, fichiers: n1(IMAGES.echafaudage).map(n => ecrire(`${em}/echafaudage_${em}_${couche}_${n}.svg`, echafaudageDEvolution(em, couche, n))) };
  }
  index.montage[em] = entree;
}
write(path.join(LIB, 'montage.json'), JSON.stringify(index, null, 1));

// ---- la planche ----
const sol = R => { const c = [[-R, -R], [R, -R], [R, R], [-R, R]].map(([u, v]) => `${(u - v) * 40},${(u + v) * 20}`).join(' '); return `<polygon points="${c}" fill="#A9D67E" stroke="#8FBF66" stroke-width="1"/>`; };
const vue = (em, body, s) => svgOf(EMPRISES[em].cadre, sol(R[em]) + unique(body), s);
for (const em of Object.keys(EMPRISES)) {
  const s = em === '2x2' ? 1.02 : 0.7;
  cells.push(row(`Le montage, ${EMPRISES[em].nom}`, ETAPES.map((e, i) => [vue(em, up(montage(em, e, 0)), s), `${i + 1}. ${e}`])));
}
cells.push(row('Une étape en boucle (le toit : les rubans du bouquet flottent)', [0, 1, 2].map(n => [vue('2x2', up(montage('2x2', 'toit', n)), 1.4), `image ${n + 1}`])));
const fini = [['2x2', 'batiments/paliers/foyer/foyer_palier3.svg'], ['3x3', 'batiments/paliers/foyer/foyer_palier4_1.svg']];
for (const [em, f] of fini) cells.push(row(`Le dévoilement, ${EMPRISES[em].nom} (par-dessus le bâtiment fini)`, [0, 1, 2, 3].map(n => [vue(em, inner(f) + up(devoilement(em, n)), em === '2x2' ? 1.2 : 0.82), `image ${n + 1}`])));
cells.push(row('L\'échafaudage d\'évolution (derrière, le bâtiment, devant)', fini.map(([em, f]) => [vue(em, up(echafaudage(em, 'derriere', 0)) + inner(f) + up(echafaudage(em, 'devant', 0)), em === '2x2' ? 1.2 : 0.82), EMPRISES[em].nom])));
await shoot([[path.join(PNG, 'montage.png'), sheet('Le montage des bâtiments', 'Les six étapes du chantier, en 2 × 2 et 3 × 3 cases : elles défilent quand on bâtit (le spectacle), ou suivent le temps d\'un chantier qui dure. Puis le dévoilement par-dessus le bâtiment fini ; l\'échafaudage des évolutions. Échelle du jeu × 1,25.', cells), 1500]]);
console.log('montage :', ETAPES.length * 2 * 3, 'images d\'étapes, 8 de dévoilement, 12 d\'échafaudage');
