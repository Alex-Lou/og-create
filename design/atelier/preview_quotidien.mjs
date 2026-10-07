// Lot L4 — tout le monde au grand format, avec les poses du quotidien que le petit format avait (choix de l'auteur) :
// marche de face, repos et salut dans les trois vues, travail (le geste du métier, maîtres), lanterne et parapluie
// (avant et dos), dormir couché. Pour les 7 maîtres, leurs naufragés (lanterne et parapluie : Aster et Rivet
// seulement, qui restent naufragés après la première lanterne), 12 visiteurs et 8 nouveaux venus de l'épilogue (en
// habits de voyage, une valise à la main ; pas de pose endormie), tirés du générateur de l'avatar.
// SVG dans lib/personnages/{maitres,naufrages,visiteurs,epilogue}/, index quotidien.json, planches, page animée.
import path from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const DIR = path.dirname(fileURLToPath(import.meta.url));
const { frame } = require('./troupe');
const { unique, row, sheet, animated, write, shoot } = require('./planche.js');
const { CAST } = require('./naufrages');
const A = require('../personnages/avatar.js');
const G = require('./gestes.js');
const { assis } = require('./assis.js');
const LIB = path.join(DIR, 'lib', 'personnages');
const PNG = path.join(DIR, 'planches');
const r2 = n => Math.round(n * 100) / 100;
const STD = [0, 0, 48, 64];
const svgOf = (vb, body, s = 1) => `<svg xmlns="http://www.w3.org/2000/svg" width="${r2(vb[2] * s)}" height="${r2(vb[3] * s)}" viewBox="${vb.join(' ')}">${body}</svg>`;
const slug = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const VUE = { front: 'face', se: 'avant', ne: 'dos' };
// le trois quarts avant du kit regarde vers le bas à gauche : sur les planches, on le montre en miroir, comme la
// bibliothèque le publie (vers le bas à droite)
const montre = (vb, body, view, s) => svgOf(vb, unique(view === 'se' ? `<g transform="translate(${2 * vb[0] + vb[2]} 0) scale(-1 1)">${body}</g>` : body), s);

