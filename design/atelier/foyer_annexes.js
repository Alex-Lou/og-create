// Les annexes du Foyer (les objets de la boutique, batiments.json : objets) et le chantier, redessinés au trait du Foyer
// (foyer.js, batir.js) : chacun posé à sa place au sol, son ancre en (0, 0), à l'échelle du jeu. Propositions (choix de
// l'auteur, 18 oct. : « propose-les moi, que je puisse voir et valider ou non ») :
//   la cuisine d'Agathe : un four à pain d'argile sur son socle de pierres, son plan de travail, la marmite, les herbes
//     qui sèchent, les ustensiles pendus ;
//   le lit : une banquette de bois flotté, ses coussins et sa couverture, sous un dais de voile tendu sur deux montants ;
//   le chat : roux, roulé en boule sur son coussin ;
//   le chien : assis à côté de sa gamelle, la queue qui bat ;
//   le sablier : un grand sablier de laiton sur son pied sculpté, son sable de lune qui luit (néon cyan) ;
//   le hibou : sur son perchoir sculpté et sa lanterne ;
//   le grimoire : ouvert sur son lutrin de pierre, ses pages et ses runes qui flottent (néon) ;
//   le chantier : I le terrain piqueté et cordé ; II le plan trouvé, punaisé sur son chevalet, les planches empilées ;
//     III prêt à bâtir, l'échafaudage, les outils, les matériaux.
const B = require('./batir');
const { f, rnd, ENCRE, CHAUD, CYAN, MAGENTA, ACIDE, P2, poly, lin, rad, plan, trait, ovale, lueur, mix, plus, iso, boite, tPierres, tPlanches, tBriques, buche, caisse, tonneau, lanterne, touffe } = B;

const contact = (x, y, rx, a = 0.32) => `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(rx)}" ry="${f(rx * 0.42)}" fill="${B.OMBRE_F}" opacity="${a}"/>`;

