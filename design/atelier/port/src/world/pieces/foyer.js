// Morceaux du Foyer (personnalisation par morceau) : la maison se compose de quatre morceaux posés dans cet ordre —
// murs, ouvertures (fenêtres et porte), toit, décor — chacun dans l'un des quatre styles (chibi, colombage, manoir,
// épuré) et dans l'une de ses couleurs. Tous les styles respectent le même squelette (emprise, hauteurs, places des
// fenêtres et de la porte, cheminée, four du labo) : les morceaux se mélangent librement, et les accroches du jeu
// (lumières, vapeur, crête des pièces rares, places de la boutique) ne bougent pas d'un style à l'autre.
import { P, mixHex, HIVER, NEIGE, snowPan } from '../iso.js';
import { roofTextureOf } from '../palette.js';
import { INK as INK_C, TRAIT, DETAIL, trait, bloc, poteau, poly as polyC, pierreRonde, riveGable, finesse } from '../chibi.js';
import { courseLeft, courseRight } from '../tiers/kit.js';
import { MAGIC_GLASS, CUIVRE as CUIVRE_C, lucarne as lucarneC, laboChibi, herbesChibi } from '../tiers/foyer.js';
import {
  INK, f2, xy, pts, rnd, grad, poly, polyG, line, seg, boite, appareil, ombreToit, toit as toitFin, rives, fenetreF, fenetreD, touffe, lavande, clip
} from '../fin.js';

export const STYLES = ['chibi', 'colombage', 'manoir', 'epure'];
export const NOMS_STYLES = { chibi: 'Chibi', colombage: 'Colombages', manoir: 'Manoir de pierre', epure: 'Épuré' };
export const MORCEAUX = ['murs', 'ouvertures', 'toit', 'decor'];
export const NOMS_MORCEAUX = { murs: 'Murs', ouvertures: 'Fenêtres et porte', toit: 'Toit', decor: 'Décor' };
// Couleurs de chaque morceau (la première est celle d'origine du style chibi)
export const COULEURS = {
  murs: {
    miel: { nom: 'Miel', pierre: '#D9CDB2', enduit: '#F4EAD6', bois: '#6B4A32' },
    gris: { nom: 'Pierre grise', pierre: '#C8C4BA', enduit: '#EEEDE7', bois: '#55493F' },
    ocre: { nom: 'Ocre', pierre: '#DDBE92', enduit: '#F2D9AE', bois: '#7A4A2C' },
    rose: { nom: 'Grès rose', pierre: '#D9BCAE', enduit: '#F3DED4', bois: '#6A3E36' }
  },
  ouvertures: {
    prune: { nom: 'Prune', c: '#6A3F6E' },
    sauge: { nom: 'Sauge', c: '#6F8F6A' },
    bleu: { nom: 'Bleu de Prusse', c: '#4E6E96' },
    rouge: { nom: 'Sang-de-bœuf', c: '#8E3B33' }
  },
  toit: {
    violet: { nom: 'Ardoise violette', c: '#8C7BC4' },
    tuile: { nom: 'Terre cuite', c: '#B0664C' },
    ardoise: { nom: 'Ardoise', c: '#5E6170' },
    vert: { nom: 'Vert-de-gris', c: '#5E8A7E' }
  },
  decor: {
    lavande: { nom: 'Lavande', c: '#8A6CCF' },
    rose: { nom: 'Roses', c: '#E07A9A' },
    or: { nom: 'Bouton d’or', c: '#E8B84A' },
    blanc: { nom: 'Fleurs blanches', c: '#F4F1EA' }
  }
};

// Squelette du palier IV (3 × 3) : même rectangle et mêmes places que la maison d'origine
export const SQUELETTE_IV = (() => {
  const u0 = -1.02, u1 = 0.42, v0 = -0.86, v1 = 0.42;
  return {
    u0, u1, v0, v1, socle: 4, rdc: 24, etage: 26, zr: 46, hr: 31, o: 0.12,
    porte: { u: (u0 + u1) / 2 + 0.06, w: 0.12, h: 19 },
    fen: { bas: [[u0 + 0.12, u0 + 0.3], [u1 - 0.32, u1 - 0.14]], zBas: [8, 19], haut: [[u0 + 0.14, u0 + 0.32], [u1 - 0.34, u1 - 0.16]], zHaut: [29, 41], droite: [v0 + 0.2, v0 + 0.4] },
    cheminee: [u1 - 0.32, v0 + 0.24, 96],
    labo: [0.8, -0.16],
    enseigne: [u0 + 0.44, 31],
    jardin: [0.46, 0.5, 0.98, 0.86]
  };
})();

/* ---------- éléments communs ---------- */
const VITRE = '#D9CFF2';
const CUIVRE = { light: '#F6C28F', mid: '#D98A52', dark: '#9C5530' };
function cylindre(u, v, z0, z1, r, c, w = 1) {
  const [x, y0] = P(u, v, z0), [, y1] = P(u, v, z1);
  const rx = r * 45.25, ry = r * 22.63;
  const [d, g] = grad(c.light, c.dark);
  return d + `<path d="M${f2(x - rx)},${f2(y1)} L${f2(x - rx)},${f2(y0)} A${f2(rx)},${f2(ry)} 0 0 0 ${f2(x + rx)},${f2(y0)} L${f2(x + rx)},${f2(y1)} Z" fill="${g}" stroke="${INK}" stroke-width="${w}"/>`
    + `<ellipse cx="${f2(x)}" cy="${f2(y1)}" rx="${f2(rx)}" ry="${f2(ry)}" fill="${c.top || c.mid}" stroke="${INK}" stroke-width="${w}"/>`
    + seg([x - rx * 0.45, y1 + ry + 0.5], [x - rx * 0.45, y0 - 0.5], Math.max(0.8, rx * 0.18), 'rgba(255,255,255,.4)');
}
const anneau = (u, v, z, r, c = INK, w = 0.8) => { const [x, y] = P(u, v, z); const rx = r * 45.25, ry = r * 22.63; return `<path d="M${f2(x - rx)},${f2(y)} A${f2(rx)},${f2(ry)} 0 0 0 ${f2(x + rx)},${f2(y)}" fill="none" stroke="${c}" stroke-width="${w}"/>`; };
// Cheminée de cuivre au trait fin (sommet en z 96 : vapeur et crête du jeu)
function chemineeFine(S) {
  const [u, v, zt] = S.cheminee;
  return cylindre(u, v, S.zr, zt - 4, 0.065, { ...CUIVRE, top: '#5A3A28' }) + [56, 70, 84].map(z => anneau(u, v, z, 0.066, '#7A4024', 1.1)).join('')
    + cylindre(u, v, zt - 5, zt, 0.095, { ...CUIVRE, top: HIVER ? NEIGE.light : '#3A2618' }) + anneau(u, v, zt - 2.5, 0.096, '#7A4024', 0.8);
}
// Cheminée de cuivre chibi (même place)
function chemineeChibi(S) {
  const [cu, cv, zt] = S.cheminee;
  return poteau(cu, cv, S.zr, zt - 4, 0.07, CUIVRE_C, 'mc-ch') + poteau(cu, cv, zt - 4, zt, 0.1, CUIVRE_C, 'mc-cap')
    + [62, 78].map(z => { const [x, y] = P(cu, cv, z); return `<path d="M${f2(x - 3.4)},${f2(y)} A3.4,1.7 0 0 0 ${f2(x + 3.4)},${f2(y)}" fill="none" stroke="${INK_C}" stroke-width="1.6"/>`; }).join('');
}

