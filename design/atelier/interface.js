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

// ---- les fiches : besoins, humeurs, amitié ----

// un trait de couleur aux bouts ronds, et le même cerné de brun (manche, tige, ficelle)
const trait = (d, color, w) => P(d, 'none', 0).replace('stroke="none"', `stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"`);
const cerne = (d, color, w) => trait(d, OUT, w + 2 * WO * 0.85) + trait(d, color, w);

// Les outils (le besoin « travailler ») : le marteau et la clé croisés
function outils() {
  let s = cerne('M8.6,24.6 L22,10.6', '#9AA4B4', 2.6) + P('M19.6,6.4 Q23.4,3 27,5.4 L24.2,8.2 L25,10.2 L27,11 L29.6,8.2 Q31.2,12 28,15 Q25.2,17 22.2,15.4 Z', '#9AA4B4', WO) + rond(9, 24.2, 2.2, '#9AA4B4');
  s += rond(9, 24.2, 0.9, '#5E6676', 0) + L([20.6, 9.6], [24.6, 13.2], '#D6DCE6', 0.8);
  // le marteau, par-dessus : le manche de bois, la tête de fer
  s += cerne('M23.6,25.6 L11,12.4', BOIS.corps, 2.8) + L([22.8, 24], [13, 13.6], BOIS.clair, 0.9);
  s += `<g transform="rotate(-46 9.6 10.6)">${P(rr(3.6, 7.8, 12, 5.8, 1.4), '#8E96A6', WO)}${P(rr(4.6, 8.6, 4.4, 1.4, 0.6), '#C8CED8', 0)}</g>`;
  return s;
}

// La fleur (le besoin « se distraire ») : cinq pétales roses, un cœur doré, une feuille
function fleur() {
  let s = cerne('M16,18 Q15.4,24 16.4,29', '#5E9A3C', 1.6) + P('M16.2,25 Q20.6,20.6 25,22.6 Q21.4,27 16.2,25 Z', '#7DB852', WI) + L([17.4, 24.8], [22.4, 22.8], '#5E9A3C', 0.6);
  const petales = Array.from({ length: 5 }, (_, i) => { const a = -Math.PI / 2 + i * 2 * Math.PI / 5; return [16 + 5.8 * Math.cos(a), 12.4 + 5.8 * Math.sin(a), 4.4]; });
  s += boules(petales, '#F6A6C0') + petales.map(([x, y]) => reflet(x - 1.2, y - 1.2, 1, 0.7, 0.55)).join('');
  s += rond(16, 12.4, 3.4, OR.corps, WI) + rond(15, 11.4, 1, OR.clair, 0);
  return s;
}

// Les humeurs : un petit visage rond (joie, calme, bouderie), les joues roses, les yeux de la troupe
const visage = (bouche, yeux, extra = '') => rond(16, 16.6, 12, '#FFD978') + clip('vis', 'M4,16.6 A12,12 0 1 0 28,16.6 A12,12 0 1 0 4,16.6 Z', '<circle cx="20" cy="21" r="12" fill="#F2BF52"/>') + rond(16, 16.6, 12, 'none')
  + E(8.8, 20.2, 2.2, 1.3, 'rgba(240,120,110,.55)', 0) + E(23.2, 20.2, 2.2, 1.3, 'rgba(240,120,110,.55)', 0) + yeux + bouche + extra + reflet(10.6, 9.6, 2, 1.1, 0.6);
