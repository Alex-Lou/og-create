// Bâtiments à venir et niveaux supérieurs des chantiers (planche 2). Même géométrie, même lumière, même palette.
// Emprise de 2 × 2 cases (u, v ∈ [-1, 1]), ancrage au centre de l'emprise.
import { P, TW, face, box, gable, pyramid, disc, cylinder, shadow, sprite, EDGE } from './iso.js';
import {
  WOOD, WOOD_DARK, STONE, WALL, BRICK, ROOF_RED, PINE, BUILDING_BOX,
  pebble, doorLeft, windowLeft, windowRight, planksLeft, planksRight, roundTree,
  WHITE_STONE, ROCKS, FOLIAGE, roofOf, roofTexture, stoneCourses, seasonDots, crystals, rockBox, stoneRing, pool, cove, soilBed, leafPair, roofTextureOf
} from './palette.js';
import { gardenFence, goldenSign } from './sprites.js';
import { courseLeft, courseRight } from './tiers/kit.js';

const COPPER = { top: '#F4B07A', left: '#D9844E', right: '#A85C31' };
const SLATE = { front: '#9A88CF', back: '#6F5DA6' };
const BLUE_ROOF = { front: '#6FA3D9', back: '#4C7FB5' };
const DARK_STONE = { top: '#B9B2A2', left: '#968E7C', right: '#736B5B' };
const line = (a, b, color, width = 1.2, extra = '') => `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${color}" stroke-width="${width}" stroke-linecap="round"${extra}/>`;

// Dôme (demi-sphère) de rayon r cases posé à z : silhouette, dégradé de lumière, éclat
export function dome(u, v, z, r, colors, id) {
  const [x, y] = P(u, v, z);
  const rx = r * TW * Math.SQRT1_2;
  const ry = rx * 0.5;
  const h = rx * 0.95;
  return `<defs><radialGradient id="${id}" cx="0.35" cy="0.3" r="0.9"><stop offset="0" stop-color="${colors.top}"/><stop offset="0.55" stop-color="${colors.left}"/><stop offset="1" stop-color="${colors.right}"/></radialGradient></defs>`
    + `<path d="M${x - rx},${y} A${rx},${ry} 0 0 0 ${x + rx},${y} A${rx},${h} 0 0 0 ${x - rx},${y} Z" fill="url(#${id})"${EDGE}/>`;
}
// Tonneau
function barrel(u, v, id) {
  const [x, y] = P(u, v, 0);
  return shadow(u, v, 0.14, 0.2) + cylinder(u, v, 0, 13, 0.11, { top: '#C9935E', left: WOOD.left, right: WOOD.right }, id)
    + `<path d="M${x - 7.8},${y - 3} A7.8,3.9 0 0 0 ${x + 7.8},${y - 3}" stroke="#5E3A22" stroke-width="1" fill="none"/>`
    + `<path d="M${x - 7.8},${y - 10} A7.8,3.9 0 0 0 ${x + 7.8},${y - 10}" stroke="#5E3A22" stroke-width="1" fill="none"/>`;
}
// Caisse
function crate(u, v, s = 0.14, h = 11) {
  return box(u - s, v - s, u + s, v + s, 0, h, WOOD) + line(P(u - s, v + s, 0), P(u + s, v + s, h), 'rgba(90,55,25,.45)', 0.9);
}

