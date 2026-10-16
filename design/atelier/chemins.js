// Les chemins de l'île, au format des cases du terrain (losange isométrique 64 × 32, comme TW × TH de
// src/world/terrain.js). Un chemin relie le milieu de la case au milieu de ses côtés : quatre sens (NE, SE, SO, NO),
// donc 16 raccords (masque : NE 1, SE 2, SO 4, NO 8). Le chemin de terre battue (deux variantes) ; le chemin pavé, son
// amélioration ; le chemin sous la neige (une trace damée). Le creusement en 6 étapes, pour chaque raccord : le tracé
// marqué, l'herbe coupée, les mottes soulevées, la tranchée, le gravier et les pierres posés, le chemin tassé (la
// dernière étape est le chemin lui-même). Les effets du coup de bêche et de la pierre posée en suites d'images, dans un
// cadre de 64 × 48 dont la case occupe le bas. Fichiers × 4.
//
// Le dessin se fait au sol : (a, b) dans la case, de −0,5 à 0,5 (a vers le SE, x + 1 ; b vers le SO, y + 1), projeté en
// iso. La forme du chemin est un champ (la distance à son tracé, moins sa demi-largeur, un peu de bruit) dont on tire les
// contours : ses bords sont souples, ses coudes arrondis, et au bord de la case le champ ne dépend plus que de la
// largeur, pour que les cases voisines se raccordent sans couture. Les détails (cailloux, touffes, pas) restent loin du
// bord de la case. Lumière en haut à gauche ; trait brun de la troupe.
const OUT = '#3C2819', WHITE = '#FFFFFF';
const f = n => Math.round(n * 100) / 100;
const st = w => ` stroke="${OUT}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
const P = (d, fill, w = 1) => `<path d="${d}" fill="${fill}"${w ? st(w) : ''}/>`;
const E = (x, y, rx, ry, fill, w = 0) => `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(rx)}" ry="${f(ry)}" fill="${fill}"${w ? st(w) : ''}/>`;
const rnd = s => { let x = s; return () => (x = (x * 16807) % 2147483647) / 2147483647; };
const clamp = v => Math.max(0, Math.min(1, v));
const op = (s, o) => s.replace(/\/>$/, ` opacity="${f(o)}"/>`);

// ——— la case : le losange, les sens ouverts ———
const CX = 32, CY = 16;
const LOSANGE = 'M32,0 L64,16 L32,32 L0,16 Z';
const BITS = ['ne', 'se', 'so', 'no'];
const sensDe = m => BITS.filter((_, i) => m & (1 << i));
// au sol : la direction de chaque sens (vers la voisine), et la projection iso d'un point du sol
const DIR = { ne: [0, -1], se: [1, 0], so: [0, 1], no: [-1, 0] };
const iso = (a, b) => [CX + (a - b) * 32, CY + (a + b) * 16];
// l'angle à l'écran d'un sens (pour orienter les pas, les pavés de bordure)
const angleDe = k => { const [x, y] = iso(...DIR[k]); return Math.atan2(y - CY, x - CX) * 180 / Math.PI; };
// la distance (au sol) au bord de la case
const auBord = (a, b) => 0.5 - Math.max(Math.abs(a), Math.abs(b));

// ——— le champ du chemin ———
// un bruit doux (valeur, deux octaves), propre à une graine
function bruit(seed) {
  const h = (i, j) => { let n = Math.imul(i, 374761393) ^ Math.imul(j, 668265263) ^ Math.imul(seed, 2246822519); n = Math.imul(n ^ (n >>> 13), 1274126177); return ((n ^ (n >>> 16)) >>> 0) / 4294967295; };
  const sm = t => t * t * (3 - 2 * t);
  const v = (x, y) => { const i = Math.floor(x), j = Math.floor(y), fx = sm(x - i), fy = sm(y - j); const a = h(i, j), b = h(i + 1, j), c = h(i, j + 1), d = h(i + 1, j + 1); return a + (b - a) * fx + (c - a) * fy + (a - b - c + d) * fx * fy; };
  return (x, y) => (v(x * 8 + 11, y * 8 + 5) - 0.5) + 0.45 * (v(x * 19 + 3, y * 19 + 17) - 0.5);
}
// le minimum adouci (les coudes s'arrondissent)
const smin = (a, b, k) => { const h = Math.max(k - Math.abs(a - b), 0) / k; return Math.min(a, b) - h * h * k * 0.25; };
function distLigne(a, b, pts) {
  let d = Infinity;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], dx = x1 - x0, dy = y1 - y0;
    const t = clamp(((a - x0) * dx + (b - y0) * dy) / (dx * dx + dy * dy));
    d = Math.min(d, Math.hypot(a - x0 - dx * t, b - y0 - dy * t));
  }
  return d;
}
// le tracé d'un bras : du centre au-delà du bord, avec une ondulation qui s'annule (et sa pente) au centre et au bord
function trace(k, ond) {
  const [dx, dy] = DIR[k], px = -dy, py = dx, pts = [];
  for (let i = 0; i <= 26; i++) { const s = i / 20, bosse = s < 1 ? Math.sin(Math.PI * s) ** 2 : 0; pts.push([dx * s * 0.5 + px * ond * bosse, dy * s * 0.5 + py * ond * bosse]); }
  return pts;
}
// le champ d'un raccord : négatif dans le chemin ; w la demi-largeur (au sol), ond l'ondulation, rugueux le bruit des
// bords (nul au bord de la case)
function champ(m, { w, ond, rugueux, seed }) {
  const ss = sensDe(m), nz = bruit(seed), lignes = ss.map(k => trace(k, ond));
  return (a, b) => {
    let d = Infinity;
    for (const L of lignes) d = smin(d, distLigne(a, b, L) - w, 0.09);
    // la place du centre : un rond seul, un carrefour un peu plus large
    if (!ss.length) d = Math.hypot(a, b * 1.08) - w * 1.3;
    else if (ss.length >= 3) d = smin(d, Math.hypot(a, b) - w * 1.18, 0.08);
    return d + nz(a, b) * rugueux * clamp(auBord(a, b) / 0.16);
  };
}

