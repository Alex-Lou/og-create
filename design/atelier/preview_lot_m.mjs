// Lot M (suite) : le bâtiment embrumé, l'icône « Réparer », la cage aux poules et l'œuf, le crabe de la Grève, les signes
// d'Anya, l'éclat du souvenir retrouvé et les sept sceaux (lot_m.js). SVG dans lib/decor/embrume/, lib/decor/camp/poules/,
// lib/animaux/mer/crabe/, lib/decor/signes/, lib/decor/souvenir/, chacun avec son index ; cadres ajustés (fitFrame,
// l'ancre ne bouge pas) ; une planche, une page animée.
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { fitFrame, closeFit } from './fit.mjs';

const require = createRequire(import.meta.url);
const DIR = path.dirname(fileURLToPath(import.meta.url));
const { unique, row, sheet, animated, write, shoot } = require('./planche.js');
const M = require('./lot_m.js');
const { frame } = require('./troupe.js');
const { sleepFrame } = require('./dormeurs.js');
const { CAST } = require('./naufrages.js');
const LIB = path.join(DIR, 'lib');
const PNG = path.join(DIR, 'planches');
const BIB = path.join(DIR, '..', 'bibliotheque', 'svg');
const r2 = n => Math.round(n * 100) / 100;
const svgOf = (frame, body, s = 1) => `<svg xmlns="http://www.w3.org/2000/svg" width="${r2(frame[2] * s)}" height="${r2(frame[3] * s)}" viewBox="${frame.join(' ')}">${body}</svg>`;
let count = 0;
// un groupe d'images : cadre commun ajusté, fichiers numérotés (ou un seul fichier sans numéro)
async function groupe(dir, nom, base, frames) {
  const frame = await fitFrame(base, frames);
  const files = frames.map((b, i) => {
    const rel = frames.length > 1 ? `${nom}_${i + 1}.svg` : `${nom}.svg`;
    write(path.join(LIB, dir, rel), svgOf(frame, b)); count++;
    return rel;
  });
  return { frame, files, frames };
}
const cells = [], anim = [];
const box = (lab, g, timings, s, mirror) => ({ label: lab, frames: g.frames.map(b => svgOf(g.frame, unique(b), s)), timings, w: r2(g.frame[2] * s), h: r2(g.frame[3] * s), mirror });

// ---- 1. le bâtiment embrumé ----
const embrume = { _lisez_moi: [
  'Le bâtiment embrumé (HISTOIRE.md § 6.15) : quand un égaré l\'atteint, il ne produit plus jusqu\'à sa réparation. Le jeu grise le bâtiment (filtre CSS, par exemple grayscale(.8)) et pose par-dessus le calque de brume de son emprise : brume au pied, voile, deux écharpes de brume en travers. Ancre (0, 0) au centre de l\'emprise, comme les bâtiments (case de 80 × 40, échelle du jeu × 1,25).',
  'embrume_<n>x<n> : 3 images en boucle (~400 ms) ; embrume_<n>x<n>_guerison : 3 images, une fois (~180 ms, la dernière ~600 ms), à la réparation ou au passage d\'Anya, puis on retire le filtre ; embrume_nuage : 3 images en boucle (~500 ms), le petit nuage grognon à poser au-dessus du bâtiment comme une bulle de production (ancre : son pied) ; reparer_icone : 32 × 32, pour le bouton « Réparer » de la fiche.'
], calques: {} };
const BAT = { 1: 'decor/annexes/belvedere/belvedere_1.svg', 2: 'batiments/paliers/puits/puits_palier2_1.svg', 3: 'batiments/paliers/foyer/foyer_palier4_1.svg' };
const inner = f => fs.readFileSync(path.join(BIB, f), 'utf8').replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
for (const n of [1, 2, 3]) {
  const a = 40 * n, h = 34 + 40 * n;
  const base = [-a - 14, -h - 14, 2 * a + 28, h + 20 * n + 26];
  const g = await groupe('decor/embrume', `embrume_${n}x${n}`, base, [0, 1, 2].map(f => M.embrume(n, f)));
  const gg = await groupe('decor/embrume', `embrume_${n}x${n}_guerison`, base, [0, 1, 2].map(f => M.guerison(n, f)));
  embrume.calques[`${n}x${n}`] = { nom: `Brume du bâtiment embrumé, emprise ${n} × ${n}`, cadre: g.frame, ms_par_image: 400, fichiers: g.files };
  embrume.calques[`${n}x${n}_guerison`] = { nom: `Guérison du bâtiment embrumé, emprise ${n} × ${n}`, cadre: gg.frame, ms_par_image: [180, 180, 600], fichiers: gg.files };
  // la planche : sur un vrai bâtiment de cette emprise (grisé), puis la guérison
  const bat = inner(BAT[n]), s = 190 / g.frame[2];
  const sur = (b, gris) => svgOf(g.frame, unique((gris ? `<g style="filter:grayscale(.8) brightness(.95)">${bat}</g>` : bat) + b), s);
  cells.push(row(`Embrumé ${n} × ${n}`, [[sur('', false), 'le bâtiment'], ...g.frames.map((b, i) => [sur(b, true), `embrumé ${i + 1}`]), ...gg.frames.map((b, i) => [sur(b, false), `guérison ${i + 1}`]), [svgOf(g.frame, unique(g.frames[0]), s), 'le calque seul']]));
  anim.push({ label: `Embrumé ${n} × ${n}, puis réparé`, frames: [...g.frames, ...g.frames, ...gg.frames].map((b, i) => sur(b, i < 6)), timings: [400, 400, 400, 400, 400, 400, 180, 180, 900], w: r2(g.frame[2] * s), h: r2(g.frame[3] * s) });
}
const nu = await groupe('decor/embrume', 'embrume_nuage', [-24, -34, 48, 40], [0, 1, 2].map(f => M.nuage(f)));
embrume.calques.nuage = { nom: 'Petit nuage du bâtiment embrumé', cadre: nu.frame, ms_par_image: 500, fichiers: nu.files };
const ic = await groupe('decor/embrume', 'reparer_icone', [0, 0, 32, 32], [M.reparerIcone()]);
embrume.calques.reparer = { nom: 'Icône « Réparer »', cadre: [0, 0, 32, 32], fichiers: ic.files };
cells.push(row('Nuage et icône', [...nu.frames.map((b, i) => [svgOf(nu.frame, unique(b), 3), `nuage ${i + 1}`]), [svgOf([0, 0, 32, 32], unique(ic.frames[0]), 3), '« Réparer »']]));
anim.push(box('Le petit nuage du bâtiment embrumé', nu, [500], 3));
write(path.join(LIB, 'decor/embrume/embrume.json'), JSON.stringify(embrume, null, 1));

