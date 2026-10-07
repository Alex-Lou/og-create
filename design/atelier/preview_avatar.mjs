// Lot L : l'avatar du joueur (HISTOIRE.md § 6.17). Le kit est un générateur : on compose l'avatar à partir de ses
// choix. Ce script en tire des exemples pour la bibliothèque, les planches (choix, nuanciers, accessoires, exemples)
// et une page animée :
//   - avatar (design/personnages/avatar.js, kit de la troupe) : lib/personnages/avatar/avatar-NN/ ;
//   - naufragé (avatar_naufrage.js) : lib/personnages/avatar/avatar-NN-naufrage/.
// Pas de petit format : dans le jeu, tout le monde est dessiné en détaillé (choix de l'auteur, 6 octobre).
// Noms déjà rangés (<sujet>_<vue>_<pose>_<n>) ; le trois quarts avant sort du kit vers le bas à gauche, l'assemblage le
// publie en miroir (catalogue.js), comme pour les maîtres.
import path from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const DIR = path.dirname(fileURLToPath(import.meta.url));
const { frame, EXPRS } = require('./troupe.js');
const A = require('../personnages/avatar.js');
const { avatar, CHOIX, FORMES, NUANCIERS, NOMS_NUANCIERS, TEINTURES_GAINS, EMPLACEMENTS, ACCESSOIRES, DEFAUT, libelle, verifier } = A;
const { avatarNaufrage } = require('./avatar_naufrage.js');
const { assis } = require('./assis.js');
const { tendre, avecMainsTendues, applaudir, avecApplaudir } = require('./gestes.js');
const { unique, row, sheet, animated, write, shoot } = require('./planche.js');

const LIB = path.join(DIR, 'lib', 'personnages', 'avatar');
const PNG = path.join(DIR, 'planches');
const grand = (body, s = 1) => `<svg xmlns="http://www.w3.org/2000/svg" width="${48 * s}" height="${64 * s}" viewBox="0 0 48 64">${body}</svg>`;
const ac = (place, id, couleurs) => ({ [place]: couleurs ? { id, couleurs } : { id } });

// Douze exemples, qui couvrent ensemble les formes, les nuanciers et des accessoires de chaque emplacement
const EXEMPLES = [
  {},
  { taille: 'petite', silhouette: 'fine', coupe: 'deuxChignons', cheveux: 'bonbon', cils: 'recourbes', levres: 'rose', formeYeux: 'grands', haut: 'tshirt', couleurHaut: 'creme', bas: 'robe', couleurBas: 'framboise', chaussures: 'blanc', accessoires: { ...ac('joues', 'coeurs'), ...ac('cheveux', 'noeud', ['blanc']) } },
  { taille: 'grande', silhouette: 'large', coupe: 'bouclee', cheveux: 'jais', peau: 'cacao', visage: 'ovale', sourcils: 'epais', bouche: 'serieuse', haut: 'chemise', couleurHaut: 'ciel', couleurBas: 'sable', accessoires: { ...ac('visage', 'lunettesRondes', ['or']), ...ac('dos', 'besace') } },
  { coupe: 'queueCote', cheveux: 'platine', peau: 'nacre', yeux: 'azur', formeYeux: 'amande', cils: 'legers', grain: 'levre', haut: 'veste', couleurHaut: 'marine', bas: 'jupe', couleurBas: 'rosepale', accessoires: { ...ac('tete', 'paille', ['framboise']), ...ac('oreilles', 'pendantsEtoile') } },
  { coupe: 'locks', cheveux: 'noir', peau: 'cannelle', yeux: 'noisette', formeYeux: 'rieurs', bouche: 'sourire', haut: 'tshirt', couleurHaut: 'soleil', bas: 'short', couleurBas: 'olive', chaussures: 'rouge', accessoires: { ...ac('tete', 'bandana', ['lagon']), ...ac('dos', 'sacDos') } },
  { silhouette: 'ronde', coupe: 'chignon', cheveux: 'nuit', peau: 'miel', formeYeux: 'paisibles', sourcils: 'doux', levres: 'prune', haut: 'pull', couleurHaut: 'lavande', bas: 'robe', couleurBas: 'creme', accessoires: { ...ac('tete', 'couronneFleurs', ['rose']), ...ac('cou', 'perles') } },
  { taille: 'grande', silhouette: 'large', coupe: 'rasee', cheveux: 'gris', peau: 'ebene', visage: 'carre', yeux: 'grisbleu', bouche: 'malice', haut: 'sweat', couleurHaut: 'foret', couleurBas: 'noir', accessoires: { ...ac('tete', 'casquette', ['rouge']), ...ac('oreilles', 'anneaux', ['argent']) } },
  { taille: 'petite', coupe: 'meche', cheveux: 'blanc', meches: 'meches', couleurMeches: 'ciel', sourcils: 'epais', joues: 'discretes', haut: 'pull', couleurHaut: 'creme', couleurBas: 'bordeaux', chaussures: 'jean', accessoires: { ...ac('tete', 'bonnet', ['rouge']), ...ac('cou', 'echarpe', ['rouge', 'creme']) } },
  { coupe: 'carre', cheveux: 'chocolat', peau: 'doree', visage: 'ovale', formeYeux: 'amande', cils: 'recourbes', levres: 'framboise', haut: 'mariniere', couleurHaut: 'marine', bas: 'jupe', couleurBas: 'rouge', chaussures: 'noir', accessoires: { ...ac('visage', 'lunettesPapillon', ['noir']), ...ac('oreilles', 'puces') } },
  { taille: 'petite', coupe: 'bataille', cheveux: 'cuivre', peau: 'rosee', rousseur: 'oui', formeYeux: 'grands', bouche: 'malice', haut: 'sweat', couleurHaut: 'abricot', bas: 'short', couleurBas: 'charbon', accessoires: { ...ac('tete', 'oreillesChat', ['cuir']), ...ac('joues', 'pansement') } },
  { taille: 'grande', silhouette: 'fine', coupe: 'ondulee', cheveux: 'lilas', meches: 'pointes', couleurMeches: 'menthe', peau: 'bronze', yeux: 'violet', cils: 'legers', haut: 'chemise', couleurHaut: 'blanc', bas: 'robe', couleurBas: 'lavande', chaussures: 'creme', accessoires: { ...ac('dos', 'ailes', ['menthe']), ...ac('cheveux', 'barrettes', ['nacre']) } },
  { silhouette: 'ronde', coupe: 'couronne', cheveux: 'roux', peau: 'porcelaine', rousseur: 'legere', yeux: 'vert', formeYeux: 'rieurs', haut: 'mariniere', couleurHaut: 'rouge', bas: 'salopette', couleurBas: 'jean', accessoires: { ...ac('main', 'peluche'), ...ac('cou', 'papillon', ['soleil']) } }
];
const nom = i => `avatar-${String(i + 1).padStart(2, '0')}`;

