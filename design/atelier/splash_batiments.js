// Les constructions de l'île du splash, dessinées pour lui en papier néon (choix de l'auteur, 18 oct. : les dessins du
// jeu posés tels quels, « on dirait un screenshot collé grossièrement » ; « redesign complet, du lourd, un vrai jeu
// AAA ») : du volume peint (des volumes de trois quarts, chaque face modelée par la lune, ses ombres portées sous les
// avancées, l'ombre douce au pied), de la matière (pierres taillées une à une et écornées, mousse dans les joints,
// planches veinées et clouées, tuiles en écailles rang par rang, colombages), une silhouette qui raconte, et la lumière
// néon par touches (fenêtres profondes dont la lumière déborde, liseré de lune cyan, reflet magenta de l'autre côté).
// De grandes surfaces sombres, de petites lumières très vives. Chaque chose finie : une pointe a son épi, un poteau
// porte quelque chose (choix de l'auteur : « gaffe aux détails et aux finitions, genre la pointe non achevée, ou le
// bout de bois debout seul »).
// Après dix ans d'apocalypse (survie) : brèches et toits crevés qui brûlent, fenêtres brisées et condamnées, suie,
// fissures, barbelés en accordéon, sacs de sable ; les lumières presque toutes éteintes.
// Repère de chaque dessin : son pied en (0, 0), à l'échelle des dessins de la bibliothèque (cadre 280 × 330) ; la lune
// est au centre de l'île : cote = 1 quand elle est à droite du dessin (il est à gauche de l'île), -1 sinon.
const { f, rnd, palpite, vaVient } = require('./scenes7').outils;

const ENCRE = '#0A0418';
const CYAN = '#5CF2E6', MAGENTA = '#FF3FA8', ACIDE = '#D4FF7A', CHAUD = '#FFB85A', VIOLET = '#9A5AF0';

// ——— les outils ———
const P2 = (x, y) => `${f(x)},${f(y)}`;
const poly = pts => 'M' + pts.map(([x, y]) => P2(x, y)).join(' L') + ' Z';
const stops = s => s.map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join('');
const lin = (id, x1, y1, x2, y2, s) => `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}">${stops(s)}</linearGradient>`;
const rad = (id, cx, cy, r, s) => `<radialGradient id="${id}" gradientUnits="userSpaceOnUse" cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}">${stops(s)}</radialGradient>`;
const plan = (d, fill, w = 1.2, extra = '') => `<path d="${d}" fill="${fill}" stroke="${ENCRE}" stroke-width="${w}" stroke-linejoin="round"${extra}/>`;
const trait = (d, c, w, extra = '') => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${f(w)}" stroke-linecap="round" stroke-linejoin="round"${extra}/>`;
const lumineux = (d, c, w = 1.2) => trait(d, c, w * 5, ' stroke-opacity=".12"') + trait(d, c, w) + trait(d, '#FFFFFF', w * 0.35, ' stroke-opacity=".75"');
const lueur = (id, x, y, r, c, a = 0.55, anim = '') => `<defs>${rad(id, x, y, r, [[0, c, a], [0.4, c, a * 0.4], [1, c, 0]])}</defs><circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="url(#${id})">${anim}</circle>`;
// une teinte entre deux (hex), t de 0 à 1
const mix = (a, b, t) => '#' + [1, 3, 5].map(i => Math.round(parseInt(a.slice(i, i + 2), 16) * (1 - t) + parseInt(b.slice(i, i + 2), 16) * t).toString(16).padStart(2, '0')).join('');
const plus = (a, b, k = 1) => [a[0] + b[0] * k, a[1] + b[1] * k];
const norme = v => Math.hypot(v[0], v[1]);
const unite = v => { const n = norme(v); return [v[0] / n, v[1] / n]; };

// La lumière de la lune sur une surface courbe : la part éclairée (0 à 1) d'un point vu à l'abscisse u (-1 à 1) d'un
// cylindre, la lune du côté cote
const eclaire = (u, cote) => Math.max(0, Math.min(1, 0.5 + 0.5 * (u * cote * 0.9 + 0.15)));

// Les dégradés communs d'un dessin (en boîte d'objet : réutilisables sur toute face) : l'ombre au pied d'un mur, l'ombre
// sous une avancée, la suie qui monte
const vert = (id, s) => `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">${stops(s)}</linearGradient>`;
const communs = p => `<defs>${vert(`${p}AO`, [[0, '#05020E', 0], [0.55, '#05020E', 0], [1, '#05020E', 0.6]])}${vert(`${p}HA`, [[0, '#05020E', 0.7], [0.3, '#05020E', 0]])}`
  + `${vert(`${p}SU`, [[0, '#0A0610', 0.55], [0.45, '#0A0610', 0.2], [1, '#05020A', 0.8]])}</defs>`;
// L'ombre posée sur une face (dans son repère) : la part qui tourne le dos à la lune, l'ombre au pied, sous l'avancée ;
// la suie après l'apocalypse
const voile = (p, W, H, a, sv, haut = 1) => `<rect width="${f(W)}" height="${f(H)}" fill="#05020E" opacity="${f(a)}"/><rect width="${f(W)}" height="${f(H)}" fill="url(#${p}AO)"/>`
  + (haut ? `<rect width="${f(W)}" height="${f(H)}" fill="url(#${p}HA)"/>` : '') + (sv ? `<rect width="${f(W)}" height="${f(H)}" fill="url(#${p}SU)"/>` : '');

// Une face plane posée dans l'espace : son repère (origine O, vecteurs U et V), sa matière dessinée dans le rectangle
// W × H (ou dans la forme clip) de ce repère ; les faces de côté et les pans de toit, ainsi, fuient pour de vrai
const plaque = (id, O, U, V, W, H, contenu, clip) => `<g transform="matrix(${f(U[0])} ${f(U[1])} ${f(V[0])} ${f(V[1])} ${f(O[0])} ${f(O[1])})">`
  + `<clipPath id="${id}"><path d="${clip || `M0,0 H${f(W)} V${f(H)} H0 Z`}"/></clipPath><g clip-path="url(#${id})">${contenu}</g></g>`;
// Une matière coupée à une forme quelconque (en coordonnées du dessin), dessinée à partir de (x, y)
const zone = (id, clip, x, y, contenu) => `<clipPath id="${id}"><path d="${clip}"/></clipPath><g clip-path="url(#${id})"><g transform="translate(${f(x)} ${f(y)})">${contenu}</g></g>`;

// ——— les matières (dans le repère d'une face, W × H, y vers le bas) ———
// Des pierres taillées, rang par rang en quinconce, chacune sa teinte, son arête haute qui accroche la lune ; des pierres
// écornées ; de la mousse dans les joints, plus dense vers le pied
function tPierres(W, H, g, { fonce = '#140C2A', clair = '#5A4688', haut = 8, long = 14, lum = 0.6, mousse = 0.12 } = {}) {
  let s = `<rect width="${f(W)}" height="${f(H)}" fill="${mix(fonce, '#000000', 0.45)}"/>`;
  for (let y = 0, r = 0; y < H; y += haut, r++) {
    for (let x = -(r % 2) * long * 0.5 - g() * 3; x < W;) {
      const l = long * (0.7 + g() * 0.6), t = lum * (0.55 + g() * 0.6), c = mix(fonce, clair, Math.min(1, t));
      const x0 = x + 0.7, x1 = x + l - 0.7, y0 = y + 0.7, y1 = y + haut - 0.7, e = g() < 0.25 ? Math.min(3, haut * 0.35) : 0;
      s += `<path d="M${P2(x0 + e, y0)} L${P2(x1, y0)} L${P2(x1, y1)} L${P2(x0, y1)} L${P2(x0, y0 + e)} Z" fill="${c}"/>`;
      if (t > 0.5) s += `<path d="M${P2(x0 + e + 0.5, y0 + 0.6)} L${P2(x1 - 0.5, y0 + 0.6)}" stroke="${mix(clair, '#D8C8FF', 0.45)}" stroke-width=".6" opacity="${f(Math.min(0.9, (t - 0.45) * 1.5))}"/>`;
      s += `<path d="M${P2(x0 + 0.5, y1 - 0.4)} L${P2(x1, y1 - 0.4)}" stroke="#05020E" stroke-width=".7" opacity=".5"/>`;
      if (g() < mousse * (0.3 + 1.4 * y / H)) s += `<ellipse cx="${f(x0 + g() * l)}" cy="${f(y1 + 0.3)}" rx="${f(1.5 + g() * 2.5)}" ry="${f(0.8 + g() * 0.8)}" fill="${g() < 0.5 ? '#1E5A44' : '#2A7A52'}"/>`;
      x += l;
    }
  }
  return s;
}
// Des briques (le four, les cheminées)
const tBriques = (W, H, g, o = {}) => tPierres(W, H, g, { fonce: '#2A0E1E', clair: '#A8424E', haut: 3.4, long: 7, lum: 0.6, mousse: 0, ...o });
// Des planches veinées, leurs nœuds, leurs clous (verticales, ou couchées : horiz)
function tPlanches(W, H, g, { c = '#3A2418', larg = 6, horiz = false } = {}) {
  const Lg = horiz ? H : W, M = horiz ? W : H;
  let s = `<rect width="${f(W)}" height="${f(H)}" fill="${mix(c, '#000000', 0.6)}"/>`;
  for (let a = 0; a < Lg; a += larg) {
    const col = mix(mix(c, '#000000', 0.25), mix(c, '#C8A088', 0.3), g());
    const r = horiz ? [0, a + 0.4, W, larg - 0.8] : [a + 0.4, 0, larg - 0.8, H];
    s += `<rect x="${f(r[0])}" y="${f(r[1])}" width="${f(r[2])}" height="${f(r[3])}" fill="${col}"/>`;
    for (let k = 0; k < 2; k++) {
      const o = a + larg * (0.3 + k * 0.38), j = (g() - 0.5) * 1.8;
      s += `<path d="${horiz ? `M0,${f(o)} Q${f(W * 0.5)},${f(o + j)} ${f(W)},${f(o)}` : `M${f(o)},0 Q${f(o + j)},${f(H * 0.5)} ${f(o)},${f(H)}`}" fill="none" stroke="${mix(c, '#000000', 0.55)}" stroke-width=".45" opacity=".8"/>`;
    }
    if (g() < 0.3) { const q = g() * M; s += `<ellipse cx="${f(horiz ? q : a + larg / 2)}" cy="${f(horiz ? a + larg / 2 : q)}" rx="1.1" ry=".7" fill="${mix(c, '#000000', 0.6)}"/>`; }
    for (const q of [2, M - 2]) s += `<circle cx="${f(horiz ? q : a + larg / 2)}" cy="${f(horiz ? a + larg / 2 : q)}" r=".5" fill="#8A8098"/>`;
  }
  return s;
}
// Des tuiles en écailles, du bas vers le haut (chaque rang recouvre le bas de celui d'en dessous), chacune sa teinte,
// son bord clair ; plus claires vers l'égout
function tTuiles(W, H, g, { fonce = '#1A0A36', clair = '#7A3AC8', larg = 7, haut = 4.5, lum = 0.6, manque = 0 } = {}) {
  let s = `<rect width="${f(W)}" height="${f(H)}" fill="${mix(fonce, '#000000', 0.5)}"/>`;
  const rangs = Math.ceil(H / haut) + 2;
  for (let r = rangs; r >= 0; r--) {
    const y = r * haut - haut;
    for (let x = (r % 2) * larg * 0.5 - larg; x < W + larg; x += larg) {
      if (manque && g() < manque) continue;
      const t = lum * (0.6 + g() * 0.5) * (0.75 + 0.35 * y / H), c = mix(fonce, clair, Math.min(1, t)), w = larg / 2;
      s += `<path d="M${P2(x - w, y - haut)} L${P2(x - w, y)} Q${P2(x - w, y + haut * 0.8)} ${P2(x, y + haut * 0.85)} Q${P2(x + w, y + haut * 0.8)} ${P2(x + w, y)} L${P2(x + w, y - haut)} Z" fill="${c}" stroke="${mix(fonce, '#000000', 0.55)}" stroke-width=".55"/>`
        + `<path d="M${P2(x - w * 0.7, y + haut * 0.45)} Q${P2(x, y + haut * 0.95)} ${P2(x + w * 0.7, y + haut * 0.45)}" fill="none" stroke="${mix(clair, '#E8D8FF', 0.5)}" stroke-width=".5" opacity="${f(Math.min(0.8, t * 0.8))}"/>`;
    }
  }
  return s;
}
// Un colombage : l'enduit taché, les poutres sombres (sablières, poteaux, croix de Saint-André)
function tColombage(W, H, g, { enduit = '#4E4470', bois = '#26141E' } = {}) {
  let s = `<rect width="${f(W)}" height="${f(H)}" fill="${enduit}"/>`;
  for (let i = 0; i < 10; i++) s += `<ellipse cx="${f(g() * W)}" cy="${f(g() * H)}" rx="${f(3 + g() * 6)}" ry="${f(2 + g() * 4)}" fill="${g() < 0.5 ? '#3A3258' : '#5E5484'}" opacity=".5"/>`;
  const b = (d, w = 2.6) => `<path d="${d}" stroke="${bois}" stroke-width="${w}" fill="none"/><path d="${d}" stroke="#5A3A3A" stroke-width=".5" fill="none" opacity=".6" transform="translate(-.6 -.6)"/>`;
  const n = Math.max(2, Math.round(W / 16)), m = H * 0.5;
  s += b(`M0,1.3 H${f(W)} M0,${f(m)} H${f(W)} M0,${f(H - 1.3)} H${f(W)}`, 2.8);
  for (let i = 0; i <= n; i++) { const x = (i / n) * W; s += b(`M${f(x)},0 V${f(H)}`); if (i < n && i % 2 === 0) s += b(`M${f(x)},${f(m)} L${f(x + W / n)},${f(H)} M${f(x + W / n)},${f(m)} L${f(x)},${f(H)}`, 1.8); }
  return s;
}
// L'herbe et la terre d'un dessus
function tTerre(W, H, g, { c = '#0E2A24', touffes = 30 } = {}) {
  let s = `<rect width="${f(W)}" height="${f(H)}" fill="${c}"/>`;
  for (let i = 0; i < touffes; i++) { const x = g() * W, y = g() * H; s += `<path d="M${P2(x - 1.6, y)} L${P2(x - 0.6, y - 2.6)} L${P2(x, y)} L${P2(x + 0.8, y - 3)} L${P2(x + 1.6, y)} Z" fill="${g() < 0.5 ? '#1E5A44' : '#2A7A52'}"/>`; }
  return s;
}

// ——— les détails ———
// Une fenêtre (dans le repère d'une face, ou à plat) : l'embrasure, le carreau qui luit et sa croisée, l'appui ; sa
// lumière déborde sur le mur. Brisée : le carreau noir, ses éclats, deux planches clouées en travers, la suie au-dessus
function carreau(id, x, y, w, h, { arc = false, brise = false, chaud = ['#FFF2C8', '#FF9A3A'], appui = true } = {}) {
  const forme = (i = 0) => arc ? `M${P2(x + i, y + h - i)} L${P2(x + i, y + w / 2)} Q${P2(x + w / 2, y - w * 0.18 + i * 1.6)} ${P2(x + w - i, y + w / 2)} L${P2(x + w - i, y + h - i)} Z` : `M${P2(x + i, y + i)} H${f(x + w - i)} V${f(y + h - i)} H${f(x + i)} Z`;
  let s = brise ? `<ellipse cx="${f(x + w / 2)}" cy="${f(y - h * 0.4)}" rx="${f(w * 0.9)}" ry="${f(h * 0.9)}" fill="#05020A" opacity=".45"/>` : lueur(`${id}l`, x + w / 2, y + h / 2, h * 1.9, CHAUD, 0.4);
  s += `<path d="${forme(-1.6)}" fill="#3A3050" stroke="${ENCRE}" stroke-width=".8"/>`;
  if (brise) {
    s += `<path d="${forme(0)}" fill="#07040E"/>`
      + `<path d="M${P2(x, y + h * 0.1)} L${P2(x + w * 0.35, y + h * 0.3)} L${P2(x, y + h * 0.55)} Z M${P2(x + w, y + h)} L${P2(x + w * 0.6, y + h * 0.75)} L${P2(x + w * 0.8, y + h * 0.5)} L${P2(x + w, y + h * 0.6)} Z" fill="#4A4068" opacity=".8"/>`
      + planche(x + w / 2, y + h * 0.35, w * 1.5, 18, Math.max(1.6, h * 0.16)) + planche(x + w / 2, y + h * 0.7, w * 1.5, -14, Math.max(1.6, h * 0.16));
  } else {
    s += `<defs>${lin(`${id}v`, 0, y, 0, y + h, [[0, chaud[0]], [1, chaud[1]]])}</defs><path d="${forme(0)}" fill="url(#${id}v)"/>`
      + `<path d="${forme(0)}" fill="none" stroke="#05020E" stroke-width="${f(Math.max(1, w * 0.12))}" opacity=".5"/>`
      + trait(`M${P2(x + w / 2, y + (arc ? w * 0.05 : 0))} L${P2(x + w / 2, y + h)} M${P2(x, y + h * 0.55)} L${P2(x + w, y + h * 0.55)}`, '#2A1A22', Math.max(0.6, w * 0.09));
  }
  if (appui) s += `<path d="M${P2(x - 1.8, y + h)} H${f(x + w + 1.8)} V${f(y + h + 1.6)} H${f(x - 1.8)} Z" fill="#5A5078" stroke="${ENCRE}" stroke-width=".5"/>`;
  return s;
}
// Une planche clouée, en (x, y), longueur l, penchée de a degrés
const planche = (x, y, l, a, e = 3) => `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(a)})"><rect x="${f(-l / 2)}" y="${f(-e / 2)}" width="${f(l)}" height="${f(e)}" fill="#5A4030" stroke="#140A0A" stroke-width=".5"/>`
  + `<path d="M${f(-l / 2 + 1)},${f(-e * 0.1)} L${f(l / 2 - 1)},${f(e * 0.05)}" stroke="#3A2618" stroke-width=".4"/><circle cx="${f(-l * 0.42)}" cy="0" r=".55" fill="#B8B0C0"/><circle cx="${f(l * 0.42)}" cy="0" r=".55" fill="#B8B0C0"/></g>`;
