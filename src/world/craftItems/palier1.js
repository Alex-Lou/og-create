// Les créations du palier I : muret, lanterne, banc, épouvantail, nichoir, girouette (craftSprites.js les réunit).
import { gable, pyramid } from '../iso';
import { WOOD, WOOD_DARK, STONE, WHITE_STONE, ROOF_RED, GLASS } from '../palette';
import { ln, poly, ell, dot, wave, bird, DARK_IRON, COPPER, STRAW, OUT, f2 } from '../spriteKit';
import { TAU, BRASS, MOSS, post, flame } from './kit';

// Muret de pierre : moellons assisés, chaperon, mousse
const muret = {
  layers: [{
    frame: [-36, -36, 72, 52],
    draw: T => {
      let out = T.shadow(0, 0.02, 0.4, 0.16) + T.box(-0.42, -0.1, 0.42, 0.1, 0, 12, STONE) + T.box(-0.44, -0.12, 0.44, 0.12, 12, 14, WHITE_STONE);
      // Joints : assises sur la face avant (côté +v)
      for (const z of [4, 8]) out += ln(T.p(-0.42, 0.1, z), T.p(0.42, 0.1, z), 'rgba(120,110,95,.45)', 0.6);
      for (const [u, z0, z1] of [[-0.25, 0, 4], [0.05, 0, 4], [0.32, 0, 4], [-0.1, 4, 8], [0.2, 4, 8], [-0.32, 8, 12], [0.02, 8, 12], [0.3, 8, 12]]) {
        out += ln(T.p(u, 0.1, z0), T.p(u, 0.1, z1), 'rgba(120,110,95,.45)', 0.6);
      }
      const [mx, my] = T.p(-0.34, 0.1, 2);
      return out + ell(mx, my, 4, 1.6, MOSS) + dot(...T.p(0.38, -0.02, 14), 1.6, MOSS);
    }
  }]
};

// Lanterne : poteau de fer sur un socle, lanterne vitrée dont la flamme vacille, petit chapeau
const lanterne = {
  light: () => [0, 0, 34, 20, '255,214,130'],
  layers: [{
    frame: [-22, -64, 44, 80],
    n: 6,
    fps: 6,
    draw: (T, f, n) => {
      const [lx, ly] = T.p(0, 0, 28);
      return T.shadow(0, 0, 0.18, 0.18)
        + T.box(-0.08, -0.08, 0.08, 0.08, 0, 4, STONE)
        + T.cyl(0, 0, 4, 26, 0.022, DARK_IRON, 'mat')
        + ln(T.p(0, 0, 24), T.p(0.07, 0.07, 26), DARK_IRON.right, 1.2)
        + T.box(-0.06, -0.06, 0.06, 0.06, 26, 27.5, DARK_IRON)
        + T.box(-0.055, -0.055, 0.055, 0.055, 27.5, 37, { top: GLASS, left: 'rgba(255,230,160,.85)', right: 'rgba(240,200,120,.85)' })
        + flame(lx, ly - 1, 5 + wave(f, n, 0.8), 1.5, f / n)
        + [[-0.055, 0.055], [0.055, 0.055], [0.055, -0.055]].map(([u, v]) => ln(T.p(u, v, 27.5), T.p(u, v, 37), DARK_IRON.right, 0.8)).join('')
        + pyramid(T.u - 0.07, T.v - 0.07, T.u + 0.07, T.v + 0.07, 37, 6, { back: DARK_IRON.top, left: DARK_IRON.left, right: DARK_IRON.right }, 0.01)
        + dot(...T.p(0, 0, 44), 1.1, DARK_IRON.left);
    }
  }]
};

