// Les murs raccordés de l'île (choix de l'auteur, 15 oct. : « une solidification aux angles, pas de trous visuels »).
// Une clôture ou un muret se dessine case par case : un poteau (ou un pilier) au centre, et une demi-travée vers chaque
// voisin (wallMask) ; deux cases voisines se rejoignent au bord qu'elles partagent, en ligne, en angle, en T ou en
// croix. La porte d'enclos : ses deux poteaux au bord de sa case, où les travées des voisins viennent les toucher, et
// son battant qui pivote sur ses gonds (open). Dessin par code, en attendant les pièces de la bibliothèque. Repère :
// celui des créations (u, v en cases, z en pixels ; ancrage au centre de la case : world/iso.js).
import { P, box, face, sprite } from './iso';
import { WOOD_DARK, STONE, WHITE_STONE } from './palette';
import { ln, poly, ell, dot, IRON, DARK_IRON } from './shopSprites';

// Ce qui se raccorde ainsi (serveur : crafts.WALL_CRAFTS)
export const WALL_LOOKS = new Set(['cloture', 'muret', 'porte']);
// Les directions d'une demi-travée, et leur bit dans le masque : les quatre côtés, puis les quatre diagonales
export const ARMS = [[1, 0], [0, 1], [-1, 0], [0, -1], [1, 1], [-1, 1], [-1, -1], [1, -1]];
const SIDES = 4;
// Une pièce seule, sans voisin : droite, le long de u (ou de v, pivotée)
export const ALONE_U = (1 << 0) | (1 << 2);
export const ALONE_V = (1 << 1) | (1 << 3);

// Les demi-travées d'une case de mur (x, y) : wall(x, y), un mur posé (clôture, muret, porte) ; anchor(x, y), ce qui
// ferme aussi un enclos (un bâtiment, le camp, l'épave). Un côté : vers un mur voisin ; vers un bâtiment, seulement si
// la ligne y entre (le mur d'en face continue, ou la case n'a qu'un voisin) : une clôture qui longe un bâtiment ne s'y
// accroche pas à chaque case. Une diagonale : vers un mur voisin en biais, quand rien ne les relie déjà par un côté.
// Le masque (bits de ARMS), 0 pour une pièce seule
export function wallMask(x, y, wall, anchor) {
  const near = ARMS.slice(0, SIDES).filter(([dx, dy]) => wall(x + dx, y + dy)).length;
  let mask = 0;
  ARMS.forEach(([dx, dy], i) => {
    const to = i < SIDES
      ? wall(x + dx, y + dy) || (anchor(x + dx, y + dy) && (near <= 1 || wall(x - dx, y - dy)))
      : wall(x + dx, y + dy) && !wall(x + dx, y) && !wall(x, y + dy) && !anchor(x + dx, y) && !anchor(x, y + dy);
    if (to) mask |= 1 << i;
  });
  return mask;
}

// Le bois de la clôture (celui de la bibliothèque : creations/cloture.svg) et son trait
const PLANK = { top: '#EFC992', left: '#D49D60', right: '#A86F3E' };
const INK = '#3C2819';
const LINE = ` stroke="${INK}" stroke-width="0.6" stroke-linejoin="round"`;
const MASON = ' stroke="rgba(60,40,25,.35)" stroke-width="0.6" stroke-linejoin="round"';
const JOINT = 'rgba(120,110,95,.45)';
const MOSS = 'rgba(95,160,74,.75)';
const SHADOW = 'rgba(40,55,20,.16)';
// Cadres : une case et sa hauteur ; la porte, son battant ouvert dépasse sur les cases devant et derrière
const FRAME = { x: -37, y: -44, w: 74, h: 64 };
const GATE_FRAME = { x: -48, y: -50, w: 96, h: 76 };

// (les éléments d'une case, rangés du plus loin au plus proche : depth, u + v)
const ordered = parts => parts.sort((a, b) => a.depth - b.depth).map(p => p.body).join('');
const armsOf = mask => ARMS.filter((_, i) => mask & (1 << i));
// L'ombre douce d'une demi-travée au sol
const armShadow = (du, dv, w) => ln(P(0, 0), P(du * 0.48, dv * 0.48), SHADOW, w);

