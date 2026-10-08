// Mini-jeux — l'Arrimage, compléments (design/conception/minijeux_grille.md, § 6) : la vague de la saison 3 et son
// alerte, les cases « suivante » et « mise de côté », le bilan (le bateau d'Aster chargé, qui tangue). Mêmes règles que
// l'Arrimage : boucles en SMIL, coups en suites d'images, fichiers × 4. Chaque pièce porte ses propres dégradés (ids
// préfixés), pour rester juste quand le jeu en pose plusieurs dans la même page.
const OUT = '#3C2819', WHITE = '#FFFFFF';
const f = n => Math.round(n * 100) / 100;
const st = w => ` stroke="${OUT}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
const P = (d, fill, w = 1) => `<path d="${d}" fill="${fill}"${w ? st(w) : ''}/>`;
const E = (x, y, rx, ry, fill, w = 0) => `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(rx)}" ry="${f(ry)}" fill="${fill}"${w ? st(w) : ''}/>`;
const L = (d, c, w, extra = '') => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"${extra}/>`;
const lin = (id, stops, x2 = 0, y2 = 1) => `<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}">${stops.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join('')}</linearGradient>`;
const rad = (id, stops, cx = 0.4, cy = 0.35, r = 0.75) => `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}">${stops.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join('')}</radialGradient>`;
const etoile = (x, y, r, fill = '#FFFBE8') => `<path d="M${f(x)},${f(y - r)} Q${f(x + r * 0.16)},${f(y - r * 0.16)} ${f(x + r)},${f(y)} Q${f(x + r * 0.16)},${f(y + r * 0.16)} ${f(x)},${f(y + r)} Q${f(x - r * 0.16)},${f(y + r * 0.16)} ${f(x - r)},${f(y)} Q${f(x - r * 0.16)},${f(y - r * 0.16)} ${f(x)},${f(y - r)} Z" fill="${fill}"/>`;
const brille = (x, y, r, dur, begin) => `<g opacity="0" transform="translate(${f(x)} ${f(y)})">${etoile(0, 0, r)}<animate attributeName="opacity" values="0;1;0;0" keyTimes="0;0.15;0.3;1" dur="${dur}s" begin="${begin}s" repeatCount="indefinite"/></g>`;
const goutte = (x, y, r, c = '#9ED8F6') => P(`M${f(x)},${f(y - r * 1.7)} Q${f(x + r * 1.1)},${f(y - r * 0.2)} ${f(x + r)},${f(y + r * 0.3)} Q${f(x + r)},${f(y + r)} ${f(x)},${f(y + r)} Q${f(x - r)},${f(y + r)} ${f(x - r)},${f(y + r * 0.3)} Q${f(x - r * 1.1)},${f(y - r * 0.2)} ${f(x)},${f(y - r * 1.7)} Z`, c, 0.5) + E(x - r * 0.35, y - r * 0.1, r * 0.25, r * 0.35, WHITE);

