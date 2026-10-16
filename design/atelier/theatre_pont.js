// 01_pont en théâtre de papier (choix de l'auteur, 16 oct. : « l'effet papier collé qui bougent les uns par-dessus les
// autres, comme les cinématiques d'Alice Madness Returns », le niveau de détail et d'animation de ses cinématiques) : des
// dizaines de pièces découpées, chacune peinte à part (son cadre), qui entrent, glissent les unes sur les autres,
// pivotent sur leurs attaches ; le décor se monte, puis se démonte. Le collage, fondu dans un décor commun (« pas 100 %
// papier : du carton fondu dans un décor ; la lumière et la couleur font la gravité ») :
//   - des pièces de carton mat, sombres, au grain discret ; leur tranche reste dans l'ombre, sauf du côté de leur
//     lumière, où elle s'allume d'un liseré (froid sous la lune et la foudre, chaud près des hublots et de la lanterne) ;
//   - des voiles de brume colorée entre les plans (le lointain pâlit et bleuit), un étalonnage commun par-dessus ;
//   - des spirales partout, qui tournent et se dessinent ; des effets réinventés en papier (halos de papier translucide,
//     foudre doublée de cyan, étincelles en étoiles, embruns en éclats) ;
//   - les personnages sont des marionnettes articulées (game/scenePlans.js : dans).
const { Defs, hash, f } = require('./ouverture');
const { rugueux, courbe, spirale } = require('./papier');

const W = 400, MARGE = 40, G = -MARGE, D_ = W + MARGE;
const PAPIER = '#F4EEE2', NOIR = '#030204';
// les lumières : la lune (froide, en haut à droite), la chaleur des hublots et de la lanterne
const LUNE = [300, 108], FROID = '#CFE6F0', CHAUD = '#FFC470';
const VERS_LUNE = (() => { const l = Math.hypot(0.55, -0.83); return [0.55 / l, -0.83 / l]; })();

// ——— le collage ———
// un contour poussé vers l'extérieur de d (la tranche de la pièce, autour d'elle)
function gonfle(pts, d) {
  const n = pts.length;
  let aire = 0;
  for (let i = 0; i < n; i++) aire += pts[i][0] * pts[(i + 1) % n][1] - pts[(i + 1) % n][0] * pts[i][1];
  const sens = aire >= 0 ? 1 : -1;
  return pts.map((p, i) => {
    const a = pts[(i - 1 + n) % n], b = pts[(i + 1) % n], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1;
    return [p[0] + (sens * dy * d) / l, p[1] - (sens * dx * d) / l];
  });
}
// une ellipse en points
const ovale = (x, y, rx, ry, n = 18, a0 = 0) => courbe(t => [x + rx * Math.cos(a0 + t * Math.PI * 2), y + ry * Math.sin(a0 + t * Math.PI * 2)], n).slice(0, -1);
// les matières : le grain du carton (discret), des hachures d'encre
function matieres(pref) {
  const grain = Array.from({ length: 26 }, (_, i) => { const x = hash(i, 801) * 60, y = hash(i, 802) * 60, a = hash(i, 803) * Math.PI, l = 2 + 4 * hash(i, 804); return `<path d="M${f(x)},${f(y)} l${f(Math.cos(a) * l)},${f(Math.sin(a) * l)}" stroke="${i % 3 ? NOIR : '#C8C0B0'}" stroke-width="0.5" opacity="${i % 3 ? 0.16 : 0.07}"/>`; }).join('')
    + Array.from({ length: 8 }, (_, i) => `<ellipse cx="${f(hash(i, 805) * 60)}" cy="${f(hash(i, 806) * 60)}" rx="${f(4 + 8 * hash(i, 807))}" ry="${f(3 + 5 * hash(i, 808))}" fill="${i % 2 ? NOIR : '#8A8478'}" opacity="0.05"/>`).join('');
  const hach = Array.from({ length: 6 }, (_, i) => `<path d="M${i * 4 - 2},26 L${i * 4 + 22},-2" stroke="${NOIR}" stroke-width="0.7"/>`).join('');
  return `<defs><pattern id="${pref}fib" patternUnits="userSpaceOnUse" width="60" height="60">${grain}</pattern><pattern id="${pref}hach" patternUnits="userSpaceOnUse" width="24" height="24">${hach}</pattern></defs>`;
}
// le liseré de lumière : les bords de la pièce tournés vers sa lumière (o.source : un point ; sinon la lune, au loin)
function lisere(pts, t, o) {
  const n = pts.length;
  let aire = 0;
  for (let i = 0; i < n; i++) aire += pts[i][0] * pts[(i + 1) % n][1] - pts[(i + 1) % n][0] * pts[i][1];
  const sens = aire >= 0 ? 1 : -1;
  let d = '', ouvert = false;
  for (let i = 0; i < n; i++) {
    const a = pts[i], b = pts[(i + 1) % n], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1;
    const nx = (sens * dy) / l, ny = (-sens * dx) / l, mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
    let [lx, ly] = VERS_LUNE;
    if (o.source) { const q = Math.hypot(o.source[0] - mx, o.source[1] - my) || 1; lx = (o.source[0] - mx) / q; ly = (o.source[1] - my) / q; }
    if (nx * lx + ny * ly > (o.seuil ?? 0.3)) {
      const k = t * 0.5, j = (hash(i, 77) - 0.5) * 0.5;
      d += `${ouvert ? ' L' : ' M'}${f(a[0] + nx * (k + j))},${f(a[1] + ny * (k + j))} L${f(b[0] + nx * k)},${f(b[1] + ny * k)}`;
      ouvert = true;
    } else ouvert = false;
  }
  return d ? `<path d="${d.trim()}" fill="none" stroke="${o.rim ?? FROID}" stroke-width="${o.rimW ?? Math.max(1, t * 0.7)}" stroke-linecap="round" stroke-linejoin="round" opacity="${o.rimO ?? 0.9}"/>` : '';
}
// une pièce collée : son ombre portée, sa tranche (dans l'ombre), la pièce et son grain, ses hachures, son liseré de
// lumière
function collage(pref, pts, fill, o = {}) {
  const amp = o.amp ?? 0.8, seed = o.seed ?? 1, t = o.tranche ?? 2.2, d = rugueux(pts, amp, seed);
  const dBord = t ? rugueux(gonfle(pts, t), amp * 1.3 + 0.4, seed + 500, 5) : d;
  let s = o.ombre === 0 ? '' : `<path d="${dBord}" fill="${NOIR}" opacity="${o.ombre ?? 0.65}" transform="translate(${o.dx ?? 3} ${o.dy ?? 5})"/>`;
  if (t) s += `<path d="${dBord}" fill="${o.bordure ?? '#363844'}"/>`;
  s += `<path d="${d}" fill="${fill}"/><path d="${d}" fill="url(#${pref}fib)"/>`;
  if (o.hach) s += `<path d="${d}" fill="url(#${pref}hach)" opacity="${o.hach}"/>`;
  if (t && o.rim !== null) s += lisere(pts, t, o);
  return s;
}
// un trait d'encre
const encre = (d, w = 1.2, c = NOIR, op = 1) => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"${op < 1 ? ` opacity="${op}"` : ''}/>`;
const chemin = pts => `M${pts.map(([x, y]) => `${f(x)},${f(y)}`).join(' L')}`;
// une spirale découpée : une bande de carton qui s'enroule (x, y, r, sens), large de w
function bandeSpirale(x, y, r, sens = 1, tours = 1.7, w = 3) {
  const n = Math.round(tours * 14), pts = Array.from({ length: n + 1 }, (_, k) => { const a = (k / 14) * Math.PI * 2 * sens - Math.PI / 2, rr = r * (1 - k / (n + 3)); return [x + Math.cos(a) * rr, y + Math.sin(a) * rr]; });
  const bord = (k, s2) => { const [ax, ay] = pts[Math.max(0, k - 1)], [bx, by] = pts[Math.min(n, k + 1)], l = Math.hypot(bx - ax, by - ay) || 1, ww = (w / 2) * (1 - (k / n) * 0.7); return [pts[k][0] + (s2 * -(by - ay) * ww) / l, pts[k][1] + (s2 * (bx - ax) * ww) / l]; };
  return [...pts.map((_, k) => bord(k, 1)), ...pts.map((_, k) => bord(n - k, -1))];
}
// une volute claire qui se dessine, se tient, se défait (ce qui vit)
const voluteVive = (d, c, dur, beg, w = 1.4, op = 0.7) => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" opacity="${op}" stroke-dasharray="140" stroke-dashoffset="140"><animate attributeName="stroke-dashoffset" values="140;0;0;-140" keyTimes="0;0.4;0.7;1" dur="${f(dur)}s" begin="${f(-beg)}s" repeatCount="indefinite"/></path>`;

// ——— la partition, écrite sur toute la scène, puis découpée en temps ———
const DEF = { x: 0, y: 0, s: 1, r: 0, o: 1, z: 1 };
// la valeur d'une suite de clés absolues [[t, cle], …] à l'instant t (linéaire entre deux clés)
function valeur(cles, t, props) {
  if (t <= cles[0][0]) return { ...cles[0][1] };
  for (let i = 1; i < cles.length; i++) {
    const [t1, c1] = cles[i];
    if (t <= t1) {
      const [t0, c0] = cles[i - 1], k = (t - t0) / ((t1 - t0) || 1), v = {};
      for (const p of props) { const a = c0[p] ?? DEF[p], b = c1[p] ?? DEF[p]; if (c0[p] !== undefined || c1[p] !== undefined) v[p] = Math.round((a + (b - a) * k) * 100) / 100; }
      if (c0.e) v.e = c0.e;
      return v;
    }
  }
  return { ...cles[cles.length - 1][1] };
}
// des clés absolues découpées selon les durées des temps (chaque temps part de là où le précédent s'arrête)
function parTemps(T, cles, props = ['x', 'y', 's', 'r', 'o']) {
  const tri = [...cles].sort((a, b) => a[0] - b[0]);
  let a = 0;
  return T.map(d => {
    const b = a + d, dedans = tri.filter(([t]) => t > a && t < b).map(([t, c]) => [t - a, c]);
    const out = [[0, valeur(tri, a, props)], ...dedans, [d, valeur(tri, b, props)]];
    a = b;
    return out;
  });
}
// un balancement de t0 à t1 : une clé à chaque demi-période, val(k, t) (k : son rang ; t : l'instant)
const balance = (t0, t1, periode, val) => { const out = []; for (let t = t0, k = 0; t <= t1; t += periode / 2, k++) out.push([Math.round(t), { ...val(k, t), e: 'ease-in-out' }]); return out; };
// une secousse à t : n à-coups, de plus en plus faibles, autour d'une clé
const secoue = (t, cle, amp, n = 6, pas = 60) => Array.from({ length: n }, (_, k) => [t + k * pas, { ...cle, x: (cle.x || 0) + (k % 2 ? -1 : 1) * amp * (1 - k / n), y: (cle.y || 0) + (k % 2 ? 1 : -1) * amp * 0.6 * (1 - k / n), e: 'linear' }]).concat([[t + n * pas, { ...cle }]]);