// ——— la cuisine d'Agathe ———
function cuisine(n = 0) {
  const g = rnd(201);
  let s = contact(0, 2, 22);
  // (le socle de pierres)
  s += boite('cuS', [-0.32, -0.3, 0.3, 0.26], 0, 9, { gauche: (W, H) => tPierres(W, H, g, { haut: 3, long: 5, mousse: 0.3 }), droite: (W, H) => tPierres(W, H, g, { haut: 3, long: 5, mousse: 0.3 }), dessus: (W, H) => `<rect width="${f(W)}" height="${f(H)}" fill="#C8B898"/>`, arete: null });
  // (le four en dôme d'argile : sa voûte modelée, sa bouche qui rougeoie, sa petite cheminée)
  const [ox, oy] = iso(-0.02, -0.06, 9);
  s += `<defs>${rad('cuD', ox - 6, oy - 16, 22, [[0, '#F0B888'], [0.6, '#C8743E'], [1, '#8A4A22']])}</defs>`
    + plan(`M${P2(ox - 15, oy)} Q${P2(ox - 16, oy - 22)} ${P2(ox, oy - 24)} Q${P2(ox + 16, oy - 22)} ${P2(ox + 15, oy)} Q${P2(ox, oy + 6)} ${P2(ox - 15, oy)} Z`, 'url(#cuD)')
    + [0.3, 0.6].map(t => trait(`M${P2(ox - 15 + t * 3, oy - 22 * t)} Q${P2(ox, oy - 22 * t + 6)} ${P2(ox + 15 - t * 3, oy - 22 * t)}`, '#A85A2A', 0.5, ' opacity=".5"')).join('')
    + lueur('cuL', ox - 4, oy - 4, 14, '#FF8A3A', 0.55)
    + `<path d="M${P2(ox - 10, oy + 1)} L${P2(ox - 10, oy - 6)} Q${P2(ox - 5, oy - 12)} ${P2(ox, oy - 6)} L${P2(ox, oy + 2.4)} Z" fill="#2A140A" stroke="${ENCRE}" stroke-width=".7"/>`
    + `<path d="M${P2(ox - 9, oy + 1)} Q${P2(ox - 5, oy - 4)} ${P2(ox - 1, oy + 2)} Z" fill="#FF9A3A"/><path d="M${P2(ox - 7, oy + 1.4)} Q${P2(ox - 5, oy - 1)} ${P2(ox - 3, oy + 1.8)} Z" fill="#FFE0A0"/>`
    + plan(`M${P2(ox + 5, oy - 21)} L${P2(ox + 5, oy - 30)} L${P2(ox + 10, oy - 30)} L${P2(ox + 10, oy - 19)} Z`, '#A85A2A', 0.7) + ovale(ox + 7.5, oy - 30, 2.6, 1, '#4A2A1A', 0.5);
  // (le plan de travail de planches sur ses tréteaux, la marmite, la planche à pain)
  s += boite('cuP', [0.32, -0.12, 0.62, 0.22], 10, 12, { gauche: (W, H) => tPlanches(W, H, g, { horiz: true, larg: 2 }), droite: (W, H) => tPlanches(W, H, g, { horiz: true, larg: 2 }), dessus: (W, H) => tPlanches(W, H, g, { larg: 3, c: '#D8A868' }), arete: null })
    + [[0.35, 0.2], [0.6, 0.2], [0.6, -0.1]].map(([u, v]) => { const a = iso(u, v, 0), b = iso(u, v, 10); return trait(`M${P2(...a)} L${P2(...b)}`, '#6A4428', 1.4); }).join('');
  const [mx, my] = iso(0.48, 0.05, 12);
  s += ovale(mx + 4, my - 1, 4, 1.6, '#E0B070', 0.6) + `<ellipse cx="${f(mx + 4)}" cy="${f(my - 1.6)}" rx="2.6" ry=".9" fill="#F4D49A"/>`
    + plan(`M${P2(mx - 7, my - 4)} Q${P2(mx - 7.6, my + 1)} ${P2(mx - 3.5, my + 1)} Q${P2(mx + 0.6, my + 1)} ${P2(mx, my - 4)} Z`, '#3A3A44', 0.6) + ovale(mx - 3.5, my - 4, 3.5, 1.3, '#5A5A66', 0.5);
  // (les herbes qui sèchent et les ustensiles pendus à une perche entre le four et un montant)
  const h0 = iso(0.22, -0.28, 30), h1 = iso(0.62, -0.12, 26), m0 = iso(0.62, -0.12, 0);
  s += buche(m0[0], m0[1], h1[0], h1[1] - 2, 1, g, { c: '#8A5A36' }) + trait(`M${P2(...h0)} L${P2(...h1)}`, '#8A5A36', 1.4)
    + [0.25, 0.5].map((t, i) => { const q = plus(h0, [h1[0] - h0[0], h1[1] - h0[1]], t); return trait(`M${P2(...q)} l0,3`, '#5A4A3A', 0.5) + [-1.4, 0, 1.4].map(dx => trait(`M${P2(q[0], q[1] + 3)} l${f(dx)},6`, i ? '#8AB84A' : '#B8A050', 1.1)).join(''); }).join('')
    + (() => { const q = plus(h0, [h1[0] - h0[0], h1[1] - h0[1]], 0.78); return trait(`M${P2(...q)} l0,4`, '#5A4A3A', 0.5) + plan(`M${P2(q[0] - 1, q[1] + 4)} L${P2(q[0] + 1, q[1] + 4)} L${P2(q[0] + 1, q[1] + 9)} Q${P2(q[0], q[1] + 12)} ${P2(q[0] - 1, q[1] + 9)} Z`, '#B8B8C4', 0.5); })();
  // (la fumée, animée : n)
  s += [0, 1, 2].map(i => { const t = ((n / 8) + i / 3) % 1; return `<circle cx="${f(ox + 7.5 + Math.sin(t * 6) * 2 + t * 4)}" cy="${f(oy - 32 - t * 22)}" r="${f(2 + t * 4)}" fill="#E8E4EC" opacity="${f(0.7 * (1 - t))}"/>`; }).join('');
  return s;
}

