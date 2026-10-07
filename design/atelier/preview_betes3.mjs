// Lot H — les bêtes orientées : trois quarts avant (« avant », la bête vient vers le bas à droite) et trois quarts dos
// (« dos », elle s'éloigne vers le haut à droite), comme la troupe ; le miroir donne les deux autres directions. Les
// mêmes 37 bêtes qui marchent que le lot B (betes.js), redessinées en volume par betes3.js. SVG rangés avec leur profil
// (lib/animaux/<groupe>/<bête>/<bête>_avant_<pose>.svg, _dos_<pose>.svg), cadre ajusté (fitFrame, ancre au sol sous
// la bête), index orientees.json, une planche par groupe, page animée.
import path from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { fitFrame, closeFit } from './fit.mjs';

const require = createRequire(import.meta.url);
const DIR = path.dirname(fileURLToPath(import.meta.url));
const { unique, row, sheet, animated, write, shoot } = require('./planche.js');
const Bt = require('./betes.js');
const { quad3, bird3 } = require('./betes3.js');
const { AVANT, DOS, ORIENTEES: LIST } = require('./betes_liste.js');
const LIB = path.join(DIR, 'lib', 'animaux');
const PNG = path.join(DIR, 'planches');
const r2 = n => Math.round(n * 100) / 100;
const svgOf = (frame, body, s = 1) => `<svg xmlns="http://www.w3.org/2000/svg" width="${r2(frame[2] * s)}" height="${r2(frame[3] * s)}" viewBox="${frame.join(' ')}">${body}</svg>`;

const POSE_FR = { marche1: 'marche1', marche2: 'marche2', repos: 'repos', clignement: 'clignement', joie: 'joie' };
const GROUPS = { ferme: 'La ferme', bois: 'Les bois', eau: 'L\'eau douce', climat: 'Les bêtes des climats', bestiaire: 'Le Bestiaire', familiers: 'Les familiers', mer: 'La mer' };

const index = {
  _lisez_moi: [
    'Les bêtes qui marchent, dans les directions de la troupe : avant = trois quarts avant (la bête vient vers le bas à droite), dos = trois quarts dos (elle s\'éloigne vers le haut à droite) ; le miroir horizontal donne le bas à gauche et le haut à gauche. Le profil (lot B) reste pour aller tout droit à gauche ou à droite.',
    'Ancre (0, 0) au sol sous le milieu de la bête, comme le profil. Le cadre est celui du profil, élargi juste ce qu\'il faut (les pieds avant descendent un peu sous l\'ancre, la tête avance) : prendre le cadre noté ici.',
    'Images : avant marche1, marche2, repos, clignement, joie (cœur) ; dos marche1, marche2, repos (on ne voit pas le visage). Marche à 260 ms par image, comme le profil.'
  ],
  betes: {}
};
const cells = Object.fromEntries(Object.keys(GROUPS).map(g => [g, []]));
const anim = Object.fromEntries(Object.keys(GROUPS).map(g => [g, []]));
let count = 0;

for (const [g, dir, label, { c, bird }] of LIST) {
  const draw = (view, p) => (bird ? bird3(c, view, p) : quad3(c, view, p));
  const av = AVANT.map(p => draw('avant', p)), ds = DOS.map(p => draw('dos', p));
  const base = Bt.BOX[c.size];
  const frame = await fitFrame(base, [...av, ...ds]);
  const files = { avant: [], dos: [] };
  av.forEach((body, i) => { const rel = `${g}/${dir}/${dir}_avant_${POSE_FR[AVANT[i]]}.svg`; write(path.join(LIB, rel), svgOf(frame, body)); files.avant.push(rel); count++; });
  ds.forEach((body, i) => { const rel = `${g}/${dir}/${dir}_dos_${POSE_FR[DOS[i]]}.svg`; write(path.join(LIB, rel), svgOf(frame, body)); files.dos.push(rel); count++; });
  index.betes[dir] = { nom: label, groupe: g, cadre: frame, fichiers: files };
  const s = Math.min(4.2, 120 / Math.max(frame[2], frame[3]));
  const prof = bird ? Bt.bird(c, 'marche1') : Bt.quad(c, 'marche1');
  cells[g].push(row(label, [[svgOf(base, unique(prof), s), 'profil'], ...[0, 1, 2, 4].map(i => [svgOf(frame, unique(av[i]), s), `avant · ${AVANT[i]}`]), ...[0, 1, 2].map(i => [svgOf(frame, unique(ds[i]), s), `dos · ${DOS[i]}`])]));
  const box = (lab, frames, mirror) => ({ label: lab, frames: frames.map(b => svgOf(frame, unique(b), s)), timings: [260], w: r2(frame[2] * s), h: r2(frame[3] * s), mirror });
  anim[g].push(box(`${label} — avant`, av.slice(0, 2)), box(`${label} — avant (miroir)`, av.slice(0, 2), true), box(`${label} — dos`, ds.slice(0, 2)), box(`${label} — dos (miroir)`, ds.slice(0, 2), true));
}

write(path.join(LIB, 'orientees.json'), JSON.stringify(index, null, 1));
write(path.join(DIR, 'betes_orientees_apercu.html'), animated('Les bêtes orientées', 'Lot H : trois quarts avant et dos, et leurs miroirs : les quatre directions de l\'île.', Object.entries(GROUPS).map(([g, t]) => [t, anim[g]])));
await shoot(Object.entries(GROUPS).map(([g, t]) => [path.join(PNG, `animaux_orientes_${g}.png`), sheet(`Bêtes orientées — ${t}`, 'Le profil (lot B), puis trois quarts avant et trois quarts dos ; le miroir donne les deux autres directions. Cadres du jeu × 1,25 élargis, ancre (0, 0) au sol sous la bête.', cells[g]), 1300]));
await closeFit();
console.log('ok', count, 'SVG');
