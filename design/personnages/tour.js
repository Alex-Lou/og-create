// La tête qui tourne (trois quarts, vue « se ») : la règle canonique, une seule pour toutes les coupes et tous les
// accessoires (choix de l'auteur, 15 oct.). La tête se dessine de face, puis tourne comme une sphère, à la manière des
// têtes de marionnettes 2D : chaque point du dessin de face glisse sur la surface courbe de la tête, vers le côté du
// regard (à gauche de l'écran). Un point à l'angle φ (x - cx = R sin φ) passe à l'angle φ' :
//   - les masses (le contour du visage, les cheveux, les chapeaux) pivotent à peine et gardent leur silhouette :
//     φ' = φ - θm (1 - (φ / 90)²), θm = 12° ; la tête reste ronde, le menton glisse d'un rien ;
//   - les traits (yeux, sourcils, bouche, nez, joues, taches, lunettes) glissent davantage : φ' = φ - θ (1 - (φ / 90)⁴),
//     θ = 18° ; l'œil lointain se resserre contre le bord ; leur dessin ne change pas (rotation seule, choix de l'auteur) ;
//   - la barbe et la moustache vont de l'un à l'autre : au milieu avec la bouche, sur les bords avec le contour ;
//   - les oreilles et les petits objets posés sur la tête (boucles, pompon, élastiques, nœuds) glissent d'un bloc, sans
//     s'étirer ; ce qui est du côté lointain (l'oreille, sa boucle, le cache-oreille) passe derrière la tête.
// R, le rayon de la tête à chaque hauteur, est la silhouette de cette tête-là (le visage, la masse des cheveux, le
// crâne rasé, le nuage de boucles) ; sous le haut de la mâchoire, au moins un cylindre (le menton glisse avec le
// visage). Seuls les x changent. Le dessin passe en chemins : les ellipses, rectangles et traits deviennent des
// chemins, les transformations sont appliquées, chaque morceau de courbe est recoupé assez fin pour épouser la sphère.
// Les groupes se marquent dans le dessin de face par <g data-tour="traits|barbe|oreille"> (sans marque : une masse).
const r2 = v => Math.round(v * 100) / 100;

// cx : l'axe de la tête ; cy : le haut de la mâchoire ; rx : le rayon du cylindre de la mâchoire ; theta : l'angle des
// traits ; thetaMasse : celui des masses (bien plus faible : le contour reste rond, il pivote à peine)
const TETE = { cx: 24, cy: 19.5, rx: 13, theta: 18, thetaMasse: 12 };

// ---- la sphère ----
// Le rayon de la tête à la hauteur y : la silhouette de la tête elle-même (le visage, la masse des cheveux, le crâne),
// relevée sur le dessin de face ; sous cy, au moins le cylindre de la mâchoire (en douceur, de cy - 5 à cy + 1)
function rayons(silhouette, t) {
  const Y0 = -40, PASY = 0.2, N = 600, S = new Float64Array(N);
  for (const d of silhouette) {
    for (const s of cheminD(d)) {
      let cur = s.debut;
      const pts = [cur];
      for (const seg of s.segs) {
        const lon = dist(cur, seg[0]) + dist(seg[0], seg[1]) + dist(seg[1], seg[2]);
        for (const [, , p] of coupe(cur, seg, Math.max(1, Math.ceil(lon / 0.5)))) pts.push(p);
        cur = seg[2];
      }
      if (s.ferme) pts.push(s.debut);
      for (let i = 1; i < pts.length; i++) {
        const [a, b] = [pts[i - 1], pts[i]], ya = Math.min(a[1], b[1]), yb = Math.max(a[1], b[1]);
        for (let k = Math.max(0, Math.ceil((ya - Y0) / PASY)); k < N && Y0 + k * PASY <= yb; k++) {
          const y = Y0 + k * PASY, u = yb - ya < 1e-9 ? 0 : (y - a[1]) / (b[1] - a[1]);
          const x = a[0] + (b[0] - a[0]) * Math.max(0, Math.min(1, u));
          S[k] = Math.max(S[k], Math.abs(x - t.cx));
        }
      }
    }
  }
  // (adoucie : le plus large sur ± 0,6, pour que les bosses d'une coupe ne fassent pas onduler le visage)
  const R = new Float64Array(N);
  for (let k = 0; k < N; k++) {
    let m = 0;
    for (let j = Math.max(0, k - 3); j <= Math.min(N - 1, k + 3); j++) m = Math.max(m, S[j]);
    const y = Y0 + k * PASY, v = Math.max(0, Math.min(1, (y - (t.cy - 5)) / 6)), ramp = v * v * (3 - 2 * v);
    R[k] = Math.max(m, t.rx * ramp);
  }
  return y => { const k = Math.round((y - Y0) / PASY); return k < 0 || k >= N ? 0 : R[k]; };
}
function tourne(x, y, mode, t) {
  const R = t.rayon(y);
  if (R <= 0) return x;
  const u = (x - t.cx) / R;
  if (u <= -1 || u >= 1) return x;
  const phi = Math.asin(u) * 180 / Math.PI;
  const v = 1 - (phi / 90) ** 2;
  const p = mode === 'traits' ? phi - t.theta * (1 - (phi / 90) ** 4)
    // la barbe : au milieu, elle suit la bouche (les traits) ; sur ses bords, le contour du visage (les masses)
    : mode === 'barbe' ? phi - t.thetaMasse * v - (t.theta - t.thetaMasse) * v * v
      : phi - t.thetaMasse * v;
  return t.cx + R * Math.sin(p * Math.PI / 180);
}

