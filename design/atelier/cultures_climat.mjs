// Une culture par climat, par étapes (les chantiers des climats) : sur une case, chaque climat a sa culture, son sol et
// son aménagement. Les cimes : des myrtilles sur une terrasse de pierres sèches ; les landes : du sarrasin dans la tourbe,
// la bruyère autour ; le marais : du riz dans sa rizière inondée ; les dunes : des pastèques dans le sable, derrière la
// ganivelle ; la jungle : des ananas dans la terre rouge ; le volcan : des piments dans la cendre noire. Cinq étapes : on
// prépare le terrain, on plante, les pousses sortent, la culture grandit, elle est mûre. Chaque étape tourne en 3 images.
// Géométrie et lumière de world/iso.js, le cadre des cultures ; dessins en pixels du jeu (preview_climats.mjs les agrandit
// × 1,25).
import { P, face, EDGE } from './port/src/world/iso.js';
import { WOOD } from './port/src/world/palette.js';

const OUT = '#3C2819';
const f2 = n => Math.round(n * 100) / 100;
const ln = (a, b, color, w = 1) => `<line x1="${f2(a[0])}" y1="${f2(a[1])}" x2="${f2(b[0])}" y2="${f2(b[1])}" stroke="${color}" stroke-width="${f2(w)}" stroke-linecap="round"/>`;
const ell = (x, y, rx, ry, fill, extra = '') => `<ellipse cx="${f2(x)}" cy="${f2(y)}" rx="${f2(rx)}" ry="${f2(ry)}" fill="${fill}"${extra}/>`;
const dot = (x, y, r, fill) => `<circle cx="${f2(x)}" cy="${f2(y)}" r="${f2(r)}" fill="${fill}"/>`;
const chemin = (d, stroke, w, fill = 'none') => `<path d="${d}" stroke="${stroke}" stroke-width="${f2(w)}" fill="${fill}" stroke-linecap="round" stroke-linejoin="round"/>`;
const bord = (w = 0.35) => ` stroke="${OUT}" stroke-width="${w}"`;
const wave = (f, amp = 1, phase = 0) => Math.sin((f / IMAGES) * Math.PI * 2 + phase) * amp;
const feuille = (x, y, rx, ry, fill, rot = 0) => `<ellipse cx="${f2(x)}" cy="${f2(y)}" rx="${f2(rx)}" ry="${f2(ry)}" fill="${fill}"${bord()}${rot ? ` transform="rotate(${f2(rot)} ${f2(x)} ${f2(y)})"` : ''}/>`;
const fruit = (x, y, r, fill, edge) => `<circle cx="${f2(x)}" cy="${f2(y)}" r="${f2(r)}" fill="${fill}" stroke="${edge}" stroke-width="0.35"/>` + dot(x - r * 0.35, y - r * 0.35, r * 0.3, 'rgba(255,255,255,.55)');

export const CADRE = [-34, -30, 68, 48]; // le cadre des cultures, en pixels du jeu
export const CLIMATS = ['cimes', 'landes', 'marais', 'dunes', 'jungle', 'volcan'];
export const CULTURE = { cimes: 'myrtilles', landes: 'sarrasin', marais: 'riz', dunes: 'pasteques', jungle: 'ananas', volcan: 'piments' };
export const ETAPES = ['preparation', 'plantation', 'pousses', 'croissance', 'mur'];
export const IMAGES = 3;

const carre = (r, fill, extra = EDGE) => face([[-r, -r, 0], [r, -r, 0], [r, r, 0], [-r, r, 0]], fill, extra);
const COLS = [-0.28, -0.093, 0.093, 0.28];
const ROWS = [-0.28, -0.093, 0.093, 0.28];
const places = () => ROWS.flatMap((dv, r) => COLS.map((du, c) => ({ du, dv, k: r * 4 + c }))).sort((a, b) => a.du + a.dv - (b.du + b.dv));
const caillou = (x, y, s, fill = '#A8A49A') => ell(x, y, 1.6 * s, 1 * s, fill, bord(0.4)) + ell(x - 0.4 * s, y - 0.4 * s, 0.7 * s, 0.35 * s, 'rgba(255,255,255,.35)');

