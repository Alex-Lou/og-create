// Les articles de la boutique du Foyer, dessinés aux abords du bâtiment (shopSprites.js les réunit ; repère et
// calques : voir son en-tête).
import { WOOD, WOOD_DARK, STONE } from '../palette';
import { BARK, OUT, wave, star, f2, ln, ell, dot } from '../spriteKit';

// Cuisine : four à pain de pierre et d'argile, bouche rougeoyante, pelle à enfourner, bûches ; il fume
const OVEN_AT = [-0.84, 0.8];
const OVEN_H = 13;
const cuisine = {
  light: () => [OVEN_AT[0] - 0.02, OVEN_AT[1] + 0.12, 10, 16],
  layers: [{
    at: OVEN_AT,
    frame: [-24, -38, 46, 46],
    draw: T => {
      const [x, y] = T.p(0, 0, 7);
      const rx = 7.6;
      const ry = 3.8;
      const log = (a, b, z) => T.box(a, b, a + 0.045, b + 0.16, z, z + 3.4, BARK);
      const [px, py] = T.p(0.14, 0.17, 0);
      const joint = 'rgba(120,110,95,.4)';
      return T.shadow(0, 0, 0.22, 0.2)
        + T.box(-0.15, -0.15, 0.15, 0.15, 0, 7, STONE)
        + ln(T.p(-0.15, 0.15, 3.5), T.p(0.15, 0.15, 3.5), joint, 0.6)
        + [-0.08, 0.02, 0.11].map((du, k) => ln(T.p(du, 0.15, k % 2 ? 0 : 3.5), T.p(du, 0.15, k % 2 ? 3.5 : 7), joint, 0.6)).join('')
        + `<defs><linearGradient id="${T.id('dome')}" x1="0" x2="1"><stop offset="0" stop-color="#E3B486"/><stop offset="1" stop-color="#A9724A"/></linearGradient></defs>`
        + `<path d="M${f2(x - rx)},${f2(y)} C${f2(x - rx)},${f2(y - OVEN_H * 1.3)} ${f2(x + rx)},${f2(y - OVEN_H * 1.3)} ${f2(x + rx)},${f2(y)} A${rx},${ry} 0 0 1 ${f2(x - rx)},${f2(y)} Z" fill="url(#${T.id('dome')})" stroke="${OUT}" stroke-width="0.7"/>`
        + `<path d="M${f2(x - rx * 0.8)},${f2(y - 4)} Q${f2(x)},${f2(y - 1)} ${f2(x + rx * 0.8)},${f2(y - 4)} M${f2(x - rx * 0.55)},${f2(y - 8.4)} Q${f2(x)},${f2(y - 6.4)} ${f2(x + rx * 0.55)},${f2(y - 8.4)}" stroke="rgba(110,60,30,.35)" stroke-width="0.6" fill="none"/>`
        + T.cyl(0.02, -0.04, 7 + OVEN_H * 0.9, 7 + OVEN_H * 0.9 + 5, 0.028, { top: '#5E3A2A', left: '#B87E52', right: '#8C5A34' }, 'flue')
        // Bouche en arc sur la face avant gauche
        + `<path d="M${f2(x - 5.6)},${f2(y + 1.8)} L${f2(x - 5.6)},${f2(y - 2.4)} A2.6,2.8 0 0 1 ${f2(x - 0.6)},${f2(y - 2.4)} L${f2(x - 0.6)},${f2(y + 2.6)} Z" fill="#3A1E14" stroke="#7A4E30" stroke-width="0.8"/>`
        + log(0.18, -0.12, 0) + log(0.235, -0.12, 0) + log(0.205, -0.12, 3.4)
        + ln([px, py], [px - 9, py - 16], WOOD.right, 1.2) + `<ellipse cx="${f2(px + 1.4)}" cy="${f2(py + 0.6)}" rx="3" ry="1.4" fill="${WOOD.left}" transform="rotate(-30 ${f2(px + 1.4)} ${f2(py + 0.6)})"/>`;
    }
  }, {
    at: OVEN_AT,
    frame: [-14, -54, 30, 58],
    n: 8,
    fps: 5,
    draw: (T, level, f, n) => {
      const [x, y] = T.p(0, 0, 7);
      const [cx, cy] = T.p(0.02, -0.04, 7 + OVEN_H * 0.9 + 5);
      const glow = 0.7 + wave(f, n, 0.3, 1.3);
      const puffs = [0, 1].map(k => {
        const t = ((f / n) + k * 0.5) % 1;
        return dot(cx + 1 + t * 5 + Math.sin(t * 6) * 1.2, cy - 2 - t * 18, 1.8 + t * 3.6, `rgba(236,232,224,${f2(0.6 * (1 - t))})`);
      }).join('');
      return `<ellipse cx="${f2(x - 3.1)}" cy="${f2(y + 0.6)}" rx="1.9" ry="1.6" fill="#F28A3A" opacity="${f2(glow)}"/><ellipse cx="${f2(x - 3.1)}" cy="${f2(y + 1)}" rx="1" ry="0.8" fill="#FFE07A" opacity="${f2(glow)}"/>` + puffs;
    }
  }]
};
// Lit douillet : un hamac rayé entre deux poteaux, coussin et livre ouvert ; il se balance
const HAMMOCK_AT = [0.9, -0.22];
const lit = {
  layers: [{
    at: HAMMOCK_AT,
    frame: [-22, -32, 46, 46],
    draw: T => T.shadow(0, -0.5, 0.06, 0.2) + T.shadow(0, 0.5, 0.06, 0.2)
      + T.box(-0.025, -0.525, 0.025, -0.475, 0, 22, WOOD_DARK) + T.box(-0.025, 0.475, 0.025, 0.525, 0, 22, WOOD_DARK)
      + ln(T.p(0, -0.5, 22), T.p(0, -0.5, 24), WOOD_DARK.right, 1.4) + ln(T.p(0, 0.5, 22), T.p(0, 0.5, 24), WOOD_DARK.right, 1.4)
  }, {
    at: HAMMOCK_AT,
    frame: [-20, -26, 42, 34],
    n: 8,
    fps: 3,
    draw: (T, level, f, n) => {
      const a = T.p(0, -0.47, 18);
      const b = T.p(0, 0.47, 18);
      const swing = wave(f, n, 1.4);
      const mx = (a[0] + b[0]) / 2 + swing;
      const my = (a[1] + b[1]) / 2;
      const low = my + 9 + wave(f, n, 0.6, 1);
      const stripe = (k, color) => `<path d="M${f2(a[0] + 2)},${f2(a[1] + 1 + k)} Q${f2(mx)},${f2(low - 4 + k * 1.6)} ${f2(b[0] - 2)},${f2(b[1] + 1 + k)}" stroke="${color}" stroke-width="1.1" fill="none"/>`;
      const kx = a[0] + (b[0] - a[0]) * 0.2 + swing * 0.4;
      const ky = a[1] + (b[1] - a[1]) * 0.2 + 5;
      return ln(a, [a[0] - 1.2, a[1] + 2.6], '#C9A16A', 0.7) + ln(b, [b[0] + 1.2, b[1] + 2.6], '#C9A16A', 0.7)
        + `<path d="M${f2(a[0])},${f2(a[1] + 2)} Q${f2(mx)},${f2(low + 3)} ${f2(b[0])},${f2(b[1] + 2)} Q${f2(mx)},${f2(low - 6)} ${f2(a[0])},${f2(a[1] + 2)} Z" fill="#F3E4C4" stroke="#C9A16A" stroke-width="0.6"/>`
        + stripe(0, '#E2574C') + stripe(2.2, '#5C83C2') + stripe(4.2, '#E2574C')
        + ell(kx, ky, 3.6, 2, '#FFFDF8', ` stroke="${OUT}" stroke-width="0.5"`)
        + `<path d="M${f2(mx + 1)},${f2(low - 4.6)} l3.4,-1.2 l3.4,1.2 l0,1.6 l-3.4,-1 l-3.4,1 Z" fill="#8C4B32"/><path d="M${f2(mx + 1.4)},${f2(low - 4.8)} l3,-1 l3,1" stroke="#FFFDF8" stroke-width="0.6" fill="none"/>`;
    }
  }]
};
// Chat roulé en boule sur un coussin près de la porte : il respire, le bout de la queue bat, une oreille frémit
const chat = {
  layers: [{
    at: [0.46, 0.8],
    frame: [-14, -16, 28, 20],
    n: 8,
    fps: 3,
    draw: (T, level, f, n) => {
      const [x, y] = T.p(0, 0, 0);
      const breath = wave(f, n, 0.45);
      const flick = f === 2 || f === 3 ? -1.6 : 0;
      const ear = f === 6 ? -18 : 0;
      return ell(x, y + 0.4, 9, 2.6, 'rgba(40,55,20,.22)')
        + ell(x, y - 1, 8.6, 3.2, '#C8504A') + ell(x - 0.6, y - 1.8, 7.4, 2.4, '#DE6A5E')
        + [[-8, -0.4], [8, -1], [-6, 1.6], [6, 1.8]].map(([dx, dy]) => dot(x + dx, y + dy, 0.9, '#F2C04B')).join('')
        + ell(x - 0.6, y - 5.4, 6.2 + breath, 3.6 + breath * 0.5, '#F2994A', ' stroke="rgba(120,60,20,.35)" stroke-width="0.5"')
        + `<path d="M${f2(x - 4)},${f2(y - 8)} q1.4,1.2 1,3 M${f2(x - 1.2)},${f2(y - 8.8)} q1.2,1.4 0.8,3.4 M${f2(x + 1.6)},${f2(y - 8.6)} q1,1.2 0.6,3" stroke="#C8622A" stroke-width="0.9" fill="none"/>`
        + dot(x + 4.4, y - 5.2, 3.2, '#F2994A')
        + `<g transform="rotate(${ear} ${f2(x + 3.4)} ${f2(y - 7.6)})"><path d="M${f2(x + 2.4)},${f2(y - 7.4)} l0.6,-2.8 l1.8,2 Z" fill="#F2994A"/><path d="M${f2(x + 2.8)},${f2(y - 7.6)} l0.4,-1.6 l0.9,1.1 Z" fill="#F7B8B0"/></g>`
        + `<path d="M${f2(x + 5)},${f2(y - 7.8)} l1.4,-2.6 l1.2,2.3 Z" fill="#F2994A"/>`
        + `<path d="M${f2(x + 3.4)},${f2(y - 5.2)} q0.7,0.6 1.4,0 M${f2(x + 5.4)},${f2(y - 5.2)} q0.7,0.6 1.4,0" stroke="#5E3A22" stroke-width="0.6" fill="none"/>`
        + dot(x + 6.6, y - 4, 0.5, '#E07A7A')
        + `<path d="M${f2(x - 6.4)},${f2(y - 3.6)} q-1.4,3.4 3.6,3.8 q4.6,0.2 6.2,-1.4" stroke="#F2994A" stroke-width="2.2" fill="none" stroke-linecap="round"/>`
        + `<path d="M${f2(x + 3.4)},${f2(y - 1.2)} q1.6,${f2(-0.6 + flick)} 2.6,${f2(-1.8 + flick)}" stroke="#FFF4E6" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;
    }
  }]
};
// Chien assis qui garde la maison : il remue la queue et halète, sa gamelle à côté
const chien = {
  layers: [{
    at: [-0.24, 0.88],
    frame: [-16, -26, 34, 30],
    n: 8,
    fps: 6,
    draw: (T, level, f, n) => {
      const [x, y] = T.p(0, 0, 0);
      const wag = wave(f, n, 3.2);
      const pant = f % 2 ? 0.8 : 0;
      const [gx, gy] = T.p(0.14, -0.1, 0);
      const head = y - 12.2 + pant * 0.3;
      return ell(x, y + 0.4, 8, 2, 'rgba(40,55,20,.25)')
        + ell(gx, gy, 4, 1.6, '#4C7FB5') + ell(gx, gy - 1, 4, 1.5, '#6FA3D9') + ell(gx, gy - 1.2, 2.8, 0.9, '#8B5631')
        + `<path d="M${f2(x - 6)},${f2(y - 3)} q-4,${f2(-2 + wag)} -5,${f2(-6.4 + wag)}" stroke="#B98552" stroke-width="2.4" stroke-linecap="round" fill="none"/>`
        + ell(x - 1.6, y - 4.6, 6, 4.4, '#C9935E', ' stroke="rgba(90,50,20,.35)" stroke-width="0.5"')
        + `<path d="M${f2(x + 0.4)},${f2(y - 8)} Q${f2(x + 4.6)},${f2(y - 7)} ${f2(x + 4.4)},${f2(y)} L${f2(x + 0.6)},${f2(y)} Z" fill="#D9A877"/>`
        + ln([x + 1.6, y - 3], [x + 1.6, y - 0.2], '#B98552', 1.8) + ln([x + 3.6, y - 3], [x + 3.6, y - 0.2], '#B98552', 1.8)
        + ell(x + 1.6, y, 1.4, 0.7, '#FFF4E6') + ell(x + 3.6, y, 1.4, 0.7, '#FFF4E6')
        + dot(x + 3, head, 4.4, '#C9935E')
        + ell(x + 6.4, head + 1.2, 2.8, 2, '#E7C08A')
        + dot(x + 8.8, head + 0.4, 0.95, '#2A2420')
        + (pant ? `<path d="M${f2(x + 6.6)},${f2(y - 9.4)} q0.6,2.4 1.8,1.4 q0.4,-1 -0.4,-1.8 Z" fill="#E86A7A"/>` : '')
        + `<path d="M${f2(x + 0.2)},${f2(y - 15.2)} q-3.2,1 -2.2,6.4" stroke="#8B5631" stroke-width="2.6" stroke-linecap="round" fill="none"/>`
        + dot(x + 4.6, head - 0.8, 0.7, '#2A2420')
        + `<path d="M${f2(x + 0.4)},${f2(y - 8.2)} q3,1.4 5.6,0" stroke="#E2463A" stroke-width="1.5" fill="none"/>` + dot(x + 3.2, y - 7, 0.9, '#F2C04B');
    }
  }]
};
// Grand sablier sur un guéridon : le sable s'écoule et monte en dune dans l'ampoule du bas (palier V)
const sablier = {
  layers: [{
    at: [0.92, 0.62],
    frame: [-16, -46, 32, 52],
    n: 8,
    fps: 2,
    draw: (T, level, f, n) => {
      const [x, y] = T.p(0, 0, 16);
      const k = f / n;
      const glass = `M${f2(x - 4.4)},${f2(y - 20)} C${f2(x - 4.6)},${f2(y - 14)} ${f2(x - 0.6)},${f2(y - 12)} ${f2(x - 0.6)},${f2(y - 10)} C${f2(x - 0.6)},${f2(y - 8)} ${f2(x - 4.6)},${f2(y - 6)} ${f2(x - 4.4)},${f2(y)} L${f2(x + 4.4)},${f2(y)} C${f2(x + 4.6)},${f2(y - 6)} ${f2(x + 0.6)},${f2(y - 8)} ${f2(x + 0.6)},${f2(y - 10)} C${f2(x + 0.6)},${f2(y - 12)} ${f2(x + 4.6)},${f2(y - 14)} ${f2(x + 4.4)},${f2(y - 20)} Z`;
      const top = y - 11 - (1 - k) * 7;
      const pile = 1 + k * 6;
      const post = dx => `<rect x="${f2(x + dx - 0.6)}" y="${f2(y - 21)}" width="1.2" height="21" fill="${WOOD_DARK.left}"/>`;
      return T.shadow(0, 0, 0.13, 0.22)
        + T.cyl(0, 0, 0, 2, 0.06, WOOD_DARK, 'foot') + T.box(-0.012, -0.012, 0.012, 0.012, 2, 12, WOOD_DARK) + T.cyl(0, 0, 12, 14, 0.12, WOOD, 'table')
        + T.cyl(0, 0, 14, 16, 0.09, WOOD_DARK, 'base')
        + post(-5.2) + post(5.2)
        + `<defs><clipPath id="${T.id('glass')}"><path d="${glass}"/></clipPath></defs>`
        + `<g clip-path="url(#${T.id('glass')})"><rect x="${f2(x - 5)}" y="${f2(top)}" width="10" height="${f2(y - 10 - top)}" fill="#F2C66E"/>`
        + `<path d="M${f2(x - 5)},${f2(y)} L${f2(x - 5)},${f2(y - pile * 0.4)} Q${f2(x)},${f2(y - pile * 1.6)} ${f2(x + 5)},${f2(y - pile * 0.4)} L${f2(x + 5)},${f2(y)} Z" fill="#E9B65A"/>`
        + (k < 1 ? ln([x, y - 10], [x, y - pile], '#F2C66E', 0.7) : '') + '</g>'
        + `<path d="${glass}" fill="rgba(220,240,255,.22)" stroke="rgba(255,255,255,.85)" stroke-width="0.6"/>`
        + ln([x - 3, y - 18], [x - 2, y - 14], 'rgba(255,255,255,.7)', 0.8) + ln([x - 3, y - 2], [x - 2.4, y - 5], 'rgba(255,255,255,.6)', 0.7)
        + post(0)
        + T.cyl(0, 0, 36, 38, 0.09, WOOD_DARK, 'cap') + dot(...T.p(0, 0, 39), 1, WOOD.top);
    }
  }]
};
// Hibou sur son perchoir : il tourne la tête, cligne de ses grands yeux d'or (palier VI)
const hibou = {
  layers: [{
    at: [-0.92, 0.36],
    frame: [-16, -46, 32, 52],
    n: 8,
    fps: 3,
    draw: (T, level, f) => {
      const [ox, oy] = T.p(0, 0, 25);
      const turn = f === 2 || f === 3 ? 1.6 : f === 5 ? -1.2 : 0;
      const blink = f === 6;
      const feather = '#9C6B43';
      const eye = dx => (blink
        ? `<path d="M${f2(ox + dx - 1.6)},${f2(oy - 14)} q1.6,1 3.2,0" stroke="#3A2A1E" stroke-width="0.7" fill="none"/>`
        : dot(ox + dx, oy - 14, 1.8, '#F2C04B') + dot(ox + dx + turn * 0.3, oy - 14, 0.9, '#1E1A17') + dot(ox + dx - 0.5, oy - 14.6, 0.35, '#FFFFFF'));
      return T.shadow(0, 0, 0.1, 0.2) + T.pebble(0.05, 0.05, 1.8)
        + T.box(-0.02, -0.02, 0.02, 0.02, 0, 23, WOOD_DARK)
        + T.box(-0.015, -0.12, 0.015, 0.12, 23, 25, WOOD)
        + `<path d="M${f2(ox - 2)},${f2(oy - 2)} l-1,4 l2,-1 l1,2 l1,-2 l2,1 l-1,-4 Z" fill="#7A4E30"/>`
        + ell(ox, oy - 6.4, 5, 6.4, feather, ' stroke="rgba(60,35,20,.35)" stroke-width="0.5"')
        + ell(ox + 0.4, oy - 5.6, 3.2, 4.6, '#E7C99A')
        + [[-1, -7.4], [1.4, -6.4], [-0.4, -4.4], [1.8, -3.6]].map(([dx, dy]) => `<path d="M${f2(ox + dx - 0.7)},${f2(oy + dy)} l0.7,0.7 l0.7,-0.7" stroke="#B98552" stroke-width="0.5" fill="none"/>`).join('')
        + ell(ox - 3.8, oy - 6, 1.8, 4.6, '#7A4E30') + ell(ox + 4, oy - 6, 1.6, 4.4, '#8B5631')
        + [-1.6, 0, 1.6].map(dx => ln([ox + dx, oy - 1], [ox + dx, oy + 0.6], '#E8A13A', 0.7)).join('')
        + `<g transform="translate(${f2(turn)} 0)">`
        + ell(ox, oy - 14, 5.4, 4.6, feather, ' stroke="rgba(60,35,20,.35)" stroke-width="0.5"')
        + `<path d="M${f2(ox - 4.6)},${f2(oy - 16.4)} l-0.6,-3.6 l2.6,2 Z M${f2(ox + 4.6)},${f2(oy - 16.4)} l0.6,-3.6 l-2.6,2 Z" fill="${feather}"/>`
        + ell(ox - 2, oy - 13.8, 2.6, 2.4, '#E7C99A') + ell(ox + 2, oy - 13.8, 2.6, 2.4, '#E7C99A')
        + eye(-2) + eye(2)
        + `<path d="M${f2(ox - 0.7)},${f2(oy - 12.6)} l0.7,1.6 l0.7,-1.6 Z" fill="#5E3A22"/></g>`;
    }
  }]
};
// Grimoire volant : il flotte au-dessus de son lutrin de pierre, ses pages tournent seules, des runes s'en échappent ;
// il luit la nuit (palier VII)
const GRIMOIRE_AT = [0.88, 0.95];
const grimoire = {
  light: () => [GRIMOIRE_AT[0], GRIMOIRE_AT[1], 24, 22, '200,160,255'],
  layers: [{
    at: GRIMOIRE_AT,
    frame: [-14, -22, 28, 28],
    draw: T => T.shadow(0, 0, 0.1, 0.2)
      + T.box(-0.07, -0.07, 0.07, 0.07, 0, 3, STONE) + T.cyl(0, 0, 3, 13, 0.035, STONE, 'col') + T.box(-0.06, -0.06, 0.06, 0.06, 13, 15, STONE)
      + T.disc(0, 0, 15, 0.045, 'rgba(200,160,255,.55)') + T.disc(0, 0, 15, 0.025, 'rgba(240,225,255,.8)')
  }, {
    at: GRIMOIRE_AT,
    frame: [-22, -50, 44, 36],
    n: 8,
    fps: 5,
    motion: t => [0, 0, Math.sin(t * 1.4) * 1.6],
    draw: (T, level, f, n) => {
      const [x, y] = T.p(0, 0, 25);
      const t = f / n;
      const ex = x + 10 * Math.cos(Math.PI * t);
      const ey = y - 2 - Math.sin(Math.PI * t) * 7;
      const lines = s => [0, 1, 2, 3].map(k => ln([x + s * 2.4, y - 3.6 + k * 1.3 + k * 0.1], [x + s * 8.4, y - 4.8 + k * 1.3], 'rgba(90,70,110,.4)', 0.5)).join('');
      const runes = [0, 1, 2].map(k => {
        const r = (t + k / 3) % 1;
        const rx = x + (k - 1) * 5 + Math.sin(r * 6 + k) * 1.5;
        const ry = y - 8 - r * 14;
        const o = f2(1 - r);
        return k === 0 ? `<circle cx="${f2(rx)}" cy="${f2(ry)}" r="1.4" fill="none" stroke="#D9C2FF" stroke-width="0.6" opacity="${o}"/>`
          : k === 1 ? `<path d="M${f2(rx - 1.4)},${f2(ry + 1)} l1.4,-2.4 l1.4,2.4 Z" fill="none" stroke="#FFE7A8" stroke-width="0.6" opacity="${o}"/>`
            : `<path d="M${f2(rx - 1.2)},${f2(ry)} h2.4 M${f2(rx)},${f2(ry - 1.2)} v2.4" stroke="#D9C2FF" stroke-width="0.6" opacity="${o}"/>`;
      }).join('');
      return ell(x, y + 1, 12, 3, 'rgba(200,160,255,.22)')
        + `<path d="M${f2(x)},${f2(y + 1.4)} L${f2(x - 11)},${f2(y - 2)} L${f2(x - 11)},${f2(y - 3.4)} L${f2(x)},${f2(y)} L${f2(x + 11)},${f2(y - 3.4)} L${f2(x + 11)},${f2(y - 2)} Z" fill="#6A3FA0" stroke="#4A2A78" stroke-width="0.5"/>`
        + `<path d="M${f2(x)},${f2(y)} Q${f2(x - 5)},${f2(y - 5)} ${f2(x - 10)},${f2(y - 3.4)} L${f2(x - 10)},${f2(y - 5)} Q${f2(x - 5)},${f2(y - 7)} ${f2(x)},${f2(y - 2)} Z" fill="#FBF3DF" stroke="#D8C39B" stroke-width="0.4"/>`
        + `<path d="M${f2(x)},${f2(y)} Q${f2(x + 5)},${f2(y - 5)} ${f2(x + 10)},${f2(y - 3.4)} L${f2(x + 10)},${f2(y - 5)} Q${f2(x + 5)},${f2(y - 7)} ${f2(x)},${f2(y - 2)} Z" fill="#FBF3DF" stroke="#D8C39B" stroke-width="0.4"/>`
        + lines(-1) + lines(1)
        + `<path d="M${f2(x)},${f2(y - 2)} Q${f2((x + ex) / 2)},${f2(Math.min(y - 6, ey - 3))} ${f2(ex)},${f2(ey - 3)} L${f2(ex)},${f2(ey - 1.6)} Q${f2((x + ex) / 2)},${f2(Math.min(y - 4.4, ey - 1.4))} ${f2(x)},${f2(y)} Z" fill="#FFFDF4" stroke="#D8C39B" stroke-width="0.4"/>`
        + dot(x - 10.6, y - 2.7, 0.8, '#F2C04B') + dot(x + 10.6, y - 2.7, 0.8, '#F2C04B')
        + runes
        + star(x - 7, y - 10, 1.4, '#FFF2B0', Math.max(0, wave(f, n, 1))) + star(x + 8, y - 12, 1.2, '#FFF2B0', Math.max(0, wave(f, n, 1, 3)));
    }
  }]
};

export default {
  cuisine,
  lit,
  chat,
  chien,
  sablier,
  hibou,
  grimoire
};
