// Lot H — les bêtes orientées, comme la troupe : trois quarts avant (« avant » : la bête va vers le bas à droite, vers
// nous) et trois quarts dos (« dos » : elle s'éloigne vers le haut à droite) ; le miroir donne les deux autres
// directions. Mêmes bêtes que betes.js (mêmes fiches, mêmes couleurs), redessinées en volume : le corps vu en biais,
// les pattes posées en profondeur (celles du côté proche devant le corps, les autres derrière), la tête de trois
// quarts (deux yeux, le museau qui pointe vers nous) ou de dos (la nuque, les oreilles).
const { OUT, P, E, clip, r2 } = require('./troupe');
const Bt = require('./betes');
const { eye, heartIcon, limb, thick, stroke, line, hoof, paw } = Bt;

const SH = 'rgba(40,55,20,.18)';
const DEPTH = 0.62; // tassement de la profondeur au sol (pieds avant et arrière)
// rotation d'un point autour de (cx, cy)
const rot = (x, y, cx, cy, a) => { const c = Math.cos(a), s = Math.sin(a); return [cx + (x - cx) * c - (y - cy) * s, cy + (x - cx) * s + (y - cy) * c]; };
const ellD = (cx, cy, rx, ry) => `M${r2(cx - rx)},${r2(cy)} a${r2(rx)},${r2(ry)} 0 1,0 ${r2(2 * rx)},0 a${r2(rx)},${r2(ry)} 0 1,0 ${r2(-2 * rx)},0 Z`;

// ——— Oreilles de trois quarts : side = -1 (à gauche de la tête) ou 1 (à droite) ; back : vue de dos (pas d'intérieur)
function ear3(c, e, hx, hy, hr, side, far, back) {
  const col = far ? (c.headCS || c.furS) : (c.headC || c.fur), inner = e.inner || '#F2C6C0';
  const k = e.size || 1, sx = side;
  const g = (body) => `<g transform="translate(${r2(hx)} ${r2(hy)}) scale(${sx} 1)">${body}</g>`;
  const showIn = !back && !far;
  switch (e.kind) {
    case 'pointy': {
      const x = hr * 0.48, y = -hr * 0.62;
      return g(P(`M${r2(x - hr * 0.42 * k)},${r2(y + 0.5)} L${r2(x + hr * 0.12 * k)},${r2(y - hr * 1.0 * k)} L${r2(x + hr * 0.46 * k)},${r2(y + hr * 0.18)} Z`, col, 0.9)
        + (showIn ? P(`M${r2(x - hr * 0.2 * k)},${r2(y + 0.2)} L${r2(x + hr * 0.1 * k)},${r2(y - hr * 0.66 * k)} L${r2(x + hr * 0.26 * k)},${r2(y + hr * 0.08)} Z`, inner, 0) : ''));
    }
    case 'round': return g(E(hr * 0.55, -hr * 0.78, hr * 0.36 * k, hr * 0.36 * k, col, 0.9) + (showIn ? E(hr * 0.55, -hr * 0.78, hr * 0.19 * k, hr * 0.19 * k, inner, 0) : ''));
    case 'side': {
      // oreille horizontale (vache, chèvre, mouton) : elle part du côté de la tête
      const x = hr * 0.72, y = -hr * 0.42;
      return g(P(`M${r2(x)},${r2(y - hr * 0.18)} Q${r2(x + hr * 0.7 * k)},${r2(y - hr * 0.5)} ${r2(x + hr * 1.12 * k)},${r2(y - hr * 0.08)} Q${r2(x + hr * 0.66 * k)},${r2(y + hr * 0.42)} ${r2(x)},${r2(y + hr * 0.22)} Z`, col, 0.9)
        + (showIn ? E(x + hr * 0.6 * k, y, hr * 0.28 * k, hr * 0.12, inner, 0) : ''));
    }
    case 'flop': {
      const x = hr * 0.42, y = -hr * 0.72;
      return g(P(`M${r2(x - hr * 0.3)},${r2(y + 0.4)} L${r2(x + hr * 0.18)},${r2(y - hr * 0.5 * k)} L${r2(x + hr * 0.62 * k)},${r2(y + hr * 0.42)} Z`, col, 0.9));
    }
    case 'hang': {
      const x = hr * 0.84, y = -hr * 0.5;
      return g(P(`M${r2(x - hr * 0.28)},${r2(y)} Q${r2(x + hr * 0.42)},${r2(y - hr * 0.2)} ${r2(x + hr * 0.4)},${r2(y + hr * 1.05 * k)} Q${r2(x + hr * 0.02)},${r2(y + hr * 1.18 * k)} ${r2(x - hr * 0.22)},${r2(y + hr * 0.42)} Z`, far ? c.furS : (e.color || c.furS), 0.9));
    }
    case 'long': {
      const x = hr * 0.36, y = -hr * 0.66;
      return g(`<g transform="rotate(${r2(12 + (far ? 8 : 0))} ${r2(x)} ${r2(y)})">${P(`M${r2(x - hr * 0.3)},${r2(y)} Q${r2(x - hr * 0.5)},${r2(y - hr * 2.2 * k)} ${r2(x + hr * 0.02)},${r2(y - hr * 2.3 * k)} Q${r2(x + hr * 0.5)},${r2(y - hr * 2.2 * k)} ${r2(x + hr * 0.3)},${r2(y)} Z`, col, 0.9)}${showIn ? E(x, y - hr * 1.2 * k, hr * 0.14, hr * 0.8 * k, inner, 0) : ''}</g>`);
    }
    default: return '';
  }
}

