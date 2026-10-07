// Annexes des bâtiments (lot 4c) : 21 constructions posées par le joueur sur une case, autour de leur bâtiment, les
// maisons du Foyer (lot 7d), où s'installent les visiteurs, et les 6 annexes de climat (lot 9d).
// Repère : celui de la case (u, v ∈ [-0,5 ; 0,5], ancrage au centre), même projection et même lumière que le reste de
// l'île. Une annexe est faite de calques, comme les articles de la boutique : un cadre serré (images gardées à 4× en
// mémoire), un dessin fixe ou n images d'animation jouées à fps images/s. variant : le n° d'exemplaire (0, 1, 2) d'une
// petite annexe, qui change ce qui y pousse (blé, carottes, citrouilles…).
import { box, gable, sprite, boulder, EDGE } from './iso.js';
import { WOOD, WOOD_DARK, STONE, WALL, BRICK, THATCH, GLASS, SLATE_ROOF, ROOF_RED, BLUE_ROOF, planksLeft, planksRight } from './palette.js';
import { tools, ln, poly, ell, dot, wave, star, bird, bucket, IRON, DARK_IRON, COPPER, STRAW, STUMP, BARN, OUT, f2 } from './shopSprites.js';

const TAU = Math.PI * 2;
const CLAY = { top: '#E8A884', left: '#D58C66', right: '#B06A47' };
const COAL = { top: '#55555C', left: '#36363C', right: '#222227' };
const TEAL_ROOF = { left: '#6FB3AE', right: '#4A8C88', back: '#3E7672' };
const MUD = '#8C6A46';
const SOIL_TOP = '#7A4E30';
const LEAF = '#5FA04A';
const LEAF_LIGHT = '#8FCB6A';
const GLASS_FACES = { top: 'rgba(225,243,255,.5)', left: 'rgba(196,228,246,.42)', right: 'rgba(160,205,232,.5)' };
const GLASS_EDGE = ' stroke="rgba(255,255,255,.85)" stroke-width="0.9" stroke-linejoin="round"';

/* ---------- Petits outils ---------- */
// Losange de sol de demi-côté r (cases), centré sur la case
const patch = (T, r, fill, extra = EDGE) => T.face([[-r, -r, 0], [r, -r, 0], [r, r, 0], [-r, r, 0]], fill, extra);
// Poteau de bois carré, de z0 à z1
const post = (T, du, dv, z0, z1, colors = WOOD_DARK, w = 0.022) => T.box(du - w, dv - w, du + w, dv + w, z0, z1, colors);
// Lisse de clôture entre deux points du sol, à la hauteur z : arête sombre, dessus clair
const rail = (T, a, b, z) => ln(T.p(a[0], a[1], z), T.p(b[0], b[1], z), WOOD_DARK.right, 2.2) + ln(T.p(a[0], a[1], z + 0.6), T.p(b[0], b[1], z + 0.6), WOOD.top, 1);
// Bouffée de fumée
const puff = (x, y, r, o) => `<circle cx="${f2(x)}" cy="${f2(y)}" r="${f2(r)}" fill="rgba(236,232,226,${f2(o)})"/>`;
// Rondin couché le long de v, de v0 à v1 (bout visible en v1), axe à la hauteur z, rayon r (px)
function log(T, du, v0, v1, z, r, wood = STUMP) {
  const a = T.p(du, v0, z);
  const b = T.p(du, v1, z);
  return poly([[a[0], a[1] - r], [b[0], b[1] - r], [b[0], b[1] + r], [a[0], a[1] + r]], WOOD.left, ` stroke="${OUT}" stroke-width="0.6"`)
    + ln([a[0], a[1] - r * 0.45], [b[0], b[1] - r * 0.45], 'rgba(255,255,255,.18)', r * 0.5)
    + ell(b[0], b[1], r * 0.92, r, wood.top, ` stroke="${WOOD.right}" stroke-width="0.7"`)
    + ell(b[0], b[1], r * 0.5, r * 0.55, 'none', ` stroke="rgba(150,92,48,.55)" stroke-width="0.5"`)
    + dot(b[0], b[1], r * 0.14, 'rgba(150,92,48,.7)');
}
// Bout de bûche vu de face (réserve de bois), en pixels
const logEnd = (x, y, r) => `<circle cx="${f2(x)}" cy="${f2(y)}" r="${f2(r)}" fill="${STUMP.top}" stroke="${WOOD.right}" stroke-width="0.6"/>`
  + `<circle cx="${f2(x)}" cy="${f2(y)}" r="${f2(r * 0.5)}" fill="none" stroke="rgba(150,92,48,.45)" stroke-width="0.4"/>`;
// Souche, en (du, dv) : flanc d'écorce, dessus clair et ses cernes
function stumpAt(T, du, dv, h, r, name) {
  const [x, y] = T.p(du, dv, h);
  return T.shadow(du, dv, r * 1.3, 0.2) + T.cyl(du, dv, 0, h, r, { top: STUMP.top, left: '#9A6235', right: '#6E4222' }, name)
    + ell(x, y, r * 18, r * 9, 'none', ` stroke="rgba(150,92,48,.5)" stroke-width="0.5"`);
}
// Petit arbre (pousse) dont le feuillage plie de dx
function sapling(x, y, s, dx = 0) {
  return ln([x, y], [x + dx * 0.4, y - 9 * s], '#7A5A3A', 1.3 * s)
    + `<circle cx="${f2(x + dx + 0.5)}" cy="${f2(y - 11 * s)}" r="${f2(5 * s)}" fill="#4F8F3A"/>`
    + `<circle cx="${f2(x + dx)}" cy="${f2(y - 11.6 * s)}" r="${f2(4.6 * s)}" fill="#7EC45B"/>`
    + `<circle cx="${f2(x + dx - 1.6 * s)}" cy="${f2(y - 13.2 * s)}" r="${f2(2 * s)}" fill="#B3E386"/>`;
}
// Papillon aux ailes ouvertes (open) ou repliées
function butterfly(x, y, open, color) {
  const w = open ? 2.8 : 1;
  return `<ellipse cx="${f2(x - w * 0.6)}" cy="${f2(y)}" rx="${f2(w)}" ry="2.2" fill="${color}" opacity=".92"/>`
    + `<ellipse cx="${f2(x + w * 0.6)}" cy="${f2(y)}" rx="${f2(w)}" ry="2.2" fill="${color}" opacity=".92"/>`
    + ln([x, y - 1.6], [x, y + 1.6], '#3D3A36', 0.7);
}

/* ---------- Bêtes de l'enclos et du vivier ---------- */
function pig(x, y, flip, step) {
  const s = flip ? -1 : 1;
  const X = dx => x + s * dx;
  const legs = [[-3.6, step], [-1.6, -step], [2, -step], [3.8, step]].map(([dx, k]) => ln([X(dx), y - 2.6], [X(dx + k * 0.5), y], '#D88C8E', 1.4)).join('');
  return ell(x, y + 0.4, 6.6, 1.8, 'rgba(40,55,20,.22)') + legs
    + ell(x, y - 4.6, 6.6, 4, '#F4B2B0', ` stroke="${OUT}" stroke-width="0.5"`)
    + ell(x - s * 1, y - 6.2, 4, 1.6, 'rgba(255,255,255,.35)')
    + `<path d="M${f2(X(-6.4))},${f2(y - 5.6)} q${s * -2.2},-1.6 ${s * -1},-3 q${s * 1.4},0.2 ${s * 0.4},1.4" stroke="#D88C8E" stroke-width="0.8" fill="none"/>`
    + dot(X(5.6), y - 5.4, 3.3, '#F4B2B0')
    + `<path d="M${f2(X(4.4))},${f2(y - 8.2)} l${s * 1.6},-2.6 l${s * 1},2.2 Z" fill="#E59496"/>`
    + ell(X(8.2), y - 4.8, 1.6, 1.4, '#E58A8F', ` stroke="${OUT}" stroke-width="0.4"`)
    + dot(X(8), y - 5, 0.35, '#7A3A3E') + dot(X(8.6), y - 4.6, 0.35, '#7A3A3E') + dot(X(6.2), y - 6.4, 0.5, '#2A2024');
}
function sheep(x, y, flip, graze) {
  const s = flip ? -1 : 1;
  const X = dx => x + s * dx;
  const wool = [[-3.6, -5.4, 3], [-0.6, -6.6, 3.4], [2.6, -5.6, 3], [-1.8, -3.8, 2.8], [1.4, -3.8, 2.8]]
    .map(([dx, dy, r]) => `<circle cx="${f2(X(dx))}" cy="${f2(y + dy)}" r="${f2(r)}" fill="#F7F3EA" stroke="rgba(60,40,25,.5)" stroke-width="0.5"/>`).join('');
  const hy = graze ? -1.8 : -6.4;
  return ell(x, y + 0.4, 6, 1.7, 'rgba(40,55,20,.22)')
    + [-3, -1, 1.6, 3.4].map(dx => ln([X(dx), y - 2.4], [X(dx), y], '#3A3234', 1.2)).join('')
    + wool
    + ell(X(5.6), y + hy, 2.1, 2.6, '#3A3234')
    + ell(X(4.6), y + hy - 1.8, 1.4, 0.7, '#3A3234')
    + dot(X(6.4), y + hy - 0.6, 0.45, '#FFFFFF');
}
// Poisson vu de dessus, cap a (radians), corps base et taches spot
function fishTop(x, y, a, base, spot) {
  const c = Math.cos(a), s = Math.sin(a);
  const R = (dx, dy) => [x + dx * c - dy * s * 0.55, y + dx * s * 0.55 + dy * c * 0.55];
  const tail = [R(-4.6, 0), R(-7.2, -2), R(-7.2, 2)];
  return poly(tail, base) + `<ellipse cx="${f2(x)}" cy="${f2(y)}" rx="4.2" ry="1.7" fill="${base}" transform="rotate(${f2((Math.atan2(s * 0.55, c) * 180) / Math.PI)} ${f2(x)} ${f2(y)})"/>`
    + (spot ? `<circle cx="${f2(R(1, 0)[0])}" cy="${f2(R(1, 0)[1])}" r="1.1" fill="${spot}"/><circle cx="${f2(R(-2, 0.4)[0])}" cy="${f2(R(-2, 0.4)[1])}" r="0.9" fill="${spot}"/>` : '');
}

