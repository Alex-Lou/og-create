// La jungle de la zone de départ (choix de l'auteur, 18 oct. : « c'est censé être une jungle » ; dense autour des naufragés,
// vivante et colorée, inspirée des feuilles de ses références : émeraude, sarcelle, vert acide, violet, magenta, des fleurs
// orange et corail). Les arbres de l'île restent pour les vraies zones boisées, plus tard. Même trait et même lumière que
// les plantes de l'île (arbres.js) : contour d'encre, aplat, la moitié d'ombre de chaque feuille, sa nervure claire ; même
// cadre (le centre de la case en (0, 0), le jeu fait balancer le dessin depuis sa base).
//   le bananier : un faux tronc, de grandes feuilles en pagaie déchirées, un régime et sa fleur violette ;
//   le monstera : des feuilles en cœur percées, sur leurs tiges ;
//   la fougère arborescente : un tronc velu, des frondes en arceau ;
//   l'héliconia : des feuilles en pagaie, des fleurs en pinces de homard, rouges et jaunes ;
//   le croton : un éventail de feuilles en lanière, magenta, violettes ou corail, nervurées de clair ;
//   le caladium : des feuilles en cœur au ras du sol, roses bordées de vert ;
//   le fromager : le grand arbre de la jungle, ses contreforts, son houppier sarcelle, ses lianes et leurs orchidées.
const { OUT, E, r2 } = require('./troupe');

const W = 1.1;
const pts = a => a.map(([x, y]) => `${r2(x)},${r2(y)}`).join(' L');
const qPt = (a, c, b, t) => [0, 1].map(j => (1 - t) * (1 - t) * a[j] + 2 * (1 - t) * t * c[j] + t * t * b[j]);
const qTan = (a, c, b, t) => [0, 1].map(j => 2 * (1 - t) * (c[j] - a[j]) + 2 * t * (b[j] - c[j]));
const ombre = (rx, ry = rx * 0.42, dx = 3) => E(dx, 1.5, rx, ry, 'rgba(30,60,30,0.24)', 0);

// ——— les lueurs de la nuit (choix de l'auteur, 18 oct. : les couleurs néon de ses références le soir et la nuit, moins le
// jour) : chaque plante a, en plus de son dessin, sa couche de lueurs (ses nervures, ses fleurs, ses bords qui luisent),
// que le jeu allume à mesure que la nuit tombe, par-dessus l'obscurité. Pendant un dessin, les feuilles y versent leurs
// nervures (lueurDe rend cette couche, seule)
let LUEURS = null;
const luit = (d, c, w = 1) => { if (LUEURS) LUEURS.push(`<path d="${d}" fill="none" stroke="${c}" stroke-width="${r2(w * 4)}" stroke-opacity="0.18" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${c}" stroke-width="${r2(w)}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#FFFFFF" stroke-width="${r2(w * 0.35)}" stroke-opacity="0.8" stroke-linecap="round"/>`); };
const point = (x, y, r, c) => { if (LUEURS) LUEURS.push(`<circle cx="${r2(x)}" cy="${r2(y)}" r="${r2(r * 3)}" fill="${c}" opacity="0.2"/><circle cx="${r2(x)}" cy="${r2(y)}" r="${r2(r)}" fill="${c}"/><circle cx="${r2(x)}" cy="${r2(y)}" r="${r2(r * 0.4)}" fill="#FFFFFF"/>`); };
function lueurDe(dessin) { LUEURS = []; dessin(); const s = LUEURS.join(''); LUEURS = null; return s; }
const NEON = { emeraude: '#5CF2E6', sarcelle: '#5CF2E6', profond: '#3EC8E8', acide: '#D4FF7A', violet: '#C88AFF', magenta: '#FF6AD0', corail: '#FFA040', rose: '#FF8AD0' };
const neonDe = c => NEON[Object.keys(T).find(k => T[k] === c)] || '#5CF2E6';

