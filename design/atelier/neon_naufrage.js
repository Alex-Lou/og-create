// Le naufrage en néon, d'une traite (choix de l'auteur, 18 oct. : « refais toute la vidéo d'une traite » ; la vague
// coupait la scène et changeait de texture, elle ressemblait à une baleine, il n'y avait aucune couleur, la profondeur
// n'y était pas ; « réinvente la scène, quitte à la changer »). Une seule scène, du pont jusqu'au noir, dans une seule
// matière : le papier néon des images clés (neon_cles.js) : du noir en fond, des couches de papier sombres, saturées,
// cernées d'un liseré de lumière ; des tracés lumineux qui dessinent les formes puis se transforment.
//   0. le crépuscule : un trait de lumière trace l'horizon ; le ciel s'allume (indigo, pourpre, magenta, corail) ; le
//      soleil de papier, ses anneaux ; la mer en six couches, des crêtes pâles du large aux vagues noires du premier
//      plan ; L'Hirondelle arrive, entière ; des spirales de lumière tournent dans le ciel ;
//   1-3. l'annonce du capitaine (le pavillon du gramophone, bref) ; l'orage : les nuages roulent (des éclairs de chaleur
//      dedans, leurs volutes qui tournent), la pluie sur trois profondeurs et ses éclaboussures, l'écume qui naît et
//      s'efface sur les crêtes ; un œil de tempête
//      s'ouvre dans le ciel et tourne (les anneaux du tunnel) ; les racines frappent ; le mur d'eau se lève au loin ;
//   4. la lame : un mur de filets d'eau sur toute la largeur, sa lèvre qui s'enroule, ses griffes d'écume ; elle
//      s'abat : l'eau passe sur nous, tout bouillonne ;
//   5. sous la surface : la lumière d'en haut, ses rayons ; les bulles ; le navire qui coule ; les racines lumineuses
//      qui montent de l'abîme ;
//   6. le noir : la nuit des profondeurs couvre le navire, puis tout.
// Les pièces du récit (le navire, ses passagers, le canot, les coups, le gramophone) et leurs mouvements sont ceux de
// 01_pont (theatre_pont.js), passés dans la palette néon ; le décor est neuf.
const { hash, f } = require('./ouverture');
const { courbe } = require('./papier');
const { atelier, gravure, avecStyle } = require('./gravure');
const TP = require('./theatre_pont');
const { parTemps, balance, secoue, bouffees, REPERES, MARGE, G, D_ } = TP;
const { neon } = require('./neon_pont');

// ——— la palette, la matière ———
const NOIR = '#03020A', ENCRE = '#0A0418', CYAN = '#5CF2E6', ACIDE = '#D4FF7A', MAGENTA = '#FF3FA8', CORAIL = '#FF6A4A', ORANGE = '#FFA040', VIOLET = '#9A5AF0';
const NUIT = { papier: false, modele: '#06020F', reflet: '#C8FFF4', hachures: 0.35, lisere: null };
const plein = peinture => `<rect x="${G - 60}" y="${G - 60}" width="${D_ - G + 120}" height="${D_ - G + 120}" fill="${peinture}"/>`;
const chemin = (pts, ferme) => `M${pts.map(([x, y]) => `${f(x)},${f(y)}`).join(' L')}${ferme ? ' Z' : ''}`;
const melange = (a, b, k) => '#' + [0, 2, 4].map(i => Math.round(parseInt(a.slice(1 + i, 3 + i), 16) * (1 - k) + parseInt(b.slice(1 + i, 3 + i), 16) * k).toString(16).padStart(2, '0')).join('');
// un trait de lumière : un halo large et pâle, un trait vif, un cœur presque blanc
const lumineux = (d, c, w = 1.6, halo = 0.14) => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${f(w * 6)}" stroke-opacity="${halo}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${c}" stroke-width="${f(w * 2.4)}" stroke-opacity="${f(Math.min(1, halo * 2.2))}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${c}" stroke-width="${f(w)}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#FFFFFF" stroke-width="${f(w * 0.35)}" stroke-opacity="0.85" stroke-linecap="round" stroke-linejoin="round"/>`;
const etoiles = (n, seed, y0, y1) => Array.from({ length: n }, (_, i) => { const x = hash(i, seed) * 480 - 40, y = y0 + hash(i, seed + 1) * (y1 - y0), r = 0.4 + 1.4 * hash(i, seed + 2) ** 3; return `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="${hash(i, seed + 3) < 0.7 ? '#F0F6FF' : hash(i, seed + 3) < 0.85 ? ACIDE : '#FFB8E8'}" opacity="${f(0.4 + 0.6 * hash(i, seed + 4))}"/>`; }).join('');
const rayons = (A, [x, y], n, R, c, op, seed, a0 = 0, a1 = Math.PI * 2) => Array.from({ length: n }, (_, i) => { const a = a0 + ((i + 0.5) / n) * (a1 - a0) + (hash(i, seed) - 0.5) * 0.2, w = 0.02 + 0.045 * hash(i, seed + 1); return `<path d="M${x},${y} L${f(x + R * Math.cos(a - w))},${f(y + R * Math.sin(a - w))} L${f(x + R * Math.cos(a + w))},${f(y + R * Math.sin(a + w))} Z" fill="${A.rad([[0, c, op * (0.5 + 0.5 * hash(i, seed + 2))], [1, c, 0]], x, y, R)}"/>`; }).join('');
// (une pièce en papier néon : sans taches de vieux papier, le modelé dans la nuit, des hachures légères)
const enNeon = dessin => avecStyle(NUIT, dessin);

// ——— le ciel ———
// le crépuscule : de l'indigo en haut au corail sur l'horizon, une floraison magenta autour du soleil
const HORIZON = 206, SOLEIL = [96, 150];
function ciel(p) {
  const A = atelier(`${p}C`);
  return A.out(plein(A.lin([[0, '#03021A'], [0.3, '#140846'], [0.55, '#4A127E'], [0.75, '#B0287E'], [0.88, '#FF4F78'], [0.96, '#FF8A50'], [1, '#FFC070']], 0, G, 0, HORIZON + 6))
    + plein(A.rad([[0, '#FF6AA0', 0.55], [0.4, '#FF3FA8', 0.22], [1, '#FF3FA8', 0]], SOLEIL[0], SOLEIL[1], 260)));
}
// la nuit d'orage : noire en haut, violette, une lueur magenta basse sur l'horizon
function cielNuit(p) {
  const A = atelier(`${p}N`);
  return A.out(plein(A.lin([[0, NOIR], [0.45, '#0C0428'], [0.8, '#2A0A50'], [0.94, '#6A1470'], [1, '#A01E78']], 0, G, 0, HORIZON + 6)));
}
const etoilesCiel = p => { const A = atelier(`${p}E`); return A.out(etoiles(90, 31, G, 150)); };
// le soleil de papier : un cœur blanc et vert acide, des anneaux festonnés orange, corail, magenta, violet, chacun
// éclairé au bord intérieur ; des rayons pâles
function soleil(p) {
  const A = atelier(`${p}S`), [x, y] = SOLEIL;
  let s = rayons(A, SOLEIL, 26, 200, '#FFE0B0', 0.22, 7);
  const anneaux = [[78, '#5A1488', VIOLET], [62, '#B0207E', MAGENTA], [48, '#F0445A', CORAIL], [36, '#FF8A3A', ORANGE]];
  anneaux.forEach(([r, c, lum], i) => {
    const n = 14 + i * 2, bord = courbe(t => { const a = t * Math.PI * 2, q = (t * n) % 1; const rr = r * (1 + 0.07 * Math.sin(Math.PI * q) ** 2); return [x + rr * Math.cos(a), y + rr * Math.sin(a)]; }, n * 10);
    s += `<path d="${chemin(bord, true)}" fill="${A.rad([[0, melange(c, '#FFFFFF', 0.25)], [0.8, c], [1, melange(c, NOIR, 0.35)]], x, y, r * 1.07)}" stroke="${ENCRE}" stroke-width="1.6"/>` + lumineux(chemin(bord, true), lum, 0.5, 0.06);
  });
  s += `<circle cx="${x}" cy="${y}" r="26" fill="${A.rad([[0, '#FFFFFF'], [0.45, '#FFFDE0'], [0.8, ACIDE], [1, '#FFD060']], x, y, 26)}" stroke="${ENCRE}" stroke-width="1.4"/>`;
  return A.out(s);
}
// une strate de nuages au loin, sur l'horizon : éclairée par en dessous (la lumière du couchant, puis de l'orage)
function strate(p, i, y, lum) {
  const A = atelier(`${p}T${i}`), bord = courbe(t => [G - 100 + (D_ - G + 200) * t, y + 4 * Math.sin(t * 13 + i) + 2.5 * Math.sin(t * 37 + i * 2)], 90);
  return A.out(`<path d="${chemin([[G - 100, y - 18], [D_ + 100, y - 18], ...bord.slice().reverse()], true)}" fill="${A.lin([[0, '#0A0626', 0], [0.6, '#2A0E5A', 0.75], [1, '#4A1A7A', 0.95]], 0, y - 18, 0, y)}"/>` + lumineux(chemin(bord), lum, 0.5, 0.08));
}
// un banc de nuages d'orage, en haut du ciel : du papier violet, noir vers le haut, son bord festonné cerné de lumière
function orage(p, i, y, a, couleur, lum) {
  const A = atelier(`${p}O${i}`), n = 5 + i * 2;
  const bord = courbe(t => { const x = G - 120 + (D_ - G + 240) * t, q = (t * n + i * 0.37) % 1; return [x, y + a * Math.sin(Math.PI * q) ** 0.7 + 3 * Math.sin(t * 41)]; }, n * 18);
  let s = gravure(A, [[G - 120, G - 160], [D_ + 120, G - 160], ...bord.slice().reverse()], A.lin([[0, NOIR], [0.6, melange(couleur, NOIR, 0.4)], [1, couleur]], 0, y - 60, 0, y + a), { seed: 1600 + i, amp: 0.4, angle: 20, pas: 3.2, tailles: 1, trait: 1.8, portee: 0.5, lumiere: [0, 1] });
  return A.out(s + lumineux(chemin(bord), lum, 0.7, 0.1));
}
// l'œil de la tempête : des anneaux de nuages qui tournent autour d'un cœur de lumière (le tunnel) ; chaque anneau,
// une pièce : un trou festonné, éclairé à son bord dans la lumière du cœur, qui plonge vite dans le violet
const OEIL = [200, 40], N_OEIL = 5, R_OEIL = [26, 58, 100, 156, 226, 320];
function anneauOeil(p, i) {
  const A = atelier(`${p}A${i}`), [cx, cy] = OEIL, r = R_OEIL[i], R = R_OEIL[i + 1] * 1.08, k = i / (N_OEIL - 1), n = 9 + i * 2;
  const bord = courbe(t => { const a = t * Math.PI * 2 + i, q = (t * n) % 1, b = Math.sin(Math.PI * q) ** 1.5; return [cx + r * (1 - 0.14 * b) * Math.cos(a), cy + r * (1 - 0.14 * b) * Math.sin(a)]; }, n * 20);
  const lit = melange(ACIDE, CYAN, Math.min(1, k * 2.2)), corps = melange('#4A1AA0', '#2A0A60', k), nuit = melange('#14063A', '#06020F', k);
  const dehors = courbe(t => [cx + R * Math.cos(t * Math.PI * 2), cy + R * Math.sin(t * Math.PI * 2)], 60);
  const pos = v => f(Math.min(1, v / R));
  return A.out(`<path d="${chemin(dehors, true)} ${chemin(bord, true)}" fill-rule="evenodd" fill="${A.rad([[pos(r * 0.85), melange(lit, '#FFFFFF', 0.2)], [pos(r + (R - r) * 0.1), corps], [pos(r + (R - r) * 0.55), nuit], [0.9, nuit, 0.85], [1, nuit, 0]], cx, cy, R)}"/>`
    + `<path d="${chemin(bord, true)}" fill="none" stroke="${ENCRE}" stroke-width="${f(1.6 + k * 1.4)}" stroke-linejoin="round"/>` + lumineux(chemin(bord, true), lit, 0.6 + k * 0.4, 0.07));
}
const coeurOeil = p => { const A = atelier(`${p}K`), [x, y] = OEIL; return A.out(`<circle cx="${x}" cy="${y}" r="60" fill="${A.rad([[0, '#FFFFFF', 1], [0.15, '#F6FFD8', 1], [0.35, ACIDE, 0.75], [0.6, '#3EE8B0', 0.3], [1, '#3EE8B0', 0]], x, y, 60)}"/>` + rayons(A, OEIL, 18, 46, '#FFFFF0', 0.5, 15)); };
// la foudre : un éclat vert acide, son halo
const FOUDRE = [[96, -20], [84, 40], [104, 52], [72, 120], [94, 128], [58, 206]];
const foudre = p => { const A = atelier(`${p}F`); return A.out(lumineux(chemin(FOUDRE), ACIDE, 2.4, 0.28) + lumineux('M84,40 L60,70 L66,84', ACIDE, 1, 0.2) + lumineux('M72,120 L100,150', ACIDE, 0.9, 0.2)); };
const brumeLoin = p => { const A = atelier(`${p}B`); return A.out(plein(A.lin([[0, '#7A3ABA', 0], [0.5, '#9A4ACA', 0.4], [1, '#3A1A6A', 0]], 0, HORIZON - 40, 0, HORIZON + 30))); };