// ——— les contours d'un champ (carrés qui marchent), en points du sol ———
const N = 120, R = 0.64, PAS = (2 * R) / N;
function contours(F, niveau) {
  const v = new Float64Array((N + 1) * (N + 1));
  for (let j = 0; j <= N; j++) for (let i = 0; i <= N; i++) v[j * (N + 1) + i] = (i === 0 || j === 0 || i === N || j === N) ? 1 : F(-R + i * PAS, -R + j * PAS) - niveau;
  const V = (i, j) => v[j * (N + 1) + i];
  const pts = new Map(), voisins = new Map();
  const point = id => {
    if (!pts.has(id)) {
      const [t, i, j] = id;
      const [i1, j1] = t === 'h' ? [i + 1, j] : [i, j + 1];
      const a = V(i, j), b = V(i1, j1), u = a / (a - b);
      pts.set(id, [-R + (i + (i1 - i) * u) * PAS, -R + (j + (j1 - j) * u) * PAS]);
    }
    return id;
  };
  const lier = (p, q) => { for (const [x, y] of [[p, q], [q, p]]) { if (!voisins.has(x)) voisins.set(x, []); voisins.get(x).push(y); } };
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
    const c = [V(i, j) < 0, V(i + 1, j) < 0, V(i + 1, j + 1) < 0, V(i, j + 1) < 0];
    const idx = c[0] | (c[1] << 1) | (c[2] << 2) | (c[3] << 3);
    if (idx === 0 || idx === 15) continue;
    const e = [`h${i},${j}`, `v${i + 1},${j}`, `h${i},${j + 1}`, `v${i},${j}`];
    const ids = [['h', i, j], ['v', i + 1, j], ['h', i, j + 1], ['v', i, j]];
    const k = n => { const id = e[n]; if (!pts.has(id)) { const [t, a, b] = ids[n]; const [a1, b1] = t === 'h' ? [a + 1, b] : [a, b + 1]; const x = V(a, b), y = V(a1, b1), u = x / (x - y); pts.set(id, [-R + (a + (a1 - a) * u) * PAS, -R + (b + (b1 - b) * u) * PAS]); } return id; };
    const coupe = [c[0] !== c[1], c[1] !== c[2], c[3] !== c[2], c[0] !== c[3]].map((x, n) => (x ? n : -1)).filter(n => n >= 0);
    if (coupe.length === 2) lier(k(coupe[0]), k(coupe[1]));
    else {
      const centre = (V(i, j) + V(i + 1, j) + V(i + 1, j + 1) + V(i, j + 1)) / 4 < 0;
      const autour1 = (idx === 5) === centre;
      if (autour1) { lier(k(0), k(1)); lier(k(2), k(3)); } else { lier(k(3), k(0)); lier(k(1), k(2)); }
    }
  }
  void point;
  const vus = new Set(), boucles = [];
  for (const depart of voisins.keys()) {
    if (vus.has(depart)) continue;
    const boucle = [];
    let prec = null, cur = depart;
    while (cur && !vus.has(cur)) {
      vus.add(cur); boucle.push(pts.get(cur));
      const suiv = voisins.get(cur).find(x => x !== prec && !vus.has(x));
      prec = cur; cur = suiv;
    }
    if (boucle.length > 3) boucles.push(simplifier(boucle, 0.0022));
  }
  return boucles;
}
// Ramer-Douglas-Peucker sur une boucle
function simplifier(pts, tol) {
  const garde = new Uint8Array(pts.length);
  const rdp = (i0, i1) => {
    let dmax = 0, im = -1;
    const [x0, y0] = pts[i0], [x1, y1] = pts[i1], dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy) || 1e-9;
    for (let i = i0 + 1; i < i1; i++) { const d = Math.abs((pts[i][0] - x0) * dy - (pts[i][1] - y0) * dx) / L; if (d > dmax) { dmax = d; im = i; } }
    if (dmax > tol) { garde[im] = 1; rdp(i0, im); rdp(im, i1); }
  };
  const mid = Math.floor(pts.length / 2);
  garde[0] = garde[mid] = 1;
  rdp(0, mid); rdp(mid, pts.length - 1);
  garde[pts.length - 1] = 1;
  return pts.filter((_, i) => garde[i]);
}
// le chemin SVG d'un contour (projeté), décalé de (dx, dy) à l'écran
const dDe = boucles => boucles.map(b => 'M' + b.map(([a, c]) => { const [x, y] = iso(a, c); return `${f(x)},${f(y)}`; }).join(' L') + ' Z').join(' ');
// une forme pleine : le contour du champ à un niveau (positif : plus large), décalée à l'écran
const forme = (F, niveau, fill, { dx = 0, dy = 0, o = 1, extra = '' } = {}) => {
  const d = dDe(contours(F, niveau));
  return d ? `<path d="${d}" fill="${fill}" fill-rule="evenodd"${dx || dy ? ` transform="translate(${f(dx)} ${f(dy)})"` : ''}${o < 1 ? ` opacity="${f(o)}"` : ''}${extra}/>` : '';
};
// un anneau entre deux niveaux
const anneau = (F, n0, n1, fill, o = 1) => `<path d="${dDe(contours(F, n0))} ${dDe(contours(F, n1))}" fill="${fill}" fill-rule="evenodd"${o < 1 ? ` opacity="${f(o)}"` : ''}/>`;
// des places au bord du chemin (à son contour 0, loin du bord de la case) : [a, b, na, nb] (point, normale vers l'herbe)
function lisiere(F, g, n, marge = 0.07) {
  const pts = contours(F, 0).flat().filter(([a, b]) => auBord(a, b) > marge);
  const out = [];
  for (let essai = 0; essai < n * 6 && out.length < n && pts.length; essai++) {
    const [a, b] = pts[Math.floor(g() * pts.length)];
    if (out.some(([x, y]) => Math.hypot(x - a, y - b) < 0.09)) continue;
    const e = 0.004, ga = F(a + e, b) - F(a - e, b), gb = F(a, b + e) - F(a, b - e), L = Math.hypot(ga, gb) || 1;
    out.push([a, b, ga / L, gb / L]);
  }
  return out;
}
// des points au hasard dans le chemin (champ < seuil), loin du bord de la case
function dedans(F, g, n, seuil = -0.02, marge = 0.05) {
  const out = [];
  for (let essai = 0; essai < n * 30 && out.length < n; essai++) {
    const a = (g() - 0.5) * 0.98, b = (g() - 0.5) * 0.98;
    if (auBord(a, b) > marge && F(a, b) < seuil) out.push([a, b]);
  }
  return out;
}

