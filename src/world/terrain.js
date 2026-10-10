// Le sol de la très grande île en relief (Canvas 2D, unités du monde) : chaque case a un sol (herbe, sable, prairie,
// forêt, roche, chemin, eau, et ceux des climats : neige, lac gelé, lande, marais, jungle, cendre, lave ; 'u' : terre
// encore inconnue) et une hauteur de 0 à 6 ; ses faces avant (vers +x et +y) descendent jusqu'au voisin, ou jusqu'à
// la mer. Le sol est préparé en carrés alignés sur l'écran, gardés en images (TerrainCache) : seuls les
// carrés visibles sont dessinés, les nouveaux préparés dans un budget de temps par image.
// L'eau douce (reflets, cascades) est animée par-dessus, case par case visible ; la mer vit dans sea.js.

import { pathFile, pathImage } from './pathArt';

export const TW = 64;
export const TH = TW / 2;
// Hauteur d'un palier de relief, et niveau de la mer (en paliers, sous la terre la plus basse)
export const HS = 22;
export const SEA_Z = -1.36;
// Carrés du sol : côté en pixels, marge qui recouvre les voisins, nombre gardé en images (hors de ceux à l'écran,
// toujours gardés), résolution maximale ; vue d'ensemble de toute l'île
const TILE_PX = 512;
const PAD_PX = 2;
const MAX_TILES = 24;
const MAX_RES = 2;
const OVERVIEW_RES = 0.25;
// Sauf de près (l'île en décide à chaque image : draw(…, bake)), le décor fixe (arbres, rochers…) est peint dans les
// carrés du sol, une fois, dans l'ordre du relief : l'île n'a plus à le redessiner à chaque image. Un carré est fait
// avec ou sans décor (clé distincte) ; la vue d'ensemble l'a toujours
// Vue d'ensemble peinte avant que tous les dessins du décor soient prêts : refaite au plus tant de fois
const OVERVIEW_RETRIES = 6;
// Ce qu'un élément du décor dépasse de sa case : vers le haut, sur les côtés (unités du monde, cadre des dessins)
const STAND_ABOVE = 96;
const STAND_SIDE = 10;
// Mer : bande d'eaux peu profondes (en cases depuis la terre), aussi un peu hors de la carte ; « au large »
export const SHALLOW = 3;
export const SEA_PAD = 3;
export const SEA_FAR = 9;
// Ce qu'une case peut couvrir au-dessus de son centre (relief, détails) et au-dessous (faces jusqu'à la mer, piles
// du pont), en unités du monde
const cellAbove = h => TH / 2 + Math.max(0, h) * HS + 8;
const CELL_ABOVE_MAX = TH / 2 + 6 * HS + 8;
const CELL_BELOW = TH / 2 - SEA_Z * HS + 8;

// Île flottante (lot 5e) : sous sa surface, une croûte de terre (CRUST paliers), puis un dessous rocheux en pointes,
// plus profond vers le centre (de UNDER_MIN à UNDER_MAX paliers) ; la mer passe dessous
export const CRUST = 0.5;
const UNDER_MIN = 0.8;
const UNDER_MAX = 2.1;
// Profondeur du dessous rocheux (en paliers, sous la croûte) en un point (en cases) de l'île flottante
export function underAt(float, x, y) {
  const k = 1 - Math.min(1, Math.hypot(x - float.cx, y - float.cy) / float.r);
  return UNDER_MIN + (UNDER_MAX - UNDER_MIN) * k;
}

// Lecture des calques du serveur (state.map) : relief, sol, quartier ; floating : index du quartier qui flotte
// au-dessus de la mer (-1 : aucun)
export function islandOf(map, n, floating = -1) {
  const ground = (x, y) => (x < 0 || y < 0 || x >= n || y >= n ? '~' : map.ground[y][x]);
  const height = (x, y) => {
    const c = x < 0 || y < 0 || x >= n || y >= n ? ' ' : map.height[y][x];
    return c === ' ' ? -1 : Number(c);
  };
  const zone = (x, y) => {
    const c = x < 0 || y < 0 || x >= n || y >= n ? '.' : map.grid[y][x];
    return c === '.' ? -1 : parseInt(c, 36);
  };
  const land = (x, y) => { const g = ground(x, y); return g !== '~' && g !== 'b'; };
  const floats = (x, y) => floating >= 0 && zone(x, y) === floating;
  // L'île flottante : ses cases, son centre et son rayon (en cases) ; null s'il n'y en a pas
  const cells = [];
  if (floating >= 0) for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (floats(x, y)) cells.push({ x, y });
  const cx = cells.reduce((sum, c) => sum + c.x, 0) / (cells.length || 1);
  const cy = cells.reduce((sum, c) => sum + c.y, 0) / (cells.length || 1);
  const float = cells.length ? { cells, cx, cy, r: Math.max(...cells.map(c => Math.hypot(c.x - cx, c.y - cy))) + 0.75 } : null;
  // Hauteur de la surface (en paliers) : l'eau douce est un peu sous ses rives ; la mer (et le pont qui la
  // traverse) au niveau de la mer
  const surface = (x, y) => {
    const g = ground(x, y);
    if (g === '~' || g === 'b') return SEA_Z;
    return g === 'w' ? height(x, y) - 0.25 : height(x, y);
  };
  // Distance de la mer à la terre posée sur l'eau (en cases, 0 sur terre, SEA_FAR au large ; l'île flottante n'en
  // fait pas partie), jusqu'à SEA_PAD cases hors de la carte
  const P = SEA_PAD + 3, m = n + 2 * P;
  const dist = new Uint8Array(m * m).fill(SEA_FAR);
  const queue = [];
  for (let y = -P; y < n + P; y++) {
    for (let x = -P; x < n + P; x++) {
      if (land(x, y) && !floats(x, y)) { dist[(y + P) * m + x + P] = 0; queue.push(x, y); }
    }
  }
  for (let k = 0; k < queue.length; k += 2) {
    const x = queue[k], y = queue[k + 1], d = dist[(y + P) * m + x + P];
    if (d + 1 >= SEA_FAR) continue;
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const nx = x + dx, ny = y + dy;
        if (nx < -P || ny < -P || nx >= n + P || ny >= n + P) continue;
        const i = (ny + P) * m + nx + P;
        if (dist[i] > d + 1) { dist[i] = d + 1; queue.push(nx, ny); }
      }
    }
  }
  const depth = (x, y) => (x < -P || y < -P || x >= n + P || y >= n + P ? SEA_FAR : dist[(y + P) * m + x + P]);
  return { n, ground, height, zone, land, floats, float, surface, depth };
}

// Centre d'une case (ou d'un point fractionnaire) à une hauteur donnée (en paliers)
export const worldOf = (x, y, z = 0) => ({ x: ((x - y) * TW) / 2, y: ((x + y) * TH) / 2 - z * HS });

