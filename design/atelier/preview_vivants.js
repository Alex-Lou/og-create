// Lot A — les vivants : Brume (stades), Anya, le cerf blanc, le Passeur. SVG dans lib/vivants/<nom>/, planches PNG
// (planches/), page animée (vivants_apercu.html).
const path = require('path');
const { unique, row, sheet, animated, write, shoot } = require('./planche');
const { frame, svg, POSES, EXPRS, IMAGES } = require('./troupe');
const { STAGES, brumeFrame, brumeEyes, svgB } = require('./brume');
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

// ——— Anya (l'initiale, argentée) et son cerf de lune refondu (vivants_refonte.js : les mêmes fichiers que
// generateur_vivants.mjs)
{
  const V = require('./vivants_refonte');
  const { vitessePersonnage } = require('./noms_personnages');
  for (const [f, a] of V.liste()) { const { lib, svg } = V[f](...a); write(path.join(__dirname, 'lib', lib), svg); }
  const corps = svg => svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
  const svgA = (body, k) => `<svg xmlns="http://www.w3.org/2000/svg" width="${80 * k}" height="${128 * k}" viewBox="0 0 80 128">${body}</svg>`;
  const svgC = (body, k) => `<svg xmlns="http://www.w3.org/2000/svg" width="${120 * k}" height="${144 * k}" viewBox="0 0 120 144">${body}</svg>`;
  const NOM = { repos: 'Repos', marche: 'Marche', benediction: 'Bénédiction', eveil: 'Éveil', apparaitre: 'Apparaître', disparaitre: 'Disparaître' };
  const nom = pose => NOM[pose] || `Murmure (phrase ${pose.slice(-1)})`;
  const cadence = pose => { const ms = vitessePersonnage('vivants/anya', pose.replace(/\d+$/, '')); return Array.isArray(ms) ? ms : [ms]; };
  // Anya : chaque pose dans ses vues (l'été), la 2e image ; ses saisons au repos ; ses expressions
  const rows = V.POSES.map(([pose, vues, k]) => row(nom(pose), vues.map(vue => [svgA(unique(corps(V.anya(pose, vue, Math.min(2, k)).svg)), 1.6), vue])));
  rows.push(row('Ses saisons, au repos', V.SAISONS.map(saison => [svgA(unique(corps(V.anya('repos', 'face', 1, saison).svg)), 1.6), saison])));
  rows.push(row('Expressions', Object.keys(V.EXPR).map(x => [svgA(unique(corps(V.anyaExpression(x, 1).svg)), 1.6), x])));
  shots.push([path.join(OUT, 'planche_anya.png'), sheet('Anya — l\'Âme de l\'Île', 'L\'initiale (anya.js), la chevelure argentée. Repère 80 × 128 (deux fois un naufragé), pieds en (40, 125). Ses poses d\'origine, et ce que l\'île lui demande : apparaître et disparaître dans ses lucioles, le murmure (une bulle de son écriture de lune). Trois quarts avant tourné vers le bas à gauche ici ; la bibliothèque le publie en miroir ; le manteau vivant change avec les saisons.', rows), 1300]);
  const boites = [['repos', 'face'], ['marche', 'avant'], ['apparaitre', 'face'], ['murmure1', 'face']].map(([pose, vue]) => {
    const k = V.POSES.find(p => p[0] === pose)[2];
    return { label: nom(pose), frames: [...Array(k).keys()].map(n => svgA(unique(corps(V.anya(pose, vue, n + 1).svg)), 2.4)), timings: cadence(pose), w: 192, h: 307 };
  });
  anim.push(['Anya', boites]);
  // le cerf de lune : chaque pose dans ses trois vues
  const rowsC = Object.entries(V.CERF).filter(([, k]) => k > 1).map(([pose, k]) => row(pose, V.VUES_CERF.map(vue => [svgC(unique(corps(V.cerf(vue, pose, Math.min(2, k)).svg)), 1.4), vue])));
  shots.push([path.join(OUT, 'planche_cerf.png'), sheet('Le cerf de lune', 'Refondu (design/personnages/refonte/cerf_lune.js). Repère 120 × 144, à l\'échelle d\'Anya ; de face, trois quarts avant (vers le bas à droite) et de dos (vers le haut à droite) ; le miroir donne l\'autre sens.', rowsC), 1100]);
  anim.push(['Le cerf de lune', ['debout', 'marche'].map(pose => ({ label: pose, frames: [...Array(V.CERF[pose]).keys()].map(n => svgC(unique(corps(V.cerf('avant', pose, n + 1).svg)), 2)), timings: [pose === 'marche' ? 120 : 420], w: 240, h: 288 }))]);
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
