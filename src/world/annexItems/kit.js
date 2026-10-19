// Ce que partagent les annexes : matières propres (argile, charbon, boue, feuillage, verre), petits outils (piquets,
// rails, fumée, bûches, souches, jeunes arbres) et les bêtes de l'enclos et du vivier.
import { EDGE } from '../iso';
import { WOOD, WOOD_DARK } from '../palette';
import { ln, poly, ell, dot, STUMP, OUT, f2 } from '../spriteKit';

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
    .map(([dx, dy, r]) => `<circle cx="${f2(X(dx))}" cy="${f2(y + dy)}" r="${f2(r)}" fill="#F7F3EA" stroke="rgba(60,40,25,.22)" stroke-width="0.5"/>`).join('');
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

export { TAU, CLAY, COAL, TEAL_ROOF, MUD, SOIL_TOP, LEAF, LEAF_LIGHT, GLASS_FACES, GLASS_EDGE, patch, post, rail, puff, log, logEnd, stumpAt, sapling, butterfly, pig, sheep, fishTop };
