// Les portraits HD des maîtres (personnages/portraits.js) : un SVG par maître et par expression dans lib/portraits/,
// les bulles d'émotion, leur index (portraits.json), une planche (chaque maître dans ses 21 expressions, les bulles, des
// avatars tirés au hasard) et une page animée (les SVG s'animent seuls, en SMIL).
import path from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { MAITRES, portraitMaitre, bullePortrait } from './generateur_portraits.mjs';

const require = createRequire(import.meta.url);
const DIR = path.dirname(fileURLToPath(import.meta.url));
const { row, sheet, css, write, shoot } = require('./planche.js');
const P = require('../personnages/portraits.js');
const A = require('../personnages/avatar.js');
const LIB = path.join(DIR, 'lib', 'portraits');
const PNG = path.join(DIR, 'planches');
const { EXPRESSIONS_PORTRAIT: EX, BULLES_PORTRAIT: BU, NOMS_EXPRESSIONS, NOMS_BULLES, TAILLE_PORTRAIT: T, HD_PORTRAIT: HD } = P;

const index = { _lisez_moi: [
  'Les portraits des maîtres pour les dialogues : le buste de face, cadré sur le visage, en 21 expressions (les 8 de l\'île repassées en HD, des émotions fortes, des expressions chibi « manga », des nuances du quotidien).',
  `Haute définition : chaque fichier déclare ${T * HD} × ${T * HD}, pour un affichage en ${T} × ${T} px (taille_affichage). L'afficher à cette taille en CSS.`,
  'Animés en SMIL dans le SVG : les yeux clignent, les larmes coulent, les cœurs montent, les étoiles scintillent, le buste bouge (rire, peur, étourdi). Ça tourne seul dans un <img> ou un background CSS ; sur un canvas (drawImage), on voit une image fixe.',
  'Les bulles d\'émotion (bulles) se posent par-dessus n\'importe quel portrait, à la même taille et au même endroit : en haut à droite.',
  'Le portrait de l\'avatar du joueur se compose à partir de ses choix : generateur/avatar.mjs, portrait(avatar(choix), expression) et bulle(clé).'
], taille_affichage: [T, T], expressions: NOMS_EXPRESSIONS, bulles: {}, portraits: {} };

const url = svg => `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
const img = (svg, px) => `<img src="${url(svg)}" width="${px}" height="${px}" alt="" style="background:#EFE4CC;border-radius:10px">`;
const cells = [];
let count = 0;
for (const [id, c] of Object.entries(MAITRES)) {
  const fichiers = {};
  for (const e of EX) { const rel = `${id}/${id}-portrait_${e}.svg`; write(path.join(LIB, rel), portraitMaitre(id, e).svg); fichiers[e] = rel; count++; }
  index.portraits[id] = { nom: c.name, fichiers };
  cells.push(row(c.name, EX.map(e => [img(P.portrait(c, e, { fixe: true, uid: `f${id}${e}` }).svg, 64), NOMS_EXPRESSIONS[e].replace(/ \(.*/, '')])));
}
for (const k of BU) { const rel = `bulles/bulle_${k}.svg`; write(path.join(LIB, rel), bullePortrait(k).svg); index.bulles[k] = { nom: NOMS_BULLES[k], fichier: rel }; count++; }
write(path.join(LIB, 'portraits.json'), JSON.stringify(index, null, 1));

// La planche : les maîtres, les bulles posées sur un portrait, quatre avatars tirés au hasard (le portrait suit les choix)
const sur = (fond, dessus, px) => `<div style="position:relative;width:${px}px;height:${px}px">${img(fond, px)}<img src="${url(dessus)}" width="${px}" height="${px}" alt="" style="position:absolute;inset:0"></div>`;
cells.push(row('Bulles', BU.map(k => [sur(P.portrait(MAITRES.aster, 'neutre', { fixe: true, uid: `b${k}` }).svg, P.bulle(k, { fixe: true }).svg, 96), NOMS_BULLES[k]])));
const avatars = [1, 2, 3, 4].map(i => A.avatar(A.auHasard(i * 7919)));
for (const [i, c] of avatars.entries()) cells.push(row(`Avatar ${i + 1}`, ['neutre', 'content', 'rire', 'surpris', 'triste', 'fache', 'emerveille', 'adore', 'malicieux', 'pensif', 'crocodile', 'fier'].map(e => [img(P.portrait({ ...c, uid: `av${i}` }, e, { fixe: true, uid: `av${i}${e}` }).svg, 64), NOMS_EXPRESSIONS[e].replace(/ \(.*/, '')])));
await shoot([[path.join(PNG, 'portraits.png'), sheet('Les portraits', `Pour les dialogues : le buste de face, 21 expressions, affiché en ${T} px (fichiers déclarés × ${HD}), animé en SMIL (ici, une image fixe). Les bulles se posent par-dessus. L'avatar suit les choix du joueur.`, cells), 1560]]);

// La page animée : Aster dans toutes ses expressions, les maîtres contents, les bulles, deux avatars
const boite = (svg, lab, px = 120) => `<div class="box">${img(svg, px)}<div class="lab">${lab}</div></div>`;
let html = `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Les portraits</title><style>${css}</style></head><body><h1>Les portraits</h1><p>Les SVG s'animent seuls (SMIL) : clignement, larmes, cœurs, étoiles, Zzz, bulles.</p>`;
html += '<h2>Aster, ses 21 expressions</h2><div class="grid">' + EX.map(e => boite(portraitMaitre('aster', e).svg, NOMS_EXPRESSIONS[e])).join('') + '</div>';
html += '<h2>Les maîtres</h2><div class="grid">' + Object.entries(MAITRES).map(([id, c], i) => boite(portraitMaitre(id, ['content', 'rire', 'emerveille', 'adore', 'malicieux', 'determine', 'fier'][i]).svg, c.name)).join('') + '</div>';
html += '<h2>Les bulles</h2><div class="grid">' + BU.map(k => `<div class="box">${sur(P.portrait(MAITRES.cannelle, 'neutre', { uid: `pb${k}` }).svg, bullePortrait(k).svg, 120)}<div class="lab">${NOMS_BULLES[k]}</div></div>`).join('') + '</div>';
html += '<h2>L\'avatar, quel que soit son choix</h2><div class="grid">' + avatars.slice(0, 2).flatMap((c, i) => ['content', 'adore', 'crocodile', 'etourdi'].map(e => boite(P.portrait({ ...c, uid: `pa${i}` }, e, { uid: `pa${i}${e}` }).svg, `Avatar ${i + 1}, ${NOMS_EXPRESSIONS[e].replace(/ \(.*/, '').toLowerCase()}`))).join('') + '</div>';
write(path.join(DIR, 'portraits_apercu.html'), html + '</body></html>');
console.log('ok', count, 'SVG');
