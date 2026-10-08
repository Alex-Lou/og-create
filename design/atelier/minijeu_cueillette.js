// Mini-jeux — la Cueillette (le Bosquet) : seize buissons, des baies mûres un instant, des guêpes. Le jeu pose ses
// pièces dans des boutons (DOM) : les boucles sont animées en SMIL (le buisson qui respire, le fruit mûr qui brille, le
// fruit trop mûr qui tremble, les guêpes) ; ce qui arrive une fois (il mûrit, il tombe, on le cueille, la piqûre, le
// buisson secoué) est en suites d'images. Buisson 60 × 60 (le fruit se pose au milieu, en 32 × 32) ; fichiers × 4.
const OUT = '#3C2819', WHITE = '#FFFFFF';
const f = n => Math.round(n * 100) / 100;
const st = w => ` stroke="${OUT}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
const P = (d, fill, w = 1) => `<path d="${d}" fill="${fill}"${w ? st(w) : ''}/>`;
const E = (x, y, rx, ry, fill, w = 0) => `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(rx)}" ry="${f(ry)}" fill="${fill}"${w ? st(w) : ''}/>`;
const etoile = (x, y, r, fill = '#FFFBE8') => `<path d="M${f(x)},${f(y - r)} Q${f(x + r * 0.16)},${f(y - r * 0.16)} ${f(x + r)},${f(y)} Q${f(x + r * 0.16)},${f(y + r * 0.16)} ${f(x)},${f(y + r)} Q${f(x - r * 0.16)},${f(y + r * 0.16)} ${f(x - r)},${f(y)} Q${f(x - r * 0.16)},${f(y - r * 0.16)} ${f(x)},${f(y - r)} Z" fill="${fill}"/>`;

// ——— le buisson (cadre 60 × 60) ———
const FEUILLES = [[18, 36, 13, '#4E8F3A'], [42, 36, 13, '#4E8F3A'], [30, 25, 15, '#5FA548'], [23, 40, 12, '#68B04F'], [38, 41, 11, '#5FA548']];
function buisson(secoue = 0, vide = false) {
  const a = [0, -5, 4, -2][secoue];
  let s = E(30, 52, 22, 5, 'rgba(40,60,20,.25)');
  s += `<g transform="rotate(${a} 30 50)">`;
  // les touffes, cernées, chacune avec un reflet et deux feuilles qui dépassent
  for (const [x, y, r, c] of FEUILLES) s += `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"${st(1.1)}/>`;
  for (const [x, y, r, c] of FEUILLES) s += `<circle cx="${x}" cy="${y}" r="${f(r - 0.6)}" fill="${c}"/><path d="M${f(x - r * 0.55)},${f(y - r * 0.35)} q${f(r * 0.3)},${f(-r * 0.35)} ${f(r * 0.65)},${f(-r * 0.3)}" fill="none" stroke="${WHITE}" stroke-width="1" stroke-linecap="round" opacity=".3"/>`;
  for (const [x, y, rot] of [[12, 28, -40], [48, 29, 40], [30, 10.4, 0], [8, 42, -70], [52, 43, 70]]) s += `<g transform="translate(${x} ${y}) rotate(${rot})">${P('M0,3 Q-2.6,-1 0,-4.4 Q2.6,-1 0,3 Z', '#7EC25A', 0.8)}<path d="M0,2.4 L0,-3.4" stroke="#4E8F3A" stroke-width="0.5"/></g>`;
  // des petites fleurs blanches (sauf vide)
  if (!vide) for (const [x, y] of [[16, 30], [44, 34], [33, 45]]) s += [0, 1, 2, 3, 4].map(i => { const t = i * Math.PI * 0.4; return E(x + Math.cos(t) * 1.2, y + Math.sin(t) * 1.2, 0.9, 0.9, '#FFF8F0'); }).join('') + E(x, y, 0.6, 0.6, '#F2C04B');
  s += `</g>`;
  if (secoue) for (let i = 0; i < 3; i++) s += `<g transform="translate(${10 + i * 18 + secoue * 2} ${f(14 + secoue * 4 + i * 3)}) rotate(${f(secoue * 40 + i * 50)})">${P('M0,2 Q-1.8,-0.6 0,-3 Q1.8,-0.6 0,2 Z', '#7EC25A', 0.6)}</g>`;
  return s;
}
// le buisson qui respire (SMIL) : il se balance un peu, ses fleurs aussi
const buissonVivant = () => `<g><animateTransform attributeName="transform" type="rotate" values="-1.2 30 50;1.2 30 50;-1.2 30 50" dur="3.2s" repeatCount="indefinite"/>${buisson(0)}</g>`;

