// Les annexes du Foyer (les objets de sa boutique, batiments.json : objets ; pas le chien, que le jeu cache pour l'instant :
// l'animal sera à découvrir et à acheter, choix de l'auteur, 19 oct.) et le chantier (commun aux sept bâtiments),
// dans la direction trapue et généreuse du Foyer (choix de l'auteur, 18 oct. : foyer.js, batir.js) : fabriqués par les
// naufragés avec ce que l'île et l'épave donnent, chacun personnalisé (coquillages pressés dans l'argile, peinture
// sarcelle et corail, tressage, corde), les couleurs du jeu, sans contour d'encre, posés dans l'herbe par leur ombre
// floue. Chaque calque est dessiné autour de son ancre (0, 0), sa place au sol, à l'échelle du jeu ; ses calques, ses
// images et sa cadence sont ceux du jeu (shopSprites.js, qui garde aussi leurs places, leurs lumières et le glissement) :
//   la cuisine d'Agathe : le four d'argile aux coquillages, son tuyau de cuivre, le panneau d'écoutille sur ses deux
//     tonneaux (le four rougeoie et fume) ;
//   le lit : le hamac de voile rapiécée entre deux montants de bois flotté (il se balance) ;
//   le chat : roux, roulé en boule dans son panier de palmes tressées (il respire, la queue bat, une oreille frémit) ;
//   le sablier : deux bouteilles de l'épave liées goulot contre goulot sur un pied de bois flotté, le sable de lune
//     qui coule (néon cyan) ;
//   le hibou : sur la traverse d'un aviron planté, le bocal de lucioles pendu (il tourne la tête, cligne) ;
//   le grimoire : le journal de bord devenu grimoire, qui flotte au-dessus de son lutrin de caisses, ses pages qui
//     tournent, ses runes qui montent (néon) ;
//   le chantier : I le terrain piqueté et cordé ; II le plan trouvé sur son chevalet, les planches de l'épave ;
//     III prêt à bâtir, l'échafaudage ligaturé, les outils, les pierres taillées.
const B = require('./batir');
const { f, rnd, CYAN, MAGENTA, ACIDE, P2, rad, lin, plan, trait, ovale, lueur, mix, plus, iso, boite, tPierres, tPlanches, buche, tonneau, touffe } = B;

const SARCELLE = '#3E9A96', EMERAUDE = '#16855A', CORAIL = '#FF8A5A', ARGILE = '#E08A62', VIOLET = '#9A6AE0';
// L'ombre de contact d'un objet posé, serrée au pied
const contact = (x, y, rx, a = 0.32) => `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(rx)}" ry="${f(rx * 0.42)}" fill="${B.OMBRE_F}" opacity="${a}"/>`;
// Un volume rond modelé (pot, dôme, ventre) : un dégradé de la lumière (en haut à gauche) à l'ombre
const modele = (id, x, y, r, c) => `<defs>${rad(id, x - r * 0.4, y - r * 0.5, r * 1.6, [[0, mix(c, '#FFF4E0', 0.45)], [0.45, c], [1, mix(c, '#1A2A2A', 0.45)]])}</defs>`;
// Un coquillage (pressé dans l'argile, pendu) en (x, y), de rayon r, tourné de a degrés
const coquille = (x, y, r, a, c) => `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(a)})"><path d="M${f(-r)},0 Q0,${f(-r * 1.5)} ${f(r)},0 Q0,${f(r * 0.4)} ${f(-r)},0 Z" fill="${c}"/>`
  + [-0.5, 0, 0.5].map(k => `<path d="M0,${f(r * 0.2)} L${f(k * r)},${f(-r * 0.9)}" stroke="${mix(c, '#5A3A2A', 0.5)}" stroke-width=".35"/>`).join('') + '</g>';
// Une jarre de conserves qui luit, en (x, y)
const conserve = (id, x, y, c, k = 1) => `<g transform="translate(${f(x)} ${f(y)}) scale(${f(k)})">${lueur(id, 0, -4, 8, c, 0.4)}`
  + '<path d="M-2.4,0 L-2.6,-5.6 Q0,-7 2.6,-5.6 L2.4,0 Z" fill="#E8F8F0" fill-opacity=".55"/>'
  + `<path d="M-2.2,-.4 L-2.3,-4 Q0,-5 2.3,-4 L2.2,-.4 Z" fill="${c}"/>` + `<circle cx="-.8" cy="-2" r=".7" fill="${mix(c, '#FFFFFF', 0.5)}"/><circle cx="1" cy="-2.8" r=".6" fill="${mix(c, '#FFFFFF', 0.5)}"/>`
  + '<rect x="-2.3" y="-7" width="4.6" height="1.5" rx=".5" fill="#C89A5A"/><path d="M-1.6,-1 L-1.7,-4.6" stroke="#FFFFFF" stroke-width=".6" opacity=".7"/></g>';
// Des runes de néon qui montent en tournant (image t de 0 à 1), autour de (x, y)
const runes = (x, y, t, n = 4, r = 9, h = 18) => Array.from({ length: n }, (_, i) => {
  const tt = (t + i / n) % 1, a = tt * Math.PI * 2 + i, rx = x + Math.cos(a) * r, ry = y - tt * h, c = [CYAN, MAGENTA, ACIDE, CYAN][i % 4];
  const d = ['M-1.6,1.4 L0,-1.6 L1.6,1.4 Z', 'M-1.6,0 L1.6,0 M0,-1.6 L0,1.6', 'M-1.4,-1.4 L1.4,1.4 M1.4,-1.4 L-1.4,1.4', 'M-1.6,1 Q0,-2.4 1.6,1'][i % 4];
  return `<g opacity="${f(Math.sin(tt * Math.PI))}"><circle cx="${f(rx)}" cy="${f(ry)}" r="3.2" fill="${c}" opacity=".28"/>${trait(d, c, 0.9, ` transform="translate(${f(rx)} ${f(ry)})"`)}</g>`;
}).join('');
// Des nuages de fumée ronds qui montent de (x, y), image t de 0 à 1
const fumee = (x, y, t, k = 1) => [0, 1, 2].map(i => { const tt = (t + i / 3) % 1; return `<circle cx="${f(x + (Math.sin(tt * 6) * 1.6 + tt * 5) * k)}" cy="${f(y - tt * 20 * k)}" r="${f((1.8 + tt * 3.6) * k)}" fill="#F4F2F8" opacity="${f(0.8 * (1 - tt))}" stroke="#C8C8D8" stroke-width=".5" stroke-opacity="${f(0.8 * (1 - tt))}"/>`; }).join('');

