// Le HUD de l'île en bois et parchemin, au trait de la bibliothèque : la barre du haut (la bourse d'écus, les tuiles
// des réserves, les boutons Récolte et « Tout ramasser »), les boutons posés sur l'île (coffres, carnet, trouvailles,
// boussole, zoom, plein écran), l'horloge et la barre d'onglets du bas.
// Deux sortes de pièces : les cadres extensibles (9-slice, à poser en border-image : leurs coins ne bougent pas, leurs
// bords et leur milieu s'étirent ; les bords n'ont que des lignes dans le sens où ils s'étirent) et les pièces entières.
// Chaque pièce est dessinée en pixels d'affichage (viewBox) ; le fichier déclare une taille 4 fois plus grande, pour
// rester net sur un canvas (haute définition). preview_hud.mjs les publie.
const { OUT, P, E, clip, r2 } = require('./troupe');

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
// le rail des onglets (grand écran, 88 × 160) : la même planche, debout contre le bord gauche de l'écran (pas de bord
// à gauche), ses coins droits arrondis, la rainure claire le long du bord droit, un clou en haut et en bas
function railOnglets() {
  const w = 88, h = 160, o = rr(-12, 0.7, w + 11.3, h - 1.4, 16);
  return P(o, BOIS.corps, 0) + clip('hra', o, trait(`M${w - 2.4},16 L${w - 2.4},${h - 16}`, BOIS.clair, 1.2) + trait(`M${w - 9},10 L${w - 9},${h - 10}`, BOIS.ombre, 0.8) + trait(`M${w - 10},10 L${w - 10},${h - 10}`, BOIS.clair, 0.6)
    + trait(`M56,24 L56,${h - 24} M36,18 L36,${h - 18} M16,26 L16,${h - 26}`, BOIS.veine, 0.5)) + P(o, 'none', W)
    + clou(w - 5.6, 9) + clou(w - 5.6, h - 9);
}

