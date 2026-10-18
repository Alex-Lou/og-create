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
const { plein, balance, secoue, bouffees, parTemps, REPERES, MARGE, G, D_ } = require('./theatre_pont');
const TP = require('./theatre_pont');

const NEON = { papier: false, modele: '#08021A', reflet: '#C8FFF4', hachures: 0.4, lisere: '#7AF8EE' };

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
// une couleur dans la palette néon, douce : les grandes surfaces assombries (elles sortent de la nuit), les clairs un peu
// retenus ; seules les lumières (vert acide, jaunes vifs) gardent tout leur éclat
function douce(hex) {
  const c = neon(hex), [h, s, l] = hsl(c);
  if (h > 60 && h < 100 && s > 0.6 && l > 0.45) return c;
  return versHex(h, s * 0.85, l > 0.72 ? l * 0.86 : l * 0.62);
}
// (teinte : une teinte imposée à toute la pièce, ses clartés gardées ; les nuages d'orage, violets)
const neonise = (svg, teinte) => {
  const c = teinte === undefined ? douce : hex => { const [, s, l] = hsl(douce(hex)); return l < 0.12 ? douce(hex) : versHex(teinte, Math.max(s, 0.5), l * 0.85); };
  return svg.replace(/#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b/g, x => c(x)).replace(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/g, (m, r, g, b) => c(hexDe(r, g, b)));
};

// l'étalonnage néon : une nuit violette sur les bords, un souffle magenta en haut, sarcelle en bas ; les couleurs restent
// vives au centre ; pas de grain de vieux papier
function teinteNeon(p) {
  const A = atelier(`${p}N`);
  return A.out(plein(A, A.lin([[0, '#FF3FA8', 0.08], [0.4, '#FF3FA8', 0], [0.65, '#00E0C8', 0], [1, '#00C8D8', 0.07]], 0, 0, 0, 400)) + plein(A, A.rad([[0, '#000', 0], [0.55, '#05010F', 0.15], [1, '#020008', 0.78]], 200, 200, 320)));
}

// ——— ce que le néon ajoute (déjà dans sa palette : on ne le repasse pas au néon) ———
// le ciel du jour : l'heure dorée des tropiques, d'un bleu sarcelle profond au violet, au rose, à l'orange de l'horizon ;
// la gloire du soleil
const SOLEIL = [300, 86];
function jourNeon(p) {
  const A = atelier(`${p}J`);
  let s = plein(A, A.lin([[0, '#05030F'], [0.3, '#1A0E44'], [0.58, '#5A1E7A'], [0.82, '#C83A7A'], [1, '#FF8A4A']], 0, G, 0, 270));
  s += plein(A, A.rad([[0, '#FFF2A0', 0.85], [0.14, '#FFC85A', 0.5], [0.45, '#FF5A8A', 0.16], [1, '#FF5A8A', 0]], SOLEIL[0], SOLEIL[1], 240));
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
// ——— la profondeur : ce qui passe tout près de nous, ce qui se perd au loin ———
// la houle du premier plan : une grande vague sombre, tout près, qui monte et descend devant tout (sa crête ourlée de
// cyan) ; elle donne la mesure de la mer et sa parallaxe est la plus forte
function houle(p) {
  const A = atelier(`${p}H`), y = 372;
  const crete = courbe(t => { const x = G - 60 + (D_ - G + 120) * t; return [x, y - 18 * Math.sin(Math.PI * 2 * (x / 230) + 0.6) - 8 * Math.sin(Math.PI * 2 * (x / 97))]; }, 90);
  return A.out(gravure(A, [...crete, [D_ + 60, D_ + 80], [G - 60, D_ + 80]], A.lin([[0, '#0A3A44'], [0.3, '#05202A'], [1, '#010608']], 0, y - 26, 0, y + 70), { seed: 1500, amp: 0.3, angle: 6, pas: 3.2, ombre: 0.35, tailles: 1, tailleP: 5, trait: 2.6, portee: 0.6, dy: 6, lumiere: [0, -1] })
    + `<path d="M${crete.map(([x, yy]) => `${f(x)},${f(yy)}`).join(' L')}" fill="none" stroke="#7AF8EE" stroke-width="7" stroke-opacity="0.1" stroke-linecap="round"/><path d="M${crete.map(([x, yy]) => `${f(x)},${f(yy)}`).join(' L')}" fill="none" stroke="#7AF8EE" stroke-width="1.6" stroke-linecap="round"/>`);
}
// la pluie tout près de nous : de longs traits cyan, flous de vitesse (une bande qu'on fait tomber en boucle)
const pluieDevant = p => { const A = atelier(`${p}R`); return A.out(Array.from({ length: 34 }, (_, i) => { const x = G + hash(i, 81) * (D_ - G + 60), y = G - 200 + hash(i, 82) * 800, l = 30 + 30 * hash(i, 83); return `<path d="M${f(x)},${f(y)} l${f(-l * 0.28)},${f(l)}" stroke="#9AFAF0" stroke-width="${f(1 + 1.4 * hash(i, 84))}" stroke-linecap="round" opacity="${f(0.25 + 0.35 * hash(i, 85))}"/>`; }).join('')); };
// la brume du lointain, sur l'horizon : une bande violette qui boit le large (la profondeur de l'air)
const brumeLoin = p => { const A = atelier(`${p}B`); return A.out(plein(A, A.lin([[0, '#6A3AAA', 0], [0.5, '#7A4ABA', 0.42], [1, '#3A1A6A', 0]], 0, 150, 0, 250))); };

// ——— 01_pont en papier néon ———
const PROPRES = { teinte: p => teinteNeon(p), jour: p => avecStyle(NEON, () => jourNeon(p)), fond: p => avecStyle(NEON, () => fondNeon(p)) };
function pontNeon() {
  const p = 'tp', sc = TP.pont01();
  for (const pl of sc.plans) {
    if (!pl.dessin) continue;
    const d = pl.dessin;
    const teinte = /^nuage\d/.test(pl.id) ? 272 : /^cumulus\d/.test(pl.id) ? 312 : undefined;
    pl.dessin = PROPRES[pl.id] ? () => PROPRES[pl.id](p) : () => avecStyle(NEON, () => neonise(d(), teinte));
  }
  // (la profondeur : la brume du large derrière la mer ; la houle et la pluie tout près, devant tout sauf le gramophone)
  const avant = id => sc.plans.findIndex(q => q.id === id);
  sc.plans.splice(avant('lame'), 0, { id: 'brume-loin', profondeur: 0.2, marge: MARGE, flou: 0.2, dessin: () => brumeLoin(p) });
  sc.plans.splice(avant('anime') + 1, 0, { id: 'houle', profondeur: 1.35, cadre: [G - 80, 320, D_ - G + 160, 140], pivot: [200, 380], dessin: () => avecStyle(NEON, () => houle(p)) }, { id: 'pluie-devant', profondeur: 1.6, cadre: [G, G - 200, D_ - G + 60, 800], dessin: () => pluieDevant(p) });
  const T = sc.partition.temps.map(t => t.duree), FIN = T.reduce((a, b) => a + b, 0);
  const { COUPE, CHOC, RACCORD, SORT, ARRACHE, RETOUR, CHUTE } = REPERES, FRAPPE = REPERES.CRI + 350;
  const P = {
    'brume-loin': [[0, { o: 0.4 }], [9000, { o: 1 }], [FIN, { o: 0.8 }]],
    // (la houle : elle entre par le bas, puis berce, de plus en plus haut avec l'orage)
    houle: [[0, { y: 90 }], [500, { y: 90, e: 'cubic-bezier(.2,.8,.3,1)' }], [1800, { y: 20 }], ...balance(1800, FIN, 2600, (k, t) => ({ y: (k % 2 ? 10 : 30) - Math.min(1, t / 14000) * 26, x: k % 2 ? -14 : 14 }))],
    // (la pluie tout près : elle tombe en boucle, dès que l'orage est là)
    'pluie-devant': [[0, { o: 0, y: 0 }], ...bouffees(6000, FIN, 900, { x: 0, y: -260, o: 0.9 }, { x: -70, y: 140, o: 0.9 })]
  };
  for (const [id, cles] of Object.entries(P)) parTemps(T, cles).forEach((c, n) => { sc.partition.temps[n].pistes[id] = c; });
  // (la caméra voyage : elle part du ciel, près du soleil, et descend vers le navire en reculant ; elle fonce sur la
  // proue au choc ; elle longe le pont pendant les canots ; elle plonge vers les racines ; elle lève les yeux vers la
  // lame)
  // (le zoom de la caméra joue selon la profondeur de chaque plan : le ciel bouge à peine, le navire un peu, la houle
  // du premier plan beaucoup ; ses mouvements sont donc amples : c'est ce qui creuse la scène)
  const camera = [[0, { x: 30, y: -110, z: 1.7 }], [400, { x: 30, y: -110, z: 1.7, e: 'cubic-bezier(.5,0,.2,1)' }], [3900, { x: 0, y: 6, z: 1.06 }], [COUPE, { x: -10, y: 4, z: 1.1 }],
    [CHOC - 100, { z: 1.36, x: 70, y: 30, e: 'linear' }], ...secoue(CHOC, { z: 1.36, x: 70, y: 30 }, 15, 8, 50), [RACCORD + 300, { z: 1.12, x: 24, y: 8 }],
    [SORT + 400, { z: 1.3, x: -70, y: 18 }], [ARRACHE - 200, { z: 1.3, x: 54, y: 12, e: 'linear' }], ...secoue(ARRACHE, { z: 1.3, x: 54, y: 12 }, 12, 6, 50), [RETOUR, { z: 1.12, x: 10, y: 4 }],
    [FRAPPE - 100, { z: 1.38, x: -20, y: 30, e: 'linear' }], ...secoue(FRAPPE, { z: 1.38, x: -20, y: 30 }, 14, 7, 50), [CHUTE + 200, { z: 1.16, x: 0, y: -14 }], [FIN, { z: 1.22, x: 0, y: -74 }]];
  parTemps(T, camera, ['x', 'y', 'z', 'r']).forEach((c, n) => { sc.partition.temps[n].camera = c; });
  return sc;
}

module.exports = { pontNeon, neon, neonise, NEON };
