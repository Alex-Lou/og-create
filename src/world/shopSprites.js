// Articles de la boutique des ateliers, dessinés aux abords de leur bâtiment (planche 3).
// Repère : celui de l'emprise du bâtiment (u, v ∈ [-1, 1], ancrage au centre), même projection et même lumière.
// Un article est fait de calques. Chaque calque a :
// - sa place (u, v), qui peut changer avec le niveau du bâtiment ;
// - un cadre serré autour de cette place, car les images sont gardées à 4× en mémoire ;
// - soit un dessin fixe, soit n images d'animation à peine différentes jouées à fps images/s ;
// - en option : back (dessiné avant le bâtiment, donc derrière) et motion (glissement continu dans le temps).
import { P, TW, box, gable, disc, cylinder, face, sprite, EDGE } from './iso';
import { WOOD, WOOD_DARK, STONE, WALL, pebble, planksLeft, planksRight } from './palette';

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
const f2 = n => Math.round(n * 100) / 100;
const xy = ([x, y]) => `${f2(x)},${f2(y)}`;
const ln = (a, b, color, w = 1.2, extra = '') => `<line x1="${f2(a[0])}" y1="${f2(a[1])}" x2="${f2(b[0])}" y2="${f2(b[1])}" stroke="${color}" stroke-width="${w}" stroke-linecap="round"${extra}/>`;
const poly = (points, fill, extra = '') => `<polygon points="${points.map(xy).join(' ')}" fill="${fill}"${extra}/>`;
const ell = (x, y, rx, ry, fill, extra = '') => `<ellipse cx="${f2(x)}" cy="${f2(y)}" rx="${f2(rx)}" ry="${f2(ry)}" fill="${fill}"${extra}/>`;
const dot = (x, y, r, fill) => `<circle cx="${f2(x)}" cy="${f2(y)}" r="${f2(r)}" fill="${fill}"/>`;
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

/* ---------- Potager ---------- */
const pelle = {
  layers: [{
    at: { 1: [0.6, -0.3], 2: [0.42, 0.58] },
    frame: [-12, -32, 26, 38],
    draw: T => {
      const [x, y] = T.p(0, 0, 4);
      const [hx, hy] = [x + 4.2, y - 27];
      return ell(x + 1, y + 1, 7.4, 2.6, '#5A3822')
        + `<path d="M${f2(x - 6.5)},${f2(y + 0.8)} q2,-3.8 6.4,-3.8 q4.6,0 6.4,3.4 Z" fill="#6B4329"/>`
        // Lame enfoncée de biais, douille, manche, poignée en D
        + `<path d="M${f2(x - 3.4)},${f2(y - 7.4)} L${f2(x + 3.2)},${f2(y - 8.4)} L${f2(x + 3)},${f2(y - 1.4)} Q${f2(x)},${f2(y + 1.4)} ${f2(x - 3)},${f2(y - 0.6)} Z" fill="${IRON.left}" stroke="${IRON.right}" stroke-width="0.6"/>`
        + `<path d="M${f2(x - 3.4)},${f2(y - 7.4)} L${f2(x - 3)},${f2(y - 0.6)} L${f2(x - 1.8)},${f2(y - 0.2)} L${f2(x - 2)},${f2(y - 7.6)} Z" fill="${IRON.top}"/>`
        + `<path d="M${f2(x + 0.4)},${f2(y - 8)} L${f2(x + 3.2)},${f2(y - 8.4)} L${f2(x + 3)},${f2(y - 1.4)} Q${f2(x + 1.6)},${f2(y)} ${f2(x + 0.6)},${f2(y)} Z" fill="${IRON.right}" opacity=".55"/>`
        + `<rect x="${f2(x - 1.1)}" y="${f2(y - 11)}" width="2.6" height="3.4" rx="0.6" fill="${IRON.right}" transform="rotate(8 ${f2(x)} ${f2(y - 9)})"/>`
        + ln([x + 0.3, y - 10.5], [hx, hy + 3.4], WOOD.right, 2) + ln([x + 0.1, y - 10.5], [hx - 0.4, hy + 3.4], WOOD.top, 0.7)
        + ln([hx - 3, hy - 0.4], [hx + 3, hy - 1.6], WOOD.right, 1.9) + ln([hx - 3, hy - 0.4], [hx - 0.5, hy + 3.6], WOOD.right, 1.2) + ln([hx + 3, hy - 1.6], [hx + 0.6, hy + 3.4], WOOD.right, 1.2)
        + `<path d="M${f2(x - 4.4)},${f2(y + 1.2)} q4.4,-2.6 8.8,0 Z" fill="#7A4E30"/>`
        + dot(x + 6.6, y - 0.2, 1.2, '#6B4329') + dot(x - 6.8, y + 1.6, 0.9, '#7A4E30');
    }
  }]
};
const arrosoir = {
  layers: [{
    at: [0.76, 0.76],
    frame: [-14, -26, 36, 32],
    draw: T => {
      const [x, y] = T.p(0, 0, 4);
      const green = { top: '#B4DDB8', left: '#73B884', right: '#4A8A5B' };
      return ell(x + 2, y + 1.2, 9, 2.6, 'rgba(40,55,20,.25)')
        + `<path d="M${f2(x + 4)},${f2(y - 4)} L${f2(x + 13.5)},${f2(y - 14.6)} L${f2(x + 14.6)},${f2(y - 13.4)} L${f2(x + 5)},${f2(y - 2)} Z" fill="${green.right}"/>`
        + `<ellipse cx="${f2(x + 14.8)}" cy="${f2(y - 15)}" rx="2.8" ry="1.8" fill="${COPPER.left}" stroke="${COPPER.right}" stroke-width="0.6" transform="rotate(-42 ${f2(x + 14.8)} ${f2(y - 15)})"/>`
        + [[-0.8, -0.6], [0.5, 0.4], [-0.2, 0.9], [0.9, -0.5]].map(([dx, dy]) => dot(x + 14.8 + dx, y - 15 + dy, 0.35, COPPER.right)).join('')
        + T.cyl(0, 0, 4, 15, 0.085, green, 'can')
        + `<path d="M${f2(x - 3.8)},${f2(y - 5.6)} A3.85,1.92 0 0 0 ${f2(x + 3.8)},${f2(y - 5.6)}" fill="none" stroke="${green.right}" stroke-width="0.9"/>`
        + ell(x, y - 15, 2.6, 1.2, '#2F4A36')
        + `<path d="M${f2(x - 3.4)},${f2(y - 14)} C${f2(x - 3.6)},${f2(y - 22.5)} ${f2(x + 3.6)},${f2(y - 22.5)} ${f2(x + 3.4)},${f2(y - 14.6)}" stroke="${green.right}" stroke-width="1.6" fill="none"/>`
        + `<path d="M${f2(x - 3.9)},${f2(y - 12.6)} q-3.6,0.6 -3.4,4.2 q0.2,2.6 3.2,2.6" stroke="${green.right}" stroke-width="1.4" fill="none"/>`
        + ln([x - 2.2, y - 13.2], [x - 2.2, y - 6.4], 'rgba(255,255,255,.4)', 1.1);
    }
  }]
};
// Poulailler rouge à pattes, rampe et pondoir ; trois poules et un poussin picorent devant le Potager
const poulailler = {
  layers: [{
    at: { 1: [0.7, -0.78], 2: [0.68, -0.62] },
    frame: [-24, -48, 48, 56],
    back: true,
    draw: T => {
      const legs = [[-0.12, -0.09], [0.12, -0.09], [-0.12, 0.09], [0.12, 0.09]].map(([a, b]) => T.box(a - 0.018, b - 0.018, a + 0.018, b + 0.018, 0, 8, WOOD_DARK)).join('');
      return T.shadow(0, 0, 0.2, 0.2)
        + ell(...T.p(0, 0.04, 0), 9, 3.4, STRAW.left) + ell(...T.p(0.02, 0.06, 0), 5, 1.8, STRAW.top)
        + legs
        + T.box(-0.15, -0.12, 0.15, 0.12, 8, 22, BARN)
        + planksLeft(T.u - 0.15, T.u + 0.15, T.v + 0.12, 8, 22, 4.5) + planksRight(T.u + 0.15, T.v - 0.12, T.v + 0.12, 8, 22, 4.5)
        // Montants blancs aux angles
        + T.box(0.13, 0.1, 0.155, 0.125, 8, 22, WALL, '') + T.box(-0.155, 0.1, -0.13, 0.125, 8, 22, WALL, '') + T.box(0.13, -0.125, 0.155, -0.1, 8, 22, WALL, '')
        // Porte et rampe à barreaux
        + T.face([[-0.02, 0.12, 9], [0.08, 0.12, 9], [0.08, 0.12, 17], [-0.02, 0.12, 17]], '#3A2A1E')
        + T.face([[-0.02, 0.12, 9], [0.08, 0.12, 9], [0.08, 0.32, 0], [-0.02, 0.32, 0]], WOOD.top, EDGE)
        + [0.17, 0.22, 0.27].map(k => ln(T.p(-0.02, k, 9 * (1 - (k - 0.12) / 0.2)), T.p(0.08, k, 9 * (1 - (k - 0.12) / 0.2)), WOOD.right, 0.7)).join('')
        // Lucarne et pondoir
        + T.face([[0.15, -0.07, 14], [0.15, 0, 14], [0.15, 0, 19], [0.15, -0.07, 19]], '#FFE6A3', ' stroke="#FFFFFF" stroke-width="0.8"')
        + T.box(0.15, 0.01, 0.22, 0.11, 10, 16, BARN)
        + T.face([[0.15, 0.01, 18], [0.22, 0.01, 16], [0.22, 0.11, 16], [0.15, 0.11, 18]], '#7C7F89', EDGE)
        + T.gable(-0.15, -0.12, 0.15, 0.12, 22, 9, { front: '#8F939D', back: '#6D717B', gable: BARN.right }, 0.04);
    }
  }, {
    at: [0.1, 0.72],
    frame: [-30, -26, 64, 38],
    n: 8,
    fps: 4,
    draw: (T, level, f, n) => {
      const flock = [
        { du: 0, dv: 0, k: 0, color: '#C98B4E', wing: '#A86A33' },
        { du: -0.3, dv: 0.22, k: 2.1, color: '#FFFDF8', wing: '#E9DFCB' },
        { du: 0.32, dv: -0.26, k: 4.2, color: '#FFFDF8', wing: '#E9DFCB' }
      ];
      const hens = flock.map(({ du, dv, k, color, wing }, i) => {
        const a = (f / n) * Math.PI * 2 + k;
        const [x, y] = T.p(du + Math.sin(a) * 0.05, dv + Math.cos(a) * 0.03, 0);
        const peck = (f + i * 3) % n === 2 || (f + i * 3) % n === 3 ? 1 : 0;
        return hen(x, y, { flip: Math.cos(a) < 0, peck, step: f % 2 ? 1 : -1, color, wing });
      }).join('');
      const [cx, cy] = T.p(0.14 + wave(f, n, 0.04, 1), 0.12, 0);
      return hens + chick(cx, cy, f % 4 === 1 ? 1.2 : 0);
    }
  }]
};
// Ruche de paille sur son banc, lavande ; les abeilles tournent autour (Serre seulement)
const ruche = {
  layers: [{
    at: [-0.86, 0.86],
    frame: [-18, -40, 40, 46],
    draw: T => {
      const [x, y] = T.p(0, 0, 0);
      let rings = '';
      for (let k = 0; k < 5; k++) rings += ell(x, y - 11 - k * 4, 9.6 - k * 1.5, 3.4, k % 2 ? STRAW.left : STRAW.top, ` stroke="${STRAW.right}" stroke-width="0.7"`);
      const lavender = [[-9, 2], [-11, -1], [8, 3], [10, 0]].map(([dx, dy]) => ln([x + dx, y + dy], [x + dx - 0.6, y + dy - 6], '#6FA35A', 0.7) + ell(x + dx - 0.6, y + dy - 7, 0.9, 2, '#A98ADB')).join('');
      return T.shadow(0, 0, 0.16, 0.22) + lavender
        + T.box(-0.1, -0.08, -0.07, 0.08, 0, 7, WOOD_DARK) + T.box(0.07, -0.08, 0.1, 0.08, 0, 7, WOOD_DARK)
        + T.box(-0.14, -0.11, 0.14, 0.11, 7, 9, WOOD)
        + rings + ell(x, y - 31, 3, 2.2, STRAW.top, ` stroke="${STRAW.right}" stroke-width="0.6"`)
        + `<path d="M${f2(x - 6)},${f2(y - 12)} q6,3 12,0" stroke="rgba(150,105,40,.5)" stroke-width="0.6" fill="none"/>`
        + `<path d="M${f2(x - 2.8)},${f2(y - 9.4)} a2.8,2.4 0 0 1 5.6,0 Z" fill="#3A2A1E"/>`;
    }
  }, {
    at: [-0.86, 0.86],
    frame: [-22, -48, 46, 40],
    n: 8,
    fps: 10,
    draw: (T, level, f, n) => {
      const [x, y] = T.p(0, 0, 22);
      return [0, 1, 2, 3].map(k => {
        const a = (f / n) * Math.PI * 2 * (k % 2 ? 1 : -1) + k * 1.6;
        return bee(x + Math.cos(a) * (10 + k * 2), y + Math.sin(a) * 4.5 - k * 3 + 2, (f + k) % 2 === 0);
      }).join('');
    }
  }]
};
// Brouette rouge pleine de terreau, carottes et chou, sur sa roue et ses béquilles (palier V)
const RED_PAINT = { top: '#EE7A6E', left: '#D2574B', right: '#A23E35' };
const carrot = (x, y, a) => `<g transform="rotate(${a} ${f2(x)} ${f2(y)})"><path d="M${f2(x)},${f2(y - 1.4)} L${f2(x + 7)},${f2(y)} L${f2(x)},${f2(y + 1.4)} Z" fill="#F08A3A" stroke="#C8622A" stroke-width="0.4"/>`
  + `<path d="M${f2(x)},${f2(y)} l-3,-1.8 M${f2(x)},${f2(y)} l-3.4,0.2 M${f2(x)},${f2(y)} l-2.4,1.8" stroke="#5FA04A" stroke-width="0.9" stroke-linecap="round"/></g>`;
const brouette = {
  layers: [{
    at: [0.9, -0.05],
    frame: [-24, -28, 46, 34],
    draw: T => {
      const rim = [[-0.16, -0.12], [0.12, -0.12], [0.12, 0.12], [-0.16, 0.12]].map(([a, b]) => T.p(a, b, 14));
      const base = [[-0.11, -0.085], [0.08, -0.085], [0.08, 0.085], [-0.11, 0.085]].map(([a, b]) => T.p(a, b, 7));
      const [sx, sy] = T.p(-0.02, 0, 14.5);
      const handle = s => ln(T.p(-0.15, 0.1 * s, 12.5), T.p(-0.38, 0.11 * s, 9), WOOD.right, 1.7) + ln(T.p(-0.15, 0.1 * s, 13.1), T.p(-0.38, 0.11 * s, 9.6), WOOD.top, 0.6);
      const leg = s => ln(T.p(-0.08, 0.07 * s, 7.4), T.p(-0.1, 0.08 * s, 0), DARK_IRON.right, 1.3);
      return T.shadow(-0.06, 0, 0.22, 0.2)
        + handle(-1) + leg(-1)
        + ln(T.p(0.06, -0.06, 8), T.p(0.18, 0, 5), DARK_IRON.right, 1)
        + poly(rim, '#3A2A1E')
        + ell(sx, sy, 7.6, 3.2, '#6B4329') + ell(sx - 1.6, sy - 0.8, 4.6, 1.8, '#7A4E30')
        + carrot(sx - 6, sy - 1.4, -12) + carrot(sx - 4, sy + 0.8, 8) + carrot(sx + 4.6, sy + 1.2, 196)
        + dot(sx + 2.6, sy - 2.2, 3.2, '#79BE5C') + `<path d="M${f2(sx + 0.4)},${f2(sy - 2.6)} q2.2,-2.4 4.4,0 M${f2(sx + 1)},${f2(sy - 1.2)} q1.6,-1.4 3.2,0" stroke="#A6D98A" stroke-width="0.7" fill="none"/>`
        + dot(sx - 1.4, sy - 2.6, 1.3, '#E86A8A') + dot(sx + 0.4, sy + 1.2, 1.2, '#E86A8A')
        + poly([base[3], base[2], rim[2], rim[3]], RED_PAINT.left, ` stroke="${OUT}" stroke-width="0.6"`)
        + poly([base[1], base[2], rim[2], rim[1]], RED_PAINT.right, ` stroke="${OUT}" stroke-width="0.6"`)
        + `<polyline points="${[rim[1], rim[2], rim[3]].map(xy).join(' ')}" fill="none" stroke="${RED_PAINT.top}" stroke-width="1.2" stroke-linejoin="round"/>`
        + wheel(T, 0.18, 0, 5, 0.06, 'u', { rim: '#3D3A36', spokes: 6, width: 1.9 })
        + ln(T.p(0.06, 0.06, 8), T.p(0.18, 0, 5), DARK_IRON.right, 1)
        + leg(1) + handle(1);
    }
  }]
};
// Épouvantail en chemise à carreaux et chapeau de paille : la paille de ses manches frissonne,
// un corbeau vient se poser sur son bras puis repart (palier VI)
const CROW = { body: '#33303A', breast: '#4A4652', wing: '#22202A', flip: true };
const flying = (x, y, up) => `<path d="M${f2(x - 4.4)},${f2(y + (up ? -2 : 1))} Q${f2(x - 2)},${f2(y - (up ? 2.6 : 0.4))} ${f2(x)},${f2(y)} Q${f2(x + 2)},${f2(y - (up ? 2.6 : 0.4))} ${f2(x + 4.4)},${f2(y + (up ? -2 : 1))}" stroke="${CROW.body}" stroke-width="1.4" fill="none" stroke-linecap="round"/>` + dot(x, y + 0.2, 1, CROW.body);
const epouvantail = {
  layers: [{
    at: [-0.88, 0.2],
    frame: [-26, -54, 52, 60],
    n: 8,
    fps: 3,
    draw: (T, level, f, n) => {
      const [x, y] = T.p(0, 0, 0);
      const sway = wave(f, n, 1);
      const sy = y - 27;
      const tuft = (cx, cy, s) => [-1, 0, 1].map(k => ln([cx, cy + k * 1.1], [cx + s * (3 + Math.abs(k) * 0.4), cy + k * 1.9 + sway * 0.8], STRAW.right, 0.8)).join('');
      const legTuft = cx => [-1, 0, 1].map(k => ln([cx + k * 0.8, y - 6], [cx + k * 1.6, y - 2.8], STRAW.right, 0.8)).join('');
      const crow = f >= 2 && f <= 6
        ? bird(x + 9.4, sy - 0.4, { ...CROW, peck: f === 4 ? 1 : 0 })
        : flying(x + (f === 7 ? 17 : f === 0 ? 20 : 14), sy - (f === 7 ? 9 : f === 0 ? 14 : 6), f !== 0);
      return ell(x + 1, y + 0.4, 6, 1.8, 'rgba(40,55,20,.25)')
        + `<rect x="${f2(x - 1)}" y="${f2(y - 40)}" width="2.2" height="40" fill="${WOOD_DARK.left}"/><rect x="${f2(x + 0.2)}" y="${f2(y - 40)}" width="1" height="40" fill="${WOOD_DARK.right}"/>`
        // Pantalon rapiécé, jambes de paille
        + legTuft(x - 2.4) + legTuft(x + 2.4)
        + `<path d="M${f2(x - 4.4)},${f2(y - 16)} L${f2(x + 4.4)},${f2(y - 16)} L${f2(x + 4)},${f2(y - 6)} L${f2(x + 0.8)},${f2(y - 6)} L${f2(x)},${f2(y - 11)} L${f2(x - 0.8)},${f2(y - 6)} L${f2(x - 4)},${f2(y - 6)} Z" fill="#5C83C2" stroke="${OUT}" stroke-width="0.5"/>`
        + `<rect x="${f2(x + 1.3)}" y="${f2(y - 13.4)}" width="2.2" height="2.4" fill="#E2C66E" transform="rotate(8 ${f2(x + 2.4)} ${f2(y - 12.2)})"/>`
        // Chemise à carreaux et bras sur la traverse
        + `<rect x="${f2(x - 13)}" y="${f2(sy - 0.4)}" width="26" height="4" rx="1.6" fill="#C8504A" stroke="${OUT}" stroke-width="0.5"/>`
        + `<path d="M${f2(x - 5)},${f2(sy)} L${f2(x + 5)},${f2(sy)} L${f2(x + 4.6)},${f2(y - 15)} L${f2(x - 4.6)},${f2(y - 15)} Z" fill="#C8504A" stroke="${OUT}" stroke-width="0.5"/>`
        + [-10, -7, -2.6, 0, 2.6, 7, 10].map(dx => ln([x + dx, sy + (Math.abs(dx) > 5 ? 0 : 0.6)], [x + dx, Math.abs(dx) > 5 ? sy + 3.4 : y - 15.4], 'rgba(110,30,25,.5)', 0.6)).join('')
        + [sy + 1.8, sy + 6, sy + 9.4].map((ly, k) => ln([x - (k ? 4.8 : 12.6), ly], [x + (k ? 4.8 : 12.6), ly], 'rgba(255,214,120,.55)', 0.6)).join('')
        + ln([x - 4.7, y - 16], [x + 4.7, y - 16], '#C9A16A', 1.1)
        + tuft(x - 13, sy + 1.6, -1) + tuft(x + 13, sy + 1.6, 1)
        // Tête en toile de jute, yeux cousus, sourire au point
        + ln([x - 2.4, sy - 0.6], [x + 2.4, sy - 0.6], '#C9A16A', 1)
        + ell(x, sy - 5, 4.6, 5, '#E7C99A', ` stroke="${OUT}" stroke-width="0.5"`)
        + `<path d="M${f2(x - 2.8)},${f2(sy - 7)} l1.6,1.6 m0,-1.6 l-1.6,1.6 M${f2(x + 1.2)},${f2(sy - 7)} l1.6,1.6 m0,-1.6 l-1.6,1.6" stroke="#3A2A1E" stroke-width="0.7"/>`
        + `<path d="M${f2(x - 2.6)},${f2(sy - 3)} q2.6,1.8 5.2,0" stroke="#3A2A1E" stroke-width="0.6" fill="none" stroke-dasharray="0.9 0.6"/>`
        // Chapeau de paille un peu de travers
        + `<g transform="rotate(${f2(-6 + sway * 3)} ${f2(x)} ${f2(sy - 9)})">`
        + ell(x, sy - 8.6, 8.6, 2.2, STRAW.top, ` stroke="${STRAW.right}" stroke-width="0.6"`)
        + `<path d="M${f2(x - 4.4)},${f2(sy - 9)} q0.4,-5.4 4.4,-5.4 q4,0 4.4,5.4 Z" fill="${STRAW.left}" stroke="${STRAW.right}" stroke-width="0.6"/>`
        + `<path d="M${f2(x - 4.3)},${f2(sy - 10.6)} q4.3,1.4 8.6,0" stroke="#C8504A" stroke-width="1.3" fill="none"/></g>`
        + crow;
    }
  }]
};
// Citrouille enchantée : énorme, son sourire sculpté luit ; des étincelles s'en échappent en spirale (palier VII)
const PUMPKIN_AT = [0.58, 0.3];
const leaf = (x, y, a, s = 1) => `<path d="M0,0 q4,-5 9,-1 q-3,1 -2,4 q-4,-1 -7,-3 Z" fill="#5FA04A" stroke="#3F7A34" stroke-width="${f2(0.5 / s)}" transform="translate(${f2(x)} ${f2(y)}) rotate(${a}) scale(${s})"/>`;
const citrouille = {
  light: () => [PUMPKIN_AT[0], PUMPKIN_AT[1], 9, 26],
  layers: [{
    at: PUMPKIN_AT,
    frame: [-26, -50, 52, 56],
    n: 8,
    fps: 4,
    draw: (T, level, f, n) => {
      const [x, y] = T.p(0, 0, 0);
      const cy = y - 9.5;
      const lit = 0.7 + wave(f, n, 0.3);
      const ribs = [[-8.4, 6.4, '#D9682A'], [8.4, 6.4, '#C85A22'], [-4.6, 7.6, '#EF8A3A'], [4.6, 7.6, '#E57A32'], [0, 8.2, '#F7A04A']]
        .map(([dx, rx, c]) => ell(x + dx, cy, rx, 9.4, c, ' stroke="#A9481C" stroke-width="0.6"')).join('');
      const carving = `M${f2(x - 6)},${f2(cy - 1.6)} l2.6,-3.8 l2.4,3.8 Z M${f2(x + 1)},${f2(cy - 1.6)} l2.4,-3.8 l2.6,3.8 Z `
        + `M${f2(x - 6.8)},${f2(cy + 2)} q6.8,6 13.6,0 l-2,0.4 l-1,1.6 l-1.6,-1 l-1.6,1.4 l-1.4,-1.4 l-1.6,1.2 l-1.4,-1.6 l-1.4,1.2 Z`;
      const sparks = [0, 1, 2].map(k => {
        const t = ((f / n) + k / 3) % 1;
        const a = t * Math.PI * 3 + k * 2.1;
        return star(x + Math.cos(a) * (10 + t * 4), cy - 10 - t * 26, 1.4 + (1 - t) * 1.4, k % 2 ? '#FFF2B0' : '#FFD27A', 1 - t);
      }).join('');
      return ell(x + 2, y + 0.6, 17, 4.6, 'rgba(40,55,20,.25)')
        + leaf(x - 20, y + 1, -8) + leaf(x + 19, y + 2, 188) + leaf(x - 6, y + 4, 30, 0.8)
        + `<path d="M${f2(x + 16)},${f2(y + 1)} q4,-3 2,-6 q-2,-2 -3,1" stroke="#5FA04A" stroke-width="0.8" fill="none"/>`
        + ribs
        + `<path d="M${f2(x - 6)},${f2(cy - 6.4)} q6,-3 12,0" stroke="rgba(255,230,180,.45)" stroke-width="1.4" fill="none"/>`
        + `<path d="${carving}" fill="#5A2A10"/><path d="${carving}" fill="#FFD25A" opacity="${f2(lit)}"/>`
        + `<path d="M${f2(x - 1)},${f2(cy - 8.6)} q-0.6,-4 2.6,-6.4 l1.4,1 q-2.4,2 -1.6,5.4 Z" fill="#6B8E3A" stroke="#4A6A28" stroke-width="0.5"/>`
        + `<path d="M${f2(x + 2.6)},${f2(cy - 14)} q4,-2 3.4,1.6 q-0.6,2.4 -2.6,1" stroke="#5FA04A" stroke-width="0.8" fill="none"/>`
        + leaf(x - 1, cy - 9, -150, 0.7)
        + sparks;
    }
  }]
};

