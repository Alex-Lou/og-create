// Les annexes du Ponton : vivier, fumoir, parc à huîtres (annexSprites.js les réunit).
import { WOOD, WOOD_DARK, STONE, SLATE_ROOF, planksLeft, planksRight } from '../palette';
import { ln, poly, ell, dot, star, OUT, f2 } from '../spriteKit';
import { TAU, LEAF, LEAF_LIGHT, patch, post, puff, fishTop } from './kit';

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

export { vivier, fumoir, huitres };
