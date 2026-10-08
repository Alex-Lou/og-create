// Lot L4 — les gestes du quotidien au grand format, pour n'importe quel personnage de la troupe (maîtres, naufragés,
// avatar, visiteurs, nouveaux venus) : ce que le petit format savait faire et que le détaillé n'avait pas encore.
// - lanterne : marcher une lanterne à la main (le soir, dès la première lanterne de l'acte I) ;
// - parapluie : marcher sous un parapluie (la pluie) ; la toile passe au-dessus de la tête : cadre CADRE_PARAPLUIE ;
// - valise : les nouveaux venus de l'épilogue arrivent avec leur bagage ;
// - couché : dormir allongé sous une couverture (la nuit), la tête à gauche ; cadre CADRE_COUCHE ;
// - mains tendues vers le feu et applaudir (la veillée, HISTOIRE.md § 10), debout ou assis (design/atelier/assis.js).
// Le travail est le geste du métier de chaque maître (sa pose « action »), dans les trois vues : rien à ajouter ici.
const { OUT, P, E, L, limb, zee, r2, frame, arm } = require('./troupe');

const CADRE_PARAPLUIE = [0, -18, 48, 82];
const CADRE_COUCHE = [0, 0, 64, 48];

// un trait de couleur sans remplissage
const trait = (d, color, w) => `<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/>`;
// lumière chaude : des cercles de plus en plus pâles (pas de dégradé, rien à renommer)
const lueur = (x, y, r, a = 0.5) => [1, 0.66, 0.4].map((k, i) => `<circle cx="${r2(x)}" cy="${r2(y)}" r="${r2(r * k)}" fill="rgba(255,214,120,${r2(a * (0.3 + i * 0.3))})"/>`).join('');

// La lanterne pend sous la main (h) : anse, chapeau de métal, verre où brûle la flamme, pied ; la flamme vacille (n)
function lanterne(h, n = 0) {
  return `<g transform="translate(${r2(h[0])} ${r2(h[1])}) scale(1.3) translate(${r2(-h[0])} ${r2(-h[1])})">${petiteLanterne(h, n)}</g>`;
}
function petiteLanterne(h, n) {
  const [x, y0] = h, y = y0 + 1.4;
  const flamme = n % 2 ? 'M0,-1.6 Q1,0 0,1.2 Q-1,0 0,-1.6 Z' : 'M0,-1.9 Q0.8,0.1 0,1.2 Q-0.9,-0.1 0,-1.9 Z';
  return P(`M${r2(x - 1.6)},${r2(y + 1.4)} Q${x},${r2(y - 1.8)} ${r2(x + 1.6)},${r2(y + 1.4)}`, 'none', 0.8)
    + lueur(x, y + 4.6, 4.6, 0.55)
    + P(`M${r2(x - 2.6)},${r2(y + 2.6)} L${r2(x + 2.6)},${r2(y + 2.6)} L${r2(x + 1.8)},${r2(y + 1.2)} L${r2(x - 1.8)},${r2(y + 1.2)} Z`, '#5A4A3A', 0.8)
    + `<rect x="${r2(x - 2.1)}" y="${r2(y + 2.6)}" width="4.2" height="4.8" rx="0.6" fill="#FFE7A0" stroke="${OUT}" stroke-width="0.8"/>`
    + `<g transform="translate(${x} ${r2(y + 5.1)})">${P(flamme, '#F2A63A', 0.5)}</g>`
    + L([x - 2.1, y + 5], [x + 2.1, y + 5], '#5A4A3A', 0.5)
    + `<rect x="${r2(x - 2.6)}" y="${r2(y + 7.3)}" width="5.2" height="1.3" rx="0.5" fill="#5A4A3A" stroke="${OUT}" stroke-width="0.8"/>`;
}
// Le parapluie : le manche part de la main, la toile au-dessus de la tête (au-dessus des chapeaux), huit pans
function parapluie(h, col = '#D9443A') {
  // tenu sur le côté : le manche monte presque droit le long du corps, la toile couvre la tête
  const [x, y] = h, cx = x - 5, cy = -3.6;
  const r = 15, dark = '#8E2A24';
  const toile = `M${r2(cx - r)},${r2(cy + 2.4)} Q${r2(cx - r)},${r2(cy - 9.6)} ${r2(cx)},${r2(cy - 10.4)} Q${r2(cx + r)},${r2(cy - 9.6)} ${r2(cx + r)},${r2(cy + 2.4)}`
    + [0.75, 0.5, 0.25, 0].map(k => ` Q${r2(cx + r * (k + 0.125) * 2 - r)},${r2(cy + 0.8)} ${r2(cx + r * k * 2 - r)},${r2(cy + 2.4)}`).join('') + ' Z';
  const pans = [-0.5, 0, 0.5].map(k => trait(`M${r2(cx)},${r2(cy - 10.2)} Q${r2(cx + r * k * 0.9)},${r2(cy - 6)} ${r2(cx + r * k * 1.5)},${r2(cy + 2.2)}`, dark, 0.6)).join('');
  return limb([x, y + 1], [cx, cy + 1.6], 0.8, '#7A5A3A') + P(`M${r2(x)},${r2(y + 1)} q0,3 -2.4,3`, 'none', 1.2)
    + P(toile, col) + `<path d="M${r2(cx + r * 0.25)},${r2(cy - 9)} Q${r2(cx + r * 0.8)},${r2(cy - 6)} ${r2(cx + r)},${r2(cy + 2.4)} L${r2(cx + r * 0.5)},${r2(cy + 2.4)} Q${r2(cx + r * 0.4)},${r2(cy - 4)} ${r2(cx + r * 0.25)},${r2(cy - 9)} Z" fill="${dark}" opacity="0.35"/>`
    + pans + P(toile, 'none') + E(cx, cy - 11, 0.8, 0.8, '#7A5A3A', 0.6) + L([cx - r * 0.6, cy - 6.6], [cx - r * 0.25, cy - 8.6], 'rgba(255,255,255,.55)', 0.9);
}
// La valise des nouveaux venus : poignée, deux sangles, une étiquette
function valise(h, col = '#9A5A34') {
  const [x, y] = h;
  return P(`M${r2(x - 1.4)},${r2(y + 2.6)} Q${x},${r2(y + 0.2)} ${r2(x + 1.4)},${r2(y + 2.6)}`, 'none', 1)
    + `<rect x="${r2(x - 4.4)}" y="${r2(y + 2.4)}" width="8.8" height="6.6" rx="1.2" fill="${col}" stroke="${OUT}" stroke-width="1"/>`
    + `<rect x="${r2(x + 1.2)}" y="${r2(y + 2.6)}" width="3" height="6.2" fill="rgba(60,40,25,.2)"/>`
    + [-2.4, 2].map(d => L([x + d, y + 2.6], [x + d, y + 8.8], '#5A3A24', 0.7)).join('')
    + `<rect x="${r2(x - 1.2)}" y="${r2(y + 4.8)}" width="2.4" height="1.8" rx="0.3" fill="#F4EEDF" stroke="${OUT}" stroke-width="0.5"/>`;
}

// Un personnage qui tient quelque chose dans la main droite (à l'écran) : la lanterne, la valise ; le parapluie passe
// par-dessus la tête (holdOver)
// (la lanterne remonte un peu quand la main descend bas, pour ne jamais toucher le bas du cadre)
const avecLanterne = c => ({ ...c, hold: (cc, h, ctx) => lanterne([h[0], Math.min(h[1], 49)], ctx.n), holdOver: false });
const avecParapluie = (c, col) => ({ ...c, hold: (cc, h) => parapluie(h, col), holdOver: true });
const avecValise = (c, col) => ({ ...c, hold: (cc, h) => valise(h, col), holdOver: false });

// Dormir couché : le personnage de face, les yeux fermés, couché la tête à gauche (tourné d'un quart de tour), sur un
// oreiller, sous une couverture ; les « z » montent (n : 0 ou 1, il respire)
const ZEDS = /<path d="M([-\d.]+),([-\d.]+) L([-\d.]+),\2 L\1,([-\d.]+) L\3,\4" fill="none"[^>]*\/>/g;
function couche(c, n = 0, couverture = { fond: '#C98F5A', motif: '#E8C07A' }) {
  // les « z » du visage endormi partiraient de travers une fois couché : on les retire, on les redessine au-dessus
  const corps = frame(c, 'front', 'repos', 0, 'endormi').replace(ZEDS, '');
  const souffle = n ? -0.5 : 0;
  const couv = `M31,${r2(9.6 + souffle)} Q46,${r2(7.6 + souffle)} 60.6,10.4 Q62.8,24 60.6,37.6 Q46,40.4 31,${r2(38.4 - souffle)} Q28.6,24 31,${r2(9.6 + souffle)} Z`;
  return `<ellipse cx="32" cy="26" rx="29" ry="14" fill="rgba(40,55,20,.16)"/>`
    + E(9, 24, 7.6, 11, '#F4EEDF', 1.1) + L([4.6, 18], [6.4, 15.6], '#FFFFFF', 1)
    + `<g transform="translate(32 24) scale(0.95) translate(-32 -24)"><g transform="translate(0 48) rotate(-90)">${corps}</g></g>`
    + P(couv, couverture.fond, 1.2) + [16, 24, 32].map(y => L([33, y + souffle * 0.5], [59.2, y], couverture.motif, 1.1)).join('')
    + P(`M31,${r2(9.6 + souffle)} Q28.6,24 31,${r2(38.4 - souffle)} L34.6,${r2(38.2 - souffle)} Q32.4,24 34.6,${r2(9.8 + souffle)} Z`, couverture.motif, 0.9)
    + (n ? zee(30.6, 6.4, 2) + zee(34, 2.4, 2.6) : zee(30, 7.4, 1.8) + zee(33, 3.6, 2.4));
}