/* ---------- Carrière ---------- */
const pioche = {
  layers: [{
    at: [0.16, 0.8],
    frame: [-16, -34, 34, 40],
    draw: T => {
      const [x, y] = T.p(0, 0, 9);
      return T.shadow(0, 0, 0.16, 0.22)
        + T.box(-0.11, -0.09, 0.11, 0.09, 0, 6, STONE) + T.box(-0.07, -0.06, 0.08, 0.06, 6, 9, STONE)
        + T.pebble(0.15, 0.08, 2.2) + T.pebble(-0.14, 0.12, 1.8)
        + ln([x - 1, y - 1], [x - 10, y - 21], WOOD.right, 2.3) + ln([x - 1.4, y - 1], [x - 10.4, y - 21], WOOD.top, 0.7)
        + ln([x - 8.6, y - 18], [x - 10.4, y - 21.6], '#5E3A22', 2.8)
        // Fer courbe : une pointe enfoncée dans la roche, l'autre levée
        + `<path d="M${f2(x - 9)},${f2(y + 1)} Q${f2(x - 2)},${f2(y - 7)} ${f2(x + 7)},${f2(y + 2)}" stroke="${DARK_IRON.left}" stroke-width="3.2" fill="none" stroke-linecap="round"/>`
        + `<path d="M${f2(x - 8.6)},${f2(y)} Q${f2(x - 2)},${f2(y - 7.6)} ${f2(x + 6.4)},${f2(y + 1)}" stroke="${IRON.top}" stroke-width="1" fill="none" stroke-linecap="round"/>`
        + `<rect x="${f2(x - 3.2)}" y="${f2(y - 5.6)}" width="3.6" height="3.4" rx="0.8" fill="${DARK_IRON.right}" transform="rotate(-25 ${f2(x - 1.4)} ${f2(y - 4)})"/>`
        + T.box(0.02, 0, 0.1, 0.06, 6, 9, STONE)
        + `<path d="M${f2(x + 3)},${f2(y + 1.5)} l2,-1.2 l1.2,1.4 Z" fill="${STONE.right}"/>`;
    }
  }]
};
const wagonnet = {
  layers: [{
    at: [0.76, 0.8],
    frame: [-24, -28, 48, 36],
    draw: T => {
      let track = '';
      for (const du of [-0.18, 0, 0.18]) track += T.box(du - 0.025, -0.13, du + 0.025, 0.13, 0, 1.4, WOOD_DARK);
      track += ln(T.p(-0.24, -0.07, 1.4), T.p(0.24, -0.07, 1.4), '#7C8894', 1.2) + ln(T.p(-0.24, 0.07, 1.4), T.p(0.24, 0.07, 1.4), '#7C8894', 1.2);
      const l0 = T.p(-0.13, 0.085, 5);
      const r0 = T.p(0.13, 0.085, 5);
      const l1 = T.p(-0.17, 0.115, 15);
      const r1 = T.p(0.17, 0.115, 15);
      const top = [T.p(-0.17, -0.115, 15), T.p(0.17, -0.115, 15), r1, l1];
      const ore = [[-0.08, -0.02, 2.8, IRON], [0.04, -0.05, 2.6, IRON], [0, 0.04, 3, STONE], [0.09, 0.03, 2.2, IRON], [-0.1, 0.05, 2.2, STONE]]
        .map(([a, b, s, c]) => stone(...T.p(a, b, 16), s, c)).join('');
      const [gx, gy] = T.p(0.02, -0.01, 19);
      return T.shadow(0, 0, 0.2, 0.2) + track
        + wheel(T, -0.1, -0.1, 5, 0.055, 'u', { rim: '#3D3A36', spokes: 4 }) + wheel(T, 0.1, -0.1, 5, 0.055, 'u', { rim: '#3D3A36', spokes: 4 })
        + poly([l0, r0, r1, l1], IRON.left, ` stroke="${OUT}" stroke-width="0.6"`)
        + poly([r0, T.p(0.13, -0.085, 5), T.p(0.17, -0.115, 15), r1], IRON.right, ` stroke="${OUT}" stroke-width="0.6"`)
        + poly(top, '#2E2A26', ` stroke="${IRON.top}" stroke-width="0.9"`)
        + ore + `<path d="M${f2(gx)},${f2(gy - 2)} l1.6,2 l-1.6,2 l-1.6,-2 Z" fill="#F2C04B"/>` + dot(gx - 0.4, gy - 0.6, 0.5, '#FFFFFF')
        + [0.25, 0.5, 0.75].map(k => dot(l1[0] + (r1[0] - l1[0]) * k, l1[1] + (r1[1] - l1[1]) * k + 1.6, 0.55, IRON.right)).join('')
        + wheel(T, -0.1, 0.1, 5, 0.055, 'u', { rim: '#2A2724', spokes: 4 }) + wheel(T, 0.1, 0.1, 5, 0.055, 'u', { rim: '#2A2724', spokes: 4 });
    }
  }]
};
// Lanterne de mine pendue à une potence ; elle se balance doucement et luit la nuit
const LANTERN_AT = [-0.86, 0.5];
const lanterneMine = {
  light: () => [LANTERN_AT[0] + 0.2, LANTERN_AT[1], 24, 22],
  layers: [{
    at: LANTERN_AT,
    frame: [-12, -44, 34, 50],
    draw: T => T.shadow(0, 0, 0.08, 0.2)
      + T.pebble(-0.04, 0.06, 2.4) + T.pebble(0.05, 0.05, 2)
      + T.box(-0.025, -0.025, 0.025, 0.025, 0, 37, WOOD_DARK)
      + T.box(-0.02, -0.018, 0.24, 0.018, 34, 37, WOOD)
      + ln(T.p(0, 0, 25), T.p(0.11, 0, 35), WOOD_DARK.right, 1.4)
      + ln(T.p(0.2, 0, 34), T.p(0.2, 0, 32), '#3D3A36', 1)
  }, {
    at: LANTERN_AT,
    frame: [-2, -40, 24, 26],
    n: 8,
    fps: 5,
    draw: (T, level, f, n) => {
      const [hx, hy] = T.p(0.2, 0, 32);
      return `<g transform="rotate(${f2(wave(f, n, 7))} ${f2(hx)} ${f2(hy)})">`
        + ln([hx, hy], [hx, hy + 3], '#3D3A36', 0.8)
        + `<path d="M${f2(hx - 3.2)},${f2(hy + 5)} L${f2(hx - 1.6)},${f2(hy + 3)} L${f2(hx + 1.6)},${f2(hy + 3)} L${f2(hx + 3.2)},${f2(hy + 5)} Z" fill="#3D3A36"/>`
        + `<rect x="${f2(hx - 3)}" y="${f2(hy + 5)}" width="6" height="7.4" fill="#FFE08A"/>`
        + `<rect x="${f2(hx + 0.4)}" y="${f2(hy + 5)}" width="2.6" height="7.4" fill="#E9BF4E"/>`
        + ell(hx - 0.4, hy + 8.6, 1.3, 1.9, '#FFFDF0')
        + `<path d="M${f2(hx - 3)},${f2(hy + 5)} v7.4 M${f2(hx)},${f2(hy + 5)} v7.4 M${f2(hx + 3)},${f2(hy + 5)} v7.4" stroke="#3D3A36" stroke-width="0.7"/>`
        + `<rect x="${f2(hx - 3.6)}" y="${f2(hy + 12.2)}" width="7.2" height="1.6" rx="0.5" fill="#3D3A36"/></g>`;
    }
  }]
};
// Rails : butoir au bout de la voie de la Mine, et un wagonnet de minerai qui sort de la galerie et y retourne
const rails = {
  layers: [{
    at: [-0.35, 0.88],
    frame: [-18, -16, 36, 26],
    draw: T => {
      let out = '';
      for (const dv of [-0.06, 0.04]) out += T.box(-0.15, dv - 0.02, 0.15, dv + 0.02, 0, 1.5, WOOD_DARK);
      out += ln(T.p(-0.1, -0.08, 1.5), T.p(-0.1, 0.06, 1.5), '#7C8894', 1.2) + ln(T.p(0.1, -0.08, 1.5), T.p(0.1, 0.06, 1.5), '#7C8894', 1.2);
      return out + T.box(-0.14, 0.06, -0.1, 0.1, 0, 9, WOOD_DARK) + T.box(0.1, 0.06, 0.14, 0.1, 0, 9, WOOD_DARK)
        + T.box(-0.15, 0.05, 0.15, 0.09, 6, 10, { top: '#F2EDE2', left: '#E2574C', right: '#B13A31' })
        + [-0.07, 0.03].map(du => T.face([[du, 0.09, 6], [du + 0.04, 0.09, 6], [du + 0.04, 0.09, 10], [du, 0.09, 10]], '#FFFDF8')).join('');
    }
  }, {
    at: [-0.35, 0],
    frame: [-18, -26, 36, 32],
    n: 4,
    fps: 8,
    motion: t => {
      // Cycle de 9 s : attend dans la galerie, sort, attend au bout de la voie, rentre
      const c = (t % 9) / 9;
      const ease = k => k * k * (3 - 2 * k);
      let k = 0;
      if (c >= 0.15 && c < 0.45) k = ease((c - 0.15) / 0.3);
      else if (c >= 0.45 && c < 0.6) k = 1;
      else if (c >= 0.6 && c < 0.9) k = 1 - ease((c - 0.6) / 0.3);
      return [0, 0.06 + k * 0.24, 0];
    },
    draw: (T, level, f, n) => {
      const turn = (f / n) * (Math.PI / 2);
      const top = [T.p(-0.1, -0.13, 13), T.p(0.1, -0.13, 13), T.p(0.1, 0.13, 13), T.p(-0.1, 0.13, 13)];
      const ore = [[-0.03, -0.06, 2.4, IRON], [0.03, 0, 2.6, STONE], [-0.02, 0.06, 2.2, IRON]].map(([a, b, s, c]) => stone(...T.p(a, b, 14), s, c)).join('');
      return T.shadow(0, 0, 0.14, 0.2, 1.5)
        + T.box(-0.075, -0.1, 0.075, 0.1, 4, 6, DARK_IRON)
        + T.face([[-0.075, 0.1, 5], [0.075, 0.1, 5], [0.1, 0.13, 13], [-0.1, 0.13, 13]], IRON.left, ` stroke="${OUT}" stroke-width="0.6"`)
        + T.face([[0.075, -0.1, 5], [0.075, 0.1, 5], [0.1, 0.13, 13], [0.1, -0.13, 13]], IRON.right, ` stroke="${OUT}" stroke-width="0.6"`)
        + poly(top, '#2E2A26', ` stroke="${IRON.top}" stroke-width="0.9"`) + ore
        + wheel(T, 0.09, -0.06, 4, 0.045, 'v', { rim: '#2A2724', spokes: 4, turn }) + wheel(T, 0.09, 0.07, 4, 0.045, 'v', { rim: '#2A2724', spokes: 4, turn });
    }
  }]
};
// Casque de mineur à lampe posé sur sa caisse, gourde et rouleau de corde (palier V)
const casque = {
  layers: [{
    at: [-0.1, 0.94],
    frame: [-20, -32, 40, 38],
    draw: T => {
      const [x, y] = T.p(0, 0, 12);
      const [rx, ry] = T.p(0.17, 0.06, 0);
      const [gx, gy] = T.p(-0.03, 0.15, 4);
      return T.shadow(0, 0, 0.16, 0.2)
        + T.box(-0.09, -0.08, 0.09, 0.08, 0, 12, WOOD)
        + ln(T.p(-0.08, 0.08, 1), T.p(0.08, 0.08, 11), WOOD_DARK.right, 1.1) + ln(T.p(0.09, -0.07, 1), T.p(0.09, 0.07, 11), WOOD_DARK.right, 1.1)
        + [0, 1, 2].map(k => ell(rx, ry - k * 1.4, 4.8 - k * 0.6, 2 - k * 0.2, 'none', ' stroke="#C9A16A" stroke-width="1.3"')).join('')
        + ln([rx + 4, ry - 3], [rx + 7, ry - 1], '#C9A16A', 1.1)
        // Gourde de fer-blanc contre la caisse
        + ell(gx, gy, 2.8, 3.6, CAST.left, ` stroke="${OUT}" stroke-width="0.5"`) + ell(gx - 0.8, gy - 1, 1, 1.6, CAST.top)
        + `<rect x="${f2(gx - 0.8)}" y="${f2(gy - 5.4)}" width="1.6" height="1.8" fill="#8B5631"/>`
        // Casque : bombe jaune, visière, crête, lampe
        + gradient(T.id('hat'), '#FFD866', '#D9952A')
        + ell(x, y + 0.4, 8.6, 2.8, 'rgba(60,40,25,.25)') + ell(x, y - 0.4, 8.2, 2.8, '#D99A2B', ` stroke="${OUT}" stroke-width="0.5"`)
        + `<path d="M${f2(x - 6)},${f2(y - 0.8)} C${f2(x - 6.4)},${f2(y - 10.4)} ${f2(x + 6.4)},${f2(y - 10.4)} ${f2(x + 6)},${f2(y - 0.8)} Z" fill="url(#${T.id('hat')})" stroke="${OUT}" stroke-width="0.6"/>`
        + `<path d="M${f2(x + 0.4)},${f2(y - 7.8)} q0.6,3.6 0.4,7" stroke="#C88A20" stroke-width="1.6" fill="none"/>`
        + `<rect x="${f2(x - 5.8)}" y="${f2(y - 6.6)}" width="3.8" height="3.6" rx="0.8" fill="${DARK_IRON.left}"/>`
        + ell(x - 4.6, y - 4.8, 1.5, 1.5, '#FFF3B8') + dot(x - 5, y - 5.3, 0.5, '#FFFFFF');
    }
  }]
};
// Géode ouverte : coque de pierre et cœur d'améthystes qui scintillent, sa moitié couchée devant ; elle luit la nuit (palier VI)
const GEODE_AT = [-0.92, 0.82];
const AMETHYST = ['#B98CF2', '#9466DA', '#DCC6FF', '#7F52C8'];
function crystals(cx, cy, rx, ry, count, seed) {
  let out = '';
  for (let k = 0; k < count; k++) {
    const a = (k / count) * Math.PI * 2 + seed + ((k * 7) % 3) * 0.08;
    const reach = 0.3 + ((k * 5) % 4) * 0.12;
    const bx = cx + Math.cos(a) * rx;
    const by = cy + Math.sin(a) * ry;
    const px = -Math.sin(a) * (1.1 + (k % 3) * 0.4);
    const py = Math.cos(a) * (0.8 + (k % 2) * 0.3);
    const tx = cx + Math.cos(a) * rx * reach;
    const ty = cy + Math.sin(a) * ry * reach;
    out += poly([[bx - px, by - py], [tx, ty], [bx + px, by + py]], AMETHYST[(k * 3) % 4]) + ln([bx, by], [tx, ty], 'rgba(255,255,255,.25)', 0.4);
  }
  return out;
}
const geode = {
  light: () => [GEODE_AT[0], GEODE_AT[1], 8, 20, '190,140,255'],
  layers: [{
    at: GEODE_AT,
    frame: [-22, -30, 44, 36],
    n: 6,
    fps: 4,
    draw: (T, level, f, n) => {
      const [x, y] = T.p(0, 0, 0);
      const cx = x - 2;
      const cy = y - 10;
      const [hx, hy] = T.p(0.13, 0.1, 0);
      const prism = (px, py, h, w, c) => poly([[px - w, py], [px - w, py - h], [px, py - h - w], [px, py]], c.left) + poly([[px, py], [px, py - h - w], [px + w, py - h], [px + w, py]], c.right);
      const twinkle = [[-4, -4], [3, -2], [-1, 3]].map(([dx, dy], k) => star(cx + dx, cy + dy, 1.8, '#FFFFFF', Math.max(0, wave(f, n, 1, k * 2.1)))).join('');
      return ell(x + 1, y + 0.6, 15, 4.4, 'rgba(40,55,20,.24)')
        + gradient(T.id('shell'), STONE.left, STONE.right)
        + `<path d="M${f2(cx - 12)},${f2(cy + 2)} Q${f2(cx - 13)},${f2(cy - 9)} ${f2(cx - 2)},${f2(cy - 11)} Q${f2(cx + 11)},${f2(cy - 12)} ${f2(cx + 12.4)},${f2(cy)} Q${f2(cx + 12)},${f2(cy + 9)} ${f2(cx)},${f2(cy + 10)} Q${f2(cx - 11)},${f2(cy + 10)} ${f2(cx - 12)},${f2(cy + 2)} Z" fill="url(#${T.id('shell')})" stroke="${OUT}" stroke-width="0.6"/>`
        + `<path d="M${f2(cx - 8.6)},${f2(cy)} Q${f2(cx - 8)},${f2(cy - 7.6)} ${f2(cx + 1)},${f2(cy - 7.2)} Q${f2(cx + 9.6)},${f2(cy - 6.6)} ${f2(cx + 9)},${f2(cy + 0.6)} Q${f2(cx + 8)},${f2(cy + 7)} ${f2(cx)},${f2(cy + 6.8)} Q${f2(cx - 8.4)},${f2(cy + 6)} ${f2(cx - 8.6)},${f2(cy)} Z" fill="#3B2550" stroke="#D9D2C6" stroke-width="1"/>`
        + crystals(cx + 0.6, cy - 0.2, 7.8, 6.2, 16, 0.2)
        + prism(cx - 2.4, cy + 4, 6, 1.6, { left: '#C8A4F7', right: '#8A5CD4' }) + prism(cx + 1, cy + 4.6, 8.4, 2, { left: '#DCC6FF', right: '#9A6AE0' }) + prism(cx + 4, cy + 4, 5, 1.4, { left: '#B98CF2', right: '#7F52C8' })
        + twinkle
        // Moitié couchée au premier plan
        + ell(hx, hy - 1, 7.4, 3.8, STONE.right, ` stroke="${OUT}" stroke-width="0.5"`) + ell(hx, hy - 1.8, 6.6, 3.2, '#E9E2D6') + ell(hx, hy - 1.8, 5.8, 2.7, '#4A2E66')
        + crystals(hx, hy - 1.8, 5.4, 2.4, 12, 0.5);
    }
  }]
};
// Golem de pierre moussu qui garde la Mine : il respire, ses runes et ses yeux s'allument doucement (palier VII)
const GOLEM_AT = [-0.9, 0.08];
const ROCK = { top: '#C2BCB1', left: '#A39D92', right: '#7E7970' };
const golem = {
  light: () => [GOLEM_AT[0], GOLEM_AT[1] + 0.06, 26, 18, '120,230,255'],
  layers: [{
    at: GOLEM_AT,
    frame: [-24, -54, 48, 60],
    n: 8,
    fps: 3,
    draw: (T, level, f, n) => {
      const b = wave(f, n, 0.7);
      const glowing = 0.55 + wave(f, n, 0.45, 1);
      const sw = wave(f, n, 0.014);
      const rune = `rgba(130,235,255,${f2(glowing)})`;
      const moss = (du, dv, z, r) => T.disc(du, dv, z, r, '#6DB64C') + T.disc(du - 0.008, dv - 0.008, z + 0.6, r * 0.6, '#8FCB6A');
      const arm = (u0, u1, s) => T.box(u0, -0.05 + s, u1, 0.05 + s, 9 + b, 25 + b, ROCK) + T.box(u0 - 0.015, -0.065 + s, u1 + 0.015, 0.065 + s, 1 + b, 10 + b, ROCK);
      const shoulder = (du, k) => { const [px, py] = T.p(du, 0, 26 + b); return stone(px, py, 4.6 + k, ROCK); };
      const eye = du => { const [ex, ey] = T.p(du, 0.07, 30 + b); return ell(ex, ey, 1.5, 1, rune) + dot(ex, ey, 0.5, '#F2FFFF'); };
      const ring = Array.from({ length: 16 }, (_, k) => T.p(Math.cos((k / 16) * Math.PI * 2) * 0.06, 0.09, 17 + b + Math.sin((k / 16) * Math.PI * 2) * 4.6));
      return T.shadow(0, 0, 0.28, 0.24)
        + T.pebble(0.26, 0.14, 2.4) + T.pebble(-0.24, 0.18, 1.8)
        + arm(-0.25, -0.155, sw)
        + T.box(-0.11, -0.05, -0.02, 0.05, 0, 9, ROCK) + T.box(0.02, -0.05, 0.11, 0.05, 0, 9, ROCK)
        + T.box(-0.15, -0.09, 0.15, 0.09, 8 + b, 27 + b, ROCK)
        + ln(T.p(-0.12, 0.09, 24 + b), T.p(-0.07, 0.09, 20 + b), 'rgba(60,50,40,.35)', 0.6) + ln(T.p(0.15, -0.05, 12 + b), T.p(0.15, 0.03, 17 + b), 'rgba(60,50,40,.35)', 0.6)
        + `<polygon points="${ring.map(xy).join(' ')}" fill="none" stroke="rgba(130,235,255,${f2(glowing * 0.35)})" stroke-width="2.4"/>`
        + `<polygon points="${ring.map(xy).join(' ')}" fill="none" stroke="${rune}" stroke-width="0.9"/>`
        + ln(T.p(0, 0.09, 12 + b), T.p(0, 0.09, 22 + b), rune, 0.9) + ln(T.p(-0.04, 0.09, 14 + b), T.p(0.04, 0.09, 20 + b), rune, 0.8)
        + shoulder(-0.13, 0)
        + T.box(-0.065, -0.05, 0.065, 0.07, 26 + b, 34 + b, ROCK)
        + eye(-0.032) + eye(0.028)
        + ln(T.p(-0.03, 0.07, 27.4 + b), T.p(0.025, 0.07, 27 + b), 'rgba(60,50,40,.45)', 0.7)
        + shoulder(0.14, 0.4)
        + arm(0.155, 0.25, -sw)
        + moss(-0.03, 0, 34 + b, 0.05) + moss(0.17, 0, 25 + b, 0.035) + moss(-0.11, -0.04, 27 + b, 0.035)
        + dot(...T.p(-0.02, 0.01, 35.4 + b), 0.9, '#F7A8C8');
    }
  }]
};