// ═══ la cuisine d'Agathe ═══
// Le four, son socle, son tuyau, le plan de travail et ce qu'il porte, le pot de fleurs (fixe)
function cuisine1() {
  const g = rnd(301);
  let s = B.ombrePortee('cuo', [iso(-0.3, 0.12, 0), iso(0.46, 0.2, 0), iso(0.46, -0.2, 0), iso(-0.3, -0.26, 0)], 26, 0.3);
  // (les dalles de grève, sous le coin cuisine)
  s += [[-0.2, 0.08], [0.1, 0.14], [0.32, 0.04], [0.04, -0.14]].map(([u, v]) => { const [x, y] = iso(u, v, 0); return ovale(x, y, 6 + g() * 2, 3 + g(), mix('#C8C0B0', '#EDE8DC', g()), 0.5); }).join('');
  // ——— le four : socle de galets, dôme d'argile, spirale de coquillages, bande peinte, bouche de galets ———
  s += boite('cus', [-0.3, -0.26, 0.06, 0.1], 0, 6, { gauche: (W, H) => tPierres(W, H, g, { haut: 3, long: 5, mousse: 0.45 }), droite: (W, H) => tPierres(W, H, g, { haut: 3, long: 5, mousse: 0.45 }), dessus: (W, H) => `<rect width="${f(W)}" height="${f(H)}" fill="#D8CCB4"/>`, arete: null });
  const [ox, oy] = iso(-0.12, -0.08, 6);
  s += modele('cud', ox, oy - 9, 12, ARGILE)
    + plan(`M${P2(ox - 11.5, oy)} Q${P2(ox - 12.5, oy - 17)} ${P2(ox, oy - 19)} Q${P2(ox + 12.5, oy - 17)} ${P2(ox + 11.5, oy)} Q${P2(ox, oy + 5)} ${P2(ox - 11.5, oy)} Z`, 'url(#cud)', 0.9)
    + Array.from({ length: 9 }, (_, i) => { const a = i * 0.9, r = 2 + i * 0.8; return coquille(ox + 3 + Math.cos(a) * r, oy - 10 + Math.sin(a) * r * 0.7, 1 + i * 0.05, a * 57, ['#FFF4E8', '#FFC8B8', '#FFE0A8'][i % 3]); }).join('')
    + `<path d="M${P2(ox - 11.2, oy - 2.4)} Q${P2(ox, oy + 2.6)} ${P2(ox + 11.2, oy - 2.4)}" stroke="${SARCELLE}" stroke-width="1.8" fill="none" stroke-linecap="round"/>`
    + Array.from({ length: 6 }, (_, i) => `<circle cx="${f(ox - 9 + i * 3.6)}" cy="${f(oy - 0.8 + Math.sin((i / 5) * Math.PI) * 2)}" r=".6" fill="${CORAIL}"/>`).join('');
  // (la bouche cintrée de galets, son fond sombre, les braises)
  s += Array.from({ length: 6 }, (_, i) => { const a = Math.PI * (1 - i / 5); return ovale(ox - 4 + Math.cos(a) * 5.4, oy - 1.6 - Math.sin(a) * 6, 1.6, 1.3, mix('#C8C0B0', '#F4F0E8', (i % 2) * 0.6), 0.4); }).join('')
    + `<path d="M${P2(ox - 8.2, oy)} L${P2(ox - 8.2, oy - 3)} Q${P2(ox - 4, oy - 9)} ${P2(ox + 0.2, oy - 3)} L${P2(ox + 0.2, oy + 1)} Z" fill="#2A140A"/>`
    + [[-6, -0.6], [-4, 0], [-2.2, -0.4]].map(([dx, dy]) => `<circle cx="${f(ox + dx)}" cy="${f(oy + dy)}" r=".8" fill="#FF6A2A"/>`).join('');
  // (le tuyau de poêle de cuivre de l'épave, ses bagues, son chapeau de fer-blanc)
  const [tx, ty] = [ox + 5, oy - 15];
  s += modele('cut', tx, ty - 6, 3, '#C8784A') + plan(`M${P2(tx - 1.9, ty + 2)} L${P2(tx - 1.9, ty - 11)} L${P2(tx + 1.9, ty - 11)} L${P2(tx + 1.9, ty + 2)} Z`, 'url(#cut)', 0.6)
    + [-3, -8].map(dy => `<rect x="${f(tx - 2.3)}" y="${f(ty + dy)}" width="4.6" height="1.1" rx=".4" fill="#8A4A2A"/>`).join('')
    + plan(`M${P2(tx - 4, ty - 11)} L${P2(tx, ty - 14.4)} L${P2(tx + 4, ty - 11)} Z`, '#B8C0C8', 0.5) + `<path d="M${P2(tx - 2.8, ty - 11.3)} L${P2(tx, ty - 13.6)}" stroke="#FFFFFF" stroke-width=".5"/>`;
  // ——— le plan de travail : un panneau d'écoutille posé sur deux tonneaux cerclés de peinture ———
  for (const [u, v, c, bande] of [[0.36, -0.08, '#8A5A3A', CORAIL], [0.2, 0.12, '#A86A3A', SARCELLE]]) { const [x, y] = iso(u, v, 0); s += tonneau(x, y, 3.6, 9.5, g, { c }) + `<rect x="${f(x - 3.8)}" y="${f(y - 6.4)}" width="7.6" height="1.3" fill="${bande}" opacity=".9"/>`; }
  const T = [0.1, -0.18, 0.46, 0.2];
  s += boite('cup', T, 9.5, 11, { gauche: (W, H) => `<rect width="${f(W)}" height="${f(H)}" fill="#6A6A72"/>`, droite: (W, H) => `<rect width="${f(W)}" height="${f(H)}" fill="#4A4A54"/>`, dessus: (W, H) => tPlanches(W, H, g, { larg: 3.4, c: '#C8945A' }) + `<rect width="${f(W)}" height="${f(H)}" fill="none" stroke="#5A5A62" stroke-width="1.3"/><circle cx="1.8" cy="1.8" r=".5" fill="#3A3A42"/><circle cx="${f(W - 1.8)}" cy="1.8" r=".5" fill="#3A3A42"/>`, arete: null });
  // (dessus : le poisson sur sa planche, le bol de coco, les deux jarres qui luisent, la miche)
  const at = (u, v) => iso(u, v, 11);
  const [px, py] = at(0.22, 0.08);
  s += plan(`M${P2(px - 4.6, py)} L${P2(px + 1.4, py - 3)} L${P2(px + 5.4, py - 1.2)} L${P2(px - 0.6, py + 1.8)} Z`, '#E0B070', 0.5)
    + `<g transform="translate(${f(px)} ${f(py - 0.8)}) rotate(-26) scale(.8)">${plan('M-4,0 Q-1,-2.4 3,-1 L5,-2.4 L4.6,0 L5,2.2 L3,.9 Q-1,2.2 -4,0 Z', '#9AC8D8', 0.4)}<circle cx="-2.6" cy="-.4" r=".5" fill="#1A2A2A"/></g>`;
  { const [x, y] = at(0.4, 0.1); s += ovale(x, y, 2.8, 1.3, '#8A5A2A', 0.4) + ovale(x, y - 0.3, 2.1, 0.8, '#F4ECDC', 0); }
  s += conserve('cuj1', ...at(0.32, -0.12), ACIDE, 0.85) + conserve('cuj2', ...at(0.4, -0.14), MAGENTA, 0.85);
  { const [x, y] = at(0.3, 0.14); s += plan(`M${P2(x - 3.4, y)} Q${P2(x - 3.4, y - 3.4)} ${P2(x, y - 3.4)} Q${P2(x + 3.4, y - 3.4)} ${P2(x + 3.4, y)} Z`, '#D8964A', 0.5) + trait(`M${P2(x - 1.6, y - 2)} l1,-.8 M${P2(x + 0.4, y - 2.2)} l1,-.8`, '#F4D49A', 0.5); }
  // ——— le pot de fleurs peint (une boîte de conserve de l'épave), devant le plan de travail ———
  const [fx, fy] = iso(0.5, 0.2, 0);
  s += modele('cupot', fx, fy - 2.6, 3, SARCELLE) + plan(`M${P2(fx - 2.8, fy)} L${P2(fx - 3, fy - 5)} L${P2(fx + 3, fy - 5)} L${P2(fx + 2.8, fy)} Z`, 'url(#cupot)', 0.5)
    + `<rect x="${f(fx - 3)}" y="${f(fy - 3.4)}" width="6" height="1" fill="${CORAIL}"/>`
    + [[-1.8, -8, MAGENTA], [0.8, -9.6, '#FF7AC8'], [2.4, -7, ACIDE]].map(([dx, dy, c]) => trait(`M${P2(fx, fy - 5)} L${P2(fx + dx, fy + dy)}`, EMERAUDE, 0.7) + `<circle cx="${f(fx + dx)}" cy="${f(fy + dy)}" r="1.3" fill="${c}"/><circle cx="${f(fx + dx)}" cy="${f(fy + dy)}" r=".45" fill="#FFF4C8"/>`).join('');
  s += [[-18, 4], [-8, 9], [26, 6]].map(([x, y]) => touffe(x, y, g, 0.6)).join('');
  return s;
}
// Ce qui vit : la bouche du four qui rougeoie, la fumée du tuyau (image n sur 8)
function cuisine2(n) {
  const t = n / 8, [ox, oy] = iso(-0.12, -0.08, 6), glow = 0.75 + 0.25 * Math.sin(t * Math.PI * 2);
  return lueur('cuf', ox - 4, oy - 3, 11, '#FF8A3A', 0.5 * glow)
    + `<path d="M${P2(ox - 7, oy + 0.4)} Q${P2(ox - 4, oy - 5.4 - glow)} ${P2(ox - 1, oy + 0.8)} Z" fill="#FF8A3A" opacity="${f(glow)}"/><path d="M${P2(ox - 5.4, oy + 0.6)} Q${P2(ox - 4, oy - 2.4 - glow)} ${P2(ox - 2.6, oy + 0.8)} Z" fill="#FFE8B0" opacity="${f(glow)}"/>`
    + fumee(ox + 5, oy - 31, t, 0.9);
}