/* ---------- Bâtiments à venir ---------- */
// Alambic : four de briques, cuve de cuivre à dôme, col de cygne vers le serpentin, fiole sur l'établi
function alembic() {
  const neckStart = P(0.05, -0.2, 52);
  const neckEnd = P(0.62, 0.3, 30);
  const flask = P(-0.5, 0.55, 12);
  return sprite(
    shadow(0, 0, 1.1)
    // Établi et fiole
    + box(-0.8, 0.35, -0.2, 0.75, 0, 11, WOOD)
    + `<path d="M${flask[0] - 2},${flask[1] - 9} L${flask[0] - 2},${flask[1] - 5} Q${flask[0] - 8},${flask[1] - 1} ${flask[0] - 6},${flask[1] + 3} L${flask[0] + 6},${flask[1] + 3} Q${flask[0] + 8},${flask[1] - 1} ${flask[0] + 2},${flask[1] - 5} L${flask[0] + 2},${flask[1] - 9} Z" fill="rgba(200,235,255,.7)" stroke="rgba(60,80,90,.5)" stroke-width="0.8"/>`
    + `<path d="M${flask[0] - 6.5},${flask[1]} Q${flask[0]},${flask[1] - 3} ${flask[0] + 6.5},${flask[1]} L${flask[0] + 6},${flask[1] + 3} L${flask[0] - 6},${flask[1] + 3} Z" fill="#7BD88F"/>`
    // Four et cuve
    + box(-0.4, -0.6, 0.5, 0.2, 0, 16, BRICK)
    + face([[-0.25, 0.2, 2], [0.2, 0.2, 2], [0.2, 0.2, 10], [-0.25, 0.2, 10]], '#3A1E14')
    + face([[-0.18, 0.2, 3], [0.13, 0.2, 3], [0.13, 0.2, 7], [-0.18, 0.2, 7]], '#F28A3A')
    + cylinder(0.05, -0.2, 16, 36, 0.34, COPPER, 'alcuve')
    + dome(0.05, -0.2, 36, 0.34, COPPER, 'aldome')
    // Col de cygne et serpentin
    + `<path d="M${neckStart[0]},${neckStart[1]} C${neckStart[0] + 12},${neckStart[1] - 10} ${neckEnd[0] - 4},${neckEnd[1] - 22} ${neckEnd[0]},${neckEnd[1] - 4}" stroke="${COPPER.right}" stroke-width="3.6" fill="none" stroke-linecap="round"/>`
    + `<path d="M${neckStart[0]},${neckStart[1]} C${neckStart[0] + 12},${neckStart[1] - 10} ${neckEnd[0] - 4},${neckEnd[1] - 22} ${neckEnd[0]},${neckEnd[1] - 4}" stroke="${COPPER.top}" stroke-width="1.2" fill="none" stroke-linecap="round"/>`
    + cylinder(0.62, 0.3, 0, 26, 0.14, { top: '#8FB3C4', left: '#6E95A8', right: '#4E7184' }, 'alcool')
    + [6, 12, 18].map(z => `<path d="M${P(0.62, 0.3, z)[0] - 7},${P(0.62, 0.3, z)[1]} A7,3.5 0 0 0 ${P(0.62, 0.3, z)[0] + 7},${P(0.62, 0.3, z)[1]}" stroke="${COPPER.left}" stroke-width="1.6" fill="none"/>`).join('')
    + pebble(0.75, -0.6, 3) + pebble(-0.85, -0.3, 2.6),
    BUILDING_BOX
  );
}

// Scriptorium : tour de pierre à étage de bois, toit d'ardoise violette, plume en girouette
function scriptorium() {
  const u0 = -0.5, u1 = 0.5, v0 = -0.5, v1 = 0.5;
  const tip = P(0, 0, 112);
  return sprite(
    shadow(0, 0, 1)
    + box(u0, v0, u1, v1, 0, 34, STONE)
    + doorLeft(-0.15, 0.15, v1, 22, '#6A3F6E')
    + box(u0 - 0.06, v0 - 0.06, u1 + 0.06, v1 + 0.06, 34, 37, WOOD_DARK)
    + box(u0, v0, u1, v1, 37, 68, WALL)
    + windowLeft(-0.32, -0.06, v1, 46, 60, '#D9CCF5') + windowLeft(0.08, 0.34, v1, 46, 60, '#D9CCF5')
    + windowRight(u1, -0.13, 0.13, 46, 60, '#D9CCF5')
    + pyramid(u0, v0, u1, v1, 68, 40, { back: SLATE.back, left: SLATE.front, right: SLATE.back }, 0.08)
    // Plume dorée au sommet
    + line(tip, [tip[0], tip[1] - 8], '#7A5A3A', 1.4)
    + `<path d="M${tip[0]},${tip[1] - 8} q8,-6 10,-16 q-8,3 -10,16 Z" fill="#F7E7B5" stroke="#B8902F" stroke-width="0.8"/>`
    // Lutrin et livre devant la porte
    + box(0.62, 0.3, 0.78, 0.46, 0, 12, WOOD_DARK)
    + face([[0.56, 0.24, 12], [0.84, 0.24, 14], [0.84, 0.52, 14], [0.56, 0.52, 12]], '#FFFDF8', EDGE),
    BUILDING_BOX
  );
}

