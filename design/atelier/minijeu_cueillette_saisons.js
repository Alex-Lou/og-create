// Mini-jeux — la Cueillette, nouvelle version (design/conception/minijeux_grille.md, § 5) : la jauge de panier et son
// « double », le papillon doré et sa magie, les buissons de saison, la pie (elle arrive, vole un fruit, fuit), le nid qui
// grossit et le buisson perdu. Mêmes règles que la Cueillette : buisson 60 × 60, boucles en SMIL, coups en suites
// d'images, fichiers × 4. Chaque pièce porte ses propres dégradés (ids préfixés).
const CU = require('./minijeu_cueillette');
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

// ——— la jauge de panier (96 × 22) : une barre d'osier tressé, trois crans de verre qui se remplissent ; pleine, dorée,
// elle brille (SMIL) ———
function jauge(n, anim = true) {
  const p = `jg${n}`, plein = n === 3;
  let s = `<defs>${lin(p + 'o', [[0, '#E8BC84'], [0.5, '#C8925A'], [1, '#8A5A32']])}${lin(p + 'r', [[0, '#FFC4D0'], [0.5, '#F27A94'], [1, '#C84A68']])}${lin(p + 'g', [[0, '#FFF2B8'], [0.5, '#FFD24A'], [1, '#D89A1E']])}${lin(p + 'v', [[0, '#4A3020'], [1, '#6A4628']])}</defs>`;
  s += P('M5,3 L91,3 Q95,3 95,7 L95,15 Q95,19 91,19 L5,19 Q1,19 1,15 L1,7 Q1,3 5,3 Z', `url(#${p}o)`, 1.2);
  // le tressage de l'osier : des chevrons
  for (let x = 4; x < 94; x += 4) s += L(`M${x},4.4 L${x + 2},8 L${x},11.6 M${x},11 L${x + 2},14.6 L${x},18`, '#9A6A3A', 0.6, ' opacity=".55"');
  s += L('M5,4.6 L91,4.6', '#F6D8A8', 1, ' opacity=".8"');
  for (let i = 0; i < 3; i++) {
    const x = 5 + i * 29.4, w = 26.4;
    const d = `M${x + 3},6.4 L${f(x + w - 3)},6.4 Q${f(x + w)},6.4 ${f(x + w)},9.4 L${f(x + w)},12.6 Q${f(x + w)},15.6 ${f(x + w - 3)},15.6 L${x + 3},15.6 Q${x},15.6 ${x},12.6 L${x},9.4 Q${x},6.4 ${x + 3},6.4 Z`;
    s += P(d, `url(#${p}v)`, 0.8);
    if (i < n) s += P(d, `url(#${p}${plein ? 'g' : 'r'})`, 0.8) + L(`M${x + 3},8.2 L${f(x + w * 0.55)},8.2`, WHITE, 1.2, ' opacity=".75"') + E(x + w - 4, 12.6, 1.2, 0.9, WHITE).replace('/>', ' opacity=".5"/>');
    else s += L(`M${x + 3},8.2 L${f(x + w * 0.4)},8.2`, WHITE, 0.8, ' opacity=".15"');
  }
  if (plein) s += `<rect x="0.4" y="2.4" width="95.2" height="17.2" rx="4.4" fill="none" stroke="#FFF2B8" stroke-width="1.8">${anim ? '<animate attributeName="stroke-opacity" values="1;.15;1" dur="0.6s" repeatCount="indefinite"/>' : ''}</rect>` + (anim ? brille(92, 3.4, 3, 1.2, 0) + brille(4, 18.6, 2.4, 1.2, 0.6) + brille(48, 3, 2, 1.2, 0.3) : etoile(92, 3.4, 3) + etoile(4, 18.6, 2.4));
  return s;
}
// le « double » (32 × 32, SMIL : il bat) : une rosette dorée à rubans, deux petits paniers pleins au cœur
function panierMini(x, y, s) { return `<g transform="translate(${x} ${y}) scale(${s})">${L('M-5,-2 Q0,-9 5,-2', '#8A5A32', 1.4)}${E(-2.4, -3.4, 2, 1.8, '#E8404A', 0.5)}${E(1.6, -3.6, 1.8, 1.6, '#4A62B8', 0.5)}${E(0, -4.8, 1.4, 1.3, '#8A5AA8', 0.4)}${P('M-6.4,-2 L6.4,-2 L5,5 Q0,6.4 -5,5 Z', 'url(#dbP)', 0.8)}${L('M-5.6,1 Q0,2 5.6,1', '#8A5A32', 0.5)}${L('M-6.4,-2 L6.4,-2', '#F6D8A8', 1)}</g>`; }
function double(anim = true) {
  const defs = `<defs>${rad('dbR', [[0, '#FFF2B8'], [0.6, '#FFD24A'], [1, '#D89A1E']])}${lin('dbP', [[0, '#E8BC84'], [1, '#A8784A']])}${lin('dbB', [[0, '#F27A94'], [1, '#C84A68']])}</defs>`;
  // les rubans qui pendent derrière
  const rubans = P('M11,22 L7,31 L10.4,29.4 L12,32 L15,23 Z', 'url(#dbB)', 0.8) + P('M21,22 L25,31 L21.6,29.4 L20,32 L17,23 Z', 'url(#dbB)', 0.8);
  // la rosette : douze pétales, le cœur doré pointillé, deux petits paniers pleins
  let r = '';
  for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; r += E(16 + Math.cos(a) * 10.4, 14 + Math.sin(a) * 10.4, 3.4, 3.4, i % 2 ? '#FFD24A' : '#F2B83A', 0.7); }
  r += E(16, 14, 10.2, 10.2, 'url(#dbR)', 1) + E(16, 14, 8, 8, 'none').replace('fill="none"', 'fill="none" stroke="#D89A1E" stroke-width="0.6" stroke-dasharray="1 1"');
  r += panierMini(12.4, 15.4, 0.62) + panierMini(19.6, 15.4, 0.62) + L('M9.6,8 Q12,5.6 15,5.2', WHITE, 1.1, ' opacity=".8"');
  const bat = anim ? '<animateTransform attributeName="transform" type="scale" values="1;1.08;1" dur="0.5s" repeatCount="indefinite"/>' : '';
  // le tout réduit pour que les pétales et les rubans tiennent dans le cadre
  return defs + `<g transform="translate(16 15.4) scale(0.86) translate(-16 -15.4)">${rubans}<g transform-origin="16 14">${bat}${r}</g></g>` + etoile(27.6, 4, 2.4) + etoile(4.4, 25, 1.8);
}

