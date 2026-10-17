// Le premier matin, en gravures découpées (le style de l'ouverture, choix de l'auteur, 16 oct.) : gris et doux, la
// brume qui tient au large (le Vent n'a ouvert que la plage proche). L'épave de l'Hirondelle s'est échouée cette nuit
// contre les rochers, au bout de la plage (10_epave, par ses yeux) ; Lorena sort de l'eau et vient au feu (10_aster).
// Lorena et Brume jouent la scène en figurants (figurants.js : une image par animation, direction, expression), l'avatar
// sa piste « acteur » (src/game/acteur.js) ; tous gravés à la lumière du matin.
const { hash, f } = require('./ouverture');
const { courbe } = require('./papier');
const { atelier, gravure, trait, ovale, chemin, ENCRE } = require('./gravure');
const { volute, teinte, plein, C, MARGE, G, D_ } = require('./theatre_pont');
const { nuage, plage, unTemps, HORIZON, RIVAGE } = require('./gravure_plage');
const R = require('./gravure_rencontre');
const { figurant, posesDe, gravee, pose } = require('./figurants');
const { fige } = require('./figer');
const { flamePath } = require('./brume');
const { habiller } = require('../personnages/refonte/lorena_tenues');
const LORENA = require('../personnages/refonte/lorena_anims');

