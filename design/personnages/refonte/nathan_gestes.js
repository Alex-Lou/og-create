// Nathan (anciennement Rivet, Jovin dans HISTOIRE.md ; fichiers du jeu : rivet) : les gestes de son métier, l'horloger-
// artificier. Même branchement que les gestes de l'atelier (atelier/gestes.js) : chaque geste rend Nathan prêt à passer à
// troupe.frame(…, vue, 'action', n) ; n va de 0 à 3 (quatre images).
//   visser : à l'établi, un petit mécanisme de laiton dans une main, le tournevis dans l'autre ; la pièce s'emboîte :
//     « clic » (HISTOIRE.md : il ne le dit que quand une pièce s'emboîte vraiment) ;
//   forger : à l'enclume, la pince et le marteau ; le fer rougi, les étincelles (Le Faubourg, sa forge) ;
//   remonter : il remonte Tic-Tac, l'abeille mécanique, qui s'envole… et s'arrête au mauvais moment ;
//   trier : sa boîte de vis, il en prend une, la regarde de près, la range (il trie ses vis, à son arrivée).
// Ses bras passent par troupe.arm, donc par ses manches (nathan_refonte.js) ; a, b : ses épaules, à gauche et à droite
// de l'écran.
const { OUT, E, P, L, limb, clip, r2, arm } = require('../troupe');
const { pal, rouage } = require('./nathan_refonte');

const ACIER = '#5E646C', ACIER_S = '#3E434A', ACIER_H = '#8A929C', BOIS = '#8A5A36', SOUCHE = '#9C7A52', SOUCHE_S = '#7A5C3A';
const FER = '#FF8A3C', FER_H = '#FFD25A';

// le poing qui tient (un rond de peau, ou le gant de forge)
const poing = (c, h) => E(h[0], h[1], 2.1, 2.1, c.gants ? pal(c).glove : c.hand || c.skin) + (c.gants ? E(h[0] - 0.6, h[1] - 0.6, 0.7, 0.5, '#B98858', 0) : '');
// la main ouverte, paume vers le ciel (on y pose Tic-Tac) ; k : le pouce vers la gauche (-1) ou la droite (1) de l'écran
function paume(c, [x, y], k) {
  const f = c.gants ? pal(c).glove : c.hand || c.skin;
  return P(`M${r2(x - 2.2)},${r2(y - 0.6)} Q${x},${r2(y + 0.4)} ${r2(x + 2.2)},${r2(y - 0.6)} Q${r2(x + 2.1)},${r2(y + 1.9)} ${x},${r2(y + 2)} Q${r2(x - 2.1)},${r2(y + 1.9)} ${r2(x - 2.2)},${r2(y - 0.6)} Z`, f, 0.9)
    + E(x + k * 2.2, y - 0.4, 0.8, 1, f, 0.75) + L([x - 1.2, y + 0.9], [x + 1.2, y + 0.9], OUT, 0.35);
}
// « clic » : trois petits traits clairs qui partent de (x, y)
const clic = (x, y) => [[-0.8, -0.75], [0, -1.1], [0.8, -0.75]].map(([dx, dy]) => L([x + dx * 1.2, y + dy * 1.2], [x + dx * 2.6, y + dy * 2.6], OUT, 1.5) + L([x + dx * 1.2, y + dy * 1.2], [x + dx * 2.6, y + dy * 2.6], '#FFF6CC', 0.6)).join('');
// des étincelles : de petits traits jaunes et orangés qui jaillissent de (x, y) ; n change leur gerbe
const etincelles = (x, y, n) => (n % 2 ? [[-3.6, -2.4], [-1.6, -4], [2.4, -3.6], [4, -1.6], [0.6, -4.6]] : [[-3.2, -3.2], [-0.4, -4.4], [1.8, -4], [3.6, -2.6], [-4.2, -1]])
  .map(([dx, dy], i) => L([x + dx * 0.45, y + dy * 0.45], [x + dx, y + dy], i % 2 ? FER : FER_H, 0.7) + E(x + dx * 1.15, y + dy * 1.15, 0.28, 0.28, FER_H, 0)).join('');