// ---- 2. la cage aux poules et l'œuf (étape 8) ----
const poules = { _lisez_moi: [
  'Étape 8 du tutoriel : la cage aux poules de la cuisine du navire, coincée sous les rochers de la Grève (2 images en boucle, ~300 ms : elle remue, les poules s\'agitent) ; touchée, elle s\'ouvre (cage_poules_ouverte) et les trois poules sortent (poule-rousse, poule-blanche, poule-noire des bêtes orientées).',
  'L\'œuf : posé au sol près de la poule qui l\'a pondu, et son icône 32 × 32 (bulle de production, fiche de la bête). Ancre (0, 0) au centre de la case, échelle du jeu × 1,25.'
], poules: {} };
const cg = await groupe('decor/camp/poules', 'cage_poules_coincee', [-50, -50, 100, 72], [M.cage('coincee', 0), M.cage('coincee', 1)]);
const co = await groupe('decor/camp/poules', 'cage_poules_ouverte', [-50, -50, 100, 72], [M.cage('ouverte', 0)]);
const oe = await groupe('decor/camp/poules', 'oeuf', [-10, -14, 20, 17], [M.oeuf()]);
const oi = await groupe('decor/camp/poules', 'oeuf_icone', [0, 0, 32, 32], [M.oeufIcone()]);
Object.assign(poules.poules, {
  cage_coincee: { nom: 'Cage aux poules du navire, coincée sous les rochers', cadre: cg.frame, ms_par_image: 300, fichiers: cg.files },
  cage_ouverte: { nom: 'Cage aux poules du navire, ouverte', cadre: co.frame, fichiers: co.files },
  oeuf: { nom: 'Œuf', cadre: oe.frame, fichiers: oe.files },
  oeuf_icone: { nom: 'Œuf (icône)', cadre: [0, 0, 32, 32], fichiers: oi.files }
});
write(path.join(LIB, 'decor/camp/poules/poules.json'), JSON.stringify(poules, null, 1));
cells.push(row('Cage aux poules, œuf', [...cg.frames.map((b, i) => [svgOf(cg.frame, unique(b), 2.2), `coincée ${i + 1}`]), [svgOf(co.frame, unique(co.frames[0]), 2.2), 'ouverte'], [svgOf(oe.frame, unique(oe.frames[0]), 4), 'œuf'], [svgOf([0, 0, 32, 32], unique(oi.frames[0]), 3), 'icône']]));
anim.push(box('La cage coincée (elle remue)', cg, [300], 2.2));