// ——— les zones de l'île : bandeaux, menus, feuilles, petits boutons ———
// le bandeau (72 × 40) : bois sombre, le texte en crème ; ce que fait le doigt dans un mode de l'île (chemin, déplacer,
// poser), la bulle d'un appui long, l'île qui ne répond pas
const bandeau = () => plaque('hbd', 72, 40, { r: 14, rebord: 4.4, face: SOMBRE });
// le panneau (72 × 48) : parchemin cloué dans son cadre ; le menu d'une pose (« Le poser ici », « Autre case »)
const panneau = () => plaque('hpa', 72, 48, { r: 14, rebord: 4.6, levre: 3.4 });
// le petit bouton de papier (64 × 36) : le geste secondaire (« Autre case », « Annuler », « Déplacer »…) ; appuyé, sa
// face descend
const boutonPapier = (etat) => () => plaque(`hpp${etat[0]}`, 64, 36, { r: 12, rebord: 3.2, levre: 3, clous: false, enfonce: etat === 'appuye' ? 2 : 0 });
// le haut d'une feuille (120 × 64) : le cadre de bois du haut et des côtés, le parchemin dedans ; ouverte en bas (elle
// monte du bas de l'écran), ses deux coins du haut cloués. Le corps de la feuille, en dessous, est son parchemin étiré
function feuille() {
  const w = 120, h = 64, r = 18, reb = 5.2, o = rr(0.7, 0.7, w - 1.4, h + 20, r);
  const f = rr(reb, reb + 0.4, w - 2 * reb, h + 20, r - reb * 0.8);
  return P(o, BOIS.corps, 0) + clip('hfeo', o, trait(`M${r},2.4 L${w - r},2.4`, BOIS.clair, 1.1) + trait(`M${r + 4},${r2(reb * 0.55 + 1.2)} L${w - r - 8},${r2(reb * 0.55 + 1.2)}`, BOIS.veine, 0.5)
    + trait(`M2.6,${r} L2.6,${h}`, BOIS.veine, 0.5) + trait(`M${w - 2.6},${r} L${w - 2.6},${h}`, BOIS.ombre, 0.6)) + P(o, 'none', W)
    + P(f, PAPIER.corps, 0) + clip('hfef', f, `<rect x="0" y="${r2(reb - 0.6)}" width="${w}" height="3" fill="${PAPIER.ombre}"/>`) + P(f, 'none', 1)
    + clou(r * 0.62, reb * 0.55 + 0.6) + clou(w - r * 0.62, reb * 0.55 + 0.6);
}
// le sceau des quêtes (44 × 44) : un anneau de bois (l'anneau de progression du jeu se pose dessus), une face dorée
// bombée, l'étoile de Brume gravée ; pret : la quête est à prendre, un « ! » à la place de l'étoile et une étincelle
function sceauQuete(pret) {
  const c = 22;
  let s = rond(c, c + 0.8, 20.6, BOIS.ombre, W) + rond(c, c, 20, BOIS.corps, 0) + trait(`M${c - 13},${c - 14} Q${c},${c - 21} ${c + 13},${c - 14}`, BOIS.clair, 1.1)
    + rond(c, c, 20, 'none', W) + rond(c, c + 0.6, 14.4, OR.ombre, 1)
    + clip(pret ? 'hsqp' : 'hsqr', `M${c - 14.4},${c} A14.4,14.4 0 1 1 ${c + 14.4},${c} A14.4,14.4 0 1 1 ${c - 14.4},${c} Z`,
      rond(c, c - 1, 13.6, pret ? OR.clair : OR.corps, 0) + E(c - 4.6, c - 7.4, 6.4, 3.2, 'rgba(255,255,255,.55)', 0))
    + rond(c, c + 0.6, 14.4, 'none', 1);
  if (pret) s += `<path d="M${c - 2.2},${c - 9} L${c + 2.2},${c - 9} L${c + 1.2},${c + 3} L${c - 1.2},${c + 3} Z" fill="${SOMBRE.corps}" stroke="${OUT}" stroke-width="0.6" stroke-linejoin="round"/>` + rond(c, c + 6.6, 1.9, SOMBRE.corps, 0.6) + etincelle(36.6, 7.4, 1.5);
  else s += `<path d="M${c},${c - 9} Q${c + 1.4},${c - 1.4} ${c + 8},${c} Q${c + 1.4},${c + 1.4} ${c},${c + 9} Q${c - 1.4},${c + 1.4} ${c - 8},${c} Q${c - 1.4},${c - 1.4} ${c},${c - 9} Z" fill="${OR.fonce}" stroke="${OUT}" stroke-width="0.7" stroke-linejoin="round"/>`
    + `<path d="M${c},${c - 6} Q${c + 0.6},${c - 0.6} ${c + 5},${c}" fill="none" stroke="${OR.clair}" stroke-width="0.8" stroke-linecap="round"/>`;
  return s;
}

