// Lot A — les vivants : Brume (stades), Anya, le cerf blanc, le Passeur. SVG dans lib/vivants/<nom>/, planches PNG
// (planches/), page animée (vivants_apercu.html).
const path = require('path');
const { unique, row, sheet, animated, write, shoot } = require('./planche');
const { frame, svg, POSES, EXPRS, IMAGES } = require('./troupe');
const { STAGES, brumeFrame, brumeEyes, svgB } = require('./brume');
const { anyaFrame, POSES_A, EXPR_OF, svgA, SAISONS_A } = require('./anya');
const { cerfFrame, svgC } = require('./cerf');
const passeur = require('./passeur');

const LIB = path.join(__dirname, 'lib', 'vivants');
const OUT = path.join(__dirname, 'planches');
const XL = { neutre: 'Neutre', content: 'Content', rire: 'Rire', surpris: 'Surpris', triste: 'Triste', fache: 'Fâché', gene: 'Gêné', endormi: 'Endormi' };
const shots = [];
const anim = [];

// ——— Brume : chaque stade en 4 images (flottement) ; expressions en calques (les yeux seuls), posés sur n'importe quel stade
{
  const rows = [], boxes = [];
  for (const [key, st] of Object.entries(STAGES)) {
    const frames = [0, 1, 2, 3].map(n => brumeFrame(key, n));
    frames.forEach((b, n) => write(path.join(LIB, 'brume', `brume_${key}_${n + 1}.svg`), svgB(b)));
    rows.push(row(st.label, frames.map((b, n) => [svgB(unique(b), 3), n + 1])));
    boxes.push({ label: st.label, frames: frames.map(b => svgB(unique(b), 4)), timings: [220, 220, 220, 220], w: 160, h: 192 });
  }
  const xr = [], x1 = [], x7 = [], xb = [];
  for (const x of EXPRS.filter(x => x !== 'fache')) { // Brume ne gronde jamais (§ 8)
    // le fichier : le calque seul ; la planche le montre aussi posé sur le stade 1 et sur le stade 7 (dessinés sans visage)
    [0, 1].forEach(n => write(path.join(LIB, 'brume', `brume_expr_${x}_${n + 1}.svg`), svgB(brumeEyes(n, x))));
    xr.push([svgB(brumeEyes(0, x), 3), XL[x]]);
    x1.push([svgB(unique(brumeFrame('s1', 0, x, false) + brumeEyes(0, x)), 3), XL[x]]);
    x7.push([svgB(unique(brumeFrame('s7', 0, x, false) + brumeEyes(0, x)), 3), XL[x]]);
    xb.push({ label: XL[x], frames: [0, 1].map(n => svgB(unique(brumeFrame('s1', n, x, false) + brumeEyes(n, x)), 4)), timings: [600, 600], w: 160, h: 192 });
  }
  rows.push(row('Expressions · le calque (yeux seuls)', xr), row('Posées sur le stade 1', x1), row('Posées sur le stade 7', x7));
  shots.push([path.join(OUT, 'planche_brume.png'), sheet('Brume — stades et expressions', 'Repère 40 × 48, bas de la flamme en (20, 32). Flottement en 4 images ; les expressions sont des calques (les yeux seuls) qui se posent sur n\'importe quel stade dessiné sans visage.', rows), 1100]);
  anim.push(['Brume — stades', boxes], ['Brume — expressions', xb]);
}

