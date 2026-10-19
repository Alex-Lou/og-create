// Les créations de climat (lot 9d) : igloo, sculpture, parc à moutons, cairn, passerelle, héron, tente, cadran de
// sel, hamac, totem, obélisque, bassin chaud (craftSprites.js les réunit).
import { EDGE } from '../iso';
import { WOOD_DARK, STONE } from '../palette';
import { ln, poly, ell, dot, wave, star, OUT, f2 } from '../spriteKit';
import { TAU, post, rail, leaves } from './kit';

const ICE = { top: '#E9F8FF', left: '#BFE7F7', right: '#8CCBE8' };

const SNOW_BLOCK = { top: '#FFFFFF', left: '#EEF4FA', right: '#CFDDEA' };

const OBSIDIAN = { top: '#4A4258', left: '#2C2A34', right: '#1C1A22' };

const SANDSTONE = { top: '#E6CFA0', left: '#CDB07A', right: '#A88A58' };

const REED = { top: '#D8C27A', left: '#C2A65A', right: '#9E8440' };

const JUNGLE_WOOD = { top: '#B07A48', left: '#8C5A30', right: '#6A4222' };

// Igloo : un dôme de blocs de neige, son entrée en tunnel ; la nuit, une lueur dorée par la porte
const igloo = {
  light: () => [0, 0.36, 6, 12, '255,214,140'],
  layers: [{
    frame: [-34, -40, 68, 54],
    draw: T => {
      const [x, y] = T.p(0, 0, 0);
      let out = T.shadow(0, 0, 0.4, 0.14) + `<path d="M${x - 24},${y} A24,24 0 0 1 ${x + 24},${y} Q${x},${y + 10} ${x - 24},${y} Z" fill="${SNOW_BLOCK.left}" stroke="${SNOW_BLOCK.right}" stroke-width="0.8"/>`;
      // Joints des blocs : rangs, puis briques décalées
      for (const [r, k] of [[19, 0], [13, 1], [7, 0]]) {
        out += `<path d="M${f2(x - Math.sqrt(576 - r * r))},${f2(y - r + 1)} Q${x},${f2(y - r + 5)} ${f2(x + Math.sqrt(576 - r * r))},${f2(y - r + 1)}" stroke="${SNOW_BLOCK.right}" stroke-width="0.6" fill="none"/>`;
        for (let i = -2; i <= 2; i++) out += ln([x + i * 8 + k * 4, y - r + 2], [x + i * 8 + k * 4, y - r - 4], SNOW_BLOCK.right, 0.5);
      }
      out += `<path d="M${x + 6},${y - 22} A18,18 0 0 1 ${x + 22},${y - 6}" stroke="#FFFFFF" stroke-width="2" fill="none" stroke-linecap="round"/>`;
      // Tunnel d'entrée vers le joueur
      const [dx, dy] = T.p(0.05, 0.38, 0);
      return out + `<path d="M${dx - 9},${dy} L${dx - 9},${dy - 9} A9,8 0 0 1 ${dx + 9},${dy - 9} L${dx + 9},${dy} Z" fill="${SNOW_BLOCK.top}" stroke="${SNOW_BLOCK.right}" stroke-width="0.8"/>`
        + `<path d="M${dx - 5},${dy} L${dx - 5},${dy - 7} A5,5 0 0 1 ${dx + 5},${dy - 7} L${dx + 5},${dy} Z" fill="#3C5A78"/>`;
    }
  }]
};

// Sculpture de glace : un cygne de glace sur son socle, qui scintille
const sculpture = {
  layers: [{
    frame: [-30, -64, 60, 78],
    n: 6,
    fps: 3,
    draw: (T, f, n) => {
      const [x, y] = T.p(0, 0, 10);
      const glint = Math.max(0, Math.sin((f / n) * TAU));
      return T.shadow(0, 0, 0.32, 0.16) + T.box(-0.2, -0.2, 0.2, 0.2, 0, 10, ICE)
        + `<path d="M${x - 16},${y - 4} Q${x - 10},${y - 18} ${x + 4},${y - 14} Q${x + 14},${y - 12} ${x + 16},${y - 4} Q${x},${y + 2} ${x - 16},${y - 4} Z" fill="${ICE.left}" stroke="${ICE.right}" stroke-width="0.8"/>`
        + `<path d="M${x - 2},${y - 14} Q${x - 10},${y - 30} ${x - 4},${y - 40} Q${x + 2},${y - 46} ${x + 6},${y - 40}" stroke="${ICE.left}" stroke-width="5" fill="none" stroke-linecap="round"/>`
        + `<path d="M${x + 6},${y - 40} l5,2 l-5,1 Z" fill="${ICE.right}"/>`
        + `<path d="M${x - 12},${y - 8} Q${x - 4},${y - 22} ${x + 10},${y - 10}" stroke="#FFFFFF" stroke-width="1.2" fill="none" opacity=".8"/>`
        + (glint > 0.1 ? star(x - 4, y - 36, 2 + 3 * glint, '#FFFFFF', glint) : '') + star(x + 10, y - 10, 2, '#FFFFFF', 1 - glint * 0.7);
    }
  }]
};