// les teintes : [clair, moyen, sombre]
const T = {
  emeraude: { light: '#B8FFB0', mid: '#22D47A', dark: '#0E7A5A' },
  sarcelle: { light: '#9CFFF0', mid: '#12BFB4', dark: '#076A78' },
  acide: { light: '#F0FF9A', mid: '#A6EE2E', dark: '#3E9E3A' },
  profond: { light: '#7FE8B8', mid: '#139A72', dark: '#08504A' },
  violet: { light: '#EAC8FF', mid: '#9A4AF0', dark: '#4A1C9A' },
  magenta: { light: '#FFC4EC', mid: '#F2389E', dark: '#9A1468' },
  corail: { light: '#FFD4C0', mid: '#FF5A48', dark: '#C02A3A' },
  rose: { light: '#FFF0FA', mid: '#FF90D2', dark: '#D84090' }
};
const BOIS = { left: '#9C6A43', right: '#6E4528', light: '#C08A58', bark: '#4E2E1A' };

// ——— une feuille allongée : de la base b à la pointe p, courbée (fleche : vers le haut), de largeur w ; déchirée (entailles
// au bord) ; ses nervures latérales ———
function feuille(id, b, p, w, c, { fleche = 0.28, dechire = 0, nervures = 7, maigre = 0.75 } = {}) {
  const L = Math.hypot(p[0] - b[0], p[1] - b[1]) || 1, m = [(b[0] + p[0]) / 2, (b[1] + p[1]) / 2];
  let nx = -(p[1] - b[1]) / L, ny = (p[0] - b[0]) / L;
  if (ny > 0) { nx = -nx; ny = -ny; }
  const ctl = [m[0] + nx * fleche * L, m[1] + ny * fleche * L], N = 18, axe = [], haut = [], bas = [];
  for (let i = 0; i <= N; i++) {
    const t = i / N, q = qPt(b, ctl, p, t), d = qTan(b, ctl, p, t), l = Math.hypot(d[0], d[1]) || 1;
    let ux = -d[1] / l, uy = d[0] / l;
    if (uy > 0) { ux = -ux; uy = -uy; }
    const ww = w * Math.pow(Math.sin(Math.PI * Math.min(1, t * 1.04)), maigre) + 0.3;
    const cran = dechire && i > 2 && i < N - 1 && i % 3 === 1 ? 1 - dechire : 1;
    axe.push(q); haut.push([q[0] + ux * ww * cran, q[1] + uy * ww * cran]); bas.push([q[0] - ux * ww * (i % 3 === 2 && dechire ? 1 - dechire : 1), q[1] - uy * ww * (i % 3 === 2 && dechire ? 1 - dechire : 1)]);
  }
  const d = `M${pts(haut.concat(bas.slice().reverse()))} Z`;
  let s = `<path d="${d}" fill="${c.mid}" stroke="${OUT}" stroke-width="${W}" stroke-linejoin="round"/>`;
  s += `<defs><clipPath id="${id}"><path d="${d}"/></clipPath></defs><g clip-path="url(#${id})"><path d="M${pts(axe.concat(bas.slice().reverse()))} Z" fill="${c.dark}"/>`;
  for (let k = 1; k <= nervures; k++) { const i = Math.round((k / (nervures + 1)) * N), q = axe[i], h = haut[Math.min(N, i + 1)], o = bas[Math.min(N, i + 1)]; s += `<path d="M${r2(q[0])},${r2(q[1])} L${r2(h[0])},${r2(h[1])} M${r2(q[0])},${r2(q[1])} L${r2(o[0])},${r2(o[1])}" stroke="${c.light}" stroke-width="0.5" opacity="0.55" fill="none"/>`; }
  s += `<path d="M${r2(b[0])},${r2(b[1])} Q${r2(ctl[0])},${r2(ctl[1])} ${r2(p[0])},${r2(p[1])}" stroke="${c.light}" stroke-width="1" fill="none" stroke-linecap="round"/></g>`;
  luit(`M${r2(b[0])},${r2(b[1])} Q${r2(ctl[0])},${r2(ctl[1])} ${r2(p[0])},${r2(p[1])}`, neonDe(c), 0.9);
  for (let k = 2; k <= nervures; k += 2) { const i = Math.round((k / (nervures + 1)) * N), q = axe[i], h = haut[Math.min(N, i + 1)]; luit(`M${r2(q[0])},${r2(q[1])} L${r2(h[0])},${r2(h[1])}`, neonDe(c), 0.45); }
  return s;
}
// une feuille en cœur (monstera, caladium) : centrée en (x, y), de taille s, tournée de a ; percée (monstera) ; c2 : la
// couleur de son cœur (caladium)
function coeur(id, x, y, s, a, c, { percee = false, c2 = null } = {}) {
  const P = [];
  for (let i = 0; i <= 40; i++) { const t = (i / 40) * Math.PI * 2; P.push([16 * Math.sin(t) ** 3, -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))]); }
  const ca = Math.cos(a), sa = Math.sin(a), k = s / 17;
  const tr = ([u, v]) => [x + (u * ca - v * sa) * k, y + (u * sa + v * ca) * k];
  const d = `M${pts(P.map(tr))} Z`;
  let o = `<path d="${d}" fill="${c.mid}" stroke="${OUT}" stroke-width="${W}" stroke-linejoin="round"/><defs><clipPath id="${id}"><path d="${d}"/></clipPath></defs><g clip-path="url(#${id})">`;
  if (c2) o += `<path d="M${pts(P.map(([u, v]) => tr([u * 0.62, v * 0.62 + 2])))} Z" fill="${c2.mid}"/>`;
  o += `<path d="M${pts([[0, -9], [0, 16], [18, 16], [18, -9]].map(tr))} Z" fill="${c2 ? c2.dark : c.dark}" opacity="0.55"/>`;
  // (la nervure, et les nervures en éventail)
  o += [[-11, 4], [-12, -4], [-7, 11], [11, 4], [12, -4], [7, 11]].map(([u, v]) => { const [a1, b1] = tr([0, -4]), [a2, b2] = tr([u, v]); return `<path d="M${r2(a1)},${r2(b1)} L${r2(a2)},${r2(b2)}" stroke="${(c2 || c).light}" stroke-width="0.55" opacity="0.7"/>`; }).join('');
  if (percee) o += [[-10, 1, -14, -2], [-9, 7, -12, 6], [10, 1, 14, -2], [9, 7, 12, 6], [-6, -5, -9, -9], [6, -5, 9, -9]].map(([u1, v1, u2, v2]) => { const [a1, b1] = tr([u1, v1]), [a2, b2] = tr([u2, v2]); return `<path d="M${r2(a1)},${r2(b1)} L${r2(a2)},${r2(b2)}" stroke="${OUT}" stroke-width="${r2(1.6 * k * 2)}" stroke-linecap="round"/>`; }).join('');
  const [n1, m1] = tr([0, -5]), [n2, m2] = tr([0, 14]);
  luit(`M${r2(n1)},${r2(m1)} L${r2(n2)},${r2(m2)}`, c2 ? neonDe(c2) : neonDe(c), 0.8);
  for (const [u, v] of [[-11, 4], [11, 4], [-7, 11], [7, 11]]) { const [a1, b1] = tr([0, -4]), [a2, b2] = tr([u, v]); luit(`M${r2(a1)},${r2(b1)} L${r2(a2)},${r2(b2)}`, c2 ? neonDe(c2) : neonDe(c), 0.4); }
  return o + `<path d="M${r2(n1)},${r2(m1)} L${r2(n2)},${r2(m2)}" stroke="${(c2 || c).light}" stroke-width="0.9"/></g>`;
}
// (l'angle d'une feuille en cœur dont la pointe s'éloigne du point (cx, cy) : la tige y est attachée)
const versDehors = (x, y, cx, cy) => Math.atan2(y - cy, x - cx) - Math.PI / 2;
const tige = (a, b, c = '#4E8A3A', w = 1.6) => `<path d="M${r2(a[0])},${r2(a[1])} Q${r2((a[0] + b[0]) / 2 + 4)},${r2((a[1] + b[1]) / 2)} ${r2(b[0])},${r2(b[1])}" stroke="${OUT}" stroke-width="${r2(w + 2 * W)}" fill="none" stroke-linecap="round"/><path d="M${r2(a[0])},${r2(a[1])} Q${r2((a[0] + b[0]) / 2 + 4)},${r2((a[1] + b[1]) / 2)} ${r2(b[0])},${r2(b[1])}" stroke="${c}" stroke-width="${r2(w)}" fill="none" stroke-linecap="round"/>`;

