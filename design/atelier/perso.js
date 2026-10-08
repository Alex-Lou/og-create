// L'interface du joueur en bois et parchemin, comme le HUD (hud.js) : l'éditeur de l'avatar (l'estrade de l'aperçu,
// les onglets, les pastilles de choix, les nuanciers, les boutons « tourner » et « Au hasard », le panneau), la page du
// Sceau (le ruban du nom, la tuile d'un compteur, la ligne de menu, la barre de progression) et la carte d'embarquement.
// Mêmes règles que le HUD : cadres extensibles (9-slice, en border-image) ou pièces entières, dessinés en pixels
// d'affichage, le fichier déclarant une taille HD fois plus grande. preview_perso.mjs les publie.
const { OUT, P, E, clip, r2 } = require('./troupe');
const { BOIS, PAPIER, OR, W, rr, rond, trait, clou, etincelle, plaque, bouton, HD } = require('./hud');

const ROUGE = { corps: '#C9483A', ombre: '#9C3428', clair: '#E27A68' };
const VERT = '#5E9A3C';

// ——— l'éditeur de l'avatar ———

// L'estrade (240 × 180) : le fond derrière l'aperçu en pied, à poser en background (cover). Un mur crème, une lumière
// douce, deux rideaux rouges noués d'une cordelière dorée, un lambrequin festonné en haut, un socle de bois rond où
// l'avatar se tient (ses pieds au centre du plateau : x 120, y 154)
function estrade() {
  let s = `<rect x="0" y="0" width="240" height="180" fill="#F3E3C4"/>` + E(120, 118, 96, 70, '#FBF0D8', 0) + E(120, 104, 54, 52, '#FFF8E8', 0);
  // le plancher, au fond
  s += `<rect x="0" y="150" width="240" height="30" fill="${BOIS.corps}"/>` + trait('M0,150 L240,150', OUT, 1.2) + trait('M0,162 L240,162 M0,172 L240,172', BOIS.ombre, 0.6);
  // le socle : la tranche sombre, le plateau aux planches, un reflet
  s += P('M50,154 L50,162 Q120,182 190,162 L190,154 Z', BOIS.ombre, W) + E(120, 154, 70, 14, BOIS.clair, W);
  s += `<clipPath id="pes"><ellipse cx="120" cy="154" rx="70" ry="14"/></clipPath><g clip-path="url(#pes)">${[94, 120, 146].map(x => trait(`M${x},139 L${x},169`, BOIS.veine, 0.7)).join('')}${E(104, 149, 30, 4, 'rgba(255,255,255,.45)', 0)}</g>`;
  s += E(120, 154, 36, 7, 'rgba(255,240,190,.55)', 0);
  // les rideaux, noués à mi-hauteur
  const rideau = (m) => {
    const X = x => r2(m ? 240 - x : x);
    const d = `M${X(0)},0 L${X(58)},0 Q${X(52)},52 ${X(32)},98 Q${X(46)},132 ${X(30)},180 L${X(0)},180 Z`;
    return P(d, ROUGE.corps, 0) + clip(`per${m ? 'd' : 'g'}`, d, `<path d="M${X(0)},0 L${X(14)},0 Q${X(12)},90 ${X(8)},180 L${X(0)},180 Z" fill="${ROUGE.ombre}"/>`
      + trait(`M${X(26)},4 Q${X(24)},60 ${X(20)},96 M${X(40)},4 Q${X(36)},56 ${X(28)},98 M${X(20)},104 Q${X(26)},140 ${X(18)},178 M${X(34)},108 Q${X(38)},144 ${X(28)},178`, ROUGE.ombre, 1.1)
      + trait(`M${X(46)},6 Q${X(42)},50 ${X(30)},94`, ROUGE.clair, 1.2)) + P(d, 'none', W)
      + E(Number(X(33)), 99, 7, 3.4, OR.corps, 1) + E(Number(X(33)), 99, 3, 1.4, OR.clair, 0) + trait(`M${X(30)},102 Q${X(28)},110 ${X(31)},114 M${X(36)},102 Q${X(38)},110 ${X(35)},114`, OR.ombre, 1.2);
  };
  s += rideau(false) + rideau(true);
  // le lambrequin festonné et son galon doré
  let v = 'M0,0 L240,0 L240,14';
  for (let x = 240; x > 0; x -= 24) v += ` Q${x - 12},26 ${x - 24},14`;
  s += P(v + ' Z', ROUGE.ombre, W) + trait('M0,10 L240,10', OR.corps, 1.4);
  for (let x = 12; x < 240; x += 24) s += rond(x, 21.6, 1.6, OR.corps, 0.7);
  return s;
}

