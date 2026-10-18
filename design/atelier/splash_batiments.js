// Les constructions de l'île du splash, dessinées pour lui en papier néon (choix de l'auteur, 18 oct. : les dessins du
// jeu posés tels quels, « on dirait un screenshot collé grossièrement » ; « redesign complet, du lourd, un vrai jeu
// AAA ») : du volume peint (chaque surface modelée par la lune, ses ombres portées sous les avancées, l'ombre douce au
// pied), de la matière (pierres taillées une à une, tuiles en écailles rang par rang, bois cerclé de fer, lierre), une
// silhouette qui raconte, et la lumière néon par touches (fenêtres profondes dont la lumière déborde, liseré de lune
// cyan, reflet magenta de l'autre côté). De grandes surfaces sombres, de petites lumières très vives.
// Repère de chaque dessin : son pied en (0, 0), à l'échelle des dessins de la bibliothèque (cadre 280 × 330) ; la lune
// est au centre de l'île : cote = 1 quand elle est à droite du dessin (il est à gauche de l'île), -1 sinon.
const { f, rnd } = require('./scenes7').outils;

const ENCRE = '#0A0418';
const CYAN = '#5CF2E6', MAGENTA = '#FF3FA8', ACIDE = '#D4FF7A', CHAUD = '#FFB85A';

// ——— les outils ———
const stops = s => s.map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join('');
const lin = (id, x1, y1, x2, y2, s) => `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}">${stops(s)}</linearGradient>`;
const rad = (id, cx, cy, r, s) => `<radialGradient id="${id}" gradientUnits="userSpaceOnUse" cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}">${stops(s)}</radialGradient>`;
const plan = (d, fill, w = 1.4, extra = '') => `<path d="${d}" fill="${fill}" stroke="${ENCRE}" stroke-width="${w}" stroke-linejoin="round"${extra}/>`;
const trait = (d, c, w, extra = '') => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"${extra}/>`;
const lumineux = (d, c, w = 1.2) => trait(d, c, f(w * 5), ' stroke-opacity=".12"') + trait(d, c, f(w)) + trait(d, '#FFFFFF', f(w * 0.35), ' stroke-opacity=".75"');
const lueur = (id, x, y, r, c, a = 0.55) => `<defs>${rad(id, x, y, r, [[0, c, a], [0.4, c, a * 0.4], [1, c, 0]])}</defs><circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="url(#${id})"/>`;
// une teinte entre deux (hex), t de 0 à 1
const mix = (a, b, t) => '#' + [1, 3, 5].map(i => Math.round(parseInt(a.slice(i, i + 2), 16) * (1 - t) + parseInt(b.slice(i, i + 2), 16) * t).toString(16).padStart(2, '0')).join('');

// La lumière de la lune sur une surface courbe : la part éclairée (0 à 1) d'un point vu à l'abscisse u (-1 à 1) d'un
// cylindre, la lune du côté cote
const eclaire = (u, cote) => Math.max(0, Math.min(1, 0.5 + 0.5 * (u * cote * 0.9 + 0.15)));

