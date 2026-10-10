// L'île de l'écran de démarrage (splash.js), dessinée pour lui : la terre des naufragés, vivante, de nuit, sous la lueur
// d'Anya. Les cabanes de planches et leurs toits rapiécés, une tente de voile, le feu de camp au milieu ; les champs
// et le blé, le poulailler et ses poules, des moutons et une chèvre ; des arbres, des buissons fleuris, le linge qui
// sèche ; la plage, la barque échouée, l'écume. Repère : (0, 0) au centre de l'herbe ; l'île fait 580 de large, de
// y = -60 (le fond) à y = 130 (la plage devant). Contours teintés, lumière froide d'en haut, chaude des fenêtres et du feu.
const { degrade, rayonne, forme, trait, balance, eclairer } = require('./splash_anya').outils;
const { f, rnd, vaVient, palpite } = require('./scenes7').outils;

const fs = require('fs');
const path = require('path');

const SPL = '0.45 0 0.55 1';
const BIB = path.join(__dirname, '..', 'bibliotheque', 'svg');
// Un dessin de la bibliothèque posé sur l'île : son ancrage (0, 0, le sol) en (x, y), à l'échelle k ; ses identifiants
// préfixés (deux dessins ne partagent jamais un identifiant)
// préfixés (deux dessins ne partagent jamais un identifiant) ; éclairé par la lumière de l'écran (Anya, au centre)
function poser(rel, prefixe, x, y, k) {
  const src = fs.readFileSync(path.join(BIB, rel), 'utf8');
  const box = src.match(/viewBox="([^"]+)"/)[1].split(/\s+/).map(Number);
  const corps = src.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '')
    .replace(/id="([^"]+)"/g, `id="${prefixe}$1"`).replace(/url\(#([^)]+)\)/g, `url(#${prefixe}$1)`).replace(/href="#([^"]+)"/g, `href="#${prefixe}$1"`);
  return `<g transform="translate(${f(x)} ${f(y)}) scale(${f(k)})">${eclairer(corps, `${prefixe}e`, box, x < 0 ? 1 : -1, 0.9)}</g>`;
}
const ovale = (cx, cy, rx, ry, fill, stroke = 'none', w = 0, extra = '') => `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(rx)}" ry="${f(ry)}" fill="${fill}"${stroke !== 'none' ? ` stroke="${stroke}" stroke-width="${w}"` : ''}${extra}/>`;
const ombre = (x, y, rx) => ovale(x, y, rx, rx * 0.28, 'url(#ilOmbre)');

