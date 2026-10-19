// Les annexes du Puits : citerne, réservoir, éolienne (annexSprites.js les réunit).
import { EDGE } from '../iso';
import { WOOD, WOOD_DARK, STONE } from '../palette';
import { ln, poly, ell, dot, bucket, IRON, DARK_IRON, COPPER, OUT, f2 } from '../spriteKit';
import { TAU, post } from './kit';

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
        + `<circle cx="${f2(hx)}" cy="${f2(hy)}" r="19.5" fill="none" stroke="rgba(60,40,25,.18)" stroke-width="0.6" transform="matrix(0.82 0 0 1 ${f2(hx * 0.18)} 0)"/>`
        + blades
        + dot(hx, hy, 2.2, DARK_IRON.right);
    }
  }]
};

export { citerne, reservoir, eolienne };