// Enclos à moutons : une barrière de bois en rond, deux moutons qui broutent
function sheep(x, y, flip, graze) {
  const s = flip ? -1 : 1;
  const hx = x + s * 8, hy = y - 8 + graze * 4;
  return ell(x, y + 0.5, 8, 2.2, 'rgba(40,55,20,.22)') + [-4, -1.5, 2, 4.5].map(dx => ln([x + s * dx, y - 3], [x + s * dx, y], '#4A3E36', 1.2)).join('')
    + ell(x, y - 6, 8, 5, '#F7F2E6', ` stroke="${OUT}" stroke-width="0.5"`) + [-5, -1, 3].map(dx => dot(x + s * dx, y - 9, 3.6, '#F7F2E6')).join('')
    + ell(hx, hy, 2.6, 2, '#3D342E') + dot(hx + s * 0.8, hy - 0.6, 0.45, '#F4ECDC');
}

const parc = {
  layers: [{
    frame: [-36, -32, 72, 46],
    n: 4,
    fps: 2,
    draw: (T, f) => {
      const corners = [[-0.4, -0.36], [0.4, -0.36], [0.4, 0.36], [-0.4, 0.36]];
      let out = T.face(corners.map(([u, v]) => [u, v, 0]), 'rgba(140,170,90,.35)');
      const back = [[corners[3], corners[0]], [corners[0], corners[1]]];
      const front = [[corners[1], corners[2]], [corners[2], corners[3]]];
      const fence = ([a, b]) => rail(T, a, b, 5) + rail(T, a, b, 10) + post(T, a[0], a[1], 0, 13) + post(T, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2, 0, 13);
      out += back.map(fence).join('');
      const [x, y] = T.p(0, 0, 0);
      out += sheep(x - 8, y - 2, false, f % 2) + sheep(x + 9, y + 3, true, (f + 1) % 2);
      return out + front.map(fence).join('') + post(T, corners[2][0], corners[2][1], 0, 13);
    }
  }]
};

// Cairn aux rubans : des pierres empilées, des rubans de laine colorés qui flottent au vent
const cairn = {
  layers: [{
    frame: [-30, -60, 64, 74],
    n: 6,
    fps: 5,
    draw: (T, f, n) => {
      let out = T.shadow(0, 0, 0.3, 0.18);
      let z = 0;
      [[12, 5.6], [10, 5], [8.2, 4.4], [6.4, 3.8], [4.6, 3]].forEach(([rx, ry], i) => {
        const [x, y] = T.p(0, 0, z + ry);
        out += ell(x + (i % 2 ? 1 : -1), y, rx, ry, i % 2 ? STONE.left : STONE.right, ` stroke="${OUT}" stroke-width="0.5"`) + ell(x - rx * 0.3, y - ry * 0.3, rx * 0.4, ry * 0.3, 'rgba(255,255,255,.3)');
        z += ry * 1.7;
      });
      const [tx, ty] = T.p(0, 0, z);
      out += ln([tx, ty], [tx, ty - 16], WOOD_DARK.right, 1.4);
      ['#E2574C', '#F2C04B', '#6FA3D9'].forEach((c, k) => {
        const w = wave(f, n, 3, k * 1.3);
        out += `<path d="M${tx},${ty - 15 + k * 4} q8,${f2(-2 + w)} 16,${f2(w)} q-8,${f2(3 + w * 0.5)} -16,2 Z" fill="${c}" stroke="${OUT}" stroke-width="0.3"/>`;
      });
      return out;
    }
  }]
};

