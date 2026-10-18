// La palette du papier néon (choix de l'auteur, 17 oct. : « toutes les IA mettent ce sépia, cet effet souvenir » ; de la
// fraîcheur, du peps, les couleurs de la jungle de nuit : sarcelle, cyan, magenta, violet, éclats orange et vert acide) :
// une couleur de la gravure passée dans la palette néon (neon_naufrage.js, neon_reveil.js : recolore) ; l'encre devient
// un indigo profond, les ocres et les crèmes des coraux et des roses, les jaunes des lumières vert acide, la mer une
// sarcelle vive.
// ——— la palette ———
const hsl = hex => {
  const n = hex.length === 4 ? hex.slice(1).split('').map(c => parseInt(c + c, 16) / 255) : [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255);
  const [r, g, b] = n, mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn;
  if (!d) return [0, 0, l];
  const s = d / (1 - Math.abs(2 * l - 1));
  const h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [(h * 60 + 360) % 360, s, l];
};
const versHex = (h, s, l) => {
  const c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs(((h / 60) % 2) - 1)), m = l - c / 2;
  const [r, g, b] = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
  return '#' + [r, g, b].map(v => Math.round(Math.min(1, Math.max(0, v + m)) * 255).toString(16).padStart(2, '0')).join('').toUpperCase();
};
const borne = (v, a, b) => Math.min(b, Math.max(a, v));
// une couleur de la gravure dans la palette néon
function neon(hex) {
  const [h, s, l] = hsl(hex);
  // (l'encre, les noirs : un indigo profond)
  if (l < 0.13) return versHex(258, 0.6, borne(l + 0.05, 0.07, 0.15));
  // (les gris, peu saturés : bleutés, violets)
  if (s < 0.12) return versHex(250, 0.35, borne(l, 0.15, 0.9));
  // (les crèmes et les blancs chauds : un rose pâle lumineux)
  if (h >= 20 && h < 75 && l > 0.72) return versHex(325, 0.85, borne(l + 0.04, 0.8, 0.93));
  // (les jaunes vifs, les lumières, le soufre : vert acide)
  if (h >= 38 && h < 75 && s > 0.7) return versHex(78, 0.9, borne(l + 0.04, 0.5, 0.75));
  // (les ocres, les moutardes : orange corail)
  if (h >= 30 && h < 75 && l >= 0.35) return versHex(14, 0.92, borne(l + 0.06, 0.45, 0.7));
  // (les bruns : un violet magenta)
  if (h >= 15 && h < 75) return versHex(300, 0.55, borne(l + 0.06, 0.16, 0.4));
  // (les rouges : rose fuchsia)
  if (h < 15 || h >= 340) return versHex(328, 0.9, borne(l + 0.08, 0.4, 0.65));
  // (les verts : vert acide, plus sombres en sarcelle)
  if (h < 150) return l > 0.4 ? versHex(88, 0.85, borne(l, 0.45, 0.7)) : versHex(165, 0.8, borne(l + 0.05, 0.18, 0.4));
  // (les sarcelles, la mer : sarcelle vive, cyan dans les clairs)
  if (h < 200) return versHex(l > 0.5 ? 182 : 174, 0.85, borne(l * 1.15, 0.18, 0.75));
  // (les bleus : bleu électrique)
  if (h < 250) return versHex(228, 0.8, borne(l + 0.05, 0.2, 0.7));
  // (les violets, les pourpres : violet)
  return versHex(278, 0.75, borne(l + 0.05, 0.2, 0.7));
}
module.exports = { neon };