// ---- les gestes de la veillée : la pose « action » du kit, remplacée ----
// Mains ouvertes, à la place du poing rond (arm(c, épaule, main, coude, dessin)) ; k : côté du pouce (-1 : vers la
// gauche de l'écran, 1 : vers la droite) ; s : échelle
// - paume : paume vers nous, doigts en haut (le pouce vers le milieu du corps) ;
// - tranche : la main vue de côté, doigts en haut (paume vers l'avant, vue de trois quarts ou de dos)
function paume(c, [x, y], k, s = 1) {
  const f = c.hand || c.skin, w = 1.85 * s, h = 2.5 * s;
  return E(x + k * w * 0.95, y + 0.5 * s, 0.95 * s, 1.35 * s, f, 0.9)
    + P(`M${r2(x - w)},${r2(y + h * 0.55)} L${r2(x - w)},${r2(y - h * 0.35)} Q${r2(x - w)},${r2(y - h)} ${r2(x)},${r2(y - h)} Q${r2(x + w)},${r2(y - h)} ${r2(x + w)},${r2(y - h * 0.35)} L${r2(x + w)},${r2(y + h * 0.55)} Q${r2(x)},${r2(y + h * 1.05)} ${r2(x - w)},${r2(y + h * 0.55)} Z`, f, 0.9)
    + (c.moufle ? '' : [-0.6, 0.6].map(d => L([x + d * s, y - h + 0.35], [x + d * s, y - h * 0.35], OUT, 0.42)).join('')); // des moufles : pas de doigts
}
function tranche(c, [x, y], k, s = 1) {
  const f = c.hand || c.skin, w = 1.3 * s, h = 2.5 * s;
  return P(`M${r2(x - w)},${r2(y + h * 0.6)} L${r2(x - w)},${r2(y - h * 0.4)} Q${r2(x - w)},${r2(y - h)} ${r2(x)},${r2(y - h)} Q${r2(x + w)},${r2(y - h)} ${r2(x + w)},${r2(y - h * 0.4)} L${r2(x + w)},${r2(y + h * 0.6)} Q${r2(x)},${r2(y + h)} ${r2(x - w)},${r2(y + h * 0.6)} Z`, f, 0.9)
    + E(x + k * w * 0.9, y + 0.6 * s, 0.8 * s, 1.1 * s, f, 0.8);
}

// Mains tendues vers le feu, content d'être au chaud ; 2 images : les doigts se réchauffent (les mains bougent d'un
// demi-pixel). Le feu est devant le personnage :
//   - de face, il est entre lui et nous : les paumes nous font face, à hauteur du ventre ;
//   - de trois quarts avant, les deux bras avancent vers le regard, les mains de côté ;
//   - de dos, les bras passent devant le buste (derrière lui, pour nous) : le coude gauche sort, la main droite dépasse
//     sur le côté, vers le feu.
function tendre({ view, n }) {
  const [a, b] = this.shoulders;
  const w = n ? 0.45 : 0;
  if (view === 'front') {
    const y = a[1] + 7, l = [a[0] + 1.7 - w, y + w], r = [b[0] - 1.7 + w, y + w];
    return {
      expr: 'content',
      left: arm(this, a, l, [a[0] - 1.5, a[1] + 8.4], paume(this, [l[0], l[1] - 0.5], 1, 1.08)),
      right: arm(this, b, r, [b[0] + 1.5, b[1] + 8.4], paume(this, [r[0], r[1] - 0.5], -1, 1.08))
    };
  }
  if (view === 'se') {
    return {
      expr: 'content',
      left: arm(this, a, [a[0] - 6.4 - w, a[1] + 5.4], [a[0] - 2.2, a[1] + 7], tranche(this, [a[0] - 6.6 - w, a[1] + 4.8], 1)),
      right: arm(this, b, [b[0] - 9.6 - w, b[1] + 4.8], [b[0] - 4.4, b[1] + 7], tranche(this, [b[0] - 9.8 - w, b[1] + 4.2], 1, 0.95))
    };
  }
  return {
    left: '', right: '',
    under: arm(this, a, [a[0] + 3.6, a[1] + 4.6 - w], [a[0] - 2.6, a[1] + 5.8])
      + arm(this, b, [b[0] + 2.4, b[1] + 4.6 - w], [b[0] + 2, b[1] + 7.2], tranche(this, [b[0] + 2.5, b[1] + 4 - w], 1, 0.95))
  };
}
// Debout : frame(avecMainsTendues(c), vue, 'action', n) ; assis : assis(c, vue, n, null, tendre)
const avecMainsTendues = c => ({ ...c, uid: `${c.uid}mt`, pose: tendre });

// le claquement : trois petits traits clairs (bordés de sombre, lisibles sur n'importe quel habit) qui partent de (x, y)
const eclat = (x, y) => [[-0.8, -0.75], [0, -1.1], [0.8, -0.75]].map(([dx, dy]) => {
  const p = [x + dx * 1.2, y + dy * 1.2], q = [x + dx * 2.4, y + dy * 2.4];
  return L(p, q, OUT, 1.45) + L(p, q, '#FFF6CC', 0.55);
}).join('');
// Applaudir, en riant ; 2 images : les mains s'écartent, puis se rejoignent (le claquement) devant la poitrine.
//   - de face, les mains se voient de côté, paume contre paume ;
//   - de trois quarts avant, elles se rejoignent devant soi, vers le regard ;
//   - de dos, les mains sont devant le buste (cachées) : les coudes s'écartent puis se resserrent, le claquement
//     dépasse sur le côté.
function applaudir({ view, n }) {
  const [a, b] = this.shoulders;
  const y = a[1] + 6.2;
  if (view === 'front') {
    const g = n ? 1.35 : 4;
    return {
      expr: 'rire',
      left: arm(this, a, [24 - g, y], [a[0] - 1.2, a[1] + 7.6], tranche(this, [24 - g, y - 0.5], -1)),
      right: arm(this, b, [24 + g, y], [b[0] + 1.2, b[1] + 7.6], tranche(this, [24 + g, y - 0.5], 1)),
      over: n ? eclat(24, y - 3.2) : ''
    };
  }
  if (view === 'se') {
    const x = a[0] - 4.4, g = n ? 0.7 : 3.2;
    return {
      expr: 'rire',
      right: arm(this, b, [x + g, y - 0.4], [b[0] - 2.6, b[1] + 7.2], tranche(this, [x + g, y - 0.9], -1, 0.95)),
      left: arm(this, a, [x - g, y], [a[0] - 1.2, a[1] + 7.4], tranche(this, [x - g, y - 0.5], 1)),
      over: n ? eclat(x - 0.2, y - 3.8) : ''
    };
  }
  const k = n ? 1.4 : 0;
  return {
    left: '', right: '',
    under: arm(this, a, [24 - 0.6, y - 1], [a[0] - 3.2 + k, a[1] + 5.6]) + arm(this, b, [24 + 0.6, y - 1], [b[0] + 3.2 - k, b[1] + 5.6]),
    over: n ? eclat(b[0] + 3.4, a[1] + 1.8) : ''
  };
}
// Debout : frame(avecApplaudir(c), vue, 'action', n) ; assis : assis(c, vue, n, null, applaudir)
const avecApplaudir = c => ({ ...c, uid: `${c.uid}ap`, pose: applaudir });