// Observatoire : tour ronde de pierre, coupole bleue fendue, lunette pointée vers le ciel
function observatory() {
  const top = P(0, 0, 54);
  return sprite(
    shadow(0, 0, 0.9)
    + box(-0.7, -0.7, 0.7, 0.7, 0, 6, DARK_STONE)
    + cylinder(0, 0, 6, 54, 0.46, STONE, 'obtower')
    + face([[-0.08, 0.45, 6], [0.12, 0.45, 6], [0.12, 0.45, 22], [-0.08, 0.45, 22]], '#4C7FB5', EDGE)
    + windowRight(0.4, -0.15, 0.1, 32, 42, '#CFE3F7')
    + dome(0, 0, 54, 0.5, { top: '#B9D7F2', left: BLUE_ROOF.front, right: BLUE_ROOF.back }, 'obdome')
    // Fente de la coupole et lunette
    + `<path d="M${top[0] - 3},${top[1] - 2} L${top[0] - 2},${top[1] - 30} L${top[0] + 5},${top[1] - 30} L${top[0] + 5},${top[1] - 2} Z" fill="#20304A"/>`
    + `<path d="M${top[0]},${top[1] - 14} L${top[0] + 26},${top[1] - 40}" stroke="#E9C46A" stroke-width="5.5" stroke-linecap="round"/>`
    + `<path d="M${top[0]},${top[1] - 14} L${top[0] + 26},${top[1] - 40}" stroke="#B8902F" stroke-width="1.4" stroke-linecap="round"/>`
    + `<circle cx="${top[0] + 27}" cy="${top[1] - 41}" r="3.4" fill="#20304A" stroke="#B8902F" stroke-width="1"/>`,
    BUILDING_BOX
  );
}

// Nichoir : poulailler sur pattes avec rampe, deux nichoirs perchés, paille au sol
function aviary() {
  const birdhouse = (u, v, h, roof) => box(u - 0.025, v - 0.025, u + 0.025, v + 0.025, 0, h, WOOD_DARK)
    + box(u - 0.12, v - 0.1, u + 0.12, v + 0.1, h, h + 13, WALL)
    + disc(u + 0.12, v, h + 7, 0.04, '#3A2A1E')
    + gable(u - 0.12, v - 0.1, u + 0.12, v + 0.1, h + 13, 8, { front: roof.front, back: roof.back, gable: WALL.right }, 0.04);
  return sprite(
    shadow(0, 0, 1.05, 0.16)
    + disc(0.2, 0.25, 0, 0.55, '#E9CF7E') + disc(0.25, 0.3, 0.2, 0.38, '#F1DC92')
    + birdhouse(-0.65, -0.65, 34, BLUE_ROOF)
    // Poulailler : pilotis, caisson, toit, rampe
    + [[-0.5, -0.3], [0.3, -0.3], [-0.5, 0.25], [0.3, 0.25]].map(([u, v]) => box(u - 0.03, v - 0.03, u + 0.03, v + 0.03, 0, 10, WOOD_DARK)).join('')
    + box(-0.55, -0.35, 0.35, 0.3, 10, 34, WOOD)
    + planksLeft(-0.55, 0.35, 0.3, 10, 34, 5) + planksRight(0.35, -0.35, 0.3, 10, 34, 5)
    + face([[-0.15, 0.3, 12], [0.05, 0.3, 12], [0.05, 0.3, 22], [-0.15, 0.3, 22]], '#3A2A1E')
    + face([[-0.15, 0.3, 11], [0.05, 0.3, 11], [0.05, 0.75, 0], [-0.15, 0.75, 0]], WOOD.top, EDGE)
    + gable(-0.55, -0.35, 0.35, 0.3, 34, 18, { front: ROOF_RED.front, back: ROOF_RED.back, gable: WOOD.right }, 0.08)
    + birdhouse(0.7, -0.4, 26, { front: '#8FCB6B', back: '#5E9E48' }),
    BUILDING_BOX
  );
}

// Phare : rocher, tour rayée blanc et rouge, galerie, lanterne vitrée, toit conique (le faisceau tourne la nuit)
function lighthouse() {
  const bands = [[6, 24, true], [24, 42, false], [42, 60, true], [60, 74, false]];
  const lamp = P(0, 0, 82);
  return sprite(
    shadow(0, 0, 0.9)
    + box(-0.55, -0.45, 0.45, 0.55, 0, 6, DARK_STONE) + pebble(0.55, 0.5, 5, DARK_STONE) + pebble(-0.6, 0.55, 4, DARK_STONE)
    + bands.map(([z0, z1, red], k) => cylinder(0, 0, z0, z1, 0.3 - k * 0.02, red ? { top: '#F2D7D0', left: '#E2574C', right: '#B13A31' } : { top: '#FFFFFF', left: '#FBF6EA', right: '#D9D2C2' }, `lhb${k}`)).join('')
    + face([[0.18, 0.04, 30], [0.18, 0.12, 30], [0.18, 0.12, 36], [0.18, 0.04, 36]], '#20304A')
    + cylinder(0, 0, 74, 76, 0.32, { top: '#3D3A36', left: '#55504A', right: '#2C2925' }, 'lhgal')
    + cylinder(0, 0, 76, 90, 0.2, { top: '#FFF2B8', left: '#FFE58A', right: '#E9BF4E' }, 'lhlamp')
    + `<circle cx="${lamp[0]}" cy="${lamp[1] - 1}" r="3.2" fill="#FFFDF0"/>`
    + `<path d="M${lamp[0] - 15},${lamp[1] - 8} L${lamp[0]},${lamp[1] - 26} L${lamp[0] + 15},${lamp[1] - 8} Z" fill="#C2493E"/>`
    + `<path d="M${lamp[0]},${lamp[1] - 26} L${lamp[0] + 15},${lamp[1] - 8} L${lamp[0] + 4},${lamp[1] - 7} Z" fill="#952F27"/>`,
    BUILDING_BOX
  );
}