// ---- lecture du dessin ----
function lire(svg) {
  const racine = { tag: '#', attrs: [], kids: [] }, pile = [racine];
  // (rien d'autre que des balises : un morceau qui ne se lit pas arrête tout, plutôt que de perdre un trait en silence)
  const reste = svg.replace(/<(\/?)([a-zA-Z]+)((?:\s+[a-zA-Z][a-zA-Z0-9:-]*="[^"]*")*)\s*(\/?)>/g, '');
  if (reste.trim()) throw new Error(`tour : dessin illisible près de « ${reste.trim().slice(0, 60)} »`);
  for (const m of svg.matchAll(/<(\/?)([a-zA-Z]+)((?:\s+[a-zA-Z][a-zA-Z0-9:-]*="[^"]*")*)\s*(\/?)>/g)) {
    const [, fin, tag, att, auto] = m;
    if (fin) { pile.pop(); continue; }
    const n = { tag, attrs: [...att.matchAll(/([a-zA-Z][a-zA-Z0-9:-]*)="([^"]*)"/g)].map(a => [a[1], a[2]]), kids: [] };
    pile[pile.length - 1].kids.push(n);
    if (!auto) pile.push(n);
  }
  return racine;
}
const attr = (n, k) => { const a = n.attrs.find(([x]) => x === k); return a ? a[1] : null; };
const ecrire = n => (n.tag === '#' ? n.kids.map(ecrire).join('') : `<${n.tag}${n.attrs.map(([k, v]) => ` ${k}="${v}"`).join('')}${n.kids.length ? `>${n.kids.map(ecrire).join('')}</${n.tag}>` : '/>'}`);

// ---- matrices [a b c d e f] : x' = a x + c y + e, y' = b x + d y + f ----
const ID = [1, 0, 0, 1, 0, 0];
const mul = (m, n) => [m[0] * n[0] + m[2] * n[1], m[1] * n[0] + m[3] * n[1], m[0] * n[2] + m[2] * n[3], m[1] * n[2] + m[3] * n[3], m[0] * n[4] + m[2] * n[5] + m[4], m[1] * n[4] + m[3] * n[5] + m[5]];
const app = (m, [x, y]) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
function matrice(tr) {
  let m = ID;
  for (const [, f, args] of (tr || '').matchAll(/(\w+)\(([^)]*)\)/g)) {
    const a = args.split(/[\s,]+/).filter(Boolean).map(Number);
    if (f === 'translate') m = mul(m, [1, 0, 0, 1, a[0], a[1] || 0]);
    else if (f === 'scale') m = mul(m, [a[0], 0, 0, a.length > 1 ? a[1] : a[0], 0, 0]);
    else if (f === 'rotate') {
      const t = a[0] * Math.PI / 180, cs = Math.cos(t), sn = Math.sin(t), [x, y] = [a[1] || 0, a[2] || 0];
      m = mul(m, [1, 0, 0, 1, x, y]); m = mul(m, [cs, sn, -sn, cs, 0, 0]); m = mul(m, [1, 0, 0, 1, -x, -y]);
    } else if (f === 'matrix') m = mul(m, a);
    else throw new Error(`tour : transformation inconnue ${f}`);
  }
  return m;
}

// ---- les formes en courbes cubiques absolues : [{ debut, segs: [[c1, c2, p]], ferme }] ----
function arcCubiques(p0, rx, ry, rot, grand, sens, p1) {
  // l'arc elliptique de SVG en cubiques (la méthode des notes d'implémentation de SVG)
  if (!rx || !ry) return [[p0, p1, p1]];
  const phi = rot * Math.PI / 180, cs = Math.cos(phi), sn = Math.sin(phi);
  const dx = (p0[0] - p1[0]) / 2, dy = (p0[1] - p1[1]) / 2;
  const x1 = cs * dx + sn * dy, y1 = -sn * dx + cs * dy;
  rx = Math.abs(rx); ry = Math.abs(ry);
  const l = x1 * x1 / (rx * rx) + y1 * y1 / (ry * ry);
  if (l > 1) { rx *= Math.sqrt(l); ry *= Math.sqrt(l); }
  const num = rx * rx * ry * ry - rx * rx * y1 * y1 - ry * ry * x1 * x1, den = rx * rx * y1 * y1 + ry * ry * x1 * x1;
  const k = (grand === sens ? -1 : 1) * Math.sqrt(Math.max(0, num / den));
  const cxp = k * rx * y1 / ry, cyp = -k * ry * x1 / rx;
  const cx = cs * cxp - sn * cyp + (p0[0] + p1[0]) / 2, cy = sn * cxp + cs * cyp + (p0[1] + p1[1]) / 2;
  const ang = (ux, uy, vx, vy) => { const a = Math.atan2(ux * vy - uy * vx, ux * vx + uy * vy); return a; };
  const t0 = ang(1, 0, (x1 - cxp) / rx, (y1 - cyp) / ry);
  let dt = ang((x1 - cxp) / rx, (y1 - cyp) / ry, (-x1 - cxp) / rx, (-y1 - cyp) / ry);
  if (!sens && dt > 0) dt -= 2 * Math.PI; else if (sens && dt < 0) dt += 2 * Math.PI;
  const n = Math.ceil(Math.abs(dt) / (Math.PI / 2)), h = dt / n, a = 4 / 3 * Math.tan(h / 4);
  const pt = t => [cx + rx * Math.cos(t) * cs - ry * Math.sin(t) * sn, cy + rx * Math.cos(t) * sn + ry * Math.sin(t) * cs];
  const de = t => [-rx * Math.sin(t) * cs - ry * Math.cos(t) * sn, -rx * Math.sin(t) * sn + ry * Math.cos(t) * cs];
  const out = [];
  for (let i = 0; i < n; i++) {
    const ta = t0 + i * h, tb = ta + h, A = pt(ta), B = i === n - 1 ? p1 : pt(tb), da = de(ta), db = de(tb);
    out.push([[A[0] + a * da[0], A[1] + a * da[1]], [B[0] - a * db[0], B[1] - a * db[1]], B]);
  }
  return out;
}
function cheminD(d) {
  const toks = d.match(/[a-zA-Z]|-?(?:\d+\.?\d*|\.\d+)(?:e-?\d+)?/g) || [];
  const subs = [];
  let i = 0, cmd = null, cur = [0, 0], start = [0, 0], sub = null, prevC = null, prevQ = null;
  const num = () => +toks[i++];
  const ligne = p => { sub.segs.push([cur, p, p]); cur = p; };
  while (i < toks.length) {
    if (/[a-zA-Z]/.test(toks[i])) cmd = toks[i++];
    const rel = cmd === cmd.toLowerCase(), C = cmd.toUpperCase(), o = rel ? cur : [0, 0];
    const pt = () => { const x = num(), y = num(); return [o[0] + x, o[1] + y]; };
    let c = null, q = null;
    if (C === 'M') { cur = start = pt(); sub = { debut: cur, segs: [], ferme: false }; subs.push(sub); cmd = rel ? 'l' : 'L'; }
    else if (C === 'Z') { if (sub) { sub.ferme = true; cur = start; sub = { debut: cur, segs: [], ferme: false }; subs.push(sub); } }
    else if (C === 'L') ligne(pt());
    else if (C === 'H') { const x = num(); ligne([rel ? cur[0] + x : x, cur[1]]); }
    else if (C === 'V') { const y = num(); ligne([cur[0], rel ? cur[1] + y : y]); }
    else if (C === 'C') { const a = pt(), b = pt(), p = pt(); sub.segs.push([a, b, p]); c = b; cur = p; }
    else if (C === 'S') { const a = prevC ? [2 * cur[0] - prevC[0], 2 * cur[1] - prevC[1]] : cur, b = pt(), p = pt(); sub.segs.push([a, b, p]); c = b; cur = p; }
    else if (C === 'Q' || C === 'T') {
      const k = C === 'Q' ? pt() : prevQ ? [2 * cur[0] - prevQ[0], 2 * cur[1] - prevQ[1]] : cur, p = pt();
      sub.segs.push([[cur[0] + 2 / 3 * (k[0] - cur[0]), cur[1] + 2 / 3 * (k[1] - cur[1])], [p[0] + 2 / 3 * (k[0] - p[0]), p[1] + 2 / 3 * (k[1] - p[1])], p]); q = k; cur = p;
    } else if (C === 'A') {
      const rx = num(), ry = num(), rot = num(), grand = num(), sens = num(), p = pt();
      sub.segs.push(...arcCubiques(cur, rx, ry, rot, grand, sens, p)); cur = p;
    } else throw new Error(`tour : commande inconnue ${cmd}`);
    prevC = c; prevQ = q;
  }
  return subs.filter(s => s.segs.length);
}
const K = 0.5523;
function ellipseD(cx, cy, rx, ry) {
  const p = (x, y) => [cx + x, cy + y];
  return [{ debut: p(rx, 0), ferme: true, segs: [
    [p(rx, ry * K), p(rx * K, ry), p(0, ry)], [p(-rx * K, ry), p(-rx, ry * K), p(-rx, 0)],
    [p(-rx, -ry * K), p(-rx * K, -ry), p(0, -ry)], [p(rx * K, -ry), p(rx, -ry * K), p(rx, 0)]] }];
}
function rectD(x, y, w, h, rx) {
  if (!rx) return cheminD(`M${x},${y} L${x + w},${y} L${x + w},${y + h} L${x},${y + h} Z`);
  rx = Math.min(rx, w / 2, h / 2);
  return cheminD(`M${x + rx},${y} L${x + w - rx},${y} A${rx},${rx} 0 0,1 ${x + w},${y + rx} L${x + w},${y + h - rx} A${rx},${rx} 0 0,1 ${x + w - rx},${y + h}`
    + ` L${x + rx},${y + h} A${rx},${rx} 0 0,1 ${x},${y + h - rx} L${x},${y + rx} A${rx},${rx} 0 0,1 ${x + rx},${y} Z`);
}
const GEO = { path: ['d'], ellipse: ['cx', 'cy', 'rx', 'ry'], circle: ['cx', 'cy', 'r'], rect: ['x', 'y', 'width', 'height', 'rx', 'ry'], line: ['x1', 'y1', 'x2', 'y2'] };
function forme(n) {
  const v = k => +(attr(n, k) || 0);
  if (n.tag === 'path') return cheminD(attr(n, 'd'));
  if (n.tag === 'ellipse') return ellipseD(v('cx'), v('cy'), v('rx'), v('ry'));
  if (n.tag === 'circle') return ellipseD(v('cx'), v('cy'), v('r'), v('r'));
  if (n.tag === 'rect') return rectD(v('x'), v('y'), v('width'), v('height'), v('rx') || v('ry'));
  return [{ debut: [v('x1'), v('y1')], ferme: false, segs: [[[v('x1'), v('y1')], [v('x2'), v('y2')], [v('x2'), v('y2')]]] }];
}

// ---- la déformation ----
// chaque cubique est recoupée (de Casteljau) en morceaux d'au plus PAS de long, puis ses points glissent sur la sphère
const PAS = 1.6;
function coupe(p0, [a, b, p], n) {
  const out = [];
  let q0 = p0, A = a, B = b, Q = p;
  for (let i = n; i > 1; i--) {
    const t = 1 / i, lp = (u, v) => [u[0] + (v[0] - u[0]) * t, u[1] + (v[1] - u[1]) * t];
    const ab = lp(q0, A), bc = lp(A, B), cd = lp(B, Q), abc = lp(ab, bc), bcd = lp(bc, cd), m = lp(abc, bcd);
    out.push([ab, abc, m]); q0 = m; A = bcd; B = cd;
  }
  out.push([A, B, Q]);
  return out;
}
const dist = (u, v) => Math.hypot(u[0] - v[0], u[1] - v[1]);
function deformer(subs, m, mode, t, dx = null) {
  // (dx : un petit objet glisse d'un bloc, sans se déformer)
  const w = q => { const [x, y] = app(m, q); return [r2(dx === null ? tourne(x, y, mode, t) : x + dx), r2(y)]; };
  return subs.map(s => {
    let cur = s.debut, d = `M${w(cur).join(',')}`;
    for (const seg of s.segs) {
      const lon = dist(cur, seg[0]) + dist(seg[0], seg[1]) + dist(seg[1], seg[2]);
      const plat = dist(cur, seg[0]) + dist(seg[1], seg[2]) < 1e-6; // un segment droit
      const morceaux = coupe(cur, seg, Math.max(1, Math.ceil(lon / PAS)));
      for (const [a, b, p] of morceaux) d += plat ? ` L${w(p).join(',')}` : ` C${w(a).join(',')} ${w(b).join(',')} ${w(p).join(',')}`;
      cur = seg[2];
    }
    return d + (s.ferme ? ' Z' : '');
  }).join(' ');
}
function boite(subs, m) {
  let a = Infinity, b = -Infinity, c = Infinity, d = -Infinity;
  for (const s of subs) for (const q of [s.debut, ...s.segs.flat()]) { const [x, y] = app(m, q); a = Math.min(a, x); b = Math.max(b, x); c = Math.min(c, y); d = Math.max(d, y); }
  return { x: (a + b) / 2, y: (c + d) / 2, w: b - a, h: d - c };
}
// Les petits objets posés sur la tête (oreilles, boucles, pompon, élastiques, nœuds, fleurs) glissent d'un bloc : ils
// suivent la sphère par leur centre, sans s'étirer
const PETIT = 5;
function noeud(n, m, mode, t) {
  if (n.tag === 'g' || n.tag === '#') {
    const tr = attr(n, 'transform'), md = attr(n, 'data-tour') || mode, mm = tr ? mul(m, matrice(tr)) : m;
    const kids = n.kids.map(k => noeud(k, mm, md, t)).filter(Boolean);
    if (n.tag === '#') return { ...n, kids };
    const attrs = n.attrs.filter(([k]) => k !== 'transform' && k !== 'data-tour');
    return attrs.length ? { tag: 'g', attrs, kids } : { tag: '#', attrs: [], kids };
  }
  if (n.tag === 'clipPath') return { ...n, kids: n.kids.map(k => noeud(k, m, mode, t)).filter(Boolean) };
  if (!GEO[n.tag]) return n; // defs, dégradés : sans géométrie qui tourne
  const tr = attr(n, 'transform'), mm = tr ? mul(m, matrice(tr)) : m;
  const subs = forme(n), bt = boite(subs, mm);
  if (mode === 'oreille' && bt.x < t.cx) return null; // l'oreille lointaine passe derrière la tête
  const bloc = mode === 'oreille' || (mode === 'masse' && Math.max(bt.w, bt.h) <= PETIT) ? tourne(bt.x, bt.y, 'masse', t) - bt.x : null;
  const garde = n.attrs.filter(([k]) => !GEO[n.tag].includes(k) && k !== 'transform');
  if (n.tag === 'line' && !attr(n, 'fill')) garde.unshift(['fill', 'none']);
  return { tag: 'path', attrs: [['d', deformer(subs, mm, mode, t, bloc)], ...garde], kids: [] };
}
// tourner(dessin de face, silhouette) : le même dessin, de trois quarts ; silhouette : les chemins qui font le tour de
// la tête de face (le visage, la masse des cheveux, le crâne)
function tourner(svg, silhouette, opts = {}) {
  const t = { ...TETE, ...opts };
  t.rayon = rayons(silhouette, t);
  return ecrire(noeud(lire(svg), ID, 'masse', t));
}
// un groupe marqué pour la rotation (sans effet sur le dessin de face)
const groupe = (actif, nom, s) => (actif && s ? `<g data-tour="${nom}">${s}</g>` : s);

module.exports = { tourner, groupe, tourne, TETE };
