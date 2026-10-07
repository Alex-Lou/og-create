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
// … sur une aire de gravier, des cristaux (ou du vert-de-cuivre) qui percent le rocher, et le wagonnet chargé sur ses rails
const filon = {
  layers: [{
    frame: [-34, -40, 68, 56],
    n: 6,
    fps: 4,
    draw: (T, f, n, variant) => {
      const look = VEINS[variant % 3];
      const kind = variant % 3;
      const [x, y] = T.p(-0.04, -0.02, 0);
      const [cx0, cy0] = T.p(0, 0, 0);
      // l'aire de gravier et ses cailloux
      let out = ell(cx0, cy0 + 1, 31, 12.6, '#C9BFAE', ` stroke="${OUT}" stroke-width="0.5"`) + ell(cx0 - 4, cy0, 21, 7.6, '#D6CDBE')
        + [[-22, 5], [18, 8], [-6, 10], [24, 0], [10, -7]].map(([dx, dy], i) => ell(cx0 + dx, cy0 + dy, 1.2 + (i % 2) * 0.4, 0.8, look.rock.left, ` stroke="${OUT}" stroke-width="0.3"`)).join('');
      // veines et pépites sur la face avant du gros rocher
      const veins = [[[-12, -5], [-7, -9], [-2, -7], [2, -11]], [[-6, -2], [-1, -5], [5, -3]], [[4, -8], [9, -6]]]
        .map(pts => `<polyline points="${pts.map(([a, b]) => `${f2(x + a)},${f2(y + b)}`).join(' ')}" fill="none" stroke="${look.vein}" stroke-width="1.2" stroke-linejoin="round" stroke-linecap="round" opacity=".9"/>`).join('');
      const nuggets = [[-7, -9], [3, -4], [-11, -4], [2, -11], [8, -7]].map(([a, b], k) => poly([[x + a, y + b - 1.7], [x + a + 1.7, y + b], [x + a, y + b + 1.5], [x + a - 1.6, y + b]], k % 2 ? look.ore : look.vein, ` stroke="${OUT}" stroke-width="0.3"`)).join('');
      out += T.shadow(0.02, 0, 0.4, 0.22)
        + boulder(T.u - 0.04, T.v - 0.02, 0.32, 0.28, 17, look.rock, 3 + variant, 0.22, 0.78)
        + veins + nuggets;
      // ce qui perce le haut du rocher : aiguilles de quartz, vert-de-cuivre, ou grandes aiguilles bleues
      const [tx, ty] = T.p(-0.08, -0.06, 15);
      if (kind === 1) {
        out += [[-5, 1, 2.6], [-1, -1, 3.2], [3.4, 0.6, 2.4], [1, 2, 2]].map(([dx, dy, r]) => ell(tx + dx, ty + dy, r, r * 0.7, '#5FAE7A', ` stroke="${OUT}" stroke-width="0.4"`) + ell(tx + dx - r * 0.3, ty + dy - r * 0.25, r * 0.4, r * 0.25, '#9FE0B0')).join('')
          + [[-3, 1.4], [2, -0.6]].map(([dx, dy]) => ell(tx + dx, ty + dy, 1.4, 1, '#E8873A', ` stroke="${OUT}" stroke-width="0.3"`)).join('');
      } else {
        const big = kind === 2 ? 1.35 : 1;
        const c = kind === 2 ? { l: '#9ED8F6', r: '#5FA8D8' } : { l: '#FFFFFF', r: '#D8DCE4' };
        out += [[-5, 1, 7, -1.6, 1.8], [0, -1, 10, 0.6, 2.2], [4.4, 1.2, 6, 2, 1.6]].map(([dx, dy, h, lean, w]) => {
          const bx = tx + dx, by = ty + dy, H = h * big, W = w * big;
          return poly([[bx - W, by], [bx, by + W * 0.45], [bx + W, by], [bx + lean, by - H]], c.l, ` stroke="${OUT}" stroke-width="0.5" stroke-linejoin="round"`)
            + poly([[bx, by + W * 0.45], [bx + W, by], [bx + lean, by - H]], c.r) + ln([bx - W * 0.4, by - H * 0.15], [bx + lean * 0.7 - W * 0.1, by - H * 0.75], 'rgba(255,255,255,.85)', 0.6);
        }).join('');
      }
      // le petit rocher, la pioche appuyée sur le flanc droit, les éclats
      out += boulder(T.u - 0.06, T.v + 0.32, 0.1, 0.09, 5, look.rock, 7 + variant, 0.25, 0.85)
        + ln(T.p(0.4, 0.04, 0), T.p(0.3, -0.06, 15), WOOD.right, 1.8) + ln(T.p(0.4, 0.04, 0.6), T.p(0.3, -0.06, 15.6), WOOD.top, 0.6)
        + `<path d="M${f2(T.p(0.24, -0.04, 13)[0])},${f2(T.p(0.24, -0.04, 13)[1])} Q${f2(T.p(0.3, -0.06, 18)[0])},${f2(T.p(0.3, -0.06, 18)[1] - 2)} ${f2(T.p(0.38, -0.1, 13)[0])},${f2(T.p(0.38, -0.1, 13)[1])}" stroke="${IRON.right}" stroke-width="2" fill="none" stroke-linecap="round"/>`
        + T.pebble(-0.36, 0.26, 0.55, look.rock) + T.pebble(-0.18, 0.38, 0.42, look.rock);
      // les rails et le wagonnet chargé de minerai, devant à droite
      out += [0.17, 0.29].map(v => ln(T.p(0.16, v, 0.4), T.p(0.5, v, 0.4), DARK_IRON.left, 0.9)).join('')
        + [0.2, 0.3, 0.4].map(u => ln(T.p(u, 0.14, 0.2), T.p(u, 0.32, 0.2), WOOD_DARK.left, 1.2)).join('')
        + T.box(0.25, 0.17, 0.43, 0.29, 1.6, 7, WOOD_DARK)
        + ln(T.p(0.25, 0.29, 4.4), T.p(0.43, 0.29, 4.4), DARK_IRON.right, 0.8) + ln(T.p(0.43, 0.29, 4.4), T.p(0.43, 0.17, 4.4), DARK_IRON.right, 0.8)
        + [[0.29, 0.29], [0.39, 0.29]].map(([u, v]) => { const [wx, wy] = T.p(u, v, 1.6); return ell(wx, wy, 1.4, 1.8, DARK_IRON.right, ` stroke="${OUT}" stroke-width="0.4"`) + dot(wx, wy, 0.4, IRON.top); }).join('')
        + [[0.3, 0.21], [0.37, 0.24], [0.33, 0.25], [0.39, 0.2], [0.34, 0.21]].map(([u, v], i) => { const [ox, oy] = T.p(u, v, 7.6 + (i === 4 ? 1.6 : 0)); return poly([[ox - 1.8, oy], [ox - 0.6, oy - 1.6], [ox + 1.6, oy - 0.8], [ox + 1, oy + 0.6]], i % 2 ? look.ore : look.rock.left, ` stroke="${OUT}" stroke-width="0.4"`); }).join('');
      const glints = [[-7, -9], [3, -4], [2, -11], [-11, -4], [8, -7], [-2, -7]];
      const [gx, gy] = glints[f % glints.length];
      return out + star(x + gx, y + gy, 2.6 + (f % 2), '#FFFFFF', 0.95);
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
// Taille de pierre : sur une aire de gravier semée d'éclats, l'établi, son maillet et ses ciseaux ; un buste à moitié
// sorti de son bloc, la poussière de taille ; les blocs en attente et une chouette de pierre déjà finie ; la lanterne
// au poteau la nuit
const taille = {
  light: () => [-0.33, -0.3, 25, 14],
  layers: [{
    frame: [-34, -62, 68, 80],
    n: 6,
    fps: 4,
    draw: (T, f, n) => {
      const [x, y] = T.p(0, 0, 0);
      const [bx, by] = T.p(0.18, -0.1, 9);
      // l'aire de gravier clair et ses éclats
      let out = ell(x, y + 1, 31, 12.6, '#E6D8BC', ` stroke="${OUT}" stroke-width="0.5"`) + ell(x - 4, y, 21, 7.6, '#EFE4CC')
        + [[-20, 4], [14, 8], [22, 0], [-6, 10], [6, 3], [10, -3]].map(([dx, dy], i) => poly([[x + dx - 1.2, y + dy], [x + dx, y + dy - 1.2], [x + dx + 1.4, y + dy - 0.2]], i % 2 ? '#D6CEBF' : '#F2EEE6', ` stroke="${OUT}" stroke-width="0.3"`)).join('')
        + T.shadow(0, 0, 0.34, 0.18);
      // le poteau et sa lanterne, les blocs en attente
      const [lx, ly] = T.p(-0.33, -0.23, 20.4);
      out += post(T, -0.33, -0.3, 0, 24) + ln(T.p(-0.33, -0.3, 24), T.p(-0.33, -0.22, 24), WOOD_DARK.right, 1.2)
        + ln(T.p(-0.33, -0.23, 24), [lx, ly - 1.6], '#3D3A36', 0.5)
        + poly([[lx - 2.2, ly], [lx + 2.2, ly], [lx + 1.6, ly - 1.6], [lx - 1.6, ly - 1.6]], DARK_IRON.left, ` stroke="${OUT}" stroke-width="0.4"`)
        + `<rect x="${f2(lx - 1.8)}" y="${f2(ly)}" width="3.6" height="4" rx="0.6" fill="#F6D27A" stroke="${OUT}" stroke-width="0.5"/>`
        + ell(lx, ly + 2, 1, 1.2, '#FFF3C4')
        + poly([[lx - 2.2, ly + 4], [lx + 2.2, ly + 4], [lx + 1.4, ly + 5.2], [lx - 1.4, ly + 5.2]], DARK_IRON.left, ` stroke="${OUT}" stroke-width="0.4"`)
        + T.box(-0.34, -0.36, -0.12, -0.18, 0, 7, STONE) + T.box(-0.3, -0.33, -0.18, -0.21, 7, 12, STONE)
        + ln(T.p(-0.34, -0.18, 3.5), T.p(-0.12, -0.18, 3.5), 'rgba(120,110,95,.4)', 0.5);
      // la chouette de pierre finie, posée sur le bloc du haut
      const [ox, oy] = T.p(-0.22, -0.25, 12);
      out += `<g transform="translate(${f2(ox)} ${f2(oy)}) scale(.62) translate(${f2(-ox)} ${f2(-oy)})">` + ell(ox, oy - 4, 3.4, 4.2, '#EDE7DB', ` stroke="${OUT}" stroke-width="0.5"`)
        + poly([[ox - 3, oy - 7], [ox - 2.2, oy - 9.6], [ox - 1, oy - 7.6]], '#EDE7DB', ` stroke="${OUT}" stroke-width="0.4" stroke-linejoin="round"`)
        + poly([[ox + 1, oy - 7.6], [ox + 2.2, oy - 9.6], [ox + 3, oy - 7]], '#EDE7DB', ` stroke="${OUT}" stroke-width="0.4" stroke-linejoin="round"`)
        + `<circle cx="${f2(ox - 1.2)}" cy="${f2(oy - 5.8)}" r="1.1" fill="none" stroke="#9B927F" stroke-width="0.5"/><circle cx="${f2(ox + 1.2)}" cy="${f2(oy - 5.8)}" r="1.1" fill="none" stroke="#9B927F" stroke-width="0.5"/>`
        + poly([[ox - 0.5, oy - 5], [ox + 0.5, oy - 5], [ox, oy - 4]], '#B7AE9D') + `<path d="M${f2(ox - 2)},${f2(oy - 2.4)} q2,1.2 4,0" stroke="#B7AE9D" stroke-width="0.5" fill="none"/>` + '</g>';
      // l'établi, son maillet, ses ciseaux rangés
      out += [[-0.3, 0.04], [0, 0.04], [-0.3, 0.22], [0, 0.22]].map(([a, b]) => post(T, a, b, 0, 10, WOOD_DARK, 0.018)).join('')
        + ln(T.p(-0.3, 0.22, 3), T.p(0, 0.22, 3), WOOD_DARK.right, 1)
        + T.box(-0.32, 0.02, 0.02, 0.24, 10, 12.5, WOOD)
        + ln(T.p(-0.2, 0.12, 13), T.p(-0.08, 0.16, 13), WOOD.right, 1.6) + T.box(-0.24, 0.09, -0.18, 0.15, 12.5, 16, WOOD_DARK)
        + [-0.06, -0.02, 0.02].map((u, i) => ln(T.p(u - 0.04, 0.04 + i * 0.03, 12.8), T.p(u + 0.04, 0.08 + i * 0.03, 12.8), i % 2 ? IRON.left : IRON.right, 0.9) + dot(...T.p(u - 0.04, 0.04 + i * 0.03, 12.8), 0.7, WOOD.left)).join('');
      // le buste sur son socle : encore pris dans le bloc en bas, épaules et tête déjà taillées
      out += T.box(0.08, -0.2, 0.28, 0, 0, 9, STONE)
        + [[0.1, 0, 3], [0.2, 0, 6.4], [0.28, -0.1, 4.4]].map(([u, v, z]) => { const [cx, cy] = T.p(u, v, z); return ln([cx - 1.4, cy - 1], [cx + 1, cy + 0.8], 'rgba(120,110,95,.5)', 0.5); }).join('')
        + T.box(0.11, -0.17, 0.25, -0.03, 9, 15, { top: '#EDE7DB', left: '#D6CEBF', right: '#B7AE9D' })
        + `<path d="M${f2(bx - 7)},${f2(by - 6)} C${f2(bx - 7)},${f2(by - 12)} ${f2(bx - 3)},${f2(by - 13)} ${f2(bx)},${f2(by - 13)} C${f2(bx + 3)},${f2(by - 13)} ${f2(bx + 7)},${f2(by - 12)} ${f2(bx + 7)},${f2(by - 6)} Z" fill="#F2EEE6" stroke="${OUT}" stroke-width="0.5"/>`
        + `<rect x="${f2(bx - 1.6)}" y="${f2(by - 16)}" width="3.2" height="4" fill="#E9E3D8"/>`
        + `<ellipse cx="${f2(bx)}" cy="${f2(by - 19.4)}" rx="3.4" ry="4.4" fill="#F7F4EE" stroke="${OUT}" stroke-width="0.5"/>`
        + `<path d="M${f2(bx - 3.4)},${f2(by - 20.4)} q3.4,-5.6 6.8,0 q-1.2,-2 -3.4,-2.2 q-2.2,0.2 -3.4,2.2 Z" fill="#DCD5C8"/>`
        + `<path d="M${f2(bx + 0.6)},${f2(by - 19.6)} l1.2,2 l-1.2,0.3" stroke="#B9B0A0" stroke-width="0.5" fill="none"/>`
        + dot(bx - 1.2, by - 19.8, 0.35, '#9B927F') + dot(bx + 1.6, by - 19.8, 0.35, '#9B927F')
        + `<path d="M${f2(bx - 1.2)},${f2(by - 17.2)} q1.2,0.8 2.4,0" stroke="#B9B0A0" stroke-width="0.4" fill="none"/>`
        + ln([bx - 6, by - 7.4], [bx - 4, by - 9.6], 'rgba(155,146,127,.5)', 0.5) + ln([bx + 4.4, by - 9.6], [bx + 6, by - 7.6], 'rgba(155,146,127,.5)', 0.5);
      // la poussière de taille qui s'envole, les éclats au pied
      out += [0, 1, 2].map(k => { const p = ((f + k * 2) % n) / n; return puff(bx + 6 + k * 2 + p * 4, by - 10 - p * 8, 1.4 + p * 2.4, 0.55 * (1 - p)); }).join('')
        + T.pebble(0.32, 0.18, 0.35, STONE) + T.pebble(0.2, 0.3, 0.3, STONE);
      return out;
    }
  }]
};

/* ---------- Bosquet ---------- */
// Coupe : selon l'exemplaire, une pile de rondins moussus où sautille un rouge-gorge, le billot et sa hache ; des
// souches à champignons, leurs jeunes pousses et un lapin qui bondit ; ou un chevalet où la scie va et vient dans le
// rondin, la sciure qui tombe et les rondelles sciées. Sol de sous-bois : herbe, feuilles mortes, fougères, copeaux
const coupe = {
  layers: [{
    frame: [-34, -40, 68, 56],
    n: 6,
    fps: 3,
    draw: (T, f, n, variant) => {
      const kind = variant % 3;
      const [x, y] = T.p(0, 0, 0);
      const fern = (du, dv, s, ph) => { const [fx, fy] = T.p(du, dv, 0); return [-1, 0, 1].map(i => { const a = i * 0.7 + wave(f, n, 0.08, ph); const ex = fx + Math.sin(a) * 7 * s, ey = fy - Math.cos(a) * 6 * s; let d = `M${f2(fx)},${f2(fy)} Q${f2((fx + ex) / 2 - i)},${f2((fy + ey) / 2 - 1)} ${f2(ex)},${f2(ey)}`; for (let j = 1; j < 4; j++) { const t = j / 4, px = fx + (ex - fx) * t, py = fy + (ey - fy) * t; d += ` M${f2(px)},${f2(py)} l${f2(-1.6 * s)},${f2(0.6 * s)} M${f2(px)},${f2(py)} l${f2(1.6 * s)},${f2(0.4 * s)}`; } return `<path d="${d}" stroke="${i ? '#5E8C3A' : '#7FAE4E'}" stroke-width="0.8" fill="none" stroke-linecap="round"/>`; }).join(''); };
      const shroom = (sx, sy, s) => ln([sx, sy], [sx, sy - 2.4 * s], '#F2E8D4', 1.2 * s) + `<path d="M${f2(sx - 2.2 * s)},${f2(sy - 2.2 * s)} Q${f2(sx)},${f2(sy - 5 * s)} ${f2(sx + 2.2 * s)},${f2(sy - 2.2 * s)} Z" fill="#D9473A" stroke="${OUT}" stroke-width="0.4"/>` + dot(sx - 0.8 * s, sy - 3.2 * s, 0.4 * s, '#FFFFFF') + dot(sx + 0.8 * s, sy - 3.6 * s, 0.35 * s, '#FFFFFF');
      // le sous-bois : herbe, feuilles mortes, copeaux
      let out = ell(x, y + 1, 31, 12.6, '#8FB45E', ` stroke="${OUT}" stroke-width="0.5"`) + ell(x - 3, y, 21, 7.6, '#A7C66E')
        + [[-20, 4, '#D9963A'], [16, 8, '#C8642E'], [22, -2, '#E2B347'], [-8, 9, '#C8642E'], [6, -8, '#D9963A']].map(([dx, dy, c], i) => `<path d="M${x + dx},${y + dy} q1.6,-1.6 3.2,0 q-1.6,1.4 -3.2,0 Z" fill="${c}" transform="rotate(${i * 40} ${x + dx + 1.6} ${y + dy})"/>`).join('')
        + T.shadow(0, 0, 0.34, 0.16);
      for (const [du, dv] of [[-0.3, 0.22], [0.26, 0.3], [-0.1, -0.32], [0.32, -0.12]]) out += dot(...T.p(du, dv, 0), 0.9, '#E7C08A');
      if (kind === 0) {
        out += fern(-0.4, -0.12, 0.9, 0)
          + log(T, -0.14, -0.26, 0.2, 3.6, 3.6) + log(T, 0.02, -0.26, 0.2, 3.6, 3.6) + log(T, 0.18, -0.26, 0.2, 3.6, 3.6)
          + log(T, -0.06, -0.24, 0.18, 10.4, 3.5) + log(T, 0.1, -0.24, 0.18, 10.4, 3.5) + log(T, 0.02, -0.22, 0.16, 17, 3.4)
          + [[-0.12, -0.1, 6.6], [0.08, -0.06, 13.4], [0.2, 0.02, 6.4]].map(([du, dv, z]) => { const [mx, my] = T.p(du, dv, z); return ell(mx, my, 2.6, 1, '#7E9A52') + ell(mx - 0.6, my - 0.3, 1.2, 0.5, '#9DB86A'); }).join('')
          + stumpAt(T, 0.3, 0.28, 5, 0.07, 'st0');
        const [hx, hy] = T.p(0.3, 0.28, 5);
        out += ln([hx + 0.6, hy - 1], [hx + 5.4, hy - 8.6], WOOD.right, 1.4)
          + poly([[hx - 2.4, hy + 0.4], [hx + 1.6, hy - 2.2], [hx + 2.4, hy - 0.4], [hx - 1, hy + 1.6]], IRON.left, ` stroke="${OUT}" stroke-width="0.5" stroke-linejoin="round"`);
        const hop = f === 2 ? 1.5 : 0;
        const [rx, ry] = T.p(0.02, 0.16, 20.6);
        out += `<g transform="translate(${f2(rx - 2)} ${f2(ry)}) scale(.7) translate(${f2(2 - rx)} ${f2(-ry)})">` + bird(rx - 2, ry - hop, { body: '#8B5A3C', breast: '#E86A3A', wing: '#6E4428', peck: f === 4 ? 1 : 0 }) + '</g>';
      } else if (kind === 1) {
        out += fern(0.38, -0.3, 0.8, 1) + fern(-0.42, 0.04, 0.9, 2)
          + stumpAt(T, -0.2, -0.14, 6, 0.09, 'st1') + stumpAt(T, 0.18, -0.2, 4, 0.08, 'st2') + stumpAt(T, 0.06, 0.2, 5, 0.085, 'st3');
        const [s1x, s1y] = T.p(-0.2, -0.04, 1.5), [s3x, s3y] = T.p(0.14, 0.26, 1);
        out += shroom(s1x + 3, s1y, 0.9) + shroom(s1x + 5.6, s1y + 0.8, 0.7) + shroom(s3x + 2, s3y, 0.8);
        const sway = wave(f, n, 1.4);
        out += sapling(...T.p(-0.24, 0.2, 0), 0.9, sway) + sapling(...T.p(0.28, 0.06, 0), 0.75, wave(f, n, 1.2, 1.7));
        // le lapin qui bondit d'une image sur deux
        const [lx, ly] = T.p(-0.02 + (f % 3) * 0.04, 0.42, 0), up = f % 2 ? 2.4 : 0;
        out += ell(lx, ly + 0.4, 3.6, 1, 'rgba(40,55,20,.22)')
          + ell(lx, ly - 2.6 - up, 3.6, 2.6, '#C8B49A', ` stroke="${OUT}" stroke-width="0.5"`) + dot(lx - 3.4, ly - 3 - up, 1.2, '#FFFFFF')
          + `<circle cx="${f2(lx + 3)}" cy="${f2(ly - 4.8 - up)}" r="2" fill="#C8B49A" stroke="${OUT}" stroke-width="0.5"/>`
          + `<ellipse cx="${f2(lx + 2.2)}" cy="${f2(ly - 8.2 - up)}" rx="0.9" ry="2.4" fill="#C8B49A" stroke="${OUT}" stroke-width="0.4" transform="rotate(-12 ${f2(lx + 2.2)} ${f2(ly - 8.2 - up)})"/>`
          + `<ellipse cx="${f2(lx + 3.6)}" cy="${f2(ly - 8)}" rx="0.9" ry="2.4" fill="#C8B49A" stroke="${OUT}" stroke-width="0.4" transform="rotate(14 ${f2(lx + 3.6)} ${f2(ly - 8)}) translate(0 ${f2(-up)})"/>`
          + dot(lx + 3.8, ly - 5 - up, 0.4, '#2A2024') + dot(lx + 4.9, ly - 4.4 - up, 0.35, '#E58A8F');
      } else {
        // le chevalet en X, le rondin, la scie qui va et vient, la sciure, les rondelles sciées
        out += fern(-0.4, 0.2, 0.9, 1.4);
        const legs = [-0.16, 0.16].map(dv => ln(T.p(-0.12, dv, 0), T.p(0.12, dv, 14), WOOD_DARK.right, 1.6) + ln(T.p(0.12, dv, 0), T.p(-0.12, dv, 14), WOOD_DARK.right, 1.6)).join('');
        out += T.disc(0.18, 0.2, 0, 0.1, '#E9C990') + legs + log(T, 0, -0.3, 0.26, 14, 3.8);
        const s = Math.sin((f / n) * TAU) * 0.08;
        const [ax, ay] = T.p(0.03, 0.1 + s, 15), [bx, by] = T.p(0.03, 0.34 + s, 22);
        out += poly([[ax - 1, ay + 1.6], [bx - 1, by - 0.4], [bx + 1, by - 2.4], [ax + 1, ay - 0.4]], '#D4DAE2', ` stroke="${OUT}" stroke-width="0.5" stroke-linejoin="round"`)
          + `<path d="M${f2(bx - 1)},${f2(by - 0.6)} l2.6,-4 l2,2.2 l-2.4,3.4 Z" fill="${WOOD.left}" stroke="${OUT}" stroke-width="0.5"/>`
          + [0.2, 0.35, 0.5, 0.65, 0.8].map(t => { const px = ax - 1 + (bx - ax) * t, py = ay + 1.6 + (by - 0.4 - ay - 1.6) * t; return ln([px, py], [px + 0.5, py + 0.9], IRON.right, 0.5); }).join('')
          + [0, 1, 2].map(i => { const t = ((f + i * 2) % n) / n; const [dx, dy] = T.p(0.04, 0.1, 13 - t * 12); return dot(dx + i - 1, dy, 0.6, '#E7C08A'); }).join('');
        out += [[0.3, -0.24, 0], [0.36, -0.12, 0], [0.33, -0.18, 2.4]].map(([du, dv, z]) => { const [rx, ry] = T.p(du, dv, z); return ell(rx, ry - 1.2, 2.8, 1.4, '#E7C08A', ` stroke="${WOOD.right}" stroke-width="0.6"`) + ell(rx, ry - 1.2, 1.4, 0.7, 'none', ` stroke="rgba(150,92,48,.5)" stroke-width="0.4"`); }).join('');
      }
      return out;
    }
  }]
};
// Remise à bois : appentis ouvert au toit de bardeaux moussu, bûches rangées en pile ; le billot et sa hache plantée,
// des bûches fendues, un fagot lié où se pose un rouge-gorge ; la lanterne pendue au bord du toit ; les copeaux
const remise = {
  light: () => [0.22, 0.27, 16, 14],
  layers: [{
    frame: [-36, -60, 72, 78],
    draw: T => {
      const [x, y] = T.p(0, 0, 0);
      // la terre battue, les copeaux
      let out = ell(x, y + 1, 33, 13.6, '#B89A6E', ` stroke="${OUT}" stroke-width="0.5"`) + ell(x - 4, y, 22, 8, '#C8AC80')
        + [[-20, 6], [8, 10], [22, 4], [14, 11], [-8, 10]].map(([dx, dy]) => `<path d="M${x + dx},${y + dy} q1.4,-1.6 2.4,0 q-0.6,1 -1.4,0.4" stroke="#E4C08A" stroke-width="0.6" fill="none"/>`).join('')
        + T.shadow(0, 0, 0.38, 0.2);
      // le mur du fond, le flanc, la pile de bûches
      let pile = '';
      for (let row = 0; row < 5; row++) {
        for (let k = 0; k < 6; k++) {
          const du = -0.24 + k * 0.095 + (row % 2) * 0.045;
          if (du > 0.27) continue;
          const [px, py] = T.p(du, 0.08, 2.6 + row * 4.4);
          pile += logEnd(px, py, 2.4) + ((row + k) % 4 === 0 ? `<path d="M${f2(px - 1.6)},${f2(py - 1.6)} l3.2,3.2" stroke="rgba(150,92,48,.5)" stroke-width="0.4"/>` : '');
        }
      }
      out += T.box(-0.33, -0.3, 0.33, -0.25, 0, 26, WOOD) + planksLeft(T.u - 0.33, T.u + 0.33, T.v - 0.25, 0, 26, 4.6)
        + T.box(-0.33, -0.25, -0.28, 0.2, 0, 24, WOOD)
        + pile;
      // les poteaux et le toit de bardeaux en appentis, sa mousse
      out += post(T, 0.3, 0.24, 0, 31) + post(T, -0.3, 0.24, 0, 31)
        + T.face([[-0.38, -0.34, 27], [0.38, -0.34, 27], [0.38, 0.3, 32], [-0.38, 0.3, 32]], '#A9703F', EDGE);
      for (const t of [0.2, 0.4, 0.6, 0.8]) {
        const v = -0.34 + 0.64 * t, z = 27 + 5 * t;
        out += ln(T.p(-0.38, v, z), T.p(0.38, v, z), 'rgba(90,55,25,.45)', 0.6);
        for (let i = 0; i < 7; i++) { const u = -0.34 + i * 0.11 + (Math.round(t * 5) % 2 ? 0.055 : 0); if (u < 0.36) out += ln(T.p(u, v, z), T.p(u, v + 0.128, z + 1), 'rgba(90,55,25,.3)', 0.5); }
      }
      out += [[-0.26, 0.2, 2.6], [-0.14, 0.26, 1.8], [0.24, -0.1, 1.6]].map(([u, v, r]) => { const [mx, my] = T.p(u, v, 27 + 5 * ((v + 0.34) / 0.64)); return ell(mx, my, r * 1.4, r * 0.7, '#7E9A52') + ell(mx - r * 0.3, my - r * 0.2, r * 0.6, r * 0.3, '#9DB86A'); }).join('')
        + T.face([[0.38, -0.34, 27], [0.38, 0.3, 32], [0.38, 0.3, 30.4], [0.38, -0.34, 25.4]], '#7A4E2C', EDGE)
        + T.face([[-0.38, 0.3, 32], [0.38, 0.3, 32], [0.38, 0.3, 30.4], [-0.38, 0.3, 30.4]], '#8B5A32', EDGE);
      // la lanterne pendue au bord du toit
      const [lx, ly] = T.p(0.22, 0.27, 17.6);
      out += ln(T.p(0.22, 0.27, 30.4), [lx, ly - 1.6], '#3D3A36', 0.5)
        + poly([[lx - 2.2, ly], [lx + 2.2, ly], [lx + 1.6, ly - 1.6], [lx - 1.6, ly - 1.6]], DARK_IRON.left, ` stroke="${OUT}" stroke-width="0.4"`)
        + `<rect x="${f2(lx - 1.8)}" y="${f2(ly)}" width="3.6" height="4" rx="0.6" fill="#F6D27A" stroke="${OUT}" stroke-width="0.5"/>`
        + ln([lx, ly], [lx, ly + 4], DARK_IRON.left, 0.4) + ell(lx, ly + 2, 1, 1.2, '#FFF3C4')
        + poly([[lx - 2.2, ly + 4], [lx + 2.2, ly + 4], [lx + 1.4, ly + 5.2], [lx - 1.4, ly + 5.2]], DARK_IRON.left, ` stroke="${OUT}" stroke-width="0.4"`);
      // le fagot lié, à gauche devant
      const [gx, gy] = T.p(-0.3, 0.38, 0);
      out += ell(gx, gy + 0.4, 7, 1.8, 'rgba(40,55,20,.22)')
        + [-2, -1, 0, 1, 2].map(i => ln([gx - 6, gy - 2.4 + i * 0.6], [gx + 6, gy - 3.4 + i * 0.7], i % 2 ? '#8A6A40' : '#A07A4A', 1)).join('')
        + ln([gx - 1, gy - 5], [gx - 0.6, gy - 0.4], '#C9A46A', 1.1) + ln([gx + 2.4, gy - 5.4], [gx + 2.8, gy - 0.8], '#C9A46A', 1.1);
      // le rouge-gorge posé sur le fagot
      out += `<g transform="translate(${f2(gx + 1)} ${f2(gy - 4.6)}) scale(.65) translate(${f2(-gx - 1)} ${f2(-gy + 4.6)})">` + bird(gx + 1, gy - 4.6, { body: '#8B6A4A', breast: '#E2703A', wing: '#6E5236' }) + '</g>';
      // le billot, sa hache plantée, les bûches fendues
      out += stumpAt(T, 0.24, 0.38, 6, 0.06, 'bil');
      const [hx, hy] = T.p(0.24, 0.38, 6);
      out += ln([hx + 0.6, hy - 1], [hx + 6, hy - 9], WOOD.right, 1.4) + ln([hx + 0.9, hy - 1.2], [hx + 6.2, hy - 9.2], WOOD.top, 0.5)
        + poly([[hx - 2.4, hy + 0.4], [hx + 1.6, hy - 2.2], [hx + 2.4, hy - 0.4], [hx - 1, hy + 1.6]], IRON.left, ` stroke="${OUT}" stroke-width="0.5" stroke-linejoin="round"`)
        + ln([hx - 2, hy + 0.6], [hx - 0.6, hy + 1.4], IRON.top, 0.5)
        + log(T, 0.06, 0.32, 0.42, 1.8, 1.8) + log(T, -0.06, 0.34, 0.44, 1.8, 1.8)
        + [[0.34, 0.3], [0.14, 0.46]].map(([du, dv]) => { const [cx, cy] = T.p(du, dv, 0); return poly([[cx - 2.2, cy], [cx, cy - 2.6], [cx + 2.2, cy - 0.4], [cx + 0.4, cy + 0.6]], STUMP.top, ` stroke="${OUT}" stroke-width="0.4"`); }).join('');
      return out;
    }
  }]
};
// Pépinière : petite serre de verre sur l'herbe, semis en pots étiquetés sur leurs étagères, arrosoir, sac de terreau
// et transplantoir, jeunes plants devant ; un reflet glisse sur les vitres, une lueur chaude la nuit
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
            + `<circle cx="${f2(x)}" cy="${f2(y - 5)}" r="2.1" fill="${(du * 10) % 2 ? LEAF_LIGHT : LEAF}"/><circle cx="${f2(x - 1)}" cy="${f2(y - 5.6)}" r="0.9" fill="#B3E386"/>`
            + ln([x + 1.2, y - 2.6], [x + 1.8, y - 6.4], '#E8DCC0', 0.5) + `<rect x="${f2(x + 1.1)}" y="${f2(y - 7.6)}" width="1.6" height="1.2" fill="#F4ECDC"/>`);
        }
      }
      const g = (f / n) * 1.4 - 0.2;
      const glint = g > 0 && g < 1 ? T.face([[-0.28 + g * 0.5, 0.26, 2], [-0.22 + g * 0.5, 0.26, 2], [-0.12 + g * 0.5, 0.26, 21], [-0.18 + g * 0.5, 0.26, 21]], 'rgba(255,255,255,.55)') : '';
      const [gx, gy] = T.p(0, 0, 0);
      return ell(gx, gy + 1, 32, 13, '#9CC46A', ` stroke="${OUT}" stroke-width="0.5"`) + ell(gx - 4, gy, 22, 8, '#ADD27A')
        + ell(...T.p(-0.3, 0.36, 0), 7, 2.6, '#8A6A46')
        + T.shadow(0, 0, 0.38, 0.18)
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
        + (() => { const [kx, ky] = T.p(0.4, 0.06, 0); return ell(kx + 1, ky + 0.4, 4.6, 1.4, 'rgba(40,55,20,.22)')
          + `<path d="M${f2(kx - 3.6)},${f2(ky)} C${f2(kx - 4.4)},${f2(ky - 4)} ${f2(kx - 3)},${f2(ky - 7)} ${f2(kx - 1.4)},${f2(ky - 7.6)} L${f2(kx + 1.6)},${f2(ky - 7.6)} C${f2(kx + 3)},${f2(ky - 7)} ${f2(kx + 4.4)},${f2(ky - 4)} ${f2(kx + 3.6)},${f2(ky)} Z" fill="#B88A5A" stroke="${OUT}" stroke-width="0.5"/>`
          + ell(kx, ky - 7.6, 1.8, 0.7, '#5A3A22') + ln([kx - 2, ky - 4], [kx + 2, ky - 3.6], '#7FAE4E', 1.2) + dot(kx, ky - 4.6, 0.8, '#E2574C')
          + poly([[kx - 6.4, ky + 0.6], [kx - 4.6, ky + 0.6], [kx - 4.8, ky - 2.2], [kx - 6.2, ky - 2.2]], IRON.left, ` stroke="${OUT}" stroke-width="0.4"`) + ln([kx - 5.5, ky - 2.2], [kx - 5.2, ky - 5.6], WOOD.right, 1.1); })()
        + [[-0.22, 0.36], [-0.32, 0.3]].map(([a, b]) => { const [x, y] = T.p(a, b, 0); return `<path d="M${f2(x - 2.4)},${f2(y - 3.4)} L${f2(x - 1.8)},${f2(y)} L${f2(x + 1.8)},${f2(y)} L${f2(x + 2.4)},${f2(y - 3.4)} Z" fill="#D9844E" stroke="${OUT}" stroke-width="0.4"/>${sapling(x, y - 3, 0.45, wave(f, n, 0.6, a * 9))}`; }).join('');
    }
  }]
};

