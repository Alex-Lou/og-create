// Sprites de l'île, dessinés en SVG sur la géométrie isométrique commune (world/iso.js).
// Bâtiments : emprise de 2 × 2 cases (u, v ∈ [-1, 1]), ancrés au centre de l'emprise.
// Nature : emprise d'une case (u, v ∈ [-0.5, 0.5]), ancrée au centre de la case.
// Les parties animées (flamme, fumée, eau, voile) sont des sprites à part, peints image par image par l'île.
import { P, TW, TH, face, box, gable, pyramid, disc, cylinder, shadow, foliage, sprite, EDGE } from './iso';
import {
  WOOD, WOOD_DARK, STONE, WALL, BRICK, SOIL, ROOF_RED, THATCH, LEAVES, PINE, INK, BUILDING_BOX, PROP_BOX,
  pebble, doorLeft, windowLeft, windowRight, planksLeft, planksRight, roundTree
} from './palette';

/* ---------- Bâtiments ---------- */
// Foyer, niveau 1 : feu de camp dans un cercle de pierres, une bûche pour s'asseoir (la flamme est animée à part)
function campfire() {
  let stones = '';
  // Pierres de l'arrière d'abord : l'ordre de peinture fait l'occlusion
  const ring = Array.from({ length: 9 }, (_, k) => {
    const a = (k / 9) * Math.PI * 2;
    return { u: Math.cos(a) * 0.36, v: Math.sin(a) * 0.36 };
  }).sort((p, q) => p.u + p.v - (q.u + q.v));
  ring.forEach(p => { stones += pebble(p.u, p.v, 5.2); });
  const logs = box(-0.24, -0.04, 0.24, 0.04, 0, 5, WOOD_DARK) + box(-0.04, -0.24, 0.04, 0.24, 0, 5, WOOD);
  const embers = disc(0, 0, 0.5, 0.2, '#5C3A24') + disc(0, 0, 1, 0.12, '#F28A3A', ' opacity=".85"');
  const seat = shadow(0.62, -0.5, 0.3, 0.18) + box(0.42, -0.6, 0.82, -0.44, 0, 7, WOOD);
  const stump = shadow(-0.55, 0.55, 0.2, 0.18) + cylinder(-0.55, 0.55, 0, 9, 0.14, { top: '#E7C08A', left: WOOD.left, right: WOOD.right }, 'stumpg');
  return sprite(shadow(0, 0, 0.6, 0.16) + seat + stones + embers + logs + stump, BUILDING_BOX);
}

// Foyer, niveau 2 : cabane de planches, toit de chaume
function hut() {
  const u0 = -0.55, u1 = 0.55, v0 = -0.45, v1 = 0.45, h = 26;
  return sprite(
    shadow(0, 0, 0.95)
    + box(u0, v0, u1, v1, 0, h, WOOD)
    + planksLeft(u0, u1, v1, 0, h) + planksRight(u1, v0, v1, 0, h)
    + doorLeft(-0.12, 0.16, v1, 17)
    + windowRight(u1, -0.22, 0.08, 10, 18)
    + gable(u0, v0, u1, v1, h, 24, { front: THATCH.front, back: THATCH.back, gable: WOOD.right }, 0.12)
    // Mèches de chaume sur le bord du pan avant
    + `<polyline points="${[P(-0.67, 0.57, h), P(0.67, 0.57, h)].map(p => p.join(',')).join(' ')}" stroke="#B88A3A" stroke-width="1.6" stroke-dasharray="2 3"/>`,
    BUILDING_BOX
  );
}

// Foyer, niveau 3 : maison crème sur soubassement de pierre, toit de tuiles, cheminée
function house() {
  const u0 = -0.72, u1 = 0.62, v0 = -0.5, v1 = 0.5, h = 34;
  return sprite(
    shadow(0, 0, 1.15)
    + box(u0 - 0.04, v0 - 0.04, u1 + 0.04, v1 + 0.04, 0, 5, STONE)
    + box(u0, v0, u1, v1, 5, h, WALL)
    + doorLeft(-0.2, 0.08, v1, 22, '#8C4B32')
    + windowLeft(-0.6, -0.34, v1, 13, 24)
    + windowLeft(0.24, 0.5, v1, 13, 24)
    + windowRight(u1, -0.3, 0.1, 13, 24)
    // Cheminée derrière le faîtage
    + box(0.18, -0.36, 0.36, -0.18, h, h + 30, BRICK)
    + gable(u0, v0, u1, v1, h, 28, { front: ROOF_RED.front, back: ROOF_RED.back, gable: WALL.right }, 0.1)
    // Rangs de tuiles sur le pan avant
    + [0.3, 0.6].map(k => `<polyline points="${[P(-0.82, k * 0.6 + 0.0, h + 28 * (1 - k)), P(0.72, k * 0.6, h + 28 * (1 - k))].map(p => p.join(',')).join(' ')}" stroke="rgba(120,40,25,.35)" stroke-width="1"/>`).join(''),
    BUILDING_BOX
  );
}

