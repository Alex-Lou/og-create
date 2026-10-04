// Puits, paliers III à VII : Lavoir, Bassin, Aqueduc, Moulin à eau, Fontaine de jouvence.
// Places laissées libres pour la boutique : seau devant, potence à poulie sur le flanc droit au bord de l'eau,
// abreuvoir et chèvre à l'avant gauche, pompe au coin droit (× 1.5 dès le palier IV).
import { ROOF_RED, WHITE_STONE, BUILDING_BOX, roofOf, roofTexture, stoneCourses } from '../palette';
import { sprite } from '../iso';
import {
  big, bigShadow, P, box, face, gable, cylinder, disc, f2, ln, dot, ell, OUT, STONE, WOOD, WOOD_DARK, GOLD,
  PLASTER, timberLeft, courseLeft, courseRight, archLeft, flowerBed, chimney
} from './kit';

const stoneOf = skin => (skin === 'pierre-blanche' ? WHITE_STONE : STONE);
const WATER = '#5AAED7';
const KIOSK = ['toit-bleu', 'toit-chaume'];
const MARBLE = { top: '#FFFFFF', left: '#F1EEF6', right: '#CFCADB' };

// Kiosque rond (skins toit bleu ou chaume) : poteaux en losange, toit conique texturé
function kiosk(skin, r, z, h = 28) {
  const thatch = skin === 'toit-chaume';
  const c = thatch ? { light: '#F3D27E', dark: '#C4943F', edge: '#A97B32' } : { light: '#86B6E6', dark: '#3F6FA3', edge: '#2E5585' };
  const [, cy] = P(0, 0, z);
  const rx = r * 45.25;
  const ry = r * 22.63;
  const apex = cy - h;
  const ty = cy - (ry * ry) / h;
  const tx = rx * Math.sqrt(Math.max(0, 1 - ((cy - ty) / ry) ** 2));
  let tex = '';
  if (thatch) for (let a = 0.12; a < Math.PI - 0.1; a += 0.08) tex += ln([rx * Math.cos(a) * 0.18, apex + (cy + ry * Math.sin(a) - apex) * 0.18], [rx * Math.cos(a) * 0.97, apex + (cy + ry * Math.sin(a) - apex) * 0.97], 'rgba(140,95,35,.45)', 0.6);
  else [0.4, 0.6, 0.8].forEach(k => { tex += `<path d="M${f2(-rx * k)},${f2(apex + h * k)} A${f2(rx * k)},${f2(ry * k)} 0 0 0 ${f2(rx * k)},${f2(apex + h * k)}" fill="none" stroke="rgba(20,40,70,.4)" stroke-width="0.8"/>`; });
  const posts = (front) => [[r * 0.9, 0], [0, r * 0.9], [-r * 0.9, 0], [0, -r * 0.9]].filter(([u, v]) => (u + v > 0) === front)
    .map(([u, v]) => box(u - 0.04, v - 0.04, u + 0.04, v + 0.04, 0, z, WOOD_DARK)).join('');
  return {
    back: posts(false),
    front: posts(true)
      + `<defs><linearGradient id="kz-${skin}" x1="0" x2="1"><stop offset="0" stop-color="${c.light}"/><stop offset="1" stop-color="${c.dark}"/></linearGradient></defs>`
      + `<path d="M0,${f2(apex)} L${f2(tx)},${f2(ty)} A${f2(rx)},${f2(ry)} 0 1 1 ${f2(-tx)},${f2(ty)} Z" fill="url(#kz-${skin})" stroke="${OUT}" stroke-width="0.8"/>` + tex
      + `<path d="M${f2(-rx)},${f2(cy)} A${f2(rx)},${f2(ry)} 0 0 0 ${f2(rx)},${f2(cy)}" fill="none" stroke="${c.edge}" stroke-width="2.2"/>`
      + ln([0, apex], [0, apex - 7], '#7A5A3A', 1.4) + dot(0, apex - 8, 2, GOLD.left)
  };
}
// Bassin rond (cylindre de pierre et son eau) en (0, 0), rayon r, hauteur h
function basin(r, h, stone, white) {
  return cylinder(0, 0, 0, h, r, stone, `bs-${Math.round(r * 100)}`)
    + (white ? stoneCourses(0, 0, 0, h, r, 1) : '')
    + disc(0, 0, h, r * 0.86, WATER) + disc(-r * 0.15, -r * 0.15, h, r * 0.4, '#7CC4E8', ' opacity=".7"');
}