/* ---------- Puits ---------- */
// Citerne : tonneau cerclé sur son chevalet croisé, avec couvercle, robinet et louche ; cuve de pierre appareillée et
// moussue, sa pompe dont le levier monte et descend ; ou réservoir de cuivre riveté, son dôme, sa vanne et son vert-de-
// gris. L'eau goutte dans le seau et fait des ronds ; l'herbe, une flaque sous le bec, des touffes
const citerne = {
  layers: [{
    frame: [-30, -62, 60, 78],
    n: 6,
    fps: 6,
    draw: (T, f, n, variant) => {
      const kind = variant % 3;
      const [x, y] = T.p(0, 0, 0);
      const tuft = (du, dv) => { const [tx, ty] = T.p(du, dv, 0); return [-1.6, -0.5, 0.6, 1.6].map((o, i) => ln([tx + o * 0.4, ty], [tx + o, ty - (3.4 + (i % 2) * 1.4)], i % 2 ? '#8FB85A' : '#6F9A44', 0.7)).join(''); };
      let out = ell(x, y + 1, 27, 11.4, '#9CC46A', ` stroke="${OUT}" stroke-width="0.5"`) + ell(x - 3, y, 18, 7, '#ADD27A')
        + ell(...T.p(0.22, 0.3, 0), 7.4, 2.8, 'rgba(90,120,60,.35)') + ell(...T.p(0.22, 0.32, 0), 5, 1.6, 'rgba(110,180,220,.5)')
        + tuft(-0.38, 0.1) + tuft(0.36, -0.3) + T.shadow(0, 0, 0.32, 0.2);
      let spout;
      if (kind === 0) {
        // le chevalet croisé, le tonneau, ses douelles et ses cercles, le couvercle, le robinet, la louche
        out += [[-0.14, -0.14], [0.14, -0.14], [-0.14, 0.14], [0.14, 0.14]].map(([a, b]) => post(T, a, b, 0, 12, WOOD_DARK, 0.02)).join('')
          + ln(T.p(-0.14, 0.14, 1), T.p(0.14, 0.14, 11), WOOD_DARK.right, 0.9) + ln(T.p(0.14, 0.14, 1), T.p(-0.14, 0.14, 11), WOOD_DARK.right, 0.9)
          + ln(T.p(0.14, 0.14, 1), T.p(0.14, -0.14, 11), WOOD_DARK.right, 0.9) + ln(T.p(0.14, -0.14, 1), T.p(0.14, 0.14, 11), WOOD_DARK.right, 0.9)
          + T.box(-0.17, -0.17, 0.17, 0.17, 12, 14, WOOD)
          + T.cyl(0, 0, 14, 38, 0.2, { top: '#C99560', left: WOOD.left, right: WOOD.right }, 'tonneau');
        const [cx, cy] = T.p(0, 0, 14);
        for (let i = 1; i < 6; i++) { const a = (i / 6) * Math.PI; out += ln([cx + 9 * Math.cos(a), cy + 4.5 * Math.sin(a)], [cx + 9 * Math.cos(a), cy + 4.5 * Math.sin(a) - 24], 'rgba(90,55,30,.35)', 0.5); }
        out += [17, 26, 35].map(z => { const [hx, hy] = T.p(0, 0, z); return `<path d="M${f2(hx - 9)},${f2(hy)} A9,4.5 0 0 0 ${f2(hx + 9)},${f2(hy)}" stroke="${DARK_IRON.right}" stroke-width="1.3" fill="none"/>`; }).join('');
        const [lx, ly] = T.p(0, 0, 38);
        out += ell(lx, ly, 7.4, 3.7, WOOD.top, ` stroke="${OUT}" stroke-width="0.6"`) + ln([lx - 5, ly - 0.4], [lx + 5, ly + 0.4], 'rgba(90,55,30,.4)', 0.5)
          + `<path d="M${f2(lx - 2.6)},${f2(ly)} q2.6,-3 5.2,0" stroke="${WOOD_DARK.right}" stroke-width="1" fill="none"/>`;
        spout = T.p(0.1, 0.18, 16);
        out += ln(T.p(0.06, 0.12, 17), spout, IRON.right, 1.8) + ln([spout[0] - 1, spout[1] - 2.6], [spout[0] + 1.4, spout[1] - 2.6], IRON.left, 1.2);
        const [kx, ky] = T.p(-0.1, 0.17, 35);
        out += `<path d="M${f2(kx)},${f2(ky - 1.6)} q1.4,0 1.2,1.6" stroke="${DARK_IRON.right}" stroke-width="0.6" fill="none"/>` + ln([kx + 1.2, ky], [kx + 0.6, ky + 8], WOOD_DARK.right, 1) + ell(kx + 0.5, ky + 9.6, 2.2, 1.4, IRON.left, ` stroke="${OUT}" stroke-width="0.5"`);
      } else if (kind === 1) {
        // la cuve de pierre appareillée, sa mousse, son couvercle de planches ; la pompe et son levier qui pompe
        out += T.cyl(0, -0.04, 0, 16, 0.24, STONE, 'cuve');
        const [cx, cy] = T.p(0, -0.04, 0), R = 10.9;
        [5.3, 10.6].forEach((z, i) => { out += `<path d="M${f2(cx - R)},${f2(cy - z)} A${R},${R / 2} 0 0 0 ${f2(cx + R)},${f2(cy - z)}" stroke="rgba(120,110,95,.45)" stroke-width="0.6" fill="none"/>`; });
        for (const [z0, off] of [[0, 0], [5.3, 0.5], [10.6, 0]]) for (let j = 0; j < 4; j++) { const a = (j + 0.5 + off) / 4.5 * Math.PI; if (a < Math.PI) out += ln([cx + R * Math.cos(a), cy - z0 + (R / 2) * Math.sin(a)], [cx + R * Math.cos(a), cy - z0 - 5.3 + (R / 2) * Math.sin(a)], 'rgba(120,110,95,.4)', 0.5); }
        out += ell(...T.p(-0.18, 0.1, 2), 3.4, 1.4, '#7E9A52') + ell(...T.p(0.04, 0.2, 1.6), 2.6, 1, '#9DB86A')
          + T.disc(0, -0.04, 16, 0.2, WOOD.top, EDGE)
          + [-0.08, 0, 0.08].map(o => ln(T.p(-0.14, -0.04 + o, 16.4), T.p(0.14, -0.04 + o, 16.4), 'rgba(90,55,30,.45)', 0.6)).join('');
        const lever = Math.sin((f / n) * TAU) * 4;
        out += T.box(0.12, 0.1, 0.18, 0.16, 0, 26, IRON) + ln(T.p(0.12, 0.16, 2), T.p(0.12, 0.16, 25), 'rgba(255,255,255,.3)', 0.6)
          + T.box(0.11, 0.09, 0.19, 0.17, 26, 27.6, DARK_IRON)
          + `<path d="M${f2(T.p(0.15, 0.13, 27)[0])},${f2(T.p(0.15, 0.13, 27)[1])} Q${f2(T.p(0.06, 0.18, 31)[0])},${f2(T.p(0.06, 0.18, 31)[1] - lever * 0.5)} ${f2(T.p(-0.04, 0.22, 30)[0])},${f2(T.p(-0.04, 0.22, 30)[1] - lever)}" stroke="${IRON.right}" stroke-width="1.5" fill="none" stroke-linecap="round"/>`
          + dot(T.p(-0.04, 0.22, 30)[0], T.p(-0.04, 0.22, 30)[1] - lever, 1.2, WOOD.left);
        spout = T.p(0.15, 0.2, 18);
        out += ln(T.p(0.15, 0.15, 19), spout, IRON.right, 1.9);
      } else {
        // le socle, le réservoir de cuivre riveté et son vert-de-gris, le dôme, le bouchon, la vanne
        const [dx0, dy0] = T.p(0, -0.02, 26);
        out += T.box(-0.24, -0.24, 0.22, 0.2, 0, 4, STONE)
          + T.cyl(0, -0.02, 4, 26, 0.23, COPPER, 'cuivre')
          + [9, 18].map(z => { const [hx, hy] = T.p(0, -0.02, z); return `<path d="M${f2(hx - 10.4)},${f2(hy)} A10.4,5.2 0 0 0 ${f2(hx + 10.4)},${f2(hy)}" stroke="#8A4A22" stroke-width="0.6" fill="none"/>` + [-7, 0, 7].map(dx => dot(hx + dx, hy + 4.6 - Math.abs(dx) * 0.3, 0.6, '#8A4A22')).join(''); }).join('')
          + [[-5, 8, 2.4], [4, 15, 1.8], [-1, 20, 1.4]].map(([dx, dz, r]) => { const [hx, hy] = T.p(0, -0.02, 4); return ell(hx + dx, hy - dz, r, r * 0.6, 'rgba(110,190,160,.55)'); }).join('')
          + ln(T.p(-0.1, 0.14, 6), T.p(-0.1, 0.14, 24), 'rgba(255,255,255,.35)', 1.6)
          + `<path d="M${f2(dx0 - 10.4)},${f2(dy0)} C${f2(dx0 - 10.4)},${f2(dy0 - 10)} ${f2(dx0 + 10.4)},${f2(dy0 - 10)} ${f2(dx0 + 10.4)},${f2(dy0)} A10.4,5.2 0 0 1 ${f2(dx0 - 10.4)},${f2(dy0)} Z" fill="${COPPER.top}" stroke="${OUT}" stroke-width="0.5"/>`
          + ell(dx0 - 3, dy0 - 5, 3, 1.4, 'rgba(255,255,255,.35)') + T.cyl(0, -0.02, 33, 36, 0.03, COPPER, 'bouchon');
        spout = T.p(0.1, 0.17, 10);
        const [vx, vy] = T.p(0.2, 0.06, 15);
        out += ln(T.p(0.06, 0.12, 11), spout, COPPER.right, 1.9)
          + ln(T.p(0.16, 0.06, 15), [vx, vy], DARK_IRON.right, 1.2) + `<circle cx="${f2(vx + 1.6)}" cy="${f2(vy)}" r="2.2" fill="none" stroke="#C9302A" stroke-width="1"/>`
          + ln([vx - 0.6, vy], [vx + 3.8, vy], '#C9302A', 0.6) + ln([vx + 1.6, vy - 2.2], [vx + 1.6, vy + 2.2], '#C9302A', 0.6);
      }
      // le seau sous le bec, les gouttes, le rond dans l'eau
      const [bx, by] = T.p(0.2, 0.3, 0);
      out += bucket(T, 0.2, 0.3, 0, 7, 3.4, 4.2, { top: '#B98552', left: WOOD.left, right: WOOD.right }, 'seau');
      const p = (f % n) / n;
      out += dot(spout[0] + 0.5, spout[1] + 1 + p * (by - 7 - spout[1]), 1, '#7FC2EA');
      if (f % 3 === 0) out += ell(bx, by - 6.6, 2.4, 0.9, 'none', ' stroke="rgba(255,255,255,.75)" stroke-width="0.5"');
      return out;
    }
  }]
};
// Réservoir : cuve ronde en pierres appareillées sur quatre piliers reliés par des arches, sa margelle et son eau qui
// miroite, de la mousse ; l'échelle ; le trop-plein coule en filet dans une auge de pierre où boit une mésange
const reservoir = {
  layers: [{
    frame: [-32, -78, 64, 96],
    n: 6,
    fps: 3,
    draw: (T, f, n) => {
      const k = f / n;
      const [x, y] = T.p(0, 0, 0);
      // l'herbe, des cailloux, la flaque de l'auge
      let out = ell(x, y + 1, 30, 12.6, '#9CC46A', ` stroke="${OUT}" stroke-width="0.5"`) + ell(x - 4, y, 20, 7.6, '#ADD27A')
        + [[-22, 4], [20, 8], [-10, 9]].map(([dx, dy]) => ell(x + dx, y + dy, 1.6, 1, '#B8B0A0', ` stroke="${OUT}" stroke-width="0.4"`)).join('')
        + ell(...T.p(0.36, 0.3, 0), 7, 2.4, 'rgba(110,180,220,.55)') + T.shadow(0, 0, 0.36, 0.2);
      // les quatre piliers, les arches de devant, le linteau
      out += [[-0.17, -0.15], [0.17, -0.15], [-0.17, 0.15], [0.17, 0.15]].map(([a, b]) => T.box(a - 0.04, b - 0.04, a + 0.04, b + 0.04, 0, 23, STONE)
        + [5, 11, 17].map(z => ln(T.p(a - 0.04, b + 0.04, z), T.p(a + 0.04, b + 0.04, z), 'rgba(120,110,95,.4)', 0.5)).join('')).join('');
      const arch = (p0, p1) => { const [ax, ay] = p0, [bx, by] = p1; return `<path d="M${f2(ax)},${f2(ay)} Q${f2((ax + bx) / 2)},${f2((ay + by) / 2 - 9)} ${f2(bx)},${f2(by)}" stroke="${OUT}" stroke-width="4.4" fill="none"/><path d="M${f2(ax)},${f2(ay)} Q${f2((ax + bx) / 2)},${f2((ay + by) / 2 - 9)} ${f2(bx)},${f2(by)}" stroke="${STONE.left}" stroke-width="2.8" fill="none"/>`; };
      out += arch(T.p(-0.13, 0.19, 17), T.p(0.13, 0.19, 17)) + arch(T.p(0.21, 0.11, 17), T.p(0.21, -0.11, 17))
        + T.box(-0.24, -0.22, 0.24, 0.22, 23, 26, STONE);
      // la cuve en pierres appareillées
      out += T.cyl(0, 0, 26, 47, 0.27, STONE, 'cuve-r');
      const R = 12.2;
      [26, 31, 36, 41].forEach((z, i) => {
        const [cx, cy] = T.p(0, 0, z);
        if (i) out += `<path d="M${f2(cx - R)},${f2(cy)} A${R},${R / 2} 0 0 0 ${f2(cx + R)},${f2(cy)}" stroke="rgba(120,110,95,.45)" stroke-width="0.6" fill="none"/>`;
        for (let j = 0; j < 5; j++) { const a = (j + 0.5 + (i % 2) * 0.5) / 5.5 * Math.PI; if (a >= Math.PI) continue; const px = cx + R * Math.cos(a), py = cy + (R / 2) * Math.sin(a); out += ln([px, py], [px, py - 5], 'rgba(120,110,95,.4)', 0.5); }
      });
      out += [[-0.2, 0.12, 27, 3], [0.06, 0.24, 27, 2.4], [0.24, 0.02, 33, 1.8]].map(([u, v, z, r]) => { const [mx, my] = T.p(u, v, z); return ell(mx, my, r * 1.3, r * 0.6, '#7E9A52') + ell(mx - r * 0.3, my - r * 0.2, r * 0.6, r * 0.3, '#9DB86A'); }).join('');
      // la margelle et l'eau qui miroite
      const [wx, wy] = T.p(0, 0, 47);
      out += ell(wx, wy, R + 1.4, (R + 1.4) / 2, STONE.top, ` stroke="${OUT}" stroke-width="0.7"`) + ell(wx, wy + 0.4, R - 1.4, (R - 1.4) / 2, '#4C9CC8', ` stroke="${STONE.right}" stroke-width="0.6"`)
        + [0, 1, 2].map(i => { const a = k * TAU + i * 2.1; return ell(wx + Math.cos(a) * 5.6, wy + 0.4 + Math.sin(a) * 1.8, 2.4, 0.6, 'rgba(255,255,255,.6)'); }).join('');
      // l'échelle sur le devant
      out += ln(T.p(-0.12, 0.31, 0), T.p(-0.12, 0.28, 48), WOOD.right, 1.2) + ln(T.p(0.0, 0.31, 0), T.p(0.0, 0.28, 48), WOOD.right, 1.2)
        + [5, 12, 19, 26, 33, 40].map(z => ln(T.p(-0.12, 0.31 - z * 0.0006, z), T.p(0.0, 0.31 - z * 0.0006, z), WOOD.top, 0.9)).join('');
      // le trop-plein, son filet d'eau, l'auge et ses ronds
      const [ox, oy] = T.p(0.36, 0.1, 30);
      const [tx, ty] = T.p(0.36, 0.3, 5);
      out += ln(T.p(0.26, 0.05, 30), [ox, oy], DARK_IRON.right, 1.8) + ln(T.p(0.26, 0.05, 30.4), [ox, oy - 0.4], IRON.top, 0.5)
        + `<path d="M${f2(ox)},${f2(oy + 0.6)} Q${f2(ox + 1.6)},${f2(oy + 6)} ${f2(tx)},${f2(ty)}" stroke="#7FC2EA" stroke-width="1.4" fill="none" stroke-dasharray="3 2" stroke-dashoffset="${f2(-k * 10)}"/>`
        + T.box(0.26, 0.2, 0.46, 0.4, 0, 5, STONE) + T.face([[0.28, 0.22, 5], [0.44, 0.22, 5], [0.44, 0.38, 5], [0.28, 0.38, 5]], '#4C9CC8')
        + `<ellipse cx="${f2(tx)}" cy="${f2(ty)}" rx="${f2(1.6 + k * 4)}" ry="${f2(0.8 + k * 2)}" fill="none" stroke="rgba(255,255,255,${f2(0.8 * (1 - k))})" stroke-width="0.6"/>`;
      // la mésange au bord de l'auge, elle boit une image sur deux
      const [bx, by] = T.p(0.45, 0.24, 5);
      return out + `<g transform="translate(${f2(bx)} ${f2(by)}) scale(.7) translate(${f2(-bx)} ${f2(-by)})">` + bird(bx, by, { body: '#5E8CC8', breast: '#F2D25A', wing: '#3E6AA0', flip: true, peck: f % 2 }) + '</g>';
    }
  }]
};
// Éolienne de pompage : pylône de bois aux croisillons, échelle et plateforme ; la roue à pales rouges et crème cerclée
// qui tourne au vent, son gouvernail étoilé ; la tige pompe l'eau qui coule du bec dans l'abreuvoir, où boit un mouton ;
// l'herbe fleurie
const eolienne = {
  layers: [{
    frame: [-34, -108, 68, 126],
    n: 8,
    fps: 8,
    draw: (T, f, n) => {
      const top = 64;
      const [x, y] = T.p(0, 0, 0);
      // l'herbe et ses fleurs
      let out = ell(x, y + 1, 30, 12.6, '#9CC46A', ` stroke="${OUT}" stroke-width="0.5"`) + ell(x - 4, y, 20, 7.6, '#ADD27A')
        + [[-18, 6, '#F2C04B'], [-14, 8, '#FFFFFF'], [16, 7, '#E89AC0'], [22, 3, '#F2C04B'], [8, 10, '#FFFFFF'], [-24, 1, '#E89AC0']].map(([dx, dy, c]) => ln([x + dx, y + dy], [x + dx, y + dy - 2.6], '#6F8C46', 0.5) + dot(x + dx, y + dy - 2.8, 0.9, c)).join('')
        + T.shadow(0, 0, 0.38, 0.18);
      // le pylône : quatre pieds, des ceintures et des croisillons sur les faces visibles
      const legs = [[-0.2, -0.2], [0.2, -0.2], [-0.2, 0.2], [0.2, 0.2]];
      const ringAt = z => { const k = 1 - (z / top) * 0.75; return legs.map(([a, b]) => T.p(a * k, b * k, z)); };
      out += legs.map(([a, b]) => ln(T.p(a, b, 0), T.p(a * 0.25, b * 0.25, top), WOOD_DARK.right, 1.7)).join('');
      const zs = [0, 12, 26, 40, 52];
      zs.forEach((z, i) => {
        const r = ringAt(z);
        if (i) out += ln(r[0], r[1], WOOD.left, 0.9) + ln(r[1], r[3], WOOD.left, 1) + ln(r[3], r[2], WOOD.left, 1) + ln(r[2], r[0], WOOD.left, 0.9);
        if (i < zs.length - 1) { const s = ringAt(zs[i + 1]); out += ln(r[2], s[3], 'rgba(110,74,44,.8)', 0.6) + ln(r[3], s[2], 'rgba(110,74,44,.8)', 0.6) + ln(r[1], s[3], 'rgba(110,74,44,.8)', 0.6) + ln(r[3], s[1], 'rgba(110,74,44,.8)', 0.6); }
      });
      // l'échelle le long du pied de devant, la plateforme et sa rambarde
      out += ln(T.p(-0.17, 0.23, 0), T.p(-0.06, 0.1, 57), WOOD.right, 0.9) + ln(T.p(-0.23, 0.17, 0), T.p(-0.1, 0.06, 57), WOOD.right, 0.9)
        + [6, 14, 22, 30, 38, 46, 54].map(z => { const k = z / 57; return ln(T.p(-0.17 + 0.11 * k, 0.23 - 0.13 * k, z), T.p(-0.23 + 0.13 * k, 0.17 - 0.11 * k, z), WOOD.top, 0.7); }).join('')
        + T.box(-0.11, -0.11, 0.11, 0.11, 57, 58.6, WOOD)
        + [[-0.11, 0.11], [0.11, 0.11], [0.11, -0.11]].map(([a, b]) => ln(T.p(a, b, 58.6), T.p(a, b, 62), WOOD_DARK.right, 0.8)).join('')
        + ln(T.p(-0.11, 0.11, 62), T.p(0.11, 0.11, 62), WOOD.top, 0.8) + ln(T.p(0.11, 0.11, 62), T.p(0.11, -0.11, 62), WOOD.top, 0.8);
      // la tige de pompe, la tête de pompe et son bec, le filet d'eau, l'abreuvoir
      const k = f / n;
      out += ln(T.p(0, 0, 4), T.p(0, 0, top), IRON.right, 0.9)
        + T.box(-0.04, -0.04, 0.04, 0.04, 0, 9, DARK_IRON) + ln(T.p(0, 0.04, 7), T.p(-0.1, 0.16, 6.6), DARK_IRON.left, 1.6) + ln(T.p(0.06, 0, 9), T.p(0.12, 0, 11 + Math.sin(k * TAU) * 1.4), DARK_IRON.right, 1);
      const [sx, sy] = T.p(-0.1, 0.16, 6.2), [wx, wy] = T.p(-0.14, 0.2, 4);
      out += `<path d="M${f2(sx)},${f2(sy)} L${f2(wx)},${f2(wy)}" stroke="#7FC2EA" stroke-width="1.2" stroke-dasharray="1.6 1.2" stroke-dashoffset="${f2(-k * 6)}"/>`
        + T.box(-0.34, 0.12, -0.04, 0.34, 0, 4, WOOD_DARK) + T.face([[-0.32, 0.14, 4], [-0.06, 0.14, 4], [-0.06, 0.32, 4], [-0.32, 0.32, 4]], '#4C9CC8')
        + ln(T.p(-0.34, 0.34, 2), T.p(-0.04, 0.34, 2), 'rgba(40,25,15,.35)', 0.6)
        + `<ellipse cx="${f2(wx)}" cy="${f2(wy)}" rx="${f2(1.4 + k * 3.4)}" ry="${f2(0.7 + k * 1.7)}" fill="none" stroke="rgba(255,255,255,${f2(0.8 * (1 - k))})" stroke-width="0.6"/>`
        + ell(...T.p(-0.24, 0.26, 4), 2.6, 0.6, 'rgba(255,255,255,.55)');
      // le mouton qui boit à l'abreuvoir
      const [mx, my] = T.p(-0.46, 0.34, 0);
      out += sheep(mx, my, false, f % 4 < 2);
      // le chapeau de la roue, le gouvernail étoilé
      const [hx, hy] = T.p(0.02, 0.08, top + 6);
      out += T.box(-0.05, -0.05, 0.05, 0.05, top, top + 3, WOOD)
        + poly([T.p(-0.02, -0.04, top + 7), T.p(-0.3, -0.34, top + 12), T.p(-0.3, -0.34, top + 2)], '#F4ECDC', ` stroke="${OUT}" stroke-width="0.5"`)
        + star(...T.p(-0.22, -0.25, top + 7), 2.4, '#E2574C')
        + ln(T.p(0, 0, top + 6), T.p(-0.24, -0.28, top + 7), WOOD_DARK.right, 1.2);
      // la roue : pales rouges et crème, son cercle de fer, son moyeu
      const turn = k * (TAU / 12);
      const pt = (a, r) => [hx + Math.cos(a) * r * 0.82, hy + Math.sin(a) * r];
      for (let i = 0; i < 12; i++) {
        const a = turn + (i / 12) * TAU;
        out += poly([pt(a - 0.12, 4), pt(a - 0.16, 19), pt(a + 0.16, 19), pt(a + 0.12, 4)], i % 2 ? '#F4ECDC' : '#E2574C', ` stroke="${OUT}" stroke-width="0.4"`);
      }
      out += `<ellipse cx="${f2(hx)}" cy="${f2(hy)}" rx="${f2(19.4 * 0.82)}" ry="19.4" fill="none" stroke="${OUT}" stroke-width="1.6"/><ellipse cx="${f2(hx)}" cy="${f2(hy)}" rx="${f2(19.4 * 0.82)}" ry="19.4" fill="none" stroke="${IRON.left}" stroke-width="0.8"/>`
        + `<ellipse cx="${f2(hx)}" cy="${f2(hy)}" rx="${f2(10 * 0.82)}" ry="10" fill="none" stroke="rgba(60,40,25,.45)" stroke-width="0.6"/>`
        + dot(hx, hy, 2.6, DARK_IRON.right) + dot(hx - 0.7, hy - 0.8, 0.8, IRON.top);
      return out;
    }
  }]
};