// ——— les effets en papier collé ———
// un halo : des disques de papier de couleur, translucides, déchirés, l'un dans l'autre
const halo = (pref, x, y, r, couleur, n = 3, op = 0.12) => Array.from({ length: n }, (_, k) => `<path d="${rugueux(ovale(x, y, r * (1 - k * 0.28), r * (1 - k * 0.28), 22), 1.6 + r * 0.03, 900 + k + Math.round(x), 6)}" fill="${couleur}" opacity="${f(op + k * 0.05)}"/>`).join('');
// des étincelles : des étoiles de papier orange et rouge, bordées de blanc, dans un halo
const etoile = (x, y, r, a) => Array.from({ length: 8 }, (_, k) => { const an = a + (k / 8) * Math.PI * 2, rr = k % 2 ? r * 0.32 : r; return [x + Math.cos(an) * rr, y + Math.sin(an) * rr]; });
function etincelles(p, [x, y]) {
  const D = Defs(`${p}x`), pref = `${p}x`;
  return D.out(matieres(pref) + halo(pref, x, y, 24, '#FF9A3C', 3, 0.14) + Array.from({ length: 7 }, (_, k) => { const a = k * 0.9 + 0.3, l = 6 + 14 * hash(k, 7); return collage(pref, etoile(x + Math.cos(a) * l, y + Math.sin(a) * l, 3 + 3.4 * hash(k, 8), a), k % 2 ? '#FFC23C' : '#F0482A', { seed: 920 + k, amp: 0.2, tranche: 1, ombre: 0.3, dx: 1, dy: 1, bordure: '#FFF2D0', rim: null }); }).join(''));
}

// ——— le décor ———
const NUIT = { haut: '#05060C', mi: '#0B0D18', bas: '#161A2A', mer: ['#0C121C', '#0D141E', '#0E1620', '#101822'], rouge: '#7A1C16', coque: '#070609', sombre: '#1A1A22', fenetre: '#F0BC5E' };
const HORIZON = 222;
// le ciel : un lavis d'encre bleu-nuit, plus clair près de la lune et de l'horizon ; de grandes masses de nuages au loin
function ciel(p) {
  const D = Defs(`${p}c`);
  let s = matieres(`${p}c`) + `<rect x="${G}" y="${G}" width="${D_ - G}" height="${D_ - G}" fill="${D.lin([[0, NUIT.haut], [0.55, NUIT.mi], [1, NUIT.bas]], 0, G, 0, HORIZON + 40)}"/>`;
  s += `<rect x="${G}" y="${G}" width="${D_ - G}" height="${D_ - G}" fill="${D.rad([[0, '#3A4A6E', 0.45], [1, '#3A4A6E', 0]], LUNE[0], LUNE[1], 230)}"/><rect x="${G}" y="${G}" width="${D_ - G}" height="${D_ - G}" fill="url(#${p}cfib)"/>`;
  for (let i = 0; i < 3; i++) s += collage(`${p}c`, [...courbe(t => { const ph = (t * (3 + i) + i * 0.3) % 1; return [G - 20 + (D_ - G + 40) * t, 150 + i * 26 - 24 * (ph < 0.8 ? ph / 0.8 : (1 - ph) / 0.2)]; }, 60), [D_ + 20, 300], [G - 20, 300]], ['#10131F', '#0E111C', '#0C0F19'][i], { seed: 10 + i, tranche: 1.4, ombre: 0, bordure: '#1E2434', rim: '#5E7290', rimO: 0.6 });
  return D.out(s);
}
// une spirale du ciel, découpée (le jeu la fait tourner et dériver)
const SPIRALES = [[64, 56, 16, 1], [178, 30, 12, -1], [126, 116, 14, 1], [372, 52, 13, -1], [236, 178, 10, 1]];
function spiraleCiel(p, i) {
  const [x, y, r, sens] = SPIRALES[i], pref = `${p}s${i}`, D = Defs(pref);
  return D.out(matieres(pref) + collage(pref, bandeSpirale(x, y, r, sens, 1.8, 3.4), '#2A3048', { seed: 400 + i, amp: 0.25, tranche: 1, ombre: 0.5, dx: 2, dy: 3, bordure: '#3A4460', rim: FROID, rimO: 0.8 }));
}
// la lune : un disque de carton pâle, ses cratères, son ombre, son halo de papier translucide
function lune(p) {
  const D = Defs(`${p}l`), pref = `${p}l`, [x, y] = LUNE;
  let s = matieres(pref) + halo(pref, x, y, 48, '#BFD4E8', 3, 0.07);
  s += collage(pref, ovale(x, y, 30, 30, 26), '#E8E0CC', { seed: 20, amp: 0.6, ombre: 0.4, bordure: '#A8A494', rim: '#FFFFFF', source: [x + 40, y - 40] });
  for (const [cx, cy, r] of [[290, 100, 6], [310, 116, 4.4], [296, 120, 3], [312, 96, 2.6]]) s += collage(pref, ovale(cx, cy, r, r * 0.85, 10), '#CCC3AC', { seed: cx, amp: 0.3, tranche: 0.8, ombre: 0, bordure: '#B4AB94', rim: null });
  s += `<path d="${rugueux([...courbe(t => [x + 30 * Math.cos(Math.PI / 2 + t * Math.PI), y + 30 * Math.sin(Math.PI / 2 + t * Math.PI)], 14), ...courbe(t => [x - 18 * Math.cos(Math.PI / 2 - t * Math.PI) * -1, y + 30 * Math.sin(-Math.PI / 2 + t * Math.PI) * -1], 14)], 0.4, 21)}" fill="#5A5C66" opacity="0.35"/>`;
  return D.out(s);
}
// une bande de nuages : des pointes déchirées par le vent (une montée lente, une chute nette), des volutes claires
function nuage(p, i, y, h, bosses, couleur) {
  const D = Defs(`${p}n${i}`), pref = `${p}n${i}`;
  const dent = t => { const ph = (t * bosses * 2 + i * 0.37) % 1; return ph < 0.78 ? (ph / 0.78) ** 1.6 : (1 - ph) / 0.22; };
  const haut = courbe(t => [-110 + 620 * t, y - h * dent(t) * (0.6 + 0.4 * hash(Math.floor(t * bosses * 2 + i * 0.37), i))], bosses * 24);
  const bas = courbe(t => [510 - 620 * t, y + 16 + 5 * Math.sin(t * 13 + i)], 20);
  let s = matieres(pref) + collage(pref, [...haut, ...bas], couleur, { seed: 30 + i, amp: 0.7, hach: 0.3, dy: 6, bordure: ['#2E3448', '#283044', '#232A3C', '#1E2434'][i], rim: FROID, rimO: 0.85 - i * 0.12 });
  for (let k = 0; k < bosses * 2; k++) if (hash(k, i + 9) < 0.7) { const x = -110 + 620 * ((k + 0.78 - ((i * 0.37) % 1)) / (bosses * 2)); s += encre(spirale(x - 5, y - h * 0.55, 4 + 3 * hash(k, i), k % 2 ? 1 : -1, 1.5), 1.1, FROID, 0.7 - i * 0.1); }
  return D.out(s);
}
// la foudre : un éclair de papier blanc, doublé de bandes cyan et violettes translucides
const FOUDRE = [[104, -14], [92, 46], [114, 58], [84, 130], [104, 138], [74, 210]];
function foudre(p) {
  const D = Defs(`${p}f`), pref = `${p}f`;
  const bande = w => [...FOUDRE.map(([x, y]) => [x + w, y]), ...FOUDRE.slice().reverse().map(([x, y]) => [x - w, y + 4])];
  return D.out(matieres(pref) + `<path d="${rugueux(bande(16), 2, 41)}" fill="#8A5CE0" opacity="0.25"/><path d="${rugueux(bande(10), 1.4, 42)}" fill="#5FD8F0" opacity="0.4"/>`
    + collage(pref, bande(4.5), '#FFFFFF', { seed: 40, amp: 0.4, tranche: 1.2, ombre: 0, bordure: '#DFF6FF', rim: null }));
}
// un rouleau de mer : une bande aux crêtes pointues, l'écume de papier blanc aux pointes, des spirales, des veines
function rouleau(p, i, y, a, periode, couleur) {
  const D = Defs(`${p}m${i}`), pref = `${p}m${i}`;
  const haut = courbe(t => { const x = -80 + 560 * t, ph = ((x + i * 37) / periode) % 1; return [x, y - a * Math.pow(Math.sin(Math.PI * ph), 3) * (ph < 0.5 ? 1 : 0.7)]; }, 140);
  let s = matieres(pref) + collage(pref, [...haut, [480, y + 230], [-80, y + 230]], couleur, { seed: 50 + i, amp: 0.6, hach: 0.15, dy: 6, bordure: '#22303E', rim: '#9FC8D8', rimO: 0.5 + i * 0.1 });
  for (let k = 0; k < 7; k++) s += encre(`M${f(-60 + k * 80 + 20 * hash(k, i))},${f(y + 16 + 16 * hash(k, i + 3))} q20,-5 40,0 t36,-2`, 1, '#3E7484', 0.45);
  for (let x = -80 + periode * 0.5 - ((i * 37) % periode); x < 480; x += periode) {
    const cy = y - a;
    s += collage(pref, [[x - 12, cy + 7], [x - 5, cy - 1], [x + 2, cy + 2], [x + 8, cy - 2], [x + 14, cy + 8], [x + 2, cy + 6]], PAPIER, { seed: 60 + i + Math.round(x), amp: 0.5, tranche: 0.8, ombre: 0.4, dx: 1, dy: 2, bordure: '#BFD8E0', rim: null });
    s += encre(spirale(x + 18, cy + 8, 3.6 + i * 0.6, -1, 1.4), 1, FROID, 0.75);
  }
  return D.out(s);
}
// la brume qui monte de la mer, entre les plans : le lointain pâlit et bleuit
const brume = (p, id, y0, y1, c, op) => { const D = Defs(`${p}${id}`); return D.out(`<rect x="${G}" y="${G}" width="${D_ - G}" height="${D_ - G}" fill="${D.lin([[0, c, 0], [0.55, c, op], [1, c, 0]], 0, y0, 0, y1)}"/>`); };
// l'étalonnage commun : le froid de la lune, le noir des bords
const teinte = p => { const D = Defs(`${p}t`); return D.out(`<rect x="${G}" y="${G}" width="${D_ - G}" height="${D_ - G}" fill="${D.rad([[0, '#8FB8D8', 0.14], [1, '#8FB8D8', 0]], LUNE[0], LUNE[1], 260)}"/><rect x="${G}" y="${G}" width="${D_ - G}" height="${D_ - G}" fill="${D.rad([[0, NOIR, 0], [0.62, NOIR, 0.1], [1, NOIR, 0.7]], 200, 200, 320)}"/>`); };
const aplat = (p, c) => `<rect x="${G}" y="${G}" width="${D_ - G}" height="${D_ - G}" fill="${c}"/>`;

