// Mini-jeux — le Filon (la Carrière) : la paroi qu'on creuse bloc par bloc. Chaque pièce a le cadre d'un bloc (32 × 32),
// les effets qui débordent du bloc un cadre de 48 × 48 centré sur lui ; les fichiers déclarent × 4. Les boucles (l'éclat
// d'une pierre, la lueur du filon, le signe ✦) sont animées en SMIL ; les effets d'un coup (le bloc qui éclate, la pioche,
// les étincelles, l'onde, la pierre qui apparaît, ses éclats de couleur) sont des suites d'images que le jeu enchaîne.
const OUT = '#3C2819', WHITE = '#FFFFFF';
const f = n => Math.round(n * 100) / 100;
const st = w => ` stroke="${OUT}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
const P = (d, fill, w = 1) => `<path d="${d}" fill="${fill}"${w ? st(w) : ''}/>`;
const E = (x, y, rx, ry, fill, w = 0) => `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(rx)}" ry="${f(ry)}" fill="${fill}"${w ? st(w) : ''}/>`;
const rnd = s => { let x = s; return () => (x = (x * 16807) % 2147483647) / 2147483647; };

// ——— les pierres de la paroi : trois duretés ———
const ROCHE = {
  1: { clair: '#E2D2B4', corps: '#C8B48E', ombre: '#A08A66', fonce: '#7A6648', grain: '#B09A74', nom: 'tendre (1 coup)' },
  2: { clair: '#C4BDB2', corps: '#A39A8E', ombre: '#7E766C', fonce: '#5C554D', grain: '#8E867A', nom: 'dur (2 coups)' },
  3: { clair: '#8E8C96', corps: '#6C6A76', ombre: '#4E4C58', fonce: '#36343E', grain: '#5A5866', nom: 'très dur (3 coups)' }
};
const FORME = 'M5,3 L27,3 Q29.5,3 29.5,5.5 L29.5,26.5 Q29.5,29 27,29 L5,29 Q2.5,29 2.5,26.5 L2.5,5.5 Q2.5,3 5,3 Z';
const defsRoche = (h, id) => { const r = ROCHE[h]; return `<defs><linearGradient id="${id}" x1="0" y1="0" x2=".4" y2="1"><stop offset="0" stop-color="${r.clair}"/><stop offset=".55" stop-color="${r.corps}"/><stop offset="1" stop-color="${r.ombre}"/></linearGradient><clipPath id="${id}c"><path d="${FORME}"/></clipPath></defs>`; };
function texture(h, id) {
  const r = ROCHE[h], g = rnd(h * 97 + 13);
  let s = '';
  // strates : deux ou trois lignes ondulées
  for (const y of [10.5, 17.5, 23.5].slice(0, h === 1 ? 2 : 3)) s += `<path d="M2,${f(y + g())} q4,-1.2 8,0 t8,0 t8,0 t8,0" fill="none" stroke="${r.ombre}" stroke-width="0.7" opacity=".55"/>`;
  // grains et petits cailloux
  for (let i = 0; i < 9; i++) s += E(4 + g() * 24, 6 + g() * 20, 0.5 + g() * 0.6, 0.4 + g() * 0.4, r.grain);
  for (let i = 0; i < 2; i++) { const x = 7 + g() * 18, y = 9 + g() * 14; s += E(x, y, 1.6, 1.1, r.clair, 0.5) + E(x - 0.5, y - 0.4, 0.5, 0.3, WHITE); }
  // très dure : paillettes de mica qui brillent ; dure : une veine claire
  if (h === 3) for (let i = 0; i < 6; i++) { const x = 5 + g() * 22, y = 6 + g() * 20; s += `<path d="M${f(x)},${f(y - 0.9)} L${f(x + 0.3)},${f(y)} L${f(x)},${f(y + 0.9)} L${f(x - 0.3)},${f(y)} Z" fill="#E8E4F4" opacity=".9"/>`; }
  if (h === 2) s += `<path d="M3,21 Q10,17 16,19 T29,14" fill="none" stroke="${r.clair}" stroke-width="1.1" opacity=".7"/>`;
  return `<g clip-path="url(#${id}c)">${s}</g>`;
}
// les fissures : 1 (un coup porté), 2 (deux coups) ; elles partent d'un point d'impact
const FISSURES = {
  1: 'M17,11 L15.4,14.2 L17.2,16 L15,19.6 M15.4,14.2 L12.4,13.2',
  2: 'M17,11 L15.4,14.2 L17.2,16 L15,19.6 L16.4,23.4 M15.4,14.2 L12.4,13.2 L9.6,15.4 M17.2,16 L21,15.2 L23.4,18 M15,19.6 L11.6,21.4 M17,11 L19.6,8.4 L22,9.2'
};
const fissures = n => n ? `<path d="${FISSURES[n]}" fill="none" stroke="${OUT}" stroke-width="1.1" stroke-linejoin="round" stroke-linecap="round"/><path d="${FISSURES[n]}" fill="none" stroke="${WHITE}" stroke-width="0.4" opacity=".45" transform="translate(0.5 0.5)"/>` : '';
function bloc(h, crack = 0, id = `r${h}${crack}`) {
  const r = ROCHE[h];
  return defsRoche(h, id) + `<path d="${FORME}" fill="url(#${id})"/>` + texture(h, id)
    + `<path d="M5.5,4.6 L26,4.6" stroke="${WHITE}" stroke-width="1.2" stroke-linecap="round" opacity=".5"/><path d="M4,27.6 L28,27.6" stroke="${r.fonce}" stroke-width="1.2" stroke-linecap="round" opacity=".4"/>`
    + `<path d="${FORME}" fill="none"${st(1.1)}/>` + fissures(crack);
}
// le trou laissé par un bloc cassé
const trou = id => `<defs><radialGradient id="${id}" cx=".5" cy=".38" r=".7"><stop offset="0" stop-color="#2E2824"/><stop offset="1" stop-color="#14100E"/></radialGradient></defs><path d="${FORME}" fill="url(#${id})"/><path d="M3.4,9 Q3,4 6,3.6 L26,3.6 Q29,4 28.6,9 Q22,6.4 16,6.4 Q10,6.4 3.4,9 Z" fill="#4A403A"/>${E(9, 25, 1.4, 0.7, '#3A322C')}${E(22, 26, 1, 0.5, '#3A322C')}<path d="${FORME}" fill="none"${st(1.1)}/>`;