// Un mur de pierres courbé (un cylindre de rayon R, de y0 à y1) : les pierres taillées une à une, rang par rang, en
// quinconce, plus étroites vers les bords (la courbure), chacune modelée par la lune ; les joints sombres
function pierres(id, R, y0, y1, cote, g, { fonce = '#140C2A', clair = '#5A4688', haut = 9 } = {}) {
  let s = '';
  for (let y = y0, rang = 0; y > y1; y -= haut, rang++) {
    const decal = rang % 2 ? 0.5 : 0;
    const n = 9;
    for (let k = -1; k <= n; k++) {
      const a0 = -Math.PI / 2 + ((k + decal) / n) * Math.PI, a1 = -Math.PI / 2 + ((k + 1 + decal) / n) * Math.PI;
      const u0 = Math.max(-1, Math.sin(a0)), u1 = Math.min(1, Math.sin(a1));
      if (u1 <= -1 || u0 >= 1 || u1 - u0 < 0.02) continue;
      const x0 = u0 * R + 0.8, x1 = u1 * R - 0.8, bombe = (1 - ((u0 + u1) / 2) ** 2) * 2.4;
      const t = eclaire((u0 + u1) / 2, cote) * (0.75 + g() * 0.35);
      const c = mix(fonce, clair, Math.min(1, t));
      s += `<path d="M${f(x0)},${f(y - 0.8)} Q${f((x0 + x1) / 2)},${f(y + bombe - 0.8)} ${f(x1)},${f(y - 0.8)} L${f(x1)},${f(y - haut + 0.8)} Q${f((x0 + x1) / 2)},${f(y - haut + bombe + 0.8)} ${f(x0)},${f(y - haut + 0.8)} Z" fill="${c}"/>`;
      // (l'arête haute de la pierre accroche la lune)
      if (t > 0.55) s += `<path d="M${f(x0 + 0.6)},${f(y - haut + 1.2)} Q${f((x0 + x1) / 2)},${f(y - haut + bombe + 1.2)} ${f(x1 - 0.6)},${f(y - haut + 1.2)}" fill="none" stroke="${mix(clair, '#C8B8FF', 0.4)}" stroke-width=".7" opacity="${f((t - 0.55) * 1.6)}"/>`;
    }
  }
  return s;
}
// Un toit conique en écailles : de la base (rayon R, en yb) au faîte (yt) ; rang par rang, chaque écaille en demi-lune,
// modelée par la lune, son bord clair ; tout est coupé à la forme du cône
function ecailles(id, R, yb, yt, cote, g, { fonce = '#1A0A36', clair = '#7A3AC8' } = {}) {
  const rangs = 11;
  let s = '';
  for (let i = 0; i < rangs; i++) {
    const t0 = i / rangs, y = yb + (yt - yb) * t0, r = R * (1 - t0) + 2, n = Math.max(3, Math.round(10 * (1 - t0)) + 2), h = (yb - yt) / rangs * 1.5;
    for (let k = 0; k <= n; k++) {
      const u = -1 + (2 * (k + (i % 2) * 0.5)) / n;
      if (u > 1.05) continue;
      const x = u * r, w = (2 * r) / n * 0.62, t = eclaire(u, cote) * (0.8 + g() * 0.3);
      s += `<path d="M${f(x - w)},${f(y - h * 0.5)} L${f(x - w)},${f(y)} Q${f(x)},${f(y + h * 0.55)} ${f(x + w)},${f(y)} L${f(x + w)},${f(y - h * 0.5)} Z" fill="${mix(fonce, clair, Math.min(1, t))}" stroke="${ENCRE}" stroke-width=".8"/>`
        + `<path d="M${f(x - w * 0.8)},${f(y + 0.4)} Q${f(x)},${f(y + h * 0.45)} ${f(x + w * 0.8)},${f(y + 0.4)}" fill="none" stroke="${mix(clair, '#E0C8FF', 0.5)}" stroke-width=".6" opacity="${f(t * 0.7)}"/>`;
    }
  }
  return s;
}
// Une fenêtre profonde en arc : l'encadrement de pierres claires (ses claveaux), l'embrasure sombre, le carreau chaud et
// sa croisée, la lumière qui déborde sur le mur, une jardinière ; (x, y) le milieu du haut, w et h
function fenetre(id, x, y, w, h, cote) {
  const arc = (dx, dy) => `M${f(x - w / 2 - dx)},${f(y + h + dy)} L${f(x - w / 2 - dx)},${f(y + w / 2)} Q${f(x)},${f(y - w * 0.35 - dy)} ${f(x + w / 2 + dx)},${f(y + w / 2)} L${f(x + w / 2 + dx)},${f(y + h + dy)} Z`;
  return lueur(`${id}l`, x, y + h * 0.5, h * 2.4, CHAUD, 0.42)
    + plan(arc(3, 2), '#4A3A6E', 1.1) + [0.15, 0.5, 0.85].map(t => { const a = Math.PI * (1 - t), cx = x + Math.cos(a) * (w / 2 + 1.5), cy = y + w / 2 - Math.sin(a) * (w * 0.85 + 1.5); return `<path d="M${f(cx)},${f(cy)} L${f(x + Math.cos(a) * (w / 2 - 0.5))},${f(y + w / 2 - Math.sin(a) * (w * 0.85 - 0.5))}" stroke="${ENCRE}" stroke-width=".8"/>`; }).join('')
    + plan(arc(0, 0), '#06030E', 1) + `<path d="${arc(-1.4, -1.4)}" fill="#FFC870"/>`
    + `<path d="${arc(-1.4, -1.4)}" fill="url(#${id}v)"/><defs>${lin(`${id}v`, x, y, x, y + h, [[0, '#FFF2C8'], [1, '#FF9A3A']])}</defs>`
    + trait(`M${f(x)},${f(y + 1)} L${f(x)},${f(y + h - 1)} M${f(x - w / 2 + 1)},${f(y + h * 0.55)} L${f(x + w / 2 - 1)},${f(y + h * 0.55)}`, ENCRE, 0.9)
    // (la jardinière et ses fleurs)
    + plan(`M${f(x - w / 2 - 3)},${f(y + h + 2)} L${f(x + w / 2 + 3)},${f(y + h + 2)} L${f(x + w / 2 + 2)},${f(y + h + 5)} L${f(x - w / 2 - 2)},${f(y + h + 5)} Z`, '#3A2418', 0.8)
    + [-0.3, 0, 0.3].map((t, i) => `<circle cx="${f(x + t * w)}" cy="${f(y + h + 1)}" r="1.5" fill="${['#FF6AD0', '#D4FF7A', '#FF8A5A'][i]}" stroke="${ENCRE}" stroke-width=".4"/>`).join('');
}
// Du lierre qui grimpe : une tige qui serpente, ses feuilles émeraude, quelques fleurs qui luisent
function lierre(id, x, y, h, g, sens = 1) {
  let d = `M${f(x)},${f(y)}`, px = x, py = y, s = '';
  const feuilles = [];
  for (let i = 0; i < 9; i++) { const nx = px + sens * (g() - 0.4) * 6, ny = py - h / 9; d += ` Q${f(px + sens * 4)},${f((py + ny) / 2)} ${f(nx)},${f(ny)}`; feuilles.push([nx, ny]); px = nx; py = ny; }
  s += trait(d, '#0A2A1E', 2.4) + trait(d, '#1E6A4A', 1.1);
  feuilles.forEach(([fx, fy], i) => { for (const sg of [-1, 1]) { const lx = fx + sg * 3.2, ly = fy + (g() - 0.5) * 2; s += `<path d="M${f(fx)},${f(fy)} Q${f(lx)},${f(ly - 2.6)} ${f(lx + sg * 1.6)},${f(ly)} Q${f(lx)},${f(ly + 1.4)} ${f(fx)},${f(fy)} Z" fill="${i % 3 ? '#1E8A5C' : '#2FB070'}" stroke="${ENCRE}" stroke-width=".5"/>`; } if (i % 4 === 2) s += lueur(`${id}${i}`, fx, fy, 5, '#FF6AD0', 0.6) + `<circle cx="${f(fx)}" cy="${f(fy)}" r="1.2" fill="#FFD0EC"/>`; });
  return s;
}
// De la fumée qui monte : des volutes qui grossissent, violettes et sombres
const fumee = (id, x, y) => [0, 1, 2, 3].map(i => { const r = 5 + i * 3.2, dx = Math.sin(i * 1.3) * 5 + i * 2, dy = -i * 12; return `<circle cx="${f(x + dx)}" cy="${f(y + dy)}" r="${f(r)}" fill="#3A2A5A" opacity="${f(0.5 - i * 0.1)}"/>`; }).join('');
// L'ombre douce au pied, et la flaque de lumière chaude d'une porte
const ombre = (id, rx, ry, dx = 0) => `<defs>${rad(id, 0, 0, rx, [[0, '#03020A', 0.7], [0.6, '#03020A', 0.3], [1, '#03020A', 0]])}</defs><ellipse cx="${f(dx)}" cy="2" rx="${f(rx)}" ry="${f(ry)}" fill="url(#${id})"/>`;