// Les poses d'un personnage : [nom de fichier sans le numéro, vue du kit, cadre, images]
function poses(c, { travail = false, lanterne = false, couche = true, valise = null, couverture, parapluie = '#D9443A' } = {}) {
  const out = [];
  const tenir = valise ? G.avecValise(c, valise) : c;
  for (const v of ['front', 'se', 'ne']) {
    out.push([`${VUE[v]}_marche`, v, STD, [0, 1, 2, 3].map(n => frame(tenir, v, 'marche', n))]);
    out.push([`${VUE[v]}_repos`, v, STD, [0, 1].map(n => frame(tenir, v, 'repos', n))]);
    out.push([`${VUE[v]}_salut`, v, STD, [0, 1].map(n => frame(c, v, 'salut', n))]);
    if (travail) out.push([`${VUE[v]}_travail`, v, STD, [0, 1].map(n => frame(c, v, 'action', n))]);
    out.push([`${VUE[v]}_assis`, v, STD, [0, 1].map(n => assis(c, v, n))]);
    out.push([`${VUE[v]}_mains-tendues`, v, STD, [0, 1].map(n => frame(G.avecMainsTendues(c), v, 'action', n))]);
    out.push([`${VUE[v]}_assis-mains-tendues`, v, STD, [0, 1].map(n => assis(c, v, n, null, G.tendre))]);
    out.push([`${VUE[v]}_applaudir`, v, STD, [0, 1].map(n => frame(G.avecApplaudir(c), v, 'action', n))]);
    out.push([`${VUE[v]}_assis-applaudir`, v, STD, [0, 1].map(n => assis(c, v, n, null, G.applaudir))]);
    out.push([`${VUE[v]}_pecher`, v, STD, [0, 1].map(n => frame(G.avecPecher(c), v, 'action', n))]);
    out.push([`${VUE[v]}_piocher`, v, STD, [0, 1].map(n => frame(G.avecPiocher(c), v, 'action', n))]);
    out.push([`${VUE[v]}_cueillir`, v, STD, [0, 1].map(n => frame(G.avecCueillir(c), v, 'action', n))]);
    out.push([`${VUE[v]}_porter`, v, STD, [0, 1].map(n => frame(G.avecPorter(c), v, 'action', n))]);
    out.push([`${VUE[v]}_reparer`, v, STD, [0, 1].map(n => frame(G.avecReparer(c), v, 'action', n))]);
    out.push([`${VUE[v]}_assis-reparer`, v, STD, [0, 1].map(n => assis(c, v, n, null, G.reparer))]);
    out.push([`${VUE[v]}_repousser`, v, STD, [0, 1].map(n => frame(G.avecRepousser(c), v, 'action', n))]);
    out.push([`${VUE[v]}_ecrire`, v, STD, [0, 1].map(n => frame(G.avecEcrire(c), v, 'action', n))]);
    out.push([`${VUE[v]}_assis-ecrire`, v, STD, [0, 1].map(n => assis(c, v, n, null, G.ecrire))]);
  }
  if (lanterne) {
    const l = G.avecLanterne(c), u = G.avecParapluie(c, parapluie);
    for (const v of ['se', 'ne']) {
      out.push([`${VUE[v]}_lanterne`, v, STD, [0, 1, 2, 3].map(n => frame(l, v, 'marche', n))]);
      out.push([`${VUE[v]}_parapluie`, v, G.CADRE_PARAPLUIE, [0, 1, 2, 3].map(n => frame(u, v, 'marche', n))]);
    }
  }
  if (couche) out.push(['couche', 'front', G.CADRE_COUCHE, [0, 1].map(n => G.couche(c, n, couverture))]);
  return out;
}

