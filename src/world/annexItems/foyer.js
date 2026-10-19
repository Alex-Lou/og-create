// Les annexes du Foyer : jardin, four, belvédère, et les maisons où s'installent les visiteurs (lot 7d) (annexSprites.js
// les réunit).
import { EDGE } from '../iso';
import { WOOD, WOOD_DARK, STONE, WALL, BRICK, THATCH, GLASS, SLATE_ROOF, ROOF_RED, BLUE_ROOF, planksLeft } from '../palette';
import { ln, poly, ell, dot, wave, DARK_IRON, OUT, f2 } from '../spriteKit';
import { TAU, CLAY, TEAL_ROOF, SOIL_TOP, LEAF, LEAF_LIGHT, puff, log, butterfly } from './kit';

// Jardin d'herbes : carré surélevé de lavande, basilic, romarin et thym, son petit écriteau ; deux papillons
const jardin = {
  layers: [{
    frame: [-32, -48, 64, 64],
    n: 8,
    fps: 6,
    draw: (T, f, n) => {
      const herbs = [];
      for (const [du, dv, kind] of [[-0.22, -0.1, 0], [-0.08, -0.1, 1], [0.08, -0.1, 2], [0.22, -0.1, 3], [-0.22, 0.08, 1], [-0.08, 0.08, 3], [0.08, 0.08, 0], [0.22, 0.08, 2]]) {
        const [x, y] = T.p(du, dv, 9);
        if (kind === 0) herbs.push([-1.6, 0, 1.6].map(o => ln([x + o * 0.5, y], [x + o, y - 7], '#6FA35A', 0.7) + ell(x + o, y - 8, 0.9, 2.2, '#A98ADB')).join(''));
        else if (kind === 1) herbs.push(`<circle cx="${f2(x - 1.4)}" cy="${f2(y - 2)}" r="2.2" fill="${LEAF}"/><circle cx="${f2(x + 1.4)}" cy="${f2(y - 2.4)}" r="2.2" fill="${LEAF_LIGHT}"/><circle cx="${f2(x)}" cy="${f2(y - 3.6)}" r="1.8" fill="#9ED87A"/>`);
        else if (kind === 2) herbs.push([-2, -0.7, 0.7, 2].map(o => ln([x, y], [x + o, y - 6.4], '#3F6E3A', 0.8)).join(''));
        else herbs.push(`<ellipse cx="${f2(x)}" cy="${f2(y - 1.6)}" rx="3" ry="1.8" fill="#7AA866"/>` + [-1.4, 0, 1.4].map(o => dot(x + o, y - 2.6, 0.5, '#E6D2F2')).join(''));
      }
      const fly = k => {
        const a = (f / n) * TAU + k * 2.6;
        const [x, y] = T.p(Math.cos(a) * 0.22, Math.sin(a) * 0.16, 20 + Math.sin(a * 2) * 4);
        return butterfly(x, y, (f + k) % 2 === 0, k ? '#F2C04B' : '#F6A8C8');
      };
      const [sx, sy] = T.p(0.34, 0.26, 0);
      return T.shadow(0, 0, 0.36, 0.2)
        + T.box(-0.32, -0.2, 0.32, 0.2, 0, 9, WOOD) + planksLeft(T.u - 0.32, T.u + 0.32, T.v + 0.2, 0, 9, 4.5)
        + T.face([[-0.29, -0.17, 9], [0.29, -0.17, 9], [0.29, 0.17, 9], [-0.29, 0.17, 9]], SOIL_TOP)
        + herbs.join('')
        + ln([sx, sy], [sx, sy - 12], WOOD.right, 1.2) + poly([[sx - 5, sy - 15], [sx + 5, sy - 13], [sx + 5, sy - 9], [sx - 5, sy - 11]], WALL.top, ` stroke="${OUT}" stroke-width="0.5"`)
        + ln([sx - 3, sy - 12.4], [sx + 3, sy - 11], '#6FA35A', 0.8)
        + fly(0) + fly(1);
    }
  }]
};

