// Lot A — les vivants : Brume (stades), Anya, le cerf blanc, le Passeur. SVG dans lib/vivants/<nom>/, planches PNG
// (planches/), page animée (vivants_apercu.html).
const path = require('path');
const { unique, row, sheet, animated, write, shoot } = require('./planche');
const { frame, svg, POSES, EXPRS } = require('./troupe');
const { STAGES, brumeFrame, svgB } = require('./brume');
const { anyaFrame, POSES_A, EXPR_OF, svgA } = require('./anya');
const { cerfFrame, svgC } = require('./cerf');
const passeur = require('./passeur');

const LIB = path.join(__dirname, 'lib', 'vivants');
const OUT = path.join(__dirname, 'planches');
const XL = { neutre: 'Neutre', content: 'Content', rire: 'Rire', surpris: 'Surpris', triste: 'Triste', fache: 'Fâché', gene: 'Gêné', endormi: 'Endormi' };
const shots = [];
const anim = [];

// ——— Brume : chaque stade en 4 images (flottement), expressions sur le stade 1
{
  const rows = [], boxes = [];
  for (const [key, st] of Object.entries(STAGES)) {
    const frames = [0, 1, 2, 3].map(n => brumeFrame(key, n));
    frames.forEach((b, n) => write(path.join(LIB, 'brume', `brume_${key}_${n + 1}.svg`), svgB(b)));
    rows.push(row(st.label, frames.map((b, n) => [svgB(unique(b), 3), n + 1])));
    boxes.push({ label: st.label, frames: frames.map(b => svgB(unique(b), 4)), timings: [220, 220, 220, 220], w: 160, h: 192 });
  }
  const xr = [], xb = [];
  for (const x of EXPRS) {
    const frames = [0, 1].map(n => brumeFrame('s1', n, x));
    frames.forEach((b, n) => write(path.join(LIB, 'brume', `brume_expr_${x}_${n + 1}.svg`), svgB(b)));
    xr.push([svgB(unique(frames[0]), 3), XL[x]]);
    xb.push({ label: XL[x], frames: frames.map(b => svgB(unique(b), 4)), timings: [600, 600], w: 160, h: 192 });
  }
  rows.push(row('Expressions (yeux seuls)', xr));
  shots.push([path.join(OUT, 'planche_brume.png'), sheet('Brume — stades et expressions', 'Repère 40 × 48, bas de la flamme en (20, 32). Flottement en 4 images ; les expressions se posent sur n\'importe quel stade.', rows), 1100]);
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
    const t = pose === 'marche' ? [260, 260, 260, 260] : pose === 'repos' ? [1200, 1200] : [700, 900];
    boxes.push({ label: LABEL[name], frames: frames.map(b => svgA(unique(b), 2.4)), timings: t, w: 192, h: 307 });
    if (pose === 'marche') boxes.push({ label: LABEL[name] + ' (miroir)', frames: frames.map(b => svgA(unique(b), 2.4)), timings: t, w: 192, h: 307, mirror: true });
  }
  const xr = [];
  for (const x of EXPRS) {
    const frames = [0, 1].map(n => anyaFrame('front', 'repos', n, x));
    frames.forEach((b, n) => write(path.join(LIB, 'anya', `anya_expr_${x}_${n + 1}.svg`), svgA(b)));
    xr.push([svgA(unique(frames[0]), 1.6), XL[x]]);
  }
  rows.push(row('Expressions', xr));
  shots.push([path.join(OUT, 'planche_anya.png'), sheet('Anya — l\'Âme de l\'Île', 'Repère 80 × 128 (deux fois un naufragé), pieds en (40, 125). Halo de lucioles, fleurs à chaque pas.', rows), 1300]);
  anim.push(['Anya', boxes]);
}

// ——— Le cerf blanc (profil ; le miroir donne l'autre sens)
{
  const imgs = [['cerf_marche_1', cerfFrame('marche', 0)], ['cerf_marche_2', cerfFrame('marche', 1)], ['cerf_repos', cerfFrame('repos', 0)], ['cerf_clignement', cerfFrame('marche', 0, true)]];
  imgs.forEach(([f, b]) => write(path.join(LIB, 'cerf', `${f}.svg`), svgC(b)));
  const rows = [row('Profil', imgs.map(([f, b]) => [svgC(unique(b), 3), f.replace('cerf_', '')]))];
  shots.push([path.join(OUT, 'planche_cerf.png'), sheet('Le cerf blanc', 'Repère 80 × 80, sabots en y = 77, tourné vers la droite (miroir pour la gauche).', rows), 1100]);
  anim.push(['Le cerf blanc', [
    { label: 'Marche', frames: [cerfFrame('marche', 0), cerfFrame('marche', 1)].map(b => svgC(unique(b), 3)), timings: [300, 300], w: 240, h: 276 },
    { label: 'Marche (miroir)', frames: [cerfFrame('marche', 0), cerfFrame('marche', 1)].map(b => svgC(unique(b), 3)), timings: [300, 300], w: 240, h: 276, mirror: true },
    { label: 'Repos', frames: [cerfFrame('repos', 0), cerfFrame('repos', 0, true)].map(b => svgC(unique(b), 3)), timings: [1800, 180], w: 240, h: 276 }
  ]]);
}

// ——— Le Passeur (kit de la troupe)
{
  const rows = [], boxes = [];
  const LABEL = { face_repos: 'Face · repos', avant_marche: 'Trois quarts avant · marche', dos_marche: 'Trois quarts dos · marche', face_salut: 'Face · salut', face_lanterne: 'Action · lanterne levée' };
  for (const [name, view, pose, count] of [...POSES, [passeur.action[0], passeur.action[1], 'action', 2]]) {
    const frames = [...Array(count).keys()].map(n => frame(passeur, view, pose, n));
    frames.forEach((b, n) => write(path.join(LIB, 'passeur', `passeur_${name}_${n + 1}.svg`), svg(b)));
    rows.push(row(LABEL[name], frames.map((b, n) => [svg(unique(b), 4), n + 1])));
    const t = pose === 'marche' ? [200, 200, 200, 200] : pose === 'repos' ? [900, 160] : [700, 900];
    boxes.push({ label: LABEL[name], frames: frames.map(b => svg(unique(b), 4)), timings: t, w: 192, h: 256 });
  }
  const xr = [];
  for (const x of EXPRS) {
    const frames = [0, 1].map(n => frame(passeur, 'front', 'repos', n, x));
    frames.forEach((b, n) => write(path.join(LIB, 'passeur', `passeur_expr_${x}_${n + 1}.svg`), svg(b)));
    xr.push([svg(unique(frames[0]), 3), XL[x]]);
  }
  rows.push(row('Expressions (yeux qui luisent)', xr));
  shots.push([path.join(OUT, 'planche_passeur.png'), sheet('Le Passeur', 'Repère 48 × 64 de la troupe, pieds en (24, 62). La perche passe devant la capuche.', rows), 1100]);
  anim.push(['Le Passeur', boxes]);
}

write(path.join(__dirname, 'vivants_apercu.html'), animated('Les vivants en mouvement', 'Brume, Anya, le cerf blanc et le Passeur (lot A).', anim));
shoot(shots).then(() => console.log('ok'));
