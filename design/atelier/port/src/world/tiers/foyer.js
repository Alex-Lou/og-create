// Foyer, paliers IV à VII (3 × 3 cases) : Maison de l'alchimiste, Tour d'étude, Grande tour, Phare de Brume.
// La maison de l'alchimiste reste d'un palier à l'autre (rapetissée quand la tour grandit) ; sa cheminée de cuivre
// lâche des vapeurs colorées. Places laissées libres pour la boutique (repère 3 × 3) : four à l'avant gauche, chien et
// chat devant la porte, hamac sur le flanc droit (u ≈ 1.35).
import { roofOf, roofTexture } from '../palette.js';
import { dome } from '../buildings2.js';
import { WISP } from '../brume.js';
import { sprite } from '../iso.js';
import {
  big, P, box, face, gable, cylinder, f2, ln, dot, ell, OUT, PLASTER, DARK_STONE, STONE, WOOD_DARK, BRICK, GOLD, IRON,
  dormer, shuttered, windowR, timberLeft, timberRight, courseLeft, courseRight, flowerBed, pavedPath, lampPost, tower, bigShadow
} from './kit.js';

const VIOLET = { front: '#9A88CF', back: '#6F5DA6' };
const COPPER = { top: '#F4B07A', left: '#D9844E', right: '#A85C31' };
const MAGIC_GLASS = '#E3D8FA';
// Couleurs d'un toit en volume (cône, dôme) à partir de ses deux pans
const volumeOf = roof => ({ light: roof.front, dark: roof.back, top: roof.front, left: roof.front, right: roof.back });

// Plate-bande d'herbes de l'alchimiste : caisse de bois, terre, touffes vertes, lavande et fleurs
function herbGarden(u0, v0, u1, v1) {
  let tufts = '';
  for (let u = u0 + 0.07; u < u1 - 0.03; u += 0.11) {
    for (let v = v0 + 0.07; v < v1 - 0.03; v += 0.12) {
      const [x, y] = P(u, v, 5);
      const k = Math.round((u * 7 + v * 13) * 10);
      const tint = ['#6DB04F', '#8FCB6B', '#9C82DE', '#5E9446'][((k % 4) + 4) % 4];
      tufts += dot(x, y - 1, 2.6, tint) + dot(x - 1, y - 2.6, 1.2, k % 3 ? '#C6E8A4' : '#F7A8C8');
    }
  }
  return box(u0, v0, u1, v1, 0, 4, WOOD_DARK) + face([[u0 + 0.03, v0 + 0.03, 4], [u1 - 0.03, v0 + 0.03, 4], [u1 - 0.03, v1 - 0.03, 4], [u0 + 0.03, v1 - 0.03, 4]], '#7A5236') + tufts;
}

// Enseigne de l'alchimiste : potence de fer au mur avant (face gauche, v = vf), panneau à la fiole verte
function flaskSign(u, vf, z) {
  const [x, y] = P(u, vf + 0.16, z);
  return ln(P(u, vf, z + 2), [x, y + 2], IRON.right, 1.2)
    + `<rect x="${f2(x - 5.5)}" y="${f2(y + 3)}" width="11" height="9" rx="1.5" fill="#F3E4C4" stroke="#7A4E2C" stroke-width="1"/>`
    + `<path d="M${f2(x - 1)},${f2(y + 5)} v1.6 l-2.6,3.4 h7.2 l-2.6,-3.4 v-1.6 Z" fill="#7BD88F" stroke="#3E6B2E" stroke-width="0.5"/>`;
}

