// Lot B — les bêtes de profil. SVG dans lib/animaux/<groupe>/<bête>/, une planche par groupe, page animée.
const path = require('path');
const { unique, row, sheet, animated, write, shoot } = require('./planche');
const Bt = require('./betes');
const { BOX } = Bt;
const { WALK, PROFILS: LIST } = require('./betes_liste');

const LIB = path.join(__dirname, 'lib', 'animaux');
const OUT = path.join(__dirname, 'planches');
const POSE_FR = { marche1: 'marche 1', marche2: 'marche 2', repos: 'repos', clignement: 'clignement', joie: 'joie', vol1: 'vol 1', vol2: 'vol 2', vol3: 'vol 3', vol4: 'vol 4', envol1: 'envol 1', envol2: 'envol 2', envol3: 'envol 3', plane: 'plane', nage1: 'nage 1', nage2: 'nage 2' };

const GROUPS = { ferme: 'La ferme', bois: 'Les bois', eau: 'L\'eau douce', climat: 'Les bêtes des climats (lot 9e)', bestiaire: 'Le Bestiaire', familiers: 'Les familiers', mer: 'La mer' };

const svgOf = (size, body, scale = 1) => {
  const [x, y, w, h] = BOX[size];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${r(w * scale)}" height="${r(h * scale)}" viewBox="${x} ${y} ${w} ${h}">${body}</svg>`;
};
const r = n => Math.round(n * 100) / 100;

const shots = [], anim = [];
let count = 0;
for (const [g, title] of Object.entries(GROUPS)) {
  const rows = [], boxes = [];
  for (const [grp, file, label, size, poses, draw] of LIST.filter(e => e[0] === g)) {
    const [, , w, h] = BOX[size];
    const scale = Math.min(5, 150 / Math.max(w, h));
    const frames = poses.map(p => draw(p));
    frames.forEach((body, i) => { write(path.join(LIB, grp, file, `${file}_${(POSE_FR[poses[i]] || 'image ' + (+poses[i] + 1)).replace(/ /g, '')}.svg`), svgOf(size, body)); count++; });
    rows.push(row(label, frames.map((body, i) => [svgOf(size, unique(body), scale), POSE_FR[poses[i]] || `image ${+poses[i] + 1}`])));
    // animation : la marche (ou le vol, la nage) en boucle ; une version miroir pour les marcheurs
    const loop = poses.filter(p => /^(marche|vol|nage|\d)/.test(p));
    const lf = loop.map(p => frames[poses.indexOf(p)]);
    const t = loop.map(() => /^vol/.test(loop[0]) ? 120 : /^\d/.test(loop[0]) ? 420 : 260);
    boxes.push({ label, frames: lf.map(body => svgOf(size, unique(body), scale)), timings: t, w: r(w * scale), h: r(h * scale) });
    if (poses === WALK) boxes.push({ label: label + ' (miroir)', frames: lf.map(body => svgOf(size, unique(body), scale)), timings: t, w: r(w * scale), h: r(h * scale), mirror: true });
  }
  shots.push([path.join(OUT, `animaux_${g}.png`), sheet(`Animaux — ${title}`, 'De profil, tournés vers la droite (miroir pour la gauche). Cadres du jeu × 1,25, ancre (0, 0) au sol.', rows), 1100]);
  anim.push([title, boxes]);
}
write(path.join(__dirname, 'animaux_apercu.html'), animated('Les bêtes en mouvement', 'Lot B : marche, vol et nage en boucle ; les marcheurs aussi en miroir.', anim));
shoot(shots).then(() => console.log('ok', count));