/* ---------- Palier III : Lavoir ---------- */
function washhouse(skin) {
  const stone = stoneOf(skin);
  const roof = roofOf(skin, ROOF_RED);
  const u0 = -0.62, u1 = 0.52, v0 = -0.47, v1 = 0.37;
  const posts = [[u0, v0], [u1, v0], [u0, v1], [u1, v1]];
  return sprite(
    `<ellipse cx="4" cy="${f2(P(0, 0, 0)[1] + 4)}" rx="56" ry="26" fill="rgba(40,55,20,.14)"/>`
    + posts.slice(0, 2).map(([u, v]) => box(u - 0.035, v - 0.035, u + 0.035, v + 0.035, 0, 32, WOOD_DARK)).join('')
    // Bassin rectangulaire, eau, pierres à laver inclinées sur le bord avant
    + box(-0.55, -0.4, 0.45, 0.3, 0, 8, stone) + (skin === 'pierre-blanche' ? courseLeft(-0.55, 0.45, 0.3, 0, 8, 2) : '')
    + face([[-0.49, -0.34, 7.6], [0.39, -0.34, 7.6], [0.39, 0.24, 7.6], [-0.49, 0.24, 7.6]], WATER)
    + ln(P(-0.3, -0.1, 7.6), P(0.1, -0.1, 7.6), 'rgba(255,255,255,.6)', 0.8) + ln(P(-0.1, 0.08, 7.6), P(0.25, 0.08, 7.6), 'rgba(255,255,255,.5)', 0.8)
    + [-0.4, -0.12, 0.16].map(u => face([[u, 0.24, 8], [u + 0.2, 0.24, 8], [u + 0.2, 0.32, 11], [u, 0.32, 11]], stone.top, ` stroke="${OUT}" stroke-width="0.6"`)).join('')
    + posts.slice(2).map(([u, v]) => box(u - 0.035, v - 0.035, u + 0.035, v + 0.035, 0, 32, WOOD_DARK)).join('')
    + box(u0 - 0.03, v0 - 0.03, u1 + 0.03, v1 + 0.03, 30, 32, WOOD)
    + gable(u0, v0, u1, v1, 32, 16, { front: roof.front, back: roof.back, gable: WOOD.right }, 0.08)
    + roofTexture(skin, u0, v0, u1, v1, 32, 16, 0.08)
    // Corde à linge à gauche (le linge est animé à part)
    + box(-0.93, -0.63, -0.89, -0.59, 0, 24, WOOD_DARK) + box(-0.93, 0.17, -0.89, 0.21, 0, 24, WOOD_DARK)
    + ln(P(-0.91, -0.61, 23), P(-0.91, 0.19, 23), '#C9A16A', 0.6),
    BUILDING_BOX
  );
}
// Linge qui sèche et bat au vent (4 images)
const laundry = f => sprite((() => {
  const w = [0, 1, 0, -1][f];
  return [[-0.48, '#FFFFFF', 7], [-0.24, '#9FC7E8', 6], [0.0, '#F7A8C8', 8]].map(([dv, c, h], k) => {
    const a = P(-0.91, dv - 0.07, 23);
    const b = P(-0.91, dv + 0.07, 23);
    const sw = w * (k % 2 ? -1 : 1) * 1.2;
    return `<path d="M${f2(a[0])},${f2(a[1])} L${f2(b[0])},${f2(b[1])} L${f2(b[0] + sw)},${f2(b[1] + h)} Q${f2((a[0] + b[0]) / 2 + sw)},${f2((a[1] + b[1]) / 2 + h + 1.5)} ${f2(a[0] + sw)},${f2(a[1] + h)} Z" fill="${c}" stroke="rgba(60,40,25,.25)" stroke-width="0.5"/>`;
  }).join('');
})(), { x: -50, y: -60, w: 50, h: 50 });