// L'onglet (64 × 38) : un cadre de bois au haut arrondi, ouvert en bas (il se pose sur le panneau) ; parchemin au repos,
// doré quand il est actif
function onglet(actif) {
  const w = 64, h = 38, id = `pon${actif ? 'a' : 'r'}`;
  const O = `M0.7,${h} L0.7,12 Q0.7,0.7 12,0.7 L${w - 12},0.7 Q${w - 0.7},0.7 ${w - 0.7},12 L${w - 0.7},${h} Z`;
  const F = `M3.6,${h} L3.6,12.6 Q3.6,3.6 12.6,3.6 L${w - 12.6},3.6 Q${w - 3.6},3.6 ${w - 3.6},12.6 L${w - 3.6},${h} Z`;
  const f = actif ? OR : PAPIER;
  return P(O, BOIS.corps, 0) + clip(`${id}o`, O, trait(`M12,2.2 L${w - 12},2.2`, BOIS.clair, 1)) + P(O, 'none', W).replace(`d="${O}"`, `d="M0.7,${h} L0.7,12 Q0.7,0.7 12,0.7 L${w - 12},0.7 Q${w - 0.7},0.7 ${w - 0.7},12 L${w - 0.7},${h}"`)
    + P(F, f.corps, 0) + clip(`${id}f`, F, `<rect x="0" y="3" width="${w}" height="2.6" fill="${f.ombre}"/>`) + P(F, 'none', 0).replace('stroke="none"', `stroke="${OUT}" stroke-width="1"`).replace(`d="${F}"`, `d="M3.6,${h} L3.6,12.6 Q3.6,3.6 12.6,3.6 L${w - 12.6},3.6 Q${w - 3.6},3.6 ${w - 3.6},12.6 L${w - 3.6},${h}"`)
    + (actif ? etincelle(w - 7, 7.4, 1.2) : '');
}

// La pastille d'un choix (56 × 34) : petite plaque de parchemin ; choisie, elle est dorée et porte une coche verte
const choix = (actif) => plaque(`pch${actif ? 'a' : 'r'}`, 56, 34, { r: 12, rebord: 3, levre: 2.4, face: actif ? OR : PAPIER, clous: false })
  + (actif ? rond(49.6, 6.6, 5, VERT, 1) + trait('M47.2,6.8 L49,8.6 L52,5', '#FFFFFF', 1.3) : '');

// Le cadre d'un nuancier (34 × 34) : un anneau de bois, le centre vide (la couleur, en CSS, dessous : un rond de 22 px) ;
// choisi : l'anneau doré et une étincelle ; aucun : un rond de parchemin barré (pas de couleur)
function nuancier(etat) {
  if (etat === 'aucun') return rond(17, 17, 15.2, BOIS.corps, W) + rond(17, 17, 11, PAPIER.corps, 1) + trait('M10,24 L24,10', ROUGE.corps, 2);
  const c = etat === 'actif' ? OR : BOIS;
  const anneau = 'M1.8,17 A15.2,15.2 0 1 0 32.2,17 A15.2,15.2 0 1 0 1.8,17 Z M6,17 A11,11 0 1 1 28,17 A11,11 0 1 1 6,17 Z';
  return `<path d="${anneau}" fill="${c.corps}" fill-rule="evenodd" stroke="${OUT}" stroke-width="${W}"/>`
    + trait('M6.4,10.4 Q9.4,4.6 15.6,3.4', c.clair, 1.2) + (etat === 'actif' ? etincelle(29, 5, 1.4) : '');
}