// ---- les gestes du travail (les mini-jeux, HISTOIRE.md) ----
// La canne à pêche : une gaule de bambou de b (le talon) à t (le scion, plus fin), la poignée gainée, le moulinet
// (côté k : -1 ou 1), le fil qui pend du scion jusqu'au bouchon rouge et blanc posé sur un rond d'eau (f, en (x, y)) ;
// plonge : le bouchon s'enfonce un peu, l'eau fait deux ronds
function canne(b, t, f, k, plonge) {
  const len = Math.hypot(t[0] - b[0], t[1] - b[1]), ux = (t[0] - b[0]) / len, uy = (t[1] - b[1]) / len;
  const at = d => [b[0] + ux * d, b[1] + uy * d];
  const m = at(len * 0.62), g = at(3.2), r = at(5.4), rk = [r[0] - uy * k * 1.5, r[1] + ux * k * 1.5];
  const [x, y] = f, yb = y + (plonge ? 0.7 : 0);
  return L(b, m, OUT, 2.4) + L(m, t, OUT, 1.8) + L(b, m, '#D8AE6E', 1.15) + L(m, t, '#D8AE6E', 0.65)
    + [0.3, 0.5].map(q => L(at(len * q - 0.35), at(len * q + 0.35), '#A8794A', 0.9)).join('') // les nœuds du bambou
    + L(b, g, OUT, 2.8) + L(b, g, '#7A4E2A', 1.6) // la poignée gainée
    + L(r, rk, OUT, 1) + E(rk[0], rk[1], 1.15, 1.15, '#9AA2AD', 0.6) + E(rk[0] - 0.3, rk[1] - 0.3, 0.4, 0.4, '#E2E8EE', 0) // le moulinet
    + trait(`M${r2(t[0])},${r2(t[1])} Q${r2(t[0] + (x - t[0]) * 0.2 + (plonge ? 0 : 0.8))},${r2((t[1] + yb) / 2)} ${r2(x)},${r2(yb - 1.5)}`, OUT, 0.35)
    + E(x, y + 1.2, 4.2, 1.35, 'rgba(120,190,226,.55)', 0) + (plonge ? E(x, y + 1.2, 3.6, 1.1, 'none', 0).replace('stroke="none"', 'stroke="#FFFFFF" stroke-width="0.45"') : '')
    + E(x, y + 1.2, 2.4, 0.75, 'none', 0).replace('stroke="none"', 'stroke="#FFFFFF" stroke-width="0.5"')
    + `<g transform="translate(0 ${plonge ? 0.7 : 0})">${E(x, y, 1.65, 1.65, '#FFFFFF', 0.7)}${P(`M${r2(x - 1.65)},${r2(y)} A1.65,1.65 0 0 1 ${r2(x + 1.65)},${r2(y)} Z`, '#E2463A', 0)}${E(x, y, 1.65, 1.65, 'none', 0.7)}${E(x - 0.6, y - 0.7, 0.45, 0.3, '#FFFFFF', 0)}${L([x, y - 1.65], [x, y - 2.5], OUT, 0.5)}</g>`;
}
// Pêcher (le mini-jeu de la pêche), content ; 2 images : le bouchon danse (il s'enfonce un peu, le scion s'incline).
//   - de face, la canne tenue à deux mains en travers du corps, le scion monte à droite, le bouchon sur l'eau à droite ;
//   - de trois quarts avant, la canne part vers le regard, à gauche ;
//   - de dos, les mains (devant le buste, cachées) tiennent la canne qui monte à droite vers l'eau, au loin.
function pecher({ view, n }) {
  const [a, b] = this.shoulders;
  const d = n ? 1.6 : 0;
  // un point de la canne, à q du talon vers le scion (les poings sont posés dessus)
  const sur = (talon, scion, q) => { const l = Math.hypot(scion[0] - talon[0], scion[1] - talon[1]); return [talon[0] + (scion[0] - talon[0]) * q / l, talon[1] + (scion[1] - talon[1]) * q / l]; };
  if (view === 'front') {
    // la canne part assez à plat pour longer la tête, sans passer derrière elle
    const talon = [a[0] + 1.6, a[1] + 11.4], scion = [Math.min(45.6, b[0] + 13.6), a[1] - 8 + d];
    return {
      expr: 'content',
      left: canne(talon, scion, [Math.min(43, b[0] + 11), 54.4], 1, n) + arm(this, a, sur(talon, scion, 3), [a[0] - 0.6, a[1] + 7]),
      right: arm(this, b, sur(talon, scion, 9), [b[0] + 1.6, b[1] + 6.2])
    };
  }
  if (view === 'se') {
    const talon = [b[0] - 4, b[1] + 11.4], scion = [Math.max(2.4, a[0] - 13.6), a[1] - 8 + d];
    return {
      expr: 'content',
      right: arm(this, b, sur(talon, scion, 3), [b[0] - 0.6, b[1] + 7.6]),
      left: canne(talon, scion, [Math.max(5, a[0] - 11), 54.4], -1, n) + arm(this, a, sur(talon, scion, 9.5), [a[0] - 1, a[1] + 6])
    };
  }
  const talon = [26, a[1] + 8], scion = [Math.min(45.4, b[0] + 13), a[1] - 10 + d];
  return {
    left: '', right: '',
    under: canne(talon, scion, [Math.min(43.4, b[0] + 11.4), a[1] + 4], 1, n)
      + arm(this, a, sur(talon, scion, 2), [a[0] - 2.4, a[1] + 6.4]) + arm(this, b, sur(talon, scion, 7), [b[0] + 2.8, b[1] + 6.4])
  };
}
// Debout : frame(avecPecher(c), vue, 'action', n)
const avecPecher = c => ({ ...c, uid: `${c.uid}pe`, pose: pecher });

// La pioche : le manche de bois de m (le bas, dans les mains) à h (le fer) ; le fer d'acier courbe, deux pointes,
// perpendiculaire au manche (côté k), un reflet
function pioche(m, h, k = 1) {
  const len = Math.hypot(h[0] - m[0], h[1] - m[1]), ux = (h[0] - m[0]) / len, uy = (h[1] - m[1]) / len, nx = -uy * k, ny = ux * k;
  const pt = (a, b) => [h[0] + ux * a + nx * b, h[1] + uy * a + ny * b];
  const fer = [pt(0.4, -5.6), pt(1.6, -2.6), pt(1.9, 0), pt(1.6, 2.4), pt(0.6, 6.2), pt(-0.6, 2.4), pt(-1.1, 0), pt(-0.6, -2.6)];
  const d = `M${fer.map(p => `${r2(p[0])},${r2(p[1])}`).join(' L')} Z`;
  return L(m, h, OUT, 3.4) + L(m, h, '#B07A45', 1.6) + L(m, [m[0] + ux * len * 0.55, m[1] + uy * len * 0.55], '#C99A62', 0.5)
    + P(d, '#A9B1BB', 1) + L(pt(0.9, -4), pt(1.2, -1.2), '#E2E8EE', 0.6) + E(h[0], h[1], 1.1, 1.1, '#6E747E', 0.7);
}
// des éclats de pierre et une étincelle là où la pioche frappe (x, y)
const eclats = (x, y) => [[-3.6, -2.6, 0.9], [-1.6, -4.6, 0.7], [2.6, -3.4, 0.8], [3.8, -1.4, 0.6]].map(([dx, dy, r]) => E(x + dx, y + dy, r, r * 0.8, '#9A8E80', 0.5)).join('')
  + [[0, -1], [0.7, -0.7], [-0.7, -0.7]].map(([dx, dy]) => L([x + dx * 1.4, y + dy * 1.4], [x + dx * 3, y + dy * 3], OUT, 1.4) + L([x + dx * 1.4, y + dy * 1.4], [x + dx * 3, y + dy * 3], '#FFF2B0', 0.6)).join('')
  + E(x, y + 0.6, 4.4, 1.2, 'rgba(110,90,70,.35)', 0);
// la pierre à casser, posée au sol en (x, y) (le bas de la pierre) : un galet gris, son ombre, un reflet, une fente
const pierre = (x, y) => E(x, y - 0.2, 4.6, 1.3, 'rgba(40,55,20,.22)', 0) + P(`M${r2(x - 4.2)},${r2(y)} Q${r2(x - 4.6)},${r2(y - 3.6)} ${r2(x - 1)},${r2(y - 4.4)} Q${r2(x + 3.4)},${r2(y - 4.8)} ${r2(x + 4.2)},${r2(y - 1.4)} Q${r2(x + 4.4)},${r2(y + 0.2)} ${r2(x)},${r2(y + 0.3)} Z`, '#A79E92')
  + P(`M${r2(x - 2.8)},${r2(y - 2.6)} Q${r2(x - 1.6)},${r2(y - 3.8)} ${r2(x + 0.4)},${r2(y - 3.8)}`, 'none', 0).replace('stroke="none"', 'stroke="#D2CBC0" stroke-width="0.8" stroke-linecap="round"')
  + P(`M${r2(x + 1.4)},${r2(y - 4.2)} L${r2(x + 0.8)},${r2(y - 2.4)} L${r2(x + 1.6)},${r2(y - 1.2)}`, 'none', 0.5);