// ═══ le lit : le hamac ═══
const HAUT = 22, P0 = [0, -0.46], P1 = [0, 0.46];
// Les deux montants de bois flotté, leurs ligatures, leurs pieds dans l'herbe (fixe)
function lit1() {
  const g = rnd(311);
  let s = B.ombrePortee('lio', [iso(-0.08, -0.5, 0), iso(0.08, -0.5, 0), iso(0.08, 0.5, 0), iso(-0.08, 0.5, 0)], 22, 0.24);
  for (const [u, v] of [P0, P1]) {
    const a = iso(u, v, 0), b = iso(u, v, HAUT + 3);
    s += contact(a[0], a[1] + 0.6, 4, 0.35) + buche(a[0], a[1], b[0], b[1], 2.2, g, { flotte: true })
      + trait(`M${P2(b[0] - 2.4, b[1] + 4)} l4.8,1.6 M${P2(b[0] - 2.4, b[1] + 6)} l4.8,1.6`, '#E0C08A', 1) + touffe(a[0] - 2, a[1] + 1, g, 0.6) + touffe(a[0] + 3, a[1] + 1.4, g, 0.5);
  }
  // (au montant de gauche, un coquillage pendu, peint)
  const q = iso(...P1, HAUT - 2);
  s += trait(`M${P2(q[0] - 2, q[1])} l-1.6,4`, '#C8A060', 0.5) + coquille(q[0] - 3.6, q[1] + 5.6, 1.6, 180, CORAIL);
  return s;
}
// La voile rapiécée tendue entre eux, le coussin, la couverture pliée ; elle se balance (image n sur 8)
function lit2(n) {
  const t = n / 8, sw = Math.sin(t * Math.PI * 2) * 1.6;
  const a = iso(...P0, HAUT - 1), b = iso(...P1, HAUT - 1), mx = (a[0] + b[0]) / 2 + sw, my = (a[1] + b[1]) / 2, low = my + 15 + Math.sin(t * Math.PI * 2 + 1) * 0.6;
  // (la toile : son bord du dessus, qui se creuse moins, et son fond, plus bas)
  const toile = `M${P2(a[0], a[1] + 1)} Q${P2(mx, low + 5)} ${P2(b[0], b[1] + 1)} Q${P2(mx, low - 9)} ${P2(a[0], a[1] + 1)} Z`;
  let s = `<ellipse cx="${f(mx)}" cy="${f(my + 22)}" rx="${f(12 - Math.abs(sw))}" ry="3" fill="${B.OMBRE_F}" opacity=".18"/>`
    + trait(`M${P2(...a)} L${P2(a[0] + 1.6, a[1] + 2)}`, '#C8A060', 0.8) + trait(`M${P2(...b)} L${P2(b[0] - 1.6, b[1] + 2)}`, '#C8A060', 0.8)
    + `<defs><clipPath id="lih${n}"><path d="${toile}"/></clipPath>${lin(`lil${n}`, 0, low - 10, 0, low + 5, [[0, '#FFFFFF', 0.25], [1, B.OMBRE_F, 0.3]])}</defs>`
    + plan(toile, '#F2E6CC', 0.7)
    // (les pièces cousues : sarcelle, corail, ocre, leurs points de couture)
    + `<g clip-path="url(#lih${n})">` + [[0.18, SARCELLE], [0.46, CORAIL], [0.72, '#EBC46F']].map(([k, c]) => { const x = a[0] + (b[0] - a[0]) * k + sw * 0.6, y = a[1] + (b[1] - a[1]) * k; return `<rect x="${f(x - 4)}" y="${f(y - 4)}" width="8" height="22" fill="${c}" opacity=".9"/><rect x="${f(x - 3.4)}" y="${f(y - 3.4)}" width="6.8" height="20.8" fill="none" stroke="#5A4A3A" stroke-width=".35" stroke-dasharray="1 .7"/>`; }).join('')
    + `<rect x="${f(Math.min(a[0], b[0]) - 4)}" y="${f(a[1] - 4)}" width="${f(Math.abs(b[0] - a[0]) + 8)}" height="${f(low + 8 - a[1])}" fill="url(#lil${n})"/></g>`;
  // (le coussin à boutons de coquillage, la couverture pliée)
  const kx = a[0] + (b[0] - a[0]) * 0.24 + sw * 0.5, ky = a[1] + (b[1] - a[1]) * 0.24 + 6;
  s += plan(`M${P2(kx - 4, ky)} Q${P2(kx - 4.4, ky - 3.6)} ${P2(kx, ky - 3.4)} Q${P2(kx + 4.4, ky - 3.6)} ${P2(kx + 4, ky)} Q${P2(kx, ky + 1.6)} ${P2(kx - 4, ky)} Z`, '#FFF4E6', 0.5) + `<circle cx="${f(kx)}" cy="${f(ky - 1.4)}" r=".6" fill="${CORAIL}"/>`;
  const cx = mx + 2, cy = (my + low) / 2 - 1.4;
  s += plan(`M${P2(cx - 4, cy)} l4,-1.4 l4,1.4 l0,2 l-4,-1.2 l-4,1.2 Z`, '#3E7AB0', 0.5) + trait(`M${P2(cx - 3.4, cy + 0.2)} l3.4,-1.1 l3.4,1.1`, '#FFF4E6', 0.5);
  return s;
}

