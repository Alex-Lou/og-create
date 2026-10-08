// Mini-jeux — le Filon, améliorations : la paroi selon la profondeur (le fond derrière les blocs, qui se répète ; la crête
// d'herbe et de racines en haut ; des cristaux qui luisent au fond), les pioches de bois et d'or et leur coup (celle de
// fer est la pioche du Filon), les nouvelles trouvailles (fossiles, objets des Anciens), l'écran de bilan (le coffret
// qui se remplit, les étoiles). Mêmes règles que le Filon : boucles en SMIL, coups en suites d'images, fichiers × 4.
const FI = require('./minijeu_filon');
const OUT = '#3C2819', WHITE = '#FFFFFF';
const f = n => Math.round(n * 100) / 100;
const st = w => ` stroke="${OUT}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
const P = (d, fill, w = 1) => `<path d="${d}" fill="${fill}"${w ? st(w) : ''}/>`;
const E = (x, y, rx, ry, fill, w = 0) => `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(rx)}" ry="${f(ry)}" fill="${fill}"${w ? st(w) : ''}/>`;
const rnd = s => { let x = s; return () => (x = (x * 16807) % 2147483647) / 2147483647; };
const etoile = (x, y, r, fill = '#FFFBE8') => `<path d="M${f(x)},${f(y - r)} Q${f(x + r * 0.16)},${f(y - r * 0.16)} ${f(x + r)},${f(y)} Q${f(x + r * 0.16)},${f(y + r * 0.16)} ${f(x)},${f(y + r)} Q${f(x - r * 0.16)},${f(y + r * 0.16)} ${f(x - r)},${f(y)} Q${f(x - r * 0.16)},${f(y - r * 0.16)} ${f(x)},${f(y - r)} Z" fill="${fill}"/>`;
const brille = (x, y, r, dur, begin) => `<g opacity="0" transform="translate(${x} ${y})">${etoile(0, 0, r)}<animate attributeName="opacity" values="0;1;0;0" keyTimes="0;0.15;0.3;1" dur="${dur}s" begin="${begin}s" repeatCount="indefinite"/></g>`;
const L = (d, c, w, extra = '') => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"${extra}/>`;
const lin = (id, stops, x2 = 0, y2 = 1) => `<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}">${stops.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join('')}</linearGradient>`;
const rad = (id, stops, cx = 0.4, cy = 0.35, r = 0.75) => `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}">${stops.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join('')}</radialGradient>`;