/* ---------- Bosquet ---------- */
const hache = {
  layers: [{
    at: [-0.42, 0.84],
    frame: [-24, -32, 46, 38],
    draw: T => {
      const [x, y] = T.p(0, 0, 9);
      const log = (a, b, z) => T.box(a, b, a + 0.2, b + 0.065, z, z + 4.6, BARK) + ell(...T.p(a + 0.2, b + 0.032, z + 2.3), 1.1, 1.6, 'none', ' stroke="#C9935E" stroke-width="0.5"');
      return T.shadow(-0.1, 0.04, 0.2, 0.2)
        // Bûches fendues empilées à gauche du billot
        + log(-0.36, -0.06, 0) + log(-0.36, 0.01, 0) + log(-0.36, 0.08, 0) + log(-0.34, -0.025, 4.6) + log(-0.34, 0.045, 4.6)
        + T.cyl(0, 0, 0, 9, 0.11, STUMP, 'block')
        + ell(x, y, 3.4, 1.7, 'none', ' stroke="#B98552" stroke-width="0.6"') + ell(x, y, 1.4, 0.7, 'none', ' stroke="#B98552" stroke-width="0.5"')
        + [-3, 0, 3].map(dx => ln([x + dx, y + 1.6], [x + dx + 0.4, y + 8], 'rgba(60,40,25,.25)', 0.6)).join('')
        // Hache plantée de biais
        + ln([x + 0.6, y - 1.6], [x + 9.5, y - 17], WOOD.right, 2) + ln([x + 0.3, y - 1.8], [x + 9.2, y - 17.2], WOOD.top, 0.6)
        + `<path d="M${f2(x - 3.2)},${f2(y + 0.6)} L${f2(x + 3.6)},${f2(y - 1.2)} L${f2(x + 2.6)},${f2(y - 4.8)} L${f2(x - 2.2)},${f2(y - 4.6)} Q${f2(x - 4.4)},${f2(y - 2)} ${f2(x - 3.2)},${f2(y + 0.6)} Z" fill="${IRON.left}" stroke="${IRON.right}" stroke-width="0.6"/>`
        + `<path d="M${f2(x - 3.2)},${f2(y + 0.6)} Q${f2(x - 4.4)},${f2(y - 2)} ${f2(x - 2.2)},${f2(y - 4.6)}" stroke="${IRON.top}" stroke-width="0.8" fill="none"/>`
        + [[6, 3], [-5, 4], [8, 1], [3, 5]].map(([dx, dy]) => `<path d="M${f2(x + dx)},${f2(y + 9 + dy)} l1.6,-0.6 l0.4,0.9 Z" fill="#E7C08A"/>`).join('');
    }
  }]
};
const scie = {
  layers: [{
    at: [0.78, -0.74],
    frame: [-26, -34, 52, 40],
    draw: T => {
      const leg = (du, s) => ln(T.p(du, -0.09 * s, 0), T.p(du, 0.09 * s, 14), WOOD_DARK.right, 2);
      const [b0x, b0y] = T.p(0.02, -0.13, 15);
      const [b1x, b1y] = T.p(0.02, 0.13, 15);
      const teeth = Array.from({ length: 9 }, (_, k) => `${k ? 'L' : 'M'}${f2(b0x + ((b1x - b0x) * k) / 8)},${f2(b0y + ((b1y - b0y) * k) / 8 + (k % 2 ? 1 : 0))}`).join(' ');
      const [dx, dy] = T.p(0.03, 0.02, 0);
      return T.shadow(0, 0, 0.24, 0.18)
        + ell(dx, dy, 6, 2, '#EBCB93') + [[-3, 0.5], [2, 1], [4, -0.4]].map(([a, b]) => dot(dx + a, dy + b, 0.5, '#C9A16A')).join('')
        + leg(-0.15, 1) + leg(-0.15, -1)
        + T.box(-0.26, -0.055, 0.24, 0.055, 12, 19, BARK)
        + ell(...T.p(0.24, 0, 15.5), 1.6, 2.4, 'none', ' stroke="#C9935E" stroke-width="0.5"')
        + leg(0.15, 1) + leg(0.15, -1)
        // Scie à cadre plantée dans l'entaille : lame dentée, montants, traverse, corde de tension
        + `<path d="${teeth}" stroke="${IRON.right}" stroke-width="0.7" fill="none"/>`
        + ln([b0x, b0y], [b1x, b1y], IRON.left, 1.4)
        + ln([b0x, b0y], [b0x + 1.5, b0y - 14], WOOD.right, 1.6) + ln([b1x, b1y], [b1x + 1.5, b1y - 14], WOOD.right, 1.6)
        + ln([b0x + 0.8, b0y - 7], [b1x + 0.8, b1y - 7], WOOD.left, 1.2)
        + ln([b0x + 1.5, b0y - 14], [b1x + 1.5, b1y - 14], '#C9A16A', 0.7, ' stroke-dasharray="1 0.8"')
        + T.cyl(-0.3, 0.12, 0, 4, 0.06, STUMP, 'round1') + T.cyl(-0.22, 0.16, 0, 3, 0.05, STUMP, 'round2');
    }
  }]
};
// Nichoir sur son poteau ; un rouge-gorge et une mésange sautillent devant le Bosquet
const nichoir = {
  layers: [{
    at: [0.86, 0.12],
    frame: [-14, -54, 28, 60],
    draw: T => {
      const [hx, hy] = T.p(0, 0.065, 41);
      return T.shadow(0, 0, 0.08, 0.2) + T.pebble(0.04, 0.04, 2.2)
        + T.box(-0.02, -0.02, 0.02, 0.02, 0, 35, WOOD_DARK)
        + T.box(-0.07, -0.065, 0.07, 0.065, 35, 46, { top: '#FBF3DF', left: '#F3E4C4', right: '#D8C39B' })
        + dot(hx, hy, 2, '#3A2A1E')
        + ln([hx, hy + 4], [hx - 2.4, hy + 5.2], WOOD_DARK.right, 1)
        + T.gable(-0.07, -0.065, 0.07, 0.065, 46, 8, { front: '#6FA3D9', back: '#4C7FB5', gable: '#D8C39B' }, 0.03)
        + `<path d="M${f2(hx - 4)},${f2(hy - 4)} l1.4,-1 l1.4,1" stroke="#F7A8C8" stroke-width="0.8" fill="none"/>`;
    }
  }, {
    at: [0.75, 0.42],
    frame: [-26, -18, 52, 24],
    n: 8,
    fps: 4,
    draw: (T, level, f) => {
      const [x1, y1] = T.p(-0.14, 0.05, 0);
      const [x2, y2] = T.p(0.2, -0.12, 0);
      return bird(x1 + (f >= 4 ? 2 : 0), y1, { body: '#8B6A4E', breast: '#E8743F', wing: '#6F5238', flip: f >= 4, hop: f === 3 || f === 7 ? 2.6 : 0, peck: f === 1 || f === 5 ? 1 : 0, flap: f === 3 || f === 7 ? 1 : 0 })
        + bird(x2, y2, { body: '#5E92C8', breast: '#F2D35A', wing: '#456F9C', flip: f % 4 >= 2, hop: f === 6 ? 2.4 : 0, peck: f === 0 || f === 2 ? 1 : 0, flap: f === 6 ? 1 : 0 });
    }
  }]
};
const charrette = {
  layers: [{
    at: { 1: [0.62, 0.78], 2: [0.25, 0.84] },
    frame: [-30, -34, 62, 42],
    draw: T => {
      const log = (dv, z) => T.box(-0.22, dv - 0.035, 0.1, dv + 0.035, z, z + 5, BARK) + ell(...T.p(0.1, dv, z + 2.5), 1.2, 1.8, 'none', ' stroke="#C9935E" stroke-width="0.5"');
      return T.shadow(-0.04, 0, 0.3, 0.18)
        + wheel(T, -0.08, -0.13, 9, 0.12, 'u', { rim: '#5E3A22', spokes: 8, width: 2 })
        + ln(T.p(0.1, -0.09, 10), T.p(0.42, -0.09, 1), WOOD.right, 1.6)
        + T.box(-0.24, -0.12, 0.12, 0.12, 9, 12, WOOD)
        + log(-0.07, 12) + log(0, 12) + log(0.07, 12) + log(-0.035, 17) + log(0.035, 17)
        + T.box(-0.24, 0.115, 0.12, 0.13, 12, 17, WOOD_DARK)
        + [-0.2, -0.04, 0.1].map(du => T.box(du, 0.11, du + 0.025, 0.135, 9, 18, WOOD_DARK)).join('')
        + ln(T.p(0.1, 0.09, 10), T.p(0.42, 0.09, 1), WOOD.right, 1.6) + ln(T.p(0.1, 0.09, 10.6), T.p(0.42, 0.09, 1.6), WOOD.top, 0.6)
        + wheel(T, -0.08, 0.14, 9, 0.12, 'u', { rim: '#4A2E1A', spokes: 8, width: 2.2 })
        + T.disc(-0.08, 0.15, 9, 0.02, '#C9A16A');
    }
  }]
};
// Scie passe-partout posée en travers d'un gros tronc entaillé, sur ses cales, tas de sciure (palier V)
const passePartout = {
  layers: [{
    at: [0.9, 0.62],
    frame: [-30, -32, 58, 40],
    draw: T => {
      const [b0x, b0y] = T.p(0.1, -0.24, 13);
      const [b1x, b1y] = T.p(0.1, 0.26, 13);
      const sag = 2.4;
      const blade = `M${f2(b0x)},${f2(b0y)} Q${f2((b0x + b1x) / 2)},${f2((b0y + b1y) / 2 + sag)} ${f2(b1x)},${f2(b1y)} L${f2(b1x)},${f2(b1y + 3)} Q${f2((b0x + b1x) / 2)},${f2((b0y + b1y) / 2 + sag + 5)} ${f2(b0x)},${f2(b0y + 3)} Z`;
      const teeth = Array.from({ length: 13 }, (_, k) => {
        const t = k / 12;
        const tx = b0x + (b1x - b0x) * t;
        const ty = b0y + (b1y - b0y) * t + 3 + (sag + 2) * 4 * t * (1 - t);
        return `${k ? 'L' : 'M'}${f2(tx)},${f2(ty + (k % 2 ? 1.2 : 0))}`;
      }).join(' ');
      const grip = (gx, gy) => ln([gx, gy + 1], [gx, gy - 8], WOOD.right, 2) + ln([gx - 0.4, gy + 1], [gx - 0.4, gy - 8], WOOD.top, 0.6) + ln([gx - 2.2, gy - 7], [gx + 2.2, gy - 7], WOOD_DARK.right, 1.4);
      const [dx, dy] = T.p(0.05, 0.14, 0);
      return T.shadow(0, 0, 0.3, 0.18)
        + T.box(-0.17, -0.09, -0.11, 0.09, 0, 3, WOOD_DARK) + T.box(0.11, -0.09, 0.17, 0.09, 0, 3, WOOD_DARK)
        + T.box(-0.34, -0.065, 0.3, 0.065, 3, 12, BARK)
        + ell(...T.p(0.3, 0, 7.5), 2.2, 3.4, 'none', ' stroke="#C9935E" stroke-width="0.6"') + ell(...T.p(0.3, 0, 7.5), 0.9, 1.4, 'none', ' stroke="#C9935E" stroke-width="0.5"')
        + [5.4, 8.2, 10.4].map((z, k) => ln(T.p(-0.32 + k * 0.05, 0.065, z), T.p(0.26 - k * 0.04, 0.065, z + 0.3), 'rgba(60,35,20,.3)', 0.6)).join('')
        + ln(T.p(-0.3, -0.03, 12), T.p(0.26, -0.03, 12), 'rgba(255,230,190,.35)', 0.8)
        + T.face([[0.05, 0.065, 12], [0.15, 0.065, 12], [0.1, 0.065, 7.4]], '#F1D3A1') + T.face([[0.05, -0.065, 12], [0.15, -0.065, 12], [0.15, 0.065, 12], [0.05, 0.065, 12]], '#E7C08A')
        + ell(dx, dy, 6.4, 2.2, '#EBCB93') + [[-3, 0.5], [2, 1], [4, -0.4]].map(([a, b]) => dot(dx + a, dy + b, 0.5, '#C9A16A')).join('')
        + `<path d="${blade}" fill="${IRON.left}" stroke="${IRON.right}" stroke-width="0.6"/>`
        + `<path d="${teeth}" stroke="${IRON.right}" stroke-width="0.7" fill="none"/>`
        + ln([b0x + 3, b0y + 0.8], [b1x - 3, b1y + 0.8], 'rgba(255,255,255,.5)', 0.6)
        + grip(b0x, b0y) + grip(b1x, b1y);
    }
  }]
};
// Écureuil roux sur sa souche : il grignote une noisette, sa queue en panache ondule, il sautille (palier VI)
const acorn = (x, y, s = 1) => ell(x, y, 1.6 * s, 1.9 * s, '#B98552') + `<path d="M${f2(x - 1.8 * s)},${f2(y - 0.8 * s)} q${f2(1.8 * s)},${f2(-2.2 * s)} ${f2(3.6 * s)},0 Z" fill="#7A4E30"/>`
  + ln([x, y - 1.9 * s], [x + 0.4 * s, y - 2.8 * s], '#5E3A22', 0.5);
