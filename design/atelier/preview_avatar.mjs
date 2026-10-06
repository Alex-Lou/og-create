// Lot L : l'avatar du joueur (HISTOIRE.md § 6.17). Le kit est un générateur, comme les habitants du jeu : on compose
// l'avatar à partir de ses choix. Ce script en tire des exemples pour la bibliothèque, la planche des choix et une
// page animée :
//   - grand format (design/personnages/avatar.js, kit de la troupe) : lib/personnages/avatar/avatar-NN/ ;
//   - naufragé (avatar_naufrage.js) : lib/personnages/avatar/avatar-NN-naufrage/ ;
//   - petit format du jeu (lookPetit + villagers.js) : lib/personnages/avatar/petit_format/avatar-NN[-naufrage]/.
// Noms déjà rangés (<sujet>_<vue>_<pose>_<n>) ; le trois quarts avant du grand format sort du kit vers le bas à gauche,
// l'assemblage le publie en miroir (catalogue.js), comme pour les maîtres.
import path from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { villagerSprite, VILLAGER_BOX } from './port/src/world/villagers.js';

const require = createRequire(import.meta.url);
const DIR = path.dirname(fileURLToPath(import.meta.url));
const { frame, EXPRS } = require('./troupe.js');
const { avatar, lookPetit, CHOIX, LIBELLES, libelle, DEFAUT } = require('../personnages/avatar.js');
const { avatarNaufrage } = require('./avatar_naufrage.js');
const { unique, row, sheet, animated, write, shoot } = require('./planche.js');

const LIB = path.join(DIR, 'lib', 'personnages', 'avatar');
const PNG = path.join(DIR, 'planches');
const r2 = n => Math.round(n * 100) / 100;
const K = 1.25;
const grand = (body, s = 1) => `<svg xmlns="http://www.w3.org/2000/svg" width="${48 * s}" height="${64 * s}" viewBox="0 0 48 64">${body}</svg>`;
const inner = s => s.svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
const BOX = [VILLAGER_BOX.x, VILLAGER_BOX.y, VILLAGER_BOX.w, VILLAGER_BOX.h].map(n => r2(n * K));
const WIDE = [-26, -66, 56, 72].map(n => r2(n * K));
const petit = (frame_, body, s = 1) => `<svg xmlns="http://www.w3.org/2000/svg" width="${r2(frame_[2] * s)}" height="${r2(frame_[3] * s)}" viewBox="${frame_.join(' ')}">${body}</svg>`;
const VUE = { front: 'face', se: 'avant', ne: 'dos' };

// Huit exemples qui couvrent tous les choix (coupes, peaux, hauts, accessoires, silhouettes)
const EXEMPLES = [
  {},
  { coupe: 'longue', cheveux: 'roux', rousseur: 'oui', yeux: 'vert', haut: 'pull', couleurHaut: 'lavande', couleurBas: 'creme', silhouette: 'fine', chaussures: 'toile' },
  { coupe: 'bouclee', cheveux: 'noir', peau: 'cacao', haut: 'chemise', couleurHaut: 'ciel', couleurBas: 'sable', silhouette: 'large', accessoire: 'lunettes', sourcils: 'epais' },
  { coupe: 'queue', cheveux: 'blond', peau: 'porcelaine', yeux: 'bleu', haut: 'veste', couleurHaut: 'marine', couleurBas: 'charbon', accessoire: 'paille' },
  { coupe: 'tresses', cheveux: 'chatain', peau: 'cannelle', yeux: 'noisette', couleurHaut: 'menthe', couleurBas: 'olive', accessoire: 'bandana', chaussures: 'rouge' },
  { coupe: 'chignon', cheveux: 'nuit', peau: 'miel', haut: 'pull', couleurHaut: 'prune', couleurBas: 'noir', accessoire: 'foulard', sourcils: 'doux' },
  { coupe: 'rasee', cheveux: 'gris', peau: 'ebene', haut: 'chemise', couleurHaut: 'creme', couleurBas: 'bordeaux', accessoire: 'casquette', silhouette: 'large', yeux: 'gris' },
  { coupe: 'courte', cheveux: 'blanc', sourcils: 'epais', haut: 'veste', couleurHaut: 'foret', couleurBas: 'sable', accessoire: 'bonnet', joues: 'discretes', chaussures: 'bleu' }
];
const nom = i => `avatar-${String(i + 1).padStart(2, '0')}`;