// ——— l'herbe de la case (sans trait : les cases se touchent ; le jeu remplace ces deux verts par ceux de la case) ———
function herbe(id, seed = 3) {
  const g = rnd(seed * 13 + 5);
  let b = '';
  for (let i = 0; i < 10; i++) { const x = 8 + g() * 48, y = 6 + g() * 20; b += `<path d="M${f(x)},${f(y)} l-0.6,-2 M${f(x + 1)},${f(y)} l0.4,-2.4" stroke="#5A9A40" stroke-width="0.6" stroke-linecap="round"/>`; }
  return `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8CC868"/><stop offset="1" stop-color="#6EAE50"/></linearGradient><clipPath id="${id}c"><path d="${LOSANGE}"/></clipPath></defs><path d="${LOSANGE}" fill="url(#${id})"/><g clip-path="url(#${id}c)">${b}</g>`;
}

// ——— les petits dessins (à l'écran) ———
// un caillou irrégulier, ombré : ombre portée en bas à droite, lumière en haut à gauche
function caillou(x, y, r, ton, g, { trait = 0.32, mousse = false } = {}) {
  const n = 7, pts = [];
  for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2 + g() * 0.5, k = 0.78 + g() * 0.34; pts.push([x + Math.cos(a) * r * k, y + Math.sin(a) * r * 0.64 * k]); }
  const mid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
  let d = `M${f(mid(pts[n - 1], pts[0])[0])},${f(mid(pts[n - 1], pts[0])[1])}`;
  for (let i = 0; i < n; i++) { const m = mid(pts[i], pts[(i + 1) % n]); d += ` Q${f(pts[i][0])},${f(pts[i][1])} ${f(m[0])},${f(m[1])}`; }
  let s = op(E(x + r * 0.32, y + r * 0.34, r * 1.05, r * 0.5, '#2E2416'), 0.3);
  s += `<path d="${d} Z" fill="${ton[1]}"${st(trait)}/>`;
  s += E(x - r * 0.22, y - r * 0.2, r * 0.55, r * 0.26, ton[0]);
  s += op(E(x - r * 0.38, y - r * 0.3, r * 0.2, r * 0.1, WHITE), 0.75);
  if (mousse) s += E(x + r * 0.25, y - r * 0.32, r * 0.42, r * 0.17, '#7DAE4A') + E(x + r * 0.15, y - r * 0.38, r * 0.2, r * 0.08, '#B8DC7A');
  return s;
}
const PIERRES = [['#E6E1D6', '#A9A397'], ['#E4DCCB', '#B2A48C'], ['#D9DEE2', '#8F979E'], ['#EADCC4', '#B89D78']];
// une touffe d'herbe qui déborde : des brins dodus détourés, ceux du fond plus sombres ; penche (−1 à 1) vers le chemin
const VERT = { fond: ['#5E9946', '#3B6E3D'], devant: ['#86C153', '#4F8E40'], clair: '#C4E27E' };
function brin(x, y, h, w, pente, c) {
  const tx = x + pente * h * 0.6, ty = y - h, mx = (x + tx) / 2 + pente * 0.3, my = y - h * 0.5;
  return `<path d="M${f(x - w / 2)},${f(y)} Q${f(mx - w * 0.4)},${f(my)} ${f(tx)},${f(ty)} Q${f(mx + w * 0.4)},${f(my)} ${f(x + w / 2)},${f(y)} Z" fill="${c[0]}"${st(0.24)}/>`
    + `<path d="M${f(x)},${f(y - h * 0.15)} Q${f(mx)},${f(my)} ${f(tx - pente * 0.2)},${f(ty + h * 0.25)}" stroke="${VERT.clair}" stroke-width="0.28" fill="none" stroke-linecap="round" opacity=".7"/>`;
}
function touffe(x, y, s, pente, g) {
  let o = op(E(x + 0.4, y + 0.3, 2.2 * s, 0.7 * s, '#28371A'), 0.22);
  for (let i = 0; i < 3; i++) o += brin(x + (i - 1) * 0.9 * s, y, (2.6 + g() * 1.2) * s, 0.9 * s, pente * 0.8 + (i - 1) * 0.35, VERT.fond);
  for (let i = 0; i < 3; i++) o += brin(x + (i - 1) * 1.1 * s + 0.3, y + 0.35, (2 + g() * 1) * s, 1 * s, pente + (i - 1) * 0.45, VERT.devant);
  return o;
}
// une fleurette : cinq pétales, le cœur jaune
const fleurette = (x, y, c) => [0, 1, 2, 3, 4].map(i => { const a = i * 1.257 - 1.2; return E(x + Math.cos(a) * 0.7, y + Math.sin(a) * 0.45, 0.55, 0.38, c, 0.18); }).join('') + E(x, y, 0.36, 0.26, '#E8A92E');
// un pas dans la terre (ou la neige), orienté (degrés)
const pas = (x, y, ang, fill, o) => `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(ang)}) scale(1 0.62)">${op(E(0.25, 0, 0.62, 0.34, fill), o)}${op(E(-0.55, 0, 0.3, 0.27, fill), o)}</g>`;
// des pas le long des bras ouverts (alternés), loin du bord de la case
function traces(m, ond, g, fill, o, phase = 0) {
  let s = '';
  for (const k of sensDe(m)) {
    const L = trace(k, ond), [dx, dy] = DIR[k], px = -dy, py = dx;
    for (let i = 0; i < 4; i++) {
      const t = 0.12 + i * 0.2 + phase, pt = L[Math.round(t * 20)];
      if (!pt || t > 0.82) continue;
      const cote = i % 2 ? 1 : -1, [x, y] = iso(pt[0] + px * cote * 0.035 + (g() - 0.5) * 0.01, pt[1] + py * cote * 0.035);
      s += pas(x, y, angleDe(k) + (g() - 0.5) * 14, fill, o);
    }
  }
  return s;
}

