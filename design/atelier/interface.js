// Les icônes de l'interface (32 × 32), au trait de la bibliothèque : ce que le joueur voit tout le temps (la barre du
// bas, le compteur d'écus, les ressources, les boutons de l'île). Aplats chauds, trait brun, lumière en haut à gauche,
// formes rondes et pleines : elles restent lisibles de 16 à 32 px, sur le papier clair comme sur le verre sombre des
// boutons de l'île. Chaque icône est un dessin (fonction sans argument) ; preview_interface.mjs les publie.
const { OUT, P, E, L, clip, r2 } = require('./troupe');

const WO = 1.3; // le contour
const WI = 0.8; // les détails intérieurs
const rond = (x, y, r, fill, w = WO) => E(x, y, r, r, fill, w);
const reflet = (x, y, rx, ry, a = 0.85) => E(x, y, rx, ry, `rgba(255,255,255,${a})`, 0);
// un rectangle aux coins arrondis (chemin)
const rr = (x, y, w, h, r) => `M${r2(x + r)},${y} L${r2(x + w - r)},${y} Q${r2(x + w)},${y} ${r2(x + w)},${r2(y + r)} L${r2(x + w)},${r2(y + h - r)} Q${r2(x + w)},${r2(y + h)} ${r2(x + w - r)},${r2(y + h)} L${r2(x + r)},${r2(y + h)} Q${x},${r2(y + h)} ${x},${r2(y + h - r)} L${x},${r2(y + r)} Q${x},${y} ${r2(x + r)},${y} Z`;
// l'étincelle de la bibliothèque (lot_m.js)
const etincelle = (x, y, s = 1) => `<path d="M${r2(x)},${r2(y - 1.6 * s)} L${r2(x + 0.4 * s)},${r2(y - 0.4 * s)} L${r2(x + 1.6 * s)},${r2(y)} L${r2(x + 0.4 * s)},${r2(y + 0.4 * s)} L${r2(x)},${r2(y + 1.6 * s)} L${r2(x - 0.4 * s)},${r2(y + 0.4 * s)} L${r2(x - 1.6 * s)},${r2(y)} L${r2(x - 0.4 * s)},${r2(y - 0.4 * s)} Z" fill="#FFF6C8" stroke="#E8C860" stroke-width="${r2(0.35 * s)}"/>`;
// une étoile à cinq branches (centre, rayons extérieur et intérieur)
const etoile = (x, y, R, r, fill, w) => P(Array.from({ length: 10 }, (_, i) => { const a = -Math.PI / 2 + i * Math.PI / 5, k = i % 2 ? r : R; return `${i ? 'L' : 'M'}${r2(x + k * Math.cos(a))},${r2(y + k * Math.sin(a))}`; }).join(' ') + ' Z', fill, w);

const OR = { clair: '#FFE28A', corps: '#F2C04B', ombre: '#D49A2A', fonce: '#A8741C' };
const BOIS = { clair: '#D9AE76', corps: '#B98A55', ombre: '#94693E' };
const PAGE = { corps: '#FBF3DE', ombre: '#E6D6B4' };

// ---- la barre du bas ----

// Le Grimoire : le livre de cuir fermé, coins dorés, la lune de Brumelune sur le médaillon, le fermoir
function grimoire() {
  const cuir = '#A2432F', cuirS = '#7E3022', cuirH = '#C06A50';
  let s = P(rr(7, 6.2, 21, 22.6, 2.2), PAGE.corps, WO); // la tranche des pages, sous la couverture
  s += [10, 13, 16, 19, 22, 25].map(y => L([25.9, y], [27.2, y], PAGE.ombre, 0.6)).join('');
  const C = rr(4.4, 4, 21.4, 22.6, 2.2);
  s += P(C, cuir, 0) + clip('grc', C, `<rect x="4" y="3" width="4.4" height="25" fill="${cuirS}"/><path d="M15,27 L26,16.4 L26,27 Z" fill="${cuirS}" opacity=".45"/>`)
    + P(`M9.6,6.4 Q9.6,5.6 10.6,5.6 L20,5.6`, 'none', 0).replace('stroke="none"', `stroke="${cuirH}" stroke-width="1.2" stroke-linecap="round"`) + P(C, 'none', WO);
  s += L([8.4, 4.6], [8.4, 26], OUT, WI) + [8.4, 15.3, 22.2].map(y => L([5.2, y], [7.8, y], OR.corps, 1.1)).join('');
  s += P('M25.8,8.6 L25.8,4 L21.2,4 Z', OR.corps, WI) + P('M25.8,22 L25.8,26.6 L21.2,26.6 Z', OR.corps, WI);
  // le médaillon : un croissant de lune et une étoile
  s += rond(16.4, 15.3, 5.2, OR.corps) + rond(16.4, 15.3, 3.9, OR.ombre, 0) + rond(15.6, 15.3, 2.9, '#FFF4CC', 0) + rond(17, 14.4, 2.5, OR.ombre, 0) + etincelle(18.6, 16.8, 0.75);
  s += reflet(14.2, 12.4, 1, 0.6, 0.7);
  // le fermoir, qui passe sur la tranche
  s += P(rr(22.6, 13.4, 6.4, 3.8, 1.2), OR.corps, WI) + rond(27.2, 15.3, 1, OR.fonce, 0);
  return s;
}