// Maison de l'alchimiste dans le rectangle [u0, u1] × [v0, v1] : rez-de-chaussée de pierre, étage à colombages, toit
// (violet d'origine, ou celui du skin), lucarnes, porte violette, enseigne, cheminée de cuivre (en chimneyOf)
const chimneyOf = ({ u1, v0 }) => [u1 - 0.32, v0 + 0.24];
// Au-delà de cette largeur (cases), la maison a une seconde fenêtre au rez-de-chaussée et une seconde lucarne
const WIDE = 1.1;
function alchemistHouse(skin, rect) {
  const { u0, u1, v0, v1 } = rect;
  const roof = roofOf(skin, VIOLET);
  const vm = (v0 + v1) / 2;
  const [cu, cv] = chimneyOf(rect);
  const door = (u0 + u1) / 2 + 0.06;
  const wide = u1 - u0 > WIDE;
  return box(u0 - 0.04, v0 - 0.04, u1 + 0.04, v1 + 0.04, 0, 4, DARK_STONE)
    + box(u0, v0, u1, v1, 4, 22, STONE) + courseLeft(u0, u1, v1, 4, 22, 4) + courseRight(u1, v0, v1, 4, 22, 4)
    + box(u0, v0, u1, v1, 22, 42, PLASTER) + timberLeft(u0, u1, v1, 22, 42) + timberRight(u1, v0, v1, 22, 42)
    + face([[door - 0.12, v1, 4], [door + 0.12, v1, 4], [door + 0.12, v1, 20], [door - 0.12, v1, 20]], '#6A3F6E', ` stroke="${OUT}" stroke-width="0.7"`)
    + dot(...P(door + 0.08, v1, 12), 1.1, GOLD.left)
    + shuttered(u0 + 0.12, u0 + 0.3, v1, 9, 17, '#6F5DA6', MAGIC_GLASS)
    + (wide ? shuttered(u1 - 0.32, u1 - 0.14, v1, 9, 17, '#6F5DA6', MAGIC_GLASS) : '')
    + shuttered(u0 + 0.14, u0 + 0.32, v1, 28, 37, '#6F5DA6', MAGIC_GLASS) + shuttered(u1 - 0.34, u1 - 0.16, v1, 28, 37, '#6F5DA6', MAGIC_GLASS)
    + windowR(u1, v0 + 0.2, v0 + 0.4, 28, 37, MAGIC_GLASS) + windowR(u1, v0 + 0.2, v0 + 0.4, 9, 17, MAGIC_GLASS)
    + flaskSign(u0 + 0.42, v1, 30)
    // Cheminée de cuivre derrière le faîtage (le toit en cache le bas)
    + cylinder(cu, cv, 42, 92, 0.07, COPPER, `ah-ch-${f2(u0)}`) + cylinder(cu, cv, 92, 96, 0.1, COPPER, `ah-cap-${f2(u0)}`)
    + gable(u0, v0, u1, v1, 42, 28, { front: roof.front, back: roof.back, gable: PLASTER.right }, 0.12)
    + roofTexture(skin, u0, v0, u1, v1, 42, 28, 0.12)
    + dormer(u0 + 0.36, 0.11, vm, v1 + 0.12, 70, 42, 0.62, roof)
    + (wide ? dormer(u1 - 0.34, 0.11, vm, v1 + 0.12, 70, 42, 0.62, roof) : '');
}
// Vapeurs colorées qui montent de la cheminée de cuivre (4 images)
const vaporOf = rect => {
  const [cu, cv] = chimneyOf(rect);
  const [x, y] = P(cu, cv, 98);
  return f => sprite([0, 1, 2].map(k => {
    const t = ((f / 4) + k / 3) % 1;
    return dot(x + Math.sin((t + k) * 5) * 3 + t * 6, y - t * 26, 2.4 + t * 4, ['rgba(160,220,200,', 'rgba(190,160,240,', 'rgba(250,180,220,'][k] + f2(0.75 * (1 - t)) + ')');
  }).join(''), { x: x - 20, y: y - 44, w: 44, h: 50 });
};

// Laboratoire : four de briques, cuve de cuivre à dôme, col de cygne vers le serpentin, fiole
function laboratory(u, v) {
  const neckStart = P(u, v, 40);
  const neckEnd = P(u + 0.3, v + 0.42, 24);
  return box(u - 0.26, v - 0.26, u + 0.24, v + 0.22, 0, 16, BRICK)
    + face([[u - 0.14, v + 0.22, 2], [u + 0.1, v + 0.22, 2], [u + 0.1, v + 0.22, 10], [u - 0.14, v + 0.22, 10]], '#3A1E14')
    + face([[u - 0.1, v + 0.22, 3], [u + 0.06, v + 0.22, 3], [u + 0.06, v + 0.22, 7], [u - 0.1, v + 0.22, 7]], '#F28A3A')
    + cylinder(u, v, 16, 32, 0.19, COPPER, `lab-cuve-${f2(u)}`) + dome(u, v, 32, 0.19, COPPER, `lab-dome-${f2(u)}`)
    + `<path d="M${f2(neckStart[0])},${f2(neckStart[1])} C${f2(neckStart[0] + 10)},${f2(neckStart[1] - 8)} ${f2(neckEnd[0] - 3)},${f2(neckEnd[1] - 16)} ${f2(neckEnd[0])},${f2(neckEnd[1] - 3)}" stroke="${COPPER.right}" stroke-width="3" fill="none" stroke-linecap="round"/>`
    + cylinder(u + 0.3, v + 0.42, 0, 22, 0.11, { top: '#8FB3C4', left: '#6E95A8', right: '#4E7184' }, `lab-cool-${f2(u)}`)
    + [6, 12, 17].map(z => { const [x, y] = P(u + 0.3, v + 0.42, z); return `<path d="M${f2(x - 5.6)},${f2(y)} A5.6,2.8 0 0 0 ${f2(x + 5.6)},${f2(y)}" stroke="${COPPER.left}" stroke-width="1.3" fill="none"/>`; }).join('');
}

