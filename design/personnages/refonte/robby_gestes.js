// Robby (anciennement Galet, Saturnin dans HISTOIRE.md ; fichiers du jeu : galet) : les gestes de son métier, le tailleur
// de runes, le mineur. Même branchement que les gestes de l'atelier (atelier/gestes.js) : chaque geste rend Robby prêt à
// passer à troupe.frame(…, vue, 'action', n) ; n va de 0 à 3 (quatre images).
//   tailler : le ciseau posé sur le bloc, le maillet levé, le coup ; au dernier coup la rune s'allume et la pierre chante ;
//   piocher : à la mine, la pioche levée, le coup ; au dernier coup, un éclat de cristal (la Mine de cristal, où il
//     cherche « la pierre qui chante ») ;
//   ecouter : il porte une pierre à son oreille, les yeux fermés : elle chante ;
//   porter : un bloc de pierre sur l'épaule, à petits pas ;
//   lire : la main à plat sur une pierre levée des Anciens, la rune s'éclaire sous sa paume, ligne après ligne.
// Naufragé (c.sansDon : HISTOIRE.md, § 6.2, il a oublié son don) : la rune reste éteinte, la pierre ne chante pas.
// Ses bras passent par troupe.arm, donc par ses manches ; a, b : ses épaules, à gauche et à droite de l'écran.
const { OUT, E, P, L, r2, arm } = require('../troupe');
const { pal, maillet, ciseau } = require('./robby_refonte');

const PIERRE = '#A9A49A', PIERRE_S = '#86817A', PIERRE_H = '#C2BDB2', GLOW = '#8FE3E8', CRISTAL = '#9FD8F0';

// le poing qui tient (un rond de peau granit)
const poing = (c, h) => E(h[0], h[1], 2.1, 2.1, c.hand || c.skin);
// la rune : son tracé gravé ; allumée, elle brille (un trait large et pâle dessous, le trait clair dessus)
const rune = (x, y, s, allumee) => {
  const d = `M${r2(x - 2 * s)},${r2(y - 2.3 * s)} L${x},${r2(y + 2.3 * s)} L${r2(x + 2 * s)},${r2(y - 2.3 * s)} M${x},${r2(y - 2.7 * s)} L${x},${r2(y + 3.1 * s)}`;
  return (allumee ? `<path d="${d}" fill="none" stroke="${GLOW}" stroke-width="${r2(2.4 * s)}" stroke-linecap="round" opacity="0.55"/>` : '')
    + `<path d="${d}" fill="none" stroke="${allumee ? '#E9FFFF' : OUT}" stroke-width="${r2((allumee ? 0.9 : 0.6) * s)}" stroke-linecap="round"/>`;
};
// la pierre qui chante : deux arcs clairs qui partent de (x, y) vers l'extérieur (k : +1 vers la droite), et une note
const chant = (x, y, k, n) => [1.6, 2.8].map((r, i) => `<path d="M${r2(x + k * r)},${r2(y - r * 0.8)} Q${r2(x + k * r * 1.35)},${y} ${r2(x + k * r)},${r2(y + r * 0.8)}" fill="none" stroke="${OUT}" stroke-width="1.3" stroke-linecap="round" opacity="${i === n % 2 ? 1 : 0.5}"/><path d="M${r2(x + k * r)},${r2(y - r * 0.8)} Q${r2(x + k * r * 1.35)},${y} ${r2(x + k * r)},${r2(y + r * 0.8)}" fill="none" stroke="#E9FFFF" stroke-width="0.5" stroke-linecap="round" opacity="${i === n % 2 ? 1 : 0.5}"/>`).join('')
  + `<g transform="rotate(-12 ${r2(x + k * 4.6)} ${r2(y - 3.4)})">${E(x + k * 4.6, y - 3.4, 0.9, 0.65, OUT, 0)}${L([x + k * 4.6 + 0.8, y - 3.4], [x + k * 4.6 + 0.8, y - 6.4], OUT, 0.5)}</g>`;
// les étincelles du ciseau sur la pierre
const etincelles = (x, y, k = 1) => [[0, -1], [0.75, -0.65], [-0.75, -0.65]].map(([dx, dy]) => L([x + dx * k * 1.2, y + dy * 1.2], [x + dx * k * 2.8, y + dy * 2.8], OUT, 1.3) + L([x + dx * k * 1.2, y + dy * 1.2], [x + dx * k * 2.8, y + dy * 2.8], '#F2C94C', 0.55)).join('');