// Des boules qui se fondent en une seule forme (feuillage, nuage) : les contours d'abord, les couleurs par-dessus
const boules = (list, fill, line = OUT, w = WO) => list.map(([x, y, r]) => E(x, y, r + w / 2, r + w / 2, line, 0)).join('') + list.map(([x, y, r]) => E(x, y, r - w / 2, r - w / 2, fill, 0)).join('');

// L'île : un îlot de sable dans l'eau, son arbre touffu, un rocher, un peu de brume
function ile() {
  let s = E(16, 25.4, 14.2, 4.6, '#7CC4EC', WO) + P('M5,25 Q8,23.6 11,25 M21,25.6 Q24,24.2 27,25.6', 'none', 0).replace('stroke="none"', 'stroke="#D8F1FF" stroke-width="1" stroke-linecap="round"');
  const S = 'M4.6,24.6 Q6.4,16.4 15.6,15.8 Q25.2,15.6 27.6,24.4 Q16,28.4 4.6,24.6 Z';
  // le sable, son ombre à droite, l'herbe en calotte sur le dessus
  const herbe = 'M3,22.4 Q7,19 10.6,20.4 Q13.6,21.6 16.6,20.2 Q20,18.8 23,20.2 Q25.8,21.4 29,22.8';
  s += P(S, '#F4DCA4', 0) + clip('ils', S, `<path d="M17,28 Q25,23 27.6,16 L30,28 Z" fill="#E2C083"/><path d="${herbe} L29,14 L3,14 Z" fill="#7DB852"/>`
    + `<path d="M16.6,20.2 Q20,18.8 23,20.2 Q25.8,21.4 29,22.8 L29,17 Q22,16.4 18,19 Z" fill="#5E9A3C"/><path d="${herbe}" fill="none" stroke="${OUT}" stroke-width="${WI}" stroke-linecap="round"/>`) + P(S, 'none', WO);
  // l'arbre : un tronc court, un feuillage de trois boules
  s += L([12.4, 18], [12.4, 12.6], OUT, 4) + L([12.4, 17.6], [12.4, 12.8], BOIS.corps, 1.8);
  const feuilles = [[9, 11, 3.6], [12.8, 7.6, 4.4], [16.6, 10.8, 3.6]];
  s += boules(feuilles, '#7DB852');
  s += `<clipPath id="ilf">${feuilles.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r2(r - WO / 2)}"/>`).join('')}</clipPath><g clip-path="url(#ilf)"><path d="M4,11.6 Q12.8,16.4 21,11 L21,16 L4,16 Z" fill="#5E9A3C"/></g>`;
  s += reflet(11.4, 5.8, 1.6, 1, 0.55) + reflet(7.8, 9.8, 0.8, 0.6, 0.45);
  // le rocher
  s += P('M19.4,21.2 Q19.8,18.2 22.4,18 Q24.8,18.2 25,21.2 Q22.2,22.2 19.4,21.2 Z', '#B4AEA4', WI) + reflet(21.4, 19.2, 0.8, 0.5, 0.6);
  // la brume, en haut à droite
  s += `<g opacity=".95">${boules([[23.4, 7.6, 2.6], [26.8, 8.4, 2.2], [21.4, 9.4, 1.6], [25, 9.8, 2]], '#EEF2F8', '#8C96B0', 1)}</g>`;
  return s;
}

// Les Défis : le sablier de bois, le sable doré qui coule
function defis() {
  const verre = '#E6F3FA', verreS = '#C4DCEA';
  const B = 'M10.4,7.2 L21.6,7.2 Q21.4,12.2 17,15.2 Q16.6,15.6 16.6,16 Q16.6,16.4 17,16.8 Q21.4,19.8 21.6,24.8 L10.4,24.8 Q10.6,19.8 15,16.8 Q15.4,16.4 15.4,16 Q15.4,15.6 15,15.2 Q10.6,12.2 10.4,7.2 Z';
  let s = P(B, verre, 0) + clip('dfv', B, `<path d="M18,8 L22,8 L22,25 L18,25 Q20,17 18,8 Z" fill="${verreS}"/>`
    + `<path d="M12.6,11.6 Q16,12.6 19.4,11.6 Q18.4,14 16,15.4 Q13.6,14 12.6,11.6 Z" fill="${OR.corps}"/>`
    + `<path d="M10,25 Q11,20.4 16,19.8 Q21,20.4 22,25 Z" fill="${OR.corps}"/><path d="M16,19.8 Q20,20.6 21.6,25 L18.4,25 Q18.6,21.6 16,19.8 Z" fill="${OR.ombre}"/>`
    + `<rect x="15.6" y="15.4" width="0.8" height="4.6" fill="${OR.corps}"/>`) + P(B, 'none', WO);
  s += reflet(12.6, 9.6, 0.7, 1.4, 0.9) + reflet(12.4, 22.2, 0.6, 1, 0.8);
  // les montants et les deux plateaux
  s += [7.8, 24.2].map(x => P(rr(x - 1, 6.6, 2, 18.8, 1), BOIS.corps, WI)).join('');
  s += P(rr(5.6, 3.6, 20.8, 4, 1.6), BOIS.corps, WO) + P(rr(5.6, 24.4, 20.8, 4, 1.6), BOIS.corps, WO);
  s += L([7.4, 4.8], [24.6, 4.8], BOIS.clair, 0.9) + L([7.4, 25.6], [24.6, 25.6], BOIS.clair, 0.9);
  return s;
}

// Le Sceau : un cachet de cire rouge, son signe, deux rubans
function sceau() {
  const cire = '#C9483A', cireS = '#9C3428', cireH = '#E27A68';
  let s = P('M11.4,21 L8.4,29.4 L11.6,28 L13.4,30.6 L16,22.6 Z', '#3E78C8', WI) + P('M20.6,21 L23.6,29.4 L20.4,28 L18.6,30.6 L16,22.6 Z', '#3E78C8', WI);
  // le bord de la cire, ondulé
  const n = 11, R = 11.2, r = 10, cx = 16, cy = 14.4;
  const bord = Array.from({ length: n * 2 }, (_, i) => { const a = -Math.PI / 2 + i * Math.PI / n, k = i % 2 ? r : R; return [cx + k * Math.cos(a), cy + k * Math.sin(a)]; });
  const D = bord.map(([x, y], i) => i ? `Q${r2(x)},${r2(y)} ${r2((x + bord[(i + 1) % bord.length][0]) / 2)},${r2((y + bord[(i + 1) % bord.length][1]) / 2)}` : `M${r2((x + bord[1][0]) / 2)},${r2((y + bord[1][1]) / 2)}`).join(' ') + ' Z';
  s += P(D, cire, 0) + clip('scc', D, `<circle cx="20" cy="18.6" r="11" fill="${cireS}" opacity=".55"/>`) + P(D, 'none', WO);
  // l'empreinte : un anneau et l'étoile du joueur
  s += rond(16, 14.4, 6.6, cireS, WI) + rond(16, 14.4, 5.6, cire, 0) + etoile(16, 14.6, 4.2, 1.8, '#F6B6A6', WI);
  s += P('M8.6,10.2 Q10,6.6 14,5.8', 'none', 0).replace('stroke="none"', `stroke="${cireH}" stroke-width="1.4" stroke-linecap="round"`);
  return s;
}

// Le sac (v6, étape 4) : une besace de toile nouée, du bois flotté et un coquillage qui dépassent
function sac() {
  const toile = '#D8BE8C', toileS = '#B79A66', corde = '#8E5E34';
  // ce qui dépasse : une branche de bois flotté fourchue, un coquillage
  const branche = 'M17.6,10.6 L20.8,5.6 L23.4,2.8 M20.8,5.6 L24.8,5.2';
  let s = P(branche, 'none', 0).replace('stroke="none"', `stroke="${OUT}" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"`) + P(branche, 'none', 0).replace('stroke="none"', 'stroke="#D6C3A2" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"');
  s += P('M8.4,10.8 Q7.6,5.4 11.8,4.6 Q16,5.4 15.2,10.8 Z', '#F4A9A0', WI) + [9.8, 11.8, 13.8].map(x => L([x, 10.4], [11.8, 5.6], '#D27E76', 0.6)).join('');
  // le corps de la besace
  const B = 'M9.6,12 Q4.6,16.6 5.6,23 Q7,29 16,29 Q25,29 26.4,23 Q27.4,16.6 22.4,12 Z';
  s += P(B, toile, 0) + clip('sab', B, `<path d="M18,29 Q26,26 25.4,14 L28,14 L28,30 Z" fill="${toileS}"/><path d="M8,24.6 Q16,27 24,24.6" fill="none" stroke="${toileS}" stroke-width="0.8" stroke-dasharray="1.2 1"/>`) + P(B, 'none', WO);
  // le col froncé et la corde
  s += P('M8.6,9.6 Q16,8 23.4,9.6 L22.6,12.8 Q16,11.6 9.4,12.8 Z', toile, WI) + L([11.2, 10], [11.6, 12.2], toileS, 0.6) + L([16, 9.4], [16, 11.8], toileS, 0.6) + L([20.6, 10], [20.2, 12.2], toileS, 0.6);
  s += P('M9,12.6 Q16,11 23,12.6', 'none', 0).replace('stroke="none"', `stroke="${OUT}" stroke-width="2.6" stroke-linecap="round"`) + P('M9,12.6 Q16,11 23,12.6', 'none', 0).replace('stroke="none"', `stroke="${corde}" stroke-width="1.2" stroke-linecap="round"`);
  s += P('M16,12 Q14,15.6 12.6,16.8 M16,12 Q17.8,15.8 19.4,16.6', 'none', 0).replace('stroke="none"', `stroke="${corde}" stroke-width="1" stroke-linecap="round"`) + rond(16, 12, 1.1, corde, WI);
  s += reflet(9.4, 17.4, 1, 2, 0.45);
  return s;
}

