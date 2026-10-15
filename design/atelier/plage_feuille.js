// La feuille des choix de l'éditeur de l'avatar, au thème de la plage de nuit (choix de l'auteur, 15 oct. : « bois flotté
// et voile » ; « une page, pas deux » : elle flotte sur la plage, translucide). Ce que la mer a rendu après le naufrage :
// des cadres de bois flotté gris argenté (le bois lavé par la mer, son veinage, un nœud), noués de cordage aux coins ;
// dedans, un pan de voile dans la nuit (bleu nuit, un peu transparent : la plage se devine dessous, sa couture) ; seul
// ce qui est choisi, et le geste principal, brillent de l'or chaud de la lanterne. Mêmes tailles et mêmes tranches
// que les pièces en bois et parchemin qu'elles remplacent dans l'éditeur (perso.js : onglet, choix, nuancier, panneau,
// tourner, hasard ; hud.js : bouton_ramasser, bouton_papier).
const { OUT, P, clip, r2 } = require('./troupe');
const { W, rr, rond, trait, plaque, etincelle } = require('./hud');

// Le bois flotté (gris argenté, un rien chaud), la voile (claire, bleutée), l'or de la lanterne, le cordage
const BF = { clair: '#E4E0D4', corps: '#ABA597', ombre: '#7A746A', fonce: '#58534B', veine: '#C9C4B6' };
// (la voile de nuit : le panneau ; plus sombre : un onglet fermé ; plus claire : le fond d'une vignette, où le
// personnage se lit ; la plaque d'un bouton qui n'est pas le geste principal)
const VOILE = { corps: 'rgba(24,32,66,.86)', ombre: 'rgba(14,20,44,.9)', clair: 'rgba(52,64,110,.6)', couture: '#3E4C84' };
const VOILE_SOMBRE = { corps: 'rgba(12,17,38,.9)', ombre: 'rgba(8,12,28,.92)', clair: 'rgba(30,38,72,.6)' };
const VOILE_CLAIRE = { corps: '#2E3A6A', ombre: '#232D56', clair: '#3A4878' };
const NUIT = { clair: '#4A5890', corps: '#2A3462', ombre: '#1C2448' };
const LANTERNE = { clair: '#FFEAB0', corps: '#F7C462', ombre: '#D58E32', fonce: '#A0601E' };
const ETEINTE = { clair: '#E8E6DE', corps: '#CFCBC0', ombre: '#ABA597' };
const CORDE = { corps: '#CDB78C', ombre: '#8F7652' };
const VERRE = '#4FA89A';

// Un nœud de bois (un œil dans une planche) ; une ligature de corde (trois tours serrés, en biais), dans un coin
const noeud = (x, y, s = 1) => `<ellipse cx="${r2(x)}" cy="${r2(y)}" rx="${r2(1.5 * s)}" ry="${r2(0.8 * s)}" fill="${BF.ombre}"/><ellipse cx="${r2(x)}" cy="${r2(y)}" rx="${r2(0.6 * s)}" ry="${r2(0.3 * s)}" fill="${BF.fonce}"/>`;
function ligature(x, y, a) {
  // trois tours de corde serrés en travers du coin, leur torsade, et le bout qui dépasse
  let s = `<g transform="rotate(${a} ${x} ${y})">`;
  for (const dx of [-3.1, 0, 3.1]) {
    s += `<rect x="${r2(x + dx - 1.45)}" y="${r2(y - 5.4)}" width="2.9" height="10.8" rx="1.45" fill="${CORDE.corps}" stroke="${OUT}" stroke-width=".8"/>`;
    for (const t of [-3.2, -0.8, 1.6, 4]) s += trait(`M${r2(x + dx - 1.2)},${r2(y + t - 0.8)} L${r2(x + dx + 1.2)},${r2(y + t + 0.6)}`, CORDE.ombre, 0.55);
  }
  s += trait(`M${r2(x + 4.6)},${r2(y + 4.4)} Q${r2(x + 7)},${r2(y + 7)} ${r2(x + 6.4)},${r2(y + 9)}`, OUT, 2.4) + trait(`M${r2(x + 4.6)},${r2(y + 4.4)} Q${r2(x + 7)},${r2(y + 7)} ${r2(x + 6.4)},${r2(y + 9)}`, CORDE.corps, 1.2);
  return s + '</g>';
}
// Le veinage du bois flotté : des fils ondulés le long de chaque bande du cadre (ils s'étirent avec elle), plus sombres
// et plus clairs, et les bords usés (un liseré sombre à l'intérieur du cadre)
function veinage(w, h, r, rebord, l) {
  const bh = rebord, ond = (x0, x1, y, a, k) => { let d = `M${r2(x0)},${r2(y)}`; const n = Math.max(2, Math.round((x1 - x0) / 9)); for (let i = 0; i < n; i++) { const xa = x0 + ((i + 0.5) / n) * (x1 - x0), xb = x0 + ((i + 1) / n) * (x1 - x0); d += ` Q${r2(xa)},${r2(y + (i % 2 ? a : -a) * k)} ${r2(xb)},${r2(y)}`; } return d; };
  const ondV = (y0, y1, x, a) => { let d = `M${r2(x)},${r2(y0)}`; const n = Math.max(2, Math.round((y1 - y0) / 9)); for (let i = 0; i < n; i++) { const ya = y0 + ((i + 0.5) / n) * (y1 - y0), yb = y0 + ((i + 1) / n) * (y1 - y0); d += ` Q${r2(x + (i % 2 ? a : -a))},${r2(ya)} ${r2(x)},${r2(yb)}`; } return d; };
  let s = '';
  for (const [y, c, a] of [[bh * 0.35 + 0.8, BF.veine, 0.4], [bh * 0.7 + 0.8, BF.ombre, 0.35]]) s += trait(ond(r, w - r, y, a, 1), c, 0.45);
  for (const [y, c, a] of [[h - l - bh * 0.4, BF.veine, 0.4], [h - l - bh * 0.75, BF.ombre, 0.35]]) s += trait(ond(r, w - r, y, a, 1), c, 0.45);
  for (const [x, c] of [[bh * 0.4 + 0.6, BF.veine], [bh * 0.72 + 0.6, BF.ombre], [w - bh * 0.4 - 0.6, BF.veine], [w - bh * 0.72 - 0.6, BF.ombre]]) s += trait(ondV(r, h - r - l, x, 0.35), c, 0.45);
  return s;
}
// La plaque de bois flotté (le gabarit du HUD, dans cette matière) : son veinage, un nœud dans un coin
const plaqueBF = (id, w, h, o = {}) => plaque(id, w, h, { bois: BF, face: VOILE, clous: false, ...o })
  + veinage(w, h, o.r || 10, o.rebord || 4, o.enfonce ? 1 : (o.levre || 3))
  + (o.noeud === false ? '' : noeud(Math.max((o.r || 10) * 0.7, 3.4), h - (o.levre || 3) - (o.rebord || 4) * 0.55, 0.8));