const index = {
  _lisez_moi: [
    'Lot L4 : tout le monde au grand format (le petit format est abandonné). Mêmes vues que la troupe : face, avant (vient vers le bas à droite), dos (s\'éloigne vers le haut à droite) ; le miroir donne les deux autres directions. Pieds en (24, 62) dans le cadre 48 × 64.',
    'Poses : marche (4 images, ~170 ms), repos (2 images : clignement), salut (2), travail (2, le geste du métier : maîtres et naufragés, sauf Galet et Sylve naufragés qui ont oublié leur don), assis (la veillée, 3 vues, 2 images : clignement ; le siège n\'est pas dessiné, son dessus est à y = 53,6 du cadre, 8,4 au-dessus du bas des pieds, la même hauteur pour tous), mains-tendues et assis-mains-tendues (les mains tendues vers le feu, debout ou assis, 3 vues, 2 images : les doigts se réchauffent ; le feu est devant le personnage), applaudir et assis-applaudir (en riant, 3 vues, 2 images : mains écartées, puis le claquement), pecher (le mini-jeu de la pêche, debout, 3 vues, 2 images : le bouchon danse ; la canne, le fil et le bouchon restent dans le cadre), piocher (le mini-jeu de la mine, debout, 3 vues, 2 images : la pioche levée sur le côté, puis le coup sur la pierre posée au sol, éclats et étincelle), cueillir (le mini-jeu de la cueillette, debout, 3 vues, 2 images : un panier d\'osier à la main, l\'autre main cueille un fruit en haut, puis le dépose dans le panier), porter (debout, 3 vues, 2 images : une caisse de bois sur l\'épaule droite à l\'écran, la main dessous, l\'autre bras ballant ; elle remonte d\'un cran à l\'image 2), reparer et assis-reparer (debout ou assis, 3 vues, 2 images : une planche tenue en travers, posée sur les genoux quand on est assis, le marteau levé puis le coup sur le clou), repousser (debout, 3 vues, 2 images : la main ouverte tendue vers une créature de la brume, devant le personnage, une onde claire et deux étincelles ; la main pousse un peu plus loin et l\'onde s\'élargit à l\'image 2 ; jamais de coup), ecrire et assis-ecrire (debout ou assis, 3 vues, 2 images : un carnet ouvert tenu devant soi, au-dessus des genoux quand on est assis, et un crayon ; une ligne de plus s\'écrit à l\'image 2 ; de dos, on voit les coudes), lanterne et parapluie (avant et dos, 4 images, en marchant), couche (dormir couché, 2 images ~900 ms).',
    'Cadres à part : parapluie [0, -18, 48, 82] (la toile passe au-dessus de la tête ; pieds toujours en (24, 62)) ; couche [0, 0, 64, 48] (allongé la tête à gauche, sous une couverture).',
    'Naufragés : lanterne et parapluie seulement pour Aster et Rivet, qui restent naufragés après la première lanterne. Visiteurs et nouveaux venus : tirés du générateur de l\'avatar (choix notés ici, pour en refaire d\'autres avec design/personnages/avatar.js) ; les nouveaux venus de l\'épilogue arrivent en habits de voyage, une valise à la main, et n\'ont pas de pose endormie.'
  ],
  maitres: {}, naufrages: {}, visiteurs: {}, epilogue: {}
};
const planches = { maitres: [], naufrages: [], visiteurs: [] };
const anim = [];
let count = 0;
// écrit les images d'un personnage ; dir : dossier dans lib/personnages ; nom : préfixe des fichiers ; deja : poses déjà
// publiées par la troupe (svg2) ou les naufragés : on ne les réécrit pas, l'index les nomme quand même
const DEJA = ['avant_marche', 'dos_marche', 'face_repos', 'face_salut'];
function publier(groupe, cle, nomAffiche, dir, prefixe, liste, extra = {}, deja = []) {
  const fichiers = {};
  for (const [pose, , vb, images] of liste) {
    fichiers[pose] = images.map((b, i) => {
      const rel = `${dir}/${prefixe}_${pose}_${i + 1}.svg`;
      if (!deja.includes(pose)) { write(path.join(LIB, rel), svgOf(vb, b)); count++; }
      return rel;
    });
  }
  index[groupe][cle] = { nom: nomAffiche, ...extra, fichiers };
}
const cellules = (liste, montrer) => liste.filter(([pose]) => montrer.includes(pose)).map(([pose, v, vb, images]) => [montre(vb, images[0], v, 1.6), pose.replace('_', ' ')]);
const MONTRER = ['face_marche', 'avant_repos', 'dos_repos', 'avant_salut', 'dos_salut', 'face_travail', 'avant_travail', 'dos_travail', 'face_assis', 'avant_assis', 'dos_assis', 'face_mains-tendues', 'avant_mains-tendues', 'dos_mains-tendues', 'face_assis-mains-tendues', 'avant_assis-mains-tendues', 'dos_assis-mains-tendues', 'face_applaudir', 'avant_applaudir', 'dos_applaudir', 'face_assis-applaudir', 'avant_assis-applaudir', 'dos_assis-applaudir', 'face_pecher', 'avant_pecher', 'dos_pecher', 'face_piocher', 'avant_piocher', 'dos_piocher', 'face_cueillir', 'avant_cueillir', 'dos_cueillir', 'face_porter', 'avant_porter', 'dos_porter', 'face_reparer', 'avant_reparer', 'dos_reparer', 'face_assis-reparer', 'avant_assis-reparer', 'dos_assis-reparer', 'face_repousser', 'avant_repousser', 'dos_repousser', 'face_ecrire', 'avant_ecrire', 'dos_ecrire', 'face_assis-ecrire', 'avant_assis-ecrire', 'dos_assis-ecrire', 'avant_lanterne', 'dos_lanterne', 'avant_parapluie', 'dos_parapluie', 'couche'];