// ——— le lit ———
function lit(n = 0) {
  const g = rnd(211);
  let s = contact(0, 2, 24, 0.28);
  // (la banquette de bois flotté, son matelas, ses coussins, sa couverture)
  s += boite('liB', [-0.42, -0.2, 0.42, 0.18], 4, 9, { gauche: (W, H) => tPlanches(W, H, g, { horiz: true, larg: 2.4, c: '#C3B8A2' }), droite: (W, H) => tPlanches(W, H, g, { horiz: true, larg: 2.4, c: '#C3B8A2' }), arete: null })
    + [[-0.4, 0.16], [0.4, 0.16], [0.4, -0.18]].map(([u, v]) => { const a = iso(u, v, 0), b = iso(u, v, 4); return trait(`M${P2(...a)} L${P2(...b)}`, '#8A8272', 2); }).join('')
    + boite('liM', [-0.4, -0.18, 0.4, 0.16], 9, 12, { gauche: (W, H) => `<rect width="${f(W)}" height="${f(H)}" fill="#F0E6D0"/>`, droite: (W, H) => `<rect width="${f(W)}" height="${f(H)}" fill="#D8CCB4"/>`, dessus: (W, H) => `<rect width="${f(W)}" height="${f(H)}" fill="#FAF2E2"/>` + `<rect x="${f(W * 0.35)}" width="${f(W * 0.65)}" height="${f(H)}" fill="#D8664A"/>` + Array.from({ length: 4 }, (_, i) => `<rect x="${f(W * 0.35 + i * W * 0.16)}" width="1.4" height="${f(H)}" fill="#F4E4C8"/>`).join(''), arete: null });
  const [cx, cy] = iso(-0.28, -0.02, 12);
  s += plan(`M${P2(cx - 7, cy)} Q${P2(cx - 8, cy - 7)} ${P2(cx, cy - 7)} Q${P2(cx + 8, cy - 7)} ${P2(cx + 7, cy)} Q${P2(cx, cy + 3)} ${P2(cx - 7, cy)} Z`, '#6FA3D9', 0.6) + trait(`M${P2(cx - 4, cy - 3)} Q${P2(cx, cy - 1)} ${P2(cx + 4, cy - 4)}`, '#4C7FB5', 0.6);
  // (le dais de voile, tendu entre deux montants et qui ondule : n)
  const a0 = iso(-0.42, -0.2, 0), a1 = iso(0.42, -0.2, 0), t0 = iso(-0.42, -0.2, 34), t1 = iso(0.42, -0.2, 34);
  s += buche(a0[0], a0[1], t0[0], t0[1], 1.2, g, { flotte: true }) + buche(a1[0], a1[1], t1[0], t1[1], 1.2, g, { flotte: true });
  const w = Math.sin((n / 8) * Math.PI * 2) * 2;
  const f0 = iso(-0.42, 0.25, 26), f1 = iso(0.42, 0.25, 26);
  s += plan(`M${P2(...t0)} L${P2(...t1)} L${P2(f1[0], f1[1] + w)} Q${P2((f0[0] + f1[0]) / 2, (f0[1] + f1[1]) / 2 + 4 - w)} ${P2(f0[0], f0[1] - w)} Z`, '#F2E6CC', 0.8)
    + trait(`M${P2(...t0)} L${P2(...t1)}`, '#E0D4B8', 1.2) + trait(`M${P2(f0[0], f0[1] - w)} Q${P2((f0[0] + f1[0]) / 2, (f0[1] + f1[1]) / 2 + 4 - w)} ${P2(f1[0], f1[1] + w)}`, '#D8664A', 1.2)
    + trait(`M${P2(...f1)} L${P2(iso(0.5, 0.36, 0)[0], iso(0.5, 0.36, 0)[1])}`, '#9A8A6A', 0.5);
  return s;
}