// Sanctuaire : estrade à trois marches, six colonnes en cercle, orbe flottant au centre (animé à part)
function sanctuary() {
  const steps = box(-0.9, -0.9, 0.9, 0.9, 0, 4, STONE) + box(-0.75, -0.75, 0.75, 0.75, 4, 8, STONE) + box(-0.6, -0.6, 0.6, 0.6, 8, 12, WALL);
  const cols = Array.from({ length: 6 }, (_, k) => {
    const a = (k / 6) * Math.PI * 2 + 0.3;
    return { u: Math.cos(a) * 0.48, v: Math.sin(a) * 0.48 };
  }).sort((p, q) => p.u + p.v - (q.u + q.v));
  const back = cols.filter(c => c.u + c.v < 0);
  const front = cols.filter(c => c.u + c.v >= 0);
  const column = (c, k) => cylinder(c.u, c.v, 12, 46, 0.07, WALL, `sc${k}`) + box(c.u - 0.09, c.v - 0.09, c.u + 0.09, c.v + 0.09, 46, 49, STONE);
  return sprite(
    shadow(0, 0, 1.15, 0.16) + steps
    + back.map(column).join('')
    + disc(0, 0, 12, 0.18, '#C9B8F0', ' opacity=".7"')
    + front.map((c, k) => column(c, k + 6)).join(''),
    BUILDING_BOX
  );
}