// Le bouton (le gabarit du HUD : la face bombée), le bois flotté autour ; repos, appuye ou desactive
function boutonBF(id, w, h, etat, { r = 14, face = LANTERNE } = {}) {
  const f = etat === 'desactive' ? ETEINTE : face, enf = etat === 'appuye' ? 2.4 : 0;
  const lev = 4, reb = 3, O = rr(0.7, 0.7, w - 1.4, h - 1.4, r);
  let s = P(O, BF.ombre, 0) + clip(`${id}o`, O, `<path d="${rr(0.7, 0.7, w - 1.4, h - 1.4 - (enf ? 1.4 : lev), r)}" fill="${BF.corps}"/>`
    + trait(`M${r2(r)},2.2 L${r2(w - r)},2.2`, BF.clair, 1) + trait(`M${r2(r + 4)},${r2(h - lev - 1.2)} L${r2(w - r - 8)},${r2(h - lev - 1.2)}`, BF.veine, 0.5)) + P(O, 'none', W);
  const fy = reb + enf, fh = h - 2 * reb - (enf ? 1.4 : lev) - enf + 0.6;
  const F = rr(reb, fy, w - 2 * reb, fh, r - reb * 0.7);
  s += P(F, f.ombre, 0) + clip(`${id}f`, F, `<path d="${rr(reb, fy, w - 2 * reb, fh - 2.6, r - reb * 0.7)}" fill="${f.corps}"/>`
    + `<rect x="0" y="${r2(fy + 1.4)}" width="${w}" height="${r2(Math.max(fh * 0.28, 3))}" fill="${f.clair}" opacity=".75"/>`
    + trait(`M${r2(r)},${r2(fy + 2.2)} L${r2(w - r)},${r2(fy + 2.2)}`, '#FFFFFF', 1.1)
    + (f === LANTERNE ? `<ellipse cx="${w / 2}" cy="${r2(fy + fh * 0.55)}" rx="${r2(w * 0.42)}" ry="${r2(fh * 0.38)}" fill="#FFF3C8" opacity=".35"/>` : '')) + P(F, 'none', 1);
  return s;
}

