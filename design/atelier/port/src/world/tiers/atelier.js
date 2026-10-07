// Atelier, paliers III à VII : Fonderie, Grande forge, Manufacture, Usine, Atelier de l'Alchimiste.
// Places laissées libres pour la boutique : établi au coin droit, enclume devant, soufflet contre la face avant du
// four (à droite) — × 1.5 dès le palier IV.
import { ROOF_RED, BUILDING_BOX, roofOf, roofTextureOf, doorLeft, windowLeft, windowRight, planksLeft, planksRight } from '../palette.js';
import { goldenSign } from '../sprites.js';
import { sprite, pyramid } from '../iso.js';
import {
  big, bigShadow, P, box, face, gable, cylinder, f2, ln, dot, ell, OUT, STONE, WOOD, WOOD_DARK, BRICK, IRON, GOLD, PLASTER,
  DARK_STONE, archLeft, courseLeft, courseRight, crate, barrel, cone
} from './kit.js';

const COPPER = { top: '#F4B07A', left: '#D9844E', right: '#A85C31' };
const MOLTEN = '#FF8A2E';

// Moules à lingots sur une dalle, métal en fusion qui refroidit
function molds(u, v) {
  let out = box(u - 0.14, v - 0.1, u + 0.14, v + 0.1, 0, 4, DARK_STONE);
  [-0.08, 0, 0.08].forEach((du, k) => {
    out += face([[u + du - 0.03, v - 0.07, 4.1], [u + du + 0.03, v - 0.07, 4.1], [u + du + 0.03, v + 0.07, 4.1], [u + du - 0.03, v + 0.07, 4.1]], k === 1 ? MOLTEN : GOLD.left);
  });
  return out;
}
// Bloc du four (à droite) : briques, bouche rougeoyante sur la face droite, hotte, cheminée
function furnace(u0, v0, u1, v1, h, chimneyH, k = 1) {
  const vm = (v0 + v1) / 2;
  return box(u0, v0, u1, v1, 0, h, BRICK) + courseLeft(u0, u1, v1, 0, h, Math.round(h / 6), 'rgba(90,40,25,.3)') + courseRight(u1, v0, v1, 0, h, Math.round(h / 6), 'rgba(70,30,20,.3)')
    + face([[u1, vm - 0.16 * k, 2], [u1, vm + 0.16 * k, 2], [u1, vm + 0.16 * k, h * 0.55], [u1, vm - 0.16 * k, h * 0.55]], '#3A1E14')
    + face([[u1, vm - 0.12 * k, 3], [u1, vm + 0.12 * k, 3], [u1, vm + 0.12 * k, h * 0.32], [u1, vm - 0.12 * k, h * 0.32]], MOLTEN)
    + pyramid(u0, v0, u1, v1, h, 10 * k, { back: BRICK.right, left: BRICK.left, right: BRICK.right }, 0.02)
    + box((u0 + u1) / 2 - 0.09 * k, vm - 0.09 * k, (u0 + u1) / 2 + 0.09 * k, vm + 0.09 * k, h + 6, h + chimneyH, BRICK)
    + box((u0 + u1) / 2 - 0.11 * k, vm - 0.11 * k, (u0 + u1) / 2 + 0.11 * k, vm + 0.11 * k, h + chimneyH, h + chimneyH + 3, DARK_STONE);
}

