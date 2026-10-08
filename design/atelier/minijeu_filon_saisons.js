// Mini-jeux — le Filon, nouvelle version (design/conception/minijeux_grille.md, § 4) : la lanterne et son halo, le bloc
// humide, la boue et la poche d'eau qui crève, l'éboulement et la pierre perdue, l'album des trouvailles, le choix de
// l'outil, la rangée qui apparaît en bas. Mêmes règles que le Filon : bloc 32 × 32, effets 48 × 48 centrés sur le bloc,
// boucles en SMIL, coups en suites d'images, fichiers × 4. Chaque pièce porte ses propres dégradés (ids préfixés).
const FI = require('./minijeu_filon');
const FP = require('./minijeu_filon_plus');
const OUT = '#3C2819', WHITE = '#FFFFFF';
const f = n => Math.round(n * 100) / 100;
const st = w => ` stroke="${OUT}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
const P = (d, fill, w = 1) => `<path d="${d}" fill="${fill}"${w ? st(w) : ''}/>`;
const E = (x, y, rx, ry, fill, w = 0) => `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(rx)}" ry="${f(ry)}" fill="${fill}"${w ? st(w) : ''}/>`;
const L = (d, c, w, extra = '') => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"${extra}/>`;
const lin = (id, stops, x2 = 0, y2 = 1) => `<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}">${stops.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join('')}</linearGradient>`;
const rad = (id, stops, cx = 0.4, cy = 0.35, r = 0.75) => `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}">${stops.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join('')}</radialGradient>`;
const etoile = (x, y, r, fill = '#FFFBE8') => `<path d="M${f(x)},${f(y - r)} Q${f(x + r * 0.16)},${f(y - r * 0.16)} ${f(x + r)},${f(y)} Q${f(x + r * 0.16)},${f(y + r * 0.16)} ${f(x)},${f(y + r)} Q${f(x - r * 0.16)},${f(y + r * 0.16)} ${f(x - r)},${f(y)} Q${f(x - r * 0.16)},${f(y - r * 0.16)} ${f(x)},${f(y - r)} Z" fill="${fill}"/>`;
const FORME = 'M5,3 L27,3 Q29.5,3 29.5,5.5 L29.5,26.5 Q29.5,29 27,29 L5,29 Q2.5,29 2.5,26.5 L2.5,5.5 Q2.5,3 5,3 Z';
// une goutte d'eau ronde et brillante (dégradé partagé par la pièce : #<p>g)
const goutte = (p, x, y, r) => P(`M${f(x)},${f(y - r * 1.7)} Q${f(x + r * 1.1)},${f(y - r * 0.2)} ${f(x + r)},${f(y + r * 0.3)} Q${f(x + r)},${f(y + r)} ${f(x)},${f(y + r)} Q${f(x - r)},${f(y + r)} ${f(x - r)},${f(y + r * 0.3)} Q${f(x - r * 1.1)},${f(y - r * 0.2)} ${f(x)},${f(y - r * 1.7)} Z`, `url(#${p}g)`, 0.5) + E(x - r * 0.35, y - r * 0.15, r * 0.25, r * 0.38, WHITE);
const defGoutte = p => rad(p + 'g', [[0, '#DFF6FF'], [0.5, '#7EC8F0'], [1, '#3E8AC0']], 0.4, 0.4, 0.7);