// Les boutons « tourner » (44 × 44) : ronds, cerclés de bois, une flèche qui tourne vers la gauche ou la droite
function tourner(droite) {
  let s = rond(22, 22.6, 20, BOIS.ombre, W) + rond(22, 21.6, 19.6, BOIS.corps, 0) + rond(22, 22, 15.4, PAPIER.corps, 1) + trait('M9,14 Q12,8.6 18,7.4', BOIS.clair, 1.3);
  const fleche = trait('M28.6,27.4 A8.4,8.4 0 1 1 29.4,17', OUT, 4.2) + trait('M28.6,27.4 A8.4,8.4 0 1 1 29.4,17', BOIS.corps, 2) + P('M25.4,15.4 L31.6,12.2 L31.8,19.2 Z', BOIS.corps, 1);
  return s + (droite ? `<g transform="translate(44 0) scale(-1 1)">${fleche}</g>` : fleche);
}

// « Au hasard » (100 × 40) : le bouton doré, un dé blanc à gauche (dans le coin, qui ne s'étire pas)
function hasard() {
  let s = bouton('pha', 100, 40, 'repos', { r: 14 });
  s += `<g transform="rotate(-14 17 17.4)">${P(rr(9.6, 10, 14.8, 14.8, 3.4), '#FFFFFF', 1.1)}${P(rr(9.6, 21, 14.8, 3.8, 1.8), '#E6DCCB', 0)}`
    + [[13.4, 13.8], [17, 17.4], [20.6, 21]].map(([x, y]) => rond(x, y, 1.15, ROUGE.corps, 0)).join('') + '</g>';
  return s;
}

// Le panneau (96 × 96) : la plaque de parchemin cerclée de bois, pour la liste des choix ou un bloc de la page du Sceau
const panneau = () => plaque('ppa', 96, 96, { r: 14, rebord: 6, levre: 3 });

// ——— la page du Sceau ———

// Le ruban du nom (140 × 40) : un ruban rouge aux bouts en queue d'aronde, repliés derrière, un galon doré ; le nom en CSS
function ruban() {
  let s = P('M0,14 L22,14 L22,34 L0,34 L8,24 Z', ROUGE.ombre, W) + P('M140,14 L118,14 L118,34 L140,34 L132,24 Z', ROUGE.ombre, W);
  s += P('M22,34 L28,30 L28,38 Z', '#7A2A20', 1) + P('M118,34 L112,30 L112,38 Z', '#7A2A20', 1);
  const B = 'M16,6 L124,6 L124,30 L16,30 Z';
  s += P(B, ROUGE.corps, 0) + clip('pru', B, `<rect x="16" y="25" width="108" height="5" fill="${ROUGE.ombre}"/>` + trait('M16,9.4 L124,9.4', ROUGE.clair, 1.2)) + P(B, 'none', W);
  return s + trait('M16,12 L124,12 M16,26 L124,26', OR.corps, 0.9) + rond(19.4, 18, 1.1, OR.corps, 0.6) + rond(120.6, 18, 1.1, OR.corps, 0.6);
}
// La tuile d'un compteur (72 × 60) : Registre, Succès, Records
const tuileCompteur = () => plaque('ptu', 72, 60, { r: 11, rebord: 4.4 });
// La ligne de menu (160 × 52) : Mon compte, le Cabinet, les Succès… ; une flèche de bois à droite (dans le coin)
const ligne = (etat) => () => { const enf = etat === 'appuye' ? 2 : 0; return plaque(`pli${etat[0]}`, 160, 52, { r: 12, rebord: 4, enfonce: enf, clous: false })
  + trait(`M142,${17 + enf} L148,${24 + enf} L142,${31 + enf}`, OUT, 3.6) + trait(`M142,${17 + enf} L148,${24 + enf} L142,${31 + enf}`, BOIS.corps, 1.6); };
// La barre de progression (64 × 14) : la rainure de bois, et le remplissage couleur de miel, à poser par-dessus
const barreFond = () => P(rr(0.7, 0.7, 62.6, 12.6, 6.3), BOIS.fonce, W) + P(rr(2.6, 2.6, 58.8, 8.8, 4.4), '#4E331C', 0) + `<rect x="8" y="2.8" width="48" height="1.4" fill="#2E1E10" opacity=".6"/>`;
const barrePlein = () => { const d = rr(0.7, 0.7, 62.6, 12.6, 6.3); return P(d, OR.corps, 0) + clip('pbp', d, `<rect x="0" y="8.6" width="64" height="6" fill="${OR.ombre}"/>` + trait('M7,3.8 L57,3.8', OR.clair, 1.6)) + P(d, 'none', 1.1); };