// L'onglet (64 × 38) : une planche de bois flotté au haut arrondi, ouverte en bas ; la voile au repos, l'or de la
// lanterne quand il est ouvert
function onglet(actif) {
  const w = 64, h = 38, id = `fon${actif ? 'a' : 'r'}`;
  const O = `M0.7,${h} L0.7,12 Q0.7,0.7 12,0.7 L${w - 12},0.7 Q${w - 0.7},0.7 ${w - 0.7},12 L${w - 0.7},${h} Z`;
  const F = `M3.6,${h} L3.6,12.6 Q3.6,3.6 12.6,3.6 L${w - 12.6},3.6 Q${w - 3.6},3.6 ${w - 3.6},12.6 L${w - 3.6},${h} Z`;
  const f = actif ? VOILE : VOILE_SOMBRE;
  const bord = d => d.replace(/ Z$/, '');
  return P(O, BF.corps, 0) + clip(`${id}o`, O, trait(`M12,2.2 L${w - 12},2.2`, BF.clair, 1) + noeud(6, 22, 0.7)) + `<path d="${bord(O)}" fill="none" stroke="${OUT}" stroke-width="${W}" stroke-linejoin="round"/>`
    + P(F, f.corps, 0) + clip(`${id}f`, F, (actif ? trait(`M10,4.6 L${w - 10},4.6`, LANTERNE.corps, 1.6) + `<rect x="0" y="5.4" width="${w}" height="6" fill="${LANTERNE.corps}" opacity=".12"/>` : `<rect x="0" y="3" width="${w}" height="2.6" fill="${f.ombre}"/>`))
    + `<path d="${bord(F)}" fill="none" stroke="${OUT}" stroke-width="1" stroke-linejoin="round"/>` + (actif ? etincelle(w - 7, 8.4, 1.2) : '');
}

// La pastille d'un choix (56 × 34) : un petit cadre de bois flotté, la voile dedans ; choisie : l'or de la lanterne, et
// une coche sur un galet de verre poli
const choix = actif => plaqueBF(`fch${actif ? 'a' : 'r'}`, 56, 34, { r: 12, rebord: 3, levre: 2.4, face: actif ? LANTERNE : VOILE_CLAIRE, noeud: false })
  + (actif ? rond(49.6, 6.6, 5, VERRE, 1) + trait('M47.2,6.8 L49,8.6 L52,5', '#FFFFFF', 1.3) : '');

// Le cadre d'un nuancier (34 × 34) : un anneau de bois flotté, le centre vide (la couleur, en CSS, dessous) ; choisi :
// l'anneau d'or et une étincelle ; aucun : un rond de voile barré
function nuancier(etat) {
  if (etat === 'aucun') return rond(17, 17, 15.2, BF.corps, W) + rond(17, 17, 11, VOILE_CLAIRE.corps, 1) + trait('M10,24 L24,10', '#E0705E', 2);
  const c = etat === 'actif' ? LANTERNE : BF;
  const anneau = 'M1.8,17 A15.2,15.2 0 1 0 32.2,17 A15.2,15.2 0 1 0 1.8,17 Z M6,17 A11,11 0 1 1 28,17 A11,11 0 1 1 6,17 Z';
  return `<path d="${anneau}" fill="${c.corps}" fill-rule="evenodd" stroke="${OUT}" stroke-width="${W}"/>`
    + trait('M6.4,10.4 Q9.4,4.6 15.6,3.4', c.clair, 1.2) + (etat === 'actif' ? etincelle(29, 5, 1.4) : trait('M23,30.4 Q27.6,28.6 30,25', BF.ombre, 0.8));
}

// Le panneau (96 × 96) : le grand cadre de bois flotté, noué de corde aux quatre coins, la voile tendue dedans (sa
// couture le long du haut et du bas : elles s'étirent avec lui)
function panneau() {
  const w = 96, h = 96;
  let s = plaqueBF('fpa', w, h, { r: 14, rebord: 6, levre: 3, noeud: false });
  s += trait('M14,11 L82,11', VOILE.couture, 0.6) + trait('M14,12.4 L82,12.4', VOILE.couture, 0.35) + trait('M14,83 L82,83', VOILE.couture, 0.6)
    + trait('M16,8.6 L80,8.6', '#C8D6FF', 0.5).replace('/>', ' opacity=".35"/>');
  return s + ligature(7, 7, -45) + ligature(89, 7, 45) + ligature(7, 87, 225) + ligature(89, 87, 135);
}

// « Tourner » (44 × 44) : un rond de bois flotté, la voile dedans, une flèche de bois sombre qui tourne
function tourner(droite) {
  let s = rond(22, 22.6, 20, BF.ombre, W) + rond(22, 21.6, 19.6, BF.corps, 0) + rond(22, 22, 15.4, NUIT.corps, 1) + trait('M9,14 Q12,8.6 18,7.4', BF.clair, 1.3) + noeud(33.6, 32.4, 0.7);
  const fleche = trait('M28.6,27.4 A8.4,8.4 0 1 1 29.4,17', OUT, 4.2) + trait('M28.6,27.4 A8.4,8.4 0 1 1 29.4,17', BF.clair, 2) + P('M25.4,15.4 L31.6,12.2 L31.8,19.2 Z', BF.clair, 1);
  return s + (droite ? `<g transform="translate(44 0) scale(-1 1)">${fleche}</g>` : fleche);
}