// ——— les bulles de dialogue ———
// un rectangle aux quatre coins de rayons différents [haut gauche, haut droit, bas droit, bas gauche] (chemin)
const rr4 = (x, y, w, h, [a, b, c, d]) => `M${r2(x + a)},${r2(y)} L${r2(x + w - b)},${r2(y)} Q${r2(x + w)},${r2(y)} ${r2(x + w)},${r2(y + b)} L${r2(x + w)},${r2(y + h - c)} Q${r2(x + w)},${r2(y + h)} ${r2(x + w - c)},${r2(y + h)} L${r2(x + d)},${r2(y + h)} Q${r2(x)},${r2(y + h)} ${r2(x)},${r2(y + h - d)} L${r2(x)},${r2(y + a)} Q${r2(x)},${r2(y)} ${r2(x + a)},${r2(y)} Z`;
// Les trois papiers d'une bulle : le parchemin (qui parle), le sombre (un hostile), la nuit (une pensée). face, lèvre
// (l'épaisseur, en bas), reflet (en haut), trait (le contour), filet (la ligne fine à l'intérieur)
const PAPIERS = {
  parchemin: { face: PAPIER.corps, levre: '#E2CDA2', reflet: PAPIER.clair, trait: OUT, filet: OR.ombre, filetA: 0.5, rayons: [16, 16, 16, 16] },
  sombre: { face: '#3A2E47', levre: '#22192C', reflet: '#4B3D5C', trait: '#140C1C', filet: '#B07CD8', filetA: 0.55, rayons: [22, 6, 20, 10] },
  nuit: { face: '#1C2A40', levre: '#101A2A', reflet: '#26364F', trait: '#0A1220', filet: '#C8DCF0', filetA: 0.3, rayons: [22, 22, 22, 22] }
};
// La bulle (72 × 60) : son papier aux coins arrondis, sa lèvre en bas, un reflet en haut, le filet doré à l'intérieur ;
// le nom de qui parle se pose en ruban sur son bord haut (en CSS, à sa couleur)
function bulle(sorte) {
  const p = PAPIERS[sorte], w = 72, h = 60, l = 2.4, k = p.rayons;
  const o = rr4(0.7, 0.7, w - 1.4, h - 1.4, k);
  const f = rr4(0.7, 0.7, w - 1.4, h - 1.4 - l, k);
  return P(o, p.levre, 0) + clip(`hbu${sorte[0]}`, o, `<path d="${f}" fill="${p.face}"/><rect x="0" y="1.4" width="${w}" height="3.2" fill="${p.reflet}" opacity=".85"/>`) + P(o, 'none', W).replace(`stroke="${OUT}"`, `stroke="${p.trait}"`)
    + `<path d="${rr4(4.4, 4.4, w - 8.8, h - 8.8 - l, k.map(r => Math.max(r - 3.4, 2)))}" fill="none" stroke="${p.filet}" stroke-width=".6" opacity="${p.filetA}"/>`;
}
// Sa queue (16 × 20), vers celui qui parle : à gauche (vers la droite pour un hostile, qui fait face au joueur). Elle
// recouvre le bord de la bulle sur 2 px (son côté droit, sans trait, s'y fond)
function queue(sorte, droite) {
  const p = PAPIERS[sorte];
  const g = s => (droite ? `<g transform="translate(16,0) scale(-1,1)">${s}</g>` : s);
  return g(`<path d="M16,1.6 Q8,4.6 1.4,15.4 Q9.4,12.4 16,13.4 Z" fill="${p.face}"/><path d="M16,10.6 Q9.6,11.2 4.6,13.6 Q9.4,12.4 16,13.4 Z" fill="${p.levre}"/>`
    + `<path d="M16,1.6 Q8,4.6 1.4,15.4 Q9.4,12.4 16,13.4" fill="none" stroke="${p.trait}" stroke-width="${W}" stroke-linecap="round" stroke-linejoin="round"/>`);
}