const ecureuil = {
  layers: [{
    at: [-0.12, 0.94],
    frame: [-18, -38, 36, 44],
    n: 8,
    fps: 5,
    draw: (T, level, f, n) => {
      const [sx, sy] = T.p(0, 0, 8);
      const hop = f === 6 ? 2.6 : f === 7 ? 1 : 0;
      const nib = f % 2 && f < 6 ? 0.6 : 0;
      const tail = wave(f, n, 1.2);
      const x = sx - 1;
      const y = sy - 0.6 - hop;
      return T.shadow(0, 0, 0.13, 0.22)
        + T.cyl(0, 0, 0, 8, 0.1, STUMP, 'stump')
        + ell(sx, sy, 3, 1.4, 'none', ' stroke="#B98552" stroke-width="0.6"') + ell(sx, sy, 1.2, 0.6, 'none', ' stroke="#B98552" stroke-width="0.5"')
        + acorn(...T.p(0.16, 0.06, 1.6)) + acorn(...T.p(0.1, 0.16, 1.6), 0.9)
        // Queue en panache, derrière
        + `<path d="M${f2(x - 2)},${f2(y - 2)} C${f2(x - 9)},${f2(y - 2)} ${f2(x - 10 + tail)},${f2(y - 12)} ${f2(x - 6 + tail)},${f2(y - 17)} C${f2(x - 3 + tail)},${f2(y - 20)} ${f2(x + 1.4 + tail)},${f2(y - 16)} ${f2(x - 1 + tail * 0.6)},${f2(y - 13)} C${f2(x - 4)},${f2(y - 10)} ${f2(x - 4)},${f2(y - 5)} ${f2(x + 0.5)},${f2(y - 3)} Z" fill="#D9743A" stroke="#A9521F" stroke-width="0.5"/>`
        + `<path d="M${f2(x - 4)},${f2(y - 4)} C${f2(x - 8)},${f2(y - 6)} ${f2(x - 7 + tail)},${f2(y - 13)} ${f2(x - 4.6 + tail)},${f2(y - 15.6)}" stroke="#F2A266" stroke-width="1" fill="none"/>`
        // Corps assis, ventre clair, cuisse
        + ell(x + 0.6, y - 4.6, 3.6, 4.6, '#E0823F', ' stroke="rgba(120,50,20,.35)" stroke-width="0.5"')
        + ell(x + 2, y - 4, 1.8, 3.2, '#F6D7B0')
        + ell(x - 0.6, y - 1.6, 2.8, 1.8, '#C8662E')
        // Tête, oreille à pinceau, œil, museau
        + dot(x + 2.6, y - 10 + nib * 0.4, 2.8, '#E0823F')
        + `<path d="M${f2(x + 1.2)},${f2(y - 12)} l0.2,-3.2 l1.8,2.6 Z" fill="#C8662E"/>` + ln([x + 1.4, y - 15.2], [x + 1, y - 16.4], '#A9521F', 0.6)
        + ell(x + 3.8, y - 9 + nib * 0.4, 1.6, 1.2, '#F6D7B0')
        + dot(x + 3.4, y - 10.8 + nib * 0.4, 0.65, '#1E1A17') + dot(x + 5.2, y - 9.4 + nib * 0.4, 0.5, '#5E3A22')
        // Pattes avant et noisette
        + acorn(x + 4.4, y - 6.6 + nib, 0.9)
        + ell(x + 3.4, y - 6 + nib, 1, 0.8, '#C8662E') + ell(x + 5.2, y - 6.2 + nib, 1, 0.8, '#C8662E');
    }
  }]
};
// Cerf blanc aux bois dorés : il broute, relève la tête, des lucioles dansent dans ses bois ; il luit la nuit (palier VII)
const STAG_AT = [0.9, -0.3];
const antler = (x, y, s, c, w = 1.2) => `<path d="M${f2(x)},${f2(y)} q${-1 * s},-5 ${2 * s},-9 q${2 * s},-3 ${1 * s},-7 M${f2(x + 0.5 * s)},${f2(y - 4)} q${-3 * s},-1 ${-4 * s},-4.4 M${f2(x + 1.6 * s)},${f2(y - 8.4)} q${-3 * s},-1 ${-3.6 * s},-4.2 M${f2(x + 2.2 * s)},${f2(y - 10.6)} q${2 * s},-1 ${3 * s},-4.2" stroke="${c}" stroke-width="${w}" fill="none" stroke-linecap="round"/>`;
const cerf = {
  light: () => [STAG_AT[0], STAG_AT[1], 28, 18, '255,236,190'],
  layers: [{
    at: STAG_AT,
    frame: [-26, -50, 50, 56],
    n: 8,
    fps: 3,
    draw: (T, level, f, n) => {
      const [x, y] = T.p(0, 0, 0);
      const graze = f >= 3 && f <= 5 ? 1 : 0;
      const hx = x - 9 - graze * 1.6;
      const hy = y - 22 + graze * 13;
      const coat = '#FBF8F2';
      const shade = '#E2DBCD';
      const motes = [0, 1, 2].map(k => star(hx + 2 + Math.cos(k * 2.1 + f * 0.8) * 6, hy - 10 - k * 3 + wave(f, n, 1.5, k), 1.3, '#FFF2B0', 0.4 + Math.max(0, wave(f, n, 0.6, k * 2)))).join('');
      return ell(x, y + 0.5, 11, 2.6, 'rgba(40,55,20,.24)')
        + [[-5.4, 0, shade], [3.6, 0, shade], [-3, 0.8, coat], [6, 0.8, coat]].map(([dx, dy, c]) => ln([x + dx, y - 10], [x + dx, y + dy - 0.6], c, 1.7) + `<rect x="${f2(x + dx - 0.9)}" y="${f2(y + dy - 1)}" width="1.8" height="1.4" fill="#5E4A3A"/>`).join('')
        + `<path d="M${f2(x + 8.6)},${f2(y - 14.4)} q${f % 2 ? 2.6 : 1.8},${f % 2 ? -1.6 : -2.4} 1.4,-3.6" stroke="${coat}" stroke-width="2" stroke-linecap="round" fill="none"/>`
        + ell(x + 0.6, y - 12.6, 9.4, 4.8, coat, ' stroke="rgba(120,105,80,.3)" stroke-width="0.6"')
        + ell(x + 1.4, y - 9.6, 7, 1.6, shade)
        + `<path d="M${f2(x - 6)},${f2(y - 16)} L${f2(hx + 1)},${f2(hy - 1)} L${f2(hx + 3)},${f2(hy + 2)} L${f2(x - 4.6)},${f2(y - 10.4)} Z" fill="${coat}"/>`
        + antler(hx + 2.4, hy - 2.2, 1, 'rgba(255,236,170,.35)', 3)
        + antler(hx + 2.4, hy - 2.2, 1, '#C8962E')
        + ell(hx, hy, 3.8, 2.5, coat, ' stroke="rgba(120,105,80,.3)" stroke-width="0.5"')
        + ell(hx - 2.6, hy + 0.9, 1.9, 1.4, shade) + dot(hx - 4.2, hy + 0.6, 0.8, '#5E4A3A')
        + dot(hx - 0.6, hy - 0.6, 0.65, '#2A2420')
        + `<ellipse cx="${f2(hx + 3.2)}" cy="${f2(hy - 1.4)}" rx="2.4" ry="1" fill="${coat}" stroke="rgba(120,105,80,.3)" stroke-width="0.4" transform="rotate(${f === 1 ? -45 : -20} ${f2(hx + 3.2)} ${f2(hy - 1.4)})"/>`
        + antler(hx + 0.4, hy - 2, -1, 'rgba(255,236,170,.35)', 3)
        + antler(hx + 0.4, hy - 2, -1, '#E9BF4E')
        + motes;
    }
  }]
};

/* ---------- Puits ---------- */
const seauCuivre = {
  layers: [{
    at: [0.3, 0.88],
    frame: [-14, -24, 28, 30],
    draw: T => {
      const [x, y] = T.p(0, 0, 0);
      return ell(x + 3, y + 1.4, 8, 2.4, 'rgba(110,190,230,.45)') + ell(x + 1.6, y + 0.6, 6.4, 2, 'rgba(40,55,20,.2)')
        + bucket(T, 0, 0, 0, 10, 5, 6.6, COPPER, 'cb')
        + `<path d="M${f2(x - 6.6)},${f2(y - 10)} Q${f2(x)},${f2(y - 20)} ${f2(x + 6.6)},${f2(y - 10)}" stroke="${COPPER.right}" stroke-width="1" fill="none"/>`
        + dot(x - 6.6, y - 10, 0.8, COPPER.right) + dot(x + 6.6, y - 10, 0.8, COPPER.right)
        + ln([x - 3.6, y - 7.6], [x - 3.2, y - 2.2], 'rgba(255,240,220,.5)', 1);
    }
  }]
};
// Poulie : grande roue à rayons au bout du treuil du Puits ; potence à poulie au bord du bassin de la Fontaine
const poulie = {
  layers: [{
    at: { 1: [0.44, 0], 2: [0.84, 0.32] },
    frame: [-22, -50, 40, 56],
    draw: (T, level) => {
      if (level === 1) {
        return wheel(T, 0.02, 0, 32.5, 0.2, 'v', { rim: WOOD_DARK.right, spokes: 8, width: 1.8 })
          + ln(T.p(0.02, 0, 32.5), T.p(0.1, 0, 32.5), IRON.right, 1.4) + ln(T.p(0.1, 0, 32.5), T.p(0.1, 0, 26), WOOD.right, 1.6);
      }
      const [px, py] = T.p(-0.22, 0, 33);
      return T.shadow(0, 0, 0.08, 0.2) + T.box(-0.05, -0.05, 0.05, 0.05, 0, 3, STONE)
        + T.box(-0.022, -0.022, 0.022, 0.022, 3, 40, WOOD_DARK)
        + T.box(-0.26, -0.018, 0.02, 0.018, 37, 40, WOOD)
        + ln(T.p(0, 0, 28), T.p(-0.1, 0, 38), WOOD_DARK.right, 1.3)
        + wheel(T, -0.22, 0, 34, 0.05, 'u', { rim: IRON.right, spokes: 4, width: 1.2 })
        + ln([px + 1.6, py], [px + 1.6, py + 14], '#8A6A4A', 0.7)
        + bucket(T, -0.22, 0, 17, 6, 3, 3.8, PAIL, 'hb');
    }
  }]
};
const abreuvoir = {
  layers: [{
    at: [-0.78, 0.66],
    frame: [-24, -18, 48, 26],
    draw: T => T.shadow(0, 0, 0.2, 0.18)
      + T.box(-0.18, -0.075, 0.18, 0.075, 0, 7, STONE)
      + T.face([[-0.15, -0.05, 6.4], [0.15, -0.05, 6.4], [0.15, 0.05, 6.4], [-0.15, 0.05, 6.4]], '#5AAED7')
      + ln(T.p(-0.1, -0.02, 6.4), T.p(0.04, -0.02, 6.4), 'rgba(255,255,255,.6)', 0.8)
      + [[-0.16, 0.08], [0.1, 0.08], [0.19, 0]].map(([a, b]) => { const [x, y] = T.p(a, b, 0); return `<path d="M${f2(x - 2)},${f2(y)} q1,-3 2,-1 q1,-3 2,1 Z" fill="#6DB64C"/>`; }).join('')
  }, {
    at: [-0.5, 0.74],
    frame: [-22, -28, 38, 32],
    n: 8,
    fps: 4,
    draw: (T, level, f) => {
      // Chèvre qui boit : la tête plonge dans l'abreuvoir puis se relève, la queue frétille, une oreille bouge
      const [x, y] = T.p(0, 0, 0);
      const drink = f >= 2 && f <= 5 ? 1 : 0;
      const hx = x - 9.6 - drink * 1.2;
      const hy = y - 13.4 + drink * 4.2;
      const tail = f % 2 ? 2 : -1;
      return ell(x, y + 0.4, 9, 2, 'rgba(40,55,20,.25)')
        + [[-5, 0], [-2.4, 0.6], [3, 0], [5.4, 0.6]].map(([dx, dy]) => ln([x + dx, y - 6], [x + dx, y + dy], '#9C8A78', 1.5) + `<rect x="${f2(x + dx - 0.9)}" y="${f2(y + dy - 0.8)}" width="1.8" height="1.2" fill="#3A2A1E"/>`).join('')
        + `<path d="M${f2(x + 7.4)},${f2(y - 11)} q2.6,${f2(-2 - tail)} 1.6,${f2(-4 - tail)}" stroke="#FBF6EA" stroke-width="2" stroke-linecap="round" fill="none"/>`
        + ell(x + 0.6, y - 9.2, 8.2, 4.6, '#FBF6EA', ' stroke="rgba(60,40,25,.28)" stroke-width="0.6"')
        + ell(x + 1, y - 6.6, 6.4, 1.8, '#E6DCC8')
        + `<path d="M${f2(x - 6)},${f2(y - 11)} L${f2(hx + 1.6)},${f2(hy - 1.4)} L${f2(hx + 2.4)},${f2(hy + 2.2)} L${f2(x - 5)},${f2(y - 7)} Z" fill="#FBF6EA"/>`
        + ell(hx, hy, 3.7, 2.8, '#FBF6EA', ' stroke="rgba(60,40,25,.28)" stroke-width="0.6"')
        + `<path d="M${f2(hx + 0.6)},${f2(hy - 2.4)} q0.6,-4.4 3.6,-4.8 M${f2(hx - 0.8)},${f2(hy - 2.6)} q-0.2,-4.2 2,-5" stroke="#B8A27E" stroke-width="1.1" fill="none" stroke-linecap="round"/>`
        + `<ellipse cx="${f2(hx + 3.2)}" cy="${f2(hy - 1.2)}" rx="2.2" ry="1" fill="#FBF6EA" transform="rotate(${f === 3 ? -40 : -15} ${f2(hx + 3.2)} ${f2(hy - 1.2)})"/>`
        + `<path d="M${f2(hx - 2)},${f2(hy + 2.4)} l-0.4,2.6 l1.4,-1.8 Z" fill="#D9CCB4"/>`
        + dot(hx - 3.2, hy + 0.4, 0.7, '#E9A3A3') + dot(hx - 0.8, hy - 0.8, 0.65, '#2A2420');
    }
  }]
};
// Pompe à balancier en fonte peinte ; le bras monte et descend, l'eau coule dans le seau (Fontaine seulement)
const PUMP_AT = [0.74, -0.62];
const pompe = {
  layers: [{
    at: PUMP_AT,
    frame: [-18, -42, 36, 48],
    back: true,
    draw: T => {
      const [sx, sy] = T.p(0, 0.05, 16);
      const [kx, ky] = T.p(0, 0, 29);
      return T.shadow(0, 0.06, 0.16, 0.18)
        + T.box(-0.12, -0.1, 0.12, 0.1, 0, 3, STONE)
        + T.cyl(0, 0, 3, 25, 0.055, CAST, 'body')
        + T.cyl(0, 0, 25, 27, 0.075, CAST, 'cap') + dot(kx, ky, 1.6, CAST.left)
        + `<path d="M${f2(sx - 1.6)},${f2(sy - 1)} L${f2(sx - 7)},${f2(sy + 1.4)} L${f2(sx - 7)},${f2(sy + 3.4)} L${f2(sx - 1.6)},${f2(sy + 1.6)} Z" fill="${CAST.right}"/>`
        + bucket(T, 0, 0.24, 0, 7, 3.4, 4.4, PAIL, 'pb');
    }
  }, {
    at: PUMP_AT,
    frame: [-12, -40, 32, 46],
    n: 8,
    fps: 5,
    draw: (T, level, f, n) => {
      const [px, py] = T.p(0, 0, 27);
      const a = wave(f, n, 1);
      const [sx, sy] = T.p(0, 0.05, 16);
      const flowing = a < -0.2;
      return ln([px - 4, py + 1 + a * 2.4], [px + 15, py + 6.6 - a * 9], CAST.right, 2) + ln([px - 4, py + 0.4 + a * 2.4], [px + 15, py + 6 - a * 9], CAST.top, 0.6)
        + dot(px + 15, py + 6.6 - a * 9, 1.4, CAST.left)
        + ln([px - 3, py + 1 + a * 2.4], [px - 3, py + 4], CAST.right, 1) + dot(px, py + 0.8, 1.2, CAST.top)
        + (flowing ? `<path d="M${f2(sx - 6.6)},${f2(sy + 3)} q-0.6,4 0,7.6" stroke="#8FD0F0" stroke-width="1.8" fill="none" stroke-linecap="round"/>` + ell(sx - 6.6, sy + 11.2, 2.4, 0.9, 'none', ' stroke="rgba(255,255,255,.75)" stroke-width="0.6"') : '');
    }
  }]
};
// Baguette de sourcier : la fourche de coudrier plane et frémit au-dessus de la source qu'elle a trouvée (palier V)
const sourcier = {
  layers: [{
    at: [0.92, -0.12],
    frame: [-18, -34, 36, 40],
    n: 6,
    fps: 4,
    draw: (T, level, f, n) => {
      const [x, y] = T.p(0, 0, 0);
      const cx = x;
      const cy = y - 17 + wave(f, n, 1.2);
      const ripple = (f % 3) / 3;
      const jet = [0, 1, 2].map(k => {
        const t = ((f / n) + k / 3) % 1;
        return dot(x + (k - 1) * 3 * t, y - 1 - Math.sin(t * Math.PI) * 5, 0.8, `rgba(150,215,245,${f2(1 - t * 0.6)})`);
      }).join('');
      return ell(x, y + 0.4, 7.6, 2.8, 'rgba(110,190,230,.45)') + ell(x, y + 0.2, 4.8, 1.7, '#5AAED7')
        + ell(x, y + 0.2, 3 + ripple * 5, 1 + ripple * 1.8, 'none', ` stroke="rgba(255,255,255,${f2(0.8 - ripple * 0.7)})" stroke-width="0.6"`)
        + T.pebble(-0.13, 0.04, 2) + T.pebble(0.11, 0.08, 1.8) + T.pebble(0.05, -0.11, 1.5)
        + [[-8, 1], [7, 2]].map(([dx, dy]) => `<path d="M${f2(x + dx - 2)},${f2(y + dy)} q1,-3 2,-1 q1,-3 2,1 Z" fill="#6DB64C"/>`).join('')
        + jet
        + ell(cx, cy + 8, 5, 1.4, 'rgba(255,240,180,.3)')
        + `<g transform="rotate(${f2(wave(f, n, 6, 1))} ${f2(cx)} ${f2(cy)})">`
        + `<path d="M${f2(cx - 7)},${f2(cy - 6)} Q${f2(cx - 3)},${f2(cy - 2)} ${f2(cx)},${f2(cy + 2)} M${f2(cx + 7)},${f2(cy - 6)} Q${f2(cx + 3)},${f2(cy - 2)} ${f2(cx)},${f2(cy + 2)} L${f2(cx)},${f2(cy + 6)}" stroke="${WOOD.right}" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`
        + `<path d="M${f2(cx - 6.6)},${f2(cy - 6.4)} Q${f2(cx - 3)},${f2(cy - 2.6)} ${f2(cx - 0.4)},${f2(cy + 1.4)}" stroke="${WOOD.top}" stroke-width="0.5" fill="none"/>`
        + leaf(cx + 4.6, cy - 3.8, -50, 0.28) + '</g>';
    }
  }]
};
// Mare aux canards : une cane blanche et ses deux canetons en font le tour, entre les roseaux (palier VI)
function duck(x, y, s, flip, adult) {
  const d = flip ? -1 : 1;
  const X = dx => f2(x + d * dx * s);
  const Y = dy => f2(y + dy * s);
  const body = adult ? '#FFFDF8' : '#FFE07A';
  const wing = adult ? '#E9DFCB' : '#F2C94E';
  return ell(x - d * 3 * s, y + 0.4, 4 * s, 1.1 * s, 'none', ' stroke="rgba(255,255,255,.65)" stroke-width="0.6"')
    + `<path d="M${X(-4.6)},${Y(-1.2)} L${X(-6)},${Y(-4.2)} L${X(-3)},${Y(-3)} Z" fill="${wing}"/>`
    + `<path d="M${X(-4.6)},${Y(-1.2)} Q${X(-5)},${Y(-4.6)} ${X(-1)},${Y(-4)} Q${X(3)},${Y(-3.8)} ${X(4)},${Y(-1.4)} Q${X(0)},${Y(0.6)} ${X(-4.6)},${Y(-1.2)} Z" fill="${body}" stroke="rgba(60,40,25,.3)" stroke-width="0.5"/>`
    + `<path d="M${X(-2.6)},${Y(-2.6)} Q${X(-0.4)},${Y(-4.2)} ${X(1.8)},${Y(-2.4)} Q${X(-0.4)},${Y(-1.4)} ${X(-2.6)},${Y(-2.6)} Z" fill="${wing}"/>`
    + `<path d="M${X(1.6)},${Y(-3.4)} L${X(2.2)},${Y(-6.4)} L${X(3.6)},${Y(-6)} L${X(3.4)},${Y(-2.8)} Z" fill="${body}"/>`
    + dot(x + d * 2.8 * s, y - 6.6 * s, 2 * s, body)
    + `<path d="M${X(4.4)},${Y(-6.8)} l${f2(d * 2.6 * s)},${f2(0.6 * s)} l${f2(-d * 2.6 * s)},${f2(0.8 * s)} Z" fill="#F08A3A"/>`
    + dot(x + d * 3.4 * s, y - 7.2 * s, 0.5 * s, '#2A2420');
}
const canards = {
  layers: [{
    at: [0.78, 0.74],
    frame: [-26, -28, 52, 34],
    n: 12,
    fps: 2,
    draw: (T, level, f, n) => {
      const [x, y] = T.p(0, 0, 0);
      const reed = (dx, dy, k) => ln([x + dx, y + dy], [x + dx + (k % 2 ? 0.8 : -0.6), y + dy - 9 - (k % 2) * 2], '#6FA35A', 0.8) + ell(x + dx + (k % 2 ? 0.8 : -0.6), y + dy - 8 - (k % 2) * 2, 0.9, 2.2, '#8B5631');
      const swimmers = [[0, 1.1, true], [0.8, 0.6, false], [1.4, 0.6, false]].map(([lag, s, adult]) => {
        const a = (f / n) * Math.PI * 2 - lag;
        return { y: y - 0.6 + Math.sin(a) * 3, svg: duck(x + Math.cos(a) * 8, y - 0.6 + Math.sin(a) * 3, s, Math.sin(a) > 0, adult) };
      }).sort((p, q) => p.y - q.y).map(p => p.svg).join('');
      return ell(x, y + 0.6, 16, 7.4, '#79BE5C') + ell(x, y, 14, 6.2, '#5AAED7') + ell(x - 3.6, y - 2, 6, 1.8, 'rgba(255,255,255,.3)')
        + reed(-10, -3, 0) + reed(-8, -4.6, 1) + reed(8.6, -4.2, 2) + reed(10.8, -2.8, 3)
        + swimmers
        + T.pebble(0.22, 0.1, 1.8) + T.pebble(-0.16, 0.2, 1.6)
        + [[-12, 4], [11, 4.4]].map(([dx, dy]) => `<path d="M${f2(x + dx - 2)},${f2(y + dy)} q1,-3 2,-1 q1,-3 2,1 Z" fill="#6DB64C"/>`).join('');
    }
  }]
};
// Statue de la naïade : sur son socle, elle verse l'eau de son urne dans une vasque ; elle luit la nuit (palier VII)
const NAIAD_AT = [-0.9, 0.1];
const MARBLE = { top: '#FFFFFF', left: '#ECEAF2', right: '#C3BFD0' };
const naiade = {
  light: () => [NAIAD_AT[0], NAIAD_AT[1], 14, 22, '170,225,255'],
  layers: [{
    at: NAIAD_AT,
    frame: [-22, -60, 44, 66],
    n: 8,
    fps: 6,
    draw: (T, level, f) => {
      const [wx, wy] = T.p(0, 0, 6);
      const [x, y] = T.p(0, 0, 17);
      const marble = T.id('marble');
      const [ux, uy] = [x - 5.4, y - 14.6];
      const ripple = (f % 4) / 4;
      return T.shadow(0, 0, 0.24, 0.22)
        + T.cyl(0, 0, 0, 6, 0.22, MARBLE, 'basin') + T.disc(0, 0, 6, 0.19, '#7CC8EC') + ell(wx - 3, wy - 1, 4, 1, 'rgba(255,255,255,.45)')
        + T.box(-0.06, -0.06, 0.06, 0.06, 6, 17, MARBLE)
        + gradient(marble, '#FFFFFF', '#C9C5D6')
        // Robe drapée, buste, bras, tête et chignon
        + `<path d="M${f2(x - 3.6)},${f2(y - 13)} L${f2(x + 3.4)},${f2(y - 13)} Q${f2(x + 5.4)},${f2(y - 5)} ${f2(x + 5.2)},${f2(y)} L${f2(x - 5)},${f2(y)} Q${f2(x - 5.4)},${f2(y - 6)} ${f2(x - 3.6)},${f2(y - 13)} Z" fill="url(#${marble})" stroke="rgba(90,80,110,.35)" stroke-width="0.5"/>`
        + [-2, 0.6, 3].map(dx => `<path d="M${f2(x + dx * 0.6)},${f2(y - 12)} q${f2(dx * 0.3)},6 ${f2(dx * 0.8)},11.6" stroke="rgba(120,110,140,.3)" stroke-width="0.5" fill="none"/>`).join('')
        + `<path d="M${f2(x - 3)},${f2(y - 20)} L${f2(x + 3)},${f2(y - 20)} L${f2(x + 3.4)},${f2(y - 13)} L${f2(x - 3.6)},${f2(y - 13)} Z" fill="url(#${marble})" stroke="rgba(90,80,110,.35)" stroke-width="0.5"/>`
        + `<path d="M${f2(x + 2.8)},${f2(y - 19.4)} q2.6,3 0.6,6.6" stroke="#E4E1EC" stroke-width="1.6" fill="none" stroke-linecap="round"/>`
        + dot(x, y - 23, 2.7, '#F4F2F8') + dot(x + 1.6, y - 24.6, 1.6, '#E4E1EC') + `<path d="M${f2(x + 2)},${f2(y - 23)} q1.4,3 0.4,5" stroke="#DAD6E4" stroke-width="1" fill="none"/>`
        + `<path d="M${f2(x - 2.6)},${f2(y - 19.4)} q-2.8,1.6 -2.4,4.6" stroke="#E4E1EC" stroke-width="1.6" fill="none" stroke-linecap="round"/>`
        // Urne inclinée et son filet d'eau qui tombe dans la vasque
        + `<g transform="rotate(-38 ${f2(ux)} ${f2(uy)})">${ell(ux, uy, 2.6, 3.2, '#E4E1EC', ' stroke="rgba(90,80,110,.4)" stroke-width="0.5"')}<rect x="${f2(ux - 1.3)}" y="${f2(uy - 4.8)}" width="2.6" height="1.8" fill="#DAD6E4"/></g>`
        + `<path d="M${f2(ux - 3.6)},${f2(uy - 2)} Q${f2(ux - 6)},${f2(uy + 2)} ${f2(ux - 5.4)},${f2(wy - 1)}" stroke="rgba(170,225,255,.45)" stroke-width="3" fill="none"/>`
        + `<path d="M${f2(ux - 3.6)},${f2(uy - 2)} Q${f2(ux - 6)},${f2(uy + 2)} ${f2(ux - 5.4)},${f2(wy - 1)}" stroke="#E8F7FF" stroke-width="1.2" fill="none" stroke-dasharray="2.2 1.4" stroke-dashoffset="${f2(-f * 0.9)}"/>`
        + ell(ux - 5.4, wy - 0.6, 1.6 + ripple * 4, 0.6 + ripple * 1.4, 'none', ` stroke="rgba(255,255,255,${f2(0.85 - ripple * 0.75)})" stroke-width="0.6"`);
    }
  }]
};