// ——— le chat roux en boule ———
function chat(n = 0) {
  const b = Math.sin((n / 8) * Math.PI * 2) * 0.5;
  return contact(0, 2, 13) + plan('M-11,1 Q-13,-6 -6,-8 Q4,-10 10,-4 Q12,2 4,3 Q-6,4 -11,1 Z', '#D8664A', 0.6)
    + plan(`M-11,1 Q-13,${f(-6 - b)} -6,${f(-8 - b)} Q4,${f(-10 - b)} 10,${f(-4 - b)} Q12,2 4,3 Q-6,4 -11,1 Z`, '#F0944A', 0.8)
    + [-6, -1, 4].map(x => trait(`M${x},${f(-8 - b)} q1.4,3 0,5`, '#C8642A', 0.9)).join('')
    + plan(`M4,${f(-6 - b)} Q11,${f(-8 - b)} 12,-2 Q10,1 6,0 Z`, '#F0944A', 0.7) + plan('M9,-5 L10.6,-8.4 L11.6,-4.6 Z', '#F0944A', 0.5) + plan('M6.6,-6 L7,-9.2 L8.6,-6 Z', '#F0944A', 0.5)
    + trait('M8,-2.6 q.8,.6 1.6,0 M10.4,-3 q.6,.5 1.2,0', ENCRE, 0.5) + `<ellipse cx="11.4" cy="-1.4" rx=".6" ry=".4" fill="#FF8AA0"/>`
    + plan('M-11,1 Q-14,-1 -12,-4 Q-6,0 -4,2 Z', '#F0944A', 0.6) + trait('M-12,-3 q2,2 5,3.4', '#C8642A', 0.6)
    + `<ellipse cx="0" cy="2.6" rx="14" ry="3" fill="#6FA3D9" opacity=".0"/>`;
}

// ——— le chien assis, la queue qui bat ———
function chien(n = 0) {
  const q = Math.sin((n / 8) * Math.PI * 2) * 4;
  return contact(0, 2, 13) + contact(12, 4, 6, 0.25)
    // (la gamelle)
    + ovale(13, 3, 5, 2, '#C8503A', 0.7) + ovale(13, 2.2, 3.8, 1.3, '#E8C890', 0)
    // (la queue)
    + trait(`M-7,-4 Q-12,${f(-8 - q * 0.3)} ${f(-13 + q)},-14`, ENCRE, 3.2) + trait(`M-7,-4 Q-12,${f(-8 - q * 0.3)} ${f(-13 + q)},-14`, '#C88A4A', 2)
    + plan('M-8,1 Q-10,-10 -2,-14 Q4,-16 6,-10 L6,1 Z', '#C88A4A', 0.8) + plan('M-1,-6 Q2,-2 2,1 L5,1 Q6,-6 4,-9 Z', '#F0D8B0', 0.6)
    + plan('M-6,1 L-6,-4 L-2,-4 L-2,1 Z', '#B87A3A', 0.6) + plan('M2,1 L2,-5 L5.6,-5 L5.6,1 Z', '#C88A4A', 0.6)
    // (la tête, les oreilles, le collier)
    + plan('M-3,-14 Q-4,-22 3,-23 Q10,-22 9,-15 Q7,-11 2,-11 Q-2,-11 -3,-14 Z', '#C88A4A', 0.8) + plan('M5,-16 Q12,-16 12,-13 Q10,-11 6,-12 Z', '#F0D8B0', 0.6) + `<ellipse cx="11.6" cy="-14.4" rx="1.2" ry=".9" fill="${ENCRE}"/>`
    + plan('M-3,-20 Q-7,-18 -6,-12 Q-3,-14 -1,-18 Z', '#8A5A2A', 0.6) + `<circle cx="5" cy="-18" r=".9" fill="${ENCRE}"/><circle cx="5.3" cy="-18.3" r=".3" fill="#FFFFFF"/>`
    + trait('M-1,-11.4 Q3,-10 7,-11.6', '#3E9A96', 1.6) + `<circle cx="3.4" cy="-9.6" r="1.1" fill="#FFD04A" stroke="${ENCRE}" stroke-width=".4"/>`;
}

