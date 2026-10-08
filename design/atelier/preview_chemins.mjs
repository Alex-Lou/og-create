// Les chemins de l'île : un SVG par pièce dans lib/chemins/, leur index (chemins.json : le nom, le cadre, les raccords
// par masque pour chaque sorte, les suites d'images), une planche (les raccords, le pavé, le creusement en 6 étapes,
// les effets, un chemin qui serpente et se creuse).
import path from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { PIECES, HD, chemin, cheminDeMasque, paveDeMasque, etapeDeMasque } from './generateur_chemins.mjs';

const require = createRequire(import.meta.url);
const DIR = path.dirname(fileURLToPath(import.meta.url));
const { row, sheet, write, shoot } = require('./planche.js');
const { herbe } = require('./chemins.js');
const LIB = path.join(DIR, 'lib', 'chemins');
const PNG = path.join(DIR, 'planches');

const index = { _lisez_moi: [
  'Les chemins de l\'île au format des cases du terrain : un losange isométrique de 64 × 32 (TW × TH de src/world/terrain.js), sans trait sur le bord pour que les cases se touchent.',
  'Les raccords : le chemin part du centre vers le milieu des côtés où la case voisine est aussi un chemin. Masque : NE 1 (case x, y − 1), SE 2 (x + 1, y), SO 4 (x, y + 1), NO 8 (x − 1, y). raccords donne, pour chaque masque, le fichier de chaque sorte : terre, terre_b (seconde variante, à alterner pour éviter la répétition), pave (le chemin amélioré), etape_1 à etape_5 (le creusement).',
  'Le creusement en 6 étapes, pour chaque raccord : 1 le tracé marqué, 2 l\'herbe coupée, 3 les mottes soulevées, 4 la tranchée, 5 les pierres posées, 6 le chemin de terre. Les effets (mottes, poussière, cailloux, pierre posée) : suites d\'images à enchaîner une fois, dans un cadre de 64 × 48 dont la case occupe le bas (décalée de 16 vers le bas).',
  `Haute définition : chaque fichier déclare ${HD} fois son cadre.`
], hd: HD, pieces: {}, raccords: {}, suites: {} };

const url = svg => `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
const img = (svg, c, k = 2) => `<img src="${url(svg)}" width="${c[2] * k}" height="${c[3] * k}" alt="" style="background:#F4EEDF;border-radius:6px">`;
let count = 0;
for (const p of PIECES) {
  write(path.join(LIB, `${p.id}.svg`), chemin(p.id).svg); count++;
  index.pieces[p.id] = { nom: p.nom, cadre: p.cadre, fichier: `${p.id}.svg` };
  if (p.suite) (index.suites[p.suite] = index.suites[p.suite] || { nom: p.nom, ms_par_image: p.ms, fichiers: [] }).fichiers.push(`${p.id}.svg`);
}
for (let m = 0; m < 16; m++) {
  index.raccords[m] = { terre: `${cheminDeMasque(m)}.svg`, terre_b: `${cheminDeMasque(m, 1)}.svg`, pave: `${paveDeMasque(m)}.svg` };
  for (let e = 1; e <= 5; e++) index.raccords[m][`etape_${e}`] = `${etapeDeMasque(e, m)}.svg`;
}
write(path.join(LIB, 'chemins.json'), JSON.stringify(index, null, 1));

const cells = [];
const M = [...Array(16).keys()];
const lab = m => `${m} · ${cheminDeMasque(m).replace('chemin_', '')}`;
cells.push(row('Le chemin de terre, les 16 raccords', M.map(m => [img(chemin(cheminDeMasque(m)).svg, [0, 0, 64, 32]), lab(m)])));
cells.push(row('Sa seconde variante (à alterner)', M.map(m => [img(chemin(cheminDeMasque(m, 1)).svg, [0, 0, 64, 32]), lab(m)])));
cells.push(row('Le chemin pavé (l\'amélioration)', M.map(m => [img(chemin(paveDeMasque(m)).svg, [0, 0, 64, 32]), lab(m)])));
for (const m of [5, 3, 15, 0]) cells.push(row(`Le creusement en 6 étapes, raccord ${lab(m)}`, [1, 2, 3, 4, 5, 6].map(e => [img(chemin(etapeDeMasque(e, m)).svg, [0, 0, 64, 32], 2.4), `étape ${e}`])));
for (const [s, v] of Object.entries(index.suites)) cells.push(row(v.nom, v.fichiers.map((fi, i) => [img(chemin(fi.replace('.svg', '')).svg, [0, 0, 64, 48]), `${i + 1}`])));
// en situation : un chemin qui serpente ; sa première moitié tassée, la suite en cours de creusement, une place pavée
const G = 6, voie = ['0,2', '1,2', '2,2', '2,3', '2,4', '3,4', '4,4', '4,3', '5,3'], dans = new Set(voie);
const masque = (x, y) => (dans.has(`${x},${y - 1}`) ? 1 : 0) | (dans.has(`${x + 1},${y}`) ? 2 : 0) | (dans.has(`${x},${y + 1}`) ? 4 : 0) | (dans.has(`${x - 1},${y}`) ? 8 : 0);
const herbeSeule = `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="128" viewBox="0 0 64 32">${herbe('hs', 5)}</svg>`;
let carte = '';
for (let y = 0; y < G; y++) for (let x = 0; x < G; x++) {
  const i = voie.indexOf(`${x},${y}`), m = masque(x, y);
  const id = i < 0 ? null : i < 2 ? paveDeMasque(m) : i < 5 ? cheminDeMasque(m, i % 2) : etapeDeMasque([5, 4, 3, 2][i - 5], m);
  carte += `<img src="${url(id ? chemin(id).svg : herbeSeule)}" width="96" height="48" style="position:absolute;left:${(x - y) * 48 + 48 * (G - 1)}px;top:${(x + y) * 24}px">`;
}
cells.push(row('En situation', [[`<div style="position:relative;width:${96 * G}px;height:${48 * G}px;background:#9CC97A;border-radius:12px">${carte}</div>`, 'pavé, puis terre (variantes alternées), puis le creusement qui avance']]));
await shoot([[path.join(PNG, 'chemins.png'), sheet('Les chemins de l\'île', `Cases du terrain (64 × 32) : le chemin de terre (deux variantes), le chemin pavé, le creusement en 6 étapes pour chaque raccord, les effets. Fichiers déclarés × ${HD}.`, cells), 1500]]);
console.log('ok', count, 'SVG');