// Le bloc de pierre à tailler (x, y : le coin du bas à gauche ; w, h : sa face), en perspective : la face, le dessus, le
// flanc à l'ombre, deux griffures
const bloc = (x, y, w = 9.8, h = 9.6) => P(`M${x},${r2(y - h)} L${r2(x + w)},${r2(y - h)} L${r2(x + w)},${y} L${x},${y} Z`, PIERRE)
  + P(`M${x},${r2(y - h)} L${r2(x + 1.8)},${r2(y - h - 2)} L${r2(x + w + 1.8)},${r2(y - h - 2)} L${r2(x + w)},${r2(y - h)} Z`, PIERRE_H, 0.9)
  + P(`M${r2(x + w)},${r2(y - h)} L${r2(x + w + 1.8)},${r2(y - h - 2)} L${r2(x + w + 1.8)},${r2(y - 2)} L${r2(x + w)},${y} Z`, PIERRE_S, 0.9)
  + L([x + 1.2, y - 2], [x + 3, y - 1.6], PIERRE_S, 0.4) + L([x + w - 2.6, y - h + 1.6], [x + w - 1.2, y - h + 2.4], PIERRE_S, 0.4);

// ---- tailler ----
// Le bloc devant lui (ses pieds derrière) ; le ciseau tenu de la main droite (à gauche de l'écran) sur le dessus du bloc,
// le maillet de l'autre : levé (0, 2), qui frappe la tête du ciseau (1, 3 : les étincelles) ; au dernier coup, la rune
// gravée sur la face du bloc s'allume, la pierre chante. (Ses bras de vieil homme sont courts : le bloc est devant lui, à
// portée des deux mains, et non sur le côté.)
function tailler({ view, n }) {
  const [, b] = this.shoulders, K = pal(this), i = n % 4, frappe = i % 2 === 1;
  const allumee = i === 3 && !this.sansDon;
  const expr = allumee ? 'tendresse' : frappe ? 'decidee' : 'concentree';
  const [a] = this.shoulders;
  if (view === 'ne') {
    // de dos : le bloc est devant lui, caché par son corps ; le maillet levé dépasse au-dessus de l'épaule, la frappe fait
    // jaillir les étincelles de chaque côté
    if (!frappe) return { expr, left: '', under: arm(this, a, [a[0] + 4.6, a[1] + 7.6], [a[0] - 3.4, a[1] + 5.4]), right: maillet(K, [b[0] + 2.6, b[1] - 8.6], 160) + arm(this, b, [b[0] + 2.6, b[1] - 8.6], [b[0] + 5.4, b[1] - 2]) };
    return { expr, left: '', right: '', under: arm(this, a, [a[0] + 4.6, a[1] + 7.6], [a[0] - 3.4, a[1] + 5.4]) + arm(this, b, [b[0] - 4.8, b[1] + 6], [b[0] + 3.6, b[1] + 6.4]), over: etincelles(9.4, 52, 1) + etincelles(38.6, 52, -1) + (allumee ? chant(40.6, 46.4, 1, n) : '') };
  }
  const se = view === 'se', d = se ? -4.4 : 0;
  const B = [17 + d, 62], tete = [20.2 + d, 45.6], pointe = [21.9 + d, 53.4], tient = [20.4 + d, 47.2];
  const ciseauBras = ciseau(K, tete, pointe) + arm(this, a, tient, [a[0] - 3, a[1] + 6], E(tient[0], tient[1], 2.1, 2.1, this.hand || this.skin));
  const H = frappe ? [26.8 + d * 0.4, 44.8] : [b[0] + 2.6, b[1] - 8.6];
  // (frappe : la tête du maillet tombe sur la tête du ciseau)
  const rot = frappe ? r2(Math.atan2(-(tete[0] - H[0]), tete[1] - H[1]) * 180 / Math.PI) : 160;
  const marteau = maillet(K, H, rot) + arm(this, b, H, frappe ? [b[0] + 2, b[1] + 6.4] : [b[0] + 5.4, b[1] - 2]);
  const over = bloc(B[0], B[1], 11, 6.6) + rune(B[0] + 5.6, B[1] - 3.2, 0.62, allumee) + ciseauBras + marteau
    + (frappe ? etincelles(pointe[0], pointe[1] - 0.4, 1) : '') + (allumee ? chant(B[0] + 13.4, B[1] - 9, 1, n) : '');
  return { expr, left: '', right: '', over };
}

