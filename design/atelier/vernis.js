// Le vernis : une passe d'illustration posée sur un dessin de la bibliothèque (un bâtiment, un arbre, une bête…), sans
// rien changer à sa forme. Pour l'écran de démarrage (splash_ile.js : les constructions au dernier palier, l'aperçu de
// ce qu'on atteint) ; choix de l'auteur, 16 oct. : la même passe sera reprise plus tard sur les dessins du jeu. Du fond
// vers l'avant :
// - l'ombre de contact, serrée sous le dessin (il est posé, pas collé) ;
// - le contour extérieur, un peu plus épais que les traits du dessin (sa silhouette en bleu nuit, décalée tout autour, à
//   demi transparente : la forme se lit mieux sans faire autocollant) ;
// - le dessin, tel quel, un rien plus trapu s'il le faut (trapu : il s'élargit d'autant qu'il se tasse, autour de son
//   ancrage) ;
// - le volume, découpé à sa silhouette : clair en haut, plus sombre en bas et du côté opposé à la lune ; la nuit (le
//   même voile bleu sur tout ce qui est posé : ils baignent dans la même lumière) ;
// - les reflets de lune : un liseré argenté, discret, le long des bords tournés vers elle (la silhouette, moins elle-même
//   décalée), et un reflet très doux en biais sur le haut ;
// - ses lumières de nuit (fenêtres, lanternes : batiments.json, lumieres) : un halo chaud, un cœur vif, la flaque de
//   lumière au sol ;
// - des étincelles (eclats), pour ce qui est magique.
// Repère : celui du dessin ; box : [x, y, w, h], son cadre (le viewBox du fichier) ; l'ancrage (le sol) en (0, 0).
// Pas de filtre : les flous se font aux dégradés.
const { f, rnd } = require('./scenes7').outils;

const arrets = stops => stops.map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join('');
const degrade = (id, x1, y1, x2, y2, stops) => `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}">${arrets(stops)}</linearGradient>`;
const rayonne = (id, stops) => `<radialGradient id="${id}">${arrets(stops)}</radialGradient>`;

