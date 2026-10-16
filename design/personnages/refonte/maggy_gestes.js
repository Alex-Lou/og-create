// Maggy (anciennement Mélisse ; fichiers du jeu : melisse) : les gestes de la jardinière des lunes. Même branchement que
// les gestes de l'atelier (atelier/gestes.js) et que ceux de la troupe refondue : chaque geste rend Maggy prête à passer à
// troupe.frame(…, vue, 'action', n) ; n va de 0 à 3 (quatre images). Sa magie : le jardinage lunaire ; ses plantes
// poussent au rythme de la lune (HISTOIRE.md).
//   boite : la boîte à graines à deux mains ; elle l'ouvre, des graines lumineuses s'en envolent comme de petites lunes ;
//   semer : elle prend une graine dans la boîte, la laisse tomber, la terre luit ;
//   arroser : l'arrosoir de fer, la pluie fine de la pomme ;
//   herbes : elle cueille un brin au buisson d'herbes (lavande, sauge), le respire, le pose dans son panier (les herbes
//     des potions d'Agathe) ;
//   lunette : Lunette, son papillon de nuit, vient se poser sur le bord de son chapeau.
// a, b : ses épaules, à gauche et à droite de l'écran ; de face et de trois quarts, sa main droite est à gauche de
// l'écran (de dos, à droite). La boîte reste au creux de son bras droit quand le geste ne la prend pas.
const { OUT, E, P, L, r2, limb, arm } = require('../troupe');
const { pal, boite, croissant, feuille } = require('./maggy_refonte');

// de dos, les mains devant elle : le haut du bras le long du flanc jusqu'au coude plié, l'avant-bras caché par son corps
// (comme Maerys) ; e : le coude par rapport à l'épaule de gauche (la droite en miroir)
const coudesDeDos = (c, e) => { const [a, b] = c.shoulders; return arm(c, a, [r2(a[0] + e[0]), r2(a[1] + e[1])], undefined, '', 'epaule') + arm(c, b, [r2(b[0] - e[0]), r2(b[1] + e[1])], undefined, '', 'epaule'); };
// la boîte au creux du bras droit (comme au repos, maggy_refonte.js, restLeft)
const boiteAuBras = (c, view) => {
  const K = pal(c), a = c.shoulders[0];
  if (view === 'ne') return arm(c, a, [15.8, 42], [13.2, 40.2]);
  const k = view === 'se' ? -1.6 : 0;
  return boite(K, 21.8 + k, 43.6) + arm(c, a, [19.8 + k, 43.4], [13, 41]);
};
// Une graine qui luit, comme une petite lune : un halo pâle, le cœur doré
const graine = (x, y, r = 0.7) => `<circle cx="${r2(x)}" cy="${r2(y)}" r="${r2(r * 2.3)}" fill="#F6E7A0" opacity=".4"/>` + E(x, y, r, r, '#F2C94C', 0.4);

// ---- ouvrir la boîte à graines ----
function boitePose({ view, n }) {
  const [a, b] = this.shoulders, K = pal(this), i = n % 4, se = view === 'se';
  const expr = ['veille', 'sourire', 'tendresse', 'sourire'][i];
  // les graines qui s'envolent, de plus en plus haut, et un croissant de lumière
  // (elles montent de la boîte et s'en vont sur le côté, vers le ciel : jamais devant son visage)
  const k = se ? -1.6 : 0;
  const envol = i < 2 ? '' : (i === 2 ? [[22.8, 39.6, 0.6], [25.6, 38.6, 0.7], [24.2, 37.2, 0.5]] : [[30.6, 36.4, 0.65], [34.6, 32.2, 0.6], [37.6, 27.4, 0.55], [40.4, 22.8, 0.5]]).map(([x, y, r]) => graine(x + k, y, r)).join('')
    + (i === 3 ? `<g opacity=".9">${croissant(42 + k, 17.6, 1.5, '#F6E7A0')}</g>` : '');
  // de dos : la boîte devant elle, cachée ; les coudes pliés dépassent sous le châle ; les graines montent devant elle et
  // paraissent de chaque côté de son chapeau
  if (view === 'ne') return { expr, left: '', right: '', under: coudesDeDos(this, [-3, 8.6]), over: i < 2 ? '' : [[6.6, 28], [41.4, 26.4], [8.4, 19.4], [39.4, 17.8]].slice(0, i === 2 ? 2 : 4).map(([x, y]) => graine(x, y - (i === 3 ? 2 : 0), 0.6)).join('') };
  const x = se ? 22.4 : 24;
  return { expr, left: '', right: '', over: boite(K, x, 43.6, i > 0) + arm(this, a, [x - 3.6, 43.4], [a[0] - 3, a[1] + 5.2]) + arm(this, b, [x + 3.6, 43.4], [b[0] + 3, b[1] + 5.2]) + envol };
}

