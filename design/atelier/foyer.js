// Le Foyer redessiné, palier par palier (choix de l'auteur, 18 oct. : « d'abord simple, naufragé, rustique ; puis un poil
// plus solide, moderne ; puis le plus solide, stable, bien installé ; l'avant-dernier palier, là ça devient super sympa ;
// le dernier, le côté post-apocalyptique ») :
//   I   le feu du naufragé : un cercle de galets, du bois flotté, la caisse de l'épave, la voile roulée ;
//   II  l'abri de fortune : une tente en A portée par les avirons croisés de la chaloupe, couverte de la voile rapiécée
//       et de palmes, le trépied et sa marmite sur le feu ;
//   III la cabane de planches d'épave : des bordages délavés cloués sur un soubassement de galets, un toit de palmes ;
//   IV  la maison ; V la maison installée ; VI la maison et son phare, le palier « super sympa » ; VII le Foyer fortifié
//       après l'apocalypse (pas en ruine : tenu, barricadé, vivant).
// Le jour un peu néon (comme la jungle) : couleurs de plein soleil, le néon par touches ; la nuit, le jeu allume les
// lumières (batiments.json : lumieres). Chaque palier rend ses images (le feu, le faisceau : animés).
const B = require('./batir');
const { f, rnd, ENCRE, CHAUD, CYAN, MAGENTA, P2, poly, ligne, lin, rad, plan, trait, ovale, lueur, neon, mix, plus, iso, PAS, AXE_U, plaque, boite, toit, surPan,
  tPierres, tPlanches, tRondins, tChaume, galet, buche, caisse, tonneau, lanterne, touffe, ombreSol, fenetre, coque, aviron, hublot, bambou } = B;

// ——— les skins (batiments.json : skins) ———
// Le skin du dessin en cours ('', 'toit-rouge', 'toit-bleu-foyer', 'toit-chaume-foyer') : la couverture des toits et la
// couleur des toiles (palette.js : les mêmes rouge, bleu et chaume que le jeu)
let SKIN = '';
const TOITS = {
  'toit-rouge': (W, H, g, soleil) => B.tTuiles(W, H, g, soleil, { fonce: '#9A3A2A', clair: '#F08A6A', larg: 5.4, haut: 3.8 }),
  'toit-bleu-foyer': (W, H, g, soleil) => B.tTuiles(W, H, g, soleil, { fonce: '#3A5A9A', clair: '#8AB8EC', larg: 5.4, haut: 3.8 }),
  'toit-chaume-foyer': (W, H, g, soleil) => tChaume(W, H, g, soleil, { fonce: '#A8782A', clair: '#F4D27A', haut: 4.5 })
};
const TOILES = { 'toit-rouge': '#E04A3A', 'toit-bleu-foyer': '#4C7FB5', 'toit-chaume-foyer': '#E0B050' };
// La couverture d'un toit : la sienne, ou celle du skin
const couverture = (g, defaut) => (W, H, soleil) => (TOITS[SKIN] ? TOITS[SKIN](W, H, g, soleil) : defaut(W, H, soleil));
const toile = defaut => TOILES[SKIN] || defaut;

// ——— le feu (animé) ———
// Les flammes de l'image n (sur N) : cinq langues qui ondulent chacune à son rythme, leur cœur clair, les braises qui
// montent, la lueur au sol ; en (x, y), de taille k
function flammes(id, x, y, k, n, N = 10) {
  const t = n / N, ph = i => Math.sin((t + i * 0.23) * Math.PI * 2);
  const langue = (h, w, c, dx, i) => {
    const hh = h * (0.86 + 0.16 * ph(i)), sw = 1.6 * Math.sin((t * 2 + i * 0.37) * Math.PI * 2);
    return `<path d="M${P2(dx - w * 0.5, 0)} Q${P2(dx - w * 0.95, -hh * 0.42)} ${P2(dx + sw * 0.4, -hh * 0.7)} Q${P2(dx + sw, -hh * 0.86)} ${P2(dx + sw * 0.6, -hh)} Q${P2(dx + w * 0.9, -hh * 0.5)} ${P2(dx + w * 0.5, 0)} Z" fill="${c}"/>`;
  };
  const braises = [0, 1, 2, 3].map(i => { const tt = (t + i * 0.25) % 1; return `<circle cx="${f((i - 1.5) * 2.6 + Math.sin(tt * 6 + i) * 2)}" cy="${f(-8 - tt * 22)}" r="${f(0.9 * (1 - tt) + 0.3)}" fill="#FFD27A" opacity="${f(1 - tt)}"/>`; }).join('');
  return `<g transform="translate(${f(x)} ${f(y)}) scale(${f(k)})">${lueur(`${id}l`, 0, -6, 30, '#FF8A3A', 0.5 + 0.08 * ph(1))}`
    + langue(17, 9, '#E8401E', -3.2, 0) + langue(21, 9, '#FF6A2A', 2.2, 1) + langue(14, 7.5, '#FF9A3A', -0.6, 2) + langue(10, 5.5, '#FFC860', 0.8, 3) + langue(5.5, 3.4, '#FFF4C8', 0, 4)
    + braises + '</g>';
}
// La lumière du feu : une flaque chaude au sol (sous les objets) ; sa chaleur sur ce qui l'entoure (par-dessus, en
// mode écran : les galets, les bûches, la toile prennent l'orange)
const flaque = (id, x, y, r) => `<defs>${rad(`${id}`, 0, 0, 1, [[0, '#FFB050', 0.55], [0.5, '#FF9A4A', 0.22], [1, '#FF9A4A', 0]])}</defs><ellipse cx="0" cy="0" rx="1" ry="1" fill="url(#${id})" transform="translate(${f(x)} ${f(y)}) scale(${f(r)} ${f(r * 0.5)})"/>`;
const chaleur = (id, x, y, r) => `<defs>${rad(`${id}`, x, y, r, [[0, '#FF8A3A', 0.38], [0.6, '#FF8A3A', 0.12], [1, '#FF8A3A', 0]])}</defs><circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="url(#${id})" style="mix-blend-mode:screen"/>`;
// Le lit de cendres et de braises d'un foyer, en (x, y)
const cendres = (x, y, rx, g) => ovale(x, y, rx, rx * 0.5, '#4A3E36', 0.8) + ovale(x, y + 0.4, rx * 0.72, rx * 0.34, '#2A221E', 0)
  + [0, 1, 2, 3, 4, 5].map(() => `<circle cx="${f(x + (g() - 0.5) * rx * 1.2)}" cy="${f(y + (g() - 0.5) * rx * 0.5)}" r="${f(0.6 + g() * 0.6)}" fill="${g() < 0.5 ? '#FF6A2A' : '#FFB040'}"/>`).join('');
// Un cercle de galets autour de (x, y) : la moitié de derrière (devant = false) ou celle de devant
function cercle(x, y, rx, n, g, devant, mousse = 0.2) {
  let s = '';
  const G = rnd(n * 31 + Math.round(rx * 10));
  const pierres = Array.from({ length: n }, (_, i) => { const a = (i / n) * Math.PI * 2 + G() * 0.2; return { a, x: x + Math.cos(a) * rx, y: y + Math.sin(a) * rx * 0.5, r: rx * 0.27 + G() * rx * 0.08, c: mix('#A8A090', '#E8E2D4', G()), m: G() < mousse }; });
  for (const p of pierres.sort((a, b) => a.y - b.y)) {
    if ((Math.sin(p.a) > 0) !== devant) continue;
    s += galet(p.x, p.y, p.r, g, p.c, p.m);
    // (sa face tournée vers le feu prend sa lumière)
    const ry = p.r * 0.62, cx = p.x - Math.cos(p.a) * p.r * 0.45, cy = p.y - Math.sin(p.a) * ry * 0.4;
    s += `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(p.r * 0.6)}" ry="${f(ry * 0.6)}" fill="#FF9A4A" opacity="${devant ? 0.25 : 0.55}"/>`;
  }
  return s;
}
// Une voile roulée et ficelée, couchée de (x0, y0) à (x1, y1)
function voileRoulee(x0, y0, x1, y1, g) {
  let s = buche(x0, y0, x1, y1, 4.6, g, { c: '#E8DCC4', bois: '#F4ECDC' });
  for (const t of [0.25, 0.7]) { const p = plus([x0, y0], [x1 - x0, y1 - y0], t); s += trait(`M${P2(p[0] - 1, p[1] - 4.6)} Q${P2(p[0] + 1.6, p[1])} ${P2(p[0] - 0.6, p[1] + 4.4)}`, '#8A6A3A', 1.2); }
  // (sa bande rouge délavée)
  const p = plus([x0, y0], [x1 - x0, y1 - y0], 0.48); s += trait(`M${P2(p[0] - 1.6, p[1] - 4.4)} Q${P2(p[0] + 1, p[1])} ${P2(p[0] - 1.2, p[1] + 4.2)}`, toile('#D8664A'), 2.2, ' opacity=".8"');
  return s;
}
// Une marmite de fonte en (x, y) : son anse, son couvercle
const marmite = (x, y, r = 4.6) => `<ellipse cx="${f(x + 1)}" cy="${f(y + 1)}" rx="${f(r)}" ry="${f(r * 0.4)}" fill="#1A0E08" opacity=".25"/>`
  + plan(`M${P2(x - r, y - r * 0.9)} Q${P2(x - r * 1.1, y + r * 0.3)} ${P2(x, y + r * 0.35)} Q${P2(x + r * 1.1, y + r * 0.3)} ${P2(x + r, y - r * 0.9)} Z`, '#3A3A44')
  + `<path d="M${P2(x + r * 0.1, y + r * 0.3)} Q${P2(x + r * 1.05, y + r * 0.2)} ${P2(x + r, y - r * 0.9)} L${P2(x + r * 0.4, y - r * 0.9)} Z" fill="#1A1A20" opacity=".5"/>`
  + ovale(x, y - r * 0.9, r, r * 0.38, '#5A5A66', 0.9) + ovale(x, y - r * 1.05, r * 0.5, r * 0.18, '#7A7A86', 0.6)
  + trait(`M${P2(x - r, y - r * 0.9)} Q${P2(x, y - r * 2.6)} ${P2(x + r, y - r * 0.9)}`, '#3A3A44', 0.9);
// Un coquillage, une étoile de mer
const coquille = (x, y, c = '#FFC8B8') => `<path d="M${P2(x - 2.4, y)} Q${P2(x, y - 3.6)} ${P2(x + 2.4, y)} Q${P2(x, y + 0.9)} ${P2(x - 2.4, y)} Z" fill="${c}" stroke="${ENCRE}" stroke-width=".5"/>` + trait(`M${P2(x, y + 0.4)} L${P2(x - 1.2, y - 1.8)} M${P2(x, y + 0.4)} L${P2(x, y - 2.4)} M${P2(x, y + 0.4)} L${P2(x + 1.2, y - 1.8)}`, mix(c, '#8A4A3A', 0.5), 0.4);
const etoile = (x, y, r = 3, c = '#FF8A5A') => plan(Array.from({ length: 10 }, (_, i) => { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.42 : r; return `${i ? 'L' : 'M'}${P2(x + Math.cos(a) * rr, y + Math.sin(a) * rr * 0.6)}`; }).join(' ') + ' Z', c, 0.5)
  + `<circle cx="${f(x)}" cy="${f(y)}" r=".6" fill="#FFE0C8"/>`;
// ——— fondre le dessin dans le décor ———
// Le sol piétiné sous le camp : pas une tache découpée, des nappes de terre et de sable qui se perdent dans l'herbe du
// jeu, quelques gravillons (sable : plutôt la grève)
function sol(id, rx, ry, g, { sable = 0.6 } = {}) {
  const c = mix(B.SABLE[1], B.SABLE[0], sable);
  let s = '';
  for (let i = 0; i < 6; i++) {
    const a = g() * Math.PI * 2, d = g() * 0.35, k = 0.55 + g() * 0.5;
    s += `<defs>${rad(`${id}n${i}`, 0, 0, 1, [[0, c, 0.75], [0.55, c, 0.45], [1, c, 0]])}</defs><ellipse cx="0" cy="0" rx="1" ry="1" fill="url(#${id}n${i})" transform="translate(${f(Math.cos(a) * rx * d)} ${f(4 + Math.sin(a) * ry * d)}) scale(${f(rx * k)} ${f(ry * k)})"/>`;
  }
  if (B.hiver()) for (let i = 0; i < 9; i++) { const a = g() * Math.PI * 2, d = 0.6 + g() * 0.5; s += `<ellipse cx="${f(Math.cos(a) * rx * d)}" cy="${f(4 + Math.sin(a) * ry * d)}" rx="${f(rx * (0.15 + g() * 0.15))}" ry="${f(ry * (0.12 + g() * 0.1))}" fill="${B.NEIGE}" opacity=".85"/>`; }
  return s + Array.from({ length: 16 }, () => { const a = g() * Math.PI * 2, d = 0.2 + g() * 0.7; return `<ellipse cx="${f(Math.cos(a) * rx * d)}" cy="${f(4 + Math.sin(a) * ry * d)}" rx="${f(0.6 + g() * 0.8)}" ry="${f(0.4 + g() * 0.4)}" fill="${g() < 0.5 ? '#B8A07A' : '#FFF4DC'}" opacity=".8"/>`; }).join('');
}
// L'ombre de contact d'un objet posé : serrée et sombre au pied, qui l'ancre au sol
const contact = (x, y, rx, a = 0.35) => `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(rx)}" ry="${f(rx * 0.42)}" fill="${B.OMBRE_F}" opacity="${a}"/>`;
// Des herbes qui mangent le pied d'un objet (dessinées après lui) : quelques touffes de l'herbe du jeu
const pied = (pts, g, k = 0.8) => pts.map(([x, y]) => touffe(x, y, g, k * (0.8 + g() * 0.4))).join('');

// ——— les petites histoires ———
// Un poisson grillé sur sa broche, en (x, y) : son corps argenté, son ventre doré, son œil, sa queue
const poisson = (x, y, sens = 1) => `<g transform="translate(${f(x)} ${f(y)}) scale(${sens} 1)">${plan('M-6,0 Q-2,-3.4 4,-1.4 L7,-3.4 L6.4,0 L7,3.2 L4,1.2 Q-2,3.2 -6,0 Z', '#9AB8C8', 0.6)}`
  + `<path d="M-5,0.6 Q-1,2.6 4,1 Q-1,1.4 -5,0.6 Z" fill="#E8A040"/><path d="M-4,-1 Q0,-2.6 3,-1.4" fill="none" stroke="#FFFFFF" stroke-width=".6" opacity=".7"/><circle cx="-3.6" cy="-0.6" r=".7" fill="${ENCRE}"/></g>`;
// Un bocal de lucioles (le néon du naufragé) : le verre, le bouchon, ses petites lumières vert acide
const bocal = (id, x, y) => lueur(id, x, y - 5, 14, B.ACIDE, 0.5)
  + plan(`M${P2(x - 3.4, y)} L${P2(x - 3.6, y - 7.4)} Q${P2(x - 3.4, y - 9)} ${P2(x - 2, y - 9.2)} L${P2(x + 2, y - 9.2)} Q${P2(x + 3.4, y - 9)} ${P2(x + 3.6, y - 7.4)} L${P2(x + 3.4, y)} Z`, '#D8F4E8', 0.6, ' fill-opacity=".45"')
  + [[-1.4, -3], [1.2, -5.4], [0, -2], [1.8, -2.6], [-1.6, -6]].map(([dx, dy]) => `<circle cx="${f(x + dx)}" cy="${f(y + dy)}" r=".8" fill="${B.ACIDE}"/><circle cx="${f(x + dx)}" cy="${f(y + dy)}" r=".35" fill="#FFFFFF"/>`).join('')
  + plan(`M${P2(x - 2.2, y - 9.2)} L${P2(x - 2, y - 11)} L${P2(x + 2, y - 11)} L${P2(x + 2.2, y - 9.2)} Z`, '#C8A06A', 0.5)
  + trait(`M${P2(x - 2.6, y - 0.6)} Q${P2(x - 3.6, y - 4)} ${P2(x - 2.8, y - 7.8)}`, '#FFFFFF', 0.6, ' opacity=".7"');
