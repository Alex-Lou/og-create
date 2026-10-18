// L'orage de l'écran de démarrage (choix de l'auteur, 17 oct. : « les deux visages du jeu ») : qui reste sur l'écran voit
// le ciel tourner ; à chaque éclair, l'île et les maîtres se montrent un instant sous leur autre visage (splash_survie.js).
// Ici, ce qui se dessine : le banc de nuages d'orage (nuages.svg, posé deux fois, en miroir, qui glisse sur la lune),
// les trois éclairs (dans index.html, entre leurs balises : chacun s'allume à son heure), et l'aura de Brume en démon
// (aura.svg, souffle.svg : elle se diffuse autour d'elle à chaque éclair). La mise en scène (le cycle,
// la pluie, le voile, les flashs) : public/splash.css, « 5. L'orage » ; son déclenchement : le script d'index.html.
// Pas de filtre : les lueurs se font aux dégradés et aux traits superposés.
const { f, rnd } = require('./scenes7').outils;

// ═══ le banc de nuages ═══
// Des bosses de nuage sombre qui se fondent en une seule masse (un même dégradé, du haut vers le bas), plus dense en
// haut à gauche (il arrive du bord de l'écran), son ventre bosselé en bas ; derrière, la même masse un peu plus haut,
// plus claire : le liseré de lune sur sa crête ; elle s'efface vers la droite. 1000 × 420
function nuages() {
  const g = rnd(41), W = 1000, H = 420, bulles = [];
  for (let i = 0; i < 30; i++) {
    const t = i / 29;
    bulles.push([t * W * 0.95 + (g() - 0.5) * 50, 70 + t * 110 + (g() - 0.5) * 60, (160 - t * 80) * (0.75 + g() * 0.45)]);
  }
  for (let i = 0; i < 20; i++) {
    const t = i / 19;
    bulles.push([t * W * 0.88 + (g() - 0.5) * 30, 220 + t * 100 + (g() - 0.5) * 26, (78 - t * 38) * (0.8 + g() * 0.35)]);
  }
  const masse = (fill, dy = 0) => bulles.map(([x, y, r]) => `<circle cx="${f(x)}" cy="${f(y + dy)}" r="${f(r)}"/>`).join('').replace(/^/, `<g fill="${fill}">`) + '</g>';
  const defs = '<defs>'
    + `<linearGradient id="nuCorps" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="${H}"><stop offset="0" stop-color="#121628"/><stop offset=".55" stop-color="#1C223C"/><stop offset="1" stop-color="#2C3456"/></linearGradient>`
    + '<linearGradient id="nuFondu" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff"/><stop offset=".72" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>'
    + `<mask id="nuMasque"><rect width="${W}" height="${H}" fill="url(#nuFondu)"/></mask></defs>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">${defs}<g mask="url(#nuMasque)">`
    + `<g opacity=".55">${masse('#8696C2', -5)}</g>${masse('url(#nuCorps)')}</g></svg>`;
}

// ═══ les éclairs ═══
// Un éclair : un tracé brisé du haut vers le bas, qui s'écarte au hasard, et deux ou trois branches qui s'en détachent ;
// trois traits superposés : la lueur bleue large et pâle, le trait clair, le cœur blanc. Repère 200 × 600
function eclair(seed, branches) {
  const g = rnd(seed);
  const tronc = [[100 + (g() - 0.5) * 30, 0]];
  while (tronc[tronc.length - 1][1] < 600) {
    const [x, y] = tronc[tronc.length - 1];
    tronc.push([Math.max(20, Math.min(180, x + (g() - 0.5) * 54)), y + 22 + g() * 34]);
  }
  const chemins = [tronc];
  for (let b = 0; b < branches; b++) {
    const k = 2 + Math.floor(g() * (tronc.length - 6)), sens = g() < 0.5 ? -1 : 1, br = [tronc[k]];
    for (let j = 0; j < 4 + Math.floor(g() * 3); j++) {
      const [x, y] = br[br.length - 1];
      br.push([Math.max(12, Math.min(188, x + sens * (10 + g() * 22))), y + 16 + g() * 22]);
    }
    chemins.push(br);
  }
  const d = pts => `M${pts.map(([x, y]) => `${f(x)},${f(y)}`).join(' L')}`;
  return chemins.map((c, i) => {
    const k = i ? 0.6 : 1;
    return `<path d="${d(c)}" fill="none" stroke="#8FB8FF" stroke-width="${f(26 * k)}" stroke-linecap="round" stroke-linejoin="round" opacity=".16"/>`
      + `<path d="${d(c)}" fill="none" stroke="#B8D4FF" stroke-width="${f(13 * k)}" stroke-linecap="round" stroke-linejoin="round" opacity=".3"/>`
      + `<path d="${d(c)}" fill="none" stroke="#DCEAFF" stroke-width="${f(6.5 * k)}" stroke-linecap="round" stroke-linejoin="round" opacity=".9"/>`
      + `<path d="${d(c)}" fill="none" stroke="#FFFFFF" stroke-width="${f(3 * k)}" stroke-linecap="round" stroke-linejoin="round"/>`;
  }).join('');
}
// Les trois éclairs, tels qu'index.html les porte (a : à gauche, b : à droite, c : au centre, le plus grand, sur l'île)
const ECLAIRS = [['a', 7, 2], ['b', 19, 3], ['c', 33, 3]];
const eclairs = () => ECLAIRS.map(([nom, seed, br]) => `<svg class="splash__eclair splash__eclair--${nom}" viewBox="0 0 200 600" preserveAspectRatio="none" aria-hidden="true">${eclair(seed, br)}</svg>`).join('');