/* ================= MURS ================= */
function mursChibi(S, c) {
  const { u0, u1, v0, v1, zr, hr } = S, vm = (v0 + v1) / 2;
  const pierre = { top: mixHex(c.pierre, '#FFFFFF', 0.4), left: c.pierre, right: mixHex(c.pierre, '#5A4630', 0.25) };
  const crepi = { top: '#FFF8EA', left: c.enduit, right: mixHex(c.enduit, '#8A6A40', 0.18) };
  const poutre = (a, b) => trait(a, b, 4.4, INK_C) + trait(a, b, 2.8, c.bois);
  let out = bloc(u0 - 0.05, v0 - 0.05, u1 + 0.05, v1 + 0.05, 0, S.socle, { top: '#D8CBB0', left: '#B9AA8C', right: '#93846A' }, 'mc-socle')
    + bloc(u0, v0, u1, v1, S.socle, S.rdc, pierre, 'mc-rdc')
    + courseLeft(u0, u1, v1, S.socle, S.rdc, 4, 'rgba(110,85,55,.42)') + courseRight(u1, v0, v1, S.socle, S.rdc, 4, 'rgba(90,70,45,.42)');
  [5, 11, 17].forEach((z, k) => {
    const d = k % 2 ? 0.1 : 0.16;
    out += polyC([[u1 - d, v1, z], [u1, v1, z], [u1, v1, z + 5], [u1 - d, v1, z + 5]], mixHex(pierre.left, '#FFFFFF', 0.4), DETAIL)
      + polyC([[u1, v1, z], [u1, v1 - d * 0.8, z], [u1, v1 - d * 0.8, z + 5], [u1, v1, z + 5]], pierre.right, DETAIL);
  });
  out += bloc(u0, v0, u1, v1, S.rdc, zr, crepi, 'mc-etage');
  const pa = u0 + 0.5, pb = u1 - 0.5;
  out += [u0 + 0.02, pa, pb, u1 - 0.02].map(u => poutre(P(u, v1, S.rdc), P(u, v1, zr))).join('')
    + poutre(P(pa, v1, S.rdc), P(pb, v1, zr)) + poutre(P(pb, v1, S.rdc), P(pa, v1, zr))
    + [v1 - 0.02, v0 + 0.55, v0 + 0.02].map(v => poutre(P(u1, v, S.rdc), P(u1, v, zr))).join('')
    + poutre(P(u1, v0 + 0.55, S.rdc), P(u1, v1 - 0.02, zr))
    + poutre(P(u0, v1, S.rdc + 0.5), P(u1, v1, S.rdc + 0.5)) + poutre(P(u1, v1, S.rdc + 0.5), P(u1, v0, S.rdc + 0.5))
    + poutre(P(u0, v1, zr - 0.5), P(u1, v1, zr - 0.5)) + poutre(P(u1, v1, zr - 0.5), P(u1, v0, zr - 0.5));
  // pignon crépi et son œil-de-bœuf
  out += polyC([[u1, v0, zr], [u1, v1, zr], [u1, vm, zr + hr]], crepi.right);
  const [lx, ly] = P(u1, vm, zr + hr * 0.36);
  out += `<ellipse cx="${f2(lx)}" cy="${f2(ly)}" rx="3.6" ry="4.2" fill="${MAGIC_GLASS}" stroke="${INK_C}" stroke-width="${TRAIT}"/>` + trait([lx, ly - 4.2], [lx, ly + 4.2], 0.9) + trait([lx - 3.6, ly], [lx + 3.6, ly], 0.9);
  return finesse(out);
}
function mursManoir(S, c) {
  const { u0, u1, v0, v1, zr, hr } = S, vm = (v0 + v1) / 2, Z = zr + hr;
  const pierre = c.pierre, pierreD = mixHex(c.pierre, '#4A3A28', 0.18);
  let out = boite(u0 - 0.04, v0 - 0.04, u1 + 0.04, v1 + 0.04, 0, S.socle, { top: mixHex(pierre, '#5A4630', 0.08), left: mixHex(pierre, '#5A4630', 0.2), right: mixHex(pierre, '#5A4630', 0.35) }, 1)
    + poly([[u0, v1, S.socle], [u1, v1, S.socle], [u1, v1, zr], [u0, v1, zr]], pierre, 1) + appareil('v', v1, u0, u1, S.socle, zr, pierre, { rang: 4, seed: 2 })
    + poly([[u1, v0, S.socle], [u1, v1, S.socle], [u1, v1, zr], [u1, v0, zr]], pierreD, 1) + appareil('u', u1, v0, v1, S.socle, zr, pierreD, { rang: 4, seed: 3 });
  for (let z = S.socle, k = 0; z < zr - 1; z += 4, k++) {
    const d = k % 2 ? 0.08 : 0.14;
    out += poly([[u1 - d, v1 + 0.006, z + 0.3], [u1, v1 + 0.006, z + 0.3], [u1, v1 + 0.006, z + 3.7], [u1 - d, v1 + 0.006, z + 3.7]], mixHex(pierre, '#FFFFFF', 0.45), 0.6)
      + poly([[u1 + 0.006, v1, z + 0.3], [u1 + 0.006, v1 - d * 0.8, z + 0.3], [u1 + 0.006, v1 - d * 0.8, z + 3.7], [u1 + 0.006, v1, z + 3.7]], mixHex(pierreD, '#FFFFFF', 0.2), 0.6);
  }
  const cordon = { top: mixHex(pierre, '#FFFFFF', 0.5), left: mixHex(pierre, '#FFFFFF', 0.15), right: mixHex(pierreD, '#FFFFFF', 0.05) };
  out += boite(u0 - 0.015, v1, u1 + 0.015, v1 + 0.03, S.rdc, S.etage, cordon, 0.8) + boite(u1, v0, u1 + 0.03, v1 + 0.03, S.rdc, S.etage, cordon, 0.8)
    + ombreToit('v', v1 + 0.004, u0, u1, zr, 7) + ombreToit('u', u1 + 0.004, v0, v1, zr, 5, 0.3) + ombreToit('v', v1 + 0.032, u0, u1, S.rdc, 3, 0.25);
  const gab = [[u1, v0, zr], [u1, v1, zr], [u1, vm, Z]];
  out += poly(gab, pierreD, 1) + clip(gab, appareil('u', u1, v0, v1, zr, Z, pierreD, { rang: 4, seed: 4 })) + poly(gab, 'none', 1);
  const [ox, oy] = P(u1 + 0.004, vm, zr + hr * 0.36);
  out += `<ellipse cx="${f2(ox)}" cy="${f2(oy)}" rx="4.6" ry="5.4" fill="${mixHex(pierre, '#FFFFFF', 0.5)}" stroke="${INK}" stroke-width="0.9"/><ellipse cx="${f2(ox)}" cy="${f2(oy)}" rx="3.2" ry="3.9" fill="${VITRE}" stroke="${INK}" stroke-width="0.6"/>`
    + seg([ox, oy - 3.9], [ox, oy + 3.9], 0.6, '#F4EEE4') + seg([ox - 3.2, oy], [ox + 3.2, oy], 0.6, '#F4EEE4');
  return out;
}
function mursColombage(S, c) {
  const { u0, u1, v0, v1, zr, hr } = S, vm = (v0 + v1) / 2, Z = zr + hr;
  const moellon = mixHex(c.pierre, '#8A7A60', 0.12), moellonD = mixHex(moellon, '#4A3A28', 0.2);
  const chene = c.bois, enduit = c.enduit, enduitD = mixHex(c.enduit, '#8A7050', 0.18);
  let out = boite(u0 - 0.03, v0 - 0.03, u1 + 0.03, v1 + 0.03, 0, S.socle, { top: mixHex(moellon, '#5A4630', 0.1), left: mixHex(moellon, '#5A4630', 0.25), right: mixHex(moellon, '#5A4630', 0.4) }, 1)
    + poly([[u0, v1, S.socle], [u1, v1, S.socle], [u1, v1, S.rdc], [u0, v1, S.rdc]], moellon, 1)
    + appareil('v', v1, u0, u1, S.socle, S.rdc, moellon, { rang: 3.2, long: [0.06, 0.13], seed: 11, joint: mixHex(moellon, '#FFFFFF', 0.45) })
    + poly([[u1, v0, S.socle], [u1, v1, S.socle], [u1, v1, S.rdc], [u1, v0, S.rdc]], moellonD, 1)
    + appareil('u', u1, v0, v1, S.socle, S.rdc, moellonD, { rang: 3.2, long: [0.06, 0.13], seed: 12, joint: mixHex(moellonD, '#FFFFFF', 0.35) });
  // sommier et bouts de solives entre les deux niveaux
  out += boite(u0 - 0.01, v0, u1 + 0.02, v1 + 0.02, S.rdc, S.etage, { top: mixHex(chene, '#FFFFFF', 0.2), left: chene, right: mixHex(chene, '#000000', 0.25) }, 0.9);
  for (let u = u0 + 0.06; u < u1 - 0.02; u += 0.12) out += poly([[u - 0.018, v1 + 0.022, S.rdc - 1.6], [u + 0.018, v1 + 0.022, S.rdc - 1.6], [u + 0.018, v1 + 0.022, S.rdc - 0.2], [u - 0.018, v1 + 0.022, S.rdc - 0.2]], mixHex(chene, '#000000', 0.25), 0.5);
  out += polyG([[u0, v1, S.etage], [u1, v1, S.etage], [u1, v1, zr], [u0, v1, zr]], enduit, mixHex(enduit, enduitD, 0.4), false, 1)
    + polyG([[u1, v0, S.etage], [u1, v1, S.etage], [u1, v1, zr], [u1, v0, zr]], enduitD, mixHex(enduitD, '#8A7A60', 0.3), false, 1);
  // briques en épi dans la travée du milieu
  const ba = u0 + 0.5, bb = u1 - 0.5;
  let epi = poly([[ba, v1 + 0.001, S.etage], [bb, v1 + 0.001, S.etage], [bb, v1 + 0.001, zr], [ba, v1 + 0.001, zr]], '#D9B79C', 0);
  for (let z = S.etage + 0.5, r = 0; z < zr; z += 3, r++) for (let u = ba - 0.12; u < bb + 0.1; u += 0.1) {
    const d = r % 2 ? 1 : -1;
    epi += poly([[u, v1 + 0.002, z], [u + 0.07, v1 + 0.002, z + d * 1.6 + 1.6], [u + 0.088, v1 + 0.002, z + d * 1.6 + 0.6], [u + 0.018, v1 + 0.002, z - 1]], mixHex('#C98A6A', rnd(u * 99 + z) > 0.5 ? '#FFFFFF' : '#7A4A30', rnd(u * 33 + z) * 0.12), 0.25);
  }
  out += clip([[ba, v1, S.etage], [bb, v1, S.etage], [bb, v1, zr], [ba, v1, zr]], epi);
  const madrier = (a, b, wu = 0.022, wz = 1.1) => {
    const [ua, za] = a, [ub, zb] = b;
    const vert = Math.abs(ub - ua) < 0.001, hor = Math.abs(zb - za) < 0.001;
    const l = hor ? [[ua, v1 + 0.004, za - wz], [ub, v1 + 0.004, zb - wz], [ub, v1 + 0.004, zb + wz], [ua, v1 + 0.004, za + wz]]
      : [[ua - wu, v1 + 0.004, za], [ua + wu, v1 + 0.004, za], [ub + wu, v1 + 0.004, zb], [ub - wu, v1 + 0.004, zb]];
    return polyG(l, mixHex(chene, '#FFFFFF', 0.12), mixHex(chene, '#000000', 0.15), !vert, 0.7)
      + line(vert ? [ua - wu + 0.006, v1 + 0.005, za + 0.5] : [ua, v1 + 0.005, za + wz - 0.3], vert ? [ub - wu + 0.006, v1 + 0.005, zb - 0.5] : [ub, v1 + 0.005, zb + wz - 0.3], 0.4, 'rgba(255,230,200,.4)');
  };
  [u0 + 0.02, u0 + 0.4, ba, bb, u1 - 0.4, u1 - 0.02].forEach(u => { out += madrier([u, S.etage], [u, zr]); });
  out += madrier([ba, S.etage + 0.5], [bb, zr - 0.5]) + madrier([bb, S.etage + 0.5], [ba, zr - 0.5]) + madrier([u0, zr - 1.1], [u1, zr - 1.1])
    + madrier([u0, 35], [u0 + 0.4, 35]) + madrier([u1 - 0.4, 35], [u1, 35]);
  [v0 + 0.02, v0 + 0.55, v1 - 0.02].forEach(v => { out += polyG([[u1 + 0.004, v - 0.022, S.etage], [u1 + 0.004, v + 0.022, S.etage], [u1 + 0.004, v + 0.022, zr], [u1 + 0.004, v - 0.022, zr]], mixHex(chene, '#000000', 0.1), mixHex(chene, '#000000', 0.35), false, 0.7); });
  out += ombreToit('v', v1 + 0.006, u0, u1, zr, 6) + ombreToit('u', u1 + 0.006, v0, v1, zr, 5, 0.3) + ombreToit('v', v1 + 0.004, u0, u1, S.rdc, 5, 0.42);
  // pignon enduit à pans de bois
  const gab = [[u1, v0, zr], [u1, v1, zr], [u1, vm, Z]];
  out += polyG(gab, enduitD, mixHex(enduitD, '#8A7A60', 0.4), true, 1)
    + line([u1 + 0.004, vm, zr], [u1 + 0.004, vm, Z - 2], 2.4, mixHex(chene, '#000', 0.25)) + line([u1 + 0.004, v0 + 0.15, zr], [u1 + 0.004, vm, zr + hr * 0.62], 2, mixHex(chene, '#000', 0.25)) + line([u1 + 0.004, v1 - 0.15, zr], [u1 + 0.004, vm, zr + hr * 0.62], 2, mixHex(chene, '#000', 0.25));
  return out;
}
function mursEpure(S, c) {
  const { u0, u1, v0, v1, zr, hr } = S, vm = (v0 + v1) / 2, Z = zr + hr;
  const enduit = mixHex(c.enduit, '#FFFFFF', 0.3), enduitD = mixHex(c.enduit, '#7A6A50', 0.16);
  let out = boite(u0 - 0.03, v0 - 0.03, u1 + 0.03, v1 + 0.03, 0, S.socle, { top: mixHex(c.pierre, '#FFFFFF', 0.2), left: c.pierre, right: mixHex(c.pierre, '#4A3A28', 0.2) }, 1)
    + polyG([[u0, v1, S.socle], [u1, v1, S.socle], [u1, v1, zr], [u0, v1, zr]], enduit, mixHex(enduit, enduitD, 0.35), false, 1)
    + polyG([[u1, v0, S.socle], [u1, v1, S.socle], [u1, v1, zr], [u1, v0, zr]], enduitD, mixHex(enduitD, '#6A5A44', 0.15), false, 1);
  { const [d, g] = grad('rgba(120,100,70,0)', 'rgba(120,100,70,.14)', true); out += d + `<polygon points="${pts([[u0, v1, 12], [u1, v1, 12], [u1, v1, S.socle], [u0, v1, S.socle]])}" fill="${g}"/>`; }
  for (let z = S.socle, k = 0; z < zr - 3; z += 5, k++) {
    const d = k % 2 ? 0.06 : 0.1, q = mixHex(c.pierre, '#FFFFFF', 0.45);
    out += poly([[u1 - d, v1 + 0.004, z + 0.4], [u1, v1 + 0.004, z + 0.4], [u1, v1 + 0.004, z + 4.6], [u1 - d, v1 + 0.004, z + 4.6]], q, 0.4)
      + poly([[u0, v1 + 0.004, z + 0.4], [u0 + d, v1 + 0.004, z + 0.4], [u0 + d, v1 + 0.004, z + 4.6], [u0, v1 + 0.004, z + 4.6]], q, 0.4);
  }
  const corniche = { top: mixHex(enduit, '#FFFFFF', 0.3), left: mixHex(enduit, '#7A6A50', 0.06), right: mixHex(enduitD, '#000000', 0.08) };
  out += boite(u0 - 0.02, v1, u1 + 0.02, v1 + 0.035, zr - 2.4, zr, corniche, 0.8) + boite(u1, v0, u1 + 0.035, v1 + 0.035, zr - 2.4, zr, corniche, 0.8)
    + ombreToit('v', v1 + 0.004, u0, u1, zr - 2.4, 6, 0.3) + ombreToit('u', u1 + 0.004, v0, v1, zr - 2.4, 4, 0.25);
  const gab = [[u1, v0, zr], [u1, v1, zr], [u1, vm, Z]];
  out += polyG(gab, enduitD, mixHex(enduitD, '#6A5A44', 0.12), true, 1);
  const [ox, oy] = P(u1 + 0.004, vm, zr + hr * 0.34);
  out += `<ellipse cx="${f2(ox)}" cy="${f2(oy)}" rx="3.6" ry="4.2" fill="#F7F3EC" stroke="${INK}" stroke-width="0.8"/><ellipse cx="${f2(ox)}" cy="${f2(oy)}" rx="2.6" ry="3.1" fill="${VITRE}"/>`;
  return out;
}

