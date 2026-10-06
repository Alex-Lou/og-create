// L'avatar du joueur (HISTOIRE.md § 6.17) : un personnage de la troupe qu'on compose soi-même.
// Même repère que la troupe (48 × 64, pieds en (24, 62)), mêmes vues, mêmes poses, mêmes expressions ;
// avatar(choix) rend un personnage pour troupe.frame(), comme aster.js ou rivet.js.
//
// Les choix (CHOIX) : silhouette, peau, yeux, sourcils, taches de rousseur, joues, coupe et couleur de cheveux,
// haut (forme et couleur), pantalon (couleur), chaussures, accessoire. Les couleurs de peau et de cheveux sont celles
// du jeu (src/world/villagers.js) : le petit format (design/atelier/avatar_petit.mjs) les reprend telles quelles.
// Poses : repos, marche, salut, et trois gestes du tutoriel : ramasser (trois quarts avant), grelotter et lire (face).
const { OUT, P, E, L, clip, expression, arm, r2 } = require('./troupe');

// ---- les choix ----
const CHOIX = {
  silhouette: { fine: 'Fine', moyenne: 'Moyenne', large: 'Large' },
  peau: { porcelaine: '#F6D3B3', peche: '#F2C9A0', miel: '#E9B98F', cannelle: '#C98B5E', cacao: '#8D5A3B', ebene: '#6B4430' },
  yeux: { brun: '#2A2420', noisette: '#6B4A2A', vert: '#3E6B3A', bleu: '#3A5C8C', gris: '#4E5560' },
  sourcils: { fins: 'Fins', epais: 'Épais', doux: 'Doux' },
  rousseur: { non: 'Sans', oui: 'Taches de rousseur' },
  joues: { roses: 'Roses', discretes: 'Discrètes' },
  coupe: { courte: 'Courte', longue: 'Longue', chignon: 'Chignon', bouclee: 'Bouclée', queue: 'Queue de cheval', tresses: 'Tresses', rasee: 'Rasée' },
  cheveux: { noir: '#3A2A1E', brun: '#7A4E2C', chatain: '#C9873E', blond: '#E8C46A', roux: '#B94E3A', nuit: '#2E2E3A', blanc: '#D9D4CC', gris: '#8A8F98' },
  haut: { tshirt: 'T-shirt', pull: 'Pull', chemise: 'Chemise', veste: 'Veste ouverte' },
  couleurHaut: { corail: '#E8705A', soleil: '#F2C04B', menthe: '#7EC4A0', ciel: '#6FA3D9', lavande: '#A48CD6', rose: '#E8879C', creme: '#F1E6CC', marine: '#3E5A8C', foret: '#4E7A4A', prune: '#7A3E5E' },
  couleurBas: { jean: '#3E5A8C', sable: '#C9B080', olive: '#6E7A44', charbon: '#4A4E5C', brique: '#9C4A36', creme: '#E6DCC3', noir: '#2E2A2A', bordeaux: '#6E2E3A' },
  chaussures: { cuir: '#5E3A22', toile: '#E6DCC3', rouge: '#B8463A', bleu: '#3E5A8C' },
  accessoire: { aucun: 'Aucun', lunettes: 'Lunettes rondes', bonnet: 'Bonnet', paille: 'Chapeau de paille', casquette: 'Casquette', foulard: 'Foulard', bandana: 'Bandana' }
};
// Les noms à afficher pour les choix de couleur (les autres choix portent déjà leur nom dans CHOIX)
const LIBELLES = {
  peau: { porcelaine: 'Porcelaine', peche: 'Pêche', miel: 'Miel', cannelle: 'Cannelle', cacao: 'Cacao', ebene: 'Ébène' },
  yeux: { brun: 'Bruns', noisette: 'Noisette', vert: 'Verts', bleu: 'Bleus', gris: 'Gris' },
  cheveux: { noir: 'Noirs', brun: 'Bruns', chatain: 'Châtains', blond: 'Blonds', roux: 'Roux', nuit: 'Bleu nuit', blanc: 'Blancs', gris: 'Gris' },
  couleurHaut: { corail: 'Corail', soleil: 'Soleil', menthe: 'Menthe', ciel: 'Ciel', lavande: 'Lavande', rose: 'Rose', creme: 'Crème', marine: 'Marine', foret: 'Forêt', prune: 'Prune' },
  couleurBas: { jean: 'Jean', sable: 'Sable', olive: 'Olive', charbon: 'Charbon', brique: 'Brique', creme: 'Crème', noir: 'Noir', bordeaux: 'Bordeaux' },
  chaussures: { cuir: 'Cuir', toile: 'Toile', rouge: 'Rouges', bleu: 'Bleues' }
};
const libelle = (cle, valeur) => (LIBELLES[cle] && LIBELLES[cle][valeur]) || CHOIX[cle][valeur];
const DEFAUT = { silhouette: 'moyenne', peau: 'peche', yeux: 'brun', sourcils: 'fins', rousseur: 'non', joues: 'roses', coupe: 'courte', cheveux: 'brun', haut: 'tshirt', couleurHaut: 'corail', couleurBas: 'jean', chaussures: 'cuir', accessoire: 'aucun' };