// ——— les fruits (cadre 32 × 32, posés au milieu du buisson) ———
const FRUITS = {
  mure: { nom: 'mûre', corps: '#4A2A5A', clair: '#8A5AA8', ombre: '#2A1834', jus: '#7A3A8A' },
  fraise: { nom: 'fraise', corps: '#E8404A', clair: '#FF8A8A', ombre: '#A8202A', jus: '#F05A64' },
  myrtille: { nom: 'myrtille', corps: '#4A62B8', clair: '#8AA8E8', ombre: '#2A3A7A', jus: '#5A6AC8' },
  cepe: { nom: 'cèpe', corps: '#A86A3A', clair: '#D8A070', ombre: '#7A4A24', jus: '#E8C890' }
};
// un fruit ; m : maturité de 0 (vert, petit) à 1 (mûr) ; tard : trop mûr (plus sombre, ridé, penché)
function fruit(k, m = 1, tard = false) {
  const c = FRUITS[k], vert = '#9AC86A';
  const col = m < 1 ? vert : tard ? c.ombre : c.corps;
  let s = '';
  if (k === 'mure') {
    // une grappe de petites boules (drupéoles)
    s += P('M16,6 L16,10', 'none', 1) + P('M16,7 Q12,4 10,6.6 Q13,7.8 16,7.6 Z', '#6AA84A', 0.7) + P('M16,7 Q20,4 22,6.6 Q19,7.8 16,7.6 Z', '#6AA84A', 0.7);
    const pts = [[16, 11.6], [12.6, 13.6], [19.4, 13.6], [16, 15.4], [11.6, 17.4], [20.4, 17.4], [14, 18.6], [18, 18.6], [12.8, 21.4], [19.2, 21.4], [16, 22], [14.4, 24.4], [17.6, 24.4], [16, 26.4]];
    for (const [x, y] of pts) s += `<circle cx="${x}" cy="${y}" r="2.3" fill="${col}"${st(0.7)}/>` + E(x - 0.7, y - 0.7, 0.6, 0.6, m < 1 ? '#D8F0B0' : c.clair);
  } else if (k === 'fraise') {
    s += P('M16,9 Q24.6,9 24,16 Q23.4,23.6 16,27.6 Q8.6,23.6 8,16 Q7.4,9 16,9 Z', col, 1);
    for (const [x, y] of [[12, 13], [16, 12.4], [20, 13], [11, 17.4], [15, 16.8], [19.4, 17.2], [13, 21.4], [17.4, 21.2], [15.4, 24.6]]) s += `<path d="M${x},${f(y - 0.7)} Q${x + 0.6},${y} ${x},${f(y + 0.7)} Q${x - 0.6},${y} ${x},${f(y - 0.7)} Z" fill="${m < 1 ? '#E8F4C0' : '#FFE07A'}"/>`;
    s += P('M16,10 L11,6.6 L13.4,9.6 L9.6,9.4 L13.6,11.2 L16,9.8 L18.4,11.2 L22.4,9.4 L18.6,9.6 L21,6.6 Z', '#5FA548', 0.8) + P('M16,7 L16,3.6', 'none', 1.1) + `<path d="M11,13.4 Q12,11.4 14,11" fill="none" stroke="${WHITE}" stroke-width="1.1" stroke-linecap="round" opacity=".6"/>`;
  } else if (k === 'myrtille') {
    for (const [x, y, r] of [[11.4, 19, 5.2], [20.8, 18.2, 5.4], [16, 24.4, 5.2]]) s += `<circle cx="${x}" cy="${y}" r="${r}" fill="${col}"${st(0.9)}/>` + `<path d="M${f(x - 1.6)},${f(y - r + 1.2)} l1.6,1 l1.6,-1" fill="none" stroke="${m < 1 ? '#5A8A3A' : c.ombre}" stroke-width="0.8" stroke-linecap="round"/>` + E(x - r * 0.4, y - r * 0.2, r * 0.28, r * 0.2, WHITE).replace('/>', ' opacity=".45"/>') + (m >= 1 ? `<circle cx="${x}" cy="${y}" r="${f(r - 0.8)}" fill="#C8D8F8" opacity=".18"/>` : '');
    s += P('M11.4,14 Q14,8 16,6.4 Q18,8 20.8,13 M16,6.4 L16,19.4', 'none', 0.9) + P('M16,7.6 Q20,4 23,6 Q20,8.4 16,7.6 Z', '#6AA84A', 0.7);
  } else {
    // le cèpe : chapeau brun bombé, pied ventru, il luit (rare)
    s += P('M11,18 Q10,26.6 12.6,28 L19.4,28 Q22,26.6 21,18 Z', m < 1 ? '#EEE8D0' : '#F4ECD4', 1) + `<path d="M13,22 Q16,23 19,22 M12.8,25 Q16,26 19.2,25" fill="none" stroke="#D8C8A0" stroke-width="0.6"/>`;
    s += P('M4.6,18.6 Q4,8 16,7.4 Q28,8 27.4,18.6 Q16,21 4.6,18.6 Z', m < 1 ? '#C8A878' : c.corps, 1) + P('M6,18.6 Q16,20.6 26,18.6 Q16,22.4 6,18.6 Z', '#E8D8A8', 0.7);
    s += `<path d="M8.4,13 Q11,9.4 15,9" fill="none" stroke="${c.clair}" stroke-width="1.6" stroke-linecap="round" opacity=".8"/>` + E(21, 12, 1.2, 0.8, c.clair).replace('/>', ' opacity=".6"/>');
  }
  // trop mûr : une ombre violette, des rides, une mouche ? non : il ternit et des gouttes de jus perlent
  if (tard) s = `<g filter="none" opacity=".95">${s}</g>`  + `<path d="M${k === 'cepe' ? '9,15 q2,1.2 4,0 M18,15 q2,1.2 4,0' : '12,16 q2,1.2 4,0 M17,21 q2,1.2 4,0'}" fill="none" stroke="${OUT}" stroke-width="0.6" stroke-linecap="round" opacity=".6"/>` + P(`M${k === 'cepe' ? 14 : 16},28.6 q1.2,1.8 0,2.6 q-1.2,-0.8 0,-2.6 Z`, FRUITS[k].jus, 0.5);
  if (m < 1) s = `<g transform="translate(16 18) scale(${f(0.55 + 0.45 * m)}) translate(-16 -18)">${s}</g>`;
  return s;
}
// le fruit mûr qui brille (SMIL) ; le trop mûr qui tremble (SMIL)
const brille = (x, y, r, dur, begin) => `<g opacity="0" transform="translate(${x} ${y})">${etoile(0, 0, r)}<animate attributeName="opacity" values="0;1;0;0" keyTimes="0;0.12;0.26;1" dur="${dur}s" begin="${begin}s" repeatCount="indefinite"/></g>`;
const fruitMur = k => `<g><animateTransform attributeName="transform" type="translate" values="0 0;0 -0.6;0 0" dur="1.6s" repeatCount="indefinite"/>${fruit(k)}</g>` + brille(9, 9, 2.6, 2, 0) + brille(24, 14, 1.8, 2, 0.9) + (k === 'cepe' ? `<circle cx="16" cy="17" r="15" fill="#FFF0B8" opacity=".25"><animate attributeName="opacity" values=".1;.35;.1" dur="1.4s" repeatCount="indefinite"/></circle>` : '');
const fruitTard = k => `<g><animateTransform attributeName="transform" type="rotate" values="-6 16 6;6 16 6;-6 16 6" dur="0.44s" repeatCount="indefinite"/>${fruit(k, 1, true)}</g>`;
// il mûrit (3 images) : vert et petit, il grossit, il rougit d'un coup avec un petit « pop »
const murit = (k, i) => i < 2 ? fruit(k, [0.2, 0.6][i]) : fruit(k) + [0, 1, 2, 3, 4, 5].map(j => { const a = j * Math.PI / 3; return `<path d="M${f(16 + Math.cos(a) * 12)},${f(17 + Math.sin(a) * 12)} L${f(16 + Math.cos(a) * 15)},${f(17 + Math.sin(a) * 15)}" stroke="#FFF6C8" stroke-width="1.4" stroke-linecap="round"/>`; }).join('');
// il tombe (3 images) : il se décroche, tombe en tournant, rebondit et s'écrase un peu
function tombe(k, i) {
  const dy = [1, 4, 6][i], rot = [14, 40, 0][i], sx = i === 2 ? 1.2 : 1, sy = i === 2 ? 0.75 : 1;
  return `<g transform="translate(16 ${30 + dy - 6}) rotate(${rot}) scale(${f(0.72 * sx)} ${f(0.72 * sy)}) translate(-16 -28)" opacity="${[1, 0.95, 0.75][i]}">${fruit(k, 1, true)}</g>` + (i === 2 ? E(16, 30.4, 6, 1.2, FRUITS[k].jus).replace('/>', ' opacity=".7"/>') : '');
}
// on le cueille (4 images) : il saute hors du buisson, le jus gicle en couronne, des étoiles, il file vers le panier
function cueilli(k, i) {
  const c = FRUITS[k], t = (i + 1) / 4;
  let s = '';
  for (let j = 0; j < 8; j++) { const a = j * Math.PI / 4 + 0.4, d = 5 + t * 12; s += `<circle cx="${f(16 + Math.cos(a) * d)}" cy="${f(17 + Math.sin(a) * d + t * t * 4)}" r="${f(1.8 * (1 - t * 0.6))}" fill="${c.jus}" stroke="${OUT}" stroke-width="0.4" opacity="${f(1 - t * 0.7)}"/>`; }
  if (i < 3) s += `<g transform="translate(16 ${f(17 - [2, 8, 16][i])}) scale(${[1.15, 1, 0.75][i]}) translate(-16 -17)">${fruit(k)}</g>`;
  s += etoile(f(6 + i), f(8 - i), [2.6, 2, 1.4, 0.8][i]) + etoile(f(26 - i), f(10 - i * 0.6), [1.8, 2.4, 1.6, 1][i]);
  return s;
}