/* ---------- Potager ---------- */
// Champ : un carré de terre labourée en sillons, et ce qui y pousse selon l'exemplaire (blé, carottes, citrouilles)
const CROP_COLS = [-0.31, -0.155, 0, 0.155, 0.31];
const CROP_ROWS = [-0.28, -0.14, 0, 0.14, 0.28];
function crop(kind, x, y, f, n, k) {
  const sway = wave(f, n, 1.5, k * 0.9);
  if (kind === 0) {
    return [-1.4, 0, 1.4].map((o, i) => {
      const tx = x + o + sway * (0.8 + i * 0.15);
      const ty = y - 10.5 - (i === 1 ? 1.4 : 0);
      return ln([x + o * 0.4, y], [tx, ty], '#C9A23E', 0.8)
        + `<ellipse cx="${f2(tx)}" cy="${f2(ty - 1.6)}" rx="1.15" ry="2.7" fill="#EBC85E" stroke="#B68A2E" stroke-width="0.4" transform="rotate(${f2(sway * 6)} ${f2(tx)} ${f2(ty)})"/>`;
    }).join('');
  }
  if (kind === 1) {
    return ell(x, y, 1.7, 0.9, '#F08A3A', ' stroke="#C8622A" stroke-width="0.4"')
      + [-2.2, -0.8, 0.8, 2.2].map((o, i) => `<path d="M${f2(x)},${f2(y - 0.4)} q${f2(o * 0.6 + sway * 0.4)},-3 ${f2(o + sway * 0.6)},-${f2(6.4 + (i % 2) * 1.4)}" stroke="${i % 2 ? LEAF_LIGHT : LEAF}" stroke-width="1.1" fill="none" stroke-linecap="round"/>`).join('');
  }
  // Citrouilles un plant sur deux, feuillage entre elles
  if (k % 2) {
    return `<circle cx="${f2(x - 2)}" cy="${f2(y - 2.4)}" r="2.4" fill="${LEAF}"/><circle cx="${f2(x + 1.8 + sway * 0.3)}" cy="${f2(y - 3)}" r="2.6" fill="${LEAF_LIGHT}"/>`
      + `<path d="M${f2(x - 3)},${f2(y - 1)} q2,-3 5,-1" stroke="#4F8F3A" stroke-width="0.6" fill="none"/>`;
  }
  return ell(x, y + 0.2, 4.6, 1.3, 'rgba(40,55,20,.25)')
    + ell(x, y - 2.6, 4.6, 3.3, '#F08A3A', ' stroke="#C8622A" stroke-width="0.5"')
    + ell(x, y - 2.6, 1.6, 3.2, 'none', ' stroke="rgba(200,98,42,.7)" stroke-width="0.5"')
    + ell(x - 1.6, y - 3.6, 1.4, 0.8, 'rgba(255,255,255,.3)')
    + ln([x, y - 5.6], [x + 1, y - 7.4], '#6A8A3A', 1.2);
}
const champ = {
  layers: [{
    frame: [-34, -30, 68, 48],
    n: 6,
    fps: 3,
    draw: (T, f, n, variant) => {
      const kind = variant % 3;
      let out = patch(T, 0.45, '#8A5A36') + patch(T, 0.41, '#9B6A42', '');
      // Sillons le long de u : creux sombre, crête claire
      for (const dv of CROP_ROWS) out += ln(T.p(-0.4, dv, 0), T.p(0.4, dv, 0), '#6E4528', 2.6) + ln(T.p(-0.4, dv - 0.03, 0.6), T.p(0.4, dv - 0.03, 0.6), '#B07E54', 1);
      // Piquets aux coins avant, ficelle tendue
      out += post(T, 0.44, -0.44, 0, 8, WOOD) + post(T, -0.44, 0.44, 0, 8, WOOD);
      const plants = [];
      CROP_ROWS.forEach((dv, r) => CROP_COLS.forEach((du, c) => plants.push({ du, dv, k: r * 5 + c })));
      plants.sort((a, b) => a.du + a.dv - (b.du + b.dv));
      for (const p of plants) {
        const [x, y] = T.p(p.du, p.dv, 0);
        out += crop(kind, x, y, f, n, p.k);
      }
      return out + post(T, 0.44, 0.44, 0, 8, WOOD) + ln(T.p(0.44, -0.44, 7), T.p(0.44, 0.44, 7), 'rgba(235,225,200,.8)', 0.5)
        + ln(T.p(-0.44, 0.44, 7), T.p(0.44, 0.44, 7), 'rgba(235,225,200,.8)', 0.5);
    }
  }]
};
// Grenier sur ses champignons de pierre, toit de chaume, botte de foin ; un pigeon se pose sur le faîtage
const PIGEON = { body: '#9AA0AE', breast: '#C8B4CA', wing: '#7A8090' };
const grenier = {
  layers: [{
    frame: [-34, -62, 68, 80],
    n: 6,
    fps: 2,
    draw: (T, f) => {
      const staddle = (du, dv) => T.cyl(du, dv, 0, 5, 0.035, STONE, `pad${du}${dv}`) + T.disc(du, dv, 5, 0.065, STONE.top, EDGE);
      const [rx, ry] = T.p(0, 0, 36);
      const pigeon = f >= 1 && f <= 4 ? bird(rx + 3, ry + 1, { ...PIGEON, peck: f === 3 ? 1 : 0, flap: f === 1 ? 1 : 0 }) : '';
      return T.shadow(0, 0, 0.36, 0.2)
        + staddle(-0.2, -0.17) + staddle(0.2, -0.17) + staddle(-0.2, 0.17) + staddle(0.2, 0.17)
        + T.box(-0.27, -0.23, 0.27, 0.23, 6, 25, BARN)
        + planksLeft(T.u - 0.27, T.u + 0.27, T.v + 0.23, 6, 25, 4.2) + planksRight(T.u + 0.27, T.v - 0.23, T.v + 0.23, 6, 25, 4.2)
        // Porte de grange entrouverte, foin qui dépasse
        + T.face([[-0.07, 0.23, 7], [0.09, 0.23, 7], [0.09, 0.23, 20], [-0.07, 0.23, 20]], '#4A2E1A')
        + T.face([[-0.05, 0.23, 7], [0.07, 0.23, 7], [0.07, 0.23, 11], [-0.05, 0.23, 11]], STRAW.left)
        + ln(T.p(-0.07, 0.23, 20), T.p(0.09, 0.23, 7), WALL.top, 1) + ln(T.p(-0.07, 0.23, 7), T.p(0.09, 0.23, 20), WALL.top, 1)
        // Lucarne sur le pignon
        + T.face([[0.27, -0.05, 15], [0.27, 0.05, 15], [0.27, 0.05, 21], [0.27, -0.05, 21]], '#3A2418', ` stroke="${WALL.top}" stroke-width="0.8"`)
        + T.gable(-0.27, -0.23, 0.27, 0.23, 25, 12, { front: THATCH.front, back: THATCH.back, gable: BARN.right }, 0.06)
        + [-0.15, 0, 0.15].map(du => ln(T.p(du, 0.2, 26), T.p(du + 0.03, 0.04, 34), 'rgba(150,105,40,.45)', 0.7)).join('')
        // Échelle et botte de foin
        + ln(T.p(-0.05, 0.27, 0), T.p(-0.05, 0.23, 8), WOOD.right, 1) + ln(T.p(0.05, 0.27, 0), T.p(0.05, 0.23, 8), WOOD.right, 1)
        + T.box(0.18, 0.28, 0.36, 0.4, 0, 7, STRAW) + ln(T.p(0.27, 0.4, 0), T.p(0.27, 0.4, 7), '#9A7A3A', 0.6) + ln(T.p(0.36, 0.34, 0), T.p(0.36, 0.34, 7), '#9A7A3A', 0.6)
        + pigeon;
    }
  }]
};
// Enclos : clôture de bois autour d'une mare de boue, abreuvoir ; un cochon trottine, un mouton broute
const enclos = {
  layers: [{
    frame: [-36, -42, 72, 60],
    n: 8,
    fps: 3,
    draw: (T, f, n) => {
      const R = 0.43;
      const corners = [[-R, -R], [R, -R], [R, R], [-R, R]];
      const sideRails = (a, b) => [a, [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], b].map(p => post(T, p[0], p[1], 0, 11)).join('') + rail(T, a, b, 4.5) + rail(T, a, b, 8.6);
      const back = sideRails(corners[3], corners[0]) + sideRails(corners[0], corners[1]);
      const front = sideRails(corners[1], corners[2]) + sideRails(corners[2], corners[3]);
      const a = (f / n) * TAU;
      const [px, py] = T.p(0.13 + Math.cos(a) * 0.12, 0.12 + Math.sin(a) * 0.08, 0);
      const pigBody = pig(px, py, Math.sin(a) > 0, f % 2 ? 1 : -1);
      const [sx, sy] = T.p(-0.16, -0.12, 0);
      const sheepBody = sheep(sx, sy, false, f % 4 < 2);
      const beasts = Math.sin(a) * 0.08 + 0.12 > -0.12 ? sheepBody + pigBody : pigBody + sheepBody;
      return patch(T, 0.45, '#A9B86A', '') + patch(T, 0.38, '#B79E6E', '')
        + back
        + T.disc(0.16, -0.14, 0, 0.13, MUD) + T.disc(0.14, -0.15, 0.2, 0.06, 'rgba(255,255,255,.18)')
        + T.box(-0.3, 0.12, -0.22, 0.32, 0, 4, WOOD_DARK) + T.face([[-0.29, 0.14, 4], [-0.23, 0.14, 4], [-0.23, 0.3, 4], [-0.29, 0.3, 4]], '#4C9CC8')
        + beasts
        + front;
    }
  }]
};

/* ---------- Carrière ---------- */
// Filon : un rocher veiné de minerai (quartz, cuivre ou cristaux bleus selon l'exemplaire), une pioche, des éclats
const VEINS = [
  { rock: { top: '#DAD7CF', left: '#ADA99F', right: '#86827A' }, vein: '#FFFFFF', ore: '#F4F1E8' },
  { rock: { top: '#D9C3A8', left: '#B49678', right: '#8C6F55' }, vein: '#E8873A', ore: '#F2A35A' },
  { rock: { top: '#BAC1CD', left: '#8F98A7', right: '#6B7383' }, vein: '#7FC7F0', ore: '#B6E6FF' }
];
const filon = {
  layers: [{
    frame: [-34, -40, 68, 56],
    n: 6,
    fps: 4,
    draw: (T, f, n, variant) => {
      const look = VEINS[variant % 3];
      const [x, y] = T.p(-0.04, -0.02, 0);
      // Veines et pépites sur la face avant du gros rocher (dans sa silhouette)
      const veins = [[[-12, -5], [-7, -9], [-2, -7], [2, -11]], [[-6, -2], [-1, -5], [5, -3]], [[4, -8], [9, -6]]]
        .map(pts => `<polyline points="${pts.map(([a, b]) => `${f2(x + a)},${f2(y + b)}`).join(' ')}" fill="none" stroke="${look.vein}" stroke-width="1.2" stroke-linejoin="round" stroke-linecap="round" opacity=".9"/>`).join('');
      const nuggets = [[-7, -9], [3, -4], [-11, -4], [2, -11], [8, -7]].map(([a, b], k) => poly([[x + a, y + b - 1.7], [x + a + 1.7, y + b], [x + a, y + b + 1.5], [x + a - 1.6, y + b]], k % 2 ? look.ore : look.vein, ` stroke="${OUT}" stroke-width="0.3"`)).join('');
      const glints = [[-7, -9], [3, -4], [2, -11], [-11, -4], [8, -7], [-2, -7]];
      const [gx, gy] = glints[f % glints.length];
      return T.shadow(0.02, 0, 0.4, 0.22)
        + boulder(T.u - 0.04, T.v - 0.02, 0.32, 0.28, 17, look.rock, 3 + variant, 0.22, 0.78)
        + veins + nuggets
        + boulder(T.u - 0.06, T.v + 0.32, 0.1, 0.09, 5, look.rock, 7 + variant, 0.25, 0.85)
        // Pioche appuyée sur le flanc droit, éclats au sol
        + ln(T.p(0.4, 0.04, 0), T.p(0.3, -0.06, 15), WOOD.right, 1.8) + ln(T.p(0.4, 0.04, 0.6), T.p(0.3, -0.06, 15.6), WOOD.top, 0.6)
        + `<path d="M${f2(T.p(0.24, -0.04, 13)[0])},${f2(T.p(0.24, -0.04, 13)[1])} Q${f2(T.p(0.3, -0.06, 18)[0])},${f2(T.p(0.3, -0.06, 18)[1] - 2)} ${f2(T.p(0.38, -0.1, 13)[0])},${f2(T.p(0.38, -0.1, 13)[1])}" stroke="${IRON.right}" stroke-width="2" fill="none" stroke-linecap="round"/>`
        + T.pebble(-0.36, 0.26, 0.55, look.rock) + T.pebble(-0.18, 0.38, 0.42, look.rock) + T.pebble(0.06, 0.4, 0.35, look.rock)
        + star(x + gx, y + gy, 2.6 + (f % 2), '#FFFFFF', 0.95);
    }
  }]
};
// Dépôt de pierres : blocs taillés rangés en pyramide sur leur palette, traîneau chargé à côté, ardoise des comptes ;
// un moineau sautille sur le bloc du haut
const depot = {
  layers: [{
    frame: [-34, -50, 68, 68],
    n: 6,
    fps: 2,
    draw: (T, f) => {
      const PALE = { top: '#ECE6D8', left: '#CFC6B2', right: '#A69C88' };
      // un bloc taillé : deux teintes de pierre, une ligne de lit, des traces de ciseau sur le dessus et sur la face
      const block = (du, dv, z, k) => {
        const c = k % 2 ? PALE : STONE;
        const [mx, my] = T.p(du, dv + 0.09, z + 3.2);
        return { d: du + dv + z * 0.001, svg: T.box(du - 0.1, dv - 0.09, du + 0.1, dv + 0.09, z, z + 6.5, c)
          + ln(T.p(du - 0.1, dv + 0.09, z + 3.2), T.p(du + 0.1, dv + 0.09, z + 3.2), 'rgba(120,110,95,.35)', 0.5)
          + ln([mx - 3, my - 1.4], [mx - 1.6, my + 0.4], 'rgba(120,110,95,.45)', 0.5) + ln([mx + 1.4, my - 1], [mx + 2.6, my + 0.6], 'rgba(120,110,95,.45)', 0.5)
          + ln(T.p(du - 0.06, dv - 0.04, z + 6.5), T.p(du + 0.04, dv - 0.06, z + 6.5), 'rgba(255,255,255,.6)', 0.7) };
      };
      const stack = [
        block(-0.11, -0.1, 3, 0), block(0.11, -0.1, 3, 1), block(-0.11, 0.1, 3, 1), block(0.11, 0.1, 3, 0),
        block(0, -0.1, 9.5, 0), block(0, 0.1, 9.5, 1), block(0, 0, 16, 1)
      ].sort((a, b) => a.d - b.d || 0).map(b => b.svg).join('');
      const [bx, by] = T.p(0, 0, 22.5);
      const hop = f === 2 ? 1.6 : 0;
      // l'aire de gravier et ses cailloux
      const [gx, gy] = T.p(0, 0, 0);
      let out = ell(gx, gy + 1, 30, 14, '#D8CFBC', ` stroke="${OUT}" stroke-width="0.5"`) + ell(gx - 4, gy, 20, 8, '#E4DCCB')
        + [[-22, 4, 1.4], [18, 8, 1.2], [-8, 10, 1], [24, -2, 1.1], [-26, -3, 0.9]].map(([dx, dy, r]) => ell(gx + dx, gy + dy, r * 1.4, r, '#A69C88', ` stroke="${OUT}" stroke-width="0.4"`)).join('')
        + T.shadow(0, 0, 0.4, 0.2)
        // l'ardoise des comptes, derrière, et ses bâtons
        + post(T, -0.32, -0.3, 0, 14, WOOD, 0.016) + post(T, -0.18, -0.36, 0, 14, WOOD, 0.016)
        + T.face([[-0.33, -0.31, 8], [-0.17, -0.37, 8], [-0.17, -0.37, 15], [-0.33, -0.31, 15]], '#3D4148', EDGE)
        + [9.6, 11.2, 12.8].map(z => ln(T.p(-0.31, -0.32, z), T.p(-0.22, -0.355, z), 'rgba(255,255,255,.7)', 0.4)).join('')
        + ln(T.p(-0.3, -0.32, 9), T.p(-0.24, -0.345, 13.4), 'rgba(255,255,255,.7)', 0.4)
        // la palette de bois et ses planches
        + T.box(-0.3, -0.26, 0.3, 0.26, 0, 3, WOOD_DARK)
        + [-0.18, 0, 0.18].map(du => ln(T.p(du, 0.26, 3), T.p(du, -0.26, 3), WOOD.top, 0.8)).join('')
        + stack
        + bird(bx + 1, by - hop, { body: '#8B6A4A', breast: '#D8C2A0', wing: '#6E5236', peck: f === 4 ? 1 : 0 });
      // le pic appuyé contre la palette, à gauche
      const [px, py] = T.p(-0.32, 0.2, 0);
      out += ln([px, py], [px + 4, py - 15], WOOD.right, 1.6) + ln([px + 0.6, py - 0.4], [px + 4.4, py - 14.6], WOOD.top, 0.6)
        + `<path d="M${f2(px - 1.6)},${f2(py - 13)} Q${f2(px + 4)},${f2(py - 17.6)} ${f2(px + 10)},${f2(py - 14)} Q${f2(px + 4.4)},${f2(py - 15.4)} ${f2(px - 1.6)},${f2(py - 13)} Z" fill="${IRON}" stroke="${OUT}" stroke-width="0.6"/>`;
      // le traîneau chargé de deux blocs, sanglé, devant à droite ; des éclats de taille
      out += T.box(0.26, 0.2, 0.44, 0.4, 0, 2, WOOD)
        + ln(T.p(0.44, 0.2, 1), T.p(0.48, 0.22, 3), WOOD.right, 1.2) + ln(T.p(0.44, 0.4, 1), T.p(0.48, 0.42, 3), WOOD.right, 1.2)
        + T.box(0.28, 0.22, 0.36, 0.3, 2, 7, STONE) + T.box(0.33, 0.3, 0.42, 0.38, 2, 6, PALE)
        + ln(T.p(0.3, 0.3, 4.4), T.p(0.42, 0.38, 4.2), '#C9A86A', 0.9) + ln(T.p(0.5, 0.3, 3), T.p(0.56, 0.24, 6), '#C9A86A', 0.7)
        + [[0.18, 0.34], [0.08, 0.4], [0.22, 0.44]].map(([du, dv]) => { const [x, y] = T.p(du, dv, 0); return poly([[x - 1.2, y], [x, y - 1.4], [x + 1.4, y - 0.2]], PALE.left, ` stroke="${OUT}" stroke-width="0.4"`); }).join('');
      return out;
    }
  }]
};
// Taille de pierre : établi et maillet, un buste à moitié sorti de son bloc, poussière de taille ; lanterne la nuit
const taille = {
  light: () => [-0.33, -0.3, 25, 14],
  layers: [{
    frame: [-34, -62, 68, 80],
    n: 6,
    fps: 4,
    draw: (T, f, n) => {
      const [bx, by] = T.p(0.18, -0.1, 9);
      const dust = [0, 1, 2].map(k => {
        const p = ((f + k * 2) % n) / n;
        return puff(bx + 6 + k * 2 + p * 4, by - 10 - p * 8, 1.4 + p * 2.4, 0.55 * (1 - p));
      }).join('');
      return patch(T, 0.44, '#E6D8BC', '')
        + T.shadow(0, 0, 0.34, 0.18)
        + post(T, -0.33, -0.3, 0, 24) + ln(T.p(-0.33, -0.3, 24), T.p(-0.33, -0.22, 24), WOOD_DARK.right, 1.2)
        + T.box(-0.37, -0.25, -0.29, -0.19, 17, 23, { top: '#5A606A', left: GLASS, right: '#E9C878' })
        + T.box(-0.34, -0.36, -0.12, -0.18, 0, 7, STONE) + T.box(-0.3, -0.33, -0.18, -0.21, 7, 12, STONE)
        // Établi, maillet et ciseau
        + [[-0.3, 0.04], [0, 0.04], [-0.3, 0.22], [0, 0.22]].map(([a, b]) => post(T, a, b, 0, 10, WOOD_DARK, 0.018)).join('')
        + T.box(-0.32, 0.02, 0.02, 0.24, 10, 12.5, WOOD)
        + ln(T.p(-0.2, 0.12, 13), T.p(-0.08, 0.16, 13), WOOD.right, 1.6) + T.box(-0.24, 0.09, -0.18, 0.15, 12.5, 16, WOOD_DARK)
        + ln(T.p(-0.1, 0.06, 13), T.p(-0.02, 0.1, 13), IRON.right, 1)
        // Buste sur son socle : encore pris dans le bloc en bas, épaules et tête déjà taillées
        + T.box(0.08, -0.2, 0.28, 0, 0, 9, STONE)
        + T.box(0.11, -0.17, 0.25, -0.03, 9, 15, { top: '#EDE7DB', left: '#D6CEBF', right: '#B7AE9D' })
        + `<path d="M${f2(bx - 7)},${f2(by - 6)} C${f2(bx - 7)},${f2(by - 12)} ${f2(bx - 3)},${f2(by - 13)} ${f2(bx)},${f2(by - 13)} C${f2(bx + 3)},${f2(by - 13)} ${f2(bx + 7)},${f2(by - 12)} ${f2(bx + 7)},${f2(by - 6)} Z" fill="#F2EEE6" stroke="${OUT}" stroke-width="0.5"/>`
        + `<rect x="${f2(bx - 1.6)}" y="${f2(by - 16)}" width="3.2" height="4" fill="#E9E3D8"/>`
        + `<ellipse cx="${f2(bx)}" cy="${f2(by - 19.4)}" rx="3.4" ry="4.4" fill="#F7F4EE" stroke="${OUT}" stroke-width="0.5"/>`
        + `<path d="M${f2(bx - 3.4)},${f2(by - 20.4)} q3.4,-5.6 6.8,0 q-1.2,-2 -3.4,-2.2 q-2.2,0.2 -3.4,2.2 Z" fill="#DCD5C8"/>`
        + `<path d="M${f2(bx + 0.6)},${f2(by - 19.6)} l1.2,2 l-1.2,0.3" stroke="#B9B0A0" stroke-width="0.5" fill="none"/>`
        + dot(bx - 1.2, by - 19.8, 0.35, '#9B927F') + dot(bx + 1.6, by - 19.8, 0.35, '#9B927F')
        + ln([bx - 6, by - 7.4], [bx - 4, by - 9.6], 'rgba(155,146,127,.5)', 0.5) + ln([bx + 4.4, by - 9.6], [bx + 6, by - 7.6], 'rgba(155,146,127,.5)', 0.5)
        + dust
        + T.pebble(0.32, 0.18, 0.35, STONE) + T.pebble(0.2, 0.3, 0.3, STONE);
    }
  }]
};