// ——— la mer : six couches, du large (pâles, dans la lumière de l'horizon) au premier plan (noires, saturées) ———
// chaque crête faite de houles inégales, leur pointe qui penche, son liseré de lumière
const MERS = [[HORIZON + 4, 4, 34, ['#3E8AB8', '#1E4A7A', '#0E2A4A'], '#FFB8D8'], [HORIZON + 18, 6, 46, ['#1E7A98', '#0E3A5A', '#082238'], '#B8FFF0'], [HORIZON + 38, 9, 62, ['#0E6A78', '#0A3A4A', '#041C26'], CYAN], [HORIZON + 66, 13, 84, ['#0A4A5A', '#06242E', '#020E14'], CYAN], [HORIZON + 104, 18, 110, ['#08323E', '#03141C', '#01080C'], '#3EC8E8'], [HORIZON + 152, 24, 140, ['#062430', '#020A10', NOIR], '#2AA8D8']];
function vague(p, i) {
  const A = atelier(`${p}M${i}`), [y, h, l, couleurs, lum] = MERS[i], pts = [];
  for (let x = G - 140 - l; x < D_ + 140 + l; x += l) {
    const w = l * (0.8 + 0.4 * hash(Math.round(x), i)), hh = h * (0.7 + 0.6 * hash(Math.round(x), i + 3));
    for (let j = 0; j <= 14; j++) { const t = j / 14; pts.push([x + w * t, y - hh * Math.sin(Math.PI * t) ** 1.4 + (t > 0.62 ? (t - 0.62) * hh * 0.9 : 0)]); }
  }
  const crete = pts.filter(([x]) => x > G - 140 && x < D_ + 140);
  let s = gravure(A, [...crete, [D_ + 140, D_ + 160], [G - 140, D_ + 160]], A.lin([[0, couleurs[0]], [0.35, couleurs[1]], [1, couleurs[2]]], 0, y - h, 0, y + 90), { seed: 1200 + i, amp: 0.2, angle: 6, pas: 3, ombre: 0.35, tailles: 1, tailleP: 4, trait: 1.4 + i * 0.3, portee: 0.55, dy: 5, lumiere: [0, -1] });
  s += lumineux(chemin(crete), lum, 0.5 + i * 0.25, 0.09);
  // (des reflets de lumière sur le dos des vagues, de plus en plus rares vers nous)
  for (let k = 0; k < 9 - i; k++) { const x = G + hash(k, 90 + i) * (D_ - G), yy = y + 8 + hash(k, 91 + i) * (24 + i * 10), w = 8 + 14 * hash(k, 92 + i); s += lumineux(`M${f(x)},${f(yy)} q${f(w / 2)},-3 ${f(w)},0`, i < 2 ? '#FFB8D8' : CYAN, 0.4 + i * 0.1, 0.06); }
  return A.out(s);
}
// la houle du premier plan : une grande vague noire, tout près, qui monte et descend devant tout
function houle(p) {
  const A = atelier(`${p}H`), y = 372;
  const crete = courbe(t => { const x = G - 100 + (D_ - G + 200) * t; return [x, y - 20 * Math.sin(Math.PI * 2 * (x / 230) + 0.6) - 8 * Math.sin(Math.PI * 2 * (x / 97))]; }, 90);
  return A.out(gravure(A, [...crete, [D_ + 100, D_ + 100], [G - 100, D_ + 100]], A.lin([[0, '#0A3A50'], [0.3, '#04182A'], [1, NOIR]], 0, y - 28, 0, y + 70), { seed: 1500, amp: 0.3, angle: 6, pas: 3.2, ombre: 0.35, tailles: 1, tailleP: 5, trait: 2.6, portee: 0.6, dy: 6, lumiere: [0, -1] }) + lumineux(chemin(crete), CYAN, 1.4, 0.12));
}
// la pluie tout près de nous : de longs traits cyan (une bande qu'on fait tomber en boucle)
const pluie = p => { const A = atelier(`${p}R`); return A.out(Array.from({ length: 34 }, (_, i) => { const x = G + hash(i, 81) * (D_ - G + 60), y = G - 200 + hash(i, 82) * 800, l = 30 + 30 * hash(i, 83); return `<path d="M${f(x)},${f(y)} l${f(-l * 0.28)},${f(l)}" stroke="#9AFAF0" stroke-width="${f(1 + 1.4 * hash(i, 84))}" stroke-linecap="round" opacity="${f(0.25 + 0.35 * hash(i, 85))}"/>`; }).join('')); };
// les embruns, tout près : des gouttes lumineuses
const embruns = (p, i) => { const A = atelier(`${p}Y${i}`); return A.out(Array.from({ length: 22 }, (_, k) => { const x = G + hash(k, 140 + i) * (D_ - G), y = 260 + hash(k, 141 + i) * 160, r = 1 + 3.5 * hash(k, 142 + i) ** 2; return `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r * 2.6)}" fill="${CYAN}" opacity="0.1"/><circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="#E8FFFA" opacity="${f(0.5 + 0.5 * hash(k, 143 + i))}"/>`; }).join('')); };