// Des pas de pieds nus dans le sable, de (x0, y0) à (x1, y1)
function pas(x0, y0, x1, y1, n) {
  let s = '';
  const d = [x1 - x0, y1 - y0], L = Math.hypot(...d), u = [d[0] / L, d[1] / L], nn = [-u[1], u[0]];
  for (let i = 0; i < n; i++) { const p = plus(plus([x0, y0], d, i / (n - 1)), nn, i % 2 ? 1.8 : -1.8); s += `<ellipse cx="${f(p[0])}" cy="${f(p[1])}" rx="1.6" ry=".8" fill="#B8A07A" opacity=".55"/><circle cx="${f(p[0] + u[0] * 2)}" cy="${f(p[1] + u[1] * 2)}" r=".5" fill="#B8A07A" opacity=".55"/>`; }
  return s;
}
// Une palme : sa nervure qui retombe, ses folioles effilées, alternées, plus claires au soleil ; de (x0, y0) vers (x1, y1)
function palme(x0, y0, x1, y1, larg, g, soleil = true) {
  const c = [(x0 + x1) / 2 + (y1 - y0) * 0.12, (y0 + y1) / 2 - 4];
  let s = '';
  const pt = t => [(1 - t) ** 2 * x0 + 2 * (1 - t) * t * c[0] + t * t * x1, (1 - t) ** 2 * y0 + 2 * (1 - t) * t * c[1] + t * t * y1];
  for (let i = 1; i < 14; i++) {
    const t = i / 14, p = pt(t), q = pt(t + 0.04), d = B.unite([q[0] - p[0], q[1] - p[1]]), n = [-d[1], d[0]], l = larg * Math.sin(t * Math.PI) * (0.8 + g() * 0.3);
    for (const sg of [-1, 1]) {
      const e = plus(plus(p, n, sg * l), d, l * 0.5 + 2);
      s += `<path d="M${P2(...p)} Q${P2(...plus(plus(p, n, sg * l * 0.5), d, -0.4))} ${P2(...e)} Q${P2(...plus(plus(p, n, sg * l * 0.45), d, 1.6))} ${P2(...plus(p, d, 1.4))} Z" fill="${sg > 0 === soleil ? (i % 2 ? '#81BA5E' : '#A1D46C') : (i % 2 ? '#3A8068' : '#4E9A5A')}" stroke="#2E5A3A" stroke-width=".4"/>`;
    }
  }
  return s + trait(`M${P2(x0, y0)} Q${P2(...c)} ${P2(x1, y1)}`, '#C8B060', 1.1);
}
// Les lettres SOS écrites en galets sur le sable, en (u, v), de taille t (en cases)
function sos(u, v, t, g) {
  const lettres = [
    [[0.8, 0], [0.2, 0], [0, 0.25], [0.2, 0.5], [0.6, 0.5], [0.8, 0.75], [0.6, 1], [0, 1]],
    [[0.4, 0], [0.8, 0.2], [0.8, 0.8], [0.4, 1], [0, 0.8], [0, 0.2], [0.4, 0]],
    [[0.8, 0], [0.2, 0], [0, 0.25], [0.2, 0.5], [0.6, 0.5], [0.8, 0.75], [0.6, 1], [0, 1]]
  ];
  const pts = [];
  lettres.forEach((L, k) => {
    for (let i = 0; i < L.length - 1; i++) {
      const [a, b] = [L[i], L[i + 1]], n = Math.max(1, Math.round(Math.hypot(b[0] - a[0], b[1] - a[1]) * 5));
      for (let j = 0; j < n; j++) { const s2 = j / n, o = iso(u, v, 0); pts.push([o[0] + (k * 1.15 + a[0] + (b[0] - a[0]) * s2) * t * 40, o[1] + (a[1] + (b[1] - a[1]) * s2) * t * 20]); }
    }
  });
  return pts.sort((a, b) => a[1] - b[1]).map(([x, y]) => galet(x, y, 1.5 + g() * 0.5, g, mix('#C8C0B0', '#F4F0E8', g()))).join('');
}
// Une mouette posée, de profil (sens 1 : regarde à droite)
const mouette = (x, y, s = 1) => `<g transform="translate(${f(x)} ${f(y)}) scale(${s} 1)">${plan('M-5,-2 Q-4,-6 0,-6 Q3,-6 3.6,-3.4 L6,-3 L3.6,-2.2 Q3,0 -1,0 L-6,-0.6 Z', '#FAFAF4', 0.6)}`
  + `<path d="M-4.6,-2.6 Q-1,-4.6 2,-2.2 Q-1,-1.4 -4.6,-2.6 Z" fill="#A8B4C0"/><path d="M-6,-0.6 L-8,-1.6 L-7.4,0.4 Z" fill="#5A6470"/><circle cx="1.6" cy="-4.2" r=".5" fill="${ENCRE}"/>`
  + `<path d="M3.6,-3.4 L6,-3 L3.6,-2.2 Z" fill="#F0A030"/>${trait('M-1,0 L-1.4,2 M1,0 L1.2,2', '#F0A030', 0.5)}</g>`;

// ═══ palier I : le feu du naufragé ═══
// Un cercle de gros galets serrés (leur face tournée vers le feu prend sa lumière), le bois flotté en tipi, deux
// poissons qui grillent sur leur broche ; le tronc flotté qui sert de banc et la couverture pliée dessus, le bol de noix
// de coco ; la caisse de l'épave et le bocal de lucioles ; la voile roulée, la marmite, la bouteille ; les pas dans le
// sable qui mènent au feu (choix de l'auteur : « évite les objets qui servent à rien » : chaque chose sert au camp)
function palier1(n = 0) {
  const g = rnd(11), p = 'f1';
  let s = sol(p, 64, 32, g) + ombreSol(`${p}o`, 2, 8, 40, 18, 0.22) + pas(-62, 30, -20, 14, 7);
  // (au fond : le banc de bois flotté, sa couverture, le bol)
  s += contact(-16, -22, 30, 0.25) + buche(-44, -12, 12, -36, 5.6, g, { flotte: true });
  // (la couverture pliée, drapée sur le tronc : ses plis, ses carreaux, sa frange)
  s += plan(`M${P2(-27, -32)} Q${P2(-18, -37)} ${P2(-9, -39)} Q${P2(-6, -33)} ${P2(-7, -25)} Q${P2(-16, -21)} ${P2(-25, -17)} Q${P2(-29, -24)} ${P2(-27, -32)} Z`, toile('#D8664A'), 0.7)
    + `<path d="M${P2(-26, -26)} Q${P2(-17, -29)} ${P2(-8, -32)}" stroke="#F4E4C8" stroke-width="1.2" fill="none"/><path d="M${P2(-19, -35)} Q${P2(-18, -28)} ${P2(-16, -20)}" stroke="#F4E4C8" stroke-width="1.2" fill="none"/>`
    + `<path d="M${P2(-27, -32)} Q${P2(-18, -37)} ${P2(-9, -39)} Q${P2(-12, -31)} ${P2(-11, -24)} Q${P2(-19, -22)} ${P2(-25, -17)} Q${P2(-27, -25)} ${P2(-27, -32)} Z" fill="${B.OMBRE_F}" opacity=".18"/>`
    + Array.from({ length: 6 }, (_, i) => trait(`M${P2(-25 + i * 3.4, -17 - i * 1.4)} l.3,2.2`, '#F4E4C8', 0.7)).join('');
  s += plan(`M${P2(0, -38)} Q${P2(0, -32)} ${P2(5, -32)} Q${P2(10, -32)} ${P2(10, -38)} Z`, '#8A5A36', 0.7) + ovale(5, -38, 5, 1.8, '#F4ECDC', 0.6);
  // (à droite : la caisse de l'épave, le bocal de lucioles dessus)
  s += contact(...iso(0.72, -0.3, 0), 16, 0.3) + caisse(`${p}c`, 0.72, -0.3, 0.4, 12, g) + bocal(`${p}b`, ...iso(0.68, -0.32, 12));

  // (la voile roulée qui sert de couche, devant à gauche : dessinée avant le feu, elle prend la couleur du skin)
  s += contact(-46, 12, 14, 0.25) + voileRoulee(-58, 6, -34, 18, g);
  // (le foyer : les galets de derrière, les cendres, le tipi, les deux fourches de la broche)
  const fx = 0, fy = 6;
  s += flaque(`${p}fl`, fx, fy, 46) + cercle(fx, fy, 20, 11, g, false) + cendres(fx, fy, 13, g);
  s += [[-10, 3, -1, -10], [10, 1, 1, -11], [-3, -4, 0, -12]].map(([x0, y0, x1, y1]) => buche(fx + x0, fy + y0, fx + x1, fy + y1, 1.8, g, { flotte: true })).join('');
  const fourche = x => trait(`M${P2(x, fy + 2)} L${P2(x, fy - 20)} M${P2(x, fy - 17)} L${P2(x - 2.6, fy - 22)} M${P2(x, fy - 17)} L${P2(x + 2.6, fy - 22)}`, ENCRE, 2.6) + trait(`M${P2(x, fy + 2)} L${P2(x, fy - 20)} M${P2(x, fy - 17)} L${P2(x - 2.6, fy - 22)} M${P2(x, fy - 17)} L${P2(x + 2.6, fy - 22)}`, '#C3BBA9', 1.3);
  s += fourche(fx - 22) + fourche(fx + 22);
  // (le feu, animé)
  s += flammes(`${p}fe${n}`, fx, fy - 2, 1.3, n);
  // (la broche et ses poissons, au-dessus du feu ; les galets de devant, la bûche en travers)
  s += trait(`M${P2(fx - 25, fy - 19.6)} L${P2(fx + 25, fy - 20.4)}`, ENCRE, 2) + trait(`M${P2(fx - 25, fy - 19.6)} L${P2(fx + 25, fy - 20.4)}`, '#D8CDB4', 0.9) + poisson(fx - 7, fy - 20) + poisson(fx + 8, fy - 20.2, -1);
  s += buche(fx - 10, fy + 5, fx + 9, fy + 3, 1.9, g, { flotte: true }) + cercle(fx, fy, 20, 11, g, true);
  // (devant : la marmite, la voile roulée qui sert de couche ; les herbes qui mangent les pieds)
  s += contact(26, 18, 6) + marmite(26, 18);
  s += pied([[-60, 14], [-34, 20], [44, -2], [56, -6], [46, 24], [18, -40], [-48, -6], [62, 8], [-6, 36]], g) + chaleur(`${p}ch`, fx, fy - 6, 44);
  return s;
}

// ═══ palier II : l'abri de fortune ═══
// Une tente en A : deux paires de bois flotté croisés et ligaturés, la perche de faîte, la voile rapiécée qui retombe en
// plis et en festons, deux palmes jetées dessus ; au pignon ouvert, la couche, la couverture, la lanterne ; devant, le
// feu, son trépied et sa marmite ; le tonneau et la caisse de l'épave, le filet qui sèche ; SOS écrit en galets
function palier2(n = 0) {
  const g = rnd(23), p = 'f2';
  let s = sol(p, 70, 34, g) + ombreSol(`${p}o`, -8, 0, 54, 24, 0.22);
  // ——— la tente ———
  const u0 = -0.92, u1 = 0.22, v0 = -0.98, v1 = -0.18, vm = (v0 + v1) / 2, h = 44;
  // (l'intérieur, au pignon ouvert : l'ombre, la couche de palmes, la couverture, la lanterne)
  s += `<path d="${poly([iso(u1, v0, 0), iso(u1, vm, h), iso(u1, v1, 0)])}" fill="#22302C"/>`
    + `<path d="${poly([iso(u1, v0 + 0.08, 0), iso(u1 - 0.6, v0 + 0.08, 0), iso(u1 - 0.6, v1 - 0.08, 0), iso(u1, v1 - 0.08, 0)])}" fill="#3A8068"/>`
    + plan(poly([iso(u1 + 0.02, vm - 0.16, 2), iso(u1 - 0.5, vm - 0.16, 2), iso(u1 - 0.5, v1 - 0.1, 2), iso(u1 + 0.02, v1 - 0.1, 2)]), '#D8664A', 0.6)
    + trait(ligne([iso(u1 + 0.02, vm + 0.04, 2.4), iso(u1 - 0.5, vm + 0.04, 2.4)]), '#F4E4C8', 1.1)
    + lanterne(`${p}la`, ...iso(u1 - 0.14, vm, h - 5), 5);
  // (le pan de devant : la voile rapiécée, plus claire au soleil, qui retombe en festons entre les pierres)
  const R0 = iso(u0, vm, h), R1 = iso(u1, vm, h), E0 = iso(u0, v1 + 0.12, -2), Wr = (u1 - u0) * PAS, Vd = [E0[0] - R0[0], E0[1] - R0[1]], Hd = Math.hypot(...Vd), V = [Vd[0] / Hd, Vd[1] / Hd];
  const feston = `M0,0 H${f(Wr)} V${f(Hd - 2)} Q${f(Wr * 0.83)},${f(Hd + 1)} ${f(Wr * 0.66)},${f(Hd - 3)} Q${f(Wr * 0.5)},${f(Hd + 1.6)} ${f(Wr * 0.33)},${f(Hd - 2.6)} Q${f(Wr * 0.16)},${f(Hd + 1)} 0,${f(Hd - 2)} Z`;
  s += plaque(`${p}v`, R0, AXE_U, V, Wr, Hd,
    `<rect width="${f(Wr)}" height="${f(Hd)}" fill="${SKIN ? mix(toile(''), '#FFFFFF', 0.72) : '#F2E6CC'}"/>` + [[5, 6, 16, 13, toile('#D8664A')], [28, 16, 15, 12, SKIN ? mix(toile(''), '#FFFFFF', 0.35) : '#6FA3D9'], [8, 28, 20, 9, '#EBC46F']].map(([x, y, w, hh, c]) => `<rect x="${x}" y="${y}" width="${w}" height="${hh}" fill="${c}" opacity=".9"/><rect x="${x + 0.8}" y="${y + 0.8}" width="${w - 1.6}" height="${hh - 1.6}" fill="none" stroke="#5A4A3A" stroke-width=".45" stroke-dasharray="1.2 .8"/>`).join('')
    // (les plis : des bandes d'ombre et de lumière du faîte vers le bas)
    + [0.18, 0.42, 0.7, 0.88].map((t, i) => `<path d="M${f(Wr * t)},0 Q${f(Wr * t + 2)},${f(Hd * 0.5)} ${f(Wr * t - 1)},${f(Hd)}" stroke="${i % 2 ? '#FFFFFF' : B.OMBRE_F}" stroke-width="${i % 2 ? 1.4 : 2.4}" opacity="${i % 2 ? 0.35 : 0.18}" fill="none"/>`).join('')
    + `<defs>${lin(`${p}vo`, 0, 0, 0, Hd, [[0, B.SOLEIL, 0.25], [0.6, B.SOLEIL, 0], [1, B.OMBRE_F, 0.25]])}</defs><rect width="${f(Wr)}" height="${f(Hd)}" fill="url(#${p}vo)"/>`
    + (B.hiver() ? `<path d="M0,0 H${f(Wr)} V${f(Hd * 0.45)} Q${f(Wr * 0.75)},${f(Hd * 0.55)} ${f(Wr * 0.5)},${f(Hd * 0.42)} Q${f(Wr * 0.25)},${f(Hd * 0.52)} 0,${f(Hd * 0.4)} Z" fill="${B.NEIGE}"/>` : ''), feston);
  s += `<path d="M${P2(...R0)} L${P2(...R1)}" stroke="${ENCRE}" stroke-width="${B.TRAIT}"/>` + plaque(`${p}vc`, R0, AXE_U, V, Wr, Hd, `<path d="${feston}" fill="none" stroke="${ENCRE}" stroke-width="${f(B.TRAIT)}"/>`)
    + trait(ligne([R0, E0]), ENCRE, B.TRAIT) + trait(ligne([R1, plus(E0, [R1[0] - R0[0], R1[1] - R0[1]])]), ENCRE, B.TRAIT);
  // (deux palmes jetées sur la voile, depuis le faîte)
  s += palme(...plus(R0, [R1[0] - R0[0], R1[1] - R0[1]], 0.25), ...plus(plus(R0, [R1[0] - R0[0], R1[1] - R0[1]], 0.12), Vd, 0.8), 6, g)
    + palme(...plus(R0, [R1[0] - R0[0], R1[1] - R0[1]], 0.62), ...plus(plus(R0, [R1[0] - R0[0], R1[1] - R0[1]], 0.78), Vd, 0.72), 5.4, g);
  // (les pierres qui tiennent le bas de la voile)
  s += [0.08, 0.5, 0.92].map(t => galet(...plus(plus(E0, [R1[0] - R0[0], R1[1] - R0[1]], t), V, -1.5), 3.2, g, '#C8C0B0', true)).join('');
  // (aux deux bouts, deux avirons de la chaloupe croisés, pales en l'air, ligaturés ; la gaffe en perche de faîte)
  for (const u of [u0 - 0.02, u1 + 0.02]) {
    const c = iso(u, vm, h + 1), a = iso(u, v0 + 0.02, 0), b = iso(u, v1 - 0.02, 0);
    s += aviron(...a, ...plus(c, [c[0] - a[0], c[1] - a[1]], 0.22), g, { pale: 11 }) + aviron(...b, ...plus(c, [c[0] - b[0], c[1] - b[1]], 0.22), g, { pale: 11 })
      + trait(`M${P2(c[0] - 2.6, c[1] - 1)} l5.2,2 M${P2(c[0] - 2.6, c[1] + 1)} l5.2,-2`, '#E0C08A', 1.1);
  }
  s += buche(...iso(u0 - 0.2, vm, h + 1), ...iso(u1 + 0.2, vm, h + 1), 1.4, g, { c: '#9A6A3A' }) + trait(`M${P2(...iso(u1 + 0.2, vm, h + 1))} l3,-2 l-1,3`, '#7A8090', 1.2);
  // ——— le feu devant, le trépied et sa marmite ———
  const fx = 18, fy = 24, tete = [fx, fy - 32];
  s += flaque(`${p}fl`, fx, fy, 40) + cercle(fx, fy, 15, 10, g, false) + cendres(fx, fy, 10, g);
  s += buche(fx + 1, fy - 6, tete[0], tete[1], 1.1, g, { flotte: true }) + buche(fx - 8, fy + 2, fx + 7, fy, 1.5, g, { flotte: true });
  s += flammes(`${p}fe${n}`, fx, fy - 1, 1, n);
  s += trait(ligne([tete, [fx, fy - 16]]), '#4A4048', 0.8, ' stroke-dasharray="1 .5"') + marmite(fx, fy - 9, 4.2);
  s += [[-15, 6], [15, 4]].map(([dx, dy]) => buche(fx + dx, fy + dy, tete[0], tete[1], 1.1, g, { flotte: true })).join('') + trait(`M${P2(tete[0] - 2.4, tete[1] + 3)} l4.8,1.4 M${P2(tete[0] - 2.4, tete[1] + 5)} l4.8,1.4`, '#E0C08A', 1);
  s += cercle(fx, fy, 15, 10, g, true);
  // ——— à gauche : le tonneau et la caisse de l'épave, le filet qui sèche dessus ———
  s += contact(-50, 16, 9) + tonneau(-50, 16, 6, 14, g) + contact(...iso(-0.34, 0.86, 0), 13, 0.3) + caisse(`${p}c`, -0.34, 0.86, 0.36, 10, g);
  const cz = iso(-0.34, 0.86, 10);
  s += Array.from({ length: 5 }, (_, i) => trait(`M${P2(cz[0] - 9 + i * 4, cz[1] - 3)} Q${P2(cz[0] - 8 + i * 4, cz[1] + 4)} ${P2(cz[0] - 10 + i * 4.4, cz[1] + 10)}`, '#5A8AA8', 0.6)).join('')
    + Array.from({ length: 4 }, (_, i) => trait(`M${P2(cz[0] - 10, cz[1] - 1 + i * 3)} Q${P2(cz[0], cz[1] + 1 + i * 3)} ${P2(cz[0] + 9, cz[1] - 3 + i * 3)}`, '#5A8AA8', 0.6)).join('')
    + [[-6, 4], [4, 7]].map(([dx, dy]) => `<circle cx="${f(cz[0] + dx)}" cy="${f(cz[1] + dy)}" r="1.3" fill="#EBC46F" stroke="${ENCRE}" stroke-width=".4"/>`).join('');
  s += pied([[-64, 6], [-56, 22], [-40, 30], [58, 10], [34, 40], [62, -6], [-70, -10], [-30, -36], [40, -20]], g) + chaleur(`${p}ch`, fx, fy - 6, 40);
  return s;
}

