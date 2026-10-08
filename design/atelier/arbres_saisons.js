// Les arbres de saison : trois essences par saison, chacune en trois tailles (grand, moyen, petit) et deux teintes.
// Printemps : cerisier en fleurs, magnolia, saule tendre. Été : chêne touffu, tilleul, pin parasol. Automne : érable
// rouge, ginkgo doré, chêne roux. Hiver : bouleau nu, houx, sapin givré.
// Même trait et même lumière que les arbres refaits (arbres.js) : touffes détourées, ombre en bas à droite, reflet en
// haut à gauche. Cadre et ancrage des plantes de deco.js (PROP, centre de la case en (0, 0)).
// SAISONS range chaque arbre dans sa saison (avec les arbres de saison qui existaient déjà) : le jeu ne pioche que
// dans la saison en cours, rien ne se mélange.
const { OUT, E, r2 } = require('./troupe');
const { feuillage: touffe, fleurette, herbe, congere, feuilleMorte, tronc, troncBouleau, troncSapin, etage, ETAGES, pied, petale, pommeDePin, BOIS, W,
  ARBRES_SAISONS, AUTOMNES, SAPINS } = require('./arbres');

const TAILLES = { grand: 1, moyen: 0.88, petit: 0.76 };
const rond = (x, y, r, fill) => `<circle cx="${r2(x)}" cy="${r2(y)}" r="${r2(r)}" fill="${fill}"/>`;
const ombre = (k, rx, ry, hiver) => E(2 * k, 1.5, rx * k, ry * k, hiver ? 'rgba(60,80,110,0.22)' : 'rgba(40,55,20,0.22)', 0);
// deux teintes : devant (touffes de devant) et fond (touffe du fond, plus froide et plus sombre)
const T = (dl, dm, dd, fl, fm, fd) => ({ devant: { light: dl, mid: dm, dark: dd }, fond: { light: fl, mid: fm, dark: fd } });

// Des rameaux nus : segments en gélule, du plus épais au plus fin ; contour d'abord, puis le bois, puis l'ombre à
// droite ; neige : un liseré blanc sur le dessus des plus gros
function rameaux(liste, c, k, neige = false) {
  const segs = [];
  liste.forEach(([p, w0]) => { for (let i = 0; i < p.length - 1; i++) segs.push([p[i], p[i + 1], w0 * (1 - i / p.length * 0.7)]); });
  const seg = (a, b, w, col, dx = 0, dy = 0) => `<path d="M${r2(a[0] * k + dx)},${r2(a[1] * k + dy)} L${r2(b[0] * k + dx)},${r2(b[1] * k + dy)}" stroke="${col}" stroke-width="${r2(w)}" stroke-linecap="round"/>`;
  return segs.map(([a, b, w]) => seg(a, b, w * k + W * 2, OUT)).join('') + segs.map(([a, b, w]) => seg(a, b, w * k, c.left)).join('')
    + segs.map(([a, b, w]) => seg(a, b, w * k * 0.4, c.right, w * k * 0.22)).join('')
    + (neige ? segs.filter(s => s[2] > 1.4).map(([a, b, w]) => seg(a, b, w * k * 0.5, '#FFFFFF', 0, -w * k * 0.32)).join('') : '');
}

// ——— Printemps ———

// Le cerisier en fleurs : houppier large et un peu plat, tout en fleurs ; fleurettes de l'autre teinte, pétales au sol
const CERISIER = {
  rose: T('#FFE6EE', '#F9B8CC', '#E0849F', '#F6C7D6', '#E89AB2', '#C06A87'),
  blanc: T('#FFFFFF', '#F6EEF0', '#D9C3CB', '#EEDDE3', '#DCC4CC', '#B89AA6')
};
const C_FOND = [[-16, -72, 11], [0, -78, 12.5], [17, -71, 11], [-30, -62, 9], [31, -60, 9]];
const C_GAUCHE = [[-24, -54, 11], [-36, -50, 7.5], [-29, -42, 7, 0], [-15, -44, 7.5, 0]];
const C_DROITE = [[22, -53, 11], [35, -49, 7.5], [27, -41, 7, 0], [13, -45, 7.5, 0]];
const C_MILIEU = [[-2, -61, 11], [-8, -50, 7, 0], [6, -51, 7.5, 0]];
const C_FLEURS = [[-28, -55], [-12, -66], [4, -72], [20, -60], [30, -51], [-20, -46], [10, -52], [-4, -82], [24, -73]];
const C_SOL = [[-17, 4.5, 30], [-12, 7, -40], [9, 6, 70], [14, 3.5, -20], [19, 6.5, 50], [-21, 2.5, 80], [2, 8, 10]];
function cerisier({ teinte = 'rose', k = 1, id }) {
  const c = CERISIER[teinte], autre = teinte === 'rose' ? '#FFFFFF' : '#F7B6C8';
  return ombre(k, 30, 12) + tronc(`${id}t`, k)
    + touffe(`${id}a`, C_FOND, c.fond, [[-6, -70], [13, -68, 0.8]], k)
    + touffe(`${id}b`, C_DROITE, c.devant, [[17, -48, 0.8]], k)
    + touffe(`${id}c`, C_GAUCHE, c.devant, [[-24, -47, 0.8]], k)
    + touffe(`${id}d`, C_MILIEU, c.devant, [[-2, -55, 0.8]], k)
    + C_FLEURS.map(([x, y]) => fleurette(x * k, y * k, autre)).join('')
    + C_SOL.map(([x, y, a], i) => petale(x * k, y, a, i % 2 ? autre : c.devant.mid)).join('');
}

