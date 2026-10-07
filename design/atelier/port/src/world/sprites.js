// Sprites de l'île, dessinés en SVG sur la géométrie isométrique commune (world/iso.js).
// Bâtiments : emprise de 2 × 2 cases (u, v ∈ [-1, 1]), ancrés au centre de l'emprise.
// Nature : emprise d'une case (u, v ∈ [-0.5, 0.5]), ancrée au centre de la case.
// Les parties animées (flamme, fumée, eau, voile) sont des sprites à part, peints image par image par l'île.
import { P, TW, TH, face, box, gable, pyramid, disc, cylinder, shadow, foliage, sprite, boulder, EDGE } from './iso.js';
import {
  WOOD, WOOD_DARK, STONE, BRICK, SOIL, ROOF_RED, THATCH, LEAVES, PINE, INK, BUILDING_BOX, PROP_BOX,
  pebble, doorLeft, windowRight, planksLeft, planksRight, roundTree,
  WHITE_STONE, WHITE_WOOD, ROCKS, FOLIAGE, SAILS, roofOf, roofTexture, stoneCourses, seasonDots, crystals, rockBox, stoneRing, pool
} from './palette.js';

const f2 = n => Math.round(n * 100) / 100;
const ln = (a, b, color, w = 1.2) => `<line x1="${f2(a[0])}" y1="${f2(a[1])}" x2="${f2(b[0])}" y2="${f2(b[1])}" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/>`;
const ell = (x, y, rx, ry, fill) => `<ellipse cx="${f2(x)}" cy="${f2(y)}" rx="${rx}" ry="${ry}" fill="${fill}"/>`;

/* ---------- Bâtiments ---------- */
// Cercle de pierres d'un feu de camp autour de (u, v), braises et bûches croisées (la flamme est animée à part) ; s : taille
function fireRing(u, v, s = 1) {
  let stones = '';
  // Pierres de l'arrière d'abord : l'ordre de peinture fait l'occlusion
  const ring = Array.from({ length: 9 }, (_, k) => {
    const a = (k / 9) * Math.PI * 2;
    return { u: u + Math.cos(a) * 0.36 * s, v: v + Math.sin(a) * 0.36 * s };
  }).sort((p, q) => p.u + p.v - (q.u + q.v));
  ring.forEach(p => { stones += pebble(p.u, p.v, 5.2 * s); });
  const logs = box(u - 0.24 * s, v - 0.04 * s, u + 0.24 * s, v + 0.04 * s, 0, 5 * s, WOOD_DARK) + box(u - 0.04 * s, v - 0.24 * s, u + 0.04 * s, v + 0.24 * s, 0, 5 * s, WOOD);
  const embers = disc(u, v, 0.5, 0.2 * s, '#5C3A24') + disc(u, v, 1, 0.12 * s, '#F28A3A', ' opacity=".85"');
  return stones + embers + logs;
}

// Foyer, niveau 1 : feu de camp dans un cercle de pierres, une bûche pour s'asseoir (la flamme est animée à part)
function campfire() {
  const seat = shadow(0.62, -0.5, 0.3, 0.18) + box(0.42, -0.6, 0.82, -0.44, 0, 7, WOOD);
  const stump = shadow(-0.55, 0.55, 0.2, 0.18) + cylinder(-0.55, 0.55, 0, 9, 0.14, { top: '#E7C08A', left: WOOD.left, right: WOOD.right }, 'stumpg');
  return sprite(shadow(0, 0, 0.6, 0.16) + seat + fireRing(0, 0) + stump, BUILDING_BOX);
}

