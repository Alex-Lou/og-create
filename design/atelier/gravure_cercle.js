// Le vieux cercle de pierres, dans l'herbe, la première nuit (choix de l'auteur, 17 oct. : en gravure découpée, comme
// le reste de l'ouverture) : Brume y raconte ceux d'avant, qui parlaient, dansaient, chantaient autour des flammes ;
// leurs silhouettes de papier pâle reviennent un instant, puis s'effacent (05_cercle) ; au même endroit, le Brasier écrit,
// l'épave promise, et Brume qui ne retient plus sa brume (05_promesse). La même nuit que 03_nuit (gravure_vent.js).
const { hash, f } = require('./ouverture');
const { courbe } = require('./papier');
const { atelier, gravure, trait, ovale, ENCRE } = require('./gravure');
const { balance, teinte, navire, MARGE, G, D_ } = require('./theatre_pont');
const { unTemps } = require('./gravure_plage');
const { flamePath } = require('./brume');
const R = require('./gravure_rencontre');
const V = require('./gravure_vent');

// ——— l'herbe, le cercle ———
const C0 = [236, 318], LISIERE = 262;
// la lisière de l'herbe, au-dessus de la plage : une prairie gravée, plus sombre vers nous, ses touffes de papier à
// trois brins, quelques fleurettes ; rien dans le cercle
function herbe(p) {
  const A = atelier(`${p}h`);
  const bord = courbe(t => [G + (D_ - G) * t, LISIERE + 5 * Math.sin(t * 9 + 1) + 3 * Math.sin(t * 23)], 50);
  let s = gravure(A, [...bord, [D_, D_ + 20], [G, D_ + 20]], A.lin([[0, '#5A7A4A'], [0.4, '#3E5E36'], [1, '#1E3420']], 0, LISIERE, 0, D_), { seed: 760, amp: 0.4, angle: 16, pas: 2.6, ombre: 0.3, tailles: 2, tailleP: 4, trait: 2.2, portee: 0, lumiere: [0.3, -1] });
  const touffes = [];
  for (let i = 0; i < 40; i++) {
    const x = G + 10 + hash(i, 71) * (D_ - G - 20), y = LISIERE + 12 + hash(i, 73) ** 0.85 * (D_ - LISIERE - 10);
    if (Math.hypot((x - C0[0]) / 104, (y - C0[1]) / 34) < 1) continue;
    touffes.push([x, y, 0.5 + (y - LISIERE) / 140]);
  }
  for (const [x, y, k] of touffes.sort((a, b) => a[1] - b[1])) {
    const pts = [[x - 7 * k, y], [x - 11 * k, y - 11 * k], [x - 3 * k, y - 4 * k], [x - 1 * k, y - 17 * k], [x + 2.5 * k, y - 4 * k], [x + 10 * k, y - 13 * k], [x + 7 * k, y]];
    s += gravure(A, pts, '#6E9A56', { seed: 780 + Math.round(x), amp: 0.2, angle: 70, pas: 1.8, ombre: 0.45, tailles: 0, trait: 1.3, portee: 0.3, dy: 2, lumiere: [0.3, -1] });
  }
  for (let i = 0; i < 14; i++) {
    const x = G + 20 + hash(i, 75) * (D_ - G - 40), y = LISIERE + 16 + hash(i, 77) * (D_ - LISIERE - 30);
    if (Math.hypot((x - C0[0]) / 110, (y - C0[1]) / 38) < 1) continue;
    s += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(1.6 + hash(i, 79))}" fill="${i % 3 ? '#E6DCB0' : '#C8B4D8'}" stroke="${ENCRE}" stroke-width="0.7"/>`;
  }
  return A.out(s);
}
// les pierres noircies du vieux cercle, en anneau ; celles du fond, celles de devant (les souvenirs passent entre)
const PIERRES = Array.from({ length: 11 }, (_, i) => { const a = (i / 11) * Math.PI * 2 + 0.3; return [C0[0] + 84 * Math.cos(a), C0[1] + 26 * Math.sin(a), 8 + 4 * hash(i, 81), a]; });
function pierres(p, devant) {
  const A = atelier(`${p}p${devant ? 'd' : 'f'}`);
  let s = '';
  if (!devant) s += gravure(A, ovale(C0[0], C0[1] + 2, 54, 15, 22), '#2A2422', { seed: 800, amp: 0.6, angle: 10, pas: 2.2, tailles: 1, trait: 1.6, portee: 0, noir: false }) + [[220, 318], [244, 322], [232, 314], [252, 316]].map(([x, y], k) => `<path d="M${x - 6},${y} l12,${k % 2 ? -2 : 2}" stroke="${ENCRE}" stroke-width="2.4" stroke-linecap="round"/>`).join('');
  for (const [x, y, r, a] of PIERRES.filter(([, y]) => (y > C0[1]) === devant).sort((u, v) => u[1] - v[1])) {
    const k = 0.75 + 0.25 * Math.sin(a);
    s += gravure(A, ovale(x, y - r * 0.4 * k, r * k * 1.15, r * k * 0.75, 12, hash(Math.round(x), 3)), A.lin([[0, '#5A5560'], [0.55, '#3A363E'], [1, '#1A1618']], 0, y - r, 0, y + r * 0.4), { seed: 820 + Math.round(x), amp: 0.5, angle: 40, pas: 2, ombre: 0.35, tailles: 1, tailleP: 2, trait: 1.8, portee: 0.4, dy: 3, lumiere: [0.4, -0.9] });
  }
  return A.out(s);
}
// ——— les souvenirs : les flammes d'autrefois, et ceux d'avant autour d'elles, en papier pâle ———
function flammes(p, orange) {
  const A = atelier(`${p}${orange ? 'o' : 'g'}`), [x, y] = C0;
  const ext = orange ? A.lin([[0, '#F2C24E'], [1, '#D8602A']], 0, y - 60, 0, y) : A.lin([[0, '#E8F2F8'], [1, '#A8C4D8']], 0, y - 60, 0, y);
  const int = orange ? '#FFE8A0' : '#F4FAFF';
  let s = '';
  for (const [dx, r, sway] of [[-18, 11, -4], [16, 10, 5], [0, 15, 2]]) s += `<path d="${flamePath(x + dx, y - r, r, sway)}" fill="${ext}" stroke="${ENCRE}" stroke-width="2.2" stroke-linejoin="round"/><path d="${flamePath(x + dx, y - r * 0.7, r * 0.5, sway * 0.6)}" fill="${int}" stroke="${ENCRE}" stroke-width="1" stroke-linejoin="round"/>`;
  return A.out(s);
}
// une silhouette de ceux d'avant : une tête, une robe en cloche, des bras qui dansent ; du papier pâle, gravé, cerné
const DANSEURS = [[150, 300, 1, 'haut'], [190, 288, 0.9, 'large'], [282, 286, 0.9, 'haut'], [326, 302, 1, 'large'], [118, 330, 1.1, 'large'], [356, 334, 1.1, 'haut']];
function danseur(p, i) {
  const [x, y, k, bras] = DANSEURS[i], A = atelier(`${p}d${i}`);
  const corps = [[x - 10 * k, y], [x - 6 * k, y - 30 * k], [x + 6 * k, y - 30 * k], [x + 10 * k, y]];
  let s = gravure(A, corps, '#D8E6EE', { seed: 840 + i, amp: 0.4, angle: 60, pas: 2.2, ombre: 0.5, tailles: 0, trait: 1.8, portee: 0, lumiere: [-0.5, -0.8] });
  const bd = bras === 'haut' ? `M${x - 5 * k},${y - 27 * k} q-8,-8 -6,-20 M${x + 5 * k},${y - 27 * k} q8,-8 6,-20` : `M${x - 5 * k},${y - 26 * k} q-12,0 -16,-8 M${x + 5 * k},${y - 26 * k} q12,0 16,-8`;
  s += trait(bd, 4.4 * k, ENCRE) + trait(bd, 2.2 * k, '#D8E6EE');
  s += gravure(A, ovale(x, y - 38 * k, 7 * k, 7.6 * k, 14), '#E2EEF4', { seed: 850 + i, amp: 0.2, angle: 60, pas: 2, ombre: 0.55, tailles: 0, trait: 1.8, portee: 0, lumiere: [-0.5, -0.8] });
  return A.out(s);
}
// sa grande flamme d'autrefois, pâle, derrière elle (05_promesse : « avant, j'étais plus grande »)
const BCE = [262, 268], S_BCE = 2;
function grande(p) {
  const A = atelier(`${p}g`), [x, y] = BCE;
  return A.out(`<path d="${flamePath(x, y - 70, 52, 8)}" fill="${A.lin([[0, '#EAF6FF', 0.55], [1, '#9EC4DC', 0.2]], 0, y - 180, 0, y)}" stroke="${ENCRE}" stroke-width="2.4" stroke-linejoin="round" opacity="0.7"/>`);
}
// le navire, au large, dans le banc de brume : L'Hirondelle du prologue (theatre_pont.js), toute petite, gîtée, ses
// lumières éteintes ; elle dérive lentement vers la plage (05_promesse : « mon bateau va s'échouer »)
const NAVIRE = [306, 190];
const navireLoin = p => `<g transform="translate(${NAVIRE[0]} ${NAVIRE[1]}) rotate(7) scale(0.26) translate(-205 -262)">${navire(`${p}n`)}</g>`;
// sa brume qui lui échappe (05_promesse : « j'ai oublié comment la retenir ») : des filets autour d'elle
const sienne = p => R.filets(`${p}s`, 6, [[BCE[0] - 70, BCE[1] - 10, 90, 3, 6], [BCE[0] + 6, BCE[1] + 6, 80, 3, 6]]);