// ——— la paroi : un fond de 48 × 48 qui se répète, selon la profondeur ———
const COUCHES = {
  surface: { haut: '#8A6A48', bas: '#6E5238', strate: '#A88A64', nom: 'en surface : terre et racines' },
  milieu: { haut: '#6A645C', bas: '#4E4944', strate: '#8A847A', nom: 'au milieu : roche à strates' },
  profond: { haut: '#3E3A4A', bas: '#2A2734', strate: '#5A5670', nom: 'tout au fond : roche sombre et cristaux' }
};
function fond(c, anim = true) {
  const k = COUCHES[c], g = rnd(c.length * 31 + 7);
  let s = `<defs><linearGradient id="fp${c}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${k.haut}"/><stop offset="1" stop-color="${k.bas}"/></linearGradient></defs><rect x="0" y="0" width="48" height="48" fill="url(#fp${c})"/>`;
  // strates ondulées qui se raccordent d'un carreau à l'autre (période 48)
  for (const y of [9, 21, 34, 44]) s += `<path d="M0,${y} q6,-1.6 12,0 t12,0 t12,0 t12,0" fill="none" stroke="${k.strate}" stroke-width="1" opacity=".5"/>`;
  for (let i = 0; i < 10; i++) s += E(2 + g() * 44, 2 + g() * 44, 0.6 + g() * 1.2, 0.4 + g() * 0.8, k.strate).replace('/>', ' opacity=".55"/>');
  if (c === 'surface') for (const [x, y, l] of [[6, 2, 14], [30, 6, 10], [42, 0, 18]]) s += `<path d="M${x},${y} q2,${f(l / 2)} -1,${l} q-1,3 1,5" fill="none" stroke="#C8A070" stroke-width="1.1" stroke-linecap="round" opacity=".8"/><path d="M${x},${f(y + l / 2)} l3,2" stroke="#C8A070" stroke-width="0.7" opacity=".7"/>`;
  if (c === 'milieu') s += [[10, 28], [36, 14]].map(([x, y]) => P(`M${x - 3},${y + 2} L${x - 1},${y - 2} L${x + 2},${y - 1} L${x + 3},${y + 2} Z`, '#7E786E', 0.6)).join('');
  if (c === 'profond') {
    for (const [x, y, col] of [[12, 30, '#9A7AE8'], [38, 12, '#6AC8E8'], [30, 40, '#E87AB0']]) {
      s += `<g transform="translate(${x} ${y})">${P('M-2,2 L-2,-2 L0,-4 L2,-2 L2,2 Z', col, 0.6)}${P('M2,2 L4,-1 L5,1 L4,3 Z', col, 0.5)}<path d="M-1.2,-1.6 L-1.2,1.4" stroke="${WHITE}" stroke-width="0.5" opacity=".8"/></g>`;
      s += `<circle cx="${x}" cy="${y}" r="6" fill="${col}" opacity=".18">${anim ? `<animate attributeName="opacity" values=".08;.3;.08" dur="${f(1.8 + x / 30)}s" repeatCount="indefinite"/>` : ''}</circle>`;
    }
  }
  return s;
}
// la crête en haut de la paroi (48 × 14, se répète en largeur) : herbe, fleurs, racines qui pendent
function crete() {
  let s = `<path d="M0,6 Q6,3.6 12,5.4 T24,5.4 T36,5.4 T48,6 L48,14 L0,14 Z" fill="#8A6A48"/><path d="M0,6 Q6,3.6 12,5.4 T24,5.4 T36,5.4 T48,6" fill="none"${st(0.9)}/>`;
  for (let x = 1; x < 48; x += 2.6) s += `<path d="M${f(x)},${f(5.6)} q${f(0.6 + (x % 3) * 0.2)},-3 ${f(1.4)},-${f(3.4 + (x % 5) * 0.4)}" fill="none" stroke="#5FA548" stroke-width="1.2" stroke-linecap="round"/>`;
  s += [[8, 2.4, '#FFF4F0'], [27, 2, '#F2C04B'], [41, 2.6, '#F7A6C0']].map(([x, y, c]) => [0, 1, 2, 3, 4].map(i => { const a = i * 1.257; return E(x + Math.cos(a) * 0.9, y + Math.sin(a) * 0.9, 0.7, 0.7, c); }).join('') + E(x, y, 0.5, 0.5, '#E2A030')).join('');
  for (const [x, l] of [[5, 6], [19, 4], [33, 7], [45, 5]]) s += `<path d="M${x},8 q-1,${f(l / 2)} 0.6,${l}" fill="none" stroke="#C8A070" stroke-width="0.9" stroke-linecap="round"/>`;
  return s;
}

