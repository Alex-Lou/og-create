// La troupe des Naufragés : kit commun de dessin en SVG (de petits personnages chibi au trait net).
// Repère 48 × 64, pieds en bas au centre (24, 62). Vues : face (« front »), trois quarts avant (« se », vers le
// bas-gauche), trois quarts dos (« ne », vers le haut-droit) ; le miroir horizontal donne les deux autres directions.
// Poses : repos (4 images : il respire, un clignement), marche (8 : un cycle continu, appui, passage, appui, passage),
// salut (4 : la main va et vient), action (2).
// Chaque personnage ne décrit que ses couleurs et ses pièces ; le gabarit (trait, yeux, marche, ombres) est commun.

const OUT = '#3C2819';
const W = 1.1; // trait des pièces ; détails intérieurs plus fins
const r2 = n => Math.round(n * 100) / 100;
const st = (w = W) => `stroke="${OUT}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
const P = (d, fill, w = W) => `<path d="${d}" fill="${fill}" ${w ? st(w) : 'stroke="none"'}/>`;
const E = (cx, cy, rx, ry, fill, w = W) => `<ellipse cx="${r2(cx)}" cy="${r2(cy)}" rx="${r2(rx)}" ry="${r2(ry)}" fill="${fill}" ${w ? st(w) : 'stroke="none"'}/>`;
const L = (a, b, color, w) => `<line x1="${r2(a[0])}" y1="${r2(a[1])}" x2="${r2(b[0])}" y2="${r2(b[1])}" stroke="${color}" stroke-width="${r2(w)}" stroke-linecap="round"/>`;
// Gélule (bras, manche, manche d'outil) : contour puis couleur par-dessus
const limb = (a, b, w, fill) => L(a, b, OUT, w + W * 2) + L(a, b, fill, w);
// Découpe : dessine « inner » seulement à l'intérieur de « d »
const clip = (id, d, inner) => `<clipPath id="${id}"><path d="${d}"/></clipPath><g clip-path="url(#${id})">${inner}</g>`;

// Les poses et leurs images (repos : il respire ; marche : un cycle ; salut : la main va et vient) ; action : 2
const IMAGES = { repos: 4, marche: 8, salut: 4, action: 2 };
// entre deux points (ou deux nombres), à k (0 : a, 1 : b)
const lerp = (a, b, k) => (Array.isArray(a) ? a.map((v, i) => r2(v + (b[i] - v) * k)) : r2(a + (b - a) * k));

// La lumière vient d'en haut à gauche : chaque couleur principale (peau, cheveux, habits, chaussures, accessoires) est un
// dégradé, clair en haut à gauche, sombre en bas à droite. Les surfaces (fill) ont chacune leur dégradé dans leur
// propre boîte : chaque pièce a son volume. Les traits (stroke : les bras) prennent un dégradé en coordonnées utilisateur
// (la boîte d'un trait droit est plate, un dégradé en boîte n'y paraît pas). lumiere(c, id) rend les définitions et
// la table couleur -> url ; peindre(s, table) remplace les aplats dans le dessin rendu.
const hsl = hex => { const n = parseInt(hex.slice(1), 16), r = (n >> 16) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255; const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn; let h = 0, sat = 0; if (d) { sat = d / (1 - Math.abs(2 * l - 1)); h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h *= 60; if (h < 0) h += 360; } return [h, sat, l]; };
const hex = ([h, s, l]) => { const c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs(((h / 60) % 2) - 1)), m = l - c / 2; const [r, g, b] = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x]; return '#' + [r, g, b].map(v => Math.round(Math.min(1, Math.max(0, v + m)) * 255).toString(16).padStart(2, '0')).join('').toUpperCase(); };
const ton = (c, k) => { const [h, s, l] = hsl(c); return hex([h, s, k < 1 ? l * k : l + (1 - l) * (k - 1)]); };
const PRINCIPALES = ['skin', 'hair', 'top', 'bas', 'leg', 'sleeve', 'shoe', 'coat', 'base', 'hand', 'buzz'];
function lumiere(c, id) {
  const couleurs = new Set();
  for (const k of PRINCIPALES) if (typeof c[k] === 'string' && /^#[0-9A-Fa-f]{6}$/.test(c[k])) couleurs.add(c[k].toUpperCase());
  for (const k of c.teintes || []) couleurs.add(k.toUpperCase()); // les couleurs propres d'un maître (ses cheveux, son habit)
  for (const cols of Object.values(c.acc || {})) for (const k of cols) if (/^#[0-9A-Fa-f]{6}$/.test(k)) couleurs.add(k.toUpperCase());
  couleurs.delete('#FFFFFF'); couleurs.delete(OUT);
  const habits = new Set(['top', 'bas', 'leg', 'sleeve', 'coat', 'base'].map(k => (typeof c[k] === 'string' ? c[k].toUpperCase() : null)));
  let defs = '';
  const table = new Map();
  let i = 0;
  for (const h of couleurs) {
    const g = `${id}G${i++}`;
    const l = hsl(h)[2];
    // les couleurs très claires gardent un dégradé doux ; les sombres, un reflet net
    const clair = ton(h, l > 0.85 ? 1.12 : 1.28), sombre = ton(h, l < 0.25 ? 0.68 : 0.74);
    const stops = `<stop offset="0" stop-color="${clair}"/><stop offset="0.45" stop-color="${h}"/><stop offset="1" stop-color="${sombre}"/>`;
    // les habits (buste, manches, jambes) partagent un seul champ de lumière sur le corps : la manche suit le tissu
    // du buste ; les autres couleurs ont leur dégradé par pièce (les traits prennent le champ commun)
    defs += `<linearGradient id="${g}" x1="0" y1="0" x2="0.75" y2="1">${stops}</linearGradient><linearGradient id="${g}t" gradientUnits="userSpaceOnUse" x1="${habits.has(h) ? 6 : 4}" y1="${habits.has(h) ? 28 : 2}" x2="42" y2="60">${stops}</linearGradient>`;
    table.set(h, habits.has(h) ? { fill: `${g}t`, stroke: `${g}t` } : { fill: g, stroke: `${g}t` });
  }
  return { defs: defs ? `<defs>${defs}</defs>` : '', table };
}
const peindre = (s, table) => (table.size ? s.replace(/(fill|stroke)="(#[0-9A-Fa-f]{6})"/g, (m, a, h) => { const g = table.get(h.toUpperCase()); return g ? `${a}="url(#${g[a]})"` : m; }) : s);

const EYE_DARK = '#2A2420';
const WHITE = '#FFFFFF';

// Yeux : grands ovales sombres et reflet. Modes : open, blink (fermés), joy (arcs vers le haut), wink (2e œil fermé),
// big (surpris : blanc et petite pupille), sad / angry (paupière inclinée), sleepy (mi-clos), squeeze (> <)
function eyes(list, mode, ry = 2.35, EYE = EYE_DARK) {
  const cx = list.reduce((a, e) => a + e[0], 0) / list.length;
  let s = '';
  list.forEach(([x, y, rx], i) => {
    const k = cx > x ? 1 : -1; // vers le milieu du visage
    if (mode === 'blink') s += P(`M${r2(x - 1.7)},${r2(y + 0.4)} Q${x},${r2(y + 1.8)} ${r2(x + 1.7)},${r2(y + 0.4)}`, 'none', 1);
    else if (mode === 'joy') s += P(`M${r2(x - 1.8)},${r2(y + 1)} Q${x},${r2(y - 1.2)} ${r2(x + 1.8)},${r2(y + 1)}`, 'none', 1.1);
    else if (mode === 'wink' && i === 1) s += P(`M${r2(x - 1.6)},${r2(y + 0.2)} L${r2(x + 1.6)},${r2(y + 0.2)}`, 'none', 1);
    else if (mode === 'big') s += E(x, y, rx + 0.25, ry + 0.1, WHITE, 0.8) + E(x, y + 0.2, rx * 0.55, ry * 0.5, EYE, 0) + E(x + 0.35, y - 0.4, 0.3, 0.3, WHITE, 0);
    else if (mode === 'squeeze') s += P(`M${r2(x - k * 1.3)},${r2(y - 1.4)} L${r2(x + k * 1.1)},${y} L${r2(x - k * 1.3)},${r2(y + 1.4)}`, 'none', 1.1);
    else if (mode === 'sleepy') {
      // mi-clos : paupière lourde et bombée, on ne voit que le bas de l'œil
      const top = y + 0.3;
      s += `<path d="M${r2(x - rx)},${r2(top)} Q${x},${r2(top - 0.9)} ${r2(x + rx)},${r2(top)} A${rx} ${r2(ry * 0.85)} 0 0 1 ${r2(x - rx)},${r2(top)} Z" fill="${EYE}"/>`
        + E(x + 0.4, top + 0.9, 0.35, 0.35, WHITE, 0)
        + P(`M${r2(x - rx - 0.5)},${r2(top + 0.3)} Q${x},${r2(top - 1.1)} ${r2(x + rx + 0.5)},${r2(top + 0.3)}`, 'none', 0.9);
    } else if (mode === 'sad' || mode === 'angry') {
      // demi-œil sous une paupière inclinée (triste : coin extérieur tombant ; fâché : coin intérieur abaissé)
      const [tO, tI] = mode === 'sad' ? [0.9, -0.3] : [-0.3, 1];
      const top = y - 0.6;
      const yl = r2(top + (k > 0 ? tO : tI)), yr = r2(top + (k > 0 ? tI : tO));
      s += `<path d="M${r2(x - rx)},${yl} L${r2(x + rx)},${yr} A${rx} ${ry} 0 0 1 ${r2(x - rx)},${yl} Z" fill="${EYE}"/>`
        + E(x + 0.45, y + 0.6, 0.42, 0.42, WHITE, 0)
        + P(`M${r2(x - rx - 0.4)},${r2(yl - (yr - yl) * 0.12)} L${r2(x + rx + 0.4)},${r2(yr + (yr - yl) * 0.12)}`, 'none', 1);
    } else s += E(x, y, rx, ry, EYE, 0) + E(x + 0.55, y - 1, 0.62, 0.62, WHITE, 0) + E(x - 0.5, y + 1, 0.3, 0.3, WHITE, 0);
  });
  return s;
}

// Expressions communes à toute la troupe
const EXPRS = ['neutre', 'content', 'rire', 'surpris', 'triste', 'fache', 'gene', 'endormi'];
// sourcils : décalage du bout intérieur, du bout extérieur, cambrure (négatif = bombé vers le haut)
const BROW = {
  neutre: [0, 0.1, -0.6], content: [-0.3, -0.2, -0.7], rire: [-0.6, -0.4, -0.8], surpris: [-1.4, -1.1, -1],
  triste: [-1.1, 0.6, 0], fache: [1.1, -0.6, 0], gene: [-0.7, 0.3, -0.2], endormi: [0.4, 0.4, -0.3]
};
const EYEMODE = { rire: 'joy', endormi: 'blink', surpris: 'big', gene: 'squeeze', triste: 'sad', fache: 'angry' };
const drop = (x, y, r, fill, w = 0.7) => P(`M${r2(x)},${r2(y - r * 1.7)} Q${r2(x + r * 1.5)},${r2(y + r * 0.2)} ${r2(x)},${r2(y + r)} Q${r2(x - r * 1.5)},${r2(y + r * 0.2)} ${r2(x)},${r2(y - r * 1.7)} Z`, fill, w)
  + E(x - r * 0.3, y - r * 0.1, r * 0.22, r * 0.35, WHITE, 0);
const zee = (x, y, z) => {
  const d = `M${r2(x)},${r2(y)} L${r2(x + z)},${r2(y)} L${r2(x)},${r2(y + z)} L${r2(x + z)},${r2(y + z)}`;
  return `<path d="${d}" fill="none" stroke="${OUT}" stroke-width="${r2(z * 0.5 + 0.8)}" stroke-linejoin="round" stroke-linecap="round"/>`
    + `<path d="${d}" fill="none" stroke="${WHITE}" stroke-width="${r2(z * 0.5)}" stroke-linejoin="round" stroke-linecap="round"/>`;
};

// Expression du visage selon ctx.expr. g : géométrie propre au personnage et à la vue
//   eyes [[x, y, rx], …], ry, brow (couleur), browY, browW, mouth [x, y], mw (demi-largeur du sourire), neutral(mx, my)
//   (bouche au repos, propre au caractère), restEyes (yeux au repos, « open » par défaut), mouthC, tongue,
//   cheeks [[x, rx], …], cheekY, temple, anger, zz (où poser les signes)
// L'expression « vide » (portraits.js) ne dessine rien : elle garde la géométrie du visage, que le portrait redessine
let visage = null;
const visageVide = () => visage;
function expression(g, ctx) {
  if (ctx.expr === 'vide') { visage = g; return ''; }
  const { expr } = ctx, n = ctx.n % 2;
  const [mx, my] = g.mouth;
  const w = g.mw;
  const cx = g.eyes.reduce((a, e) => a + e[0], 0) / g.eyes.length;
  let s = '';
  const [bi, bo, arch] = BROW[expr];
  for (const [x, y, rx] of g.eyes) {
    const k = cx > x ? 1 : -1, hw = rx + 0.45, by = y + g.browY;
    s += `<path d="M${r2(x - k * hw)},${r2(by + bo)} Q${r2(x)},${r2(by + (bi + bo) / 2 + arch)} ${r2(x + k * hw)},${r2(by + bi)}" fill="none" stroke="${g.brow}" stroke-width="${g.browW}" stroke-linecap="round"/>`;
  }
  const rest = expr === 'neutre' && g.restEyes ? g.restEyes : 'open'; // yeux au repos propres au personnage
  s += eyes(g.eyes, ctx.eyeMode || EYEMODE[expr] || (ctx.blink ? 'blink' : rest), g.ry, g.eyeColor); // g.eyeColor : facultatif
  // bouche ouverte : contour sombre, langue découpée dedans
  const open = (hw, depth) => {
    const d = `M${r2(mx - hw)},${r2(my - 0.2)} Q${r2(mx)},${r2(my + depth)} ${r2(mx + hw)},${r2(my - 0.2)} Z`;
    return P(d, g.mouthC, 0.9) + clip(`${ctx.id}m`, d, E(mx, my + depth * 0.42, hw * 0.55, 0.9, g.tongue, 0));
  };
  const line = d => P(d, 'none', 0.9);
  if (expr === 'neutre') s += line(g.neutral(mx, my));
  else if (expr === 'content') s += ctx.open ? open(w + 0.2, Math.min(w * 1.2 + 1, 3.6)) : line(`M${r2(mx - w)},${my} Q${mx},${r2(my + w * 0.94)} ${r2(mx + w)},${my}`);
  else if (expr === 'rire') s += open(w + 0.4, Math.min(w * 1.5 + 1.2, 4.2) - (n ? 0.7 : 0));
  else if (expr === 'surpris') s += E(mx, my + 0.9, 0.95, 1.25, g.mouthC, 0.9);
  else if (expr === 'triste') s += line(`M${r2(mx - 1.4)},${r2(my + 1.1)} Q${mx},${r2(my - 0.1)} ${r2(mx + 1.4)},${r2(my + 1.1)}`);
  else if (expr === 'fache') s += P(`M${r2(mx - 1.7)},${r2(my + 1.3)} Q${mx},${r2(my - 0.4)} ${r2(mx + 1.7)},${r2(my + 1.3)} Q${mx},${r2(my + 0.7)} ${r2(mx - 1.7)},${r2(my + 1.3)} Z`, g.mouthC, 0.9);
  else if (expr === 'gene') s += P(`M${r2(mx - 1.8)},${r2(my + 0.6)} Q${r2(mx - 1.2)},${r2(my - 0.1)} ${r2(mx - 0.6)},${r2(my + 0.6)} Q${mx},${r2(my + 1.3)} ${r2(mx + 0.6)},${r2(my + 0.6)} Q${r2(mx + 1.2)},${r2(my - 0.1)} ${r2(mx + 1.8)},${r2(my + 0.6)}`, 'none', 0.8);
  else if (expr === 'endormi') s += E(mx, my + 0.7, 0.6, 0.75, g.mouthC, 0.8);
  // petits signes : rougeur hachurée et goutte (gêné), larme (triste), veine (fâché), Zzz (endormi)
  if (expr === 'gene') {
    for (const [x, rx] of g.cheeks) for (const d of [-0.5, 0, 0.5]) s += L([x + d * rx * 1.2 - 0.35, g.cheekY + 0.55], [x + d * rx * 1.2 + 0.35, g.cheekY - 0.55], '#D9605A', 0.45);
    s += drop(g.temple[0], g.temple[1] + n * 0.9, 2, '#A9DCFF');
  }
  if (expr === 'triste') {
    const [x, y, rx] = g.eyes[0];
    s += drop(x - (cx > x ? 1 : -1) * (rx - 0.2), y + g.ry + 1.2 + n * 1.2, 1.05, '#A9DCFF', 0.55);
  }
  if (expr === 'fache') {
    const [x, y] = g.anger, a = n ? 0.6 : 0.5, b = n ? 2 : 1.7;
    const d = [[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([i, j]) => `M${r2(x + i * a)},${r2(y + j * b)} Q${r2(x + i * a)},${r2(y + j * a)} ${r2(x + i * b)},${r2(y + j * a)}`).join(' ');
    s += `<path d="${d}" fill="none" stroke="${WHITE}" stroke-width="2.2" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#E0483C" stroke-width="1" stroke-linecap="round"/>`;
  }
  if (expr === 'endormi') {
    const [x, y] = g.zz;
    s += n ? zee(x + 0.6, y - 1, 2) + zee(x + 3.2, y - 4.6, 2.6) : zee(x, y, 1.8) + zee(x + 2.6, y - 3.4, 2.4);
  }
  return s;
}