// ——— le bananier ———
// [angle (degrés, 0 = à droite, vers le haut négatif), longueur, devant ?]
const BANANES = [[-140, 44, 0], [-40, 46, 0], [-100, 40, 0], [-78, 42, 0], [-162, 42, 1], [-18, 44, 1], [-120, 36, 1], [-58, 38, 1]];
function bananier({ teinte = 'acide', petit = false, regime = true } = {}) {
  const k = petit ? 0.74 : 1, c = T[teinte], h = 52 * k, id = `ban${teinte[0]}${petit ? 'p' : 'g'}${regime ? 'r' : ''}`;
  const tronc = `M${r2(-4 * k)},1 Q${r2(-5 * k)},${r2(-h * 0.5)} ${r2(-2.4 * k)},${r2(-h)} L${r2(2.4 * k)},${r2(-h)} Q${r2(5 * k)},${r2(-h * 0.5)} ${r2(4.4 * k)},1 Z`;
  let s = ombre(20 * k) + `<path d="${tronc}" fill="#8AB85A" stroke="${OUT}" stroke-width="${W}"/>` + [0.25, 0.5, 0.72].map(t => `<path d="M${r2(-4.6 * k)},${r2(-h * t)} q${r2(4.6 * k)},${r2(2 * k)} ${r2(9.2 * k)},0" stroke="#5E8A3A" stroke-width="0.8" fill="none"/>`).join('');
  const top = [0, -h];
  const une = ([a, l, devant], i) => { const r = (a * Math.PI) / 180, L = l * k; return feuille(`${id}f${i}`, top, [top[0] + Math.cos(r) * L, top[1] + Math.sin(r) * L * 0.55 + L * 0.12], 7.5 * k, devant ? c : T.emeraude, { fleche: 0.22, dechire: i % 3 === 0 ? 0.55 : 0, nervures: 8, maigre: 0.55 }); };
  s += BANANES.filter(([, , d]) => !d).map(une).join('');
  if (regime) s += [0, 1, 2, 3].map(j => E(5 * k + (j % 2) * 3 * k, -h + 10 * k + j * 3.4 * k, 2.6 * k, 1.5 * k, '#C8E060', 0.9)).join('') + E(6.5 * k, -h + 25 * k, 2.6 * k, 4 * k, '#8A2E78', W) + E(6 * k, -h + 24 * k, 1, 1.6 * k, '#C860A8', 0);
  s += BANANES.filter(([, , d]) => d).map((b, i) => une(b, i + 4)).join('');
  return s;
}

