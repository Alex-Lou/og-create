// Les créations du palier II : fontaine, brasero, pergola, statue, arche, étal, kiosque (craftSprites.js les réunit).
import { pyramid } from '../iso';
import { WOOD, WOOD_DARK, STONE, WHITE_STONE, BLUE_ROOF } from '../palette';
import { ln, poly, ell, dot, wave, star, DARK_IRON, OUT, f2 } from '../spriteKit';
import { TAU, LEAF, LEAF_LIGHT, LEAF_DARK, WATER, WATER_LIGHT, BRASS, post, leaves, flame } from './kit';

// Fontaine : vasque ronde de pierre, colonne et coupe ; l'eau retombe en gouttes
const fontaine = {
  light: () => [0, 0, 10, 10, '170,220,255'],
  layers: [{
    frame: [-36, -62, 72, 80],
    n: 6,
    fps: 6,
    draw: (T, f, n) => {
      const [cx, cy] = T.p(0, 0, 28);
      const drops = Array.from({ length: 8 }, (_, k) => {
        const a = (k / 8) * TAU;
        const p = ((f + k * 0.7) % n) / n;
        const x = cx + Math.cos(a) * (6 + p * 9);
        const y = cy - 1 + Math.sin(a) * (3 + p * 4.5) + p * p * 18;
        return dot(x, y, 1.1 - p * 0.4, WATER_LIGHT);
      }).join('');
      const [wx, wy] = T.p(0, 0, 9);
      const ripple = ell(wx, wy, 8 + (f % 3) * 3, 3 + (f % 3) * 1.3, 'none', ` stroke="rgba(255,255,255,${f2(0.6 - (f % 3) * 0.18)})" stroke-width="0.7"`);
      return T.shadow(0, 0, 0.42, 0.16)
        + T.cyl(0, 0, 0, 9, 0.4, STONE, 'vasque')
        + T.disc(0, 0, 9, 0.34, WATER)
        + ripple
        + T.cyl(0, 0, 9, 24, 0.05, STONE, 'col')
        + T.cyl(0, 0, 24, 28, 0.16, STONE, 'coupe')
        + T.disc(0, 0, 28, 0.12, WATER)
        + ln([cx, cy - 1], [cx, cy - 7], WATER_LIGHT, 1.4) + dot(cx, cy - 8, 1.6, WATER_LIGHT)
        + drops;
    }
  }]
};

// Brasero : coupe de fer sur trois pieds, braises et flammes (le feu brûle même de jour)
const brasero = {
  light: () => [0, 0, 24, 22, '255,170,90', true],
  layers: [{
    frame: [-28, -54, 56, 70],
    n: 6,
    fps: 8,
    draw: (T, f, n) => {
      const [cx, cy] = T.p(0, 0, 18);
      const legs = [0, 1, 2].map(k => {
        const a = (k / 3) * TAU + 0.5;
        return ln(T.p(Math.cos(a) * 0.18, Math.sin(a) * 0.18, 0), T.p(Math.cos(a) * 0.1, Math.sin(a) * 0.1, 14), DARK_IRON.right, 1.6);
      }).join('');
      const sparks = [0, 1, 2].map(k => {
        const p = ((f + k * 2) % n) / n;
        return dot(cx + Math.sin(k * 2 + p * 5) * 5, cy - 8 - p * 22, 0.8 * (1 - p) + 0.2, '#FFD27A');
      }).join('');
      return T.shadow(0, 0, 0.26, 0.18)
        + legs
        + T.cyl(0, 0, 13, 18, 0.2, DARK_IRON, 'coupe')
        + T.disc(0, 0, 18, 0.17, '#5A2A1A')
        + [-4, 0, 4].map((dx, k) => dot(cx + dx, cy + (k % 2), 2, k % 2 ? '#F59A3C' : '#C9473A')).join('')
        + flame(cx - 3, cy + 1, 13 + wave(f, n, 2), 3.4, f / n)
        + flame(cx + 3, cy + 1, 10 + wave(f, n, 2, 2), 3, (f / n + 0.4) % 1)
        + sparks;
    }
  }]
};