// ——— la vague (saison 3) : elle traverse la bande de la rangée du haut (cadre 128 × 48, 4 images) ———
// 1 elle se lève à gauche, 2 elle s'enroule, 3 elle s'écrase en gerbe, 4 l'écume retombe en gouttes
const CORPS = 'M-96,50 L-96,40 Q-70,39 -46,35 Q-26,30 -12,20 Q-2,10 8,5 Q20,0 29,6 Q36,12 32,20 Q28,26 21,24 Q15,22 17,16 Q19,12 23,13 Q19,8 13,11 Q6,15 6,26 Q8,40 26,50 Z';
function vague(k) {
  const id = `vg${k}`;
  let s = `<defs>${lin(id, [[0, '#5EC2EC'], [0.55, '#2E8AC4'], [1, '#1E5E96']])}${lin(id + 'c', [[0, '#C8F0FF'], [1, '#6AC4EC']])}</defs>`;
  if (k < 3) {
    const x = [10, 50, 90][k], sc = [0.8, 1, 1.04][k];
    s += `<g transform="translate(${x} 3) scale(${sc} 1)">`;
    s += P(CORPS, `url(#${id})`, 1.2);
    // le creux de l'enroulement, plus clair, et sa spirale
    s += P('M8,10 Q18,4 26,9 Q30,14 26,19 Q22,22 19,19 Q17,15 21,14 Q18,10 12,13 Q8,17 9,26 Q6,18 8,10 Z', `url(#${id}c)`, 0);
    // l'écume : une frange épaisse et ses bulles
    s += L('M-96,40 Q-70,39 -46,35 Q-26,30 -12,20 Q-2,10 8,5 Q20,0 29,6 Q35,11 32,18', WHITE, 3.2) + L('M-40,33 Q-24,29 -12,20 Q-2,10 8,5', '#DFF6FF', 1.2, ' opacity=".9"');
    s += [[-34, 30, 2.4], [-24, 26, 2], [-14, 19, 2.6], [-5, 12, 2], [4, 7, 1.6], [30, 10, 1.6]].map(([a, b, r]) => E(a, b, r, r * 0.85, WHITE, 0.6) + E(a - r * 0.3, b - r * 0.3, r * 0.3, r * 0.25, '#DFF6FF')).join('');
    // les reflets dans le corps
    s += L('M-30,42 Q-16,36 -8,28', '#9EDCF8', 1.6, ' opacity=".8"') + L('M-20,46 Q-6,40 0,32', '#9EDCF8', 1.1, ' opacity=".6"');
    s += '</g>';
    if (k === 2) s += [0, 1, 2, 3, 4, 5, 6, 7].map(i => { const a = -Math.PI * (0.1 + i * 0.11); return goutte(x + 26 + Math.cos(a) * 15, 21 + Math.sin(a) * 13, 2.2 - (i % 3) * 0.3, i % 2 ? '#C8F0FF' : '#9ED8F6'); }).join('') + etoile(x + 30, 4, 3);
    if (k === 1) s += etoile(x + 30, 6, 2.4);
  } else {
    s += [[18, 28, 2.2], [40, 20, 1.8], [62, 32, 2.4], [86, 22, 2], [108, 30, 2.2]].map(([a, b, r], i) => goutte(a, b, r, i % 2 ? '#C8F0FF' : '#9ED8F6')).join('');
    s += `<path d="M0,44 Q8,40 16,44 T32,44 T48,44 T64,44 T80,44 T96,44 T112,44 T128,44 L128,48 L0,48 Z" fill="#DFF6FF" opacity=".75"/>` + L('M0,44 Q8,40 16,44 T32,44 T48,44 T64,44 T80,44 T96,44 T112,44 T128,44', WHITE, 1.4);
    s += [[26, 40], [70, 41], [104, 40]].map(([a, b]) => E(a, b, 1.6, 1.4, WHITE, 0.5)).join('') + etoile(52, 12, 2.4) + etoile(98, 10, 1.8);
  }
  return s;
}
// l'alerte de la vague (32 × 32, SMIL : elle bat, un anneau s'élargit) : un médaillon de bois cerclé de rouge, une petite
// vague ronde au centre
function alerte(anim = true) {
  let s = `<defs>${rad('alr', [[0, '#FF8A7A'], [0.6, '#E8504A'], [1, '#B8302E']])}${lin('alb', [[0, '#E2B47A'], [1, '#9A6440']])}${lin('alw', [[0, '#5EC2EC'], [1, '#2E7AB4']])}</defs>`;
  if (anim) s += `<circle cx="16" cy="16" r="13" fill="none" stroke="#FF8A7A" stroke-width="1.6" opacity="0"><animate attributeName="r" values="13;16" dur="1s" repeatCount="indefinite"/><animate attributeName="opacity" values=".9;0" dur="1s" repeatCount="indefinite"/></circle>`;
  let m = E(16, 16, 14, 14, 'url(#alb)', 1.2) + E(16, 16, 11.4, 11.4, 'url(#alr)', 0.9) + E(16, 16, 8.6, 8.6, '#FFF4EC', 0.7);
  // une petite vague ronde, découpée dans le disque blanc
  m += `<defs><clipPath id="alc"><circle cx="16" cy="16" r="8.2"/></clipPath></defs><g clip-path="url(#alc)">${P('M6,26 L6,19 Q9,18 11,15 Q13,11 17,10.6 Q21,10.6 22,14 Q22.6,17 20,17.6 Q18,17.8 17.8,16 Q17.8,14.6 19.2,14.6 Q17.4,12.8 15.4,14.4 Q13.6,16.4 15,20 Q17,22.6 24,23 L26,26 Z', 'url(#alw)', 0.8)}${L('M7,19 Q9,18 11,15 Q13,11 17,10.6 Q21,10.6 22,14', WHITE, 1.3)}${E(9.6, 17.4, 0.9, 0.8, WHITE)}${E(12.6, 13.4, 0.8, 0.7, WHITE)}</g>`;
  m += L('M8.4,10.6 Q10.6,7.6 14,6.6', WHITE, 1.4, ' opacity=".75"') + [[7, 16], [25, 16], [16, 7.2], [16, 24.8]].map(([x, y]) => E(x, y, 0.7, 0.7, '#F6D4A0', 0.3)).join('');
  return s + `<g transform-origin="16 16">${anim ? '<animateTransform attributeName="transform" type="scale" values="1;1.08;1" dur="0.5s" repeatCount="indefinite"/>' : ''}${m}</g>`;
}

