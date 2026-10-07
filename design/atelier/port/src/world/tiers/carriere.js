// Carrière, paliers III à VII : Mine, Galerie, Puits de mine, Mine de cristal, Cité minière.
// Places laissées libres pour la boutique : voie de la galerie le long de u ≈ −0.35 (× 1.5 dès le palier IV, le
// wagonnet des Rails y roule), butoir au bout, lanterne à gauche, pioche et wagonnet devant.
import { ROCKS, BUILDING_BOX, pebble, crystals, rockBox, roofTexture } from '../palette.js';
import { UPGRADES } from '../buildings2.js';
import { sprite, HIVER, snowPan } from '../iso.js';
import {
  big, bigShadow, P, box, face, gable, f2, ln, dot, ell, OUT, STONE, PLASTER, WOOD, WOOD_DARK, BRICK, IRON, GOLD, DARK_STONE,
  archLeft, barrel, crate, lampPost
} from './kit.js';

const inner = s => s.svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
const rockOf = skin => ROCKS[skin] || STONE;
const ORE = { top: '#8A8F98', left: '#6B7079', right: '#50545C' };

// Tas de minerai : cailloux sombres et paillettes d'or
function oreHeap(u, v, s = 1) {
  let out = '';
  [[-0.06, -0.04, 4], [0.05, -0.05, 3.6], [0, 0.03, 4.4], [-0.08, 0.05, 3], [0.08, 0.04, 3.2], [0, -0.01, 3.4, 4]].forEach(([du, dv, r, z = 0]) => {
    const [x, y] = P(u + du * s, v + dv * s, z);
    out += ell(x + r * 0.1, y + r * 0.2, r * s, r * 0.65 * s, ORE.right) + ell(x, y, r * s, r * 0.66 * s, ORE.left) + ell(x - r * 0.3, y - r * 0.25, r * 0.5 * s, r * 0.3 * s, ORE.top);
  });
  [[0, -0.02, 5], [-0.05, 0.03, 2], [0.06, 0.02, 2.5]].forEach(([du, dv, z]) => {
    const [x, y] = P(u + du * s, v + dv * s, z);
    out += `<path d="M${f2(x)},${f2(y - 1.6)} l1.2,1.6 l-1.2,1.6 l-1.2,-1.6 Z" fill="${GOLD.left}"/>`;
  });
  return out;
}
// Voie ferrée de la galerie le long de v, centrée en u, de v0 à v1 ; k : échelle (1 ou 1.5)
function track(u, v0, v1, k = 1) {
  let out = '';
  for (let v = v0 + 0.06; v < v1; v += 0.17 * k) out += box(u - 0.15 * k, v - 0.02, u + 0.15 * k, v + 0.02, 0, 1.5, WOOD_DARK);
  return out + ln(P(u - 0.1 * k, v0, 1.5), P(u - 0.1 * k, v1, 1.5), '#7C8894', 1.2) + ln(P(u + 0.1 * k, v0, 1.5), P(u + 0.1 * k, v1, 1.5), '#7C8894', 1.2);
}
// Wagonnet de mine posé sur la voie (le long de v)
function cart(u, v, k = 1) {
  return box(u - 0.11 * k, v - 0.14 * k, u + 0.11 * k, v + 0.14 * k, 2, 11, { top: '#2E2A26', left: IRON.left, right: IRON.right })
    + oreHeap(u, v, 0.7 * k) + `<circle cx="${f2(P(u + 0.11 * k, v - 0.08 * k, 3)[0])}" cy="${f2(P(u + 0.11 * k, v - 0.08 * k, 3)[1])}" r="2.6" fill="#2A2724"/>`
    + `<circle cx="${f2(P(u + 0.11 * k, v + 0.08 * k, 3)[0])}" cy="${f2(P(u + 0.11 * k, v + 0.08 * k, 3)[1])}" r="2.6" fill="#2A2724"/>`;
}

