// Agathe (anciennement Marcelle ; fichiers du jeu : cannelle) : les gestes de son métier, la cuisinière-guérisseuse.
// Même branchement que les gestes de l'atelier (atelier/gestes.js) : chaque geste rend Agathe prête à passer à
// troupe.frame(…, vue, 'action', n) ; n va de 0 à 3 (quatre images). Les objets suivent le mini-jeu de la marmite
// (atelier/minijeu_cuisine.js : la fonte sur ses pierres, la louche de cuivre, le bol de bois, la soupe dorée), au trait
// et à l'échelle du sprite.
//   touiller : elle touille la marmite, le poing sur la hanche (le mini-jeu : « on touille ») ;
//   gouter : la louche aux lèvres, la main dessous ; puis rien : le goût perdu (HISTOIRE.md : « Plus rien n'a de goût… ») ;
//   servir : elle remplit le bol de bois et le tend (« Merci pour la soupe. Chaque soir. ») ;
//   grain : le tablier relevé plein de grain, elle le lance aux poules (ses trois poules et Amiral).
// Ses bras passent par troupe.arm, donc par ses manches (lorena_bras.js) ; a, b : ses épaules, à gauche et à droite de
// l'écran.
const { OUT, E, P, L, limb, r2, arm } = require('../troupe');
const { paume } = require('../../atelier/gestes');
const { pal, louche } = require('./agathe_refonte');

const FONTE = '#4A3A33', FONTE_S = '#2C221E', FONTE_H = '#6A5248', BORD = '#5E4A40';
const SOUPE = '#D9A441', SOUPE_S = '#B9832C', SOUPE_H = '#F2CF7A';
const BOIS = '#A8743F', BOIS_S = '#7E522A', BOIS_H = '#C9945C';
const PIERRE = '#B4AEA2', PIERRE_S = '#8F877A', GRAIN = '#E3BE5A';