/* ---------- Palier IV : Bassin ---------- */
function bigBasin(skin) {
  const stone = stoneOf(skin);
  const white = skin === 'pierre-blanche';
  const k = KIOSK.includes(skin) ? kiosk(skin, 1.4, 72, 30) : null;
  return big(
    bigShadow(80, 38)
    + flowerBed(-1.15, -1.1, 0.2) + flowerBed(1.1, 1.1, 0.18, ['#FFD45E', '#FFFFFF', '#A98ADB'])
    + (k ? k.back : '')
    + basin(1.0, 11, stone, white)
    // Fontaine à trois vasques
    + cylinder(0, 0, 11, 34, 0.1, PLASTER, 'bb-col')
    + cylinder(0, 0, 30, 35, 0.42, stone, 'bb-v1') + disc(0, 0, 35, 0.35, WATER)
    + cylinder(0, 0, 35, 50, 0.06, PLASTER, 'bb-col2')
    + cylinder(0, 0, 48, 52, 0.22, stone, 'bb-v2') + disc(0, 0, 52, 0.17, WATER)
    + cylinder(0, 0, 52, 60, 0.035, PLASTER, 'bb-tip')
    + (k ? k.front : '')
  );
}
// Jets d'eau du Bassin : gouttes qui jaillissent du sommet et retombent dans les vasques (4 images)
const basinJets = f => sprite((() => {
  const [x, y] = P(0, 0, 60);
  let out = `<path d="M${f2(x - 1.2)},${f2(y)} L${f2(x)},${f2(y - 9 - f)} L${f2(x + 1.2)},${f2(y)} Z" fill="#DFF4FF"/>`;
  for (let k = 0; k < 8; k++) {
    const a = (k / 8) * Math.PI * 2 + f * 0.3;
    const r = 7 + f * 3;
    out += dot(x + Math.cos(a) * r, y - 2 + f * 3 + Math.sin(a) * r * 0.45, 1.3, '#BFE6FA');
    out += dot(x + Math.cos(a + 0.4) * (14 + f * 2), y + 14 + f * 3 + Math.sin(a + 0.4) * 7, 1.1, '#BFE6FA');
  }
  return out;
})(), { x: -40, y: -90, w: 80, h: 70 });

/* ---------- Palier V : Aqueduc ---------- */
function aqueduct(skin) {
  const stone = stoneOf(skin);
  const white = skin === 'pierre-blanche';
  const k = KIOSK.includes(skin) ? kiosk(skin, 1.15, 62, 26) : null;
  const v0 = -1.32, v1 = -1.06, h = 58;
  let arcade = box(-1.45, v0, 1.42, v1, 0, h, stone) + courseRight(1.42, v0, v1, 0, h, 7);
  [-1.0, -0.05, 0.9].forEach(u => { arcade += archLeft(u, 0.32, v1, 0, 42, '#BFD8A8', ` stroke="${OUT}" stroke-width="0.8"`); });
  arcade += courseLeft(-1.45, 1.42, v1, 44, h, 2) + box(-1.45, v0 - 0.02, 1.42, v1 + 0.02, h, h + 4, stone)
    + face([[-1.4, v0 + 0.04, h + 4.2], [1.38, v0 + 0.04, h + 4.2], [1.38, v1 - 0.04, h + 4.2], [-1.4, v1 - 0.04, h + 4.2]], WATER);
  return big(
    bigShadow(86, 40)
    + arcade
    // Descente d'eau : chéneau du haut de l'arcade jusqu'au bassin
    + box(0.3, v1, 0.42, -0.62, h - 2, h + 2, stone) + face([[0.32, v1, h + 2.2], [0.4, v1, h + 2.2], [0.4, -0.62, h + 2.2], [0.32, -0.62, h + 2.2]], WATER)
    + (k ? k.back : '')
    + basin(0.95, 11, stone, white)
    + cylinder(0.36, -0.62, 11, h, 0.06, stone, 'aq-pile')
    + (k ? k.front : '')
  );
}
// Chute d'eau du chéneau dans le bassin (4 images)
const fall = f => sprite((() => {
  const [x, y] = P(0.36, -0.62, 58);
  const [, by] = P(0.36, -0.62, 11);
  let out = `<path d="M${f2(x - 3)},${f2(y)} Q${f2(x - 4)},${f2((y + by) / 2)} ${f2(x - 2)},${f2(by)} L${f2(x + 2)},${f2(by)} Q${f2(x + 3.4)},${f2((y + by) / 2)} ${f2(x + 3)},${f2(y)} Z" fill="rgba(190,230,250,.85)"/>`;
  for (let k = 0; k < 4; k++) {
    const t = ((f / 4) + k / 4) % 1;
    out += ln([x - 1.5 + (k % 2) * 3, y + (by - y) * t], [x - 1.5 + (k % 2) * 3, y + (by - y) * t + 5], '#FFFFFF', 0.8);
  }
  return out + ell(x, by + 1, 6 + f, 2 + f * 0.4, 'none', ' stroke="rgba(255,255,255,.75)" stroke-width="0.8"');
})(), { x: -20, y: -120, w: 60, h: 110 });