// ——— la lame qui se dresse derrière le navire ———
function lame(p) {
  const D = Defs(`${p}w`), pref = `${p}w`;
  const dos = courbe(t => [470 - 330 * t, 330 - 300 * Math.sin((t * Math.PI) / 2) ** 1.5], 30);
  const crete = courbe(t => [140 - 110 * t, 30 - 22 * Math.sin(t * Math.PI) + 64 * t * t], 16).slice(1);
  const creux = courbe(t => [30 + 50 * t, 94 + 40 * t + 30 * t * t], 10).slice(1);
  const face = courbe(t => [80 - 160 * t, 164 + 160 * t * t], 12).slice(1);
  let s = matieres(pref) + collage(pref, [...dos, ...crete, ...creux, ...face, [-90, 340], [470, 340]], D.lin([[0, '#1E3A4C'], [0.45, '#13242F'], [1, '#0A121A']], 0, 20, 0, 330), { seed: 130, amp: 0.9, hach: 0.35, dy: 8, bordure: '#2E4A5E', rim: FROID, rimW: 2.4 });
  for (let i = 0; i < 5; i++) { const k = 0.16 + i * 0.14, b = courbe(t => [470 - 300 * t * (1 - k * 0.2), 330 - 290 * Math.sin((t * Math.PI) / 2) ** 1.5 + 80 * k], 22); s += encre(chemin(b), 1.1 + i * 0.3, i % 2 ? '#3E8C96' : FROID, i % 2 ? 0.7 : 0.45); }
  for (let i = 0; i < 6; i++) s += encre(spirale(200 + i * 40, 140 + i * 30, 6 + i, -1, 1.5), 1.2, '#5FA8B4', 0.6);
  for (let i = 0; i < 9; i++) { const [x, y] = crete[Math.min(crete.length - 1, i * 2)] || crete[crete.length - 1], l = 16 + 8 * hash(i, 3); const g = courbe(t => [x - l * t, y - 6 + l * 1.2 * t * t], 6); s += collage(pref, [...g, ...g.slice(0, -1).reverse().map(([gx, gy], j) => [gx + 5 - j * 0.7, gy - 4 + j * 0.5])], PAPIER, { seed: 131 + i, amp: 0.4, tranche: 0.8, ombre: 0.5, dx: 2, dy: 3, bordure: '#BFD8E0', rim: null }); }
  s += encre(spirale(56, 106, 18, -1, 1.7), 2.6, PAPIER) + encre(spirale(56, 106, 18, -1, 1.7), 1, '#5FD8F0', 0.9);
  return D.out(s);
}

// ——— l'Hirondelle, de profil ———
const NAV = { pivot: [205, 250] };
// un garde-corps : la lisse et ses chandeliers, en trait clair
const gardeCorps = (x0, x1, y, h = 6, pas = 7, c = '#A8B8C4') => encre(`M${x0},${y - h} L${x1},${y - h}`, 0.9, c, 0.9) + encre(Array.from({ length: Math.floor((x1 - x0) / pas) + 1 }, (_, k) => `M${f(x0 + k * pas)},${y} l0,${-h}`).join(' '), 0.6, c, 0.7);
function navire(p) {
  const D = Defs(`${p}v`), pref = `${p}v`, o = (seed, x = {}) => ({ seed, bordure: '#2A2C36', rim: FROID, ...x });
  let s = matieres(pref);
  // le mât, sa hune, ses étais (derrière)
  s += encre('M322,214 L322,98 M322,104 L62,206 M322,104 L356,212 M322,130 L300,172', 0.8, '#8A9AA8', 0.6);
  s += collage(pref, [[319, 214], [325, 214], [324, 98], [320, 98]], '#14110E', o(70, { amp: 0.3, tranche: 1.2, ombre: 0.5, dx: 2, dy: 3 }));
  s += collage(pref, [[314, 118], [332, 118], [330, 126], [316, 126]], '#14110E', o(69, { amp: 0.3, tranche: 1.2, ombre: 0.4, dx: 1, dy: 2 }));
  // les manches à air
  for (const [x, k] of [[148, 1], [222, -1]]) s += collage(pref, [[x - 3, 172], [x + 3, 172], [x + 3, 152], [x + 3 + 9 * k, 146], [x + 3 + 10 * k, 154], [x, 152], [x - 3, 156]], '#0C0A0E', o(66 + x, { amp: 0.3, tranche: 1.2, ombre: 0.5, dx: 2, dy: 3 }));
  // la cheminée, rouge, son bandeau noir, l'hirondelle de la compagnie
  s += collage(pref, [[166, 176], [206, 176], [210, 116], [170, 116]], NUIT.rouge, o(71, { amp: 0.5, hach: 0.3, rim: '#FF8A6A' }));
  s += collage(pref, [[169, 130], [209, 130], [210, 116], [170, 116]], NOIR, o(72, { amp: 0.4, tranche: 1.2, ombre: 0 }));
  s += encre('M168,140 L208,140 M167,168 L207,168', 0.8, '#E8C8B8', 0.5) + `<path d="M178,154 q6,-6 10,-1 q4,-5 10,-2 q-6,1 -9,6 q-4,-3 -11,-3 Z" fill="${PAPIER}"/>`;
  // les superstructures, sombres ; leurs panneaux ; les hublots dorés, cerclés, qui jettent leur lumière
  s += collage(pref, [[108, 214], [302, 214], [302, 172], [108, 172]], NUIT.sombre, o(73, { amp: 0.7, hach: 0.3 }));
  s += encre(Array.from({ length: 8 }, (_, k) => `M${112 + k * 24},176 l0,34`).join(' '), 0.5, '#8A9AA8', 0.35);
  for (let k = 0; k < 10; k++) { const x = 122 + k * 17; s += halo(pref, x, 193, 9, CHAUD, 2, 0.1) + collage(pref, ovale(x, 193, 3.8, 3.8, 10), NUIT.fenetre, { seed: 80 + k, amp: 0.2, tranche: 1, ombre: 0, bordure: '#C8A060', rim: null }) + `<path d="M${x - 1.6},${191.6} a1.8,1.8 0 0 1 2.6,-0.6" stroke="#FFF6D8" stroke-width="0.8" fill="none"/>`; }
  s += gardeCorps(108, 302, 172, 5, 6);
  // la passerelle, à l'avant : ses vitres allumées, son auvent
  s += collage(pref, [[244, 174], [302, 174], [308, 146], [248, 146]], NUIT.sombre, o(74, { amp: 0.5, hach: 0.25 }));
  for (let k = 0; k < 4; k++) s += halo(pref, 258 + k * 12, 157, 10, CHAUD, 2, 0.08) + collage(pref, [[254 + k * 12, 151], [263 + k * 12, 151], [263 + k * 12, 163], [254 + k * 12, 163]], NUIT.fenetre, { seed: 75 + k, amp: 0.3, tranche: 0.9, ombre: 0, bordure: '#C8A060', rim: null });
  s += collage(pref, [[244, 147], [312, 147], [310, 142], [246, 142]], '#0C0A0E', o(79, { amp: 0.3, tranche: 1, ombre: 0.4, dx: 1, dy: 2 }));
  // la coque : noire, ses tôles et ses rivets, sa bande rouge, la ligne de flottaison, la proue relevée, l'ancre
  s += collage(pref, [[50, 208], [356, 206], [368, 198], [348, 262], [96, 268], [58, 236]], NUIT.coque, o(90, { amp: 0.9, hach: 0.3, dy: 7 }));
  s += collage(pref, [[60, 236], [352, 234], [348, 248], [74, 252]], NUIT.rouge, o(91, { amp: 0.5, tranche: 0.9, ombre: 0, rim: '#FF8A6A' }));
  s += encre(Array.from({ length: 13 }, (_, k) => `M${f(72 + k * 22)},${212} l${f(-2 + k * 0.3)},${f(20)}`).join(' '), 0.5, '#8A9AA8', 0.4);
  s += Array.from({ length: 40 }, (_, k) => `<circle cx="${f(62 + k * 7.4)}" cy="${f(213 - k * 0.05)}" r="0.7" fill="#A8B8C4" opacity="0.6"/>`).join('');
  s += encre('M64,252 q12,-3 24,0 t24,0 t24,0 t24,0 t24,0 t24,0 t24,0 t24,0 t24,0 t24,0 t24,0 t20,-1', 0.8, PAPIER, 0.55);
  s += encre('M340,214 l0,12 M335,219 l10,0 M333,224 q7,7 14,0', 1, '#A8B8C4', 0.85);
  s += gardeCorps(52, 356, 207, 6, 7);
  s += `<text x="292" y="230" font-family="Georgia, serif" font-size="8" font-weight="bold" letter-spacing="1.4" fill="${PAPIER}" text-anchor="middle" opacity="0.9">L’HIRONDELLE</text>`;
  return D.out(s);
}
// la guirlande de la croisière, du mât à la poupe et à la proue : ses ampoules et leurs halos de papier
function guirlande(p) {
  const D = Defs(`${p}g`), pref = `${p}g`;
  const fil = (x0, y0, x1, y1, creux, seed) => {
    const pt = t => [x0 + (x1 - x0) * t, y0 + (y1 - y0) * t + creux * 4 * t * (1 - t)];
    let g = encre(chemin(courbe(pt, 20)), 0.7, '#8A9AA8', 0.8);
    for (let k = 1; k < 9; k++) { const [x, y] = pt(k / 9), c = ['#F0BC5E', '#E8503A', '#6EC8E0', '#9AD86A'][(k + seed) % 4]; g += halo(pref, x, y + 3, 6, c, 2, 0.14) + `<circle cx="${f(x)}" cy="${f(y + 3)}" r="1.8" fill="${c}" stroke="${NOIR}" stroke-width="0.5"/>`; }
    return g;
  };
  return D.out(fil(322, 106, 66, 204, 18, 0) + fil(322, 106, 354, 206, 6, 2));
}
// le fanion au mât : rouge, fourchu, il claque (son pivot : la drisse)
const FANION = [322, 100];
const fanion = p => { const D = Defs(`${p}a`), pref = `${p}a`; return D.out(matieres(pref) + collage(pref, [[322, 98], [348, 101], [340, 104], [349, 108], [322, 108]], NUIT.rouge, { seed: 95, amp: 0.4, tranche: 1.2, ombre: 0.4, dx: 1, dy: 2, bordure: '#3A1410', rim: '#FF8A6A' })); };
// une volute de fumée, coupée en spirale (le jeu la fait monter de la cheminée, grandir et se défaire)
const CHEMINEE = [190, 110];
function fumee(p, i) {
  const pref = `${p}u${i}`, D = Defs(pref), [cx, cy] = CHEMINEE;
  return D.out(matieres(pref) + collage(pref, bandeSpirale(cx, cy - 6, 9 + i * 1.5, i % 2 ? 1 : -1, 1.6, 6 + i), ['#24262E', '#2C2E38', '#202228', '#282A34'][i % 4], { seed: 96 + i, amp: 0.5, tranche: 1.2, ombre: 0.45, dx: 2, dy: 3, bordure: '#3A3E4A', rim: FROID, rimO: 0.7 }));
}
// des embruns à la proue : des éclats de papier blanc et turquoise
const PROUE = [356, 236];
function embrun(p, i) {
  const pref = `${p}e${i}`, D = Defs(pref), [x, y] = PROUE;
  return D.out(matieres(pref) + Array.from({ length: 5 }, (_, k) => { const a = -Math.PI / 2 + (k - 2) * 0.42 + i * 0.25, l = 14 + 12 * hash(k, i); return collage(pref, [[x + Math.cos(a - 0.14) * 4, y + Math.sin(a - 0.14) * 4], [x + Math.cos(a) * l, y + Math.sin(a) * l], [x + Math.cos(a + 0.14) * 4, y + Math.sin(a + 0.14) * 4]], k % 2 ? '#7FD8E0' : PAPIER, { seed: 98 + k + i * 5, amp: 0.3, tranche: 0, ombre: 0.35, dx: 1, dy: 1 }); }).join(''));
}
// le canot de sauvetage, pendu à ses bossoirs (son pivot : le haut des bossoirs)
const CANOT = [148, 142];
function canot(p) {
  const D = Defs(`${p}k`), pref = `${p}k`;
  let s = matieres(pref) + encre('M128,174 Q126,142 148,140 M170,174 Q168,142 190,140', 3, NOIR) + encre('M128,174 Q126,142 148,140 M170,174 Q168,142 190,140', 1, '#A8B8C4', 0.8) + encre('M148,140 L140,156 M190,140 L182,156', 0.7, '#A8B8C4', 0.8);
  s += collage(pref, [[128, 156], [196, 156], [188, 169], [136, 169]], '#16141A', { seed: 100, amp: 0.4, hach: 0.25, dx: 2, dy: 3, bordure: '#2A2C36', rim: FROID }) + collage(pref, [[130, 160], [194, 160], [192, 163.4], [132, 163.4]], '#C8622E', { seed: 101, amp: 0.3, tranche: 0.8, ombre: 0, bordure: '#5A2A14', rim: null });
  s += encre('M136,166 L188,166 M150,157 l-2,11 M166,157 l-1,11 M180,157 l-2,11', 0.5, '#8A9AA8', 0.5);
  return D.out(s);
}
// la brèche dans la coque, près de la proue : noire, déchiquetée, l'eau qui s'y engouffre en éclats
const BRECHE = [322, 246];
function breche(p) {
  const D = Defs(`${p}b`), pref = `${p}b`, [bx, by] = BRECHE;
  const pts = Array.from({ length: 14 }, (_, k) => { const a = (k / 14) * Math.PI * 2, r = k % 2 ? 4 : 10 + 4 * hash(k, 1); return [bx + Math.cos(a) * r * 1.3, by + Math.sin(a) * r * 0.8]; });
  let s = matieres(pref) + collage(pref, pts, '#020103', { seed: 110, amp: 0.6, tranche: 1.8, ombre: 0, bordure: '#8A8A96', rim: FROID });
  for (let k = 0; k < 5; k++) { const a = Math.PI + (k - 2) * 0.35, l = 16 + 8 * hash(k, 2); s += collage(pref, [[bx + Math.cos(a - 0.15) * 6, by + Math.sin(a - 0.15) * 6], [bx + Math.cos(a) * l, by + Math.sin(a) * l * 0.7], [bx + Math.cos(a + 0.15) * 6, by + Math.sin(a + 0.15) * 6]], k % 2 ? '#7FD8E0' : PAPIER, { seed: 111 + k, amp: 0.3, tranche: 0, ombre: 0.3, dx: 1, dy: 1 }); }
  return D.out(s);
}

