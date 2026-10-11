// Sprites de l'île, dessinés en SVG sur la géométrie isométrique commune (world/iso.js).
// Bâtiments : emprise de 2 × 2 cases (u, v ∈ [-1, 1]), ancrés au centre de l'emprise.
// Nature : emprise d'une case (u, v ∈ [-0.5, 0.5]), ancrée au centre de la case.
// Les parties animées (flamme, fumée, eau, voile) sont des sprites à part, peints image par image par l'île.
import { P, TW, TH, face, box, gable, pyramid, disc, cylinder, shadow, foliage, sprite, boulder, EDGE, HIVER, snowPan, mixHex } from './iso.js';
import {
  WOOD, WOOD_DARK, STONE, BRICK, ROOF_RED, THATCH, LEAVES, PINE, INK, BUILDING_BOX, PROP_BOX,
  pebble, doorLeft, windowRight, planksLeft, planksRight, roundTree,
  WHITE_STONE, WHITE_WOOD, ROCKS, FOLIAGE, SAILS, roofOf, roofTexture, stoneCourses, seasonDots, crystals, rockBox, stoneRing, pool, cove, soilBed, furrow, leafPair, shingles, roofTextureOf
} from './palette.js';
import { courseLeft, courseRight, OUT } from './tiers/kit.js';
import { INK as ENCRE, TRAIT, DETAIL, MER, BOIS, SABLE, poly as chibiPoly, trait, degrade, bloc, poteau, galet, ecume, cordeLovee, pierreRonde, buche } from './chibi.js';

const f2 = n => Math.round(n * 100) / 100;
const ln = (a, b, color, w = 1.2) => `<line x1="${f2(a[0])}" y1="${f2(a[1])}" x2="${f2(b[0])}" y2="${f2(b[1])}" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/>`;
const ell = (x, y, rx, ry, fill) => `<ellipse cx="${f2(x)}" cy="${f2(y)}" rx="${rx}" ry="${ry}" fill="${fill}"/>`;

/* ---------- Bâtiments ---------- */
// Bûche couchée de (u0, v0) à (u1, v1) à la hauteur z, rayon r (px) : écorce détourée, reflet dessus, ombre dessous,
// bout scié à cernes du côté du joueur
function lyingLog(u0, v0, u1, v1, z, r, c = WOOD_DARK) {
  const near = u1 + v1 >= u0 + v0;
  const e = P(near ? u1 : u0, near ? v1 : v0, z + r), g = P(near ? u0 : u1, near ? v0 : v1, z + r);
  const dx = e[0] - g[0], dy = e[1] - g[1], n = Math.hypot(dx, dy) || 1;
  const ang = f2((Math.atan2(dy, dx) * 180) / Math.PI);
  const seg = (k0, k1, oy, w, col, cap = 'butt') => `<line x1="${f2(g[0] + (dx * k0))}" y1="${f2(g[1] + dy * k0 + oy)}" x2="${f2(g[0] + dx * k1)}" y2="${f2(g[1] + dy * k1 + oy)}" stroke="${col}" stroke-width="${f2(w)}" stroke-linecap="${cap}"/>`;
  const k = Math.min(0.45, (r * 0.9) / n);
  return seg(0, 1, 0, 2 * r + 1.6, '#3C2819', 'round') + seg(0, 1, 0, 2 * r, c.left, 'round')
    + seg(k, 1 - k, -r * 0.45, r * 0.55, c.top) + seg(k, 1 - k, r * 0.5, r * 0.5, c.right)
    + `<g transform="rotate(${ang} ${f2(e[0])} ${f2(e[1])})"><ellipse cx="${f2(e[0])}" cy="${f2(e[1])}" rx="${f2(r * 0.55)}" ry="${f2(r)}" fill="#E7C08A" stroke="#3C2819" stroke-width="0.7"/>`
    + `<ellipse cx="${f2(e[0])}" cy="${f2(e[1])}" rx="${f2(r * 0.28)}" ry="${f2(r * 0.52)}" fill="none" stroke="#B98552" stroke-width="0.6"/></g>`;
}
// Pierre détourée du cercle d'un feu : ombre, flanc, dessus éclairé
function ringStone(u, v, s) {
  const [x, y] = P(u, v, 0);
  return `<ellipse cx="${f2(x)}" cy="${f2(y)}" rx="${f2(s)}" ry="${f2(s * 0.68)}" fill="${STONE.right}" stroke="#3C2819" stroke-width="0.7"/>`
    + `<ellipse cx="${f2(x - s * 0.12)}" cy="${f2(y - s * 0.16)}" rx="${f2(s * 0.8)}" ry="${f2(s * 0.48)}" fill="${STONE.left}"/>`
    + `<ellipse cx="${f2(x - s * 0.3)}" cy="${f2(y - s * 0.3)}" rx="${f2(s * 0.38)}" ry="${f2(s * 0.2)}" fill="${STONE.top}"/>`;
}
// Cercle de pierres d'un feu de camp autour de (u, v) : pierres de tailles variées (l'arrière, puis le lit de cendres,
// les braises qui rougeoient, deux bûches croisées, puis l'avant), la flamme est animée à part ; s : taille
function fireRing(u, v, s = 1) {
  const ring = Array.from({ length: 9 }, (_, k) => {
    const a = (k / 9) * Math.PI * 2;
    return { u: u + Math.cos(a) * 0.36 * s, v: v + Math.sin(a) * 0.36 * s, r: 5.2 * s * (0.86 + 0.28 * (((k * 37) % 10) / 10)) };
  }).sort((p, q) => p.u + p.v - (q.u + q.v));
  const back = ring.filter(p => p.u + p.v < u + v), front = ring.filter(p => p.u + p.v >= u + v);
  const [x, y] = P(u, v, 0.5);
  const coals = [[-5, 1, '#E2574C'], [4, -1, '#F28A3A'], [-1, 3, '#FFD27A'], [6, 2.5, '#E2574C'], [-6.5, -1.5, '#F28A3A']]
    .map(([dx, dy, c]) => `<ellipse cx="${f2(x + dx * s)}" cy="${f2(y + dy * s)}" rx="${f2(1.8 * s)}" ry="${f2(1.1 * s)}" fill="${c}"/>`).join('');
  return back.map(p => ringStone(p.u, p.v, p.r)).join('')
    + disc(u, v, 0.5, 0.24 * s, '#4A3426') + disc(u, v, 0.5, 0.17 * s, '#6B4A33') + coals
    + lyingLog(u - 0.24 * s, v + 0.03 * s, u + 0.2 * s, v + 0.03 * s, 0, 2.6 * s, WOOD_DARK)
    + lyingLog(u + 0.02 * s, v - 0.24 * s, u + 0.02 * s, v + 0.2 * s, 2.4 * s, 2.4 * s, WOOD)
    + front.map(p => ringStone(p.u, p.v, p.r)).join('');
}

// Sous un skin du Foyer, une étoffe pliée sur la bûche, aux couleurs du toit qu'il aura : couverture rouge à
// rayure, couverture bleue à franges, natte de paille tressée
function seatCloth(skin) {
  const roof = roofOf(skin, null);
  if (!roof) return '';
  const thatch = skin === 'toit-chaume-foyer';
  const [ax, ay] = P(0.47, -0.52, 8.6), [bx, by] = P(0.77, -0.52, 8.6);
  const d = 8;
  // le dessus, bombé sur la bûche (un peu plus sombre côté fond), puis le pan qui retombe devant jusqu'au sol
  const back = `<path d="M${f2(ax - 1)},${f2(ay - 0.4)} Q${f2((ax + bx) / 2 + 1)},${f2((ay + by) / 2 - 4.4)} ${f2(bx + 1)},${f2(by - 0.4)} Z" fill="${roof.back}" stroke="${OUT}" stroke-width="0.7" stroke-linejoin="round"/>`;
  const front = `<path d="M${f2(ax - 1)},${f2(ay - 0.6)} Q${f2((ax + bx) / 2)},${f2((ay + by) / 2 - 2.2)} ${f2(bx + 1)},${f2(by - 0.6)} L${f2(bx - 0.6)},${f2(by + d)} Q${f2((ax + bx) / 2)},${f2((ay + by) / 2 + d + 1.4)} ${f2(ax - 2.2)},${f2(ay + d)} Z" fill="${roof.front}" stroke="${OUT}" stroke-width="0.7" stroke-linejoin="round"/>`;
  const at = (k, t) => [ax - 1 - 1.2 * t + (bx + 1 - (ax - 1) + 0.6 * t) * k, ay - 0.6 + (by - ay) * k + (d + 0.6) * t];
  let deco = '';
  if (thatch) {
    for (let k = 0.18; k < 0.95; k += 0.16) deco += ln(at(k, 0.1), at(k, 0.92), 'rgba(140,95,35,.55)', 0.6);
    for (let t = 0.3; t < 0.95; t += 0.3) deco += ln(at(0.05, t), at(0.95, t), 'rgba(140,95,35,.4)', 0.5);
  } else if (skin === 'toit-rouge') {
    deco = ln(at(0.03, 0.62), at(0.97, 0.62), '#FFE3B8', 1.3) + ln(at(0.03, 0.78), at(0.97, 0.78), '#FFE3B8', 0.6);
  } else {
    for (let k = 0.1; k < 0.95; k += 0.14) deco += ln(at(k, 1), [at(k, 1)[0] - 0.3, at(k, 1)[1] + 2], '#DCE8F6', 0.7);
    deco += ln(at(0.04, 0.5), at(0.96, 0.5), 'rgba(255,255,255,.55)', 0.9);
  }
  // un pli d'ombre et un reflet en haut du pli
  return back + front + deco + ln(at(0.5, 0.15), at(0.47, 0.85), 'rgba(0,0,0,.14)', 1) + ln(at(0.1, 0.05), at(0.9, 0.05), 'rgba(255,255,255,.35)', 0.8);
}