// Poses de la troupe et gestes du tutoriel (et les expressions pour le premier exemple)
const POSES = [['face_repos', 'front', 'repos', 2], ['avant_marche', 'se', 'marche', 4], ['dos_marche', 'ne', 'marche', 4], ['face_salut', 'front', 'salut', 2],
  ['avant_ramasser', 'se', 'action', 2, 'ramasser'], ['face_grelotter', 'front', 'action', 2, 'grelotter'], ['face_lire', 'front', 'action', 2, 'lire'],
  ['face_assis', 'front', 'assis', 2], ['avant_assis', 'se', 'assis', 2], ['dos_assis', 'ne', 'assis', 2],
  ['face_mains-tendues', 'front', 'tendre', 2], ['avant_mains-tendues', 'se', 'tendre', 2], ['dos_mains-tendues', 'ne', 'tendre', 2],
  ['face_assis-mains-tendues', 'front', 'assis-tendre', 2], ['avant_assis-mains-tendues', 'se', 'assis-tendre', 2], ['dos_assis-mains-tendues', 'ne', 'assis-tendre', 2],
  ['face_applaudir', 'front', 'applaudir', 2], ['avant_applaudir', 'se', 'applaudir', 2], ['dos_applaudir', 'ne', 'applaudir', 2],
  ['face_assis-applaudir', 'front', 'assis-applaudir', 2], ['avant_assis-applaudir', 'se', 'assis-applaudir', 2], ['dos_assis-applaudir', 'ne', 'assis-applaudir', 2]];
// une image d'une pose : celles du kit, assis, et les gestes de la veillée (debout ou assis)
const dessin = (cc, view, p, n) => p === 'assis' ? assis(cc, view, n) : p === 'assis-tendre' ? assis(cc, view, n, null, tendre)
  : p === 'assis-applaudir' ? assis(cc, view, n, null, applaudir) : p === 'tendre' ? frame(avecMainsTendues(cc), view, 'action', n)
  : p === 'applaudir' ? frame(avecApplaudir(cc), view, 'action', n) : frame(cc, view, p, n);