// Les tâches de Brume (v6, étape 6) : un parchemin roulé, deux tâches faites (coches), une à faire
function taches() {
  const vert = '#4E8A3A';
  let s = P('M8,6.6 L24,6.6 L24,26 L8,26 Z', PAGE.corps, 0) + clip('tap', 'M8,6.6 L24,6.6 L24,26 L8,26 Z', `<rect x="20" y="6" width="5" height="21" fill="${PAGE.ombre}"/>`) + P('M8,6.6 L8,26 M24,6.6 L24,26', 'none', WO);
  // les rouleaux, en haut et en bas
  s += P(rr(5.4, 3.6, 21.2, 4.2, 2.1), PAGE.ombre, WO) + rond(6.6, 5.7, 1.2, '#C9AE7E', WI) + rond(25.4, 5.7, 1.2, '#C9AE7E', WI);
  s += P(rr(5.4, 24.4, 21.2, 4.2, 2.1), PAGE.ombre, WO) + rond(6.6, 26.5, 1.2, '#C9AE7E', WI) + rond(25.4, 26.5, 1.2, '#C9AE7E', WI);
  // trois lignes : deux cochées, une case vide
  [10.6, 15.4, 20.2].forEach((y, i) => {
    s += P(rr(9.8, y - 1.6, 3.2, 3.2, 0.7), '#FFFFFF', WI) + L([14.6, y], [21.6, y], '#B9A68A', 1.3);
    if (i < 2) s += P(`M10.4,${r2(y - 0.2)} L11.6,${r2(y + 1.2)} L14,${r2(y - 2.2)}`, 'none', 0).replace('stroke="none"', `stroke="${vert}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"`);
  });
  return s;
}

