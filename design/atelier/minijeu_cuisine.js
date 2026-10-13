// Mini-jeux — la marmite de Cannelle (la cuisine du jour 3) : une scène en carte, vue de face, un peu plongeante.
// Cannelle à gauche (ses dessins cannelle_face_louche_1/2), la marmite au centre sur son feu, la planche des ingrédients
// en bas (algues, seau d'eau de mer ; les coquillages viennent de plantes/coquillages_nacres.svg), puis le bol et la
// louche au service. Le jeu pose les pièces en DOM. Le bouillon (dans la marmite, la louche et le bol) porte
// class="bouillon" et fill="var(--cook-soup, …)" : le jeu change sa couleur à chaque étape (eau de mer, puis soupe
// dorée), la teinte entre parenthèses sert quand le SVG est posé tel quel. Fichiers × 4.
const OUT = '#3C2819', WHITE = '#FFFFFF';
const f = n => Math.round(n * 100) / 100;
const st = w => ` stroke="${OUT}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
const P = (d, fill, w = 1) => `<path d="${d}" fill="${fill}"${w ? st(w) : ''}/>`;
const E = (x, y, rx, ry, fill, w = 0) => `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(rx)}" ry="${f(ry)}" fill="${fill}"${w ? st(w) : ''}/>`;
const L = (d, color, w, op = 1) => `<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round"${op < 1 ? ` opacity="${op}"` : ''}/>`;
const lin = (id, stops, x2 = 0, y2 = 1) => `<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}">${stops.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join('')}</linearGradient>`;
const rad = (id, stops, cx = 0.5, cy = 0.5, r = 0.5) => `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}">${stops.map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}"${a < 1 ? ` stop-opacity="${a}"` : ''}/>`).join('')}</radialGradient>`;
// L'ombre de contact (guide svg_pro_mignon_vivant.md, § 2.4) : décalée à l'opposé de la lumière, un noyau plus dense
const ombre = (id, x, y, rx, ry) => `<defs>${rad(id, [[0, OUT, 0.32], [0.6, OUT, 0.2], [1, OUT, 0]])}</defs>` + E(x + 2, y + 1, rx, ry, `url(#${id})`);
// Une boucle douce (§ 4.1 : sinus, jamais de linéaire) : values aller-retour, keySplines en cloche
const doux = n => Array.from({ length: n - 1 }, () => '.45 0 .55 1').join(';');
const boucle = (attr, values, dur, begin = 0) => `<animate attributeName="${attr}" values="${values}" dur="${dur}s" begin="${begin}s" repeatCount="indefinite" calcMode="spline" keySplines="${doux(values.split(';').length)}"/>`;
const tourne = (values, dur, begin = 0) => `<animateTransform attributeName="transform" type="rotate" values="${values}" dur="${dur}s" begin="${begin}s" repeatCount="indefinite" calcMode="spline" keySplines="${doux(values.split(';').length)}"/>`;
// Un éclat qui passe de temps en temps (comme la tuile de la Récolte) : une étoile à quatre branches
const eclat = (x, y, r, dur, begin) => `<path d="M${f(x)},${f(y - r)} Q${f(x + r * 0.16)},${f(y - r * 0.16)} ${f(x + r)},${f(y)} Q${f(x + r * 0.16)},${f(y + r * 0.16)} ${f(x)},${f(y + r)} Q${f(x - r * 0.16)},${f(y + r * 0.16)} ${f(x - r)},${f(y)} Q${f(x - r * 0.16)},${f(y - r * 0.16)} ${f(x)},${f(y - r)} Z" fill="#FFFBE8" opacity="0"><animate attributeName="opacity" values="0;1;0;0" keyTimes="0;0.06;0.14;1" dur="${dur}s" begin="${begin}s" repeatCount="indefinite"/></path>`;
const bouillon = (forme, defaut) => forme.replace(/ fill="[^"]*"/, ` class="bouillon" fill="var(--cook-soup, ${defaut})"`);

// ——— la marmite (120 × 100) : la fonte sur ses deux pierres, ses anses, la bouche ovale vue en plongée ———
// (bouche : centre (60, 35), demi-axes 41 × 9,5 ; le rebord 46 × 12 ; le bouillon dedans, le rebord avant par-dessus)
function marmite() {
  const defs = `<defs>${lin('cui-ma-fonte', [[0, '#6A5248'], [0.42, '#4A3A33'], [1, '#2C221E']], 1, 0.6)}${lin('cui-ma-bord', [[0, '#7E685C'], [1, '#4E3E36']])}`
    + `${lin('cui-ma-pierre', [[0, '#C9C1B0'], [1, '#8F877A']])}${rad('cui-ma-chaud', [[0, '#FF9A3C', 0.55], [1, '#FF9A3C', 0]], 0.5, 0.9, 0.6)}</defs>`;
  let s = defs + ombre('cui-ma-ao', 60, 94.6, 54, 6);
  // les deux pierres (le feu passe entre elles, dans son propre fichier)
  for (const x of [30, 90]) s += E(x, 91, 11, 6, 'url(#cui-ma-pierre)', 1.4) + L(`M${x - 6},88.4 Q${x - 1},86.6 ${x + 4},87.6`, WHITE, 1.4, 0.55);
  // les anses de fer, accrochées sous le rebord
  for (const m of [-1, 1]) {
    const x0 = 60 + m * 45, x1 = 60 + m * 57;
    s += L(`M${x0},41 Q${x1},40 ${x1 - m * 1},50 Q${x1 - m * 3},58 ${x0 - m * 1},54`, OUT, 5.4) + L(`M${x0},41 Q${x1},40 ${x1 - m * 1},50 Q${x1 - m * 3},58 ${x0 - m * 1},54`, '#5A4740', 2.6)
      + L(`M${x0 + m * 2},42.4 Q${x1 - m * 2},42 ${x1 - m * 2.6},48`, '#A88672', 0.9, 0.7);
  }
  // le ventre de fonte : le dégradé, la lueur du feu dessous, un reflet brun, des coups de suie
  const ventre = 'M14,34 Q13,74 38,83.6 Q60,89.6 82,83.6 Q107,74 106,34 Z';
  s += P(ventre, 'url(#cui-ma-fonte)', 1.8) + `<clipPath id="cui-ma-v"><path d="${ventre}"/></clipPath><g clip-path="url(#cui-ma-v)">`
    + `<ellipse cx="60" cy="92" rx="40" ry="16" fill="url(#cui-ma-chaud)">${boucle('opacity', '1;.85;.97;.88;1', 1.3)}</ellipse>` + L('M24,46 Q25,66 39,76', '#C79A7E', 4.2, 0.32) + L('M27,47 Q28,58 33,66', '#F2D2B8', 1.4, 0.45)
    + L('M86,48 Q94,60 92,70', '#1E1714', 3, 0.5) + L('M16,58 Q60,66 104,58', '#2A201C', 1.2, 0.5) + '</g>';
  // le rebord épais, l'intérieur sombre, le bouillon, ses reflets ; le rebord avant passe par-dessus
  s += E(60, 34, 46, 12, 'url(#cui-ma-bord)', 1.8) + E(60, 35, 41, 9.5, '#21170F');
  s += bouillon(E(60, 36, 40, 8.6, '#d6b474'), '#d6b474');
  // les reflets de la surface (deux tirets clairs qui glissent), les bulles qui éclosent (class « bulles »)
  s += `<g opacity=".38">${L('M34,33.4 Q46,30.6 60,30.8', WHITE, 1.6)}<g>${E(78, 37.4, 4.4, 1.2, WHITE)}${E(70, 39.6, 1.6, 0.6, WHITE)}<animateTransform attributeName="transform" type="translate" values="0 0;-3 0.4;0 0" dur="3.2s" repeatCount="indefinite" calcMode="spline" keySplines=".45 0 .55 1;.45 0 .55 1"/></g></g>`;
  s += '<g class="bulles">' + [[44, 37, 0], [66, 35.4, 0.9], [80, 37.6, 1.7]].map(([x, y, b]) => `<ellipse cx="${x}" cy="${y}" rx="0" ry="0" fill="none" stroke="${WHITE}" stroke-width="0.9" opacity=".7"><animate attributeName="rx" values="0;2.6;3.2" keyTimes="0;0.8;1" dur="2.4s" begin="${b}s" repeatCount="indefinite"/><animate attributeName="ry" values="0;1.2;1.5" keyTimes="0;0.8;1" dur="2.4s" begin="${b}s" repeatCount="indefinite"/><animate attributeName="opacity" values="0;.75;0" keyTimes="0;0.8;1" dur="2.4s" begin="${b}s" repeatCount="indefinite"/></ellipse>`).join('') + '</g>';
  s += E(60, 35.4, 40, 8.6, 'none').replace('fill="none"', 'fill="none" stroke="rgba(0,0,0,.25)" stroke-width="1.2"');
  s += `<path d="M14,34 A46,12 0 0 0 106,34" fill="none" stroke="${OUT}" stroke-width="4.4" stroke-linecap="round"/>`
    + `<path d="M14,34 A46,12 0 0 0 106,34" fill="none" stroke="#8C7366" stroke-width="2.4" stroke-linecap="round"/>`
    + L('M24,40.6 Q40,45.2 56,45.6', '#D8B8A2', 1, 0.6) + L('M22,29 Q34,23.8 50,22.8', '#C9AE9C', 0.8, 0.7);
  // la vapeur (class « vapeur ») : trois volutes qui montent, s'élargissent et s'effacent, chacune à son rythme
  s += '<g class="vapeur">' + [[46, 2.8, 0], [61, 3.2, 1.1], [75, 2.6, 2]].map(([x, dur, b]) => `<path d="M${x},30 Q${x - 3},24 ${x},18 Q${x + 3},12 ${x},6" fill="none" stroke="${WHITE}" stroke-width="2.4" stroke-linecap="round" opacity="0"><animate attributeName="opacity" values="0;.55;0" dur="${dur}s" begin="${b}s" repeatCount="indefinite"/><animateTransform attributeName="transform" type="translate" values="0 6;0 -4" dur="${dur}s" begin="${b}s" repeatCount="indefinite"/></path>`).join('') + '</g>';
  return s;
}

// ——— le feu sous la marmite (36 × 27, 3 images en boucle) : un lit de braises, deux bûchettes, les flammes orangées et
// leur cœur jaune qui vacillent ———
const FLAMMES = [
  { o: 'M5,25 Q2,15 10,7.6 Q11,15 15.4,16.4 Q16.6,7 23.6,2.4 Q23,12.6 29.4,15.6 Q34,19.4 31.4,25 Z', c: 'M11,25 Q11,19.4 15.6,17.6 Q17.4,21 21,19 Q24.4,22.4 22.4,25 Z' },
  { o: 'M5,25 Q2.6,16 9,9.4 Q11.4,15.6 15.6,15.4 Q15,6 21,1.6 Q22.6,11 28.6,13.6 Q34.4,18.4 31.4,25 Z', c: 'M11,25 Q10.6,18.6 15,16.6 Q17.6,20.4 20.6,17.6 Q24.8,21.6 22.6,25 Z' },
  { o: 'M5,25 Q1.6,14.6 11,8.4 Q10.6,14.4 15,15.4 Q17.4,8.4 22.4,3.6 Q24,13.6 30,16.4 Q33.4,20 31.4,25 Z', c: 'M11,25 Q11.6,19 16,18 Q16.6,20.8 20.4,18.6 Q23.8,21.4 22.6,25 Z' }
];
function feu(i) {
  const fl = FLAMMES[i];
  return `<defs>${rad(`cui-fe${i}-lueur`, [[0, '#FFB347', 0.7], [1, '#FFB347', 0]])}${lin(`cui-fe${i}-fl`, [[0, '#FFC24A'], [1, '#F2722E']])}</defs><g transform="translate(0 -0.8)">`
    + E(18, 21, 18, 5, `url(#cui-fe${i}-lueur)`).replace('/>', ` opacity="${[1, 0.86, 0.94][i]}"/>`)
    + `<g transform="rotate(-8 17 23.6)">${P('M3,22.4 L17,22.4 L17,24.8 L3,24.8 Z', '#8A5A32', 1)}${E(17, 23.6, 1.1, 1.2, '#3A2A20')}</g>`
    + `<g transform="rotate(8 19 23.6)">${P('M19,22.4 L33,22.4 L33,24.8 L19,24.8 Z', '#A06A3C', 1)}${E(19, 23.6, 1.1, 1.2, '#3A2A20')}</g>`
    + P(fl.o, `url(#cui-fe${i}-fl)`, 1.2) + P(fl.c, '#FFE27A', 0)
    + E(18, 24.8, 9, 1.4, '#C9622E') + [[12, 24.7], [18.6, 25.1], [24, 24.7]].map(([x, y], k) => E(x, y, 1, 0.5, (i + k) % 2 ? '#FFD36B' : '#FF9A3C')).join('')
    + E([22, 24, 25.4][i], [9, 5.6, 2.6][i], 0.8, 0.8, '#FFE27A').replace('/>', ` opacity="${[0.9, 0.7, 0.4][i]}"/>`) + '</g>';
}

// ——— la louche de cuivre (60 × 100) : le long manche, son crochet, le cuilleron en bas à gauche ———
function louche() {
  const defs = `<defs>${lin('cui-lo-cuivre', [[0, '#E8A36A'], [0.5, '#C27C45'], [1, '#8F5530']], 1, 0)}${lin('cui-lo-coque', [[0, '#D88E52'], [1, '#8F5530']])}</defs>`;
  let s = defs + ombre('cui-lo-ao', 22, 96.4, 18, 2.8);
  // le manche, son crochet en haut, son reflet
  s += L('M44,10 Q50,4.6 52.6,9.6 Q53.4,13 50,13.4', OUT, 5.4) + L('M44,10 Q50,4.6 52.6,9.6 Q53.4,13 50,13.4', '#C27C45', 2.6);
  s += L('M45,9 L25,74', OUT, 7.4) + L('M45,9 L25,74', 'url(#cui-lo-cuivre)', 4) + L('M44.2,12.6 L29,62', '#F6C894', 1.1, 0.8);
  // le cuilleron : la coque, son reflet, son bord ; le creux (vide : cuivre sombre ; plein : la soupe)
  s += P('M5,76 Q6.4,95.4 22,95.6 Q37.6,95.4 39,76 Z', 'url(#cui-lo-coque)', 1.8) + L('M10,82 Q12.6,91 21,92.6', '#F6C894', 1.6, 0.7);
  s += E(22, 76, 17, 5, '#B5703C', 1.8) + bouillon(E(22, 76.6, 14.6, 3.8, '#8f5530'), '#8f5530') + L('M12.6,75 Q18,73.2 24,73.4', WHITE, 1, 0.5) + eclat(13, 86, 2.6, 4.2, 1.3);
  return s;
}

// ——— le bol de bois tourné (80 × 50), vu de trois quarts : le ventre, ses cernes de tournage, le pied, l'intérieur ———
function bol() {
  const defs = `<defs>${lin('cui-bo-bois', [[0, '#D99A5E'], [0.6, '#B97A44'], [1, '#8E5A30']], 1, 0.7)}${lin('cui-bo-dedans', [[0, '#7A4A26'], [1, '#A8703E']])}</defs>`;
  let s = defs + ombre('cui-bo-ao', 40, 45, 33, 4.6);
  s += P('M30,40 L50,40 L48,45 Q40,46.6 32,45 Z', '#8E5A30', 1.4);
  s += P('M8,18 Q10,42.6 40,42.6 Q70,42.6 72,18 Z', 'url(#cui-bo-bois)', 1.8);
  s += L('M13,26 Q40,34 67,26', '#7A4A26', 0.9, 0.5) + L('M17,33 Q40,39.4 63,33', '#7A4A26', 0.9, 0.45) + L('M15,25 Q19,35.6 31,39', WHITE, 2.6, 0.28);
  s += E(40, 18, 32, 8, '#C98E56', 1.8) + E(40, 18.8, 28, 6, 'url(#cui-bo-dedans)');
  s += bouillon(E(40, 19.4, 27, 5.4, 'transparent'), 'transparent');
  s += L('M18,16.4 Q30,12.4 46,12.6', '#F0C08A', 1.2, 0.7) + eclat(17, 15, 2.4, 4.6, 2.2);
  return s;
}

// ——— les algues (60 × 60) : trois lames de varech dressées, larges au milieu, effilées au bout, frisées sur les bords ;
// leur nervure claire, deux flotteurs, l'ombre au sol ———
function lame(a, c, b, w, vagues) {
  const at = t => [0, 1].map(k => (1 - t) ** 2 * a[k] + 2 * (1 - t) * t * c[k] + t * t * b[k]);
  const g = [], d = [];
  for (let i = 0; i <= 20; i++) {
    const t = i / 20, p = at(t), q = at(Math.min(1, t + 0.02)), r = at(Math.max(0, t - 0.02));
    const tx = q[0] - r[0], ty = q[1] - r[1], l = Math.hypot(tx, ty) || 1, nx = -ty / l, ny = tx / l;
    const e = w * Math.sin(Math.PI * Math.min(1, 0.12 + t * 0.95)) * (1 + 0.16 * Math.sin(t * Math.PI * vagues));
    g.push([p[0] + nx * e, p[1] + ny * e]); d.push([p[0] - nx * e, p[1] - ny * e]);
  }
  return { contour: 'M' + [...g, ...d.reverse()].map(([x, y]) => `${f(x)},${f(y)}`).join(' L') + ' Z', nerf: 'M' + [0.06, 0.2, 0.35, 0.5, 0.65, 0.8, 0.92].map(at).map(([x, y]) => `${f(x)},${f(y)}`).join(' L') };
}
const BRINS = [
  { a: [24, 54], c: [10, 34], b: [20, 8], w: 5, v: 7, c0: '#5E9A4A', c1: '#9CCB7A' },
  { a: [42, 54], c: [50, 34], b: [43, 14], w: 4.6, v: 6, c0: '#4E8A44', c1: '#86BE66' },
  { a: [32, 55], c: [38, 30], b: [30, 4], w: 5.6, v: 8, c0: '#7DB55C', c1: '#B8DE96' }
];
function algues() {
  let s = ombre('cui-al-ao', 32, 54.4, 23, 4);
  BRINS.forEach((b, i) => { const l = lame(b.a, b.c, b.b, b.w, b.v), a = [3, -2.6, 2.2][i];
    s += `<g>${P(l.contour, b.c0, 1.2)}${L(l.nerf, b.c1, 1, 0.9)}${tourne(`0 ${b.a[0]} ${b.a[1]};${a} ${b.a[0]} ${b.a[1]};0 ${b.a[0]} ${b.a[1]}`, [2.2, 2.6, 2.4][i], [0, 0.7, 1.4][i])}</g>`; });
  s += E(18.4, 30, 2.4, 2, '#B79D4C', 1) + E(45.6, 32, 2.2, 1.9, '#B79D4C', 1) + E(17.8, 29.4, 0.8, 0.6, '#F0E0A0') + E(45, 31.4, 0.7, 0.5, '#F0E0A0') + eclat(30.6, 12, 2, 3.8, 0.6);
  return s;
}

// ——— le seau d'eau de mer (60 × 60) : douelles de bois, deux cercles de fer, l'anse de corde, l'eau bleu-vert ———
function seau() {
  const defs = `<defs>${lin('cui-se-bois', [[0, '#C98A50'], [0.55, '#A86E3C'], [1, '#7E4E28']], 1, 0)}${lin('cui-se-eau', [[0, '#8FD0C8'], [1, '#4E9AA6']])}</defs>`;
  let s = defs + ombre('cui-se-ao', 30, 54.8, 21, 4);
  s += L('M12,19 Q30,-3 48,19', OUT, 3.2) + L('M12,19 Q30,-3 48,19', '#C9A66B', 1.6) + L('M17,11 L18.6,12.6 M24,6.6 L25.4,8.4 M31,5.4 L32,7.4 M38,7.6 L38.6,9.6', '#8A6A3A', 0.7);
  s += P('M12,19 L17,52 Q30,57 43,52 L48,19 Z', 'url(#cui-se-bois)', 1.8);
  s += [20.6, 26.4, 33.6, 39.4].map(x => L(`M${x},${20 + Math.abs(x - 30) * 0.05} L${f(30 + (x - 30) * 0.84)},${54 - Math.abs(x - 30) * 0.12}`, '#6E4422', 0.8, 0.7)).join('');
  for (const [y, w] of [[29, 0.94], [44, 0.86]]) s += L(`M${f(30 - 18 * w)},${y} Q30,${y + 4.6} ${f(30 + 18 * w)},${y}`, OUT, 3.6) + L(`M${f(30 - 18 * w)},${y} Q30,${y + 4.6} ${f(30 + 18 * w)},${y}`, '#7E7A80', 2) + L(`M${f(30 - 16 * w)},${y - 0.6} Q24,${y + 1.6} 18,${y + 1.2}`, '#C9CED6', 0.7, 0.8);
  s += L('M14,26 Q15,38 19,48', WHITE, 2.2, 0.25);
  s += E(30, 19, 18, 5, '#8A5A30', 1.8) + E(30, 19.6, 16, 3.8, 'url(#cui-se-eau)') + E(24.6, 18.6, 6, 1.2, WHITE).replace('/>', ' opacity=".5"/>')
    + E(36, 20.4, 2.4, 0.6, WHITE).replace('/>', ' opacity=".6"/>') + L('M17,20.4 Q22,21.8 26,21.4', '#E8F8F4', 0.8, 0.7)
    + `<ellipse cx="33" cy="19.8" rx="1" ry="0.3" fill="none" stroke="#E8F8F4" stroke-width="0.7"><animate attributeName="rx" values="1;9" dur="2.6s" repeatCount="indefinite"/><animate attributeName="ry" values="0.3;2.2" dur="2.6s" repeatCount="indefinite"/><animate attributeName="opacity" values=".9;0" dur="2.6s" repeatCount="indefinite"/></ellipse>`;
  return s;
}

// ——— la planche (352 × 66) : deux planches de bois flotté jointes, leur fil, des nœuds, deux clous, le chant sombre ———
function planche() {
  const defs = `<defs>${lin('cui-pl-dessus', [[0, '#E2B47C'], [1, '#C9935A']])}${lin('cui-pl-chant', [[0, '#8E5A30'], [1, '#6A3F22']])}</defs>`;
  let s = defs + ombre('cui-pl-ao', 176, 60.6, 176, 5.4);
  s += P('M8,44 L344,44 Q348,44 348,48 L348,55 Q348,59 344,59 L8,59 Q4,59 4,55 L4,48 Q4,44 8,44 Z', 'url(#cui-pl-chant)', 1.8);
  s += P('M12,6 L340,6 Q348,6 348,14 L348,40 Q348,46 340,46 L12,46 Q4,46 4,40 L4,14 Q4,6 12,6 Z', 'url(#cui-pl-dessus)', 1.8);
  s += L('M6,26 L346,26', '#8E5A30', 1.2, 0.8) + L('M6,27.4 L346,27.4', '#F0C890', 0.8, 0.6);
  for (const [y, a] of [[13, 0], [19, 1.4], [33, 0.6], [40, 1.8]]) s += L(`M14,${y} Q90,${y - 1.6 + a} 170,${y} T340,${y - 0.6}`, '#B07A45', 0.8, 0.6);
  for (const [x, y] of [[96, 15.6], [258, 36.4]]) s += E(x, y, 5.4, 2.4, '#A86E3C', 0.8) + E(x, y, 2.4, 1, '#8A5A32');
  for (const x of [22, 330]) for (const y of [16, 36]) s += E(x, y, 1.8, 1.6, '#7E7A80', 0.8) + E(x - 0.5, y - 0.5, 0.6, 0.5, '#C9CED6');
  s += L('M16,9.6 L160,9.6', WHITE, 1.6, 0.35) + L('M200,30 L320,30', WHITE, 1.2, 0.25);
  return s;
}

// ——— le remous (64 × 64) : une spirale claire et translucide, vue de dessus (le jeu l'écrase et la fait tourner) ———
function remous() {
  const tour = (r0, r1, a0, n) => { let d = ''; for (let i = 0; i <= n; i++) { const t = i / n, a = a0 + t * Math.PI * 3, r = r0 + (r1 - r0) * t; d += `${i ? 'L' : 'M'}${f(32 + Math.cos(a) * r)},${f(32 + Math.sin(a) * r)} `; } return d.trim(); };
  return L(tour(28, 4, 0, 60), WHITE, 3.4, 0.55) + L(tour(26, 6, Math.PI, 60), WHITE, 2, 0.4) + E(32, 32, 3, 3, WHITE).replace('/>', ' opacity=".5"/>')
    + [[50, 18], [14, 44], [44, 50]].map(([x, y]) => E(x, y, 1.4, 1.4, WHITE).replace('/>', ' opacity=".6"/>')).join('');
}

// Le trait des bâtiments de palier I (choix de l'auteur, 13 oct.) : la silhouette brune épaisse, à la manière de finesse()
// dans port/src/world/chibi.js mais dans l'autre sens. Chaque trait d'encre s'épaissit de EPAIS ; posé sous un trait de
// couleur de même tracé (anse, manche, corde), seul son bord s'épaissit, la couleur garde sa largeur
const EPAIS = 1.45;
const TRACE = / (?:d|points|x1|y1|x2|y2|cx|cy|r|rx|ry|transform)="[^"]*"/g;
function epaissir(svg, k = EPAIS) {
  const els = svg.split(/(?=<)/);
  const trace = el => (el.match(TRACE) || []).join('');
  const largeur = el => { const m = el.match(/stroke-width="([0-9.]+)"/); return m ? +m[1] : null; };
  return els.map((el, i) => {
    if (!el.includes(`stroke="${OUT}"`)) return el;
    const w = largeur(el);
    if (w === null) return el;
    const t = trace(el), sous = t && els.slice(i + 1, i + 6).find(n => trace(n) === t && /stroke="/.test(n) && !n.includes(`stroke="${OUT}"`) && largeur(n) !== null && largeur(n) < w);
    const nw = sous ? largeur(sous) + (w - largeur(sous)) * k : w * k;
    return el.replace(/stroke-width="[0-9.]+"/, `stroke-width="${f(nw)}"`);
  }).join('');
}

const PIECES = [];
const piece = (id, nom, cadre, dessin, suite = null, ms = null, boucle = false) => PIECES.push({ id, nom, cadre, dessin: () => epaissir(dessin()), suite, ms, boucle });
piece('marmite', 'La marmite de fonte sur ses pierres (le bouillon : class « bouillon », --cook-soup)', [0, 0, 120, 100], marmite);
for (let i = 0; i < 3; i++) piece(`feu_${i + 1}`, 'Le feu sous la marmite (en boucle)', [0, 0, 36, 27], () => feu(i), 'feu', 110, true);
piece('louche', 'La louche de cuivre (son creux : class « bouillon », --cook-soup)', [0, 0, 60, 100], louche);
piece('bol', 'Le bol de bois (sa surface : class « bouillon », --cook-soup)', [0, 0, 80, 50], bol);
piece('algues', 'Les algues', [0, 0, 60, 60], algues);
piece('seau', 'Le seau d\'eau de mer', [0, 0, 60, 60], seau);
piece('planche', 'La planche des ingrédients', [0, 0, 352, 66], planche);
piece('remous', 'Le remous (le jeu l\'écrase en perspective et le fait tourner)', [0, 0, 64, 64], remous);

const TITRE = 'La marmite de Cannelle (la cuisine du jour 3)', FOND = '#E8D2A8';
const LISEZ_MOI = 'La marmite de Cannelle : une scène en carte, vue de face, un peu plongeante. La marmite (120 × 100) a sa bouche ovale centrée en (60, 35), demi-axes 41 × 9,5 ; le feu (36 × 27, trois images en boucle) se pose dessous, centré à x = 50 %. Le bouillon de la marmite, le creux de la louche (60 × 100, le cuilleron en bas à gauche) et la surface du bol (80 × 50) portent class="bouillon" et fill="var(--cook-soup, …)" : posés dans la page (SVG en ligne), ils prennent la teinte de l\'étape ; en image, la teinte entre parenthèses. Le rebord avant de la marmite passe par-dessus le bouillon. Boucles animées dans le SVG (SMIL) : la vapeur (class="vapeur") et les bulles (class="bulles") de la marmite, que le jeu peut cacher tant que l\'eau est froide ; les reflets du bouillon, la lueur du feu sur la fonte, les algues qui ondulent, le rond sur l\'eau du seau, un éclat de temps en temps sur la louche, le bol et les algues. Les algues et le seau (60 × 60) attendent sur la planche (352 × 66) ; les coquillages viennent de plantes/coquillages_nacres.svg. Le remous (64 × 64) : le jeu l\'écrase en perspective et le fait tourner.';
module.exports = { PIECES, TITRE, FOND, LISEZ_MOI };