// Le petit mécanisme de laiton qu'il assemble : la platine ronde, un rouage, deux vis, le trou de la vis qu'il serre
function mecanisme(c, x, y, n) {
  const K = pal(c);
  return E(x, y, 2.9, 2.7, K.brass, 0.9) + E(x + 0.8, y + 0.7, 1.9, 1.6, K.brassS, 0) + rouage(K, x - 0.6, y - 0.4, 1.5, n * 22.5)
    + E(x + 1.6, y - 1.4, 0.32, 0.32, K.steel, 0.3) + E(x - 1.8, y + 1.4, 0.32, 0.32, K.steel, 0.3) + E(x + 1.3, y + 0.9, 0.4, 0.4, OUT, 0);
}
// Le tournevis : manche rouge au poing (h), pointe en t ; tour : le manche tourne (la bande claire se déplace)
function tournevis(c, h, t, tour) {
  const K = pal(c), m = [h[0] + (t[0] - h[0]) * 0.42, h[1] + (t[1] - h[1]) * 0.42];
  const lo = [h[0] - (t[0] - h[0]) * 0.18, h[1] - (t[1] - h[1]) * 0.18];
  return limb(m, t, 0.6, K.steel) + limb(lo, m, 1.6, K.red) + L([lo[0] + (m[0] - lo[0]) * (0.3 + tour * 0.3), lo[1] + (m[1] - lo[1]) * (0.3 + tour * 0.3)], [lo[0] + (m[0] - lo[0]) * (0.5 + tour * 0.3), lo[1] + (m[1] - lo[1]) * (0.5 + tour * 0.3)], '#F08A80', 0.5);
}
// L'enclume sur sa souche : (x, y) le milieu de la table de l'enclume ; le fer rougi posé dessus
function enclume(x, y, uid, chaud = true) {
  const t = `M${r2(x - 6.6)},${r2(y)} Q${r2(x - 9)},${r2(y - 0.2)} ${r2(x - 9.4)},${r2(y - 1.6)} Q${r2(x - 7.4)},${r2(y - 1.8)} ${r2(x - 5.4)},${r2(y - 2)} L${r2(x + 5.6)},${r2(y - 2)} L${r2(x + 5.6)},${r2(y + 0.6)} L${r2(x + 3.4)},${r2(y + 1.2)} L${r2(x + 3)},${r2(y + 3.4)} L${r2(x + 4.6)},${r2(y + 4.8)} L${r2(x - 4.6)},${r2(y + 4.8)} L${r2(x - 3)},${r2(y + 3.4)} L${r2(x - 3.4)},${r2(y + 1.2)} Z`;
  const souche = `M${r2(x - 5.4)},${r2(y + 4.6)} L${r2(x + 5.4)},${r2(y + 4.6)} L${r2(x + 5.8)},${r2(y + 10.2)} Q${x},${r2(y + 11.2)} ${r2(x - 5.8)},${r2(y + 10.2)} Z`;
  return P(souche, SOUCHE) + clip(`${uid}so`, souche, `<rect x="${r2(x + 2)}" y="${r2(y + 4)}" width="5" height="8" fill="${SOUCHE_S}"/><path d="M${r2(x - 3.6)},${r2(y + 6)} L${r2(x - 3.4)},${r2(y + 9.6)} M${r2(x - 0.6)},${r2(y + 6.2)} L${r2(x - 0.4)},${r2(y + 10)}" stroke="${SOUCHE_S}" stroke-width="0.4"/>`) + P(souche, 'none')
    + P(t, ACIER) + clip(`${uid}en`, t, `<rect x="${r2(x + 1.6)}" y="${r2(y - 3)}" width="6" height="9" fill="${ACIER_S}"/><rect x="${r2(x - 5.4)}" y="${r2(y - 2)}" width="11" height="0.7" fill="${ACIER_H}"/>`) + P(t, 'none')
    + (chaud ? P(`M${r2(x - 2.8)},${r2(y - 2)} L${r2(x + 2)},${r2(y - 2.3)} L${r2(x + 2.2)},${r2(y - 3.2)} L${r2(x - 2.6)},${r2(y - 3)} Z`, FER, 0.6) + L([x - 1.8, y - 2.6], [x + 1.2, y - 2.8], FER_H, 0.45) : '');
}
// Le marteau de forge : manche de bois du poing (h) à la tête (t), la tête d'acier en travers
function marteau(h, t) {
  const len = Math.hypot(t[0] - h[0], t[1] - h[1]) || 1, ux = (t[0] - h[0]) / len, uy = (t[1] - h[1]) / len;
  const lo = [h[0] - ux * 1.4, h[1] - uy * 1.4], nx = -uy, ny = ux;
  const tete = `M${r2(t[0] + nx * 2.2 - ux * 1.1)},${r2(t[1] + ny * 2.2 - uy * 1.1)} L${r2(t[0] + nx * 2.2 + ux * 1.1)},${r2(t[1] + ny * 2.2 + uy * 1.1)} L${r2(t[0] - nx * 1.6 + ux * 1.1)},${r2(t[1] - ny * 1.6 + uy * 1.1)} L${r2(t[0] - nx * 1.6 - ux * 1.1)},${r2(t[1] - ny * 1.6 - uy * 1.1)} Z`;
  return limb(lo, t, 1.2, BOIS) + P(tete, ACIER, 0.8) + L([t[0] + nx * 1.6 - ux * 0.6, t[1] + ny * 1.6 - uy * 0.6], [t[0] - nx * 1 - ux * 0.6, t[1] - ny * 1 - uy * 0.6], ACIER_H, 0.4);
}
// La pince de forge : deux mors du poing (h) au bout (t)
const pince = (h, t) => limb(h, t, 0.55, ACIER_S) + limb([h[0], h[1] + 0.6], [t[0], t[1] + 0.5], 0.55, ACIER_S);