// Botte ou sabot : dir -1 pointe à gauche, 0 de face, 1 de dos ; tilt : talon levé (degrés)
function shoe(c, x, y, dir, tilt = 0) {
  const toe = dir < 0 ? 1.4 : 0;
  const d = `M${r2(x - 3)},${r2(y)} L${r2(x + 3)},${r2(y)} L${r2(x + 3.3)},${r2(y + 3.6)} Q${r2(x - 0.4)},${r2(y + 5.4)} ${r2(x - 3.3 - toe)},${r2(y + 3.8)} Z`;
  const sole = `M${r2(x - 3.4 - toe)},${r2(y + 3.3)} Q${r2(x - 0.4)},${r2(y + 5)} ${r2(x + 3.4)},${r2(y + 3.1)} L${r2(x + 3.4)},${r2(y + 5.6)} L${r2(x - 3.4 - toe)},${r2(y + 5.6)} Z`;
  const body = P(d, c.shoe) + clip(`${c.uid}s${Math.round(x * 10)}${Math.round(y * 10)}`, d, `<path d="${sole}" fill="${c.shoeS}"/>`) + P(d, 'none')
    + E(x - 1 - toe * 0.4, y + 1.6, 0.9, 0.5, c.shoeH, 0);
  return tilt ? `<g transform="rotate(${tilt} ${r2(x - (dir < 0 ? 3 : -3))} ${r2(y + 4.5)})">${body}</g>` : body;
}
// Pied nu : dir -1 pointe à gauche, 0 de face, 1 de dos (talon seul) ; tilt : talon levé
function bareFoot(c, x, y, dir, tilt = 0) {
  const toe = dir < 0 ? 1.4 : 0;
  const d = `M${r2(x - 2.3)},${r2(y)} L${r2(x + 2.3)},${r2(y)} Q${r2(x + 2.9)},${r2(y + 3.4)} ${r2(x + 1.4)},${r2(y + 4.3)} L${r2(x - 1.4 - toe)},${r2(y + 4.3)} Q${r2(x - 3.1 - toe)},${r2(y + 3.8)} ${r2(x - 2.3)},${r2(y)} Z`;
  let s = P(d, c.skin) + E(x + 1.1, y + 1.4, 0.7, 1.1, c.skinS || c.skin, 0);
  if (dir <= 0) for (const t of dir < 0 ? [-3, -1.9] : [-1, 0.4]) s += L([x + t, y + 3.5], [x + t, y + 4.1], OUT, 0.45); // orteils
  return tilt ? `<g transform="rotate(${tilt} ${r2(x - (dir < 0 ? 3 : -3))} ${r2(y + 4.5)})">${s}</g>` : s;
}