// ——— le chemin de terre battue (v : 0 ou 1, deux variantes du décor ; la même forme) ———
const TERRE = { w: 0.178, ond: 0.022, rugueux: 0.034 };
const champTerre = m => champ(m, { ...TERRE, seed: m * 7 + 3 });
function chemin(m, id, v = 0) {
  const g = rnd(m * 7 + 11 + v * 101), F = champTerre(m);
  let s = herbe(id + 'h', m + 1 + v * 17);
  s += `<defs><linearGradient id="${id}t" x1="0" y1="0" x2="0.3" y2="1"><stop offset="0" stop-color="#DCBC8A"/><stop offset="1" stop-color="#C79E6C"/></linearGradient><clipPath id="${id}k">${`<path d="${dDe(contours(F, 0))}"/>`}</clipPath></defs>`;
  s += `<g clip-path="url(#${id}hc)">`;
  // l'herbe usée au bord (plus jaune), puis son ombre contre la terre
  s += forme(F, 0.05, '#B9C77A', { o: 0.32 }) + forme(F, 0.018, '#5E8A3A', { o: 0.3 });
  // la terre : le talus d'abord (sombre, il se voit en haut à gauche), puis le sol tassé, la bande usée au milieu
  s += forme(F, 0, '#9C7448') + forme(F, -0.012, `url(#${id}t)`, { dx: 0.45, dy: 0.7 });
  s += forme(F, -0.075, '#E6CC9C', { dx: 0.3, dy: 0.45, o: 0.55 });
  // dans la terre : grain, graviers, pas
  s += `<g clip-path="url(#${id}k)">`;
  for (const [a, b] of dedans(F, g, 34, 0)) { const [x, y] = iso(a, b); s += op(E(x, y, 0.22 + g() * 0.28, 0.14 + g() * 0.12, g() < 0.5 ? '#A47C50' : '#F2DDB4'), 0.75); }
  s += traces(m, TERRE.ond, g, '#A9824F', 0.5, v * 0.08);
  for (const [a, b] of dedans(F, g, 6, -0.03)) { const [x, y] = iso(a, b); s += caillou(x, y, 0.45 + g() * 0.35, PIERRES[Math.floor(g() * 4)], g, { trait: 0.22 }); }
  s += `</g>`;
  // le bord : des pierres à demi enterrées par petits groupes, des touffes qui débordent, des fleurettes (devant ce
  // qui est derrière : rangés du haut vers le bas)
  const deco = [];
  lisiere(F, g, 3).forEach(([a, b, na, nb], i) => {
    const n = 2 + Math.floor(g() * 2);
    for (let j = 0; j < n; j++) { const [x, y] = iso(a + na * 0.012 + (j - 0.5) * 0.035 * nb, b + nb * 0.012 - (j - 0.5) * 0.035 * na); deco.push([y, caillou(x, y, 0.95 + g() * 0.7, PIERRES[(i + j) % 4], g, { mousse: g() < 0.4 })]); }
  });
  lisiere(F, g, 7).forEach(([a, b, na, nb]) => { const [x, y] = iso(a + na * 0.02, b + nb * 0.02), [xn] = iso(a - na, b - nb); deco.push([y, touffe(x, y, 0.75 + g() * 0.35, Math.sign(xn - x) * 0.5, g)]); });
  const fleurs = v ? ['#F7B6C8', WHITE] : ['#FFF4F0', '#F2C04B'];
  lisiere(F, g, 2, 0.1).forEach(([a, b, na, nb], i) => { const [x, y] = iso(a + na * 0.05, b + nb * 0.05); deco.push([y, fleurette(x, y - 0.6, fleurs[i])]); });
  s += deco.sort((p, q) => p[0] - q[0]).map(x => x[1]).join('');
  return s + `</g>`;
}

