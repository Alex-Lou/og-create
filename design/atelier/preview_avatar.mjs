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
const { EXEMPLES, nom, POSES, dessin } = require('./avatar_exemples.js'); // les exemples, leurs poses
const { unique, row, sheet, animated, write, shoot } = require('./planche.js');
const { icone, ICONES } = require('../personnages/avatar_icones.js');
const { enHiver, HIVER } = require('./tenues.js');
const { CAST } = require('./naufrages');

const LIB = path.join(DIR, 'lib', 'personnages', 'avatar');
const OBJETS = path.join(DIR, 'lib', 'personnages', 'objets');
const PNG = path.join(DIR, 'planches');
const grand = (body, s = 1) => `<svg xmlns="http://www.w3.org/2000/svg" width="${48 * s}" height="${64 * s}" viewBox="0 0 48 64">${body}</svg>`;
let count = 0;
const options = k => Object.keys(CHOIX[k] === 'formes' ? FORMES[k] : NUANCIERS[CHOIX[k]]);
const index = {
  _lisez_moi: [
    'L\'avatar du joueur (HISTOIRE.md § 6.17) : on le compose à partir de ses choix ; ces fichiers sont des exemples tirés du générateur.',
    'Le kit : design/personnages/avatar.js (avatar(choix), à passer à troupe.frame comme un maître), 48 × 64, pieds en (24, 62). Les choix, les nuanciers et les accessoires : avatar_choix.js ; leur dessin : avatar_accessoires.js. Naufragé : design/atelier/avatar_naufrage.js.',
    'Pas de petit format : dans le jeu, l\'avatar, les maîtres, les habitants et les visiteurs sont dessinés en détaillé (choix de l\'auteur, 6 octobre).',
    'Les nuanciers de peau, d\'yeux, de cheveux et de tissus sont libres dès la création ; la peau et les yeux ne se gagnent jamais. Se gagnent pour toujours, à la boutique (écus) ou dans les coffres : les accessoires « boutique » ou « coffre » et les teintures rares. Tout est cosmétique.',
    'Raretés : celles des coffres du jeu (commun, rare, epique, legendaire). La source d\'un accessoire : gratuit (dès la création), boutique ou coffre. garde : ce que la mer laisse au naufragé.',
    'Prix (prix, en écus), selon la rareté : commun 80, rare 200, épique 500, légendaire 1200, pour ce qui s\'achète à la boutique (accessoires et teintures) ; 0 pour ce qui est gratuit ; pas de prix pour ce qui vient des coffres.',
    'Un seul dessin par accessoire : l\'avatar et les maîtres le portent pareil (avatar_accessoires.js, habiller). Les icônes (la boutique, l\'inventaire) : icone, le chemin depuis svg/ (personnages/objets/<id>_icone.svg, 32 × 32, aux couleurs par défaut) ; aux couleurs choisies, le générateur les dessine : icone(id, couleurs) dans design/personnages/avatar_icones.js.',
    'auHasard(graine, { gratuit }) tire un avatar harmonieux (le bouton « Au hasard », et plus tard les visiteurs). verifier(choix) refuse tout choix inconnu.',
    'Poses : repos (2), marche (4), salut (2), les gestes du tutoriel : ramasser (trois quarts avant), grelotter et lire le Grimoire (face), 2 images chacun, et assis à la veillée (face, trois quarts avant, dos ; 2 images ; le siège n\'est pas dessiné, son dessus est à y = 53,6 du cadre), et les mains tendues vers le feu, debout ou assis (mains-tendues, assis-mains-tendues ; 3 vues, 2 images), et applaudir en riant, debout ou assis (applaudir, assis-applaudir ; 3 vues, 2 images : mains écartées, puis le claquement), et pêcher (pecher ; debout, 3 vues, 2 images : le bouchon danse), et piocher (piocher ; debout, 3 vues, 2 images : la pioche levée, puis le coup sur la pierre), et cueillir (cueillir ; debout, 3 vues, 2 images : un fruit cueilli en haut, puis déposé dans le panier), et arroser (arroser ; debout, 3 vues, 2 images : l\'arrosoir penché, l\'eau tombe sur une pousse), et porter (porter ; debout, 3 vues, 2 images : une caisse sur l\'épaule), et réparer, debout ou assis (reparer, assis-reparer ; 3 vues, 2 images : le marteau levé, puis le coup sur le clou), et repousser une créature de la brume d\'un toucher (repousser ; debout, 3 vues, 2 images : la main ouverte, une onde claire qui s\'élargit, jamais de coup), et écrire, debout ou assis (ecrire, assis-ecrire ; 3 vues, 2 images : un carnet ouvert et un crayon, une ligne de plus s\'écrit). Le premier exemple a aussi les 8 expressions.',
    'L\'avatar est naufragé du naufrage jusqu\'au Campement (fin du tutoriel), où Cannelle recoud ses habits.'
  ],
  choix: Object.fromEntries(Object.keys(CHOIX).map(k => [k, { dans: CHOIX[k], options: options(k) }])),
  formes: FORMES,
  nuanciers: NUANCIERS,
  noms: NOMS_NUANCIERS,
  teintures: TEINTURES_GAINS,
  emplacements: EMPLACEMENTS,
  accessoires: Object.fromEntries(Object.entries(ACCESSOIRES).map(([id, a]) => [id, ICONES[id] ? { ...a, icone: `personnages/objets/${id}_icone.svg` } : a])),
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
  const saison = Object.values(o.accessoires || {}).some(a => ACCESSOIRES[a.id].saison);
  if (!saison) {
    index.exemples[key] = {
      nom: `Avatar, exemple ${i + 1}`, choix: verifier(o),
      fichiers: { ...grandFormat(c, key, key, i === 0), ...grandFormat(n, `${key}-naufrage`, `${key}-naufrage`, false) }
    };
  }
  // en grand, pour juger les détails (2,3 fois le cadre de la troupe)
  const G = 2.3;
  cells.push(row(`Exemple ${i + 1}`, [
    [g(c, 'front', 'repos', 0, G), 'face'], [g(c, 'se', 'marche', 1, G), 'avant'], [g(c, 'ne', 'marche', 0, G), 'dos'], [g(c, 'front', 'salut', 0, G), 'salut'],
    [g(c, 'se', 'action', 1, G, 'ramasser'), 'ramasser'], [g(c, 'front', 'action', 0, G, 'grelotter'), 'grelotter'], [g(c, 'front', 'action', 0, G, 'lire'), 'lire'],
    [grand(unique(assis(c, 'front', 0)), G), 'assis'], [grand(unique(`<g transform="translate(48 0) scale(-1 1)">${assis(c, 'se', 0)}</g>`), G), ''],
    [grand(unique(dessin(c, 'front', 'tendre', 0)), G), 'mains tendues'], [grand(unique(`<g transform="translate(48 0) scale(-1 1)">${dessin(c, 'se', 'assis-tendre', 0)}</g>`), G), ''],
    [grand(unique(dessin(c, 'front', 'applaudir', 1)), G), 'applaudir'], [grand(unique(`<g transform="translate(48 0) scale(-1 1)">${dessin(c, 'se', 'assis-applaudir', 1)}</g>`), G), ''],
    [grand(unique(`<g transform="translate(48 0) scale(-1 1)">${dessin(c, 'se', 'pecher', 0)}</g>`), G), 'pêcher'], [grand(unique(dessin(c, 'front', 'piocher', 1)), G), 'piocher'], [grand(unique(dessin(c, 'front', 'cueillir', 0)), G), 'cueillir'], [grand(unique(dessin(c, 'front', 'arroser', 1)), G), 'arroser'], [grand(unique(dessin(c, 'ne', 'porter', 0)), G), 'porter'], [grand(unique(dessin(c, 'front', 'reparer', 1)), G), 'réparer'], [grand(unique(`<g transform="translate(48 0) scale(-1 1)">${dessin(c, 'se', 'repousser', 1)}</g>`), G), 'repousser'], [grand(unique(dessin(c, 'front', 'ecrire', 1)), G), 'écrire'],
    ...(saison ? [] : [[g(n, 'front', 'repos', 0, G), 'naufragé'], [g(n, 'se', 'marche', 1, G), '']])
  ]));
  const walk = cc => [0, 1, 2, 3].map(f => grand(unique(frame(cc, 'se', 'marche', f)), 2.4));
  anim[0][1].push({ label: `Exemple ${i + 1}`, frames: walk(c), timings: [170], w: 115, h: 154, mirror: true });
  if (!saison) anim[1][1].push({ label: `Exemple ${i + 1}`, frames: walk(n), timings: [170], w: 115, h: 154, mirror: true });
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
// la source, et le prix de ce qui s'achète
const source = a => (a.source === 'gratuit' ? 'gratuit' : `${RARETES[a.rarete]} · ${a.source}${a.prix ? ` · ${a.prix} écus` : ''}`);
const nuancierRow = (label, nomN) => row(label, Object.entries(NUANCIERS[nomN]).filter(([, c]) => c).map(([k, c]) => pastille(c, NOMS_NUANCIERS[nomN][k])));
const couleurs = [
  nuancierRow('Peau (16)', 'peau'), row('', options('peau').map(v => [tete({ peau: v, coupe: 'courte' }, `p${v}`, 60), ''])),
  nuancierRow('Cheveux (24)', 'cheveux'), row('', options('cheveux').map(v => [tete({ cheveux: v, coupe: 'longue' }, `h${v}`, 60), ''])),
  nuancierRow('Yeux (16)', 'yeux'), nuancierRow('Tissus (24)', 'tissus'), nuancierRow('Métaux', 'metaux'), nuancierRow('Lèvres', 'levres'),
  row('Teintures rares', Object.entries(NUANCIERS.teintures).map(([k, c]) => pastille(c, NOMS_NUANCIERS.teintures[k], source(TEINTURES_GAINS[k]))))
];

// Planche des accessoires : chacun de face, de trois quarts et de dos, avec sa rareté et sa source
const accessoires = Object.entries(EMPLACEMENTS).map(([place, label]) => row(label, Object.entries(ACCESSOIRES).filter(([, a]) => a.emplacement === place).map(([id, a]) => {
  const base = place === 'main' ? {} : { coupe: place === 'oreilles' ? 'queue' : 'courte', ...(place === 'mains' ? { haut: 'pull' } : {}) };
  const c = avatar({ ...base, accessoires: { [place]: { id } } }, { uid: `x${id}` });
  const vues = [['front', 'repos', 0], ['se', 'marche', 1], ['ne', 'marche', 0]].map(([v, p, f]) => g(c, v, p, f, 1.25)).join('');
  return [vues, `${a.nom}<br><i>${source(a)}${a.garde ? '' : ' · perdu au naufrage'}${a.saison ? ` · ${a.saison === 'hiver' ? 'l\'hiver' : 'sous la pluie'}` : ''}</i>`];
})));

// Les objets : chaque icône (publiée), l'objet porté par l'avatar et par les maîtres qui le portent (l'hiver)
const MAITRE = Object.fromEntries(CAST.map(({ base }) => [base.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase(), base]));
const objets = Object.keys(ICONES).map(id => {
  const a = ACCESSOIRES[id], svg = icone(id);
  write(path.join(OBJETS, `${id}_icone.svg`), svg); count++;
  const c = avatar({ haut: 'pull', accessoires: { [a.emplacement]: { id } } }, { uid: `o${id}` });
  const porteurs = Object.entries(HIVER).filter(([, t]) => t[a.emplacement] && t[a.emplacement][0] === id).map(([s]) => enHiver(MAITRE[s]));
  return row(a.nom, [[svg.replace('width="32" height="32"', 'width="96" height="96" style="background:#F4EEDF"'), `<i>${source(a)}</i>`], [svg.replace('width="32" height="32"', 'width="32" height="32" style="background:#F4EEDF"'), 'vraie taille'],
    [g(c, 'front', 'repos', 0, 1.6), 'l\'avatar'], [g(c, 'ne', 'marche', 0, 1.6), ''], ...porteurs.map(m => [g(m, 'front', 'repos', 0, 1.6), m.name])]);
});

write(path.join(LIB, 'avatar.json'), JSON.stringify(index, null, 1));
write(path.join(DIR, 'avatar_apercu.html'), animated('L\'avatar du joueur', 'Exemples tirés du générateur, et leur version naufragée ; trois quarts avant en marche.', anim));
await shoot([
  [path.join(PNG, 'avatar_choix.png'), sheet('L\'avatar — les formes', 'Chaque rangée change un seul choix, à partir des réglages par défaut (HISTOIRE.md § 6.17). Le visage en gros plan.', choix), 1400],
  [path.join(PNG, 'avatar_coiffures.png'), sheet('L\'avatar — les coiffures', 'Les 17 coupes de face, de trois quarts et de dos ; puis avec des pointes colorées (lilas et menthe) et des mèches (chocolat et blond), qui suivent le sens des cheveux.', coiffures), 1400],
  [path.join(PNG, 'avatar_couleurs.png'), sheet('L\'avatar — les nuanciers', 'Tous libres dès la création, sauf les teintures rares, qui se gagnent (boutique, coffres) et s\'ajoutent aux tissus et aux cheveux.', couleurs), 1400],
  [path.join(PNG, 'avatar_accessoires.png'), sheet('L\'avatar — les accessoires', 'Un par emplacement, chacun recolorable. Gratuit dès la création, ou à gagner pour toujours à la boutique (son prix suit la rareté) ou dans les coffres (raretés des coffres du jeu).', accessoires), 1400],
  [path.join(PNG, 'avatar_objets.png'), sheet('Les objets : un seul dessin', 'Chaque objet en icône (la boutique, l\'inventaire : 32 × 32), porté par l\'avatar, et par les maîtres qui le portent l\'hiver : le même dessin, posé sur les repères de chacun.', objets), 1400],
  [path.join(PNG, 'avatar_exemples.png'), sheet('L\'avatar — exemples', 'Quatorze avatars : les vues, le salut, les gestes du tutoriel (ramasser, grelotter, lire le Grimoire) et la version naufragée (la mer garde les chapeaux, les sacs et ce qu\'on tient) ; les deux derniers en tenue de saison, l\'hiver et sous la pluie (sur la planche seulement).', cells), 1400]
]);
console.log('ok', count, 'SVG');
