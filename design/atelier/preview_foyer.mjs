// Le Foyer redessiné dans la bibliothèque (choix de l'auteur, 18 oct. : la refonte des bâtiments, un à la fois, le Foyer
// d'abord) : ses entrées de batiments.json (paliers, l'hiver, les cadres de ses skins et de ses pièces rares), puis ses
// fichiers, écrits par le générateur du jeu (generateur_batiments.mjs, qui dessine le Foyer avec foyer.js) ; les
// fichiers que le nouveau découpage en images rend inutiles sont retirés (accord de l'auteur, 18 oct.).
// node design/atelier/preview_foyer.mjs
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(DIR, '..', 'bibliotheque', 'svg', 'batiments');
const INDEX = path.join(ROOT, 'batiments.json');
const FOYER = require('./foyer.js');
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];

// 1. l'index
const B = JSON.parse(fs.readFileSync(INDEX, 'utf8'));
const avant = new Set([...Object.entries(B.paliers), ...Object.entries(B.paliers_hiver)].filter(([k]) => k.startsWith('foyer_')).flatMap(([, e]) => e.fichiers));
const noms = (lv, hiver) => {
  const n = FOYER.PALIERS[lv - 1].images, base = `${hiver ? 'paliers_hiver' : 'paliers'}/foyer/foyer_palier${lv}${hiver ? '_hiver' : ''}`;
  return n === 1 ? [`${base}.svg`] : Array.from({ length: n }, (_, k) => `${base}_${k + 1}.svg`);
};
FOYER.PALIERS.forEach((P, i) => {
  const lv = i + 1, emprise = lv <= 3 ? '2 × 2' : '3 × 3', anim = P.images > 1 ? { ms_par_image: P.ms, animations: P.animations } : {};
  B.paliers[`foyer_palier${lv}`] = { nom: `Foyer — palier ${ROMAN[i]}`, fichiers: noms(lv, false), cadre: P.cadre, emprise, ...anim, lumieres: P.lumieres, fumees: P.fumees };
  B.paliers_hiver[`foyer_palier${lv}_hiver`] = { nom: `Foyer — palier ${ROMAN[i]}, l'hiver`, ete: `foyer_palier${lv}`, fichiers: noms(lv, true), cadre: P.cadre, emprise, ...anim, lumieres: P.lumieres, fumees: P.fumees };
});
for (const e of [...Object.values(B.skins), ...Object.values(B.pieces_rares)]) if (e.batiment === 'foyer') e.cadres = e.fichiers.map(x => FOYER.PALIERS[+x.match(/palier(\d)/)[1] - 1].cadre);
fs.writeFileSync(INDEX, JSON.stringify(B, null, 1) + '\n');

// 2. les fichiers, par le générateur (lu après l'index : il y prend ses cadres)
const G = await import('./generateur_batiments.mjs');
const ecrire = (rel, svg) => { fs.mkdirSync(path.dirname(path.join(ROOT, rel)), { recursive: true }); fs.writeFileSync(path.join(ROOT, rel), svg + '\n'); };
let n = 0;
for (const hiver of [false, true]) for (let lv = 1; lv <= 7; lv++) noms(lv, hiver).forEach((rel, k) => { ecrire(rel, G.palier('foyer', lv, k + 1, hiver).svg); n++; });
for (const [id, e] of Object.entries(B.skins)) if (e.batiment === 'foyer') e.fichiers.forEach(rel => { ecrire(rel, G.skin(id, +rel.match(/palier(\d)/)[1]).svg); n++; });
for (const [id, e] of Object.entries(B.pieces_rares)) if (e.batiment === 'foyer') e.fichiers.forEach((rel, k) => { ecrire(rel, G.pieceRare(id, k + 1).svg); n++; });

// 3. les fichiers devenus inutiles
const apres = new Set([...Object.entries(B.paliers), ...Object.entries(B.paliers_hiver)].filter(([k]) => k.startsWith('foyer_')).flatMap(([, e]) => e.fichiers));
const retires = [...avant].filter(rel => !apres.has(rel));
for (const rel of retires) fs.rmSync(path.join(ROOT, rel), { force: true });
console.log(`Foyer : ${n} fichiers écrits, ${retires.length} retirés (${retires.join(', ')})`);