// ---- couleurs ----
function hsl(hex) {
  const n = parseInt(hex.slice(1), 16), r = (n >> 16) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255;
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
// mélange de deux couleurs (k = part de la seconde)
const mix = (a, b, k) => { const p = c => [0, 2, 4].map(i => parseInt(c.slice(1 + i, 3 + i), 16)); const A = p(a), B = p(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * k).toString(16).padStart(2, '0')).join('').toUpperCase(); };
// plus sombre (k < 1) ou plus clair (k > 1), en gardant la teinte
const tone = (c, k) => { const [h, s, l] = hsl(c); return hex([h, s, k < 1 ? l * k : l + (1 - l) * (k - 1)]); };

// ---- la tête ----
// Repères communs (ceux de la troupe) : visage centré en 24 (face) ou 22,6 (trois quarts), yeux, bouche, oreilles
const FACE = { front: { fx: 24, rx: 11.6 }, se: { fx: 22.6, rx: 11.2 } };
const faceD = v => { const { fx, rx } = FACE[v]; return `M${fx - rx},21.6 a${rx},10.4 0 1,0 ${2 * rx},0 a${rx},10.4 0 1,0 ${-2 * rx},0 Z`; };
const BACK = {
  front: 'M11.4,21.6 Q10.4,7.2 24,6.6 Q37.6,7.2 36.6,21.6 Q36.8,26.4 35,27.6 L13,27.6 Q11.2,26.4 11.4,21.6 Z',
  se: 'M12,21.6 Q10.6,7.2 24,6.8 Q38.2,7.2 37.4,21.6 Q37.6,26.4 35.6,27.6 L14,27.6 Q12.2,26.4 12,21.6 Z',
  ne: 'M11,21 Q10,6.6 24,6.4 Q38,6.6 37,21 Q37.2,27 34.6,28.8 Q24,31 13.4,28.8 Q10.8,27 11,21 Z'
};
// Franges : courte (mèches souples, raie de côté), et la même un peu plus longue
const BANGS = {
  front: 'M12,19.4 Q11.6,9.6 24,9.2 Q36.4,9.6 36.2,18.6 Q33.4,13.8 28.4,13.4 Q25.4,15.6 21.6,15.2 Q17.4,15 14.6,17.4 Q12.8,18.6 12,19.4 Z',
  se: 'M11.4,19.4 Q11,9.6 23,9 Q35,9.4 35.4,18 Q32.6,13.6 27.6,13.2 Q24.6,15.4 20.6,15 Q16.6,14.8 13.8,17.2 Q12.2,18.4 11.4,19.4 Z'
};
const sx = (d, k) => d.replace(/(-?\d+\.?\d*),(-?\d+\.?\d*)/g, (m, x, y) => `${r2(+x + k)},${y}`);

// Boucles : un nuage festonné autour d'un centre
function curls(cx, cy, rx, ry, n, bumps = 1.9) {
  let d = '';
  for (let i = 0; i <= n; i++) {
    const t = (i / n) * Math.PI * 2 - Math.PI / 2;
    const x = cx + Math.cos(t) * rx, y = cy + Math.sin(t) * ry;
    if (i === 0) { d += `M${r2(x)},${r2(y)}`; continue; }
    const tm = ((i - 0.5) / n) * Math.PI * 2 - Math.PI / 2;
    d += ` Q${r2(cx + Math.cos(tm) * (rx + bumps))},${r2(cy + Math.sin(tm) * (ry + bumps))} ${r2(x)},${r2(y)}`;
  }
  return d + ' Z';
}
// Tresse : une suite d'écailles le long d'une ligne (x, y0) -> (x + dx, y1)
function braid(x, y0, y1, dx, c, n = 4) {
  let s = '';
  for (let i = 0; i < n; i++) {
    const t = i / n, y = y0 + (y1 - y0) * t, xx = x + dx * t, h = (y1 - y0) / n;
    s += P(`M${r2(xx - 1.7)},${r2(y)} Q${r2(xx)},${r2(y + h * 1.2)} ${r2(xx + 1.7)},${r2(y)} Q${r2(xx)},${r2(y + h * 0.3)} ${r2(xx - 1.7)},${r2(y)} Z`, i % 2 ? c.hairS : c.hair, 0.8);
  }
  return s + E(x + dx, y1 + 0.6, 1.3, 1, c.tie, 0.7);
}