// ——— le chemin pavé : des pavés posés en perspective dans une bordure de pierres, les joints, un peu de mousse ———
const PAVE = { w: 0.19, ond: 0.012, rugueux: 0.012 };
const PAVES = [['#D6D0C4', '#B3AC9F'], ['#CEC6B6', '#A9A090'], ['#DCD6CC', '#BDB6AA'], ['#C9C2B4', '#9E978A'], ['#D8CCB6', '#B5A68C'], ['#C4C9CC', '#9AA0A4']];
// (neige : l'hiver, le pavé déblayé ; la neige couvre la case et s'entasse en bourrelets contre la bordure, un peu de
// givre sur les pavés, de la neige dans les joints ; le blanc de la case est celui de la neige au sol)
function pave(m, id, neige = false) {
  const g = rnd(m * 13 + 3), F = champ(m, { ...PAVE, seed: m * 11 + 5 });
  let s = neige ? `<defs><clipPath id="${id}hc"><path d="${LOSANGE}"/></clipPath></defs><path d="${LOSANGE}" fill="${NEIGE}"/>` : herbe(id + 'h', m + 41);
  s += `<defs><clipPath id="${id}k"><path d="${dDe(contours(F, -0.026))}"/></clipPath></defs><g clip-path="url(#${id}hc)">`;
  if (neige) {
    // la neige poussée de part et d'autre : son ombre bleue en bas à droite, puis son dessus éclatant
    s += forme(F, 0.08, '#D3DEEC', { dx: 0.5, dy: 0.8 }) + forme(F, 0.08, '#FAFCFF');
  } else s += forme(F, 0.03, '#5E8A3A', { o: 0.3 });
  // les joints (le lit de sable et de terre sous les pavés)
  s += forme(F, 0, '#6E6457');
  // les pavés : une grille alignée sur la case (les cases voisines s'y raccordent), des pavés simples ou doubles
  const G = 1 / 12, gap = 0.0055, pris = new Set();
  s += `<g clip-path="url(#${id}k)">`;
  for (let j = 0; j < 12; j++) for (let i = 0; i < 12; i++) {
    if (pris.has(`${i},${j}`)) continue;
    let w = 1, h = 1;
    const r = g();
    if (r < 0.28 && i < 11 && !pris.has(`${i + 1},${j}`)) w = 2; else if (r < 0.5 && j < 11) h = 2;
    for (let u = 0; u < w; u++) for (let t = 0; t < h; t++) pris.add(`${i + u},${j + t}`);
    const a0 = -0.5 + i * G + gap, a1 = -0.5 + (i + w) * G - gap, b0 = -0.5 + j * G + gap, b1 = -0.5 + (j + h) * G - gap;
    if (F((a0 + a1) / 2, (b0 + b1) / 2) > 0.02) continue;
    const ton = PAVES[Math.floor(g() * PAVES.length)];
    const c = [[a0, b0], [a1, b0], [a1, b1], [a0, b1]].map(([a, b]) => iso(a, b));
    // (un pavé taillé : des coins à peine arrondis)
    const vers_ = (p, q, t) => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];
    const arr = pts => { let d = ''; for (let k = 0; k < 4; k++) { const p = pts[k], a = vers_(p, pts[(k + 3) % 4], 0.22), b = vers_(p, pts[(k + 1) % 4], 0.22); d += `${k ? ' L' : 'M'}${f(a[0])},${f(a[1])} Q${f(p[0])},${f(p[1])} ${f(b[0])},${f(b[1])}`; } return d + ' Z'; };
    const cx = (c[0][0] + c[2][0]) / 2, cy = (c[0][1] + c[2][1]) / 2;
    // le pavé, son épaisseur (le flanc sombre en bas), le dessus plus clair vers la lumière
    s += `<path d="${arr(c.map(([x, y]) => [x, y + 0.45]))}" fill="${ton[1]}"/>`;
    s += `<path d="${arr(c)}" fill="${ton[1]}"${st(0.24)}/>`;
    s += `<path d="${arr(c.map(([x, y]) => [cx + (x - cx) * 0.72 - 0.25, cy + (y - cy) * 0.66 - 0.3]))}" fill="${ton[0]}"/>`;
    if (g() < 0.12) s += op(E(cx + 0.6, cy + 0.5, 0.6, 0.25, '#3E3328'), 0.35);
    if (g() < 0.14) s += E(c[2][0] - 0.3, c[2][1] + 0.25, 0.55, 0.22, '#7DAE4A') + E(c[2][0] - 0.5, c[2][1] + 0.1, 0.25, 0.1, '#B8DC7A');
  }
  s += `</g>`;
  // la bordure : de longues pierres plates (le flanc, puis le dessus), des joints en travers
  s += anneau(F, 0.002, -0.03, '#8C8376');
  s += `<g transform="translate(-0.2 -0.32)">${anneau(F, -0.002, -0.027, '#C9C1B2')}</g>`;
  for (const boucle of contours(F, -0.014)) {
    let acc = 0;
    for (let i = 1; i < boucle.length; i++) {
      const [a0, b0] = boucle[i - 1], [a1, b1] = boucle[i]; acc += Math.hypot(a1 - a0, b1 - b0);
      if (acc < 0.075 || auBord(a1, b1) < 0.03) continue;
      acc = 0;
      const L = Math.hypot(a1 - a0, b1 - b0) || 1, na = -(b1 - b0) / L, nb = (a1 - a0) / L;
      const [x0, y0] = iso(a1 - na * 0.016, b1 - nb * 0.016), [x1, y1] = iso(a1 + na * 0.016, b1 + nb * 0.016);
      s += `<path d="M${f(x0)},${f(y0)} L${f(x1)},${f(y1)}" stroke="#5E554A" stroke-width="0.35" stroke-linecap="round" opacity=".8"/>`;
    }
  }
  if (neige) {
    // le givre sur les pavés, la neige restée dans les joints et tassée contre la bordure, quelques éclats
    s += forme(F, -0.026, '#E6EEF7', { o: 0.22 });
    s += `<g clip-path="url(#${id}k)">`;
    for (const [a, b] of dedans(F, g, 26, -0.03)) { const [x, y] = iso(a, b); s += op(E(x, y, 0.45 + g() * 0.5, 0.16 + g() * 0.1, WHITE), 0.85); }
    s += `</g>`;
    s += anneau(F, 0.034, 0.006, '#F4F8FC', 0.95);
    for (let i = 0; i < 4; i++) { const a = (g() - 0.5) * 0.8, b = (g() - 0.5) * 0.8; if (auBord(a, b) < 0.06 || F(a, b) < 0.09) continue; const [x, y] = iso(a, b); s += `<path d="M${f(x)},${f(y - 0.9)} L${f(x)},${f(y + 0.9)} M${f(x - 0.9)},${f(y)} L${f(x + 0.9)},${f(y)}" stroke="${WHITE}" stroke-width="0.3" stroke-linecap="round"/>`; }
    return s + `</g>`;
  }
  // l'herbe et la mousse qui reprennent au pied de la bordure
  const deco = [];
  lisiere(F, g, 4).forEach(([a, b, na, nb]) => { const [x, y] = iso(a + na * 0.022, b + nb * 0.022), [xn] = iso(a - na, b - nb); deco.push([y, touffe(x, y, 0.6 + g() * 0.25, Math.sign(xn - x) * 0.4, g)]); });
  s += deco.sort((p, q) => p[0] - q[0]).map(x => x[1]).join('');
  return s + `</g>`;
}

// ——— le chemin sous la neige : la neige couvre la case, le chemin est une trace damée entre deux bourrelets, des pas
// y descendent, un peu de terre affleure au milieu. Le blanc de la case est celui de la neige au sol (meteo : neige_sol)
const NEIGE = '#EEF4FA';
function neige(m, id) {
  const g = rnd(m * 17 + 29), F = champTerre(m);
  let s = `<defs><clipPath id="${id}c"><path d="${LOSANGE}"/></clipPath><clipPath id="${id}k"><path d="${dDe(contours(F, -0.008))}"/></clipPath></defs>`;
  s += `<path d="${LOSANGE}" fill="${NEIGE}"/><g clip-path="url(#${id}c)">`;
  // la neige poudreuse : des creux bleutés à peine marqués, loin du chemin
  for (let i = 0; i < 4; i++) { const a = (g() - 0.5) * 0.7, b = (g() - 0.5) * 0.7; if (F(a, b) < 0.1) continue; const [x, y] = iso(a, b); s += op(E(x, y, 4 + g() * 3, 1.1 + g() * 0.6, '#DCE6F2'), 0.7) + op(E(x - 0.6, y - 0.5, 3 + g() * 2, 0.7, WHITE), 0.8); }
  // les bourrelets de neige poussée : leur ombre bleue en bas à droite, puis le dessus éclatant
  s += forme(F, 0.06, '#D3DEEC', { dx: 0.5, dy: 0.8 }) + forme(F, 0.06, '#FAFCFF');
  // la trace : le flanc à l'ombre (en haut à gauche), le fond damé, plus gris au milieu où l'on marche
  s += forme(F, 0, '#BCCBDD') + forme(F, -0.012, '#DDE6F0', { dx: 0.45, dy: 0.7 });
  s += forme(F, -0.08, '#CFD9E5', { dx: 0.3, dy: 0.45, o: 0.85 });
  s += `<g clip-path="url(#${id}k)">`;
  // la terre qui affleure dans les creux de la trace, de la neige fondue
  for (const [a, b] of dedans(F, g, 7, -0.07)) { const [x, y] = iso(a, b); s += op(E(x, y, 0.9 + g() * 0.9, 0.22 + g() * 0.12, '#9E8E78'), 0.32); }
  s += traces(m, TERRE.ond, g, '#AFC0D6', 0.85);
  s += `</g>`;
  // des éclats de givre
  for (let i = 0; i < 5; i++) { const a = (g() - 0.5) * 0.8, b = (g() - 0.5) * 0.8; if (auBord(a, b) < 0.06) continue; const [x, y] = iso(a, b); s += `<path d="M${f(x)},${f(y - 0.9)} L${f(x)},${f(y + 0.9)} M${f(x - 0.9)},${f(y)} L${f(x + 0.9)},${f(y)}" stroke="${WHITE}" stroke-width="0.3" stroke-linecap="round"/>`; }
  return s + `</g>`;
}

