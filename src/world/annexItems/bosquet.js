// Les annexes du Bosquet : coupe, remise, pépinière (annexSprites.js les réunit).
import { box, gable, EDGE } from '../iso';
import { WOOD, WOOD_DARK, STONE, GLASS, planksLeft } from '../palette';
import { ln, poly, dot, wave, bird, bucket, IRON, OUT, f2 } from '../spriteKit';
import { LEAF, LEAF_LIGHT, GLASS_FACES, GLASS_EDGE, patch, post, log, logEnd, stumpAt, sapling } from './kit';

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

export { coupe, remise, pepiniere };