// Le menu (v6, étape 6 : l'avatar, les réglages) : une roue dentée de laiton
function menu() {
  const n = 8, R = 12.6, r = 9.8, cx = 16, cy = 16;
  const pts = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2, d = Math.PI / n;
    pts.push([a - d * 0.95, r], [a - d * 0.5, R], [a + d * 0.5, R], [a + d * 0.95, r]);
  }
  const D = pts.map(([a, k], i) => `${i ? 'L' : 'M'}${r2(cx + k * Math.cos(a))},${r2(cy + k * Math.sin(a))}`).join(' ') + ' Z';
  let s = P(D, OR.corps, 0) + clip('mnr', D, `<circle cx="21" cy="21" r="12" fill="${OR.ombre}"/>`) + P(D, 'none', WO);
  s += rond(16, 16, 6.2, OR.clair, WI) + rond(16, 16, 3.2, '#6E4A22', WO);
  s += P('M8.2,12 Q9.6,8.6 13,7.4', 'none', 0).replace('stroke="none"', 'stroke="#FFF2C0" stroke-width="1.3" stroke-linecap="round"');
  return s;
}

// ---- les écus et les ressources ----

// L'écu : une pièce d'or bombée, son étoile, une étincelle
function ecu() {
  let s = E(16, 16.8, 12.4, 12.4, OR.ombre, WO) + E(15.4, 16, 11.6, 11.6, OR.corps, WI);
  s += E(15.4, 16, 8.4, 8.4, OR.ombre, WI) + E(15.2, 15.8, 7.6, 7.6, OR.corps, 0);
  s += etoile(15.3, 16.2, 5.4, 2.4, OR.clair, WI);
  s += P('M6.6,12.6 Q8.2,7.6 13.4,6.2', 'none', 0).replace('stroke="none"', 'stroke="#FFF4C4" stroke-width="1.6" stroke-linecap="round"');
  return s + etincelle(25.4, 7, 1.8);
}