/* ---------- Bosquet ---------- */
// Coupe : selon l'exemplaire, une pile de rondins, des souches et leurs jeunes pousses, ou un chevalet de sciage
const coupe = {
  layers: [{
    frame: [-34, -40, 68, 56],
    n: 6,
    fps: 3,
    draw: (T, f, n, variant) => {
      const kind = variant % 3;
      let out = patch(T, 0.42, '#B5A06A', '') + T.shadow(0, 0, 0.34, 0.16);
      for (const [du, dv] of [[-0.3, 0.22], [0.26, 0.3], [-0.1, -0.32], [0.32, -0.12]]) out += dot(...T.p(du, dv, 0), 0.9, '#E7C08A');
      if (kind === 0) {
        out += log(T, -0.14, -0.26, 0.2, 3.6, 3.6) + log(T, 0.02, -0.26, 0.2, 3.6, 3.6) + log(T, 0.18, -0.26, 0.2, 3.6, 3.6)
          + log(T, -0.06, -0.24, 0.18, 10.4, 3.5) + log(T, 0.1, -0.24, 0.18, 10.4, 3.5) + log(T, 0.02, -0.22, 0.16, 17, 3.4)
          + stumpAt(T, 0.3, 0.28, 5, 0.07, 'st0')
          + ln(T.p(0.3, 0.28, 5), T.p(0.27, 0.32, 14), WOOD.right, 1.4)
          + poly([T.p(0.25, 0.3, 12), T.p(0.31, 0.3, 14), T.p(0.31, 0.3, 10)].map(([a, b]) => [a, b]), IRON.left);
        const hop = f === 2 ? 1.5 : 0;
        const [rx, ry] = T.p(0.02, 0.16, 20.6);
        out += bird(rx - 2, ry - hop, { body: '#8B5A3C', breast: '#E86A3A', wing: '#6E4428', peck: f === 4 ? 1 : 0 });
      } else if (kind === 1) {
        out += stumpAt(T, -0.2, -0.14, 6, 0.09, 'st1') + stumpAt(T, 0.18, -0.2, 4, 0.08, 'st2') + stumpAt(T, 0.06, 0.2, 5, 0.085, 'st3');
        const sway = wave(f, n, 1.4);
        out += sapling(...T.p(-0.24, 0.2, 0), 0.9, sway) + sapling(...T.p(0.28, 0.06, 0), 0.75, wave(f, n, 1.2, 1.7));
      } else {
        // Chevalet en X, rondin dessus, sciure et scie
        const legs = [-0.16, 0.16].map(dv => ln(T.p(-0.12, dv, 0), T.p(0.12, dv, 14), WOOD_DARK.right, 1.6) + ln(T.p(0.12, dv, 0), T.p(-0.12, dv, 14), WOOD_DARK.right, 1.6)).join('');
        out += T.disc(0.18, 0.2, 0, 0.1, '#E9C990') + legs + log(T, 0, -0.3, 0.26, 14, 3.8)
          + poly([T.p(0.24, 0.02, 2), T.p(0.36, -0.08, 2), T.p(0.36, -0.08, 7)], '#C9D0D8', ` stroke="${IRON.right}" stroke-width="0.5"`)
          + dot(...T.p(0.18, 0.22, 2 + (f % 3)), 0.8, '#E7C08A');
      }
      return out;
    }
  }]
};
// Remise à bois : appentis ouvert, bûches rangées en pile, billot et hache ; lanterne pendue au bord du toit
const remise = {
  light: () => [0.22, 0.27, 16, 14],
  layers: [{
    frame: [-36, -60, 72, 78],
    draw: T => {
      let pile = '';
      for (let row = 0; row < 5; row++) {
        for (let k = 0; k < 6; k++) {
          const du = -0.24 + k * 0.095 + (row % 2) * 0.045;
          if (du > 0.27) continue;
          const [x, y] = T.p(du, 0.08, 2.6 + row * 4.4);
          pile += logEnd(x, y, 2.4);
        }
      }
      return T.shadow(0, 0, 0.38, 0.2)
        + T.box(-0.33, -0.3, 0.33, -0.25, 0, 26, WOOD) + planksLeft(T.u - 0.33, T.u + 0.33, T.v - 0.25, 0, 26, 4.6)
        + T.box(-0.33, -0.25, -0.28, 0.2, 0, 24, WOOD)
        + pile
        + post(T, 0.3, 0.24, 0, 31) + post(T, -0.3, 0.24, 0, 31)
        // Toit en appentis, bas derrière, relevé sur le devant ouvert
        + T.face([[-0.38, -0.34, 27], [0.38, -0.34, 27], [0.38, 0.3, 32], [-0.38, 0.3, 32]], '#A9703F', EDGE)
        + [-0.24, -0.08, 0.08, 0.24].map(du => ln(T.p(du, -0.32, 27.2), T.p(du, 0.28, 31.8), 'rgba(90,55,25,.4)', 0.7)).join('')
        + T.face([[0.38, -0.34, 27], [0.38, 0.3, 32], [0.38, 0.3, 30.4], [0.38, -0.34, 25.4]], '#7A4E2C', EDGE)
        + T.face([[-0.38, 0.3, 32], [0.38, 0.3, 32], [0.38, 0.3, 30.4], [-0.38, 0.3, 30.4]], '#8B5A32', EDGE)
        + ln(T.p(0.22, 0.27, 30.4), T.p(0.22, 0.27, 17.6), '#3D3A36', 0.6)
        + T.box(0.2, 0.25, 0.24, 0.29, 13.6, 17.6, { top: '#5A606A', left: GLASS, right: '#E9C878' })
        // Billot, hache et bûches fendues
        + stumpAt(T, 0.24, 0.38, 6, 0.06, 'bil')
        + ln(T.p(0.24, 0.38, 6), T.p(0.21, 0.42, 14), WOOD.right, 1.3)
        + poly([T.p(0.19, 0.4, 12), T.p(0.25, 0.4, 14), T.p(0.25, 0.4, 10)], IRON.left)
        + log(T, 0.06, 0.32, 0.42, 1.8, 1.8) + log(T, -0.06, 0.34, 0.44, 1.8, 1.8);
    }
  }]
};
// Pépinière : petite serre de verre, semis en pots sur leurs étagères, arrosoir ; un reflet glisse sur les vitres,
// une lueur chaude la nuit
const pepiniere = {
  light: () => [0, 0, 12, 20, '255,236,170'],
  layers: [{
    frame: [-36, -60, 72, 78],
    n: 8,
    fps: 3,
    draw: (T, f, n) => {
      const pots = [];
      for (const z of [3, 11]) {
        for (const du of [-0.18, -0.06, 0.06, 0.18]) {
          const [x, y] = T.p(du, -0.08, z);
          pots.push(`<path d="M${f2(x - 2)},${f2(y - 3)} L${f2(x - 1.5)},${f2(y)} L${f2(x + 1.5)},${f2(y)} L${f2(x + 2)},${f2(y - 3)} Z" fill="#D9844E" stroke="${OUT}" stroke-width="0.4"/>`
            + `<circle cx="${f2(x)}" cy="${f2(y - 5)}" r="2.1" fill="${(du * 10) % 2 ? LEAF_LIGHT : LEAF}"/><circle cx="${f2(x - 1)}" cy="${f2(y - 5.6)}" r="0.9" fill="#B3E386"/>`);
        }
      }
      const g = (f / n) * 1.4 - 0.2;
      const glint = g > 0 && g < 1 ? T.face([[-0.28 + g * 0.5, 0.26, 2], [-0.22 + g * 0.5, 0.26, 2], [-0.12 + g * 0.5, 0.26, 21], [-0.18 + g * 0.5, 0.26, 21]], 'rgba(255,255,255,.55)') : '';
      return T.shadow(0, 0, 0.38, 0.18)
        + T.box(-0.3, -0.26, 0.3, 0.26, 0, 3, STONE)
        // Étagères et semis (vus à travers le verre)
        + T.box(-0.25, -0.16, 0.25, -0.02, 9, 10.5, WOOD)
        + pots.join('')
        + box(T.u - 0.3, T.v - 0.26, T.u + 0.3, T.v + 0.26, 3, 22, GLASS_FACES, GLASS_EDGE)
        + [-0.1, 0.1].map(du => ln(T.p(du, 0.26, 3), T.p(du, 0.26, 22), 'rgba(255,255,255,.85)', 0.9)).join('')
        + ln(T.p(0.3, 0, 3), T.p(0.3, 0, 22), 'rgba(255,255,255,.85)', 0.9)
        + glint
        + gable(T.u - 0.3, T.v - 0.26, T.u + 0.3, T.v + 0.26, 22, 10, { front: 'rgba(210,236,252,.55)', back: 'rgba(180,215,238,.6)', gable: 'rgba(160,205,232,.5)' }, 0.03, GLASS_EDGE)
        + T.face([[-0.05, 0.26, 3], [0.06, 0.26, 3], [0.06, 0.26, 16], [-0.05, 0.26, 16]], 'rgba(160,205,232,.35)', GLASS_EDGE)
        // Arrosoir et pots devant
        + bucket(T, 0.34, 0.32, 0, 6, 3, 3.6, { top: '#9ACB8A', left: '#7DB46E', right: '#5D9A50' }, 'arr', false)
        + ln(T.p(0.3, 0.3, 5), T.p(0.22, 0.34, 9), '#5D9A50', 1.1)
        + [[-0.22, 0.36], [-0.32, 0.3]].map(([a, b]) => { const [x, y] = T.p(a, b, 0); return `<path d="M${f2(x - 2.4)},${f2(y - 3.4)} L${f2(x - 1.8)},${f2(y)} L${f2(x + 1.8)},${f2(y)} L${f2(x + 2.4)},${f2(y - 3.4)} Z" fill="#D9844E" stroke="${OUT}" stroke-width="0.4"/>${sapling(x, y - 3, 0.45, wave(f, n, 0.6, a * 9))}`; }).join('');
    }
  }]
};