/* ---------- Ponton ---------- */
// Vivier : bassin rond bordé de pierres, carpes (orange, argent ou bleu-or selon l'exemplaire) qui tournent, nénuphar
const FISH = [['#F08A3A', '#FFFFFF'], ['#C7D0DA', '#8E9AA8'], ['#5A8FD8', '#F2C04B']];
// … dans l'herbe : l'eau plus profonde au centre et ses reflets, deux nénuphars dont l'un porte une grenouille, des
// massettes, une libellule qui vole
const vivier = {
  layers: [{
    frame: [-34, -30, 68, 48],
    n: 8,
    fps: 4,
    draw: (T, f, n, variant) => {
      const [base, spot] = FISH[variant % 3];
      const [cx, cy] = T.p(0, 0, 0);
      const k8 = f / n;
      // l'herbe autour, le bassin, sa profondeur, ses reflets
      let out = ell(cx, cy + 1, 32, 13, '#9CC46A', ` stroke="${OUT}" stroke-width="0.5"`) + ell(cx - 4, cy, 24, 9, '#ADD27A')
        + ell(cx + 1, cy + 1.2, 24, 12.4, 'rgba(40,55,20,.2)')
        + ell(cx, cy, 21, 10.6, '#3E86B5') + ell(cx - 2, cy - 1, 17, 7.6, '#5FAFD6') + ell(cx + 1, cy + 0.6, 9, 4, '#4C9CC8')
        + [[-8, -3], [6, 2]].map(([dx, dy], i) => ln([cx + dx - 3 + (i ? -k8 : k8) * 2, cy + dy], [cx + dx + 2 + (i ? -k8 : k8) * 2, cy + dy - 0.4], 'rgba(255,255,255,.55)', 0.7)).join('');
      // les carpes qui tournent, un rond
      out += [0, 1, 2].map(k => { const a = k8 * TAU + (k * TAU) / 3; return fishTop(cx + Math.cos(a) * 10, cy + Math.sin(a) * 4.6, a + Math.PI / 2, base, k === 1 ? null : spot); }).join('')
        + ell(cx + Math.cos(k8 * TAU) * 10, cy + Math.sin(k8 * TAU) * 4.6, 3 + (f % 2), 1.2, 'none', ' stroke="rgba(255,255,255,.5)" stroke-width="0.5"');
      // deux nénuphars, la grenouille sur le premier
      const pad = (px, py, r) => ell(px, py, r, r / 2, '#5FA04A', ` stroke="#3E7A34" stroke-width="0.4"`) + poly([[px, py], [px + r, py - r * 0.18], [px + r * 0.9, py + r * 0.14]], '#3E86B5');
      out += pad(cx + 9, cy - 3, 4) + dot(cx + 7.6, cy - 4.2, 1.2, '#F6A8C8') + dot(cx + 7.6, cy - 4.2, 0.5, '#FFE08A')
        + pad(cx - 7, cy + 3.6, 3.4);
      const jump = f === 5 ? 1.6 : 0;
      out += ell(cx - 7.4, cy + 2.4 - jump, 2.2, 1.5, '#7FBF4A', ` stroke="${OUT}" stroke-width="0.4"`)
        + dot(cx - 8.6, cy + 1.2 - jump, 0.9, '#7FBF4A') + dot(cx - 6.4, cy + 1.2 - jump, 0.9, '#7FBF4A')
        + dot(cx - 8.6, cy + 1.1 - jump, 0.4, '#2A2024') + dot(cx - 6.4, cy + 1.1 - jump, 0.4, '#2A2024')
        + `<path d="M${f2(cx - 8.4)},${f2(cy + 2.6 - jump)} q0.9,0.6 1.8,0" stroke="#3E7A34" stroke-width="0.4" fill="none"/>`;
      // la bordure de pierres
      for (let k = 0; k < 14; k++) {
        const a = (k / 14) * TAU;
        out += ell(cx + Math.cos(a) * 21, cy + Math.sin(a) * 10.6, 3.6, 2.4, k % 2 ? STONE.left : STONE.top, ` stroke="${OUT}" stroke-width="0.4"`);
      }
      // les massettes, à gauche et à droite
      out += [[-17, -6, 0], [-14, -7, 1], [-19.4, -5, 2], [18, -4, 3]].map(([dx, dy, i]) => { const s = wave(f, n, 0.8, i); return ln([cx + dx, cy + dy], [cx + dx + s, cy + dy - 10 - (i % 2) * 2], i % 2 ? LEAF_LIGHT : LEAF, 0.9) + ell(cx + dx + s, cy + dy - 11 - (i % 2) * 2, 0.9, 2.2, '#7A4E2C', ` stroke="${OUT}" stroke-width="0.3"`); }).join('')
        + [-1.6, 1.6].map(o => `<path d="M${f2(cx - 16)},${f2(cy - 6)} q${f2(o)},-4 ${f2(o * 2)},-7" stroke="${LEAF}" stroke-width="0.8" fill="none"/>`).join('');
      // la libellule qui vole au-dessus de l'eau
      const la = k8 * TAU, [dx2, dy2] = [cx + Math.cos(la) * 8, cy - 12 + Math.sin(la * 2) * 2];
      out += ln([dx2 - 3, dy2], [dx2 + 3, dy2], '#3A7AB8', 0.9)
        + [-1, 1].map(s => ell(dx2 + 0.6, dy2 + s * (f % 2 ? 1.2 : 0.6), 1.6, 0.5, 'rgba(220,240,255,.85)')).join('') + dot(dx2 + 3, dy2, 0.6, '#3A7AB8');
      return out;
    }
  }]
};
// Fumoir : cabane de planches à couvre-joints sous un toit d'ardoises, porte basse où rougeoient les braises, fumée qui
// s'échappe du lanterneau et de la lucarne ; séchoir où pendent des poissons dorés et argentés qui se balancent, un
// chat assis dessous qui les guette ; la réserve de bûches, le panier de poissons, les copeaux
const fumoir = {
  light: () => [0, 0.2, 5, 11, '255,140,70'],
  layers: [{
    frame: [-34, -82, 68, 100],
    n: 8,
    fps: 3,
    draw: (T, f, n) => {
      const [x, y] = T.p(0, 0, 0);
      // la terre battue et les copeaux
      let out = ell(x, y + 1, 31, 13, '#B89A6E', ` stroke="${OUT}" stroke-width="0.5"`) + ell(x - 4, y, 21, 8, '#C8AC80')
        + [[-16, 8], [12, 9], [20, 3], [-24, 3]].map(([dx, dy]) => `<path d="M${x + dx},${y + dy} q1.4,-1.6 2.4,0 q-0.6,1 -1.4,0.4" stroke="#E4C08A" stroke-width="0.6" fill="none"/>`).join('')
        + T.shadow(0, 0, 0.38, 0.2);
      // la réserve de bûches, à gauche
      const [lx, ly] = T.p(-0.44, 0.12, 0);
      out += [[-3.6, -2.2], [0, -2.2], [3.6, -2.2], [-1.8, -5.6], [1.8, -5.6]].map(([dx, dy]) => logEnd(lx + dx, ly + dy, 1.9)).join('');
      // la cabane : planches, couvre-joints, porte et braises, lucarne
      out += T.box(-0.24, -0.22, 0.18, 0.2, 0, 22, WOOD_DARK)
        + planksLeft(T.u - 0.24, T.u + 0.18, T.v + 0.2, 0, 22, 4) + planksRight(T.u + 0.18, T.v - 0.22, T.v + 0.2, 0, 22, 4)
        + [-0.16, 0.1].map(u => ln(T.p(u, 0.2, 0.5), T.p(u, 0.2, 21.5), WOOD.left, 1.2)).join('')
        + [-0.12, 0.08].map(v => ln(T.p(0.18, v, 0.5), T.p(0.18, v, 21.5), WOOD_DARK.left, 1.2)).join('')
        + T.face([[-0.06, 0.2, 0], [0.06, 0.2, 0], [0.06, 0.2, 14], [-0.06, 0.2, 14]], '#2E1E14', ` stroke="${OUT}" stroke-width="0.6"`)
        + T.face([[-0.04, 0.2, 1], [0.04, 0.2, 1], [0.04, 0.2, 4], [-0.04, 0.2, 4]], f % 2 ? '#FF9A4A' : '#E8743A')
        + dot(...T.p(-0.02, 0.2, 2.4), 0.6, '#FFE08A') + dot(...T.p(0.02, 0.2, 2), 0.5, '#FFD070')
        + T.face([[0.18, -0.08, 13], [0.18, 0.02, 13], [0.18, 0.02, 18], [0.18, -0.08, 18]], '#2E1E14', ` stroke="${OUT}" stroke-width="0.5"`)
        + ln(T.p(0.18, -0.03, 13), T.p(0.18, -0.03, 18), WOOD.left, 0.7);
      // le toit d'ardoises et ses rangs, le lanterneau
      out += T.gable(-0.24, -0.22, 0.18, 0.2, 22, 11, { front: SLATE_ROOF.front, back: SLATE_ROOF.back, gable: WOOD_DARK.right }, 0.05);
      for (const t of [0.33, 0.66]) out += ln(T.p(-0.29, 0.25 * t, 33 - 11 * t), T.p(0.23, 0.25 * t, 33 - 11 * t), 'rgba(40,48,66,.5)', 0.6);
      out += T.box(-0.06, -0.05, 0.04, 0.05, 31, 37, WOOD_DARK) + T.gable(-0.06, -0.05, 0.04, 0.05, 37, 3, { front: SLATE_ROOF.front, back: SLATE_ROOF.back, gable: WOOD_DARK.right }, 0.03)
        + ln(T.p(-0.06, 0.05, 33), T.p(0.04, 0.05, 33), 'rgba(0,0,0,.4)', 0.6) + ln(T.p(-0.06, 0.05, 35), T.p(0.04, 0.05, 35), 'rgba(0,0,0,.4)', 0.6);
      // la fumée du lanterneau et un filet par la lucarne
      const [vx, vy] = T.p(-0.01, 0, 39);
      out += [0, 1, 2].map(i => { const p = ((f + i * (n / 3)) % n) / n; return puff(vx - 2 + p * 6 + Math.sin(p * 6 + i) * 2, vy - 4 - p * 26, 2.6 + p * 4.6, 0.7 * (1 - p)); }).join('');
      const [wx, wy] = T.p(0.18, -0.03, 18);
      out += [0, 0.5].map(o => { const p = ((f / n) + o) % 1; return puff(wx + 2 + p * 5, wy - 1 - p * 8, 1.2 + p * 1.8, 0.5 * (1 - p)); }).join('');
      // le séchoir et ses poissons qui se balancent
      out += post(T, 0.36, -0.18, 0, 20, WOOD, 0.018) + post(T, 0.36, 0.18, 0, 20, WOOD, 0.018)
        + ln(T.p(0.36, -0.18, 19), T.p(0.36, 0.18, 19), WOOD.right, 1.4) + ln(T.p(0.36, -0.18, 19.6), T.p(0.36, 0.18, 19.6), WOOD.top, 0.5);
      [[-0.12, '#E2B860', '#B8862E'], [-0.04, '#C7D0DA', '#7E8A98'], [0.04, '#E2B860', '#B8862E'], [0.12, '#C7D0DA', '#7E8A98']].forEach(([dv, c, d], i) => {
        const [fx, fy] = T.p(0.36, dv, 19), s = wave(f, n, 1.2, i * 0.9);
        out += ln([fx, fy], [fx + s * 0.3, fy + 2], '#8A6A40', 0.5)
          + `<g transform="rotate(${f2(s * 6)} ${f2(fx)} ${f2(fy)})"><path d="M${f2(fx)},${f2(fy + 2)} q2.6,4 0,8.6 q-2.6,-4.6 0,-8.6 Z" fill="${c}" stroke="${d}" stroke-width="0.5"/>`
          + ln([fx - 0.8, fy + 5], [fx + 0.8, fy + 5], 'rgba(0,0,0,.18)', 0.4) + dot(fx + 0.6, fy + 3.6, 0.45, '#2A2024')
          + poly([[fx, fy + 10.4], [fx - 2, fy + 13], [fx + 2, fy + 13]], d) + '</g>';
      });
      // le chat assis sous le séchoir, la tête levée vers les poissons
      const [cx, cy] = T.p(0.5, 0.2, 0), look = f % 4 === 0 ? -0.6 : 0;
      out += ell(cx, cy + 0.4, 4, 1.2, 'rgba(40,55,20,.22)')
        + `<path d="M${f2(cx + 2.6)},${f2(cy - 0.6)} q4,0.4 3.4,-3.4" stroke="${OUT}" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M${f2(cx + 2.6)},${f2(cy - 0.6)} q4,0.4 3.4,-3.4" stroke="#9AA0A8" stroke-width="1.4" fill="none" stroke-linecap="round"/>`
        + `<path d="M${f2(cx - 3.4)},${f2(cy)} Q${f2(cx - 3.8)},${f2(cy - 6.4)} ${f2(cx)},${f2(cy - 7)} Q${f2(cx + 3.8)},${f2(cy - 6.4)} ${f2(cx + 3.4)},${f2(cy)} Z" fill="#9AA0A8" stroke="${OUT}" stroke-width="0.5"/>`
        + [-1.4, 0, 1.4].map(o => ln([cx + o - 0.4, cy - 5.6], [cx + o, cy - 4.2], '#6E747C', 0.5)).join('')
        + ell(cx - 0.6, cy - 1.6, 1.6, 2.4, '#E8E4DC')
        + `<circle cx="${f2(cx)}" cy="${f2(cy - 9 + look)}" r="2.6" fill="#9AA0A8" stroke="${OUT}" stroke-width="0.5"/>`
        + poly([[cx - 2.4, cy - 10 + look], [cx - 2.2, cy - 12.8 + look], [cx - 0.6, cy - 11.2 + look]], '#9AA0A8', ` stroke="${OUT}" stroke-width="0.4" stroke-linejoin="round"`)
        + poly([[cx + 0.8, cy - 11.4 + look], [cx + 2.4, cy - 12.8 + look], [cx + 2.6, cy - 10 + look]], '#9AA0A8', ` stroke="${OUT}" stroke-width="0.4" stroke-linejoin="round"`)
        + dot(cx - 0.9, cy - 9.6 + look, 0.5, '#2A2024') + dot(cx + 0.9, cy - 9.6 + look, 0.5, '#2A2024') + dot(cx, cy - 8.4 + look, 0.35, '#E58A8F');
      // le panier de poissons, devant à gauche
      const [bx, by] = T.p(-0.16, 0.42, 0);
      return out + ell(bx + 1, by + 0.5, 6, 1.8, 'rgba(40,55,20,.22)')
        + [[-2, -5.4, '#C7D0DA'], [1.6, -5.8, '#E2B860'], [0, -6.6, '#C7D0DA']].map(([dx, dy, c]) => ell(bx + dx, by + dy, 2.6, 1, c, ` stroke="${OUT}" stroke-width="0.4"`)).join('')
        + `<path d="M${f2(bx - 5.4)},${f2(by - 5)} L${f2(bx - 4.2)},${f2(by)} Q${f2(bx)},${f2(by + 1.6)} ${f2(bx + 4.2)},${f2(by)} L${f2(bx + 5.4)},${f2(by - 5)} Q${f2(bx)},${f2(by - 3)} ${f2(bx - 5.4)},${f2(by - 5)} Z" fill="#C9A060" stroke="${OUT}" stroke-width="0.6"/>`
        + `<path d="M${f2(bx - 4.8)},${f2(by - 2.4)} Q${f2(bx)},${f2(by - 0.6)} ${f2(bx + 4.8)},${f2(by - 2.4)}" stroke="#A07838" stroke-width="0.6" fill="none"/>`;
    }
  }]
};
// Parc à huîtres : dans une flaque de marée sur le sable, deux tables de bois et leurs poches de filet bombées
// d'huîtres, des algues qui pendent ; le panier d'huîtres ouvertes où brille une perle ; un crabe qui passe ; la
// salicorne ; l'eau fait des ronds autour des pieds
const huitres = {
  layers: [{
    frame: [-34, -34, 68, 50],
    n: 6,
    fps: 3,
    draw: (T, f, n) => {
      const k = f / n;
      const [x, y] = T.p(0, 0, 0);
      // le sable, la flaque de marée et ses reflets
      let out = ell(x, y + 1, 32, 13, '#EAD7A8', ` stroke="${OUT}" stroke-width="0.5"`) + ell(x - 4, y - 1, 22, 8, '#F2E2BA')
        + `<path d="M${x - 22},${y - 1} Q${x - 18},${y - 9} ${x - 2},${y - 9} Q${x + 18},${y - 9} ${x + 22},${y - 1} Q${x + 14},${y + 7} ${x - 4},${y + 6} Q${x - 20},${y + 6} ${x - 22},${y - 1} Z" fill="#8FC8E0" stroke="#C9B58A" stroke-width="1.2"/>`
        + ln([x - 14, y - 4 + k * 2], [x - 6, y - 4 + k * 2], 'rgba(255,255,255,.7)', 0.8) + ln([x + 6, y + 1 - k * 2], [x + 14, y + 1 - k * 2], 'rgba(255,255,255,.6)', 0.7)
        + [[-0.2, -0.08], [0.32, 0.22]].map(([du, dv], i) => { const [sx, sy] = T.p(du, dv, 0); return ell(sx, sy, 1.6, 1, '#F7EEDC', ` stroke="${OUT}" stroke-width="0.4"`) + (i ? `<path d="M${f2(sx - 1.2)},${f2(sy)} l1.2,-1.2 l1.2,1.2" stroke="#C9A06A" stroke-width="0.4" fill="none"/>` : ''); }).join('')
        + T.shadow(0, 0, 0.36, 0.12);
      // une table : pieds dans l'eau et leurs ronds, plateau, poches de filet bombées, algues
      const table = dv => {
        let o = [[-0.32, dv - 0.08], [0.32, dv - 0.08], [-0.32, dv + 0.08], [0.32, dv + 0.08]].map(([a, b], i) => { const [rx, ry] = T.p(a, b, 0); const t = (k + i * 0.25) % 1; return `<ellipse cx="${f2(rx)}" cy="${f2(ry)}" rx="${f2(1.4 + t * 2.6)}" ry="${f2(0.7 + t * 1.3)}" fill="none" stroke="rgba(255,255,255,${f2(0.7 * (1 - t))})" stroke-width="0.5"/>` + post(T, a, b, 0, 8, WOOD_DARK, 0.015); }).join('')
          + T.box(-0.34, dv - 0.1, 0.34, dv + 0.1, 8, 9, WOOD);
        for (const du of [-0.22, 0, 0.22]) {
          o += T.box(du - 0.09, dv - 0.07, du + 0.09, dv + 0.07, 9, 11.4, { top: '#8FA58C', left: '#6F876E', right: '#566C56' });
          for (let i = 1; i < 4; i++) o += ln(T.p(du - 0.09 + i * 0.045, dv - 0.07, 11.4), T.p(du - 0.09 + i * 0.045, dv + 0.07, 11.4), 'rgba(40,60,40,.45)', 0.4) + ln(T.p(du - 0.09 + i * 0.045, dv + 0.07, 9), T.p(du - 0.09 + i * 0.045, dv + 0.07, 11.4), 'rgba(40,60,40,.45)', 0.4);
          o += ln(T.p(du - 0.09, dv, 11.4), T.p(du + 0.09, dv, 11.4), 'rgba(40,60,40,.45)', 0.4)
            + [[-0.05, -0.03], [0.02, 0.03], [0.05, -0.04], [-0.02, 0.01]].map(([a, b]) => { const [ox, oy] = T.p(du + a, dv + b, 11.6); return ell(ox, oy, 1.1, 0.6, '#B8BEC2', ` stroke="${OUT}" stroke-width="0.3"`); }).join('');
        }
        return o + [-0.3, -0.06, 0.18].map((du, i) => { const [ax, ay] = T.p(du, dv + 0.1, 8); const s = wave(f, n, 0.6, i); return `<path d="M${f2(ax)},${f2(ay)} q${f2(0.6 + s)},2.4 ${f2(s)},4.6 M${f2(ax + 2)},${f2(ay)} q${f2(-0.6 + s)},2 ${f2(0.4 + s)},3.4" stroke="#4E8A4A" stroke-width="0.9" fill="none" stroke-linecap="round"/>`; }).join('');
      };
      out += table(-0.18) + table(0.12);
      // la salicorne, à gauche
      out += [[-0.4, 0.28], [-0.3, 0.4], [-0.44, 0.14]].map(([a, b]) => { const [sx, sy] = T.p(a, b, 0); return [-1.6, 0, 1.6].map((o, i) => `<path d="M${f2(sx + o * 0.4)},${f2(sy)} l${f2(o * 0.5)},-${2.4 + i % 2} l${f2(o * 0.3)},-2" stroke="${i % 2 ? '#8FB85A' : '#6E9C5A'}" stroke-width="1.1" fill="none" stroke-linecap="round"/>`).join(''); }).join('');
      // le panier d'huîtres ouvertes, sa perle qui brille
      const [bx, by] = T.p(0.22, 0.34, 0);
      out += ell(bx + 1, by + 0.4, 6.6, 2, 'rgba(40,55,20,.2)')
        + ell(bx, by - 1.6, 5.6, 2.6, '#B08850', ` stroke="${OUT}" stroke-width="0.6"`) + ell(bx, by - 3.2, 5, 2.2, '#C9A06A')
        + [-3, 0, 3].map(o => ln([bx + o, by - 3.6], [bx + o * 1.05, by + 0.6], 'rgba(120,85,40,.45)', 0.5)).join('')
        + [[-3, -4.4], [1, -5], [3.4, -3.6], [-0.6, -3]].map(([a, b]) => ell(bx + a, by + b, 2.2, 1.3, '#9AA2A8', ` stroke="${OUT}" stroke-width="0.3"`) + ell(bx + a, by + b - 0.2, 1.4, 0.7, '#F1EEE6')).join('')
        + dot(bx + 1, by - 5.2, 0.9, '#FFFFFF') + (f % 3 === 0 ? star(bx + 1, by - 5.4, 3.2, '#FFFFFF', 0.95) : '');
      // le crabe qui passe de côté devant
      const [cx, cy] = T.p(-0.12 + k * 0.2, 0.42 - k * 0.2, 0);
      const st = f % 2 ? 0.6 : -0.6;
      return out + ell(cx, cy + 0.4, 3.4, 0.9, 'rgba(40,55,20,.2)')
        + [-1, 1].map(s => [0.8, 1.8, 2.8].map(d => ln([cx + s * d * 0.6, cy - 1], [cx + s * (d * 0.6 + 1.4), cy + 0.4 + (d === 1.8 ? st : -st) * 0.6], '#C2402E', 0.5)).join('')).join('')
        + ell(cx, cy - 1.6, 3, 1.8, '#E2583E', ` stroke="${OUT}" stroke-width="0.5"`)
        + [-1, 1].map(s => ln([cx + s * 2.2, cy - 2.2], [cx + s * 3.4, cy - 3.6], '#C2402E', 0.6) + ell(cx + s * 3.8, cy - 4.2, 1.2, 0.9, '#E2583E', ` stroke="${OUT}" stroke-width="0.4"`)).join('')
        + [-0.8, 0.8].map(s => ln([cx + s, cy - 3], [cx + s, cy - 4.2], '#C2402E', 0.4) + dot(cx + s, cy - 4.4, 0.5, '#2A2024')).join('');
    }
  }]
};