// les plans communs : la nuit, la mer et le banc de brume au loin, la plage, l'herbe, le cercle ; les souvenirs entre
// les pierres du fond et celles de devant ; Brume ; l'avatar ; la lumière froide
const PIEDS_CERCLE = [126, 384];
function decorCercle(p, souvenirs, auLarge = []) {
  const base = V.decorApres(p, { livre: null, nuitee: true, anime: () => '' }).filter(q => !['rocher', 'anime'].includes(q.id));
  base.splice(base.findIndex(q => q.id === 'voile0'), 0, ...auLarge);
  base.splice(base.findIndex(q => q.id === 'nuit'), 0, { id: 'herbe', profondeur: 0.58, marge: MARGE, dessin: () => herbe(p) });
  return [
    ...base,
    { id: 'flaque', profondeur: 0.62, cadre: [130, 290, 212, 60], dessin: () => { const A = atelier(`${p}q`); return A.out(R.flaque(`${p}q`, [C0[0], C0[1] + 4], 100)); } },
    { id: 'pierres-fond', profondeur: 0.62, cadre: [130, 270, 212, 70], dessin: () => pierres(p, false) },
    ...souvenirs,
    { id: 'pierres-devant', profondeur: 0.62, cadre: [130, 300, 212, 70], dessin: () => pierres(p, true) },
    null,
    { id: 'avatar', profondeur: 0.7, pivot: PIEDS_CERCLE },
    { id: 'lumiere', profondeur: 0, marge: MARGE, dessin: () => R.lumiereFroide(p, BCE) },
    { id: 'teinte', profondeur: 0, marge: MARGE, dessin: () => teinte(p) }
  ];
}
const nuitFixe = (plans, D) => ({
  ...R.soirDe(plans, D, 1, 1), voile0: [[0, { o: 0.78 }], [D, { o: 0.78 }]], filets0: [[0, { ...R.soir(1).filets0, x: R.soir(1).filets0.x + 30 }], [D, { ...R.soir(1).filets0, x: R.soir(1).filets0.x + 30 }]],
  nuit: [[0, { o: 0.4 }], [D, { o: 0.4 }]], etoiles: [[0, { o: 1 }], [D, { o: 1 }]]
});
const LARGE = { x: 6, y: 6, z: 1.06 }, SUR_CERCLE = { x: 30, y: 26, z: 1.2 }, SUR_BRUME = { x: 40, y: 10, z: 1.28 }, SUR_AVATAR = { x: -20, y: 24, z: 1.24 };