// ——— le monstera ———
const MONSTERA = [[-14, -22, 13, -0.5, 0], [13, -24, 13, 0.45, 0], [0, -34, 14, 0.05, 0], [-20, -10, 11, -1.1, 1], [19, -11, 11, 1.1, 1], [-3, -16, 12, -0.15, 1]];
function monstera({ teinte = 'emeraude', petit = false } = {}) {
  const k = petit ? 0.75 : 1, c = T[teinte], id = `mon${teinte[0]}${petit ? 'p' : 'g'}`;
  let s = ombre(22 * k);
  const une = ([x, y, t], i) => tige([0, 0], [x * k * 0.7, y * k * 0.7], '#3E7A34', 1.4) + coeur(`${id}${i}`, x * k, y * k, t * k, versDehors(x, y, 0, 6), i % 2 ? c : T.profond, { percee: true });
  s += MONSTERA.filter(m => !m[4]).map(une).join('') + MONSTERA.filter(m => m[4]).map((m, i) => une(m, i + 3)).join('');
  return s;
}

// ——— la fougère arborescente ———
function fronde(id, o, a, l, c, k) {
  const r = (a * Math.PI) / 180, b = [o[0] + Math.cos(r) * l * k, o[1] + Math.sin(r) * l * k + l * k * 0.45], ctl = [o[0] + Math.cos(r) * l * k * 0.55, o[1] + Math.sin(r) * l * k * 0.55 - l * k * 0.18];
  let s = `<path d="M${r2(o[0])},${r2(o[1])} Q${r2(ctl[0])},${r2(ctl[1])} ${r2(b[0])},${r2(b[1])}" stroke="${OUT}" stroke-width="${r2(1.4 + 2 * W)}" fill="none" stroke-linecap="round"/>`;
  // (ses folioles, des deux côtés de la nervure, de plus en plus courtes)
  for (let i = 1; i <= 11; i++) {
    const t = i / 12, q = qPt(o, ctl, b, t), d = qTan(o, ctl, b, t), L = Math.hypot(d[0], d[1]) || 1, ux = -d[1] / L, uy = d[0] / L, f = (1 - t * 0.7) * 7 * k;
    for (const sg of [1, -1]) s += `<path d="M${r2(q[0])},${r2(q[1])} q${r2(sg * ux * f * 0.5 + d[0] / L * 2)},${r2(sg * uy * f * 0.5 + d[1] / L * 2)} ${r2(sg * ux * f + d[0] / L * 2.5)},${r2(sg * uy * f + d[1] / L * 2.5 + 1.5)}" stroke="${OUT}" stroke-width="${r2(2.6 * k + 1.4)}" stroke-linecap="round" fill="none"/>`;
  }
  for (let i = 1; i <= 11; i++) {
    const t = i / 12, q = qPt(o, ctl, b, t), d = qTan(o, ctl, b, t), L = Math.hypot(d[0], d[1]) || 1, ux = -d[1] / L, uy = d[0] / L, f = (1 - t * 0.7) * 7 * k;
    for (const sg of [1, -1]) s += `<path d="M${r2(q[0])},${r2(q[1])} q${r2(sg * ux * f * 0.5 + d[0] / L * 2)},${r2(sg * uy * f * 0.5 + d[1] / L * 2)} ${r2(sg * ux * f + d[0] / L * 2.5)},${r2(sg * uy * f + d[1] / L * 2.5 + 1.5)}" stroke="${sg > 0 ? c.mid : c.dark}" stroke-width="${r2(2.6 * k)}" stroke-linecap="round" fill="none"/>`;
  }
  luit(`M${r2(o[0])},${r2(o[1])} Q${r2(ctl[0])},${r2(ctl[1])} ${r2(b[0])},${r2(b[1])}`, neonDe(c), 0.8);
  return s + `<path d="M${r2(o[0])},${r2(o[1])} Q${r2(ctl[0])},${r2(ctl[1])} ${r2(b[0])},${r2(b[1])}" stroke="${c.light}" stroke-width="1.2" fill="none" stroke-linecap="round"/>`;
}
const FRONDES = [[-160, 38, 0], [-20, 38, 0], [-120, 32, 0], [-60, 32, 0], [-90, 26, 0], [-175, 34, 1], [-5, 34, 1], [-140, 30, 1], [-40, 30, 1]];
function fougere({ teinte = 'emeraude', petit = false } = {}) {
  const k = petit ? 0.75 : 1, c = T[teinte], h = 50 * k, id = `fou${teinte[0]}${petit ? 'p' : 'g'}`;
  const tronc = `M${r2(-4.5 * k)},1 Q${r2(-3 * k)},${r2(-h * 0.5)} ${r2(-3.4 * k)},${r2(-h)} L${r2(3.4 * k)},${r2(-h)} Q${r2(3 * k)},${r2(-h * 0.5)} ${r2(4.8 * k)},1 Z`;
  let s = ombre(20 * k) + `<path d="${tronc}" fill="${BOIS.left}" stroke="${OUT}" stroke-width="${W}"/>` + Array.from({ length: 9 }, (_, i) => `<path d="M${r2(-3.5 * k)},${r2(-h * (i + 0.6) / 9.5)} q${r2(3.5 * k)},${r2(2.4 * k)} ${r2(7 * k)},0" stroke="${BOIS.bark}" stroke-width="0.9" fill="none"/>`).join('');
  const o = [0, -h];
  s += FRONDES.filter(f => !f[2]).map(([a, l], i) => fronde(`${id}${i}`, o, a, l, T.profond, k)).join('') + FRONDES.filter(f => f[2]).map(([a, l], i) => fronde(`${id}d${i}`, o, a, l, c, k)).join('');
  return s + E(0, -h, 3.4 * k, 2.4 * k, c.dark, W) + `<path d="M${r2(-1.4 * k)},${r2(-h - 1)} q1.4,-3 0,-5 M${r2(1.6 * k)},${r2(-h - 1)} q-1.2,-3 0.4,-5" stroke="${c.light}" stroke-width="1.2" fill="none" stroke-linecap="round"/>`;
}