// La pierre : un galet taillé, une facette claire, une facette sombre
function pierre() {
  const D = 'M4.6,21.6 L8,11.6 L16,6.4 L24.4,9 L28,17.6 L25.6,25 L16.6,27.8 L7.6,26.2 Z';
  let s = P(D, '#B6B1A8', 0) + clip('pie', D, `<path d="M16,6.4 L24.4,9 L28,17.6 L19,16.4 Z" fill="#D4CFC6"/><path d="M28,17.6 L25.6,25 L16.6,27.8 L19,16.4 Z" fill="#928D86"/><path d="M4.6,21.6 L7.6,26.2 L16.6,27.8 L19,16.4 L11,18.6 Z" fill="#A49F97"/>`) + P(D, 'none', WO);
  s += P('M8,11.6 L11,18.6 L19,16.4 L16,6.4 M11,18.6 L4.6,21.6 M19,16.4 L28,17.6 M19,16.4 L16.6,27.8', 'none', WI);
  return s + reflet(13.4, 11, 1.6, 1, 0.7);
}

// Le bois : deux bûches, l'une de bout (ses cernes)
function bois() {
  const ecorce = '#9A6A3E', ecorceS = '#7A5030', coeur = '#EBCB92', cerne = '#C99A5C';
  // la bûche du fond
  let s = P('M12,6.4 L26,6.4 Q29.4,6.4 29.4,10.6 Q29.4,14.8 26,14.8 L12,14.8 Z', ecorce, WO) + L([15, 9.6], [24, 9.6], ecorceS, WI) + L([17, 12.2], [25, 12.2], ecorceS, WI);
  s += E(12, 10.6, 3, 4.2, coeur, WO) + E(12, 10.6, 1.6, 2.4, 'none', WI).replace(`stroke="${OUT}"`, `stroke="${cerne}"`);
  // la bûche de devant
  s += P('M9,14.6 L24.6,14.6 Q28.6,14.6 28.6,20.2 Q28.6,25.8 24.6,25.8 L9,25.8 Z', ecorce, WO) + L([13, 18], [24, 18], ecorceS, WI) + L([14.6, 22.4], [25.6, 22.4], ecorceS, WI);
  s += reflet(18, 16.4, 4, 0.6, 0.35);
  s += E(9, 20.2, 4.4, 5.6, coeur, WO) + E(9, 20.2, 2.8, 3.6, 'none', WI).replace(`stroke="${OUT}"`, `stroke="${cerne}"`) + E(9, 20.2, 1.2, 1.6, cerne, 0);
  // une petite pousse sur le dessus
  s += P('M20,14.6 Q20.4,11.6 22.6,11 Q22.4,13.4 20,14.6 Z', '#7DB852', WI);
  return s;
}

// L'eau : une goutte, son reflet
function eau() {
  const D = 'M16,3.4 Q9,12.6 8,18.4 Q7.6,27.6 16,28.4 Q24.4,27.6 24,18.4 Q23,12.6 16,3.4 Z';
  let s = P(D, '#5CB0E6', 0) + clip('eau', D, `<path d="M19,28.6 Q25,25 23.4,16 L27,16 L27,30 Z" fill="#3F8CCB"/><path d="M8,22 Q12,26.6 16,26.6 L16,30 L6,30 Z" fill="#4E9FD9"/>`) + P(D, 'none', WO);
  s += E(12.2, 18.6, 1.6, 3.2, 'rgba(255,255,255,.9)', 0) + rond(13.2, 13.6, 0.9, 'rgba(255,255,255,.9)', 0);
  return s;
}