// Ce que chaque coupe met derrière le corps (cheveux longs, tresses, queue de dos), derrière la tête, et par-dessus
function hairBehindBody(c, view) {
  const { coupe } = c.o;
  if (coupe === 'longue') {
    if (view === 'ne') return '';
    const d = view === 'se' ? 'M12.4,22 Q11,34 13.6,40 L34.6,40 Q37.4,34 36.4,22 Z' : 'M11.6,22 Q10.4,34 13,40.4 L35,40.4 Q37.6,34 36.4,22 Z';
    return P(d, c.hairS);
  }
  return '';
}
function hairBack(c, view) {
  const { coupe } = c.o;
  const H = c.hair, S = c.hairS;
  let s = '';
  if (coupe === 'chignon') s += view === 'ne' ? E(24, 8, 5, 4.4, H) + P('M20.4,6.6 Q24,4.4 27.6,6.6', 'none', 0.6) : E(view === 'se' ? 25.6 : 24, 5.4, 4.6, 4, H) + P(`M${view === 'se' ? 22 : 20.4},4.4 Q${view === 'se' ? 25.6 : 24},2.4 ${view === 'se' ? 29.2 : 27.6},4.4`, 'none', 0.6);
  if (coupe === 'queue') {
    s += view === 'ne' ? '' : P(view === 'se' ? 'M33.4,11.6 Q41.6,11 42,20.4 Q39.6,18 35.6,18.6 Z' : 'M33.4,11.6 Q41.4,10.8 41.6,19.4 Q39.4,17.2 35.4,18.2 Z', H) + E(34.6, 13.2, 1.5, 1.4, c.tie, 0.9);
  }
  if (coupe === 'bouclee') s += P(curls(view === 'se' ? 23.6 : 24, 17.4, 15.4, 13.6, 14), H) + clip(`${c.uid}cb${view}`, curls(view === 'se' ? 23.6 : 24, 17.4, 15.4, 13.6, 14), `<rect x="4" y="22" width="40" height="14" fill="${S}"/>`) + P(curls(view === 'se' ? 23.6 : 24, 17.4, 15.4, 13.6, 14), 'none');
  return s;
}

