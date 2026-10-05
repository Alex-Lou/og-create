// La troupe des Naufragés : kit commun de dessin en SVG (esprit PNJ Pokémon / Stardew Valley).
// Repère 48 × 64, pieds en bas au centre (24, 62). Vues : face (« front »), trois quarts avant (« se », vers le
// bas-gauche), trois quarts dos (« ne », vers le haut-droit) ; le miroir horizontal donne les deux autres directions.
// Poses : repos (2 images, clignement), marche (4 : appui, croisement, appui, croisement), salut (2), action (2).
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

const EYE = '#2A2420';
const WHITE = '#FFFFFF';

// Yeux : grands ovales sombres et reflet. Modes : open, blink (fermés), joy (arcs vers le haut), wink (2e œil fermé),
// big (surpris : blanc et petite pupille), sad / angry (paupière inclinée), squeeze (> <)
function eyes(list, mode, ry = 2.35) {
  const cx = list.reduce((a, e) => a + e[0], 0) / list.length;
  let s = '';
  list.forEach(([x, y, rx], i) => {
    const k = cx > x ? 1 : -1; // vers le milieu du visage
    if (mode === 'blink') s += P(`M${r2(x - 1.7)},${r2(y + 0.4)} Q${x},${r2(y + 1.8)} ${r2(x + 1.7)},${r2(y + 0.4)}`, 'none', 1);
    else if (mode === 'joy') s += P(`M${r2(x - 1.8)},${r2(y + 1)} Q${x},${r2(y - 1.2)} ${r2(x + 1.8)},${r2(y + 1)}`, 'none', 1.1);
    else if (mode === 'wink' && i === 1) s += P(`M${r2(x - 1.6)},${r2(y + 0.2)} L${r2(x + 1.6)},${r2(y + 0.2)}`, 'none', 1);
    else if (mode === 'big') s += E(x, y, rx + 0.25, ry + 0.1, WHITE, 0.8) + E(x, y + 0.2, rx * 0.55, ry * 0.5, EYE, 0) + E(x + 0.35, y - 0.4, 0.3, 0.3, WHITE, 0);
    else if (mode === 'squeeze') s += P(`M${r2(x - k * 1.3)},${r2(y - 1.4)} L${r2(x + k * 1.1)},${y} L${r2(x - k * 1.3)},${r2(y + 1.4)}`, 'none', 1.1);
    else if (mode === 'sad' || mode === 'angry') {
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
//   (bouche au repos, propre au caractère), mouthC, tongue, cheeks [[x, rx], …], cheekY, temple, anger, zz (où poser les signes)
function expression(g, ctx) {
  const { expr, n } = ctx;
  const [mx, my] = g.mouth;
  const w = g.mw;
  const cx = g.eyes.reduce((a, e) => a + e[0], 0) / g.eyes.length;
  let s = '';
  const [bi, bo, arch] = BROW[expr];
  for (const [x, y, rx] of g.eyes) {
    const k = cx > x ? 1 : -1, hw = rx + 0.45, by = y + g.browY;
    s += `<path d="M${r2(x - k * hw)},${r2(by + bo)} Q${r2(x)},${r2(by + (bi + bo) / 2 + arch)} ${r2(x + k * hw)},${r2(by + bi)}" fill="none" stroke="${g.brow}" stroke-width="${g.browW}" stroke-linecap="round"/>`;
  }
  s += eyes(g.eyes, ctx.eyeMode || EYEMODE[expr] || (ctx.blink ? 'blink' : 'open'), g.ry);
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
function leg(c, x, y, dir, tilt) {
  const top = c.hip;
  return `<rect x="${r2(x - c.legW / 2)}" y="${top}" width="${c.legW}" height="${r2(y - top + 1.2)}" rx="1.6" fill="${c.leg}" ${st()}/>`
    + `<rect x="${r2(x + c.legW / 2 - 1.6)}" y="${top + 0.6}" width="1.1" height="${r2(y - top - 0.4)}" rx="0.5" fill="${c.legS}"/>`
    + shoe(c, x, y, dir, tilt);
}
// Bras : épaule a → main b, avec un coude facultatif (deux segments d'un seul trait, sans couture au coude) ;
// le revers éventuel est posé juste avant la main
function arm(c, a, b, elbow) {
  const pts = elbow ? [a, elbow, b] : [a, b];
  const d = 'M' + pts.map(p => `${r2(p[0])},${r2(p[1])}`).join(' L');
  const line = (color, w) => `<path d="${d}" fill="none" stroke="${color}" stroke-width="${r2(w)}" stroke-linecap="round" stroke-linejoin="round"/>`;
  let s = line(OUT, c.armW + W * 2) + line(c.sleeve, c.armW);
  if (c.cuff) {
    const f = pts[pts.length - 2];
    const len = Math.hypot(b[0] - f[0], b[1] - f[1]);
    const at = k => [b[0] - (b[0] - f[0]) * k / len, b[1] - (b[1] - f[1]) * k / len];
    s += limb(at(2.5), at(0.9), c.armW, c.cuff);
  }
  return s + E(b[0], b[1], 2.1, 2.1, c.skin);
}

// Une image d'un personnage
function frame(c, view, pose, n, expr) {
  const id = `${c.uid}${view}${pose}${n}`;
  const cc = { ...c, uid: id };
  const walk = pose === 'marche';
  const ph = walk ? [1, 0, -1, 0][n] : 0; // jambe gauche (à l'écran) en avant : 1 ; croisement : 0
  const bob = walk && n % 2 === 1 ? -1 : 0;
  const dir = view === 'se' ? -1 : view === 'ne' ? 1 : 0;
  const ctx = { view, pose, n, ph, id, walk };
  // jambes : la jambe levée passe derrière et décolle le talon
  const [lx, rx] = c.legX[view];
  const ly = c.ground + (walk ? (ph > 0 ? 1 : ph < 0 ? -1.4 : 0) : 0);
  const ry = c.ground + (walk ? (ph < 0 ? 1 : ph > 0 ? -1.4 : 0) : 0);
  const side = view === 'se' ? -1 : 1;
  const lxx = lx + (walk ? side * ph * 0.9 : 0);
  const rxx = rx - (walk ? side * ph * 0.6 : 0);
  const tiltL = walk && ph < 0 && view !== 'front' ? (view === 'se' ? 14 : -14) : 0;
  const tiltR = walk && ph > 0 && view !== 'front' ? (view === 'se' ? 14 : -14) : 0;
  const legs = ly < ry ? [leg(cc, lxx, ly, dir, tiltL), leg(cc, rxx, ry, dir, tiltR)] : [leg(cc, rxx, ry, dir, tiltR), leg(cc, lxx, ly, dir, tiltL)];
  // bras : opposés aux jambes ; le bras éloigné passe derrière le corps (trois quarts)
  const swing = -ph;
  const [shL, shR] = c.shoulders;
  const handL = [c.hands[0][0] + swing * 0.9, c.hands[0][1] + swing * 1.4];
  const handR = [c.hands[1][0] - swing * 0.9, c.hands[1][1] - swing * 1.4];
  const act = pose === 'action' || pose === 'salut' ? c.pose(ctx) : null;
  const armLeft = act && act.left != null ? act.left : arm(cc, shL, handL);
  const armRight = act && act.right != null ? act.right : arm(cc, shR, handR);
  ctx.expr = expr || (act && act.expr) || (pose === 'salut' ? 'content' : 'neutre');
  ctx.eyeMode = expr ? null : act && act.eyeMode;
  ctx.open = !expr && act && act.open;
  ctx.blink = pose === 'repos' && n === 1;
  let s = '';
  s += c.backItems ? c.backItems(cc, ctx) : '';
  s += legs.join('');
  s += c.body(cc, ctx);
  if (view !== 'front') s += armRight; // bras éloigné (à droite de l'écran), le long du flanc
  s += c.neck ? c.neck(cc, ctx) : '';
  if (view === 'front') s += armLeft + armRight; else s += armLeft;
  s += c.head(cc, ctx, act || {});
  s += act && act.over ? act.over : '';
  return `<g transform="translate(0 ${bob})">${s}</g>`;
}

const svg = (body, scale = 1) => `<svg xmlns="http://www.w3.org/2000/svg" width="${48 * scale}" height="${64 * scale}" viewBox="0 0 48 64">${body}</svg>`;
const POSES = [['face_repos', 'front', 'repos', 2], ['avant_marche', 'se', 'marche', 4], ['dos_marche', 'ne', 'marche', 4], ['face_salut', 'front', 'salut', 2]];

module.exports = { OUT, W, r2, st, P, E, L, limb, clip, eyes, expression, EXPRS, arm, frame, svg, POSES };
