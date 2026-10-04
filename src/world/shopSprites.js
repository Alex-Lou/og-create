// Articles de la boutique des ateliers, dessinés aux abords de leur bâtiment (planche 3).
// Repère : celui de l'emprise du bâtiment (u, v ∈ [-1, 1], ancrage au centre), même projection et même lumière.
// Un article est fait de calques. Chaque calque a :
// - sa place (u, v), qui peut changer avec le niveau du bâtiment ;
// - un cadre serré autour de cette place, car les images sont gardées à 4× en mémoire ;
// - soit un dessin fixe, soit n images d'animation à peine différentes jouées à fps images/s ;
// - en option : back (dessiné avant le bâtiment, donc derrière) et motion (glissement continu dans le temps).
import { P, box, gable, disc, cylinder, face, sprite, EDGE } from './iso';
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
      const c = CANNE[level] || CANNE[1];
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
  light: level => { const [u, v] = ENCLUME[level] || ENCLUME[1]; return [u - 0.02, v, 18, 12]; },
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

// Catalogue : id d'article (celui du serveur) → calques
export const SHOP_SPRITES = {
  pelle,
  arrosoir,
  poulailler,
  ruche,
  pioche,
  wagonnet,
  'lanterne-mine': lanterneMine,
  rails,
  hache,
  scie,
  nichoir,
  charrette,
  'seau-cuivre': seauCuivre,
  poulie,
  abreuvoir,
  pompe,
  canne,
  filet,
  casier,
  barque,
  etabli,
  enclume,
  soufflet,
  cuisine,
  lit,
  chat,
  chien
};

// Place d'un calque selon le niveau du bâtiment (repli sur le niveau 1)
function placeOf(layer, level) {
  const at = layer.at;
  return typeof at[0] === 'number' ? at : at[level] || at[1];
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
    const [du, dv, dz] = layer.motion ? layer.motion(t, level) : [0, 0, 0];
    return {
      key: `shop-${id}-${level}-${k}-${f}`,
      make: () => sprite(bodyOf(id, k, layer, level, f), boxOf(layer, level)),
      back: Boolean(layer.back),
      offset: [((du - dv) * 64) / 2, ((du + dv) * 32) / 2 - dz]
    };
  });
}

// Lumière de nuit d'un article : [u, v, z, rayon] dans le repère du bâtiment, ou null
export function itemLight(id, level) {
  const item = SHOP_SPRITES[id];
  return item && item.light ? item.light(level) : null;
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