// La nourriture : une pomme rouge, sa feuille
function nourriture() {
  const D = 'M16,9.8 Q12.6,7.2 9,8.6 Q4,10.8 5,18.2 Q6.4,26.6 12,28 Q14,28.4 16,27.4 Q18,28.4 20,28 Q25.6,26.6 27,18.2 Q28,10.8 23,8.6 Q19.4,7.2 16,9.8 Z';
  let s = P(D, '#E04E3E', 0) + clip('nou', D, `<path d="M20,28.6 Q27.4,25 26.4,14 L30,14 L30,30 Z" fill="#B8342A"/>`) + P(D, 'none', WO);
  s += P('M16,10.4 Q15.6,6.4 17.6,3.6', 'none', 0).replace('stroke="none"', `stroke="${OUT}" stroke-width="2.6" stroke-linecap="round"`) + P('M16,10.4 Q15.6,6.4 17.6,3.6', 'none', 0).replace('stroke="none"', 'stroke="#8A5A30" stroke-width="1.1" stroke-linecap="round"');
  s += P('M17.2,6.2 Q20.6,2.6 25,4.2 Q22.4,8.4 17.2,6.2 Z', '#7DB852', WI) + L([18.4, 5.8], [22.6, 4.6], '#5E9A3C', 0.6);
  return s + E(10, 14.4, 1.7, 2.6, 'rgba(255,255,255,.75)', 0) + rond(11.2, 19.4, 0.7, 'rgba(255,255,255,.6)', 0);
}

// Le poisson : rond et souriant, tourné vers la droite
function poisson() {
  const corps = '#6CB8DC', ventre = '#CFEAF5', nageoire = '#3F8EBD';
  let s = P('M8.4,16 L2.8,10 Q2.4,16 2.8,22 Z', nageoire, WO); // la queue
  const D = 'M7,16 Q9.6,7.2 18.6,7 Q27,7.4 29.4,16 Q27,24.6 18.6,25 Q9.6,24.8 7,16 Z';
  s += P(D, corps, 0) + clip('poi', D, `<path d="M6,16 Q16,26 30,17 L30,27 L6,27 Z" fill="${ventre}"/><path d="M12,8 L13.6,8 Q11.6,16 13.6,24 L12,24 Z" fill="#5AA6CC"/>`) + P(D, 'none', WO);
  s += P('M15,7.6 Q18.4,3.6 22,7.2', nageoire, WI) + P('M17,19.4 Q19.4,22.8 21.4,19.6', nageoire, WI);
  // l'œil, le sourire
  s += rond(23.4, 13.6, 2.2, '#2A2420', 0) + rond(22.7, 12.9, 0.8, '#FFFFFF', 0);
  s += P('M25.2,18.4 Q26.6,19.4 27.8,18.2', 'none', WI) + E(25, 16.2, 1.1, 0.6, 'rgba(240,128,128,.55)', 0);
  return s + reflet(15.6, 11, 2, 1, 0.6);
}

// ---- les boutons de l'île ----

// La Récolte : la vague qui dépose ses trésors sur le sable (un coquillage, une étoile de mer)
function recolte() {
  let s = P('M2.4,23.6 Q16,19.6 29.6,23.6 L29.6,29 L2.4,29 Z', '#F4DCA4', WO);
  // la vague qui s'enroule
  const V = 'M3,20 Q4.6,8.4 15.6,5 Q25.4,2.8 28.8,10.6 Q24.6,8 20.6,10.2 Q17.4,12.4 19.6,15.6 Q15.6,15.2 15.4,11.8 Q11,15 11.6,21.6 Q7,19.4 3,20 Z';
  s += P(V, '#5CB0E6', 0) + clip('rcv', V, `<path d="M3,22 Q8,12 16,9 L16,24 Z" fill="#3F8CCB" opacity=".6"/>`) + P(V, 'none', WO);
  s += P('M19.6,15.6 Q15.6,15.2 15.4,11.8 Q17,8.6 20.6,10.2', 'none', 0).replace('stroke="none"', 'stroke="#EAF7FF" stroke-width="1.4" stroke-linecap="round"');
  s += rond(26.6, 13.6, 1, '#EAF7FF', 0) + rond(24.2, 15.6, 0.7, '#EAF7FF', 0);
  // le coquillage (Saint-Jacques) et l'étoile de mer
  s += P('M6.4,27.4 Q5.6,22 10,21.2 Q14.4,22 13.6,27.4 Z', '#F4A9A0', WI) + [8, 10, 12].map(x => L([x, 26.8], [10, 22], '#D27E76', 0.6)).join('') + P(rr(8.4, 26.8, 3.2, 1.4, 0.6), '#E8928A', WI);
  s += `<g transform="rotate(14 22.6 25)">${etoile(22.6, 25, 4.6, 2, '#F49A4A', WI)}</g>` + rond(22.6, 25, 0.6, '#FFD3A8', 0);
  return s + etincelle(27.6, 21, 1.4);
}