/* ---------- Ponton ---------- */
// Canne dans son support au bord du ponton, la ligne et le bouchon dans l'eau ; seau de poissons à côté.
// Niveau 1 : bord avant de l'appontement ; niveau 2 : bout de la jetée en L, la ligne dans l'eau à sa droite.
const CANNE = {
  1: { at: [0.62, 0.2], tip: [0.08, 0.26, 34], bob: [-0.02, 0.28], pail: [0.12, -0.1] },
  2: { at: [0.73, 0.45], tip: [0.13, -0.07, 28], bob: [0.09, -0.13], pail: [-0.1, 0.16] }
};
const canne = {
  layers: [{
    at: { 1: CANNE[1].at, 2: CANNE[2].at },
    frame: [-26, -40, 42, 54],
    n: 8,
    fps: 4,
    draw: (T, level, f, n) => {
      const c = CANNE[Math.min(level, 2)];
      const [bx, by] = T.p(0, 0, 10);
      const [tx, ty] = T.p(...c.tip);
      const dip = f === 5 || f === 6 ? 1.8 : wave(f, n, 0.5);
      const [ox, oy] = T.p(c.bob[0], c.bob[1], 0);
      const ripple = (f % 4) / 4;
      const [px, py] = T.p(c.pail[0], c.pail[1], 10);
      return ell(ox, oy + 0.6, 3 + ripple * 5, 1.1 + ripple * 1.8, 'none', ` stroke="rgba(255,255,255,${f2(0.8 - ripple * 0.7)})" stroke-width="0.7"`)
        + `<path d="M${f2(tx)},${f2(ty)} Q${f2((tx + ox) / 2 + 2)},${f2((ty + oy) / 2 + 2)} ${f2(ox)},${f2(oy - 1 + dip)}" stroke="rgba(255,255,255,.8)" stroke-width="0.5" fill="none"/>`
        + dot(ox, oy - 1.4 + dip, 1.9, '#E2463A') + `<path d="M${f2(ox - 1.9)},${f2(oy - 1.4 + dip)} a1.9,1.9 0 0 0 3.8,0 Z" fill="#FFFDF8"/>`
        + ln([ox, oy - 3.2 + dip], [ox, oy - 4.8 + dip], '#3D3A36', 0.6)
        // Seau de poissons : une queue qui frétille
        + bucket(T, c.pail[0], c.pail[1], 10, 6, 3.4, 4.2, PAIL, 'pail', false)
        + `<path d="M${f2(px - 1)},${f2(py - 6.4)} l${f2(-2.4 + (f % 2) * 1.2)},-3.4 l2.6,0.8 Z" fill="#9FB8C8"/>`
        + ell(px + 1, py - 6.2, 2, 0.9, '#C7D6E0')
        // Support et canne
        + T.box(-0.02, -0.02, 0.02, 0.02, 10, 15, WOOD_DARK)
        + `<path d="M${f2(bx)},${f2(by - 3)} Q${f2((bx + tx) / 2 - 1.5)},${f2((by + ty) / 2 - 3)} ${f2(tx)},${f2(ty)}" stroke="${WOOD_DARK.right}" stroke-width="1.4" fill="none" stroke-linecap="round"/>`
        + dot(bx + (tx - bx) * 0.18, by - 3 + (ty - by) * 0.16, 1.4, '#3D3A36');
    }
  }]
};
const filet = {
  layers: [{
    at: { 1: [0.34, -0.06], 2: [0.6, -0.04] },
    frame: [-18, -24, 36, 28],
    draw: T => {
      const [x, y] = T.p(0, 0, 10);
      const heap = `M${f2(x - 11)},${f2(y + 1)} Q${f2(x - 10)},${f2(y - 6)} ${f2(x - 4)},${f2(y - 7)} Q${f2(x + 1)},${f2(y - 11)} ${f2(x + 6)},${f2(y - 6)} Q${f2(x + 11)},${f2(y - 4)} ${f2(x + 10)},${f2(y + 1.5)} Q${f2(x)},${f2(y + 4.5)} ${f2(x - 11)},${f2(y + 1)} Z`;
      let mesh = '';
      for (let k = -14; k <= 14; k += 2.6) mesh += ln([x + k - 6, y + 4], [x + k + 4, y - 11], 'rgba(120,85,45,.55)', 0.5) + ln([x + k + 6, y + 4], [x + k - 4, y - 11], 'rgba(120,85,45,.55)', 0.5);
      const floats = [[-9, 0], [-4, 2.6], [2, 3], [8, 0.6]].map(([dx, dy], k) => ell(x + dx, y + dy, 2, 1.4, k % 2 ? '#FFFDF8' : '#F08A3A', ` stroke="${OUT}" stroke-width="0.5"`)).join('');
      return ell(x + 1, y + 2.6, 12, 3, 'rgba(40,30,20,.22)')
        + `<defs><clipPath id="${T.id('net')}"><path d="${heap}"/></clipPath></defs>`
        + `<path d="${heap}" fill="#D9BC8C" stroke="#A88350" stroke-width="0.8"/>`
        + `<g clip-path="url(#${T.id('net')})">${mesh}<path d="M${f2(x - 8)},${f2(y - 1)} q7,-4 15,0" stroke="rgba(255,255,255,.35)" stroke-width="1.6" fill="none"/></g>`
        + `<path d="M${f2(x - 1)},${f2(y - 5.4)} q3,-2 6,0 q-3,2 -6,0 Z M${f2(x + 5)},${f2(y - 5.4)} l2,-1.6 l0,3.2 Z" fill="#B8CCD8"/>` + dot(x + 0.6, y - 5.6, 0.4, '#2A2420')
        + floats;
    }
  }]
};
// Casier à crabes en lattes sur le sable, bouée et cordage ; un crabe trottine de côté
const casier = {
  layers: [{
    at: [-0.84, 0.46],
    frame: [-18, -24, 40, 30],
    draw: T => {
      const slatL = [-0.07, -0.025, 0.02, 0.065].map(du => T.face([[du, 0.08, 0], [du + 0.022, 0.08, 0], [du + 0.022, 0.08, 12], [du, 0.08, 12]], WOOD.top, EDGE)).join('');
      const slatR = [-0.05, 0, 0.05].map(dv => T.face([[0.1, dv, 0], [0.1, dv + 0.022, 0], [0.1, dv + 0.022, 12], [0.1, dv, 12]], WOOD.left, EDGE)).join('');
      const [bx, by] = T.p(0.2, 0.16, 0);
      const [rx, ry] = T.p(0.1, 0.06, 6);
      return T.shadow(0, 0, 0.14, 0.2)
        + T.box(-0.1, -0.08, 0.1, 0.08, 0, 12, { top: 'rgba(58,42,30,.85)', left: 'rgba(58,42,30,.85)', right: 'rgba(40,28,20,.85)' }, '')
        + T.face([[-0.03, 0.08, 3], [0.04, 0.08, 3], [0.04, 0.08, 9], [-0.03, 0.08, 9]], 'rgba(200,170,120,.5)')
        + slatL + slatR
        + T.box(-0.1, -0.08, 0.1, 0.08, 11, 12.5, WOOD)
        + [-0.04, 0.03].map(du => T.face([[du, -0.08, 12.5], [du + 0.025, -0.08, 12.5], [du + 0.025, 0.08, 12.5], [du, 0.08, 12.5]], WOOD_DARK.top)).join('')
        + `<path d="M${f2(rx)},${f2(ry)} Q${f2(bx - 4)},${f2(by - 1)} ${f2(bx - 2)},${f2(by - 1)}" stroke="#C9A16A" stroke-width="0.9" fill="none"/>`
        + ell(bx, by - 1.6, 3.4, 2.4, '#E2463A', ` stroke="${OUT}" stroke-width="0.5"`) + `<path d="M${f2(bx - 3.4)},${f2(by - 1.6)} h6.8" stroke="#FFFDF8" stroke-width="1.4"/>`;
    }
  }, {
    at: [-0.66, 0.84],
    frame: [-10, -12, 20, 15],
    n: 4,
    fps: 7,
    motion: t => [0, Math.sin(t * 0.7) * 0.1, 0],
    draw: (T, level, f) => {
      const [x, y] = T.p(0, 0, 0);
      const claw = f % 2 ? 1.2 : 0;
      const legs = [-1, 1].map(s => [0, 1, 2].map(k => ln([x + s * 2.4, y - 2.6 + k * 0.9], [x + s * (5.4 + ((f + k) % 2) * 0.8), y - 0.6 + k * 0.8], '#C2412E', 0.7)).join('')).join('');
      return ell(x, y + 0.2, 5, 1.3, 'rgba(40,30,20,.25)') + legs
        + ell(x, y - 3.6, 4.4, 2.8, '#E2573F', ' stroke="rgba(120,30,20,.5)" stroke-width="0.5"') + ell(x - 1.2, y - 4.6, 1.6, 0.8, '#F28A72')
        + [-1, 1].map(s => `<path d="M${f2(x + s * 3.6)},${f2(y - 4.6)} q${s * 1.6},${f2(-1.6 - claw)} ${s * 2.6},${f2(-2.4 - claw)}" stroke="#E2573F" stroke-width="1.2" fill="none"/><path d="M${f2(x + s * 6.2)},${f2(y - 7 - claw)} l${s * 1.2},-1.4 l${s * 0.4},1.6 l${-s * 0.8},0.2 Z" fill="#E2573F"/>`).join('')
        + ln([x - 1.2, y - 6], [x - 1.4, y - 7.8], '#2A2420', 0.5) + ln([x + 1.2, y - 6], [x + 1.4, y - 7.8], '#2A2420', 0.5)
        + dot(x - 1.4, y - 8, 0.6, '#1E1A17') + dot(x + 1.4, y - 8, 0.6, '#1E1A17');
    }
  }]
};
// Barque du pêcheur, derrière le grand ponton : il rame doucement d'un bout à l'autre de l'anse
const barque = {
  layers: [{
    at: [0.46, -0.62],
    frame: [-26, -30, 52, 38],
    back: true,
    n: 8,
    fps: 5,
    motion: t => [Math.sin(t * 0.22) * 0.05 - 0.01, 0, Math.sin(t * 1.3) * 0.8],
    draw: (T, level, f, n) => {
      const rim = [T.p(0.21, 0, 4), T.p(0.09, 0.1, 4), T.p(-0.1, 0.1, 4), T.p(-0.19, 0, 4.6), T.p(-0.1, -0.1, 4), T.p(0.09, -0.1, 4)];
      const side = [T.p(0.21, 0, 4), T.p(0.09, 0.1, 4), T.p(-0.1, 0.1, 4), T.p(-0.19, 0, 4.6), T.p(-0.16, 0, 0), T.p(-0.08, 0.07, 0), T.p(0.06, 0.07, 0), T.p(0.18, 0, 0.4)];
      const phase = (f / n) * Math.PI * 2;
      const oar = s => {
        const lock = T.p(0, 0.1 * s, 6);
        const lift = Math.sin(phase) > 0 ? 3 : 0;
        const blade = T.p(Math.cos(phase) * 0.09, 0.27 * s, lift);
        return ln(lock, blade, WOOD_DARK.right, 1.2) + ell(blade[0], blade[1], 2.6, 1, WOOD.left, ` transform="rotate(-26 ${f2(blade[0])} ${f2(blade[1])})"`)
          + (lift ? '' : ell(blade[0], blade[1] + 1.4, 3.6, 1.1, 'none', ' stroke="rgba(255,255,255,.7)" stroke-width="0.6"'));
      };
      const [rx, ry] = T.p(-0.03, 0, 6);
      const lean = Math.cos(phase) * 1.2;
      return ell(...T.p(0.01, 0.01, 0), 15, 3.4, 'rgba(30,70,110,.25)')
        + oar(-1)
        + poly(rim, WOOD_DARK.top, ` stroke="${OUT}" stroke-width="0.7"`)
        + T.face([[-0.02, -0.1, 4], [0.03, -0.1, 4], [0.03, 0.1, 4], [-0.02, 0.1, 4]], WOOD.top)
        // Rameur : chemise, bras vers les rames, chapeau de paille à ruban
        + `<path d="M${f2(rx - 3.2 + lean)},${f2(ry - 1)} L${f2(rx + 3.2 + lean)},${f2(ry - 1)} L${f2(rx + 2.6 + lean)},${f2(ry - 9)} L${f2(rx - 2.6 + lean)},${f2(ry - 9)} Z" fill="#5C83C2"/>`
        + ln([rx - 2.4 + lean, ry - 7.4], [rx - 6 + lean * 2, ry - 3.6], '#F1C9A5', 1.2) + ln([rx + 2.4 + lean, ry - 7.4], [rx + 6 + lean * 2, ry - 3.6], '#F1C9A5', 1.2)
        + dot(rx + lean, ry - 11.2, 2.6, '#F1C9A5')
        + ell(rx + lean, ry - 12.6, 5, 1.4, '#E9BF4E') + `<path d="M${f2(rx - 2.6 + lean)},${f2(ry - 12.8)} q2.6,-3.4 5.2,0 Z" fill="#E9BF4E"/>` + ln([rx - 2.6 + lean, ry - 12.9], [rx + 2.6 + lean, ry - 12.9], '#C8504A', 0.8)
        + poly(side, WOOD.left, ` stroke="${OUT}" stroke-width="0.7"`)
        + `<polyline points="${[T.p(0.19, 0, 2.4), T.p(0.08, 0.085, 2.2), T.p(-0.09, 0.085, 2.2), T.p(-0.18, 0, 2.6)].map(xy).join(' ')}" fill="none" stroke="rgba(60,40,25,.35)" stroke-width="0.6"/>`
        + oar(1);
    }
  }]
};
// Râtelier à harpon : le harpon barbelé couché sur ses deux fourches, cordage lové et flotteur de liège (palier V)
const harpon = {
  layers: [{
    at: [0.5, -0.92],
    frame: [-26, -30, 52, 36],
    draw: T => {
      const post = du => T.box(du - 0.016, -0.016, du + 0.016, 0.016, 0, 14, WOOD_DARK) + ln(T.p(du, 0, 14), T.p(du - 0.03, 0, 17.4), WOOD_DARK.right, 1.2) + ln(T.p(du, 0, 14), T.p(du + 0.03, 0, 17.4), WOOD_DARK.right, 1.2);
      const tip = T.p(0.32, 0, 15.6);
      const neck = T.p(0.22, 0, 15.2);
      const [cx, cy] = T.p(-0.14, 0.15, 0);
      const [fx, fy] = T.p(0.12, 0.14, 0);
      const [ex, ey] = T.p(-0.3, 0, 15.6);
      return T.shadow(0, 0.04, 0.26, 0.16)
        + post(-0.15) + post(0.13)
        + ln(T.p(-0.3, 0, 15.6), neck, WOOD.right, 1.6) + ln(T.p(-0.3, 0, 16.2), neck, WOOD.top, 0.5)
        + poly([T.p(0.22, 0, 16.4), tip, T.p(0.22, 0, 14)], IRON.left, ` stroke="${IRON.right}" stroke-width="0.5"`)
        + ln(T.p(0.25, 0, 15.4), T.p(0.2, 0, 19), IRON.right, 1) + ln(T.p(0.25, 0, 15.2), T.p(0.21, 0, 12), IRON.right, 1)
        + `<path d="M${f2(ex)},${f2(ey)} C${f2(ex - 4)},${f2(ey + 5)} ${f2(cx - 7)},${f2(cy - 5)} ${f2(cx - 3)},${f2(cy - 2)}" stroke="#C9A16A" stroke-width="0.9" fill="none"/>`
        + [0, 1, 2].map(k => ell(cx, cy - k * 1.3, 5 - k * 0.6, 2 - k * 0.2, 'none', ' stroke="#C9A16A" stroke-width="1.3"')).join('')
        + ell(fx, fy - 2, 3, 2.2, '#D9A877', ` stroke="${OUT}" stroke-width="0.5"`) + ell(fx, fy - 2.6, 2, 1.1, '#E7C08A');
    }
  }]
};
// Pélican sur sa bitte d'amarrage : il gonfle sa poche, avale un poisson, s'étire (palier VI)
const pelican = {
  layers: [{
    at: [0.92, -0.12],
    frame: [-22, -48, 40, 54],
    n: 8,
    fps: 3,
    draw: (T, level, f) => {
      const [x, y] = T.p(0, 0, 0);
      const [px, py] = T.p(0, 0, 14);
      const up = f === 2 || f === 3;
      const pouch = f === 4 || f === 5 ? 1 : 0;
      const stretch = f === 6;
      const hx = px - 3.6;
      const hy = py - 17 - (up ? 2 : 0);
      const tipX = up ? hx - 2 : hx - 10;
      const tipY = up ? hy - 9 : hy + 3;
      const ripple = (f % 4) / 4;
      return ell(x, y + 0.4, 5 + ripple * 4, 1.6 + ripple * 1.2, 'none', ` stroke="rgba(255,255,255,${f2(0.8 - ripple * 0.7)})" stroke-width="0.6"`)
        + T.cyl(0, 0, 0, 14, 0.06, WOOD, 'post') + ell(...T.p(0, 0, 9), 3.6, 1.6, 'none', ' stroke="#C9A16A" stroke-width="1.2"')
        + ln([px - 1.6, py - 3], [px - 1.8, py], '#E8A13A', 1) + ln([px + 1, py - 3], [px + 1.2, py], '#E8A13A', 1)
        + `<path d="M${f2(px + 4)},${f2(py - 6)} l4,1.4 l-3.4,1.6 Z" fill="#D9D4CA"/>`
        + (stretch ? `<path d="M${f2(px + 1)},${f2(py - 9)} q5,-9 11,-8 q-3,3 -4,7 Z" fill="#E9E4DA" stroke="rgba(60,40,25,.3)" stroke-width="0.5"/><path d="M${f2(px + 10)},${f2(py - 16.6)} q1.4,-0.4 2,0.6 l-2.6,1.8 Z" fill="#3D3A36"/>` : '')
        + ell(px - 0.4, py - 6.4, 6.4, 4.6, '#F4F1EA', ' stroke="rgba(60,40,25,.3)" stroke-width="0.5"')
        + ell(px + 0.6, py - 6.6, 4.8, 2.8, '#DEDAD0') + `<path d="M${f2(px + 3.6)},${f2(py - 5.4)} l2.4,0.6 l-2.2,1.2 Z" fill="#3D3A36"/>`
        + `<path d="M${f2(px - 4)},${f2(py - 9)} Q${f2(px - 7)},${f2(py - 13)} ${f2(hx + 0.4)},${f2(hy + 1.6)}" stroke="#F4F1EA" stroke-width="3.4" fill="none" stroke-linecap="round"/>`
        + dot(hx, hy, 2.8, '#F4F1EA') + `<path d="M${f2(hx + 0.6)},${f2(hy - 2.6)} q2.4,-1.6 3.4,0.4" stroke="#F2D35A" stroke-width="1" fill="none"/>`
        // Long bec et poche (gonflée quand il avale)
        + `<path d="M${f2(hx - 1.6)},${f2(hy + 0.6)} Q${f2((hx + tipX) / 2)},${f2((hy + tipY) / 2 + 3 + pouch * 4)} ${f2(tipX)},${f2(tipY + 0.6)} L${f2(tipX + 0.4)},${f2(tipY)} Z" fill="#F2B04A" stroke="#C88A20" stroke-width="0.5"/>`
        + ln([hx - 1.4, hy - 0.4], [tipX, tipY], '#E8A13A', 1.4)
        + (f === 2 ? `<path d="M${f2(tipX - 0.6)},${f2(tipY - 0.6)} l-2,-1.8 l0.6,2.6 Z" fill="#9FB8C8"/>` : '')
        + dot(hx - 0.6, hy - 0.8, 0.6, '#2A2420');
    }
  }]
};
// Sirène sur son rocher : elle peigne sa chevelure, sa queue bat l'eau, sa perle luit la nuit (palier VII)
const SIREN_AT = [-0.1, 0.94];
const sirene = {
  light: () => [SIREN_AT[0], SIREN_AT[1], 14, 18, '200,240,255'],
  layers: [{
    at: SIREN_AT,
    frame: [-26, -44, 52, 50],
    n: 8,
    fps: 4,
    draw: (T, level, f, n) => {
      const [x, y] = T.p(0, 0, 0);
      const ripple = (f % 4) / 4;
      const flick = f === 2 || f === 3 ? -2.4 : 0;
      const sway = wave(f, n, 1);
      const mx = x - 1;
      const my = y - 12;
      const hair = '#E2573F';
      const tail = '#3FB5A5';
      return ell(x, y + 1, 15 + ripple * 4, 4.4 + ripple * 1.2, 'none', ` stroke="rgba(255,255,255,${f2(0.75 - ripple * 0.65)})" stroke-width="0.7"`)
        + ell(x + 1, y + 0.6, 13, 3.6, 'rgba(30,70,110,.25)')
        + stone(x - 2, y - 4, 10.6, STONE) + stone(x + 7, y - 1.4, 5.4, STONE)
        + `<path d="M${f2(x - 9)},${f2(y - 1)} q-1,-4 1,-7 M${f2(x - 7)},${f2(y)} q1,-3 -0.4,-6" stroke="#4E9A5A" stroke-width="1" fill="none"/>`
        // Chevelure dans le dos
        + `<path d="M${f2(mx - 3)},${f2(my - 16)} Q${f2(mx - 7 + sway)},${f2(my - 9)} ${f2(mx - 5.6 + sway)},${f2(my - 2)} L${f2(mx - 2)},${f2(my - 3)} Q${f2(mx - 3)},${f2(my - 10)} ${f2(mx + 1)},${f2(my - 15)} Z" fill="${hair}"/>`
        // Queue : des hanches au bord du rocher, nageoire qui bat
        + `<path d="M${f2(mx - 3.4)},${f2(my - 4)} Q${f2(mx + 6)},${f2(my - 3)} ${f2(mx + 8)},${f2(my + 4)} Q${f2(mx + 9.6)},${f2(my + 9)} ${f2(mx + 12)},${f2(my + 10 + flick)} L${f2(mx + 10)},${f2(my + 11 + flick * 0.5)} Q${f2(mx + 6)},${f2(my + 8)} ${f2(mx + 4.6)},${f2(my + 3)} Q${f2(mx + 3)},${f2(my)} ${f2(mx - 3)},${f2(my + 0.4)} Z" fill="${tail}" stroke="#23806F" stroke-width="0.5"/>`
        + [[1, -1.4], [3.6, -0.6], [6, 1.4]].map(([dx, dy]) => `<path d="M${f2(mx + dx - 1)},${f2(my + dy)} q1,-1 2,0" stroke="#7FDCCB" stroke-width="0.5" fill="none"/>`).join('')
        + `<path d="M${f2(mx + 12)},${f2(my + 10 + flick)} q3,-3 4.6,-1.6 q-1.6,2.4 -1.4,4.2 q-2,-0.4 -3.2,-2.6 Z" fill="#5FD0BE" stroke="#23806F" stroke-width="0.5"/>`
        + (flick ? [[15, 2], [17, 5], [13, 6]].map(([dx, dy]) => dot(mx + dx, my + dy, 0.7, 'rgba(220,245,255,.9)')).join('') : '')
        // Buste, coquillages, bras qui peigne, perle
        + `<path d="M${f2(mx - 3.4)},${f2(my - 4)} L${f2(mx - 2.6)},${f2(my - 12)} L${f2(mx + 2.6)},${f2(my - 12)} L${f2(mx + 2.4)},${f2(my - 3.6)} Z" fill="#F6CFAE" stroke="rgba(120,70,40,.3)" stroke-width="0.5"/>`
        + ell(mx - 1.2, my - 9.6, 1.4, 1.1, '#F28AA8') + ell(mx + 1.4, my - 9.6, 1.4, 1.1, '#F28AA8')
        + `<path d="M${f2(mx + 2.4)},${f2(my - 11.4)} q3,-1 3.4,-5" stroke="#F6CFAE" stroke-width="1.4" fill="none" stroke-linecap="round"/>`
        + `<rect x="${f2(mx + 4.2 + sway * 0.4)}" y="${f2(my - 19)}" width="3" height="1.4" rx="0.4" fill="#F2C04B" transform="rotate(-20 ${f2(mx + 5.7)} ${f2(my - 18.3)})"/>`
        + `<path d="M${f2(mx - 2.4)},${f2(my - 11)} q-2.6,3 -1,5.6" stroke="#F6CFAE" stroke-width="1.4" fill="none" stroke-linecap="round"/>`
        + dot(mx - 3.2, my - 5, 1.6, '#FFFFFF') + dot(mx - 3.6, my - 5.5, 0.5, '#E8F7FF')
        + dot(mx, my - 15, 2.6, '#F6CFAE')
        + `<path d="M${f2(mx - 2.8)},${f2(my - 15)} Q${f2(mx - 2)},${f2(my - 19.4)} ${f2(mx + 2.8)},${f2(my - 16.4)} Q${f2(mx + 4.4)},${f2(my - 13)} ${f2(mx + 3.6 + sway)},${f2(my - 9)}" stroke="${hair}" stroke-width="2" fill="none" stroke-linecap="round"/>`
        + `<path d="M${f2(mx - 1.4)},${f2(my - 15.4)} q0.6,0.5 1.2,0" stroke="#5E3A22" stroke-width="0.5" fill="none"/>` + dot(mx - 0.4, my - 13.4, 0.4, '#E07A7A');
    }
  }]
};