/* ---------- Foyer ---------- */
// Jardin d'herbes : carré surélevé à poteaux d'angle, garni de lavande, basilic, romarin et thym bien touffus, son
// écriteau et le transplantoir planté ; l'arrosoir, des pas japonais dans l'herbe, un escargot sur le rebord ; deux
// papillons qui volent
const jardin = {
  layers: [{
    frame: [-32, -48, 64, 64],
    n: 8,
    fps: 6,
    draw: (T, f, n) => {
      const [gx, gy] = T.p(0, 0, 0);
      // l'herbe, les pas japonais
      let out = ell(gx, gy + 1, 30, 12.4, '#9CC46A', ` stroke="${OUT}" stroke-width="0.5"`) + ell(gx - 4, gy, 20, 7.4, '#ADD27A')
        + [[-0.38, 0.3], [-0.24, 0.4], [-0.08, 0.46]].map(([du, dv]) => { const [px, py] = T.p(du, dv, 0); return ell(px, py, 3, 1.5, '#C9C2B4', ` stroke="${OUT}" stroke-width="0.5"`) + ell(px - 0.6, py - 0.4, 1.6, 0.6, '#DDD7CB'); }).join('')
        + T.shadow(0, 0, 0.36, 0.2);
      // le carré surélevé, ses planches, ses poteaux d'angle, sa terre
      out += T.box(-0.32, -0.2, 0.32, 0.2, 0, 9, WOOD) + planksLeft(T.u - 0.32, T.u + 0.32, T.v + 0.2, 0, 9, 4.5) + planksRight(T.u + 0.32, T.v - 0.2, T.v + 0.2, 0, 9, 4.5)
        + [[-0.32, 0.2], [0.32, 0.2], [0.32, -0.2]].map(([a, b]) => post(T, a, b, 0, 10.4, WOOD_DARK, 0.022)).join('')
        + T.face([[-0.29, -0.17, 9], [0.29, -0.17, 9], [0.29, 0.17, 9], [-0.29, 0.17, 9]], SOIL_TOP)
        + [[-0.1, -0.02], [0.14, 0.0], [0.02, 0.12]].map(([du, dv]) => dot(...T.p(du, dv, 9), 0.5, '#5A3A22')).join('');
      // les herbes, bien touffues
      const herbs = [];
      for (const [du, dv, kind] of [[-0.22, -0.1, 0], [-0.08, -0.1, 1], [0.08, -0.1, 2], [0.22, -0.1, 3], [-0.22, 0.08, 1], [-0.08, 0.08, 3], [0.08, 0.08, 0], [0.22, 0.08, 2]]) {
        const [x, y] = T.p(du, dv, 9);
        const sw = wave(f, n, 0.6, du * 9);
        if (kind === 0) herbs.push([-2.4, -1.2, 0, 1.2, 2.4].map((o, i) => ln([x + o * 0.4, y], [x + o + sw, y - 7 - (i % 2) * 1.4], '#6FA35A', 0.7) + ell(x + o + sw, y - 8.2 - (i % 2) * 1.4, 0.8, 2.2, i % 2 ? '#9A7ACF' : '#B79AE6')).join(''));
        else if (kind === 1) herbs.push([[-1.8, -2], [1.8, -2.4], [0, -4], [-0.6, -1.2], [1.2, -3.6]].map(([dx, dy], i) => `<path d="M${f2(x + dx)},${f2(y + dy + 1.6)} q-2,-1.6 0,-3.4 q2,1.6 0,3.4 Z" fill="${i % 2 ? LEAF_LIGHT : LEAF}" stroke="#3F6E3A" stroke-width="0.3"/>`).join(''));
        else if (kind === 2) herbs.push([-2.4, -1.2, 0, 1.2, 2.4].map(o => { const ex = x + o + sw, ey = y - 7; return ln([x, y], [ex, ey], '#3F6E3A', 0.8) + [0.3, 0.55, 0.8].map(t => ln([x + (ex - x) * t, y + (ey - y) * t], [x + (ex - x) * t + 1, y + (ey - y) * t - 0.6], '#5E8C4A', 0.5)).join(''); }).join(''));
        else herbs.push(`<ellipse cx="${f2(x)}" cy="${f2(y - 1.6)}" rx="3.2" ry="2" fill="#7AA866" stroke="#4E7A3E" stroke-width="0.3"/>` + [-1.6, -0.4, 0.8, 1.8].map((o, i) => dot(x + o, y - 2.4 - (i % 2) * 0.8, 0.55, '#E6D2F2')).join(''));
      }
      out += herbs.join('');
      // le transplantoir planté dans la terre
      const [tx, ty] = T.p(0.0, 0.0, 9);
      out += poly([[tx - 1, ty], [tx + 1, ty], [tx + 0.6, ty - 3], [tx - 0.6, ty - 3]], IRON.left, ` stroke="${OUT}" stroke-width="0.4"`) + ln([tx, ty - 3], [tx + 0.6, ty - 7], WOOD.right, 1.3);
      // l'escargot sur le rebord de devant
      const [ex, ey] = T.p(-0.12 + (f % n) * 0.006, 0.2, 9);
      out += `<path d="M${f2(ex - 2.6)},${f2(ey)} q2.6,-0.6 5,0 q0.6,0.3 1.2,-1.2" stroke="#C8B48A" stroke-width="1.2" fill="none" stroke-linecap="round"/>`
        + `<circle cx="${f2(ex)}" cy="${f2(ey - 1.8)}" r="1.9" fill="#C8864A" stroke="${OUT}" stroke-width="0.4"/>` + `<path d="M${f2(ex)},${f2(ey - 1.8)} m-0.9,0 a0.9,0.9 0 1 1 0.9,0.9" stroke="#8A5226" stroke-width="0.4" fill="none"/>`
        + ln([ex + 3.6, ey - 1.2], [ex + 3.8, ey - 2.8], '#C8B48A', 0.4) + dot(ex + 3.8, ey - 2.9, 0.35, '#3D3A36');
      // l'écriteau, l'arrosoir
      const [sx, sy] = T.p(0.34, 0.26, 0);
      out += ln([sx, sy], [sx, sy - 12], WOOD.right, 1.2) + poly([[sx - 5, sy - 15], [sx + 5, sy - 13], [sx + 5, sy - 9], [sx - 5, sy - 11]], WALL.top, ` stroke="${OUT}" stroke-width="0.5"`)
        + ln([sx - 3, sy - 12.4], [sx + 3, sy - 11], '#6FA35A', 0.8) + dot(sx + 3.4, sy - 11.2, 0.7, '#A98ADB');
      const [ax, ay] = T.p(0.42, -0.04, 0);
      out += ell(ax, ay + 0.4, 4.4, 1.2, 'rgba(40,55,20,.22)')
        + `<path d="M${f2(ax - 3.4)},${f2(ay)} L${f2(ax - 3)},${f2(ay - 6)} L${f2(ax + 3)},${f2(ay - 6)} L${f2(ax + 3.4)},${f2(ay)} Z" fill="#7FA8B8" stroke="${OUT}" stroke-width="0.5"/>`
        + ell(ax, ay - 6, 3, 1, '#9CC4D2', ` stroke="${OUT}" stroke-width="0.4"`)
        + `<path d="M${f2(ax + 3)},${f2(ay - 2)} L${f2(ax + 7.6)},${f2(ay - 7)}" stroke="${OUT}" stroke-width="1.6" stroke-linecap="round"/><path d="M${f2(ax + 3)},${f2(ay - 2)} L${f2(ax + 7.6)},${f2(ay - 7)}" stroke="#7FA8B8" stroke-width="0.9" stroke-linecap="round"/>`
        + ell(ax + 8, ay - 7.4, 1.2, 0.8, '#9CC4D2', ` stroke="${OUT}" stroke-width="0.4"`)
        + `<path d="M${f2(ax - 2.4)},${f2(ay - 6)} q2.4,-4.4 4.8,0" stroke="${OUT}" stroke-width="1.4" fill="none"/><path d="M${f2(ax - 2.4)},${f2(ay - 6)} q2.4,-4.4 4.8,0" stroke="#7FA8B8" stroke-width="0.7" fill="none"/>`;
      // les deux papillons
      const fly = k => {
        const a = (f / n) * TAU + k * 2.6;
        const [x, y] = T.p(Math.cos(a) * 0.22, Math.sin(a) * 0.16, 20 + Math.sin(a * 2) * 4);
        return butterfly(x, y, (f + k) % 2 === 0, k ? '#F2C04B' : '#F6A8C8');
      };
      return out + fly(0) + fly(1);
    }
  }]
};
// Four à pain : socle de pierre appareillé, coupole d'argile lissée à la main et noircie au-dessus de la gueule où
// dansent les flammes, cheminée qui fume ; la pelle à enfourner appuyée, les pains farinés sur leur planche, un
// panier de miches, les bûches ; un moineau picore les miettes
const four = {
  light: () => [-0.04, 0.24, 13, 17, '255,150,70', true],
  layers: [{
    frame: [-34, -70, 68, 88],
    n: 6,
    fps: 6,
    draw: (T, f, n) => {
      const [gx, gy] = T.p(0, 0, 0);
      const [cx, cy] = T.p(0, -0.02, 9);
      const dome = `<path d="M${f2(cx - 17)},${f2(cy)} C${f2(cx - 17)},${f2(cy - 24)} ${f2(cx + 17)},${f2(cy - 24)} ${f2(cx + 17)},${f2(cy)} A17,8.5 0 0 1 ${f2(cx - 17)},${f2(cy)} Z" fill="url(#${T.id('dome')})" stroke="${OUT}" stroke-width="0.6"/>`;
      const [mx, my] = T.p(-0.04, 0.2, 9);
      const flick = [0.8, 1, 0.9, 1.1, 0.85, 1][f];
      const [chx, chy] = T.p(0.08, -0.12, 27);
      // la terre battue, la farine et les miettes
      let out = ell(gx, gy + 1, 31, 12.6, '#C8AC80', ` stroke="${OUT}" stroke-width="0.5"`) + ell(gx - 4, gy, 21, 7.6, '#D6BC90')
        + ell(...T.p(-0.2, 0.42, 0), 5, 1.6, 'rgba(255,255,255,.45)')
        + [[-0.1, 0.46], [-0.06, 0.48], [-0.13, 0.5]].map(([du, dv]) => dot(...T.p(du, dv, 0), 0.5, '#E2B060')).join('')
        + T.shadow(0, 0, 0.38, 0.2)
        + `<defs><radialGradient id="${T.id('dome')}" cx="0.35" cy="0.3" r="0.8"><stop offset="0" stop-color="${CLAY.top}"/><stop offset="0.6" stop-color="${CLAY.left}"/><stop offset="1" stop-color="${CLAY.right}"/></radialGradient></defs>`;
      // le socle appareillé, la cheminée, la coupole, ses traces de main et sa suie
      out += T.box(-0.3, -0.26, 0.3, 0.26, 0, 9, STONE)
        + ln(T.p(-0.3, 0.26, 4.5), T.p(0.3, 0.26, 4.5), 'rgba(120,110,95,.4)', 0.6) + ln(T.p(0.3, -0.26, 4.5), T.p(0.3, 0.26, 4.5), 'rgba(120,110,95,.4)', 0.6)
        + [-0.18, 0.02, 0.2].map(u => ln(T.p(u, 0.26, 0.4), T.p(u, 0.26, 4.4), 'rgba(120,110,95,.35)', 0.5)).join('') + [-0.08, 0.12].map(u => ln(T.p(u, 0.26, 4.6), T.p(u, 0.26, 8.6), 'rgba(120,110,95,.35)', 0.5)).join('')
        + T.cyl(0.08, -0.12, 18, 30, 0.045, BRICK, 'chem')
        + dome
        + [[-10, -6], [-4, -14], [6, -12], [11, -5], [0, -8]].map(([dx, dy]) => `<path d="M${f2(cx + dx - 2)},${f2(cy + dy)} q2,-1.2 4,0" stroke="rgba(150,80,50,.35)" stroke-width="0.6" fill="none"/>`).join('')
        + `<path d="M${f2(mx - 5)},${f2(my - 6)} Q${f2(mx)},${f2(my - 16)} ${f2(mx + 5)},${f2(my - 6)} Z" fill="rgba(50,30,20,.35)"/>`
        + `<path d="M${f2(mx - 6)},${f2(my)} L${f2(mx - 6)},${f2(my - 6)} A6,6 0 0 1 ${f2(mx + 6)},${f2(my - 6)} L${f2(mx + 6)},${f2(my)} Z" fill="#2E1A10" stroke="${OUT}" stroke-width="0.5"/>`
        + `<path d="M${f2(mx - 7.4)},${f2(my)} L${f2(mx - 7.4)},${f2(my - 6)} A7.4,7.4 0 0 1 ${f2(mx + 7.4)},${f2(my - 6)} L${f2(mx + 7.4)},${f2(my)}" stroke="${STONE.top}" stroke-width="1.4" fill="none"/>`
        + ell(mx, my - 2.6, 4.6 * flick, 3 * flick, '#F2862A') + ell(mx, my - 2, 3 * flick, 1.8 * flick, '#FFD24E');
      out += [0, 1].map(k => { const p = ((f + k * 3) % n) / n; return puff(chx + p * 5, chy - 6 - p * 18, 2 + p * 3.6, 0.6 * (1 - p)); }).join('');
      // la pelle à enfourner appuyée contre le socle, à droite
      const [px, py] = T.p(0.34, 0.08, 0);
      out += ln([px, py], [px - 3, py - 22], WOOD.right, 1.3) + ln([px + 0.3, py - 0.2], [px - 2.7, py - 22.2], WOOD.top, 0.4)
        + `<path d="M${f2(px - 3.6)},${f2(py - 21)} l-2.4,-7 q2.4,-1.6 4.8,0 l-0.8,7 Z" fill="${WOOD.left}" stroke="${OUT}" stroke-width="0.5"/>`;
      // les pains farinés sur leur planche, le panier de miches, les bûches
      out += T.box(-0.32, 0.28, -0.08, 0.4, 0, 2, WOOD)
        + [-0.26, -0.15].map(du => { const [x, y] = T.p(du, 0.34, 2); return ell(x, y - 2, 4, 2.4, '#D8A050', ` stroke="#9A6A2E" stroke-width="0.4"`) + ln([x - 2, y - 2.6], [x + 1, y - 3.4], '#F2D28A', 0.6) + ln([x - 0.4, y - 1.8], [x + 2.4, y - 2.6], '#F2D28A', 0.6) + ell(x - 1, y - 3.2, 1.6, 0.6, 'rgba(255,255,255,.5)'); }).join('');
      const [bx, by] = T.p(0.12, 0.42, 0);
      out += ell(bx + 1, by + 0.4, 6, 1.6, 'rgba(40,55,20,.2)')
        + [[-2, -5.6], [2, -5.8], [0, -7]].map(([dx, dy]) => ell(bx + dx, by + dy, 2.6, 1.8, '#C88A3E', ` stroke="#8A5A24" stroke-width="0.4"`) + ln([bx + dx - 1, by + dy - 0.6], [bx + dx + 1, by + dy - 1], '#F2D28A', 0.5)).join('')
        + `<path d="M${f2(bx - 5.4)},${f2(by - 5)} L${f2(bx - 4.2)},${f2(by)} Q${f2(bx)},${f2(by + 1.6)} ${f2(bx + 4.2)},${f2(by)} L${f2(bx + 5.4)},${f2(by - 5)} Q${f2(bx)},${f2(by - 3)} ${f2(bx - 5.4)},${f2(by - 5)} Z" fill="#C9A060" stroke="${OUT}" stroke-width="0.6"/>`
        + `<path d="M${f2(bx - 4.8)},${f2(by - 2.4)} Q${f2(bx)},${f2(by - 0.6)} ${f2(bx + 4.8)},${f2(by - 2.4)}" stroke="#A07838" stroke-width="0.6" fill="none"/>`
        + log(T, 0.3, 0.14, 0.32, 2.2, 2.2) + log(T, 0.36, 0.1, 0.3, 2.2, 2.2) + log(T, 0.33, 0.12, 0.31, 6.2, 2.2);
      // le moineau qui picore les miettes
      const [sx, sy] = T.p(-0.08, 0.48, 0);
      return out + `<g transform="translate(${f2(sx)} ${f2(sy)}) scale(.7) translate(${f2(-sx)} ${f2(-sy)})">` + bird(sx, sy, { body: '#8B6A4A', breast: '#D8C2A0', wing: '#6E5236', peck: f % 3 === 1 ? 1 : 0, flip: true }) + '</g>';
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
// Charbonnière : la meule de bois couverte de terre et d'herbe qui fume par ses évents, ses bûches au pied, la
// gueule où rougeoient les braises ; l'échelle du charbonnier, la réserve de bûches, le tas de charbon fini et son sac
const charbon = {
  light: () => [0, 0.1, 3, 12, '255,110,50'],
  layers: [{
    frame: [-32, -42, 64, 58],
    n: 6,
    fps: 4,
    draw: (T, f, n) => {
      const k = f / n, glow = 0.5 + 0.5 * Math.sin(k * TAU);
      const EARTH = { light: '#8E7A60', mid: '#76634C', dark: '#5A4A38' };
      const [x, y] = T.p(0, 0, 0);
      // le sol noirci de suie, des taches de cendre
      let out = ell(x, y + 1, 30, 12.6, '#5E544A', ` stroke="${OUT}" stroke-width="0.5"`) + ell(x - 3, y, 20, 7.4, '#6C6157')
        + [[-6, 9, 2.2], [17, 7, 1.8], [24, -5, 1.4]].map(([dx, dy, r]) => ell(x + dx, y + dy, r * 1.6, r * 0.7, '#7E746A')).join('');
      // la réserve de bûches, au fond à droite
      const [lx, ly] = T.p(0.36, -0.34, 0);
      out += ell(lx, ly + 0.6, 8, 2.4, 'rgba(20,15,10,.3)')
        + [[-4.2, -2.2], [0, -2.2], [4.2, -2.2], [-2.1, -5.8], [2.1, -5.8], [0, -9.4]].map(([dx, dy]) => logEnd(lx + dx, ly + dy, 2.1)).join('');
      // la meule : ses bûches au pied, son dôme de terre et ses mottes d'herbe
      const [cx, cy] = T.p(-0.04, -0.06, 0), rx = 15.4, top = cy - 22;
      out += T.shadow(-0.04, -0.06, 0.3, 0.25)
        + `<path d="M${f2(cx - rx)},${f2(cy - 1)} A${rx},6.6 0 0 0 ${f2(cx + rx)},${f2(cy - 1)} L${f2(cx + rx)},${f2(cy - 4)} A${rx},6.6 0 0 1 ${f2(cx - rx)},${f2(cy - 4)} Z" fill="${WOOD.left}" stroke="${OUT}" stroke-width="0.6"/>`;
      for (let i = 0; i < 9; i++) { const t = -0.88 + i * 0.22; out += logEnd(cx + t * rx, cy - 2.4 + Math.sqrt(1 - t * t) * 6.4, 1.7); }
      const dome = `M${f2(cx - rx + 0.6)},${f2(cy - 3)} C${f2(cx - rx)},${f2(cy - 17)} ${f2(cx - 8)},${f2(top)} ${f2(cx)},${f2(top)} C${f2(cx + 8)},${f2(top)} ${f2(cx + rx)},${f2(cy - 17)} ${f2(cx + rx - 0.6)},${f2(cy - 3)} Q${f2(cx)},${f2(cy + 2.4)} ${f2(cx - rx + 0.6)},${f2(cy - 3)} Z`;
      out += `<path d="${dome}" fill="${EARTH.mid}" stroke="${OUT}" stroke-width="0.7"/>`
        + `<path d="M${f2(cx + 3)},${f2(top + 0.4)} C${f2(cx + 10)},${f2(top + 2)} ${f2(cx + rx)},${f2(cy - 15)} ${f2(cx + rx - 0.6)},${f2(cy - 3)} Q${f2(cx + 8)},${f2(cy + 0.6)} ${f2(cx + 4)},${f2(cy + 0.4)} Q${f2(cx + 8)},${f2(cy - 10)} ${f2(cx + 3)},${f2(top + 0.4)} Z" fill="${EARTH.dark}" opacity="0.7"/>`
        + `<path d="M${f2(cx - 9)},${f2(cy - 14)} q3,-5 8,-6.4" stroke="${EARTH.light}" stroke-width="1.6" fill="none" stroke-linecap="round"/>`
        + [[-8, -6, 1], [6, -9, 0.9], [-2, -15, 0.8], [10, -3, 0.8], [-11, -11, 0.7], [1, -5, 0.7]].map(([dx, dy, s]) => [-1.6, -0.5, 0.6, 1.6].map((o, i) => `<path d="M${f2(cx + dx + o * 0.5)},${f2(cy + dy)} q${f2(o * 0.4)},${f2(-2 * s)} ${f2(o * 1.1)},${f2(-(3.4 + (i % 2) * 1.2) * s)}" stroke="${i % 2 ? '#9DB86A' : '#6F8C46'}" stroke-width="0.8" fill="none" stroke-linecap="round"/>`).join('')).join('')
        + [[-4, -4], [2, -12], [8, -15], [-7, -17]].map(([dx, dy]) => ln([cx + dx - 1.4, cy + dy], [cx + dx + 1.4, cy + dy + 0.4], 'rgba(40,30,20,.45)', 0.5)).join('');
      // les évents qui fument, l'un après l'autre
      for (const [dx, dy, o] of [[-3, -20.4, 0], [5, -18.6, 0.33], [-9, -15.4, 0.66]]) {
        out += ell(cx + dx, cy + dy, 1.4, 0.7, '#2A2018');
        for (const p of [0, 0.5]) { const t = (k + o + p) % 1; out += puff(cx + dx + t * 3 + Math.sin(t * 5) * 1.2, cy + dy - 2 - t * 13, 1.6 + t * 2.6, 0.7 * (1 - t)); }
      }
      // la gueule au pied de la meule, ses braises
      const [gx, gy] = T.p(0, 0.1, 0);
      out += `<path d="M${f2(gx - 3.6)},${f2(gy)} L${f2(gx - 3.6)},${f2(gy - 3.4)} Q${f2(gx)},${f2(gy - 6.6)} ${f2(gx + 3.6)},${f2(gy - 3.4)} L${f2(gx + 3.6)},${f2(gy)} Z" fill="#2A1A12" stroke="${OUT}" stroke-width="0.6"/>`
        + ell(gx, gy - 1.4, 2.6, 1.4, `rgba(255,${f2(110 + 60 * glow)},40,${f2(0.7 + 0.3 * glow)})`)
        + dot(gx - 1, gy - 1.2, 0.6, '#FFE08A') + dot(gx + 1.2, gy - 1, 0.5, '#FFD070')
        + [[-1, 0], [2, 2], [0.4, 4]].map(([dx, o]) => { const t = ((f + o) % n) / n; return t < 0.6 ? dot(gx + dx + t * 2, gy - 6 - t * 8, 0.55, '#FF9A40') : ''; }).join('');
      // l'échelle appuyée contre la meule, à droite
      const b0 = [cx + 17, cy + 5], b1 = [cx + 9, cy - 17], dxr = 3.2;
      out += ln(b0, b1, WOOD.right, 1.4) + ln([b0[0] + dxr, b0[1] + 0.6], [b1[0] + dxr, b1[1] + 0.6], WOOD.right, 1.4)
        + [0.15, 0.35, 0.55, 0.75].map(t => ln([b0[0] + (b1[0] - b0[0]) * t, b0[1] + (b1[1] - b0[1]) * t], [b0[0] + (b1[0] - b0[0]) * t + dxr, b0[1] + (b1[1] - b0[1]) * t + 0.6], WOOD.top, 1)).join('');
      // le sac de charbon et le tas fini, devant à gauche, la pelle plantée, des éclats bleutés
      const [sx, sy] = T.p(-0.42, 0.24, 0);
      out += ell(sx + 1, sy + 0.4, 5, 1.6, 'rgba(20,15,10,.3)')
        + `<path d="M${f2(sx - 4.6)},${f2(sy)} C${f2(sx - 5.6)},${f2(sy - 5)} ${f2(sx - 3.8)},${f2(sy - 8.6)} ${f2(sx - 1.9)},${f2(sy - 9.8)} L${f2(sx + 2)},${f2(sy - 9.8)} C${f2(sx + 3.9)},${f2(sy - 8.6)} ${f2(sx + 5.6)},${f2(sy - 5)} ${f2(sx + 4.6)},${f2(sy)} Z" fill="#C9A46A" stroke="${OUT}" stroke-width="0.5"/>`
        + `<path d="M${f2(sx - 2)},${f2(sy - 9.8)} q2,-2.2 4,0" fill="${COAL.top}" stroke="${OUT}" stroke-width="0.4"/>` + ln([sx - 2.2, sy - 9], [sx + 2.2, sy - 9], '#7A5A2A', 0.9)
        + ln([sx - 2.6, sy - 5], [sx - 1.4, sy - 1.6], 'rgba(138,106,58,.6)', 0.5) + ln([sx + 2, sy - 6], [sx + 2.6, sy - 2.6], 'rgba(138,106,58,.6)', 0.5);
      const [px, py] = T.p(-0.18, 0.4, 0);
      out += ell(px, py + 0.6, 10, 3, 'rgba(20,15,10,.3)')
        + `<g transform="translate(${f2(px)} ${f2(py)}) scale(.55) translate(${f2(-px)} ${f2(-py)})">${coalPile(px, py)}</g>`
        + ln([px + 3, py - 3], [px + 7, py - 15], WOOD.right, 1.3) + ln([px + 5.6, py - 15.4], [px + 8.6, py - 14.6], WOOD.right, 1.3)
        + poly([[px + 1.6, py - 1], [px + 4.4, py - 0.2], [px + 4.6, py - 3.6], [px + 2.4, py - 4.2]], IRON.left, ` stroke="${OUT}" stroke-width="0.5"`)
        + [[-4, -4], [2, -5.6], [-1, -2.6]].map(([dx, dy], i) => dot(px + dx, py + dy, 0.55, (i + f) % 3 === 0 ? '#FFFFFF' : '#C6D4EA')).join('');
      return out;
    }
  }]
};
// Hangar : abri ouvert sous un toit d'ardoises (rangs, mousse, faîtière), contrefiches aux poteaux ; l'établi, son étau,
// la scie et le marteau posés, les copeaux ; la corde pendue au poteau ; la lanterne pendue ; caisses, tonneau et sac,
// le chat roulé en boule sur la caisse du haut ; la roue de charrette appuyée dehors
const hangar = {
  light: () => [0.02, 0.18, 21, 15],
  layers: [{
    frame: [-38, -66, 76, 84],
    draw: T => {
      const crate = (du, dv, z, s) => T.box(du - s, dv - s, du + s, dv + s, z, z + s * 64, WOOD)
        + ln(T.p(du - s, dv + s, z), T.p(du + s, dv + s, z + s * 64), WOOD.right, 0.7) + ln(T.p(du + s, dv - s, z), T.p(du + s, dv + s, z + s * 64), WOOD.right, 0.7);
      const [x, y] = T.p(0, 0, 0);
      // la terre battue, des brins de paille
      let out = ell(x, y + 1, 34, 14.4, '#B89A6E', ` stroke="${OUT}" stroke-width="0.5"`) + ell(x - 4, y, 23, 8.6, '#C8AC80')
        + [[-22, 4, 0.5], [14, 9, -0.4], [24, 1, 0.3], [-6, 11, -0.6]].map(([dx, dy, a]) => ln([x + dx, y + dy], [x + dx + 4, y + dy + a * 4], '#E2C66E', 0.7)).join('')
        + T.shadow(0, 0, 0.42, 0.2);
      // le mur de planches du fond
      out += T.box(-0.34, -0.28, 0.34, -0.23, 0, 26, WOOD) + planksLeft(T.u - 0.34, T.u + 0.34, T.v - 0.23, 0, 26, 4.6)
        + [-0.22, 0.04, 0.26].map(du => ln(T.p(du, -0.23, 2), T.p(du, -0.23, 24), 'rgba(70,40,20,.18)', 0.6)).join('');
      // l'établi, son étau, sa planche et ses copeaux
      out += T.box(-0.3, -0.22, 0.3, -0.08, 9, 11, WOOD) + post(T, -0.28, -0.1, 0, 9, WOOD_DARK, 0.015) + post(T, 0.28, -0.1, 0, 9, WOOD_DARK, 0.015)
        + ln(T.p(-0.28, -0.1, 3), T.p(0.28, -0.1, 3), WOOD_DARK.right, 1)
        + T.box(-0.24, -0.12, -0.16, -0.08, 11, 14, DARK_IRON) + ln(T.p(-0.2, -0.06, 12.4), T.p(-0.2, -0.02, 12.4), IRON.top, 0.9)
        + T.box(-0.08, -0.2, 0.2, -0.13, 11, 12.2, { top: '#E4C08A', left: WOOD.left, right: WOOD.right });
      const [sx, sy] = T.p(0.12, -0.04, 0);
      out += [[-4, 0], [-1, 1.6], [3, 0.4], [6, 2]].map(([dx, dy]) => `<path d="M${f2(sx + dx)},${f2(sy + dy)} q1.4,-1.6 2.4,0 q-0.6,1 -1.4,0.4" stroke="#E4C08A" stroke-width="0.6" fill="none"/>`).join('');
      // la scie et le marteau posés sur l'établi
      const [wx, wy] = T.p(0.0, -0.15, 11.2);
      out += poly([[wx - 6, wy + 1.6], [wx + 3, wy - 1.2], [wx + 3.6, wy + 1], [wx - 5.4, wy + 2.6]], '#D4DAE2', ` stroke="${OUT}" stroke-width="0.5" stroke-linejoin="round"`)
        + `<path d="M${f2(wx + 3)},${f2(wy - 1.4)} l3,-1 l0.8,2.4 l-3,1 Z" fill="${WOOD.left}" stroke="${OUT}" stroke-width="0.5"/>`
        + ln([wx - 9, wy - 1.6], [wx - 4, wy - 3.6], WOOD.right, 1.2) + poly([[wx - 4.8, wy - 5], [wx - 3, wy - 2.2], [wx - 1.8, wy - 2.8], [wx - 3.6, wy - 5.6]], DARK_IRON.left, ` stroke="${OUT}" stroke-width="0.4"`);
      // les poteaux, leurs contrefiches, le toit d'ardoises
      out += [[-0.32, -0.26], [0.32, -0.26], [-0.32, 0.26], [0.32, 0.26]].map(([a, b]) => post(T, a, b, 0, 26, WOOD_DARK, 0.025)).join('')
        + ln(T.p(0.32, 0.26, 19), T.p(0.32, 0.12, 26), WOOD_DARK.right, 1.1) + ln(T.p(-0.32, 0.26, 19), T.p(-0.18, 0.26, 26), WOOD_DARK.right, 1.1)
        + ln(T.p(0.32, 0.26, 19), T.p(0.18, 0.26, 26), WOOD_DARK.right, 1.1)
        + T.gable(-0.34, -0.28, 0.34, 0.28, 26, 11, { front: SLATE_ROOF.front, back: SLATE_ROOF.back, gable: WOOD.right }, 0.06);
      const a0 = -0.4, b0 = 0.4, vm = 0, v1 = 0.34;
      for (const t of [0.25, 0.5, 0.75]) {
        const v = vm + (v1 - vm) * t, z = 37 - 11 * t;
        out += ln(T.p(a0, v, z), T.p(b0, v, z), 'rgba(40,48,66,.55)', 0.6);
        for (let i = 0; i < 8; i++) { const u = a0 + 0.05 + i * 0.1 + (t === 0.5 ? 0.05 : 0); if (u < b0 - 0.02) out += ln(T.p(u, v, z), T.p(u, v + (v1 - vm) * 0.25, z - 11 * 0.25), 'rgba(40,48,66,.35)', 0.5); }
      }
      out += ln(T.p(a0, 0, 37), T.p(b0, 0, 37), '#4A5468', 1.8) + ln(T.p(a0, 0.005, 37.6), T.p(b0, 0.005, 37.6), '#A4B0C4', 0.6)
        + [[-0.26, 0.24, 1.8], [-0.2, 0.28, 1.2], [0.22, 0.1, 1.1]].map(([u, v, r]) => { const [mx, my] = T.p(u, v, 37 - 11 * (v / v1)); return ell(mx, my, r * 1.4, r * 0.7, '#7E9A52') + ell(mx - r * 0.3, my - r * 0.2, r * 0.6, r * 0.3, '#9DB86A'); }).join('');
      // la corde enroulée pendue au poteau de droite
      const [rx, ry] = T.p(0.32, 0.26, 15);
      out += ln([rx, ry - 4.6], [rx + 2.6, ry - 3.4], '#3D3A36', 0.6)
        + `<circle cx="${f2(rx + 3)}" cy="${f2(ry)}" r="3.2" fill="none" stroke="#8A6A3A" stroke-width="2"/><circle cx="${f2(rx + 3)}" cy="${f2(ry)}" r="3.2" fill="none" stroke="#C9A46A" stroke-width="1.1"/>`;
      // la lanterne pendue sous le toit
      const [lx, ly] = T.p(0.02, 0.18, 23);
      out += ln(T.p(0.02, 0.18, 27), [lx, ly], '#3D3A36', 0.5)
        + poly([[lx - 2.2, ly], [lx + 2.2, ly], [lx + 1.6, ly - 1.6], [lx - 1.6, ly - 1.6]], DARK_IRON.left, ` stroke="${OUT}" stroke-width="0.4"`)
        + `<rect x="${f2(lx - 1.8)}" y="${f2(ly)}" width="3.6" height="4" rx="0.6" fill="#F6D27A" stroke="${OUT}" stroke-width="0.5"/>`
        + ln([lx, ly], [lx, ly + 4], DARK_IRON.left, 0.4) + ell(lx, ly + 2, 1, 1.2, '#FFF3C4')
        + poly([[lx - 2.2, ly + 4], [lx + 2.2, ly + 4], [lx + 1.4, ly + 5.2], [lx - 1.4, ly + 5.2]], DARK_IRON.left, ` stroke="${OUT}" stroke-width="0.4"`);
      // le tonneau, le sac, les caisses et le chat qui dort dessus
      out += T.cyl(0.04, 0.38, 0, 11, 0.06, { top: '#B98552', left: WOOD.left, right: WOOD.right }, 'tonneau')
        + [3, 8].map(z => { const [bx, by] = T.p(0.04, 0.38, z); return `<path d="M${f2(bx - 3.9)},${f2(by)} A3.9,1.9 0 0 0 ${f2(bx + 3.9)},${f2(by)}" fill="none" stroke="${DARK_IRON.right}" stroke-width="0.8"/>`; }).join('');
      const [kx, ky] = T.p(0.4, 0.16, 0);
      out += `<path d="M${f2(kx - 4)},${f2(ky)} C${f2(kx - 5)},${f2(ky - 4.6)} ${f2(kx - 3.4)},${f2(ky - 7.6)} ${f2(kx - 1.6)},${f2(ky - 8.6)} L${f2(kx + 1.8)},${f2(ky - 8.6)} C${f2(kx + 3.6)},${f2(ky - 7.6)} ${f2(kx + 5)},${f2(ky - 4.6)} ${f2(kx + 4)},${f2(ky)} Z" fill="#D8C08E" stroke="${OUT}" stroke-width="0.5"/>`
        + ln([kx - 1.8, ky - 8], [kx + 1.8, ky - 8], '#8A6A3A', 0.9);
      out += crate(0.28, 0.36, 0, 0.07) + crate(0.16, 0.38, 0, 0.06) + crate(0.26, 0.34, 9, 0.055);
      const [cx, cy] = T.p(0.26, 0.34, 12.6);
      out += `<path d="M${f2(cx - 4.4)},${f2(cy - 1)} q-1.6,2.2 2.4,2.6 q5,0.4 6.4,-1" stroke="${OUT}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`
        + `<path d="M${f2(cx - 4.4)},${f2(cy - 1)} q-1.6,2.2 2.4,2.6 q5,0.4 6.4,-1" stroke="#E08A3A" stroke-width="1.6" fill="none" stroke-linecap="round"/>`
        + ell(cx, cy - 2.4, 4.6, 2.6, '#F2A65A', ` stroke="${OUT}" stroke-width="0.5"`)
        + [-2, 0, 2].map(o => `<path d="M${f2(cx + o - 0.6)},${f2(cy - 4.8)} q0.6,1.2 0,2.4" stroke="#D07A34" stroke-width="0.6" fill="none"/>`).join('')
        + `<circle cx="${f2(cx + 3.4)}" cy="${f2(cy - 3.2)}" r="2.2" fill="#F2A65A" stroke="${OUT}" stroke-width="0.5"/>`
        + poly([[cx + 1.8, cy - 4.6], [cx + 2.2, cy - 6.6], [cx + 3.4, cy - 5.2]], '#F2A65A', ` stroke="${OUT}" stroke-width="0.4" stroke-linejoin="round"`)
        + poly([[cx + 3.8, cy - 5.2], [cx + 5, cy - 6.6], [cx + 5.2, cy - 4.4]], '#F2A65A', ` stroke="${OUT}" stroke-width="0.4" stroke-linejoin="round"`)
        + `<path d="M${f2(cx + 2.4)},${f2(cy - 3.2)} q0.5,0.5 1,0 M${f2(cx + 3.9)},${f2(cy - 3)} q0.5,0.5 1,0" stroke="#3D2A1E" stroke-width="0.4" fill="none"/>` + dot(cx + 4, cy - 2.2, 0.35, '#E58A8F')
        + `<text x="${f2(cx + 5)}" y="${f2(cy - 7)}" font-family="sans-serif" font-size="2.6" font-weight="700" fill="#5A6A80">z</text>`;
      // la roue de charrette appuyée dehors, à gauche
      return out + (() => { const T2 = tools(T.u - 0.38, T.v + 0.24, 'roue'); return wheelOf(T2); })();
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
// Haut fourneau : tour de briques qui s'affine, cerclée de fer, chaînes d'angle en pierre ; sa gueule où rougeoie la
// fonte, qui coule dans une rigole jusqu'aux lingotières ; le soufflet de cuir et son levier ; le tas de minerai et le
// tas de charbon ; fumée et étincelles montent du gueulard, la lueur orange éclaire la nuit
const fourneau = {
  light: () => [-0.02, 0.3, 12, 24, '255,130,50', true],
  layers: [{
    frame: [-36, -122, 72, 140],
    n: 8,
    fps: 5,
    draw: (T, f, n) => {
      const [x, y] = T.p(0, 0, 0);
      const pulse = [0.85, 1, 0.92, 1.08, 0.9, 1, 0.95, 1.05][f];
      const hot = o => `rgba(255,${f2(120 + 60 * (pulse - 0.85) / 0.23)},40,${o})`;
      // le sol roussi, des scories
      let out = ell(x, y + 1, 33, 13.6, '#A08A70', ` stroke="${OUT}" stroke-width="0.5"`) + ell(x - 4, y, 22, 8, '#B09A7E')
        + [[-24, 3], [22, 6], [-12, 10], [26, -2]].map(([dx, dy]) => ell(x + dx, y + dy, 1.6, 1, '#5A4A44', ` stroke="${OUT}" stroke-width="0.3"`)).join('')
        + T.shadow(0, 0, 0.42, 0.22);
      // le socle de pierre, la tour de briques par étages, ses cercles de fer et ses angles de pierre
      out += T.box(-0.32, -0.32, 0.32, 0.32, 0, 10, STONE) + ln(T.p(-0.32, 0.32, 5), T.p(0.32, 0.32, 5), 'rgba(120,110,95,.4)', 0.5) + ln(T.p(0.32, 0.32, 5), T.p(0.32, -0.32, 5), 'rgba(120,110,95,.4)', 0.5);
      const tiers = [[0.27, 10, 24], [0.23, 24, 38], [0.2, 38, 52], [0.17, 52, 64]];
      for (const [r, z0, z1] of tiers) {
        out += T.box(-r, -r, r, r, z0, z1, BRICK);
        for (let z = z0 + 3.5; z < z1; z += 3.5) out += ln(T.p(-r, r, z), T.p(r, r, z), 'rgba(90,40,25,.35)', 0.5) + ln(T.p(r, -r, z), T.p(r, r, z), 'rgba(90,40,25,.35)', 0.5);
        for (let z = z0; z < z1; z += 7) out += T.box(r - 0.035, r - 0.035, r + 0.004, r + 0.004, z, Math.min(z + 3.5, z1), { top: '#EDE6DA', left: '#E2D8C8', right: '#C8BCA8' }, ' stroke="rgba(60,40,25,.45)" stroke-width="0.4"');
        out += ln(T.p(-r - 0.005, r + 0.005, z1 - 1), T.p(r + 0.005, r + 0.005, z1 - 1), DARK_IRON.right, 1.2) + ln(T.p(r + 0.005, r + 0.005, z1 - 1), T.p(r + 0.005, -r - 0.005, z1 - 1), DARK_IRON.right, 1.2);
      }
      out += T.box(-0.19, -0.19, 0.19, 0.19, 64, 67, STONE);
      // la gueule, la fonte qui coule dans la rigole, les lingotières
      const [mx, my] = T.p(-0.02, 0.27, 10);
      const [ax, ay] = T.p(-0.02, 0.32, 0), [bx, by] = T.p(-0.04, 0.42, 0), [cx, cy] = T.p(-0.16, 0.46, 0);
      out += `<path d="M${f2(mx - 6.4)},${f2(my)} L${f2(mx - 6.4)},${f2(my - 8)} A6.4,6 0 0 1 ${f2(mx + 6.4)},${f2(my - 8)} L${f2(mx + 6.4)},${f2(my)} Z" fill="#2A140C" stroke="${OUT}" stroke-width="0.6"/>`
        + ell(mx, my - 4, 5 * pulse, 3.6 * pulse, '#F2862A') + ell(mx, my - 3.4, 3.2 * pulse, 2 * pulse, '#FFD24E')
        + `<path d="M${f2(mx)},${f2(my - 1)} L${f2(ax)},${f2(ay)} Q${f2(bx + 2)},${f2(by - 1)} ${f2(bx)},${f2(by)} L${f2(cx)},${f2(cy)}" stroke="#3A2A20" stroke-width="3.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`
        + `<path d="M${f2(mx)},${f2(my - 1)} L${f2(ax)},${f2(ay)} Q${f2(bx + 2)},${f2(by - 1)} ${f2(bx)},${f2(by)} L${f2(cx)},${f2(cy)}" stroke="${hot(1)}" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`
        + [[-0.22, 0.42], [-0.1, 0.48]].map(([u, v]) => T.face([[u - 0.05, v - 0.03, 0.4], [u + 0.05, v - 0.03, 0.4], [u + 0.05, v + 0.03, 0.4], [u - 0.05, v + 0.03, 0.4]], '#3A2A20', ` stroke="${OUT}" stroke-width="0.5"`)
          + T.face([[u - 0.035, v - 0.018, 0.5], [u + 0.035, v - 0.018, 0.5], [u + 0.035, v + 0.018, 0.5], [u - 0.035, v + 0.018, 0.5]], hot(0.95))).join('');
      // le soufflet de cuir, sa tuyère et son levier qui pompe
      const lev = f % 2 ? 2 : 0;
      out += T.box(0.3, -0.06, 0.42, 0.1, 3, 5, WOOD)
        + poly([T.p(0.3, -0.04, 6), T.p(0.42, -0.04, 9 + lev), T.p(0.42, 0.08, 9 + lev), T.p(0.3, 0.08, 6)], '#7A4A2A', ` stroke="${OUT}" stroke-width="0.5"`)
        + [0.34, 0.38].map(u => ln(T.p(u, 0.08, 6.4 + (u - 0.3) * 25 * (lev ? 1.25 : 1)), T.p(u, -0.04, 6.4 + (u - 0.3) * 25 * (lev ? 1.25 : 1)), 'rgba(40,20,10,.4)', 0.5)).join('')
        + ln(T.p(0.3, 0.02, 7), T.p(0.27, 0.02, 14), IRON.right, 1.6)
        + ln(T.p(0.42, 0.02, 9 + lev), T.p(0.5, 0.02, 15 + lev * 1.5), WOOD.right, 1.3);
      // le tas de minerai et le tas de charbon devant
      out += boulder(T.u + 0.2, T.v + 0.36, 0.1, 0.08, 5, { top: '#B07A62', left: '#8A5A46', right: '#643E30' }, 5, 0.4, 0.5)
        + boulder(T.u + 0.36, T.v + 0.2, 0.08, 0.07, 4, { top: '#55555C', left: '#36363C', right: '#222227' }, 9, 0.45, 0.5)
        + [[0.36, 0.2, 4.6], [0.33, 0.24, 3]].map(([u, v, z]) => dot(...T.p(u, v, z), 0.5, '#C6D4EA')).join('');
      // la fumée et les étincelles du gueulard
      const [gx, gy] = T.p(0, 0, 66);
      out += [0, 1, 2].map(k => { const p = ((f + k * 3) % n) / n; return puff(gx - 3 + p * 8, gy - 4 - p * 30, 3 + p * 5, 0.65 * (1 - p)); }).join('')
        + [0, 1, 2, 3].map(k => { const p = ((f * 1.3 + k * 2) % n) / n; return dot(gx + Math.sin(k * 2.3 + p * 3) * 6, gy - 2 - p * 22, 0.9, p < 0.7 ? '#FFC24A' : '#FF7A3A'); }).join('');
      return out;
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

// Métier à tisser (Foyer) : sous un auvent de tuiles, un vrai métier de bois (fils de chaîne, lisse qui monte et
// descend, navette qui court, toile à rayures qui s'enroule) et son tabouret ; le panier de pelotes dont un fil file au
// métier ; des écheveaux qui sèchent sur un fil ; la bruyère autour
const metier = {
  layers: [{
    frame: [-34, -52, 68, 66],
    n: 4,
    fps: 2,
    draw: (T, f, n) => {
      const [x, y] = T.p(0, 0, 0);
      const sway = wave(f, n, 1);
      // la lande et ses touffes de bruyère
      const heather = (du, dv, s) => { const [hx, hy] = T.p(du, dv, 0); return [-2.4, -0.8, 0.8, 2.4].map((o, i) => ln([hx + o * 0.5 * s, hy], [hx + o * s, hy - (4 + (i % 2) * 1.6) * s], '#6F8C46', 0.7)).join('') + [[-2.2, -4.4], [-0.6, -5.8], [1, -4.8], [2.4, -5.2], [0, -3.6]].map(([dx, dy], i) => dot(hx + dx * s, hy + dy * s, 0.9 * s, i % 2 ? '#B57BC4' : '#D49ADB')).join(''); };
      let out = ell(x, y + 1, 31, 13, '#B9B47C', ` stroke="${OUT}" stroke-width="0.5"`) + ell(x - 4, y, 21, 8, '#C8C48E')
        + heather(-0.44, -0.06, 1) + heather(-0.12, -0.44, 0.9) + T.shadow(0, 0, 0.36, 0.18);
      // les écheveaux qui sèchent sur un fil, au fond à droite
      const [ax, ay] = T.p(0.42, -0.36, 15), [bx, by] = T.p(0.42, 0, 15);
      out += post(T, 0.42, -0.36, 0, 16, WOOD_DARK, 0.012) + post(T, 0.42, 0, 0, 16, WOOD_DARK, 0.012)
        + `<path d="M${f2(ax)},${f2(ay)} Q${f2((ax + bx) / 2)},${f2((ay + by) / 2 + 2.4)} ${f2(bx)},${f2(by)}" stroke="#7A5A2A" stroke-width="0.6" fill="none"/>`
        + [[0.25, '#E2574C'], [0.5, '#6FA3D9'], [0.75, '#F2C04B']].map(([t, c], i) => { const sx = ax + (bx - ax) * t, sy = ay + (by - ay) * t + Math.sin(t * Math.PI) * 2.4, d = sway * (0.6 + i * 0.2); return `<path d="M${f2(sx - 1.4)},${f2(sy)} Q${f2(sx - 2 + d)},${f2(sy + 5)} ${f2(sx + d)},${f2(sy + 7.4)} Q${f2(sx + 2 + d)},${f2(sy + 5)} ${f2(sx + 1.4)},${f2(sy)}" stroke="${c}" stroke-width="1.6" fill="none" stroke-linecap="round"/>` + ln([sx - 1, sy + 0.6], [sx + 1, sy + 0.6], 'rgba(0,0,0,.25)', 0.5); }).join('');
      // les poteaux du fond, le métier
      out += post(T, -0.24, -0.16, 0, 24, WOOD_DARK, 0.025) + post(T, 0.24, -0.16, 0, 24, WOOD_DARK, 0.025)
        + post(T, -0.3, 0.02, 0, 22, WOOD, 0.018) + post(T, 0.1, 0.02, 0, 22, WOOD, 0.018);
      // la toile tissée qui avance, rayure après rayure
      const rows = ['#E2574C', '#F4ECDC', '#6FA3D9', '#F2C04B'];
      for (let k = 0; k < 4; k++) out += T.face([[-0.28, 0.02, 6 + k * 1.75], [0.08, 0.02, 6 + k * 1.75], [0.08, 0.02, 7.75 + k * 1.75], [-0.28, 0.02, 7.75 + k * 1.75]], rows[(k + f) % rows.length], ` stroke="rgba(60,40,25,.35)" stroke-width="0.3"`);
      // les fils de chaîne, la lisse qui monte et descend, l'ensouple du haut
      for (let i = 0; i <= 10; i++) { const u = -0.27 + i * 0.034; out += ln(T.p(u, 0.02, 20.4), T.p(u, 0.02, 13), 'rgba(250,245,230,.95)', 0.4); }
      const zl = 16.6 + (f % 2 ? 1.2 : -1.2);
      out += ln(T.p(-0.29, 0.02, zl), T.p(0.09, 0.02, zl), WOOD_DARK.right, 1.3)
        + ln(T.p(-0.32, 0.02, 21), T.p(0.12, 0.02, 21), WOOD.right, 2.2) + ln(T.p(-0.32, 0.02, 21.6), T.p(0.12, 0.02, 21.6), WOOD.top, 0.6)
        // l'ensouple du bas où s'enroule la toile
        + ln(T.p(-0.32, 0.03, 5.4), T.p(0.12, 0.03, 5.4), '#C9564A', 3) + ln(T.p(-0.32, 0.03, 6.2), T.p(0.12, 0.03, 6.2), 'rgba(255,255,255,.3)', 0.6);
      // la navette qui court d'un bord à l'autre, son fil
      const su = [-0.23, -0.1, 0.03, -0.1][f];
      const [nx, ny] = T.p(su, 0.05, 13.2);
      out += ln(T.p(-0.28, 0.02, 13.2), [nx, ny], '#E2574C', 0.5)
        + `<path d="M${f2(nx - 3.4)},${f2(ny)} Q${f2(nx)},${f2(ny - 1.6)} ${f2(nx + 3.4)},${f2(ny)} Q${f2(nx)},${f2(ny + 1.2)} ${f2(nx - 3.4)},${f2(ny)} Z" fill="${WOOD.top}" stroke="${OUT}" stroke-width="0.5"/>` + dot(nx, ny - 0.2, 0.6, '#E2574C');
      // les poteaux de devant et l'auvent de tuiles
      out += post(T, -0.24, 0.16, 0, 24, WOOD_DARK, 0.025) + post(T, 0.24, 0.16, 0, 24, WOOD_DARK, 0.025)
        + T.gable(-0.3, -0.22, 0.3, 0.22, 24, 10, { front: ROOF_RED.front, back: ROOF_RED.back, gable: WOOD.right }, 0.06);
      for (const t of [0.33, 0.66]) out += ln(T.p(-0.36, 0.28 * t, 34 - 10 * t), T.p(0.36, 0.28 * t, 34 - 10 * t), 'rgba(110,40,30,.45)', 0.7);
      for (let i = 0; i < 7; i++) { const u = -0.31 + i * 0.1; out += ln(T.p(u, 0, 34), T.p(u, 0.28, 24), 'rgba(110,40,30,.25)', 0.5); }
      out += ln(T.p(-0.36, 0, 34), T.p(0.36, 0, 34), '#8A3A2C', 1.6) + ln(T.p(-0.36, 0.004, 34.6), T.p(0.36, 0.004, 34.6), 'rgba(255,220,200,.6)', 0.5);
      // le tabouret de la tisserande
      out += [[-0.14, 0.22], [-0.06, 0.22], [-0.14, 0.3], [-0.06, 0.3]].map(([u, v]) => post(T, u, v, 0, 4.6, WOOD_DARK, 0.008)).join('')
        + T.box(-0.16, 0.2, -0.04, 0.32, 4.6, 5.8, WOOD);
      // le panier de pelotes, et le fil rouge qui file jusqu'au métier
      const [kx, ky] = T.p(-0.34, 0.28, 0);
      const ball = (dx, dy, c) => dot(kx + dx, ky + dy, 2.6, c) + `<path d="M${f2(kx + dx - 2)},${f2(ky + dy - 1)} q2,-1.2 4,0.6 M${f2(kx + dx - 1.6)},${f2(ky + dy + 0.6)} q2,-1 3.4,0.6" stroke="rgba(0,0,0,.2)" stroke-width="0.5" fill="none"/>`;
      out += ell(kx + 1, ky + 0.6, 7, 2.2, 'rgba(40,55,20,.22)')
        + ball(-2.4, -5.4, '#6FA3D9') + ball(2.2, -5.6, '#F2C04B') + ball(0, -7.2, '#E2574C')
        + `<path d="M${f2(kx - 6)},${f2(ky - 5)} L${f2(kx - 4.8)},${f2(ky)} Q${f2(kx)},${f2(ky + 1.8)} ${f2(kx + 4.8)},${f2(ky)} L${f2(kx + 6)},${f2(ky - 5)} Q${f2(kx)},${f2(ky - 2.8)} ${f2(kx - 6)},${f2(ky - 5)} Z" fill="#C9A060" stroke="${OUT}" stroke-width="0.6"/>`
        + `<path d="M${f2(kx - 5.4)},${f2(ky - 2.4)} Q${f2(kx)},${f2(ky - 0.4)} ${f2(kx + 5.4)},${f2(ky - 2.4)}" stroke="#A07838" stroke-width="0.6" fill="none"/>`;
      const [tx, ty] = T.p(-0.28, 0.04, 8);
      return out + `<path d="M${f2(kx)},${f2(ky - 8)} Q${f2((kx + tx) / 2)},${f2(ky - 3 + sway)} ${f2(tx)},${f2(ty)}" stroke="#E2574C" stroke-width="0.5" fill="none"/>`;
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
      const LEVEE = { top: '#DCCBA6', left: '#C2AC84', right: '#9E8864' };
      const [x, y] = T.p(0, 0, 0);
      // le sable des dunes et ses touffes d'oyat qui plient au vent
      const oyat = (du, dv, s, ph) => { const [ox, oy] = T.p(du, dv, 0); return [-3, -1.5, 0, 1.6, 3].map((o, i) => `<path d="M${f2(ox + o * 0.4)},${f2(oy)} q${f2(o * 0.5)},${f2(-5 * s)} ${f2(o * 1.3 + wave(f, n, 0.7, ph + i * 0.5))},${f2(-(8 + (i % 2) * 2.5) * s)}" stroke="${i % 2 ? '#B7C27A' : '#8FA45A'}" stroke-width="0.9" fill="none" stroke-linecap="round"/>`).join(''); };
      let out = ell(x, y - 1, 33, 12, '#EAD6A2', ` stroke="${OUT}" stroke-width="0.5"`) + ell(x - 5, y - 3, 22, 7, '#F3E4BC')
        + [[-20, 5, 1], [24, 2, 0.9], [8, 9, 0.8]].map(([dx, dy, r]) => ell(x + dx, y + dy, r * 1.6, r, '#CDB27A')).join('')
        + oyat(-0.46, -0.02, 0.9, 0);
      // le mulon de sel au fond, la pelle plantée dedans, un grain qui scintille
      const [hx, hy] = T.p(-0.36, -0.34, 0);
      out += T.shadow(-0.36, -0.34, 0.13, 0.18)
        + `<g transform="translate(${f2(hx)} ${f2(hy)}) scale(.72) translate(${f2(-hx)} ${f2(-hy)})">`
        + ln([hx + 4, hy - 10], [hx + 9.6, hy - 27], WOOD.right, 1.7) + ln([hx + 7.6, hy - 27.6], [hx + 11.6, hy - 26.4], WOOD.right, 1.7)
        + `<path d="M${hx - 15},${hy + 1} Q${hx - 9},${hy - 12} ${hx - 1},${hy - 21.6} Q${hx + 1},${hy - 23.2} ${hx + 3},${hy - 21.4} Q${hx + 10},${hy - 12} ${hx + 15},${hy + 1} Q${hx},${hy + 6} ${hx - 15},${hy + 1} Z" fill="#FFFFFF" stroke="${OUT}" stroke-width="0.7"/>`
        + `<path d="M${hx + 3},${hy - 21.4} Q${hx + 10},${hy - 12} ${hx + 15},${hy + 1} Q${hx + 9},${hy + 4} ${hx + 4},${hy + 4.6} Q${hx + 6.6},${hy - 8} ${hx + 3},${hy - 21.4} Z" fill="#DDE5EE"/>`
        + [[-9, -4], [-5, -10], [1, -6], [-11, -1], [6, -2], [-2, -15], [-6, 1]].map(([dx, dy]) => ln([hx + dx, hy + dy], [hx + dx + 1.4, hy + dy + 0.6], 'rgba(140,160,185,.55)', 0.5)).join('')
        + `<path d="M${hx - 6},${hy - 14} q2,-2.6 4.4,-4.6" stroke="#FFFFFF" stroke-width="1.4" fill="none" stroke-linecap="round" opacity="0.9"/>`
        + (([sx, sy]) => star(hx + sx, hy + sy, 2.4, '#FFFFFF', 0.5 + 0.5 * Math.abs(wave(f, n)) ) + star(hx + sx, hy + sy, 1.2, '#BFE6FF', 0.9))([[-5, -12], [3, -17], [8, -5]][f % 3]) + '</g>';
      // le panier de sel du saunier et le las (râteau plat) appuyé dessus
      const [bx, by] = T.p(-0.36, 0.14, 0);
      out += `<g transform="translate(${f2(bx)} ${f2(by)}) scale(.8) translate(${f2(-bx)} ${f2(-by)})">` + ell(bx + 1, by + 0.6, 7, 2.4, 'rgba(40,55,20,.2)')
        + `<path d="M${bx - 6},${by - 8} L${bx - 4.6},${by} Q${bx},${by + 2} ${bx + 4.6},${by} L${bx + 6},${by - 8} Z" fill="#C9A060" stroke="${OUT}" stroke-width="0.6"/>`
        + [2.6, 5.2].map(d => `<path d="M${f2(bx - 6 + d * 0.27)},${f2(by - 8 + d)} Q${bx},${f2(by - 6 + d)} ${f2(bx + 6 - d * 0.27)},${f2(by - 8 + d)}" stroke="#A07838" stroke-width="0.6" fill="none"/>`).join('')
        + [-3, 0, 3].map(o => ln([bx + o * 1.1, by - 7], [bx + o * 0.9, by + 0.8], 'rgba(120,85,40,.5)', 0.5)).join('')
        + ell(bx, by - 8, 6, 2.2, '#A87C40', ` stroke="${OUT}" stroke-width="0.6"`)
        + `<path d="M${bx - 5.2},${by - 8.4} Q${bx - 1},${by - 14.4} ${bx + 5.2},${by - 8.4} Q${bx},${by - 6.6} ${bx - 5.2},${by - 8.4} Z" fill="#FFFFFF" stroke="${SALT.right}" stroke-width="0.5"/>`
        + ln([bx - 10, by + 2.4], [bx + 1.4, by - 16], WOOD.right, 1.3) + ln([bx - 9.6, by + 2], [bx + 1.6, by - 15.6], WOOD.top, 0.5)
        + ln([bx - 14, by + 3.6], [bx - 6, by + 1.2], WOOD_DARK.right, 2.2) + '</g>';
      // les bassins : un talus d'argile, quatre bassins creusés, de plus en plus salés
      out += T.shadow(0.08, 0.08, 0.34, 0.12) + T.box(-0.2, -0.2, 0.36, 0.36, 0, 2.4, LEVEE);
      const a = 0.12, z = 1.1;
      [[-0.06, -0.06, '#7CC6EA'], [0.22, -0.06, '#A8DDE8'], [-0.06, 0.22, '#F1C3CB'], [0.22, 0.22, '#F4EFE6']].forEach(([u, v, c], k) => {
        out += T.face([[u - a, v - a, 2.4], [u + a, v - a, 2.4], [u + a, v - a, z], [u - a, v - a, z]], LEVEE.left)
          + T.face([[u - a, v - a, 2.4], [u - a, v + a, 2.4], [u - a, v + a, z], [u - a, v - a, z]], LEVEE.right)
          + T.face([[u - a, v - a, z], [u + a, v - a, z], [u + a, v + a, z], [u - a, v + a, z]], c, ` stroke="rgba(60,40,25,.35)" stroke-width="0.4"`);
        if (k < 3) {
          // un reflet qui glisse sur l'eau
          const t = ((f + k * 2) % n) / n, dv = -a * 0.6 + t * a * 1.2;
          out += ln(T.p(u - a * 0.55, v + dv, z), T.p(u + a * 0.15, v + dv, z), 'rgba(255,255,255,.8)', 0.8)
            + ln(T.p(u - a * 0.1, v + dv + a * 0.35, z), T.p(u + a * 0.4, v + dv + a * 0.35, z), 'rgba(255,255,255,.45)', 0.6);
        } else {
          // la croûte de sel : des cristaux et un petit tas ramassé au milieu
          out += [[-0.06, -0.05], [0.05, -0.06], [-0.05, 0.05], [0.06, 0.04], [0, -0.02]].map(([du, dv]) => { const [cx, cy] = T.p(u + du, v + dv, z); return poly([[cx - 1.1, cy], [cx, cy - 0.6], [cx + 1.1, cy], [cx, cy + 0.6]], '#FFFFFF'); }).join('');
          const [mx, my] = T.p(u + 0.01, v + 0.01, z);
          out += `<path d="M${f2(mx - 4.4)},${f2(my + 0.6)} Q${f2(mx - 0.6)},${f2(my - 5.6)} ${f2(mx + 4.4)},${f2(my + 0.6)} Z" fill="#FFFFFF" stroke="${SALT.right}" stroke-width="0.5"/>`
            + star(mx + 1, my - 3.6, 1.6, '#FFFFFF', f % 2 ? 1 : 0.4);
        }
      });
      // la mouette sur le coin du talus ; elle picore une fois
      const [gx, gy] = T.p(0.33, -0.17, 2.4);
      const pk = f === 3 ? 1 : 0, hxg = gx + 4.2 + pk * 1.4, hyg = gy - 9.6 + pk * 4.6;
      out += `<g transform="translate(${f2(gx)} ${f2(gy)}) scale(.62) translate(${f2(-gx)} ${f2(-gy)})">` + ell(gx, gy + 0.4, 4.6, 1.2, 'rgba(40,55,20,.2)')
        + ln([gx - 0.8, gy - 3], [gx - 1, gy], '#E8923A', 0.7) + ln([gx + 1, gy - 3], [gx + 1.2, gy], '#E8923A', 0.7)
        + `<path d="M${f2(gx - 6.4)},${f2(gy - 6.2)} Q${f2(gx - 3)},${f2(gy - 9.4)} ${f2(gx + 2)},${f2(gy - 8.6)} Q${f2(gx + 5)},${f2(gy - 7.6)} ${f2(gx + 3.6)},${f2(gy - 4.4)} Q${f2(gx)},${f2(gy - 2.4)} ${f2(gx - 3.6)},${f2(gy - 4)} Z" fill="#FFFFFF" stroke="${OUT}" stroke-width="0.5"/>`
        + `<path d="M${f2(gx - 7.6)},${f2(gy - 6.6)} Q${f2(gx - 3)},${f2(gy - 9.2)} ${f2(gx + 2)},${f2(gy - 7.4)} Q${f2(gx - 1)},${f2(gy - 4.6)} ${f2(gx - 5)},${f2(gy - 5)} Z" fill="#AEB8C4" stroke="${OUT}" stroke-width="0.4"/>`
        + `<path d="M${f2(gx - 7.6)},${f2(gy - 6.6)} l2.4,0.1 l-0.8,1.3 Z" fill="#2E3238"/>`
        + ln([gx + 2.4, gy - 7.4], [hxg - 0.6, hyg + 1], OUT, 3.4) + ln([gx + 2.4, gy - 7.4], [hxg - 0.6, hyg + 1], '#FFFFFF', 2.4)
        + `<circle cx="${f2(hxg)}" cy="${f2(hyg)}" r="2.2" fill="#FFFFFF" stroke="${OUT}" stroke-width="0.5"/>`
        + `<path d="M${f2(hxg + 1.8)},${f2(hyg - 0.5)} l3,0.8 l-3,0.8 Z" fill="#F2C443" stroke="${OUT}" stroke-width="0.3"/>` + dot(hxg + 4, hyg + 0.6, 0.45, '#E2463A')
        + dot(hxg + 0.7, hyg - 0.6, 0.5, '#2A2420') + '</g>';
      return out + oyat(0.45, -0.4, 0.8, 1.6) + oyat(-0.44, 0.38, 1, 3);
    }
  }]
};

// Serre tropicale (Potager) : sur un muret de pierre, une serre de verre aux montants de fer (carreaux, reflets, porte,
// lucarne entrouverte, épi de faîtage) ; dedans un bananier, des palmes, des hibiscus et des fruits dorés ; la buée
// perle et glisse sur le verre, la vapeur sort de la lucarne ; un perroquet sur le faîte ; de grandes feuilles autour
const serre = {
  light: () => [0, 0, 16, 18, '190,255,170'],
  layers: [{
    frame: [-36, -58, 72, 72],
    n: 6,
    fps: 2,
    draw: (T, f, n) => {
      const GF = { top: 'rgba(225,243,255,.3)', left: 'rgba(196,228,246,.24)', right: 'rgba(160,205,232,.34)' };
      const k = f / n;
      const [x, y] = T.p(0, 0, 0);
      // une grande feuille fendue (monstera), posée au sol, tournée de a degrés
      const leaf = (lx, ly, s, a, c) => `<g transform="translate(${f2(lx)} ${f2(ly)}) rotate(${a}) scale(${s})"><path d="M0,0 Q-6,-3 -6,-9 Q-5,-14 0,-15 Q5,-14 6,-9 Q6,-3 0,0 Z" fill="${c}" stroke="${OUT}" stroke-width="0.5"/>`
        + `<path d="M0,0 L0,-14 M0,-5 L-4.6,-7 M0,-9 L-4.4,-11.4 M0,-5 L4.6,-7 M0,-9 L4.4,-11.4" stroke="rgba(20,60,30,.5)" stroke-width="0.6" fill="none"/></g>`;
      // le sol de la jungle et ses feuilles
      let out = ell(x, y + 1, 32, 13, '#6E8A48', ` stroke="${OUT}" stroke-width="0.5"`) + ell(x - 4, y, 22, 8, '#7E9C54')
        + leaf(x - 24, y - 2, 0.9, -40, '#3E8A48') + leaf(x - 20, y + 1, 0.7, -10, '#5FAE5A')
        + T.shadow(0, 0, 0.42, 0.16) + T.box(-0.3, -0.24, 0.3, 0.24, 0, 3, STONE);
      // dedans, derrière le verre : bananier, palmes, hibiscus, fruits dorés
      const [px, py] = T.p(0, 0, 3);
      out += ln([px - 6, py], [px - 7, py - 16], '#8A6A3A', 1.6)
        + [[-20, -24, '#3E8A48'], [8, -24, '#5FAE5A'], [-14, -14, '#5FAE5A'], [2, -12, '#3E8A48']].map(([dx, dy, c], i) => `<path d="M${f2(px - 7)},${f2(py - 16)} Q${f2(px - 7 + dx * 0.4)},${f2(py - 16 + dy * 0.6)} ${f2(px - 7 + dx * 0.9)},${f2(py - 16 + dy * 0.35 + (i % 2) * 2)} Q${f2(px - 7 + dx * 0.5)},${f2(py - 16 + dy * 0.2)} ${f2(px - 7)},${f2(py - 16)} Z" fill="${c}" stroke="#2E6A38" stroke-width="0.4"/>`).join('')
        + [-2, 10].map((dx, i) => `<path d="M${px + dx},${py} q-6,-10 -12,-12 q6,0 12,6 q0,-12 6,-18 q-2,10 0,18 q6,-8 12,-8 q-6,4 -12,14 Z" fill="${i ? '#3E8A48' : '#5FAE5A'}"/>`).join('')
        + [[-12, -8], [6, -16], [14, -8]].map(([dx, dy]) => ell(px + dx, py + dy, 2.2, 2.8, '#F2B23C', ` stroke="#8A5A14" stroke-width="0.4"`)).join('')
        + [[-2, -6], [12, -14]].map(([dx, dy]) => [0, 72, 144, 216, 288].map(a => ell(px + dx + Math.cos(a * Math.PI / 180) * 1.6, py + dy + Math.sin(a * Math.PI / 180) * 1.6, 1.4, 1.4, '#E2463A')).join('') + dot(px + dx, py + dy, 0.8, '#FFD24E')).join('');
      // la serre de verre, ses montants de fer, ses reflets
      out += T.box(-0.3, -0.24, 0.3, 0.24, 3, 22, GF, GLASS_EDGE);
      for (let i = 1; i < 4; i++) out += ln(T.p(-0.3 + i * 0.15, 0.24, 3), T.p(-0.3 + i * 0.15, 0.24, 22), DARK_IRON.left, 0.8);
      for (let i = 1; i < 4; i++) out += ln(T.p(0.3, -0.24 + i * 0.12, 3), T.p(0.3, -0.24 + i * 0.12, 22), DARK_IRON.left, 0.8);
      out += ln(T.p(-0.3, 0.24, 13), T.p(0.3, 0.24, 13), DARK_IRON.left, 0.7) + ln(T.p(0.3, 0.24, 13), T.p(0.3, -0.24, 13), DARK_IRON.left, 0.7)
        + [[-0.27, -0.18], [0.03, 0.12]].map(([u0, u1]) => ln(T.p(u0, 0.24, 6), T.p(u1, 0.24, 20), 'rgba(255,255,255,.55)', 1.2)).join('')
        + ln(T.p(0.3, 0.16, 6), T.p(0.3, 0.04, 19), 'rgba(255,255,255,.45)', 1.2);
      // la porte vitrée, sa poignée
      out += T.face([[-0.1, 0.241, 3], [0.03, 0.241, 3], [0.03, 0.241, 15], [-0.1, 0.241, 15]], 'rgba(200,236,250,.25)', ` stroke="${DARK_IRON.right}" stroke-width="1"`)
        + dot(...T.p(0.015, 0.241, 9), 0.7, '#E2B347');
      // la buée qui perle et une goutte qui glisse
      out += [[-0.24, 0.24, 18], [-0.16, 0.24, 9], [0.18, 0.24, 17], [0.3, -0.08, 10], [0.3, 0.1, 19]].map(([u, v, z]) => dot(...T.p(u, v, z), 0.55, 'rgba(255,255,255,.75)')).join('')
        + (([gx, gy]) => dot(gx, gy, 0.8, 'rgba(255,255,255,.9)') + ln([gx, gy - 0.6], [gx, gy - 3], 'rgba(255,255,255,.5)', 0.5))(T.p(0.21, 0.24, 20 - k * 12));
      // le toit de verre, ses montants, la lucarne entrouverte qui fume, l'épi de faîtage
      out += T.gable(-0.3, -0.24, 0.3, 0.24, 22, 10, { front: 'rgba(210,236,250,.42)', back: 'rgba(190,220,240,.4)', gable: 'rgba(170,210,235,.34)' }, 0.02, GLASS_EDGE);
      for (let i = 1; i < 6; i++) out += ln(T.p(-0.32 + i * 0.107, 0, 32), T.p(-0.32 + i * 0.107, 0.26, 22), DARK_IRON.left, 0.6);
      out += ln(T.p(-0.32, 0, 32), T.p(0.32, 0, 32), DARK_IRON.right, 1.4)
        + T.face([[-0.2, 0.02, 31.2], [-0.06, 0.02, 31.2], [-0.06, 0.1, 33.6], [-0.2, 0.1, 33.6]], 'rgba(220,240,255,.7)', ` stroke="${DARK_IRON.right}" stroke-width="0.7"`);
      const [vx, vy] = T.p(-0.13, 0.06, 33);
      out += [0, 0.5].map(o => { const t = (k + o) % 1; return puff(vx + t * 3, vy - 2 - t * 9, 1.8 + t * 2.4, 0.65 * (1 - t)); }).join('');
      const [ex, ey] = T.p(0.32, 0, 32);
      out += ln([ex, ey], [ex, ey - 4], DARK_IRON.right, 0.9) + dot(ex, ey - 4.6, 1.1, '#E2B347');
      // le perroquet sur le faîte, qui hoche la tête
      const [qx, qy] = T.p(0.16, 0, 32), bob = f % 3 === 1 ? 1 : 0;
      out += ln([qx - 0.6, qy], [qx - 0.8, qy - 1.6], '#3D3A36', 0.6) + ln([qx + 0.8, qy], [qx + 0.8, qy - 1.6], '#3D3A36', 0.6)
        + `<path d="M${f2(qx - 1.6)},${f2(qy - 2)} L${f2(qx - 4.6)},${f2(qy + 3)} L${f2(qx - 2.6)},${f2(qy + 3.4)} L${f2(qx - 0.4)},${f2(qy - 1.4)} Z" fill="#3FA0D8" stroke="${OUT}" stroke-width="0.4"/>`
        + ell(qx, qy - 4, 2.6, 3.2, '#E2463A', ` stroke="${OUT}" stroke-width="0.5"`)
        + `<path d="M${f2(qx - 2.4)},${f2(qy - 4.6)} Q${f2(qx - 3)},${f2(qy - 1.6)} ${f2(qx - 1)},${f2(qy - 1)} Q${f2(qx)},${f2(qy - 3)} ${f2(qx - 2.4)},${f2(qy - 4.6)} Z" fill="#5FBF5A" stroke="${OUT}" stroke-width="0.4"/>`
        + `<circle cx="${f2(qx + 1)}" cy="${f2(qy - 7.4 + bob)}" r="2" fill="#E2463A" stroke="${OUT}" stroke-width="0.5"/>` + ell(qx + 1.6, qy - 7.4 + bob, 1, 1.2, '#FFF3C4')
        + `<path d="M${f2(qx + 2.6)},${f2(qy - 8.2 + bob)} q1.8,0.2 1.4,2 q-0.6,-0.8 -1.4,-0.6 Z" fill="#3D3A36"/>` + dot(qx + 1.7, qy - 7.8 + bob, 0.45, '#2A2024');
      // de grandes feuilles devant, à droite
      return out + leaf(x + 22, y + 4, 0.9, 30, '#3E8A48') + leaf(x + 26, y, 0.7, 60, '#5FAE5A');
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
      const k = f / n, flick = Math.sin(k * TAU);
      const ROCK = { top: '#6E667A', left: '#4A4555', right: '#312D39' };
      const lava = o => `rgba(255,${f2(118 + 52 * flick)},40,${o})`;
      const [x, y] = T.p(0, 0, 0);
      // le sol de basalte et ses fentes de lave
      let out = ell(x, y + 1, 31, 13, '#6A6070', ` stroke="${OUT}" stroke-width="0.5"`) + ell(x - 4, y, 21, 8, '#7A7080')
        + [[-14, 6, 1.2], [20, 5, 1], [-2, 10, 0.9], [26, -1, 0.8]].map(([dx, dy, r]) => ell(x + dx, y + dy, r * 1.6, r, '#544A5A')).join('');
      for (const d of [`M${x - 26},${y + 3} l6,-2 l4,2 l5,-1`, `M${x + 8},${y + 9} l5,-3 l6,1`, `M${x + 17},${y - 5} l4,2 l6,-1.4`]) {
        out += `<path d="${d}" stroke="${lava(0.25)}" stroke-width="2.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`
          + `<path d="${d}" stroke="${lava(0.95)}" stroke-width="0.9" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
      }
      // le tas d'obsidienne brute, au fond à droite, ses reflets violets
      const [ox, oy] = T.p(0.44, -0.2, 0);
      out += ell(ox + 1, oy + 0.6, 10, 3.4, 'rgba(20,15,25,.35)')
        + [[-6, 0, 5], [5, 0.6, 4.6], [0, -3.6, 5.4], [-2, 1.6, 4]].map(([dx, dy, r]) => poly([[ox + dx - r, oy + dy], [ox + dx - r * 0.5, oy + dy - r * 1.1], [ox + dx + r * 0.4, oy + dy - r * 1.3], [ox + dx + r, oy + dy - r * 0.3], [ox + dx + r * 0.7, oy + dy + r * 0.3]], '#2A2733', ` stroke="${OUT}" stroke-width="0.5" stroke-linejoin="round"`)
          + ln([ox + dx - r * 0.4, oy + dy - r * 0.9], [ox + dx + r * 0.2, oy + dy - r * 1.1], 'rgba(190,160,255,.75)', 0.7)).join('')
        + star(ox + 1, oy - 9, 1.8, '#E4D6FF', f % 3 === 1 ? 1 : 0.25);
      // la cheminée de pierres noires, derrière le foyer, sa fumée et ses étincelles
      const [cx, cy] = T.p(-0.2, -0.18, 6);
      const cb = 10, ct = 6.4, ch = 25;
      out += poly([[cx - cb, cy], [cx - ct, cy - ch], [cx + ct, cy - ch], [cx + cb, cy]], ROCK.left, ` stroke="${OUT}" stroke-width="0.7" stroke-linejoin="round"`)
        + poly([[cx + 1.6, cy], [cx + 1, cy - ch], [cx + ct, cy - ch], [cx + cb, cy]], ROCK.right);
      for (let r = 1; r < 5; r++) {
        const yy = cy - r * (ch / 5), w = cb - (cb - ct) * (r / 5);
        out += ln([cx - w, yy], [cx + w, yy], 'rgba(20,16,26,.7)', 0.6);
        const off = r % 2 ? -w * 0.3 : w * 0.25;
        out += ln([cx + off, yy], [cx + off, yy + ch / 5], 'rgba(20,16,26,.6)', 0.5);
      }
      out += ln([cx - cb + 1.4, cy - 1], [cx - ct + 1, cy - ch + 1], 'rgba(255,255,255,.14)', 1.2)
        + ell(cx, cy - ch, ct + 1.6, 2.2, ROCK.top, ` stroke="${OUT}" stroke-width="0.6"`) + ell(cx, cy - ch, ct - 0.6, 1.2, '#1C1820')
        + puff(cx + 1 + k * 3, cy - ch - 4 - k * 6, 2.6 + k * 2, 0.75 * (1 - k)) + puff(cx - 2 + ((k + 0.5) % 1) * 4, cy - ch - 4 - ((k + 0.5) % 1) * 6, 2.2 + ((k + 0.5) % 1) * 2, 0.6 * (1 - (k + 0.5) % 1))
        + [[3, 0], [-2, 2], [1, 4]].map(([dx, o]) => { const t = ((f + o) % n) / n; return dot(cx + dx + t * 2, cy - ch - 2 - t * 12, 0.7, t < 0.5 ? '#FFD070' : '#FF8A3A'); }).join('');
      // le soufflet de cuir, à gauche : il s'ouvre et se ferme, son bec dans le foyer
      const [bx, by] = T.p(-0.46, 0.14, 0);
      const open = 0.5 + 0.5 * Math.cos(k * TAU);
      const hx = bx + 8, hy = by - 6, top = by - 9 - open * 4;
      out += ell(bx, by + 0.4, 9, 2.4, 'rgba(20,15,25,.3)') + T.box(-0.5, 0.12, -0.42, 0.2, 0, 3, ROCK)
        + ln([hx, hy], [hx + 6, hy + 0.6], DARK_IRON.right, 1.6)
        + poly([[hx, hy], [bx - 8, top], [bx - 8, by - 4]], '#8A5A36', ` stroke="${OUT}" stroke-width="0.6" stroke-linejoin="round"`)
        + [0.35, 0.65].map(t => ln([hx + (bx - 8 - hx) * t, hy + (top - hy) * t], [hx + (bx - 8 - hx) * t, hy + (by - 4 - hy) * t], 'rgba(60,35,20,.55)', 0.6)).join('')
        + ln([hx, hy], [bx - 9, top], WOOD.right, 1.8) + ln([hx, hy], [bx - 9, by - 4], WOOD.right, 1.8)
        + ln([bx - 9, top], [bx - 12, top - 1.6], WOOD.right, 1.4);
      // le foyer rond de pierres noires, ses braises et ses flammes
      const [fx, fy] = T.p(-0.12, -0.04, 0);
      out += T.shadow(-0.12, -0.04, 0.24, 0.25)
        + `<path d="M${fx - 13},${fy} L${fx - 13},${fy - 7} A13,5.6 0 0 1 ${fx + 13},${fy - 7} L${fx + 13},${fy} A13,5.6 0 0 1 ${fx - 13},${fy} Z" fill="${ROCK.left}" stroke="${OUT}" stroke-width="0.7"/>`
        + `<path d="M${fx + 4},${fy + 5.3} L${fx + 4},${fy - 1.7} A13,5.6 0 0 0 ${fx + 13},${fy - 7} L${fx + 13},${fy} A13,5.6 0 0 1 ${fx + 4},${fy + 5.3} Z" fill="${ROCK.right}"/>`
        + [[-9, -3.4], [-3, -1.6], [3, -2], [9, -3.6], [-6, 1.6], [6, 1.4]].map(([dx, dy]) => `<path d="M${fx + dx - 2.6},${fy + dy} q2.6,-2 5.2,0" stroke="rgba(20,16,26,.7)" stroke-width="0.6" fill="none"/>`).join('')
        + ell(fx, fy - 7, 13, 5.6, ROCK.top, ` stroke="${OUT}" stroke-width="0.7"`)
        + ell(fx, fy - 7, 10, 4, '#2A1410') + ell(fx, fy - 7.2, 8.4, 3.2, lava(1))
        + [[-5, 0.6], [-1.4, -1.2], [2.6, 0.8], [5.4, -0.6], [0.4, 1.4]].map(([dx, dy], i) => dot(fx + dx, fy - 7 + dy, 1.3, i % 2 ? '#3A1A12' : '#FFE08A')).join('')
        + `<path d="M${fx - 5},${fy - 7} Q${fx - 7},${fy - 15} ${fx - 1},${f2(fy - 21 - flick * 3)} Q${fx + 1},${fy - 15} ${fx + 2},${fy - 9} Q${fx + 4},${fy - 14} ${fx + 4},${f2(fy - 17 + flick * 2)} Q${fx + 8},${fy - 11} ${fx + 5},${fy - 7} Z" fill="#F59A3C" stroke="#C8521E" stroke-width="0.5"/>`
        + `<path d="M${fx - 2.6},${fy - 7} Q${fx - 3.6},${fy - 12} ${fx - 0.6},${f2(fy - 15 - flick * 2)} Q${fx + 1.6},${fy - 11} ${fx + 2.6},${fy - 7} Z" fill="#FFE08A"/>`;
      // l'enclume de fer sur son bloc de basalte, la lame qui rougit, le marteau posé contre
      const [ax, ay] = T.p(0.3, 0.2, 7);
      out += T.shadow(0.3, 0.2, 0.13, 0.22) + T.box(0.22, 0.12, 0.38, 0.28, 0, 7, ROCK)
        + `<path d="M${ax - 7},${ay - 2} L${ax + 4},${ay - 2} Q${ax + 11},${ay - 2.4} ${ax + 12},${ay - 5} Q${ax + 7},${ay - 5.6} ${ax + 5},${ay - 6} L${ax - 7},${ay - 6} Z" fill="${DARK_IRON.left}" stroke="${OUT}" stroke-width="0.6" stroke-linejoin="round"/>`
        + poly([[ax - 4, ay - 2], [ax + 2, ay - 2], [ax + 1, ay + 1], [ax - 3, ay + 1]], DARK_IRON.right, ` stroke="${OUT}" stroke-width="0.5"`)
        + ln([ax - 6, ay - 5.6], [ax + 6, ay - 5.6], IRON.top, 0.8)
        + `<path d="M${ax - 5},${ay - 6.6} Q${ax},${ay - 8.4} ${ax + 6},${ay - 7} Q${ax},${ay - 5.8} ${ax - 5},${ay - 6.6} Z" fill="${lava(1)}" stroke="#8A3412" stroke-width="0.4"/>`
        + ell(ax, ay - 7, 6, 2, lava(0.25 + 0.2 * flick));
      const [mx, my] = T.p(0.42, 0.18, 0);
      out += ln([mx - 1, my], [mx + 4, my - 9], WOOD.right, 1.4) + poly([[mx + 1.6, my - 9.6], [mx + 6.4, my - 8], [mx + 6, my - 10.6], [mx + 2.4, my - 12]], DARK_IRON.left, ` stroke="${OUT}" stroke-width="0.5"`);
      // le seau d'eau où l'on trempe les lames : il fume
      out += bucket(T, -0.2, 0.4, 0, 6, 3.6, 4.6, { top: '#B98552', left: WOOD.left, right: WOOD.right }, 'seau');
      const [sx, sy] = T.p(-0.2, 0.4, 6);
      out += [0, 0.5].map(o => { const t = (k + o) % 1; return puff(sx - 1 + t * 3, sy - 3 - t * 9, 1.6 + t * 1.8, 0.7 * (1 - t)); }).join('');
      // des éclats taillés, devant
      return out + [[0.0, 0.46, 0], [0.12, 0.48, 1], [-0.42, 0.36, 2]].map(([du, dv, i]) => { const [ex, ey] = T.p(du, dv, 0); return ell(ex, ey + 0.4, 2.6, 0.8, 'rgba(20,15,25,.3)') + poly([[ex - 2, ey], [ex + 2, ey], [ex + (i - 1) * 0.8, ey - 6.4]], '#2A2733', ` stroke="${OUT}" stroke-width="0.5" stroke-linejoin="round"`) + ln([ex - 0.4, ey - 1], [ex + (i - 1) * 0.5, ey - 5], 'rgba(190,160,255,.7)', 0.6); }).join('');
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