function leg(c, x, y, dir, tilt) {
  const top = c.hip;
  return `<rect x="${r2(x - c.legW / 2)}" y="${top}" width="${c.legW}" height="${r2(y - top + 1.2)}" rx="1.6" fill="${c.leg}" ${st()}/>`
    + `<rect x="${r2(x + c.legW / 2 - 1.6)}" y="${top + 0.6}" width="1.1" height="${r2(y - top - 0.4)}" rx="0.5" fill="${c.legS}"/>`
    + (c.foot ? c.foot(c, x, y, dir, tilt) : shoe(c, x, y, dir, tilt));
}
// Bras : épaule a → main b, avec un coude facultatif (deux segments d'un seul trait, sans couture au coude) ;
// le revers éventuel est posé juste avant la main ; main : facultatif, un autre dessin à la place du poing rond
// (une main ouverte : design/atelier/gestes.js)
// L'épaule de la manche : son bout rond s'enfonce à peine sous la ligne du buste (1,1 px : son sommet affleure l'épaule) (le buste est redessiné par-dessus, à
// hauteur des épaules : troupe.frame) au lieu de dépasser comme un tube posé dessus
function enfoncer(pts) {
  const [a, n] = pts, len = Math.hypot(n[0] - a[0], n[1] - a[1]) || 1;
  return [[r2(a[0] + (n[0] - a[0]) / len * 1.1), r2(a[1] + (n[1] - a[1]) / len * 1.1)], ...pts.slice(1)];
}
// partie : 'tout' (le bras entier, pour les gestes), 'derriere' (la manche seule : au repos et en marche, elle passe
// derrière le buste, et part ainsi de sous l'épaule) ou 'devant' (ce qui passe devant le buste : l'avant-bras nu sous
// une manche coupée, le bandage, la main)
function arm(c, a, b, elbow, main, partie = 'tout') {
  const pts = enfoncer(elbow ? [a, elbow, b] : [a, b]);
  if (c.sleeves || c.bandage) return armOf(c, pts, main, partie); // naufragés : manche retroussée ou arrachée, bandage
  const d = 'M' + pts.map(p => `${r2(p[0])},${r2(p[1])}`).join(' L');
  const line = (color, w) => `<path d="${d}" fill="none" stroke="${color}" stroke-width="${r2(w)}" stroke-linecap="round" stroke-linejoin="round"/>`;
  let s = '';
  if (partie !== 'devant') {
    s += line(OUT, c.armW + W * 2) + line(c.sleeve, c.armW);
    if (c.cuff) {
      const f = pts[pts.length - 2];
      const len = Math.hypot(b[0] - f[0], b[1] - f[1]);
      const at = k => [b[0] - (b[0] - f[0]) * k / len, b[1] - (b[1] - f[1]) * k / len];
      s += limb(at(2.5), at(0.9), c.armW, c.cuff);
    }
  }
  if (partie === 'derriere') return s;
  return s + (main != null ? main : poing(c, b)); // main (c.hand : mains terreuses, gants…)
}
// Le poing rond ; avec des moufles (c.moufle), le pouce se pose par-dessus, du côté du corps
const poing = (c, b) => E(b[0], b[1], 2.1, 2.1, c.hand || c.skin) + (c.moufle ? E(b[0] + (b[0] < 24 ? 2.1 : -2.1), b[1] - 0.5, 0.95, 1.2, c.hand, 0.85) : '');