// ——— la carte d'embarquement (240 × 150) ———
// Une carte de parchemin, un peu tachée par la mer ; le bandeau bleu de l'Hirondelle (une hirondelle, des vaguelettes),
// la fenêtre de la photo (cadre de bois, fond crème), trois lignes à écrire (la première pour le nom), le talon
// détachable à droite (pointillés, encoches) et son tampon. La photo et le nom viennent du jeu (zones dans perso.json)
const hirondelle = (x, y, s, col) => `<path d="M0,0 C-2,-1.2 -4.2,-1.2 -6,-0.2 L-12,-6.4 L-8.6,0 L-15,0.8 L-10,2 L-14.6,4.4 L-8,2.6 L-11.4,8.4 L-5,2.2 C-3,2.2 -1.2,1.2 0,0 Z" fill="${col}" transform="translate(${x} ${y}) scale(${s})"/>`;
function carte() {
  const C = 'M6,2 L234,2 Q238,2 238,6 L238,144 Q238,148 234,148 L6,148 Q2,148 2,144 L2,6 Q2,2 6,2 Z';
  let s = P(C, PAPIER.corps, 0) + clip('pca', C, `<rect x="0" y="0" width="240" height="30" fill="#3E6A9E"/>`
    + trait('M0,26 Q10,23 20,26 T40,26 T60,26 T80,26 T100,26 T120,26 T140,26 T160,26 T180,26 T200,26 T220,26 T240,26', '#8CB4E0', 1)
    + E(196, 120, 34, 22, 'rgba(160,190,210,.25)', 0) + E(40, 136, 26, 12, 'rgba(170,140,100,.18)', 0) + E(150, 44, 18, 8, 'rgba(160,190,210,.2)', 0)
    + `<rect x="184" y="30" width="56" height="120" fill="${PAPIER.ombre}" opacity=".55"/>`) + P(C, 'none', W);
  s += hirondelle(30, 13, 1.1, '#FBF3DE') + trait('M40,15 L120,15', '#FBF3DE', 1.6) + trait('M40,20 L96,20', '#B8CFEA', 1.1);
  // la fenêtre de la photo
  s += P(rr(12, 38, 66, 90, 4), BOIS.corps, W) + P(rr(16, 42, 58, 82, 2.4), '#FFF8EA', 1) + trait('M18,44 L72,44', PAPIER.ombre, 1.6);
  s += [[12, 38], [78, 38], [12, 128], [78, 128]].map(([x, y]) => clou(x + (x < 40 ? 4 : -4), y + (y < 80 ? 4 : -4))).join('');
  // les lignes à écrire (la première : le nom) et leurs petits repères
  s += [[66, 92], [88, 92], [108, 92]].map(([y, x]) => trait(`M${x},${y} L176,${y}`, '#B9A68A', 1)).join('');
  s += [58, 80, 100].map(y => rond(88, y, 1.4, '#3E6A9E', 0) + trait(`M91.6,${y} L99,${y}`, '#9AB4D4', 1)).join('');
  // le talon : pointillés, encoches, le tampon rouge à l'hirondelle
  // les encoches, mordues dans le bord haut et le bord bas (découpées à la forme de la carte : rien ne dépasse)
  s += `<path d="M184,7 L184,143" stroke="${BOIS.ombre}" stroke-width="1" stroke-dasharray="2.4 2.2"/>` + clip('pcn', C, rond(184, 2, 4.4, '#F4EEDF', 1.2) + rond(184, 148, 4.4, '#F4EEDF', 1.2));
  s += `<g transform="rotate(-12 211 88)">${rond(211, 88, 17, 'none', 0).replace('stroke="none"', `stroke="${ROUGE.corps}" stroke-width="1.6"`)}${rond(211, 88, 13, 'none', 0).replace('stroke="none"', `stroke="${ROUGE.corps}" stroke-width="0.8" stroke-dasharray="1.6 1.4"`)}${hirondelle(219, 87, 1, ROUGE.corps)}</g>`;
  s += trait('M194,126 L228,126 M194,132 L220,132', '#B9A68A', 1);
  return s;
}

