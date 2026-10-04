// Foyer, paliers IV à VII (3 × 3 cases) : Maison à étage, Manoir, Demeure, Château.
// Places laissées libres pour la boutique (repère 3 × 3) : four à l'avant gauche, chien et chat devant la porte,
// hamac sur le flanc droit (u ≈ 1.35).
import { ROOF_RED, roofOf, roofTexture, doorLeft } from '../palette';
import {
  big, P, box, face, gable, f2, ln, dot, OUT, SLATE, PLASTER, DARK_STONE, STONE, WOOD_DARK, GOLD,
  hip, dormer, chimney, shuttered, windowR, timberLeft, timberRight, courseLeft, courseRight, flowerBox,
  flowerBed, pavedPath, hedgeU, lampPost, tower, crenelsLeft, crenelsRight, flag, archLeft, hipTexture, bigShadow
} from './kit';

const BLUE_CONE = { light: '#86B6E6', dark: '#3F6FA3' };
const RED_CONE = { light: '#F08A6E', dark: '#A8402E' };
const THATCH_CONE = { light: '#F3D27E', dark: '#B88A3A' };
// Couleur des toits coniques selon le skin du toit
const coneOf = (skin, fallback) => (skin === 'toit-rouge' ? RED_CONE : skin === 'toit-bleu-foyer' ? BLUE_CONE : skin === 'toit-chaume-foyer' ? THATCH_CONE : fallback);

/* ---------- Palier IV : Maison à étage ---------- */
function townhouse(skin) {
  const u0 = -0.95, u1 = 0.75, v0 = -0.75, v1 = 0.55;
  const roof = roofOf(skin, ROOF_RED);
  const vm = (v0 + v1) / 2;
  return big(
    bigShadow(78, 36)
    + pavedPath([-0.05, 0.6], [-0.05, 1.48], 0.26)
    + flowerBed(0.42, 0.98, 0.16) + flowerBed(-0.62, 0.86, 0.14, ['#FFD45E', '#FFFFFF', '#A98ADB'])
    + box(u0 - 0.04, v0 - 0.04, u1 + 0.04, v1 + 0.04, 0, 4, DARK_STONE)
    // Rez-de-chaussée de pierre, étage à colombages
    + box(u0, v0, u1, v1, 4, 24, STONE) + courseLeft(u0, u1, v1, 4, 24, 4) + courseRight(u1, v0, v1, 4, 24, 4)
    + box(u0, v0, u1, v1, 24, 46, PLASTER) + timberLeft(u0, u1, v1, 24, 46) + timberRight(u1, v0, v1, 24, 46)
    + ln(P(u0, v1, 24), P(u1, v1, 24), '#6A3F22', 2.2)
    + doorLeft(-0.2, 0.1, v1, 19, '#8C4B32')
    + shuttered(-0.78, -0.56, v1, 9, 18) + shuttered(0.32, 0.54, v1, 9, 18)
    + shuttered(-0.72, -0.52, v1, 29, 39) + flowerBox(-0.76, -0.48, v1, 29)
    + shuttered(-0.12, 0.08, v1, 29, 39) + flowerBox(-0.16, 0.12, v1, 29)
    + shuttered(0.36, 0.56, v1, 29, 39) + flowerBox(0.32, 0.6, v1, 29)
    + windowR(u1, -0.48, -0.26, 9, 18) + windowR(u1, -0.36, -0.12, 29, 39)
    // Auvent de la porte sur deux poteaux, lanterne
    + box(-0.27, 0.78, -0.24, 0.81, 0, 19, WOOD_DARK) + box(0.14, 0.78, 0.17, 0.81, 0, 19, WOOD_DARK)
    + face([[-0.32, v1, 23], [0.22, v1, 23], [0.22, 0.86, 19], [-0.32, 0.86, 19]], roof.front, ` stroke="${OUT}" stroke-width="0.7"`)
    + face([[0.22, v1, 23], [0.22, 0.86, 19], [0.22, 0.86, 17.5], [0.22, v1, 21.5]], roof.back)
    + chimney(0.42, -0.4, 50, 86)
    + gable(u0, v0, u1, v1, 46, 34, { front: roof.front, back: roof.back, gable: PLASTER.right }, 0.12)
    + roofTexture(skin, u0, v0, u1, v1, 46, 34, 0.12)
    + (skin ? '' : [0.3, 0.6].map(k => ln(P(u0 - 0.12, vm + (v1 + 0.12 - vm) * k, 80 - 34 * k), P(u1 + 0.12, vm + (v1 + 0.12 - vm) * k, 80 - 34 * k), 'rgba(120,40,25,.35)', 1)).join(''))
    + dormer(-0.42, 0.12, vm, v1 + 0.12, 80, 46, 0.62, roof) + dormer(0.3, 0.12, vm, v1 + 0.12, 80, 46, 0.62, roof)
  );
}