// ═══ palier III : la cabane de planches d'épave ═══
// Des bordages de l'épave cloués à l'horizontale, leurs peintures délavées et écaillées, sur un soubassement de galets ;
// un toit de palmes épais, sa corde de faîte, sa frange ; le hublot récupéré en guise de fenêtre, la porte de planches et
// sa poignée de corde, la lanterne sur sa potence ; dehors, le feu gardé dans son cercle, sa grille et sa bouilloire ; le
// tonneau d'eau de pluie et sa gouttière de bambou fendu
function palier3(n = 0) {
  let g = rnd(37);
  const p = 'f3';
  const u0 = -0.9, u1 = 0.22, v0 = -0.78, v1 = 0.18, hS = 4, hM = 30, vm = (v0 + v1) / 2;
  let s = sol(p, 68, 33, g, { sable: 0.45 }) + ombreSol(`${p}o`, -6, 2, 58, 26, 0.3);
  // ——— les murs ———
  s += boite(`${p}s`, [u0, v0, u1, v1], 0, hS, { gauche: (W, H) => tPierres(W, H, g, { haut: 2.4, long: 4.6, mousse: 0.35 }), droite: (W, H) => tPierres(W, H, g, { haut: 2.4, long: 4.6, mousse: 0.35 }), voile: { pied: 0.15, haut: 0 }, arete: null });
  const xp = 0.56;
  s += boite(`${p}m`, [u0, v0, u1, v1], hS, hM, {
    gauche: (W, H) => B.tBordages(W, H, g)
      + hublot(`${p}h1`, W * 0.24, H * 0.42, 4.2)
      // (la porte de planches brutes, ses traverses en Z, sa poignée de corde)
      + `<rect x="${f(W * xp)}" y="3" width="12" height="${f(H - 3)}" fill="#A8743E" stroke="${ENCRE}" stroke-width=".7"/>` + [1, 2].map(i => `<rect x="${f(W * xp + i * 4)}" y="3" width=".6" height="${f(H - 3)}" fill="#6A4428"/>`).join('')
      + `<path d="M${P2(W * xp + 0.5, 7)} H${f(W * xp + 11.5)} L${f(W * xp + 0.5)},${f(H - 4)} H${f(W * xp + 11.5)}" fill="none" stroke="#6A4428" stroke-width="1.6"/>`
      + `<circle cx="${f(W * xp + 9.6)}" cy="${f(H * 0.55)}" r="1.4" fill="none" stroke="#E0C08A" stroke-width=".9"/>`,
    droite: (W, H) => B.tBordages(W, H, g)
  });
  // ——— le toit de palmes ———
  const t = toit(`${p}t`, [u0, v0, u1, v1], hM, 24, 0.13, 'v', { couvre: couverture(g, (W, H, soleil) => B.tPalmes(W, H, g, soleil)), pignon: (W, H) => B.tBordages(W, H, g) + hublot(`${p}h0`, W / 2, H * 0.62, 3), faitage: '#6A5A2A' });
  // (la suite tire ses hasards à part : le toit d'un skin n'en consomme pas autant que les palmes)
  g = rnd(38);
  s += t.svg + trait(ligne([surPan(t, 0.02, 0.03), surPan(t, 0.98, 0.03)]), '#E0C08A', 1.3) + [0.15, 0.45, 0.75].map(x => trait(ligne([surPan(t, x, 0), surPan(t, x + 0.015, 0.14)]), '#E0C08A', 1)).join('');
  // (la frange de palmes à l'égout, et sur la rive du pan de derrière, au-dessus du pignon)
  for (let k = 0.04; k < 0.98; k += 0.06) { const q = plus(t.R1, [t.B1[0] - t.R1[0], t.B1[1] - t.R1[1]], k); s += `<path d="M${P2(q[0] - 1.6, q[1] - 0.6)} q-.4,2.6 .6,${f(3 + g() * 2)} q1.2,-1.6 1.6,${f(-3 - g())} Z" fill="${g() < 0.4 ? '#C8A050' : '#4E8A48'}"/>`; }
  for (let x = 0.01; x < 0.99; x += 0.011) { const q = surPan(t, x, 1); const sec = g() < 0.4; s += `<path d="M${P2(q[0] - 0.8, q[1] - 1.5)} q${f(-0.6 + g())},3 ${f(0.4 + (g() - 0.5))},${f(3 + g() * 3)} q.8,-2 .8,${f(-3 - g() * 2)} Z" fill="${sec ? '#C8A050' : '#5A9A48'}"/>`; }
  // (la lanterne sur sa potence, à côté de la porte)
  const lp = iso(u0 + (u1 - u0) * (xp - 0.06), v1, 25);
  s += trait(`M${P2(lp[0] + 1, lp[1])} l-5,2.5 M${P2(lp[0] + 1, lp[1] + 4)} l-4,-1.5`, '#3A3038', 1.1) + lanterne(`${p}la`, lp[0] - 4, lp[1] + 2.5, 2);
  // (le tonneau d'eau de pluie au coin, la gouttière de bambou fendu qui y descend ; pas de bois rangé : les réserves de
  // bois ne se montrent que si la maison en a, choix de l'auteur, 18 oct.)
  const bc = iso(u1 + 0.18, v1 + 0.04, 0);
  const g0 = surPan(t, 0.6, 1.02), g1 = surPan(t, 0.98, 1.02), gb = [bc[0], bc[1] - 13];
  s += trait(ligne([g0, g1, gb]), '#6A5A2A', 2.4) + trait(ligne([g0, g1, gb]), '#C8B060', 1.5) + trait(ligne([plus(g0, [0, -0.5]), plus(g1, [0, -0.5]), plus(gb, [0.5, 0])]), '#F0E0A0', 0.5);
  s += contact(bc[0], bc[1], 8) + tonneau(bc[0], bc[1], 5.2, 12, g) + `<ellipse cx="${f(bc[0])}" cy="${f(bc[1] - 12)}" rx="4" ry="1.9" fill="#5FB0DD"/><ellipse cx="${f(bc[0] - 1)}" cy="${f(bc[1] - 12.4)}" rx="1.6" ry=".6" fill="#FFFFFF" opacity=".7"/>`;
  // ——— dehors : le feu gardé dans son cercle, sa grille de fer et sa bouilloire ———
  const [fx, fy] = iso(-0.12, 0.74, 0);
  s += flaque(`${p}fl`, fx, fy, 38) + cercle(fx, fy, 14, 10, g, false) + cendres(fx, fy, 9, g);
  s += buche(fx - 7, fy + 1, fx + 1, fy - 7, 1.5, g) + buche(fx + 7, fy, fx - 1, fy - 7, 1.5, g);
  s += flammes(`${p}fe${n}`, fx, fy - 1, 0.85, n);
  s += plan(`M${P2(fx - 12, fy - 9)} L${P2(fx + 12, fy - 9)} L${P2(fx + 12, fy - 7.6)} L${P2(fx - 12, fy - 7.6)} Z`, '#3A3A44', 0.6) + [-8, -4, 0, 4, 8].map(dx => trait(`M${P2(fx + dx, fy - 9)} l1.6,-.4`, '#5A5A66', 0.7)).join('')
    + plan(`M${P2(fx + 1, fy - 9)} Q${P2(fx, fy - 15)} ${P2(fx + 5, fy - 15)} Q${P2(fx + 10, fy - 15)} ${P2(fx + 9, fy - 9)} Z`, '#B87A48', 0.7) + plan(`M${P2(fx + 9, fy - 12.4)} L${P2(fx + 13, fy - 14)} L${P2(fx + 12.6, fy - 13)} L${P2(fx + 9, fy - 11.4)} Z`, '#B87A48', 0.5)
    + trait(`M${P2(fx + 2, fy - 14)} Q${P2(fx + 5, fy - 19)} ${P2(fx + 8, fy - 14)}`, '#4A4A54', 0.8);
  s += cercle(fx, fy, 14, 10, g, true);
  s += pied([[-66, 0], [-52, 22], [-66, -14], [58, 16], [64, -2], [26, 42], [-12, 38], [46, 30]], g) + chaleur(`${p}ch`, fx, fy - 6, 34);
  return s;
}