// ---- semer à la lune ----
// la terre qui luit, là où la graine est tombée : un petit tas de terre sombre, la lueur, un croissant dessus
const terreQuiLuit = (x, y, fort) => `<circle cx="${x}" cy="${r2(y - 0.6)}" r="${fort ? 3.4 : 2.2}" fill="#F6E7A0" opacity="${fort ? 0.45 : 0.25}"/>`
  + P(`M${r2(x - 2.6)},${r2(y + 0.6)} Q${x},${r2(y - 1.8)} ${r2(x + 2.6)},${r2(y + 0.6)} Z`, '#6B5138', 0.6) + (fort ? croissant(x + 0.2, y - 0.9, 0.7, '#F6E7A0') : E(x, y - 0.4, 0.5, 0.5, '#F2C94C', 0.3));
function semer({ view, n }) {
  const [a, b] = this.shoulders, i = n % 4, dos = view === 'ne';
  const expr = ['pensive', 'veille', 'lune', 'sourire'][i];
  // sa main gauche (à droite de l'écran ; de dos, à gauche) prend une graine dans la boîte (0), la tend au-dessus du sol
  // (1), la laisse tomber (2) ; la terre luit (3)
  const s = dos ? a : b, d = dos ? -1 : 1;
  const sol = [r2(s[0] + d * 6.4), 59.4];
  const h = i === 0 ? (dos ? [r2(s[0] + 3), r2(s[1] + 8)] : [24.8 + (view === 'se' ? -1.6 : 0), 42.4]) : [r2(s[0] + d * 4.6), r2(s[1] + 8.6)];
  const main = arm(this, s, h, i === 0 ? [r2(s[0] + d * 2.8), r2(s[1] + 5.6)] : [r2(s[0] + d * 3.4), r2(s[1] + 4.4)]) + (i === 1 ? graine(h[0], h[1] + 1.8, 0.45) : '');
  const tombe = i === 2 ? graine(sol[0] - d * 0.6, (h[1] + sol[1]) / 2 + 2, 0.5) + L([sol[0] - d * 0.6, h[1] + 3.6], [sol[0] - d * 0.6, (h[1] + sol[1]) / 2], '#F6E7A0', 0.4).replace('/>', ' opacity=".7"/>') : '';
  const terre = i >= 2 ? terreQuiLuit(sol[0], sol[1], i === 3) : '';
  const repos = dos ? arm(this, b, this.hands[1]) : boiteAuBras(this, view);
  return dos ? { expr, left: main, right: repos, under: terre, over: tombe } : { expr, left: repos, right: main, under: terre, over: tombe };
}

