// Le kit de dessin des articles et des petits décors de l'île (boutique, annexes, établi, gisements, murs, enseignes,
// lieux) : les matières, les tracés SVG arrondis au centième, le repère d'un objet (tools), roues, seaux, cailloux et
// petites bêtes. Même trait, même lumière partout.
import { P, box, gable, disc, cylinder, face, f2, xy, ln, poly, ell, dot } from './iso';
import { WOOD, WOOD_DARK, pebble } from './palette';

const IRON = { top: '#B4BEC8', left: '#8E99A4', right: '#68737E' };
const DARK_IRON = { top: '#77818B', left: '#5A636C', right: '#41484F' };
const COPPER = { top: '#F4B07A', left: '#D9844E', right: '#A85C31' };
const STRAW = { top: '#F3DE97', left: '#E2C66E', right: '#C4A24E' };
const STUMP = { top: '#E7C08A', left: WOOD.left, right: WOOD.right };
const BARK = { top: '#A8743F', left: '#8B5631', right: '#F1D3A1' };
const BARN = { top: '#E08A70', left: '#C85F46', right: '#A04634' };
const CAST = { top: '#6E9C83', left: '#4F7D66', right: '#355A49' };
const PAIL = { top: '#B98552', left: WOOD.left, right: WOOD.right };
const OUT = 'rgba(60,40,25,.38)';
const wave = (f, n, amp = 1, phase = 0) => Math.sin((f / n) * Math.PI * 2 + phase) * amp;
// Étincelle à quatre branches (articles enchantés)
const star = (x, y, r, fill, o = 1) => `<path d="M${f2(x)},${f2(y - r)} Q${f2(x)},${f2(y)} ${f2(x + r)},${f2(y)} Q${f2(x)},${f2(y)} ${f2(x)},${f2(y + r)} Q${f2(x)},${f2(y)} ${f2(x - r)},${f2(y)} Q${f2(x)},${f2(y)} ${f2(x)},${f2(y - r)} Z" fill="${fill}" opacity="${f2(o)}"/>`;
const gradient = (id, from, to) => `<defs><linearGradient id="${id}" x1="0" x2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs>`;

// Outils de dessin liés à une place (u, v) : coordonnées relatives (du, dv), identifiants uniques pour les dégradés
function tools(u, v, prefix) {
  const p = (du = 0, dv = 0, z = 0) => P(u + du, v + dv, z);
  return {
    p,
    u,
    v,
    box: (a, b, c, d, z0, z1, colors, edge) => box(u + a, v + b, u + c, v + d, z0, z1, colors, edge),
    gable: (a, b, c, d, z, h, colors, o, edge) => gable(u + a, v + b, u + c, v + d, z, h, colors, o, edge),
    cyl: (du, dv, z0, z1, r, colors, name) => cylinder(u + du, v + dv, z0, z1, r, colors, `${prefix}-${name}`),
    disc: (du, dv, z, r, fill, extra) => disc(u + du, v + dv, z, r, fill, extra),
    face: (pts, fill, extra) => face(pts.map(([a, b, z]) => [u + a, v + b, z]), fill, extra),
    shadow: (du, dv, r, o = 0.22, z = 0) => disc(u + du + 0.1, v + dv + 0.02, z, r, `rgba(40,55,20,${o})`),
    pebble: (du, dv, s, color) => pebble(u + du, v + dv, s, color),
    id: name => `${prefix}-${name}`
  };
}