// un point de la ligne m → h, à q de m
const surLigne = (m, h, q) => { const l = Math.hypot(h[0] - m[0], h[1] - m[1]); return [m[0] + (h[0] - m[0]) * q / l, m[1] + (h[1] - m[1]) * q / l]; };
// Piocher (le mini-jeu de la mine) ; 2 images : la pioche levée sur le côté, puis le coup sur la pierre (éclats,
// étincelle), en riant.
function piocher({ view, n }) {
  const [a, b] = this.shoulders;
  if (view === 'front') {
    const p = [b[0] + 9, 61];
    if (!n) {
      const m = [b[0] - 1.4, b[1] + 5], h = [Math.min(42, b[0] + 10.4), a[1] - 8.4];
      return { expr: 'content', under: pierre(...p), left: pioche(m, h, 1) + arm(this, a, m, [a[0] + 0.6, a[1] + 7.4]), right: arm(this, b, surLigne(m, h, 4.6), [b[0] + 3, b[1] + 4.4]) };
    }
    const m = [24 + 0.6, a[1] + 9.6], h = [p[0] - 0.4, p[1] - 4.4];
    return { expr: 'rire', under: pierre(...p), left: pioche(m, h, -1) + arm(this, a, m, [a[0] - 0.6, a[1] + 6.4]), right: arm(this, b, surLigne(m, h, 4.2), [b[0] + 1.4, b[1] + 6.8]), over: eclats(h[0] + 0.6, h[1] + 0.4) };
  }
  if (view === 'se') {
    const p = [a[0] - 9, 61];
    if (!n) {
      const m = [b[0] - 4.4, b[1] + 4.6], h = [Math.min(43, b[0] + 10), a[1] - 9];
      return { expr: 'content', under: pierre(...p), right: pioche(m, h, -1) + arm(this, b, surLigne(m, h, 4.6), [b[0] + 2.6, b[1] + 4.6]), left: arm(this, a, m, [a[0] - 0.6, a[1] + 6.6]) };
    }
    const m = [a[0] + 2.6, a[1] + 9], h = [p[0] + 0.4, p[1] - 4.4];
    return { expr: 'rire', under: pierre(...p), right: arm(this, b, surLigne(m, h, 4.2), [b[0] - 0.6, b[1] + 7]), left: pioche(m, h, 1) + arm(this, a, m, [a[0] - 1.4, a[1] + 5.8]), over: eclats(h[0] - 0.6, h[1] + 0.4) };
  }
  // de dos : la pierre est devant, un peu à droite (plus loin, donc plus haut que les pieds)
  const p = [b[0] + 7, a[1] + 18];
  if (!n) {
    const m = [b[0] - 2, b[1] + 1], h = [b[0] + 6, a[1] - 18];
    return { left: '', right: '', under: pierre(...p) + arm(this, a, [b[0] - 4, b[1] + 2], [a[0] - 2.4, a[1] + 5.6]), over: pioche(m, h, 1) + arm(this, b, [b[0] - 1, b[1] - 1.4], [b[0] + 3, b[1] + 4.4]) };
  }
  const m = [24 + 2, a[1] + 7], h = [p[0] - 0.4, p[1] - 4.4];
  return { expr: 'rire', left: '', right: '', under: pierre(...p) + pioche(m, h, 1) + arm(this, a, [24 - 1, a[1] + 7.4], [a[0] - 2.4, a[1] + 6]) + arm(this, b, surLigne(m, h, 3), [b[0] + 2.4, b[1] + 6]), over: eclats(h[0] + 0.4, h[1] + 0.4) };
}
// Debout : frame(avecPiocher(c), vue, 'action', n)
const avecPiocher = c => ({ ...c, uid: `${c.uid}pi`, pose: piocher });

// un fruit cueilli (une pomme rouge) en (x, y) : son reflet, sa queue, sa feuille
const fruit = (x, y, s = 1, col = '#E2463A') => E(x, y, 1.45 * s, 1.35 * s, col, 0.7) + E(x - 0.5 * s, y - 0.45 * s, 0.4 * s, 0.3 * s, '#FFFFFF', 0).replace('fill=', 'fill-opacity="0.7" fill=')
  + L([x, y - 1.2 * s], [x + 0.3 * s, y - 2.1 * s], OUT, 0.5) + P(`M${r2(x + 0.3 * s)},${r2(y - 1.9 * s)} q1.2,-0.9 1.9,-0.1 q-1,0.7 -1.9,0.1 Z`, '#6FB24E', 0.4);
// Le panier d'osier, l'anse dans la main h (en haut), le panier en dessous : l'anse, le fond sombre, les fruits posés
// dedans (n : combien), la vannerie, le bord avant clair par-dessus
function panier([x, y], n = 3) {
  const by = y + 5, w = 5.4;
  const anse = `M${r2(x - w * 0.8)},${r2(by)} Q${r2(x)},${r2(y - 2.6)} ${r2(x + w * 0.8)},${r2(by)}`;
  const corps = `M${r2(x - w)},${r2(by)} L${r2(x - w * 0.78)},${r2(by + 5)} Q${r2(x)},${r2(by + 6.2)} ${r2(x + w * 0.78)},${r2(by + 5)} L${r2(x + w)},${r2(by)} Q${r2(x)},${r2(by + 1.3)} ${r2(x - w)},${r2(by)} Z`;
  const fruits = [[-2.6, -0.1, '#E2463A'], [2.6, 0, '#E2463A'], [0, -0.5, '#F2A63A'], [-1.2, -1.5, '#C9343A']].slice(0, n).map(([dx, dy, c]) => fruit(x + dx, by + dy, 0.85, c)).join('');
  return P(anse, 'none', 0).replace('stroke="none"', `stroke="${OUT}" stroke-width="2.4" stroke-linecap="round"`)
    + P(anse, 'none', 0).replace('stroke="none"', 'stroke="#C99A5A" stroke-width="1" stroke-linecap="round"')
    + E(x, by, w, 1.3, '#7A5A30', 0.8) + fruits + P(corps, '#C99A5A')
    + [2, 3.6].map(d => `<path d="M${r2(x - w * 0.93 + d * 0.05)},${r2(by + d)} Q${r2(x)},${r2(by + d + 1.1)} ${r2(x + w * 0.93 - d * 0.05)},${r2(by + d)}" fill="none" stroke="#A67A40" stroke-width="0.5"/>`).join('')
    + [-2.8, 0, 2.8].map(d => L([x + d, by + 1.2], [x + d * 0.85, by + 5.4], '#A67A40', 0.45)).join('')
    + `<path d="M${r2(x - w)},${r2(by)} Q${r2(x)},${r2(by + 2.6)} ${r2(x + w)},${r2(by)}" fill="none" stroke="${OUT}" stroke-width="2.3" stroke-linecap="round"/>`
    + `<path d="M${r2(x - w)},${r2(by)} Q${r2(x)},${r2(by + 2.6)} ${r2(x + w)},${r2(by)}" fill="none" stroke="#E2B878" stroke-width="1" stroke-linecap="round"/>`;
}
// Cueillir (le mini-jeu de la cueillette) ; 2 images : la main cueille un fruit en haut, à l'écart de la tête, puis le
// dépose dans le panier (un fruit de plus), en riant.
function cueillir({ view, n }) {
  const [a, b] = this.shoulders;
  if (view === 'front') {
    const hp = [a[0] - 1.8, a[1] + 9.4]; // la main qui tient le panier
    const pan = panier(hp, n ? 4 : 3);
    if (!n) {
      const h = [b[0] + 8.4, a[1] - 3.6];
      return { expr: 'content', left: arm(this, a, hp, [a[0] - 2.4, a[1] + 5]) + pan, right: arm(this, b, h, [b[0] + 6.4, b[1] + 2.2]) + fruit(h[0] + 0.3, h[1] - 2) };
    }
    const h = [a[0] + 1.4, a[1] + 8.6];
    return { expr: 'rire', left: arm(this, a, hp, [a[0] - 2.4, a[1] + 5]) + pan, right: arm(this, b, h, [b[0] + 1.6, b[1] + 6.8]) };
  }
  if (view === 'se') {
    const hp = [b[0] + 1.8, b[1] + 9.4];
    const pan = panier(hp, n ? 4 : 3);
    if (!n) {
      const h = [a[0] - 8.4, a[1] - 3.6];
      return { expr: 'content', right: arm(this, b, hp, [b[0] + 2.4, b[1] + 5]) + pan, left: arm(this, a, h, [a[0] - 6.4, a[1] + 2.2]) + fruit(h[0] - 0.3, h[1] - 2) };
    }
    const h = [b[0] + 0.6, b[1] + 8.6];
    return { expr: 'rire', right: arm(this, b, hp, [b[0] + 2.4, b[1] + 5]) + pan, left: arm(this, a, h, [a[0] - 1, a[1] + 7]) };
  }
  const hp = [b[0] + 2.4, b[1] + 9.4];
  const pan = panier(hp, n ? 4 : 3);
  if (!n) {
    const h = [a[0] - 8.4, a[1] - 3.6];
    return { left: arm(this, a, h, [a[0] - 6.4, a[1] + 2.2]) + fruit(h[0] - 0.3, h[1] - 2), right: arm(this, b, hp, [b[0] + 3, b[1] + 5]) + pan };
  }
  return { left: '', right: arm(this, b, hp, [b[0] + 3, b[1] + 5]) + pan, under: arm(this, a, [24 + 3, a[1] + 8], [a[0] - 2.4, a[1] + 6]) };
}
// Debout : frame(avecCueillir(c), vue, 'action', n)
const avecCueillir = c => ({ ...c, uid: `${c.uid}cu`, pose: cueillir });