// Puits d'aération sur le dessus de la roche (dessus à la hauteur z) : chevalet de bois et sa roue
function ventShaft(u, v, z) {
  const [vx, vy] = P(u, v, z);
  return box(u - 0.1, v - 0.08, u + 0.1, v + 0.08, z, z + 6, WOOD_DARK)
    + ln([vx - 7, vy - 2], [vx, vy - 22], WOOD.right, 1.8) + ln([vx + 7, vy - 2], [vx, vy - 22], WOOD.right, 1.8)
    + `<circle cx="${f2(vx)}" cy="${f2(vy - 20)}" r="4.6" fill="none" stroke="${WOOD_DARK.right}" stroke-width="1.4"/>` + dot(vx, vy - 20, 1.2, WOOD_DARK.right);
}

/* ---------- Palier III : Mine ---------- */
// La roche s'ouvre sur une galerie boisée (buildings2.js), coiffée d'un petit chevalement de bois ; entrée de pierre
// en arc, lampions, tas de minerai
function gallery(skin) {
  const rock = rockOf(skin);
  return sprite(
    inner(UPGRADES.carriere(skin))
    + ventShaft(0.12, -0.6, 44)
    // Entrée de pierre en arc autour de la galerie, clé de voûte
    + archLeft(-0.35, 0.26, -0.18, 0, 30, rock.left, ` stroke="${OUT}" stroke-width="0.8"`)
    + archLeft(-0.35, 0.19, -0.175, 0, 25, '#241E1A')
    + `<rect x="${f2(P(-0.35, -0.17, 29)[0] - 3)}" y="${f2(P(-0.35, -0.17, 29)[1] - 3)}" width="6" height="6" fill="${rock.top}" stroke="${OUT}" stroke-width="0.6"/>`
    // Lampions le long de la voûte
    + [[-0.58, 22], [-0.47, 28], [-0.23, 28], [-0.12, 22]].map(([u, z]) => { const [x, y] = P(u, -0.16, z); return dot(x, y + 2, 1.8, '#FFE08A') + ln([x, y - 1], [x, y + 0.4], '#3D3A36', 0.6); }).join('')
    + ln(P(-0.6, -0.16, 22), P(-0.47, -0.16, 27), '#3D3A36', 0.5) + ln(P(-0.47, -0.16, 27), P(-0.23, -0.16, 27), '#3D3A36', 0.5) + ln(P(-0.23, -0.16, 27), P(-0.1, -0.16, 22), '#3D3A36', 0.5)
    + oreHeap(0.58, 0.48, 1.2),
    BUILDING_BOX
  );
}