// ——— l'héliconia ———
function pince(x, y, s, c1, c2, sens) { point(x + sens * 4 * s, y - 0.6 * s, 0.9 * s, c1 === '#E8323A' ? '#FF5A6A' : '#FFA040'); return `<path d="M${r2(x)},${r2(y)} l${r2(sens * 7 * s)},${r2(-2 * s)} l${r2(-sens * 2 * s)},${r2(4 * s)} Z" fill="${c1}" stroke="${OUT}" stroke-width="${W}" stroke-linejoin="round"/><path d="M${r2(x + sens * 4.6 * s)},${r2(y - 1.4 * s)} l${r2(sens * 2.4 * s)},${r2(-0.6 * s)}" stroke="${c2}" stroke-width="1.4" stroke-linecap="round"/>`; }
function heliconia({ fleur = 'rouge', petit = false } = {}) {
  const k = petit ? 0.75 : 1, id = `hel${fleur[0]}${petit ? 'p' : 'g'}`, [c1, c2] = fleur === 'rouge' ? ['#E8323A', '#FFD84A'] : ['#FF8A30', '#FFF06A'];
  let s = ombre(18 * k);
  const F = [[-12, -50, 0], [14, -54, 0], [-24, -34, 1], [24, -36, 1], [3, -58, 1]];
  s += F.filter(f => !f[2]).map(([x, y], i) => tige([0, 0], [x * k * 0.4, y * k * 0.45], '#3E7A34', 1.3) + feuille(`${id}a${i}`, [x * k * 0.4, y * k * 0.45], [x * k, y * k], 6.5 * k, T.profond, { fleche: 0.1, nervures: 6, maigre: 0.6 })).join('');
  // (deux hampes de fleurs : des bractées en zigzag)
  for (const [hx, hh, sg] of [[-4, 46, 1], [6, 38, -1]]) { s += tige([0, 0], [hx * k, -hh * k], '#5E8A3A', 1.2); for (let j = 0; j < 5; j++) s += pince(hx * k, (-hh + 7 + j * 6.5) * k, 1.6 * k * (1 - j * 0.08), c1, c2, j % 2 ? sg : -sg); }
  s += F.filter(f => f[2]).map(([x, y], i) => tige([0, 0], [x * k * 0.4, y * k * 0.45], '#3E7A34', 1.3) + feuille(`${id}b${i}`, [x * k * 0.4, y * k * 0.45], [x * k, y * k], 6.5 * k, T.emeraude, { fleche: 0.12, nervures: 6, maigre: 0.6 })).join('');
  return s;
}