// ——— le papillon doré (32 × 32, SMIL : il bat des ailes, un éclat passe) ———
function papillon(anim = true, ouvert = 1) {
  const d = `<defs>${lin('ppH', [[0, '#FFF2B8'], [0.5, '#FFD24A'], [1, '#E89A2A']], 1, 1)}${lin('ppB', [[0, '#FFE07A'], [1, '#E8843A']], 1, 1)}${lin('ppC', [[0, '#7A4A2A'], [1, '#3C2819']])}</defs>`;
  const aile = sx => `<g transform="scale(${sx} 1)">${P('M0.6,-1 Q4,-13 12.4,-10.6 Q15.6,-8 13,-3.4 Q10,0.4 0.6,0.6 Z', 'url(#ppH)', 0.9)}${P('M0.6,1 Q9,1.6 10.4,6.4 Q10.6,10.4 6.6,10 Q2.6,9 0.6,2.6 Z', 'url(#ppB)', 0.9)}${L('M1.4,-0.6 Q6,-4 10,-8.6 M1.4,0 Q7,-2 12,-4', '#D8902A', 0.5, ' opacity=".8"')}${L('M1.4,1.6 Q5,4 8,8', '#C8742A', 0.5, ' opacity=".8"')}${E(9.4, -7.4, 1.8, 1.5, '#FFFBE8', 0.4)}${E(6.6, 6, 1.2, 1, '#FFFBE8', 0.3)}${E(12, -4.6, 0.8, 0.7, '#E8604A')}${L('M3.4,-8 Q6,-11 9.6,-11', WHITE, 0.9, ' opacity=".8"')}</g>`;
  const ailes = anim ? `<g><animateTransform attributeName="transform" type="scale" values="1 1;0.2 1;1 1" dur="0.36s" repeatCount="indefinite"/>${aile(1)}${aile(-1)}</g>` : `<g transform="scale(${ouvert} 1)">${aile(1)}${aile(-1)}</g>`;
  const corps = P('M-1.4,-5.4 Q0,-7.2 1.4,-5.4 L1.3,6.4 Q0,8.4 -1.3,6.4 Z', 'url(#ppC)', 0.6) + L('M-1.2,-1 L1.2,-1 M-1.2,1.6 L1.2,1.6 M-1.1,4 L1.1,4', '#E8C890', 0.4) + E(0, -6.6, 1.8, 1.7, '#5A3A24', 0.6) + E(-0.6, -7, 0.5, 0.5, WHITE)
    + L('M-0.6,-8 Q-2.4,-11.6 -4.6,-12', OUT, 0.6) + L('M0.6,-8 Q2.4,-11.6 4.6,-12', OUT, 0.6) + E(-4.6, -12, 0.9, 0.9, '#FFD24A', 0.4) + E(4.6, -12, 0.9, 0.9, '#FFD24A', 0.4);
  return d + `<circle cx="16" cy="17" r="13" fill="#FFF2B8" opacity=".25"/><g transform="translate(16 17.4)">${ailes}${corps}</g>` + (anim ? brille(27, 6, 2, 1.6, 0) + brille(5, 27, 1.6, 1.6, 0.8) : etoile(27, 6, 2) + etoile(5, 27, 1.6));
}
// la magie du papillon (60 × 60, 4 images, centrée sur le buisson) : un anneau doré qui s'ouvre, étoiles et pétales
function magie(k) {
  const t = (k + 1) / 4, p = `mg${k}`;
  let s = `<defs>${rad(p, [[0, '#FFF6C8'], [0.7, '#FFE07A'], [1, '#FFD24A']], 0.5, 0.5, 0.5)}</defs>`;
  s += `<circle cx="30" cy="34" r="${f(8 + t * 16)}" fill="url(#${p})" opacity="${f(0.35 * (1 - t))}"/>`;
  s += `<circle cx="30" cy="34" r="${f(8 + t * 16)}" fill="none" stroke="#FFD24A" stroke-width="${f(3 * (1 - t * 0.6))}" opacity="${f(1 - t * 0.55)}"/><circle cx="30" cy="34" r="${f(8 + t * 16)}" fill="none" stroke="#FFFBE8" stroke-width="${f(1.2 * (1 - t * 0.6))}" opacity="${f(1 - t * 0.55)}"/>`;
  for (let i = 0; i < 10; i++) { const a = i * Math.PI / 5 + k * 0.25, d = 6 + t * 17, x = 30 + Math.cos(a) * d, y = 34 + Math.sin(a) * d * 0.8; s += i % 3 === 2 ? `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(i * 40 + k * 30)})">${P('M0,-2.4 Q1.8,0 0,2.4 Q-1.8,0 0,-2.4 Z', '#FFC4D0', 0.4)}</g>` : etoile(x, y, f(3 * (1 - t * 0.4)), i % 2 ? '#FFE07A' : '#FFFBE8'); }
  return s;
}