// ——— 05_cercle : Brume raconte ceux d'avant ; leurs silhouettes de papier pâle dansent autour des flammes d'autrefois,
// puis s'effacent ; « c'est ici que dansaient les flammes orange » ———
function cercle05() {
  const p = 'ce', D0 = 4600;
  const souvenirs = [
    { id: 'flammes', profondeur: 0.62, cadre: [196, 250, 80, 72], pivot: C0, dessin: () => flammes(p, false) },
    { id: 'flammes-orange', profondeur: 0.62, cadre: [196, 250, 80, 72], pivot: C0, dessin: () => flammes(p, true) },
    ...DANSEURS.map(([x, y, k], i) => ({ id: `danseur${i}`, profondeur: 0.62, cadre: [x - 34 * k, y - 60 * k, 68 * k, 66 * k], pivot: [x, y], dessin: () => danseur(p, i) }))
  ];
  const plans = decorCercle(p, souvenirs);
  const idx = DANSEURS.map((d, i) => `danseur${i}`), cache = D => Object.fromEntries(idx.map(id => [id, [[0, { o: 0 }], [D, { o: 0 }]]]));
  // « Autrefois, il y avait ici un cercle de flammes, et ceux d'avant tout autour. » : Brume arrive d'en haut, se pose
  // au-dessus du cercle ; lui arrive de la plage et s'arrête ; les flammes d'autrefois paraissent, pâles, puis eux
  const t0 = { ...unTemps(D0, [[0, { x: 20, y: -20, z: 1.1 }], [D0, LARGE]], {
    ...nuitFixe(plans.filter(Boolean), D0), ...Object.fromEntries(idx.map((id, i) => [id, [[0, { o: 0 }], [2600 + i * 150, { o: 0 }], [D0, { o: 0.4 }]]])),
    flammes: [[0, { o: 0, s: 0.8 }], [1800, { o: 0, s: 0.8 }], [3000, { o: 0.55, s: 1 }], [D0, { o: 0.5, s: 1 }]], 'flammes-orange': [[0, { o: 0 }], [D0, { o: 0 }]],
    brume: [[0, { x: 20, y: -150, s: 0.9 }], [1400, { x: 0, y: 0, s: 1, e: 'ease-out' }], [D0, { x: 0, y: 0 }]],
    avatar: [[0, { x: -70, y: -8, s: 0.96 }], [1400, { x: 0, y: 0, s: 1, e: 'linear' }], [D0, { x: 0, y: 0 }]]
  }), acteur: R.joue([0, 'marche', 'bas_droite'], [1400, 'arret', 'bas_droite'], [1920, 'repos', 'bas_droite']), jeux: { brume: V.B([0, 'content']) } };
  // (la danse : chacun se balance, sautille, tourne un peu, à son rythme)
  const danse = (D, i, o) => balance(0, D, 700 + i * 90, k => ({ x: (k % 2 ? 6 : -6) * (i % 2 ? 1 : -1), y: k % 2 ? -7 : 0, r: (k % 2 ? 8 : -8) * (i % 2 ? -1 : 1), o }));
  const temps = V.repliques(t0, [
    // « Ils parlaient, dansaient, chantaient, riaient. … Et parfois, plus tristement. » : ils dansent ; à la fin, plus lents
    [5600, SUR_CERCLE, R.joue([0, 'repos', 'bas_droite']), V.B([0, 'content'], [4200, 'triste']), { ...Object.fromEntries(idx.map((id, i) => [id, danse(5600, i, 0.6)])), flammes: [[0, { o: 0.5, s: 1 }], [700, { o: 0.7, s: 1.08 }], [1400, { o: 0.55, s: 0.96 }], [2100, { o: 0.7, s: 1.08 }], [2800, { o: 0.55, s: 0.96 }], [3500, { o: 0.65, s: 1.04 }], [5600, { o: 0.45, s: 0.96 }]] }],
    // « C'était un vrai lieu de vie. Je m'en souviens si peu, et tellement à la fois… » : ils s'effacent en montant
    [5000, SUR_BRUME, R.joue([0, 'repos', 'bas_droite']), V.B([0, 'triste'], [3000, 'gene']), { ...Object.fromEntries(idx.map((id, i) => [id, [[0, { o: 0.6 }], [600 + i * 260, { o: 0.6, y: 0 }], [2600 + i * 260, { o: 0, y: -26 }], [5000, { o: 0, y: -26 }]]])), flammes: [[0, { o: 0.45 }], [3600, { o: 0.15 }], [5000, { o: 0.15 }]], brume: [[0, { x: 0, y: 0 }], [3000, { x: 0, y: 10, s: 0.94 }], [5000, { x: 0, y: 10, s: 0.94 }]] }],
    // « Pas grave ! Regarde : c'est ici que dansaient les flammes orange. Tu pourrais peut-être les refaire ? » : elle se
    // ressaisit, file au milieu du cercle ; les flammes orange s'y rallument un instant, puis s'éteignent ; il s'approche
    [4600, SUR_CERCLE, R.joue([0, 'repos', 'bas_droite'], [1600, 'marche', 'bas_droite'], [2500, 'arret', 'bas_droite'], [3020, 'repos', 'bas_droite']), V.B([0, 'gene'], [400, 'content']), { ...cache(4600), flammes: [[0, { o: 0.15 }], [800, { o: 0 }], [4600, { o: 0 }]], 'flammes-orange': [[0, { o: 0, s: 0.7 }], [900, { o: 0, s: 0.7, e: 'ease-out' }], [1500, { o: 0.9, s: 1.06 }], [2600, { o: 0.75, s: 0.98 }], [3600, { o: 0, s: 0.9 }], [4600, { o: 0 }]], brume: [[0, { x: 0, y: 10, s: 0.94 }], [400, { x: 0, y: -8, s: 1, e: 'ease-in' }], [1300, { x: C0[0] - BCE[0], y: C0[1] - 52 - BCE[1], s: 1 }], [4600, { x: C0[0] - BCE[0], y: C0[1] - 52 - BCE[1], s: 1 }]], avatar: [[0, { x: 0, y: 0 }], [1600, { x: 0, y: 0, e: 'linear' }], [2500, { x: 26, y: -6, s: 0.98 }], [4600, { x: 26, y: -6, s: 0.98 }]] }]
  ]);
  plans.splice(plans.indexOf(null), 1, ...V.brumeFigurant(temps, BCE, S_BCE));
  return V.fin(plans, temps, V.NUIT, { brume: [3000, { y: -4 }] });
}

