// Les égarés : les cinq égarés du Voile (egares_voile.js : le Sans-Nom, le Dormeur, le Noyé de l'Hirondelle, la Racine
// errante, l'Esprit sylvestre revenant) et les sept bêtes de brume (egares.js), dans les vues des bêtes orientées
// (avant, dos ; le miroir donne les deux autres directions). SVG dans lib/egares/<sujet>/<sujet>_<vue>_<pose>.svg, cadre
// ajusté (fitFrame, ancre au sol sous l'égaré), index egares.json, planche, page animée.
import path from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { fitFrame, closeFit } from './fit.mjs';

const require = createRequire(import.meta.url);
const DIR = path.dirname(fileURLToPath(import.meta.url));
const { unique, row, sheet, animated, write, shoot } = require('./planche.js');
const G = require('./egares.js');
const { EGARES: LIST } = require('./betes_liste.js');
const LIB = path.join(DIR, 'lib', 'egares');
const PNG = path.join(DIR, 'planches');
const r2 = n => Math.round(n * 100) / 100;
const svgOf = (frame, body, s = 1) => `<svg xmlns="http://www.w3.org/2000/svg" width="${r2(frame[2] * s)}" height="${r2(frame[3] * s)}" viewBox="${frame.join(' ')}">${body}</svg>`;
// Le cadre de départ : celui des bêtes de brume ; les égarés du Voile, à l'échelle d'un habitant (l'Esprit un tiers plus
// grand), assez larges pour leur aura, leurs halos et la lumière qui s'élève
const BASE = [-16, -26, 32, 30];
const BASES = { fantome: [-20, -80, 54, 83], zombie: [-21, -64, 45, 67], noye: [-21, -62, 41, 65], racine: [-21, -58, 42, 61], esprit: [-26, -82, 44, 86] };