// ——— le sablier ———
function sablier(n = 0) {
  const t = n / 8;
  let s = contact(0, 2, 12);
  // (le pied sculpté : la base de bois, la colonne tournée)
  s += plan('M-9,2 L9,2 L7,-3 L-7,-3 Z', '#8A5A36') + plan('M-2.6,-3 Q-4,-8 -2,-12 L2,-12 Q4,-8 2.6,-3 Z', '#A8743E', 0.8) + trait('M-1.4,-4 Q-2.4,-8 -1.2,-11', '#E0B070', 0.7);
  // (le sablier : ses deux flasques de laiton, ses colonnettes, ses deux bulbes de verre, le sable de lune qui coule)
  const y0 = -14, y1 = -46, ym = (y0 + y1) / 2;
  s += ovale(0, y0, 9, 3, '#C8963A', 0.8) + ovale(0, y1, 9, 3, '#E0B04A', 0.8);
  s += lueur('saL', 0, ym, 18, CYAN, 0.4);
  s += `<path d="M-6,${y0 - 1} Q-6,${ym + 4} -0.8,${ym} Q-6,${ym - 4} -6,${y1 + 1} L6,${y1 + 1} Q6,${ym - 4} 0.8,${ym} Q6,${ym + 4} 6,${y0 - 1} Z" fill="#E8F8FC" fill-opacity=".35" stroke="#B8D8E8" stroke-width=".8"/>`;
  const haut = 1 - t, bas = t;
  s += `<path d="M${f(-5 * haut)},${f(ym - 2 - 9 * haut)} Q0,${f(ym - 1)} ${f(5 * haut)},${f(ym - 2 - 9 * haut)} Z" fill="${CYAN}"/>`
    + `<path d="M-5.6,${y0 - 1.2} Q0,${f(y0 - 1.2 - 10 * bas - 2)} 5.6,${y0 - 1.2} Z" fill="${CYAN}"/>` + trait(`M0,${ym} L0,${y0 - 2}`, '#C8FFF8', 0.7, ' stroke-dasharray="1 1"');
  s += [-8, 8].map(x => trait(`M${x},${y0} L${x},${y1}`, '#A8743A', 1.4)).join('') + trait('M-4.6,-38 Q-5.4,-32 -2,-31', '#FFFFFF', 0.7, ' opacity=".7"');
  return s;
}

// ——— le hibou sur son perchoir et sa lanterne ———
function hibou(n = 0) {
  const g = rnd(231), cl = (n % 8) === 3;
  let s = contact(0, 2, 8);
  // (le perchoir : le poteau sculpté, sa traverse, la lanterne pendue)
  s += buche(0, 2, 0, -38, 2, g, { c: '#8A5A36' }) + plan('M-11,-38 L11,-38 L11,-35 L-11,-35 Z', '#A8743E', 0.8) + trait('M-8,-38 L-11,-34 M8,-38 L11,-34', '#6A4428', 1)
    + lanterne('hiL', 9, -35, 3);
  // (le hibou : son corps de plumes, ses aigrettes, ses grands yeux d'ambre, ses serres)
  s += plan('M-6,-38 Q-8,-46 -5,-52 Q0,-55 5,-52 Q8,-46 6,-38 Z', '#9A7A5A', 0.8) + plan('M-3.6,-39 Q-4.6,-45 0,-47 Q4.6,-45 3.6,-39 Z', '#E8D8B8', 0.6)
    + [-2, 0, 2].map(x => trait(`M${x - 1},-43 q1,1 2,0`, '#B89A7A', 0.5)).join('')
    + plan('M-5,-51 L-6,-56 L-2.6,-53 Z', '#7A5A3A', 0.5) + plan('M5,-51 L6,-56 L2.6,-53 Z', '#7A5A3A', 0.5)
    + (cl ? trait('M-4.4,-49 l3,0 M1.4,-49 l3,0', ENCRE, 0.8) : `<circle cx="-2.6" cy="-49" r="2.2" fill="#FFC040" stroke="${ENCRE}" stroke-width=".5"/><circle cx="2.6" cy="-49" r="2.2" fill="#FFC040" stroke="${ENCRE}" stroke-width=".5"/><circle cx="-2.4" cy="-49" r="1" fill="${ENCRE}"/><circle cx="2.8" cy="-49" r="1" fill="${ENCRE}"/>`)
    + plan('M-0.8,-47 L0.8,-47 L0,-45.4 Z', '#E8A040', 0.4) + trait('M-2,-38 l0,1.6 M2,-38 l0,1.6', '#E8A040', 0.8);
  return s;
}