// ——— 05_promesse : le Brasier écrit ; il pense à son bateau, à la brume ; Brume, gênée, la laisse lui échapper ; elle
// était plus grande, avant ———
function promesse05() {
  const p = 'pr', D0 = 4600;
  const plans = decorCercle(p, [
    { id: 'grande', profondeur: 0.64, cadre: [190, 60, 144, 220], pivot: BCE, dessin: () => grande(p) },
    { id: 'sienne', profondeur: 0.66, cadre: [-100, BCE[1] - 40, 600, 70], dessin: () => sienne(p) }
  ], [{ id: 'navire', profondeur: 0.3, cadre: [240, 130, 130, 80], pivot: NAVIRE, dessin: () => navireLoin(p) }]);
  // (le navire sort du banc de brume et dérive vers la plage, réplique après réplique)
  const derive = (D, k) => [[0, { ...N[k], e: 'linear' }], [D, N[k + 1]]];
  const N = [{ x: 40, y: -4, s: 0.85, o: 0 }, { x: 22, y: -2, s: 0.92 }, { x: 10, y: 0, s: 0.98 }, { x: 0, y: 2, s: 1.03 }, { x: -8, y: 3, s: 1.07 }, { x: -14, y: 4, s: 1.1 }];
  // « Attends. Je pense que mon bateau va s'échouer sur la plage… » : il se tourne vers la mer, le regard va au large ;
  // dans le banc de brume, son navire paraît, et dérive lentement vers eux
  const t0 = { ...unTemps(D0, [[0, LARGE], [1200, LARGE], [D0, { x: 30, y: -40, z: 1.14 }]], {
    ...nuitFixe(plans.filter(Boolean), D0), navire: [[0, { ...N[0], e: 'ease-out' }], [1600, { x: 34, y: -3, s: 0.88, o: 1, e: 'linear' }], [D0, N[1]]], grande: [[0, { o: 0, s: 0.8 }], [D0, { o: 0, s: 0.8 }]], sienne: [[0, { o: 0, x: 0 }], [D0, { o: 0, x: 0 }]], brume: [[0, { x: 0, y: 0 }], [D0, { x: 0, y: 0 }]]
  }), acteur: R.joue([0, 'repos', 'bas_droite'], [900, 'repos', 'haut_droite']), jeux: { brume: V.B([0, 'curieuse']) } };
  const temps = V.repliques(t0, [
    // « Tu es Brume, non ? Tu ne pourrais pas, justement, faire s'en aller la brume ? » : il se retourne vers elle
    [4200, SUR_AVATAR, R.joue([0, 'repos', 'bas_droite'], [600, 'pose_pointe', 'bas_droite', 'neutre'], [2600, 'repos', 'bas_droite']), V.B([0, 'curieuse'], [2400, 'surpris']), { navire: derive(4200, 1) }],
    // « Oui… Pardon pour ça. Il y a longtemps que j'ai oublié comment la retenir. » : elle baisse, sa brume lui échappe
    [4600, SUR_BRUME, R.joue([0, 'repos', 'bas_droite']), V.B([0, 'gene']), { navire: derive(4600, 2), brume: [[0, { x: 0, y: 0 }], [1200, { x: 0, y: 12, s: 0.94 }], [4600, { x: 0, y: 12, s: 0.94 }]], sienne: [[0, { o: 0, x: 0 }], [600, { o: 0, x: 0 }], [1800, { o: 0.8, x: 20 }], [4600, { o: 0.5, x: 70 }]] }],
    // « J'ai perdu la mémoire. Et le reste avec. Avant, j'étais plus grande. Bien plus forte aussi. » : derrière elle, sa
    // grande flamme d'autrefois se lève, pâle, puis s'efface
    [5200, { x: 34, y: -6, z: 1.16 }, R.joue([0, 'repos', 'bas_droite']), V.B([0, 'triste']), { navire: derive(5200, 3), sienne: [[0, { o: 0.5, x: 70 }], [1500, { o: 0, x: 110 }], [5200, { o: 0, x: 110 }]], grande: [[0, { o: 0, s: 0.8 }], [1600, { o: 0, s: 0.8, e: 'ease-out' }], [2800, { o: 0.85, s: 1 }], [4200, { o: 0.7, s: 1.02 }], [5200, { o: 0, s: 1.06 }]] }],
    // « Euh… D'accord. Écoute, ce n'est pas grave. Déjà, installons-nous. » : il hausse les épaules ; elle remonte, rassurée
    [4400, LARGE, R.joue([0, 'pose_hausse', 'bas_droite', 'neutre'], [2000, 'repos', 'bas_droite']), V.B([0, 'triste'], [1800, 'content']), { navire: derive(4400, 4), brume: [[0, { x: 0, y: 12, s: 0.94 }], [1800, { x: 0, y: 12, s: 0.94, e: 'ease-out' }], [2600, { x: 0, y: 0, s: 1 }], [4400, { x: 0, y: 0, s: 1 }]] }]
  ]);
  plans.splice(plans.indexOf(null), 1, ...V.brumeFigurant(temps, BCE, S_BCE));
  return V.fin(plans, temps, V.NUIT, { brume: [3000, { y: -4 }], navire: [2600, { y: -1, r: 2 }] });
}

