// Les gestes de l'atelier (atelier/gestes.js) pour les personnages aux membres de la refonte (c.os : l'avatar, les
// visiteurs… refonte/membres.js) : les mêmes gestes, le même dessin des outils, mais à portée de bras de longueur fixe.
// Les gestes du kit tendaient la main n'importe où (les bras du kit s'allongent) ; ici, chaque main reste à portée de
// son épaule (c.brasL), et ce qu'elle tient est posé là où elle est vraiment. Un outil tenu à deux mains passe devant
// le corps, là où les deux mains l'atteignent. (Choix de l'auteur, 15 oct. : les bras ne changent plus de longueur.)
// gestes.js passe la main ici quand le personnage a c.os ; les maîtres, eux, gardent leurs gestes.
const { E, r2, arm } = require('../troupe');
const G = () => require('../../atelier/gestes').dessins;
// la vue que le geste du kit dessine déjà à portée : le geste du kit, sans repasser ici
const kit = (c, nom, ctx) => G()[nom].call({ ...c, os: false }, ctx);

// La longueur du bras de cette épaule
const longueur = (c, sh) => (c.brasL ? c.brasL[sh[0] < 24 ? 0 : 1] : 11);
// Le point que la main atteint vers p : p s'il est à portée, sinon au bout du bras tendu (k : la part de la longueur)
function vers(c, sh, p, k = 0.96) {
  const Lm = longueur(c, sh) * k, dx = p[0] - sh[0], dy = p[1] - sh[1], d = Math.hypot(dx, dy) || 1;
  return d <= Lm ? [r2(p[0]), r2(p[1])] : [r2(sh[0] + dx / d * Lm), r2(sh[1] + dy / d * Lm)];
}
// La prise d'une main sur un outil, de t à l (un segment) : le point le plus près de pref (une part de t à l) que la
// main atteint ; sinon le point du segment le plus proche de l'épaule
function prise(c, sh, t, l, pref) {
  const Lm = longueur(c, sh) * 0.96;
  const pt = q => [t[0] + (l[0] - t[0]) * q, t[1] + (l[1] - t[1]) * q];
  let best = null, bd = 1e9, near = null, nd = 1e9;
  for (let i = 0; i <= 50; i++) {
    const q = i / 50, p = pt(q), d = Math.hypot(p[0] - sh[0], p[1] - sh[1]);
    if (d < nd) { nd = d; near = p; }
    if (d <= Lm && Math.abs(q - pref) < bd) { bd = Math.abs(q - pref); best = p; }
  }
  const p = best || near;
  return [r2(p[0]), r2(p[1])];
}
// Un outil tenu à deux mains, de t à l : mains = [[épaule, prise préférée], …]. Si une main ne l'atteint pas, l'outil
// pivote autour de son appui (ancre : la lame dans la terre, la pointe sur la pierre) ou, en l'air, se rapproche du corps
function aPortee(c, t, l, mains, ancre) {
  const tient = (t, l) => mains.map(([sh, q]) => prise(c, sh, t, l, q));
  const ok = (t, l, h) => h.every((p, i) => Math.hypot(p[0] - mains[i][0][0], p[1] - mains[i][0][1]) <= longueur(c, mains[i][0]) * 0.96 + 0.01);
  if (ancre) {
    for (let k = 0; k <= 20; k++) for (const sg of k ? [1, -1] : [1]) {
      const r = sg * k * 2 * Math.PI / 180, dx = t[0] - l[0], dy = t[1] - l[1];
      const t2 = [r2(l[0] + dx * Math.cos(r) - dy * Math.sin(r)), r2(l[1] + dx * Math.sin(r) + dy * Math.cos(r))], h = tient(t2, l);
      if (ok(t2, l, h)) return { t: t2, l, h };
    }
    return { t, l, h: tient(t, l) };
  }
  let T = t, Lb = l, h = tient(T, Lb);
  for (let k = 0; k < 8 && !ok(T, Lb, h); k++) {
    let mx = 0, my = 0;
    h.forEach((p, i) => { const sh = mains[i][0], d = Math.hypot(p[0] - sh[0], p[1] - sh[1]), m = longueur(c, sh) * 0.96; if (d > m) { mx += (sh[0] - p[0]) / d * (d - m); my += (sh[1] - p[1]) / d * (d - m); } });
    T = [r2(T[0] + mx), r2(T[1] + my)]; Lb = [r2(Lb[0] + mx), r2(Lb[1] + my)]; h = tient(T, Lb);
  }
  return { t: T, l: Lb, h };
}
const poing = (c, h) => E(h[0], h[1], 2.1, 2.1, c.hand || c.skin);