// L'arrosoir de zinc vert, l'anse dans la main h : le corps, le bec long côté k, sa pomme percée, penché de a degrés
// (bec vers le bas) ; rend le dessin et le bout du bec, d'où l'eau tombe
function arrosoir(h, k = 1, a = 0) {
  const c = Math.cos(a * Math.PI / 180), s = Math.sin(a * Math.PI / 180);
  const pt = (x, y) => [h[0] + (x * c - y * s) * k, h[1] + x * s + y * c];
  const d = ps => `M${ps.map(([x, y]) => pt(x, y).map(r2).join(',')).join(' L')} Z`;
  const corps = d([[-4.2, 2.4], [3.6, 2.4], [3.9, 9.4], [-4.5, 9.4]]);
  const bec = d([[3.4, 7.6], [9, 2.4], [9.5, 3.2], [3.8, 9.2]]);
  const pomme = pt(9.7, 2.6), bout = pt(10.4, 3.4);
  const anse = `M${pt(-3.2, 2.6).map(r2)} Q${pt(-0.4, -3.4).map(r2)} ${pt(2.4, 2.6).map(r2)}`;
  const t = (dd, col, w) => trait(dd, col, w);
  return {
    svg: t(anse, OUT, 2.6) + t(anse, '#3F7A57', 1.2) + P(bec, '#4E8F6A', 0.9) + E(pomme[0], pomme[1], 1.6, 1.6, '#3F7A57', 0.8)
      + E(pomme[0], pomme[1], 0.7, 0.7, '#9CC9A8', 0) + P(corps, '#4E8F6A')
      + L(pt(-4.3, 5), pt(3.7, 5), '#6FB08A', 1) + L(pt(-3, 3.6), pt(-3.2, 8.4), '#A6D4B4', 0.7),
    bout
  };
}
// l'eau : des gouttes qui tombent du bec (x, y) jusqu'au sol (sol), décalées d'une demi-goutte à l'image n
const pluie = ([x, y], sol, k, n) => [0, 1, 2].map(i => {
  const q = (i + 0.4 + (n ? 0.5 : 0)) / 3, gx = x + k * 1.2 * q, gy = y + (sol - y) * q;
  return gy < sol - 1 ? P(`M${r2(gx)},${r2(gy - 1.2)} Q${r2(gx + 1.1)},${r2(gy + 0.3)} ${r2(gx)},${r2(gy + 0.9)} Q${r2(gx - 1.1)},${r2(gy + 0.3)} ${r2(gx)},${r2(gy - 1.4)} Z`, '#8FD3F2', 0.4) : '';
}).join('');
// la pousse arrosée, au sol en (x, y) : la terre mouillée, la tige, deux feuilles qui se relèvent à l'image n
const pousse = (x, y, n) => E(x, y, 4.4, 1.2, '#6B4A2E', 0.6) + E(x - 0.6, y - 0.2, 2.2, 0.5, '#8A6440', 0)
  + L([x, y], [x, y - 3.6], OUT, 1.4) + L([x, y], [x, y - 3.6], '#6FB24E', 0.6)
  + P(`M${r2(x)},${r2(y - 3.2)} q-2.4,${n ? -1.6 : -0.6} -3.4,${n ? -0.2 : 0.8} q1.8,0.8 3.4,-0.8 Z`, '#7CC25A', 0.5)
  + P(`M${r2(x)},${r2(y - 3.4)} q2.4,${n ? -1.6 : -0.6} 3.4,${n ? -0.2 : 0.8} q-1.8,0.8 -3.4,-0.8 Z`, '#7CC25A', 0.5);
// Arroser (les cultures) ; 2 images : l'arrosoir penché, l'eau tombe en gouttes sur une pousse ; à l'image 2 les
// gouttes avancent et les feuilles se relèvent.
function arroser({ view, n }) {
  const [a, b] = this.shoulders;
  if (view === 'front') {
    const h = [b[0] + 3, b[1] + 7.4], ar = arrosoir(h, 1, 38), sol = 61;
    return { expr: 'content', under: pousse(ar.bout[0] - 0.4, sol, n), right: arm(this, b, h, [b[0] + 3, b[1] + 3.4]) + ar.svg, over: pluie(ar.bout, sol - 1, 1, n) };
  }
  if (view === 'se') {
    const h = [a[0] - 3, a[1] + 7.4], ar = arrosoir(h, -1, 38), sol = 61;
    return { expr: 'content', under: pousse(ar.bout[0] + 0.4, sol, n), left: arm(this, a, h, [a[0] - 3, a[1] + 3.4]) + ar.svg, over: pluie(ar.bout, sol - 1, -1, n) };
  }
  // de dos : l'arrosoir tenu devant soi, un peu à droite ; le bec dépasse, la pousse est plus loin, donc plus haut
  const h = [b[0] + 1.4, b[1] + 6.4], ar = arrosoir(h, 1, 40), sol = a[1] + 18;
  return { left: '', right: '', under: pousse(ar.bout[0] - 0.6, sol, n) + ar.svg + pluie(ar.bout, sol - 1, 1, n) + arm(this, a, [24 + 1, a[1] + 7.6], [a[0] - 1.6, a[1] + 6]), over: arm(this, b, h, [b[0] + 3, b[1] + 4]) };
}
// Debout : frame(avecArroser(c), vue, 'action', n)
const avecArroser = c => ({ ...c, uid: `${c.uid}ar`, pose: arroser });

// La bêche : la poignée en T en haut (t), le manche de bois, la lame d'acier plate en bas (l), un reflet ; une motte de
// terre posée sur la lame si motte
function beche(t, l, motte = false) {
  const len = Math.hypot(l[0] - t[0], l[1] - t[1]), ux = (l[0] - t[0]) / len, uy = (l[1] - t[1]) / len, nx = -uy, ny = ux;
  const pt = (a, b) => [l[0] - ux * a + nx * b, l[1] - uy * a + ny * b];
  const haut = pt(7, 0);
  const lame = [pt(7, -2.8), pt(7, 2.8), pt(0.8, 2.6), pt(0, 1.2), pt(0, -1.2), pt(0.8, -2.6)];
  const d = `M${lame.map(p => p.map(r2).join(',')).join(' L')} Z`;
  const mt = motte ? (() => { const [mx, my] = pt(4, 0); return E(mx - nx * 0.4, my - 1.6, 3, 1.9, '#7A5434', 0.8) + E(mx - 0.8, my - 2.2, 1, 0.6, '#9A7048', 0); })() : '';
  return L([t[0] - nx * 2.4, t[1] - ny * 2.4], [t[0] + nx * 2.4, t[1] + ny * 2.4], OUT, 3) + L([t[0] - nx * 2.4, t[1] - ny * 2.4], [t[0] + nx * 2.4, t[1] + ny * 2.4], '#B07A45', 1.3)
    + L(t, haut, OUT, 3.2) + L(t, haut, '#B07A45', 1.5) + L(t, surLigne(t, haut, len * 0.5), '#C99A62', 0.5)
    + P(d, '#A9B1BB', 1) + L(pt(6, -1.6), pt(1.4, -1.6), '#E2E8EE', 0.7) + mt;
}
// la terre retournée au sol en (x, y) : un tas sombre, des mottes, par-dessus le bas de la lame quand elle est enfoncée
const terre = (x, y) => E(x, y, 5, 1.4, 'rgba(40,55,20,.22)', 0) + P(`M${r2(x - 4.6)},${r2(y + 0.4)} Q${r2(x - 3.4)},${r2(y - 2.6)} ${r2(x)},${r2(y - 2.4)} Q${r2(x + 3.6)},${r2(y - 2.4)} ${r2(x + 4.6)},${r2(y + 0.4)} Z`, '#7A5434', 0.8)
  + E(x - 2.2, y - 1.4, 1.1, 0.7, '#9A7048', 0) + E(x + 2, y - 1, 0.9, 0.6, '#5E3F26', 0) + E(x + 5.6, y - 0.2, 0.9, 0.7, '#7A5434', 0.5);
// Bêcher (les cultures) ; 2 images : la bêche enfoncée dans la terre, les deux mains sur le manche, puis levée de
// biais avec une motte sur la lame, en riant.
function becher({ view, n }) {
  const [a, b] = this.shoulders;
  if (view === 'front' || view === 'se') {
    const s = view === 'front' ? 1 : -1, [p, q] = s > 0 ? [b, a] : [a, b]; // p : l'épaule côté bêche ; q : l'autre
    const x = dx => p[0] + s * dx, sol = 61;
    const [t, l] = n ? [[x(2), a[1] + 6], [x(10), sol - 6.4]] : [[x(5.4), a[1] + 1], [x(6.6), sol + 1.4]];
    const haut = [t[0], t[1] + 0.6], bas = surLigne(t, l, n ? 6.4 : 9.4);
    const outil = beche(t, l, !!n) + (n ? '' : terre(x(6.6), sol));
    const main = arm(this, p, haut, [x(n ? 2.4 : 4.4), p[1] + 3.4]), autre = arm(this, q, bas, [q[0] + s * 2.4, q[1] + 7.6]);
    const sous = n ? terre(x(7.4), sol) : '';
    const [cote, loin] = s > 0 ? ['right', 'left'] : ['left', 'right'];
    return { expr: n ? 'rire' : 'content', under: sous, [cote]: outil + main, [loin]: autre };
  }
  // de dos : la bêche devant soi, un peu à droite ; la terre est plus loin, donc plus haut que les pieds
  const sol = a[1] + 18;
  const [t, l] = n ? [[b[0] + 1, a[1] + 4], [b[0] + 8, sol - 5]] : [[b[0] + 3.6, a[1] - 1], [b[0] + 4.8, sol + 1.4]];
  return { expr: n ? 'rire' : undefined, left: '', right: '', under: (n ? terre(b[0] + 5, sol) : '') + beche(t, l, !!n) + (n ? '' : terre(b[0] + 4.8, sol)) + arm(this, a, surLigne(t, l, 8), [a[0] - 1.6, a[1] + 6]), over: arm(this, b, [t[0], t[1] + 0.6], [b[0] + 3, b[1] + 3]) };
}
// Debout : frame(avecBecher(c), vue, 'action', n)
const avecBecher = c => ({ ...c, uid: `${c.uid}be`, pose: becher });