// Tic-Tac, l'abeille mécanique : corps de laiton rayé, tête d'acier ronde, son grand œil, un rivet ; les ailes de verre
// (vole : battues, en deux images) ; arret : l'œil en croix, il s'est arrêté ; k : tourné vers la gauche (-1) ou la droite
function tictac(c, x, y, { vole = false, n = 0, arret = false, k = 1, cle = 0 } = {}) {
  const K = pal(c), id = `${c.uid}tt${n}${vole ? 'v' : ''}${arret ? 'a' : ''}`;
  const corps = `M${r2(x - 2.3)},${y} a2.3,1.7 0 1,0 4.6,0 a2.3,1.7 0 1,0 -4.6,0 Z`;
  const aile = (dx, dy, a) => `<ellipse cx="${r2(x + dx)}" cy="${r2(y + dy)}" rx="1.1" ry="2" fill="#E2F2F8" fill-opacity="0.85" stroke="${OUT}" stroke-width="0.45" transform="rotate(${a} ${r2(x + dx)} ${r2(y + dy)})"/>`;
  let s = '';
  s += vole ? (n % 2 ? aile(-0.6, -2.2, -30) + aile(0.6, -2.4, 20) : aile(-1.2, -1.6, -60) + aile(0.2, -2.6, -5)) : aile(-0.4, -1.8, -40);
  s += P(corps, K.brass) + clip(id, corps, [-1, 0.4].map(dx => `<rect x="${r2(x + dx * k)}" y="${r2(y - 2)}" width="0.8" height="4" fill="${K.brassS}"/>`).join('')) + P(corps, 'none');
  // la clé de remontoir sur son dos : elle tourne (cle : son angle)
  s += `<g transform="rotate(${cle} ${r2(x - k * 1.6)} ${r2(y - 1.6)})">${limb([x - k * 1.2, y - 1.2], [x - k * 1.6, y - 2.4], 0.4, K.brass)}${E(x - k * 2.2, y - 2.8, 0.75, 0.45, K.brass, 0.4)}${E(x - k * 1, y - 2.9, 0.75, 0.45, K.brass, 0.4)}</g>`;
  // la tête, l'œil (ou la croix de l'arrêt), le rivet, le dard
  const hx = x + k * 2.4, hy = y - 0.6;
  s += E(hx, hy, 1.55, 1.45, K.steel, 0.7) + E(hx - k * 0.4, hy - 0.6, 0.5, 0.3, '#E2E8EE', 0) + E(hx - k * 0.7, hy - 1, 0.22, 0.22, K.brassH, 0.25);
  s += arret ? P(`M${r2(hx + k * 0.1 - 0.5)},${r2(hy - 0.5)} l1,1 M${r2(hx + k * 0.1 + 0.5)},${r2(hy - 0.5)} l-1,1`, 'none', 0.45)
    : E(hx + k * 0.3, hy, 0.62, 0.7, OUT, 0) + E(hx + k * 0.12, hy - 0.25, 0.25, 0.25, '#FFFFFF', 0);
  s += P(`M${r2(x - k * 2.3)},${r2(y + 0.2)} L${r2(x - k * 3.2)},${r2(y + 0.5)} L${r2(x - k * 2.3)},${r2(y + 0.8)} Z`, OUT, 0);
  return s;
}