// ═══ palier IV : la case sur pilotis ═══
// Une plateforme de planches sur des pilotis de bambou ligaturés et contreventés ; la case de bambou tressé, son toit de
// paille dorée haut et pentu, ses stores roulés ; la véranda, sa rambarde de bambou et le hamac tendu entre deux
// poteaux ; l'échelle ; au pied, le feu du Foyer et sa jarre d'eau, le séchoir à poissons ; la lanterne de l'épave
function palier4(n = 0) {
  let g = rnd(41);
  const p = 'f4';
  const zP = 16, D0 = [-1.15, -1.05, 0.62, 0.6];
  let s = sol(p, 104, 50, g, { sable: 0.35 }) + ombreSol(`${p}o`, -6, 6, 92, 42, 0.32);
  // ——— les pilotis de derrière (sous la plateforme), puis la plateforme ———
  const pil = (u, v) => { const a = iso(u, v, 0), b = iso(u, v, zP + 2); return contact(a[0], a[1], 4, 0.3) + bambou(a[0], a[1], b[0], b[1], 1.8); };
  s += pil(D0[0] + 0.05, D0[1] + 0.05) + pil(D0[2] - 0.05, D0[1] + 0.05) + pil(D0[0] + 0.05, D0[3] - 0.05);
  // (les croix de contreventement sous la plateforme, de face)
  s += [[D0[0] + 0.05, D0[3] - 0.05, (D0[0] + D0[2]) / 2, D0[3] - 0.05], [(D0[0] + D0[2]) / 2, D0[3] - 0.05, D0[2] - 0.05, D0[3] - 0.05]].map(([ua, va, ub, vb]) => { const a = iso(ua, va, 1), b = iso(ub, vb, zP - 1), c = iso(ua, va, zP - 1), d = iso(ub, vb, 1); return bambou(...a, ...b, 0.9) + bambou(...c, ...d, 0.9); }).join('');
  // (le hamac, à l'ombre sous la plateforme, entre deux pilotis : sa toile rayée qui se creuse)
  const h0 = iso(D0[0] + 0.05, D0[3] - 0.05, 12), h1 = iso((D0[0] + D0[2]) / 2, D0[3] - 0.05, 12), hc = [(h0[0] + h1[0]) / 2, Math.max(h0[1], h1[1]) + 9];
  s += trait(`M${P2(...h0)} Q${P2(...hc)} ${P2(...h1)}`, ENCRE, 5) + trait(`M${P2(...h0)} Q${P2(...hc)} ${P2(...h1)}`, '#E8DCC4', 4) + trait(`M${P2(...h0)} Q${P2(...hc)} ${P2(...h1)}`, '#D8664A', 1.4, ' stroke-dasharray="3 3"')
    + trait(`M${P2(h0[0], h0[1] - 2)} Q${P2(hc[0], hc[1] - 3)} ${P2(h1[0], h1[1] - 2)}`, '#FFFFFF', 0.6, ' opacity=".6"');
  s += pil((D0[0] + D0[2]) / 2, D0[3] - 0.05) + pil(D0[2] - 0.05, D0[3] - 0.05) + pil(D0[2] - 0.05, (D0[1] + D0[3]) / 2);
  s += boite(`${p}pl`, D0, zP, zP + 3, { gauche: (W, H) => B.tPlanches(W, H, g, { horiz: true, larg: 1.5, c: '#B8844A' }), droite: (W, H) => B.tPlanches(W, H, g, { horiz: true, larg: 1.5, c: '#B8844A' }), dessus: (W, H) => B.tPlanches(W, H, g, { larg: 4.2, c: '#D8A868' }) + `<rect width="${f(W)}" height="${f(H)}" fill="#FFF1C8" opacity=".08"/>`, arete: null });
  // ——— la case de bambou tressé ———
  const C = [-1.05, -0.98, 0.22, 0.05], zB = zP + 3, hM = zB + 28, xp = 0.42;
  s += boite(`${p}m`, C, zB, hM, {
    gauche: (W, H) => B.tTresse(W, H, g)
      // (la porte ouverte : l'ombre de l'intérieur, la natte, le rideau de perles de bois)
      + `<rect x="${f(W * xp)}" y="4" width="13" height="${f(H - 4)}" fill="#3A2A1E"/><rect x="${f(W * xp)}" y="${f(H - 4)}" width="13" height="4" fill="#C89A5A" opacity=".8"/>`
      + Array.from({ length: 6 }, (_, i) => `<path d="M${f(W * xp + 1.4 + i * 2)},4 L${f(W * xp + 1.4 + i * 2)},${f(H * 0.55 + (i % 2) * 3)}" stroke="#E0B070" stroke-width=".8" stroke-dasharray="1.2 .8"/>`).join('')
      + `<rect x="${f(W * xp - 1.4)}" y="2.4" width="15.8" height="2.2" fill="#A8843A" stroke="${ENCRE}" stroke-width=".5"/>`
      // (la fenêtre, son store de bambou roulé en haut)
      + `<rect x="${f(W * 0.12)}" y="7" width="11" height="10" fill="#3A2A1E" stroke="#8A6A3A" stroke-width="1.2"/><rect x="${f(W * 0.12 - 0.6)}" y="5" width="12.2" height="3" rx="1.4" fill="#D8B870" stroke="${ENCRE}" stroke-width=".5"/>`
      + `<rect x="${f(W * 0.12 + 1)}" y="11" width="9" height="5" fill="#FFC870" opacity=".6"/>` + B.lueur(`${p}wl`, W * 0.12 + 5.5, 12, 10, CHAUD, 0.35),
    droite: (W, H) => B.tTresse(W, H, g) + `<rect x="${f(W * 0.3)}" y="7" width="10" height="9" fill="#3A2A1E" stroke="#8A6A3A" stroke-width="1.2"/><rect x="${f(W * 0.3 - 0.6)}" y="5" width="11.2" height="3" rx="1.4" fill="#D8B870" stroke="${ENCRE}" stroke-width=".5"/>`
  });
  // (les poteaux d'angle de bambou de la case)
  for (const [u, v] of [[C[0], C[3]], [C[2], C[3]], [C[2], C[1]]]) { const a = iso(u, v, zB), b = iso(u, v, hM); s += bambou(a[0], a[1], b[0], b[1], 1.6); }
  // ——— le toit de paille dorée, haut et pentu ———
  const t = toit(`${p}t`, C, hM, 36, 0.2, 'v', { couvre: couverture(g, (W, H, soleil) => tChaume(W, H, g, soleil, { fonce: '#A8782A', clair: '#F4D27A', haut: 4.5 })), pignon: (W, H) => B.tTresse(W, H, g, { c: '#D8B070' }), faitage: '#8A6A2A' });
  g = rnd(42);
  s += t.svg + trait(ligne([surPan(t, 0.02, 0.03), surPan(t, 0.98, 0.03)]), '#6A5A2A', 2.4) + [0.1, 0.35, 0.6, 0.85].map(x => trait(ligne([surPan(t, x, 0), surPan(t, x + 0.01, 0.12)]), '#6A5A2A', 1.2)).join('');
  for (let x = 0.01; x < 0.99; x += 0.01) { const q = surPan(t, x, 1); s += trait(`M${P2(q[0], q[1] - 1)} l${f((g() - 0.5) * 1.2)},${f(2.4 + g() * 3)}`, g() < 0.5 ? '#C99A45' : '#F0D07A', 0.9); }
  for (let k = 0.04; k < 0.98; k += 0.05) { const q = plus(t.R1, [t.B1[0] - t.R1[0], t.B1[1] - t.R1[1]], k); s += trait(`M${P2(q[0], q[1])} l${f(-0.6 + g() * 0.6)},${f(2.4 + g() * 2.4)}`, g() < 0.5 ? '#C99A45' : '#F0D07A', 0.9); }
  // ——— la véranda : sa rambarde de bambou, le hamac, la lanterne de l'épave ———
  const r0 = iso(D0[0] + 0.04, D0[3] - 0.04, zP + 3), r1 = iso(D0[2] - 0.04, D0[3] - 0.04, zP + 3), r2 = iso(D0[2] - 0.04, D0[1] + 0.04, zP + 3);
  const montant = q => bambou(q[0], q[1], q[0], q[1] - 13, 1.1);
  s += [0.55, 0.78, 1].map(k => montant(plus(r0, [r1[0] - r0[0], r1[1] - r0[1]], k))).join('') + [0.4, 0.7].map(k => montant(plus(r1, [r2[0] - r1[0], r2[1] - r1[1]], k))).join('');
  s += bambou(...plus(plus(r0, [r1[0] - r0[0], r1[1] - r0[1]], 0.55), [0, -12]), ...plus(r1, [0, -12]), 1) + bambou(...plus(r1, [0, -12]), ...plus(plus(r1, [r2[0] - r1[0], r2[1] - r1[1]], 0.7), [0, -12]), 1);
  s += lanterne(`${p}la`, ...iso(C[0] + 0.3, C[3] + 0.08, hM - 4), 3);
  // ——— l'échelle de bambou, de la véranda au sol ———
  const e0 = iso(D0[0] + 0.4, D0[3] + 0.32, 0), e1 = iso(D0[0] + 0.4, D0[3], zP + 3);
  s += bambou(e0[0] - 4, e0[1], e1[0] - 4, e1[1], 1.1) + bambou(e0[0] + 4, e0[1], e1[0] + 4, e1[1], 1.1) + [0.2, 0.4, 0.6, 0.8].map(k => { const q = plus([e0[0], e0[1]], [e1[0] - e0[0], e1[1] - e0[1]], k); return trait(`M${P2(q[0] - 4, q[1])} L${P2(q[0] + 4, q[1])}`, '#B89A4A', 1.4); }).join('');
  // ——— au pied : le feu du Foyer et sa jarre d'eau, le séchoir à poissons ———
  const [fx, fy] = iso(1.28, 0.92, 0);
  s += flaque(`${p}fl`, fx, fy, 44) + cercle(fx, fy, 15, 11, g, false) + cendres(fx, fy, 10, g);
  s += buche(fx - 8, fy + 1, fx + 1, fy - 8, 1.6, g) + buche(fx + 8, fy, fx - 1, fy - 8, 1.6, g);
  s += flammes(`${p}fe${n}`, fx, fy - 1, 0.95, n);
  s += cercle(fx, fy, 15, 11, g, true);
  const jx = fx - 34, jy = fy + 2;
  s += contact(jx, jy, 7) + plan(`M${P2(jx - 3, jy)} Q${P2(jx - 7, jy - 6)} ${P2(jx - 4, jy - 11)} L${P2(jx - 2.4, jy - 13)} L${P2(jx + 2.4, jy - 13)} L${P2(jx + 4, jy - 11)} Q${P2(jx + 7, jy - 6)} ${P2(jx + 3, jy)} Z`, '#C8743E', 0.8)
    + `<path d="M${P2(jx + 1, jy - 1)} Q${P2(jx + 6, jy - 6)} ${P2(jx + 3.4, jy - 11)} L${P2(jx + 4, jy - 11)} Q${P2(jx + 7, jy - 6)} ${P2(jx + 3, jy)} Z" fill="${B.OMBRE_F}" opacity=".3"/>`
    + ovale(jx, jy - 13, 2.6, 0.9, '#8A4A22', 0.6) + trait(`M${P2(jx - 5, jy - 7)} Q${P2(jx, jy - 5)} ${P2(jx + 5, jy - 7)}`, '#F0C090', 0.7, ' opacity=".8"');
  // (le séchoir : deux montants, la traverse, les poissons pendus)
  const sx = iso(1.25, -0.25, 0);
  s += contact(sx[0], sx[1], 14, 0.25) + bambou(sx[0] - 12, sx[1] + 4, sx[0] - 12, sx[1] - 26, 1.2) + bambou(sx[0] + 12, sx[1] - 4, sx[0] + 12, sx[1] - 34, 1.2) + bambou(sx[0] - 13, sx[1] - 25, sx[0] + 13, sx[1] - 33, 1.1)
    + [-6, 0, 6].map((dx, i) => { const q = [sx[0] + dx, sx[1] - 29 - dx * 0.33]; return trait(`M${P2(...q)} l0,3`, '#5A4A3A', 0.5) + `<g transform="translate(${f(q[0])} ${f(q[1] + 8)}) rotate(90)">${poisson(0, 0, i % 2 ? 1 : -1)}</g>`; }).join('');
  s += pied([[-100, 10], [-80, 30], [90, 20], [100, 0], [40, 58], [-30, 56], [-104, -16], [70, 44]], g) + chaleur(`${p}ch`, fx, fy - 6, 40);
  return s;
}

// L'hirondelle de proue (la figure de proue de l'épave, l'Hirondelle) : bois sculpté peint, ailes déployées, en (x, y),
// de taille k ; sens 1 : regarde à droite
const hirondelle = (x, y, k = 1, sens = -1) => `<g transform="translate(${f(x)} ${f(y)}) scale(${f(k * sens)} ${f(k)})">`
  + plan('M-10,1 Q-4,-6 4,-3 Q8,-2 10,-4 Q8,0 4,1 Q-2,3 -10,1 Z', '#2A4A7A', 0.7)
  + plan('M-2,-2 Q-8,-12 -16,-10 Q-10,-6 -4,0 Z', '#3A5A8A', 0.6) + plan('M2,-2 Q-2,-14 -10,-16 Q-4,-8 0,0 Z', '#4A6A9A', 0.6)
  + `<path d="M-6,0 Q0,2.4 6,0 Q0,1 -6,0 Z" fill="#E8DCC4"/><path d="M8,-3 L11,-3.6 L8.6,-2 Z" fill="#E8A040"/><circle cx="6.4" cy="-3" r=".7" fill="#FFF4DC"/>`
  + trait('M-10,1 L-14,4 M-10,1 L-14,0', '#2A4A7A', 1.2) + trait('M-2,-2 Q-8,-11 -15,-10', '#C8963A', 0.6) + '</g>';
// Le mât de l'épave planté en vigie : le fût, ses échelons, la hune (la plateforme ronde et sa rambarde), la flamme qui
// claque au vent ; au pied, en (u, v), haut de h
function vigie(id, u, v, h, g, { flamme = '#D8664A' } = {}) {
  const a = iso(u, v, 0), b = iso(u, v, h), hune = iso(u, v, h - 12);
  let s = contact(a[0], a[1], 6, 0.35) + buche(a[0], a[1], b[0], b[1] + 1, 2.2, g, { c: '#8A5A36', bois: '#C8894E' });
  for (let z = 8; z < h - 16; z += 6) { const q = iso(u, v, z); s += trait(`M${P2(q[0] - 3.4, q[1])} L${P2(q[0] + 3.4, q[1])}`, '#5A3A22', 1.2); }
  s += ovale(hune[0], hune[1] + 1.5, 10, 4.2, '#5A3A22', 0.8) + ovale(hune[0], hune[1], 10, 4.2, '#A8743E', 0.9)
    + trait(`M${P2(hune[0] - 10, hune[1] - 5)} A10,4.2 0 0,0 ${P2(hune[0] + 10, hune[1] - 5)}`, '#5A3A22', 1.1)
    + [-9, -5, 0, 5, 9].map(dx => trait(`M${P2(hune[0] + dx, hune[1] + Math.sqrt(1 - (dx / 10) ** 2) * 4.2)} l0,-5`, '#5A3A22', 0.9)).join('')
    + `<path d="M${P2(b[0] + 1, b[1] + 2)} Q${P2(b[0] + 9, b[1] + 1)} ${P2(b[0] + 16, b[1] + 4)} Q${P2(b[0] + 9, b[1] + 5)} ${P2(b[0] + 1, b[1] + 7)} Z" fill="${flamme}" stroke="${ENCRE}" stroke-width=".6"/>`
    + `<circle cx="${f(b[0])}" cy="${f(b[1])}" r="1.6" fill="#C8963A" stroke="${ENCRE}" stroke-width=".5"/>`;
  return s;
}

// Une allée de terre battue de (x0, y0) à (x1, y1), large de l : ses bords qui se perdent dans l'herbe, ses traces
function allee(id, x0, y0, x1, y1, l) {
  const d = B.unite([x1 - x0, y1 - y0]), n = [-d[1], d[0]];
  return `<defs>${lin(id, ...plus([x0, y0], n, -l), ...plus([x0, y0], n, l), [[0, B.SABLE[1], 0], [0.3, B.SABLE[1], 0.7], [0.7, B.SABLE[1], 0.7], [1, B.SABLE[1], 0]])}</defs>`
    + `<path d="${poly([plus([x0, y0], n, -l), plus([x1, y1], n, -l * 0.7), plus([x1, y1], n, l * 0.7), plus([x0, y0], n, l)])}" fill="url(#${id})"/>`;
}
// Des fleurs du jeu au pied d'un mur, de a à b : des touffes vertes et leurs petites fleurs
const fleurs = (a, b, g, n = 6, cols = ['#FF7AA8', '#FFD04A', '#FFFFFF', '#B898F0']) => Array.from({ length: n }, (_, i) => { const q = plus(a, [b[0] - a[0], b[1] - a[1]], (i + 0.5) / n + (g() - 0.5) * 0.06); return `<ellipse cx="${f(q[0])}" cy="${f(q[1])}" rx="3.4" ry="1.8" fill="#4E9A5A"/><ellipse cx="${f(q[0] - 0.8)}" cy="${f(q[1] - 0.8)}" rx="2" ry="1" fill="#81BA5E"/>` + [[-1.6, -1.4], [1.2, -1.8], [0, -0.6]].map(([dx, dy], k) => `<circle cx="${f(q[0] + dx)}" cy="${f(q[1] + dy)}" r=".9" fill="${cols[(i + k) % cols.length]}"/>`).join(''); }).join('');