// ——— le sceau rompu (choix de l'auteur, 13 oct. : la modale des succès devient un moment) ———
// La ligne de la fente (x, y dans 96 × 96) : le sceau se coupe là en deux moitiés (le jeu les découpe en CSS avec ces
// mêmes points, en pourcentages), et le trait d'or de sceau_fente la suit
const FENTE = [[50, 2], [45, 17], [53, 30], [46, 43], [54, 55], [47, 68], [52, 82], [48, 95]];
// la cire festonnée (centre cx, cy, rayon r, n bosses), un chemin
const feston = (cx, cy, r, n, a = 0.06) => {
  let d = '';
  for (let i = 0; i <= n * 2; i++) {
    const t = (i / (n * 2)) * Math.PI * 2 - Math.PI / 2, rr0 = r * (i % 2 ? 1 + a : 1 - a * 0.4);
    const x = cx + Math.cos(t) * rr0, y = cy + Math.sin(t) * rr0;
    d += i ? (i % 2 ? ` Q${r2(x)},${r2(y)}` : ` ${r2(x)},${r2(y)}`) : `M${r2(x)},${r2(y)}`;
  }
  return d + ' Z';
};
// Le sceau de cire (96 × 96) : deux rubans bleus qui pendent dessous, la cire rouge festonnée en dégradé chaud, deux
// coulures, le bourrelet (clair en haut à gauche, sombre en bas à droite), l'empreinte en creux, l'étoile en relief,
// deux éclats ; le même dessin que l'icône du sceau (interface/sceau_icone), en grand
function sceauCire() {
  const cx = 48, cy = 42, R = 34;
  const defs = `<defs><radialGradient id="hsc-cire" cx=".36" cy=".3" r=".8"><stop offset="0" stop-color="#EC7A62"/><stop offset=".55" stop-color="#C9483A"/><stop offset="1" stop-color="#8A2C22"/></radialGradient>`
    + `<radialGradient id="hsc-creux" cx=".5" cy=".62" r=".62"><stop offset="0" stop-color="#C9483A"/><stop offset=".8" stop-color="#A9382C"/><stop offset="1" stop-color="#7E261E"/></radialGradient>`
    + `<linearGradient id="hsc-ruban" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#5A94DC"/><stop offset="1" stop-color="#2E5EA8"/></linearGradient></defs>`;
  let s = defs + E(cx + 3, 90, 30, 4.4, 'rgba(60,40,25,.2)', 0);
  // les rubans, avec leur pli et leur bout en queue d'aronde
  for (const m of [-1, 1]) {
    const x0 = cx + m * 6, x1 = cx + m * 22;
    s += P(`M${r2(x0 - 7)},58 L${r2(x1 - 7)},91 L${r2(x1)},86 L${r2(x1 + 7)},92 L${r2(x0 + 7)},60 Z`, 'url(#hsc-ruban)', W)
      + trait(`M${r2(x0 - 2)},62 L${r2(x1 - 2)},86`, '#8FBAEE', 0.9) + trait(`M${r2(x0 + 3)},62 L${r2(x1 + 3.4)},86`, '#244C8C', 0.7);
  }
  // la cire, ses coulures, son ombre portée dedans
  const cire = feston(cx, cy, R, 13);
  s += P(`M${cx - 22},${cy + 26} Q${cx - 24},${cy + 36} ${cx - 19},${cy + 37} Q${cx - 15},${cy + 36} ${cx - 16},${cy + 28} Z`, '#B23E31', W)
    + P(`M${cx + 15},${cy + 29} Q${cx + 15},${cy + 39} ${cx + 19.4},${cy + 39} Q${cx + 23},${cy + 37} ${cx + 21},${cy + 26} Z`, '#B23E31', W);
  s += P(cire, 'url(#hsc-cire)', 0) + clip('hscc', cire, E(cx + 10, cy + 12, R * 0.95, R * 0.85, 'rgba(110,30,20,.28)', 0)) + P(cire, 'none', W);
  // le bourrelet : un anneau clair en haut à gauche, sombre en bas à droite
  s += `<circle cx="${cx}" cy="${cy}" r="${r2(R * 0.74)}" fill="none" stroke="#E87A66" stroke-width="3.4"/>`
    + trait(`M${cx - 18},${cy + 18} A${R * 0.74},${R * 0.74} 0 0 0 ${cx + 22},${cy + 12}`, '#8E2C22', 3);
  // l'empreinte en creux, son ombre en haut (le creux), sa lumière en bas
  s += E(cx, cy, R * 0.62, R * 0.62, 'url(#hsc-creux)', 1) + trait(`M${cx - 16},${cy - 9} A${R * 0.6},${R * 0.6} 0 0 1 ${cx + 16},${cy - 9}`, '#7A241C', 1.6)
    + trait(`M${cx - 14},${cy + 13} A${R * 0.6},${R * 0.6} 0 0 0 ${cx + 14},${cy + 13}`, '#E8826C', 1.2);
  // l'étoile en relief : la face, son flanc éclairé en haut, son ombre en bas
  const etoile = Array.from({ length: 10 }, (_, i) => { const a = (i * Math.PI) / 5 - Math.PI / 2, rr0 = i % 2 ? 6.4 : 14.4; return `${r2(cx + Math.cos(a) * rr0)},${r2(cy + 1 + Math.sin(a) * rr0)}`; });
  s += `<polygon points="${etoile.join(' ')}" fill="#7E261E" transform="translate(0.8 1.2)"/>` + `<polygon points="${etoile.join(' ')}" fill="#E06A56" stroke="${OUT}" stroke-width="0.9" stroke-linejoin="round"/>`
    + trait(`M${cx},${cy - 12.6} L${cx - 3.4},${cy - 4}`, '#FFB8A6', 1.1) + trait(`M${cx - 12.6},${cy - 3.4} L${cx - 5},${cy - 2.6}`, '#FFB8A6', 0.9);
  // les éclats de la cire
  s += E(cx - 18, cy - 20, 6, 2.6, 'rgba(255,220,205,.7)', 0).replace('/>', ` transform="rotate(-35 ${cx - 18} ${cy - 20})"/>`) + rond(cx - 25, cy - 9, 1.4, 'rgba(255,230,215,.8)', 0);
  return s;
}
// La fente du sceau (96 × 96) : un trait d'or brisé, sa lueur chaude, le long de FENTE ; il s'allume juste avant que le
// sceau se coupe en deux
function sceauFente() {
  // (seulement sur la cire, de y = 9 à y = 80 : la ligne coupée là où elle les croise)
  const coupe = (a, b, y) => [r2(a[0] + ((b[0] - a[0]) * (y - a[1])) / (b[1] - a[1])), y];
  const pts = [coupe(FENTE[0], FENTE[1], 9), ...FENTE.slice(1, -2), coupe(FENTE[5], FENTE[6], 80)];
  const d = 'M' + pts.map(([x, y]) => `${x},${y}`).join(' L');
  return `<defs><linearGradient id="hsf-or" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF4C0"/><stop offset="1" stop-color="#F2C04B"/></linearGradient></defs>`
    + trait(d, 'rgba(255,214,100,.35)', 7) + trait(d, OUT, 3.2) + trait(d, 'url(#hsf-or)', 1.8) + trait(d, '#FFFFFF', 0.6);
}