// ——— les pioches : bois, fer, or (3 images chacune : levée, l'élan, le coup) ———
const METAUX = {
  bois: { tete: '#C8925A', clair: '#E8C090', manche: '#A8804A', nom: 'de bois' },
  fer: { tete: '#A8B0BA', clair: '#E2E8EE', manche: '#B07A4A', nom: 'de fer' },
  or: { tete: '#F2C94C', clair: '#FFF2B8', manche: '#8A4A2A', nom: 'd\'or' }
};
function pioche(m, k) {
  const c = METAUX[m], ang = [-55, -20, 12][k];
  const tete = 'M-9,-1.6 Q0,-5 9,-1.6 Q9.6,-0.8 8.6,-0.4 Q0,-2.6 -8.6,-0.4 Q-9.6,-0.8 -9,-1.6 Z';
  let s = `<g transform="translate(24 27) rotate(${ang})"><rect x="-1.2" y="-18" width="2.4" height="19" rx="1.1" fill="${c.manche}"${st(0.8)}/><rect x="-0.5" y="-17" width="0.7" height="16" rx="0.35" fill="${WHITE}" opacity=".3"/>`;
  if (m === 'or') s += `<rect x="-1.5" y="-6" width="3" height="2" rx="0.5" fill="#F2C94C"${st(0.5)}/>`;
  s += `<g transform="translate(0 -18)">${P(tete, c.tete, 0.8)}<path d="M-7,-1.6 Q0,-3.8 7,-1.6" fill="none" stroke="${c.clair}" stroke-width="0.6"/>${m === 'or' ? E(0, -1.8, 1.4, 1.2, '#E8504A', 0.5) : E(0, -1.6, 1.6, 1.2, '#8A6A4A', 0.6)}</g></g>`;
  if (k === 1) s += `<path d="M6,6 Q2,14 6,22" fill="none" stroke="${m === 'or' ? '#FFE07A' : WHITE}" stroke-width="1.6" stroke-linecap="round" opacity=".7"/>`;
  if (m === 'or' && k !== 1) s += etoile(k ? 8 : 14, k ? 10 : 4, 1.8);
  return s;
}
// le coup de chaque pioche (3 images, cadre 48 × 48) : copeaux de bois ; étincelles (fer, celles du Filon) ; or : pluie
// d'étincelles dorées et d'étoiles
function coup(m, k) {
  const t = (k + 1) / 3;
  if (m === 'fer') return FI.etincelles(k, true);
  let s = '';
  if (m === 'bois') for (let i = 0; i < 6; i++) { const a = -Math.PI / 2 + (i - 2.5) * 0.5, d = 4 + t * 14; s += `<g transform="translate(${f(16 + Math.cos(a) * d)} ${f(13 + Math.sin(a) * d + t * t * 6)}) rotate(${f(i * 60 + t * 120)}) scale(1.9)" opacity="${f(1 - t * 0.6)}">${P('M-1.6,-0.6 Q0,-1.4 1.6,-0.6 Q0,0.6 -1.6,-0.6 Z', '#E8C090', 0.4)}</g>`; }
  if (m === 'or') { for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (i - 4.5) * 0.3, d = 2 + t * 14; s += etoile(16 + Math.cos(a) * d, 13 + Math.sin(a) * d + t * t * 4, f(1.8 * (1 - t * 0.5)), i % 2 ? '#FFE07A' : '#FFFBE8'); } if (k === 0) s += `<circle cx="16" cy="13" r="4" fill="#FFF2B8" opacity=".9"/>`; }
  return s;
}

