// Mini-jeux — le Filon, nouvelle version (design/conception/minijeux_grille.md, § 4) : la lanterne et son halo, le bloc
// humide, la boue et la poche d'eau qui crève, l'éboulement et la pierre perdue, l'album des trouvailles, le choix de
// l'outil, la rangée qui apparaît en bas. Mêmes règles que le Filon : bloc 32 × 32, effets 48 × 48 centrés sur le bloc,
// boucles en SMIL, coups en suites d'images, fichiers × 4.
const FI = require('./minijeu_filon');
const FP = require('./minijeu_filon_plus');
const OUT = '#3C2819', WHITE = '#FFFFFF';
const f = n => Math.round(n * 100) / 100;
const st = w => ` stroke="${OUT}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
const P = (d, fill, w = 1) => `<path d="${d}" fill="${fill}"${w ? st(w) : ''}/>`;
const E = (x, y, rx, ry, fill, w = 0) => `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(rx)}" ry="${f(ry)}" fill="${fill}"${w ? st(w) : ''}/>`;
const etoile = (x, y, r, fill = '#FFFBE8') => `<path d="M${f(x)},${f(y - r)} Q${f(x + r * 0.16)},${f(y - r * 0.16)} ${f(x + r)},${f(y)} Q${f(x + r * 0.16)},${f(y + r * 0.16)} ${f(x)},${f(y + r)} Q${f(x - r * 0.16)},${f(y + r * 0.16)} ${f(x - r)},${f(y)} Q${f(x - r * 0.16)},${f(y - r * 0.16)} ${f(x)},${f(y - r)} Z" fill="${fill}"/>`;
const FORME = 'M5,3 L27,3 Q29.5,3 29.5,5.5 L29.5,26.5 Q29.5,29 27,29 L5,29 Q2.5,29 2.5,26.5 L2.5,5.5 Q2.5,3 5,3 Z';
const goutte = (x, y, r, fill = '#7EC8F0') => P(`M${f(x)},${f(y - r * 1.6)} Q${f(x + r)},${f(y - r * 0.2)} ${f(x + r)},${f(y + r * 0.3)} Q${f(x + r)},${f(y + r)} ${f(x)},${f(y + r)} Q${f(x - r)},${f(y + r)} ${f(x - r)},${f(y + r * 0.3)} Q${f(x - r)},${f(y - r * 0.2)} ${f(x)},${f(y - r * 1.6)} Z`, fill, 0.5);

// ——— la lanterne (32 × 32) : allumée (la flamme danse, SMIL), éteinte (une charge utilisée) ———
function lanterne(allumee, anim = true) {
  let s = `<path d="M16,2 L16,6" stroke="${OUT}" stroke-width="1"/>` + P('M12.6,3.4 Q16,0.6 19.4,3.4', 'none', 1);
  if (allumee) s += `<circle cx="16" cy="17" r="13" fill="#FFD27A" opacity=".22">${anim ? '<animate attributeName="r" values="12;14;12" dur="1.2s" repeatCount="indefinite"/>' : ''}</circle>`;
  s += P('M11,6 L21,6 L22.4,9 L9.6,9 Z', '#6A5A4A', 0.9) + P('M10.4,9 L21.6,9 L20.6,24 L11.4,24 Z', allumee ? '#FFEFB8' : '#9A9488', 1);
  s += `<path d="M13.6,9.4 L13.4,23.6 M18.4,9.4 L18.6,23.6" stroke="#6A5A4A" stroke-width="0.8"/>`;
  if (allumee) s += `<g>${anim ? '<animateTransform attributeName="transform" type="scale" values="1 1;0.9 1.1;1.05 0.95;1 1" dur="0.7s" repeatCount="indefinite" additive="sum"/>' : ''}${P('M16,11.6 Q19.4,16 18,19.6 Q16,21.6 14,19.6 Q12.6,16 16,11.6 Z', '#FFB040', 0.6)}${E(16, 18.4, 1, 1.4, '#FFF2B8')}</g>`.replace('<g>', '<g transform-origin="16 20">');
  else s += P('M16,16 Q17,18 16,19.6 Q15,18 16,16 Z', '#5A5048', 0) + `<path d="M16,14 q1.4,-2 0,-4 q-1.4,-2 0,-3.4" fill="none" stroke="#C8C2B6" stroke-width="0.8" stroke-linecap="round" opacity=".7"/>`;
  s += P('M9.6,24 L22.4,24 L21.4,27 L10.6,27 Z', '#6A5A4A', 0.9) + `<path d="M11.6,10.4 L11.2,20" stroke="${WHITE}" stroke-width="1" stroke-linecap="round" opacity=".55"/>`;
  return s;
}
// le halo de la lanterne sur un bloc voisin du filon (48 × 48, 4 images : il s'allume, tient, s'éteint)
function halo(k) {
  const a = [0.5, 1, 1, 0.4][k], r = [10, 15, 16, 17][k];
  return `<circle cx="16" cy="16" r="${r}" fill="#FFE8A0" opacity="${f(0.35 * a)}"/><path d="${FORME}" fill="none" stroke="#FFD24A" stroke-width="2" opacity="${f(a)}"/>` + (k === 1 ? etoile(28, 4, 2.6) + etoile(4, 27, 2) : '') + (k === 2 ? etoile(27, 26, 2) : '');
}