// Le magnolia : des branches presque nues qui montent, de grandes fleurs en tulipe au bout, quelques feuilles
const MAGNOLIA = {
  rose: { pale: '#FCE6F0', mid: '#E9A3C5', fonce: '#B85A8E' },
  blanc: { pale: '#FFFFFF', mid: '#F2E6EC', fonce: '#D49AB8' }
};
const BOIS_MAGNOLIA = { left: '#8E7A6A', right: '#665446' };
const M_BRANCHES = [
  [[[-8.5, -44], [-17, -58], [-23, -74]], 4.6], [[[-17, -58], [-30, -64]], 2.6], [[[-12, -51], [-14, -60]], 2],
  [[[0, -36], [-2, -56], [2, -82]], 4.6], [[[-1.4, -62], [-10, -74]], 2.2],
  [[[9.5, -45], [18, -60], [22, -77]], 4.6], [[[18, -60], [30, -64]], 2.6], [[[0.6, -72], [11, -85]], 2.2]
];
const M_FLEURS = [[-23, -76, 1], [-31, -66, 0.85], [2, -84, 1], [-10, -76, 0.85], [22, -79, 1], [31, -65, 0.85], [11, -87, 0.85], [-14, -61, 0.7]];
const M_FEUILLES = [[-20, -66, -40], [-4, -70, 30], [15, -68, -30], [26, -61, 40], [6, -58, 20], [-26, -59, 60]];
// fleur en tulipe : pétale du fond, deux pétales de côté qui s'ouvrent, le cœur foncé au pied
function tulipe(x, y, s, c) {
  const p = (d, col) => `<path d="${d}" fill="${col}" stroke="${OUT}" stroke-width="0.8" stroke-linejoin="round" transform="translate(${r2(x)} ${r2(y)}) scale(${r2(s)})"/>`;
  return p('M0,3 Q-3.2,-1 -1.4,-5.6 Q0,-6.6 1.4,-5.6 Q3.2,-1 0,3 Z', c.mid)
    + p('M0,3.2 Q-5.4,1.6 -5,-3.4 Q-3,-3.6 -1.6,-1.6 Q-0.6,1 0,3.2 Z', c.pale)
    + p('M0,3.2 Q5.4,1.6 5,-3.4 Q3,-3.6 1.6,-1.6 Q0.6,1 0,3.2 Z', c.pale)
    + `<path d="M${r2(x - 2.2 * s)},${r2(y + 1.4 * s)} Q${r2(x)},${r2(y + 3.6 * s)} ${r2(x + 2.2 * s)},${r2(y + 1.4 * s)}" stroke="${c.fonce}" stroke-width="${r2(1.2 * s)}" fill="none" stroke-linecap="round"/>`;
}
const feuille = (x, y, a, col, s = 1) => `<path d="M0,-3 Q2,-0.6 0,3 Q-2,-0.6 0,-3 Z" fill="${col}" stroke="${OUT}" stroke-width="0.6" stroke-linejoin="round" transform="translate(${r2(x)} ${r2(y)}) rotate(${a}) scale(${r2(s)})"/>`;
function magnolia({ teinte = 'rose', k = 1, id }) {
  const c = MAGNOLIA[teinte], s = Math.max(k, 0.85) * 1.25;
  return ombre(k, 26, 10.5) + rameaux(M_BRANCHES, BOIS_MAGNOLIA, k) + tronc(`${id}t`, k)
    + M_FEUILLES.map(([x, y, a]) => feuille(x * k, y * k, a, '#9CCB62', s)).join('')
    + M_FLEURS.map(([x, y, t]) => tulipe(x * k, y * k, t * s, c)).join('')
    + [[-15, 5, 40], [11, 6, -30], [17, 3.5, 70]].map(([x, y, a]) => petale(x * k, y, a, c.mid)).join('');
}