// ——— le grimoire sur son lutrin, ses runes qui flottent ———
function grimoire(n = 0) {
  const g = rnd(241), t = n / 8;
  let s = contact(0, 2, 10);
  s += boite('grB', [-0.12, -0.1, 0.12, 0.1], 0, 3, { gauche: (W, H) => tPierres(W, H, g, { haut: 3, long: 4 }), droite: (W, H) => tPierres(W, H, g, { haut: 3, long: 4 }), dessus: (W, H) => `<rect width="${f(W)}" height="${f(H)}" fill="#C8C0B0"/>`, arete: null })
    + plan('M-3,-1 L3,-1 L2.4,-16 L-2.4,-16 Z', '#B8B0A0', 0.8) + trait('M-1.6,-2 L-1.2,-15', '#E8E2D4', 0.6)
    + plan('M-8,-16 L8,-16 L6,-19 L-6,-19 Z', '#A8A090', 0.8);
  // (le livre ouvert : sa reliure violette, ses pages, ses lignes)
  s += plan('M-11,-18 Q-5,-21 0,-18 Q5,-21 11,-18 L10,-23 Q5,-25 0,-22 Q-5,-25 -10,-23 Z', '#5A3A9A', 0.8)
    + plan('M-10,-19 Q-5,-22 0,-19.4 L0,-23 Q-5,-25.4 -9.4,-23.6 Z', '#FAF2E2', 0.6) + plan('M10,-19 Q5,-22 0,-19.4 L0,-23 Q5,-25.4 9.4,-23.6 Z', '#F0E6D0', 0.6)
    + [0, 1, 2].map(i => trait(`M${-8 + i * 0.4},${-20.6 - i * 1.1} Q-5,${-23 - i * 1.1} -1.6,${-21 - i * 1.1}`, '#8A7A9A', 0.4)).join('');
  // (les runes qui montent et tournent, néon)
  s += lueur('grL', 0, -30, 18, MAGENTA, 0.3);
  s += [0, 1, 2, 3].map(i => { const tt = (t + i / 4) % 1, a = tt * Math.PI * 2 + i, x = Math.cos(a) * 9, y = -26 - tt * 18, c = [CYAN, MAGENTA, ACIDE, CYAN][i]; return `<g opacity="${f(Math.sin(tt * Math.PI))}"><circle cx="${f(x)}" cy="${f(y)}" r="3" fill="${c}" opacity=".25"/>${trait(['M-1.6,1.4 L0,-1.6 L1.6,1.4 Z', 'M-1.6,0 L1.6,0 M0,-1.6 L0,1.6', 'M-1.4,-1.4 L1.4,1.4 M1.4,-1.4 L-1.4,1.4', 'M-1.6,1 Q0,-2.4 1.6,1'][i], c, 0.9, ` transform="translate(${f(x)} ${f(y)})"`)}</g>`; }).join('');
  return s;
}