// ——— le bloc humide (par-dessus un bloc ; une goutte perle et tombe, SMIL) ———
function humide(anim = true) {
  let s = [[9, 10, 4.4, 3], [21, 19, 5, 3.4], [12, 23, 3, 2]].map(([x, y, rx, ry]) => E(x, y, rx, ry, '#2A4A6A').replace('/>', ' opacity=".28"/>')).join('');
  s += goutte(22, 8, 1.4) + goutte(8, 18, 1.1);
  const chute = `<g>${anim ? '<animateTransform attributeName="transform" type="translate" values="0 0;0 0;0 9" keyTimes="0;0.6;1" dur="1.8s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;1;0" keyTimes="0;0.8;1" dur="1.8s" repeatCount="indefinite"/>' : ''}${goutte(16, 26, 1.3)}</g>`;
  return s + chute + `<path d="M6,6 Q8,5 10,6" fill="none" stroke="#BFE6FF" stroke-width="0.8" stroke-linecap="round"/>`;
}
// la boue (un bloc, 2 coups) : neuve, après un coup
function boue(coup) {
  let s = `<defs><linearGradient id="bo${coup}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8A6A48"/><stop offset="1" stop-color="#5A4430"/></linearGradient></defs><path d="${FORME}" fill="url(#bo${coup})"/>`;
  s += P('M2.6,9 Q8,12 13,9.4 Q18,7 23,10 Q27,12 29.4,9.6 L29.4,5.5 Q29.5,3 27,3 L5,3 Q2.5,3 2.5,5.5 Z', '#A88458', 0).replace('/>', ' opacity=".7"/>');
  s += [[9, 17, 2.2], [21, 21, 2.8], [14, 25, 1.6], [24, 14, 1.4]].map(([x, y, r]) => E(x, y, r, r * 0.7, '#4A3624') + E(x - r * 0.3, y - r * 0.3, r * 0.4, r * 0.25, '#B89068')).join('');
  s += `<path d="M6,5 L14,5" stroke="#E8D0A8" stroke-width="1.1" stroke-linecap="round" opacity=".6"/><path d="${FORME}" fill="none"${st(1.1)}/>`;
  if (coup) s += `<path d="M10,12 Q16,16 22,12 M16,15 L16,22" fill="none" stroke="#3A2A1A" stroke-width="1.1" stroke-linecap="round"/>`;
  return s;
}
// l'eau qui gicle d'une poche crevée (48 × 48, 4 images) : vers les quatre voisins
function inonde(k) {
  const t = (k + 1) / 4;
  let s = k < 2 ? `<circle cx="16" cy="16" r="${f(5 + t * 10)}" fill="#7EC8F0" opacity="${f(0.5 - t * 0.3)}"/>` : '';
  for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) for (let j = 0; j < 2; j++) { const d = 4 + t * 11 + j * 3; s += goutte(16 + dx * d + dy * (j ? 2 : -2), 16 + dy * d + dx * (j ? 2 : -2), f(1.8 - j * 0.5)).replace('/>', ` opacity="${f(1 - t * 0.6)}"/>`); }
  return s;
}
// ——— l'éboulement : un bloc de la colonne qui tremble puis s'effondre (4 images, 48 × 48) ———
function eboule(k) {
  if (k === 0) return `<g transform="translate(-1.2 0) rotate(-3 16 16)">${FI.bloc(1, 0, 'eb0')}</g><path d="M-2,8 l-3,-1 M-2,20 l-3,1 M34,10 l3,-1 M34,22 l3,1" stroke="${OUT}" stroke-width="1" stroke-linecap="round"/>`;
  if (k === 1) return `<g transform="translate(1.2 1) rotate(3 16 16)">${FI.bloc(1, 2, 'eb1')}</g>`;
  const t = (k - 1) / 2;
  let s = '';
  [[8, 10, -1], [22, 9, 1], [10, 22, -0.6], [22, 22, 0.8], [16, 16, 0]].forEach(([x, y, dx], i) => { s += `<g transform="translate(${f(x + dx * t * 6)} ${f(y + t * 9 + i)}) rotate(${f(i * 40 + t * 90)})" opacity="${f(1 - t * 0.5)}">${P('M-4,-3 L3,-3.6 L4.4,2 L-2,3.6 Z', FI.ROCHE[1].corps, 0.8)}</g>`; });
  for (let i = 0; i < 4; i++) s += E(4 + i * 8, 34 - t * 4, 5 + t * 2, 3, '#E2D2B4').replace('/>', ` opacity="${f(0.55 * (1 - t * 0.6))}"/>`);
  return s;
}
// la pierre perdue dans l'éboulement (4 images, 32 × 32) : elle se ternit, se fend et tombe
function perdue(g, k) {
    let s = `<g transform="translate(0 ${k * 3}) rotate(${k * 8} 16 16)" opacity="${f(1 - k * 0.25)}">${FI.gemme(g, 'pp' + g + k)}${k >= 2 ? `<path d="M14,8 L17,14 L14.6,19 L17.4,25" fill="none" stroke="${OUT}" stroke-width="1"/>` : ''}</g>`;
  return s;
}
// ——— l'album des trouvailles : la page (112 × 80, 6 cases), une case vide (la silhouette), remplie, nouvelle ———
function page() {
  let s = P('M3,4 Q56,0 109,4 L109,76 Q56,80 3,76 Z', '#F4E8C8', 1.2) + `<path d="M56,3 L56,78" stroke="#C8B088" stroke-width="0.8"/>`;
  s += [10, 30, 50].map(y => `<path d="M8,${y + 6} L104,${y + 6}" stroke="#E2D2AE" stroke-width="0.5"/>`).join('');
  s += P('M48,0 L64,0 L62,8 L56,6 L50,8 Z', '#D8443A', 0.8);
  return s;
}
const CASES = [[8, 8], [36, 8], [64, 8], [8, 42], [36, 42], [64, 42]].map(([x, y]) => [x + 4, y + 2]);
function caseAlbum(k, etat) {
  let s = P('M3,3 L29,3 L29,29 L3,29 Z', etat === 'vide' ? '#EADCB8' : '#FFF6DE', 0.8).replace('/>', ' stroke-dasharray="' + (etat === 'vide' ? '2 1.4' : '0') + '"/>');
  if (etat === 'vide') s += `<g opacity=".22" transform="translate(16 16) scale(0.72) translate(-16 -16)">${FP.trouvaille(k).replace(/fill="#[0-9A-Fa-f]{6}"/g, 'fill="#5A4A38"').replace(/stroke="#[0-9A-Fa-f]{6}"/g, 'stroke="#5A4A38"')}</g>`;
  else s += `<g transform="translate(16 16) scale(0.78) translate(-16 -16)">${FP.trouvaille(k)}</g>` + P('M2,6 L6,2 M26,2 L30,6', 'none', 0).replace('fill="none"', 'fill="none" stroke="#C8B088" stroke-width="1.4"');
  if (etat === 'nouvelle') s += `<path d="M3,3 L29,3 L29,29 L3,29 Z" fill="none" stroke="#FFD24A" stroke-width="1.6"/>` + etoile(28, 4, 3) + etoile(5, 27, 2);
  return s;
}
// ——— le choix de l'outil : le médaillon (32 × 32) d'une pioche, choisi ou non ; le changement (4 images) ———
function medaillon(m, choisi) {
  let s = E(16, 16, 13.4, 13.4, choisi ? '#FFF2C4' : '#C8B89A', 1.1) + E(16, 16, 11, 11, 'none').replace('fill="none"', `fill="none" stroke="${choisi ? '#FFD24A' : '#A8987A'}" stroke-width="1.2"`);
  s += `<g transform="translate(16 16) scale(0.74) translate(-15.7 -21.15)">${FP.pioche(m, 0)}</g>`;
  if (choisi) s += etoile(26, 6, 2.4) + etoile(6, 25, 1.6);
  else s += E(16, 16, 13.4, 13.4, '#3C2819').replace('/>', ' opacity=".18"/>');
  return s;
}
function change(m, k) {
  const sc = [0.4, 1.2, 0.95, 1][k];
  let s = `<g transform="translate(16 16) scale(${sc}) rotate(${[-90, 15, -6, 0][k]}) translate(-16 -16)">${medaillon(m, true)}</g>`;
  if (k === 1) s += [0, 1, 2, 3, 4, 5, 6, 7].map(i => { const a = i * 0.785; return `<path d="M${f(16 + Math.cos(a) * 17)},${f(16 + Math.sin(a) * 17)} L${f(16 + Math.cos(a) * 21)},${f(16 + Math.sin(a) * 21)}" stroke="#FFE07A" stroke-width="1.6" stroke-linecap="round"/>`; }).join('');
  return s;
}
// ——— la rangée qui apparaît en bas : un bloc qui monte (4 images, 32 × 32) ———
function monte(h, k) {
  const dy = [24, 12, -2, 0][k];
  return `<defs><clipPath id="mc${h}${k}"><rect x="-4" y="-4" width="40" height="36"/></clipPath></defs><g clip-path="url(#mc${h}${k})"><g transform="translate(0 ${dy})">${FI.bloc(h, 0, 'mo' + h + k)}</g></g>` + (k < 3 ? [6, 16, 26].map((x, i) => E(x, 31, 3 + k, 1.6, '#E2D2B4').replace('/>', ` opacity="${f(0.7 - k * 0.2)}"/>`)).join('') : '');
}