// ——— les cases du bord (cadre 48 × 48 ; le jeu pose la marchandise au centre, réduite à 40 %) ———
// la suivante : un hublot de laiton sur une planche, la mer derrière la vitre
function suivante() {
  let s = `<defs>${lin('suP', [[0, '#C8925A'], [1, '#8A5A32']])}${rad('suL', [[0, '#FFF0B8'], [0.5, '#E2B44E'], [1, '#9A6A20']], 0.35, 0.3, 0.8)}${lin('suM', [[0, '#3E7FA8'], [0.6, '#24506E'], [1, '#183A52']])}</defs>`;
  s += P('M6,2 L42,2 Q46,2 46,6 L46,42 Q46,46 42,46 L6,46 Q2,46 2,42 L2,6 Q2,2 6,2 Z', 'url(#suP)', 1.2);
  s += [12, 24, 36].map(y => L(`M3,${y} L45,${y}`, '#7A4E2A', 0.6, ' opacity=".6"')).join('') + L('M6,4.6 L42,4.6', '#F2D0A0', 1, ' opacity=".7"');
  s += E(24, 24.8, 20.6, 20.6, '#5E3A22').replace('/>', ' opacity=".35"/>');
  s += E(24, 24, 20, 20, 'url(#suL)', 1.2) + E(24, 24, 15.6, 15.6, '#8A5A1A', 0.8) + E(24, 24, 14.6, 14.6, 'url(#suM)', 0.6);
  s += [0, 1, 2, 3, 4, 5, 6, 7].map(i => { const a = i * Math.PI / 4 + Math.PI / 8, x = 24 + Math.cos(a) * 17.8, y = 24 + Math.sin(a) * 17.8; return E(x, y, 1.3, 1.3, '#C89A3A', 0.5) + E(x - 0.4, y - 0.4, 0.45, 0.45, '#FFF6D0'); }).join('');
  // la vitre : une vaguelette au fond, deux reflets en biais
  s += `<path d="M10,32 Q14,30 18,32 T26,32 T34,32 T42,32 L42,38 Q24,42 10,38 Z" fill="#3E8AB8" opacity=".55"/>`;
  s += L('M13,18 L21,10', WHITE, 2.2, ' opacity=".35"') + L('M16,21 L25,12', WHITE, 1, ' opacity=".3"') + L('M9.6,24 Q10,16 16,11.4', '#FFF6D0', 1.2, ' opacity=".55"');
  return s;
}
// la mise de côté : une caisse ouverte, ferrée aux coins, une corde lovée sur le bord
function miseDeCote(bloquee = false) {
  const p = bloquee ? 'mb' : 'mc';
  let s = `<defs>${lin(p + 'B', [[0, '#E2B47A'], [0.5, '#C08A5A'], [1, '#8A5A32']])}${lin(p + 'I', [[0, '#3A2414'], [1, '#6A4628']])}${lin(p + 'F', [[0, '#D8DEE6'], [1, '#8A949E']])}${lin(p + 'C', [[0, '#F2E2B8'], [1, '#C8AE78']])}</defs>`;
  s += E(24, 45.4, 20, 2, 'rgba(60,40,20,.2)');
  s += P('M4,8 Q4,5 7,5 L41,5 Q44,5 44,8 L44,42 Q44,45 41,45 L7,45 Q4,45 4,42 Z', `url(#${p}B)`, 1.2);
  s += P('M9,10 L39,10 L39,40 L9,40 Z', `url(#${p}I)`, 0.9) + P('M9,10 L39,10 L36,14 L12,14 Z', '#2A180C', 0).replace('/>', ' opacity=".5"/>');
  s += [17, 27].map(y => L(`M4.6,${y} L8.6,${y} M39.4,${y} L43.4,${y}`, '#8A5A32', 0.8)).join('') + [[6, 24], [42, 24]].map(([x, y]) => L(`M${x},${y - 4} Q${x + 0.6},${y} ${x},${y + 4}`, '#A8784A', 0.5, ' opacity=".7"')).join('');
  s += L('M7,6.6 L41,6.6', '#F6D8A8', 1.1, ' opacity=".8"');
  // les coins ferrés et leurs rivets
  for (const [x, y, sx, sy] of [[4, 5, 1, 1], [44, 5, -1, 1], [4, 45, 1, -1], [44, 45, -1, -1]]) s += `<g transform="translate(${x} ${y}) scale(${sx} ${sy})">${P('M0,3 Q0,0 3,0 L9,0 L9,2.6 L2.6,2.6 L2.6,9 L0,9 Z', `url(#${p}F)`, 0.7)}${E(1.4, 1.4, 0.6, 0.6, '#FFFFFF')}${E(6.6, 1.3, 0.45, 0.45, '#5A626C')}${E(1.3, 6.6, 0.45, 0.45, '#5A626C')}</g>`;
  // la corde lovée, posée sur le coin du haut à droite
  s += `<g transform="translate(36 8)">${E(0, 0, 7, 3.6, `url(#${p}C)`, 0.9)}${E(0, -0.2, 4.6, 2.2, 'none').replace('fill="none"', 'fill="none" stroke="#A88A5A" stroke-width="0.8"')}${E(0, -0.3, 2.2, 1, '#8A6A3A')}${L('M-5,-1.6 Q-2,-3.2 2,-3', WHITE, 0.8, ' opacity=".7"')}${L('M6,1 Q9,4 7,8', `url(#${p}C)`, 1.6)}</g>`;
  if (bloquee) {
    s += P('M9,10 L39,10 L39,40 L9,40 Z', '#1E140C', 0).replace('/>', ' opacity=".55"/>');
    s += `<defs>${lin('mbL', [[0, '#FFE8A0'], [0.5, '#E2B44E'], [1, '#A0741E']])}</defs><g transform="translate(24 26)">${L('M-4.4,-1 L-4.4,-5 Q-4.4,-9.6 0,-9.6 Q4.4,-9.6 4.4,-5 L4.4,-1', '#A8B0BA', 2.4)}${L('M-4.4,-1 L-4.4,-5 Q-4.4,-9.6 0,-9.6 Q4.4,-9.6 4.4,-5 L4.4,-1', OUT, 0.6, ' opacity=".5"')}${P('M-7,-2 Q-7,-3.4 -5.6,-3.4 L5.6,-3.4 Q7,-3.4 7,-2 L7,6 Q7,8 5,8 L-5,8 Q-7,8 -7,6 Z', 'url(#mbL)', 1)}${E(0, 1.6, 1.4, 1.6, OUT)}${P('M-0.6,2.4 L0.6,2.4 L0.9,5 L-0.9,5 Z', OUT, 0)}${L('M-5.4,-1.6 L-2,-1.6', WHITE, 1, ' opacity=".7"')}</g>`;
  }
  return s;
}

// ——— le bilan : le bateau d'Aster, chargé de 0 à 4 rangs, qui tangue sur l'eau (SMIL ; cadre 112 × 88) ———
// la cargaison en petites pièces chibi : caisse, tonneau, sac, pierre de lest
function caisse(x, y, s = 1) { return `<g transform="translate(${x} ${y}) scale(${s})">${P('M-6,-6 Q-6,-7 -5,-7 L5,-7 Q6,-7 6,-6 L6,5 Q6,6 5,6 L-5,6 Q-6,6 -6,5 Z', 'url(#bcC)', 0.8)}${L('M-6,-2.4 L6,-2.4 M-6,1.8 L6,1.8', '#8A5A32', 0.5)}${L('M-5,-6 L5,5', '#8A5A32', 0.9, ' opacity=".55"')}${L('M-5,-6 L5,-6', '#F6D8A8', 0.8)}</g>`; }
function tonneau(x, y, s = 1) { return `<g transform="translate(${x} ${y}) scale(${s})">${P('M-5,-7 Q-6.6,-0.5 -5,6 L5,6 Q6.6,-0.5 5,-7 Z', 'url(#bcT)', 0.8)}${L('M-5.6,-4 L5.6,-4 M-5.6,3 L5.6,3', '#A8B0BA', 1.3)}${L('M-1.6,-6.6 L-1.6,5.6 M1.8,-6.6 L1.8,5.6', '#5E3A22', 0.4, ' opacity=".7"')}${E(-3, -1, 0.7, 2, WHITE).replace('/>', ' opacity=".35"/>')}</g>`; }
function sac(x, y, s = 1) { return `<g transform="translate(${x} ${y}) scale(${s})">${P('M-6,5 Q-7.4,-2 -3,-5 L-1.6,-7.4 L1.6,-7.4 L3,-5 Q7.4,-2 6,5 Q0,7.4 -6,5 Z', 'url(#bcS)', 0.8)}${L('M-3,-5 Q0,-4 3,-5', '#B07A4A', 1)}${L('M-3.6,0 l1,1 M2,2 l1,1 M-1,3.6 l1,-1', '#B89E68', 0.5)}${E(-3, -1.4, 1.4, 0.9, WHITE).replace('/>', ' opacity=".4"/>')}</g>`; }
function lest(x, y, s = 1) { return `<g transform="translate(${x} ${y}) scale(${s})">${P('M-6,5 Q-7,-2 -3,-5 Q2,-7 5.6,-3.4 Q7.4,1 5.4,5 Q0,6.6 -6,5 Z', 'url(#bcL)', 0.8)}${L('M-3.6,-3 Q-1,-4.6 2,-4', '#E2DED6', 1, ' opacity=".9"')}${E(2, 2, 1.2, 0.8, '#7E786E')}</g>`; }
const FAIT = { caisse, tonneau, sac, lest };
// les rangs : posés sur le pont (y 52), chaque rang monte d'un cran ; rien ne cache la voile
// à gauche du mât une pyramide, à l'avant (après la voile) une colonne
const RANGS = [
  [['caisse', 20, 52], ['sac', 32, 52], ['tonneau', 44, 52], ['caisse', 93, 52]],
  [['lest', 26, 40.6], ['caisse', 38, 40.6]],
  [['tonneau', 93, 40.6], ['sac', 32, 29.4]],
  [['sac', 93, 29.4]]
];
function bateau(n, anim = true) {
  let d = `<defs>${lin('bcC', [[0, '#E8BC84'], [1, '#B07A4A']])}${lin('bcT', [[0, '#C08A5E'], [1, '#7A4A2A']], 1, 0)}${lin('bcS', [[0, '#F6E8C0'], [1, '#D4BC84']])}${lin('bcL', [[0, '#CFCAC0'], [1, '#8E887E']])}`;
  d += `${lin('bmer', [[0, '#8FD8F4'], [1, '#3E9AD0']])}${lin('bcoq', [[0, '#C8885A'], [0.5, '#9A6440'], [1, '#6A3E22']])}${lin('bvoi', [[0, '#FFFBEE'], [0.7, '#F2E6C8'], [1, '#DCCCA4']], 1, 0)}${lin('bmat', [[0, '#C8925A'], [1, '#7A4A2A']], 1, 0)}</defs>`;
  let b = '';
  // les haubans, derrière
  b += L('M55,10 L14,56 M55,10 L98,56', '#6A4A2A', 0.6, ' opacity=".8"');
  // le mât, la hune, la flamme qui flotte
  b += `<rect x="53.6" y="8" width="3.2" height="50" rx="1.4" fill="url(#bmat)"${st(0.8)}/>` + P('M50,16 L60,16 L59,19 L51,19 Z', '#8A5A32', 0.8);
  b += `<g>${anim ? '<animateTransform attributeName="transform" type="skewY" values="0;-8;0" dur="1.2s" repeatCount="indefinite"/>' : ''}${P('M56,4 L70,6.6 L56,9.4 Z', '#6EC8D8', 0.7)}${L('M57,5.4 L64,6.6', WHITE, 0.6, ' opacity=".7"')}</g>`.replace('<g>', '<g transform-origin="56 7">');
  b += E(55.2, 7, 1.6, 1.6, '#E2B44E', 0.6);
  // la voile gonflée, ses coutures, le tourbillon d'Aster (l'Air)
  b += P('M58,12 Q84,20 82,48 L58,48 Z', 'url(#bvoi)', 1.1) + L('M58,22 Q70,25 80,26 M58,34 Q70,36 81,37', '#D4C49A', 0.6) + L('M66,13.6 Q72,30 70,48', '#D4C49A', 0.6);
  b += `<g transform="translate(70 31)">${L('M-4,1 Q-4,-4 1,-4 Q5,-4 5,0 Q5,3 2,3 Q-0.6,3 -0.4,0.6 Q-0.2,-1 1.4,-1', '#4FB0C8', 1.6)}${L('M-7,4.4 L-3,4.4 M-6,6.6 L-1,6.6', '#7EC8D8', 0.9)}</g>`;
  b += L('M60,14 Q76,20 78,30', WHITE, 1, ' opacity=".6"');
  // la cargaison, rang par rang ; un filet de corde par-dessus dès qu'il y a 2 rangs
  for (const r of RANGS.slice(0, n)) for (const [k, x, y] of r) b += FAIT[k](x, y, 1);
  if (n >= 2) b += L(n >= 3 ? 'M13,50 Q32,16 51,50' : 'M13,50 Q32,28 51,50', '#E8D8B0', 0.8, ' opacity=".9" stroke-dasharray="1.4 1"');
  // la coque : ronde et dodue, ses bordages, le liston bleu d'Aster, les hublots
  b += P('M6,56 Q8,54 12,54 L100,54 Q104,54 106,56 Q104,70 90,74 Q56,79 22,74 Q8,70 6,56 Z', 'url(#bcoq)', 1.3);
  b += L('M10,63 Q56,68 102,63', '#6A3E22', 0.7, ' opacity=".7"') + L('M14,69 Q56,74 98,69', '#6A3E22', 0.6, ' opacity=".6"');
  b += P('M6,56 Q8,54 12,54 L100,54 Q104,54 106,56 L105,59 L7,59 Z', '#4FB0C8', 0.9) + L('M12,55.4 L100,55.4', '#B8F0F8', 0.9, ' opacity=".8"');
  b += [30, 46, 66, 82].map(x => E(x, 64.4, 2.4, 2.4, '#E2B44E', 0.7) + E(x, 64.4, 1.5, 1.5, '#24506E') + E(x - 0.5, 63.9, 0.5, 0.5, WHITE)).join('');
  // la proue : une petite volute dorée
  b += L('M104,56 Q110,52 108,48 Q106,46 104,48', '#E2B44E', 1.6) + L('M104,56 Q110,52 108,48 Q106,46 104,48', OUT, 0.5, ' opacity=".5"');
  if (n === 4) b += anim ? brille(16, 40, 3, 2.2, 0) + brille(96, 30, 2.6, 2.2, 0.7) + brille(44, 22, 2.2, 2.2, 1.3) : etoile(16, 40, 3) + etoile(96, 30, 2.6) + etoile(44, 22, 2.2);
  const tangage = anim ? '<animateTransform attributeName="transform" type="rotate" values="-2 56 66;2 56 66;-2 56 66" dur="2.8s" repeatCount="indefinite"/>' : '';
  // la mer : son dégradé, le reflet de la coque, une crête d'écume qui défile, des éclats
  const mer = `<path d="M0,70 Q8,67 16,70 T32,70 T48,70 T64,70 T80,70 T96,70 T112,70 L112,88 L0,88 Z" fill="url(#bmer)"/>` + E(56, 76, 40, 3, '#2E6E9A').replace('/>', ' opacity=".35"/>')
    + `<g>${anim ? '<animateTransform attributeName="transform" type="translate" values="0 0;-16 0" dur="1.8s" repeatCount="indefinite"/>' : ''}${L('M0,70 Q8,67 16,70 T32,70 T48,70 T64,70 T80,70 T96,70 T112,70 T128,70', WHITE, 1.4)}${L('M4,80 Q10,78 16,80 M40,82 Q46,80 52,82 M76,80 Q82,78 88,80 M108,82 Q114,80 120,82', '#DFF6FF', 0.9, ' opacity=".8"')}</g>`;
  return d + E(56, 84, 44, 2.4, 'rgba(30,70,100,.18)') + `<g>${tangage}${b}</g>` + mer;
}

// ——— les pièces (dans le dossier de l'Arrimage) : { id, nom, cadre, dessin, suite, ms par image, boucle } ———
const PIECES = [];
const piece = (id, nom, cadre, dessin, suite = null, ms = null, boucle = false) => PIECES.push({ id, nom, cadre, dessin, suite, ms, boucle });
for (let k = 0; k < 4; k++) piece(`vague_${k + 1}`, 'La vague (sur la bande de la rangée du haut)', [0, 0, 128, 48], () => vague(k), 'vague', 110);
piece('alerte-vague', 'L\'alerte de la vague (elle bat, en boucle)', [0, 0, 32, 32], () => alerte());
piece('suivante', 'La case de la marchandise suivante (un hublot)', [0, 0, 48, 48], suivante);
piece('mise-de-cote', 'La case de mise de côté (une caisse ouverte)', [0, 0, 48, 48], () => miseDeCote(false));
piece('mise-de-cote_bloquee', 'La case de mise de côté, déjà utilisée pour cette marchandise', [0, 0, 48, 48], () => miseDeCote(true));
for (let n = 0; n <= 4; n++) piece(`bateau_${n}`, `Le bilan : le bateau d'Aster, ${n} rang${n > 1 ? 's' : ''} de cargaison (il tangue, en boucle)`, [0, 0, 112, 88], () => bateau(n));

const LISEZ_MOI = 'Compléments : la vague (128 × 48) se pose sur la bande de la rangée du haut, pendant que le jeu secoue la cale ; l\'alerte (32 × 32) la précède. La suivante et la mise de côté (48 × 48) : le jeu pose la marchandise au centre, réduite à 40 % (cases de 6,4 × 6,4, pour que la forme en I tienne dans le hublot). Le bilan : le bateau d\'Aster (112 × 88), chargé de 0 à 4 rangs selon le résultat, avec les étoiles du Filon.';
module.exports = { PIECES, LISEZ_MOI, vague, alerte, suivante, miseDeCote, bateau };