// Pergola : quatre poteaux, poutres croisées, glycine qui grimpe et retombe en grappes mauves
const pergola = {
  layers: [{
    frame: [-38, -66, 76, 84],
    n: 6,
    fps: 2,
    draw: (T, f, n) => {
      const c = 0.36;
      let out = T.shadow(0, 0, 0.44, 0.14);
      const corners = [[-c, -c], [c, -c], [-c, c], [c, c]];
      for (const [u, v] of corners.slice(0, 2)) out += post(T, u, v, 0, 34, WOOD, 0.03);
      // Poutres le long de u, chevrons le long de v
      for (const v of [-c, c]) out += T.box(-c - 0.06, v - 0.025, c + 0.06, v + 0.025, 34, 37, WOOD_DARK);
      for (const u of [-0.24, -0.08, 0.08, 0.24]) out += T.box(u - 0.016, -c - 0.06, u + 0.016, c + 0.06, 37, 39, WOOD);
      for (const [u, v] of corners.slice(2)) out += post(T, u, v, 0, 34, WOOD, 0.03);
      // Glycine : feuillage sur le toit et grappes pendantes qui se balancent
      for (const [u, v] of [[-0.2, -0.2], [0.12, -0.24], [0.26, 0.06], [-0.1, 0.1], [0.06, 0.26], [-0.28, 0.24]]) {
        const [x, y] = T.p(u, v, 39);
        out += leaves(x, y - 1, 3.4);
      }
      for (const [u, v, k] of [[-0.2, c, 0], [0, c, 1], [0.22, c, 2], [c, -0.1, 3], [c, 0.16, 4]]) {
        const [x, y] = T.p(u, v, 36);
        const s = wave(f, n, 0.8, k);
        out += [0, 1, 2, 3].map(i => dot(x + s * (i / 3), y + 2 + i * 2.2, 1.9 - i * 0.3, i % 2 ? '#B48AE0' : '#9A6ED0')).join('');
      }
      // Vigne qui grimpe le poteau avant
      const [px, py] = T.p(c, c, 2);
      return out + `<path d="M${f2(px)},${f2(py)} q-3,-8 0,-14 t0,-14" stroke="${LEAF_DARK}" stroke-width="0.9" fill="none"/>` + leaves(px - 1, py - 10, 2) + leaves(px + 1, py - 22, 2);
    }
  }]
};

// Statue : socle mouluré, personnage drapé de marbre tenant un livre levé
const statue = {
  layers: [{
    frame: [-28, -86, 56, 102],
    draw: T => {
      const [x, y] = T.p(0, 0, 18);
      const MARBLE = '#F4F0E8', SHADE = '#D6CFC2', DEEP = '#B9B1A2';
      return T.shadow(0, 0, 0.3, 0.2)
        + T.box(-0.2, -0.2, 0.2, 0.2, 0, 4, STONE)
        + T.box(-0.15, -0.15, 0.15, 0.15, 4, 15, WHITE_STONE)
        + T.box(-0.18, -0.18, 0.18, 0.18, 15, 18, STONE)
        // Drapé : robe en trapèze, plis
        + `<path d="M${f2(x - 9)},${f2(y)} L${f2(x - 5)},${f2(y - 26)} L${f2(x + 5)},${f2(y - 26)} L${f2(x + 9)},${f2(y)} Z" fill="${MARBLE}" stroke="${DEEP}" stroke-width="0.6"/>`
        + `<path d="M${f2(x + 1)},${f2(y - 26)} L${f2(x + 9)},${f2(y)} L${f2(x + 3)},${f2(y)} Z" fill="${SHADE}"/>`
        + [-4, 0, 4].map(dx => ln([x + dx * 0.5, y - 20], [x + dx, y - 1], DEEP, 0.5)).join('')
        // Bras levé tenant le livre ouvert ; tête et chignon
        + ln([x + 4, y - 24], [x + 10, y - 33], SHADE, 3)
        + poly([[x + 6, y - 36], [x + 10, y - 34], [x + 14, y - 37], [x + 14, y - 40], [x + 10, y - 37.4], [x + 6, y - 39]], MARBLE, ` stroke="${DEEP}" stroke-width="0.5"`)
        + ln([x - 4, y - 24], [x - 6, y - 14], SHADE, 3)
        + dot(x, y - 30.5, 4.4, MARBLE) + dot(x + 1.2, y - 29.6, 3.4, SHADE) + dot(x - 1.4, y - 34.4, 2, MARBLE)
        + ell(x, y - 31, 4.4, 4.4, 'none', ` stroke="${DEEP}" stroke-width="0.5"`)
        + star(x + 13, y - 41, 2.2, '#FFF4C8', 0.9);
    }
  }]
};