// ═══ le chat roux dans son panier de palmes ═══
function chat(n) {
  const t = n / 8, souffle = Math.sin(t * Math.PI * 2) * 0.5, queue = n === 2 || n === 3 ? -1.8 : 0, oreille = n === 6 ? -16 : 0;
  let s = contact(0, 1.6, 13, 0.3);
  // (le panier : le fond tressé, le rebord roulé, le coussin sarcelle)
  s += `<defs>${rad('cap', -3, -3, 14, [[0, '#E8C878'], [0.6, '#C89A48'], [1, '#8A6428']])}</defs>`
    + plan('M-12,-2 Q-12.6,2.6 0,3.2 Q12.6,2.6 12,-2 Q0,1.4 -12,-2 Z', 'url(#cap)', 0.7)
    + Array.from({ length: 7 }, (_, i) => trait(`M${-10 + i * 3.3},${f(-1.2 + Math.abs(i - 3) * 0.12)} l.6,3.4`, '#8A6428', 0.5, ' opacity=".6"')).join('')
    + ovale(0, -2, 12, 3.4, '#5A8A88', 0.6) + `<ellipse cx="0" cy="-2.4" rx="10" ry="2.4" fill="${SARCELLE}"/>`;
  // (le chat roulé en boule : son dos qui respire, ses rayures, sa queue blanche au bout qui bat, sa tête endormie)
  s += plan(`M-9,-2 Q-11,${f(-8 - souffle)} -3,${f(-10 - souffle)} Q5,${f(-11 - souffle)} 9,${f(-6 - souffle)} Q10,-2 4,-1.4 Q-4,-1 -9,-2 Z`, '#F0944A', 0.7)
    + `<path d="M-6,${f(-8.6 - souffle)} Q-1,${f(-10.6 - souffle)} 5,${f(-8.4 - souffle)}" stroke="#FFC890" stroke-width="1.2" fill="none" opacity=".7"/>`
    + [-5, -1, 3].map(x => trait(`M${x},${f(-9.6 - souffle)} q1.2,2.6 0,4.6`, '#C8642A', 0.8)).join('')
    + trait(`M-9,-3 q-2.4,3 2.4,3.6 q4.4,.4 6.4,${f(-1.4 + queue)}`, '#F0944A', 2.2) + trait(`M-0.6,${f(-0.2 + queue * 0.5)} q1.6,${f(-0.4 + queue)} 2.6,${f(-1.6 + queue)}`, '#FFF4E6', 2.2)
    + plan(`M3,${f(-5 - souffle)} Q10,${f(-7.6 - souffle)} 11.4,-3 Q10,-0.6 5,-1.2 Z`, '#F0944A', 0.6)
    + `<g transform="rotate(${oreille} 9.4 -6)">${plan('M8,-5.4 L9.4,-8.8 L10.6,-5 Z', '#F0944A', 0.4)}<path d="M8.6,-5.6 L9.4,-7.6 L10,-5.4 Z" fill="#F7B8B0"/></g>` + plan('M5.4,-6 L5.8,-9 L7.6,-6.2 Z', '#F0944A', 0.4)
    + trait('M7.6,-3.4 q.7,.5 1.4,0 M9.8,-3.6 q.5,.4 1,0', '#5E3A22', 0.5) + '<ellipse cx="11" cy="-2.4" rx=".5" ry=".35" fill="#E07A7A"/>';
  return s;
}