/* ================= OUVERTURES (fenêtres et porte) ================= */
const archePorte = (S, ww, hh, dv, cintre = true) => {
  const { u } = S.porte, vf = S.v1, z0 = S.socle;
  return [[u - ww, vf + dv, z0], ...Array.from({ length: 13 }, (_, k) => { const t = Math.PI - (k / 12) * Math.PI; return [u + Math.cos(t) * ww, vf + dv, z0 + hh - (cintre ? ww * 32 : 0) + (cintre ? Math.sin(t) * ww * 32 : 0)]; }), [u + ww, vf + dv, z0]];
};
function porteFine(S, { cadre, vantail, cintre = true, imposte = false }) {
  const { u, w, h } = S.porte, vf = S.v1, z0 = S.socle;
  let out = boite(u - 0.2, vf, u + 0.2, vf + 0.12, 0, 2, { top: '#E3DACA', left: '#C9BCA2', right: '#A69880' }, 0.8)
    + boite(u - 0.17, vf, u + 0.17, vf + 0.06, 2, z0, { top: HIVER ? NEIGE.light : '#ECE4D4', left: '#D3C6AC', right: '#B0A288' }, 0.8)
    + poly(archePorte(S, w + 0.04, h + 2.6, 0.003, cintre), cadre, 1) + poly(archePorte(S, w, h, 0.005, cintre), '#2A1E16', 0.7);
  const [dv, gv] = grad(mixHex(vantail, '#FFFFFF', 0.12), mixHex(vantail, '#000000', 0.2));
  out += dv + poly(archePorte(S, w - 0.012, h - 0.8, 0.007, cintre), gv, 0);
  for (let k = -2; k <= 2; k++) out += line([u + k * 0.045, vf + 0.008, z0 + 0.5], [u + k * 0.045, vf + 0.008, z0 + h - (cintre ? 4 : 1)], 0.5, 'rgba(0,0,0,.35)');
  [8, 16].forEach(z => { out += line([u - w + 0.01, vf + 0.009, z], [u + 0.04, vf + 0.009, z], 1.4, '#2E2A28'); });
  const [kx, ky] = P(u + 0.07, vf + 0.01, 11);
  out += `<circle cx="${f2(kx)}" cy="${f2(ky)}" r="1.8" fill="none" stroke="#C8A040" stroke-width="0.9"/><circle cx="${f2(kx)}" cy="${f2(ky - 1.8)}" r="0.7" fill="#C8A040"/>`;
  if (imposte) {
    const fan = Array.from({ length: 9 }, (_, k) => { const t = Math.PI - (k / 8) * Math.PI; return [u + Math.cos(t) * (w - 0.015), vf + 0.008, z0 + h - 0.5 + Math.sin(t) * 4.5]; });
    out += poly([[u - w + 0.015, vf + 0.008, z0 + h - 0.5], ...fan, [u + w - 0.015, vf + 0.008, z0 + h - 0.5]], VITRE, 0.6)
      + [-0.5, 0, 0.5].map(k => line([u, vf + 0.009, z0 + h - 0.5], [u + k * (w - 0.02), vf + 0.009, z0 + h + 3.5 - Math.abs(k) * 1.6], 0.5, '#F4EEE4')).join('');
  }
  return out;
}
const fenetresFines = (S, sF) => {
  const { fen, v1, u1 } = S;
  return fen.bas.map(([a, b]) => fenetreF(a, b, v1, ...fen.zBas, sF)).join('') + fen.haut.map(([a, b]) => fenetreF(a, b, v1, ...fen.zHaut, sF)).join('')
    + fenetreD(u1, ...fen.droite, ...fen.zHaut, sF) + fenetreD(u1, ...fen.droite, ...fen.zBas, sF);
};
function ouverturesChibi(S, c) {
  const { u1, v1, fen } = S;
  const bord = ` stroke="${INK_C}" stroke-width="${TRAIT}" stroke-linejoin="round"`;
  const fenG = (ua, ub, z0, z1) => {
    const w = (ub - ua) * 0.42;
    return polyC([[ua, v1, z0], [ub, v1, z0], [ub, v1, z1], [ua, v1, z1]], MAGIC_GLASS)
      + trait(P((ua + ub) / 2, v1, z0), P((ua + ub) / 2, v1, z1), DETAIL) + trait(P(ua, v1, (z0 + z1) / 2), P(ub, v1, (z0 + z1) / 2), DETAIL)
      + polyC([[ua - w, v1, z0], [ua, v1, z0], [ua, v1, z1], [ua - w, v1, z1]], c, DETAIL + 0.4) + polyC([[ub, v1, z0], [ub + w, v1, z0], [ub + w, v1, z1], [ub, v1, z1]], c, DETAIL + 0.4)
      + bloc(ua - 0.02, v1, ub + 0.02, v1 + 0.05, z0 - 2, z0, { top: HIVER ? NEIGE.light : '#E8DCC0', left: '#CDBE9C', right: '#A99876' }, `oc${f2(ua)}${z0}`, DETAIL + 0.4);
  };
  const fenD = (va, vb, z0, z1) => polyC([[u1, va, z0], [u1, vb, z0], [u1, vb, z1], [u1, va, z1]], MAGIC_GLASS) + trait(P(u1, (va + vb) / 2, z0), P(u1, (va + vb) / 2, z1), DETAIL) + trait(P(u1, va, (z0 + z1) / 2), P(u1, vb, (z0 + z1) / 2), DETAIL);
  let out = fen.bas.map(([a, b]) => fenG(a, b, fen.zBas[0] + 1, fen.zBas[1] - 1)).join('') + fen.haut.map(([a, b]) => fenG(a, b, fen.zHaut[0], fen.zHaut[1] - 1)).join('')
    + fenD(...fen.droite, fen.zHaut[0], fen.zHaut[1] - 1) + fenD(...fen.droite, fen.zBas[0] + 1, fen.zBas[1] - 1);
  // porte ronde, planches, ferrures, poignée d'or, marche
  const { u: door } = S.porte, r = 0.14, hd = S.rdc - 1;
  const arc = Array.from({ length: 13 }, (_, k) => { const t = Math.PI - (k / 12) * Math.PI; return P(door + Math.cos(t) * r, v1, hd - r * 32 + Math.sin(t) * r * 32); });
  out += bloc(door - 0.2, v1, door + 0.2, v1 + 0.1, 0, S.socle, { top: HIVER ? NEIGE.light : '#EFE6D2', left: '#DCCFB2', right: '#B3A386' }, 'oc-marche', DETAIL + 0.6)
    + `<polygon points="${[P(door - r, v1, S.socle), ...arc, P(door + r, v1, S.socle)].map(xy).join(' ')}" fill="${c}"${bord}/>`
    + [-0.05, 0.05].map(du => trait(P(door + du, v1, S.socle + 0.5), P(door + du, v1, hd - 3), 0.9, 'rgba(30,10,40,.45)')).join('')
    + [9, 17].map(z => trait(P(door - r + 0.02, v1, z), P(door + r - 0.02, v1, z), 1.6, '#55504A')).join('');
  const [px, py] = P(door + 0.08, v1, 13);
  out += `<circle cx="${f2(px)}" cy="${f2(py)}" r="1.5" fill="#F2C04B" stroke="${INK_C}" stroke-width="0.8"/>`;
  return finesse(out);
}
function ouverturesManoir(S, c) {
  const cadre = '#ECE3D0';
  return fenetresFines(S, { cadre, vitre: VITRE, petitsBois: 'croix', appui: { top: HIVER ? NEIGE.light : '#EEE6D6', left: '#D8CBB0', right: '#B5A68A' } })
    + porteFine(S, { cadre, vantail: c });
}
function ouverturesColombage(S, c) {
  const chene = '#6B4A32', { u0, u1, v1, fen } = S;
  let out = fenetresFines(S, { cadre: chene, bois: '#4A3020', vitre: VITRE, petitsBois: 'losanges', appui: { top: HIVER ? NEIGE.light : '#8A6446', left: chene, right: '#4E3524' }, epaisCadre: 0.02, epaisCadreZ: 1 });
  // jardinières fleuries sous les fenêtres de l'étage (teinte du morceau sur le bois)
  fen.haut.forEach(([a, b], k) => {
    out += boite(a - 0.02, v1, b + 0.02, v1 + 0.05, fen.zHaut[0] - 4.5, fen.zHaut[0] - 2, { top: '#5A3A24', left: mixHex(c, '#8A6446', 0.5), right: mixHex(c, '#4E3524', 0.5) }, 0.7);
    if (!HIVER) for (let u = a + 0.01; u < b + 0.01; u += 0.05) { const [x, y] = P(u, v1 + 0.03, fen.zHaut[0] - 1.6); out += `<circle cx="${f2(x)}" cy="${f2(y - 1)}" r="1.5" fill="${['#E86A8A', '#F2C14E', '#FFFFFF', '#B07AD8'][(k * 3 + Math.round(u * 50)) % 4]}" stroke="${INK}" stroke-width="0.35"/><path d="M${f2(x - 1.5)},${f2(y + 0.4)} q1.5,-1.4 3,0" fill="#5E9446"/>`; }
  });
  void u0; void u1;
  return out + porteFine(S, { cadre: '#7A5A40', vantail: c, cintre: false });
}
function ouverturesEpure(S, c) {
  return fenetresFines(S, { cadre: '#F7F3EC', bois: '#F7F3EC', vitre: VITRE, petitsBois: 'grille', volets: c, appui: { top: HIVER ? NEIGE.light : '#F2ECE0', left: '#DDD3C2', right: '#BEB3A0' }, epaisCadre: 0.015, epaisCadreZ: 0.8 })
    + porteFine(S, { cadre: '#EFE7D8', vantail: mixHex(c, '#1E2A24', 0.35), cintre: false, imposte: true });
}