// Four à pain : socle de pierre, coupole d'argile, gueule où dansent les flammes, cheminée qui fume ; pains sur leur
// planche, bûches à côté
const four = {
  light: () => [-0.04, 0.24, 13, 17, '255,150,70', true],
  layers: [{
    frame: [-34, -70, 68, 88],
    n: 6,
    fps: 6,
    draw: (T, f, n) => {
      const [cx, cy] = T.p(0, -0.02, 9);
      const dome = `<path d="M${f2(cx - 17)},${f2(cy)} C${f2(cx - 17)},${f2(cy - 24)} ${f2(cx + 17)},${f2(cy - 24)} ${f2(cx + 17)},${f2(cy)} A17,8.5 0 0 1 ${f2(cx - 17)},${f2(cy)} Z" fill="url(#${T.id('dome')})" stroke="${OUT}" stroke-width="0.6"/>`;
      const [mx, my] = T.p(-0.04, 0.2, 9);
      const flick = [0.8, 1, 0.9, 1.1, 0.85, 1][f];
      const [chx, chy] = T.p(0.08, -0.12, 27);
      const smoke = [0, 1].map(k => {
        const p = ((f + k * 3) % n) / n;
        return puff(chx + p * 5, chy - 6 - p * 18, 2 + p * 3.6, 0.6 * (1 - p));
      }).join('');
      return T.shadow(0, 0, 0.38, 0.2)
        + `<defs><radialGradient id="${T.id('dome')}" cx="0.35" cy="0.3" r="0.8"><stop offset="0" stop-color="${CLAY.top}"/><stop offset="0.6" stop-color="${CLAY.left}"/><stop offset="1" stop-color="${CLAY.right}"/></radialGradient></defs>`
        + T.box(-0.3, -0.26, 0.3, 0.26, 0, 9, STONE)
        + ln(T.p(-0.3, 0.26, 4.5), T.p(0.3, 0.26, 4.5), 'rgba(120,110,95,.4)', 0.6) + ln(T.p(0.3, -0.26, 4.5), T.p(0.3, 0.26, 4.5), 'rgba(120,110,95,.4)', 0.6)
        + T.cyl(0.08, -0.12, 18, 30, 0.045, BRICK, 'chem')
        + dome
        + `<path d="M${f2(mx - 6)},${f2(my)} L${f2(mx - 6)},${f2(my - 6)} A6,6 0 0 1 ${f2(mx + 6)},${f2(my - 6)} L${f2(mx + 6)},${f2(my)} Z" fill="#2E1A10"/>`
        + ell(mx, my - 2.6, 4.6 * flick, 3 * flick, '#F2862A') + ell(mx, my - 2, 3 * flick, 1.8 * flick, '#FFD24E')
        + smoke
        // Pains sur leur planche, bûches
        + T.box(-0.32, 0.28, -0.08, 0.4, 0, 2, WOOD)
        + [-0.26, -0.15].map(du => { const [x, y] = T.p(du, 0.34, 2); return ell(x, y - 2, 4, 2.4, '#D8A050', ` stroke="#9A6A2E" stroke-width="0.4"`) + ln([x - 2, y - 2.6], [x + 1, y - 3.4], '#F2D28A', 0.6) + ln([x - 0.4, y - 1.8], [x + 2.4, y - 2.6], '#F2D28A', 0.6); }).join('')
        + log(T, 0.3, 0.14, 0.32, 2.2, 2.2) + log(T, 0.36, 0.1, 0.3, 2.2, 2.2) + log(T, 0.33, 0.12, 0.31, 6.2, 2.2);
    }
  }]
};