/* ---------- Palier IV : Maison de l'alchimiste ---------- */
const HOUSE_IV = { u0: -1.02, u1: 0.42, v0: -0.86, v1: 0.42 };
function alchemistHome(skin) {
  return big(
    bigShadow(80, 37)
    + pavedPath([0.0, 0.5], [0.0, 1.48], 0.26)
    + alchemistHouse(skin, HOUSE_IV)
    + laboratory(0.8, -0.16)
    + herbGarden(0.46, 0.5, 0.98, 0.86)
    + flowerBed(-0.66, 0.86, 0.15, ['#9C82DE', '#FFFFFF', '#F7A8C8'])
  );
}

/* ---------- Palier V : Tour d'étude ---------- */
// La maison, plus une tour ronde d'étude à l'arrière droit : hautes fenêtres, balcon, girouette en plume
const HOUSE_V = { u0: -1.05, u1: 0.22, v0: -0.72, v1: 0.42 };
// Fenêtre étroite sur l'avant d'une tour ronde (centre u, v ; rayon r), de z0 à z1
function towerWindow(u, v, r, z0, z1, glass = MAGIC_GLASS) {
  const [x, y0] = P(u + r * 0.7, v + r * 0.7, z0);
  const h = z1 - z0;
  return `<path d="M${f2(x - 3)},${f2(y0)} v${f2(-h + 3)} a3,3 0 0 1 6,0 v${f2(h - 3)} Z" fill="${glass}" stroke="#FFFFFF" stroke-width="0.9"/>`;
}
// Plume dorée au sommet d'un toit conique (x, y : la pointe)
const quill = (x, y) => ln([x, y], [x, y - 8], '#7A5A3A', 1.4)
  + `<path d="M${f2(x)},${f2(y - 8)} q8,-6 10,-16 q-8,3 -10,16 Z" fill="#F7E7B5" stroke="#B8902F" stroke-width="0.8"/>`;
// Balcon autour d'une tour ronde : la moitié avant de l'anneau (l'arrière est caché par la tour), garde-corps
function balcony(u, v, r, z) {
  const [x, y] = P(u, v, z);
  const rx = r * 45.25, ry = r * 22.63;
  return `<path d="M${f2(x - rx)},${f2(y)} A${f2(rx)},${f2(ry)} 0 0 0 ${f2(x + rx)},${f2(y)} L${f2(x + rx)},${f2(y + 3)} A${f2(rx)},${f2(ry)} 0 0 1 ${f2(x - rx)},${f2(y + 3)} Z" fill="${DARK_STONE.left}" stroke="${OUT}" stroke-width="0.6"/>`
    + `<path d="M${f2(x - rx)},${f2(y - 7)} A${f2(rx)},${f2(ry)} 0 0 0 ${f2(x + rx)},${f2(y - 7)}" fill="none" stroke="${IRON.right}" stroke-width="1"/>`
    + [-0.8, -0.4, 0, 0.4, 0.8].map(k => { const px = x + k * rx; const py = y + Math.sqrt(1 - k * k) * ry; return ln([px, py], [px, py - 7], IRON.right, 0.8); }).join('');
}
const STUDY = { u: 0.66, v: -0.62, r: 0.34, z: 92 };
function studyTower(skin) {
  const roof = roofOf(skin, VIOLET);
  const { u, v, r, z } = STUDY;
  const [tx, ty] = P(u, v, z);
  return big(
    bigShadow(84, 39)
    + pavedPath([-0.2, 0.5], [-0.2, 1.48], 0.26)
    + tower(u, v, r, 0, z, { stone: STONE, roof: volumeOf(roof), roofH: 40, id: 'st-tw' })
    + towerWindow(u, v, r, 24, 40) + towerWindow(u, v, r, 52, 70)
    + balcony(u, v, r + 0.08, 74)
    + quill(tx, ty - 47)
    + alchemistHouse(skin, HOUSE_V)
    + herbGarden(0.36, 0.42, 0.98, 0.82)
    + flowerBed(-0.72, 0.86, 0.15, ['#9C82DE', '#FFFFFF', '#F7A8C8'])
  );
}