const index = {
  _lisez_moi: [
    'Les égarés (HISTOIRE.md § 6.15, § 7.2) : la nuit, le Voile (une brume morte, sans voix, qui efface les noms, les mots, les visages) laisse sortir les égarés. Chacun est un morceau que le Voile a effacé et qui cherche ce qu\'il était. Ils ne font pas de mal : leur tristesse et leur étrangeté suffisent.',
    'Le niveau attendu (demande de l\'auteur du 14 oct., version 2) : mystérieux et poétiques, beaux et un peu inquiétants, jamais mignons ni comiques. Petits mais pas des bébés : environ deux têtes et demie, à l\'échelle d\'un habitant (l\'Esprit un tiers plus grand), des silhouettes élancées ou voûtées qu\'on reconnaît en ombre chinoise, des mains aux doigts longs. Le visage épuré : deux lueurs pâles, ou des yeux clos ; l\'expression passe par la posture. Des volumes et des matières, un contre-jour de lune bleu-argent sur les bords, des ombres profondes, une palette froide, désaturée et riche.',
    'La règle du souvenir (les cinq égarés du Voile) : le corps est en brume (bleus-gris translucides, trait bleu nuit #3B4763, le bas qui s\'effiloche en volutes). Un seul détail garde ses couleurs chaudes d\'avant : le souvenir, net, saturé, au trait brun #3C2819 ; il pose sur l\'égaré le seul reflet chaud de la silhouette. Dans les poses luciole, c\'est le souvenir qui s\'allume et s\'envole : luciole1, il s\'apaise, le souvenir luit ; luciole2, le corps pâlit ; luciole3, il ne reste que le souvenir, devenu lumière ; luciole4, elle s\'élève.',
    'Vues des bêtes orientées : avant = il vient vers le bas à droite, dos = il s\'éloigne vers le haut à droite ; le miroir horizontal donne les deux autres directions. Ancre (0, 0) au sol sous l\'égaré ; prendre le cadre noté ici.',
    'Poses (avant) : marche1, marche2 (~240 ms) ; repos ; bouderie1, bouderie2 (repoussé : il se détourne, avec dignité ; ~500 ms, puis brume) ; fuite1, fuite2 (devant Anya, ~160 ms) ; luciole1 à luciole4 (~200 ms, une fois) ; brume1 à brume3 (il retourne au Voile, ~220 ms, une fois). Poses (dos) : marche1, marche2, repos, fuite1, fuite2.',
    'Poses nouvelles : le Dormeur (zombie), dort1 et dort2 (une clôture l\'arrête et l\'endort : debout, le front baissé contre sa tablette, il respire lentement, un mot à demi formé luit puis s\'éteint ; ~1400 ms, en boucle) ; la Racine errante (racine), terre1 à terre3 (elle passe sous la clôture : elle s\'enfonce en soulevant la terre jusqu\'à ce qu\'il ne reste que le bourgeon ; ~260 ms ; le jeu les joue à l\'envers quand elle ressort). Le Noyé de l\'Hirondelle (noye) et l\'Esprit sylvestre revenant (esprit) : le jeu joue brume à l\'envers quand le Noyé sort de l\'eau (il se fond en eau, puis en vapeur) et quand l\'Esprit revient (il s\'effeuille, puis se recompose) : brume1 à brume3 se lisent dans les deux sens.',
    'Les égarés du Voile : le Sans-Nom (fantome ; un nom, celui d\'un passager de l\'Hirondelle : son étiquette de bagage, l\'encre a coulé), le Dormeur (zombie ; les mots d\'un Ancien : une tablette d\'argile cuite, vide, et un stylet), le Noyé de l\'Hirondelle (noye ; la nuit du naufrage : la bouée « L\'HIRONDE… »), la Racine errante (racine ; le nom d\'un arbre : un bourgeon vivant et sa baie), l\'Esprit sylvestre revenant (esprit ; la voix d\'Anya : une graine d\'ambre qui bat comme un cœur). Ils viennent de partout. Les bêtes de brume : une par climat (celui du morceau d\'île d\'où vient la nuit) ; ailleurs (le cœur, tempéré), le lapin de brume.'
  ],
  egares: {}
};
const cells = [], anim = [];
let count = 0;
for (const [sujet, nom, draw, climat, cle, plus] of LIST) {
  const poses = { avant: [...G.POSES.avant, ...plus], dos: G.POSES.dos };
  const sets = Object.fromEntries(Object.entries(poses).map(([v, list]) => [v, list.map(p => [p, draw(v, p)])]));
  const frame = await fitFrame(BASES[cle] || BASE, Object.values(sets).flat().map(([, b]) => b));
  const files = {};
  for (const [v, list] of Object.entries(sets)) {
    files[v] = {};
    for (const [p, body] of list) { const rel = `${sujet}/${sujet}_${v}_${p}.svg`; write(path.join(LIB, rel), svgOf(frame, body)); files[v][p] = rel; count++; }
  }
  index.egares[cle] = { nom, ...(climat ? { climat } : {}), cadre: frame, fichiers: files };
  const s = Math.min(3.6, 110 / Math.max(frame[2], frame[3]));
  const pick = (v, p) => sets[v].find(([q]) => q === p)[1];
  const show = [['avant', 'marche1', 'marche'], ['avant', 'repos', 'repos'], ['dos', 'marche1', 'dos'], ['avant', 'bouderie1', 'boude 1'], ['avant', 'bouderie2', 'boude 2'], ['avant', 'fuite1', 'fuit'], ['dos', 'fuite1', 'fuit (dos)'],
    ['avant', 'luciole1', 'luciole 1'], ['avant', 'luciole2', 'luciole 2'], ['avant', 'luciole3', 'luciole 3'], ['avant', 'luciole4', 'luciole 4'], ['avant', 'brume1', 'brume 1'], ['avant', 'brume2', 'brume 2'], ['avant', 'brume3', 'brume 3'],
    ...plus.map(p => ['avant', p, p.replace(/(\d)$/, ' $1')])];
  cells.push(row(nom, show.map(([v, p, cap]) => [svgOf(frame, unique(pick(v, p)), s), cap])));
  const box = (lab, list, timings, mirror) => ({ label: lab, frames: list.map(([v, p]) => svgOf(frame, unique(pick(v, p)), s)), timings, w: r2(frame[2] * s), h: r2(frame[3] * s), mirror });
  anim.push(
    box(`${nom} — marche`, [['avant', 'marche1'], ['avant', 'marche2']], [240]),
    box(`${nom} — dos (miroir)`, [['dos', 'marche1'], ['dos', 'marche2']], [240], true),
    box(`${nom} — repoussé : il se détourne, puis retourne au Voile`, [['avant', 'marche1'], ['avant', 'bouderie1'], ['avant', 'bouderie2'], ['avant', 'brume1'], ['avant', 'brume2'], ['avant', 'brume3']], [700, 500, 700, 220, 220, 900]),
    box(`${nom} — une lumière : son souvenir s'allume et s'envole`, [['avant', 'repos'], ['avant', 'luciole1'], ['avant', 'luciole2'], ['avant', 'luciole3'], ['avant', 'luciole4']], [700, 300, 200, 200, 1000]),
    box(`${nom} — fuit devant Anya`, [['avant', 'fuite1'], ['avant', 'fuite2']], [160])
  );
  // ce que le jeu joue à l'envers : le Noyé sort de l'eau, l'Esprit revient
  if (cle === 'noye' || cle === 'esprit') anim.push(box(`${nom} — ${cle === 'noye' ? 'il sort de l\'eau' : 'il revient'} (brume à l'envers)`, [['avant', 'brume3'], ['avant', 'brume2'], ['avant', 'brume1'], ['avant', 'repos']], [900, 220, 220, 900]));
  if (plus.includes('dort1')) anim.push(box(`${nom} — une clôture l'arrête et l'endort`, [['avant', 'dort1'], ['avant', 'dort2']], [1400]));
  if (plus.includes('terre1')) anim.push(box(`${nom} — elle passe sous la clôture, puis ressort`, [['avant', 'marche1'], ['avant', 'terre1'], ['avant', 'terre2'], ['avant', 'terre3'], ['avant', 'terre2'], ['avant', 'terre1'], ['avant', 'marche2']], [500, 260, 260, 900, 260, 260, 500]));
}

write(path.join(LIB, 'egares.json'), JSON.stringify(index, null, 1));
write(path.join(DIR, 'egares_apercu.html'), animated('Les égarés', 'Les cinq égarés du Voile (le Sans-Nom, le Dormeur, le Noyé de l\'Hirondelle, la Racine errante, l\'Esprit sylvestre revenant) et les bêtes de brume : leur marche, repoussés, la fuite devant Anya, le souvenir qui s\'allume et s\'envole, le retour au Voile ; le Dormeur qui s\'endort, la Racine qui passe sous la clôture.', [['Les égarés', anim]]));
await shoot([[path.join(PNG, 'egares.png'), sheet('Les égarés', 'Trois quarts avant et dos (le miroir donne les deux autres directions). Le corps en brume, au trait bleu nuit ; un seul détail garde ses couleurs chaudes : le souvenir, qui s\'allume et s\'envole quand une lumière l\'apaise. Repoussés, ils se détournent et retournent au Voile.', cells), 1500]]);
await closeFit();
console.log('ok', count, 'SVG');
