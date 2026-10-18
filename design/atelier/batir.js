// Les outils des bâtiments du jeu redessinés (choix de l'auteur, 18 oct. : « une refonte visuelle, un truc hyper
// stylé, choupi, dans notre thème, et très très sérieux AAA ») : la vraie isométrie du jeu (une case de 80 × 40, le
// centre de l'emprise en (0, 0) : iso.js), des volumes dont chaque face reçoit sa matière et sa lumière (le soleil en
// haut à gauche : la face qui regarde à gauche au soleil, celle de droite à l'ombre, les toits plus clairs), des matières
// peintes une à une (pierres écornées et moussues, planches veinées et clouées, rondins, tuiles en écailles, chaume,
// colombages), le trait brun du jeu, et le néon par touches (lanternes, fenêtres, magie) qui luit fort la nuit.
// Repère : celui du jeu (la bibliothèque l'agrandit × 1,25 autour : batiments.json).
// (arrondi au centième, tirage pseudo-aléatoire fixe : les mêmes que scenes7.js, ici pour que le module reste autonome)
const f = n => Math.round(n * 100) / 100;
const rnd = s => { let x = s; return () => (x = (x * 16807) % 2147483647) / 2147483647; };
// L'hiver (paliers_hiver) : la neige sur les toits, les dessus, les bûches, le sol
const ETAT = { hiver: false };
const setHiver = b => { ETAT.hiver = Boolean(b); };
const hiver = () => ETAT.hiver;
const NEIGE = '#F4F8FC', NEIGE_O = '#B8CCE0';

// (les couleurs du jeu, pas toutes, mais de quoi fondre les bâtiments dans le décor : le trait brun de la bibliothèque (les
// teintes du jeu le gardent : teinter.mjs), la
// lumière rasante et l'ombre sarcelle du pied des falaises de terrain.js, l'herbe de l'île ; choix de l'auteur, 18 oct. :
// « encore trop effet stickers mal collés par-dessus le tout ; inspire-toi des palettes qu'on a intégrées ; fonds le tout »)
const ENCRE = '#3C2819', TRAIT = 0.9;
const SOLEIL = '#F4F1BE', OMBRE_F = '#24474A';
const HERBE = ['#3A8068', '#81BA5E', '#A1D46C', '#D6DF7C'], SABLE = ['#EBD49B', '#DCC28B'];
const CYAN = '#3FE6D8', MAGENTA = '#FF4FAE', ACIDE = '#C8FF6A', CHAUD = '#FFB85A', VIOLET = '#9A5AF0';

