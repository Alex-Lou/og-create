// Puits, paliers III à VII : Lavoir, Bassin, Aqueduc, Moulin à eau, Fontaine de jouvence.
// Places laissées libres pour la boutique : seau devant, potence à poulie sur le flanc droit au bord de l'eau,
// abreuvoir et chèvre à l'avant gauche, pompe au coin droit (× 1.5 dès le palier IV).
import { ROOF_RED, WHITE_STONE, BUILDING_BOX, roofOf, roofTextureOf, stoneCourses, stoneRing, pool } from '../palette.js';
import { sprite, HIVER, NEIGE, mixHex } from '../iso.js';
import { INK, TRAIT, DETAIL, trait, bloc, poteau, degrade, poly as polyC, riveGable, pierreRonde, bassinRond, spriteChibi } from '../chibi.js';
import { kioskRoof } from '../buildings2.js';
import {
  big, BIG_BOX, bigShadow, P, box, face, gable, cylinder, disc, f2, ln, dot, ell, OUT, STONE, WOOD, WOOD_DARK, GOLD,
  PLASTER, timberLeft, courseLeft, courseRight, archLeft, flowerBed, chimney
} from './kit.js';

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
  if (thatch) for (let a = 0.12; a < Math.PI - 0.1; a += 0.08) tex += ln([rx * Math.cos(a) * 0.18, apex + (cy + ry * Math.sin(a) - apex) * 0.18],
    [rx * Math.cos(a) * 0.97, apex + (cy + ry * Math.sin(a) - apex) * 0.97], 'rgba(140,95,35,.45)', 0.6);
  else [0.4, 0.6, 0.8].forEach(k => {
    tex += `<path d="M${f2(-rx * k)},${f2(apex + h * k)} A${f2(rx * k)},${f2(ry * k)} 0 0 0 ${f2(rx * k)},${f2(apex + h * k)}" fill="none" stroke="rgba(20,40,70,.4)" stroke-width="0.8"/>`;
  });
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
  return stoneRing(0, 0, 0, h, r, stone, `bs-${Math.round(r * 100)}`)
    + pool(0, 0, h, r * 0.86, WATER);
}