// ═══ l'Atelier : la tour du mage ═══
// Une tour de pierre à trois étages et sa ceinture de bois, son toit d'écailles et sa lucarne, la flèche et son croissant ;
// à son pied, l'appentis du laboratoire : le four de briques et sa cheminée de cuivre qui fume, l'alambic, la cloche de
// verre où bout la potion vert acide ; le lierre qui grimpe, des tonneaux cerclés, une caisse de fioles qui luisent
function atelier(p, cote = 1) {
  const g = rnd(71), L = cote, R = 34;
  let s = `<defs><clipPath id="${p}tc"><path d="M${-R},0 L${-R},-150 Q0,-158 ${R},-150 L${R},0 Q0,9 ${-R},0 Z"/></clipPath>`
    + `${lin(`${p}cy`, -R, 0, R, 0, [[0, '#000000', cote > 0 ? 0.55 : 0], [0.35, '#000000', cote > 0 ? 0.25 : 0.05], [0.65, '#000000', cote > 0 ? 0.05 : 0.25], [1, '#000000', cote > 0 ? 0 : 0.55]])}`
    + `${lin(`${p}ao`, 0, -16, 0, 0, [[0, '#03020A', 0], [1, '#03020A', 0.6]])}${lin(`${p}eav`, 0, -150, 0, -132, [[0, '#03020A', 0.75], [1, '#03020A', 0]])}`
    + `<clipPath id="${p}rc"><path d="M-48,-148 Q0,-132 48,-148 L5,-262 L-5,-262 Z"/></clipPath>${lin(`${p}rs`, -48, 0, 48, 0, [[0, '#000000', cote > 0 ? 0.5 : 0], [1, '#000000', cote > 0 ? 0 : 0.5]])}</defs>`;
  s += ombre(`${p}o`, 120, 30, 10 * L);
  // ——— l'appentis du laboratoire, derrière la tour du côté de la lune ———
  const ax = 40 * L;
  s += `<g transform="translate(${ax} 0)">`
    // (son mur de planches, son toit d'écailles en pente)
    + plan(`M${-6 * L},-2 L${44 * L},-14 L${44 * L},-58 L${-6 * L},-50 Z`, '#24142E', 1.4)
    + [0, 1, 2, 3, 4, 5].map(i => trait(`M${f((-6 + i * 9) * L)},${f(-2 - i * 2.2)} L${f((-6 + i * 9) * L)},${f(-50 - i * 1.4)}`, '#140A1E', 0.9)).join('')
    + plan(`M${-10 * L},-48 L${50 * L},-60 L${42 * L},-78 L${-10 * L},-70 Z`, '#3A1A50', 1.4)
    + [0, 1, 2].map(r => [0, 1, 2, 3, 4, 5].map(k => { const x = (-8 + k * 9.5 + (r % 2) * 4) * L, y = -52 - r * 7 - k * 1.9; return `<path d="M${f(x - 4)},${f(y)} Q${f(x)},${f(y + 4)} ${f(x + 4)},${f(y)}" fill="${mix('#2A1040', '#7A3AA8', eclaire(k / 5 * 2 - 1, cote) * 0.8)}" stroke="${ENCRE}" stroke-width=".6"/>`; }).join('')).join('')
    + lumineux(`M${-10 * L},-70 L${42 * L},-78`, cote > 0 ? CYAN : MAGENTA, 0.9)
    // (sa fenêtre qui rougeoie du four)
    + lueur(`${p}lf`, 26 * L, -32, 26, '#FF6A2E', 0.45) + plan(`M${20 * L},-40 L${32 * L},-42 L${32 * L},-24 L${20 * L},-22 Z`, '#FF8A3A', 1) + trait(`M${26 * L},-41 L${26 * L},-23`, ENCRE, 0.8)
    // (la cheminée de cuivre, ses bagues, la fumée)
    + plan(`M${30 * L},-74 L${36 * L},-75 L${36 * L},-104 L${30 * L},-103 Z`, '#8A4A2A', 1.2) + [-82, -94].map(y => trait(`M${29 * L},${y} L${37 * L},${y - 0.4}`, '#C8784A', 1.6)).join('')
    + lumineux(`M${(cote > 0 ? 36 : 30) * L},-76 L${(cote > 0 ? 36 : 30) * L},-102`, CHAUD, 0.6) + fumee(`${p}fu`, 33 * L, -112)
    + '</g>';
  // ——— l'alambic et la cloche de verre, devant l'appentis ———
  const vx = 58 * L;
  s += `<g transform="translate(${vx} 0)">`
    + plan(`M-14,0 L14,0 L12,-12 L-12,-12 Z`, '#2A1A3E', 1.2) + trait('M-12,-6 L12,-6', '#4A3A6A', 0.8)
    + lueur(`${p}v`, 0, -26, 34, ACIDE, 0.5)
    + `<path d="M-11,-12 L-11,-30 Q0,-50 11,-30 L11,-12 Z" fill="#B8FF8A" fill-opacity=".22" stroke="#C8FFF4" stroke-width="1.3"/>`
    + `<path d="M-10,-12 L-10,-20 Q0,-24 10,-20 L10,-12 Z" fill="${ACIDE}" fill-opacity=".9"/>`
    + [[-4, -22, 1.4], [3, -27, 1], [-1, -33, 0.8], [5, -20, 1.1]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="#F4FFD8" stroke-width=".6"/>`).join('')
    + trait('M-6,-16 Q-8,-34 0,-41', '#FFFFFF', 1.2, ' stroke-opacity=".7"')
    // (l'alambic de cuivre, son col qui s'élance vers la cloche)
    + plan(`M${-24 * L},0 Q${-32 * L},-10 ${-24 * L},-18 Q${-16 * L},-10 ${-24 * L},0 Z`, '#A8603A', 1.1) + trait(`M${-24 * L},-18 Q${-20 * L},-30 ${-11 * L},-26`, '#C8784A', 1.6) + lumineux(`M${-26 * L},-16 Q${-30 * L},-9 ${-26 * L},-3`, CHAUD, 0.5)
    + '</g>';
  // ——— la tour ———
  s += `<g clip-path="url(#${p}tc)"><rect x="${-R}" y="-160" width="${2 * R}" height="170" fill="#100822"/>${pierres(`${p}p`, R, 0, -150, cote, g)}`
    + `<rect x="${-R}" y="-160" width="${2 * R}" height="170" fill="url(#${p}cy)"/><rect x="${-R}" y="-16" width="${2 * R}" height="18" fill="url(#${p}ao)"/><rect x="${-R}" y="-150" width="${2 * R}" height="20" fill="url(#${p}eav)"/></g>`
    + `<path d="M${-R},0 L${-R},-150 Q0,-158 ${R},-150 L${R},0 Q0,9 ${-R},0 Z" fill="none" stroke="${ENCRE}" stroke-width="2"/>`;
  // (la ceinture de bois du deuxième étage, son balcon et ses consoles)
  s += plan(`M${-R - 4},-92 Q0,-82 ${R + 4},-92 L${R + 4},-86 Q0,-76 ${-R - 4},-86 Z`, '#4A2E1E', 1.3)
    + [-0.7, -0.25, 0.25, 0.7].map(u => trait(`M${f(u * (R + 2))},${f(-82 + (1 - u * u) * 6)} L${f(u * (R + 6))},${f(-74 + (1 - u * u) * 6)}`, '#2A1810', 2)).join('')
    + trait(`M${-R - 4},-92 Q0,-82 ${R + 4},-92`, mix('#8A5A3A', '#E0A070', 0.4), 0.9);
  // (les fenêtres, la porte cerclée de fer et sa lanterne)
  s += fenetre(`${p}f1`, -11 * L, -60, 10, 15, cote) + fenetre(`${p}f2`, 10 * L, -118, 9, 13, cote) + fenetre(`${p}f3`, -14 * L, -134, 7, 9, cote);
  s += lueur(`${p}pl`, 0, -2, 36, CHAUD, 0.32)
    + plan('M-11,2 L-11,-26 Q0,-38 11,-26 L11,3 Z', '#3A2216', 1.6) + [-6, 0, 6].map(x => trait(`M${x},-30 L${x},2`, '#24140C', 0.9)).join('')
    + [-20, -8].map(y => trait(`M-11,${y} L11,${y}`, '#5A5A6A', 1.6)).join('') + `<circle cx="6" cy="-12" r="1.3" fill="#C8A060"/>`
    + `<g transform="translate(${-17 * L} -30)">${lueur(`${p}la`, 0, 4, 16, CHAUD, 0.6)}${trait('M0,-6 L0,0', ENCRE, 1.4)}${plan('M-3,0 L3,0 L2.4,8 L-2.4,8 Z', '#FFD27A', 1)}${plan('M-4,0 L4,0 L0,-3 Z', '#2A1A30', 0.8)}</g>`;
  // (le lierre qui grimpe du côté de l'ombre)
  s += lierre(`${p}li`, -26 * L, 0, 104, g, L);
  // (le liseré de lune sur le bord éclairé, le reflet magenta de l'autre côté)
  s += lumineux(`M${(R - 0.5) * L},-4 L${(R - 0.5) * L},-148`, CYAN, 1.1) + trait(`M${(-R + 0.8) * L},-6 L${(-R + 0.8) * L},-146`, MAGENTA, 0.8, ' stroke-opacity=".55"');
  // ——— le toit d'écailles, sa lucarne, la flèche et son croissant ———
  s += plan('M-48,-148 Q0,-132 48,-148 L5,-262 L-5,-262 Z', '#1A0A30', 2)
    + `<g clip-path="url(#${p}rc)">${ecailles(`${p}e`, 46, -146, -262, cote, g)}<path d="M-48,-148 Q0,-132 48,-148 L5,-262 L-5,-262 Z" fill="url(#${p}rs)"/></g>`
    + `<path d="M-48,-148 Q0,-132 48,-148 L5,-262 L-5,-262 Z" fill="none" stroke="${ENCRE}" stroke-width="2"/>`
    + lumineux(`M${46 * L},-148 L${5 * L},-260`, MAGENTA, 1) + lumineux('M-46,-147 Q0,-132 46,-147', '#C88AFF', 0.7);
  // (la lucarne : son petit toit, sa fenêtre qui luit)
  s += `<g transform="translate(${-14 * L} -178)">${plan('M-9,6 L-9,-6 L9,-6 L9,6 Z', '#24143A', 1.2)}${fenetre(`${p}lu`, 0, -4, 8, 8, cote)}${plan('M-12,-5 L0,-17 L12,-5 Z', '#4A2070', 1.2)}${lumineux(`M${12 * L},-5 L0,-17`, MAGENTA, 0.6)}</g>`;
  s += trait('M0,-262 L0,-292', ENCRE, 3.2) + trait('M0,-262 L0,-292', '#7A6A9A', 1.4)
    + lueur(`${p}cr`, 0, -298, 18, ACIDE, 0.55) + `<path d="M3,-306 A8,8 0 1,0 3,-290 A6,6 0 1,1 3,-306 Z" fill="${ACIDE}" stroke="${ENCRE}" stroke-width="1"/>`;
  // ——— au pied : les tonneaux cerclés, la caisse de fioles qui luisent ———
  const tx = -56 * L;
  s += `<g transform="translate(${tx} 0)">`
    + [[0, 0], [-15 * L, 3]].map(([x, y], i) => plan(`M${x - 7},${y} L${x - 7.6},${y - 16} Q${x},${y - 20} ${x + 7.6},${y - 16} L${x + 7},${y} Q${x},${y + 3} ${x - 7},${y} Z`, i ? '#2A1A2A' : '#3A2420', 1.2)
      + [-4, -12].map(dy => trait(`M${x - 7.4},${y + dy} Q${x},${y + dy + 3} ${x + 7.4},${y + dy}`, '#6A6A7A', 1.2)).join('') + `<ellipse cx="${x}" cy="${y - 17}" rx="7.4" ry="2.4" fill="#4A3028" stroke="${ENCRE}" stroke-width=".8"/>`).join('')
    + plan(`M${-24 * L},6 L${-6 * L},10 L${4 * L},6 L${4 * L},-4 L${-14 * L},-8 L${-24 * L},-4 Z`, '#2A1830', 1.1)
    + [[-16, -6, '#FF6AD0'], [-11, -5, ACIDE], [-6, -4, CYAN]].map(([x, y, c], i) => lueur(`${p}fi${i}`, x * L, y - 3, 6, c, 0.6) + plan(`M${(x - 1.4) * L},${y} L${(x - 1.4) * L},${y - 5} L${(x + 1.4) * L},${y - 5} L${(x + 1.4) * L},${y} Z`, c, 0.6)).join('')
    + '</g>';
  return s;
}

module.exports = { atelier };