// ═══ palier V : la maison de rondins ═══
// Des rondins sur un soubassement de pierres moussues, un toit de chaume épais, sombre et moussu, sa cheminée de pierre
// qui fume (le feu est entré dans la maison) ; au pignon la porte et l'hirondelle de proue, les fenêtres à volets et
// leurs jardinières ; l'abri à bois en appentis ; le mât de l'épave planté en vigie ; le banc, l'allée de
// dalles, les lanternes
function palier5() {
  const g = rnd(53), p = 'f5';
  const M = [-1.2, -1.1, 0.32, 0.2], hS = 8, hM = 42;
  let s = sol(p, 108, 52, g, { sable: 0.1 }) + ombreSol(`${p}o`, -10, 4, 96, 44, 0.32);
  { const pd = iso(M[0] + (M[2] - M[0]) * 0.49, M[3], 0); s += allee(`${p}al`, pd[0], pd[1], pd[0] - 30, pd[1] + 36, 7); }
  // ——— le mât-vigie, derrière à droite ———
  s += vigie(`${p}v`, 0.95, -1.1, 104, g);
  // ——— la maison ———
  s += boite(`${p}s`, M, 0, hS, { gauche: (W, H) => tPierres(W, H, g, { haut: 4, long: 7, mousse: 0.4 }), droite: (W, H) => tPierres(W, H, g, { haut: 4, long: 7, mousse: 0.4 }), voile: { pied: 0.2, haut: 0 }, arete: null });
  const xp = 0.42;
  s += boite(`${p}m`, M, hS, hM, {
    gauche: (W, H) => tRondins(W, H, g, { haut: 5.6 })
      + fenetre(`${p}w1`, W * 0.1, 9, 10, 11, { volets: '#3E8A7A', fleurs: ['#FF5A8A', '#FFD04A', '#FFFFFF'] })
      + fenetre(`${p}w2`, W * 0.74, 9, 10, 11, { volets: '#3E8A7A', fleurs: ['#B898F0', '#FF8A5A', '#FFFFFF'] })
      // (la porte cintrée, ses planches, ses pentures, son heurtoir)
      + `<path d="M${P2(W * xp, H)} L${P2(W * xp, 9)} Q${P2(W * xp + 8, 1)} ${P2(W * xp + 16, 9)} L${P2(W * xp + 16, H)} Z" fill="#9A5A32" stroke="${ENCRE}" stroke-width=".8"/>`
      + [1, 2, 3].map(i => `<rect x="${f(W * xp + i * 4)}" y="4" width=".6" height="${f(H - 4)}" fill="#6A3A1E"/>`).join('') + [12, H - 7].map(y => `<rect x="${f(W * xp)}" y="${f(y)}" width="11" height="1.6" fill="#3A3A42"/>`).join('')
      + `<circle cx="${f(W * xp + 12.5)}" cy="${f(H * 0.58)}" r="1.5" fill="none" stroke="#C8963A" stroke-width="1"/>`,
    droite: (W, H) => tRondins(W, H, g, { haut: 5.6 }) + fenetre(`${p}w3`, W * 0.2, 9, 9, 10, { volets: '#3E8A7A' }) + fenetre(`${p}w4`, W * 0.66, 9, 9, 10, { volets: '#3E8A7A' })
  });
  for (let z = hS + 2.8, r = 0; z < hM; z += 5.6, r++) for (const [cu, cv, du, dv] of [[M[2], M[3], 1, 0], [M[2], M[3], 0, 1], [M[0], M[3], -1, 0]]) {
    if ((r + (du ? 0 : 1)) % 2) continue;
    const q = iso(cu + du * 0.04, cv + dv * 0.04, z);
    s += ovale(q[0], q[1], 2.8, 2.7, '#E0A96C', 0.6) + `<circle cx="${f(q[0])}" cy="${f(q[1])}" r="1.2" fill="none" stroke="#B87A48" stroke-width=".4"/>`;
  }
  // ——— le toit de chaume épais, sombre et moussu ———
  const t = toit(`${p}t`, M, hM, 38, 0.18, 'v', { couvre: couverture(g, (W, H, soleil) => tChaume(W, H, g, soleil, { fonce: '#6A5A2A', clair: '#C8A85A', haut: 4.6 })), pignon: (W, H) => tRondins(W, H, g, { haut: 5.6 }) + fenetre(`${p}wp`, W / 2 - 4.5, H * 0.45, 9, 9, { arc: true }), faitage: '#4A4A2A' });
  s += t.svg;
  // (le faîtage de mottes herbues, les touffes de mousse sur le chaume, l'égout coupé net)
  s += trait(ligne([surPan(t, 0.01, 0.02), surPan(t, 0.99, 0.02)]), '#4E8A48', 3.6) + trait(ligne([surPan(t, 0.01, 0.0), surPan(t, 0.99, 0.0)]), '#81BA5E', 1.4);
  s += [[0.15, 0.4], [0.42, 0.7], [0.7, 0.3], [0.85, 0.75], [0.3, 0.85]].map(([x, y]) => { const q = surPan(t, x, y); return `<ellipse cx="${f(q[0])}" cy="${f(q[1])}" rx="5" ry="2.4" fill="#4E8A48" opacity=".7"/><ellipse cx="${f(q[0] - 1)}" cy="${f(q[1] - 0.8)}" rx="2.6" ry="1.2" fill="#81BA5E" opacity=".8"/>`; }).join('');
  for (let x = 0.01; x < 0.99; x += 0.01) { const q = surPan(t, x, 1); s += trait(`M${P2(q[0], q[1] - 1.4)} l${f((g() - 0.5) * 0.8)},${f(2 + g() * 1.6)}`, g() < 0.5 ? '#8A7A3A' : '#C8A85A', 1); }
  // (l'hirondelle de proue, au-dessus de la porte)
  s += hirondelle(...iso(M[0] + (M[2] - M[0]) * (xp + 0.07), M[3], hM - 1), 0.9);
  // ——— la cheminée de pierre, sur le pan de droite ———
  const pierre = (W, H) => tPierres(W, H, g, { haut: 3.6, long: 6, mousse: 0.25 });
  const cu = (M[0] + M[2]) / 2, cv = -0.62, zr = hM + 38;
  s += boite(`${p}ch`, [cu - 0.12, cv - 0.12, cu + 0.12, cv + 0.12], zr - 6, zr + 18, { gauche: pierre, droite: pierre }) + boite(`${p}chc`, [cu - 0.15, cv - 0.15, cu + 0.15, cv + 0.15], zr + 18, zr + 21, { gauche: (W, H) => `<rect width="${f(W)}" height="${f(H)}" fill="#C3BBA9"/>`, droite: (W, H) => `<rect width="${f(W)}" height="${f(H)}" fill="#9B927F"/>`, dessus: (W, H) => `<rect width="${f(W)}" height="${f(H)}" fill="#6E6656"/><ellipse cx="${f(W / 2)}" cy="${f(H / 2)}" rx="${f(W * 0.3)}" ry="${f(H * 0.3)}" fill="#2A221E"/>` });
  // ——— l'abri à bois en appentis contre le mur de droite, vide (les réserves de bois ne se montrent que si la maison en
  // a : choix de l'auteur, 18 oct.) ———
  const A = [M[2], -0.75, M[2] + 0.38, -0.15];
  for (const v of [A[1], A[3]]) { const a = iso(A[2], v, 0), b = iso(A[2], v, 24); s += buche(a[0], a[1], b[0], b[1], 1.4, g, { c: '#8A5A36' }); }
  s += plaque(`${p}ap`, iso(M[2] - 0.02, A[1] - 0.06, 30), B.AXE_V, B.unite([iso(A[2] + 0.06, 0, 23)[0] - iso(M[2] - 0.02, 0, 30)[0], iso(A[2] + 0.06, 0, 23)[1] - iso(M[2] - 0.02, 0, 30)[1]]), (A[3] - A[1] + 0.12) * PAS, Math.hypot(...[iso(A[2] + 0.06, 0, 23)[0] - iso(M[2] - 0.02, 0, 30)[0], iso(A[2] + 0.06, 0, 23)[1] - iso(M[2] - 0.02, 0, 30)[1]]),
    B.tPlanches((A[3] - A[1] + 0.12) * PAS, 24, g, { c: '#9A6A3A', larg: 3 }));
  // ——— devant : l'allée de dalles, le banc, la lanterne sur son poteau (pas de potager : les vrais champs viendront du
  // jeu, choix de l'auteur, 18 oct.) ———
  const pd = iso(M[0] + (M[2] - M[0]) * (xp + 0.07), M[3], 0);
  s += fleurs(iso(M[0], M[3] + 0.04, 0), iso(M[0] + (M[2] - M[0]) * (xp - 0.02), M[3] + 0.04, 0), g, 4) + fleurs(iso(M[0] + (M[2] - M[0]) * (xp + 0.2), M[3] + 0.04, 0), iso(M[2], M[3] + 0.04, 0), g, 4);
  s += [[0, 6], [-4, 13], [2, 20], [-3, 28]].map(([dx, dy], i) => ovale(pd[0] + dx - 4 - i * 3, pd[1] + dy, 6, 2.6, i % 2 ? '#C3BBA9' : '#D8D2C2', 0.6)).join('');
  const bn = iso(M[0] + 0.15, M[3] + 0.2, 0);
  s += contact(bn[0], bn[1], 12, 0.25) + boite(`${p}bn`, [M[0] + 0.05, M[3] + 0.12, M[0] + 0.45, M[3] + 0.24], 6, 8, { gauche: (W, H) => B.tPlanches(W, H, g, { horiz: true, larg: 2 }), droite: (W, H) => B.tPlanches(W, H, g, { horiz: true, larg: 2 }), dessus: (W, H) => B.tPlanches(W, H, g, { larg: 3 }), arete: null })
    + [[M[0] + 0.08, M[3] + 0.22], [M[0] + 0.42, M[3] + 0.22]].map(([u, v]) => { const a = iso(u, v, 0), b = iso(u, v, 6); return trait(`M${P2(...a)} L${P2(...b)}`, '#6A4428', 2); }).join('');
  const lt = iso(M[0] + (M[2] - M[0]) * (xp + 0.32), M[3] + 0.5, 0);
  s += contact(lt[0], lt[1], 4) + trait(`M${P2(...lt)} L${P2(lt[0], lt[1] - 30)} l5,0`, '#3A3038', 1.6) + lanterne(`${p}la`, lt[0] + 5, lt[1] - 30, 2);
  s += pied([[-110, 6], [-90, 30], [100, 10], [104, -16], [20, 60], [-40, 58], [-112, -20], [70, 56]], g);
  return s;
}

// ═══ palier V, trapu et généreux (proposition, choix de l'auteur, 18 oct. : « pas de vie », « tape au mieux ») ═══
// La même maison, dessinée autrement : des rondins plus gros, un soubassement de grosses pierres, un toit de chaume dodu
// et doré en gros bourrelets moussus, son égout qui roule en boudin ; une lumière franche (le soleil chaud, l'ombre
// froide et profonde) ; des buissons aux grandes feuilles et des fleurs qui mangent le pied de la maison ; des fenêtres
// qui luisent, la fumée en nuages ronds
function palier5b() {
  B.STYLE.organique = true; B.BORD.doux = true;
  try {
    const g = rnd(53), p = 'f5b';
    const M = [-1.2, -1.1, 0.32, 0.2], hS = 9, hM = 44, xp = 0.4;
    let s = sol(p, 112, 54, g, { sable: 0.15 }) + B.ombrePortee(`${p}op`, [iso(M[0], M[3], 0), iso(M[2], M[3], 0), iso(M[2], M[1], 0), iso(M[0], M[1], 0)], 70, 0.32);
    { const pd = iso(M[0] + (M[2] - M[0]) * (xp + 0.09), M[3], 0); s += allee(`${p}al`, pd[0], pd[1], pd[0] - 30, pd[1] + 36, 8); }
    s += vigie(`${p}v`, 0.95, -1.1, 104, g) + B.buisson(`${p}b3`, ...iso(M[0] - 0.1, M[1] + 0.2, 0), 14, g, { feuille: '#1E7A50', fleurs: ['#FF4FAE'] });
    s += boite(`${p}s`, M, 0, hS, { gauche: (W, H) => tPierres(W, H, g, { haut: 4.6, long: 9, mousse: 0.5 }), droite: (W, H) => tPierres(W, H, g, { haut: 4.6, long: 9, mousse: 0.5 }), voile: { pied: 0.2, haut: 0 }, arete: null });
    s += boite(`${p}m`, M, hS, hM, {
      gauche: (W, H) => tRondins(W, H, g, { haut: 7.2, c: '#C8844A' })
        + fenetre(`${p}w1`, W * 0.08, 10, 12, 13, { volets: '#2E8A7A', fleurs: ['#FF4FAE', '#FFD04A', '#FF8A5A'] })
        + fenetre(`${p}w2`, W * 0.74, 10, 12, 13, { volets: '#2E8A7A', fleurs: ['#B898F0', '#FF8A5A', '#FFFFFF'] })
        + `<path d="M${P2(W * xp, H)} L${P2(W * xp, 10)} Q${P2(W * xp + 9, 0)} ${P2(W * xp + 18, 10)} L${P2(W * xp + 18, H)} Z" fill="#8A4A2A" stroke="#4A2A18" stroke-width="1"/>`
        + [1, 2, 3].map(i => `<rect x="${f(W * xp + i * 4.5)}" y="4" width=".7" height="${f(H - 4)}" fill="#5A2E18"/>`).join('') + [13, H - 8].map(y => `<rect x="${f(W * xp)}" y="${f(y)}" width="12" height="1.8" rx=".6" fill="#3A3A42"/>`).join('')
        + `<circle cx="${f(W * xp + 14)}" cy="${f(H * 0.58)}" r="1.7" fill="none" stroke="#E0B050" stroke-width="1.1"/>`,
      droite: (W, H) => tRondins(W, H, g, { haut: 7.2, c: '#C8844A' }) + fenetre(`${p}w3`, W * 0.2, 10, 11, 12, { volets: '#2E8A7A' }) + fenetre(`${p}w4`, W * 0.64, 10, 11, 12, { volets: '#2E8A7A' })
    });
    for (let z = hS + 3.6, r = 0; z < hM; z += 7.2, r++) for (const [cu, cv, du, dv] of [[M[2], M[3], 1, 0], [M[2], M[3], 0, 1], [M[0], M[3], -1, 0]]) {
      if ((r + (du ? 0 : 1)) % 2) continue;
      const q = iso(cu + du * 0.05, cv + dv * 0.05, z);
      s += `<defs>${rad(`${p}le${r}${cu}${du}`, q[0] - 1, q[1] - 1, 4, [[0, '#F4C890'], [1, '#C8844A']])}</defs><ellipse cx="${f(q[0])}" cy="${f(q[1])}" rx="3.4" ry="3.3" fill="url(#${p}le${r}${cu}${du})" stroke="#7A4A2A" stroke-width=".7"/>` + `<circle cx="${f(q[0])}" cy="${f(q[1])}" r="1.6" fill="none" stroke="#A86A3A" stroke-width=".45"/>`;
    }
    // ——— le toit de chaume dodu ———
    const t = toit(`${p}t`, M, hM, 40, 0.24, 'v', { couvre: couverture(g, (W, H, soleil) => B.tChaumeDodu(W, H, g, soleil)), pignon: (W, H) => tRondins(W, H, g, { haut: 7.2, c: '#C8844A' }) + fenetre(`${p}wp`, W / 2 - 5.5, H * 0.42, 11, 11, { arc: true }), faitage: '#6A7A3A' });
    s += t.svg;
    // (l'égout qui roule en boudin de paille, le faîtage de mottes herbues)
    const e0 = surPan(t, 0, 1), e1 = surPan(t, 1, 1);
    s += `<path d="M${P2(e0[0], e0[1] - 1)} L${P2(e1[0], e1[1] - 1)}" stroke="#4A3414" stroke-width="5.4" stroke-linecap="round" opacity=".9"/><path d="M${P2(e0[0], e0[1] - 1.6)} L${P2(e1[0], e1[1] - 1.6)}" stroke="#8A6A2A" stroke-width="3.6" stroke-linecap="round"/><path d="M${P2(e0[0], e0[1] - 2.6)} L${P2(e1[0], e1[1] - 2.6)}" stroke="#C8A050" stroke-width="1.2" stroke-linecap="round" opacity=".8"/>`;
    s += `<path d="M${P2(...surPan(t, 0.01, 0.01))} L${P2(...surPan(t, 0.99, 0.01))}" stroke="#3A6A38" stroke-width="5" stroke-linecap="round"/><path d="M${P2(...surPan(t, 0.01, -0.01))} L${P2(...surPan(t, 0.99, -0.01))}" stroke="#7AB858" stroke-width="2.2" stroke-linecap="round"/>`;
    s += hirondelle(...iso(M[0] + (M[2] - M[0]) * (xp + 0.09), M[3], hM + 1), 1);
    // ——— la cheminée de grosses pierres, la fumée en nuages ronds ———
    const pierre = (W, H) => tPierres(W, H, g, { haut: 4.6, long: 7, mousse: 0.35 });
    const cu = (M[0] + M[2]) / 2, cv = -0.62, zr = hM + 40;
    s += boite(`${p}ch`, [cu - 0.14, cv - 0.14, cu + 0.14, cv + 0.14], zr - 6, zr + 18, { gauche: pierre, droite: pierre }) + boite(`${p}chc`, [cu - 0.17, cv - 0.17, cu + 0.17, cv + 0.17], zr + 18, zr + 22, { gauche: (W, H) => `<rect width="${f(W)}" height="${f(H)}" fill="#D8D2C2"/>`, droite: (W, H) => `<rect width="${f(W)}" height="${f(H)}" fill="#9B927F"/>`, dessus: (W, H) => `<rect width="${f(W)}" height="${f(H)}" fill="#6E6656"/><ellipse cx="${f(W / 2)}" cy="${f(H / 2)}" rx="${f(W * 0.3)}" ry="${f(H * 0.3)}" fill="#2A221E"/>` });
    // ——— l'abri à bois, vide (les réserves ne se montrent que si la maison en a) ———
    const A = [M[2], -0.78, M[2] + 0.4, -0.12];
    for (const v of [A[1], A[3]]) { const a = iso(A[2], v, 0), b2 = iso(A[2], v, 27); s += buche(a[0], a[1], b2[0], b2[1], 1.6, g, { c: '#8A5A36' }); }
    s += plaque(`${p}ap`, iso(M[2] - 0.02, A[1] - 0.06, 33), B.AXE_V, B.unite([iso(A[2] + 0.08, 0, 25)[0] - iso(M[2] - 0.02, 0, 33)[0], iso(A[2] + 0.08, 0, 25)[1] - iso(M[2] - 0.02, 0, 33)[1]]), (A[3] - A[1] + 0.12) * PAS, Math.hypot(iso(A[2] + 0.08, 0, 25)[0] - iso(M[2] - 0.02, 0, 33)[0], iso(A[2] + 0.08, 0, 25)[1] - iso(M[2] - 0.02, 0, 33)[1]),
      B.tChaumeDodu((A[3] - A[1] + 0.12) * PAS, 26, g, false, { haut: 6, mousse: 0.3 }));
    // ——— la végétation qui mange le pied : buissons aux grandes feuilles, fleurs ———
    s += B.buisson(`${p}b1`, ...iso(M[0] - 0.08, M[3] + 0.12, 0), 11, g, { fleurs: ['#FF4FAE', '#FF4FAE', '#FFD04A'] })
      + B.buisson(`${p}b2`, ...iso(M[2] + 0.1, M[3] + 0.12, 0), 9, g, { feuille: '#3E9A6A', fleurs: ['#FF8A5A', '#FFFFFF'] });
    s += fleurs(iso(M[0] + 0.25, M[3] + 0.05, 0), iso(M[0] + (M[2] - M[0]) * (xp - 0.02), M[3] + 0.05, 0), g, 3, ['#FF4FAE', '#FFD04A', '#C8FF6A']);
    // ——— la lanterne ———
    const lt = iso(M[0] + (M[2] - M[0]) * (xp + 0.34), M[3] + 0.5, 0);
    s += contact(lt[0], lt[1], 4) + trait(`M${P2(...lt)} L${P2(lt[0], lt[1] - 30)} l5,0`, '#3A3038', 1.6) + lanterne(`${p}la`, lt[0] + 5, lt[1] - 30, 2);
    s += B.buisson(`${p}b4`, ...iso(1.32, 0.95, 0), 7, g, { feuille: '#3E9A6A' });
    s += pied([[-112, 6], [-92, 30], [104, 10], [108, -16], [20, 62], [-40, 60], [70, 58]], g);
    // (la fumée en nuages ronds)
    const fm = iso(cu, cv, zr + 24);
    s += [0, 1, 2].map(i => `<circle cx="${f(fm[0] + 3 + i * 4)}" cy="${f(fm[1] - 6 - i * 9)}" r="${f(4 + i * 2.4)}" fill="#F4F2F8" opacity="${f(0.85 - i * 0.22)}" stroke="#C8C8D8" stroke-width=".6"/>`).join('');
    return s;
  } finally { B.STYLE.organique = false; B.BORD.doux = false; }
}