/* ---------- Palier V : Manoir ---------- */
function manor(skin) {
  const u0 = -1.05, u1 = 0.9, v0 = -0.95, v1 = 0.3;
  const roof = roofOf(skin, SLATE);
  const h1 = 24;
  const h2 = 46;
  const pav = { u0: -0.28, u1: 0.22, v1: 0.52 };
  return big(
    bigShadow(86, 40)
    // Cour de gravier et allée, haies taillées et buis en boule
    + face([[-0.7, 0.55, 0.2], [0.65, 0.55, 0.2], [0.65, 1.0, 0.2], [-0.7, 1.0, 0.2]], '#E8DCC2')
    + pavedPath([-0.03, 0.62], [-0.03, 1.48], 0.3)
    + hedgeU(-0.95, -0.45, 1.0, 7) + hedgeU(0.4, 0.95, 1.0, 7)
    + [[-0.85, 0.62], [0.82, 0.62]].map(([u, v]) => `${box(u - 0.05, v - 0.05, u + 0.05, v + 0.05, 0, 6, STONE)}${dot(...P(u, v, 13), 7, '#6DB04F')}${dot(P(u, v, 13)[0] - 2, P(u, v, 13)[1] - 2.5, 3, '#A8DA84')}`).join('')
    + box(u0 - 0.04, v0 - 0.04, u1 + 0.04, v1 + 0.04, 0, 4, DARK_STONE)
    + box(u0, v0, u1, v1, 4, h1, STONE) + courseLeft(u0, u1, v1, 4, h1, 4) + courseRight(u1, v0, v1, 4, h1, 4)
    + box(u0, v0, u1, v1, h1, h2, PLASTER) + courseRight(u1, v0, v1, h1, h2, 3, 'rgba(150,120,80,.2)')
    + ln(P(u0, v1, h1), P(u1, v1, h1), '#B9A27C', 2) + ln(P(u1, v0, h1), P(u1, v1, h1), '#9E8864', 2)
    // Fenêtres hautes sur toute la façade
    + [-0.9, -0.62, 0.42, 0.7].map(u => shuttered(u, u + 0.16, v1, 9, 19, '#3F6FA3') + shuttered(u, u + 0.16, v1, 29, 40, '#3F6FA3')).join('')
    + windowR(u1, -0.75, -0.55, 9, 19) + windowR(u1, -0.75, -0.55, 29, 40) + windowR(u1, -0.25, -0.05, 9, 19) + windowR(u1, -0.25, -0.05, 29, 40)
    // Avant-corps central : fronton, porte à deux battants, perron
    + box(pav.u0, v1, pav.u1, pav.v1, 4, h2 + 4, PLASTER)
    + face([[pav.u0, pav.v1, h2 + 4], [pav.u1, pav.v1, h2 + 4], [(pav.u0 + pav.u1) / 2, pav.v1, h2 + 18]], PLASTER.top, ` stroke="${OUT}" stroke-width="0.7"`)
    + `<circle cx="${f2(P((pav.u0 + pav.u1) / 2, pav.v1, h2 + 9)[0])}" cy="${f2(P((pav.u0 + pav.u1) / 2, pav.v1, h2 + 9)[1])}" r="3" fill="#FFE6A3" stroke="#FFFFFF" stroke-width="0.8"/>`
    + face([[pav.u0 + 0.1, pav.v1, 4], [pav.u1 - 0.1, pav.v1, 4], [pav.u1 - 0.1, pav.v1, 22], [pav.u0 + 0.1, pav.v1, 22]], '#6A3F22', ` stroke="${OUT}" stroke-width="0.7"`)
    + ln(P((pav.u0 + pav.u1) / 2, pav.v1, 4), P((pav.u0 + pav.u1) / 2, pav.v1, 22), '#3A2A1E', 0.8)
    + shuttered(pav.u0 + 0.12, pav.u1 - 0.12, pav.v1, 29, 40, '#3F6FA3')
    + box(pav.u0 - 0.04, pav.v1, pav.u1 + 0.04, pav.v1 + 0.08, 0, 4, STONE) + box(pav.u0, pav.v1 + 0.08, pav.u1, pav.v1 + 0.16, 0, 2, STONE)
    + lampPost(pav.u0 - 0.12, 0.62, 22) + lampPost(pav.u1 + 0.12, 0.62, 22)
    + chimney(-0.7, -0.35, 52, 84) + chimney(0.55, -0.35, 52, 84)
    + hip(u0, v0, u1, v1, h2, 30, { front: roof.front, back: roof.back, side: roof.back }, 0.1)
    + hipTexture(skin || 'toit-ardoise', u0, v0, u1, v1, h2, 30, 0.1, 'manor-tex')
    + dormer(-0.62, 0.11, (v0 + v1) / 2, v1 + 0.1, h2 + 30, h2, 0.6, roof) + dormer(0.55, 0.11, (v0 + v1) / 2, v1 + 0.1, h2 + 30, h2, 0.6, roof)
  );
}