/* ---------- les sols et les aménagements ---------- */
const SOLS = {
  // la terrasse des cimes : un muret de pierres sèches devant, une terre caillouteuse
  cimes: {
    sol: () => carre(0.45, '#9AA48A') + carre(0.41, '#7E6A56', '') + [[-0.3, -0.2], [0.1, -0.32], [0.28, 0.05], [-0.12, 0.22], [0.2, 0.3]].map(([u, v]) => { const [x, y] = P(u, v, 0); return caillou(x, y, 0.5); }).join(''),
    devant: () => [-0.38, -0.25, -0.12, 0.01, 0.14, 0.27, 0.4].map((u, i) => { const [x, y] = P(u, 0.45, 0); return caillou(x, y + (i % 2) * 0.6, 1.2, i % 2 ? '#B4B0A6' : '#9C988E'); }).join('')
      + [0.38, 0.25, 0.12, -0.01, -0.14, -0.27].map((v, i) => { const [x, y] = P(0.45, v, 0); return caillou(x, y + (i % 2) * 0.6, 1.1, i % 2 ? '#9C988E' : '#B4B0A6'); }).join(''),
    preparer: f => { const [x, y] = P(-0.1, 0.1, 0); return caillou(x, y, 1.4) + caillou(x + 4, y - 1, 1.1) + ln([x + 7, y + 1], [x + 9 + wave(f, 0.3), y - 9], WOOD.left, 1.3) + ln([x + 5.6, y - 9.6], [x + 10.6, y - 8.2], '#8A8F98', 1.6); }
  },
  // la lande : une tourbe sombre, des touffes de bruyère mauve au bord
  landes: {
    sol: () => carre(0.45, '#8C9A6A') + carre(0.41, '#4E3A2E', ''),
    devant: f => [[-0.42, 0.38], [0.4, 0.42], [0.42, -0.36], [-0.1, 0.44], [0.44, 0.05]].map(([u, v], i) => { const [x, y] = P(u, v, 0); return [-1.4, 0, 1.4].map(o => ln([x + o * 0.4, y], [x + o + wave(f, 0.4, i), y - 3.4], '#6E8A4A', 0.8) + dot(x + o + wave(f, 0.4, i), y - 3.4, 0.7, '#B87AB8')).join(''); }).join(''),
    preparer: f => { const [x, y] = P(-0.2, 0.1, 0); return ell(x, y - 1, 4.6, 2.2, '#6E7A4A', bord(0.4)) + [-2, 0, 2].map(o => dot(x + o, y - 2.6, 0.8, '#B87AB8')).join('') + ln([x + 8, y + 1], [x + 10, y - 8 + wave(f, 0.3)], WOOD.left, 1.3) + ln([x + 8.2, y - 7.6], [x + 12, y - 9], '#8A8F98', 1.4); }
  },
  // la rizière : une diguette de terre, l'eau qui miroite entre les plants
  marais: {
    sol: f => carre(0.45, '#7A9A5A') + carre(0.42, '#8A6A46', '') + carre(0.37, '#6FA8B8', ` stroke="#4E7E8E" stroke-width="0.6"`)
      + [[-0.2, -0.1], [0.15, 0.2], [0.1, -0.25]].map(([u, v], i) => { const [x, y] = P(u, v, 0); return ln([x - 2 + wave(f, 0.6, i), y], [x + 2 + wave(f, 0.6, i), y], 'rgba(255,255,255,.55)', 0.6); }).join(''),
    devant: () => '',
    preparer: () => { const [x, y] = P(0.3, 0.38, 0); return ell(x, y - 1.6, 3, 1.6, '#C8B88A', bord(0.4)) + ln([x - 1, y - 3], [x + 1.2, y - 3.6], '#8A7A4A', 0.5); } // le sac de semence au bord de la diguette
  },
  // les dunes : le sable, la ganivelle (des lattes de châtaignier liées de fil de fer) contre le vent
  dunes: {
    sol: f => carre(0.45, '#E8D49A') + carre(0.41, '#DCC488', '') + [[-0.2, -0.1], [0.2, 0.15]].map(([u, v], i) => { const [x, y] = P(u, v, 0); return chemin(`M${f2(x - 4)},${f2(y)} q2,-1 4,0 q2,1 4,0`, 'rgba(180,150,90,.6)', 0.5); }).join(''),
    devant: () => {
      let out = '';
      for (let i = 0; i < 9; i++) { const u = -0.44 + i * 0.11, [x, y] = P(u, 0.46, 0); out += ln([x, y], [x + 0.2, y - 6.4], OUT, 1.6) + ln([x, y], [x + 0.2, y - 6.4], '#B8946A', 0.8); }
      return out + ln(P(-0.44, 0.46, 2), P(0.44, 0.46, 2), '#6E737C', 0.4) + ln(P(-0.44, 0.46, 5), P(0.44, 0.46, 5), '#6E737C', 0.4);
    },
    preparer: f => { const [x, y] = P(0, -0.1, 0); return [0, 1, 2].map(i => ln([x - 6 + i * 3, y], [x - 6 + i * 3 + 0.2, y - 6], '#B8946A', 0.9)).join('') + ln([x - 7, y - 3], [x + 1, y - 3.4], '#6E737C', 0.4) + dot(x + 6 + wave(f, 1), y - 1, 0.5, 'rgba(220,196,136,.9)'); }
  },
  // la jungle : une terre rouge, de grandes feuilles qui débordent sur le bord
  jungle: {
    sol: () => carre(0.45, '#5E9A4A') + carre(0.41, '#A8583A', ''),
    devant: f => [[-0.44, 0.42, -40], [0.44, -0.4, 40], [0.42, 0.44, 0]].map(([u, v, r], i) => { const [x, y] = P(u, v, 0); return feuille(x, y - 3, 2.4, 5.4, i % 2 ? '#4E8E3A' : '#3E7A2E', r + wave(f, 4, i)) + ln([x, y], [x + Math.sin(r * Math.PI / 180) * 4, y - 6], '#2E5E22', 0.4); }).join(''),
    preparer: () => { const [x, y] = P(-0.15, 0.15, 0); return ell(x, y - 1, 4, 1.8, '#7A4A2E', bord(0.4)) + [[-2, -2], [1, -2.4], [2.6, -1.4]].map(([a, b]) => feuille(x + a, y + b, 1.2, 2.4, '#5E8A3A', a * 20)).join('') + ln([x + 7, y + 1], [x + 9.4, y - 9], WOOD.left, 1.3) + `<path d="M${f2(x + 8.6)},${f2(y - 9)} q3,-1 4,1 q-2,0 -4,-1 Z" fill="#A9AFB8"${bord(0.4)}/>`; } // les tiges coupées, la machette
  },
  // le volcan : la cendre noire, de petites pierres de lave, une fumerolle au loin
  volcan: {
    sol: () => carre(0.45, '#6E6A5E') + carre(0.41, '#3A3438', '') + [[-0.3, -0.25], [0.25, -0.1], [-0.05, 0.3]].map(([u, v]) => { const [x, y] = P(u, v, 0); return caillou(x, y, 0.6, '#5A4A48') + dot(x + 0.3, y - 0.2, 0.25, '#E8703A'); }).join(''),
    devant: f => { const [x, y] = P(0.44, -0.44, 0); return [0, 1, 2].map(i => dot(x - 2 + wave(f, 1, i), y - 4 - i * 2.6 - (f % 3) * 0.6, 1.2 + i * 0.4, `rgba(220,214,206,${f2(0.55 - i * 0.15)})`)).join(''); },
    preparer: () => { const [x, y] = P(-0.1, 0.1, 0); return caillou(x, y, 1.3, '#5A4A48') + caillou(x + 3.6, y - 0.8, 1, '#4A3E3E') + ln([x + 7, y + 1], [x + 9, y - 9], WOOD.left, 1.3) + ln([x + 7.6, y - 9.4], [x + 11, y - 8.4], '#8A8F98', 1.6); }
  }
};