// Le phare, au pied en (u, v) : la tour ronde de pierre chaulée qui s'affine, sa bande sarcelle, ses meurtrières, sa
// porte ; le balcon et sa rambarde ; la lanterne où brûle la flamme de lune (le feu du premier soir, devenu néon), son
// faisceau qui tourne (image n sur N) ; le dôme de cuivre vert-de-gris, sa boule et sa pointe. Fortifié (après
// l'apocalypse) : la lanterne blindée de plaques rivetées, le projecteur cru, des lanternes de garde magenta
function phare(id, u, v, h, g, n, N, { fort = false } = {}) {
  const [x, y] = iso(u, v, 0), rb = 17, rt = 11, top = y - h, rw = t => rb + (rt - rb) * t, yAt = t => y - h * t;
  let s = contact(x, y + 2, 22, 0.35);
  // (le socle de pierre)
  s += `<g transform="translate(${f(x)} 0)">${anneau2(rb + 5, (rb + 5) * 0.5, y - 6, 8, g)}</g>` + ovale(x, y - 6, rb + 5, (rb + 5) * 0.5, '#D8D2C2', 0.8);
  // (le fût : la pierre chaulée, la bande sarcelle, la lumière qui tourne autour du cylindre)
  const fut = `M${P2(x - rb, y - 6)} L${P2(x - rt, top)} A${rt},${rt * 0.5} 0 0,0 ${P2(x + rt, top)} L${P2(x + rb, y - 6)} A${rb},${rb * 0.5} 0 0,1 ${P2(x - rb, y - 6)} Z`;
  const bande = (t0, t1) => `M${P2(x - rw(t0), yAt(t0))} A${f(rw(t0))},${f(rw(t0) * 0.5)} 0 0,0 ${P2(x + rw(t0), yAt(t0))} L${P2(x + rw(t1), yAt(t1))} A${f(rw(t1))},${f(rw(t1) * 0.5)} 0 0,1 ${P2(x - rw(t1), yAt(t1))} Z`;
  s += `<defs>${lin(`${id}cy`, x - rb, 0, x + rb, 0, [[0, '#FFFFFF', 0.25], [0.35, '#FFFFFF', 0], [0.7, B.OMBRE_F, 0.15], [1, B.OMBRE_F, 0.45]])}<clipPath id="${id}fc"><path d="${fut}"/></clipPath></defs>`
    + `<g clip-path="url(#${id}fc)"><rect x="${f(x - rb)}" y="${f(top - 8)}" width="${2 * rb}" height="${f(h + 10)}" fill="${fort ? '#C8C0B0' : '#F4EEE2'}"/>`
    + Array.from({ length: 16 }, (_, i) => `<path d="M${P2(x - rb, yAt(i / 16))} A${f(rw(i / 16))},${f(rw(i / 16) * 0.5)} 0 0,0 ${P2(x + rb, yAt(i / 16))}" fill="none" stroke="#C8C0B0" stroke-width=".5" opacity=".7"/>`).join('')
    + `<path d="${bande(0.42, 0.56)}" fill="${fort ? '#7A6A5A' : '#3E9A96'}"/><path d="${bande(0.84, 0.9)}" fill="${fort ? '#7A6A5A' : '#3E9A96'}"/>`
    + `<rect x="${f(x - rb)}" y="${f(top - 8)}" width="${2 * rb}" height="${f(h + 10)}" fill="url(#${id}cy)"/>`
    + (fort ? Array.from({ length: 3 }, (_, i) => `<path d="M${P2(x - 6 + i * 6, yAt(0.95))} q2,${f(h * 0.2)} -1,${f(h * 0.45)}" stroke="#3A3430" stroke-width="${2 + i}" opacity=".25" fill="none"/>`).join('') : '') + '</g>'
    + `<path d="${fut}" fill="none" stroke="${ENCRE}" stroke-width="${B.TRAIT}"/>` + trait(`M${P2(x - rb + 1, y - 7)} L${P2(x - rt + 1, top + 1)}`, B.SOLEIL, 1.2, ' opacity=".8"');
  // (la porte cintrée au pied, les meurtrières qui luisent)
  s += `<path d="M${P2(x - 9, y + 1)} L${P2(x - 9, y - 14)} Q${P2(x - 4, y - 21)} ${P2(x + 1, y - 15)} L${P2(x + 1, y + 2)} Z" fill="#6A4428" stroke="${ENCRE}" stroke-width=".8"/>` + trait(`M${P2(x - 4, y - 19)} L${P2(x - 4, y + 1)}`, '#4A2A18', 0.6);
  for (const t of [0.3, 0.66]) { const q = [x - 2 + t * 4, yAt(t)]; s += `<path d="M${P2(q[0] - 1.6, q[1] + 5)} L${P2(q[0] - 1.6, q[1])} Q${P2(q[0], q[1] - 2)} ${P2(q[0] + 1.6, q[1])} L${P2(q[0] + 1.6, q[1] + 5)} Z" fill="${fort ? '#2A2A30' : '#FFC870'}" stroke="${ENCRE}" stroke-width=".6"/>`; }
  // (le balcon et sa rambarde)
  const yb = top - 1, rg = rt + 6;
  s += ovale(x, yb + 2, rg, rg * 0.45, '#6A6A72', 0.8) + ovale(x, yb, rg, rg * 0.45, '#9A9AA4', 0.8);
  // (la lanterne : sa lueur, ses vitres, la flamme de lune ; ou blindée)
  const yl = yb - 2, hl = 18;
  const coeur = fort ? '#E8FFFC' : '#E8FFFC';
  s += B.lueur(`${id}ll`, x, yl - hl / 2, fort ? 30 : 44, fort ? '#C8FFF8' : CYAN, fort ? 0.45 : 0.55)
    + `<path d="M${P2(x - 8, yl)} L${P2(x - 8, yl - hl)} L${P2(x + 8, yl - hl)} L${P2(x + 8, yl)} Z" fill="${fort ? '#5A5A62' : '#C8FFF8'}" stroke="${ENCRE}" stroke-width=".9"/>`;
  if (fort) s += [0, 1].map(i => `<rect x="${f(x - 8)}" y="${f(yl - hl + i * 9)}" width="16" height="8" fill="#6A6A74" stroke="#3A3A40" stroke-width=".6"/>`).join('') + [-6, -2, 2, 6].map(dx => `<circle cx="${f(x + dx)}" cy="${f(yl - hl + 1.4)}" r=".5" fill="#2A2A30"/><circle cx="${f(x + dx)}" cy="${f(yl - 1.4)}" r=".5" fill="#2A2A30"/>`).join('')
    + `<rect x="${f(x - 7)}" y="${f(yl - 10.6)}" width="14" height="2.4" fill="#E8FFFC"/>`;
  else s += `<path d="M${P2(x - 3, yl - 2)} Q${P2(x - 4.6, yl - 8)} ${P2(x, yl - 15)} Q${P2(x + 4.6, yl - 8)} ${P2(x + 3, yl - 2)} Z" fill="${CYAN}"/><path d="M${P2(x - 1.6, yl - 2.6)} Q${P2(x - 2.4, yl - 7)} ${P2(x, yl - 11)} Q${P2(x + 2.4, yl - 7)} ${P2(x + 1.6, yl - 2.6)} Z" fill="${coeur}"/>`
    + [-4, 0, 4].map(dx => trait(`M${P2(x + dx, yl)} L${P2(x + dx, yl - hl)}`, '#2A3A40', 0.8)).join('');
  s += Array.from({ length: 13 }, (_, i) => { const a = Math.PI * (i / 12); const qx = x + Math.cos(a) * rg, qy = yb + Math.sin(a) * rg * 0.45; return trait(`M${P2(qx, qy)} L${P2(qx, qy - 6)}`, '#3A3A42', 0.8); }).join('')
    + trait(`M${P2(x - rg, yb - 6)} A${rg},${f(rg * 0.45)} 0 0,0 ${P2(x + rg, yb - 6)}`, '#5A5A64', 1.1);
  // (le dôme de cuivre vert-de-gris, sa boule, sa pointe)
  s += plan(`M${P2(x - 10, yl - hl)} Q${P2(x - 10, yl - hl - 13)} ${P2(x, yl - hl - 14)} Q${P2(x + 10, yl - hl - 13)} ${P2(x + 10, yl - hl)} Z`, '#5AA890', 0.9)
    + `<path d="M${P2(x - 8, yl - hl - 3)} Q${P2(x - 6, yl - hl - 11)} ${P2(x, yl - hl - 12)}" stroke="#B8F0D8" stroke-width="1.2" fill="none" opacity=".7"/>`
    + `<circle cx="${f(x)}" cy="${f(yl - hl - 16)}" r="2.2" fill="#C8963A" stroke="${ENCRE}" stroke-width=".6"/>` + plan(`M${P2(x - 1, yl - hl - 17.6)} L${P2(x, yl - hl - 25)} L${P2(x + 1, yl - hl - 17.6)} Z`, '#8A8098', 0.5);
  if (fort) s += [-1, 1].map(k => B.lueur(`${id}gm${k}`, x + k * (rg + 1), yb - 3, 8, MAGENTA, 0.7) + `<rect x="${f(x + k * (rg + 1) - 1.4)}" y="${f(yb - 6)}" width="2.8" height="4" fill="${MAGENTA}" stroke="${ENCRE}" stroke-width=".5"/>`).join('');
  return s;
}
// Le faisceau du phare (au pied en (u, v), haut de h) qui tourne : vers la gauche puis vers la droite, s'amincit quand il
// passe derrière ; peint en dernier (le bloc qui bouge de l'animation : rien après lui ne change d'un skin à l'autre)
function faisceau(id, u, v, h, n, N, fort) {
  const [x, y] = iso(u, v, 0), yl = y - h - 3;
  const a = (n / N) * Math.PI * 2, dx = Math.cos(a) * 76, wid = 8 + 12 * Math.abs(Math.sin(a) * 0.4 + 0.6), devant = Math.sin(a) > -0.2;
  return `<defs>${lin(`${id}fa`, x, 0, x + dx, 0, [[0, fort ? '#E8FFFC' : CYAN, devant ? 0.55 : 0.25], [1, fort ? '#E8FFFC' : CYAN, 0]])}</defs><path d="${poly([[x, yl - 10], [x + dx, yl - 10 - wid], [x + dx, yl - 10 + wid]])}" fill="url(#${id}fa)"/>`;
}
// Le mur de pierres d'un socle rond (ellipse rx, ry, centre du haut en yc, haut de h) : ses pierres qui suivent la courbe
function anneau2(rx, ry, yc, h, g) {
  const pt = (t, dy) => [rx * Math.cos(t), yc + ry * Math.sin(t) + dy];
  let s = `<path d="M${P2(rx, yc)} A${f(rx)},${f(ry)} 0 0,1 ${P2(-rx, yc)} L${P2(-rx, yc + h)} A${f(rx)},${f(ry)} 0 0,0 ${P2(rx, yc + h)} Z" fill="#6E6656" stroke="${ENCRE}" stroke-width="${B.TRAIT}"/>`;
  for (let dy = 0, r = 0; dy < h - 0.5; dy += 4, r++) for (let k = -1; k < 10; k++) {
    const a0 = Math.max(0, Math.PI * (k + (r % 2) * 0.5) / 10), a1 = Math.min(Math.PI, Math.PI * (k + 1 + (r % 2) * 0.5) / 10);
    if (a1 - a0 < 0.02) continue;
    const m = (a0 + a1) / 2, t = 0.4 + 0.5 * (0.5 - Math.cos(m) * 0.5) * (0.8 + g() * 0.4);
    s += `<path d="${poly([pt(a0 + 0.01, dy + 0.5), pt(m, dy + 0.5), pt(a1 - 0.01, dy + 0.5), pt(a1 - 0.01, Math.min(h, dy + 4) - 0.5), pt(m, Math.min(h, dy + 4) - 0.5), pt(a0 + 0.01, Math.min(h, dy + 4) - 0.5)])}" fill="${mix('#9B927F', '#EDE8DC', t)}"/>`;
  }
  return s;
}
// Une guirlande de lampions de couleur tendue de a à b (elle se creuse)
function guirlande(id, a, b, { sv = false } = {}) {
  const c = [(a[0] + b[0]) / 2, Math.max(a[1], b[1]) + 12];
  let s = trait(`M${P2(...a)} Q${P2(...c)} ${P2(...b)}`, '#3A3038', 0.6);
  for (let i = 1; i < 9; i++) {
    const t = i / 9, q = [(1 - t) ** 2 * a[0] + 2 * (1 - t) * t * c[0] + t * t * b[0], (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * c[1] + t * t * b[1]], col = [MAGENTA, B.ACIDE, CYAN, CHAUD][i % 4];
    s += sv ? `<circle cx="${f(q[0])}" cy="${f(q[1] + 2)}" r="1.6" fill="#3A3A40" stroke="${ENCRE}" stroke-width=".4"/>` : B.lueur(`${id}${i}`, q[0], q[1] + 2, 6, col, 0.55) + `<ellipse cx="${f(q[0])}" cy="${f(q[1] + 2.2)}" rx="1.8" ry="2.2" fill="${col}" stroke="${ENCRE}" stroke-width=".4"/><ellipse cx="${f(q[0] - 0.5)}" cy="${f(q[1] + 1.6)}" rx=".6" ry=".8" fill="#FFFFFF" opacity=".7"/>`;
  }
  return s;
}
// Une bougainvillée qui grimpe de (x, y) sur h : ses tiges, ses feuilles, ses bractées magenta
function bougainvillee(x, y, h, g, sens = 1) {
  let s = '';
  for (let k = 0; k < 3; k++) { let d = `M${P2(x + k * 2, y)}`, px = x + k * 2, py = y; for (let i = 0; i < 6; i++) { const nx = px + sens * (g() - 0.3) * 6, ny = py - h / 6; d += ` Q${P2(px + sens * 3, (py + ny) / 2)} ${P2(nx, ny)}`; px = nx; py = ny; } s += trait(d, '#5A3A22', 1); }
  for (let i = 0; i < 30; i++) { const qx = x + sens * (g() - 0.2) * 14, qy = y - g() * h; s += `<circle cx="${f(qx)}" cy="${f(qy)}" r="${f(1.6 + g())}" fill="${g() < 0.35 ? '#3A8068' : g() < 0.5 ? '#FF7AC8' : MAGENTA}"/>`; }
  return s;
}

// ═══ palier VI : la maison d'argile et de tuiles, et son phare ═══
// Des murs d'argile chaulés sur un soubassement de pierre, leurs linteaux de bois ; un toit de tuiles canal en
// terre cuite, sa cheminée de briques ; la porte cintrée sous son auvent de tuiles, l'hirondelle de proue au-dessus ;
// les volets sarcelle et leurs jardinières, la bougainvillée qui grimpe ; la tonnelle et sa table ; le phare qui a
// poussé autour du mât, sa flamme de lune ; la guirlande de lampions de la maison au phare
function palier6(n = 0, fort = false) {
  let g = rnd(67);
  const p = fort ? 'f7' : 'f6', N = 8;
  const M = [-1.25, -0.95, 0.15, 0.3], hS = 7, hM = 40, xp = 0.42;
  let brasero = '';
  let s = sol(p, 110, 54, g, { sable: fort ? 0.6 : 0.1 }) + '<!--allee-->' + ombreSol(`${p}o`, -6, 4, 98, 46, 0.32);
  // ——— le phare, derrière à droite ———
  const PH = [0.92, -0.92];
  s += phare(`${p}ph`, PH[0], PH[1], 128, g, n, N, { fort });
  // ——— la maison ———
  s += boite(`${p}s`, M, 0, hS, { gauche: (W, H) => tPierres(W, H, g, { haut: 3.6, long: 7, mousse: fort ? 0.1 : 0.25 }), droite: (W, H) => tPierres(W, H, g, { haut: 3.6, long: 7, mousse: fort ? 0.1 : 0.25 }), voile: { pied: 0.2, haut: 0 }, arete: null });
  const linteau = (x, y, w) => `<rect x="${f(x - 2)}" y="${f(y - 2.6)}" width="${f(w + 4)}" height="2.6" fill="#8A5A36" stroke="${ENCRE}" stroke-width=".5"/>`;
  const volet = fort ? null : '#3E9A96';
  const fen = (id, x, y, w, h) => fort
    ? `<rect x="${f(x - 1)}" y="${f(y - 1)}" width="${f(w + 2)}" height="${f(h + 2)}" fill="#7A828C" stroke="${ENCRE}" stroke-width=".7"/>` + [y + h * 0.35].map(yy => `<rect x="${f(x + 1)}" y="${f(yy)}" width="${f(w - 2)}" height="1.4" fill="#1A1A20"/>`).join('') + [[x, y], [x + w, y], [x, y + h], [x + w, y + h]].map(([a, b]) => `<circle cx="${f(a)}" cy="${f(b)}" r=".6" fill="#3A3A40"/>`).join('') + linteau(x, y, w)
    : fenetre(id, x, y, w, h, { volets: volet, fleurs: ['#FF5A8A', '#FFD04A', '#FFFFFF'] }) + linteau(x, y, w);
  s += boite(`${p}m`, M, hS, hM, {
    gauche: (W, H) => B.tArgile(W, H, g, { c: fort ? '#E2D6C0' : '#F6EAD2' }) + fen(`${p}w1`, W * 0.1, 10, 10, 12) + fen(`${p}w2`, W * 0.76, 10, 10, 12)
      + `<path d="M${P2(W * xp, H)} L${P2(W * xp, 10)} Q${P2(W * xp + 8, 2)} ${P2(W * xp + 16, 10)} L${P2(W * xp + 16, H)} Z" fill="${fort ? '#5A5A62' : '#3E7A9A'}" stroke="${ENCRE}" stroke-width=".8"/>`
      + (fort ? [10, 20, H - 6].map(y => `<rect x="${f(W * xp)}" y="${f(y)}" width="16" height="2" fill="#3A3A40"/>`).join('') : [1, 2, 3].map(i => `<rect x="${f(W * xp + i * 4)}" y="5" width=".6" height="${f(H - 5)}" fill="#2A5A7A"/>`).join(''))
      + `<circle cx="${f(W * xp + 12.5)}" cy="${f(H * 0.58)}" r="1.3" fill="#C8963A"/>`
      + (fort ? [[0.3, 4], [0.62, 18], [0.9, 8]].map(([t, y]) => `<path d="M${f(W * t)},${f(y)} l-2,4 l3,3 l-2,5" stroke="#8A7A6A" stroke-width=".7" fill="none"/>`).join('') : ''),
    droite: (W, H) => B.tArgile(W, H, g, { c: fort ? '#D2C6B0' : '#EADCC2' }) + fen(`${p}w3`, W * 0.18, 10, 9, 11) + fen(`${p}w4`, W * 0.66, 10, 9, 11)
  });
  // ——— le toit de tuiles (rapiécé de tôle après l'apocalypse) ———
  const t = toit(`${p}t`, M, hM, 34, 0.16, 'v', {
    couvre: (W, H, soleil) => couverture(g, (W2, H2, s2) => B.tTuiles(W2, H2, g, s2, { fonce: '#A8442A', clair: '#F49A68', larg: 5.4, haut: 3.8, manque: fort ? 0.03 : 0 }))(W, H, soleil) + (fort ? `<g transform="translate(${f(W * 0.2)} ${f(H * 0.25)})">${B.tTole(W * 0.32, H * 0.45, g, soleil)}</g><g transform="translate(${f(W * 0.62)} ${f(H * 0.5)})">${B.tTole(W * 0.24, H * 0.4, g, soleil, { c: '#9A8A7A' })}</g>` : ''),
    pignon: (W, H) => B.tArgile(W, H, g, { c: fort ? '#E2D6C0' : '#F6EAD2' }) + hublot(`${p}hp`, W / 2, H * 0.6, 4), faitage: '#8A3A22', faitieres: '#C8603A'
  });
  g = rnd(68);
  s += t.svg;
  // (la cheminée de briques sur le faîte)
  const cu = (M[0] + M[2]) / 2, cv = -0.5, zr = hM + 34;
  s += boite(`${p}ch`, [cu - 0.11, cv - 0.11, cu + 0.11, cv + 0.11], zr - 5, zr + 16, { gauche: (W, H) => B.tBriques(W, H, g), droite: (W, H) => B.tBriques(W, H, g) })
    + boite(`${p}chc`, [cu - 0.14, cv - 0.14, cu + 0.14, cv + 0.14], zr + 16, zr + 19, { gauche: (W, H) => `<rect width="${f(W)}" height="${f(H)}" fill="#C8744A"/>`, droite: (W, H) => `<rect width="${f(W)}" height="${f(H)}" fill="#9A4A2A"/>`, dessus: (W, H) => `<rect width="${f(W)}" height="${f(H)}" fill="#6A3A2A"/><ellipse cx="${f(W / 2)}" cy="${f(H / 2)}" rx="${f(W * 0.3)}" ry="${f(H * 0.3)}" fill="#2A1A14"/>` });
  { const pd = iso(M[0] + (M[2] - M[0]) * (xp + 0.07), M[3], 0); s = s.replace('<!--allee-->', allee(`${p}al`, pd[0], pd[1], pd[0] - 26, pd[1] + 34, 7)); }
  if (!fort) s += fleurs(iso(M[0] + (M[2] - M[0]) * (xp + 0.22), M[3] + 0.04, 0), iso(M[2], M[3] + 0.04, 0), g, 4);
  // ——— la porte : son auvent de tuiles sur ses consoles, l'hirondelle de proue ———
  const pa = iso(M[0] + (M[2] - M[0]) * xp - 0.06, M[3], 30), pb = iso(M[0] + (M[2] - M[0]) * (xp + 0.26), M[3], 30);
  s += plan(`M${P2(pa[0], pa[1])} L${P2(pb[0], pb[1])} L${P2(pb[0] - 6, pb[1] + 8)} L${P2(pa[0] - 6, pa[1] + 8)} Z`, '#C8603A', 0.8)
    + Array.from({ length: 6 }, (_, i) => { const q = plus(pa, [pb[0] - pa[0], pb[1] - pa[1]], (i + 0.5) / 6); return trait(`M${P2(q[0], q[1])} L${P2(q[0] - 6, q[1] + 8)}`, '#8A3A22', 0.8); }).join('')
    + [pa, pb].map(q => trait(`M${P2(q[0] - 1, q[1] + 1)} l-5,6 l0,-7`, '#5A3A22', 1.1)).join('');
  s += hirondelle(...iso(M[0] + (M[2] - M[0]) * (xp + 0.07), M[3], hM + 4), 0.8);
  if (!fort) s += bougainvillee(...iso(M[0] + 0.02, M[3], hS), 34, g, 1);
  // ——— la tonnelle et sa table, devant à droite ———
  const T = [M[2] + 0.15, 0.35, M[2] + 0.75, 0.95];
  const tz = 30;
  const pt4 = [[T[0], T[3]], [T[2], T[3]], [T[2], T[1]]];
  if (!fort) {
    s += contact(...iso((T[0] + T[2]) / 2, (T[1] + T[3]) / 2, 0), 30, 0.2);
    // (la table et ses deux bancs)
    s += boite(`${p}ta`, [T[0] + 0.18, T[1] + 0.2, T[2] - 0.18, T[3] - 0.2], 10, 12, { gauche: (W, H) => B.tPlanches(W, H, g, { horiz: true, larg: 2 }), droite: (W, H) => B.tPlanches(W, H, g, { horiz: true, larg: 2 }), dessus: (W, H) => B.tPlanches(W, H, g, { larg: 3, c: '#D8A868' }) + `<ellipse cx="${f(W * 0.4)}" cy="${f(H * 0.5)}" rx="3" ry="1.6" fill="#E8F4F0" stroke="${ENCRE}" stroke-width=".4"/>`, arete: null })
      + [[T[0] + 0.22, T[3] - 0.22], [T[2] - 0.22, T[3] - 0.22]].map(([u, v]) => { const a = iso(u, v, 0), b = iso(u, v, 10); return trait(`M${P2(...a)} L${P2(...b)}`, '#6A4428', 1.8); }).join('');
    // (les poteaux de la tonnelle, ses traverses, la vigne qui la couvre)
    for (const [u, v] of pt4) { const a = iso(u, v, 0), b = iso(u, v, tz); s += buche(a[0], a[1], b[0], b[1], 1.3, g, { c: '#9A6A3A' }); }
    const c0 = iso(T[0], T[3], tz), c1 = iso(T[2], T[3], tz), c2 = iso(T[2], T[1], tz), c3 = iso(T[0], T[1], tz);
    s += [[c0, c1], [c1, c2], [c3, c0], [c2, c3]].map(([a, b]) => buche(a[0], a[1], b[0], b[1], 1.1, g, { c: '#9A6A3A' })).join('');
    for (let i = 0; i < 46; i++) { const a = g(), b = g(), q = plus(plus(c3, [c0[0] - c3[0], c0[1] - c3[1]], a), [c2[0] - c3[0], c2[1] - c3[1]], b); s += `<circle cx="${f(q[0])}" cy="${f(q[1])}" r="${f(2 + g() * 1.6)}" fill="${g() < 0.5 ? '#4E9A5A' : '#81BA5E'}" stroke="#2E5A3A" stroke-width=".4"/>`; if (g() < 0.2) s += `<circle cx="${f(q[0] + 1)}" cy="${f(q[1] + 2.4)}" r="1.4" fill="#8A4AB8" stroke="${ENCRE}" stroke-width=".3"/>`; }
    // (la guirlande de lampions, de la maison au phare)
    s += guirlande(`${p}gl`, iso(M[2], M[3], hM - 2), iso(PH[0] - 0.12, PH[1] + 0.12, 34)) + guirlande(`${p}gm`, iso(M[2], M[1] + 0.3, hM - 2), c2);
  } else {
    // ——— après l'apocalypse : la palissade de pieux (des avirons taillés parmi eux), sa porte, le barbelé ; les sacs de
    // sable à la porte ; le récupérateur d'eau de pluie (la bâche et ses tonneaux) ; le brasero ; les lanternes de garde
    const pieu = (u, v, hh, oar) => { const a = iso(u, v, 0), b = iso(u, v, hh); return oar ? B.aviron(a[0], a[1], b[0], b[1] + 8, g, { pale: 8 }) : buche(a[0], a[1], b[0], b[1] + 4, 2, g, { c: '#8A6A4A' }) + plan(`M${P2(b[0] - 2, b[1] + 4)} L${P2(b[0], b[1] - 2)} L${P2(b[0] + 2, b[1] + 4)} Z`, '#C8A070', 0.6); };
    let pal = '';
    for (let k = 0; k <= 16; k++) { const u = -1.38 + k * 0.175; if (u > -0.4 && u < -0.05) continue; pal += pieu(u, 1.42, 22 + (k % 3) * 3, k % 5 === 2); }
    for (let k = 1; k <= 12; k++) { const v = 1.42 - k * 0.2; pal += pieu(1.42, v, 22 + (k % 3) * 3, k % 5 === 3); }
    s += pal;
    s += barbelesIso(iso(-1.38, 1.42, 18), iso(-0.45, 1.42, 18)) + barbelesIso(iso(0, 1.42, 18), iso(1.42, 1.42, 18)) + barbelesIso(iso(1.42, 1.42, 18), iso(1.42, -0.95, 18));
    // (les sacs de sable devant la porte)
    const ps = iso(M[0] + (M[2] - M[0]) * xp, M[3] + 0.28, 0);
    s += sacsIso(ps[0] - 18, ps[0] + 18, ps[1], 2, g);
    // (le récupérateur d'eau : la bâche tendue en entonnoir sur ses perches, les tonneaux)
    const rc = iso(0.75, 0.7, 0);
    s += tonneau(rc[0] - 6, rc[1] + 2, 6, 14, g, { c: '#5A6A7A' }) + tonneau(rc[0] + 8, rc[1] - 2, 6, 14, g, { c: '#6A5A4A' })
      + [[-14, -4], [16, -8]].map(([dx, dy]) => trait(`M${P2(rc[0] + dx, rc[1] + dy + 4)} L${P2(rc[0] + dx, rc[1] + dy - 26)}`, '#6A4428', 1.6)).join('')
      + plan(`M${P2(rc[0] - 14, rc[1] - 30)} L${P2(rc[0] + 16, rc[1] - 34)} L${P2(rc[0] + 2, rc[1] - 18)} Z`, '#4A7A9A', 0.8) + trait(`M${P2(rc[0] + 2, rc[1] - 18)} L${P2(rc[0] - 6, rc[1] - 12)}`, '#4A7A9A', 1.6);
    // (le brasero, son feu)
    const [bx, by] = iso(-0.25, 1.15, 0);
    s += flaque(`${p}fl`, bx, by, 34) + plan(`M${P2(bx - 7, by - 10)} L${P2(bx + 7, by - 10)} L${P2(bx + 4, by)} L${P2(bx - 4, by)} Z`, '#3A3A42', 0.8) + ovale(bx, by - 10, 7, 2.6, '#2A1A14', 0.7);
    brasero = flammes(`${p}fe${n}`, bx, by - 10, 0.7, n % 8, 8);
    // (les lanternes de garde magenta sur les pieux d'angle : elles repoussent la brume)
    for (const [u, v] of [[-1.38, 1.42], [1.42, 1.42], [1.42, -0.98]]) { const q = iso(u, v, 26); s += B.lueur(`${p}g${u}${v}`, q[0], q[1] + 4, 12, MAGENTA, 0.6) + `<rect x="${f(q[0] - 2)}" y="${f(q[1])}" width="4" height="6" fill="${MAGENTA}" stroke="${ENCRE}" stroke-width=".5"/><rect x="${f(q[0] - 2.6)}" y="${f(q[1] - 1.4)}" width="5.2" height="1.6" fill="#3A3A42"/>`; }
  }
  s += pied([[-112, 8], [-92, 32], [104, 12], [108, -18], [24, 62], [-42, 60], [-114, -22], [74, 58]], g);
  // (ce qui bouge, à la fin : les flammes du brasero, le faisceau du phare)
  return s + brasero + faisceau(`${p}ph`, PH[0], PH[1], 128, n, N, fort);
}
// Un barbelé en accordéon le long d'une palissade, de a à b (en hauteur)
function barbelesIso(a, b) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.round(L / 2.4), r = 3.6;
  let s = '';
  for (let i = 0; i <= n; i++) { const q = plus(a, [b[0] - a[0], b[1] - a[1]], i / n); s += `<ellipse cx="${f(q[0])}" cy="${f(q[1] - r)}" rx="${f(r * 0.5)}" ry="${f(r)}" transform="rotate(-18 ${f(q[0])} ${f(q[1] - r)})" fill="none" stroke="#6A7282" stroke-width=".45"/>`; if (i % 2 === 0) s += `<path d="M${P2(q[0] + 1, q[1] - r * 1.8)} l1,1 m0,-1 l-1,1" stroke="#9AA4B4" stroke-width=".4"/>`; }
  return s + trait(ligne([plus(a, [0, -r * 1.9]), plus(b, [0, -r * 1.9])]), '#C8D4E8', 0.4, ' opacity=".6"');
}
// Des sacs de sable empilés, de x0 à x1, n rangs
function sacsIso(x0, x1, y, n, g) {
  let s = '';
  const l = 10, h = 5;
  for (let r = 0; r < n; r++) for (let x = x0 + (r % 2) * l * 0.5 + r * 2; x + l <= x1 - r * 2 + 0.1; x += l - 0.8) {
    const yy = y - r * (h - 0.8), c = mix('#B8A47A', '#E0D0A0', 0.3 + g() * 0.4);
    s += `<path d="M${P2(x + 1, yy)} Q${P2(x - 0.6, yy - h * 0.5)} ${P2(x + 1.2, yy - h)} Q${P2(x + l / 2, yy - h - 1.2)} ${P2(x + l - 1.2, yy - h)} Q${P2(x + l + 0.6, yy - h * 0.5)} ${P2(x + l - 1, yy)} Q${P2(x + l / 2, yy + 1)} ${P2(x + 1, yy)} Z" fill="${c}" stroke="${ENCRE}" stroke-width=".6"/>`
      + trait(`M${P2(x + 2, yy - h + 0.6)} Q${P2(x + l / 2, yy - h - 0.4)} ${P2(x + l - 2, yy - h + 0.6)}`, '#FFF4DC', 0.5, ' opacity=".7"');
  }
  return s;
}
const palier7 = n => palier6(n, true);