// Passerelle de roseaux : un platelage de roseaux liés sur pilotis, au-dessus du marais ; une libellule passe
const passerelle = {
  layers: [{
    frame: [-38, -30, 76, 44],
    n: 6,
    fps: 4,
    draw: (T, f, n) => {
      let out = '';
      for (const u of [-0.36, 0, 0.36]) for (const v of [-0.14, 0.14]) out += post(T, u, v, -3, 6, WOOD_DARK, 0.02);
      out += T.box(-0.44, -0.18, 0.44, 0.18, 6, 8, REED);
      for (let k = -4; k <= 4; k++) out += ln(T.p(k * 0.1, -0.18, 8.1), T.p(k * 0.1, 0.18, 8.1), 'rgba(120,90,40,.45)', 0.6);
      out += rail(T, [-0.44, 0.18], [0.44, 0.18], 14) + post(T, -0.44, 0.18, 8, 15) + post(T, 0.44, 0.18, 8, 15) + post(T, 0, 0.18, 8, 15);
      const p = f / n;
      const [lx, ly] = T.p(-0.4 + p * 0.8, -0.3, 20 + Math.sin(p * TAU) * 4);
      return out + ln([lx - 3, ly], [lx + 3, ly], '#3C7FB0', 1.2) + ell(lx, ly - 1.4, 2.6, 0.9, 'rgba(220,240,255,.8)') + ell(lx, ly + 1.4, 2.6, 0.9, 'rgba(220,240,255,.8)');
    }
  }]
};

// Héron de bois : un échassier sculpté, perché sur une patte, au bec pointé vers l'eau ; il hoche la tête
const heron = {
  layers: [{
    frame: [-24, -66, 48, 78],
    n: 6,
    fps: 2,
    draw: (T, f) => {
      const [x, y] = T.p(0, 0, 0);
      const nod = f % 3 === 0 ? 3 : 0;
      return T.shadow(0, 0, 0.2, 0.16) + T.cyl(0, 0, 0, 4, 0.12, WOOD_DARK, 'socle')
        + ln([x, y - 4], [x, y - 26], '#8C5A30', 1.6) + ln([x, y - 18], [x + 4, y - 14], '#8C5A30', 1.2)
        + `<path d="M${x - 10},${y - 30} Q${x - 4},${y - 40} ${x + 8},${y - 34} Q${x + 2},${y - 26} ${x - 10},${y - 30} Z" fill="#B88A5A" stroke="${OUT}" stroke-width="0.6"/>`
        + `<path d="M${x + 6},${y - 34} Q${x + 10},${y - 44} ${x + 6},${y - 50}" stroke="#B88A5A" stroke-width="3" fill="none" stroke-linecap="round"/>`
        + dot(x + 6, y - 51 + nod * 0.5, 3, '#C9A06A') + `<path d="M${x + 8},${y - 51 + nod * 0.5} l11,${2 + nod} l-11,1.6 Z" fill="#7A5230"/>`
        + dot(x + 6.8, y - 52 + nod * 0.5, 0.6, '#2A2420');
    }
  }]
};

// Tente nomade : une toile rayée tendue sur ses mâts, un tapis, une jarre ; le pan d'entrée bat au vent
const tente = {
  layers: [{
    frame: [-38, -52, 76, 66],
    n: 4,
    fps: 3,
    draw: (T, f) => {
      const top = T.p(0, 0, 34);
      const pts = [T.p(-0.4, -0.3, 0), T.p(0.4, -0.3, 0), T.p(0.4, 0.3, 0), T.p(-0.4, 0.3, 0)];
      const flap = f % 2 ? 3 : 0;
      let out = T.shadow(0, 0, 0.44, 0.16) + T.face([[-0.3, 0.32, 0], [0.3, 0.32, 0], [0.3, 0.5, 0], [-0.3, 0.5, 0]], '#B8473A');
      out += poly([pts[0], pts[1], top], '#E8D8B8') + poly([pts[1], pts[2], top], '#C9B48C') + poly([pts[3], pts[0], top], '#F2E6CC');
      out += poly([pts[2], pts[3], top], '#F2E6CC', ` stroke="${OUT}" stroke-width="0.6"`);
      for (let k = 1; k < 4; k++) out += ln([pts[3][0] + (pts[2][0] - pts[3][0]) * k / 4, pts[3][1] + (pts[2][1] - pts[3][1]) * k / 4], top, '#C9473A', 1.6);
      const [dx, dy] = T.p(0, 0.3, 0);
      out += `<path d="M${dx - 6},${dy} L${dx},${dy - 18} L${dx + 6 + flap},${dy} Z" fill="#5A2E22"/>`;
      return out + ln(top, [top[0], top[1] - 6], WOOD_DARK.right, 1.2) + `<path d="M${top[0]},${top[1] - 6} l7,2 l-7,2 Z" fill="#E2574C"/>`
        + T.cyl(0.42, 0.1, 0, 8, 0.06, { top: '#C98A5A', left: '#B06A3E', right: '#8A4E2A' }, 'jarre');
    }
  }]
};