// ═══ l'aura du démon ═══
// Choix de l'auteur, 17 oct. : « une animation smooth de son aura, vraiment visible, propagée, diffusée pendant le flash
// de l'éclair ; un effet propre, avec une vraie texture ». Deux images immobiles, que public/splash.css fait vivre :
// - aura.svg : une couronne de feu autour d'elle, sa lueur large, des volutes de feu qui partent d'elle en tournoyant
//   (trois couches : larges et diffuses, moyennes, fines et vives), des arcs de chaleur, un grain serré et des braises ;
//   tout s'efface vers le dehors (un même dégradé, depuis le centre). Posée deux fois, qui tournent en sens contraire :
//   le feu tourbillonne ;
// - souffle.svg : l'onde de feu que chaque éclair propage autour d'elle, un anneau de stries qui s'élargit et se dissipe ;
//   en mode écran (sa lumière s'ajoute à ce qu'elle couvre).
// Repère 1000 × 1000, Brume au centre.
const C = 500;
const pt = (r, a) => `${f(C + r * Math.cos(a))},${f(C + r * Math.sin(a))}`;
// Un filament : de deux points de sa base (rayon r0) à sa pointe (rayon r1), qui tourne de c en montant
function filament(a, r0, r1, w, c) {
  const da = w / r0, rm = (r0 + r1) / 2;
  return `M${pt(r0, a - da)} Q${pt(rm, a + c * 0.45 - da * 0.6)} ${pt(r1, a + c)} Q${pt(rm, a + c * 0.5 + da * 0.6)} ${pt(r0, a + da)} Z`;
}
function couronne(g, n, [r0a, r0b], [r1a, r1b], [wa, wb], [ca, cb]) {
  let d = '';
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + g() * 0.2;
    d += filament(a, r0a + g() * (r0b - r0a), r1a + g() * (r1b - r1a), wa + g() * (wb - wa), ca + g() * (cb - ca)) + ' ';
  }
  return d.trim();
}
function aura() {
  const g = rnd(53);
  const defs = '<defs>'
    + `<radialGradient id="auLueur" gradientUnits="userSpaceOnUse" cx="${C}" cy="${C}" r="500"><stop offset="0" stop-color="#FF9A2E" stop-opacity=".7"/><stop offset=".28" stop-color="#E2501E" stop-opacity=".5"/><stop offset=".55" stop-color="#9E1C12" stop-opacity=".22"/><stop offset=".8" stop-color="#6A0E0C" stop-opacity=".05"/><stop offset="1" stop-color="#6A0E0C" stop-opacity="0"/></radialGradient>`
    + `<radialGradient id="auFeu" gradientUnits="userSpaceOnUse" cx="${C}" cy="${C}" r="480"><stop offset="0" stop-color="#FFE6A0"/><stop offset=".32" stop-color="#FFB43C" stop-opacity=".9"/><stop offset=".55" stop-color="#FF5A1E" stop-opacity=".7"/><stop offset=".75" stop-color="#C8241A" stop-opacity=".35"/><stop offset="1" stop-color="#9E1C12" stop-opacity="0"/></radialGradient>`
    + '</defs>';
  let s = defs + `<circle cx="${C}" cy="${C}" r="500" fill="url(#auLueur)"/>`;
  // les filaments : larges et sombres, puis moyens, puis fins et vifs ; ils tournent tous dans le même sens
  s += `<path d="${couronne(g, 36, [60, 120], [360, 480], [30, 50], [0.7, 1.1])}" fill="url(#auFeu)" opacity=".42"/>`;
  s += `<path d="${couronne(g, 60, [90, 150], [280, 420], [10, 20], [0.6, 0.9])}" fill="url(#auFeu)" opacity=".55"/>`;
  s += `<path d="${couronne(g, 90, [120, 180], [220, 360], [2, 4], [0.5, 0.8])}" fill="url(#auFeu)" opacity=".85"/>`;
  // les arcs de chaleur, qui tournoient avec eux
  let arcs = '';
  for (let i = 0; i < 24; i++) {
    const r = 220 + g() * 200, a = g() * Math.PI * 2, l = 0.3 + g() * 0.6;
    arcs += `<path d="M${pt(r, a)} A${f(r)},${f(r)} 0 0 1 ${pt(r, a + l)}" stroke-width="${f(1.5 + g() * 3.5)}" opacity="${f(0.25 + g() * 0.25)}"/>`;
  }
  s += `<g fill="none" stroke="url(#auFeu)" stroke-linecap="round">${arcs}</g>`;
  // le grain : des points clairs, plus serrés et plus vifs près d'elle ; et des braises
  let grain = '';
  for (let i = 0; i < 700; i++) {
    const r = 160 + Math.pow(g(), 0.8) * 300, a = g() * Math.PI * 2;
    grain += `<circle cx="${f(C + r * Math.cos(a))}" cy="${f(C + r * Math.sin(a))}" r="${f(0.8 + g() * 1.6)}" opacity="${f((1 - (r - 160) / 320) * (0.2 + g() * 0.5))}"/>`;
  }
  s += `<g fill="#FFE6A0">${grain}</g>`;
  for (let i = 0; i < 30; i++) {
    const r = 200 + g() * 230, a = g() * Math.PI * 2, x = C + r * Math.cos(a), y = C + r * Math.sin(a), k = 1.5 + g() * 1.5;
    s += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(k * 3)}" fill="#FF9A2E" opacity=".25"/><circle cx="${f(x)}" cy="${f(y)}" r="${f(k)}" fill="#FFF6D8"/>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000">${s}</svg>`;
}
function souffle() {
  const g = rnd(61);
  const defs = `<defs><radialGradient id="soOnde" gradientUnits="userSpaceOnUse" cx="${C}" cy="${C}" r="500"><stop offset="0" stop-color="#FF8A2A" stop-opacity="0"/><stop offset=".7" stop-color="#FF8A2A" stop-opacity="0"/>`
    + '<stop offset=".84" stop-color="#FFD27A"/><stop offset=".9" stop-color="#FF5A1E" stop-opacity=".75"/><stop offset="1" stop-color="#C8301C" stop-opacity="0"/></radialGradient></defs>';
  let s = defs + `<circle cx="${C}" cy="${C}" r="440" fill="none" stroke="url(#soOnde)" stroke-width="44" opacity=".8"/>`;
  // les stries de l'onde, couchées dans le sens où elle tourne
  let d = '';
  for (let i = 0; i < 160; i++) {
    const a = (i / 160) * Math.PI * 2 + g() * 0.03;
    d += filament(a, 380 + g() * 40, 450 + g() * 45, 1.2 + g() * 2.4, 0.05 + g() * 0.08) + ' ';
  }
  s += `<path d="${d.trim()}" fill="url(#soOnde)"/>`;
  let grain = '';
  for (let i = 0; i < 260; i++) {
    const r = 395 + g() * 80, a = g() * Math.PI * 2;
    grain += `<circle cx="${f(C + r * Math.cos(a))}" cy="${f(C + r * Math.sin(a))}" r="${f(0.8 + g() * 1.4)}" opacity="${f(0.3 + g() * 0.5)}"/>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000">${s}<g fill="#FFF0C0">${grain}</g></svg>`;
}

module.exports = { nuages, eclairs, aura, souffle };