// Le saule tendre : un houppier rond d'où retombent de longues mèches de feuilles, jusqu'au sol ou presque (les mèches
// partent sous le houppier, qui cache leur départ)
const SAULE = {
  tendre: T('#F0FABE', '#BFE47C', '#7DB653', '#BBE08A', '#8EC160', '#5E9447'),
  dore: T('#FAF9C2', '#DCE47E', '#A6B44E', '#D2D88A', '#B4BE5C', '#838F3E')
};
const S_HAUT = [[-14, -76, 11], [4, -81, 12.5], [19, -73, 10.5], [-26, -66, 8.5], [30, -64, 8], [-4, -66, 10], [12, -64, 9]];
// [x, haut, bas, demi-largeur] : les mèches du fond, puis celles de devant
const S_MECHES_FOND = [[-32, -62, -26, 2.8], [-24, -66, -18, 3], [-15, -68, -24, 3], [-6, -70, -20, 3], [4, -70, -26, 3], [13, -68, -18, 3], [22, -66, -24, 3], [31, -62, -20, 2.8]];
const S_MECHES = [[-27, -62, -12, 3], [-19, -64, -28, 3], [-10, -66, -16, 3], [11, -66, -30, 3], [19, -64, -14, 3], [28, -60, -22, 3]];
function meche(id, x, y0, y1, w, c, k) {
  const X = x * k, A = y0 * k, B = y1 * k, Wd = w * k, m = (A + B) / 2, dx = (x < 0 ? -1 : 1) * 1.2 * k;
  const d = `M${r2(X - Wd)},${r2(A)} Q${r2(X - Wd - 0.6 + dx * 0.4)},${r2(m)} ${r2(X - Wd * 0.35 + dx)},${r2(B - 2)} Q${r2(X + dx)},${r2(B + 1.6)} ${r2(X + Wd * 0.35 + dx)},${r2(B - 2)} Q${r2(X + Wd + 0.6 + dx * 0.4)},${r2(m)} ${r2(X + Wd)},${r2(A)} Z`;
  let dedans = `<path d="M${r2(X + Wd * 0.35)},${r2(A)} L${r2(X + Wd + 3)},${r2(A)} L${r2(X + Wd + 3 + dx)},${r2(B + 3)} L${r2(X + Wd * 0.2 + dx)},${r2(B + 3)} Z" fill="${c.dark}"/>`;
  // de petites feuilles en chevrons le long de la mèche
  for (let y = A + 4 * k, i = 0; y < B - 3; y += 3.6 * k, i++) { const t = (y - A) / (B - A), xx = X + dx * t; dedans += `<path d="M${r2(xx - Wd * 0.5)},${r2(y - 0.8)} L${r2(xx - Wd * 0.1)},${r2(y + 0.4)} L${r2(xx + Wd * 0.3)},${r2(y - 0.8)}" stroke="${c.dark}" stroke-width="0.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`; }
  dedans += `<path d="M${r2(X - Wd * 0.5)},${r2(A + 2)} Q${r2(X - Wd * 0.5 + dx * 0.3)},${r2(m)} ${r2(X - Wd * 0.2 + dx)},${r2(B - 4)}" stroke="${c.light}" stroke-width="0.9" fill="none" stroke-linecap="round"/>`;
  return `<path d="${d}" fill="${c.mid}" stroke="${OUT}" stroke-width="${W}" stroke-linejoin="round"/><defs><clipPath id="${id}"><path d="${d}"/></clipPath></defs><g clip-path="url(#${id})">${dedans}</g>`;
}
function saule({ teinte = 'tendre', k = 1, id }) {
  const c = SAULE[teinte];
  return ombre(k, 30, 12) + S_MECHES_FOND.map(([x, a, b, w], i) => meche(`${id}f${i}`, x, a, b, w, c.fond, k)).join('')
    + tronc(`${id}t`, k) + S_MECHES.map(([x, a, b, w], i) => meche(`${id}m${i}`, x, a, b, w, c.devant, k)).join('')
    + touffe(`${id}a`, S_HAUT, c.devant, [[-8, -72], [12, -74, 0.8], [-22, -66, 0.8]], k)
    + herbe(-17 * k, 4, '#94C25C', 0.7) + herbe(13 * k, 5.2, '#86B852', 0.75);
}

// ——— Été ———

// Le chêne touffu : le plus large des houppiers, en lobes serrés, vert d'été ; de l'herbe au pied
const CHENE = {
  ete: T('#C8E68A', '#7FBF4E', '#478A3A', '#7FB65A', '#558F42', '#356638'),
  sombre: T('#A9D27A', '#5E9F45', '#336E33', '#679C50', '#41783A', '#28532E')
};
const H_FOND = [[-20, -78, 13], [0, -86, 14.5], [20, -78, 13], [-34, -64, 10], [35, -63, 10]];
const H_GAUCHE = [[-25, -57, 13.5], [-38, -51, 9], [-30, -42, 8.5, 0], [-15, -44, 8.5, 0]];
const H_DROITE = [[24, -57, 13], [38, -51, 9], [30, -42, 8.5, 0], [15, -45, 8.5, 0]];
const H_MILIEU = [[0, -66, 12.5], [-8, -53, 8, 0], [8, -53, 8.5, 0]];
// le gland : cupule à carreaux, fruit en ogive
const gland = (x, y, a, fruit, s = 1) => `<g transform="translate(${r2(x)} ${r2(y)}) rotate(${a}) scale(${r2(s)})">`
  + `<path d="M-1.8,-0.4 Q-2,3 0,3.6 Q2,3 1.8,-0.4 Z" fill="${fruit}" stroke="${OUT}" stroke-width="0.6" stroke-linejoin="round"/>`
  + `<path d="M-2.3,0 Q-2.3,-2.2 0,-2.3 Q2.3,-2.2 2.3,0 Q0,0.8 -2.3,0 Z" fill="#8A6A44" stroke="${OUT}" stroke-width="0.6" stroke-linejoin="round"/>`
  + `<path d="M0,-2.3 L0,-3.4" stroke="${OUT}" stroke-width="0.7" stroke-linecap="round"/></g>`;