// La vapeur : une volute claire cernée qui monte et s'efface (n : l'image, elle monte d'un cran à chaque image)
function volute(x, y, n, k = 1) {
  const up = (n % 4) * 1.3, d = `M${r2(x)},${r2(y - up)} q${r2(1.2 * k)},-1.2 0,-2.4 q${r2(-1.2 * k)},-1.2 0,-2.4`;
  const op = r2([0.95, 0.85, 0.65, 0.4][n % 4]);
  return `<g opacity="${op}"><path d="${d}" fill="none" stroke="${OUT}" stroke-width="1.7" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#FFFFFF" stroke-width="0.8" stroke-linecap="round"/></g>`;
}
// La marmite de fonte sur ses deux pierres, le feu dessous : (x, y) le milieu de la bouche, w sa demi-largeur ; n : le feu
// qui danse, les bulles ; entree : où la louche plonge dans la soupe (un rond sur la soupe)
function marmite(x, y, w, n, uid, entree = null) {
  const ry = w * 0.3, h = w * 0.95, by = y + h;
  const corps = `M${r2(x - w)},${r2(y)} C${r2(x - w)},${r2(y + h * 0.95)} ${r2(x - w * 0.45)},${r2(by)} ${r2(x)},${r2(by)} C${r2(x + w * 0.45)},${r2(by)} ${r2(x + w)},${r2(y + h * 0.95)} ${r2(x + w)},${r2(y)} Z`;
  // le feu, entre les pierres : deux flammes qui alternent
  const f = n % 2 ? [[-1.6, 2.6], [0.4, 3.4], [2, 2.2]] : [[-1.8, 2.2], [0.2, 3], [1.8, 2.8]];
  let s = f.map(([dx, hh]) => P(`M${r2(x + dx - 1.1)},${r2(by + 2.4)} Q${r2(x + dx - 1)},${r2(by + 2.4 - hh * 0.6)} ${r2(x + dx)},${r2(by + 2.4 - hh)} Q${r2(x + dx + 1)},${r2(by + 2.4 - hh * 0.6)} ${r2(x + dx + 1.1)},${r2(by + 2.4)} Z`, '#FF9A3C', 0.6)
    + P(`M${r2(x + dx - 0.5)},${r2(by + 2.4)} Q${r2(x + dx - 0.4)},${r2(by + 2.4 - hh * 0.4)} ${r2(x + dx)},${r2(by + 2.4 - hh * 0.6)} Q${r2(x + dx + 0.4)},${r2(by + 2.4 - hh * 0.4)} ${r2(x + dx + 0.5)},${r2(by + 2.4)} Z`, '#FFD25A', 0)).join('');
  // les pierres
  s += [-1, 1].map(k => E(x + k * w * 0.62, by + 1.6, w * 0.34, 1.6, PIERRE, 0.8) + E(x + k * w * 0.62 + w * 0.12, by + 2.1, w * 0.2, 0.8, PIERRE_S, 0)).join('');
  // les anses, le corps de fonte : l'ombre côté brume, un reflet, la lueur du feu au bas
  s += [-1, 1].map(k => `<path d="M${r2(x + k * w)},${r2(y + 1)} q${r2(k * 1.6)},0.2 ${r2(k * 1.2)},1.8 q${r2(-k * 0.4)},0.8 ${r2(-k * 1.2)},0.5" fill="none" stroke="${OUT}" stroke-width="1.5" stroke-linecap="round"/><path d="M${r2(x + k * w)},${r2(y + 1)} q${r2(k * 1.6)},0.2 ${r2(k * 1.2)},1.8 q${r2(-k * 0.4)},0.8 ${r2(-k * 1.2)},0.5" fill="none" stroke="${FONTE_H}" stroke-width="0.6" stroke-linecap="round"/>`).join('');
  s += P(corps, FONTE) + `<clipPath id="${uid}mc"><path d="${corps}"/></clipPath><g clip-path="url(#${uid}mc)"><rect x="${r2(x + w * 0.35)}" y="${r2(y - 1)}" width="${r2(w)}" height="${r2(h + 2)}" fill="${FONTE_S}"/>`
    + `<path d="M${r2(x - w * 0.72)},${r2(y + 1.2)} Q${r2(x - w * 0.7)},${r2(y + h * 0.6)} ${r2(x - w * 0.4)},${r2(y + h * 0.82)}" fill="none" stroke="${FONTE_H}" stroke-width="0.9" stroke-linecap="round"/>`
    + `<ellipse cx="${r2(x)}" cy="${r2(by + 0.4)}" rx="${r2(w * 0.6)}" ry="1.4" fill="#FF9A3C" opacity="${n % 2 ? 0.4 : 0.3}"/></g>` + P(corps, 'none');
  // le rebord, la soupe dans la bouche, ses bulles, le reflet ; le rond où plonge la louche
  s += E(x, y, w + 0.5, ry + 0.5, BORD, 0.9) + E(x, y + 0.15, w - 0.5, ry - 0.25, SOUPE, 0.5)
    + `<path d="M${r2(x - w + 0.7)},${r2(y)} Q${r2(x)},${r2(y - ry + 0.3)} ${r2(x + w - 0.7)},${r2(y)} Q${r2(x)},${r2(y - ry + 1)} ${r2(x - w + 0.7)},${r2(y)} Z" fill="${SOUPE_S}"/>`
    + E(x - w * 0.35, y + 0.5, w * 0.22, 0.35, SOUPE_H, 0);
  const bulles = n % 2 ? [[0.3, 0.2, 0.55], [-0.45, 0.5, 0.35]] : [[0.5, 0.6, 0.4], [-0.2, 0.3, 0.5]];
  s += bulles.map(([dx, dy, rr]) => E(x + dx * w, y + dy, rr, rr * 0.8, SOUPE_H, 0.35)).join('');
  if (entree) s += E(entree[0], entree[1], 1.5, 0.5, 'none', 0.45);
  return s;
}
// La louche qui plonge : le manche, de la main au point où il entre dans la soupe (le cuilleron est dessous)
const manche = (K, h, e) => limb([h[0] + (h[0] - e[0]) * 0.12, h[1] + (h[1] - e[1]) * 0.12], e, 1.5, K.copper) + L([h[0], h[1]], [h[0] + (e[0] - h[0]) * 0.6, h[1] + (e[1] - h[1]) * 0.6], K.copperH, 0.5);
// le bout du manche par-dessus la marmite : de son rebord du fond (y0) jusqu'à la soupe
function mancheDevant(K, h, e, y0) {
  const t = (y0 - h[1]) / (e[1] - h[1]);
  if (!(t > 0 && t < 1)) return '';
  const q = [h[0] + (e[0] - h[0]) * t, h[1] + (e[1] - h[1]) * t];
  return limb(q, e, 1.5, K.copper);
}
// le poing qui tient (un rond de peau, comme au kit)
const poing = (c, h) => E(h[0], h[1], 2.1, 2.1, c.hand || c.skin);
// Le bol de bois (x, y : le milieu de sa bouche), plein ou vide, avec sa vapeur
function bol(x, y, plein, n) {
  const d = `M${r2(x - 3.4)},${r2(y)} Q${r2(x - 3.2)},${r2(y + 3.4)} ${r2(x)},${r2(y + 3.5)} Q${r2(x + 3.2)},${r2(y + 3.4)} ${r2(x + 3.4)},${r2(y)} Z`;
  return P(d, BOIS, 0.8) + P(`M${r2(x + 1)},${r2(y + 0.4)} Q${r2(x + 2.6)},${r2(y + 2.8)} ${r2(x + 0.4)},${r2(y + 3.3)} Q${r2(x + 3)},${r2(y + 3)} ${r2(x + 3.2)},${r2(y + 0.4)} Z`, BOIS_S, 0)
    + L([x - 2.6, y + 1], [x - 2, y + 2.4], BOIS_H, 0.6)
    + E(x, y, 3.5, 0.95, BOIS_H, 0.8) + (plein ? E(x, y + 0.1, 2.8, 0.6, SOUPE, 0.4) + E(x - 0.8, y, 0.8, 0.22, SOUPE_H, 0) : E(x, y + 0.15, 2.8, 0.6, BOIS_S, 0))
    + (plein ? volute(x + 1, y - 0.8, n, 1) : '');
}
// Une poignée de grain : des grains qui volent (centre, dispersion, l'image)
const grains = (pts) => pts.map(([x, y, a]) => `<ellipse cx="${r2(x)}" cy="${r2(y)}" rx="0.55" ry="0.38" fill="${GRAIN}" stroke="${OUT}" stroke-width="0.3" transform="rotate(${a} ${r2(x)} ${r2(y)})"/>`).join('');
// Le coin du tablier relevé, plein de grain (x, y : le poing qui le tient)
function giron(c, x, y, k = 1) {
  const K = pal(c);
  const d = `M${r2(x - 0.6 * k)},${r2(y - 1)} Q${r2(x + 4.4 * k)},${r2(y - 2.4)} ${r2(x + 8.4 * k)},${r2(y - 0.6)} Q${r2(x + 7.8 * k)},${r2(y + 3.6)} ${r2(x + 3.6 * k)},${r2(y + 3.8)} Q${r2(x + 0.4 * k)},${r2(y + 3)} ${r2(x - 0.6 * k)},${r2(y - 1)} Z`;
  return P(d, K.apron, 0.8) + P(`M${r2(x + 4 * k)},${r2(y + 3.6)} Q${r2(x + 7.4 * k)},${r2(y + 3.2)} ${r2(x + 8.2 * k)},${r2(y - 0.4)} Q${r2(x + 6.4 * k)},${r2(y + 1.6)} ${r2(x + 4 * k)},${r2(y + 3.6)} Z`, K.apronS, 0)
    + E(x + 4.2 * k, y - 1.3, 3.2, 0.7, K.apronS, 0.5) + grains([[x + 3 * k, y - 1.5, 20], [x + 4.6 * k, y - 1.2, -30], [x + 5.8 * k, y - 1.6, 60]])
    + P(`M${r2(x + 1.6 * k)},${r2(y + 0.4)} Q${r2(x + 3.4 * k)},${r2(y + 1.6)} ${r2(x + 4.4 * k)},${r2(y + 3.4)}`, 'none', 0.4);
}