// ——— les passagers, en marionnettes : le corps, deux jambes, un bras ———
const PASSAGERS = [
  { id: 'p1', x: 126, manteau: '#1A1820', tete: 'chapeau' },
  { id: 'p2', x: 152, manteau: '#7A1C16', tete: 'foulard' },
  { id: 'p3', x: 282, manteau: '#D8D0C0', tete: 'marin' }
];
const PIED = 207, PEAU = '#E6D6BA';
const op = (seed, x = {}) => ({ seed, amp: 0.2, tranche: 0.9, ombre: 0.5, dx: 1, dy: 2, bordure: '#2A2C36', rim: FROID, ...x });
function passagerCorps(p, q) {
  const pref = `${p}${q.id}c`, D = Defs(pref), x = q.x;
  let s = matieres(pref) + collage(pref, [[x - 5, PIED - 10], [x - 6, PIED - 22], [x - 3, PIED - 26], [x + 3, PIED - 26], [x + 6, PIED - 22], [x + 5, PIED - 10]], q.manteau, op(300 + x));
  s += collage(pref, ovale(x, PIED - 30, 3.6, 4.2, 12), PEAU, op(301 + x, { tranche: 0.8 })) + `<circle cx="${x - 1.6}" cy="${PIED - 30.4}" r="0.6" fill="${NOIR}"/>`;
  if (q.tete === 'chapeau') s += collage(pref, [[x - 6, PIED - 33], [x + 5, PIED - 33], [x + 3, PIED - 34], [x + 3, PIED - 39], [x - 3, PIED - 39], [x - 3, PIED - 34]], NOIR, op(302 + x, { ombre: 0.3 }));
  if (q.tete === 'foulard') s += collage(pref, [[x - 4.6, PIED - 29], [x - 4, PIED - 34], [x, PIED - 35.6], [x + 4.4, PIED - 33], [x + 4.6, PIED - 28], [x + 7, PIED - 24]], '#E8B84A', op(303 + x, { ombre: 0.3 }));
  if (q.tete === 'marin') s += collage(pref, [[x - 4.4, PIED - 32], [x + 4.4, PIED - 32], [x + 3.6, PIED - 36], [x - 3.6, PIED - 36]], PAPIER, op(304 + x, { ombre: 0.3 })) + collage(pref, [[x - 6, PIED - 22], [x + 6, PIED - 22], [x + 6, PIED - 19], [x - 6, PIED - 19]], '#14243E', op(305 + x, { tranche: 0, ombre: 0 }));
  return D.out(s);
}
const passagerJambe = (p, q, k) => { const pref = `${p}${q.id}j${k}`, D = Defs(pref), x = q.x + (k ? 1.4 : -1.4); return D.out(matieres(pref) + collage(pref, [[x - 1.6, PIED - 11], [x + 1.6, PIED - 11], [x + 1.4, PIED - 1], [x + 3.6, PIED - 1], [x + 3.6, PIED + 0.6], [x - 1.6, PIED + 0.6]], NOIR, op(310 + q.x + k, { tranche: 0.7, ombre: 0.3 }))); };
const passagerBras = (p, q) => { const pref = `${p}${q.id}b`, D = Defs(pref), x = q.x; return D.out(matieres(pref) + collage(pref, [[x - 1, PIED - 24], [x + 2, PIED - 24], [x + 3, PIED - 13], [x, PIED - 13]], q.manteau, op(320 + x, { tranche: 0.8, ombre: 0.35 })) + collage(pref, ovale(x + 1.6, PIED - 12, 1.4, 1.4, 8), PEAU, op(321 + x, { tranche: 0.5, ombre: 0 }))); };

