// Les annexes de climat (lot 9d), payées en trouvailles : glacière, métier, hutte, saline, serre, fonderie
// (annexSprites.js les réunit).
import { EDGE } from '../iso';
import { WOOD, WOOD_DARK, STONE, ROOF_RED } from '../palette';
import { ln, poly, ell, dot, star, DARK_IRON, f2 } from '../spriteKit';
import { TAU, post } from './kit';

const ICE_BLOCK = { top: '#E9F8FF', left: '#BFE7F7', right: '#8CCBE8' };

const SNOWY = { top: '#FFFFFF', left: '#EEF4FA', right: '#CFDDEA' };

const REEDS = { front: '#D8C27A', back: '#B49A52', gable: '#9E8440' };

const OBSIDIAN = { top: '#4A4258', left: '#2C2A34', right: '#1C1A22' };

const SALT = { top: '#FFFFFF', left: '#EDE6DE', right: '#CFC4B6' };

// Glacière (Puits) : une butte de pierre coiffée de neige, sa porte basse, des blocs de glace qui attendent
const glaciere = {
  layers: [{
    frame: [-34, -50, 68, 64],
    draw: T => {
      const [x, y] = T.p(0, 0, 0);
      // Dôme de pierres sèches, calotte de neige, porte basse vers le joueur
      let out = T.shadow(0, 0, 0.38, 0.18) + `<path d="M${x - 22},${y} A22,22 0 0 1 ${x + 22},${y} Q${x},${y + 9} ${x - 22},${y} Z" fill="${STONE.left}" stroke="${STONE.right}" stroke-width="0.8"/>`;
      for (const r of [6, 12, 17]) out += `<path d="M${f2(x - Math.sqrt(484 - r * r))},${y - r} Q${x},${y - r + 4} ${f2(x + Math.sqrt(484 - r * r))},${y - r}" stroke="${STONE.right}" stroke-width="0.6" fill="none"/>`;
      out += `<path d="M${x - 15},${y - 16} A22,22 0 0 1 ${x + 15},${y - 16} Q${x + 4},${y - 12} ${x},${y - 15} Q${x - 6},${y - 12} ${x - 15},${y - 16} Z" fill="${SNOWY.top}" stroke="${SNOWY.right}" stroke-width="0.6"/>`;
      const [dx, dy] = T.p(0.02, 0.34, 0);
      return out + `<path d="M${dx - 6},${dy} L${dx - 6},${dy - 10} A6,5 0 0 1 ${dx + 6},${dy - 10} L${dx + 6},${dy} Z" fill="#4A3A2E" stroke="${STONE.right}" stroke-width="0.6"/>`
        + T.box(0.24, 0.22, 0.4, 0.38, 0, 8, ICE_BLOCK) + T.box(0.28, 0.26, 0.38, 0.36, 8, 14, ICE_BLOCK) + T.box(-0.42, 0.2, -0.28, 0.34, 0, 7, ICE_BLOCK)
        + star(...T.p(0.33, 0.31, 16), 2.2, '#FFFFFF', 0.9);
    }
  }]
};

// Métier à tisser (Foyer) : un métier de bois sous un auvent, une toile de laine à rayures qui avance, des pelotes
const metier = {
  layers: [{
    frame: [-34, -52, 68, 66],
    n: 4,
    fps: 2,
    draw: (T, f) => {
      let out = T.shadow(0, 0, 0.38, 0.18);
      for (const [u, v] of [[-0.24, -0.16], [0.24, -0.16], [-0.24, 0.16], [0.24, 0.16]]) out += post(T, u, v, 0, 24, WOOD_DARK, 0.025);
      out += T.gable(-0.3, -0.22, 0.3, 0.22, 24, 10, { front: ROOF_RED.front, back: ROOF_RED.back, gable: WOOD.right }, 0.06);
      // La toile : rayures de laine qui défilent
      const rows = ['#E2574C', '#F4ECDC', '#6FA3D9', '#F2C04B'];
      for (let k = 0; k < 4; k++) {
        const c = rows[(k + f) % rows.length];
        out += T.face([[-0.2, 0.02, 6 + k * 3.5], [0.2, 0.02, 6 + k * 3.5], [0.2, 0.02, 9.5 + k * 3.5], [-0.2, 0.02, 9.5 + k * 3.5]], c, EDGE);
      }
      out += ln(T.p(-0.22, 0.02, 20), T.p(0.22, 0.02, 20), WOOD.top, 1.6) + ln(T.p(-0.22, 0.02, 5), T.p(0.22, 0.02, 5), WOOD.top, 1.6);
      for (let k = 0; k < 6; k++) out += ln(T.p(-0.18 + k * 0.072, 0.02, 20), T.p(-0.18 + k * 0.072, 0.02, 20 - 2), 'rgba(80,60,40,.5)', 0.5);
      const ball = (du, dv, c) => { const [bx, by] = T.p(du, dv, 0); return dot(bx, by - 3, 3.4, c) + ln([bx - 2.4, by - 4], [bx + 2.4, by - 2], 'rgba(0,0,0,.2)', 0.6); };
      return out + ball(0.32, 0.3, '#E2574C') + ball(0.38, 0.18, '#F4ECDC') + ball(-0.34, 0.3, '#6FA3D9');
    }
  }]
};

