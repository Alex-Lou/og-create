// Lot G1 : les maîtres en naufragés (grand format de la troupe), leurs poses « endormi » (naufragé et maître) et les
// plans d'entrée du tutoriel. SVG dans lib/personnages/naufrages/<prénom>/ (et maitres/<prénom>/ pour l'endormi
// du maître), index naufrages.json, planches PNG, page animée.
const fs = require('fs');
const path = require('path');
const { frame, svg, POSES, EXPRS } = require('./troupe');
const { CAST } = require('./naufrages');
const { sleepFrame, isCurled } = require('./dormeurs');
const A = require('./arrivees');
const { unique, row, sheet, animated, write, shoot } = require('./planche');

const LIB = path.join(__dirname, 'lib', 'personnages');
const PNG = path.join(__dirname, 'planches');
const slug = n => n.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const box = (w, h) => (body, s = 1) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w * s}" height="${h * s}" viewBox="0 0 ${w} ${h}">${body}</svg>`;
const SV = { std: box(48, 64), curl: box(64, 48), scene: box(80, 64) };
const sleepSvg = c => (isCurled(c) ? SV.curl : SV.std);
const ARRIVALS = { Aster: A.asterScene, Cannelle: A.cannelleScene, Rivet: A.rivetScene, Ondin: (c, n) => A.ondinScene(c, n, sleepFrame) };
// Expressions en marche (trois quarts avant), propres au caractère de chacun (bible § 8)
const MOODS = {
  Aster: ['content', 'surpris', 'triste'], // sûre d'elle, le large, et sa culpabilité
  Cannelle: ['rire', 'triste', 'fache'], // la bonne humeur, l'inquiétude pour Ondin, elle gronde
  Rivet: ['content', 'surpris', 'fache'], // absorbé, « Si ! Si ! », la pièce qui résiste
  Ondin: ['endormi', 'surpris', 'content'], // il dort debout, réveillé d'un coup, rêveur
  Sylve: ['fache', 'gene', 'content'], // sur ses gardes, farouche, un sourire rare
  Galet: ['fache', 'triste', 'content'], // « Hm. », la mémoire des Anciens, un sourire dans la barbe
  'Mélisse': ['content', 'rire', 'triste'] // tranquille, les lunes, le chagrin caché
};
const STEP = { Aster: 'tutoriel, étape 2', Cannelle: 'tutoriel, étape 3', Rivet: 'tutoriel, étape 4', Ondin: 'tutoriel, étape 5', Sylve: 'acte I (La Lisière)', Galet: 'acte II (La Colline)', 'Mélisse': 'acte III (Les Jardins)' };

const index = {
  _lisez_moi: [
    'Les maîtres tels qu\'ils arrivent sur l\'île : habits délavés par la mer, lambeaux, pieds nus, voile ou couverture nouée, algues dans les cheveux ; chacun garde l\'objet qu\'il a sauvé.',
    'Ils quittent ce look au souvenir retrouvé (bible § 14 : le sceau s\'allume, il se lève, outil en main), c\'est-à-dire quand leur bâtiment est fondé ; ils prennent alors le look des maitres/.',
    'Debout : même repère que la troupe (48 × 64, pieds en bas au centre, 24 ; 62), mêmes vues et poses (face, trois quarts avant « se », trois quarts dos « ne », miroir pour les deux autres), mêmes expressions.',
    'Endormi : assis, 48 × 64 (sol en bas) ; Sylve roulée en boule : 64 × 48 (sol en bas, centre 32 ; 46). 2 images (les « z » montent, la bulle d\'Ondin gonfle). L\'endormi du maître est rangé avec lui (maitres/<prénom>/<prénom>_dort_*.svg ; à ne pas confondre avec l\'expression expr_endormi).',
    'Plans d\'entrée du tutoriel : 80 × 64, fond transparent, sol en bas (40 ; 62), 2 images (≈ 450 ms).',
    'Expressions en marche : trois quarts avant, 4 images (≈ 170 ms), pour chacun les expressions de son caractère ; naufragé ici (naufrage_avant_marche_<expression>), maître dans maitres/<prénom>/<prénom>_avant_marche_<expression>_*.svg.'
  ],
  naufrages: {}
};
const anim = [['Les naufragés en marche', []], ['Endormis', []], ['Plans d\'entrée', []], ['Expressions en marche', []]];
const cells = { debout: [], endormis: [], arrivees: [], expr: [], moods: [] };
let count = 0;

