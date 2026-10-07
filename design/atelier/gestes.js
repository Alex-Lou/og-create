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
    + [-0.6, 0.6].map(d => L([x + d * s, y - h + 0.35], [x + d * s, y - h * 0.35], OUT, 0.42)).join('');
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

module.exports = { lanterne, parapluie, valise, avecLanterne, avecParapluie, avecValise, couche, CADRE_PARAPLUIE, CADRE_COUCHE, ZEDS, paume, tranche, tendre, avecMainsTendues, applaudir, avecApplaudir, pecher, avecPecher, piocher, avecPiocher, cueillir, avecCueillir };