/* ---------- Palier VI : Moulin à eau ---------- */
const WHEEL = { u: 0.32, v: -0.78, z: 24, r: 0.5 };
function watermill(skin) {
  const stone = stoneOf(skin);
  const roof = roofOf(skin, ROOF_RED);
  const u0 = -1.35, u1 = 0.18, v0 = -1.35, v1 = -0.25;
  return big(
    bigShadow(86, 40)
    // Bief de pierre qui amène l'eau en haut de la roue
    + box(0.24, -1.45, 0.62, -1.15, 0, 50, stone) + face([[0.28, -1.45, 50.2], [0.58, -1.45, 50.2], [0.58, -1.15, 50.2], [0.28, -1.15, 50.2]], WATER)
    // Moulin : soubassement de pierre, étage à colombages, toit, cheminée
    + box(u0, v0, u1, v1, 0, 28, stone) + courseLeft(u0, u1, v1, 0, 28, 4) + courseRight(u1, v0, v1, 0, 28, 4)
    + box(u0, v0, u1, v1, 28, 50, PLASTER) + timberLeft(u0, u1, v1, 28, 50)
    + archLeft(-0.6, 0.16, v1, 0, 20, '#4A2E1A', ` stroke="${OUT}" stroke-width="0.7"`)
    + [-1.15, -0.2].map(u => face([[u, v1, 34], [u + 0.18, v1, 34], [u + 0.18, v1, 44], [u, v1, 44]], '#FFE6A3', ' stroke="#FFFFFF" stroke-width="0.8"')).join('')
    + chimney(-1.05, -1.05, 52, 82)
    + gable(u0, v0, u1, v1, 50, 26, { front: roof.front, back: roof.back, gable: PLASTER.right }, 0.1)
    + roofTexture(skin, u0, v0, u1, v1, 50, 26, 0.1)
    // Canal de fuite et mare devant
    + face([[0.22, -0.55, 0.3], [0.62, -0.55, 0.3], [0.62, 0.2, 0.3], [0.22, 0.2, 0.3]], WATER)
    + basin(0.7, 8, stone, skin === 'pierre-blanche')
  );
}
// Roue à aubes qui tourne (8 images), dans le plan (v, z) sur le flanc droit du moulin
const millWheel = f => sprite((() => {
  const { u, v, z, r } = WHEEL;
  const pt = (a, rr) => P(u, v + rr * Math.cos(a), z + 32 * rr * Math.sin(a));
  const turn = (f / 8) * (Math.PI / 4);
  let out = '';
  const rim = Array.from({ length: 24 }, (_, k) => pt((k / 24) * Math.PI * 2, r));
  out += `<polygon points="${rim.map(p => p.map(f2).join(',')).join(' ')}" fill="none" stroke="${WOOD_DARK.right}" stroke-width="2.4"/>`;
  const rim2 = Array.from({ length: 24 }, (_, k) => pt((k / 24) * Math.PI * 2, r * 0.82));
  out += `<polygon points="${rim2.map(p => p.map(f2).join(',')).join(' ')}" fill="none" stroke="${WOOD_DARK.left}" stroke-width="1.2"/>`;
  for (let k = 0; k < 8; k++) {
    const a = turn + (k / 8) * Math.PI * 2;
    out += ln(pt(a, 0), pt(a, r * 0.82), WOOD_DARK.left, 1.2);
    const [p0, p1] = [pt(a, r * 0.82), pt(a, r * 1.08)];
    out += ln(p0, p1, WOOD.top, 3);
  }
  const [cx, cy] = P(u, v, z);
  return out + dot(cx, cy, 2.4, '#3D3A36') + `<path d="M${f2(pt(1.9, r)[0])},${f2(pt(1.9, r)[1])} q2,6 0,12" stroke="rgba(190,230,250,.85)" stroke-width="2.4" fill="none"/>`;
})(), { x: -20, y: -90, w: 80, h: 90 });

