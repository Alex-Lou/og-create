// La carte d'embarquement de l'Hirondelle (320 × 210, pixels d'affichage), pour l'interface du joueur (perso.js) : un
// vrai billet de bateau en papier, neuf, tamponné « EMBARQUÉ » (étape 0c) ou trempé par le naufrage (le réveil sur la
// plage de Brumelune). Le papier : son ombre, ses bords à peine irréguliers, son grain et ses fibres, l'hirondelle en filigrane, un
// double filet et des coins dorés, une frise de vagues. L'en-tête bleu marine : l'écusson doré de la compagnie et son
// hirondelle, « L'HIRONDELLE », la compagnie, le numéro du billet. À gauche, la photo (un tirage à bord blanc, penché,
// tenu par des coins photo) ; à droite, les champs (Nom à écrire, Départ, Destination, Date, Pont, Cabine 7) ; au bout,
// le talon détachable (perforations, encoches, numéro, cabine, code-barres). Les textes sont ceux de la carte des scènes
// (scenes6.js), en Georgia. La photo et le nom viennent du jeu : leurs zones sont dans perso.json.
const { OUT, P, E, clip, r2 } = require('./troupe');

const W = 1.4;
const MARINE = { corps: '#2E4E8C', ombre: '#22396A', clair: '#4E72B4' };
const PAPIER = { corps: '#F8F0DC', ombre: '#EADBB8', fibre: '#D9C8A2', encre: '#6B5A48' };
const OR = { clair: '#FFE596', corps: '#E8B84A', ombre: '#B8862A' };
const ROUGE = '#C8463A';
const ENCRE = '#2E4E8C';
// les zones que le jeu remplit (pixels d'affichage) : la photo (x, y, largeur, hauteur, angle en degrés autour de son
// centre) et la ligne du nom (x, y, largeur, hauteur)
// le bord arraché du coin bas droit (carte trempée)
const DECHIRE = ' L313,170 Q309.6,171.6 311.4,175.4 L307.8,178.6 Q305.2,182 307.4,185.6 L302.6,188 Q299.2,190.6 300.8,194.8 L295.6,196.4 Q291.4,198.6 292.4,202 L286,203 L282,204';
const ZONES = { photo: [29, 80, 58, 70, -4], nom: [104, 88, 128, 13] };

