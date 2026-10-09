// Les accessoires de l'avatar (catalogue : avatar_choix.js), dessinés dans le repère de la troupe (48 × 64). Un seul
// dessin par accessoire : l'avatar et les maîtres le portent pareil (habiller), posé sur les repères de qui le porte.
// Chaque accessoire se dessine dans une ou plusieurs couches de l'image :
//   derriere : derrière le corps (cape, ailes, sac de trois quarts) ;   cou : sur le buste, sous les bras (bretelles, colliers) ;
//   surBras : par-dessus les bras (cape et ailes de dos) ;              tete : par-dessus la tête (chapeaux) ;
//   cheveux : sur les cheveux, sous les chapeaux ;                     joues, oreilles, visage : sur le visage ;
//   main : tenu dans la main droite (troupe.frame, c.hold) ;          dessus : par-dessus le haut (manteau, ciré) ;
//   pieds : le pied de la troupe (c.foot : les bottes, sur le bas de la jambe).
// dessin(c, ctx, cols) : c, le personnage (c.o : les choix ; ses repères : reperes(c)) ; ctx.view : front, se ou ne ;
// cols : les couleurs choisies, en hexadécimal.
// Les tenues de saison changent aussi le personnage lui-même (PORTE) : les manches du manteau ou du ciré, les moufles.
const { OUT, P, E, L, limb, clip, r2, shoe } = require('./troupe');
const { tone, mix } = require('./avatar_choix');

const sx = (d, k) => (k ? d.replace(/(-?\d+\.?\d*),(-?\d+\.?\d*)/g, (m, x, y) => `${r2(+x + k)},${y}`) : d);
const mirror = d => d.replace(/(-?\d+\.?\d*),(-?\d+\.?\d*)/g, (m, x, y) => `${r2(48 - x)},${y}`);
const decale = v => (v === 'se' ? -1.4 : 0); // de trois quarts, ce qui est posé sur la tête glisse vers le côté du regard
// métal : un ton sombre pour le contour intérieur, un reflet clair
const reflet = c => tone(c, 1.45);

// Petites formes communes
const fleurette = (x, y, r, col, coeur = '#F2C04B') => [0, 1, 2, 3, 4].map(i => {
  const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
  return E(x + Math.cos(a) * r, y + Math.sin(a) * r, r * 0.78, r * 0.78, col, 0.55);
}).join('') + E(x, y, r * 0.55, r * 0.55, coeur, 0.5);
const feuille = (x, y, rot, s = 1) => `<g transform="translate(${r2(x)} ${r2(y)}) rotate(${rot}) scale(${s})">${P('M0,0 Q1.3,-1.1 2.8,0 Q1.3,1.1 0,0 Z', '#7EB45A', 0.5)}</g>`;
const etoile = (x, y, r, col, w = 0.6) => {
  const pts = Array.from({ length: 10 }, (_, i) => { const a = (i / 10) * Math.PI * 2 - Math.PI / 2, rr = i % 2 ? r * 0.45 : r; return `${r2(x + Math.cos(a) * rr)},${r2(y + Math.sin(a) * rr)}`; });
  return P(`M${pts.join(' L')} Z`, col, w);
};
const coeur = (x, y, s, col, w = 0.5) => P(`M${r2(x)},${r2(y + s * 0.9)} C${r2(x - s * 1.5)},${r2(y)} ${r2(x - s * 0.9)},${r2(y - s * 1.1)} ${r2(x)},${r2(y - s * 0.35)} C${r2(x + s * 0.9)},${r2(y - s * 1.1)} ${r2(x + s * 1.5)},${r2(y)} ${r2(x)},${r2(y + s * 0.9)} Z`, col, w);
const scintille = (x, y, s, col) => P(`M${r2(x)},${r2(y - s)} Q${r2(x + s * 0.18)},${r2(y - s * 0.18)} ${r2(x + s)},${r2(y)} Q${r2(x + s * 0.18)},${r2(y + s * 0.18)} ${r2(x)},${r2(y + s)} Q${r2(x - s * 0.18)},${r2(y + s * 0.18)} ${r2(x - s)},${r2(y)} Q${r2(x - s * 0.18)},${r2(y - s * 0.18)} ${r2(x)},${r2(y - s)} Z`, col, 0.45);

// ---- les repères du porteur ----
// Chaque dessin se pose sur les repères de qui le porte (l'avatar ou un maître), dans le repère où il est dessiné
// (l'avatar dessine son buste décalé de sa taille, c.dy) : le haut du cou (cou), la demi-largeur aux épaules (e), la
// carrure (sw, hw, b : celle de l'avatar ; pour un maître, d'après ses épaules, ou c.porte), le haut des jambes
// (hanche), l'ourlet d'un manteau (ourlet : au-dessus du genou)
function reperes(c) {
  const [[x0, y0], [x1]] = c.shoulders, dy = c.dy || 0, e = (x1 - x0) / 2;
  const k = c.k || { sw: e + 0.5, hw: e + 2.2, b: 0, ...c.porte };
  const hanche = r2(c.hip - dy);
  return { cou: r2(y0 - dy - 3.2), e, sw: k.sw, hw: k.hw, b: k.b, hanche, ourlet: c.coatHem !== undefined ? c.coatHem : r2(hanche + (c.ground - c.hip) * 0.45) };
}

// ---- la capuche rabattue : la même pour tous (le ciré, le sweat, la pèlerine, les cirés d'Aster et d'Ondin) ----
// De face et de trois quarts, elle dépasse derrière le cou, dans l'ombre (couche de derrière) ; de dos, elle est posée
// pliée sur les épaules, ombrée à droite comme le vêtement. R : les repères ; col, S : la couleur et son ombre
function capucheRabattue(uid, view, R, col, S) {
  const { cou: y, e } = R, a = r2(24 - e + 0.4), b = r2(24 + e - 0.4);
  if (view !== 'ne') return P(`M${a},${r2(y + 0.8)} Q24,${r2(y - 3.8)} ${b},${r2(y + 0.8)} L${b},${r2(y + 3)} L${a},${r2(y + 3)} Z`, S);
  const d = `M${a},${r2(y + 2.2)} Q24,${r2(y + 6.8)} ${b},${r2(y + 2.2)} L${r2(24 + e + 0.6)},${r2(y + 7.8)} Q24,${r2(y + 11.4)} ${r2(24 - e - 0.6)},${r2(y + 7.8)} Z`;
  return P(d, col) + clip(`${uid}cap`, d, `<rect x="27.2" y="${r2(y)}" width="16" height="14" fill="${S}"/>`) + P(d, 'none')
    + P(`M${r2(24 - e + 1.6)},${r2(y + 6.6)} Q24,${r2(y + 9.6)} ${r2(24 + e - 1.6)},${r2(y + 6.6)}`, 'none', 0.7);
}