// ——— Quadrupède de trois quarts ———
// Repère : (0, 0) au sol sous le milieu de la bête. avant : l'avant va vers (1, 0,5), le côté proche est le flanc
// droit de la bête, vers (-1, 0,5) ; dos : l'avant va vers (1, -0,5), le flanc proche vers (1, 0,5).
function quad3(c, view, pose) {
  const se = view === 'avant';
  const walk = pose === 'marche1' || pose === 'marche2';
  const rest = pose === 'repos' || pose === 'clignement';
  const ph = pose === 'marche2' ? -1 : 1;
  const lg = c.legs;
  const drop = rest ? (c.restDrop ?? -lg.top * 0.75) : 0;
  const bob = pose === 'marche2' ? -0.4 : 0;
  const mode = pose === 'clignement' ? 'blink' : pose === 'joie' ? 'joy' : 'open';
  const [bx0, by0, brx, bry] = c.body;
  const [hx0, hy0, hr0] = c.head;
  const t3 = c.t3 || {};
  const F = se ? [1, 0.5] : [1, -0.5], S = se ? [-1, 0.5] : [1, 0.5];
  const Lh = brx * (t3.len ?? 0.78), W = t3.wid ?? Math.max(bry * 0.5, lg.w + 0.6);
  const by = by0 + drop + bob;
  const ang = Math.atan2(F[1], F[0]) * (t3.tilt ?? 0.55);
  const rx = Lh + W * 0.35, ry = bry * (t3.tall ?? 1.04);
  const egg = (se ? 1 : -1) * (t3.egg ?? 0.12);
  // la tête : en avant le long de F, à la hauteur du profil
  const reach = (hx0 - bx0) * (t3.reach ?? 0.62);
  const hr = hr0 * (se ? 1.04 : 0.98);
  const hx = F[0] * reach * (se ? 1 : 0.9) + (t3.hdx || 0), hy = by + (hy0 - by0) * (se ? 1 : 0.82) + F[1] * reach * 0.55 + (se ? 0.8 : 0.6) + (rest ? drop * ((c.headDrop ?? 0.8) - 1) : 0) + (t3.hdy || 0);
  const ctx = { pose, view, se, rest, walk, ph, mode, by, hx, hy, hr, rx, ry, ang, F, S, Lh, W, drop, egg };
  // point du corps en coordonnées propres : u le long (−1 croupe, 1 poitrail), v en hauteur (−1 dos, 1 ventre)
  ctx.at = (u, v) => rot(u * rx, by + v * ry * (1 + egg * u), 0, by, ang);
  const fa = Lh * (t3.feet ?? 0.72), sw = W * 0.78;
  const swing = walk ? 1.4 : 0;
  // pieds au sol et hanches sous le corps ; une paire en diagonale avance pendant que l'autre recule
  const legs = [];
  for (const front of [true, false]) for (const near of [true, false]) {
    const a = (front ? fa : -fa), s = near ? sw : -sw;
    const diag = front === near ? 1 : -1;
    // le pas glisse surtout à l'horizontale ; la profondeur des pieds est un peu tassée (les pattes restent droites)
    const st = swing * ph * diag;
    const sx = F[0] * (a + st) + S[0] * s, sy = (F[1] * a + S[1] * s) * DEPTH + F[1] * st * 0.35;
    const hx_ = F[0] * a * 0.9 + S[0] * s * 0.7, hy_ = by + ry * 0.5 + (F[1] * a + S[1] * s) * DEPTH * 0.9;
    legs.push({ front, near, foot: [sx, sy - 0.6], hip: [hx_, hy_] });
  }
  const legSvg = (l) => {
    if (rest) return '';
    const col = l.near ? (lg.color || c.fur) : (lg.colorS || c.furS);
    const [fx, fy] = l.foot;
    // patte proche : un reflet le long du devant ; sabot luisant, ou patte à deux doigts (comme de profil)
    const shine = l.near ? line([l.hip[0] - lg.w * 0.2, l.hip[1] + 1.2], [fx - lg.w * 0.2, fy - 1.6], lg.w * 0.26, 'rgba(255,255,255,.35)') : '';
    return limb(l.hip, [fx, fy], lg.w, col) + shine + (lg.hoof ? hoof(fx, fy + 0.2, lg.w * 0.62, lg.hoof) : lg.paw ? paw(fx + F[0] * 0.3, fy + 0.2, lg.w * 0.72, lg.paw) : '');
  };
  let s = '';
  // ombre au sol : un ovale allongé dans le sens de la marche
  { const [cx, cy] = [0, 0.2]; s += `<ellipse cx="${cx}" cy="${cy}" rx="${r2(rx * 0.95)}" ry="${r2(Math.max(2.2, W * 0.95))}" fill="${SH}" transform="rotate(${r2(ang * 180 / Math.PI)} ${cx} ${cy})"/>`; }
  // les pattes du côté éloigné, derrière le corps (les plus loin d'abord)
  for (const l of legs.filter(l => !l.near).sort((a, b) => a.foot[1] - b.foot[1])) s += legSvg(l);
  // dos : la tête est plus loin que le corps, on la dessine avant lui
  const head = headQ3(c, ctx);
  if (!se) s += head;
  // queue : derrière le corps de trois quarts avant (la croupe est au fond), devant de dos
  const tl = tail3(c, ctx);
  if (se) s += tl;
  s += c.p3?.back ? c.p3.back(ctx) : '';
  // le corps, en biais
  const bodyPath = (() => { const pts = []; for (let i = 0; i < 36; i++) { const t = (i / 36) * Math.PI * 2; pts.push(rot(Math.cos(t) * rx, by + Math.sin(t) * ry * (1 + egg * Math.cos(t)), 0, by, ang)); } return 'M' + pts.map(p => `${r2(p[0])},${r2(p[1])}`).join(' L') + ' Z'; })();
  const id = `q3${c.id}${view}${pose}`;
  s += P(bodyPath, c.fur) + clip(id, bodyPath,
    // ventre (dessous du corps) et flanc éloigné plus sombre, reflet sur le dos
    `<ellipse cx="${r2(F[0] * 0.5)}" cy="${r2(by + ry * 0.92)}" rx="${r2(rx * 0.95)}" ry="${r2(ry * 0.5)}" fill="${c.belly || c.furS}"/>`
    + `<ellipse cx="${r2(-S[0] * W * 1.1)}" cy="${r2(by - S[1] * W * 0.4)}" rx="${r2(rx * 0.7)}" ry="${r2(ry * 1.1)}" fill="${c.furS}" opacity="0.45"/>`
    + (c.p3?.coat ? c.p3.coat(ctx) : '')
    + `<path d="M${r2(-rx * 0.55)},${r2(by - ry * 0.6 + F[1] * -rx * 0.3)} Q0,${r2(by - ry * 0.98)} ${r2(rx * 0.45)},${r2(by - ry * 0.7 + F[1] * rx * 0.3)}" fill="none" stroke="#FFFFFF" stroke-width="0.9" stroke-linecap="round" opacity="0.5"/>`) + P(bodyPath, 'none');
  // pattes du côté proche (au repos, pattes repliées sous le corps)
  if (rest) for (const l of legs.filter(l => l.near)) { const [fx, fy] = l.foot; s += E(fx * 0.8, Math.min(fy, by + ry) - 0.4, lg.w * 0.95, 1, lg.color || c.fur, 0.9); }
  else for (const l of legs.filter(l => l.near).sort((a, b) => a.foot[1] - b.foot[1])) s += legSvg(l);
  s += c.p3?.body ? c.p3.body(ctx) : '';
  if (!se) s += tl;
  if (se) s += head;
  if (pose === 'joie' && se) s += heartIcon(hx + hr * 0.1, hy - hr * 2 - 1.4 - (t3.heartUp || 0));
  return s;
}

// ——— Queue de trois quarts : attachée à la croupe (au fond à gauche de trois quarts avant, devant à gauche de dos)
function tail3(c, ctx) {
  if (c.p3?.tail) return c.p3.tail(ctx);
  const t = c.tail || {};
  const { se, by, rx, ry, ang, walk, ph } = ctx;
  // la racine : le haut de la croupe ; de trois quarts avant elle est au fond (la queue dépasse derrière le corps),
  // de dos elle est devant nous (la queue pend sur la croupe)
  const [x, y] = se ? ctx.at(-0.9, -0.45) : ctx.at(-0.86, -0.2);
  const w = walk ? ph * 0.8 : 0;
  const k = se ? -1 : 0.35; // vers où elle s'écarte : à gauche derrière (avant) ; presque droite sur la croupe (dos)
  switch (t.kind) {
    case 'tuft': return thick(`M${r2(x + 0.6)},${r2(y)} Q${r2(x + k * 2.4)},${r2(y + 0.8)} ${r2(x + k * 2.4 + w)},${r2(y + 5.4)}`, 0.8, c.fur) + E(x + k * 2.4 + w, y + 6, 1.1, 1.5, t.color || c.furS, 0.8);
    case 'puff': return E(x + (se ? -0.6 : 0.6), y + (se ? 0 : 1), t.r || 1.8, t.r || 1.8, t.color || c.belly || '#FFFFFF', 0.9);
    case 'curly': { const [cx, cy] = ctx.at(-1, 0.05); const d = se ? `M${r2(cx + 0.8)},${r2(cy)} q-1.8,0.2 -1.8,-1.4 q0.2,-1.2 1.2,-0.6 q0.6,0.8 -0.4,1.3` : `M${r2(x + 0.4)},${r2(y)} q-1.8,0.4 -1.6,2 q0.4,1.4 1.6,0.6 q0.8,-1 -0.4,-1.6`; return stroke(d, 2.4, OUT) + stroke(d, 0.9, c.fur); }
    case 'short': return se
      ? P(`M${r2(x + 0.6)},${r2(y)} L${r2(x - 1.8)},${r2(y - 2.6 + w * 0.4)} L${r2(x + 0.8)},${r2(y + 1.2)} Z`, t.color || c.fur, 0.9)
      : P(`M${r2(x - 0.6)},${r2(y)} L${r2(x + 0.2)},${r2(y - 2.8 + w * 0.4)} L${r2(x + 1.2)},${r2(y + 0.2)} Z`, t.color || c.fur, 0.9);
    case 'thin': {
      const up = t.up || 5;
      const d = se ? `M${r2(x + 0.6)},${r2(y + 0.4)} Q${r2(x - 3.2)},${r2(y - 0.4)} ${r2(x - 2.8 + w)},${r2(y - up)}` : `M${r2(x)},${r2(y + 0.6)} Q${r2(x - 2.2)},${r2(y - 1)} ${r2(x - 1.2 + w)},${r2(y - up)}`;
      return thick(d, t.w || 1.2, t.color || c.fur);
    }
    case 'bushy': {
      const L0 = (t.len || 9) * (se ? 0.85 : 0.9), up = t.up ?? 0.4;
      const tip = se ? [x - L0 * 0.8, y - L0 * up - 1 + w] : [x - L0 * 0.55, y - L0 * up - 2 + w];
      const d = `M${r2(x + 1)},${r2(y - 1.2)} Q${r2((x + tip[0]) / 2)},${r2(Math.min(y, tip[1]) - 3)} ${r2(tip[0])},${r2(tip[1])} Q${r2((x + tip[0]) / 2 - 0.6)},${r2(y + 3.2 + w * 0.5)} ${r2(x + 1.2)},${r2(y + 1.8)} Z`;
      return P(d, c.fur) + clip(`t3${c.id}${ctx.view}${ph}${walk}`, d, `<circle cx="${r2(tip[0])}" cy="${r2(tip[1])}" r="${r2(L0 * 0.32)}" fill="${t.tip || c.belly}"/>`) + P(d, 'none');
    }
    case 'horse': return thick(`M${r2(x)},${r2(y - 0.6)} Q${r2(x + k * 3)},${r2(y + 1.4)} ${r2(x + k * 2.4 + w)},${r2(y + 8)}`, 2.2, t.color) + stroke(`M${r2(x + k * 0.6)},${r2(y + 1.2)} Q${r2(x + k * 2.6)},${r2(y + 4)} ${r2(x + k * 2.4 + w)},${r2(y + 7)}`, 0.5, OUT);
    // queues basses (salamandre, loutre) : de dos, elles viennent vers nous, en bas à gauche
    case 'lizard': return se ? thick(`M${r2(x + 1)},${r2(y + 0.8)} Q${r2(x - 3.6)},${r2(y + 2.4)} ${r2(x - 5.6 + w)},${r2(-2.9)}`, t.w || 1.8, c.fur)
      : thick(`M${r2(x + 1.2)},${r2(y + 1)} Q${r2(x - 2.4)},${r2(y + 2.6)} ${r2(x - 4.4 + w)},${r2(1.6)}`, t.w || 1.8, c.fur);
    case 'spiral': return thick(`M${r2(x + 1)},${r2(y + 0.6)} Q${r2(x - 3.6)},${r2(y + 1)} ${r2(x - 4)},${r2(y + 3.6)} Q${r2(x - 3.8)},${r2(y + 5.8)} ${r2(x - 2)},${r2(y + 5.2)} Q${r2(x - 1.4)},${r2(y + 3.8)} ${r2(x - 2.6)},${r2(y + 3.6)}`, 1.4, c.fur);
    case 'otter': { const kd = se ? -1 : -0.75, dy = se ? 3.6 : 5.4; return P(`M${r2(x + 1)},${r2(y - 1)} Q${r2(x + kd * 4)},${r2(y + 0.6)} ${r2(x + kd * 6 + w)},${r2(y + dy)} Q${r2(x + kd * 3)},${r2(y + dy - 0.4)} ${r2(x + 1.4)},${r2(y + 1.8)} Z`, c.fur); }
    default: return '';
  }
}