/* ---------- Niveaux supérieurs ---------- */
// Mine (Carrière 2) : la roche s'ouvre sur une galerie boisée, des rails mènent au wagonnet, une lanterne
function mine(skin) {
  const rockColor = ROCKS[skin] || STONE;
  const portal = face([[-0.55, -0.2, 0], [-0.15, -0.2, 0], [-0.15, -0.2, 24], [-0.55, -0.2, 24]], '#2A2420');
  const frame = box(-0.6, -0.22, -0.55, -0.16, 0, 26, WOOD_DARK) + box(-0.15, -0.22, -0.1, -0.16, 0, 26, WOOD_DARK) + box(-0.6, -0.22, -0.1, -0.16, 24, 28, WOOD);
  let rails = '';
  for (let k = 0; k < 6; k++) {
    const v = -0.1 + k * 0.17;
    rails += box(-0.5, v - 0.02, -0.2, v + 0.02, 0, 1.5, WOOD_DARK);
  }
  rails += line(P(-0.45, -0.1, 1.5), P(-0.45, 0.8, 1.5), '#7C8894', 1.2) + line(P(-0.25, -0.1, 1.5), P(-0.25, 0.8, 1.5), '#7C8894', 1.2);
  const lantern = box(0.02, -0.25, 0.06, -0.21, 0, 30, WOOD_DARK) + box(-0.02, -0.29, 0.1, -0.17, 30, 38, { top: '#3D3A36', left: '#FFE08A', right: '#E9BF4E' });
  return sprite(
    shadow(0, 0, 1.15, 0.18)
    + rockBox(-0.95, -0.95, 0.9, -0.2, 0, 44, rockColor)
    + rockBox(0.3, -0.2, 0.9, 0.3, 0, 26, rockColor)
    + (skin === 'roche-cristal' ? crystals(0.1, -0.6, 44, 1.2) + crystals(0.6, 0.05, 26) : '')
    + portal + frame + rails
    + box(-0.5, 0.45, -0.2, 0.72, 2, 12, WOOD_DARK) + pebble(-0.38, 0.55, 3.4, DARK_STONE) + pebble(-0.3, 0.62, 3, DARK_STONE)
    + lantern
    + box(0.45, 0.4, 0.75, 0.65, 0, 8, STONE) + pebble(0.75, 0.8, 3),
    BUILDING_BOX
  );
}
// Kiosque de la Fontaine (skins toit bleu ou chaume) : quatre poteaux et un toit conique au-dessus du bassin.
// Poteaux en losange (avant gauche et avant droit) : la fontaine reste dégagée au centre.
const KIOSK_Z = 64;
const KIOSK_R = 0.98;
function kioskPost(u, v) {
  return box(u - 0.035, v - 0.035, u + 0.035, v + 0.035, 0, KIOSK_Z, WOOD_DARK)
    + box(u - 0.05, v - 0.05, u + 0.05, v + 0.05, 0, 3, STONE);
}
function kioskRoof(skin) {
  const thatch = skin === 'toit-chaume';
  const colors = thatch ? { light: '#F3D27E', dark: '#C4943F', edge: '#A97B32' } : { light: '#86B6E6', dark: '#3F6FA3', edge: '#2E5585' };
  const f = n => Math.round(n * 100) / 100;
  const [, cy] = P(0, 0, KIOSK_Z);
  const rx = KIOSK_R * 45.25;
  const ry = KIOSK_R * 22.63;
  const h = 26;
  const apex = cy - h;
  // Silhouette : du sommet aux points de tangence, puis l'arc avant de la base
  const ty = cy - (ry * ry) / h;
  const tx = rx * Math.sqrt(Math.max(0, 1 - ((cy - ty) / ry) ** 2));
  const cone = `M0,${f(apex)} L${f(tx)},${f(ty)} A${f(rx)},${f(ry)} 0 1 1 ${f(-tx)},${f(ty)} Z`;
  let texture = '';
  if (thatch) {
    for (let a = 0.12; a < Math.PI - 0.1; a += 0.09) {
      const bx = rx * Math.cos(a);
      const by = cy + ry * Math.sin(a);
      const j = Math.sin(a * 53) * 0.04;
      texture += `<line x1="${f(bx * (0.18 + j))}" y1="${f(apex + (by - apex) * (0.18 + j))}" x2="${f(bx * 0.97)}" y2="${f(apex + (by - apex) * 0.97)}" stroke="rgba(140,95,35,.45)" stroke-width="0.6"/>`;
    }
    texture += `<path d="M${f(-rx * 0.62)},${f(cy - ry * 0.05 - h * 0.38)} A${f(rx * 0.62)},${f(ry * 0.62)} 0 0 0 ${f(rx * 0.62)},${f(cy - ry * 0.05 - h * 0.38)}" fill="none" stroke="#B88A3A" stroke-width="1.6" stroke-dasharray="1.6 1.2"/>`;
  } else {
    [0.35, 0.55, 0.75, 0.95].forEach((k, r) => {
      const ey = apex + h * k;
      texture += `<path d="M${f(-rx * k)},${f(ey)} A${f(rx * k)},${f(ry * k)} 0 0 0 ${f(rx * k)},${f(ey)}" fill="none" stroke="rgba(20,40,70,.4)" stroke-width="0.8"/>`;
      for (let a = r % 2 ? 0.3 : 0.55; a < Math.PI - 0.15; a += 0.5) {
        const k0 = k - 0.2;
        texture += `<line x1="${f(rx * k0 * Math.cos(a))}" y1="${f(apex + h * k0 + ry * k0 * Math.sin(a))}" x2="${f(rx * k * Math.cos(a))}" y2="${f(ey + ry * k * Math.sin(a))}" stroke="rgba(20,40,70,.28)" stroke-width="0.6"/>`;
      }
    });
  }
  return `<defs><linearGradient id="kioskg-${skin}" x1="0" x2="1"><stop offset="0" stop-color="${colors.light}"/><stop offset="1" stop-color="${colors.dark}"/></linearGradient></defs>`
    // Ombre du toit sur le haut des poteaux, puis le cône, sa texture, son rebord et l'épi de faîtage
    + `<path d="${cone}" fill="url(#kioskg-${skin})" stroke="#3C2819" stroke-width="0.8" stroke-linejoin="round"/>`
    + texture
    + `<path d="M${f(-rx)},${f(cy)} A${f(rx)},${f(ry)} 0 0 0 ${f(rx)},${f(cy)}" fill="none" stroke="${colors.edge}" stroke-width="${thatch ? 2.6 : 2}" ${thatch ? 'stroke-dasharray="1.8 1.2"' : ''}/>`
    + `<line x1="0" y1="${f(apex)}" x2="0" y2="${f(apex - 7)}" stroke="#7A5A3A" stroke-width="1.4"/><circle cx="0" cy="${f(apex - 8)}" r="2" fill="#E9BF4E" stroke="#8A6A22" stroke-width="0.6"/>`;
}
// Fontaine (Puits 2) : bassin rond, colonne, vasque ; les jets d'eau sont animés à part
function fountain(skin) {
  const stone = skin === 'pierre-blanche' ? WHITE_STONE : STONE;
  const kiosk = skin === 'toit-bleu' || skin === 'toit-chaume';
  const r = KIOSK_R * 0.88;
  return sprite(
    shadow(0, 0, kiosk ? 1.05 : 0.95)
    + (kiosk ? kioskPost(-r, 0) + kioskPost(0, -r) : '')
    + stoneRing(0, 0, 0, 10, 0.72, stone, 'fobasin')
    + pool(0, 0, 10, 0.62)
    + cylinder(0, 0, 10, 30, 0.08, WALL, 'focol')
    + stoneRing(0, 0, 30, 34, 0.3, stone, 'fobowl', 0)
    + pool(0, 0, 34, 0.24)
    + cylinder(0, 0, 34, 42, 0.04, WALL, 'fotip')
    + (kiosk ? kioskPost(r, 0) + kioskPost(0, r) + kioskRoof(skin) : ''),
    BUILDING_BOX
  );
}
// Grand bosquet (Bosquet 2) : quatre arbres dont un sapin, souche et hache, champignons
function bigGrove(skin) {
  const colors = FOLIAGE[skin];
  const tree = (u, v, sc, base) => {
    const [x, y] = P(u, v, 0);
    return roundTree(u, v, sc, colors || base) + seasonDots(skin, x, y - 34 * sc, 12 * sc);
  };
  const [px, py] = P(0.5, 0.5, 0);
  const pine = shadow(-0.55, 0.45, 0.3) + box(-0.6, 0.4, -0.5, 0.5, 0, 12, WOOD_DARK)
    + [[-8, 15, 22], [-20, 12, 20], [-31, 9, 18]].map(([dy, w, h], k) => {
      const [x, y] = P(-0.55, 0.45, 0);
      return `<path d="M${x - w},${y + dy} L${x},${y + dy - h} L${x + w},${y + dy} Z" fill="${PINE.dark}"/><path d="M${x - w + 2},${y + dy - 1} L${x},${y + dy - h} L${x + 1},${y + dy - 1} Z" fill="${k === 2 ? PINE.light : PINE.mid}"/>`;
    }).join('');
  const stump = shadow(0.5, 0.5, 0.18, 0.2) + cylinder(0.5, 0.5, 0, 7, 0.13, { top: '#E7C08A', left: WOOD.left, right: WOOD.right }, 'bgstump')
    + `<ellipse cx="${px}" cy="${py - 7}" rx="3.6" ry="1.8" fill="none" stroke="#B98552" stroke-width="0.8"/>`
    + line([px + 2, py - 8], [px + 9, py - 20], WOOD.right, 1.8) + `<path d="M${px + 6},${py - 23} l7,2 l-2,5 l-6,-3 Z" fill="#9AA6B2"/>`;
  const snowy = skin === 'givre' ? (() => {
    const [x, y] = P(-0.55, 0.45, 0);
    return `<path d="M${x - 6},${y - 46} L${x},${y - 49} L${x + 6},${y - 46} L${x},${y - 43} Z" fill="#FFFFFF"/>`;
  })() : '';
  return sprite(tree(-0.5, -0.5, 1.15) + tree(0.45, -0.5, 1.0, { light: '#C7E98F', mid: '#93CC5E', dark: '#5E9A3C' }) + pine + snowy + tree(0.05, 0.05, 1.25) + stump, BUILDING_BOX);
}
// Potager 2 : planches cultivées, serre vitrée au fond, épouvantail
function greenhouseGarden(skin) {
  let plants = '';
  for (let j = 0; j < 4; j++) {
    for (let k = 0; k < 2; k++) {
      const [x, y] = P(-0.6 + j * 0.38, 0.25 + k * 0.38, 4);
      plants += leafPair(x, y, 3.6, 2.1, 3) + `<circle cx="${x}" cy="${y - 5}" r="2" fill="#E2574C" stroke="#3C2819" stroke-width="0.5"/>`;
    }
  }
  const glass = 'rgba(205,235,245,.55)';
  const sc = P(0.65, 0.05, 0);
  return sprite(
    shadow(0, 0, 1.15, 0.14)
    + (skin ? gardenFence(skin) : '')
    + soilBed(-0.85, 0.05, 0.85, 0.85, 4) + plants
    // Serre : armature et vitres
    + box(-0.8, -0.85, 0.3, -0.2, 0, 22, { top: glass, left: glass, right: 'rgba(170,205,220,.6)' }, ' stroke="#FFFFFF" stroke-width="1.2" stroke-linejoin="round"')
    + gable(-0.8, -0.85, 0.3, -0.2, 22, 14, { front: 'rgba(220,245,255,.7)', back: 'rgba(170,205,220,.7)', gable: glass }, 0.03, ' stroke="#FFFFFF" stroke-width="1.2" stroke-linejoin="round"')
    + roundTree(-0.4, -0.55, 0.45, { light: '#D7F0A8', mid: '#9ED67B', dark: '#6FA94F' })
    // Épouvantail
    + line(sc, [sc[0], sc[1] - 34], WOOD_DARK.right, 2) + line([sc[0] - 12, sc[1] - 24], [sc[0] + 12, sc[1] - 24], WOOD_DARK.right, 2)
    + `<path d="M${sc[0] - 7},${sc[1] - 26} L${sc[0] + 7},${sc[1] - 26} L${sc[0] + 5},${sc[1] - 12} L${sc[0] - 5},${sc[1] - 12} Z" fill="#5C83C2"/>`
    + `<circle cx="${sc[0]}" cy="${sc[1] - 31}" r="4.4" fill="#F1DC92"/><path d="M${sc[0] - 8},${sc[1] - 34} L${sc[0] + 8},${sc[1] - 34} L${sc[0]},${sc[1] - 41} Z" fill="#B8902F"/>`,
    BUILDING_BOX
  );
}
// Forge (Atelier 2) : l'appentis gagne un étage de pierre, enseigne, tonneaux et caisses
function forge(skin) {
  const u0 = -0.8, u1 = 0.15, v0 = -0.55, v1 = 0.45;
  const roof = roofOf(skin, ROOF_RED);
  const sign = P(0.15, 0.5, 30);
  return sprite(
    shadow(0, 0, 1.15)
    + box(u0, v0, u1, v1, 0, 22, STONE) + courseLeft(u0, u1, v1, 0, 22, 3) + courseRight(u1, v0, v1, 0, 22, 3)
    + doorLeft(-0.55, -0.15, v1, 17, WOOD_DARK.right)
    + box(u0, v0, u1, v1, 22, 40, WOOD) + planksLeft(u0, u1, v1, 22, 40) + planksRight(u1, v0, v1, 22, 40)
    + windowLeft(-0.6, -0.35, v1, 27, 36) + windowRight(u1, -0.3, -0.05, 27, 36)
    + gable(u0, v0, u1, v1, 40, 18, { front: roof.front, back: roof.back, gable: WOOD.right }, 0.1)
    + roofTextureOf(skin, 'toit-rouge', u0, v0, u1, v1, 40, 18, 0.1)
    + (skin === 'enseigne-doree' ? goldenSign(-0.3, v1, 44) : '')
    // Four agrandi et cheminée haute, en briques à assises
    + box(0.25, -0.45, 0.88, 0.3, 0, 22, BRICK) + courseLeft(0.25, 0.88, 0.3, 0, 22, 4, 'rgba(90,40,25,.32)') + courseRight(0.88, -0.45, 0.3, 0, 22, 4, 'rgba(70,30,20,.32)')
    + face([[0.88, -0.2, 2], [0.88, 0.1, 2], [0.88, 0.1, 13], [0.88, -0.2, 13]], '#3A1E14')
    + face([[0.88, -0.16, 3], [0.88, 0.06, 3], [0.88, 0.06, 8], [0.88, -0.16, 8]], '#F28A3A')
    + box(0.45, -0.3, 0.65, -0.1, 22, 58, BRICK) + courseLeft(0.45, 0.65, -0.1, 22, 58, 6, 'rgba(90,40,25,.32)') + courseRight(0.65, -0.3, -0.1, 22, 58, 6, 'rgba(70,30,20,.32)')
    // Enseigne : marteau sur écu
    + line(sign, [sign[0] + 10, sign[1] + 5], WOOD_DARK.right, 1.6)
    + `<rect x="${sign[0] + 4}" y="${sign[1] + 6}" width="12" height="10" rx="2" fill="#F3D27A" stroke="#7A4E2C" stroke-width="0.8"/>`
    + `<path d="M${sign[0] + 7},${sign[1] + 14} L${sign[0] + 12},${sign[1] + 9}" stroke="#7A4E2C" stroke-width="1.2" stroke-linecap="round"/><rect x="${sign[0] + 10.4}" y="${sign[1] + 7.2}" width="4.4" height="2.4" rx="0.5" fill="#5F6A75" transform="rotate(-45 ${sign[0] + 12.6} ${sign[1] + 8.4})"/>`
    + barrel(0.55, 0.6, 'fobar1') + barrel(0.32, 0.72, 'fobar2') + crate(-0.62, 0.72),
    BUILDING_BOX
  );
}
// Grand ponton (Ponton 2) : appontement en L, cabane de pêcheur sur pilotis, lanterne
function bigPier() {
  let posts = '';
  for (const u of [-0.75, -0.25, 0.25, 0.75]) posts += box(u - 0.04, 0.12, u + 0.04, 0.2, -4, 7, WOOD_DARK) + box(u - 0.04, -0.2, u + 0.04, -0.12, -4, 7, WOOD_DARK);
  const water = cove(0, 0.05, 0.92);
  return sprite(
    water + posts
    + box(-0.85, -0.25, 0.9, 0.25, 7, 10, WOOD) + box(0.45, 0.25, 0.75, 0.75, 7, 10, WOOD)
    // Cabane du pêcheur
    + box(-0.75, -0.22, -0.25, 0.2, 10, 30, WOOD_DARK) + planksLeft(-0.75, -0.25, 0.2, 10, 30, 5)
    + face([[-0.6, 0.2, 10], [-0.42, 0.2, 10], [-0.42, 0.2, 23], [-0.6, 0.2, 23]], '#3A2A1E')
    + gable(-0.75, -0.22, -0.25, 0.2, 30, 12, { front: BLUE_ROOF.front, back: BLUE_ROOF.back, gable: WOOD_DARK.right }, 0.05)
    + roofTexture('toit-bleu', -0.75, -0.22, -0.25, 0.2, 30, 12, 0.05)
    // Filet séché et lanterne
    + `<path d="M${P(0.1, -0.24, 22).join(',')} Q${P(0.25, -0.24, 12).join(',')} ${P(0.4, -0.24, 22).join(',')}" stroke="#C9A16A" stroke-width="1" fill="rgba(201,161,106,.25)" stroke-dasharray="1.5 1.5"/>`
    + box(0.08, -0.26, 0.12, -0.22, 10, 26, WOOD_DARK) + box(0.38, -0.26, 0.42, -0.22, 10, 26, WOOD_DARK)
    + box(0.8, 0.12, 0.84, 0.16, 10, 34, WOOD_DARK) + box(0.76, 0.08, 0.88, 0.2, 34, 41, { top: '#3D3A36', left: '#FFE08A', right: '#E9BF4E' }),
    BUILDING_BOX
  );
}