function chene({ teinte = 'ete', k = 1, id, roux = false }) {
  const c = roux ? CHENE_ROUX[teinte] : CHENE[teinte];
  return ombre(k, 33, 13) + tronc(`${id}t`, k)
    + touffe(`${id}a`, H_FOND, c.fond, [[-8, -74], [12, -72, 0.9], [26, -78, 0.8], [-26, -66, 0.8]], k)
    + touffe(`${id}b`, H_DROITE, c.devant, [[20, -50], [32, -54, 0.8]], k)
    + touffe(`${id}c`, H_GAUCHE, c.devant, [[-24, -49], [-34, -56, 0.8]], k)
    + touffe(`${id}d`, H_MILIEU, c.devant, [[-2, -58], [5, -66, 0.8]], k)
    + (roux ? FEUILLES_CHENE.map(([x, y, a, i]) => feuilleMorte(x * k, y, a, c.feuilles[i])).join('')
      + [[-12, 6, -30], [12, 5, 50], [16, 7.5, 10]].map(([x, y, a]) => gland(x * k, y, a, '#B88A4E')).join('')
      : herbe(-17 * k, 4, '#86B852', 0.8) + herbe(14 * k, 5.4, '#94C25C', 0.7) + gland(-9 * k, 6, 20, '#9CC25A', 0.9));
}

// Le tilleul : houppier haut et ovale ; en été, ses petites fleurs crème pendent sous une bractée claire
const TILLEUL = {
  clair: T('#E4F2A6', '#A9CF63', '#6F9E45', '#A9CB78', '#7FA855', '#557D3E'),
  bleute: T('#D2E8B4', '#8FBC7A', '#5C8C5A', '#9CBE90', '#6E9A6A', '#4A6E50')
};
const L_FOND = [[-10, -92, 11], [8, -94, 11], [-19, -78, 10], [19, -78, 10], [0, -82, 12]];
const L_GAUCHE = [[-20, -62, 11], [-26, -52, 8], [-19, -44, 7.5, 0], [-9, -47, 7.5, 0]];
const L_DROITE = [[19, -63, 11], [25, -52, 8], [18, -44, 7.5, 0], [8, -47, 7.5, 0]];
const L_MILIEU = [[-1, -72, 11], [-7, -58, 8, 0], [6, -59, 8, 0]];
const L_FLEURS = [[-22, -60], [-12, -72], [6, -78], [18, -62], [-4, -90], [14, -88], [-17, -82], [2, -60]];
// une grappe : la bractée en languette, trois petites fleurs dessous
const grappe = (x, y) => `<path d="M${r2(x - 0.6)},${r2(y - 3)} Q${r2(x + 2.4)},${r2(y - 1.6)} ${r2(x + 2.2)},${r2(y + 1.4)} Q${r2(x + 0.4)},${r2(y + 0.2)} ${r2(x - 0.6)},${r2(y - 3)} Z" fill="#E6EFB0" stroke="${OUT}" stroke-width="0.5"/>`
  + [[-0.8, 1.6], [0.8, 2.2], [-0.2, 3.4]].map(([dx, dy]) => rond(x + dx, y + dy, 1.1, OUT) + rond(x + dx, y + dy, 0.75, '#FFF2B0')).join('');
function tilleul({ teinte = 'clair', k = 1, id }) {
  const c = TILLEUL[teinte];
  return ombre(k, 26, 10.5) + tronc(`${id}t`, k)
    + touffe(`${id}a`, L_FOND, c.fond, [[-6, -86], [10, -84, 0.8]], k)
    + touffe(`${id}b`, L_DROITE, c.devant, [[17, -55, 0.8]], k)
    + touffe(`${id}c`, L_GAUCHE, c.devant, [[-19, -55, 0.8]], k)
    + touffe(`${id}d`, L_MILIEU, c.devant, [[-2, -64, 0.8]], k)
    + L_FLEURS.map(([x, y]) => grappe(x * k, y * k)).join('')
    + herbe(-14 * k, 4, '#86B852', 0.75) + fleurette(13 * k, 4.6, '#FFFFFF') + fleurette(17 * k, 2.8, '#FFF2B0');
}