// ---- tête ----
// Bonnet tricoté ajusté : il coiffe le crâne jusqu'au-dessus des oreilles ; son revers est une bande courbe qui suit le
// front (au-dessus des sourcils) ; côtes de tricot, pompon de la couleur du revers. Le dôme épouse le crâne et le pompon
// reste petit : tout reste dans le cadre, même sur un grand avatar, au rebond de la marche (verif_avatar.mjs). Chez un
// maître, les mèches du dessus se rangent dessous (crochet c.coiffe) ; la frange dépasse
function bonnet(c, { view }, [col, revers]) {
  const k = view === 'se' ? -0.8 : 0, X = x => r2(x + k);
  const dome = `M${X(10.4)},15.6 Q${X(9.8)},5.6 ${X(24)},5.4 Q${X(38.2)},5.6 ${X(37.6)},15.6 Z`;
  const rim = `M${X(10)},12.8 Q${X(24)},15.4 ${X(38)},12.8 L${X(37.8)},16.8 Q${X(24)},19.2 ${X(10.2)},16.8 Z`;
  const cotes = [-11, -6.6, -2.2, 2.2, 6.6, 11].map(d => `<path d="M${X(24 + d * 0.55)},6 Q${X(24 + d * 1.05)},9.2 ${X(24 + d * 1.1)},15.4" fill="none" stroke="${tone(col, 0.8)}" stroke-width="0.6"/>`).join('');
  const mailles = [-12, -8, -4, 0, 4, 8, 12].map(d => L([24 + d + k, 13.6 + (Math.abs(d) < 6 ? 1 : 0.4) - Math.abs(d) * 0.05], [24 + d * 1.01 + k, 16.4 + (Math.abs(d) < 6 ? 1.1 : 0.4) - Math.abs(d) * 0.05], tone(revers, 0.84), 0.5)).join('');
  return P(dome, col) + clip(`${c.uid}bn${view}`, dome, cotes + `<rect x="${X(27.6)}" y="2" width="12" height="15" fill="${tone(col, 0.86)}" opacity="0.7"/>`) + P(dome, 'none')
    + P(rim, revers) + clip(`${c.uid}rv${view}`, rim, mailles) + P(rim, 'none')
    + E(X(24), 5.7, 2.3, 1.55, revers, 0.85) + E(X(23.4), 5.2, 0.8, 0.55, '#FFFFFF', 0);
}
// Cache-oreilles [pompons, arceau] : l'arceau posé sur les cheveux (couche « cheveux » ; chez Rivet, sous la sangle de
// ses loupes), puis les pompons de fourrure sur les oreilles (couche « tete »)
function arceau(c, { view }, [, col]) {
  const d = view === 'se' ? 'M13.4,20.4 Q12.6,8.6 24.2,8.2 Q36.2,8.6 35.8,20.4' : 'M12.6,20.4 Q12,7.6 24,7.4 Q36,7.6 35.4,20.4';
  return `<path d="${d}" fill="none" stroke="${OUT}" stroke-width="2.6" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${col}" stroke-width="1.2" stroke-linecap="round"/>`;
}
function cacheOreilles(c, { view }, [col]) {
  const muffs = view === 'se' ? [[35.4, 22.6]] : view === 'ne' ? [[12.2, 22.6], [35.8, 22.6]] : [[11.8, 22.6], [36.2, 22.6]];
  return muffs.map(([x, y]) => E(x, y, 2.7, 3.1, col) + P(`M${r2(x - 1.7)},${r2(y + 1.3)} Q${x},${r2(y + 2.6)} ${r2(x + 1.7)},${r2(y + 1.3)}`, 'none', 0.5).replace(`stroke="${OUT}"`, `stroke="${tone(col, 0.82)}"`)
    + E(x - 0.7, y - 1.2, 0.9, 0.8, '#FFFFFF', 0)).join('');
}
function paille(c, { view }, [col]) {
  const k = decale(view);
  const crown = sx('M15.6,13.4 Q15.8,5.2 24,5 Q32.2,5.2 32.4,13.4 Z', k);
  return E(24 + k, 13.6, view === 'ne' ? 15.4 : 16.4, 3.4, '#F2D27E') + P(crown, '#E8C46A') + `<rect x="${r2(15.6 + k)}" y="10.6" width="16.8" height="2.2" fill="${col}"/>`
    + P(crown, 'none') + L([17.2 + k, 8], [21 + k, 6.4], '#FFF0B8', 0.9);
}
function casquette(c, { view }, [col]) {
  const k = decale(view);
  const dome = sx('M11.6,15.6 Q11.4,5.6 24,5.4 Q36.6,5.6 36.4,15.6 Z', k);
  const visor = view === 'ne' ? '' : view === 'se' ? P('M9,15.6 Q8.4,12.6 16,13.6 L22,15.6 Q15,17.4 9,15.6 Z', tone(col, 0.8)) : P('M15,15.4 Q24,12.6 33,15.4 Q24,19 15,15.4 Z', tone(col, 0.8));
  return P(dome, col) + P(sx('M23.4,5.6 L23.4,15.4', k), 'none', 0.5) + E(24 + k, 5.6, 1.1, 0.8, tone(col, 0.8), 0.6) + visor;
}
function bandana(c, { view }, [col]) {
  const ne = view === 'ne', k = decale(view);
  const d = ne ? 'M11.2,17.6 Q10.8,6 24,5.8 Q37.2,6 36.8,17.6 Q24,14.4 11.2,17.6 Z' : sx('M11.6,16.4 Q11.4,6.2 24,6 Q36.6,6.2 36.4,16.4 Q24,13 11.6,16.4 Z', k);
  let s = P(d, col) + clip(`${c.uid}bd${view}`, d, [[16, 9], [21, 7.4], [27, 8], [31.6, 10.6], [19, 12.6], [28.6, 12.6]].map(([x, y]) => E(x + k, y, 0.7, 0.7, '#FFF4E0', 0)).join('')) + P(d, 'none');
  if (ne) s += P('M23,16.4 Q21.4,19.6 21.8,22.6 Q23,21.6 23.8,22.2 Q23.4,19.4 24.4,16.6 Z', tone(col, 0.85), 0.8)
    + P('M25,16.4 Q27.4,19 27.6,22 Q26.4,21.2 25.6,21.8 Q25.4,19.2 23.8,16.8 Z', tone(col, 0.85), 0.8) + E(24, 16.4, 1.8, 1.3, col, 0.8);
  return s;
}
// Couronne de fleurs : un tour de tête, des fleurettes et des feuilles
function couronneFleurs(c, { view }, [col]) {
  const k = decale(view);
  const pts = view === 'ne'
    ? [[12.6, 15.6], [15.8, 12.6], [19.8, 11.2], [24, 10.8], [28.2, 11.2], [32.2, 12.6], [35.4, 15.6]]
    : [[12.8, 14.6], [16, 11.8], [20, 10.6], [24, 10.2], [28, 10.6], [32, 11.8], [35.2, 14.6]];
  const alt = mix(col, '#FFFFFF', 0.55);
  let s = P(sx(view === 'ne' ? 'M12.6,15.6 Q24,8.6 35.4,15.6' : 'M12.8,14.6 Q24,8 35.2,14.6', k), 'none', 0) + pts.slice(0, -1).map(([x, y], i) => feuille(x + k + 1.4, y - 0.4, i % 2 ? -30 : 20, 0.9)).join('');
  s += pts.map(([x, y], i) => fleurette(x + k, y, i % 2 ? 1.05 : 1.25, i % 2 ? alt : col)).join('');
  return s;
}
function beret(c, { view }, [col]) {
  const k = decale(view);
  const d = view === 'ne' ? 'M11.8,13.4 Q10.6,6.4 22.4,5 Q34.6,4.4 37.6,9.6 Q38.4,12.6 35.6,13.2 Q24,10.6 11.8,13.4 Z'
    : sx('M12.4,12.2 Q11,6 22.4,4.8 Q34,4.2 37.6,8.8 Q38.6,11.6 35.4,12.2 Q24,10 12.4,12.2 Z', k);
  return P(d, col) + clip(`${c.uid}br${view}`, d, `<path d="${sx('M8,10 Q24,7.6 42,10 L42,16 L8,16 Z', k)}" fill="${tone(col, 0.82)}"/>`) + P(d, 'none')
    + P(sx('M24.2,5.2 L24.5,4.4 L25.6,4.5', k), 'none', 1.1) + L([16 + k, 7.6], [21 + k, 6], tone(col, 1.3), 1);
}
function oreillesChat(c, { view }, [col]) {
  const k = decale(view), ne = view === 'ne';
  const band = sx('M12.4,15.6 Q11.8,7.4 24,7 Q36.2,7.4 35.6,15.6', k);
  const ear = sx('M14.4,10.8 L13.6,4.4 L19.8,7.8 Z', k), inner = sx('M15,9.8 L14.5,6 L18.2,8 Z', k);
  const earR = sx(mirror('M14.4,10.8 L13.6,4.4 L19.8,7.8 Z'), k), innerR = sx(mirror('M15,9.8 L14.5,6 L18.2,8 Z'), k);
  return `<path d="${band}" fill="none" stroke="${OUT}" stroke-width="3" stroke-linecap="round"/><path d="${band}" fill="none" stroke="${col}" stroke-width="1.6" stroke-linecap="round"/>`
    + P(ear, col) + P(earR, col) + (ne ? '' : P(inner, '#F4A8B8', 0) + P(innerR, '#F4A8B8', 0));
}
function oreillesLapin(c, { view }, [col]) {
  const k = decale(view), ne = view === 'ne';
  const band = sx('M12.4,15.6 Q11.8,7.4 24,7 Q36.2,7.4 35.6,15.6', k);
  // une oreille droite, l'autre pliée : elles restent dans le cadre même en grande taille
  const left = sx('M16.2,9.4 Q14.2,5.2 15.6,3.4 Q17.6,2.4 19.2,4.6 Q20.2,6.8 19.4,8.8 Z', k);
  const right = sx('M28.6,8.6 Q29,4.6 31.6,3.8 Q34.2,3.6 36.4,5.8 Q36.8,7.4 35,7.2 Q32.6,6.4 31.4,9.2 Z', k);
  const pink = '#F4A8B8';
  return `<path d="${band}" fill="none" stroke="${OUT}" stroke-width="3" stroke-linecap="round"/><path d="${band}" fill="none" stroke="${col}" stroke-width="1.6" stroke-linecap="round"/>`
    + '<g transform="translate(0 1.8)">' + P(left, col) + P(right, col)
    + (ne ? '' : P(sx('M16.8,8.4 Q15.6,5.4 16.4,4.4 Q17.6,4 18.4,5.4 Q18.8,7 18.4,8.2 Z', k), pink, 0) + P(sx('M30.2,7.6 Q30.6,5.4 32,4.9 Q33.8,4.8 35.2,6 Q33,5.6 31.6,7.8 Z', k), pink, 0)) + '</g>';
}
function diademe(c, { view }, [col]) {
  const k = decale(view);
  if (view === 'ne') return `<path d="M13.6,12.6 Q24,8.4 34.4,12.6" fill="none" stroke="${OUT}" stroke-width="2.6" stroke-linecap="round"/><path d="M13.6,12.6 Q24,8.4 34.4,12.6" fill="none" stroke="${col}" stroke-width="1.2" stroke-linecap="round"/>`;
  const d = sx('M15.4,11.6 Q24,8.6 32.6,11.6 L31.4,8.8 L28.4,9.6 L26.2,6.6 L24,4.8 L21.8,6.6 L19.6,9.6 L16.6,8.8 Z', k);
  return P(d, col, 0.9) + P(sx('M16.4,10.6 Q24,8 31.6,10.6', k), 'none', 0.45) + E(24 + k, 8.2, 1.1, 1.3, '#E8879C', 0.6) + E(23.7 + k, 7.8, 0.35, 0.4, '#FFFFFF', 0)
    + E(19.8 + k, 9.6, 0.55, 0.55, '#8EC5E8', 0.4) + E(28.2 + k, 9.6, 0.55, 0.55, '#8EC5E8', 0.4) + L([20.6 + k, 8.2], [22.6 + k, 6.4], reflet(col), 0.6);
}