// Hutte de roseaux (Bosquet) : des murs de roseaux tressés, un toit de chaume épais, des bottes qui sèchent
const hutte = {
  layers: [{
    frame: [-34, -56, 68, 70],
    draw: T => {
      let out = T.shadow(0, 0, 0.38, 0.18) + T.box(-0.24, -0.2, 0.24, 0.2, 0, 18, { top: '#D8C27A', left: '#C2A65A', right: '#9E8440' });
      for (let k = 0; k < 9; k++) out += ln(T.p(-0.24 + k * 0.06, 0.2, 0), T.p(-0.24 + k * 0.06, 0.2, 18), 'rgba(110,80,30,.35)', 0.6);
      for (let k = 0; k < 7; k++) out += ln(T.p(0.24, -0.2 + k * 0.066, 0), T.p(0.24, -0.2 + k * 0.066, 18), 'rgba(80,60,20,.4)', 0.6);
      out += T.face([[-0.04, 0.2, 0], [0.08, 0.2, 0], [0.08, 0.2, 12], [-0.04, 0.2, 12]], '#4A3420');
      out += T.gable(-0.24, -0.2, 0.24, 0.2, 18, 16, REEDS, 0.1);
      const bundle = du => { const [bx, by] = T.p(du, 0.34, 0); return [-2, 0, 2].map(d => ln([bx + d, by], [bx + d * 0.4, by - 14], '#B49A52', 1.4)).join('') + ln([bx - 3, by - 6], [bx + 3, by - 6], '#7A5A2A', 1.2); };
      return out + bundle(-0.3) + bundle(0.34);
    }
  }]
};

// Saline (Ponton) : des bassins carrés où l'eau s'évapore, des tas de sel blanc et un râteau
const saline = {
  layers: [{
    frame: [-36, -40, 72, 52],
    n: 6,
    fps: 2,
    draw: (T, f, n) => {
      let out = T.shadow(0, 0, 0.42, 0.12);
      for (const [u, v, c] of [[-0.22, -0.18, '#9AD6F0'], [0.18, -0.18, '#C9E9F5'], [-0.22, 0.18, '#E6F4FA'], [0.18, 0.18, '#9AD6F0']]) {
        out += T.box(u - 0.17, v - 0.15, u + 0.17, v + 0.15, 0, 2.5, SALT) + T.face([[u - 0.14, v - 0.12, 2.6], [u + 0.14, v - 0.12, 2.6], [u + 0.14, v + 0.12, 2.6], [u - 0.14, v + 0.12, 2.6]], c);
      }
      const shine = Math.max(0, Math.sin((f / n) * TAU));
      const heap = (du, dv, h) => { const [hx, hy] = T.p(du, dv, 2.6); return `<path d="M${hx - 7},${hy} Q${hx},${hy - h * 2} ${hx + 7},${hy} Z" fill="#FFFFFF" stroke="${SALT.right}" stroke-width="0.6"/>`; };
      return out + heap(0.16, -0.16, 5) + heap(0.22, -0.2, 4) + star(...T.p(0.16, -0.16, 12), 2, '#FFFFFF', 0.3 + 0.7 * shine)
        + ln(T.p(-0.3, 0.38, 0), T.p(-0.06, 0.2, 16), WOOD.right, 1.2) + ln(T.p(-0.08, 0.18, 16), T.p(-0.02, 0.24, 15), WOOD.right, 2);
    }
  }]
};