// Cadran de sel : un disque de sel blanc gravé des heures, un gnomon de grès ; l'ombre tourne
const cadransel = {
  layers: [{
    frame: [-34, -40, 68, 52],
    n: 8,
    fps: 1,
    draw: (T, f, n) => {
      const [x, y] = T.p(0, 0, 4);
      let out = T.shadow(0, 0, 0.4, 0.12) + T.cyl(0, 0, 0, 4, 0.38, { top: '#FFFFFF', left: '#EDE6DE', right: '#CFC4B6' }, 'sel');
      for (let k = 0; k < 12; k++) {
        const a = (k / 12) * TAU;
        out += ln([x + Math.cos(a) * 14, y + Math.sin(a) * 7], [x + Math.cos(a) * 17, y + Math.sin(a) * 8.5], '#B8A898', 0.9);
      }
      const a = (f / n) * TAU * 0.5 + Math.PI * 0.75;
      out += `<path d="M${x},${y} L${f2(x + Math.cos(a) * 16)},${f2(y + Math.sin(a) * 8)}" stroke="rgba(90,70,50,.35)" stroke-width="3" stroke-linecap="round"/>`;
      return out + poly([[x - 2, y], [x + 2, y], [x + 1, y - 22]], SANDSTONE.left, EDGE) + poly([[x + 2, y], [x + 4, y - 1], [x + 1, y - 22]], SANDSTONE.right, EDGE)
        + star(x + 8, y - 4, 2, '#FFFFFF', 0.8);
    }
  }]
};

// Hamac : une toile tendue entre deux poteaux sculptés, qui se balance doucement ; un fruit oublié dessus
const hamac = {
  layers: [{
    frame: [-38, -46, 76, 58],
    n: 6,
    fps: 3,
    draw: (T, f, n) => {
      const a = T.p(-0.38, 0.1, 26), b = T.p(0.38, -0.1, 26);
      const sway = wave(f, n, 2);
      const mid = [(a[0] + b[0]) / 2 + sway, (a[1] + b[1]) / 2 + 12];
      return T.shadow(0, 0, 0.42, 0.14) + post(T, -0.38, 0.1, 0, 28, JUNGLE_WOOD, 0.035) + post(T, 0.38, -0.1, 0, 28, JUNGLE_WOOD, 0.035)
        + `<path d="M${f2(a[0])},${f2(a[1])} Q${f2(mid[0])},${f2(mid[1] + 6)} ${f2(b[0])},${f2(b[1])} Q${f2(mid[0])},${f2(mid[1] - 2)} ${f2(a[0])},${f2(a[1])} Z" fill="#E8A13A" stroke="${OUT}" stroke-width="0.6"/>`
        + `<path d="M${f2(a[0] + 4)},${f2(a[1] + 3)} Q${f2(mid[0])},${f2(mid[1] + 3)} ${f2(b[0] - 4)},${f2(b[1] + 3)}" stroke="#C9473A" stroke-width="1.6" fill="none"/>`
        + ell(mid[0] + 4, mid[1] + 1, 2.6, 3, '#F2B23C', ` stroke="#8A5A14" stroke-width="0.4"`)
        + leaves(a[0] - 2, a[1] - 4, 4) + leaves(b[0] + 2, b[1] - 4, 4);
    }
  }]
};