// ═══ le sablier de bouteilles ═══
function sablier(n) {
  const g = rnd(331), t = n / 8;
  let s = B.ombrePortee('sao', [[-9, 1], [9, 1], [9, -3], [-9, -3]], 30, 0.26);
  // (le pied : un billot de bois flotté, ses deux montants, la traverse du haut, leurs ligatures)
  s += buche(-10, 0, 10, -2, 3.4, g, { flotte: true });
  for (const x of [-7.4, 7.4]) s += buche(x, -2, x, -40, 1.5, g, { flotte: true });
  s += buche(-10, -40, 10, -41, 1.8, g, { flotte: true }) + [-7.4, 7.4].map(x => trait(`M${x - 2},-38 l4,1.4 M${x - 2},-36 l4,1.4`, '#E0C08A', 0.8)).join('');
  // (les deux bouteilles de l'épave, goulot contre goulot, liées de corde ; le sable de lune qui coule et monte)
  const y0 = -5, y1 = -38, ym = (y0 + y1) / 2;
  s += lueur('sal', 0, ym, 16, CYAN, 0.38);
  const bouteille = (sens, y) => `M-4.6,${y} Q-5.4,${y - sens * 9} -1.4,${ym + sens * 3} L-1,${ym + sens * 0.6} L1,${ym + sens * 0.6} L1.4,${ym + sens * 3} Q5.4,${y - sens * 9} 4.6,${y} Z`;
  s += `<path d="${bouteille(1, y0)}" fill="#7AC8A8" fill-opacity=".35" stroke="#4A8A70" stroke-width=".6"/><path d="${bouteille(-1, y1)}" fill="#7AC8A8" fill-opacity=".35" stroke="#4A8A70" stroke-width=".6"/>`;
  const haut = 1 - t;
  s += `<path d="M${f(-4.2 * Math.max(haut, 0.2))},${f(ym - 3 - 9 * haut)} Q0,${f(ym - 2)} ${f(4.2 * Math.max(haut, 0.2))},${f(ym - 3 - 9 * haut)} L1,${f(ym - 1.2)} L-1,${f(ym - 1.2)} Z" fill="${CYAN}"/>`
    + `<path d="M-4.4,${y0 - 0.4} Q0,${f(y0 - 0.4 - 9 * t - 2)} 4.4,${y0 - 0.4} Z" fill="${CYAN}"/>` + trait(`M0,${ym} L0,${y0 - 2}`, '#C8FFF8', 0.7, ' stroke-dasharray="1 1"')
    + `<path d="M-3.4,${y0 - 1} Q-4.2,${y0 - 6} -2,${y0 - 9}" stroke="#FFFFFF" stroke-width=".7" fill="none" opacity=".7"/><path d="M-3.4,${y1 + 1} Q-4.2,${y1 + 5} -2,${y1 + 8}" stroke="#FFFFFF" stroke-width=".7" fill="none" opacity=".6"/>`
    + trait(`M-2,${ym - 1.4} L2,${ym + 1.4} M-2,${ym + 1.4} L2,${ym - 1.4}`, '#C8A060', 1.1) + plan(`M-2.6,${y1 - 0.6} L2.6,${y1 - 0.6} L2,${y1 + 1} L-2,${y1 + 1} Z`, '#C89A5A', 0.4) + plan(`M-2.6,${y0 + 0.4} L2.6,${y0 + 0.4} L2,${y0 - 1.2} L-2,${y0 - 1.2} Z`, '#C89A5A', 0.4);
  return s + touffe(-9, 1, g, 0.6) + touffe(10, 0.6, g, 0.5);
}

// ═══ le hibou sur son aviron planté ═══
function hibou(n) {
  const g = rnd(341), cligne = n === 6, tete = n === 2 || n === 3 ? 1.6 : n === 5 ? -1.2 : 0;
  let s = contact(0, 1.4, 6, 0.35);
  // (l'aviron planté, pale en l'air derrière, la traverse ligaturée, le bocal de lucioles pendu)
  s += B.aviron(0, 0, 0, -34, g, { pale: 11 }) + touffe(-2, 1, g, 0.6) + touffe(3, 1.4, g, 0.5);
  s += buche(-11, -27, 11, -28, 1.4, g, { c: '#9A6A3A' }) + trait('M-2,-30 l4,1.6 M-2,-28 l4,1.6', '#E0C08A', 0.8);
  s += trait('M9,-27.4 L9,-23', '#6A5A3A', 0.5) + lueur('hil', 9, -18, 9, ACIDE, 0.5)
    + '<path d="M6.8,-17.6 L6.6,-22 Q9,-23.4 11.4,-22 L11.2,-17.6 Q9,-16.6 6.8,-17.6 Z" fill="#E8F8F0" fill-opacity=".5" stroke="#9AC8B0" stroke-width=".5"/>'
    + [[8, -19.4], [10, -20.6], [9.2, -18.4]].map(([x, y], i) => `<circle cx="${f(x + (n % 2 ? 0.4 : 0) * (i - 1))}" cy="${f(y)}" r=".75" fill="${ACIDE}"/>`).join('') + '<rect x="7.2" y="-23.4" width="3.6" height="1.2" rx=".4" fill="#C89A5A"/>';
  // (le hibou : son ventre clair, ses plumes, ses ailes, ses serres sur la traverse ; sa tête qui tourne, ses yeux d'ambre)
  const ox = -1, oy = -28;
  s += modele('hic', ox, oy - 8, 7, '#9C6B43') + plan(`M${ox - 6},${oy} Q${ox - 7.4},${oy - 8} ${ox - 4},${oy - 12} Q${ox},${oy - 14} ${ox + 4},${oy - 12} Q${ox + 7.4},${oy - 8} ${ox + 6},${oy} Z`, 'url(#hic)', 0.7)
    + plan(`M${ox - 3.6},${oy - 0.6} Q${ox - 4.4},${oy - 7} ${ox},${oy - 9} Q${ox + 4.4},${oy - 7} ${ox + 3.6},${oy - 0.6} Z`, '#E8D4AE', 0.4)
    + [[-1.4, -6], [1.2, -5], [-0.2, -3]].map(([dx, dy]) => trait(`M${ox + dx - 0.7},${oy + dy} l.7,.7 l.7,-.7`, '#B88A5A', 0.5)).join('')
    + plan(`M${ox - 6},${oy - 1} Q${ox - 8},${oy - 6} ${ox - 5.4},${oy - 10} Q${ox - 4.4},${oy - 5} ${ox - 3.6},${oy - 1} Z`, '#7A4E30', 0.4)
    + plan(`M${ox + 6},${oy - 1} Q${ox + 8},${oy - 6} ${ox + 5.4},${oy - 10} Q${ox + 4.4},${oy - 5} ${ox + 3.6},${oy - 1} Z`, '#8A5A36', 0.4)
    + [-1.6, 0, 1.6].map(dx => trait(`M${ox + dx},${oy - 0.6} l0,1.6`, '#E8A13A', 0.7)).join('');
  const hx = ox + tete;
  s += `<g>${plan(`M${hx - 5.6},${oy - 12} Q${hx - 6.4},${oy - 19} ${hx},${oy - 19.6} Q${hx + 6.4},${oy - 19} ${hx + 5.6},${oy - 12} Q${hx},${oy - 9.4} ${hx - 5.6},${oy - 12} Z`, '#9C6B43', 0.6)}`
    + plan(`M${hx - 4.8},${oy - 17} l-.8,-3.4 l2.8,2 Z`, '#7A4E30', 0.3) + plan(`M${hx + 4.8},${oy - 17} l.8,-3.4 l-2.8,2 Z`, '#7A4E30', 0.3)
    + `<ellipse cx="${hx - 2.2}" cy="${oy - 14.4}" rx="2.7" ry="2.5" fill="#E8D4AE"/><ellipse cx="${hx + 2.2}" cy="${oy - 14.4}" rx="2.7" ry="2.5" fill="#E8D4AE"/>`
    + (cligne
      ? trait(`M${hx - 3.8},${oy - 14.4} q1.6,1 3.2,0 M${hx + 0.6},${oy - 14.4} q1.6,1 3.2,0`, '#3A2A1E', 0.7)
      : [-2.2, 2.2].map(dx => `<circle cx="${hx + dx}" cy="${oy - 14.4}" r="1.9" fill="#FFB830"/><circle cx="${hx + dx + tete * 0.25}" cy="${oy - 14.4}" r=".9" fill="#1E1A17"/><circle cx="${hx + dx - 0.5}" cy="${oy - 15}" r=".35" fill="#FFFFFF"/>`).join(''))
    + `<path d="M${hx - 0.7},${oy - 13} l.7,1.6 l.7,-1.6 Z" fill="#E8A040"/></g>`;
  return s;
}

