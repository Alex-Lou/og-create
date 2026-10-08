// Le HUD de l'île en bois et parchemin, au trait de la bibliothèque : la barre du haut (la bourse d'écus, les tuiles
// des réserves, les boutons Récolte et « Tout ramasser »), les boutons posés sur l'île (coffres, carnet, trouvailles,
// boussole, zoom, plein écran), l'horloge et la barre d'onglets du bas.
// Deux sortes de pièces : les cadres extensibles (9-slice, à poser en border-image : leurs coins ne bougent pas, leurs
// bords et leur milieu s'étirent ; les bords n'ont que des lignes dans le sens où ils s'étirent) et les pièces entières.
// Chaque pièce est dessinée en pixels d'affichage (viewBox) ; le fichier déclare une taille 4 fois plus grande, pour
// rester net sur un canvas (haute définition). preview_hud.mjs les publie.
const { OUT, P, E, L, clip, r2 } = require('./troupe');

const W = 1.4; // le contour
const BOIS = { clair: '#E2BC88', corps: '#B98A55', ombre: '#8E623A', fonce: '#6E4A2A', veine: '#A47848' };
const PAPIER = { corps: '#FBF3DE', ombre: '#E9DAB8', clair: '#FFFBF0' };
const OR = { clair: '#FFE596', corps: '#F2C04B', ombre: '#C8902A', fonce: '#A8741C' };
const ETEINT = { clair: '#EDE6D8', corps: '#D6CCBA', ombre: '#B0A48E' };
const SOMBRE = { corps: '#5A3A22', ombre: '#43291A', clair: '#7A5434' };

