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

// ——— les outils du papier découpé (la porte du phare, puis toutes les scènes ; choix de l'auteur, 16 oct.) ———
// l'encre du contour des pièces
const ENCRE = '#1E1A22';
// ——— les ciseaux ———
// Un contour coupé aux ciseaux : les côtés du polygone (points [x, y]) découpés en petits pas, chacun un peu de travers
// (amp : l'écart, seed : la main) ; fermé
function rugueux(pts, amp = 1.4, seed = 1, pas = 7) {
  const out = [];
  for (let i = 0; i < pts.length; i++) {
    const [ax, ay] = pts[i], [bx, by] = pts[(i + 1) % pts.length], l = Math.hypot(bx - ax, by - ay), n = Math.max(1, Math.round(l / pas));
    const nx = -(by - ay) / (l || 1), ny = (bx - ax) / (l || 1);
    for (let k = 0; k < n; k++) {
      const t = k / n, e = (hash(seed * 31 + i, k) - 0.5) * 2 * amp;
      out.push([ax + (bx - ax) * t + nx * e, ay + (by - ay) * t + ny * e]);
    }
  }
  return `M${out.map(([x, y]) => `${f(x)},${f(y)}`).join(' L')} Z`;
}
// une courbe échantillonnée : fn(t) → [x, y], t de 0 à 1
const courbe = (fn, n = 24) => Array.from({ length: n + 1 }, (_, k) => fn(k / n));
// une pièce de papier : son contour coupé, sa couleur, l'encre, l'épaisseur du papier sur le bord éclairé (le haut :
// les bordN premiers points), son papier (un motif posé dessus, découpé à la pièce)
function piece(D, pts, fill, o = {}) {
  const d = rugueux(pts, o.amp ?? 1.4, o.seed ?? 1);
  let s = `<path d="${d}" fill="${fill}" stroke="${ENCRE}" stroke-width="${o.encre ?? 1.5}" stroke-linejoin="round"/>`;
  if (o.texture) s += `<path d="${d}" fill="url(#${o.texture})" opacity="${o.textureA ?? 1}"/>`;
  if (o.bord) {
    const haut = pts.slice(0, o.bordN ?? Math.ceil(pts.length / 2));
    s += `<path d="M${haut.map(([x, y]) => `${f(x)},${f(y + 1.2)}`).join(' L')}" fill="none" stroke="${o.bord}" stroke-width="1.2" stroke-linecap="round" opacity="0.7"/>`;
  }
  return s;
}

// ——— les papiers : un motif par matière ———
function papiers(pref) {
  const tache = (x, y, r, c, a) => `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(r)}" ry="${f(r * 0.6)}" fill="${c}" opacity="${f(a)}"/>`;
  const fibres = (n, c, a, k) => Array.from({ length: n }, (_, i) => { const x = hash(i, k) * 80, y = hash(i, k + 1) * 80, an = hash(i, k + 2) * Math.PI, l = 2 + 5 * hash(i, k + 3); return `<path d="M${f(x)},${f(y)} l${f(Math.cos(an) * l)},${f(Math.sin(an) * l)}" stroke="${c}" stroke-width="0.5" opacity="${f(a)}"/>`; }).join('');
  const motif = (id, corps, t = 80) => `<pattern id="${pref}${id}" patternUnits="userSpaceOnUse" width="${t}" height="${t}">${corps}</pattern>`;
  return `<defs>`
    // (le lavis du ciel sur un grand carreau, très léger : la répétition ne se voit pas)
    + motif('ciel', Array.from({ length: 14 }, (_, i) => tache(hash(i, 1) * 200, hash(i, 2) * 200, 10 + 30 * hash(i, 3), i % 2 ? '#FFFFFF' : '#0A0E28', 0.025)).join('') + Array.from({ length: 70 }, (_, i) => { const x = hash(i, 4) * 200, y = hash(i, 5) * 200, an = hash(i, 6) * Math.PI, l = 2 + 5 * hash(i, 7); return `<path d="M${f(x)},${f(y)} l${f(Math.cos(an) * l)},${f(Math.sin(an) * l)}" stroke="#C8D0F0" stroke-width="0.5" opacity="0.1"/>`; }).join(''), 200)
    + motif('pierre', Array.from({ length: 14 }, (_, i) => tache(hash(i, 11) * 80, hash(i, 12) * 80, 4 + 9 * hash(i, 13), i % 3 ? '#0A0C12' : '#A8B4C8', i % 3 ? 0.14 : 0.08)).join('') + Array.from({ length: 22 }, (_, i) => `<circle cx="${f(hash(i, 14) * 80)}" cy="${f(hash(i, 15) * 80)}" r="0.6" fill="#05070C" opacity="0.4"/>`).join(''))
    + motif('mer', Array.from({ length: 16 }, (_, i) => `<path d="M${f(hash(i, 21) * 80)},${f(hash(i, 22) * 80)} q8,-1 ${f(10 + 16 * hash(i, 23))},0" stroke="${i % 3 ? '#0A1430' : '#9AAAE0'}" stroke-width="${f(0.8 + hash(i, 24))}" fill="none" opacity="${i % 3 ? 0.3 : 0.18}" stroke-linecap="round"/>`).join(''))
    + motif('roc', Array.from({ length: 40 }, (_, i) => `<circle cx="${f(hash(i, 31) * 80)}" cy="${f(hash(i, 32) * 80)}" r="${f(0.4 + hash(i, 33))}" fill="${i % 4 ? '#06050A' : '#B8B4C8'}" opacity="${i % 4 ? 0.35 : 0.2}"/>`).join('') + fibres(12, '#B8B4C8', 0.15, 34))
    + motif('bois', Array.from({ length: 10 }, (_, i) => `<path d="M${f(hash(i, 41) * 80)},0 q${f(2 - 4 * hash(i, 42))},40 0,80" stroke="#05080A" stroke-width="0.7" fill="none" opacity="0.35"/>`).join(''))
    + `</defs>`;
}

// une spirale qui s'enroule (une volute de nuage, une crête de vague) : un chemin de (x, y), de rayon r, dans le sens d
const spirale = (x, y, r, d = 1, tours = 1.6) => {
  let s = `M${f(x)},${f(y)}`;
  const n = Math.round(tours * 10);
  for (let k = 1; k <= n; k++) {
    const a = (k / 10) * Math.PI * 2 * d - Math.PI / 2, rr = r * (1 - k / (n + 2));
    s += ` L${f(x + Math.cos(a) * rr)},${f(y + r + Math.sin(a) * rr)}`;
  }
  return s;
};
// une volute qui se dessine, se tient, puis se défait (dur, début), en trait clair
const volute = (d, couleur, dur, beg, w = 1.8) => `<path d="${d}" fill="none" stroke="${couleur}" stroke-width="${w}" stroke-linecap="round" stroke-dasharray="120" stroke-dashoffset="120"><animate attributeName="stroke-dashoffset" values="120;0;0;120" keyTimes="0;0.35;0.7;1" calcMode="spline" keySplines="0.4 0 0.2 1;0 0 1 1;0.6 0 0.8 1" dur="${f(dur)}s" begin="${f(-beg)}s" repeatCount="indefinite"/></path>`;

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

module.exports = { ombrePapier, plan, grain, pantinAssis, ENCRE, rugueux, courbe, piece, papiers, spirale, volute };