/* ---------- Grand carreau de mine (paliers IV à VII) : falaise, galerie, voie, minerai ---------- */
function minesite(skin, { portalTall = 36, giant = false } = {}) {
  const rock = rockOf(skin);
  const cliff = rockBox(-1.45, -1.45, 1.4, -0.3, 0, 62, rock) + rockBox(0.55, -0.3, 1.4, 0.15, 0, 30, rock);
  const portal = giant ? '' : archLeft(-0.53, 0.3, -0.3, 0, portalTall, WOOD_DARK.left, ` stroke="${OUT}" stroke-width="0.8"`)
    + archLeft(-0.53, 0.24, -0.295, 0, portalTall - 5, '#1F1A17')
    + box(-0.86, -0.32, -0.8, -0.26, 0, portalTall, WOOD_DARK) + box(-0.26, -0.32, -0.2, -0.26, 0, portalTall, WOOD_DARK);
  return bigShadow(90, 42) + cliff + portal
    + track(-0.53, -0.3, 1.18, 1.5)
    + cart(-0.53, 0.88, 1.2)
    + oreHeap(-1.05, 0.15, 1.6) + oreHeap(0.15, 0.55, 1.4)
    + pebble(-1.2, 1.15, 3.2, DARK_STONE) + pebble(0.62, 0.92, 2.6, DARK_STONE);
}
// Chevalement de bois au-dessus du puits : deux jambes, deux poulies, câbles vers la galerie
function headframe(u, v, h, color = WOOD, iron = false) {
  const [bx, by] = P(u, v, 0);
  const [tx, ty] = P(u, v, h);
  const leg = iron ? IRON.right : color.right;
  const w = 15;
  let out = face([[u - 0.14, v - 0.14, 0.4], [u + 0.14, v - 0.14, 0.4], [u + 0.14, v + 0.14, 0.4], [u - 0.14, v + 0.14, 0.4]], '#1F1A17');
  out += ln([bx - w, by], [tx - 3, ty], leg, 2.4) + ln([bx + w, by - 2], [tx + 3, ty], leg, 2.4) + ln([bx, by + 6], [tx, ty], leg, 2.2);
  for (let k = 1; k < 4; k++) {
    const t = k / 4;
    const lx = bx - w + (tx - 3 - bx + w) * t;
    const rx = bx + w + (tx + 3 - bx - w) * t;
    const yy = by + (ty - by) * t;
    out += ln([lx, yy], [rx, yy - 1], leg, 1) + (k < 3 ? ln([lx, yy], [bx + w + (tx + 3 - bx - w) * (t + 0.25), by + (ty - by) * (t + 0.25)], leg, 0.7) : '');
  }
  out += box(u - 0.12, v - 0.05, u + 0.12, v + 0.05, h - 2, h + 2, iron ? IRON : color);
  [[-5, 0], [5, -2]].forEach(([dx, dy]) => {
    out += `<circle cx="${f2(tx + dx)}" cy="${f2(ty - 7 + dy)}" r="6.5" fill="none" stroke="${iron ? '#41484F' : WOOD_DARK.right}" stroke-width="1.6"/>` + dot(tx + dx, ty - 7 + dy, 1.4, iron ? '#41484F' : WOOD_DARK.right)
      + [0, 1, 2].map(k => { const a = k * 1.05; return ln([tx + dx - Math.cos(a) * 6, ty - 7 + dy - Math.sin(a) * 6], [tx + dx + Math.cos(a) * 6, ty - 7 + dy + Math.sin(a) * 6], iron ? '#41484F' : WOOD_DARK.right, 0.6); }).join('');
  });
  return out + ln([tx - 5, ty - 1], [bx - 2, by - 2], '#3D3A36', 0.6) + ln([tx + 5, ty - 3], [bx + 2, by - 3], '#3D3A36', 0.6);
}

/* ---------- Palier IV : Galerie ---------- */
// Le carreau s'agrandit : une seconde galerie s'ouvre dans la falaise, sa voie mène au tas de minerai ; étais de bois
// empilés sur le gradin, puits d'aération sur la falaise, réverbère
function galleries(skin) {
  return big(
    minesite(skin)
    + archLeft(0.12, 0.2, -0.3, 0, 26, WOOD_DARK.left, ` stroke="${OUT}" stroke-width="0.8"`)
    + archLeft(0.12, 0.15, -0.295, 0, 22, '#1F1A17')
    + track(0.12, -0.3, 0.36, 1.2) + cart(0.12, 0.08, 1.1)
    + ventShaft(-0.95, -0.95, 62)
    + [0, 1, 2].map(k => box(0.7, -0.2 + k * 0.1, 1.3, -0.14 + k * 0.1, 30 + (k === 1 ? 4 : 0), 34 + (k === 1 ? 4 : 0), WOOD)).join('')
    + lampPost(-0.12, 0.02, 30)
  );
}

