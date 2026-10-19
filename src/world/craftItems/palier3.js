// Les créations du palier III : cadran solaire, bassin, longue-vue (craftSprites.js les réunit).
import { EDGE } from '../iso';
import { WOOD_DARK, STONE, WHITE_STONE } from '../palette';
import { ln, poly, ell, dot, IRON, f2 } from '../spriteKit';
import { TAU, LEAF, LEAF_DARK, WATER, BRASS } from './kit';

// Cadran solaire : colonne de pierre, table gravée des heures, style de bronze ; l'ombre tourne lentement
const cadran = {
  layers: [{
    frame: [-30, -46, 60, 62],
    n: 8,
    fps: 0.5,
    draw: (T, f, n) => {
      const z = 18;
      const [cx, cy] = T.p(0, 0, z);
      const marks = Array.from({ length: 12 }, (_, k) => {
        const a = (k / 12) * TAU;
        const p = T.p(Math.cos(a) * 0.17, Math.sin(a) * 0.17, z);
        const q = T.p(Math.cos(a) * 0.2, Math.sin(a) * 0.2, z);
        return ln(p, q, '#7A6A55', k % 3 ? 0.5 : 1);
      }).join('');
      const a = -2.2 + (f / n) * 2.6;
      const tip = T.p(Math.cos(a) * 0.16, Math.sin(a) * 0.16, z);
      return T.shadow(0, 0, 0.3, 0.18)
        + T.box(-0.16, -0.16, 0.16, 0.16, 0, 3, STONE)
        + T.cyl(0, 0, 3, 16, 0.08, WHITE_STONE, 'fut')
        + T.cyl(0, 0, 16, z, 0.24, STONE, 'table')
        + T.disc(0, 0, z, 0.21, '#EFE6D2', ` stroke="#BDB29E" stroke-width="0.5"`)
        + marks
        + ln([cx, cy], tip, 'rgba(60,40,25,.35)', 1.6)
        + poly([[cx - 6, cy + 1.5], [cx + 6, cy - 1.5], [cx + 1, cy - 9]], BRASS.left, ` stroke="${BRASS.right}" stroke-width="0.5"`);
    }
  }]
};

// Bassin : margelle de pierre, eau claire, nénuphars et poisson rouge ; des ronds dans l'eau
const bassin = {
  layers: [{
    frame: [-36, -24, 72, 40],
    n: 6,
    fps: 3,
    draw: (T, f, n) => {
      const r = 0.42;
      const [fx, fy] = T.p(Math.cos((f / n) * TAU) * 0.18, Math.sin((f / n) * TAU) * 0.18, 2);
      const a = (f / n) * TAU + Math.PI / 2;
      return T.shadow(0, 0, 0.46, 0.12)
        + T.box(-r, -r, r, r, 0, 4, STONE)
        + T.face([[-r + 0.06, -r + 0.06, 4.1], [r - 0.06, -r + 0.06, 4.1], [r - 0.06, r - 0.06, 4.1], [-r + 0.06, r - 0.06, 4.1]], WATER, EDGE)
        + T.face([[-r + 0.06, -r + 0.06, 4.1], [r - 0.06, -r + 0.06, 4.1], [r - 0.1, -r + 0.12, 4.1], [-r + 0.1, -r + 0.12, 4.1]], 'rgba(40,90,130,.35)')
        + `<ellipse cx="${f2(fx)}" cy="${f2(fy)}" rx="3" ry="1.3" fill="#F08A3A" transform="rotate(${f2((a * 180) / Math.PI * 0.5)} ${f2(fx)} ${f2(fy)})"/>`
        + [[-0.2, 0.12, 3.4], [0.18, -0.16, 2.8], [0.22, 0.2, 2.4]].map(([u, v, s]) => {
          const [x, y] = T.p(u, v, 4.2);
          return ell(x, y, s * 1.4, s * 0.7, LEAF, ` stroke="${LEAF_DARK}" stroke-width="0.4"`) + poly([[x, y], [x + s * 1.3, y - s * 0.3], [x + s * 1.3, y + s * 0.2]], WATER);
        }).join('')
        + dot(...T.p(-0.2, 0.12, 6), 1.5, '#F7A8C0')
        + ell(...T.p(0.04, 0.04, 4.2), 3 + (f % 3) * 2.5, 1.5 + (f % 3) * 1.2, 'none', ` stroke="rgba(255,255,255,${f2(0.7 - (f % 3) * 0.22)})" stroke-width="0.6"`);
    }
  }]
};

// Longue-vue : trépied de bois, lunette de laiton pointée vers le large ; un éclat glisse sur le cuivre
const longuevue = {
  layers: [{
    frame: [-30, -62, 60, 78],
    n: 8,
    fps: 2,
    draw: (T, f, n) => {
      const [hx, hy] = T.p(0, 0, 26);
      const legs = [[-0.2, 0.16], [0.18, 0.12], [0, -0.22]].map(([u, v]) => ln(T.p(u, v, 0), [hx, hy], WOOD_DARK.left, 1.8)).join('');
      // Tube : du bout fin (oculaire, en bas à gauche) au gros bout (objectif, en haut à droite)
      const a = [hx - 13, hy + 5], b = [hx + 15, hy - 10];
      const d = Math.hypot(b[0] - a[0], b[1] - a[1]);
      const nx = -(b[1] - a[1]) / d, ny = (b[0] - a[0]) / d;
      const seg = (s0, s1, r0, r1, fill) => {
        const p = s => [a[0] + (b[0] - a[0]) * s, a[1] + (b[1] - a[1]) * s];
        const [p0, p1] = [p(s0), p(s1)];
        return poly([[p0[0] + nx * r0, p0[1] + ny * r0], [p1[0] + nx * r1, p1[1] + ny * r1], [p1[0] - nx * r1, p1[1] - ny * r1], [p0[0] - nx * r0, p0[1] - ny * r0]], fill, ` stroke="${BRASS.right}" stroke-width="0.5"`);
      };
      const g = f / n;
      const glint = g < 0.6 ? dot(a[0] + (b[0] - a[0]) * (g / 0.6), a[1] + (b[1] - a[1]) * (g / 0.6) - 1.6, 1, 'rgba(255,255,255,.9)') : '';
      return T.shadow(0, 0, 0.24, 0.16)
        + legs
        + seg(0, 0.3, 1.6, 1.9, BRASS.right) + seg(0.3, 0.65, 2.2, 2.6, BRASS.left) + seg(0.65, 1, 2.9, 3.4, BRASS.top)
        + ell(b[0], b[1], 1.6, 3.4, '#5A8FB8', ` stroke="${BRASS.right}" stroke-width="0.6" transform="rotate(${f2((Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI)} ${f2(b[0])} ${f2(b[1])})"`)
        + dot(hx, hy, 1.8, IRON.left)
        + glint;
    }
  }]
};

export { cadran, bassin, longuevue };