// ——— les guêpes (cadre 32 × 32, SMIL : trois guêpes qui tournent autour d'un petit nid) ———
const guepe = (s = 1) => `<g transform="scale(${s})">${P('M-3.4,0 Q-3.4,-2.6 0,-2.6 Q3.4,-2.6 3.8,0 Q3.4,2.6 0,2.6 Q-3.4,2.6 -3.4,0 Z', '#FFD24A', 0.7)}<path d="M-1.2,-2.5 L-1.2,2.5 M1,-2.5 L1,2.5" stroke="${OUT}" stroke-width="1"/>${P('M3.6,0 L5.2,0', 'none', 0.8)}${E(-3.2, -0.4, 1.2, 1.4, OUT)}${E(-3.5, -0.8, 0.4, 0.4, WHITE)}<ellipse cx="-0.6" cy="-3.6" rx="2.2" ry="1.2" fill="#E8F4FF" fill-opacity=".85" stroke="${OUT}" stroke-width="0.5"><animate attributeName="ry" values="1.2;0.4;1.2" dur="0.08s" repeatCount="indefinite"/></ellipse><ellipse cx="1.2" cy="-3.4" rx="1.8" ry="1" fill="#E8F4FF" fill-opacity=".85" stroke="${OUT}" stroke-width="0.5"><animate attributeName="ry" values="0.4;1;0.4" dur="0.08s" repeatCount="indefinite"/></ellipse></g>`;
const nid = () => P('M10,10 Q16,6 22,10 Q25,16 22,22 Q16,26 10,22 Q7,16 10,10 Z', '#C8B490', 1) + `<path d="M9,14 Q16,12 23,14 M8.6,18 Q16,16 23.4,18 M10,21.6 Q16,20 22,21.6" fill="none" stroke="#9A8460" stroke-width="0.7"/>` + E(16, 19, 1.8, 2, '#4A3A28', 0.6) + P('M16,6.6 L16,3', 'none', 1);
function guepes(fige = false) {
  let s = nid();
  [[0, 11, 0.9], [1.4, 9, 0.75], [0.7, 13, 0.8]].forEach(([off, r, sc], i) => {
    const dur = 1.6 + i * 0.3;
    s += fige ? `<g transform="translate(${f(16 + Math.cos(off * 2) * r)} ${f(16 + Math.sin(off * 2) * r * 0.7)})">${guepe(sc)}</g>`
      : `<g><animateMotion dur="${dur}s" repeatCount="indefinite" begin="${-off}s" path="M${16 + r},16 A${r},${f(r * 0.7)} 0 1 1 ${16 - r},16 A${r},${f(r * 0.7)} 0 1 1 ${16 + r},16"/><g>${guepe(sc)}<animateTransform attributeName="transform" type="translate" values="0 0;0 -1;0 0" dur="0.3s" repeatCount="indefinite"/></g></g>`;
  });
  return s;
}
// la piqûre (3 images) : un éclair rouge, des étoiles qui tournent, une petite bosse
function pique(i) {
  let s = '';
  if (i === 0) s += P('M16,4 L19,12 L27,12 L20.6,17 L23,25 L16,20 L9,25 L11.4,17 L5,12 L13,12 Z', '#FF6A5A', 0.9).replace('/>', ' opacity=".85"/>');
  s += [0, 1, 2].map(j => { const a = j * 2.1 + i * 0.8; return etoile(16 + Math.cos(a) * 9, 10 + Math.sin(a) * 3, 2.4, '#FFE07A'); }).join('');
  if (i > 0) s += `<circle cx="16" cy="20" r="${2 + i}" fill="#FF8A8A" stroke="${OUT}" stroke-width="0.6"/>` + E(15, 19, 0.8, 0.6, WHITE);
  return s;
}
// ——— le panier (cadre 32 × 32) : vide, à moitié, plein ———
function panier(n) {
  let s = `<path d="M7,14 Q16,1 25,14" fill="none" stroke="${OUT}" stroke-width="2.6" stroke-linecap="round"/><path d="M7,14 Q16,1 25,14" fill="none" stroke="#C8925A" stroke-width="1.2" stroke-linecap="round"/>`;
  if (n > 0) s += `<g transform="translate(4 3) scale(0.42)">${fruit('fraise')}</g><g transform="translate(13 2) scale(0.42)">${fruit('myrtille')}</g>` + (n > 1 ? `<g transform="translate(8 -1) scale(0.42)">${fruit('mure')}</g><g transform="translate(16 -2) scale(0.4)">${fruit('cepe')}</g>` : '');
  s += P('M4,14 L28,14 L25,27 Q16,29 7,27 Z', '#C8925A', 1);
  for (const y of [17.4, 21, 24.4]) s += `<path d="M5,${y} Q16,${y + 1.6} 27,${y}" fill="none" stroke="#9A6A3A" stroke-width="0.8"/>`;
  for (let x = 8; x < 26; x += 3.6) s += `<path d="M${x},14.4 L${f(x - 0.6)},27" stroke="#E2B07A" stroke-width="0.6" opacity=".7"/>`;
  return s + P('M3.4,13 L28.6,13 L28.6,15.4 L3.4,15.4 Z', '#A87A48', 0.9);
}