// ——— les réserves de bois : un calque que le jeu pose sur le Foyer quand le joueur a du bois en banque (rien sans bois ;
// à moitié, plein ; choix de l'auteur, 18 oct. : « le bois, seulement si la maison a ses réserves ») ———
// Une bûche sciée, couchée le long de v (son bout tourné vers nous, au soleil) ou de u (vers la droite, à l'ombre) : le
// centre de ce bout en c, son rayon r, sa longueur l (en cases) ; neige : la neige sur son dos
function rondin(c, r, l, g, { axe = 'v', neige = false } = {}) {
  const A = axe === 'v' ? AXE_U : B.AXE_V, off = axe === 'v' ? [40 * l, -20 * l] : [-40 * l, -20 * l];
  const ell = (o, k = 1) => Array.from({ length: 24 }, (_, i) => { const a = (i / 24) * Math.PI * 2; return [o[0] + A[0] * r * k * Math.cos(a), o[1] + A[1] * r * k * Math.cos(a) - r * k * Math.sin(a)]; });
  const E = ell(c), d = B.unite(off), n = [-d[1], d[0]], dot = p => (p[0] - c[0]) * n[0] + (p[1] - c[1]) * n[1];
  const [hi, lo] = dot(E[6]) < dot(E[18]) ? [E.reduce((a, p) => (dot(p) < dot(a) ? p : a)), E.reduce((a, p) => (dot(p) > dot(a) ? p : a))] : [E.reduce((a, p) => (dot(p) > dot(a) ? p : a)), E.reduce((a, p) => (dot(p) < dot(a) ? p : a))];
  const haut = hi[1] < lo[1] ? hi : lo, bas = haut === hi ? lo : hi;
  const ecorce = mix('#7A4A2A', '#A8703E', g()), ombre = mix(ecorce, B.OMBRE_F, 0.45), bord = mix(ecorce, '#2A1A10', 0.5);
  const soleil = axe === 'v', bois = soleil ? mix('#F0C488', '#F8DCA8', g() * 0.5) : mix('#C8925A', '#D8A468', g() * 0.5);
  // (le dos : l'écorce, son ombre dessous, sa lumière dessus, ses gerçures)
  let s = `<path d="${poly(ell(plus(c, off)))}" fill="${ombre}" stroke="${bord}" stroke-width=".7"/>`
    + `<path d="${poly([haut, plus(haut, off), plus(bas, off), bas])}" fill="${ecorce}"/>`
    + `<path d="${poly([plus(c, [(haut[0] - c[0]) * -0.2, (haut[1] - c[1]) * -0.2]), plus(plus(c, off), [(haut[0] - c[0]) * -0.2, (haut[1] - c[1]) * -0.2]), plus(bas, off), bas])}" fill="${ombre}" opacity=".7"/>`
    + trait(ligne([plus(c, [(haut[0] - c[0]) * 0.7, (haut[1] - c[1]) * 0.7]), plus(plus(c, off), [(haut[0] - c[0]) * 0.7, (haut[1] - c[1]) * 0.7])]), '#E8B47A', 0.8, ' opacity=".55"')
    + trait(ligne([haut, plus(haut, off)]), bord, 0.7) + trait(ligne([bas, plus(bas, off)]), bord, 0.7);
  for (let i = 0; i < 2; i++) { const t = 0.25 + g() * 0.5, k = 0.1 + g() * 0.5, p = plus(plus(c, off, t), [(haut[0] - c[0]) * k, (haut[1] - c[1]) * k]); s += trait(`M${P2(...p)} l${f(off[0] * 0.15)},${f(off[1] * 0.15)}`, bord, 0.5, ' opacity=".6"'); }
  if (neige) s += trait(ligne([plus(haut, [0, 0.4]), plus(plus(haut, off), [0, 0.4])]), B.NEIGE, r * 0.8) + trait(ligne([plus(haut, [0, 1.2]), plus(plus(haut, off), [0, 1.2])]), B.NEIGE_O, 0.5, ' opacity=".8"');
  // (le bout scié : l'écorce en anneau, le bois clair, ses cernes, une fente)
  const a = g() * Math.PI * 2, fe = [c[0] + A[0] * r * 0.75 * Math.cos(a), c[1] + A[1] * r * 0.75 * Math.cos(a) - r * 0.75 * Math.sin(a)];
  s += `<path d="${poly(E)}" fill="${ecorce}" stroke="${bord}" stroke-width=".7"/><path d="${poly(ell(c, 0.8))}" fill="${bois}"/>`
    + `<path d="${poly(ell(c, 0.52))}" fill="none" stroke="${mix(bois, '#8A5A30', 0.45)}" stroke-width=".45"/><path d="${poly(ell(c, 0.26))}" fill="none" stroke="${mix(bois, '#8A5A30', 0.45)}" stroke-width=".4"/>`
    + trait(`M${P2(...c)} L${P2(...fe)}`, mix(bois, '#5A3418', 0.55), 0.5)
    + `<path d="${poly(ell(plus(c, [-r * 0.15, -r * 0.2]), 0.42))}" fill="#FFF6DC" opacity="${soleil ? 0.35 : 0.15}"/>`;
  if (neige) s += `<path d="M${P2(...haut)} Q${P2(c[0], c[1] - r * 1.25)} ${P2(c[0] + (c[0] - haut[0]) * 0.6, c[1] - r * 0.85)}" fill="none" stroke="${B.NEIGE}" stroke-width="${f(r * 0.5)}" stroke-linecap="round"/>`;
  return s;
}
// Un tas de bûches en (u, v) (le bout de la première du rang du bas), n au rang du bas : en pyramide (chaque rang d'une
// bûche de moins, posé dans les creux) ou droit (rangé : rangs pleins, les uns sur les autres) ; abrite : sous un toit,
// sans neige
function tasBois(u, v, n, rangs, g, { r = 3.4, l = 0.3, axe = 'v', droit = false, abrite = false } = {}) {
  const pas = (2 * r * 0.97) / PAS, le = (k, j) => (axe === 'v' ? iso(u + j * pas, v + (g() - 0.5) * 0.03, k) : iso(u + (g() - 0.5) * 0.03, v + j * pas, k));
  const m = (n - 1) * pas / 2, cc = axe === 'v' ? iso(u + m, v - l / 2, 0) : iso(u - l / 2, v + m, 0);
  let s = contact(cc[0], cc[1] + 1, n * r * 1.15 + 4, 0.35);
  for (let k = 0; k < rangs; k++) {
    const nb = droit ? n : n - k, z = r + k * r * (droit ? 1.94 : 1.72);
    for (let j = 0; j < nb; j++) s += rondin(le(z, j + (droit ? 0 : k * 0.5)), r * (0.92 + g() * 0.14), l * (0.88 + g() * 0.24), g, { axe, neige: B.hiver() && !abrite && k === rangs - 1 });
  }
  return s;
}
// La place du tas à chaque palier (au calme, rien devant lui) : [u, v, n, rangs] à moitié et plein, ses options
const BOIS = [
  { moitie: [1.12, 0.42, 3, 2], plein: [1.06, 0.42, 4, 3] },
  { moitie: [0.66, -0.45, 3, 2], plein: [0.6, -0.45, 4, 3] },
  // (III : contre le mur de droite, les bouts vers nous à droite)
  { moitie: [0.5, -0.5, 3, 2], plein: [0.5, -0.56, 4, 3], options: { axe: 'u', l: 0.26 } },
  { moitie: [0.84, 0.4, 3, 2], plein: [0.78, 0.4, 4, 3] },
  // (V : rangé dans l'abri à bois, les bouts vers l'ouverture)
  { moitie: [0.64, -0.64, 3, 2], plein: [0.64, -0.64, 3, 4], options: { axe: 'u', droit: true, abrite: true, l: 0.3, r: 3.1 } },
  // (VI : rangé droit contre la façade, à gauche de la porte, sous la fenêtre ; VII : contre le mur de droite, derrière,
  // la porte a ses sacs de sable)
  { moitie: [-1.17, 0.58, 3, 2], plein: [-1.17, 0.58, 3, 3], options: { droit: true, l: 0.26, r: 3.2 } },
  { moitie: [0.42, -0.86, 3, 2], plein: [0.42, -0.86, 3, 3], options: { axe: 'u', droit: true, l: 0.26, r: 3.2 } }
];
const BOIS_ETATS = ['moitie', 'plein'];
// Le calque du bois d'un palier (le SVG complet, au cadre du palier : il se pose sur lui), à moitié ou plein ; l'hiver
function bois(lv, etat, { hiver = false } = {}) {
  const [u, v, n, rangs] = BOIS[lv - 1][etat];
  B.setHiver(hiver); B.BORD.doux = true;
  try { return svgDe(PALIERS[lv - 1].cadre, tasBois(u, v, n, rangs, rnd(lv * 7 + n), BOIS[lv - 1].options)); } finally { B.setHiver(false); B.BORD.doux = false; }
}

