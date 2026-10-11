// Bâtiments à venir et niveaux supérieurs des chantiers (planche 2). Même géométrie, même lumière, même palette.
// Emprise de 2 × 2 cases (u, v ∈ [-1, 1]), ancrage au centre de l'emprise.
import { P, TW, face, box, gable, pyramid, disc, cylinder, shadow, sprite, EDGE, HIVER, NEIGE, snowPan, mixHex } from './iso.js';
import {
  WOOD, WOOD_DARK, STONE, WALL, BRICK, ROOF_RED, PINE, BUILDING_BOX,
  pebble, doorLeft, windowLeft, windowRight, planksLeft, planksRight, roundTree,
  WHITE_STONE, ROCKS, FOLIAGE, roofOf, roofTexture, stoneCourses, seasonDots, crystals, rockBox, stoneRing, pool, cove, soilBed, leafPair, roofTextureOf
} from './palette.js';
import { gardenFence, clotureChibi, bardeaux, goldenSign, pontonCorps, PONTON1_BOX, ROCHE, cristauxChibi } from './sprites.js';
import { INK as INK_C, TRAIT, DETAIL, bloc, poteau, trait, f2, toitPignon, bassinRond, pierreRonde, degrade, poly as polyC, arbreRond, sapin, buche, riveGable, rocher, spriteChibi } from './chibi.js';
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
    + `<path d="M${x - rx},${y} A${rx},${ry} 0 0 0 ${x + rx},${y} A${rx},${h} 0 0 0 ${x - rx},${y} Z" fill="url(#${id})"${EDGE}/>`
    // l'hiver : une calotte de neige sur le dessus (une ellipse découpée dans le dôme : on n'en voit que le bord du bas)
    + (HIVER ? `<defs><clipPath id="${id}-neige"><path d="M${x - rx},${y} A${rx},${ry} 0 0 0 ${x + rx},${y} A${rx},${h} 0 0 0 ${x - rx},${y} Z"/></clipPath></defs>`
      + `<g clip-path="url(#${id}-neige)"><ellipse cx="${x + 1}" cy="${y - h * 0.9}" rx="${rx * 1.02}" ry="${h * 0.62}" fill="${NEIGE.shade}"/><ellipse cx="${x}" cy="${y - h * 1.02}" rx="${rx * 1.02}" ry="${h * 0.62}" fill="${NEIGE.light}"${EDGE}/></g>` : '');
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
// Mine (base de la Carrière III), cahier des charges du 11 oct. : au style chibi. Rocher arrondi en gradins, la voie de
// bois et d'acier (u ≈ −0.35, les Rails de la boutique la prolongent) qui sort de la galerie, le wagonnet de minerai,
// la lanterne sur son poteau (lumière du jeu en (0.04, −0.23, z 34)), des éclats. L'entrée de pierre, les lampions et
// le puits d'aération sont posés par la Galerie (tiers/carriere.js), qui affine le trait de l'ensemble (spriteChibi) :
// ce dessin-ci reste donc en sprite simple.
function mine(skin) {
  const rock = skin && skin !== 'roche-cristal' ? ROCKS[skin] : ROCHE;
  const cristal = skin === 'roche-cristal';
  const eclat = { top: mixHex(rock.top, '#FFFFFF', 0.2), left: rock.left, right: rock.right };
  const mousse = (u, v, z, k = 1) => { if (HIVER) return ''; const [x, y] = P(u, v, z); return `<path d="M${f2(x - 7 * k)},${f2(y + 1)} q2,-4 5.6,-2.8 q2.4,-3 5.8,-0.4 q2.4,0.6 1.4,2.6 q-1,1.4 -3.4,1.2 Z" fill="#8CC968" stroke="${INK_C}" stroke-width="${DETAIL}" stroke-linejoin="round"/>`; };
  let out = disc(-0.05, -0.15, 0, 1.12, 'rgba(120,85,45,.2)');
  [[0.97, -0.6, 3], [-1.0, 0.25, 2.8]].forEach(([u, v, r]) => { out += pierreRonde(u, v, r, eclat); });
  // Le rocher : une large assise, un bloc en retrait dessus (le puits d'aération s'y pose), un gradin à droite
  out += rocher(-0.95, -0.95, 0.9, -0.2, 0, 34, rock, 'mn1', 6) + rocher(-0.85, -0.92, 0.5, -0.42, 34, 44, rock, 'mn2', 5)
    + mousse(-0.55, -0.7, 44) + mousse(0.75, -0.6, 34, 0.8)
    + (cristal ? cristauxChibi(-0.3, -0.7, 44, 1.15) + cristauxChibi(0.7, -0.5, 34) : '')
    + rocher(0.3, -0.2, 0.9, 0.3, 0, 26, rock, 'mn3', 5) + mousse(0.62, 0.0, 26, 0.8) + (cristal ? cristauxChibi(0.55, 0.05, 26, 0.85) : '');
  // La voie : traverses de bois, deux rails d'acier
  for (let k = 0; k < 6; k++) { const v = -0.12 + k * 0.17; out += bloc(-0.52, v - 0.03, -0.18, v + 0.03, 0, 1.8, { top: '#B98552', left: '#9E6538', right: '#7A4824' }, `mnt${k}`, 1.1); }
  [-0.45, -0.25].forEach(u => { const a = P(u, -0.18, 1.8), b = P(u, 0.82, 1.8); out += trait(a, b, 3.4, INK_C) + trait(a, b, 1.6, '#B8C2CA') + trait([a[0], a[1] - 0.5], [b[0], b[1] - 0.5], 0.6, '#EEF3F6'); });
  // Wagonnet de minerai sur la voie
  const [wx, wy] = P(-0.35, 0.58, 0);
  out += `<ellipse cx="${f2(wx)}" cy="${f2(wy + 1)}" rx="13" ry="5" fill="rgba(90,60,30,.22)"/>`
    + bloc(-0.5, 0.45, -0.2, 0.72, 3, 13, { top: '#3A332E', left: '#C98448', right: '#9E5F30' }, 'mnw')
    + trait(P(-0.5, 0.72, 8), P(-0.2, 0.72, 8), 1.6, '#6E7880') + trait(P(-0.2, 0.72, 8), P(-0.2, 0.45, 8), 1.6, '#5A646C');
  [[-0.44, 0.72], [-0.26, 0.72], [-0.2, 0.5]].forEach(([u, v]) => { const [x, y] = P(u, v, 3); out += `<circle cx="${f2(x)}" cy="${f2(y)}" r="3.2" fill="#4A4440" stroke="${INK_C}" stroke-width="${DETAIL}"/><circle cx="${f2(x)}" cy="${f2(y)}" r="1.1" fill="#A9B4BD"/>`; });
  [[-0.42, 0.55, 3.2], [-0.3, 0.62, 2.8], [-0.34, 0.52, 2.4]].forEach(([u, v, r]) => { const [x, y] = P(u, v, 13); out += `<ellipse cx="${f2(x)}" cy="${f2(y - r * 0.4)}" rx="${r}" ry="${f2(r * 0.75)}" fill="#6B7079" stroke="${INK_C}" stroke-width="${DETAIL}"/><circle cx="${f2(x - r * 0.2)}" cy="${f2(y - r * 0.6)}" r="0.8" fill="#F2C04B"/>`; });
  // Lanterne sur son poteau, à droite de l'entrée (lumière du jeu)
  const [lx, ly] = P(0.04, -0.23, 30);
  out += poteau(0.04, -0.23, 0, 30, 0.03, { top: '#B07A48', left: '#9A6236', right: '#764522' }, 'mnpot')
    + `<path d="M${f2(lx - 4)},${f2(ly - 1)} L${f2(lx - 3.4)},${f2(ly - 8)} L${f2(lx + 3.4)},${f2(ly - 8)} L${f2(lx + 4)},${f2(ly - 1)} Z" fill="#FFE08A" stroke="${INK_C}" stroke-width="${TRAIT}" stroke-linejoin="round"/>`
    + `<path d="M${f2(lx - 4.6)},${f2(ly - 8)} L${f2(lx)},${f2(ly - 11.5)} L${f2(lx + 4.6)},${f2(ly - 8)} Z" fill="#3D3A36" stroke="${INK_C}" stroke-width="${TRAIT}" stroke-linejoin="round"/>`
    + `<ellipse cx="${f2(lx - 0.8)}" cy="${f2(ly - 4.6)}" rx="1.2" ry="2" fill="#FFFDF0"/>`;
  return sprite(out, BUILDING_BOX);
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
    + `<path d="${cone}" fill="url(#kioskg-${skin})" stroke="#3C2819" stroke-width="${TRAIT}" stroke-linejoin="round"/>`
    + texture
    + `<path d="M${f(-rx)},${f(cy)} A${f(rx)},${f(ry)} 0 0 0 ${f(rx)},${f(cy)}" fill="none" stroke="${colors.edge}" stroke-width="${thatch ? 2.6 : 2}" ${thatch ? 'stroke-dasharray="1.8 1.2"' : ''}/>`
    + `<line x1="0" y1="${f(apex)}" x2="0" y2="${f(apex - 7)}" stroke="#7A5A3A" stroke-width="1.4"/><circle cx="0" cy="${f(apex - 8)}" r="2" fill="#E9BF4E" stroke="#8A6A22" stroke-width="0.6"/>`;
}
// Fontaine (Puits 2), cahier des charges du 11 oct. : la fontaine au style chibi. Grand bassin de pierre au trait épais,
// eau qui brille (glace l'hiver), colonne ronde à bague, vasque d'où l'eau retombe en rideau, pavage de galets, fleurs ;
// les jets d'eau sont animés à part (fountainFrames). Mêmes hauteurs qu'avant (jet en z 42), même kiosque pour ses skins.
function fountain(skin) {
  const blanche = skin === 'pierre-blanche';
  const pierre = blanche ? { top: '#FFFFFF', left: '#F1ECE2', right: '#CFC7B8' } : { top: '#ECE5D6', left: '#CDC2AA', right: '#A39780' };
  const pave = { top: '#EFE9DC', left: '#D7CDB8', right: '#B3A68D' };
  const kiosk = skin === 'toit-bleu' || skin === 'toit-chaume';
  const r = KIOSK_R * 0.88;
  const galets = devant => {
    let o = '';
    for (let i = 0; i < 16; i++) { const t = (i / 16) * Math.PI * 2 + 0.2, u = Math.cos(t) * 0.86, v = Math.sin(t) * 0.86; if ((u + v > 0) === devant) o += pierreRonde(u, v, 4 + (i % 3) * 0.8, pave); }
    return o;
  };
  const poteauK = (u, v) => poteau(u, v, 0, KIOSK_Z, 0.045, { top: '#B07A48', left: '#9A6236', right: '#764522' }, `kp${u > 0 ? 'a' : u < 0 ? 'b' : v > 0 ? 'c' : 'd'}`);
  const fleurs = (u, v) => { const [x, y] = P(u, v, 0); return `<path d="M${f2(x - 5)},${f2(y)} q1,-5 5,-6 q4,1 5,6 Z" fill="#6DB04F" stroke="${INK_C}" stroke-width="1"/>` + [[-2.4, -6, '#F7A8C8'], [2, -7, '#FFD45E'], [0, -4.4, '#FFFFFF']].map(([dx, dy, c]) => `<circle cx="${f2(x + dx)}" cy="${f2(y + dy)}" r="1.7" fill="${c}" stroke="${INK_C}" stroke-width="0.6"/>`).join(''); };
  let out = disc(0, 0.02, 0, 1.0, 'rgba(120,85,45,.2)') + galets(false)
    + (kiosk ? poteauK(-r, 0) + poteauK(0, -r) : '');
  // Grand bassin, colonne à bague, vasque
  out += bassinRond(0, 0, 0, 10, 0.72, pierre, 'fobasin')
    + poteau(0, 0, 9, 30, 0.085, pierre, 'focol')
    + bassinRond(0, 0, 18, 20.5, 0.11, pierre, 'fobague', false)
    + bassinRond(0, 0, 29, 34, 0.3, pierre, 'fobowl');
  // Le rideau d'eau qui retombe de la vasque dans le bassin (gelé l'hiver)
  if (!HIVER) {
    [-0.7, -0.25, 0.25, 0.7].forEach(k => {
      const [x0, y0] = P(0, 0, 33); const dx = k * 0.3 * 45.25, dy = Math.sqrt(1 - k * k) * 0.3 * 22.63;
      out += `<path d="M${f2(x0 + dx)},${f2(y0 + dy)} q${f2(dx * 0.15)},6 ${f2(dx * 0.25)},${f2(22 - dy * 0.4)}" stroke="#7FC4E8" stroke-width="2.2" fill="none" stroke-linecap="round" opacity=".85"/>`
        + `<path d="M${f2(x0 + dx - 0.6)},${f2(y0 + dy + 1)} q${f2(dx * 0.1)},4 ${f2(dx * 0.15)},8" stroke="#E6F6FF" stroke-width="0.9" fill="none" stroke-linecap="round"/>`;
    });
  }
  out += poteau(0, 0, 33, 40, 0.035, pierre, 'fotip');
  const [tx, ty] = P(0, 0, 42);
  out += `<circle cx="${f2(tx)}" cy="${f2(ty + 0.6)}" r="2.8" fill="${pierre.top}" stroke="${INK_C}" stroke-width="${DETAIL}"/>`;
  out += galets(true) + fleurs(-0.95, 0.35) + fleurs(0.4, 0.92);
  if (kiosk) out += poteauK(r, 0) + poteauK(0, r) + kioskRoof(skin);
  return spriteChibi(out, BUILDING_BOX);
}
// Grand bosquet (Bosquet 2) : quatre arbres dont un sapin, souche et hache, champignons
// Grand bosquet (Bosquet 2), cahier des charges du 11 oct. : au style chibi. Trois arbres ronds en grosses boules et un
// sapin en étages festonnés ; devant, une souche à cernes où la hache est plantée, une bûche, des champignons, des
// fleurettes. Même emprise et même crête qu'avant (les pièces rares s'y accrochent).
function bigGrove(skin) {
  const colors = FOLIAGE[skin];
  const vert = { light: '#C9EE98', mid: '#86C95E', dark: '#559A3E' };
  const tree = (u, v, sc, base, id) => {
    const [x, y] = P(u, v, 0);
    return arbreRond(u, v, sc, colors || base, id) + seasonDots(skin, x, y - 38 * sc, 12 * sc) + seasonDots(skin, x - 8 * sc, y - 27 * sc, 10 * sc);
  };
  const pinCouleurs = skin === 'givre' ? { light: '#FFFFFF', mid: '#C9DCEB', dark: '#8FAEC6' } : skin === 'automne' ? { light: '#A9D27E', mid: '#5E9A4C', dark: '#3A6E3A' } : { light: '#9FD38A', mid: '#4F9A4C', dark: '#2F6E3A' };
  const champi = (u, v, s, cap = '#E8574A') => {
    const [x, y] = P(u, v, 0);
    return `<path d="M${f2(x - 1.8 * s)},${f2(y)} L${f2(x - 1.4 * s)},${f2(y - 4.6 * s)} L${f2(x + 1.4 * s)},${f2(y - 4.6 * s)} L${f2(x + 1.8 * s)},${f2(y)} Z" fill="#F6EEDC" stroke="${INK_C}" stroke-width="${DETAIL}" stroke-linejoin="round"/>`
      + `<path d="M${f2(x - 4.4 * s)},${f2(y - 4 * s)} Q${f2(x - 4 * s)},${f2(y - 9.6 * s)} ${f2(x)},${f2(y - 9.8 * s)} Q${f2(x + 4 * s)},${f2(y - 9.6 * s)} ${f2(x + 4.4 * s)},${f2(y - 4 * s)} Q${f2(x)},${f2(y - 3 * s)} ${f2(x - 4.4 * s)},${f2(y - 4 * s)} Z" fill="${cap}" stroke="${INK_C}" stroke-width="${DETAIL}" stroke-linejoin="round"/>`
      + `<circle cx="${f2(x - 1.6 * s)}" cy="${f2(y - 7.2 * s)}" r="${f2(0.9 * s)}" fill="#FFFFFF"/><circle cx="${f2(x + 1.8 * s)}" cy="${f2(y - 6 * s)}" r="${f2(0.7 * s)}" fill="#FFFFFF"/>`;
  };
  const fleur = (u, v, c) => {
    const [x, y] = P(u, v, 0);
    return trait([x, y], [x, y - 4], 1, '#4F8F3A') + [0, 1, 2, 3, 4].map(k => { const a = (k / 5) * Math.PI * 2; return `<circle cx="${f2(x + Math.cos(a) * 1.5)}" cy="${f2(y - 5 + Math.sin(a) * 1.5)}" r="1.3" fill="${c}" stroke="${INK_C}" stroke-width="0.5"/>`; }).join('') + `<circle cx="${f2(x)}" cy="${f2(y - 5)}" r="0.8" fill="#FFE07A"/>`;
  };
  let out = tree(-0.5, -0.5, 1.15, vert, 'bg1') + tree(0.45, -0.5, 1.0, { light: '#D7F0A8', mid: '#9AD36A', dark: '#649F45' }, 'bg2')
    + tree(0.05, 0.05, 1.25, vert, 'bg3')
    + sapin(-0.62, 0.8, 1.05, pinCouleurs, 'bgpin');
  // Souche à cernes, hache plantée ; bûche ; champignons ; fleurettes
  const [sx, sy] = P(0.55, 0.52, 0), [tx, ty] = P(0.55, 0.52, 8);
  out += `<ellipse cx="${f2(sx)}" cy="${f2(sy + 1)}" rx="9" ry="3.6" fill="rgba(90,60,30,.22)"/>`
    + poteau(0.55, 0.52, 0, 8, 0.14, { top: '#E7C08A', left: '#B47442', right: '#7A4824' }, 'bgsouche')
    + `<ellipse cx="${f2(tx)}" cy="${f2(ty)}" rx="3.4" ry="1.7" fill="none" stroke="#B98552" stroke-width="0.9"/><ellipse cx="${f2(tx)}" cy="${f2(ty)}" rx="1.4" ry="0.7" fill="none" stroke="#B98552" stroke-width="0.8"/>`
    + trait([tx + 1, ty - 1], [tx + 8, ty - 13], 4.6, INK_C) + trait([tx + 1, ty - 1], [tx + 8, ty - 13], 2.2, '#C98A52')
    + `<path d="M${f2(tx + 5)},${f2(ty - 16)} l8,2.4 l-2.6,6 l-7,-3.4 Z" fill="#B8C2CA" stroke="${INK_C}" stroke-width="${DETAIL}" stroke-linejoin="round"/><path d="M${f2(tx + 11.6)},${f2(ty - 13)} l-1.8,4.2" stroke="#EEF3F6" stroke-width="0.9"/>`
    + buche(0.72, 0.12, 0.98, -0.12, 0, 3.6);
  out += champi(0.2, 0.68, 0.95) + champi(0.32, 0.62, 0.7) + champi(0.82, 0.74, 0.8, '#E9A24A');
  if (!HIVER) out += fleur(0.06, 0.92, '#F7A8C8') + fleur(0.16, 0.97, '#FFFFFF') + fleur(0.92, 0.4, '#FFD45E');
  return spriteChibi(out, BUILDING_BOX);
}
// Potager 2 : planches cultivées, serre vitrée au fond, épouvantail
// Potager, palier II (cahier des charges du 11 oct.) : la serre au style chibi. Socle de briques, cadre de bois blanc au
// trait épais, vitres bleutées qui brillent, porte vitrée sur le pignon, un petit arbre et des pots dedans ; devant, un
// carré surélevé de plants de tomates ; à droite, un épouvantail tout mignon. Même emprise, même crête qu'avant.
function serre(u0, v0, u1, v1, h, hr) {
  const um = (u0 + u1) / 2, z0 = 4, zt = z0 + h, zr = zt + hr;
  const cadre = (a, b, w = 1.8) => trait(a, b, w + 1.8, INK_C) + trait(a, b, w, '#F7F2E8');
  const vitre = (pts, id, c0 = 'rgba(214,240,248,.42)', c1 = 'rgba(160,206,226,.55)') => degrade(id, c0, c1) + polyC(pts, `url(#${id})`, DETAIL);
  const reflet = (a, b) => trait(a, b, 1.6, 'rgba(255,255,255,.75)');
  let out = bloc(u0, v0, u1, v1, 0, z0, { top: '#E3A07A', left: '#C66B47', right: '#A05035' }, 'sbase', TRAIT);
  // dedans : un petit arbre en pot et des pots de semis, vus à travers les vitres
  out += arbreRond(um - 0.05, (v0 + v1) / 2, 0.5, { light: '#D7F0A8', mid: '#9ED67B', dark: '#6FA94F' }, 'sarb').replace(/<ellipse[^>]*rgba\(90,70,30,\.2\)"\/>/, '');
  // pan arrière du toit, pignon, mur avant (+v), mur droit (+u), pan avant du toit
  out += vitre([[u0, v0, zt], [u0, v1, zt], [um, v1, zr], [um, v0, zr]], 'sv1', 'rgba(190,226,240,.55)', 'rgba(150,196,218,.65)')
    + vitre([[u0, v1, z0], [u1, v1, z0], [u1, v1, zt], [um, v1, zr], [u0, v1, zt]], 'sv2')
    + vitre([[u1, v0, z0], [u1, v1, z0], [u1, v1, zt], [u1, v0, zt]], 'sv3', 'rgba(170,214,232,.5)', 'rgba(130,184,208,.62)')
    + vitre([[um, v0, zr], [um, v1, zr], [u1, v1, zt], [u1, v0, zt]], 'sv4', 'rgba(228,246,252,.7)', 'rgba(176,216,234,.75)');
  // reflets en biais sur les vitres
  out += reflet(P(u0 + 0.1, v1, z0 + 4), P(u0 + 0.22, v1, zt - 3)) + reflet(P(u1, v1 - 0.12, z0 + 4), P(u1, v1 - 0.26, zt - 4)) + reflet(P(um + 0.1, v1 - 0.1, zr - 3), P(u1 - 0.08, v1 - 0.22, zt + 2));
  // porte vitrée au milieu du pignon
  const d0 = um - 0.12, d1 = um + 0.12;
  out += cadre(P(d0, v1, z0), P(d0, v1, z0 + 17)) + cadre(P(d1, v1, z0), P(d1, v1, z0 + 17)) + cadre(P(d0, v1, z0 + 17), P(d1, v1, z0 + 17));
  const [kx, ky] = P(d1 - 0.04, v1, z0 + 8);
  out += `<circle cx="${f2(kx)}" cy="${f2(ky)}" r="1.2" fill="#F2C04B" stroke="${INK_C}" stroke-width="0.7"/>`;
  // cadre de bois blanc : montants, traverses, rampants, faîtage
  [u0, u0 + (d0 - u0) / 2, d1 + (u1 - d1) / 2, u1].forEach(u => { out += cadre(P(u, v1, z0), P(u, v1, zt)); });
  [v1, v1 + (v0 - v1) / 3, v1 + (2 * (v0 - v1)) / 3, v0].forEach(v => { out += cadre(P(u1, v, z0), P(u1, v, zt)); });
  out += cadre(P(u0, v1, z0 + h / 2), P(d0, v1, z0 + h / 2)) + cadre(P(d1, v1, z0 + h / 2), P(u1, v1, z0 + h / 2)) + cadre(P(u1, v1, z0 + h / 2), P(u1, v0, z0 + h / 2));
  out += cadre(P(u0, v1, zt), P(u1, v1, zt)) + cadre(P(u1, v1, zt), P(u1, v0, zt));
  [v1, v1 + (v0 - v1) / 3, v1 + (2 * (v0 - v1)) / 3, v0].forEach(v => { out += cadre(P(um, v, zr), P(u1, v, zt)); });
  out += cadre(P(u0, v1, zt), P(um, v1, zr), 2.2) + cadre(P(um, v1, zr), P(u1, v1, zt), 2.2) + cadre(P(um, v0, zr), P(um, v1, zr), 2.2);
  if (HIVER) out += snowPan(P(um, v0, zr), P(um, v1, zr), P(u1, v1, zt), P(u1, v0, zt), 0.55, true);
  // petit épi doré au bout du faîtage
  const [ex, ey] = P(um, v1, zr);
  out += trait([ex, ey], [ex, ey - 5], 3.4, INK_C) + trait([ex, ey], [ex, ey - 5], 1.6, '#F7F2E8') + `<circle cx="${f2(ex)}" cy="${f2(ey - 6.4)}" r="2" fill="#F2C04B" stroke="${INK_C}" stroke-width="1"/>`;
  return out;
}
// Épouvantail chibi en (u, v) : piquet et bras de bois, chemise bleue rapiécée, tête en sac cousue qui sourit, chapeau de
// paille, brins de paille aux poignets
function epouvantail(u, v) {
  const [x, y] = P(u, v, 0);
  const b = (a, c, w, col) => trait(a, c, w + 2.4, INK_C) + trait(a, c, w, col);
  let out = `<ellipse cx="${f2(x)}" cy="${f2(y)}" rx="7" ry="3" fill="rgba(90,60,30,.22)"/>`
    + b([x, y], [x, y - 30], 2.6, '#B07A48') + b([x - 13, y - 24], [x + 13, y - 24], 2.4, '#B07A48');
  // paille aux poignets
  [[-14, 1], [14, -1]].forEach(([dx, s]) => { out += [-2, 0, 2].map(k => trait([x + dx, y - 24], [x + dx - s * 3, y - 21 + k], 1.2, '#E8C35A')).join(''); });
  // chemise
  out += `<path d="M${f2(x - 8)},${f2(y - 27)} Q${f2(x)},${f2(y - 29)} ${f2(x + 8)},${f2(y - 27)} L${f2(x + 6)},${f2(y - 12)} Q${f2(x)},${f2(y - 10)} ${f2(x - 6)},${f2(y - 12)} Z" fill="#6E95CF" stroke="${INK_C}" stroke-width="${TRAIT}" stroke-linejoin="round"/>`
    + `<rect x="${f2(x + 0.5)}" y="${f2(y - 19)}" width="4" height="3.6" fill="#E8C35A" stroke="${INK_C}" stroke-width="0.8"/>`
    + trait([x, y - 27], [x, y - 13], 0.9, 'rgba(40,60,110,.5)');
  // tête en sac, couture, yeux, sourire, joues
  out += `<circle cx="${f2(x)}" cy="${f2(y - 33)}" r="5.6" fill="#EAD7A4" stroke="${INK_C}" stroke-width="${TRAIT}"/>`
    + `<circle cx="${f2(x - 2)}" cy="${f2(y - 33.6)}" r="0.9" fill="${INK_C}"/><circle cx="${f2(x + 2)}" cy="${f2(y - 33.6)}" r="0.9" fill="${INK_C}"/>`
    + `<path d="M${f2(x - 2)},${f2(y - 31.4)} q2,1.8 4,0" stroke="${INK_C}" stroke-width="0.9" fill="none" stroke-linecap="round"/>`
    + `<circle cx="${f2(x - 3.4)}" cy="${f2(y - 31.6)}" r="0.9" fill="#F4A3A3"/><circle cx="${f2(x + 3.4)}" cy="${f2(y - 31.6)}" r="0.9" fill="#F4A3A3"/>`;
  // chapeau de paille (neige dessus l'hiver)
  out += `<ellipse cx="${f2(x)}" cy="${f2(y - 37)}" rx="9" ry="2.6" fill="${HIVER ? NEIGE.light : '#E8C35A'}" stroke="${INK_C}" stroke-width="${DETAIL}"/>`
    + `<path d="M${f2(x - 4.6)},${f2(y - 37.4)} Q${f2(x - 4)},${f2(y - 43)} ${f2(x)},${f2(y - 43)} Q${f2(x + 4)},${f2(y - 43)} ${f2(x + 4.6)},${f2(y - 37.4)} Z" fill="${HIVER ? NEIGE.light : '#E8C35A'}" stroke="${INK_C}" stroke-width="${DETAIL}" stroke-linejoin="round"/>`
    + trait([x - 4.4, y - 38.6], [x + 4.4, y - 38.6], 1.4, '#C8553D');
  return out;
}
function greenhouseGarden(skin) {
  const [u0, v0, u1, v1, h] = [-0.85, 0.08, 0.85, 0.85, 6];
  let out = disc(0, 0, 0, 1.15, 'rgba(120,85,45,.2)') + (skin ? clotureChibi(skin) : '');
  out += serre(-0.8, -0.85, 0.3, -0.2, 20, 14);
  // carré de tomates
  out += bloc(u0, v0, u1, v1, 0, h, { top: '#7A4E30', left: '#C98448', right: '#9E5F30' }, 'pgb')
    + degrade('pgterre', '#8A5A38', '#6A4228', true) + polyC([[u0 + 0.06, v0 + 0.06, h], [u1 - 0.06, v0 + 0.06, h], [u1 - 0.06, v1 - 0.06, h], [u0 + 0.06, v1 - 0.06, h]], 'url(#pgterre)', DETAIL);
  [0.33, 0.66].forEach(k => { out += trait(P(u0 + (u1 - u0) * k, v1, 0.6), P(u0 + (u1 - u0) * k, v1, h - 0.6), DETAIL, 'rgba(60,40,25,.5)'); });
  const tomate = (u, v) => {
    const [x, y] = P(u, v, h);
    let o = trait([x + 2, y], [x + 2, y - 15], 3, INK_C) + trait([x + 2, y], [x + 2, y - 15], 1.4, '#C98A52');
    [[-3, -6, -30], [3, -9, 30], [-2.4, -12, -20]].forEach(([dx, dy, a]) => { o += `<ellipse cx="${f2(x + dx)}" cy="${f2(y + dy)}" rx="3.8" ry="2" fill="#6DB64C" stroke="${INK_C}" stroke-width="0.8" transform="rotate(${a} ${f2(x + dx)} ${f2(y + dy)})"/>`; });
    if (!HIVER) [[-1.6, -4.4], [1.8, -7.6], [-0.6, -10]].forEach(([dx, dy]) => { o += `<circle cx="${f2(x + dx)}" cy="${f2(y + dy)}" r="2.1" fill="#E2574C" stroke="${INK_C}" stroke-width="0.8"/><circle cx="${f2(x + dx - 0.6)}" cy="${f2(y + dy - 0.6)}" r="0.6" fill="#FFB0A3"/>`; });
    return o;
  };
  for (let k = 0; k < 2; k++) for (let j = 0; j < 4; j++) out += tomate(-0.6 + j * 0.38, 0.3 + k * 0.36);
  out += epouvantail(0.86, -0.72);
  return spriteChibi(out, BUILDING_BOX);
}
// Maison de la forge (Atelier II et III) : murs de pierres claires à chaînes d'angle, grande porte cintrée à la hauteur
// d'Aster, fenêtres chaudes, gros toit de bardeaux (ou celui du skin) à rive épaisse, enseigne dorée (skin)
export function maisonForge(skin) {
  const u0 = -0.8, u1 = 0.15, v0 = -0.55, v1 = 0.45, H = 44;
  const roof = roofOf(skin, { front: '#C25B45', back: '#9A4535' });
  const bord = ` stroke="${INK_C}" stroke-width="${TRAIT}" stroke-linejoin="round"`;
  const PIERRE = { top: '#E6DCC8', left: '#D2C3A4', right: '#A69476' };
  const pts = l => l.map(([x, y]) => `${f2(x)},${f2(y)}`).join(' ');
  let out = '';
  // Murs de pierre : assises, joints décalés, chaînes d'angle plus claires
  out += bloc(u0, v0, u1, v1, 0, H, PIERRE, 'fgmur');
  for (let z = 5.5, row = 0; z < H; z += 5.5, row++) {
    out += trait(P(u0, v1, z), P(u1, v1, z), 1, 'rgba(90,70,45,.4)') + trait(P(u1, v1, z), P(u1, v0, z), 1, 'rgba(70,55,35,.4)');
    for (let u = u0 + (row % 2 ? 0.1 : 0.2); u < u1 - 0.03; u += 0.2) out += trait(P(u, v1, z - 5.5), P(u, v1, z), 1, 'rgba(90,70,45,.4)');
    for (let v = v0 + (row % 2 ? 0.1 : 0.2); v < v1 - 0.03; v += 0.2) out += trait(P(u1, v, z - 5.5), P(u1, v, z), 1, 'rgba(70,55,35,.4)');
  }
  for (let z = 0, k = 0; z < H - 1; z += 5.5, k++) {
    const w = k % 2 ? 0.07 : 0.12;
    out += polyC([[u1 - w, v1, z], [u1, v1, z], [u1, v1, z + 5.5], [u1 - w, v1, z + 5.5]], '#EFE7D6', 1) + polyC([[u1, v1, z], [u1, v1 - w, z], [u1, v1 - w, z + 5.5], [u1, v1, z + 5.5]], '#C9BB9E', 1);
  }
  // Grande porte cintrée (côté joueur), double battant, ferrures, poignées
  const um = -0.36, r = 0.2, hd = 36;
  const arc = Array.from({ length: 13 }, (_, k) => { const t = Math.PI - (k / 12) * Math.PI; return P(um + Math.cos(t) * (r + 0.04), v1, hd - r * 34 + Math.sin(t) * (r + 0.04) * 34); });
  out += `<polygon points="${pts([P(um - r - 0.04, v1, 0), ...arc, P(um + r + 0.04, v1, 0)])}" fill="#C9BB9E"${bord}/>`;
  const arcP = Array.from({ length: 13 }, (_, k) => { const t = Math.PI - (k / 12) * Math.PI; return P(um + Math.cos(t) * r, v1, hd - 2 - r * 34 + Math.sin(t) * r * 34); });
  out += `<polygon points="${pts([P(um - r, v1, 0), ...arcP, P(um + r, v1, 0)])}" fill="#6A3F22"${bord}/>`
    + trait(P(um, v1, 0), P(um, v1, hd - 2), 1.6, INK_C)
    + [10, 24].map(z => trait(P(um - r + 0.03, v1, z), P(um + r - 0.03, v1, z), 2.2, '#55504A')).join('')
    + [-0.05, 0.05].map(du => `<circle cx="${f2(P(um + du, v1, 16)[0])}" cy="${f2(P(um + du, v1, 16)[1])}" r="1.5" fill="#F2C04B" stroke="${INK_C}" stroke-width="0.8"/>`).join('');
  // Fenêtres chaudes : une à gauche de la porte (en haut), deux sur le côté +u
  const fenetre = (pts4, id) => `<polygon points="${pts(pts4)}" fill="#FFE6A3"${bord}/>` + trait([(pts4[0][0] + pts4[1][0]) / 2, (pts4[0][1] + pts4[1][1]) / 2], [(pts4[2][0] + pts4[3][0]) / 2, (pts4[2][1] + pts4[3][1]) / 2], DETAIL, INK_C);
  out += fenetre([P(-0.74, v1, 26), P(-0.62, v1, 26), P(-0.62, v1, 38), P(-0.74, v1, 38)], 'f1')
    + fenetre([P(u1, -0.4, 22), P(u1, -0.22, 22), P(u1, -0.22, 36), P(u1, -0.4, 36)], 'f2')
    + fenetre([P(u1, 0.06, 22), P(u1, 0.24, 22), P(u1, 0.24, 36), P(u1, 0.06, 36)], 'f3');
  // Gros toit de bardeaux (ou celui du skin), faîtière ; enseigne dorée (skin)
  const [zr, hr, o] = [H, 14, 0.1];
  out += gable(u0, v0, u1, v1, zr, hr, { front: roof.front, back: roof.back, gable: PIERRE.right }, o, bord)
    + (roofTextureOf(skin, null, u0, v0, u1, v1, zr, hr, o) || (HIVER ? '' : bardeaux(u0, v0, u1, v1, zr, hr, o)));
  const vm = (v0 + v1) / 2, r0 = P(u0 - o, vm, zr + hr), r1 = P(u1 + o, vm, zr + hr);
  out += riveGable(u0, v0, u1, v1, zr, hr, o, mixHex(roof.back, '#3C2819', 0.15));
  out += trait(r0, r1, 7, INK_C) + trait(r0, r1, 3.6, HIVER ? '#F6FAFD' : mixHex(roof.back, '#3C2819', 0.2));
  if (skin === 'enseigne-doree') out += goldenSign(-0.78, v1, 32);
  return out;
}
// Enseigne au marteau pendue à une potence, à l'angle avant de la maison de la forge
export function enseigneMarteau(u1 = 0.15, v1 = 0.45) {
  const [sx, sy] = P(u1, v1, 30);
  return trait([sx, sy], [sx + 12, sy + 6], 4, INK_C) + trait([sx, sy], [sx + 12, sy + 6], 2, '#9E5F30')
    + trait([sx + 9, sy + 4.5], [sx + 9, sy + 8], 1, INK_C)
    + `<rect x="${f2(sx + 3)}" y="${f2(sy + 8)}" width="12" height="10" rx="2.5" fill="#F3D27A" stroke="${INK_C}" stroke-width="${DETAIL}"/>`
    + trait([sx + 6, sy + 16], [sx + 11, sy + 11], 1.8, '#7A4E2C') + `<rect x="${f2(sx + 9.6)}" y="${f2(sy + 9.4)}" width="4.6" height="2.6" rx="0.6" fill="#5F6A75" stroke="${INK_C}" stroke-width="0.6" transform="rotate(-45 ${f2(sx + 11.9)} ${f2(sy + 10.7)})"/>`;
}
// Tonneau cerclé chibi en (u, v)
export function tonneauChibi(u, v, id) {
  return poteau(u, v, 0, 13, 0.1, { top: '#C98448', left: '#D99858', right: '#9E5F30' }, id)
    + [3.5, 9.5].map(z => { const [x, y] = P(u, v, z); return `<path d="M${f2(x - 4.5)},${f2(y)} A4.5,2.26 0 0 0 ${f2(x + 4.5)},${f2(y)}" fill="none" stroke="${INK_C}" stroke-width="1.6"/>`; }).join('');
}
// Forge (Atelier 2), cahier des charges du 11 oct. : l'atelier de Rivet devient une forge de pierre au style chibi.
// Murs de pierres claires à chaînes d'angle, grande porte cintrée à la hauteur d'Aster, fenêtres chaudes, gros toit de
// bardeaux (ou celui du skin) ; le grand four de briques bombé et sa bouche qui rougeoie (lumière du jeu en u 0.88), sa
// haute cheminée ronde (fumée du jeu en z 58) ; enseigne au marteau, tonneaux, caisse. Même crête qu'avant.
// La maison (maisonForge) sert aussi à la Fonderie (palier III).
function forge(skin) {
  const bord = ` stroke="${INK_C}" stroke-width="${TRAIT}" stroke-linejoin="round"`;
  const pts = l => l.map(([x, y]) => `${f2(x)},${f2(y)}`).join(' ');
  let out = disc(0, 0.05, 0, 1.12, 'rgba(120,85,45,.18)') + maisonForge(skin);
  // Grand four de briques : socle, voûte bombée, bouche qui rougeoie (côté +u)
  const K = { u0: 0.25, u1: 0.88, v0: -0.45, v1: 0.3 }, hk = 22;
  out += bloc(K.u0, K.v0, K.u1, K.v1, 0, hk, { top: '#E89670', left: '#CF7550', right: '#A5563A' }, 'fgfour');
  for (let z = 0, row = 0; z < hk; z += 4.4, row++) {
    if (z > 0) out += trait(P(K.u0, K.v1, z), P(K.u1, K.v1, z), 1, 'rgba(90,35,20,.45)') + trait(P(K.u1, K.v0, z), P(K.u1, K.v1, z), 1, 'rgba(70,25,15,.45)');
    for (let u = K.u0 + (row % 2 ? 0.1 : 0.2); u < K.u1 - 0.02; u += 0.2) out += trait(P(u, K.v1, z), P(u, K.v1, Math.min(hk, z + 4.4)), 1, 'rgba(90,35,20,.45)');
    for (let v = K.v0 + (row % 2 ? 0.1 : 0.2); v < K.v1 - 0.02; v += 0.2) out += trait(P(K.u1, v, z), P(K.u1, v, Math.min(hk, z + 4.4)), 1, 'rgba(70,25,15,.45)');
  }
  const [dx, dy] = P((K.u0 + K.u1) / 2, (K.v0 + K.v1) / 2, hk);
  out += `<path d="M${f2(P(K.u0, K.v1, hk)[0])},${f2(P(K.u0, K.v1, hk)[1])} Q${f2(dx - 6)},${f2(dy - 24)} ${f2(P(K.u1, K.v0, hk)[0])},${f2(P(K.u1, K.v0, hk)[1])} L${f2(P(K.u1, K.v1, hk)[0])},${f2(P(K.u1, K.v1, hk)[1])} Z" fill="#D8805A"${bord}/>`
    + `<path d="M${f2(P(K.u0, K.v1, hk)[0] + 6)},${f2(P(K.u0, K.v1, hk)[1] - 6)} Q${f2(dx - 8)},${f2(dy - 19)} ${f2(dx + 6)},${f2(dy - 16)}" fill="none" stroke="rgba(255,220,190,.55)" stroke-width="2"/>`;
  const bouche = Array.from({ length: 9 }, (_, k) => { const t = Math.PI - (k / 8) * Math.PI; return P(K.u1, -0.05 + Math.cos(t) * 0.16, 3 + Math.sin(t) * 10); });
  out += `<polygon points="${pts([P(K.u1, -0.21, 1), ...bouche, P(K.u1, 0.11, 1)])}" fill="#3A1E14"${bord}/>`
    + `<ellipse cx="${f2(P(K.u1, -0.05, 4)[0])}" cy="${f2(P(K.u1, -0.05, 4)[1])}" rx="6" ry="3" fill="#F28A3A"/>`
    + `<ellipse cx="${f2(P(K.u1, -0.05, 4)[0])}" cy="${f2(P(K.u1, -0.05, 4)[1] - 0.6)}" rx="3" ry="1.5" fill="#FFE07A"/>`;
  // Haute cheminée ronde de briques (bagues), chapeau de pierre ; la fumée du jeu sort en z 58
  out += poteau(0.55, -0.2, 18, 56, 0.1, { top: '#5E3A2A', left: '#CF7550', right: '#A5563A' }, 'fgchem')
    + [28, 38, 48].map(z => { const [x, y] = P(0.55, -0.2, z); return `<path d="M${f2(x - 4.5)},${f2(y)} A4.5,2.26 0 0 0 ${f2(x + 4.5)},${f2(y)}" fill="none" stroke="rgba(90,35,20,.5)" stroke-width="1.1"/>`; }).join('')
    + bloc(0.46, -0.29, 0.64, -0.11, 55, 58, { top: HIVER ? NEIGE.light : '#B9B2A2', left: '#968E7C', right: '#736B5B' }, 'fgchap');
  out += enseigneMarteau();
  // Tonneaux cerclés, caisse
  out += tonneauChibi(0.55, 0.6, 'fgt1') + tonneauChibi(0.32, 0.74, 'fgt2')
    + bloc(-0.74, 0.62, -0.46, 0.86, 0, 12, { top: '#E9B97C', left: '#D0904F', right: '#A8683A' }, 'fgcaisse')
    + trait(P(-0.74, 0.86, 0.5), P(-0.46, 0.86, 11.5), 1.2, 'rgba(90,50,20,.55)');
  return spriteChibi(out, BUILDING_BOX);
}
// Grand ponton (Ponton 2) : appontement en L, cabane de pêcheur sur pilotis, lanterne
// Ponton, palier II (cahier des charges du 11 oct.) : le palier I (jetée, palier du sable, barque) et, derrière le palier,
// la cabane du pêcheur au style chibi : plancher surélevé au niveau des planches, murs de bardage, porte ronde à la hauteur
// d'Aster, hublot et jardinière, gros toit bleu qui déborde ; un séchoir à filets sur la jetée et la lanterne pendue au coin de la cabane
// (le jeu y allume sa lumière de nuit).
function cabanePecheur() {
  // Le pignon et la porte regardent le palier (+v) ; le pan bleu qu'on voit descend vers +u
  const u0 = 0.08, u1 = 0.94, v0 = -1.06, v1 = -0.5, Z = 10, H = 34;
  const BARDAGE = { top: '#D9A262', left: '#D08E52', right: '#A86636' };
  const bord = ` stroke="${INK_C}" stroke-width="${TRAIT}" stroke-linejoin="round"`;
  const um = (u0 + u1) / 2;
  let out = bloc(u0 - 0.04, v0 - 0.04, u1 + 0.04, v1 + 0.04, 0, Z, { top: '#A9703F', left: '#8B5631', right: '#6A3F22' }, 'cbsocle')
    + bloc(u0, v0, u1, v1, Z, Z + H, BARDAGE, 'cbmur');
  // Bardage : planches horizontales larges (clin) sur les deux faces
  for (let z = Z + 7; z < Z + H - 2; z += 7) out += trait(P(u0, v1, z), P(u1, v1, z), 1, 'rgba(90,50,20,.35)') + trait(P(u1, v0, z), P(u1, v1, z), 1, 'rgba(60,30,10,.35)');
  // Porte ronde au milieu du pignon, deux planches, poignée dorée
  const r = 0.17, hd = 34;
  const arc = Array.from({ length: 13 }, (_, k) => { const a = Math.PI - (k / 12) * Math.PI; return P(um + Math.cos(a) * r, v1, Z + hd - r * 34 + Math.sin(a) * r * 34); });
  const porte = [P(um - r, v1, Z), ...arc, P(um + r, v1, Z)];
  out += `<polygon points="${porte.map(([x, y]) => `${f2(x)},${f2(y)}`).join(' ')}" fill="#6A3F22"${bord}/>`
    + trait(P(um, v1, Z + 1), P(um, v1, Z + hd - 1), 1.3, 'rgba(255,220,170,.35)')
    + `<circle cx="${f2(P(um + r - 0.05, v1, Z + 16)[0])}" cy="${f2(P(um + r - 0.05, v1, Z + 16)[1])}" r="2" fill="#F2C04B" stroke="${INK_C}" stroke-width="1"/>`;
  // Bouée rayée à gauche de la porte
  const [bx, by] = P(u0 + 0.13, v1, Z + 22);
  out += `<circle cx="${f2(bx)}" cy="${f2(by)}" r="5.4" fill="none" stroke="${INK_C}" stroke-width="6"/><circle cx="${f2(bx)}" cy="${f2(by)}" r="5.4" fill="none" stroke="#FFFFFF" stroke-width="3.2"/><circle cx="${f2(bx)}" cy="${f2(by)}" r="5.4" fill="none" stroke="#E2574C" stroke-width="3.2" stroke-dasharray="4.2 4.3"/>`;
  // Fenêtre à croisillon (côté +u), volets bleus, jardinière fleurie
  const vc = v0 + 0.2, w = 0.11, zb = Z + 12, zh = Z + 26;
  out += `<polygon points="${[P(u1, vc - w, zb), P(u1, vc + w, zb), P(u1, vc + w, zh), P(u1, vc - w, zh)].map(([x, y]) => `${f2(x)},${f2(y)}`).join(' ')}" fill="#FFE6A3"${bord}/>`
    + trait(P(u1, vc, zb), P(u1, vc, zh), DETAIL, INK_C) + trait(P(u1, vc - w, (zb + zh) / 2), P(u1, vc + w, (zb + zh) / 2), DETAIL, INK_C)
    + [[-1, -w - 0.08], [1, w]].map(([, a]) => `<polygon points="${[P(u1, vc + a, zb), P(u1, vc + a + 0.08, zb), P(u1, vc + a + 0.08, zh), P(u1, vc + a, zh)].map(([x, y]) => `${f2(x)},${f2(y)}`).join(' ')}" fill="#5C83C2" stroke="${INK_C}" stroke-width="${DETAIL}" stroke-linejoin="round"/>`).join('')
    + bloc(u1, vc - 0.17, u1 + 0.07, vc + 0.17, Z + 7, Z + 12, { top: '#6E4A2E', left: '#D9844E', right: '#A85C31' }, 'cbjard')
    + [-0.12, -0.04, 0.04, 0.12].map((dv, i) => { const [x, y] = P(u1 + 0.035, vc + dv, Z + 14); return `<circle cx="${f2(x)}" cy="${f2(y)}" r="2.6" fill="${['#F7A8C8', '#FFD45E', '#E2574C', '#FFFFFF'][i]}" stroke="${INK_C}" stroke-width="1"/>`; }).join('');
  // Tuyau de poêle (derrière le faîtage), puis le gros toit au pignon sur le devant
  out += poteau(u0 + 0.2, v0 + 0.16, Z + H + 12, Z + H + 34, 0.045, { top: '#3D3A36', left: '#6E6A64', right: '#45413C' }, 'cbpoele')
    + toitPignon(u0, v0, u1, v1, Z + H, 30, { front: '#6FA3D9', back: '#4C7FB5', gable: BARDAGE.left }, 0.12, 'cbtoit');
  // Hublot rond dans le pignon, au-dessus de la porte
  const [hx, hy] = P(um, v1, Z + H + 11);
  out += `<ellipse cx="${f2(hx)}" cy="${f2(hy)}" rx="5" ry="5.4" fill="#E9BF4E"${bord}/><ellipse cx="${f2(hx)}" cy="${f2(hy)}" rx="3" ry="3.3" fill="#BFE3F5" stroke="${INK_C}" stroke-width="1"/>`;
  return out;
}
// Le Ponton II (cabane, séchoir, lanterne sur le corps du palier I) ; plus : posé par-dessus (le chantier du palier III)
export function pontonII(plus = '', proue = 0.52) {
  const Z = 10;
  // Séchoir à filets sur le palier : deux perches, le filet en guirlande, flotteurs rouges
  const perche = (u, v, i) => poteau(u, v, Z, Z + 30, 0.035, WOOD_DARK, `bpf${i}`);
  const f0 = P(-0.84, 0.05, Z + 27), f1 = P(-0.84, 0.55, Z + 27);
  const filet = perche(-0.84, 0.05, 0) + perche(-0.84, 0.55, 1)
    + `<path d="M${f2(f0[0])},${f2(f0[1])} Q${f2((f0[0] + f1[0]) / 2)},${f2((f0[1] + f1[1]) / 2 + 16)} ${f2(f1[0])},${f2(f1[1])} L${f2(f1[0])},${f2(f1[1] + 8)} Q${f2((f0[0] + f1[0]) / 2)},${f2((f0[1] + f1[1]) / 2 + 24)} ${f2(f0[0])},${f2(f0[1] + 8)} Z" fill="rgba(201,161,106,.3)" stroke="#C9A16A" stroke-width="1.6" stroke-dasharray="2.4 2"/>`
    + [0.17, 0.3, 0.43].map((v, i) => { const [x, y] = P(-0.84, v, Z + 27); return `<circle cx="${f2(x)}" cy="${f2(y + [11, 15, 11][i])}" r="2.4" fill="#E2574C" stroke="${INK_C}" stroke-width="1"/>`; }).join('');
  // Lanterne pendue à une potence au coin de la cabane, à côté de la porte (le jeu y allume sa lumière : [1.02, -0.42])
  const [ax, ay] = P(0.95, -0.49, Z + 40), [bx, by] = P(1.03, -0.41, Z + 40);
  const [lx, ly] = P(1.03, -0.41, Z + 26);
  const lanterne = trait([ax, ay], [bx, by], 5, INK_C) + trait([ax, ay], [bx, by], 2.6, '#55504A')
    + trait([bx, by], [lx, ly - 6], 1.4, '#3D3A36')
    + `<path d="M${f2(lx - 5)},${f2(ly - 6)} L${f2(lx + 5)},${f2(ly - 6)} L${f2(lx + 6)},${f2(ly + 5)} L${f2(lx - 6)},${f2(ly + 5)} Z" fill="#FFE08A" stroke="${INK_C}" stroke-width="${TRAIT}" stroke-linejoin="round"/>`
    + trait([lx, ly - 6], [lx, ly + 5], 1.2, '#C8952A')
    + `<path d="M${f2(lx - 7)},${f2(ly - 6)} L${f2(lx)},${f2(ly - 12)} L${f2(lx + 7)},${f2(ly - 6)} Z" fill="#3D3A36" stroke="${INK_C}" stroke-width="${DETAIL}" stroke-linejoin="round"/>`;
  return pontonCorps(cabanePecheur(), filet + lanterne + plus, { caisse: [0.4, -0.06], tonnelet: [0.06, -0.36], proue });
}
function bigPier() {
  return spriteChibi(pontonII(), PONTON1_BOX);
}

// Jets d'eau de la Fontaine : 8 images en boucle douce. Un panache qui respire au-dessus de la pointe (z 42), quatre
// gouttes qui montent et retombent dans la vasque, chacune décalée d'un quart de tour
export function fountainFrames() {
  const N = 8;
  const [x, y] = P(0, 0, 42);
  return Array.from({ length: N }, (_, f) => {
    const ph = (f / N) * Math.PI * 2;
    const h = 9 + Math.sin(ph) * 2;
    let out = `<path d="M${f2(x - 2.2)},${f2(y)} Q${f2(x - 2.6)},${f2(y - h * 0.6)} ${f2(x)},${f2(y - h)} Q${f2(x + 2.6)},${f2(y - h * 0.6)} ${f2(x + 2.2)},${f2(y)} Z" fill="#DFF4FF" stroke="#5FA8D3" stroke-width="0.9" stroke-linejoin="round"/>`
      + `<path d="M${f2(x - 0.7)},${f2(y - 1)} Q${f2(x - 1)},${f2(y - h * 0.55)} ${f2(x)},${f2(y - h + 1.6)}" stroke="#FFFFFF" stroke-width="0.9" fill="none" stroke-linecap="round"/>`;
    for (let k = 0; k < 4; k++) {
      const t = (f / N + k / 4) % 1;
      const a = Math.PI / 4 + (k * Math.PI) / 2;
      const [px, py] = P(Math.cos(a) * 0.27 * t, Math.sin(a) * 0.27 * t, 42 + h * 0.7 + 7 * Math.sin(Math.PI * t) - (h * 0.7 + 7) * t);
      out += `<circle cx="${f2(px)}" cy="${f2(py)}" r="${f2(1.7 - t * 0.5)}" fill="#BFE6FA" stroke="#5FA8D3" stroke-width="0.6" opacity="${f2(1 - t * 0.35)}"/>`;
    }
    return spriteChibi(out, BUILDING_BOX);
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