// ---- touiller ----
// De face, la marmite devant elle (ses pieds derrière) ; de trois quarts, devant elle à gauche de l'écran ; de dos, la
// marmite est cachée par son corps : les bras passent devant, la vapeur monte de chaque côté
function touiller({ view, n }) {
  const [a, b] = this.shoulders, K = pal(this), o = [[1.6, 0], [0, 0.7], [-1.6, 0], [0, -0.6]][n % 4];
  if (view === 'ne') {
    const w = n % 2 ? 0.5 : 0;
    return {
      expr: 'veille',
      left: '', right: '',
      // (derrière le buste : l'avant-bras, devant elle, est caché ; les coudes sortent sur les côtés, celui qui touille va
      // et vient)
      under: arm(this, a, [a[0] + 2.4, a[1] + 9], [a[0] - 6, a[1] + 5.8]) + arm(this, b, [b[0] - 2.4 + o[0] * 0.5, b[1] + 9 + o[1]], [b[0] + 6 + o[0] * 0.6, b[1] + 5.6 + o[1] * 0.8]),
      over: volute(9.6, 33 + w, n, 1) + volute(38.8, 32.4 - w, (n + 2) % 4, -1)
    };
  }
  if (view === 'se') {
    const h = [17.4 + o[0], 45.2 + o[1]], e = [14.4 + o[0] * 0.5, 52.6 + o[1] * 0.3], m = [14.4, 52.4, 7];
    return {
      expr: 'veille',
      right: arm(this, b, [30.4, 42.8], [34.8, 38]),
      left: arm(this, a, h, [10.6, 41.6], manche(K, h, e) + poing(this, h)),
      over: marmite(m[0], m[1], m[2], n, this.uid, e) + mancheDevant(K, h, e, m[1] - m[2] * 0.3 - 0.5) + volute(9.4, 47.8, n, 1) + volute(19.8, 47.2, (n + 2) % 4, -1)
    };
  }
  const h = [28.6 + o[0], 45.2 + o[1]], e = [25.6 + o[0] * 0.5, 52 + o[1] * 0.3], m = [24, 51.8, 8];
  return {
    expr: 'veille',
    left: arm(this, a, [15.2, 42.8], [10.2, 38.4]),
    right: arm(this, b, h, [36.8, 41.6], manche(K, h, e) + poing(this, h)),
    over: marmite(m[0], m[1], m[2], n, this.uid, e) + mancheDevant(K, h, e, m[1] - m[2] * 0.3 - 0.5) + volute(17.6, 48.6, n, 1) + volute(31.6, 48, (n + 2) % 4, -1)
  };
}