// Grand format : poses de la troupe et gestes du tutoriel (et les expressions pour le premier exemple)
const POSES = [['face_repos', 'front', 'repos', 2], ['avant_marche', 'se', 'marche', 4], ['dos_marche', 'ne', 'marche', 4], ['face_salut', 'front', 'salut', 2],
  ['avant_ramasser', 'se', 'action', 2, 'ramasser'], ['face_grelotter', 'front', 'action', 2, 'grelotter'], ['face_lire', 'front', 'action', 2, 'lire']];
let count = 0;
const index = {
  _lisez_moi: [
    'L\'avatar du joueur (HISTOIRE.md § 6.17) : on le compose à partir de ses choix ; ces fichiers sont des exemples tirés du générateur.',
    'Grand format : design/personnages/avatar.js (avatar(choix), à passer à troupe.frame comme un maître), 48 × 64, pieds en (24, 62). Naufragé : design/atelier/avatar_naufrage.js (le chapeau est perdu en mer ; les lunettes, le foulard et le bandana restent).',
    'Petit format du jeu : lookPetit(choix, { naufrage }) donne le « look » de src/world/villagers.js (villagerSprite) ; mêmes couleurs de peau et de cheveux que le jeu. La forme du haut et la couleur des yeux ne se voient qu\'au grand format.',
    'Poses : repos (2), marche (4), salut (2), et les gestes du tutoriel : ramasser (trois quarts avant), grelotter et lire le Grimoire (face), 2 images chacun. Le premier exemple a aussi les 8 expressions.',
    'L\'avatar est naufragé du naufrage jusqu\'au Campement (fin du tutoriel), où Cannelle recoud ses habits.'
  ],
  choix: CHOIX,
  libelles: LIBELLES,
  defaut: DEFAUT,
  exemples: {}
};

function grandFormat(c, dir, key, withExpr) {
  const files = {};
  for (const [pose, view, p, nImg, geste] of POSES) {
    const cc = geste ? { ...c, geste } : c;
    files[`${key}_${pose}`] = Array.from({ length: nImg }, (_, n) => {
      const rel = `${dir}/${key}_${pose}_${n + 1}.svg`;
      write(path.join(LIB, rel), grand(frame(cc, view, p, n)));
      count++;
      return rel;
    });
  }
  if (withExpr) for (const x of EXPRS) {
    files[`${key}_expr_${x}`] = [0, 1].map(n => {
      const rel = `${dir}/${key}_expr_${x}_${n + 1}.svg`;
      write(path.join(LIB, rel), grand(frame(c, 'front', 'repos', n, x)));
      count++;
      return rel;
    });
  }
  return files;
}

function petitFormat(look, dir, key, naufrage) {
  const files = {};
  const out = (pose, view, frames, opts = {}, fr = BOX) => {
    const name = `${key}_${VUE[view]}_${pose}`;
    files[name] = frames.map(f => {
      const s = villagerSprite(look, { pose: opts.pose, view, frame: f, lantern: !!opts.lantern, umbrella: !!opts.umbrella });
      const rel = `petit_format/${dir}/${name}_${f + 1}.svg`;
      write(path.join(LIB, rel), petit(fr, `<g transform="scale(${K})">${inner(s)}</g>`));
      count++;
      return rel;
    });
  };
  for (const v of ['front', 'se', 'ne']) {
    out('marche', v, [0, 1, 2, 3], { pose: 'walk' });
    out('repos', v, [0, 1], { pose: 'idle' });
    out('salut', v, [0, 1], { pose: 'wave' });
  }
  if (!naufrage) {
    out('lanterne', 'se', [0, 1, 2, 3], { pose: 'walk', lantern: true }, WIDE);
    out('parapluie', 'se', [0, 1, 2, 3], { pose: 'walk', umbrella: true }, WIDE);
  }
  return files;
}

