// Les articles de la boutique du Puits, dessinés aux abords du bâtiment (shopSprites.js les réunit ; repère et
// calques : voir son en-tête).
import { WOOD, WOOD_DARK, STONE } from '../palette';
import { IRON, COPPER, CAST, PAIL, wave, gradient, wheel, bucket, leaf, f2, ln, ell, dot } from '../spriteKit';

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
// Baguette de sourcier : la fourche de coudrier plane et frémit au-dessus de la source qu'elle a trouvée (palier V)
const sourcier = {
  layers: [{
    at: [0.92, -0.12],
    frame: [-18, -34, 36, 40],
    n: 6,
    fps: 4,
    draw: (T, level, f, n) => {
      const [x, y] = T.p(0, 0, 0);
      const cx = x;
      const cy = y - 17 + wave(f, n, 1.2);
      const ripple = (f % 3) / 3;
      const jet = [0, 1, 2].map(k => {
        const t = ((f / n) + k / 3) % 1;
        return dot(x + (k - 1) * 3 * t, y - 1 - Math.sin(t * Math.PI) * 5, 0.8, `rgba(150,215,245,${f2(1 - t * 0.6)})`);
      }).join('');
      return ell(x, y + 0.4, 7.6, 2.8, 'rgba(110,190,230,.45)') + ell(x, y + 0.2, 4.8, 1.7, '#5AAED7')
        + ell(x, y + 0.2, 3 + ripple * 5, 1 + ripple * 1.8, 'none', ` stroke="rgba(255,255,255,${f2(0.8 - ripple * 0.7)})" stroke-width="0.6"`)
        + T.pebble(-0.13, 0.04, 2) + T.pebble(0.11, 0.08, 1.8) + T.pebble(0.05, -0.11, 1.5)
        + [[-8, 1], [7, 2]].map(([dx, dy]) => `<path d="M${f2(x + dx - 2)},${f2(y + dy)} q1,-3 2,-1 q1,-3 2,1 Z" fill="#6DB64C"/>`).join('')
        + jet
        + ell(cx, cy + 8, 5, 1.4, 'rgba(255,240,180,.3)')
        + `<g transform="rotate(${f2(wave(f, n, 6, 1))} ${f2(cx)} ${f2(cy)})">`
        + `<path d="M${f2(cx - 7)},${f2(cy - 6)} Q${f2(cx - 3)},${f2(cy - 2)} ${f2(cx)},${f2(cy + 2)} M${f2(cx + 7)},${f2(cy - 6)} Q${f2(cx + 3)},${f2(cy - 2)} ${f2(cx)},${f2(cy + 2)} L${f2(cx)},${f2(cy + 6)}" stroke="${WOOD.right}" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`
        + `<path d="M${f2(cx - 6.6)},${f2(cy - 6.4)} Q${f2(cx - 3)},${f2(cy - 2.6)} ${f2(cx - 0.4)},${f2(cy + 1.4)}" stroke="${WOOD.top}" stroke-width="0.5" fill="none"/>`
        + leaf(cx + 4.6, cy - 3.8, -50, 0.28) + '</g>';
    }
  }]
};
// Mare aux canards : une cane blanche et ses deux canetons en font le tour, entre les roseaux (palier VI)
function duck(x, y, s, flip, adult) {
  const d = flip ? -1 : 1;
  const X = dx => f2(x + d * dx * s);
  const Y = dy => f2(y + dy * s);
  const body = adult ? '#FFFDF8' : '#FFE07A';
  const wing = adult ? '#E9DFCB' : '#F2C94E';
  return ell(x - d * 3 * s, y + 0.4, 4 * s, 1.1 * s, 'none', ' stroke="rgba(255,255,255,.65)" stroke-width="0.6"')
    + `<path d="M${X(-4.6)},${Y(-1.2)} L${X(-6)},${Y(-4.2)} L${X(-3)},${Y(-3)} Z" fill="${wing}"/>`
    + `<path d="M${X(-4.6)},${Y(-1.2)} Q${X(-5)},${Y(-4.6)} ${X(-1)},${Y(-4)} Q${X(3)},${Y(-3.8)} ${X(4)},${Y(-1.4)} Q${X(0)},${Y(0.6)} ${X(-4.6)},${Y(-1.2)} Z" fill="${body}" stroke="rgba(60,40,25,.3)" stroke-width="0.5"/>`
    + `<path d="M${X(-2.6)},${Y(-2.6)} Q${X(-0.4)},${Y(-4.2)} ${X(1.8)},${Y(-2.4)} Q${X(-0.4)},${Y(-1.4)} ${X(-2.6)},${Y(-2.6)} Z" fill="${wing}"/>`
    + `<path d="M${X(1.6)},${Y(-3.4)} L${X(2.2)},${Y(-6.4)} L${X(3.6)},${Y(-6)} L${X(3.4)},${Y(-2.8)} Z" fill="${body}"/>`
    + dot(x + d * 2.8 * s, y - 6.6 * s, 2 * s, body)
    + `<path d="M${X(4.4)},${Y(-6.8)} l${f2(d * 2.6 * s)},${f2(0.6 * s)} l${f2(-d * 2.6 * s)},${f2(0.8 * s)} Z" fill="#F08A3A"/>`
    + dot(x + d * 3.4 * s, y - 7.2 * s, 0.5 * s, '#2A2420');
}
const canards = {
  layers: [{
    at: [0.78, 0.74],
    frame: [-26, -28, 52, 34],
    n: 12,
    fps: 2,
    draw: (T, level, f, n) => {
      const [x, y] = T.p(0, 0, 0);
      const reed = (dx, dy, k) => ln([x + dx, y + dy], [x + dx + (k % 2 ? 0.8 : -0.6), y + dy - 9 - (k % 2) * 2], '#6FA35A', 0.8) + ell(x + dx + (k % 2 ? 0.8 : -0.6), y + dy - 8 - (k % 2) * 2, 0.9, 2.2, '#8B5631');
      const swimmers = [[0, 1.1, true], [0.8, 0.6, false], [1.4, 0.6, false]].map(([lag, s, adult]) => {
        const a = (f / n) * Math.PI * 2 - lag;
        return { y: y - 0.6 + Math.sin(a) * 3, svg: duck(x + Math.cos(a) * 8, y - 0.6 + Math.sin(a) * 3, s, Math.sin(a) > 0, adult) };
      }).sort((p, q) => p.y - q.y).map(p => p.svg).join('');
      return ell(x, y + 0.6, 16, 7.4, '#79BE5C') + ell(x, y, 14, 6.2, '#5AAED7') + ell(x - 3.6, y - 2, 6, 1.8, 'rgba(255,255,255,.3)')
        + reed(-10, -3, 0) + reed(-8, -4.6, 1) + reed(8.6, -4.2, 2) + reed(10.8, -2.8, 3)
        + swimmers
        + T.pebble(0.22, 0.1, 1.8) + T.pebble(-0.16, 0.2, 1.6)
        + [[-12, 4], [11, 4.4]].map(([dx, dy]) => `<path d="M${f2(x + dx - 2)},${f2(y + dy)} q1,-3 2,-1 q1,-3 2,1 Z" fill="#6DB64C"/>`).join('');
    }
  }]
};
// Statue de la naïade : sur son socle, elle verse l'eau de son urne dans une vasque ; elle luit la nuit (palier VII)
const NAIAD_AT = [-0.9, 0.1];
const MARBLE = { top: '#FFFFFF', left: '#ECEAF2', right: '#C3BFD0' };
const naiade = {
  light: () => [NAIAD_AT[0], NAIAD_AT[1], 14, 22, '170,225,255'],
  layers: [{
    at: NAIAD_AT,
    frame: [-22, -60, 44, 66],
    n: 8,
    fps: 6,
    draw: (T, level, f) => {
      const [wx, wy] = T.p(0, 0, 6);
      const [x, y] = T.p(0, 0, 17);
      const marble = T.id('marble');
      const [ux, uy] = [x - 5.4, y - 14.6];
      const ripple = (f % 4) / 4;
      return T.shadow(0, 0, 0.24, 0.22)
        + T.cyl(0, 0, 0, 6, 0.22, MARBLE, 'basin') + T.disc(0, 0, 6, 0.19, '#7CC8EC') + ell(wx - 3, wy - 1, 4, 1, 'rgba(255,255,255,.45)')
        + T.box(-0.06, -0.06, 0.06, 0.06, 6, 17, MARBLE)
        + gradient(marble, '#FFFFFF', '#C9C5D6')
        // Robe drapée, buste, bras, tête et chignon
        + `<path d="M${f2(x - 3.6)},${f2(y - 13)} L${f2(x + 3.4)},${f2(y - 13)} Q${f2(x + 5.4)},${f2(y - 5)} ${f2(x + 5.2)},${f2(y)} L${f2(x - 5)},${f2(y)} Q${f2(x - 5.4)},${f2(y - 6)} ${f2(x - 3.6)},${f2(y - 13)} Z" fill="url(#${marble})" stroke="rgba(90,80,110,.35)" stroke-width="0.5"/>`
        + [-2, 0.6, 3].map(dx => `<path d="M${f2(x + dx * 0.6)},${f2(y - 12)} q${f2(dx * 0.3)},6 ${f2(dx * 0.8)},11.6" stroke="rgba(120,110,140,.3)" stroke-width="0.5" fill="none"/>`).join('')
        + `<path d="M${f2(x - 3)},${f2(y - 20)} L${f2(x + 3)},${f2(y - 20)} L${f2(x + 3.4)},${f2(y - 13)} L${f2(x - 3.6)},${f2(y - 13)} Z" fill="url(#${marble})" stroke="rgba(90,80,110,.35)" stroke-width="0.5"/>`
        + `<path d="M${f2(x + 2.8)},${f2(y - 19.4)} q2.6,3 0.6,6.6" stroke="#E4E1EC" stroke-width="1.6" fill="none" stroke-linecap="round"/>`
        + dot(x, y - 23, 2.7, '#F4F2F8') + dot(x + 1.6, y - 24.6, 1.6, '#E4E1EC') + `<path d="M${f2(x + 2)},${f2(y - 23)} q1.4,3 0.4,5" stroke="#DAD6E4" stroke-width="1" fill="none"/>`
        + `<path d="M${f2(x - 2.6)},${f2(y - 19.4)} q-2.8,1.6 -2.4,4.6" stroke="#E4E1EC" stroke-width="1.6" fill="none" stroke-linecap="round"/>`
        // Urne inclinée et son filet d'eau qui tombe dans la vasque
        + `<g transform="rotate(-38 ${f2(ux)} ${f2(uy)})">${ell(ux, uy, 2.6, 3.2, '#E4E1EC', ' stroke="rgba(90,80,110,.4)" stroke-width="0.5"')}<rect x="${f2(ux - 1.3)}" y="${f2(uy - 4.8)}" width="2.6" height="1.8" fill="#DAD6E4"/></g>`
        + `<path d="M${f2(ux - 3.6)},${f2(uy - 2)} Q${f2(ux - 6)},${f2(uy + 2)} ${f2(ux - 5.4)},${f2(wy - 1)}" stroke="rgba(170,225,255,.45)" stroke-width="3" fill="none"/>`
        + `<path d="M${f2(ux - 3.6)},${f2(uy - 2)} Q${f2(ux - 6)},${f2(uy + 2)} ${f2(ux - 5.4)},${f2(wy - 1)}" stroke="#E8F7FF" stroke-width="1.2" fill="none" stroke-dasharray="2.2 1.4" stroke-dashoffset="${f2(-f * 0.9)}"/>`
        + ell(ux - 5.4, wy - 0.6, 1.6 + ripple * 4, 0.6 + ripple * 1.4, 'none', ` stroke="rgba(255,255,255,${f2(0.85 - ripple * 0.75)})" stroke-width="0.6"`);
    }
  }]
};

export default {
  'seau-cuivre': seauCuivre,
  poulie,
  abreuvoir,
  pompe,
  sourcier,
  canards,
  naiade
};