/* ---------- Palier V : Puits de mine ---------- */
// Cabane du treuil, puis le chevalement de fer au-dessus du puits
function shaftMine(skin) {
  return big(
    minesite(skin)
    + box(0.95, 0.2, 1.38, 0.62, 0, 22, WOOD) + face([[0.95, 0.62, 0], [1.38, 0.62, 0], [1.38, 0.62, 22], [0.95, 0.62, 22]], WOOD.left)
    + face([[1.08, 0.62, 0], [1.22, 0.62, 0], [1.22, 0.62, 14], [1.08, 0.62, 14]], '#3A2A1E')
    + face([[0.91, 0.16, 22], [1.42, 0.16, 22], [1.42, 0.41, 30], [0.91, 0.41, 30]], '#5C6880') + face([[0.91, 0.41, 30], [1.42, 0.41, 30], [1.42, 0.66, 22], [0.91, 0.66, 22]], '#7D8AA0')
    + ventShaft(-0.95, -0.95, 62)
    + headframe(0.5, 0.15, 78, IRON, true)
    + barrel(1.25, 0.82, 'pm-b1') + crate(0.92, 0.85, 0.11, 9)
  );
}

/* ---------- Palier V : Mine de cristal ---------- */
const crystalCluster = (u, v, z, s) => crystals(u, v, z, s) + crystals(u + 0.08, v + 0.04, z, s * 0.7);
function crystalMine(skin) {
  return big(
    minesite(skin)
    // Veines de cristal qui affleurent sur la falaise et sur le dessus
    + [[-1.1, -0.3, 20, 1.3], [-0.05, -0.3, 30, 1.1], [0.35, -0.3, 14, 0.9], [1.4, -0.9, 34, 1.2], [1.4, -0.5, 18, 0.9]].map(([u, v, z, s]) => crystalCluster(u, v, z, s)).join('')
    + [[-0.9, -1.0, 62, 1.6], [0.2, -0.9, 62, 1.9], [0.9, -0.7, 62, 1.4], [1.0, -0.05, 30, 1.2]].map(([u, v, z, s]) => crystalCluster(u, v, z, s)).join('')
    + headframe(0.5, 0.15, 74, { top: '#B9A0F0', left: '#9C82DE', right: '#7A60C0' })
    + crystalCluster(0.12, 0.62, 0, 1.4) + crystalCluster(-1.0, 0.3, 0, 1.2)
    + box(0.95, 0.2, 1.38, 0.62, 0, 22, WOOD) + face([[1.08, 0.62, 0], [1.22, 0.62, 0], [1.22, 0.62, 14], [1.08, 0.62, 14]], '#3A2A1E')
    + face([[0.91, 0.16, 22], [1.42, 0.16, 22], [1.42, 0.41, 30], [0.91, 0.41, 30]], '#7A60C0') + face([[0.91, 0.41, 30], [1.42, 0.41, 30], [1.42, 0.66, 22], [0.91, 0.66, 22]], '#9C82DE')
  );
}