// ——— la lame : un mur d'eau sur toute la largeur, fait de filets ———
// son dos monte du large ; ses filets d'eau, lumineux, suivent le courant et s'enroulent vers la lèvre ; elle est
// translucide en haut (le ciel d'orage passe au travers), noire en bas. Pas une masse ronde : une paroi qui déferle
const dosLame = x => 40 + 40 * ((x - 120) / 400) ** 2 + 10 * Math.sin(x / 31) + 5 * Math.sin(x / 11);
function lame(p) {
  const A = atelier(`${p}L`), haut = courbe(t => { const x = G - 100 + (D_ - G + 200) * t; return [x, dosLame(x)]; }, 120);
  let s = `<path d="${chemin([...haut, [D_ + 100, 400], [G - 100, 400]], true)}" fill="${A.lin([[0, '#5CF2E6', 0.55], [0.12, '#1AA8B8', 0.8], [0.4, '#0A4A6A', 0.95], [0.75, '#062033'], [1, '#020A12']], 0, 20, 0, 400)}"/>`;
  // (les filets : des courbes qui montent en s'inclinant vers la droite et se recourbent sous la lèvre)
  for (let k = 0; k < 34; k++) {
    const x0 = G - 100 + ((k + 0.5) / 34) * (D_ - G + 200) + (hash(k, 7) - 0.5) * 14, top = dosLame(x0 + 30) + 6, h = 380 - top;
    const d = chemin(courbe(t => [x0 + 34 * t ** 2 + 8 * Math.sin(t * 6 + k), 380 - h * t * (0.75 + 0.25 * hash(k, 8))], 18));
    s += lumineux(d, k % 5 === 2 ? MAGENTA : k % 3 ? CYAN : '#9AFFF0', 0.35 + 0.35 * hash(k, 9), 0.05);
  }
  // (des remous, ici et là : de petites volutes de lumière)
  for (let k = 0; k < 10; k++) { const x = G + hash(k, 11) * (D_ - G), y = 120 + hash(k, 12) * 200, r = 6 + 8 * hash(k, 13); s += lumineux(chemin(courbe(t => [x + r * (1 - t * 0.6) * Math.cos(t * 7), y + r * (1 - t * 0.6) * Math.sin(t * 7) * 0.7], 20)), '#9AFFF0', 0.4, 0.05); }
  s += lumineux(chemin(haut), '#E8FFFA', 1.2, 0.14);
  return A.out(s);
}
// la lèvre de la lame, une pose (k de 0 à 1 : papier découpé remplacé à chaque image) : au repos, une frange d'écume
// sur la crête ; puis la crête se recourbe vers nous et retombe sur la paroi : la lèvre descend, s'épaissit, l'ombre du
// creux sous elle, ses griffes d'écume qui pendent et s'allongent
function levre(p, k) {
  const A = atelier(`${p}V${Math.round(k * 10)}`), xs = courbe(t => G - 100 + (D_ - G + 200) * t, 70);
  const dos = xs.map(x => [x, dosLame(x) + 2]);
  const bout = xs.map((x, i) => [x + 20 * k, dosLame(x) - 14 + 84 * k + 10 * k * Math.sin(x / 37 + 1) - 3 * hash(i, 5)]);
  const haut = xs.map((x, i) => [x + 10 * k, dosLame(x) - 10 - 26 * Math.sin(Math.PI * Math.min(1, k * 1.4)) - 2 * hash(i, 6)]);
  let s = '';
  // (l'ombre du creux, sous la lèvre)
  if (k > 0) s += `<path d="${chemin([...bout, ...bout.slice().reverse().map(([x, y]) => [x - 6, y + 40 * k])], true)}" fill="${A.lin([[0, '#021420', 0.6], [1, '#021420', 0]], 0, 50 + 84 * k, 0, 50 + 124 * k)}"/>`;
  // (la lèvre : du dos à son bout, en passant par son sommet ; écume en haut, l'eau verte et cyan dessous)
  s += `<path d="${chemin([...dos, ...haut.slice().reverse()], true)}" fill="${A.lin([[0, '#E8FFFA', 0.95], [1, '#5CF2E6', 0.9]], 0, 0, 0, 90)}"/>`;
  if (k > 0) s += `<path d="${chemin([...haut, ...bout.slice().reverse()], true)}" fill="${A.lin([[0, '#F0FFFC', 0.97], [0.35, '#8AFAF0', 0.95], [1, '#1AB8C8', 0.95]], 0, 10, 0, 50 + 84 * k)}"/>`;
  s += lumineux(chemin(haut), '#FFFFFF', 1.3, 0.18);
  if (k > 0) s += lumineux(chemin(bout), '#E8FFFA', 0.9 + 0.6 * k, 0.14);
  // (les filets de la lèvre, qui suivent son enroulement)
  if (k > 0) for (let i = 0; i < 70; i += 5) { const [x0, y0] = haut[i], [x1, y1] = bout[i]; s += lumineux(`M${f(x0)},${f(y0)} Q${f(x0 + 18 * k)},${f((y0 + y1) / 2)} ${f(x1)},${f(y1)}`, CYAN, 0.4, 0.06); }
  // (les griffes d'écume : des doigts recourbés, qui pendent du bout de la lèvre)
  for (let i = 0; i < 26; i++) {
    const j = Math.min(69, Math.round((i + 0.3 * hash(i, 3)) * 70 / 26)), [x, y] = k > 0 ? bout[j] : haut[j], l = (8 + 16 * hash(i, 4)) * (0.6 + k);
    s += lumineux(chemin(courbe(t => [x + l * 0.5 * t, y + (k > 0 ? 1 : -0.6) * l * t * t * 1.1 - l * 0.3 * t], 8)), i % 4 ? '#E8FFFA' : ACIDE, 0.6 + 0.5 * hash(i, 6), 0.12);
  }
  // (et les gouttes arrachées par le vent)
  s += Array.from({ length: 30 }, (_, i) => { const x = G + hash(i, 21) * (D_ - G), y = dosLame(x) - 30 - 40 * hash(i, 22) - 20 * k; return `<circle cx="${f(x)}" cy="${f(y)}" r="${f(0.8 + 2 * hash(i, 23))}" fill="#E8FFFA" opacity="${f(0.5 + 0.5 * hash(i, 24))}"/>`; }).join('');
  return A.out(s);
}
// l'eau qui passe sur nous : un rideau de filets qui tombe, son bord d'écume en tête, puis l'eau qui bouillonne
function rideau(p) {
  const A = atelier(`${p}D`), bas = courbe(t => { const x = G - 60 + (D_ - G + 120) * t; return [x, 430 + 16 * Math.sin(t * 17) + 9 * Math.sin(t * 43)]; }, 90);
  let s = `<path d="${chemin([[G - 60, -480], [D_ + 60, -480], ...bas.slice().reverse()], true)}" fill="${A.lin([[0, '#020A18'], [0.5, '#052A44'], [0.82, '#0A5A78'], [0.95, '#3ADAD8'], [1, '#E8FFFA']], 0, -480, 0, 440)}"/>`;
  for (let k = 0; k < 40; k++) { const x0 = G - 60 + hash(k, 31) * (D_ - G + 120), y0 = -480 + hash(k, 32) * 760, l = 120 + 200 * hash(k, 33); s += lumineux(chemin(courbe(t => [x0 + 10 * Math.sin(t * 5 + k), y0 + l * t], 10)), k % 5 === 1 ? MAGENTA : k % 4 ? CYAN : '#E8FFFA', 0.4 + 0.5 * hash(k, 34), 0.05); }
  // (les bulles prises dans l'eau)
  s += Array.from({ length: 40 }, (_, k) => { const x = G + hash(k, 38) * (D_ - G), y = -60 + hash(k, 39) * 480, r = 1.5 + 7 * hash(k, 40) ** 2; return `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="${CYAN}" fill-opacity="0.12" stroke="#E8FFFA" stroke-width="${f(0.6 + r * 0.12)}" stroke-opacity="0.8"/>`; }).join('');
  for (let k = 0; k < 30; k++) { const [x, y] = bas[Math.floor(hash(k, 35) * bas.length)], l = 14 + 20 * hash(k, 36); s += lumineux(chemin(courbe(t => [x + (hash(k, 37) - 0.5) * l * t, y - 6 + l * t * t], 6)), '#FFFFFF', 0.8, 0.14); }
  s += lumineux(chemin(bas), '#FFFFFF', 1.6, 0.2);
  return A.out(s);
}
// des remous lumineux qui tourbillonnent dans l'eau qui nous a pris
const remous = (p, i) => { const A = atelier(`${p}W${i}`); return A.out(Array.from({ length: 9 }, (_, k) => { const x = G + hash(k, 50 + i) * (D_ - G), y = G + hash(k, 51 + i) * (D_ - G), r = 14 + 26 * hash(k, 52 + i), s = hash(k, 53 + i) < 0.5 ? 1 : -1; return lumineux(chemin(courbe(t => [x + r * (1 - t * 0.7) * Math.cos(s * t * 8), y + r * (1 - t * 0.7) * Math.sin(s * t * 8) * 0.8], 26)), [CYAN, '#E8FFFA', MAGENTA][(k + i) % 3], 0.7, 0.08); }).join('')); };

// ——— sous la surface ———
const abysse = p => { const A = atelier(`${p}Z`); return A.out(plein(A.lin([[0, '#0E7A8A'], [0.18, '#0A4A7A'], [0.5, '#140A4A'], [0.8, '#08041E'], [1, NOIR]], 0, G, 0, D_))); };
// le dessous de la surface : une nappe de lumière qui ondule, ses mailles ; et les rayons qui tombent
function surface(p) {
  const A = atelier(`${p}U`), y = 30, ligne = courbe(t => { const x = G - 80 + (D_ - G + 160) * t; return [x, y + 6 * Math.sin(t * 19) + 3 * Math.sin(t * 47)]; }, 120);
  let s = `<path d="${chemin([[G - 80, -260], [D_ + 80, -260], ...ligne.slice().reverse()], true)}" fill="${A.lin([[0, '#1AA8B8'], [0.85, '#5CF2E6'], [1, '#E8FFFA']], 0, -260, 0, y + 6)}"/>`;
  for (let k = 0; k < 24; k++) { const x = G - 60 + hash(k, 61) * (D_ - G + 120), yy = y - 20 - 200 * hash(k, 62), w = 20 + 30 * hash(k, 63); s += lumineux(chemin(courbe(t => [x + w * t, yy + 6 * Math.sin(t * 6 + k)], 8)), '#E8FFFA', 0.5, 0.08); }
  s += lumineux(chemin(ligne), '#FFFFFF', 1.4, 0.22);
  return A.out(s + rayons(A, [200, -60], 16, 560, '#B8FFF4', 0.22, 70, Math.PI * 0.22, Math.PI * 0.78));
}
// des bulles qui montent : des cercles cernés de lumière
const bulles = (p, i) => { const A = atelier(`${p}Q${i}`); return A.out(Array.from({ length: 16 }, (_, k) => { const x = G + 20 + hash(k, 70 + i) * (D_ - G - 40), y = 100 + hash(k, 71 + i) * 320, r = 1.5 + 6 * hash(k, 72 + i) ** 2; return `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="${CYAN}" fill-opacity="0.12" stroke="#E8FFFA" stroke-width="${f(0.6 + r * 0.12)}" stroke-opacity="0.85"/><circle cx="${f(x - r * 0.35)}" cy="${f(y - r * 0.35)}" r="${f(r * 0.25)}" fill="#FFFFFF" opacity="0.9"/>`; }).join('')); };

