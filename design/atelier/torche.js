// La torche de bois flotté (HISTOIRE.md § 9, étape 12 ; § 6.15 : les lumières repoussent les égarés et les changent en
// lucioles). Un seul dessin pour la boutique (on l'achète, on la pose sur une case, sur le chemin des égarés), le camp et
// la veillée (scenes6.js) : un poteau de bois flotté planté entre trois galets, une ligature de corde, une tête de toile
// tressée et poissée, la flamme et sa lueur. Allumée : 3 images en boucle ; éteinte : la tête charbonnée, un filet de
// fumée. Échelle du jeu × 1,25 (case de 80 × 40), ancre (0, 0) au centre de la case.
const { OUT, P, E, r2 } = require('./troupe');

const TETE = -45.4; // le haut de la tête de toile, où la flamme prend
const BOIS = { corps: '#D6C3A2', ombre: '#B29C78', clair: '#EADCC0' }; // bois flotté, blanchi par le sel
const CORDE = '#C9A66B';
const TOILE = { corps: '#8A5A30', ombre: '#6A4224', brule: '#3E2A1C' };
const trait = (d, color, w) => `<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;

// La lumière de nuit, pour le jeu : [u, v, z, rayon, couleur] comme celle des créations (craftSprites.js, craftLight) ;
// z : la hauteur de la flamme en px du jeu (la bibliothèque est à × 1,25)
const LUMIERE = [0, 0, 43, 38, '255,186,96'];

// une langue de flamme (la flamme cernée du moteur de l'île : port/src/world/sprites.js, flameFrames)
const langue = ([tip, r, base, l], k, s, fill, contour) => `<path d="M${r2(base[0] * k)},${r2(base[1] * k)} C${r2((r[0] + 3 * s) * k)},${r2(r[1] * k)} ${r2((tip[0] + 2 * s) * k)},${r2((tip[1] + 8 * s) * k)} ${r2(tip[0] * k)},${r2(tip[1] * k)} C${r2((tip[0] - 2 * s) * k)},${r2((tip[1] + 8 * s) * k)} ${r2((l[0] - 3 * s) * k)},${r2(l[1] * k)} ${r2(base[0] * k)},${r2(base[1] * k)} Z" fill="${fill}"${contour ? ` stroke="${OUT}" stroke-width="0.8" stroke-linejoin="round"` : ''}/>`;
const FORMES = [[[0, -22], [7, -6], [0, 0], [-7, -6]], [[2, -24], [7, -7], [0, 0], [-6, -5]], [[-2, -21], [6, -5], [0, 0], [-7, -7]]];
const ETINCELLES = [[[5, -27], [-6, -18]], [[-4, -30], [7, -21]], [[3, -32], [-7, -25]]];
function flamme(n, s = 0.9) {
  const f = FORMES[n % 3].map(([x, y]) => [x * s, y * s]);
  return langue(f, 1, s, '#EE6A3A', true) + langue(f, 0.78, s, '#F7A23B') + langue(f, 0.5, s, '#FFE07A')
    + ETINCELLES[n % 3].map(([x, y], j) => `<circle cx="${r2(x * s)}" cy="${r2(y * s)}" r="${r2((j ? 0.8 : 1.1) * s)}" fill="#FFD27A"/>`).join('');
}
// la lueur autour de la flamme (sous elle)
const lueur = (y, n) => [20, 14, 9].map((r, i) => `<circle cx="0" cy="${r2(y)}" r="${r2(r + [0, 0.8, -0.6][n % 3])}" fill="rgba(255,200,110,${[0.1, 0.14, 0.2][i]})"/>`).join('');

// Le pied, le poteau, la corde, la tête (commun aux deux états)
function corps(eteinte) {
  let s = E(1, 1.2, 10, 4.6, 'rgba(40,55,20,.2)', 0);
  // le poteau : un peu tordu, son côté droit dans l'ombre, un nœud
  const poteau = 'M0,0.6 Q-1.2,-14 0.2,-26 Q1,-32 0.6,-37';
  s += trait(poteau, OUT, 5.6) + trait(poteau, BOIS.corps, 3.4) + trait('M1.2,-1 Q0.2,-14 1.4,-26 Q2,-31 1.8,-35', BOIS.ombre, 1) + trait('M-1.2,-3 Q-2,-12 -1.2,-20', BOIS.clair, 0.8);
  s += E(-0.6, -15.6, 1, 1.4, BOIS.ombre, 0.6);
  // trois galets autour du pied
  s += [[-5.4, 1.4, 3, 2], [5, 1.8, 3.2, 2.2], [0.4, 3.6, 2.6, 1.7]].map(([x, y, rx, ry]) => E(x, y, rx, ry, '#B4AEA4', 0.9) + E(x - rx * 0.3, y - ry * 0.35, rx * 0.35, ry * 0.3, 'rgba(255,255,255,.6)', 0)).join('');
  // la ligature de corde, sous la tête
  s += [-33.2, -31.2, -29.2].map(y => trait(`M-2.6,${r2(y + 0.8)} L3.4,${r2(y - 0.6)}`, OUT, 2.4) + trait(`M-2.6,${r2(y + 0.8)} L3.4,${r2(y - 0.6)}`, CORDE, 1.1)).join('');
  // la tête de toile tressée : une coupe, ses brins, le haut charbonné
  const T = `M-4.2,-36.6 Q-5.8,-41.4 -5.6,${TETE} L5.8,${TETE} Q6,-41.4 4.6,-36.6 Q0.2,-35.2 -4.2,-36.6 Z`;
  s += P(T, TOILE.corps, 1) + `<clipPath id="trc${eteinte ? 'e' : ''}"><path d="${T}"/></clipPath><g clip-path="url(#trc${eteinte ? 'e' : ''})"><rect x="1.6" y="-47" width="6" height="12" fill="${TOILE.ombre}"/>`
    + [-43.4, -41.2, -39].map(y => trait(`M-6,${y} Q0,${r2(y + 1.4)} 6,${y}`, TOILE.ombre, 0.7)).join('') + `</g>`;
  s += E(0.1, TETE, 5.7, 1.9, eteinte ? TOILE.brule : '#5E3A22', 1) + (eteinte ? E(-1.4, TETE - 0.3, 1.6, 0.6, '#6A5848', 0) : E(0.1, TETE, 4.2, 1.2, '#F28A2E', 0));
  return s;
}

// La torche : 'allumee' (n : l'image 0, 1, 2, en boucle) ou 'eteinte'
function torche(etat = 'allumee', n = 0) {
  if (etat === 'eteinte') {
    // un filet de fumée grise qui monte de la tête charbonnée
    return corps(true) + `<g opacity=".75">${trait(`M0.4,${TETE - 1.6} Q-2.4,${TETE - 5} 0.6,${TETE - 8} Q3.4,${TETE - 11} 0.8,${TETE - 14.6}`, '#9AA0A8', 1.6)}</g>`
      + `<circle cx="1.6" cy="${TETE - 17}" r="1.4" fill="rgba(170,176,184,.6)"/>`;
  }
  return lueur(TETE - 9, n) + corps(false) + `<g transform="translate(0 ${r2(TETE + 0.6)})">${flamme(n)}</g>`;
}

// L'icône de la boutique (32 × 32), au trait des icônes de l'interface : la torche penchée, sa flamme, une étincelle
function torcheIcone() {
  const WO = 1.3;
  let s = `<g transform="rotate(16 16 17)">`;
  s += trait('M16,30 L16,14.6', OUT, 4.6) + trait('M16,30 L16,14.6', BOIS.corps, 2.2) + trait('M16.8,29 L16.8,15.6', BOIS.ombre, 0.7);
  s += [21, 19.4].map(y => trait(`M13.8,${r2(y + 0.7)} L18.2,${r2(y - 0.5)}`, OUT, 2.2) + trait(`M13.8,${r2(y + 0.7)} L18.2,${r2(y - 0.5)}`, CORDE, 1)).join('');
  const T = 'M12.6,16.6 Q11.6,13 11.8,11 L20.2,11 Q20.4,13 19.4,16.6 Q16,17.6 12.6,16.6 Z';
  s += `<path d="${T}" fill="${TOILE.corps}" stroke="${OUT}" stroke-width="${WO}" stroke-linejoin="round"/>` + trait('M12,13.4 Q16,14.6 20,13.4', TOILE.ombre, 0.7);
  s += E(16, 11, 4.2, 1.4, '#F28A2E', 1);
  s += `<g transform="translate(16 11.6) scale(0.42)">${flamme(0, 1)}</g></g>`;
  return s + `<path d="M25.4,6.4 L25.8,7.6 L27,8 L25.8,8.4 L25.4,9.6 L25,8.4 L23.8,8 L25,7.6 Z" fill="#FFF6C8" stroke="#E8C860" stroke-width="0.5"/>`;
}

module.exports = { torche, torcheIcone, LUMIERE, TETE };