// un rectangle aux coins arrondis (chemin)
const rr = (x, y, w, h, r) => { r = Math.min(r, w / 2, h / 2); return `M${r2(x + r)},${r2(y)} L${r2(x + w - r)},${r2(y)} Q${r2(x + w)},${r2(y)} ${r2(x + w)},${r2(y + r)} L${r2(x + w)},${r2(y + h - r)} Q${r2(x + w)},${r2(y + h)} ${r2(x + w - r)},${r2(y + h)} L${r2(x + r)},${r2(y + h)} Q${r2(x)},${r2(y + h)} ${r2(x)},${r2(y + h - r)} L${r2(x)},${r2(y + r)} Q${r2(x)},${r2(y)} ${r2(x + r)},${r2(y)} Z`; };
const rond = (x, y, r, fill, w = W) => E(x, y, r, r, fill, w);
const trait = (d, color, w) => `<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
// un clou doré (dans les coins seulement : ils ne s'étirent pas)
const clou = (x, y) => rond(x, y, 1.15, OR.corps, 0.8) + rond(x - 0.35, y - 0.35, 0.4, OR.clair, 0);
const etincelle = (x, y, s = 1) => `<path d="M${r2(x)},${r2(y - 1.6 * s)} L${r2(x + 0.4 * s)},${r2(y - 0.4 * s)} L${r2(x + 1.6 * s)},${r2(y)} L${r2(x + 0.4 * s)},${r2(y + 0.4 * s)} L${r2(x)},${r2(y + 1.6 * s)} L${r2(x - 0.4 * s)},${r2(y + 0.4 * s)} L${r2(x - 1.6 * s)},${r2(y)} L${r2(x - 0.4 * s)},${r2(y - 0.4 * s)} Z" fill="#FFF6C8" stroke="#E8C860" stroke-width="${r2(0.35 * s)}"/>`;

// La plaque : un cadre de bois aux coins ronds, sa lèvre sombre en bas (le relief), le reflet en haut, deux veines dans
// les bandes du haut et du bas ; dedans, un panneau (parchemin, or, bois sombre…) avec son ombre portée en haut.
// enfonce : le panneau descend (bouton appuyé, la lèvre se tasse). clous : un clou doré dans chaque coin.
function plaque(id, w, h, { r = 10, rebord = 4, levre = 3, face = PAPIER, bois = BOIS, clous = true, enfonce = 0 } = {}) {
  const o = rr(0.7, 0.7, w - 1.4, h - 1.4, r);
  const l = enfonce ? 1 : levre;
  let s = P(o, bois.ombre, 0) + clip(`${id}o`, o, `<path d="${rr(0.7, 0.7, w - 1.4, h - 1.4 - l, r)}" fill="${bois.corps}"/>`
    + trait(`M${r2(r)},2.4 L${r2(w - r)},2.4`, bois.clair, 1.1)
    + trait(`M${r2(r + 2)},${r2(rebord * 0.55 + 1.2)} L${r2(w - r - 6)},${r2(rebord * 0.55 + 1.2)}`, bois.veine, 0.5)
    + trait(`M${r2(r + 6)},${r2(h - l - rebord * 0.5)} L${r2(w - r - 2)},${r2(h - l - rebord * 0.5)}`, bois.veine, 0.5)) + P(o, 'none', W);
  if (face) {
    const fy = rebord + enfonce * 0.6, fh = h - 2 * rebord - l + 0.4;
    const f = rr(rebord, fy, w - 2 * rebord, fh, Math.max(r - rebord * 0.8, 2));
    s += P(f, face.corps, 0) + clip(`${id}f`, f, `<rect x="0" y="${r2(fy - 1)}" width="${w}" height="2.6" fill="${face.ombre}"/>`
      + `<rect x="0" y="${r2(fy + fh - 1.6)}" width="${w}" height="2" fill="${face.clair || face.corps}" opacity=".7"/>`) + P(f, 'none', 1);
  }
  if (clous) { const cx = Math.max(r * 0.62, 3), cyH = rebord * 0.55 + 0.6, cyB = h - l - rebord * 0.55; s += clou(cx, cyH) + clou(w - cx, cyH) + clou(cx, cyB) + clou(w - cx, cyB); }
  return s;
}

// Le bouton : le cadre de bois, sa face dorée bombée (le reflet en haut, l'ombre en bas, la lèvre dorée) ; repos,
// appuye (la face descend, la lèvre se tasse) ou desactive (la face éteinte, beige)
function bouton(id, w, h, etat, { r = 14, face = OR } = {}) {
  const f = etat === 'desactive' ? ETEINT : face, enf = etat === 'appuye' ? 2.4 : 0;
  const lev = 4, reb = 3;
  let s = P(rr(0.7, 0.7, w - 1.4, h - 1.4, r), BOIS.ombre, 0) + clip(`${id}o`, rr(0.7, 0.7, w - 1.4, h - 1.4, r), `<path d="${rr(0.7, 0.7, w - 1.4, h - 1.4 - (enf ? 1.4 : lev), r)}" fill="${BOIS.corps}"/>`
    + trait(`M${r2(r)},2.2 L${r2(w - r)},2.2`, BOIS.clair, 1)) + P(rr(0.7, 0.7, w - 1.4, h - 1.4, r), 'none', W);
  const fy = reb + enf, fh = h - 2 * reb - (enf ? 1.4 : lev) - enf + 0.6;
  const F = rr(reb, fy, w - 2 * reb, fh, r - reb * 0.7);
  s += P(F, f.ombre, 0) + clip(`${id}f`, F, `<path d="${rr(reb, fy, w - 2 * reb, fh - 2.6, r - reb * 0.7)}" fill="${f.corps}"/>`
    + `<rect x="0" y="${r2(fy + 1.4)}" width="${w}" height="${r2(Math.max(fh * 0.28, 3))}" fill="${f.clair}" opacity=".75"/>`
    + trait(`M${r2(r)},${r2(fy + 2.2)} L${r2(w - r)},${r2(fy + 2.2)}`, '#FFFFFF', 1.1)) + P(F, 'none', 1);
  // les rivets des coins
  const cx = Math.max(r * 0.55, 3);
  s += [[cx, reb * 0.5 + 0.9], [w - cx, reb * 0.5 + 0.9]].map(([x, y]) => rond(x, y, 0.9, OR.fonce, 0.6)).join('');
  return s;
}

// ——— la barre du haut ———
const bourse = () => plaque('hbo', 64, 34, { r: 14 });
const tuileReserve = () => plaque('htu', 48, 48, { r: 10 });
const boutonRecolte = (etat) => () => bouton(`hre${etat[0]}`, 112, 60, etat, { r: 14 });
const boutonRamasser = (etat) => () => bouton(`hra${etat[0]}`, 96, 44, etat, { r: 18 });

// ——— les boutons de l'île ———
// le bouton carré : parchemin au repos, doré quand quelque chose attend, enfoncé quand on appuie
const boutonIle = (etat) => () => plaque(`hil${etat[0]}`, 48, 48, { r: 11, rebord: 4.4, face: etat === 'pret' ? OR : PAPIER, enfonce: etat === 'appuye' ? 2 : 0 })
  + (etat === 'pret' ? etincelle(41.6, 6.4, 1.6) : '');
const boutonZoom = (etat) => () => plaque(`hzo${etat[0]}`, 40, 40, { r: 10, rebord: 4, clous: false, enfonce: etat === 'appuye' ? 2 : 0 });
// l'étiquette de la boussole (le temps avant le retour de l'expédition) : bois sombre, le texte en crème
const etiquette = () => plaque('het', 72, 34, { r: 12, face: SOMBRE });
// la pastille de compte (ce qui attend) : une goutte de cire rouge cerclée de blanc, son reflet ; le chiffre en CSS
const pastille = () => rond(11, 11.4, 9.6, '#B83228', W) + rond(11, 10.6, 9, '#D9483C', 0) + rond(11, 10.6, 7.2, 'none', 0).replace('stroke="none"', 'stroke="#FFFFFF" stroke-width="1" stroke-opacity=".75"')
  + E(7.4, 6.8, 2.4, 1.4, 'rgba(255,255,255,.7)', 0);

// ——— l'horloge ———
const horlogeCadre = (etat) => () => plaque(`hho${etat[0]}`, 104, 38, { r: 15, face: etat === 'accelere' ? OR : PAPIER })
  + (etat === 'accelere' ? etincelle(96, 7, 1.5) + etincelle(8, 31, 1.1) : '');
// le fond du cadran (40 × 24) : le ciel en demi-cercle, la mer à l'horizon, une petite île ; l'arc du jour en pointillés
// (le jeu y pose le soleil ou la lune à sa place)
function cadran(nuit) {
  const D = 'M2,20.4 A18,18 0 0 1 38,20.4 Z';
  const ciel = nuit ? `<rect x="0" y="0" width="40" height="22" fill="#3E4A86"/><rect x="0" y="12" width="40" height="10" fill="#5A5C9E"/>`
    + [[10, 9], [16, 5], [27, 7], [31, 13], [20, 11], [7, 15]].map(([x, y], i) => rond(x, y, i % 2 ? 0.55 : 0.8, '#FFF6D0', 0)).join('')
    : `<rect x="0" y="0" width="40" height="22" fill="#9ED6F2"/><rect x="0" y="11" width="40" height="11" fill="#CDEBF6"/><rect x="0" y="16" width="40" height="6" fill="#FBE6B4"/>`;
  const mer = `<rect x="0" y="17.6" width="40" height="4" fill="${nuit ? '#2E3A6E' : '#5CB0E6'}"/>`
    + trait('M5,19 L9,19 M24,19.4 L29,19.4', nuit ? '#6E7CB8' : '#D8F1FF', 0.8)
    + `<path d="M26,18 Q28.4,14.6 31,15 Q33.6,15.6 34.4,18 Z" fill="${nuit ? '#4A5A3E' : '#7DB852'}" stroke="${OUT}" stroke-width="0.6"/>`;
  return P(D, nuit ? '#3E4A86' : '#9ED6F2', 0) + clip(`hca${nuit ? 'n' : 'j'}`, D, ciel + mer) + P(D, 'none', 1.2)
    + `<path d="M5.6,19.6 A14.4,14.4 0 0 1 34.4,19.6" fill="none" stroke="${nuit ? '#B8C0EC' : '#FFFFFF'}" stroke-width="0.8" stroke-dasharray="1.4 1.6" stroke-linecap="round"/>`
    + trait('M1,21 L39,21', OUT, 1.2);
}
// le soleil (12 × 12) : rond, ses rayons, ses joues roses et son sourire
const soleil = () => [0, 1, 2, 3, 4, 5, 6, 7].map(i => { const a = i * Math.PI / 4; return trait(`M${r2(6 + 4.4 * Math.cos(a))},${r2(6 + 4.4 * Math.sin(a))} L${r2(6 + 5.6 * Math.cos(a))},${r2(6 + 5.6 * Math.sin(a))}`, OR.ombre, 0.9); }).join('')
  + rond(6, 6, 3.6, OR.corps, 0.8) + E(4.6, 6.6, 0.3, 0.42, OUT, 0) + E(7.4, 6.6, 0.3, 0.42, OUT, 0) + E(3.9, 7.5, 0.6, 0.35, 'rgba(240,120,110,.7)', 0) + E(8.1, 7.5, 0.6, 0.35, 'rgba(240,120,110,.7)', 0)
  + trait('M5.4,7.7 Q6,8.3 6.6,7.7', OUT, 0.45) + rond(4.8, 4.6, 0.6, OR.clair, 0);
// la lune (12 × 12) : un croissant qui dort, les yeux fermés, un petit « z »
const lune = () => P('M8,1.4 A5,5 0 1 0 10.6,9.4 A4,4 0 0 1 8,1.4 Z', '#F4ECD0', 0.8) + trait('M4.2,6.6 Q4.8,7.2 5.4,6.6', OUT, 0.45)
  + E(3.6, 8, 0.55, 0.32, 'rgba(240,120,110,.6)', 0) + trait('M8.6,3 L10.2,3 L8.6,4.6 L10.2,4.6', '#8C96C8', 0.5);

// ——— la barre d'onglets ———
// la barre : une longue planche de bois, sans lèvre (elle touche le bas de l'écran), une rainure claire sous le bord
// du haut, un clou dans chaque coin
function barreOnglets() {
  const w = 160, h = 72, o = rr(0.7, 0.7, w - 1.4, h + 10, 16);
  return P(o, BOIS.corps, 0) + clip('hba', o, trait(`M16,2.4 L${w - 16},2.4`, BOIS.clair, 1.2) + trait(`M10,9 L${w - 10},9`, BOIS.ombre, 0.8) + trait(`M10,10 L${w - 10},10`, BOIS.clair, 0.6)
    + trait(`M24,30 L${w - 24},30 M18,46 L${w - 18},46 M26,60 L${w - 26},60`, BOIS.veine, 0.5)) + P(o, 'none', W)
    + clou(9, 5.6) + clou(w - 9, 5.6);
}
// le médaillon d'un onglet (44 × 40) : petit cadre de bois, parchemin au repos, doré (et une étincelle) sur l'onglet actif
const medaillon = (etat) => () => plaque(`hme${etat[0]}`, 44, 40, { r: 12, rebord: 3.6, levre: 2.4, face: etat === 'actif' ? OR : PAPIER, clous: false })
  + (etat === 'actif' ? etincelle(38.6, 5, 1.3) : '');
// le point « nouveau » (14 × 14) : un rond rouge cerclé de blanc, son reflet
const pointNouveau = () => rond(7, 7, 5.6, '#D9483C', 1.2) + rond(7, 7, 4.2, 'none', 0).replace('stroke="none"', 'stroke="#FFFFFF" stroke-width="0.8" stroke-opacity=".8"') + E(5.4, 5.2, 1.4, 0.8, 'rgba(255,255,255,.75)', 0);

// Les pièces : [id, nom, [largeur, hauteur], tranche (haut, droite, bas, gauche ; null : pièce entière), dessin, où le jeu s'en sert]
const PIECES = [
  ['bourse', 'Bourse d\'écus', [64, 34], [12, 16, 15, 16], bourse, 'le compteur d\'écus (world__purse)'],
  ['tuile_reserve', 'Tuile d\'une réserve', [48, 48], [12, 12, 15, 12], tuileReserve, 'les quatre réserves de la barre du haut (world__res)'],
  ...['repos', 'appuye', 'desactive'].map(e => [`bouton_recolte_${e}`, `Bouton Récolte (${e === 'repos' ? 'au repos' : e === 'appuye' ? 'appuyé' : 'désactivé'})`, [112, 60], [18, 22, 22, 22], boutonRecolte(e), 'le bouton de la Récolte (world__play)']),
  ...['repos', 'appuye', 'desactive'].map(e => [`bouton_ramasser_${e}`, `Bouton « Tout ramasser » (${e === 'repos' ? 'au repos' : e === 'appuye' ? 'appuyé' : 'désactivé'})`, [96, 44], [16, 22, 20, 22], boutonRamasser(e), 'le bouton « Tout ramasser » (world__coins)']),
  ...['repos', 'pret', 'appuye'].map(e => [`bouton_ile_${e}`, `Bouton de l'île (${e === 'repos' ? 'au repos' : e === 'pret' ? 'quelque chose attend' : 'appuyé'})`, [48, 48], null, boutonIle(e), 'coffres, carnet, trouvailles (l\'icône par-dessus, de 24 à 28 px)']),
  ...['repos', 'appuye'].map(e => [`bouton_zoom_${e}`, `Bouton de zoom (${e === 'repos' ? 'au repos' : 'appuyé'})`, [40, 40], null, boutonZoom(e), 'zoom avant, zoom arrière, plein écran (l\'icône par-dessus)']),
  ['etiquette', 'Étiquette de la boussole', [72, 34], [12, 16, 15, 16], etiquette, 'l\'expédition en route, le temps avant son retour (world__trip-btn)'],
  ['pastille', 'Pastille de compte', [22, 22], null, pastille, 'ce qui attend sur un bouton (le chiffre en blanc par-dessus)'],
  ...['jour', 'accelere'].map(e => [`horloge_${e}`, `Cadre de l'horloge (${e === 'jour' ? 'au repos' : 'journée en accéléré'})`, [104, 38], [13, 18, 16, 18], horlogeCadre(e), 'l\'horloge de l\'île (island-clock)']),
  ['cadran_jour', 'Cadran de l\'horloge (jour)', [40, 24], null, () => cadran(false), 'le fond du cadran, le jour (le soleil se pose sur l\'arc)'],
  ['cadran_nuit', 'Cadran de l\'horloge (nuit)', [40, 24], null, () => cadran(true), 'le fond du cadran, la nuit (la lune se pose sur l\'arc)'],
  ['soleil', 'Soleil du cadran', [12, 12], null, soleil, 'le soleil, posé sur l\'arc du cadran à l\'heure qu\'il est'],
  ['lune', 'Lune du cadran', [12, 12], null, lune, 'la lune, posée sur l\'arc du cadran la nuit'],
  ['barre_onglets', 'Barre d\'onglets', [160, 72], [22, 28, 0, 28], barreOnglets, 'la barre des onglets en bas de l\'écran (tabbar)'],
  ...['repos', 'actif'].map(e => [`medaillon_${e}`, `Médaillon d'un onglet (${e === 'repos' ? 'au repos' : 'onglet actif'})`, [44, 40], null, medaillon(e), 'le médaillon d\'un onglet (tabbar__medal), l\'icône par-dessus']),
  ['point_nouveau', 'Point « nouveau »', [14, 14], null, pointNouveau, 'une chose à faire sur un onglet (tabbar__dot)']
];

module.exports = {
  PIECES, HD: 4,
  // pour les autres familles en bois et parchemin (perso.js) : les couleurs et les briques de dessin
  BOIS, PAPIER, OR, ETEINT, SOMBRE, W, rr, rond, trait, clou, etincelle, plaque, bouton
};