// Le pin parasol : un fût haut et un peu penché, deux bras, et le houppier en ombrelle, large et plat
const PARASOL = {
  doux: T('#A8D88A', '#5FAE5C', '#3B7F45', '#7DB86A', '#4A9450', '#2F6A3C'),
  profond: T('#8CC77A', '#4A9650', '#2C6A3C', '#6AA662', '#3A8046', '#225834')
};
const P_FOND = [[-26, -84, 9], [-10, -89, 10], [8, -90, 10], [25, -85, 9], [38, -79, 7], [-38, -78, 7]];
const P_DEVANT = [[-30, -75, 9], [-15, -78, 10], [2, -79, 10], [19, -77, 10], [33, -73, 8], [-40, -72, 6, 0], [-22, -69, 7, 0], [10, -70, 7.5, 0], [26, -68, 6.5, 0]];
function futParasol(id, k) {
  const sc = d => d.replace(/-?\d+(\.\d+)?/g, n => r2(n * k));
  const d = sc('M-9,2 Q-5,0.6 -4.4,-4 Q-3.4,-32 0.4,-60 L-7,-67 L-4,-69.5 Q0.6,-65 2.6,-62.6 Q6,-67 12,-70 L13.6,-67.2 Q7.6,-63.4 5.6,-58 Q2.6,-32 4.2,-5 Q5.2,0.6 9,2 Q5,3.2 2,2 Q0,3.4 -2.4,2.2 Q-5,3.2 -9,2 Z');
  const dedans = `<path d="${sc('M1,4 Q0,-30 3.4,-60 L16,-72 L16,4 Z')}" fill="${BOIS.right}"/>`
    + `<path d="${sc('M-1.6,-10 Q-1.8,-18 -1.2,-24 M2,-30 Q1.4,-38 2.4,-44 M-0.6,-40 q0.4,-3 0.8,-5')}" fill="none" stroke="${BOIS.bark}" stroke-width="0.7" stroke-linecap="round"/>`
    + `<path d="${sc('M-3.2,-6 Q-2.6,-24 -0.6,-44')}" fill="none" stroke="${BOIS.light}" stroke-width="1" stroke-linecap="round" opacity="0.7"/>`;
  return `<path d="${d}" fill="${BOIS.left}" stroke="${OUT}" stroke-width="${W}" stroke-linejoin="round"/><defs><clipPath id="${id}"><path d="${d}"/></clipPath></defs><g clip-path="url(#${id})">${dedans}</g>`;
}
function pinParasol({ teinte = 'doux', k = 1, id }) {
  const c = PARASOL[teinte];
  return ombre(k, 30, 11) + futParasol(`${id}t`, k)
    + touffe(`${id}a`, P_FOND, c.fond, [[-18, -88, 0.8], [16, -88, 0.8]], k)
    + touffe(`${id}b`, P_DEVANT, c.devant, [[-24, -74, 0.8], [-6, -76, 0.8], [12, -76, 0.8], [28, -72, 0.8]], k)
    + pommeDePin(-12 * k, 5, -20) + pommeDePin(12 * k, 6, 30);
}

// ——— Automne ———

// L'érable rouge : houppier rond, flamboyant ; des feuilles d'érable dans le houppier et en tapis au pied
const ERABLE = {
  cramoisi: T('#FF9C8A', '#D9413A', '#9E2830', '#D8655A', '#B13434', '#7A2229'),
  ecarlate: T('#FFC27A', '#F0703A', '#C04228', '#E88A50', '#CC5A2E', '#923A22')
};
const R_FOND = [[-14, -80, 12], [4, -85, 13], [21, -76, 11], [-27, -66, 10], [30, -64, 9]];
const R_GAUCHE = [[-22, -57, 12.5], [-34, -52, 8.5], [-27, -43, 8, 0], [-13, -45, 8, 0]];
const R_DROITE = [[19, -57, 12], [31, -51, 8.5], [24, -42, 7.5, 0], [11, -46, 7.5, 0]];
const R_MILIEU = [[-2, -66, 12], [-9, -53, 7.5, 0], [6, -54, 8, 0]];
// feuille d'érable : cinq pointes, queue
const erableFeuille = (x, y, a, col, s = 1) => `<g transform="translate(${r2(x)} ${r2(y)}) rotate(${a}) scale(${r2(s)})">`
  + `<path d="M0,3 L-0.6,1.4 L-3.2,1.8 L-2.4,0 L-3.6,-1.2 L-1.6,-1.2 L-1.8,-3 L-0.6,-2 L0,-3.8 L0.6,-2 L1.8,-3 L1.6,-1.2 L3.6,-1.2 L2.4,0 L3.2,1.8 L0.6,1.4 Z" fill="${col}" stroke="${OUT}" stroke-width="0.55" stroke-linejoin="round"/>`
  + `<path d="M0,1.6 L0,4.4" stroke="${OUT}" stroke-width="0.5" stroke-linecap="round"/></g>`;
const R_AIR = [[-26, -50, 20], [-8, -70, -15], [14, -62, 30], [26, -48, -25], [2, -84, 10], [-18, -76, 40]];
const R_SOL = [[-18, 3.5, 30], [-12, 7, -50], [-22, 7, 80], [10, 6.5, 60], [16, 3, -20], [20, 7.5, 40], [3, 8, -70], [-4, 5, 15]];
function erable({ teinte = 'cramoisi', k = 1, id }) {
  const c = ERABLE[teinte], f = [c.devant.mid, c.devant.light, '#F2C14E'];
  return ombre(k, 30, 12) + tronc(`${id}t`, k)
    + touffe(`${id}a`, R_FOND, c.fond, [], k)
    + touffe(`${id}b`, R_DROITE, c.devant, [], k)
    + touffe(`${id}c`, R_GAUCHE, c.devant, [], k)
    + touffe(`${id}d`, R_MILIEU, c.devant, [], k)
    + R_AIR.map(([x, y, a], i) => erableFeuille(x * k, y * k, a, i % 2 ? c.devant.light : c.devant.dark, 0.9)).join('')
    + R_SOL.map(([x, y, a], i) => erableFeuille(x * k, y, a, f[i % 3])).join('')
    + erableFeuille(-31 * k, -28 * k, 25, f[0], 1.05) + erableFeuille(31 * k, -20 * k, -35, f[2], 1.05);
}