// ---- applaudir : de trois quarts, les mains se rejoignent devant la poitrine, du côté du regard ----
function applaudir(ctx) {
  const { view, n } = ctx, [a, b] = this.shoulders, D = G();
  if (view !== 'se') return kit(this, 'applaudir', ctx);
  const y = a[1] + 6.2, x = (a[0] + b[0]) / 2 - 3.4, g = n ? 0.7 : 2.6;
  const hl = vers(this, a, [x - g, y]), hr = vers(this, b, [x + g, y - 0.4]);
  return {
    expr: 'rire',
    right: arm(this, b, hr, [b[0] - 1.6, b[1] + 6.8], D.tranche(this, [hr[0], hr[1] - 0.5], -1, 0.95)),
    left: arm(this, a, hl, [a[0] - 1.4, a[1] + 6.8], D.tranche(this, [hl[0], hl[1] - 0.5], 1)),
    over: n ? D.eclat((hl[0] + hr[0]) / 2, y - 3.8) : ''
  };
}

// ---- pêcher : la canne tenue à deux mains, devant soi ; les poings posés sur la canne là où ils l'atteignent ----
function pecher(ctx) {
  const { view, n } = ctx, [a, b] = this.shoulders, D = G(), d = n ? 1.6 : 0;
  if (view === 'front') {
    const talon = [a[0] + 4, a[1] + 10.4], scion = [Math.min(45.6, b[0] + 13.6), a[1] - 8 + d];
    const ha = prise(this, a, talon, scion, 0.12), hb = prise(this, b, talon, scion, 0.36);
    return { expr: 'content', left: D.canne(talon, scion, [Math.min(43, b[0] + 11), 54.4], 1, n) + arm(this, a, ha, [a[0] - 0.6, a[1] + 7]), right: arm(this, b, hb, [b[0] + 1.6, b[1] + 6.2]) };
  }
  if (view === 'se') {
    const talon = [b[0] - 4.6, b[1] + 10.4], scion = [Math.max(2.4, a[0] - 13.6), a[1] - 8 + d];
    const hb = prise(this, b, talon, scion, 0.12), ha = prise(this, a, talon, scion, 0.38);
    return { expr: 'content', right: arm(this, b, hb, [b[0] - 0.6, b[1] + 7.6]), left: D.canne(talon, scion, [Math.max(5, a[0] - 11), 54.4], -1, n) + arm(this, a, ha, [a[0] - 1, a[1] + 6]) };
  }
  return kit(this, 'pecher', ctx);
}

// ---- piocher : les deux mains au bas du manche, devant la poitrine ; la pioche levée par-dessus l'épaule, puis le coup ----
function piocher(ctx) {
  const { view, n } = ctx, [a, b] = this.shoulders, D = G();
  const se = view === 'se', mid = (a[0] + b[0]) / 2 + (se ? -1.4 : 0);
  // de dos, le bras qui frappe passe devant le corps, caché ; celui qu'on voit reste près de l'épaule : le geste du kit
  if (view === 'ne') return kit(this, 'piocher', ctx);
  const k = se ? 1 : -1, p = se ? [8.6, 61] : [39.4, 61];
  const m = [mid, a[1] + 9.4];
  const h = n ? [p[0] - k * 0.4, p[1] - 4.6] : (se ? [Math.max(5, a[0] - 8), a[1] - 13] : [Math.min(43, b[0] + 8), a[1] - 13]);
  const [near, far] = se ? [a, b] : [b, a];
  const o = aPortee(this, m, h, [[near, 0.22], [far, 0]], !!n), [hN, hF] = o.h;
  const outil = D.pioche(o.t, o.l, n ? (se ? 1 : -1) : (se ? -1 : 1));
  return { expr: n ? 'rire' : 'content', under: D.pierre(...p), left: '', right: '', over: outil + arm(this, far, hF, [far[0] + (se ? 2.4 : -2.4), far[1] + 6.4]) + arm(this, near, hN, [near[0] + (se ? -2.6 : 2.6), near[1] + 5.4]) + (n ? D.eclats(o.l[0] + k * 0.6, o.l[1] + 0.4) : '') };
}