// Le sac de graines en toile, tenu contre la hanche par la main h : le sac, son col roulé, des graines qui dépassent
const sacGraines = ([x, y]) => P(`M${r2(x - 3.4)},${r2(y)} Q${r2(x - 4.4)},${r2(y + 6)} ${r2(x)},${r2(y + 6.6)} Q${r2(x + 4.4)},${r2(y + 6)} ${r2(x + 3.4)},${r2(y)} Z`, '#D8C49A')
  + E(x, y, 3.4, 1.1, '#6E5434', 0.8) + [[-1.4, -0.3], [0.2, -0.6], [1.6, -0.2]].map(([dx, dy]) => E(x + dx, y + dy, 0.6, 0.4, '#E8C66A', 0)).join('')
  + `<path d="M${r2(x - 3.4)},${r2(y)} Q${r2(x)},${r2(y + 1.4)} ${r2(x + 3.4)},${r2(y)}" fill="none" stroke="${OUT}" stroke-width="2" stroke-linecap="round"/>`
  + `<path d="M${r2(x - 3.4)},${r2(y)} Q${r2(x)},${r2(y + 1.4)} ${r2(x + 3.4)},${r2(y)}" fill="none" stroke="#EDE0BE" stroke-width="0.8" stroke-linecap="round"/>`
  + L([x - 1.6, y + 3], [x - 1.2, y + 5.4], '#B8A274', 0.5);
// les graines lancées : de petits grains dorés en éventail depuis la main (x, y), côté k, qui retombent vers la terre
const graines = (x, y, k) => [[2, 1.6], [3.6, 3.4], [2.6, 5.4], [5, 5.8], [4.2, 8], [6.2, 8.6]].map(([dx, dy], i) => {
  const gx = x + k * dx * 0.75, gy = y + dy * 1.5;
  return E(gx, gy, 0.75, 0.55, '#E8C66A', 0.45).replace('/>', ` transform="rotate(${(i * 37) % 90 - 45} ${r2(gx)} ${r2(gy)})"/>`);
}).join('');
// Semer (les cultures) ; 2 images : la main plonge dans le sac de graines tenu à la hanche, puis s'ouvre d'un grand
// geste, les graines s'envolent en éventail vers la terre.
function semer({ view, n }) {
  const [a, b] = this.shoulders;
  if (view === 'front' || view === 'se') {
    const s = view === 'front' ? 1 : -1, [p, q] = s > 0 ? [b, a] : [a, b]; // p : la main qui sème ; q : celle du sac
    const hs = [q[0] - s * 1.6, q[1] + 10], sac = arm(this, q, hs, [q[0] - s * 2.6, q[1] + 5.4]) + sacGraines([hs[0] + s * 1.4, hs[1] + 0.6]);
    if (!n) {
      const h = [hs[0] + s * 1.8, hs[1] - 0.6];
      return { expr: 'content', [s > 0 ? 'left' : 'right']: sac, [s > 0 ? 'right' : 'left']: arm(this, p, h, [p[0] + s * 0.4, p[1] + 8]) };
    }
    const h = [p[0] + s * 6.4, p[1] + 5];
    return { expr: 'content', [s > 0 ? 'left' : 'right']: sac, [s > 0 ? 'right' : 'left']: arm(this, p, h, [p[0] + s * 4.6, p[1] + 4]), over: graines(h[0], h[1] + 1, s) };
  }
  // de dos : le sac à la hanche gauche, la main droite lance les graines devant soi, vers la droite
  const hs = [a[0] - 1.4, a[1] + 10];
  const sac = arm(this, a, hs, [a[0] - 2.4, a[1] + 5.4]) + sacGraines([hs[0] - 1, hs[1] + 0.6]);
  if (!n) return { left: sac, right: '', under: arm(this, b, [24 + 2, b[1] + 9], [b[0] - 0.6, b[1] + 7]) };
  const h = [b[0] + 6, b[1] + 4];
  return { left: sac, right: arm(this, b, h, [b[0] + 4.4, b[1] + 3.4]), over: graines(h[0], h[1] + 1, 1) };
}
// Debout : frame(avecSemer(c), vue, 'action', n)
const avecSemer = c => ({ ...c, uid: `${c.uid}se`, pose: semer });

// La faucille, le manche dans la main h : le manche de bois, la lame en croissant côté k, tournée de a degrés
function faucille(h, k = 1, a = 0) {
  const c = Math.cos(a * Math.PI / 180), s = Math.sin(a * Math.PI / 180);
  const pt = (x, y) => [h[0] + (x * c - y * s) * k, h[1] + x * s + y * c].map(r2).join(',');
  const lame = `M${pt(0, -2.4)} Q${pt(1.4, -9.4)} ${pt(7.6, -7.8)} Q${pt(9.4, -7)} ${pt(9.2, -5.6)} Q${pt(6.6, -7)} ${pt(3.6, -6)} Q${pt(1.6, -5)} ${pt(1.2, -2.2)} Z`;
  const manche = `M${pt(0, 3)} L${pt(0, -2.6)}`;
  return trait(manche, OUT, 3) + trait(manche, '#B07A45', 1.5) + P(lame, '#A9B1BB', 0.9)
    + trait(`M${pt(1.2, -4.6)} Q${pt(2.4, -7.4)} ${pt(6, -7.4)}`, '#E2E8EE', 0.6);
}
// un épi de blé doré de (x, y) (le pied) à (x + dx, y - hy) : la tige, l'épi
const epi = (x, y, dx, hy) => L([x, y], [x + dx, y - hy], OUT, 1.2) + L([x, y], [x + dx, y - hy], '#D9B04A', 0.5)
  + E(x + dx * 1.08, y - hy - 1.2, 0.85, 1.7, '#E8C66A', 0.5);
// le blé sur pied, une touffe au sol en (x, y) ; coupée à n (les tiges plus courtes, des brins qui volent)
const touffe = (x, y, n) => E(x, y, 4.6, 1.2, 'rgba(40,55,20,.22)', 0)
  + (n ? [-2.4, -0.8, 0.8, 2.4].map(d => L([x + d, y], [x + d * 1.1, y - 1.6], '#B89A40', 0.7)).join('')
      + [[-1.6, -6, 30], [1.8, -7.6, -40], [3.4, -5, 70]].map(([dx, dy, r]) => L([x + dx - 0.8, y + dy], [x + dx + 0.8, y + dy], '#D9B04A', 0.6).replace('/>', ` transform="rotate(${r} ${r2(x + dx)} ${r2(y + dy)})"/>`)).join('')
    : [[-2.4, -0.8, 8], [-0.8, -0.2, 9.2], [0.8, 0.3, 8.6], [2.4, 0.9, 7.6]].map(([d, dx, hy]) => epi(x + d, y, dx, hy)).join(''));
// Récolter (les cultures, à la faucille) ; 2 images : la faucille levée au-dessus du blé sur pied, l'autre bras au
// repos, puis le coup au pied des tiges (la touffe coupée, des brins qui volent), en riant.
function recolter({ view, n }) {
  const [a, b] = this.shoulders;
  if (view === 'front' || view === 'se') {
    const s = view === 'front' ? 1 : -1, p = s > 0 ? b : a; // p : l'épaule de la main qui tient la faucille
    const x = dx => p[0] + s * dx, sol = 61;
    const h = n ? [x(2.6), sol - 7.4] : [x(5.4), p[1] + 3.4];
    const outil = faucille(h, s, n ? 60 : -20) + arm(this, p, h, n ? [x(2.4), p[1] + 7] : [x(4.6), p[1] + 6]);
    return { expr: n ? 'rire' : 'content', under: touffe(x(7), sol, n), [s > 0 ? 'right' : 'left']: outil };
  }
  // de dos : le blé est devant, un peu à droite (plus loin, donc plus haut) ; la faucille dans la main droite
  const sol = a[1] + 18, h = n ? [b[0] + 2, sol - 6] : [b[0] + 5, b[1] + 1];
  return { expr: n ? 'rire' : undefined, right: '', under: touffe(b[0] + 6, sol, n), over: faucille(h, 1, n ? 60 : -20) + arm(this, b, h, [b[0] + 3.6, b[1] + 4]) };
}
// Debout : frame(avecRecolter(c), vue, 'action', n)
const avecRecolter = c => ({ ...c, uid: `${c.uid}rc`, pose: recolter });

