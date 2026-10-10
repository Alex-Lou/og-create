// Anya, immense, pour l'écran de démarrage (splash.js) : son dessin du jeu (anya.js, « éveil », les bras ouverts),
// sans rien changer à sa forme, avec un rendu d'illustration posé dessus : le contre-jour doré de la lune, le modelé
// (plus sombre sur les bords, chaud au centre), un reflet qui la parcourt lentement, la lumière de ses mains ouvertes ;
// elle flotte, respire et cligne doucement des yeux. Le bas de sa robe s'efface dans la brume (derrière l'île).
// Repère : celui de son dessin (80 × 128, les pieds en (40, 125)).
const { anyaFrame } = require('./anya');
const { f, vaVient, palpite } = require('./scenes7').outils;

const SPLINE = '0.45 0 0.55 1'; // l'adoucissement de chaque étape

// ═══ les outils de dessin de l'écran (partagés avec splash_ile.js) ═══
// Un dégradé linéaire ou radial en coordonnées du dessin : stops [[offset, couleur, opacité?], ...]
const arrets = stops => stops.map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join('');
const degrade = (id, x1, y1, x2, y2, stops) => `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${arrets(stops)}</linearGradient>`;
const rayonne = (id, cx, cy, r, stops, fx = cx, fy = cy) => `<radialGradient id="${id}" gradientUnits="userSpaceOnUse" cx="${cx}" cy="${cy}" r="${r}" fx="${fx}" fy="${fy}">${arrets(stops)}</radialGradient>`;
const forme = (d, fill, stroke = 'none', w = 0, extra = '') => `<path d="${d}" fill="${fill}"${stroke !== 'none' ? ` stroke="${stroke}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"` : ''}${extra}/>`;
const trait = (d, stroke, w, extra = '') => `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"${extra}/>`;
// Une rotation douce qui va et vient autour d'un point
const balance = (a, b, cx, cy, dur, begin = 0) => `<animateTransform attributeName="transform" type="rotate" values="${a} ${cx} ${cy};${b} ${cx} ${cy};${a} ${cx} ${cy}" keyTimes="0;0.5;1" calcMode="spline" keySplines="${SPLINE};${SPLINE}" dur="${dur}s" begin="${f(-begin)}s" repeatCount="indefinite"/>`;

// ═══ Anya ═══
// Sa silhouette (pour le masque des lumières) : son dessin sans son aura ni ses lucioles, chaque forme en blanc plein
const silhouette = svg => svg.replace(/<ellipse cx="40" cy="62"[^>]*\/>/, '')
  .replace(/<(circle|ellipse)[^>]*fill="(rgb\(255,236,150\)|#FFF3A8)"[^>]*\/>/g, '').replace(/<(circle|ellipse)[^>]*fill-opacity[^>]*\/>/g, '')
  .replace(/ (fill-)?opacity="[^"]*"/g, '').replace(/fill="(?!none)[^"]*"/g, 'fill="#FFFFFF"').replace(/stroke="(?!none)[^"]*"/g, 'stroke="#FFFFFF"');