// ---- piocher ----
// La pioche : le manche de m (le bas, dans ses mains) à h (la tête) ; la tête d'acier en travers, son reflet
function pioche(m, h, k = 1) {
  const len = Math.hypot(h[0] - m[0], h[1] - m[1]) || 1, ux = (h[0] - m[0]) / len, uy = (h[1] - m[1]) / len, nx = -uy * k, ny = ux * k;
  const pt = (q, w) => [h[0] + ux * q + nx * w, h[1] + uy * q + ny * w];
  const fer = [pt(0.4, -5.4), pt(1.5, -2.6), pt(1.8, 0), pt(1.5, 2.4), pt(0.6, 5.8), pt(-0.6, 2.4), pt(-1, 0), pt(-0.6, -2.6)];
  return L(m, h, OUT, 3.4) + L(m, h, '#B07A45', 1.6) + L(m, [m[0] + ux * len * 0.55, m[1] + uy * len * 0.55], '#C99A62', 0.5)
    + P(`M${fer.map(p => `${r2(p[0])},${r2(p[1])}`).join(' L')} Z`, '#A9B1BB', 1) + L(pt(0.9, -3.8), pt(1.2, -1.2), '#E2E8EE', 0.6) + E(h[0], h[1], 1.1, 1.1, '#6E747E', 0.7);
}
// la roche de la mine, posée au sol (x, y : le bas) ; ouverte (le dernier coup), le cristal qui luit dans la fente
const roche = (x, y, cristal) => E(x, y - 0.2, 5, 1.3, 'rgba(40,55,20,.22)', 0)
  + P(`M${r2(x - 4.6)},${r2(y)} Q${r2(x - 5)},${r2(y - 4)} ${r2(x - 1.2)},${r2(y - 5)} Q${r2(x + 3.6)},${r2(y - 5.4)} ${r2(x + 4.6)},${r2(y - 1.6)} Q${r2(x + 4.8)},${r2(y + 0.2)} ${x},${r2(y + 0.3)} Z`, PIERRE)
  + P(`M${r2(x + 1.4)},${r2(y - 4.8)} L${r2(x + 0.6)},${r2(y - 2.6)} L${r2(x + 1.6)},${r2(y - 1.2)}`, 'none', 0.5)
  + (cristal ? P(`M${r2(x + 0.2)},${r2(y - 3.6)} L${r2(x + 1)},${r2(y - 5.6)} L${r2(x + 1.8)},${r2(y - 3.6)} L${r2(x + 1)},${r2(y - 2.6)} Z`, CRISTAL, 0.6) + L([x + 0.7, y - 4.6], [x + 1, y - 5.2], '#FFFFFF', 0.4)
    + [[-1, -1], [1, -1.2], [2.6, -0.4]].map(([dx, dy]) => L([x + 1 + dx * 1.2, y - 4.4 + dy * 1.2], [x + 1 + dx * 2.2, y - 4.4 + dy * 2.2], CRISTAL, 0.5)).join('') : '');
const eclats = (x, y) => [[-3.4, -2.6, 0.9], [-1.4, -4.4, 0.7], [2.6, -3.2, 0.8], [3.8, -1.4, 0.6]].map(([dx, dy, r]) => E(x + dx, y + dy, r, r * 0.8, '#9A8E80', 0.5)).join('');