// ---- dans les cheveux : sur le côté, au-dessus de la tempe ----
const PIN = { front: [15.4, 10.6], se: [14.6, 11], ne: [32.6, 11.6] };
function noeud(c, { view }, [col]) {
  const [x, y] = PIN[view], d = tone(col, 0.82);
  return P(`M${x},${y} Q${r2(x - 4.4)},${r2(y - 3.6)} ${r2(x - 4.4)},${r2(y + 0.2)} Q${r2(x - 3.8)},${r2(y + 2.8)} ${x},${y} Z`, col, 0.8)
    + P(`M${x},${y} Q${r2(x + 4.4)},${r2(y - 3.6)} ${r2(x + 4.4)},${r2(y + 0.2)} Q${r2(x + 3.8)},${r2(y + 2.8)} ${x},${y} Z`, col, 0.8)
    + P(`M${r2(x - 0.6)},${r2(y + 0.6)} L${r2(x - 1.8)},${r2(y + 3.8)} L${r2(x - 0.4)},${r2(y + 3.2)} Z M${r2(x + 0.6)},${r2(y + 0.6)} L${r2(x + 1.8)},${r2(y + 3.8)} L${r2(x + 0.4)},${r2(y + 3.2)} Z`, d, 0.6)
    + E(x, y, 1.15, 1.25, d, 0.7) + L([x - 3.2, y - 1], [x - 1.8, y - 1.6], tone(col, 1.35), 0.6);
}
function barrettes(c, { view }, [col]) {
  const [x, y] = PIN[view];
  const one = (dx, dy) => `<rect x="${r2(x + dx - 2.2)}" y="${r2(y + dy - 0.65)}" width="4.4" height="1.3" rx="0.65" fill="${col}" stroke="${OUT}" stroke-width="0.6" transform="rotate(-28 ${r2(x + dx)} ${r2(y + dy)})"/>`;
  return one(-0.4, -0.8) + one(1.4, 1.6);
}
function fleur(c, { view }, [col]) {
  const [x, y] = PIN[view];
  return feuille(x + 1, y + 1.2, 30) + feuille(x - 1, y + 1.4, 150) + fleurette(x, y, 1.6, col);
}
function etoileCheveux(c, { view }, [col]) {
  const [x, y] = PIN[view];
  return etoile(x, y, 2.4, col, 0.65) + L([x - 0.6, y - 1.2], [x - 0.1, y - 1.8], reflet(col), 0.5);
}

// ---- lunettes ----
const VERRES = { front: [[19.4, 22.8], [28.6, 22.8]], se: [[17.2, 22.8], [25.4, 22.8]] };
const branches = (view, col) => (view === 'se' ? P('M27.9,22.2 L34.4,21.4', 'none', 0.8) : P('M16.3,22.2 L12.2,21.6 M31.7,22.2 L35.8,21.6', 'none', 0.8))
  .replace(`stroke="${OUT}"`, `stroke="${col}"`);
const deDos = col => P('M11.6,21.4 L14.6,21.8 M36.4,21.4 L33.4,21.8', 'none', 0.8).replace(`stroke="${OUT}"`, `stroke="${col}"`);
function lunettes(forme) {
  return (c, { view }, [col]) => {
    if (view === 'ne') return deDos(forme === 'rondes' ? col : tone(col, 0.7));
    const [[x1, y], [x2]] = VERRES[view];
    const se = view === 'se', f = se ? 0.86 : 1; // le verre du fond est plus étroit
    const frame = forme === 'rondes' ? col : tone(col, 0.9);
    const glass = forme === 'soleil' ? `fill="${tone(col, 0.45)}" fill-opacity="0.9"` : forme === 'coeur' ? `fill="${mix(col, '#FFFFFF', 0.3)}" fill-opacity="0.55"` : 'fill="rgba(200,230,255,.25)"';
    const lens = (x, w) => {
      if (forme === 'rondes' || forme === 'soleil') return `<circle cx="${x}" cy="${y}" r="${r2(3.1 * w)}" ${glass} stroke="${frame}" stroke-width="${forme === 'soleil' ? 1 : 0.9}"/>`;
      if (forme === 'carrees') return `<rect x="${r2(x - 3.2 * w)}" y="${r2(y - 2.4)}" width="${r2(6.4 * w)}" height="4.8" rx="1.1" ${glass} stroke="${frame}" stroke-width="1"/>`;
      if (forme === 'papillon') {
        const o = x < 24 - (se ? 1.4 : 0) ? -1 : 1; // le coin extérieur remonte
        return `<path d="M${r2(x - 3.2 * w * o)},${r2(y - 1.2)} Q${x},${r2(y - 2.6)} ${r2(x + 3.4 * w * o)},${r2(y - 2.8)} Q${r2(x + 3 * w * o)},${r2(y + 2.6)} ${x},${r2(y + 2.4)} Q${r2(x - 3 * w * o)},${r2(y + 2.2)} ${r2(x - 3.2 * w * o)},${r2(y - 1.2)} Z" ${glass} stroke="${frame}" stroke-width="1"/>`;
      }
      return coeur(x, y + 0.2, 3 * w, mix(col, '#FFFFFF', 0.3), 1).replace(`fill="${mix(col, '#FFFFFF', 0.3)}"`, glass).replace(`stroke="${OUT}"`, `stroke="${frame}"`);
    };
    let s = lens(x1, 1) + lens(x2, f) + P(se ? 'M20.1,22.4 Q21.2,21.6 22.9,22.4' : 'M22.5,22.4 Q24,21.4 25.5,22.4', 'none', 0.8).replace(`stroke="${OUT}"`, `stroke="${frame}"`) + branches(view, frame);
    if (forme === 'soleil') s += L([x1 - 1.4, y - 1.2], [x1 - 0.4, y - 2], '#FFFFFF', 0.7) + L([x2 - 1.2, y - 1.2], [x2 - 0.4, y - 1.8], '#FFFFFF', 0.6);
    return s;
  };
}

// ---- sur les joues ----
const JOUES = { front: [[16.4, 26.4], [31.6, 26.4]], se: [[15.2, 26.4], [28.2, 26.4]] };
function coeurs(c, { view }, [col]) { return view === 'ne' ? '' : JOUES[view].map(([x, y], i) => coeur(x, y, i && view === 'se' ? 0.75 : 0.9, col, 0.45)).join(''); }
function etoilesJoues(c, { view }, [col]) { return view === 'ne' ? '' : JOUES[view].map(([x, y], i) => scintille(x, y, i && view === 'se' ? 1.1 : 1.35, col)).join(''); }
function pansement(c, { view }, [col]) {
  if (view === 'ne') return '';
  const [x, y] = view === 'se' ? [15.6, 25.6] : [31, 25.4];
  return `<g transform="rotate(-24 ${x} ${y})"><rect x="${r2(x - 2.4)}" y="${r2(y - 0.95)}" width="4.8" height="1.9" rx="0.9" fill="${col}" stroke="${OUT}" stroke-width="0.6"/>`
    + `<rect x="${r2(x - 0.8)}" y="${r2(y - 0.75)}" width="1.6" height="1.5" rx="0.3" fill="${tone(col, 0.88)}"/>`
    + [-1.7, 1.5].map(d => E(x + d, y - 0.25, 0.16, 0.16, tone(col, 0.7), 0) + E(x + d + 0.2, y + 0.35, 0.16, 0.16, tone(col, 0.7), 0)).join('') + '</g>';
}

// ---- oreilles : au lobe, quand l'oreille se voit ----
const LOBES = { front: [[11.8, 24.6], [36.2, 24.6]], se: [[35.1, 25]] };
function boucles(forme) {
  return (c, { view }, [col]) => {
    if (view === 'ne' || !c.oreillesVisibles) return '';
    return LOBES[view].map(([x, y]) => {
      if (forme === 'puces') return E(x, y, 0.75, 0.75, col, 0.5) + E(x - 0.25, y - 0.25, 0.22, 0.22, reflet(col), 0);
      if (forme === 'anneaux') return `<circle cx="${x}" cy="${r2(y + 1)}" r="1.25" fill="none" stroke="${OUT}" stroke-width="1.3"/><circle cx="${x}" cy="${r2(y + 1)}" r="1.25" fill="none" stroke="${col}" stroke-width="0.6"/>`;
      return L([x, y], [x, y + 1.6], OUT, 0.5) + etoile(x, y + 2.8, 1.35, col, 0.5);
    }).join('');
  };
}