// ---- goûter ----
// La louche monte (0), aux lèvres, l'autre main dessous pour ne rien perdre (1), elle attend le goût (2), puis rien :
// la louche redescend, elle baisse les yeux (3)
function gouter({ view, n }) {
  const [a, b] = this.shoulders, K = pal(this), i = n % 4, se = view === 'se';
  const expr = ['veille', 'concentree', 'pensive', 'triste'][i];
  if (view === 'ne') return { expr };
  // (de trois quarts, le bras proche, à gauche de l'écran ; de face, sa main gauche, à droite de l'écran)
  const k = se ? -1 : 1, bx = se ? 19.6 : 27.2, mx = se ? 21 : 24;
  const sh = se ? a : b;
  if (i === 0 || i === 3) {
    const h = se ? [11.4, 41.6] : [36.4, 41.6], bw = se ? [13.6, 33.4] : [34.2, 33.4];
    const lo = i === 3 ? (se ? [11, 44.6] : [36.8, 44.6]) : h, bwl = i === 3 ? (se ? [12.6, 36.6] : [35.4, 36.6]) : bw;
    const geste = louche(K, [lo[0] - k * 0.4, lo[1] + 3], bwl, k * 15) + arm(this, sh, lo, [sh[0] + k * 4.4, sh[1] + 4.6]);
    return se ? { expr, left: geste, right: arm(this, b, [30.4, 42.8], [34.8, 38]) } : { expr, right: geste, left: arm(this, a, [15.2, 42.8], [10.2, 38.4]) };
  }
  // aux lèvres : le cuilleron au coin de la bouche, le manche qui descend vers le poing ; la main dessous
  const bw = [bx + (se ? -0.6 : 0), 31.2], h = se ? [13.2, 37.4] : [33.2, 37.4];
  const dessous = se ? [21.2 + 0.4 * (i - 1), 35.6] : [mx + 1.6, 35.6];
  const autre = se ? b : a;
  return {
    expr,
    left: '', right: '',
    over: arm(this, autre, dessous, se ? [33.6, 41.6] : [14.8, 41.6], paume(this, [dessous[0], dessous[1] + 0.6], se ? 1 : -1, 0.85))
      + louche(K, h, bw, k * -10) + arm(this, sh, h, [sh[0] + k * 4.8, sh[1] + 6])
  };
}