// Hasard fixe par case
const rnd = (x, y, k = 0) => { const v = Math.sin(x * 12.9898 + y * 78.233 + k * 37.719) * 43758.5453; return v - Math.floor(v); };

const TOPS = {
  g: [['#93CE70', '#9ED67B'], ['#8CC66A', '#97CF74'], ['#85BC63', '#90C56D'], ['#9DB86E', '#A6C077']],
  m: [['#A6D873', '#B0DF7E']],
  f: [['#6FA458', '#78AD60']],
  r: [['#A9A294', '#B2AB9D']],
  s: [['#EBD49B', '#F0DBA6']],
  p: [['#DCC28B', '#E1C892'], ['#D6BC83', '#DBC28A']],
  w: [['#5FB0DD', '#66B6E1']],
  n: [['#EEF3F8', '#F5F8FB']],
  v: [['#BFE3F2', '#C9E9F5']],
  l: [['#A8889E', '#B192A7'], ['#9E8396', '#A78D9F']],
  x: [['#7E9A62', '#86A169']],
  j: [['#3E8A48', '#46924F']],
  a: [['#6A6461', '#726C68']],
  o: [['#D9532E', '#E2603A']],
  // Terre inconnue : un sol pâle, sauge en bas, pierre grise en hauteur, qu'on devine sous la brume (relief compris)
  u: [['#C9D3C6', '#CFD8CB'], ['#C5CDC3', '#CBD3C9'], ['#C3C9C6', '#C9CFCC'], ['#C8CCD1', '#CDD1D6'], ['#D2D5DA', '#D7DAE0']]
};
const topColor = (g, h, odd) => {
  const key = g === 't' ? 'g' : g === 'd' ? 's' : g === 'k' ? 'w' : g;
  const set = TOPS[key] || TOPS.g;
  return set[Math.min(set.length - 1, Math.max(0, h))][odd ? 1 : 0];
};
// Faces : terre (sous l'herbe), sable, roche, eau qui tombe, marches de pierre ; [gauche, droite]
const FACES = {
  earth: ['#9C6A3A', '#7E5229'],
  sand: ['#D2B47A', '#BC9C63'],
  rock: ['#8E8578', '#766D61'],
  fall: ['#9AD3F0', '#86C6E8'],
  stairs: ['#CDBB94', '#B8A57D'],
  basalt: ['#4C4744', '#3B3734'],
  // Falaises d'une terre inconnue : assez sombres pour lire le relief sous le voile
  fog: ['#B4BCC0', '#A0A8AF']
};

// grassy : liseré en haut de la face (true : herbe ; ou une couleur [gauche, droite] : neige, bruyère…)
function face(ctx, x0, y0, x1, y1, drop, kind, side, grassy) {
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  ctx.lineTo(x1, y1 + drop);
  ctx.lineTo(x0, y0 + drop);
  ctx.closePath();
  // Une teinte qui descend du clair au sombre (la face n'est plus un aplat : elle se lit en relief)
  const base = FACES[kind][side];
  const dark = '#' + base.slice(1).match(/../g).map(c => Math.round(parseInt(c, 16) * 0.72).toString(16).padStart(2, '0')).join('');
  const grad = ctx.createLinearGradient(0, Math.min(y0, y1), 0, Math.min(y0, y1) + drop);
  grad.addColorStop(0, base);
  grad.addColorStop(1, dark);
  ctx.fillStyle = grad;
  ctx.fill();
  if (kind === 'stairs') {
    // Marches : une bande claire et une ombre par demi-palier
    const steps = Math.max(2, Math.round(drop / (HS / 3)));
    for (let k = 0; k < steps; k++) {
      const a = (k / steps) * drop, b = a + drop / steps * 0.35;
      ctx.fillStyle = 'rgba(255, 248, 225, .45)';
      ctx.beginPath();
      ctx.moveTo(x0, y0 + a); ctx.lineTo(x1, y1 + a); ctx.lineTo(x1, y1 + b); ctx.lineTo(x0, y0 + b);
      ctx.closePath();
      ctx.fill();
    }
    return;
  }
  if (kind === 'fall' || kind === 'fog') return;
  // Strates sur les faces, visibles même courtes : des lignes de terre plus sombres, un peu espacées
  ctx.strokeStyle = 'rgba(52, 30, 14, .22)';
  ctx.lineWidth = 1;
  for (let z = HS * 0.4; z < drop - 2; z += HS * 0.45) {
    ctx.beginPath();
    ctx.moveTo(x0, y0 + z);
    ctx.lineTo(x1, y1 + z);
    ctx.stroke();
  }
  // Un reflet clair le long de l'arête du haut, et l'ombre qui s'épaissit vers le pied
  ctx.strokeStyle = 'rgba(255, 244, 220, .28)';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  ctx.stroke();
  ctx.fillStyle = 'rgba(40, 22, 10, .16)';
  ctx.beginPath();
  ctx.moveTo(x0, y0 + drop * 0.7); ctx.lineTo(x1, y1 + drop * 0.7); ctx.lineTo(x1, y1 + drop); ctx.lineTo(x0, y0 + drop);
  ctx.closePath();
  ctx.fill();
  if (grassy) {
    ctx.fillStyle = Array.isArray(grassy) ? grassy[side] : side ? '#5F8F41' : '#6E9E4C';
    ctx.beginPath();
    ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.lineTo(x1, y1 + 3.5); ctx.lineTo(x0, y0 + 3.5);
    ctx.closePath();
    ctx.fill();
  }
}

// Face avant d'une case de l'île flottante, côté mer : la croûte de terre, puis la roche suspendue jusqu'à un bord
// en pointes (profondeur aux coins ca, cb : continue d'une case à l'autre). Renvoie le contour complet (voile de brume)
const JAG = [0, 0.2, 0.55, 0.25, 0];
function hangingFace(ctx, M, x0, y0, x1, y1, ca, cb, side, grassy, seed) {
  const crust = CRUST * HS;
  face(ctx, x0, y0, x1, y1, crust, 'earth', side, grassy);
  const dA = (CRUST + underAt(M.float, ...ca)) * HS, dB = (CRUST + underAt(M.float, ...cb)) * HS;
  const bottom = JAG.map((jag, k) => {
    const t = k / (JAG.length - 1);
    return [x0 + (x1 - x0) * t, y0 + (y1 - y0) * t + dA + (dB - dA) * t + jag * HS * (0.7 + rnd(seed, side, k) * 0.9)];
  });
  ctx.beginPath();
  ctx.moveTo(x0, y0 + crust);
  ctx.lineTo(x1, y1 + crust);
  for (let k = bottom.length - 1; k >= 0; k--) ctx.lineTo(...bottom[k]);
  ctx.closePath();
  ctx.fillStyle = FACES.rock[side];
  ctx.fill();
  // Ombre qui s'épaissit vers les pointes, une fissure
  const shade = ctx.createLinearGradient(0, Math.min(y0, y1) + crust, 0, Math.max(y0 + dA, y1 + dB) + HS * 0.6);
  shade.addColorStop(0, 'rgba(30, 24, 18, 0)');
  shade.addColorStop(1, 'rgba(30, 24, 18, .38)');
  ctx.fillStyle = shade;
  ctx.fill();
  ctx.strokeStyle = 'rgba(40, 32, 25, .3)';
  ctx.lineWidth = 1;
  const k = 0.3 + rnd(seed, side, 9) * 0.4;
  ctx.beginPath();
  ctx.moveTo(x0 + (x1 - x0) * k, y0 + (y1 - y0) * k + crust + 2);
  ctx.lineTo(x0 + (x1 - x0) * (k + 0.06), y0 + (y1 - y0) * k + crust + (dA + dB) * 0.3);
  ctx.stroke();
  return [[x0, y0], [x1, y1], ...bottom.reverse()];
}