// Roue verticale : axis 'u' = roue dans le plan (u, z), vue de côté le long de u ; 'v' = dans le plan (v, z)
function wheel(T, du, dv, zc, r, axis, { rim = WOOD_DARK.right, spokes = 6, turn = 0, width = 1.6 } = {}) {
  const pt = a => (axis === 'u' ? T.p(du + r * Math.cos(a), dv, zc + 32 * r * Math.sin(a)) : T.p(du, dv + r * Math.cos(a), zc + 32 * r * Math.sin(a)));
  const ring = Array.from({ length: 20 }, (_, k) => pt((k / 20) * Math.PI * 2));
  const c = T.p(du, dv, zc);
  let out = `<polygon points="${ring.map(xy).join(' ')}" fill="rgba(0,0,0,.08)" stroke="${rim}" stroke-width="${width}" stroke-linejoin="round"/>`;
  for (let k = 0; k < spokes; k++) out += ln(c, pt(turn + (k / spokes) * Math.PI * 2), rim, 0.8);
  return out + dot(c[0], c[1], 1.3, rim);
}
// Seau légèrement évasé posé en (du, dv, z), de hauteur h, rayons r0 (fond) et r1 (bord) en pixels ; eau ou poissons
function bucket(T, du, dv, z, h, r0, r1, colors, name, water = true) {
  const [x, y] = T.p(du, dv, z);
  const top = y - h;
  return `<defs><linearGradient id="${T.id(name)}" x1="0" x2="1"><stop offset="0" stop-color="${colors.left}"/><stop offset="1" stop-color="${colors.right}"/></linearGradient></defs>`
    + `<path d="M${f2(x - r1)},${f2(top)} L${f2(x - r0)},${f2(y)} A${f2(r0)},${f2(r0 / 2)} 0 0 0 ${f2(x + r0)},${f2(y)} L${f2(x + r1)},${f2(top)} Z" fill="url(#${T.id(name)})" stroke="${OUT}" stroke-width="0.6"/>`
    + `<path d="M${f2(x - r1 * 0.96)},${f2(top + h * 0.3)} A${f2(r1 * 0.96)},${f2(r1 / 2)} 0 0 0 ${f2(x + r1 * 0.96)},${f2(top + h * 0.3)}" fill="none" stroke="rgba(60,40,25,.45)" stroke-width="0.9"/>`
    + `<path d="M${f2(x - r0 * 1.04)},${f2(y - h * 0.22)} A${f2(r0 * 1.04)},${f2(r0 / 2)} 0 0 0 ${f2(x + r0 * 1.04)},${f2(y - h * 0.22)}" fill="none" stroke="rgba(60,40,25,.45)" stroke-width="0.9"/>`
    + ell(x, top, r1, r1 / 2, colors.top, ` stroke="${OUT}" stroke-width="0.6"`)
    + (water
      ? ell(x, top + 0.4, r1 * 0.78, r1 * 0.36, '#4C9CC8') + ell(x - r1 * 0.25, top, r1 * 0.3, r1 * 0.12, 'rgba(255,255,255,.55)')
      : ell(x, top + 0.4, r1 * 0.78, r1 * 0.36, '#3A2A1E'));
}
// Pierre (ou minerai) arrondie vue de 3/4, en pixels
function stone(x, y, s, c) {
  return ell(x + s * 0.1, y + s * 0.2, s, s * 0.65, c.right) + ell(x, y, s, s * 0.66, c.left) + ell(x - s * 0.3, y - s * 0.25, s * 0.5, s * 0.3, c.top);
}

