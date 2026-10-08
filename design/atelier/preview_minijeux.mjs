// Les pièces des mini-jeux : un SVG par pièce dans lib/minijeux/<jeu>/, leur index (minijeux.json : le nom, le cadre, les
// suites d'images et leur rythme), une planche (chaque pièce, puis une paroi montée) et une page animée.
import path from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { JEUX, HD, minijeu } from './generateur_minijeux.mjs';

const require = createRequire(import.meta.url);
const DIR = path.dirname(fileURLToPath(import.meta.url));
const { row, sheet, css, write, shoot } = require('./planche.js');
const LIB = path.join(DIR, 'lib', 'minijeux');
const PNG = path.join(DIR, 'planches');
const TITRES = { filon: 'Le Filon (la Carrière)' };

const index = { _lisez_moi: [
  'Les pièces des mini-jeux des bâtiments. Le Filon : un bloc de la paroi a un cadre de 32 × 32 ; les effets qui débordent du bloc (éclatement, étincelles, onde, éclats de couleur) ont un cadre de 48 × 48 centré sur le bloc (à poser 1,5 fois plus grand que le bloc, 8 unités de marge de chaque côté).',
  `Haute définition : chaque fichier déclare ${HD} fois son cadre. En CSS, l'afficher à la taille du bloc dans la paroi (les effets à 1,5 fois cette taille).`,
  'Pièces fixes : les blocs (tendre, dur, très dur) et leurs fissures, le trou. Boucles animées dans le SVG (SMIL, elles tournent seules dans un <img>) : l\'éclat des pierres, la lueur du filon, le signe ✦ (1 à 3). Suites d\'images (suites) à enchaîner une fois, au rythme de ms_par_image : le bloc qui éclate, la pioche, les étincelles, l\'onde, la pierre qui apparaît, ses éclats de couleur.'
], hd: HD, jeux: {} };

const url = svg => `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
const img = (svg, c, k = 3) => `<img src="${url(svg)}" width="${c[2] * k}" height="${c[3] * k}" alt="" style="background:#4A4440;border-radius:8px">`;
const cells = [];
let count = 0;
for (const [jeu, pieces] of Object.entries(JEUX)) {
  const ji = index.jeux[jeu] = { titre: TITRES[jeu], pieces: {}, suites: {} };
  for (const p of pieces) {
    const rel = `${jeu}/${p.id}.svg`;
    write(path.join(LIB, rel), minijeu(jeu, p.id).svg); count++;
    ji.pieces[p.id] = { nom: p.nom, cadre: p.cadre, fichier: rel };
    if (p.suite) (ji.suites[p.suite] = ji.suites[p.suite] || { nom: p.nom, ms_par_image: p.ms, fichiers: [] }).fichiers.push(rel);
  }
  // planche : les pièces fixes et animées, puis chaque suite sur une rangée
  const seules = pieces.filter(p => !p.suite);
  cells.push(row(TITRES[jeu], seules.map(p => [img(minijeu(jeu, p.id).svg, p.cadre), p.id])));
  for (const [s, v] of Object.entries(ji.suites)) cells.push(row(v.nom, v.fichiers.map((f, i) => { const p = pieces.find(x => `${jeu}/${x.id}.svg` === f); return [img(minijeu(jeu, p.id).svg, p.cadre, 2.4), `${i + 1}`]; })));
}
write(path.join(LIB, 'minijeux.json'), JSON.stringify(index, null, 1));
await shoot([[path.join(PNG, 'minijeux.png'), sheet('Les mini-jeux', `Le Filon : les blocs, le trou, les pierres, la lueur, les signes ; puis chaque suite d'images. Fichiers déclarés × ${HD}.`, cells), 1400]]);

// la page animée : les boucles tournent seules ; les suites s'enchaînent en CSS (une image visible à la fois)
let n = 0;
const suite = (svgs, c, ms, k = 3) => { const id = `s${n++}`, N = svgs.length; return `<style>.${id}{position:absolute;inset:0;opacity:0;animation:${id} ${N * ms}ms steps(1) infinite}@keyframes ${id}{0%{opacity:1}${Math.round(10000 / N) / 100}%{opacity:0}100%{opacity:0}}</style><div style="position:relative;width:${c[2] * k}px;height:${c[3] * k}px">${svgs.map((s, i) => `<div class="${id}" style="animation-delay:${-(N - i) * ms}ms">${img(s, c, k)}</div>`).join('')}</div>`; };
let html = `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Les mini-jeux</title><style>${css}</style></head><body><h1>Les mini-jeux</h1><p>Les boucles tournent dans le SVG ; les suites d'images sont enchaînées ici en boucle (dans le jeu : une fois, au coup).</p>`;
for (const [jeu, pieces] of Object.entries(JEUX)) {
  html += `<h2>${TITRES[jeu]}</h2><div class="grid">` + pieces.filter(p => !p.suite).map(p => `<div class="box">${img(minijeu(jeu, p.id).svg, p.cadre)}<div class="lab">${p.nom}</div></div>`).join('') + '</div><div class="grid">';
  for (const v of Object.values(index.jeux[jeu].suites)) { const ps = v.fichiers.map(f => pieces.find(x => `${jeu}/${x.id}.svg` === f)); html += `<div class="box">${suite(ps.map(p => minijeu(jeu, p.id).svg), ps[0].cadre, v.ms_par_image * 1.6)}<div class="lab">${v.nom}</div></div>`; }
  html += '</div>';
}
write(path.join(DIR, 'minijeux_apercu.html'), html + '</body></html>');
console.log('ok', count, 'SVG');