// Le ginkgo doré : houppier dressé, tout en or ; ses feuilles en éventail font un tapis jaune au pied
const GINKGO = {
  or: T('#FFF2A0', '#F5CF3A', '#D19A1E', '#F0D266', '#DDAE2C', '#A87A1A'),
  citron: T('#FBF7B8', '#E3DE5C', '#ACA933', '#D6D47A', '#BDB943', '#868527')
};
const G_FOND = [[-6, -96, 10], [9, -90, 10], [-15, -82, 9], [16, -76, 9], [0, -80, 11]];
const G_GAUCHE = [[-16, -64, 10.5], [-22, -55, 7.5], [-16, -46, 7, 0], [-6, -49, 7, 0]];
const G_DROITE = [[16, -62, 10], [22, -53, 7.5], [15, -45, 7, 0], [6, -49, 7, 0]];
const G_MILIEU = [[0, -70, 10], [-5, -58, 7, 0], [6, -58, 7, 0]];
// feuille de ginkgo : un éventail échancré au milieu, sa queue
const eventail = (x, y, a, col, s = 1) => `<g transform="translate(${r2(x)} ${r2(y)}) rotate(${a}) scale(${r2(s)})">`
  + `<path d="M0,2.4 L-3,-1.4 Q-1.6,-3.4 -0.3,-2.2 L0,-1.2 L0.3,-2.2 Q1.6,-3.4 3,-1.4 Z" fill="${col}" stroke="${OUT}" stroke-width="0.55" stroke-linejoin="round"/>`
  + `<path d="M0,2.4 L0,4.4" stroke="${OUT}" stroke-width="0.5" stroke-linecap="round"/></g>`;
const G_SOL = [[-18, 3.5, 30], [-12, 7, -50], [-22, 6.5, 80], [10, 6.5, 60], [16, 3, -20], [21, 6.5, 40], [3, 8, -70], [-5, 5, 10], [7, 3, -40]];
function ginkgo({ teinte = 'or', k = 1, id }) {
  const c = GINKGO[teinte];
  return E(1 * k, 4, 24 * k, 6 * k, c.devant.mid, 0.8) + E(-2 * k, 3.4, 16 * k, 3.4 * k, c.devant.light, 0) + tronc(`${id}t`, k)
    + touffe(`${id}a`, G_FOND, c.fond, [[-4, -88, 0.8], [10, -82, 0.8]], k)
    + touffe(`${id}b`, G_DROITE, c.devant, [[16, -55, 0.8]], k)
    + touffe(`${id}c`, G_GAUCHE, c.devant, [[-17, -57, 0.8]], k)
    + touffe(`${id}d`, G_MILIEU, c.devant, [[-1, -64, 0.8]], k)
    + G_SOL.map(([x, y, a], i) => eventail(x * k, y, a, i % 2 ? c.devant.light : c.devant.dark)).join('')
    + eventail(-26 * k, -30 * k, 25, c.devant.mid, 1.1) + eventail(25 * k, -22 * k, -35, c.devant.light, 1.1);
}

// Le chêne roux : la silhouette du chêne touffu en roux ou en brun, glands et feuilles mortes au pied
const CHENE_ROUX = {
  roux: { ...T('#F2B474', '#C9783A', '#93502A', '#C98A54', '#A2602F', '#6E4024'), feuilles: ['#C9783A', '#E8A65A', '#93502A'] },
  brun: { ...T('#E0BE84', '#B08A4E', '#7C5E34', '#B49260', '#8E6E40', '#62492A'), feuilles: ['#B08A4E', '#D8B474', '#7C5E34'] }
};
const FEUILLES_CHENE = [[-19, 3.5, 30, 0], [-13, 7, -50, 1], [-22, 7, 80, 2], [9, 6.5, 60, 1], [19, 3, -20, 0], [21, 7.5, 40, 2], [2, 8, -70, 0]];

// ——— Hiver ———

