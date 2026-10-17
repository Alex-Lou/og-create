// Le papier néon (choix de l'auteur, 17 oct. : « toutes les IA mettent ce sépia, cet effet souvenir » ; de la fraîcheur,
// du peps, les couleurs de la jungle de nuit : sarcelle, cyan, magenta, violet, éclats orange et vert acide), en
// prototype sur 01_pont : la même scène, les mêmes pièces et la même partition (theatre_pont.js), rendues autrement :
//   - chaque pièce gravée l'est en papier néon (gravure.js : avecStyle) : sans taches de vieux papier, le modelé
//     violet, le reflet froid, des hachures légères, un liseré de lumière au bord éclairé ;
//   - ses couleurs passent dans la palette néon (neon) : l'encre devient un indigo profond, les ocres et les crèmes des
//     coraux et des roses, les jaunes des lumières vert acide, la mer une sarcelle vive ;
//   - l'étalonnage sépia (teinte) cède la place à une nuit violette qui garde les couleurs vives (teinteNeon).
const { hash, f } = require('./ouverture');
const { courbe } = require('./papier');
const { atelier, gravure, trait, avecStyle } = require('./gravure');
const { plein, balance, parTemps, MARGE, G, D_ } = require('./theatre_pont');
const TP = require('./theatre_pont');

const NEON = { papier: false, modele: '#2A0A4A', reflet: '#E8FFF8', hachures: 0.45, lisere: '#F4FFFF' };

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
// un dessin dans la palette néon : toutes ses couleurs (#rgb, #rrggbb, rgb(…)) ; les références (url(#…)) ne sont
// pas des couleurs (leurs noms commencent par le préfixe de la scène)
const hexDe = (r, g, b) => '#' + [r, g, b].map(v => (+v).toString(16).padStart(2, '0')).join('');
// (teinte : une teinte imposée à toute la pièce, ses clartés gardées ; les nuages d'orage, violets)
const neonise = (svg, teinte) => {
  const c = teinte === undefined ? neon : hex => { const [, s, l] = hsl(neon(hex)); return l < 0.16 ? neon(hex) : versHex(teinte, Math.max(s, 0.5), l * 0.8); };
  return svg.replace(/#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b/g, x => c(x)).replace(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/g, (m, r, g, b) => c(hexDe(r, g, b)));
};

// l'étalonnage néon : une nuit violette sur les bords, un souffle magenta en haut, sarcelle en bas ; les couleurs restent
// vives au centre ; pas de grain de vieux papier
function teinteNeon(p) {
  const A = atelier(`${p}N`);
  return A.out(plein(A, A.lin([[0, '#FF3FA8', 0.12], [0.45, '#FF3FA8', 0], [0.6, '#00E0C8', 0], [1, '#00C8D8', 0.1]], 0, 0, 0, 400)) + plein(A, A.rad([[0, '#000', 0], [0.62, '#14063A', 0.12], [1, '#0A0228', 0.62]], 200, 200, 330)));
}

// ——— ce que le néon ajoute (déjà dans sa palette : on ne le repasse pas au néon) ———
// le ciel du jour : l'heure dorée des tropiques, d'un bleu sarcelle profond au violet, au rose, à l'orange de l'horizon ;
// la gloire du soleil
const SOLEIL = [300, 86];
function jourNeon(p) {
  const A = atelier(`${p}J`);
  let s = plein(A, A.lin([[0, '#0B3354'], [0.32, '#4A2A8A'], [0.62, '#E0408A'], [0.86, '#FF7A4A'], [1, '#FFB45A']], 0, G, 0, 270));
  s += plein(A, A.rad([[0, '#FFF2A0', 0.9], [0.18, '#FFD25A', 0.55], [0.5, '#FF6A8A', 0.18], [1, '#FF6A8A', 0]], SOLEIL[0], SOLEIL[1], 260));
  for (let i = 0; i < 7; i++) { const x = hash(i, 21) * 480 - 40, y = 30 + hash(i, 22) * 150, r = 30 + 40 * hash(i, 23); s += `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(r * 1.8)}" ry="${f(r * 0.5)}" fill="${A.rad([[0, '#FFB0E0', 0.35], [1, '#FFB0E0', 0]], x, y, r * 1.8)}"/>`; }
  return A.out(s);
}
// la nuit d'orage : indigo, violet, une lueur magenta derrière les nuages, une autre vert acide là où la foudre couve
function fondNeon(p) {
  const A = atelier(`${p}F`);
  let s = plein(A, A.lin([[0, '#07041C'], [0.5, '#1A0A3E'], [1, '#2A0C48']], 0, G, 0, 300));
  s += plein(A, A.rad([[0, '#FF3FA8', 0.45], [0.5, '#B0206E', 0.15], [1, '#B0206E', 0]], 80, 60, 240));
  s += plein(A, A.rad([[0, '#C8F25A', 0.32], [0.45, '#3EE8B0', 0.1], [1, '#3EE8B0', 0]], 300, 104, 150));
  for (let i = 0; i < 12; i++) { const x = hash(i, 1) * 480 - 40, y = hash(i, 2) * 260 - 20, r = 40 + 70 * hash(i, 3); s += `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(r * 1.4)}" ry="${f(r * 0.7)}" fill="${A.rad([[0, i % 3 ? '#3A1A6A' : '#0A0420', 0.5], [1, '#0A0420', 0]], x, y, r * 1.4)}"/>`; }
  return A.out(s);
}
// ——— 01_pont en papier néon ———
const PROPRES = { teinte: p => teinteNeon(p), jour: p => avecStyle(NEON, () => jourNeon(p)), fond: p => avecStyle(NEON, () => fondNeon(p)) };
function pontNeon() {
  const p = 'tp', sc = TP.pont01();
  for (const pl of sc.plans) {
    if (!pl.dessin) continue;
    const d = pl.dessin;
    const teinte = /^nuage\d/.test(pl.id) ? 272 : undefined;
    pl.dessin = PROPRES[pl.id] ? () => PROPRES[pl.id](p) : () => avecStyle(NEON, () => neonise(d(), teinte));
  }
  return sc;
}

module.exports = { pontNeon, neon, neonise, NEON };