// ——— 05_feu : le feu prend au vieux cercle, dans l'herbe ; Brume, tout près, n'a plus froid ; « Brumelune » ; une étoile
// file, Brume détourne les yeux. Au même endroit que 05_cercle et 05_promesse (il était sur la plage : retour de
// l'auteur, 25 oct.) ———
// (le feu pris : trois bûches croisées, de hautes flammes orange, des braises ; sa chaleur : une lueur qui bat autour de
// lui, et sur l'herbe)
const FEU_CADRE = [176, 222, 120, 104];
function feuPris(p) {
  const A = atelier(`${p}f`), [x, y] = C0;
  let s = [[-26, 4, 22, -6], [-20, 6, 24, 2], [-4, 8, 4, -2]].map(([x0, y0, x1, y1]) => trait(`M${x + x0},${y + y0} L${x + x1},${y + y1}`, 7, ENCRE) + trait(`M${x + x0},${y + y0} L${x + x1},${y + y1}`, 4.4, '#6E4026')).join('');
  const ext = A.lin([[0, '#FFD860'], [0.5, '#FF9A30'], [1, '#E0501E']], 0, y - 90, 0, y);
  for (const [dx, r, sway] of [[-20, 15, -5], [18, 14, 6], [0, 24, 2]]) s += `<path d="${flamePath(x + dx, y - r, r, sway)}" fill="${ext}" stroke="${ENCRE}" stroke-width="2.2" stroke-linejoin="round"/><path d="${flamePath(x + dx, y - r * 0.7, r * 0.5, sway * 0.6)}" fill="#FFF2B8" stroke="${ENCRE}" stroke-width="1" stroke-linejoin="round"/>`;
  s += [[-12, -2], [10, 0], [2, 4], [-24, 6], [22, 5]].map(([dx, dy], k) => `<circle cx="${x + dx}" cy="${y + dy}" r="${1.6 + (k % 2)}" fill="#FFB040" stroke="${ENCRE}" stroke-width="0.6"/>`).join('');
  return A.out(s);
}
const chaleur = p => { const A = atelier(`${p}h`), [x, y] = C0; return A.out(`<ellipse cx="${x}" cy="${y - 24}" rx="210" ry="170" fill="${A.rad([[0, '#FFB060', 0.42], [0.4, '#FF8A40', 0.16], [1, '#FF8A40', 0]], x, y - 24, 210)}"/><ellipse cx="${x}" cy="${y + 6}" rx="120" ry="34" fill="${A.rad([[0, '#FFC070', 0.5], [1, '#FFC070', 0]], x, y + 6, 120)}"/>`); };
// (la lumière qui le grave : le feu, à sa droite)
const FEU = { teinte: '#2A140A', force: 0.24, cote: -1 };
// (Brume, à droite du feu ; lui, là où 05_cercle l'a laissé)
const PRES_DU_FEU = { x: 44, y: 22, s: 1 }, PRES_DU_CERCLE = { x: 26, y: -6, s: 0.98 };
// (le cercle, son feu pris et sa chaleur)
function autourDuFeu(p) {
  const plans = decorCercle(p, [{ id: 'feu', profondeur: 0.62, cadre: FEU_CADRE, pivot: C0, dessin: () => feuPris(p) }]);
  plans.splice(plans.findIndex(q => q && q.id === 'teinte'), 0, { id: 'chaleur', profondeur: 0, marge: MARGE, dessin: () => chaleur(p) });
  return plans;
}
// (le feu danse, sa lueur bat, à leur rythme ; Brume et lui, près du feu, là où ils sont)
const vivant = D => ({ feu: balance(0, D, 380, k => ({ s: k % 2 ? 1.05 : 0.97, o: 1 })), chaleur: balance(0, D, 520, k => ({ o: k % 2 ? 1 : 0.8 })) });
const ici = D => ({ brume: [[0, PRES_DU_FEU], [D, PRES_DU_FEU]], avatar: [[0, PRES_DU_CERCLE], [D, PRES_DU_CERCLE]] });
const REPOS = R.joue([0, 'repos', 'bas_droite']);
function feu05() {
  const p = 'fe', D0 = 4600;
  const plans = autourDuFeu(p);
  plans.splice(plans.findIndex(q => q && q.id === 'etoiles') + 1, 0, { id: 'filante', profondeur: 0.1, cadre: [130, 0, 160, 70], pivot: [268, 22], dessin: () => V.filante(p) });
  const cachee = D => ({ filante: [[0, { o: 0 }], [D, { o: 0 }]] });
  // « Je n'ai jamais rien réchauffé, moi. Mais ce soir, près de ton feu, je n'ai pas froid. »
  const t0 = { ...unTemps(D0, [[0, LARGE], [D0, { ...SUR_CERCLE, e: 'ease-in-out' }]], { ...nuitFixe(plans.filter(Boolean), D0), ...vivant(D0), ...cachee(D0), ...ici(D0) }), acteur: REPOS, jeux: { brume: V.B([0, 'content']) } };
  const temps = V.repliques(t0, [
    // « Le feu tient. Pour cette nuit, ce cercle suffira. »
    [4600, SUR_AVATAR, REPOS, V.B([0, 'content']), { ...vivant(4600), ...cachee(4600), ...ici(4600) }],
    // « Brumelune. C'est ainsi qu'ils appelaient l'île, ceux d'avant. »
    [5000, SUR_BRUME, REPOS, V.B([0, 'content'], [2600, 'triste']), { ...vivant(5000), ...cachee(5000), ...ici(5000) }],
    // une étoile file ; Brume détourne les yeux
    [3000, LARGE, REPOS, V.B([0, 'triste'], [1300, 'gene']), { ...vivant(3000), ...ici(3000), filante: [[0, { x: 60, y: -16, o: 0 }], [500, { x: 60, y: -16, o: 0, e: 'linear' }], [600, { x: 52, y: -14, o: 1, e: 'linear' }], [1600, { x: -40, y: 12, o: 1 }], [2000, { x: -56, y: 16, o: 0 }], [3000, { x: -56, y: 16, o: 0 }]] }]
  ]);
  plans.splice(plans.indexOf(null), 1, ...V.brumeFigurant(temps, BCE, S_BCE));
  return V.fin(plans, temps, FEU, { brume: [3000, { y: -4 }] });
}