// ---- 1. les maîtres et leurs naufragés ----
const COUVERTURES = {
  aster: { fond: '#2F5684', motif: '#F2C04B' }, cannelle: { fond: '#B9503B', motif: '#F4EEDC' }, rivet: { fond: '#7A4E2C', motif: '#C4A06A' },
  ondin: { fond: '#3E78C8', motif: '#EAF2FA' }, sylve: { fond: '#4E7A36', motif: '#9DBE6A' }, galet: { fond: '#6E7466', motif: '#B6B39E' }, melisse: { fond: '#5A4A8A', motif: '#E3C27A' }
};
const VOILE = { fond: '#D9CFB8', motif: '#B3A588' };
for (const { base, nau } of CAST) {
  const s = slug(base.name);
  const lm = poses(base, { travail: true, lanterne: true, couverture: COUVERTURES[s] });
  publier('maitres', s, base.name, `maitres/${s}`, s, lm, {}, DEJA);
  planches.maitres.push(row(base.name, cellules(lm, MONTRER)));
  const avec = s === 'aster' || s === 'rivet';
  const ln = poses(nau, { travail: !nau.sansDon, lanterne: avec, couverture: VOILE, parapluie: '#8E8A80' });
  publier('naufrages', s, `${base.name} naufragé${['aster', 'cannelle', 'sylve', 'melisse'].includes(s) ? 'e' : ''}`, `naufrages/${s}`, `${s}_naufrage`, ln, {}, DEJA);
  planches.naufrages.push(row(`${base.name} (naufragé)`, cellules(ln, MONTRER)));
  const box = (lab, l, mirror) => { const [, v, vb, images] = l; return { label: lab, frames: images.map(b => montre(vb, b, v, 2)), timings: [170], w: r2(vb[2] * 2), h: r2(vb[3] * 2), mirror }; };
  anim.push(box(`${base.name} — lanterne`, lm.find(([p]) => p === 'avant_lanterne')), box(`${base.name} — parapluie`, lm.find(([p]) => p === 'avant_parapluie')), box(`${base.name} — de face`, lm.find(([p]) => p === 'face_marche')));
}

// ---- 2. les visiteurs (générateur de l'avatar) ----
const PARAPLUIES = ['#D9443A', '#3E78C8', '#F2C04B', '#7EC45B', '#C46AA8', '#2E3E66'];
const COUV = [{ fond: '#C98F5A', motif: '#E8C07A' }, { fond: '#6E8FC4', motif: '#DDE7F4' }, { fond: '#8BAE6A', motif: '#E2EDC9' }, { fond: '#B86A7A', motif: '#F2D2D8' }];
const sansMain = o => { const acc = { ...o.accessoires }; delete acc.main; return { ...o, accessoires: acc }; };
for (let i = 1; i <= 12; i++) {
  const choix = sansMain(A.auHasard(1000 + i * 7, { gratuit: false }));
  const k = `visiteur-${String(i).padStart(2, '0')}`;
  const c = A.avatar(choix, { uid: `v${i}` });
  const l = poses(c, { lanterne: true, couverture: COUV[i % COUV.length], parapluie: PARAPLUIES[i % PARAPLUIES.length] });
  publier('visiteurs', k, `Visiteur ${i}`, `visiteurs/${k}`, k, l, { choix });
  planches.visiteurs.push(row(`Visiteur ${i}`, cellules(l, ['face_marche', 'avant_repos', 'dos_repos', 'avant_salut', 'face_assis', 'avant_assis', 'face_mains-tendues', 'avant_assis-mains-tendues', 'face_applaudir', 'avant_assis-applaudir', 'avant_pecher', 'avant_piocher', 'avant_cueillir', 'avant_porter', 'face_reparer', 'avant_assis-reparer', 'avant_repousser', 'face_ecrire', 'avant_assis-ecrire', 'avant_lanterne', 'dos_lanterne', 'avant_parapluie', 'couche'])));
}