// Arche fleurie : deux montants de bois, cintre couvert de feuilles et de roses qui frémissent
const arche = {
  layers: [{
    frame: [-34, -72, 68, 88],
    n: 6,
    fps: 2,
    draw: (T, f, n) => {
      const a = T.p(-0.34, 0.06, 0), b = T.p(0.34, 0.06, 0);
      const ta = T.p(-0.34, 0.06, 30), tb = T.p(0.34, 0.06, 30);
      const mid = [(ta[0] + tb[0]) / 2, (ta[1] + tb[1]) / 2 - 16];
      const arc = `M${f2(ta[0])},${f2(ta[1])} Q${f2(mid[0])},${f2(mid[1] - 14)} ${f2(tb[0])},${f2(tb[1])}`;
      let out = T.shadow(0, 0.06, 0.4, 0.12)
        + ln(a, ta, WOOD_DARK.right, 3) + ln(b, tb, WOOD_DARK.right, 3)
        + `<path d="${arc}" stroke="${WOOD_DARK.left}" stroke-width="3" fill="none"/>`;
      // Feuilles et roses le long du cintre et des montants
      const pts = [];
      for (let k = 0; k <= 8; k++) {
        const s = k / 8;
        const x = (1 - s) * (1 - s) * ta[0] + 2 * (1 - s) * s * mid[0] + s * s * tb[0];
        const y = (1 - s) * (1 - s) * ta[1] + 2 * (1 - s) * s * (mid[1] - 14) + s * s * tb[1];
        pts.push([x, y]);
      }
      for (const [p, q] of [[a, ta], [b, tb]]) for (const s of [0.35, 0.65]) pts.push([p[0] + (q[0] - p[0]) * s, p[1] + (q[1] - p[1]) * s]);
      pts.forEach(([x, y], k) => {
        out += leaves(x + (k % 2 ? 1.5 : -1.5), y, 3);
        if (k % 2 === 0) out += dot(x, y - 1 + wave(f, n, 0.4, k), 2, k % 4 ? '#E8566A' : '#F7A8C0') + dot(x - 0.5, y - 1.6, 0.8, 'rgba(255,255,255,.6)');
      });
      return out;
    }
  }]
};