// ——— 06_silhouette : la nuit autour du feu ; au loin, en contrebas, sur les rochers du rivage, quelqu'un regarde la
// lueur ; Brume le montre, puis promet de veiller. Au même cercle que 05_feu ———
const ROCHERS = [334, 250];
// (les rochers du rivage, sombres, et celui qui s'y tient debout ; le feu dore à peine son côté tourné vers nous)
function rochers(p) {
  const A = atelier(`${p}r`), [x, y] = ROCHERS;
  let s = gravure(A, [[x - 46, y], [x - 38, y - 16], [x - 18, y - 26], [x + 6, y - 30], [x + 30, y - 20], [x + 46, y - 4], [x + 50, y]], A.lin([[0, '#4A4656'], [1, '#1E1A26']], 0, y - 30, 0, y), { seed: 870, amp: 0.5, angle: 30, pas: 2.4, ombre: 0.4, tailles: 1, tailleP: 3, trait: 1.8, portee: 0.3, dy: 3, lumiere: [-0.6, -0.8] });
  s += gravure(A, [[x - 64, y + 2], [x - 52, y - 8], [x - 40, y + 2]], '#2A2632', { seed: 871, amp: 0.4, tailles: 0, trait: 1.4, portee: 0 });
  // (la lune effleure leur crête)
  s += trait(`M${x - 36},${y - 17} L${x - 18},${y - 25} L${x + 6},${y - 29} L${x + 28},${y - 20}`, 1.2, '#B8C8F0', 0.7);
  return A.out(s);
}
const veilleur = p => {
  const A = atelier(`${p}v`), [x, y] = ROCHERS, t = y - 29, k = 1.7;
  const corps = `M${x - 4 * k},${t} L${x - 3.2 * k},${t - 14 * k} Q${x - 2.6 * k},${t - 17 * k} ${x},${t - 17.4 * k} Q${x + 2.6 * k},${t - 17 * k} ${x + 3.2 * k},${t - 14 * k} L${x + 4 * k},${t} Z`;
  // (une ombre debout ; le feu lointain dore son côté tourné vers lui, à gauche ; la lune, le haut de sa tête)
  return A.out(`<path d="${corps}" fill="#0C0A14" stroke="${ENCRE}" stroke-width="1"/><circle cx="${x}" cy="${t - 20.6 * k}" r="${3 * k}" fill="#0C0A14" stroke="${ENCRE}" stroke-width="1"/>`
    + `<path d="M${x - 3.4 * k},${t - 1} L${x - 2.8 * k},${t - 14 * k} M${x - 3.2 * k},${t - 20 * k} q0.6,-2.2 2.6,-2.8" stroke="#FFB870" stroke-width="1.1" stroke-linecap="round" fill="none" opacity="0.9"/>`);
};
function silhouette06() {
  const p = 'si', D0 = 4600, D1 = 5200;
  const plans = autourDuFeu(p);
  // (devant la brume du large, juste derrière l'herbe : on le voit nettement, là-bas)
  plans.splice(plans.findIndex(q => q && q.id === 'herbe'), 0,
    { id: 'rochers', profondeur: 0.4, cadre: [260, 210, 130, 50], pivot: ROCHERS, dessin: () => rochers(p) },
    { id: 'veilleur', profondeur: 0.4, cadre: [318, 172, 32, 52], pivot: [ROCHERS[0], ROCHERS[1] - 29], dessin: () => veilleur(p) });
  const SUR_ROCHERS = { x: 80, y: -30, z: 1.45 };
  // (il se tient immobile ; à peine s'il bouge)
  const guette = D => ({ veilleur: balance(0, D, 2400, k => ({ x: k % 2 ? 0.6 : 0 })) });
  // « Là-bas, sur les rochers. Quelqu'un regarde ton feu. » : le regard va aux rochers ; lui se tourne vers eux
  const t0 = { ...unTemps(D0, [[0, SUR_AVATAR], [1600, { ...SUR_ROCHERS, e: 'ease-in-out' }], [D0, SUR_ROCHERS]], { ...nuitFixe(plans.filter(Boolean), D0), ...vivant(D0), ...guette(D0), ...ici(D0) }), acteur: R.joue([0, 'repos', 'bas_droite'], [900, 'repos', 'haut_droite']), jeux: { brume: V.B([0, 'surpris']) } };
  const temps = V.repliques(t0, [
    // « On lui fera une place demain, si le cœur lui en dit. En attendant, dors : je veille sur nous. »
    [D1, LARGE, R.joue([0, 'repos', 'haut_droite'], [1200, 'repos', 'bas_droite']), V.B([0, 'content']), { ...vivant(D1), ...guette(D1), ...ici(D1) }]
  ]);
  plans.splice(plans.indexOf(null), 1, ...V.brumeFigurant(temps, BCE, S_BCE));
  return V.fin(plans, temps, FEU, { brume: [3000, { y: -4 }] });
}

module.exports = { cercle05, promesse05, feu05, silhouette06 };