function anyaVeille() {
  const ouverte = anyaFrame('front', 'action', 1, 'content');
  const fermee = anyaFrame('front', 'action', 1, 'endormi').replace(/id="an/g, 'id="sz').replace(/url\(#an/g, 'url(#sz');
  const sil = silhouette(ouverte).replace(/id="an/g, 'id="sm').replace(/url\(#an/g, 'url(#sm');
  const defs = '<defs>'
    + `<mask id="saSil">${sil}</mask>`
    + `<mask id="saFondu"><rect x="-40" y="-40" width="160" height="220" fill="url(#saFonduG)"/></mask>`
    + degrade('saFonduG', 0, 88, 0, 112, [[0, '#FFFFFF'], [1, '#FFFFFF', 0]])
    // le modelé : chaud et clair au centre, plus sombre et froid sur les bords et vers le bas
    + rayonne('saModele', 40, 44, 52, [[0, '#FFF4D0', 0.22], [0.5, '#FFF4D0', 0], [0.85, '#1E2A5A', 0.22], [1, '#1E2A5A', 0.4]])
    // le reflet qui la parcourt : une bande de lumière en biais
    + degrade('saReflet', -30, 0, 0, 30, [[0, '#FFFFFF', 0], [0.5, '#FFFFFF', 0.45], [1, '#FFFFFF', 0]])
    + rayonne('saMain', 0, 0, 12, [[0, '#FFFBE0', 0.95], [0.4, '#FFE58A', 0.45], [1, '#FFE58A', 0]])
    + rayonne('saYeux', 40, 31, 13, [[0, '#FFFFFF'], [0.7, '#FFFFFF'], [1, '#FFFFFF', 0]])
    + `<mask id="saYeuxM"><ellipse cx="40" cy="31" rx="14" ry="7" fill="url(#saYeux)"/></mask>`
    + '</defs>';
  const aplat = peinture => `<rect x="-10" y="-10" width="100" height="150" fill="${peinture}" mask="url(#saSil)"/>`;
  let s = '';
  // le contre-jour doré : sa silhouette, un peu plus haut et de chaque côté, derrière elle
  s += [[-0.7, -0.6], [0.7, -0.6], [0, -1]].map(([dx, dy]) => `<g transform="translate(${dx} ${dy})" opacity=".55">${aplat('#FFF0B0')}</g>`).join('');
  // son dessin, tel quel ; les yeux qui se ferment doucement de temps en temps (même dessin, les yeux clos, en fondu bref)
  s += ouverte;
  s += `<g mask="url(#saYeuxM)" opacity="0"><animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0;0.88;0.9;0.94;0.96;1" dur="7s" repeatCount="indefinite"/>${fermee}</g>`;
  // le modelé, puis le reflet qui passe (toutes les 7 s), découpés à sa silhouette
  s += aplat('url(#saModele)');
  s += `<g mask="url(#saSil)"><rect x="-30" y="-10" width="30" height="150" fill="url(#saReflet)" transform="skewX(-20)">`
    + `<animateTransform attributeName="transform" type="translate" values="-40 0;-40 0;140 0" keyTimes="0;0.55;1" calcMode="spline" keySplines="0 0 1 1;${SPLINE}" dur="7s" repeatCount="indefinite" additive="sum"/></rect></g>`;
  // la lumière de ses mains ouvertes, et des étincelles qui en montent
  s += [[14.4, 70], [65.6, 70]].map(([x, y], k) => `<g transform="translate(${x} ${y})"><circle r="10" fill="url(#saMain)">${palpite('r', '8;12;8', 2.6, k)}</circle>`
    + [0, 1, 2].map(i => `<circle cx="${(i - 1) * 2}" cy="-2" r=".7" fill="#FFF6C8" opacity="0"><animateTransform attributeName="transform" type="translate" values="0 0;${i % 2 ? 2 : -2} -12;${i % 2 ? -1 : 1} -24" dur="${f(2.6 + i * 0.4)}s" begin="${f(-i * 0.9 - k)}s" repeatCount="indefinite"/>`
      + `<animate attributeName="opacity" values="0;1;0" dur="${f(2.6 + i * 0.4)}s" begin="${f(-i * 0.9 - k)}s" repeatCount="indefinite"/></circle>`).join('') + '</g>').join('');
  // elle flotte et respire ; le bas de sa robe s'efface
  return defs + `<g mask="url(#saFondu)"><g>${vaVient('translate', '0 0', '0 -1.6', 6)}<g>`
    + `<animateTransform attributeName="transform" type="scale" values="1 1;1.006 1.01;1 1" keyTimes="0;0.5;1" calcMode="spline" keySplines="${SPLINE};${SPLINE}" dur="5s" repeatCount="indefinite"/>`
    + s + '</g></g></g>';
}

module.exports = { anyaVeille, outils: { degrade, rayonne, forme, trait, balance, SPLINE } };