// ---- cueillir : le panier devant soi ; la main cueille un fruit en haut, sur le côté, puis le dépose dans le panier ----
function cueillir(ctx) {
  const { view, n } = ctx, [a, b] = this.shoulders, D = G();
  if (view === 'ne') {
    const hp = vers(this, b, [b[0] + 2.4, b[1] + 9.4]), pan = D.panier(hp, n ? 4 : 3);
    if (!n) { const h = vers(this, a, [a[0] - 7.4, a[1] - 3.6]); return { left: arm(this, a, h, [a[0] - 5.6, a[1] + 2.6]) + D.fruit(h[0] - 0.3, h[1] - 2), right: arm(this, b, hp, [b[0] + 3, b[1] + 5]) + pan }; }
    return { left: '', right: arm(this, b, hp, [b[0] + 3, b[1] + 5]) + pan, under: arm(this, a, vers(this, a, [24 + 1, a[1] + 8]), [a[0] - 2.4, a[1] + 6]) };
  }
  const se = view === 'se', [pS, qS] = se ? [a, b] : [b, a], s = se ? -1 : 1; // p : la main qui cueille ; q : celle du panier
  const mid = (a[0] + b[0]) / 2 + (se ? -1.4 : 0);
  const hp = vers(this, qS, [mid - s * 1.8, qS[1] + 8.4]), pan = D.panier(hp, n ? 4 : 3);
  const tient = arm(this, qS, hp, [qS[0] - s * 2.6, qS[1] + 5.4]) + pan;
  if (!n) {
    const h = vers(this, pS, [pS[0] + s * 7.4, pS[1] - 3.6]);
    return { expr: 'content', [se ? 'right' : 'left']: tient, [se ? 'left' : 'right']: arm(this, pS, h, [pS[0] + s * 5.6, pS[1] + 2.6]) + D.fruit(h[0] + s * 0.3, h[1] - 2) };
  }
  // le fruit lâché au-dessus du panier, la main juste au-dessus
  const h = vers(this, pS, [hp[0] + s * 2.4, hp[1] + 0.4]);
  return { expr: 'rire', [se ? 'right' : 'left']: tient, [se ? 'left' : 'right']: '', over: arm(this, pS, h, [pS[0] + s * 2, pS[1] + 7.2]) };
}

// ---- arroser : de dos, l'arrosoir tenu à droite, à portée ----
function arroser(ctx) {
  const { view, n } = ctx, [a, b] = this.shoulders, D = G();
  if (view !== 'ne') return kit(this, 'arroser', ctx);
  const h = vers(this, b, [b[0] + 1.4, b[1] + 6.4]), ar = D.arrosoir(h, 1, 40), sol = a[1] + 18;
  return { left: '', right: '', under: D.pousse(ar.bout[0] - 0.6, sol, n) + ar.svg + D.pluie(ar.bout, sol - 1, 1, n) + arm(this, a, vers(this, a, [24, a[1] + 8]), [a[0] - 1.6, a[1] + 6]), over: arm(this, b, h, [b[0] + 3, b[1] + 4]) };
}

// ---- bêcher : la bêche devant soi, les deux mains sur le manche ; enfoncée, puis levée avec une motte ----
function becher(ctx) {
  const { view, n } = ctx, [a, b] = this.shoulders, D = G();
  // de dos : le bras qui tient le haut du manche reste près de l'épaule, l'autre est caché : le geste du kit
  if (view === 'ne') return kit(this, 'becher', ctx);
  const se = view === 'se', s = se ? -1 : 1, mid = (a[0] + b[0]) / 2 + (se ? -1.4 : 0);
  const [near, far] = se ? [a, b] : [b, a];
  const sol = 61;
  // la bêche : le manche de biais devant le corps, la lame dans la terre devant les pieds (côté de la main de dessus)
  const [t, l] = n ? [[mid + s * 1.6, a[1] + 4.6], [mid + s * 7.6, sol - 6.4]] : [[mid + s * 0.8, a[1] + 1.6], [mid + s * 3.4, sol + 1.4]];
  const o = aPortee(this, t, l, [[near, 0], [far, 0.32]], !n), [hN, hF] = o.h;
  const outil = D.beche(o.t, o.l, !!n) + (n ? '' : D.terre(o.l[0], sol));
  return { expr: n ? 'rire' : 'content', under: n ? D.terre(o.l[0] + s * 0.8, sol) : '', left: '', right: '', over: outil + arm(this, far, hF, [far[0] - s * 2.2, far[1] + 7]) + arm(this, near, [hN[0], hN[1] + 0.4], [near[0] + s * 2.4, near[1] + 4]) };
}

// ---- semer : le sac de graines à la hanche, devant ; la main y plonge, puis lance les graines sur le côté ----
function semer(ctx) {
  const { view, n } = ctx, [a, b] = this.shoulders, D = G();
  if (view === 'ne') return kit(this, 'semer', ctx);
  const se = view === 'se', s = se ? -1 : 1, [p, q] = se ? [a, b] : [b, a];
  const mid = (a[0] + b[0]) / 2 + (se ? -1.4 : 0);
  const hs = vers(this, q, [mid - s * 1.4, q[1] + 9.6]), sac = arm(this, q, hs, [q[0] - s * 2.6, q[1] + 5.4]) + D.sacGraines([hs[0] + s * 1.4, hs[1] + 0.6]);
  const [cs, cp] = se ? ['right', 'left'] : ['left', 'right'];
  if (!n) {
    const h = vers(this, p, [hs[0] + s * 2.2, hs[1] - 0.6]);
    return { expr: 'content', [cs]: sac, [cp]: '', over: arm(this, p, h, [p[0] + s * 0.6, p[1] + 7.6]) };
  }
  const h = vers(this, p, [p[0] + s * 6.4, p[1] + 5]);
  return { expr: 'content', [cs]: sac, [cp]: arm(this, p, h, [p[0] + s * 4.6, p[1] + 4]), over: D.graines(h[0], h[1] + 1, s) };
}