// ——— le décor du matin ———
// le ciel : gris bleu en haut, nacré et rosé à l'horizon, le soleil bas derrière la brume, à gauche (peint flou)
function cielMatin(p) {
  const A = atelier(`${p}c`);
  let s = plein(A, A.lin([[0, '#6E7A92'], [0.5, '#A8AAB8'], [0.85, '#D8CCC8'], [1, '#EAD8CC']], 0, G, 0, HORIZON + 10));
  s += plein(A, A.rad([[0, '#FFF0DC', 0.85], [0.3, '#F2D2B8', 0.4], [1, '#C8B0B0', 0]], 92, HORIZON - 10, 230));
  for (let i = 0; i < 10; i++) { const x = hash(i, 61) * 480 - 40, y = 20 + hash(i, 62) * 140, r = 30 + 50 * hash(i, 63); s += `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(r * 1.9)}" ry="${f(r * 0.45)}" fill="${A.rad([[0, i % 3 ? '#8A8EA4' : '#E8D2C4', 0.5], [1, '#8A8EA4', 0]], x, y, r * 1.9)}"/>`; }
  return A.out(s);
}
// la mer du matin, grise et calme : des rangées gravées, le reflet pâle du soleil voilé
function merMatin(p) {
  const A = atelier(`${p}m`);
  let s = gravure(A, [[G, HORIZON - 1], [D_, HORIZON - 1], [D_, RIVAGE + 20], [G, RIVAGE + 20]], A.lin([[0, '#9AA2B2'], [0.5, '#6E8090'], [1, '#4E6274']], 0, HORIZON, 0, RIVAGE), { seed: 500, amp: 0, angle: 4, pas: 3.4, ombre: 0.25, tailles: 0, portee: 0, trait: 1.4, lumiere: [0, -1] });
  const rangee = (y, a, w, c, i) => { const haut = courbe(t => { const x = G + (D_ - G) * t, ph = ((x + i * 31) / w) % 1; return [x, y - a * Math.pow(Math.sin(Math.PI * ph), 2)]; }, 80); return gravure(A, [...haut, [D_, y + 40], [G, y + 40]], c, { seed: 501 + i, amp: 0.3, angle: 4, pas: 3.2, ombre: 0.22, tailles: 0, portee: 0.3, dy: 3, trait: 1.3, lumiere: [0, -1], dans: trait(chemin(haut.map(([x, yy]) => [x, yy + 7])), 0.8, ENCRE, 0.5) }); };
  s += rangee(HORIZON + 18, 2.5, 46, '#8090A0', 0) + rangee(HORIZON + 36, 3.5, 60, '#6A7E8E', 1) + rangee(HORIZON + 54, 4.5, 76, '#586C7E', 2);
  for (let i = 0; i < 9; i++) { const t = i / 9, y = HORIZON + 6 + (RIVAGE - HORIZON - 14) * t ** 1.3, w = 6 + 24 * t, x = 92 + (hash(i, 7) - 0.5) * (14 + 40 * t); s += gravure(A, [[x - w / 2, y], [x + w / 2, y - 0.5], [x + w / 2 - 1, y + 1.8 + t], [x - w / 2 + 1, y + 2 + t]], '#E8E0D4', { seed: 510 + i, amp: 0.2, tailles: 0, noir: false, trait: 0.9, portee: 0 }); }
  return A.out(s);
}
// la fraîcheur du matin sur le sable et la mer (un voile gris bleu, plus léger vers le bas)
const fraicheur = p => { const A = atelier(`${p}k`); return A.out(plein(A, A.lin([[0, '#5A6680', 0.22], [0.5, '#7A8498', 0.12], [1, '#4A5266', 0.24]], 0, G, 0, D_))); };
// les rochers au bout de la plage, et ce que la mer y a laissé de l'Hirondelle : la moitié de son pont, blanc au liseré
// rouge, ses hublots, son garde-corps tordu ; le canot retourné ; des caisses prises dans les cordages
function epave(p) {
  const A = atelier(`${p}e`);
  const roc = (pts, i) => gravure(A, pts, A.lin([[0, '#6A6470'], [1, '#2E2A34']], 0, Math.min(...pts.map(q => q[1])), 0, Math.max(...pts.map(q => q[1]))), { seed: 520 + i, amp: 0.6, angle: 40, pas: 2.8, ombre: 0.45, tailles: 2, tailleP: 5, trait: 2, portee: 0.5, dy: 5, lumiere: [-0.7, -0.7] });
  let s = roc([[244, 268], [252, 232], [276, 206], [306, 196], [338, 200], [372, 186], [404, 204], [430, 236], [440, 270]], 0);
  // le pont : sa coque blanche penchée, posée sur les rochers
  s += gravure(A, [[262, 214], [404, 188], [410, 214], [272, 244]], C.creme, { seed: 530, amp: 0.4, angle: 20, pas: 2.6, ombre: 0.4, tailles: 2, tailleP: 4, trait: 1.8, portee: 0.5, dy: 5, lumiere: [-0.7, -0.7] });
  s += gravure(A, [[270, 236], [408, 208], [409, 214], [272, 243]], C.rouge, { seed: 531, amp: 0.2, tailles: 0, trait: 1, portee: 0 });
  for (let i = 0; i < 6; i++) { const x = 290 + i * 20, y = 222 - i * 4; s += `<circle cx="${x}" cy="${f(y)}" r="3.2" fill="#2C3A44" stroke="${ENCRE}" stroke-width="1.1"/><circle cx="${x - 0.9}" cy="${f(y - 0.9)}" r="0.9" fill="#C8D8DC"/>`; }
  s += trait('M266,212 L270,196 M286,208 L288,190 M306,204 Q310,188 318,186 M330,200 L328,182 L340,176 M352,196 L354,180 M378,192 L382,174', 1.8, ENCRE) + trait('M268,198 Q300,186 330,182 T384,174', 1.6, ENCRE);
  // le canot retourné, sur le sable au pied des rochers ; les caisses et leurs cordages
  s += gravure(A, [[206, 278], [222, 262], [270, 258], [292, 270], [286, 280]], '#4E6A7E', { seed: 532, amp: 0.4, angle: 10, tailles: 1, trait: 1.6, portee: 0.5, dy: 4, lumiere: [-0.7, -0.7] }) + trait('M214,272 L284,268', 1, ENCRE, 0.7);
  for (const [x, y, w, i] of [[300, 262, 22, 0], [318, 252, 18, 1], [330, 268, 20, 2]]) s += gravure(A, [[x, y], [x + w, y - 2], [x + w + 1, y + w * 0.7], [x + 1, y + w * 0.72]], '#8A6440', { seed: 540 + i, amp: 0.3, tailles: 1, tailleP: 3, trait: 1.4, portee: 0.4, dy: 3, lumiere: [-0.7, -0.7] }) + trait(`M${x + 2},${y + 4} L${x + w - 2},${y + w * 0.6} M${x + w - 2},${y + 3} L${x + 3},${y + w * 0.6}`, 1.2, '#C8A86A');
  s += trait('M296,276 Q310,286 328,280 T360,288', 2, '#C8A86A') + trait('M296,276 Q310,286 328,280 T360,288', 0.7, ENCRE, 0.6);
  return A.out(s + volute(352, 214, 5, 1, 1.4, 1.2));
}
const decorMatin = p => [
  { id: 'ciel', profondeur: 0.1, marge: MARGE, flou: 0.2, dessin: () => cielMatin(p) },
  { id: 'nuage0', profondeur: 0.14, cadre: [-80, 24, 600, 60], dessin: () => nuage(p, 0, 60, 16, '#7A7E92') },
  { id: 'nuage1', profondeur: 0.18, cadre: [-80, 100, 600, 56], dessin: () => nuage(p, 1, 132, 12, '#9A92A0', -40, 480) },
  { id: 'mer', profondeur: 0.3, marge: MARGE, dessin: () => merMatin(p) },
  // (la brume tient au large : le Vent n'a ouvert que la plage proche, l'épave en est sortie)
  { id: 'voile-large', profondeur: 0.32, marge: MARGE, flou: 0.2, dessin: () => R.voile(p, 5, HORIZON + 4, 30, 0.85) },
  { id: 'filets-large', profondeur: 0.34, cadre: [-100, HORIZON - 24, 600, 56], dessin: () => R.filets(p, 5, [[-40, HORIZON + 6, 210, 3, 7], [170, HORIZON + 12, 260, 4, 8]]) },
  { id: 'epave', profondeur: 0.45, cadre: [190, 160, 260, 140], dessin: () => epave(p) },
  { id: 'plage', profondeur: 0.55, marge: MARGE, dessin: () => plage(p) },
  { id: 'lechee', profondeur: 0.55, marge: MARGE, dessin: () => R.lechee(p) },
  { id: 'fraicheur', profondeur: 0, marge: MARGE, dessin: () => fraicheur(p) }
];
const lecheeVa = D => [[0, { y: -10 }], [D * 0.4, { y: 8, e: 'ease-in-out' }], [D * 0.8, { y: -6, e: 'ease-in-out' }], [D, { y: 2 }]];
const MATIN = { teinte: '#3A4458', force: 0.16, cote: 1 };