// ——— les buissons de saison : le buisson de la Cueillette, ombré et éclairé, aux couleurs de la saison ———
const SAISONS = {
  printemps: { touffes: ['#7CC25A', '#8ED06A', '#A0DC7A'], clair: '#C8F0A0', ombre: '#4E9A38', feuille: '#B0E888', fleur: ['#FFD0E0', '#F48AAA'] },
  ete: { touffes: ['#3E8A2E', '#4E9A38', '#5AAA44'], clair: '#8ED06A', ombre: '#2A6A20', feuille: '#7EC25A', fleur: ['#FFFFFF', '#E8E0F0'] },
  automne: { touffes: ['#C8642A', '#D8843A', '#E8A04A'], clair: '#F8D07A', ombre: '#8A3A1A', feuille: '#F2B84A', fleur: null }
};
const TOUFFES = [[18, 36, 13], [42, 36, 13], [30, 25, 15], [23, 40, 12], [38, 41, 11]];
function buissonSaison(k) {
  const c = SAISONS[k], p = `bs${k}`;
  let s = `<defs>${c.touffes.map((col, i) => rad(`${p}${i}`, [[0, c.clair], [0.55, col], [1, c.ombre]], 0.38, 0.3, 0.8)).join('')}</defs>`;
  s += E(30, 53, 22, 4.6, 'rgba(40,60,20,.25)');
  for (const [x, y, r] of TOUFFES) s += `<circle cx="${x}" cy="${y}" r="${r}" fill="${c.ombre}"${st(1.2)}/>`;
  TOUFFES.forEach(([x, y, r], i) => { s += `<circle cx="${x}" cy="${y}" r="${f(r - 0.6)}" fill="url(#${p}${i % 3})"/>` + L(`M${f(x - r * 0.55)},${f(y - r * 0.35)} q${f(r * 0.3)},${f(-r * 0.35)} ${f(r * 0.65)},${f(-r * 0.3)}`, WHITE, 1.1, ' opacity=".4"'); });
  // les feuilles qui dépassent, nervurées
  for (const [x, y, r] of [[12, 28, -40], [48, 29, 40], [30, 10.4, 0], [8, 42, -70], [52, 43, 70]]) s += `<g transform="translate(${x} ${y}) rotate(${r})">${P('M0,3.4 Q-3,-1 0,-5 Q3,-1 0,3.4 Z', c.feuille, 0.8)}${L('M0,2.6 L0,-4', c.ombre, 0.5)}</g>`;
  if (k === 'printemps') for (const [x, y, r] of [[14, 30, 1.6], [24, 21, 1.8], [37, 19, 1.6], [46, 31, 1.7], [26, 40, 1.8], [40, 44, 1.5], [17, 44, 1.5], [31, 31, 1.9]]) s += [0, 1, 2, 3, 4].map(i => { const a = i * Math.PI * 0.4 - Math.PI / 2; return E(x + Math.cos(a) * r, y + Math.sin(a) * r, r * 0.85, r * 0.85, c.fleur[i % 2 ? 1 : 0], 0.3); }).join('') + E(x, y, r * 0.5, r * 0.5, '#FFD24A', 0.3);
  if (k === 'ete') s += [[16, 30], [44, 34], [33, 45], [26, 22]].map(([x, y]) => [0, 1, 2, 3, 4].map(i => { const t = i * Math.PI * 0.4; return E(x + Math.cos(t) * 1.2, y + Math.sin(t) * 1.2, 0.95, 0.95, c.fleur[0], 0.25); }).join('') + E(x, y, 0.6, 0.6, '#F2C04B')).join('') + [[20, 24], [40, 26]].map(([x, y]) => E(x, y, 3.4, 1.6, WHITE).replace('/>', ' opacity=".18"/>')).join('');
  if (k === 'automne') s += [[6, 52, 30, '#E8843A'], [52, 54, -20, '#D8642A'], [48, 9, 60, '#F2B84A'], [10, 14, -30, '#E8843A']].map(([x, y, r, col]) => `<g transform="translate(${x} ${y}) rotate(${r})">${P('M0,3 Q-2.8,-1 0,-4.6 Q2.8,-1 0,3 Z', col, 0.6)}${L('M0,2.4 L0,-3.6', '#8A3A1A', 0.4)}</g>`).join('') + [[22, 26], [38, 36], [28, 44]].map(([x, y]) => E(x, y, 1.4, 1.4, '#C8402A', 0.4) + E(x - 0.4, y - 0.4, 0.4, 0.4, WHITE)).join('');
  return s;
}