/* ---------- Puits ---------- */
// Citerne : tonneau sur son chevalet, cuve de pierre et sa pompe, ou réservoir de cuivre ; l'eau goutte dans le seau
const citerne = {
  layers: [{
    frame: [-30, -62, 60, 78],
    n: 6,
    fps: 6,
    draw: (T, f, n, variant) => {
      const kind = variant % 3;
      let out = T.shadow(0, 0, 0.32, 0.2);
      let spout;
      if (kind === 0) {
        out += [[-0.14, -0.14], [0.14, -0.14], [-0.14, 0.14], [0.14, 0.14]].map(([a, b]) => post(T, a, b, 0, 12, WOOD_DARK, 0.02)).join('')
          + T.box(-0.17, -0.17, 0.17, 0.17, 12, 14, WOOD)
          + T.cyl(0, 0, 14, 38, 0.2, { top: '#C99560', left: WOOD.left, right: WOOD.right }, 'tonneau')
          + [17, 26, 35].map(z => { const [x, y] = T.p(0, 0, z); return `<path d="M${f2(x - 9)},${f2(y)} A9,4.5 0 0 0 ${f2(x + 9)},${f2(y)}" stroke="${DARK_IRON.right}" stroke-width="1.2" fill="none"/>`; }).join('');
        spout = T.p(0.1, 0.18, 16);
        out += ln(T.p(0.06, 0.12, 17), spout, IRON.right, 1.6);
      } else if (kind === 1) {
        out += T.cyl(0, -0.04, 0, 16, 0.24, STONE, 'cuve') + T.disc(0, -0.04, 16, 0.2, WOOD.top, EDGE)
          + ln(T.p(-0.12, -0.04, 16.4), T.p(0.12, -0.04, 16.4), WOOD.right, 0.8)
          + T.box(0.12, 0.1, 0.18, 0.16, 0, 26, IRON) + ln(T.p(0.15, 0.13, 26), T.p(0.02, 0.2, 32), IRON.right, 1.4);
        spout = T.p(0.15, 0.2, 18);
        out += ln(T.p(0.15, 0.15, 19), spout, IRON.right, 1.8);
      } else {
        const [dx0, dy0] = T.p(0, -0.02, 26);
        out += T.box(-0.24, -0.24, 0.22, 0.2, 0, 4, STONE)
          + T.cyl(0, -0.02, 4, 26, 0.23, COPPER, 'cuivre')
          + [9, 18].map(z => { const [x, y] = T.p(0, -0.02, z); return `<path d="M${f2(x - 10.4)},${f2(y)} A10.4,5.2 0 0 0 ${f2(x + 10.4)},${f2(y)}" stroke="#8A4A22" stroke-width="0.6" fill="none"/>` + [-7, 0, 7].map(dx => dot(x + dx, y + 4.6 - Math.abs(dx) * 0.3, 0.6, '#8A4A22')).join(''); }).join('')
          + `<path d="M${f2(dx0 - 10.4)},${f2(dy0)} C${f2(dx0 - 10.4)},${f2(dy0 - 10)} ${f2(dx0 + 10.4)},${f2(dy0 - 10)} ${f2(dx0 + 10.4)},${f2(dy0)} A10.4,5.2 0 0 1 ${f2(dx0 - 10.4)},${f2(dy0)} Z" fill="${COPPER.top}" stroke="${OUT}" stroke-width="0.5"/>`
          + ell(dx0 - 3, dy0 - 5, 3, 1.4, 'rgba(255,255,255,.35)') + T.cyl(0, -0.02, 33, 36, 0.03, COPPER, 'bouchon');
        spout = T.p(0.1, 0.17, 10);
        out += ln(T.p(0.06, 0.12, 11), spout, COPPER.right, 1.8);
      }
      // Seau sous le bec, gouttes qui tombent, rond dans l'eau
      const [bx, by] = T.p(0.2, 0.3, 0);
      out += bucket(T, 0.2, 0.3, 0, 7, 3.4, 4.2, { top: '#B98552', left: WOOD.left, right: WOOD.right }, 'seau');
      const p = (f % n) / n;
      out += dot(spout[0] + 0.5, spout[1] + 1 + p * (by - 7 - spout[1]), 1, '#7FC2EA');
      if (f % 3 === 0) out += ell(bx, by - 6.6, 2.4, 0.9, 'none', ' stroke="rgba(255,255,255,.75)" stroke-width="0.5"');
      return out;
    }
  }]
};
// Réservoir : cuve de pierre ronde sur quatre piliers, eau qui miroite, échelle ; le trop-plein coule dans un bac
const reservoir = {
  layers: [{
    frame: [-32, -78, 64, 96],
    n: 6,
    fps: 3,
    draw: (T, f, n) => {
      const [wx, wy] = T.p(0, 0, 47);
      const shimmer = [0, 1, 2].map(k => {
        const a = (f / n) * TAU + k * 2.1;
        return ell(wx + Math.cos(a) * 6, wy + Math.sin(a) * 2, 2.6, 0.7, 'rgba(255,255,255,.6)');
      }).join('');
      return T.shadow(0, 0, 0.36, 0.2)
        + [[-0.17, -0.15], [0.17, -0.15], [-0.17, 0.15], [0.17, 0.15]].map(([a, b]) => T.box(a - 0.04, b - 0.04, a + 0.04, b + 0.04, 0, 23, STONE)).join('')
        + T.box(-0.24, -0.22, 0.24, 0.22, 23, 26, STONE)
        + T.cyl(0, 0, 26, 47, 0.27, STONE, 'cuve-r')
        + [32, 38, 44].map(z => { const [x, y] = T.p(0, 0, z); return `<path d="M${f2(x - 12.2)},${f2(y)} A12.2,6.1 0 0 0 ${f2(x + 12.2)},${f2(y)}" stroke="rgba(120,110,95,.4)" stroke-width="0.6" fill="none"/>`; }).join('')
        + ell(wx, wy, 10.6, 5.3, '#4C9CC8') + shimmer
        // Échelle sur le devant
        + ln(T.p(-0.1, 0.3, 0), T.p(-0.1, 0.27, 47), WOOD.right, 1) + ln(T.p(0.02, 0.3, 0), T.p(0.02, 0.27, 47), WOOD.right, 1)
        + [6, 14, 22, 30, 38].map(z => ln(T.p(-0.1, 0.3 - z * 0.0006, z), T.p(0.02, 0.3 - z * 0.0006, z), WOOD.top, 0.8)).join('')
        // Trop-plein et bac
        + ln(T.p(0.26, 0.05, 30), T.p(0.36, 0.1, 30), IRON.right, 1.6)
        + T.box(0.26, 0.04, 0.42, 0.26, 0, 4, WOOD_DARK) + T.face([[0.28, 0.06, 4], [0.4, 0.06, 4], [0.4, 0.24, 4], [0.28, 0.24, 4]], '#4C9CC8')
        + dot(...T.p(0.36, 0.1, 29 - ((f % n) / n) * 24), 1, '#7FC2EA');
    }
  }]
};
// Éolienne de pompage : pylône de bois croisé, roue à pales qui tourne au vent, gouvernail ; la tige pompe l'eau
// dans l'abreuvoir
const eolienne = {
  layers: [{
    frame: [-34, -108, 68, 126],
    n: 8,
    fps: 8,
    draw: (T, f, n) => {
      const top = 64;
      const legs = [[-0.2, -0.2], [0.2, -0.2], [-0.2, 0.2], [0.2, 0.2]];
      let tower = legs.map(([a, b]) => ln(T.p(a, b, 0), T.p(a * 0.25, b * 0.25, top), WOOD_DARK.right, 1.6)).join('');
      for (const z of [12, 26, 40, 52]) {
        const k = 1 - (z / top) * 0.75;
        const ring = legs.map(([a, b]) => T.p(a * k, b * k, z));
        tower += ln(ring[0], ring[1], WOOD.left, 0.9) + ln(ring[1], ring[3], WOOD.left, 0.9) + ln(ring[3], ring[2], WOOD.left, 0.9);
      }
      const [hx, hy] = T.p(0.02, 0.08, top + 6);
      const turn = (f / n) * (TAU / 12);
      let blades = '';
      for (let k = 0; k < 12; k++) {
        const a = turn + (k / 12) * TAU;
        const pt = (r, da) => [hx + Math.cos(a + da) * r * 0.82, hy + Math.sin(a + da) * r];
        blades += poly([pt(4, -0.12), pt(19, -0.16), pt(19, 0.16), pt(4, 0.12)], k % 2 ? '#F4ECDC' : '#E2574C', ` stroke="${OUT}" stroke-width="0.4"`);
      }
      return T.shadow(0, 0, 0.38, 0.18)
        + T.box(-0.32, 0.12, -0.04, 0.34, 0, 4, WOOD_DARK) + T.face([[-0.3, 0.14, 4], [-0.06, 0.14, 4], [-0.06, 0.32, 4], [-0.3, 0.32, 4]], '#4C9CC8')
        + tower
        + ln(T.p(0, 0, 4), T.p(0, 0, top), IRON.right, 0.9) + ln(T.p(0, 0, 6), T.p(-0.16, 0.2, 6), IRON.right, 1.4)
        + T.box(-0.05, -0.05, 0.05, 0.05, top, top + 3, WOOD)
        // Gouvernail derrière la roue
        + poly([T.p(-0.02, -0.04, top + 7), T.p(-0.3, -0.34, top + 12), T.p(-0.3, -0.34, top + 2)], '#F4ECDC', ` stroke="${OUT}" stroke-width="0.5"`)
        + ln(T.p(0, 0, top + 6), T.p(-0.24, -0.28, top + 7), WOOD_DARK.right, 1.2)
        + `<circle cx="${f2(hx)}" cy="${f2(hy)}" r="19.5" fill="none" stroke="rgba(60,40,25,.5)" stroke-width="0.6" transform="matrix(0.82 0 0 1 ${f2(hx * 0.18)} 0)"/>`
        + blades
        + dot(hx, hy, 2.2, DARK_IRON.right);
    }
  }]
};