// ——— Tête de trois quarts (avant) ou de dos
function headQ3(c, ctx) {
  const { se, hx, hy, hr, mode } = ctx;
  const e = c.ears || {};
  let s = '';
  if (se) {
    // oreille droite (au fond), cou, tête, visage, oreille gauche (devant)
    s += ear3(c, e, hx, hy, hr, 1, true, false);
    s += c.p3?.neck ? c.p3.neck(ctx) : neck3(c, ctx);
    s += E(hx, hy, hr * (c.headW || 1), hr, c.headC || c.fur);
    s += c.p3?.face ? c.p3.face(ctx) : '';
    // museau : les bêtes à truffe (chien, chat, renard, lapin…) ont un museau large, une truffe en triangle arrondi et
    // une bouche ; les ruminants et le cochon gardent leur mufle rond
    const truffe = ['pointy', 'hang', 'long', 'round'].includes(e.kind);
    const sx = hx + hr * 0.3, sy = hy + hr * 0.44;
    if (c.snout) { const [, , srx, sry, col] = c.snout; s += truffe ? E(sx, sy, srx * 0.98, sry * 0.82, col || c.belly, 0.9) : E(sx, sy - hr * 0.02, srx * 0.92, sry * 1.02, col || c.belly, 0.9); }
    if (c.nose) {
      const [, , nr, col] = c.nose;
      if (truffe) {
        const nx = sx + hr * 0.08, ny = sy - (c.snout ? c.snout[3] * 0.38 : 0), w = nr * 1.5, h = nr * 1.15;
        s += P(`M${r2(nx - w)},${r2(ny - h * 0.5)} Q${r2(nx)},${r2(ny - h * 0.85)} ${r2(nx + w)},${r2(ny - h * 0.5)} Q${r2(nx + w * 0.4)},${r2(ny + h * 0.75)} ${r2(nx)},${r2(ny + h * 0.75)} Q${r2(nx - w * 0.4)},${r2(ny + h * 0.75)} ${r2(nx - w)},${r2(ny - h * 0.5)} Z`, col || OUT, 0.5)
          + `<path d="M${r2(nx)},${r2(ny + h * 0.7)} L${r2(nx)},${r2(ny + h * 1.5)} M${r2(nx - w * 1.1)},${r2(ny + h * 1.3)} Q${r2(nx - w * 0.5)},${r2(ny + h * 2)} ${r2(nx)},${r2(ny + h * 1.5)} Q${r2(nx + w * 0.5)},${r2(ny + h * 2)} ${r2(nx + w * 1.1)},${r2(ny + h * 1.3)}" fill="none" stroke="${OUT}" stroke-width="0.45" stroke-linecap="round"/>`;
      } else s += E(hx + hr * 0.42, hy + hr * 0.28, nr * 1.2, nr * 0.9, col || OUT, 0.6);
    }
    const [, edy, er] = c.eye;
    s += eye(hx - hr * 0.34, hy + edy * 0.9, er, mode) + eye(hx + hr * 0.4, hy + edy * 0.9 - 0.2, er * 0.88, mode);
    if (c.blush !== false) s += E(hx - hr * 0.52, hy + edy + er * 1.6, er * 0.85, er * 0.42, '#F7A8B0', 0);
    s += ear3(c, e, hx, hy, hr, -1, false, false);
    s += c.p3?.head ? c.p3.head(ctx) : '';
  } else {
    // de dos : le cou, la nuque, les deux oreilles vues de derrière
    s += c.p3?.neck ? c.p3.neck(ctx) : neck3(c, ctx);
    s += ear3(c, e, hx, hy, hr, 1, true, true);
    s += E(hx, hy, hr * (c.headW || 1), hr, c.headC || c.fur);
    s += E(hx - hr * 0.2, hy + hr * 0.35, hr * 0.7, hr * 0.45, c.headCS || c.furS, 0).replace('fill=', 'opacity="0.45" fill=');
    s += ear3(c, e, hx, hy, hr, -1, false, true);
    s += c.p3?.head ? c.p3.head(ctx) : '';
  }
  return s;
}
// Cou : de l'avant du corps à la tête, quand la tête est loin du corps
function neck3(c, ctx) {
  const { se, by, rx, ry, ang, hx, hy, hr } = ctx;
  const [nx, ny] = rot(rx * 0.62, by - ry * 0.35, 0, by, ang);
  const dist = Math.hypot(hx - nx, hy - ny);
  if (dist < hr * 0.7) return '';
  const w = hr * (c.t3?.neckW ?? 1.25);
  return thick(`M${r2(nx)},${r2(ny)} L${r2(hx - (se ? 0.4 : 0))},${r2(hy + hr * 0.2)}`, w, c.fur);
}