// Serre tropicale (Potager) : une serre de verre aux montants de fer, pleine de palmes et de fruits dorés ; de la buée
const serre = {
  light: () => [0, 0, 16, 18, '190,255,170'],
  layers: [{
    frame: [-36, -58, 72, 72],
    n: 6,
    fps: 2,
    draw: (T, f, n) => {
      const GLASS_FACES = { top: 'rgba(225,243,255,.45)', left: 'rgba(196,228,246,.4)', right: 'rgba(160,205,232,.48)' };
      let out = T.shadow(0, 0, 0.42, 0.16) + T.box(-0.3, -0.24, 0.3, 0.24, 0, 3, STONE);
      // Plantes à l'intérieur (derrière le verre)
      const [x, y] = T.p(0, 0, 3);
      out += [-12, 0, 12].map((dx, k) => `<path d="M${x + dx},${y} q-6,-10 -12,-12 q6,0 12,6 q0,-12 6,-18 q-2,10 0,18 q6,-8 12,-8 q-6,4 -12,14 Z" fill="${k % 2 ? '#3E8A48' : '#5FAE5A'}"/>`).join('')
        + [[-8, -14], [6, -18], [14, -10]].map(([dx, dy]) => ell(x + dx, y + dy, 2.2, 2.8, '#F2B23C', ` stroke="#8A5A14" stroke-width="0.4"`)).join('');
      out += T.box(-0.3, -0.24, 0.3, 0.24, 3, 22, GLASS_FACES, ' stroke="rgba(255,255,255,.85)" stroke-width="0.8"');
      out += T.gable(-0.3, -0.24, 0.3, 0.24, 22, 10, { front: 'rgba(210,236,250,.55)', back: 'rgba(190,220,240,.5)', gable: 'rgba(170,210,235,.5)' }, 0.02, ' stroke="rgba(255,255,255,.85)" stroke-width="0.8"');
      for (let k = 0; k <= 4; k++) out += ln(T.p(-0.3 + k * 0.15, 0.24, 3), T.p(-0.3 + k * 0.15, 0.24, 22), DARK_IRON.left, 0.8);
      const p = f / n;
      return out + `<circle cx="${f2(x + 10)}" cy="${f2(y - 24 - p * 10)}" r="${f2(3 + p * 3)}" fill="rgba(255,255,255,${f2(0.4 * (1 - p))})"/>`;
    }
  }]
};

// Forge d'obsidienne (Carrière) : une enclume de pierre noire, un foyer de braises, des éclats taillés ; le feu brûle
const fonderie = {
  light: () => [-0.1, 0.05, 8, 26, '255,120,50', true],
  layers: [{
    frame: [-36, -54, 72, 68],
    n: 6,
    fps: 6,
    draw: (T, f, n) => {
      let out = T.shadow(0, 0, 0.42, 0.2) + T.box(-0.3, -0.24, 0.06, 0.12, 0, 12, OBSIDIAN);
      const [fx, fy] = T.p(-0.12, -0.06, 12);
      const k = f / n;
      out += ell(fx, fy, 9, 4, '#3A1A12') + ell(fx, fy, 7, 3, `rgba(255,${f2(110 + 60 * Math.sin(k * TAU))},40,.95)`);
      out += `<path d="M${fx - 4},${fy} Q${fx - 6},${fy - 10} ${fx},${fy - 16 - Math.sin(k * TAU) * 3} Q${fx + 6},${fy - 10} ${fx + 4},${fy} Z" fill="#F59A3C"/>`
        + `<path d="M${fx - 2},${fy} Q${fx - 3},${fy - 6} ${fx},${fy - 10} Q${fx + 3},${fy - 6} ${fx + 2},${fy} Z" fill="#FFE08A"/>`;
      // Hotte de pierre noire
      out += T.box(-0.26, -0.22, 0.02, 0.06, 26, 30, OBSIDIAN) + post(T, -0.25, -0.2, 12, 26, OBSIDIAN, 0.02) + post(T, 0.01, 0.04, 12, 26, OBSIDIAN, 0.02);
      // Enclume et éclats
      const [ax, ay] = T.p(0.24, 0.2, 0);
      out += T.box(0.18, 0.14, 0.3, 0.26, 0, 8, OBSIDIAN) + poly([[ax - 9, ay - 8], [ax + 9, ay - 9], [ax + 6, ay - 12], [ax - 6, ay - 12]], OBSIDIAN.top, EDGE);
      return out + [[-0.36, 0.32], [-0.24, 0.38], [0.04, 0.38]].map(([du, dv], i) => { const [sx, sy] = T.p(du, dv, 0); return poly([[sx - 2, sy], [sx + 2, sy], [sx + (i - 1), sy - 7]], OBSIDIAN.left, EDGE) + ln([sx, sy - 1], [sx + (i - 1) * 0.6, sy - 5], 'rgba(185,166,232,.6)', 0.6); }).join('')
        + (f % 3 === 0 ? dot(fx + 3, fy - 20, 0.9, '#FFC060') + dot(fx - 2, fy - 24, 0.8, '#FF9040') : '');
    }
  }]
};

export { glaciere, metier, hutte, saline, serre, fonderie };