/* ---------- Palier VI : Demeure ---------- */
function mansion(skin) {
  const roofCone = coneOf(skin, { light: '#8E9AB2', dark: '#4F5A72' });
  // Le manoir, plus une tour ronde à l'angle avant droit, une bibliothèque en rotonde et une fontaine de jardin
  const base = manor(skin);
  const body = base.svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
  const [fx, fy] = P(-0.5, 1.12, 0);
  return big(
    body
    + tower(0.98, 0.4, 0.26, 0, 62, { stone: PLASTER, roof: roofCone, roofH: 30, id: 'dm-tw' })
    + shuttered(0.86, 0.98, 0.66, 30, 40, '#3F6FA3') + shuttered(0.86, 0.98, 0.66, 46, 54, '#3F6FA3')
    // Fontaine de jardin à gauche de l'allée
    + `<ellipse cx="${f2(fx)}" cy="${f2(fy)}" rx="11" ry="5.5" fill="${STONE.right}"/><ellipse cx="${f2(fx)}" cy="${f2(fy - 3)}" rx="11" ry="5.5" fill="${STONE.left}"/><ellipse cx="${f2(fx)}" cy="${f2(fy - 3.4)}" rx="8.6" ry="4.2" fill="#5AAED7"/>`
    + `<rect x="${f2(fx - 1.2)}" y="${f2(fy - 12)}" width="2.4" height="9" fill="${STONE.top}"/><ellipse cx="${f2(fx)}" cy="${f2(fy - 12)}" rx="4" ry="2" fill="${STONE.left}"/>`
  );
}