// Totem : trois visages sculptés empilés, peints de vives couleurs, des ailes au sommet
const totem = {
  layers: [{
    frame: [-30, -82, 60, 94],
    draw: T => {
      const [x, y] = T.p(0, 0, 0);
      const face = (yy, c, k) => `<rect x="${x - 7}" y="${yy - 14}" width="14" height="14" rx="2" fill="${c}" stroke="${OUT}" stroke-width="0.7"/>`
        + dot(x - 3, yy - 9, 1.6, '#FFFFFF') + dot(x + 3, yy - 9, 1.6, '#FFFFFF') + dot(x - 3, yy - 9, 0.8, '#2A2420') + dot(x + 3, yy - 9, 0.8, '#2A2420')
        + (k % 2 ? `<path d="M${x - 4},${yy - 4} h8" stroke="#2A2420" stroke-width="1.4"/>` : `<path d="M${x - 4},${yy - 5} q4,3 8,0" stroke="#2A2420" stroke-width="1.2" fill="none"/>`)
        + `<path d="M${x - 1},${yy - 8} l1,-3 l1,3 Z" fill="#F2C04B"/>`;
      return T.shadow(0, 0, 0.2, 0.18) + face(y, '#B8473A', 0) + face(y - 14, '#3E8A48', 1) + face(y - 28, '#3D7FD0', 2)
        + `<path d="M${x - 7},${y - 46} L${x - 22},${y - 52} L${x - 7},${y - 40} Z M${x + 7},${y - 46} L${x + 22},${y - 52} L${x + 7},${y - 40} Z" fill="#F2C04B" stroke="${OUT}" stroke-width="0.6"/>`
        + `<path d="M${x - 7},${y - 42} L${x},${y - 56} L${x + 7},${y - 42} Z" fill="#E8A13A" stroke="${OUT}" stroke-width="0.6"/>`;
    }
  }]
};

// Obélisque d'obsidienne : une aiguille noire et lisse, gravée de signes qui rougeoient comme des braises
const obelisque = {
  light: () => [0, 0, 30, 18, '255,120,60'],
  layers: [{
    frame: [-26, -82, 52, 94],
    n: 6,
    fps: 3,
    draw: (T, f, n) => {
      const [x, y] = T.p(0, 0, 0);
      const glow = 0.45 + 0.4 * Math.sin((f / n) * TAU);
      return T.shadow(0, 0, 0.26, 0.2) + T.box(-0.18, -0.18, 0.18, 0.18, 0, 6, OBSIDIAN)
        + poly([[x - 8, y - 6], [x, y - 2], [x, y - 62], [x - 5, y - 58]], OBSIDIAN.left, EDGE) + poly([[x, y - 2], [x + 8, y - 6], [x + 5, y - 58], [x, y - 62]], OBSIDIAN.right, EDGE)
        + poly([[x - 5, y - 58], [x, y - 62], [x + 5, y - 58], [x, y - 70]], OBSIDIAN.top, EDGE)
        + ln([x - 3, y - 16], [x - 3, y - 46], 'rgba(185,166,232,.5)', 0.8)
        + [20, 30, 40].map(z => `<path d="M${x - 5},${y - z} l2,-3 l2,3 M${x + 2},${y - z - 4} h3" stroke="rgba(255,130,60,${f2(glow)})" stroke-width="1" fill="none"/>`).join('');
    }
  }]
};

// Bassin chaud : une source chaude bordée de pierres noires, de l'eau turquoise et de la vapeur qui monte
const bassinchaud = {
  layers: [{
    frame: [-38, -56, 76, 70],
    n: 6,
    fps: 3,
    draw: (T, f, n) => {
      let out = T.shadow(0, 0, 0.44, 0.16) + T.disc(0, 0, 1, 0.42, OBSIDIAN.left, EDGE) + T.disc(0, 0, 2, 0.34, '#5FC9C4') + T.disc(-0.06, -0.04, 2.2, 0.16, 'rgba(255,255,255,.35)');
      for (let k = 0; k < 9; k++) {
        const a = (k / 9) * TAU;
        const [px, py] = T.p(Math.cos(a) * 0.4, Math.sin(a) * 0.4, 2);
        out += ell(px, py, 4.2, 2.6, k % 2 ? OBSIDIAN.top : OBSIDIAN.right, ` stroke="${OUT}" stroke-width="0.4"`);
      }
      const [x, y] = T.p(0, 0, 4);
      for (let k = 0; k < 3; k++) {
        const p = ((f / n) + k / 3) % 1;
        out += `<circle cx="${f2(x - 8 + k * 8 + Math.sin(p * 5) * 3)}" cy="${f2(y - p * 34)}" r="${f2(4 + p * 6)}" fill="rgba(245,248,250,${f2(0.45 * (1 - p))})"/>`;
      }
      return out;
    }
  }]
};

export { igloo, sculpture, parc, cairn, passerelle, heron, tente, cadransel, hamac, totem, obelisque, bassinchaud };
