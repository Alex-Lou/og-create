// Anya, immense, pour l'écran de démarrage (splash.js) : son dessin refondu (refonte/anya_anims.js, « éveil », les bras
// ouverts, choix de l'auteur, 16 oct.), et son cerf de lune à côté d'elle (refonte/cerf_lune.js),
// sans rien changer à sa forme, avec un rendu d'illustration posé dessus : le contre-jour doré de la lune, le modelé
// (plus sombre sur les bords, chaud au centre), un reflet qui la parcourt lentement, la lumière de ses mains ouvertes ;
// elle flotte, respire et cligne doucement des yeux. Le bas de sa robe s'efface dans la brume (derrière l'île).
// Repère : celui de son dessin (80 × 128, son ombre au sol en (40, 123)) ; le cerf : 120 × 144, le sabot en (60, 141).
const AA = require('../personnages/refonte/anya_anims');
const AT = require('../personnages/refonte/anya_tenues');
const CL = require('../personnages/refonte/cerf_lune');
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

// Le passage de lumière de l'écran, le même pour tout ce qui y est posé (bâtiments, bêtes, maîtres) : le contre-jour
// (la silhouette, claire, un peu plus haut, derrière le dessin) ; le modelé par-dessus, découpé à la silhouette : clair
// en haut et du côté de la lumière, sombre en bas et de l'autre côté. Les formes transparentes du dessin (ses ombres au
// sol, ses lueurs) restent hors de la silhouette. corps : le dessin, dans son repère ; box : [x, y, w, h], son cadre ;
// cote : 1 si la lumière vient de la droite, -1 de la gauche ; force : de 0 à 1.
const silhouetteDe = corps => corps.replace(/<(path|circle|ellipse|rect|polygon|polyline|line)\b[^>]*(opacity|rgba)[^>]*\/>/g, '')
  .replace(/fill="(?!none)[^"]*"/g, 'fill="#FFFFFF"').replace(/stroke="(?!none)[^"]*"/g, 'stroke="#FFFFFF"').replace(/ id="[^"]*"/g, '');
function eclairer(corps, id, [x, y, w, h], cote = 1, force = 1, contreJour = '#FFF0C0') {
  const sil = silhouetteDe(corps);
  const [gx1, gx2] = cote > 0 ? [x, x + w] : [x + w, x];
  const defs = `<defs><mask id="${id}M" maskUnits="userSpaceOnUse" x="${x - w}" y="${y - h}" width="${3 * w}" height="${3 * h}">${sil}</mask>`
    + degrade(`${id}V`, 0, y, 0, y + h, [[0, '#FFF6DA', 0.28 * force], [0.4, '#FFF6DA', 0], [0.7, '#0A1430', 0.12 * force], [1, '#0A1430', 0.5 * force]])
    + degrade(`${id}L`, gx1, 0, gx2, 0, [[0, '#101C40', 0.38 * force], [0.5, '#101C40', 0], [1, '#FFD890', 0.22 * force]]) + '</defs>';
  const aplat = peinture => `<rect x="${x - 2}" y="${y - 2}" width="${w + 4}" height="${h + 4}" fill="${peinture}" mask="url(#${id}M)"/>`;
  const decal = Math.max(w, h) * 0.008;
  return defs + `<g transform="translate(${f(-cote * decal * 0.6)} ${f(-decal)})" opacity="${f(0.7 * force)}">${aplat(contreJour)}</g>`
    + corps + aplat(`url(#${id}V)`) + aplat(`url(#${id}L)`);
}

// ═══ Anya ═══
// Sa silhouette (pour le masque des lumières) : son dessin sans ses lueurs ni ses lucioles (les formes transparentes ou
// en dégradé), chaque forme en blanc plein
const silhouette = svg => svg.replace(/<(path|circle|ellipse|rect)\b[^>]*(opacity|rgba|url\(#)[^>]*\/>/g, '')
  .replace(/<(path|circle|ellipse|rect)\b[^>]*(opacity|rgba|url\(#)[^>]*>[\s\S]*?<\/\1>/g, '')
  .replace(/fill="(?!none)[^"]*"/g, 'fill="#FFFFFF"').replace(/stroke="(?!none)[^"]*"/g, 'stroke="#FFFFFF"');
// Son éveil, l'image où ses bras s'ouvrent (la 7e) ; expr : une autre expression (les yeux clos) ; uid : ses ids
const eveil = (uid, expr) => AA.dessiner({ ...AT.habiller('ete', 'voilee'), uid, ...(expr ? { expr } : {}) }, 'eveil', 'face', 6);

function anyaVeille() {
  const ouverte = eveil('sa');
  const fermee = eveil('sz', 'recueillie');
  const sil = silhouette(eveil('sm'));
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
  s += [[18, 70], [62, 70]].map(([x, y], k) => `<g transform="translate(${x} ${y})"><circle r="10" fill="url(#saMain)">${palpite('r', '8;12;8', 2.6, k)}</circle>`
    + [0, 1, 2].map(i => `<circle cx="${(i - 1) * 2}" cy="-2" r=".7" fill="#FFF6C8" opacity="0"><animateTransform attributeName="transform" type="translate" values="0 0;${i % 2 ? 2 : -2} -12;${i % 2 ? -1 : 1} -24" dur="${f(2.6 + i * 0.4)}s" begin="${f(-i * 0.9 - k)}s" repeatCount="indefinite"/>`
      + `<animate attributeName="opacity" values="0;1;0" dur="${f(2.6 + i * 0.4)}s" begin="${f(-i * 0.9 - k)}s" repeatCount="indefinite"/></circle>`).join('') + '</g>').join('');
  // elle flotte et respire ; le bas de sa robe s'efface
  return defs + `<g mask="url(#saFondu)"><g>${vaVient('translate', '0 0', '0 -1.6', 6)}<g>`
    + `<animateTransform attributeName="transform" type="scale" values="1 1;1.006 1.01;1 1" keyTimes="0;0.5;1" calcMode="spline" keySplines="${SPLINE};${SPLINE}" dur="5s" repeatCount="indefinite"/>`
    + s + '</g></g></g>';
}

// Le cerf de lune, debout, de trois quarts avant, retourné (vers le bas à gauche : vers elle, quand il est à sa droite),
// éclairé comme l'écran (eclairer : la lune derrière elle, à sa gauche à lui)
// (sa lueur, derrière lui, reste hors de l'éclairage : sinon le contre-jour la prendrait pour sa silhouette)
function cerfVeille() {
  const corps = CL.cerfLune('se', 'debout', 0, { id: 'scl' });
  const lueur = (corps.match(/<ellipse cx="60" cy="72"[^>]*>[\s\S]*?<\/ellipse>/) || [''])[0];
  // (le bas de ses pattes s'efface dans la brume, comme la robe d'Anya : il se tient derrière l'île)
  const fondu = `<defs>${degrade('sclFG', 0, 96, 0, 128, [[0, '#FFFFFF'], [1, '#FFFFFF', 0]])}</defs><mask id="sclF"><rect x="-20" y="-20" width="160" height="190" fill="url(#sclFG)"/></mask>`;
  const tourne = `<g transform="translate(120 0) scale(-1 1)">${corps.replace(lueur, '')}</g>`;
  return fondu + `<g mask="url(#sclF)">${lueur}${eclairer(tourne, 'sclE', [0, 0, 120, 144], -1, 0.9, '#CFEFFF')}</g>`;
}

module.exports = { anyaVeille, cerfVeille, outils: { degrade, rayonne, forme, trait, balance, eclairer, SPLINE } };