// Bras à manche coupée : c.sleeves 'court' (manche courte : l'ourlet à mi-bras, l'avant-bras nu), 'roll' (manche
// retroussée : bourrelet, avant-bras nu) ou 'torn' (arrachée au coude : bord en dents, avant-bras nu) ; c.bandage
// 'left' ou 'right' : un bandage de chiffon sur l'avant-bras de ce côté du personnage (de face et de trois quarts, son
// bras gauche est à droite de l'écran ; de dos, à gauche)
function armOf(c, pts, main, partie = 'tout') {
  const b = pts[pts.length - 1], f = pts[pts.length - 2];
  const len = Math.hypot(b[0] - f[0], b[1] - f[1]) || 1;
  const ux = (b[0] - f[0]) / len, uy = (b[1] - f[1]) / len, nx = -uy, ny = ux;
  const at = k => [b[0] - ux * k, b[1] - uy * k]; // à k du poignet, vers l'épaule
  const path = list => 'M' + list.map(p => `${r2(p[0])},${r2(p[1])}`).join(' L');
  const stroke = (d, color, w) => `<path d="${d}" fill="none" stroke="${color}" stroke-width="${r2(w)}" stroke-linecap="round" stroke-linejoin="round"/>`;
  const fw = c.armW * 0.8;
  let s = '';
  let cut = null;
  const derriere = partie !== 'devant', devant = partie !== 'derriere';
  if (c.sleeves) {
    // la manche courte s'arrête haut sur le bras ; la retroussée et l'arrachée, plus bas
    const k = c.sleeves === 'court' ? len * 0.77 : Math.min(c.sleeveCut || 5, len * 0.62);
    cut = at(k);
    const d = path([...pts.slice(0, -1), cut]);
    if (derriere) s += stroke(d, OUT, c.armW + W * 2) + stroke(d, c.sleeve, c.armW);
    if (!devant) return s;
    // l'avant-bras nu, puis le bout de la manche redessiné par-dessus : son bout rond est l'ourlet, il épouse le bras ;
    // une ombre courbe sur la peau, juste dessous
    const fd = path([cut, b]);
    s += stroke(fd, OUT, fw + W * 2) + stroke(fd, c.skin, fw);
    const h = c.armW / 2 + 0.5, P2 = (k1, k2) => [cut[0] + nx * k1 + ux * k2, cut[1] + ny * k1 + uy * k2];
    const pt = q => `${r2(q[0])},${r2(q[1])}`;
    const ombre = (rr, dk) => `<path d="M${pt(P2(rr * 0.7, dk + rr * 0.55))} Q${pt(P2(0, dk + rr * 1.25))} ${pt(P2(-rr * 0.7, dk + rr * 0.55))}" fill="none" stroke="rgba(0,0,0,.2)" stroke-width="0.6" stroke-linecap="round"/>`;
    if (c.sleeves === 'court') {
      const e = path([at(k + 1.6), at(k - 0.4)]);
      s += stroke(e, OUT, c.armW + W * 2) + stroke(e, c.sleeve, c.armW) + ombre(c.armW / 2 + 1.1, -0.4);
    } else if (c.sleeves === 'torn') {
      const zig = [P2(h, -0.5), P2(h * 0.45, 1.5), P2(0, 0.4), P2(-h * 0.5, 1.6), P2(-h, -0.5)];
      s += `<path d="${path([P2(h, -1.8), ...zig, P2(-h, -1.8)])} Z" fill="${c.sleeve}"/>` + stroke(path(zig), OUT, 0.85);
    } else {
      // bourrelet de la manche roulée : un anneau fin qui épouse le bras (un arc bombé vers la main), avec un reflet
      const r = h + 0.4, arc = `M${pt(P2(r, -0.4))} Q${pt(P2(0, r * 0.95))} ${pt(P2(-r, -0.4))}`;
      s += `<path d="${arc}" fill="none" stroke="${OUT}" stroke-width="3" stroke-linecap="round"/><path d="${arc}" fill="none" stroke="${c.cuff || c.sleeve}" stroke-width="1.5" stroke-linecap="round"/>`
        + `<path d="M${pt(P2(r * 0.55, -0.2))} Q${pt(P2(0, r * 0.45))} ${pt(P2(-r * 0.55, -0.2))}" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="0.45" stroke-linecap="round"/>`;
    }
  } else {
    const d = path(pts);
    if (derriere) s += stroke(d, OUT, c.armW + W * 2) + stroke(d, c.sleeve, c.armW);
    if (!devant) return s;
  }
  if (c.bandage) {
    const screenLeft = pts[0][0] < 24;
    const charLeft = c.view === 'ne' ? screenLeft : !screenLeft;
    if ((c.bandage === 'left') === charLeft) {
      const w = (cut ? fw : c.armW) + 0.7;
      s += limb(at(2.2), at(4.4), w, '#F4EEDF');
      for (const k of [2.9, 3.7]) { const p = at(k); s += L([p[0] + nx * w * 0.48, p[1] + ny * w * 0.48], [p[0] - nx * w * 0.48 + ux * 0.5, p[1] - ny * w * 0.48 + uy * 0.5], '#C9BFA8', 0.45); }
      const t = at(4); s += L(t, [t[0] + nx * 2.2 - ux * 0.4, t[1] + ny * 2.2 - uy * 0.4], OUT, 1.5) + L(t, [t[0] + nx * 2.2 - ux * 0.4, t[1] + ny * 2.2 - uy * 0.4], '#F4EEDF', 0.7);
    }
  }
  return s + (main != null ? main : poing(c, b));
}