const oeil = (x, y) => E(x, y, 1.6, 2.2, '#2A2420', 0) + rond(x - 0.5, y - 0.8, 0.6, '#FFFFFF', 0);
function humeurJoie() {
  return visage(P('M11.6,19.6 Q16,25.6 20.4,19.6 Q16,21.2 11.6,19.6 Z', '#B8483A', WI), trait('M9.4,15.6 Q11,13.4 12.6,15.6', OUT, 1.3) + trait('M19.4,15.6 Q21,13.4 22.6,15.6', OUT, 1.3));
}
function humeurCalme() {
  return visage(trait('M12.8,21 Q16,23 19.2,21', OUT, 1.2), oeil(11, 15.2) + oeil(21, 15.2));
}
function humeurBouderie() {
  // les sourcils tristes (relevés au milieu), la moue, un petit nuage gris : il lui manque quelque chose
  return visage(trait('M13.2,22.4 Q16,20.6 18.8,22.4', OUT, 1.2), oeil(11, 16.2) + oeil(21, 16.2) + trait('M8.4,13.4 Q10.6,13.4 12.6,12', OUT, 1.1) + trait('M23.6,13.4 Q21.4,13.4 19.4,12', OUT, 1.1),
    `<g opacity=".95">${boules([[24.6, 5.4, 2.4], [27.6, 6.2, 2], [22.2, 6.8, 1.6]], '#CCD4E1', '#6E7890', 1)}</g>`);
}

// Le cœur de l'amitié : rouge, son reflet
function coeur() {
  const D = 'M16,27.4 Q4.4,19.6 4,11.4 Q4,5 9.8,4.6 Q14,4.6 16,9 Q18,4.6 22.2,4.6 Q28,5 28,11.4 Q27.6,19.6 16,27.4 Z';
  let s = P(D, '#E8566A', 0) + clip('coe', D, '<path d="M16,28 Q27,20 28,12 L30,12 L30,30 Z" fill="#C83C52"/>') + P(D, 'none', WO);
  return s + E(10.2, 10.4, 2, 2.8, 'rgba(255,255,255,.75)', 0) + rond(13, 7.6, 0.8, 'rgba(255,255,255,.75)', 0);
}

// ---- le Grimoire et l'île ----

// Le verrou (scellé, pas encore ouvert) : un cadenas doré, son trou de serrure
function verrou() {
  let s = cerne('M10.4,15 L10.4,10.6 Q10.4,4.4 16,4.4 Q21.6,4.4 21.6,10.6 L21.6,15', '#B4BCC8', 2.4);
  const C = rr(6, 13.6, 20, 15, 3);
  s += P(C, OR.corps, 0) + clip('ver', C, `<rect x="6" y="23" width="20" height="6" fill="${OR.ombre}"/><rect x="20.4" y="13" width="6" height="16" fill="${OR.ombre}" opacity=".6"/>`) + P(C, 'none', WO);
  s += rond(16, 19.6, 2, '#5A3A1C', 0) + P('M15,20.6 L14.4,24.6 L17.6,24.6 L17,20.6 Z', '#5A3A1C', 0);
  return s + P('M8.4,17.4 Q8.6,15.2 10.8,15', 'none', 0).replace('stroke="none"', 'stroke="#FFF2C0" stroke-width="1.3" stroke-linecap="round"');
}

// L'inconnu (un élément pas encore trouvé) : une bouffée de brume et son point d'interrogation
function inconnu() {
  let s = boules([[10, 18, 6], [17, 13, 7.4], [23, 18.6, 5.6], [16, 21.4, 6]], '#E4E9F1', '#6E7890', WO);
  s += clip('inc', 'M2,30 L30,30 L30,20 Q16,26 2,20 Z', boules([[10, 18, 6], [17, 13, 7.4], [23, 18.6, 5.6], [16, 21.4, 6]], '#C4CDDC', 'rgba(0,0,0,0)', WO));
  s += reflet(13.4, 9.6, 2, 1.2, 0.8);
  s += trait('M13.4,12.6 Q13.6,9.4 16.6,9.4 Q19.6,9.6 19.4,12.4 Q19.2,14.2 17,15 Q16.2,15.4 16.2,17.2', '#5A6680', 2.2) + rond(16.2, 20.6, 1.3, '#5A6680', 0);
  return s;
}