for (const { base, nau } of CAST) {
  const s = slug(base.name), dir = path.join(LIB, 'naufrages', s);
  const files = {};
  const put = (name, bodies, svgOf, d = dir, rel = `naufrages/${s}`) => {
    files[name] = bodies.map((b, n) => {
      const f = `${s}_${name}_${n + 1}.svg`;
      write(path.join(d, f), svgOf(b));
      count++;
      return `${rel}/${f}`;
    });
    return bodies;
  };
  // debout : les poses de la troupe, puis les expressions
  const poses = [...POSES, [base.action[0], base.action[1], 'action', 2]];
  const shown = {};
  for (const [name, view, pose, k] of poses) shown[name] = put(`naufrage_${name}`, Array.from({ length: k }, (_, n) => frame(nau, view, pose, n)), b => SV.std(b));
  const exprs = EXPRS.map(x => put(`naufrage_expr_${x}`, [0, 1].map(n => frame(nau, 'front', 'repos', n, x)), b => SV.std(b)));
  // endormi : naufragé ici, maître dans son dossier
  const sleepN = put('naufrage_dort', [0, 1].map(n => sleepFrame(nau, n)), b => sleepSvg(nau)(b));
  const sleepM = [0, 1].map(n => sleepFrame(base, n));
  const mFiles = sleepM.map((b, n) => { const f = `${s}_dort_${n + 1}.svg`; write(path.join(LIB, 'maitres', s, f), sleepSvg(base)(b)); count++; return `maitres/${s}/${f}`; });
  // expressions en marche, maître et naufragé
  const moods = {};
  for (const x of MOODS[base.name]) {
    moods[x] = put(`naufrage_avant_marche_${x}`, [0, 1, 2, 3].map(n => frame(nau, 'se', 'marche', n, x)), b => SV.std(b));
    files[`maitre_avant_marche_${x}`] = [0, 1, 2, 3].map(n => { const f = `${s}_avant_marche_${x}_${n + 1}.svg`; write(path.join(LIB, 'maitres', s, f), SV.std(frame(base, 'se', 'marche', n, x))); count++; return `maitres/${s}/${f}`; });
  }
  cells.moods.push(row(base.name, MOODS[base.name].flatMap(x => [[SV.std(unique(frame(base, 'se', 'marche', 1, x)), 2.2), `${x} · maître`], [SV.std(unique(moods[x][1]), 2.2), `${x} · naufragé`]])));
  for (const x of MOODS[base.name]) anim[3][1].push({ label: `${base.name} — ${x}`, frames: moods[x].map(b => SV.std(unique(b), 3)), timings: [170], w: 144, h: 192 });
  // plan d'entrée (tutoriel)
  let arr = null;
  if (ARRIVALS[base.name]) arr = put('arrivee', [0, 1].map(n => ARRIVALS[base.name](nau, n)), b => SV.scene(b));

  index.naufrages[s] = { nom: base.name, arrivee: STEP[base.name], fichiers: files, dort_du_maitre: mFiles };

  // planches
  const pick = [['face_repos', 0, 'face'], ['avant_marche', 1, 'marche'], ['dos_marche', 0, 'dos'], ['face_salut', 0, 'salut'], [base.action[0], 1, 'action']];
  cells.debout.push(row(`${base.name}`, [
    [SV.std(unique(frame(base, 'front', 'repos', 0)), 2.6), 'maître'],
    ...pick.map(([k, n, lab]) => [SV.std(unique(shown[k][n]), 2.6), lab])
  ]));
  cells.expr.push(row(base.name, EXPRS.map((x, i) => [SV.std(unique(exprs[i][0]), 1.9), x])));
  cells.endormis.push(row(base.name, [...sleepN.map((b, n) => [sleepSvg(nau)(unique(b), 3), `naufragé ${n + 1}`]), ...sleepM.map((b, n) => [sleepSvg(base)(unique(b), 3), `maître ${n + 1}`])]));
  if (arr) cells.arrivees.push(row(`${base.name} — ${STEP[base.name]}`, arr.map((b, n) => [SV.scene(unique(b), 4), String(n + 1)])));

  // page animée
  const walk = shown.avant_marche;
  anim[0][1].push({ label: base.name, frames: walk.map(b => SV.std(unique(b), 4)), timings: [170], w: 192, h: 256 });
  anim[0][1].push({ label: `${base.name} (miroir)`, frames: walk.map(b => SV.std(unique(b), 4)), timings: [170], w: 192, h: 256, mirror: true });
  const curl = isCurled(nau);
  anim[1][1].push({ label: `${base.name} endormi${base.name === 'Aster' || base.name === 'Cannelle' || base.name === 'Mélisse' || base.name === 'Sylve' ? 'e' : ''}`, frames: sleepN.map(b => sleepSvg(nau)(unique(b), 4)), timings: [900], w: curl ? 256 : 192, h: curl ? 192 : 256 });
  if (arr) anim[2][1].push({ label: `${base.name} — ${STEP[base.name]}`, frames: arr.map(b => SV.scene(unique(b), 4)), timings: [450], w: 320, h: 256 });
}

write(path.join(LIB, 'naufrages', 'naufrages.json'), JSON.stringify(index, null, 1));
write(path.join(__dirname, 'naufrages_apercu.html'), animated('Les naufragés', 'Les maîtres tels qu\'ils arrivent sur l\'île, endormis, et leurs plans d\'entrée du tutoriel.', anim));
shoot([
  [path.join(PNG, 'naufrages_debout.png'), sheet('Naufragés — debout', 'Le maître, puis son naufragé : face, marche de trois quarts, dos, salut, geste. 48 × 64, pieds en bas au centre.', cells.debout), 1150],
  [path.join(PNG, 'naufrages_expressions.png'), sheet('Naufragés — expressions', 'Les 8 expressions de la troupe, sur le look du naufragé.', cells.expr), 1150],
  [path.join(PNG, 'expressions_en_marche.png'), sheet('Expressions en marche', 'Trois quarts avant, 4 images : pour chacun les expressions de son caractère, maître et naufragé (image 2 de la marche).', cells.moods), 1150],
  [path.join(PNG, 'naufrages_endormis.png'), sheet('Endormis', 'Pose « endormi » (bible § 6.7 et § 14), naufragé puis maître. Sylve roulée en boule : 64 × 48.', cells.endormis), 1150],
  [path.join(PNG, 'naufrages_arrivees.png'), sheet('Plans d\'entrée du tutoriel', '80 × 64, fond transparent (ici sur fond sable pour la lecture). 2 images.', cells.arrivees.map(r => r.replace(/<svg /g, '<svg style="background:#EADFC2;border-radius:6px" '))), 1150]
]).then(() => console.log('ok', count, 'SVG'));