/* ---------- Palier VI : Grande tour ---------- */
// Une haute tour coiffée d'une coupole d'observatoire (couleur du toit) et de sa lunette ; la maison à son pied
const HOUSE_VI = { u0: -1.08, u1: -0.02, v0: -0.4, v1: 0.5 };
const GREAT = { u: 0.42, v: -0.62, r: 0.46, z: 112 };
function greatTower(skin) {
  const roof = roofOf(skin, VIOLET);
  const { u, v, r, z } = GREAT;
  const [tx, ty] = P(u, v, z);
  return big(
    bigShadow(88, 41)
    + pavedPath([-0.48, 0.58], [-0.48, 1.48], 0.24)
    + box(u - 0.62, v - 0.62, u + 0.62, v + 0.62, 0, 6, DARK_STONE)
    + cylinder(u, v, 6, z, r, STONE, 'gt-wall')
    + [20, 46, 72].map(k => `<path d="M${f2(P(u, v, k)[0] - r * 45.25)},${f2(P(u, v, k)[1])} A${f2(r * 45.25)},${f2(r * 22.63)} 0 0 0 ${f2(P(u, v, k)[0] + r * 45.25)},${f2(P(u, v, k)[1])}" fill="none" stroke="rgba(90,80,65,.3)" stroke-width="0.8"/>`).join('')
    + face([[u + 0.22, v + 0.42, 6], [u + 0.42, v + 0.22, 6], [u + 0.42, v + 0.22, 24], [u + 0.22, v + 0.42, 24]], '#6A3F6E', ` stroke="${OUT}" stroke-width="0.7"`)
    + towerWindow(u, v, r, 34, 50) + towerWindow(u, v, r, 60, 78) + towerWindow(u, v, r, 88, 102)
    + cylinder(u, v, z, z + 3, r + 0.1, { top: '#B9B2A2', left: '#968E7C', right: '#736B5B' }, 'gt-gal')
    + dome(u, v, z + 3, r, { top: '#FFFFFF', left: roof.front, right: roof.back }, 'gt-dome')
    // Fente de la coupole et lunette dorée pointée vers le ciel
    + `<path d="M${f2(tx - 3)},${f2(ty - 5)} L${f2(tx - 2)},${f2(ty - 36)} L${f2(tx + 5)},${f2(ty - 36)} L${f2(tx + 5)},${f2(ty - 5)} Z" fill="#20304A"/>`
    + ln([tx, ty - 18], [tx + 28, ty - 44], '#E9C46A', 5.5) + ln([tx, ty - 18], [tx + 28, ty - 44], '#B8902F', 1.4)
    + `<circle cx="${f2(tx + 29)}" cy="${f2(ty - 45)}" r="3.4" fill="#20304A" stroke="#B8902F" stroke-width="1"/>`
    + alchemistHouse(skin, HOUSE_VI)
    + herbGarden(0.3, 0.42, 0.98, 0.82)
    + lampPost(-0.2, 0.75, 24)
  );
}

