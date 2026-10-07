// Bosquet, paliers III à VII : Clairière du bûcheron, Chênaie, Scierie, Exploitation forestière, Forêt enchantée.
// Places laissées libres pour la boutique : billot à l'avant gauche, chevalet de sciage au coin droit, nichoir sur le
// flanc droit, oiseaux devant lui, charrette à l'avant (× 1.5 dès le palier IV).
import { LEAVES, PINE, FOLIAGE, BUILDING_BOX, roundTree, seasonDots, roofOf, touffe, treeTrunk, backLeaves, treeId } from '../palette.js';
import { sprite, foliage, shadow } from '../iso.js';
import {
  big, bigShadow, P, box, face, gable, f2, ln, dot, ell, OUT, WOOD, WOOD_DARK, STONE, GOLD,
  chimney, boardsLeft, pavedPath
} from './kit.js';

const leavesOf = skin => FOLIAGE[skin] || LEAVES;
const LOG = { top: '#A8743F', left: '#8B5631', right: '#F1D3A1' };
const SHINGLE = { front: '#8E6A4A', back: '#6F5038' };

// Sapin en trois étages festonnés et détourés, ombre à droite, reflet à gauche (s : échelle), neige si givre
function pine(u, v, s, skin) {
  const [x, y] = P(u, v, 0);
  const X = dx => f2(x + dx * s), Y = dy => f2(y + dy * s);
  let out = shadow(u, v, 0.28 * s)
    + `<path d="M${X(-2)},${Y(1)} L${X(-1.6)},${Y(-10)} L${X(1.6)},${Y(-10)} L${X(2)},${Y(1)} Z" fill="${WOOD_DARK.left}" stroke="${OUT}" stroke-width="0.8"/>`;
  [[-6, 17, 20], [-17, 13.6, 19], [-27, 10.4, 18]].forEach(([dy, w, h]) => {
    const top = dy - h;
    let edge = '';
    for (let i = 0; i < 4; i++) { const a = -w + (2 * w * i) / 4, b = -w + (2 * w * (i + 1)) / 4; edge += ` Q${X((a + b) / 2)},${Y(dy + 3)} ${X(b)},${Y(dy)}`; }
    out += `<path d="M${X(-w)},${Y(dy)}${edge} L${X(0)},${Y(top)} Z" fill="${PINE.mid}" stroke="${OUT}" stroke-width="0.9" stroke-linejoin="round"/>`
      + `<path d="M${X(0)},${Y(top)} L${X(w)},${Y(dy)} Q${X(w * 0.75)},${Y(dy + 3)} ${X(w * 0.5)},${Y(dy)} Q${X(w * 0.25)},${Y(dy + 3)} ${X(0.6)},${Y(dy + 0.6)} Z" fill="${PINE.dark}"/>`
      + `<path d="M${X(-1.4)},${Y(top + 3)} L${X(-w * 0.62)},${Y(dy - 1.4)}" stroke="${PINE.light}" stroke-width="${f2(1.4 * s)}" stroke-linecap="round" opacity="0.9"/>`;
    if (skin === 'givre') out += `<path d="M${X(-w * 0.5)},${Y(top + h * 0.5)} L${X(0)},${Y(top)} L${X(w * 0.5)},${Y(top + h * 0.5)} Q${X(0)},${Y(top + h * 0.38)} ${X(-w * 0.5)},${Y(top + h * 0.5)} Z" fill="#FFFFFF" stroke="${OUT}" stroke-width="0.5"/>`;
  });
  return out;
}
// Grand chêne : tronc épais à racines et branches, houppier en quatre touffes détourées (couleurs du skin)
function oak(u, v, s, skin) {
  const colors = leavesOf(skin);
  const [x, y] = P(u, v, 0);
  const id = treeId('ok', u, v, s);
  return shadow(u, v, 0.42 * s) + treeTrunk(x, y, s, 3.4, 18)
    + touffe(id + 'f', x, y, s, [[-9, -50, 10], [8, -52, 11], [19, -40, 9], [-20, -40, 8.5]], backLeaves(colors))
    + touffe(id + 'm', x, y, s, [[0, -40, 10.5], [0, -30, 8, 0]], colors)
    + touffe(id + 'g', x, y, s, [[-14, -33, 10], [-22, -26, 7], [-7, -25, 7, 0]], colors)
    + touffe(id + 'd', x, y, s, [[13, -32, 10], [21, -25, 7], [6, -24, 7, 0]], colors)
    + seasonDots(skin, x - 4 * s, y - 42 * s, 13 * s) + seasonDots(skin, x + 8 * s, y - 30 * s, 10 * s);
}
// Cabane de rondins : murs de rondins couchés, toit de bardeaux, porte, fenêtre, cheminée de pierre
function logCabin(u0, v0, u1, v1, h, roofH, skin) {
  const roof = roofOf(skin, SHINGLE);
  let logs = '';
  for (let z = 2; z < h; z += 4) {
    logs += ln(P(u0, v1, z), P(u1, v1, z), 'rgba(70,40,20,.45)', 0.9) + ln(P(u1, v0, z), P(u1, v1, z), 'rgba(50,30,15,.45)', 0.9);
    const [ex, ey] = P(u1, v1, z);
    logs += dot(ex + 0.6, ey - 1.6, 1.8, LOG.right);
  }
  return box(u0, v0, u1, v1, 0, h, { top: LOG.top, left: '#9C6A3E', right: '#7E5230' }) + logs
    + face([[u0 + (u1 - u0) * 0.35, v1, 0], [u0 + (u1 - u0) * 0.6, v1, 0], [u0 + (u1 - u0) * 0.6, v1, h * 0.75], [u0 + (u1 - u0) * 0.35, v1, h * 0.75]], '#4A2E1A')
    + face([[u1, v0 + (v1 - v0) * 0.3, h * 0.35], [u1, v0 + (v1 - v0) * 0.62, h * 0.35], [u1, v0 + (v1 - v0) * 0.62, h * 0.75], [u1, v0 + (v1 - v0) * 0.3, h * 0.75]], '#FFE6A3', ' stroke="#7E5230" stroke-width="1"')
    + chimney(u0 + 0.08, v0 + 0.08, h, h + roofH + 6, 0.06, STONE)
    + gable(u0, v0, u1, v1, h, roofH, { front: roof.front, back: roof.back, gable: '#7E5230' }, 0.07);
}
// Pile de bûches couchées le long de v (bouts coupés visibles côté +u)
function logPile(u, v, n = 3, s = 1) {
  let out = '';
  for (let row = 0; row < n; row++) {
    for (let k = 0; k < n - row; k++) {
      const dv = (k - (n - row - 1) / 2) * 0.075 * s;
      out += box(u - 0.16 * s, v + dv - 0.035 * s, u + 0.16 * s, v + dv + 0.035 * s, row * 4.6 * s, row * 4.6 * s + 4.6 * s, LOG)
        + ell(...P(u + 0.16 * s, v + dv, row * 4.6 * s + 2.3 * s), 1.2 * s, 1.7 * s, 'none', ' stroke="#C9935E" stroke-width="0.5"');
    }
  }
  return out;
}
// Piles de planches sciées
function plankStack(u, v, layers = 5) {
  let out = '';
  for (let k = 0; k < layers; k++) out += box(u - 0.2, v - 0.1, u + 0.2, v + 0.1, k * 2.2, k * 2.2 + 2, k % 2 ? { top: '#F1D3A1', left: '#D9B07A', right: '#B98552' } : { top: '#E9C58F', left: '#CFA06A', right: '#AD7C48' });
  return out;
}