// ——— le croton ———
function croton({ teinte = 'magenta', petit = false } = {}) {
  const k = petit ? 0.75 : 1, c = T[teinte], id = `cro${teinte[0]}${petit ? 'p' : 'g'}`;
  let s = ombre(16 * k);
  const A = [-160, -130, -100, -75, -50, -20, -145, -115, -88, -62, -35];
  A.forEach((a, i) => { const r = (a * Math.PI) / 180, L = (i < 6 ? 24 : 20) * k, b = [Math.cos(r) * 3 * k, -4 * k + Math.sin(r) * 3 * k]; s += feuille(`${id}${i}`, b, [b[0] + Math.cos(r) * L, b[1] + Math.sin(r) * L + 4 * k], 3.6 * k, i < 6 ? T.violet : c, { fleche: 0.18, nervures: 5, maigre: 0.7 }); });
  return s;
}

// ——— le caladium ———
function caladium({ teinte = 'rose' } = {}) {
  const id = `cal${teinte[0]}`;
  let s = ombre(14);
  [[-9, -10, 8], [9, -11, 8], [0, -15, 9], [-5, -6, 7], [6, -5, 7]].forEach(([x, y, t], i) => { s += tige([0, 0], [x * 0.6, y * 0.6], '#C0507E', 1.1) + coeur(`${id}${i}`, x, y, t, versDehors(x, y, 0, 4), T.emeraude, { c2: T[teinte] }); });
  return s;
}