// ——— les pièces : { id (le fichier), nom, cadre, dessin, suite, ms par image, boucle } ———
const PIECES = [];
const piece = (id, nom, cadre, dessin, suite = null, ms = null, boucle = false) => PIECES.push({ id, nom, cadre, dessin, suite, ms, boucle });
const B = [0, 0, 60, 60], F = [0, 0, 32, 32];
const LA = { mure: 'La mûre', fraise: 'La fraise', myrtille: 'La myrtille', cepe: 'Le cèpe' };
piece('buisson', 'Le buisson (il respire, en boucle)', B, buissonVivant);
for (let k = 1; k <= 3; k++) piece(`buisson-secoue_${k}`, 'Le buisson secoué (on cueille)', B, () => buisson(k), 'buisson-secoue', 110);
piece('buisson_vide', 'Le buisson vide', B, () => buisson(0, true));
for (const k of Object.keys(FRUITS)) {
  const e = k === 'cepe' ? '' : 'e';
  piece(`${k}_mur`, `${LA[k]} à point (${k === 'cepe' ? 'il luit' : 'elle brille'}, en boucle)`, F, () => fruitMur(k));
  piece(`${k}_trop-mur`, `${LA[k]} trop mûr${e} (${k === 'cepe' ? 'il' : 'elle'} tremble, en boucle)`, F, () => fruitTard(k));
  for (let i = 0; i < 3; i++) piece(`murit-${k}_${i + 1}`, `${LA[k]} qui mûrit`, F, () => murit(k, i), `murit-${k}`, 160);
  for (let i = 0; i < 3; i++) piece(`tombe-${k}_${i + 1}`, `${LA[k]} qui tombe`, F, () => tombe(k, i), `tombe-${k}`, 130);
  for (let i = 0; i < 4; i++) piece(`cueilli-${k}_${i + 1}`, `${LA[k]} cueilli${e} (le jus gicle)`, F, () => cueilli(k, i), `cueilli-${k}`, 90);
}
piece('guepes', 'Les guêpes autour de leur nid (en boucle)', F, () => guepes(false));
for (let i = 0; i < 3; i++) piece(`piqure_${i + 1}`, 'La piqûre', F, () => pique(i), 'piqure', 140);
for (const [n, nom] of [[0, 'vide'], [1, 'a-moitie'], [2, 'plein']]) piece(`panier_${nom}`, `Le panier, ${['vide', 'à moitié', 'plein'][n]}`, F, () => panier(n));

const TITRE = 'La Cueillette (le Bosquet)', FOND = '#B8D89A';
const LISEZ_MOI = 'La Cueillette : le buisson a un cadre de 60 × 60 (le bouton) ; un fruit, les guêpes, la piqûre et le panier un cadre de 32 × 32, à poser au milieu du buisson. Boucles animées dans le SVG (SMIL) : le buisson, le fruit mûr, le fruit trop mûr, les guêpes. Suites d\'images à enchaîner une fois : le buisson secoué, le fruit qui mûrit, qui tombe, qu\'on cueille, la piqûre.';
module.exports = { FRUITS, PIECES, TITRE, FOND, LISEZ_MOI, buisson, buissonVivant, fruit, fruitMur, fruitTard, murit, tombe, cueilli, guepes, pique, panier };