// ---- servir ----
// Le bol de bois dans une main ; la louche plonge (0), remonte (1), verse (2) ; elle tend le bol plein (3)
function servir({ view, n }) {
  const [a, b] = this.shoulders, K = pal(this), i = n % 4, se = view === 'se';
  const expr = ['veille', 'veille', 'pensive', 'tendresse'][i];
  if (view === 'ne') return { expr };
  const d = se ? -2.6 : 0;
  const bolP = i === 3 ? [20.6 + d * 1.6, 41] : [19.4 + d, 43.2];
  const mainBol = [bolP[0] - 0.6, bolP[1] + 3.4];
  const bras1 = arm(this, a, mainBol, [a[0] - 3.8, a[1] + 6.6], poing(this, mainBol) + bol(bolP[0], bolP[1], i >= 2, n));
  // la louche : en bas (pleine, prête), au-dessus du bol, penchée pour verser, de retour au repos
  const L4 = [
    { h: [34.6 + d, 45], bw: [37.4 + d, 52.2], t: 0 },
    { h: [33.4 + d, 39.6], bw: [29.4 + d, 35.6], t: -15 },
    { h: [32.2 + d, 38.8], bw: [bolP[0] + 2.2, bolP[1] - 3.6], t: -60 },
    { h: [35.4 + d, 45.4], bw: [37.6 + d, 52.4], t: 0 }
  ][i];
  const coule = i === 2 ? `<path d="M${r2(bolP[0] + 0.8)},${r2(bolP[1] - 2.6)} Q${r2(bolP[0] + 0.4)},${r2(bolP[1] - 1.2)} ${r2(bolP[0] + 0.5)},${r2(bolP[1] - 0.2)}" fill="none" stroke="${OUT}" stroke-width="1.5" stroke-linecap="round"/><path d="M${r2(bolP[0] + 0.8)},${r2(bolP[1] - 2.6)} Q${r2(bolP[0] + 0.4)},${r2(bolP[1] - 1.2)} ${r2(bolP[0] + 0.5)},${r2(bolP[1] - 0.2)}" fill="none" stroke="${SOUPE}" stroke-width="0.7" stroke-linecap="round"/>` : '';
  const bras2 = louche(K, [L4.h[0] - 0.8, L4.h[1] + (i === 2 ? -0.6 : 2.6)], L4.bw, L4.t) + arm(this, b, L4.h, [b[0] + 3.6, b[1] + 6.4]);
  // de trois quarts, le bras du fond passe devant le buste quand il sert (il vient au-dessus du bol)
  if (se) return { expr, right: i === 0 || i === 3 ? bras2 : '', left: bras1, over: (i === 1 || i === 2 ? bras2 : '') + coule };
  return { expr, left: bras1, right: '', over: bras2 + coule };
}