/* ---------- Ponton ---------- */
// Vivier : bassin rond bordé de pierres, carpes (orange, argent ou bleu-or selon l'exemplaire) qui tournent, nénuphar
const FISH = [['#F08A3A', '#FFFFFF'], ['#C7D0DA', '#8E9AA8'], ['#5A8FD8', '#F2C04B']];
const vivier = {
  layers: [{
    frame: [-34, -30, 68, 48],
    n: 8,
    fps: 4,
    draw: (T, f, n, variant) => {
      const [base, spot] = FISH[variant % 3];
      const [cx, cy] = T.p(0, 0, 0);
      let rim = '';
      for (let k = 0; k < 14; k++) {
        const a = (k / 14) * TAU;
        const [x, y] = [cx + Math.cos(a) * 21, cy + Math.sin(a) * 10.6];
        rim += ell(x, y, 3.6, 2.4, k % 2 ? STONE.left : STONE.top, ` stroke="${OUT}" stroke-width="0.4"`);
      }
      const fish = [0, 1, 2].map(k => {
        const a = (f / n) * TAU + (k * TAU) / 3;
        return fishTop(cx + Math.cos(a) * 10, cy + Math.sin(a) * 4.6, a + Math.PI / 2, base, k === 1 ? null : spot);
      }).join('');
      const ripple = ell(cx + Math.cos((f / n) * TAU) * 10, cy + Math.sin((f / n) * TAU) * 4.6, 3 + (f % 2), 1.2, 'none', ' stroke="rgba(255,255,255,.5)" stroke-width="0.5"');
      return ell(cx + 1, cy + 1.2, 24, 12.4, 'rgba(40,55,20,.2)')
        + ell(cx, cy, 21, 10.6, '#3E86B5') + ell(cx - 2, cy - 1, 17, 7.6, '#5FAFD6')
        + fish + ripple
        + ell(cx + 9, cy - 3, 4, 2, '#5FA04A') + poly([[cx + 9, cy - 3], [cx + 13, cy - 3.6], [cx + 12.6, cy - 2.2]], '#3E86B5') + dot(cx + 8, cy - 4, 1.2, '#F6A8C8')
        + rim
        + [-2, 0, 2].map(k => ln([cx - 17 + k, cy - 6], [cx - 17 + k * 1.6, cy - 16 - (k ? 0 : 3)], k ? LEAF_LIGHT : LEAF, 0.9)).join('')
        + ell(cx - 17, cy - 18, 0.9, 2.2, '#7A4E2C');
    }
  }]
};
// Fumoir : cabane de planches, poissons pendus à sécher sur le côté ; la fumée monte du lanterneau, les braises
// rougeoient la nuit
const fumoir = {
  light: () => [0, 0.2, 5, 11, '255,140,70'],
  layers: [{
    frame: [-34, -82, 68, 100],
    n: 8,
    fps: 3,
    draw: (T, f, n) => {
      const [vx, vy] = T.p(-0.01, 0, 39);
      const smoke = [0, 1, 2].map(k => {
        const p = ((f + k * (n / 3)) % n) / n;
        return puff(vx - 2 + p * 6 + Math.sin(p * 6 + k) * 2, vy - 4 - p * 26, 2.6 + p * 4.6, 0.7 * (1 - p));
      }).join('');
      const fish = [-0.1, 0, 0.1].map(dv => {
        const [x, y] = T.p(0.36, dv, 16);
        return ln([x, y], [x, y + 2], '#8A6A40', 0.5) + `<path d="M${f2(x)},${f2(y + 2)} q2.4,4 0,8.4 q-2.4,-4.4 0,-8.4 Z" fill="#C7D0DA" stroke="#7E8A98" stroke-width="0.4"/>` + poly([[x, y + 10], [x - 1.8, y + 12.6], [x + 1.8, y + 12.6]], '#AEB8C4');
      }).join('');
      return T.shadow(0, 0, 0.38, 0.2)
        + T.box(-0.24, -0.22, 0.18, 0.2, 0, 22, WOOD_DARK)
        + planksLeft(T.u - 0.24, T.u + 0.18, T.v + 0.2, 0, 22, 4) + planksRight(T.u + 0.18, T.v - 0.22, T.v + 0.2, 0, 22, 4)
        + T.face([[-0.06, 0.2, 0], [0.06, 0.2, 0], [0.06, 0.2, 14], [-0.06, 0.2, 14]], '#2E1E14')
        + T.face([[-0.04, 0.2, 1], [0.04, 0.2, 1], [0.04, 0.2, 4], [-0.04, 0.2, 4]], f % 2 ? '#FF9A4A' : '#E8743A')
        + T.gable(-0.24, -0.22, 0.18, 0.2, 22, 11, { front: SLATE_ROOF.front, back: SLATE_ROOF.back, gable: WOOD_DARK.right }, 0.05)
        // Lanterneau sur le faîtage
        + T.box(-0.06, -0.05, 0.04, 0.05, 31, 37, WOOD_DARK) + T.gable(-0.06, -0.05, 0.04, 0.05, 37, 3, { front: SLATE_ROOF.front, back: SLATE_ROOF.back, gable: WOOD_DARK.right }, 0.03)
        // Séchoir à poissons sur le côté
        + post(T, 0.36, -0.18, 0, 20, WOOD, 0.018) + post(T, 0.36, 0.18, 0, 20, WOOD, 0.018)
        + ln(T.p(0.36, -0.18, 19), T.p(0.36, 0.18, 19), WOOD.right, 1.4)
        + fish
        + smoke;
    }
  }]
};
// Parc à huîtres : tables de bois sur le sable, poches d'huîtres, panier d'huîtres ouvertes ; une perle brille
const huitres = {
  layers: [{
    frame: [-34, -34, 68, 50],
    n: 6,
    fps: 3,
    draw: (T, f) => {
      const table = dv => [[-0.32, dv - 0.08], [0.32, dv - 0.08], [-0.32, dv + 0.08], [0.32, dv + 0.08]].map(([a, b]) => post(T, a, b, 0, 8, WOOD_DARK, 0.015)).join('')
        + T.box(-0.34, dv - 0.1, 0.34, dv + 0.1, 8, 9, WOOD)
        + [-0.22, 0, 0.22].map(du => T.box(du - 0.09, dv - 0.07, du + 0.09, dv + 0.07, 9, 11, { top: '#8FA58C', left: '#6F876E', right: '#566C56' })
          + ln(T.p(du - 0.09, dv - 0.035, 11), T.p(du + 0.09, dv - 0.035, 11), 'rgba(255,255,255,.35)', 0.4)
          + ln(T.p(du - 0.09, dv + 0.035, 11), T.p(du + 0.09, dv + 0.035, 11), 'rgba(255,255,255,.35)', 0.4)
          + ln(T.p(du, dv - 0.07, 11), T.p(du, dv + 0.07, 11), 'rgba(255,255,255,.35)', 0.4)).join('');
      const [bx, by] = T.p(0.22, 0.34, 0);
      const shells = [[-3, -4.4], [1, -5], [3.4, -3.6], [-0.6, -3]].map(([a, b]) => ell(bx + a, by + b, 2.2, 1.3, '#9AA2A8', ` stroke="${OUT}" stroke-width="0.3"`) + ell(bx + a, by + b - 0.2, 1.4, 0.7, '#F1EEE6')).join('');
      return patch(T, 0.45, '#EAD7A8', '') + T.shadow(0, 0, 0.36, 0.14)
        + table(-0.18) + table(0.12)
        + ell(bx, by - 1.6, 5.6, 2.6, '#B08850', ` stroke="#7A5A30" stroke-width="0.5"`) + ell(bx, by - 3.2, 5, 2.2, '#C9A06A')
        + shells + dot(bx + 1, by - 5.2, 0.9, '#FFFFFF')
        + (f % 3 === 0 ? star(bx + 1, by - 5.4, 3.2, '#FFFFFF', 0.95) : '')
        + [[-0.36, 0.3], [-0.24, 0.4]].map(([a, b]) => { const [x, y] = T.p(a, b, 0); return `<path d="M${f2(x)},${f2(y)} q-2,-3 -0.6,-6 M${f2(x)},${f2(y)} q2,-2.4 1.4,-5" stroke="#6E9C5A" stroke-width="0.9" fill="none"/>`; }).join('');
    }
  }]
};

/* ---------- Foyer ---------- */
// Jardin d'herbes : carré surélevé de lavande, basilic, romarin et thym, son petit écriteau ; deux papillons
const jardin = {
  layers: [{
    frame: [-32, -48, 64, 64],
    n: 8,
    fps: 6,
    draw: (T, f, n) => {
      const herbs = [];
      for (const [du, dv, kind] of [[-0.22, -0.1, 0], [-0.08, -0.1, 1], [0.08, -0.1, 2], [0.22, -0.1, 3], [-0.22, 0.08, 1], [-0.08, 0.08, 3], [0.08, 0.08, 0], [0.22, 0.08, 2]]) {
        const [x, y] = T.p(du, dv, 9);
        if (kind === 0) herbs.push([-1.6, 0, 1.6].map(o => ln([x + o * 0.5, y], [x + o, y - 7], '#6FA35A', 0.7) + ell(x + o, y - 8, 0.9, 2.2, '#A98ADB')).join(''));
        else if (kind === 1) herbs.push(`<circle cx="${f2(x - 1.4)}" cy="${f2(y - 2)}" r="2.2" fill="${LEAF}"/><circle cx="${f2(x + 1.4)}" cy="${f2(y - 2.4)}" r="2.2" fill="${LEAF_LIGHT}"/><circle cx="${f2(x)}" cy="${f2(y - 3.6)}" r="1.8" fill="#9ED87A"/>`);
        else if (kind === 2) herbs.push([-2, -0.7, 0.7, 2].map(o => ln([x, y], [x + o, y - 6.4], '#3F6E3A', 0.8)).join(''));
        else herbs.push(`<ellipse cx="${f2(x)}" cy="${f2(y - 1.6)}" rx="3" ry="1.8" fill="#7AA866"/>` + [-1.4, 0, 1.4].map(o => dot(x + o, y - 2.6, 0.5, '#E6D2F2')).join(''));
      }
      const fly = k => {
        const a = (f / n) * TAU + k * 2.6;
        const [x, y] = T.p(Math.cos(a) * 0.22, Math.sin(a) * 0.16, 20 + Math.sin(a * 2) * 4);
        return butterfly(x, y, (f + k) % 2 === 0, k ? '#F2C04B' : '#F6A8C8');
      };
      const [sx, sy] = T.p(0.34, 0.26, 0);
      return T.shadow(0, 0, 0.36, 0.2)
        + T.box(-0.32, -0.2, 0.32, 0.2, 0, 9, WOOD) + planksLeft(T.u - 0.32, T.u + 0.32, T.v + 0.2, 0, 9, 4.5)
        + T.face([[-0.29, -0.17, 9], [0.29, -0.17, 9], [0.29, 0.17, 9], [-0.29, 0.17, 9]], SOIL_TOP)
        + herbs.join('')
        + ln([sx, sy], [sx, sy - 12], WOOD.right, 1.2) + poly([[sx - 5, sy - 15], [sx + 5, sy - 13], [sx + 5, sy - 9], [sx - 5, sy - 11]], WALL.top, ` stroke="${OUT}" stroke-width="0.5"`)
        + ln([sx - 3, sy - 12.4], [sx + 3, sy - 11], '#6FA35A', 0.8)
        + fly(0) + fly(1);
    }
  }]
};
// Four à pain : socle de pierre, coupole d'argile, gueule où dansent les flammes, cheminée qui fume ; pains sur leur
// planche, bûches à côté
const four = {
  light: () => [-0.04, 0.24, 13, 17, '255,150,70', true],
  layers: [{
    frame: [-34, -70, 68, 88],
    n: 6,
    fps: 6,
    draw: (T, f, n) => {
      const [cx, cy] = T.p(0, -0.02, 9);
      const dome = `<path d="M${f2(cx - 17)},${f2(cy)} C${f2(cx - 17)},${f2(cy - 24)} ${f2(cx + 17)},${f2(cy - 24)} ${f2(cx + 17)},${f2(cy)} A17,8.5 0 0 1 ${f2(cx - 17)},${f2(cy)} Z" fill="url(#${T.id('dome')})" stroke="${OUT}" stroke-width="0.6"/>`;
      const [mx, my] = T.p(-0.04, 0.2, 9);
      const flick = [0.8, 1, 0.9, 1.1, 0.85, 1][f];
      const [chx, chy] = T.p(0.08, -0.12, 27);
      const smoke = [0, 1].map(k => {
        const p = ((f + k * 3) % n) / n;
        return puff(chx + p * 5, chy - 6 - p * 18, 2 + p * 3.6, 0.6 * (1 - p));
      }).join('');
      return T.shadow(0, 0, 0.38, 0.2)
        + `<defs><radialGradient id="${T.id('dome')}" cx="0.35" cy="0.3" r="0.8"><stop offset="0" stop-color="${CLAY.top}"/><stop offset="0.6" stop-color="${CLAY.left}"/><stop offset="1" stop-color="${CLAY.right}"/></radialGradient></defs>`
        + T.box(-0.3, -0.26, 0.3, 0.26, 0, 9, STONE)
        + ln(T.p(-0.3, 0.26, 4.5), T.p(0.3, 0.26, 4.5), 'rgba(120,110,95,.4)', 0.6) + ln(T.p(0.3, -0.26, 4.5), T.p(0.3, 0.26, 4.5), 'rgba(120,110,95,.4)', 0.6)
        + T.cyl(0.08, -0.12, 18, 30, 0.045, BRICK, 'chem')
        + dome
        + `<path d="M${f2(mx - 6)},${f2(my)} L${f2(mx - 6)},${f2(my - 6)} A6,6 0 0 1 ${f2(mx + 6)},${f2(my - 6)} L${f2(mx + 6)},${f2(my)} Z" fill="#2E1A10"/>`
        + ell(mx, my - 2.6, 4.6 * flick, 3 * flick, '#F2862A') + ell(mx, my - 2, 3 * flick, 1.8 * flick, '#FFD24E')
        + smoke
        // Pains sur leur planche, bûches
        + T.box(-0.32, 0.28, -0.08, 0.4, 0, 2, WOOD)
        + [-0.26, -0.15].map(du => { const [x, y] = T.p(du, 0.34, 2); return ell(x, y - 2, 4, 2.4, '#D8A050', ` stroke="#9A6A2E" stroke-width="0.4"`) + ln([x - 2, y - 2.6], [x + 1, y - 3.4], '#F2D28A', 0.6) + ln([x - 0.4, y - 1.8], [x + 2.4, y - 2.6], '#F2D28A', 0.6); }).join('')
        + log(T, 0.3, 0.14, 0.32, 2.2, 2.2) + log(T, 0.36, 0.1, 0.3, 2.2, 2.2) + log(T, 0.33, 0.12, 0.31, 6.2, 2.2);
    }
  }]
};
// Belvédère : kiosque rond sur sa terrasse de pierre, toit hexagonal, banc ; un fanion flotte au sommet, une lanterne
// éclaire la nuit
const belvedere = {
  light: () => [0, 0, 29, 15],
  layers: [{
    frame: [-38, -92, 76, 110],
    n: 6,
    fps: 4,
    draw: (T, f, n) => {
      const pts = Array.from({ length: 6 }, (_, k) => {
        const a = (k / 6) * TAU + TAU / 12;
        return [Math.cos(a) * 0.27, Math.sin(a) * 0.27];
      });
      const back = pts.filter(([a, b]) => a + b < 0);
      const front = pts.filter(([a, b]) => a + b >= 0);
      const column = ([a, b]) => T.box(a - 0.018, b - 0.018, a + 0.018, b + 0.018, 5, 32, { top: '#FFFFFF', left: '#F4F0E8', right: '#D6CFC2' });
      const eave = pts.map(([a, b]) => [a * 1.3, b * 1.3, 32]);
      const apex = [0, 0, 50];
      let roof = '';
      for (let k = 0; k < 6; k++) {
        const p = eave[k], q = eave[(k + 1) % 6];
        const nu = (p[0] + q[0]) / 2, nv = (p[1] + q[1]) / 2;
        if (nu + nv <= 0) continue;
        roof += T.face([p, q, apex], nu > nv ? TEAL_ROOF.right : TEAL_ROOF.left, EDGE);
      }
      const [tx, ty] = T.p(0, 0, 56);
      return T.shadow(0, 0, 0.42, 0.18)
        + T.cyl(0, 0, 0, 5, 0.36, STONE, 'terrasse')
        + back.map(column).join('')
        + T.box(-0.12, -0.04, 0.12, 0.04, 5, 9, WOOD) + T.box(-0.12, -0.06, 0.12, -0.04, 9, 14, WOOD)
        + front.map(column).join('')
        + roof
        + ln(T.p(0, 0, 50), [tx, ty], DARK_IRON.right, 1)
        + poly([[tx, ty], [tx + 9, ty + 1.8 + wave(f, n, 1.2)], [tx + 0.4, ty + 4]], '#E2574C')
        + ln(T.p(0, 0, 32), T.p(0, 0, 30), '#3D3A36', 0.5) + T.box(-0.02, -0.02, 0.02, 0.02, 26, 30, { top: '#5A606A', left: GLASS, right: '#E9C878' });
    }
  }]
};