// Un piquet pointu de la clôture, en (u, v)
function picket(u, v) {
  const w = 0.026;
  const [x, y] = P(u, v, 21);
  return box(u - w, v - w, u + w, v + w, 0, 21, PLANK, LINE)
    + poly([[x - 2.3, y + 0.9], [x + 2.3, y + 0.9], [x, y - 3.6]], PLANK.top, LINE)
    + dot(...P(u, v + w, 7.6), 0.5, '#5E4430') + dot(...P(u, v + w, 15.6), 0.5, '#5E4430');
}
// Une lisse de a à b (points du sol), à la hauteur z : un trait sombre, le bois, un reflet sur le dessus
function plankRail(a, b, z) {
  const p = (c, dz) => P(c[0], c[1], z + dz);
  return ln(p(a, 0), p(b, 0), INK, 3.6) + ln(p(a, 0), p(b, 0), PLANK.left, 2.6) + ln(p(a, 1), p(b, 1), PLANK.top, 0.9);
}

// Clôture : le poteau du centre, coiffé, et pour chaque demi-travée un piquet à mi-chemin et deux lisses jusqu'au bord
function fence(mask) {
  let shadow = ell(...P(0.04, 0.02), 5, 2.6, SHADOW);
  const parts = [];
  for (const [du, dv] of armsOf(mask)) {
    shadow += armShadow(du, dv, 4);
    const edge = [du * 0.5, dv * 0.5];
    parts.push({ depth: du + dv, body: picket(du * 0.25, dv * 0.25) + plankRail([0, 0], edge, 6.5) + plankRail([0, 0], edge, 14.5) });
  }
  const w = 0.04;
  const [cx, cy] = P(0, 0, 25);
  parts.push({
    depth: 0.5,
    body: box(-w, -w, w, w, 0, 25, WOOD_DARK, LINE) + box(-w - 0.012, -w - 0.012, w + 0.012, w + 0.012, 25, 27, PLANK, LINE)
      + dot(cx, cy - 2.2, 0.8, PLANK.top)
  });
  return shadow + ordered(parts);
}

// Muret : le pilier du centre, chaperonné, et pour chaque demi-travée un pan de moellons jusqu'au bord (une diagonale :
// un pan mince)
function muret(mask) {
  let shadow = ell(...P(0.04, 0.02), 7, 3.6, SHADOW);
  const parts = [];
  const t = 0.1;
  for (const [du, dv] of armsOf(mask)) {
    shadow += armShadow(du, dv, 7);
    if (du && dv) {
      const e = [du * 0.5, dv * 0.5];
      const body = face([[0, 0, 0], [e[0], e[1], 0], [e[0], e[1], 12], [0, 0, 12]], STONE.left, MASON)
        + ln(P(0, 0, 13), P(e[0], e[1], 13), INK, 5.4) + ln(P(0, 0, 13), P(e[0], e[1], 13), WHITE_STONE.left, 4.4)
        + ln(P(0, 0, 13.6), P(e[0], e[1], 13.6), WHITE_STONE.top, 1.6);
      parts.push({ depth: du + dv, body });
      continue;
    }
    // (le pan, de l'axe du pilier au bord de la case)
    const [u0, u1] = du ? (du > 0 ? [0, 0.5] : [-0.5, 0]) : [-t, t];
    const [v0, v1] = dv ? (dv > 0 ? [0, 0.5] : [-0.5, 0]) : [-t, t];
    let body = box(u0, v0, u1, v1, 0, 12, STONE, MASON) + box(du ? u0 : u0 - 0.02, dv ? v0 : v0 - 0.02, du ? u1 : u1 + 0.02, dv ? v1 : v1 + 0.02, 12, 14, WHITE_STONE, MASON);
    // (les joints sur la face qu'on voit : côté +v pour un pan le long de u, côté +u pour un pan le long de v)
    const at = (k, z) => (du ? P(u0 + (u1 - u0) * k, v1, z) : P(u1, v0 + (v1 - v0) * k, z));
    for (const z of [4, 8]) body += ln(at(0, z), at(1, z), JOINT, 0.6);
    for (const [k, z0, z1] of [[0.35, 0, 4], [0.8, 0, 4], [0.6, 4, 8], [0.2, 8, 12], [0.7, 8, 12]]) body += ln(at(k, z0), at(k, z1), JOINT, 0.6);
    parts.push({ depth: du + dv, body });
  }
  const p = 0.13;
  parts.push({
    depth: 0.5,
    body: box(-p, -p, p, p, 0, 13, STONE, MASON) + box(-p - 0.02, -p - 0.02, p + 0.02, p + 0.02, 13, 16, WHITE_STONE, MASON)
      + ell(...P(0.02, 0.02, 16), 3.2, 1.2, MOSS)
  });
  return shadow + ordered(parts);
}