// ═══ le grimoire ═══
// Le lutrin : deux caisses de l'épave empilées, la petite roue de barre posée contre, le cercle qui luit (fixe)
function grimoire1() {
  const g = rnd(351);
  let s = B.ombrePortee('gro', [iso(-0.12, 0.12, 0), iso(0.12, 0.12, 0), iso(0.12, -0.12, 0), iso(-0.12, -0.12, 0)], 18, 0.3);
  const face = c => (W, H) => tPlanches(W, H, g, { c, larg: 2.6, horiz: true, use: 0.1 }) + `<rect width="${f(W)}" height="${f(H)}" fill="none" stroke="${mix(c, '#1A0E08', 0.45)}" stroke-width="1.6"/>`;
  s += boite('grb', [-0.12, -0.12, 0.12, 0.12], 0, 8, { gauche: face('#B07A48'), droite: face('#8A5A36'), dessus: (W, H) => tPlanches(W, H, g, { c: '#C8945A', larg: 2.6, use: 0.1 }), voile: { pied: 0.2, haut: 0 } })
    + boite('grh', [-0.09, -0.09, 0.09, 0.09], 8, 14, { gauche: face(SARCELLE), droite: face('#2E7A76'), dessus: (W, H) => `<rect width="${f(W)}" height="${f(H)}" fill="#5AAAA6"/>`, voile: { pied: 0.2, haut: 0 } });
  // (la roue de barre, posée contre la caisse : sa jante, ses rayons, ses poignées)
  const [rx, ry] = iso(0.14, 0.04, 6);
  s += `<g transform="translate(${f(rx + 2)} ${f(ry)}) rotate(-12)"><ellipse rx="5.6" ry="6" fill="none" stroke="#6A4428" stroke-width="1.6"/><ellipse rx="5.6" ry="6" fill="none" stroke="#C8945A" stroke-width=".7"/>`
    + Array.from({ length: 8 }, (_, i) => { const a = (i * Math.PI) / 4; return trait(`M0,0 L${f(Math.cos(a) * 8)},${f(Math.sin(a) * 8.4)}`, '#8A5A36', 1); }).join('') + '<circle r="1.6" fill="#C8963A"/></g>';
  // (le cercle de lumière violette, sur la caisse du haut)
  const [cx, cy] = iso(0, 0, 14);
  return s + `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="5" ry="2.4" fill="#C8A0FF" opacity=".55"/><ellipse cx="${f(cx)}" cy="${f(cy)}" rx="2.6" ry="1.2" fill="#F0E4FF" opacity=".85"/>`;
}
// Le journal de bord qui flotte, ses pages qui tournent, ses runes qui montent (image n sur 8 ; le jeu le fait flotter)
function grimoire2(n) {
  const t = n / 8, x = 0, y = -26;
  const ex = x + 9 * Math.cos(Math.PI * t), ey = y - 2 - Math.sin(Math.PI * t) * 6;
  let s = lueur('grl', x, y - 4, 16, VIOLET, 0.32) + `<ellipse cx="${x}" cy="${y + 2}" rx="10" ry="2.6" fill="#C8A0FF" opacity=".22"/>`;
  // (la reliure de cuir sarcelle, ses coins de laiton, les pages crème, leurs lignes)
  s += plan(`M${x},${y + 1.4} L${x - 11},${y - 2} L${x - 11},${y - 3.4} L${x},${y} L${x + 11},${y - 3.4} L${x + 11},${y - 2} Z`, '#2E7A76', 0.5)
    + `<circle cx="${x - 10.4}" cy="${y - 2.6}" r=".8" fill="#E0B04A"/><circle cx="${x + 10.4}" cy="${y - 2.6}" r=".8" fill="#E0B04A"/>`
    + plan(`M${x},${y} Q${x - 5},${y - 5} ${x - 10},${y - 3.4} L${x - 10},${y - 5} Q${x - 5},${y - 7} ${x},${y - 2} Z`, '#FBF3DF', 0.4)
    + plan(`M${x},${y} Q${x + 5},${y - 5} ${x + 10},${y - 3.4} L${x + 10},${y - 5} Q${x + 5},${y - 7} ${x},${y - 2} Z`, '#F2E6CC', 0.4)
    + [-1, 1].map(sg => [0, 1, 2].map(k => trait(`M${x + sg * 2.4},${y - 3.6 + k * 1.2} L${x + sg * 8},${y - 4.8 + k * 1.2}`, '#8A7A9A', 0.4, ' opacity=".6"')).join('')).join('')
    + plan(`M${x},${y - 2} Q${f((x + ex) / 2)},${f(Math.min(y - 6, ey - 3))} ${f(ex)},${f(ey - 3)} L${f(ex)},${f(ey - 1.6)} Q${f((x + ex) / 2)},${f(Math.min(y - 4.4, ey - 1.4))} ${x},${y} Z`, '#FFFDF4', 0.4);
  return s + runes(x, y - 8, t, 3, 7, 14);
}