// Carrière : affleurement rocheux taillé en gradins, blocs extraits, pioche et wagonnet
function quarry() {
  const rock = (u0, v0, u1, v1, h) => box(u0, v0, u1, v1, 0, h, STONE);
  const pick = `<line x1="${P(0.55, 0.3, 0)[0]}" y1="${P(0.55, 0.3, 0)[1]}" x2="${P(0.55, 0.3, 22)[0] - 4}" y2="${P(0.55, 0.3, 22)[1]}" stroke="${WOOD.right}" stroke-width="2.4" stroke-linecap="round"/>`
    + `<path d="M${P(0.55, 0.3, 22)[0] - 13},${P(0.55, 0.3, 22)[1] + 3} Q${P(0.55, 0.3, 22)[0] - 4},${P(0.55, 0.3, 22)[1] - 5} ${P(0.55, 0.3, 22)[0] + 6},${P(0.55, 0.3, 22)[1] + 3}" stroke="#7C8A96" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
  const cart = shadow(-0.45, 0.6, 0.3, 0.2)
    + box(-0.65, 0.42, -0.25, 0.72, 4, 14, WOOD_DARK)
    + disc(-0.6, 0.72, 4, 0.07, '#3D3A36') + disc(-0.3, 0.72, 4, 0.07, '#3D3A36')
    + pebble(-0.5, 0.52, 3.6) + pebble(-0.4, 0.6, 3.2);
  return sprite(
    shadow(0, 0, 1.15, 0.18)
    + rock(-0.9, -0.9, 0.2, -0.2, 40)
    + rock(0.2, -0.9, 0.85, -0.35, 28)
    + rock(-0.9, -0.2, -0.3, 0.3, 22)
    + rock(-0.1, -0.2, 0.4, 0.2, 12)
    // Veines dans la roche
    + `<polyline points="${[P(-0.9, -0.2, 30), P(-0.4, -0.2, 34), P(0.2, -0.2, 26)].map(p => p.join(',')).join(' ')}" stroke="rgba(90,80,65,.4)" stroke-width="1" fill="none"/>`
    + box(0.45, -0.1, 0.75, 0.15, 0, 9, STONE) + box(0.5, 0.18, 0.78, 0.42, 0, 7, STONE)
    + cart + pick,
    BUILDING_BOX
  );
}

// Bosquet : trois arbres ronds de tailles différentes
function grove() {
  return sprite(roundTree(-0.45, -0.4, 1.1) + roundTree(0.45, -0.35, 0.95) + roundTree(0, 0.4, 1.2), BUILDING_BOX);
}

// Puits : margelle de pierre, eau sombre, deux montants, petit toit, treuil et seau
function well() {
  return sprite(
    shadow(0, 0, 0.75)
    + box(-0.42, -0.06, -0.34, 0.06, 0, 40, WOOD_DARK)
    + cylinder(0, 0, 0, 16, 0.36, STONE, 'wellg')
    + disc(0, 0, 16, 0.26, '#2F5E7A') + disc(-0.04, -0.04, 16, 0.14, '#4C8DB0', ' opacity=".7"')
    + box(0.34, -0.06, 0.42, 0.06, 0, 40, WOOD_DARK)
    // Treuil (axe le long de u) et corde
    + box(-0.38, -0.025, 0.38, 0.025, 31, 34, WOOD)
    + `<line x1="${P(0, 0, 32)[0]}" y1="${P(0, 0, 32)[1]}" x2="${P(0, 0, 22)[0]}" y2="${P(0, 0, 22)[1]}" stroke="#7A5A3A" stroke-width="1.2"/>`
    + cylinder(0, 0, 16, 22, 0.08, { top: '#B98552', left: WOOD.left, right: WOOD.right }, 'bucketg')
    + gable(-0.5, -0.28, 0.5, 0.28, 40, 14, { front: ROOF_RED.front, back: ROOF_RED.back, gable: WOOD_DARK.right }, 0.06),
    BUILDING_BOX
  );
}

// Potager : planche de terre labourée en sillons, pousses et fanes, petite clôture au fond
function garden() {
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
  let fence = '';
  for (let k = 0; k <= 6; k++) {
    const u = -0.9 + k * 0.3;
    fence += box(u - 0.025, -0.95, u + 0.025, -0.9, 0, 12, WOOD);
  }
  fence += box(-0.9, -0.94, 0.9, -0.91, 8, 10, WOOD) + box(-0.9, -0.94, 0.9, -0.91, 3, 5, WOOD);
  return sprite(shadow(0, 0, 1.15, 0.14) + fence + box(-0.85, -0.85, 0.85, 0.85, 0, 4, SOIL) + rows + plants, BUILDING_BOX);
}

// Atelier : appentis de bois et four de briques à cheminée ronde, enclume devant
function workshop() {
  const u0 = -0.8, u1 = 0.15, v0 = -0.55, v1 = 0.45, h = 28;
  return sprite(
    shadow(0, 0, 1.15)
    + box(u0, v0, u1, v1, 0, h, WOOD)
    + planksLeft(u0, u1, v1, 0, h) + planksRight(u1, v0, v1, 0, h)
    + doorLeft(-0.55, -0.15, v1, 19, WOOD_DARK.right)
    + gable(u0, v0, u1, v1, h, 18, { front: '#8E6A4A', back: '#6F5038', gable: WOOD.right }, 0.1)
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
function rockProp() {
  return sprite(shadow(0, 0, 0.3) + box(-0.22, -0.18, 0.14, 0.16, 0, 13, STONE) + box(0.1, 0.0, 0.3, 0.2, 0, 7, STONE) + pebble(-0.3, 0.25, 3.2), PROP_BOX);
}
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
// Flamme du foyer : 3 images ; ancrée au centre du feu de camp
export function flameFrames() {
  const [x, y] = P(0, 0, 4);
  const shapes = [
    [[0, -22], [7, -6], [0, 0], [-7, -6]],
    [[2, -24], [7, -7], [0, 0], [-6, -5]],
    [[-2, -21], [6, -5], [0, 0], [-7, -7]]
  ];
  return shapes.map(([tip, r, base, l]) => sprite(
    `<path d="M${x + base[0]},${y + base[1]} C${x + r[0] + 3},${y + r[1]} ${x + tip[0] + 2},${y + tip[1] + 8} ${x + tip[0]},${y + tip[1]} C${x + tip[0] - 2},${y + tip[1] + 8} ${x + l[0] - 3},${y + l[1]} ${x + base[0]},${y + base[1]} Z" fill="#F7A23B"/>`
    + `<path d="M${x},${y} C${x + 4},${y - 4} ${x + tip[0] * 0.5 + 1},${y + tip[1] * 0.5 + 4} ${x + tip[0] * 0.5},${y + tip[1] * 0.55} C${x + tip[0] * 0.5 - 1},${y + tip[1] * 0.5 + 4} ${x - 4},${y - 4} ${x},${y} Z" fill="#FFE07A"/>`,
    { x: -20, y: -40, w: 40, h: 44 }
  ));
}
// Voilier amarré au Ponton (bercé par l'île) ; ancré au centre de l'emprise
export function boatSprite() {
  const [x, y] = P(0.05, 0.5, 0);
  const hull = `<path d="M${x - 22},${y - 6} L${x + 22},${y - 6} Q${x + 18},${y + 5} ${x + 8},${y + 6} L${x - 12},${y + 6} Q${x - 20},${y + 4} ${x - 22},${y - 6} Z" fill="${WOOD.left}" stroke="rgba(60,40,25,.35)" stroke-width="0.8"/>`
    + `<path d="M${x - 22},${y - 6} L${x + 22},${y - 6} L${x + 19},${y - 2} L${x - 20},${y - 2} Z" fill="#FBF6EA"/>`;
  const mast = `<line x1="${x}" y1="${y - 6}" x2="${x}" y2="${y - 46}" stroke="${WOOD_DARK.right}" stroke-width="2"/>`;
  const sail = `<path d="M${x + 1},${y - 44} L${x + 1},${y - 10} L${x + 20},${y - 12} Z" fill="#FFFDF8" stroke="rgba(60,40,25,.25)" stroke-width="0.8"/><path d="M${x - 1},${y - 38} L${x - 1},${y - 12} L${x - 14},${y - 13} Z" fill="#F2E4C0"/>`;
  return sprite(`<ellipse cx="${x}" cy="${y + 6}" rx="22" ry="5" fill="rgba(30,70,110,.25)"/>` + hull + mast + sail, BUILDING_BOX);
}

export const BUILDINGS = {
  foyer: [campfire, hut, house],
  carriere: [quarry],
  bosquet: [grove],
  puits: [well],
  potager: [garden],
  atelier: [workshop],
  ponton: [pier],
  chantier: [() => worksite(0), () => worksite(1), () => worksite(2)]
};
export const NATURE = { tree: treeProp, pine: pineProp, palm: palmProp, bush: bushProp, rock: rockProp, flowers: flowersProp, tuft: tuftProp };
export { TW, TH };

// Lumières de nuit par bâtiment et niveau : [u, v, z, rayon en px] (fenêtres, feu, bouche du four)
export const LIGHTS = {
  foyer: [[[0, 0, 10, 54]], [[0.55, -0.07, 14, 22]], [[-0.47, 0.5, 18, 22], [0.37, 0.5, 18, 22], [0.62, -0.1, 18, 22], [-0.06, 0.5, 12, 18]]],
  atelier: [[[0.85, -0.05, 6, 30]]],
};
// Fumée : [u, v, z] du haut des cheminées, par bâtiment et niveau
export const SMOKE = {
  foyer: [[0, 0, 24], null, [0.27, -0.27, 64]],
  atelier: [[0.55, -0.05, 44]]
};