/* ---------- Palier VII : Cité minière ---------- */
// Maisonnette de mineur : murs, toit à deux pans, porte, fenêtre, cheminée ; posée à z (sur un gradin)
function cottage(u0, v0, u1, v1, z, roof, wall = PLASTER) {
  const h = 16;
  const um = (u0 + u1) / 2;
  return box(u0, v0, u1, v1, z, z + h, wall)
    + face([[um - 0.06, v1, z], [um + 0.04, v1, z], [um + 0.04, v1, z + 10], [um - 0.06, v1, z + 10]], '#7A4E2C')
    + face([[u1, (v0 + v1) / 2 - 0.05, z + 6], [u1, (v0 + v1) / 2 + 0.05, z + 6], [u1, (v0 + v1) / 2 + 0.05, z + 12], [u1, (v0 + v1) / 2 - 0.05, z + 12]], '#FFE6A3')
    + box(u0 + 0.06, v0 + 0.04, u0 + 0.13, v0 + 0.11, z + h, z + h + 14, BRICK)
    + gable(u0, v0, u1, v1, z + h, 11, { front: roof.front, back: roof.back, gable: wall.right }, 0.05)
    + roofTexture(roof === MINER_ROOF_2 ? 'toit-ardoise' : 'toit-rouge', u0, v0, u1, v1, z + h, 11, 0.05);
}
// Clocher des mineurs sur la falaise : tour carrée, abat-sons, cloche, toit pointu
function belfry(u, v, z, roof) {
  const [bx, by] = P(u + 0.1, v + 0.1, z + 30);
  const T = P(u, v, z + 54), sn = (p, q, g) => (HIVER ? snowPan(T, T, P(...q, z + 34), P(...p, z + 34), 0.72, g) : '');
  return box(u - 0.1, v - 0.1, u + 0.1, v + 0.1, z, z + 34, STONE)
    + face([[u - 0.05, v + 0.1, z + 24], [u + 0.05, v + 0.1, z + 24], [u + 0.05, v + 0.1, z + 32], [u - 0.05, v + 0.1, z + 32]], '#2E2620')
    + dot(bx - 4, by + 1, 2.2, GOLD.left)
    + face([[u - 0.13, v - 0.13, z + 34], [u + 0.13, v - 0.13, z + 34], [u, v, z + 54]], roof.back) + sn([u - 0.13, v - 0.13], [u + 0.13, v - 0.13])
    + face([[u - 0.13, v + 0.13, z + 34], [u + 0.13, v + 0.13, z + 34], [u, v, z + 54]], roof.front) + sn([u + 0.13, v + 0.13], [u - 0.13, v + 0.13], true)
    + face([[u + 0.13, v - 0.13, z + 34], [u + 0.13, v + 0.13, z + 34], [u, v, z + 54]], roof.back) + sn([u + 0.13, v - 0.13], [u + 0.13, v + 0.13], true);
}
const MINER_ROOF = { front: '#E06E52', back: '#B9503B' };
const MINER_ROOF_2 = { front: '#7D8AA0', back: '#5C6880' };
function miningTown(skin) {
  return big(
    minesite(skin)
    // Sur la falaise : le clocher et deux maisons
    + cottage(-1.35, -1.38, -1.0, -1.05, 62, MINER_ROOF_2)
    + belfry(-0.72, -1.15, 62, MINER_ROOF)
    + cottage(-0.4, -1.4, -0.05, -1.08, 62, MINER_ROOF)
    // Sur le gradin, une maison ; devant, deux autres en rang
    + cottage(0.8, -0.24, 1.32, 0.08, 30, MINER_ROOF)
    + headframe(0.45, 0.12, 72, IRON, true)
    + cottage(0.72, 0.32, 1.06, 0.66, 0, MINER_ROOF_2)
    + cottage(1.1, 0.32, 1.42, 0.66, 0, MINER_ROOF)
    + [[1.4, -0.9, 34, 1], [-0.05, -0.3, 30, 0.9]].map(([u, v, z, k]) => crystals(u, v, z, k)).join('')
    + lampPost(-0.12, 0.02, 30) + lampPost(0.55, 0.85, 26)
  );
}

export const CARRIERE_TIERS = [
  { make: gallery, lights: [[0.04, -0.23, 34, 18], [-0.35, -0.16, 26, 20]] },
  { make: galleries, lights: [[-0.53, -0.3, 18, 24], [0.12, -0.3, 12, 16], [-0.12, 0.02, 31, 16]] },
  { make: shaftMine, lights: [[-0.53, -0.3, 18, 24], [1.15, 0.62, 10, 14]] },
  { make: crystalMine, lights: [[-0.53, -0.3, 18, 24], [-1.1, -0.3, 26, 16], [-0.05, -0.3, 34, 14], [1.4, -0.9, 40, 16], [0.12, 0.62, 8, 16], [-1.0, 0.3, 8, 14]] },
  {
    make: miningTown,
    lights: [[-0.53, -0.3, 18, 24], [-0.12, 0.02, 31, 16], [0.55, 0.85, 27, 16], [1.06, 0.49, 9, 12], [1.42, 0.49, 9, 12], [1.32, -0.08, 39, 12], [-1.0, -1.22, 71, 10], [-0.05, -1.24, 71, 10]],
    smoke: [[0.89, -0.17, 62], [0.81, 0.39, 32], [1.19, 0.39, 32]]
  }
];