// Foyer, niveau 1 : feu de camp dans un cercle de pierres, une bûche pour s'asseoir, une souche à cernes (la flamme
// est animée à part)
// Le cercle de feu au style chibi : terre brûlée, galets ronds (ceux du fond d'abord), braises, trois bûches croisées
function feuChibi(u, v, s = 1) {
  const R = 0.4 * s;
  const ring = Array.from({ length: 10 }, (_, k) => {
    const a = (k / 10) * Math.PI * 2 + 0.2;
    return { u: u + Math.cos(a) * R, v: v + Math.sin(a) * R, r: 6.2 * s * (0.85 + 0.3 * (((k * 37) % 10) / 10)) };
  }).sort((p, q) => p.u + p.v - (q.u + q.v));
  const back = ring.filter(p => p.u + p.v < u + v), front = ring.filter(p => p.u + p.v >= u + v);
  const [x, y] = P(u, v, 0.5);
  const braises = [[-6, 1, '#E2574C'], [5, -1, '#F28A3A'], [-1, 3.5, '#FFD27A'], [7, 3, '#E2574C'], [-7.5, -2, '#F28A3A'], [1, -3, '#FFD27A']]
    .map(([dx, dy, c]) => `<ellipse cx="${f2(x + dx * s)}" cy="${f2(y + dy * s)}" rx="${f2(2.2 * s)}" ry="${f2(1.3 * s)}" fill="${c}"/>`).join('');
  return disc(u, v, 0, 0.52 * s, 'rgba(120,80,40,.28)')
    + back.map(p => pierreRonde(p.u, p.v, p.r)).join('')
    + disc(u, v, 0.5, 0.29 * s, '#4A3426') + disc(u, v, 0.5, 0.2 * s, '#6B4A33') + braises
    + buche(u - 0.27 * s, v + 0.04 * s, u + 0.22 * s, v + 0.04 * s, 0, 3.4 * s)
    + buche(u + 0.03 * s, v - 0.27 * s, u + 0.03 * s, v + 0.22 * s, 3 * s, 3.2 * s, { top: '#D99A5E', left: '#B47442', right: '#8B5631' })
    + front.map(p => pierreRonde(p.u, p.v, p.r)).join('');
}
// Feu de camp, palier I (cahier des charges du 11 oct.) : le feu au centre (la flamme est animée à part, le jeu y met
// sa lumière et sa fumée), la bûche-banc et son tissu (le skin), la souche et sa hache, la marmite de Cannelle sur sa
// pierre plate, un petit tas de bois
function campfire(skin) {
  const sol = disc(0.05, 0.05, 0, 0.95, 'rgba(150,105,50,.16)');
  const banc = disc(0.64, -0.5, 0, 0.3, 'rgba(120,80,40,.25)') + buche(0.4, -0.52, 0.86, -0.52, 0, 5) + seatCloth(skin);
  // Souche et hache plantée
  const [sx, sy] = P(-0.56, 0.52, 12);
  const souche = disc(-0.56, 0.52, 0, 0.22, 'rgba(120,80,40,.28)')
    + poteau(-0.56, 0.52, 0, 12, 0.15, { top: '#EBC58E', left: '#B47442', right: '#7A4824' }, 'souche')
    + `<ellipse cx="${f2(sx)}" cy="${f2(sy)}" rx="4" ry="2" fill="none" stroke="#B98552" stroke-width="1"/>`
    + trait([sx + 1, sy - 1], [sx + 9, sy - 14], 5.2, ENCRE) + trait([sx + 1, sy - 1], [sx + 9, sy - 14], 2.6, '#C98448')
    + `<path d="M${f2(sx - 3)},${f2(sy - 2)} L${f2(sx + 5)},${f2(sy - 5)} L${f2(sx + 5)},${f2(sy + 2)} Q${f2(sx)},${f2(sy + 3)} ${f2(sx - 3)},${f2(sy - 2)} Z" fill="#B4BEC8" stroke="${ENCRE}" stroke-width="${DETAIL + 0.4}" stroke-linejoin="round"/>`;
  // Marmite noire sur une pierre plate, louche, couvercle entrouvert
  const [mx, my] = P(0.74, 0.24, 9);
  const marmite = pierreRonde(0.74, 0.24, 7.5, { top: '#E3DACA', left: '#C4B79C', right: '#9C8F74' })
    + `<path d="M${f2(mx - 7)},${f2(my - 1)} Q${f2(mx - 8)},${f2(my + 9)} ${f2(mx)},${f2(my + 9)} Q${f2(mx + 8)},${f2(my + 9)} ${f2(mx + 7)},${f2(my - 1)} Z" fill="#3D3A36" stroke="${ENCRE}" stroke-width="${TRAIT}" stroke-linejoin="round"/>`
    + `<ellipse cx="${f2(mx)}" cy="${f2(my - 1)}" rx="7.4" ry="2.8" fill="#55504A" stroke="${ENCRE}" stroke-width="${TRAIT}"/>`
    + `<ellipse cx="${f2(mx - 0.5)}" cy="${f2(my - 1.2)}" rx="5" ry="1.6" fill="#E9A24E"/>`
    + trait([mx + 2, my - 1], [mx + 9, my - 11], 4.4, ENCRE) + trait([mx + 2, my - 1], [mx + 9, my - 11], 2, '#C98448')
    + trait([mx - 5, my + 4], [mx - 2, my + 6], 1.4, 'rgba(255,255,255,.35)');
  // Tas de bois : trois bûches empilées
  const tas = buche(-0.7, -0.28, -0.7, 0.02, 0, 3.4) + buche(-0.56, -0.28, -0.56, 0.02, 0, 3.4) + buche(-0.63, -0.28, -0.63, 0.02, 6, 3.4);
  return sprite(sol + tas + banc + feuChibi(0, 0) + marmite + souche, BUILDING_BOX);
}