// ---- visser ----
function visser({ view, n }) {
  const [a, b] = this.shoulders, i = n % 4, d = view === 'se' ? -1.8 : 0;
  const expr = ['concentree', 'concentree', 'concentree', 'sourire'][i];
  if (view === 'ne') {
    // de dos : les bras devant lui, cachés par le corps ; le coude qui tourne le tournevis va et vient ; le « clic »
    const o = [0, 0.6, 0, 0.6][i];
    return { expr, left: '', right: '', under: arm(this, a, [a[0] + 3, a[1] + 7.6], [a[0] - 5, a[1] + 5.6]) + arm(this, b, [b[0] - 3, b[1] + 7.2 - o], [b[0] + 5.6, b[1] + 5.2 - o]), over: i === 3 ? clic(38.4, 30) : '' };
  }
  const m = [21.6 + d, 39], tient = [20.6 + d, 41.8];
  const h = [[27.8, 39.6], [27.6, 39.2], [27.8, 39.6], [28.2, 40.2]][i].map((v, j) => (j ? v : v + d));
  const t = [m[0] + 1.3, m[1] + 0.9];
  const gauche = arm(this, a, tient, [a[0] - 4.2, a[1] + 6.4], mecanisme(this, m[0], m[1], i) + poing(this, tient));
  const droite = arm(this, b, h, [b[0] + 3.6, b[1] + 8], tournevis(this, h, t, i % 2) + poing(this, h));
  const over = i === 3 ? clic(m[0] + 1.4, m[1] - 3.2) : '';
  // de trois quarts, le bras du fond passe devant le buste pour visser
  if (view === 'se') return { expr, right: '', left: gauche, over: droite + over };
  return { expr, left: gauche, right: droite, over };
}

