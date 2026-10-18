// Anya, derrière l'île, pour l'écran de démarrage (splash.js) : l'initiale, la chevelure argentée (anya.js, son éveil, les
// bras ouverts ; choix de l'auteur, 16 oct.), seule (sans son cerf : 17 oct.), sans rien changer à sa forme, avec un
// rendu d'illustration posé dessus : la lune se lève juste derrière elle (contre-jour : le liseré de lune sur ses bords,
// une ombre fraîche qui gagne le bas), la lumière chaude de ses mains ouvertes, des étincelles. Le bas de sa robe
// s'efface dans la brume (derrière l'île). Le fond est publié immobile (preview_splash.js).
// Repère : celui de son dessin (80 × 128, ses pieds en (40, 125)).
const A = require('./anya');
const { f, rnd } = require('./scenes7').outils;

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

// ═══ Anya, devant la lune ═══
// Leur silhouette (pour les masques des lumières) : le dessin sans ses lueurs ni ses lucioles (les formes transparentes
// ou en dégradé rayonnant), chaque forme pleine de la couleur courante (currentColor) : posée en blanc, elle ajoute à un
// masque ; en noir, elle en retire. Les formes peintes d'un dégradé linéaire (la lumière de la troupe, troupe.js :
// peau, chevelure, manteau) en font partie.
function silhouette(svg) {
  const peints = new Set([...svg.matchAll(/<linearGradient[^>]*id="([^"]+)"/g)].map(m => m[1]));
  return svg.replace(/(fill|stroke)="url\(#([^)]+)\)"/g, (m, a, id) => (peints.has(id) ? `${a}="currentColor"` : m))
    .replace(/<(path|circle|ellipse|rect)\b[^>]*(opacity|rgba|url\(#)[^>]*\/>/g, '')
    .replace(/<(path|circle|ellipse|rect)\b[^>]*(opacity|rgba|url\(#)[^>]*>[\s\S]*?<\/\1>/g, '')
    .replace(/fill="(?!none)[^"]*"/g, 'fill="currentColor"').replace(/stroke="(?!none)[^"]*"/g, 'stroke="currentColor"');
}

// Le contre-jour de lune : la lune se lève juste derrière elle. Le dessin reste tel quel ; derrière lui, sa silhouette
// claire, un peu plus grande (le bord qui rayonne sur la nuit) ; par-dessus, découpés à sa silhouette : un voile de
// lumière en haut, une ombre fraîche qui gagne le bas (le bas du corps rejoint la nuit et la brume), puis le liseré de lune, la lumière
// qui déborde des bords tournés vers elle (la silhouette, moins elle-même décalée à l'opposé : une ligne fine le long du
// bord), vif en haut, éteint à la hauteur haut. dessin(uid) : le dessin, avec ces identifiants (ses découpes) ; box : [x, y, w, h], son cadre ; liseré : son épaisseur ;
// cote : d'où vient la lune quand elle n'est pas juste derrière (1 : de la droite, -1 : de la gauche ; le côté opposé
// s'assombrit).
function contreJour(dessin, id, [x, y, w, h], haut, lisere = 1.2, cote = 0) {
  const corps = dessin(id);
  const zone = `maskUnits="userSpaceOnUse" x="${x - w}" y="${y - h}" width="${3 * w}" height="${3 * h}"`;
  const sil = (c, extra = '') => `<use href="#${id}B" color="${c}"${extra}/>`;
  const moins = (nom, [dx, dy]) => `<mask id="${id}${nom}" ${zone}>${sil('#FFFFFF')}${sil('#000000', ` transform="translate(${f(dx * lisere)} ${f(dy * lisere)})"`)}</mask>`;
  const defs = `<defs><g id="${id}B">${silhouette(dessin(`${id}b`))}</g>`
    + `<mask id="${id}S" ${zone}>${sil('#FFFFFF')}</mask>`
    + moins('H', [0, 1]) + moins('G', [0.8, 0.4]) + moins('D', [-0.8, 0.4])
    + degrade(`${id}O`, 0, y, 0, y + h, [[0, '#1C2C66', 0], [0.55, '#1C2C66', 0], [0.8, '#182A60', 0.26], [1, '#0E1838', 0.5]])
    + degrade(`${id}C`, 0, y, 0, y + h, [[0, '#FFFFFF', 0.16], [0.5, '#FFFFFF', 0.05], [0.7, '#FFFFFF', 0]])
    + degrade(`${id}L`, 0, y, 0, y + haut, [[0, '#FFF8DE'], [0.55, '#FFF6E0', 0.85], [1, '#F2F6FF', 0]])
    + (cote ? degrade(`${id}T`, cote > 0 ? x + w : x, 0, cote > 0 ? x : x + w, 0, [[0, '#1C2C66', 0], [0.35, '#1C2C66', 0], [1, '#1C2C66', 0.34]]) : '')
    + '</defs>';
  const aplat = (peinture, m, o = 1) => `<rect x="${x - 4}" y="${y - 4}" width="${w + 8}" height="${h + 8}" fill="${peinture}" mask="url(#${id}${m})"${o < 1 ? ` opacity="${f(o)}"` : ''}/>`;
  const bord = [[-1, -0.5], [1, -0.5], [0, -1.2], [-0.7, 0.4], [0.7, 0.4]].map(([dx, dy]) => sil('#FFFFFF', ` transform="translate(${f(dx * lisere)} ${f(dy * lisere)})"`)).join('');
  return defs + `<g opacity=".38">${bord}</g>` + corps + aplat(`url(#${id}C)`, 'S') + aplat(`url(#${id}O)`, 'S') + (cote ? aplat(`url(#${id}T)`, 'S') : '') + aplat(`url(#${id}L)`, 'H') + aplat(`url(#${id}L)`, 'G', 0.7) + aplat(`url(#${id}L)`, 'D', 0.7);
}

// Une étincelle : une croix de lumière fine autour d'un point clair
const etincelle = (x, y, r, a = 1, c = '#FFF8DC') => `<g opacity="${f(a)}"><path d="M${f(x)},${f(y - r)} Q${f(x + r * 0.12)},${f(y - r * 0.12)} ${f(x + r)},${f(y)} Q${f(x + r * 0.12)},${f(y + r * 0.12)} ${f(x)},${f(y + r)} Q${f(x - r * 0.12)},${f(y + r * 0.12)} ${f(x - r)},${f(y)} Q${f(x - r * 0.12)},${f(y - r * 0.12)} ${f(x)},${f(y - r)} Z" fill="${c}"/><circle cx="${f(x)}" cy="${f(y)}" r="${f(r * 0.22)}" fill="#FFFFFF"/></g>`;

// Anya (l'initiale, la chevelure argentée : anya.js), dans son éveil, les bras ouverts (sa 2e image), à contre-jour ;
// la lumière chaude de ses mains ouvertes éclaire le devant de sa robe et son visage par en dessous ; des étincelles
// montent de ses mains. Le bas de sa robe s'efface (sous la brume, derrière l'île). uid : le préfixe de ses
// identifiants (chacun de ses exemplaires a les siens)
const eveil = uid => A.anyaFrame('front', 'action', 1, 'content')
  .replace(/id="([^"]+)"/g, `id="${uid}$1"`).replace(/url\(#([^)]+)\)/g, `url(#${uid}$1)`).replace(/href="#([^"]+)"/g, `href="#${uid}$1"`);
const MAINS = [[14.4, 69], [65.6, 69]];
function anyaVeille() {
  const defs = '<defs>'
    + `<mask id="saFondu"><rect x="-40" y="-40" width="160" height="220" fill="url(#saFonduG)"/></mask>`
    + degrade('saFonduG', 0, 84, 0, 114, [[0, '#FFFFFF'], [0.5, '#FFFFFF', 0.55], [1, '#FFFFFF', 0]])
    // la lumière de ses mains sur elle : chaude, par en dessous
    + rayonne('saChaud', 40, 70, 40, [[0, '#FFE7A0', 0.4], [0.5, '#FFD978', 0.14], [1, '#FFD978', 0]])
    + rayonne('saMain', 0, 0, 16, [[0, '#FFFDF0'], [0.18, '#FFF4C0', 0.9], [0.5, '#FFE08A', 0.32], [1, '#FFE08A', 0]])
    + '</defs>';
  let s = contreJour(eveil, 'sa', [0, 0, 80, 128], 70, 1.15);
  s += `<rect x="-4" y="20" width="88" height="100" fill="url(#saChaud)" mask="url(#saS)"/>`;
  s += MAINS.map(([x, y]) => `<circle transform="translate(${x} ${y})" r="16" fill="url(#saMain)"/>`).join('');
  // les étincelles qui montent de ses mains, de plus en plus petites
  const g = rnd(7);
  MAINS.forEach(([x, y], k) => {
    for (let i = 0; i < 6; i++) {
      const t = (i + 1) / 6, dx = (k ? 1 : -1) * (2 + t * 9) + (g() - 0.5) * 4;
      s += i % 2 ? `<circle cx="${f(x + dx)}" cy="${f(y - 4 - t * 26)}" r="${f(0.9 - t * 0.4)}" fill="#FFF6C8" opacity="${f(0.95 - t * 0.5)}"/>`
        : etincelle(x + dx, y - 4 - t * 26, 2.6 - t * 1.4, 0.95 - t * 0.45);
    }
  });
  return defs + `<g mask="url(#saFondu)">${s}</g>`;
}

module.exports = { anyaVeille, etincelle, outils: { degrade, rayonne, forme, trait, balance, eclairer, SPLINE } };