// ——— Anya
{
  const rows = [], boxes = [];
  const LABEL = { face_repos: 'Face · repos', avant_marche: 'Trois quarts avant · marche', dos_marche: 'Trois quarts dos · marche', face_benediction: 'Face · bénédiction', face_eveil: 'Action · éveil' };
  for (const [name, view, pose, count] of POSES_A) {
    const frames = [...Array(count).keys()].map(n => anyaFrame(view, pose, n, EXPR_OF[pose]));
    frames.forEach((b, n) => write(path.join(LIB, 'anya', `anya_${name}_${n + 1}.svg`), svgA(b)));
    rows.push(row(LABEL[name], frames.map((b, n) => [svgA(unique(b), 2.4), n + 1])));
    const t = pose === 'marche' ? [130] : pose === 'repos' ? [1100, 900, 1100, 180] : pose === 'salut' ? [400] : [700, 900];
    boxes.push({ label: LABEL[name], frames: frames.map(b => svgA(unique(b), 2.4)), timings: t, w: 192, h: 307 });
    if (pose === 'marche') boxes.push({ label: LABEL[name] + ' (miroir)', frames: frames.map(b => svgA(unique(b), 2.4)), timings: t, w: 192, h: 307, mirror: true });
  }
  const xr = [];
  const XA = EXPRS.filter(x => !['fache', 'gene', 'rire', 'endormi'].includes(x)); // Anya est calme et n'élève jamais la voix (§ 8)
  for (const x of XA) {
    const frames = [...Array(IMAGES.repos).keys()].map(n => anyaFrame('front', 'repos', n, x));
    frames.forEach((b, n) => write(path.join(LIB, 'anya', `anya_expr_${x}_${n + 1}.svg`), svgA(b)));
    xr.push([svgA(unique(frames[0]), 1.6), XL[x]]);
  }
  rows.push(row('Expressions', xr));
  // le manteau vivant change avec les saisons : l'été est le manteau d'origine (ci-dessus) ; les trois autres saisons dans
  // toutes les poses et les expressions (anya_<vue>_<pose>_<saison>_<n>, anya_expr_<expression>_<saison>_<n>)
  for (const saison of SAISONS_A.filter(x => x !== 'ete')) {
    const cells = [];
    for (const [name, view, pose, count] of POSES_A) {
      const frames = [...Array(count).keys()].map(n => anyaFrame(view, pose, n, EXPR_OF[pose], saison));
      frames.forEach((b, n) => write(path.join(LIB, 'anya', `anya_${name}_${saison}_${n + 1}.svg`), svgA(b)));
      cells.push([svgA(unique(frames[0]), 1.6), LABEL[name]]);
      if (name === 'avant_marche') boxes.push({ label: `${LABEL[name]} · ${saison}`, frames: frames.map(b => svgA(unique(b), 2.4)), timings: [130], w: 192, h: 307 });
    }
    for (const x of XA) [...Array(IMAGES.repos).keys()].forEach(n => write(path.join(LIB, 'anya', `anya_expr_${x}_${saison}_${n + 1}.svg`), svgA(anyaFrame('front', 'repos', n, x, saison))));
    rows.push(row(`Manteau · ${saison}`, cells));
  }
  shots.push([path.join(OUT, 'planche_anya.png'), sheet('Anya — l\'Âme de l\'Île', 'Repère 80 × 128 (deux fois un naufragé), pieds en (40, 125). Halo de lucioles, fleurs à chaque pas. Le manteau vivant change avec les saisons : l\'été (la feuille verte aux nervures d\'or), le printemps (fleurs de cerisier, papillons), l\'automne (feuilles rousses, glands, plumes de chouette), l\'hiver (fourrure blanche, givre, flocons).', rows), 1300]);
  anim.push(['Anya', boxes]);
}