// L'étincelle (une quête, une chose à faire, le dessin par défaut) : une grande étoile à quatre branches et deux petites
function etincelleIcone() {
  const quatre = (x, y, R, r) => `M${x},${r2(y - R)} Q${r2(x + r)},${r2(y - r)} ${r2(x + R)},${y} Q${r2(x + r)},${r2(y + r)} ${x},${r2(y + R)} Q${r2(x - r)},${r2(y + r)} ${r2(x - R)},${y} Q${r2(x - r)},${r2(y - r)} ${x},${r2(y - R)} Z`;
  let s = P(quatre(14, 17, 11.6, 1.8), OR.corps, WO) + P(quatre(14, 17, 6.4, 1), OR.clair, 0);
  s += P(quatre(25, 7.4, 4.6, 0.8), '#FFF0B0', WI) + P(quatre(25.4, 24.6, 3, 0.6), '#FFF0B0', WI);
  return s;
}

// Le chapitre du Grimoire (ce qu'il faut avoir ouvert) : un livre ouvert, ses lignes, le signet rouge
function chapitre() {
  let s = P('M3,9.6 Q9.6,6.4 16,9.6 Q22.4,6.4 29,9.6 L29,25.4 Q22.4,22.6 16,25.4 Q9.6,22.6 3,25.4 Z', '#A2432F', WO); // la couverture
  const G = 'M4.6,8.4 Q10.4,5.6 16,8.6 L16,24 Q10.4,21.4 4.6,23.4 Z', D = 'M16,8.6 Q21.6,5.6 27.4,8.4 L27.4,23.4 Q21.6,21.4 16,24 Z';
  s += P(G, PAGE.corps, WI) + P(D, PAGE.corps, WI) + clip('chd', D, `<path d="M16,8 L28,8 L28,25 L22,25 Q20,16 16,8 Z" fill="${PAGE.ombre}" opacity=".6"/>`);
  s += [12, 15, 18].map(y => L([6.6, y], [13.8, y - 0.6], '#C9B48E', 0.8) + L([18.2, y - 0.6], [25.4, y], '#C9B48E', 0.8)).join('');
  s += P('M21,6.4 L21,13.6 L22.6,12.2 L24.2,13.6 L24.2,6.4 Z', '#C9483A', WI);
  return s + L([16, 8.6], [16, 24], OUT, WI);
}

// Le plan d'un bâtiment : un rouleau de papier ouvert, une petite maison dessinée à l'encre bleue
function plan() {
  const papier = '#F4EBD2';
  let s = P('M6.4,7.2 L26,7.2 L26,25.6 L6.4,25.6 Z', papier, WO) + clip('pla', 'M6.4,7.2 L26,7.2 L26,25.6 L6.4,25.6 Z', `<rect x="21" y="7" width="5" height="19" fill="${PAGE.ombre}"/>`);
  s += trait('M10.6,21.4 L10.6,15.6 L16,11.2 L21.4,15.6 L21.4,21.4 Z M14.4,21.4 L14.4,17.6 L17.6,17.6 L17.6,21.4', '#3E78C8', 1);
  s += trait('M9.6,23.4 L22.4,23.4', '#8CB4E0', 0.7);
  // les deux rouleaux
  s += P(rr(4.2, 5, 4.4, 22.8, 2.2), '#E6D6B4', WO) + P(rr(23.8, 5, 4.4, 22.8, 2.2), '#E6D6B4', WO) + L([5.8, 7], [5.8, 25.8], '#FFF8E6', 0.8);
  return s;
}