// Un rouleau de barbelé en accordéon, couché au sol de x0 à x1 (comme un vrai : des boucles fines qui se chevauchent,
// penchées, leurs lames ; le métal gris bleuté, la lune sur le haut des boucles)
function barbeles(x0, x1, y, r = 5) {
  const w = Math.max(0.45, r * 0.07);
  let s = `<ellipse cx="${f((x0 + x1) / 2)}" cy="${f(y + 1)}" rx="${f((x1 - x0) / 2 + r)}" ry="${f(r * 0.35)}" fill="#03020A" opacity=".35"/>`;
  for (let x = x0, i = 0; x < x1; x += r * 0.42, i++) {
    const yy = y - r + Math.sin(i * 0.7) * 0.5;
    s += `<ellipse cx="${f(x)}" cy="${f(yy)}" rx="${f(r * 0.5)}" ry="${f(r)}" transform="rotate(-18 ${f(x)} ${f(yy)})" fill="none" stroke="#5A6272" stroke-width="${f(w)}"/>`
      + `<path d="M${P2(x - r * 0.45, yy - r * 0.55)} Q${P2(x, yy - r * 1.05)} ${P2(x + r * 0.3, yy - r * 0.75)}" fill="none" stroke="#C8D4E8" stroke-width="${f(w * 0.6)}" opacity=".7"/>`;
    if (i % 2 === 0) { const lx = x + r * 0.3, ly = yy - r * 0.85, e = r * 0.14; s += `<path d="M${P2(lx - e, ly - e)} L${P2(lx + e, ly + e)} M${P2(lx + e, ly - e)} L${P2(lx - e, ly + e)}" stroke="#8A94A6" stroke-width="${f(w * 0.8)}"/>`; }
  }
  return s;
}
// Des sacs de sable empilés, de x0 à x1 (x0 < x1), n rangs
function sacs(x0, x1, y, n = 2, g = rnd(5)) {
  let s = '';
  const l = 11, h = 5.2;
  for (let r = 0; r < n; r++) {
    for (let x = x0 + (r % 2) * l * 0.5 + r * l * 0.3; x + l <= x1 - r * l * 0.3 + 0.1; x += l - 0.8) {
      const yy = y - r * (h - 0.8), c = mix('#2A2638', '#6A6080', 0.35 + g() * 0.35);
      s += `<path d="M${P2(x + 1, yy)} Q${P2(x - 0.6, yy - h * 0.5)} ${P2(x + 1.2, yy - h)} Q${P2(x + l / 2, yy - h - 1.2)} ${P2(x + l - 1.2, yy - h)} Q${P2(x + l + 0.6, yy - h * 0.5)} ${P2(x + l - 1, yy)} Q${P2(x + l / 2, yy + 1)} ${P2(x + 1, yy)} Z" fill="${c}" stroke="${ENCRE}" stroke-width=".7"/>`
        + trait(`M${P2(x + 2, yy - h + 0.6)} Q${P2(x + l / 2, yy - h - 0.4)} ${P2(x + l - 2, yy - h + 0.6)}`, '#9A90B0', 0.5, ' opacity=".6"')
        + trait(`M${P2(x + l - 2.6, yy - h * 0.8)} L${P2(x + l - 2, yy - h * 0.2)}`, '#140E20', 0.5);
    }
  }
  return s;
}
// De la fumée qui monte : des volutes qui grossissent et dérivent
const fumee = (id, x, y, k = 1, b = 0) => `<g>${vaVient('translate', '0 0', `${f(6 * k)} -4`, 6 + k, b)}` + [0, 1, 2, 3].map(i => { const r = (5 + i * 3.4) * k, dx = (Math.sin(i * 1.3) * 5 + i * 2.4) * k, dy = -i * 12 * k; return `<circle cx="${f(x + dx)}" cy="${f(y + dy)}" r="${f(r)}" fill="#2E2248" opacity="${f(0.55 - i * 0.11)}"/>`; }).join('') + '</g>';
// Des flammes qui dansent : leur lueur qui palpite, cinq langues, les braises qui montent, la fumée
function feu(id, x, y, k = 1, b = 0) {
  const langue = (h, w, c, d, o, dx = 0) => `<path d="M${f(dx - w * 0.5)},0 Q${f(dx - w)},${f(-h * 0.45)} ${f(dx + w * 0.15)},${f(-h)} Q${f(dx + w)},${f(-h * 0.45)} ${f(dx + w * 0.5)},0 Z" fill="${c}">`
    + `<animateTransform attributeName="transform" type="scale" values="1 1;0.86 1.18;1.06 0.9;1 1" dur="${d}s" begin="${f(-o - b)}s" repeatCount="indefinite"/></path>`;
  return fumee(`${id}f`, x, y - 22 * k, k, b)
    + lueur(`${id}l`, x, y - 8 * k, 34 * k, '#FF5A1E', 0.55, palpite('opacity', '0.65;1;0.7;0.65', 1.3, b))
    + `<g transform="translate(${f(x)} ${f(y)}) scale(${f(k)})">${langue(20, 9, '#E8301E', 0.9, 0, -3)}${langue(24, 9, '#FF5A2E', 0.8, 0.3, 2)}${langue(16, 7, '#FF9A3A', 0.65, 0.2, -1)}${langue(11, 5, '#FFC860', 0.55, 0.1, 1)}${langue(6, 3, '#FFF4C8', 0.5, 0.15)}`
    + [0, 1, 2].map(i => `<circle cx="${(i - 1) * 4}" cy="-10" r=".9" fill="#FFD27A"><animateTransform attributeName="transform" type="translate" values="0 0;${(i - 1) * 3} -22" dur="${f(1.4 + i * 0.3)}s" begin="${f(-b - i * 0.5)}s" repeatCount="indefinite"/>${palpite('opacity', '1;0', 1.4 + i * 0.3, b + i * 0.5)}</circle>`).join('') + '</g>';
}
// Une fissure : un zigzag sombre qui part de (x, y), son bord clair
function fissure(x, y, len, g, dx = 0, dy = 1) {
  let d = `M${P2(x, y)}`, px = x, py = y;
  for (let i = 0; i < 5; i++) { px += dx * len / 5 + (g() - 0.5) * len * 0.25; py += dy * len / 5 + (g() - 0.5) * len * 0.12; d += ` L${P2(px, py)}`; }
  return trait(d, '#9A88C8', 0.5, ' opacity=".35" transform="translate(.6 .4)"') + trait(d, '#05020A', 1.1);
}
// Un trou dans un pan (dans son repère) : le bord déchiqueté, les chevrons calcinés en travers, le feu dedans
function trou(id, cx, cy, rx, ry, g) {
  const pts = [];
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2, k = 0.7 + g() * 0.45; pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]); }
  return `<defs>${rad(`${id}t`, cx, cy + ry * 0.6, rx * 1.3, [[0, '#FF7A2E', 0.9], [0.5, '#8A1E14', 0.7], [1, '#05020A', 1]])}</defs><path d="${poly(pts)}" fill="url(#${id}t)" stroke="#05020A" stroke-width="1.6"/>`
    + trait(`M${P2(cx - rx * 1.1, cy - ry * 0.4)} L${P2(cx + rx * 1.1, cy - ry * 0.1)} M${P2(cx - rx * 0.9, cy + ry * 0.5)} L${P2(cx + rx * 0.7, cy + ry * 0.7)}`, '#140A0A', 2.2)
    + `<path d="${poly(pts)}" fill="none" stroke="#FF8A3A" stroke-width=".8" opacity=".8">${palpite('opacity', '0.4;0.9;0.4', 1.6, cx * 0.1)}</path>`;
}
// Un cristal qui luit : un prisme pointu, sa face claire et sa face sombre, sa lueur
const cristal = (id, x, y, h, a, c) => lueur(id, x, y - h * 0.5, h * 1.3, c, 0.45)
  + `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(a)})"><path d="M${f(-h * 0.18)},0 L${f(-h * 0.2)},${f(-h * 0.75)} L0,${f(-h)} L${f(h * 0.2)},${f(-h * 0.75)} L${f(h * 0.18)},0 Z" fill="${mix(c, '#05020E', 0.35)}" stroke="${ENCRE}" stroke-width=".6"/>`
  + `<path d="M0,0 L0,${f(-h)} L${f(h * 0.2)},${f(-h * 0.75)} L${f(h * 0.18)},0 Z" fill="${c}"/><path d="M${f(h * 0.05)},${f(-h * 0.2)} L${f(h * 0.05)},${f(-h * 0.85)}" stroke="#FFFFFF" stroke-width=".6" opacity=".8"/></g>`;
// L'ombre douce au pied (une ellipse aplatie)
const ombre = (id, rx, ry, dx = 0) => `<defs>${rad(id, 0, 0, 1, [[0, '#03020A', 0.75], [0.6, '#03020A', 0.35], [1, '#03020A', 0]])}</defs><ellipse cx="0" cy="0" rx="1" ry="1" fill="url(#${id})" transform="translate(${f(dx)} 2) scale(${f(rx)} ${f(ry)})"/>`;
// Une lanterne pendue à une chaîne de (x, y) ; éteinte après l'apocalypse
const lanterne = (id, x, y, l = 8, sv = false) => trait(`M${P2(x, y)} L${P2(x, y + l)}`, '#2A2438', 0.9, ' stroke-dasharray="1.2 .6"')
  + `<g transform="translate(${f(x)} ${f(y + l)})">${sv ? '' : lueur(id, 0, 5, 18, CHAUD, 0.6)}${plan('M-3.4,0 L3.4,0 L0,-2.6 Z', '#2A1A30', 0.7)}${plan('M-2.8,0 L2.8,0 L2.3,7 L-2.3,7 Z', sv ? '#1A1424' : '#FFD27A', 0.8)}`
  + `${trait('M0,0 L0,7', '#2A1A30', 0.6)}${plan('M-3,7 L3,7 L2,8.6 L-2,8.6 Z', '#2A1A30', 0.6)}</g>`;

// ——— les volumes ———
// La fuite vers le fond, par unité de profondeur, du côté s (celui qui fait face à la lune)
const D3 = s => [s * 0.72, -0.45];
// Un volume vu de trois quarts : sa face, son côté (qui fuit vers le fond, du côté s), son dessus ; chaque face reçoit sa
// matière (une fonction (W, H) => svg dans son repère) et son ombre ; le contour d'encre dehors, les arêtes douces dedans
function bloc(p, id, cx, y0, w, h, d, s, { face, flanc, dessus, af = 0.32, ac = 0.06, sv = false, bord } = {}) {
  const D = D3(s), e = cx + s * w / 2, loin = cx - s * w / 2;
  let o = '';
  if (flanc) o += plaque(`${id}c`, [e, y0 - h], D, [0, 1], d, h, flanc(d, h) + voile(p, d, h, ac, sv, 0));
  if (face) o += plaque(`${id}f`, [cx - w / 2, y0 - h], [1, 0], [0, 1], w, h, face(w, h) + voile(p, w, h, af, sv, 0));
  if (dessus) o += plaque(`${id}d`, [cx - w / 2 + D[0] * d, y0 - h + D[1] * d], [1, 0], [-D[0], -D[1]], w, d, dessus(w, d));
  const c = [[loin, y0], [e, y0], [e + D[0] * d, y0 + D[1] * d], [e + D[0] * d, y0 - h + D[1] * d], [loin + D[0] * d, y0 - h + D[1] * d], [loin, y0 - h]];
  o += `<path d="${poly(c)}" fill="none" stroke="${ENCRE}" stroke-width="1.1" stroke-linejoin="round"/>`
    + trait(`M${P2(e, y0)} L${P2(e, y0 - h)}${dessus ? ` L${P2(loin, y0 - h)} M${P2(e, y0 - h)} L${P2(e + D[0] * d, y0 - h + D[1] * d)}` : ''}`, ENCRE, 0.6, ' stroke-opacity=".7"');
  if (bord) o += lumineux(`M${P2(e + D[0] * d, y0 + D[1] * d - 1)} L${P2(e + D[0] * d, y0 - h + D[1] * d)}`, bord, 0.55);
  return o;
}
// Un point sur le dessus d'un bloc : u de gauche à droite de la face (0 à 1), v vers le fond (0 à 1)
const surBloc = (cx, y0, w, h, d, s, u, v) => { const D = D3(s); return [cx - w / 2 + u * w + D[0] * d * v, y0 - h + D[1] * d * v]; };
// Un toit à deux pans sur un bloc (le faîte fuit vers le fond) : le pan de derrière dans l'ombre, le pignon, le pan de
// devant éclairé, tuilés ; les rives de bois, le faîtage, la lune sur l'égout ; un trou qui brûle (survie)
function toit2(p, id, cx, yt, w, d, s, rh, o, { tuiles = {}, pignon, g = rnd(3), brule } = {}) {
  const D = D3(s), F = [-D[0] * o * 0.9, -D[1] * o * 0.9], dl = d + o * 1.8, pente = rh / (w / 2);
  const A = plus([cx, yt - rh], F), En = plus([cx + s * (w / 2 + o), yt + o * pente], F), Ef = plus([cx - s * (w / 2 + o), yt + o * pente], F);
  const Vn = [En[0] - A[0], En[1] - A[1]], Vf = [Ef[0] - A[0], Ef[1] - A[1]], Hn = norme(Vn), Hf = norme(Vf);
  let r = plaque(`${id}b`, A, D, unite(Vf), dl, Hf, tTuiles(dl, Hf, g, { ...tuiles, lum: 0.32 }));
  if (pignon) r += zone(`${id}g`, poly([[cx - w / 2, yt], [cx, yt - rh], [cx + w / 2, yt]]), cx - w / 2, yt - rh, pignon(w, rh) + voile(p, w, rh, 0.3, false));
  r += plaque(`${id}n`, A, D, unite(Vn), dl, Hn, tTuiles(dl, Hn, g, { ...tuiles, lum: 0.78, manque: brule ? 0.04 : 0 }) + (brule ? trou(`${id}t`, dl * 0.55, Hn * 0.5, dl * 0.2, Hn * 0.28, g) : ''));
  const A2 = plus(A, D, dl), En2 = plus(En, D, dl), Ef2 = plus(Ef, D, dl);
  r += `<path d="${poly([Ef, A, En, En2, A2, Ef2])}" fill="none" stroke="${ENCRE}" stroke-width="1.2" stroke-linejoin="round"/>`
    + trait(`M${P2(...Ef)} L${P2(...A)} L${P2(...En)}`, '#3A2418', 2.6) + trait(`M${P2(Ef[0], Ef[1] - 0.9)} L${P2(A[0], A[1] - 0.9)} L${P2(En[0], En[1] - 0.9)}`, '#7A5A48', 0.6)
    + trait(`M${P2(...A)} L${P2(...A2)}`, '#140A20', 2.2) + lumineux(`M${P2(A[0], A[1] - 0.8)} L${P2(A2[0], A2[1] - 0.8)}`, MAGENTA, 0.5)
    + lumineux(`M${P2(...En)} L${P2(...En2)}`, CYAN, 0.7);
  if (brule) { const c = plus(plus(A, D, dl * 0.55), unite(Vn), Hn * 0.5); r += feu(`${id}fe`, c[0], c[1] + 4, 0.9, cx * 0.01); }
  return { svg: r, A, D, Vn: unite(Vn), Hn, dl };
}
// Une cheminée de briques sur un pan : son pied enfoncé dans le toit (sa bavette de plomb), son chapeau, sa fumée ;
// étêtée après l'apocalypse
function cheminee(p, id, x, y, s, h, sv, g) {
  const r = bloc(p, `${id}b`, x, y + 2, 8, h, 6, s, { face: (W, H) => tBriques(W, H, g), flanc: (W, H) => tBriques(W, H, g), af: 0.3, sv })
    + `<ellipse cx="${f(x + s * 2)}" cy="${f(y + 1)}" rx="7" ry="2.2" fill="#140E1E" opacity=".9"/>`;
  if (sv) return r + `<path d="M${P2(x - 4, y + 2 - h)} L${P2(x - 1, y - h - 2)} L${P2(x + 2, y - h + 1)} L${P2(x + 4, y - h - 1.5)}" fill="none" stroke="${ENCRE}" stroke-width="1"/>`;
  return r + bloc(p, `${id}c`, x, y + 2 - h, 11, 3, 8, s, { face: (W, H) => `<rect width="${W}" height="${H}" fill="#4A3A5A"/>`, flanc: (W, H) => `<rect width="${W}" height="${H}" fill="#6A5A7A"/>`, dessus: (W, H) => `<rect width="${W}" height="${H}" fill="#2A2034"/><ellipse cx="${W / 2}" cy="${H / 2}" rx="3" ry="2" fill="#05020A"/>` })
    + fumee(`${id}f`, x + s * 3, y - h - 10, 0.8, x * 0.02);
}