// ——— 10_epave : par ses yeux, le matin ; l'épave contre les rochers ; une nageuse, au loin ———
// (Lorena, toute petite, qui nage vers la plage : sa tête, un bras qui sort de l'eau, le sillage)
function nageuse() {
  return `<g><animateTransform attributeName="transform" type="translate" values="0 0;-26 6" dur="14s" fill="freeze"/>`
    + `<g transform="translate(232 238)"><animateTransform attributeName="transform" type="translate" values="232 238;232 240;232 238" dur="1.6s" repeatCount="indefinite"/>`
    + `<path d="M-14,4 q7,-3 14,0 t14,0" fill="none" stroke="#E8E0D4" stroke-width="1.4" stroke-linecap="round"/><circle cx="0" cy="0" r="3.2" fill="#5A3A28" stroke="${ENCRE}" stroke-width="1"/>`
    + `<path d="M2,0 q4,-7 9,-5" fill="none" stroke="${ENCRE}" stroke-width="2.4" stroke-linecap="round"><animate attributeName="d" values="M2,0 q4,-7 9,-5;M2,0 q-2,-6 -7,-6;M2,0 q4,-7 9,-5" dur="1.6s" repeatCount="indefinite"/></path>`
    + `<path d="M2,0 q4,-7 9,-5" fill="none" stroke="#E8C080" stroke-width="1.1" stroke-linecap="round"><animate attributeName="d" values="M2,0 q4,-7 9,-5;M2,0 q-2,-6 -7,-6;M2,0 q4,-7 9,-5" dur="1.6s" repeatCount="indefinite"/></path></g></g>`
    + R.escarbilles();
}
const regardMatin = p => { const A = atelier(`${p}g`); return A.out(plein(A, A.rad([[0, '#000', 0], [0.68, '#1A1C24', 0.18], [1, '#08080C', 0.6]], 200, 210, 300))); };
function epave10() {
  const p = 'le';
  const plans = [...decorMatin(p), { id: 'anime', profondeur: 0.45, dessin: () => nageuse() }, { id: 'regard', profondeur: 0, marge: MARGE, dessin: () => regardMatin(p) }, { id: 'teinte', profondeur: 0, marge: MARGE, dessin: () => teinte(p) }];
  // (le regard va de la mer à l'épave, puis s'y attarde : « mes affaires sont là-dedans… ou au fond »)
  const D0 = 6000, D1 = 5000;
  const temps = [
    unTemps(D0, [[0, { x: -50, y: 0, z: 1.1 }], [D0, { x: 40, y: 6, z: 1.22, e: 'ease-in-out' }]], { lechee: lecheeVa(D0) }),
    unTemps(D1, [[0, { x: 40, y: 6, z: 1.22 }], [D1, { x: 56, y: 10, z: 1.34, e: 'ease-in-out' }]], { lechee: lecheeVa(D1) })
  ];
  return { plans, partition: { temps, repos: { duree: 9000, camera: { x: -4, y: 2, z: 0.02 }, pistes: { lechee: [2600, { y: 12 }] } } } };
}