/* ---------- Palier III : Clairière du bûcheron ---------- */
function clearing(skin) {
  const colors = leavesOf(skin);
  const tree = (u, v, sc) => { const [x, y] = P(u, v, 0); return roundTree(u, v, sc, colors) + seasonDots(skin, x, y - 34 * sc, 12 * sc); };
  return sprite(
    tree(-0.55, -0.55, 1.15) + tree(0.5, -0.6, 1.0) + pine(-0.6, 0.3, 1, skin)
    + logCabin(-0.12, -0.28, 0.42, 0.22, 20, 16, skin)
    + logPile(-0.12, 0.48, 3, 0.9)
    + ell(...P(0.22, 0.42, 0), 7, 3, '#E9C88F'),
    BUILDING_BOX
  );
}

/* ---------- Palier IV : Chênaie ---------- */
function oakwood(skin) {
  return big(
    bigShadow(84, 40)
    + oak(-0.95, -1.0, 1.55, skin) + oak(0.1, -1.1, 1.7, skin) + oak(0.95, -0.75, 1.4, skin)
    + pine(-1.15, 0.2, 1.4, skin)
    + logCabin(-0.35, -0.2, 0.45, 0.45, 24, 20, skin)
    + logPile(-0.55, 0.75, 4, 1.1)
    + pavedPath([0.05, 0.5], [0.15, 1.45], 0.2)
  );
}