/* ---------- Atelier ---------- */
const etabli = {
  layers: [{
    at: [0.82, -0.78],
    frame: [-26, -32, 52, 38],
    draw: T => {
      const legs = [[-0.14, -0.065], [0.14, -0.065], [-0.14, 0.065], [0.14, 0.065]].map(([a, b]) => T.box(a - 0.016, b - 0.016, a + 0.016, b + 0.016, 0, 11, WOOD_DARK)).join('');
      const [x, y] = T.p(0, 0, 14);
      const curl = (dx, dy, w) => `<path d="M${f2(x + dx)},${f2(y + dy - 1)} a1.2,1 0 1 1 1.2,1" stroke="#E7C08A" stroke-width="${w}" fill="none"/>`;
      return T.shadow(0, 0, 0.22, 0.18) + legs
        + T.box(-0.13, -0.05, 0.13, 0.05, 3, 4.5, WOOD_DARK)
        + T.box(-0.1, -0.035, 0.06, 0.035, 4.5, 7, { top: '#F1D3A1', left: '#D9B07A', right: '#B98552' })
        + T.box(-0.17, -0.08, 0.17, 0.08, 11, 14, { top: '#EBC08A', left: WOOD.left, right: WOOD.right })
        // Étau au bout, rabot, marteau, copeaux
        + T.box(0.13, 0.05, 0.19, 0.1, 9, 15.5, DARK_IRON) + ln(T.p(0.16, 0.1, 12), T.p(0.16, 0.18, 12), IRON.top, 0.9)
        + T.box(-0.08, -0.03, 0, 0.01, 14, 16.5, WOOD) + T.face([[-0.05, -0.03, 16.5], [-0.035, -0.03, 16.5], [-0.035, 0.01, 18], [-0.05, 0.01, 18]], IRON.right)
        + ln([x + 2, y - 0.6], [x + 9, y - 3.6], WOOD.right, 1.3) + `<rect x="${f2(x + 1)}" y="${f2(y - 2.6)}" width="3.6" height="2.2" rx="0.4" fill="${DARK_IRON.left}" transform="rotate(-22 ${f2(x + 2.8)} ${f2(y - 1.5)})"/>`
        + curl(-8, 1, 0.6) + curl(-5, 3, 0.6) + curl(4, 2.2, 0.6) + curl(-10, 15, 0.7) + curl(6, 16, 0.7) + curl(11, 14, 0.7);
    }
  }]
};
// Grande enclume à bigorne sur un billot, marteau ; une pièce encore rouge luit et fume
const ENCLUME = { 1: [-0.72, 0.76], 2: [-0.04, 0.86] };
const enclume = {
  light: level => { const [u, v] = ENCLUME[Math.min(level, 2)]; return [u - 0.02, v, 18, 12]; },
  layers: [{
    at: ENCLUME,
    frame: [-18, -28, 38, 34],
    draw: T => {
      const steel = { top: '#9AA6B2', left: '#6E7A86', right: '#4F5A64' };
      const [hx, hy] = T.p(-0.13, 0.11, 0);
      const [bx, by] = T.p(0, 0.12, 0);
      return T.shadow(0, 0, 0.17, 0.2)
        + T.cyl(0, 0, 0, 9, 0.12, STUMP, 'stump')
        + [-4, -1, 2, 5].map(dx => ln([bx + dx, by - 1], [bx + dx * 0.95, by - 8], 'rgba(60,40,25,.25)', 0.6)).join('')
        + T.box(-0.07, -0.05, 0.07, 0.05, 9, 11, DARK_IRON)
        + T.box(-0.035, -0.03, 0.035, 0.03, 11, 15, DARK_IRON)
        + T.box(-0.11, -0.05, 0.08, 0.05, 15, 18.5, steel)
        + T.face([[0.08, 0.05, 15], [0.18, 0, 17.4], [0.08, 0.05, 18.5]], steel.left, EDGE)
        + T.face([[0.08, -0.05, 18.5], [0.18, 0, 17.6], [0.08, 0.05, 18.5]], steel.top, EDGE)
        + T.face([[0.08, -0.05, 15], [0.18, 0, 17.4], [0.08, -0.05, 18.5]], steel.right)
        + ln(T.p(-0.09, -0.02, 18.6), T.p(0.06, -0.02, 18.6), 'rgba(255,255,255,.55)', 0.7)
        + ln([hx, hy - 1], [hx + 3, hy - 12], WOOD.right, 1.5) + `<rect x="${f2(hx + 0.4)}" y="${f2(hy - 15)}" width="5.6" height="3" rx="0.6" fill="${DARK_IRON.left}" transform="rotate(16 ${f2(hx + 3)} ${f2(hy - 13.5)})"/>`;
    }
  }, {
    at: ENCLUME,
    frame: [-12, -30, 24, 20],
    n: 8,
    fps: 6,
    draw: (T, level, f, n) => {
      const [x, y] = T.p(-0.02, 0, 18.6);
      const heat = 0.75 + wave(f, n, 0.25);
      const spark = f === 0 || f === 1;
      const rot = ` transform="rotate(-8 ${f2(x)} ${f2(y)})"`;
      return `<rect x="${f2(x - 4.6)}" y="${f2(y - 1.6)}" width="9" height="2.2" rx="1" fill="#E2463A"${rot}/>`
        + `<rect x="${f2(x - 3.4)}" y="${f2(y - 1.3)}" width="6.4" height="1.2" rx="0.6" fill="#FFB347" opacity="${f2(heat)}"${rot}/>`
        + `<rect x="${f2(x - 2)}" y="${f2(y - 1.1)}" width="3.4" height="0.7" rx="0.35" fill="#FFF2B0" opacity="${f2(heat)}"${rot}/>`
        + `<path d="M${f2(x - 2)},${f2(y - 4)} q1.4,${f2(-2 - heat)} 0,-5 M${f2(x + 2)},${f2(y - 4)} q-1.4,${f2(-2 - heat)} 0,-5.4" stroke="rgba(255,255,255,${f2(0.18 * heat)})" stroke-width="1" fill="none"/>`
        + (spark ? [[-5, -6], [4, -8], [7, -4], [-2, -10]].map(([dx, dy], k) => dot(x + dx * (1 + f * 0.5), y + dy * (1 + f * 0.4), 0.9 - f * 0.3, k % 2 ? '#FFE07A' : '#F7A23B')).join('') : '');
    }
  }]
};
// Soufflet de forge contre le four : planches en poire, cuir plissé qui se gonfle et se vide, buse vers le foyer
const soufflet = {
  layers: [{
    at: [0.84, 0.5],
    frame: [-24, -30, 48, 40],
    n: 8,
    fps: 5,
    draw: (T, level, f, n) => {
      const open = 4 + wave(f, n, 3);
      const shape = [[0, -0.1], [0.055, -0.065], [0.085, 0.01], [0.075, 0.09], [0.03, 0.135], [-0.03, 0.135], [-0.075, 0.09], [-0.085, 0.01], [-0.055, -0.065]].map(([a, b]) => [a * 1.45, b * 1.45]);
      const z0 = 8;
      const lower = shape.map(([a, b]) => T.p(a, b, z0));
      const upper = shape.map(([a, b]) => T.p(a, b, z0 + open));
      // Cuir : bande entre le bord bas et le bord haut, sur le pourtour visible
      const vis = [1, 2, 3, 4, 5, 6, 7];
      const leather = [...vis.map(i => lower[i]), ...vis.slice().reverse().map(i => upper[i])];
      const pleats = vis.map(i => ln([lower[i][0], lower[i][1] - open * 0.5], [upper[i][0], upper[i][1] + open * 0.2], 'rgba(60,30,15,.45)', 0.5)).join('');
      const puff = f >= 1 && f <= 3;
      const [nx, ny] = T.p(0, -0.24, 8.5);
      const [cx, cy] = T.p(0, 0.04, z0 + open);
      return T.shadow(0, 0.02, 0.14, 0.2)
        + T.box(-0.08, 0.06, -0.05, 0.09, 0, z0, WOOD_DARK) + T.box(0.05, 0.06, 0.08, 0.09, 0, z0, WOOD_DARK) + T.box(-0.02, -0.1, 0.02, -0.07, 0, z0, WOOD_DARK)
        + poly(lower, WOOD_DARK.left)
        + poly(leather, '#8B5631', ' stroke="#5E3A22" stroke-width="0.5"') + pleats
        + poly(upper, WOOD.top, ` stroke="${OUT}" stroke-width="0.6"`)
        + dot(cx, cy, 1.1, '#5E3A22')
        + ln(T.p(-0.03, 0.19, z0 + open), T.p(-0.04, 0.27, z0 + open + 2), WOOD_DARK.right, 1.5) + ln(T.p(0.03, 0.19, z0 + open), T.p(0.04, 0.27, z0 + open + 2), WOOD_DARK.right, 1.5)
        + ln(T.p(0, -0.13, z0 + 0.8), [nx, ny], DARK_IRON.right, 2.4) + ln(T.p(0, -0.13, z0 + 1.4), [nx, ny - 0.6], DARK_IRON.top, 0.6)
        + (puff ? dot(nx - 2 - f, ny - 1.6 - f * 0.6, 1 + f * 0.5, `rgba(255,255,255,${f2(0.5 - f * 0.12)})`) + dot(nx - 1, ny - 2.4, 0.6, '#FFB347') : '');
    }
  }]
};
// Marteau-pilon : le mouton d'acier monte à la vapeur, retombe sur la pièce rouge, gerbe d'étincelles (palier V)
const LIFT = [0, 0.2, 0.45, 0.7, 0.9, 1, 1, 0.35];
const marteauPilon = {
  layers: [{
    at: [0.6, 0.92],
    frame: [-22, -46, 44, 52],
    n: 8,
    fps: 6,
    draw: (T, level, f) => {
      const zr = 10 + LIFT[f] * 9;
      const [ax, ay] = T.p(0, 0, 9.2);
      const [sx, sy] = T.p(0, 0, 38);
      const strike = f === 0;
      return T.shadow(0, 0, 0.2, 0.2)
        + T.box(-0.14, -0.13, 0.14, 0.13, 0, 3, STONE)
        + T.box(-0.035, -0.12, 0.035, -0.08, 3, 29, DARK_IRON)
        + T.box(-0.06, -0.05, 0.06, 0.05, 3, 7, DARK_IRON) + T.box(-0.045, -0.035, 0.045, 0.035, 7, 9, IRON)
        + `<rect x="${f2(ax - 3.4)}" y="${f2(ay - 1.4)}" width="6.8" height="1.8" rx="0.8" fill="${strike ? '#FFB347' : '#E2463A'}"/>`
        + T.box(-0.04, -0.04, 0.04, 0.04, zr, zr + 7, IRON)
        + ln(T.p(0, 0, zr + 7), T.p(0, 0, 29), IRON.top, 1.4)
        + T.box(-0.035, 0.08, 0.035, 0.12, 3, 29, DARK_IRON)
        + T.box(-0.05, -0.13, 0.05, 0.13, 29, 32, DARK_IRON)
        + T.cyl(0, 0, 32, 38, 0.06, COPPER, 'steam') + dot(sx, sy, 1.1, COPPER.right)
        + ln(T.p(0.04, -0.06, 36), T.p(0.04, -0.1, 22), COPPER.right, 1.1)
        + dot(...T.p(0, 0.12, 22), 1.8, '#F2EDE2') + ln(T.p(0, 0.12, 22), T.p(0.01, 0.12, 23.2), '#E2463A', 0.6)
        + (f >= 1 && f <= 4 ? [0, 1].map(k => dot(sx + 3 + k * 3 + f, sy - 2 - k * 3 - f, 1.6 + f * 0.5, `rgba(255,255,255,${f2(0.7 - f * 0.12)})`)).join('') : '')
        + (strike ? [[-7, -4], [6, -5], [-4, -8], [8, -1], [-9, 0]].map(([dx, dy], k) => dot(ax + dx, ay + dy, 0.9, k % 2 ? '#FFE07A' : '#F7A23B')).join('') : '');
    }
  }]
};
// Automate de laiton : il marche sur place en balançant les bras, sa clé tourne dans son dos, ses yeux clignent (palier VI)
const BRASS = { top: '#F6D27A', left: '#D9A84A', right: '#A87A2E' };
const automate = {
  layers: [{
    at: [-0.9, 0.86],
    frame: [-20, -44, 40, 50],
    n: 8,
    fps: 6,
    draw: (T, level, f, n) => {
      const step = wave(f, n, 1);
      const bob = Math.abs(step) * 0.8;
      const [hx, hy] = T.p(0, 0, 24.5 + bob);
      const [bx, by] = T.p(0, 0, 15 + bob);
      const turn = Math.cos((f / n) * Math.PI * 2);
      const [kx, ky] = T.p(-0.13, -0.13, 17 + bob);
      const blink = f === 5;
      const leg = (du, dv, lift) => T.box(du - 0.022, dv - 0.022, du + 0.022, dv + 0.022, lift, 9 + bob, DARK_IRON) + T.box(du - 0.03, dv - 0.03, du + 0.04, dv + 0.04, lift, lift + 2, BRASS);
      const arm = (sx, s) => `<g transform="rotate(${f2(step * 24 * s)} ${f2(sx)} ${f2(by - 4)})">${ln([sx, by - 4], [sx + s * 0.6, by + 3], DARK_IRON.left, 1.6)}${dot(sx + s * 0.6, by + 3.6, 1.4, BRASS.left)}</g>`;
      return T.shadow(0, 0, 0.12, 0.22)
        // Clé de remontage, dans le dos
        + ln(T.p(-0.06, -0.06, 17 + bob), [kx, ky], DARK_IRON.right, 1.2)
        + ell(kx - 2.4 * turn, ky - 1, 2.4 * Math.abs(turn) + 0.4, 1.8, BRASS.left, ` stroke="${BRASS.right}" stroke-width="0.5"`)
        + ell(kx + 2.4 * turn, ky - 1, 2.4 * Math.abs(turn) + 0.4, 1.8, BRASS.top, ` stroke="${BRASS.right}" stroke-width="0.5"`)
        + leg(-0.03, 0.03, Math.max(0, step) * 2) + leg(0.03, -0.03, Math.max(0, -step) * 2)
        + arm(bx - 5.6, -1)
        + T.cyl(0, 0, 9 + bob, 21 + bob, 0.08, BRASS, 'body')
        + [-3, 0, 3].map(dx => dot(bx + dx, by + 4.4, 0.5, BRASS.right)).join('')
        + dot(bx, by - 1, 2.2, '#F2EDE2') + ln([bx, by - 1], [bx + 1.2, by - 2], '#3D3A36', 0.5) + `<circle cx="${f2(bx)}" cy="${f2(by - 1)}" r="2.2" fill="none" stroke="${BRASS.right}" stroke-width="0.6"/>`
        + arm(bx + 5.6, 1)
        + T.cyl(0, 0, 21 + bob, 27 + bob, 0.055, BRASS, 'head')
        + ell(hx, hy - 2.6, 3.6, 1.8, BRASS.top)
        + ln([hx, hy - 3.6], [hx, hy - 8], DARK_IRON.right, 0.7) + dot(hx, hy - 8.4, 1.1, f % 4 < 2 ? '#7FE0FF' : '#E2463A')
        + (blink ? ln([hx - 2.4, hy + 1], [hx - 0.8, hy + 1], '#3D3A36', 0.7) + ln([hx + 0.8, hy + 1], [hx + 2.4, hy + 1], '#3D3A36', 0.7)
          : dot(hx - 1.6, hy + 1, 1.1, '#7FE0FF') + dot(hx + 1.6, hy + 1, 1.1, '#7FE0FF') + dot(hx - 1.9, hy + 0.7, 0.4, '#FFFFFF') + dot(hx + 1.3, hy + 0.7, 0.4, '#FFFFFF'))
        + ln([hx - 1.4, hy + 3.4], [hx + 1.4, hy + 3.4], BRASS.right, 0.6);
    }
  }]
};
// Athanor d'or : le four des alchimistes, dôme doré, alambic où bout l'or liquide ; il luit la nuit (palier VII)
const ATHANOR_AT = [-0.4, 0.94];
const GOLD = { top: '#FFE08A', left: '#F0B94A', right: '#C48A26' };
const athanor = {
  light: () => [ATHANOR_AT[0], ATHANOR_AT[1], 16, 24, '255,200,110'],
  layers: [{
    at: ATHANOR_AT,
    frame: [-26, -64, 52, 70],
    n: 8,
    fps: 5,
    draw: (T, level, f, n) => {
      const [x, y] = T.p(0, 0, 22);
      const [fx, fy] = T.p(0, 0, 9);
      const fire = 0.75 + wave(f, n, 0.25);
      const rx = 0.11 * TW * Math.SQRT1_2;
      const [gx, gy] = [x, y - 17];
      const [qx, qy] = T.p(0.24, 0.1, 0);
      const bubbles = [0, 1, 2].map(k => { const t = ((f / n) + k / 3) % 1; return dot(gx - 2 + k * 2, gy + 2 - t * 4, 0.6 + t * 0.4, `rgba(255,250,220,${f2(1 - t)})`); }).join('');
      return T.shadow(0, 0, 0.24, 0.22)
        + T.box(-0.14, -0.14, 0.14, 0.14, 0, 3, STONE)
        + T.cyl(0, 0, 3, 22, 0.11, GOLD, 'tower')
        + [8, 15].map(z => { const [lx, ly] = T.p(0, 0, z); return `<path d="M${f2(lx - rx)},${f2(ly)} A${f2(rx)},${f2(rx / 2)} 0 0 0 ${f2(lx + rx)},${f2(ly)}" stroke="${GOLD.right}" stroke-width="1" fill="none"/>`; }).join('')
        + `<path d="M${f2(fx - 3.4)},${f2(fy + 3.6)} L${f2(fx - 3.4)},${f2(fy - 1)} A3.4,3.6 0 0 1 ${f2(fx + 3.4)},${f2(fy - 1)} L${f2(fx + 3.4)},${f2(fy + 3.6)} Z" fill="#4A1E10" stroke="${GOLD.right}" stroke-width="0.8"/>`
        + ell(fx, fy + 2, 2.4, 2.6, '#F28A3A', ` opacity="${f2(fire)}"`) + ell(fx, fy + 2.6, 1.3, 1.6, '#FFE07A', ` opacity="${f2(fire)}"`)
        + gradient(T.id('dome'), GOLD.left, GOLD.right)
        + `<path d="M${f2(x - rx)},${f2(y)} C${f2(x - rx)},${f2(y - 11)} ${f2(x + rx)},${f2(y - 11)} ${f2(x + rx)},${f2(y)} A${f2(rx)},${f2(rx / 2)} 0 0 1 ${f2(x - rx)},${f2(y)} Z" fill="url(#${T.id('dome')})" stroke="${OUT}" stroke-width="0.6"/>`
        + `<path d="M${f2(x - rx * 0.6)},${f2(y - 5)} Q${f2(x - rx * 0.3)},${f2(y - 8)} ${f2(x)},${f2(y - 8.4)}" stroke="rgba(255,255,255,.6)" stroke-width="1" fill="none"/>`
        // Alambic : cucurbite de verre sur le dôme, col de cygne vers le récipient au sol
        + `<path d="M${f2(gx + 2)},${f2(gy - 4)} Q${f2(gx + 10)},${f2(gy - 12)} ${f2(qx + 1)},${f2(qy - 9)}" stroke="rgba(230,245,255,.8)" stroke-width="1.6" fill="none"/>`
        + `<path d="M${f2(gx + 2)},${f2(gy - 4)} Q${f2(gx + 10)},${f2(gy - 12)} ${f2(qx + 1)},${f2(qy - 9)}" stroke="rgba(120,150,180,.45)" stroke-width="0.4" fill="none"/>`
        + `<path d="M${f2(gx - 5)},${f2(gy + 1)} A5,5 0 0 0 ${f2(gx + 5)},${f2(gy + 1)} Z" fill="#FFC94A"/>` + bubbles
        + `<circle cx="${f2(gx)}" cy="${f2(gy)}" r="5" fill="rgba(220,240,255,.28)" stroke="rgba(255,255,255,.85)" stroke-width="0.7"/>`
        + `<rect x="${f2(gx - 1.2)}" y="${f2(gy - 8)}" width="2.4" height="3.4" fill="rgba(220,240,255,.4)" stroke="rgba(255,255,255,.85)" stroke-width="0.5"/>`
        + dot(gx - 2, gy - 2, 0.9, 'rgba(255,255,255,.8)')
        + ell(qx, qy - 3.4, 3.6, 3.6, 'rgba(220,240,255,.3)', ' stroke="rgba(255,255,255,.85)" stroke-width="0.6"') + `<path d="M${f2(qx - 3.4)},${f2(qy - 2.6)} A3.6,3.6 0 0 0 ${f2(qx + 3.4)},${f2(qy - 2.6)} Z" fill="#FFC94A"/>`
        + `<rect x="${f2(qx - 0.9)}" y="${f2(qy - 9.4)}" width="1.8" height="2.6" fill="rgba(220,240,255,.4)" stroke="rgba(255,255,255,.85)" stroke-width="0.5"/>`
        + (f % 4 === 1 ? dot(qx + 1, qy - 7 + (f >> 2) * 2, 0.6, '#FFC94A') : '')
        + star(gx + 7, gy - 3, 1.6, '#FFF2B0', Math.max(0, wave(f, n, 1))) + star(x - rx - 2, y - 2, 1.4, '#FFF2B0', Math.max(0, wave(f, n, 1, 3)));
    }
  }]
};