// ——— les nouvelles trouvailles (HD, 32 × 32) ———
const TROUVAILLES = {
  ammonite: { nom: 'ammonite (fossile)', eclat: '#F2E0C0' },
  arete: { nom: 'arête de poisson (fossile)', eclat: '#F4ECD8' },
  coquillage: { nom: 'coquillage ancien', eclat: '#FFE0D8' },
  rune: { nom: 'pierre runique (des Anciens)', eclat: '#B8F0EA' },
  cle: { nom: 'clé des Anciens', eclat: '#FFF0B8' },
  piece: { nom: 'pièce des Anciens', eclat: '#FFF0B8' }
};
function trouvaille(k) {
  switch (k) {
    case 'ammonite': { let d = 'M16,16'; for (let i = 1; i <= 40; i++) { const a = i * 0.32, r = 0.4 + i * 0.27; d += ` L${f(16 + Math.cos(a) * r)},${f(16 + Math.sin(a) * r)}`; } return P('M16,4.6 A11.4,11.4 0 1 1 15.9,4.6 Z', '#D8C4A0', 1) + `<path d="${d}" fill="none" stroke="#A88A60" stroke-width="1.1" stroke-linecap="round"/>` + [0, 1, 2, 3, 4, 5, 6, 7].map(i => { const a = i * 0.785; return `<path d="M${f(16 + Math.cos(a) * 8)},${f(16 + Math.sin(a) * 8)} L${f(16 + Math.cos(a) * 11)},${f(16 + Math.sin(a) * 11)}" stroke="#B8A07A" stroke-width="0.6"/>`; }).join('') + `<path d="M8.4,10 Q10.6,7 14,6" fill="none" stroke="${WHITE}" stroke-width="1.2" stroke-linecap="round" opacity=".6"/>`; }
    case 'arete': return `<g transform="translate(16 16) scale(0.88) translate(-16 -16)">` + P('M3,16 Q8,12 24,14 Q29,15 29.6,16 Q29,17 24,18 Q8,20 3,16 Z', '#C8B490', 1) + `<path d="M5,16 L27,16" stroke="#8A7650" stroke-width="1.1"/>` + [8, 11, 14, 17, 20, 23].map(x => `<path d="M${x},16 Q${x + 1.4},12.6 ${x + 2.6},11 M${x},16 Q${x + 1.4},19.4 ${x + 2.6},21" fill="none" stroke="#F4ECD8" stroke-width="1.1" stroke-linecap="round"/><path d="M${x},16 Q${x + 1.4},12.6 ${x + 2.6},11 M${x},16 Q${x + 1.4},19.4 ${x + 2.6},21" fill="none" stroke="#8A7650" stroke-width="0.4" stroke-linecap="round"/>`).join('') + E(26.4, 15.2, 1.1, 1.1, '#5A4A30') + P('M3,16 L0.6,12.6 L1.4,16 L0.6,19.4 Z', '#C8B490', 0.7) + '</g>';
    case 'coquillage': return P('M16,27 Q4,22 4.6,12 Q6,5.6 16,5 Q26,5.6 27.4,12 Q28,22 16,27 Z', '#F4C6B4', 1) + [-8, -4.6, -1.6, 1.6, 4.6, 8].map(dx => `<path d="M16,26 Q${16 + dx * 1.1},16 ${16 + dx * 1.3},6.6" fill="none" stroke="#D8907E" stroke-width="0.8"/>`).join('') + P('M12,27 L20,27 L18.6,29.4 L13.4,29.4 Z', '#E8A898', 0.8) + `<path d="M8,11 Q10,7.6 14,6.6" fill="none" stroke="${WHITE}" stroke-width="1.2" stroke-linecap="round" opacity=".7"/>`;
    case 'rune': return P('M8,28 Q5,16 9,7 Q16,3.6 23,7 Q27,16 24,28 Q16,30 8,28 Z', '#8A8A9A', 1) + P('M10,26 Q8,16 11,9 Q16,6.4 21,9 Q24,16 22,26 Q16,27.6 10,26 Z', '#9E9EAE', 0) + `<path d="M16,10 L16,24 M16,14 L20,11 M16,18 L12,15 M13,22 L19,22" fill="none" stroke="#4FC8C0" stroke-width="1.6" stroke-linecap="round"/>` + `<path d="M16,10 L16,24 M16,14 L20,11 M16,18 L12,15 M13,22 L19,22" fill="none" stroke="#B8F0EA" stroke-width="0.6" stroke-linecap="round"/>`;
    case 'cle': return `<g transform="translate(16 16) scale(0.82) rotate(-35) translate(-16 -16)">${E(16, 8, 5.4, 5.4, '#E2B44E', 1)}${E(16, 8, 2.4, 2.4, '#5A3A24', 0.8)}${P('M14.6,12.6 L17.4,12.6 L17.4,26 L14.6,26 Z', '#E2B44E', 1)}${P('M17.4,20 L21,20 L21,22.4 L17.4,22.4 Z M17.4,24 L20,24 L20,26 L17.4,26 Z', '#E2B44E', 0.8)}<path d="M12.6,5.6 Q14,4 16,3.8" fill="none" stroke="#FFF2B8" stroke-width="1" stroke-linecap="round"/>${E(16, 8, 0.8, 0.8, '#4FC8C0')}</g>`;
    case 'piece': return E(16, 17, 11, 10.4, '#C8962A', 1) + E(16, 16, 11, 10.4, '#F2C94C', 1) + E(16, 16, 8, 7.6, 'none').replace('fill="none"', 'fill="none" stroke="#C8962A" stroke-width="0.8"') + `<path d="M10,16 Q11,11 16,11 Q21,11 22,16 Q18,15 16,19 Q14,15 10,16 Z" fill="#E2A030" stroke="#B8862A" stroke-width="0.6"/>` + E(16, 13.6, 0.9, 0.9, '#4FC8C0') + `<path d="M9,10.6 Q11,8 14,7.4" fill="none" stroke="${WHITE}" stroke-width="1.1" stroke-linecap="round" opacity=".8"/>`;
  }
  return '';
}
const trouvailleAnimee = k => trouvaille(k) + brille(9, 9, 2.4, 2.6, 0) + brille(24, 20, 1.6, 2.6, 1.2);
// la trouvaille qui apparaît (4 images), sur le modèle des pierres : elle monte du trou, des rayons de sa couleur
function apparait(k, i) {
  const c = TROUVAILLES[k], sc = [0.35, 1.18, 0.96, 1][i], dy = [5, -2, 0.5, 0][i], ray = [0.5, 1, 0.7, 0.35][i];
  let s = '';
  for (let j = 0; j < 8; j++) { const a = j * Math.PI / 4 + i * 0.12, l = 9 + ray * 6; s += `<path d="M${f(16 + Math.cos(a - 0.1) * 5)},${f(16 + Math.sin(a - 0.1) * 5)} L${f(16 + Math.cos(a) * l)},${f(16 + Math.sin(a) * l)} L${f(16 + Math.cos(a + 0.1) * 5)},${f(16 + Math.sin(a + 0.1) * 5)} Z" fill="${c.eclat}" opacity="${f(0.55 * ray)}"/>`; }
  return s + `<g transform="translate(16 ${f(16 + dy)}) scale(${sc}) translate(-16 -16)">${trouvaille(k)}</g>` + (i === 1 ? etoile(25, 6, 2.4) : '');
}