// ——— le creusement, pour chaque raccord (etape 0 à 4 ; la sixième étape est le chemin) : la même forme que le chemin
// de terre, qui se creuse sous les yeux ———
function piquet(x, y, haut = 4.4) {
  let s = op(E(x + 0.9, y + 0.35, 1.2, 0.4, '#28371A'), 0.3);
  s += `<path d="M${f(x - 0.55)},${f(y - haut)} L${f(x + 0.55)},${f(y - haut)} L${f(x + 0.5)},${f(y)} L${f(x)},${f(y + 0.7)} L${f(x - 0.5)},${f(y)} Z" fill="#C8925A"${st(0.32)}/>`;
  s += `<path d="M${f(x + 0.1)},${f(y - haut + 0.2)} L${f(x + 0.15)},${f(y - 0.2)}" stroke="#9C6A3A" stroke-width="0.45" stroke-linecap="round"/>`;
  s += E(x, y - haut, 0.55, 0.26, '#E8C08C', 0.25);
  // le ruban rouge noué sous la tête
  s += `<path d="M${f(x + 0.5)},${f(y - haut + 1)} q1.1,0.1 1.6,0.8 q-0.8,-0.1 -1.6,0.3 Z" fill="#E8504A"${st(0.22)}/>`;
  return s;
}
function motte(x, y, s, g) {
  const d = `M${f(x - 1.7 * s)},${f(y + 0.3 * s)} Q${f(x - 1.6 * s)},${f(y - 1.2 * s)} ${f(x - 0.2 * s)},${f(y - 1.4 * s)} Q${f(x + 1.5 * s)},${f(y - 1.3 * s)} ${f(x + 1.8 * s)},${f(y + 0.2 * s)} Q${f(x + 0.2 * s)},${f(y + 1 * s)} ${f(x - 1.7 * s)},${f(y + 0.3 * s)} Z`;
  return op(E(x + 0.5 * s, y + 0.6 * s, 1.9 * s, 0.6 * s, '#2E2416'), 0.28) + `<path d="${d}" fill="${g() < 0.5 ? '#8A6440' : '#7A5636'}"${st(0.3)}/>` + E(x - 0.4 * s, y - 0.8 * s, 0.9 * s, 0.32 * s, '#A57B50') + op(E(x + 0.6 * s, y - 0.2 * s, 0.25 * s, 0.15 * s, '#C9A57A'), 0.8);
}
// une motte levée à la bêche, posée de côté : le dessus d'herbe penché, la tranche de terre et ses radicelles
function motteRetournee(x, y, s, g) {
  const k = g() < 0.5 ? 1 : -1, X = v => x + v * s * k, Y = v => y + v * s;
  let o = op(E(x + 0.4 * s, y + 0.7 * s, 2.1 * s, 0.55 * s, '#2E2416'), 0.28);
  o += `<path d="M${f(X(-1.9))},${f(Y(-0.1))} Q${f(X(0.1))},${f(Y(0.7))} ${f(X(1.9))},${f(Y(-0.5))} L${f(X(1.85))},${f(Y(0.1))} Q${f(X(0))},${f(Y(1.15))} ${f(X(-1.85))},${f(Y(0.45))} Z" fill="#7A5636"${st(0.28)}/>`;
  o += `<path d="M${f(X(-1.4))},${f(Y(0.6))} l0.1,0.4 M${f(X(-0.2))},${f(Y(0.9))} l-0.1,0.4 M${f(X(1))},${f(Y(0.6))} l0.15,0.35" stroke="#C9A57A" stroke-width="0.25" stroke-linecap="round"/>`;
  o += `<path d="M${f(X(-1.9))},${f(Y(-0.1))} Q${f(X(-1.2))},${f(Y(-1.4))} ${f(X(0.3))},${f(Y(-1.5))} Q${f(X(1.7))},${f(Y(-1.5))} ${f(X(1.9))},${f(Y(-0.5))} Q${f(X(0.1))},${f(Y(0.7))} ${f(X(-1.9))},${f(Y(-0.1))} Z" fill="#7EB650"${st(0.28)}/>`;
  o += E(X(-0.3), Y(-0.9), 1 * s, 0.3 * s, '#A6D466');
  for (let i = 0; i < 3; i++) o += brin(X(-0.9 + i * 0.9), Y(-0.6 - i * 0.1), (0.9 + g() * 0.5) * s, 0.55 * s, (i - 1) * 0.4, VERT.devant);
  return o;
}
function creuse(etape, m, id) {
  const g = rnd(m * 5 + etape * 31 + 7), F = champTerre(m), ss = sensDe(m);
  let s = herbe(id + 'h', m + 9);
  s += `<defs><clipPath id="${id}k"><path d="${dDe(contours(F, 0))}"/></clipPath></defs><g clip-path="url(#${id}hc)">`;
  const deco = [];
  if (etape === 0) {
    // le tracé : le bord du futur chemin marqué à la craie sur l'herbe, des piquets le long de l'axe, la ficelle tendue
    s += `<path d="${dDe(contours(F, 0))}" fill="none" stroke="#FBF6E6" stroke-width="0.55" stroke-dasharray="1.5 1.1" stroke-linecap="round" opacity=".9"/>`;
    const axe = ss.length ? [[0, 0], ...ss.map(k => trace(k, TERRE.ond)[14])] : [[-0.16, 0], [0.16, 0], [0, -0.16], [0, 0.16]];
    const tetes = axe.map(([a, b]) => { const [x, y] = iso(a, b); return [x, y - 3.4]; });
    const centre = ss.length ? tetes[0] : null;
    for (let i = ss.length ? 1 : 0; i < tetes.length; i++) {
      const [x0, y0] = centre || tetes[i], [x1, y1] = ss.length ? tetes[i] : tetes[(i + 1) % tetes.length];
      const [gx0, gy0] = [x0, y0 + 3.4], [gx1, gy1] = [x1, y1 + 3.4];
      s += op(`<path d="M${f(gx0)},${f(gy0)} L${f(gx1)},${f(gy1)}" stroke="#28371A" stroke-width="0.35"/>`, 0.18);
      s += `<path d="M${f(x0)},${f(y0)} Q${f((x0 + x1) / 2)},${f((y0 + y1) / 2 + 0.7)} ${f(x1)},${f(y1)}" stroke="#F4EEDC" stroke-width="0.4" fill="none"/>`;
    }
    axe.forEach(([a, b]) => { const [x, y] = iso(a, b); deco.push([y, piquet(x, y)]); });
  }
  if (etape === 1) {
    // l'herbe coupée ras : un vert plus pâle, net au bord (la coupe de la bêche), des chaumes, des tas d'herbe coupée
    s += forme(F, 0, '#6E9A44') + forme(F, -0.008, '#BFD98A', { dx: 0.35, dy: 0.55 });
    s += `<g clip-path="url(#${id}k)">`;
    for (const [a, b] of dedans(F, g, 40, 0)) { const [x, y] = iso(a, b); s += `<path d="M${f(x)},${f(y)} l${f((g() - 0.5) * 0.4)},-0.7" stroke="${g() < 0.5 ? '#86AE52' : '#E4F0B8'}" stroke-width="0.35" stroke-linecap="round"/>`; }
    s += `</g>`;
    lisiere(F, g, 3, 0.09).forEach(([a, b, na, nb]) => {
      const [x, y] = iso(a + na * 0.045, b + nb * 0.045);
      let t = op(E(x + 0.4, y + 0.3, 2.4, 0.7, '#28371A'), 0.22) + P(`M${f(x - 2.3)},${f(y + 0.2)} Q${f(x - 1.6)},${f(y - 1.9)} ${f(x)},${f(y - 2)} Q${f(x + 1.8)},${f(y - 1.8)} ${f(x + 2.3)},${f(y + 0.2)} Q${f(x)},${f(y + 0.9)} ${f(x - 2.3)},${f(y + 0.2)} Z`, '#9CC864', 0.3);
      for (let i = 0; i < 5; i++) t += `<path d="M${f(x - 1.6 + i * 0.8)},${f(y - 0.6 - g() * 0.8)} l${f(0.8 + g() * 0.6)},${f(-0.3 - g() * 0.3)}" stroke="${i % 2 ? '#D8EDA0' : '#6E9A44'}" stroke-width="0.3" stroke-linecap="round"/>`;
      deco.push([y, t]);
    });
  }
  if (etape === 2) {
    // les mottes soulevées : l'herbe coupée, la terre qui apparaît par plaques, des mottes retournées sur le bord
    s += forme(F, 0, '#6E9A44') + forme(F, -0.008, '#BFD98A', { dx: 0.35, dy: 0.55 });
    s += `<g clip-path="url(#${id}k)">`;
    for (const [a, b] of dedans(F, g, 8, -0.03, 0.02)) { const [x, y] = iso(a, b); const r = 1.6 + g() * 1.2; s += E(x, y, r, r * 0.5, '#6A4A2C') + E(x + 0.25, y + 0.2, r * 0.8, r * 0.38, '#8A6440') + op(E(x - r * 0.3, y - r * 0.1, r * 0.3, r * 0.1, '#B08A5E'), 0.8); }
    s += `</g>`;
    lisiere(F, g, 6).forEach(([a, b, na, nb]) => { const [x, y] = iso(a + na * 0.035, b + nb * 0.035); deco.push([y, motteRetournee(x, y, 0.95 + g() * 0.3, g)]); });
  }
  if (etape === 3) {
    // la tranchée : la terre fraîche, son flanc dans l'ombre, des racines coupées, la terre rejetée en tas sur les bords
    s += forme(F, 0.025, '#7A5636', { o: 0.5 });
    s += forme(F, 0, '#4E3420') + forme(F, -0.014, '#73512F', { dx: 0.55, dy: 0.85 }) + forme(F, -0.06, '#86603C', { dx: 0.5, dy: 0.8 });
    s += `<g clip-path="url(#${id}k)">`;
    for (const [a, b] of dedans(F, g, 18, -0.02)) { const [x, y] = iso(a, b); s += op(E(x, y, 0.3 + g() * 0.4, 0.18 + g() * 0.15, g() < 0.5 ? '#5A3E24' : '#A27A4E'), 0.8); }
    for (const [a, b] of dedans(F, g, 2, -0.04)) { const [x, y] = iso(a, b); s += `<path d="M${f(x - 1.5)},${f(y)} q0.8,-0.6 1.6,-0.1 q0.6,0.4 1.3,-0.2" stroke="#D8B486" stroke-width="0.4" fill="none" stroke-linecap="round"/>`; }
    s += `</g>`;
    lisiere(F, g, 8).forEach(([a, b, na, nb]) => { const [x, y] = iso(a + na * 0.03, b + nb * 0.03); deco.push([y, motte(x, y, 0.75 + g() * 0.35, g)]); });
    for (const [a, b] of dedans(F, g, 2, -0.04)) { const [x, y] = iso(a, b); deco.push([y, caillou(x, y, 0.6 + g() * 0.3, PIERRES[Math.floor(g() * 4)], g, { trait: 0.24 })]); }
  }
  if (etape === 4) {
    // le gravier étalé au fond de la tranchée, les premières pierres du bord posées (celles du chemin fini)
    s += forme(F, 0, '#6A4A2C') + forme(F, -0.012, '#B4A288', { dx: 0.45, dy: 0.7 });
    s += `<g clip-path="url(#${id}k)">`;
    for (const [a, b] of dedans(F, g, 70, 0)) { const [x, y] = iso(a, b); s += E(x, y, 0.3 + g() * 0.3, 0.2 + g() * 0.15, ['#D8D2C6', '#9C9488', '#C2AE90', '#F2EEE6'][Math.floor(g() * 4)], g() < 0.3 ? 0.15 : 0); }
    s += `</g>`;
    // (les pierres du bord du chemin de terre, aux mêmes places)
    const gt = rnd(m * 7 + 11);
    lisiere(F, gt, 3).forEach(([a, b, na, nb], i) => {
      const n = 2 + Math.floor(gt() * 2);
      for (let j = 0; j < n; j++) { const [x, y] = iso(a + na * 0.012 + (j - 0.5) * 0.035 * nb, b + nb * 0.012 - (j - 0.5) * 0.035 * na); deco.push([y, caillou(x, y, 0.95 + gt() * 0.7, PIERRES[(i + j) % 4], gt, { mousse: gt() < 0.4 })]); }
    });
  }
  s += deco.sort((p, q) => p[0] - q[0]).map(x => x[1]).join('');
  return s + `</g>`;
}

