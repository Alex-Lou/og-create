// Créations d'île (lot 8) : 18 objets fabriqués à l'établi et posés sur une case (clôture, lanterne, fontaine,
// kiosque…), et 12 créations de climat (lot 9d : igloo, enclos à moutons, totem…). Repère et calques : ceux des
// annexes (annexSprites.js) — case u, v ∈ [-0,5 ; 0,5], ancrage au centre ; un cadre serré par calque, un dessin
// fixe ou n images jouées à fps images/s.
import { gable, pyramid, sprite, EDGE } from './iso';
import { WOOD, WOOD_DARK, STONE, WHITE_STONE, ROOF_RED, BLUE_ROOF, GLASS, SOIL } from './palette';
import { tools, ln, poly, ell, dot, wave, star, bird, IRON, DARK_IRON, COPPER, STRAW, OUT, f2 } from './shopSprites';
import { creationLayer, ART_LIGHTS } from './creations';

const TAU = Math.PI * 2;
const LEAF = '#5FA04A';
const LEAF_LIGHT = '#8FCB6A';
const LEAF_DARK = '#3F7A34';
const WATER = '#5BAFD8';
const WATER_LIGHT = '#9AD6F0';
const FLOWERS = ['#E8566A', '#F2C04B', '#B48AE0', '#FFFFFF', '#F08A3A'];
const BRASS = { top: '#F4D67A', left: '#E2B546', right: '#B88A2E' };
const MOSS = 'rgba(95,160,74,.75)';

/* ---------- Petits outils ---------- */
// Poteau de bois carré, de z0 à z1
const post = (T, du, dv, z0, z1, colors = WOOD_DARK, w = 0.024) => T.box(du - w, dv - w, du + w, dv + w, z0, z1, colors);
// Lisse entre deux points du sol, à la hauteur z
const rail = (T, a, b, z, w = 2.2) => ln(T.p(a[0], a[1], z), T.p(b[0], b[1], z), WOOD_DARK.right, w) + ln(T.p(a[0], a[1], z + 0.6), T.p(b[0], b[1], z + 0.6), WOOD.top, w * 0.45);
// Fleur (en pixels) : tige, corolle de cinq pétales, cœur
function flower(x, y, h, color, sway = 0, r = 1.6) {
  const tx = x + sway, ty = y - h;
  const petals = Array.from({ length: 5 }, (_, k) => {
    const a = (k / 5) * TAU;
    return dot(tx + Math.cos(a) * r * 0.8, ty + Math.sin(a) * r * 0.55, r * 0.62, color);
  }).join('');
  return `<path d="M${f2(x)},${f2(y)} q${f2(sway * 0.2)},${f2(-h * 0.5)} ${f2(sway)},${f2(-h)}" stroke="${LEAF_DARK}" stroke-width="0.8" fill="none"/>` + petals + dot(tx, ty, r * 0.4, '#F7E27A');
}
// Touffe de feuilles (en pixels)
const leaves = (x, y, r) => dot(x + r * 0.2, y + r * 0.2, r, LEAF_DARK) + dot(x, y, r * 0.9, LEAF) + dot(x - r * 0.3, y - r * 0.3, r * 0.4, LEAF_LIGHT);
// Flamme (en pixels) : trois couches, du rouge au blanc ; k : battement (0 à 1)
function flame(x, y, h, w, k) {
  const tip = (s, dx) => `M${f2(x - w * s)},${f2(y)} Q${f2(x - w * s * 1.1)},${f2(y - h * s * 0.55)} ${f2(x + dx)},${f2(y - h * s)} Q${f2(x + w * s * 1.1)},${f2(y - h * s * 0.55)} ${f2(x + w * s)},${f2(y)} Z`;
  const sway = Math.sin(k * TAU) * w * 0.35;
  return `<path d="${tip(1, sway)}" fill="#E8573A"/><path d="${tip(0.72, sway * 0.6)}" fill="#F59A3C"/><path d="${tip(0.42, sway * 0.3)}" fill="#FFE08A"/>`;
}

/* ---------- Premiers pas ---------- */
// Clôture : quatre piquets pointus et deux lisses en travers de la case, une touffe d'herbe au pied
const cloture = {
  layers: [{
    frame: [-34, -36, 68, 52],
    draw: T => {
      const us = [-0.4, -0.14, 0.12, 0.38];
      const v = 0.04;
      let out = T.shadow(0, 0.04, 0.36, 0.14);
      out += rail(T, [-0.42, v], [0.4, v], 6) + rail(T, [-0.42, v], [0.4, v], 12);
      for (const u of us) {
        out += post(T, u, v, 0, 16, WOOD);
        const [x, y] = T.p(u, v, 16);
        out += poly([[x - 2.2, y + 1.2], [x + 2.2, y + 1.2], [x, y - 3.4]], WOOD.top, ` stroke="${OUT}" stroke-width="0.4"`);
      }
      const [gx, gy] = T.p(0.2, 0.3, 0);
      return out + [-2, 0, 2].map(dx => ln([gx + dx, gy], [gx + dx * 1.6, gy - 5], LEAF, 1)).join('');
    }
  }]
};

