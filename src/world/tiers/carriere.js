// Carrière, paliers III à VII : Galerie, Puits de mine, Mine de cristal, Mine à vapeur, Mine des Géants.
// Places laissées libres pour la boutique : voie de la galerie le long de u ≈ −0.35 (× 1.5 dès le palier IV, le
// wagonnet des Rails y roule), butoir au bout, lanterne à gauche, pioche et wagonnet devant.
import { ROCKS, BUILDING_BOX, pebble, crystals } from '../palette';
import { UPGRADES } from '../buildings2';
import { sprite } from '../iso';
import {
  big, bigShadow, P, box, face, cylinder, f2, ln, poly, dot, ell, OUT, STONE, WOOD, WOOD_DARK, BRICK, IRON, GOLD, DARK_STONE,
  archLeft, barrel, crate, lampPost, courseLeft, courseRight
} from './kit';

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

/* ---------- Palier III : Galerie ---------- */
// La Mine gagne une entrée de pierre en arc, un puits d'aération sur la roche, un tas de minerai et des lampions
function gallery(skin) {
  const rock = rockOf(skin);
  const [vx, vy] = P(0.12, -0.6, 44);
  return sprite(
    inner(UPGRADES.carriere(skin))
    // Puits d'aération sur le dessus de la roche : chevalet et roue
    + box(0.02, -0.68, 0.22, -0.52, 44, 50, WOOD_DARK)
    + ln([vx - 7, vy - 2], [vx, vy - 22], WOOD.right, 1.8) + ln([vx + 7, vy - 2], [vx, vy - 22], WOOD.right, 1.8)
    + `<circle cx="${f2(vx)}" cy="${f2(vy - 20)}" r="4.6" fill="none" stroke="${WOOD_DARK.right}" stroke-width="1.4"/>` + dot(vx, vy - 20, 1.2, WOOD_DARK.right)
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
  const cliff = box(-1.45, -1.45, 1.4, -0.3, 0, 62, rock) + box(0.55, -0.3, 1.4, 0.15, 0, 30, rock);
  const veins = `<polyline points="${[P(-1.45, -0.3, 48), P(-0.7, -0.3, 56), P(0.1, -0.3, 44), P(0.55, -0.3, 50)].map(p => p.map(f2).join(',')).join(' ')}" stroke="rgba(90,80,65,.38)" stroke-width="1.1" fill="none"/>`
    + `<polyline points="${[P(1.4, -1.2, 40), P(1.4, -0.7, 50), P(1.4, -0.4, 36)].map(p => p.map(f2).join(',')).join(' ')}" stroke="rgba(70,60,45,.38)" stroke-width="1.1" fill="none"/>`;
  const portal = giant ? '' : archLeft(-0.53, 0.3, -0.3, 0, portalTall, WOOD_DARK.left, ` stroke="${OUT}" stroke-width="0.8"`)
    + archLeft(-0.53, 0.24, -0.295, 0, portalTall - 5, '#1F1A17')
    + box(-0.86, -0.32, -0.8, -0.26, 0, portalTall, WOOD_DARK) + box(-0.26, -0.32, -0.2, -0.26, 0, portalTall, WOOD_DARK);
  return bigShadow(90, 42) + cliff + veins + portal
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

/* ---------- Palier IV : Puits de mine ---------- */
function shaftMine(skin) {
  return big(
    minesite(skin)
    // Cabane du treuil, puis le chevalement au-dessus du puits
    + box(0.95, 0.2, 1.38, 0.62, 0, 22, WOOD) + face([[0.95, 0.62, 0], [1.38, 0.62, 0], [1.38, 0.62, 22], [0.95, 0.62, 22]], WOOD.left)
    + face([[1.08, 0.62, 0], [1.22, 0.62, 0], [1.22, 0.62, 14], [1.08, 0.62, 14]], '#3A2A1E')
    + face([[0.91, 0.16, 22], [1.42, 0.16, 22], [1.42, 0.41, 30], [0.91, 0.41, 30]], '#8E6A4A') + face([[0.91, 0.41, 30], [1.42, 0.41, 30], [1.42, 0.66, 22], [0.91, 0.66, 22]], '#A8805C')
    + headframe(0.5, 0.15, 74)
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

/* ---------- Palier VI : Mine à vapeur ---------- */
function steamMine(skin) {
  const [cx, cy] = P(1.12, -0.05, 86);
  return big(
    minesite(skin)
    // Salle des machines en briques, haute cheminée ronde, chevalement d'acier
    + box(0.62, -0.25, 1.4, 0.62, 0, 34, BRICK) + courseLeft(0.62, 1.4, 0.62, 0, 34, 6, 'rgba(90,40,25,.3)') + courseRight(1.4, -0.25, 0.62, 0, 34, 6, 'rgba(70,30,20,.3)')
    + [0.72, 0.98, 1.22].map(u => archLeft(u + 0.06, 0.06, 0.62, 10, 18, '#FFE6A3', ' stroke="#FFFFFF" stroke-width="0.8"')).join('')
    + face([[0.58, -0.29, 34], [1.44, -0.29, 34], [1.44, 0.17, 44], [0.58, 0.17, 44]], '#6C7480') + face([[0.58, 0.17, 44], [1.44, 0.17, 44], [1.44, 0.66, 34], [0.58, 0.66, 34]], '#8A93A0')
    + cylinder(1.12, -0.05, 34, 86, 0.1, { top: '#5E3A2A', left: BRICK.left, right: BRICK.right }, 'sm-chim')
    + `<ellipse cx="${f2(cx)}" cy="${f2(cy)}" rx="4.6" ry="2.3" fill="#2A1E18"/>`
    + headframe(0.3, 0.2, 80, null, true)
    + barrel(0.4, 0.9, 'sm-b1') + barrel(0.62, 0.95, 'sm-b2')
  );
}

/* ---------- Palier VII : Mine des Géants ---------- */
function giantMine(skin) {
  const rock = rockOf(skin);
  // Porte colossale taillée dans la falaise : visage de géant, colonnes, torches, pioche de géant appuyée
  const [ex1, ey1] = P(-0.75, -0.3, 66);
  const [ex2, ey2] = P(-0.31, -0.3, 66);
  const [nx, ny] = P(-0.53, -0.3, 56);
  return big(
    minesite(skin, { giant: true })
    + box(-1.45, -1.45, 1.4, -0.3, 62, 80, rock)
    + archLeft(-0.53, 0.42, -0.3, 0, 50, rock.right, ` stroke="${OUT}" stroke-width="0.9"`)
    + archLeft(-0.53, 0.34, -0.295, 0, 44, '#1A1512')
    + [-1.02, -0.04].map(u => box(u - 0.07, -0.37, u + 0.07, -0.23, 0, 58, rock) + box(u - 0.09, -0.39, u + 0.09, -0.21, 58, 62, rock)).join('')
    // Visage : sourcils, yeux qui luisent, nez, barbe de pierre
    + `<path d="M${f2(ex1 - 9)},${f2(ey1 - 6)} q9,-6 18,1 M${f2(ex2 - 9)},${f2(ey2 - 5)} q9,-7 18,0" stroke="${rock.right}" stroke-width="3" fill="none" stroke-linecap="round"/>`
    + ell(ex1, ey1, 6, 3.4, '#1A1512') + ell(ex2, ey2, 6, 3.4, '#1A1512') + dot(ex1, ey1, 2, '#FFB347') + dot(ex2, ey2, 2, '#FFB347')
    + poly([[nx, ny - 9], [nx + 5, ny + 3], [nx - 5, ny + 4]], rock.right)
    + `<path d="M${f2(nx - 22)},${f2(ny + 18)} q22,22 44,-3" stroke="${rock.right}" stroke-width="2.4" fill="none"/>`
    // Pioche de géant contre la falaise, veines d'or
    + ln(P(0.75, -0.25, 0), P(0.45, -0.3, 70), WOOD_DARK.right, 5) + ln(P(0.76, -0.25, 0), P(0.46, -0.3, 70), WOOD.top, 1.4)
    + `<path d="M${f2(P(0.2, -0.3, 64)[0])},${f2(P(0.2, -0.3, 64)[1])} Q${f2(P(0.45, -0.3, 80)[0])},${f2(P(0.45, -0.3, 80)[1])} ${f2(P(0.82, -0.3, 66)[0])},${f2(P(0.82, -0.3, 66)[1])}" stroke="${IRON.left}" stroke-width="6" fill="none" stroke-linecap="round"/>`
    + [[1.4, -1.0, 50], [1.4, -0.6, 26], [-1.3, -0.3, 30], [0.2, -0.3, 22]].map(([u, v, z]) => { const [x, y] = P(u, v, z); return `<path d="M${f2(x - 6)},${f2(y)} l4,-3 l3,2 l5,-4" stroke="${GOLD.left}" stroke-width="1.6" fill="none"/>`; }).join('')
    + lampPost(-1.15, 0.05, 28) + lampPost(0.1, 0.05, 28)
    + oreHeap(0.55, 0.45, 1.6)
  );
}

export const CARRIERE_TIERS = [
  { make: gallery, lights: [[0.04, -0.23, 34, 18], [-0.35, -0.16, 26, 20]] },
  { make: shaftMine, lights: [[-0.53, -0.3, 18, 24], [1.15, 0.62, 10, 14]] },
  { make: crystalMine, lights: [[-0.53, -0.3, 18, 24], [-1.1, -0.3, 26, 16], [-0.05, -0.3, 34, 14], [1.4, -0.9, 40, 16], [0.12, 0.62, 8, 16], [-1.0, 0.3, 8, 14]] },
  { make: steamMine, lights: [[-0.53, -0.3, 18, 24], [0.78, 0.62, 18, 14], [1.04, 0.62, 18, 14], [1.28, 0.62, 18, 14]], smoke: [[1.12, -0.05, 88]] },
  { make: giantMine, lights: [[-0.75, -0.3, 66, 12], [-0.31, -0.3, 66, 12], [-1.15, 0.05, 31, 16], [0.1, 0.05, 31, 16], [-0.53, -0.3, 20, 30]] }
];