const anim = [['Grand format', []], ['Naufragé (jusqu\'au Campement)', []], ['Petit format du jeu', []]];
const cells = [];
EXEMPLES.forEach((o, i) => {
  const key = nom(i);
  const c = avatar(o, { uid: `a${i}` });
  const n = avatarNaufrage(o, { uid: `a${i}` });
  index.exemples[key] = {
    nom: `Avatar, exemple ${i + 1}`, choix: { ...DEFAUT, ...o },
    fichiers: { ...grandFormat(c, key, key, i === 0), ...grandFormat(n, `${key}-naufrage`, `${key}-naufrage`, false),
      ...petitFormat(lookPetit(o), key, key, false), ...petitFormat(lookPetit(o, { naufrage: true }), `${key}-naufrage`, `${key}-naufrage`, true) }
  };
  // planche des exemples : face, avant, dos, salut, les trois gestes ; naufragé ; petit format
  // le trois quarts avant en miroir, comme la bibliothèque le publie (vers le bas à droite)
  const g = (cc, v, p, f, geste) => { const b = unique(frame(geste ? { ...cc, geste } : cc, v, p, f)); return grand(v === 'se' ? `<g transform="translate(48 0) scale(-1 1)">${b}</g>` : b, 1.6); };
  const pf = (look, v, p, f) => petit(BOX, unique(`<g transform="scale(${K})">${inner(villagerSprite(look, { pose: p, view: v, frame: f }))}</g>`), 1.9);
  cells.push(row(`Exemple ${i + 1}`, [
    [g(c, 'front', 'repos', 0), 'face'], [g(c, 'se', 'marche', 1), 'avant'], [g(c, 'ne', 'marche', 0), 'dos'], [g(c, 'front', 'salut', 0), 'salut'],
    [g(c, 'se', 'action', 1, 'ramasser'), 'ramasser'], [g(c, 'front', 'action', 0, 'grelotter'), 'grelotter'], [g(c, 'front', 'action', 0, 'lire'), 'lire'],
    [g(n, 'front', 'repos', 0), 'naufragé'], [g(n, 'se', 'marche', 1), ''], [pf(lookPetit(o), 'se', 'walk', 1), 'petit format'], [pf(lookPetit(o, { naufrage: true }), 'se', 'walk', 1), 'naufragé']
  ]));
  const walk = (cc, s) => [0, 1, 2, 3].map(f => grand(unique(frame(cc, 'se', 'marche', f)), s));
  anim[0][1].push({ label: `Exemple ${i + 1}`, frames: walk(c, 2.4), timings: [170], w: 115, h: 154, mirror: true });
  anim[1][1].push({ label: `Exemple ${i + 1}`, frames: walk(n, 2.4), timings: [170], w: 115, h: 154, mirror: true });
  // (le kit marche vers le bas à gauche : la page le montre en miroir, vers le bas à droite comme la bibliothèque)
  anim[2][1].push({ label: `Exemple ${i + 1}`, frames: [0, 1, 2, 3].map(f => petit(BOX, unique(`<g transform="scale(${K})">${inner(villagerSprite(lookPetit(o), { pose: 'walk', view: 'se', frame: f }))}</g>`), 2.4)), timings: [160], w: r2(BOX[2] * 2.4), h: r2(BOX[3] * 2.4) });
});

// Planche des choix : chaque rangée change un seul choix, à partir des réglages par défaut
const face = (o, uid) => grand(unique(frame(avatar(o, { uid }), 'front', 'repos', 0)), 1.6);
const ligne = (label, key, base = {}) => row(label, Object.keys(CHOIX[key]).map(v => [face({ ...base, [key]: v }, `c${key}${v}`), libelle(key, v)]));
const choix = [
  ligne('Silhouette', 'silhouette'), ligne('Peau', 'peau'), ligne('Coupe', 'coupe', { cheveux: 'chatain' }), ligne('Cheveux', 'cheveux', { coupe: 'longue' }),
  ligne('Yeux', 'yeux'), ligne('Sourcils', 'sourcils'), ligne('Taches de rousseur', 'rousseur'), ligne('Joues', 'joues'),
  ligne('Haut', 'haut'), ligne('Couleur du haut', 'couleurHaut', { haut: 'pull' }), ligne('Couleur du pantalon', 'couleurBas'), ligne('Chaussures', 'chaussures'),
  ligne('Accessoire', 'accessoire')
];

write(path.join(LIB, 'avatar.json'), JSON.stringify(index, null, 1));
write(path.join(DIR, 'avatar_apercu.html'), animated('L\'avatar du joueur', 'Exemples tirés du générateur : grand format, naufragé, petit format du jeu ; trois quarts avant et miroir.', anim));
await shoot([
  [path.join(PNG, 'avatar_choix.png'), sheet('L\'avatar — les choix', 'Chaque rangée change un seul choix, à partir des réglages par défaut (HISTOIRE.md § 6.17).', choix), 1300],
  [path.join(PNG, 'avatar_exemples.png'), sheet('L\'avatar — exemples', 'Huit avatars : les vues, le salut, les gestes du tutoriel (ramasser, grelotter, lire le Grimoire), la version naufragée et le petit format du jeu.', cells), 1300]
]);
console.log('ok', count, 'SVG');
