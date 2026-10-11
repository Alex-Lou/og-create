// Carrière, paliers III à VII : Mine, Galerie, Puits de mine, Mine de cristal, Cité minière.
// Places laissées libres pour la boutique : voie de la galerie le long de u ≈ −0.35 (× 1.5 dès le palier IV, le
// wagonnet des Rails y roule), butoir au bout, lanterne à gauche, pioche et wagonnet devant.
import { ROCKS, BUILDING_BOX, pebble, crystals, rockBox, roofTexture } from '../palette.js';
import { UPGRADES } from '../buildings2.js';
import { ROCHE, cristauxChibi } from '../sprites.js';
import { INK, TRAIT, DETAIL, trait, bloc, poteau, rocher, buche, pierreRonde, spriteChibi } from '../chibi.js';
import { HIVER, snowPan, mixHex } from '../iso.js';
import {
  big, BIG_BOX, bigShadow, P, box, face, gable, disc, f2, ln, dot, ell, OUT, STONE, PLASTER, WOOD, WOOD_DARK, BRICK, IRON, GOLD, DARK_STONE,
  archLeft, barrel, crate, lampPost
} from './kit.js';

const inner = s => s.svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
const rockOf = skin => ROCKS[skin] || STONE;
const ORE = { top: '#8A8F98', left: '#6B7079', right: '#50545C' };