// ——— les pièces (dans le dossier du Filon) : { id, nom, cadre, dessin, suite, ms par image, boucle } ———
const PIECES = [];
const piece = (id, nom, cadre, dessin, suite = null, ms = null, boucle = false) => PIECES.push({ id, nom, cadre, dessin, suite, ms, boucle });
const BLOC = [0, 0, 32, 32], LARGE = [-8, -8, 48, 48];
const DURETES = { 1: 'tendre', 2: 'dur', 3: 'tres-dur' };
piece('lanterne', 'La lanterne allumée (la flamme danse, en boucle)', BLOC, () => lanterne(true));
piece('lanterne_eteinte', 'La lanterne éteinte (une charge utilisée)', BLOC, () => lanterne(false));
for (let k = 0; k < 4; k++) piece(`halo_${k + 1}`, 'Le halo de la lanterne sur un bloc voisin du filon (1 seconde)', LARGE, () => halo(k), 'halo', 250);
piece('humide', 'Le bloc humide (par-dessus le bloc ; une goutte tombe, en boucle)', BLOC, () => humide());
piece('boue', 'La boue (2 coups)', BLOC, () => boue(0));
piece('boue_fissure-1', 'La boue, après 1 coup', BLOC, () => boue(1));
for (let k = 0; k < 4; k++) piece(`inondation_${k + 1}`, 'La poche d\'eau qui crève', LARGE, () => inonde(k), 'inondation', 80);
for (let k = 0; k < 4; k++) piece(`eboulement_${k + 1}`, 'Un bloc de la colonne qui s\'éboule', LARGE, () => eboule(k), 'eboulement', 90);
for (const g of Object.keys(FI.GEMMES)) for (let k = 0; k < 4; k++) piece(`perdue-${g}_${k + 1}`, `La pierre perdue dans l'éboulement (${FI.GEMMES[g].nom})`, BLOC, () => perdue(g, k), `perdue-${g}`, 110);
piece('album', 'La page de l\'album des trouvailles (six cases)', [0, 0, 112, 80], page);
for (const k of Object.keys(FP.TROUVAILLES)) for (const etat of ['vide', 'plein', 'nouvelle']) piece(`album-${k}${etat === 'plein' ? '' : '_' + etat}`, `Une case de l'album : ${FP.TROUVAILLES[k].nom}${etat === 'vide' ? ', à trouver' : etat === 'nouvelle' ? ', nouvelle' : ''}`, BLOC, () => caseAlbum(k, etat));
for (const m of ['bois', 'fer', 'or']) {
  piece(`outil-${m}`, `Le médaillon de la pioche ${FP.METAUX[m].nom}`, BLOC, () => medaillon(m, false));
  piece(`outil-${m}_choisi`, `Le médaillon de la pioche ${FP.METAUX[m].nom}, choisi`, BLOC, () => medaillon(m, true));
  for (let k = 0; k < 4; k++) piece(`outil-change-${m}_${k + 1}`, `On prend la pioche ${FP.METAUX[m].nom}`, LARGE, () => change(m, k), `outil-change-${m}`, 80);
}
for (const h of [1, 2, 3]) for (let k = 0; k < 4; k++) piece(`monte-${DURETES[h]}_${k + 1}`, `Un bloc ${FI.ROCHE[h].nom.split(' (')[0]} qui monte (la rangée qui apparaît en bas)`, BLOC, () => monte(h, k), `monte-${DURETES[h]}`, 70);

const LISEZ_MOI = 'Nouvelle version (design/conception/minijeux_grille.md) : la lanterne et le bloc humide, la boue, la pierre perdue, le médaillon d\'un outil et le bloc qui monte ont le cadre d\'un bloc (32 × 32) ; le bloc humide se pose par-dessus le bloc. Le halo, la poche qui crève, l\'éboulement et le changement d\'outil : 48 × 48 centrés sur le bloc. L\'album : la page (112 × 80) et, par-dessus, six cases (32 × 32) en x = 12, 40, 68 et y = 10, 44.';
module.exports = { PIECES, LISEZ_MOI, lanterne, halo, humide, boue, inonde, eboule, perdue, page, CASES, caseAlbum, medaillon, change, monte };