// ---- forger ----
// Le marteau levé (0), qui frappe le fer (1 : les étincelles), levé (2), qui frappe (3) ; la pince tient le fer
function forger({ view, n }) {
  const [a, b] = this.shoulders, i = n % 4, frappe = i % 2 === 1;
  const expr = frappe ? 'decidee' : 'concentree';
  if (view === 'ne') {
    // de dos : l'enclume est cachée par le corps ; le marteau levé dépasse au-dessus de l'épaule, la frappe fait jaillir
    // les étincelles de chaque côté
    if (!frappe) return { expr, left: '', under: arm(this, a, [a[0] + 3, a[1] + 8.6], [a[0] - 4.6, a[1] + 6]), right: marteau([b[0] + 3.2, b[1] - 4.4], [b[0] + 6.6, b[1] - 11.2]) + arm(this, b, [b[0] + 3.2, b[1] - 4.4], [b[0] + 5.6, b[1] + 3]) };
    return { expr, left: '', right: '', under: arm(this, a, [a[0] + 3, a[1] + 8.6], [a[0] - 4.6, a[1] + 6]) + arm(this, b, [b[0] - 3, b[1] + 9], [b[0] + 5.4, b[1] + 5]), over: etincelles(8.6, 50, n) + etincelles(39.4, 50.4, n + 1) };
  }
  const se = view === 'se', x = se ? 18 : 24, y = 52, d = se ? -1.8 : 0;
  // de face, la pince dans sa main droite (à gauche de l'écran) et le marteau dans l'autre ; de trois quarts, l'enclume
  // est devant lui à gauche : le bras proche frappe, celui du fond tient la pince (à portée de ses bras, membres.js)
  const pinceMain = se ? b : a, marteauMain = se ? a : b;
  const tient = se ? [24.8, 42.2] : [18.2, 44.8];
  const pinceD = pince([tient[0] + (se ? -1 : 1), tient[1] + 0.4], [x - 1.8, y - 2.8]);
  const brasPince = arm(this, pinceMain, tient, se ? [b[0] + 2.4, b[1] + 7.4] : [a[0] - 3.6, a[1] + 7.4], pinceD + poing(this, tient));
  const H = frappe ? (se ? [18, 43.6] : [x + 4.6, y - 7.4]) : (se ? [a[0] - 2.6 + d, a[1] - 3.6] : [b[0] + 2.6 + d, b[1] - 3.6]);
  const tete = frappe ? [x + 0.4, y - 4.4] : (se ? [a[0] - 3.6 + d, a[1] - 11.2] : [b[0] + 3.6 + d, b[1] - 11.2]);
  const brasMarteau = marteau(H, tete) + arm(this, marteauMain, H, frappe ? (se ? [a[0] - 4.4, a[1] + 6.4] : [b[0] + 4.4 + d, b[1] + 6.4]) : (se ? [a[0] - 5.4, a[1] + 3] : [b[0] + 5.4 + d, b[1] + 3]));
  const over = enclume(x, y, this.uid, true) + brasPince + brasMarteau + (frappe ? etincelles(x + 0.4, y - 3.4, n) : '');
  return { expr, left: '', right: '', over };
}

// ---- remonter Tic-Tac ----
// Tic-Tac dans sa main ; il tourne la clé (0, 1) ; Tic-Tac s'envole (2)… et s'arrête net, il retombe dans sa main (3)
function remonter({ view, n }) {
  const [a, b] = this.shoulders, i = n % 4, d = view === 'se' ? -1.8 : 0;
  const expr = ['concentree', 'concentree', 'sourire', 'ironique'][i];
  if (view === 'ne') return { expr };
  const main = [20.6 + d, 41.4];
  const gauche = arm(this, a, main, [a[0] - 4, a[1] + 6.6], paume(this, main, 1));
  let tt = '', droite;
  if (i < 2) {
    // il pince la clé et la tourne (Tic-Tac regarde vers l'extérieur : sa clé est du côté de la main qui la tourne, rien ne
    // se croise)
    tt = tictac(this, main[0] + 0.2, main[1] - 2.4, { k: -1, cle: i ? 90 : 0 });
    const h = [main[0] + 4.6, main[1] - 4.8];
    droite = arm(this, b, h, [b[0] + 4.4, b[1] + 7.4]);
  } else {
    droite = arm(this, b, [b[0] + 1.6 + d, b[1] + 11]);
    // (il s'envole au-dessus de son épaule gauche, hors du visage : deux petits traits de vol derrière lui)
    tt = i === 2 ? tictac(this, 40.4 + d, 13.6, { vole: true, n, k: -1 }) + L([36.4 + d, 19.4], [37.8 + d, 17.6], OUT, 0.5) + L([38.4 + d, 20.4], [39.4 + d, 18.6], OUT, 0.5)
      : tictac(this, main[0] + 0.6, main[1] - 5.6, { arret: true, k: 1 }) + L([main[0] - 1.6, main[1] - 9.4], [main[0] - 1.6, main[1] - 8], OUT, 0.5) + L([main[0] + 2.6, main[1] - 9.6], [main[0] + 2.6, main[1] - 8.2], OUT, 0.5);
  }
  // de trois quarts, le bras du fond passe devant le buste pour tourner la clé
  if (view === 'se') return { expr, right: i < 2 ? '' : droite, left: gauche, over: (i < 2 ? droite : '') + tt };
  return { expr, left: gauche, right: droite, over: tt };
}