// ——— le bloc qui éclate (4 images) : les morceaux s'écartent en tournant, la poussière gonfle puis retombe ———
const ECLATS = [['M3,3 L16,3 L14.5,13 L3,15 Z', -1, -1], ['M16,3 L29,3 L29,14 L17,15 L14.5,13 Z', 1, -1], ['M3,15 L14.5,13 L17,15 L14,29 L3,29 Z', -1, 1], ['M17,15 L29,14 L29,29 L14,29 Z', 1, 1]];
function eclate(h, k, id) {
  const r = ROCHE[h], t = (k + 1) / 4;
  let s = defsRoche(h, id);
  // la poussière : des boules qui gonflent et pâlissent
  const g = rnd(31);
  for (let i = 0; i < 7; i++) { const a = g() * 6.3, d = 4 + t * 9; s += E(16 + Math.cos(a) * d, 17 + Math.sin(a) * d * 0.7 + t * 2, 2.6 + t * 3, 2 + t * 2.4, '#D8CCB6').replace('/>', ` opacity="${f(0.75 * (1 - t * 0.85))}"/>`); }
  ECLATS.forEach(([d, sx, sy], i) => {
    const dx = sx * (2 + t * 9), dy = sy * (1 + t * 6) + t * t * 9, rot = sx * t * 50, o = 1 - Math.max(0, t - 0.5) * 1.6;
    s += `<g transform="translate(${f(dx)} ${f(dy)}) rotate(${f(rot)} 16 16)" opacity="${f(o)}"><path d="${d}" fill="url(#${id})"${st(0.9)}/></g>`;
  });
  // des petits cailloux qui sautent
  for (let i = 0; i < 6; i++) { const a = -Math.PI * (0.1 + 0.8 * i / 5), d = 6 + t * 12; s += E(16 + Math.cos(a) * d, 15 + Math.sin(a) * d + t * t * 14, 1, 0.8, r.ombre, 0.5).replace('/>', ` opacity="${f(1 - t * 0.7)}"/>`); }
  return s;
}