// La carte (un quartier, une expédition) : pliée en trois, une route en pointillés jusqu'à la croix
function carte() {
  const D = 'M3,8 L11,5 L21,8 L29,5 L29,24 L21,27 L11,24 L3,27 Z';
  let s = P(D, '#F1E2BC', 0) + clip('car', D, '<path d="M11,5 L21,8 L21,27 L11,24 Z" fill="#E4D2A6"/><path d="M5,22 Q8,17 12,18 Q15,19 16,14" fill="none" stroke="#9CC97A" stroke-width="4" stroke-linecap="round"/><ellipse cx="25" cy="20" rx="3.4" ry="2.4" fill="#9ED0EE"/>') + P(D, 'none', WO);
  s += L([11, 5], [11, 24], OUT, WI) + L([21, 8], [21, 27], OUT, WI);
  s += trait('M6.6,22.4 Q9,15 14.6,14.6 Q19.6,14.4 21,11', '#9A5A34', 1.1).replace('stroke-linecap', 'stroke-dasharray="1.6 1.4" stroke-linecap');
  s += trait('M22.4,8.6 L26,12.2 M26,8.6 L22.4,12.2', '#C9483A', 1.6);
  return s;
}

// La pousse (les éléments « fertiles ») : deux feuilles qui sortent d'une motte
function pousse() {
  let s = P('M5.4,27 Q6.6,20.6 16,20.4 Q25.4,20.6 26.6,27 Q16,29.4 5.4,27 Z', '#9A6A3E', WO) + E(11.4, 23.2, 1.2, 0.6, '#B88458', 0) + E(20.4, 24.6, 1, 0.5, '#7A5030', 0);
  s += cerne('M16,21.4 Q15.6,16 16.4,11.6', '#6EA448', 1.6);
  s += P('M16.2,15.4 Q9.6,16.4 6.4,10.6 Q12.6,8.2 16.2,15.4 Z', '#8CC060', WO) + L([15.2, 14.6], [9.4, 11], '#5E9A3C', 0.7);
  s += P('M16.4,12 Q19.6,4.2 27,4.8 Q26,12.4 16.4,12 Z', '#8CC060', WO) + L([17.6, 11.2], [24.6, 6.4], '#5E9A3C', 0.7);
  return s + reflet(10.6, 11.4, 1, 0.5, 0.6) + reflet(22.4, 6.6, 1.2, 0.5, 0.6);
}

// ---- les trouvailles des climats ----

// La glace (les Cimes) : un cristal hexagonal, ses facettes
function glace() {
  const D = 'M16,3.4 L26.6,9.6 L26.6,22.4 L16,28.6 L5.4,22.4 L5.4,9.6 Z';
  let s = P(D, '#CDEBF8', 0) + clip('gla', D, '<path d="M16,16 L26.6,9.6 L26.6,22.4 L16,28.6 Z" fill="#9CD2EC"/><path d="M16,16 L16,28.6 L5.4,22.4 Z" fill="#B6E0F4"/>') + P(D, 'none', WO);
  s += P('M16,3.4 L16,16 L26.6,9.6 M16,16 L5.4,22.4 M16,16 L16,28.6', 'none', WI);
  return s + P('M8.4,10.8 L13.6,7.8', 'none', 0).replace('stroke="none"', 'stroke="#FFFFFF" stroke-width="1.4" stroke-linecap="round"') + etincelle(25.6, 4.6, 1.4);
}

// La laine (les Landes) : une pelote, ses brins, deux aiguilles à tricoter plantées dedans
function laine() {
  const fil = '#E7C2C8', filS = '#C99AA2';
  // les aiguilles, derrière la pelote (leurs pointes et leurs boutons dépassent)
  let s = cerne('M5,6.4 L27.6,25.4', BOIS.clair, 1.4) + cerne('M27,4.4 L6.6,27.6', BOIS.clair, 1.4) + rond(5, 6.4, 1.6, '#C9483A', WI) + rond(27, 4.4, 1.6, '#C9483A', WI);
  s += rond(15.4, 15.6, 11.2, fil) + clip('lai', 'M4.2,15.6 A11.2,11.2 0 1 0 26.6,15.6 A11.2,11.2 0 1 0 4.2,15.6 Z', `<circle cx="20" cy="20" r="11" fill="${filS}" opacity=".55"/>`
    + ['M6,10 Q16,14 24,6', 'M5,16 Q15,20 25,10', 'M6,22 Q16,25 26,16', 'M10,5 Q14,16 10,26', 'M17,4.6 Q22,15 18,26.8'].map(d => `<path d="${d}" fill="none" stroke="${filS}" stroke-width="0.9" stroke-linecap="round"/>`).join('')) + rond(15.4, 15.6, 11.2, 'none');
  return s + reflet(10.4, 9.6, 2.2, 1.2, 0.6);
}