// Le bouleau nu : le tronc blanc du bouleau, des branches nues qui finissent en brindilles, la neige sur le dessus
const BOULEAU_NU = {
  pourpre: { left: '#F4F1EA', right: '#CFC8BA', brindille: '#8A5A6A' },
  gris: { left: '#EEEDEA', right: '#C2C0BA', brindille: '#8E8A84' }
};
const N_BRANCHES = [
  [[[-7.2, -53], [-14, -66], [-17, -82]], 2.6], [[[-14, -66], [-24, -74]], 1.4], [[[-11.4, -60], [-21, -60]], 1.2],
  [[[0, -44], [1, -62], [-1, -80], [1, -94]], 2.4], [[[1, -62], [8, -72]], 1.2], [[[-0.6, -80], [-7, -88]], 1.1],
  [[[7.6, -54], [14, -68], [19, -84]], 2.6], [[[14, -68], [24, -73]], 1.4], [[[11, -61], [20, -58]], 1.2]
];
// brindilles : de fines fourches au bout des branches
const N_BRINDILLES = [[-17, -82], [-24, -74], [-21, -60], [1, -94], [8, -72], [-7, -88], [19, -84], [24, -73], [20, -58]];
function bouleauNu({ teinte = 'pourpre', k = 1, id }) {
  const c = BOULEAU_NU[teinte];
  const brin = ([x, y]) => { const X = x * k, Y = y * k, dx = x < 0 ? -1 : 1; return `<path d="M${r2(X)},${r2(Y)} l${r2(dx * 2.6)},${r2(-3.4)} M${r2(X)},${r2(Y)} l${r2(dx * 3.6)},${r2(-0.6)} M${r2(X)},${r2(Y)} l${r2(-dx * 0.6)},${r2(-3.8)}" stroke="${c.brindille}" stroke-width="0.8" stroke-linecap="round" fill="none"/>`; };
  return ombre(k, 20, 9, true) + N_BRINDILLES.map(brin).join('') + rameaux(N_BRANCHES, c, k, true) + troncBouleau(`${id}t`, k) + congere(k * 0.9);
}

// Le houx : un arbre touffu en cône, vert sombre et luisant, des grappes de baies rouges, la neige sur le haut
const HOUX = {
  sombre: T('#7FB27A', '#3F7D4A', '#24573A', '#5E9460', '#2F6640', '#1C4430'),
  bleu: T('#8FB8A0', '#4E8670', '#2E5E50', '#6E9C88', '#3A6E5C', '#244C40')
};
const X_FOND = [[0, -80, 10], [-11, -68, 10.5], [11, -68, 10.5], [-19, -52, 9.5], [19, -52, 9.5]];
const X_MILIEU = [[-8, -60, 10], [8, -60, 10], [0, -70, 9]];
const X_BAS = [[-14, -36, 10, 0], [0, -40, 11], [14, -36, 10, 0], [-23, -28, 7.5, 0], [23, -28, 7.5, 0], [-6, -24, 9, 0], [7, -24, 9, 0]];
const X_BAIES = [[-10, -64], [7, -70], [12, -54], [-16, -42], [3, -46], [18, -32], [-21, -28], [-3, -30], [9, -24]];
const baies = (x, y) => [[-1.2, 0], [1.2, 0.2], [0, -1.4]].map(([dx, dy]) => rond(x + dx, y + dy, 1.6, OUT)).join('')
  + [[-1.2, 0], [1.2, 0.2], [0, -1.4]].map(([dx, dy]) => rond(x + dx, y + dy, 1.05, '#D8323A') + rond(x + dx - 0.35, y + dy - 0.35, 0.35, '#FFFFFF')).join('');
function houx({ teinte = 'sombre', k = 1, id }) {
  const c = HOUX[teinte];
  return ombre(k, 24, 10, true) + troncSapin(`${id}t`, k)
    + touffe(`${id}a`, X_FOND, c.fond, [[-12, -62, 0.8], [12, -60, 0.8]], k, true)
    + touffe(`${id}b`, X_BAS, c.devant, [[-12, -32, 0.8], [12, -30, 0.8], [0, -34, 0.8]], k)
    + touffe(`${id}c`, X_MILIEU, c.devant, [[-6, -54, 0.8], [6, -54, 0.8]], k, true)
    + X_BAIES.map(([x, y]) => baies(x * k, y * k)).join('') + congere(k * 0.9);
}

// Le sapin givré : les étages du sapin couverts de givre (vert pâle et bleuté), frange de givre, petits glaçons et
// éclats de lumière ; une congère au pied
const GIVRE = {
  givre: { light: '#E4F0F2', mid: '#9CC0B8', dark: '#5F8A88' },
  argent: { light: '#EEF2F6', mid: '#B4C4CC', dark: '#7A8E9A' }
};
function sapinGivre({ teinte = 'givre', k = 1, id }) {
  const c = GIVRE[teinte];
  let o = ombre(k, 24, 10.5, true) + troncSapin(`${id}t`, k);
  ETAGES.forEach(([y, w, h, n], i) => {
    const Y = y * k, Wd = w * k, pas = (2 * Wd) / n;
    o += etage(`${id}${i}`, Y, Wd, h * k, n, c, false);
    let f = `M${r2(-Wd + 1)},${r2(Y - 0.2)}`;
    for (let j = 0; j < n; j++) { const x0 = -Wd + j * pas; f += ` Q${r2(x0 + pas / 2)},${r2(Y + 3.4)} ${r2(Math.min(x0 + pas, Wd - 1))},${r2(Y - 0.2)}`; }
    o += `<path d="${f}" stroke="#FFFFFF" stroke-width="1.3" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="0.95"/>`;
    // un petit glaçon sous chaque creux entre deux festons
    for (let j = 1; j < n; j++) { const x = -Wd + j * pas; o += `<path d="M${r2(x - 1)},${r2(Y + 0.4)} L${r2(x)},${r2(Y + 3.6)} L${r2(x + 1)},${r2(Y + 0.4)} Z" fill="#E8F4FA" stroke="${OUT}" stroke-width="0.5" stroke-linejoin="round"/>`; }
  });
  // éclats de lumière sur le givre
  o += [[-10, -36], [8, -52], [-4, -70], [12, -22], [-14, -18]].map(([x, y]) => `<path d="M${r2(x * k)},${r2(y * k - 2)} L${r2(x * k)},${r2(y * k + 2)} M${r2(x * k - 2)},${r2(y * k)} L${r2(x * k + 2)},${r2(y * k)}" stroke="#FFFFFF" stroke-width="0.9" stroke-linecap="round"/>`).join('');
  return o + congere(k);
}