// ——— la passerelle, en panneau : le capitaine au micro (sous la lanterne : la lumière chaude) ———
const PANNEAU = [200, 164], LUEUR = [236, 96];
const chaud = (seed, x = {}) => ({ seed, bordure: '#2A1E16', rim: CHAUD, source: LUEUR, ...x });
// le panneau déchiré : la cloison de bois, la vitre sur la tempête, l'horloge, le socle du télégraphe
function panneau(p) {
  const D = Defs(`${p}P`), pref = `${p}P`;
  let s = matieres(pref);
  s += collage(pref, [[26, 34], [374, 30], [378, 296], [22, 300]], '#120D0C', { seed: 140, amp: 1.4, tranche: 5, ombre: 0.85, dx: 7, dy: 10, bordure: '#E8DCC4', rim: null });
  for (let k = 0; k < 9; k++) s += collage(pref, [[30 + k * 38, 40], [66 + k * 38, 40], [66 + k * 38, 292], [30 + k * 38, 292]], k % 2 ? '#2A1B14' : '#24170F', { seed: 141 + k, amp: 0.4, tranche: 0, ombre: 0 }) + encre(`M${40 + k * 38},48 q4,60 -2,120 t2,110`, 0.5, '#D8B890', 0.22);
  s += `<rect x="30" y="38" width="340" height="256" fill="${D.rad([[0, '#FFB050', 0.28], [0.5, '#FF9040', 0.08], [1, NOIR, 0.55]], LUEUR[0], LUEUR[1], 300)}"/>`;
  // la vitre : son cadre de laiton, la nuit dehors, la pluie, la mer qui monte, un éclat de lune
  s += collage(pref, [[50, 56], [218, 54], [220, 192], [52, 194]], '#8A6A34', chaud(150, { amp: 0.5, tranche: 1.6, hach: 0.15 }));
  s += collage(pref, [[60, 64], [210, 62], [211, 184], [61, 185]], '#0A0E18', { seed: 151, amp: 0.4, tranche: 0, ombre: 0 });
  s += `<rect x="61" y="63" width="150" height="122" fill="${D.rad([[0, '#4A6A90', 0.5], [1, '#4A6A90', 0]], 180, 70, 120)}"/>`;
  s += collage(pref, [...courbe(t => [61 + 150 * t, 150 - 26 * Math.sin(t * Math.PI * 2.2) ** 2], 20), [211, 184], [61, 185]], '#101A26', { seed: 152, amp: 0.5, tranche: 1, ombre: 0, bordure: '#3E6A80', rim: FROID });
  s += encre(Array.from({ length: 16 }, (_, k) => `M${f(66 + k * 9)},${f(68 + 10 * hash(k, 1))} l-6,22`).join(' '), 0.7, '#A8C8D8', 0.5) + encre(spirale(170, 80, 8, 1, 1.5), 1, FROID, 0.6) + encre(spirale(96, 96, 6, -1, 1.4), 1, FROID, 0.5);
  s += encre('M135,62 L135,184 M61,124 L210,124', 2.2, '#8A6A34');
  for (const [x, y] of [[56, 60], [214, 58], [216, 188], [56, 190]]) s += `<circle cx="${x}" cy="${y}" r="1.6" fill="#FFE0A0"/>`;
  // l'horloge de bord, cerclée de laiton
  s += collage(pref, ovale(326, 70, 18, 18, 20), '#8A6A34', chaud(153, { amp: 0.4, tranche: 1.4 })) + collage(pref, ovale(326, 70, 13, 13, 18), '#E8DCC0', { seed: 154, amp: 0.3, tranche: 0, ombre: 0 }) + encre('M326,70 L326,61 M326,70 L332,73', 1, NOIR) + encre(Array.from({ length: 12 }, (_, k) => { const a = (k / 12) * Math.PI * 2; return `M${f(326 + Math.cos(a) * 11)},${f(70 + Math.sin(a) * 11)} L${f(326 + Math.cos(a) * 12.6)},${f(70 + Math.sin(a) * 12.6)}`; }).join(' '), 0.6, NOIR);
  // le socle et le cadran du télégraphe des machines
  s += collage(pref, [[44, 296], [76, 296], [70, 232], [50, 232]], '#5E4626', chaud(155, { amp: 0.4, tranche: 1.2, hach: 0.2 })) + collage(pref, ovale(60, 222, 20, 20, 20), '#8A6A34', chaud(156, { amp: 0.4, tranche: 1.4 })) + collage(pref, ovale(60, 222, 15, 15, 18), '#E8DCC0', { seed: 157, amp: 0.3, tranche: 0, ombre: 0 });
  s += encre('M48,214 L72,214 M47,222 L73,222 M48,230 L72,230', 0.5, NOIR, 0.7) + `<path d="M60,207 L60,237" stroke="#C8463A" stroke-width="1.4"/>`;
  return D.out(s);
}
// la manette du télégraphe (son pivot : l'axe du cadran)
const TELEGRAPHE = [60, 222];
const telegraphe = p => { const D = Defs(`${p}T`), pref = `${p}T`; return D.out(matieres(pref) + collage(pref, [[58, 224], [62, 224], [63, 200], [57, 200]], '#2A1E10', chaud(158, { amp: 0.2, tranche: 1, ombre: 0.4, dx: 1, dy: 2 })) + collage(pref, ovale(60, 199, 4, 4, 10), '#C8A040', chaud(159, { amp: 0.2, tranche: 1, ombre: 0 }))); };
// la lanterne pendue au plafond, son halo de papier orange (son pivot : le crochet)
const LANTERNE = [236, 34];
function lanterne(p) {
  const D = Defs(`${p}L`), pref = `${p}L`;
  return D.out(matieres(pref) + encre('M236,34 L236,78', 1.2, '#8A6A34') + halo(pref, 236, 96, 50, '#FFB04A', 3, 0.1)
    + collage(pref, [[226, 82], [246, 82], [250, 112], [222, 112]], '#FFD070', { seed: 160, amp: 0.4, tranche: 1.2, ombre: 0.4, bordure: '#FFF0C0', rim: null }) + encre('M229,84 L225,110 M236,82 L236,112 M243,84 L247,110', 1.4, '#3A2810')
    + collage(pref, [[222, 78], [250, 78], [246, 84], [226, 84]], '#3A2810', chaud(161, { amp: 0.3, tranche: 1, ombre: 0 })) + collage(pref, [[220, 112], [252, 112], [248, 118], [224, 118]], '#3A2810', chaud(162, { amp: 0.3, tranche: 1, ombre: 0 })));
}
// la barre à roue (son pivot : son moyeu)
const BARRE = [136, 262];
function barre(p) {
  const D = Defs(`${p}B`), pref = `${p}B`, [cx, cy] = BARRE;
  let s = matieres(pref);
  for (let k = 0; k < 8; k++) { const a = (k / 8) * Math.PI * 2 + 0.2, c = Math.cos(a), sn = Math.sin(a); s += collage(pref, [[cx + c * 6 - sn * 2.4, cy + sn * 6 + c * 2.4], [cx + c * 50 - sn * 3.4, cy + sn * 50 + c * 3.4], [cx + c * 55, cy + sn * 55], [cx + c * 50 + sn * 3.4, cy + sn * 50 - c * 3.4], [cx + c * 6 + sn * 2.4, cy + sn * 6 - c * 2.4]], '#6A4426', chaud(170 + k, { amp: 0.3, tranche: 1, ombre: 0.45, dx: 2, dy: 3 })); }
  s += collage(pref, [...ovale(cx, cy, 38, 38, 32), ...ovale(cx, cy, 31, 31, 32).reverse()], '#6A4426', chaud(180, { amp: 0.4, tranche: 1.2, hach: 0.2, ombre: 0.5, dx: 3, dy: 4 }));
  s += collage(pref, ovale(cx, cy, 9, 9, 14), '#B8902E', chaud(181, { amp: 0.3, tranche: 1.2 })) + `<circle cx="${cx - 2}" cy="${cy - 2}" r="2" fill="#FFE8A0" opacity="0.8"/>`;
  return D.out(s);
}
// le capitaine, en marionnette
const COU = [298, 198], MACHOIRE = [292, 172], EPAULE = [266, 214], MICRO = [244, 172];
const MARINE = '#141C34', OR = '#D8A840';
function capCorps(p) {
  const D = Defs(`${p}C`), pref = `${p}C`;
  let s = matieres(pref);
  s += collage(pref, [[252, 300], [250, 232], [262, 210], [290, 200], [312, 200], [338, 214], [350, 240], [354, 300]], MARINE, chaud(190, { amp: 0.7, tranche: 2.4, hach: 0.25, dx: 4, dy: 6, bordure: '#0A0E1C' }));
  s += collage(pref, [[290, 202], [312, 202], [304, 236], [298, 236]], '#F2ECE0', { seed: 191, amp: 0.4, tranche: 0, ombre: 0 }) + collage(pref, [[296, 206], [306, 206], [303, 232], [299, 232]], '#7A1C16', { seed: 192, amp: 0.3, tranche: 0, ombre: 0.3 });
  s += collage(pref, [[288, 202], [300, 238], [292, 262], [276, 214]], '#0E1428', chaud(193, { amp: 0.4, tranche: 1, ombre: 0.3, bordure: '#0A0E1C' })) + collage(pref, [[314, 202], [304, 238], [318, 262], [330, 214]], '#0E1428', chaud(194, { amp: 0.4, tranche: 1, ombre: 0.3, bordure: '#0A0E1C' }));
  for (let k = 0; k < 3; k++) for (const x of [292, 314]) s += collage(pref, ovale(x + (x > 300 ? 1 : -1) * k * 0.6, 248 + k * 16, 2.6, 2.6, 8), OR, chaud(195 + k + x, { amp: 0.2, tranche: 0.8, ombre: 0.3, bordure: '#6A4A10' }));
  s += collage(pref, [[318, 206], [344, 214], [346, 222], [320, 216]], OR, chaud(199, { amp: 0.3, tranche: 1, ombre: 0.4, bordure: '#6A4A10' })) + encre(Array.from({ length: 7 }, (_, k) => `M${322 + k * 3.6},${217 + k * 0.8} l0.6,7`).join(' '), 1, OR);
  return D.out(s);
}
function capTete(p) {
  const D = Defs(`${p}H`), pref = `${p}H`;
  let s = matieres(pref);
  s += collage(pref, [[288, 198], [306, 198], [306, 184], [290, 184]], PEAU, { seed: 200, amp: 0.3, tranche: 0, ombre: 0 });
  s += collage(pref, ovale(296, 160, 22, 27, 24), PEAU, chaud(201, { amp: 0.4, tranche: 1.8, hach: 0.08, bordure: '#8A6A50' }));
  s += `<ellipse cx="306" cy="166" rx="14" ry="20" fill="${NOIR}" opacity="0.22"/>`;
  s += collage(pref, [[310, 150], [322, 146], [324, 172], [312, 176]], '#B8B2A6', chaud(202, { amp: 0.5, tranche: 1.2, hach: 0.3, bordure: '#5A5448' })) + collage(pref, ovale(312, 162, 4, 6, 10), '#D8C4A4', chaud(203, { amp: 0.3, tranche: 1, ombre: 0.3, bordure: '#8A6A50' }));
  s += collage(pref, ovale(284, 175, 7, 4, 12), '#2A0E0C', { seed: 204, amp: 0.3, tranche: 0, ombre: 0 });
  s += collage(pref, ovale(284, 154, 3.4, 2.6, 10), '#F8F4EC', { seed: 205, amp: 0.2, tranche: 0, ombre: 0 }) + `<circle cx="282.6" cy="154.4" r="1.7" fill="${NOIR}"/><circle cx="282" cy="153.8" r="0.5" fill="#FFF8E8"/>`;
  s += encre('M290,148 q4,10 0,18 M276,160 q3,2 6,1', 0.8, '#7A5A40', 0.6) + collage(pref, [[284, 156], [268, 170], [278, 172], [286, 168]], '#D8C2A0', chaud(206, { amp: 0.3, tranche: 1, ombre: 0.4, dx: 1, dy: 2, bordure: '#8A6A50' }));
  s += collage(pref, [[266, 172], [276, 168], [290, 170], [298, 176], [286, 178], [276, 176]], '#B8B2A6', chaud(207, { amp: 0.5, tranche: 1, ombre: 0.4, hach: 0.3, bordure: '#5A5448' }));
  s += collage(pref, [[270, 136], [276, 120], [300, 112], [326, 118], [324, 138]], '#E8E0D0', chaud(208, { amp: 0.5, tranche: 1.4, hach: 0.1, bordure: '#8A8274' }));
  s += collage(pref, [[272, 134], [324, 136], [324, 146], [272, 144]], NOIR, chaud(209, { amp: 0.3, tranche: 1, ombre: 0.4 })) + collage(pref, [[274, 142], [258, 148], [262, 152], [284, 146]], NOIR, chaud(210, { amp: 0.3, tranche: 1.2, ombre: 0.5, dx: 2, dy: 3 }));
  s += collage(pref, [[282, 128], [292, 126], [296, 132], [290, 136], [280, 134]], OR, chaud(211, { amp: 0.2, tranche: 0.8, ombre: 0.3, bordure: '#6A4A10' })) + encre('M276,140 L322,141', 0.8, OR);
  return D.out(s);
}
const SOURCIL = [286, 148];
const capSourcil = p => { const D = Defs(`${p}S`), pref = `${p}S`; return D.out(matieres(pref) + collage(pref, [[275, 151], [281, 145], [294, 145], [293, 150], [282, 150]], '#8A8478', chaud(212, { amp: 0.5, tranche: 0.8, ombre: 0.45, dx: 1, dy: 1, bordure: '#4A4438' }))); };
const capPaupiere = p => { const D = Defs(`${p}Y`), pref = `${p}Y`; return D.out(matieres(pref) + collage(pref, [[279.6, 151], [288.6, 151], [288.4, 157.2], [279.6, 157.2]], PEAU, { seed: 213, amp: 0.2, tranche: 0, ombre: 0 }) + encre('M280,157 L288,157', 0.9, '#5A4030')); };
function capMachoire(p) {
  const D = Defs(`${p}J`), pref = `${p}J`;
  let s = matieres(pref) + collage(pref, [[276, 176], [292, 178], [306, 174], [312, 182], [308, 196], [298, 210], [290, 224], [284, 206], [276, 194], [272, 182]], '#C8C2B6', chaud(214, { amp: 0.7, tranche: 1.6, hach: 0.4, ombre: 0.45, dx: 2, dy: 3, bordure: '#5A5448' }));
  s += encre('M282,186 q2,12 6,22 M292,184 q0,14 0,26 M300,184 q-2,10 -6,20', 0.7, '#6A6458', 0.8) + encre(spirale(296, 214, 3, 1, 1.3), 0.8, '#6A6458', 0.8) + collage(pref, [[278, 177], [290, 178], [288, 181], [279, 180]], '#9A4A3A', { seed: 215, amp: 0.2, tranche: 0, ombre: 0 });
  return D.out(s);
}
function capBras(p) {
  const D = Defs(`${p}A`), pref = `${p}A`;
  let s = matieres(pref);
  s += encre('M246,196 C240,230 262,250 250,300', 1.8, NOIR) + encre('M246,196 C240,230 262,250 250,300', 0.6, '#8A8478');
  s += collage(pref, [[260, 206], [272, 222], [262, 252], [246, 250], [238, 214], [244, 194], [254, 192]], MARINE, chaud(216, { amp: 0.5, tranche: 2, hach: 0.25, dx: 3, dy: 5, bordure: '#0A0E1C' }));
  s += collage(pref, [[238, 196], [252, 194], [254, 200], [240, 202]], OR, chaud(217, { amp: 0.2, tranche: 0.8, ombre: 0.3, bordure: '#6A4A10' }));
  s += collage(pref, ovale(246, 188, 7, 6, 12), PEAU, chaud(218, { amp: 0.3, tranche: 1.2, ombre: 0.4, bordure: '#8A6A50' }));
  s += collage(pref, [[236, 160], [252, 160], [254, 186], [234, 186]], '#2A2A30', chaud(219, { amp: 0.3, tranche: 1.4, ombre: 0.5, dx: 2, dy: 3, bordure: '#4A4A54', rim: '#FFE8B0' })) + encre(Array.from({ length: 6 }, (_, k) => `M237,${164 + k * 3.8} L251,${164 + k * 3.8}`).join(' '), 0.6, '#B8C0C8', 0.8) + encre('M244,186 L246,196', 2, '#2A2A30');
  return D.out(s);
}
// la vitre qui se fend (au dernier message)
const fente = p => { const D = Defs(`${p}F`); return D.out(encre('M150,90 L132,112 L140,124 L118,150 M132,112 L112,104 M140,124 L170,138 L184,170 M150,90 L176,70', 3.6, '#5FD8F0', 0.3) + encre('M150,90 L132,112 L140,124 L118,150 M132,112 L112,104 M140,124 L170,138 L184,170 M150,90 L176,70', 1.3, PAPIER, 0.95)); };