// ═══ le chantier (commun aux sept bâtiments, 2 × 2) ═══
function chantier(phase) {
  const g = rnd(251 + phase);
  // (le terrain piétiné : des nappes de terre et de sable qui se perdent dans l'herbe)
  let s = '';
  for (let i = 0; i < 5; i++) { const a = g() * Math.PI * 2, d = g() * 0.3, k = 0.6 + g() * 0.45; s += `<defs>${rad(`chs${phase}${i}`, 0, 0, 1, [[0, '#D8BE88', 0.8], [0.55, '#D8BE88', 0.45], [1, '#D8BE88', 0]])}</defs><ellipse cx="0" cy="0" rx="1" ry="1" fill="url(#chs${phase}${i})" transform="translate(${f(Math.cos(a) * 60 * d)} ${f(2 + Math.sin(a) * 30 * d)}) scale(${f(66 * k)} ${f(33 * k)})"/>`; }
  s += Array.from({ length: 14 }, () => { const a = g() * Math.PI * 2, d = 0.2 + g() * 0.6; return `<ellipse cx="${f(Math.cos(a) * 60 * d)}" cy="${f(2 + Math.sin(a) * 30 * d)}" rx="${f(0.6 + g() * 0.7)}" ry="${f(0.4 + g() * 0.3)}" fill="${g() < 0.5 ? '#B8A07A' : '#FFF4DC'}" opacity=".8"/>`; }).join('');
  // (les piquets de bois flotté aux quatre coins, la cordelette tendue, les fanions corail et sarcelle)
  const coins = [[-0.9, -0.9], [0.9, -0.9], [0.9, 0.9], [-0.9, 0.9]], H = 11;
  const pieu = ([u, v], i) => { const a = iso(u, v, 0), b = iso(u, v, H + 2); return contact(a[0], a[1] + 0.6, 3.4, 0.35) + buche(a[0], a[1], b[0], b[1], 1.6, g, { flotte: true }) + plan(`M${P2(b[0] + 1, b[1] + 1.4)} Q${P2(b[0] + 5, b[1] + 1.6)} ${P2(b[0] + 7, b[1] + 3.6)} Q${P2(b[0] + 4.4, b[1] + 4.6)} ${P2(b[0] + 1, b[1] + 5.4)} Z`, i % 2 ? SARCELLE : CORAIL, 0.4); };
  const corde = (a, b) => { const p = iso(...a, H), q = iso(...b, H); return trait(`M${P2(...p)} Q${P2((p[0] + q[0]) / 2, (p[1] + q[1]) / 2 + 2)} ${P2(...q)}`, '#F4E8C8', 0.9) + trait(`M${P2(...p)} Q${P2((p[0] + q[0]) / 2, (p[1] + q[1]) / 2 + 2)} ${P2(...q)}`, '#B89A6A', 0.4, ' stroke-dasharray="1 1"'); };
  // (derrière d'abord : le piquet du fond et ses deux cordes)
  s += pieu(coins[0], 0) + corde(coins[0], coins[1]) + corde(coins[3], coins[0]) + pieu(coins[1], 1) + pieu(coins[3], 3);
  // ——— I : les galets ramassés, la pelle plantée dans son tas de terre ———
  s += [[-24, 6, 3.6], [-18, 10, 3], [-29, 11, 2.6], [-21, 14, 2.2]].map(([x, y, r]) => B.galet(x, y, r, g, mix('#C8C0B0', '#EDE8DC', g()), g() < 0.4)).join('');
  s += `<defs>${rad(`cht${phase}`, 18, 2, 12, [[0, '#B88A5A'], [1, '#7A5230']])}</defs>` + plan('M8,11 Q12,1 19,0 Q27,1 30,11 Q19,14 8,11 Z', `url(#cht${phase})`, 0.6) + [[13, 9], [20, 6], [25, 9]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".7" fill="#5A3A20"/>`).join('');
  s += buche(19, 4, 25, -14, 1.2, g, { c: '#C8945A', bois: '#E8C08A' }) + plan('M24.2,-14 L27.4,-15.6 L28.4,-13.4 L25.2,-12 Z', '#C8945A', 0.4) + plan('M15.8,4.6 L21.8,3 L22.6,8.6 Q19.4,10.4 16.6,9 Z', '#9AA4B0', 0.5) + trait('M16.6,5.2 L21.4,4', '#E0E8F0', 0.6);
  if (phase >= 2) {
    // ——— II : le plan trouvé, punaisé sur son chevalet de bois flotté ; les planches de l'épave, empilées et peintes ———
    const [px, py] = iso(-0.42, -0.38, 0);
    s += contact(px, py + 1, 8, 0.28) + [[-6, 0, -2, -24], [6, 0, 2, -24], [0, -3, 0, -21]].map(([a, b, c, d]) => buche(px + a, py + b, px + c, py + d, 1.1, g, { flotte: true })).join('')
      + plan(`M${P2(px - 9, py - 24)} L${P2(px + 9, py - 24.6)} L${P2(px + 8.2, py - 10)} L${P2(px - 8.4, py - 9.6)} Z`, '#F4ECD4', 0.6)
      + `<path d="M${P2(px - 8.4, py - 12)} L${P2(px + 8.2, py - 12.4)} L${P2(px + 8.2, py - 10)} L${P2(px - 8.4, py - 9.6)} Z" fill="#E0D4B4"/>`
      + trait(`M${P2(px - 5, py - 13.6)} L${P2(px - 5, py - 19)} L${P2(px + 0.6, py - 21.6)} L${P2(px + 5.4, py - 18.4)} L${P2(px + 5.4, py - 13.6)} Z`, '#3E7AB0', 0.7) + trait(`M${P2(px - 5, py - 19)} L${P2(px + 5.4, py - 18.4)} M${P2(px - 1, py - 13.6)} L${P2(px - 1, py - 16.4)} L${P2(px + 1.6, py - 16.4)} L${P2(px + 1.6, py - 13.6)}`, '#3E7AB0', 0.5)
      + [[-8, -23.2], [8, -23.8]].map(([dx, dy]) => `<circle cx="${f(px + dx)}" cy="${f(py + dy)}" r=".9" fill="${CORAIL}"/>`).join('');
    const peintures = ['#C8945A', SARCELLE, '#E6DECA', CORAIL, '#B8844A'];
    for (let r = 0; r < 4; r++) s += boite(`chp${phase}${r}`, [0.12, 0.3 + (r % 2) * 0.02, 0.74, 0.5 + (r % 2) * 0.02], r * 2.6, r * 2.6 + 2.4, { gauche: (W, Hh) => `<rect width="${f(W)}" height="${f(Hh)}" fill="${peintures[r]}"/><rect width="${f(W)}" height=".7" fill="#FFFFFF" opacity=".35"/>`, droite: (W, Hh) => `<rect width="${f(W)}" height="${f(Hh)}" fill="#E0A96C"/><circle cx="${f(W / 2)}" cy="${f(Hh / 2)}" r=".6" fill="#9A6A3A"/>`, dessus: (W, Hh) => tPlanches(W, Hh, g, { larg: 3.4, c: r === 3 ? peintures[1] : '#D8A868' }), arete: null });
  }
  if (phase >= 3) {
    // ——— III : l'échafaudage de perches ligaturées et son plancher, la caisse à outils, le seau, les pierres taillées ———
    const P = [[0.18, -0.78], [0.78, -0.78], [0.78, -0.18], [0.18, -0.18]];
    const perche = ([u, v], z = 46) => { const a = iso(u, v, 0), b = iso(u, v, z); return contact(a[0], a[1] + 0.6, 3, 0.3) + buche(a[0], a[1], b[0], b[1], 1.5, g, { c: '#B8844A' }); };
    s += perche(P[0]) + perche(P[1]);
    for (const z of [18, 36]) { const a = iso(...P[0], z), b = iso(...P[1], z), c = iso(...P[2], z); s += buche(a[0], a[1], b[0], b[1], 1.1, g, { c: '#A8743E' }) + buche(b[0], b[1], c[0], c[1], 1.1, g, { c: '#A8743E' }) + [a, b, c].map(q => trait(`M${P2(q[0] - 2, q[1] - 1)} l4,1.4 M${P2(q[0] - 2, q[1] + 1)} l4,1.4`, '#E0C08A', 0.8)).join(''); }
    s += boite(`che${phase}`, [0.2, -0.76, 0.76, -0.48], 18, 19.6, { dessus: (W, Hh) => tPlanches(W, Hh, g, { larg: 3.4, c: '#D8A868' }), gauche: (W, Hh) => `<rect width="${f(W)}" height="${f(Hh)}" fill="#A8743E"/>`, droite: (W, Hh) => `<rect width="${f(W)}" height="${f(Hh)}" fill="#8A5A36"/>`, arete: null });
    s += perche(P[2]) + trait(ligne3(iso(...P[1], 2), iso(...P[2], 34)), '#A8743E', 1.2);
    // (la caisse à outils : le manche du marteau, la scie qui dépasse)
    s += B.caisse(`chc${phase}`, -0.62, 0.42, 0.3, 7, g, { marque: false }) + (() => { const [x, y] = iso(-0.62, 0.42, 7); return buche(x - 3, y - 1, x + 4, y - 7, 0.9, g, { c: '#C8945A' }) + plan(`M${P2(x + 2.6, y - 8.6)} L${P2(x + 6, y - 6.4)} L${P2(x + 5, y - 5)} L${P2(x + 1.8, y - 7.2)} Z`, '#7A828C', 0.4) + plan(`M${P2(x - 4, y - 2)} L${P2(x - 1, y - 9)} L${P2(x + 1, y - 8)} L${P2(x - 2, y - 1)} Z`, '#B8C0C8', 0.4); })();
    // (le seau de fer-blanc, son anse)
    { const [x, y] = iso(-0.22, 0.72, 0); s += contact(x, y + 0.6, 4.6) + plan(`M${P2(x - 3.6, y - 7)} L${P2(x - 3, y)} Q${P2(x, y + 1.4)} ${P2(x + 3, y)} L${P2(x + 3.6, y - 7)} Z`, '#9AA4B0', 0.5) + ovale(x, y - 7, 3.6, 1.4, '#5A6470', 0.4) + trait(`M${P2(x - 3.6, y - 7)} Q${P2(x, y - 13)} ${P2(x + 3.6, y - 7)}`, '#5A6470', 0.6) + `<path d="M${P2(x - 2.6, y - 6)} L${P2(x - 2.2, y - 1)}" stroke="#FFFFFF" stroke-width=".6" opacity=".6"/>`; }
    // (les pierres taillées, en tas)
    for (let i = 0; i < 5; i++) { const u0 = 0.42 + (i % 3) * 0.13 + (i > 2 ? 0.06 : 0), v0 = -0.02 + (i > 2 ? 0.02 : 0), z0 = i > 2 ? 4.4 : 0; s += boite(`cht${phase}${i}`, [u0, v0, u0 + 0.11, v0 + 0.11], z0, z0 + 4.4, { gauche: (W, Hh) => `<rect width="${f(W)}" height="${f(Hh)}" fill="${mix('#D8D2C2', '#C3BBA9', g())}"/>`, droite: (W, Hh) => `<rect width="${f(W)}" height="${f(Hh)}" fill="#A8A090"/>`, dessus: (W, Hh) => `<rect width="${f(W)}" height="${f(Hh)}" fill="#F0ECE0"/>`, arete: null }); }
  }
  // (devant enfin : le piquet de devant et ses cordes, l'herbe qui mange les bords)
  s += corde(coins[1], coins[2]) + corde(coins[2], coins[3]) + pieu(coins[2], 2);
  return s + [[-60, 4], [56, 8], [-10, 36], [32, 32], [-40, -18]].map(([x, y]) => touffe(x, y, g, 0.8)).join('');
}
const ligne3 = (a, b) => `M${P2(...a)} L${P2(...b)}`;

// ——— l'index : les calques de chaque annexe (comme le jeu : leur nombre, leurs images, leur cadence), leurs cadres
// (en px de la bibliothèque, × 1,25 : ils contiennent le dessin) ———
const C = (k, dessin, cadre, n = 1, ms = null, opt = {}) => ({ k, dessin, cadre, n, ms, derriere: false, ...opt });
const ANNEXES = {
  cuisine: { paliers: [1, 2, 3, 4, 5, 6, 7], calques: [C(0, cuisine1, [-32.5, -50, 72.5, 67.5]), C(1, cuisine2, [-25, -80, 45, 75], 8, 200)] },
  lit: { paliers: [1, 2, 3, 4, 5, 6, 7], calques: [C(0, lit1, [-32.5, -45, 62.5, 60]), C(1, lit2, [-27.5, -32.5, 57.5, 52.5], 8, 333)] },
  chat: { paliers: [1, 2, 3, 4, 5, 6, 7], calques: [C(0, chat, [-20, -20, 40, 27.5], 8, 333)] },
  sablier: { paliers: [5, 6, 7], calques: [C(0, sablier, [-20, -60, 40, 65], 8, 500)] },
  hibou: { paliers: [5, 6, 7], calques: [C(0, hibou, [-20, -65, 40, 70], 8, 333)] },
  grimoire: { paliers: [5, 6, 7], calques: [C(0, grimoire1, [-20, -30, 40, 35]), C(1, grimoire2, [-27.5, -62.5, 55, 45], 8, 200, { mouvement: true })] }
};
const svgDe = (cadre, corps) => `<svg xmlns="http://www.w3.org/2000/svg" width="${cadre[2]}" height="${cadre[3]}" viewBox="${cadre.join(' ')}"><g transform="scale(1.25)">${corps}</g></svg>`;
// Une image d'un calque d'une annexe (le SVG complet, à son cadre), dans la direction trapue
function image(id, k, n = 0) {
  const c = ANNEXES[id].calques[k];
  B.STYLE.organique = true; B.BORD.doux = true;
  try { return svgDe(c.cadre, c.dessin(n)); } finally { B.STYLE.organique = false; B.BORD.doux = false; }
}
// Le chantier dans sa phase (1, 2, 3), au cadre du chantier
function imageChantier(phase, cadre) {
  B.STYLE.organique = true; B.BORD.doux = true;
  try { return svgDe(cadre, chantier(phase)); } finally { B.STYLE.organique = false; B.BORD.doux = false; }
}

module.exports = { ANNEXES, image, imageChantier };