// ——— la pie (cadre 52 × 40, de −4 à 48 en x) : ronde et vive ; noire aux reflets bleu-vert, ventre blanc, longue queue ———
// pose : posée (les pattes) ; ailes : 0 repliées, 1 levées, 2 basses ; fruitK : le fruit volé ; effraye : l'œil plissé
function pie(pose, ailes = 0, fruitK = null, effraye = false) {
  const p = `pi${pose}${ailes}${fruitK || ''}${effraye ? 'e' : ''}`;
  let s = `<defs>${lin(p + 'n', [[0, '#3A3E5A'], [1, '#14141E']])}${lin(p + 'q', [[0, '#3A7AC8'], [0.5, '#2A9A8A'], [1, '#1E2E4A']], 1, 0)}${rad(p + 'v', [[0, '#FFFFFF'], [1, '#D8E0EC']], 0.4, 0.3, 0.8)}${lin(p + 'a', [[0, '#4A5A8A'], [0.5, '#2A3A6A'], [1, '#18203A']])}</defs>`;
  // la queue, longue, irisée
  s += P('M10,20 Q2,17 -3,13.4 Q-3.6,15.6 -2,17 Q1,20 8,22.6 Z', `url(#${p}q)`, 0.9) + L('M-1.4,15 Q3,18 8,20.6', '#8AD8E8', 0.6, ' opacity=".7"');
  // le corps rond
  s += P('M7,20 Q7,10.4 18,9.6 Q28,9.4 30.6,16.4 Q31,25 19,26.4 Q8.6,26.6 7,20 Z', `url(#${p}n)`, 1.1);
  s += P('M13.6,21 Q17,15.4 27,16.6 Q29,23 19,25.2 Q14,25 13.6,21 Z', `url(#${p}v)`, 0);
  // la tête ronde, l'œil brillant, le bec
  s += P('M25.6,9.6 Q27,3.6 33,4 Q38.6,5 38.4,10.6 Q37.4,15.6 32,16 Q27,15.6 25.6,9.6 Z', `url(#${p}n)`, 1);
  s += effraye ? L('M31.6,8.6 Q33.6,7.2 35.4,8.6', WHITE, 1.4) + L('M31.6,8.6 Q33.6,7.2 35.4,8.6', OUT, 0.6) + L('M30.8,6 L35,5.2', OUT, 0.7) : E(33.6, 9, 2, 2.2, WHITE, 0.4) + E(34, 9.2, 1.3, 1.5, OUT) + E(34.5, 8.5, 0.5, 0.5, WHITE);
  s += P('M37.6,9 L43.4,10.6 L37.6,12.6 Z', '#4A4A50', 0.8) + L('M38,10.6 L42,10.6', '#7A7A84', 0.5);
  s += L('M28,6.6 Q30,4.4 33,4.4', '#8A9AD8', 0.9, ' opacity=".7"');
  if (fruitK) s += `<g transform="translate(36.2 6.2) scale(0.34)">${CU.fruit(fruitK)}</g>`;
  if (pose) s += L('M16,26 L15,30.6 M21,26 L22,30.6', '#4A4A50', 1.1) + L('M13,30.8 L17,30.8 M20,30.8 L24.4,30.8', '#4A4A50', 0.9);
  // l'aile : repliée, levée ou basse ; une tache blanche, des rémiges bleutées
  const aile = [
    P('M12,15 Q20,10.6 27,14.6 Q23,21.4 12,19.4 Z', `url(#${p}a)`, 0.8) + P('M14.6,15.6 Q19,14 22,15.4 Q18,17.6 14.6,15.6 Z', WHITE, 0) + L('M16,18.4 L25,16.4', '#6A9AE8', 0.6),
    P('M14,13.6 Q14,-0.6 26.6,-2.4 Q26.6,7 22.6,13.6 Z', `url(#${p}a)`, 0.8) + P('M17,6 Q20,1.6 24.4,0.4 L23.4,4 Q20,5 17,6 Z', WHITE, 0) + L('M16.4,10.6 Q19,6 24,4.6', '#6A9AE8', 0.6),
    P('M13,17 Q15,30 25,32 Q26.4,23 22.6,17 Z', `url(#${p}a)`, 0.8) + P('M15.4,20 Q17,25 20.4,27 L21.6,23 Q18.6,22 15.4,20 Z', WHITE, 0) + L('M16,22 L22,29', '#6A9AE8', 0.6)
  ][ailes];
  return s + aile;
}
function plumes(k) {
  const t = (k + 1) / 3;
  return [[-1, -1], [1, -0.6], [-0.4, 1], [0.8, 0.8]].map(([dx, dy], i) => `<g transform="translate(${f(18 + dx * t * 14)} ${f(16 + dy * t * 10 + t * 3)}) rotate(${f(i * 80 + t * 90)})" opacity="${f(1 - t * 0.6)}">${P('M0,-3.4 Q1.8,0 0,3.4 Q-1.8,0 0,-3.4 Z', i % 2 ? WHITE : '#2A2E44', 0.5)}${L('M0,-3 L0,3', i % 2 ? '#C8D0DC' : '#6A7AA8', 0.4)}</g>`).join('');
}
// ——— le nid qui grossit : 3 tailles (par-dessus le buisson, 60 × 60), un nid de papier en couches, les guêpes autour ———
function nidPapier(p) {
  return `<defs>${rad(p, [[0, '#F2E2C0'], [0.6, '#D8C49A'], [1, '#A88A60']], 0.4, 0.3, 0.8)}</defs>` + L('M16,3 L16,7', '#6A4A2A', 1.4)
    + P('M9.6,10 Q16,5.4 22.4,10 Q25.6,16 22.4,22.4 Q16,26.6 9.6,22.4 Q6.4,16 9.6,10 Z', `url(#${p})`, 1)
    + L('M8.6,13.6 Q16,11 23.4,13.6 M7.8,17.4 Q16,15 24.2,17.4 M8.6,21 Q16,19 23.4,21', '#A88A60', 0.7) + L('M10.4,11.4 Q13,9 16,8.6', WHITE, 1, ' opacity=".6"')
    + E(16, 19.4, 2, 2.2, '#3A2A1A', 0.6) + E(15.6, 19, 0.6, 0.6, '#6A5A40');
}
function nidTaille(n, fige = false) {
  const sc = [0.7, 1, 1.35][n];
  // le nid de papier dessiné ici ; les guêpes de la Cueillette qui tournent autour (on ne garde pas son nid plat)
  const guepes = CU.guepes(fige).replace(/^<path d="M10,10 Q16,6 22,10[^]*?<path d="M16,6\.6 L16,3"[^>]*\/>/, '');
  return `<g transform="translate(30 22) scale(${sc}) translate(-16 -16)">${nidPapier(`nd${n}${fige ? 'f' : ''}`)}${guepes}</g>`;
}
const perdu = () => `<g opacity=".6">${buissonSaison('ete').replace(/url\(#bsete(\d)\)/g, '#8A9A7A').replace(/#2A6A20/g, '#6A7A5E').replace(/#7EC25A/g, '#A8B49A').replace(/<defs>.*?<\/defs>/, '')}</g>` + [[10, 50, 40], [50, 52, -30], [44, 46, 80]].map(([x, y, r]) => `<g transform="translate(${x} ${y}) rotate(${r})" opacity=".7">${P('M0,3 Q-2.8,-1 0,-4.6 Q2.8,-1 0,3 Z', '#A8A890', 0.6)}${L('M0,2.4 L0,-3.6', '#6A6A5A', 0.4)}</g>`).join('');

// ——— les pièces (dans le dossier de la Cueillette) : { id, nom, cadre, dessin, suite, ms par image, boucle } ———
const PIECES = [];
const piece = (id, nom, cadre, dessin, suite = null, ms = null, boucle = false) => PIECES.push({ id, nom, cadre, dessin, suite, ms, boucle });
const B = [0, 0, 60, 60], F = [0, 0, 32, 32], PIE = [-4, -4, 52, 40];
const balance = s => `<g><animateTransform attributeName="transform" type="rotate" values="-1.2 30 50;1.2 30 50;-1.2 30 50" dur="3.2s" repeatCount="indefinite"/>${s}</g>`;
for (let n = 0; n <= 3; n++) piece(`jauge_${n}`, `La jauge de panier, ${n} cran${n > 1 ? 's' : ''}${n === 3 ? ' (pleine, elle brille en boucle)' : ''}`, [0, 0, 96, 22], () => jauge(n));
piece('double', 'Le « double » (il bat, en boucle ; le jeu dessine le temps)', F, () => double());
piece('papillon', 'Le papillon doré (il bat des ailes, en boucle)', F, () => papillon());
for (let k = 0; k < 4; k++) piece(`magie_${k + 1}`, 'La magie du papillon (vers les buissons voisins)', B, () => magie(k), 'magie', 90);
const SAISON = { printemps: 'de printemps, fleuri', ete: 'd\'été', automne: 'd\'automne, roux' };
for (const k of Object.keys(SAISONS)) piece(`buisson-${k}`, `Le buisson ${SAISON[k]} (il se balance, en boucle)`, B, () => balance(buissonSaison(k)));
for (const [i, a] of [1, 2, 0].entries()) piece(`pie-arrive_${i + 1}`, 'La pie qui arrive en volant', PIE, () => pie(0, a), 'pie-arrive', 110, true);
for (const k of Object.keys(CU.FRUITS)) piece(`pie-vole-${k}`, `La pie posée, qui a volé ${k === 'cepe' ? 'le cèpe' : `la ${{ mure: 'mûre', fraise: 'fraise', myrtille: 'myrtille' }[k]}`}`, PIE, () => pie(1, 0, k));
for (const [i, a] of [1, 2, 1].entries()) piece(`pie-fuit_${i + 1}`, 'La pie qui fuit (elle perd des plumes)', PIE, () => `<g transform="scale(-1 1) translate(-44 0)">${pie(0, a, null, true)}</g>` + (i ? plumes(i - 1) : ''), 'pie-fuit', 100);
for (let n = 0; n < 3; n++) piece(`nid_${n + 1}`, `Le nid de guêpes, taille ${n + 1} (par-dessus le buisson ; les guêpes tournent, en boucle)`, B, () => nidTaille(n));
piece('buisson-perdu', 'Le buisson perdu (5 secondes, sous le nid de taille 3)', B, perdu);

const LISEZ_MOI = 'Nouvelle version (design/conception/minijeux_grille.md) : la jauge de panier (96 × 22) en 4 états ; le « double » et le papillon doré (32 × 32) ; la magie du papillon, les buissons de saison, le nid (par-dessus le buisson) et le buisson perdu ont le cadre d\'un buisson (60 × 60). La pie a un cadre de 52 × 40 (de −4 à 48 en x, de −4 à 36 en y) : elle arrive en boucle, se pose avec le fruit volé, puis fuit une fois (retournée, vers la gauche).';
module.exports = { PIECES, LISEZ_MOI, SAISONS, jauge, double, papillon, magie, pie, plumes, nidTaille, perdu, buissonSaison };