// Le roseau (le Marais) : trois roseaux noués, leurs épis bruns
function roseau() {
  let s = cerne('M10.4,29 L12,9.4', '#7DA850', 1.6) + cerne('M16,29 L16,6.4', '#7DA850', 1.6) + cerne('M21.6,29 L20.2,10.4', '#7DA850', 1.6);
  s += [[12, 9.4, -5], [16, 6.4, 0], [20.2, 10.4, 5]].map(([x, y, a]) => `<g transform="rotate(${a} ${x} ${y})">${P(rr(x - 1.8, y - 1, 3.6, 8.6, 1.8), '#9A6A3E', WO)}${L([x - 0.6, y + 1], [x - 0.6, y + 6], '#B88458', 0.7)}</g>`).join('');
  s += P('M16.4,23 Q22,18.6 25.4,20.4 Q21.6,24.4 16.4,23 Z', '#8CC060', WI);
  // le lien de raphia
  return s + P(rr(9.6, 21.6, 12.8, 2.6, 1.2), '#E2C083', WI);
}

// Le sel (les Dunes) : un petit tas blanc dans une coupelle de bois, ses grains
function sel() {
  const tas = 'M7.6,15.6 Q7.8,10.2 11.6,9.4 Q12.6,4.2 16.6,4 Q20.8,4.4 21.6,9.4 Q24.6,10.4 24.4,15.6 Z';
  let s = P(tas, '#FBFBF6', WO) + clip('sel', tas, '<ellipse cx="21.4" cy="15" rx="6" ry="6" fill="#E2E6EA"/>');
  s += [[13, 11.6], [17.2, 8.2], [19.8, 12], [10.2, 12.8], [15.4, 13.6]].map(([x, y]) => `<rect x="${x}" y="${y}" width="1.7" height="1.7" rx="0.2" fill="#FFFFFF" stroke="#9AA4B0" stroke-width="0.5" transform="rotate(20 ${x} ${y})"/>`).join('');
  s += P('M3.6,15 L28.4,15 Q27.4,25.6 16,26 Q4.6,25.6 3.6,15 Z', BOIS.corps, WO) + clip('sco', 'M3.6,15 L28.4,15 Q27.4,25.6 16,26 Q4.6,25.6 3.6,15 Z', `<path d="M18,26 Q27,24 28.4,15 L30,15 L30,27 Z" fill="${BOIS.ombre}"/>`);
  s += E(16, 15, 12.4, 1.8, BOIS.clair, WO) + E(16, 14.6, 8.6, 1, '#FBFBF6', 0);
  return s + etincelle(25.4, 7, 1.4);
}

// Les fruits (la Jungle) : un ananas, sa couronne de feuilles
function fruits() {
  let s = P('M16,12.4 L12,3.4 L15,6.6 L16.2,2.2 L17.6,6.8 L21,3.6 L18,12.4 Z', '#6EA448', WO) + L([16.2, 5], [16.2, 11.4], '#4E7A3A', 0.6);
  const D = 'M16,11.4 Q24,11.6 24.4,20 Q24.2,28.8 16,29 Q7.8,28.8 7.6,20 Q8,11.6 16,11.4 Z';
  s += P(D, '#F2B640', 0) + clip('fru', D, '<path d="M19,29 Q25,25 24.6,15 L27,15 L27,30 Z" fill="#D4902A"/>'
    + ['M8,16 L21,29', 'M10,12.6 L24.6,27', 'M14,11.4 L25,22', 'M24,16 L11,29', 'M22,12.6 L7.4,27', 'M18,11.4 L7.4,22'].map(d => `<path d="${d}" stroke="#B8761E" stroke-width="0.8"/>`).join('')) + P(D, 'none', WO);
  return s + reflet(11.6, 16.4, 1.2, 2, 0.5);
}