// Banc : assise et dossier de lattes, pieds de bois sombre, un coussin
const banc = {
  layers: [{
    frame: [-34, -38, 68, 54],
    draw: T => {
      const v0 = -0.06, v1 = 0.1;
      let out = T.shadow(0, 0.04, 0.34, 0.16);
      for (const u of [-0.32, 0.3]) out += post(T, u, v1, 0, 7) + post(T, u, v0, 0, 18);
      out += T.box(-0.36, v0, 0.34, v1 + 0.03, 7, 9, WOOD);
      for (const k of [0.02, 0.07]) out += ln(T.p(-0.36, v0 + k + 0.03, 9), T.p(0.34, v0 + k + 0.03, 9), 'rgba(120,70,30,.35)', 0.5);
      for (const z of [12, 16]) out += T.box(-0.36, v0 - 0.02, 0.34, v0, z, z + 2.4, WOOD);
      const [cx, cy] = T.p(-0.14, 0.03, 9);
      return out + ell(cx, cy - 1.4, 6, 2.2, '#C9473A', ` stroke="${OUT}" stroke-width="0.4"`) + ell(cx - 1.4, cy - 2.2, 2.6, 0.8, 'rgba(255,255,255,.35)');
    }
  }]
};

// Épouvantail : croix de bois, chemise rapiécée, chapeau de paille ; il penche au vent, un corbeau se pose
const epouvantail = {
  layers: [{
    frame: [-30, -70, 60, 86],
    n: 8,
    fps: 3,
    draw: (T, f, n) => {
      const sway = wave(f, n, 1.4);
      const [bx, by] = T.p(0, 0, 0);
      const top = [bx + sway, by - 40];
      const arm = [[top[0] - 13, top[1] + 9 + sway * 0.3], [top[0] + 13, top[1] + 9 - sway * 0.3]];
      return T.shadow(0, 0, 0.2, 0.16)
        + ln([bx, by], top, WOOD_DARK.right, 2.4)
        + ln(arm[0], arm[1], WOOD_DARK.left, 2)
        // Chemise et paille aux poignets
        + poly([[top[0] - 7, top[1] + 7], [top[0] + 7, top[1] + 7], [top[0] + 6, top[1] + 24], [top[0] - 6, top[1] + 24]], '#5A8FD8', ` stroke="${OUT}" stroke-width="0.6"`)
        + poly([[top[0] - 7, top[1] + 7], [arm[0][0] + 2, arm[0][1] - 1.5], [arm[0][0] + 2, arm[0][1] + 3], [top[0] - 6, top[1] + 13]], '#4C7FB5')
        + poly([[top[0] + 7, top[1] + 7], [arm[1][0] - 2, arm[1][1] - 1.5], [arm[1][0] - 2, arm[1][1] + 3], [top[0] + 6, top[1] + 13]], '#4C7FB5')
        + `<rect x="${f2(top[0] - 1)}" y="${f2(top[1] + 14)}" width="4" height="4" fill="#E8566A" transform="rotate(12 ${f2(top[0])} ${f2(top[1] + 16)})"/>`
        + [arm[0], arm[1]].map(([x, y], i) => [-1, 0, 1].map(d => ln([x, y + 1], [x + (i ? 3 : -3), y + 1 + d * 2], STRAW.left, 0.8)).join('')).join('')
        // Tête de jute et chapeau
        + dot(top[0], top[1] + 1, 5, '#E9D3A4') + dot(top[0] - 1.6, top[1], 0.7, '#3D3A36') + dot(top[0] + 1.8, top[1], 0.7, '#3D3A36')
        + `<path d="M${f2(top[0] - 2)},${f2(top[1] + 3)} q2,1.2 4,0" stroke="#3D3A36" stroke-width="0.6" fill="none"/>`
        + ell(top[0], top[1] - 3, 9, 2.4, STRAW.left, ` stroke="${OUT}" stroke-width="0.5"`)
        + poly([[top[0] - 4.5, top[1] - 3], [top[0] - 3, top[1] - 9], [top[0] + 3, top[1] - 9], [top[0] + 4.5, top[1] - 3]], STRAW.top, ` stroke="${OUT}" stroke-width="0.5"`)
        + ln([top[0] - 4.2, top[1] - 4.4], [top[0] + 4.2, top[1] - 4.4], '#C9473A', 1.2)
        // Corbeau posé sur le bras, un temps
        + (f < n / 2 ? bird(arm[1][0] - 3, arm[1][1] - 1, { body: '#2E2A2C', breast: '#3D383A', wing: '#1E1B1C', flip: true }) : '');
    }
  }]
};