let count = 0;
const options = k => Object.keys(CHOIX[k] === 'formes' ? FORMES[k] : NUANCIERS[CHOIX[k]]);
const index = {
  _lisez_moi: [
    'L\'avatar du joueur (HISTOIRE.md § 6.17) : on le compose à partir de ses choix ; ces fichiers sont des exemples tirés du générateur.',
    'Le kit : design/personnages/avatar.js (avatar(choix), à passer à troupe.frame comme un maître), 48 × 64, pieds en (24, 62). Les choix, les nuanciers et les accessoires : avatar_choix.js ; leur dessin : avatar_accessoires.js. Naufragé : design/atelier/avatar_naufrage.js.',
    'Pas de petit format : dans le jeu, l\'avatar, les maîtres, les habitants et les visiteurs sont dessinés en détaillé (choix de l\'auteur, 6 octobre).',
    'Les nuanciers de peau, d\'yeux, de cheveux et de tissus sont libres dès la création ; la peau et les yeux ne se gagnent jamais. Se gagnent pour toujours, à la boutique (écus) ou dans les coffres : les accessoires « boutique » ou « coffre » et les teintures rares. Tout est cosmétique.',
    'Raretés : celles des coffres du jeu (commun, rare, epique, legendaire). La source d\'un accessoire : gratuit (dès la création), boutique ou coffre. garde : ce que la mer laisse au naufragé.',
    'auHasard(graine, { gratuit }) tire un avatar harmonieux (le bouton « Au hasard », et plus tard les visiteurs). verifier(choix) refuse tout choix inconnu.',
    'Poses : repos (2), marche (4), salut (2), les gestes du tutoriel : ramasser (trois quarts avant), grelotter et lire le Grimoire (face), 2 images chacun, et assis à la veillée (face, trois quarts avant, dos ; 2 images ; le siège n\'est pas dessiné, son dessus est à y = 53,6 du cadre), et les mains tendues vers le feu, debout ou assis (mains-tendues, assis-mains-tendues ; 3 vues, 2 images), et applaudir en riant, debout ou assis (applaudir, assis-applaudir ; 3 vues, 2 images : mains écartées, puis le claquement). Le premier exemple a aussi les 8 expressions.',
    'L\'avatar est naufragé du naufrage jusqu\'au Campement (fin du tutoriel), où Cannelle recoud ses habits.'
  ],
  choix: Object.fromEntries(Object.keys(CHOIX).map(k => [k, { dans: CHOIX[k], options: options(k) }])),
  formes: FORMES,
  nuanciers: NUANCIERS,
  noms: NOMS_NUANCIERS,
  teintures: TEINTURES_GAINS,
  emplacements: EMPLACEMENTS,
  accessoires: ACCESSOIRES,
  defaut: DEFAUT,
  exemples: {}
};