// ---- cou ----
const milieu = v => (v === 'se' ? 21.6 : 24);
function foulard(c, { view }, [col]) {
  if (view === 'ne') return P('M16.8,31 Q24,34.4 31.2,31 L31.6,33.6 Q24,37 16.4,33.6 Z', col);
  const kx = view === 'se' ? 18.6 : 20.8;
  return P('M16.8,31 Q24,34.6 31.2,31 L31.6,33.6 Q24,37.4 16.4,33.6 Z', col) + P(`M${kx},35 L${kx - 1.6},40.4 L${kx + 1.4},39.8 L${kx + 1.6},35.6 Z`, col) + E(kx + 0.6, 35.4, 1.7, 1.3, tone(col, 0.8), 0.9);
}
// Grosse écharpe tricotée, rayée, au cou ; un pan qui tombe devant (de dos : dans le dos), frangé ; un nœud sous le menton
function echarpe(c, { view }, [col, raie]) {
  const y = reperes(c).cou, uid = c.uid, Y = d => r2(y + d);
  const band = `M15.2,${Y(-0.4)} Q24,${Y(4.6)} 32.8,${Y(-0.4)} L33.6,${Y(3.2)} Q24,${Y(9)} 14.4,${Y(3.2)} Z`;
  const rayures = (id, d) => clip(id, d, [0, 1, 2, 3, 4, 5].map(i => `<rect x="${8 + i * 6}" y="${Y(-10)}" width="2.6" height="30" fill="${raie}" transform="rotate(20 24 ${Y(5)})"/>`).join(''));
  let s = '';
  if (view === 'ne') {
    const pan = `M28,${Y(3.4)} L31.2,${Y(2.8)} L32.6,${Y(13)} L29.2,${Y(13.4)} Z`;
    s += P(band, col) + rayures(`${uid}e${view}`, band) + P(band, 'none');
    return s + P(pan, col) + clip(`${uid}p${view}`, pan, [6, 9.4].map(d => `<rect x="27" y="${Y(d)}" width="7" height="1.5" fill="${raie}"/>`).join('')) + P(pan, 'none')
      + [0.7, 1.6, 2.5].map(d => L([29.4 + d, y + 13.4], [29.5 + d, y + 14.8], col, 0.6)).join('');
  }
  const ex = view === 'se' ? 24.6 : 27.4;
  const pan = `M${ex},${Y(3.6)} L${r2(ex + 3)},${Y(3.2)} L${r2(ex + 3.6)},${Y(13.4)} L${r2(ex + 0.2)},${Y(13.8)} Z`;
  s += P(pan, col) + clip(`${uid}p${view}`, pan, [6.2, 9.6].map(d => `<rect x="${r2(ex - 1)}" y="${Y(d)}" width="7" height="1.5" fill="${raie}"/>`).join('')) + P(pan, 'none')
    + [0.7, 1.6, 2.5].map(d => L([ex + d, y + 13.8], [ex + d + 0.1, y + 15.2], col, 0.6)).join('');
  s += P(band, col) + rayures(`${uid}e${view}`, band) + P(band, 'none');
  return s + E(view === 'se' ? 22.4 : 24.6, y + 4, 2.4, 1.7, tone(col, 0.9), 0.9);
}
function perles(c, { view }, [col]) {
  if (view === 'ne') return '';
  const o = milieu(view), perle = mix(col, '#FFFFFF', 0.62);
  return Array.from({ length: 9 }, (_, i) => {
    const t = i / 8, x = (1 - t) ** 2 * (o - 6.4) + 2 * t * (1 - t) * o + t * t * (o + 6.4), y = (1 - t) ** 2 * 31.6 + 2 * t * (1 - t) * 38.4 + t * t * 31.6;
    return E(x, y, 0.78, 0.78, perle, 0.45) + E(x - 0.25, y - 0.25, 0.22, 0.22, '#FFFFFF', 0);
  }).join('');
}
function coquillage(c, { view }, [col]) {
  if (view === 'ne') return '';
  const o = milieu(view), y = 37.6;
  const shell = `M${o},${r2(y + 2.4)} L${r2(o - 2.2)},${r2(y - 0.4)} Q${o},${r2(y - 2.6)} ${r2(o + 2.2)},${r2(y - 0.4)} Z`;
  return P(`M${o - 6},31.4 Q${o},37.8 ${o + 6},31.4`, 'none', 0.5) + P(shell, col, 0.6) + [-1.1, 0, 1.1].map(d => L([o, y + 2.1], [o + d * 1.4, y - 1.1], tone(col, 0.7), 0.4)).join('');
}
function papillon(c, { view }, [col]) {
  if (view === 'ne') return '';
  const o = milieu(view), y = 32.8;
  return P(`M${o},${y} L${r2(o - 3.2)},${r2(y - 1.8)} L${r2(o - 3.2)},${r2(y + 1.8)} Z M${o},${y} L${r2(o + 3.2)},${r2(y - 1.8)} L${r2(o + 3.2)},${r2(y + 1.8)} Z`, col, 0.7)
    + E(o, y, 0.95, 1.05, tone(col, 0.8), 0.6);
}

// ---- dos ----
function sacDos(c, ctx, [col]) {
  const { view } = ctx, { sw } = c.k, d = tone(col, 0.8);
  if (ctx.couche === 'derriere') {
    if (view !== 'se') return '';
    const bag = 'M28.4,33.2 Q28.6,31.6 31,31.6 L36.6,31.8 Q38.6,32 38.6,34.4 L38.4,44.6 Q38.2,46 36.4,46 L30.4,46 Q28.4,46 28.4,44 Z';
    return P(bag, col) + P('M31,37.4 L38.4,37.6', 'none', 0.6);
  }
  if (view === 'ne') {
    const bag = 'M17.4,35 Q17.4,32.8 20,32.8 L28,32.8 Q30.6,32.8 30.6,35 L30.4,45 Q30.4,46.8 28.4,46.8 L19.6,46.8 Q17.6,46.8 17.6,45 Z';
    return limb([24 - sw + 2.2, 31.6], [19, 34], 1.5, d) + limb([24 + sw - 2.2, 31.6], [29, 34], 1.5, d)
      + P(bag, col) + P('M17.6,38 Q24,40.6 30.4,38 L30.4,35 Q30.6,32.8 28,32.8 L20,32.8 Q17.4,32.8 17.4,35 Z', d, 0.9)
      + `<rect x="22.6" y="38.4" width="2.8" height="2.2" rx="0.5" fill="#E8C46A" stroke="${OUT}" stroke-width="0.6"/>`
      + P('M19.8,42 L28.2,42 L28,45.4 L20,45.4 Z', 'none', 0.6);
  }
  return limb([24 - sw + 2.4, 31.4], [24 - sw + 2.8, 40.6], 1.5, d) + limb([24 + sw - 2.4, 31.4], [24 + sw - 2.8 + (view === 'se' ? -1 : 0), 40.6], 1.5, d);
}
function besace(c, ctx, [col]) {
  const { view } = ctx, { sw, hw } = c.k, d = tone(col, 0.8);
  if (ctx.couche === 'derriere') return '';
  const strap = view === 'ne' ? [[24 - sw + 1.6, 31.8], [24 + hw - 1.4, 44.2]] : [[24 + sw - 1.6, 31.8], [24 - hw + 1.8, 44.2]];
  const bx = view === 'ne' ? 24 + hw - 1.2 : 24 - hw + 1.6;
  const bag = `M${r2(bx - 3.6)},42.6 L${r2(bx + 3.6)},42.6 L${r2(bx + 3.4)},48 Q${bx},48.8 ${r2(bx - 3.4)},48 Z`;
  return limb(strap[0], strap[1], 1.3, d) + P(bag, col) + P(`M${r2(bx - 3.6)},42.6 L${r2(bx + 3.6)},42.6 L${r2(bx + 3.5)},45.2 Q${bx},46.4 ${r2(bx - 3.5)},45.2 Z`, d, 0.8)
    + E(bx, 45.4, 0.6, 0.6, '#E8C46A', 0.5);
}
function cape(c, ctx, [col]) {
  const { view } = ctx, { sw, hw } = c.k, d = tone(col, 0.8);
  if (ctx.couche === 'derriere' && view !== 'ne') {
    const p = `M${r2(24 - sw - 0.6)},31.4 Q24,29.6 ${r2(24 + sw + 0.6)},31.4 L${r2(24 + hw + 4.2)},52.6 Q24,54.6 ${r2(24 - hw - 4.2)},52.6 Z`;
    return P(p, col) + clip(`${c.uid}cp${view}`, p, `<rect x="0" y="28" width="48" height="30" fill="${d}" opacity="0.55"/>`) + P(p, 'none');
  }
  if (ctx.couche === 'cou' && view !== 'ne') {
    const o = milieu(view);
    return P(`M${r2(o - 5.4)},31 Q${o},33.4 ${r2(o + 5.4)},31`, 'none', 1.6).replace(`stroke="${OUT}"`, `stroke="${d}"`) + E(o, 32.6, 1.1, 1.1, '#E8C46A', 0.6);
  }
  if (ctx.couche === 'surBras' && view === 'ne') {
    const p = `M${r2(24 - sw - 1.2)},31.2 Q24,29.2 ${r2(24 + sw + 1.2)},31.2 Q${r2(24 + sw + 3.4)},34 ${r2(24 + hw + 4.4)},52.6 Q24,54.8 ${r2(24 - hw - 4.4)},52.6 Q${r2(24 - sw - 3.4)},34 ${r2(24 - sw - 1.2)},31.2 Z`;
    return P(p, col) + clip(`${c.uid}cq${view}`, p, [-5, 0, 5].map(x => L([24 + x * 0.5, 36], [24 + x, 53], d, 0.7)).join('') + `<rect x="27" y="28" width="20" height="30" fill="${d}" opacity="0.35"/>`) + P(p, 'none');
  }
  return '';
}
function ailes(c, ctx, [col]) {
  const { view } = ctx, light = mix(col, '#FFFFFF', 0.45);
  const wing = 'M19.6,36.4 Q10.6,26.6 6.2,31.4 Q4.4,36.6 10.6,38.6 Q8.2,43.6 13.6,44.6 Q17.6,42.4 19.8,38.6 Z';
  const veins = 'M18.6,37 Q12,32 7.6,32.6 M18.6,37.6 Q13.4,39 11,38.6 M18.8,38.2 Q16,41.6 14,43.6';
  const one = (d, v, id) => P(d, col) + clip(id, d, `<path d="${v}" fill="none" stroke="${light}" stroke-width="0.9"/>`) + P(d, 'none');
  if (ctx.couche === 'derriere' && view !== 'ne') return one(wing, veins, `${c.uid}wl${view}`) + one(mirror(wing), mirror(veins), `${c.uid}wr${view}`);
  if (ctx.couche === 'surBras' && view === 'ne') {
    const w2 = 'M22.4,36 Q12.6,25 7,30.6 Q4.8,36.4 11.4,38.8 Q9,44.4 14.8,45.2 Q19.4,42.6 22.6,38.4 Z';
    const v2 = 'M21.4,36.6 Q13.6,31.4 8.4,32 M21.4,37.4 Q14.6,39 11.8,38.8 M21.6,38 Q17.6,42 15.2,44.2';
    return one(w2, v2, `${c.uid}wl${view}`) + one(mirror(w2), mirror(v2), `${c.uid}wr${view}`) + E(24, 37, 1.6, 1.4, tone(col, 0.8), 0.7);
  }
  return '';
}