/* ---------- Palier VII : Château ---------- */
const CASTLE = { top: '#EDE6D6', left: '#D2C8B3', right: '#AFA48E' };
function castle(skin) {
  const roofCone = coneOf(skin, BLUE_CONE);
  const keep = { u0: -0.75, u1: 0.55, v0: -1.1, v1: -0.1 };
  const wallZ = 30;
  return big(
    bigShadow(90, 42)
    + pavedPath([-0.1, 0.66], [-0.1, 1.48], 0.34)
    // Tours arrière (dessinées d'abord : l'ordre fait l'occlusion)
    + tower(-1.02, -1.0, 0.24, 0, 64, { stone: CASTLE, roof: roofCone, roofH: 30, id: 'ch-t1' })
    + tower(0.9, -1.0, 0.24, 0, 64, { stone: CASTLE, roof: roofCone, roofH: 30, id: 'ch-t2' })
    // Donjon carré au fond, créneaux
    + box(keep.u0, keep.v0, keep.u1, keep.v1, 0, 84, CASTLE) + courseLeft(keep.u0, keep.u1, keep.v1, 0, 84, 9, 'rgba(110,95,70,.28)') + courseRight(keep.u1, keep.v0, keep.v1, 0, 84, 9, 'rgba(90,75,55,.28)')
    + crenelsLeft(keep.u0, keep.u1, keep.v1, 84, CASTLE) + crenelsRight(keep.v0, keep.v1, keep.u1, 84, CASTLE)
    + [-0.5, -0.1, 0.3].map(u => face([[u, keep.v1, 56], [u + 0.1, keep.v1, 56], [u + 0.1, keep.v1, 68], [u, keep.v1, 68]], '#FFE6A3', ' stroke="#FFFFFF" stroke-width="0.8"')).join('')
    + windowR(keep.u1, -0.8, -0.65, 56, 68) + windowR(keep.u1, -0.45, -0.3, 56, 68)
    // Courtines : mur avant avec la porte, murs latéraux
    + box(-1.15, -0.95, -0.95, 0.55, 0, wallZ, CASTLE) + crenelsRight(-0.95, 0.55, -0.95, wallZ, CASTLE)
    + box(0.75, -0.95, 0.95, 0.55, 0, wallZ, CASTLE) + courseRight(0.95, -0.95, 0.55, 0, wallZ, 4, 'rgba(90,75,55,.28)') + crenelsRight(-0.95, 0.55, 0.95, wallZ, CASTLE)
    + box(-1.15, 0.38, 0.95, 0.55, 0, wallZ, CASTLE) + courseLeft(-1.15, 0.95, 0.55, 0, wallZ, 4, 'rgba(110,95,70,.28)') + crenelsLeft(-1.15, 0.95, 0.55, wallZ, CASTLE)
    // Porte : arc sombre, herse dorée, bannières
    + archLeft(-0.1, 0.17, 0.55, 0, 24, '#3A2A1E', ' stroke="#8A7A62" stroke-width="1.6"')
    + [-0.2, -0.13, -0.06, 0.01].map(u => ln(P(u, 0.555, 2), P(u, 0.555, 19), GOLD.right, 0.9)).join('') + ln(P(-0.25, 0.555, 9), P(0.05, 0.555, 9), GOLD.right, 0.9)
    + [[-0.55, '#3F6FA3'], [0.35, '#E2574C']].map(([u, c]) => {
      const [bx, by] = P(u, 0.56, 26);
      return `<path d="M${f2(bx - 4)},${f2(by)} h8 v12 l-4,-3 l-4,3 Z" fill="${c}" stroke="${GOLD.right}" stroke-width="0.7"/>` + dot(bx, by + 4, 1.4, GOLD.left);
    }).join('')
    // Tours avant
    + tower(-0.92, 0.6, 0.26, 0, 54, { stone: CASTLE, roof: roofCone, roofH: 30, id: 'ch-t3' })
    + tower(0.82, 0.6, 0.26, 0, 54, { stone: CASTLE, roof: roofCone, roofH: 30, id: 'ch-t4' })
    + lampPost(-0.42, 0.95, 22) + lampPost(0.22, 0.95, 22)
  );
}
// Drapeaux du Château : ils claquent au vent (4 images)
const castleFlags = f => big(
  flag(-0.1, -0.6, 84, '#E2574C', [0, 1, 0, -1][f], 26)
  + flag(-0.92, 0.6, 84, '#3F6FA3', [1, 0, -1, 0][f], 14)
  + flag(0.82, 0.6, 84, '#F2C04B', [-1, 0, 1, 0][f], 14)
);

export const FOYER_TIERS = [
  { make: townhouse, lights: [[-0.67, 0.55, 13, 16], [0.43, 0.55, 13, 16], [-0.62, 0.55, 34, 15], [-0.02, 0.55, 34, 15], [0.46, 0.55, 34, 15], [0.75, -0.37, 13, 15]], smoke: [[0.42, -0.4, 88]] },
  { make: manor, lights: [[-0.82, 0.3, 14, 15], [-0.54, 0.3, 14, 15], [0.5, 0.3, 14, 15], [0.78, 0.3, 14, 15], [-0.03, 0.52, 34, 15], [-0.37, 0.62, 22, 14], [0.31, 0.62, 22, 14]], smoke: [[-0.7, -0.35, 87], [0.55, -0.35, 87]] },
  { make: mansion, lights: [[-0.82, 0.3, 14, 15], [-0.54, 0.3, 14, 15], [0.5, 0.3, 14, 15], [-0.03, 0.52, 34, 15], [0.92, 0.66, 35, 14], [0.92, 0.66, 50, 14], [-0.37, 0.62, 22, 14], [0.31, 0.62, 22, 14]], smoke: [[-0.7, -0.35, 87], [0.55, -0.35, 87]] },
  { make: castle, lights: [[-0.45, -0.1, 62, 16], [-0.05, -0.1, 62, 16], [0.35, -0.1, 62, 16], [-0.42, 0.95, 28, 14], [0.22, 0.95, 28, 14], [-0.1, 0.62, 8, 18]], anims: [{ key: 'flags', n: 4, fps: 4, frame: castleFlags }] }
];