/* ---------- Petites bêtes ---------- */
// Poule de profil, tournée vers la droite (flip : vers la gauche) ; peck : tête au sol ; step : pattes
function hen(x, y, { flip = false, peck = 0, step = 0, color = '#FFFDF8', wing = '#E9DFCB' } = {}) {
  const s = flip ? -1 : 1;
  const hx = x + s * (4.6 + peck * 1.8);
  const hy = y - 12.5 + peck * 7;
  const X = dx => f2(x + s * dx);
  const Y = dy => f2(y + dy);
  return ell(x, y + 0.3, 5.4, 1.5, 'rgba(40,55,20,.25)')
    + ln([x - s * 1.2, y - 3], [x - s * 1.6 + step, y], '#E39A33', 1) + ln([x + s * 1.6, y - 3], [x + s * 2 - step, y], '#E39A33', 1)
    // Queue en éventail, corps, aile
    + `<path d="M${X(-4)},${Y(-7)} L${X(-8.2)},${Y(-13)} L${X(-6.4)},${Y(-7.5)} L${X(-8.8)},${Y(-10)} L${X(-5)},${Y(-5.5)} Z" fill="${wing}"/>`
    + `<path d="M${X(-6.5)},${Y(-7.5)} Q${X(-6)},${Y(-12)} ${X(-1.5)},${Y(-11)} Q${X(2.5)},${Y(-11.5)} ${X(4.6)},${Y(-8.6)} Q${X(5.6)},${Y(-4)} ${X(1)},${Y(-2.6)} Q${X(-4.6)},${Y(-2.2)} ${X(-6.5)},${Y(-7.5)} Z" fill="${color}" stroke="rgba(60,40,25,.32)" stroke-width="0.6"/>`
    + `<path d="M${X(-3.6)},${Y(-7.6)} Q${X(-0.5)},${Y(-10.2)} ${X(2.4)},${Y(-7)} Q${X(-0.4)},${Y(-4.6)} ${X(-3.6)},${Y(-7.6)} Z" fill="${wing}"/>`
    // Cou, tête, crête, bec, barbillon, œil
    + `<path d="M${X(2.6)},${Y(-9.4)} L${f2(hx - s * 1.4)},${f2(hy + 1.6)} L${f2(hx + s * 1.2)},${f2(hy + 2)} L${X(4.8)},${Y(-7.8)} Z" fill="${color}"/>`
    + dot(hx, hy, 2.7, color)
    + `<path d="M${f2(hx - s * 1.6)},${f2(hy - 2.2)} q${s * 0.5},-2.2 ${s * 1.4},-0.6 q${s * 0.6},-2 ${s * 1.4},-0.2 q${s * 0.9},-1.4 ${s * 1.3},0.4 Z" fill="#E2463A"/>`
    + `<path d="M${f2(hx + s * 2.5)},${f2(hy - 0.6)} l${s * 2.4},0.9 l${-s * 2.4},0.9 Z" fill="#E8A13A"/>`
    + ell(hx + s * 1.9, hy + 2, 0.8, 1.2, '#E2463A')
    + dot(hx + s * 0.9, hy - 0.5, 0.65, '#2A2420');
}
function chick(x, y, hop = 0) {
  return ell(x, y + 0.2, 2.4, 0.8, 'rgba(40,55,20,.22)') + dot(x, y - 2.6 - hop, 2.3, '#FFE07A') + dot(x + 1.6, y - 4.6 - hop, 1.5, '#FFE07A')
    + `<path d="M${f2(x + 3)},${f2(y - 4.8 - hop)} l1.2,0.4 l-1.2,0.4 Z" fill="#E8A13A"/>` + dot(x + 2, y - 5 - hop, 0.4, '#2A2420');
}
function bee(x, y, up) {
  const w = up ? -1.2 : 0.4;
  return `<ellipse cx="${f2(x - 1.2)}" cy="${f2(y - 2 + w)}" rx="1.8" ry="1.1" fill="rgba(230,245,255,.9)" transform="rotate(${up ? -25 : -5} ${f2(x - 1.2)} ${f2(y - 2 + w)})"/>`
    + `<ellipse cx="${f2(x + 1.2)}" cy="${f2(y - 2 + w)}" rx="1.8" ry="1.1" fill="rgba(230,245,255,.9)" transform="rotate(${up ? 25 : 5} ${f2(x + 1.2)} ${f2(y - 2 + w)})"/>`
    + ell(x, y, 2.5, 1.7, '#FFD24E', ' stroke="rgba(60,40,25,.4)" stroke-width="0.4"')
    + `<rect x="${f2(x - 0.9)}" y="${f2(y - 1.6)}" width="0.8" height="3.2" fill="#3D3A36"/><rect x="${f2(x + 0.7)}" y="${f2(y - 1.6)}" width="0.8" height="3.2" fill="#3D3A36"/>`;
}
// Petit oiseau de profil (rouge-gorge, mésange), tourné vers la droite
function bird(x, y, { body, breast, wing, flip = false, hop = 0, peck = 0, flap = 0 }) {
  const s = flip ? -1 : 1;
  const by = y - hop;
  const X = dx => f2(x + s * dx);
  const hx = 2.6 + peck * 0.8;
  const hy = -5.4 + peck * 2.6;
  return ell(x, y + 0.4, 3.2, 0.9, `rgba(40,55,20,${f2(0.22 - hop * 0.03)})`)
    + ln([x - s * 0.6, by - 1.4], [x - s * 0.8, y], '#7A5A3A', 0.6) + ln([x + s * 0.8, by - 1.4], [x + s * 0.8, y], '#7A5A3A', 0.6)
    + `<path d="M${X(-3.4)},${f2(by - 3)} L${X(-6.4)},${f2(by - 4.8)} L${X(-5.6)},${f2(by - 2.4)} Z" fill="${body}"/>`
    + ell(x, by - 3.4, 3.6, 2.6, body)
    + ell(x + s * 1.2, by - 2.9, 2.2, 1.8, breast)
    + dot(x + s * hx, by + hy, 2, body)
    + dot(x + s * (hx + 0.4), by + hy + 0.8, 1.2, breast)
    + `<path d="M${X(hx + 1.8)},${f2(by + hy - 0.2)} l${s * 1.8},0.5 l${-s * 1.8},0.6 Z" fill="#3D3A36"/>`
    + dot(x + s * (hx + 0.5), by + hy - 0.5, 0.5, '#1E1A17')
    + `<path d="M${X(-1.8)},${f2(by - 4)} q${-s * 1.6},${f2(-1.2 - flap * 2.4)} ${-s * 3.6},${f2(-0.6 - flap)}" stroke="${wing}" stroke-width="1.8" fill="none" stroke-linecap="round"/>`;
}
// Une feuille (citrouille, nénuphars)
const leaf = (x, y, a, s = 1) => `<path d="M0,0 q4,-5 9,-1 q-3,1 -2,4 q-4,-1 -7,-3 Z" fill="#5FA04A" stroke="#3F7A34" stroke-width="${f2(0.5 / s)}" transform="translate(${f2(x)} ${f2(y)}) rotate(${a}) scale(${s})"/>`;

export { IRON, DARK_IRON, COPPER, STRAW, STUMP, BARK, BARN, CAST, PAIL, OUT, wave, star, gradient, tools, wheel, bucket, stone, hen, chick, bee, bird, leaf, f2, xy, ln, poly, ell, dot };