// Les pièces : [id, nom, [largeur, hauteur], tranche (haut, droite, bas, gauche ; null : pièce entière), dessin, où le jeu s'en sert, zones]
const PIECES = [
  ['estrade', 'Estrade de l\'aperçu', [240, 180], null, estrade, 'le fond de l\'aperçu en pied de l\'éditeur (avm__stage), en background cover ; les pieds de l\'avatar au centre du plateau', { pieds: [120, 154] }],
  ['onglet_repos', 'Onglet (au repos)', [64, 38], [14, 16, 2, 16], () => onglet(false), 'un onglet de l\'éditeur : Corps, Visage, Cheveux, Tenue, Objets (avm__tab)'],
  ['onglet_actif', 'Onglet (actif)', [64, 38], [14, 16, 2, 16], () => onglet(true), 'l\'onglet ouvert (avm__tab.is-on)'],
  ['choix_repos', 'Pastille d\'un choix (au repos)', [56, 34], [12, 14, 14, 14], () => choix(false), 'un choix de l\'éditeur (avm__chip)'],
  ['choix_actif', 'Pastille d\'un choix (choisie)', [56, 34], [12, 14, 14, 14], () => choix(true), 'le choix retenu (avm__chip.is-on)'],
  ['nuancier_repos', 'Cadre d\'un nuancier (au repos)', [34, 34], null, () => nuancier('repos'), 'une couleur à choisir (avm__swatch) : la couleur en CSS dessous, un rond de 22 px au centre'],
  ['nuancier_actif', 'Cadre d\'un nuancier (choisi)', [34, 34], null, () => nuancier('actif'), 'la couleur retenue (avm__swatch.is-on)'],
  ['nuancier_aucun', 'Nuancier « aucune couleur »', [34, 34], null, () => nuancier('aucun'), 'le choix « aucune couleur » (avm__swatch.is-none)'],
  ['tourner_gauche', 'Bouton « tourner à gauche »', [44, 44], null, () => tourner(false), 'faire tourner l\'aperçu vers la gauche (avm__turn--left)'],
  ['tourner_droite', 'Bouton « tourner à droite »', [44, 44], null, () => tourner(true), 'faire tourner l\'aperçu vers la droite (avm__turn--right)'],
  ['hasard', 'Bouton « Au hasard »', [100, 40], [14, 18, 16, 34], hasard, 'le bouton « Au hasard » (avm__luck), le texte à droite du dé'],
  ['panneau', 'Panneau de parchemin', [96, 96], [16, 16, 19, 16], panneau, 'la liste des choix de l\'éditeur (avm__panel), les blocs de la page du Sceau (g-panel)'],
  ['ruban', 'Ruban du nom', [140, 40], [8, 30, 12, 30], ruban, 'le nom du joueur sous son sceau (sceau__name)'],
  ['tuile_compteur', 'Tuile d\'un compteur', [72, 60], [13, 14, 16, 14], tuileCompteur, 'Registre, Succès, Records (sceau__stat)'],
  ['ligne_repos', 'Ligne de menu (au repos)', [160, 52], [14, 26, 16, 14], ligne('repos'), 'Mon compte, le Cabinet, les Succès, le prologue, écrire aux créateurs (sceau__row)'],
  ['ligne_appuye', 'Ligne de menu (appuyée)', [160, 52], [14, 26, 16, 14], ligne('appuye'), 'la ligne qu\'on touche'],
  ['barre_fond', 'Barre de progression (fond)', [64, 14], [6, 7, 6, 7], barreFond, 'la rainure d\'une barre (g-bar), les branches du sceau'],
  ['barre_plein', 'Barre de progression (remplie)', [64, 14], [6, 7, 6, 7], barrePlein, 'le remplissage d\'une barre, posé sur le fond à la largeur voulue'],
  ['carte_embarquement', 'Carte d\'embarquement', [240, 150], null, carte, 'la carte d\'embarquement du prologue : la photo dans sa fenêtre, le nom sur la première ligne', { photo: [16, 42, 58, 82], nom: [103, 52, 73, 14] }]
];

module.exports = { PIECES, HD };