const texte = (x, y, t, size, col, extra = '', ancre = 'start') => `<text x="${r2(x)}" y="${r2(y)}" font-family="Georgia, 'Times New Roman', serif" font-size="${size}" fill="${col}" text-anchor="${ancre}" ${extra}>${t}</text>`;
const trait = (d, color, w, extra = '') => `<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
// un hasard réglé (graine fixe) : le grain du papier et le code-barres sont les mêmes à chaque fois
const hasard = (graine) => () => (graine = (graine * 16807) % 2147483647) / 2147483647;

// Le papier : un rectangle aux coins doux dont les bords ondulent à peine ; dechire : le coin bas droit arraché
function papierD(dechire) {
  const bord = (x0, y0, x1, y1, n, amp, h) => { let d = ''; for (let i = 1; i <= n; i++) { const t = i / n; d += ` L${r2(x0 + (x1 - x0) * t + (y1 !== y0 ? (h() - 0.5) * amp : 0))},${r2(y0 + (y1 - y0) * t + (x1 !== x0 ? (h() - 0.5) * amp : 0))}`; } return d; };
  const h = hasard(11);
  let d = 'M12,6' + bord(12, 6, 308, 6, 14, 0.9, h) + ' Q314,6 314,12';
  if (dechire) d += bord(314, 12, 314, 166, 10, 0.9, h) + DECHIRE;
  else d += bord(314, 12, 314, 198, 12, 0.9, h) + ' Q314,204 308,204';
  d += bord(dechire ? 282 : 308, 204, 12, 204, 14, 0.9, h) + ' Q6,204 6,198' + bord(6, 198, 6, 12, 12, 0.9, h) + ' Q6,6 12,6 Z';
  return d;
}

// L'hirondelle (tournée vers la droite, son bec en (0, 0)) : longues ailes en arrière, queue fourchue, le ventre clair
function hirondelle(x, y, s, col, ventre) {
  const corps = 'M10,0 C8,-1.7 5,-2 2.6,-1.1 L-7,-9.4 C-5.4,-5.4 -3.4,-2.4 -1.2,-0.7 L-12,-1.4 L-4.6,0.9 L-12,4.6 L-2.4,2.2 L-7.4,8.6 C-3.4,4.8 -0.6,2.6 2,2 C5,2.4 8,1.6 10,0 Z';
  return `<g transform="translate(${r2(x)} ${r2(y)}) scale(${s})"><path d="${corps}" fill="${col}"/>`
    + (ventre ? `<path d="M9,0.6 C6,1.6 3.4,1.8 1.6,1.4 C3.6,2.4 6.6,2.2 9,0.6 Z" fill="${ventre}"/><circle cx="6.4" cy="-0.5" r="0.55" fill="${ventre === '#FFFFFF' ? MARINE.corps : '#FFFFFF'}"/>` : '') + '</g>';
}

// L'écusson de la compagnie : un blason bordé d'or, l'hirondelle blanche sur le bleu, une étoile
function ecusson(x, y) {
  const D = `M${x - 12},${y - 15} L${x + 12},${y - 15} L${x + 12},${y + 2} Q${x + 12},${y + 12} ${x},${y + 18} Q${x - 12},${y + 12} ${x - 12},${y + 2} Z`;
  const d2 = `M${x - 9.4},${y - 12.4} L${x + 9.4},${y - 12.4} L${x + 9.4},${y + 1.6} Q${x + 9.4},${y + 10} ${x},${y + 15} Q${x - 9.4},${y + 10} ${x - 9.4},${y + 1.6} Z`;
  return P(D, OR.corps, W) + P(d2, MARINE.clair, 0.8) + clip('ceb', d2, `<rect x="${x}" y="${y - 14}" width="12" height="32" fill="${MARINE.corps}" opacity=".5"/>`)
    + hirondelle(x - 1, y + 1, 0.82, '#FFFFFF', '#FFFFFF')
    + trait(`M${x - 8},${y - 13.4} L${x + 3},${y - 13.4}`, OR.clair, 0.9);
}

// Une ligne de champ : le libellé en petites capitales brunes, la valeur à l'encre bleue (en italique), le trait
function champ(x, y, w, libelle, valeur) {
  return texte(x, y, libelle, 5.6, PAPIER.encre, 'letter-spacing="0.6"') + trait(`M${x},${r2(y + 9)} L${r2(x + w)},${r2(y + 9)}`, '#A8987C', 0.6)
    + (valeur ? texte(x + 1, y + 7.6, valeur, 8, ENCRE, 'font-style="italic"') : '');
}

// La carte : etat 'neuve', 'tampon' (le tampon rouge « EMBARQUÉ ») ou 'trempee' (après le naufrage)
function carte(etat = 'neuve') {
  const trempee = etat === 'trempee', id = `ce${etat[0]}`;
  const D = papierD(trempee);
  const h = hasard(7);
  // l'ombre portée, puis le papier, son grain, ses fibres, le filigrane
  let s = `<path d="${D}" fill="rgba(30,20,10,.28)" transform="translate(2.4 3.2)"/>` + P(D, PAPIER.corps, 0);
  let grain = '';
  for (let i = 0; i < 260; i++) grain += `<circle cx="${r2(h() * 320)}" cy="${r2(h() * 210)}" r="${r2(0.25 + h() * 0.45)}" fill="${h() > 0.5 ? PAPIER.fibre : '#FFFFFF'}" opacity="${r2(0.25 + h() * 0.35)}"/>`;
  for (let i = 0; i < 26; i++) { const x = h() * 300 + 10, y = h() * 190 + 10; grain += trait(`M${r2(x)},${r2(y)} q${r2(3 + h() * 5)},${r2((h() - 0.5) * 2)} ${r2(8 + h() * 8)},${r2((h() - 0.5) * 1.4)}`, PAPIER.fibre, 0.35, 'opacity=".55"'); }
  s += clip(`${id}p`, D, `<rect x="0" y="150" width="320" height="60" fill="${PAPIER.ombre}" opacity=".45"/>` + grain
    + `<g opacity=".07">${hirondelle(186, 128, 5.2, MARINE.corps)}</g>`
    // l'en-tête bleu marine, son liseré doré, ses vaguelettes
    + `<rect x="0" y="0" width="320" height="46" fill="${MARINE.corps}"/><rect x="0" y="38" width="320" height="8" fill="${MARINE.ombre}"/>`
    + trait('M0,46.4 L320,46.4', OR.corps, 1.4) + trait('M0,41 Q6,38.6 12,41 T24,41 T36,41 T48,41 T60,41 T72,41 T84,41 T96,41 T108,41 T120,41 T132,41 T144,41 T156,41 T168,41 T180,41 T192,41 T204,41 T216,41 T228,41 T240,41 T252,41 T264,41 T276,41 T288,41 T300,41 T312,41 T324,41', '#7E9CD0', 0.7)
    + `<rect x="243" y="47" width="80" height="170" fill="${PAPIER.ombre}" opacity=".5"/>`
    + (trempee ? taches() : '')) + P(D, 'none', W);
  // le titre, la compagnie, le numéro
  s += ecusson(30, 25);
  s += texte(50, 25, 'L’HIRONDELLE', 15, '#F6EFDC', 'font-weight="bold" letter-spacing="1.6"') + texte(51, 35.4, 'Compagnie des Îles de la Brume', 6.6, OR.clair, 'font-style="italic" letter-spacing="0.4"');
  s += texte(236, 22, 'BILLET', 5.4, '#B8C8E8', 'letter-spacing="1.4"', 'end') + texte(236, 32, 'N° 0742', 9, '#F6EFDC', 'font-weight="bold"', 'end');
  // le cadre intérieur à double filet et ses coins dorés
  s += trait('M12,52 L236,52 L236,198 L12,198 Z', MARINE.corps, 0.8, 'opacity=".75"') + trait('M14.6,54.6 L233.4,54.6 L233.4,195.4 L14.6,195.4 Z', MARINE.corps, 0.4, 'opacity=".55"');
  const coin = (x, y, sx, sy) => `<g transform="translate(${x} ${y}) scale(${sx} ${sy})">${trait('M0,9 L0,0 L9,0', OR.ombre, 1.6)}${trait('M2.6,8 Q2.6,2.6 8,2.6', OR.corps, 0.9)}<circle cx="0" cy="0" r="1.7" fill="${OR.corps}" stroke="${OUT}" stroke-width="0.5"/></g>`;
  s += coin(12, 52, 1, 1) + coin(236, 52, -1, 1) + coin(12, 198, 1, -1) + coin(236, 198, -1, -1);
  // la frise de vagues, en bas du cadre
  let vagues = 'M28,191';
  for (let x = 28; x < 220; x += 8) vagues += ` q2,-2.6 4,0 q2,2.6 4,0`;
  s += trait(vagues, MARINE.clair, 0.6, 'opacity=".6"');
  // la photo : un tirage à bord blanc, penché, deux coins photo noirs
  const [px, py, pw, ph, pa] = ZONES.photo, cx = px + pw / 2, cy = py + ph / 2;
  s += `<g transform="rotate(${pa} ${cx} ${cy})"><rect x="${px - 4}" y="${py - 4}" width="${pw + 8}" height="${ph + 14}" fill="rgba(30,20,10,.22)" transform="translate(1.2 1.6)"/>`
    + `<rect x="${px - 4}" y="${py - 4}" width="${pw + 8}" height="${ph + 14}" fill="#FFFDF6" stroke="${OUT}" stroke-width="0.8"/>`
    + `<rect x="${px}" y="${py}" width="${pw}" height="${ph}" fill="#DCE6F0" stroke="#9AA8B8" stroke-width="0.5"/>`
    + `<path d="M${px},${py} L${px + pw},${py} L${px},${py + ph * 0.5} Z" fill="#FFFFFF" opacity=".25"/>`
    + (() => { const mx = px - 4, my = py - 4, mr = px + pw + 4, mb = py + ph + 10; return `<path d="M${mx - 2},${my + 9} L${mx - 2},${my - 2} L${mx + 9},${my - 2} Z" fill="#3A302A"/><path d="M${mr + 2},${mb - 9} L${mr + 2},${mb + 2} L${mr - 9},${mb + 2} Z" fill="#3A302A"/>`; })()
    + texte(cx, py + ph + 7.4, 'Passager', 5, '#8A7A64', 'font-style="italic"', 'middle') + '</g>';
  // les champs : Carte d'embarquement, Nom (à écrire par le jeu), Départ, Destination, Date, Pont, Cabine
  s += texte(104, 70, 'Carte d’embarquement', 11, ENCRE, 'font-style="italic"') + trait('M104,74 L170,74', OR.corps, 0.9);
  s += champ(104, 86, 128, 'NOM', '');
  s += champ(104, 114, 56, 'DÉPART', 'Havre-Gris') + champ(166, 114, 66, 'DESTINATION', 'Îles de la Brume');
  s += champ(104, 140, 128, 'DATE', 'Nuit de la grande marée');
  s += champ(104, 166, 56, 'PONT', 'Promenade') + champ(166, 166, 30, 'CABINE', '') + texte(181, 173.6, '7', 10, ENCRE, 'font-weight="bold"', 'middle') + champ(202, 166, 30, 'SIÈGE', '12');
  // le talon : perforations, encoches, numéro, cabine, code-barres, hirondelle
  s += trait('M243,52 L243,198', '#8A7A64', 0.9, 'stroke-dasharray="1.4 2.2"');
  s += clip(`${id}e`, D, `<circle cx="243" cy="6" r="5" fill="#F4EEDF" stroke="${OUT}" stroke-width="${W}"/>` + (trempee ? '' : `<circle cx="243" cy="204" r="5" fill="#F4EEDF" stroke="${OUT}" stroke-width="${W}"/>`));
  s += texte(279, 22, 'TALON', 6, '#B8C8E8', 'letter-spacing="2"', 'middle') + hirondelle(285, 33, 0.9, '#F6EFDC');
  s += texte(279, 68, 'N° 0742', 9, ENCRE, 'font-weight="bold"', 'middle') + texte(279, 84, 'Cabine 7 · Siège 12', 5.6, PAPIER.encre, '', 'middle');
  s += texte(279, 98, 'Havre-Gris', 6.2, ENCRE, 'font-style="italic"', 'middle') + trait('M274,102 L284,102 M281,99.6 L284,102 L281,104.4', PAPIER.encre, 0.7) + texte(279, 113, 'Îles de la Brume', 6.2, ENCRE, 'font-style="italic"', 'middle');
  const hb = hasard(29);
  let barres = '', x = 254;
  while (x < 304) { const w = 0.6 + Math.floor(hb() * 3) * 0.6; barres += `<rect x="${r2(x)}" y="148" width="${r2(w)}" height="30" fill="#2A2420"/>`; x += w + 0.8 + hb() * 1.2; }
  s += barres + texte(279, 186, '0742 · 07 · 12', 5, PAPIER.encre, 'letter-spacing="0.6"', 'middle');
  if (etat === 'tampon') s += tampon();
  if (trempee) s += clip(`${id}d`, D, trempe(h) + trait(`M314,166${DECHIRE}`, '#E2D2AE', 2.2, 'opacity=".9"'));
  return s;
}

// Le tampon rouge « EMBARQUÉ » : double cadre, la date en dessous, l'encre un peu usée (des trous de papier dedans)
function tampon() {
  const h = hasard(5);
  let trous = '';
  for (let i = 0; i < 40; i++) trous += `<circle cx="${r2(150 + h() * 90)}" cy="${r2(160 + h() * 34)}" r="${r2(0.4 + h() * 0.9)}" fill="${PAPIER.corps}"/>`;
  return `<g transform="rotate(-11 196 176)" opacity=".86"><rect x="152" y="160" width="88" height="32" rx="5" fill="none" stroke="${ROUGE}" stroke-width="2.6"/>`
    + `<rect x="156" y="163.6" width="80" height="24.8" rx="3" fill="none" stroke="${ROUGE}" stroke-width="0.9"/>`
    + texte(196, 179, 'EMBARQUÉ', 11.5, ROUGE, 'font-weight="bold" letter-spacing="1"', 'middle') + texte(196, 186.4, 'L’HIRONDELLE · CABINE 7', 4.4, ROUGE, 'letter-spacing="0.6"', 'middle')
    + trous + '</g>';
}

// Les taches d'eau, dans le papier : des auréoles beiges au bord plus sombre (la ligne de marée)
function taches() {
  const aureole = (x, y, rx, ry, a) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" transform="rotate(${a} ${x} ${y})" fill="rgba(150,160,150,.16)" stroke="rgba(120,96,60,.38)" stroke-width="0.9"/>`
    + `<ellipse cx="${x - rx * 0.2}" cy="${y - ry * 0.15}" rx="${rx * 0.6}" ry="${ry * 0.55}" transform="rotate(${a} ${x} ${y})" fill="none" stroke="rgba(120,96,60,.2)" stroke-width="0.6"/>`;
  return aureole(206, 150, 34, 22, -12) + aureole(60, 188, 30, 14, 8) + aureole(282, 132, 22, 34, 4) + aureole(150, 60, 20, 10, 0)
    + '<rect x="0" y="0" width="320" height="210" fill="rgba(110,140,160,.10)"/>';
}
// Le naufrage, par-dessus : l'encre bleue qui a coulé sous les écritures, un pli en travers, le bord déchiré ombré
function trempe(h) {
  let s = '';
  for (const [x, y, n] of [[108, 122, 5], [170, 122, 6], [108, 148, 8], [108, 174, 4], [180, 176, 1], [205, 174, 2], [272, 70, 4], [266, 100, 3], [266, 115, 4]]) {
    for (let i = 0; i < n; i++) { const xx = x + i * 6 + h() * 3, l = 3 + h() * 7; s += trait(`M${r2(xx)},${y} q${r2((h() - 0.5) * 1.4)},${r2(l / 2)} ${r2((h() - 0.5) * 1.2)},${r2(l)}`, ENCRE, r2(0.5 + h() * 0.5), 'opacity=".32"') + `<circle cx="${r2(xx)}" cy="${r2(y + l)}" r="0.7" fill="${ENCRE}" opacity=".3"/>`; }
  }
  s += trait('M96,6 Q110,100 128,204', '#FFFFFF', 1.4, 'opacity=".55"') + trait('M97.6,6 Q111.6,100 129.6,204', 'rgba(120,96,60,.35)', 0.8);
  return s;
}

module.exports = { carte, ZONES };