// ——— La liste ———
// [essence, libellé, saison, dessin, [teinte par défaut, autre teinte], noms des teintes]
const ESSENCES = [
  ['cerisier', 'Cerisier en fleurs', 'printemps', cerisier, ['rose', 'blanc'], { rose: 'fleurs roses', blanc: 'fleurs blanches' }],
  ['magnolia', 'Magnolia', 'printemps', magnolia, ['rose', 'blanc'], { rose: 'fleurs roses', blanc: 'fleurs blanches' }],
  ['saule', 'Saule tendre', 'printemps', saule, ['tendre', 'dore'], { tendre: 'vert tendre', dore: 'vert doré' }],
  ['chene', 'Chêne touffu', 'ete', chene, ['ete', 'sombre'], { ete: 'vert d\'été', sombre: 'vert sombre' }],
  ['tilleul', 'Tilleul en fleurs', 'ete', tilleul, ['clair', 'bleute'], { clair: 'vert clair', bleute: 'vert bleuté' }],
  ['pin_parasol', 'Pin parasol', 'ete', pinParasol, ['doux', 'profond'], { doux: 'vert doux', profond: 'vert profond' }],
  ['erable', 'Érable rouge', 'automne', erable, ['cramoisi', 'ecarlate'], { cramoisi: 'cramoisi', ecarlate: 'écarlate' }],
  ['ginkgo', 'Ginkgo doré', 'automne', ginkgo, ['or', 'citron'], { or: 'or', citron: 'jaune citron' }],
  ['chene_roux', 'Chêne roux', 'automne', o => chene({ ...o, roux: true }), ['roux', 'brun'], { roux: 'roux', brun: 'brun' }],
  ['bouleau_nu', 'Bouleau nu', 'hiver', bouleauNu, ['pourpre', 'gris'], { pourpre: 'brindilles pourpres', gris: 'brindilles grises' }],
  ['houx', 'Houx', 'hiver', houx, ['sombre', 'bleu'], { sombre: 'vert sombre', bleu: 'vert bleu' }],
  ['sapin_givre', 'Sapin givré', 'hiver', sapinGivre, ['givre', 'argent'], { givre: 'givre vert pâle', argent: 'givre argenté' }]
];

// Les 72 arbres : [fichier, libellé, saison, dessin] ; « <essence> » (grand, teinte par défaut) est celui par défaut
const ARBRES_DE_SAISON = [];
// Chaque saison et ses arbres : les nouveaux, puis ceux qui existaient déjà (arbre de printemps, d'automne, d'hiver,
// sapin enneigé) ; par essence, la liste de ses fichiers
const SAISONS = { printemps: {}, ete: {}, automne: {}, hiver: {} };
for (const [essence, nom, saison, dessin, teintes, noms] of ESSENCES) for (const taille of ['grand', 'moyen', 'petit']) for (const teinte of teintes) {
  const autre = teinte !== teintes[0];
  const fichier = [essence, taille !== 'grand' && taille, autre && teinte].filter(Boolean).join('_');
  const id = `s${fichier.replace(/[^a-z]/g, '').slice(0, 6)}${taille[0]}${autre ? 'b' : 'a'}${ESSENCES.findIndex(e => e[0] === essence)}`;
  ARBRES_DE_SAISON.push([fichier, `${nom} (${taille}, ${noms[teinte]})`, saison, () => dessin({ teinte, k: TAILLES[taille], id })]);
  (SAISONS[saison][essence] = SAISONS[saison][essence] || []).push(`${fichier}.svg`);
}

SAISONS.printemps.arbre_printemps = ARBRES_SAISONS.filter(a => a[2].saison === 'printemps').map(a => `${a[0]}.svg`);
SAISONS.automne.arbre_automne = AUTOMNES.map(a => `${a[0]}.svg`);
SAISONS.hiver.arbre_hiver = ARBRES_SAISONS.filter(a => a[2].saison === 'hiver').map(a => `${a[0]}.svg`);
SAISONS.hiver.sapin_neige = SAPINS.filter(a => a[2].neige).map(a => `${a[0]}.svg`);

module.exports = { ARBRES_DE_SAISON, SAISONS, ESSENCES };