function diamond(ctx, cx, cy, w = TW, h = TH) {
  ctx.beginPath();
  ctx.moveTo(cx, cy - h / 2);
  ctx.lineTo(cx + w / 2, cy);
  ctx.lineTo(cx, cy + h / 2);
  ctx.lineTo(cx - w / 2, cy);
  ctx.closePath();
}

// Lanterne d'un bout du pont : case de pont (x, y), terre en (x + dx, y + dy) ; au bord de la case, côté avant
export const bridgeLamp = (x, y, dx, dy) => ({ x: x + dx * 0.42 + Math.abs(dy) * 0.32, y: y + dy * 0.42 + Math.abs(dx) * 0.32, z: 0.15 });
const LAMP_H = 24;

// Pont de planches sur la mer (vers l'Îlot aux Mouettes), posé au ras de la terre : piles, tablier, rambardes de corde
// sur poteaux des deux côtés, une lanterne à chaque bout (sa lueur de nuit : WorldView)
function seaBridge(ctx, M, x, y) {
  const c = worldOf(x, y, 0.15);
  ctx.fillStyle = '#6B4A2A';
  for (const [dx, dy] of [[-0.35, -0.35], [0.35, 0.35]]) {
    const p = worldOf(x + dx, y + dy, 0.15);
    ctx.fillRect(p.x - 2, p.y, 4, HS * 1.5);
  }
  diamond(ctx, c.x, c.y, TW * 0.92, TH * 0.6);
  ctx.fillStyle = '#A47A4A';
  ctx.fill();
  ctx.strokeStyle = '#7A5530';
  ctx.lineWidth = 1;
  for (let k = -3; k <= 3; k++) {
    ctx.beginPath();
    ctx.moveTo(c.x + k * 6 - 9, c.y + k * 3 - 4.5 + (k * 0.2));
    ctx.lineTo(c.x + k * 6 + 9, c.y + k * 3 + 4.5 - (k * 0.2));
    ctx.stroke();
  }
  const alongX = 'b'.includes(M.ground(x - 1, y)) || 'b'.includes(M.ground(x + 1, y)) || M.land(x - 1, y) || M.land(x + 1, y);
  const post = (u, v, h) => {
    const p = worldOf(u, v, 0.15);
    ctx.fillStyle = '#5C3F24';
    ctx.fillRect(p.x - 1.2, p.y - h, 2.4, h);
    return { x: p.x, y: p.y - h };
  };
  // Rambarde : de l'arrière (-1) puis de l'avant (+1), corde qui pend un peu entre deux poteaux
  for (const side of [-1, 1]) {
    const a = alongX ? post(x - 0.5, y + side * 0.32, 12) : post(x + side * 0.32, y - 0.5, 12);
    const b = alongX ? post(x + 0.5, y + side * 0.32, 12) : post(x + side * 0.32, y + 0.5, 12);
    ctx.strokeStyle = '#D9C08A';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y + 1);
    ctx.quadraticCurveTo((a.x + b.x) / 2, (a.y + b.y) / 2 + 4, b.x, b.y + 1);
    ctx.stroke();
  }
  for (const [dx, dy] of alongX ? [[-1, 0], [1, 0]] : [[0, -1], [0, 1]]) {
    if (!M.land(x + dx, y + dy)) continue;
    const lamp = bridgeLamp(x, y, dx, dy);
    const top = post(lamp.x, lamp.y, LAMP_H);
    ctx.fillStyle = '#3D3A36';
    ctx.fillRect(top.x - 3.4, top.y - 8, 6.8, 2);
    ctx.fillStyle = '#FFE08A';
    ctx.fillRect(top.x - 2.6, top.y - 6, 5.2, 6);
    ctx.strokeStyle = '#3D3A36';
    ctx.lineWidth = 0.8;
    ctx.strokeRect(top.x - 2.6, top.y - 6, 5.2, 6);
  }
}
// Lueur d'une lanterne du pont (unités du monde), pour l'éclairage de nuit
export const lampGlowOf = lamp => { const p = worldOf(lamp.x, lamp.y, lamp.z); return { x: p.x, y: p.y - LAMP_H - 3 }; };

// Liseré en haut des faces des sols des climats : [gauche, droite]
const LIPS = { n: ['#F4F7FA', '#E3EAF1'], v: ['#DDEFF7', '#CFE5F0'], l: ['#8E6F86', '#7E6277'] };

