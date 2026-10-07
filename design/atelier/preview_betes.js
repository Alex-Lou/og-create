// Lot B — les bêtes de profil. SVG dans lib/animaux/<groupe>/<bête>/, une planche par groupe, page animée.
const path = require('path');
const { unique, row, sheet, animated, write, shoot } = require('./planche');
const Bt = require('./betes');
const { BOX } = Bt;

const LIB = path.join(__dirname, 'lib', 'animaux');
const OUT = path.join(__dirname, 'planches');
const WALK = ['marche1', 'marche2', 'repos', 'clignement', 'joie'];
const FLY = ['vol1', 'vol2', 'repos', 'joie'];
const POSE_FR = { marche1: 'marche 1', marche2: 'marche 2', repos: 'repos', clignement: 'clignement', joie: 'joie', vol1: 'vol 1', vol2: 'vol 2', nage1: 'nage 1', nage2: 'nage 2' };

// [groupe, fichier, libellé, cadre, poses, dessin(pose)]
const q = (id, v) => { const c = Bt.Q[id](v); return [c.size, WALK, p => Bt.quad(c, p)]; };
const b = (id, v) => { const c = Bt.B[id](v); return [c.size, WALK, p => Bt.bird(c, p)]; };
const LIST = [
  ['ferme', 'poule_rousse', 'Poule rousse', ...b('hen', 'rousse')], ['ferme', 'poule_blanche', 'Poule blanche', ...b('hen', 'blanche')],
  ['ferme', 'poule_noire', 'Poule noire', ...b('hen', 'noire')], ['ferme', 'poule_grise', 'Poule grise', ...b('hen', 'grise')],
  ['ferme', 'poussin', 'Poussin', ...b('chick')],
  ['ferme', 'vache', 'Vache', ...q('cow')], ['ferme', 'vache_rousse', 'Vache rousse', ...q('cow', 'rousse')],
  ['ferme', 'mouton', 'Mouton', ...q('sheep')], ['ferme', 'mouton_noir', 'Mouton noir', ...q('sheep', 'noir')],
  ['ferme', 'cochon', 'Cochon', ...q('pig')], ['ferme', 'cochon_tachete', 'Cochon tacheté', ...q('pig', 'tachete')],
  ['ferme', 'chevre', 'Chèvre', ...q('goat')], ['ferme', 'chevre_brune', 'Chèvre brune', ...q('goat', 'brune')],
  ['ferme', 'chat', 'Chat', ...q('cat')], ['ferme', 'chien', 'Chien', ...q('dog')],
  ['bois', 'cerf', 'Cerf', ...q('deer')], ['bois', 'renard', 'Renard', ...q('fox')], ['bois', 'lapin', 'Lapin', ...q('rabbit')],
  ['bois', 'herisson', 'Hérisson', ...q('hedgehog')], ['bois', 'ecureuil', 'Écureuil', ...q('squirrel')], ['bois', 'loutre', 'Loutre', ...q('otter')],
  ['eau', 'heron', 'Héron', ...b('heron')],
  ...['orange', 'blanc', 'or'].map(v => ['eau', `koi_${v}`, `Koï ${v}`, 'KOI', ['nage1', 'nage2', 'joie'], p => Bt.koi(v, p)]),
  ['climat', 'renard_polaire', 'Renard polaire (cimes)', ...q('snowFox')], ['climat', 'bouquetin', 'Bouquetin (cimes)', ...q('ibex')],
  ['climat', 'macareux', 'Macareux (landes)', ...b('puffin')], ['climat', 'poney', 'Poney (landes)', ...q('pony')],
  ['climat', 'grenouille', 'Grenouille (marais)', ...q('frog')], ['climat', 'tortue', 'Tortue (marais)', ...q('tortoise')],
  ['climat', 'fennec', 'Fennec (dunes)', ...q('fennec')], ['climat', 'chameau', 'Chameau (dunes)', ...q('camel')],
  ['climat', 'cameleon', 'Caméléon (jungle)', ...q('chameleon')], ['climat', 'toucan', 'Toucan (jungle)', ...b('toucan')],
  ['climat', 'salamandre', 'Salamandre (volcan)', ...q('salamander')], ['climat', 'corbeau', 'Corbeau (volcan)', ...b('crow')],
  ['bestiaire', 'mesange', 'Mésange', ...b('bird')],
  ...['jaune', 'bleu', 'lune'].map(v => ['bestiaire', `papillon_${v}`, `Papillon ${v}`, 'BUTTERFLY', FLY, p => Bt.butterfly(v, p)]),
  ['bestiaire', 'luciole', 'Luciole', 'FIREFLY', ['vol1', 'vol2', 'joie'], p => Bt.firefly(p)],
  ['bestiaire', 'abeille', 'Abeille', 'BEE', FLY, p => Bt.bee(p)],
  ['bestiaire', 'hibou', 'Hibou (de face)', 'OWL', WALK, p => Bt.owl(p)],
  ['bestiaire', 'meduse', 'Méduse', 'JELLY', ['0', '1'], p => Bt.jelly(+p)],
  ['familiers', 'tictac', 'Tic-Tac (abeille mécanique de Rivet)', 'TICTAC', FLY, p => Bt.bee(p, true)],
  ['familiers', 'amie_tictac', 'L\'amie de Tic-Tac (Rivet la fabrique quand on écrit Abeille)', 'TICTAC', FLY, p => Bt.beeFriend(p)],
  ['familiers', 'mousse', 'Mousse (renardeau de Sylve)', ...q('kit')],
  ['familiers', 'bocal_vide', 'Bocal d\'Ondin (vide)', 'BOWL', ['0'], () => Bt.bowl('vide', 0)],
  ['familiers', 'bocal_bulle', 'Bocal d\'Ondin (Bulle revenu)', 'BOWL', ['0', '1'], p => Bt.bowl('bulle', +p)],
  ['mer', 'dauphin', 'Dauphin', 'DOLPHIN', ['0', '1', '2'], p => Bt.dolphin(+p)],
  ['mer', 'baleine_dos', 'Baleine (dos qui souffle)', 'WHALE_BACK', ['0', '1'], p => Bt.whaleBack(+p)],
  ['mer', 'baleine_queue', 'Baleine (queue)', 'WHALE_FLUKE', ['0', '1'], p => Bt.whaleFluke(+p)],
  ...['sardine', 'dorade', 'volant'].map(v => ['mer', `poisson_${v}`, `Poisson ${v === 'volant' ? 'volant' : v}`, 'FISH', ['0', '1'], p => Bt.fish(v, +p)]),
  ['mer', 'mouette', 'Mouette', ...b('gull')]
];
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