function grandFormat(c, dir, key, withExpr) {
  const files = {};
  for (const [pose, view, p, nImg, geste] of POSES) {
    const cc = geste ? { ...c, geste } : c;
    files[`${key}_${pose}`] = Array.from({ length: nImg }, (_, n) => {
      const rel = `${dir}/${key}_${pose}_${n + 1}.svg`;
      write(path.join(LIB, rel), grand(dessin(cc, view, p, n)));
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

// le trois quarts avant en miroir, comme la bibliothèque le publie (vers le bas à droite)
const g = (cc, v, p, f, s = 1.6, geste, expr) => { const b = unique(frame(geste ? { ...cc, geste } : cc, v, p, f, expr)); return grand(v === 'se' ? `<g transform="translate(48 0) scale(-1 1)">${b}</g>` : b, s); };
const anim = [['L\'avatar', []], ['Naufragé (jusqu\'au Campement)', []]];
const cells = [];
EXEMPLES.forEach((o, i) => {
  const key = nom(i);
  const c = avatar(o, { uid: `a${i}` });
  const n = avatarNaufrage(o, { uid: `a${i}` });
  index.exemples[key] = {
    nom: `Avatar, exemple ${i + 1}`, choix: verifier(o),
    fichiers: { ...grandFormat(c, key, key, i === 0), ...grandFormat(n, `${key}-naufrage`, `${key}-naufrage`, false) }
  };
  // en grand, pour juger les détails (2,3 fois le cadre de la troupe)
  const G = 2.3;
  cells.push(row(`Exemple ${i + 1}`, [
    [g(c, 'front', 'repos', 0, G), 'face'], [g(c, 'se', 'marche', 1, G), 'avant'], [g(c, 'ne', 'marche', 0, G), 'dos'], [g(c, 'front', 'salut', 0, G), 'salut'],
    [g(c, 'se', 'action', 1, G, 'ramasser'), 'ramasser'], [g(c, 'front', 'action', 0, G, 'grelotter'), 'grelotter'], [g(c, 'front', 'action', 0, G, 'lire'), 'lire'],
    [grand(unique(assis(c, 'front', 0)), G), 'assis'], [grand(unique(`<g transform="translate(48 0) scale(-1 1)">${assis(c, 'se', 0)}</g>`), G), ''],
    [grand(unique(dessin(c, 'front', 'tendre', 0)), G), 'mains tendues'], [grand(unique(`<g transform="translate(48 0) scale(-1 1)">${dessin(c, 'se', 'assis-tendre', 0)}</g>`), G), ''],
    [grand(unique(dessin(c, 'front', 'applaudir', 1)), G), 'applaudir'], [grand(unique(`<g transform="translate(48 0) scale(-1 1)">${dessin(c, 'se', 'assis-applaudir', 1)}</g>`), G), ''],
    [g(n, 'front', 'repos', 0, G), 'naufragé'], [g(n, 'se', 'marche', 1, G), '']
  ]));
  const walk = cc => [0, 1, 2, 3].map(f => grand(unique(frame(cc, 'se', 'marche', f)), 2.4));
  anim[0][1].push({ label: `Exemple ${i + 1}`, frames: walk(c), timings: [170], w: 115, h: 154, mirror: true });
  anim[1][1].push({ label: `Exemple ${i + 1}`, frames: walk(n), timings: [170], w: 115, h: 154, mirror: true });
});

// Planche des choix : chaque rangée change un seul choix, à partir des réglages par défaut ; le visage en gros plan
const face = (o, uid) => grand(unique(frame(avatar(o, { uid }), 'front', 'repos', 0)), 1.6);
const tete = (o, uid, w = 94) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${r2(w * 34 / 36)}" viewBox="6 2 36 34">${unique(frame(avatar(o, { uid }), 'front', 'repos', 0))}</svg>`;
function r2(x) { return Math.round(x * 100) / 100; }
const ligne = (label, key, base = {}, gros = false) => row(label, options(key).map(v => [(gros ? tete : face)({ ...base, [key]: v }, `c${key}${v}`), libelle(key, v)]));
const choix = [
  ligne('Taille', 'taille'), ligne('Corpulence', 'silhouette'), ligne('Visage', 'visage', {}, true),
  ligne('Forme des yeux', 'formeYeux', {}, true), ligne('Cils', 'cils', {}, true), ligne('Sourcils', 'sourcils', {}, true), ligne('Bouche', 'bouche', {}, true),
  ligne('Lèvres', 'levres', {}, true), ligne('Taches de rousseur', 'rousseur', {}, true), ligne('Joues', 'joues', {}, true), ligne('Grain de beauté', 'grain', {}, true),
  ligne('Coupe', 'coupe', { cheveux: 'chatain' }), ligne('Mèches', 'meches', { coupe: 'longue', couleurMeches: 'blond' }),
  ligne('Haut', 'haut'), ligne('Bas', 'bas', { couleurBas: 'framboise', couleurHaut: 'menthe' })
];

// Planche des coiffures : chaque coupe de face, de trois quarts et de dos, puis avec des pointes colorées et des mèches
const coiffures = options('coupe').map(coupe => {
  const c = avatar({ coupe, cheveux: 'chatain' }, { uid: `k${coupe}` });
  const p = avatar({ coupe, cheveux: 'lilas', meches: 'pointes', couleurMeches: 'menthe' }, { uid: `kp${coupe}` });
  const m = avatar({ coupe, cheveux: 'chocolat', meches: 'meches', couleurMeches: 'blond' }, { uid: `km${coupe}` });
  // recadré sur la tête et les épaules ; le trois quarts avant en miroir, comme la bibliothèque le publie
  const buste = (cc, v, f) => { const b = unique(frame(cc, v, v === 'front' ? 'repos' : 'marche', f)); return `<svg xmlns="http://www.w3.org/2000/svg" width="118" height="118" viewBox="4 0 40 40">${v === 'se' ? `<g transform="translate(48 0) scale(-1 1)">${b}</g>` : b}</svg>`; };
  return row(libelle('coupe', coupe), [[buste(c, 'front', 0), 'face'], [buste(c, 'se', 0), 'avant'], [buste(c, 'ne', 0), 'dos'],
    [buste(p, 'front', 0), 'pointes'], [buste(p, 'ne', 0), ''], [buste(m, 'front', 0), 'mèches'], [buste(m, 'ne', 0), '']]);
});

// Planche des nuanciers : les pastilles, puis l'avatar dans chaque peau et chaque couleur de cheveux
const pastille = (col, cap, tag = '') => [`<svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34"><circle cx="17" cy="17" r="14" fill="${col}" stroke="#3C2819" stroke-width="1.6"/><ellipse cx="12" cy="11" rx="4" ry="2.6" fill="#FFFFFF" opacity="0.35"/></svg>`, cap + (tag ? `<br><i>${tag}</i>` : '')];
const RARETES = { commun: 'commun', rare: 'rare', epique: 'épique', legendaire: 'légendaire' };
const nuancierRow = (label, nomN) => row(label, Object.entries(NUANCIERS[nomN]).filter(([, c]) => c).map(([k, c]) => pastille(c, NOMS_NUANCIERS[nomN][k])));
const couleurs = [
  nuancierRow('Peau (16)', 'peau'), row('', options('peau').map(v => [tete({ peau: v, coupe: 'courte' }, `p${v}`, 60), ''])),
  nuancierRow('Cheveux (24)', 'cheveux'), row('', options('cheveux').map(v => [tete({ cheveux: v, coupe: 'longue' }, `h${v}`, 60), ''])),
  nuancierRow('Yeux (16)', 'yeux'), nuancierRow('Tissus (24)', 'tissus'), nuancierRow('Métaux', 'metaux'), nuancierRow('Lèvres', 'levres'),
  row('Teintures rares', Object.entries(NUANCIERS.teintures).map(([k, c]) => pastille(c, NOMS_NUANCIERS.teintures[k], `${RARETES[TEINTURES_GAINS[k].rarete]} · ${TEINTURES_GAINS[k].source}`)))
];

// Planche des accessoires : chacun de face, de trois quarts et de dos, avec sa rareté et sa source
const accessoires = Object.entries(EMPLACEMENTS).map(([place, label]) => row(label, Object.entries(ACCESSOIRES).filter(([, a]) => a.emplacement === place).map(([id, a]) => {
  const base = place === 'main' ? {} : { coupe: place === 'oreilles' ? 'queue' : 'courte' };
  const c = avatar({ ...base, accessoires: { [place]: { id } } }, { uid: `x${id}` });
  const vues = [['front', 'repos', 0], ['se', 'marche', 1], ['ne', 'marche', 0]].map(([v, p, f]) => g(c, v, p, f, 1.25)).join('');
  return [vues, `${a.nom}<br><i>${a.source === 'gratuit' ? 'gratuit' : `${RARETES[a.rarete]} · ${a.source}`}${a.garde ? '' : ' · perdu au naufrage'}</i>`];
})));

write(path.join(LIB, 'avatar.json'), JSON.stringify(index, null, 1));
write(path.join(DIR, 'avatar_apercu.html'), animated('L\'avatar du joueur', 'Exemples tirés du générateur, et leur version naufragée ; trois quarts avant en marche.', anim));
await shoot([
  [path.join(PNG, 'avatar_choix.png'), sheet('L\'avatar — les formes', 'Chaque rangée change un seul choix, à partir des réglages par défaut (HISTOIRE.md § 6.17). Le visage en gros plan.', choix), 1400],
  [path.join(PNG, 'avatar_coiffures.png'), sheet('L\'avatar — les coiffures', 'Les 17 coupes de face, de trois quarts et de dos ; puis avec des pointes colorées (lilas et menthe) et des mèches (chocolat et blond), qui suivent le sens des cheveux.', coiffures), 1400],
  [path.join(PNG, 'avatar_couleurs.png'), sheet('L\'avatar — les nuanciers', 'Tous libres dès la création, sauf les teintures rares, qui se gagnent (boutique, coffres) et s\'ajoutent aux tissus et aux cheveux.', couleurs), 1400],
  [path.join(PNG, 'avatar_accessoires.png'), sheet('L\'avatar — les accessoires', 'Un par emplacement, chacun recolorable. Gratuit dès la création, ou à gagner pour toujours à la boutique ou dans les coffres (raretés des coffres du jeu).', accessoires), 1400],
  [path.join(PNG, 'avatar_exemples.png'), sheet('L\'avatar — exemples', 'Douze avatars : les vues, le salut, les gestes du tutoriel (ramasser, grelotter, lire le Grimoire) et la version naufragée (la mer garde les chapeaux, les sacs et ce qu\'on tient).', cells), 1400]
]);
console.log('ok', count, 'SVG');