// Palier III : Lavoir. Abri ouvert sur quatre poteaux, gros toit de tuiles (ou celui du skin) à rive épaisse, bassin de
// pierre claire, eau qui brille (glace l'hiver), pierres à laver, panier de linge et baquet ; la corde à linge devant à
// gauche, hors du toit (le linge est animé à part et se dessine par-dessus). Places de la boutique gardées libres. Même
// crête qu'avant.
function washhouse(skin) {
  const blanche = skin === 'pierre-blanche';
  const pierre = blanche ? { top: '#FFFFFF', left: '#F1ECE2', right: '#CFC7B8' } : { top: '#ECE5D6', left: '#CDC2AA', right: '#A39780' };
  const roof = roofOf(skin, ROOF_RED);
  const u0 = -0.62, u1 = 0.52, v0 = -0.47, v1 = 0.37;
  const bord = ` stroke="${INK}" stroke-width="${TRAIT}" stroke-linejoin="round"`;
  const BOISP = { top: '#B07A48', left: '#9A6236', right: '#764522' };
  let out = disc(0, 0, 0, 1.0, 'rgba(120,85,45,.18)');
  // Corde à linge : deux piquets, la corde (le linge est animé à part)
  out += poteau(-1.0, 0.2, 0, 24, 0.035, BOISP, 'lvp1') + poteau(-1.0, 0.78, 0, 24, 0.035, BOISP, 'lvp2')
    + `<path d="M${f2(P(-1.0, 0.2, 23)[0])},${f2(P(-1.0, 0.2, 23)[1])} Q${f2(P(-1.0, 0.49, 21)[0])},${f2(P(-1.0, 0.49, 21)[1])} ${f2(P(-1.0, 0.78, 23)[0])},${f2(P(-1.0, 0.78, 23)[1])}" fill="none" stroke="#C9A16A" stroke-width="0.9"/>`;
  // Poteaux du fond
  out += poteau(u0, v0, 0, 32, 0.045, BOISP, 'lvq1') + poteau(u1, v0, 0, 32, 0.045, BOISP, 'lvq2');
  // Bassin de pierre, eau, reflets
  out += bloc(-0.55, -0.4, 0.45, 0.3, 0, 8, pierre, 'lvbas')
    + degrade('lveau', HIVER ? '#E4F2FA' : '#5AAED7', HIVER ? '#B9D7EA' : '#2F6E99', true)
    + polyC([[-0.49, -0.34, 8], [0.39, -0.34, 8], [0.39, 0.24, 8], [-0.49, 0.24, 8]], 'url(#lveau)', DETAIL)
    + trait(P(-0.3, -0.12, 8), P(0.05, -0.12, 8), 1.4, 'rgba(255,255,255,.7)') + trait(P(-0.1, 0.06, 8), P(0.22, 0.06, 8), 1.1, 'rgba(255,255,255,.55)');
  [0.24, 0.3].forEach(k => { out += trait(P(-0.55 + k, 0.3, 0.5), P(-0.55 + k, 0.3, 7.5), 0.9, 'rgba(70,55,35,.4)'); });
  // Pierres à laver inclinées sur le bord avant
  [-0.4, -0.12, 0.16].forEach(u => { out += polyC([[u, 0.24, 8], [u + 0.2, 0.24, 8], [u + 0.2, 0.33, 11.5], [u, 0.33, 11.5]], pierre.top, DETAIL); });
  // Poteaux de devant, sablière, toit
  out += poteau(u0, v1, 0, 32, 0.045, BOISP, 'lvq3') + poteau(u1, v1, 0, 32, 0.045, BOISP, 'lvq4')
    + bloc(u0 - 0.04, v0 - 0.04, u1 + 0.04, v1 + 0.04, 30, 33, { top: '#C98448', left: '#B47442', right: '#8E5A30' }, 'lvsab');
  const [z, hr, o] = [33, 15, 0.1];
  out += gable(u0, v0, u1, v1, z, hr, { front: roof.front, back: roof.back, gable: '#8B5631' }, o, bord)
    + roofTextureOf(skin, 'toit-rouge', u0, v0, u1, v1, z, hr, o)
    + riveGable(u0, v0, u1, v1, z, hr, o, mixHex(roof.back, '#3C2819', 0.15));
  const vm = (v0 + v1) / 2, r0 = P(u0 - o, vm, z + hr), r1 = P(u1 + o, vm, z + hr);
  out += trait(r0, r1, 7, INK) + trait(r0, r1, 3.6, HIVER ? NEIGE.light : mixHex(roof.back, '#3C2819', 0.25));
  // Panier de linge et baquet, à droite du bassin
  const [bx, by] = P(0.62, 0.42, 0);
  out += `<path d="M${f2(bx - 6)},${f2(by - 6)} L${f2(bx - 5)},${f2(by)} Q${f2(bx)},${f2(by + 2)} ${f2(bx + 5)},${f2(by)} L${f2(bx + 6)},${f2(by - 6)} Z" fill="#D9A262"${bord}/>`
    + `<ellipse cx="${f2(bx)}" cy="${f2(by - 6)}" rx="6" ry="2.2" fill="#FFFFFF" stroke="${INK}" stroke-width="${DETAIL}"/><circle cx="${f2(bx + 2)}" cy="${f2(by - 7)}" r="2" fill="#9FC7E8" stroke="${INK}" stroke-width="0.6"/>`
    + trait([bx - 5.4, by - 3], [bx + 5.4, by - 3], 0.9, 'rgba(90,50,20,.5)');
  out += poteau(0.66, 0.08, 0, 7, 0.09, { top: '#7FB3D6', left: '#C98448', right: '#9E5F30' }, 'lvbaq');
  return spriteChibi(out, BUILDING_BOX);
}
// Linge qui bat au vent : 8 images en boucle, trois pièces (chemise, torchon, robe) qui ondulent en décalé
const laundry = f => spriteChibi((() => {
  const N = 8, ph = (f / N) * Math.PI * 2;
  return [[0.32, '#FFFFFF', 8, 0], [0.49, '#9FC7E8', 6.5, 1.3], [0.66, '#F7A8C8', 9, 2.6]].map(([dv, c, h, d]) => {
    const a = P(-1.0, dv - 0.07, 22), b = P(-1.0, dv + 0.07, 22);
    const sw = Math.sin(ph + d) * 1.6, lift = Math.cos(ph + d) * 0.8;
    return `<path d="M${f2(a[0])},${f2(a[1])} L${f2(b[0])},${f2(b[1])} Q${f2(b[0] + sw * 0.6)},${f2(b[1] + h * 0.55)} ${f2(b[0] + sw)},${f2(b[1] + h + lift)} Q${f2((a[0] + b[0]) / 2 + sw)},${f2((a[1] + b[1]) / 2 + h + 2 + lift)} ${f2(a[0] + sw)},${f2(a[1] + h - lift)} Q${f2(a[0] + sw * 0.6)},${f2(a[1] + h * 0.55)} ${f2(a[0])},${f2(a[1])} Z" fill="${c}" stroke="${INK}" stroke-width="${DETAIL}" stroke-linejoin="round"/>`
      + [a, b].map(([x, y]) =>
        `<rect x="${f2(x - 0.6)}" y="${f2(y - 1.6)}" width="1.2" height="2.6" rx="0.4" fill="#C98448" stroke="${INK}" stroke-width="0.5"/>`).join('');
  }).join('');
})(), { x: -66, y: -46, w: 40, h: 36 });