// Les dessins de chemin d'une case de chemin (pathArt.js) : [{ file, dx, dy }] (décalage depuis son centre, unités du
// monde) et clip (les peindre dans son losange seulement). Un chemin d'une case : son raccord vers ses voisines. Les
// parties plus larges : un seul chemin, au milieu, posé sur les coins que quatre cases de chemin se partagent (même
// hauteur) ; une case large où arrive un chemin d'une case trace aussi le bout qui les relie. Les gués (k) comptent
// comme chemin pour les raccords
const MASK_DIRS = [[0, -1, 1], [1, 0, 2], [0, 1, 4], [-1, 0, 8]];
export function pathDraws(M, x, y) {
  const isPath = (a, b) => 'pk'.includes(M.ground(a, b));
  const top = M.surface(x, y);
  const corner = (a, b) => [[a, b], [a + 1, b], [a, b + 1], [a + 1, b + 1]].every(([u, v]) => M.ground(u, v) === 'p' && M.surface(u, v) === top);
  const wideAt = (a, b) => corner(a, b) || corner(a - 1, b) || corner(a, b - 1) || corner(a - 1, b - 1);
  const maskOf = is => MASK_DIRS.reduce((m, [dx, dy, bit]) => (is(dx, dy) ? m | bit : m), 0);
  const alt = (a, b) => rnd(a, b, 40) < 0.5;
  if (!wideAt(x, y)) return { clip: false, draws: [{ file: pathFile(maskOf((dx, dy) => isPath(x + dx, y + dy)), alt(x, y)), dx: 0, dy: 0 }] };
  const draws = [];
  // Les coins de cette case où passe le chemin du milieu : centre du coin (x + i − ½, y + j − ½)
  for (const [i, j] of [[0, 0], [1, 0], [0, 1], [1, 1]]) {
    const a = x + i - 1, b = y + j - 1;
    if (!corner(a, b)) continue;
    const mask = maskOf((dx, dy) => corner(a + dx, b + dy));
    draws.push({ file: pathFile(mask, alt(a, b)), dx: ((i - j) * TW) / 2, dy: ((i + j - 1) * TH) / 2 });
  }
  // Un chemin d'une case qui arrive ici : le bout jusqu'au chemin du milieu (vers la voisine large d'à côté)
  const narrow = MASK_DIRS.filter(([dx, dy]) => isPath(x + dx, y + dy) && !wideAt(x + dx, y + dy));
  if (narrow.length) {
    const across = MASK_DIRS.filter(([dx, dy]) => narrow.some(n => n[0] !== dx && n[1] !== dy) && wideAt(x + dx, y + dy)).slice(0, 1);
    const mask = [...narrow, ...across].reduce((m, [, , bit]) => m | bit, 0);
    draws.push({ file: pathFile(mask, alt(x, y)), dx: 0, dy: 0 });
  }
  return { clip: true, draws };
}
// Le raccord d'une case de chemin vers ses voisines (masque : NE 1, SE 2, SO 4, NO 8), et l'herbe où il est peint
// (le creusement d'un chemin qu'on vient de tracer : roads.js)
export const pathMask = (M, x, y) => MASK_DIRS.reduce((m, [dx, dy, bit]) => ('pk'.includes(M.ground(x + dx, y + dy)) ? m | bit : m), 0);
export const pathGrass = (M, x, y) => topColor('g', M.height(x, y), (x + y) % 2);
// Peint les chemins d'une case dans son herbe (grass) ; faux si une image n'est pas encore prête (rien n'est peint)
function paintPath(ctx, M, x, y, c, grass) {
  const { clip, draws } = pathDraws(M, x, y);
  const imgs = draws.map(d => pathImage(d.file, grass));
  if (imgs.some(img => !img)) return false;
  ctx.save();
  if (clip) {
    diamond(ctx, c.x, c.y);
    ctx.clip();
  }
  draws.forEach((d, i) => ctx.drawImage(imgs[i], c.x + d.dx - TW / 2, c.y + d.dy - TH / 2, TW, TH));
  ctx.restore();
  return true;
}