// ——— les racines : des bandes d'écorce noire et violette, épineuses, une veine de lumière au milieu ———
function racineNeon(p, id, p0, c1, c2, p3, w0, w1, couleurs, seed) {
  const A = atelier(`${p}${id}`);
  const bz = t => { const u = 1 - t; return [0, 1].map(j => u * u * u * p0[j] + 3 * u * u * t * c1[j] + 3 * u * t * t * c2[j] + t * t * t * p3[j]); };
  const at = t => { const [x, y] = bz(t), [x2, y2] = bz(Math.min(1, t + 0.01)), [x1, y1] = bz(Math.max(0, t - 0.01)), n = Math.hypot(x2 - x1, y2 - y1) || 1; return [x, y, -(y2 - y1) / n, (x2 - x1) / n]; };
  const larg = t => (w0 / 2) * (1 - t) + (w1 / 2) * t;
  const T = courbe(t => t, 40), g = T.map(t => { const [x, y, nx, ny] = at(t), w = larg(t); return [x + nx * w, y + ny * w]; }), d = T.map(t => { const [x, y, nx, ny] = at(t), w = larg(t); return [x - nx * w, y - ny * w]; });
  let s = gravure(A, [...g, ...d.slice().reverse()], A.lin([[0, couleurs[0]], [1, couleurs[1]]], ...p0, ...p3), { seed, amp: 0.6, angle: 50, pas: 2.4, ombre: 0.35, tailles: 2, tailleP: 4, trait: 2.4, portee: 0.6, dx: 4, dy: 5 });
  for (let k = 1; k < 10; k++) { const t = k / 10, [x, y, nx, ny] = at(t), w = larg(t); s += `<path d="M${f(x + nx * w)},${f(y + ny * w)} Q${f(x - ny * w * 0.4)},${f(y + nx * w * 0.4)} ${f(x - nx * w)},${f(y - ny * w)}" fill="none" stroke="${ENCRE}" stroke-width="${f(1 + w / 16)}" opacity="0.7"/>`; }
  for (let k = 1; k < 8; k++) { const t = k / 8, [x, y, nx, ny] = at(t), w = larg(t), c = k % 2 ? 1 : -1, l = 5 + w * 0.4; s += `<path d="M${f(x + c * nx * w - ny * 3)},${f(y + c * ny * w + nx * 3)} L${f(x + c * nx * (w + l) + ny * l * 0.4)},${f(y + c * ny * (w + l) - nx * l * 0.4)} L${f(x + c * nx * w + ny * 3)},${f(y + c * ny * w - nx * 3)} Z" fill="${couleurs[1]}" stroke="${ENCRE}" stroke-width="1.2" stroke-linejoin="round"/>`; }
  s += lumineux(chemin(courbe(t => t * 0.98, 30).map(t => at(t).slice(0, 2))), couleurs[2], 1 + w0 / 60, 0.14);
  for (let k = 1; k < 6; k++) { const t = (k / 6) * 0.9, [x, y, nx, ny] = at(t), w = larg(t) * 0.7, c = k % 2 ? 1 : -1; s += lumineux(`M${f(x)},${f(y)} q${f(c * nx * w * 0.6 + ny * w * 0.4)},${f(c * ny * w * 0.6 - nx * w * 0.4)} ${f(c * nx * w)},${f(c * ny * w)}`, couleurs[2], 0.6, 0.1); }
  return A.out(s);
}

// ——— ce qui bouge un peu partout (choix de l'auteur, 18 oct. : plus de spirales, de petits effets qui animent le
// ciel, la pluie, l'écume) ———
// une spirale de lumière, centrée en (x, y)
const boucle = (x, y, r, sens, tours = 1.8) => chemin(courbe(t => { const a = sens * t * tours * Math.PI * 2, rr = r * (1 - 0.85 * t); return [x + rr * Math.cos(a), y + rr * Math.sin(a)]; }, Math.round(tours * 24)));
// les spirales du ciel : [x, y, rayon, sens, couleur]
const SPIRALES = [[40, 40, 14, 1, MAGENTA], [332, 34, 13, 1, ACIDE], [372, 120, 10, -1, CYAN], [236, 112, 9, 1, '#FFB8D8']];
const spiraleCiel = (p, i) => { const [x, y, r, sens, c] = SPIRALES[i], A = atelier(`${p}s${i}`); return A.out(`<circle cx="${x}" cy="${y}" r="${f(r * 1.6)}" fill="${A.rad([[0, c, 0.22], [1, c, 0]], x, y, r * 1.6)}"/>` + lumineux(boucle(x, y, r, sens), c, 0.9, 0.14) + `<circle cx="${x}" cy="${y}" r="1.4" fill="#FFFFFF"/>`); };
// des scintillements dans le ciel : de petites étoiles à quatre branches
const scintilles = (p, i) => { const A = atelier(`${p}c${i}`); return A.out(Array.from({ length: 14 }, (_, k) => { const x = hash(k, 160 + i) * 440 - 20, y = hash(k, 161 + i) * 180, l = 2 + 4 * hash(k, 162 + i), c = [ACIDE, '#FFFFFF', '#FFB8E8', CYAN][k % 4]; return `<circle cx="${f(x)}" cy="${f(y)}" r="${f(l * 1.8)}" fill="${A.rad([[0, c, 0.35], [1, c, 0]], x, y, l * 1.8)}"/>` + lumineux(`M${f(x - l)},${f(y)} L${f(x + l)},${f(y)} M${f(x)},${f(y - l)} L${f(x)},${f(y + l)}`, c, 0.5, 0.1); }).join('')); };
// un éclair de chaleur dans les nuages : une lueur qui palpite
const LUEURS = [[80, 60, 110, MAGENTA], [310, 90, 120, CYAN]];
const lueurNuage = (p, i) => { const [x, y, r, c] = LUEURS[i], A = atelier(`${p}l${i}`); return A.out(`<circle cx="${x}" cy="${y}" r="${r}" fill="${A.rad([[0, '#FFFFFF', 0.5], [0.25, c, 0.45], [1, c, 0]], x, y, r)}"/>`); };
// une volute au bord d'un banc de nuages (elle tourne sur elle-même)
const voluteNuage = (i, y, a, lum) => [[70, 300, 160, 360][i], y + a * 0.55, 8 + i * 1.5, i % 2 ? 1 : -1, lum];
const voluteOrage = (p, i, y, a, lum) => { const [x, yy, r, sens] = voluteNuage(i, y, a, lum), A = atelier(`${p}v${i}`); return A.out(`<circle cx="${x}" cy="${yy}" r="${f(r * 1.2)}" fill="${A.rad([[0, '#2A0A60', 0.9], [1, '#2A0A60', 0]], x, yy, r * 1.2)}"/>` + lumineux(boucle(x, yy, r, sens, 2), lum, 0.8, 0.12)); };
// les crêtes d'une couche de mer (les mêmes que celles de vague()) : la pointe de chaque houle
function cretes(i) {
  const [y, h, l] = MERS[i], out = [];
  for (let x = G - 140 - l; x < D_ + 140 + l; x += l) { const w = l * (0.8 + 0.4 * hash(Math.round(x), i)), hh = h * (0.7 + 0.6 * hash(Math.round(x), i + 3)); out.push([x + w * 0.6, y - hh * 0.93 + 0.04 * hh, w]); }
  return out.filter(([x]) => x > G - 20 && x < D_ + 20);
}
// l'écume qui naît sur les crêtes : un trait d'écume qui coiffe la pointe, ses gouttes, une crête sur deux (pair : 0,
// impair : 1)
const ecume = (p, i, n) => { const A = atelier(`${p}e${i}${n}`); return A.out(cretes(i).filter((_, k) => k % 2 === n).map(([x, y, w], k) => { const l = w * 0.3; return lumineux(`M${f(x - l * 0.45)},${f(y + 1)} q${f(l * 0.45)},${f(-3 - i * 0.5)} ${f(l)},${f(2 + i * 0.6)}`, k % 3 ? '#E8FFFA' : CYAN, 0.45 + i * 0.13, 0.12) + [0, 1, 2].map(j => `<circle cx="${f(x - l * 0.3 + j * l * 0.35)}" cy="${f(y - 3 - i - 4 * hash(k, j + i))}" r="${f(0.6 + 0.3 * i * hash(j, k))}" fill="#E8FFFA"/>`).join(''); }).join('')); };
// les éclaboussures de la pluie sur la mer : de petites couronnes, sur une bande de profondeur
const GOUTTES = [[222, 262, 0.7], [270, 336, 1], [330, 410, 1.5]];
const gouttes = (p, j, n) => { const [y0, y1, k] = GOUTTES[j], A = atelier(`${p}g${j}${n}`); return A.out(Array.from({ length: 16 }, (_, q) => { const x = G + hash(q, 180 + j * 2 + n) * (D_ - G), y = y0 + hash(q, 181 + j * 2 + n) * (y1 - y0), r = 3 * k; return `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(r)}" ry="${f(r * 0.35)}" fill="none" stroke="#B8FFF4" stroke-width="${f(0.6 * k)}" opacity="0.85"/>` + lumineux(`M${f(x - r * 0.6)},${f(y - 1)} l${f(-r * 0.3)},${f(-r)} M${f(x)},${f(y - 1)} l0,${f(-r * 1.3)} M${f(x + r * 0.6)},${f(y - 1)} l${f(r * 0.3)},${f(-r)}`, '#E8FFFA', 0.35 * k, 0.1); }).join('')); };
// une étoile filante, au crépuscule : sa traîne, sa tête blanche
const FILANTES = [[300, 40], [150, 76]];
const filante = (p, i) => { const [x, y] = FILANTES[i], A = atelier(`${p}f${i}`); return A.out(`<path d="M${x},${y} L${x + 60},${y - 22} L${x + 60},${y - 18} Z" fill="${A.lin([[0, '#FFFFFF', 0.9], [1, '#FFB8E8', 0]], x, y, x + 60, y - 20)}"/>` + `<circle cx="${x}" cy="${y}" r="5" fill="${A.rad([[0, '#FFFFFF', 0.9], [1, ACIDE, 0]], x, y, 5)}"/><circle cx="${x}" cy="${y}" r="1.4" fill="#FFFFFF"/>`); };
// une rafale de vent, dans l'orage : de longs traits pâles qui filent
const rafale = (p, i) => { const A = atelier(`${p}w${i}`); return A.out(Array.from({ length: 6 }, (_, k) => { const x = hash(k, 200 + i) * 200, y = 40 + hash(k, 201 + i) * 330, l = 110 + 110 * hash(k, 202 + i); return lumineux(`M${f(x)},${f(y)} q${f(l / 2)},${f(-4 - 6 * hash(k, 203))} ${f(l)},${f(2)}`, k % 3 ? '#B8FFF4' : '#E0C8FF', 0.4 + 0.4 * hash(k, 204 + i), 0.06); }).join('')); };
// le plancton des profondeurs : des points de lumière qui dérivent
const plancton = (p, i) => { const A = atelier(`${p}k${i}`); return A.out(Array.from({ length: 26 }, (_, k) => { const x = hash(k, 210 + i) * 440 - 20, y = 60 + hash(k, 211 + i) * 380, r = 0.8 + 1.6 * hash(k, 212 + i) ** 2, c = [CYAN, ACIDE, '#FF8AD0', '#E8FFFA'][k % 4]; return `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r * 4)}" fill="${A.rad([[0, c, 0.35], [1, c, 0]], x, y, r * 4)}"/><circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="${c}"/>`; }).join('')); };
// la pluie du lointain : des traits fins et pâles, derrière le navire
const pluieLoin = p => { const A = atelier(`${p}r`); return A.out(Array.from({ length: 60 }, (_, i) => { const x = G + hash(i, 86) * (D_ - G + 60), y = G - 200 + hash(i, 87) * 800, l = 10 + 10 * hash(i, 88); return `<path d="M${f(x)},${f(y)} l${f(-l * 0.28)},${f(l)}" stroke="#C8B8FF" stroke-width="0.6" stroke-linecap="round" opacity="${f(0.25 + 0.3 * hash(i, 89))}"/>`; }).join('')); };