function head(c, ctx) {
  const { view } = ctx;
  const o = c.o, H = c.hair, S = c.hairS, HI = c.hairH;
  const coupe = o.coupe;
  let s = hairBack(c, view);
  // --- de dos : l'arrière de la tête ---
  if (view === 'ne') {
    s += E(12.6, 23, 1.6, 2.2, c.skin) + E(35.4, 23, 1.6, 2.2, c.skin);
    if (coupe === 'rasee') {
      // crâne rasé : la peau sous des cheveux très courts (teinte mêlée), une nuque nette, quelques traits de tondeuse
      const d = 'M11.4,21 Q10.6,8 24,7.6 Q37.4,8 36.6,21 Q36.6,26.4 34,28 Q24,30 14,28 Q11.4,26.4 11.4,21 Z';
      const buzz = 'M11.6,20.6 Q10.8,8.2 24,7.8 Q37.2,8.2 36.4,20.6 Q35.8,24.4 33.2,25.6 Q28.4,24.4 24,25.4 Q19.6,24.4 14.8,25.6 Q12.2,24.4 11.6,20.6 Z';
      s += P(d, c.skin) + P(buzz, c.buzz, 0.9) + [[17, 12], [21, 10.6], [26.4, 10.8], [30.6, 12.4], [19, 17], [24, 16.2], [29, 17.2], [16, 21.4], [32, 21.4]].map(([x, y]) => L([x, y], [x + 0.5, y + 1.1], c.buzzS, 0.5)).join('');
      return s + accessoryHead(c, view);
    }
    if (coupe !== 'bouclee') {
      s += P(BACK.ne, H) + clip(`${c.uid}h`, BACK.ne, `<rect x="8" y="4" width="34" height="32" fill="${S}"/><ellipse cx="22.4" cy="17.2" rx="13.8" ry="12" fill="${H}"/>`) + P(BACK.ne, 'none');
      s += P('M18.6,13 Q17.8,20 19.4,27.4', 'none', 0.6) + P('M25,12.6 Q25.8,20 24.6,28', 'none', 0.6) + L([17, 10], [22.4, 8.6], HI, 1.3);
    }
    if (coupe === 'longue') s += P('M11.6,22 Q11,32 14,38.6 Q24,41 34,38.6 Q37,32 36.4,22 Q36,28.4 33.6,29.6 Q24,32 14.4,29.6 Q12,28.4 11.6,22 Z', H) + P('M20,30.8 Q20.4,35 19.4,38.6 M28,30.8 Q27.6,35 28.6,38.6', 'none', 0.55);
    if (coupe === 'queue') s += P('M22,25 Q20.4,33 22.6,38.6 Q24,39.6 25.4,38.6 Q27.6,33 26,25 Z', H) + E(24, 25.6, 2.2, 1.3, c.tie, 0.8);
    if (coupe === 'tresses') s += braid(17.2, 25.4, 37.6, -0.6, c) + braid(30.8, 25.4, 37.6, 0.6, c);
    if (coupe === 'bouclee') s += P('M17,12 Q24,9.6 31,12 M15.4,20 Q24,23 32.6,20', 'none', 0.55);
    return s + accessoryHead(c, view);
  }
  // --- de face ou de trois quarts ---
  const se = view === 'se';
  const k = se ? -1.4 : 0;
  const face = faceD(view);
  if (coupe !== 'rasee' && coupe !== 'bouclee') s += P(BACK[view], H) + clip(`${c.uid}h`, BACK[view], `<rect x="8" y="24.6" width="32" height="6" fill="${S}"/>`) + P(BACK[view], 'none');
  // oreilles (cachées par les cheveux longs et les tresses de face)
  if (se) s += E(35, 23.2, 1.5, 2.1, c.skin);
  else if (coupe !== 'longue') s += E(11.8, 22.8, 1.5, 2.1, c.skin) + E(36.2, 22.8, 1.5, 2.1, c.skin);
  const fr = se ? [[15.8, 24.7], [17, 25.4], [14.9, 25.2], [26.8, 24.8], [27.8, 25.4]]
    : [[17.6, 24.8], [18.8, 25.5], [16.6, 25.3], [30.4, 24.8], [29.2, 25.5], [31.4, 25.3]];
  const cheeks = se ? [[15.2, 1.8], [28.2, 1.5]] : [[16.6, 1.9], [31.4, 1.9]];
  const bangs = coupe === 'rasee' ? null : BANGS[view];
  s += P(face, c.skin);
  s += clip(`${c.uid}f`, face, (bangs ? `<path d="${bangs}" fill="${c.skinS}" transform="translate(0 1.4)"/>` : '')
    + cheeks.map(([x, rx]) => E(x, 26.2, rx * (ctx.expr === 'gene' ? 1.3 : 1), ctx.expr === 'gene' ? 1.6 : 1.1, c.cheek, 0)).join('')
    + (o.rousseur === 'oui' ? fr.map(([x, y]) => E(x, y, 0.38, 0.38, c.freckle, 0)).join('') : ''));
  s += P(face, 'none');
  // le dessus de la tête selon la coupe
  if (coupe === 'rasee') {
    const cap = se ? 'M11.8,19.6 Q11.6,8.4 23,7.8 Q34.8,8.2 35.4,19 Q33,14.2 23.2,13.8 Q14.6,14 11.8,19.6 Z' : 'M12.4,19.8 Q12.2,8.2 24,7.8 Q35.8,8.2 35.6,19.8 Q33.4,13.8 24,13.6 Q14.6,13.8 12.4,19.8 Z';
    s += P(cap, c.buzz, 0.9) + L(se ? [15.4, 11.4] : [17, 11], se ? [21.4, 9.6] : [23, 9.4], tone(c.buzz, 1.25), 1);
  } else if (coupe === 'bouclee') {
    const top = curls(se ? 23.2 : 24, 11.6, 12.6, 4.6, 11, 1.6);
    s += P(top, H) + L(se ? [15.6, 9.6] : [17, 9.4], se ? [21, 8] : [22.4, 7.8], HI, 1.1);
  } else {
    s += P(bangs, H) + L(se ? [15.6, 11.4] : [17, 11.2], se ? [22.6, 9.6] : [24, 9.6], HI, 1.3);
    if (coupe === 'longue') {
      // mèches qui tombent le long des joues (devant les oreilles)
      s += se ? P('M33.2,15 Q37.8,22 36.6,31.6 Q35,29.6 33.6,30.2 Q34.4,22 32,17.6 Z', H)
        : P('M14.4,15 Q9.8,22 11.2,31.6 Q12.8,29.6 14.2,30.2 Q13.4,22 15.6,17.6 Z', H) + P('M33.6,15 Q38.2,22 36.8,31.6 Q35.2,29.6 33.8,30.2 Q34.6,22 32.4,17.6 Z', H);
    }
    if (coupe === 'tresses') {
      s += se ? braid(34.2, 26, 37.4, 0.8, c) : braid(13.4, 26, 37.8, -0.6, c) + braid(34.6, 26, 37.8, 0.6, c);
    }
  }
  // expression : sourcils de la couleur des cheveux (plus foncés), yeux de la couleur choisie
  const brow = { fins: [1, -4.1], epais: [1.6, -4.2], doux: [0.95, -3.7] }[o.sourcils];
  s += expression({
    eyes: se ? [[17.2, 22.6, 1.55], [25.2, 22.6, 1.35]] : [[19.4, 22.6, 1.6], [28.6, 22.6, 1.6]], ry: 2.35, eyeColor: c.eye,
    brow: tone(H, 0.55), browY: brow[1], browW: brow[0],
    mouth: [se ? 20.8 : 24, 27], mw: 1.7, mouthC: '#7A3B30', tongue: '#E07A72',
    neutral: (mx, my) => `M${r2(mx - 1.4)},${r2(my + 0.3)} Q${mx},${r2(my + 1.3)} ${r2(mx + 1.4)},${r2(my + 0.3)}`,
    cheeks, cheekY: 26.2, temple: [se ? 12.6 : 13.4, 12.4], anger: [40, 6.8], zz: [36.4, 5.8]
  }, ctx);
  s += accessoryHead(c, view, k);
  return s;
}

