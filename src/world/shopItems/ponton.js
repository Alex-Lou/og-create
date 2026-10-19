// Les articles de la boutique du Ponton, dessinés aux abords du bâtiment (shopSprites.js les réunit ; repère et
// calques : voir son en-tête).
import { EDGE } from '../iso';
import { WOOD, WOOD_DARK, STONE } from '../palette';
import { IRON, PAIL, OUT, wave, bucket, stone, f2, ln, poly, ell, dot, xy } from '../spriteKit';

// Canne dans son support au bord du ponton, la ligne et le bouchon dans l'eau ; seau de poissons à côté.
// Niveau 1 : bord avant de l'appontement ; niveau 2 : bout de la jetée en L, la ligne dans l'eau à sa droite.
const CANNE = {
  1: { at: [0.62, 0.2], tip: [0.08, 0.26, 34], bob: [-0.02, 0.28], pail: [0.12, -0.1] },
  2: { at: [0.73, 0.45], tip: [0.13, -0.07, 28], bob: [0.09, -0.13], pail: [-0.1, 0.16] }
};
const canne = {
  layers: [{
    at: { 1: CANNE[1].at, 2: CANNE[2].at },
    frame: [-26, -40, 42, 54],
    n: 8,
    fps: 4,
    draw: (T, level, f, n) => {
      const c = CANNE[Math.min(level, 2)];
      const [bx, by] = T.p(0, 0, 10);
      const [tx, ty] = T.p(...c.tip);
      const dip = f === 5 || f === 6 ? 1.8 : wave(f, n, 0.5);
      const [ox, oy] = T.p(c.bob[0], c.bob[1], 0);
      const ripple = (f % 4) / 4;
      const [px, py] = T.p(c.pail[0], c.pail[1], 10);
      return ell(ox, oy + 0.6, 3 + ripple * 5, 1.1 + ripple * 1.8, 'none', ` stroke="rgba(255,255,255,${f2(0.8 - ripple * 0.7)})" stroke-width="0.7"`)
        + `<path d="M${f2(tx)},${f2(ty)} Q${f2((tx + ox) / 2 + 2)},${f2((ty + oy) / 2 + 2)} ${f2(ox)},${f2(oy - 1 + dip)}" stroke="rgba(255,255,255,.8)" stroke-width="0.5" fill="none"/>`
        + dot(ox, oy - 1.4 + dip, 1.9, '#E2463A') + `<path d="M${f2(ox - 1.9)},${f2(oy - 1.4 + dip)} a1.9,1.9 0 0 0 3.8,0 Z" fill="#FFFDF8"/>`
        + ln([ox, oy - 3.2 + dip], [ox, oy - 4.8 + dip], '#3D3A36', 0.6)
        // Seau de poissons : une queue qui frétille
        + bucket(T, c.pail[0], c.pail[1], 10, 6, 3.4, 4.2, PAIL, 'pail', false)
        + `<path d="M${f2(px - 1)},${f2(py - 6.4)} l${f2(-2.4 + (f % 2) * 1.2)},-3.4 l2.6,0.8 Z" fill="#9FB8C8"/>`
        + ell(px + 1, py - 6.2, 2, 0.9, '#C7D6E0')
        // Support et canne
        + T.box(-0.02, -0.02, 0.02, 0.02, 10, 15, WOOD_DARK)
        + `<path d="M${f2(bx)},${f2(by - 3)} Q${f2((bx + tx) / 2 - 1.5)},${f2((by + ty) / 2 - 3)} ${f2(tx)},${f2(ty)}" stroke="${WOOD_DARK.right}" stroke-width="1.4" fill="none" stroke-linecap="round"/>`
        + dot(bx + (tx - bx) * 0.18, by - 3 + (ty - by) * 0.16, 1.4, '#3D3A36');
    }
  }]
};
const filet = {
  layers: [{
    at: { 1: [0.34, -0.06], 2: [0.6, -0.04] },
    frame: [-18, -24, 36, 28],
    draw: T => {
      const [x, y] = T.p(0, 0, 10);
      const heap = `M${f2(x - 11)},${f2(y + 1)} Q${f2(x - 10)},${f2(y - 6)} ${f2(x - 4)},${f2(y - 7)} Q${f2(x + 1)},${f2(y - 11)} ${f2(x + 6)},${f2(y - 6)} Q${f2(x + 11)},${f2(y - 4)} ${f2(x + 10)},${f2(y + 1.5)} Q${f2(x)},${f2(y + 4.5)} ${f2(x - 11)},${f2(y + 1)} Z`;
      let mesh = '';
      for (let k = -14; k <= 14; k += 2.6) mesh += ln([x + k - 6, y + 4], [x + k + 4, y - 11], 'rgba(120,85,45,.55)', 0.5) + ln([x + k + 6, y + 4], [x + k - 4, y - 11], 'rgba(120,85,45,.55)', 0.5);
      const floats = [[-9, 0], [-4, 2.6], [2, 3], [8, 0.6]].map(([dx, dy], k) => ell(x + dx, y + dy, 2, 1.4, k % 2 ? '#FFFDF8' : '#F08A3A', ` stroke="${OUT}" stroke-width="0.5"`)).join('');
      return ell(x + 1, y + 2.6, 12, 3, 'rgba(40,30,20,.22)')
        + `<defs><clipPath id="${T.id('net')}"><path d="${heap}"/></clipPath></defs>`
        + `<path d="${heap}" fill="#D9BC8C" stroke="#A88350" stroke-width="0.8"/>`
        + `<g clip-path="url(#${T.id('net')})">${mesh}<path d="M${f2(x - 8)},${f2(y - 1)} q7,-4 15,0" stroke="rgba(255,255,255,.35)" stroke-width="1.6" fill="none"/></g>`
        + `<path d="M${f2(x - 1)},${f2(y - 5.4)} q3,-2 6,0 q-3,2 -6,0 Z M${f2(x + 5)},${f2(y - 5.4)} l2,-1.6 l0,3.2 Z" fill="#B8CCD8"/>` + dot(x + 0.6, y - 5.6, 0.4, '#2A2420')
        + floats;
    }
  }]
};
// Casier à crabes en lattes sur le sable, bouée et cordage ; un crabe trottine de côté
const casier = {
  layers: [{
    at: [-0.84, 0.46],
    frame: [-18, -24, 40, 30],
    draw: T => {
      const slatL = [-0.07, -0.025, 0.02, 0.065].map(du => T.face([[du, 0.08, 0], [du + 0.022, 0.08, 0], [du + 0.022, 0.08, 12], [du, 0.08, 12]], WOOD.top, EDGE)).join('');
      const slatR = [-0.05, 0, 0.05].map(dv => T.face([[0.1, dv, 0], [0.1, dv + 0.022, 0], [0.1, dv + 0.022, 12], [0.1, dv, 12]], WOOD.left, EDGE)).join('');
      const [bx, by] = T.p(0.2, 0.16, 0);
      const [rx, ry] = T.p(0.1, 0.06, 6);
      return T.shadow(0, 0, 0.14, 0.2)
        + T.box(-0.1, -0.08, 0.1, 0.08, 0, 12, { top: 'rgba(58,42,30,.85)', left: 'rgba(58,42,30,.85)', right: 'rgba(40,28,20,.85)' }, '')
        + T.face([[-0.03, 0.08, 3], [0.04, 0.08, 3], [0.04, 0.08, 9], [-0.03, 0.08, 9]], 'rgba(200,170,120,.5)')
        + slatL + slatR
        + T.box(-0.1, -0.08, 0.1, 0.08, 11, 12.5, WOOD)
        + [-0.04, 0.03].map(du => T.face([[du, -0.08, 12.5], [du + 0.025, -0.08, 12.5], [du + 0.025, 0.08, 12.5], [du, 0.08, 12.5]], WOOD_DARK.top)).join('')
        + `<path d="M${f2(rx)},${f2(ry)} Q${f2(bx - 4)},${f2(by - 1)} ${f2(bx - 2)},${f2(by - 1)}" stroke="#C9A16A" stroke-width="0.9" fill="none"/>`
        + ell(bx, by - 1.6, 3.4, 2.4, '#E2463A', ` stroke="${OUT}" stroke-width="0.5"`) + `<path d="M${f2(bx - 3.4)},${f2(by - 1.6)} h6.8" stroke="#FFFDF8" stroke-width="1.4"/>`;
    }
  }, {
    at: [-0.66, 0.84],
    frame: [-10, -12, 20, 15],
    n: 4,
    fps: 7,
    motion: t => [0, Math.sin(t * 0.7) * 0.1, 0],
    draw: (T, level, f) => {
      const [x, y] = T.p(0, 0, 0);
      const claw = f % 2 ? 1.2 : 0;
      const legs = [-1, 1].map(s => [0, 1, 2].map(k => ln([x + s * 2.4, y - 2.6 + k * 0.9], [x + s * (5.4 + ((f + k) % 2) * 0.8), y - 0.6 + k * 0.8], '#C2412E', 0.7)).join('')).join('');
      return ell(x, y + 0.2, 5, 1.3, 'rgba(40,30,20,.25)') + legs
        + ell(x, y - 3.6, 4.4, 2.8, '#E2573F', ' stroke="rgba(120,30,20,.5)" stroke-width="0.5"') + ell(x - 1.2, y - 4.6, 1.6, 0.8, '#F28A72')
        + [-1, 1].map(s => `<path d="M${f2(x + s * 3.6)},${f2(y - 4.6)} q${s * 1.6},${f2(-1.6 - claw)} ${s * 2.6},${f2(-2.4 - claw)}" stroke="#E2573F" stroke-width="1.2" fill="none"/><path d="M${f2(x + s * 6.2)},${f2(y - 7 - claw)} l${s * 1.2},-1.4 l${s * 0.4},1.6 l${-s * 0.8},0.2 Z" fill="#E2573F"/>`).join('')
        + ln([x - 1.2, y - 6], [x - 1.4, y - 7.8], '#2A2420', 0.5) + ln([x + 1.2, y - 6], [x + 1.4, y - 7.8], '#2A2420', 0.5)
        + dot(x - 1.4, y - 8, 0.6, '#1E1A17') + dot(x + 1.4, y - 8, 0.6, '#1E1A17');
    }
  }]
};
// Barque du pêcheur, derrière le grand ponton : il rame doucement d'un bout à l'autre de l'anse
const barque = {
  layers: [{
    at: [0.46, -0.62],
    frame: [-26, -30, 52, 38],
    back: true,
    n: 8,
    fps: 5,
    motion: t => [Math.sin(t * 0.22) * 0.05 - 0.01, 0, Math.sin(t * 1.3) * 0.8],
    draw: (T, level, f, n) => {
      const rim = [T.p(0.21, 0, 4), T.p(0.09, 0.1, 4), T.p(-0.1, 0.1, 4), T.p(-0.19, 0, 4.6), T.p(-0.1, -0.1, 4), T.p(0.09, -0.1, 4)];
      const side = [T.p(0.21, 0, 4), T.p(0.09, 0.1, 4), T.p(-0.1, 0.1, 4), T.p(-0.19, 0, 4.6), T.p(-0.16, 0, 0), T.p(-0.08, 0.07, 0), T.p(0.06, 0.07, 0), T.p(0.18, 0, 0.4)];
      const phase = (f / n) * Math.PI * 2;
      const oar = s => {
        const lock = T.p(0, 0.1 * s, 6);
        const lift = Math.sin(phase) > 0 ? 3 : 0;
        const blade = T.p(Math.cos(phase) * 0.09, 0.27 * s, lift);
        return ln(lock, blade, WOOD_DARK.right, 1.2) + ell(blade[0], blade[1], 2.6, 1, WOOD.left, ` transform="rotate(-26 ${f2(blade[0])} ${f2(blade[1])})"`)
          + (lift ? '' : ell(blade[0], blade[1] + 1.4, 3.6, 1.1, 'none', ' stroke="rgba(255,255,255,.7)" stroke-width="0.6"'));
      };
      const [rx, ry] = T.p(-0.03, 0, 6);
      const lean = Math.cos(phase) * 1.2;
      return ell(...T.p(0.01, 0.01, 0), 15, 3.4, 'rgba(30,70,110,.25)')
        + oar(-1)
        + poly(rim, WOOD_DARK.top, ` stroke="${OUT}" stroke-width="0.7"`)
        + T.face([[-0.02, -0.1, 4], [0.03, -0.1, 4], [0.03, 0.1, 4], [-0.02, 0.1, 4]], WOOD.top)
        // Rameur : chemise, bras vers les rames, chapeau de paille à ruban
        + `<path d="M${f2(rx - 3.2 + lean)},${f2(ry - 1)} L${f2(rx + 3.2 + lean)},${f2(ry - 1)} L${f2(rx + 2.6 + lean)},${f2(ry - 9)} L${f2(rx - 2.6 + lean)},${f2(ry - 9)} Z" fill="#5C83C2"/>`
        + ln([rx - 2.4 + lean, ry - 7.4], [rx - 6 + lean * 2, ry - 3.6], '#F1C9A5', 1.2) + ln([rx + 2.4 + lean, ry - 7.4], [rx + 6 + lean * 2, ry - 3.6], '#F1C9A5', 1.2)
        + dot(rx + lean, ry - 11.2, 2.6, '#F1C9A5')
        + ell(rx + lean, ry - 12.6, 5, 1.4, '#E9BF4E') + `<path d="M${f2(rx - 2.6 + lean)},${f2(ry - 12.8)} q2.6,-3.4 5.2,0 Z" fill="#E9BF4E"/>` + ln([rx - 2.6 + lean, ry - 12.9], [rx + 2.6 + lean, ry - 12.9], '#C8504A', 0.8)
        + poly(side, WOOD.left, ` stroke="${OUT}" stroke-width="0.7"`)
        + `<polyline points="${[T.p(0.19, 0, 2.4), T.p(0.08, 0.085, 2.2), T.p(-0.09, 0.085, 2.2), T.p(-0.18, 0, 2.6)].map(xy).join(' ')}" fill="none" stroke="rgba(60,40,25,.35)" stroke-width="0.6"/>`
        + oar(1);
    }
  }]
};
// Râtelier à harpon : le harpon barbelé couché sur ses deux fourches, cordage lové et flotteur de liège (palier V)
const harpon = {
  layers: [{
    at: [0.5, -0.92],
    frame: [-26, -30, 52, 36],
    draw: T => {
      const post = du => T.box(du - 0.016, -0.016, du + 0.016, 0.016, 0, 14, WOOD_DARK) + ln(T.p(du, 0, 14), T.p(du - 0.03, 0, 17.4), WOOD_DARK.right, 1.2) + ln(T.p(du, 0, 14), T.p(du + 0.03, 0, 17.4), WOOD_DARK.right, 1.2);
      const tip = T.p(0.32, 0, 15.6);
      const neck = T.p(0.22, 0, 15.2);
      const [cx, cy] = T.p(-0.14, 0.15, 0);
      const [fx, fy] = T.p(0.12, 0.14, 0);
      const [ex, ey] = T.p(-0.3, 0, 15.6);
      return T.shadow(0, 0.04, 0.26, 0.16)
        + post(-0.15) + post(0.13)
        + ln(T.p(-0.3, 0, 15.6), neck, WOOD.right, 1.6) + ln(T.p(-0.3, 0, 16.2), neck, WOOD.top, 0.5)
        + poly([T.p(0.22, 0, 16.4), tip, T.p(0.22, 0, 14)], IRON.left, ` stroke="${IRON.right}" stroke-width="0.5"`)
        + ln(T.p(0.25, 0, 15.4), T.p(0.2, 0, 19), IRON.right, 1) + ln(T.p(0.25, 0, 15.2), T.p(0.21, 0, 12), IRON.right, 1)
        + `<path d="M${f2(ex)},${f2(ey)} C${f2(ex - 4)},${f2(ey + 5)} ${f2(cx - 7)},${f2(cy - 5)} ${f2(cx - 3)},${f2(cy - 2)}" stroke="#C9A16A" stroke-width="0.9" fill="none"/>`
        + [0, 1, 2].map(k => ell(cx, cy - k * 1.3, 5 - k * 0.6, 2 - k * 0.2, 'none', ' stroke="#C9A16A" stroke-width="1.3"')).join('')
        + ell(fx, fy - 2, 3, 2.2, '#D9A877', ` stroke="${OUT}" stroke-width="0.5"`) + ell(fx, fy - 2.6, 2, 1.1, '#E7C08A');
    }
  }]
};
// Pélican sur sa bitte d'amarrage : il gonfle sa poche, avale un poisson, s'étire (palier VI)
const pelican = {
  layers: [{
    at: [0.92, -0.12],
    frame: [-22, -48, 40, 54],
    n: 8,
    fps: 3,
    draw: (T, level, f) => {
      const [x, y] = T.p(0, 0, 0);
      const [px, py] = T.p(0, 0, 14);
      const up = f === 2 || f === 3;
      const pouch = f === 4 || f === 5 ? 1 : 0;
      const stretch = f === 6;
      const hx = px - 3.6;
      const hy = py - 17 - (up ? 2 : 0);
      const tipX = up ? hx - 2 : hx - 10;
      const tipY = up ? hy - 9 : hy + 3;
      const ripple = (f % 4) / 4;
      return ell(x, y + 0.4, 5 + ripple * 4, 1.6 + ripple * 1.2, 'none', ` stroke="rgba(255,255,255,${f2(0.8 - ripple * 0.7)})" stroke-width="0.6"`)
        + T.cyl(0, 0, 0, 14, 0.06, WOOD, 'post') + ell(...T.p(0, 0, 9), 3.6, 1.6, 'none', ' stroke="#C9A16A" stroke-width="1.2"')
        + ln([px - 1.6, py - 3], [px - 1.8, py], '#E8A13A', 1) + ln([px + 1, py - 3], [px + 1.2, py], '#E8A13A', 1)
        + `<path d="M${f2(px + 4)},${f2(py - 6)} l4,1.4 l-3.4,1.6 Z" fill="#D9D4CA"/>`
        + (stretch ? `<path d="M${f2(px + 1)},${f2(py - 9)} q5,-9 11,-8 q-3,3 -4,7 Z" fill="#E9E4DA" stroke="rgba(60,40,25,.3)" stroke-width="0.5"/><path d="M${f2(px + 10)},${f2(py - 16.6)} q1.4,-0.4 2,0.6 l-2.6,1.8 Z" fill="#3D3A36"/>` : '')
        + ell(px - 0.4, py - 6.4, 6.4, 4.6, '#F4F1EA', ' stroke="rgba(60,40,25,.3)" stroke-width="0.5"')
        + ell(px + 0.6, py - 6.6, 4.8, 2.8, '#DEDAD0') + `<path d="M${f2(px + 3.6)},${f2(py - 5.4)} l2.4,0.6 l-2.2,1.2 Z" fill="#3D3A36"/>`
        + `<path d="M${f2(px - 4)},${f2(py - 9)} Q${f2(px - 7)},${f2(py - 13)} ${f2(hx + 0.4)},${f2(hy + 1.6)}" stroke="#F4F1EA" stroke-width="3.4" fill="none" stroke-linecap="round"/>`
        + dot(hx, hy, 2.8, '#F4F1EA') + `<path d="M${f2(hx + 0.6)},${f2(hy - 2.6)} q2.4,-1.6 3.4,0.4" stroke="#F2D35A" stroke-width="1" fill="none"/>`
        // Long bec et poche (gonflée quand il avale)
        + `<path d="M${f2(hx - 1.6)},${f2(hy + 0.6)} Q${f2((hx + tipX) / 2)},${f2((hy + tipY) / 2 + 3 + pouch * 4)} ${f2(tipX)},${f2(tipY + 0.6)} L${f2(tipX + 0.4)},${f2(tipY)} Z" fill="#F2B04A" stroke="#C88A20" stroke-width="0.5"/>`
        + ln([hx - 1.4, hy - 0.4], [tipX, tipY], '#E8A13A', 1.4)
        + (f === 2 ? `<path d="M${f2(tipX - 0.6)},${f2(tipY - 0.6)} l-2,-1.8 l0.6,2.6 Z" fill="#9FB8C8"/>` : '')
        + dot(hx - 0.6, hy - 0.8, 0.6, '#2A2420');
    }
  }]
};
// Sirène sur son rocher : elle peigne sa chevelure, sa queue bat l'eau, sa perle luit la nuit (palier VII)
const SIREN_AT = [-0.1, 0.94];
const sirene = {
  light: () => [SIREN_AT[0], SIREN_AT[1], 14, 18, '200,240,255'],
  layers: [{
    at: SIREN_AT,
    frame: [-26, -44, 52, 50],
    n: 8,
    fps: 4,
    draw: (T, level, f, n) => {
      const [x, y] = T.p(0, 0, 0);
      const ripple = (f % 4) / 4;
      const flick = f === 2 || f === 3 ? -2.4 : 0;
      const sway = wave(f, n, 1);
      const mx = x - 1;
      const my = y - 12;
      const hair = '#E2573F';
      const tail = '#3FB5A5';
      return ell(x, y + 1, 15 + ripple * 4, 4.4 + ripple * 1.2, 'none', ` stroke="rgba(255,255,255,${f2(0.75 - ripple * 0.65)})" stroke-width="0.7"`)
        + ell(x + 1, y + 0.6, 13, 3.6, 'rgba(30,70,110,.25)')
        + stone(x - 2, y - 4, 10.6, STONE) + stone(x + 7, y - 1.4, 5.4, STONE)
        + `<path d="M${f2(x - 9)},${f2(y - 1)} q-1,-4 1,-7 M${f2(x - 7)},${f2(y)} q1,-3 -0.4,-6" stroke="#4E9A5A" stroke-width="1" fill="none"/>`
        // Chevelure dans le dos
        + `<path d="M${f2(mx - 3)},${f2(my - 16)} Q${f2(mx - 7 + sway)},${f2(my - 9)} ${f2(mx - 5.6 + sway)},${f2(my - 2)} L${f2(mx - 2)},${f2(my - 3)} Q${f2(mx - 3)},${f2(my - 10)} ${f2(mx + 1)},${f2(my - 15)} Z" fill="${hair}"/>`
        // Queue : des hanches au bord du rocher, nageoire qui bat
        + `<path d="M${f2(mx - 3.4)},${f2(my - 4)} Q${f2(mx + 6)},${f2(my - 3)} ${f2(mx + 8)},${f2(my + 4)} Q${f2(mx + 9.6)},${f2(my + 9)} ${f2(mx + 12)},${f2(my + 10 + flick)} L${f2(mx + 10)},${f2(my + 11 + flick * 0.5)} Q${f2(mx + 6)},${f2(my + 8)} ${f2(mx + 4.6)},${f2(my + 3)} Q${f2(mx + 3)},${f2(my)} ${f2(mx - 3)},${f2(my + 0.4)} Z" fill="${tail}" stroke="#23806F" stroke-width="0.5"/>`
        + [[1, -1.4], [3.6, -0.6], [6, 1.4]].map(([dx, dy]) => `<path d="M${f2(mx + dx - 1)},${f2(my + dy)} q1,-1 2,0" stroke="#7FDCCB" stroke-width="0.5" fill="none"/>`).join('')
        + `<path d="M${f2(mx + 12)},${f2(my + 10 + flick)} q3,-3 4.6,-1.6 q-1.6,2.4 -1.4,4.2 q-2,-0.4 -3.2,-2.6 Z" fill="#5FD0BE" stroke="#23806F" stroke-width="0.5"/>`
        + (flick ? [[15, 2], [17, 5], [13, 6]].map(([dx, dy]) => dot(mx + dx, my + dy, 0.7, 'rgba(220,245,255,.9)')).join('') : '')
        // Buste, coquillages, bras qui peigne, perle
        + `<path d="M${f2(mx - 3.4)},${f2(my - 4)} L${f2(mx - 2.6)},${f2(my - 12)} L${f2(mx + 2.6)},${f2(my - 12)} L${f2(mx + 2.4)},${f2(my - 3.6)} Z" fill="#F6CFAE" stroke="rgba(120,70,40,.3)" stroke-width="0.5"/>`
        + ell(mx - 1.2, my - 9.6, 1.4, 1.1, '#F28AA8') + ell(mx + 1.4, my - 9.6, 1.4, 1.1, '#F28AA8')
        + `<path d="M${f2(mx + 2.4)},${f2(my - 11.4)} q3,-1 3.4,-5" stroke="#F6CFAE" stroke-width="1.4" fill="none" stroke-linecap="round"/>`
        + `<rect x="${f2(mx + 4.2 + sway * 0.4)}" y="${f2(my - 19)}" width="3" height="1.4" rx="0.4" fill="#F2C04B" transform="rotate(-20 ${f2(mx + 5.7)} ${f2(my - 18.3)})"/>`
        + `<path d="M${f2(mx - 2.4)},${f2(my - 11)} q-2.6,3 -1,5.6" stroke="#F6CFAE" stroke-width="1.4" fill="none" stroke-linecap="round"/>`
        + dot(mx - 3.2, my - 5, 1.6, '#FFFFFF') + dot(mx - 3.6, my - 5.5, 0.5, '#E8F7FF')
        + dot(mx, my - 15, 2.6, '#F6CFAE')
        + `<path d="M${f2(mx - 2.8)},${f2(my - 15)} Q${f2(mx - 2)},${f2(my - 19.4)} ${f2(mx + 2.8)},${f2(my - 16.4)} Q${f2(mx + 4.4)},${f2(my - 13)} ${f2(mx + 3.6 + sway)},${f2(my - 9)}" stroke="${hair}" stroke-width="2" fill="none" stroke-linecap="round"/>`
        + `<path d="M${f2(mx - 1.4)},${f2(my - 15.4)} q0.6,0.5 1.2,0" stroke="#5E3A22" stroke-width="0.5" fill="none"/>` + dot(mx - 0.4, my - 13.4, 0.4, '#E07A7A');
    }
  }]
};

export default {
  canne,
  filet,
  casier,
  barque,
  harpon,
  pelican,
  sirene
};