/* ---------- Palier III : Fonderie ---------- */
function foundry(skin) {
  const u0 = -0.8, u1 = 0.15, v0 = -0.55, v1 = 0.45;
  const roof = roofOf(skin, ROOF_RED);
  const [cx, cy] = P(0.56, -0.08, 26);
  return sprite(
    `<ellipse cx="4" cy="${f2(P(0, 0, 0)[1] + 4)}" rx="58" ry="27" fill="rgba(40,55,20,.14)"/>`
    + box(u0, v0, u1, v1, 0, 22, STONE) + courseLeft(u0, u1, v1, 0, 22, 3) + courseRight(u1, v0, v1, 0, 22, 3)
    + doorLeft(-0.55, -0.15, v1, 17, WOOD_DARK.right)
    + box(u0, v0, u1, v1, 22, 40, WOOD) + planksLeft(u0, u1, v1, 22, 40) + planksRight(u1, v0, v1, 22, 40)
    + windowLeft(-0.6, -0.35, v1, 27, 36) + windowRight(u1, -0.3, -0.05, 27, 36)
    + gable(u0, v0, u1, v1, 40, 18, { front: roof.front, back: roof.back, gable: WOOD.right }, 0.1)
    + roofTextureOf(skin, 'toit-rouge', u0, v0, u1, v1, 40, 18, 0.1)
    + (skin === 'enseigne-doree' ? goldenSign(-0.3, v1, 44) : '')
    // Fourneau à creuset : base de briques, creuset de métal en fusion, coulée vers les moules, deux cheminées
    + box(0.25, -0.45, 0.88, 0.3, 0, 22, BRICK) + courseLeft(0.25, 0.88, 0.3, 0, 22, 4, 'rgba(90,40,25,.3)')
    + face([[0.88, -0.2, 2], [0.88, 0.1, 2], [0.88, 0.1, 13], [0.88, -0.2, 13]], '#3A1E14') + face([[0.88, -0.16, 3], [0.88, 0.06, 3], [0.88, 0.06, 8], [0.88, -0.16, 8]], MOLTEN)
    + cylinder(0.56, -0.08, 22, 26, 0.2, { top: '#5E3A2A', left: DARK_STONE.left, right: DARK_STONE.right }, 'fd-cru')
    + `<ellipse cx="${f2(cx)}" cy="${f2(cy)}" rx="7" ry="3.5" fill="${MOLTEN}"/><ellipse cx="${f2(cx - 1.5)}" cy="${f2(cy - 0.6)}" rx="3" ry="1.4" fill="#FFE07A"/>`
    + box(0.62, -0.42, 0.78, -0.26, 22, 62, BRICK) + box(0.3, -0.42, 0.42, -0.3, 22, 50, BRICK)
    + face([[0.5, 0.3, 14], [0.56, 0.3, 14], [0.46, 0.5, 5], [0.4, 0.5, 5]], '#5E3A2A') + face([[0.51, 0.3, 14.3], [0.55, 0.3, 14.3], [0.45, 0.5, 5.3], [0.41, 0.5, 5.3]], MOLTEN)
    + molds(0.42, 0.6),
    BUILDING_BOX
  );
}

/* ---------- Palier IV : Grande forge ---------- */
function greatForge(skin) {
  const u0 = -1.35, u1 = 0.25, v0 = -1.3, v1 = 0.6;
  const roof = roofOf(skin, ROOF_RED);
  return big(
    bigShadow(86, 40)
    + box(u0, v0, u1, v1, 0, 34, STONE) + courseLeft(u0, u1, v1, 0, 34, 5) + courseRight(u1, v0, v1, 0, 34, 5)
    + archLeft(-0.55, 0.3, v1, 0, 30, '#3A2318', ` stroke="${OUT}" stroke-width="0.8"`)
    + archLeft(-0.55, 0.22, v1 + 0.005, 0, 24, '#7A2E14')
    + ell(...P(-0.55, v1, 8), 9, 5, MOLTEN, ' opacity=".7"')
    + [-1.15, 0.0].map(u => archLeft(u + 0.1, 0.08, v1, 14, 14, '#FFE6A3', ' stroke="#FFFFFF" stroke-width="0.8"')).join('')
    + [-1.05, -0.45].map(v => face([[u1, v, 14], [u1, v + 0.2, 14], [u1, v + 0.2, 26], [u1, v, 26]], '#FFE6A3', ' stroke="#FFFFFF" stroke-width="0.8"')).join('')
    + gable(u0, v0, u1, v1, 34, 26, { front: roof.front, back: roof.back, gable: STONE.right }, 0.1)
    + roofTextureOf(skin, 'toit-rouge', u0, v0, u1, v1, 34, 26, 0.1)
    + (skin === 'enseigne-doree' ? goldenSign(-0.1, v1, 46) : '')
    + furnace(0.42, -0.72, 1.4, 0.42, 26, 58, 1.5)
    + barrel(0.62, 0.95, 'gf-b1') + crate(-1.12, 1.0, 0.12, 10) + crate(-0.92, 1.12, 0.1, 8)
  );
}