/* ---------- Palier V : Scierie ---------- */
// Hangar ouvert sur poteaux, banc de sciage et grande lame ronde (animée), planches, grumes, arbres derrière
const SAW_AT = [0.0, 0.15, 13];
function sawmill(skin) {
  const roof = roofOf(skin, SHINGLE);
  const posts = [[-0.7, -0.45], [0.55, -0.45], [-0.7, 0.45], [0.55, 0.45]].map(([u, v]) => box(u - 0.035, v - 0.035, u + 0.035, v + 0.035, 0, 34, WOOD_DARK)).join('');
  return big(
    bigShadow(86, 40)
    + oak(-1.0, -1.1, 1.45, skin) + oak(0.35, -1.2, 1.55, skin) + pine(1.1, -0.95, 1.3, skin)
    + box(-0.75, -0.5, 0.6, -0.42, 0, 30, { top: '#C99359', left: '#B07A44', right: '#8E5E30' }) + boardsLeft(-0.75, 0.6, -0.42, 0, 30, 0.09)
    + posts
    // Banc de sciage : bâti, grume sur le chariot
    + box(-0.6, 0.05, 0.45, 0.25, 0, 10, WOOD) + box(-0.55, 0.08, 0.05, 0.22, 10, 17, LOG)
    + ell(...P(0.05, 0.15, 13.5), 2.6, 3.6, LOG.right, ' stroke="#C9935E" stroke-width="0.6"')
    + gable(-0.75, -0.5, 0.6, 0.5, 34, 16, { front: roof.front, back: roof.back, gable: '#8E5E30' }, 0.08)
    + plankStack(0.95, 0.3, 6) + plankStack(0.95, 0.75, 4)
    + logPile(-1.05, 0.55, 4, 1.15)
    + ell(...P(0.25, 0.5, 0), 12, 4, '#EBCB93') + [[-6, 1], [4, 2], [8, -1]].map(([dx, dy]) => dot(P(0.25, 0.5, 0)[0] + dx, P(0.25, 0.5, 0)[1] + dy, 0.8, '#C9A16A')).join('')
  );
}
// Lame ronde qui tourne (6 images), dans le plan (u, z)
const sawBlade = f => sprite((() => {
  const [x, y] = P(...SAW_AT);
  const r = 9;
  let teeth = '';
  for (let k = 0; k < 16; k++) {
    const a = (k / 16) * Math.PI * 2 + (f / 6) * (Math.PI / 8);
    const ca = Math.cos(a);
    const sa = Math.sin(a);
    // Cercle vertical dans le plan (u, z) : en projection, x suit u (×0.894), y mêle u (×0.447) et z
    teeth += `${k ? 'L' : 'M'}${f2(x + ca * r * 0.894)},${f2(y + ca * r * 0.447 - sa * r)} `;
    const a2 = a + Math.PI / 16;
    teeth += `L${f2(x + Math.cos(a2) * (r + 1.8) * 0.894)},${f2(y + Math.cos(a2) * (r + 1.8) * 0.447 - Math.sin(a2) * (r + 1.8))} `;
  }
  return `<path d="${teeth}Z" fill="#C7CFD8" stroke="#68737E" stroke-width="0.7"/>`
    + `<ellipse cx="${f2(x)}" cy="${f2(y)}" rx="2.2" ry="2.4" fill="#68737E"/>`
    + ln([x + Math.cos(f) * 5 * 0.894, y + Math.cos(f) * 5 * 0.447 - Math.sin(f) * 5], [x - Math.cos(f) * 5 * 0.894, y - Math.cos(f) * 5 * 0.447 + Math.sin(f) * 5], 'rgba(255,255,255,.7)', 0.8);
})(), { x: -30, y: -50, w: 50, h: 46 });

