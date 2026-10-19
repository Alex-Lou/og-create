// Les articles de la boutique de la Carrière, dessinés aux abords du bâtiment (shopSprites.js les réunit ; repère et
// calques : voir son en-tête).
import { WOOD, WOOD_DARK, STONE } from '../palette';
import { IRON, DARK_IRON, CAST, OUT, wave, star, gradient, wheel, stone, f2, ln, poly, ell, dot, xy } from '../spriteKit';

const pioche = {
  layers: [{
    at: [0.16, 0.8],
    frame: [-16, -34, 34, 40],
    draw: T => {
      const [x, y] = T.p(0, 0, 9);
      return T.shadow(0, 0, 0.16, 0.22)
        + T.box(-0.11, -0.09, 0.11, 0.09, 0, 6, STONE) + T.box(-0.07, -0.06, 0.08, 0.06, 6, 9, STONE)
        + T.pebble(0.15, 0.08, 2.2) + T.pebble(-0.14, 0.12, 1.8)
        + ln([x - 1, y - 1], [x - 10, y - 21], WOOD.right, 2.3) + ln([x - 1.4, y - 1], [x - 10.4, y - 21], WOOD.top, 0.7)
        + ln([x - 8.6, y - 18], [x - 10.4, y - 21.6], '#5E3A22', 2.8)
        // Fer courbe : une pointe enfoncée dans la roche, l'autre levée
        + `<path d="M${f2(x - 9)},${f2(y + 1)} Q${f2(x - 2)},${f2(y - 7)} ${f2(x + 7)},${f2(y + 2)}" stroke="${DARK_IRON.left}" stroke-width="3.2" fill="none" stroke-linecap="round"/>`
        + `<path d="M${f2(x - 8.6)},${f2(y)} Q${f2(x - 2)},${f2(y - 7.6)} ${f2(x + 6.4)},${f2(y + 1)}" stroke="${IRON.top}" stroke-width="1" fill="none" stroke-linecap="round"/>`
        + `<rect x="${f2(x - 3.2)}" y="${f2(y - 5.6)}" width="3.6" height="3.4" rx="0.8" fill="${DARK_IRON.right}" transform="rotate(-25 ${f2(x - 1.4)} ${f2(y - 4)})"/>`
        + T.box(0.02, 0, 0.1, 0.06, 6, 9, STONE)
        + `<path d="M${f2(x + 3)},${f2(y + 1.5)} l2,-1.2 l1.2,1.4 Z" fill="${STONE.right}"/>`;
    }
  }]
};
const wagonnet = {
  layers: [{
    at: [0.76, 0.8],
    frame: [-24, -28, 48, 36],
    draw: T => {
      let track = '';
      for (const du of [-0.18, 0, 0.18]) track += T.box(du - 0.025, -0.13, du + 0.025, 0.13, 0, 1.4, WOOD_DARK);
      track += ln(T.p(-0.24, -0.07, 1.4), T.p(0.24, -0.07, 1.4), '#7C8894', 1.2) + ln(T.p(-0.24, 0.07, 1.4), T.p(0.24, 0.07, 1.4), '#7C8894', 1.2);
      const l0 = T.p(-0.13, 0.085, 5);
      const r0 = T.p(0.13, 0.085, 5);
      const l1 = T.p(-0.17, 0.115, 15);
      const r1 = T.p(0.17, 0.115, 15);
      const top = [T.p(-0.17, -0.115, 15), T.p(0.17, -0.115, 15), r1, l1];
      const ore = [[-0.08, -0.02, 2.8, IRON], [0.04, -0.05, 2.6, IRON], [0, 0.04, 3, STONE], [0.09, 0.03, 2.2, IRON], [-0.1, 0.05, 2.2, STONE]]
        .map(([a, b, s, c]) => stone(...T.p(a, b, 16), s, c)).join('');
      const [gx, gy] = T.p(0.02, -0.01, 19);
      return T.shadow(0, 0, 0.2, 0.2) + track
        + wheel(T, -0.1, -0.1, 5, 0.055, 'u', { rim: '#3D3A36', spokes: 4 }) + wheel(T, 0.1, -0.1, 5, 0.055, 'u', { rim: '#3D3A36', spokes: 4 })
        + poly([l0, r0, r1, l1], IRON.left, ` stroke="${OUT}" stroke-width="0.6"`)
        + poly([r0, T.p(0.13, -0.085, 5), T.p(0.17, -0.115, 15), r1], IRON.right, ` stroke="${OUT}" stroke-width="0.6"`)
        + poly(top, '#2E2A26', ` stroke="${IRON.top}" stroke-width="0.9"`)
        + ore + `<path d="M${f2(gx)},${f2(gy - 2)} l1.6,2 l-1.6,2 l-1.6,-2 Z" fill="#F2C04B"/>` + dot(gx - 0.4, gy - 0.6, 0.5, '#FFFFFF')
        + [0.25, 0.5, 0.75].map(k => dot(l1[0] + (r1[0] - l1[0]) * k, l1[1] + (r1[1] - l1[1]) * k + 1.6, 0.55, IRON.right)).join('')
        + wheel(T, -0.1, 0.1, 5, 0.055, 'u', { rim: '#2A2724', spokes: 4 }) + wheel(T, 0.1, 0.1, 5, 0.055, 'u', { rim: '#2A2724', spokes: 4 });
    }
  }]
};
// Lanterne de mine pendue à une potence ; elle se balance doucement et luit la nuit
const LANTERN_AT = [-0.86, 0.5];
const lanterneMine = {
  light: () => [LANTERN_AT[0] + 0.2, LANTERN_AT[1], 24, 22],
  layers: [{
    at: LANTERN_AT,
    frame: [-12, -44, 34, 50],
    draw: T => T.shadow(0, 0, 0.08, 0.2)
      + T.pebble(-0.04, 0.06, 2.4) + T.pebble(0.05, 0.05, 2)
      + T.box(-0.025, -0.025, 0.025, 0.025, 0, 37, WOOD_DARK)
      + T.box(-0.02, -0.018, 0.24, 0.018, 34, 37, WOOD)
      + ln(T.p(0, 0, 25), T.p(0.11, 0, 35), WOOD_DARK.right, 1.4)
      + ln(T.p(0.2, 0, 34), T.p(0.2, 0, 32), '#3D3A36', 1)
  }, {
    at: LANTERN_AT,
    frame: [-2, -40, 24, 26],
    n: 8,
    fps: 5,
    draw: (T, level, f, n) => {
      const [hx, hy] = T.p(0.2, 0, 32);
      return `<g transform="rotate(${f2(wave(f, n, 7))} ${f2(hx)} ${f2(hy)})">`
        + ln([hx, hy], [hx, hy + 3], '#3D3A36', 0.8)
        + `<path d="M${f2(hx - 3.2)},${f2(hy + 5)} L${f2(hx - 1.6)},${f2(hy + 3)} L${f2(hx + 1.6)},${f2(hy + 3)} L${f2(hx + 3.2)},${f2(hy + 5)} Z" fill="#3D3A36"/>`
        + `<rect x="${f2(hx - 3)}" y="${f2(hy + 5)}" width="6" height="7.4" fill="#FFE08A"/>`
        + `<rect x="${f2(hx + 0.4)}" y="${f2(hy + 5)}" width="2.6" height="7.4" fill="#E9BF4E"/>`
        + ell(hx - 0.4, hy + 8.6, 1.3, 1.9, '#FFFDF0')
        + `<path d="M${f2(hx - 3)},${f2(hy + 5)} v7.4 M${f2(hx)},${f2(hy + 5)} v7.4 M${f2(hx + 3)},${f2(hy + 5)} v7.4" stroke="#3D3A36" stroke-width="0.7"/>`
        + `<rect x="${f2(hx - 3.6)}" y="${f2(hy + 12.2)}" width="7.2" height="1.6" rx="0.5" fill="#3D3A36"/></g>`;
    }
  }]
};
// Rails : butoir au bout de la voie de la Mine, et un wagonnet de minerai qui sort de la galerie et y retourne
const rails = {
  layers: [{
    at: [-0.35, 0.88],
    frame: [-18, -16, 36, 26],
    draw: T => {
      let out = '';
      for (const dv of [-0.06, 0.04]) out += T.box(-0.15, dv - 0.02, 0.15, dv + 0.02, 0, 1.5, WOOD_DARK);
      out += ln(T.p(-0.1, -0.08, 1.5), T.p(-0.1, 0.06, 1.5), '#7C8894', 1.2) + ln(T.p(0.1, -0.08, 1.5), T.p(0.1, 0.06, 1.5), '#7C8894', 1.2);
      return out + T.box(-0.14, 0.06, -0.1, 0.1, 0, 9, WOOD_DARK) + T.box(0.1, 0.06, 0.14, 0.1, 0, 9, WOOD_DARK)
        + T.box(-0.15, 0.05, 0.15, 0.09, 6, 10, { top: '#F2EDE2', left: '#E2574C', right: '#B13A31' })
        + [-0.07, 0.03].map(du => T.face([[du, 0.09, 6], [du + 0.04, 0.09, 6], [du + 0.04, 0.09, 10], [du, 0.09, 10]], '#FFFDF8')).join('');
    }
  }, {
    at: [-0.35, 0],
    frame: [-18, -26, 36, 32],
    n: 4,
    fps: 8,
    motion: t => {
      // Cycle de 9 s : attend dans la galerie, sort, attend au bout de la voie, rentre
      const c = (t % 9) / 9;
      const ease = k => k * k * (3 - 2 * k);
      let k = 0;
      if (c >= 0.15 && c < 0.45) k = ease((c - 0.15) / 0.3);
      else if (c >= 0.45 && c < 0.6) k = 1;
      else if (c >= 0.6 && c < 0.9) k = 1 - ease((c - 0.6) / 0.3);
      return [0, 0.06 + k * 0.24, 0];
    },
    draw: (T, level, f, n) => {
      const turn = (f / n) * (Math.PI / 2);
      const top = [T.p(-0.1, -0.13, 13), T.p(0.1, -0.13, 13), T.p(0.1, 0.13, 13), T.p(-0.1, 0.13, 13)];
      const ore = [[-0.03, -0.06, 2.4, IRON], [0.03, 0, 2.6, STONE], [-0.02, 0.06, 2.2, IRON]].map(([a, b, s, c]) => stone(...T.p(a, b, 14), s, c)).join('');
      return T.shadow(0, 0, 0.14, 0.2, 1.5)
        + T.box(-0.075, -0.1, 0.075, 0.1, 4, 6, DARK_IRON)
        + T.face([[-0.075, 0.1, 5], [0.075, 0.1, 5], [0.1, 0.13, 13], [-0.1, 0.13, 13]], IRON.left, ` stroke="${OUT}" stroke-width="0.6"`)
        + T.face([[0.075, -0.1, 5], [0.075, 0.1, 5], [0.1, 0.13, 13], [0.1, -0.13, 13]], IRON.right, ` stroke="${OUT}" stroke-width="0.6"`)
        + poly(top, '#2E2A26', ` stroke="${IRON.top}" stroke-width="0.9"`) + ore
        + wheel(T, 0.09, -0.06, 4, 0.045, 'v', { rim: '#2A2724', spokes: 4, turn }) + wheel(T, 0.09, 0.07, 4, 0.045, 'v', { rim: '#2A2724', spokes: 4, turn });
    }
  }]
};
// Casque de mineur à lampe posé sur sa caisse, gourde et rouleau de corde (palier V)
const casque = {
  layers: [{
    at: [-0.1, 0.94],
    frame: [-20, -32, 40, 38],
    draw: T => {
      const [x, y] = T.p(0, 0, 12);
      const [rx, ry] = T.p(0.17, 0.06, 0);
      const [gx, gy] = T.p(-0.03, 0.15, 4);
      return T.shadow(0, 0, 0.16, 0.2)
        + T.box(-0.09, -0.08, 0.09, 0.08, 0, 12, WOOD)
        + ln(T.p(-0.08, 0.08, 1), T.p(0.08, 0.08, 11), WOOD_DARK.right, 1.1) + ln(T.p(0.09, -0.07, 1), T.p(0.09, 0.07, 11), WOOD_DARK.right, 1.1)
        + [0, 1, 2].map(k => ell(rx, ry - k * 1.4, 4.8 - k * 0.6, 2 - k * 0.2, 'none', ' stroke="#C9A16A" stroke-width="1.3"')).join('')
        + ln([rx + 4, ry - 3], [rx + 7, ry - 1], '#C9A16A', 1.1)
        // Gourde de fer-blanc contre la caisse
        + ell(gx, gy, 2.8, 3.6, CAST.left, ` stroke="${OUT}" stroke-width="0.5"`) + ell(gx - 0.8, gy - 1, 1, 1.6, CAST.top)
        + `<rect x="${f2(gx - 0.8)}" y="${f2(gy - 5.4)}" width="1.6" height="1.8" fill="#8B5631"/>`
        // Casque : bombe jaune, visière, crête, lampe
        + gradient(T.id('hat'), '#FFD866', '#D9952A')
        + ell(x, y + 0.4, 8.6, 2.8, 'rgba(60,40,25,.25)') + ell(x, y - 0.4, 8.2, 2.8, '#D99A2B', ` stroke="${OUT}" stroke-width="0.5"`)
        + `<path d="M${f2(x - 6)},${f2(y - 0.8)} C${f2(x - 6.4)},${f2(y - 10.4)} ${f2(x + 6.4)},${f2(y - 10.4)} ${f2(x + 6)},${f2(y - 0.8)} Z" fill="url(#${T.id('hat')})" stroke="${OUT}" stroke-width="0.6"/>`
        + `<path d="M${f2(x + 0.4)},${f2(y - 7.8)} q0.6,3.6 0.4,7" stroke="#C88A20" stroke-width="1.6" fill="none"/>`
        + `<rect x="${f2(x - 5.8)}" y="${f2(y - 6.6)}" width="3.8" height="3.6" rx="0.8" fill="${DARK_IRON.left}"/>`
        + ell(x - 4.6, y - 4.8, 1.5, 1.5, '#FFF3B8') + dot(x - 5, y - 5.3, 0.5, '#FFFFFF');
    }
  }]
};
// Géode ouverte : coque de pierre et cœur d'améthystes qui scintillent, sa moitié couchée devant ; elle luit la nuit (palier VI)
const GEODE_AT = [-0.92, 0.82];
const AMETHYST = ['#B98CF2', '#9466DA', '#DCC6FF', '#7F52C8'];
function crystals(cx, cy, rx, ry, count, seed) {
  let out = '';
  for (let k = 0; k < count; k++) {
    const a = (k / count) * Math.PI * 2 + seed + ((k * 7) % 3) * 0.08;
    const reach = 0.3 + ((k * 5) % 4) * 0.12;
    const bx = cx + Math.cos(a) * rx;
    const by = cy + Math.sin(a) * ry;
    const px = -Math.sin(a) * (1.1 + (k % 3) * 0.4);
    const py = Math.cos(a) * (0.8 + (k % 2) * 0.3);
    const tx = cx + Math.cos(a) * rx * reach;
    const ty = cy + Math.sin(a) * ry * reach;
    out += poly([[bx - px, by - py], [tx, ty], [bx + px, by + py]], AMETHYST[(k * 3) % 4]) + ln([bx, by], [tx, ty], 'rgba(255,255,255,.25)', 0.4);
  }
  return out;
}
const geode = {
  light: () => [GEODE_AT[0], GEODE_AT[1], 8, 20, '190,140,255'],
  layers: [{
    at: GEODE_AT,
    frame: [-22, -30, 44, 36],
    n: 6,
    fps: 4,
    draw: (T, level, f, n) => {
      const [x, y] = T.p(0, 0, 0);
      const cx = x - 2;
      const cy = y - 10;
      const [hx, hy] = T.p(0.13, 0.1, 0);
      const prism = (px, py, h, w, c) => poly([[px - w, py], [px - w, py - h], [px, py - h - w], [px, py]], c.left) + poly([[px, py], [px, py - h - w], [px + w, py - h], [px + w, py]], c.right);
      const twinkle = [[-4, -4], [3, -2], [-1, 3]].map(([dx, dy], k) => star(cx + dx, cy + dy, 1.8, '#FFFFFF', Math.max(0, wave(f, n, 1, k * 2.1)))).join('');
      return ell(x + 1, y + 0.6, 15, 4.4, 'rgba(40,55,20,.24)')
        + gradient(T.id('shell'), STONE.left, STONE.right)
        + `<path d="M${f2(cx - 12)},${f2(cy + 2)} Q${f2(cx - 13)},${f2(cy - 9)} ${f2(cx - 2)},${f2(cy - 11)} Q${f2(cx + 11)},${f2(cy - 12)} ${f2(cx + 12.4)},${f2(cy)} Q${f2(cx + 12)},${f2(cy + 9)} ${f2(cx)},${f2(cy + 10)} Q${f2(cx - 11)},${f2(cy + 10)} ${f2(cx - 12)},${f2(cy + 2)} Z" fill="url(#${T.id('shell')})" stroke="${OUT}" stroke-width="0.6"/>`
        + `<path d="M${f2(cx - 8.6)},${f2(cy)} Q${f2(cx - 8)},${f2(cy - 7.6)} ${f2(cx + 1)},${f2(cy - 7.2)} Q${f2(cx + 9.6)},${f2(cy - 6.6)} ${f2(cx + 9)},${f2(cy + 0.6)} Q${f2(cx + 8)},${f2(cy + 7)} ${f2(cx)},${f2(cy + 6.8)} Q${f2(cx - 8.4)},${f2(cy + 6)} ${f2(cx - 8.6)},${f2(cy)} Z" fill="#3B2550" stroke="#D9D2C6" stroke-width="1"/>`
        + crystals(cx + 0.6, cy - 0.2, 7.8, 6.2, 16, 0.2)
        + prism(cx - 2.4, cy + 4, 6, 1.6, { left: '#C8A4F7', right: '#8A5CD4' }) + prism(cx + 1, cy + 4.6, 8.4, 2, { left: '#DCC6FF', right: '#9A6AE0' }) + prism(cx + 4, cy + 4, 5, 1.4, { left: '#B98CF2', right: '#7F52C8' })
        + twinkle
        // Moitié couchée au premier plan
        + ell(hx, hy - 1, 7.4, 3.8, STONE.right, ` stroke="${OUT}" stroke-width="0.5"`) + ell(hx, hy - 1.8, 6.6, 3.2, '#E9E2D6') + ell(hx, hy - 1.8, 5.8, 2.7, '#4A2E66')
        + crystals(hx, hy - 1.8, 5.4, 2.4, 12, 0.5);
    }
  }]
};
// Golem de pierre moussu qui garde la Mine : il respire, ses runes et ses yeux s'allument doucement (palier VII)
const GOLEM_AT = [-0.9, 0.08];
const ROCK = { top: '#C2BCB1', left: '#A39D92', right: '#7E7970' };
const golem = {
  light: () => [GOLEM_AT[0], GOLEM_AT[1] + 0.06, 26, 18, '120,230,255'],
  layers: [{
    at: GOLEM_AT,
    frame: [-24, -54, 48, 60],
    n: 8,
    fps: 3,
    draw: (T, level, f, n) => {
      const b = wave(f, n, 0.7);
      const glowing = 0.55 + wave(f, n, 0.45, 1);
      const sw = wave(f, n, 0.014);
      const rune = `rgba(130,235,255,${f2(glowing)})`;
      const moss = (du, dv, z, r) => T.disc(du, dv, z, r, '#6DB64C') + T.disc(du - 0.008, dv - 0.008, z + 0.6, r * 0.6, '#8FCB6A');
      const arm = (u0, u1, s) => T.box(u0, -0.05 + s, u1, 0.05 + s, 9 + b, 25 + b, ROCK) + T.box(u0 - 0.015, -0.065 + s, u1 + 0.015, 0.065 + s, 1 + b, 10 + b, ROCK);
      const shoulder = (du, k) => { const [px, py] = T.p(du, 0, 26 + b); return stone(px, py, 4.6 + k, ROCK); };
      const eye = du => { const [ex, ey] = T.p(du, 0.07, 30 + b); return ell(ex, ey, 1.5, 1, rune) + dot(ex, ey, 0.5, '#F2FFFF'); };
      const ring = Array.from({ length: 16 }, (_, k) => T.p(Math.cos((k / 16) * Math.PI * 2) * 0.06, 0.09, 17 + b + Math.sin((k / 16) * Math.PI * 2) * 4.6));
      return T.shadow(0, 0, 0.28, 0.24)
        + T.pebble(0.26, 0.14, 2.4) + T.pebble(-0.24, 0.18, 1.8)
        + arm(-0.25, -0.155, sw)
        + T.box(-0.11, -0.05, -0.02, 0.05, 0, 9, ROCK) + T.box(0.02, -0.05, 0.11, 0.05, 0, 9, ROCK)
        + T.box(-0.15, -0.09, 0.15, 0.09, 8 + b, 27 + b, ROCK)
        + ln(T.p(-0.12, 0.09, 24 + b), T.p(-0.07, 0.09, 20 + b), 'rgba(60,50,40,.35)', 0.6) + ln(T.p(0.15, -0.05, 12 + b), T.p(0.15, 0.03, 17 + b), 'rgba(60,50,40,.35)', 0.6)
        + `<polygon points="${ring.map(xy).join(' ')}" fill="none" stroke="rgba(130,235,255,${f2(glowing * 0.35)})" stroke-width="2.4"/>`
        + `<polygon points="${ring.map(xy).join(' ')}" fill="none" stroke="${rune}" stroke-width="0.9"/>`
        + ln(T.p(0, 0.09, 12 + b), T.p(0, 0.09, 22 + b), rune, 0.9) + ln(T.p(-0.04, 0.09, 14 + b), T.p(0.04, 0.09, 20 + b), rune, 0.8)
        + shoulder(-0.13, 0)
        + T.box(-0.065, -0.05, 0.065, 0.07, 26 + b, 34 + b, ROCK)
        + eye(-0.032) + eye(0.028)
        + ln(T.p(-0.03, 0.07, 27.4 + b), T.p(0.025, 0.07, 27 + b), 'rgba(60,50,40,.45)', 0.7)
        + shoulder(0.14, 0.4)
        + arm(0.155, 0.25, -sw)
        + moss(-0.03, 0, 34 + b, 0.05) + moss(0.17, 0, 25 + b, 0.035) + moss(-0.11, -0.04, 27 + b, 0.035)
        + dot(...T.p(-0.02, 0.01, 35.4 + b), 0.9, '#F7A8C8');
    }
  }]
};

export default {
  pioche,
  wagonnet,
  'lanterne-mine': lanterneMine,
  rails,
  casque,
  geode,
  golem
};