/* ---------- Palier V : Manufacture ---------- */
function manufacture(skin) {
  const u0 = -1.35, u1 = 0.3, v0 = -1.35, v1 = 0.45;
  const roof = roofOf(skin, { front: '#8E9AB2', back: '#5C6880' });
  let sheds = '';
  // Toit en sheds : trois dents de scie, vitrages verticaux tournés vers l'arrière
  for (let k = 0; k < 3; k++) {
    const a = u0 + ((u1 - u0) / 3) * k;
    const b = a + (u1 - u0) / 3;
    sheds += face([[a, v0, 36], [a, v1, 36], [a, v1, 54], [a, v0, 54]], 'rgba(200,230,245,.9)', ` stroke="${OUT}" stroke-width="0.7"`)
      + face([[a, v0, 54], [b, v0, 36], [b, v1, 36], [a, v1, 54]], roof.front, ` stroke="${OUT}" stroke-width="0.7"`)
      + face([[a, v1, 54], [b, v1, 36], [a, v1, 36]], PLASTER.left, ` stroke="${OUT}" stroke-width="0.7"`);
  }
  return big(
    bigShadow(88, 42)
    + box(u0, v0, u1, v1, 0, 36, PLASTER) + courseRight(u1, v0, v1, 0, 36, 4, 'rgba(150,120,80,.2)')
    + [-1.2, -0.85, -0.5, -0.15].map(u => face([[u, v1, 14], [u + 0.22, v1, 14], [u + 0.22, v1, 30], [u, v1, 30]], '#FFE6A3', ' stroke="#FFFFFF" stroke-width="0.9"') + ln(P(u + 0.11, v1, 14), P(u + 0.11, v1, 30), '#FFFFFF', 0.7)).join('')
    + face([[-0.6, v1, 0], [-0.35, v1, 0], [-0.35, v1, 11], [-0.6, v1, 11]], '#6A3F22', ` stroke="${OUT}" stroke-width="0.7"`)
    + sheds
    + (skin === 'enseigne-doree' ? goldenSign(-0.3, v1, 40) : '')
    + furnace(0.45, -0.72, 1.4, 0.42, 26, 62, 1.5)
    + crate(-1.15, 0.85, 0.13, 11) + crate(-0.9, 0.9, 0.11, 9) + crate(-1.1, 0.8, 0.1, 8) + barrel(0.65, 0.95, 'mf-b1')
  );
}

/* ---------- Palier VI : Usine ---------- */
const GEAR = { u: -0.55, v: 0.47, z: 30, r: 0.3 };
function factory(skin) {
  const u0 = -1.35, u1 = 0.3, v0 = -1.35, v1 = 0.45;
  const roof = roofOf(skin, { front: '#6C7480', back: '#4F5660' });
  return big(
    bigShadow(90, 42)
    + cylinder(-1.05, -1.05, 40, 112, 0.12, { top: '#4A2A20', left: BRICK.left, right: BRICK.right }, 'fc-ch1')
    + cylinder(-0.45, -1.1, 40, 100, 0.11, { top: '#4A2A20', left: BRICK.left, right: BRICK.right }, 'fc-ch2')
    + box(u0, v0, u1, v1, 0, 40, BRICK) + courseLeft(u0, u1, v1, 0, 40, 8, 'rgba(90,40,25,.3)') + courseRight(u1, v0, v1, 0, 40, 8, 'rgba(70,30,20,.3)')
    + [-1.2, -0.95, -0.2, 0.05].map(u => archLeft(u + 0.08, 0.08, v1, 12, 18, '#FFE6A3', ' stroke="#FFFFFF" stroke-width="0.8"')).join('')
    + face([[u0 - 0.04, v0 - 0.04, 40], [u1 + 0.04, v0 - 0.04, 40], [u1 + 0.04, v1 + 0.04, 40], [u0 - 0.04, v1 + 0.04, 40]], roof.back, ` stroke="${OUT}" stroke-width="0.7"`)
    + box(u0, v1 - 0.04, u1, v1 + 0.04, 40, 44, DARK_STONE)
    // Tuyaux de cuivre vers le four
    + ln(P(u1, 0.2, 30), P(0.45, 0.2, 30), COPPER.right, 3.4) + ln(P(u1, 0.2, 31), P(0.45, 0.2, 31), COPPER.top, 1)
    + ln(P(u1, -0.6, 22), P(0.45, -0.6, 22), COPPER.right, 3) + ln(P(u1, -0.6, 23), P(0.45, -0.6, 23), COPPER.top, 0.9)
    + (skin === 'enseigne-doree' ? goldenSign(-1.0, v1, 40) : '')
    + furnace(0.45, -0.72, 1.4, 0.42, 30, 66, 1.5)
    + barrel(0.65, 0.95, 'fc-b1') + barrel(0.88, 1.05, 'fc-b2') + crate(-1.15, 0.85, 0.13, 11)
  );
}
// Grande roue dentée sur la façade, qui tourne (6 images), dans le plan (u, z)
const gear = f => sprite((() => {
  const { u, v, z, r } = GEAR;
  const pt = (a, rr) => P(u + rr * Math.cos(a), v, z + 32 * rr * Math.sin(a));
  const turn = (f / 6) * (Math.PI / 6);
  const teeth = Array.from({ length: 24 }, (_, k) => pt(turn + (k / 24) * Math.PI * 2, k % 2 ? r : r * 1.18));
  const [cx, cy] = P(u, v, z);
  let out = `<polygon points="${teeth.map(p => p.map(f2).join(',')).join(' ')}" fill="${IRON.left}" stroke="#41484F" stroke-width="0.8"/>`;
  const hole = Array.from({ length: 16 }, (_, k) => pt((k / 16) * Math.PI * 2, r * 0.7));
  out += `<polygon points="${hole.map(p => p.map(f2).join(',')).join(' ')}" fill="${IRON.right}"/>`;
  for (let k = 0; k < 4; k++) out += ln([cx, cy], pt(turn + (k / 4) * Math.PI * 2, r * 0.72), IRON.top, 2);
  return out + dot(cx, cy, 2.6, '#41484F');
})(), { x: -50, y: -70, w: 60, h: 50 });