/* ---------- Atelier ---------- */
// Monticule de charbon en morceaux : dôme sombre, puis des gaillettes à facettes, des plus hautes aux plus basses
function coalPile(x, y) {
  let lumps = '';
  for (let k = 0; k < 26; k++) {
    const a = ((k * 137.5) % 360) * (Math.PI / 180);
    const r = Math.sqrt((k + 0.5) / 26);
    const lx = x + Math.cos(a) * r * 15;
    const ly = y - 3 + Math.sin(a) * r * 6 - (1 - r) * 9;
    const s = 2.2 + ((k * 7) % 5) * 0.35;
    lumps += poly([[lx - s, ly], [lx - s * 0.3, ly - s * 0.8], [lx + s, ly - s * 0.3], [lx + s * 0.4, ly + s * 0.6]], k % 3 ? COAL.left : COAL.right, ` stroke="${OUT}" stroke-width="0.3"`)
      + poly([[lx - s * 0.6, ly - s * 0.2], [lx - s * 0.2, ly - s * 0.75], [lx + s * 0.6, ly - s * 0.35]], COAL.top);
  }
  return `<path d="M${f2(x - 18)},${f2(y)} C${f2(x - 16)},${f2(y - 14)} ${f2(x + 16)},${f2(y - 14)} ${f2(x + 18)},${f2(y)} A18,7 0 0 1 ${f2(x - 18)},${f2(y)} Z" fill="${COAL.right}"/>` + lumps;
}
// Tas de charbon : monticule noir aux éclats bleutés, pelle plantée, sac de jute ; des braises rougeoient à sa base
const charbon = {
  light: () => [0, 0.1, 3, 12, '255,110,50'],
  layers: [{
    frame: [-32, -42, 64, 58],
    n: 6,
    fps: 4,
    draw: (T, f) => {
      const [x, y] = T.p(0, 0, 0);
      const glints = [[-6, -8], [3, -12], [8, -5], [-10, -3], [1, -6]].map(([a, b], k) => dot(x + a, y + b, 0.6, k % 2 ? '#C6D4EA' : '#FFFFFF')).join('');
      const embers = [[-12, 2], [6, 4], [12, 0], [-4, 5]].map(([a, b], k) => ((f + k) % 3 === 0 ? dot(x + a, y + b, 1, '#FF8A3A') : '')).join('');
      return T.shadow(0, 0, 0.38, 0.22)
        + coalPile(x, y)
        + glints + embers
        + ln(T.p(-0.2, 0.06, 0), T.p(-0.14, 0.02, 20), WOOD.right, 1.6)
        + poly([T.p(-0.23, 0.08, 1), T.p(-0.17, 0.08, 1), T.p(-0.19, 0.06, 7), T.p(-0.25, 0.06, 7)], IRON.left, ` stroke="${OUT}" stroke-width="0.5"`)
        + (() => {
          const [sx, sy] = T.p(0.32, 0.12, 0);
          return ell(sx + 1, sy + 0.4, 6, 1.8, 'rgba(40,55,20,.22)')
            + `<path d="M${f2(sx - 5.4)},${f2(sy)} C${f2(sx - 6.6)},${f2(sy - 6)} ${f2(sx - 4.4)},${f2(sy - 10)} ${f2(sx - 2.2)},${f2(sy - 11.4)} L${f2(sx + 2.4)},${f2(sy - 11.4)} C${f2(sx + 4.6)},${f2(sy - 10)} ${f2(sx + 6.6)},${f2(sy - 6)} ${f2(sx + 5.4)},${f2(sy)} Z" fill="#C9A46A" stroke="#8A6A3A" stroke-width="0.5"/>`
            + `<path d="M${f2(sx - 2.4)},${f2(sy - 11.4)} q2.4,-2.6 4.8,0" fill="${COAL.top}" stroke="#8A6A3A" stroke-width="0.4"/>`
            + ln([sx - 2.6, sy - 10.6], [sx + 2.6, sy - 10.6], '#7A5A2A', 1)
            + ln([sx - 3, sy - 6], [sx - 1.6, sy - 2], 'rgba(138,106,58,.6)', 0.5) + ln([sx + 2.4, sy - 7], [sx + 3, sy - 3], 'rgba(138,106,58,.6)', 0.5);
        })();
    }
  }]
};
// Hangar : abri ouvert sous un toit d'ardoise, outils pendus au mur, établi, caisses et roue de charrette
const hangar = {
  light: () => [0.02, 0.18, 21, 15],
  layers: [{
    frame: [-38, -66, 76, 84],
    draw: T => {
      const crate = (du, dv, z, s) => T.box(du - s, dv - s, du + s, dv + s, z, z + s * 64, WOOD)
        + ln(T.p(du - s, dv + s, z), T.p(du + s, dv + s, z + s * 64), WOOD.right, 0.7) + ln(T.p(du + s, dv - s, z), T.p(du + s, dv + s, z + s * 64), WOOD.right, 0.7);
      const [wx, wy] = T.p(-0.2, -0.24, 16);
      return T.shadow(0, 0, 0.42, 0.2)
        + T.box(-0.34, -0.28, 0.34, -0.23, 0, 26, WOOD) + planksLeft(T.u - 0.34, T.u + 0.34, T.v - 0.23, 0, 26, 4.6)
        // Outils au mur : scie, marteau, corde
        + poly([[wx - 6, wy], [wx + 4, wy - 2], [wx + 4, wy + 2]], '#C9D0D8', ` stroke="${IRON.right}" stroke-width="0.5"`)
        + ln([wx + 9, wy - 3], [wx + 9, wy + 5], WOOD.right, 1.2) + poly([[wx + 7, wy - 4], [wx + 11, wy - 4], [wx + 11, wy - 2], [wx + 7, wy - 2]], IRON.right)
        + `<circle cx="${f2(wx + 18)}" cy="${f2(wy + 1)}" r="3.2" fill="none" stroke="#B08850" stroke-width="1.4"/>`
        + T.box(-0.3, -0.22, 0.3, -0.08, 9, 11, WOOD) + post(T, -0.28, -0.1, 0, 9, WOOD_DARK, 0.015) + post(T, 0.28, -0.1, 0, 9, WOOD_DARK, 0.015)
        + [[-0.32, -0.26], [0.32, -0.26], [-0.32, 0.26], [0.32, 0.26]].map(([a, b]) => post(T, a, b, 0, 26, WOOD_DARK, 0.025)).join('')
        + T.gable(-0.34, -0.28, 0.34, 0.28, 26, 11, { front: SLATE_ROOF.front, back: SLATE_ROOF.back, gable: WOOD.right }, 0.06)
        + ln(T.p(0.02, 0.18, 26), T.p(0.02, 0.18, 23), '#3D3A36', 0.5) + T.box(0, 0.16, 0.04, 0.2, 19, 23, { top: '#5A606A', left: GLASS, right: '#E9C878' })
        + crate(0.28, 0.36, 0, 0.07) + crate(0.16, 0.38, 0, 0.06) + crate(0.26, 0.34, 9, 0.055)
        + (() => { const T2 = tools(T.u - 0.38, T.v + 0.24, 'roue'); return wheelOf(T2); })();
    }
  }]
};
// Roue de charrette appuyée contre un poteau (vue dans le plan (v, z))
function wheelOf(T) {
  const [cx, cy] = T.p(0, 0, 8);
  let out = `<ellipse cx="${f2(cx)}" cy="${f2(cy)}" rx="5.6" ry="8.4" fill="none" stroke="${WOOD_DARK.right}" stroke-width="1.8" transform="rotate(-18 ${f2(cx)} ${f2(cy)})"/>`;
  for (let k = 0; k < 6; k++) {
    const a = (k / 6) * TAU;
    out += ln([cx, cy], [cx + Math.cos(a) * 5, cy + Math.sin(a) * 7.6], WOOD.right, 0.8);
  }
  return out + dot(cx, cy, 1.4, DARK_IRON.right);
}
// Haut fourneau : tour de briques qui s'affine, gueule où rougeoie la fonte, soufflet de cuir ; fumée et étincelles
// montent du gueulard, la lueur orange éclaire la nuit
const fourneau = {
  light: () => [-0.02, 0.3, 12, 24, '255,130,50', true],
  layers: [{
    frame: [-36, -122, 72, 140],
    n: 8,
    fps: 5,
    draw: (T, f, n) => {
      const tiers = [[0.27, 10, 24], [0.23, 24, 38], [0.2, 38, 52], [0.17, 52, 64]];
      let tower = '';
      for (const [r, z0, z1] of tiers) {
        tower += T.box(-r, -r, r, r, z0, z1, BRICK);
        for (let z = z0 + 3.5; z < z1; z += 3.5) tower += ln(T.p(-r, r, z), T.p(r, r, z), 'rgba(90,40,25,.35)', 0.5) + ln(T.p(r, -r, z), T.p(r, r, z), 'rgba(90,40,25,.35)', 0.5);
      }
      const [mx, my] = T.p(-0.02, 0.27, 10);
      const pulse = [0.85, 1, 0.92, 1.08, 0.9, 1, 0.95, 1.05][f];
      const [gx, gy] = T.p(0, 0, 66);
      const smoke = [0, 1, 2].map(k => {
        const p = ((f + k * 3) % n) / n;
        return puff(gx - 3 + p * 8, gy - 4 - p * 30, 3 + p * 5, 0.65 * (1 - p));
      }).join('');
      const sparks = [0, 1, 2, 3].map(k => {
        const p = ((f * 1.3 + k * 2) % n) / n;
        return dot(gx + Math.sin(k * 2.3 + p * 3) * 6, gy - 2 - p * 22, 0.9, p < 0.7 ? '#FFC24A' : '#FF7A3A');
      }).join('');
      return T.shadow(0, 0, 0.42, 0.22)
        + T.box(-0.32, -0.32, 0.32, 0.32, 0, 10, STONE)
        + tower
        + T.box(-0.19, -0.19, 0.19, 0.19, 64, 67, STONE)
        + `<path d="M${f2(mx - 6.4)},${f2(my)} L${f2(mx - 6.4)},${f2(my - 8)} A6.4,6 0 0 1 ${f2(mx + 6.4)},${f2(my - 8)} L${f2(mx + 6.4)},${f2(my)} Z" fill="#2A140C"/>`
        + ell(mx, my - 4, 5 * pulse, 3.6 * pulse, '#F2862A') + ell(mx, my - 3.4, 3.2 * pulse, 2 * pulse, '#FFD24E')
        // Soufflet de cuir et sa tuyère
        + T.box(0.3, -0.06, 0.42, 0.1, 3, 5, WOOD)
        + poly([T.p(0.3, -0.04, 6), T.p(0.42, -0.04, 9 + (f % 2) * 2), T.p(0.42, 0.08, 9 + (f % 2) * 2), T.p(0.3, 0.08, 6)], '#7A4A2A', ` stroke="${OUT}" stroke-width="0.5"`)
        + ln(T.p(0.3, 0.02, 7), T.p(0.27, 0.02, 14), IRON.right, 1.6)
        // Tas de minerai devant
        + boulder(T.u + 0.2, T.v + 0.36, 0.1, 0.08, 5, { top: '#B07A62', left: '#8A5A46', right: '#643E30' }, 5, 0.4, 0.5)
        + smoke + sparks;
    }
  }]
};