// ——— le chantier, ses trois phases (commun aux sept bâtiments) ———
function chantier(phase) {
  const g = rnd(251 + phase);
  let s = `<defs>${rad('chS', 0, 0, 1, [[0, '#C8A878', 0.75], [0.7, '#C8A878', 0.4], [1, '#C8A878', 0]])}</defs><ellipse cx="0" cy="0" rx="1" ry="1" fill="url(#chS)" transform="translate(0 2) scale(66 33)"/>`;
  // (le terrain piqueté : quatre piquets aux coins, la cordelette tendue, les fanions)
  const coins = [[-0.95, -0.95], [0.95, -0.95], [0.95, 0.95], [-0.95, 0.95]];
  const top = coins.map(([u, v]) => iso(u, v, 9));
  s += trait(`M${top.map(q => P2(...q)).join(' L')} Z`, '#F4E8C8', 0.8);
  coins.forEach(([u, v], i) => { const a = iso(u, v, 0), b = iso(u, v, 10); s += buche(a[0], a[1], b[0], b[1] + 2, 1.2, g, { c: '#B8844A' }) + plan(`M${P2(b[0], b[1] + 1)} L${P2(b[0] + 5, b[1] + 2.4)} L${P2(b[0], b[1] + 4)} Z`, i % 2 ? '#3E9A96' : '#E8504A', 0.5); });
  // (I : quelques pierres ramassées, la pelle plantée dans un tas de terre)
  s += [[-20, 8], [-14, 12], [-26, 12]].map(([x, y]) => B.galet(x, y, 3 + g() * 1.4, g, '#C8C0B0')).join('');
  s += plan('M10,10 Q18,0 28,10 Q18,14 10,10 Z', '#9A6A3A', 0.7) + buche(20, 6, 26, -12, 1, g, { c: '#C89A5A' }) + plan('M17.6,6 L22.4,6 L22,12 L18,12 Z', '#8A94A0', 0.6);
  if (phase >= 2) {
    // (II : le plan trouvé, punaisé sur son chevalet ; les planches empilées)
    const [px, py] = iso(-0.45, -0.35, 0);
    s += [[-6, 0, -2, -24], [6, 0, 2, -24], [0, -2, 0, -22]].map(([a, b, c, d]) => buche(px + a, py + b, px + c, py + d, 0.9, g, { c: '#A8743E' })).join('')
      + plan(`M${P2(px - 9, py - 24)} L${P2(px + 9, py - 24)} L${P2(px + 8, py - 10)} L${P2(px - 8, py - 10)} Z`, '#F4ECD4', 0.7)
      + trait(`M${P2(px - 5, py - 14)} L${P2(px - 5, py - 20)} L${P2(px + 1, py - 22)} L${P2(px + 5, py - 18)} L${P2(px + 5, py - 13)} Z`, '#4C7FB5', 0.6) + trait(`M${P2(px - 5, py - 20)} L${P2(px + 5, py - 18)}`, '#4C7FB5', 0.4)
      + [[-8, -23], [8, -23]].map(([dx, dy]) => `<circle cx="${f(px + dx)}" cy="${f(py + dy)}" r=".8" fill="#E8504A"/>`).join('');
    for (let r = 0; r < 3; r++) s += boite(`chP${r}`, [0.15, 0.3, 0.75, 0.48], r * 2.4, r * 2.4 + 2.2, { gauche: (W, H) => tPlanches(W, H, g, { horiz: true, larg: H }), droite: (W, H) => `<rect width="${f(W)}" height="${f(H)}" fill="#E0A96C"/>`, dessus: (W, H) => tPlanches(W, H, g, { larg: 3.6, c: '#D8A868' }), arete: null });
  }
  if (phase >= 3) {
    // (III : l'échafaudage de perches ligaturées, le seau, la caisse à outils, le tas de pierres taillées)
    const P = [[0.2, -0.75], [0.75, -0.75], [0.75, -0.2]];
    for (const [u, v] of P) { const a = iso(u, v, 0), b = iso(u, v, 44); s += buche(a[0], a[1], b[0], b[1], 1.1, g, { c: '#B8844A' }); }
    for (const z of [16, 32]) { const a = iso(0.2, -0.75, z), b = iso(0.75, -0.75, z), c = iso(0.75, -0.2, z); s += buche(a[0], a[1], b[0], b[1], 0.9, g, { c: '#A8743E' }) + buche(b[0], b[1], c[0], c[1], 0.9, g, { c: '#A8743E' }); }
    s += boite('chE', [0.22, -0.73, 0.73, -0.45], 16, 17.5, { dessus: (W, H) => tPlanches(W, H, g, { larg: 3 }), gauche: (W, H) => `<rect width="${f(W)}" height="${f(H)}" fill="#A8743E"/>`, arete: null });
    s += caisse('chC', -0.6, 0.45, 0.3, 8, g, { marque: false }) + tonneau(...iso(-0.25, 0.7, 0), 4, 7, g, { c: '#8A94A0' });
    for (let i = 0; i < 6; i++) { const q = iso(0.45 + (i % 3) * 0.12, -0.05 + Math.floor(i / 3) * 0.1, 0); s += boite(`chT${i}`, [0.42 + (i % 3) * 0.12, -0.08 + Math.floor(i / 3) * 0.12, 0.52 + (i % 3) * 0.12, 0.02 + Math.floor(i / 3) * 0.12], 0, 4, { gauche: (W, H) => `<rect width="${f(W)}" height="${f(H)}" fill="#D8D2C2"/>`, droite: (W, H) => `<rect width="${f(W)}" height="${f(H)}" fill="#A8A090"/>`, dessus: (W, H) => `<rect width="${f(W)}" height="${f(H)}" fill="#EDE8DC"/>`, arete: null }); void q; }
  }
  return s + [[-58, 4], [54, 10], [-10, 34], [30, 30]].map(([x, y]) => touffe(x, y, g, 0.8)).join('');
}

module.exports = { cuisine, lit, chat, chien, sablier, hibou, grimoire, chantier };