// ---- arroser ----
// L'arrosoir de fer : le corps, l'anse en arc, le long bec et sa pomme ; penché de a degrés autour de la main (l'anse) ;
// m : -1, le bec vers la gauche de l'écran
function arrosoir(K, h, a, m) {
  const corps = `M-3.6,1.4 L3.4,1.4 L3.8,7.6 Q0,8.6 -4,7.6 Z`;
  const s = P(corps, K.iron, 0.8) + `<path d="M0.8,1.6 L1.4,7.8" stroke="${K.ironS}" stroke-width="1.4"/>` + L([-3, 2.6], [2.8, 2.6], K.ironH, 0.5)
    + `<path d="M-3,1.4 Q0,-2.2 3,1.4" fill="none" stroke="${OUT}" stroke-width="1.8" stroke-linecap="round"/><path d="M-3,1.4 Q0,-2.2 3,1.4" fill="none" stroke="${K.ironS}" stroke-width="0.8" stroke-linecap="round"/>`
    + limb([-3.6, 5.6], [-8.6, 1.6], 0.9, K.iron) + `<g transform="rotate(-38 -9 1.3)">${E(-9, 1.3, 0.9, 1.4, K.ironH, 0.6)}</g>`;
  return `<g transform="translate(${r2(h[0])} ${r2(h[1])}) rotate(${r2(a)}) scale(${m} 1)">${s}</g>`;
}
// la pluie fine de la pomme, jusqu'au sol (trois gouttes qui descendent, plus nombreuses quand elle verse)
const pluieFine = (x, y, sol, n, fort) => Array.from({ length: fort ? 4 : 2 }, (_, j) => {
  const q = (j + 0.5 + (n % 2) * 0.4) / (fort ? 4 : 2), gx = x + (j % 2 ? 0.6 : -0.6) + q * 0.6, gy = y + (sol - y) * q;
  return P(`M${r2(gx)},${r2(gy - 0.9)} Q${r2(gx + 0.7)},${r2(gy + 0.2)} ${r2(gx)},${r2(gy + 0.7)} Q${r2(gx - 0.7)},${r2(gy + 0.2)} ${r2(gx)},${r2(gy - 0.9)} Z`, '#8FD3F2', 0.35);
}).join('');
function arroser({ view, n }) {
  const [a, b] = this.shoulders, K = pal(this), i = n % 4, dos = view === 'ne';
  const expr = ['veille', 'lune', 'lune', 'sourire'][i];
  // sa main gauche tient l'arrosoir par l'anse, sur le côté ; il se penche (1, 2), puis se relève (3)
  const s = dos ? a : b, d = dos ? -1 : 1;
  const h = [r2(s[0] + d * 4.2), r2(s[1] + 7.4 - (i === 1 || i === 2 ? 1.2 : 0))];
  const pente = [0, 28, 34, 8][i] * d;
  // (le bec part vers l'extérieur, loin de son corps ; il plonge quand elle verse)
  const can = arrosoir(K, h, pente, -d);
  // la pomme : au bout du bec, une fois penché
  const rad = pente * Math.PI / 180, bx = 9 * d, by = 1.3;
  const pomme = [h[0] + bx * Math.cos(rad) - by * Math.sin(rad), h[1] + bx * Math.sin(rad) + by * Math.cos(rad)];
  const eau = i === 1 || i === 2 ? pluieFine(pomme[0] + d * 0.4, pomme[1] + 1, 61, n, i === 2) : '';
  const tient = can + arm(this, s, h, [r2(s[0] + d * 3.4), r2(s[1] + 5)]);
  const repos = dos ? arm(this, b, this.hands[1]) : boiteAuBras(this, view);
  return dos ? { expr, left: tient, right: repos, over: eau } : { expr, left: repos, right: '', over: tient + eau };
}