// ---- accessoires ----
function accessoryHead(c, view, k = 0) {
  const a = c.o.accessoire;
  const se = view === 'se', ne = view === 'ne';
  if (a === 'lunettes' && !ne) {
    const lens = se ? [[17.2, 22.8, 2.9], [25.4, 22.8, 2.5]] : [[19.4, 22.8, 3.1], [28.6, 22.8, 3.1]];
    let s = lens.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="rgba(200,230,255,.25)" stroke="#3C2819" stroke-width="0.9"/>`).join('');
    s += P(se ? 'M20.1,22.4 Q21.2,21.6 22.9,22.4' : 'M22.5,22.4 Q24,21.4 25.5,22.4', 'none', 0.8);
    s += se ? P('M27.9,22.2 L34.4,21.4', 'none', 0.8) : P('M16.3,22.2 L12.2,21.6 M31.7,22.2 L35.8,21.6', 'none', 0.8);
    return s;
  }
  if (a === 'lunettes') return P('M11.6,21.4 L14.6,21.8 M36.4,21.4 L33.4,21.8', 'none', 0.8);
  if (a === 'bonnet') {
    const d = 'M11.2,15.4 Q10.8,4.6 24,4.4 Q37.2,4.6 36.8,15.4 Z';
    return P(sx(d, k), c.acc) + clip(`${c.uid}bn${view}`, sx(d, k), [14, 18.6, 23.2, 27.8, 32.4].map(x => L([x + k, 5], [x + k, 15], tone(c.acc, 0.82), 0.6)).join(''))
      + P(sx(d, k), 'none') + `<rect x="${r2(10.6 + k)}" y="13.4" width="26.8" height="3.4" rx="1.6" fill="${tone(c.acc, 0.85)}" stroke="${OUT}" stroke-width="1"/>`
      + E(24 + k, 3.6, 2.6, 2.3, '#F1E6CC');
  }
  if (a === 'paille') {
    const crown = sx('M15.6,13.4 Q15.8,5.2 24,5 Q32.2,5.2 32.4,13.4 Z', k);
    return E(24 + k, 13.6, ne ? 15.4 : 16.4, 3.4, '#F2D27E') + P(crown, '#E8C46A') + `<rect x="${r2(15.6 + k)}" y="10.6" width="16.8" height="2.2" fill="#C9473A"/>`
      + P(crown, 'none') + L([17.2 + k, 8], [21 + k, 6.4], '#FFF0B8', 0.9);
  }
  if (a === 'casquette') {
    const dome = sx('M11.6,15.6 Q11.4,5.6 24,5.4 Q36.6,5.6 36.4,15.6 Z', k);
    const visor = ne ? '' : se ? P('M9,15.6 Q8.4,12.6 16,13.6 L22,15.6 Q15,17.4 9,15.6 Z', tone(c.acc, 0.8)) : P('M15,15.4 Q24,12.6 33,15.4 Q24,19 15,15.4 Z', tone(c.acc, 0.8));
    return P(dome, c.acc) + P(sx('M23.4,5.6 L23.4,15.4', k), 'none', 0.5) + E(24 + k, 5.6, 1.1, 0.8, tone(c.acc, 0.8), 0.6) + visor;
  }
  if (a === 'bandana') {
    const d = ne ? 'M11.2,17.6 Q10.8,6 24,5.8 Q37.2,6 36.8,17.6 Q24,14.4 11.2,17.6 Z' : sx('M11.6,16.4 Q11.4,6.2 24,6 Q36.6,6.2 36.4,16.4 Q24,13 11.6,16.4 Z', k);
    let s = P(d, c.acc) + clip(`${c.uid}bd${view}`, d, [[16, 9], [21, 7.4], [27, 8], [31.6, 10.6], [19, 12.6], [28.6, 12.6]].map(([x, y]) => E(x + k, y, 0.7, 0.7, '#FFF4E0', 0)).join('')) + P(d, 'none');
    if (ne) s += P('M23,16.4 Q21.4,19.6 21.8,22.6 Q23,21.6 23.8,22.2 Q23.4,19.4 24.4,16.6 Z', tone(c.acc, 0.85), 0.8)
      + P('M25,16.4 Q27.4,19 27.6,22 Q26.4,21.2 25.6,21.8 Q25.4,19.2 23.8,16.8 Z', tone(c.acc, 0.85), 0.8) + E(24, 16.4, 1.8, 1.3, c.acc, 0.8);
    return s;
  }
  return '';
}

// ---- le corps ----
// Torse jusqu'aux hanches ; la silhouette élargit ou resserre autour de l'axe 24
function torso(w) { return `M${r2(24 - 8.5 * w)},32.6 Q24,30 ${r2(24 + 8.5 * w)},32.6 L${r2(24 + 10.2 * w)},46.6 Q24,49.6 ${r2(24 - 10.2 * w)},46.6 Z`; }

function body(c, ctx) {
  const { view } = ctx;
  const w = c.w;
  const T = torso(w);
  const top = c.top, topS = c.topS, topH = c.topH;
  const shadeX = view === 'se' ? 25.4 : 27.2;
  const haut = c.o.haut;
  let s = P(T, top);
  let inner = `<rect x="${shadeX}" y="30" width="12" height="22" fill="${topS}"/><path d="M12,46 Q24,49 36,46 L36,52 L12,52 Z" fill="${topS}"/>`
    + `<rect x="${r2(24 - 8.6 * w)}" y="34" width="1.3" height="10" rx="0.6" fill="${topH}"/>`;
  if (haut === 'pull') inner += `<rect x="10" y="44.6" width="28" height="2" fill="${topS}"/>` + [17, 20, 23, 26, 29, 32].map(x => L([x, 44.8], [x, 46.6], tone(top, 0.7), 0.4)).join('');
  if (haut === 'veste' && view !== 'ne') {
    const o = view === 'se' ? 21.6 : 24;
    inner += `<path d="M${o - 3.4},31.6 L${o + 3.4},31.6 L${o + 3},49 L${o - 3},49 Z" fill="${c.tee}"/>` + L([o - 3.3, 32], [o - 2.9, 48.8], OUT, 0.8) + L([o + 3.3, 32], [o + 2.9, 48.8], OUT, 0.8);
  }
  s += clip(`${c.uid}t`, T, inner) + P(T, 'none');
  if (view === 'ne') {
    s += P('M24,33.8 L24,47.4', 'none', 0.5);
    if (haut === 'chemise' || haut === 'veste') s += P('M17.6,31.4 Q24,34.4 30.4,31.4 L30,33.6 Q24,36.2 18,33.6 Z', topS, 0.8);
    return s;
  }
  const o = view === 'se' ? 21.6 : 24;
  if (haut === 'chemise') {
    s += P(`M${o - 4.6},31.2 L${o},34.8 L${o - 1.6},36.4 Z`, '#FFFDF6', 0.8) + P(`M${o + 4.6},31.2 L${o},34.8 L${o + 1.6},36.4 Z`, '#FFFDF6', 0.8);
    s += L([o, 35], [o + (view === 'se' ? -0.4 : 0), 47.6], OUT, 0.6) + [38.4, 41.8, 45].map(y => E(o + 1, y, 0.55, 0.55, '#FFFDF6', 0.5)).join('');
  } else if (haut === 'pull') {
    s += P(`M${o - 4},31.4 Q${o},34.6 ${o + 4},31.4 L${o + 4},32.8 Q${o},36 ${o - 4},32.8 Z`, topS, 0.8);
  } else if (haut === 'veste') {
    s += P(`M${o - 3.4},31.6 L${o - 1.2},36.4 L${o - 4.6},34 Z`, topS, 0.8) + P(`M${o + 3.4},31.6 L${o + 1.2},36.4 L${o + 4.6},34 Z`, topS, 0.8);
  } else {
    s += P(`M${o - 3.2},31.4 Q${o},34.4 ${o + 3.2},31.4`, 'none', 0.8);
  }
  return s;
}

function neck(c, { view }) {
  if (c.o.accessoire !== 'foulard') return '';
  if (view === 'ne') return P('M16.8,31 Q24,34.4 31.2,31 L31.6,33.6 Q24,37 16.4,33.6 Z', c.acc);
  const kx = view === 'se' ? 18.6 : 20.8;
  return P('M16.8,31 Q24,34.6 31.2,31 L31.6,33.6 Q24,37.4 16.4,33.6 Z', c.acc) + P(`M${kx},35 L${kx - 1.6},40.4 L${kx + 1.4},39.8 L${kx + 1.6},35.6 Z`, c.acc) + E(kx + 0.6, 35.4, 1.7, 1.3, tone(c.acc, 0.8), 0.9);
}

// ---- les gestes ----
// Le Grimoire tenu ouvert contre soi (lire) : couverture brune, pages claires
function book(x, y) {
  return P(`M${x - 6},${y} L${x + 6},${y} L${x + 6},${y + 6.4} L${x - 6},${y + 6.4} Z`, '#7A4E2C', 0.9)
    + P(`M${x - 5.2},${y - 0.6} Q${x - 2.6},${y - 1.6} ${x},${y} Q${x + 2.6},${y - 1.6} ${x + 5.2},${y - 0.6} L${x + 5.2},${y + 5.4} Q${x + 2.6},${y + 4.6} ${x},${y + 5.8} Q${x - 2.6},${y + 4.6} ${x - 5.2},${y + 5.4} Z`, '#FBF4E2', 0.8)
    + L([x, y], [x, y + 5.8], OUT, 0.6) + [1.6, 2.8, 4].map(d => L([x - 4.2, y + d], [x - 1.2, y + d], '#C9B98F', 0.45) + L([x + 1.2, y + d], [x + 4.2, y + d], '#C9B98F', 0.45)).join('');
}

function pose({ pose, n, view }) {
  const w = this.w;
  const shL = [24 - 8 * w, 34], shR = [24 + 8 * w, 34];
  if (pose === 'salut') return { open: true, right: arm(this, shR, n === 0 ? [37.4 + (w - 1) * 6, 25.4] : [38.8 + (w - 1) * 6, 27.4]) };
  if (this.geste === 'grelotter') {
    // bras croisés, les mains sur les bras ; il tremble (un demi-pixel d'une image à l'autre)
    const d = n ? 0.5 : -0.5;
    const left = arm(this, shL, [27.4 + d, 38.6], [19 + d, 41]);
    const right = arm(this, shR, [20.6 + d, 38.2], [29 + d, 40.6]);
    return { expr: 'triste', left: '', right: '', over: left + right };
  }
  if (this.geste === 'lire') {
    const left = arm(this, shL, [19.6, 41.4], [15.6, 41.4]);
    const right = arm(this, shR, [28.4, 41.4], [32.4, 41.4]);
    return { expr: n ? 'surpris' : 'neutre', left: '', right: '', over: book(24, 37.4) + left + right };
  }
  // ramasser (trois quarts avant) : le bras de devant descend vers le sol, la main ouverte, la tête suit
  const reach = n ? [13.2, 50.4] : [14.4, 47];
  return { expr: 'content', left: arm(this, shL, reach, [14.2, 40.6]) };
}

// ---- l'avatar ----
function avatar(choix = {}, opts = {}) {
  const o = { ...DEFAUT, ...choix };
  for (const [k, v] of Object.entries(o)) if (CHOIX[k] && !(v in CHOIX[k])) throw new Error(`choix inconnu : ${k} = ${v}`);
  const skin = CHOIX.peau[o.peau];
  const hair = CHOIX.cheveux[o.cheveux];
  const top = CHOIX.couleurHaut[o.couleurHaut];
  const bas = CHOIX.couleurBas[o.couleurBas];
  const shoe = CHOIX.chaussures[o.chaussures];
  const w = { fine: 0.9, moyenne: 1, large: 1.16 }[o.silhouette];
  const legSpread = (w - 1) * 3;
  const veste = o.haut === 'veste';
  const c = {
    name: 'Avatar', uid: opts.uid || 'av', o, w, geste: opts.geste,
    skin, skinS: tone(skin, 0.88),
    hair, hairS: tone(hair, 0.74), hairH: tone(hair, 1.32), buzz: mix(hair, skin, 0.38), buzzS: tone(mix(hair, skin, 0.38), 0.78), tie: o.cheveux === 'roux' ? '#3E5A8C' : '#C8463A',
    eye: CHOIX.yeux[o.yeux], cheek: o.joues === 'roses' ? '#F29E9A' : tone('#F29E9A', 1.18), freckle: tone(skin, 0.7),
    top, topS: tone(top, 0.82), topH: tone(top, 1.28), tee: '#F4EEDF',
    acc: o.accessoire === 'bonnet' ? '#4F5A72' : o.accessoire === 'casquette' ? '#3E78C8' : o.accessoire === 'bandana' ? '#C8463A' : o.accessoire === 'foulard' ? '#E8C46A' : null,
    sleeve: top, cuff: o.haut === 'pull' ? tone(top, 0.82) : o.haut === 'chemise' ? '#FFFDF6' : null, armW: 3.8,
    sleeves: o.haut === 'tshirt' ? 'roll' : undefined, sleeveCut: 6.4,
    leg: bas, legS: tone(bas, 0.78), legW: 5.4 + (w - 1) * 2, hip: 44.5, ground: 56.5,
    shoe, shoeS: tone(shoe, 0.72), shoeH: tone(shoe, 1.25),
    legX: { front: [20.5 - legSpread, 27.5 + legSpread], se: [20 - legSpread, 27.6 + legSpread], ne: [21 - legSpread, 28 + legSpread] },
    shoulders: [[24 - 8 * w, 34], [24 + 8 * w, 34]], hands: [[24 - 9.8 * w, 45.2], [24 + 9.8 * w, 45.2]],
    backItems: (cc, ctx) => hairBehindBody(cc, ctx.view),
    body, neck, head: (cc, ctx) => head(cc, ctx), pose
  };
  if (veste) c.cuff = tone(top, 0.82);
  return c;
}

// Les chapeaux, la mer les a gardés : le naufragé n'a plus que ses lunettes, son foulard ou son bandana
const CHAPEAUX = new Set(['bonnet', 'paille', 'casquette']);
const sansChapeau = choix => (CHAPEAUX.has(choix.accessoire) ? { ...choix, accessoire: 'aucun' } : choix);

// Couleur délavée par la mer (même formule que design/atelier/naufrage.js)
const delave = (c, k = 1) => { const [h, s, l] = hsl(c); return hex([h, s * (1 - 0.45 * k), l + (0.74 - l) * 0.26 * k]); };

// Le même avatar au petit format du jeu : le « look » de src/world/villagers.js (villagerSprite). Les formes du haut
// (t-shirt, pull, chemise, veste) et la couleur des yeux ne se voient qu'au grand format ; tout le reste se retrouve.
function lookPetit(choix = {}, { naufrage = false } = {}) {
  const o = { ...DEFAUT, ...(naufrage ? sansChapeau(choix) : choix) };
  const f = c => (naufrage ? delave(c) : c);
  const look = {
    skin: CHOIX.peau[o.peau], hair: CHOIX.cheveux[o.cheveux],
    style: { courte: 'short', longue: 'long', chignon: 'bun', bouclee: 'curly', queue: 'ponytail', tresses: 'braids', rasee: 'bald' }[o.coupe],
    top: f(CHOIX.couleurHaut[o.couleurHaut]), bottom: f(CHOIX.couleurBas[o.couleurBas]), shoes: CHOIX.chaussures[o.chaussures],
    build: o.silhouette === 'large' ? 'broad' : 'slim', shape: o.silhouette === 'fine' ? { width: 8.2 } : undefined,
    freckles: o.rousseur === 'oui', blush: o.joues === 'roses',
    glasses: o.accessoire === 'lunettes',
    hat: { bonnet: 'beanie', paille: 'straw', casquette: 'cap', bandana: 'scarf' }[o.accessoire] || null,
    neckerchief: o.accessoire === 'foulard' ? f('#E8C46A') : null,
    tool: null
  };
  if (naufrage) Object.assign(look, { barefoot: true, castaway: { sail: null, weed: true, bandage: false } });
  return look;
}

module.exports = { avatar, lookPetit, sansChapeau, CHOIX, LIBELLES, libelle, DEFAUT, tone, delave };