// ——— Le cerf blanc (profil, trois quarts avant et dos ; le miroir donne l'autre sens)
{
  const imgs = [['cerf_marche_1', cerfFrame('marche', 0)], ['cerf_marche_2', cerfFrame('marche', 1)], ['cerf_repos', cerfFrame('repos', 0)], ['cerf_clignement', cerfFrame('marche', 0, true)]];
  const imgsA = [['cerf_avant_marche_1', cerfFrame('marche', 0, false, 'avant')], ['cerf_avant_marche_2', cerfFrame('marche', 1, false, 'avant')], ['cerf_avant_repos', cerfFrame('repos', 0, false, 'avant')], ['cerf_avant_clignement', cerfFrame('marche', 0, true, 'avant')]];
  const imgsD = [['cerf_dos_marche_1', cerfFrame('marche', 0, false, 'dos')], ['cerf_dos_marche_2', cerfFrame('marche', 1, false, 'dos')], ['cerf_dos_repos', cerfFrame('repos', 0, false, 'dos')]];
  [...imgs, ...imgsA, ...imgsD].forEach(([f, b]) => write(path.join(LIB, 'cerf', `${f}.svg`), svgC(b)));
  const rows = [['Profil', imgs, 'cerf_'], ['Trois quarts avant', imgsA, 'cerf_avant_'], ['Trois quarts dos', imgsD, 'cerf_dos_']].map(([lab, list, pre]) => row(lab, list.map(([f, b]) => [svgC(unique(b), 3), f.replace(pre, '')])));
  shots.push([path.join(OUT, 'planche_cerf.png'), sheet('Le cerf blanc', 'Repère 80 × 80, sabots en y = 77 ; profil tourné vers la droite, trois quarts vers le bas à droite (avant) ou le haut à droite (dos) ; le miroir donne l\'autre sens.', rows), 1100]);
  const walk = (v) => [cerfFrame('marche', 0, false, v), cerfFrame('marche', 1, false, v)].map(b => svgC(unique(b), 3));
  anim.push(['Le cerf blanc', [
    { label: 'Marche', frames: walk('profil'), timings: [300, 300], w: 240, h: 276 },
    { label: 'Marche (miroir)', frames: walk('profil'), timings: [300, 300], w: 240, h: 276, mirror: true },
    { label: 'Repos', frames: [cerfFrame('repos', 0), cerfFrame('repos', 0, true)].map(b => svgC(unique(b), 3)), timings: [1800, 180], w: 240, h: 276 },
    { label: 'Marche trois quarts avant', frames: walk('avant'), timings: [300, 300], w: 240, h: 276 },
    { label: 'Marche trois quarts dos', frames: walk('dos'), timings: [300, 300], w: 240, h: 276 },
    { label: 'Repos trois quarts avant', frames: [cerfFrame('repos', 0, false, 'avant'), cerfFrame('repos', 0, true, 'avant')].map(b => svgC(unique(b), 3)), timings: [1800, 180], w: 240, h: 276 }
  ]]);
}

// ——— Le Passeur (kit de la troupe, agrandi : il est plus grand que les naufragés)
{
  const rows = [], boxes = [];
  const svg = passeur.svgP;
  const LABEL = { face_repos: 'Face · repos', avant_marche: 'Trois quarts avant · marche', dos_marche: 'Trois quarts dos · marche', face_salut: 'Face · salut', face_lanterne: 'Action · lanterne levée' };
  for (const [name, view, pose, count] of [...POSES, [passeur.action[0], passeur.action[1], 'action', 2]]) {
    const frames = [...Array(count).keys()].map(n => frame(passeur, view, pose, n));
    frames.forEach((b, n) => write(path.join(LIB, 'passeur', `passeur_${name}_${n + 1}.svg`), svg(b)));
    rows.push(row(LABEL[name], frames.map((b, n) => [svg(unique(b), 4), n + 1])));
    const t = pose === 'marche' ? [100] : pose === 'repos' ? [700, 600, 700, 160] : pose === 'salut' ? [190] : [700, 900];
    boxes.push({ label: LABEL[name], frames: frames.map(b => svg(unique(b), 4)), timings: t, w: 240, h: 320 });
  }
  const xr = [];
  for (const x of EXPRS) {
    const frames = [...Array(IMAGES.repos).keys()].map(n => frame(passeur, 'front', 'repos', n, x));
    frames.forEach((b, n) => write(path.join(LIB, 'passeur', `passeur_expr_${x}_${n + 1}.svg`), svg(b)));
    xr.push([svg(unique(frames[0]), 3), XL[x]]);
  }
  rows.push(row('Expressions (yeux qui luisent)', xr));
  shots.push([path.join(OUT, 'planche_passeur.png'), sheet('Le Passeur', 'Repère 60 × 80, pieds en (30, 78) : 1,25 fois un naufragé, au même trait. La perche passe devant la capuche.', rows), 1100]);
  anim.push(['Le Passeur', boxes]);
}

write(path.join(__dirname, 'vivants_apercu.html'), animated('Les vivants en mouvement', 'Brume, Anya, le cerf blanc et le Passeur (lot A).', anim));
shoot(shots).then(() => console.log('ok'));