// ---- à la main (main droite, sous le poing) ----
function peluche(c, ctx, [col], h) {
  const [x, y] = [h[0] + 0.6, h[1] + 3.6], d = tone(col, 0.82);
  return E(x, y + 2.6, 2.4, 2.6, col) + E(x - 1.9, y - 2.4, 1, 1, col, 0.8) + E(x + 1.9, y - 2.4, 1, 1, col, 0.8) + E(x, y - 0.6, 2.7, 2.4, col)
    + E(x, y + 0.2, 1.1, 0.8, mix(col, '#FFFFFF', 0.5), 0.5) + E(x, y - 0.1, 0.4, 0.3, OUT, 0) + E(x - 0.9, y - 1.2, 0.32, 0.36, OUT, 0) + E(x + 0.9, y - 1.2, 0.32, 0.36, OUT, 0)
    + E(x - 1.9, y + 3.6, 0.9, 0.7, d, 0.6) + E(x + 1.9, y + 3.6, 0.9, 0.7, d, 0.6);
}
function panier(c, ctx, [col], h) {
  const [x, y] = [h[0], h[1] + 4.6];
  const basket = `M${r2(x - 4)},${y} L${r2(x + 4)},${y} L${r2(x + 3.2)},${r2(y + 4.4)} Q${x},${r2(y + 5.2)} ${r2(x - 3.2)},${r2(y + 4.4)} Z`;
  return P(`M${r2(x - 3.4)},${r2(y + 0.2)} Q${x},${r2(y - 6.6)} ${r2(x + 3.4)},${r2(y + 0.2)}`, 'none', 1.6).replace(`stroke="${OUT}"`, 'stroke="#8A5A30"')
    + fleurette(x - 2, y - 0.6, 1.05, col) + fleurette(x + 1.6, y - 0.9, 1.1, mix(col, '#FFFFFF', 0.5)) + feuille(x - 0.2, y - 0.4, -60, 0.9)
    + P(basket, '#C9925A') + clip(`${c.uid}pn${ctx.view}`, basket, [1.4, 2.8].map(d => L([x - 4, y + d], [x + 4, y + d], '#9A6A3A', 0.5)).join('') + [-2, 0, 2].map(d => L([x + d, y], [x + d * 0.85, y + 5], '#9A6A3A', 0.5)).join('')) + P(basket, 'none');
}
// Ombrelle posée sur l'épaule : la toile derrière la tête, le manche dans la main
function ombrelle(c, ctx, [col], h) {
  // la toile reste dans le cadre (x ≤ 46) quelle que soit la carrure
  const [x, y] = h, tip = [Math.min(x + 3, 38.6), y - 17.4];
  const canopy = 'M-7,0 Q-6.7,-6.2 0,-6.7 Q6.7,-6.2 7,0 Q5.25,-1.2 3.5,0 Q1.75,-1.2 0,0 Q-1.75,-1.2 -3.5,0 Q-5.25,-1.2 -7,0 Z';
  const ribs = [-3.5, 0, 3.5].map(d => L([d * 0.5, -6.3], [d, -0.2], tone(col, 0.82), 0.5)).join('');
  return limb([x, y + 0.4], tip, 0.7, '#8A5A30')
    + `<g transform="translate(${r2(tip[0])} ${r2(tip[1] + 1.6)}) rotate(16)">${P(canopy, col)}${ribs}${E(0, -6.9, 0.6, 0.6, tone(col, 0.8), 0.5)}</g>`;
}