// ——— les effets (cadre 64 × 48, la case en bas, décalée de 16) ———
function mottes(k) {
  const t = (k + 1) / 4;
  let s = '';
  for (let i = 0; i < 6; i++) { const a = -Math.PI * (0.15 + 0.7 * i / 5), d = 4 + t * 16, h = Math.sin(t * Math.PI) * 14; s += P('M-1.6,0 Q-1.2,-1.6 0,-1.6 Q1.4,-1.4 1.6,0 Q0,1 -1.6,0 Z', i % 2 ? '#8A6440' : '#6A4A2C', 0.5).replace('<path', `<path transform="translate(${f(CX + Math.cos(a) * d)} ${f(32 - h * (i % 2 ? 0.8 : 1) + t * t * 6)}) rotate(${f(i * 50 + t * 90)}) scale(${f(1.4 - t * 0.3)})"`).replace('/>', ` opacity="${f(1 - Math.max(0, t - 0.6) * 2)}"/>`); }
  return s;
}
const poussiere = k => { const t = (k + 1) / 3; return [[-8, 0], [0, -3], [8, 0], [-4, -6], [5, -6]].map(([dx, dy]) => E(CX + dx * (1 + t), 32 + dy * (1 + t * 0.6), 3 + t * 4, 2 + t * 2, '#E2CCA8').replace('/>', ` opacity="${f(0.75 * (1 - t * 0.8))}"/>`)).join(''); };
const galet = (x, y, r, c = '#A8A298') => E(x, y, r, r * 0.62, c, 0.45) + E(x - r * 0.3, y - r * 0.22, r * 0.34, r * 0.2, '#E8E4DC');
const cailloux = k => { const t = (k + 1) / 3; return [[-1, 1], [1, 1.2], [-0.4, 1.6], [0.6, 0.8]].map(([sx, v]) => { const x = CX + sx * t * 14, y = 32 - Math.sin(t * Math.PI) * 8 * v + t * t * 4; return E(x, y, 1.8, 1.3, '#A8A298', 0.6) + E(x - 0.5, y - 0.45, 0.6, 0.4, WHITE); }).join(''); };
// la pierre posée (3 images) : elle descend, touche, un petit choc et deux traits
function posePierre(k) {
  const y = [24, 31.4, 32][k], sx = k === 1 ? 1.15 : 1, sy = k === 1 ? 0.85 : 1;
  let s = `<g transform="translate(${CX} ${y}) scale(${sx} ${sy})">${galet(0, 0, 3.2, '#B8B0A0')}</g>`;
  if (k > 0) s += E(CX, 33.6, 5 + k * 2, 1.2 + k * 0.4, '#E2CCA8').replace('/>', ` opacity="${f(0.7 - k * 0.2)}"/>`);
  if (k === 1) s += `<path d="M${CX - 6},30 l-2,-1.4 M${CX + 6},30 l2,-1.4" stroke="${OUT}" stroke-width="0.8" stroke-linecap="round"/>`;
  return s;
}