// Les images d'un palier (le SVG complet, comme la bibliothèque : le cadre, l'échelle × 1,25 autour)
// (VI et VII : le cadre élargi à droite pour le faisceau du phare ; l'ancre ne bouge pas)
const CADRE2 = [-95, -155, 190, 210], CADRE3 = [-140, -250, 280, 330], CADRE_PHARE = [-140, -250, 340, 330];
// Lumières de nuit et fumées, comme l'index les note : [u, v] en cases, z et rayon en pixels × 1,25
const L = (u, v, z, rayon) => ({ u, v, z: f(z * 1.25), rayon: f(rayon * 1.25) }), FU = (u, v, z) => ({ u, v, z: f(z * 1.25) });
const FEU = 'flame (10 images, 12/s)';
const PALIERS = [
  { dessin: palier1, images: 10, cadre: CADRE2, ms: 83, animations: [FEU], lumieres: [L(0.15, 0.15, 10, 54), L(0.68, -0.32, 14, 12)], fumees: [FU(0.15, 0.15, 24)] },
  { dessin: palier2, images: 10, cadre: CADRE2, ms: 83, animations: [FEU], lumieres: [L(0.83, 0.38, 10, 44), L(0.08, -0.58, 30, 16)], fumees: [FU(0.83, 0.38, 30)] },
  { dessin: palier3, images: 10, cadre: CADRE2, ms: 83, animations: [FEU], lumieres: [L(-0.12, 0.74, 10, 40), L(-0.34, 0.18, 21, 16), L(-0.63, 0.18, 19, 14)], fumees: [FU(-0.12, 0.74, 26)] },
  { dessin: palier4, images: 10, cadre: CADRE3, ms: 83, animations: [FEU], lumieres: [L(1.28, 0.92, 10, 44), L(-0.75, 0.13, 40, 16), L(-0.84, 0.05, 35, 14)], fumees: [FU(1.28, 0.92, 28)] },
  { dessin: palier5, images: 1, cadre: CADRE3, lumieres: [L(-0.94, 0.2, 27, 14), L(0.03, 0.2, 27, 14), L(0.32, -0.16, 27, 14), L(0.32, -0.76, 27, 14), L(-0.07, 0.7, 26, 16)], fumees: [FU(-0.44, -0.62, 101)] },
  { dessin: palier6, images: 8, cadre: CADRE_PHARE, ms: 250, animations: ['beam (8 images, 4/s)'], lumieres: [L(-1.0, 0.3, 26, 14), L(0.05, 0.3, 26, 14), L(0.15, -0.3, 26, 14), L(0.92, -0.92, 140, 36), L(0.4, 0.6, 26, 18)], fumees: [FU(-0.55, -0.5, 93)] },
  { dessin: palier7, images: 8, cadre: CADRE_PHARE, ms: 125, animations: ['beam, brasero (8 images, 8/s)'], lumieres: [L(0.92, -0.92, 140, 28), L(-0.25, 1.15, 12, 32), L(-1.38, 1.42, 26, 12), L(1.42, 1.42, 26, 12), L(1.42, -0.98, 26, 12)], fumees: [FU(-0.55, -0.5, 93), FU(-0.25, 1.15, 22)] }
];
const svgDe = (cadre, corps) => `<svg xmlns="http://www.w3.org/2000/svg" width="${cadre[2]}" height="${cadre[3]}" viewBox="${cadre.join(' ')}"><g transform="scale(1.25)">${corps}</g></svg>`;
// Une image d'un palier : n (de 0), l'hiver (les toits sous la neige), un skin
function image(lv, n = 0, { hiver = false, skin = '' } = {}) {
  const P = PALIERS[lv - 1];
  B.setHiver(hiver); SKIN = skin;
  try { return svgDe(P.cadre, P.dessin(n)); } finally { B.setHiver(false); SKIN = ''; }
}

// Les skins du Foyer que ce dessin sait faire
const SKINS = Object.keys(TOITS);
module.exports = { palier5b, PALIERS, SKINS, image, bois, BOIS_ETATS, palier1, palier2, palier3, palier4, palier5, palier6, palier7 };