// ce qui vit : la pluie en trois rideaux qui glissent en boucle ; des volutes claires qui se dessinent dans le ciel
function vivant() {
  let s = '';
  [[1, 0.8, 0.45], [0.7, 1.15, 0.32], [0.45, 1.7, 0.2]].forEach(([k, dur, o], j) => {
    let traits = '';
    for (let i = 0; i < Math.round(52 * k + 10); i++) { const x = hash(i, 601 + j) * 520 - 60, y = hash(i, 611 + j) * 400, l = 12 + 20 * k; traits += `M${f(x)},${f(y)} l${f(-l * 0.32)},${f(l)} `; }
    s += `<g opacity="${f(o)}"><animateTransform attributeName="transform" type="translate" from="0 -400" to="-128 0" dur="${f(dur)}s" repeatCount="indefinite"/><path d="${traits}" stroke="${FROID}" stroke-width="${f(0.6 + k)}" stroke-linecap="round"/><path d="${traits}" transform="translate(128 -400)" stroke="${FROID}" stroke-width="${f(0.6 + k)}" stroke-linecap="round"/></g>`;
  });
  for (const [x, y, r, sens, dur, beg] of [[40, 90, 9, 1, 5, 0], [150, 70, 7, -1, 6, 2], [250, 40, 8, 1, 5.5, 4], [350, 120, 7, -1, 6.5, 1], [90, 150, 6, 1, 4.8, 3], [210, 120, 6, -1, 5.2, 0.5], [330, 20, 6, 1, 6, 2.5], [20, 30, 7, -1, 5.8, 1.5]]) s += voluteVive(spirale(x, y, r, sens, 1.6), FROID, dur, beg, 1.3, 0.6);
  return s;
}