// Une case : faces avant puis dessus, détails du sol, voile de brume (quartier à acheter)
export function drawCell(ctx, M, x, y, veil = 0) {
  const g = M.ground(x, y);
  if (g === '~') return;
  if (g === 'b') { seaBridge(ctx, M, x, y); return; }
  const h = M.height(x, y);
  const top = M.surface(x, y);
  const c = worldOf(x, y, top);
  const odd = (x + y) % 2;
  const grassy = 'gtmfjx'.includes(g) || LIPS[g] || false;
  const kindOf = (nx, ny) => {
    if (g === 'w') return M.ground(nx, ny) === 'w' || M.ground(nx, ny) === 'k' ? 'fall' : 'earth';
    if ((g === 'p' || g === 'k') && 'pk'.includes(M.ground(nx, ny))) return 'stairs';
    if (g === 's' || g === 'd') return 'sand';
    if (g === 'r' || g === 'n' || g === 'v') return 'rock';
    if (g === 'a' || g === 'o') return 'basalt';
    if (g === 'u') return 'fog';
    return h >= 2 && !'gtmfjx'.includes(g) ? 'rock' : 'earth';
  };
  const zl = M.surface(x, y + 1), zr = M.surface(x + 1, y);
  // Île flottante : côté mer, la face est suspendue (croûte et roche en pointes) ; son contour sert au voile
  const hangL = M.floats(x, y) && !M.land(x, y + 1), hangR = M.floats(x, y) && !M.land(x + 1, y);
  let outlineL = null, outlineR = null;
  if (hangL) outlineL = hangingFace(ctx, M, c.x - TW / 2, c.y, c.x, c.y + TH / 2, [x - 0.5, y + 0.5], [x + 0.5, y + 0.5], 0, grassy, x * 61 + y);
  else if (zl < top) face(ctx, c.x - TW / 2, c.y, c.x, c.y + TH / 2, (top - zl) * HS, kindOf(x, y + 1), 0, grassy);
  if (hangR) outlineR = hangingFace(ctx, M, c.x, c.y + TH / 2, c.x + TW / 2, c.y, [x + 0.5, y + 0.5], [x + 0.5, y - 0.5], 1, grassy, x * 61 + y);
  else if (zr < top) face(ctx, c.x, c.y + TH / 2, c.x + TW / 2, c.y, (top - zr) * HS, kindOf(x + 1, y), 1, grassy);
  // (un chemin : celui de la bibliothèque dans l'herbe de la case, sinon, le temps qu'il se lise, l'ancien chemin)
  const grass = g === 'p' ? topColor('g', h, odd) : null;
  diamond(ctx, c.x, c.y);
  ctx.fillStyle = grass || topColor(g, h, odd);
  ctx.fill();
  const drawn = grass && paintPath(ctx, M, x, y, c, grass);
  if (grass && !drawn) {
    diamond(ctx, c.x, c.y);
    ctx.fillStyle = topColor(g, h, odd);
    ctx.fill();
  }
  diamond(ctx, c.x, c.y);
  ctx.strokeStyle = 'rgba(255, 255, 255, .12)';
  ctx.lineWidth = 0.8;
  ctx.stroke();
  // Détails : cailloux du chemin, fleurs de la prairie, ondulations du sable, brins d'herbe, fissures de la roche
  // (le chemin de la bibliothèque a déjà ses cailloux)
  if ((g === 'p' || g === 'k') && !drawn) {
    ctx.fillStyle = 'rgba(120, 90, 50, .28)';
    for (let k = 0; k < 4; k++) ctx.fillRect(c.x - 14 + rnd(x, y, k) * 28, c.y - 5 + rnd(x, y, k + 9) * 10, 2, 2);
  } else if (g === 'm') {
    const colors = ['#F2E36B', '#F49AC1', '#FFFFFF', '#B7A6F2'];
    for (let k = 0; k < 5; k++) {
      ctx.fillStyle = colors[Math.floor(rnd(x, y, k + 3) * colors.length)];
      ctx.fillRect(c.x - 16 + rnd(x, y, k) * 32, c.y - 6 + rnd(x, y, k + 7) * 12, 2.4, 2.4);
    }
  } else if (g === 's' || g === 'd') {
    ctx.strokeStyle = 'rgba(190, 150, 90, .25)';
    ctx.lineWidth = 1;
    const k = rnd(x, y, 2) * 8 - 4;
    ctx.beginPath();
    ctx.moveTo(c.x - 12, c.y + k);
    ctx.quadraticCurveTo(c.x, c.y + k - 3, c.x + 12, c.y + k);
    ctx.stroke();
  } else if (g === 'r') {
    // Roche : une dalle claire, une dalle sombre, une fissure, des cailloux
    for (let k = 0; k < 2; k++) {
      const ox = c.x - 9 + rnd(x, y, k + 30) * 18, oy = c.y - 3 + rnd(x, y, k + 33) * 6, sz = 5 + rnd(x, y, k + 36) * 4;
      ctx.fillStyle = k ? 'rgba(255, 255, 255, .16)' : 'rgba(55, 45, 35, .13)';
      ctx.beginPath();
      ctx.moveTo(ox - sz, oy);
      ctx.lineTo(ox - sz * 0.2, oy - sz * 0.45);
      ctx.lineTo(ox + sz, oy - sz * 0.1);
      ctx.lineTo(ox + sz * 0.3, oy + sz * 0.42);
      ctx.closePath();
      ctx.fill();
    }
    ctx.strokeStyle = 'rgba(70, 60, 50, .3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(c.x - 10 + rnd(x, y) * 6, c.y - 4);
    ctx.lineTo(c.x + rnd(x, y, 1) * 4, c.y + 1);
    ctx.lineTo(c.x + 8, c.y - 2 + rnd(x, y, 2) * 5);
    ctx.stroke();
    ctx.fillStyle = 'rgba(80, 70, 60, .4)';
    for (let k = 0; k < 3; k++) ctx.fillRect(c.x - 13 + rnd(x, y, k + 40) * 26, c.y - 5 + rnd(x, y, k + 44) * 10, 1.8, 1.4);
  } else if (g === 'n' || g === 'v') {
    // Neige : un reflet bleuté, quelques scintillements ; lac gelé : des fêlures claires
    ctx.fillStyle = 'rgba(160, 190, 220, .25)';
    ctx.beginPath();
    ctx.ellipse(c.x - 6 + rnd(x, y, 5) * 12, c.y + 2, 9, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255, 255, 255, .95)';
    for (let k = 0; k < 3; k++) ctx.fillRect(c.x - 14 + rnd(x, y, k + 50) * 28, c.y - 5 + rnd(x, y, k + 53) * 10, 1.6, 1.6);
    if (g === 'v') {
      ctx.strokeStyle = 'rgba(255, 255, 255, .7)';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(c.x - 12, c.y - 2 + rnd(x, y, 6) * 4);
      ctx.lineTo(c.x - 2, c.y + 1);
      ctx.lineTo(c.x + 10, c.y - 3 + rnd(x, y, 7) * 5);
      ctx.stroke();
    }
  } else if (g === 'l') {
    // Lande : touffes de bruyère mauve et d'ajonc doré
    for (let k = 0; k < 6; k++) {
      ctx.fillStyle = k % 3 === 2 ? 'rgba(232, 196, 78, .8)' : 'rgba(150, 92, 160, .55)';
      ctx.beginPath();
      ctx.arc(c.x - 15 + rnd(x, y, k + 60) * 30, c.y - 5 + rnd(x, y, k + 66) * 10, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (g === 'x') {
    // Marais : une flaque d'eau dormante et des brins de joncs
    ctx.fillStyle = 'rgba(70, 120, 120, .45)';
    ctx.beginPath();
    ctx.ellipse(c.x - 4 + rnd(x, y, 8) * 8, c.y + rnd(x, y, 9) * 4 - 2, 8 + rnd(x, y, 10) * 4, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(40, 80, 30, .45)';
    for (let k = 0; k < 4; k++) ctx.fillRect(c.x - 14 + rnd(x, y, k + 70) * 28, c.y - 6 + rnd(x, y, k + 74) * 10, 1.2, 4);
  } else if (g === 'j') {
    // Jungle : sous-bois sombre, feuilles larges
    for (let k = 0; k < 4; k++) {
      ctx.fillStyle = k % 2 ? 'rgba(20, 70, 30, .4)' : 'rgba(110, 170, 80, .35)';
      ctx.beginPath();
      ctx.ellipse(c.x - 12 + rnd(x, y, k + 80) * 24, c.y - 4 + rnd(x, y, k + 84) * 8, 4, 1.8, rnd(x, y, k + 88) * 3, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (g === 'a' || g === 'o') {
    // Cendre : fissures sombres (la lave, elle, rougeoie dans ses fissures)
    ctx.strokeStyle = g === 'o' ? 'rgba(255, 214, 120, .85)' : 'rgba(30, 26, 24, .45)';
    ctx.lineWidth = g === 'o' ? 1.4 : 1;
    ctx.beginPath();
    ctx.moveTo(c.x - 12 + rnd(x, y, 11) * 5, c.y - 3);
    ctx.lineTo(c.x - 1, c.y + 1 + rnd(x, y, 12) * 2);
    ctx.lineTo(c.x + 11, c.y - 2 + rnd(x, y, 13) * 4);
    ctx.stroke();
    if (g === 'a') {
      ctx.fillStyle = 'rgba(200, 190, 180, .25)';
      for (let k = 0; k < 3; k++) ctx.fillRect(c.x - 13 + rnd(x, y, k + 90) * 26, c.y - 5 + rnd(x, y, k + 93) * 10, 1.6, 1.2);
    }
  } else if (g === 'u') {
    // Terre inconnue : des volutes de brume légère ; on devine le relief dessous, pas ce qu'il cache
    ctx.fillStyle = 'rgba(255, 255, 255, .4)';
    ctx.beginPath();
    ctx.arc(c.x - 7 + rnd(x, y, 14) * 6, c.y - 1, 6 + rnd(x, y, 15) * 3, 0, Math.PI * 2);
    ctx.arc(c.x + 4 + rnd(x, y, 16) * 6, c.y + 1, 5 + rnd(x, y, 17) * 3, 0, Math.PI * 2);
    ctx.fill();
  } else if (grassy === true && g !== 'f') {
    ctx.fillStyle = 'rgba(60, 110, 40, .22)';
    for (let k = 0; k < 3; k++) ctx.fillRect(c.x - 15 + rnd(x, y, k) * 30, c.y - 5 + rnd(x, y, k + 4) * 10, 1.4, 3);
  }
  if (g === 'k') {
    // Pont de bois sur la rivière : l'ombre, le tablier, puis les poteaux et les garde-corps au-dessus
    const w = TW * 0.82, h = TH * 0.6;
    ctx.fillStyle = 'rgba(22, 32, 26, .28)';
    ctx.beginPath();
    ctx.ellipse(c.x, c.y + 1, TW * 0.52, TH * 0.34, 0, 0, Math.PI * 2);
    ctx.fill();
    // le tablier : dessus clair, bords sombres
    ctx.fillStyle = '#B07E4A';
    diamond(ctx, c.x, c.y - 4, w, h);
    ctx.fill();
    ctx.strokeStyle = '#6E4A26';
    ctx.lineWidth = 1.1;
    ctx.stroke();
    // planches transversales
    ctx.strokeStyle = '#8A5E32';
    ctx.lineWidth = 0.9;
    for (let k = -2; k <= 2; k++) {
      ctx.beginPath();
      ctx.moveTo(c.x + k * 7 - 10, c.y - 4 + k * 3.5 - 3);
      ctx.lineTo(c.x + k * 7 + 10, c.y - 4 + k * 3.5 + 3);
      ctx.stroke();
    }
    // poteaux aux quatre coins, puis les traverses qui les relient
    ctx.strokeStyle = '#5E3D20';
    ctx.lineWidth = 2.2;
    for (const [px, py] of [[c.x - w / 2 + 3, c.y], [c.x + w / 2 - 3, c.y], [c.x, c.y - h / 2 + 3], [c.x, c.y + h / 2 - 3]]) {
      ctx.beginPath();
      ctx.moveTo(px, py - 1);
      ctx.lineTo(px, py - 9);
      ctx.stroke();
    }
    ctx.strokeStyle = '#7A4E2A';
    ctx.lineWidth = 1.6;
    for (const sign of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(c.x + sign * (w / 2 - 3), c.y - 9);
      ctx.lineTo(c.x + sign * (w / 2 - 3) * 0.4, c.y - h / 2 + 2 - 9);
      ctx.stroke();
    }
  }
  if (veil > 0) {
    ctx.fillStyle = `rgba(236, 238, 242, ${veil.toFixed(3)})`;
    diamond(ctx, c.x, c.y, TW + 1, TH + 1);
    ctx.fill();
    const outline = pts => { ctx.beginPath(); ctx.moveTo(...pts[0]); pts.slice(1).forEach(p => ctx.lineTo(...p)); ctx.closePath(); ctx.fill(); };
    if (outlineL) outline(outlineL);
    else if (zl < top) outline([[c.x - TW / 2, c.y], [c.x, c.y + TH / 2], [c.x, c.y + TH / 2 + (top - zl) * HS], [c.x - TW / 2, c.y + (top - zl) * HS]]);
    if (outlineR) outline(outlineR);
    else if (zr < top) outline([[c.x, c.y + TH / 2], [c.x + TW / 2, c.y], [c.x + TW / 2, c.y + (top - zr) * HS], [c.x, c.y + TH / 2 + (top - zr) * HS]]);
  }
}

// Sol de l'île en carrés gardés en images, alignés sur l'écran (aucun chevauchement) : un carré fait TILE_PX pixels
// de côté, quelle que soit la résolution, et couvre donc TILE_PX / res unités du monde. Les carrés à l'écran ne
// sont jamais jetés ; au-delà de MAX_TILES, les plus anciens hors de l'écran partent d'abord. Vue de toute l'île :
// une seule image basse résolution (la vue d'ensemble), qui sert aussi en attendant un carré pas encore prêt.
// veilOf(x, y) : voile de brume d'une case (0 si son quartier est à soi) ; standOf(ctx, x, y) : peint le décor fixe
// d'une case, vrai si tout était prêt (les carrés cuits avant que tous les dessins soient chargés seront refaits)
// Un carré pas encore prêt (une image du décor manque) : refait STALE_TRIES fois au plus, à STALE_GAP_MS d'écart
const STALE_TRIES = 8;
const STALE_GAP_MS = 300;

export class TerrainCache {
  constructor(M, veilOf, standOf = null) {
    this.M = M;
    this.veilOf = veilOf;
    this.standOf = standOf;
    this.tiles = new Map();
    this.overview = null;
    const n = M.n;
    // Rectangle du monde où il y a du sol (au-delà, la mer)
    this.bounds = { x: (-n * TW) / 2 - TW, y: -CELL_ABOVE_MAX, w: n * TW + 2 * TW, h: n * TH + CELL_ABOVE_MAX + CELL_BELOW };
  }

  // Le décor fixe a changé : les carrés où il est cuit et la vue d'ensemble seront refaits
  restand() {
    for (const tile of this.tiles.values()) {
      if (!tile.bake) continue;
      tile.stale = true;
      tile.tries = 0;
    }
    if (this.overview) { this.overview.stale = true; this.overview.retries = 0; }
  }

  // Peint les cases qui touchent un rectangle du monde, dans l'ordre du relief (diagonale après diagonale, de gauche
  // à droite) ; le canvas ou la découpe coupe ce qui dépasse. stand : avec le décor fixe de chaque case. Renvoie le
  // nombre de cases peintes (this.ready dit si tout le décor était prêt)
  paint(ctx, r, stand = false) {
    this.ready = true;
    const M = this.M, n = M.n;
    // Centre d'une case : ((x - y) · TW/2, (x + y) · TH/2) ; d = x + y, u = x - y
    // (cases qui touchent le rectangle sur plus qu'un bord ; avec le décor, aussi celles dont un arbre y dépasse)
    const side = TW / 2 + 2 + (stand ? STAND_SIDE : 0), above = stand ? STAND_ABOVE : 0;
    const umin = Math.floor(((r.x - side) * 2) / TW) + 1, umax = Math.ceil(((r.x + r.w + side) * 2) / TW) - 1;
    const dmin = Math.max(0, Math.floor(((r.y - CELL_BELOW) * 2) / TH) + 1), dmax = Math.min(2 * n - 2, Math.ceil(((r.y + r.h + CELL_ABOVE_MAX + above) * 2) / TH) - 1);
    let count = 0;
    for (let d = dmin; d <= dmax; d++) {
      const xa = Math.max(0, d - n + 1, Math.ceil((d + umin) / 2)), xb = Math.min(n - 1, d, Math.floor((d + umax) / 2));
      for (let x = xa; x <= xb; x++) {
        const y = d - x;
        if (!M.land(x, y) && M.ground(x, y) !== 'b') continue;
        if ((d * TH) / 2 - cellAbove(M.height(x, y)) - above >= r.y + r.h || (d * TH) / 2 + CELL_BELOW <= r.y) continue;
        drawCell(ctx, M, x, y, this.veilOf(x, y));
        if (stand && !this.standOf(ctx, x, y)) this.ready = false;
        count++;
      }
    }
    return count;
  }

  // Un carré : sa case de la grille à cette résolution, avec une marge de PAD_PX pixels qui recouvre ses voisins
  // (aucune couture entre deux carrés). Un carré de pleine mer ne garde pas d'image
  render(tx, ty, res, bake = false) {
    const size = TILE_PX / res, pad = PAD_PX / res;
    const r = { x: tx * size - pad, y: ty * size - pad, w: size + 2 * pad, h: size + 2 * pad };
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = TILE_PX + 2 * PAD_PX;
    const ctx = canvas.getContext('2d');
    ctx.setTransform(res, 0, 0, res, -r.x * res, -r.y * res);
    if (this.paint(ctx, r, bake)) return { canvas, r, res, bake, stale: bake && !this.ready };
    canvas.width = canvas.height = 0;
    return { canvas: null, r, res, bake };
  }

  // Toute l'île en basse résolution
  // (avec le décor fixe ; peinte trop tôt, elle est refaite un peu plus tard, OVERVIEW_RETRIES fois au plus)
  overviewOf() {
    const now = performance.now();
    const o = this.overview;
    if (o && !(o.stale && o.retries < OVERVIEW_RETRIES && now - o.at > 400)) return o;
    const b = this.bounds;
    const canvas = o ? o.canvas : document.createElement('canvas');
    canvas.width = Math.ceil(b.w * OVERVIEW_RES);
    canvas.height = Math.ceil(b.h * OVERVIEW_RES);
    const ctx = canvas.getContext('2d');
    ctx.setTransform(OVERVIEW_RES, 0, 0, OVERVIEW_RES, -b.x * OVERVIEW_RES, -b.y * OVERVIEW_RES);
    this.paint(ctx, b, Boolean(this.standOf));
    this.overview = { canvas, ctx, at: now, stale: !this.ready, retries: o ? o.retries + 1 : 0 };
    return this.overview;
  }

  // Dessine le sol visible (view : rectangle du monde, scale : pixels par unité du monde ; bake : avec le décor fixe).
  // Les carrés manquants sont préparés tant qu'il reste du temps (budget en ms, au moins un par image ; tous d'un coup
  // à l'arrivée sur l'île), puis, tout étant prêt, un voisin de l'écran d'avance. Renvoie le nombre de carrés encore à
  // préparer
  draw(ctx, view, scale, budget = 8, bake = false) {
    const res = resOf(scale);
    bake = bake && Boolean(this.standOf);
    const tag = `${res}${bake ? 'b' : ''}`;
    const b = this.bounds;
    if (res <= OVERVIEW_RES) {
      ctx.drawImage(this.overviewOf().canvas, b.x, b.y, b.w, b.h);
      this.seen = 0;
      return 0;
    }
    const size = TILE_PX / res;
    const x0 = Math.floor(Math.max(view.x, b.x) / size), x1 = Math.floor(Math.min(view.x + view.w, b.x + b.w) / size);
    const y0 = Math.floor(Math.max(view.y, b.y) / size), y1 = Math.floor(Math.min(view.y + view.h, b.y + b.h) / size);
    const start = performance.now();
    const all = !this.tiles.size;
    const seen = new Set();
    let rendered = 0, missing = 0;
    for (let ty = y0; ty <= y1; ty++) {
      for (let tx = x0; tx <= x1; tx++) {
        const key = `${tag}:${tx},${ty}`;
        seen.add(key);
        let tile = this.tiles.get(key);
        // (un carré pas encore prêt est refait quelques fois, espacées : une image du décor qui ne vient pas ne le fait
        // pas refaire à chaque image, sans fin)
        const retry = tile && tile.stale && (tile.tries || 0) < STALE_TRIES && start - (tile.at || 0) > STALE_GAP_MS;
        if ((!tile || retry) && (all || !rendered || performance.now() - start < budget)) {
          const tries = tile ? (tile.tries || 0) + 1 : 0;
          if (tile && tile.canvas) tile.canvas.width = tile.canvas.height = 0;
          tile = this.render(tx, ty, res, bake);
          tile.tries = tries;
          tile.at = start;
          rendered++;
        }
        if (tile) {
          // Le plus récemment vu passe en dernier : les plus anciens partent d'abord
          this.tiles.delete(key);
          this.tiles.set(key, tile);
          if (tile.stale) missing++;
          if (tile.canvas) ctx.drawImage(tile.canvas, tile.r.x, tile.r.y, tile.r.w, tile.r.h);
        } else {
          missing++;
          this.stand(ctx, { x: tx * size, y: ty * size, w: size, h: size });
        }
      }
    }
    if (!missing && this.tiles.size < MAX_TILES && performance.now() - start < budget) this.ahead(res, bake, x0 - 1, y0 - 1, x1 + 1, y1 + 1);
    for (const [key, tile] of this.tiles) {
      if (this.tiles.size <= MAX_TILES) break;
      if (seen.has(key)) continue;
      if (tile.canvas) tile.canvas.width = tile.canvas.height = 0;
      this.tiles.delete(key);
    }
    // (carrés à l'écran : le chargement de l'île compte ceux qui sont prêts)
    this.seen = seen.size;
    return missing;
  }

  // Un carré pas encore prêt autour de l'écran (sur l'île), préparé d'avance
  ahead(res, bake, x0, y0, x1, y1) {
    const size = TILE_PX / res, b = this.bounds;
    for (let ty = y0; ty <= y1; ty++) {
      for (let tx = x0; tx <= x1; tx++) {
        const key = `${res}${bake ? 'b' : ''}:${tx},${ty}`;
        if (this.tiles.has(key) || (tx + 1) * size < b.x || tx * size > b.x + b.w || (ty + 1) * size < b.y || ty * size > b.y + b.h) continue;
        this.tiles.set(key, this.render(tx, ty, res, bake));
        return;
      }
    }
  }

  // En attendant un carré : la vue d'ensemble si elle existe déjà (vue de toute l'île), puis les carrés d'une autre
  // résolution qui le recouvrent (découpés à sa place)
  stand(ctx, r) {
    const b = this.bounds;
    if (this.overview) {
      const k = OVERVIEW_RES;
      ctx.drawImage(this.overview.canvas, (r.x - b.x) * k, (r.y - b.y) * k, r.w * k, r.h * k, r.x, r.y, r.w, r.h);
    }
    ctx.save();
    ctx.beginPath();
    ctx.rect(r.x, r.y, r.w, r.h);
    ctx.clip();
    for (const tile of this.tiles.values()) {
      const t = tile.r;
      if (tile.canvas && t.x < r.x + r.w && t.x + t.w > r.x && t.y < r.y + r.h && t.y + t.h > r.y) ctx.drawImage(tile.canvas, t.x, t.y, t.w, t.h);
    }
    ctx.restore();
  }

  // La brume de ces cases a changé (quartier acheté) : leurs carrés sont refaits au fil des images (l'ancien reste
  // affiché d'ici là), la vue d'ensemble est repeinte à leur place
  invalidate(cells) {
    if (!cells.length) return;
    const r = cellsBox(this.M, cells);
    for (const tile of this.tiles.values()) {
      const t = tile.r;
      if (t.x < r.x + r.w && t.x + t.w > r.x && t.y < r.y + r.h && t.y + t.h > r.y) {
        tile.stale = true;
        tile.tries = 0;
      }
    }
    if (this.overview) {
      const { ctx } = this.overview;
      ctx.save();
      ctx.beginPath();
      ctx.rect(r.x, r.y, r.w, r.h);
      ctx.clip();
      ctx.clearRect(r.x, r.y, r.w, r.h);
      this.paint(ctx, r, Boolean(this.standOf));
      ctx.restore();
    }
  }

  // Libère toutes les images (sortie de l'île)
  clear() {
    for (const tile of this.tiles.values()) if (tile.canvas) tile.canvas.width = tile.canvas.height = 0;
    this.tiles.clear();
    if (this.overview) this.overview.canvas.width = this.overview.canvas.height = 0;
    this.overview = null;
  }
}

// Résolution des images du sol pour une échelle d'affichage : par paliers de √2 (une image n'est jamais agrandie,
// et pas plus de 1,41 fois réduite), entre la vue d'ensemble et MAX_RES
export function resOf(scale) {
  return Math.min(MAX_RES, 2 ** (Math.ceil(2 * Math.log2(Math.max(OVERVIEW_RES, scale))) / 2));
}

// Rectangle du monde que couvrent des cases ([x, y]), relief et faces compris
export function cellsBox(M, cells) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const [x, y] of cells) {
    const c = worldOf(x, y, 0);
    x0 = Math.min(x0, c.x - TW / 2 - 2);
    x1 = Math.max(x1, c.x + TW / 2 + 2);
    y0 = Math.min(y0, c.y - cellAbove(M.height(x, y)));
    y1 = Math.max(y1, c.y + CELL_BELOW);
  }
  return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
}

// Ce qui bouge sur le sol, précalculé une fois par île : cases d'eau douce, faces de cascade, bords de mer devant
// (shore : la mer en +y, côté 0, ou en +x, côté 1) et derrière (back : la mer en −y, côté 0, ou en −x, côté 1) ;
// rien autour de l'île flottante
export function liveOf(M) {
  const water = [], falls = [], shore = [], back = [];
  for (let y = 0; y < M.n; y++) {
    for (let x = 0; x < M.n; x++) {
      const g = M.ground(x, y);
      if (g === 'w') {
        water.push({ x, y });
        const top = M.surface(x, y);
        for (const [dx, dy, side] of [[0, 1, 0], [1, 0, 1]]) {
          const ng = M.ground(x + dx, y + dy);
          if ((ng === 'w' || ng === 'k') && M.surface(x + dx, y + dy) < top - 0.5) falls.push({ x, y, side, drop: (top - M.surface(x + dx, y + dy)) * HS });
        }
      }
      if (M.land(x, y) && !M.floats(x, y)) {
        for (const [dx, dy, side] of [[0, 1, 0], [1, 0, 1]]) if (M.ground(x + dx, y + dy) === '~') shore.push({ x, y, side });
        for (const [dx, dy, side] of [[0, -1, 0], [-1, 0, 1]]) if (M.ground(x + dx, y + dy) === '~') back.push({ x, y, side });
      }
    }
  }
  return { water, falls, shore, back };
}

// Traits blancs regroupés : ceux de même teinte et de même épaisseur partent en un seul tracé (de loin, toute la côte et
// toute l'eau douce sont à l'écran : un millier de traits). Teinte au 1/50 et épaisseur au 1/10 près, l'œil n'y voit
// pas de différence. add(alpha, largeur, tracé) : tracé(ctx) ajoute ses segments au chemin ; flush(ctx) dessine tout
export function strokeBatch() {
  const groups = new Map();
  return {
    add(alpha, width, trace) {
      const a = Math.round(alpha * 50) / 50, w = Math.round(width * 10) / 10;
      if (a <= 0) return;
      const key = `${a}|${w}`;
      if (!groups.has(key)) groups.set(key, { a, w, traces: [] });
      groups.get(key).traces.push(trace);
    },
    flush(ctx) {
      for (const { a, w, traces } of groups.values()) {
        ctx.strokeStyle = `rgba(255,255,255,${a})`;
        ctx.lineWidth = w;
        ctx.beginPath();
        for (const trace of traces) trace(ctx);
        ctx.stroke();
      }
      groups.clear();
    }
  };
}

// Animation de l'eau douce sur les cases visibles : reflets qui glissent, cascades qui tombent (la mer : sea.js)
export function drawLive(ctx, M, live, view, t) {
  const seen = c => c.x > view.x - TW && c.x < view.x + view.w + TW && c.y > view.y - TW * 2 && c.y < view.y + view.h + TW;
  ctx.lineCap = 'round';
  const glints = strokeBatch();
  for (const cell of live.water) {
    const c = worldOf(cell.x, cell.y, M.surface(cell.x, cell.y));
    if (!seen(c)) continue;
    const k = (t * 0.35 + rnd(cell.x, cell.y) ) % 1;
    glints.add(0.45 * Math.sin(k * Math.PI), 1.4, x => {
      x.moveTo(c.x - 10 + k * 8, c.y - 3 + k * 4);
      x.quadraticCurveTo(c.x - 2 + k * 8, c.y - 6 + k * 4, c.x + 6 + k * 8, c.y - 3 + k * 4);
    });
  }
  glints.flush(ctx);
  for (const f of live.falls) {
    const c = worldOf(f.x, f.y, M.surface(f.x, f.y));
    if (!seen(c)) continue;
    const [x0, y0, x1, y1] = f.side ? [c.x, c.y + TH / 2, c.x + TW / 2, c.y] : [c.x - TW / 2, c.y, c.x, c.y + TH / 2];
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.lineTo(x1, y1 + f.drop); ctx.lineTo(x0, y0 + f.drop);
    ctx.closePath();
    ctx.clip();
    ctx.strokeStyle = 'rgba(255, 255, 255, .7)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let k = 0; k < 6; k++) {
      const u = (k + 0.5) / 6;
      const sx = x0 + (x1 - x0) * u, sy = y0 + (y1 - y0) * u;
      const off = ((t * 60 + k * 17) % (f.drop + 12)) - 12;
      ctx.moveTo(sx, sy + off);
      ctx.lineTo(sx, sy + off + 9);
    }
    ctx.stroke();
    ctx.restore();
    // Écume au pied de la cascade
    const fx = (x0 + x1) / 2, fy = (y0 + y1) / 2 + f.drop;
    ctx.fillStyle = `rgba(255, 255, 255, ${(0.55 + 0.25 * Math.sin(t * 6 + f.x)).toFixed(3)})`;
    ctx.beginPath();
    ctx.ellipse(fx, fy, 11, 4.5, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