// Tout ramasser : un panier d'osier plein (une pomme, un poisson, une pierre)
function ramasser() {
  const osier = '#D2A062', osierS = '#A87A42';
  let s = P('M8.4,14 Q8.4,3.6 16,3.6 Q23.6,3.6 23.6,14', 'none', 0).replace('stroke="none"', `stroke="${OUT}" stroke-width="3.4" stroke-linecap="round"`) + P('M8.4,14 Q8.4,3.6 16,3.6 Q23.6,3.6 23.6,14', 'none', 0).replace('stroke="none"', `stroke="${osier}" stroke-width="1.6" stroke-linecap="round"`);
  // le contenu
  s += P('M17,13.6 Q17.4,9.4 21.6,8.6 Q25,9 24.8,12.6 Q24.4,14.6 22.4,14.6 Z', '#A8A39A', WI);
  s += P('M7.6,14.4 Q8.4,10 12.6,9.8 Q15.6,10.4 16.6,13 L16,14.6 Z', '#6CB8DC', WI) + rond(14.2, 11.8, 0.6, '#2A2420', 0);
  s += rond(15.4, 12.2, 3.6, '#E04E3E', WI) + reflet(14.2, 11, 0.8, 1.1, 0.75) + L([15.6, 8.8], [16.2, 7.2], '#8A5A30', 1);
  // le panier
  const B = 'M5,14 L27,14 L24.4,26.6 Q24,28.4 22,28.4 L10,28.4 Q8,28.4 7.6,26.6 Z';
  s += P(B, osier, 0) + clip('ram', B, `<path d="M19,29 L27,14 L28,14 L28,30 Z" fill="${osierS}"/>` + [18.4, 22.6].map(y => `<path d="M4,${y} L28,${y}" stroke="${osierS}" stroke-width="0.9"/>`).join('')
    + [9.6, 13, 16.4, 19.8, 23.2].map(x => `<path d="M${x},14 L${r2(x + (16 - x) * 0.12)},29" stroke="${osierS}" stroke-width="0.9"/>`).join('')) + P(B, 'none', WO);
  s += P(rr(4, 12.6, 24, 3.2, 1.6), osier, WO) + L([6, 13.6], [26, 13.6], '#E8C08A', 0.8);
  return s;
}

// Le carnet d'explorateur : un carnet de cuir vert-de-gris, la rose des vents dorée, l'élastique
function carnet() {
  const cuir = '#4F9A86', cuirS = '#3A7868', cuirH = '#7CC0AC';
  let s = P(rr(7.4, 4.6, 19, 23.8, 2), PAGE.corps, WO) + [8, 11, 14, 17, 20, 23].map(y => L([24.8, y], [26, y], PAGE.ombre, 0.6)).join('');
  const C = rr(5, 3.4, 19.8, 23.8, 2);
  s += P(C, cuir, 0) + clip('cac', C, `<path d="M14,28 L25,17 L25,28 Z" fill="${cuirS}" opacity=".6"/>`) + P(C, 'none', WO);
  s += P(rr(7, 5.4, 15.8, 19.8, 1.2), 'none', 0).replace('stroke="none"', `stroke="${cuirH}" stroke-width="0.7" stroke-dasharray="1.2 0.9"`);
  // la rose des vents
  s += P('M14.9,8.6 L16.4,13.8 L21.6,15.3 L16.4,16.8 L14.9,22 L13.4,16.8 L8.2,15.3 L13.4,13.8 Z', OR.corps, WI) + P('M14.9,8.6 L16.4,13.8 L14.9,15.3 Z M21.6,15.3 L16.4,16.8 L14.9,15.3 Z M14.9,22 L13.4,16.8 L14.9,15.3 Z M8.2,15.3 L13.4,13.8 L14.9,15.3 Z', OR.ombre, 0) + rond(14.9, 15.3, 1, OR.clair, WI);
  // l'élastique
  s += P(rr(20.8, 2.6, 2.4, 25.6, 1), '#C9483A', WI);
  return s + reflet(8.6, 7.4, 1.6, 0.7, 0.45);
}