// Belvédère : kiosque rond sur sa terrasse de pierre, toit hexagonal, banc ; un fanion flotte au sommet, une lanterne
// éclaire la nuit
const belvedere = {
  light: () => [0, 0, 29, 15],
  layers: [{
    frame: [-38, -92, 76, 110],
    n: 6,
    fps: 4,
    draw: (T, f, n) => {
      const pts = Array.from({ length: 6 }, (_, k) => {
        const a = (k / 6) * TAU + TAU / 12;
        return [Math.cos(a) * 0.27, Math.sin(a) * 0.27];
      });
      const back = pts.filter(([a, b]) => a + b < 0);
      const front = pts.filter(([a, b]) => a + b >= 0);
      const column = ([a, b]) => T.box(a - 0.018, b - 0.018, a + 0.018, b + 0.018, 5, 32, { top: '#FFFFFF', left: '#F4F0E8', right: '#D6CFC2' });
      const eave = pts.map(([a, b]) => [a * 1.3, b * 1.3, 32]);
      const apex = [0, 0, 50];
      let roof = '';
      for (let k = 0; k < 6; k++) {
        const p = eave[k], q = eave[(k + 1) % 6];
        const nu = (p[0] + q[0]) / 2, nv = (p[1] + q[1]) / 2;
        if (nu + nv <= 0) continue;
        roof += T.face([p, q, apex], nu > nv ? TEAL_ROOF.right : TEAL_ROOF.left, EDGE);
      }
      const [tx, ty] = T.p(0, 0, 56);
      return T.shadow(0, 0, 0.42, 0.18)
        + T.cyl(0, 0, 0, 5, 0.36, STONE, 'terrasse')
        + back.map(column).join('')
        + T.box(-0.12, -0.04, 0.12, 0.04, 5, 9, WOOD) + T.box(-0.12, -0.06, 0.12, -0.04, 9, 14, WOOD)
        + front.map(column).join('')
        + roof
        + ln(T.p(0, 0, 50), [tx, ty], DARK_IRON.right, 1)
        + poly([[tx, ty], [tx + 9, ty + 1.8 + wave(f, n, 1.2)], [tx + 0.4, ty + 4]], '#E2574C')
        + ln(T.p(0, 0, 32), T.p(0, 0, 30), '#3D3A36', 0.5) + T.box(-0.02, -0.02, 0.02, 0.02, 26, 30, { top: '#5A606A', left: GLASS, right: '#E9C878' });
    }
  }]
};

// Maison (lot 7d) : maisonnette blanchie à la chaux sur son soubassement de pierre, toit à deux pentes, porte, fenêtre
// éclairée la nuit, jardinière fleurie ; la cheminée fume. variant : n° de la maison (0 à 3), qui change le toit et
// la porte
const HOUSE_LOOKS = [
  { roof: ROOF_RED, door: '#3E6E9C' },
  { roof: BLUE_ROOF, door: '#C9473A' },
  { roof: THATCH, door: '#4F8A3A' },
  { roof: SLATE_ROOF, door: '#B5772F' }
];

const maison = {
  light: () => [0.27, 0.06, 13, 12],
  layers: [{
    frame: [-34, -78, 68, 96],
    n: 6,
    fps: 3,
    draw: (T, f, n, variant = 0) => {
      const look = HOUSE_LOOKS[variant % HOUSE_LOOKS.length];
      const [chx, chy] = T.p(-0.12, -0.1, 36);
      const smoke = [0, 1].map(k => {
        const p = ((f + k * 3) % n) / n;
        return puff(chx + p * 5, chy - 4 - p * 16, 1.8 + p * 3.2, 0.55 * (1 - p));
      }).join('');
      const pane = (pts, fill) => T.face(pts, fill, ` stroke="${WOOD_DARK.right}" stroke-width="0.9"`);
      return T.shadow(0, 0, 0.36, 0.2)
        + T.box(-0.26, -0.22, 0.26, 0.22, 0, 4, STONE)
        + T.box(-0.24, -0.2, 0.24, 0.2, 4, 21, WALL)
        // Porte (face avant) et fenêtre (pignon), linteaux de bois
        + pane([[-0.05, 0.2, 4], [0.07, 0.2, 4], [0.07, 0.2, 15], [-0.05, 0.2, 15]], look.door)
        + dot(...T.p(0.05, 0.2, 9.5), 0.6, '#F2C04B')
        + pane([[0.24, -0.06, 10], [0.24, 0.07, 10], [0.24, 0.07, 16], [0.24, -0.06, 16]], GLASS)
        + ln(T.p(0.24, 0.005, 10), T.p(0.24, 0.005, 16), WOOD_DARK.right, 0.7)
        + pane([[-0.16, 0.2, 10], [-0.1, 0.2, 10], [-0.1, 0.2, 15], [-0.16, 0.2, 15]], GLASS)
        // Jardinière fleurie sous la fenêtre de façade
        + T.box(-0.18, 0.2, -0.08, 0.25, 8, 10, WOOD)
        + [-0.165, -0.13, -0.095].map((du, k) => dot(...T.p(du, 0.23, 11.2), 1.3, ['#E8566A', '#F2C04B', '#B48AE0'][k])).join('')
        + T.cyl(-0.12, -0.1, 24, 36, 0.035, BRICK, 'chem')
        + T.gable(-0.27, -0.23, 0.27, 0.23, 21, 11, { front: look.roof.front, back: look.roof.back, gable: WALL.right }, 0.05)
        + smoke;
    }
  }]
};

export { jardin, four, belvedere, maison };
