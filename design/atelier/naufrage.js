// Les maîtres en naufragés : le même dessin (kit de la troupe), habits délavés par la mer, ourlets en lambeaux,
// trous, pieds nus et pantalon retroussé, une voile (ou une couverture) nouée sur les épaules, des algues prises
// dans les cheveux, une trace de suie ou de sable sur la joue. Chacun garde l'objet qu'il a sauvé (longue-vue,
// louche, loupes, baguette et bocal, maillet, boîte à graines). Ils perdent ce look au souvenir retrouvé.
const { OUT, P, E, L, clip, bareFoot, shoe, r2 } = require('./troupe');

// ---- couleurs délavées : moins saturées, tirées vers un gris clair de sel ----
function hsl(hex) {
  const n = parseInt(hex.slice(1), 16), r = (n >> 16) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn;
  let h = 0, s = 0;
  if (d) {
    s = d / (1 - Math.abs(2 * l - 1));
    h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
    h *= 60; if (h < 0) h += 360;
  }
  return [h, s, l];
}
function hex([h, s, l]) {
  const c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs(((h / 60) % 2) - 1)), m = l - c / 2;
  const [r, g, b] = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
  return '#' + [r, g, b].map(v => Math.round((v + m) * 255).toString(16).padStart(2, '0')).join('').toUpperCase();
}
const fade = (c, k = 1) => { const [h, s, l] = hsl(c); return hex([h, s * (1 - 0.45 * k), l + (0.74 - l) * 0.26 * k]); };
const recolor = (str, map) => str.replace(/#[0-9A-Fa-f]{6}\b/g, m => map[m.toUpperCase()] || m);

// ---- pièces communes ----
const CANVAS = { cloth: '#E6DCC3', shade: '#C9BB98', seam: '#B3A27C', rope: '#B08850', ropeS: '#86663A' };
const cord = (d, w, color) => `<path d="${d}" fill="none" stroke="${OUT}" stroke-width="${r2(w + 1.4)}" stroke-linecap="round" stroke-linejoin="round"/>`
  + `<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
const pts = a => a.map(p => `${r2(p[0])},${r2(p[1])}`).join(' L');

// Lambeau qui pend sous l'ourlet en (x, y) : le fond couvre l'ourlet, seul le bas déchiré est cerné
function tatter(x, y, color, w = 2.2, s = 1) {
  const zig = [[x - w, y - 0.1], [x - w * 0.5, y + 2.4 * s], [x, y + 0.9 * s], [x + w * 0.5, y + 3 * s], [x + w, y - 0.1]];
  return `<path d="M${r2(x - w)},${r2(y - 1)} L${pts(zig)} L${r2(x + w)},${r2(y - 1)} Z" fill="${color}"/>`
    + `<path d="M${pts(zig)}" fill="none" stroke="${OUT}" stroke-width="0.9" stroke-linejoin="round" stroke-linecap="round"/>`;
}
// Trou déchiré : une petite ouverture ovale au bord à peine dentelé (on voit le dessous, plus sombre), un fil qui pend
function hole(x, y, r, color) {
  const a = Array.from({ length: 9 }, (_, i) => {
    const t = (i / 9) * Math.PI * 2, k = [1, 0.86, 1, 0.9, 1, 0.84, 0.98, 0.9, 1][i];
    return [x + Math.cos(t) * r * k, y + Math.sin(t) * r * 0.72 * k];
  });
  return `<path d="M${pts(a)} Z" fill="${color}" stroke="${OUT}" stroke-width="0.55" stroke-linejoin="round"/>`
    + `<path d="M${r2(x + r * 0.2)},${r2(y + r * 0.66)} q0.3,0.8 -0.2,1.5" fill="none" stroke="${OUT}" stroke-width="0.4" stroke-linecap="round"/>`;
}
// Accroc : petite déchirure en zigzag
const rip = (x, y, len = 2.6) => `<path d="M${r2(x - len / 2)},${r2(y)} L${r2(x - len / 6)},${r2(y + 0.7)} L${r2(x + len / 6)},${r2(y - 0.5)} L${r2(x + len / 2)},${r2(y + 0.3)}" fill="none" stroke="${OUT}" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>`;
// Algue : ruban ondulé et deux petites feuilles
function weed(path, leaves = []) {
  return cord(path, 1.7, '#5C8A45') + `<path d="${path}" fill="none" stroke="#86B562" stroke-width="0.5" stroke-linecap="round" stroke-dasharray="1.2 1.6"/>`
    + leaves.map(([x, y, rot]) => `<g transform="translate(${x} ${y}) rotate(${rot})">`
    + P('M0,0 Q1.6,2 0,4.4 Q-1.6,2 0,0 Z', '#6E9E50', 0.7) + L([0, 0.6], [0, 3.6], '#4E7A3A', 0.4) + '</g>').join('');
}
// Trace de suie ou de sable sur la joue (sans contour, un peu transparente)
const smudge = (x, y, color = '#8A6A50') => `<ellipse cx="${r2(x)}" cy="${r2(y)}" rx="1.8" ry="0.85" fill="${color}" opacity="0.6" transform="rotate(-14 ${r2(x)} ${r2(y)})"/>`
  + `<ellipse cx="${r2(x + 1.7)}" cy="${r2(y + 0.7)}" rx="0.55" ry="0.4" fill="${color}" opacity="0.55"/>`;

// Pied nu et bas de pantalon retroussé (le mollet se voit)
function rolledFoot(cuff, cuffS) {
  return (c, x, y, dir, tilt) => {
    const w = c.legW;
    const shin = `<rect x="${r2(x - w / 2 + 0.3)}" y="${r2(y - 3.2)}" width="${r2(w - 0.6)}" height="4.2" fill="${c.skin}" stroke="${OUT}" stroke-width="1.1"/>`
      + `<rect x="${r2(x - w / 2 + 0.85)}" y="${r2(y - 2.6)}" width="${r2(w - 1.7)}" height="3.8" fill="${c.skin}"/>`;
    const band = `<rect x="${r2(x - w / 2 - 0.5)}" y="${r2(y - 4.6)}" width="${r2(w + 1)}" height="2" rx="0.8" fill="${cuff}" stroke="${OUT}" stroke-width="1"/>`
      + L([x - w / 2 + 0.2, y - 3.4], [x + w / 2 - 0.2, y - 3.4], cuffS, 0.5);
    return shin + bareFoot(c, x, y, dir, tilt) + band;
  };
}

// Voile nouée sur les épaules : deux pans devant, une corde au cou ; de dos, un seul pan. sh : épaules du personnage
function cape(sh, view, uid, cloth = CANVAS, extra = '') {
  const [[x0, y], [x1]] = sh;
  const cx = (x0 + x1) / 2, hw = (x1 - x0) / 2;
  const k = view === 'se' ? -1.6 : 0;
  if (view === 'ne') {
    const d = `M${r2(cx - hw + 1)},${r2(y - 3.4)} Q${cx},${r2(y - 1.4)} ${r2(cx + hw - 1)},${r2(y - 3.4)} Q${r2(cx + hw + 2.8)},${r2(y - 2.4)} ${r2(cx + hw + 3)},${r2(y + 2)}`
      + ` L${r2(cx + hw + 2.6)},${r2(y + 8)} L${r2(cx + hw + 0.4)},${r2(y + 6.8)} L${r2(cx + 5)},${r2(y + 9)} L${r2(cx + 2)},${r2(y + 7.4)} L${r2(cx - 1.6)},${r2(y + 9.2)}`
      + ` L${r2(cx - 4.6)},${r2(y + 7.2)} L${r2(cx - hw + 0.4)},${r2(y + 8.6)} L${r2(cx - hw - 2.6)},${r2(y + 7.6)} L${r2(cx - hw - 3)},${r2(y + 2)} Q${r2(cx - hw - 2.8)},${r2(y - 2.4)} ${r2(cx - hw + 1)},${r2(y - 3.4)} Z`;
    return P(d, cloth.cloth) + clip(`${uid}vo`, d, extra + `<rect x="${r2(cx + 3)}" y="${r2(y - 6)}" width="14" height="20" fill="${cloth.shade}" opacity="0.8"/>`
      + `<path d="M${r2(cx - hw - 4)},${r2(y + 3.4)} Q${cx},${r2(y + 5)} ${r2(cx + hw + 4)},${r2(y + 3.4)}" fill="none" stroke="${cloth.seam}" stroke-width="0.6" stroke-dasharray="1 0.8"/>`)
      + P(d, 'none');
  }
  // de face (k = 0) ou de trois quarts (k < 0 : le pan lointain, à droite, est plus étroit)
  const far = view === 'se' ? 0.75 : 1;
  const panel = (m, f) => {
    const X = u => r2(cx + k + m * u * f);
    return `M${X(1.4)},${r2(y - 3.6)} Q${X(hw + 1.6)},${r2(y - 4)} ${X(hw + 2.8)},${r2(y + 1.2)} L${X(hw + 2.6)},${r2(y + 7)}`
      + ` L${X(hw + 1)},${r2(y + 5.9)} L${X(hw - 0.6)},${r2(y + 7.4)} L${X(hw - 2.2)},${r2(y + 5.8)} L${X(4.4)},${r2(y + 6.6)}`
      + ` Q${X(3.6)},${r2(y + 2.8)} ${X(0.7)},${r2(y + 0.6)} Z`;
  };
  const L1 = panel(-1, 1), R1 = panel(1, far);
  // le pan droit est à l'ombre : un voile sombre par-dessus le motif (bandes, rayures)
  const shadeR = `<rect x="${r2(cx + k + 2)}" y="${r2(y - 6)}" width="16" height="20" fill="${cloth.shade}" opacity="0.8"/>`;
  const seam = m => `<path d="M${r2(cx + k + m * (hw + 2))},${r2(y + 1.6)} L${r2(cx + k + m * 4.4)},${r2(y + 3.8)}" fill="none" stroke="${cloth.seam}" stroke-width="0.6" stroke-dasharray="1 0.8"/>`;
  let s = P(L1, cloth.cloth) + clip(`${uid}vl`, L1, extra + seam(-1)) + P(L1, 'none');
  s += P(R1, cloth.cloth) + clip(`${uid}vr`, R1, extra + shadeR + seam(far)) + P(R1, 'none');
  // nœud de corde sous le menton
  const kx = cx + k;
  s += cord(`M${r2(kx - 1.6)},${r2(y + 0.4)} L${r2(kx - 2.4)},${r2(y + 4.4)}`, 0.8, cloth.rope) + cord(`M${r2(kx + 1.4)},${r2(y + 0.4)} L${r2(kx + 2)},${r2(y + 4)}`, 0.8, cloth.rope);
  s += E(kx, y + 0.2, 1.5, 1.15, cloth.rope, 0.8) + L([kx - 0.6, y - 0.2], [kx + 0.5, y + 0.6], cloth.ropeS, 0.4);
  return s;
}

// ---- la transformation ----
// spec (tout est facultatif) :
//   fade / k / map : couleurs d'habits délavées (map : remplacements imposés) ; overKeep : couleurs gardées par-dessus
//   leg : 'roll' (pantalon retroussé) ou 'skin' (jambes nues) ; bareSide : 'left' ou 'right' (un seul pied nu, l'autre
//   garde sa chaussure) ; sleeves : 'roll' ou 'torn' ; bandage : 'left' ou 'right' ; flags : réglages du personnage
//   (noCape, noShawl…) ; tatters / holes / rips par vue ; over(ctx) : par-dessus le corps ; back(ctx) : derrière ;
//   backItems(cc, ctx) : remplace les objets de dos ; cape : tissu de la voile nouée (ou capeFn(cc, ctx)) ;
//   head(ctx) : par-dessus la tête ; headFix(str, ctx) : retouche de la tête (un pompon qui pend…)
function castaway(c, spec) {
  const map = {};
  for (const col of spec.fade || []) map[col.toUpperCase()] = fade(col, spec.k || 1);
  Object.assign(map, spec.map || {});
  const F = s => (s ? recolor(s, map) : s);
  const mapO = { ...map }; for (const col of spec.overKeep || []) delete mapO[col.toUpperCase()];
  const FO = s => recolor(s, mapO);
  const legs = spec.leg === 'skin' ? { leg: c.skin, legS: c.skinS || spec.skinS } : { leg: F(c.leg), legS: F(c.legS) };
  const rolled = spec.leg === 'roll' ? rolledFoot(F(c.leg), F(c.legS)) : null;
  const bare = (cc, x, y, dir, tilt) => (rolled ? rolled(cc, x, y, dir, tilt) : bareFoot(cc, x, y, dir, tilt));
  const foot = spec.bareSide
    ? (cc, x, y, dir, tilt) => {
      const screenLeft = x < 24, charRight = cc.view === 'ne' ? !screenLeft : screenLeft;
      return (spec.bareSide === 'right') === charRight ? bare(cc, x, y, dir, tilt) : shoe(cc, x, y, dir, tilt);
    }
    : bare;
  const out = {
    ...c, ...(spec.flags || {}),
    name: c.name, uid: c.uid + 'n',
    skinS: c.skinS || spec.skinS,
    sleeve: F(c.sleeve), cuff: c.cuff ? F(c.cuff) : c.cuff,
    sleeves: spec.sleeves, sleeveCut: spec.sleeveCut, bandage: spec.bandage, bareSide: spec.bareSide,
    shoe: c.shoe && F(c.shoe), shoeS: c.shoeS && F(c.shoeS), shoeH: c.shoeH && F(c.shoeH),
    ...legs, foot,
    backItems: (cc, ctx) => (spec.backItems ? spec.backItems(cc, ctx) : F(c.backItems ? c.backItems(cc, ctx) : '')) + (spec.back ? spec.back(ctx) : ''),
    body: (cc, ctx) => {
      const v = ctx.view;
      const sway = spec.sway ? spec.sway(ctx) : 0;
      let s = F(c.body(cc, ctx));
      for (const [x, y, w, sc] of (spec.holes && spec.holes[v]) || []) s += hole(x + sway, y, w, F(sc));
      for (const [x, y, len] of (spec.rips && spec.rips[v]) || []) s += rip(x + sway, y, len);
      // assis, le corps descend de ctx.seatDy : un lambeau qui sortirait par le bas du cadre (64) remonte juste assez
      for (const [x, y, col, w, k] of (spec.tatters && spec.tatters[v]) || []) s += tatter(x + sway, ctx.seatDy ? Math.min(y, 63.5 - ctx.seatDy - 3 * (k ?? 1) - 0.45) : y, F(col), w, k);
      return s + (spec.over ? spec.over(ctx, cc) : '');
    },
    neck: c.neck ? (cc, ctx) => F(c.neck(cc, ctx)) : undefined,
    restLeft: c.restLeft ? (cc, ctx) => F(c.restLeft(cc, ctx)) : undefined,
    hold: c.hold ? (cc, h, ctx) => F(c.hold(cc, h, ctx)) : undefined,
    head: (cc, ctx, act) => { const h = F(c.head(cc, ctx, act)); return spec.headFix ? spec.headFix(h, ctx) : h; },
    overArms: spec.capeFn ? (cc, ctx) => spec.capeFn(cc, ctx)
      : spec.cape ? (cc, ctx) => cape(spec.capeSh || c.shoulders, ctx.view, cc.uid, spec.cape, spec.capeExtra ? spec.capeExtra(ctx.view) : '') : undefined,
    overHead: spec.head ? (cc, ctx) => spec.head(ctx) : undefined,
    // le geste : appelé sur la copie de l'image (manches, bandage), bras délavés, et ce qui passe par-dessus aussi
    pose(ctx) {
      const a = c.pose.call(this, ctx);
      if (!a) return a;
      return { ...a, left: a.left != null ? F(a.left) : a.left, right: a.right != null ? F(a.right) : a.right, over: a.over ? FO(a.over) : a.over };
    }
  };
  return out;
}

module.exports = { castaway, fade, recolor, cape, tatter, hole, rip, weed, smudge, cord, CANVAS };