// ——— Oiseau de trois quarts ———
// Même repère que les quadrupèdes. Le corps en œuf (penché vers l'avant), l'aile du côté proche, la queue derrière
// (avant) ou devant (dos), la tête au-dessus de l'avant, le bec qui pointe vers nous (avant) ou dépasse à peine (dos).
function bird3(c, view, pose) {
  const se = view === 'avant';
  const walk = pose === 'marche1' || pose === 'marche2';
  const rest = pose === 'repos' || pose === 'clignement';
  const ph = pose === 'marche2' ? -1 : 1;
  const lg = c.legs;
  const drop = rest ? -lg.top * 0.85 : 0;
  const bob = pose === 'marche2' ? -0.4 : 0;
  const mode = pose === 'clignement' ? 'blink' : pose === 'joie' ? 'joy' : 'open';
  const [bx0, by0, brx, bry] = c.body;
  const [hx0, hy0, hr0] = c.head;
  const t3 = c.t3 || {};
  const F = se ? [1, 0.5] : [1, -0.5], S = se ? [-1, 0.5] : [1, 0.5];
  const by = by0 + drop + bob;
  const rx = brx * (t3.len ?? 0.82), ry = bry * (t3.tall ?? 1.02), ang = Math.atan2(F[1], F[0]) * 0.35;
  const egg = (se ? 1 : -1) * 0.1;
  const reach = (hx0 - bx0) * (se ? 0.6 : 0.5);
  const hr = hr0 * (se ? 1.04 : 0.98);
  const hx = F[0] * reach, hy = by + (hy0 - by0) + F[1] * reach * 0.5 + (se ? 0.5 : 0.4) + (walk ? ph * 0.3 : 0);
  const ctx = { pose, view, se, rest, walk, ph, mode, by, hx, hy, hr, rx, ry, ang, F, S, drop, egg };
  ctx.at = (u, v) => rot(u * rx, by + v * ry * (1 + egg * u), 0, by, ang);
  const bodyPath = (() => { const pts = []; for (let i = 0; i < 36; i++) { const t = (i / 36) * Math.PI * 2; pts.push(rot(Math.cos(t) * rx, by + Math.sin(t) * ry * (1 + egg * Math.cos(t)), 0, by, ang)); } return 'M' + pts.map(p => `${r2(p[0])},${r2(p[1])}`).join(' L') + ' Z'; })();
  let s = `<ellipse cx="0" cy="0.2" rx="${r2(rx * 0.95)}" ry="${r2(Math.max(1.4, rx * 0.4))}" fill="${SH}"/>`;
  // pattes fines : celle du côté éloigné d'abord ; doigts tournés vers l'avant
  const legOf = (near) => {
    if (rest) return '';
    const sw = (lg.spread ?? 1.2) * (near ? 1 : -1), st = walk ? (near ? ph : -ph) * 0.9 : 0;
    const fx = S[0] * sw + F[0] * st, fy = (S[1] * sw + F[1] * st) * 0.62;
    const top = [S[0] * sw * 0.7, by + ry * (near ? 0.9 : 0.7) + S[1] * sw * 0.5];
    const col = near ? lg.color : mixDark(lg.color);
    const toe = (dx, dy) => stroke(`M${r2(fx)},${r2(fy - 0.5)} l${r2(dx)},${r2(dy)}`, 1.5, OUT) + stroke(`M${r2(fx)},${r2(fy - 0.5)} l${r2(dx)},${r2(dy)}`, 0.6, col);
    return limb(top, [fx, fy - 0.5], lg.w || 0.7, col) + toe(F[0] * 1.4, F[1] * 1.4 + 0.2) + toe(F[0] * 0.6 - S[0] * 0.8, 0.4) + toe(F[0] * 0.6 + S[0] * 0.8, 0.5);
  };
  s += legOf(false);
  // queue : derrière de trois quarts avant (au fond à gauche), devant de dos (elle vient vers nous)
  const tail = () => {
    const t = c.tail || {};
    const [tx, ty] = ctx.at(-0.88, -0.1);
    const L0 = t.len || 3.6, up = t.up ?? 4.6, col = t.color || c.wing;
    if (t.kind === 'fan') {
      if (se) return P(`M${r2(tx + 1.2)},${r2(ty + 1)} L${r2(tx - L0 * 0.6)},${r2(ty - up)} Q${r2(tx + 0.6)},${r2(ty - up - 1.4)} ${r2(tx + 2)},${r2(ty - 1.2)} Z`, col);
      // de dos, l'éventail se dresse sur l'arrière, vers nous : trois plumes
      const [qx, qy] = ctx.at(-0.55, -0.35);
      return P(`M${r2(qx + 1.8)},${r2(qy + 1.6)} L${r2(qx - 1.6)},${r2(qy - up * 0.75)} Q${r2(qx - 0.2)},${r2(qy - up - 0.8)} ${r2(qx + 1)},${r2(qy - up * 0.7)} Q${r2(qx + 2.2)},${r2(qy - up * 0.95)} ${r2(qx + 3)},${r2(qy - up * 0.45)} L${r2(qx + 3.2)},${r2(qy + 1)} Z`, col)
        + `<path d="M${r2(qx + 1.4)},${r2(qy + 0.6)} L${r2(qx - 0.2)},${r2(qy - up * 0.6)} M${r2(qx + 2.2)},${r2(qy + 0.4)} L${r2(qx + 1.6)},${r2(qy - up * 0.6)}" stroke="${OUT}" stroke-width="0.4" opacity="0.6"/>`;
    }
    if (t.kind === 'long') return se ? P(`M${r2(tx + 1.4)},${r2(ty - 0.8)} L${r2(tx - L0 * 0.8)},${r2(ty - L0 * 0.25)} L${r2(tx + 1.2)},${r2(ty + 1.6)} Z`, col)
      : P(`M${r2(tx + 1.2)},${r2(ty)} L${r2(tx - L0 * 0.45)},${r2(ty + L0 * 0.55)} L${r2(tx + 2.4)},${r2(ty + 1.4)} Z`, col);
    return '';
  };
  const head = headB3(c, ctx);
  if (se) s += tail();
  if (!se) s += head;
  // corps, ventre (devant de trois quarts avant), aile du côté proche
  const id = `b3${c.id}${view}${pose}`;
  s += P(bodyPath, c.color) + clip(id, bodyPath, (se ? `<ellipse cx="${r2(rx * 0.35)}" cy="${r2(by + ry * 0.35)}" rx="${r2(rx * 0.72)}" ry="${r2(ry * 0.78)}" fill="${c.belly || c.color}"/>` : `<ellipse cx="${r2(-rx * 0.2)}" cy="${r2(by + ry * 0.75)}" rx="${r2(rx * 0.7)}" ry="${r2(ry * 0.45)}" fill="${c.belly || c.color}" opacity="0.7"/>`)
    + (c.p3?.coat ? c.p3.coat(ctx) : '')) + P(bodyPath, 'none');
  {
    const wingUp = walk && ph < 0 ? -0.5 : 0;
    // aile : sur le flanc proche (à gauche de trois quarts avant, à droite de dos)
    const [ax, ay] = se ? ctx.at(-0.25, -0.1) : ctx.at(0.35, 0.05);
    const d = se
      ? `M${r2(ax + rx * 0.45)},${r2(ay - ry * 0.3 + wingUp)} Q${r2(ax - rx * 0.1)},${r2(ay - ry * 0.55 + wingUp)} ${r2(ax - rx * 0.62)},${r2(ay - ry * 0.05)} Q${r2(ax - rx * 0.55)},${r2(ay + ry * 0.55)} ${r2(ax + rx * 0.2)},${r2(ay + ry * 0.45)} Q${r2(ax + rx * 0.5)},${r2(ay + ry * 0.1)} ${r2(ax + rx * 0.45)},${r2(ay - ry * 0.3 + wingUp)} Z`
      : `M${r2(ax - rx * 0.3)},${r2(ay - ry * 0.4 + wingUp)} Q${r2(ax + rx * 0.25)},${r2(ay - ry * 0.55 + wingUp)} ${r2(ax + rx * 0.5)},${r2(ay - ry * 0.05)} Q${r2(ax + rx * 0.42)},${r2(ay + ry * 0.5)} ${r2(ax - rx * 0.05)},${r2(ay + ry * 0.48)} Q${r2(ax - rx * 0.38)},${r2(ay + ry * 0.05)} ${r2(ax - rx * 0.3)},${r2(ay - ry * 0.4 + wingUp)} Z`;
    s += P(d, c.wing, 0.9);
  }
  s += c.p3?.body ? c.p3.body(ctx) : '';
  s += legOf(true);
  if (!se) s += tail();
  if (se) s += head;
  if (pose === 'joie' && se) s += heartIcon(hx, hy - hr - 2.4, 1.2);
  return s;
}
// une teinte plus sombre (patte éloignée)
function mixDark(hex) { const n = parseInt(hex.slice(1), 16); const f = v => Math.round(v * 0.78).toString(16).padStart(2, '0'); return `#${f(n >> 16)}${f((n >> 8) & 255)}${f(n & 255)}`; }
// Bec de trois quarts : il pointe vers le bas à droite, vers nous ; de dos, sa pointe dépasse à droite de la tête
function beak3(b, ctx) {
  const { se, hx, hy, hr } = ctx;
  const L0 = (b.len || 2.4), col = b.color || '#F2B33B';
  if (!se && b.kind === 'big') { const x = hx + hr * 0.7, y = hy + 0.4; return P(`M${r2(x - 0.6)},${r2(y - 1.9)} Q${r2(x + L0 * 0.4)},${r2(y - 2)} ${r2(x + L0 * 0.62)},${r2(y - 0.6)} Q${r2(x + L0 * 0.3)},${r2(y + 0.8)} ${r2(x - 0.4)},${r2(y + 1.3)} Z`, col, 0.8) + `<path d="M${r2(x + L0 * 0.5)},${r2(y - 1)} L${r2(x + L0 * 0.62)},${r2(y - 0.6)}" stroke="${b.tip || OUT}" stroke-width="1"/>`; }
  if (!se) { const x = hx + hr * 0.82, y = hy + (b.dy || 0.4) * 0.6; return P(`M${r2(x - 0.6)},${r2(y - 0.8)} L${r2(x + L0 * 0.55)},${r2(y - 0.5)} L${r2(x - 0.4)},${r2(y + 0.7)} Z`, b.kind === 'puffin' ? '#F07A3A' : col, 0.8); }
  const x = hx + hr * 0.45, y = hy + hr * 0.22 + (b.dy || 0) * 0.5;
  const tip = [x + L0 * 0.7, y + L0 * 0.42];
  switch (b.kind) {
    case 'long': {
      // bec long et fin (héron, corbeau, mouette) : pointé vers nous en biais, à peine ouvert
      const L1 = L0 * 0.9, dx = 0.9, dy = 0.44, nx = -0.44, ny = 0.9, w = 0.75;
      const bx = hx + hr * 0.45, by_ = hy + hr * 0.2, tx = bx + dx * L1, ty = by_ + dy * L1;
      return P(`M${r2(bx - nx * w)},${r2(by_ - ny * w)} L${r2(tx)},${r2(ty)} L${r2(bx + nx * w)},${r2(by_ + ny * w)} Z`, col, 0.5)
        + `<path d="M${r2(bx)},${r2(by_)} L${r2(tx - dx * 0.3)},${r2(ty - dy * 0.3)}" stroke="${OUT}" stroke-width="0.3"/>`;
    }
    case 'big': return P(`M${r2(x - 1)},${r2(y - 2)} Q${r2(tip[0])},${r2(tip[1] - 3)} ${r2(tip[0])},${r2(tip[1])} Q${r2(x + L0 * 0.3)},${r2(y + 2.2)} ${r2(x - 0.8)},${r2(y + 1.4)} Z`, col, 0.9)
      + `<path d="M${r2(tip[0] - 1)},${r2(tip[1] - 1.2)} L${r2(tip[0])},${r2(tip[1])}" stroke="${b.tip || OUT}" stroke-width="1.2"/>` + `<path d="M${r2(x - 0.6)},${r2(y)} Q${r2(x + L0 * 0.4)},${r2(y + 0.2)} ${r2(tip[0] - 0.2)},${r2(tip[1] - 0.2)}" fill="none" stroke="${OUT}" stroke-width="0.5"/>`;
    case 'puffin': return P(`M${r2(x - 0.8)},${r2(y - 2)} Q${r2(tip[0] + 0.4)},${r2(y - 1)} ${r2(tip[0])},${r2(tip[1])} Q${r2(x + L0 * 0.3)},${r2(y + 2.4)} ${r2(x - 0.8)},${r2(y + 1.8)} Z`, '#F07A3A', 0.9)
      + P(`M${r2(x - 0.8)},${r2(y - 2)} L${r2(x + 0.4)},${r2(y - 1.7)} L${r2(x + 0.4)},${r2(y + 1.9)} L${r2(x - 0.8)},${r2(y + 1.8)} Z`, '#3E6FB8', 0)
      + `<path d="M${r2(x + 1.2)},${r2(y - 1.2)} Q${r2(x + 2)},${r2(y + 0.4)} ${r2(x + 1.4)},${r2(y + 1.8)}" fill="none" stroke="#F2C94C" stroke-width="0.6"/>`;
    default: {
      // un cône vu en biais : base large contre la tête, deux mandibules, trait fin pour que la couleur se voie
      const L1 = Math.max(2.5, L0 * 1.15), dx = 0.84, dy = 0.54, nx = -0.54, ny = 0.84, w = Math.max(1.3, L0 * 0.5);
      const bx = hx + hr * 0.42, by_ = hy + hr * 0.22, tx = bx + dx * L1, ty = by_ + dy * L1;
      return P(`M${r2(bx - nx * w)},${r2(by_ - ny * w)} L${r2(tx)},${r2(ty)} L${r2(bx + nx * w)},${r2(by_ + ny * w)} Z`, col, 0.5)
        + `<path d="M${r2(bx)},${r2(by_)} L${r2(tx - dx * 0.2)},${r2(ty - dy * 0.2)}" stroke="${OUT}" stroke-width="0.3"/>`;
    }
  }
}
function headB3(c, ctx) {
  const { se, hx, hy, hr, mode } = ctx;
  let s = '';
  if (c.neck3) s += c.neck3(ctx);
  s += c.p3?.behindHead ? c.p3.behindHead(ctx) : '';
  s += E(hx, hy, hr, hr, c.headColor || c.color);
  if (se) {
    s += c.p3?.face ? c.p3.face(ctx) : '';
    const [, edy, er] = c.eye;
    s += eye(hx - hr * 0.3, hy + edy, er, mode) + eye(hx + hr * 0.36, hy + edy - 0.25, er * 0.85, mode);
    if (c.blush !== false) s += E(hx - hr * 0.45, hy + edy + er * 1.5, er * 0.8, er * 0.4, '#F7A8B0', 0);
    s += beak3(c.beak, ctx);
  } else {
    s += E(hx - hr * 0.15, hy + hr * 0.3, hr * 0.7, hr * 0.45, '#000000', 0).replace('fill=', 'opacity="0.08" fill=');
    s += beak3(c.beak, ctx);
  }
  s += c.p3?.head ? c.p3.head(ctx) : '';
  return s;
}