// Foyer, niveau 2 : l'Abri. Perches croisées en A, couvertes de branchages (de toile teinte, selon le skin), pignon
// ouvert sur une couche de fourrures ; le feu de camp brûle devant (flamme animée à part, en SHELTER_FIRE)
export const SHELTER_FIRE = [0.5, 0.36];
const BRUSH = { front: '#B5A16A', back: '#8A7446' };
function shelter(skin) {
  const u0 = -0.72, u1 = 0.24, v0 = -0.86, v1 = -0.04, z = 1, h = 36, o = 0.1;
  const vm = (v0 + v1) / 2;
  const a = u0 - o, b = u1 + o;
  const roof = roofOf(skin, BRUSH);
  // Perches croisées au bout d'un pignon (elles dépassent du faîtage)
  const poles = u => ln(P(u, v0 - o - 0.04, z - 1), P(u, vm + 0.14, z + h + 9), WOOD_DARK.right, 1.8) + ln(P(u, v1 + o + 0.04, z - 1), P(u, vm - 0.14, z + h + 9), WOOD_DARK.right, 1.8);
  // Branchages d'origine : brins feuillus sur le pan avant
  const at = (u, k) => P(u, vm + (v1 + o - vm) * k, z + h * (1 - k));
  let brush = '';
  if (!skin) {
    for (let k = 0.16; k < 1; k += 0.2) {
      for (let u = a + 0.04; u < b - 0.04; u += 0.1) {
        const j = Math.sin(u * 53 + k * 29) * 0.03;
        brush += ln(at(u + j, k - 0.12), at(u + j + 0.05, k + 0.06), k > 0.5 ? '#6E7F3E' : '#7E6A3C', 1.1);
      }
    }
  }
  const [fx, fy] = P(u1 - 0.18, vm + 0.02, 1);
  return sprite(
    shadow(-0.1, -0.3, 1.0, 0.18) + disc(0.05, 0.1, 0, 0.75, 'rgba(150,120,80,.18)')
    + poles(a)
    + face([[a, v0 - o, z], [b, v0 - o, z], [b, vm, z + h], [a, vm, z + h]], roof.back, EDGE)
    // Pignon ouvert : l'intérieur dans l'ombre, la couche de fourrures, un ballot
    + face([[u1, v0, z], [u1, v1, z], [u1, vm, z + h]], '#3B2A1C', EDGE)
    + ell(fx, fy, 11, 4.2, '#C9A27A') + ell(fx - 2, fy - 1, 7, 2.6, '#E3C9A4')
    + ell(fx + 6, fy - 4, 4, 3, '#8C5A3C')
    + face([[a, vm, z + h], [b, vm, z + h], [b, v1 + o, z], [a, v1 + o, z]], roof.front, EDGE)
    + brush
    + ln(P(a - 0.06, vm, z + h + 1), P(b + 0.06, vm, z + h + 1), WOOD_DARK.left, 2.2)
    + poles(b)
    // Bûche pour s'asseoir
    + shadow(-0.4, 0.42, 0.2, 0.16) + box(-0.58, 0.36, -0.24, 0.48, 0, 6, WOOD)
    + shadow(SHELTER_FIRE[0], SHELTER_FIRE[1], 0.34, 0.14) + fireRing(SHELTER_FIRE[0], SHELTER_FIRE[1], 0.62),
    BUILDING_BOX
  );
}

// Foyer, niveau 3 : la Cabane. Cabane de planches, toit de chaume, cheminée de pierre, bois rangé le long du mur
export const CABIN_CHIMNEY = [0.3, -0.27];
function hut(skin) {
  const u0 = -0.55, u1 = 0.55, v0 = -0.45, v1 = 0.45, h = 26;
  const roof = roofOf(skin, THATCH);
  const thatch = !skin;
  const [cu, cv] = CABIN_CHIMNEY;
  const logs = Array.from({ length: 7 }, (_, k) => {
    const [x, y] = P(-0.5 + (k % 4) * 0.08 + (k >= 4 ? 0.04 : 0), v1 + 0.08, 3 + (k >= 4 ? 5 : 0));
    return `<circle cx="${x}" cy="${y}" r="2.8" fill="${WOOD.top}" stroke="${WOOD_DARK.right}" stroke-width="0.8"/>`;
  }).join('');
  return sprite(
    shadow(0, 0, 0.95)
    + box(u0, v0, u1, v1, 0, h, WOOD)
    + planksLeft(u0, u1, v1, 0, h) + planksRight(u1, v0, v1, 0, h)
    + doorLeft(-0.12, 0.16, v1, 17)
    + windowRight(u1, -0.22, 0.08, 10, 18)
    // Cheminée de pierre derrière le faîtage (le toit en cache le bas)
    + box(cu - 0.09, cv - 0.09, cu + 0.09, cv + 0.09, h, h + 34, STONE)
    + gable(u0, v0, u1, v1, h, 24, { front: roof.front, back: roof.back, gable: WOOD.right }, 0.12)
    + roofTexture(skin, u0, v0, u1, v1, h, 24, 0.12)
    // Mèches de chaume sur le bord du pan avant (toit d'origine)
    + (thatch ? `<polyline points="${[P(-0.67, 0.57, h), P(0.67, 0.57, h)].map(p => p.join(',')).join(' ')}" stroke="#B88A3A" stroke-width="1.6" stroke-dasharray="2 3"/>` : '')
    // Bois rangé contre le mur avant, à gauche de la porte
    + box(-0.56, v1 + 0.02, -0.2, v1 + 0.14, 0, 1.5, WOOD_DARK) + logs,
    BUILDING_BOX
  );
}