// Une image d'un personnage. Marche : n de 0 à 7, un cycle continu (ph = cos : 1 appui gauche, 0 passage, -1 appui
// droit) ; repos : n de 0 à 3, il respire (le buste monte et descend), clignement à la 4e ; salut : n de 0 à 3, la main
// va et vient (k de 0 à 1 et retour) ; action : 2 images, propres à chaque personnage.
function frame(c, view, pose, n, expr) {
  const id = `${c.uid}${view}${pose}${n}`;
  const cc = { ...c, uid: id, view };
  const walk = pose === 'marche';
  const ph = walk ? r2(Math.cos((n % IMAGES.marche) / IMAGES.marche * Math.PI * 2)) : 0;
  const bob = walk ? r2(-(1 - Math.abs(ph))) : 0; // le corps monte au passage des jambes
  const breath = pose === 'repos' ? [0, -0.35, -0.7, -0.35][n % 4] : 0; // il respire
  const k = pose === 'salut' ? [0, 0.5, 1, 0.5][n % 4] : n % 2; // la main qui salue va et vient ; les actions gardent leurs 2 images
  const dir = view === 'se' ? -1 : view === 'ne' ? 1 : 0;
  const sway = r2(ph * 0.5); // le balancement des pans (jupe, manteau, cheveux)
  const ctx = { view, pose, n, ph, k, sway, breath, id, walk };
  // jambes : la jambe levée passe derrière et décolle le talon ; tout suit ph en continu
  const [lx, rx] = c.legX[view];
  // de trois quarts, la foulée se voit : les jambes avancent et reculent davantage, le talon se lève plus haut
  const tq = view !== 'front', pas = tq ? 1.7 : 0.9, lever = tq ? 1.8 : 1.4;
  const ly = c.ground + (walk ? (ph > 0 ? ph : ph * lever) : 0);
  const ry = c.ground + (walk ? (ph < 0 ? -ph : -ph * lever) : 0);
  const side = view === 'se' ? -1 : 1;
  const lxx = r2(lx + (walk ? side * ph * pas : 0));
  const rxx = r2(rx - (walk ? side * ph * pas * 0.7 : 0));
  const tiltL = walk && ph < 0 && tq ? r2((view === 'se' ? 18 : -18) * -ph) : 0;
  const tiltR = walk && ph > 0 && tq ? r2((view === 'se' ? 18 : -18) * ph) : 0;
  const legs = ly < ry ? [leg(cc, lxx, ly, dir, tiltL), leg(cc, rxx, ry, dir, tiltR)] : [leg(cc, rxx, ry, dir, tiltR), leg(cc, lxx, ly, dir, tiltL)];
  // bras : opposés aux jambes ; le bras éloigné passe derrière le corps (trois quarts)
  const swing = -ph;
  const [shL, shR] = c.shoulders;
  const bal = tq ? 1.3 : 0.9, balY = tq ? 2 : 1.4; // les bras balancent plus de trois quarts
  const handL = [r2(c.hands[0][0] + swing * bal), r2(c.hands[0][1] + swing * balY)];
  const handR = [r2(c.hands[1][0] - swing * bal), r2(c.hands[1][1] - swing * balY)];
  const act = pose === 'action' || pose === 'salut' ? c.pose.call(cc, ctx) : null;
  // c.restLeft : bras gauche qui ne balance pas (il tient quelque chose contre lui)
  const armLeft = act && act.left != null ? act.left : c.restLeft ? c.restLeft(cc, ctx) : arm(cc, shL, handL);
  // objet tenu en main droite : sous le poing, ou par-dessus la tête si c.holdOver (une longue perche)
  const held = c.hold && !(act && act.right != null) ? c.hold(cc, handR, ctx) : '';
  const armRight = act && act.right != null ? act.right : (c.holdOver ? '' : held) + arm(cc, shR, handR);
  ctx.expr = expr || (act && act.expr) || (pose === 'salut' ? 'content' : 'neutre');
  ctx.eyeMode = expr ? null : act && act.eyeMode;
  ctx.open = !expr && act && act.open;
  ctx.blink = pose === 'repos' && n % 4 === 3;
  // l'ombre du menton sur le buste (sauf de dos : la nuque et les cheveux)
  const menton = view === 'ne' ? '' : E(view === 'se' ? 22.6 : 24, 33.6 + (c.dy || 0), (shR[0] - shL[0]) * 0.24, 1.1, 'rgba(0,0,0,.13)', 0);
  let s = '';
  s += c.backItems ? c.backItems(cc, ctx) : '';
  s += act && act.under ? act.under : ''; // facultatif : ce que la pose passe derrière le buste (bras tendus devant soi, vus de dos)
  // les jambes restent au sol quand il respire ; le reste du corps monte et descend
  let haut = c.body(cc, ctx) + menton;
  if (view !== 'front') haut += armRight; // bras éloigné (à droite de l'écran), le long du flanc
  haut += c.neck ? c.neck(cc, ctx) : '';
  if (view === 'front') haut += armLeft + armRight; else haut += armLeft;
  haut += c.overArms ? c.overArms(cc, ctx) : ''; // facultatif : ce qui couvre les épaules (voile du naufragé)
  haut += c.head(cc, ctx, act || {});
  haut += c.overHead ? c.overHead(cc, ctx) : ''; // facultatif : par-dessus la tête (algues, mèches)
  haut += c.holdOver ? held : '';
  haut += act && act.over ? act.over : '';
  s += legs.join('') + (breath ? `<g transform="translate(0 ${breath})">${haut}</g>` : haut);
  const { defs, table } = lumiere(c, id);
  return defs + `<g transform="translate(0 ${bob})">${peindre(s, table)}</g>`;
}

const svg = (body, scale = 1) => `<svg xmlns="http://www.w3.org/2000/svg" width="${48 * scale}" height="${64 * scale}" viewBox="0 0 48 64">${body}</svg>`;
const POSES = [['face_repos', 'front', 'repos', IMAGES.repos], ['avant_marche', 'se', 'marche', IMAGES.marche], ['dos_marche', 'ne', 'marche', IMAGES.marche], ['face_salut', 'front', 'salut', IMAGES.salut]];

module.exports = { OUT, W, r2, st, P, E, L, limb, clip, eyes, expression, visageVide, EXPRS, drop, zee, arm, poing, bareFoot, shoe, leg, frame, svg, POSES, IMAGES, lerp, lumiere, peindre };