// ——— 01_pont : la partition ———
function pont01() {
  const p = 'tp', T = [4200, 5200, 5200, 3600], FIN = 18200;
  const nuages = [[0, 34, 22, 3, '#141826'], [1, 66, 18, 4, '#11141F'], [2, 164, 26, 3, '#0E111B'], [3, 198, 18, 5, '#0B0E17']];
  const mers = [[1, 214, 12, 70, NUIT.mer[0]], [2, 236, 16, 92, NUIT.mer[1]], [3, 264, 22, 116, NUIT.mer[2]], [4, 302, 28, 146, NUIT.mer[3]]];
  const plein = { marge: MARGE };
  const plans = [
    { id: 'ciel', profondeur: 0.04, ...plein, dessin: () => ciel(p) },
    ...SPIRALES.map(([x, y], i) => ({ id: `spirale${i}`, profondeur: 0.06 + i * 0.01, cadre: [x - 30, y - 30, 60, 60], pivot: [x, y], dessin: () => spiraleCiel(p, i) })),
    { id: 'lune', profondeur: 0.07, cadre: [246, 54, 108, 108], dessin: () => lune(p) },
    ...nuages.slice(0, 2).map(([i, y, h, b, c]) => ({ id: `nuage${i}`, profondeur: 0.1 + i * 0.04, cadre: [-120, y - h - 14, 640, h + 48], dessin: () => nuage(p, i, y, h, b, c) })),
    { id: 'foudre', profondeur: 0.1, cadre: [52, -30, 90, 256], pivot: [104, -14], dessin: () => foudre(p) },
    ...nuages.slice(2).map(([i, y, h, b, c]) => ({ id: `nuage${i}`, profondeur: 0.1 + i * 0.04, cadre: [-120, y - h - 14, 640, h + 48], dessin: () => nuage(p, i, y, h, b, c) })),
    { id: 'brume1', profondeur: 0.15, ...plein, flou: 0.15, dessin: () => brume(p, 'b1', 150, 300, '#3A4E72', 0.45) },
    { id: 'lame', profondeur: 0.3, cadre: [-100, -14, 600, 364], pivot: [300, 300], dessin: () => lame(p) },
    ...mers.slice(0, 2).map(([i, y, a, per, c]) => ({ id: `mer${i}`, profondeur: 0.3 + i * 0.1, cadre: [-90, y - a - 24, 580, 270], pivot: [200, y + 40], dessin: () => rouleau(p, i, y, a, per, c) })),
    { id: 'brume2', profondeur: 0.45, ...plein, flou: 0.15, dessin: () => brume(p, 'b2', 190, 300, '#2E4466', 0.35) },
    { id: 'navire', profondeur: 0.6, cadre: [36, 92, 344, 190], ...NAV, dessin: () => navire(p) },
    ...[0, 1, 2, 3].map(i => ({ id: `fumee${i}`, dans: 'navire', derriere: true, cadre: [140, 50, 100, 80], pivot: CHEMINEE, dessin: () => fumee(p, i) })),
    { id: 'guirlande', dans: 'navire', cadre: [56, 96, 306, 122], dessin: () => guirlande(p) },
    { id: 'fanion', dans: 'navire', cadre: [316, 92, 40, 22], pivot: FANION, dessin: () => fanion(p) },
    { id: 'canot', dans: 'navire', cadre: [120, 132, 84, 46], pivot: CANOT, dessin: () => canot(p) },
    { id: 'breche', dans: 'navire', cadre: [292, 224, 62, 44], pivot: BRECHE, dessin: () => breche(p) },
    ...PASSAGERS.flatMap(q => [
      { id: `${q.id}`, dans: 'navire', cadre: [q.x - 12, PIED - 44, 26, 48], pivot: [q.x, PIED - 11], dessin: () => passagerCorps(p, q) },
      { id: `${q.id}-jambe0`, dans: q.id, derriere: true, cadre: [q.x - 6, PIED - 14, 14, 18], pivot: [q.x - 1.4, PIED - 11], dessin: () => passagerJambe(p, q, 0) },
      { id: `${q.id}-jambe1`, dans: q.id, derriere: true, cadre: [q.x - 4, PIED - 14, 14, 18], pivot: [q.x + 1.4, PIED - 11], dessin: () => passagerJambe(p, q, 1) },
      { id: `${q.id}-bras`, dans: q.id, cadre: [q.x - 4, PIED - 28, 12, 20], pivot: [q.x + 0.5, PIED - 24], dessin: () => passagerBras(p, q) }
    ]),
    ...[0, 1].map(i => ({ id: `embrun${i}`, dans: 'navire', cadre: [324, 204, 64, 42], pivot: PROUE, dessin: () => embrun(p, i) })),
    ...mers.slice(2).map(([i, y, a, per, c]) => ({ id: `mer${i}`, profondeur: 0.3 + i * 0.12, cadre: [-90, y - a - 24, 580, 270], pivot: [200, y + 40], dessin: () => rouleau(p, i, y, a, per, c) })),
    { id: 'anime', profondeur: 0.8, dessin: () => vivant() },
    { id: 'teinte', profondeur: 0, ...plein, flou: 0.15, dessin: () => teinte(p) },
    { id: 'voile', profondeur: 0, ...plein, flou: 0.1, dessin: () => aplat(p, '#05040A') },
    { id: 'panneau', profondeur: 0, cadre: [12, 20, 378, 294], pivot: PANNEAU, dessin: () => panneau(p) },
    { id: 'fente', dans: 'panneau', cadre: [100, 60, 100, 120], dessin: () => fente(p) },
    { id: 'telegraphe', dans: 'panneau', cadre: [50, 190, 20, 40], pivot: TELEGRAPHE, dessin: () => telegraphe(p) },
    { id: 'barre', dans: 'panneau', cadre: [76, 202, 120, 120], pivot: BARRE, dessin: () => barre(p) },
    { id: 'cap', dans: 'panneau', cadre: [240, 192, 124, 116], pivot: [300, 300], dessin: () => capCorps(p) },
    { id: 'cap-tete', dans: 'cap', cadre: [250, 106, 84, 100], pivot: COU, dessin: () => capTete(p) },
    { id: 'cap-sourcil', dans: 'cap-tete', cadre: [270, 140, 30, 16], pivot: SOURCIL, dessin: () => capSourcil(p) },
    { id: 'cap-paupiere', dans: 'cap-tete', cadre: [276, 148, 16, 12], pivot: [284, 151], dessin: () => capPaupiere(p) },
    { id: 'cap-machoire', dans: 'cap-tete', cadre: [264, 168, 54, 62], pivot: MACHOIRE, dessin: () => capMachoire(p) },
    { id: 'cap-bras', dans: 'cap', cadre: [224, 150, 56, 156], pivot: EPAULE, dessin: () => capBras(p) },
    { id: 'etincelles', dans: 'cap-bras', cadre: [212, 140, 64, 64], pivot: MICRO, dessin: () => etincelles(p, MICRO) },
    { id: 'lanterne', dans: 'panneau', cadre: [182, 30, 108, 120], pivot: LANTERNE, dessin: () => lanterne(p) },
    { id: 'eclair', profondeur: 0, ...plein, flou: 0.1, dessin: () => aplat(p, '#B8E4F4') }
  ];

  // ——— les pistes, sur toute la scène ———
  const P = {};
  const force = t => (t < 4200 ? 1 : t < 14600 ? 1.4 : 2.3);
  const PANNEAU_IN = 4300, CHOC = 6500, SORT = 9500, RETOUR = 14600, CRI = 16300, CHUTE = 17000;
  // le montage : les spirales tournent en entrant, les nuages glissent depuis les côtés, la lune monte, la mer se lève,
  // le navire entre
  SPIRALES.forEach(([, , , sens], i) => { P[`spirale${i}`] = [[0, { s: 0, r: -180 * sens }], [300 + i * 160, { s: 0, r: -180 * sens, e: 'cubic-bezier(.2,.9,.3,1.3)' }], [1200 + i * 160, { s: 1, r: 0, e: 'linear' }], [FIN, { s: 1, r: sens * 300, x: (i % 2 ? 1 : -1) * 20 }]]; });
  nuages.forEach(([i]) => { const sens = i % 2 ? 1 : -1; P[`nuage${i}`] = [[0, { x: sens * 470 }], [150 + i * 200, { x: sens * 470, e: 'cubic-bezier(.2,.85,.3,1)' }], [1250 + i * 200, { x: 0 }], ...balance(1250 + i * 200, FIN, 7000 + i * 900, k => ({ x: (k % 2 ? 1 : -1) * sens * (10 + i * 5) }))]; });
  P.lune = [[0, { y: 150 }], [250, { y: 150, e: 'cubic-bezier(.2,.8,.3,1)' }], [1600, { y: 0 }]];
  mers.forEach(([i], j) => { const t0 = 400 + j * 180; P[`mer${i}`] = [[0, { y: 300 }], [t0, { y: 300, e: 'cubic-bezier(.2,.9,.3,1.05)' }], [t0 + 900, { y: 0 }], ...balance(t0 + 900, FIN, 2300 + j * 300, (k, t) => ({ x: (k % 2 ? 1 : -1) * (8 + j * 3) * force(t), r: (k % 2 ? -1 : 1) * (1.4 + j * 0.3) * force(t) }))]; });
  P.navire = [[0, { x: -470 }], [700, { x: -470, e: 'cubic-bezier(.25,.8,.35,1)' }], [2800, { x: 0 }], ...balance(2800, CHOC, 2600, k => ({ r: (k % 2 ? 1 : -1) * 2.4 * (k > 2 ? 1.3 : 1), y: k % 2 ? -3 : 3 })),
    ...secoue(CHOC, { r: 2 }, 7), ...balance(CHOC + 420, CRI, 2600, k => ({ r: 3.5 + (k % 2 ? 2.5 : -2.5), y: k % 2 ? -4 : 4 })), [CRI, { r: 3 }], [CRI + 500, { r: 11, y: 6, e: 'ease-in-out' }], ...balance(CRI + 500, FIN, 1400, k => ({ r: 11 + (k % 2 ? -3 : 3), y: 6 }))];
  // les fumées : chacune monte de la cheminée, grandit, dérive dans le vent et se défait, puis repart
  [0, 1, 2, 3].forEach(i => { const k = []; for (let t = -i * 700; t < FIN; t += 2800) { const a = Math.max(0, t); k.push([a, { x: 0, y: 0, s: 0.3, o: 0, e: 'linear' }], [a + 1, { x: 0, y: 0, s: 0.3, o: 1, e: 'ease-out' }], [t + 2800 - 1, { x: -70 - i * 10, y: -60, s: 1.7, r: (i % 2 ? 1 : -1) * 90, o: 0 }]); } P[`fumee${i}`] = k.filter(([t]) => t >= 0); });
  P.fanion = balance(0, FIN, 360, (k, t) => ({ r: (k % 2 ? 1 : -1) * 10 * force(t) }));
  [0, 1].forEach(i => { const k = [[0, { s: 0, o: 0 }]]; for (let t = 3200 + i * 650; t < FIN; t += 1300) k.push([t, { s: 0.2, o: 1, e: 'ease-out' }], [t + 360, { s: 1.1, o: 1, e: 'ease-in' }], [t + 700, { s: 1.3, o: 0 }]); P[`embrun${i}`] = k; });
  // (le canot : on le descend le long de la coque, par à-coups, il se balance au bout de ses filins)
  P.canot = [[0, { r: 0 }], ...balance(2800, SORT + 200, 2600, k => ({ r: k % 2 ? 3 : -3 })), ...[0, 1, 2, 3].flatMap(k => [[SORT + 600 + k * 700, { y: k * 11, r: k % 2 ? 4 : -4, e: 'ease-in' }], [SORT + 900 + k * 700, { y: k * 11 + 9, r: k % 2 ? -5 : 5 }]]), ...balance(SORT + 3400, FIN, 1500, k => ({ y: 42, r: k % 2 ? 6 : -5 }))];
  P.breche = [[0, { o: 0, s: 0.2 }], [CHOC, { o: 0, s: 0.2, e: 'linear' }], [CHOC + 60, { o: 1, s: 1.3, e: 'ease-out' }], [CHOC + 300, { o: 1, s: 1 }]];
  // les passagers : ils se tiennent, chancellent au choc, puis courent vers le canot ; au dernier message, ils tombent
  PASSAGERS.forEach((q, j) => {
    const course = [-40, -64, -150][j], depart = SORT + 400 + j * 250, arrivee = SORT + 3600 + j * 400;
    P[q.id] = [[0, { x: 0 }], [CHOC, { x: 0, r: 0 }], [CHOC + 120, { r: -14, x: -3 }], [CHOC + 500, { r: 6 }], [CHOC + 900, { r: 0, x: 0 }], [depart, { x: 0, r: 0 }],
      ...balance(depart, arrivee, 360, (k, t) => ({ x: course * ((t - depart) / (arrivee - depart)), y: k % 2 ? -1.2 : 0, r: -6 })), [arrivee, { x: course, r: 0 }], [CRI + 500, { x: course, r: 0 }], [CRI + 800, { x: course + 10, r: 70, y: 3 }]];
    for (const g of [0, 1]) P[`${q.id}-jambe${g}`] = [[0, { r: 0 }], [depart, { r: 0 }], ...balance(depart, arrivee, 360, k => ({ r: (k % 2 ? 1 : -1) * (g ? -32 : 32) })), [arrivee + 100, { r: 0 }], [CRI + 500, { r: 0 }], [CRI + 800, { r: g ? 40 : -20 }]];
    P[`${q.id}-bras`] = [[0, { r: 0 }], [CHOC, { r: 0 }], [CHOC + 150, { r: -110 }], [CHOC + 900, { r: -20 }], [depart, { r: -20 }], ...balance(depart, arrivee, 360, k => ({ r: k % 2 ? -50 : 30 })), [arrivee + 100, { r: -150 }], [CRI + 800, { r: -170 }]];
  });
  P.foudre = [[0, { s: 0.05, o: 0 }], ...[3000, CHOC - 200, CRI, 17800].flatMap(t => [[t - 1, { s: 0.05, o: 0, e: 'linear' }], [t, { s: 0.05, o: 1, e: 'ease-out' }], [t + 110, { s: 1, o: 1 }], [t + 320, { s: 1, o: 1, e: 'ease-in' }], [t + 600, { s: 1, o: 0 }]])];
  P.eclair = [[0, { o: 0 }], ...[[3000, 0.32], [CHOC - 200, 0.24], [CRI, 0.45], [17800, 0.36]].flatMap(([t, a]) => [[t - 1, { o: 0, e: 'linear' }], [t + 40, { o: a, e: 'linear' }], [t + 100, { o: a * 0.15, e: 'linear' }], [t + 160, { o: a * 0.6, e: 'ease-out' }], [t + 420, { o: 0 }]])];
  // la lame : cachée sous l'horizon, elle se dresse au dernier message
  P.lame = [[0, { y: 330, o: 0 }], [CHUTE - 401, { y: 330, o: 0, e: 'linear' }], [CHUTE - 400, { y: 330, o: 1, e: 'cubic-bezier(.3,0,.2,1)' }], [FIN, { y: 0, o: 1 }]];
  // le panneau du capitaine : il glisse par-dessus la scène, ressort, retombe, puis se décroche
  P.voile = [[0, { o: 0 }], [PANNEAU_IN, { o: 0 }], [PANNEAU_IN + 600, { o: 0.55 }], [SORT, { o: 0.55 }], [SORT + 500, { o: 0 }], [RETOUR, { o: 0 }], [RETOUR + 450, { o: 0.55 }], [CHUTE, { o: 0.55 }], [CHUTE + 600, { o: 0 }]];
  P.panneau = [[0, { x: 470, r: 8 }], [PANNEAU_IN, { x: 470, r: 8, e: 'cubic-bezier(.2,.9,.3,1.12)' }], [PANNEAU_IN + 700, { x: 0, r: -1.2 }], [PANNEAU_IN + 1000, { x: 0, r: 0 }], ...secoue(CHOC, { r: 0 }, 9), [SORT, { x: 0, r: 0, e: 'cubic-bezier(.6,0,.8,.4)' }], [SORT + 600, { x: -480, r: -12 }],
    [RETOUR - 1, { x: -480, r: -12, e: 'linear' }], [RETOUR, { x: 0, y: -440, r: 5, e: 'cubic-bezier(.3,1.35,.5,1)' }], [RETOUR + 550, { x: 0, y: 0, r: 0 }], ...secoue(CRI, { r: 0 }, 10, 7), [CHUTE, { y: 0, r: 0, e: 'cubic-bezier(.5,0,.9,.6)' }], [CHUTE + 700, { y: 470, r: 18 }]];
  // le capitaine : il lève le micro, parle (sa mâchoire, sa tête, son sourcil, ses paupières), encaisse le choc ; au
  // dernier message, le micro grésille, il est projeté
  const parle = (t0, t1) => { const k = []; for (let t = t0, i = 0; t < t1; i++) { const d = 110 + 90 * hash(i, 5); k.push([Math.round(t), { y: i % 2 ? 0 : 3.4 + 2 * hash(i, 6), r: i % 2 ? 0 : -3, e: 'ease-in-out' }]); t += d; } return [...k, [t1, { y: 0, r: 0 }]]; };
  P['cap-machoire'] = [[0, { y: 0 }], ...parle(PANNEAU_IN + 900, CHOC - 300), [CHOC, { y: 5, r: -6 }], [CHOC + 400, { y: 0 }], ...parle(CHOC + 700, SORT - 200), ...parle(RETOUR + 700, CRI - 500), [CRI, { y: 6, r: -8 }], [CRI + 800, { y: 7, r: -8 }]];
  P['cap-tete'] = [[0, { r: 0 }], ...balance(PANNEAU_IN + 900, CHOC - 100, 900, k => ({ r: k % 2 ? 3 : -2 })), [CHOC + 60, { r: 10, e: 'ease-out' }], [CHOC + 500, { r: -2 }], ...balance(CHOC + 700, SORT, 1000, k => ({ r: k % 2 ? 2.5 : -2 })), ...balance(RETOUR + 600, CRI - 300, 800, k => ({ r: k % 2 ? 3 : -3 })), [CRI, { r: 0 }], [CRI + 200, { r: -24 }]];
  P['cap-sourcil'] = [[0, { y: 0, r: 0 }], [PANNEAU_IN + 900, { y: 0 }], [PANNEAU_IN + 1300, { y: 1.4, r: -6 }], [CHOC, { y: 1.4, r: -6 }], [CHOC + 100, { y: -3, r: 10 }], [CHOC + 1200, { y: 1, r: -4 }], [RETOUR + 700, { y: 1.6, r: -8 }], [CRI, { y: 1.6, r: -8 }], [CRI + 100, { y: -4, r: 14 }]];
  P['cap-paupiere'] = [[0, { o: 0 }], ...[PANNEAU_IN + 1600, 7600, 8900, RETOUR + 1200].flatMap(t => [[t, { o: 0, e: 'linear' }], [t + 20, { o: 1, e: 'linear' }], [t + 140, { o: 1, e: 'linear' }], [t + 160, { o: 0 }]])];
  P['cap-bras'] = [[0, { r: 40 }], [PANNEAU_IN + 400, { r: 40, e: 'cubic-bezier(.3,1.3,.5,1)' }], [PANNEAU_IN + 1000, { r: 0 }], ...secoue(CHOC, { r: 0 }, 4), [CRI, { r: 0 }], [CRI + 250, { r: -50 }], [CRI + 700, { r: -30 }]];
  P.cap = [[0, { x: 0 }], ...secoue(CHOC, { r: 0 }, 3), [CRI + 150, { x: 0, r: 0, e: 'ease-in' }], [CRI + 600, { x: 50, y: 30, r: 26 }]];
  P.etincelles = [[0, { o: 0, s: 0.3 }], ...[CRI - 700, CRI - 420, CRI - 120, CRI + 100].flatMap((t, i) => [[t, { o: 0, s: 0.3, e: 'linear' }], [t + 30, { o: 1, s: 0.8 + 0.3 * i, r: i * 40, e: 'ease-out' }], [t + 200, { o: 0, s: 1.4 + 0.2 * i, r: i * 40 + 30 }]])];
  P.lanterne = [[0, { r: 0 }], ...balance(PANNEAU_IN, CHOC, 1600, k => ({ r: k % 2 ? 6 : -6 })), [CHOC + 100, { r: 22 }], ...balance(CHOC + 500, CRI, 1500, k => ({ r: k % 2 ? 12 : -10 })), [CRI + 100, { r: 34 }], ...balance(CRI + 600, FIN, 700, k => ({ r: k % 2 ? 28 : -26 }))];
  P.barre = [[0, { r: 0 }], ...balance(PANNEAU_IN, CHOC, 1800, k => ({ r: k % 2 ? 14 : -10 })), [CHOC + 300, { r: 70, e: 'ease-out' }], [CHOC + 1400, { r: 40 }], [CRI, { r: 40 }], [CRI + 900, { r: 330, e: 'ease-out' }]];
  P.telegraphe = [[0, { r: -50 }], [CHOC, { r: -50, e: 'ease-out' }], [CHOC + 120, { r: 55 }], [CHOC + 300, { r: 40 }], [CRI, { r: 40 }], [CRI + 100, { r: 80 }], [CRI + 300, { r: 60 }]];
  P.fente = [[0, { o: 0, s: 0.4 }], [CRI, { o: 0, s: 0.4, e: 'linear' }], [CRI + 40, { o: 1, s: 1 }]];
  // la caméra : une poussée lente, puis le pont, puis elle lève les yeux vers la lame
  const camera = [[0, { z: 1.02 }], [4200, { z: 1.05 }], ...secoue(CHOC, { z: 1.05 }, 5), [SORT + 300, { z: 1.05, x: 0, y: 0 }], [SORT + 2000, { z: 1.32, x: -36, y: 8 }], [SORT + 4600, { z: 1.32, x: -64, y: 8 }], [RETOUR + 200, { z: 1.08, x: 0, y: 0 }], ...secoue(CRI, { z: 1.08 }, 6), [CHUTE + 200, { z: 1.08, x: 0, y: 0 }], [FIN, { z: 1.02, x: 6, y: -24, r: -4 }]];
  const temps = T.map(d => ({ duree: d, camera: [], pistes: {} }));
  parTemps(T, camera, ['x', 'y', 'z', 'r']).forEach((c, n) => { temps[n].camera = c; });
  for (const [id, cles] of Object.entries(P)) parTemps(T, cles).forEach((c, n) => { temps[n].pistes[id] = c; });
  // le démontage : le navire sombre en basculant, la mer retombe, les nuages et les spirales s'envolent
  const sortie = { duree: 650, pistes: { navire: [[0, {}], [650, { y: 140, r: 22, e: 'ease-in' }]], lune: [[0, {}], [650, { y: -220 }]] } };
  mers.forEach(([i], j) => { sortie.pistes[`mer${i}`] = [[0, {}], [80 * j, { e: 'ease-in' }], [650, { y: 320 }]]; });
  nuages.forEach(([i]) => { sortie.pistes[`nuage${i}`] = [[0, {}], [650, { x: (i % 2 ? 1 : -1) * 460, e: 'ease-in' }]]; });
  SPIRALES.forEach((_, i) => { sortie.pistes[`spirale${i}`] = [[0, {}], [650, { y: -260, r: 180 }]]; });
  return { plans, partition: { temps, sortie } };
}

module.exports = { pont01, collage, gonfle, ovale, matieres, encre, parTemps, balance, secoue, halo, PAPIER, NOIR };
