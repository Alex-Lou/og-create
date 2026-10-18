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

// ---- le fondu néon des habits (choix de l'auteur, 18 oct. : « pas entièrement, mais fondre et adapter davantage ») ----
// Chaque couleur glisse vers sa voisine de la palette néon en gardant sa clarté : l'ombre et le reflet d'un habit gardent
// leur écart, l'habit reste reconnaissable. Les teintes chaudes et ternes (le beige, le brun, le kaki sépia) s'en vont
// davantage, vers le mauve et l'aubergine ; les gris prennent un rien de froid. Une fonction pure : la même couleur donne
// toujours la même couleur, partout (les naufragés reconnaissent leurs habits à leur couleur : naufrages.js).
// [teinte de départ (degrés, jusqu'à), teinte visée, force]
const BANDES = [[15, 350, 0.35], [40, 6, 0.3], [62, 28, 0.3], [100, 165, 0.45], [160, 172, 0.4], [200, 186, 0.3], [240, 232, 0.3],
  [275, 262, 0.3], [315, 300, 0.35], [345, 328, 0.35], [360, 350, 0.35]];
const vers = (h, cible, k) => { const d = ((cible - h + 540) % 360) - 180; return (h + d * k + 360) % 360; };
const fondu = memo(c => {
  const [h, s, l] = hsl(c);
  // les gris : un rien de froid
  if (s < 0.12) return hex([255, Math.max(s, 0.1), l]);
  // le beige, le brun, le kaki sépia : vers le mauve et l'aubergine, un peu moins saturés
  if (h >= 15 && h < 62 && s < 0.55) return hex([vers(h, l > 0.7 ? 300 : 330, 0.5), s * 0.8, l]);
  // l'olive et le vert jaune : vers la sarcelle mousse, un peu moins vifs
  if (h >= 62 && h < 100) return hex([vers(h, 165, 0.4), s * 0.85, l]);
  const [, cible, k] = BANDES.find(([fin]) => h < fin);
  return hex([vers(h, cible, k), Math.min(1, s * 1.04), l]);
});
// Ce qui ne se fond pas : le corps (la peau, les cheveux, les yeux, la bouche…), les métaux, les lumières
const GARDER = /^(skin|lid|under|nose|hair|grey|stubble|beard|white|brow|eye|iris|cheek|mouth|tongue|freckle|lip|hand|vein|scar|mole|teeth|rim|brass|steel|copper|silver|iron|gem|glass|gold|glow|firefly|star|moon)/i;
const HEXA = /#[0-9A-Fa-f]{6}\b/g, UNE = /^#[0-9A-Fa-f]{6}$/;
const fonduTexte = s => s.replace(HEXA, m => fondu(m.toUpperCase()));
// Une palette, un réglage, un dessin (objets, tableaux, chaînes, fonctions qui rendent du SVG), fondus en profondeur ; les
// clés du corps gardent leurs couleurs (et celles des clés « de couleur » d'une table de correspondance aussi)
function fondre(x, garder = GARDER) {
  if (typeof x === 'string') return fonduTexte(x);
  if (typeof x === 'function') return (...a) => fondre(x(...a), garder);
  if (Array.isArray(x)) return x.map(v => fondre(v, garder));
  if (x && typeof x === 'object') return Object.fromEntries(Object.entries(x).map(([k, v]) => (garder.test(k) ? [k, v] : [UNE.test(k) ? fonduTexte(k) : k, fondre(v, garder)])));
  return x;
}

module.exports = { ENCRE, ENCRE_KIT, NUIT, PASTEL, memo, hsl, hex, mix, ton, delave, clarte, enPersonnage, fondu, fondre, GARDER };