// ——— les murs courbes ———
// Un mur de pierres courbé (un cylindre de rayon R, de y0 à y1) : les pierres taillées une à une, rang par rang, en
// quinconce, plus étroites vers les bords (la courbure), chacune modelée par la lune ; des pierres écornées, de la mousse
function pierres(R, y0, y1, cote, g, { fonce = '#140C2A', clair = '#5A4688', haut = 9, n = 9, mousse = 0.1 } = {}) {
  let s = '';
  for (let y = y0, rang = 0; y > y1; y -= haut, rang++) {
    const decal = rang % 2 ? 0.5 : 0;
    for (let k = -1; k <= n; k++) {
      const a0 = -Math.PI / 2 + ((k + decal) / n) * Math.PI, a1 = -Math.PI / 2 + ((k + 1 + decal) / n) * Math.PI;
      const u0 = Math.max(-1, Math.sin(a0)), u1 = Math.min(1, Math.sin(a1));
      if (u1 <= -1 || u0 >= 1 || u1 - u0 < 0.02) continue;
      const x0 = u0 * R + 0.8, x1 = u1 * R - 0.8, bombe = (1 - ((u0 + u1) / 2) ** 2) * R * 0.07;
      const t = eclaire((u0 + u1) / 2, cote) * (0.75 + g() * 0.35), c = mix(fonce, clair, Math.min(1, t)), ec = g() < 0.2 ? 2 : 0;
      s += `<path d="M${P2(x0 + ec, y - 0.8)} Q${P2((x0 + x1) / 2, y + bombe - 0.8)} ${P2(x1, y - 0.8)} L${P2(x1, y - haut + 0.8)} Q${P2((x0 + x1) / 2, y - haut + bombe + 0.8)} ${P2(x0, y - haut + 0.8)} L${P2(x0, y - 0.8 - ec)} Z" fill="${c}"/>`;
      if (t > 0.55) s += `<path d="M${P2(x0 + 0.6, y - haut + 1.2)} Q${P2((x0 + x1) / 2, y - haut + bombe + 1.2)} ${P2(x1 - 0.6, y - haut + 1.2)}" fill="none" stroke="${mix(clair, '#C8B8FF', 0.4)}" stroke-width=".7" opacity="${f((t - 0.55) * 1.6)}"/>`;
      if (g() < mousse * (0.2 + 1.6 * (y - y1) / (y0 - y1)) ** 2) s += `<ellipse cx="${f((x0 + x1) / 2 + (g() - 0.5) * 4)}" cy="${f(y - 0.6 + bombe)}" rx="${f(1.6 + g() * 2.4)}" ry="1" fill="${g() < 0.5 ? '#1E5A44' : '#2A7A52'}"/>`;
    }
  }
  return s;
}
// Un anneau de pierres (le bassin) : le mur avant d'une ellipse (rx, ry, centre du haut en yc), haut de h, ses pierres
// qui suivent la courbe
function anneau(rx, ry, yc, h, cote, g, { fonce = '#16102A', clair = '#6A5A8E', haut = 6, n = 14 } = {}) {
  const pt = (t, dy) => [rx * Math.cos(t), yc + ry * Math.sin(t) + dy];
  let s = `<path d="M${P2(rx, yc)} A${f(rx)},${f(ry)} 0 0,1 ${P2(-rx, yc)} L${P2(-rx, yc + h)} A${f(rx)},${f(ry)} 0 0,0 ${P2(rx, yc + h)} Z" fill="${mix(fonce, '#000000', 0.45)}"/>`;
  for (let dy = 0, r = 0; dy < h - 0.5; dy += haut, r++) {
    const d1 = Math.min(h, dy + haut);
    for (let k = -1; k < n; k++) {
      const a0 = Math.max(0, Math.PI * (k + (r % 2) * 0.5) / n), a1 = Math.min(Math.PI, Math.PI * (k + 1 + (r % 2) * 0.5) / n);
      if (a1 - a0 < 0.02) continue;
      const m = (a0 + a1) / 2, e = 0.012, t = eclaire(Math.cos(m), cote) * (0.75 + g() * 0.35);
      const pts = [pt(a0 + e, dy + 0.6), pt(m, dy + 0.6), pt(a1 - e, dy + 0.6), pt(a1 - e, d1 - 0.6), pt(m, d1 - 0.6), pt(a0 + e, d1 - 0.6)];
      s += `<path d="${poly(pts)}" fill="${mix(fonce, clair, Math.min(1, t))}"/>`;
    }
  }
  return s;
}
// Un toit conique en écailles : de la base (rayon R, en yb) au faîte (yt) ; rang par rang, du bas vers le haut, chaque
// écaille en demi-lune, modelée par la lune, son bord clair ; tout est coupé à la forme du cône
function ecailles(R, yb, yt, cote, g, { fonce = '#1A0A36', clair = '#7A3AC8' } = {}) {
  const rangs = 13;
  let s = '';
  for (let i = rangs - 1; i >= 0; i--) {
    const t0 = i / rangs, y = yb + (yt - yb) * t0, r = R * (1 - t0) ** 1.4 + 2, n = Math.max(3, Math.round(10 * (1 - t0)) + 2), h = (yb - yt) / rangs * 1.5;
    for (let k = 0; k <= n; k++) {
      const u = -1 + (2 * (k + (i % 2) * 0.5)) / n;
      if (u > 1.05) continue;
      const x = u * r, w = (2 * r) / n * 0.62, t = eclaire(u, cote) * (0.8 + g() * 0.3);
      s += `<path d="M${P2(x - w, y - h * 0.5)} L${P2(x - w, y)} Q${P2(x, y + h * 0.55)} ${P2(x + w, y)} L${P2(x + w, y - h * 0.5)} Z" fill="${mix(fonce, clair, Math.min(1, t))}" stroke="${mix(fonce, '#000000', 0.5)}" stroke-width=".7"/>`
        + `<path d="M${P2(x - w * 0.8, y + 0.4)} Q${P2(x, y + h * 0.45)} ${P2(x + w * 0.8, y + 0.4)}" fill="none" stroke="${mix(clair, '#E0C8FF', 0.5)}" stroke-width=".6" opacity="${f(t * 0.7)}"/>`;
    }
  }
  return s;
}
// Du lierre qui grimpe : une tige qui serpente, ses feuilles émeraude, quelques fleurs qui luisent (mort : brun gris)
function lierre(id, x, y, h, g, sens = 1, mort = false) {
  let d = `M${P2(x, y)}`, px = x, py = y, s = '';
  const feuilles = [];
  for (let i = 0; i < 9; i++) { const nx = px + sens * (g() - 0.4) * 6, ny = py - h / 9; d += ` Q${P2(px + sens * 4, (py + ny) / 2)} ${P2(nx, ny)}`; feuilles.push([nx, ny]); px = nx; py = ny; }
  s += trait(d, mort ? '#140E14' : '#0A2A1E', 2.4) + trait(d, mort ? '#3A2E2A' : '#1E6A4A', 1.1);
  feuilles.forEach(([fx, fy], i) => {
    for (const sg of [-1, 1]) { if (mort && g() < 0.5) continue; const lx = fx + sg * 3.2, ly = fy + (g() - 0.5) * 2; s += `<path d="M${P2(fx, fy)} Q${P2(lx, ly - 2.6)} ${P2(lx + sg * 1.6, ly)} Q${P2(lx, ly + 1.4)} ${P2(fx, fy)} Z" fill="${mort ? '#3A2E26' : i % 3 ? '#1E8A5C' : '#2FB070'}" stroke="${ENCRE}" stroke-width=".5"/>`; }
    if (!mort && i % 4 === 2) s += lueur(`${id}${i}`, fx, fy, 5, '#FF6AD0', 0.6) + `<circle cx="${f(fx)}" cy="${f(fy)}" r="1.2" fill="#FFD0EC"/>`;
  });
  return s;
}