// Maison (lot 7d) : maisonnette blanchie à la chaux sur son soubassement de pierre, toit à deux pentes, porte, fenêtre
// éclairée la nuit, jardinière fleurie ; la cheminée fume. variant : n° de la maison (0 à 3), qui change le toit et
// la porte
const HOUSE_LOOKS = [
  { roof: ROOF_RED, door: '#3E6E9C' },
  { roof: BLUE_ROOF, door: '#C9473A' },
  { roof: THATCH, door: '#4F8A3A' },
  { roof: SLATE_ROOF, door: '#B5772F' }
];
const maison = {
  light: () => [0.27, 0.06, 13, 12],
  layers: [{
    frame: [-34, -78, 68, 96],
    n: 6,
    fps: 3,
    draw: (T, f, n, variant = 0) => {
      const look = HOUSE_LOOKS[variant % HOUSE_LOOKS.length];
      const [chx, chy] = T.p(-0.12, -0.1, 36);
      const smoke = [0, 1].map(k => {
        const p = ((f + k * 3) % n) / n;
        return puff(chx + p * 5, chy - 4 - p * 16, 1.8 + p * 3.2, 0.55 * (1 - p));
      }).join('');
      const pane = (pts, fill) => T.face(pts, fill, ` stroke="${WOOD_DARK.right}" stroke-width="0.9"`);
      return T.shadow(0, 0, 0.36, 0.2)
        + T.box(-0.26, -0.22, 0.26, 0.22, 0, 4, STONE)
        + T.box(-0.24, -0.2, 0.24, 0.2, 4, 21, WALL)
        // Porte (face avant) et fenêtre (pignon), linteaux de bois
        + pane([[-0.05, 0.2, 4], [0.07, 0.2, 4], [0.07, 0.2, 15], [-0.05, 0.2, 15]], look.door)
        + dot(...T.p(0.05, 0.2, 9.5), 0.6, '#F2C04B')
        + pane([[0.24, -0.06, 10], [0.24, 0.07, 10], [0.24, 0.07, 16], [0.24, -0.06, 16]], GLASS)
        + ln(T.p(0.24, 0.005, 10), T.p(0.24, 0.005, 16), WOOD_DARK.right, 0.7)
        + pane([[-0.16, 0.2, 10], [-0.1, 0.2, 10], [-0.1, 0.2, 15], [-0.16, 0.2, 15]], GLASS)
        // Jardinière fleurie sous la fenêtre de façade
        + T.box(-0.18, 0.2, -0.08, 0.25, 8, 10, WOOD)
        + [-0.165, -0.13, -0.095].map((du, k) => dot(...T.p(du, 0.23, 11.2), 1.3, ['#E8566A', '#F2C04B', '#B48AE0'][k])).join('')
        + T.cyl(-0.12, -0.1, 24, 36, 0.035, BRICK, 'chem')
        + T.gable(-0.27, -0.23, 0.27, 0.23, 21, 11, { front: look.roof.front, back: look.roof.back, gable: WALL.right }, 0.05)
        + smoke;
    }
  }]
};

/* ---------- Annexes de climat (lot 9d), payées en trouvailles ---------- */
const ICE_BLOCK = { top: '#E9F8FF', left: '#BFE7F7', right: '#8CCBE8' };
const SNOWY = { top: '#FFFFFF', left: '#EEF4FA', right: '#CFDDEA' };
const REEDS = { front: '#D8C27A', back: '#B49A52', gable: '#9E8440' };
const OBSIDIAN = { top: '#4A4258', left: '#2C2A34', right: '#1C1A22' };
const SALT = { top: '#FFFFFF', left: '#EDE6DE', right: '#CFC4B6' };

// Glacière (Puits) : une butte de pierre coiffée de neige, sa porte basse, des blocs de glace qui attendent
const glaciere = {
  layers: [{
    frame: [-34, -50, 68, 64],
    draw: T => {
      const [x, y] = T.p(0, 0, 0);
      // le sol de neige et ses pas
      let out = ell(x, y + 1, 30, 13, SNOWY.top, ` stroke="${OUT}" stroke-width="0.5"`) + ell(x + 4, y + 3, 22, 7, SNOWY.left)
        + [[-20, 8], [-15, 10], [-10, 8.6]].map(([dx, dy]) => ell(x + dx, y + dy, 1.6, 0.9, SNOWY.right)).join('')
        + T.shadow(0, 0, 0.38, 0.16);
      // le dôme de pierres sèches : rangs de pierres posées une à une, plus petites vers le haut
      out += `<path d="M${x - 22},${y} A22,22 0 0 1 ${x + 22},${y} Q${x},${y + 9} ${x - 22},${y} Z" fill="${STONE.left}" stroke="${OUT}" stroke-width="0.8"/>`;
      for (const [r, n] of [[0, 9], [5.5, 8], [11, 7]]) {
        const w = Math.sqrt(484 - r * r), y0 = y - r;
        for (let k = 0; k < n; k++) {
          const x0 = x - w + (k + 0.08) * (2 * w / n) + ((r / 5.5) % 2 ? w / n / 2 : 0), x1 = Math.min(x0 + 2 * w / n * 0.86, x + w);
          if (x0 >= x + w - 1) continue;
          const sag = (xx => (1 - ((xx - x) / w) ** 2) * 3.4)((x0 + x1) / 2);
          out += `<path d="M${f2(x0)},${f2(y0 + sag)} Q${f2((x0 + x1) / 2)},${f2(y0 + sag - 5.6)} ${f2(x1)},${f2(y0 + sag)} Q${f2((x0 + x1) / 2)},${f2(y0 + sag + 1.2)} ${f2(x0)},${f2(y0 + sag)} Z" fill="${k % 3 ? STONE.top : STONE.left}" stroke="${STONE.right}" stroke-width="0.6"/>`;
        }
      }
      out += `<path d="M${x + 6},${y + 4} Q${x + 16},${y - 4} ${x + 18},${y - 13} A22,22 0 0 1 ${x + 22},${y} Q${x + 14},${y + 5} ${x + 6},${y + 4} Z" fill="${STONE.right}" opacity="0.55"/>`;
      // la calotte de neige, son bord bosselé et ses glaçons
      let cap = `M${x - 15},${y - 16} A22,22 0 0 1 ${x + 15},${y - 16}`;
      for (let k = 0; k < 6; k++) { const xa = x + 15 - k * 5, xb = xa - 5; cap += ` Q${f2((xa + xb) / 2)},${f2(y - 12.4 + (k % 2 ? 1 : -0.6))} ${f2(xb)},${f2(y - 16 + Math.abs(xb - x) * 0.02)}`; }
      out += `<path d="${cap} Z" fill="${SNOWY.top}" stroke="${OUT}" stroke-width="0.6"/>` + `<path d="M${x - 8},${y - 19.4} q5,-2.4 10,-1.6" stroke="#FFFFFF" stroke-width="1.2" fill="none" stroke-linecap="round"/>`
        + [[-11, 3], [-4, 4.6], [3, 3.4], [9, 4]].map(([dx, l]) => poly([[x + dx - 1, y - 14.6], [x + dx + 1, y - 14.6], [x + dx, y - 14.6 + l]], ICE_BLOCK.left, ` stroke="${OUT}" stroke-width="0.4"`)).join('');
      // la porte basse au cadre de bois, la lueur bleutée du froid
      const [dx, dy] = T.p(0.02, 0.34, 0);
      out += `<path d="M${dx - 7},${dy} L${dx - 7},${dy - 10.4} A7,5.6 0 0 1 ${dx + 7},${dy - 10.4} L${dx + 7},${dy} Z" fill="${WOOD.right}" stroke="${OUT}" stroke-width="0.6"/>`
        + `<path d="M${dx - 5.4},${dy} L${dx - 5.4},${dy - 9.6} A5.4,4.4 0 0 1 ${dx + 5.4},${dy - 9.6} L${dx + 5.4},${dy} Z" fill="#3A3E4A"/>`
        + ell(dx, dy - 4, 3.4, 2.4, 'rgba(160,220,255,.45)');
      // les blocs de glace taillés et leur reflet
      out += T.box(0.24, 0.22, 0.4, 0.38, 0, 8, ICE_BLOCK) + T.box(0.28, 0.26, 0.38, 0.36, 8, 14, ICE_BLOCK) + T.box(-0.42, 0.2, -0.28, 0.34, 0, 7, ICE_BLOCK)
        + ln(T.p(0.26, 0.38, 6), T.p(0.3, 0.38, 2), 'rgba(255,255,255,.85)', 0.8) + ln(T.p(-0.4, 0.34, 5.4), T.p(-0.36, 0.34, 1.6), 'rgba(255,255,255,.85)', 0.8)
        + star(...T.p(0.33, 0.31, 16), 2.2, '#FFFFFF', 0.9);
      return out;
    }
  }]
};

// Métier à tisser (Foyer) : un métier de bois sous un auvent, une toile de laine à rayures qui avance, des pelotes
const metier = {
  layers: [{
    frame: [-34, -52, 68, 66],
    n: 4,
    fps: 2,
    draw: (T, f) => {
      let out = T.shadow(0, 0, 0.38, 0.18);
      for (const [u, v] of [[-0.24, -0.16], [0.24, -0.16], [-0.24, 0.16], [0.24, 0.16]]) out += post(T, u, v, 0, 24, WOOD_DARK, 0.025);
      out += T.gable(-0.3, -0.22, 0.3, 0.22, 24, 10, { front: ROOF_RED.front, back: ROOF_RED.back, gable: WOOD.right }, 0.06);
      // La toile : rayures de laine qui défilent
      const rows = ['#E2574C', '#F4ECDC', '#6FA3D9', '#F2C04B'];
      for (let k = 0; k < 4; k++) {
        const c = rows[(k + f) % rows.length];
        out += T.face([[-0.2, 0.02, 6 + k * 3.5], [0.2, 0.02, 6 + k * 3.5], [0.2, 0.02, 9.5 + k * 3.5], [-0.2, 0.02, 9.5 + k * 3.5]], c, EDGE);
      }
      out += ln(T.p(-0.22, 0.02, 20), T.p(0.22, 0.02, 20), WOOD.top, 1.6) + ln(T.p(-0.22, 0.02, 5), T.p(0.22, 0.02, 5), WOOD.top, 1.6);
      for (let k = 0; k < 6; k++) out += ln(T.p(-0.18 + k * 0.072, 0.02, 20), T.p(-0.18 + k * 0.072, 0.02, 20 - 2), 'rgba(80,60,40,.5)', 0.5);
      const ball = (du, dv, c) => { const [bx, by] = T.p(du, dv, 0); return dot(bx, by - 3, 3.4, c) + ln([bx - 2.4, by - 4], [bx + 2.4, by - 2], 'rgba(0,0,0,.2)', 0.6); };
      return out + ball(0.32, 0.3, '#E2574C') + ball(0.38, 0.18, '#F4ECDC') + ball(-0.34, 0.3, '#6FA3D9');
    }
  }]
};