// Jets d'eau de la Fontaine : 3 images (gouttes qui montent et retombent)
export function fountainFrames() {
  const [x, y] = P(0, 0, 42);
  return [0, 1, 2].map(f => {
    let out = '';
    for (let k = 0; k < 6; k++) {
      const a = (k / 6) * Math.PI * 2 + f * 0.35;
      const r = 6 + f * 3;
      out += `<circle cx="${x + Math.cos(a) * r}" cy="${y - 4 + f * 3 + Math.sin(a) * r * 0.4}" r="1.3" fill="#BFE6FA"/>`;
    }
    out += `<path d="M${x - 1},${y} L${x},${y - 7 - f} L${x + 1},${y} Z" fill="#DFF4FF"/>`;
    return sprite(out, BUILDING_BOX);
  });
}
// Orbe du Sanctuaire (flotte et luit, animé par l'île)
export function orbSprite() {
  const [x, y] = P(0, 0, 30);
  return sprite(
    `<defs><radialGradient id="orbg" cx="0.35" cy="0.3" r="0.8"><stop offset="0" stop-color="#FFFFFF"/><stop offset="0.45" stop-color="#D6C6FF"/><stop offset="1" stop-color="#8E73E0"/></radialGradient></defs>`
    + `<circle cx="${x}" cy="${y}" r="9" fill="url(#orbg)"/><circle cx="${x - 3}" cy="${y - 3}" r="2.4" fill="#FFFFFF" opacity=".9"/>`,
    BUILDING_BOX
  );
}

export const FUTURE = { alambic: [alembic], scriptorium: [scriptorium], observatoire: [observatory], nichoir: [aviary], phare: [lighthouse], sanctuaire: [sanctuary] };
// Niveau 2 des chantiers existants (le niveau 1 est dans sprites.js)
export const UPGRADES = { carriere: mine, puits: fountain, bosquet: bigGrove, potager: greenhouseGarden, atelier: forge, ponton: bigPier };
