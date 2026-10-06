// Lot L4 — les gestes du quotidien au grand format, pour n'importe quel personnage de la troupe (maîtres, naufragés,
// avatar, visiteurs, nouveaux venus) : ce que le petit format savait faire et que le détaillé n'avait pas encore.
// - lanterne : marcher une lanterne à la main (le soir, dès la première lanterne de l'acte I) ;
// - parapluie : marcher sous un parapluie (la pluie) ; la toile passe au-dessus de la tête : cadre CADRE_PARAPLUIE ;
// - valise : les nouveaux venus de l'épilogue arrivent avec leur bagage ;
// - couché : dormir allongé sous une couverture (la nuit), la tête à gauche ; cadre CADRE_COUCHE.
// Le travail est le geste du métier de chaque maître (sa pose « action »), dans les trois vues : rien à ajouter ici.
const { OUT, P, E, L, limb, zee, r2, frame } = require('./troupe');

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

module.exports = { lanterne, parapluie, valise, avecLanterne, avecParapluie, avecValise, couche, CADRE_PARAPLUIE, CADRE_COUCHE, ZEDS };