function oreHeap(u, v, s = 1) {
  let out = '';
  [[-0.06, -0.04, 4], [0.05, -0.05, 3.6], [0, 0.03, 4.4], [-0.08, 0.05, 3], [0.08, 0.04, 3.2], [0, -0.01, 3.4, 4]].forEach(([du, dv, r, z = 0]) => {
    const [x, y] = P(u + du * s, v + dv * s, z);
    out += ell(x + r * 0.1, y + r * 0.2, r * s, r * 0.65 * s, ORE.right) + ell(x, y, r * s, r * 0.66 * s, ORE.left)
      + ell(x - r * 0.3, y - r * 0.25, r * 0.5 * s, r * 0.3 * s, ORE.top);
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
// Wagonnet posé sur la voie (le long de v)
function cart(u, v, k = 1) {
  return box(u - 0.11 * k, v - 0.14 * k, u + 0.11 * k, v + 0.14 * k, 2, 11, { top: '#2E2A26', left: IRON.left, right: IRON.right })
    + oreHeap(u, v, 0.7 * k)
    + `<circle cx="${f2(P(u + 0.11 * k, v - 0.08 * k, 3)[0])}" cy="${f2(P(u + 0.11 * k, v - 0.08 * k, 3)[1])}" r="2.6" fill="#2A2724"/>`
    + `<circle cx="${f2(P(u + 0.11 * k, v + 0.08 * k, 3)[0])}" cy="${f2(P(u + 0.11 * k, v + 0.08 * k, 3)[1])}" r="2.6" fill="#2A2724"/>`;
}

// Puits d'aération sur le dessus de la roche (dessus à la hauteur z) : chevalet de bois et sa roue
function ventShaft(u, v, z) {
  const [vx, vy] = P(u, v, z);
  return box(u - 0.1, v - 0.08, u + 0.1, v + 0.08, z, z + 6, WOOD_DARK)
    + ln([vx - 7, vy - 2], [vx, vy - 22], WOOD.right, 1.8) + ln([vx + 7, vy - 2], [vx, vy - 22], WOOD.right, 1.8)
    + `<circle cx="${f2(vx)}" cy="${f2(vy - 20)}" r="4.6" fill="none" stroke="${WOOD_DARK.right}" stroke-width="1.4"/>`
    + dot(vx, vy - 20, 1.2, WOOD_DARK.right);
}

// Palier III : Mine. La Galerie au style chibi, sur la Mine (buildings2.js) : entrée de pierre en arc, guirlande de
// lampions (lumière du jeu en (−0.35, −0.16)), puits d'aération à roue sur le haut du rocher (sa roue est la crête
// des pièces rares), tas de minerai pailleté d'or.
function arche(uc, w, vf, h, fill, extra = '') {
  const pts = [P(uc - w, vf, 0), P(uc - w, vf, h - w * 32)];
  for (let k = 1; k < 12; k++) { const a = Math.PI - (k / 12) * Math.PI; pts.push(P(uc + Math.cos(a) * w, vf, h - w * 32 + Math.sin(a) * w * 32)); }
  pts.push(P(uc + w, vf, h - w * 32), P(uc + w, vf, 0));
  return `<polygon points="${pts.map(([x, y]) => `${f2(x)},${f2(y)}`).join(' ')}" fill="${fill}"${extra}/>`;
}
function puitsAeration(u, v, z) {
  const [vx, vy] = P(u, v, z);
  const b = (a, c) => trait(a, c, 4.2, INK) + trait(a, c, 2.4, '#B47442');
  return `<ellipse cx="${f2(vx)}" cy="${f2(vy)}" rx="9" ry="4.4" fill="#3A2A1E" stroke="${INK}" stroke-width="${TRAIT}"/>`
    + b([vx - 8, vy - 1], [vx - 1, vy - 21]) + b([vx + 8, vy - 1], [vx + 1, vy - 21]) + b([vx - 5, vy - 8], [vx + 5, vy - 8])
    + `<circle cx="${f2(vx)}" cy="${f2(vy - 20)}" r="5" fill="none" stroke="${INK}" stroke-width="3.4"/><circle cx="${f2(vx)}" cy="${f2(vy - 20)}" r="5" fill="none" stroke="#8E99A4" stroke-width="1.8"/>`
    + `<circle cx="${f2(vx)}" cy="${f2(vy - 20)}" r="1.4" fill="#55504A" stroke="${INK}" stroke-width="0.8"/>`
    + trait([vx + 2, vy - 16], [vx + 4, vy - 2], 1, '#55504A');
}
function tasMinerai(u, v, s = 1) {
  let out = '';
  [[-0.06, -0.04, 3.6], [0.05, -0.05, 3.2], [0, 0.03, 4], [-0.08, 0.05, 2.8], [0.08, 0.04, 3]].forEach(([du, dv, r]) => {
    out += pierreRonde(u + du * s, v + dv * s, r * s, { top: '#9AA0A8', left: '#6B7079', right: '#50545C' });
  });
  [[-0.03, 0, 5], [0.04, -0.02, 4], [-0.06, 0.04, 3]].forEach(([du, dv, z]) => {
    const [x, y] = P(u + du * s, v + dv * s, z * s);
    out += `<path d="M${f2(x)},${f2(y - 1.8)} l1.4,1.8 l-1.4,1.8 l-1.4,-1.8 Z" fill="#F2C04B" stroke="${INK}" stroke-width="0.5"/>`;
  });
  return out;
}
function gallery(skin) {
  const rock = skin && skin !== 'roche-cristal' ? ROCKS[skin] : ROCHE;
  const bord = ` stroke="${INK}" stroke-width="${TRAIT}" stroke-linejoin="round"`;
  let out = inner(UPGRADES.carriere(skin)) + puitsAeration(0.12, -0.6, 44);
  // Entrée : arche de pierre claire, ouverture sombre, cadre de bois, clé de voûte
  out += arche(-0.35, 0.33, -0.18, 34, rock.top, bord) + arche(-0.35, 0.2, -0.175, 25, '#241E1A', bord);
  // joints des pierres de voûte, en rayons entre l'arc intérieur et l'arc extérieur
  for (let k = 1; k < 6; k++) {
    const a = Math.PI - (k / 6) * Math.PI;
    const p0 = P(-0.35 + Math.cos(a) * 0.2, -0.177, 25 - 0.2 * 32 + Math.sin(a) * 0.2 * 32),
      p1 = P(-0.35 + Math.cos(a) * 0.33, -0.18, 34 - 0.33 * 32 + Math.sin(a) * 0.33 * 32);
    out += trait(p0, p1, DETAIL, INK);
  }
  [8, 16].forEach(z => { out += trait(P(-0.68, -0.18, z), P(-0.55, -0.18, z), DETAIL, INK) + trait(P(-0.15, -0.18, z), P(-0.02, -0.18, z), DETAIL, INK); });
  const [kx, ky] = P(-0.35, -0.17, 30);
  out += `<path d="M${f2(kx - 3.4)},${f2(ky - 4)} L${f2(kx + 3.4)},${f2(ky - 4)} L${f2(kx + 2.4)},${f2(ky + 3)} L${f2(kx - 2.4)},${f2(ky + 3)} Z" fill="${rock.left}"${bord}/>`
    + [-0.53, -0.17].map(u => trait(P(u, -0.17, 0), P(u, -0.17, 17), 5, INK) + trait(P(u, -0.17, 0), P(u, -0.17, 17), 3.2, '#9E6538')).join('')
    + trait(P(-0.56, -0.17, 17), P(-0.14, -0.17, 17), 5, INK) + trait(P(-0.56, -0.17, 17), P(-0.14, -0.17, 17), 3.2, '#B47442');
  // Guirlande de lampions le long de la voûte
  const lamp = [[-0.6, 22], [-0.47, 28], [-0.23, 28], [-0.1, 22]].map(([u, z]) => P(u, -0.16, z));
  out += `<polyline points="${lamp.map(([x, y]) => `${f2(x)},${f2(y)}`).join(' ')}" fill="none" stroke="#3D3A36" stroke-width="0.8"/>`
    + lamp.map(([x, y]) => `<circle cx="${f2(x)}" cy="${f2(y + 2.6)}" r="2.2" fill="#FFD27A" stroke="${INK}" stroke-width="${DETAIL}"/><circle cx="${f2(x - 0.6)}" cy="${f2(y + 2)}" r="0.7" fill="#FFF6D6"/>`).join('');
  out += tasMinerai(0.58, 0.5, 1.2);
  return spriteChibi(out, BUILDING_BOX);
}

// Grand carreau de mine (paliers IV à VII) : falaise, galerie, voie, minerai
function minesite(skin, { portalTall = 36, giant = false } = {}) {
  const rock = rockOf(skin);
  const cliff = rockBox(-1.45, -1.45, 1.4, -0.3, 0, 62, rock) + rockBox(0.55, -0.3, 1.4, 0.15, 0, 30, rock);
  const portal = giant ? '' : archLeft(-0.53, 0.3, -0.3, 0, portalTall, WOOD_DARK.left, ` stroke="${OUT}" stroke-width="0.8"`)
    + archLeft(-0.53, 0.24, -0.295, 0, portalTall - 5, '#1F1A17')
    + box(-0.86, -0.32, -0.8, -0.26, 0, portalTall, WOOD_DARK) + box(-0.26, -0.32, -0.2, -0.26, 0, portalTall, WOOD_DARK);
  // Sous le skin « veines de cristal », des cristaux affleurent sur la falaise, le gradin et son dessus
  const veins = skin === 'roche-cristal'
    ? [[-1.25, -0.3, 34, 1.4], [-0.1, -0.3, 44, 1.2], [0.95, -0.3, 22, 1.25], [1.4, 0.0, 12, 1.1]].map(([u, v, z, k]) => crystals(u, v, z, k)).join('')
      + [[-0.95, -1.15, 62, 1.8], [0.35, -1.0, 62, 1.5], [1.1, -0.1, 30, 1.4]]
        .map(([u, v, z, k]) => crystals(u, v, z, k) + crystals(u + 0.07, v + 0.04, z, k * 0.65)).join('')
    : '';
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
    out += `<circle cx="${f2(tx + dx)}" cy="${f2(ty - 7 + dy)}" r="6.5" fill="none" stroke="${iron ? '#41484F' : WOOD_DARK.right}" stroke-width="1.6"/>`
      + dot(tx + dx, ty - 7 + dy, 1.4, iron ? '#41484F' : WOOD_DARK.right)
      + [0, 1, 2].map(k => {
        const a = k * 1.05;
        return ln([tx + dx - Math.cos(a) * 6, ty - 7 + dy - Math.sin(a) * 6], [tx + dx + Math.cos(a) * 6, ty - 7 + dy + Math.sin(a) * 6],
          iron ? '#41484F' : WOOD_DARK.right, 0.6);
      }).join('');
  });
  return out + ln([tx - 5, ty - 1], [bx - 2, by - 2], '#3D3A36', 0.6) + ln([tx + 5, ty - 3], [bx + 2, by - 3], '#3D3A36', 0.6);
}

// Palier IV : Galerie. Même carreau que minesite (falaise, gradin, deux entrées, deux voies, wagonnets, tas de
// minerai) en gros rochers arrondis ; mêmes lumières, même roue du puits d'aération (crête des pièces rares), voie et
// wagonnet aux places de la boutique.
const BORD = ` stroke="${INK}" stroke-width="${TRAIT}" stroke-linejoin="round"`;
const mousse = (u, v, z, k = 1) => {
  if (HIVER) return '';
  const [x, y] = P(u, v, z);
  return `<path d="M${f2(x - 7 * k)},${f2(y + 1)} q${f2(2 * k)},${f2(-4 * k)} ${f2(5.6 * k)},${f2(-2.8 * k)} q${f2(2.4 * k)},${f2(-3 * k)} ${f2(5.8 * k)},${f2(-0.4 * k)} q${f2(2.4 * k)},${f2(0.6 * k)} ${f2(1.4 * k)},${f2(2.6 * k)} q${f2(-1 * k)},${f2(1.4 * k)} ${f2(-3.4 * k)},${f2(1.2 * k)} Z" fill="#8CC968" stroke="${INK}" stroke-width="${DETAIL}" stroke-linejoin="round"/>`;
};
// Entrée de galerie sur la face avant de la falaise (plan v = vf), centre uc, échelle k : arche de pierre, joints de
// voûte, clé, ouverture sombre, cadre de bois
function entree(uc, vf, k, rock) {
  const wo = 0.33 * k, wi = 0.2 * k, ho = 34 * k, hi = 25 * k;
  let out = arche(uc, wo, vf, ho, rock.top, BORD) + arche(uc, wi, vf + 0.005, hi, '#241E1A', BORD);
  for (let i = 1; i < 6; i++) {
    const a = Math.PI - (i / 6) * Math.PI;
    out += trait(P(uc + Math.cos(a) * wi, vf + 0.003, hi - wi * 32 + Math.sin(a) * wi * 32),
      P(uc + Math.cos(a) * wo, vf, ho - wo * 32 + Math.sin(a) * wo * 32), DETAIL);
  }
  [0.3, 0.6].forEach(t => {
    out += trait(P(uc - wo, vf, hi * t), P(uc - wi, vf, hi * t), DETAIL) + trait(P(uc + wi, vf, hi * t), P(uc + wo, vf, hi * t), DETAIL);
  });
  // clé de voûte au milieu de l'arc (entre l'arc intérieur et l'arc extérieur)
  const [kx, ky] = P(uc, vf + 0.01, (ho + hi) / 2);
  const kh = (ho - hi) / 2 - 0.5;
  out += `<path d="M${f2(kx - 3 * k)},${f2(ky - kh)} L${f2(kx + 3 * k)},${f2(ky - kh)} L${f2(kx + 2 * k)},${f2(ky + kh)} L${f2(kx - 2 * k)},${f2(ky + kh)} Z" fill="${rock.left}" stroke="${INK}" stroke-width="${DETAIL}" stroke-linejoin="round"/>`;
  const zl = 17 * k, ua = uc - 0.18 * k, ub = uc + 0.18 * k;
  const bois = (a, b, c) => trait(a, b, 5, INK) + trait(a, b, 3.2, c);
  return out + bois(P(ua, vf + 0.01, 0), P(ua, vf + 0.01, zl), '#9E6538') + bois(P(ub, vf + 0.01, 0), P(ub, vf + 0.01, zl), '#9E6538')
    + bois(P(ua - 0.03, vf + 0.01, zl), P(ub + 0.03, vf + 0.01, zl), '#B47442');
}
// Voie le long de v, centrée en uc, de v0 à v1, échelle k
function voie(uc, v0, v1, k, id) {
  let out = '';
  for (let v = v0 + 0.06, i = 0; v < v1; v += 0.17 * k, i++) out += bloc(uc - 0.17 * k, v - 0.03, uc + 0.17 * k, v + 0.03, 0, 1.8,
    { top: '#B98552', left: '#9E6538', right: '#7A4824' }, `${id}${i}`, 1.1);
  [-0.1 * k, 0.1 * k].forEach(du => {
    const a = P(uc + du, v0, 1.8), b = P(uc + du, v1, 1.8);
    out += trait(a, b, 3.4, INK) + trait(a, b, 1.6, '#B8C2CA') + trait([a[0], a[1] - 0.5], [b[0], b[1] - 0.5], 0.6, '#EEF3F6');
  });
  return out;
}
// Wagonnet de minerai sur la voie, centré en (u, v), échelle k (celui de la Mine)
function wagon(u, v, k, id) {
  const su = 0.15 * k, sv = 0.135 * k, z1 = 3 + 10 * k;
  const [wx, wy] = P(u, v + sv, 0);
  let out = `<ellipse cx="${f2(wx)}" cy="${f2(wy + 1)}" rx="${f2(13 * k)}" ry="${f2(5 * k)}" fill="rgba(90,60,30,.22)"/>`
    + bloc(u - su, v - sv, u + su, v + sv, 3, z1, { top: '#3A332E', left: '#C98448', right: '#9E5F30' }, id)
    + trait(P(u - su, v + sv, z1 - 5 * k), P(u + su, v + sv, z1 - 5 * k), 1.6, '#6E7880')
    + trait(P(u + su, v + sv, z1 - 5 * k), P(u + su, v - sv, z1 - 5 * k), 1.6, '#5A646C');
  [[u - su * 0.6, v + sv], [u + su * 0.6, v + sv], [u + su, v - sv * 0.6]].forEach(([a, b]) => {
    const [x, y] = P(a, b, 3);
    out += `<circle cx="${f2(x)}" cy="${f2(y)}" r="${f2(3.2 * k)}" fill="#4A4440" stroke="${INK}" stroke-width="${DETAIL}"/><circle cx="${f2(x)}" cy="${f2(y)}" r="${f2(1.1 * k)}" fill="#A9B4BD"/>`;
  });
  [[-0.07, -0.03, 3.2], [0.05, 0.04, 2.8], [0.01, -0.06, 2.4]].forEach(([du, dv, r]) => {
    const [x, y] = P(u + du * k, v + dv * k, z1);
    out += `<ellipse cx="${f2(x)}" cy="${f2(y - r * 0.4 * k)}" rx="${f2(r * k)}" ry="${f2(r * 0.75 * k)}" fill="#6B7079" stroke="${INK}" stroke-width="${DETAIL}"/><circle cx="${f2(x - r * 0.2 * k)}" cy="${f2(y - r * 0.6 * k)}" r="0.9" fill="#F2C04B"/>`;
  });
  return out;
}
// Lanterne sur son poteau de bois (lumière du jeu à la hauteur h)
function lanterne(u, v, h, id) {
  const [lx, ly] = P(u, v, h);
  return poteau(u, v, 0, h, 0.03, { top: '#B07A48', left: '#9A6236', right: '#764522' }, id)
    + `<path d="M${f2(lx - 4)},${f2(ly - 1)} L${f2(lx - 3.4)},${f2(ly - 8)} L${f2(lx + 3.4)},${f2(ly - 8)} L${f2(lx + 4)},${f2(ly - 1)} Z" fill="#FFE08A"${BORD}/>`
    + `<path d="M${f2(lx - 4.6)},${f2(ly - 8)} L${f2(lx)},${f2(ly - 11.5)} L${f2(lx + 4.6)},${f2(ly - 8)} Z" fill="#3D3A36"${BORD}/>`
    + `<ellipse cx="${f2(lx - 0.8)}" cy="${f2(ly - 4.6)}" rx="1.2" ry="2" fill="#FFFDF0"/>`;
}
function galleries(skin) {
  const rock = skin && skin !== 'roche-cristal' ? ROCKS[skin] : ROCHE;
  const cristal = skin === 'roche-cristal';
  const eclat = { top: mixHex(rock.top, '#FFFFFF', 0.2), left: rock.left, right: rock.right };
  let out = disc(-0.05, -0.2, 0, 1.6, 'rgba(120,85,45,.18)');
  [[-1.5, 0.0, 3.6], [1.42, 0.45, 3], [-1.2, 1.15, 3.2], [0.62, 0.92, 2.6]].forEach(([u, v, s]) => { out += pierreRonde(u, v, s, eclat); });
  // La falaise : une large assise, un gros bloc en retrait dessus (le puits d'aération s'y pose), le gradin à droite
  out += rocher(-1.45, -1.45, 1.4, -0.3, 0, 46, rock, 'g4a', 8) + rocher(-1.35, -1.4, 0.85, -0.62, 46, 62, rock, 'g4b', 7)
    + mousse(-0.3, -0.8, 62, 1.2) + mousse(0.6, -0.45, 46) + mousse(1.2, -0.9, 46, 0.9)
    + (cristal ? cristauxChibi(-1.15, -0.32, 30, 1.2) + cristauxChibi(0.2, -0.9, 62, 1.3) + cristauxChibi(1.1, -0.55, 46) : '')
    + entree(-0.53, -0.29, 1.15, rock) + entree(0.12, -0.29, 0.78, rock);
  // Guirlande de lampions sous la grande voûte
  const lamp = [[-0.85, 26], [-0.68, 33], [-0.38, 33], [-0.21, 26]].map(([u, z]) => P(u, -0.27, z));
  out += `<polyline points="${lamp.map(([x, y]) => `${f2(x)},${f2(y)}`).join(' ')}" fill="none" stroke="#3D3A36" stroke-width="0.8"/>`
    + lamp.map(([x, y]) => `<circle cx="${f2(x)}" cy="${f2(y + 2.6)}" r="2.2" fill="#FFD27A" stroke="${INK}" stroke-width="${DETAIL}"/><circle cx="${f2(x - 0.6)}" cy="${f2(y + 2)}" r="0.7" fill="#FFF6D6"/>`).join('');
  // Gradin à droite et ses étais de bois empilés (moins large que celui de minesite : il laisse voir la seconde entrée)
  out += rocher(0.72, -0.3, 1.4, 0.02, 0, 30, rock, 'g4c', 6) + (cristal ? cristauxChibi(1.22, -0.06, 30, 0.9) : '')
    + buche(0.86, -0.2, 1.3, -0.2, 30, 3) + buche(0.86, -0.08, 1.3, -0.08, 30, 3) + buche(0.88, -0.14, 1.28, -0.14, 35.4, 3);
  out += puitsAeration(-0.95, -0.95, 62);
  out += voie(-0.53, -0.3, 1.18, 1.5, 'g4v') + voie(0.12, -0.3, 0.36, 1.2, 'g4w')
    + tasMinerai(-1.05, 0.15, 1.6) + lanterne(-0.12, 0.02, 30, 'g4l')
    + wagon(0.12, 0.08, 1.05, 'g4w2') + wagon(-0.53, 0.88, 1.15, 'g4w1')
    + tasMinerai(0.15, 0.55, 1.4);
  return spriteChibi(out, BIG_BOX);
}

// Palier V : Puits de mine (cabane du treuil, puis le chevalement de fer au-dessus du puits)
function shaftMine(skin) {
  return big(
    minesite(skin)
    + box(0.95, 0.2, 1.38, 0.62, 0, 22, WOOD) + face([[0.95, 0.62, 0], [1.38, 0.62, 0], [1.38, 0.62, 22], [0.95, 0.62, 22]], WOOD.left)
    + face([[1.08, 0.62, 0], [1.22, 0.62, 0], [1.22, 0.62, 14], [1.08, 0.62, 14]], '#3A2A1E')
    + face([[0.91, 0.16, 22], [1.42, 0.16, 22], [1.42, 0.41, 30], [0.91, 0.41, 30]], '#5C6880')
    + face([[0.91, 0.41, 30], [1.42, 0.41, 30], [1.42, 0.66, 22], [0.91, 0.66, 22]], '#7D8AA0')
    + ventShaft(-0.95, -0.95, 62)
    + headframe(0.5, 0.15, 78, IRON, true)
    + barrel(1.25, 0.82, 'pm-b1') + crate(0.92, 0.85, 0.11, 9)
  );
}

// Palier VI : Mine de cristal
const crystalCluster = (u, v, z, s) => crystals(u, v, z, s) + crystals(u + 0.08, v + 0.04, z, s * 0.7);
function crystalMine(skin) {
  return big(
    minesite(skin)
    // Veines de cristal qui affleurent sur la falaise et sur le dessus
    + [[-1.1, -0.3, 20, 1.3], [-0.05, -0.3, 30, 1.1], [0.35, -0.3, 14, 0.9], [1.4, -0.9, 34, 1.2], [1.4, -0.5, 18, 0.9]]
      .map(([u, v, z, s]) => crystalCluster(u, v, z, s)).join('')
    + [[-0.9, -1.0, 62, 1.6], [0.2, -0.9, 62, 1.9], [0.9, -0.7, 62, 1.4], [1.0, -0.05, 30, 1.2]].map(([u, v, z, s]) => crystalCluster(u, v, z, s)).join('')
    + headframe(0.5, 0.15, 74, { top: '#B9A0F0', left: '#9C82DE', right: '#7A60C0' })
    + crystalCluster(0.12, 0.62, 0, 1.4) + crystalCluster(-1.0, 0.3, 0, 1.2)
    + box(0.95, 0.2, 1.38, 0.62, 0, 22, WOOD) + face([[1.08, 0.62, 0], [1.22, 0.62, 0], [1.22, 0.62, 14], [1.08, 0.62, 14]], '#3A2A1E')
    + face([[0.91, 0.16, 22], [1.42, 0.16, 22], [1.42, 0.41, 30], [0.91, 0.41, 30]], '#7A60C0')
    + face([[0.91, 0.41, 30], [1.42, 0.41, 30], [1.42, 0.66, 22], [0.91, 0.66, 22]], '#9C82DE')
  );
}

// Palier VII : Cité minière
// Maisonnette de mineur : murs, toit à deux pans, porte, fenêtre, cheminée ; posée à z (sur un gradin)
function cottage(u0, v0, u1, v1, z, roof, wall = PLASTER) {
  const h = 16;
  const um = (u0 + u1) / 2;
  return box(u0, v0, u1, v1, z, z + h, wall)
    + face([[um - 0.06, v1, z], [um + 0.04, v1, z], [um + 0.04, v1, z + 10], [um - 0.06, v1, z + 10]], '#7A4E2C')
    + face([[u1, (v0 + v1) / 2 - 0.05, z + 6], [u1, (v0 + v1) / 2 + 0.05, z + 6],
      [u1, (v0 + v1) / 2 + 0.05, z + 12], [u1, (v0 + v1) / 2 - 0.05, z + 12]], '#FFE6A3')
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
  {
    make: crystalMine,
    lights: [[-0.53, -0.3, 18, 24], [-1.1, -0.3, 26, 16], [-0.05, -0.3, 34, 14], [1.4, -0.9, 40, 16], [0.12, 0.62, 8, 16], [-1.0, 0.3, 8, 14]]
  },
  {
    make: miningTown,
    lights: [[-0.53, -0.3, 18, 24], [-0.12, 0.02, 31, 16], [0.55, 0.85, 27, 16], [1.06, 0.49, 9, 12], [1.42, 0.49, 9, 12],
      [1.32, -0.08, 39, 12], [-1.0, -1.22, 71, 10], [-0.05, -1.24, 71, 10]],
    smoke: [[0.89, -0.17, 62], [0.81, 0.39, 32], [1.19, 0.39, 32]]
  }
];