// Foyer, niveau 2 : l'Abri. Perches croisées en A, couvertes de branchages (de toile teinte, selon le skin), pignon
// ouvert sur une couche de fourrures ; le feu de camp brûle devant (flamme animée à part, en SHELTER_FIRE)
export const SHELTER_FIRE = [0.5, 0.36];
const BRUSH = { front: '#B5A16A', back: '#8A7446' };
// Feu de camp, palier II (cahier des charges du 11 oct.) : l'abri de branchages au style chibi. Perches rondes
// croisées aux deux bouts, toit épais en deux pans (gros bouquets de feuilles d'origine, ou la couleur du skin), pignon
// ouvert sur la couche de fourrures, un panier de champignons ; le feu brûle devant (flamme animée à part, en SHELTER_FIRE)
function shelter(skin) {
  const u0 = -0.74, u1 = 0.26, v0 = -0.88, v1 = -0.06, z = 1, h = 42, o = 0.13;
  const vm = (v0 + v1) / 2;
  const a = u0 - o, b = u1 + o;
  const roof = roofOf(skin, BRUSH);
  const bord = ` stroke="${ENCRE}" stroke-width="${TRAIT}" stroke-linejoin="round"`;
  // Perches croisées (elles dépassent du faîtage)
  const perches = u => [[v0 - o - 0.05, vm + 0.15], [v1 + o + 0.05, vm - 0.15]].map(([va, vb]) => { const p = P(u, va, z - 1), q = P(u, vb, z + h + 10); return trait(p, q, 6.4, ENCRE) + trait(p, q, 3.4, '#8B5631'); }).join('');
  const at = (u, k) => P(u, vm + (v1 + o - vm) * k, z + h * (1 - k));
  // Bouquets de feuilles d'origine sur le pan avant : grosses feuilles pointues en rangs, vert sur paille
  let feuilles = '';
  if (!skin && !HIVER) {
    const verts = ['#7EB04A', '#6A9A3E', '#8FC25A', '#A7923F'];
    let i = 0;
    for (const k of [0.22, 0.48, 0.74, 0.98]) {
      for (let u = a + 0.06; u < b - 0.02; u += 0.13) {
        const [x, y] = at(u + ((i * 7) % 3) * 0.015, k);
        const rot = -28 + ((i * 13) % 5) * 9;
        feuilles += `<ellipse cx="${f2(x)}" cy="${f2(y)}" rx="7.4" ry="3.6" fill="${verts[i % 4]}" stroke="${ENCRE}" stroke-width="${DETAIL}" transform="rotate(${rot} ${f2(x)} ${f2(y)})"/>`
          + `<line x1="${f2(x - 5)}" y1="${f2(y)}" x2="${f2(x + 5)}" y2="${f2(y)}" stroke="rgba(40,60,20,.45)" stroke-width="0.8" transform="rotate(${rot} ${f2(x)} ${f2(y)})"/>`;
        i++;
      }
    }
  }
  // Couche de fourrures et ballot, dans l'ombre du pignon ouvert
  const [fx, fy] = P(u1 - 0.2, vm + 0.02, 1);
  const couche = `<ellipse cx="${f2(fx)}" cy="${f2(fy)}" rx="12" ry="4.8" fill="#C9A27A" stroke="${ENCRE}" stroke-width="${DETAIL}"/>`
    + `<ellipse cx="${f2(fx - 2)}" cy="${f2(fy - 1.2)}" rx="7.6" ry="2.8" fill="#E8D2AE"/>`
    + `<ellipse cx="${f2(fx + 7)}" cy="${f2(fy - 4)}" rx="4.6" ry="3.4" fill="#8C5A3C" stroke="${ENCRE}" stroke-width="${DETAIL}"/>`;
  // Panier de champignons
  const [px, py] = P(0.42, -0.42, 0);
  const panier = `<path d="M${f2(px - 7)},${f2(py - 7)} L${f2(px - 5.6)},${f2(py)} Q${f2(px)},${f2(py + 2.6)} ${f2(px + 5.6)},${f2(py)} L${f2(px + 7)},${f2(py - 7)} Z" fill="#D9A55C" stroke="${ENCRE}" stroke-width="${DETAIL + 0.4}" stroke-linejoin="round"/>`
    + [-3.5, 0.5, 4].map((dx, i) => `<ellipse cx="${f2(px + dx)}" cy="${f2(py - 8.5 - (i % 2))}" rx="3.2" ry="2.2" fill="${i === 1 ? '#E2574C' : '#C98448'}" stroke="${ENCRE}" stroke-width="1"/>`).join('')
    + `<circle cx="${f2(px + 0.2)}" cy="${f2(py - 10)}" r="0.7" fill="#FFFFFF"/><circle cx="${f2(px + 1.6)}" cy="${f2(py - 9)}" r="0.6" fill="#FFFFFF"/>`
    + `<path d="M${f2(px - 7)},${f2(py - 7)} Q${f2(px)},${f2(py - 17)} ${f2(px + 7)},${f2(py - 7)}" fill="none" stroke="${ENCRE}" stroke-width="2.6"/><path d="M${f2(px - 7)},${f2(py - 7)} Q${f2(px)},${f2(py - 17)} ${f2(px + 7)},${f2(py - 7)}" fill="none" stroke="#D9A55C" stroke-width="1.2"/>`;
  return sprite(
    disc(-0.1, -0.3, 0, 1.0, 'rgba(150,105,50,.16)')
    + perches(a)
    + face([[a, v0 - o, z], [b, v0 - o, z], [b, vm, z + h], [a, vm, z + h]], roof.back, bord)
    + (HIVER ? snowPan(P(a, vm, z + h), P(b, vm, z + h), P(b, v0 - o, z), P(a, v0 - o, z), 0.9) : '')
    + face([[u1, v0, z], [u1, v1, z], [u1, vm, z + h]], '#3B2A1C', bord)
    + couche
    + face([[a, vm, z + h], [b, vm, z + h], [b, v1 + o, z], [a, v1 + o, z]], roof.front, bord)
    + (HIVER ? snowPan(P(a, vm, z + h), P(b, vm, z + h), P(b, v1 + o, z), P(a, v1 + o, z), 0.8, true) : feuilles + (skin ? roofTexture(skin, u0, v0, u1, v1, z, h, o) : ''))
    + trait(P(a - 0.06, vm, z + h + 1), P(b + 0.06, vm, z + h + 1), 7, ENCRE) + trait(P(a - 0.06, vm, z + h + 1), P(b + 0.06, vm, z + h + 1), 3.6, '#8B5631')
    + perches(b)
    + panier
    + disc(-0.4, 0.42, 0, 0.24, 'rgba(120,80,40,.25)') + buche(-0.62, 0.42, -0.2, 0.42, 0, 4.4)
    + feuChibi(SHELTER_FIRE[0], SHELTER_FIRE[1], 0.66),
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
// Puits, palier I (cahier des charges du 11 oct.) : le puits d'Ondin au style chibi. Margelle de grosses pierres rondes,
// couronne claire, eau sombre qui brille ; deux poteaux à jambes de force, treuil rond (corde enroulée, manivelle), seau
// qui pend ; toit épais (version validée : bas, ajusté aux poteaux, glissé vers le sud-est) ; dallage de galets au pied.
// L'axe du treuil garde sa place (la poulie de la boutique s'y accroche, en u = 0.44).
function well(skin) {
  const roof = roofOf(skin, ROOF_RED);
  const pierre = skin === 'pierre-blanche' ? { top: '#FFFFFF', left: '#F1ECE2', right: '#CFC7B8' } : { top: '#ECE5D6', left: '#CDC2AA', right: '#A39780' };
  const bord = ` stroke="${ENCRE}" stroke-width="${TRAIT}" stroke-linejoin="round"`;
  const R = 0.38, H = 17;
  const [x0, y0] = P(0, 0, 0), [, yh] = P(0, 0, H);
  const rx = R * 45.25, ry = R * 22.63;
  // Dallage de galets autour, ombre de contact couleur terre
  let out = disc(0.05, 0.05, 0, 0.7, 'rgba(120,85,45,.2)');
  for (let i = 0; i < 12; i++) { const t = (i / 12) * Math.PI * 2 + 0.3; out += pierreRonde(Math.cos(t) * 0.56, Math.sin(t) * 0.56, 4.2 + (i % 3), { top: '#EFE9DC', left: '#D7CDB8', right: '#B3A68D' }); }
  // Poteau du fond (à gauche) et sa jambe de force
  const poteauBois = (u, d) => bloc(u - 0.05, -0.06, u + 0.05, 0.06, 0, 42, { top: '#B07A48', left: '#9A6236', right: '#764522' }, `wp${u > 0 ? 'd' : 'g'}`)
    + trait(P(u, 0, 28), P(u + d * 0.17, 0, 40), 5.4, ENCRE) + trait(P(u, 0, 28), P(u + d * 0.17, 0, 40), 2.6, '#9A6236');
  out += poteauBois(-0.4, 1);
  // Margelle : fût dégradé, trois rangs de grosses pierres, couronne claire, eau
  out += degrade('wfut', pierre.left, pierre.right)
    + `<path d="M${f2(x0 - rx)},${f2(yh)} L${f2(x0 - rx)},${f2(y0)} A${f2(rx)},${f2(ry)} 0 0 0 ${f2(x0 + rx)},${f2(y0)} L${f2(x0 + rx)},${f2(yh)} Z" fill="url(#wfut)"${bord}/>`;
  for (let r = 0; r < 3; r++) {
    const z = (r + 1) * (H / 3);
    out += `<path d="M${f2(x0 - rx)},${f2(y0 - z + 0.4)} A${f2(rx)},${f2(ry)} 0 0 0 ${f2(x0 + rx)},${f2(y0 - z + 0.4)}" fill="none" stroke="rgba(70,55,35,.5)" stroke-width="${DETAIL}"/>`;
    for (let a = r % 2 ? 0.45 : 0.85; a < Math.PI - 0.2; a += 0.8) { const px = x0 + rx * Math.cos(a), py = y0 + ry * Math.sin(a); out += trait([px, py - z + (H / 3)], [px, py - z], DETAIL, 'rgba(70,55,35,.5)'); }
  }
  out += `<ellipse cx="${f2(x0)}" cy="${f2(yh)}" rx="${f2(rx * 1.08)}" ry="${f2(ry * 1.08)}" fill="${pierre.top}"${bord}/>`
    + `<ellipse cx="${f2(x0)}" cy="${f2(yh + 0.6)}" rx="${f2(rx * 0.74)}" ry="${f2(ry * 0.7)}" fill="#24506C" stroke="${ENCRE}" stroke-width="${DETAIL}"/>`
    + `<ellipse cx="${f2(x0 - rx * 0.2)}" cy="${f2(yh - 0.4)}" rx="${f2(rx * 0.3)}" ry="${f2(ry * 0.18)}" fill="#4C8DB0"/>`
    + `<path d="M${f2(x0 + rx * 0.2)},${f2(yh + 2)} q2,-1.4 4,0" stroke="#BFE3F5" stroke-width="1.2" fill="none"/>`
    + `<path d="M${f2(x0 - rx * 0.95)},${f2(yh + 1)} A${f2(rx * 0.95)},${f2(ry * 0.95)} 0 0 1 ${f2(x0 - rx * 0.1)},${f2(yh - ry * 0.95)}" fill="none" stroke="rgba(255,255,255,.7)" stroke-width="1.6"/>`
    // mousse au pied
    + `<path d="M${f2(x0 - rx * 0.8)},${f2(y0 + ry * 0.55)} q4,-5 9,-1.6 q3,-3 7,0.4 q2,2 0,3 Z" fill="#7FBF5C" stroke="${ENCRE}" stroke-width="1"/>`;
  // Poteau de devant, treuil rond le long de u (corde enroulée), manivelle à gauche, seau qui pend
  out += poteauBois(0.4, -1);
  const ax0 = P(-0.44, 0, 33), ax1 = P(0.44, 0, 33);
  out += trait(ax0, ax1, 9, ENCRE) + trait(ax0, ax1, 6.4, '#C98A52') + trait([ax0[0], ax0[1] - 1.6], [ax1[0], ax1[1] - 1.6], 1.4, 'rgba(255,230,190,.6)')
    + [-0.12, -0.04, 0.04, 0.12].map(u => { const c = P(u, 0, 33); return `<ellipse cx="${f2(c[0])}" cy="${f2(c[1])}" rx="1.6" ry="3.6" fill="#E8C489" stroke="${ENCRE}" stroke-width="0.9"/>`; }).join('');
  const m0 = P(-0.46, 0, 33), m1 = P(-0.56, 0, 33), m2 = P(-0.56, 0.14, 25);
  out += trait(m0, m1, 4.4, ENCRE) + trait(m1, m2, 4.4, ENCRE) + trait(m0, m1, 2, '#8E99A4') + trait(m1, m2, 2, '#8E99A4')
    + trait(m2, P(-0.68, 0.14, 25), 6, ENCRE) + trait(m2, P(-0.68, 0.14, 25), 3.4, '#C98A52');
  const [sx, sy] = P(0, 0, 25);
  out += trait(P(0.02, 0, 33), [sx, sy - 6], 1.6, '#7A5A3A')
    + `<path d="M${f2(sx - 5.4)},${f2(sy - 6)} L${f2(sx - 4.4)},${f2(sy + 1)} Q${f2(sx)},${f2(sy + 3)} ${f2(sx + 4.4)},${f2(sy + 1)} L${f2(sx + 5.4)},${f2(sy - 6)} Z" fill="#B47442" stroke="${ENCRE}" stroke-width="${TRAIT}" stroke-linejoin="round"/>`
    + `<ellipse cx="${f2(sx)}" cy="${f2(sy - 6)}" rx="5.4" ry="1.8" fill="#7A4824" stroke="${ENCRE}" stroke-width="1.2"/>`
    + trait([sx - 5, sy - 2.4], [sx + 5, sy - 2.4], 1.6, '#8E99A4')
    + `<path d="M${f2(sx - 5.4)},${f2(sy - 6)} Q${f2(sx)},${f2(sy - 13)} ${f2(sx + 5.4)},${f2(sy - 6)}" fill="none" stroke="${ENCRE}" stroke-width="1.4"/>`;
  // Toit : bas, ajusté aux poteaux et glissé vers le sud-est (+u), pans épais, tuiles rondes, faîtière, épi
  const [u0, u1, v0, v1, z, hr, o] = [-0.37, 0.57, -0.3, 0.3, 42, 13, 0.08];
  out += gable(u0, v0, u1, v1, z, hr, { front: roof.front, back: roof.back, gable: '#8B5631' }, o, bord)
    + roofTextureOf(skin, 'toit-rouge', u0, v0, u1, v1, z, hr, o);
  const r0 = P(u0 - o, 0, z + hr), r1 = P(u1 + o, 0, z + hr);
  out += trait(r0, r1, 7, ENCRE) + trait(r0, r1, 3.6, HIVER ? '#F6FAFD' : mixHex(roof.back, '#3C2819', 0.25));
  const [ex, ey] = r1;
  out += trait([ex, ey], [ex, ey - 6], 3.6, ENCRE) + trait([ex, ey], [ex, ey - 6], 1.6, '#8B5631')
    + `<circle cx="${f2(ex)}" cy="${f2(ey - 7.5)}" r="2.2" fill="#F2C04B" stroke="${ENCRE}" stroke-width="1.1"/>`;
  // Touffes et fleurettes
  out += touffePuits(-0.5, 0.42) + touffePuits(0.52, 0.36)
    + `<circle cx="${f2(P(-0.56, 0.48, 3)[0])}" cy="${f2(P(-0.56, 0.48, 3)[1])}" r="1.8" fill="#FFD45E" stroke="${ENCRE}" stroke-width="0.8"/>`;
  return sprite(out, BUILDING_BOX);
}
function touffePuits(u, v) {
  const [x, y] = P(u, v, 0);
  return `<path d="M${f2(x - 3)},${f2(y)} Q${f2(x - 4)},${f2(y - 5)} ${f2(x - 5.5)},${f2(y - 7)} Q${f2(x - 2)},${f2(y - 4)} ${f2(x - 0.6)},${f2(y - 0.6)} Q${f2(x)},${f2(y - 6)} ${f2(x + 0.6)},${f2(y - 9)} Q${f2(x + 1.8)},${f2(y - 4.6)} ${f2(x + 1.4)},${f2(y - 0.6)} Q${f2(x + 3)},${f2(y - 3.6)} ${f2(x + 5.6)},${f2(y - 5)} Q${f2(x + 3.6)},${f2(y - 2)} ${f2(x + 3)},${f2(y)} Z" fill="#6DB04F" stroke="${ENCRE}" stroke-width="1.1" stroke-linejoin="round"/>`;
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
    rows += furrow(-0.78, 0.78, v, 0.07, 4);
  }
  let plants = '';
  for (let k = 0; k < 4; k++) {
    for (let j = 0; j < 5; j++) {
      const u = -0.62 + j * 0.31;
      const v = -0.6 + k * 0.38;
      const [x, y] = P(u, v, 4);
      const carrot = (j + k) % 2 === 0;
      plants += carrot
        ? `<path d="M${x},${y} q-3,-7 -5,-9 M${x},${y} q0,-8 0,-11 M${x},${y} q3,-7 5,-9" stroke="#3C2819" stroke-width="3.2" fill="none" stroke-linecap="round"/><path d="M${x},${y} q-3,-7 -5,-9 M${x},${y} q0,-8 0,-11 M${x},${y} q3,-7 5,-9" stroke="#5DAA45" stroke-width="2" fill="none" stroke-linecap="round"/><ellipse cx="${x}" cy="${y + 0.5}" rx="2.6" ry="1.4" fill="#F08A3A" stroke="#3C2819" stroke-width="0.5"/>`
        : leafPair(x, y, 3.4, 2, 3);
    }
  }
  return sprite(shadow(0, 0, 1.15, 0.14) + gardenFence(skin) + soilBed(-0.85, -0.85, 0.85, 0.85, 4) + rows + plants, BUILDING_BOX);
}

// Atelier : appentis de bois et four de briques à cheminée ronde, enclume devant
// Enseigne dorée (skin) accrochée au mur gauche d'un atelier, à la hauteur z
export function goldenSign(u, v, z) {
  const [x, y] = P(u, v, z);
  return `<line x1="${x}" y1="${y}" x2="${x - 9}" y2="${y + 4.5}" stroke="#5E3A22" stroke-width="1.6"/>`
    + `<path d="M${x - 16},${y + 5} h12 v9 q-6,5 -12,0 Z" fill="#F2C04B" stroke="#8A6A22" stroke-width="1"/>`
    + `<path d="M${x - 13},${y + 8} l3,3 l4,-4" stroke="#8A6A22" stroke-width="1.2" fill="none"/>`;
}
// Enclume de fer sur son billot à cernes en (u, v) : pied, taille, table, bigorne pointée vers +u
function anvil(u, v) {
  const [tx, ty] = P(u, v, 8);
  const [hx, hy] = P(u + 0.11, v, 14.5);
  return shadow(u, v, 0.2, 0.2)
    + cylinder(u, v, 0, 8, 0.1, { top: '#E7C08A', left: WOOD.left, right: WOOD.right }, 'blockg')
    + `<ellipse cx="${f2(tx)}" cy="${f2(ty)}" rx="3.4" ry="1.7" fill="none" stroke="#B98552" stroke-width="0.6"/>`
    + box(u - 0.07, v - 0.04, u + 0.05, v + 0.04, 8, 10, IRON_C) + box(u - 0.04, v - 0.025, u + 0.02, v + 0.025, 10, 12, IRON_C)
    + box(u - 0.1, v - 0.05, u + 0.07, v + 0.05, 12, 15, IRON_C)
    + `<path d="M${P(u + 0.07, v - 0.05, 15).map(f2).join(',')} L${f2(hx + 6)},${f2(hy + 1.6)} L${P(u + 0.07, v + 0.05, 12).map(f2).join(',')} L${P(u + 0.07, v + 0.05, 15).map(f2).join(',')} Z" fill="${IRON_C.right}" stroke="#3C2819" stroke-width="0.6" stroke-linejoin="round"/>`
    + `<polyline points="${P(u - 0.09, v + 0.045, 15).map(f2).join(',')} ${P(u + 0.06, v + 0.045, 15).map(f2).join(',')}" stroke="#DDE4EA" stroke-width="0.8"/>`;
}
const IRON_C = { top: '#9AA6B2', left: '#7C8894', right: '#5F6A75' };
// Atelier, palier I (cahier des charges du 11 oct.) : l'atelier de Rivet au style chibi. Grange de planches sur un
// soubassement de pierres, porte cintrée à double battant à la hauteur d'Aster, fenêtre chaude, gros toit de bardeaux
// (ou celui du skin) ; le four de briques rondes et sa bouche qui rougeoie (le jeu y met sa lumière), sa cheminée (sa
// fumée) ; l'enclume sur son billot, des outils au mur.
function workshop(skin) {
  const u0 = -0.84, u1 = 0.16, v0 = -0.58, v1 = 0.46, H = 42;
  const roof = roofOf(skin, { front: '#9A6F48', back: '#7A5536' });
  const bord = ` stroke="${ENCRE}" stroke-width="${TRAIT}" stroke-linejoin="round"`;
  const PL = { top: '#D9A262', left: '#C98448', right: '#9E5F30' };
  const pts = l => l.map(([x, y]) => `${f2(x)},${f2(y)}`).join(' ');
  let out = disc(0, 0.05, 0, 1.05, 'rgba(120,85,45,.18)');
  // Soubassement de pierres, murs de planches (planches verticales larges)
  out += bloc(u0 - 0.03, v0 - 0.03, u1 + 0.03, v1 + 0.03, 0, 6, { top: '#D7CDB8', left: '#BDB096', right: '#968A72' }, 'atsoc')
    + bloc(u0, v0, u1, v1, 6, H, PL, 'atmur');
  for (let u = u0 + 0.14; u < u1 - 0.04; u += 0.14) out += trait(P(u, v1, 7), P(u, v1, H - 1), 1.1, 'rgba(70,40,20,.35)');
  for (let v = v0 + 0.14; v < v1 - 0.04; v += 0.14) out += trait(P(u1, v, 7), P(u1, v, H - 1), 1.1, 'rgba(40,20,10,.35)');
  // Porte cintrée à double battant (côté joueur), ferrures, poignées
  const um = -0.36, r = 0.2, hd = 38;
  const arc = Array.from({ length: 13 }, (_, k) => { const t = Math.PI - (k / 12) * Math.PI; return P(um + Math.cos(t) * r, v1, 6 + hd - r * 34 + Math.sin(t) * r * 34); });
  out += `<polygon points="${pts([P(um - r, v1, 6), ...arc, P(um + r, v1, 6)])}" fill="#6A3F22"${bord}/>`
    + trait(P(um, v1, 6), P(um, v1, 6 + hd), 1.6, ENCRE)
    + [14, 30].map(z => trait(P(um - r + 0.03, v1, 6 + z), P(um + r - 0.03, v1, 6 + z), 2.2, '#55504A')).join('')
    + [-0.05, 0.05].map(du => `<circle cx="${f2(P(um + du, v1, 6 + 20)[0])}" cy="${f2(P(um + du, v1, 6 + 20)[1])}" r="1.5" fill="#F2C04B" stroke="${ENCRE}" stroke-width="0.8"/>`).join('');
  // Outils accrochés au mur : marteau et tenailles
  const [tx, ty] = P(-0.72, v1, 30);
  out += trait([tx, ty], [tx + 2, ty + 12], 4.2, ENCRE) + trait([tx, ty], [tx + 2, ty + 12], 2, '#C98448')
    + `<rect x="${f2(tx - 4)}" y="${f2(ty - 3)}" width="8" height="5" rx="1.5" fill="#8E99A4" stroke="${ENCRE}" stroke-width="1.2"/>`
    + trait([tx - 8, ty + 2], [tx - 6, ty + 14], 2.4, '#55504A') + trait([tx - 4, ty + 2], [tx - 6, ty + 14], 2.4, '#55504A');
  // Fenêtre (côté +u) : vitre chaude, croisillon, appui
  const vc = -0.06, w = 0.14, zb = 18, zh = 32;
  out += `<polygon points="${pts([P(u1, vc - w, zb), P(u1, vc + w, zb), P(u1, vc + w, zh), P(u1, vc - w, zh)])}" fill="#FFE6A3"${bord}/>`
    + trait(P(u1, vc, zb), P(u1, vc, zh), DETAIL, ENCRE) + trait(P(u1, vc - w, (zb + zh) / 2), P(u1, vc + w, (zb + zh) / 2), DETAIL, ENCRE)
    + bloc(u1, vc - w - 0.02, u1 + 0.05, vc + w + 0.02, zb - 2.5, zb, PL, 'atappui');
  // Gros toit : pans épais, bardeaux en rangs (ou la texture du skin), faîtière ; enseigne dorée (skin)
  const [zr, hr, o] = [H, 22, 0.12];
  out += gable(u0, v0, u1, v1, zr, hr, { front: roof.front, back: roof.back, gable: PL.right }, o, bord)
    + (roofTextureOf(skin, null, u0, v0, u1, v1, zr, hr, o) || (HIVER ? '' : bardeaux(u0, v0, u1, v1, zr, hr, o)));
  const vm = (v0 + v1) / 2, r0 = P(u0 - o, vm, zr + hr), r1 = P(u1 + o, vm, zr + hr);
  out += trait(r0, r1, 7, ENCRE) + trait(r0, r1, 3.6, HIVER ? '#F6FAFD' : mixHex(roof.back, '#3C2819', 0.2));
  if (skin === 'enseigne-doree') out += goldenSign(0.05, v1, 30);
  // Four de briques rondes : socle, voûte bombée, bouche qui rougeoie (côté +u), cheminée ronde à chapeau
  const K = { u0: 0.26, u1: 0.86, v0: -0.4, v1: 0.3 };
  out += bloc(K.u0, K.v0, K.u1, K.v1, 0, 18, { top: '#E89670', left: '#CF7550', right: '#A5563A' }, 'atfour');
  for (let z = 4.5; z < 18; z += 4.5) out += trait(P(K.u0, K.v1, z), P(K.u1, K.v1, z), 1, 'rgba(90,35,20,.45)') + trait(P(K.u1, K.v0, z), P(K.u1, K.v1, z), 1, 'rgba(70,25,15,.45)');
  for (let z = 0, row = 0; z < 18; z += 4.5, row++) {
    for (let u = K.u0 + (row % 2 ? 0.1 : 0.2); u < K.u1 - 0.02; u += 0.2) out += trait(P(u, K.v1, z), P(u, K.v1, z + 4.5), 1, 'rgba(90,35,20,.45)');
    for (let v = K.v0 + (row % 2 ? 0.1 : 0.2); v < K.v1 - 0.02; v += 0.2) out += trait(P(K.u1, v, z), P(K.u1, v, z + 4.5), 1, 'rgba(70,25,15,.45)');
  }
  const [dx, dy] = P((K.u0 + K.u1) / 2, (K.v0 + K.v1) / 2, 18);
  out += `<path d="M${f2(P(K.u0, K.v1, 18)[0])},${f2(P(K.u0, K.v1, 18)[1])} Q${f2(dx - 6)},${f2(dy - 22)} ${f2(P(K.u1, K.v0, 18)[0])},${f2(P(K.u1, K.v0, 18)[1])} L${f2(P(K.u1, K.v1, 18)[0])},${f2(P(K.u1, K.v1, 18)[1])} Z" fill="#D8805A"${bord}/>`
    + `<path d="M${f2(P(K.u0, K.v1, 18)[0] + 6)},${f2(P(K.u0, K.v1, 18)[1] - 6)} Q${f2(dx - 8)},${f2(dy - 17)} ${f2(dx + 6)},${f2(dy - 14)}" fill="none" stroke="rgba(255,220,190,.55)" stroke-width="2"/>`;
  const bouche = Array.from({ length: 9 }, (_, k) => { const t = Math.PI - (k / 8) * Math.PI; return P(K.u1, -0.05 + Math.cos(t) * 0.13, 3 + Math.sin(t) * 9); });
  out += `<polygon points="${pts([P(K.u1, -0.18, 1), ...bouche, P(K.u1, 0.08, 1)])}" fill="#3A1E14"${bord}/>`
    + `<ellipse cx="${f2(P(K.u1, -0.05, 3)[0])}" cy="${f2(P(K.u1, -0.05, 3)[1])}" rx="5" ry="2.6" fill="#F28A3A"/>`
    + `<ellipse cx="${f2(P(K.u1, -0.05, 3)[0])}" cy="${f2(P(K.u1, -0.05, 3)[1] - 0.6)}" rx="2.6" ry="1.3" fill="#FFE07A"/>`;
  out += poteau(0.55, -0.05, 24, 42, 0.085, { top: '#5E3A2A', left: '#CF7550', right: '#A5563A' }, 'atchem')
    + bloc(0.47, -0.13, 0.63, 0.03, 42, 45, { top: '#B9B2A2', left: '#968E7C', right: '#736B5B' }, 'atchap');
  // Enclume sur son billot, marteau posé
  out += anvil(0.38, 0.66);
  return sprite(out, BUILDING_BOX);
}
// Bardeaux de bois chibi sur le pan avant d'un toit à deux pans : quatre rangs de larges écailles, joints décalés
function bardeaux(u0, v0, u1, v1, z, h, o) {
  const vm = (v0 + v1) / 2, a = u0 - o, b = u1 + o, ve = v1 + o;
  const at = (u, k) => P(u, vm + (ve - vm) * k, z + h * (1 - k));
  let out = '';
  [0.22, 0.44, 0.66, 0.88].forEach((k, r) => {
    let d = '';
    for (let u = a + (r % 2 ? 0.08 : 0); u < b - 0.01; u += 0.16) {
      const p0 = at(Math.max(a, u), k), p1 = at(Math.min(b, u + 0.16), k);
      d += `${d ? '' : `M${f2(p0[0])},${f2(p0[1])}`} Q${f2((p0[0] + p1[0]) / 2)},${f2((p0[1] + p1[1]) / 2 + 3.5)} ${f2(p1[0])},${f2(p1[1])}`;
    }
    out += `<path d="${d}" fill="none" stroke="rgba(60,35,20,.5)" stroke-width="1.3" stroke-linecap="round"/>`;
  });
  return out + trait(at(a + 0.04, 0.06), at(b - 0.04, 0.06), 1.8, 'rgba(255,235,200,.35)');
}

// Ponton : anse d'eau, appontement sur pilotis, petit voilier amarré (la voile et la coque bercée sont à part)
// Ponton, palier I (cahier des charges du 11 oct.) : sur le sable, une plateforme de grosses planches sur pilotis ;
// une passerelle part vers la mer (+v : le Ponton est posé au bord du rivage) et avance au-dessus de l'eau, que le jeu
// dessine dessous (aucune flaque ici). Au bout, deux bittes d'amarrage et la barque (dessinée à part : barqueI).
export const PONTON1_BOX = { x: -106, y: -124, w: 182, h: 222 };
// Tablier de planches de [u0, u1] × [v0, v1] à la hauteur z ; long : 'u' (planches en travers, le long de v) ou 'v'
function tablier(u0, v0, u1, v1, z, long, id) {
  const e = 4;
  let out = bloc(u0, v0, u1, v1, z - e, z, BOIS, id);
  const n = Math.max(2, Math.round((long === 'u' ? u1 - u0 : v1 - v0) / 0.22));
  const g = 0.016;
  for (let i = 0; i < n; i++) {
    const a = (long === 'u' ? u0 : v0) + (i * (long === 'u' ? u1 - u0 : v1 - v0)) / n, b = a + (long === 'u' ? u1 - u0 : v1 - v0) / n;
    const q = long === 'u' ? [[a + g, v0 + g, z], [b - g, v0 + g, z], [b - g, v1 - g, z], [a + g, v1 - g, z]] : [[u0 + g, a + g, z], [u1 - g, a + g, z], [u1 - g, b - g, z], [u0 + g, b - g, z]];
    out += chibiPoly(q, [BOIS.clair, mixHex(BOIS.top, BOIS.clair, 0.45), BOIS.top][i % 3], DETAIL);
    // veine du bois et deux clous au bout de chaque planche, côté joueur
    const m = long === 'u' ? [P((a + b) / 2 - 0.02, v0 + 0.12, z), P((a + b) / 2 - 0.02, v1 - 0.2, z)] : [P(u0 + 0.12, (a + b) / 2 - 0.02, z), P(u1 - 0.2, (a + b) / 2 - 0.02, z)];
    out += trait(m[0], m[1], 0.8, 'rgba(150,90,40,.35)');
    const c = long === 'u' ? P((a + b) / 2, v1 - 0.07, z) : P(u1 - 0.07, (a + b) / 2, z);
    out += `<circle cx="${f2(c[0] - 2.4)}" cy="${f2(c[1])}" r="0.95" fill="${BOIS.joint}"/><circle cx="${f2(c[0] + 2.4)}" cy="${f2(c[1])}" r="0.95" fill="${BOIS.joint}"/>`;
  }
  return out + chibiPoly([[u0, v0, z], [u1, v0, z], [u1, v1, z], [u0, v1, z]], 'none', TRAIT);
}
// Ponton, palier I (cahier des charges du 11 oct.) : posé au bord du rivage. Sur le sable, un palier de planches (la
// caisse, le tonnelet, la corde) ; une large jetée part du sable vers la mer (+v) et avance au-dessus de l'eau, que le jeu
// dessine dessous (aucune flaque ici). Au bout, les bittes d'amarrage ; la barque est dessinée à part (barqueI).
// Le corps commun des paliers I et II du Ponton (milieu : peint entre la jetée et le palier du sable, ce qui se tient
// derrière lui, la cabane ; dessus : posé sur le palier, après le reste)
export function pontonCorps(milieu = '', dessus = '', { caisse: [cu0, cv0] = [0.32, -0.42], tonnelet: [tu, tv] = [0.12, -0.32], proue = 0.52 } = {}) {
  const Z = 10;
  const quai = { u0: -0.05, u1: 0.8, v0: -0.5, v1: 0.3 };
  const jet = { u0: -0.88, u1: -0.05, v0: -0.82, v1: 2.32 };
  const ombre = [[jet.u0, jet.v0, 0], [quai.u1, jet.v0 + 0.32, 0], [quai.u1, quai.v1, 0], [jet.u1, quai.v1, 0], [jet.u1, 0.98, 0], [jet.u0, 0.98, 0]]
    .map(p => P(...p)).map(([x, y]) => `${f2(x + 3)},${f2(y + 4)}`).join(' ');
  const pieu = (u, v, z0, i) => poteau(u, v, z0, Z - 4, 0.075, WOOD_DARK, `pp${i}`);
  // Pilotis du sable (sur leurs galets), puis ceux de la mer, plus longs, l'écume au pied
  let pieux = '';
  [[0.72, -0.42], [0.72, 0.22], [0.36, 0.22]].forEach(([u, v], i) => { pieux += galet(u + 0.06, v + 0.06, 3.4) + pieu(u, v, 0, i); });
  [[-0.8, -0.2], [-0.13, -0.2], [-0.8, 0.4], [-0.13, 0.4], [-0.8, 0.92], [-0.13, 0.92]].forEach(([u, v], i) => { pieux += galet(u + 0.07, v + 0.05, 3) + pieu(u, v, 0, 10 + i); });
  [[-0.8, 1.3], [-0.13, 1.3], [-0.8, 1.78], [-0.13, 1.78], [-0.8, 2.24], [-0.13, 2.24]].forEach(([u, v], i) => { pieux += pieu(u, v, MER, 20 + i) + ecume(u, v, 0.1); });
  // Bittes d'amarrage au bord de la jetée, côté barque, la corde enroulée
  const bitte = (u, v, i) => poteau(u, v, Z, Z + 11, 0.075, WOOD_DARK, `pb${i}`)
    + `<ellipse cx="${f2(P(u, v, Z + 6)[0])}" cy="${f2(P(u, v, Z + 6)[1])}" rx="4.2" ry="2.1" fill="none" stroke="${ENCRE}" stroke-width="3.4"/><ellipse cx="${f2(P(u, v, Z + 6)[0])}" cy="${f2(P(u, v, Z + 6)[1])}" rx="4.2" ry="2.1" fill="none" stroke="#E8C489" stroke-width="1.6"/>`;
  const amarre = (a, b) => `<path d="M${f2(a[0])},${f2(a[1])} Q${f2((a[0] + b[0]) / 2)},${f2(Math.max(a[1], b[1]) + 6)} ${f2(b[0])},${f2(b[1])}" fill="none" stroke="${ENCRE}" stroke-width="3.2" stroke-linecap="round"/><path d="M${f2(a[0])},${f2(a[1])} Q${f2((a[0] + b[0]) / 2)},${f2(Math.max(a[1], b[1]) + 6)} ${f2(b[0])},${f2(b[1])}" fill="none" stroke="#E8C489" stroke-width="1.5" stroke-linecap="round"/>`;
  // Caisse de poissons, tonnelet, corde lovée sur le palier du sable
  const poisson = (u, v, flip) => { const [x, y] = P(u, v, Z + 15); const d = flip ? -1 : 1; return `<path d="M${f2(x - 7 * d)},${f2(y)} Q${f2(x - 1 * d)},${f2(y - 4.4)} ${f2(x + 5 * d)},${f2(y)} Q${f2(x - 1 * d)},${f2(y + 3.6)} ${f2(x - 7 * d)},${f2(y)} Z M${f2(x + 4.4 * d)},${f2(y)} L${f2(x + 9 * d)},${f2(y - 3.6)} L${f2(x + 9 * d)},${f2(y + 3.6)} Z" fill="#A9CBE0" stroke="${ENCRE}" stroke-width="${DETAIL}" stroke-linejoin="round"/><circle cx="${f2(x - 4 * d)}" cy="${f2(y - 0.8)}" r="1" fill="${ENCRE}"/>`; };
  const caisse = bloc(cu0, cv0, cu0 + 0.34, cv0 + 0.32, Z, Z + 15, { top: '#E9B97C', left: '#D0904F', right: '#A8683A' }, 'pcaisse')
    + trait(P(cu0, cv0 + 0.32, Z + 7.5), P(cu0 + 0.34, cv0 + 0.32, Z + 7.5), DETAIL) + trait(P(cu0 + 0.34, cv0, Z + 7.5), P(cu0 + 0.34, cv0 + 0.32, Z + 7.5), DETAIL)
    + poisson(cu0 + 0.13, cv0 + 0.12, false) + poisson(cu0 + 0.22, cv0 + 0.22, true);
  const tonnelet = poteau(tu, tv, Z, Z + 13, 0.1, { top: '#C98448', left: '#D99858', right: '#9E5F30' }, 'pton')
    + [Z + 3.5, Z + 9.5].map(z => { const [x, y] = P(tu, tv, z); return `<path d="M${f2(x - 4.5)},${f2(y)} A4.5,2.26 0 0 0 ${f2(x + 4.5)},${f2(y)}" fill="none" stroke="${ENCRE}" stroke-width="1.6"/>`; }).join('');
  return `<polygon points="${ombre}" fill="${SABLE.ombre}"/>`
    + pieux
    + tablier(jet.u0, jet.v0, jet.u1, jet.v1, Z, 'v', 'pj')
    + milieu
    + tablier(quai.u0, quai.v0, quai.u1, quai.v1, Z, 'u', 'pq')
    + tonnelet + caisse + dessus + cordeLovee(-0.45, 0.1, Z, 1.15)
    + bitte(-0.15, 1.5, 1) + bitte(-0.15, 2.1, 2)
    + amarre(P(-0.15, 1.5, Z + 6), P(proue, 1.42, MER + 19));
}
function pier() {
  return sprite(pontonCorps(), PONTON1_BOX);
}
// La barque du palier I, sur la mer, à droite de la jetée, le long du rivage : coque ronde le long de u, tonture
// (le plat-bord remonte aux deux bouts), bordé clair à liston bleu, intérieur à membrures, deux bancs, avirons rentrés,
// mât et voile ferlée (la couleur du skin). Le jeu la berce à part.
export function barqueI(skin, cu = 1.2) {
  const sail = SAILS[skin];
  // Coque le long de u (la proue vers la jetée, -u ; la poupe vers +u), au large du rivage (cu : sa place le long du rivage)
  const [cv, z] = [1.42, MER];
  const L = 0.72, W = 0.28, F = 14;
  const half = t => (t > 0 ? W * Math.cos((t * Math.PI) / 2) ** 0.6 : W * (1 - 0.3 * t * t));
  const tonture = t => F + 4 * t * t + (t > 0 ? 2.5 * t : 0);
  const at = (t, k, zz) => P(cu - t * L, cv + k * half(t), zz);
  const T = [-1, -0.75, -0.45, -0.1, 0.25, 0.55, 0.8, 1];
  const bordP = T.map(t => at(t, 1, z + tonture(t))), bordM = T.map(t => at(t, -1, z + tonture(t)));
  const eauP = T.map(t => at(t, 0.82, z)), eauM = T.map(t => at(t, -0.82, z));
  // Chemin lisse : courbes passant par les points (ouvert)
  const lisse = (l, debut = true) => {
    let d = debut ? `M${f2(l[0][0])},${f2(l[0][1])}` : ` L${f2(l[0][0])},${f2(l[0][1])}`;
    for (let i = 1; i < l.length - 1; i++) { const m = [(l[i][0] + l[i + 1][0]) / 2, (l[i][1] + l[i + 1][1]) / 2]; d += ` Q${f2(l[i][0])},${f2(l[i][1])} ${f2(m[0])},${f2(m[1])}`; }
    const e = l[l.length - 1];
    return `${d} L${f2(e[0])},${f2(e[1])}`;
  };
  const coque = `${lisse(bordP)}${lisse(eauP.slice().reverse(), false)} Z`;
  const creux = `${lisse(bordP)}${lisse(bordM.slice().reverse(), false)} Z`;
  const fond = T.map(t => at(t, 0.55, z + tonture(t) - 5)), fondM = T.map(t => at(t, -0.55, z + tonture(t) - 5));
  const sol = `${lisse(fond.slice(1, -1))}${lisse(fondM.slice(1, -1).reverse(), false)} Z`;
  const liston = T.map(t => at(t, 1.0, z + tonture(t) - 4));
  let out = `<path d="${lisse(eauP.map(([x, y]) => [x + 3, y + 4]))}${lisse(eauM.slice().reverse().map(([x, y]) => [x + 3, y + 4]), false)} Z" fill="rgba(20,55,95,.28)"/>`
    + degrade('bq-flanc', '#E8B070', '#A86636', true)
    + `<path d="${coque}" fill="url(#bq-flanc)" stroke="${ENCRE}" stroke-width="${TRAIT}" stroke-linejoin="round"/>`
    + `<path d="${lisse(liston)}" fill="none" stroke="#4C7FB5" stroke-width="3"/>`
    // Tableau arrière (poupe, face vers +u)
    + `<path d="M${f2(bordP[0][0])},${f2(bordP[0][1])} L${f2(eauP[0][0])},${f2(eauP[0][1])} L${f2(eauM[0][0])},${f2(eauM[0][1])} L${f2(bordM[0][0])},${f2(bordM[0][1])} Z" fill="#9E5F30" stroke="${ENCRE}" stroke-width="${TRAIT}" stroke-linejoin="round"/>`
    // Intérieur : creux sombre, fond clair
    + `<path d="${creux}" fill="#7A4824" stroke="${ENCRE}" stroke-width="${TRAIT}" stroke-linejoin="round"/>`
    + `<path d="${sol}" fill="#D9A262"/>`;
  // Plat-bord clair, côté qu'on voit
  out += `<path d="${lisse(bordP)}" fill="none" stroke="#F6E2BC" stroke-width="2.2" stroke-linecap="round"/>`;
  // Gréement : mât au milieu, bôme choquée vers la droite de l'écran (vers -v), voile triangulaire bien pleine
  const M = [cu + 0.02, cv];
  const pied = P(...M, z + F - 5), tete = P(...M, z + 80);
  const clew = P(M[0] + 0.58, M[1] - 0.58, z + 22), tack = P(...M, z + 22);
  const main = sail && sail[0] !== 'stripes' ? sail[0] : '#FFF8EA';
  const ombreV = sail && sail[0] !== 'stripes' ? mixHex(sail[0], '#3C2819', 0.2) : '#E9D9B8';
  const chute = [(tete[0] + clew[0]) / 2 + 9, (tete[1] + clew[1]) / 2 - 1];
  const forme = `M${f2(tete[0])},${f2(tete[1] + 3)} Q${f2(chute[0])},${f2(chute[1])} ${f2(clew[0])},${f2(clew[1])} L${f2(tack[0])},${f2(tack[1])} Z`;
  let voile = degrade('bq-voile', mixHex(main, '#FFFFFF', 0.2), ombreV) + `<path d="${forme}" fill="url(#bq-voile)"/>`;
  if (sail && sail[0] === 'stripes') {
    voile += `<defs><clipPath id="bq-vc"><path d="${forme}"/></clipPath></defs><g clip-path="url(#bq-vc)">`
      + [0.28, 0.6].map(k => { const y = tete[1] + (tack[1] - tete[1]) * k; return `<rect x="${f2(tack[0])}" y="${f2(y)}" width="40" height="8" fill="${sail[1]}"/>`; }).join('') + '</g>';
  }
  voile += `<path d="M${f2(tete[0] + 2)},${f2(tete[1] + 10)} Q${f2(chute[0] - 6)},${f2(chute[1] + 2)} ${f2(clew[0] - 9)},${f2(clew[1] - 4)}" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="2.4" stroke-linecap="round"/>`
    + `<path d="${forme}" fill="none" stroke="${ENCRE}" stroke-width="${TRAIT}" stroke-linejoin="round"/>`;
  const espar = (p, q, w, c) => trait(p, q, w + 2.6, ENCRE) + trait(p, q, w, c);
  const mat = espar(pied, tete, 2.6, '#8B5631') + espar(tack, clew, 2.2, '#A9703F')
    + `<circle cx="${f2(tete[0])}" cy="${f2(tete[1])}" r="2.4" fill="#F2C04B" stroke="${ENCRE}" stroke-width="${DETAIL}"/>`
    + `<path d="M${f2(tete[0] + 1)},${f2(tete[1] + 2)} q7,-1 13,2.4 q-6,1.6 -13,3.6 Z" fill="#E2574C" stroke="${ENCRE}" stroke-width="${DETAIL}" stroke-linejoin="round"/>`;
  return sprite(out + mat + voile, PONTON1_BOX);
}

// Chantier, en trois phases qui suivent l'avancée du joueur :
// 0 = piquets et cordeau (plan pas encore trouvé), 1 = planches et panneau (plan trouvé), 2 = échafaudage (prêt à bâtir)
function worksite(stage) {
  const corners = [[-0.85, -0.85], [0.85, -0.85], [0.85, 0.85], [-0.85, 0.85]];
  // Piquets taillés en pointe, fanion rouge noué en haut
  let stakes = '';
  for (const [u, v] of corners) {
    const [tx, ty] = P(u, v, 14);
    stakes += box(u - 0.035, v - 0.035, u + 0.035, v + 0.035, 0, 13, WOOD)
      + `<path d="M${f2(tx - 2.3)},${f2(ty + 1)} L${f2(tx)},${f2(ty - 3)} L${f2(tx + 2.3)},${f2(ty + 1)} Z" fill="${WOOD.top}" stroke="#3C2819" stroke-width="0.6" stroke-linejoin="round"/>`
      + `<path d="M${f2(tx + 0.6)},${f2(ty + 3)} l6,1.6 l-6,2 Z" fill="#E2574C" stroke="#3C2819" stroke-width="0.5" stroke-linejoin="round"/>`;
  }
  // Corde qui pend d'un piquet à l'autre
  const rope = corners.map((c, k) => {
    const d = corners[(k + 1) % 4];
    const a = P(c[0], c[1], 11), b = P(d[0], d[1], 11), m = P((c[0] + d[0]) / 2, (c[1] + d[1]) / 2, 7.5);
    return `M${f2(a[0])},${f2(a[1])} Q${f2(2 * m[0] - (a[0] + b[0]) / 2)},${f2(2 * m[1] - (a[1] + b[1]) / 2)} ${f2(b[0])},${f2(b[1])}`;
  }).join(' ');
  // Terre retournée : tache irrégulière, mottes, cailloux ; tas de terre et pelle plantée devant à gauche
  const blob = Array.from({ length: 28 }, (_, k) => {
    const t = (k / 28) * Math.PI * 2, r = 0.62 * (1 + 0.07 * Math.sin(t * 3 + 0.6) + 0.04 * Math.sin(t * 5));
    return P(Math.cos(t) * r, Math.sin(t) * r, 0).map(f2).join(',');
  }).join(' ');
  const clod = (u, v, r, c) => { const [x, y] = P(u, v, 0); return `<ellipse cx="${f2(x)}" cy="${f2(y)}" rx="${r}" ry="${f2(r * 0.6)}" fill="${c}"/>`; };
  const stone = (u, v, r) => { const [x, y] = P(u, v, 0); return `<ellipse cx="${f2(x)}" cy="${f2(y)}" rx="${r}" ry="${f2(r * 0.66)}" fill="${STONE.right}" stroke="#3C2819" stroke-width="0.6"/><ellipse cx="${f2(x - r * 0.25)}" cy="${f2(y - r * 0.25)}" rx="${f2(r * 0.5)}" ry="${f2(r * 0.3)}" fill="${STONE.top}"/>`; };
  const [hx, hy] = P(-0.42, 0.55, 0);
  const dug = `<polygon points="${blob}" fill="rgba(150,105,60,.42)"/>`
    + [[-0.3, -0.2, 4.4], [0.2, 0.25, 3.6], [0.35, -0.3, 3], [-0.15, 0.38, 2.6], [0.05, -0.45, 2.8]].map(([u, v, r], k) => clod(u, v, r, k % 2 ? '#8B5A34' : '#A87445')).join('')
    + stone(0.3, -0.2, 2.6) + stone(-0.25, 0.3, 2.2) + stone(0.45, 0.1, 1.8);
  const heap = `<path d="M${f2(hx - 13)},${f2(hy + 2)} Q${f2(hx - 9)},${f2(hy - 8)} ${f2(hx)},${f2(hy - 9)} Q${f2(hx + 9)},${f2(hy - 8)} ${f2(hx + 13)},${f2(hy + 2)} Q${f2(hx)},${f2(hy + 6)} ${f2(hx - 13)},${f2(hy + 2)} Z" fill="#A87445" stroke="#3C2819" stroke-width="0.7"/>`
    + `<path d="M${f2(hx - 6)},${f2(hy - 5)} q4,-3 8,-1" stroke="#C99A62" stroke-width="1.2" fill="none" stroke-linecap="round"/>`
    + clod(-0.36, 0.66, 2, '#8B5A34')
    // Pelle plantée dans le tas : lame grise, manche et poignée
    + `<path d="M${f2(hx + 2)},${f2(hy - 4)} l4.2,0.8 l-0.6,5.6 q-2,1.6 -4.2,-0.6 Z" fill="#9AA6B2" stroke="#3C2819" stroke-width="0.6" stroke-linejoin="round"/>`
    + `<line x1="${f2(hx + 4)}" y1="${f2(hy - 3.6)}" x2="${f2(hx + 8)}" y2="${f2(hy - 21)}" stroke="#3C2819" stroke-width="2.6" stroke-linecap="round"/><line x1="${f2(hx + 4)}" y1="${f2(hy - 3.6)}" x2="${f2(hx + 8)}" y2="${f2(hy - 21)}" stroke="${WOOD.left}" stroke-width="1.4" stroke-linecap="round"/>`
    + `<path d="M${f2(hx + 5.6)},${f2(hy - 22)} h5" stroke="#3C2819" stroke-width="2.4" stroke-linecap="round"/><path d="M${f2(hx + 5.6)},${f2(hy - 22)} h5" stroke="${WOOD.top}" stroke-width="1.2" stroke-linecap="round"/>`;
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
      // Seau de mortier au pied, sa truelle
      + cylinder(0.32, -0.45, 0, 7, 0.09, { top: '#CFC6B4', left: '#9AA6B2', right: '#6F7A85' }, 'mortarg')
      + (() => { const [mx, my] = P(0.32, -0.45, 7); return `<path d="M${f2(mx - 1)},${f2(my)} l3.4,-6" stroke="${WOOD.right}" stroke-width="1.4" stroke-linecap="round"/><path d="M${f2(mx - 3)},${f2(my + 0.6)} l4,-1.4 l1,1.6 Z" fill="#7C8A96" stroke="#3C2819" stroke-width="0.5"/>`; })();
  }
  body += `<path d="${rope}" stroke="#3C2819" stroke-width="1.7" fill="none" opacity=".55"/><path d="${rope}" stroke="#F2E4C0" stroke-width="0.9" fill="none"/>` + stakes + heap;
  if (stage >= 1) {
    // Pile de planches et panneau du chantier (une maisonnette y est dessinée)
    const [sx, sy] = P(0.48, 0.47, 19);
    body += box(-0.4, 0.15, 0.2, 0.32, 0, 3, WOOD) + box(-0.36, 0.17, 0.24, 0.34, 3, 6, WOOD) + box(-0.42, 0.14, 0.18, 0.31, 6, 9, WOOD)
      + box(0.45, 0.42, 0.5, 0.47, 0, 18, WOOD_DARK)
      + face([[0.3, 0.47, 14], [0.66, 0.47, 14], [0.66, 0.47, 24], [0.3, 0.47, 24]], '#F3D27A', EDGE)
      + `<path d="M${f2(sx - 4)},${f2(sy + 3.6)} L${f2(sx - 4)},${f2(sy - 0.4)} L${f2(sx)},${f2(sy - 3.6)} L${f2(sx + 4)},${f2(sy - 0.4)} L${f2(sx + 4)},${f2(sy + 3.6)} Z" fill="none" stroke="${INK}" stroke-width="0.9" stroke-linejoin="round" opacity=".75"/>`
      + `<rect x="${f2(sx - 1)}" y="${f2(sy + 0.8)}" width="2" height="2.8" fill="${INK}" opacity=".75"/>`;
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
// Flamme d'un feu de camp : 3 images ; ancrée au centre du feu, en (u, v) (le feu de camp : au centre de l'emprise), s : taille.
// outlined : flamme détourée en trois couches (rouge, orange, cœur jaune) et deux étincelles (bâtiments)
export function flameFrames(u = 0, v = 0, s = 1, outlined = false) {
  const [x, y] = P(u, v, 4);
  if (outlined) {
    // Flamme chibi en boucle douce : 10 images, la pointe ondule (sinus), les flancs respirent en décalé, trois braises
    // montent en continu et s'éteignent en haut ; aucune image ne saute (tout suit la même phase)
    const N = 10;
    const tongue = (ph, k, fill, extra = '') => {
      const tip = [2.6 * Math.sin(ph) * s, (-24 - 2.2 * Math.sin(2 * ph)) * s];
      const r = [(8 + 1.2 * Math.sin(ph + 1.3)) * s, (-6 - 1.4 * Math.cos(ph)) * s];
      const l = [(-8 + 1.2 * Math.sin(ph + 2.6)) * s, (-6 - 1.4 * Math.sin(ph + 0.7)) * s];
      const P2 = ([dx, dy]) => [x + dx * k, y + dy * k];
      const [tx, ty] = P2(tip), [rx, ry] = P2(r), [lx, ly] = P2(l), [bx, by] = [x, y + 1 * s * k];
      return `<path d="M${f2(bx)},${f2(by)} C${f2(rx + 3 * s * k)},${f2(ry + 4 * s * k)} ${f2(tx + 3 * s * k)},${f2(ty + 9 * s * k)} ${f2(tx)},${f2(ty)} C${f2(tx - 3 * s * k)},${f2(ty + 9 * s * k)} ${f2(lx - 3 * s * k)},${f2(ly + 4 * s * k)} ${f2(bx)},${f2(by)} Z" fill="${fill}"${extra}/>`;
    };
    return Array.from({ length: N }, (_, f) => {
      const ph = (f / N) * Math.PI * 2;
      let braises = '';
      [[5, 0], [-5, 0.34], [2, 0.67]].forEach(([dx, d]) => {
        const t = (f / N + d) % 1;
        const bx = x + (dx + 2.2 * Math.sin(t * Math.PI * 2 + dx)) * s, by = y + (-18 - 22 * t) * s;
        braises += `<circle cx="${f2(bx)}" cy="${f2(by)}" r="${f2((1.6 - 1.1 * t) * s)}" fill="#FFD27A" opacity="${f2(Math.min(1, (1 - t) * 1.6))}"/>`;
      });
      return sprite(
        tongue(ph, 1, '#EE6A3A', ` stroke="#3C2819" stroke-width="${f2(2.2 * s)}" stroke-linejoin="round"`)
        + tongue(ph + 0.5, 0.78, '#F7A23B') + tongue(ph + 1, 0.52, '#FFE07A') + tongue(ph + 1.4, 0.26, '#FFF8D6') + braises,
        { x: x - 22, y: y - 50, w: 44, h: 56 }
      );
    });
  }
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