// ---- cueillir les herbes ----
// Le buisson d'herbes au sol, à côté d'elle : la sauge (des feuilles grises et douces), les épis de lavande ; pris : le
// brin qui manque (n)
function buissonDHerbes(K, x, y, pris) {
  let s = '';
  for (const [dx, h, r] of [[-2.8, 11.6, -12], [-1, 14.2, -4], [1, 13.2, 5], [2.8, 10.8, 14]].slice(0, pris ? 3 : 4)) {
    const tx = x + dx + Math.sin(r * Math.PI / 180) * h, ty = y - h;
    s += L([x + dx, y], [tx, ty], K.stem, 0.6) + [0, 1, 2].map(j => E(tx - Math.sin(r * Math.PI / 180) * j * 1.1, ty + j * 1.1, 0.55, 0.75, j % 2 ? K.lavS : K.lavender, 0.3)).join('');
  }
  s += [[-3.6, -1.6, 40], [-1.8, -3, 10], [0.6, -2.6, -20], [2.8, -1.8, -45], [-0.4, -4.8, 0], [-2.4, -6.4, 25], [1.8, -6, -25]].map(([dx, dy, rr]) => feuille(x + dx, y + dy, 2.8, 1.15, rr + 180, '#9AAE8E', '#6E8A64')).join('');
  return E(x, y + 0.4, 5, 1.1, 'rgba(40,55,20,.18)', 0) + s;
}
// Le panier d'osier, ses brins d'herbes coupés ; pendu à sa main en (x, y)
function panier(K, [x, y], plein) {
  const by = y + 3;
  const corps = `M${r2(x - 3.8)},${r2(by)} L${r2(x - 3)},${r2(by + 3.6)} Q${x},${r2(by + 4.4)} ${r2(x + 3)},${r2(by + 3.6)} L${r2(x + 3.8)},${r2(by)} Q${x},${r2(by + 0.9)} ${r2(x - 3.8)},${r2(by)} Z`;
  return (plein ? L([x - 1.6, by + 0.2], [x - 2.4, by - 2.6], K.stem, 0.6) + E(x - 2.4, by - 2.8, 0.5, 0.7, K.lavender, 0.3) + L([x + 0.8, by], [x + 1.6, by - 2.2], K.stem, 0.6) + E(x + 1.6, by - 2.4, 0.5, 0.7, K.lavS, 0.3) : '')
    + `<path d="M${r2(x - 3)},${r2(by)} Q${x},${r2(y - 2.4)} ${r2(x + 3)},${r2(by)}" fill="none" stroke="${OUT}" stroke-width="1.6" stroke-linecap="round"/><path d="M${r2(x - 3)},${r2(by)} Q${x},${r2(y - 2.4)} ${r2(x + 3)},${r2(by)}" fill="none" stroke="${K.woodH}" stroke-width="0.7" stroke-linecap="round"/>`
    + P(corps, K.woodH, 0.8) + [by + 1.4, by + 2.6].map(yy => `<path d="M${r2(x - 3.3)},${r2(yy)} Q${x},${r2(yy + 0.8)} ${r2(x + 3.3)},${r2(yy)}" fill="none" stroke="${K.wood}" stroke-width="0.4"/>`).join('');
}
function herbes({ view, n }) {
  const [a, b] = this.shoulders, K = pal(this), i = n % 4, dos = view === 'ne';
  const expr = ['concentree', 'veille', 'lune', 'sourire'][i];
  // le buisson à sa droite (à gauche de l'écran ; de dos, à droite), le panier dans sa main gauche
  const s = dos ? b : a, d = dos ? 1 : -1, o = dos ? a : b, e = -d;
  const bx = r2(24 + d * 16.4), buisson = buissonDHerbes(K, bx, 61.4, i > 0);
  // la main droite : vers le buisson (0, 1), le brin respiré sous le nez (2), puis au panier (3)
  const hp = [r2(o[0] + e * 1.6), r2(o[1] + 9.6)];
  const h = [[r2(s[0] + d * 6.2), r2(s[1] + 9.2)], [r2(s[0] + d * 5.6), r2(s[1] + 8.4)], [r2(24 + d * 2.4 + (view === 'se' ? -1.6 : 0)), 31.6], [r2(hp[0] - e * 1.4), r2(hp[1] + 0.6)]][i];
  const brin = i === 1 || i === 2 ? L([h[0], h[1]], [h[0] + d * 0.6, h[1] - 3.4], K.stem, 0.6) + [0, 1].map(j => E(h[0] + d * 0.6, h[1] - 3.4 + j * 1, 0.5, 0.7, K.lavender, 0.3)).join('') : '';
  const cueille = arm(this, s, h, i === 2 ? [r2(s[0] + d * 2.6), r2(s[1] + 4.6)] : [r2(s[0] + d * 3.2), r2(s[1] + 4.8)]) + brin;
  const tientPanier = panier(K, hp, i === 3) + arm(this, o, hp, [r2(o[0] + e * 2.4), r2(o[1] + 5)]);
  if (dos) return { expr, left: tientPanier, right: cueille, under: buisson };
  // (le brin respiré, sous son nez : la main passe devant ses cheveux)
  return i === 2 ? { expr, left: '', right: tientPanier, under: buisson, over: cueille } : { expr, left: cueille, right: tientPanier, under: buisson };
}