/* ---------- Palier VII : Atelier de l'Alchimiste ---------- */
const ALEMBIC = { u: 0.9, v: -0.15, z: 26 };
function alchemist(skin) {
  const roofCone = skin === 'toit-ardoise' ? { light: '#9AA6BC', dark: '#4F5A72' } : { light: '#B9A0F0', dark: '#5E44A8' };
  const [tx, ty] = P(-0.55, -0.55, 0);
  const stars = [[-8, -96], [6, -104], [-2, -84], [12, -90]].map(([dx, dy]) => `<path d="M${f2(tx + dx)},${f2(ty + dy - 2.4)} L${f2(tx + dx + 0.8)},${f2(ty + dy)} L${f2(tx + dx)},${f2(ty + dy + 2.4)} L${f2(tx + dx - 0.8)},${f2(ty + dy)} Z" fill="${GOLD.top}"/>`).join('');
  return big(
    bigShadow(88, 42)
    // Tour de pierre ronde, fenêtres en ogive qui luisent, toit conique mauve étoilé
    + cylinder(-0.55, -0.55, 0, 80, 0.5, STONE, 'al-tower')
    + [18, 36, 54, 72].map(z => { const [x, y] = P(-0.55, -0.55, z); return `<path d="M${f2(x - 22.6)},${f2(y)} A22.6,11.3 0 0 0 ${f2(x + 22.6)},${f2(y)}" fill="none" stroke="rgba(90,80,65,.3)" stroke-width="0.7"/>`; }).join('')
    + [[-0.75, -0.12, 26], [-0.38, -0.14, 48], [-0.62, -0.1, 66]].map(([u, v, z]) => { const [x, y] = P(u, v, z); return `<path d="M${f2(x - 3.5)},${f2(y + 6)} V${f2(y - 2)} Q${f2(x)},${f2(y - 8)} ${f2(x + 3.5)},${f2(y - 2)} V${f2(y + 6)} Z" fill="#C8F0A0" stroke="#FFFFFF" stroke-width="0.8"/>`; }).join('')
    + archLeft(-0.4, 0.13, -0.06, 0, 18, '#3A2A1E', ` stroke="${OUT}" stroke-width="0.7"`)
    + cone(-0.55, -0.55, 80, 0.62, 40, roofCone, 'al-roof') + stars
    + ln([tx, ty - 120], [tx, ty - 130], '#7A5A3A', 1.4) + `<path d="M${f2(tx - 4)},${f2(ty - 131)} a4,4 0 1 0 8,0 a3,3 0 1 1 -8,0 Z" fill="${GOLD.left}"/>`
    // Laboratoire : four d'athanor (le soufflet s'y branche), grand alambic de verre, serpentin de cuivre
    + furnace(0.42, -0.72, 1.4, 0.42, 24, 40, 1.5)
    + cylinder(ALEMBIC.u, ALEMBIC.v, ALEMBIC.z, ALEMBIC.z + 4, 0.3, COPPER, 'al-ring')
    + `<path d="M${f2(P(ALEMBIC.u, ALEMBIC.v, 30)[0] - 13)},${f2(P(ALEMBIC.u, ALEMBIC.v, 30)[1])} Q${f2(P(ALEMBIC.u, ALEMBIC.v, 30)[0] - 15)},${f2(P(ALEMBIC.u, ALEMBIC.v, 30)[1] - 26)} ${f2(P(ALEMBIC.u, ALEMBIC.v, 30)[0])},${f2(P(ALEMBIC.u, ALEMBIC.v, 30)[1] - 28)} Q${f2(P(ALEMBIC.u, ALEMBIC.v, 30)[0] + 15)},${f2(P(ALEMBIC.u, ALEMBIC.v, 30)[1] - 26)} ${f2(P(ALEMBIC.u, ALEMBIC.v, 30)[0] + 13)},${f2(P(ALEMBIC.u, ALEMBIC.v, 30)[1])} Z" fill="rgba(200,245,220,.55)" stroke="#FFFFFF" stroke-width="1"/>`
    + ell(P(ALEMBIC.u, ALEMBIC.v, 30)[0], P(ALEMBIC.u, ALEMBIC.v, 30)[1] - 6, 11, 5, '#6FE08A', ' opacity=".85"')
    + `<path d="M${f2(P(ALEMBIC.u, ALEMBIC.v, 58)[0])},${f2(P(ALEMBIC.u, ALEMBIC.v, 58)[1])} q-14,-6 -26,8 q-6,8 -2,18" stroke="${COPPER.right}" stroke-width="2.4" fill="none"/>`
    + (skin === 'enseigne-doree' ? goldenSign(-0.05, -0.06, 30) : '')
    + barrel(0.62, 0.95, 'al-b1') + crate(-1.1, 0.9, 0.12, 10)
  );
}
// Bulles qui montent dans l'alambic, vapeur colorée (6 images)
const bubbles = f => sprite((() => {
  const [x, y] = P(ALEMBIC.u, ALEMBIC.v, 30);
  let out = '';
  for (let k = 0; k < 6; k++) {
    const t = ((f / 6) + k / 6) % 1;
    out += `<circle cx="${f2(x - 6 + (k * 2.3) % 12)}" cy="${f2(y - 6 - t * 18)}" r="${f2(1 + t * 1.6)}" fill="none" stroke="rgba(255,255,255,${f2(0.9 - t * 0.6)})" stroke-width="0.7"/>`;
  }
  const [px, py] = P(ALEMBIC.u - 0.35, ALEMBIC.v + 0.3, 40);
  for (let k = 0; k < 3; k++) {
    const t = ((f / 6) + k / 3) % 1;
    out += dot(px - 4 + t * 6, py - t * 22, 2 + t * 4, `rgba(190,150,255,${f2(0.5 * (1 - t))})`);
  }
  return out;
})(), { x: -10, y: -110, w: 80, h: 90 });