// La silhouette : chaque forme opaque du dessin, pleine de la couleur courante (currentColor : posée en blanc, elle
// ajoute à un masque ; en noir, elle en retire ; en sombre, elle fait le contour). Les formes transparentes (ombres au
// sol, voiles, lueurs : rgba, opacity, un dégradé qui s'efface) n'en sont pas ; les liserés transparents non plus.
const FORMES = /<(path|circle|ellipse|rect|polygon|polyline|line)\b([^>]*?)(\/>|>[\s\S]*?<\/\1>)/g;
const attr = (a, nom) => { const m = a.match(new RegExp(`\\s${nom}="([^"]*)"`)); return m ? m[1] : null; };
function silhouette(svg, prefixe) {
  const fondus = new Set([...svg.matchAll(/<(linear|radial)Gradient[^>]*id="([^"]+)"[^>]*>([\s\S]*?)<\/\1Gradient>/g)]
    .filter(m => /stop-opacity="0?\.\d*"|stop-opacity="0"/.test(m[3])).map(m => m[2]));
  const transparent = c => Boolean(c) && ((/^rgba\(/.test(c) && !/,\s*1\)$/.test(c)) || (/^url\(#([^)]+)\)$/.test(c) && fondus.has(c.slice(5, -1))));
  const sil = svg.replace(FORMES, (m, tag, a) => {
    const fill = attr(a, 'fill'), stroke = attr(a, 'stroke'), op = attr(a, 'opacity') || attr(a, 'fill-opacity');
    if (op !== null && Number(op) < 1) return '';
    if (fill === 'none' ? !stroke || stroke === 'none' || transparent(stroke) : transparent(fill)) return '';
    const sansTrait = transparent(stroke) ? a.replace(/\sstroke="[^"]*"/, '').replace(/\sstroke-width="[^"]*"/, '') : a;
    return `<${tag}${sansTrait.replace(/\s(fill|stroke)="(?!none)[^"]*"/g, ' $1="currentColor"')}/>`;
  });
  // (ses identifiants à elle : elle est posée à côté du dessin)
  return `<g fill="currentColor">${sil.replace(/<(linear|radial)Gradient[\s\S]*?<\/\1Gradient>/g, '').replace(/<animate[^>]*\/>/g, '')
    .replace(/(<g\b[^>]*\s)fill="(?!none)[^"]*"/g, '$1fill="currentColor"')
    .replace(/id="([^"]+)"/g, `id="${prefixe}$1"`).replace(/url\(#([^)]+)\)/g, `url(#${prefixe}$1)`).replace(/href="#([^"]+)"/g, `href="#${prefixe}$1"`)}</g>`;
}

// Une étincelle : une croix de lumière fine autour d'un point clair
const etincelle = (x, y, r, a, c) => `<g opacity="${f(a)}"><path d="M${f(x)},${f(y - r)} Q${f(x + r * 0.12)},${f(y - r * 0.12)} ${f(x + r)},${f(y)} Q${f(x + r * 0.12)},${f(y + r * 0.12)} ${f(x)},${f(y + r)} Q${f(x - r * 0.12)},${f(y + r * 0.12)} ${f(x - r)},${f(y)} Q${f(x - r * 0.12)},${f(y - r * 0.12)} ${f(x)},${f(y - r)} Z" fill="${c}"/><circle cx="${f(x)}" cy="${f(y)}" r="${f(r * 0.22)}" fill="#FFFFFF"/></g>`;

// Le vernis d'un dessin. corps : le dessin (ses identifiants déjà uniques) ; id : le préfixe des identifiants du vernis ;
// box : son cadre. Réglages (o) :
// - bord : l'épaisseur du contour extérieur (dans le repère du dessin) ; contour : sa couleur ;
// - cote : d'où vient la lune (1 : de la droite, -1 : de la gauche) ; force : la force du volume (0 à 1) ;
// - trapu : de combien il se tasse (0 : pas du tout ; 0,04 : un peu plus rond, plus chibi) ;
// - sol : la demi-largeur de son ombre de contact, serrée sous sa base (0 : sans) ; nuit : la force du voile de nuit ;
// - lumieres : [[x, y, rayon, sol]] dans le repère du dessin (sol : la hauteur du point au sol sous la lumière) ;
// - eclats : le nombre d'étincelles autour de lui, couleur : la leur.
function vernis(corps, id, [x, y, w, h], o = {}) {
  const { bord = 1.2, contour = '#1C2A3A', cote = 1, force = 1, trapu = 0, sol = 0, lumieres = [], eclats = 0, couleur = '#FFF4C8', nuit = 0.16 } = o;
  const zone = `maskUnits="userSpaceOnUse" x="${f(x - w)}" y="${f(y - h)}" width="${f(3 * w)}" height="${f(3 * h)}"`;
  const use = (c, extra = '') => `<use href="#${id}B" color="${c}"${extra}/>`;
  const decale = (dx, dy) => ` transform="translate(${f(dx)} ${f(dy)})"`;
  const moins = (nom, dx, dy) => `<mask id="${id}${nom}" ${zone}>${use('#FFFFFF')}${use('#000000', decale(dx, dy))}</mask>`;
  const [gx1, gx2] = cote > 0 ? [x, x + w] : [x + w, x];
  const e = Math.max(w, h) * 0.006;
  let defs = `<defs><g id="${id}B">${silhouette(corps, `${id}s`)}</g><mask id="${id}S" ${zone}>${use('#FFFFFF')}</mask>`
    + moins('H', 0, e * 1.4) + moins('C', -cote * e * 1.2, e * 0.5)
    + degrade(`${id}V`, 0, y, 0, y + h, [[0, '#FFFBEC', 0.26 * force], [0.45, '#FFFBEC', 0.06 * force], [0.62, '#FFFBEC', 0], [0.85, '#101A3C', 0.08 * force], [1, '#101A3C', 0.24 * force]])
    + degrade(`${id}L`, gx1, 0, gx2, 0, [[0, '#18244E', 0.2 * force], [0.5, '#18244E', 0], [1, '#FFE6B0', 0.14 * force]])
    + degrade(`${id}R`, x, y, x + w * 0.7, y + h * 0.7, [[0, '#FFFFFF', 0], [0.36, '#FFFFFF', 0], [0.44, '#FFFFFF', 0.08 * force], [0.52, '#FFFFFF', 0]])
    + degrade(`${id}T`, 0, y, 0, y + h * 0.85, [[0, '#E8F2FF'], [0.75, '#DDEBFF', 0.6], [1, '#DDEBFF', 0]])
    + degrade(`${id}N`, 0, y, 0, y + h, [[0, '#24386E', nuit * 0.6], [1, '#16224A', nuit * 1.4]])
    + rayonne(`${id}O`, [[0, '#060A1A', 0.55], [0.6, '#060A1A', 0.22], [1, '#060A1A', 0]])
    + rayonne(`${id}F`, [[0, '#FFF6D8'], [0.16, '#FFE08E', 0.8], [0.45, '#FFB850', 0.32], [1, '#FFB04A', 0]])
    + rayonne(`${id}P`, [[0, '#FFC870', 0.42], [1, '#FFC870', 0]]);
  defs += '</defs>';
  const aplat = (peinture, m, op = 1) => `<rect x="${f(x - 4)}" y="${f(y - 4)}" width="${f(w + 8)}" height="${f(h + 8)}" fill="${peinture}" mask="url(#${id}${m})"${op < 1 ? ` opacity="${f(op)}"` : ''}/>`;
  let s = defs;
  if (sol) s += `<ellipse cx="0" cy="${f(sol * 0.06)}" rx="${f(sol)}" ry="${f(sol * 0.32)}" fill="url(#${id}O)" opacity=".6"/>`;
  // le contour extérieur : douze copies sombres de la silhouette, tout autour
  const tour = [...Array(8).keys()].map(i => { const a = (i / 8) * Math.PI * 2; return use(contour, decale(Math.cos(a) * bord, Math.sin(a) * bord)); }).join('');
  let d = `<g opacity=".7">${tour}</g>` + corps + aplat(`url(#${id}V)`, 'S') + aplat(`url(#${id}L)`, 'S') + aplat(`url(#${id}R)`, 'S')
    + aplat(`url(#${id}N)`, 'S') + aplat(`url(#${id}T)`, 'H', 0.45) + aplat(`url(#${id}T)`, 'C', 0.3);
  // ses lumières de nuit, et leur flaque au sol
  d += lumieres.map(([lx, ly, r, ys]) => (ys !== undefined ? `<ellipse cx="${f(lx)}" cy="${f(ys)}" rx="${f(r * 1.3)}" ry="${f(r * 0.45)}" fill="url(#${id}P)"/>` : '')
    + `<circle cx="${f(lx)}" cy="${f(ly)}" r="${f(r)}" fill="url(#${id}F)"/><circle cx="${f(lx)}" cy="${f(ly)}" r="${f(Math.max(1.2, r * 0.13))}" fill="#FFFDF2"/>`).join('');
  if (eclats) {
    const g = rnd(id.length * 31 + eclats);
    for (let i = 0; i < eclats; i++) {
      const ex = x + w * (0.15 + g() * 0.7), ey = y + h * (0.05 + g() * 0.6), a = 0.45 + g() * 0.5;
      d += i % 3 ? `<circle cx="${f(ex)}" cy="${f(ey)}" r="${f(0.8 + g() * 1.4)}" fill="${couleur}" opacity="${f(a)}"/>` : etincelle(ex, ey, 3 + g() * 4, a, couleur);
    }
  }
  return s + (trapu ? `<g transform="scale(${f(1 + trapu)} ${f(1 - trapu)})">${d}</g>` : d);
}

module.exports = { vernis, silhouette };
