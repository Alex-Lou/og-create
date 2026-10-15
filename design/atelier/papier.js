// Le papier découpé (choix de l'auteur, 15 oct. : « un design un peu neuf pour nos animations », à la manière des
// cinématiques d'Alice Madness Returns, des collages 2D, mouvementés, fluides et propres ; en gardant nos personnages
// et notre ton doux). Un essai sur la veillée, en SVG animé comme le reste (SMIL, sans filtre) :
//   - chaque plan du décor est une feuille découpée, posée sur la précédente : son ombre de papier, sombre et décalée,
//     tombe sur le plan d'en dessous ;
//   - les personnages sont des marionnettes de papier : le corps, les bras et la tête sont des pièces à part (assis.js :
//     assisPieces), chacune avec son ombre de découpe, qui pivotent à leurs attaches (épaules, cou), en mouvements
//     amortis ;
//   - la caméra glisse doucement, les plans en parallaxe (le plan de l'avatar, que le jeu pose par-dessus, ne bouge pas) ;
//   - un grain de papier sur toute l'image.
// Aucune forme, aucun visage ni aucune couleur de base n'est redessiné.
const { assisPieces } = require('./assis');
const { eclairerNuit, lumieresLocales, silhouetteDe } = require('./eclairage');
const { vaVient, hash, f } = require('./ouverture');

const NUIT = '#070B1C';

// l'ombre de papier d'un plan du décor : sa silhouette, sombre, décalée vers le bas (la lumière vient de Brume et du
// ciel), sous lui
const ombrePapier = (corps, dx = 1.6, dy = 2.6, op = 0.5) => `<g transform="translate(${dx} ${dy})" color="${NUIT}" opacity="${op}">${silhouetteDe(corps)}</g>${corps}`;

// un plan de la caméra : il glisse d'un côté à l'autre, amorti (a : l'amplitude en x, en pixels ; le signe donne le
// sens : le fond va à l'opposé du premier plan) ; z : un léger agrandissement, pour que ses bords ne se découvrent pas
const plan = (corps, a, z = 1, dur = 16) => `<g>${a ? vaVient('translate', `${f(-a)} 0`, `${f(a)} 0`, dur) : ''}${z !== 1 ? `<g transform="translate(200 0) scale(${z}) translate(-200 0)">${corps}</g>` : corps}</g>`;

// le grain du papier : de courtes fibres sombres, à peine visibles, sur toute l'image (jamais claires : pas de voile pâle
// sur le trait des personnages ; pas de points : ils se lisaient comme des taches sur les visages)
function grain(pref) {
  let t = '';
  for (let i = 0; i < 46; i++) {
    const x = hash(i, 91) * 64, y = hash(i, 92) * 64, a = hash(i, 93) * Math.PI, l = 1.5 + hash(i, 94) * 4;
    t += `<path d="M${f(x)},${f(y)} l${f(Math.cos(a) * l)},${f(Math.sin(a) * l)}" stroke="#2A1E14" stroke-width="${f(0.3 + hash(i, 95) * 0.3)}" opacity="${f(0.03 + hash(i, 96) * 0.04)}"/>`;
  }
  return `<defs><pattern id="${pref}grain" patternUnits="userSpaceOnUse" width="64" height="64">${t}</pattern></defs><rect width="400" height="400" fill="url(#${pref}grain)"/>`;
}

// Une marionnette de papier assise : un personnage du jeu (assis.js), en pièces éclairées de nuit, chacune avec son
// ombre de découpe, qui bougent à leurs attaches. (x, y, s, m) : comme poserEclaire ; L : les lumières de la scène ;
// i : son rang (décale ses mouvements de ceux des autres) ; geste : un geste de gestes.js, ou rien (il cligne alors des
// yeux) ; feu : [x, y] (l'ombre de découpe tombe à l'opposé)
function pantinAssis(c, view, x, y, s, m, id, L, i, expr, geste, feu) {
  const { l, repere } = lumieresLocales(L, x, y, s, m);
  const box = [-4, -6, 56, 74];
  const p0 = assisPieces(c, view, 0, expr, geste), p1 = geste ? null : assisPieces(c, view, 1, expr, geste);
  // l'ombre de découpe, à l'opposé du feu, dans le repère du personnage
  const d = Math.hypot(x - feu[0], y - feu[1]) || 1, ox = f(((x - feu[0]) / d) * 0.7 * m), oy = f(0.7);
  const piece = (corps, k) => {
    if (!corps) return '';
    const lit = eclairerNuit(corps, `${id}${k}`, box, l);
    return `<use href="#${id}${k}S" color="${NUIT}" opacity="0.4" transform="translate(${ox} ${oy})"/>${lit}`;
  };
  // les mouvements, amortis, propres à chacun (durées et départs décalés par son rang)
  const t = 3.4 + (i % 4) * 0.55, b = i * 0.9;
  const [eg, ed] = p0.epaules, cou = p0.cou;
  const tourne = (a0, a1, [px, py], dur, beg) => vaVient('rotate', `${a0} ${f(px)} ${f(py)}`, `${a1} ${f(px)} ${f(py)}`, dur, beg);
  // les bras : ils se balancent à l'épaule, l'un après l'autre (on se frotte les mains au chaud), ou à peine (au repos)
  const amp = geste ? 5 : 1.6;
  const brasG = p0.brasG ? `<g>${tourne(-amp, amp * 0.6, eg, t * 0.6, b)}${piece(p0.brasG, 'g')}</g>` : '';
  const brasD = p0.brasD ? `<g>${tourne(amp, -amp * 0.6, ed, t * 0.6, b + t * 0.3)}${piece(p0.brasD, 'd')}</g>` : '';
  // la tête : elle penche d'un côté puis de l'autre, hoche un peu ; sans geste, elle cligne des yeux (la tête de
  // l'image 2, un instant)
  let tete = piece(p0.tete, 't');
  if (p1) {
    const per = 3.6 + (i % 3) * 0.9, t0 = f(1 + i * 0.7);
    const cl = on => `<animate attributeName="opacity" values="${on ? '1;0;1' : '0;1;0'}" keyTimes="0;${f(t0 / per)};${f((t0 + 0.16) / per)}" calcMode="discrete" dur="${f(per)}s" repeatCount="indefinite"/>`;
    tete = `<g>${cl(true)}${tete}</g><g opacity="0">${cl(false)}${eclairerNuit(p1.tete, `${id}u`, box, { ...l, silhouette: `${id}tS` })}</g>`;
  }
  tete = `<g>${tourne(-3, 3.5, cou, t * 1.3, b)}<g>${vaVient('translate', '0 0', '0 -0.45', t * 0.65, b)}${tete}</g></g>`;
  // le corps : il respire (un gonflement depuis l'assise) et se penche vers le feu
  const vers = feu[0] > x ? 1 : -1, assise = 53.6;
  const tout = piece(p0.corps, 'c') + brasG + brasD + (p0.dessus ? eclairerNuit(p0.dessus, `${id}o`, box, l) : '') + tete;
  return `<g transform="${repere}"><g>${tourne(f(vers * m * 0.4), f(vers * m * 2.2), [24, assise], t * 1.6, b)}<g transform="translate(24 ${assise})"><g>${vaVient('scale', '1 1', '1.012 1.025', t * 0.85, b)}<g transform="translate(-24 ${-assise})">${tout}</g></g></g></g></g>`;
}

module.exports = { ombrePapier, plan, grain, pantinAssis };