/* ================= TOIT ================= */
function lucarneFine(S, u, w, t, { toitC, face, cadre }) {
  const { zr, hr, o, v0, v1 } = S, vm = (v0 + v1) / 2, Z = zr + hr, ve = v1 + o;
  const v = vm + (ve - vm) * t, z0 = Z - hr * t, h = 11, hp = 7, e = 0.025;
  const vAt = z => vm + (ve - vm) * ((Z - z) / hr);
  let out = poly([[u + w, v, z0], [u + w, v, z0 + h], [u + w, vAt(z0 + h), z0 + h]], mixHex(face, '#3A2A20', 0.25), 0.8)
    + poly([[u - w, v, z0], [u + w, v, z0], [u + w, v, z0 + h], [u - w, v, z0 + h]], face, 0.9)
    + fenetreF(u - w * 0.62, u + w * 0.62, v, z0 + 1.6, z0 + h - 1.4, { cadre, vitre: VITRE, petitsBois: 'croix', appui: { top: HIVER ? NEIGE.light : '#E9E0CD', left: '#D3C6AA', right: '#B3A486' }, epaisCadre: 0.012, epaisCadreZ: 0.6 })
    + poly([[u - w - e, v + 0.004, z0 + h], [u, v + 0.004, z0 + h + hp], [u + w + e, v + 0.004, z0 + h]], mixHex(face, '#FFFFFF', 0.08), 0.9);
  const zt = z0 + h + hp, vt = vAt(zt), vb = vAt(z0 + h);
  const pan = HIVER ? NEIGE.light : toitC;
  out += poly([[u, v + 0.02, zt], [u - w - e - 0.01, v + 0.02, z0 + h - 0.6], [u - w - e - 0.01, vb, z0 + h - 0.6], [u, vt, zt]], HIVER ? NEIGE.shade : mixHex(toitC, '#1E1830', 0.3), 0.9)
    + poly([[u, v + 0.02, zt], [u + w + e + 0.01, v + 0.02, z0 + h - 0.6], [u + w + e + 0.01, vb, z0 + h - 0.6], [u, vt, zt]], pan, 0.9);
  if (!HIVER) for (let k = 0.3; k < 0.95; k += 0.3) out += line([u + (w + e) * k, v + 0.02, zt - (hp + 0.6) * k], [u + (w + e) * k, vt + (vb - vt) * k, zt - (hp + 0.6) * k], 0.5, 'rgba(20,15,30,.45)');
  const rv = [P(u - w - e - 0.015, v + 0.022, z0 + h - 0.8), P(u, v + 0.022, zt + 0.6), P(u + w + e + 0.015, v + 0.022, z0 + h - 0.8)].map(xy).join(' ');
  return out + `<polyline points="${rv}" fill="none" stroke="${INK}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><polyline points="${rv}" fill="none" stroke="${HIVER ? NEIGE.light : mixHex(toitC, '#000', 0.3)}" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"/>`;
}
// Toit au trait fin : pans couverts (ardoise ou tuile), neige l'hiver, cheminée entre les pans, lucarnes, rives
function toitFinDe(S, c, kind, lucarnes, bois) {
  const { u0, u1, v0, v1, zr, hr, o } = S, vm = (v0 + v1) / 2, Z = zr + hr, ve = v1 + o;
  let out = HIVER
    ? poly([[u0 - o, v0 - o, zr], [u1 + o, v0 - o, zr], [u1 + o, vm, Z], [u0 - o, vm, Z]], NEIGE.shade, 1) + chemineeFine(S)
      + poly([[u0 - o, vm, Z], [u1 + o, vm, Z], [u1 + o, ve, zr], [u0 - o, ve, zr]], NEIGE.light, 1)
      + snowPan(P(u0 - o, vm, Z), P(u1 + o, vm, Z), P(u1 + o, ve, zr), P(u0 - o, ve, zr), 0.75, true)
    : toitFin({ u0, v0, u1, v1, zr, hr, o, couleur: c, kind, seed: kind === 'tuile' ? 5 : 3, entre: chemineeFine(S) });
  out += lucarnes.map(([u, t]) => lucarneFine(S, u, 0.1, t, { toitC: c, face: '#EDE4D2', cadre: '#F1EADC' })).join('');
  return out + rives({ u0, v0, u1, v1, zr, hr, o, bois: HIVER ? '#F2F6FA' : bois, faitiere: HIVER ? '#F2F6FA' : mixHex(c, '#1E1830', 0.3) });
}
function toitChibi(S, c) {
  const { u0, u1, v0, v1, zr, hr, o } = S, vm = (v0 + v1) / 2, Z = zr + hr, ve = v1 + o;
  const roof = { front: c, back: mixHex(c, '#1E1830', 0.28) };
  let out = polyC([[u0 - o, v0 - o, zr], [u1 + o, v0 - o, zr], [u1 + o, vm, Z], [u0 - o, vm, Z]], roof.back)
    + (HIVER ? snowPan(P(u0 - o, vm, Z), P(u1 + o, vm, Z), P(u1 + o, v0 - o, zr), P(u0 - o, v0 - o, zr), 0.85) : '')
    + chemineeChibi(S)
    + polyC([[u0 - o, vm, Z], [u1 + o, vm, Z], [u1 + o, ve, zr], [u0 - o, ve, zr]], roof.front)
    + (HIVER ? snowPan(P(u0 - o, vm, Z), P(u1 + o, vm, Z), P(u1 + o, ve, zr), P(u0 - o, ve, zr), 0.8, true) : '')
    + roofTextureOf(null, 'toit-ardoise', u0, v0, u1, v1, zr, hr, o)
    + lucarneC(u0 + 0.36, 0.11, vm, ve, Z, zr, 0.62, roof) + lucarneC(u1 - 0.34, 0.11, vm, ve, Z, zr, 0.62, roof);
  const r0 = P(u0 - o, vm, Z), r1 = P(u1 + o, vm, Z);
  out += riveGable(u0, v0, u1, v1, zr, hr, o, mixHex(roof.back, INK_C, 0.15)) + trait(r0, r1, 7, INK_C) + trait(r0, r1, 3.6, HIVER ? NEIGE.light : mixHex(roof.back, INK_C, 0.2));
  return finesse(out);
}
const toitManoir = (S, c) => toitFinDe(S, c, 'ardoise', [[S.u0 + 0.36, 0.7], [S.u1 - 0.34, 0.7]], mixHex(c, '#1E1830', 0.45));
const toitColombage = (S, c) => toitFinDe(S, c, 'tuile', [[S.u0 + 0.62, 0.7]], '#5E4130');
const toitEpure = (S, c) => toitFinDe(S, c, 'ardoise', [[(S.u0 + S.u1) / 2, 0.7]], mixHex(c, '#1E1830', 0.4));