// ——— la lanterne (32 × 32) : allumée (la flamme danse, SMIL), éteinte (une charge utilisée) ———
// un chapeau et un pied de laiton, quatre montants, une vitre qui rougeoie, l'anneau pour la pendre
function lanterne(allumee, anim = true) {
  const p = allumee ? 'lta' : 'lte';
  let s = `<defs>${lin(p + 'm', [[0, '#F2D07A'], [0.5, '#C89A3A'], [1, '#8A6020']], 1, 0)}${rad(p + 'v', allumee ? [[0, '#FFFBE0'], [0.45, '#FFE08A'], [1, '#F2A84A']] : [[0, '#A8A49C'], [1, '#6E6A64']], 0.5, 0.55, 0.65)}${rad(p + 'h', [[0, '#FFE8A0'], [1, '#FFE8A0']], 0.5, 0.5, 0.5)}${lin(p + 'f', [[0, '#FFF2B8'], [0.5, '#FFB040'], [1, '#E8642A']])}</defs>`;
  if (allumee) s += `<circle cx="16" cy="17" r="14" fill="#FFD27A" opacity=".2">${anim ? '<animate attributeName="r" values="12.5;14.5;12.5" dur="1.2s" repeatCount="indefinite"/><animate attributeName="opacity" values=".16;.28;.16" dur="1.2s" repeatCount="indefinite"/>' : ''}</circle>`;
  s += L('M12.4,4.6 Q16,0.4 19.6,4.6', OUT, 2.2) + L('M12.4,4.6 Q16,0.4 19.6,4.6', `url(#${p}m)`, 1.1);
  s += P('M10.6,8.6 Q11,5.4 16,5 Q21,5.4 21.4,8.6 Z', `url(#${p}m)`, 0.9) + E(16, 5, 1.2, 0.9, `url(#${p}m)`, 0.6);
  s += P('M10.6,9 L21.4,9 L20.6,23.6 L11.4,23.6 Z', `url(#${p}v)`, 1);
  if (allumee) s += `<g transform-origin="16 20.4">${anim ? '<animateTransform attributeName="transform" type="scale" values="1 1;0.9 1.12;1.06 0.94;1 1" dur="0.7s" repeatCount="indefinite"/>' : ''}${P('M16,11.6 Q19.8,16 18.2,19.8 Q16,21.8 13.8,19.8 Q12.2,16 16,11.6 Z', `url(#${p}f)`, 0.6)}${E(16, 18.4, 1.1, 1.6, '#FFFBE0')}</g>`;
  else s += P('M15.2,17 L16.8,17 L16.6,21 L15.4,21 Z', '#E8E0D0', 0.5) + L('M16,15.6 q1.4,-2 0,-3.6 q-1.4,-1.8 0,-3.4', '#E2DED6', 0.9, ' opacity=".8"');
  s += L('M13.6,9.4 L13.2,23.2 M18.4,9.4 L18.8,23.2', `url(#${p}m)`, 1.1) + L('M11.8,10.4 L11.6,21', WHITE, 1, ' opacity=".55"');
  s += P('M9.8,23.4 L22.2,23.4 L21.4,27 Q16,28 10.6,27 Z', `url(#${p}m)`, 0.9) + L('M11,24.6 L21,24.6', '#FFF2B8', 0.7, ' opacity=".8"');
  return s;
}
// le halo de la lanterne sur un bloc voisin du filon (48 × 48, 4 images : il s'allume, tient, s'éteint)
function halo(k) {
  const a = [0.5, 1, 1, 0.4][k], r = [10, 15, 16, 17][k], p = `ha${k}`;
  let s = `<defs>${rad(p, [[0, '#FFF6C8'], [0.6, '#FFE08A'], [1, '#FFD24A']], 0.5, 0.5, 0.5)}</defs>`;
  s += `<circle cx="16" cy="16" r="${r}" fill="url(#${p})" opacity="${f(0.4 * a)}"/>`;
  s += `<path d="${FORME}" fill="none" stroke="#FFD24A" stroke-width="2.6" opacity="${f(a)}"/><path d="${FORME}" fill="none" stroke="#FFFBE8" stroke-width="1" opacity="${f(a)}"/>`;
  return s + (k === 1 ? etoile(28, 4, 2.8) + etoile(4, 27, 2.2) : '') + (k === 2 ? etoile(27, 26, 2.2) + etoile(6, 5, 1.6) : '');
}

// ——— le bloc humide (par-dessus un bloc) : des taches sombres et brillantes, des gouttes qui perlent ; une goutte
// tombe (SMIL) ———
function humide(anim = true) {
  const p = 'hu';
  let s = `<defs>${defGoutte(p)}${rad(p + 't', [[0, '#3E6A8A'], [1, '#2A4A6A']], 0.4, 0.35, 0.7)}</defs>`;
  s += [[9, 10, 4.6, 3.2], [21, 19, 5.2, 3.6], [12, 23.4, 3.2, 2.2]].map(([x, y, rx, ry]) => E(x, y, rx, ry, `url(#${p}t)`).replace('/>', ' opacity=".32"/>') + L(`M${f(x - rx * 0.6)},${f(y - ry * 0.4)} Q${x},${f(y - ry * 0.9)} ${f(x + rx * 0.5)},${f(y - ry * 0.5)}`, '#DFF6FF', 0.7, ' opacity=".6"')).join('');
  s += goutte(p, 22.4, 8, 1.5) + goutte(p, 7.6, 18, 1.2) + goutte(p, 26, 24, 1);
  const chute = `<g>${anim ? '<animateTransform attributeName="transform" type="translate" values="0 0;0 0;0 9" keyTimes="0;0.6;1" dur="1.8s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;1;0" keyTimes="0;0.8;1" dur="1.8s" repeatCount="indefinite"/>' : ''}${goutte(p, 16, 25.6, 1.4)}</g>`;
  return s + chute;
}
// la boue (un bloc, 2 coups) : neuve, après un coup ; brune et luisante, des bulles, une croûte plus claire en haut
function boue(coup) {
  const p = `bo${coup}`;
  let s = `<defs>${lin(p, [[0, '#9A7652'], [0.5, '#7A5A3A'], [1, '#4E3824']])}${rad(p + 'b', [[0, '#C8A078'], [0.6, '#8A6A48'], [1, '#5A4430']], 0.35, 0.3, 0.8)}<clipPath id="${p}c"><path d="${FORME}"/></clipPath></defs><path d="${FORME}" fill="url(#${p})"/>`;
  s += `<g clip-path="url(#${p}c)">` + P('M2,10 Q8,13.4 13,10.4 Q18,7.4 23,11 Q27,13.4 30,10.6 L30,2 L2,2 Z', '#B8916A', 0).replace('/>', ' opacity=".75"/>') + L('M2,10 Q8,13.4 13,10.4 Q18,7.4 23,11 Q27,13.4 30,10.6', '#E8C89A', 0.8, ' opacity=".7"');
  s += [[9, 18, 2.4], [21, 21.6, 3], [14, 25.6, 1.8], [24.4, 14.6, 1.6]].map(([x, y, r]) => E(x, y, r, r * 0.75, `url(#${p}b)`, 0.6) + E(x - r * 0.35, y - r * 0.35, r * 0.35, r * 0.22, '#F2DCB8')).join('');
  s += L('M5,22 Q8,20.6 10,22.4 M18,27 Q20,25.6 22,27', '#3A2818', 0.6, ' opacity=".6"') + '</g>';
  s += L('M6,5 L14,5', '#F2DCB8', 1.1, ' opacity=".7"') + `<path d="${FORME}" fill="none"${st(1.1)}/>`;
  if (coup) s += L('M10,12.6 Q16,16.6 22,12.6 M16,15.4 L15.4,19 L16.6,22.4', '#2A1A0E', 1.2) + L('M10.6,13.6 Q16,17 21.4,13.6', '#C8A078', 0.4, ' opacity=".6"');
  return s;
}
// l'eau qui gicle d'une poche crevée (48 × 48, 4 images) : une bulle qui éclate, puis des gouttes vers les quatre voisins
function inonde(k) {
  const t = (k + 1) / 4, p = `in${k}`;
  let s = `<defs>${defGoutte(p)}${rad(p + 'r', [[0, '#DFF6FF'], [0.7, '#7EC8F0'], [1, '#3E8AC0']], 0.5, 0.5, 0.5)}</defs>`;
  if (k < 2) s += `<circle cx="16" cy="16" r="${f(5 + t * 10)}" fill="url(#${p}r)" opacity="${f(0.6 - t * 0.35)}"/><circle cx="16" cy="16" r="${f(5 + t * 10)}" fill="none" stroke="${WHITE}" stroke-width="1" opacity="${f(0.8 - t * 0.4)}"/>`;
  for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) for (let j = 0; j < 2; j++) { const d = 4 + t * 11 + j * 3; s += `<g opacity="${f(1 - t * 0.55)}">${goutte(p, 16 + dx * d + dy * (j ? 2 : -2), 16 + dy * d + dx * (j ? 2 : -2), f(1.9 - j * 0.5))}</g>`; }
  return s;
}
// ——— l'éboulement : un bloc de la colonne qui tremble puis s'effondre (4 images, 48 × 48) ———
function eboule(k) {
  if (k === 0) return `<g transform="translate(-1.2 0) rotate(-3 16 16)">${FI.bloc(1, 0, 'eb0')}</g>` + L('M-2,8 l-3,-1 M-2,20 l-3,1 M34,10 l3,-1 M34,22 l3,1', OUT, 1.1) + [[6, -2], [24, -4]].map(([x, y]) => E(x, y, 1, 0.8, '#C8B48E', 0.4)).join('');
  if (k === 1) return `<g transform="translate(1.2 1) rotate(3 16 16)">${FI.bloc(1, 2, 'eb1')}</g>` + [[10, -3], [20, -5], [28, -1]].map(([x, y]) => E(x, y, 1.2, 0.9, '#C8B48E', 0.4)).join('');
  const t = (k - 1) / 2, p = `eb${k}`, R = FI.ROCHE[1];
  let s = `<defs>${lin(p, [[0, R.clair], [0.55, R.corps], [1, R.ombre]], 0.4, 1)}${rad(p + 'p', [[0, '#F2E6CE'], [1, '#E2D2B4']], 0.5, 0.5, 0.5)}</defs>`;
  for (let i = 0; i < 4; i++) s += E(4 + i * 8, 34 - t * 4, 5.4 + t * 2, 3.2, `url(#${p}p)`).replace('/>', ` opacity="${f(0.7 * (1 - t * 0.6))}"/>`);
  [[8, 10, -1, 1], [22, 9, 1, 0.9], [10, 22, -0.6, 1.1], [22, 22, 0.8, 0.8], [16, 16, 0, 1.2]].forEach(([x, y, dx, sc], i) => { s += `<g transform="translate(${f(x + dx * t * 6)} ${f(y + t * 9 + i)}) rotate(${f(i * 40 + t * 90)}) scale(${sc})" opacity="${f(1 - t * 0.45)}">${P('M-4,-3 Q-1,-4.4 3,-3.6 L4.4,2 Q1,4.4 -2,3.6 Z', `url(#${p})`, 0.8)}${L('M-3,-2.4 L1.6,-3', R.clair, 0.8, ' opacity=".9"')}${E(1, 1, 0.6, 0.4, R.grain)}</g>`; });
  return s;
}
// la pierre perdue dans l'éboulement (4 images, 32 × 32) : elle se ternit sous la poussière, se fend et tombe
function perdue(g, k) {
  const p = `pp${g}${k}`;
  let s = `<defs>${rad(p + 'p', [[0, '#C8BEAA'], [1, '#8E8476']], 0.5, 0.4, 0.6)}</defs><g transform="translate(0 ${k * 3}) rotate(${k * 8} 16 16)" opacity="${f(1 - k * 0.22)}">${FI.gemme(g, p)}`;
  if (k >= 1) s += `<g opacity="${f(0.22 * k)}">${FI.gemme(g, p + 'x').replace(/fill="url\(#[^)]+\)"/g, `fill="url(#${p}p)"`).replace(/<defs>.*?<\/defs>/, '')}</g>`;
  if (k >= 2) s += L('M14,8 L17,14 L14.6,19 L17.4,25', OUT, 1.1) + L('M14.6,8.4 L17.4,14', WHITE, 0.4, ' opacity=".6"');
  s += '</g>';
  if (k >= 1) s += [[8, 24 + k * 2], [24, 22 + k * 2]].map(([x, y]) => E(x, y, 2 + k, 1.2, '#D8CCB4').replace('/>', ` opacity="${f(0.6 - k * 0.12)}"/>`)).join('');
  return s;
}
// ——— l'album des trouvailles : la page (112 × 80, 6 cases) ; une case vide (la silhouette), remplie, nouvelle ———
// une seule grande page de parchemin, reliée de cuir à gauche par trois anneaux, des coins dorés, un signet rouge
function page() {
  let s = `<defs>${lin('alC', [[0, '#8A4A2A'], [1, '#5E2E1A']])}${rad('alP', [[0, '#FFF8E6'], [0.7, '#F4E8C8'], [1, '#E2D0A4']], 0.5, 0.45, 0.75)}${lin('alS', [[0, '#F27A6A'], [1, '#B8302E']])}${lin('alA', [[0, '#F2D07A'], [0.5, '#C89A3A'], [1, '#8A6020']], 1, 0)}</defs>`;
  s += P('M1,3 Q56,-1 111,3 L111,78 Q56,82 1,78 Z', 'url(#alC)', 1.2);
  s += P('M6,5 Q57,2.6 108,5 L108,76 Q57,78.4 6,76 Z', 'url(#alP)', 0.8);
  s += L('M10,8 L10,73', '#E2D0A4', 0.6, ' stroke-dasharray="1.6 1.6"');
  s += [18, 40, 62].map(y => `${E(5, y, 3.4, 2.2, 'url(#alA)', 0.8)}${L(`M3,${y - 0.8} L6.4,${y - 1}`, '#FFF2B8', 0.6)}`).join('');
  s += [[108, 5, -1, 1], [108, 76, -1, -1]].map(([x, y, sx, sy]) => `<g transform="translate(${x} ${y}) scale(${sx} ${sy})">${P('M0,0 L7,0 L0,7 Z', 'url(#alA)', 0.6)}${L('M1,1 L4.4,1', '#FFF2B8', 0.6)}</g>`).join('');
  s += P('M90,0 L98,0 L98,14 L94,11 L90,14 Z', 'url(#alS)', 0.8) + L('M91.4,1 L91.4,11', WHITE, 0.6, ' opacity=".5"');
  return s;
}
const CASES = [[8, 8], [36, 8], [64, 8], [8, 42], [36, 42], [64, 42]].map(([x, y]) => [x + 4, y + 2]);
// une case de l'album : vide, la trouvaille en silhouette pâle dans un cadre pointillé ; remplie, sur un carton crème
// tenu par quatre coins collés ; nouvelle, un liseré doré et des étoiles
function caseAlbum(k, etat) {
  const p = `ca${k}${etat}`;
  let s = `<defs>${lin(p, [[0, '#FFFBEE'], [1, '#F2E4C0']])}</defs>`;
  if (etat === 'vide') {
    s += `<rect x="3" y="3" width="26" height="26" rx="2" fill="#EADCB8" stroke="#B89E70" stroke-width="0.8" stroke-dasharray="2 1.4"/>`;
    s += `<g opacity=".25" transform="translate(16 16) scale(0.72) translate(-16 -16)">${FP.trouvaille(k).replace(/fill="(#[0-9A-Fa-f]{6}|url\([^)]+\))"/g, 'fill="#5A4A38"').replace(/stroke="#[0-9A-Fa-f]{6}"/g, 'stroke="#5A4A38"')}</g>`;
    return s;
  }
  s += `<rect x="3.6" y="4.2" width="26" height="26" rx="2" fill="#5A4030" opacity=".25"/><rect x="3" y="3" width="26" height="26" rx="2" fill="url(#${p})"${st(0.8)}/>`;
  s += `<g transform="translate(16 16) scale(0.78) translate(-16 -16)">${FP.trouvaille(k)}</g>`;
  s += [[3, 3, 0], [29, 3, 90], [29, 29, 180], [3, 29, 270]].map(([x, y, r]) => `<g transform="translate(${x} ${y}) rotate(${r})">${P('M-0.4,-0.4 L4,-0.4 L-0.4,4 Z', '#E2CCA0', 0.4)}</g>`).join('');
  if (etat === 'nouvelle') s += `<rect x="2.4" y="2.4" width="27.2" height="27.2" rx="2.4" fill="none" stroke="#FFD24A" stroke-width="1.8"/><rect x="2.4" y="2.4" width="27.2" height="27.2" rx="2.4" fill="none" stroke="#FFFBE8" stroke-width="0.6"/>` + etoile(28.6, 3.4, 3.2) + etoile(4.6, 27.6, 2.2);
  return s;
}
// ——— le choix de l'outil : le médaillon (32 × 32) d'une pioche, choisi ou non ; le changement (4 images) ———
// un disque de bois cerclé de laiton (choisi : cerclé d'or, fond crème lumineux) ; non choisi, il s'assombrit
function medaillon(m, choisi) {
  const p = `md${m}${choisi ? 'c' : ''}`;
  let s = `<defs>${lin(p + 'r', choisi ? [[0, '#FFF2B8'], [0.5, '#FFD24A'], [1, '#C8901E']] : [[0, '#E2C890'], [0.5, '#B89A5A'], [1, '#7A6038']])}${rad(p + 'f', choisi ? [[0, '#FFFDF2'], [0.7, '#FFF2C4'], [1, '#F2D88A']] : [[0, '#D8C8A4'], [1, '#A8946E']], 0.4, 0.35, 0.75)}</defs>`;
  s += E(16, 16.8, 14, 14, '#3C2819').replace('/>', ' opacity=".2"/>') + E(16, 16, 14, 14, `url(#${p}r)`, 1.1) + E(16, 16, 11.2, 11.2, `url(#${p}f)`, 0.8);
  s += [0, 1, 2, 3, 4, 5, 6, 7].map(i => { const a = i * Math.PI / 4 + Math.PI / 8; return E(16 + Math.cos(a) * 12.6, 16 + Math.sin(a) * 12.6, 0.7, 0.7, choisi ? '#FFFBE0' : '#E8D8A8', 0.3); }).join('');
  s += `<g transform="translate(16 16) scale(0.74) translate(-15.7 -21.15)">${FP.pioche(m, 0)}</g>`;
  s += L('M7.6,10 Q9.6,6.6 13.4,5.4', WHITE, 1.2, ' opacity=".6"');
  if (choisi) s += etoile(26.4, 5.6, 2.6) + etoile(5.6, 25.6, 1.8);
  else s += E(16, 16, 14, 14, '#3C2819').replace('/>', ' opacity=".15"/>');
  return s;
}
function change(m, k) {
  const sc = [0.4, 1.2, 0.95, 1][k];
  let s = `<g transform="translate(16 16) scale(${sc}) rotate(${[-90, 15, -6, 0][k]}) translate(-16 -16)">${medaillon(m, true)}</g>`;
  if (k === 1) s += [0, 1, 2, 3, 4, 5, 6, 7].map(i => { const a = i * 0.785; return L(`M${f(16 + Math.cos(a) * 17.6)},${f(16 + Math.sin(a) * 17.6)} L${f(16 + Math.cos(a) * 21.6)},${f(16 + Math.sin(a) * 21.6)}`, '#FFE07A', 1.8); }).join('') + etoile(-4, 2, 2.4) + etoile(36, 30, 2);
  if (k === 2) s += etoile(30, 0, 2.2) + etoile(0, 32, 1.8);
  return s;
}
// ——— la rangée qui apparaît en bas : un bloc qui monte (4 images, 32 × 32), la poussière qui s'en échappe ———
function monte(h, k) {
  const dy = [24, 12, -2, 0][k], p = `mo${h}${k}`;
  let s = `<defs><clipPath id="${p}c"><rect x="-4" y="-4" width="40" height="36"/></clipPath>${rad(p + 'p', [[0, '#F2E6CE'], [1, '#D8C8A8']], 0.5, 0.5, 0.5)}</defs><g clip-path="url(#${p}c)"><g transform="translate(0 ${dy})">${FI.bloc(h, 0, p + 'b')}</g></g>`;
  if (k < 3) s += [6, 16, 26].map(x => E(x, 31, 3.4 + k, 1.8, `url(#${p}p)`).replace('/>', ` opacity="${f(0.8 - k * 0.22)}"/>`)).join('') + [[4, 27 - k * 3], [28, 26 - k * 3]].map(([x, y]) => E(x, y, 0.9, 0.7, '#C8B48E', 0.3)).join('');
  if (k === 2) s += etoile(28, 4, 1.8);
  return s;
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