// ---- par-dessus : le manteau d'hiver, le ciré ; le châle, la pèlerine, l'étole ----
// Le pan (d'un seul tenant) : des épaules, un peu plus large que le buste, jusqu'au-dessus du genou (l'ourlet) ; il
// s'évase et suit la marche d'un rien, comme la jupe
const balance = ctx => (ctx.walk ? [0.5, 0, -0.5, 0][ctx.n] : 0);
function pan(c, ctx) {
  const { sw, hw, b, cou: y, hanche, ourlet: H } = reperes(c), w = balance(ctx);
  const mx = (sw + hw) / 2 + b + 0.6;
  return `M${r2(24 - sw - 0.5)},${r2(y + 1.6)} Q24,${r2(y - 1.2)} ${r2(24 + sw + 0.5)},${r2(y + 1.6)} Q${r2(24 + mx)},${r2(y + 8.8)} ${r2(24 + hw + 0.9)},${r2(hanche + 0.9)}`
    + ` L${r2(24 + hw + 2.4 + w)},${H} Q${r2(24 + w)},${r2(H + 1.8)} ${r2(24 - hw - 2.4 + w)},${H} L${r2(24 - hw - 0.9)},${r2(hanche + 0.9)} Q${r2(24 - mx)},${r2(y + 8.8)} ${r2(24 - sw - 0.5)},${r2(y + 1.6)} Z`;
}
// Le pan peint : l'aplat, l'ombre du côté droit et du bas, un reflet à gauche (sauf de dos), puis le contour
function panPeint(c, ctx, id, col, S, reflets = '') {
  const { view } = ctx, d = pan(c, ctx), { sw, cou: y, ourlet: H } = reperes(c);
  const ombre = `<rect x="${view === 'se' ? 25.4 : 27.2}" y="${r2(y - 1.8)}" width="16" height="30" fill="${S}"/>`
    + `<path d="M6,${r2(H - 1.6)} Q24,${r2(H + 1.4)} 42,${r2(H - 1.6)} L42,${r2(H + 4)} L6,${r2(H + 4)} Z" fill="${S}"/>`;
  const clair = view === 'ne' ? '' : `<rect x="${r2(24 - sw + 0.6)}" y="${r2(y + 3.6)}" width="1.3" height="10" rx="0.6" fill="${tone(col, 1.28)}"/>`;
  return P(d, col) + clip(`${c.uid}${id}${view}`, d, ombre + clair + reflets) + P(d, 'none');
}
// Deux poches à rabat, à hauteur des hanches (de trois quarts, celle du fond est plus étroite)
function poches(c, { view }, S) {
  const { hw, hanche } = reperes(c), se = view === 'se';
  const one = (x, l) => P(`M${r2(x)},${r2(hanche + 1.1)} L${r2(x + l)},${r2(hanche + 1.1)} L${r2(x + l - 0.2)},${r2(hanche + 2.7)} L${r2(x + 0.2)},${r2(hanche + 2.7)} Z`, S, 0.6);
  return one(24 - hw - 0.4 - (se ? 0.6 : 0), 4.4) + one(24 + hw - (se ? 3.4 : 4), se ? 3 : 4.4);
}
// Le col de fourrure : une bande moelleuse autour du cou, festonnée (de dos, sous les cheveux) ; y : le haut du cou
function colFourrure(o, view, col, y) {
  const S = tone(col, 0.86), Y = d => r2(y + d);
  if (view === 'ne') {
    return P(`M15.4,${Y(0)} Q24,${Y(3.2)} 32.6,${Y(0)} L33.2,${Y(2.4)} Q24,${Y(6.2)} 14.8,${Y(2.4)} Z`, col, 0.9) + P(`M17.4,${Y(2.8)} Q24,${Y(5.2)} 30.6,${Y(2.8)}`, 'none', 0.5).replace(`stroke="${OUT}"`, `stroke="${S}"`);
  }
  // le bord du bas en festons : des bosses le long d'un arc, de l'épaule droite à l'épaule gauche
  const pts = Array.from({ length: 7 }, (_, i) => { const t = i / 6; return [(1 - t) ** 2 * (o + 8.4) + 2 * t * (1 - t) * o + t * t * (o - 8.4), (1 - t) ** 2 * (y + 1.8) + 2 * t * (1 - t) * (y + 8.4) + t * t * (y + 1.8)]; });
  let d = `M${r2(o - 6.8)},${Y(-0.2)} Q${o},${Y(3)} ${r2(o + 6.8)},${Y(-0.2)} L${r2(pts[0][0])},${r2(pts[0][1])}`;
  for (let i = 1; i < pts.length; i++) { const [x0, y0] = pts[i - 1], [x1, y1] = pts[i]; d += ` Q${r2((x0 + x1) / 2)},${r2((y0 + y1) / 2 + 1.5)} ${r2(x1)},${r2(y1)}`; }
  d += ' Z';
  return P(d, col, 0.9) + P(`M${r2(o - 5)},${Y(3.4)} Q${o},${Y(6.4)} ${r2(o + 5)},${Y(3.4)}`, 'none', 0.5).replace(`stroke="${OUT}"`, `stroke="${S}"`);
}
const BOIS = '#D9B27C';
function manteau(c, ctx, [col, fourrure]) {
  if (ctx.couche !== 'dessus') return '';
  const { view } = ctx, { cou: y, ourlet: H } = reperes(c), S = tone(col, 0.8), w = balance(ctx), Y = d => r2(y + d);
  let s = panPeint(c, ctx, 'mt', col, S);
  if (view === 'ne') {
    // de dos : la couture du milieu, la fente, la martingale à deux boutons
    s += P(`M24,${Y(3)} L${r2(24 + w * 0.6)},${r2(H - 3.6)}`, 'none', 0.5) + P(`M${r2(24 + w * 0.6)},${r2(H - 3.6)} L${r2(24 + w)},${r2(H + 0.6)}`, 'none', 0.8)
      + `<rect x="19.2" y="${Y(10.8)}" width="9.6" height="1.8" rx="0.8" fill="${S}" stroke="${OUT}" stroke-width="0.7"/>` + E(20.5, y + 11.7, 0.55, 0.55, BOIS, 0.45) + E(27.5, y + 11.7, 0.55, 0.55, BOIS, 0.45);
    return s + colFourrure(24, view, fourrure, y);
  }
  // de face, de trois quarts : le croisé, trois brandebourgs (une bûchette de bois, sa ganse), deux poches
  const o = view === 'se' ? 21.6 : 24, sh = y + 3.2;
  s += P(`M${r2(o + 1.2)},${Y(3.6)} L${r2(o + 1.2 + w)},${r2(H + 0.8)}`, 'none', 0.8);
  for (const d of [6.2, 9.6, 13]) {
    const yy = y + d, x = o + 1.2 + w * (yy - sh) / (H - sh);
    s += L([x - 2.6, yy], [x + 2.6, yy], tone(col, 0.55), 0.55)
      + `<rect x="${r2(x - 1.5)}" y="${r2(yy - 0.55)}" width="3" height="1.1" rx="0.55" fill="${BOIS}" stroke="${OUT}" stroke-width="0.5"/>`;
  }
  return s + poches(c, ctx, S) + colFourrure(o, view, fourrure, y);
}
function cire(c, ctx, [col]) {
  const { view } = ctx, S = tone(col, 0.82), R = reperes(c);
  // la capuche rabattue : de face et de trois quarts, elle dépasse derrière le cou ; de dos, sur les épaules
  if (ctx.couche === 'derriere') return view === 'ne' ? '' : capucheRabattue(c.uid, view, R, col, S);
  if (ctx.couche !== 'dessus') return '';
  const { cou: y, ourlet: H, sw, hw, hanche } = R, w = balance(ctx), Y = d => r2(y + d);
  // le reflet du tissu ciré : deux traits blancs, sur la poitrine et sur le pan
  const gl = 'rgba(255,255,255,.55)';
  const reflets = view === 'ne' ? L([24 - sw + 2.2, y + 4.2], [24 - sw + 1.8, y + 8.8], gl, 0.9) : L([24 - sw + 3, y + 4.6], [24 - sw + 2.6, y + 9.2], gl, 0.9) + L([24 - hw + 0.6, hanche + 2.5], [24 - hw + 0.2 + w, hanche + 4.9], gl, 0.8);
  let s = panPeint(c, ctx, 'cr', col, S, reflets);
  // de dos : la couture, la capuche rabattue sur les épaules
  if (view === 'ne') return s + P(`M24,${Y(9.2)} L${r2(24 + w)},${r2(H + 0.6)}`, 'none', 0.5) + capucheRabattue(c.uid, view, R, col, S);
  // de face, de trois quarts : la patte et ses pressions, le col pointu, deux poches à rabat
  const o = view === 'se' ? 21.6 : 24, sh = y + 3.2;
  // ouvert (habiller : { id: 'cire', ouvert: true }, la troupe sous la pluie) : le même ciré, ses deux pans écartés du col
  // à l'ourlet laissent voir la tenue ; les pressions le long du pan gauche
  if ((c.o.accessoires.dessus || {}).ouvert) {
    const coin = `M${r2(o - 2.6)},${Y(2)} L${r2(o + 2.6)},${Y(2)} L${r2(o + 3 + w)},${r2(H + 2)} L${r2(o - 3 + w)},${r2(H + 2)} Z`;
    s = `<clipPath id="${c.uid}cro${view}"><path d="M0,0 L48,0 L48,64 L0,64 Z ${coin}" clip-rule="evenodd"/></clipPath><g clip-path="url(#${c.uid}cro${view})">${s}</g>`;
    s += P(`M${r2(o - 2.6)},${Y(2)} L${r2(o - 3 + w)},${r2(H + 0.4)} M${r2(o + 2.6)},${Y(2)} L${r2(o + 3 + w)},${r2(H + 0.4)}`, 'none');
    s += [6, 10, 14].map(d => y + d).filter(yy => yy < H - 2).map(yy => E(o - 4.2 + w * (yy - sh) / (H - sh), yy, 0.55, 0.55, tone(col, 0.5), 0.4)).join('');
    s += P(`M${r2(o - 6.4)},${Y(0.8)} L${r2(o - 2.4)},${Y(4.4)} L${r2(o - 3.6)},${Y(5.8)} Z`, col, 0.8) + P(`M${r2(o + 6.4)},${Y(0.8)} L${r2(o + 2.4)},${Y(4.4)} L${r2(o + 3.6)},${Y(5.8)} Z`, S, 0.8);
    return s + poches(c, ctx, S);
  }
  s += P(`M${r2(o + 0.8)},${Y(3)} L${r2(o + 0.8 + w)},${r2(H + 0.8)}`, 'none', 0.9);
  s += [5.6, 9.2, 12.8, 16.4].map(d => y + d).filter(yy => yy < H - 1.4).map(yy => E(o + 2.2 + w * (yy - sh) / (H - sh), yy, 0.6, 0.6, tone(col, 0.5), 0.4)).join('');
  s += P(`M${r2(o - 5.2)},${Y(0.4)} L${r2(o + 0.4)},${Y(4.6)} L${r2(o - 1.6)},${Y(6)} Z`, col, 0.8) + P(`M${r2(o + 5.2)},${Y(0.4)} L${r2(o + 0.4)},${Y(4.6)} L${r2(o + 2.4)},${Y(6)} Z`, S, 0.8);
  return s + poches(c, ctx, S);
}
// Châle tricoté [laine, frange], drapé sur les épaules et le haut des bras (par-dessus les bras), ses deux pans croisés
// et noués sur la poitrine, des franges ; de dos, une grande pointe frangée
function chale(c, { view }, [col, frange]) {
  const { cou: y, e } = reperes(c), uid = c.uid, Y = d => r2(y + d);
  const S = tone(col, 0.82), L0 = r2(24 - e - 3.6), R0 = r2(24 + e + 3.6);
  const tricot = () => [0, 1, 2, 3, 4, 5].map(i => L([8 + i * 6, y - 2], [14 + i * 6, y + 18], tone(col, 0.86), 0.5)).join('') + [0, 1, 2, 3, 4, 5].map(i => L([14 + i * 6, y - 2], [8 + i * 6, y + 18], tone(col, 0.9), 0.4)).join('');
  if (view === 'ne') {
    const d = `M${L0},${Y(5.4)} Q${r2(24 - e - 1)},${Y(0.4)} 24,${Y(-0.2)} Q${r2(24 + e + 1)},${Y(0.4)} ${R0},${Y(5.4)} Q${r2(R0 + 0.2)},${Y(8.4)} ${r2(R0 - 1.2)},${Y(9.6)} L24,${Y(17.6)} L${r2(L0 + 1.2)},${Y(9.6)} Q${r2(L0 - 0.2)},${Y(8.4)} ${L0},${Y(5.4)} Z`;
    return P(d, col) + clip(`${uid}ch${view}`, d, tricot() + `<rect x="25.6" y="${Y(-2)}" width="16" height="22" fill="${S}" opacity="0.55"/>`) + P(d, 'none')
      + [-1.6, -0.5, 0.6, 1.7].map(dx => L([24 + dx * 0.6, y + 17.2], [24 + dx, y + 19.4], frange, 0.7)).join('');
  }
  const o = view === 'se' ? 22 : 24;
  const d = `M${r2(o - 5.6)},${Y(0.6)} L${o},${Y(8.6)} L${r2(o + 5.6)},${Y(0.6)} Q${r2(R0 - 2.4)},${Y(1.4)} ${R0},${Y(4.6)} Q${r2(R0 + 0.6)},${Y(7.6)} ${r2(R0 - 0.2)},${Y(10)} Q${r2(o + 6)},${Y(11.4)} ${r2(o + 1.6)},${Y(10.2)} L${o},${Y(11.6)} L${r2(o - 1.6)},${Y(10.2)} Q${r2(o - 6)},${Y(11.4)} ${r2(L0 + 0.2)},${Y(10)} Q${r2(L0 - 0.6)},${Y(7.6)} ${L0},${Y(4.6)} Q${r2(L0 + 2.4)},${Y(1.4)} ${r2(o - 5.6)},${Y(0.6)} Z`;
  let s = P(d, col) + clip(`${uid}ch${view}`, d, tricot() + `<rect x="${r2(o + 3.4)}" y="${Y(-2)}" width="18" height="16" fill="${S}" opacity="0.6"/>`) + P(d, 'none');
  // le nœud et les deux pans qui pendent, frangés
  const pan = (dx, sg) => `M${r2(o + dx)},${Y(10.4)} L${r2(o + dx + sg * 2.4)},${Y(10.6)} L${r2(o + dx + sg * 2.8)},${Y(15)} L${r2(o + dx + sg * 0.4)},${Y(15.2)} Z`;
  s += P(pan(0.2, 1), S) + P(pan(-0.2, -1), col) + E(o, y + 10.4, 1.9, 1.4, S, 0.8);
  return s + [0.6, 1.5, 2.4].map(t => L([o + t, y + 15.1], [o + t + 0.1, y + 16.6], frange, 0.6) + L([o - t, y + 15.1], [o - t - 0.1, y + 16.6], frange, 0.6)).join('');
}
// Pèlerine de laine [laine, bord] : une courte cape sur les épaules et le haut des bras (par-dessus les bras), un bord
// en feston de laine ; sa capuche rabattue (la même que les autres) dépasse derrière le cou, ou se pose dans le dos
function pelerine(c, ctx, [col, bord]) {
  const { view } = ctx, R = reperes(c), { cou: y, e } = R, S = tone(col, 0.8);
  if (ctx.couche === 'derriere') return view === 'ne' ? '' : capucheRabattue(c.uid, view, R, col, S);
  const L0 = r2(24 - e - 3.8), R0 = r2(24 + e + 3.8), B = r2(y + 10.6), Y = d => r2(y + d);
  const d = `M${r2(24 - e - 0.4)},${Y(0.8)} Q24,${Y(-1.4)} ${r2(24 + e + 0.4)},${Y(0.8)} Q${r2(R0 - 0.6)},${Y(3)} ${R0},${B} Q24,${r2(B + 3.4)} ${L0},${B} Q${r2(L0 + 0.6)},${Y(3)} ${r2(24 - e - 0.4)},${Y(0.8)} Z`;
  let s = P(d, col) + clip(`${c.uid}pl${view}`, d, `<rect x="${view === 'se' ? 25.4 : 27.2}" y="${Y(-2)}" width="18" height="18" fill="${S}"/>`
    + `<path d="M0,${r2(B - 1.2)} Q24,${r2(B + 2.2)} 48,${r2(B - 1.2)} L48,${r2(B + 6)} L0,${r2(B + 6)} Z" fill="${bord}"/>`
    + [-10, -6, -2, 2, 6, 10].map(x => L([24 + x, B - 0.6 + Math.abs(x) * -0.06], [24 + x, B + 2.4], tone(bord, 0.82), 0.5)).join('')) + P(d, 'none');
  if (view === 'ne') s += capucheRabattue(`${c.uid}pl`, view, R, col, S);
  return s;
}
// Étole de fourrure : une large pèlerine de fourrure sur les épaules et le haut des bras (par-dessus les bras), au bord
// festonné, des touffes ; de dos, plus longue, elle dépasse sous les cheveux
function etole(c, { view }, [col]) {
  const { cou: y, e } = reperes(c), S = tone(col, 0.84), L0 = 24 - e - 3.6, R0 = 24 + e + 3.6, B = y + (view === 'ne' ? 9.4 : 7.6), n = 6;
  const festons = (x0, x1, yb) => { let d = ''; const l = (x1 - x0) / n; for (let i = n - 1; i >= 0; i--) d += ` Q${r2(x0 + l * (i + 0.5))},${r2(yb + 1.6)} ${r2(x0 + l * i)},${r2(yb)}`; return d; };
  const d = `M${r2(24 - e - 0.4)},${r2(y + 0.6)} Q24,${r2(y - 1.8)} ${r2(24 + e + 0.4)},${r2(y + 0.6)} Q${r2(R0 - 0.6)},${r2(y + 2)} ${r2(R0)},${r2(B)}${festons(L0, R0, B)} Q${r2(L0 + 0.6)},${r2(y + 2)} ${r2(24 - e - 0.4)},${r2(y + 0.6)} Z`;
  const touffes = [-9, -5, -1, 3, 7, 10].map((dx, i) => `<path d="M${r2(24 + dx - 1)},${r2(y + 3 + (i % 2) * 2)} q1,1.2 2,0" fill="none" stroke="${S}" stroke-width="0.6" stroke-linecap="round"/>`).join('');
  return P(d, col, 0.9) + clip(`${c.uid}et${view}`, d, touffes + `<rect x="${view === 'se' ? 25.6 : 27.4}" y="${r2(y - 2)}" width="16" height="16" fill="${S}" opacity="0.6"/>`) + P(d, 'none', 0.9);
}