// ---- récolter : la faucille dans la main, à portée ; le blé sur pied à côté ----
function recolter(ctx) {
  const { view, n } = ctx, [a, b] = this.shoulders, D = G();
  if (view === 'ne') return kit(this, 'recolter', ctx);
  const s = view === 'front' ? 1 : -1, p = s > 0 ? b : a, x = dx => p[0] + s * dx, sol = 61;
  const h = vers(this, p, n ? [x(2.6), sol - 7.4] : [x(5.4), p[1] + 3.4]);
  const outil = D.faucille(h, s, n ? 60 : -20) + arm(this, p, h, n ? [x(2.4), p[1] + 7] : [x(4.6), p[1] + 6]);
  // le blé là où la faucille le coupe
  const bx = n ? h[0] + s * 4.4 : x(7);
  return { expr: n ? 'rire' : 'content', under: D.touffe(bx, sol, n), [s > 0 ? 'right' : 'left']: outil };
}

// ---- scier : un tréteau à hauteur de hanche devant soi (à 8 px du sol, la bûche du kit est hors de portée d'un bras
// de chibi) ; une main tient la bûche, l'autre scie ----
function scier(ctx) {
  const { view, n } = ctx, [a, b] = this.shoulders, D = G();
  if (view === 'ne') return kit(this, 'scier', ctx);
  const se = view === 'se', s = se ? -1 : 1, [p, q] = se ? [a, b] : [b, a]; // p : la main de la scie ; q : celle qui tient la bûche
  const mid = (a[0] + b[0]) / 2 + (se ? -1.4 : 0), sol = 61, top = r2(Math.min(53, (this.hip || 45) + 1.2));
  // le tréteau devant soi, un peu du côté de la scie : la bûche passe sous les deux mains
  const cx = mid + s * 3.4, c = cx + s * 2.6;
  const hq = vers(this, q, [cx - s * 3.4, top - 2.2]);
  const h = vers(this, p, n ? [c - s * 2.4, top - 4.2] : [c - s * 5.4, top - 7.6]);
  return {
    expr: 'content', left: '', right: '',
    over: D.chevalet(cx, sol, c, n, sol - top) + arm(this, q, hq, [q[0] + s * 0.6, q[1] + 8]) + D.scie(h, [c, top - 1.4]) + arm(this, p, h, [p[0] + s * 2.4, p[1] + 6])
  };
}

// ---- tailler : le sécateur à portée, le buisson tout près ----
function tailler(ctx) {
  const { view, n } = ctx, [a, b] = this.shoulders, D = G();
  if (view === 'ne') return kit(this, 'tailler', ctx);
  const s = view === 'front' ? 1 : -1, p = s > 0 ? b : a, sol = 61, cy = sol - 5;
  const h = vers(this, p, [p[0] + s * 1.8, cy - 9.4]);
  const bx = h[0] + s * 5.4, c = [bx - s * 1.8, cy - 8];
  return { expr: n ? 'rire' : 'content', under: D.buisson(bx, sol, s, n), [s > 0 ? 'right' : 'left']: arm(this, p, h, [p[0] + s * 3.4, p[1] + 5]) + D.secateur(h, c, !n) };
}

// ---- écrire : de trois quarts, le carnet tenu par la main proche, la main du fond passe devant le buste pour écrire ----
function ecrire(ctx) {
  const { view, n } = ctx, [a, b] = this.shoulders, D = G();
  if (view !== 'se') return kit(this, 'ecrire', ctx);
  const y = a[1] + 3.6, x = (a[0] + b[0]) / 2 - 2, p = [x + 2 + n * 1.6, y + 2.6 + n * 1.1];
  const tient = vers(this, a, [x - 4.4, y + 5.8]), hw = vers(this, b, [p[0] + 1.6, p[1] + 2.2]);
  return { expr: 'content', left: arm(this, a, tient, [a[0] - 2.4, a[1] + 6.4]), right: '', over: D.carnet(x, y, n ? 2 : 1) + arm(this, b, hw, [b[0] + 1.6, b[1] + 7.4]) + D.crayon([hw[0] - 1.6, hw[1] - 2.2], 0.55, -0.83) };
}

module.exports = { vers, prise, aPortee, applaudir, pecher, piocher, cueillir, arroser, becher, semer, recolter, scier, tailler, ecrire, poing };