// ——— les pièces : { id (le fichier), nom, cadre, dessin, suite, ms par image, masque } ———
const NOMS_SENS = { ne: 'le nord-est', se: 'le sud-est', so: 'le sud-ouest', no: 'le nord-ouest' };
const CASE = [0, 0, 64, 32], EFFET = [0, 0, 64, 48];
const nomSens = m => sensDe(m).join('-') || 'seul';
const vers = m => sensDe(m).length ? `vers ${sensDe(m).map(k => NOMS_SENS[k]).join(', ')}` : 'seul (une petite place)';
const fichierDe = (m, v = 0) => `chemin_${nomSens(m)}${v ? '_b' : ''}`;
const PIECES = [];
const piece = (id, nom, cadre, dessin, suite = null, ms = null, masque = null) => PIECES.push({ id, nom, cadre, dessin, suite, ms, masque });
for (let m = 0; m < 16; m++) piece(fichierDe(m), `Le chemin de terre ${vers(m)}`, CASE, () => chemin(m, `ch${m}`), null, null, m);
for (let m = 0; m < 16; m++) piece(fichierDe(m, 1), `Le chemin de terre ${vers(m)}, seconde variante`, CASE, () => chemin(m, `cb${m}`, 1), null, null, m);
for (let m = 0; m < 16; m++) piece(`pave_${nomSens(m)}`, `Le chemin pavé ${vers(m)}`, CASE, () => pave(m, `pv${m}`), null, null, m);
for (let m = 0; m < 16; m++) piece(`neige_${nomSens(m)}`, `Le chemin sous la neige ${vers(m)}`, CASE, () => neige(m, `ng${m}`), null, null, m);
for (let m = 0; m < 16; m++) piece(`pave-neige_${nomSens(m)}`, `Le chemin pavé déblayé sous la neige ${vers(m)}`, CASE, () => pave(m, `pn${m}`, true), null, null, m);
const ETAPES = ['le tracé marqué (craie, piquets et ficelle)', 'l\'herbe coupée ras', 'les mottes soulevées', 'la tranchée (terre fraîche, terre rejetée)', 'le gravier étalé, les pierres du bord posées'];
for (let e = 0; e < 5; e++) for (let m = 0; m < 16; m++) piece(`etape-${e + 1}_${nomSens(m)}`, `Le creusement, étape ${e + 1} : ${ETAPES[e]} ; ${vers(m)}`, CASE, () => creuse(e, m, `cr${e}x${m}`), null, null, m);
for (let k = 0; k < 4; k++) piece(`mottes_${k + 1}`, 'Les mottes du coup de bêche', EFFET, () => mottes(k), 'mottes', 90);
for (let k = 0; k < 3; k++) piece(`poussiere_${k + 1}`, 'La poussière du coup de bêche', EFFET, () => poussiere(k), 'poussiere', 110);
for (let k = 0; k < 3; k++) piece(`cailloux_${k + 1}`, 'Les cailloux du coup de bêche', EFFET, () => cailloux(k), 'cailloux', 110);
for (let k = 0; k < 3; k++) piece(`pose-pierre_${k + 1}`, 'Une pierre de bordure qu\'on pose', EFFET, () => posePierre(k), 'pose-pierre', 90);

module.exports = { BITS, PIECES, fichierDe, nomSens, sensDe, herbe, chemin, pave, neige, creuse, mottes, poussiere, cailloux, posePierre };