// ——— le fromager : le grand arbre de la jungle ———
const rond = (x, y, r, fill) => `<circle cx="${r2(x)}" cy="${r2(y)}" r="${r2(r)}" fill="${fill}"/>`;
function houppier(id, lobes, c) {
  const contour = lobes.map(([x, y, r]) => rond(x, y, r + W, OUT)).join('');
  const zone = `<clipPath id="${id}">${lobes.map(([x, y, r]) => rond(x, y, r, '#000')).join('')}</clipPath>`;
  return contour + `<defs>${zone}</defs><g clip-path="url(#${id})">${lobes.map(([x, y, r]) => rond(x, y, r, c.dark)).join('')}${lobes.map(([x, y, r]) => rond(x - r * 0.18, y - r * 0.22, r * 0.86, c.mid)).join('')}${lobes.map(([x, y, r]) => rond(x - r * 0.35, y - r * 0.42, r * 0.38, c.light)).join('')}</g>`;
}
function fromager({ teinte = 'sarcelle', lianes = true } = {}) {
  const c = T[teinte], id = `fro${teinte[0]}${lianes ? 'l' : ''}`;
  let s = ombre(30, 12);
  // (le tronc et ses contreforts)
  const tronc = 'M-18,2 Q-10,-2 -7,-8 Q-6,-30 -5,-52 L5,-52 Q6,-30 7,-8 Q10,-2 19,2 Q12,4 8,1 Q4,4 0,2 Q-4,4 -8,1 Q-12,4 -18,2 Z';
  s += `<path d="${tronc}" fill="${BOIS.left}" stroke="${OUT}" stroke-width="${W}" stroke-linejoin="round"/><defs><clipPath id="${id}t"><path d="${tronc}"/></clipPath></defs><g clip-path="url(#${id}t)"><path d="M1,4 Q3,-30 2,-56 L24,-56 L24,4 Z" fill="${BOIS.right}"/><path d="M-3,-10 Q-2,-25 -3,-40 M3,-14 Q4,-28 3,-44" stroke="${BOIS.bark}" stroke-width="0.8" fill="none"/></g>`;
  s += houppier(`${id}f`, [[-26, -66, 15], [26, -66, 15], [0, -82, 17], [-14, -86, 13], [14, -88, 13]], T.profond);
  s += houppier(`${id}d`, [[-30, -56, 13], [30, -55, 13], [-12, -62, 15], [13, -62, 15], [0, -72, 14]], c);
  // (la nuit, des points de lumière dans le houppier : des fleurs, des lucioles posées)
  [[-24, -70], [20, -74], [-6, -84], [8, -60], [-30, -52], [28, -50], [0, -70]].forEach(([x, y], i) => point(x, y, 1.1, i % 3 ? '#5CF2E6' : '#FF6AD0'));
  if (lianes) {
    for (const [x, y, l] of [[-34, -50, 30], [-18, -50, 24], [24, -48, 34], [36, -50, 22]]) {
      s += `<path d="M${x},${y} q2,${l * 0.5} -1,${l}" stroke="${OUT}" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M${x},${y} q2,${l * 0.5} -1,${l}" stroke="#5E9A3A" stroke-width="1.4" fill="none" stroke-linecap="round"/>`;
      for (let j = 1; j < 4; j++) s += E(x + (j % 2 ? 2 : -1.4), y + (l * j) / 4, 2.2, 1.3, j % 2 ? T.acide.mid : T.emeraude.mid, 0.8);
      s += E(x - 0.6, y + l, 2.4, 2.4, T.rose.mid, W) + E(x - 0.6, y + l, 0.9, 0.9, '#FFE070', 0);
      luit(`M${x},${y} q2,${l * 0.5} -1,${l}`, '#D4FF7A', 0.6); point(x - 0.6, y + l, 1.4, '#FF6AD0');
    }
  }
  return s;
}

