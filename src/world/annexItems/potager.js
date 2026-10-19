// Les annexes du Potager : champ, grenier, enclos (annexSprites.js les réunit ; repère et calques : voir son en-tête).
import { EDGE } from '../iso';
import { WOOD, WOOD_DARK, STONE, WALL, THATCH, planksLeft, planksRight } from '../palette';
import { ln, ell, wave, bird, STRAW, BARN, f2 } from '../spriteKit';
import { TAU, MUD, LEAF, LEAF_LIGHT, patch, post, rail, pig, sheep } from './kit';

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

export { champ, grenier, enclos };