/* ---------- Palier VI : Exploitation forestière ---------- */
// La scierie, plus une grue de bois qui soulève une grume (elle se balance) et de hautes piles de grumes
const CRANE = { u: 0.95, v: -0.2 };
function forestry(skin) {
  const base = sawmill(skin).svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
  const [tx, ty] = P(CRANE.u, CRANE.v, 74);
  return big(
    base
    + box(CRANE.u - 0.12, CRANE.v - 0.12, CRANE.u + 0.12, CRANE.v + 0.12, 0, 6, STONE)
    // Mât en treillis : deux montants, entretoises en croix sur la face visible
    + box(CRANE.u - 0.06, CRANE.v - 0.06, CRANE.u + 0.06, CRANE.v + 0.06, 6, 74, { top: WOOD.top, left: 'rgba(0,0,0,0)', right: 'rgba(0,0,0,0)' }, '')
    + [[-0.06, 0.06], [0.06, 0.06], [0.06, -0.06]].map(([du, dv]) => ln(P(CRANE.u + du, CRANE.v + dv, 6), P(CRANE.u + du, CRANE.v + dv, 74), WOOD_DARK.right, 2.2)).join('')
    + [6, 23, 40, 57].map(z => ln(P(CRANE.u - 0.06, CRANE.v + 0.06, z), P(CRANE.u + 0.06, CRANE.v + 0.06, z + 17), WOOD_DARK.left, 1) + ln(P(CRANE.u + 0.06, CRANE.v + 0.06, z), P(CRANE.u - 0.06, CRANE.v + 0.06, z + 17), WOOD_DARK.left, 1)
      + ln(P(CRANE.u + 0.06, CRANE.v + 0.06, z), P(CRANE.u + 0.06, CRANE.v - 0.06, z + 17), WOOD_DARK.right, 0.9)).join('')
    + box(CRANE.u - 0.09, CRANE.v - 0.09, CRANE.u + 0.09, CRANE.v + 0.09, 72, 77, WOOD)
    // Flèche de la grue vers l'avant gauche, contrepoids
    + ln([tx, ty - 3], P(-0.1, 0.55, 70), WOOD.right, 3) + ln([tx, ty + 4], P(-0.1, 0.55, 70), WOOD_DARK.right, 1.2) + ln([tx, ty - 3], P(1.25, -0.5, 66), WOOD.right, 2.6)
    + ln([tx, ty - 14], P(-0.1, 0.55, 71), '#3D3A36', 0.6) + ln([tx, ty - 14], P(1.25, -0.5, 67), '#3D3A36', 0.6) + ln([tx, ty - 3], [tx, ty - 14], WOOD_DARK.right, 1.6)
    + box(1.18, -0.56, 1.32, -0.44, 58, 66, STONE)
    + logPile(-1.05, 1.05, 3, 1.2) + logPile(1.15, 0.95, 3, 1.0)
  );
}
const swingingLog = f => sprite((() => {
  const [hx, hy] = P(-0.1, 0.55, 70);
  const a = [-6, -2, 2, 6, 2, -2][f];
  return `<g transform="rotate(${a} ${f2(hx)} ${f2(hy)})">`
    + ln([hx, hy], [hx, hy + 30], '#3D3A36', 0.8) + ln([hx, hy + 30], [hx - 10, hy + 36], '#3D3A36', 0.7) + ln([hx, hy + 30], [hx + 10, hy + 32], '#3D3A36', 0.7)
    + `<path d="M${f2(hx - 16)},${f2(hy + 38)} L${f2(hx + 14)},${f2(hy + 32)} L${f2(hx + 15)},${f2(hy + 38)} L${f2(hx - 15)},${f2(hy + 44)} Z" fill="${LOG.left}" stroke="#3C2819" stroke-width="0.6"/>`
    + `<ellipse cx="${f2(hx + 14.5)}" cy="${f2(hy + 35)}" rx="2.2" ry="3.2" fill="${LOG.right}" stroke="#C9935E" stroke-width="0.5"/></g>`;
})(), { x: -50, y: -100, w: 70, h: 70 });