// Carrière, niveau 1 : la Fissure. Un pan de roche fendu de haut en bas, une lueur au fond de la fente, des éclats
// tombés au pied, une pioche plantée et un piquet à ruban qui marque l'endroit
function fissure(skin) {
  const rock = ROCKS[skin] || STONE;
  const crack = [[-0.3, 0], [-0.22, 0], [-0.25, 9], [-0.19, 17], [-0.24, 26], [-0.2, 33], [-0.23, 40], [-0.27, 40], [-0.26, 33], [-0.3, 25], [-0.26, 16], [-0.32, 8]];
  const glint = (u, z, c) => { const [x, y] = P(u, -0.2, z); return `<path d="M${f2(x)},${f2(y - 2)} l1.2,2 l-1.2,2 l-1.2,-2 Z" fill="${c}"/>`; };
  const [px, py] = P(-0.58, 0.18, 0);
  const [sx, sy] = P(0.5, 0.32, 0);
  return sprite(
    shadow(0, -0.2, 1.1, 0.18)
    + rockBox(-0.95, -0.9, 0.6, -0.2, 0, 40, rock)
    + rockBox(0.3, -0.2, 0.82, 0.12, 0, 16, rock)
    // La fente : sur la face avant, puis le long du dessus vers l'arrière
    + face(crack.map(([u, z]) => [u, -0.2, z]), '#1F1A17')
    + glint(-0.25, 12, '#F2C04B') + glint(-0.23, 24, skin === 'roche-cristal' ? '#B9A0F0' : '#FFE9A8')
    + `<polyline points="${[P(-0.25, -0.2, 40), P(-0.21, -0.4, 40), P(-0.27, -0.6, 40), P(-0.22, -0.9, 40)].map(q => q.map(f2).join(',')).join(' ')}" stroke="#1F1A17" stroke-width="2" fill="none" stroke-linejoin="round"/>`
    + (skin === 'roche-cristal' ? crystals(-0.6, -0.55, 40, 1.1) + crystals(0.3, -0.6, 40) + crystals(0.6, -0.05, 16, 0.8) : '')
    // Éclats tombés au pied de la fente
    + pebble(-0.3, 0.02, 3.4, rock) + pebble(-0.14, 0.1, 2.6, rock) + pebble(-0.42, 0.12, 2.2, rock) + pebble(-0.06, -0.04, 2, rock)
    // Pioche plantée, piquet à ruban
    + ln([px, py], [px + 6, py - 20], WOOD.right, 2.4)
    + `<path d="M${f2(px - 5)},${f2(py - 16)} Q${f2(px + 5)},${f2(py - 25)} ${f2(px + 16)},${f2(py - 18)}" stroke="#7C8A96" stroke-width="2.6" fill="none" stroke-linecap="round"/>`
    + shadow(0.5, 0.32, 0.08, 0.2) + ln([sx, sy], [sx, sy - 22], WOOD_DARK.left, 1.8)
    + `<path d="M${f2(sx)},${f2(sy - 21)} q5,1 9,-2 q-3,3 -1,6 q-4,-2 -8,-1 Z" fill="#E2574C"/>`,
    BUILDING_BOX
  );
}