/* ---------- Palier VII : Phare de Brume ---------- */
// Haute tour blanche à bandes de brume, galerie de fer, lanterne vitrée où brûle la flamme de Brume, chapeau (couleur
// du toit) ; la brume s'enroule au pied ; la maison du gardien à côté. La nuit, un faisceau bleuté balaie l'île.
const LIGHT = { u: 0.42, v: -0.5, r0: 0.4, r1: 0.26, z: 132 };
const MIST_STONE = { top: '#FFFFFF', left: '#F4F7FA', right: '#C9D3DC' };
const HOUSE_VII = { u0: -1.08, u1: -0.04, v0: -0.42, v1: 0.48 };
function mistLighthouse(skin) {
  const roof = roofOf(skin, VIOLET);
  const { u, v, r0, r1, z } = LIGHT;
  const [bx, by] = P(u, v, 0);
  const [tx, ty] = P(u, v, z);
  const w0 = r0 * 45.25, w1 = r1 * 45.25;
  const band = (z0, z1) => {
    const k0 = z0 / z, k1 = z1 / z;
    const a = w0 + (w1 - w0) * k0, b = w0 + (w1 - w0) * k1;
    const [, y0] = P(u, v, z0);
    const [, y1] = P(u, v, z1);
    return `<path d="M${f2(bx - a)},${f2(y0)} A${f2(a)},${f2(a / 2)} 0 0 0 ${f2(bx + a)},${f2(y0)} L${f2(bx + b)},${f2(y1)} A${f2(b)},${f2(b / 2)} 0 0 1 ${f2(bx - b)},${f2(y1)} Z" fill="#9FC9E6" opacity=".85"/>`;
  };
  const mist = [[0.34, 0.3, 22, 7], [0.52, -0.12, 18, 6], [0.06, 0.5, 20, 6]].map(([du, dv, rx, ry]) => {
    const [x, y] = P(u + du, v + dv, 4);
    return ell(x, y, rx, ry, 'rgba(232,242,250,.55)') + ell(x - rx * 0.3, y - 2, rx * 0.5, ry * 0.6, 'rgba(255,255,255,.5)');
  }).join('');
  const glow = WISP.calm;
  return big(
    bigShadow(88, 41)
    + pavedPath([-0.52, 0.56], [-0.52, 1.48], 0.24)
    + box(u - 0.6, v - 0.6, u + 0.6, v + 0.6, 0, 6, DARK_STONE)
    + `<defs><linearGradient id="pb-g" x1="0" x2="1"><stop offset="0" stop-color="${MIST_STONE.top}"/><stop offset="1" stop-color="${MIST_STONE.right}"/></linearGradient></defs>`
    + `<path d="M${f2(bx - w0)},${f2(by - 6)} L${f2(tx - w1)},${f2(ty)} A${f2(w1)},${f2(w1 / 2)} 0 0 0 ${f2(tx + w1)},${f2(ty)} L${f2(bx + w0)},${f2(by - 6)} A${f2(w0)},${f2(w0 / 2)} 0 0 1 ${f2(bx - w0)},${f2(by - 6)} Z" fill="url(#pb-g)" stroke="${OUT}" stroke-width="0.8"/>`
    + band(30, 42) + band(78, 90)
    + face([[u + 0.2, v + 0.36, 6], [u + 0.36, v + 0.2, 6], [u + 0.36, v + 0.2, 24], [u + 0.2, v + 0.36, 24]], '#6A3F6E', ` stroke="${OUT}" stroke-width="0.7"`)
    + towerWindow(u, v, r0 * 0.82, 52, 66, '#CFE9F7') + towerWindow(u, v, r1 * 1.1, 100, 114, '#CFE9F7')
    // Galerie de fer, lanterne vitrée, flamme de Brume, chapeau et épi doré
    + cylinder(u, v, z, z + 3, r1 + 0.12, { top: '#55504A', left: '#4A4640', right: '#2C2925' }, 'pb-gal')
    + cylinder(u, v, z + 3, z + 22, r1 * 0.8, { top: glow.flame, left: '#E8F8FF', right: '#9FD8F0' }, 'pb-lamp')
    + `<path d="M${f2(tx)},${f2(ty - 6)} C${f2(tx + 6)},${f2(ty - 9)} ${f2(tx + 3)},${f2(ty - 18)} ${f2(tx)},${f2(ty - 23)} C${f2(tx - 3)},${f2(ty - 18)} ${f2(tx - 6)},${f2(ty - 9)} ${f2(tx)},${f2(ty - 6)} Z" fill="${glow.edge}"/>`
    + `<path d="M${f2(tx)},${f2(ty - 8)} C${f2(tx + 3)},${f2(ty - 10)} ${f2(tx + 2)},${f2(ty - 15)} ${f2(tx)},${f2(ty - 18)} C${f2(tx - 2)},${f2(ty - 15)} ${f2(tx - 3)},${f2(ty - 10)} ${f2(tx)},${f2(ty - 8)} Z" fill="${glow.core}"/>`
    + dot(tx - 1.6, ty - 12, 0.7, WISP.eye) + dot(tx + 1.6, ty - 12, 0.7, WISP.eye)
    + [-1, 0, 1].map(k => ln([tx + k * w1 * 0.5, ty - 3], [tx + k * w1 * 0.5, ty - 22], '#3D3A36', 0.7)).join('')
    + `<path d="M${f2(tx - w1 - 3)},${f2(ty - 22)} L${f2(tx)},${f2(ty - 40)} L${f2(tx + w1 + 3)},${f2(ty - 22)} Z" fill="${roof.front}" stroke="${OUT}" stroke-width="0.7"/>`
    + `<path d="M${f2(tx)},${f2(ty - 40)} L${f2(tx + w1 + 3)},${f2(ty - 22)} L${f2(tx + 4)},${f2(ty - 21)} Z" fill="${roof.back}"/>`
    + dot(tx, ty - 42, 1.8, GOLD.left)
    + mist
    + alchemistHouse(skin, HOUSE_VII)
    + herbGarden(0.3, 0.42, 0.98, 0.82)
    + lampPost(-0.24, 0.76, 24)
  );
}
// Faisceau du Phare qui tourne (8 images) : un cône de lumière bleutée qui balaie l'île depuis la lanterne
function beam(f) {
  const { u, v, z } = LIGHT;
  const [tx, ty] = P(u, v, z + 12);
  const a = (f / 8) * Math.PI * 2;
  const len = 84;
  const dx = Math.cos(a) * len;
  const dy = Math.sin(a) * len * 0.45;
  const spread = 12;
  return sprite(
    `<path d="M${f2(tx)},${f2(ty)} L${f2(tx + dx - Math.sin(a) * spread)},${f2(ty + dy + Math.cos(a) * spread * 0.45)} L${f2(tx + dx + Math.sin(a) * spread)},${f2(ty + dy - Math.cos(a) * spread * 0.45)} Z" fill="${WISP.calm.flame}" opacity="${f2(0.2 + 0.12 * Math.max(0, Math.cos(a - 0.8)))}"/>`,
    { x: tx - 100, y: ty - 50, w: 200, h: 100 }
  );
}