// ═══ la végétation ═══
// Un arbre rond : le tronc, quatre boules de feuillage (claires en haut à gauche), des reflets ; il se balance
function arbre(x, y, k, begin, teinte = 0) {
  const g = teinte ? 'url(#ilFeuillage2)' : 'url(#ilFeuillage)';
  return ombre(x, y, 22 * k) + `<g transform="translate(${f(x)} ${f(y)}) scale(${k})"><g>${balance(-1.6, 1.6, 0, 0, 5.6, begin)}`
    + forme('M-4,0 Q-5,-14 -3,-24 L3,-24 Q5,-14 4,0 Z', 'url(#ilTronc)', '#4A3020', 1.6) + trait('M-1,-18 L-8,-28 M1,-20 L7,-30', '#5E3E28', 2.4)
    + [[-12, -34, 14], [12, -36, 14], [0, -48, 16], [-4, -30, 12]].map(([cx, cy, r]) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${g}" stroke="#24563A" stroke-width="1.6"/>`).join('')
    + [[-8, -52, 4, 2.6], [-17, -40, 3, 2], [8, -42, 3, 2]].map(([cx, cy, rx, ry]) => ovale(cx, cy, rx, ry, '#E6FFB8', 'none', 0, ' opacity=".5"')).join('')
    + '</g></g>';
}
// Un sapin : trois étages de branches, plus clairs vers le haut
function sapin(x, y, k, begin) {
  return ombre(x, y, 14 * k) + `<g transform="translate(${f(x)} ${f(y)}) scale(${k})"><g>${balance(-1.2, 1.2, 0, 0, 6.2, begin)}`
    + forme('M-3,0 L-3,-10 L3,-10 L3,0 Z', 'url(#ilTronc)', '#4A3020', 1.4)
    + [[0, -8, 18, 20], [0, -22, 14, 18], [0, -34, 10, 16]].map(([cx, cy, w, h]) => forme(`M${cx - w},${cy} Q${cx},${cy + 4} ${cx + w},${cy} L${cx},${cy - h} Z`, 'url(#ilSapin)', '#1E4A34', 1.6)).join('')
    + trait('M-6,-40 L-1,-48', '#CFF0B0', 2, ' opacity=".5"') + '</g></g>';
}
// Un buisson fleuri : trois bosses et des fleurs qui luisent un peu
function buisson(x, y, k, couleur, begin) {
  const g = rnd(Math.round(x * 7 + y));
  return ombre(x, y, 16 * k) + `<g transform="translate(${f(x)} ${f(y)}) scale(${k})">`
    + [[-8, -6, 9], [8, -6, 9], [0, -11, 10]].map(([cx, cy, r]) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#ilBuisson)" stroke="#24563A" stroke-width="1.4"/>`).join('')
    + [0, 1, 2, 3, 4].map(() => `<circle cx="${f(-12 + g() * 24)}" cy="${f(-16 + g() * 12)}" r="1.8" fill="${couleur}" stroke="#7A4A5A" stroke-width=".5">${palpite('opacity', '0.7;1;0.7', 2.6, begin + g() * 2)}</circle>`).join('') + '</g>';
}
// Des touffes d'herbe semées sur l'île (dans l'ovale de l'herbe), de trois verts
function herbes(n, seed) {
  const g = rnd(seed);
  let s = '';
  for (let i = 0; i < n; i++) {
    const a = g() * Math.PI * 2, r = Math.sqrt(g()), x = Math.cos(a) * r * 250, y = 16 + Math.sin(a) * r * 64;
    const c = ['#4E9A58', '#7CC46A', '#3B7A4C'][i % 3];
    s += trait(`M${f(x - 3)},${f(y)} L${f(x - 4)},${f(y - 5)} M${f(x)},${f(y)} L${f(x)},${f(y - 7)} M${f(x + 3)},${f(y)} L${f(x + 4.5)},${f(y - 5)}`, c, 1.3);
  }
  return s;
}
// Du blé doré : des tiges qui ondulent au vent, par vagues
function ble(x0, y0, w, h, rangs) {
  let s = '';
  for (let r = 0; r < rangs; r++) {
    const y = y0 + r * (h / rangs), n = Math.round(w / 6);
    s += `<g><animateTransform attributeName="transform" type="skewX" values="-4;5;-4" keyTimes="0;0.5;1" calcMode="spline" keySplines="${SPL};${SPL}" dur="3.6s" begin="${f(-r * 0.4)}s" repeatCount="indefinite"/>`;
    for (let i = 0; i < n; i++) {
      const x = x0 + i * 6 + (r % 2) * 3;
      s += trait(`M${f(x)},${f(y)} L${f(x + 1)},${f(y - 14)}`, '#B88A30', 1.2) + ovale(x + 1.2, y - 16, 1.8, 4, 'url(#ilEpi)', '#9A6E22', 0.6);
    }
    s += '</g>';
  }
  return s;
}
// Un champ labouré : des sillons en perspective, de jeunes pousses sur chaque rang
function champ(x, y) {
  let s = forme(`M${x},${y} L${x + 96},${y - 6} L${x + 112},${y + 40} L${x + 8},${y + 48} Z`, 'url(#ilTerre)', '#5A3A26', 2);
  for (let i = 0; i < 5; i++) {
    const t = (i + 0.5) / 5, ya = y - 6 * (1 - t) + 48 * t - 2, xa = x + 8 * t, xb = x + 96 + 16 * t;
    s += trait(`M${f(xa + 3)},${f(ya)} L${f(xb - 3)},${f(ya - 6 + t * 0)}`, '#4A2E1E', 2.2, ' opacity=".55"');
    for (let j = 0; j < 8; j++) {
      const px = xa + 8 + j * ((xb - xa - 16) / 7), py = ya - 1 - (j / 7) * 6;
      s += trait(`M${f(px)},${f(py)} Q${f(px - 3)},${f(py - 4)} ${f(px - 4)},${f(py - 6)} M${f(px)},${f(py)} Q${f(px + 3)},${f(py - 4)} ${f(px + 4)},${f(py - 6)}`, '#7CCB5E', 1.6);
    }
  }
  return s;
}
// Une clôture de piquets et deux traverses, de (x0, y0) à (x1, y1)
function cloture(x0, y0, x1, y1, n) {
  let s = trait(`M${x0},${y0 - 7} L${x1},${y1 - 7} M${x0},${y0 - 13} L${x1},${y1 - 13}`, '#5A3A26', 3.4) + trait(`M${x0},${y0 - 7} L${x1},${y1 - 7} M${x0},${y0 - 13} L${x1},${y1 - 13}`, '#B08458', 2);
  for (let i = 0; i <= n; i++) {
    const x = x0 + (x1 - x0) * i / n, y = y0 + (y1 - y0) * i / n;
    s += forme(`M${f(x - 2)},${f(y)} L${f(x - 2)},${f(y - 16)} L${f(x)},${f(y - 18)} L${f(x + 2)},${f(y - 16)} L${f(x + 2)},${f(y)} Z`, '#B08458', '#5A3A26', 1.2);
  }
  return s;
}

// ═══ les constructions des naufragés ═══
// Une fenêtre éclairée : la lueur chaude qui respire autour, le carreau, sa croisée
const fenetre = (x, y, w, h, begin) => ovale(x + w / 2, y + h / 2, w * 2.2, h * 2, 'url(#ilLueurChaude)', 'none', 0, '') .replace('/>', `>${palpite('opacity', '0.6;1;0.6', 2.4, begin)}</ellipse>`)
  + `<rect x="${f(x)}" y="${f(y)}" width="${w}" height="${h}" rx="1.4" fill="url(#ilVitre)" stroke="#4A2E1E" stroke-width="1.6"/>`
  + trait(`M${f(x + w / 2)},${f(y)} L${f(x + w / 2)},${f(y + h)} M${f(x)},${f(y + h / 2)} L${f(x + w)},${f(y + h / 2)}`, '#4A2E1E', 1.2);
// De la fumée qui monte d'une cheminée : des bouffées qui grossissent et s'effacent
const fumee = (x, y, dur = 5.6) => [0, 1, 2].map(i => `<circle cx="${f(x)}" cy="${f(y)}" r="3" fill="url(#ilFumee)" opacity="0">`
  + `<animateTransform attributeName="transform" type="translate" values="0 0;6 -26;16 -56" keyTimes="0;0.5;1" calcMode="spline" keySplines="0.3 0 0.6 1;0.3 0 0.6 1" dur="${dur}s" begin="${f(-i * dur / 3)}s" repeatCount="indefinite"/>`
  + `<animate attributeName="r" values="3;7;12" dur="${dur}s" begin="${f(-i * dur / 3)}s" repeatCount="indefinite"/>`
  + `<animate attributeName="opacity" values="0;0.7;0" keyTimes="0;0.25;1" dur="${dur}s" begin="${f(-i * dur / 3)}s" repeatCount="indefinite"/></circle>`).join('');
// Une cabane de naufragés, de trois quarts : murs de planches, toit de chaume rapiécé d'un morceau de voile, cheminée
// de pierres qui fume, fenêtre éclairée, porte et sa lanterne ; (x, y) le milieu du bas de la façade
function cabane(x, y, k, begin, variante = 0) {
  const W = 50, H = 30, P = 20;
  let s = ombre(x + 8 * k, y, 46 * k) + `<g transform="translate(${f(x)} ${f(y)}) scale(${k})">`;
  // le côté (plus sombre), la façade de planches
  s += forme(`M${W / 2},0 L${W / 2 + P},-10 L${W / 2 + P},${-H - 10} L${W / 2},${-H} Z`, 'url(#ilPlanchesOmbre)', '#3E2618', 1.8);
  s += forme(`M${-W / 2},0 L${W / 2},0 L${W / 2},${-H} L${-W / 2},${-H} Z`, 'url(#ilPlanches)', '#3E2618', 1.8);
  for (let i = 1; i < 6; i++) s += trait(`M${-W / 2 + i * W / 6},-1 L${-W / 2 + i * W / 6 + (i % 2 ? 0.6 : -0.4)},${-H + 1}`, '#5A3A26', 1, ' opacity=".6"');
  s += trait(`M${-W / 2 + 4},${-H + 9} l6,-1 M${W / 2 - 12},-8 l7,1`, '#E8C89A', 1, ' opacity=".5"');
  // la porte et sa lanterne, la fenêtre
  s += forme(`M${-W / 2 + 7},0 L${-W / 2 + 7},-20 Q${-W / 2 + 13},-25 ${-W / 2 + 19},-20 L${-W / 2 + 19},0 Z`, '#5A3624', '#2E1A10', 1.6) + `<circle cx="${-W / 2 + 17}" cy="-10" r="1.1" fill="#E8C060"/>`;
  s += `<g transform="translate(${-W / 2 + 23} -22)">${ovale(0, 3, 9, 9, 'url(#ilLueurChaude)').replace('/>', `>${palpite('opacity', '0.5;1;0.5', 1.8, begin)}</ellipse>`)}`
    + trait('M0,-3 L0,0', '#3E2618', 1) + `<rect x="-2.4" y="0" width="4.8" height="6" rx="1" fill="#FFE59A" stroke="#5A3A26" stroke-width="1"/></g>`;
  s += fenetre(W / 2 - 18, -H + 9, 12, 10, begin);
  // le toit de chaume : la pente avant, le pignon, le côté ; ses brins, sa pièce de voile cousue
  const toitAvant = `M${-W / 2 - 6},${-H + 2} L${W / 2 + 4},${-H + 2} L${W / 2 + 6 - 2},${-H - 22} L${-W / 2 + 4},${-H - 22} Z`;
  s += forme(`M${W / 2 + 4},${-H + 2} L${W / 2 + P + 4},${-H - 8} L${W / 2 + P - 2},${-H - 30} L${W / 2 + 4},${-H - 22} Z`, 'url(#ilChaumeOmbre)', '#6A4A1E', 1.8);
  s += forme(toitAvant, 'url(#ilChaume)', '#6A4A1E', 1.8);
  for (let i = 0; i < 9; i++) s += trait(`M${f(-W / 2 - 3 + i * 6.6)},${-H + 1} L${f(-W / 2 + 5 + i * 6)},${-H - 20}`, '#A8803A', 1, ' opacity=".7"');
  s += trait(`M${-W / 2 - 6},${-H + 2} L${W / 2 + 4},${-H + 2}`, '#E8CC88', 1.6, ' opacity=".6"');
  if (variante !== 1) s += `<g transform="translate(${variante ? -6 : 6} ${-H - 13}) rotate(-6)"><rect x="-9" y="-6" width="18" height="12" fill="#DCD4C2" stroke="#8A7E6A" stroke-width="1.2"/>`
    + trait('M-8,-6 L-8,6 M8,-6 L8,6', '#8A7E6A', 0.8, ' stroke-dasharray="1.6 1.6"') + '</g>';
  // la cheminée de pierres et sa fumée
  s += forme(`M${W / 2 - 10},${-H - 18} L${W / 2 - 10},${-H - 34} L${W / 2 - 2},${-H - 34} L${W / 2 - 2},${-H - 22} Z`, 'url(#ilPierre)', '#3A3440', 1.6)
    + trait(`M${W / 2 - 10},${-H - 26} L${W / 2 - 2},${-H - 26}`, '#3A3440', 0.8, ' opacity=".6"') + fumee(W / 2 - 6, -H - 36);
  return s + '</g>';
}
// Une tente de voile rayée, tendue sur un mât et ses cordes ; l'entrée éclairée de l'intérieur
function tente(x, y, k, begin) {
  return ombre(x, y, 38 * k) + `<g transform="translate(${f(x)} ${f(y)}) scale(${k})">`
    + trait('M-34,0 L-18,-30 M34,0 L18,-30', '#6A5A48', 1, ' opacity=".7"')
    + forme('M-30,0 L0,-42 L30,0 Z', 'url(#ilVoile)', '#7A6A54', 2)
    + [-16, -6, 6, 16].map(dx => trait(`M0,-42 L${dx * 1.8},0`, '#C8463A', 2.6, ' opacity=".55"')).join('')
    + forme('M-8,0 L0,-24 L8,0 Z', 'url(#ilLueurTente)', '#7A6A54', 1.4).replace('/>', `>${palpite('opacity', '0.8;1;0.8', 2.2, begin)}</path>`)
    + trait('M0,-42 L0,-50', '#5A3A26', 2) + `<path d="M0,-50 L9,-47 L0,-44 Z" fill="#E8584A" stroke="#7A2A22" stroke-width=".8">${'<animateTransform attributeName="transform" type="skewY" values="-8;8;-8" dur="1.8s" repeatCount="indefinite"/>'}</path>`
    + '</g>';
}
// Le feu de camp : les bûches croisées, trois flammes qui dansent, sa lueur, des étincelles qui s'envolent
function feu(x, y) {
  const flamme = (h, w, c, d, b) => `<path d="M0,0 Q${-w},${-h * 0.4} 0,${-h} Q${w},${-h * 0.4} 0,0 Z" fill="${c}">`
    + `<animateTransform attributeName="transform" type="scale" values="1 1;0.9 1.15;1.05 0.9;1 1" keyTimes="0;0.33;0.66;1" calcMode="spline" keySplines="${SPL};${SPL};${SPL}" dur="${d}s" begin="${f(-b)}s" repeatCount="indefinite"/></path>`;
  return ovale(x, y - 8, 70, 40, 'url(#ilLueurFeu)').replace('/>', `>${palpite('opacity', '0.7;1;0.7', 1.4)}</ellipse>`)
    + `<g transform="translate(${x} ${y})">` + [[-9, 0, 9, -3], [9, 0, -9, -3]].map(([a, b, c, d]) => trait(`M${a},${b} L${c},${d}`, '#3E2618', 6) + trait(`M${a},${b} L${c},${d}`, '#8A5A36', 3.6)).join('')
    + [[-11, 1], [11, 1], [-6, 4], [6, 4], [0, 5]].map(([cx, cy]) => ovale(cx, cy, 3, 2, '#7A7480', '#3A3440', 1)).join('')
    + `<g transform="translate(0 -2)">${flamme(20, 9, '#F28A2E', 0.9, 0)}${flamme(15, 6.5, '#FFC94A', 0.7, 0.3)}${flamme(9, 3.6, '#FFF4C0', 0.6, 0.1)}</g>`
    + [0, 1, 2, 3].map(i => `<circle cx="${(i - 1.5) * 3}" cy="-14" r="1.2" fill="#FFD27A" opacity="0"><animateTransform attributeName="transform" type="translate" values="0 0;${i % 2 ? 5 : -5} -24;${i % 2 ? -2 : 3} -46" dur="${f(1.8 + i * 0.3)}s" begin="${f(-i * 0.5)}s" repeatCount="indefinite"/><animate attributeName="opacity" values="0;1;0" dur="${f(1.8 + i * 0.3)}s" begin="${f(-i * 0.5)}s" repeatCount="indefinite"/></circle>`).join('')
    + '</g>';
}
// Le poulailler : une petite cabane sur pattes, sa rampe, son toit de planches
function poulailler(x, y, k) {
  return ombre(x, y, 26 * k) + `<g transform="translate(${f(x)} ${f(y)}) scale(${k})">`
    + trait('M-14,0 L-14,-8 M14,0 L14,-8', '#4A2E1E', 3)
    + forme('M-18,-8 L18,-8 L18,-26 L-18,-26 Z', 'url(#ilPlanches)', '#3E2618', 1.6)
    + forme('M-22,-24 L0,-38 L22,-24 Z', '#A0523A', '#5A2A1E', 1.6) + trait('M-14,-28 L14,-28 M-8,-32 L8,-32', '#7A3A28', 1, ' opacity=".7"')
    + forme('M-6,-8 L-6,-18 Q0,-22 6,-18 L6,-8 Z', '#2E1A10') + trait('M-4,-8 L-12,2', '#B08458', 3) + trait('M-10,-2 l2,-1 M-7,-5 l2,-1', '#5A3A26', 1)
    + '</g>';
}
// Une poule qui picore : le corps rond, la queue, la crête, le bec ; la tête plonge vers le sol, de temps en temps
function poule(x, y, k, sens, begin, robe = '#FFF8EC') {
  const tete = `<g><animateTransform attributeName="transform" type="rotate" values="0 4 -10;0 4 -10;38 4 -10;0 4 -10;0 4 -10;34 4 -10;0 4 -10" keyTimes="0;0.4;0.48;0.56;0.7;0.76;1" calcMode="spline" keySplines="${Array(6).fill(SPL).join(';')}" dur="3.2s" begin="${f(-begin)}s" repeatCount="indefinite"/>`
    + `<circle cx="7" cy="-14" r="4.2" fill="${robe}" stroke="#8A7A64" stroke-width="1.1"/>`
    + forme('M5,-18 Q6,-22 8,-19 Q9,-22 10,-18 Z', '#E8443A', '#9A2A22', 0.7) + forme('M10.6,-14.4 L14,-13.2 L10.6,-12.2 Z', '#F2B640', '#A0701A', 0.6)
    + `<circle cx="8.4" cy="-14.8" r=".9" fill="#2E1A10"/>` + forme('M9,-11 Q9.8,-8.6 8.6,-8.4 Q8,-9.6 8.6,-11 Z', '#E8443A') + '</g>';
  return ombre(x, y, 9 * k) + `<g transform="translate(${f(x)} ${f(y)}) scale(${f(k * sens)} ${f(k)})">`
    + trait('M-1,-2 L-2,0 M2,-2 L3,0', '#E8A030', 1.4)
    + forme('M-8,-8 Q-12,-16 -9,-20 Q-5,-14 -3,-12 Z', '#C8B89A', '#8A7A64', 1) + ovale(0, -7, 8, 6, robe, '#8A7A64', 1.2) + trait('M-4,-8 Q0,-5 4,-8', '#C8B89A', 1)
    + tete + '</g>';
}
// Un mouton : une toison de bulles crème, la tête et les pattes sombres ; il broute
function mouton(x, y, k, sens, begin) {
  return ombre(x, y, 16 * k) + `<g transform="translate(${f(x)} ${f(y)}) scale(${f(k * sens)} ${f(k)})">`
    + trait('M-7,-4 L-7,0 M-2,-4 L-2,0 M5,-4 L5,0 M9,-4 L9,0', '#3A3038', 2.4)
    + [[-8, -10, 6], [-2, -13, 7], [5, -12, 6.5], [9, -8, 5], [-4, -7, 6], [3, -7, 6]].map(([cx, cy, r]) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#ilLaine)" stroke="#9A8E80" stroke-width="1.1"/>`).join('')
    + ovale(-3, -15, 4, 2, '#FFFFFF', 'none', 0, ' opacity=".7"')
    + `<g><animateTransform attributeName="transform" type="rotate" values="0 12 -10;24 12 -10;24 12 -10;0 12 -10;0 12 -10" keyTimes="0;0.2;0.6;0.75;1" calcMode="spline" keySplines="${Array(4).fill(SPL).join(';')}" dur="5s" begin="${f(-begin)}s" repeatCount="indefinite"/>`
    + ovale(16, -10, 4.4, 3.6, '#3A3038', '#1E1A20', 1) + ovale(13.4, -12.6, 2, 1.2, '#3A3038', '#1E1A20', 0.8) + `<circle cx="17.4" cy="-10.8" r=".8" fill="#FFFFFF"/>` + '</g></g>';
}
// Une chèvre : pelage brun et blanc, cornes courbes, barbiche ; elle relève la tête de temps en temps
function chevre(x, y, k, sens, begin) {
  return ombre(x, y, 14 * k) + `<g transform="translate(${f(x)} ${f(y)}) scale(${f(k * sens)} ${f(k)})">`
    + trait('M-7,-6 L-7,0 M-3,-6 L-3,0 M5,-6 L5,0 M8,-6 L8,0', '#5A3A26', 2.2)
    + forme('M-11,-8 Q-12,-16 -4,-17 L8,-17 Q13,-16 12,-8 Q8,-4 0,-4 Q-8,-4 -11,-8 Z', 'url(#ilChevre)', '#4A2E1E', 1.3)
    + forme('M-2,-17 Q4,-12 10,-16 L8,-17 Z', '#FFF6E8', 'none', 0, ' opacity=".8"') + trait('M-11,-12 L-15,-16', '#4A2E1E', 1.6)
    + `<g><animateTransform attributeName="transform" type="rotate" values="0 10 -16;0 10 -16;-18 10 -16;-18 10 -16;0 10 -16" keyTimes="0;0.4;0.5;0.8;1" calcMode="spline" keySplines="${Array(4).fill(SPL).join(';')}" dur="6s" begin="${f(-begin)}s" repeatCount="indefinite"/>`
    + forme('M10,-16 Q16,-24 20,-19 Q22,-14 17,-12 Q12,-12 10,-16 Z', 'url(#ilChevre)', '#4A2E1E', 1.2)
    + trait('M14,-22 Q12,-29 7,-29 M16,-22 Q16,-29 11,-31', '#C8B48A', 1.8) + trait('M18,-12 L18,-8', '#FFF6E8', 1.6)
    + `<circle cx="17" cy="-18" r=".8" fill="#1E1A10"/>` + '</g></g>';
}
// Un fil à linge entre deux perches : trois linges qui battent au vent
function linge(x0, y0, x1, y1) {
  const mx = (x0 + x1) / 2, my = Math.max(y0, y1) - 14;
  const draps = [['#F2E6D0', 0.25], ['#7EB0E0', 0.5], ['#E8A0A8', 0.75]].map(([c, t], i) => {
    const x = x0 + (x1 - x0) * t, y = (1 - t) * (1 - t) * (y0 - 26) + 2 * t * (1 - t) * my + t * t * (y1 - 26);
    return `<g transform="translate(${f(x)} ${f(y)})"><g><animateTransform attributeName="transform" type="skewX" values="-10;8;-10" keyTimes="0;0.5;1" calcMode="spline" keySplines="${SPL};${SPL}" dur="${f(2.2 + i * 0.3)}s" begin="${f(-i * 0.6)}s" repeatCount="indefinite"/>`
      + forme('M-6,0 L6,0 L7,14 Q0,16 -7,14 Z', c, '#6A5A54', 1.1) + trait('M-4,4 L4,4', '#FFFFFF', 1, ' opacity=".4"') + '</g></g>';
  }).join('');
  return trait(`M${x0},${y0} L${x0},${y0 - 28} M${x1},${y1} L${x1},${y1 - 28}`, '#5A3A26', 2.6) + trait(`M${x0},${y0 - 26} Q${mx},${my} ${x1},${y1 - 26}`, '#D8CCB0', 1) + draps;
}
// La barque échouée sur le sable, sa rame
function barque(x, y, k) {
  return ombre(x, y + 2, 34 * k) + `<g transform="translate(${f(x)} ${f(y)}) scale(${k}) rotate(-8)">`
    + forme('M-30,-8 Q-28,4 -14,6 L18,6 Q30,4 34,-10 Z', 'url(#ilCoque)', '#3E2618', 1.8)
    + forme('M-30,-8 L34,-10 Q2,-4 -30,-8 Z', '#3E2618') + trait('M-26,-2 L30,-4 M-20,3 L24,2', '#5A3A26', 1, ' opacity=".6"')
    + trait('M-6,-12 L22,4', '#B08458', 2.4) + forme('M20,2 l8,6 l-2,2 l-8,-5 Z', '#B08458', '#5A3A26', 1) + '</g>';
}

// Les dégradés de l'île
const defs = () => '<defs>'
  + rayonne('ilHerbe', -40, -30, 300, [[0, '#C4EC96'], [0.45, '#7DBE64'], [0.85, '#4A8C56'], [1, '#2F6A48']])
  + degrade('ilFalaise', 0, 20, 0, 130, [[0, '#A8927E'], [0.4, '#76625E'], [1, '#3A3248']])
  + degrade('ilSable', 0, 40, 0, 154, [[0, '#F8E2AE'], [1, '#C89E68']])
  + degrade('ilChemin', 0, -10, 0, 120, [[0, '#E2C893'], [1, '#C8A46E']])
  + rayonne('ilOmbre', 0.5, 0.5, 0.5, [[0, '#14243A', 0.45], [1, '#14243A', 0]]).replace('gradientUnits="userSpaceOnUse" ', '')
  + rayonne('ilFeuillage', -8, -56, 36, [[0, '#A8DC7A'], [0.6, '#5FA25A'], [1, '#2F6A46']])
  + rayonne('ilFeuillage2', -8, -56, 36, [[0, '#C8E08A'], [0.6, '#86AE52'], [1, '#4A6E3A']])
  + rayonne('ilBuisson', -4, -18, 22, [[0, '#9CD47A'], [1, '#3E7E4E']])
  + degrade('ilSapin', 0, -50, 0, 0, [[0, '#6AB07A'], [1, '#235A42']])
  + degrade('ilTronc', -4, 0, 4, 0, [[0, '#8A6244'], [1, '#5A3A26']])
  + degrade('ilPlanches', 0, -30, 0, 0, [[0, '#C49466'], [1, '#8A5E3C']])
  + degrade('ilPlanchesOmbre', 0, -40, 0, 0, [[0, '#8A6448'], [1, '#5A3E2C']])
  + degrade('ilChaume', 0, -52, 0, -28, [[0, '#F2D48A'], [1, '#B48A44']])
  + degrade('ilChaumeOmbre', 0, -60, 0, -28, [[0, '#C8A460'], [1, '#8A6430']])
  + degrade('ilPierre', 0, -64, 0, -48, [[0, '#A8A2AE'], [1, '#6A6474']])
  + degrade('ilVitre', 0, -22, 0, -10, [[0, '#FFF2B8'], [1, '#FFB84A']])
  + degrade('ilVoile', 0, -42, 0, 0, [[0, '#FFF8EA'], [1, '#D8C8A8']])
  + degrade('ilLueurTente', 0, -24, 0, 0, [[0, '#FFE69A'], [1, '#F2A040']])
  + degrade('ilTerre', 0, -10, 0, 50, [[0, '#9A6A44'], [1, '#6A4430']])
  + degrade('ilEpi', 0, -20, 0, -12, [[0, '#FFE69A'], [1, '#D8A440']])
  + degrade('ilCoque', 0, -10, 0, 6, [[0, '#A87650'], [1, '#6A4430']])
  + degrade('ilChevre', 0, -24, 0, -4, [[0, '#C8946A'], [1, '#8A5A3A']])
  + rayonne('ilLaine', -2, -14, 14, [[0, '#FFFDF6'], [1, '#E2D6C2']])
  + rayonne('ilLueurChaude', 0.5, 0.5, 0.5, [[0, '#FFD27A', 0.6], [1, '#FFB04A', 0]]).replace('gradientUnits="userSpaceOnUse" ', '')
  + rayonne('ilLueurFeu', 0.5, 0.5, 0.5, [[0, '#FFC060', 0.55], [0.5, '#FF9A40', 0.18], [1, '#FF9A40', 0]]).replace('gradientUnits="userSpaceOnUse" ', '')
  + rayonne('ilFumee', 0.5, 0.5, 0.5, [[0, '#DCE4EE', 0.8], [1, '#DCE4EE', 0]]).replace('gradientUnits="userSpaceOnUse" ', '')
  + '</defs>';

function ileVivante() {
  let s = defs();
  // l'écume qui respire autour, la plage, la falaise et ses strates, sa mousse ; l'herbe et sa lumière
  s += ovale(0, 132, 320, 40, '#E8F6FF', 'none', 0, ' opacity=".35"').replace('/>', `>${palpite('rx', '312;328;312', 4.6)}</ellipse>`);
  s += forme('M-300,44 Q-312,140 0,154 Q312,140 300,44 Z', 'url(#ilSable)', '#B88A58', 2.4);
  s += forme('M-274,22 Q-282,74 -232,94 Q-120,124 0,124 Q120,124 232,94 Q282,74 274,22 Z', 'url(#ilFalaise)', '#3A2E3A', 2.6);
  s += trait('M-262,52 Q-140,84 0,86 Q140,84 262,52 M-240,74 Q-120,104 0,106 Q120,104 240,74', '#4A3E4E', 1.4, ' opacity=".55"');
  s += trait('M-180,76 L-172,98 M-60,92 L-56,112 M70,92 L66,112 M190,74 L182,96', '#2E2636', 1.4, ' opacity=".5"');
  s += ovale(0, 16, 274, 76, 'url(#ilHerbe)', '#2F5E3E', 2.6);
  s += [-230, -170, -96, -20, 60, 140, 210].map((x, i) => forme(`M${x - 10},${f(16 + 76 * Math.sqrt(1 - (x / 274) ** 2) - 3)} q4,${10 + (i % 3) * 5} 10,${8 + (i % 2) * 6} q4,${-6 - (i % 3) * 4} 8,-12 Z`, '#4A8C56', '#2F5E3E', 1.2)).join('');
  s += trait('M-240,-14 Q-120,-56 0,-58 Q120,-56 240,-14', '#E4F8B8', 3, ' opacity=".45"');
  s += herbes(150, 5);
  // le chemin de la plage au feu, et vers les cabanes
  s += forme('M-10,92 Q-22,70 -6,54 Q8,42 -2,30 L10,30 Q18,44 6,56 Q-6,72 8,92 Z', 'url(#ilChemin)', '#B08A5A', 1.4);
  s += trait('M2,30 Q-40,12 -96,4 M4,30 Q60,14 112,4', '#D8BC88', 7, ' opacity=".8"');
  // tout ce qui est posé sur l'île : les dessins du jeu (le campement, les cultures, le verger, les bêtes), du fond
  // vers l'avant (triés sur y) ; les bêtes respirent d'un rien
  const C = 'decor/camp/coins/', B = 'animaux/ferme/';
  const POSES = [
    ['decor/verger/pommier/verger_pommier_mur_1.svg', -120, -52, 0.85], ['decor/verger/cerisier/verger_cerisier_floraison_1.svg', 140, -54, 0.85],
    ['decor/verger/pommier/verger_pommier_mur_1.svg', 250, -6, 0.75], ['decor/verger/cerisier/verger_cerisier_floraison_1.svg', -252, -4, 0.75],
    [`${C}aster/aster_cabanon_2.svg`, -170, -22, 1.15], [`${C}sylve/sylve_cabanon_1.svg`, -52, -40, 1], [`${C}melisse/melisse_cabanon_1.svg`, 66, -38, 1.05],
    [`${C}rivet/rivet_cabanon_1.svg`, 178, -20, 1.1], [`${C}ondin/ondin_cabanon_2.svg`, -236, 30, 0.95], [`${C}galet/galet_debris_1.svg`, 236, 30, 0.95],
    [`${C}cannelle/cannelle_debris_3.svg`, 0, 22, 1.15], ['decor/camp/objets/etendoir_2.svg', -92, 24, 0.95], ['decor/camp/objets/caisses_1.svg', 96, 14, 0.85],
    ['decor/camp/objets/torche_1.svg', -36, 58, 0.75], ['decor/camp/objets/torche_1.svg', 40, 58, 0.75],
    ['decor/cultures/ble/culture_ble_croissance_3.svg', 128, 54, 1.05], ['decor/cultures/choux/culture_choux_croissance_3.svg', -170, 64, 0.95],
    ['decor/cultures/carottes/culture_carottes_croissance_3.svg', 214, 74, 0.85],
    [`${B}poule-rousse/poule-rousse_avant_repos.svg`, -62, 60, 1.1, 1], [`${B}poule-blanche/poule-blanche_avant_repos.svg`, -42, 70, 1.05, 1],
    [`${B}mouton/mouton_avant_repos.svg`, 64, 70, 1.2, 1], [`${B}chevre/chevre_avant_repos.svg`, 28, 78, 1.1, 1], [`${B}vache/vache_avant_repos.svg`, -112, 76, 1, 1],
    [`${B}chat/chat_avant_assis_1.svg`, -8, 80, 1.1, 1],
    ['decor/camp/epave/hirondelle_1.svg', -190, 150, 0.7]
  ];
  s += POSES.map((o, i) => ({ y: o[2], i, o })).sort((a, b) => a.y - b.y || a.i - b.i).map(({ o: [rel, x, y, k, vit], i }) => {
    const dessin = poser(rel, `il${i}`, x, y, k);
    return vit ? `<g>${vaVient('translate', '0 0', '0 -1.2', 2.4 + (i % 3) * 0.4, i * 0.3)}${dessin}</g>` : dessin;
  }).join('');
  return s;
}

module.exports = { ileVivante };