// L'obsidienne (le Volcan) : une pierre noire et brillante, ses facettes, un reflet violet
function obsidienne() {
  const D = 'M6.6,22.6 L5.4,12.4 L13,4.4 L23.6,6.4 L27.4,15.6 L23.4,26.4 L12.4,28 Z';
  let s = P(D, '#4C4160', 0) + clip('obs', D, '<path d="M13,4.4 L23.6,6.4 L27.4,15.6 L17,15 Z" fill="#76669A"/><path d="M27.4,15.6 L23.4,26.4 L12.4,28 L17,15 Z" fill="#342A42"/><path d="M5.4,12.4 L13,4.4 L17,15 L6.6,22.6 Z" fill="#5C4F72"/>') + P(D, 'none', WO);
  s += P('M13,4.4 L17,15 L27.4,15.6 M17,15 L6.6,22.6 M17,15 L12.4,28', 'none', WI).replace(`stroke="${OUT}"`, 'stroke="#1E1824"');
  return s + P('M9,11.6 L12.6,7.6', 'none', 0).replace('stroke="none"', 'stroke="#B8A6D8" stroke-width="1.4" stroke-linecap="round"') + etincelle(24.8, 9.6, 1.3);
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
  ['expedition', 'Expédition', expedition, 'une expédition en cours'],
  ['outils', 'Outils', outils, 'le besoin « travailler » (fiche d\'un camarade, bulle de besoin)'],
  ['fleur', 'Fleur', fleur, 'le besoin « se distraire »'],
  ['humeur_joie', 'Humeur : joie', humeurJoie, 'l\'humeur d\'un camarade : content'],
  ['humeur_calme', 'Humeur : calme', humeurCalme, 'l\'humeur d\'un camarade : tranquille'],
  ['humeur_bouderie', 'Humeur : bouderie', humeurBouderie, 'l\'humeur d\'un camarade : il lui manque quelque chose'],
  ['coeur', 'Cœur', coeur, 'l\'amitié d\'un camarade (cœurs de la fiche, récompenses)'],
  ['verrou', 'Verrou', verrou, 'ce qui est scellé : un chapitre, un rang de l\'établi'],
  ['inconnu', 'Inconnu', inconnu, 'un élément pas encore trouvé'],
  ['etincelle', 'Étincelle', etincelleIcone, 'une quête, une chose à faire, le dessin par défaut'],
  ['chapitre', 'Chapitre', chapitre, 'le chapitre du Grimoire qu\'il faut avoir ouvert'],
  ['plan', 'Plan', plan, 'le plan d\'un bâtiment (au-dessus d\'un chantier, étapes d\'un bâtiment)'],
  ['carte', 'Carte', carte, 'un quartier, une expédition'],
  ['pousse', 'Pousse', pousse, 'le filtre « fertiles » du Grimoire'],
  ['glace', 'Glace', glace, 'la trouvaille des Cimes'],
  ['laine', 'Laine', laine, 'la trouvaille des Landes'],
  ['roseau', 'Roseau', roseau, 'la trouvaille du Marais'],
  ['sel', 'Sel', sel, 'la trouvaille des Dunes'],
  ['fruits', 'Fruits', fruits, 'la trouvaille de la Jungle'],
  ['obsidienne', 'Obsidienne', obsidienne, 'la trouvaille du Volcan']
];

module.exports = { ICONES };