// Carrière, niveau 2 : affleurement rocheux taillé en gradins, blocs extraits, pioche ; une voie (u ≈ −0.35) mène du
// front de taille au wagonnet (les Rails de la boutique la prolongent)
function quarry(skin) {
  const rockColor = ROCKS[skin] || STONE;
  const rock = (u0, v0, u1, v1, h) => rockBox(u0, v0, u1, v1, 0, h, rockColor);
  const pick = `<line x1="${P(0.55, 0.3, 0)[0]}" y1="${P(0.55, 0.3, 0)[1]}" x2="${P(0.55, 0.3, 22)[0] - 4}" y2="${P(0.55, 0.3, 22)[1]}" stroke="${WOOD.right}" stroke-width="2.4" stroke-linecap="round"/>`
    + `<path d="M${P(0.55, 0.3, 22)[0] - 13},${P(0.55, 0.3, 22)[1] + 3} Q${P(0.55, 0.3, 22)[0] - 4},${P(0.55, 0.3, 22)[1] - 5} ${P(0.55, 0.3, 22)[0] + 6},${P(0.55, 0.3, 22)[1] + 3}" stroke="#7C8A96" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
  let rails = '';
  for (let k = 0; k < 6; k++) rails += box(-0.5, -0.12 + k * 0.17 - 0.02, -0.2, -0.12 + k * 0.17 + 0.02, 0, 1.5, WOOD_DARK);
  rails += ln(P(-0.45, -0.18, 1.5), P(-0.45, 0.8, 1.5), '#7C8894') + ln(P(-0.25, -0.18, 1.5), P(-0.25, 0.8, 1.5), '#7C8894');
  const cart = shadow(-0.35, 0.6, 0.26, 0.2)
    + box(-0.5, 0.45, -0.2, 0.72, 2, 12, WOOD_DARK)
    + disc(-0.47, 0.72, 3, 0.07, '#3D3A36') + disc(-0.23, 0.72, 3, 0.07, '#3D3A36')
    + pebble(-0.4, 0.55, 3.6, rockColor) + pebble(-0.3, 0.62, 3.2, rockColor);
  return sprite(
    shadow(0, 0, 1.15, 0.18)
    + rock(-0.9, -0.9, 0.2, -0.2, 40)
    + rock(0.2, -0.9, 0.85, -0.35, 28)
    + rock(-0.9, -0.2, -0.55, 0.25, 22)
    + rock(-0.1, -0.2, 0.4, 0.2, 12)
    + rockBox(0.45, -0.1, 0.75, 0.15, 0, 9, rockColor) + rockBox(0.5, 0.18, 0.78, 0.42, 0, 7, rockColor)
    + (skin === 'roche-cristal' ? crystals(-0.35, -0.55, 40, 1.1) + crystals(0.5, -0.62, 28) + crystals(-0.75, 0.05, 22, 0.8) : '')
    + rails + cart + pick,
    BUILDING_BOX
  );
}

// Bosquet : trois arbres ronds de tailles différentes
function grove(skin) {
  const colors = FOLIAGE[skin] || LEAVES;
  const tree = (u, v, sc) => {
    const [x, y] = P(u, v, 0);
    return roundTree(u, v, sc, colors) + seasonDots(skin, x, y - 34 * sc, 12 * sc) + seasonDots(skin, x - 7 * sc, y - 24 * sc, 10 * sc);
  };
  return sprite(tree(-0.45, -0.4, 1.1) + tree(0.45, -0.35, 0.95) + tree(0, 0.4, 1.2), BUILDING_BOX);
}

// Puits : margelle de pierre, eau sombre, deux montants, petit toit, treuil et seau
function well(skin) {
  const roof = roofOf(skin, ROOF_RED);
  return sprite(
    shadow(0, 0, 0.75)
    + box(-0.42, -0.06, -0.34, 0.06, 0, 40, WOOD_DARK)
    + stoneRing(0, 0, 0, 16, 0.36, skin === 'pierre-blanche' ? WHITE_STONE : STONE, 'wellg', 2)
    + pool(0, 0, 16, 0.26, '#2F5E7A', '#4C8DB0')
    + box(0.34, -0.06, 0.42, 0.06, 0, 40, WOOD_DARK)
    // Treuil (axe le long de u) et corde
    + box(-0.38, -0.025, 0.38, 0.025, 31, 34, WOOD)
    + `<line x1="${P(0, 0, 32)[0]}" y1="${P(0, 0, 32)[1]}" x2="${P(0, 0, 22)[0]}" y2="${P(0, 0, 22)[1]}" stroke="#7A5A3A" stroke-width="1.2"/>`
    + cylinder(0, 0, 16, 22, 0.08, { top: '#B98552', left: WOOD.left, right: WOOD.right }, 'bucketg')
    + gable(-0.5, -0.28, 0.5, 0.28, 40, 14, { front: roof.front, back: roof.back, gable: WOOD_DARK.right }, 0.06)
    + roofTexture(skin, -0.5, -0.28, 0.5, 0.28, 40, 14, 0.06),
    BUILDING_BOX
  );
}

// Potager : planche de terre labourée en sillons, pousses et fanes, petite clôture au fond
// Clôture du fond du Potager selon le skin : bois, blanche, muret de pierre, fleurie
export function gardenFence(skin) {
  if (skin === 'cloture-pierre') {
    let wall = '';
    for (let k = 0; k < 6; k++) {
      const u = -0.9 + k * 0.3;
      wall += box(u, -0.96, u + 0.29, -0.86, 0, 7 + (k % 2), STONE);
    }
    return wall;
  }
  const wood = skin === 'cloture-blanche' ? WHITE_WOOD : WOOD;
  let fence = '';
  for (let k = 0; k <= 6; k++) {
    const u = -0.9 + k * 0.3;
    fence += box(u - 0.025, -0.95, u + 0.025, -0.9, 0, 12, wood);
  }
  fence += box(-0.9, -0.94, 0.9, -0.91, 8, 10, wood) + box(-0.9, -0.94, 0.9, -0.91, 3, 5, wood);
  if (skin === 'cloture-fleurie') {
    for (let k = 0; k < 6; k++) {
      const [x, y] = P(-0.75 + k * 0.3, -0.92, 11);
      fence += `<circle cx="${x}" cy="${y}" r="2.2" fill="${k % 2 ? '#F7A8C8' : '#FFD45E'}"/><circle cx="${x}" cy="${y}" r="0.8" fill="#FFFFFF"/>`
        + `<ellipse cx="${x + 3}" cy="${y + 1.5}" rx="2" ry="1" fill="#6DB64C"/>`;
    }
  }
  return fence;
}
function garden(skin) {
  let rows = '';
  for (let k = 0; k < 4; k++) {
    const v = -0.6 + k * 0.38;
    rows += face([[-0.78, v - 0.07, 4], [0.78, v - 0.07, 4], [0.78, v + 0.07, 4], [-0.78, v + 0.07, 4]], '#6B4329');
  }
  let plants = '';
  for (let k = 0; k < 4; k++) {
    for (let j = 0; j < 5; j++) {
      const u = -0.62 + j * 0.31;
      const v = -0.6 + k * 0.38;
      const [x, y] = P(u, v, 4);
      const carrot = (j + k) % 2 === 0;
      plants += carrot
        ? `<path d="M${x},${y} q-3,-7 -5,-9 M${x},${y} q0,-8 0,-11 M${x},${y} q3,-7 5,-9" stroke="#5DAA45" stroke-width="2" fill="none" stroke-linecap="round"/><ellipse cx="${x}" cy="${y + 0.5}" rx="2.6" ry="1.4" fill="#F08A3A"/>`
        : `<ellipse cx="${x - 3}" cy="${y - 3}" rx="3.4" ry="2" fill="#86CB5E" transform="rotate(-30 ${x - 3} ${y - 3})"/><ellipse cx="${x + 3}" cy="${y - 3}" rx="3.4" ry="2" fill="#6DB64C" transform="rotate(30 ${x + 3} ${y - 3})"/>`;
    }
  }
  return sprite(shadow(0, 0, 1.15, 0.14) + gardenFence(skin) + box(-0.85, -0.85, 0.85, 0.85, 0, 4, SOIL) + rows + plants, BUILDING_BOX);
}

// Atelier : appentis de bois et four de briques à cheminée ronde, enclume devant
// Enseigne dorée (skin) accrochée au mur gauche d'un atelier, à la hauteur z
export function goldenSign(u, v, z) {
  const [x, y] = P(u, v, z);
  return `<line x1="${x}" y1="${y}" x2="${x - 9}" y2="${y + 4.5}" stroke="#5E3A22" stroke-width="1.6"/>`
    + `<path d="M${x - 16},${y + 5} h12 v9 q-6,5 -12,0 Z" fill="#F2C04B" stroke="#8A6A22" stroke-width="1"/>`
    + `<path d="M${x - 13},${y + 8} l3,3 l4,-4" stroke="#8A6A22" stroke-width="1.2" fill="none"/>`;
}
function workshop(skin) {
  const u0 = -0.8, u1 = 0.15, v0 = -0.55, v1 = 0.45, h = 28;
  const roof = roofOf(skin, { front: '#8E6A4A', back: '#6F5038' });
  return sprite(
    shadow(0, 0, 1.15)
    + box(u0, v0, u1, v1, 0, h, WOOD)
    + planksLeft(u0, u1, v1, 0, h) + planksRight(u1, v0, v1, 0, h)
    + doorLeft(-0.55, -0.15, v1, 19, WOOD_DARK.right)
    + gable(u0, v0, u1, v1, h, 18, { front: roof.front, back: roof.back, gable: WOOD.right }, 0.1)
    + roofTexture(skin, u0, v0, u1, v1, h, 18, 0.1)
    + (skin === 'enseigne-doree' ? goldenSign(0.05, v1, 24) : '')
    // Four : socle de briques, voûte en pyramide, bouche rougeoyante, cheminée
    + box(0.25, -0.4, 0.85, 0.3, 0, 18, BRICK)
    + face([[0.85, -0.18, 2], [0.85, 0.08, 2], [0.85, 0.08, 11], [0.85, -0.18, 11]], '#3A1E14')
    + face([[0.85, -0.14, 3], [0.85, 0.04, 3], [0.85, 0.04, 7], [0.85, -0.14, 7]], '#F28A3A')
    + pyramid(0.25, -0.4, 0.85, 0.3, 18, 10, { back: BRICK.right, left: BRICK.left, right: BRICK.right }, 0.02)
    + cylinder(0.55, -0.05, 26, 44, 0.08, { top: '#5E3A2A', left: BRICK.left, right: BRICK.right }, 'kilng')
    // Enclume sur billot
    + shadow(0.35, 0.65, 0.2, 0.2)
    + cylinder(0.35, 0.65, 0, 8, 0.1, { top: '#E7C08A', left: WOOD.left, right: WOOD.right }, 'blockg')
    + box(0.24, 0.6, 0.46, 0.7, 8, 13, { top: '#9AA6B2', left: '#7C8894', right: '#5F6A75' }),
    BUILDING_BOX
  );
}

// Ponton : anse d'eau, appontement sur pilotis, petit voilier amarré (la voile et la coque bercée sont à part)
function pier() {
  let posts = '';
  for (const u of [-0.7, -0.2, 0.3, 0.8]) {
    posts += box(u - 0.04, 0.12, u + 0.04, 0.2, -4, 7, WOOD_DARK) + box(u - 0.04, -0.2, u + 0.04, -0.12, -4, 7, WOOD_DARK);
  }
  let deck = box(-0.85, -0.25, 0.9, 0.25, 7, 10, WOOD);
  for (let k = 1; k < 9; k++) {
    const u = -0.85 + k * 0.195;
    deck += `<polyline points="${[P(u, -0.25, 10), P(u, 0.25, 10)].map(p => p.join(',')).join(' ')}" stroke="rgba(90,55,25,.35)" stroke-width="0.8"/>`;
  }
  // L'anse reste dans l'emprise (cercle inscrit au losange 2 × 2)
  const water = disc(0, 0.05, 0, 0.92, '#6FC0E4') + disc(0, 0.05, 0, 0.78, '#5AAED7');
  const rope = `<path d="M${P(0.8, 0.2, 9).join(',')} Q${P(0.75, 0.45, 2).join(',')} ${P(0.55, 0.6, 5).join(',')}" stroke="#C9A16A" stroke-width="1.2" fill="none"/>`;
  return sprite(water + posts + deck + box(0.6, -0.15, 0.85, 0.12, 10, 18, WOOD_DARK) + rope, BUILDING_BOX);
}

// Chantier, en trois phases qui suivent l'avancée du joueur :
// 0 = piquets et cordeau (plan pas encore trouvé), 1 = planches et panneau (plan trouvé), 2 = échafaudage (prêt à bâtir)
function worksite(stage) {
  let stakes = '';
  for (const [u, v] of [[-0.85, -0.85], [0.85, -0.85], [-0.85, 0.85], [0.85, 0.85]]) {
    stakes += box(u - 0.035, v - 0.035, u + 0.035, v + 0.035, 0, 14, WOOD);
  }
  const line = [[-0.85, -0.85], [0.85, -0.85], [0.85, 0.85], [-0.85, 0.85], [-0.85, -0.85]].map(([u, v]) => P(u, v, 11).join(',')).join(' ');
  // Terre retournée au centre
  const dug = disc(0, 0, 0, 0.62, 'rgba(150,105,60,.35)') + pebble(0.3, -0.2, 2.6) + pebble(-0.25, 0.3, 2.2);
  let body = shadow(0, 0, 1.1, 0.1) + dug;
  if (stage >= 2) {
    // Échafaudage : quatre montants, un plancher, une échelle appuyée sur la face avant
    const post = (u, v) => box(u - 0.03, v - 0.03, u + 0.03, v + 0.03, 0, 32, WOOD_DARK);
    body += post(-0.6, -0.6) + post(0.1, -0.6) + post(-0.6, -0.1)
      + box(-0.63, -0.63, 0.13, -0.07, 24, 27, WOOD)
      + box(-0.63, -0.63, 0.13, -0.57, 30, 32, WOOD_DARK)
      + post(0.1, -0.1)
      + [0, 1, 2, 3].map(k => `<line x1="${P(-0.3, -0.04, 4 + k * 6)[0]}" y1="${P(-0.3, -0.04, 4 + k * 6)[1]}" x2="${P(-0.12, -0.04, 4 + k * 6)[0]}" y2="${P(-0.12, -0.04, 4 + k * 6)[1]}" stroke="${WOOD.left}" stroke-width="1.6"/>`).join('')
      + `<line x1="${P(-0.3, -0.04, 0)[0]}" y1="${P(-0.3, -0.04, 0)[1]}" x2="${P(-0.3, -0.04, 27)[0]}" y2="${P(-0.3, -0.04, 27)[1]}" stroke="${WOOD.right}" stroke-width="1.8"/>`
      + `<line x1="${P(-0.12, -0.04, 0)[0]}" y1="${P(-0.12, -0.04, 0)[1]}" x2="${P(-0.12, -0.04, 27)[0]}" y2="${P(-0.12, -0.04, 27)[1]}" stroke="${WOOD.right}" stroke-width="1.8"/>`
      // Seau de mortier au pied
      + cylinder(0.32, -0.45, 0, 7, 0.09, { top: '#CFC6B4', left: '#9AA6B2', right: '#6F7A85' }, 'mortarg');
  }
  body += `<polyline points="${line}" stroke="#F2E4C0" stroke-width="1" fill="none" stroke-dasharray="3 2"/>` + stakes;
  if (stage >= 1) {
    // Pile de planches et panneau du chantier
    body += box(-0.4, 0.15, 0.2, 0.32, 0, 3, WOOD) + box(-0.36, 0.17, 0.24, 0.34, 3, 6, WOOD) + box(-0.42, 0.14, 0.18, 0.31, 6, 9, WOOD)
      + box(0.45, 0.42, 0.5, 0.47, 0, 18, WOOD_DARK)
      + face([[0.3, 0.47, 14], [0.66, 0.47, 14], [0.66, 0.47, 24], [0.3, 0.47, 24]], '#F3D27A', EDGE)
      + face([[0.4, 0.47, 17], [0.56, 0.47, 17], [0.56, 0.47, 21], [0.4, 0.47, 21]], INK, ' opacity=".55"');
  }
  if (stage >= 2) {
    // Pierres de taille prêtes
    body += box(0.35, -0.05, 0.62, 0.18, 0, 7, STONE) + box(0.4, -0.02, 0.6, 0.15, 7, 12, STONE);
  }
  return sprite(body, BUILDING_BOX);
}

/* ---------- Nature ---------- */
function treeProp() {
  return sprite(roundTree(0, 0, 1), PROP_BOX);
}
function pineProp() {
  const [x, y] = P(0, 0, 0);
  const tier = (yy, w, h, k) => `<path d="M${x - w},${yy} L${x},${yy - h} L${x + w},${yy} Z" fill="${PINE.dark}"/><path d="M${x - w + 2},${yy - 1} L${x},${yy - h} L${x + 1},${yy - 1} Z" fill="${k ? PINE.mid : PINE.light}"/>`;
  return sprite(shadow(0, 0, 0.3) + box(-0.05, -0.05, 0.05, 0.05, 0, 12, WOOD_DARK) + tier(y - 8, 15, 22, 1) + tier(y - 20, 12, 20, 1) + tier(y - 31, 9, 18, 0), PROP_BOX);
}
function palmProp() {
  const [x, y] = P(0, 0, 0);
  const tx = x + 8;
  const ty = y - 50;
  // Tronc courbe, anneaux sombres
  const trunk = `<path d="M${x - 2},${y} C${x - 4},${y - 20} ${x + 2},${y - 36} ${tx},${ty}" stroke="${WOOD.left}" stroke-width="5.5" fill="none" stroke-linecap="round"/>`
    + `<path d="M${x - 2},${y} C${x - 4},${y - 20} ${x + 2},${y - 36} ${tx},${ty}" stroke="${WOOD.right}" stroke-width="5.5" fill="none" stroke-dasharray="1.6 3.4"/>`;
  // Palme : feuille pleine et arquée, du cœur vers (dx, dy)
  const frond = (dx, dy, c) => {
    const mx = tx + dx * 0.5;
    const my = ty + dy * 0.5 - 9;
    // Largeur de la feuille : décalage perpendiculaire des deux bords autour de la nervure
    const len = Math.hypot(dx, dy) || 1;
    const nx = (-dy / len) * 5;
    const ny = (dx / len) * 5;
    return `<path d="M${tx},${ty} Q${mx + nx},${my + ny} ${tx + dx},${ty + dy} Q${mx - nx},${my - ny} ${tx},${ty} Z" fill="${c}"/>`
      + `<path d="M${tx},${ty} Q${mx},${my} ${tx + dx},${ty + dy}" stroke="rgba(30,70,30,.35)" stroke-width="0.8" fill="none"/>`;
  };
  return sprite(shadow(0.1, 0, 0.3) + trunk
    + frond(-22, 4, PINE.dark) + frond(22, 6, PINE.dark)
    + frond(-15, 14, PINE.mid) + frond(16, 15, PINE.mid)
    + frond(-8, -12, LEAVES.mid) + frond(10, -11, LEAVES.light)
    + `<circle cx="${tx - 2}" cy="${ty + 3}" r="2.6" fill="#8A5A2B"/><circle cx="${tx + 3}" cy="${ty + 4}" r="2.6" fill="#6E4520"/>`, PROP_BOX);
}
function bushProp() {
  const [x, y] = P(0, 0, 0);
  return sprite(shadow(0, 0, 0.32) + foliage(x - 7, y - 6, 8, LEAVES) + foliage(x + 7, y - 6, 8.5, LEAVES) + foliage(x, y - 12, 9, LEAVES)
    + `<circle cx="${x - 5}" cy="${y - 14}" r="1.8" fill="#F27A9A"/><circle cx="${x + 6}" cy="${y - 10}" r="1.8" fill="#F27A9A"/><circle cx="${x + 1}" cy="${y - 4}" r="1.8" fill="#FFFFFF"/>`, PROP_BOX);
}
// Rochers du sol rocheux, en granit à facettes : un bloc, un amas, une aiguille ; lichen sur les plus gros
const GRANITE = { top: '#CBC6BA', left: '#A6A094', right: '#7E786E' };
const lichen = (u, v, z) => { const [x, y] = P(u, v, z); return `<ellipse cx="${x}" cy="${y}" rx="2.6" ry="1.3" fill="#B7C46C" opacity=".85"/>`; };
const rockProp = () => sprite(shadow(0, 0, 0.3) + boulder(0, 0, 0.3, 0.26, 12, GRANITE, 1) + lichen(-0.06, -0.08, 11) + pebble(-0.32, 0.26, 3, GRANITE), PROP_BOX);
const rocksProp = () => sprite(shadow(0, 0, 0.34) + boulder(-0.12, -0.1, 0.26, 0.22, 13, GRANITE, 2) + boulder(0.2, 0.14, 0.16, 0.14, 7, GRANITE, 3)
  + boulder(-0.26, 0.22, 0.1, 0.09, 4, GRANITE, 4) + lichen(-0.17, -0.16, 12), PROP_BOX);
const cragProp = () => sprite(shadow(0, 0, 0.3) + boulder(0, 0, 0.27, 0.23, 26, GRANITE, 5, 0.35, 0.35) + boulder(0.22, 0.14, 0.13, 0.11, 8, GRANITE, 6)
  + pebble(-0.3, 0.2, 2.6, GRANITE), PROP_BOX);
function flowersProp() {
  let out = '';
  const spots = [[-0.25, -0.2, '#F27A9A'], [0.15, -0.25, '#FFD45E'], [0.25, 0.1, '#FFFFFF'], [-0.1, 0.2, '#B9A0F0'], [-0.3, 0.1, '#FFD45E'], [0.05, 0.0, '#F27A9A']];
  spots.forEach(([u, v, c]) => {
    const [x, y] = P(u, v, 0);
    out += `<path d="M${x},${y} q-1,-4 0,-8" stroke="#5DAA45" stroke-width="1.4" fill="none"/>`
      + [0, 72, 144, 216, 288].map(a => `<circle cx="${x + Math.cos((a * Math.PI) / 180) * 2.2}" cy="${y - 9 + Math.sin((a * Math.PI) / 180) * 2.2}" r="1.7" fill="${c}"/>`).join('')
      + `<circle cx="${x}" cy="${y - 9}" r="1.2" fill="#E8A13A"/>`;
  });
  return sprite(out, PROP_BOX);
}
function tuftProp() {
  const [x, y] = P(0, 0, 0);
  return sprite(`<path d="M${x - 6},${y} q1,-8 -2,-12 M${x - 2},${y} q0,-10 1,-14 M${x + 2},${y} q1,-9 4,-12 M${x + 6},${y} q0,-6 3,-9" stroke="#5DAA45" stroke-width="2" fill="none" stroke-linecap="round"/>`, PROP_BOX);
}

/* ---------- Parties animées ---------- */
// Flamme d'un feu de camp : 3 images ; ancrée au centre du feu, en (u, v) (le feu de camp : au centre de l'emprise), s : taille
export function flameFrames(u = 0, v = 0, s = 1) {
  const [x, y] = P(u, v, 4);
  const shapes = [
    [[0, -22], [7, -6], [0, 0], [-7, -6]],
    [[2, -24], [7, -7], [0, 0], [-6, -5]],
    [[-2, -21], [6, -5], [0, 0], [-7, -7]]
  ].map(shape => shape.map(([dx, dy]) => [dx * s, dy * s]));
  return shapes.map(([tip, r, base, l]) => sprite(
    `<path d="M${x + base[0]},${y + base[1]} C${x + r[0] + 3 * s},${y + r[1]} ${x + tip[0] + 2 * s},${y + tip[1] + 8 * s} ${x + tip[0]},${y + tip[1]} C${x + tip[0] - 2 * s},${y + tip[1] + 8 * s} ${x + l[0] - 3 * s},${y + l[1]} ${x + base[0]},${y + base[1]} Z" fill="#F7A23B"/>`
    + `<path d="M${x},${y} C${x + 4 * s},${y - 4 * s} ${x + tip[0] * 0.5 + 1 * s},${y + tip[1] * 0.5 + 4 * s} ${x + tip[0] * 0.5},${y + tip[1] * 0.55} C${x + tip[0] * 0.5 - 1 * s},${y + tip[1] * 0.5 + 4 * s} ${x - 4 * s},${y - 4 * s} ${x},${y} Z" fill="#FFE07A"/>`,
    { x: x - 20, y: y - 36, w: 40, h: 44 }
  ));
}
// Voilier amarré au Ponton (bercé par l'île) ; ancré au centre de l'emprise
export function boatSprite(skin) {
  const [x, y] = P(0.05, 0.5, 0);
  const sail = SAILS[skin];
  const hull = `<path d="M${x - 22},${y - 6} L${x + 22},${y - 6} Q${x + 18},${y + 5} ${x + 8},${y + 6} L${x - 12},${y + 6} Q${x - 20},${y + 4} ${x - 22},${y - 6} Z" fill="${WOOD.left}" stroke="#3C2819" stroke-width="0.8"/>`
    + `<path d="M${x - 22},${y - 6} L${x + 22},${y - 6} L${x + 19},${y - 2} L${x - 20},${y - 2} Z" fill="#FBF6EA"/>`;
  const mast = `<line x1="${x}" y1="${y - 6}" x2="${x}" y2="${y - 46}" stroke="${WOOD_DARK.right}" stroke-width="2"/>`;
  // Voile : blanche d'origine, ou couleur du skin (rayée : bandes rouges sur blanc)
  const main = sail && sail[0] !== 'stripes' ? sail[0] : '#FFFDF8';
  const jib = sail && sail[0] !== 'stripes' ? sail[1] : '#F2E4C0';
  const stripes = sail && sail[0] === 'stripes'
    ? [0, 1, 2].map(k => `<path d="M${x + 1},${y - 40 + k * 10} L${x + 1},${y - 35 + k * 10} L${x + 6 + k * 4.5},${y - 35.5 + k * 10} L${x + 4 + k * 4.5},${y - 40.5 + k * 10} Z" fill="${sail[1]}"/>`).join('')
    : '';
  const sails = `<path d="M${x + 1},${y - 44} L${x + 1},${y - 10} L${x + 20},${y - 12} Z" fill="${main}" stroke="rgba(60,40,25,.5)" stroke-width="0.8"/>${stripes}<path d="M${x - 1},${y - 38} L${x - 1},${y - 12} L${x - 14},${y - 13} Z" fill="${jib}"/>`;
  return sprite(`<ellipse cx="${x}" cy="${y + 6}" rx="22" ry="5" fill="rgba(30,70,110,.25)"/>` + hull + mast + sails, BUILDING_BOX);
}

export const BUILDINGS = {
  foyer: [campfire, shelter, hut],
  carriere: [fissure, quarry],
  bosquet: [grove],
  puits: [well],
  potager: [garden],
  atelier: [workshop],
  ponton: [pier],
  chantier: [() => worksite(0), () => worksite(1), () => worksite(2)]
};
export const NATURE = { tree: treeProp, pine: pineProp, palm: palmProp, bush: bushProp, rock: rockProp, rocks: rocksProp, crag: cragProp, flowers: flowersProp, tuft: tuftProp };
export { TW, TH };

// Lumières de nuit par bâtiment et niveau : [u, v, z, rayon en px] (fenêtres, feu, bouche du four)
export const LIGHTS = {
  foyer: [[[0, 0, 10, 54]], [[SHELTER_FIRE[0], SHELTER_FIRE[1], 8, 40]], [[0.55, -0.07, 14, 22]]],
  atelier: [[[0.85, -0.05, 6, 30]]],
};
// Fumée : [u, v, z] du haut des cheminées, par bâtiment et niveau
export const SMOKE = {
  foyer: [[0, 0, 24], [SHELTER_FIRE[0], SHELTER_FIRE[1], 18], [CABIN_CHIMNEY[0], CABIN_CHIMNEY[1], 62]],
  atelier: [[0.55, -0.05, 44]]
};