/* ---------- Foyer ---------- */
// Cuisine : four à pain de pierre et d'argile, bouche rougeoyante, pelle à enfourner, bûches ; il fume
const OVEN_AT = [-0.84, 0.8];
const OVEN_H = 13;
const cuisine = {
  light: () => [OVEN_AT[0] - 0.02, OVEN_AT[1] + 0.12, 10, 16],
  layers: [{
    at: OVEN_AT,
    frame: [-24, -38, 46, 46],
    draw: T => {
      const [x, y] = T.p(0, 0, 7);
      const rx = 7.6;
      const ry = 3.8;
      const log = (a, b, z) => T.box(a, b, a + 0.045, b + 0.16, z, z + 3.4, BARK);
      const [px, py] = T.p(0.14, 0.17, 0);
      const joint = 'rgba(120,110,95,.4)';
      return T.shadow(0, 0, 0.22, 0.2)
        + T.box(-0.15, -0.15, 0.15, 0.15, 0, 7, STONE)
        + ln(T.p(-0.15, 0.15, 3.5), T.p(0.15, 0.15, 3.5), joint, 0.6)
        + [-0.08, 0.02, 0.11].map((du, k) => ln(T.p(du, 0.15, k % 2 ? 0 : 3.5), T.p(du, 0.15, k % 2 ? 3.5 : 7), joint, 0.6)).join('')
        + `<defs><linearGradient id="${T.id('dome')}" x1="0" x2="1"><stop offset="0" stop-color="#E3B486"/><stop offset="1" stop-color="#A9724A"/></linearGradient></defs>`
        + `<path d="M${f2(x - rx)},${f2(y)} C${f2(x - rx)},${f2(y - OVEN_H * 1.3)} ${f2(x + rx)},${f2(y - OVEN_H * 1.3)} ${f2(x + rx)},${f2(y)} A${rx},${ry} 0 0 1 ${f2(x - rx)},${f2(y)} Z" fill="url(#${T.id('dome')})" stroke="${OUT}" stroke-width="0.7"/>`
        + `<path d="M${f2(x - rx * 0.8)},${f2(y - 4)} Q${f2(x)},${f2(y - 1)} ${f2(x + rx * 0.8)},${f2(y - 4)} M${f2(x - rx * 0.55)},${f2(y - 8.4)} Q${f2(x)},${f2(y - 6.4)} ${f2(x + rx * 0.55)},${f2(y - 8.4)}" stroke="rgba(110,60,30,.35)" stroke-width="0.6" fill="none"/>`
        + T.cyl(0.02, -0.04, 7 + OVEN_H * 0.9, 7 + OVEN_H * 0.9 + 5, 0.028, { top: '#5E3A2A', left: '#B87E52', right: '#8C5A34' }, 'flue')
        // Bouche en arc sur la face avant gauche
        + `<path d="M${f2(x - 5.6)},${f2(y + 1.8)} L${f2(x - 5.6)},${f2(y - 2.4)} A2.6,2.8 0 0 1 ${f2(x - 0.6)},${f2(y - 2.4)} L${f2(x - 0.6)},${f2(y + 2.6)} Z" fill="#3A1E14" stroke="#7A4E30" stroke-width="0.8"/>`
        + log(0.18, -0.12, 0) + log(0.235, -0.12, 0) + log(0.205, -0.12, 3.4)
        + ln([px, py], [px - 9, py - 16], WOOD.right, 1.2) + `<ellipse cx="${f2(px + 1.4)}" cy="${f2(py + 0.6)}" rx="3" ry="1.4" fill="${WOOD.left}" transform="rotate(-30 ${f2(px + 1.4)} ${f2(py + 0.6)})"/>`;
    }
  }, {
    at: OVEN_AT,
    frame: [-14, -54, 30, 58],
    n: 8,
    fps: 5,
    draw: (T, level, f, n) => {
      const [x, y] = T.p(0, 0, 7);
      const [cx, cy] = T.p(0.02, -0.04, 7 + OVEN_H * 0.9 + 5);
      const glow = 0.7 + wave(f, n, 0.3, 1.3);
      const puffs = [0, 1].map(k => {
        const t = ((f / n) + k * 0.5) % 1;
        return dot(cx + 1 + t * 5 + Math.sin(t * 6) * 1.2, cy - 2 - t * 18, 1.8 + t * 3.6, `rgba(236,232,224,${f2(0.6 * (1 - t))})`);
      }).join('');
      return `<ellipse cx="${f2(x - 3.1)}" cy="${f2(y + 0.6)}" rx="1.9" ry="1.6" fill="#F28A3A" opacity="${f2(glow)}"/><ellipse cx="${f2(x - 3.1)}" cy="${f2(y + 1)}" rx="1" ry="0.8" fill="#FFE07A" opacity="${f2(glow)}"/>` + puffs;
    }
  }]
};
// Lit douillet : un hamac rayé entre deux poteaux, coussin et livre ouvert ; il se balance
const HAMMOCK_AT = [0.9, -0.22];
const lit = {
  layers: [{
    at: HAMMOCK_AT,
    frame: [-22, -32, 46, 46],
    draw: T => T.shadow(0, -0.5, 0.06, 0.2) + T.shadow(0, 0.5, 0.06, 0.2)
      + T.box(-0.025, -0.525, 0.025, -0.475, 0, 22, WOOD_DARK) + T.box(-0.025, 0.475, 0.025, 0.525, 0, 22, WOOD_DARK)
      + ln(T.p(0, -0.5, 22), T.p(0, -0.5, 24), WOOD_DARK.right, 1.4) + ln(T.p(0, 0.5, 22), T.p(0, 0.5, 24), WOOD_DARK.right, 1.4)
  }, {
    at: HAMMOCK_AT,
    frame: [-20, -26, 42, 34],
    n: 8,
    fps: 3,
    draw: (T, level, f, n) => {
      const a = T.p(0, -0.47, 18);
      const b = T.p(0, 0.47, 18);
      const swing = wave(f, n, 1.4);
      const mx = (a[0] + b[0]) / 2 + swing;
      const my = (a[1] + b[1]) / 2;
      const low = my + 9 + wave(f, n, 0.6, 1);
      const stripe = (k, color) => `<path d="M${f2(a[0] + 2)},${f2(a[1] + 1 + k)} Q${f2(mx)},${f2(low - 4 + k * 1.6)} ${f2(b[0] - 2)},${f2(b[1] + 1 + k)}" stroke="${color}" stroke-width="1.1" fill="none"/>`;
      const kx = a[0] + (b[0] - a[0]) * 0.2 + swing * 0.4;
      const ky = a[1] + (b[1] - a[1]) * 0.2 + 5;
      return ln(a, [a[0] - 1.2, a[1] + 2.6], '#C9A16A', 0.7) + ln(b, [b[0] + 1.2, b[1] + 2.6], '#C9A16A', 0.7)
        + `<path d="M${f2(a[0])},${f2(a[1] + 2)} Q${f2(mx)},${f2(low + 3)} ${f2(b[0])},${f2(b[1] + 2)} Q${f2(mx)},${f2(low - 6)} ${f2(a[0])},${f2(a[1] + 2)} Z" fill="#F3E4C4" stroke="#C9A16A" stroke-width="0.6"/>`
        + stripe(0, '#E2574C') + stripe(2.2, '#5C83C2') + stripe(4.2, '#E2574C')
        + ell(kx, ky, 3.6, 2, '#FFFDF8', ` stroke="${OUT}" stroke-width="0.5"`)
        + `<path d="M${f2(mx + 1)},${f2(low - 4.6)} l3.4,-1.2 l3.4,1.2 l0,1.6 l-3.4,-1 l-3.4,1 Z" fill="#8C4B32"/><path d="M${f2(mx + 1.4)},${f2(low - 4.8)} l3,-1 l3,1" stroke="#FFFDF8" stroke-width="0.6" fill="none"/>`;
    }
  }]
};
// Chat roulé en boule sur un coussin près de la porte : il respire, le bout de la queue bat, une oreille frémit
const chat = {
  layers: [{
    at: [0.46, 0.8],
    frame: [-14, -16, 28, 20],
    n: 8,
    fps: 3,
    draw: (T, level, f, n) => {
      const [x, y] = T.p(0, 0, 0);
      const breath = wave(f, n, 0.45);
      const flick = f === 2 || f === 3 ? -1.6 : 0;
      const ear = f === 6 ? -18 : 0;
      return ell(x, y + 0.4, 9, 2.6, 'rgba(40,55,20,.22)')
        + ell(x, y - 1, 8.6, 3.2, '#C8504A') + ell(x - 0.6, y - 1.8, 7.4, 2.4, '#DE6A5E')
        + [[-8, -0.4], [8, -1], [-6, 1.6], [6, 1.8]].map(([dx, dy]) => dot(x + dx, y + dy, 0.9, '#F2C04B')).join('')
        + ell(x - 0.6, y - 5.4, 6.2 + breath, 3.6 + breath * 0.5, '#F2994A', ' stroke="rgba(120,60,20,.35)" stroke-width="0.5"')
        + `<path d="M${f2(x - 4)},${f2(y - 8)} q1.4,1.2 1,3 M${f2(x - 1.2)},${f2(y - 8.8)} q1.2,1.4 0.8,3.4 M${f2(x + 1.6)},${f2(y - 8.6)} q1,1.2 0.6,3" stroke="#C8622A" stroke-width="0.9" fill="none"/>`
        + dot(x + 4.4, y - 5.2, 3.2, '#F2994A')
        + `<g transform="rotate(${ear} ${f2(x + 3.4)} ${f2(y - 7.6)})"><path d="M${f2(x + 2.4)},${f2(y - 7.4)} l0.6,-2.8 l1.8,2 Z" fill="#F2994A"/><path d="M${f2(x + 2.8)},${f2(y - 7.6)} l0.4,-1.6 l0.9,1.1 Z" fill="#F7B8B0"/></g>`
        + `<path d="M${f2(x + 5)},${f2(y - 7.8)} l1.4,-2.6 l1.2,2.3 Z" fill="#F2994A"/>`
        + `<path d="M${f2(x + 3.4)},${f2(y - 5.2)} q0.7,0.6 1.4,0 M${f2(x + 5.4)},${f2(y - 5.2)} q0.7,0.6 1.4,0" stroke="#5E3A22" stroke-width="0.6" fill="none"/>`
        + dot(x + 6.6, y - 4, 0.5, '#E07A7A')
        + `<path d="M${f2(x - 6.4)},${f2(y - 3.6)} q-1.4,3.4 3.6,3.8 q4.6,0.2 6.2,-1.4" stroke="#F2994A" stroke-width="2.2" fill="none" stroke-linecap="round"/>`
        + `<path d="M${f2(x + 3.4)},${f2(y - 1.2)} q1.6,${f2(-0.6 + flick)} 2.6,${f2(-1.8 + flick)}" stroke="#FFF4E6" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;
    }
  }]
};
// Chien assis qui garde la maison : il remue la queue et halète, sa gamelle à côté
const chien = {
  layers: [{
    at: [-0.24, 0.88],
    frame: [-16, -26, 34, 30],
    n: 8,
    fps: 6,
    draw: (T, level, f, n) => {
      const [x, y] = T.p(0, 0, 0);
      const wag = wave(f, n, 3.2);
      const pant = f % 2 ? 0.8 : 0;
      const [gx, gy] = T.p(0.14, -0.1, 0);
      const head = y - 12.2 + pant * 0.3;
      return ell(x, y + 0.4, 8, 2, 'rgba(40,55,20,.25)')
        + ell(gx, gy, 4, 1.6, '#4C7FB5') + ell(gx, gy - 1, 4, 1.5, '#6FA3D9') + ell(gx, gy - 1.2, 2.8, 0.9, '#8B5631')
        + `<path d="M${f2(x - 6)},${f2(y - 3)} q-4,${f2(-2 + wag)} -5,${f2(-6.4 + wag)}" stroke="#B98552" stroke-width="2.4" stroke-linecap="round" fill="none"/>`
        + ell(x - 1.6, y - 4.6, 6, 4.4, '#C9935E', ' stroke="rgba(90,50,20,.35)" stroke-width="0.5"')
        + `<path d="M${f2(x + 0.4)},${f2(y - 8)} Q${f2(x + 4.6)},${f2(y - 7)} ${f2(x + 4.4)},${f2(y)} L${f2(x + 0.6)},${f2(y)} Z" fill="#D9A877"/>`
        + ln([x + 1.6, y - 3], [x + 1.6, y - 0.2], '#B98552', 1.8) + ln([x + 3.6, y - 3], [x + 3.6, y - 0.2], '#B98552', 1.8)
        + ell(x + 1.6, y, 1.4, 0.7, '#FFF4E6') + ell(x + 3.6, y, 1.4, 0.7, '#FFF4E6')
        + dot(x + 3, head, 4.4, '#C9935E')
        + ell(x + 6.4, head + 1.2, 2.8, 2, '#E7C08A')
        + dot(x + 8.8, head + 0.4, 0.95, '#2A2420')
        + (pant ? `<path d="M${f2(x + 6.6)},${f2(y - 9.4)} q0.6,2.4 1.8,1.4 q0.4,-1 -0.4,-1.8 Z" fill="#E86A7A"/>` : '')
        + `<path d="M${f2(x + 0.2)},${f2(y - 15.2)} q-3.2,1 -2.2,6.4" stroke="#8B5631" stroke-width="2.6" stroke-linecap="round" fill="none"/>`
        + dot(x + 4.6, head - 0.8, 0.7, '#2A2420')
        + `<path d="M${f2(x + 0.4)},${f2(y - 8.2)} q3,1.4 5.6,0" stroke="#E2463A" stroke-width="1.5" fill="none"/>` + dot(x + 3.2, y - 7, 0.9, '#F2C04B');
    }
  }]
};
// Grand sablier sur un guéridon : le sable s'écoule et monte en dune dans l'ampoule du bas (palier V)
const sablier = {
  layers: [{
    at: [0.92, 0.62],
    frame: [-16, -46, 32, 52],
    n: 8,
    fps: 2,
    draw: (T, level, f, n) => {
      const [x, y] = T.p(0, 0, 16);
      const k = f / n;
      const glass = `M${f2(x - 4.4)},${f2(y - 20)} C${f2(x - 4.6)},${f2(y - 14)} ${f2(x - 0.6)},${f2(y - 12)} ${f2(x - 0.6)},${f2(y - 10)} C${f2(x - 0.6)},${f2(y - 8)} ${f2(x - 4.6)},${f2(y - 6)} ${f2(x - 4.4)},${f2(y)} L${f2(x + 4.4)},${f2(y)} C${f2(x + 4.6)},${f2(y - 6)} ${f2(x + 0.6)},${f2(y - 8)} ${f2(x + 0.6)},${f2(y - 10)} C${f2(x + 0.6)},${f2(y - 12)} ${f2(x + 4.6)},${f2(y - 14)} ${f2(x + 4.4)},${f2(y - 20)} Z`;
      const top = y - 11 - (1 - k) * 7;
      const pile = 1 + k * 6;
      const post = dx => `<rect x="${f2(x + dx - 0.6)}" y="${f2(y - 21)}" width="1.2" height="21" fill="${WOOD_DARK.left}"/>`;
      return T.shadow(0, 0, 0.13, 0.22)
        + T.cyl(0, 0, 0, 2, 0.06, WOOD_DARK, 'foot') + T.box(-0.012, -0.012, 0.012, 0.012, 2, 12, WOOD_DARK) + T.cyl(0, 0, 12, 14, 0.12, WOOD, 'table')
        + T.cyl(0, 0, 14, 16, 0.09, WOOD_DARK, 'base')
        + post(-5.2) + post(5.2)
        + `<defs><clipPath id="${T.id('glass')}"><path d="${glass}"/></clipPath></defs>`
        + `<g clip-path="url(#${T.id('glass')})"><rect x="${f2(x - 5)}" y="${f2(top)}" width="10" height="${f2(y - 10 - top)}" fill="#F2C66E"/>`
        + `<path d="M${f2(x - 5)},${f2(y)} L${f2(x - 5)},${f2(y - pile * 0.4)} Q${f2(x)},${f2(y - pile * 1.6)} ${f2(x + 5)},${f2(y - pile * 0.4)} L${f2(x + 5)},${f2(y)} Z" fill="#E9B65A"/>`
        + (k < 1 ? ln([x, y - 10], [x, y - pile], '#F2C66E', 0.7) : '') + '</g>'
        + `<path d="${glass}" fill="rgba(220,240,255,.22)" stroke="rgba(255,255,255,.85)" stroke-width="0.6"/>`
        + ln([x - 3, y - 18], [x - 2, y - 14], 'rgba(255,255,255,.7)', 0.8) + ln([x - 3, y - 2], [x - 2.4, y - 5], 'rgba(255,255,255,.6)', 0.7)
        + post(0)
        + T.cyl(0, 0, 36, 38, 0.09, WOOD_DARK, 'cap') + dot(...T.p(0, 0, 39), 1, WOOD.top);
    }
  }]
};
// Hibou sur son perchoir : il tourne la tête, cligne de ses grands yeux d'or (palier VI)
const hibou = {
  layers: [{
    at: [-0.92, 0.36],
    frame: [-16, -46, 32, 52],
    n: 8,
    fps: 3,
    draw: (T, level, f) => {
      const [ox, oy] = T.p(0, 0, 25);
      const turn = f === 2 || f === 3 ? 1.6 : f === 5 ? -1.2 : 0;
      const blink = f === 6;
      const feather = '#9C6B43';
      const eye = dx => (blink
        ? `<path d="M${f2(ox + dx - 1.6)},${f2(oy - 14)} q1.6,1 3.2,0" stroke="#3A2A1E" stroke-width="0.7" fill="none"/>`
        : dot(ox + dx, oy - 14, 1.8, '#F2C04B') + dot(ox + dx + turn * 0.3, oy - 14, 0.9, '#1E1A17') + dot(ox + dx - 0.5, oy - 14.6, 0.35, '#FFFFFF'));
      return T.shadow(0, 0, 0.1, 0.2) + T.pebble(0.05, 0.05, 1.8)
        + T.box(-0.02, -0.02, 0.02, 0.02, 0, 23, WOOD_DARK)
        + T.box(-0.015, -0.12, 0.015, 0.12, 23, 25, WOOD)
        + `<path d="M${f2(ox - 2)},${f2(oy - 2)} l-1,4 l2,-1 l1,2 l1,-2 l2,1 l-1,-4 Z" fill="#7A4E30"/>`
        + ell(ox, oy - 6.4, 5, 6.4, feather, ' stroke="rgba(60,35,20,.35)" stroke-width="0.5"')
        + ell(ox + 0.4, oy - 5.6, 3.2, 4.6, '#E7C99A')
        + [[-1, -7.4], [1.4, -6.4], [-0.4, -4.4], [1.8, -3.6]].map(([dx, dy]) => `<path d="M${f2(ox + dx - 0.7)},${f2(oy + dy)} l0.7,0.7 l0.7,-0.7" stroke="#B98552" stroke-width="0.5" fill="none"/>`).join('')
        + ell(ox - 3.8, oy - 6, 1.8, 4.6, '#7A4E30') + ell(ox + 4, oy - 6, 1.6, 4.4, '#8B5631')
        + [-1.6, 0, 1.6].map(dx => ln([ox + dx, oy - 1], [ox + dx, oy + 0.6], '#E8A13A', 0.7)).join('')
        + `<g transform="translate(${f2(turn)} 0)">`
        + ell(ox, oy - 14, 5.4, 4.6, feather, ' stroke="rgba(60,35,20,.35)" stroke-width="0.5"')
        + `<path d="M${f2(ox - 4.6)},${f2(oy - 16.4)} l-0.6,-3.6 l2.6,2 Z M${f2(ox + 4.6)},${f2(oy - 16.4)} l0.6,-3.6 l-2.6,2 Z" fill="${feather}"/>`
        + ell(ox - 2, oy - 13.8, 2.6, 2.4, '#E7C99A') + ell(ox + 2, oy - 13.8, 2.6, 2.4, '#E7C99A')
        + eye(-2) + eye(2)
        + `<path d="M${f2(ox - 0.7)},${f2(oy - 12.6)} l0.7,1.6 l0.7,-1.6 Z" fill="#5E3A22"/></g>`;
    }
  }]
};
// Grimoire volant : il flotte au-dessus de son lutrin de pierre, ses pages tournent seules, des runes s'en échappent ;
// il luit la nuit (palier VII)
const GRIMOIRE_AT = [0.88, 0.95];
const grimoire = {
  light: () => [GRIMOIRE_AT[0], GRIMOIRE_AT[1], 24, 22, '200,160,255'],
  layers: [{
    at: GRIMOIRE_AT,
    frame: [-14, -22, 28, 28],
    draw: T => T.shadow(0, 0, 0.1, 0.2)
      + T.box(-0.07, -0.07, 0.07, 0.07, 0, 3, STONE) + T.cyl(0, 0, 3, 13, 0.035, STONE, 'col') + T.box(-0.06, -0.06, 0.06, 0.06, 13, 15, STONE)
      + T.disc(0, 0, 15, 0.045, 'rgba(200,160,255,.55)') + T.disc(0, 0, 15, 0.025, 'rgba(240,225,255,.8)')
  }, {
    at: GRIMOIRE_AT,
    frame: [-22, -50, 44, 36],
    n: 8,
    fps: 5,
    motion: t => [0, 0, Math.sin(t * 1.4) * 1.6],
    draw: (T, level, f, n) => {
      const [x, y] = T.p(0, 0, 25);
      const t = f / n;
      const ex = x + 10 * Math.cos(Math.PI * t);
      const ey = y - 2 - Math.sin(Math.PI * t) * 7;
      const lines = s => [0, 1, 2, 3].map(k => ln([x + s * 2.4, y - 3.6 + k * 1.3 + k * 0.1], [x + s * 8.4, y - 4.8 + k * 1.3], 'rgba(90,70,110,.4)', 0.5)).join('');
      const runes = [0, 1, 2].map(k => {
        const r = (t + k / 3) % 1;
        const rx = x + (k - 1) * 5 + Math.sin(r * 6 + k) * 1.5;
        const ry = y - 8 - r * 14;
        const o = f2(1 - r);
        return k === 0 ? `<circle cx="${f2(rx)}" cy="${f2(ry)}" r="1.4" fill="none" stroke="#D9C2FF" stroke-width="0.6" opacity="${o}"/>`
          : k === 1 ? `<path d="M${f2(rx - 1.4)},${f2(ry + 1)} l1.4,-2.4 l1.4,2.4 Z" fill="none" stroke="#FFE7A8" stroke-width="0.6" opacity="${o}"/>`
            : `<path d="M${f2(rx - 1.2)},${f2(ry)} h2.4 M${f2(rx)},${f2(ry - 1.2)} v2.4" stroke="#D9C2FF" stroke-width="0.6" opacity="${o}"/>`;
      }).join('');
      return ell(x, y + 1, 12, 3, 'rgba(200,160,255,.22)')
        + `<path d="M${f2(x)},${f2(y + 1.4)} L${f2(x - 11)},${f2(y - 2)} L${f2(x - 11)},${f2(y - 3.4)} L${f2(x)},${f2(y)} L${f2(x + 11)},${f2(y - 3.4)} L${f2(x + 11)},${f2(y - 2)} Z" fill="#6A3FA0" stroke="#4A2A78" stroke-width="0.5"/>`
        + `<path d="M${f2(x)},${f2(y)} Q${f2(x - 5)},${f2(y - 5)} ${f2(x - 10)},${f2(y - 3.4)} L${f2(x - 10)},${f2(y - 5)} Q${f2(x - 5)},${f2(y - 7)} ${f2(x)},${f2(y - 2)} Z" fill="#FBF3DF" stroke="#D8C39B" stroke-width="0.4"/>`
        + `<path d="M${f2(x)},${f2(y)} Q${f2(x + 5)},${f2(y - 5)} ${f2(x + 10)},${f2(y - 3.4)} L${f2(x + 10)},${f2(y - 5)} Q${f2(x + 5)},${f2(y - 7)} ${f2(x)},${f2(y - 2)} Z" fill="#FBF3DF" stroke="#D8C39B" stroke-width="0.4"/>`
        + lines(-1) + lines(1)
        + `<path d="M${f2(x)},${f2(y - 2)} Q${f2((x + ex) / 2)},${f2(Math.min(y - 6, ey - 3))} ${f2(ex)},${f2(ey - 3)} L${f2(ex)},${f2(ey - 1.6)} Q${f2((x + ex) / 2)},${f2(Math.min(y - 4.4, ey - 1.4))} ${f2(x)},${f2(y)} Z" fill="#FFFDF4" stroke="#D8C39B" stroke-width="0.4"/>`
        + dot(x - 10.6, y - 2.7, 0.8, '#F2C04B') + dot(x + 10.6, y - 2.7, 0.8, '#F2C04B')
        + runes
        + star(x - 7, y - 10, 1.4, '#FFF2B0', Math.max(0, wave(f, n, 1))) + star(x + 8, y - 12, 1.2, '#FFF2B0', Math.max(0, wave(f, n, 1, 3)));
    }
  }]
};

// Catalogue : id d'article (celui du serveur) → calques
export const SHOP_SPRITES = {
  pelle,
  arrosoir,
  poulailler,
  ruche,
  brouette,
  epouvantail,
  citrouille,
  pioche,
  wagonnet,
  'lanterne-mine': lanterneMine,
  rails,
  casque,
  geode,
  golem,
  hache,
  scie,
  nichoir,
  charrette,
  'passe-partout': passePartout,
  ecureuil,
  cerf,
  'seau-cuivre': seauCuivre,
  poulie,
  abreuvoir,
  pompe,
  sourcier,
  canards,
  naiade,
  canne,
  filet,
  casier,
  barque,
  harpon,
  pelican,
  sirene,
  etabli,
  enclume,
  soufflet,
  'marteau-pilon': marteauPilon,
  automate,
  athanor,
  cuisine,
  lit,
  chat,
  chien,
  sablier,
  hibou,
  grimoire
};

// Emprise de 3 × 3 cases à partir de ce palier : les articles s'écartent d'autant (leur taille ne change pas)
const BIG_FROM = 4;
const spread = level => (level >= BIG_FROM ? 1.5 : 1);
// Place d'un calque selon le niveau du bâtiment : celle du niveau (paliers 1 à 3), repli sur le niveau 2 puis 1,
// écartée de moitié en plus quand l'emprise passe à 3 × 3
function placeOf(layer, level) {
  const at = layer.at;
  const base = typeof at[0] === 'number' ? at : at[Math.min(level, 3)] || at[2] || at[1];
  const k = spread(level);
  return [base[0] * k, base[1] * k];
}
function boxOf(layer, level) {
  const [u, v] = placeOf(layer, level);
  const [sx, sy] = P(u, v, 0);
  const [x, y, w, h] = layer.frame;
  return { x: sx + x, y: sy + y, w, h };
}
function bodyOf(id, k, layer, level, f) {
  const [u, v] = placeOf(layer, level);
  const T = tools(u, v, `${id}-${k}`);
  return layer.n ? layer.draw(T, level, f, layer.n) : layer.draw(T, level);
}

// Calques d'un article prêts à peindre à l'instant t (secondes) : clé d'image, dessin, devant/derrière, décalage écran
export function itemLayers(id, level, t = 0) {
  const item = SHOP_SPRITES[id];
  if (!item) return [];
  return item.layers.map((layer, k) => {
    const f = layer.n ? Math.floor(t * layer.fps) % layer.n : 0;
    const [mu, mv, dz] = layer.motion ? layer.motion(t, level) : [0, 0, 0];
    const du = mu * spread(level);
    const dv = mv * spread(level);
    return {
      key: `shop-${id}-${level}-${k}-${f}`,
      make: () => sprite(bodyOf(id, k, layer, level, f), boxOf(layer, level)),
      back: Boolean(layer.back),
      offset: [((du - dv) * 64) / 2, ((du + dv) * 32) / 2 - dz]
    };
  });
}

// Lumière de nuit d'un article : [u, v, z, rayon, couleur « r,g,b » ou rien pour la lueur chaude] dans le repère du bâtiment, ou null
export function itemLight(id, level) {
  const item = SHOP_SPRITES[id];
  if (!item || !item.light) return null;
  const [u, v, z, r, color] = item.light(level);
  return [u * spread(level), v * spread(level), z, r, color];
}

// Vignette d'un article pour la boutique : tous ses calques (première image), cadrés au plus juste
export function itemThumb(id, level) {
  const item = SHOP_SPRITES[id];
  if (!item) return null;
  const boxes = item.layers.map(layer => boxOf(layer, level));
  const x = Math.min(...boxes.map(b => b.x));
  const y = Math.min(...boxes.map(b => b.y));
  const w = Math.max(...boxes.map(b => b.x + b.w)) - x;
  const h = Math.max(...boxes.map(b => b.y + b.h)) - y;
  const back = item.layers.map((layer, k) => (layer.back ? bodyOf(id, k, layer, level, 0) : '')).join('');
  const front = item.layers.map((layer, k) => (layer.back ? '' : bodyOf(id, k, layer, level, 0))).join('');
  return sprite(back + front, { x, y, w, h });
}