// ——— la pioche (3 images : levée, l'élan, le coup) ———
function pioche(k) {
  const ang = [-55, -20, 12][k];
  const tete = 'M-9,-1.6 Q0,-5 9,-1.6 Q9.6,-0.8 8.6,-0.4 Q0,-2.6 -8.6,-0.4 Q-9.6,-0.8 -9,-1.6 Z';
  let s = `<g transform="translate(24 27) rotate(${ang})">`
    + `<rect x="-1.2" y="-18" width="2.4" height="19" rx="1.1" fill="#B07A4A"${st(0.8)}/><rect x="-0.5" y="-17" width="0.7" height="16" rx="0.35" fill="#D8A878"/>`
    + `<g transform="translate(0 -18)">${P(tete, '#A8B0BA', 0.8)}<path d="M-7,-1.6 Q0,-3.8 7,-1.6" fill="none" stroke="#E2E8EE" stroke-width="0.6"/>${E(0, -1.6, 1.6, 1.2, '#8A6A4A', 0.6)}</g></g>`;
  if (k === 1) s += `<path d="M6,6 Q2,14 6,22" fill="none" stroke="${WHITE}" stroke-width="1.6" stroke-linecap="round" opacity=".7"/><path d="M9,4 Q4,13 8,23" fill="none" stroke="${WHITE}" stroke-width="0.8" stroke-linecap="round" opacity=".5"/>`;
  return s;
}

// ——— les étincelles d'un bloc dur (3 images) ———
function etincelles(k, fort) {
  const t = (k + 1) / 3, n = fort ? 9 : 6, g = rnd(7);
  let s = '';
  for (let i = 0; i < n; i++) {
    const a = -Math.PI / 2 + (g() - 0.5) * 2.6, l0 = 1.5 + t * 10, l1 = l0 + (fort ? 6 : 4.5) * (1 - t * 0.5);
    s += `<path d="M${f(16 + Math.cos(a) * l0)},${f(13 + Math.sin(a) * l0)} L${f(16 + Math.cos(a) * l1)},${f(13 + Math.sin(a) * l1)}" stroke="#FFD24A" stroke-width="${f(1.4 * (1 - t * 0.5))}" stroke-linecap="round" opacity="${f(1 - t * 0.6)}"/>`
      + `<circle cx="${f(16 + Math.cos(a) * l1)}" cy="${f(13 + Math.sin(a) * l1 + t * t * 3)}" r="${f(0.5 * (1 - t * 0.4))}" fill="#FFF6C8" opacity="${f(1 - t * 0.5)}"/>`;
  }
  if (k === 0) s += `<circle cx="16" cy="13" r="${fort ? 3.4 : 2.6}" fill="#FFF6C8" opacity=".9"/>`;
  return s;
}
// ——— l'onde qui part du bloc cassé (3 images) ———
const onde = k => { const t = (k + 1) / 3; return `<rect x="${f(16 - 8 - t * 7)}" y="${f(16 - 8 - t * 7)}" width="${f(16 + t * 14)}" height="${f(16 + t * 14)}" rx="${f(4 + t * 4)}" fill="none" stroke="#FFF0C8" stroke-width="${f(2.2 * (1 - t * 0.7))}" opacity="${f(0.85 * (1 - t * 0.8))}"/>`; };