// (les deux mains tiennent le manche ensemble, au milieu de la poitrine : avec ses bras courts, c'est le seul endroit
// que les deux atteignent ; la pioche longue fait le reste)
function piocher({ view, n }) {
  const [a, b] = this.shoulders, i = n % 4, frappe = i % 2 === 1, cristal = i === 3;
  const expr = cristal ? 'emerveillee' : frappe ? 'decidee' : 'concentree';
  const se = view === 'se';
  const m = se ? [23.6, 43.6] : [23, 43.6];
  // la tête de la pioche : levée sur le côté, au-dessus de l'épaule ; ou sur la roche
  const p = se ? [8.6, 62] : [39.4, 62];
  const tete = frappe ? (se ? [12.4, 57] : [35.6, 57]) : (se ? [9, 33] : [37.2, 32.6]);
  const l = Math.hypot(tete[0] - m[0], tete[1] - m[1]), u = [(tete[0] - m[0]) / l, (tete[1] - m[1]) / l];
  const haut = [r2(m[0] + u[0] * 1.6), r2(m[1] + u[1] * 1.6)];
  // de face, la main droite (à gauche de l'écran) tient le bas du manche, la gauche au-dessus ; de trois quarts, l'inverse
  const bas = se ? arm(this, b, m, [b[0] + 2.4, b[1] + 6]) : arm(this, a, m, [a[0] - 2.4, a[1] + 6]);
  const dessus = se ? arm(this, a, haut, [a[0] - 2.4, a[1] + 5.6]) : arm(this, b, haut, [b[0] + 2.4, b[1] + 5.6]);
  if (view === 'ne') {
    // de dos : les mains et la roche sont devant lui, cachées ; la pioche levée dépasse au-dessus de l'épaule, la frappe
    // fait jaillir les éclats de part et d'autre
    if (!frappe) return { expr, left: '', right: '', under: arm(this, a, m, [a[0] - 2.4, a[1] + 6]) + arm(this, b, haut, [b[0] + 2.4, b[1] + 5.6]), over: pioche(haut, [37.2, 32.6], -1) };
    return { expr, left: '', right: '', under: arm(this, a, m, [a[0] - 2.4, a[1] + 6]) + arm(this, b, haut, [b[0] + 2.4, b[1] + 5.6]), over: eclats(9.4, 60) + eclats(39.6, 60.4) };
  }
  return { expr, under: roche(...p, cristal), left: '', right: '', over: pioche(m, tete, se ? 1 : -1) + bas + dessus + (frappe ? eclats(tete[0], tete[1]) : '') };
}

// ---- écouter la pierre ----
// Il lève une pierre (0), la porte à son oreille, les yeux fermés (1, 2 : elle chante), la redescend (3) ; le maillet
// pend dans l'autre main
function ecouter({ view, n }) {
  const [a, b] = this.shoulders, K = pal(this), i = n % 4, se = view === 'se';
  const expr = ['veille', 'tendresse', 'tendresse', 'pensive'][i];
  if (view === 'ne') return { expr };
  // (ses bras de vieil homme n'atteignent pas tout à fait l'oreille : la pierre monte contre sa joue, sous l'oreille)
  const oreille = se ? [35.4, 30.4] : [35.2, 30.4];
  const H = [[35.4, 38.2], oreille, oreille, [35.2, 40.2]][i];
  const caillou = (x, y) => P(`M${r2(x - 2)},${r2(y + 0.6)} Q${r2(x - 2.4)},${r2(y - 1.6)} ${r2(x - 0.2)},${r2(y - 2)} Q${r2(x + 2)},${r2(y - 2.2)} ${r2(x + 2.2)},${r2(y - 0.2)} Q${r2(x + 2)},${r2(y + 1.6)} ${x},${r2(y + 1.6)} Q${r2(x - 1.6)},${r2(y + 1.6)} ${r2(x - 2)},${r2(y + 0.6)} Z`, PIERRE, 0.8)
    + L([x - 1, y - 1], [x + 0.4, y - 1.4], PIERRE_H, 0.5) + (this.sansDon ? '' : rune(x + 0.2, y, 0.32, i === 1 || i === 2));
  const droite = arm(this, b, H, i === 0 || i === 3 ? [b[0] + 4.2, b[1] + 5] : [b[0] + 6.4, b[1] + 1.6], caillou(H[0] - 0.8, H[1] - 1.4) + poing(this, H));
  const gauche = maillet(K, [14.8, 48.2], -8) + arm(this, a, [14.8, 48.2]);
  return { expr, left: gauche, right: '', over: droite + ((i === 1 || i === 2) && !this.sansDon ? chant(oreille[0] + 1.6, oreille[1] - 4.6, 1, n) : '') };
}

