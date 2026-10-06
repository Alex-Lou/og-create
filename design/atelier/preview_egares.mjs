// Lot M — les égarés (egares.js) : le petit fantôme, le petit zombie tout mou et les sept bêtes de brume, dans les
// vues des bêtes orientées (avant, dos ; le miroir donne les deux autres directions). SVG dans
// lib/egares/<sujet>/<sujet>_<vue>_<pose>.svg, cadre ajusté (fitFrame, ancre au sol sous l'égaré), index egares.json,
// planche, page animée.
import path from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { fitFrame, closeFit } from './fit.mjs';

const require = createRequire(import.meta.url);
const DIR = path.dirname(fileURLToPath(import.meta.url));
const { unique, row, sheet, animated, write, shoot } = require('./planche.js');
const G = require('./egares.js');
const LIB = path.join(DIR, 'lib', 'egares');
const PNG = path.join(DIR, 'planches');
const r2 = n => Math.round(n * 100) / 100;
const svgOf = (frame, body, s = 1) => `<svg xmlns="http://www.w3.org/2000/svg" width="${r2(frame[2] * s)}" height="${r2(frame[3] * s)}" viewBox="${frame.join(' ')}">${body}</svg>`;
const BASE = [-16, -26, 32, 30];

// [sujet, nom, dessin(vue, pose)]
const LIST = [
  ['fantome', 'Petit fantôme', (v, p) => G.fantome(v, p)],
  ['zombie', 'Petit zombie tout mou', (v, p) => G.zombie(v, p)],
  ...Object.entries(G.BETES).map(([climat, b]) => [`${b.nom.split(' (')[0].toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ /g, '-')}`, b.nom, (v, p) => G.bete(climat, v, p), climat])
];
const index = {
  _lisez_moi: [
    'Les égarés (HISTOIRE.md § 6.15) : les petites créatures que la brume laisse sortir la nuit. Grognons plus que méchants : ni coup, ni mal. Trait bleu nuit (#3B4763) pour toute la famille de la brume, au lieu du brun de l\'île.',
    'Vues des bêtes orientées : avant = il vient vers le bas à droite, dos = il s\'éloigne vers le haut à droite ; le miroir horizontal donne les deux autres directions. Ancre (0, 0) au sol sous l\'égaré ; prendre le cadre noté ici.',
    'Poses (avant) : marche1, marche2 (~240 ms) ; repos ; bouderie1, bouderie2 (un toucher le repousse : il recule et boude, ~500 ms, puis brume) ; fuite1, fuite2 (devant Anya, ~160 ms) ; luciole1 à luciole4 (une lumière le change en luciole : il s\'apaise et luit, rapetisse, devient une boule de lumière, la luciole s\'envole ; ~200 ms, une fois) ; brume1 à brume3 (il retourne dans la brume, ~220 ms, une fois). Poses (dos) : marche1, marche2, repos, fuite1, fuite2.',
    'Les bêtes de brume : une par climat (celui du morceau d\'île d\'où vient la nuit) ; ailleurs (le cœur, tempéré), le lapin de brume. Les fantômes et les zombies viennent de partout.'
  ],
  egares: {}
};
const cells = [], anim = [];
let count = 0;
for (const [sujet, nom, draw, climat] of LIST) {
  const sets = Object.fromEntries(Object.entries(G.POSES).map(([v, poses]) => [v, poses.map(p => [p, draw(v, p)])]));
  const frame = await fitFrame(BASE, Object.values(sets).flat().map(([, b]) => b));
  const files = {};
  for (const [v, list] of Object.entries(sets)) {
    files[v] = {};
    for (const [p, body] of list) { const rel = `${sujet}/${sujet}_${v}_${p}.svg`; write(path.join(LIB, rel), svgOf(frame, body)); files[v][p] = rel; count++; }
  }
  index.egares[sujet] = { nom, ...(climat ? { climat } : {}), cadre: frame, fichiers: files };
  const s = Math.min(3.6, 110 / Math.max(frame[2], frame[3]));
  const pick = (v, p) => sets[v].find(([q]) => q === p)[1];
  const show = [['avant', 'marche1', 'marche'], ['avant', 'repos', 'repos'], ['dos', 'marche1', 'dos'], ['avant', 'bouderie1', 'boude 1'], ['avant', 'bouderie2', 'boude 2'], ['avant', 'fuite1', 'fuit'], ['dos', 'fuite1', 'fuit (dos)'],
    ['avant', 'luciole1', 'luciole 1'], ['avant', 'luciole2', 'luciole 2'], ['avant', 'luciole3', 'luciole 3'], ['avant', 'luciole4', 'luciole 4'], ['avant', 'brume1', 'brume 1'], ['avant', 'brume2', 'brume 2'], ['avant', 'brume3', 'brume 3']];
  cells.push(row(nom, show.map(([v, p, cap]) => [svgOf(frame, unique(pick(v, p)), s), cap])));
  const box = (lab, list, timings, mirror) => ({ label: lab, frames: list.map(([v, p]) => svgOf(frame, unique(pick(v, p)), s)), timings, w: r2(frame[2] * s), h: r2(frame[3] * s), mirror });
  anim.push(
    box(`${nom} — marche`, [['avant', 'marche1'], ['avant', 'marche2']], [240]),
    box(`${nom} — dos (miroir)`, [['dos', 'marche1'], ['dos', 'marche2']], [240], true),
    box(`${nom} — touché : il boude, puis retourne dans la brume`, [['avant', 'marche1'], ['avant', 'bouderie1'], ['avant', 'bouderie2'], ['avant', 'brume1'], ['avant', 'brume2'], ['avant', 'brume3']], [700, 500, 700, 220, 220, 900]),
    box(`${nom} — une lumière le change en luciole`, [['avant', 'marche1'], ['avant', 'luciole1'], ['avant', 'luciole2'], ['avant', 'luciole3'], ['avant', 'luciole4']], [700, 300, 200, 200, 1000]),
    box(`${nom} — fuit devant Anya`, [['avant', 'fuite1'], ['avant', 'fuite2']], [160])
  );
}

write(path.join(LIB, 'egares.json'), JSON.stringify(index, null, 1));
write(path.join(DIR, 'egares_apercu.html'), animated('Les égarés', 'Lot M : le petit fantôme, le petit zombie tout mou, les bêtes de brume ; leur marche, la bouderie au toucher, la fuite devant Anya, le passage en luciole, le retour dans la brume.', [['Les égarés', anim]]));
await shoot([[path.join(PNG, 'egares.png'), sheet('Les égarés (lot M)', 'Trois quarts avant et dos (le miroir donne les deux autres directions). Trait bleu nuit : la famille de la brume. Grognons plus que méchants : touchés, ils boudent et retournent dans la brume ; une lumière les change en lucioles.', cells), 1500]]);
await closeFit();
console.log('ok', count, 'SVG');