// ——— Pièces propres de trois quarts, par espèce (taches, cornes, laine…) ———
const spot3 = (ctx, list, col) => list.map(([u, v, ru, rv]) => { const [x, y] = ctx.at(u, v); return `<ellipse cx="${r2(x)}" cy="${r2(y)}" rx="${r2(ru * ctx.rx)}" ry="${r2(rv * ctx.ry)}" fill="${col}" transform="rotate(${r2(ctx.ang * 180 / Math.PI)} ${r2(x)} ${r2(y)})"/>`; }).join('');
const horn3 = (d) => thick(d, 1.1, '#F2E6C8');
const P3 = {};
P3.cow = (c) => {
  const patch = c.tail.color;
  return {
    // taches : sur la croupe, au milieu du flanc proche, une près du poitrail
    coat: (x) => spot3(x, x.se ? [[-0.45, -0.3, 0.32, 0.36], [0.2, 0.15, 0.22, 0.26], [-0.8, 0.35, 0.14, 0.18]] : [[0.4, -0.3, 0.3, 0.34], [-0.25, 0.1, 0.26, 0.3], [0.85, 0.3, 0.12, 0.16]], patch),
    face: ({ se, hx, hy, hr }) => (se ? E(hx + hr * 0.12, hy - hr * 0.68, hr * 0.4, hr * 0.26, patch, 0) : E(hx - hr * 0.1, hy - hr * 0.5, hr * 0.42, hr * 0.3, patch, 0)),
    head: ({ se, hx, hy, hr }) => se
      ? horn3(`M${r2(hx - hr * 0.42)},${r2(hy - hr * 0.8)} Q${r2(hx - hr * 0.8)},${r2(hy - hr - 1.6)} ${r2(hx - hr * 0.5)},${r2(hy - hr - 2.6)}`) + horn3(`M${r2(hx + hr * 0.4)},${r2(hy - hr * 0.86)} Q${r2(hx + hr * 0.78)},${r2(hy - hr - 1.4)} ${r2(hx + hr * 0.56)},${r2(hy - hr - 2.4)}`)
      : horn3(`M${r2(hx - hr * 0.4)},${r2(hy - hr * 0.78)} Q${r2(hx - hr * 0.78)},${r2(hy - hr - 1.6)} ${r2(hx - hr * 0.48)},${r2(hy - hr - 2.6)}`) + horn3(`M${r2(hx + hr * 0.42)},${r2(hy - hr * 0.8)} Q${r2(hx + hr * 0.8)},${r2(hy - hr - 1.6)} ${r2(hx + hr * 0.52)},${r2(hy - hr - 2.6)}`)
  };
};
P3.sheep = (c) => {
  const wool = c.fur, woolS = c.furS;
  // la laine : des bouclettes tout autour du corps, posées sur le contour vu en biais
  const cloud = (x) => {
    let o = '';
    for (let i = 0; i < 12; i++) { const t = (i / 12) * Math.PI * 2; const [px, py] = x.at(Math.cos(t) * 0.92, Math.sin(t) * 0.86); o += E(px, py, 2.5, 2.3, wool, 0.9); }
    const [cx, cy] = x.at(0, 0);
    return o + `<ellipse cx="${r2(cx)}" cy="${r2(cy)}" rx="${r2(x.rx * 0.95)}" ry="${r2(x.ry * 0.9)}" fill="${wool}" transform="rotate(${r2(x.ang * 180 / Math.PI)} ${r2(cx)} ${r2(cy)})"/>`
      + E(cx - 1.4, cy - x.ry * 0.5, 3, 1.3, '#FFFFFF', 0).replace('fill=', 'fill-opacity="0.45" fill=') + E(cx + 0.6, cy + x.ry * 0.55, x.rx * 0.6, 1.3, woolS, 0).replace('fill=', 'fill-opacity="0.55" fill=');
  };
  return {
    body: cloud,
    // la touffe de laine sur le front (de dos : sur la nuque)
    head: ({ se, hx, hy, hr }) => se ? E(hx - hr * 0.05, hy - hr * 0.8, hr * 0.55, hr * 0.38, wool, 0.9) + E(hx + hr * 0.42, hy - hr * 0.88, hr * 0.32, hr * 0.28, wool, 0.9)
      : E(hx, hy - hr * 0.55, hr * 0.7, hr * 0.5, wool, 0.9) + E(hx + hr * 0.3, hy - hr * 0.9, hr * 0.36, hr * 0.3, wool, 0.9)
  };
};
P3.pig = (c) => {
  const tach = c.id.endsWith('tachete');
  return {
    coat: (x) => (tach ? spot3(x, x.se ? [[-0.4, -0.25, 0.28, 0.3], [0.3, 0.2, 0.18, 0.22], [-0.8, 0.3, 0.12, 0.14]] : [[0.4, -0.2, 0.26, 0.3], [-0.3, 0.15, 0.22, 0.26]], '#8A5A5A') : ''),
    face: ({ se, hx, hy, hr }) => (tach && se ? E(hx - hr * 0.42, hy - hr * 0.38, hr * 0.3, hr * 0.26, '#8A5A5A', 0) : ''),
    // le groin rond, de face : deux narines
    head: ({ se, hx, hy, hr }) => se ? E(hx + hr * 0.32, hy + hr * 0.4, hr * 0.42, hr * 0.34, '#F29EA0', 0.9) + E(hx + hr * 0.2, hy + hr * 0.4, 0.42, 0.58, '#B8686A', 0) + E(hx + hr * 0.46, hy + hr * 0.38, 0.4, 0.55, '#B8686A', 0) : ''
  };
};
P3.goat = (c) => {
  const hornC = '#B8A88C';
  return {
    // cornes recourbées vers l'arrière ; barbiche sous le menton
    head: ({ se, hx, hy, hr }) => se
      ? thick(`M${r2(hx - hr * 0.3)},${r2(hy - hr * 0.8)} Q${r2(hx - hr * 0.7)},${r2(hy - hr - 2.4)} ${r2(hx - hr * 1.2)},${r2(hy - hr - 1.6)}`, 1.1, hornC) + thick(`M${r2(hx + hr * 0.3)},${r2(hy - hr * 0.86)} Q${r2(hx + hr * 0.1)},${r2(hy - hr - 2.6)} ${r2(hx - hr * 0.3)},${r2(hy - hr - 2.4)}`, 1, hornC)
        + P(`M${r2(hx + hr * 0.12)},${r2(hy + hr * 0.82)} L${r2(hx + hr * 0.02)},${r2(hy + hr * 1.5)} L${r2(hx + hr * 0.5)},${r2(hy + hr * 0.86)} Z`, c.furS, 0.7)
      : thick(`M${r2(hx - hr * 0.32)},${r2(hy - hr * 0.78)} Q${r2(hx - hr * 0.5)},${r2(hy - hr - 2.6)} ${r2(hx - hr * 1.1)},${r2(hy - hr - 0.8)}`, 1.1, hornC) + thick(`M${r2(hx + hr * 0.34)},${r2(hy - hr * 0.8)} Q${r2(hx + hr * 0.2)},${r2(hy - hr - 2.6)} ${r2(hx - hr * 0.2)},${r2(hy - hr - 1.2)}`, 1, hornC)
  };
};
P3.cat = (c) => ({
  // rayures en travers du dos
  coat: (x) => [-0.55, -0.15, 0.25].map(u => { const [a1, b1] = x.at(u, -0.95), [a2, b2] = x.at(u + 0.08, -0.25); return `<path d="M${r2(a1)},${r2(b1)} Q${r2((a1 + a2) / 2 + 0.8)},${r2((b1 + b2) / 2)} ${r2(a2)},${r2(b2)}" fill="none" stroke="${c.furS}" stroke-width="0.9"/>`; }).join(''),
  // moustaches des deux côtés du museau
  head: ({ se, hx, hy, hr }) => se ? [[-1, 0.3], [-1, 0.75], [1, 0.25], [1, 0.7]].map(([d, dy]) => { const x0 = hx + hr * 0.3 + d * hr * 0.42, y0 = hy + hr * 0.4 + dy * 0.4; return `<path d="M${r2(x0)},${r2(y0)} L${r2(x0 + d * hr * 0.55)},${r2(y0 + (dy - 0.5) * 1.6)}" stroke="${OUT}" stroke-width="0.35"/>`; }).join('') : ''
});
P3.dog = (c) => {
  const band = (d) => `<path d="${d}" fill="none" stroke="${OUT}" stroke-width="2.6" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#E0483C" stroke-width="1.3" stroke-linecap="round"/>`;
  return {
    // le collier rouge et sa médaille, au cou : la tête le cache en partie
    neck: (x) => {
      const { se, hx, hy, hr } = x;
      return neck3(c, x) + (se
        ? band(`M${r2(hx - hr * 0.75)},${r2(hy + hr * 0.62)} Q${r2(hx + hr * 0.05)},${r2(hy + hr * 1.3)} ${r2(hx + hr * 0.8)},${r2(hy + hr * 0.58)}`) + E(hx + hr * 0.05, hy + hr * 1.32, 0.7, 0.7, '#F2C94C', 0.5)
        : band(`M${r2(hx - hr * 0.85)},${r2(hy + hr * 0.4)} Q${r2(hx)},${r2(hy + hr * 1.05)} ${r2(hx + hr * 0.8)},${r2(hy + hr * 0.45)}`));
    }
  };
};
P3.hen = (c) => ({
  // la crête sur le dessus de la tête, le barbillon sous le bec ; la poule grise a des mouchetures
  head: ({ se, hx, hy, hr }) => {
    const comb = `M${r2(hx - 1.4)},${r2(hy - hr + 0.6)} Q${r2(hx - 1.3)},${r2(hy - hr - 1.6)} ${r2(hx - 0.3)},${r2(hy - hr - 0.4)} Q${r2(hx + 0.3)},${r2(hy - hr - 2)} ${r2(hx + 1)},${r2(hy - hr - 0.2)} Q${r2(hx + 1.7)},${r2(hy - hr - 1.2)} ${r2(hx + 1.5)},${r2(hy - hr + 0.8)} Z`;
    return P(comb, '#E8483C', 0.7) + (se ? E(hx + hr * 0.5, hy + hr * 0.95, 0.7, 1, '#E8483C', 0.6) : '');
  },
  coat: (x) => (c.id === 'hengrise' ? [[-0.5, -0.3], [0.1, -0.55], [0.45, 0.1], [-0.2, 0.35]].map(([u, v]) => { const [px, py] = x.at(u, v); return E(px, py, 0.5, 0.5, '#FFFFFF', 0); }).join('') : '')
});
P3.chick = () => ({ head: ({ hx, hy, hr }) => P(`M${r2(hx - 0.3)},${r2(hy - hr + 0.2)} Q${r2(hx - 0.5)},${r2(hy - hr - 1.4)} ${r2(hx + 0.7)},${r2(hy - hr - 0.6)}`, 'none', 0.6) });
P3.deer = (c) => {
  c.t3 = { ...(c.t3 || {}), heartUp: 3.4 };
  const antler = (d) => thick(d, 0.9, '#E6D2A8');
  return {
    // taches blanches sur le dos
    coat: (x) => [[-0.5, -0.65], [-0.15, -0.75], [0.2, -0.68], [-0.32, -0.4], [0.05, -0.45]].map(([u, v]) => { const [px, py] = x.at(u, v); return E(px, py, 0.8, 0.55, '#FFF4E0', 0); }).join(''),
    // les bois : deux ramures en V, chacune avec un andouiller
    head: ({ se, hx, hy, hr }) => {
      const one = (sx, k) => { const bx = hx + sx * hr * 0.32, by = hy - hr * 0.85; return antler(`M${r2(bx)},${r2(by)} Q${r2(bx + sx * 1.2 * k)},${r2(by - 3)} ${r2(bx + sx * 0.6 * k)},${r2(by - 5.6)} M${r2(bx + sx * 0.9 * k)},${r2(by - 2.6)} L${r2(bx + sx * 3 * k)},${r2(by - 3.6)}`); };
      return se ? one(1, 0.9) + one(-1, 1) : one(1, 1) + one(-1, 0.95);
    }
  };
};
P3.fox = (c) => ({
  // joues et menton blancs ; de dos, le bout blanc de la queue suffit
  face: ({ se, hx, hy, hr }) => (se ? E(hx + hr * 0.28, hy + hr * 0.5, hr * 0.62, hr * 0.42, c.belly, 0) : '')
});
P3.kit = P3.fox; P3.fennec = P3.fox;
P3.snowFox = () => ({});
P3.hedgehog = (c) => ({
  // le dôme de piquants : une demi-ellipse hérissée posée sur le dos, de la croupe jusque derrière la tête
  body: (x) => {
    const [cx, cy] = x.at(-0.22, 0.25), a = x.rx * 1.08, b = x.ry * 1.55, n = 17;
    const pt = (t, k) => rot(cx + Math.cos(t) * a * k, cy - Math.sin(t) * b * k, cx, cy, x.ang);
    let d = '';
    for (let i = 0; i <= n; i++) { const t = Math.PI * (0.02 + (i / n) * 0.96); const [px, py] = pt(Math.PI - t, i % 2 ? 0.8 : 1); d += `${i ? 'L' : 'M'}${r2(px)},${r2(py)} `; }
    const [ex, ey] = pt(0, 0.62), [sx, sy] = pt(Math.PI, 0.7);
    d += `L${r2(ex)},${r2(ey + 1)} Q${r2(cx)},${r2(cy + 2.2)} ${r2(sx)},${r2(sy + 1)} Z`;
    const hl = [0.35, 0.55, 0.75].map(t => { const [p1x, p1y] = pt(Math.PI * t, 0.45), [p2x, p2y] = pt(Math.PI * t, 0.72); return `M${r2(p1x)},${r2(p1y)} L${r2(p2x)},${r2(p2y)}`; }).join(' ');
    return P(d, '#8A6440') + stroke(hl, 0.6, '#B88A5A');
  }
});
P3.squirrel = (c) => ({
  tail: (x) => {
    const [tx, ty] = x.se ? x.at(-0.85, -0.3) : x.at(-0.8, -0.1);
    const w = x.walk ? x.ph * 0.6 : 0;
    const d = `M${r2(tx + 1)},${r2(ty - 1)} C${r2(tx - 4)},${r2(ty - 1)} ${r2(tx - 6.5 + w)},${r2(ty - 8)} ${r2(tx - 3.5 + w)},${r2(ty - 11.5)} C${r2(tx - 1.5 + w)},${r2(ty - 13.5)} ${r2(tx + 1.8 + w)},${r2(ty - 12)} ${r2(tx + 1.2 + w)},${r2(ty - 9.4)} C${r2(tx - 0.4 + w)},${r2(ty - 10.8)} ${r2(tx - 2.8 + w)},${r2(ty - 10)} ${r2(tx - 2.8 + w)},${r2(ty - 7.4)} C${r2(tx - 2.8)},${r2(ty - 4.4)} ${r2(tx - 0.4)},${r2(ty - 2.6)} ${r2(tx + 1.4)},${r2(ty + 1)} Z`;
    return P(d, c.fur) + clip(`sq${x.view}${x.pose}`, d, `<ellipse cx="${r2(tx - 2 + w)}" cy="${r2(ty - 11)}" rx="3.4" ry="2.6" fill="${c.tail.tip}"/>`) + P(d, 'none')
      + stroke(`M${r2(tx - 1.2)},${r2(ty - 3)} Q${r2(tx - 3.6 + w)},${r2(ty - 6.6)} ${r2(tx - 3.2 + w)},${r2(ty - 9.6)}`, 0.6, c.furS);
  },
  // le gland tenu au repos, sous le menton
  head: ({ se, hx, hy, hr, rest }) => (rest && se ? E(hx + hr * 0.15, hy + hr * 1.2, 1.3, 1.5, '#A8743F', 0.7) + E(hx + hr * 0.15, hy + hr * 0.92, 1.4, 0.7, '#7E5530', 0.6) : '')
});
P3.otter = (c) => ({
  face: ({ se, hx, hy, hr }) => (se ? E(hx + hr * 0.25, hy + hr * 0.45, hr * 0.72, hr * 0.5, c.belly, 0) : ''),
  head: ({ se, hx, hy, hr }) => se ? [[-1, 0.3], [-1, 0.7], [1, 0.25], [1, 0.65]].map(([d, dy]) => { const x0 = hx + hr * 0.25 + d * hr * 0.45, y0 = hy + hr * 0.5 + dy * 0.4; return `<path d="M${r2(x0)},${r2(y0)} L${r2(x0 + d * hr * 0.5)},${r2(y0 + (dy - 0.5) * 1.4)}" stroke="${OUT}" stroke-width="0.35"/>`; }).join('') : ''
});
P3.ibex = (c) => {
  c.t3 = { ...(c.t3 || {}), heartUp: 4.4 };
  const hornC = '#C8B48E';
  // une grande corne annelée, recourbée vers l'arrière
  const horn = (bx, by, sx, k) => {
    const d = `M${r2(bx)},${r2(by)} Q${r2(bx + sx * 1.2 * k)},${r2(by - 6 * k)} ${r2(bx - sx * 3.6 * k)},${r2(by - 6.6 * k)} Q${r2(bx - sx * 6.4 * k)},${r2(by - 5.8 * k)} ${r2(bx - sx * 6 * k)},${r2(by - 2.6 * k)}`;
    return thick(d, 1.8, hornC) + [0.3, 0.5, 0.7].map(t => E(bx - sx * (t * 6 - 1) * k, by - 6.2 * k + Math.abs(t - 0.5) * 2, 1, 0.32, '#8A7656', 0)).join('');
  };
  return {
    head: ({ se, hx, hy, hr }) => se
      ? horn(hx + hr * 0.3, hy - hr * 0.82, -1, 0.85) + horn(hx - hr * 0.25, hy - hr * 0.8, 1, 1) + P(`M${r2(hx + hr * 0.15)},${r2(hy + hr * 0.82)} L${r2(hx + hr * 0.02)},${r2(hy + hr * 1.55)} L${r2(hx + hr * 0.52)},${r2(hy + hr * 0.86)} Z`, '#5A4A3A', 0.7)
      : horn(hx - hr * 0.3, hy - hr * 0.78, 1, 1) + horn(hx + hr * 0.3, hy - hr * 0.8, 1, 0.9)
  };
};
P3.pony = (c) => {
  c.t3 = { ...(c.t3 || {}), reach: 0.78, hdy: -2.6, neckW: 1.1 };
  const mane = '#F2D28A';
  return {
    // la crinière le long du cou, la mèche sur le front
    neck: (x) => {
      const { se, by, rx, ry, ang, hx, hy, hr } = x;
      const [nx, ny] = rot(rx * 0.62, by - ry * 0.35, 0, by, ang);
      const base = neck3(c, x);
      const m = se ? thick(`M${r2(hx - hr * 0.55)},${r2(hy - hr * 0.6)} Q${r2((hx + nx) / 2 - 2.2)},${r2((hy + ny) / 2 - 1)} ${r2(nx - 1.4)},${r2(ny - 0.4)}`, 2.4, mane)
        : thick(`M${r2(hx - hr * 0.2)},${r2(hy - hr * 0.7)} Q${r2((hx + nx) / 2 - 1.2)},${r2((hy + ny) / 2 - 1.4)} ${r2(nx - 0.6)},${r2(ny - 0.8)}`, 2.6, mane);
      return base + m;
    },
    head: ({ se, hx, hy, hr }) => se ? P(`M${r2(hx - hr * 0.35)},${r2(hy - hr * 0.95)} Q${r2(hx + hr * 0.2)},${r2(hy - hr * 1.1)} ${r2(hx + hr * 0.3)},${r2(hy - hr * 0.35)} Q${r2(hx)},${r2(hy - hr * 0.55)} ${r2(hx - hr * 0.45)},${r2(hy - hr * 0.5)} Z`, mane, 0.8)
      // de dos : la crinière descend de la nuque vers le garrot (le corps en cache le bas)
      : thick(`M${r2(hx - hr * 0.15)},${r2(hy - hr * 0.85)} Q${r2(hx - hr * 0.75)},${r2(hy)} ${r2(hx - hr * 1.1)},${r2(hy + hr * 1.3)}`, 2.6, mane)
  };
};
P3.camel = (c) => (c.t3 = { ...(c.t3 || {}), reach: 0.84, hdy: -2.4 }, {
  // la bosse sur le dos
  back: (x) => { const [px, py] = x.at(-0.08, -0.85); return E(px, py, x.rx * 0.5, x.ry * 0.62, c.fur); },
  // le long cou en S, du poitrail à la tête
  neck: (x) => {
    const { se, hx, hy, hr } = x;
    const [nx, ny] = x.at(0.75, -0.2);
    return thick(`M${r2(nx)},${r2(ny)} Q${r2(nx + (se ? 3.4 : 2.6))},${r2(ny - 1)} ${r2(hx - hr * 0.3)},${r2(hy + hr * 0.5)}`, 3, c.fur);
  }
});
P3.tortoise = (c) => ({
  // la carapace bombée à écailles, qui couvre le dos
  body: (x) => {
    const [cx, cy] = x.at(-0.1, 0.35), a = x.rx * 1.14, b = x.ry * 2.6;
    const pts = []; for (let i = 0; i <= 20; i++) { const t = Math.PI * (i / 20); pts.push(rot(cx + Math.cos(t) * a, cy - Math.sin(t) * b, cx, cy, x.ang)); }
    const d = 'M' + pts.map(p => `${r2(p[0])},${r2(p[1])}`).join(' L') + ` Q${r2(cx)},${r2(cy + 1.6)} ${r2(pts[0][0])},${r2(pts[0][1])} Z`;
    const sc = [[-0.45, -0.45], [0, -0.68], [0.45, -0.45], [-0.22, -0.15], [0.25, -0.15]].map(([u, v]) => { const [px, py] = rot(cx + u * a, cy + v * b, cx, cy, x.ang); return `<path d="M${r2(px - 1.6)},${r2(py)} l1.6,-1.1 l1.6,1.1 l0,1.5 l-1.6,1.1 l-1.6,-1.1 Z" fill="#9AB85E" stroke="${OUT}" stroke-width="0.5"/>`; }).join('');
    return P(d, '#7E9A4A') + clip(`sh3${x.view}${x.pose}`, d, sc) + P(d, 'none');
  }
});
P3.frog = (c) => ({
  // deux gros yeux sur le dessus de la tête
  behindHead: () => '',
  head: ({ se, hx, hy, hr, mode }) => se
    ? E(hx - hr * 0.5, hy - hr * 0.62, 1.8, 1.8, c.fur) + E(hx + hr * 0.45, hy - hr * 0.7, 1.65, 1.65, c.fur) + eye(hx - hr * 0.5, hy - hr * 0.62, 0.95, mode) + eye(hx + hr * 0.45, hy - hr * 0.7, 0.85, mode)
      + P(`M${r2(hx - hr * 0.6)},${r2(hy + hr * 0.25)} Q${r2(hx)},${r2(hy + hr * 0.7)} ${r2(hx + hr * 0.7)},${r2(hy + hr * 0.2)}`, 'none', 0.6)
    : E(hx - hr * 0.45, hy - hr * 0.6, 1.8, 1.8, c.fur) + E(hx + hr * 0.45, hy - hr * 0.65, 1.7, 1.7, c.fur)
});
P3.salamander = (c) => ({ coat: (x) => [[-0.5, -0.4], [0, -0.55], [0.45, -0.35]].map(([u, v]) => { const [px, py] = x.at(u, v); return E(px, py, 0.85, 0.65, '#F2C94C', 0); }).join('') });
P3.chameleon = (c) => ({
  coat: (x) => [-0.5, -0.05, 0.4].map(u => { const [a1, b1] = x.at(u, -0.95), [a2, b2] = x.at(u + 0.1, 0.4); return `<path d="M${r2(a1)},${r2(b1)} L${r2(a2)},${r2(b2)}" stroke="#F2C94C" stroke-width="0.8"/>`; }).join(''),
  // la crête de la tête
  head: ({ se, hx, hy, hr }) => P(`M${r2(hx - hr * 0.6)},${r2(hy - hr * 0.5)} L${r2(hx - hr * 0.2)},${r2(hy - hr * 1.45)} L${r2(hx + hr * 0.35)},${r2(hy - hr * 0.7)} Z`, c.fur, 0.8)
});
P3.heron = (c) => ({
  // le long cou en S (avant le corps de dos, après lui de trois quarts avant), la calotte noire et sa plume
  behindHead: (x) => {
    const { se, hx, hy, hr } = x;
    const [nx, ny] = x.at(0.55, -0.6);
    const d = se ? `M${r2(nx)},${r2(ny)} Q${r2(nx + 4.4)},${r2(ny - 4)} ${r2(hx - 0.6)},${r2(hy + 6)} Q${r2(hx - 2)},${r2(hy + 3)} ${r2(hx)},${r2(hy + 1)}`
      : `M${r2(nx)},${r2(ny)} Q${r2(nx + 3)},${r2(ny - 4.4)} ${r2(hx - 0.4)},${r2(hy + 6)} Q${r2(hx - 1.6)},${r2(hy + 3)} ${r2(hx)},${r2(hy + 1)}`;
    return thick(d, 2.2, c.headColor);
  },
  head: ({ se, hx, hy, hr }) => E(hx - hr * 0.05, hy - hr * 0.45, hr * 0.85, hr * 0.45, '#3A3A48', 0)
    + thick(`M${r2(hx - hr * 0.6)},${r2(hy - hr * 0.4)} Q${r2(hx - hr * 1.8)},${r2(hy - hr * 0.6)} ${r2(hx - hr * 2.3)},${r2(hy + hr * 0.3)}`, 0.6, '#3A3A48')
});
P3.puffin = (c) => ({
  // le masque blanc ; Bosco est bougon : un sourcil froncé
  face: ({ hx, hy, hr }) => E(hx + hr * 0.1, hy + hr * 0.1, hr * 0.82, hr * 0.78, '#F4F4F4', 0),
  head: ({ se, hx, hy, hr, mode }) => (se && mode === 'open' ? `<path d="M${r2(hx - hr * 0.55)},${r2(hy - hr * 0.55)} L${r2(hx - hr * 0.05)},${r2(hy - hr * 0.42)}" stroke="${OUT}" stroke-width="0.7" stroke-linecap="round"/>` : '')
});
P3.toucan = (c) => ({ face: ({ hx, hy, hr }) => E(hx + hr * 0.05, hy + hr * 0.55, hr * 0.7, hr * 0.55, '#FFF4C8', 0) + E(hx - hr * 0.3, hy - hr * 0.15, hr * 0.42, hr * 0.4, '#7CD0E8', 0) + E(hx + hr * 0.38, hy - hr * 0.22, hr * 0.32, hr * 0.32, '#7CD0E8', 0) });
P3.crow = (c) => ({ body: (x) => { const [ax, ay] = x.at(-0.4, -0.55), [bx, by] = x.at(0.3, -0.5); return `<path d="M${r2(ax)},${r2(ay)} Q${r2((ax + bx) / 2)},${r2(Math.min(ay, by) - 1)} ${r2(bx)},${r2(by)}" fill="none" stroke="#6E80B0" stroke-width="0.6" opacity="0.8"/>`; } });
P3.bird = (c) => ({
  // la calotte bleue de la mésange, son trait noir à travers l'œil
  head: ({ se, hx, hy, hr }) => P(`M${r2(hx - hr)},${r2(hy - 0.3)} Q${r2(hx - hr * 0.6)},${r2(hy - hr * 1.02)} ${r2(hx + hr * 0.75)},${r2(hy - hr * 0.6)} Q${r2(hx)},${r2(hy - hr * 0.36)} ${r2(hx - hr)},${r2(hy - 0.3)} Z`, '#5C9CE0', 0)
    + (se ? `<path d="M${r2(hx - hr * 0.75)},${r2(hy - 0.1)} L${r2(hx - hr * 0.1)},${r2(hy - 0.35)} M${r2(hx + hr * 0.6)},${r2(hy - 0.45)} L${r2(hx + hr * 0.9)},${r2(hy - 0.4)}" stroke="#2A3A5A" stroke-width="0.5"/>` : '')
});
P3.gull = () => ({});
// la bête complète : ses pièces de trois quarts (P3), selon son espèce
const with3 = (c) => { const k = Object.keys(P3).find(n => c.id.startsWith(n)); if (!k || c.p3) return c; const p3 = P3[k](c); return { ...c, p3 }; };

module.exports = { quad3: (c, view, pose) => quad3(with3(c), view, pose), bird3: (c, view, pose) => bird3(with3(c), view, pose), ear3 };
