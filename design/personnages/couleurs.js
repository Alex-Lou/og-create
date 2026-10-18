// Les couleurs des personnages : une seule source pour tout ce qui les dessine (la troupe, le kit de l'avatar, les
// naufragés), dans l'atelier comme dans le jeu (le kit de l'avatar y est livré par build_bundle.js).
// Le papier néon (choix de l'auteur, 18 oct.) : le trait passe du brun à l'indigo ; les ombres vont vers le violet, jamais
// vers le brun ; les tissus délavés par la mer vont vers un pastel froid (lavande, jean usé, rose fané), jamais vers le
// beige. La teinte de chaque couleur reste la sienne : seules ses ombres et son délavé changent de direction.
// Les calculs sont mis en cache (ils reviennent des milliers de fois : chaque pièce, chaque image, chaque avatar) ; le
// cache est borné, il se vide quand il est plein : jamais de fuite de mémoire, même quand le jeu dessine à la volée.

// le trait des personnages ; celui du kit de dessin (troupe.js), que gardent le décor et les bêtes tant qu'ils ne sont pas
// passés au papier néon (choix de l'auteur, 18 oct. : les personnages seulement, pour l'instant)
const ENCRE = '#0A0418';
const ENCRE_KIT = '#3C2819';
// la nuit vers laquelle descendent les ombres
const NUIT = '#2A1650';
// le pastel froid vers lequel la mer délave les tissus
const PASTEL = '#B4A8DC';

// Une fonction pure, mise en cache (ses arguments, des chaînes ou des nombres, font la clé)
function memo(fn, max = 4096) {
  const cache = new Map();
  return (...args) => {
    const cle = args.join('|');
    let v = cache.get(cle);
    if (v === undefined) {
      if (cache.size >= max) cache.clear();
      v = fn(...args);
      cache.set(cle, v);
    }
    return v;
  };
}

function hsl(c) {
  const n = parseInt(c.slice(1), 16), r = (n >> 16) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn;
  let h = 0, s = 0;
  if (d) {
    s = d / (1 - Math.abs(2 * l - 1));
    h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
    h *= 60; if (h < 0) h += 360;
  }
  return [h, s, l];
}
function hex([h, s, l]) {
  const c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs(((h / 60) % 2) - 1)), m = l - c / 2;
  const [r, g, b] = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
  return '#' + [r, g, b].map(v => Math.round(Math.min(1, Math.max(0, v + m)) * 255).toString(16).padStart(2, '0')).join('').toUpperCase();
}
// le mélange de deux couleurs (k : la part de la seconde)
const mix = memo((a, b, k) => {
  const p = c => [0, 2, 4].map(i => parseInt(c.slice(1 + i, 3 + i), 16)), A = p(a), B = p(b);
  return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * k).toString(16).padStart(2, '0')).join('').toUpperCase();
});
// plus clair (k > 1) en gardant la teinte ; plus sombre (k < 1) : la même teinte, qui descend vers la nuit violette
// d'autant plus qu'elle s'assombrit (au plus 28 %)
const ton = memo((c, k) => {
  const [h, s, l] = hsl(c);
  if (k >= 1) return hex([h, s, l + (1 - l) * (k - 1)]);
  return mix(hex([h, s, l * k]), NUIT, Math.min(0.28, (1 - k) * 1.1));
});
// délavé par la mer (k : la force) : moins saturé, plus clair, et un peu vers le pastel froid
const delave = memo((c, k = 1) => {
  const [h, s, l] = hsl(c);
  return mix(hex([h, s * (1 - 0.45 * k), l + (0.74 - l) * 0.26 * k]), PASTEL, 0.3 * k);
});
const clarte = c => hsl(c)[2];
// Un dessin de personnage, sorti du kit : son trait passe à l'encre des personnages (le kit l'écrit toujours ainsi)
const enPersonnage = svg => svg.replaceAll(ENCRE_KIT, ENCRE);

module.exports = { ENCRE, ENCRE_KIT, NUIT, PASTEL, memo, hsl, hex, mix, ton, delave, clarte, enPersonnage };
