// Les chemins de l'île : un SVG par pièce dans lib/chemins/, leur index (chemins.json : le nom, le cadre, le masque des
// raccords, les suites d'images), une planche (les 16 raccords, le creusement, les effets, un chemin qui serpente).
import path from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { PIECES, HD, chemin, cheminDeMasque } from './generateur_chemins.mjs';

const require = createRequire(import.meta.url);
const DIR = path.dirname(fileURLToPath(import.meta.url));
const { row, sheet, write, shoot } = require('./planche.js');
const LIB = path.join(DIR, 'lib', 'chemins');
const PNG = path.join(DIR, 'planches');

const index = { _lisez_moi: [
  'Les chemins de l\'île au format des cases du terrain : un losange isométrique de 64 × 32 (TW × TH de src/world/terrain.js), sans trait sur le bord pour que les cases se touchent.',
  'Les 16 raccords : le chemin part du centre vers le milieu des côtés où la case voisine est aussi un chemin. Masque : NE 1 (case x, y − 1), SE 2 (x + 1, y), SO 4 (x, y + 1), NO 8 (x − 1, y) ; raccords donne le fichier de chaque masque.',
  'Le creusement : 4 étapes (creuse_1 à creuse_4) que le jeu montre au fil du travail ; la dernière est le chemin tassé, droit (NE–SO). Les effets du coup de bêche (mottes, poussière, cailloux) : suites d\'images à enchaîner une fois, dans un cadre de 64 × 48 dont la case occupe le bas (décalée de 16 vers le bas).',
  `Haute définition : chaque fichier déclare ${HD} fois son cadre.`
], hd: HD, pieces: {}, raccords: {}, suites: {} };

const url = svg => `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
const img = (svg, c, k = 2.4) => `<img src="${url(svg)}" width="${c[2] * k}" height="${c[3] * k}" alt="" style="background:#F4EEDF;border-radius:6px">`;
let count = 0;
for (const p of PIECES) {
  const rel = `${p.id}.svg`;
  write(path.join(LIB, rel), chemin(p.id).svg); count++;
  index.pieces[p.id] = { nom: p.nom, cadre: p.cadre, fichier: rel };
  if (p.masque !== null) index.raccords[p.masque] = rel;
  if (p.suite) (index.suites[p.suite] = index.suites[p.suite] || { nom: p.nom, ms_par_image: p.ms, fichiers: [] }).fichiers.push(rel);
}
write(path.join(LIB, 'chemins.json'), JSON.stringify(index, null, 1));

const cells = [];
cells.push(row('Les 16 raccords', PIECES.filter(p => p.masque !== null).map(p => [img(chemin(p.id).svg, p.cadre), `${p.masque} · ${p.id.replace('chemin_', '')}`])));
for (const [s, v] of Object.entries(index.suites)) cells.push(row(s === 'creuse' ? 'Le creusement (4 étapes)' : v.nom, v.fichiers.map((f, i) => { const p = PIECES.find(x => `${x.id}.svg` === f); return [img(chemin(p.id).svg, p.cadre), `${i + 1}`]; })));
// en situation : un chemin qui serpente sur un bout d'île de 6 × 6 cases
const G = 6, voie = new Set(['0,2', '1,2', '2,2', '2,3', '2,4', '3,4', '4,4', '4,3', '5,3']);
const masque = (x, y) => (voie.has(`${x},${y - 1}`) ? 1 : 0) | (voie.has(`${x + 1},${y}`) ? 2 : 0) | (voie.has(`${x},${y + 1}`) ? 4 : 0) | (voie.has(`${x - 1},${y}`) ? 8 : 0);
// une case d'herbe seule, pour le décor autour du chemin
const herbeSeule = `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="128" viewBox="0 0 64 32">${require('./chemins.js').herbe('hs', 5)}</svg>`;
let carte = '';
for (let y = 0; y < G; y++) for (let x = 0; x < G; x++) {
  const id = voie.has(`${x},${y}`) ? cheminDeMasque(masque(x, y)) : null;
  carte += `<img src="${url(id ? chemin(id).svg : herbeSeule)}" width="90" height="45" style="position:absolute;left:${(x - y) * 45 + 45 * (G - 1)}px;top:${(x + y) * 22.5}px">`;
}
cells.push(row('En situation : les cases se raccordent', [[`<div style="position:relative;width:${90 * G}px;height:${45 * G}px;background:#9CC97A;border-radius:12px">${carte}</div>`, 'un chemin qui serpente']]));
await shoot([[path.join(PNG, 'chemins.png'), sheet('Les chemins de l\'île', `Cases du terrain (64 × 32), 16 raccords, le creusement en 4 étapes, les effets du coup de bêche. Fichiers déclarés × ${HD}.`, cells), 1300]]);
console.log('ok', count, 'SVG');