// ——— l'écran de bilan : le coffret (64 × 48) qui se remplit, les étoiles (32 × 32) ———
// le coffret du bilan : un écrin ouvert, couvercle capitonné de velours, quatre alvéoles bordées d'or sur un plateau de
// velours ; les pierres y sont nichées (le bord de l'alvéole passe devant elles)
const ALV = [11.6, 25.2, 38.8, 52.4]; // les centres des quatre alvéoles
function coffret(n, anim = true) {
  const p = `cf${n}`;
  let s = `<defs>${lin(p + 'b', [[0, '#D89A60'], [0.5, '#B07A4A'], [1, '#7E5230']])}${lin(p + 'c', [[0, '#9A6440'], [1, '#6A3E22']])}${rad(p + 'v', [[0, '#B85068'], [0.6, '#8A3A4A'], [1, '#5A2030']], 0.5, 0.3, 0.8)}${lin(p + 'o', [[0, '#FFF2B8'], [0.5, '#F2C94C'], [1, '#B8862A']])}${rad(p + 'a', [[0, '#3A0E1A'], [0.7, '#5A2030'], [1, '#8A3A4A']], 0.5, 0.35, 0.7)}</defs>`;
  // l'ombre au sol
  s += E(32, 45.6, 29, 2.2, 'rgba(60,40,20,.22)');
  // le couvercle ouvert, derrière : le bois, puis la doublure de velours capitonnée, son galon d'or
  s += P('M5,22 L9,4.4 Q32,0.4 55,4.4 L59,22 Z', `url(#${p}c)`, 1.1);
  s += P('M9.4,21 L12.4,7.6 Q32,4.4 51.6,7.6 L54.6,21 Z', `url(#${p}v)`, 0.8) + L('M12.4,7.6 Q32,4.4 51.6,7.6', `url(#${p}o)`, 1.1);
  // le capiton : un quadrillage en losanges, piqué d'un bouton à chaque croisement
  s += `<defs><clipPath id="${p}q"><path d="M9.4,21 L12.4,7.6 Q32,4.4 51.6,7.6 L54.6,21 Z"/></clipPath></defs><g clip-path="url(#${p}q)">`;
  for (let k = -4; k <= 8; k++) s += L(`M${f(k * 7)},24 L${f(k * 7 + 16)},2 M${f(k * 7 + 16)},24 L${f(k * 7)},2`, '#5A2030', 0.45, ' opacity=".55"');
  for (let r = 0; r < 3; r++) for (let c = 0; c < 9; c++) { const x = 4 + c * 7 + (r % 2) * 3.5, y = 23.2 - r * 7.3 - 2.6; s += E(x, y, 0.75, 0.7, '#E890A8', 0.3); }
  s += '</g>' + L('M12.4,7.6 Q32,4.4 51.6,7.6', `url(#${p}o)`, 1.1);
  s += L('M10,6.4 Q32,1.8 54,6.4', '#C8925A', 0.8, ' opacity=".8"');
  // le plateau de velours, vu un peu d'en haut, et ses quatre alvéoles bordées d'or
  s += P('M3,20.6 L61,20.6 L59.4,30.4 L4.6,30.4 Z', `url(#${p}v)`, 1);
  for (const x of ALV) s += E(x, 26.2, 6, 3.3, `url(#${p}o)`, 0.6) + E(x, 26.4, 4.9, 2.5, `url(#${p}a)`);
  // les pierres, nichées : on voit leur haut au-dessus du bord de l'alvéole ; le bord avant d'or passe devant
  const gem = ['quartz', 'amethyste', 'rubis', 'diamant'];
  for (let i = 0; i < n; i++) {
    const x = ALV[i];
    s += `<defs><clipPath id="${p}k${i}"><path d="M${x - 7},-2 L${x + 7},-2 L${x + 7},26.6 Q${x},29.8 ${x - 7},26.6 Z"/></clipPath></defs>`;
    s += `<g clip-path="url(#${p}k${i})"><g transform="translate(${x} 27.6) scale(0.5) translate(-16 -27)">${FI.gemme(gem[i], `${p}g${i}`)}</g></g>`;
    s += E(x, 27.8, 5.2, 1.2, 'rgba(40,10,20,.35)');
    s += `<path d="M${x - 6},26.2 Q${x},30.4 ${x + 6},26.2" fill="none" stroke="${OUT}" stroke-width="0.6"/><path d="M${x - 5.5},26.5 Q${x},29.8 ${x + 5.5},26.5" fill="none" stroke="#FFE8A0" stroke-width="1"/>`;
    s += anim ? brille(x + 4, 15.6 - (i % 2) * 2, 2, 2.2, i * 0.5) : etoile(x + 4, 15.6 - (i % 2) * 2, 2);
  }
  // la caisse : la face bombée en bois veiné, le rebord d'or, les coins ferrés, l'écusson au centre
  s += P('M3,30 L61,30 L59.6,42.6 Q32,45.6 4.4,42.6 Z', `url(#${p}b)`, 1.1);
  s += L('M6,35 q3,-0.8 6,0 t6,0 t6,0 M38,37.6 q3,-0.8 6,0 t6,0 t6,0 M8,40.6 q3,-0.6 6,0 t6,0', '#8A5A32', 0.5, ' opacity=".7"');
  s += P('M2.6,29 L61.4,29 L61.2,32 L2.8,32 Z', `url(#${p}o)`, 0.8) + L('M4,29.9 L60,29.9', '#FFFBE0', 0.6, ' opacity=".8"');
  for (const [x, sx] of [[4.4, 1], [59.6, -1]]) s += `<g transform="translate(${x} 42.4) scale(${sx} 1)">${P('M0,0 L0,-5 Q0.6,-1 5,0.6 Q2,1.8 0,0 Z', `url(#${p}o)`, 0.6)}${E(1, -1, 0.5, 0.5, '#FFFBE0')}</g>`;
  s += `<g transform="translate(32 37.4)">${P('M-5.6,-4 L5.6,-4 L5.6,1 Q5.6,4.4 0,6.4 Q-5.6,4.4 -5.6,1 Z', `url(#${p}o)`, 0.8)}${P('M0,-2.4 L2.4,0.6 L0,3.6 L-2.4,0.6 Z', '#E8506A', 0.5)}${E(-0.7, -0.4, 0.6, 0.4, WHITE)}</g>`;
  return s;
}
// une étoile du bilan : vide, ou gagnée (elle claque en 3 images)
const etoileBilan = (pleine, k = 2) => { const sc = [0.4, 1.12, 1][k]; const d = 'M16,3 L19.6,11.6 L29,12.4 L21.8,18.4 L24,27.6 L16,22.8 L8,27.6 L10.2,18.4 L3,12.4 L12.4,11.6 Z'; return pleine ? `<g transform="translate(16 16) scale(${sc}) translate(-16 -16)">${P(d, '#FFD24A', 1.1)}<path d="M12.4,11.6 L16,4.6" stroke="${WHITE}" stroke-width="1.2" stroke-linecap="round" opacity=".7"/></g>` + (k === 1 ? [0, 1, 2, 3, 4, 5].map(i => { const a = i * 1.047; return `<path d="M${f(16 + Math.cos(a) * 13)},${f(16 + Math.sin(a) * 13)} L${f(16 + Math.cos(a) * 15.6)},${f(16 + Math.sin(a) * 15.6)}" stroke="#FFE07A" stroke-width="1.4" stroke-linecap="round"/>`; }).join('') : '') : P(d, '#8A8478', 1).replace('/>', ' opacity=".55"/>'); };

// ——— les pièces (dans le dossier du Filon) : { id, nom, cadre, dessin, suite, ms par image, boucle } ———
const PIECES = [];
const piece = (id, nom, cadre, dessin, suite = null, ms = null, boucle = false) => PIECES.push({ id, nom, cadre, dessin, suite, ms, boucle });
const BLOC = [0, 0, 32, 32], LARGE = [-8, -8, 48, 48];
for (const c of Object.keys(COUCHES)) piece(`fond-${c}`, `Le fond de la paroi, ${COUCHES[c].nom} (se répète${c === 'profond' ? ' ; les cristaux luisent' : ''})`, [0, 0, 48, 48], () => fond(c));
piece('crete', 'La crête en haut de la paroi (se répète en largeur)', [0, 0, 48, 14], crete);
for (const m of ['bois', 'or']) {
  for (let k = 0; k < 3; k++) piece(`pioche-${m}_${k + 1}`, `La pioche ${METAUX[m].nom} (levée, l'élan, le coup)`, BLOC, () => pioche(m, k), `pioche-${m}`, 90);
  for (let k = 0; k < 3; k++) piece(`coup-${m}_${k + 1}`, `Le coup de la pioche ${METAUX[m].nom} (${m === 'bois' ? 'copeaux' : 'pluie d\'étoiles'})`, LARGE, () => coup(m, k), `coup-${m}`, 70);
}
for (const k of Object.keys(TROUVAILLES)) {
  const nom = TROUVAILLES[k].nom, Nom = nom[0].toUpperCase() + nom.slice(1);
  piece(k, `${Nom} (son éclat passe, en boucle)`, BLOC, () => trouvailleAnimee(k));
  for (let i = 0; i < 4; i++) piece(`apparition-${k}_${i + 1}`, `${Nom.replace(/ \(.*/, '')} qui apparaît`, BLOC, () => apparait(k, i), `apparition-${k}`, 110);
}
for (let n = 0; n <= 4; n++) piece(`coffret_${n}`, `Le coffret du bilan, ${n} pierre${n > 1 ? 's' : ''}${n ? ' (elles brillent, en boucle)' : ''}`, [0, 0, 64, 48], () => coffret(n));
piece('etoile_vide', 'Une étoile du bilan, vide', BLOC, () => etoileBilan(false));
for (let k = 0; k < 3; k++) piece(`etoile-gagnee_${k + 1}`, 'Une étoile du bilan gagnée (elle claque)', BLOC, () => etoileBilan(true, k), 'etoile-gagnee', 140);

module.exports = { COUCHES, METAUX, TROUVAILLES, PIECES, fond, crete, pioche, coup, trouvaille, trouvailleAnimee, apparait, coffret, etoileBilan };