// Massif de fleurs : bordure de pierres, terre sombre, fleurs de toutes couleurs qui ondulent
const massif = {
  layers: [{
    frame: [-34, -40, 68, 56],
    n: 6,
    fps: 3,
    draw: (T, f, n) => {
      let out = T.shadow(0, 0, 0.4, 0.12) + T.box(-0.38, -0.34, 0.38, 0.34, 0, 4, STONE) + T.face([[-0.34, -0.3, 4.2], [0.34, -0.3, 4.2], [0.34, 0.3, 4.2], [-0.34, 0.3, 4.2]], SOIL.top, EDGE);
      let k = 0;
      for (const dv of [-0.2, 0, 0.2]) {
        for (const du of [-0.22, -0.07, 0.08, 0.23]) {
          const [x, y] = T.p(du + (k % 2) * 0.03, dv, 4.4);
          out += leaves(x, y - 1.5, 2.4) + flower(x, y - 2, 6 + (k % 3), FLOWERS[k % FLOWERS.length], wave(f, n, 1.2, k * 1.3));
          k++;
        }
      }
      return out;
    }
  }]
};

/* ---------- Palier I ---------- */
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

/* ---------- Palier II ---------- */
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

// Cadran solaire : colonne de pierre, table gravée des heures, style de bronze ; l'ombre tourne lentement
const cadran = {
  layers: [{
    frame: [-30, -46, 60, 62],
    n: 8,
    fps: 0.5,
    draw: (T, f, n) => {
      const z = 18;
      const [cx, cy] = T.p(0, 0, z);
      const marks = Array.from({ length: 12 }, (_, k) => {
        const a = (k / 12) * TAU;
        const p = T.p(Math.cos(a) * 0.17, Math.sin(a) * 0.17, z);
        const q = T.p(Math.cos(a) * 0.2, Math.sin(a) * 0.2, z);
        return ln(p, q, '#7A6A55', k % 3 ? 0.5 : 1);
      }).join('');
      const a = -2.2 + (f / n) * 2.6;
      const tip = T.p(Math.cos(a) * 0.16, Math.sin(a) * 0.16, z);
      return T.shadow(0, 0, 0.3, 0.18)
        + T.box(-0.16, -0.16, 0.16, 0.16, 0, 3, STONE)
        + T.cyl(0, 0, 3, 16, 0.08, WHITE_STONE, 'fut')
        + T.cyl(0, 0, 16, z, 0.24, STONE, 'table')
        + T.disc(0, 0, z, 0.21, '#EFE6D2', ` stroke="#BDB29E" stroke-width="0.5"`)
        + marks
        + ln([cx, cy], tip, 'rgba(60,40,25,.35)', 1.6)
        + poly([[cx - 6, cy + 1.5], [cx + 6, cy - 1.5], [cx + 1, cy - 9]], BRASS.left, ` stroke="${BRASS.right}" stroke-width="0.5"`);
    }
  }]
};

// Bassin : margelle de pierre, eau claire, nénuphars et poisson rouge ; des ronds dans l'eau
const bassin = {
  layers: [{
    frame: [-36, -24, 72, 40],
    n: 6,
    fps: 3,
    draw: (T, f, n) => {
      const r = 0.42;
      const [fx, fy] = T.p(Math.cos((f / n) * TAU) * 0.18, Math.sin((f / n) * TAU) * 0.18, 2);
      const a = (f / n) * TAU + Math.PI / 2;
      return T.shadow(0, 0, 0.46, 0.12)
        + T.box(-r, -r, r, r, 0, 4, STONE)
        + T.face([[-r + 0.06, -r + 0.06, 4.1], [r - 0.06, -r + 0.06, 4.1], [r - 0.06, r - 0.06, 4.1], [-r + 0.06, r - 0.06, 4.1]], WATER, EDGE)
        + T.face([[-r + 0.06, -r + 0.06, 4.1], [r - 0.06, -r + 0.06, 4.1], [r - 0.1, -r + 0.12, 4.1], [-r + 0.1, -r + 0.12, 4.1]], 'rgba(40,90,130,.35)')
        + `<ellipse cx="${f2(fx)}" cy="${f2(fy)}" rx="3" ry="1.3" fill="#F08A3A" transform="rotate(${f2((a * 180) / Math.PI * 0.5)} ${f2(fx)} ${f2(fy)})"/>`
        + [[-0.2, 0.12, 3.4], [0.18, -0.16, 2.8], [0.22, 0.2, 2.4]].map(([u, v, s]) => {
          const [x, y] = T.p(u, v, 4.2);
          return ell(x, y, s * 1.4, s * 0.7, LEAF, ` stroke="${LEAF_DARK}" stroke-width="0.4"`) + poly([[x, y], [x + s * 1.3, y - s * 0.3], [x + s * 1.3, y + s * 0.2]], WATER);
        }).join('')
        + dot(...T.p(-0.2, 0.12, 6), 1.5, '#F7A8C0')
        + ell(...T.p(0.04, 0.04, 4.2), 3 + (f % 3) * 2.5, 1.5 + (f % 3) * 1.2, 'none', ` stroke="rgba(255,255,255,${f2(0.7 - (f % 3) * 0.22)})" stroke-width="0.6"`);
    }
  }]
};

