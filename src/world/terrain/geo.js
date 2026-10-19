// La géométrie du sol : taille d'une case, paliers de relief, niveau de la mer, l'île lue depuis le serveur
// (islandOf), le centre d'une case (worldOf), son losange, ce qu'elle couvre en hauteur, les lanternes du pont.

export const TW = 64;

export const TH = TW / 2;

// Hauteur d'un palier de relief, et niveau de la mer (en paliers, sous la terre la plus basse)
export const HS = 22;

export const SEA_Z = -1.36;

// Mer : bande d'eaux peu profondes (en cases depuis la terre), aussi un peu hors de la carte ; « au large »
export const SHALLOW = 3;

export const SEA_PAD = 3;

export const SEA_FAR = 9;

// Ce qu'une case peut couvrir au-dessus de son centre (relief, détails) et au-dessous (faces jusqu'à la mer, piles
// du pont), en unités du monde
const cellAbove = h => TH / 2 + Math.max(0, h) * HS + 8;

// … une case de pont : sa bosse, son garde-corps et ses lanternes dépassent (world/pontRiviere.js)
const BRIDGE_ABOVE = 26;

const aboveOf = (M, x, y) => cellAbove(M.height(x, y)) + (M.ground(x, y) === 'k' ? BRIDGE_ABOVE : 0);

export const CELL_ABOVE_MAX = TH / 2 + 6 * HS + 8;

export const CELL_BELOW = TH / 2 - SEA_Z * HS + 8;

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

// Lueur d'une lanterne du pont (unités du monde), pour l'éclairage de nuit
export const lampGlowOf = lamp => { const p = worldOf(lamp.x, lamp.y, lamp.z); return { x: p.x, y: p.y - LAMP_H - 3 }; };

export { aboveOf, diamond, LAMP_H };