/* ---------- les cultures ---------- */
const PLANTES = {
  // les myrtilles : de petits buissons, des fleurs en clochettes roses, puis les baies bleues
  myrtilles: {
    graine: (x, y) => ln([x, y], [x, y - 1.6], '#7A5A3A', 0.6) + dot(x, y - 1.8, 0.7, '#6FA84A'),
    pousse: (x, y, s) => [-1, 1].map(o => feuille(x + o + s * 0.2, y - 1.4, 0.9, 0.6, '#6FA84A', o * 30)).join(''),
    croissance: (x, y, s, k) => [[-1.4, -1.4], [1.4, -1.6], [0, -2.8]].map(([a, b], i) => feuille(x + a + s * 0.3, y + b, 1.3, 0.9, i % 2 ? '#5E9A3E' : '#4F8A3A', a * 15)).join('') + (k % 2 ? dot(x + 0.8, y - 3.4, 0.55, '#F2B8C8') : ''),
    mur: (x, y, s) => [[-1.4, -1.4], [1.4, -1.6], [0, -2.8]].map(([a, b], i) => feuille(x + a + s * 0.3, y + b, 1.3, 0.9, i % 2 ? '#6E8A3E' : '#5E7A3A', a * 15)).join('')
      + [[-1, -2.2], [1.2, -2.6], [0.2, -3.6], [-1.6, -1]].map(([a, b]) => fruit(x + a + s * 0.3, y + b, 0.65, '#4A5AA8', '#2E3A70')).join('')
  },
  // le sarrasin : des tiges rouges, des feuilles en cœur, des grappes de fleurs blanc rosé, puis les graines brunes
  sarrasin: {
    graine: (x, y) => [-0.8, 0.6].map(o => `<polygon points="${f2(x + o)},${f2(y - 1)} ${f2(x + o + 0.6)},${f2(y)} ${f2(x + o - 0.6)},${f2(y)}" fill="#6E4A2E"/>`).join(''),
    pousse: (x, y, s) => ln([x, y], [x + s * 0.3, y - 2], '#C85A4A', 0.6) + feuille(x - 0.8 + s * 0.3, y - 2.2, 0.9, 0.7, '#7CBF4E', -20) + feuille(x + 0.8 + s * 0.3, y - 2.3, 0.9, 0.7, '#6FA84A', 20),
    croissance: (x, y, s) => ln([x, y], [x + s * 0.4, y - 5.4], '#C85A4A', 0.7) + [[-1, -2.4], [1, -3.6], [-0.8, -4.6]].map(([a, b]) => feuille(x + a + s * 0.4, y + b, 1, 0.8, '#6FA84A', a * 25)).join('')
      + [[-0.4, -6], [0.5, -6.2], [0, -6.8]].map(([a, b]) => dot(x + a + s * 0.4, y + b, 0.55, '#FBEAF0')).join(''),
    mur: (x, y, s) => ln([x, y], [x + s * 0.4, y - 5.4], '#A8402E', 0.7) + [[-1, -2.4], [1, -3.6]].map(([a, b]) => feuille(x + a + s * 0.4, y + b, 1, 0.8, '#8A9A4A', a * 25)).join('')
      + [[-0.5, -5.8], [0.5, -6], [0, -6.8], [-0.2, -6.2]].map(([a, b]) => `<polygon points="${f2(x + a + s * 0.4)},${f2(y + b - 0.6)} ${f2(x + a + s * 0.4 + 0.5)},${f2(y + b + 0.3)} ${f2(x + a + s * 0.4 - 0.5)},${f2(y + b + 0.3)}" fill="#7A5232"/>`).join('')
  },
  // le riz : des touffes repiquées dans l'eau, qui montent, puis s'inclinent sous les épis dorés
  riz: {
    graine: (x, y) => [-0.6, 0.6].map(o => ln([x + o * 0.3, y], [x + o, y - 1.6], '#8FCB6A', 0.6)).join(''),
    pousse: (x, y, s) => [-0.8, 0, 0.8].map(o => ln([x + o * 0.3, y], [x + o + s * 0.3, y - 2.6], '#7CBF4E', 0.6)).join(''),
    croissance: (x, y, s) => [-1.2, -0.4, 0.4, 1.2].map((o, i) => ln([x + o * 0.3, y], [x + o + s * 0.5, y - 5 - (i % 2)], '#5FA04A', 0.7)).join(''),
    mur: (x, y, s) => [-1.2, -0.4, 0.4, 1.2].map((o, i) => { const tx = x + o + s * 0.5, ty = y - 5 - (i % 2); return chemin(`M${f2(x + o * 0.3)},${f2(y)} Q${f2(tx - 0.4)},${f2(ty)} ${f2(tx + 1.4)},${f2(ty + 1.6)}`, '#B8A24A', 0.7) + ell(tx + 1.2, ty + 1.2, 0.5, 1.1, '#E8CC6A', ` stroke="#A8823A" stroke-width="0.3" transform="rotate(30 ${f2(tx + 1.2)} ${f2(ty + 1.2)})"`); }).join('')
  },
  // les pastèques : des graines plates, des tiges qui rampent sur le sable, des fleurs jaunes, puis les grosses pastèques rayées
  pasteques: {
    espace: true,
    graine: (x, y) => ell(x - 0.6, y - 0.2, 0.6, 0.4, '#2E2218') + ell(x + 0.7, y - 0.1, 0.6, 0.4, '#2E2218'),
    pousse: (x, y, s) => ln([x, y], [x + s * 0.3, y - 1.8], '#6FA84A', 0.6) + feuille(x - 1.1 + s * 0.3, y - 2, 1.2, 0.8, '#7CBF4E', -20) + feuille(x + 1.1 + s * 0.3, y - 2.1, 1.2, 0.8, '#6FA84A', 20),
    croissance: (x, y, s) => chemin(`M${f2(x - 4)},${f2(y)} q2,-1.6 4,-0.4 q2,1 4,-0.6`, '#5E9A3E', 0.7) + [[-2.6, -1.2], [0.4, -1.6], [2.8, -1.4]].map(([a, b], i) => feuille(x + a + s * 0.3, y + b, 1.6, 1.1, i % 2 ? '#7CBF4E' : '#5E9A3E', a * 10)).join('') + dot(x + 1.4, y - 2.8, 0.7, '#F7C83A'),
    mur: (x, y, s) => chemin(`M${f2(x - 4)},${f2(y)} q2,-1.6 4,-0.4 q2,1 4,-0.6`, '#5E9A3E', 0.7) + [[-2.8, -1.4], [3, -1.6]].map(([a, b]) => feuille(x + a + s * 0.3, y + b, 1.6, 1.1, '#5E9A3E', a * 10)).join('')
      + ell(x, y - 1.6, 3.4, 2.2, '#3E8A3A', bord(0.45)) + [-1.6, 0, 1.6].map(o => chemin(`M${f2(x + o)},${f2(y - 3.6)} q${f2(o * 0.3)},2 0,4`, '#2A5E26', 0.6)).join('') + ell(x - 1, y - 2.6, 1, 0.5, 'rgba(255,255,255,.3)')
  },
  // les ananas : des rosettes de feuilles en épées, qui s'élargissent ; le fruit rouge orangé monte au milieu, puis doré
  ananas: {
    espace: true,
    graine: (x, y) => [-30, 0, 30].map(r => feuille(x + r / 30, y - 1.4, 0.4, 1.4, '#6E9A5A', r)).join(''),
    pousse: (x, y, s) => [-50, -20, 20, 50].map(r => feuille(x + r / 25 + s * 0.2, y - 1.8, 0.5, 2, '#5E8A4A', r)).join(''),
    croissance: (x, y, s) => [-65, -35, -10, 10, 35, 65].map((r, i) => feuille(x + r / 18 + s * 0.2, y - 2.4, 0.6, 3, i % 2 ? '#5E8A4A' : '#4E7A3E', r)).join('') + ell(x, y - 3.6, 1.1, 1.4, '#C8503A', bord(0.35)),
    mur: (x, y, s) => [-65, -35, 35, 65].map((r, i) => feuille(x + r / 18 + s * 0.2, y - 2.4, 0.6, 3, i % 2 ? '#5E8A4A' : '#4E7A3E', r)).join('')
      + ell(x, y - 4.4, 1.6, 2.2, '#E8A83A', bord(0.4)) + [[-0.6, -4.8], [0.6, -4.2], [0, -3.6], [0, -5.4]].map(([a, b]) => ln([x + a - 0.4, y + b - 0.4], [x + a + 0.4, y + b + 0.4], '#A8702A', 0.35)).join('')
      + [-30, 0, 30].map(r => feuille(x + r / 30, y - 7.4, 0.4, 1.6, '#5E8A4A', r)).join('')
  },
  // les piments : de petits plants, des fleurs blanches, puis les piments verts et rouges qui pendent
  piments: {
    graine: (x, y) => [-0.6, 0.6].map(o => ell(x + o, y - 0.2, 0.5, 0.35, '#F2D88A')).join(''),
    pousse: (x, y, s) => ln([x, y], [x + s * 0.3, y - 2], '#5E9A3E', 0.6) + feuille(x - 0.9 + s * 0.3, y - 2.2, 1, 0.6, '#6FA84A', -25) + feuille(x + 0.9 + s * 0.3, y - 2.3, 1, 0.6, '#5E9A3E', 25),
    croissance: (x, y, s, k) => ln([x, y], [x + s * 0.4, y - 4.6], '#4E8A3A', 0.7) + [[-1.2, -2.2], [1.2, -3], [-1, -4], [1, -4.8]].map(([a, b], i) => feuille(x + a + s * 0.4, y + b, 1.1, 0.6, i % 2 ? '#6FA84A' : '#4E8A3A', a * 25)).join('') + (k % 2 ? dot(x + 0.6, y - 3.6, 0.5, '#FFFFFF') : ''),
    mur: (x, y, s, k) => ln([x, y], [x + s * 0.4, y - 4.6], '#4E8A3A', 0.7) + [[-1.2, -2.2], [1.2, -3], [-1, -4], [1, -4.8]].map(([a, b], i) => feuille(x + a + s * 0.4, y + b, 1.1, 0.6, i % 2 ? '#6FA84A' : '#4E8A3A', a * 25)).join('')
      + [[-0.8, -3.4, '#E2453A'], [0.9, -2.6, k % 3 ? '#E2453A' : '#7FB24A'], [0.2, -4.2, '#F08A3A']].map(([a, b, c]) => chemin(`M${f2(x + a + s * 0.4)},${f2(y + b)} q0.6,1.2 0.1,2.6`, '#8A2A20', 1.5) + chemin(`M${f2(x + a + s * 0.4)},${f2(y + b)} q0.6,1.2 0.1,2.6`, c, 0.8)).join('')
  }
};

/* ---------- les étapes ---------- */
// Une étape de la culture d'un climat, image n (0 à 2)
export function etape(climat, quoi, n) {
  const sol = SOLS[climat];
  if (!sol) throw new Error(`climat inconnu : ${climat} (${CLIMATS.join(', ')})`);
  const k0 = ETAPES.indexOf(quoi);
  if (k0 < 0) throw new Error(`étape inconnue : ${quoi} (${ETAPES.join(', ')})`);
  const f = n % IMAGES, p = PLANTES[CULTURE[climat]];
  let out = sol.sol(f);
  if (quoi === 'preparation') out += sol.preparer(f);
  else for (const { du, dv, k } of places()) {
    if (p.espace && k % 2 && quoi !== 'plantation') continue;
    const [x, y] = P(du, dv, 0), s = wave(f, quoi === 'pousses' ? 0.6 : 1.1, k * 0.9);
    out += quoi === 'plantation' ? p.graine(x, y, k) : quoi === 'pousses' ? p.pousse(x, y, s, k) : p[quoi](x, y, s, k);
  }
  return out + sol.devant(f);
}