// Longue-vue : trépied de bois, lunette de laiton pointée vers le large ; un éclat glisse sur le cuivre
const longuevue = {
  layers: [{
    frame: [-30, -62, 60, 78],
    n: 8,
    fps: 2,
    draw: (T, f, n) => {
      const [hx, hy] = T.p(0, 0, 26);
      const legs = [[-0.2, 0.16], [0.18, 0.12], [0, -0.22]].map(([u, v]) => ln(T.p(u, v, 0), [hx, hy], WOOD_DARK.left, 1.8)).join('');
      // Tube : du bout fin (oculaire, en bas à gauche) au gros bout (objectif, en haut à droite)
      const a = [hx - 13, hy + 5], b = [hx + 15, hy - 10];
      const d = Math.hypot(b[0] - a[0], b[1] - a[1]);
      const nx = -(b[1] - a[1]) / d, ny = (b[0] - a[0]) / d;
      const seg = (s0, s1, r0, r1, fill) => {
        const p = s => [a[0] + (b[0] - a[0]) * s, a[1] + (b[1] - a[1]) * s];
        const [p0, p1] = [p(s0), p(s1)];
        return poly([[p0[0] + nx * r0, p0[1] + ny * r0], [p1[0] + nx * r1, p1[1] + ny * r1], [p1[0] - nx * r1, p1[1] - ny * r1], [p0[0] - nx * r0, p0[1] - ny * r0]], fill, ` stroke="${BRASS.right}" stroke-width="0.5"`);
      };
      const g = f / n;
      const glint = g < 0.6 ? dot(a[0] + (b[0] - a[0]) * (g / 0.6), a[1] + (b[1] - a[1]) * (g / 0.6) - 1.6, 1, 'rgba(255,255,255,.9)') : '';
      return T.shadow(0, 0, 0.24, 0.16)
        + legs
        + seg(0, 0.3, 1.6, 1.9, BRASS.right) + seg(0.3, 0.65, 2.2, 2.6, BRASS.left) + seg(0.65, 1, 2.9, 3.4, BRASS.top)
        + ell(b[0], b[1], 1.6, 3.4, '#5A8FB8', ` stroke="${BRASS.right}" stroke-width="0.6" transform="rotate(${f2((Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI)} ${f2(b[0])} ${f2(b[1])})"`)
        + dot(hx, hy, 1.8, IRON.left)
        + glint;
    }
  }]
};

/* ---------- Créations de climat (lot 9d) ---------- */
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

export const CRAFT_SPRITES = {
  cloture, massif, muret, lanterne, banc, epouvantail, nichoir, girouette,
  fontaine, brasero, pergola, statue, arche, etal, kiosque, cadran, bassin, longuevue,
  igloo, sculpture, parc, cairn, passerelle, heron, tente, cadransel, hamac, totem, obelisque, bassinchaud
};

// Calques d'une création prêts à peindre à l'instant t (secondes) : clé d'image et dessin. Le dessin de la
// bibliothèque d'abord (creations.js), sinon celui-ci
export function craftLayers(id, t = 0) {
  const art = creationLayer(id, t);
  if (art) return [art];
  const craft = CRAFT_SPRITES[id];
  if (!craft) return [];
  return craft.layers.map((layer, k) => {
    const f = layer.n ? Math.floor(t * layer.fps) % layer.n : 0;
    const [x, y, w, h] = layer.frame;
    return {
      key: `craft-${id}-${k}-${f}`,
      make: () => sprite(layer.draw(tools(0, 0, `craft-${id}-${k}`), f, layer.n || 1), { x, y, w, h })
    };
  });
}

// Lumière de nuit d'une création : [u, v, z, rayon, couleur « r,g,b », feu qui brûle même de jour], ou null
export function craftLight(id) {
  const craft = CRAFT_SPRITES[id];
  const light = craft && craft.light ? craft.light() : null;
  // Dessinée par la bibliothèque : sa lumière tombe sur sa flamme (ou sa porte)
  return light && ART_LIGHTS[id] && creationLayer(id) ? [...ART_LIGHTS[id], ...light.slice(3)] : light;
}

// Vignette d'une création (établi) : ses calques à la première image, cadrés au plus juste
export function craftThumb(id) {
  const craft = CRAFT_SPRITES[id];
  if (!craft) return null;
  const frames = craft.layers.map(l => l.frame);
  const x = Math.min(...frames.map(fr => fr[0]));
  const y = Math.min(...frames.map(fr => fr[1]));
  const w = Math.max(...frames.map(fr => fr[0] + fr[2])) - x;
  const h = Math.max(...frames.map(fr => fr[1] + fr[3])) - y;
  const body = craft.layers.map((layer, k) => layer.draw(tools(0, 0, `craft-${id}-${k}-t`), 0, layer.n || 1)).join('');
  return sprite(body, { x, y, w, h });
}