// ---- aux pieds : les bottes, par-dessus le bas de la jambe ; le pied est celui de la troupe, à leur couleur ----
// extra : [x, y, dir, tilt] du pied (troupe.leg) ; assis, la tige s'arrête au genou (c.hip : le haut du tibia)
function botte(fourree) {
  return (c, ctx, [col, fourrure], [x, y, dir, tilt]) => {
    const w = c.legW + 1.4, top = Math.max(y - 5.4, c.hip + 0.4), S = tone(col, 0.76);
    let s = `<rect x="${r2(x - w / 2)}" y="${r2(top)}" width="${r2(w)}" height="${r2(y - top + 1.6)}" rx="1.3" fill="${col}" stroke="${OUT}" stroke-width="1.1"/>`
      + `<rect x="${r2(x + w / 2 - 1.8)}" y="${r2(top + 0.8)}" width="1.1" height="${r2(y - top)}" rx="0.5" fill="${S}"/>`;
    // bottes de pluie : le caoutchouc qui brille, un liseré en haut
    if (!fourree) {
      s += `<rect x="${r2(x - w / 2 + 0.9)}" y="${r2(top + 1.8)}" width="0.9" height="${r2(Math.max(0.8, y - top - 2.4))}" rx="0.45" fill="rgba(255,255,255,.6)"/>`
        + `<rect x="${r2(x - w / 2)}" y="${r2(top)}" width="${r2(w)}" height="1.5" rx="0.7" fill="${tone(col, 0.82)}" stroke="${OUT}" stroke-width="0.8"/>`;
    }
    s += shoe({ ...c, uid: `${c.uid}b`, shoe: col, shoeS: tone(col, 0.68), shoeH: fourree ? tone(col, 1.22) : 'rgba(255,255,255,.75)' }, x, y, dir, tilt);
    // bottes fourrées : un revers de fourrure, un bourrelet plus large que la tige, festonné en bas
    if (fourree) {
      const a = x - w / 2 - 0.8, b = x + w / 2 + 0.8, t0 = top - 1.2, t1 = top + 1.6, l = (b - a) / 3;
      let d = `M${r2(a)},${r2(t1)} Q${r2(a - 0.3)},${r2(t0 + 0.5)} ${r2(a + 0.9)},${r2(t0)} Q${r2(x)},${r2(t0 - 0.6)} ${r2(b - 0.9)},${r2(t0)} Q${r2(b + 0.3)},${r2(t0 + 0.5)} ${r2(b)},${r2(t1)}`;
      for (let i = 2; i >= 0; i--) d += ` Q${r2(a + l * (i + 0.5))},${r2(t1 + 1.1)} ${r2(a + l * i)},${r2(t1)}`;
      s += P(`${d} Z`, fourrure, 0.8) + [0.3, 0.7].map(f => P(`M${r2(a + (b - a) * f - 0.7)},${r2(t0 + 1)} q0.7,0.9 1.4,0`, 'none', 0.5).replace(`stroke="${OUT}"`, `stroke="${tone(fourrure, 0.82)}"`)).join('');
    }
    return s;
  };
}

// Ce que les tenues de saison changent au personnage lui-même : les manches du manteau ou du ciré (jusqu'au poignet,
// même sous un t-shirt), les moufles (les mains de leur couleur, le pouce à part : c.moufle ; le revers tricoté au
// poignet, sur une manche longue)
const PORTE = {
  manteau: ([col, fourrure]) => ({ sleeve: col, cuff: fourrure, sleeves: undefined }),
  cire: ([col]) => ({ sleeve: col, cuff: tone(col, 0.82), sleeves: undefined }),
  moufles: ([col, revers], c) => ({ hand: col, moufle: true, ...(c.sleeves ? {} : { cuff: revers }) })
};

// ---- le catalogue des dessins : par accessoire, les couches où il apparaît ----