// Étal du marché : table, cageots de fruits et légumes, auvent rayé qui ondule
const etal = {
  layers: [{
    frame: [-36, -64, 72, 82],
    n: 6,
    fps: 3,
    draw: (T, f, n) => {
      const v0 = -0.22, v1 = 0.22;
      let out = T.shadow(0, 0, 0.42, 0.16);
      for (const u of [-0.36, 0.34]) out += post(T, u, v0, 0, 36, WOOD_DARK, 0.022);
      out += T.box(-0.38, v0 + 0.06, 0.36, v1, 0, 13, WOOD);
      out += ln(T.p(-0.38, v1, 7), T.p(0.36, v1, 7), 'rgba(120,70,30,.35)', 0.6);
      // Cageots et leur contenu
      const goods = [['#F08A3A', '#C8622A'], ['#E8566A', '#B13A31'], [LEAF_LIGHT, LEAF], ['#F2C04B', '#C99A45']];
      [-0.26, -0.08, 0.1, 0.26].forEach((u, k) => {
        out += T.box(u - 0.07, -0.02, u + 0.07, 0.14, 13, 17, { top: '#C99A6A', left: WOOD.left, right: WOOD.right });
        for (const [du, dv] of [[-0.03, 0.02], [0.03, 0.04], [0, 0.1], [-0.035, 0.1], [0.035, 0.1]]) {
          const [x, y] = T.p(u + du, dv, 17.6);
          out += dot(x, y, 2, goods[k][0]) + dot(x - 0.6, y - 0.6, 0.6, 'rgba(255,255,255,.5)');
        }
      });
      for (const u of [-0.36, 0.34]) out += post(T, u, v1, 0, 30, WOOD_DARK, 0.022);
      // Auvent rayé, du haut des poteaux arrière au bas des poteaux avant ; lambrequin qui ondule
      const k = wave(f, n, 0.8);
      for (let i = 0; i < 6; i++) {
        const u0 = -0.4 + i * 0.13, u1 = u0 + 0.13;
        out += T.face([[u0, v0 - 0.04, 37], [u1, v0 - 0.04, 37], [u1, v1 + 0.06, 30], [u0, v1 + 0.06, 30]], i % 2 ? '#FFFFFF' : '#C9473A', ` stroke="${OUT}" stroke-width="0.3"`);
        const [x0, y0] = T.p(u0, v1 + 0.06, 30), [x1, y1] = T.p(u1, v1 + 0.06, 30);
        out += `<path d="M${f2(x0)},${f2(y0)} L${f2(x1)},${f2(y1)} Q${f2((x0 + x1) / 2)},${f2((y0 + y1) / 2 + 5 + k)} ${f2(x0)},${f2(y0)} Z" fill="${i % 2 ? '#FFFFFF' : '#C9473A'}" stroke="${OUT}" stroke-width="0.3"/>`;
      }
      return out;
    }
  }]
};

/* ---------- Palier III ---------- */
// Kiosque : estrade ronde, colonnettes, toit conique bleu et son fanion qui claque
const kiosque = {
  light: () => [0, 0, 18, 22, '255,226,150'],
  layers: [{
    frame: [-40, -96, 80, 114],
    n: 6,
    fps: 4,
    draw: (T, f, n) => {
      const r = 0.4;
      const cols = Array.from({ length: 8 }, (_, k) => (k / 8) * TAU + TAU / 16);
      const back = cols.filter(a => Math.cos(a) + Math.sin(a) < 0);
      const front = cols.filter(a => Math.cos(a) + Math.sin(a) >= 0);
      const col = a => T.cyl(Math.cos(a) * r * 0.88, Math.sin(a) * r * 0.88, 6, 34, 0.025, WHITE_STONE, `c${Math.round(a * 100)}`);
      const [tx, ty] = T.p(0, 0, 58);
      const k = wave(f, n, 1);
      const flag = `<path d="M${f2(tx)},${f2(ty - 10)} Q${f2(tx + 5)},${f2(ty - 12 + k)} ${f2(tx + 10)},${f2(ty - 9 - k)} L${f2(tx)},${f2(ty - 5)} Z" fill="#C9473A"/>`;
      return T.shadow(0, 0, 0.48, 0.16)
        + T.cyl(0, 0, 0, 6, r, STONE, 'estrade')
        + back.map(col).join('')
        // Rambarde de fer entre les colonnes
        + T.disc(0, 0, 14, r * 0.86, 'none', ` stroke="${DARK_IRON.left}" stroke-width="1"`)
        + front.map(col).join('')
        + T.cyl(0, 0, 34, 37, r * 1.02, { top: '#F4F0E8', left: '#E2D9C8', right: '#BDB29E' }, 'frise')
        + pyramid(T.u - r, T.v - r, T.u + r, T.v + r, 37, 21, { back: BLUE_ROOF.back, left: BLUE_ROOF.front, right: BLUE_ROOF.back }, 0.04)
        + ln([tx, ty], [tx, ty - 11], DARK_IRON.right, 0.9)
        + flag + dot(tx, ty - 11, 1, BRASS.top);
    }
  }]
};

export { fontaine, brasero, pergola, statue, arche, etal, kiosque };