/* ================= DÉCOR ================= */
// Laboratoire au trait fin : four (gueule en (0.78, 0.06) : lumière du jeu), alambic riveté, col de cygne, tonneau
function laboFin(S, pierre = false) {
  const [u, v] = S.labo;
  const brique = pierre ? '#D9CDB4' : '#C66B4E';
  const K = { u0: u - 0.26, v0: v - 0.26, u1: u + 0.24, v1: v + 0.22 };
  let out = `<ellipse cx="${f2(P(u + 0.1, v + 0.1, 0)[0])}" cy="${f2(P(u + 0.1, v + 0.1, 0)[1] + 2)}" rx="30" ry="12" fill="rgba(50,40,25,.16)"/>`;
  const opt = { rang: pierre ? 4 : 2.4, long: pierre ? [0.12, 0.2] : [0.07, 0.09] };
  out += poly([[K.u0, K.v1, 0], [K.u1, K.v1, 0], [K.u1, K.v1, 16], [K.u0, K.v1, 16]], brique, 1) + appareil('v', K.v1, K.u0, K.u1, 0, 16, brique, { ...opt, seed: 7 })
    + appareil('u', K.u1, K.v0, K.v1, 0, 16, mixHex(brique, '#3A2010', 0.22), { ...opt, seed: 8 })
    + poly([[K.u0, K.v1, 0], [K.u1, K.v1, 0], [K.u1, K.v1, 16], [K.u0, K.v1, 16]], 'none', 1) + poly([[K.u1, K.v0, 0], [K.u1, K.v1, 0], [K.u1, K.v1, 16], [K.u1, K.v0, 16]], 'none', 1)
    + boite(K.u0 - 0.02, K.v0 - 0.02, K.u1 + 0.02, K.v1 + 0.02, 16, 18, { top: HIVER ? NEIGE.light : '#E3D8C2', left: '#CDBF9F', right: '#A99A7C' }, 0.9);
  const arc = Array.from({ length: 11 }, (_, k) => { const t = Math.PI - (k / 10) * Math.PI; return [u - 0.02 + Math.cos(t) * 0.1, K.v1 + 0.003, 6 + Math.sin(t) * 4]; });
  const [dg, gg] = grad('#FFE6A0', '#C2421E', true);
  out += dg + poly([[u - 0.12, K.v1 + 0.003, 1.5], ...arc, [u + 0.08, K.v1 + 0.003, 1.5]], gg, 0.9);
  out += cylindre(u, v, 18, 31, 0.18, { ...CUIVRE, top: '#B86E3E' }) + anneau(u, v, 22, 0.181, '#7A4024', 1.2) + anneau(u, v, 28, 0.181, '#7A4024', 1.2);
  for (let a = 0.35; a < Math.PI - 0.2; a += 0.38) { const [x, y] = P(u, v, 25); out += `<circle cx="${f2(x - Math.cos(a) * 0.18 * 45.25)}" cy="${f2(y + Math.sin(a) * 0.18 * 22.63)}" r="0.55" fill="#FFE0B8"/>`; }
  const [x, y] = P(u, v, 31), rx = 0.18 * 45.25, h = rx * 0.9;
  const [dd, gd] = grad(CUIVRE.light, CUIVRE.dark);
  out += dd + `<path d="M${f2(x - rx)},${f2(y)} A${f2(rx)},${f2(rx / 2)} 0 0 0 ${f2(x + rx)},${f2(y)} A${f2(rx)},${f2(h)} 0 0 0 ${f2(x - rx)},${f2(y)} Z" fill="${HIVER ? NEIGE.light : gd}" stroke="${INK}" stroke-width="1"/>`
    + `<path d="M${f2(x - rx * 0.55)},${f2(y - h * 0.5)} Q${f2(x - rx * 0.3)},${f2(y - h * 0.85)} ${f2(x + rx * 0.1)},${f2(y - h * 0.92)}" fill="none" stroke="rgba(255,240,215,.75)" stroke-width="1.3" stroke-linecap="round"/>`
    + cylindre(u, v, 31 + h * 0.75, 31 + h * 0.75 + 4, 0.035, { ...CUIVRE, top: '#7A4024' });
  const [bu, bv] = [u + 0.4, v + 0.34];
  out += cylindre(bu, bv, 0, 20, 0.12, { light: '#C99A68', mid: '#A8743F', dark: '#7A4E2C', top: HIVER ? '#DCEBF4' : '#4A6E80' });
  [4, 10, 16].forEach(z => { out += anneau(bu, bv, z, 0.121, '#3A2618', 2.2) + anneau(bu, bv, z, 0.121, '#D98A52', 1); });
  const a = P(u, v, 31 + h * 0.75 + 2), b = P(bu, bv, 21);
  const col = `M${xy(a)} C${f2(a[0] + 20)},${f2(a[1] - 6)} ${f2(b[0] + 14)},${f2(b[1] - 22)} ${f2(b[0] + 1)},${f2(b[1])}`;
  out += `<path d="${col}" stroke="${INK}" stroke-width="4.2" fill="none" stroke-linecap="round"/><path d="${col}" stroke="${CUIVRE.mid}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
  const [fx, fy] = P(bu - 0.2, bv + 0.14, 0);
  out += `<path d="M${f2(fx - 1.4)},${f2(fy - 9)} v3 l-3.4,4.6 q-0.6,1.4 1,1.4 h6.8 q1.6,0 1,-1.4 l-3.4,-4.6 v-3 Z" fill="rgba(220,240,230,.55)" stroke="${INK}" stroke-width="0.8"/>`
    + `<path d="M${f2(fx - 3.6)},${f2(fy - 2.6)} h7.2 q1,0 0.4,1.2 q-0.3,0.4 -0.8,0.4 h-6.4 q-0.5,0 -0.8,-0.4 q-0.6,-1.2 0.4,-1.2 Z" fill="#6FCF8E"/>`;
  return out;
}
function enseigneFine(S, panneau = '#F1E4C6') {
  const [u, z] = S.enseigne, vf = S.v1;
  const a = P(u, vf, z), b = P(u, vf + 0.2, z);
  const [sx, sy] = [b[0] - 1, b[1] + 3];
  return `<path d="M${xy(a)} L${xy(b)}" stroke="${INK}" stroke-width="2" stroke-linecap="round"/><path d="M${xy(a)} L${xy(b)}" stroke="#4A4A50" stroke-width="1" stroke-linecap="round"/>`
    + `<path d="M${f2(a[0])},${f2(a[1] + 6)} C${f2(a[0] - 2)},${f2(a[1] + 1)} ${f2((a[0] + b[0]) / 2)},${f2((a[1] + b[1]) / 2 + 1)} ${f2((a[0] + b[0]) / 2 + 1)},${f2((a[1] + b[1]) / 2 + 3)} q2,2 0,3" fill="none" stroke="#4A4A50" stroke-width="0.9"/>`
    + seg([b[0] - 4, b[1] + 0.5], [sx - 4, sy + 2], 0.5, '#4A4A50') + seg([b[0] + 2, b[1] + 1.5], [sx + 2, sy + 3], 0.5, '#4A4A50')
    + `<path d="M${f2(sx - 7)},${f2(sy + 2)} h12 v8 q-6,4 -12,0 Z" fill="${panneau}" stroke="${INK}" stroke-width="1"/>`
    + `<path d="M${f2(sx - 1.6)},${f2(sy + 3.6)} v1.6 l-2.6,3.4 q-0.4,1 0.8,1 h5.6 q1.2,0 0.8,-1 l-2.6,-3.4 v-1.6 Z" fill="#6FCF8E" stroke="${INK}" stroke-width="0.6"/>`;
}
function dallage(u, v0, v1, c = '#CFC4AE') {
  let out = '';
  for (let v = v0, k = 0; v < v1; v += 0.17, k++) {
    [-0.07, 0.07].forEach((du, j) => {
      const cu = u + du * 1.15 + (rnd(k * 2 + j) - 0.5) * 0.03, cv = v + (rnd(k * 5 + j) - 0.5) * 0.03, s = 0.065 + rnd(k + j * 9) * 0.02;
      const l = [[cu - s, cv - s * 0.8, 0], [cu + s * 0.9, cv - s, 0], [cu + s, cv + s * 0.7, 0], [cu - s * 0.8, cv + s, 0]];
      out += poly(l, HIVER ? NEIGE.light : mixHex(c, rnd(k + j) > 0.5 ? '#FFFFFF' : '#6B5E4A', rnd(k * 3 + j) * 0.18), 0.7);
    });
  }
  return out;
}
const ombreSol = () => { const [x, y] = P(-0.2, -0.15, 0); return `<defs><radialGradient id="mf-osol" cx="0.5" cy="0.5" r="0.5"><stop offset="0.55" stop-color="rgba(50,40,25,.2)"/><stop offset="1" stop-color="rgba(50,40,25,0)"/></radialGradient></defs><ellipse cx="${f2(x + 6)}" cy="${f2(y + 6)}" rx="96" ry="46" fill="url(#mf-osol)"/>`; };
// Fleurs de la couleur du morceau : touffes rondes chibi ou épis fins
const fleurChibi = (u, v, c) => { const [x, y] = P(u, v, 3); return `<ellipse cx="${f2(x + 2.5)}" cy="${f2(y + 2)}" rx="3" ry="1.4" fill="#6DB64C" stroke="${INK_C}" stroke-width="0.8"/>` + (HIVER ? '' : `<circle cx="${f2(x)}" cy="${f2(y)}" r="2.3" fill="${c}" stroke="${INK_C}" stroke-width="0.9"/><circle cx="${f2(x)}" cy="${f2(y)}" r="0.8" fill="#FFD45E"/>`); };
const fleursFines = (u, v, k, c, seed) => (HIVER ? touffe(u, v, k * 0.8, '#9DB59A', seed) : lavande(u, v, k, seed).replace(/#9C82DE|#8A6CCF/g, m => (m === '#9C82DE' ? mixHex(c, '#FFFFFF', 0.15) : c)));
function decorChibi(S, c) {
  let out = disc0(S);
  [[0.04, 0.62, 4], [-0.06, 0.82, 3.6], [0.06, 1.02, 3.8], [-0.04, 1.22, 3.4], [0.04, 1.42, 3.2]].forEach(([u, v, s]) => { out += pierreRonde(u, v, s, { top: '#EFE6D2', left: '#DCCFB2', right: '#B3A386' }); });
  out += laboChibi(...S.labo) + herbesChibi(...S.jardin);
  [[-0.74, 0.62], [-0.6, 0.6], [-0.68, 0.72], [-0.56, 0.71]].forEach(([u, v]) => { out += fleurChibi(u, v, c); });
  const [sx, sy] = P(S.enseigne[0], S.v1 + 0.16, S.enseigne[1] - 1);
  out += trait(P(S.enseigne[0], S.v1, S.enseigne[1] + 1), [sx, sy + 2], 2.2, INK_C)
    + `<rect x="${f2(sx - 6.5)}" y="${f2(sy + 3)}" width="13" height="11" rx="2.5" fill="#F3E4C4" stroke="${INK_C}" stroke-width="${TRAIT}"/>`
    + `<path d="M${f2(sx - 1.2)},${f2(sy + 5.4)} v1.8 l-3,4 h8.4 l-3,-4 v-1.8 Z" fill="#7BD88F" stroke="${INK_C}" stroke-width="0.9" stroke-linejoin="round"/>`;
  return finesse(out);
}
const disc0 = () => { const [x, y] = P(-0.2, -0.1, 0); return `<ellipse cx="${f2(x)}" cy="${f2(y)}" rx="66" ry="33" fill="rgba(120,85,45,.16)"/>`; };
function lierre(u, vf, z0, z1, seed = 5) {
  let out = `<polyline points="${[[u, vf + 0.006, z0], [u + 0.03, vf + 0.006, (z0 + z1) / 2], [u - 0.02, vf + 0.006, z1]].map(p => xy(P(...p))).join(' ')}" fill="none" stroke="#5E4A2E" stroke-width="0.7"/>`;
  for (let i = 0; i < 26; i++) {
    const t = rnd(seed + i), du = (rnd(seed * 3 + i) - 0.5) * 0.16;
    const [x, y] = P(u + du, vf + 0.007, z0 + (z1 - z0) * t);
    out += `<path d="M${f2(x)},${f2(y)} q-2.2,-1.6 -1,-3.2 q1,-0.6 1,0.6 q0,-1.2 1,-0.6 q1.2,1.6 -1,3.2 Z" fill="${HIVER ? '#6E7F66' : ['#4E7F3A', '#5F9445', '#3E6B30', '#76A85A'][i % 4]}" stroke="#2F4A26" stroke-width="0.3"/>`;
  }
  return out;
}
function decorManoir(S, c) {
  const [j0, j1, j2, j3] = S.jardin;
  let out = ombreSol() + dallage(S.porte.u, S.v1 + 0.16, 1.45) + lierre(S.u0 + 0.05, S.v1, S.socle, 20, 9) + enseigneFine(S)
    + boite(j0, j1, j2, j3, 0, 3, { top: HIVER ? NEIGE.light : '#E3DACA', left: '#C9BCA2', right: '#A69880' }, 0.8)
    + poly([[j0 + 0.03, j1 + 0.03, 3], [j2 - 0.03, j1 + 0.03, 3], [j2 - 0.03, j3 - 0.03, 3], [j0 + 0.03, j3 - 0.03, 3]], HIVER ? '#F2F6FA' : '#7A5A40', 0.6);
  [[0.58, 0.62], [0.78, 0.6], [0.66, 0.76], [0.88, 0.74]].forEach(([u, v], k) => { out += fleursFines(u, v, 0.9, c, k + 1); });
  [[-0.7, 0.62], [-0.55, 0.7]].forEach(([u, v], k) => { out += fleursFines(u, v, 0.8, c, k + 7); });
  return out + laboFin(S) + touffe(-1.15, 0.5, 1, '#6A9A50', 2) + touffe(0.3, 1.3, 0.9, '#6A9A50', 4);
}
function decorColombage(S, c) {
  const [j0, j1, j2, j3] = S.jardin;
  let out = ombreSol() + dallage(S.porte.u, S.v1 + 0.16, 1.45, '#CFC6B4') + enseigneFine(S, '#EADBB8')
    + poly([[j0, j1, 0], [j2, j1, 0], [j2, j3, 0], [j0, j3, 0]], HIVER ? '#F2F6FA' : '#7A5A40', 0.6);
  for (let i = 0; i < 12; i++) { const t = i / 12; const [u, v] = t < 0.5 ? [j0 + (j2 - j0) * 2 * t, j3] : [j2, j3 - (t - 0.5) * 2 * (j3 - j1)]; const [x, y] = P(u, v, 0); out += `<ellipse cx="${f2(x)}" cy="${f2(y - 1)}" rx="2.4" ry="1.6" fill="${mixHex('#D8D0BF', '#6B5E4A', rnd(i) * 0.25)}" stroke="${INK}" stroke-width="0.5"/>`; }
  [[0.58, 0.62, '#6A9A50'], [0.8, 0.6, '#8AAE5E'], [0.66, 0.76, '#5E8A48'], [0.88, 0.75, '#7AA060']].forEach(([u, v, g], k) => { out += touffe(u, v, 1.1, HIVER ? '#9DB59A' : g, k + 3); });
  [[0.72, 0.68], [0.9, 0.64], [-0.7, 0.64]].forEach(([u, v], k) => { out += fleursFines(u, v, 0.75, c, k + 4); });
  return out + laboFin(S) + touffe(-1.15, 0.5, 1, '#6A9A50', 2);
}
function decorEpure(S, c) {
  const { u } = S.porte, v1 = S.v1, [j0, j1, j2, j3] = S.jardin;
  let out = ombreSol();
  out += poly([[u - 0.13, v1 + 0.1, 0], [u + 0.13, v1 + 0.1, 0], [u + 0.16, 1.45, 0], [u - 0.16, 1.45, 0]], HIVER ? NEIGE.light : '#E8E0D0', 0.7);
  if (!HIVER) for (let i = 0; i < 40; i++) { const [x, y] = P(u - 0.12 + rnd(i) * 0.26, v1 + 0.14 + rnd(i + 50) * 1.25, 0); out += `<circle cx="${f2(x)}" cy="${f2(y)}" r="0.5" fill="${rnd(i + 9) > 0.5 ? '#C9BFAC' : '#F6F1E6'}"/>`; }
  // plaque ronde en laiton au mur
  { const [x, y] = P(S.enseigne[0] + 0.02, v1 + 0.005, S.enseigne[1] - 1); out += `<circle cx="${f2(x)}" cy="${f2(y)}" r="5" fill="#D9B45A" stroke="${INK}" stroke-width="0.9"/><circle cx="${f2(x)}" cy="${f2(y)}" r="3.8" fill="none" stroke="#A8823A" stroke-width="0.5"/><path d="M${f2(x - 1)},${f2(y - 2.6)} v1.4 l-2,2.8 h6 l-2,-2.8 v-1.4 Z" fill="#3E5A4A"/>`; }
  const buis = (bu, bv, id) => { const [x, y] = P(bu, bv, 0); return `<path d="M${f2(x - 4)},${f2(y - 6)} L${f2(x + 4)},${f2(y - 6)} L${f2(x + 3)},${f2(y)} L${f2(x - 3)},${f2(y)} Z" fill="#C9805A" stroke="${INK}" stroke-width="0.8"/>` + seg([x - 4.2, y - 6], [x + 4.2, y - 6], 1.6, '#B06A48') + `<defs><radialGradient id="${id}" cx="0.35" cy="0.3" r="0.8"><stop offset="0" stop-color="${HIVER ? '#FFFFFF' : '#9CC27E'}"/><stop offset="1" stop-color="${HIVER ? '#B9CFC0' : '#3E6B36'}"/></radialGradient></defs><circle cx="${f2(x)}" cy="${f2(y - 12)}" r="6.4" fill="url(#${id})" stroke="${INK}" stroke-width="0.8"/>`; };
  out += buis(u - 0.24, v1 + 0.12, 'mf-bz1') + buis(u + 0.24, v1 + 0.12, 'mf-bz2');
  out += boite(j0 + 0.02, j1 + 0.04, j2 - 0.02, j3 - 0.04, 0, 6, { top: HIVER ? NEIGE.light : '#7FA866', left: '#5E8A4A', right: '#466E38' }, 0.9);
  if (!HIVER) for (let i = 0; i < 18; i++) { const [x, y] = P(j0 + 0.06 + rnd(i) * (j2 - j0 - 0.12), j1 + 0.08 + rnd(i + 30) * (j3 - j1 - 0.16), 6); out += `<circle cx="${f2(x)}" cy="${f2(y - 0.6)}" r="1.1" fill="${i % 3 ? '#9CC27E' : c}" stroke="${INK}" stroke-width="0.25"/>`; }
  return out + laboFin(S, true);
}

export const PIECES = {
  murs: { chibi: mursChibi, colombage: mursColombage, manoir: mursManoir, epure: mursEpure },
  ouvertures: { chibi: ouverturesChibi, colombage: ouverturesColombage, manoir: ouverturesManoir, epure: ouverturesEpure },
  toit: { chibi: toitChibi, colombage: toitColombage, manoir: toitManoir, epure: toitEpure },
  decor: { chibi: decorChibi, colombage: decorColombage, manoir: decorManoir, epure: decorEpure }
};
// Couleur d'origine de chaque morceau dans chaque style (celle des essais)
export const COULEUR_DE_STYLE = {
  chibi: { murs: 'miel', ouvertures: 'prune', toit: 'violet', decor: 'lavande' },
  colombage: { murs: 'miel', ouvertures: 'prune', toit: 'tuile', decor: 'lavande' },
  manoir: { murs: 'miel', ouvertures: 'prune', toit: 'violet', decor: 'lavande' },
  epure: { murs: 'miel', ouvertures: 'sauge', toit: 'ardoise', decor: 'blanc' }
};
// Un morceau seul : style et couleur (identifiants), dans le squelette S
export function morceau(S, piece, style, couleur) {
  const c = COULEURS[piece][couleur];
  return PIECES[piece][style](S, piece === 'murs' ? c : c.c);
}
// La maison entière : { murs: [style, couleur], ouvertures: [...], toit: [...], decor: [...] }
export const maison = (S, choix) => MORCEAUX.map(p => morceau(S, p, ...choix[p])).join('');