// La caisse de bois, posée sur l'épaule : son dessus (un peu de profondeur), sa face de planches, ses traverses, ses
// clous ; (x, y) : le milieu du bas de la face, w × h
function caisse(x, y, w = 11, h = 8.4) {
  const g = x - w / 2, d = x + w / 2, t = y - h, p = 2.2;
  const face = `M${r2(g)},${r2(y)} L${r2(d)},${r2(y)} L${r2(d)},${r2(t)} L${r2(g)},${r2(t)} Z`;
  const dessus = `M${r2(g)},${r2(t)} L${r2(g + p)},${r2(t - p * 0.7)} L${r2(d + p)},${r2(t - p * 0.7)} L${r2(d)},${r2(t)} Z`;
  const cote = `M${r2(d)},${r2(y)} L${r2(d + p)},${r2(y - p * 0.7)} L${r2(d + p)},${r2(t - p * 0.7)} L${r2(d)},${r2(t)} Z`;
  return P(cote, '#94683F') + P(dessus, '#D2A574') + P(face, '#B8875A')
    + [1 / 3, 2 / 3].map(k => L([g + 0.4, t + h * k], [d - 0.4, t + h * k], '#8A5E36', 0.5)).join('')
    + L([g + 0.6, y - 0.6], [d - 0.6, t + 0.6], '#8A5E36', 0.9) + L([g + 1.2, t + 0.9], [d - 1.6, t + 0.9], 'rgba(255,255,255,.35)', 0.6)
    + [[g + 1, t + 1], [d - 1, t + 1], [g + 1, y - 1], [d - 1, y - 1]].map(([a, b]) => E(a, b, 0.35, 0.35, '#5A3A20', 0)).join('')
    + P(face, 'none');
}
// Porter (une caisse sur l'épaule, en allant au chantier) ; 2 images : la caisse remonte d'un cran (le pas), content.
// La caisse est sur l'épaule droite (à l'écran) dans les trois vues, à côté de la tête, par-dessus ; la main droite la
// tient par-dessous, l'autre bras se balance.
function porter({ view, n }) {
  const [a, b] = this.shoulders;
  const up = n ? -0.9 : 0;
  // bornée : chez les carrures larges, la caisse reste dans le cadre (son côté droit, profondeur comprise, avant 47,2)
  const x = Math.min(b[0] + 7, 39.8), y = b[1] - 0.8 + up;
  const main = [Math.min(b[0] + 10.2, 43), b[1] - 0.2 + up];
  const autre = view === 'ne' ? arm(this, a, [a[0] - 1.4, a[1] + 11 - up]) : arm(this, a, [a[0] - 1.6, a[1] + 10.6 + up * 0.5]);
  return {
    expr: 'content',
    left: autre, right: '',
    over: caisse(x, y, 10.4) + arm(this, b, main, [b[0] + 6.6, b[1] + 5.4])
  };
}
// Debout : frame(avecPorter(c), vue, 'action', n)
const avecPorter = c => ({ ...c, uid: `${c.uid}po`, pose: porter });

// Le marteau : le manche de bois de m (la main) à t (la tête), la tête d'acier en travers (côté frappe et côté pied-de-biche)
function marteau(m, t) {
  const len = Math.hypot(t[0] - m[0], t[1] - m[1]), ux = (t[0] - m[0]) / len, uy = (t[1] - m[1]) / len, nx = -uy, ny = ux;
  const q = (a, b) => [t[0] + ux * a + nx * b, t[1] + uy * a + ny * b];
  const tete = [q(-1.3, -3.2), q(1.3, -3.2), q(1.3, 2.2), q(0.4, 3.6), q(-0.4, 3.6), q(-1.3, 2.2)];
  return L(m, t, OUT, 3.2) + L(m, t, '#C99A62', 1.4) + L(m, [m[0] + ux * 2.4, m[1] + uy * 2.4], '#7A4E2A', 1.6)
    + P(`M${tete.map(p => `${r2(p[0])},${r2(p[1])}`).join(' L')} Z`, '#8E96A0', 0.9) + L(q(-0.7, -2.6), q(-0.7, 1.4), '#C9CFD6', 0.5);
}
// La planche à réparer, tenue en travers (de g à d, à la hauteur y), son fil, un clou planté à moitié en (cx)
const planche = (g, d, y, cx) => `<rect x="${r2(g)}" y="${r2(y - 1.5)}" width="${r2(d - g)}" height="3" rx="0.6" fill="#D2A574" stroke="${OUT}" stroke-width="0.9"/>`
  + L([g + 1, y - 0.3], [d - 1, y - 0.3], '#B8875A', 0.45) + L([g + 2, y + 0.7], [d - 3, y + 0.7], '#B8875A', 0.4)
  + L([cx, y - 1.4], [cx, y - 3.4], OUT, 1.3) + L([cx, y - 1.4], [cx, y - 3.4], '#C9CFD6', 0.5) + E(cx, y - 3.5, 0.9, 0.35, '#8E96A0', 0.5);
// le « tac » : trois traits clairs autour du clou frappé
const tac = (x, y) => [[-1, -0.6], [0, -1.1], [1, -0.6]].map(([dx, dy]) => { const p = [x + dx * 1.6, y + dy * 1.6], q = [x + dx * 3, y + dy * 3]; return L(p, q, OUT, 1.4) + L(p, q, '#FFF2B0', 0.6); }).join('');
// Réparer (le chantier, la cabane) ; 2 images : le marteau levé, puis le coup sur le clou (« tac »), en riant.
// Une main tient la planche en travers devant soi, l'autre le marteau. Assis (assis.js), la planche est sur les genoux.
function reparer({ view, n }) {
  const [a, b] = this.shoulders;
  const y = a[1] + 9.4; // la planche
  if (view === 'front') {
    const cx = 25.4, pl = planche(15.4, 32.6, y, cx);
    const hp = [16.6, y + 0.2];
    if (!n) {
      const m = [Math.min(b[0] + 6.4, 39.6), a[1] + 1.4], t = [Math.min(b[0] + 8.6, 41.8), a[1] - 5.4]; // bornés : le marteau reste dans le cadre
      return { expr: 'content', left: pl + arm(this, a, hp, [a[0] - 1.6, a[1] + 6.4]), right: arm(this, b, m, [b[0] + 4.6, b[1] + 5.8]) + marteau(m, t) };
    }
    const m = [b[0] + 1.6, y - 3.6], t = [cx + 1.4, y - 5.6];
    return { expr: 'rire', left: pl + arm(this, a, hp, [a[0] - 1.6, a[1] + 6.4]), right: arm(this, b, m, [b[0] + 2.6, b[1] + 6.6]) + marteau(m, t), over: tac(cx, y - 3.6) };
  }
  if (view === 'se') {
    const cx = a[0] - 0.4, pl = planche(a[0] - 8.4, b[0] - 1.4, y, cx);
    const hp = [b[0] - 3, y + 0.2];
    if (!n) {
      const m = [Math.max(a[0] - 5, 8.4), a[1] + 1.4], t = [Math.max(a[0] - 8.4, 5.6), a[1] - 5];
      return { expr: 'content', right: pl + arm(this, b, hp, [b[0] + 1.4, b[1] + 6.4]), left: arm(this, a, m, [a[0] - 3.6, a[1] + 5.6]) + marteau(m, t) };
    }
    const m = [a[0] - 3.4, y - 4], t = [cx - 1.2, y - 5.8];
    return { expr: 'rire', right: pl + arm(this, b, hp, [b[0] + 1.4, b[1] + 6.4]), left: arm(this, a, m, [a[0] - 2.4, a[1] + 6]) + marteau(m, t), over: tac(cx, y - 3.6) };
  }
  // de dos : la planche est devant (cachée) ; le marteau levé passe à droite de la tête, puis frappe (le « tac » dépasse à droite)
  if (!n) {
    const m = [Math.min(b[0] + 6.4, 39.6), a[1] + 0.6], t = [Math.min(b[0] + 8.2, 41.4), a[1] - 6.2];
    return { left: '', right: '', under: arm(this, a, [24 - 2, y - 1], [a[0] - 2.4, a[1] + 6]), over: arm(this, b, m, [b[0] + 4.4, b[1] + 5.6]) + marteau(m, t) };
  }
  return { expr: 'rire', left: '', right: '', under: arm(this, a, [24 - 2, y - 1], [a[0] - 2.4, a[1] + 6]) + arm(this, b, [24 + 3, y - 2], [b[0] + 2.4, b[1] + 6]), over: tac(b[0] + 3.6, y - 3) };
}
// Debout : frame(avecReparer(c), vue, 'action', n) ; assis : assis(c, vue, n, null, reparer)
const avecReparer = c => ({ ...c, uid: `${c.uid}re`, pose: reparer });