// « Au hasard » (100 × 40) : un bouton de nuit dans son bois flotté (l'or reste au geste principal), un dé blanc à gauche
function hasard() {
  let s = boutonBF('fha', 100, 40, 'repos', { r: 14, face: NUIT });
  s += `<g transform="rotate(-14 17 17.4)">${P(rr(9.6, 10, 14.8, 14.8, 3.4), '#FFFFFF', 1.1)}${P(rr(9.6, 21, 14.8, 3.8, 1.8), '#E6DCCB', 0)}`
    + [[13.4, 13.8], [17, 17.4], [20.6, 21]].map(([x, y]) => rond(x, y, 1.15, '#C9483A', 0)).join('') + '</g>';
  return s;
}

// Le geste principal (« C'est moi », « Garder ») : la plaque d'or de lanterne (96 × 44, la tranche du bouton du HUD) ;
// le geste secondaire (« Annuler », « Retour ») : un pan de voile dans son bois flotté (64 × 36)
const bouton = etat => () => boutonBF(`fbo${etat[0]}`, 96, 44, etat, { r: 18 });
const boutonVoile = etat => () => plaqueBF(`fbv${etat[0]}`, 64, 36, { r: 12, rebord: 3.2, levre: 3, face: etat === 'appuye' ? VOILE_SOMBRE : NUIT, enfonce: etat === 'appuye' ? 2 : 0, noeud: false });

// Les pièces : [id, nom, [largeur, hauteur], tranche, dessin, où le jeu s'en sert] (comme perso.js)
const PIECES = [
  ['feuille_onglet_repos', 'Onglet de la plage (au repos)', [64, 38], [14, 16, 2, 16], () => onglet(false), 'un onglet de l\'éditeur, sur la plage (avm__tab)'],
  ['feuille_onglet_actif', 'Onglet de la plage (ouvert)', [64, 38], [14, 16, 2, 16], () => onglet(true), 'l\'onglet ouvert (avm__tab.is-on)'],
  ['feuille_choix_repos', 'Cadre d\'un choix, bois flotté (au repos)', [56, 34], [12, 14, 14, 14], () => choix(false), 'une vignette de l\'éditeur (avm__thumb-art)'],
  ['feuille_choix_actif', 'Cadre d\'un choix, bois flotté (choisi)', [56, 34], [12, 14, 14, 14], () => choix(true), 'la vignette retenue (avm__thumb.is-on)'],
  ['feuille_nuancier_repos', 'Nuancier de bois flotté (au repos)', [34, 34], null, () => nuancier('repos'), 'une couleur à choisir (avm__swatch) : la couleur en CSS dessous'],
  ['feuille_nuancier_actif', 'Nuancier de bois flotté (choisi)', [34, 34], null, () => nuancier('actif'), 'la couleur retenue (avm__swatch.is-on)'],
  ['feuille_nuancier_aucun', 'Nuancier « aucune couleur », bois flotté', [34, 34], null, () => nuancier('aucun'), 'le choix « aucune couleur » (avm__swatch.is-none)'],
  ['feuille_panneau', 'Panneau de voile dans son bois flotté', [96, 96], [16, 16, 19, 16], panneau, 'la liste des choix de l\'éditeur (avm__panel)'],
  ['feuille_tourner_gauche', 'Tourner à gauche, bois flotté', [44, 44], null, () => tourner(false), 'faire tourner l\'aperçu vers la gauche (avm__turn--left)'],
  ['feuille_tourner_droite', 'Tourner à droite, bois flotté', [44, 44], null, () => tourner(true), 'faire tourner l\'aperçu vers la droite (avm__turn--right)'],
  ['feuille_hasard', '« Au hasard », bois flotté', [100, 40], [14, 18, 16, 34], hasard, 'le bouton « Au hasard » (avm__luck), le texte à droite du dé'],
  ...['repos', 'appuye', 'desactive'].map(e => [`feuille_bouton_${e}`, `Plaque d'or de lanterne (${e === 'repos' ? 'au repos' : e === 'appuye' ? 'appuyée' : 'éteinte'})`, [96, 44], [16, 22, 20, 22], bouton(e), 'le geste principal de l\'éditeur : « C\'est moi », « Garder » (pav__ok)']),
  ...['repos', 'appuye'].map(e => [`feuille_voile_${e}`, `Bouton de voile (${e === 'repos' ? 'au repos' : 'appuyé'})`, [64, 36], [12, 14, 14, 14], boutonVoile(e), 'le geste secondaire de l\'éditeur : « Annuler », « Retour » (pav__back)'])
];

module.exports = { PIECES, BF, VOILE, LANTERNE };