// Palier IV : Bassin. Dans la suite de la Fontaine (palier II) : grand bassin rond, pavage de galets, fontaine à deux
// vasques sur colonnes à bague, rideaux d'eau (gelés l'hiver), fleurs ; même jet en z 60 (crête des pièces rares),
// même kiosque agrandi pour ses skins, places de la boutique laissées libres.
const PIERRE = { top: '#ECE5D6', left: '#CDC2AA', right: '#A39780' };
const PIERRE_BLANCHE = { top: '#FFFFFF', left: '#F1ECE2', right: '#CFC7B8' };
const PAVE = { top: '#EFE9DC', left: '#D7CDB8', right: '#B3A68D' };
// Rideau d'eau qui retombe d'une vasque (centre, rayon r, bord z0) jusqu'à la hauteur z1
function rideau(r, z0, z1) {
  if (HIVER) return '';
  return [-0.7, -0.25, 0.25, 0.7].map(k => {
    const [x0, y0] = P(0, 0, z0);
    const dx = k * r * 45.25, dy = Math.sqrt(1 - k * k) * r * 22.63;
    return `<path d="M${f2(x0 + dx)},${f2(y0 + dy)} q${f2(dx * 0.15)},6 ${f2(dx * 0.25)},${f2(z0 - z1 - dy * 0.4)}" stroke="#7FC4E8" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".85"/>`
      + `<path d="M${f2(x0 + dx - 0.6)},${f2(y0 + dy + 1)} q${f2(dx * 0.1)},4 ${f2(dx * 0.15)},8" stroke="#E6F6FF" stroke-width="0.9" fill="none" stroke-linecap="round"/>`;
  }).join('');
}
const fleursPied = (u, v) => {
  const [x, y] = P(u, v, 0);
  return `<path d="M${f2(x - 7)},${f2(y)} q1.4,-7 7,-8 q5.6,1 7,8 Z" fill="#6DB04F" stroke="${INK}" stroke-width="1"/>`
    + (HIVER ? '' : [[-3.4, -7, '#F7A8C8'], [2.8, -8.4, '#FFD45E'], [0, -5, '#FFFFFF'], [-0.6, -10, '#A98ADB']]
      .map(([dx, dy, c]) => `<circle cx="${f2(x + dx)}" cy="${f2(y + dy)}" r="2" fill="${c}" stroke="${INK}" stroke-width="0.6"/>`).join(''));
};
function bigBasin(skin) {
  const pierre = skin === 'pierre-blanche' ? PIERRE_BLANCHE : PIERRE;
  const kiosque = KIOSK.includes(skin);
  const rk = 1.4 * 0.9;
  const poteauK = (u, v) => poteau(u, v, 0, 72, 0.055, { top: '#B07A48', left: '#9A6236', right: '#764522' },
    `bk${u > 0 ? 'a' : u < 0 ? 'b' : v > 0 ? 'c' : 'd'}`);
  const galets = devant => {
    let o = '';
    for (let i = 0; i < 22; i++) {
      const t = (i / 22) * Math.PI * 2 + 0.15, u = Math.cos(t) * 1.16, v = Math.sin(t) * 1.16;
      if ((u + v > 0) === devant) o += pierreRonde(u, v, 4.6 + (i % 3) * 0.8, PAVE);
    }
    return o;
  };
  let out = disc(0, 0.02, 0, 1.4, 'rgba(120,85,45,.18)') + galets(false) + fleursPied(-1.15, -1.1)
    + (kiosque ? poteauK(-rk, 0) + poteauK(0, -rk) : '');
  // Grand bassin, colonne à bague, première vasque, son rideau d'eau
  out += bassinRond(0, 0, 0, 11, 1.0, pierre, 'bb4-bassin')
    + poteau(0, 0, 10, 31, 0.1, pierre, 'bb4-col') + bassinRond(0, 0, 18, 21, 0.13, pierre, 'bb4-bague', false)
    + bassinRond(0, 0, 30, 35, 0.42, pierre, 'bb4-v1') + rideau(0.42, 34, 12);
  // Seconde vasque, son rideau, la pointe d'où part le jet
  out += poteau(0, 0, 35, 49, 0.06, pierre, 'bb4-col2') + bassinRond(0, 0, 48, 52, 0.22, pierre, 'bb4-v2') + rideau(0.22, 51, 36)
    + poteau(0, 0, 52, 58, 0.035, pierre, 'bb4-tip');
  const [tx, ty] = P(0, 0, 60);
  out += `<circle cx="${f2(tx)}" cy="${f2(ty + 0.6)}" r="2.8" fill="${pierre.top}" stroke="${INK}" stroke-width="${DETAIL}"/>`;
  out += galets(true) + fleursPied(1.1, 1.1);
  if (kiosque) out += poteauK(rk, 0) + poteauK(0, rk) + kioskRoof(skin, 1.4, 72, 42);
  return spriteChibi(out, BIG_BOX);
}
// Jet d'eau qui monte de la pointe et gouttes qui retombent dans la seconde vasque (8 images, comme la Fontaine)
const JETS_N = 8;
const basinJets = f => spriteChibi((() => {
  const [x, y] = P(0, 0, 60);
  const ph = (f / JETS_N) * Math.PI * 2;
  const h = 11 + Math.sin(ph) * 2.4;
  let out = `<path d="M${f2(x - 2.4)},${f2(y)} Q${f2(x - 2.8)},${f2(y - h * 0.6)} ${f2(x)},${f2(y - h)} Q${f2(x + 2.8)},${f2(y - h * 0.6)} ${f2(x + 2.4)},${f2(y)} Z" fill="#DFF4FF" stroke="#5FA8D3" stroke-width="0.9" stroke-linejoin="round"/>`
    + `<path d="M${f2(x - 0.8)},${f2(y - 1)} Q${f2(x - 1.1)},${f2(y - h * 0.55)} ${f2(x)},${f2(y - h + 1.8)}" stroke="#FFFFFF" stroke-width="0.9" fill="none" stroke-linecap="round"/>`;
  for (let k = 0; k < 6; k++) {
    const t = (f / JETS_N + k / 6) % 1;
    const a = Math.PI / 6 + (k * Math.PI) / 3;
    const [px, py] = P(Math.cos(a) * 0.2 * t, Math.sin(a) * 0.2 * t, 60 + h * 0.7 + 8 * Math.sin(Math.PI * t) - (h * 0.7 + 14) * t);
    out += `<circle cx="${f2(px)}" cy="${f2(py)}" r="${f2(1.8 - t * 0.5)}" fill="#BFE6FA" stroke="#5FA8D3" stroke-width="0.6" opacity="${f2(1 - t * 0.35)}"/>`;
  }
  return out;
})(), { x: -40, y: -90, w: 80, h: 70 });