// ——— 10_aster : Lorena sort de l'eau et vient au feu ; elle, Brume et l'avatar jouent chaque réplique ———
const PIEDS_AVATAR = [76, 396], PIEDS_LORENA = [262, 368], BRUME = [158, 236];
const LORENA_C = habiller('cire', null, 'naufragee');
// Lorena, une image : son kit (lorena_anims.js), gravée à la lumière du matin, à sa place
const lorenaImage = (anim, dir, n, expr) => pose(gravee(fige(LORENA.dessiner({ ...LORENA_C, uid: `lo${anim}${dir}${n}${expr || ''}` }, anim, dir, n, expr), 0), `lo${anim.slice(0, 3)}${dir.slice(0, 2)}${n}${(expr || '').slice(0, 3)}`, MATIN), PIEDS_LORENA, 3);
// Brume, une image de son tremblement (0, 1, 2), avec son expression, son halo
const BRUME_ANIMS = { flotte: { images: 3, dt: 0.28 } };
const brumeImage = (anim, dir, n, expr) => { const k = n, id = `lb${n}${(expr || 'n').slice(0, 3)}`; return `<defs>${R.HALO(id)}</defs><circle cx="${BRUME[0]}" cy="${BRUME[1] - 12}" r="44" fill="url(#${id}H)"/><g transform="translate(${BRUME[0]} ${BRUME[1]}) scale(1.6) translate(-20 -32)">${R.brumeGravee(id, k, expr || 'neutre')}</g>`; };
// l'eau peu profonde où elle avance encore, devant ses jambes : la frange de la mer elle-même (le même dessin, à la même
// profondeur, avec le même va-et-vient), là où elle sort, fondue sur les côtés : rien ne s'en distingue, sauf qu'elle
// passe devant elle
function eauDevant(p) {
  const id = `${p}we`;
  return `<defs><linearGradient id="${id}g" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="0.2" stop-color="#fff"/><stop offset="0.8" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>`
    + `<mask id="${id}" maskUnits="userSpaceOnUse" x="250" y="220" width="100" height="70"><rect x="250" y="220" width="100" height="70" fill="url(#${id}g)"/></mask></defs>`
    + `<g mask="url(#${id})">${R.lechee(p)}</g>`;
}
function aster10() {
  const p = 'la';
  const { joue, tenir } = R;
  // (une réplique par temps : [durée, la caméra, l'avatar, Lorena, Brume, leurs pas])
  const L = (anim, dir, expr) => [anim, dir, expr], B = expr => ['flotte', 'face', expr];
  const plan = (cam, z) => ({ ...cam, z });
  const LARGE = { x: 10, y: 4, z: 1.06 }, DEUX = { x: 20, y: 18, z: 1.18 }, SUR_LORENA = { x: 56, y: 22, z: 1.32 }, SUR_BRUME = { x: -24, y: -6, z: 1.34 }, SUR_AVATAR = { x: -46, y: 30, z: 1.3 };
  const R0 = [
    // 0 « Ho, du feu ! … donne-moi la main » : elle sort de l'eau et vient ; lui sursaute, puis va vers elle
    [4800, LARGE, joue([0, 'repos', 'bas_droite', 'surprise'], [700, 'pose_sursaut', 'bas_droite'], [1800, 'marche', 'bas_droite'], [2900, 'arret', 'bas_droite', 'veille'], [3420, 'repos', 'bas_droite']), [[0, L('marche', 'bas_gauche', 'soulagee')], [3200, L('arret', 'bas_gauche', 'soulagee')], [3720, L('repos', 'bas_gauche', 'soulagee')]], [[0, B('curieuse')]]],
    // 1 « Lorena, navigatrice. Officier de quart… »
    [3600, DEUX, joue([0, 'repos', 'bas_droite']), [[0, L('pose_poings', 'bas_gauche', 'sourire')]], [[0, B('curieuse')]]],
    // 2 « deux requins… un tentacule immense… Bref ! »
    [4200, SUR_LORENA, joue([0, 'repos', 'bas_droite', 'surprise']), [[0, L('pose_tete', 'bas_gauche', 'peur')], [2600, L('pose_hausse', 'bas_gauche', 'ironique')]], [[0, B('surpris')]]],
    // 3 « Un requin ? Un tentacule géant ? … halluciné ? »
    [3600, SUR_AVATAR, joue([0, 'pose_hausse', 'bas_droite']), [[0, L('repos', 'bas_gauche', 'mefiante')]], [[0, B('neutre')]]],
    // 4 « J'aurais préféré, crois-moi. »
    [3000, SUR_LORENA, joue([0, 'repos', 'bas_droite']), [[0, L('repos', 'bas_gauche', 'pensive')]], [[0, B('triste')]]],
    // 5 « En tout cas ! La mer rend ce qu'elle a pris… »
    [3800, DEUX, joue([0, 'repos', 'bas_droite']), [[0, L('pose_joie', 'bas_gauche', 'sourire')], [1700, L('repos', 'bas_gauche', 'sourire')]], [[0, B('content')]]],
    // 6 « On ? Parce que… tu t'installes avec nous ? »
    [3200, SUR_AVATAR, joue([0, 'repos', 'bas_droite', 'surprise'], [500, 'pose_pointe', 'bas_droite']), [[0, L('repos', 'bas_gauche', 'sourire')]], [[0, B('curieuse')]]],
    // 7 « Pourquoi ? … Et ton animal domestique ? » : elle montre Brume du doigt
    [4200, DEUX, joue([0, 'repos', 'bas_droite']), [[0, L('pose_poings', 'bas_gauche', 'decidee')], [1900, L('pose_pointe', 'bas_gauche', 'ironique')]], [[0, B('neutre')], [2000, B('surpris')]]],
    // 8 « Je ne suis PAS un animal ! … Je suis Brume ! » : elle s'enfle, outrée ; lui sursaute à côté d'elle
    [3800, SUR_BRUME, joue([0, 'pose_sursaut', 'bas_droite'], [900, 'repos', 'bas_droite', 'surprise']), [[0, L('repos', 'bas_gauche', 'surprise')]], [[0, B('surpris')]]],
    // 9 « Oh, mais ça parle ! »
    [3200, SUR_LORENA, joue([0, 'repos', 'bas_droite', 'surprise']), [[0, L('pose_sursaut', 'bas_gauche', 'surprise')]], [[0, B('gene')]]],
    // 10 « … la flammèche qui parle, c'est la goutte d'eau, c'est ça ? »
    [4200, SUR_AVATAR, joue([0, 'pose_croises', 'bas_droite', 'ironique']), [[0, L('repos', 'bas_gauche', 'genee')]], [[0, B('content')]]],
    // 11 « Je… Je n'avais juste jamais… parlé à une entité… magique ! »
    [3800, SUR_LORENA, joue([0, 'repos', 'bas_droite']), [[0, L('pose_hausse', 'bas_gauche', 'genee')]], [[0, B('gene')]]],
    // 12 « Quoi qu'il en soit ! On va devoir trouver un moyen de survivre… »
    [3800, DEUX, joue([0, 'repos', 'bas_droite', 'decidee']), [[0, L('pose_poings', 'bas_gauche', 'decidee')]], [[0, B('neutre')]]],
    // 13 « Construisons-nous un véritable abri de naufragés. »
    [3200, LARGE, joue([0, 'pose_poings', 'bas_droite', 'decidee']), [[0, L('pose_pointe', 'face', 'decidee')]], [[0, B('content')]]],
    // 14 « Elle a raison. Ici… Il arrive des choses… » : elle baisse, la voix basse
    [4200, SUR_BRUME, joue([0, 'repos', 'bas_droite']), [[0, L('repos', 'bas_gauche', 'inquiete')]], [[0, B('triste')]]],
    // 15 « Euuh… Brume ? Ça va ? »
    [3000, SUR_AVATAR, joue([0, 'repos', 'bas_droite', 'surprise']), [[0, L('repos', 'bas_gauche', 'inquiete')]], [[0, B('triste')]]],
    // 16 « Oubliez ça. Je vous aiderai à bien tout comprendre. »
    [3600, DEUX, joue([0, 'repos', 'bas_droite']), [[0, L('repos', 'bas_gauche', 'sourire')]], [[0, B('content')]]]
  ];
  const clips = list => list.map(([t, [anim, dir, expr]]) => [t, expr ? { anim, dir, expr } : { anim, dir }]);
  // (les pas : elle sort de l'eau, au loin, dans la frange de la mer (elle y avance lentement, l'eau aux chevilles),
  // puis vient jusqu'à lui en grandissant ; il va à sa rencontre ; Brume s'enfle, outrée, puis baisse)
  const entree = D => [[0, { x: 38, y: -124, s: 0.44 }], [1100, { x: 34, y: -110, s: 0.5, e: 'linear' }], [3200, { x: 0, y: 0, s: 1, e: 'cubic-bezier(.3,0,.4,1)' }], [D, { x: 0, y: 0, s: 1 }]];
  // (la frange de la mer au premier temps, et l'eau devant ses jambes avec elle, au même pas : elle s'efface quand elle
  // en sort)
  const vague0 = D => [[0, { y: -10 }], [700, { y: -7, e: 'ease-in' }], [1300, { y: -2, e: 'linear' }], [D * 0.4, { y: 8, e: 'ease-out' }], [D * 0.8, { y: -6, e: 'ease-in-out' }], [D, { y: 2 }]];
  const vaVers = D => [[0, { x: 0, y: 0 }], [1800, { x: 0, y: 0 }], [2900, { x: 34, y: -6, e: 'linear' }], [D, { x: 34, y: -6 }]];
  const outree = D => [[0, { y: 0, s: 1 }], [200, { y: -26, s: 1.3, e: 'cubic-bezier(.2,.8,.4,1.3)' }], [D - 600, { y: -20, s: 1.24 }], [D, { y: -6, s: 1.08, e: 'ease-in-out' }]];
  const baisse = D => [[0, { y: -6, s: 1.08 }], [900, { y: 14, s: 0.92, e: 'ease-in-out' }], [D, { y: 14, s: 0.92 }]];
  const temps = [];
  R0.forEach(([D, cam, acteur, lo, br], n) => {
    const jeux = { lorena: clips(lo), brume: clips(br) };
    if (!n) {
      temps.push({ ...unTemps(D, [[0, plan(LARGE, 1.04)], [D, { ...cam, e: 'ease-out' }]], { lechee: vague0(D), lorena: entree(D), 'eau-devant': vague0(D).map(([t, c]) => [t, { ...c, o: t < 1300 ? 1 : 0 }]), avatar: vaVers(D), brume: [[0, { y: 0, s: 1 }], [D, { y: -6, s: 1.08 }]] }), acteur, jeux });
      return;
    }
    const prec = temps[n - 1], pistes = { lechee: lecheeVa(D) };
    if (n === 8) pistes.brume = outree(D);
    if (n === 14) pistes.brume = baisse(D);
    if (n === 16) pistes.brume = [[0, { y: 14, s: 0.92 }], [800, { y: -4, s: 1.06, e: 'cubic-bezier(.2,.8,.4,1.2)' }], [D, { y: -6, s: 1.08 }]];
    const t = tenir(prec, D, acteur, pistes);
    t.camera = [[0, { ...prec.camera[prec.camera.length - 1][1], e: undefined }], [Math.min(900, D), { ...cam, e: 'ease-in-out' }], [D, cam]];
    t.jeux = jeux;
    temps.push(t);
  });
  for (const t of temps) t.camera.forEach(([, c]) => { if (c.e === undefined) delete c.e; });
  const plans = [
    ...decorMatin(p),
    ...figurant({ id: 'lorena', profondeur: 0.62, cadre: [180, 160, 170, 220], pivot: PIEDS_LORENA }, LORENA.ANIMS, posesDe(temps, 'lorena'), lorenaImage),
    { id: 'eau-devant', profondeur: 0.55, cadre: [250, 220, 100, 70], dessin: () => eauDevant(p) },
    { id: 'avatar', profondeur: 0.7, pivot: PIEDS_AVATAR },
    ...figurant({ id: 'brume', profondeur: 0.68, cadre: [100, 170, 116, 116], pivot: [BRUME[0], BRUME[1] + 10] }, BRUME_ANIMS, posesDe(temps, 'brume'), brumeImage),
    { id: 'teinte', profondeur: 0, marge: MARGE, dessin: () => teinte(p) }
  ];
  return { plans, partition: { lumiere: MATIN, temps, repos: { duree: 9000, camera: { x: -3, y: 2, z: 0.02 }, pistes: { lechee: [2600, { y: 12 }] } } } };
}

module.exports = { epave10, aster10 };
