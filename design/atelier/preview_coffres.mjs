// Lot I — les coffres : pour chaque rareté, fermé (2), ouverture (4), ouvert (2), rayons (2, calque facultatif) et
// une icône. SVG dans lib/coffres/<rareté>/, index coffres.json, planche, page animée.
import path from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { RARITIES, closed, opening, open, glow, icon } from './coffres.mjs';
import { coffre, coffreIcone } from './generateur_coffres.mjs';

const require = createRequire(import.meta.url);
const DIR = path.dirname(fileURLToPath(import.meta.url));
const { unique, row, sheet, animated, write, shoot } = require('./planche.js');
const LIB = path.join(DIR, 'lib', 'coffres');
const PNG = path.join(DIR, 'planches');
const svgOf = (vb, w, h, body, s = 1) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w * s}" height="${h * s}" viewBox="${vb}">${body}</svg>`;
const big = (b, s = 1) => svgOf('0 0 120 100', 120, 100, b, s), small = (b, s = 1) => svgOf('0 0 32 32', 32, 32, b, s);

const index = {
  _lisez_moi: [
    'Les coffres de la fenêtre d\'ouverture (ChestReveal) : cadre 120 × 100, comme le dessin du jeu ; un coffre par rareté (couleurs de world/chest.js).',
    'fermé : 2 images (un reflet passe, ~1200 ms) ; ouverture : 4 images à enchaîner une fois (il tremble à gauche, à droite, s\'entrouvre, s\'ouvre grand ; ~140 ms puis ~220 ms) ; ouvert : 2 images en boucle (~700 ms) ; rayons : calque facultatif à poser derrière le coffre ouvert (le jeu a déjà les siens en CSS) ; icône : 32 × 32, fermé, pour les listes.'
  ],
  coffres: {}
};
const cells = [], anim = [];
let count = 0;
for (const [key, r] of Object.entries(RARITIES)) {
  const sets = {
    ferme: [0, 1].map(n => closed(key, n)),
    ouverture: [0, 1, 2, 3].map(n => opening(key, n)),
    ouvert: [0, 1].map(n => open(key, n)),
    rayons: [0, 1].map(n => glow(key, n))
  };
  const files = {};
  // les fichiers sortent du générateur des coffres : le jeu dessine les mêmes
  for (const [state, frames] of Object.entries(sets)) files[state] = frames.map((b, n) => { const rel = `${key}/coffre_${key}_${state}_${n + 1}.svg`; write(path.join(LIB, rel), coffre(key, state, n + 1).svg); count++; return rel; });
  files.icone = `${key}/coffre_${key}_icone.svg`; write(path.join(LIB, files.icone), coffreIcone(key).svg); count++;
  index.coffres[key] = { nom: r.label, couleur: r.glow, cadre: [0, 0, 120, 100], fichiers: files };
  cells.push(row(r.label, [...sets.ferme.map((b, n) => [big(unique(b), 1.3), `fermé ${n + 1}`]), ...sets.ouverture.map((b, n) => [big(unique(b), 1.3), `ouverture ${n + 1}`]), ...sets.ouvert.map((b, n) => [big(unique(b), 1.3), `ouvert ${n + 1}`]), [big(unique(sets.rayons[0] + sets.ouvert[0]), 1.3), 'rayons + ouvert'], [small(unique(icon(key)), 3), 'icône']]));
  // la page : fermé, puis l'ouverture enchaînée, puis ouvert en boucle (une séquence complète)
  const seq = [...sets.ferme, sets.ferme[0], ...sets.ouverture, ...sets.ouvert, ...sets.ouvert];
  const t = [1200, 900, 600, 140, 140, 220, 400, 700, 700, 700, 700];
  anim.push({ label: `${r.label} : fermé, ouverture, ouvert`, frames: seq.map(b => big(unique(b), 2)), timings: t, w: 240, h: 200 });
}
write(path.join(LIB, 'coffres.json'), JSON.stringify(index, null, 1));
write(path.join(DIR, 'coffres_apercu.html'), animated('Les coffres', 'Lot I : fermé, l\'ouverture enchaînée, puis ouvert.', [['Les coffres', anim]]));
await shoot([[path.join(PNG, 'coffres.png'), sheet('Les coffres', 'Cadre 120 × 100 de la fenêtre d\'ouverture du jeu. Fermé, ouverture (4 images), ouvert, rayons (calque facultatif), icône 32 × 32.', cells), 1500]]);
console.log('ok', count, 'SVG');