// ——— le billet des notifications (choix de l'auteur, 13 oct. ; poussé : « trop plat, trop codé ») ———
// Le billet (96 × 56) : un vélin tenu entre deux rouleaux. Le papier a ses bords gauche et droit coupés à la main
// (un léger tremblé), sa lumière (chaude au milieu, vieillie sur les bords, ombrée sous le rouleau du haut et là où il
// se courbe vers celui du bas), quelques rousseurs et fibres dans les coins. Les rouleaux sont des cylindres (reflet,
// ombre), leurs bouts enroulés en spirale. Le trait est un brun chaud, fin. Tout le détail tient dans les coins et les
// bords de la tranche (14, 16) : il ne s'étire pas. Le ruban du ton et le sceau de cire se posent par-dessus, en CSS.
function billet() {
  const w = 96, h = 56, BRUN = '#7A5636';
  const haut = 7, bas = h - 7;
  // le bord coupé à la main : un tremblé fixe (le même dessin à chaque fois)
  const bord = (x, sens) => {
    const pts = [];
    for (let i = 0; i <= 12; i++) {
      const y = haut + ((bas - haut) * i) / 12;
      pts.push([x + sens * (0.45 * Math.sin(i * 2.3) + 0.3 * Math.sin(i * 5.1 + 1)), y]);
    }
    return pts;
  };
  // (une courbe douce par les points : chaque point devient le contrôle, les milieux les étapes)
  const doux = pts => pts.slice(1, -1).map((p, i) => { const q = pts[i + 2]; return `Q${r2(p[0])},${r2(p[1])} ${r2((p[0] + q[0]) / 2)},${r2((p[1] + q[1]) / 2)}`; }).join(' ') + ` L${r2(pts[pts.length - 1][0])},${r2(pts[pts.length - 1][1])}`;
  const g = bord(3.2, 1), d = bord(w - 3.2, -1).reverse();
  const feuille = `M${r2(g[0][0])},${r2(g[0][1])} ${doux(g)} L${r2(d[0][0])},${r2(d[0][1])} ${doux(d)} Z`;
  const defs = '<linearGradient id="hbiV" x1="0" y1="0" x2="0" y2="1">'
    + '<stop offset="0" stop-color="#EBD7AE"/><stop offset=".2" stop-color="#FFF7E4"/><stop offset=".55" stop-color="#FBEFD3"/>'
    + '<stop offset=".82" stop-color="#F1DDB3"/><stop offset="1" stop-color="#DCC08E"/></linearGradient>'
    + '<linearGradient id="hbiH" x1="0" y1="0" x2="1" y2="0">'
    + '<stop offset="0" stop-color="#C9A46A" stop-opacity=".55"/><stop offset=".1" stop-color="#C9A46A" stop-opacity="0"/>'
    + '<stop offset=".9" stop-color="#C9A46A" stop-opacity="0"/><stop offset="1" stop-color="#B8925A" stop-opacity=".6"/></linearGradient>'
    + '<linearGradient id="hbiR" x1="0" y1="0" x2="0" y2="1">'
    + '<stop offset="0" stop-color="#FFF6DE"/><stop offset=".3" stop-color="#F3E2BC"/><stop offset=".72" stop-color="#D8BC8A"/><stop offset="1" stop-color="#B2905C"/></linearGradient>'
    + '<radialGradient id="hbiT"><stop offset="0" stop-color="#B8894A" stop-opacity=".32"/><stop offset="1" stop-color="#B8894A" stop-opacity="0"/></radialGradient>'
    + '<radialGradient id="hbiS" cx=".4" cy=".35"><stop offset="0" stop-color="#FFF4D8"/><stop offset=".6" stop-color="#E4C995"/><stop offset="1" stop-color="#B8955E"/></radialGradient>';
  // les rousseurs d'un coin (cx, cy : son coin ; sx, sy : vers l'intérieur ; k : sa variante) : des taches douces et
  // quelques points de grain, jamais deux coins pareils
  const coin = (cx, cy, sx, sy, k) => [[3.4 + k, 3, 3.2], [9 - k, 5.4 + k, 1.6], [5.6, 9.6 - k, 1.2]].map(([a, b, r]) => `<ellipse cx="${r2(cx + sx * a)}" cy="${r2(cy + sy * b)}" rx="${r2(r)}" ry="${r2(r * 0.8)}" fill="url(#hbiT)"/>`).join('')
    + [[6.4, 2.2, 0.32], [11.5, 7.6, 0.26], [2.6, 11, 0.3], [13.4 - k, 3.4 + k, 0.22]].map(([a, b, r]) => `<circle cx="${r2(cx + sx * a)}" cy="${r2(cy + sy * b)}" r="${r}" fill="#B08A55" opacity=".45"/>`).join('');
  // un rouleau (y : son haut) : le cylindre, son reflet, la lèvre du papier qui s'y enroule, ses deux bouts en spirale
  const rouleau = (y, dessous) => {
    const cyl = rr(1, y, w - 2, 10, 5);
    const bout = x => E(x, y + 5, 2.6, 4.7, 'url(#hbiS)', 0.8).replace(`stroke="${OUT}"`, `stroke="${BRUN}"`)
      + E(x + 0.2, y + 5, 1.6, 3, 'none', 0.45).replace(`stroke="${OUT}"`, 'stroke="#9C784A"') + E(x + 0.35, y + 5.1, 0.7, 1.4, '#C9A874', 0.4).replace(`stroke="${OUT}"`, 'stroke="#9C784A"');
    return P(cyl, 'url(#hbiR)', 0.9).replace(`stroke="${OUT}"`, `stroke="${BRUN}"`)
      + `<path d="M6,${r2(y + 2.3)} L${w - 6},${r2(y + 2.3)}" stroke="#FFFDF4" stroke-width=".9" stroke-linecap="round" opacity=".8"/>`
      + `<path d="M5,${r2(dessous ? y + 1.2 : y + 8.9)} L${w - 5},${r2(dessous ? y + 1.2 : y + 8.9)}" stroke="#A8845A" stroke-width=".5" opacity=".7"/>`
      + bout(3.4) + bout(w - 3.4);
  };
  return `<defs>${defs}</defs>`
    // le papier, sa lumière, ses bords vieillis
    + `<path d="${feuille}" fill="url(#hbiV)"/>`
    + clip('hbiF', feuille, `<rect x="0" y="0" width="${w}" height="${h}" fill="url(#hbiH)"/>`
      // (l'ombre douce du rouleau du haut, et le papier qui se courbe vers celui du bas)
      + `<rect x="0" y="${haut}" width="${w}" height="5" fill="#9C7646" opacity=".18"/><rect x="0" y="${haut}" width="${w}" height="2.4" fill="#9C7646" opacity=".16"/>`
      + `<rect x="0" y="${bas - 5}" width="${w}" height="5" fill="#9C7646" opacity=".1"/>`
      + coin(3, haut + 1, 1, 1, 0) + coin(w - 3, haut + 1, -1, 1, 1) + coin(3, bas - 1, 1, -1, 2) + coin(w - 3, bas - 1, -1, -1, 1))
    + `<path d="${feuille}" fill="none" stroke="${BRUN}" stroke-width=".8" stroke-linejoin="round"/>`
    + rouleau(1.2, false) + rouleau(h - 11.2, true);
}

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
  ['point_nouveau', 'Point « nouveau »', [14, 14], null, pointNouveau, 'une chose à faire sur un onglet (tabbar__dot)'],
  ['rail_onglets', 'Rail d\'onglets', [88, 160], [22, 22, 22, 0], railOnglets, 'la barre des onglets debout à gauche, sur grand écran (tabbar)'],
  ['bandeau', 'Bandeau', [72, 40], [14, 18, 17, 18], bandeau, 'ce que fait le doigt dans un mode de l\'île (world__banner), la bulle d\'un appui long (world__tip)'],
  ['panneau', 'Panneau', [72, 48], [15, 18, 18, 18], panneau, 'le menu d\'une pose sur l\'île (world__menu)'],
  ...['repos', 'appuye'].map(e => [`bouton_papier_${e}`, `Petit bouton de papier (${e === 'repos' ? 'au repos' : 'appuyé'})`, [64, 36], [12, 14, 14, 14], boutonPapier(e), 'le geste secondaire d\'un bandeau, d\'un menu ou d\'une feuille (world__link, world__menu-btn--quiet)']),
  ['feuille', 'Haut d\'une feuille', [120, 64], [26, 24, 0, 24], feuille, 'la feuille qui monte du bas de l\'écran (world__sheet)'],
  ...['repos', 'pret'].map(e => [`sceau_quete_${e}`, `Sceau des quêtes (${e === 'repos' ? 'au repos' : 'quête à prendre'})`, [44, 44], null, () => sceauQuete(e === 'pret'), 'le médaillon du suivi des quêtes (tracker__seal), l\'anneau de progression par-dessus']),
  ['bulle', 'Bulle de dialogue', [72, 60], [20, 20, 22, 20], () => bulle('parchemin'), 'les répliques : Brume et les siens sur l\'île (guide__bubble), le coach du tutoriel (coach__say), les scènes (ps__bubble)'],
  ['bulle_queue', 'Queue d\'une bulle', [16, 20], null, () => queue('parchemin', false), 'la queue de la bulle, vers celui qui parle (à gauche)'],
  ['bulle_sombre', 'Bulle d\'un hostile', [72, 60], [24, 22, 24, 22], () => bulle('sombre'), 'un hostile parle : bulle sombre, coins irréguliers'],
  ['bulle_sombre_queue', 'Queue d\'une bulle d\'hostile', [16, 20], null, () => queue('sombre', true), 'la queue vers l\'hostile, à droite (il fait face au joueur)'],
  ['bulle_pensee', 'Bulle d\'une pensée', [72, 60], [24, 24, 24, 24], () => bulle('nuit'), 'une pensée, dans les scènes (ps__bubble.is-thought)'],
  ['billet', 'Billet des notifications', [96, 56], [14, 16, 14, 16], billet, 'une notification (toast) : un gain, une réussite, une erreur ; son ruban (à la couleur du ton) et son sceau de cire en CSS'],
  ['sceau_cire', 'Sceau de cire (Sceau rompu)', [96, 96], null, sceauCire, 'le sceau qui tombe, frappe et se fend en deux à l\'annonce d\'un succès (seal__wax) ; ses deux moitiés : le même dessin découpé le long de la fente (zones : fente)', { fente: FENTE }],
  ['sceau_fente', 'Fente du sceau', [96, 96], null, sceauFente, 'le trait d\'or de la fente, posé sur le sceau juste avant qu\'il se coupe (seal__crack)', { fente: FENTE }]
];

module.exports = {
  PIECES, HD: 4,
  // pour les autres familles en bois et parchemin (perso.js) : les couleurs et les briques de dessin
  BOIS, PAPIER, OR, ETEINT, SOMBRE, W, rr, rond, trait, clou, etincelle, plaque, bouton
};