// ---- trier les vis ----
// La boîte de vis dans une main ; il en prend une (0), la regarde de tout près (1), la range (2), la boîte est rangée,
// « clic » (3)
const boite = (x, y) => `<rect x="${r2(x - 4)}" y="${r2(y - 2)}" width="8" height="4" rx="0.8" fill="#B8C0C8" stroke="${OUT}" stroke-width="0.9"/>`
  + `<rect x="${r2(x - 3.2)}" y="${r2(y - 1.4)}" width="6.4" height="1.6" rx="0.5" fill="#6E7680"/>` + L([x, y - 1.4], [x, y + 0.2], OUT, 0.4)
  + [[-2.2, -0.9], [-1.1, -1.1], [1, -0.8], [2.2, -1]].map(([dx, dy]) => E(x + dx, y + dy, 0.55, 0.45, '#D9C27A', 0.4)).join('');
const vis = (x, y, a) => `<g transform="rotate(${a} ${r2(x)} ${r2(y)})">${L([x, y], [x + 2, y], OUT, 1.2)}${L([x, y], [x + 2, y], '#B8C0C8', 0.55)}${E(x, y, 0.7, 0.7, '#D9C27A', 0.45)}</g>`;
function trier({ view, n }) {
  const [a, b] = this.shoulders, i = n % 4, d = view === 'se' ? -1.8 : 0;
  const expr = ['veille', 'examine', 'concentree', 'sourire'][i];
  if (view === 'ne') return { expr };
  if (view === 'se') {
    // de trois quarts, la boîte dans la main du fond, devant le ventre ; la main proche pioche, regarde la vis de près
    // (au bord du visage, du côté du profil), la range (à portée de ses bras, membres.js)
    const bx = 24.6, by = 42.6, tient = [bx + 1.4, by + 2.2];
    const fond = arm(this, b, tient, [b[0] + 2.4, b[1] + 7.4], boite(bx, by) + poing(this, tient));
    const H = [[bx - 1.8, by - 1.8], [11.4, 25.6], [bx - 2.4, by - 2.6], [a[0] - 1.6, a[1] + 11]][i];
    const v = i === 0 ? vis(H[0] + 1, H[1] - 1.6, -120) : i === 1 ? vis(H[0] + 0.6, H[1] - 2.4, -80) : i === 2 ? vis(H[0] + 1, H[1] - 1.4, 100) : '';
    const proche = arm(this, a, H, i === 3 ? null : i === 1 ? [a[0] - 6, a[1] + 3.4] : [a[0] - 4.6, a[1] + 6.4]) + v;
    return { expr: i === 1 ? 'mefiante' : expr, right: '', left: '', over: fond + proche + (i === 3 ? clic(bx - 0.4, by - 3.4) : '') };
  }
  const bx = 21 + d, by = 42.4, tient = [bx - 1.4, by + 2.2];
  const gauche = arm(this, a, tient, [a[0] - 4, a[1] + 7], boite(bx, by) + poing(this, tient));
  // (la vis qu'il regarde de près est tenue à côté du visage, à hauteur des yeux, jamais devant)
  const H = [[bx + 1.8, by - 1.8], [38.4 + d, 27.6], [bx + 2.4, by - 2.6], [b[0] + 1.6 + d, b[1] + 11]][i];
  const v = i === 0 ? vis(H[0] - 1, H[1] - 1.6, -60) : i === 1 ? vis(H[0] - 0.6, H[1] - 2.4, -100) : i === 2 ? vis(H[0] - 1, H[1] - 1.4, 80) : '';
  const droite = arm(this, b, H, i === 3 ? null : i === 1 ? [b[0] + 6.4 + d, b[1] + 3.4] : [b[0] + 4.6 + d, b[1] + 6.4]) + v;
  const over = i === 3 ? clic(bx + 0.4, by - 3.4) : '';
  return { expr, left: gauche, right: droite, over };
}

const GESTES = { visser, forger, remonter, trier };
// Nathan et son geste : à passer à troupe.frame(…, vue, 'action', n)
const avec = (c, nom) => ({ ...c, uid: `${c.uid}${nom.slice(0, 2)}`, geste: nom, pose: GESTES[nom] });

module.exports = { GESTES, avec, tictac, enclume, marteau };