export const ATELIER_TIERS = [
  { make: foundry, lights: [[0.88, -0.05, 7, 26], [0.56, -0.08, 28, 18], [0.42, 0.6, 5, 12]], smoke: [[0.7, -0.34, 64], [0.36, -0.36, 52]] },
  { make: greatForge, lights: [[1.4, -0.15, 8, 34], [-0.55, 0.6, 10, 26], [-1.05, 0.6, 20, 14], [0.1, 0.6, 20, 14]], smoke: [[0.91, -0.15, 96]] },
  { make: manufacture, lights: [[1.4, -0.15, 8, 34], [-1.09, 0.45, 22, 14], [-0.74, 0.45, 22, 14], [-0.39, 0.45, 22, 14], [-0.04, 0.45, 22, 14]], smoke: [[0.93, -0.15, 100]] },
  { make: factory, lights: [[1.4, -0.15, 9, 36], [-1.12, 0.45, 20, 14], [-0.87, 0.45, 20, 14], [-0.12, 0.45, 20, 14], [0.13, 0.45, 20, 14]], smoke: [[-1.05, -1.05, 114], [-0.45, -1.1, 102], [0.93, -0.15, 108]], anims: [{ key: 'gear', n: 6, fps: 6, frame: gear }] },
  { make: alchemist, lights: [[-0.75, -0.12, 26, 14], [-0.38, -0.14, 48, 14], [-0.62, -0.1, 66, 14], [0.9, -0.15, 36, 24], [1.4, -0.15, 8, 30]], smoke: [[0.91, -0.15, 66]], anims: [{ key: 'bubbles', n: 6, fps: 6, frame: bubbles }] }
];