// Lumières de la maison (ses fenêtres), puis celles du palier
const lightsOf = (rect, extra) => [
  [rect.u0 + 0.21, rect.v1, 13, 14], [rect.u0 + 0.23, rect.v1, 32, 14], [rect.u1 - 0.25, rect.v1, 32, 14], [rect.u1, rect.v0 + 0.3, 32, 14],
  ...(rect.u1 - rect.u0 > WIDE ? [[rect.u1 - 0.23, rect.v1, 13, 14]] : []),
  ...extra
];
export const FOYER_TIERS = [
  {
    make: alchemistHome,
    lights: lightsOf(HOUSE_IV, [[0.78, 0.06, 6, 18]]),
    anims: [{ key: 'vapor', n: 4, fps: 3, frame: vaporOf(HOUSE_IV) }]
  },
  {
    make: studyTower,
    lights: lightsOf(HOUSE_V, [[STUDY.u + STUDY.r * 0.7, STUDY.v + STUDY.r * 0.7, 32, 14], [STUDY.u + STUDY.r * 0.7, STUDY.v + STUDY.r * 0.7, 61, 14]]),
    anims: [{ key: 'vapor', n: 4, fps: 3, frame: vaporOf(HOUSE_V) }]
  },
  {
    make: greatTower,
    lights: lightsOf(HOUSE_VI, [[GREAT.u + GREAT.r * 0.7, GREAT.v + GREAT.r * 0.7, 42, 14], [GREAT.u + GREAT.r * 0.7, GREAT.v + GREAT.r * 0.7, 95, 14], [-0.2, 0.75, 25, 16]]),
    anims: [{ key: 'vapor', n: 4, fps: 3, frame: vaporOf(HOUSE_VI) }]
  },
  {
    make: mistLighthouse,
    lights: lightsOf(HOUSE_VII, [[LIGHT.u, LIGHT.v, LIGHT.z + 12, 34], [-0.24, 0.76, 25, 16]]),
    anims: [{ key: 'beam', n: 8, fps: 4, frame: beam }, { key: 'vapor', n: 4, fps: 3, frame: vaporOf(HOUSE_VII) }]
  }
];