// Hutte de roseaux (Bosquet) : des murs de roseaux tressés, un toit de chaume épais, des bottes qui sèchent
const hutte = {
  layers: [{
    frame: [-34, -56, 68, 70],
    draw: T => {
      const [x, y] = T.p(0, 0, 0);
      const R = { light: '#E2CD88', mid: '#C9AE62', dark: '#9E8440', line: 'rgba(110,80,30,.45)' };
      // le sol de vase, une flaque et son nénuphar, des massettes
      let out = ell(x, y + 1, 28, 12, '#8C7A52', ` stroke="${OUT}" stroke-width="0.5"`) + ell(x - 3, y, 19, 7, '#9C8A60')
        + ell(x + 15, y + 6, 8, 3, '#7FB2C8', ` stroke="${OUT}" stroke-width="0.4"`) + ell(x + 13.6, y + 5.4, 3, 1, 'rgba(255,255,255,.6)')
        + `<path d="M${f2(x + 17)},${f2(y + 6)} a2.6,1 0 1 1 0.8,0.8 Z" fill="#6FAE4E" stroke="${OUT}" stroke-width="0.4"/>`
        + [[-24, 2], [-21, 5], [22, -2]].map(([dx, dy]) => ln([x + dx, y + dy], [x + dx - 1, y + dy - 12], '#5E8C3A', 1) + ell(x + dx - 1, y + dy - 12.6, 1, 2.4, '#8A5A2E', ` stroke="${OUT}" stroke-width="0.3"`)).join('')
        + T.shadow(0, 0, 0.32, 0.2);
      // le mur rond de roseaux en bottes, ses deux liens
      const wr = 15, wh = 18;
      out += `<path d="M${x - wr},${y} L${x - wr},${y - wh} A${wr},${wr * 0.5} 0 0 0 ${x + wr},${y - wh} L${x + wr},${y} A${wr},${wr * 0.5} 0 0 1 ${x - wr},${y} Z" fill="${R.mid}" stroke="${OUT}" stroke-width="0.7"/>`
        + `<path d="M${x + 4},${y + wr * 0.48} L${x + 4},${y - wh + wr * 0.48} A${wr},${wr * 0.5} 0 0 0 ${x + wr},${y - wh} L${x + wr},${y} A${wr},${wr * 0.5} 0 0 1 ${x + 4},${y + wr * 0.48} Z" fill="${R.dark}"/>`;
      for (let k = 1; k < 10; k++) { const t = -1 + (k / 10) * 2, bx = x + t * wr, by = y + Math.sqrt(1 - t * t) * wr * 0.5; out += ln([bx, by], [bx, by - wh], R.line, 0.6); }
      for (const z of [5, 11]) out += `<path d="M${x - wr},${y - z} A${wr},${wr * 0.5} 0 0 0 ${x + wr},${y - z}" fill="none" stroke="#7A5A2A" stroke-width="1"/>`;
      // la porte et son rideau de roseaux
      const [dx, dy] = T.p(0.02, 0.24, 0);
      out += `<path d="M${f2(dx - 4.4)},${f2(dy)} L${f2(dx - 4.4)},${f2(dy - 9)} Q${f2(dx)},${f2(dy - 13)} ${f2(dx + 4.4)},${f2(dy - 9)} L${f2(dx + 4.4)},${f2(dy)} Z" fill="#3E2C1C" stroke="${OUT}" stroke-width="0.5"/>`
        + [-3, -1.5, 0, 1.5, 3].map(o => ln([dx + o, dy - 10.6 + Math.abs(o) * 0.4], [dx + o * 1.1, dy - 4], R.light, 0.7)).join('');
      // le toit conique de chaume en trois franges, son nœud au sommet
      const top = y - wh - 22, rr = wr + 5;
      const frange = (y0, r, c) => { let d = `M${f2(x - r)},${f2(y0)}`; for (let k = 0; k < 8; k++) { const x0 = x - r + (k / 8) * 2 * r, x1 = x - r + ((k + 1) / 8) * 2 * r, cy = y0 + Math.sqrt(Math.max(0, 1 - (((x0 + x1) / 2 - x) / r) ** 2)) * r * 0.5; d += ` Q${f2((x0 + x1) / 2)},${f2(cy + 3.4)} ${f2(x1)},${f2(y0 + Math.sqrt(Math.max(0, 1 - ((x1 - x) / r) ** 2)) * r * 0.5)}`; } return `<path d="${d} L${x},${f2(top)} Z" fill="${c}" stroke="${OUT}" stroke-width="0.7" stroke-linejoin="round"/>`; };
      out += frange(y - wh + 1, rr, R.mid) + `<path d="M${x + 3},${f2(top + 2)} L${f2(x + rr)},${f2(y - wh + 1)} Q${f2(x + rr * 0.6)},${f2(y - wh + rr * 0.42)} ${f2(x + 4)},${f2(y - wh + rr * 0.5)} Z" fill="${R.dark}" opacity="0.8"/>`
        + frange(y - wh - 7, rr - 5, R.light) + frange(y - wh - 14, rr - 10, R.mid)
        + [-0.6, -0.3, 0, 0.3, 0.6].map(t => ln([x + t * rr * 0.9, y - wh + 2], [x + t * 4, top + 6], R.line, 0.5)).join('')
        + ell(x, top + 1, 3, 1.6, '#7A5A2A', ` stroke="${OUT}" stroke-width="0.5"`) + ln([x, top + 1], [x + 1, top - 4], R.dark, 1.6) + ln([x, top + 1], [x - 2, top - 3], R.dark, 1.2);
      // les bottes de roseaux qui sèchent, liées
      const bundle = (du, dv) => { const [bx, by] = T.p(du, dv, 0); return [-2, -0.7, 0.7, 2].map(d => ln([bx + d, by], [bx + d * 0.4, by - 14], d < 0 ? R.mid : R.light, 1.4)).join('') + ln([bx - 2.6, by - 6], [bx + 2.6, by - 6], '#7A5A2A', 1.2) + ell(bx, by - 14.6, 1.6, 0.9, R.dark); };
      return out + bundle(-0.1, 0.38) + bundle(0.38, -0.08);
    }
  }]
};

// Saline (Ponton) : des bassins où l'eau de mer s'évapore (bleue, turquoise, rose, puis croûte de sel), un mulon de sel
// où est plantée la pelle, le panier et le las du saunier, une mouette sur le talus ; l'eau miroite, le sel scintille
const saline = {
  layers: [{
    frame: [-36, -40, 72, 52],
    n: 6,
    fps: 2,
    draw: (T, f, n) => {
      let out = T.shadow(0, 0, 0.42, 0.12);
      for (const [u, v, c] of [[-0.22, -0.18, '#9AD6F0'], [0.18, -0.18, '#C9E9F5'], [-0.22, 0.18, '#E6F4FA'], [0.18, 0.18, '#9AD6F0']]) {
        out += T.box(u - 0.17, v - 0.15, u + 0.17, v + 0.15, 0, 2.5, SALT) + T.face([[u - 0.14, v - 0.12, 2.6], [u + 0.14, v - 0.12, 2.6], [u + 0.14, v + 0.12, 2.6], [u - 0.14, v + 0.12, 2.6]], c);
      }
      const shine = Math.max(0, Math.sin((f / n) * TAU));
      const heap = (du, dv, h) => { const [hx, hy] = T.p(du, dv, 2.6); return `<path d="M${hx - 7},${hy} Q${hx},${hy - h * 2} ${hx + 7},${hy} Z" fill="#FFFFFF" stroke="${SALT.right}" stroke-width="0.6"/>`; };
      return out + heap(0.16, -0.16, 5) + heap(0.22, -0.2, 4) + star(...T.p(0.16, -0.16, 12), 2, '#FFFFFF', 0.3 + 0.7 * shine)
        + ln(T.p(-0.3, 0.38, 0), T.p(-0.06, 0.2, 16), WOOD.right, 1.2) + ln(T.p(-0.08, 0.18, 16), T.p(-0.02, 0.24, 15), WOOD.right, 2);
    }
  }]
};

// Serre tropicale (Potager) : une serre de verre aux montants de fer, pleine de palmes et de fruits dorés ; de la buée
const serre = {
  light: () => [0, 0, 16, 18, '190,255,170'],
  layers: [{
    frame: [-36, -58, 72, 72],
    n: 6,
    fps: 2,
    draw: (T, f, n) => {
      const GLASS_FACES = { top: 'rgba(225,243,255,.45)', left: 'rgba(196,228,246,.4)', right: 'rgba(160,205,232,.48)' };
      let out = T.shadow(0, 0, 0.42, 0.16) + T.box(-0.3, -0.24, 0.3, 0.24, 0, 3, STONE);
      // Plantes à l'intérieur (derrière le verre)
      const [x, y] = T.p(0, 0, 3);
      out += [-12, 0, 12].map((dx, k) => `<path d="M${x + dx},${y} q-6,-10 -12,-12 q6,0 12,6 q0,-12 6,-18 q-2,10 0,18 q6,-8 12,-8 q-6,4 -12,14 Z" fill="${k % 2 ? '#3E8A48' : '#5FAE5A'}"/>`).join('')
        + [[-8, -14], [6, -18], [14, -10]].map(([dx, dy]) => ell(x + dx, y + dy, 2.2, 2.8, '#F2B23C', ` stroke="#8A5A14" stroke-width="0.4"`)).join('');
      out += T.box(-0.3, -0.24, 0.3, 0.24, 3, 22, GLASS_FACES, ' stroke="rgba(255,255,255,.85)" stroke-width="0.8"');
      out += T.gable(-0.3, -0.24, 0.3, 0.24, 22, 10, { front: 'rgba(210,236,250,.55)', back: 'rgba(190,220,240,.5)', gable: 'rgba(170,210,235,.5)' }, 0.02, ' stroke="rgba(255,255,255,.85)" stroke-width="0.8"');
      for (let k = 0; k <= 4; k++) out += ln(T.p(-0.3 + k * 0.15, 0.24, 3), T.p(-0.3 + k * 0.15, 0.24, 22), DARK_IRON.left, 0.8);
      const p = f / n;
      return out + `<circle cx="${f2(x + 10)}" cy="${f2(y - 24 - p * 10)}" r="${f2(3 + p * 3)}" fill="rgba(255,255,255,${f2(0.4 * (1 - p))})"/>`;
    }
  }]
};

// Forge d'obsidienne (Carrière) : sur un sol de basalte fendu de lave, un foyer de pierres noires sous sa cheminée, un
// soufflet de cuir qui souffle, une enclume où rougit une lame, un tas d'obsidienne brute et un seau qui fume ; le feu
// brûle, les fentes de lave battent, des étincelles montent
const fonderie = {
  light: () => [-0.1, 0.05, 8, 26, '255,120,50', true],
  layers: [{
    frame: [-36, -54, 72, 68],
    n: 6,
    fps: 6,
    draw: (T, f, n) => {
      let out = T.shadow(0, 0, 0.42, 0.2) + T.box(-0.3, -0.24, 0.06, 0.12, 0, 12, OBSIDIAN);
      const [fx, fy] = T.p(-0.12, -0.06, 12);
      const k = f / n;
      out += ell(fx, fy, 9, 4, '#3A1A12') + ell(fx, fy, 7, 3, `rgba(255,${f2(110 + 60 * Math.sin(k * TAU))},40,.95)`);
      out += `<path d="M${fx - 4},${fy} Q${fx - 6},${fy - 10} ${fx},${fy - 16 - Math.sin(k * TAU) * 3} Q${fx + 6},${fy - 10} ${fx + 4},${fy} Z" fill="#F59A3C"/>`
        + `<path d="M${fx - 2},${fy} Q${fx - 3},${fy - 6} ${fx},${fy - 10} Q${fx + 3},${fy - 6} ${fx + 2},${fy} Z" fill="#FFE08A"/>`;
      // Hotte de pierre noire
      out += T.box(-0.26, -0.22, 0.02, 0.06, 26, 30, OBSIDIAN) + post(T, -0.25, -0.2, 12, 26, OBSIDIAN, 0.02) + post(T, 0.01, 0.04, 12, 26, OBSIDIAN, 0.02);
      // Enclume et éclats
      const [ax, ay] = T.p(0.24, 0.2, 0);
      out += T.box(0.18, 0.14, 0.3, 0.26, 0, 8, OBSIDIAN) + poly([[ax - 9, ay - 8], [ax + 9, ay - 9], [ax + 6, ay - 12], [ax - 6, ay - 12]], OBSIDIAN.top, EDGE);
      return out + [[-0.36, 0.32], [-0.24, 0.38], [0.04, 0.38]].map(([du, dv], i) => { const [sx, sy] = T.p(du, dv, 0); return poly([[sx - 2, sy], [sx + 2, sy], [sx + (i - 1), sy - 7]], OBSIDIAN.left, EDGE) + ln([sx, sy - 1], [sx + (i - 1) * 0.6, sy - 5], 'rgba(185,166,232,.6)', 0.6); }).join('')
        + (f % 3 === 0 ? dot(fx + 3, fy - 20, 0.9, '#FFC060') + dot(fx - 2, fy - 24, 0.8, '#FF9040') : '');
    }
  }]
};

export const ANNEX_SPRITES = {
  champ, grenier, enclos, filon, depot, taille, coupe, remise, pepiniere,
  citerne, reservoir, eolienne, vivier, fumoir, huitres, jardin, four, belvedere, charbon, hangar, fourneau, maison,
  glaciere, metier, hutte, saline, serre, fonderie
};

// Calques d'une annexe prêts à peindre à l'instant t (secondes) : clé d'image et dessin
export function annexLayers(id, variant = 0, t = 0) {
  const annex = ANNEX_SPRITES[id];
  if (!annex) return [];
  return annex.layers.map((layer, k) => {
    const f = layer.n ? Math.floor(t * layer.fps) % layer.n : 0;
    const [x, y, w, h] = layer.frame;
    return {
      key: `annex-${id}-${variant}-${k}-${f}`,
      make: () => sprite(layer.draw(tools(0, 0, `${id}-${variant}-${k}`), f, layer.n || 1, variant), { x, y, w, h })
    };
  });
}

// Lumière de nuit d'une annexe : [u, v, z, rayon, couleur « r,g,b » ou rien (lueur chaude), feu qui vacille], ou null
export function annexLight(id) {
  const annex = ANNEX_SPRITES[id];
  return annex && annex.light ? annex.light() : null;
}

// Vignette d'une annexe pour sa fiche : tous ses calques (première image), cadrés au plus juste
export function annexThumb(id, variant = 0) {
  const annex = ANNEX_SPRITES[id];
  if (!annex) return null;
  const frames = annex.layers.map(l => l.frame);
  const x = Math.min(...frames.map(fr => fr[0]));
  const y = Math.min(...frames.map(fr => fr[1]));
  const w = Math.max(...frames.map(fr => fr[0] + fr[2])) - x;
  const h = Math.max(...frames.map(fr => fr[1] + fr[3])) - y;
  const body = annex.layers.map((layer, k) => layer.draw(tools(0, 0, `${id}-${variant}-${k}-t`), 0, layer.n || 1, variant)).join('');
  return sprite(body, { x, y, w, h });
}