// ---- 3. le crabe de la Grève (étape 8) ----
const crabe = { _lisez_moi: ['Le crabe de la Grève (étape 8) : de face, il marche de côté vers la droite (le miroir pour la gauche). Poses des bêtes de profil : marche1, marche2 (~260 ms), repos, clignement, joie (touché : pinces en l\'air, un cœur). Ancre (0, 0) au sol sous le crabe.'], betes: {} };
const CR = ['marche1', 'marche2', 'repos', 'clignement', 'joie'];
const crBodies = CR.map(p => M.crabe(p));
const crFrame = await fitFrame([-14, -22, 28, 24], crBodies);
crabe.betes.crabe = { nom: 'Crabe de la Grève', cadre: crFrame, fichiers: CR.map((p, i) => { const rel = `crabe_${p}.svg`; write(path.join(LIB, 'animaux/mer/crabe', rel), svgOf(crFrame, crBodies[i])); count++; return rel; }) };
write(path.join(LIB, 'animaux/mer/crabe/crabe.json'), JSON.stringify(crabe, null, 1));
cells.push(row('Crabe de la Grève', CR.map((p, i) => [svgOf(crFrame, unique(crBodies[i]), 4), p])));
anim.push({ label: 'Le crabe marche de côté', frames: crBodies.slice(0, 2).map(b => svgOf(crFrame, unique(b), 4)), timings: [260], w: r2(crFrame[2] * 4), h: r2(crFrame[3] * 4) });

// ---- 4. les signes d'Anya ----
const signes = { _lisez_moi: ['Les signes d\'Anya qui erre (HISTOIRE.md § 6.14, § 17) : là où elle passe, les fleurs s\'ouvrent (4 images, une fois : ~600, 300, 300 ms, la dernière reste) et les lucioles se rassemblent (4 images en boucle, ~220 ms). Les bêtes tournées du même côté n\'ont pas de dessin : le jeu tourne les bêtes déjà là. Ancre (0, 0) au centre de la case, échelle du jeu × 1,25.'], signes: {} };
const fl = await groupe('decor/signes', 'fleurs_ouverture', [-30, -40, 60, 50], [0, 1, 2, 3].map(f => M.fleurs(f)));
const lu = await groupe('decor/signes', 'lucioles_rassemblees', [-30, -52, 60, 58], [0, 1, 2, 3].map(f => M.lucioles(f)));
signes.signes.fleurs = { nom: 'Signe d\'Anya : des fleurs qui s\'ouvrent', cadre: fl.frame, ms_par_image: [600, 300, 300, 1500], fichiers: fl.files };
signes.signes.lucioles = { nom: 'Signe d\'Anya : des lucioles rassemblées', cadre: lu.frame, ms_par_image: 220, fichiers: lu.files };
write(path.join(LIB, 'decor/signes/signes.json'), JSON.stringify(signes, null, 1));
cells.push(row('Signes d\'Anya', [...fl.frames.map((b, i) => [svgOf(fl.frame, unique(b), 2.6), `fleurs ${i + 1}`]), ...lu.frames.map((b, i) => [`<div style="background:#2E3A50;border-radius:6px">${svgOf(lu.frame, unique(b), 2.6)}</div>`, `lucioles ${i + 1}`])]));
anim.push(box('Les fleurs s\'ouvrent', fl, [600, 300, 300, 1500], 2.6), box('Les lucioles se rassemblent', lu, [220], 2.6));