// ═══ l'Atelier : la tour du mage ═══
// Une tour de pierre et sa ceinture de bois, son toit d'écailles évasé et sa lucarne, l'épi de cuivre et le croissant ;
// à son pied, l'appentis du laboratoire en volume : planches, toit d'écailles, la fenêtre du four qui rougeoie, sa
// cheminée de briques qui fume ; l'alambic, la cloche de verre où bout la potion vert acide ; le lierre qui grimpe, des
// tonneaux cerclés, une caisse de fioles qui luisent
function atelier(p, cote = 1, sv = false) {
  const g = rnd(71), L = cote, R = 34;
  const TOIT = 'M-48,-148 Q0,-132 48,-148 Q14,-188 0,-272 Q-14,-188 -48,-148 Z';
  let s = communs(p) + `<defs><clipPath id="${p}tc"><path d="M${-R},0 L${-R},-150 Q0,-158 ${R},-150 L${R},0 Q0,9 ${-R},0 Z"/></clipPath>`
    + `${lin(`${p}cy`, -R, 0, R, 0, [[0, '#000000', cote > 0 ? 0.55 : 0], [0.35, '#000000', cote > 0 ? 0.25 : 0.05], [0.65, '#000000', cote > 0 ? 0.05 : 0.25], [1, '#000000', cote > 0 ? 0 : 0.55]])}`
    + `${lin(`${p}ao`, 0, -16, 0, 0, [[0, '#03020A', 0], [1, '#03020A', 0.6]])}${lin(`${p}eav`, 0, -150, 0, -128, [[0, '#03020A', 0.8], [1, '#03020A', 0]])}`
    + `${lin(`${p}su`, 0, -160, 0, 0, [[0, '#05020A', 0.7], [0.4, '#05020A', 0.25], [1, '#05020A', 0.6]])}`
    + `<clipPath id="${p}rc"><path d="${TOIT}"/></clipPath>${lin(`${p}rs`, -48, 0, 48, 0, [[0, '#000000', cote > 0 ? 0.55 : 0], [1, '#000000', cote > 0 ? 0 : 0.55]])}</defs>`;
  s += ombre(`${p}o`, 124, 30, 14 * L);
  // ——— l'appentis du laboratoire, contre la tour, du côté de la lune ———
  const a0 = 22 * L, la = 64, pr = 28, D = D3(L), x1 = a0 + la * L;
  s += plaque(`${p}ac`, [x1, -46], D, [0, 1], pr, 46, tPlanches(pr, 46, g, { c: '#3A2230' }) + carreau(`${p}ac2`, 9, 14, 9, 11, { brise: sv }) + voile(p, pr, 46, 0.05, sv));
  s += plaque(`${p}af`, [a0, -66], [L, 0], [0, 1], la, 66, tPlanches(la, 66, g, { c: '#3A2230' })
    + carreau(`${p}af2`, 30, 34, 15, 15, { chaud: ['#FFD08A', '#FF4A1E'], brise: sv }) + voile(p, la, 66, 0.3, sv), `M0,0 L${la},20 L${la},66 L0,66 Z`);
  s += `<path d="${poly([[a0, -66], [x1, -46], [x1, 0], [a0, 0]])}" fill="none" stroke="${ENCRE}" stroke-width="1.1"/>`
    + `<path d="${poly([[x1, -46], [x1 + D[0] * pr, -46 + D[1] * pr], [x1 + D[0] * pr, D[1] * pr], [x1, 0]])}" fill="none" stroke="${ENCRE}" stroke-width="1.1"/>`
    + lumineux(`M${P2(x1 + D[0] * pr, -46 + D[1] * pr)} L${P2(x1 + D[0] * pr, D[1] * pr - 1)}`, CYAN, 0.5);
  // (son toit d'écailles : en pente depuis la tour, ses rives, la lune sur l'égout)
  const Fa = [-D[0] * 3, -D[1] * 3], TA = plus([a0, -69], Fa), TB = plus([x1 + 5 * L, -44], Fa), VA = [TB[0] - TA[0], TB[1] - TA[1]], prof = pr + 5;
  s += plaque(`${p}at`, TA, D, unite(VA), prof, norme(VA), tTuiles(prof, norme(VA), g, { lum: 0.7, larg: 6, haut: 4 }) + (sv ? trou(`${p}atr`, prof * 0.4, norme(VA) * 0.55, 7, 9, g) : ''));
  s += `<path d="${poly([TA, TB, plus(TB, D, prof), plus(TA, D, prof)])}" fill="none" stroke="${ENCRE}" stroke-width="1.2"/>` + trait(`M${P2(...TA)} L${P2(...TB)}`, '#3A2418', 2.4)
    + lumineux(`M${P2(...TB)} L${P2(...plus(TB, D, prof))}`, CYAN, 0.7);
  // (la cheminée du four, plantée dans le pan, qui fume ; le feu dans le toit crevé après l'apocalypse)
  const ch = plus(plus(TA, unite(VA), norme(VA) * 0.62), D, prof * 0.62);
  s += cheminee(p, `${p}ch`, ch[0], ch[1], L, 30, sv, g);
  if (sv) { const fa = plus(plus(TA, unite(VA), norme(VA) * 0.55), D, prof * 0.4); s += feu(`${p}af3`, fa[0], fa[1], 0.8, 0.4); }
  // ——— l'alambic et la cloche de verre, sur leur socle de pierre, devant l'appentis ———
  const vx = 62 * L;
  s += `<g transform="translate(${vx} 4)">`
    + bloc(p, `${p}so`, 0, 0, 26, 11, 12, L, { face: (W, H) => tPierres(W, H, g, { haut: 5.5, long: 9 }), dessus: (W, H) => `<rect width="${W}" height="${H}" fill="#3A3054"/>`, flanc: (W, H) => tPierres(W, H, g, { haut: 5.5, long: 9, lum: 0.9 }), sv });
  if (sv) {
    // (la cloche brisée, la potion répandue qui luit au sol)
    s += lueur(`${p}v`, 4 * L, 4, 30, ACIDE, 0.45) + `<ellipse cx="${4 * L}" cy="5" rx="20" ry="4" fill="${ACIDE}" opacity=".55"/>`
      + `<path d="M-11,-16 L-11,-27 Q-10,-31 -8,-29 L-6,-23 L-3,-26 L-1,-21 L2,-24 L4,-19 L7,-23 L9,-21 L11,-24 L11,-16 Z" fill="#B8FF8A" fill-opacity=".12" stroke="#C8FFF4" stroke-width=".8" stroke-opacity=".7"/>`
      + `<path d="M-10,-16 L-10,-18 Q0,-20 10,-18 L10,-16 Z" fill="#3A5A2A"/>`
      + [[-16, 3, 20], [12, 6, -30], [18, 2, 60]].map(([x, y, a]) => `<path d="M${x},${y} l2.6,-1 l-.6,2.4 Z" fill="#C8FFF4" opacity=".7" transform="rotate(${a} ${x} ${y})"/>`).join('');
  } else {
    s += lueur(`${p}v`, 0, -30, 34, ACIDE, 0.5)
      + `<path d="M-11,-16 L-11,-34 Q0,-54 11,-34 L11,-16 Z" fill="#B8FF8A" fill-opacity=".22" stroke="#C8FFF4" stroke-width="1.3"/>`
      + `<path d="M-10,-16 L-10,-24 Q0,-28 10,-24 L10,-16 Z" fill="${ACIDE}" fill-opacity=".9"/>`
      + [[-4, -26, 1.4], [3, -31, 1], [-1, -37, 0.8], [5, -24, 1.1]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="#F4FFD8" stroke-width=".6">${palpite('opacity', '1;0.2;1', 1.6 + r, x)}</circle>`).join('')
      + trait('M-6,-20 Q-8,-38 0,-45', '#FFFFFF', 1.2, ' stroke-opacity=".7"');
  }
  // (l'alambic de cuivre, son col qui s'élance vers la cloche)
  s += plan(`M${-22 * L},-11 Q${-31 * L},-20 ${-22 * L},-30 Q${-13 * L},-20 ${-22 * L},-11 Z`, '#A8603A', 1.1) + trait(`M${-22 * L},-30 Q${-18 * L},-42 ${-11 * L},${sv ? -34 : -38}`, '#C8784A', 1.6) + lumineux(`M${-24 * L},-27 Q${-28 * L},-21 ${-24 * L},-14`, CHAUD, 0.5)
    + '</g>';
  // ——— la tour ———
  s += `<g clip-path="url(#${p}tc)"><rect x="${-R}" y="-160" width="${2 * R}" height="170" fill="#100822"/>${pierres(R, 0, -150, cote, g)}`
    + `<rect x="${-R}" y="-160" width="${2 * R}" height="170" fill="url(#${p}cy)"/><rect x="${-R}" y="-16" width="${2 * R}" height="18" fill="url(#${p}ao)"/><rect x="${-R}" y="-150" width="${2 * R}" height="22" fill="url(#${p}eav)"/>`
    + (sv ? `<rect x="${-R}" y="-160" width="${2 * R}" height="170" fill="url(#${p}su)"/>${fissure(14 * L, -148, 40, g, -0.2, 1)}${fissure(-20 * L, -2, 30, g, 0.3, -1)}` : '') + '</g>'
    + `<path d="M${-R},0 L${-R},-150 Q0,-158 ${R},-150 L${R},0 Q0,9 ${-R},0 Z" fill="none" stroke="${ENCRE}" stroke-width="1.6"/>`;
  // (la ceinture de bois du deuxième étage, ses consoles)
  s += plan(`M${-R - 4},-92 Q0,-82 ${R + 4},-92 L${R + 4},-86 Q0,-76 ${-R - 4},-86 Z`, '#4A2E1E', 1.1)
    + [-0.7, -0.25, 0.25, 0.7].map(u => plan(`M${P2(u * (R + 2) - 1.4, -82 + (1 - u * u) * 6)} L${P2(u * (R + 2) + 1.4, -82 + (1 - u * u) * 6)} L${P2(u * (R + 1) + 0.6, -74 + (1 - u * u) * 6)} Z`, '#2A1810', 0.6)).join('')
    + trait(`M${-R - 4},-92 Q0,-82 ${R + 4},-92`, mix('#8A5A3A', '#E0A070', 0.4), 0.9);
  // (les fenêtres en arc, la porte cerclée de fer et sa lanterne sur potence)
  s += carreau(`${p}f1`, -16 * L - 5, -68, 10, 15, { arc: true, brise: sv }) + carreau(`${p}f2`, 10 * L - 4.5, -124, 9, 13, { arc: true }) + carreau(`${p}f3`, -14 * L - 3.5, -140, 7, 9, { arc: true, brise: sv });
  s += (sv ? '' : lueur(`${p}pl`, 0, -2, 36, CHAUD, 0.32))
    + plan('M-11,2 L-11,-26 Q0,-38 11,-26 L11,3 Z', '#3A2216', 1.4) + [-6, 0, 6].map(x => trait(`M${x},-30 L${x},2`, '#24140C', 0.9)).join('')
    + [-20, -8].map(y => trait(`M-11,${y} L11,${y}`, '#5A5A6A', 1.6)).join('') + `<circle cx="6" cy="-12" r="1.3" fill="#C8A060"/>`
    + (sv ? planche(0, -16, 28, 32, 3.2) + planche(0, -14, 28, -30, 3.2) : '')
    + trait(`M${-14 * L},-38 L${-21 * L},-38 M${-14 * L},-33 L${-19 * L},-38`, '#2A2438', 1.2) + lanterne(`${p}la`, -21 * L, -38, 3, sv);
  // (le lierre qui grimpe du côté de l'ombre ; mort après l'apocalypse)
  s += lierre(`${p}li`, -26 * L, 0, 104, g, L, sv);
  // (le liseré de lune sur le bord éclairé, le reflet magenta de l'autre côté)
  s += lumineux(`M${(R - 0.5) * L},-4 L${(R - 0.5) * L},-148`, CYAN, 1.1) + trait(`M${(-R + 0.8) * L},-6 L${(-R + 0.8) * L},-146`, MAGENTA, 0.8, ' stroke-opacity=".55"');
  // ——— le toit d'écailles évasé, sa lucarne, l'épi et le croissant ———
  s += plan(TOIT, '#1A0A30', 1.6)
    + `<g clip-path="url(#${p}rc)">${ecailles(46, -146, -272, cote, g)}<path d="${TOIT}" fill="url(#${p}rs)"/>${sv ? trou(`${p}rt`, 18 * L, -184, 11, 14, g) : ''}</g>`
    + `<path d="${TOIT}" fill="none" stroke="${ENCRE}" stroke-width="1.6"/>`
    + lumineux(`M${46 * L},-148 Q${14 * L},-188 0,-270`, MAGENTA, 0.9) + lumineux('M-46,-147 Q0,-132 46,-147', '#C88AFF', 0.7);
  // (la lucarne : son petit toit, sa fenêtre qui luit)
  s += `<g transform="translate(${-14 * L} -180)">${plan('M-8,7 L-8,-5 L8,-5 L8,7 Z', '#24143A', 1)}${carreau(`${p}lu`, -4, -3, 8, 9, { arc: true, appui: false, brise: sv })}${plan('M-11,-4 L0,-15 L11,-4 Z', '#4A2070', 1)}${lumineux(`M${11 * L},-4 L0,-15`, MAGENTA, 0.6)}</g>`;
  if (sv) s += feu(`${p}rf`, 18 * L, -178, 1.1, 0.7);
  // (l'épi de cuivre : sa collerette, sa boule ; la tige de fer, le croissant monté dessus, une étoile au bout ; après
  // l'apocalypse la tige est tordue et le croissant pend)
  s += plan('M-5,-258 L5,-258 L1.6,-272 L-1.6,-272 Z', '#8A4A2A', 0.8) + `<circle cx="0" cy="-276" r="4" fill="#A8603A" stroke="${ENCRE}" stroke-width=".8"/><circle cx="-1.2" cy="-277.4" r="1.2" fill="#FFD0A0" opacity=".8"/>`;
  if (sv) {
    s += trait('M0,-280 L0,-290 L8,-300', ENCRE, 2.6) + trait('M0,-280 L0,-290 L8,-300', '#6A5A7A', 1)
      + `<g transform="translate(9 -301) rotate(118)"><path d="M3,-8 A8,8 0 1,0 3,8 A6,6 0 1,1 3,-8 Z" fill="#6A7A4A" stroke="${ENCRE}" stroke-width="1"/></g>`;
  } else {
    s += trait('M0,-280 L0,-316', ENCRE, 2.8) + trait('M0,-280 L0,-316', '#7A6A9A', 1.1) + `<circle cx="0" cy="-290" r="1.8" fill="#A8603A" stroke="${ENCRE}" stroke-width=".6"/>`
      + lueur(`${p}cr`, 0, -302, 18, ACIDE, 0.55) + `<path d="M3,-310 A8,8 0 1,0 3,-294 A6,6 0 1,1 3,-310 Z" fill="${ACIDE}" stroke="${ENCRE}" stroke-width="1"/>`
      + `<path d="M0,-322 L1,-317 L4,-316 L1,-315 L0,-312 L-1,-315 L-4,-316 L-1,-317 Z" fill="#F4FFD8"/>`;
  }
  // ——— au pied : les tonneaux cerclés, la caisse de fioles qui luisent ———
  const tx = -56 * L;
  s += `<g transform="translate(${tx} 4)">`
    + [[-15 * L, -3], [0, 0]].map(([x, y], i) => plan(`M${x - 7},${y} L${x - 7.6},${y - 16} Q${x},${y - 20} ${x + 7.6},${y - 16} L${x + 7},${y} Q${x},${y + 3} ${x - 7},${y} Z`, i ? '#3A2420' : '#2A1A2A', 1)
      + `<path d="M${x - 3 * L},${y - 1} L${x - 3 * L},${y - 17}" stroke="#05020A" stroke-width="5" opacity=".3"/>`
      + [-4, -12].map(dy => trait(`M${x - 7.4},${y + dy} Q${x},${y + dy + 3} ${x + 7.4},${y + dy}`, '#6A6A7A', 1.2)).join('') + `<ellipse cx="${x}" cy="${y - 17}" rx="7.4" ry="2.4" fill="#4A3028" stroke="${ENCRE}" stroke-width=".8"/>`
      + trait(`M${x - 4},${y - 17.6} L${x + 4},${y - 16.4}`, '#2A1810', 0.5)).join('')
    + bloc(p, `${p}ca`, -14 * L, 8, 22, 8, 10, L, { face: (W, H) => tPlanches(W, H, g, { c: '#4A3020', horiz: true, larg: 4 }), flanc: (W, H) => tPlanches(W, H, g, { c: '#4A3020', horiz: true, larg: 4 }), dessus: (W, H) => `<rect width="${W}" height="${H}" fill="#140A10"/>` })
    + [[-20, '#FF6AD0'], [-15, ACIDE], [-10, CYAN]].map(([x, c], i) => { const [fx, fy] = surBloc(-14 * L, 8, 22, 8, 10, L, (x + 25) / 22, 0.5); const eteinte = sv && i !== 1; return (eteinte ? '' : lueur(`${p}fi${i}`, fx, fy - 4, 7, c, 0.6)) + plan(`M${P2(fx - 1.4, fy)} L${P2(fx - 1.4, fy - 5)} L${P2(fx - 0.6, fy - 6)} L${P2(fx - 0.6, fy - 7.4)} L${P2(fx + 0.6, fy - 7.4)} L${P2(fx + 0.6, fy - 6)} L${P2(fx + 1.4, fy - 5)} L${P2(fx + 1.4, fy)} Z`, eteinte ? '#2A2438' : c, 0.5); }).join('')
    + '</g>';
  if (sv) s += barbeles(-74, 92, 18, 5.5);
  return s;
}

// ═══ la Carrière : la falaise taillée et son hameau ═══
// Un bloc de roche taillé en pierres, l'entrée de la mine boisée (sa lanterne, les cristaux qui luisent au fond), une
// veine de cristal cyan dans le flanc ; dessus, deux maisons et un clocher ; devant, le chevalement et sa roue, le puits
// de mine, les rails et le wagonnet de cristaux ; un amas de cristaux derrière
function carriere(p, cote = 1, sv = false) {
  const g = rnd(83), L = cote;
  const W = 128, H = 62, Dp = 54, cx = -14 * L, D = D3(L), ex = L > 0 ? 34 : W - 34, exa = cx - W / 2 + ex;
  let s = communs(p) + ombre(`${p}o`, 132, 34, 24 * L);
  // (un amas de cristaux derrière, du côté de l'ombre)
  s += [[-76, -4, 22, -18, CYAN], [-68, 0, 16, 10, VIOLET], [-84, 2, 13, -34, CYAN]].map(([x, y, h, a, c], i) => cristal(`${p}k${i}`, cx + x * L * 0.9 - 8 * L, y + 2, h, a * L, c)).join('');
  // ——— le bloc de roche ———
  const veine = (w, h) => `M2,${f(h * 0.8)} L${f(w * 0.3)},${f(h * 0.55)} L${f(w * 0.45)},${f(h * 0.62)} L${f(w * 0.75)},${f(h * 0.3)} L${f(w)},${f(h * 0.22)}`;
  s += bloc(p, `${p}b`, cx, 0, W, H, Dp, L, {
    sv, af: 0.34,
    face: (w, h) => tPierres(w, h, g, { fonce: '#16102A', clair: '#6A5C8E', haut: 10.5, long: 19, lum: 0.55, mousse: 0.18 })
      // (l'entrée de la mine : le noir profond, les cristaux au fond, le boisage, la lanterne)
      + `<defs>${rad(`${p}mi`, ex, h - 6, 30, [[0, '#2A1A40'], [0.6, '#0A0614'], [1, '#05020A']])}</defs>`
      + `<path d="M${P2(ex - 16, h)} L${P2(ex - 16, h - 28)} Q${P2(ex, h - 46)} ${P2(ex + 16, h - 28)} L${P2(ex + 16, h)} Z" fill="url(#${p}mi)" stroke="${ENCRE}" stroke-width="1.2"/>`
      + (sv ? '' : [[-6, 6], [4, 10], [9, 4]].map(([dx, hh], i) => cristal(`${p}mk${i}`, ex + dx, h - 8, hh, dx * 2, CYAN)).join(''))
      + `<rect x="${f(ex - 18)}" y="${f(h - 32)}" width="4" height="32" fill="#4A3020" stroke="${ENCRE}" stroke-width=".7"/><rect x="${f(ex + 14)}" y="${f(h - 32)}" width="4" height="32" fill="#3A2418" stroke="${ENCRE}" stroke-width=".7"/>`
      + `<path d="M${P2(ex - 21, h - 31)} L${P2(ex + 21, h - 33)} L${P2(ex + 21, h - 37)} L${P2(ex - 21, h - 35)} Z" fill="#5A3A26" stroke="${ENCRE}" stroke-width=".8"/>`
      + trait(`M${P2(ex - 16, h - 22)} L${P2(ex - 10, h - 31)} M${P2(ex + 16, h - 22)} L${P2(ex + 10, h - 32)}`, '#3A2418', 2)
      + (sv ? [0, 1, 2, 3].map(i => planche(ex + (g() - 0.5) * 3, h - 6 - i * 7, 38, (g() - 0.5) * 14, 4)).join('') + planche(ex, h - 16, 40, 38, 3.4) : lanterne(`${p}ml`, ex + 10, h - 31, 3, false))
      + (sv ? fissure(ex + 26, 4, 30, g, 0.2, 1) : ''),
    flanc: (w, h) => tPierres(w, h, g, { fonce: '#16102A', clair: '#7A6C9E', haut: 10.5, long: 19, lum: 0.85, mousse: 0.18 })
      // (la veine de cristal qui court dans le flanc)
      + `<path d="${veine(w, h)}" fill="none" stroke="${CYAN}" stroke-width="7" opacity=".18"/><path d="${veine(w, h)}" fill="none" stroke="${CYAN}" stroke-width="1.8"/><path d="${veine(w, h)}" fill="none" stroke="#FFFFFF" stroke-width=".6"/>`,
    dessus: (w, h) => tTerre(w, h, g, { touffes: 40 }) + `<rect width="${f(w)}" height="2" y="${f(h - 2)}" fill="#3A3058"/>`,
    bord: CYAN
  });
  // ——— dessus : le clocher, deux maisons (du fond vers l'avant) ———
  const sur = (u, v) => surBloc(cx, 0, W, H, Dp, L, L > 0 ? u : 1 - u, v);
  const maison = (id, [mx, my], w, h, d, brule) => {
    const t = toit2(p, `${id}t`, mx, my - h, w, d, L, 12, 2.5, { tuiles: { fonce: '#2A0A1E', clair: '#C8406A', larg: 5, haut: 3.6 }, pignon: (W2, H2) => tPlanches(W2, H2, g, { c: '#4A3040', larg: 4 }), g, brule });
    return bloc(p, `${id}b`, mx, my, w, h, d, L, { face: (W2, H2) => tPierres(W2, H2, g, { haut: 5, long: 8, clair: '#7A6A9A' }) + carreau(`${id}w1`, W2 * 0.18, 5, 6, 7, { brise: sv }) + carreau(`${id}w2`, W2 * 0.62, 5, 6, 7, { brise: sv && !brule }),
      flanc: (W2, H2) => tPierres(W2, H2, g, { haut: 5, long: 8, clair: '#8A7AAA', lum: 0.9 }) + carreau(`${id}w3`, W2 * 0.35, 6, 5, 6, { brise: brule }), sv }) + t.svg;
  };
  // (le clocher : sa tour, l'abat-son où luit la cloche, sa flèche finie par une boule et une croix de fer)
  const [kx, ky] = sur(0.55, 0.75);
  s += bloc(p, `${p}cl`, kx, ky, 14, 40, 12, L, { face: (W2, H2) => tPierres(W2, H2, g, { haut: 5, long: 7, clair: '#7A6A9A' }) + carreau(`${p}clw`, 3.5, 5, 7, 11, { arc: true, appui: false, chaud: sv ? ['#3A2A4A', '#1A1024'] : ['#FFE8B0', '#E09A3A'] }) + carreau(`${p}clw2`, 5, 24, 4, 6, { brise: sv }), flanc: (W2, H2) => tPierres(W2, H2, g, { haut: 5, long: 7, clair: '#8A7AAA', lum: 0.9 }), sv });
  const ap = plus([kx, ky - 40], D, 6), ax = ap[0], ay = ap[1] - 24, kn = kx + 7 * L;
  s += plan(poly([[kx - 7 - 1.5, ky - 40 + 0.5], [kx + 7 + 1.5, ky - 40 + 0.5], [ax, ay]]), mix('#2A0A1E', '#C8406A', 0.35), 1)
    + plan(poly([[kn + 1.5 * L, ky - 40 + 0.5], [kn + D[0] * 12 + 1.5 * L, ky - 40 + D[1] * 12], [ax, ay]]), mix('#2A0A1E', '#C8406A', 0.75), 1)
    + lumineux(`M${P2(kn + D[0] * 12 + 1.5 * L, ky - 40 + D[1] * 12)} L${P2(ax, ay)}`, MAGENTA, 0.5)
    + `<circle cx="${f(ax)}" cy="${f(ay - 1.6)}" r="1.8" fill="#A8603A" stroke="${ENCRE}" stroke-width=".5"/>` + trait(`M${P2(ax, ay - 3)} L${P2(ax, ay - 11)} M${P2(ax - 2.6, ay - 8)} L${P2(ax + 2.6, ay - 8)}`, '#5A5070', 1);
  s += maison(`${p}m2`, sur(0.8, 0.45), 26, 17, 15, false) + maison(`${p}m1`, sur(0.22, 0.32), 30, 19, 17, sv);
  // ——— devant : le puits de mine, le chevalement et sa roue ———
  const hx = cx + 40 * L, hy = 22;
  s += `<ellipse cx="${f(hx)}" cy="${f(hy)}" rx="14" ry="4.6" fill="#4A4068" stroke="${ENCRE}" stroke-width="1"/><ellipse cx="${f(hx)}" cy="${f(hy)}" rx="10" ry="3" fill="#05020A"/>`;
  const poutre = (x0, y0, x2, y2, e = 3, c = '#4A3020') => { const n = unite([y2 - y0, -(x2 - x0)]); return plan(poly([[x0 - n[0] * e / 2, y0 - n[1] * e / 2], [x2 - n[0] * e / 2, y2 - n[1] * e / 2], [x2 + n[0] * e / 2, y2 + n[1] * e / 2], [x0 + n[0] * e / 2, y0 + n[1] * e / 2]]), c, 0.7) + trait(`M${P2(x0 - n[0] * e * 0.3, y0 - n[1] * e * 0.3)} L${P2(x2 - n[0] * e * 0.3, y2 - n[1] * e * 0.3)}`, '#8A6A50', 0.5, ' opacity=".7"'); };
  const tete = [hx, hy - 84], jambe = y => 15 * (y - tete[1]) / (hy - tete[1]);
  s += `<g${sv ? ` transform="rotate(${14 * L} ${f(hx)} ${hy})"` : ''}>`
    + poutre(hx + 28 * L, hy - 4, tete[0] + 3 * L, tete[1] + 8, 3, '#3A2418')
    + poutre(hx - 15, hy, tete[0] - 1, tete[1] + 2) + poutre(hx + 15, hy, tete[0] + 1, tete[1] + 2)
    + [[-10, -40], [-40, -66]].map(([ya, yb]) => poutre(hx - jambe(hy + ya), hy + ya, hx + jambe(hy + yb), hy + yb, 1.8, '#3A2418') + poutre(hx + jambe(hy + ya), hy + ya, hx - jambe(hy + yb), hy + yb, 1.8, '#3A2418')).join('')
    + [-10, -40, -66].map(ya => poutre(hx - jambe(hy + ya) - 1, hy + ya, hx + jambe(hy + ya) + 1, hy + ya, 2.2)).join('')
    // (la roue : sa jante, ses rayons, son moyeu ; le câble qui plonge dans le puits, la benne)
    + `<circle cx="${f(tete[0])}" cy="${f(tete[1])}" r="12" fill="none" stroke="${ENCRE}" stroke-width="3.6"/><circle cx="${f(tete[0])}" cy="${f(tete[1])}" r="12" fill="none" stroke="#5A5A70" stroke-width="2"/>`
    + [0, 1, 2, 3, 4, 5].filter(i => !(sv && i % 2)).map(i => { const a = i * Math.PI / 3 + 0.3; return trait(`M${P2(tete[0], tete[1])} L${P2(tete[0] + Math.cos(a) * 11, tete[1] + Math.sin(a) * 11)}`, '#4A4A60', 1.1); }).join('')
    + `<circle cx="${f(tete[0])}" cy="${f(tete[1])}" r="2.4" fill="#8A8098" stroke="${ENCRE}" stroke-width=".7"/>`
    + lumineux(`M${P2(tete[0] + 12 * L * Math.cos(1.2), tete[1] - 12 * Math.sin(1.2))} A12,12 0 0,${L > 0 ? 1 : 0} ${P2(tete[0] + 12 * L, tete[1])}`, CYAN, 0.6)
    + (sv ? trait(`M${P2(tete[0] + 12 * L, tete[1])} Q${P2(tete[0] + 16 * L, tete[1] + 20)} ${P2(tete[0] + 10 * L, tete[1] + 34)}`, '#8A7A6A', 0.8)
      : trait(`M${P2(tete[0] + 12 * L, tete[1])} L${P2(hx + 12 * L, hy - 30)}`, '#8A7A6A', 0.8) + plan(poly([[hx + 8 * L, hy - 30], [hx + 16 * L, hy - 30], [hx + 15 * L, hy - 22], [hx + 9 * L, hy - 22]]), '#3A3448', 0.7)
        + cristal(`${p}bk`, hx + 12 * L, hy - 29, 6, 10, CYAN))
    + '</g>';
  // ——— les rails qui sortent de la mine, le wagonnet de cristaux ———
  const rail = k => `M${P2(exa + k * 8, 0)} L${P2(exa + k * 11 - 8 * L, 26)}`;
  s += [0.1, 0.35, 0.6, 0.85].map(t => trait(`M${P2(exa - 8 - 3 * t - 8 * L * t, t * 26)} L${P2(exa + 8 + 3 * t - 8 * L * t, t * 26)}`, '#2A1810', 2.2)).join('')
    + trait(rail(-1), '#6A6A80', 1.3) + trait(rail(1), '#6A6A80', 1.3) + trait(rail(1), '#C8D0E8', 0.4, ' opacity=".7"');
  const wx = exa - 4 * L, wy = 16;
  s += `<g${sv ? ` transform="rotate(${-22 * L} ${f(wx)} ${wy})"` : ''}>` + [-6, 6].map(dx => `<circle cx="${f(wx + dx)}" cy="${wy + 1}" r="2.6" fill="#2A2638" stroke="${ENCRE}" stroke-width=".7"/>`).join('')
    + bloc(p, `${p}w`, wx, wy - 1, 20, 9, 9, L, { face: (W2, H2) => `<rect width="${W2}" height="${H2}" fill="#3A3650"/>` + [2, W2 - 2].map(x => `<circle cx="${x}" cy="2" r=".6" fill="#9A90B0"/><circle cx="${x}" cy="${H2 - 2}" r=".6" fill="#9A90B0"/>`).join(''), flanc: (W2, H2) => `<rect width="${W2}" height="${H2}" fill="#5A5470"/>`, dessus: (W2, H2) => `<rect width="${W2}" height="${H2}" fill="#140E1E"/>` })
    + [[-5, 7, -14, CYAN], [1, 9, 8, CYAN], [6, 6, 24, VIOLET]].map(([dx, h, a, c], i) => { const [qx, qy] = surBloc(wx, wy - 1, 20, 9, 9, L, 0.5 + dx / 20, 0.5); return cristal(`${p}wk${i}`, qx, qy + 1, h, a, c); }).join('') + '</g>';
  // (des éclats de roche au pied)
  s += [[-60, 6], [-40, 10], [62, 6], [-6, 30], [30, 32]].map(([x, y], i) => { const t = 3 + g() * 3; return plan(poly([[x * L - t, y], [x * L - t * 0.5, y - t * 0.8], [x * L + t * 0.6, y - t * 0.6], [x * L + t, y]]), i % 2 ? '#4A4068' : '#3A3054', 0.6); }).join('');
  if (sv) s += sacs(Math.min(cx - 60 * L, cx - 30 * L), Math.max(cx - 60 * L, cx - 30 * L), 12, 2, g) + barbeles(cx - 66, cx + 72, 34, 5);
  return s;
}

// ═══ le Puits : la fontaine de l'ange ═══
// Un bassin rond de pierres (son mur qui suit la courbe, sa margelle), son eau cyan qui luit et ses rides, ses
// nénuphars ; au milieu, la colonne, la vasque d'où l'eau retombe en rideau ; dessus, l'ange de pierre pâle, ses ailes,
// son auréole, l'eau qui coule de son urne ; derrière, un arc-en-ciel de néon qui s'efface au sol
function puits(p, cote = 1, sv = false) {
  const g = rnd(91), L = cote, RX = 64, RY = 20, HB = 15, yc = -RY - HB, yw = yc + 1.5;
  // (un filet d'eau qui coule : un trait en pointillé qui défile)
  const coule = (d, w, dur, b = 0) => `<path d="${d}" fill="none" stroke="#C8FFF8" stroke-width="${f(w)}" stroke-linecap="round" stroke-dasharray="${f(w * 3)} ${f(w * 3)}" opacity=".8"><animate attributeName="stroke-dashoffset" values="${f(w * 6)};0" dur="${dur}s" begin="${f(-b)}s" repeatCount="indefinite"/></path>`;
  let s = communs(p);
  // ——— l'arc-en-ciel de néon (pas après l'apocalypse) ———
  if (!sv) {
    s += `<defs><linearGradient id="${p}am" gradientUnits="userSpaceOnUse" x1="0" y1="-20" x2="0" y2="-110"><stop offset="0" stop-color="#FFFFFF" stop-opacity="0"/><stop offset=".55" stop-color="#FFFFFF" stop-opacity="1"/></linearGradient><mask id="${p}ak" maskUnits="userSpaceOnUse" x="-140" y="-200" width="280" height="200"><rect x="-140" y="-200" width="280" height="200" fill="url(#${p}am)"/></mask></defs>`
      + `<g mask="url(#${p}ak)" opacity=".75">${[[100, MAGENTA], [94, CHAUD], [88, ACIDE], [82, CYAN], [76, VIOLET]].map(([r, c]) => trait(`M${-r},-20 A${r},${r * 0.92} 0 0,1 ${r},-20`, c, 7, ' stroke-opacity=".14"') + trait(`M${-r},-20 A${r},${r * 0.92} 0 0,1 ${r},-20`, c, 2.2)).join('')}</g>`;
  }
  s += ombre(`${p}o`, 96, 26, 6 * L);
  // ——— le mur du bassin, sa margelle ———
  s += anneau(RX, RY, yc, HB, cote, g) + `<path d="M${P2(RX, yc)} A${RX},${RY} 0 0,1 ${P2(-RX, yc)} L${P2(-RX, yc + HB)} A${RX},${RY} 0 0,0 ${P2(RX, yc + HB)} Z" fill="url(#${p}AO)" stroke="${ENCRE}" stroke-width="1.3"/>`
    + `<defs>${lin(`${p}ml`, -RX, 0, RX, 0, [[0, cote > 0 ? '#2A2448' : '#9A90C0'], [1, cote > 0 ? '#9A90C0' : '#2A2448']])}${rad(`${p}eau`, 0, yw, RX, sv ? [[0, '#1E4A2A'], [0.7, '#0E2A1E'], [1, '#081A14']] : [[0, '#5AF0E0'], [0.35, '#1E9A9A'], [1, '#0A3A48']])}</defs>`;
  const ro = RX + 4, ryo = RY + 1.6, ri = RX - 5, ryi = RY - 2.6;
  s += `<path d="M${-ro},${yc} A${ro},${ryo} 0 1,0 ${ro},${yc} A${ro},${ryo} 0 1,0 ${-ro},${yc} Z M${-ri},${yc} A${ri},${ryi} 0 1,1 ${ri},${yc} A${ri},${ryi} 0 1,1 ${-ri},${yc} Z" fill="url(#${p}ml)" fill-rule="evenodd" stroke="${ENCRE}" stroke-width="1.1"/>`
    + Array.from({ length: 18 }, (_, i) => { const a = (i / 18) * Math.PI * 2; return trait(`M${P2(Math.cos(a) * ri, yc + Math.sin(a) * ryi)} L${P2(Math.cos(a) * ro, yc + Math.sin(a) * ryo)}`, '#140E24', 0.7); }).join('')
    + `<path d="M${P2(-ri, yc)} A${ri},${ryi} 0 0,0 ${P2(ri, yc)}" fill="none" stroke="#C8C0E8" stroke-width=".6" opacity=".5"/>`
    + lumineux(`M${P2(ro * 0.3 * L, yc + ryo * 0.95)} A${ro},${ryo} 0 0,${L > 0 ? 0 : 1} ${P2(ro * L, yc)}`, CYAN, 0.7);
  // ——— l'eau ———
  s += `<ellipse cx="0" cy="${yc}" rx="${ri}" ry="${ryi}" fill="url(#${p}eau)"/>`;
  if (sv) {
    s += [[-26, 2, 9], [18, -3, 7], [30, 4, 5]].map(([x, y, r], i) => lueur(`${p}ac${i}`, x, yc + y, r * 2, ACIDE, 0.35)).join('')
      + planche(-18, yc + 4, 22, 12, 3) + planche(24, yc - 2, 16, -26, 2.6);
  } else {
    s += lueur(`${p}el`, 0, yc - 10, 70, CYAN, 0.22)
      + [16, 28, 42].map((r, i) => `<ellipse cx="0" cy="${yc + 1}" rx="${r}" ry="${f(r * 0.3)}" fill="none" stroke="#B8FFF8" stroke-width=".6">${palpite('opacity', '0.1;0.6;0.1', 3, i)}</ellipse>`).join('')
      // (les nénuphars, leurs fleurs qui luisent)
      + [[-40, 4, '#FF6AD0'], [36, 6, '#FFFFFF'], [-24, 10, ACIDE]].map(([x, y, c], i) => `<ellipse cx="${x}" cy="${f(yc + y)}" rx="6" ry="2.2" fill="#1E7A52" stroke="${ENCRE}" stroke-width=".5"/><path d="M${P2(x, yc + y)} l6,-.4 l-.6,1.6 Z" fill="#0E3A2A"/>` + lueur(`${p}n${i}`, x - 1, yc + y - 1.6, 6, c, 0.6) + `<circle cx="${x - 1}" cy="${f(yc + y - 1.4)}" r="1.4" fill="${c}"/>`).join('');
  }
  // ——— la colonne, la vasque ———
  const yv = -76;
  s += `<defs>${lin(`${p}co`, -7, 0, 7, 0, [[0, cote > 0 ? '#1E1838' : '#8A80B0'], [1, cote > 0 ? '#8A80B0' : '#1E1838']])}</defs>`
    + plan(`M-7,${yc} L-6,${yv + 6} L6,${yv + 6} L7,${yc} Q0,${yc + 3} -7,${yc} Z`, `url(#${p}co)`, 1) + [yc - 6, yv + 14].map(y => trait(`M-7,${y} Q0,${y + 2.2} 7,${y}`, '#05020E', 0.8, ' opacity=".6"')).join('')
    + plan(`M-25,${yv} Q-20,${yv + 14} 0,${yv + 15} Q20,${yv + 14} 25,${yv} Z`, `url(#${p}ml)`, 1.1)
    + `<ellipse cx="0" cy="${yv}" rx="25" ry="7" fill="url(#${p}ml)" stroke="${ENCRE}" stroke-width="1"/><ellipse cx="0" cy="${yv}" rx="21" ry="5.2" fill="${sv ? '#1A1424' : '#3ADAD0'}"/>`
    + (sv ? fissure(-12, yv + 2, 12, g, 0.3, 1) : lueur(`${p}vl`, 0, yv, 30, CYAN, 0.3)
      // (le rideau d'eau qui retombe de la vasque dans le bassin)
      + [-22, -15, -8, 8, 15, 22].map((x, i) => coule(`M${P2(x, yv + 4)} Q${P2(x * 1.35, yv + 10)} ${P2(x * 1.5, yw - 2)}`, 0.8, 0.7, i * 0.1)).join(''));
  // ——— l'ange de pierre ———
  s += `<defs>${lin(`${p}an`, -14, 0, 14, 0, [[0, cote > 0 ? '#3A3460' : '#BEB6E4'], [1, cote > 0 ? '#BEB6E4' : '#3A3460']])}</defs>`;
  const aile = sg => `M${P2(sg * 2, -118)} Q${P2(sg * 14, -134)} ${P2(sg * 22, -150)} Q${P2(sg * 26, -132)} ${P2(sg * 20, -112)} Q${P2(sg * 18, -106)} ${P2(sg * 15, -108)} Q${P2(sg * 14, -102)} ${P2(sg * 10, -104)} Q${P2(sg * 8, -100)} ${P2(sg * 4, -104)} Z`;
  s += plan(`M-8,${yv - 1} L-7,${yv - 7} L7,${yv - 7} L8,${yv - 1} Z`, `url(#${p}co)`, 0.8);
  // (les ailes ; après l'apocalypse, l'une est brisée net)
  s += plan(aile(-L), `url(#${p}an)`, 1) + [0.35, 0.6, 0.82].map(t => trait(`M${P2(-L * 4, -110)} Q${P2(-L * 14 * t, -122 - 10 * t)} ${P2(-L * (8 + 14 * t), -130 - 12 * t)}`, '#2A2448', 0.5, ' opacity=".6"')).join('');
  s += sv ? plan(`M${P2(L * 2, -118)} L${P2(L * 9, -124)} L${P2(L * 8, -119)} L${P2(L * 11, -117)} L${P2(L * 6, -108)} L${P2(L * 4, -104)} Z`, `url(#${p}an)`, 1)
    : plan(aile(L), `url(#${p}an)`, 1) + lumineux(`M${P2(L * 22, -150)} Q${P2(L * 26, -132)} ${P2(L * 20, -112)}`, CYAN, 0.5);
  // (la robe et ses plis, le buste, la tête et l'auréole, le bras qui tient l'urne)
  s += plan(`M-8,${yv - 7} Q-9,-96 -5,-114 L5,-114 Q9,-96 8,${yv - 7} Z`, `url(#${p}an)`, 1) + [-3, 1, 5].map(x => trait(`M${x},${yv - 8} Q${x - 1},-98 ${f(x * 0.6)},-112`, '#2A2448', 0.5, ' opacity=".55"')).join('')
    + plan('M-5,-114 Q-5.6,-120 -3,-122 L3,-122 Q5.6,-120 5,-114 Z', `url(#${p}an)`, 0.9);
  if (sv) {
    s += plan('M-1.6,-122 L-1.6,-125 L-0.4,-124 L0.6,-126 L1.6,-124.4 L1.6,-122 Z', '#6A6090', 0.6)
      + [[-20, 6], [-14, 9], [22, 7]].map(([x, y]) => plan(poly([[x * L - 3, y], [x * L - 1, y - 3], [x * L + 2.6, y - 2], [x * L + 3, y]]), '#6A6090', 0.6)).join('');
  } else {
    s += `<circle cx="0" cy="-127" r="4.4" fill="url(#${p}an)" stroke="${ENCRE}" stroke-width=".9"/>` + trait('M-3.6,-129 Q0,-133 3.6,-129', '#2A2448', 0.6)
      + lueur(`${p}au`, 0, -134, 10, CYAN, 0.5) + `<ellipse cx="0" cy="-134" rx="5.4" ry="1.7" fill="none" stroke="#C8FFF8" stroke-width="1"/>`
      + trait(`M${P2(L * 3, -119)} Q${P2(L * 8, -116)} ${P2(L * 9, -110)}`, ENCRE, 3) + trait(`M${P2(L * 3, -119)} Q${P2(L * 8, -116)} ${P2(L * 9, -110)}`, '#9A90C0', 1.6);
    // (l'urne penchée, l'eau qui en coule jusque dans la vasque)
    s += `<g transform="translate(${f(L * 11)} -110) rotate(${f(L * 40)})">${plan('M-3,-4 Q-4.6,0 -2.6,4 L2.6,4 Q4.6,0 3,-4 Z', `url(#${p}an)`, 0.8)}${plan('M-2.2,-4 L2.2,-4 L2.6,-6 L-2.6,-6 Z', '#6A6090', 0.6)}</g>`
      + trait(`M${P2(L * 15, -114)} Q${P2(L * 22, -110)} ${P2(L * 19, yv - 1)}`, CYAN, 4, ' stroke-opacity=".2"') + coule(`M${P2(L * 15, -114)} Q${P2(L * 22, -110)} ${P2(L * 19, yv - 1)}`, 1.2, 0.5)
      + `<circle cx="${f(L * 19)}" cy="${yv - 1}" r="2" fill="#E8FFFC" opacity=".8"/>`;
  }
  s += trait(`M${P2(L * 8, yv - 8)} Q${P2(L * 9, -96)} ${P2(L * 5, -113)}`, CYAN, 0.6, ' opacity=".55"');
  // (après l'apocalypse : la margelle brisée devant, ses pierres tombées, la fissure du mur, le barbelé)
  if (sv) {
    s += plan(`M${P2(-30 * L, yc + ryo - 1)} L${P2(-24 * L, yc + ryo - 6)} L${P2(-14 * L, yc + ryo - 3)} L${P2(-10 * L, yc + ryo + 1)} L${P2(-12 * L, yc + ryo + HB - 2)} L${P2(-28 * L, yc + ryo + HB - 1)} Z`, '#07040E', 1)
      + [[-40, 6], [-30, 10], [-18, 8], [-8, 12]].map(([x, y], i) => { const t = 3 + g() * 3; return plan(poly([[x * L - t, y], [x * L - t * 0.4, y - t], [x * L + t * 0.7, y - t * 0.7], [x * L + t, y]]), i % 2 ? '#6A6090' : '#4A4468', 0.6); }).join('')
      + fissure(30 * L, yc + RY, 12, g, 0.1, 1) + barbeles(-56, 60, 14, 5);
  }
  return s;
}

// ═══ le Bosquet : l'arbre-maison ═══
// Un arbre immense au tronc évasé, ses racines, sa porte ronde, ses fenêtres rondes qui luisent, sa lanterne pendue à
// une branche ; un houppier violet en masses modelées par la lune, ses fruits qui luisent ; un arbre vert derrière, des
// champignons qui luisent au pied, des lucioles
function bosquet(p, cote = 1, sv = false) {
  const g = rnd(101), L = cote;
  let s = communs(p) + ombre(`${p}o`, 112, 30, 4 * L);
  // ——— le houppier : des masses, chacune modelée (son côté lune clair, l'autre sombre), du fond vers l'avant ———
  const masse = (id, x, y, r, [fonce, clair], fruits) => {
    const bosses = [0, 1, 2, 3, 4, 5, 6].map(i => { const a = (i / 7) * Math.PI * 2 + 0.4; return [x + Math.cos(a) * r * 0.62, y + Math.sin(a) * r * 0.5, r * (0.5 + g() * 0.14)]; });
    let m = `<defs>${rad(`${id}r`, x + L * r * 0.45, y - r * 0.45, r * 1.5, [[0, clair], [0.55, mix(clair, fonce, 0.55)], [1, fonce]])}</defs>`;
    m += `<g fill="url(#${id}r)" stroke="${ENCRE}" stroke-width="1.6">${bosses.map(([bx, by, br]) => `<circle cx="${f(bx)}" cy="${f(by)}" r="${f(br)}"/>`).join('')}</g>`
      + `<g fill="url(#${id}r)">${bosses.map(([bx, by, br]) => `<circle cx="${f(bx)}" cy="${f(by)}" r="${f(br)}"/>`).join('')}<circle cx="${f(x)}" cy="${f(y)}" r="${f(r * 0.72)}"/></g>`;
    // (les feuilles qui accrochent la lune, en petits croissants)
    for (let i = 0; i < r * 0.6; i++) { const a = g() * Math.PI * 2, d = g() * r * 0.8, lx = x + Math.cos(a) * d, ly = y + Math.sin(a) * d * 0.8, t = (lx - x) * L / r; if (t > -0.2) m += `<path d="M${P2(lx - 2, ly)} Q${P2(lx, ly - 1.8)} ${P2(lx + 2, ly)}" fill="none" stroke="${mix(clair, '#FFFFFF', 0.35)}" stroke-width=".6" opacity="${f(0.3 + t * 0.5)}"/>`; }
    if (fruits) for (let i = 0; i < 3; i++) { const fx = x + (g() - 0.5) * r, fy = y + (g() - 0.3) * r * 0.6, c = [MAGENTA, ACIDE, '#FF8AE0'][i]; m += lueur(`${id}f${i}`, fx, fy, 6, c, 0.6) + `<circle cx="${f(fx)}" cy="${f(fy)}" r="1.5" fill="${c}" stroke="${ENCRE}" stroke-width=".4"/>`; }
    return m;
  };
  const VIO = sv ? ['#140C14', '#3A2A2A'] : ['#22093E', '#9A54E8'], VIOs = sv ? ['#0E080E', '#2A1E20'] : ['#160628', '#5A2A9A'], VER = ['#0A2A22', '#2FB070'];
  // (l'arbre vert, derrière, du côté de l'ombre ; mort après l'apocalypse : ses branches nues)
  s += plan(`M${P2(-50 * L - 5, -2)} Q${P2(-50 * L - 3, -40)} ${P2(-46 * L - 4, -82)} L${P2(-46 * L + 4, -82)} Q${P2(-50 * L + 3, -40)} ${P2(-50 * L + 6, -2)} Z`, '#2A1A1E', 1);
  if (sv) s += trait(`M${P2(-46 * L, -80)} Q${P2(-54 * L, -96)} ${P2(-62 * L, -112)} M${P2(-46 * L, -80)} Q${P2(-40 * L, -100)} ${P2(-36 * L, -118)} M${P2(-56 * L, -98)} L${P2(-66 * L, -104)} M${P2(-39 * L, -104)} L${P2(-30 * L, -110)}`, '#1E1418', 2.4);
  else s += [[-60, -100, 20], [-38, -104, 18], [-50, -124, 22]].map(([x, y, r], i) => masse(`${p}v${i}`, x * L, y, r, VER, false)).join('');
  // (les masses du fond, sombres)
  const fond = sv ? [[-30, -168, 18], [28, -176, 16]] : [[-34, -170, 26], [30, -178, 26], [0, -194, 26]];
  s += fond.map(([x, y, r], i) => masse(`${p}h${i}`, x * L, y, r, VIOs, false)).join('');
  // ——— le tronc, ses racines, ses branches maîtresses ———
  const T = `M-36,2 Q-26,-2 -22,-20 Q-16,-50 -15,-100 Q-24,-118 -40,-140 L-32,-146 Q-18,-128 -8,-120 Q-2,-146 2,-166 L10,-164 Q8,-140 10,-122 Q22,-134 34,-150 L40,-142 Q26,-124 16,-104 Q16,-50 22,-20 Q26,-2 38,2 Q0,10 -36,2 Z`;
  s += `<defs>${lin(`${p}tr`, -24, 0, 24, 0, [[0, cote > 0 ? '#120A14' : '#6A4A4E'], [0.5, '#3A262C'], [1, cote > 0 ? '#6A4A4E' : '#120A14']])}<clipPath id="${p}tk"><path d="${T}"/></clipPath></defs>`
    + plan(T, `url(#${p}tr)`, 1.4)
    + `<g clip-path="url(#${p}tk)">${Array.from({ length: 16 }, (_, i) => { const x = -24 + i * 3.2 + (g() - 0.5) * 2; return trait(`M${P2(x, 4)} Q${P2(x * 0.7 + (g() - 0.5) * 6, -60)} ${P2(x * 0.5 + (g() - 0.5) * 8, -170)}`, i % 3 ? '#1A1016' : '#7A5A5E', i % 3 ? 0.9 : 0.5, ' opacity=".7"'); }).join('')}`
    + `<rect x="-40" y="-20" width="80" height="24" fill="url(#${p}AO)"/>${sv ? `<rect x="-40" y="-170" width="80" height="174" fill="url(#${p}SU)"/>` : ''}</g>`
    + lumineux(`M${P2(L * 21, -20)} Q${P2(L * 15, -50)} ${P2(L * 16, -102)}`, CYAN, 0.7);
  // (les racines qui s'étalent)
  s += [[-1, 30, 8], [1, 34, 6], [-1, 18, 12], [1, 20, 11]].map(([sg, l, y]) => plan(`M${P2(sg * 14, -4)} Q${P2(sg * (14 + l * 0.5), y * 0.2 - 4)} ${P2(sg * (14 + l), y * 0.4 + 2)} Q${P2(sg * (14 + l * 0.5), y * 0.2)} ${P2(sg * 8, 2)} Z`, `url(#${p}tr)`, 0.9)).join('');
  // ——— la porte ronde, sa marche, les fenêtres rondes ———
  s += (sv ? '' : lueur(`${p}pl`, 0, -10, 30, CHAUD, 0.35))
    + `<path d="M-10,2 L-10,-14 A10,10 0 0,1 10,-14 L10,2 Z" fill="${sv ? '#05020A' : '#FFB85A'}" stroke="${ENCRE}" stroke-width="1.2"/>`
    + `<path d="M-8.6,2 L-8.6,-14 A8.6,8.6 0 0,1 8.6,-14 L8.6,2 Z" fill="#4A2E1E"/>` + [-4.3, 0, 4.3].map(x => trait(`M${x},${f(-14 - Math.sqrt(Math.max(0, 74 - x * x)))} L${x},2`, '#2A1810', 0.8)).join('')
    + `<circle cx="0" cy="-14" r="2.6" fill="${sv ? '#07040E' : '#FFD08A'}" stroke="#2A1810" stroke-width=".8"/><circle cx="5" cy="-6" r="1" fill="#C8A060"/>`
    + (sv ? planche(0, -10, 24, 28, 3) + planche(0, -6, 24, -26, 3) : '')
    + `<path d="M-12,4 Q0,8 12,4 L12,6 Q0,10 -12,6 Z" fill="#4A4068" stroke="${ENCRE}" stroke-width=".6"/>`;
  const rond = (id, x, y, r) => `${sv ? '' : lueur(`${id}l`, x, y, r * 3, CHAUD, 0.45)}<circle cx="${f(x)}" cy="${f(y)}" r="${f(r + 1.8)}" fill="#5A3A26" stroke="${ENCRE}" stroke-width=".9"/><circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="${sv ? '#07040E' : '#FFC870'}"/>`
    + (sv ? `<path d="M${P2(x - r, y - r * 0.2)} L${P2(x, y)} L${P2(x - r * 0.4, y + r)} Z" fill="#3A3050"/>` + planche(x, y, r * 2.6, 30, 2) : trait(`M${P2(x - r, y)} L${P2(x + r, y)} M${P2(x, y - r)} L${P2(x, y + r)}`, '#3A2418', 0.8));
  s += rond(`${p}r1`, -6 * L, -54, 5) + rond(`${p}r2`, 7 * L, -84, 4.2);
  // ——— les masses de devant, éclairées, leurs fruits ; après l'apocalypse : clairsemées, mortes, en feu ———
  const devant = sv ? [[-38, -140, 18], [36, -146, 15]] : [[-42, -142, 26], [40, -150, 26], [-14, -158, 28], [16, -170, 26], [-4, -134, 22]];
  s += devant.map(([x, y, r], i) => masse(`${p}d${i}`, x * L, y, r, VIO, !sv)).join('');
  if (sv) s += trait(`M${P2(-36 * L, -144)} Q${P2(-44 * L, -150)} ${P2(-52 * L, -160)} M${P2(37 * L, -148)} Q${P2(44 * L, -158)} ${P2(52 * L, -168)} M${P2(6 * L, -164)} Q${P2(2 * L, -178)} ${P2(-4 * L, -192)} M${P2(6 * L, -164)} Q${P2(12 * L, -176)} ${P2(18 * L, -188)}`, '#1E1418', 2.2)
    + feu(`${p}fe1`, 22 * L, -168, 1.2, 0.2) + feu(`${p}fe2`, -36 * L, -150, 0.9, 0.9);
  // (la lanterne pendue à la branche de droite, par sa chaîne)
  s += lanterne(`${p}la`, 30 * L, -128, 12, sv);
  // ——— au pied : les champignons qui luisent (verts acides après l'apocalypse), les lucioles ———
  s += [[-40, 8, 9, MAGENTA], [-30, 12, 6, VIOLET], [32, 10, 8, MAGENTA], [44, 6, 5.5, CYAN], [-48, 4, 5, CYAN]].map(([x, y, r, c], i) => {
    const cc = sv ? ACIDE : c;
    return lueur(`${p}c${i}`, x * L, y - r, r * 2.4, cc, 0.5) + plan(`M${P2(x * L - r * 0.25, y)} Q${P2(x * L - r * 0.3, y - r * 0.6)} ${P2(x * L - r * 0.2, y - r)} L${P2(x * L + r * 0.2, y - r)} Q${P2(x * L + r * 0.3, y - r * 0.6)} ${P2(x * L + r * 0.25, y)} Z`, '#C8C0E0', 0.6)
      + plan(`M${P2(x * L - r, y - r * 0.9)} Q${P2(x * L - r, y - r * 1.9)} ${P2(x * L, y - r * 1.9)} Q${P2(x * L + r, y - r * 1.9)} ${P2(x * L + r, y - r * 0.9)} Q${P2(x * L, y - r * 1.1)} ${P2(x * L - r, y - r * 0.9)} Z`, mix(cc, '#05020E', 0.25), 0.7)
      + `<circle cx="${f(x * L - r * 0.35)}" cy="${f(y - r * 1.45)}" r="${f(r * 0.16)}" fill="#FFFFFF" opacity=".85"/><circle cx="${f(x * L + r * 0.3)}" cy="${f(y - r * 1.55)}" r="${f(r * 0.12)}" fill="#FFFFFF" opacity=".85"/>`;
  }).join('');
  if (!sv) s += [[-56, -60], [52, -80], [-24, -96], [60, -40], [-62, -120]].map(([x, y], i) => `<circle cx="${x * L}" cy="${y}" r="1.3" fill="${ACIDE}">${palpite('opacity', '0;1;0', 2 + i * 0.4, i * 0.7)}</circle>`).join('');
  if (sv) s += barbeles(-62, 66, 20, 5);
  return s;
}

// ═══ le Foyer : la maison à colombages et son phare ═══
// Une maison à colombages en volume, son toit d'écailles violettes, sa cheminée qui fume, ses fenêtres qui luisent et
// leur jardinière, sa porte et sa lanterne sur potence ; derrière, côté mer, le phare : ses bandes, son balcon et sa
// rambarde, la lanterne cyan et son faisceau, son dôme fini par un épi ; un carré de légumes devant
function foyer(p, cote = 1, sv = false) {
  const g = rnd(113), L = cote, fx = -34 * L;
  let s = communs(p) + ombre(`${p}o`, 116, 30, 0);
  // ——— le phare, côté mer ———
  const yb = -10, yt = -150, rb = 17, rt = 11, rw = t => rb + (rt - rb) * t, yAt = t => yb + (yt - yb) * t;
  // (le faisceau, vers la mer)
  if (!sv) s += `<defs>${lin(`${p}fa`, fx, 0, fx - L * 150, 0, [[0, CYAN, 0.55], [1, CYAN, 0]])}</defs><path d="${poly([[fx, yt - 12], [fx - L * 160, yt - 44], [fx - L * 160, yt + 14]])}" fill="url(#${p}fa)">${palpite('opacity', '0.55;1;0.55', 4)}</path>`;
  s += `<defs>${lin(`${p}ph`, fx - rb, 0, fx + rb, 0, [[0, '#000000', cote > 0 ? 0.6 : 0], [0.4, '#000000', cote > 0 ? 0.3 : 0.08], [0.7, '#000000', cote > 0 ? 0.05 : 0.3], [1, '#000000', cote > 0 ? 0 : 0.6]])}</defs>`;
  // (le socle de pierre)
  s += `<g transform="translate(${fx} 0)">${anneau(22, 6, yb - 2, 10, cote, g, { haut: 5, n: 10 })}</g><ellipse cx="${fx}" cy="${yb - 2}" rx="22" ry="6" fill="#3A3058" stroke="${ENCRE}" stroke-width="1"/>`;
  // (le fût, ses bandes qui suivent la courbe)
  const fut = `M${P2(fx - rb, yb)} L${P2(fx - rt, yt)} A${rt},${rt * 0.3} 0 0,0 ${P2(fx + rt, yt)} L${P2(fx + rb, yb)} A${rb},${rb * 0.3} 0 0,1 ${P2(fx - rb, yb)} Z`;
  const bande = (t0, t1) => `M${P2(fx - rw(t0), yAt(t0))} A${f(rw(t0))},${f(rw(t0) * 0.3)} 0 0,0 ${P2(fx + rw(t0), yAt(t0))} L${P2(fx + rw(t1), yAt(t1))} A${f(rw(t1))},${f(rw(t1) * 0.3)} 0 0,1 ${P2(fx - rw(t1), yAt(t1))} Z`;
  s += `<clipPath id="${p}fc"><path d="${fut}"/></clipPath><g clip-path="url(#${p}fc)"><rect x="${fx - rb}" y="${yt - 6}" width="${2 * rb}" height="${yb - yt + 12}" fill="#BEB6E0"/>`
    + [0.1, 0.4, 0.7].map(t => `<path d="${bande(t, t + 0.15)}" fill="#2A2068"/>`).join('')
    + `<rect x="${fx - rb}" y="${yt - 6}" width="${2 * rb}" height="${yb - yt + 12}" fill="url(#${p}ph)"/>${sv ? `<rect x="${fx - rb}" y="${yt - 6}" width="${2 * rb}" height="${yb - yt + 12}" fill="url(#${p}SU)"/>${fissure(fx + 4 * L, yt + 10, 46, g, -0.1, 1)}` : ''}</g>`
    + `<path d="${fut}" fill="none" stroke="${ENCRE}" stroke-width="1.4"/>` + lumineux(`M${P2(fx + L * (rb - 0.6), yb - 2)} L${P2(fx + L * (rt - 0.6), yt + 2)}`, CYAN, 0.8)
    + carreau(`${p}pw1`, fx - 2.5, yAt(0.6), 5, 9, { arc: true, appui: false, brise: sv }) + carreau(`${p}pw2`, fx - 2.5 + L * 3, yAt(0.28), 5, 9, { arc: true, appui: false });
  // (le balcon et sa rambarde, la lanterne, le dôme et son épi)
  const yg = yt - 2, rg = 17;
  s += `<ellipse cx="${fx}" cy="${yg + 2}" rx="${rg}" ry="5" fill="#140E24" stroke="${ENCRE}" stroke-width="1"/><ellipse cx="${fx}" cy="${yg}" rx="${rg}" ry="5" fill="#3A3058" stroke="${ENCRE}" stroke-width="1"/>`
    + (sv ? lueur(`${p}lr`, fx, yg - 12, 22, '#FF3A2E', 0.35, palpite('opacity', '0.2;1;0.1;0.8;0.2', 2.6)) : lueur(`${p}lc`, fx, yg - 12, 44, CYAN, 0.55))
    + `<path d="M${P2(fx - 9, yg)} L${P2(fx - 9, yg - 20)} L${P2(fx + 9, yg - 20)} L${P2(fx + 9, yg)} Z" fill="${sv ? '#0A0814' : '#C8FFF8'}" stroke="${ENCRE}" stroke-width="1.1"/>`
    + (sv ? `<path d="M${P2(fx - 9, yg - 20)} L${P2(fx - 3, yg - 13)} L${P2(fx - 9, yg - 8)} Z M${P2(fx + 9, yg - 4)} L${P2(fx + 4, yg - 8)} L${P2(fx + 9, yg - 14)} Z" fill="#4A5068"/>` : `<circle cx="${fx}" cy="${yg - 10}" r="4" fill="#FFFFFF"/>`)
    + [-4.5, 0, 4.5].map(dx => trait(`M${P2(fx + dx, yg)} L${P2(fx + dx, yg - 20)}`, '#2A2040', 0.9)).join('')
    + Array.from({ length: 13 }, (_, i) => { const a = Math.PI * (i / 12); if (sv && (i === 4 || i === 5 || i === 9)) return ''; const x = fx + Math.cos(a) * rg, y = yg + Math.sin(a) * 5; return trait(`M${P2(x, y)} L${P2(x, y - 6)}`, '#1A1428', 0.8); }).join('')
    + (sv ? trait(`M${P2(fx - rg, yg - 6)} A${rg},5 0 0,0 ${P2(fx - 3, yg - 1)} L${P2(fx + 2, yg + 6)}`, '#5A5070', 1) : trait(`M${P2(fx - rg, yg - 6)} A${rg},5 0 0,0 ${P2(fx + rg, yg - 6)}`, '#5A5070', 1.1))
    + plan(`M${P2(fx - 11, yg - 20)} Q${P2(fx - 11, yg - 34)} ${P2(fx, yg - 35)} Q${P2(fx + 11, yg - 34)} ${P2(fx + 11, yg - 20)} Z`, '#4A2070', 1.1)
    + trait(`M${P2(fx + L * 2, yg - 34)} Q${P2(fx + L * 10, yg - 32)} ${P2(fx + L * 10.6, yg - 22)}`, MAGENTA, 0.8, ' opacity=".8"')
    + `<circle cx="${fx}" cy="${yg - 37}" r="2.2" fill="#A8603A" stroke="${ENCRE}" stroke-width=".6"/>` + plan(`M${P2(fx - 1, yg - 38.6)} L${P2(fx, yg - 46)} L${P2(fx + 1, yg - 38.6)} Z`, '#8A8098', 0.5);
  // ——— la maison à colombages ———
  const hx = 18 * L, w = 58, h = 36, d = 36;
  s += bloc(p, `${p}m`, hx, 0, w, h, d, L, {
    sv,
    face: (W, H) => tColombage(W, H, g) + carreau(`${p}w1`, 5, 6, 10, 9, { brise: sv }) + carreau(`${p}w2`, W - 15, 6, 10, 9, { brise: sv })
      // (la porte, son arc, sa poignée)
      + `<path d="M${P2(W / 2 - 6, H)} L${P2(W / 2 - 6, H - 15)} Q${P2(W / 2, H - 21)} ${P2(W / 2 + 6, H - 15)} L${P2(W / 2 + 6, H)} Z" fill="#3A2216" stroke="${ENCRE}" stroke-width=".9"/>` + trait(`M${P2(W / 2, H - 18)} L${P2(W / 2, H)}`, '#24140C', 0.7)
      + `<circle cx="${f(W / 2 + 3.4)}" cy="${f(H - 7)}" r=".9" fill="#C8A060"/>` + (sv ? planche(W / 2, H - 9, 16, 24, 2.6) + planche(W / 2, H - 6, 16, -22, 2.6) : '')
      // (la jardinière sous la fenêtre)
      + (sv ? '' : [0, 1, 2, 3].map(i => `<circle cx="${f(6 + i * 2.8)}" cy="16.5" r="1.4" fill="${[MAGENTA, ACIDE, '#FF8A5A', CYAN][i]}"/>`).join('')),
    flanc: (W, H) => tColombage(W, H, g, { enduit: '#6A5E94' }) + carreau(`${p}w3`, W * 0.35, 8, 9, 9, { brise: sv }),
    bord: CYAN
  });
  // (la lanterne sur sa potence, à côté de la porte)
  s += trait(`M${P2(hx + 11, -24)} L${P2(hx + 17, -24)} M${P2(hx + 11, -19)} L${P2(hx + 16, -24)}`, '#2A2438', 1.2) + lanterne(`${p}la`, hx + 16, -24, 2, sv);
  // (le toit, la cheminée sur le pan éclairé)
  const t = toit2(p, `${p}t`, hx, -h, w, d, L, 26, 4, { tuiles: { larg: 7, haut: 4.6 }, pignon: (W, H) => tColombage(W, H, g) + `<circle cx="${W / 2}" cy="${H * 0.62}" r="4" fill="${sv ? '#07040E' : '#FFC870'}" stroke="#26141E" stroke-width="1.6"/>`, g, brule: sv });
  s += t.svg;
  const c = plus(plus(t.A, t.Vn, t.Hn * 0.4), t.D, t.dl * 0.7);
  s += cheminee(p, `${p}ch`, c[0], c[1], L, 22, sv, g);
  // ——— le carré de légumes devant, l'allée de pierres plates ———
  const px = 52 * L;
  s += bloc(p, `${p}cl`, px, 16, 24, 5, 12, L, { face: (W, H) => tPlanches(W, H, g, { c: '#4A3020', horiz: true, larg: 2.5 }), flanc: (W, H) => tPlanches(W, H, g, { c: '#4A3020', horiz: true, larg: 2.5 }), dessus: (W, H) => `<rect width="${W}" height="${H}" fill="#1A0E14"/>` });
  for (let i = 0; i < 6; i++) { const [qx, qy] = surBloc(px, 16, 24, 5, 12, L, 0.15 + (i % 3) * 0.35, i < 3 ? 0.75 : 0.3); s += sv ? trait(`M${P2(qx - 2, qy)} L${P2(qx + 1, qy - 3)}`, '#3A2E26', 1) : `<circle cx="${f(qx - 1.6)}" cy="${f(qy - 1.6)}" r="2.6" fill="#1E7A52" stroke="${ENCRE}" stroke-width=".5"/><circle cx="${f(qx + 1.4)}" cy="${f(qy - 1.2)}" r="2.2" fill="#2FB070" stroke="${ENCRE}" stroke-width=".5"/>`; }
  s += [[4, 6], [-2, 13], [3, 20]].map(([dx, y]) => `<ellipse cx="${f(hx + dx * L)}" cy="${y}" rx="5" ry="1.8" fill="#4A4068" stroke="${ENCRE}" stroke-width=".6"/>`).join('');
  if (sv) s += sacs(Math.min(hx - 30 * L, hx - 8 * L), Math.max(hx - 30 * L, hx - 8 * L), 12, 2, g) + barbeles(-70, 72, 30, 5);
  return s;
}

// ═══ le Potager : les carrés de culture ═══
// Deux carrés surélevés en volume, leurs rangs de choux, de fanes et de fleurs qui luisent ; un arbre fruitier derrière,
// ses fruits orangés ; deux fleurs géantes de néon ; un petit arc-en-ciel posé sur deux nuages ; la licorne
function potager(p, cote = 1) {
  const g = rnd(127), L = cote;
  let s = communs(p) + ombre(`${p}o`, 120, 30, 0);
  // (l'arbre fruitier, derrière, du côté de l'ombre)
  const ax = -54 * L;
  s += plan(`M${P2(ax - 4, -24)} Q${P2(ax - 2, -50)} ${P2(ax - 3, -70)} L${P2(ax + 3, -70)} Q${P2(ax + 2, -50)} ${P2(ax + 5, -24)} Z`, '#3A262C', 1)
    + `<defs>${rad(`${p}fr`, ax + L * 10, -98, 34, [[0, '#3ACA80'], [0.6, '#16704A'], [1, '#0A2A22']])}</defs>`
    + `<g fill="url(#${p}fr)" stroke="${ENCRE}" stroke-width="1.6">${[[0, -88, 18], [-14, -80, 13], [14, -80, 14], [-8, -100, 13], [9, -101, 12]].map(([x, y, r]) => `<circle cx="${f(ax + x)}" cy="${y}" r="${r}"/>`).join('')}</g>`
    + `<g fill="url(#${p}fr)">${[[0, -88, 18], [-14, -80, 13], [14, -80, 14], [-8, -100, 13], [9, -101, 12]].map(([x, y, r]) => `<circle cx="${f(ax + x)}" cy="${y}" r="${r}"/>`).join('')}</g>`
    + [[-10, -84], [8, -92], [12, -78], [-4, -98], [-14, -76], [2, -80]].map(([x, y], i) => lueur(`${p}fo${i}`, ax + x, y, 5, CHAUD, 0.6) + `<circle cx="${f(ax + x)}" cy="${y}" r="2" fill="#FF9A3A" stroke="${ENCRE}" stroke-width=".5"/>`).join('');
  // ——— les deux carrés surélevés, du fond vers l'avant ———
  const carre = (id, cx, y0, w, d, rangs) => {
    let c = bloc(p, id, cx, y0, w, 7, d, L, { face: (W, H) => tPlanches(W, H, g, { c: '#4A3020', horiz: true, larg: 3.5 }), flanc: (W, H) => tPlanches(W, H, g, { c: '#4A3020', horiz: true, larg: 3.5 }), dessus: (W, H) => `<rect width="${W}" height="${H}" fill="#1A0E14"/>` + [0.25, 0.5, 0.75].map(v => `<rect y="${f(H * v - 0.6)}" width="${W}" height="1.2" fill="#2A1A20"/>`).join('') });
    // (les rangs, du fond vers l'avant)
    [...rangs.keys()].reverse().forEach(r => {
      const sorte = rangs[r];
      for (let i = 0; i < 8; i++) {
        const [qx, qy] = surBloc(cx, y0, w, 7, d, L, 0.07 + i * 0.123, 0.18 + r * 0.32);
        if (sorte === 'chou') c += `<circle cx="${f(qx)}" cy="${f(qy - 2.4)}" r="3.4" fill="#1E7A52" stroke="${ENCRE}" stroke-width=".6"/><circle cx="${f(qx + 0.6)}" cy="${f(qy - 3)}" r="2" fill="#5AD08A"/><path d="M${P2(qx - 1.6, qy - 3)} Q${P2(qx, qy - 1.6)} ${P2(qx + 1.8, qy - 3.2)}" fill="none" stroke="#0E4A32" stroke-width=".5"/>`;
        else if (sorte === 'fane') c += [-1.4, 0, 1.4].map(dx => trait(`M${P2(qx, qy)} Q${P2(qx + dx, qy - 3)} ${P2(qx + dx * 1.8, qy - 6)}`, '#2FB070', 0.9)).join('') + `<path d="M${P2(qx - 1, qy)} L${P2(qx, qy + 1.6)} L${P2(qx + 1, qy)} Z" fill="#FF8A3A"/>`;
        else { const col = [MAGENTA, ACIDE, CYAN, '#FF8AE0'][i % 4]; c += trait(`M${P2(qx, qy)} L${P2(qx, qy - 6)}`, '#1E7A52', 0.8) + `<path d="M${P2(qx, qy - 3)} q-2.4,-.6 -2.6,-2 q1.6,-.2 2.6,2" fill="#2FB070"/>` + lueur(`${id}l${r}${i}`, qx, qy - 7, 5, col, 0.6) + [0, 1, 2, 3, 4].map(k => { const a = k * 1.256; return `<circle cx="${f(qx + Math.cos(a) * 1.5)}" cy="${f(qy - 7 + Math.sin(a) * 1.5)}" r="1.1" fill="${col}"/>`; }).join('') + `<circle cx="${f(qx)}" cy="${f(qy - 7)}" r=".8" fill="#FFF4C8"/>`; }
      }
    });
    return c;
  };
  s += carre(`${p}c2`, 10 * L, -18, 88, 20, ['chou', 'fleur', 'fane']) + carre(`${p}c1`, -6 * L, 12, 92, 22, ['fane', 'fleur', 'chou']);
  // ——— les fleurs géantes de néon : tige feuillue, corolle ———
  const fleur = (id, x, y, h, c, k) => trait(`M${P2(x, y)} Q${P2(x - L * 6, y - h * 0.5)} ${P2(x, y - h)}`, '#0E3A2A', 3.2) + trait(`M${P2(x, y)} Q${P2(x - L * 6, y - h * 0.5)} ${P2(x, y - h)}`, '#2FB070', 1.6)
    + [0.3, 0.55].map((t, i) => { const lx = x - L * 4 * Math.sin(t * Math.PI), ly = y - h * t, sg = i ? 1 : -1; return `<path d="M${P2(lx, ly)} Q${P2(lx + sg * 10, ly - 8)} ${P2(lx + sg * 16, ly - 2)} Q${P2(lx + sg * 8, ly + 2)} ${P2(lx, ly)} Z" fill="#1E8A5C" stroke="${ENCRE}" stroke-width=".7"/>` + trait(`M${P2(lx, ly)} Q${P2(lx + sg * 8, ly - 4)} ${P2(lx + sg * 14, ly - 2)}`, '#5AD08A', 0.5); }).join('')
    + lueur(`${id}l`, x, y - h, 30 * k, c, 0.5)
    + `<g transform="translate(${f(x)} ${f(y - h)}) scale(${k})">${[0, 1, 2, 3, 4, 5, 6, 7].map(i => `<ellipse cx="0" cy="-8" rx="4.2" ry="8" fill="${mix(c, '#FFFFFF', i % 2 ? 0.15 : 0)}" stroke="${ENCRE}" stroke-width=".7" transform="rotate(${i * 45})"/>`).join('')}`
    + `<circle r="5" fill="${ACIDE}" stroke="${ENCRE}" stroke-width=".8"/><circle r="2.4" fill="#FFF4C8"/></g>`;
  s += fleur(`${p}g1`, 56 * L, -6, 64, MAGENTA, 1) + fleur(`${p}g2`, -66 * L, 20, 42, '#FFD04A', 0.75);
  // ——— le petit arc-en-ciel posé sur deux nuages ———
  const ar = [-46 * L, 4];
  s += `<g opacity=".9">${[[22, MAGENTA], [19, CHAUD], [16, ACIDE], [13, CYAN], [10, VIOLET]].map(([r, c]) => trait(`M${P2(ar[0] - r, ar[1])} A${r},${r} 0 0,1 ${P2(ar[0] + r, ar[1])}`, c, 2.6)).join('')}</g>`
    + [-1, 1].map(sg => [[-4, 0, 4.6], [3, -1, 5.4], [8, 1, 3.6]].map(([dx, dy, r]) => `<circle cx="${f(ar[0] + sg * 16 + dx)}" cy="${f(ar[1] + dy)}" r="${r}" fill="#E8E0FF" stroke="${ENCRE}" stroke-width=".7"/>`).join('') + `<ellipse cx="${f(ar[0] + sg * 18)}" cy="${f(ar[1] + 2.4)}" rx="10" ry="2.6" fill="#B8B0E0"/>`).join('');
  // ——— la licorne ———
  s += licorne(`${p}li`, 30 * L, 30, -L);
  return s;
}
// La licorne, de profil (sens : -1 regarde à gauche) : sa robe pâle modelée, sa crinière et sa queue de néon, sa corne
// qui luit, ses sabots
function licorne(id, x, y, sens) {
  const robe = `url(#${id}r)`;
  const jambe = (lx, c) => plan(`M${lx - 1.6},-10 L${lx - 1.4},0 L${lx + 1.6},0 L${lx + 1.6},-10 Z`, c, 0.7) + `<rect x="${lx - 1.7}" y="-1.4" width="3.4" height="1.6" fill="#3A3058"/>`;
  return `<defs>${lin(`${id}r`, 0, -24, 0, 0, [[0, '#F0E8FF'], [1, '#8A80B8']])}${lin(`${id}c`, 0, -30, 0, -6, [[0, MAGENTA], [0.5, VIOLET], [1, CYAN]])}</defs>`
    + `<g transform="translate(${f(x)} ${f(y)}) scale(${-sens} 1)">`
    + `<ellipse cx="0" cy="1" rx="17" ry="3" fill="#03020A" opacity=".45"/>`
    + jambe(-10, '#6A6090') + jambe(9, '#6A6090')
    // (la queue de néon)
    + plan('M13,-17 Q24,-18 22,-6 Q19,-12 13,-13 Z', `url(#${id}c)`, 0.8)
    + plan('M-13,-12 Q-14,-21 -4,-21 L10,-21 Q16,-21 15,-13 Q14,-8 9,-8 L-9,-8 Q-13,-8 -13,-12 Z', robe, 1)
    + jambe(-7, robe) + jambe(6, robe)
    // (l'encolure, la tête, l'œil, l'oreille, la corne)
    + plan('M-9,-18 Q-14,-26 -15,-32 L-11,-34 Q-7,-26 -3,-20 Z', robe, 0.9)
    + plan('M-15,-32 Q-22,-31 -24,-27 Q-24,-24 -21,-24 Q-16,-26 -11,-28 Z', robe, 0.9) + `<circle cx="-16.6" cy="-29.6" r=".9" fill="${ENCRE}"/>`
    + plan('M-12.6,-33.4 L-11.4,-37 L-10.4,-33 Z', robe, 0.6)
    + lueur(`${id}l`, -16, -40, 9, ACIDE, 0.6) + plan('M-15.4,-33 L-17.6,-44 L-13.4,-34 Z', ACIDE, 0.6) + trait('M-15,-36 L-16.4,-35.4 M-15.6,-39 L-16.8,-38.4', ENCRE, 0.4)
    // (la crinière de néon)
    + plan('M-11,-35 Q-6,-30 -4,-21 Q-8,-24 -9,-20 Q-10,-26 -13,-31 Z', `url(#${id}c)`, 0.8) + '</g>';
}

// ═══ le Ponton : l'embarcadère ═══
// Un ponton de planches en volume sur ses pieux (leurs reflets, les rides de l'eau), un voilier amarré, sa voile pâle,
// sa flamme ; sur le ponton, l'étal et son auvent rayé, ses caisses de fruits qui luisent ; le réverbère et sa
// lanterne ; la tente du mage, violette et étoilée ; un tonneau, un rouleau de corde
function ponton(p, cote = 1, sv = false) {
  const g = rnd(139), L = cote, D = D3(L), w = 104, h = 5, d = 46, y0 = -6, cx = 4 * L;
  let s = communs(p);
  // (les rides de l'eau autour)
  s += `<ellipse cx="${cx}" cy="6" rx="90" ry="20" fill="#05302E" opacity=".45"/>` + [[-40, 10, 14], [20, 12, 18], [56, 2, 12], [-10, 30, 22]].map(([x, y, r], i) => `<ellipse cx="${x * L}" cy="${y}" rx="${r}" ry="${f(r * 0.22)}" fill="none" stroke="${CYAN}" stroke-width=".7">${palpite('opacity', '0.15;0.6;0.15', 3 + i * 0.5, i)}</ellipse>`).join('');
  // ——— les pieux, leurs reflets ———
  for (const [u, v] of [[0, 0], [0.33, 0], [0.66, 0], [1, 0], [1, 1]]) {
    const [qx, qy] = surBloc(cx, y0, w, h, d, L, L > 0 ? u : 1 - u, v);
    s += plan(`M${P2(qx - 2.4, qy + h)} L${P2(qx - 2.4, qy + h + 16)} L${P2(qx + 2.4, qy + h + 16)} L${P2(qx + 2.4, qy + h)} Z`, '#2A1A1E', 0.8)
      + `<path d="M${P2(qx - 2.4, qy + h + 16)} q2.4,1.4 4.8,0" fill="none" stroke="${CYAN}" stroke-width=".7" opacity=".7"/>` + trait(`M${P2(qx, qy + h + 18)} L${P2(qx, qy + h + 26)}`, '#2A1A1E', 3, ' opacity=".35" stroke-dasharray="2 2"');
  }
  // ——— le pont de planches ———
  s += bloc(p, `${p}d`, cx, y0, w, h, d, L, {
    face: (W, H) => tPlanches(W, H, g, { c: '#4A3020', horiz: true, larg: 2.5 }), flanc: (W, H) => tPlanches(W, H, g, { c: '#4A3020', horiz: true, larg: 2.5 }),
    dessus: (W, H) => tPlanches(W, H, g, { c: '#5A3A28', larg: 6 }) + `<rect width="${W}" height="${H}" fill="#05020E" opacity=".25"/>`
      + (sv ? [[0.2, 0.3, 14], [0.55, 0.6, 18], [0.8, 0.2, 10]].map(([u, v, l]) => `<path d="M${P2(W * u, H * v)} l6,0 l-1,${f(l * 0.5)} l1.6,${f(l * 0.5)} l-6.6,0 l1,-${f(l * 0.4)} Z" fill="#05302E"/><path d="M${P2(W * u + 6, H * v)} l-1,${f(l * 0.5)}" stroke="#2A1A10" stroke-width=".8"/>`).join('') : ''),
    sv, bord: CYAN
  });
  // (la ligne de lune sur le bord du pont)
  s += lumineux(`M${P2(cx - w / 2, y0 - h)} L${P2(cx + w / 2, y0 - h)}`, MAGENTA, 0.45);
  const sur = (u, v) => surBloc(cx, y0, w, h, d, L, L > 0 ? u : 1 - u, v);
  // ——— la tente du mage, au fond ———
  const [tx, ty] = sur(0.2, 0.7);
  s += `<defs>${lin(`${p}te`, tx - 14, 0, tx + 14, 0, [[0, cote > 0 ? '#1E0A3A' : '#8A4AD8'], [1, cote > 0 ? '#8A4AD8' : '#1E0A3A']])}</defs>`
    + plan(`M${P2(tx - 15, ty)} Q${P2(tx - 6, ty - 18)} ${P2(tx + 1, ty - 40)} Q${P2(tx + 6, ty - 18)} ${P2(tx + 15, ty)} Q${P2(tx, ty + 4)} ${P2(tx - 15, ty)} Z`, `url(#${p}te)`, 1.1)
    + `<path d="M${P2(tx - 3, ty + 1.6)} L${P2(tx + 0.6, ty - 14)} L${P2(tx + 4, ty + 1.4)} Z" fill="${sv ? '#07040E' : '#FFC870'}" stroke="${ENCRE}" stroke-width=".7"/>`
    + [[-7, -8], [5, -16], [-2, -24], [8, -4]].map(([dx, dy]) => `<path d="M${P2(tx + dx, ty + dy - 1.6)} l.5,1.1 1.2,.1 -.9,.8 .3,1.2 -1.1,-.6 -1.1,.6 .3,-1.2 -.9,-.8 1.2,-.1 Z" fill="${ACIDE}"/>`).join('')
    + `<circle cx="${f(tx + 1)}" cy="${f(ty - 41)}" r="1.6" fill="${ACIDE}" stroke="${ENCRE}" stroke-width=".5"/>` + lumineux(`M${P2(tx + 15 * L, ty)} Q${P2(tx + 6 * L, ty - 18)} ${P2(tx + L, ty - 39)}`, MAGENTA, 0.5)
    + (sv ? feu(`${p}tf`, tx + 4 * L, ty - 10, 0.9, 0.5) : '');
  // ——— l'étal et son auvent rayé, porté par ses deux montants ———
  const [ex, ey] = sur(0.62, 0.55);
  s += [-13, 13].map(dx => trait(`M${P2(ex + dx, ey)} L${P2(ex + dx, ey - 30)}`, '#3A2418', 2)).join('')
    + bloc(p, `${p}e`, ex, ey, 30, 12, 10, L, { face: (W, H) => tPlanches(W, H, g, { c: '#4A3020', larg: 4 }), flanc: (W, H) => tPlanches(W, H, g, { c: '#4A3020', larg: 4 }), dessus: (W, H) => `<rect width="${W}" height="${H}" fill="#3A2418"/>` })
    + [[-8, '#FF8A3A'], [0, MAGENTA], [8, ACIDE]].map(([dx, c], i) => { const [qx, qy] = surBloc(ex, ey, 30, 12, 10, L, 0.5 + dx / 30, 0.5); return (sv ? '' : lueur(`${p}ef${i}`, qx, qy - 3, 6, c, 0.5)) + [[-1.6, 0], [1.6, 0], [0, -2]].map(([a, b]) => `<circle cx="${f(qx + a)}" cy="${f(qy - 2 + b)}" r="1.6" fill="${sv ? '#2A2438' : c}" stroke="${ENCRE}" stroke-width=".4"/>`).join(''); }).join('');
  const D16 = [D[0] * 16, D[1] * 16 - 8], aw = [[ex - 16, ey - 30], [ex + 16, ey - 30], [ex + 16 + D16[0], ey - 30 + D16[1]], [ex - 16 + D16[0], ey - 30 + D16[1]]];
  const Vaw = [aw[3][0] - aw[0][0], aw[3][1] - aw[0][1]];
  s += plaque(`${p}aw`, aw[3], [1, 0], unite([-Vaw[0], -Vaw[1]]), 32, norme(Vaw),
    Array.from({ length: 8 }, (_, i) => `<rect x="${i * 4}" y="-2" width="4" height="40" fill="${i % 2 ? '#D8D0F0' : MAGENTA}"/>`).join('') + `<rect width="32" height="${f(norme(Vaw))}" fill="url(#${p}AO)"/>`,
    sv ? `M0,0 H32 V${f(norme(Vaw) - 8)} L28,${f(norme(Vaw) - 2)} L24,${f(norme(Vaw) - 10)} L19,${f(norme(Vaw))} L13,${f(norme(Vaw) - 7)} L8,${f(norme(Vaw) - 1)} L3,${f(norme(Vaw) - 9)} L0,${f(norme(Vaw) - 4)} Z` : undefined);
  if (!sv) s += `<path d="${poly(aw)}" fill="none" stroke="${ENCRE}" stroke-width=".9"/>`
    + `<path d="M${P2(ex - 16, ey - 30)} ${Array.from({ length: 8 }, (_, i) => `Q${P2(ex - 14 + i * 4, ey - 26)} ${P2(ex - 12 + i * 4, ey - 30)}`).join(' ')} Z" fill="${MAGENTA}" stroke="${ENCRE}" stroke-width=".8"/>`;
  // ——— le réverbère, au coin du ponton : son pied, son fût, sa lanterne, son chapeau à épi ———
  const [rx, ry] = sur(0.94, 0.12);
  s += plan(`M${P2(rx - 3, ry)} L${P2(rx - 2, ry - 4)} L${P2(rx + 2, ry - 4)} L${P2(rx + 3, ry)} Z`, '#2A2438', 0.7)
    + trait(`M${P2(rx, ry - 4)} L${P2(rx, ry - 56)}`, ENCRE, 2.8) + trait(`M${P2(rx, ry - 4)} L${P2(rx, ry - 56)}`, '#4A4060', 1.2)
    + `<g transform="translate(${f(rx)} ${f(ry - 56)})">${sv ? '' : lueur(`${p}rl`, 0, -6, 26, CHAUD, 0.6)}${plan('M-4,0 L4,0 L5,-10 L-5,-10 Z', sv ? '#140E1E' : '#FFD27A', 0.9)}${trait('M0,0 L0,-10', '#2A2438', 0.6)}`
    + `${plan('M-6.4,-10 L6.4,-10 L0,-15 Z', '#2A2438', 0.8)}<circle cx="0" cy="-16.4" r="1.4" fill="#4A4060" stroke="${ENCRE}" stroke-width=".5"/>${plan('M-3,0 L3,0 L2,2 L-2,2 Z', '#2A2438', 0.6)}${sv ? '<path d="M-4,0 L-1,-6 L-5,-8 Z" fill="#4A4060"/>' : ''}</g>`
    + (sv ? '' : `<path d="M${P2(rx, 12)} q2,6 -1,12 q-3,6 1,14" fill="none" stroke="${CHAUD}" stroke-width="2.4" opacity=".35"/>`);
  // ——— un tonneau, un rouleau de corde, devant ———
  const [bx, by] = sur(0.12, 0.15);
  s += plan(`M${P2(bx - 5, by)} L${P2(bx - 5.4, by - 11)} Q${P2(bx, by - 13.6)} ${P2(bx + 5.4, by - 11)} L${P2(bx + 5, by)} Q${P2(bx, by + 2)} ${P2(bx - 5, by)} Z`, '#3A2420', 0.9)
    + [-3, -8].map(dy => trait(`M${P2(bx - 5.2, by + dy)} Q${P2(bx, by + dy + 2)} ${P2(bx + 5.2, by + dy)}`, '#6A6A7A', 1)).join('') + `<ellipse cx="${f(bx)}" cy="${f(by - 11.4)}" rx="5.2" ry="1.8" fill="#4A3028" stroke="${ENCRE}" stroke-width=".6"/>`;
  const [kx, ky] = sur(0.3, 0.12);
  s += [5, 3.4, 1.8].map(r => `<ellipse cx="${f(kx)}" cy="${f(ky - 1)}" rx="${r}" ry="${f(r * 0.45)}" fill="none" stroke="#9A8A6A" stroke-width="1.1"/>`).join('');
  // ——— le voilier amarré devant : sa coque, son mât, sa voile, son foc, sa flamme ; l'amarre ———
  const vx = -14 * L, vy = 24;
  s += `<g transform="translate(${vx} ${vy})${sv ? ` rotate(${-12 * L}) translate(0 6)` : ''}">`
    + `<defs>${lin(`${p}vo`, -20, 0, 20, 0, [[0, cote > 0 ? '#5A5280' : '#F0E8FF'], [1, cote > 0 ? '#F0E8FF' : '#5A5280']])}</defs>`
    + (sv ? plan('M-1,-6 L-1,-44 L1,-48 L1,-6 Z', '#3A2418', 0.8) + plan('M1.6,-40 L1.6,-8 L18,-10 L14,-18 L22,-24 L12,-28 L16,-34 Z', `url(#${p}vo)`, 0.9)
      : trait('M0,-6 L0,-72', ENCRE, 2.6) + trait('M0,-6 L0,-72', '#5A3A28', 1.1)
        + plan('M1.4,-70 Q16,-40 28,-9 L1.4,-8 Z', `url(#${p}vo)`, 1) + [-50, -32, -18].map(y => trait(`M${P2(1.4, y)} L${P2(1.4 + (y + 70) / 61 * 24, y + 1.4)}`, '#8A80B0', 0.5)).join('')
        + plan('M-1.4,-64 L-30,-6 L-1.4,-8 Z', `url(#${p}vo)`, 0.9) + lumineux('M1.4,-70 Q16,-40 28,-9', MAGENTA, 0.5)
        + plan('M0,-72 L10,-69 L0,-66 Z', MAGENTA, 0.6) + `<circle cx="0" cy="-73.4" r="1.4" fill="#A8603A" stroke="${ENCRE}" stroke-width=".5"/>`)
    + plan('M-36,-6 Q-32,6 -2,8 Q28,6 38,-8 L34,-6 L-34,-6 Z', '#3A2230', 1.1) + trait('M-34,-2 Q0,4 35,-4', MAGENTA, 0.9, ' opacity=".9"') + trait('M-35,-6 L35,-7', '#7A5A48', 1)
    + '</g>'
    + (sv ? `<defs>${rad(`${p}ea`, 0, 0, 1, [[0, '#0A4A46', 0.95], [0.7, '#073A38', 0.8], [1, '#073A38', 0]])}</defs><ellipse cx="0" cy="0" rx="1" ry="1" fill="url(#${p}ea)" transform="translate(${vx} ${vy + 9}) scale(46 9)"/>`
      + [0, 1].map(i => `<ellipse cx="${vx + (i ? 14 : -18) * L}" cy="${vy + 6 + i * 2}" rx="${10 + i * 4}" ry="1.6" fill="none" stroke="${CYAN}" stroke-width=".6" opacity=".6"/>`).join('') : '');
  const am = sur(0.02, 0);
  s += trait(`M${P2(vx - 30 * L, vy - 5)} Q${P2(vx - 36 * L, vy - 18)} ${P2(am[0], am[1] + 2)}`, '#9A8A6A', 0.7);
  if (sv) s += barbeles(cx - w / 2 + 4, cx + w / 2 - 4, y0 - h + 1, 4);
  return s;
}

// Une construction par son nom
const DESSINS = { atelier, carriere, puits, bosquet, foyer, potager, ponton };
module.exports = { DESSINS, atelier, carriere, puits, bosquet, foyer, potager, ponton };
