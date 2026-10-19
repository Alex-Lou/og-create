// Les articles de la boutique du Potager, dessinés aux abords du bâtiment (shopSprites.js les réunit ; repère et
// calques : voir son en-tête).
import { EDGE } from '../iso';
import { WOOD, WOOD_DARK, WALL, planksLeft, planksRight } from '../palette';
import { IRON, DARK_IRON, COPPER, STRAW, BARN, OUT, wave, star, wheel, hen, chick, bee, bird, leaf, f2, ln, poly, ell, dot, xy } from '../spriteKit';

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

export default {
  pelle,
  arrosoir,
  poulailler,
  ruche,
  brouette,
  epouvantail,
  citrouille
};
