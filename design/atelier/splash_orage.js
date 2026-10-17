// L'orage de l'écran de démarrage (choix de l'auteur, 17 oct. : « les deux visages du jeu ») : qui reste sur l'écran voit
// le ciel tourner ; à chaque éclair, l'île et les maîtres se montrent un instant sous leur autre visage (splash_survie.js).
// Ici, ce qui se dessine : le banc de nuages d'orage (nuages.svg, posé deux fois, en miroir, qui glisse sur la lune) et
// les trois éclairs (dans index.html, entre leurs balises : chacun s'allume à son heure). La mise en scène (le cycle,
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

module.exports = { nuages, eclairs };