// Les trouvailles : des cristaux sur un rocher (la glace, l'ambre, l'obsidienne des climats)
function trouvailles() {
  let s = P('M4.6,26.4 Q5.6,21.6 11,21 L21.6,20.6 Q27.4,21.2 27.6,26.4 Q16,29.6 4.6,26.4 Z', '#A8A39A', WO) + reflet(9.6, 23.4, 1.6, 0.6, 0.5);
  // l'ambre à gauche, l'obsidienne à droite, la glace au milieu
  s += P('M6.8,23.4 L7.4,15.6 L10.4,13 L12.6,16 L12.4,22.6 Z', '#F2B04A', WI) + P('M10.4,13 L12.6,16 L12.4,22.6 L10.2,23 Z', '#D48A2A', 0);
  s += P('M19.8,22.8 L20.4,16.4 L23.4,14.2 L26,17 L25.2,23 Z', '#5A4A6E', WI) + P('M23.4,14.2 L26,17 L25.2,23 L23,23.2 Z', '#3E3252', 0) + L([21, 17.4], [22.6, 15.6], '#9A88B4', 0.8);
  const G = 'M11.6,23.6 L12.6,9.4 L16.4,4 L20.2,9.4 L21,23.6 Z';
  s += P(G, '#BDE6F6', 0) + clip('trg', G, `<path d="M16.4,4 L20.2,9.4 L21,24 L16.4,24 Z" fill="#8CCBE6"/>`) + P(G, 'none', WO) + L([16.4, 4.6], [16.4, 23.2], '#E8F7FD', 0.7) + L([12.8, 9.6], [20, 9.6], '#E8F7FD', 0.6);
  return s + etincelle(24.8, 7.6, 1.8) + etincelle(7.6, 9.6, 1.1);
}

// L'expédition : une boussole de laiton, l'aiguille vers le nord-est
function expedition() {
  let s = P('M13.4,4.8 Q16,1.4 18.6,4.8', 'none', 0).replace('stroke="none"', `stroke="${OUT}" stroke-width="3.2" stroke-linecap="round"`) + P('M13.4,4.8 Q16,1.4 18.6,4.8', 'none', 0).replace('stroke="none"', `stroke="${OR.corps}" stroke-width="1.4" stroke-linecap="round"`);
  s += rond(16, 17, 12.2, OR.ombre) + rond(15.6, 16.6, 11.2, OR.corps, 0) + rond(16, 17, 8.8, '#FBF3DE', WI);
  s += [0, 1, 2, 3].map(i => { const a = i * Math.PI / 2; return L([16 + 7.4 * Math.sin(a), 17 - 7.4 * Math.cos(a)], [16 + 8.4 * Math.sin(a), 17 - 8.4 * Math.cos(a)], OUT, 1); }).join('');
  // l'aiguille : rouge vers le nord-est, bleue à l'opposé
  s += `<g transform="rotate(38 16 17)">${P('M16,9.6 L18.4,17 L13.6,17 Z', '#D8443A', WI)}${P('M16,24.4 L18.4,17 L13.6,17 Z', '#4A7EC8', WI)}</g>` + rond(16, 17, 1.2, OR.fonce, WI);
  s += P('M6.6,12.4 Q8.4,7.6 13.4,6.2', 'none', 0).replace('stroke="none"', 'stroke="#FFF2C0" stroke-width="1.4" stroke-linecap="round"');
  return s;
}

// L'ordre de publication, le nom, et où le jeu s'en sert
const ICONES = [
  ['grimoire', 'Grimoire', grimoire, 'l\'onglet du Grimoire'],
  ['ile', 'Île', ile, 'l\'onglet de l\'île'],
  ['defis', 'Défis', defis, 'l\'onglet des Défis'],
  ['sceau', 'Sceau', sceau, 'l\'onglet du Sceau (le compte, les succès)'],
  ['sac', 'Sac', sac, 'le sac de la v6 (étape 4) : ce que le joueur a ramassé'],
  ['taches', 'Tâches', taches, 'les tâches de Brume (v6, étape 6)'],
  ['menu', 'Menu', menu, 'le menu de la v6 (étape 6) : l\'avatar, les réglages'],
  ['ecu', 'Écu', ecu, 'le compteur d\'écus, les prix, les gains'],
  ['pierre', 'Pierre', pierre, 'la ressource pierre (stock, Récolte, prix)'],
  ['bois', 'Bois', bois, 'la ressource bois'],
  ['eau', 'Eau', eau, 'la ressource eau'],
  ['nourriture', 'Nourriture', nourriture, 'la ressource nourriture, le besoin « manger »'],
  ['poisson', 'Poisson', poisson, 'le poisson (ce que produit le Ponton)'],
  ['recolte', 'Récolte', recolte, 'le bouton de la Récolte'],
  ['ramasser', 'Tout ramasser', ramasser, 'le bouton « Tout ramasser »'],
  ['carnet', 'Carnet d\'explorateur', carnet, 'le bouton du carnet d\'explorateur'],
  ['trouvailles', 'Trouvailles', trouvailles, 'le bouton des trouvailles des climats'],
  ['expedition', 'Expédition', expedition, 'une expédition en cours']
];

module.exports = { ICONES };