// ---- attributs masculins (chapeaux, cravate, médaille, monocle, cicatrice, pipe, canne) ----
function tricorne(c, { view }, [col]) {
  const k = decale(view), S = tone(col, 0.7), H = tone(col, 1.3);
  if (view === 'ne') return P(sx('M13.4,15 Q13,6 24,5.8 Q35,6 34.6,15 Q24,12.4 13.4,15 Z', k), S) + E(24 + k, 7.4, 1.4, 0.8, H, 0.6);
  const brim = sx('M8.6,15.6 Q7.6,13 12.6,13.6 L15.8,15.1 Q24,11.7 32.2,15.1 L35.4,13.6 Q40.4,13 39.4,15.6 Q24,20.6 8.6,15.6 Z', k);
  const dome = sx('M14.2,14.6 Q13.8,6.2 24,6 Q34.2,6.2 33.8,14.6 Q24,11.8 14.2,14.6 Z', k);
  return P(brim, col) + P(dome, S) + P(sx('M24,6 Q24,11 24,14.2', k), 'none', 0.5) + E(24 + k, 7.8, 2.1, 1.1, H, 0.6);
}
function hautForme(c, { view }, [col]) {
  const k = decale(view), S = tone(col, 0.72), H = tone(col, 1.28);
  if (view === 'ne') return P(sx('M14,15.4 Q13.8,7.4 24,7.2 Q34.2,7.4 34,15.4 Z', k), S) + P(sx('M12.8,15.4 L35.2,15.4 L34.4,17.6 L13.6,17.6 Z', k), col);
  const bord = sx('M11.8,14.8 L36.2,14.8 L37.8,16.8 Q24,18.6 10.2,16.8 Z', k);
  const tube = sx('M15.4,14.4 L15,4.6 Q24,4.2 33,4.6 L32.6,14.4 Z', k);
  return P(bord, col) + P(tube, S) + P(sx('M15,4.6 Q24,4.2 33,4.6 L32.9,5.9 L15.1,5.9 Z', k), H, 0.8) + P(sx('M18.6,14.6 L18.6,16.6 M24,14.6 L24,16.6 M29.4,14.6 L29.4,16.6', k), 'none', 0.4);
}
function monocle(c, { view }, [col]) {
  if (view === 'ne') return '';
  const se = view === 'se';
  const x = se ? 25.2 : 28.6, y = 22.6;
  const frame = tone(col, 1.15);
  const chain = se ? P('M25.3,25.6 Q23.4,28 23.2,31', 'none', 0.4) : P('M28.7,25.6 Q30.6,28 30.8,31.2', 'none', 0.4);
  return `<circle cx="${x}" cy="${y}" r="3.05" fill="rgba(200,230,255,.25)" stroke="${frame}" stroke-width="0.9"/>`
    + `<circle cx="${r2(x - 0.8)}" cy="${r2(y - 0.9)}" r="0.5" fill="rgba(255,255,255,.65)" stroke="none"/>` + chain;
}
function cravate(c, { view }, [col]) {
  if (view === 'ne') return '';
  const kx = view === 'se' ? 20.6 : 24;
  const S = tone(col, 0.82), H = tone(col, 1.2);
  return P(`M${r2(kx - 1.7)},30.6 L${r2(kx + 1.7)},30.6 L${r2(kx + 1.2)},34 L${r2(kx - 1.2)},34 Z`, S)
    + P(`M${r2(kx - 1.1)},33.6 L${r2(kx + 1.1)},33.6 L${r2(kx + 0.8)},42.6 Q${kx},43.8 ${r2(kx - 0.8)},42.6 Z`, col)
    + P(`M${r2(kx)},33.8 L${kx},42.8`, 'none', 0.3).replace(`stroke="${OUT}"`, `stroke="${H}"`);
}
function medaille(c, { view }, [col, metal]) {
  if (view === 'ne') return '';
  const kx = view === 'se' ? 21.6 : 24;
  return P(`M${r2(kx - 0.55)},30.4 L${r2(kx - 0.85)},34.6 L${r2(kx + 0.85)},34.6 L${r2(kx + 0.55)},30.4 Z`, col)
    + E(kx, 35.8, 1.5, 1.5, metal, 0.9) + E(kx - 0.5, 35.4, 0.5, 0.5, tone(metal, 1.4), 0.25);
}
function cicatrice(c, { view }, [col]) {
  if (view === 'ne') return '';
  const [x, y] = view === 'se' ? [15, 20.6] : [19.4, 20.6];
  const S = tone(col, 0.85);
  return P(`M${r2(x - 1.8)},${r2(y - 0.8)} L${r2(x + 1.6)},${r2(y + 0.9)}`, 'none', 0.8)
    + L([x - 1.9, y - 1.1], [x - 1.2, y - 0.4], S, 0.5) + L([x + 0.9, y + 0.3], [x + 1.7, y + 1.1], S, 0.5);
}
function pipe(c, ctx, [col, metal], h) {
  const [x, y] = h;
  return limb([x - 1.6, y - 0.2], [x - 3.1, y - 4.8], 0.9, metal)
    + P(`M${r2(x - 2.3)},${r2(y - 0.4)} Q${r2(x - 0.6)},${r2(y - 2)} ${r2(x + 0.3)},${r2(y - 1.2)} Q${r2(x - 0.3)},${r2(y + 0.5)} ${r2(x - 2.3)},${r2(y - 0.4)} Z`, col, 0.8);
}
function canne(c, ctx, [col, metal], h) {
  const [x, y] = h;
  return limb([x + 0.4, y - 2], [x + 2.4, y + 7], 1.1, col) + E(x + 0.6, y - 2.2, 1.2, 1, metal, 0.8);
}

const DESSINS = {
  bonnet: { tete: bonnet }, cacheOreilles: { cheveux: arceau, tete: cacheOreilles }, paille: { tete: paille }, casquette: { tete: casquette }, bandana: { tete: bandana }, couronneFleurs: { tete: couronneFleurs },
  beret: { tete: beret }, oreillesChat: { tete: oreillesChat }, oreillesLapin: { tete: oreillesLapin }, diademe: { tete: diademe },
  noeud: { cheveux: noeud }, barrettes: { cheveux: barrettes }, fleur: { cheveux: fleur }, etoile: { cheveux: etoileCheveux },
  lunettesRondes: { visage: lunettes('rondes') }, lunettesCarrees: { visage: lunettes('carrees') }, lunettesPapillon: { visage: lunettes('papillon') },
  lunettesSoleil: { visage: lunettes('soleil') }, lunettesCoeur: { visage: lunettes('coeur') },
  coeurs: { joues: coeurs }, etoiles: { joues: etoilesJoues }, pansement: { joues: pansement },
  puces: { oreilles: boucles('puces') }, anneaux: { oreilles: boucles('anneaux') }, pendantsEtoile: { oreilles: boucles('etoile') },
  foulard: { cou: foulard }, echarpe: { cou: echarpe }, perles: { cou: perles }, coquillage: { cou: coquillage }, papillon: { cou: papillon },
  sacDos: { derriere: sacDos, cou: sacDos }, besace: { cou: besace }, cape: { derriere: cape, cou: cape, surBras: cape }, ailes: { derriere: ailes, surBras: ailes },
  peluche: { main: peluche }, panier: { main: panier }, ombrelle: { main: ombrelle },
  tricorne: { tete: tricorne }, hautForme: { tete: hautForme }, monocle: { visage: monocle }, cravate: { cou: cravate }, medaille: { cou: medaille }, cicatrice: { joues: cicatrice }, pipe: { main: pipe }, canne: { main: canne },
  manteau: { dessus: manteau }, cire: { derriere: cire, dessus: cire }, bottesPluie: { pieds: botte(false) }, bottesFourrees: { pieds: botte(true) },
  chale: { surBras: chale }, pelerine: { derriere: pelerine, surBras: pelerine }, etole: { surBras: etole }
};

// Ce que les accessoires portés dessinent dans une couche (couleurs : c.acc[emplacement])
function couche(c, nom, ctx, extra) {
  let s = '';
  for (const [place, a] of Object.entries(c.o.accessoires)) {
    const f = DESSINS[a.id] && DESSINS[a.id][nom];
    if (f) s += f(c, { ...ctx, couche: nom }, c.acc[place], extra);
  }
  return s;
}

// Habiller un porteur qui n'est pas l'avatar (un maître) : objets = { emplacement: { id, couleurs: [hex…] } }. Mêmes
// dessins, mêmes couches que l'avatar : derrière le corps, par-dessus le haut, au cou, par-dessus les bras ; la tête par
// le crochet c.coiffe du maître (il appelle c.coiffe(c, ctx, couche) là où se posent les « cheveux » et la « tete », et
// range ce qui dépasserait) ; les manches, les mains, les pieds (PORTE, c.foot)
function habiller(m, objets, suffixe) {
  const c = { ...m, uid: `${m.uid}${suffixe}`, o: { accessoires: {} }, acc: {} };
  // (les options d'un objet, comme le ciré ouvert, suivent son id : { id, couleurs, ouvert })
  for (const [place, { id, couleurs, ...options }] of Object.entries(objets)) { c.o.accessoires[place] = { id, ...options }; c.acc[place] = couleurs; }
  const puis = (f, nom) => function (cc, ctx) { return (f ? f.call(this, cc, ctx) : '') + couche(cc, nom, ctx); };
  Object.assign(c, { backItems: puis(m.backItems, 'derriere'), body: puis(m.body, 'dessus'), neck: puis(m.neck, 'cou'), overArms: puis(m.overArms, 'surBras') });
  if (objets.tete || objets.cheveux) c.coiffe = (cc, ctx, nom) => couche(cc, nom, ctx);
  for (const place of ['dessus', 'mains']) { const a = objets[place]; if (a && PORTE[a.id]) Object.assign(c, PORTE[a.id](a.couleurs, c)); }
  if (objets.pieds) c.foot = (cc, x, y, dir, tilt) => couche(cc, 'pieds', {}, [x, y, dir, tilt]);
  return c;
}

module.exports = { DESSINS, PORTE, couche, reperes, capucheRabattue, habiller };