// ---- porter un bloc ----
// Le bloc sur l'épaule gauche (à droite de l'écran), tenu d'une main ; il plie un peu sous le poids (deux images)
function porter({ view, n }) {
  const [a, b] = this.shoulders, i = n % 2, dy = i ? 0.5 : 0;
  const expr = 'decidee';
  const bx = view === 'ne' ? 25.4 : 26.4, by = 37.8 + dy;
  const pierreB = bloc(bx, by, 9.4, 6);
  // (le maillet passe dans l'autre main, le long du corps)
  const K = pal(this), gauche = maillet(K, [a[0] - 1.6, a[1] + 9.4], -8) + arm(this, a, [a[0] - 1.6, a[1] + 9.4]);
  if (view === 'ne') return { expr, left: gauche, right: arm(this, b, [b[0] + 2, b[1] - 6.4 + dy], [b[0] + 4.6, b[1] + 1.4]), over: pierreB };
  return { expr, left: gauche, right: '', over: pierreB + arm(this, b, [b[0] + 3.2, b[1] - 6 + dy], [b[0] + 5, b[1] + 1.8]) };
}

// ---- lire la rune des Anciens ----
// La main à plat sur la pierre levée (à gauche de l'écran) ; la rune s'éclaire sous sa paume, une ligne à chaque image
function lire({ view, n }) {
  // (la pierre levée reste à la même place de trois quarts : décalée, elle sortirait du cadre)
  const [a] = this.shoulders, i = n % 4, d = 0;
  const expr = ['pensive', 'concentree', 'concentree', 'emerveillee'][i];
  if (view === 'ne') return { expr };
  const pierre = `M${1 + d},62 L${1.6 + d},36 Q${2 + d},30.6 ${6.4 + d},29.6 Q${10.8 + d},30.4 ${11.4 + d},36 L${12 + d},62 Z`;
  const lignes = [`M${4 + d},36 L${8.6 + d},36`, `M${6.3 + d},34.4 L${6.3 + d},44`, `M${4 + d},44 L${6.3 + d},40 L${8.6 + d},44`, `M${4.4 + d},48 L${8.2 + d},48`];
  const allume = this.sansDon ? -1 : i;
  let s = P(pierre, PIERRE) + `<path d="M${8.8 + d},31.6 Q${11 + d},36 ${11.2 + d},62 L${12 + d},62 L${11.4 + d},36 Q${10.8 + d},30.4 ${8.8 + d},31.6 Z" fill="${PIERRE_S}"/>` + P(pierre, 'none')
    + E(4.6 + d, 55, 1.6, 0.8, '#9DAE7C', 0);
  s += lignes.map((l, j) => (j <= allume ? `<path d="${l}" fill="none" stroke="${GLOW}" stroke-width="1.8" stroke-linecap="round" opacity=".55"/><path d="${l}" fill="none" stroke="#E9FFFF" stroke-width="0.6" stroke-linecap="round"/>` : `<path d="${l}" fill="none" stroke="${OUT}" stroke-width="0.5" stroke-linecap="round"/>`)).join('');
  // la main à plat sur la pierre, au milieu de la rune
  const h = [9.6 + d, 41.2];
  const main = P(`M${r2(h[0] - 1.4)},${r2(h[1] - 2.6)} L${r2(h[0] + 1.2)},${r2(h[1] - 2.6)} Q${r2(h[0] + 1.8)},${h[1]} ${r2(h[0] + 1.2)},${r2(h[1] + 2)} L${r2(h[0] - 1.4)},${r2(h[1] + 2)} Z`, this.hand || this.skin, 0.8)
    + [-0.6, 0.2].map(dd => L([h[0] - 1.2, h[1] + dd], [h[0] + 0.6, h[1] + dd], OUT, 0.35)).join('');
  return { expr, left: s + arm(this, a, h, [a[0] - 4.6, a[1] + 1.4], main), right: null };
}

const GESTES = { tailler, piocher, ecouter, porter, lire };
// Robby et son geste : à passer à troupe.frame(…, vue, 'action', n) ; le maillet reste dans sa main là où le geste ne la
// prend pas
const avec = (c, nom) => ({ ...c, uid: `${c.uid}${nom.slice(0, 2)}`, geste: nom, pose: GESTES[nom] });

module.exports = { GESTES, avec, bloc, rune };