// ---- Lunette ----
// Lunette, le papillon de nuit : les ailes lilas sombre, deux croissants clairs dessus, le corps duveteux, les antennes en
// plumes ; vol : les ailes ouvertes (une image sur deux, elles se replient) ; m : -1 tourné vers la gauche
function papillon(x, y, ouvert, m = 1, s = 1) {
  const ailes = ouvert
    ? P('M0,0 Q-3.6,-3.6 -4.6,-0.6 Q-4.2,1.6 -1,0.8 Z', '#8E7EB4', 0.6) + P('M0,0 Q3.6,-3.6 4.6,-0.6 Q4.2,1.6 1,0.8 Z', '#7A6AA0', 0.6)
      + P('M0,0.4 Q-2.8,2.8 -2.2,3.6 Q-0.8,3.4 0,1 Z', '#7A6AA0', 0.55) + P('M0,0.4 Q2.8,2.8 2.2,3.6 Q0.8,3.4 0,1 Z', '#6A5A90', 0.55)
      + croissant(-2.8, -0.8, 0.7, '#F4EEDF') + croissant(2.8, -0.8, 0.7, '#F4EEDF')
    : P('M0,0 Q-1.6,-3.8 -2.6,-1 Q-2.2,0.8 -0.4,0.6 Z', '#8E7EB4', 0.6) + P('M0,0 Q1.6,-3.8 2.6,-1 Q2.2,0.8 0.4,0.6 Z', '#7A6AA0', 0.6) + croissant(-1.3, -1.6, 0.5, '#F4EEDF');
  const corps = E(0, 0.8, 0.75, 1.7, '#5A4A78', 0.5) + L([-0.2, -0.6], [-1.4, -2.6], OUT, 0.4) + L([0.2, -0.6], [1.4, -2.6], OUT, 0.4)
    + [-1, 1].map(k => L([k * 1.4, -2.6], [k * 1.9, -2.4], OUT, 0.3)).join('');
  return `<g transform="translate(${r2(x)} ${r2(y)}) scale(${r2(m * s)} ${s})">${ailes}${corps}</g>`;
}
function lunette({ view, n }) {
  const [a, b] = this.shoulders, i = n % 4, dos = view === 'ne';
  const expr = ['veille', 'leve', 'tendresse', 'tendresse'][i];
  // elle vole vers elle (0, 1), se pose sur le bord du chapeau (2), y ouvre et replie les ailes (3)
  // (posée sur le bord du chapeau, au-dessus de la paille, pas devant : les ailes sombres s'y détachent)
  const pose = dos ? [12.2, 8.6] : [view === 'se' ? 34.4 : 36.4, 8.8];
  const [x, y, ouvert] = [[dos ? 4.8 : 43, 30, true], [dos ? 7.4 : 40.4, 20, false], [pose[0], pose[1] - 1, true], [pose[0], pose[1] - 1, false]][i];
  const bete = papillon(x, y, ouvert, dos ? 1 : -1, 1);
  const repos = dos ? arm(this, b, this.hands[1]) : boiteAuBras(this, view);
  return dos ? { expr, left: arm(this, a, this.hands[0]), right: repos, over: bete } : { expr, left: repos, right: arm(this, b, this.hands[1]), over: bete };
}

const GESTES = { boite: boitePose, semer, arroser, herbes, lunette };
// Maggy et son geste : à passer à troupe.frame(…, vue, 'action', n)
const avec = (c, nom) => ({ ...c, uid: `${c.uid}${nom.slice(0, 2)}`, geste: nom, pose: GESTES[nom] });

module.exports = { GESTES, avec, papillon, arrosoir, panier, graine };