// ---- 3. les nouveaux venus de l'épilogue : habits de voyage, bagage sur le dos, chapeau, valise à la main ----
const VOYAGE = [
  { haut: 'veste', bas: 'pantalon', tete: 'paille', dos: 'sacDos' }, { haut: 'chemise', bas: 'jupe', tete: 'beret', dos: 'besace' },
  { haut: 'pull', bas: 'pantalon', tete: 'bonnet', dos: 'sacDos' }, { haut: 'veste', bas: 'robe', tete: 'paille', dos: 'besace' },
  { haut: 'sweat', bas: 'pantalon', tete: 'casquette', dos: 'sacDos' }, { haut: 'chemise', bas: 'pantalon', tete: 'beret', dos: 'besace' },
  { haut: 'veste', bas: 'jupe', tete: 'bonnet', dos: 'sacDos' }, { haut: 'mariniere', bas: 'pantalon', tete: 'casquette', dos: 'besace' }
];
const VALISES = ['#9A5A34', '#3E5A8C', '#7A3A3A', '#5E7A4A'];
VOYAGE.forEach((t, j) => {
  const i = j + 1, base = sansMain(A.auHasard(5000 + i * 11, { gratuit: false }));
  const choix = A.verifier({ ...base, haut: t.haut, bas: t.bas, accessoires: { ...base.accessoires, tete: { id: t.tete }, dos: { id: t.dos } } });
  const k = `arrivant-${String(i).padStart(2, '0')}`;
  const c = A.avatar(choix, { uid: `e${i}` });
  const l = poses(c, { couche: false, valise: VALISES[j % VALISES.length] });
  publier('epilogue', k, `Nouveau venu ${i}`, `epilogue/${k}`, k, l, { choix });
  planches.visiteurs.push(row(`Nouveau venu ${i}`, cellules(l, ['face_marche', 'avant_marche', 'dos_marche', 'avant_repos', 'avant_salut', 'dos_salut', 'face_assis', 'avant_assis', 'face_mains-tendues', 'avant_assis-mains-tendues', 'face_applaudir', 'avant_assis-applaudir', 'avant_pecher', 'avant_piocher', 'avant_cueillir', 'avant_porter', 'face_reparer', 'avant_assis-reparer', 'avant_repousser', 'face_ecrire', 'avant_assis-ecrire'])));
});

write(path.join(LIB, 'quotidien.json'), JSON.stringify(index, null, 1));
write(path.join(DIR, 'quotidien_apercu.html'), animated('Le quotidien au grand format', 'Lot L4 : la lanterne, le parapluie, la marche de face (trois quarts avant en miroir, comme la bibliothèque le publie).', [['Les maîtres', anim]]));
const SOUS = 'Marche de face, repos et salut dans les trois vues, travail (le geste du métier), assis à la veillée, mains tendues vers le feu et applaudir, debout ou assis (trois vues), pêcher, piocher, cueillir et porter (trois vues), réparer, debout ou assis (trois vues), repousser une créature de la brume (trois vues), écrire, debout ou assis (trois vues), lanterne et parapluie (avant et dos), dormir couché. Trois quarts avant en miroir, comme la bibliothèque le publie.';
await shoot([
  [path.join(PNG, 'quotidien_maitres.png'), sheet('Les maîtres au quotidien (lot L4)', SOUS, planches.maitres), 1700],
  [path.join(PNG, 'quotidien_naufrages.png'), sheet('Les naufragés au quotidien (lot L4)', SOUS + ' Lanterne et parapluie : Aster et Rivet seulement.', planches.naufrages), 1700],
  [path.join(PNG, 'quotidien_visiteurs.png'), sheet('Visiteurs et nouveaux venus (lot L4)', 'Tirés du générateur de l\'avatar. Les nouveaux venus de l\'épilogue arrivent en habits de voyage, valise à la main, bagage sur le dos.', planches.visiteurs), 1700]
]);
console.log('ok', count, 'SVG');