// Palier V : Aqueduc
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

// Palier VI : Moulin à eau
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
    + [-1.15, -0.2].map(u => face([[u, v1, 34], [u + 0.18, v1, 34], [u + 0.18, v1, 44], [u, v1, 44]], '#FFE6A3',
      ' stroke="#FFFFFF" stroke-width="0.8"')).join('')
    + chimney(-1.05, -1.05, 52, 82)
    + gable(u0, v0, u1, v1, 50, 26, { front: roof.front, back: roof.back, gable: PLASTER.right }, 0.1)
    + roofTextureOf(skin, 'toit-rouge', u0, v0, u1, v1, 50, 26, 0.1)
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
  return out + dot(cx, cy, 2.4, '#3D3A36')
    + `<path d="M${f2(pt(1.9, r)[0])},${f2(pt(1.9, r)[1])} q2,6 0,12" stroke="rgba(190,230,250,.85)" stroke-width="2.4" fill="none"/>`;
})(), { x: -20, y: -90, w: 80, h: 90 });

// Palier VII : Fontaine de jouvence
function youth(skin) {
  const k = KIOSK.includes(skin) ? kiosk(skin, 1.4, 86, 30) : null;
  const [sx, sy] = P(0, 0, 40);
  return big(
    bigShadow(84, 40)
    + flowerBed(-1.15, -1.05, 0.22) + flowerBed(1.1, -1.05, 0.2, ['#FFD45E', '#FFFFFF', '#A98ADB']) + flowerBed(-1.2, 0.3, 0.16, ['#F7A8C8', '#FFFFFF'])
    // Sous le skin « pierre blanche », un parvis de dalles blanches autour du bassin
    + (skin === 'pierre-blanche' ? cylinder(0, 0, 0, 4, 1.32, WHITE_STONE, 'yj-parvis') + stoneCourses(0, 0, 0, 4, 1.32, 1, 'rgba(150,140,170,.4)')
      + [0, 1, 2, 3, 4, 5, 6, 7].map(i => {
        const a = (i + 0.5) * Math.PI / 4;
        return ln(P(Math.cos(a) * 1.04, Math.sin(a) * 1.04, 4), P(Math.cos(a) * 1.3, Math.sin(a) * 1.3, 4), 'rgba(150,140,170,.45)', 0.7);
      }).join('') : '')
    + (k ? k.back : '')
    + cylinder(0, 0, 0, 12, 1.02, MARBLE, 'yj-basin') + stoneCourses(0, 0, 0, 12, 1.02, 1, 'rgba(150,140,170,.35)')
    + `<path d="M${f2(-46.2)},${f2(P(0, 0, 12)[1])} A46.2,23.1 0 0 0 46.2,${f2(P(0, 0, 12)[1])}" fill="none" stroke="${GOLD.left}" stroke-width="2"/>`
    + pool(0, 0, 12, 0.88, '#5FD3D0', '#A8F0EA')
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
  { make: washhouse, anims: [{ key: 'laundry', n: 8, fps: 6, frame: laundry }] },
  { make: bigBasin, anims: [{ key: 'jets', n: JETS_N, fps: 10, frame: basinJets, skip: skin => KIOSK.includes(skin) }] },
  { make: aqueduct, anims: [{ key: 'fall', n: 4, fps: 8, frame: fall }] },
  {
    make: watermill,
    anims: [{ key: 'wheel', n: 8, fps: 8, frame: millWheel, tint: true }],
    smoke: [[-1.05, -1.05, 84]],
    lights: [[-1.06, -0.25, 39, 14], [-0.11, -0.25, 39, 14]]
  },
  { make: youth, anims: [{ key: 'magic', n: 6, fps: 6, frame: youthMagic }], lights: [[0, 0, 14, 40], [0, 0, 40, 18]] }
];