// L'onde qui repousse, douce et claire : deux anneaux autour de la paume en (x, y), un peu décalés vers la créature
// (dx, dy), plus larges à l'image 2, et deux étincelles
function onde(x, y, dx, dy, n) {
  const k = n ? 1.2 : 1;
  const anneau = (r, o) => {
    const e = (color, w) => `<ellipse cx="${r2(x + dx * o)}" cy="${r2(y + dy * o)}" rx="${r2(r)}" ry="${r2(r * 0.9)}" fill="none" stroke="${color}" stroke-width="${w}"/>`;
    return e(OUT, 1.5) + e('#EAF6FF', 0.7);
  };
  const etoile = (sx, sy, s) => `<path d="M${r2(sx)},${r2(sy - s)} Q${r2(sx + s * 0.2)},${r2(sy - s * 0.2)} ${r2(sx + s)},${r2(sy)} Q${r2(sx + s * 0.2)},${r2(sy + s * 0.2)} ${r2(sx)},${r2(sy + s)} Q${r2(sx - s * 0.2)},${r2(sy + s * 0.2)} ${r2(sx - s)},${r2(sy)} Q${r2(sx - s * 0.2)},${r2(sy - s * 0.2)} ${r2(sx)},${r2(sy - s)} Z" fill="#FFF2B0" stroke="${OUT}" stroke-width="0.4"/>`;
  return `<g opacity="0.9">${anneau(3.4 * k, 0.8) + anneau(5 * k, 1.8)}</g>` + etoile(x + dx * 3 + 4.4 * k, y + dy * 3 - 4.6 * k, n ? 1.2 : 0.9) + etoile(x + dx * 3 - 4.6 * k, y + dy * 3 + 3.6 * k, n ? 0.8 : 1.1);
}
// Repousser une créature de la brume d'un toucher (HISTOIRE.md § 6.15 : jamais de coup) : la main ouverte tendue vers
// elle, une onde claire et deux étincelles ; 2 images : la main pousse un peu plus loin, l'onde s'élargit.
// L'air décidé mais gentil (« Ouste ! »). La créature est devant le personnage.
function repousser({ view, n }) {
  const [a, b] = this.shoulders;
  const d = n ? 1.4 : 0;
  if (view === 'front') {
    const h = [Math.min(b[0] + 4.6 + d, 38.2), a[1] + 3.6 - d * 0.4]; // bornée : l'onde reste dans le cadre
    return { expr: 'content', right: arm(this, b, h, [b[0] + 3.4, b[1] + 6.6]) + paume(this, [h[0], h[1] - 0.6], -1, 1.1), over: onde(h[0], h[1] - 0.8, 0.6, -0.3, n) + paume(this, [h[0], h[1] - 0.6], -1, 1.1) };
  }
  if (view === 'se') {
    const h = [Math.max(a[0] - 6 - d * 0.8, 9.6), a[1] + 3.4];
    return { expr: 'content', left: arm(this, a, h, [a[0] - 2.6, a[1] + 6.4]) + tranche(this, [h[0] - 0.2, h[1] - 0.6], 1, 1.05), over: onde(h[0] - 0.4, h[1] - 0.8, -1, 0, n) + tranche(this, [h[0] - 0.2, h[1] - 0.6], 1, 1.05) };
  }
  // de dos : la créature est devant ; la main se lève au-dessus de l'épaule, paume vers elle (on voit la tranche)
  const h = [Math.min(b[0] + 4.6 + d * 0.6, 38), a[1] - 3.6 - d * 0.4];
  return { left: '', right: '', over: arm(this, b, h, [b[0] + 4.4, b[1] + 4.6]) + onde(h[0], h[1] - 0.8, 0.4, -0.8, n) + tranche(this, [h[0], h[1] - 0.6], 1, 1.05) };
}
// Debout : frame(avecRepousser(c), vue, 'action', n)
const avecRepousser = c => ({ ...c, uid: `${c.uid}rp`, pose: repousser });

// Le carnet ouvert, tourné vers nous, en (x, y) le haut de la reliure : la couverture bleue, les pages claires, les
// lignes déjà écrites à gauche, l'écriture à l'encre bleue à droite (1 à 3 lignes), un signet rouge
function carnet(x, y, lignes) {
  return P(`M${r2(x - 5.4)},${r2(y)} L${r2(x + 5.4)},${r2(y)} L${r2(x + 5.4)},${r2(y + 6)} L${r2(x - 5.4)},${r2(y + 6)} Z`, '#3E5A8C', 0.9)
    + P(`M${r2(x - 4.7)},${r2(y - 0.5)} Q${r2(x - 2.3)},${r2(y - 1.3)} ${r2(x)},${r2(y)} Q${r2(x + 2.3)},${r2(y - 1.3)} ${r2(x + 4.7)},${r2(y - 0.5)} L${r2(x + 4.7)},${r2(y + 5.1)} Q${r2(x + 2.3)},${r2(y + 4.4)} ${r2(x)},${r2(y + 5.4)} Q${r2(x - 2.3)},${r2(y + 4.4)} ${r2(x - 4.7)},${r2(y + 5.1)} Z`, '#FBF4E2', 0.8)
    + L([x, y], [x, y + 5.4], OUT, 0.55) + L([x + 3.4, y + 5.2], [x + 3.6, y + 7.4], '#D9443A', 0.7)
    + [1.4, 2.5, 3.6].map(d => L([x - 3.9, y + d], [x - 1, y + d], '#8A7A6A', 0.4)).join('')
    + [1.4, 2.5, 3.6].slice(0, lignes).map(d => `<path d="M${r2(x + 1)},${r2(y + d)} q0.5,-0.4 1,0 t1,0 t1,0" fill="none" stroke="#3E5A8C" stroke-width="0.4"/>`).join('');
}
// Le crayon : de la mine (le bout qui écrit, en p) vers la gomme, le long de (ux, uy) ; jaune, mine taillée, gomme rose
function crayon(p, ux, uy) {
  const l = 6, q = [p[0] + ux * l, p[1] + uy * l], t = [p[0] + ux * 1.2, p[1] + uy * 1.2];
  return L(t, q, OUT, 2.2) + L(t, q, '#F2C04B', 1) + L(p, t, OUT, 1.1) + L(p, [p[0] + ux * 0.6, p[1] + uy * 0.6], '#3A3A44', 0.5)
    + L([q[0] - ux * 0.9, q[1] - uy * 0.9], q, '#F2A0B0', 1);
}
// Écrire (le carnet de bord, les lettres) ; 2 images : le crayon avance sur la page, une ligne de plus s'écrit.
// Une main tient le carnet ouvert devant soi, l'autre écrit. Assis (assis.js), le carnet est tenu au-dessus des genoux.
function ecrire({ view, n }) {
  const [a, b] = this.shoulders;
  const y = a[1] + 3.6; // le haut du carnet
  if (view === 'front') {
    const x = 24, p = [x + 2 + n * 1.6, y + 2.6 + n * 1.1]; // la mine sur la page de droite
    const tient = arm(this, a, [x - 5.2, y + 5.6], [a[0] - 1.4, a[1] + 6.8]);
    const ecrit = arm(this, b, [p[0] + 1.6, p[1] + 2.2], [b[0] + 2.6, b[1] + 6.6]) + crayon(p, 0.55, -0.83);
    // le carnet et la main qui écrit passent par-dessus le manteau et la barbe
    return { expr: 'content', left: tient, right: '', over: carnet(x, y, n ? 2 : 1) + ecrit };
  }
  if (view === 'se') {
    // de trois quarts, le carnet est tenu en avant, vers le regard, par le bras éloigné ; le bras proche passe derrière
    // le carnet (coude en arrière), seuls la main et le crayon se posent sur la page
    const x = a[0] - 3, p = [x + 2 + n * 1.6, y + 2.6 + n * 1.1], h = [p[0] + 1.6, p[1] + 2.2];
    const tient = arm(this, b, [x - 4.4, y + 5.8], [b[0] + 0.6, b[1] + 7]);
    const ecrit = arm(this, a, h, [a[0] + 1.4, a[1] + 6.4], '');
    return { expr: 'content', right: tient, left: '', over: ecrit + carnet(x, y, n ? 2 : 1) + crayon(p, 0.55, -0.83) + E(h[0], h[1], 2.1, 2.1, this.hand || this.skin) };
  }
  // de dos : le carnet, le crayon et les mains sont devant (cachés) ; on voit les coudes, et le droit bouge en écrivant
  return { left: '', right: '', under: arm(this, a, [24 - 3, y + 5.6], [a[0] - 2.4, a[1] + 6]) + arm(this, b, [b[0] + 1.6, y + 4], [b[0] + 4.4 + n * 1.4, b[1] + 5.6 - n * 0.6]) };
}
// Debout : frame(avecEcrire(c), vue, 'action', n) ; assis : assis(c, vue, n, null, ecrire)
const avecEcrire = c => ({ ...c, uid: `${c.uid}ec`, pose: ecrire });

module.exports = { lanterne, parapluie, valise, avecLanterne, avecParapluie, avecValise, couche, CADRE_PARAPLUIE, CADRE_COUCHE, ZEDS, paume, tranche, tendre, avecMainsTendues, applaudir, avecApplaudir, pecher, avecPecher, piocher, avecPiocher, cueillir, avecCueillir, arroser, avecArroser, becher, avecBecher, semer, avecSemer, recolter, avecRecolter, porter, avecPorter, reparer, avecReparer, repousser, avecRepousser, ecrire, avecEcrire };