/* ---------- Palier VII : Fontaine de jouvence ---------- */
function youth(skin) {
  const k = KIOSK.includes(skin) ? kiosk(skin, 1.4, 86, 30) : null;
  const [sx, sy] = P(0, 0, 40);
  return big(
    bigShadow(84, 40)
    + flowerBed(-1.15, -1.05, 0.22) + flowerBed(1.1, -1.05, 0.2, ['#FFD45E', '#FFFFFF', '#A98ADB']) + flowerBed(-1.2, 0.3, 0.16, ['#F7A8C8', '#FFFFFF'])
    + (k ? k.back : '')
    + cylinder(0, 0, 0, 12, 1.02, MARBLE, 'yj-basin') + stoneCourses(0, 0, 0, 12, 1.02, 1, 'rgba(150,140,170,.35)')
    + `<path d="M${f2(-46.2)},${f2(P(0, 0, 12)[1])} A46.2,23.1 0 0 0 46.2,${f2(P(0, 0, 12)[1])}" fill="none" stroke="${GOLD.left}" stroke-width="2"/>`
    + disc(0, 0, 12, 0.88, '#5FD3D0') + disc(-0.2, -0.2, 12, 0.4, '#A8F0EA', ' opacity=".8"')
    // Socle, statue ailée qui verse l'eau d'une urne
    + cylinder(0, 0, 12, 30, 0.16, MARBLE, 'yj-ped') + cylinder(0, 0, 30, 33, 0.22, MARBLE, 'yj-ped2')
    + `<path d="M${f2(sx - 4)},${f2(sy + 7)} L${f2(sx - 3)},${f2(sy - 12)} Q${f2(sx)},${f2(sy - 16)} ${f2(sx + 3)},${f2(sy - 12)} L${f2(sx + 4)},${f2(sy + 7)} Z" fill="${MARBLE.left}" stroke="${MARBLE.right}" stroke-width="0.6"/>`
    + dot(sx, sy - 19, 3.4, MARBLE.top) + `<path d="M${f2(sx - 3)},${f2(sy - 21)} q3,-3 6,0" stroke="${GOLD.left}" stroke-width="1" fill="none"/>`
    + `<path d="M${f2(sx - 3)},${f2(sy - 10)} Q${f2(sx - 16)},${f2(sy - 26)} ${f2(sx - 14)},${f2(sy - 6)} Q${f2(sx - 9)},${f2(sy - 10)} ${f2(sx - 3)},${f2(sy - 4)} Z" fill="#FFFFFF" stroke="${MARBLE.right}" stroke-width="0.6"/>`
    + `<path d="M${f2(sx + 3)},${f2(sy - 10)} Q${f2(sx + 16)},${f2(sy - 26)} ${f2(sx + 14)},${f2(sy - 6)} Q${f2(sx + 9)},${f2(sy - 10)} ${f2(sx + 3)},${f2(sy - 4)} Z" fill="#F4F0FA" stroke="${MARBLE.right}" stroke-width="0.6"/>`
    + `<ellipse cx="${f2(sx + 6)}" cy="${f2(sy - 8)}" rx="3.2" ry="2.4" fill="${GOLD.left}" transform="rotate(30 ${f2(sx + 6)} ${f2(sy - 8)})"/>`
    + (k ? k.front : '')
  );
}
// Eau versée par l'urne, arc-en-ciel et étincelles (6 images)
const youthMagic = f => sprite((() => {
  const [sx, sy] = P(0, 0, 40);
  const [, wy] = P(0, 0, 12);
  let out = `<path d="M${f2(sx + 8)},${f2(sy - 7)} Q${f2(sx + 18)},${f2(sy)} ${f2(sx + 16)},${f2(wy)}" stroke="rgba(170,240,234,.9)" stroke-width="2.4" fill="none"/>`;
  out += ell(sx + 16, wy + 1, 5 + (f % 3), 2 + (f % 3) * 0.4, 'none', ' stroke="rgba(255,255,255,.8)" stroke-width="0.8"');
  ['#E2574C', '#F2994A', '#F2C04B', '#6DB04F', '#5C83C2', '#A98ADB'].forEach((c, k) => {
    out += `<path d="M${f2(-62 + k * 2)},${f2(wy - 4)} A${f2(62 - k * 2)},${f2(56 - k * 2)} 0 0 1 ${f2(62 - k * 2)},${f2(wy - 4)}" fill="none" stroke="${c}" stroke-width="2" opacity="${f2(0.18 + 0.06 * Math.sin(f + k))}"/>`;
  });
  for (let k = 0; k < 8; k++) {
    const t = ((f / 6) + k / 8) % 1;
    out += dot(Math.cos(k * 2.3) * 38 * (0.4 + t * 0.6), wy - 6 - t * 50, 1.4 * (1 - t) + 0.3, k % 2 ? '#FFF2B0' : '#FFFFFF');
  }
  return out;
})(), { x: -70, y: -140, w: 140, h: 130 });

export const PUITS_TIERS = [
  { make: washhouse, anims: [{ key: 'laundry', n: 4, fps: 3, frame: laundry }] },
  { make: bigBasin, anims: [{ key: 'jets', n: 4, fps: 6, frame: basinJets, skip: skin => KIOSK.includes(skin) }] },
  { make: aqueduct, anims: [{ key: 'fall', n: 4, fps: 8, frame: fall }] },
  { make: watermill, anims: [{ key: 'wheel', n: 8, fps: 8, frame: millWheel }], smoke: [[-1.05, -1.05, 84]], lights: [[-1.06, -0.25, 39, 14], [-0.11, -0.25, 39, 14]] },
  { make: youth, anims: [{ key: 'magic', n: 6, fps: 6, frame: youthMagic }], lights: [[0, 0, 14, 40], [0, 0, 40, 18]] }
];