// ---- le grain aux poules ----
// Le coin du tablier relevé dans une main, plein de grain ; l'autre puise (0), prend son élan (1), lance (2), les grains
// retombent (3). De trois quarts, elle lance devant elle, à gauche de l'écran ; de dos, sur le côté, à droite.
function grain({ view, n }) {
  const [a, b] = this.shoulders, i = n % 4;
  const expr = ['veille', 'veille', 'tendresse', 'tendresse'][i];
  if (view === 'ne') {
    const H = [[b[0] + 0.6, b[1] + 9], [b[0] + 4.6, b[1] + 1.6], [b[0] + 8.6, b[1] + 4.6], [b[0] + 7, b[1] + 9]][i];
    const vol = i === 2 ? grains([[43.4, 37.6, 10], [44.6, 39.8, -40], [42.6, 41.2, 70], [45.2, 36.4, 30]]) : i === 3 ? grains([[42.8, 50.6, 0], [44.4, 54.4, 50], [41.6, 57.4, -30], [45.4, 58.8, 20], [43.2, 60.8, 80]]) : '';
    return { expr, right: arm(this, b, H, i === 0 ? null : [b[0] + 3.8, b[1] + 6.2], i === 2 ? paume(this, [H[0] + 0.4, H[1]], -1, 0.9) : null), over: vol };
  }
  const se = view === 'se';
  if (se) {
    // le tablier relevé par la main du fond, devant le ventre ; la main proche lance
    const tient = [26.4, 44];
    const H = [[22.4, 43.4], [16.6, 37], [8.4, 38.8], [9.6, 44.2]][i];
    const vol = i === 2 ? grains([[4.6, 37.4, 10], [3.2, 39.8, -40], [5.6, 41.6, 70], [2.8, 36.2, 30]]) : i === 3 ? grains([[5, 50.6, 0], [3.2, 54.4, 50], [6.2, 57.6, -30], [2.4, 58.8, 20], [4.6, 61, 80]]) : '';
    return {
      expr,
      right: '',
      left: arm(this, a, H, i === 0 ? [13.4, 42.6] : [10.4, 40.4], i === 2 ? paume(this, [H[0] - 0.4, H[1]], 1, 0.9) : null),
      over: arm(this, b, tient, [32.6, 42.2], giron(this, tient[0], tient[1], -1) + poing(this, tient)) + vol
    };
  }
  // de face : le tablier relevé dans sa main droite (à gauche de l'écran), la gauche lance vers la droite de l'écran
  const tient = [17.4, 44.2];
  const H = [[22.6, 43], [33.4, 37.6], [40.6, 39.4], [39.6, 45]][i];
  const vol = i === 2 ? grains([[43.4, 37.4, 10], [44.8, 39.8, -40], [42.6, 41.6, 70], [45.4, 36.2, 30]]) : i === 3 ? grains([[42.8, 50.6, 0], [44.6, 54.4, 50], [41.8, 57.6, -30], [45.6, 58.8, 20], [43.4, 61, 80]]) : '';
  return {
    expr,
    left: arm(this, a, tient, [10.8, 41.4], poing(this, tient) + giron(this, tient[0], tient[1], 1)),
    right: '',
    over: arm(this, b, H, i === 0 ? [34.4, 43.4] : [37.4, 40.6], i === 2 ? paume(this, [H[0] + 0.4, H[1]], -1, 0.9) : null) + vol
  };
}

const GESTES = { touiller, gouter, servir, grain };
// Agathe et son geste : à passer à troupe.frame(…, vue, 'action', n)
// (la louche quitte son dos quand elle s'en sert ; pour le grain, elle y reste)
const avec = (c, nom) => ({ ...c, uid: `${c.uid}${nom.slice(0, 2)}`, geste: nom, sansLouche: nom !== 'grain' || c.sansLouche, pose: GESTES[nom] });

module.exports = { GESTES, avec, marmite, bol, volute };