/* ---------- Palier VII : Forêt enchantée ---------- */
// Arbre-monde creusé d'une maison (porte ronde, fenêtres qui luisent), champignons géants, feuillage du skin ou bleu-mauve
const MAGIC = { light: '#D6C6FF', mid: '#A98ADB', dark: '#6E57A8' };
function enchanted(skin) {
  const colors = FOLIAGE[skin] || MAGIC;
  const [x, y] = P(0.05, -0.25, 0);
  const trunkW = 26;
  const blobs = [[-34, -70, 22], [34, -72, 22], [0, -66, 24], [-22, -98, 22], [22, -100, 23], [0, -122, 20], [-44, -92, 15], [46, -94, 15]];
  const mush = (u, v, s, cap) => {
    const [mx, my] = P(u, v, 0);
    return `<rect x="${f2(mx - 2.4 * s)}" y="${f2(my - 9 * s)}" width="${f2(4.8 * s)}" height="${f2(9 * s)}" rx="${f2(1.6 * s)}" fill="#FFF4E6"/>`
      + `<path d="M${f2(mx - 9 * s)},${f2(my - 8 * s)} Q${f2(mx)},${f2(my - 20 * s)} ${f2(mx + 9 * s)},${f2(my - 8 * s)} Z" fill="${cap}"/>`
      + [[-4, -11], [2, -14], [5, -10]].map(([dx, dy]) => dot(mx + dx * s, my + dy * s, 1.2 * s, '#FFFFFF')).join('');
  };
  return big(
    bigShadow(90, 42)
    + pine(-1.15, -1.0, 1.5, skin) + oak(1.05, -1.0, 1.4, skin)
    // Racines et tronc évasé
    + `<path d="M${f2(x - trunkW - 18)},${f2(y + 6)} Q${f2(x - trunkW)},${f2(y - 4)} ${f2(x - trunkW * 0.7)},${f2(y - 30)} L${f2(x - trunkW * 0.55)},${f2(y - 62)} L${f2(x + trunkW * 0.55)},${f2(y - 62)} L${f2(x + trunkW * 0.7)},${f2(y - 30)} Q${f2(x + trunkW)},${f2(y - 4)} ${f2(x + trunkW + 18)},${f2(y + 8)} Z" fill="#8B5631" stroke="${OUT}" stroke-width="0.8"/>`
    + `<path d="M${f2(x + 2)},${f2(y)} L${f2(x + trunkW * 0.55)},${f2(y - 62)} L${f2(x + trunkW * 0.7)},${f2(y - 30)} Q${f2(x + trunkW)},${f2(y - 4)} ${f2(x + trunkW + 18)},${f2(y + 8)} Z" fill="#6A3F22"/>`
    + [-10, -2, 7].map(dx => `<path d="M${f2(x + dx)},${f2(y - 4)} q${dx > 0 ? 3 : -3},-20 ${dx > 0 ? -2 : 2},-50" stroke="rgba(40,20,10,.35)" stroke-width="1" fill="none"/>`).join('')
    // Porte ronde, fenêtres
    + `<path d="M${f2(x - 8)},${f2(y - 2)} L${f2(x - 8)},${f2(y - 14)} A8,8 0 0 1 ${f2(x + 8)},${f2(y - 14)} L${f2(x + 8)},${f2(y - 2)} Z" fill="#3A2A1E" stroke="#C9A16A" stroke-width="1.2"/>` + dot(x + 4, y - 9, 1, GOLD.left)
    + dot(x - 12, y - 38, 4, '#FFE6A3') + dot(x + 11, y - 46, 4, '#FFE6A3')
    + blobs.map(([dx, dy, r]) => foliage(x + dx, y + dy, r, colors)).join('')
    + mush(-0.8, 0.6, 1.3, '#E2574C') + mush(-0.45, 0.95, 0.9, '#E2574C') + mush(0.75, 0.55, 1.1, '#A98ADB') + mush(1.1, 0.25, 0.8, '#E2574C')
    + `<path d="M${f2(x - 30)},${f2(y - 70)} q15,8 30,0 q15,-8 30,2" stroke="#FFE08A" stroke-width="0.6" fill="none"/>`
    + [[-24, -66], [-12, -63], [0, -64], [14, -66], [28, -68]].map(([dx, dy]) => dot(x + dx, y + dy, 1.6, '#FFF2B0')).join('')
  );
}
// Poussière de fée qui monte en spirale (6 images)
const fairyDust = f => sprite((() => {
  const [x, y] = P(0.05, -0.25, 0);
  let out = '';
  for (let k = 0; k < 10; k++) {
    const t = ((f / 6) + k / 10) % 1;
    const a = t * Math.PI * 4 + k;
    out += dot(x + Math.cos(a) * (30 + k * 2) * (1 - t * 0.3), y - 20 - t * 110, 1.4 * (1 - t) + 0.4, k % 3 ? '#FFF2B0' : '#D6C6FF');
  }
  return out;
})(), { x: -80, y: -170, w: 160, h: 170 });

export const BOSQUET_TIERS = [
  { make: clearing, sway: 0.015, smoke: [[-0.04, -0.2, 44]], lights: [[0.42, -0.04, 12, 12]] },
  { make: oakwood, sway: 0.012, smoke: [[-0.27, -0.12, 52]], lights: [[0.45, 0.12, 14, 13]] },
  { make: sawmill, anims: [{ key: 'saw', n: 6, fps: 12, frame: sawBlade }] },
  { make: forestry, anims: [{ key: 'saw', n: 6, fps: 12, frame: sawBlade }, { key: 'log', n: 6, fps: 3, frame: swingingLog, tint: true }] },
  { make: enchanted, lights: [[0.05, -0.25, 12, 22], [-0.07, -0.25, 40, 14], [0.17, -0.25, 48, 14], [-0.8, 0.6, 10, 14], [0.75, 0.55, 10, 14]], anims: [{ key: 'dust', n: 6, fps: 5, frame: fairyDust }] }
];
