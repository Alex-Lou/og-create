// Les articles de la boutique de l'Atelier, dessinés aux abords du bâtiment (shopSprites.js les réunit ; repère et
// calques : voir son en-tête).
import { TW, EDGE } from '../iso';
import { WOOD, WOOD_DARK, STONE } from '../palette';
import { IRON, DARK_IRON, COPPER, STUMP, PAIL, OUT, wave, star, gradient, bucket, f2, ln, poly, ell, dot } from '../spriteKit';

const etabli = {
  layers: [{
    at: [0.82, -0.78],
    frame: [-26, -32, 52, 38],
    draw: T => {
      const legs = [[-0.14, -0.065], [0.14, -0.065], [-0.14, 0.065], [0.14, 0.065]].map(([a, b]) => T.box(a - 0.016, b - 0.016, a + 0.016, b + 0.016, 0, 11, WOOD_DARK)).join('');
      const [x, y] = T.p(0, 0, 14);
      const curl = (dx, dy, w) => `<path d="M${f2(x + dx)},${f2(y + dy - 1)} a1.2,1 0 1 1 1.2,1" stroke="#E7C08A" stroke-width="${w}" fill="none"/>`;
      return T.shadow(0, 0, 0.22, 0.18) + legs
        + T.box(-0.13, -0.05, 0.13, 0.05, 3, 4.5, WOOD_DARK)
        + T.box(-0.1, -0.035, 0.06, 0.035, 4.5, 7, { top: '#F1D3A1', left: '#D9B07A', right: '#B98552' })
        + T.box(-0.17, -0.08, 0.17, 0.08, 11, 14, { top: '#EBC08A', left: WOOD.left, right: WOOD.right })
        // Étau au bout, rabot, marteau, copeaux
        + T.box(0.13, 0.05, 0.19, 0.1, 9, 15.5, DARK_IRON) + ln(T.p(0.16, 0.1, 12), T.p(0.16, 0.18, 12), IRON.top, 0.9)
        + T.box(-0.08, -0.03, 0, 0.01, 14, 16.5, WOOD) + T.face([[-0.05, -0.03, 16.5], [-0.035, -0.03, 16.5], [-0.035, 0.01, 18], [-0.05, 0.01, 18]], IRON.right)
        + ln([x + 2, y - 0.6], [x + 9, y - 3.6], WOOD.right, 1.3) + `<rect x="${f2(x + 1)}" y="${f2(y - 2.6)}" width="3.6" height="2.2" rx="0.4" fill="${DARK_IRON.left}" transform="rotate(-22 ${f2(x + 2.8)} ${f2(y - 1.5)})"/>`
        + curl(-8, 1, 0.6) + curl(-5, 3, 0.6) + curl(4, 2.2, 0.6) + curl(-10, 15, 0.7) + curl(6, 16, 0.7) + curl(11, 14, 0.7);
    }
  }]
};
// Grande enclume à bigorne sur un billot, marteau ; une pièce encore rouge luit et fume
const ENCLUME = { 1: [-0.72, 0.76], 2: [-0.04, 0.86] };
const enclume = {
  light: level => { const [u, v] = ENCLUME[Math.min(level, 2)]; return [u - 0.02, v, 18, 12]; },
  layers: [{
    at: ENCLUME,
    frame: [-18, -28, 38, 34],
    draw: T => {
      const steel = { top: '#9AA6B2', left: '#6E7A86', right: '#4F5A64' };
      const [hx, hy] = T.p(-0.13, 0.11, 0);
      const [bx, by] = T.p(0, 0.12, 0);
      return T.shadow(0, 0, 0.17, 0.2)
        + T.cyl(0, 0, 0, 9, 0.12, STUMP, 'stump')
        + [-4, -1, 2, 5].map(dx => ln([bx + dx, by - 1], [bx + dx * 0.95, by - 8], 'rgba(60,40,25,.25)', 0.6)).join('')
        + T.box(-0.07, -0.05, 0.07, 0.05, 9, 11, DARK_IRON)
        + T.box(-0.035, -0.03, 0.035, 0.03, 11, 15, DARK_IRON)
        + T.box(-0.11, -0.05, 0.08, 0.05, 15, 18.5, steel)
        + T.face([[0.08, 0.05, 15], [0.18, 0, 17.4], [0.08, 0.05, 18.5]], steel.left, EDGE)
        + T.face([[0.08, -0.05, 18.5], [0.18, 0, 17.6], [0.08, 0.05, 18.5]], steel.top, EDGE)
        + T.face([[0.08, -0.05, 15], [0.18, 0, 17.4], [0.08, -0.05, 18.5]], steel.right)
        + ln(T.p(-0.09, -0.02, 18.6), T.p(0.06, -0.02, 18.6), 'rgba(255,255,255,.55)', 0.7)
        + ln([hx, hy - 1], [hx + 3, hy - 12], WOOD.right, 1.5) + `<rect x="${f2(hx + 0.4)}" y="${f2(hy - 15)}" width="5.6" height="3" rx="0.6" fill="${DARK_IRON.left}" transform="rotate(16 ${f2(hx + 3)} ${f2(hy - 13.5)})"/>`;
    }
  }, {
    at: ENCLUME,
    frame: [-12, -30, 24, 20],
    n: 8,
    fps: 6,
    draw: (T, level, f, n) => {
      const [x, y] = T.p(-0.02, 0, 18.6);
      const heat = 0.75 + wave(f, n, 0.25);
      const spark = f === 0 || f === 1;
      const rot = ` transform="rotate(-8 ${f2(x)} ${f2(y)})"`;
      return `<rect x="${f2(x - 4.6)}" y="${f2(y - 1.6)}" width="9" height="2.2" rx="1" fill="#E2463A"${rot}/>`
        + `<rect x="${f2(x - 3.4)}" y="${f2(y - 1.3)}" width="6.4" height="1.2" rx="0.6" fill="#FFB347" opacity="${f2(heat)}"${rot}/>`
        + `<rect x="${f2(x - 2)}" y="${f2(y - 1.1)}" width="3.4" height="0.7" rx="0.35" fill="#FFF2B0" opacity="${f2(heat)}"${rot}/>`
        + `<path d="M${f2(x - 2)},${f2(y - 4)} q1.4,${f2(-2 - heat)} 0,-5 M${f2(x + 2)},${f2(y - 4)} q-1.4,${f2(-2 - heat)} 0,-5.4" stroke="rgba(255,255,255,${f2(0.18 * heat)})" stroke-width="1" fill="none"/>`
        + (spark ? [[-5, -6], [4, -8], [7, -4], [-2, -10]].map(([dx, dy], k) => dot(x + dx * (1 + f * 0.5), y + dy * (1 + f * 0.4), 0.9 - f * 0.3, k % 2 ? '#FFE07A' : '#F7A23B')).join('') : '');
    }
  }]
};
// Soufflet de forge contre le four : planches en poire, cuir plissé qui se gonfle et se vide, buse vers le foyer
const soufflet = {
  layers: [{
    at: [0.84, 0.5],
    frame: [-24, -30, 48, 40],
    n: 8,
    fps: 5,
    draw: (T, level, f, n) => {
      const open = 4 + wave(f, n, 3);
      const shape = [[0, -0.1], [0.055, -0.065], [0.085, 0.01], [0.075, 0.09], [0.03, 0.135], [-0.03, 0.135], [-0.075, 0.09], [-0.085, 0.01], [-0.055, -0.065]].map(([a, b]) => [a * 1.45, b * 1.45]);
      const z0 = 8;
      const lower = shape.map(([a, b]) => T.p(a, b, z0));
      const upper = shape.map(([a, b]) => T.p(a, b, z0 + open));
      // Cuir : bande entre le bord bas et le bord haut, sur le pourtour visible
      const vis = [1, 2, 3, 4, 5, 6, 7];
      const leather = [...vis.map(i => lower[i]), ...vis.slice().reverse().map(i => upper[i])];
      const pleats = vis.map(i => ln([lower[i][0], lower[i][1] - open * 0.5], [upper[i][0], upper[i][1] + open * 0.2], 'rgba(60,30,15,.45)', 0.5)).join('');
      const puff = f >= 1 && f <= 3;
      const [nx, ny] = T.p(0, -0.24, 8.5);
      const [cx, cy] = T.p(0, 0.04, z0 + open);
      return T.shadow(0, 0.02, 0.14, 0.2)
        + T.box(-0.08, 0.06, -0.05, 0.09, 0, z0, WOOD_DARK) + T.box(0.05, 0.06, 0.08, 0.09, 0, z0, WOOD_DARK) + T.box(-0.02, -0.1, 0.02, -0.07, 0, z0, WOOD_DARK)
        + poly(lower, WOOD_DARK.left)
        + poly(leather, '#8B5631', ' stroke="#5E3A22" stroke-width="0.5"') + pleats
        + poly(upper, WOOD.top, ` stroke="${OUT}" stroke-width="0.6"`)
        + dot(cx, cy, 1.1, '#5E3A22')
        + ln(T.p(-0.03, 0.19, z0 + open), T.p(-0.04, 0.27, z0 + open + 2), WOOD_DARK.right, 1.5) + ln(T.p(0.03, 0.19, z0 + open), T.p(0.04, 0.27, z0 + open + 2), WOOD_DARK.right, 1.5)
        + ln(T.p(0, -0.13, z0 + 0.8), [nx, ny], DARK_IRON.right, 2.4) + ln(T.p(0, -0.13, z0 + 1.4), [nx, ny - 0.6], DARK_IRON.top, 0.6)
        + (puff ? dot(nx - 2 - f, ny - 1.6 - f * 0.6, 1 + f * 0.5, `rgba(255,255,255,${f2(0.5 - f * 0.12)})`) + dot(nx - 1, ny - 2.4, 0.6, '#FFB347') : '');
    }
  }]
};
// Alambic de cuivre : la cucurbite ronde chauffe sur un petit fourneau de briques, le col de cygne mène au serpentin
// plongé dans un baquet d'eau, une goutte verte tombe dans la fiole ; le feu danse, la vapeur s'échappe (palier IV)
const ALAMBIC_AT = [1.12, -0.16];
const GLASS = 'rgba(214,240,236,.55)';
const alambic = {
  light: () => [ALAMBIC_AT[0], ALAMBIC_AT[1], 6, 16, '255,170,90'],
  layers: [{
    at: ALAMBIC_AT,
    frame: [-26, -60, 54, 68],
    n: 8,
    fps: 6,
    draw: (T, level, f, n) => {
      const fire = 0.8 + wave(f, n, 0.2);
      const [fx, fy] = T.p(0, 0.13, 3.5);
      const [cx, cy] = T.p(0, 0, 17);
      const [nx, ny] = T.p(0, 0, 26);
      const [kx, ky] = T.p(0.26, -0.02, 13.6);
      const [gx, gy] = T.p(0.26, 0.2, 0);
      const drop = (f / n);
      // Fourneau de briques et sa gueule de feu
      return T.shadow(0.1, 0.02, 0.3, 0.22)
        + T.box(-0.12, -0.12, 0.12, 0.12, 0, 9, { top: '#C9765A', left: '#B5603F', right: '#8E4630' })
        + [3, 6].map(z => ln(T.p(-0.12, 0.12, z), T.p(0.12, 0.12, z), 'rgba(80,30,15,.35)', 0.5) + ln(T.p(0.12, 0.12, z), T.p(0.12, -0.12, z), 'rgba(80,30,15,.35)', 0.5)).join('')
        + `<path d="M${f2(fx - 4)},${f2(fy + 1.5)} L${f2(fx - 4)},${f2(fy - 2)} Q${f2(fx)},${f2(fy - 5.5)} ${f2(fx + 4)},${f2(fy - 2)} L${f2(fx + 4)},${f2(fy + 1.5)} Z" fill="#2A1A12"/>`
        + `<path d="M${f2(fx - 2.8)},${f2(fy + 1.2)} Q${f2(fx - 2.6)},${f2(fy - 2.5 * fire)} ${f2(fx - 0.6)},${f2(fy - 4.2 * fire)} Q${f2(fx)},${f2(fy - 1.6)} ${f2(fx + 0.8)},${f2(fy - 3.4 * (1.8 - fire))} Q${f2(fx + 2.8)},${f2(fy - 1.4)} ${f2(fx + 2.8)},${f2(fy + 1.2)} Z" fill="#F7A23B"/>`
        + ell(fx, fy + 0.4, 1.6, 1.2 * fire, '#FFE07A')
        // Cucurbite : panse ronde de cuivre, reflet, cerclage, chapiteau
        + T.cyl(0, 0, 9, 13, 0.1, COPPER, 'pied')
        + ell(cx, cy, 8.4, 7.6, COPPER.left, ` stroke="${OUT}" stroke-width="0.7"`)
        + `<path d="M${f2(cx)},${f2(cy - 7.6)} A8.4,7.6 0 0 1 ${f2(cx)},${f2(cy + 7.6)} A4,7.6 0 0 0 ${f2(cx)},${f2(cy - 7.6)} Z" fill="${COPPER.right}"/>`
        + ell(cx - 3.6, cy - 3.2, 2.2, 3, 'rgba(255,230,200,.55)') + dot(cx - 4.2, cy - 4.6, 0.9, '#FFF4E6')
        + `<path d="M${f2(cx - 8.2)},${f2(cy + 1)} Q${f2(cx)},${f2(cy + 5)} ${f2(cx + 8.2)},${f2(cy + 1)}" fill="none" stroke="${COPPER.right}" stroke-width="1.1"/>`
        + [-5, -1.5, 2.5, 6].map(dx => dot(cx + dx, cy + 2.4 + Math.abs(dx) * -0.12, 0.45, '#7A4022')).join('')
        + ell(nx, ny + 2.4, 3.6, 1.6, COPPER.top, ` stroke="${OUT}" stroke-width="0.6"`)
        + `<path d="M${f2(nx - 3.4)},${f2(ny + 2.2)} Q${f2(nx - 3)},${f2(ny - 3)} ${f2(nx)},${f2(ny - 3.6)} Q${f2(nx + 3)},${f2(ny - 3)} ${f2(nx + 3.4)},${f2(ny + 2.2)} Z" fill="${COPPER.left}" stroke="${OUT}" stroke-width="0.6"/>`
        + dot(nx, ny - 4.4, 1, COPPER.top)
        // Baquet de bois où le serpentin refroidit, puis le col de cygne qui y plonge (trait sombre puis cuivre, pour
        // un tube net), une ride sur l'eau
        + bucket(T, 0.26, -0.02, 4, 10, 5.4, 6.2, PAIL, 'baquet')
        + [OUT, COPPER.left].map((c, k) => `<path d="M${f2(nx + 2.6)},${f2(ny - 1)} Q${f2(kx - 2)},${f2(ny - 12)} ${f2(kx)},${f2(ky - 4)} L${f2(kx)},${f2(ky + 0.6)}" fill="none" stroke="${c}" stroke-width="${k ? 1.5 : 2.6}" stroke-linecap="round" stroke-linejoin="round"/>`).join('')
        + `<path d="M${f2(nx + 4)},${f2(ny - 2.8)} Q${f2(kx - 3)},${f2(ny - 11.4)} ${f2(kx - 0.6)},${f2(ky - 4.6)}" fill="none" stroke="rgba(255,230,200,.65)" stroke-width="0.5" stroke-linecap="round"/>`
        + ell(kx, ky + 0.8, 2.2 + (f % 4) * 0.3, 0.9, 'none', ` stroke="rgba(255,255,255,${f2(0.7 - (f % 4) * 0.15)})" stroke-width="0.5"`)
        // Robinet et fiole verte qui se remplit goutte à goutte
        + ln(T.p(0.26, 0.09, 6), [gx, gy - 9.6], COPPER.right, 1.2)
        + dot(gx, gy - 9.6 + drop * 4.4, 0.75 * (1 - drop * 0.4), '#8BE07A')
        + ell(gx, gy - 3, 3.4, 3.2, GLASS, ` stroke="${OUT}" stroke-width="0.6"`)
        + `<path d="M${f2(gx - 3.1)},${f2(gy - 2.2)} A3.4,3.2 0 0 0 ${f2(gx + 3.1)},${f2(gy - 2.2)} Z" fill="#6CCB5F"/>`
        + `<rect x="${f2(gx - 1)}" y="${f2(gy - 8.6)}" width="2" height="3" fill="${GLASS}" stroke="${OUT}" stroke-width="0.5"/>`
        + dot(gx - 1.4, gy - 4, 0.7, 'rgba(255,255,255,.8)')
        // Vapeur qui monte du chapiteau, en trois bouffées décalées
        + [0, 1, 2].map(k => { const t = ((f / n) + k / 3) % 1; return dot(nx - 1 + Math.sin(t * 6 + k) * 1.6, ny - 6 - t * 14, 1.2 + t * 2.2, `rgba(255,255,255,${f2(0.55 * (1 - t))})`); }).join('');
    }
  }]
};
// Marteau-pilon : le mouton d'acier monte à la vapeur, retombe sur la pièce rouge, gerbe d'étincelles (palier V)
const LIFT = [0, 0.2, 0.45, 0.7, 0.9, 1, 1, 0.35];
const marteauPilon = {
  layers: [{
    at: [0.6, 0.92],
    frame: [-22, -46, 44, 52],
    n: 8,
    fps: 6,
    draw: (T, level, f) => {
      const zr = 10 + LIFT[f] * 9;
      const [ax, ay] = T.p(0, 0, 9.2);
      const [sx, sy] = T.p(0, 0, 38);
      const strike = f === 0;
      return T.shadow(0, 0, 0.2, 0.2)
        + T.box(-0.14, -0.13, 0.14, 0.13, 0, 3, STONE)
        + T.box(-0.035, -0.12, 0.035, -0.08, 3, 29, DARK_IRON)
        + T.box(-0.06, -0.05, 0.06, 0.05, 3, 7, DARK_IRON) + T.box(-0.045, -0.035, 0.045, 0.035, 7, 9, IRON)
        + `<rect x="${f2(ax - 3.4)}" y="${f2(ay - 1.4)}" width="6.8" height="1.8" rx="0.8" fill="${strike ? '#FFB347' : '#E2463A'}"/>`
        + T.box(-0.04, -0.04, 0.04, 0.04, zr, zr + 7, IRON)
        + ln(T.p(0, 0, zr + 7), T.p(0, 0, 29), IRON.top, 1.4)
        + T.box(-0.035, 0.08, 0.035, 0.12, 3, 29, DARK_IRON)
        + T.box(-0.05, -0.13, 0.05, 0.13, 29, 32, DARK_IRON)
        + T.cyl(0, 0, 32, 38, 0.06, COPPER, 'steam') + dot(sx, sy, 1.1, COPPER.right)
        + ln(T.p(0.04, -0.06, 36), T.p(0.04, -0.1, 22), COPPER.right, 1.1)
        + dot(...T.p(0, 0.12, 22), 1.8, '#F2EDE2') + ln(T.p(0, 0.12, 22), T.p(0.01, 0.12, 23.2), '#E2463A', 0.6)
        + (f >= 1 && f <= 4 ? [0, 1].map(k => dot(sx + 3 + k * 3 + f, sy - 2 - k * 3 - f, 1.6 + f * 0.5, `rgba(255,255,255,${f2(0.7 - f * 0.12)})`)).join('') : '')
        + (strike ? [[-7, -4], [6, -5], [-4, -8], [8, -1], [-9, 0]].map(([dx, dy], k) => dot(ax + dx, ay + dy, 0.9, k % 2 ? '#FFE07A' : '#F7A23B')).join('') : '');
    }
  }]
};
// Automate de laiton : il marche sur place en balançant les bras, sa clé tourne dans son dos, ses yeux clignent (palier VI)
const BRASS = { top: '#F6D27A', left: '#D9A84A', right: '#A87A2E' };
const automate = {
  layers: [{
    at: [-0.9, 0.86],
    frame: [-20, -44, 40, 50],
    n: 8,
    fps: 6,
    draw: (T, level, f, n) => {
      const step = wave(f, n, 1);
      const bob = Math.abs(step) * 0.8;
      const [hx, hy] = T.p(0, 0, 24.5 + bob);
      const [bx, by] = T.p(0, 0, 15 + bob);
      const turn = Math.cos((f / n) * Math.PI * 2);
      const [kx, ky] = T.p(-0.13, -0.13, 17 + bob);
      const blink = f === 5;
      const leg = (du, dv, lift) => T.box(du - 0.022, dv - 0.022, du + 0.022, dv + 0.022, lift, 9 + bob, DARK_IRON) + T.box(du - 0.03, dv - 0.03, du + 0.04, dv + 0.04, lift, lift + 2, BRASS);
      const arm = (sx, s) => `<g transform="rotate(${f2(step * 24 * s)} ${f2(sx)} ${f2(by - 4)})">${ln([sx, by - 4], [sx + s * 0.6, by + 3], DARK_IRON.left, 1.6)}${dot(sx + s * 0.6, by + 3.6, 1.4, BRASS.left)}</g>`;
      return T.shadow(0, 0, 0.12, 0.22)
        // Clé de remontage, dans le dos
        + ln(T.p(-0.06, -0.06, 17 + bob), [kx, ky], DARK_IRON.right, 1.2)
        + ell(kx - 2.4 * turn, ky - 1, 2.4 * Math.abs(turn) + 0.4, 1.8, BRASS.left, ` stroke="${BRASS.right}" stroke-width="0.5"`)
        + ell(kx + 2.4 * turn, ky - 1, 2.4 * Math.abs(turn) + 0.4, 1.8, BRASS.top, ` stroke="${BRASS.right}" stroke-width="0.5"`)
        + leg(-0.03, 0.03, Math.max(0, step) * 2) + leg(0.03, -0.03, Math.max(0, -step) * 2)
        + arm(bx - 5.6, -1)
        + T.cyl(0, 0, 9 + bob, 21 + bob, 0.08, BRASS, 'body')
        + [-3, 0, 3].map(dx => dot(bx + dx, by + 4.4, 0.5, BRASS.right)).join('')
        + dot(bx, by - 1, 2.2, '#F2EDE2') + ln([bx, by - 1], [bx + 1.2, by - 2], '#3D3A36', 0.5) + `<circle cx="${f2(bx)}" cy="${f2(by - 1)}" r="2.2" fill="none" stroke="${BRASS.right}" stroke-width="0.6"/>`
        + arm(bx + 5.6, 1)
        + T.cyl(0, 0, 21 + bob, 27 + bob, 0.055, BRASS, 'head')
        + ell(hx, hy - 2.6, 3.6, 1.8, BRASS.top)
        + ln([hx, hy - 3.6], [hx, hy - 8], DARK_IRON.right, 0.7) + dot(hx, hy - 8.4, 1.1, f % 4 < 2 ? '#7FE0FF' : '#E2463A')
        + (blink ? ln([hx - 2.4, hy + 1], [hx - 0.8, hy + 1], '#3D3A36', 0.7) + ln([hx + 0.8, hy + 1], [hx + 2.4, hy + 1], '#3D3A36', 0.7)
          : dot(hx - 1.6, hy + 1, 1.1, '#7FE0FF') + dot(hx + 1.6, hy + 1, 1.1, '#7FE0FF') + dot(hx - 1.9, hy + 0.7, 0.4, '#FFFFFF') + dot(hx + 1.3, hy + 0.7, 0.4, '#FFFFFF'))
        + ln([hx - 1.4, hy + 3.4], [hx + 1.4, hy + 3.4], BRASS.right, 0.6);
    }
  }]
};
// Athanor d'or : le four des alchimistes, dôme doré, alambic où bout l'or liquide ; il luit la nuit (palier VII)
const ATHANOR_AT = [-0.4, 0.94];
const GOLD = { top: '#FFE08A', left: '#F0B94A', right: '#C48A26' };
const athanor = {
  light: () => [ATHANOR_AT[0], ATHANOR_AT[1], 16, 24, '255,200,110'],
  layers: [{
    at: ATHANOR_AT,
    frame: [-26, -64, 52, 70],
    n: 8,
    fps: 5,
    draw: (T, level, f, n) => {
      const [x, y] = T.p(0, 0, 22);
      const [fx, fy] = T.p(0, 0, 9);
      const fire = 0.75 + wave(f, n, 0.25);
      const rx = 0.11 * TW * Math.SQRT1_2;
      const [gx, gy] = [x, y - 17];
      const [qx, qy] = T.p(0.24, 0.1, 0);
      const bubbles = [0, 1, 2].map(k => { const t = ((f / n) + k / 3) % 1; return dot(gx - 2 + k * 2, gy + 2 - t * 4, 0.6 + t * 0.4, `rgba(255,250,220,${f2(1 - t)})`); }).join('');
      return T.shadow(0, 0, 0.24, 0.22)
        + T.box(-0.14, -0.14, 0.14, 0.14, 0, 3, STONE)
        + T.cyl(0, 0, 3, 22, 0.11, GOLD, 'tower')
        + [8, 15].map(z => { const [lx, ly] = T.p(0, 0, z); return `<path d="M${f2(lx - rx)},${f2(ly)} A${f2(rx)},${f2(rx / 2)} 0 0 0 ${f2(lx + rx)},${f2(ly)}" stroke="${GOLD.right}" stroke-width="1" fill="none"/>`; }).join('')
        + `<path d="M${f2(fx - 3.4)},${f2(fy + 3.6)} L${f2(fx - 3.4)},${f2(fy - 1)} A3.4,3.6 0 0 1 ${f2(fx + 3.4)},${f2(fy - 1)} L${f2(fx + 3.4)},${f2(fy + 3.6)} Z" fill="#4A1E10" stroke="${GOLD.right}" stroke-width="0.8"/>`
        + ell(fx, fy + 2, 2.4, 2.6, '#F28A3A', ` opacity="${f2(fire)}"`) + ell(fx, fy + 2.6, 1.3, 1.6, '#FFE07A', ` opacity="${f2(fire)}"`)
        + gradient(T.id('dome'), GOLD.left, GOLD.right)
        + `<path d="M${f2(x - rx)},${f2(y)} C${f2(x - rx)},${f2(y - 11)} ${f2(x + rx)},${f2(y - 11)} ${f2(x + rx)},${f2(y)} A${f2(rx)},${f2(rx / 2)} 0 0 1 ${f2(x - rx)},${f2(y)} Z" fill="url(#${T.id('dome')})" stroke="${OUT}" stroke-width="0.6"/>`
        + `<path d="M${f2(x - rx * 0.6)},${f2(y - 5)} Q${f2(x - rx * 0.3)},${f2(y - 8)} ${f2(x)},${f2(y - 8.4)}" stroke="rgba(255,255,255,.6)" stroke-width="1" fill="none"/>`
        // Alambic : cucurbite de verre sur le dôme, col de cygne vers le récipient au sol
        + `<path d="M${f2(gx + 2)},${f2(gy - 4)} Q${f2(gx + 10)},${f2(gy - 12)} ${f2(qx + 1)},${f2(qy - 9)}" stroke="rgba(230,245,255,.8)" stroke-width="1.6" fill="none"/>`
        + `<path d="M${f2(gx + 2)},${f2(gy - 4)} Q${f2(gx + 10)},${f2(gy - 12)} ${f2(qx + 1)},${f2(qy - 9)}" stroke="rgba(120,150,180,.45)" stroke-width="0.4" fill="none"/>`
        + `<path d="M${f2(gx - 5)},${f2(gy + 1)} A5,5 0 0 0 ${f2(gx + 5)},${f2(gy + 1)} Z" fill="#FFC94A"/>` + bubbles
        + `<circle cx="${f2(gx)}" cy="${f2(gy)}" r="5" fill="rgba(220,240,255,.28)" stroke="rgba(255,255,255,.85)" stroke-width="0.7"/>`
        + `<rect x="${f2(gx - 1.2)}" y="${f2(gy - 8)}" width="2.4" height="3.4" fill="rgba(220,240,255,.4)" stroke="rgba(255,255,255,.85)" stroke-width="0.5"/>`
        + dot(gx - 2, gy - 2, 0.9, 'rgba(255,255,255,.8)')
        + ell(qx, qy - 3.4, 3.6, 3.6, 'rgba(220,240,255,.3)', ' stroke="rgba(255,255,255,.85)" stroke-width="0.6"') + `<path d="M${f2(qx - 3.4)},${f2(qy - 2.6)} A3.6,3.6 0 0 0 ${f2(qx + 3.4)},${f2(qy - 2.6)} Z" fill="#FFC94A"/>`
        + `<rect x="${f2(qx - 0.9)}" y="${f2(qy - 9.4)}" width="1.8" height="2.6" fill="rgba(220,240,255,.4)" stroke="rgba(255,255,255,.85)" stroke-width="0.5"/>`
        + (f % 4 === 1 ? dot(qx + 1, qy - 7 + (f >> 2) * 2, 0.6, '#FFC94A') : '')
        + star(gx + 7, gy - 3, 1.6, '#FFF2B0', Math.max(0, wave(f, n, 1))) + star(x - rx - 2, y - 2, 1.4, '#FFF2B0', Math.max(0, wave(f, n, 1, 3)));
    }
  }]
};

export default {
  etabli,
  enclume,
  soufflet,
  alambic,
  'marteau-pilon': marteauPilon,
  automate,
  athanor
};