// Nichoir : maisonnette sur son piquet, toit rouge, trou rond ; un oiseau entre et sort
const nichoir = {
  layers: [{
    frame: [-24, -62, 48, 78],
    n: 8,
    fps: 2,
    draw: (T, f, n) => {
      const [hx, hy] = T.p(0, 0.08, 34);
      const out = f % n < n / 2;
      return T.shadow(0, 0, 0.16, 0.16)
        + post(T, 0, 0, 0, 28, WOOD_DARK, 0.026)
        + T.box(-0.09, -0.08, 0.09, 0.08, 28, 42, WOOD)
        + ell(hx, hy, 2.6, 2.6, '#3A2A1E')
        + ln([hx, hy + 4.6], [hx, hy + 7.4], WOOD_DARK.right, 1.2)
        + gable(T.u - 0.1, T.v - 0.09, T.u + 0.1, T.v + 0.09, 42, 9, { front: ROOF_RED.front, back: ROOF_RED.back, gable: WOOD.right }, 0.03)
        + (out
          ? `<g>${ell(hx + 1, hy + 6, 2.8, 2.2, '#C98A4A')}${dot(hx + 3.2, hy + 4.2, 1.8, '#C98A4A')}${dot(hx + 3.8, hy + 3.8, 0.4, '#2A2024')}${poly([[hx + 5, hy + 4], [hx + 6.8, hy + 4.6], [hx + 5, hy + 5]], '#F2C04B')}${ell(hx - 0.2, hy + 6.4, 2.2, 1.2, '#A86C38')}</g>`
          : dot(hx, hy, 1, '#C98A4A'));
    }
  }]
};

// Girouette : mât de fer, croix des points cardinaux, coq de cuivre qui tourne avec le vent
const girouette = {
  layers: [{
    frame: [-26, -90, 52, 106],
    n: 8,
    fps: 2,
    draw: (T, f, n) => {
      const [tx, ty] = T.p(0, 0, 60);
      const a = Math.sin((f / n) * TAU) * 0.9 + 0.3;
      const c = Math.cos(a);
      const flip = c < 0 ? -1 : 1;
      const w = Math.max(0.25, Math.abs(c));
      // Coq de profil, aplati selon son cap
      const X = dx => tx + dx * w * flip;
      const rooster = `<path d="M${f2(X(-10))},${f2(ty - 4)} L${f2(X(-6))},${f2(ty - 10)} L${f2(X(-3))},${f2(ty - 5)} Q${f2(X(1))},${f2(ty - 7)} ${f2(X(3))},${f2(ty - 12)} L${f2(X(6))},${f2(ty - 13)} L${f2(X(7))},${f2(ty - 10)} L${f2(X(5))},${f2(ty - 8)} Q${f2(X(6))},${f2(ty - 3)} ${f2(X(1))},${f2(ty - 1.5)} Z" fill="${COPPER.left}" stroke="${COPPER.right}" stroke-width="0.6"/>`
        + dot(X(4.4), ty - 11.4, 0.6, '#3A2A1E') + poly([[X(5), ty - 14], [X(6), ty - 15.6], [X(6.4), ty - 13.4]], '#C9473A');
      const arrow = ln([tx - 13 * c, ty + 3], [tx + 13 * c, ty + 3], COPPER.right, 1.1) + poly([[tx + 13 * c, ty + 1], [tx + 16 * c, ty + 3], [tx + 13 * c, ty + 5]], COPPER.left);
      const card = [[0.16, 0, 'E'], [-0.16, 0, 'O'], [0, 0.16, 'S'], [0, -0.16, 'N']].map(([u, v, l]) => {
        const [x, y] = T.p(u, v, 50);
        return ln(T.p(0, 0, 50), [x, y], DARK_IRON.right, 0.9) + `<text x="${f2(x)}" y="${f2(y + 1.6)}" font-size="4.4" font-family="Georgia,serif" font-weight="700" text-anchor="middle" fill="${DARK_IRON.right}">${l}</text>`;
      }).join('');
      return T.shadow(0, 0, 0.18, 0.16)
        + T.box(-0.1, -0.1, 0.1, 0.1, 0, 5, STONE)
        + T.cyl(0, 0, 5, 62, 0.018, DARK_IRON, 'mat')
        + card + arrow + rooster
        + dot(tx, ty + 3, 1.3, BRASS.top);
    }
  }]
};

export { muret, lanterne, banc, epouvantail, nichoir, girouette };