// ——— le dessin ———
const P2 = (x, y) => `${f(x)},${f(y)}`;
const poly = pts => 'M' + pts.map(([x, y]) => P2(x, y)).join(' L') + ' Z';
const ligne = pts => 'M' + pts.map(([x, y]) => P2(x, y)).join(' L');
const stops = s => s.map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join('');
const lin = (id, x1, y1, x2, y2, s) => `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}">${stops(s)}</linearGradient>`;
const rad = (id, cx, cy, r, s) => `<radialGradient id="${id}" gradientUnits="userSpaceOnUse" cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}">${stops(s)}</radialGradient>`;
// (le bord d'une forme : pas un trait d'encre uniforme qui la découpe comme un autocollant, mais sa propre couleur
// assombrie, plus fine ; choix de l'auteur, 18 oct. : « des bords qui donnent l'impression du sticker collé »)
const BORD = { doux: false };
const bordDe = fill => (BORD.doux && /^#[0-9A-Fa-f]{6}$/.test(fill) ? mix(fill, '#24150C', 0.55) : ENCRE);
const plan = (d, fill, w = TRAIT, extra = '') => `<path d="${d}" fill="${fill}" stroke="${bordDe(fill)}" stroke-width="${f(BORD.doux ? w * 0.75 : w)}" stroke-linejoin="round"${extra}/>`;
const trait = (d, c, w, extra = '') => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${f(w)}" stroke-linecap="round" stroke-linejoin="round"${extra}/>`;
const ovale = (cx, cy, rx, ry, fill, w = TRAIT, extra = '') => `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(rx)}" ry="${f(ry)}" fill="${fill}"${w ? ` stroke="${bordDe(fill)}" stroke-width="${f(BORD.doux ? w * 0.75 : w)}"` : ''}${extra}/>`;
// L'ombre portée douce d'un objet : sa forme au sol (pts), étirée vers le bas à droite (le soleil est en haut à
// gauche), floue ; elle l'ancre dans l'herbe au lieu de le poser dessus
const ombrePortee = (id, pts, h, a = 0.34) => {
  const k = h * 0.45, ext = [...pts, ...pts.map(([x, y]) => [x + k * 0.9, y + k * 0.35])];
  const cx = ext.reduce((t, p) => t + p[0], 0) / ext.length, cy = ext.reduce((t, p) => t + p[1], 0) / ext.length;
  const hull = ext.slice().sort((p, q) => Math.atan2(p[1] - cy, p[0] - cx) - Math.atan2(q[1] - cy, q[0] - cx));
  return `<defs><filter id="${id}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${f(1.6 + h * 0.04)}"/></filter></defs><path d="${'M' + hull.map(([x, y]) => `${f(x)},${f(y)}`).join(' L') + ' Z'}" fill="${OMBRE_F}" opacity="${a}" filter="url(#${id})"/>`;
};
const lueur = (id, x, y, r, c, a = 0.5) => `<defs>${rad(id, x, y, r, [[0, c, a], [0.45, c, a * 0.35], [1, c, 0]])}</defs><circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="url(#${id})"/>`;
// le néon : un halo, le trait vif, son cœur blanc
const neon = (d, c, w = 1) => trait(d, c, w * 4, ' stroke-opacity=".16"') + trait(d, c, w) + trait(d, '#FFFFFF', w * 0.35, ' stroke-opacity=".8"');
// une teinte entre deux (hex), t de 0 à 1
const mix = (a, b, t) => '#' + [1, 3, 5].map(i => Math.round(parseInt(a.slice(i, i + 2), 16) * (1 - t) + parseInt(b.slice(i, i + 2), 16) * t).toString(16).padStart(2, '0')).join('');
const plus = (a, b, k = 1) => [a[0] + b[0] * k, a[1] + b[1] * k];
const moins = (a, b) => [a[0] - b[0], a[1] - b[1]];
const norme = v => Math.hypot(v[0], v[1]);
const unite = v => { const n = norme(v); return [v[0] / n, v[1] / n]; };

// ——— l'isométrie du jeu ———
// Un point (u, v en cases, z en pixels de hauteur) à l'écran
const iso = (u, v, z = 0) => [40 * (u - v), 20 * (u + v) - z];
const PAS = Math.hypot(40, 20);
const AXE_U = [40 / PAS, 20 / PAS], AXE_V = [-40 / PAS, 20 / PAS];

// Une face plane posée dans l'espace : son repère (origine O, vecteurs U et V), sa matière dessinée dans le rectangle
// W × H (ou dans la forme clip) de ce repère
const plaque = (id, O, U, V, W, H, contenu, clip) => `<g transform="matrix(${f(U[0])} ${f(U[1])} ${f(V[0])} ${f(V[1])} ${f(O[0])} ${f(O[1])})">`
  + `<clipPath id="${id}"><path d="${clip || `M0,0 H${f(W)} V${f(H)} H0 Z`}"/></clipPath><g clip-path="url(#${id})">${contenu}</g></g>`;
// La lumière posée sur une face (dans son repère) : au soleil un voile chaud, à l'ombre un voile indigo ; l'ombre au
// pied ; l'ombre sous l'avancée du toit (haut)
const voileFace = (W, H, soleil, { pied = 0.35, haut = 0.3 } = {}) => {
  const id = `vf${Math.round(W * 7 + H * 13)}${soleil ? 's' : 'o'}`;
  return `<defs><linearGradient id="${id}a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1A0E08" stop-opacity="${haut}"/><stop offset=".22" stop-color="#1A0E08" stop-opacity="0"/><stop offset=".7" stop-color="#1A0E08" stop-opacity="0"/><stop offset="1" stop-color="#1A0E08" stop-opacity="${pied}"/></linearGradient></defs>`
    + `<rect width="${f(W)}" height="${f(H)}" fill="${soleil ? SOLEIL : OMBRE_F}" opacity="${soleil ? 0.05 : 0.32}"/><rect width="${f(W)}" height="${f(H)}" fill="url(#${id}a)"/>`
    + (BORD.doux ? `<defs><linearGradient id="${id}r" x1="0" y1="0" x2="0" y2="1"><stop offset=".6" stop-color="#81BA5E" stop-opacity="0"/><stop offset="1" stop-color="#81BA5E" stop-opacity=".22"/></linearGradient></defs><rect width="${f(W)}" height="${f(H)}" fill="url(#${id}r)"/>` : '');
};

// Une boîte posée de (u0, v0) à (u1, v1), de z0 à z1 : sa face gauche (v = v1, au soleil), sa face droite (u = u1, à
// l'ombre), son dessus ; chaque face reçoit sa matière (une fonction (W, H) => svg dans son repère, en pixels)
function boite(id, [u0, v0, u1, v1], z0, z1, { gauche, droite, dessus, voile = {}, arete = SOLEIL } = {}) {
  const G = (u1 - u0) * PAS, D = (v1 - v0) * PAS, h = z1 - z0;
  let s = '';
  if (gauche) s += plaque(`${id}g`, iso(u0, v1, z1), AXE_U, [0, 1], G, h, gauche(G, h) + voileFace(G, h, true, voile));
  if (droite) s += plaque(`${id}d`, iso(u1, v1, z1), [AXE_U[0], -AXE_U[1]], [0, 1], D, h, droite(D, h) + voileFace(D, h, false, voile));
  if (dessus) s += plaque(`${id}t`, iso(u0, v0, z1), AXE_U, AXE_V, G, D, dessus(G, D) + (ETAT.hiver ? `<rect x="1" y="1" width="${f(G - 2)}" height="${f(D - 2)}" rx="2" fill="${NEIGE}"/>` : ''));
  const c = [iso(u0, v1, z0), iso(u1, v1, z0), iso(u1, v0, z0), iso(u1, v0, z1), iso(u0, v0, z1), iso(u0, v1, z1)];
  s += `<path d="${poly(c)}" fill="none" stroke="${ENCRE}" stroke-width="${BORD.doux ? 0.6 : TRAIT}" stroke-linejoin="round"${BORD.doux ? ' stroke-opacity=".45"' : ''}/>`
    + trait(ligne([iso(u1, v1, z0), iso(u1, v1, z1)]), ENCRE, BORD.doux ? 0.4 : 0.7, ` stroke-opacity="${BORD.doux ? 0.35 : 0.8}"`)
    // (l'arête au soleil : le coin de devant accroche la lumière)
    + (arete ? trait(ligne([iso(u1, v1, z0 + 1), iso(u1, v1, z1 - 1)]), arete, 0.7, ' stroke-opacity=".7" transform="translate(-.7 0)"') : '')
    + (dessus ? trait(ligne([iso(u0, v1, z1), iso(u1, v1, z1), iso(u1, v0, z1)]), ENCRE, 0.6, ' stroke-opacity=".7"') : '');
  return s;
}
// Un toit à deux pans sur une boîte [u0, v0, u1, v1] posée à la hauteur z : le faîte le long de u (axe 'u') ou de v
// ('v'), haut de rh au-dessus de z, débordant de o (en cases) ; le pan de derrière, le pignon (sa matière : pignon(W, H)),
// le pan de devant ; tuilé par couvre(W, H, soleil) ; les rives, le faîtage, l'égout. Rend aussi les repères du pan de
// devant (pour y planter une cheminée, une lucarne)
function toit(id, [u0, v0, u1, v1], z, rh, o, axe, { couvre, pignon, faitage = '#3A2418', egout, faitieres } = {}) {
  const A = axe === 'u' ? (a, b, zz) => iso(a, b, zz) : (a, b, zz) => iso(b, a, zz);
  const [a0, a1, b0, b1] = axe === 'u' ? [u0, u1, v0, v1] : [v0, v1, u0, u1];
  const bm = (b0 + b1) / 2, chute = o * rh / ((b1 - b0) / 2);
  const R0 = A(a0 - o, bm, z + rh), R1 = A(a1 + o, bm, z + rh);
  const E0 = A(a0 - o, b1 + o, z - chute), E1 = A(a1 + o, b1 + o, z - chute);
  const B0 = A(a0 - o, b0 - o, z - chute), B1 = A(a1 + o, b0 - o, z - chute);
  const U = unite(moins(R1, R0)), Wr = norme(moins(R1, R0));
  const Vd = moins(E0, R0), Vb = moins(B0, R0), Hd = norme(Vd), Hb = norme(Vb);
  // (le pan de devant regarde à gauche quand le faîte suit u : il est au soleil)
  const soleil = axe === 'u';
  let s = plaque(`${id}b`, R0, U, unite(Vb), Wr, Hb, couvre(Wr, Hb, false) + `<rect width="${f(Wr)}" height="${f(Hb)}" fill="${OMBRE_F}" opacity=".25"/>`);
  s += `<path d="${poly([R0, R1, B1, B0])}" fill="none" stroke="${ENCRE}" stroke-width="${TRAIT}" stroke-linejoin="round"/>`;
  if (pignon) {
    const G0 = A(a1, b0, z + rh), across = unite(moins(A(a1, b1, 0), A(a1, b0, 0))), Wg = (b1 - b0) * PAS;
    s += plaque(`${id}p`, G0, across, [0, 1], Wg, rh, pignon(Wg, rh) + voileFace(Wg, rh, !soleil, { pied: 0, haut: 0.45 }), `M0,${f(rh)} L${f(Wg)},${f(rh)} L${f(Wg / 2)},0 Z`)
      + `<path d="${poly([A(a1, b0, z), A(a1, bm, z + rh), A(a1, b1, z)])}" fill="none" stroke="${ENCRE}" stroke-width="${TRAIT}" stroke-linejoin="round"/>`;
  }
  s += plaque(`${id}d`, R0, U, unite(Vd), Wr, Hd, couvre(Wr, Hd, soleil) + `<rect width="${f(Wr)}" height="${f(Hd)}" fill="${soleil ? SOLEIL : OMBRE_F}" opacity="${soleil ? 0.12 : 0.22}"/>`);
  // (l'hiver : la neige sur les deux pans, son bord qui ondule au-dessus de l'égout, ses glaçons)
  if (ETAT.hiver) {
    const couche = (O, V, H, sol, k) => plaque(`${id}n${k}`, O, U, V, Wr, H, `<path d="M0,0 H${f(Wr)} V${f(H - 3)} ${Array.from({ length: 9 }, (_, i) => `Q${f(Wr * (1 - (i + 0.5) / 9))},${f(H - 0.6)} ${f(Wr * (1 - (i + 1) / 9))},${f(H - 3 - (i % 2) * 1.4)}`).join(' ')} Z" fill="${sol ? NEIGE : mix(NEIGE, NEIGE_O, 0.55)}"/>`
      + `<path d="M0,0 H${f(Wr)}" stroke="#FFFFFF" stroke-width="2"/>`);
    s += couche(R0, unite(Vb), Hb, false, 'b');
    s = s.replace(`<path d="${poly([R0, R1, B1, B0])}"`, `<path d="${poly([R0, R1, B1, B0])}"`);
    s += couche(R0, unite(Vd), Hd, soleil, 'd');
    for (let k = 0.06; k < 0.96; k += 0.08) { const q = plus(E0, moins(E1, E0), k); s += `<path d="M${P2(q[0] - 1, q[1] - 0.5)} L${P2(q[0], q[1] + 2.4 + (k * 37 % 1) * 2)} L${P2(q[0] + 1, q[1] - 0.5)} Z" fill="#E8F4FC" stroke="${NEIGE_O}" stroke-width=".3"/>`; }
  }
  s += `<path d="${poly([R0, R1, E1, E0])}" fill="none" stroke="${ENCRE}" stroke-width="${TRAIT}" stroke-linejoin="round"/>`
    // (la rive du pignon, le faîtage, l'égout qui accroche la lumière)
    + trait(ligne([E1, R1, B1]), faitage, 1.8) + trait(ligne([E1, R1]), ENCRE, 0.5, ' transform="translate(0 1.1)" stroke-opacity=".6"')
    + trait(ligne([R0, R1]), faitage, 2.4) + trait(ligne([R0, R1]), mix(faitage, '#FFFFFF', 0.4), 0.6, ' transform="translate(0 -.8)"')
    + (faitieres ? Array.from({ length: Math.round(Wr / 5) }, (_, i) => { const q = plus(R0, U, (i + 0.5) * Wr / Math.round(Wr / 5)); return `<ellipse cx="${f(q[0])}" cy="${f(q[1] - 1)}" rx="2.8" ry="1.9" fill="${faitieres}" stroke="${ENCRE}" stroke-width=".5"/><ellipse cx="${f(q[0] - 0.8)}" cy="${f(q[1] - 1.8)}" rx="1.2" ry=".6" fill="#FFFFFF" opacity=".4"/>`; }).join('') : '')
    + trait(ligne([E0, E1]), egout || mix(faitage, '#FFFFFF', 0.3), 1.2);
  return { svg: s, R0, U, V: unite(Vd), Wr, Hd, B0, B1, R1 };
}
// Un point d'un pan (repères rendus par toit) : x le long du faîte, y vers l'égout (0 à 1)
const surPan = (t, x, y) => plus(plus(t.R0, t.U, t.Wr * x), t.V, t.Hd * y);

// ——— les matières (dans le repère d'une face, W × H, y vers le bas) ———
// Des pierres taillées, rang par rang en quinconce, chacune sa teinte, son arête haute claire ; des pierres écornées ;
// de la mousse dans les joints, plus dense vers le pied
function tPierres(W, H, g, { fonce = '#9B927F', clair = '#EDE8DC', joint = '#6E6656', haut = 7, long = 12, mousse = 0.14 } = {}) {
  let s = `<rect width="${f(W)}" height="${f(H)}" fill="${joint}"/>`;
  for (let y = 0, r = 0; y < H; y += haut, r++) {
    for (let x = -(r % 2) * long * 0.5 - g() * 3; x < W;) {
      const l = long * (0.7 + g() * 0.6), t = 0.45 + g() * 0.5, c = mix(fonce, clair, t);
      const x0 = x + 0.6, x1 = x + l - 0.6, y0 = y + 0.6, y1 = y + haut - 0.6, e = g() < 0.25 ? Math.min(2.4, haut * 0.35) : 0;
      s += `<path d="M${P2(x0 + e, y0)} L${P2(x1, y0)} L${P2(x1, y1)} L${P2(x0, y1)} L${P2(x0, y0 + e)} Z" fill="${c}"/>`
        + `<path d="M${P2(x0 + e + 0.4, y0 + 0.5)} L${P2(x1 - 0.4, y0 + 0.5)}" stroke="#FFFFFF" stroke-width=".6" opacity="${f(0.2 + t * 0.4)}"/>`
        + `<path d="M${P2(x0 + 0.4, y1 - 0.4)} L${P2(x1, y1 - 0.4)}" stroke="#1A0E08" stroke-width=".6" opacity=".25"/>`;
      if (g() < mousse * (0.25 + 1.5 * y / H)) s += `<ellipse cx="${f(x0 + g() * l)}" cy="${f(y1 + 0.3)}" rx="${f(1.4 + g() * 2.2)}" ry="${f(0.7 + g() * 0.7)}" fill="${g() < 0.5 ? '#3A8068' : '#81BA5E'}"/>`;
      x += l;
    }
  }
  return s;
}
// Des briques
const tBriques = (W, H, g, o = {}) => tPierres(W, H, g, { fonce: '#8A3A2A', clair: '#E08A62', joint: '#5A2A20', haut: 3.2, long: 6.5, mousse: 0, ...o });
// Des planches veinées, leurs nœuds, leurs clous (verticales, ou couchées : horiz)
function tPlanches(W, H, g, { c = '#BF8049', larg = 5, horiz = false, use = 0.3 } = {}) {
  const Lg = horiz ? H : W, M = horiz ? W : H;
  let s = `<rect width="${f(W)}" height="${f(H)}" fill="${mix(c, '#1A0E08', 0.55)}"/>`;
  for (let a = 0; a < Lg; a += larg) {
    const col = mix(mix(c, '#1A0E08', 0.18), mix(c, '#FFF0D8', 0.28), g());
    const r = horiz ? [0, a + 0.35, W, larg - 0.7] : [a + 0.35, 0, larg - 0.7, H];
    s += `<rect x="${f(r[0])}" y="${f(r[1])}" width="${f(r[2])}" height="${f(r[3])}" fill="${col}"/>`
      + `<rect x="${f(r[0])}" y="${f(r[1])}" width="${f(horiz ? W : 0.7)}" height="${f(horiz ? 0.7 : H)}" fill="#FFFFFF" opacity=".18"/>`;
    for (let k = 0; k < 2; k++) {
      const o = a + larg * (0.3 + k * 0.38), j = (g() - 0.5) * 1.6;
      s += `<path d="${horiz ? `M0,${f(o)} Q${f(W * 0.5)},${f(o + j)} ${f(W)},${f(o)}` : `M${f(o)},0 Q${f(o + j)},${f(H * 0.5)} ${f(o)},${f(H)}`}" fill="none" stroke="${mix(c, '#1A0E08', 0.45)}" stroke-width=".4" opacity=".7"/>`;
    }
    if (g() < use) { const q = 2 + g() * (M - 4); s += `<ellipse cx="${f(horiz ? q : a + larg / 2)}" cy="${f(horiz ? a + larg / 2 : q)}" rx="1" ry=".6" fill="${mix(c, '#1A0E08', 0.55)}"/>`; }
    for (const q of [1.8, M - 1.8]) s += `<circle cx="${f(horiz ? q : a + larg / 2)}" cy="${f(horiz ? a + larg / 2 : q)}" r=".45" fill="#5A5048"/>`;
  }
  return s;
}
// Des rondins couchés (la cabane) : chacun bombé, son fil, ses bouts ronds qui dépassent aux coins
function tRondins(W, H, g, { c = '#C8894E', haut = 5.5 } = {}) {
  let s = `<rect width="${f(W)}" height="${f(H)}" fill="${mix(c, '#1A0E08', 0.6)}"/>`;
  for (let y = 0; y < H; y += haut) {
    const col = mix(c, g() < 0.5 ? '#FFF0D8' : '#1A0E08', g() * 0.25);
    s += `<rect x="0" y="${f(y + 0.3)}" width="${f(W)}" height="${f(haut - 0.6)}" rx="${f(haut * 0.45)}" fill="${col}"/>`
      + `<rect x="0" y="${f(y + 0.9)}" width="${f(W)}" height="${f(haut * 0.22)}" fill="#FFFFFF" opacity=".22"/>`
      + `<rect x="0" y="${f(y + haut * 0.72)}" width="${f(W)}" height="${f(haut * 0.2)}" fill="#1A0E08" opacity=".2"/>`
      + `<path d="M${P2(g() * W * 0.3, y + haut * 0.5)} Q${P2(W * 0.5, y + haut * (0.4 + g() * 0.2))} ${P2(W * (0.7 + g() * 0.3), y + haut * 0.55)}" fill="none" stroke="${mix(c, '#1A0E08', 0.5)}" stroke-width=".4"/>`;
    // (l'écorce qui reste par plaques, les nœuds, les fentes)
    for (let x = g() * 8; x < W; x += 6 + g() * 10) {
      const r = g();
      if (r < 0.3) s += `<ellipse cx="${f(x)}" cy="${f(y + haut * 0.5)}" rx="${f(1 + g())}" ry="${f(haut * 0.22)}" fill="${mix(c, '#3A2210', 0.55)}"/><ellipse cx="${f(x)}" cy="${f(y + haut * 0.5)}" rx=".5" ry="${f(haut * 0.1)}" fill="#2A1808"/>`;
      else if (r < 0.6) s += `<path d="M${P2(x, y + haut * 0.3)} l${f(3 + g() * 4)},${f((g() - 0.5) * 1)}" stroke="${mix(c, '#1A0E08', 0.5)}" stroke-width=".5"/>`;
      else s += `<rect x="${f(x)}" y="${f(y + haut * 0.62)}" width="${f(3 + g() * 5)}" height="${f(haut * 0.22)}" rx=".8" fill="${mix(c, '#4A2E16', 0.5)}" opacity=".7"/>`;
    }
  }
  return s;
}
// Des tuiles en écailles, du bas vers le haut (chaque rang recouvre le bas de celui d'en dessous), chacune sa teinte,
// son bord clair ; soleil : le pan au soleil, plus clair
function tTuiles(W, H, g, soleil, { fonce = '#5A3A9A', clair = '#B898F0', larg = 6, haut = 4, manque = 0, rouille = 0 } = {}) {
  let s = `<rect width="${f(W)}" height="${f(H)}" fill="${mix(fonce, '#1A0E08', 0.45)}"/>`;
  const rangs = Math.ceil(H / haut) + 2;
  for (let r = rangs; r >= 0; r--) {
    const y = r * haut - haut;
    for (let x = (r % 2) * larg * 0.5 - larg; x < W + larg; x += larg) {
      if (manque && g() < manque) continue;
      const t = (soleil ? 0.55 : 0.25) + g() * 0.35 + 0.15 * y / H, w = larg / 2;
      const c = rouille && g() < rouille ? mix('#8A4A2A', '#C87A3A', g()) : mix(fonce, clair, Math.min(1, t));
      const cc = g() < 0.08 ? mix(c, '#3A2A1A', 0.3) : g() < 0.08 ? mix(c, '#F4E8D0', 0.3) : c;
      s += `<path d="M${P2(x - w, y - haut)} L${P2(x - w, y)} Q${P2(x - w, y + haut * 0.8)} ${P2(x, y + haut * 0.85)} Q${P2(x + w, y + haut * 0.8)} ${P2(x + w, y)} L${P2(x + w, y - haut)} Z" fill="${cc}" stroke="${mix(fonce, '#1A0E08', 0.5)}" stroke-width=".5"/>`
        + `<path d="M${P2(x - w * 0.7, y + haut * 0.42)} Q${P2(x, y + haut * 0.95)} ${P2(x + w * 0.7, y + haut * 0.42)}" fill="none" stroke="#FFFFFF" stroke-width=".5" opacity="${f(0.15 + t * 0.35)}"/>`
        + `<path d="M${P2(x - w * 0.9, y - haut * 0.2)} L${P2(x - w * 0.9, y + haut * 0.3)}" stroke="#1A0E08" stroke-width=".6" opacity=".18"/>`
        + (g() < 0.05 ? `<circle cx="${f(x + (g() - 0.5) * w)}" cy="${f(y)}" r="${f(0.8 + g())}" fill="${g() < 0.5 ? '#B8C878' : '#E0D8A0'}" opacity=".8"/>` : '');
    }
  }
  return s;
}
// Du chaume (des palmes et de la paille) : rang par rang, du bas vers le haut, des mèches serrées qui pendent, leur bout
// clair, le rang du dessous dans l'ombre du rang du dessus
function tChaume(W, H, g, soleil, { fonce = '#8A6A2A', clair = '#F0D07A', haut = 5 } = {}) {
  let s = `<rect width="${f(W)}" height="${f(H)}" fill="${mix(fonce, '#1A0E08', 0.4)}"/>`;
  for (let y = H + haut; y > -haut; y -= haut) {
    s += `<rect x="0" y="${f(y - haut * 1.6)}" width="${f(W)}" height="${f(haut * 1.6)}" fill="${mix(fonce, clair, soleil ? 0.45 : 0.2)}"/>`;
    for (let x = -1; x < W + 1; x += 1.3 + g() * 0.6) {
      const t = (soleil ? 0.5 : 0.2) + g() * 0.45, l = haut * (1.1 + g() * 0.7);
      s += `<path d="M${P2(x, y - haut * 1.5)} L${P2(x + (g() - 0.5) * 1.2, y - haut * 1.5 + l)}" stroke="${mix(fonce, clair, t)}" stroke-width="${f(0.8 + g() * 0.5)}" stroke-linecap="round"/>`;
    }
    s += `<rect x="0" y="${f(y - 0.6)}" width="${f(W)}" height="1.2" fill="#1A0E08" opacity=".22"/>`;
  }
  // (les rapiéçages : des plaques de paille neuve, plus claire, et de paille grisée par la pluie)
  for (let i = 0; i < Math.max(2, Math.round(W * H / 900)); i++) { const x = g() * W, y = g() * H, w = 6 + g() * 12, h = 4 + g() * 6; s += `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(w)}" ry="${f(h)}" fill="${g() < 0.5 ? clair : '#8A8A70'}" opacity="${f(0.14 + g() * 0.12)}"/>`; }
  // (les liens de couture qui tiennent les bottes, tous les trois rangs)
  for (let y = haut * 3; y < H; y += haut * 3) for (let x = 3 + g() * 6; x < W; x += 9 + g() * 6) s += `<path d="M${P2(x, y - 1.2)} l2.4,1.6" stroke="${mix(fonce, '#1A0E08', 0.4)}" stroke-width=".8" opacity=".55"/>`;
  return s;
}
// Un colombage : l'enduit taché et chaud, les poutres sombres (sablières, poteaux, croix de Saint-André)
function tColombage(W, H, g, { enduit = '#F4E8D0', bois = '#5A3420' } = {}) {
  let s = `<rect width="${f(W)}" height="${f(H)}" fill="${enduit}"/>`;
  for (let i = 0; i < 8; i++) s += `<ellipse cx="${f(g() * W)}" cy="${f(g() * H)}" rx="${f(3 + g() * 6)}" ry="${f(2 + g() * 4)}" fill="${g() < 0.5 ? '#E2D2B4' : '#FFF8EA'}" opacity=".6"/>`;
  const b = (d, w = 2.4) => `<path d="${d}" stroke="${bois}" stroke-width="${w}" fill="none"/><path d="${d}" stroke="#A87048" stroke-width=".5" fill="none" opacity=".7" transform="translate(-.5 -.5)"/>`;
  const n = Math.max(2, Math.round(W / 15)), m = H * 0.5;
  s += b(`M0,1.2 H${f(W)} M0,${f(m)} H${f(W)} M0,${f(H - 1.2)} H${f(W)}`, 2.6);
  for (let i = 0; i <= n; i++) { const x = (i / n) * W; s += b(`M${f(x)},0 V${f(H)}`); if (i < n && i % 2 === 0) s += b(`M${f(x)},${f(m)} L${f(x + W / n)},${f(H)} M${f(x + W / n)},${f(m)} L${f(x)},${f(H)}`, 1.6); }
  return s;
}
// Une tôle ondulée rivetée (après l'apocalypse) : ses ondes, sa rouille, ses rivets
function tTole(W, H, g, soleil, { c = '#8A94A0' } = {}) {
  let s = `<rect width="${f(W)}" height="${f(H)}" fill="${mix(c, '#1A0E08', soleil ? 0.1 : 0.35)}"/>`;
  for (let x = 0; x < W; x += 2.4) s += `<rect x="${f(x)}" y="0" width="1.1" height="${f(H)}" fill="#FFFFFF" opacity="${soleil ? 0.28 : 0.12}"/><rect x="${f(x + 1.2)}" y="0" width=".8" height="${f(H)}" fill="#1A0E08" opacity=".18"/>`;
  for (let i = 0; i < 6; i++) s += `<ellipse cx="${f(g() * W)}" cy="${f(g() * H)}" rx="${f(2 + g() * 5)}" ry="${f(1.5 + g() * 4)}" fill="#B0602A" opacity="${f(0.25 + g() * 0.3)}"/>`;
  for (let x = 1.5; x < W; x += 6) s += `<circle cx="${f(x)}" cy="1.5" r=".5" fill="#3A3A40"/><circle cx="${f(x)}" cy="${f(H - 1.5)}" r=".5" fill="#3A3A40"/>`;
  return s;
}

// ——— les petites choses ———
// Une pierre ronde de la grève : son ombre, son volume, son reflet ; sa mousse
function galet(x, y, r, g, c = '#C8C0B0', mousse = false) {
  const ry = r * 0.62;
  return `<ellipse cx="${f(x + 0.8)}" cy="${f(y + ry * 0.5)}" rx="${f(r)}" ry="${f(ry * 0.6)}" fill="${OMBRE_F}" opacity=".25"/>`
    + ovale(x, y, r, ry, c)
    + `<path d="M${P2(x + r, y)} A${f(r)},${f(ry)} 0 0,1 ${P2(x - r * 0.6, y + ry * 0.8)} Q${P2(x + r * 0.2, y + ry * 0.55)} ${P2(x + r, y)} Z" fill="${mix(c, '#1A0E08', 0.3)}"/>`
    + ovale(x - r * 0.3, y - ry * 0.35, r * 0.4, ry * 0.3, mix(c, '#FFFFFF', 0.5), 0)
    + (mousse ? `<path d="M${P2(x - r * 0.9, y - ry * 0.1)} Q${P2(x - r * 0.3, y - ry * 1.05)} ${P2(x + r * 0.5, y - ry * 0.75)} Q${P2(x, y - ry * 0.4)} ${P2(x - r * 0.9, y - ry * 0.1)} Z" fill="#6AA84A"/>` : '');
}
// Une bûche couchée de (x0, y0) à (x1, y1), de rayon r : son écorce, son fil, son bout clair et ses cernes
function buche(x0, y0, x1, y1, r, g, { c = '#BF8049', bois = '#E0A96C', flotte = false } = {}) {
  const d = unite([x1 - x0, y1 - y0]), n = [-d[1], d[0]], ry = r * 0.9;
  const ecorce = flotte ? '#C3BBA9' : c, ombre = mix(ecorce, OMBRE_F, 0.4);
  let s = `<path d="${poly([plus([x0, y0], n, r), plus([x1, y1], n, r), plus([x1, y1], n, -r), plus([x0, y0], n, -r)])}" fill="${ecorce}" stroke="${ENCRE}" stroke-width="${TRAIT}" stroke-linejoin="round"/>`
    + `<path d="${poly([plus([x0, y0], n, -r * 0.1), plus([x1, y1], n, -r * 0.1), plus([x1, y1], n, -r), plus([x0, y0], n, -r)])}" fill="${ombre}" opacity=".6"/>`
    + trait(ligne([plus([x0, y0], n, r * 0.55), plus([x1, y1], n, r * 0.55)]), '#FFFFFF', 0.6, ' opacity=".35"');
  for (let i = 0; i < 3; i++) { const t = 0.2 + g() * 0.6, p = plus([x0, y0], [x1 - x0, y1 - y0], t); s += trait(ligne([plus(p, n, r * 0.7), plus(plus(p, d, 2 + g() * 3), n, r * 0.2)]), mix(ecorce, '#1A0E08', 0.45), 0.5); }
  // (le bois flotté : son fil long et ondulé, ses fentes, un nœud, un moignon de branche)
  if (flotte && r > 2.2) {
    const L = norme([x1 - x0, y1 - y0]);
    for (let k = -2; k <= 2; k++) { const o = k * r * 0.32, a = plus([x0, y0], n, o), b = plus([x1, y1], n, o * 0.9), m = plus(plus(a, [x1 - x0, y1 - y0], 0.5), n, (g() - 0.5) * r * 0.4); s += `<path d="M${P2(...a)} Q${P2(...m)} ${P2(...b)}" fill="none" stroke="${k > 0 ? '#8A8272' : '#EAE4D6'}" stroke-width=".45" opacity=".8"/>`; }
    const kn = plus(plus([x0, y0], [x1 - x0, y1 - y0], 0.35 + g() * 0.3), n, r * 0.25);
    s += `<ellipse cx="${f(kn[0])}" cy="${f(kn[1])}" rx="${f(r * 0.32)}" ry="${f(r * 0.22)}" fill="#8A8272"/><ellipse cx="${f(kn[0])}" cy="${f(kn[1])}" rx="${f(r * 0.14)}" ry="${f(r * 0.09)}" fill="#5A5246"/>`;
    if (L > r * 6) { const sb = plus(plus([x0, y0], [x1 - x0, y1 - y0], 0.62), n, r * 0.9), se = plus(sb, plus(n, d, 0.6), r * 0.9); s += plan(`M${P2(...plus(sb, d, -r * 0.3))} L${P2(...se)} L${P2(...plus(se, d, r * 0.35))} L${P2(...plus(sb, d, r * 0.4))} Z`, '#C3BBA9', 0.6); }
  }
  if (ETAT.hiver && r > 1.4) s += trait(ligne([plus([x0, y0], n, -r * 0.75), plus([x1, y1], n, -r * 0.75)]), NEIGE, r * 0.9);
  const a = Math.atan2(d[1], d[0]) * 180 / Math.PI;
  s += `<ellipse cx="${f(x1)}" cy="${f(y1)}" rx="${f(r * 0.45)}" ry="${f(ry)}" transform="rotate(${f(a)} ${f(x1)} ${f(y1)})" fill="${bois}" stroke="${ENCRE}" stroke-width="${TRAIT}"/>`
    + `<ellipse cx="${f(x1)}" cy="${f(y1)}" rx="${f(r * 0.25)}" ry="${f(ry * 0.55)}" transform="rotate(${f(a)} ${f(x1)} ${f(y1)})" fill="none" stroke="${mix(bois, '#8A5A36', 0.6)}" stroke-width=".5"/>`;
  return s;
}
// Une caisse de bois cerclée (de l'épave) en (u, v), de côté c (en cases) et haute de h
function caisse(id, u, v, c, h, g, { teinte = '#B07A48', marque = true } = {}) {
  const b = [u - c / 2, v - c / 2, u + c / 2, v + c / 2];
  const face = soleil => (W, H) => tPlanches(W, H, g, { c: teinte, larg: 3.2, horiz: true, use: 0.1 })
    + `<path d="M0,0 L${f(W)},${f(H)} M${f(W)},0 L0,${f(H)}" stroke="${mix(teinte, '#1A0E08', 0.45)}" stroke-width="1.6"/><rect width="${f(W)}" height="${f(H)}" fill="none" stroke="${mix(teinte, '#1A0E08', 0.45)}" stroke-width="2.4"/>`
    + (marque && soleil ? `<circle cx="${f(W / 2)}" cy="${f(H / 2)}" r="${f(H * 0.2)}" fill="none" stroke="#2A4A6A" stroke-width=".8" opacity=".7"/>` : '');
  return boite(id, b, 0, h, { gauche: face(true), droite: face(false), dessus: (W, H) => tPlanches(W, H, g, { c: mix(teinte, '#FFF0D8', 0.15), larg: 3.2, use: 0.1 }), voile: { pied: 0.2, haut: 0 } });
}
// Un tonneau cerclé debout en (x, y), de rayon r, haut de h
function tonneau(x, y, r, h, g, { c = '#9A6438' } = {}) {
  const ry = r * 0.5;
  let s = `<ellipse cx="${f(x + 1.5)}" cy="${f(y + 1)}" rx="${f(r * 1.1)}" ry="${f(ry * 0.9)}" fill="#1A0E08" opacity=".2"/>`
    + plan(`M${P2(x - r, y)} Q${P2(x - r * 1.12, y - h / 2)} ${P2(x - r, y - h)} A${f(r)},${f(ry)} 0 0,0 ${P2(x + r, y - h)} Q${P2(x + r * 1.12, y - h / 2)} ${P2(x + r, y)} A${f(r)},${f(ry)} 0 0,1 ${P2(x - r, y)} Z`, c)
    + `<path d="M${P2(x + r * 0.2, y + ry * 0.9)} Q${P2(x + r * 0.5, y - h / 2)} ${P2(x + r * 0.2, y - h + ry * 0.9)} L${P2(x + r, y - h)} Q${P2(x + r * 1.12, y - h / 2)} ${P2(x + r, y)} Z" fill="#1A0E08" opacity=".22"/>`
    + trait(`M${P2(x - r * 0.55, y - h + ry)} Q${P2(x - r * 0.7, y - h / 2)} ${P2(x - r * 0.55, y + ry * 0.6)}`, '#FFFFFF', 0.8, ' opacity=".3"');
  for (const t of [0.2, 0.8]) { const yy = y - h * t; s += trait(`M${P2(x - r * 1.08, yy)} A${f(r * 1.08)},${f(ry)} 0 0,0 ${P2(x + r * 1.08, yy)}`, '#5A5A62', 1.4) + trait(`M${P2(x - r * 1.05, yy - 0.5)} A${f(r * 1.05)},${f(ry)} 0 0,0 ${P2(x - r * 0.2, yy + ry - 0.5)}`, '#B8B8C0', 0.5); }
  s += ovale(x, y - h, r, ry, mix(c, '#FFF0D8', 0.15)) + trait(`M${P2(x - r * 0.7, y - h)} L${P2(x + r * 0.7, y - h)} M${P2(x - r * 0.6, y - h - ry * 0.45)} L${P2(x + r * 0.6, y - h - ry * 0.45)}`, mix(c, '#1A0E08', 0.4), 0.5);
  return s;
}
// Une lanterne pendue de (x, y) au bout de sa chaîne (l) ; sa lueur
const lanterne = (id, x, y, l = 4, c = CHAUD) => trait(`M${P2(x, y)} L${P2(x, y + l)}`, '#3A3038', 0.8, ' stroke-dasharray="1 .5"')
  + `<g transform="translate(${f(x)} ${f(y + l)})">${lueur(id, 0, 4, 12, c, 0.55)}${plan('M-2.8,0 L2.8,0 L0,-2.2 Z', '#3A3038', 0.6)}${plan('M-2.3,0 L2.3,0 L1.9,6 L-1.9,6 Z', '#FFE2A0', 0.7)}`
  + `<rect x="-1.2" y="1" width="2.4" height="4" fill="#FFFFFF" opacity=".7"/>${trait('M0,0 L0,6', '#3A3038', 0.5)}${plan('M-2.5,6 L2.5,6 L1.6,7.4 L-1.6,7.4 Z', '#3A3038', 0.5)}</g>`;
// Une touffe d'herbe de la grève en (x, y)
const touffe = (x, y, g, k = 1, c0 = HERBE, c = ETAT.hiver ? c0.map(x => mix(x, '#E8F0F4', 0.55)) : c0) => [0, 1, 2, 3, 4].map(i => { const a = -0.9 + i * 0.45 + (g() - 0.5) * 0.2, l = (5 + g() * 4) * k; return trait(`M${P2(x + (i - 2) * 0.8 * k, y)} Q${P2(x + Math.sin(a) * l * 0.4, y - l * 0.6)} ${P2(x + Math.sin(a) * l, y - l * Math.cos(a))}`, c[(i + 1) % c.length], 1.1 * k); }).join('');
// L'ombre douce au sol, une ellipse iso autour de (x, y)
const ombreSol = (id, x, y, rx, ry, a = 0.28) => `<defs>${rad(id, 0, 0, 1, [[0, OMBRE_F, a], [0.6, OMBRE_F, a * 0.5], [1, OMBRE_F, 0]])}</defs><ellipse cx="0" cy="0" rx="1" ry="1" fill="url(#${id})" transform="translate(${f(x)} ${f(y)}) scale(${f(rx)} ${f(ry)})"/>`;
// Une fenêtre sur une face (dans son repère) : l'embrasure, le carreau qui luit doux le jour et sa croisée, l'appui ;
// volets (couleur) ; jardinière (fleurs)
function fenetre(id, x, y, w, h, { arc = false, volets, fleurs, verre = ['#FFF4D0', '#FFC870'], cadre = '#F4E8D0' } = {}) {
  const forme = (i = 0) => arc ? `M${P2(x + i, y + h - i)} L${P2(x + i, y + w / 2)} Q${P2(x + w / 2, y - w * 0.2 + i * 1.6)} ${P2(x + w - i, y + w / 2)} L${P2(x + w - i, y + h - i)} Z` : `M${P2(x + i, y + i)} H${f(x + w - i)} V${f(y + h - i)} H${f(x + i)} Z`;
  let s = '';
  if (volets) for (const sg of [-1, 1]) { const vx = sg < 0 ? x - w * 0.55 - 1 : x + w + 1; s += `<rect x="${f(vx)}" y="${f(y - 0.5)}" width="${f(w * 0.55)}" height="${f(h + 1)}" fill="${volets}" stroke="${ENCRE}" stroke-width=".7"/>` + [0.3, 0.6].map(t => `<rect x="${f(vx + 0.6)}" y="${f(y + h * t)}" width="${f(w * 0.55 - 1.2)}" height=".7" fill="#1A0E08" opacity=".3"/>`).join(''); }
  s += `<path d="${forme(-1.4)}" fill="${cadre}" stroke="${ENCRE}" stroke-width=".8"/>`
    + `<defs>${lin(`${id}v`, 0, y, 0, y + h, [[0, verre[0]], [1, verre[1]]])}</defs><path d="${forme(0)}" fill="url(#${id}v)"/>`
    + `<path d="${forme(0)}" fill="none" stroke="#1A0E08" stroke-width="${f(Math.max(1, w * 0.14))}" opacity=".35"/>`
    + `<path d="M${P2(x + w * 0.15, y + h * 0.8)} L${P2(x + w * 0.5, y + h * 0.2)}" stroke="#FFFFFF" stroke-width="${f(w * 0.12)}" opacity=".5"/>`
    + trait(`M${P2(x + w / 2, y + (arc ? w * 0.02 : 0))} L${P2(x + w / 2, y + h)} M${P2(x, y + h * 0.5)} L${P2(x + w, y + h * 0.5)}`, mix(cadre, '#1A0E08', 0.35), Math.max(0.6, w * 0.1))
    + `<path d="M${P2(x - 1.6, y + h)} H${f(x + w + 1.6)} V${f(y + h + 1.4)} H${f(x - 1.6)} Z" fill="${mix(cadre, '#1A0E08', 0.15)}" stroke="${ENCRE}" stroke-width=".5"/>`;
  if (fleurs) s += `<rect x="${f(x - 1.2)}" y="${f(y + h + 1.4)}" width="${f(w + 2.4)}" height="2.6" fill="#8A5A36" stroke="${ENCRE}" stroke-width=".5"/>`
    + Array.from({ length: Math.max(3, Math.round(w / 2.2)) }, (_, i, nb = Math.max(3, Math.round(w / 2.2))) => { const fx = x + (i + 0.5) * w / nb; return `<circle cx="${f(fx)}" cy="${f(y + h + 0.6)}" r="1.5" fill="#4A9A3A"/><circle cx="${f(fx)}" cy="${f(y + h - 0.2)}" r="1.1" fill="${fleurs[i % fleurs.length]}"/>`; }).join('');
  return s;
}

// Une coque de chaloupe retournée (la cabane de l'épave) : la quille le long de u, centrée en (uc, vc), longue de lg
// (cases), large de 2 × lb (cases), haute de hh au-dessus de z ; ses bordages à clin rang par rang, la peinture usée
// (peinte) qui laisse voir le bois, l'étrave à l'avant (côté u), la quille ; chaque bordage pris par la lumière selon
// qu'il regarde le soleil ou le ciel
function coque(id, uc, vc, lg, lb, z, hh, g, { peinte = '#3E9A9A', bois = '#C8894E', rangs = 6 } = {}) {
  const N = 16, larg = a => Math.pow(Math.sin(Math.PI * (0.14 + 0.86 * a)), 0.75), haut = a => 0.7 + 0.3 * Math.sin(Math.PI * (0.05 + 0.75 * a));
  const pt = (a, th) => iso(uc - lg / 2 + a * lg, vc + lb * larg(a) * Math.cos(th), z + hh * haut(a) * Math.sin(th));
  let s = '';
  // (le côté de derrière, à peine visible, puis celui de devant, du haut vers le bas)
  for (const cote of [-1, 1]) {
    for (let k = 0; k < rangs; k++) {
      const t0 = Math.PI / 2 + cote * (-k / rangs) * Math.PI / 2 * -1, t1 = Math.PI / 2 + cote * ((k + 1) / rangs) * Math.PI / 2 * -1;
      const th0 = cote > 0 ? Math.PI / 2 - (k / rangs) * Math.PI / 2 : Math.PI / 2 + (k / rangs) * Math.PI / 2;
      const th1 = cote > 0 ? Math.PI / 2 - ((k + 1) / rangs) * Math.PI / 2 : Math.PI / 2 + ((k + 1) / rangs) * Math.PI / 2;
      void t0; void t1;
      const haut0 = Array.from({ length: N + 1 }, (_, i) => pt(i / N, th0)), bas = Array.from({ length: N + 1 }, (_, i) => pt(i / N, th1 - cote * 0.04)).reverse();
      // (la lumière : les rangs du haut regardent le ciel, ceux de devant le soleil, ceux de derrière l'ombre)
      const lum = cote > 0 ? 0.66 - k * 0.07 + (k % 2) * 0.06 : 0.28;
      const usee = g() < 0.45;
      const c = mix(mix(peinte, '#1A2A2A', 0.35), mix(peinte, '#FFFFFF', 0.35), lum);
      s += `<path d="${poly([...haut0, ...bas])}" fill="${c}" stroke="${mix(peinte, '#0A1A1A', 0.6)}" stroke-width=".6" stroke-linejoin="round"/>`;
      // (la peinture écaillée : le bois qui se montre)
      if (usee && cote > 0) { const a0 = 0.15 + g() * 0.55, a1 = a0 + 0.12 + g() * 0.15, m = (th0 + th1) / 2; s += `<path d="${poly([pt(a0, th0 - 0.02), pt(a1, th0 - 0.03), pt(a1 - 0.03, m), pt(a0 + 0.02, th1 + 0.03)])}" fill="${bois}" opacity=".85"/>`; }
      // (le bord du clin, clair, qui accroche la lumière)
      if (cote > 0) s += `<path d="M${Array.from({ length: N + 1 }, (_, i) => P2(...pt(i / N, th1 + 0.02))).join(' L')}" fill="none" stroke="#FFFFFF" stroke-width=".55" opacity="${f(0.25 + lum * 0.3)}"/>`
        + Array.from({ length: 4 }, (_, i) => { const q = pt(0.2 + i * 0.2, (th0 + th1) / 2); return `<circle cx="${f(q[0])}" cy="${f(q[1])}" r=".45" fill="#5A5048"/>`; }).join('');
    }
  }
  // (le plat-bord de bois au bas de la coque, côté soleil)
  s += trait(`M${Array.from({ length: N + 1 }, (_, i) => P2(...pt(i / N, 0.02))).join(' L')}`, '#5A3A22', 3) + trait(`M${Array.from({ length: N + 1 }, (_, i) => P2(...plus(pt(i / N, 0.02), [0, -0.7]))).join(' L')}`, '#E0A96C', 1.4);
  // (la quille, l'étrave à l'avant)
  s += trait(`M${Array.from({ length: N + 1 }, (_, i) => P2(...pt(i / N, Math.PI / 2))).join(' L')}`, '#5A3A22', 3) + trait(`M${Array.from({ length: N + 1 }, (_, i) => P2(...plus(pt(i / N, Math.PI / 2), [0, -0.8]))).join(' L')}`, '#C8894E', 0.8);
  const e0 = pt(0.97, Math.PI / 2), e1 = iso(uc + lg / 2 + 0.04, vc, z + hh * 0.15);
  s += trait(`M${P2(...e0)} L${P2(...e1)}`, '#5A3A22', 3.2) + trait(`M${P2(...e0)} L${P2(...e1)}`, '#A8703E', 1.2);
  return s;
}
// Un aviron de (x0, y0) (le bout du manche, au sol) vers (x1, y1) (le haut du manche), sa pale au bout
function aviron(x0, y0, x1, y1, g, { pale = 10 } = {}) {
  const d = unite([x1 - x0, y1 - y0]), n = [-d[1], d[0]], b = plus([x1, y1], d, pale);
  return buche(x0, y0, x1, y1, 1.3, g, { c: '#D8A868', bois: '#F0D0A0' })
    + plan(`M${P2(...plus([x1, y1], n, 1.3))} Q${P2(...plus(plus([x1, y1], d, pale * 0.3), n, 3.4))} ${P2(...plus(b, n, 2.6))} Q${P2(...plus(b, d, 1.6))} ${P2(...plus(b, n, -2.6))} Q${P2(...plus(plus([x1, y1], d, pale * 0.3), n, -3.4))} ${P2(...plus([x1, y1], n, -1.3))} Z`, '#E8B878')
    + `<path d="M${P2(...plus(plus([x1, y1], d, pale * 0.3), n, 0))} L${P2(...plus(b, d, 0.6))}" stroke="#B8844A" stroke-width=".6"/>`
    + `<path d="M${P2(...plus(plus([x1, y1], d, pale * 0.55), n, -2.6))} L${P2(...plus(plus([x1, y1], d, pale * 0.95), n, -2.4))}" stroke="#E8504A" stroke-width="1.6" opacity=".85"/>`;
}
// Un hublot récupéré sur une face (dans son repère) : la bague de laiton, ses rivets, le verre qui luit doux
const hublot = (id, x, y, r) => `<defs>${rad(`${id}v`, x - r * 0.3, y - r * 0.3, r * 1.4, [[0, '#FFF4D0'], [1, '#FFC060']])}</defs><circle cx="${f(x)}" cy="${f(y)}" r="${f(r + 1.8)}" fill="#C8963A" stroke="${ENCRE}" stroke-width=".7"/>`
  + `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="url(#${id}v)" stroke="#8A5A1A" stroke-width=".7"/>` + Array.from({ length: 8 }, (_, i) => { const a = i * Math.PI / 4; return `<circle cx="${f(x + Math.cos(a) * (r + 0.9))}" cy="${f(y + Math.sin(a) * (r + 0.9))}" r=".4" fill="#FFE8A0"/>`; }).join('')
  + `<path d="M${P2(x - r * 0.5, y + r * 0.2)} L${P2(x + r * 0.1, y - r * 0.6)}" stroke="#FFFFFF" stroke-width="${f(r * 0.25)}" opacity=".6"/>`;

// Des bordages récupérés sur l'épave, cloués à l'horizontale : chacun sa peinture délavée (sarcelle, blanc, rouge
// corail), écaillée jusqu'au bois par endroits, ses clous rouillés ; une planche de travers en renfort
function tBordages(W, H, g, { peintures = ['#4E9A96', '#E6DECA', '#E6DECA', '#C8B898', '#D27A5E'], bois = '#C8894E', larg = 4.4 } = {}) {
  let s = `<rect width="${f(W)}" height="${f(H)}" fill="${mix(bois, '#1A0E08', 0.6)}"/>`;
  for (let y = 0; y < H; y += larg) {
    let x = -g() * 10;
    while (x < W) {
      const l = 14 + g() * 22, c = peintures[Math.floor(g() * peintures.length)], use = 0.25 + g() * 0.35;
      s += `<rect x="${f(x + 0.3)}" y="${f(y + 0.3)}" width="${f(l - 0.6)}" height="${f(larg - 0.6)}" fill="${mix(c, '#FFFFFF', 0.08)}"/>`
        + `<rect x="${f(x + 0.3)}" y="${f(y + 0.3)}" width="${f(l - 0.6)}" height=".7" fill="#FFFFFF" opacity=".25"/>`
        + `<rect x="${f(x + 0.3)}" y="${f(y + larg - 1)}" width="${f(l - 0.6)}" height=".6" fill="#1A0E08" opacity=".25"/>`;
      // (la peinture écaillée : le bois qui se montre, en taches)
      for (let k = 0; k < 2; k++) if (g() < use) { const ex = x + g() * l, ew = 2 + g() * 6; s += `<path d="M${P2(ex, y + 0.6)} q${f(ew * 0.5)},${f(larg * 0.3)} ${f(ew)},0 q${f(-ew * 0.2)},${f(larg * 0.5)} ${f(-ew * 0.6)},${f(larg * 0.7)} Z" fill="${bois}" opacity=".9"/>`; }
      s += `<circle cx="${f(x + 1.4)}" cy="${f(y + larg / 2)}" r=".45" fill="#8A4A2A"/><circle cx="${f(x + l - 1.4)}" cy="${f(y + larg / 2)}" r=".45" fill="#8A4A2A"/>`;
      x += l;
    }
  }
  return s;
}
// Un toit de palmes : rang par rang, du bas vers le haut, de larges folioles qui pendent côte à côte, vertes, leur
// pointe qui sèche en paille ; le rang du dessous dans l'ombre du rang du dessus
function tPalmes(W, H, g, soleil, { haut = 6 } = {}) {
  const base = soleil ? '#5A9A48' : '#2E6A4A';
  let s = `<rect width="${f(W)}" height="${f(H)}" fill="${mix(base, '#0E2A22', 0.4)}"/>`;
  for (let y = H + haut, r = 0; y > -haut; y -= haut, r++) {
    const ton = (soleil ? 0.55 : 0.2) + (r % 2) * 0.08;
    for (let x = (r % 2) * 1.6 - 2; x < W + 3; x += 3.1) {
      const l = haut * (1.5 + g() * 0.35), t = ton + (g() - 0.5) * 0.18, x0 = x + (g() - 0.5) * 0.6, top = y - haut * 1.7;
      const vert = mix('#2E6A4A', '#A1D46C', t), sec = mix('#B89A4A', '#EBC46F', t);
      s += `<path d="M${P2(x0 - 1.5, top)} Q${P2(x0 - 1.7, top + l * 0.6)} ${P2(x0, top + l)} Q${P2(x0 + 1.7, top + l * 0.6)} ${P2(x0 + 1.5, top)} Z" fill="${vert}"/>`
        + (g() < 0.45 ? `<path d="M${P2(x0 - 1.1, top + l * 0.62)} Q${P2(x0, top + l * 0.7)} ${P2(x0 + 1.1, top + l * 0.62)} Q${P2(x0 + 0.8, top + l * 0.85)} ${P2(x0, top + l)} Q${P2(x0 - 0.8, top + l * 0.85)} ${P2(x0 - 1.1, top + l * 0.62)} Z" fill="${sec}"/>` : '')
        + `<path d="M${P2(x0, top + 0.5)} L${P2(x0, top + l - 1)}" stroke="${mix(vert, '#0E2A22', 0.35)}" stroke-width=".4"/>`;
    }
    s += `<rect x="0" y="${f(y - haut * 1.7)}" width="${f(W)}" height="1.6" fill="#0E2A22" opacity=".3"/>`;
  }
  return s;
}
// Des cannes de bambou serrées debout (les murs de la case) : chacune bombée, ses nœuds décalés, une ligature de rotin
// en travers
function tTresse(W, H, g, { c = '#D8B868' } = {}) {
  let s = `<rect width="${f(W)}" height="${f(H)}" fill="${mix(c, '#1A0E08', 0.55)}"/>`;
  for (let x = 0; x < W; x += 2.6) {
    const col = mix(c, g() < 0.5 ? '#FFF4DC' : '#8A6A2A', g() * 0.3);
    s += `<rect x="${f(x + 0.2)}" y="0" width="2.2" height="${f(H)}" rx="1" fill="${col}"/><rect x="${f(x + 0.6)}" y="0" width=".6" height="${f(H)}" fill="#FFFFFF" opacity=".3"/>`;
    for (let y = 3 + g() * 6; y < H; y += 7 + g() * 2) s += `<rect x="${f(x + 0.2)}" y="${f(y)}" width="2.2" height=".7" fill="${mix(c, '#5A4A1A', 0.6)}"/>`;
  }
  for (const y of [H * 0.3, H * 0.75]) s += `<rect x="0" y="${f(y)}" width="${f(W)}" height="1.4" fill="#8A6A3A"/><rect x="0" y="${f(y)}" width="${f(W)}" height=".5" fill="#C8A060"/>`;
  return s;
}
// Un mur d'argile chaulé (torchis) : l'enduit crème taché, ses craquelures, le bas teinté de terre
function tArgile(W, H, g, { c = '#F6EAD2' } = {}) {
  let s = `<rect width="${f(W)}" height="${f(H)}" fill="${c}"/>`;
  for (let i = 0; i < 10; i++) s += `<ellipse cx="${f(g() * W)}" cy="${f(g() * H)}" rx="${f(3 + g() * 7)}" ry="${f(2 + g() * 4)}" fill="${g() < 0.5 ? '#EAD8B8' : '#FFFAF0'}" opacity=".7"/>`;
  for (let i = 0; i < 4; i++) { let x = g() * W, y = g() * H, d = `M${P2(x, y)}`; for (let k = 0; k < 4; k++) { x += (g() - 0.5) * 5; y += 1.5 + g() * 2; d += ` L${P2(x, y)}`; } s += `<path d="${d}" fill="none" stroke="#B8A080" stroke-width=".4" opacity=".7"/>`; }
  for (let i = 0; i < 2; i++) { const x = g() * W * 0.8, y = H * (0.2 + g() * 0.5), w = 8 + g() * 8, h = 5 + g() * 4; s += `<path d="M${P2(x, y)} q${f(w * 0.3)},${f(-h * 0.6)} ${f(w * 0.7)},${f(-h * 0.3)} q${f(w * 0.4)},${f(h * 0.4)} ${f(w * 0.3)},${f(h)} q${f(-w * 0.5)},${f(h * 0.4)} ${f(-w)},${f(-h * 0.1)} Z" fill="#B8A890" stroke="#A89878" stroke-width=".5"/>` + [0, 1, 2].map(k => `<rect x="${f(x + 1 + k * w * 0.3)}" y="${f(y - h * 0.3 + (k % 2) * 2.4)}" width="${f(w * 0.26)}" height="2.2" rx=".6" fill="#D8CCB4" stroke="#8A7A62" stroke-width=".3"/>`).join(''); }
  return s + `<defs><linearGradient id="arg${Math.round(W)}" x1="0" y1="0" x2="0" y2="1"><stop offset=".72" stop-color="#C89A6A" stop-opacity="0"/><stop offset="1" stop-color="#C89A6A" stop-opacity=".55"/></linearGradient></defs><rect width="${f(W)}" height="${f(H)}" fill="url(#arg${Math.round(W)})"/>`;
}
// Un tronc de bambou de (x0, y0) à (x1, y1), rayon r : ses nœuds
function bambou(x0, y0, x1, y1, r) {
  const d = unite([x1 - x0, y1 - y0]), n = [-d[1], d[0]], L = norme([x1 - x0, y1 - y0]);
  let s = `<path d="${poly([plus([x0, y0], n, r), plus([x1, y1], n, r), plus([x1, y1], n, -r), plus([x0, y0], n, -r)])}" fill="#C8B060" stroke="${ENCRE}" stroke-width="${f(TRAIT * 0.8)}"/>`
    + trait(ligne([plus([x0, y0], n, -r * 0.3), plus([x1, y1], n, -r * 0.3)]), '#F0E0A0', r * 0.5, ' opacity=".7"')
    + trait(ligne([plus([x0, y0], n, r * 0.6), plus([x1, y1], n, r * 0.6)]), '#8A7A3A', r * 0.4, ' opacity=".5"');
  for (let t = 9; t < L; t += 9) { const q = plus([x0, y0], d, t); s += trait(ligne([plus(q, n, r), plus(q, n, -r)]), '#7A6A2A', 0.9); }
  return s;
}

module.exports = {
  f, rnd, setHiver, hiver, NEIGE, NEIGE_O, BORD, ombrePortee, ENCRE, TRAIT, SOLEIL, OMBRE_F, HERBE, SABLE, CYAN, MAGENTA, ACIDE, CHAUD, VIOLET,
  P2, poly, ligne, lin, rad, plan, trait, ovale, lueur, neon, mix, plus, moins, norme, unite,
  iso, PAS, AXE_U, AXE_V, plaque, voileFace, boite, toit, surPan,
  tPierres, tBriques, tPlanches, tRondins, tTuiles, tChaume, tColombage, tTole, tBordages, tPalmes, tTresse, tArgile, bambou,
  galet, buche, caisse, tonneau, lanterne, touffe, ombreSol, fenetre, coque, aviron, hublot
};