// ——— les pierres précieuses (HD) ———
const GEMMES = {
  quartz: { clair: '#FFFFFF', corps: '#E4EEF4', ombre: '#A8C0CE', eclat: '#E8F4FF', nom: 'quartz' },
  amethyste: { clair: '#E8D4FF', corps: '#B07AE8', ombre: '#6E3EA8', eclat: '#D8B8FF', nom: 'améthyste' },
  rubis: { clair: '#FFC4C4', corps: '#E84A5A', ombre: '#A0202E', eclat: '#FF9AA8', nom: 'rubis' },
  diamant: { clair: '#FFFFFF', corps: '#D8F4FF', ombre: '#8ED0F0', eclat: '#FFFFFF', nom: 'diamant' }
};
function gemme(k, id) {
  const c = GEMMES[k];
  const grad = `<defs><linearGradient id="${id}" x1="0" y1="0" x2=".6" y2="1"><stop offset="0" stop-color="${c.clair}"/><stop offset=".5" stop-color="${c.corps}"/><stop offset="1" stop-color="${c.ombre}"/></linearGradient></defs>`;
  let s = grad;
  if (k === 'quartz' || k === 'amethyste') {
    // une grappe de prismes sur sa gangue
    s += P('M6,26 Q16,22.6 26,26 Q25,28.6 16,28.8 Q7,28.6 6,26 Z', '#8E8478', 0.9);
    for (const [x, h, a, w] of [[11, 13, -16, 3.4], [21, 12, 18, 3.2], [16, 18, 0, 4.2]]) {
      s += `<g transform="translate(${x} 26) rotate(${a})">${P(`M${-w},0 L${-w},${-h + w} L0,${-h} L${w},${-h + w} L${w},0 Z`, `url(#${id})`, 0.9)}${P(`M0,${-h} L0,0`, 'none', 0).replace('fill="none"', `fill="none" stroke="${c.ombre}" stroke-width="0.6"`)}<path d="M${f(-w + 0.8)},${f(-h + w + 0.6)} L${f(-w + 0.8)},-1.4" stroke="${WHITE}" stroke-width="0.9" stroke-linecap="round" opacity=".8"/></g>`;
    }
  } else if (k === 'rubis') {
    // taille ovale à facettes
    s += P('M16,5 L24.6,10 L26,17.4 L20.6,26 L11.4,26 L6,17.4 L7.4,10 Z', `url(#${id})`, 1);
    s += `<path d="M16,5 L16,11 M24.6,10 L20.4,13 M7.4,10 L11.6,13 M6,17.4 L11.6,13 L20.4,13 L26,17.4 M11.6,13 L13.4,26 M20.4,13 L18.6,26 M16,11 L11.6,13 M16,11 L20.4,13" fill="none" stroke="${c.ombre}" stroke-width="0.6"/>`;
    s += P('M11.6,13 L20.4,13 L18.6,19 L13.4,19 Z', c.clair, 0).replace('/>', ' opacity=".55"/>') + `<path d="M9,10.6 L12.6,9" stroke="${WHITE}" stroke-width="1.1" stroke-linecap="round"/>`;
  } else {
    // diamant taille brillant, reflets arc-en-ciel
    s += P('M6,12 L10.6,6 L21.4,6 L26,12 L16,27.4 Z', `url(#${id})`, 1);
    s += `<path d="M6,12 L26,12 M10.6,6 L13,12 L16,6 L19,12 L21.4,6 M13,12 L16,27.4 L19,12" fill="none" stroke="${c.ombre}" stroke-width="0.6"/>`;
    s += P('M13,12 L19,12 L16,20 Z', '#FFE8F4', 0).replace('/>', ' opacity=".7"/>') + P('M6,12 L13,12 L16,27.4 Z', '#E8F8D8', 0).replace('/>', ' opacity=".35"/>') + P('M19,12 L26,12 L16,27.4 Z', '#FFF0C8', 0).replace('/>', ' opacity=".35"/>');
    s += `<path d="M11.4,8.2 L13.6,7.4" stroke="${WHITE}" stroke-width="1.1" stroke-linecap="round"/>`;
  }
  return s;
}
// l'éclat qui passe sur une pierre (SMIL, en boucle) : une petite étoile qui s'allume par moments
const etoile = (x, y, r, fill = '#FFFFFF') => `<path d="M${x},${f(y - r)} Q${f(x + r * 0.16)},${f(y - r * 0.16)} ${f(x + r)},${y} Q${f(x + r * 0.16)},${f(y + r * 0.16)} ${x},${f(y + r)} Q${f(x - r * 0.16)},${f(y + r * 0.16)} ${f(x - r)},${y} Q${f(x - r * 0.16)},${f(y - r * 0.16)} ${x},${f(y - r)} Z" fill="${fill}"/>`;
const brille = (x, y, r, dur, begin) => `<g opacity="0" transform="translate(${x} ${y})">${etoile(0, 0, r)}<animate attributeName="opacity" values="0;1;0;0" keyTimes="0;0.15;0.3;1" dur="${dur}s" begin="${begin}s" repeatCount="indefinite"/><animateTransform attributeName="transform" type="scale" additive="sum" values="0.4;1.1;0.4;0.4" keyTimes="0;0.15;0.3;1" dur="${dur}s" begin="${begin}s" repeatCount="indefinite"/></g>`;
const gemmeAnimee = (k, id) => gemme(k, id) + brille(11, 9, 2.6, 2.4, 0) + brille(22, 15, 1.8, 2.4, 1.1);
// la pierre qui apparaît (4 images) : elle monte du trou en grandissant, des rayons de sa couleur, puis se pose
function apparait(k, i, id) {
  const c = GEMMES[k], sc = [0.35, 1.18, 0.96, 1][i], dy = [5, -2, 0.5, 0][i], ray = [0.5, 1, 0.7, 0.35][i];
  let s = '';
  for (let j = 0; j < 8; j++) { const a = j * Math.PI / 4 + i * 0.12, l = 9 + ray * 6; s += `<path d="M${f(16 + Math.cos(a - 0.1) * 5)},${f(16 + Math.sin(a - 0.1) * 5)} L${f(16 + Math.cos(a) * l)},${f(16 + Math.sin(a) * l)} L${f(16 + Math.cos(a + 0.1) * 5)},${f(16 + Math.sin(a + 0.1) * 5)} Z" fill="${c.eclat}" opacity="${f(0.55 * ray)}"/>`; }
  s += `<circle cx="16" cy="16" r="${f(7 + ray * 4)}" fill="${c.eclat}" opacity="${f(0.3 * ray)}"/>`;
  return s + `<g transform="translate(16 ${f(16 + dy)}) scale(${sc}) translate(-16 -16)">${gemme(k, id)}</g>` + (i === 1 ? etoile(24, 7, 2.6) + etoile(8, 10, 1.6) : '');
}
// les éclats de couleur d'une pierre trouvée (4 images) : une couronne de facettes de sa couleur qui s'ouvre
function eclatCouleur(k, i) {
  const c = GEMMES[k], t = (i + 1) / 4;
  let s = '';
  const cols = k === 'diamant' ? ['#FF9AA8', '#FFD86A', '#9AE8A0', '#8AC8FF', '#C8A0FF', '#FFFFFF'] : [c.corps, c.clair, c.eclat];
  for (let j = 0; j < 10; j++) {
    const a = j * Math.PI / 5 + 0.3, d = 4 + t * 18, r = 2.3 * (1 - t * 0.5);
    s += `<g transform="translate(${f(16 + Math.cos(a) * d)} ${f(16 + Math.sin(a) * d)}) rotate(${f(j * 36 + t * 90)})" opacity="${f(1 - t * 0.75)}">${P(`M0,${f(-r * 1.4)} L${f(r)},0 L0,${f(r * 1.4)} L${f(-r)},0 Z`, cols[j % cols.length], 0.4)}</g>`;
  }
  if (i < 2) s += etoile(16, 16, 7 - i * 2, '#FFFBE8');
  return s;
}

// ——— la lueur du filon (SMIL) : sur les blocs qui suivent le filon, elle respire ; éteinte, un reste froid ———
const lueur = allumee => allumee
  ? `<defs><radialGradient id="lf"><stop offset="0" stop-color="#FFE7A0" stop-opacity=".75"/><stop offset=".6" stop-color="#FFC84A" stop-opacity=".35"/><stop offset="1" stop-color="#FFC84A" stop-opacity="0"/></radialGradient></defs><rect x="0" y="0" width="32" height="32" fill="url(#lf)"><animate attributeName="opacity" values=".55;1;.55" dur="1.6s" repeatCount="indefinite"/></rect><path d="M2,18 Q9,13 16,16 T30,12" fill="none" stroke="#FFE7A0" stroke-width="1.4" stroke-linecap="round" stroke-dasharray="3 3"><animate attributeName="stroke-dashoffset" values="0;-12" dur="1.2s" repeatCount="indefinite"/></path>`
  : `<path d="M2,18 Q9,13 16,16 T30,12" fill="none" stroke="#9AA4B8" stroke-width="1" stroke-linecap="round" stroke-dasharray="1.5 3" opacity=".6"/>`;
// le signe ✦ : une pierre dort tout près (1, 2, 3 étoiles qui scintillent chacune à leur tour)
const signe = n => [[25.5, 26, 3], [20.5, 27.4, 2.2], [27.6, 21.2, 2]].slice(0, n).map(([x, y, r], i) => `<g transform="translate(${x} ${y})"><path d="M0,${-r} Q${f(r * 0.18)},${f(-r * 0.18)} ${r},0 Q${f(r * 0.18)},${f(r * 0.18)} 0,${r} Q${f(-r * 0.18)},${f(r * 0.18)} ${-r},0 Q${f(-r * 0.18)},${f(-r * 0.18)} 0,${-r} Z" fill="#FFE07A" stroke="${OUT}" stroke-width="0.5"><animateTransform attributeName="transform" type="scale" values="1;0.6;1" dur="1.4s" begin="${f(i * 0.45)}s" repeatCount="indefinite"/></path></g>`).join('');

// ——— les pièces : { id (le fichier), nom, cadre, dessin, suite (les images qui s'enchaînent), ms par image } ———
const BLOC = [0, 0, 32, 32], LARGE = [-8, -8, 48, 48];
const DURETES = { 1: 'tendre', 2: 'dur', 3: 'tres-dur' };
const PIECES = [];
const piece = (id, nom, cadre, dessin, suite = null, ms = null) => PIECES.push({ id, nom, cadre, dessin, suite, ms });
for (const h of [1, 2, 3]) for (let c = 0; c < h; c++) piece(`bloc-${DURETES[h]}_${c ? `fissure-${c}` : 'neuf'}`, `Bloc ${ROCHE[h].nom}${c ? `, après ${c} coup${c > 1 ? 's' : ''}` : ''}`, BLOC, () => bloc(h, c, `fl${h}${c}`));
piece('trou', 'Le trou d\'un bloc cassé', BLOC, () => trou('fltr'));
for (const h of [1, 2, 3]) for (let k = 0; k < 4; k++) piece(`eclatement-${DURETES[h]}_${k + 1}`, `Le bloc ${ROCHE[h].nom.split(' (')[0]} qui éclate`, LARGE, () => eclate(h, k, `fle${h}${k}`), `eclatement-${DURETES[h]}`, 70);
for (let k = 0; k < 3; k++) piece(`pioche_${k + 1}`, 'La pioche (levée, l\'élan, le coup)', BLOC, () => pioche(k), 'pioche', 90);
for (const [fort, nom] of [[false, 'dur'], [true, 'tres-dur']]) for (let k = 0; k < 3; k++) piece(`etincelles-${nom}_${k + 1}`, `Les étincelles d'un bloc ${nom === 'dur' ? 'dur' : 'très dur'}`, LARGE, () => etincelles(k, fort), `etincelles-${nom}`, 70);
for (let k = 0; k < 3; k++) piece(`onde_${k + 1}`, 'L\'onde du bloc cassé', LARGE, () => onde(k), 'onde', 80);
const LE = { quartz: 'Le ', amethyste: 'L\'', rubis: 'Le ', diamant: 'Le ' }, DU = { quartz: 'du ', amethyste: 'de l\'', rubis: 'du ', diamant: 'du ' };
for (const g of Object.keys(GEMMES)) {
  piece(g, `${GEMMES[g].nom[0].toUpperCase()}${GEMMES[g].nom.slice(1)} (son éclat passe, en boucle)`, BLOC, () => gemmeAnimee(g, `flg${g}`));
  for (let k = 0; k < 4; k++) piece(`apparition-${g}_${k + 1}`, `${LE[g]}${GEMMES[g].nom} qui apparaît`, BLOC, () => apparait(g, k, `fla${g}${k}`), `apparition-${g}`, 110);
  for (let k = 0; k < 4; k++) piece(`eclats-${g}_${k + 1}`, `Les éclats de couleur ${DU[g]}${GEMMES[g].nom}`, LARGE, () => eclatCouleur(g, k), `eclats-${g}`, 70);
}
piece('lueur_allumee', 'La lueur du filon, suivi (en boucle)', BLOC, () => lueur(true));
piece('lueur_eteinte', 'La lueur du filon, perdu', BLOC, () => lueur(false));
for (const n of [1, 2, 3]) piece(`signe-${n}`, `Le signe ✦ : ${n} pierre${n > 1 ? 's' : ''} tout près (en boucle)`, BLOC, () => signe(n));

const TITRE = 'Le Filon (la Carrière)', FOND = '#4A4440';
const LISEZ_MOI = 'Le Filon : un bloc de la paroi a un cadre de 32 × 32 ; les effets qui débordent du bloc (éclatement, étincelles, onde, éclats de couleur) ont un cadre de 48 × 48 centré sur le bloc (à poser 1,5 fois plus grand que le bloc). Pièces fixes : les blocs et leurs fissures, le trou. Boucles animées dans le SVG (SMIL) : l\'éclat des pierres, la lueur du filon, le signe ✦. Suites d\'images à enchaîner une fois, au coup : le bloc qui éclate, la pioche, les étincelles, l\'onde, la pierre qui apparaît, ses éclats de couleur. Améliorations : le fond de la paroi selon la profondeur (48 × 48, se répète) et sa crête (48 × 14, se répète en largeur) ; les pioches de bois et d\'or et leur coup (48 × 48) ; six trouvailles (fossiles, objets des Anciens) et leur apparition ; l\'écran de bilan (le coffret 64 × 48 de 0 à 4 pierres, les étoiles).';
module.exports = { TITRE, FOND, LISEZ_MOI, ROCHE, GEMMES, PIECES, bloc, trou, eclate, pioche, etincelles, onde, gemme, gemmeAnimee, apparait, eclatCouleur, lueur, signe };