// ---- 5. l'éclat du souvenir retrouvé, les sept sceaux ----
const souvenir = { _lisez_moi: [
  'Le souvenir retrouvé (HISTOIRE.md § 14) : un éclat doré part du Grimoire vers le naufragé ; à l\'arrivée, une gerbe de lumière l\'enveloppe ; son sceau s\'allume au-dessus de sa tête ; il se lève, outil en main.',
  'eclat : 4 images en boucle (~90 ms), ancre au centre de l\'éclat ; le jeu le fait glisser du Grimoire jusqu\'à la poitrine du naufragé.',
  'arrivee : 5 images, une fois (~120, 160, 200, 220, 260 ms), ancre aux pieds du naufragé, posée par-dessus lui ; le jeu remplace le naufragé (pose endormi) par le maître (pose « action », l\'outil en main) sous l\'éclair de l\'image 1.',
  'sceaux : un par chapitre, ancre au centre ; éteint (1 image), allumé (2 images en boucle, ~500 ms), posé au-dessus de la tête du maître (centre ~8 au-dessus du haut de sa tête). Sigles de src/book/grimoire.js.'
], souvenir: {} };
const ec = await groupe('decor/souvenir', 'eclat', [-14, -14, 28, 28], [0, 1, 2, 3].map(f => M.eclat(f)));
const ar = await groupe('decor/souvenir', 'arrivee', [-24, -72, 48, 76], [0, 1, 2, 3, 4].map(f => M.arrivee(f)));
souvenir.souvenir.eclat = { nom: 'L\'éclat doré du souvenir (du Grimoire au naufragé)', cadre: ec.frame, ms_par_image: 90, fichiers: ec.files };
souvenir.souvenir.arrivee = { nom: 'La gerbe de lumière sur le naufragé', cadre: ar.frame, ms_par_image: [120, 160, 200, 220, 260], fichiers: ar.files };
const sceauxG = [];
for (const [i, [cle, nom]] of M.SCEAUX.entries()) {
  const off = await groupe('decor/souvenir', `sceau_${cle}_eteint`, [-15, -15, 30, 30], [M.sceau(i, false)]);
  const on = await groupe('decor/souvenir', `sceau_${cle}_allume`, [-15, -15, 30, 30], [0, 1].map(f => M.sceau(i, true, f)));
  souvenir.souvenir[`sceau_${cle}`] = { nom: `Sceau de ${nom}`, cadre: on.frame, ms_par_image: 500, fichiers: { eteint: off.files, allume: on.files } };
  sceauxG.push({ nom, off, on });
}
write(path.join(LIB, 'decor/souvenir/souvenir.json'), JSON.stringify(souvenir, null, 1));
{
  // la planche : l'éclat ; la gerbe posée sur Ondin ; les sceaux éteints puis allumés ; la séquence complète
  const O = CAST.find(c => c.base.name === 'Ondin');
  const at = (b, x, y) => `<g transform="translate(${x} ${y})">${b}</g>`;
  const VB = [0, -16, 48, 80];
  const seq = [sleepFrame(O.nau, 0) + at(ec.frames[1], 6, 4), sleepFrame(O.nau, 1) + at(ar.frames[0], 24, 62),
    frame(O.base, 'front', 'action', 0) + at(ar.frames[2], 24, 62) + at(sceauxG[2].on.frames[0], 24, -2), frame(O.base, 'front', 'action', 1) + at(sceauxG[2].on.frames[1], 24, -2)];
  cells.push(row('Souvenir : l\'éclat', ec.frames.map((b, i) => [svgOf(ec.frame, unique(b), 3), `éclat ${i + 1}`])));
  cells.push(row('La gerbe (sur Ondin)', ar.frames.map((b, i) => [svgOf(VB, unique(frame(i < 2 ? O.nau : O.base, 'front', i < 2 ? 'repos' : 'action', 0) + at(b, 24, 62)), 2.4), `arrivée ${i + 1}`])));
  cells.push(row('Les sept sceaux éteints', sceauxG.map(g => [svgOf(g.off.frame, unique(g.off.frames[0]), 2.6), g.nom])));
  cells.push(row('Les sept sceaux allumés', sceauxG.map(g => [svgOf(g.on.frame, unique(g.on.frames[0]), 2.6), g.nom])));
  cells.push(row('La séquence', seq.map((b, i) => [svgOf(VB, unique(b), 2.4), ['l\'éclat arrive', 'la gerbe', 'il se lève', 'outil en main, sceau allumé'][i]])));
  anim.push(box('L\'éclat du souvenir', ec, [90], 3));
  anim.push({ label: 'Le souvenir d\'Ondin revient', frames: [sleepFrame(O.nau, 0), sleepFrame(O.nau, 1), ...ar.frames.map((b, i) => (i < 1 ? sleepFrame(O.nau, 0) : frame(O.base, 'front', 'action', 0)) + at(b, 24, 62) + (i >= 2 ? at(sceauxG[2].on.frames[i % 2], 24, -2) : '')), frame(O.base, 'front', 'action', 1) + at(sceauxG[2].on.frames[1], 24, -2)].map(b => svgOf(VB, unique(b), 3)), timings: [700, 700, 120, 160, 200, 220, 260, 1400], w: 144, h: 240 });
  anim.push(box('Le sceau de la Lune s\'allume', sceauxG[2].on, [500], 3));
}

write(path.join(DIR, 'lot_m_apercu.html'), animated('Lot M : la nuit et le tutoriel', 'Le bâtiment embrumé puis réparé, le petit nuage, la cage aux poules, le crabe, les signes d\'Anya, l\'éclat du souvenir retrouvé.', [['Lot M', anim]]));
await shoot([[path.join(PNG, 'lot_m.png'), sheet('Lot M : le bâtiment embrumé, la cage aux poules, le crabe, les signes d\'Anya, l\'éclat du souvenir', 'Le jeu grise le bâtiment embrumé et pose par-dessus le calque de son emprise ; la réparation (ou Anya) le guérit. Échelle du jeu × 1,25.', cells), 1500]]);
await closeFit();
console.log('ok', count, 'SVG');