// ——— le navire et le gramophone, dans la palette néon (vive : pas assombrie) ———
const enCouleurs = svg => svg.replace(/#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b/g, c => neon(c));
// ce qui vit : la pluie cyan, en trois rideaux qui glissent en boucle
function pluieVive() {
  return [[1, 0.8, 0.55], [0.7, 1.15, 0.4], [0.45, 1.7, 0.28]].map(([k, dur, o], j) => {
    let traits = '';
    for (let i = 0; i < Math.round(48 * k + 10); i++) { const x = hash(i, 601 + j) * 520 - 60, y = hash(i, 611 + j) * 400, l = 12 + 20 * k; traits += `M${f(x)},${f(y)} l${f(-l * 0.32)},${f(l)} `; }
    return `<g opacity="${f(o)}"><animateTransform attributeName="transform" type="translate" from="0 -400" to="-128 0" dur="${f(dur)}s" repeatCount="indefinite"/><path d="${traits}" stroke="#9AFAF0" stroke-width="${f(0.6 + k)}" stroke-linecap="round"/><path d="${traits}" transform="translate(128 -400)" stroke="#9AFAF0" stroke-width="${f(0.6 + k)}" stroke-linecap="round"/></g>`;
  }).join('');
}
// le trait de lumière qui trace l'horizon, au tout début
const traitHorizon = p => { const A = atelier(`${p}I`); return A.out(lumineux(`M${G - 90},${HORIZON + 2} L${D_ + 90},${HORIZON + 2}`, ACIDE, 1.4, 0.25) + `<ellipse cx="200" cy="${HORIZON + 2}" rx="160" ry="10" fill="${A.rad([[0, '#FFFFFF', 0.6], [1, ACIDE, 0]], 200, HORIZON + 2, 160)}"/>`); };
// l'étalonnage : les bords dans la nuit, un souffle magenta en haut, sarcelle en bas ; les couleurs vives au centre
const vignette = p => { const A = atelier(`${p}G`); return A.out(plein(A.lin([[0, MAGENTA, 0.08], [0.4, MAGENTA, 0], [0.7, '#00E0C8', 0], [1, '#00C8D8', 0.06]], 0, 0, 0, 400)) + plein(A.rad([[0, '#000', 0], [0.6, '#000', 0.12], [1, '#020008', 0.7]], 200, 200, 320))); };

// ——— la scène : 01_pont, du pont jusqu'au noir ———
// les temps : la légende, les trois messages du capitaine, la lame, sous la surface, le noir
const T = [4200, 5200, 5200, 4600, 2600, 3000, 3000], FIN = T.reduce((a, b) => a + b, 0);
// (la fin du pont ; l'instant où l'eau nous recouvre : sous le rideau, la scène passe sous la surface)
const PONT = 19200, NOYADE = 20100;
const PROPS = ['x', 'y', 's', 'r', 'o'];
// les pistes absolues d'une partition découpée en temps (bout à bout)
function rejoint(temps) {
  const P = {};
  let a = 0;
  for (const t of temps) { for (const [id, cles] of Object.entries(t.pistes)) (P[id] = P[id] || []).push(...cles.map(([u, c]) => [a + u, c])); a += t.duree; }
  return P;
}
// une piste effacée à l'instant t (elle garde sa place)
const cache = (cles, t) => [...cles.filter(([u]) => u < t - 1), [t - 1, { ...TP.valeur(cles, t - 1, PROPS), e: 'linear' }], [t, { ...TP.valeur(cles, t, PROPS), o: 0 }]];
// les racines du pont : [id, base, c1, c2, pointe, largeur à la base, au bout] (les mêmes que celles de 01_pont)
const RA = { base: ['racineA', [430, 430], [400, 360], [372, 330], [352, 300], 46, 26], bout: ['racineA-bout', [352, 300], [340, 280], [336, 262], [324, 248], 26, 2] };
const RB = { base: ['racineB', [-30, 400], [10, 300], [40, 220], [92, 150], 54, 30], bout: ['racineB-bout', [92, 150], [124, 110], [160, 112], [164, 150], 30, 2] };
const RC = { base: ['racineC', [-40, 330], [30, 290], [80, 300], [140, 262], 40, 22], bout: ['racineC-bout', [140, 262], [190, 236], [240, 250], [290, 236], 22, 2] };
// les racines de l'abîme, sous la surface : [id, base, c1, c2, pointe, largeurs, couleurs, profondeur]
const ABIME = [
  ['abime0', [330, 470], [380, 360], [300, 280], [236, 196], 72, 5, ['#24042C', '#6A1660', MAGENTA], 0.45],
  ['abime1', [40, 480], [0, 380], [110, 300], [170, 216], 84, 5, ['#14042C', '#4A1474', ACIDE], 0.8],
  ['abime2', [430, 500], [470, 420], [380, 380], [326, 320], 58, 4, ['#1A0A3E', '#3A1A8A', CYAN], 1]
];
const FOND_ABIME = [[[60, 520], [120, 420], [40, 340], [90, 260], 40], [[250, 520], [200, 430], [300, 380], [260, 300], 34], [[380, 520], [330, 450], [420, 400], [360, 330], 30]];
const racinesFond = p => { const A = atelier(`${p}P`); return A.out(FOND_ABIME.map(([a, b, c, d, w], i) => racineNeon(p, `P${i}`, a, b, c, d, w, 3, ['#0A0420', '#1E0A44', i % 2 ? MAGENTA : '#7A6AF0'], 1700 + i)).join('')); };

function naufrage() {
  // (le décor neuf a son propre préfixe : ses dégradés ne croisent jamais ceux des pièces gardées de 01_pont)
  const p = 'nn', sc = TP.pont01(), P0 = rejoint(sc.partition.temps);
  const { COR_IN, COUPE, CHOC, RACCORD, SORT, ARRACHE, RETOUR, CRI, CHUTE } = REPERES, FRAPPE = CRI + 350;
  // les pièces du récit gardées de 01_pont : le navire et tout ce qu'il porte, le gramophone (passés au néon)
  const sous = id => [id, ...sc.plans.filter(q => q.dans === id).flatMap(q => sous(q.id))];
  const DU_NAVIRE = new Set(sous('navire')), DU_COR = new Set([...sous('cor'), 'voile', 'lueur-cor']);
  const garde = ids => sc.plans.filter(q => ids.has(q.id)).map(q => { const d = q.dessin; return { ...q, dessin: () => enNeon(() => enCouleurs(d())) }; });
  const m = { marge: MARGE };
  const racinePlans = (R, prof, devant, c) => [
    { id: R.base[0], profondeur: prof, cadre: [-80, 60, 560, 400], pivot: R.base[1], dessin: () => enNeon(() => racineNeon(p, R.base[0], ...R.base.slice(1), c, 500 + R.base[1][0])) },
    { id: R.bout[0], dans: R.base[0], derriere: !devant, cadre: [-80, 60, 560, 400], pivot: R.bout[1], dessin: () => enNeon(() => racineNeon(p, R.bout[0], ...R.bout.slice(1), c, 600 + R.bout[1][0])) }
  ];
  const ORAGES = [[0, 26, 20, '#5A1A9A', MAGENTA], [1, 58, 16, '#3A1478', CYAN], [2, 96, 18, '#2A0A60', '#C870F0'], [3, 128, 14, '#1A0848', MAGENTA]];
  const STRATES = [[0, 150, '#FFB8D8'], [1, 178, '#FF8A70']];
  const POSES = [0, 0.3, 0.55, 0.8, 1];
  // (une couche de mer, et l'écume qui naît sur ses crêtes, attachée à elle)
  const merPlan = i => { const [y, h] = MERS[i]; return { id: `mer${i}`, profondeur: [0.24, 0.3, 0.4, 0.7, 0.85, 1][i], cadre: [-110, y - h - 30, 620, 470 - (y - h - 30)], pivot: [200, y + 40], dessin: () => enNeon(() => vague(p, i)) }; };
  const ecumePlans = i => { const [y, h] = MERS[i]; return [0, 1].map(n => ({ id: `ecume${i}-${n}`, dans: `mer${i}`, cadre: [-60, y - h - 2 * i - 18, 520, h + 2 * i + 26], dessin: () => ecume(p, i, n) })); };
  const gouttesPlans = j => [0, 1].map(n => ({ id: `gouttes${j}-${n}`, profondeur: [0.45, 0.78, 1.05][j], cadre: [G, GOUTTES[j][0] - 14, D_ - G, GOUTTES[j][1] - GOUTTES[j][0] + 20], dessin: () => gouttes(p, j, n) }));
  const plans = [
    { id: 'ciel', profondeur: 0.02, ...m, flou: 0.25, dessin: () => ciel(p) },
    { id: 'ciel-nuit', profondeur: 0.02, ...m, flou: 0.25, dessin: () => cielNuit(p) },
    { id: 'etoiles', profondeur: 0.03, ...m, dessin: () => etoilesCiel(p) },
    { id: 'soleil', profondeur: 0.05, cadre: [SOLEIL[0] - 200, SOLEIL[1] - 200, 400, 400], pivot: SOLEIL, dessin: () => soleil(p) },
    ...STRATES.map(([i, y, lum]) => ({ id: `strate${i}`, profondeur: 0.08 + i * 0.03, cadre: [G - 100, y - 24, D_ - G + 200, 34], dessin: () => strate(p, i, y, lum) })),
    // (une volute au bord des bancs 1 et 3 seulement)
    ...ORAGES.flatMap(([i, y, a, c, lum]) => { const [vx, vy, vr] = voluteNuage(i, y, a, lum); return [
      { id: `orage${i}`, profondeur: 0.12 + i * 0.04, cadre: [G - 120, G - 160, D_ - G + 240, y + a - G + 172], dessin: () => enNeon(() => orage(p, i, y, a, c, lum)) },
      ...(i % 2 ? [{ id: `volute${i}`, dans: `orage${i}`, cadre: [vx - vr * 1.4, vy - vr * 1.4, vr * 2.8, vr * 2.8], pivot: [vx, vy], dessin: () => voluteOrage(p, i, y, a, lum) }] : [])]; }),
    ...[4, 3, 2, 1, 0].map(i => { const R = R_OEIL[i + 1] * 1.08; return { id: `oeil${i}`, profondeur: 0.06 + (4 - i) * 0.015, flou: 0.6, cadre: [OEIL[0] - R, OEIL[1] - R, 2 * R, 2 * R], pivot: OEIL, dessin: () => anneauOeil(p, i) }; }),
    ...LUEURS.map((_, i) => ({ id: `lueur-nuage${i}`, profondeur: 0.13, flou: 0.4, cadre: [LUEURS[i][0] - LUEURS[i][2], LUEURS[i][1] - LUEURS[i][2], 2 * LUEURS[i][2], 2 * LUEURS[i][2]], dessin: () => lueurNuage(p, i) })),
    { id: 'coeur', profondeur: 0.06, cadre: [OEIL[0] - 62, OEIL[1] - 62, 124, 124], pivot: OEIL, dessin: () => coeurOeil(p) },
    ...SPIRALES.map(([x, y, r], i) => ({ id: `spirale${i}`, profondeur: 0.07 + i * 0.012, cadre: [x - r * 2, y - r * 2, r * 4, r * 4], pivot: [x, y], dessin: () => spiraleCiel(p, i) })),
    ...[0, 1].map(i => ({ id: `scintilles${i}`, profondeur: 0.04, cadre: [-40, -20, 480, 220], dessin: () => scintilles(p, i) })),
    ...FILANTES.map(([x, y], i) => ({ id: `filante${i}`, profondeur: 0.03, cadre: [x - 8, y - 30, 76, 40], dessin: () => filante(p, i) })),
    { id: 'foudre', profondeur: 0.14, cadre: [36, -36, 90, 260], pivot: FOUDRE[0], dessin: () => foudre(p) },
    { id: 'brume-loin', profondeur: 0.2, ...m, flou: 0.2, dessin: () => brumeLoin(p) },
    { id: 'pluie-loin', profondeur: 0.3, cadre: [G, G - 200, D_ - G + 60, 800], dessin: () => pluieLoin(p) },
    { id: 'trait-horizon', profondeur: 0.22, cadre: [G - 100, HORIZON - 20, D_ - G + 200, 44], pivot: [200, HORIZON + 2], dessin: () => traitHorizon(p) },
    merPlan(0), merPlan(1), ...ecumePlans(1),
    { id: 'lame', profondeur: 0.34, cadre: [G - 100, 0, D_ - G + 200, 410], pivot: [200, 380], dessin: () => lame(p) },
    ...POSES.map((k, i) => ({ id: `levre${i}`, dans: 'lame', cadre: [G - 100, -70, D_ - G + 220, 280], dessin: () => levre(p, k) })),
    merPlan(2), ...ecumePlans(2), ...gouttesPlans(0),
    // (sous la surface : l'abîme couvre tout ce qui est derrière lui ; devant lui, le navire et les racines)
    { id: 'abysse', profondeur: 0.04, ...m, flou: 0.2, dessin: () => abysse(p) },
    { id: 'surface', profondeur: 0.1, flou: 0.6, cadre: [G - 80, -260, D_ - G + 160, 760], pivot: [200, -60], dessin: () => surface(p) },
    { id: 'racines-fond', profondeur: 0.25, flou: 0.7, cadre: [-20, 240, 460, 300], dessin: () => enNeon(() => racinesFond(p)) },
    ...ABIME.slice(0, 1).map(([id, a, b, c, d, w0, w1, cs, prof]) => ({ id, profondeur: prof, cadre: [-80, 150, 580, 380], pivot: a, dessin: () => enNeon(() => racineNeon(p, id, a, b, c, d, w0, w1, cs, 1800)) })),
    ...racinePlans(RB, 0.55, false, ['#24042C', '#6A1660', MAGENTA]),
    ...garde(DU_NAVIRE),
    ...racinePlans(RC, 0.62, true, ['#1A0A3E', '#5A1A8A', CYAN]),
    merPlan(3), ...ecumePlans(3), merPlan(4), ...ecumePlans(4), ...gouttesPlans(1),
    ...racinePlans(RA, 0.85, true, ['#14042C', '#4A1474', ACIDE]),
    merPlan(5), ...ecumePlans(5), ...gouttesPlans(2),
    ...ABIME.slice(1).map(([id, a, b, c, d, w0, w1, cs, prof], j) => ({ id, profondeur: prof, cadre: [-80, 150, 580, 380], pivot: a, dessin: () => enNeon(() => racineNeon(p, id, a, b, c, d, w0, w1, cs, 1801 + j)) })),
    { id: 'anime', profondeur: 0.8, dessin: () => pluieVive() },
    { id: 'houle', profondeur: 1.3, cadre: [G - 100, 320, D_ - G + 200, 160], pivot: [200, 380], dessin: () => enNeon(() => houle(p)) },
    ...[0, 1].map(i => ({ id: `embruns${i}`, profondeur: 1.5, cadre: [G - 20, 230, D_ - G + 40, 220], dessin: () => embruns(p, i) })),
    { id: 'pluie-devant', profondeur: 1.6, cadre: [G, G - 200, D_ - G + 60, 800], dessin: () => pluie(p) },
    ...[0, 1].map(i => ({ id: `rafale${i}`, profondeur: 0.9, cadre: [-20, 20, 460, 370], dessin: () => rafale(p, i) })),
    { id: 'plancton0', profondeur: 0.5, cadre: [-40, 40, 480, 420], dessin: () => plancton(p, 0) },
    ...[0, 1, 2].map(i => ({ id: `bulles${i}`, profondeur: 0.9 + i * 0.3, cadre: [G, 80, D_ - G, 360], dessin: () => bulles(p, i) })),
    ...garde(DU_COR),
    { id: 'rideau', profondeur: 0, flou: 0.7, cadre: [G - 60, -480, D_ - G + 120, 960], dessin: () => rideau(p) },
    ...[0, 1].map(i => ({ id: `remous${i}`, profondeur: 0, cadre: [G, G, D_ - G, D_ - G], pivot: [200, 200], dessin: () => remous(p, i) })),
    { id: 'assombri', profondeur: 0, ...m, flou: 0.1, dessin: () => plein(NOIR) },
    { id: 'plancton1', profondeur: 1, cadre: [-40, 40, 480, 420], dessin: () => plancton(p, 1) },
    { id: 'vignette', profondeur: 0, ...m, flou: 0.5, dessin: () => vignette(p) },
    { id: 'eclair', profondeur: 0, ...m, flou: 0.1, dessin: () => plein('#FFE8FF') }
  ];
  // (le cor et le voile se posent devant tout le décor : on les replace après les bulles, à leur rang d'origine)
  const P = {};
  for (const id of [...DU_NAVIRE, ...DU_COR]) if (P0[id]) P[id] = P0[id];

  // ——— le décor : le crépuscule, l'orage ———
  const force = t => (t < 4200 ? 0.45 : t < 9400 ? 0.45 + (0.55 * (t - 4200)) / 5200 : t < 14600 ? 1 + (0.5 * (t - 9400)) / 5200 : 2.3);
  const jusquA = (cles, t = NOYADE) => cache(cles, t);
  // (le noir, puis un trait de lumière trace l'horizon ; le ciel s'allume à partir de lui)
  P['trait-horizon'] = [[0, { o: 1, s: 0.02 }], [150, { o: 1, s: 0.02, e: 'cubic-bezier(.3,0,.2,1)' }], [1000, { o: 1, s: 1 }], [1400, { o: 1, s: 1, e: 'ease-in' }], [2400, { o: 0, s: 1 }]];
  P.ciel = jusquA([[0, { o: 0 }], [500, { o: 0, e: 'ease-in-out' }], [1900, { o: 1 }]]);
  P.etoiles = [[0, { o: 0 }], [900, { o: 0 }], [2300, { o: 1 }], ...balance(2300, 7000, 1400, k => ({ o: k % 2 ? 0.6 : 1 })), [9600, { o: 0 }]];
  P.soleil = [[0, { y: 90, o: 0, r: 0 }], [600, { y: 90, o: 0, r: 0, e: 'cubic-bezier(.2,.8,.3,1)' }], [2600, { y: 0, o: 1, r: 12 }], [5200, { y: 8, o: 1, r: 26 }], [10500, { y: 80, o: 0, r: 60 }]];
  STRATES.forEach(([i]) => { const sens = i ? -1 : 1; P[`strate${i}`] = jusquA([[0, { x: sens * 460, o: 0 }], [400 + i * 200, { x: sens * 460, o: 0, e: 'cubic-bezier(.2,.85,.3,1)' }], [2000 + i * 200, { x: 0, o: 1 }], ...balance(2000 + i * 200, PONT, 7000, k => ({ x: (k % 2 ? 1 : -1) * sens * 16, o: 1 }))]); });
  P['ciel-nuit'] = jusquA([[0, { o: 0 }], [4600, { o: 0, e: 'ease-in' }], [11000, { o: 1 }]]);
  P['brume-loin'] = jusquA([[0, { o: 0 }], [1200, { o: 0 }], [2800, { o: 0.6 }], [11000, { o: 1 }]]);
  const entrees = [4400, 6200, 9700, 11500];
  ORAGES.forEach(([i]) => { const sens = i % 2 ? 1 : -1, t0 = entrees[i]; P[`orage${i}`] = jusquA([[0, { x: sens * 560 }], [t0, { x: sens * 560, e: 'cubic-bezier(.3,.7,.3,1)' }], [t0 + 2400, { x: 0 }], ...balance(t0 + 2400, PONT + 800, 6000 + i * 900, k => ({ x: (k % 2 ? 1 : -1) * sens * (14 + i * 6) }))]); });
  // (l'œil de la tempête s'ouvre et tourne : les anneaux du dedans plus vite)
  [0, 1, 2, 3, 4].forEach(i => { const t0 = 9200 + (4 - i) * 250, sp = [70, 48, 34, 24, 16][i], rot = t => Math.round(sp * (t - t0) / 10) / 100; P[`oeil${i}`] = [[0, { o: 0, s: 0.4, r: 0 }], [t0, { o: 0, s: 0.4, r: 0, e: 'ease-out' }], [t0 + 3000, { o: 1, s: 1, r: rot(t0 + 3000), e: 'linear' }], [NOYADE - 1, { o: 1, s: 1, r: rot(NOYADE - 1), e: 'linear' }], [NOYADE, { o: 0, s: 1, r: rot(NOYADE) }]]; });
  P.coeur = jusquA([[0, { o: 0, s: 0.5 }], [10200, { o: 0, s: 0.5, e: 'ease-out' }], [12800, { o: 1, s: 1 }], ...balance(12800, PONT + 900, 900, k => ({ o: 1, s: k % 2 ? 1.18 : 1 }))]);
  const coups = [[11200, 0.8], [FRAPPE, 1], [18600, 1]];
  P.foudre = [[0, { s: 0.05, o: 0 }], ...coups.flatMap(([t]) => [[t - 1, { s: 0.05, o: 0, e: 'linear' }], [t, { s: 0.05, o: 1, e: 'ease-out' }], [t + 110, { s: 1, o: 1 }], [t + 320, { s: 1, o: 1, e: 'ease-in' }], [t + 600, { s: 1, o: 0 }]])];
  P.eclair = [[0, { o: 0 }], ...[...coups, [CHOC, 0.7], [ARRACHE, 0.6], [FRAPPE + 520, 0.5], [19920, 0.8]].sort((u, v) => u[0] - v[0]).flatMap(([t, a]) => [[t - 1, { o: 0, e: 'linear' }], [t + 40, { o: 0.3 * a, e: 'linear' }], [t + 100, { o: 0.05, e: 'linear' }], [t + 160, { o: 0.2 * a, e: 'ease-out' }], [t + 420, { o: 0 }]])];
  // (la mer : elle se lève couche après couche, puis grossit avec l'orage)
  MERS.forEach((_, i) => { const t0 = 300 + i * 150; P[`mer${i}`] = jusquA([[0, { y: 320 }], [t0, { y: 320, e: 'cubic-bezier(.2,.9,.3,1.05)' }], [t0 + 1000, { y: 0 }], ...balance(t0 + 1000, PONT + 900, 2300 + i * 250, (k, t) => ({ x: (k % 2 ? 1 : -1) * (4 + i * 3) * force(t), r: (k % 2 ? -1 : 1) * (0.5 + i * 0.22) * force(t), y: (k % 2 ? -1 : 1) * (1 + i) * Math.max(0.3, force(t) - 0.6) }))]); });
  P.houle = jusquA([[0, { y: 140 }], [900, { y: 140, e: 'cubic-bezier(.2,.8,.3,1)' }], [2300, { y: 20 }], ...balance(2300, PONT + 900, 2600, (k, t) => ({ y: (k % 2 ? 10 : 30) - Math.min(1, t / 14000) * 26, x: k % 2 ? -14 : 14 }))]);
  [0, 1].forEach(i => { P[`embruns${i}`] = jusquA(bouffees(6600 + i * 700, PONT + 600, 1400, { x: -90, y: 70, s: 0.8, o: 0.9 }, { x: 130, y: -90, s: 1.25, o: 0.9 }), NOYADE); });
  P['pluie-devant'] = jusquA([[0, { o: 0, x: 0, y: 0 }], ...bouffees(6000, PONT + 700, 900, { x: 0, y: -260, o: 0.9 }, { x: -70, y: 140, o: 0.9 }).slice(1)]);
  P.anime = jusquA([[0, { o: 0 }], [5600, { o: 0 }], [9400, { o: 1 }]]);
  P.vignette = [[0, { o: 1 }]];

  // ——— ce qui bouge un peu partout ———
  // (une rotation continue de t0 à t1, à une vitesse qui suit l'orage (degrés par seconde), avec un battement : la
  // spirale enfle et se dégonfle, dérive un peu)
  const vitesse = t => 50 + 150 * Math.min(1, Math.max(0, (t - 4200) / 10000));
  const tourne = (t0, t1, sens, k = 1, derive = 6) => { const out = []; let r = 0; for (let t = t0, n = 0; t < t1; n++) { out.push([t, { s: n % 2 ? 1.14 : 1, r: Math.round(r), x: (n % 2 ? 1 : -1) * derive * force(t), o: 1, e: 'linear' }]); const dt = Math.min(1100, t1 - t); r += sens * k * vitesse(t) * dt / 1000; t += dt; } out.push([t1, { s: 1, r: Math.round(r), x: 0, o: 1 }]); return out; };
  // (les effets changent avec le moment : au crépuscule, des scintillements, deux étoiles filantes, quelques spirales
  // lentes ; dans l'orage, les spirales sont aspirées par l'œil de la tempête, les rafales, les éclairs de chaleur, la
  // pluie et ses éclaboussures ; sous l'eau, le plancton, dont quelques points restent dans le noir)
  SPIRALES.forEach(([x, y, , sens], i) => {
    const t0 = 700 + i * 300, t1 = 9600 + i * 450, k = tourne(t0 + 900, t1, sens, 1, 6 + i), [, fin] = k[k.length - 1];
    P[`spirale${i}`] = [[0, { s: 0, r: -200 * sens, x: 0, y: 0, o: 1 }], [t0, { s: 0, r: -200 * sens, x: 0, y: 0, o: 1, e: 'cubic-bezier(.2,.9,.3,1.3)' }], ...k.slice(0, -1), [t1, { ...fin, y: 0, e: 'cubic-bezier(.6,0,.9,.6)' }], [t1 + 2200, { s: 0.15, r: fin.r + sens * 700, x: OEIL[0] - x, y: OEIL[1] - y, o: 0 }]];
  });
  ORAGES.forEach(([i]) => { if (i % 2) P[`volute${i}`] = tourne(0, PONT + 900, 1, 1.6, 0); });
  [0, 1].forEach(i => { P[`scintilles${i}`] = [[0, { o: 0 }], [1400 + i * 500, { o: 0 }], ...balance(1400 + i * 500, 6000, 1500 + i * 500, k => ({ o: k % 2 ? 0.15 : 1 })), [7800, { o: 0 }]]; });
  FILANTES.forEach((_, i) => { const t = [1900, 3400][i]; P[`filante${i}`] = [[0, { o: 0, x: 0, y: 0 }], [t - 1, { o: 0, x: 0, y: 0, e: 'linear' }], [t, { o: 1, x: 0, y: 0, e: 'cubic-bezier(.3,0,.7,1)' }], [t + 700, { o: 0, x: -170, y: 62 }]]; });
  [0, 1].forEach(i => { const k = [[0, { o: 0, x: -520 }]]; for (let t = 8300 + i * 900, n = 0; t < PONT; n++, t += 1500 + Math.round(hash(n, 220 + i) * 1700)) k.push([t - 1, { o: 0, x: -520, e: 'linear' }], [t, { o: 0.9, x: -520, e: 'cubic-bezier(.4,0,.6,1)' }], [t + 540, { o: 0.9, x: 520, e: 'linear' }], [t + 541, { o: 0, x: 520 }]); P[`rafale${i}`] = k; });
  [0, 1].forEach(j => { const t0 = NOYADE + 400 + j * 600, k = [[0, { o: 0, y: 40 }], [t0, { o: 0, y: 40, e: 'ease-out' }]]; for (let t = t0 + 1600, n = 0; t < FIN; n++, t += 900) k.push([t, { o: j && t > 26400 ? Math.max(0, 1 - (t - 26400) / 1100) : n % 2 ? 0.55 : 1, y: -Math.round((t - t0) * 0.012), e: 'ease-in-out' }]); P[`plancton${j}`] = k; });
  // (les éclairs de chaleur : ils palpitent dans les nuages dès que l'orage est là)
  LUEURS.forEach((_, i) => { const k = [[0, { o: 0 }]]; for (let t = 6800 + i * 450, n = 0; t < PONT; n++, t += 700 + Math.round(hash(n, 190 + i) * 1100)) k.push([t - 1, { o: 0, e: 'linear' }], [t + 60, { o: 0.85, e: 'linear' }], [t + 140, { o: 0.25, e: 'linear' }], [t + 220, { o: 0.65, e: 'ease-out' }], [t + 620, { o: 0 }]); P[`lueur-nuage${i}`] = jusquA(k); });
  // (l'écume : sur chaque couche, une crête sur deux à la fois, elle naît, monte un peu et s'efface)
  [1, 2, 3, 4, 5].forEach(i => [0, 1].forEach(n => { const per = 1300 + i * 160, k = [[0, { o: 0, y: 2 }]]; for (let t = 1600 + n * per / 2 + i * 90; t < NOYADE - per; t += per) k.push([t, { o: 0, y: 2, e: 'ease-out' }], [t + per * 0.3, { o: 1, y: 0, e: 'linear' }], [t + per * 0.7, { o: 0.9, y: -3, e: 'ease-in' }], [t + per - 1, { o: 0, y: -5 }]); P[`ecume${i}-${n}`] = k; }));
  // (les éclaboussures : la pluie frappe la mer, une couronne puis l'autre)
  [0, 1, 2].forEach(j => [0, 1].forEach(n => { const per = 520 + j * 90, k = [[0, { o: 0 }]]; for (let t = 6800 + n * per / 2; t < NOYADE - per; t += per) k.push([t, { o: 0, e: 'ease-out' }], [t + 70, { o: 1, e: 'ease-in' }], [t + per * 0.8, { o: 0 }]); P[`gouttes${j}-${n}`] = k; }));
  P['pluie-loin'] = jusquA([[0, { o: 0, x: 0, y: 0 }], ...bouffees(5800, PONT + 700, 1300, { x: 0, y: -260, o: 0.8 }, { x: -50, y: 140, o: 0.8 }).slice(1)]);

  // ——— le navire : il arrive tel quel, entier (choix de l'auteur, 18 oct. : pas de contours seuls ; il est visible
  // ou il ne l'est pas) ; la nuit des profondeurs finit par le couvrir
  // (la lame le soulève et le couche ; sous le rideau, il passe sous la surface ; il coule, de plus en plus loin)
  const nav = [...P0.navire, [19800, { x: -10, y: -36, r: -16, s: 1, e: 'linear' }], [NOYADE - 1, { x: -10, y: -36, r: -16, s: 1, e: 'linear' }], [NOYADE, { x: 10, y: 30, r: 26, s: 0.82, e: 'ease-out' }], [21800, { x: 18, y: 56, r: 31, s: 0.79, e: 'linear' }], [24800, { x: 30, y: 110, r: 38, s: 0.71, e: 'ease-in' }], [FIN, { x: 36, y: 150, r: 42, s: 0.66 }]];
  P.navire = nav;
  // (ce qui fume, ondule ou gicle autour du navire s'arrête sous l'eau)
  for (const id of DU_NAVIRE) if (/^(fumee|embrun|onde)/.test(id) && P[id]) P[id] = jusquA(P[id]);
  // (les racines du pont lâchent prise sous le rideau : celles de l'abîme prennent le relais)
  for (const R of [RA, RB, RC]) P[R.base[0]] = jusquA(P0[R.base[0]]);
  for (const R of [RA, RB, RC]) P[R.bout[0]] = P0[R.bout[0]];

  // ——— la lame ———
  P.lame = [[0, { y: 380, s: 1, o: 0 }], [CHUTE - 401, { y: 380, s: 1, o: 0, e: 'linear' }], [CHUTE - 400, { y: 380, s: 1, o: 1, e: 'cubic-bezier(.3,0,.3,1)' }], [PONT, { y: 60, s: 1, o: 1, e: 'cubic-bezier(.45,0,.7,1)' }], [19900, { y: -30, s: 1.25, o: 1, e: 'linear' }], [NOYADE - 1, { y: -30, s: 1.25, o: 1, e: 'linear' }], [NOYADE, { y: -30, s: 1.25, o: 0 }]];
  // (sa lèvre, pose après pose : la crête se recourbe et retombe)
  const PT = [0, 19300, 19480, 19660, 19840];
  POSES.forEach((_, i) => { const k = [[0, { o: i ? 0 : 1 }]]; if (i) k.push([PT[i] - 1, { o: 0, e: 'linear' }], [PT[i], { o: 1 }]); if (i < POSES.length - 1) k.push([PT[i + 1] - 1, { o: 1, e: 'linear' }], [PT[i + 1], { o: 0 }]); P[`levre${i}`] = k; });
  // (l'eau passe sur nous : le rideau tombe, tout bouillonne, puis il s'éclaircit sur le dessous de la surface)
  P.rideau = [[0, { y: -960, o: 1 }], [19650, { y: -960, o: 1, e: 'cubic-bezier(.55,0,.85,.4)' }], [20050, { y: 0, o: 1 }], [20500, { y: 0, o: 1, e: 'ease-in-out' }], [21600, { y: 380, o: 0 }]];
  [0, 1].forEach(i => { const sens = i ? -1 : 1; P[`remous${i}`] = [[0, { o: 0, r: 0, s: 1, y: 0 }], [19950, { o: 0, r: 0, s: 1, y: 0, e: 'ease-out' }], [20250, { o: 1, r: sens * 30, s: 1.05, y: -10, e: 'linear' }], [21000, { o: 0.9, r: sens * 90, s: 1.2, y: -70, e: 'ease-in' }], [21700, { o: 0, r: sens * 130, s: 1.3, y: -140 }]]; });

  // ——— sous la surface, puis le noir ———
  P.abysse = [[0, { o: 0 }], [NOYADE - 1, { o: 0, e: 'linear' }], [NOYADE, { o: 1 }]];
  P.surface = [[0, { o: 0, y: 0, r: 0 }], [NOYADE - 1, { o: 0, y: 0, r: 0, e: 'linear' }], [NOYADE, { o: 1, y: 0, r: 0 }], ...balance(NOYADE, 26500, 2200, (k, t) => ({ o: Math.max(0.3, 1 - Math.max(0, t - 23000) / 4500), y: -Math.max(0, t - 21800) * 0.06, r: k % 2 ? 2 : -2 }))];
  P['racines-fond'] = [[0, { o: 0, y: 140 }], [20800, { o: 0, y: 140, e: 'ease-out' }], [23600, { o: 0.75, y: 0 }]];
  ABIME.forEach(([id], j) => { const t0 = 20500 + j * 350; P[id] = [[0, { y: 430, r: 0 }], [t0, { y: 430, r: 0, e: 'cubic-bezier(.2,.8,.3,1)' }], [t0 + 2800, { y: 0, r: j % 2 ? -4 : 4 }], ...balance(t0 + 2800, FIN, 2400 + j * 300, k => ({ y: k % 2 ? 6 : 0, r: (k % 2 ? 1 : -1) * (3 + j) }))]; });
  [0, 1, 2].forEach(j => { P[`bulles${j}`] = bouffees(NOYADE - 100 + j * 250, 26600, [2600, 1900, 1400][j], { x: 0, y: 160, o: 1 }, { x: j % 2 ? 16 : -16, y: -420, o: 1 }); });
  P.assombri = [[0, { o: 0 }], [22400, { o: 0, e: 'ease-in-out' }], [24800, { o: 0.5 }], [26300, { o: 0.94 }], [FIN, { o: 1 }]];

  // ——— la caméra : elle descend du ciel, fonce aux coups, lève les yeux vers la lame, passe dessous, puis s'enfonce
  // avec le navire (ses mouvements sont amples : son zoom joue selon la profondeur de chaque plan) ———
  const camera = [[0, { x: 30, y: -110, z: 1.7 }], [400, { x: 30, y: -110, z: 1.7, e: 'cubic-bezier(.5,0,.2,1)' }], [3900, { x: 0, y: 6, z: 1.06 }], [COUPE, { x: -10, y: 4, z: 1.1 }],
    [CHOC - 100, { z: 1.36, x: 70, y: 30, e: 'linear' }], ...secoue(CHOC, { z: 1.36, x: 70, y: 30 }, 15, 8, 50), [RACCORD + 300, { z: 1.12, x: 24, y: 8 }],
    [SORT + 400, { z: 1.3, x: -70, y: 18 }], [ARRACHE - 200, { z: 1.3, x: 54, y: 12, e: 'linear' }], ...secoue(ARRACHE, { z: 1.3, x: 54, y: 12 }, 12, 6, 50), [RETOUR, { z: 1.12, x: 10, y: 4 }],
    [FRAPPE - 100, { z: 1.38, x: -20, y: 30, e: 'linear' }], ...secoue(FRAPPE, { z: 1.38, x: -20, y: 30 }, 14, 7, 50), [CHUTE + 200, { z: 1.1, x: 0, y: -10 }], [PONT, { z: 1.2, x: 0, y: -70, e: 'cubic-bezier(.5,0,.9,.5)' }],
    [19850, { z: 1.42, x: 6, y: -96, e: 'linear' }], ...secoue(19900, { z: 1.42, x: 6, y: -96 }, 14, 3, 50), [NOYADE - 1, { z: 1.42, x: 6, y: -96, e: 'linear' }], [NOYADE, { z: 1.02, x: 0, y: 0, e: 'ease-out' }],
    [21800, { z: 1.06, x: -6, y: 20, e: 'linear' }], [24800, { z: 1.14, x: -12, y: 60, e: 'ease-out' }], [FIN, { z: 1.22, x: -16, y: 90 }]];

  const temps = T.map(d => ({ duree: d, camera: [], pistes: {} }));
  parTemps(T, camera, ['x', 'y', 'z', 'r']).forEach((c, n) => { temps[n].camera = c; });
  for (const [id, cles] of Object.entries(P)) parTemps(T, cles).forEach((c, n) => { temps[n].pistes[id] = c; });
  return { plans, partition: { temps } };
}

module.exports = { naufrage, T, FIN, PONT, NOYADE, ciel, cielNuit, etoilesCiel, soleil, strate, orage, anneauOeil, coeurOeil, foudre, brumeLoin, vague, houle, pluie, embruns, lame, levre, rideau, remous, abysse, surface, bulles, racineNeon, enCouleurs, lumineux, enNeon, NOIR, ENCRE, CYAN, ACIDE, MAGENTA, CORAIL, ORANGE, VIOLET, HORIZON, SOLEIL, OEIL, N_OEIL, R_OEIL, MERS, FOUDRE, plein, chemin, melange };