// Porte d'enclos, le long de u : deux poteaux au bord de la case (à ±HALF), et un battant de planches tenu par deux
// lisses et une écharpe, accroché au poteau de gauche ; verrouillée, un cadenas de fer sur le battant. Le battant se
// dessine à chaque image (drawGateLeaf : il pivote sans à-coups), les poteaux sont une image (wallLayer)
const HALF = 0.46;
const SWING = 1.45;
function gatePosts() {
  let posts = ell(...P(0.04, 0.02), 14, 4, SHADOW);
  for (const u of [-HALF, HALF]) {
    const w = 0.036;
    const [x, y] = P(u, 0, 23);
    posts += box(u - w, -w, u + w, w, 0, 23, WOOD_DARK, LINE) + ell(x, y, 2.8, 1.4, PLANK.top, LINE);
  }
  return posts;
}
// Les traits du battant (en pixels du repère) : open (-1 à 1) : ouvert vers −v ou +v (1 : presque à angle droit).
// [{ line: [a, b], color, w } | { poly: points, fill } | { shackle: [x, y] }]
export function leafStrokes(locked, open) {
  const hingeU = -HALF + 0.03;
  const length = 2 * HALF - 0.06;
  const a = open * SWING;
  const at = (k, z) => P(hingeU + k * length * Math.cos(a), k * length * Math.sin(a), z);
  const out = [];
  for (const k of [0.1, 0.28, 0.46, 0.64, 0.82]) {
    const [x, y] = at(k, 16.5);
    out.push({ line: [at(k, 1.5), at(k, 16)], color: INK, w: 4.4 }, { line: [at(k, 1.5), at(k, 16)], color: PLANK.left, w: 3.4 });
    out.push({ poly: [[x - 1.9, y + 0.6], [x + 1.9, y + 0.6], [x, y - 2.6]], fill: PLANK.top });
  }
  for (const z of [4, 12.5]) out.push({ line: [at(0.03, z), at(0.97, z)], color: INK, w: 3.4 }, { line: [at(0.03, z), at(0.97, z)], color: WOOD_DARK.left, w: 2.4 });
  out.push({ line: [at(0.08, 4.6), at(0.92, 12)], color: WOOD_DARK.right, w: 2.2 });
  if (locked) {
    const [x, y] = at(0.8, 8.5);
    out.push({ shackle: [x, y] }, { poly: [[x - 2.4, y - 1.4], [x + 2.4, y - 1.4], [x + 2.4, y + 2.4], [x - 2.4, y + 2.4]], fill: IRON.left });
  }
  return out;
}
// Le battant peint sur le canvas de l'île (déjà placé au centre de la case, et retourné si la porte est pivotée)
export function drawGateLeaf(ctx, locked, open) {
  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  for (const s of leafStrokes(locked, open)) {
    ctx.beginPath();
    if (s.line) {
      ctx.moveTo(...s.line[0]);
      ctx.lineTo(...s.line[1]);
      ctx.strokeStyle = s.color;
      ctx.lineWidth = s.w;
      ctx.stroke();
    } else if (s.shackle) {
      const [x, y] = s.shackle;
      ctx.moveTo(x - 1.6, y - 1.4);
      ctx.quadraticCurveTo(x - 1.6, y - 4.6, x, y - 4.6);
      ctx.quadraticCurveTo(x + 1.6, y - 4.6, x + 1.6, y - 1.4);
      ctx.strokeStyle = DARK_IRON.right;
      ctx.lineWidth = 1;
      ctx.stroke();
    } else {
      s.poly.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
      ctx.closePath();
      ctx.fillStyle = s.fill;
      ctx.fill();
      ctx.strokeStyle = INK;
      ctx.lineWidth = 0.6;
      ctx.stroke();
    }
  }
  ctx.restore();
}
// Le battant passe devant les poteaux quand il s'ouvre vers nous (+v), derrière sinon
export const leafInFront = open => open * SWING > 0.05;

// Le calque d'une case de mur : { key, make } (spriteCache.js : drawSprite). id : cloture ou muret, mask : ses
// demi-travées (wallMask ; 0 : seule, ALONE_U) ; porte : ses deux poteaux (son battant : drawGateLeaf)
export function wallLayer(id, mask) {
  if (id === 'porte') return { key: 'wall-porte-poteaux', make: () => sprite(gatePosts(), GATE_FRAME) };
  const arms = mask || ALONE_U;
  return { key: `wall-${id}-${arms}`, make: () => sprite(id === 'muret' ? muret(arms) : fence(arms), FRAME) };
}