// [fichier, libellé, id du décor du jeu, dessin]
const JUNGLE = [
  ...['acide', 'emeraude'].flatMap(t => [false, true].map(p => [`bananier${t === 'emeraude' ? '_emeraude' : ''}${p ? '_petit' : ''}`, `Bananier (${p ? 'petit' : 'grand'}, ${t})`, 'banana', () => bananier({ teinte: t, petit: p })])),
  ...['emeraude', 'sarcelle'].flatMap(t => [false, true].map(p => [`monstera${t === 'sarcelle' ? '_sarcelle' : ''}${p ? '_petit' : ''}`, `Monstera (${p ? 'petit' : 'grand'}, ${t})`, 'monstera', () => monstera({ teinte: t, petit: p })])),
  ...['emeraude', 'acide'].flatMap(t => [false, true].map(p => [`fougere${t === 'acide' ? '_acide' : ''}${p ? '_petite' : ''}`, `Fougère arborescente (${p ? 'petite' : 'grande'}, ${t})`, 'treefern', () => fougere({ teinte: t, petit: p })])),
  ...['rouge', 'orange'].flatMap(f => [false, true].map(p => [`heliconia${f === 'orange' ? '_orange' : ''}${p ? '_petit' : ''}`, `Héliconia (${p ? 'petit' : 'grand'}, fleurs ${f}s)`, 'heliconia', () => heliconia({ fleur: f, petit: p })])),
  ...['magenta', 'corail', 'violet'].map(t => [`croton${t === 'magenta' ? '' : `_${t}`}`, `Croton (${t})`, 'croton', () => croton({ teinte: t })]),
  ...['rose', 'magenta'].map(t => [`caladium${t === 'rose' ? '' : `_${t}`}`, `Caladium (${t})`, 'caladium', () => caladium({ teinte: t })]),
  ...['sarcelle', 'emeraude'].flatMap(t => [true, false].map(l => [`fromager${t === 'emeraude' ? '_emeraude' : ''}${l ? '' : '_nu'}`, `Fromager (${t}${l ? ', lianes et orchidées' : ''})`, 'kapok', () => fromager({ teinte: t, lianes: l })]))
];

// les lueurs de nuit de chaque plante : sa couche lumineuse, seule (« bananier_nuit » ; le jeu ne les tire pas comme
// variantes : world/plants.js)
const JUNGLE_NUIT = JUNGLE.map(([fichier, libelle, decor, dessin]) => [`${fichier}_nuit`, `${libelle}, ses lueurs de nuit`, decor, () => lueurDe(dessin)]);

module.exports = { JUNGLE, JUNGLE_NUIT, lueurDe, bananier, monstera, fougere, heliconia, croton, caladium, fromager };
