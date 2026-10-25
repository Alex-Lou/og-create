// Le livre et le Vent en gravure découpée (choix de l'auteur, 17 oct. : la fin de l'arrivée et la suite, d'un bloc,
// comme la rencontre) : Brume tire du rocher le livre aux sept sceaux (03_livre) ; le Vent écrit se lève, ouvre la
// brume autour d'eux, la plage proche se découvre (03_vent) ; ils parlent de ceux d'avant (03_trouee), Brume lève les
// yeux vers le ciel (03_ciel) ; la nuit tombe, froide, et Brume l'emmène (03_nuit). Le même décor que la rencontre :
// la plage du soir, le rocher, la brume (gravure_rencontre.js) ; l'avatar et Brume jouent chaque réplique.
const { hash, f } = require('./ouverture');
const { courbe } = require('./papier');
const { atelier, gravure, trait, ovale, ENCRE } = require('./gravure');
const { volute, teinte, plein, secoue, C, MARGE, G, D_ } = require('./theatre_pont');
const { unTemps } = require('./gravure_plage');
const R = require('./gravure_rencontre');
const { figurant, posesDe } = require('./figurants');

// ——— le livre aux sept sceaux ———
const SCEAUX = ['#C8402E', '#D8A030', '#5E9A44', '#3E7EB8', '#8A5EB0', '#D06A22', '#E2DCCC'];
// fermé, posé à plat, vu d'un peu au-dessus : centre en (0, 0), 64 de large ; du cuir brun gravé, un cadre doré, des
// coins de laiton, deux fermoirs, les sept sceaux de cire en ligne
function livreFerme(A, seed = 600) {
  let s = `<ellipse cx="2" cy="14" rx="38" ry="6" fill="#000" opacity="0.4"/>`;
  s += gravure(A, [[-30, 7], [34, 3], [34, 9], [-29, 13]], '#E6D8B4', { seed, amp: 0.2, tailles: 0, trait: 1.3, portee: 0, noir: false, pas: 1.6, angle: 2, lumiere: [0, -1] });
  s += gravure(A, [[-32, -12], [-37, -2], [-31, 9], [-29, 13], [-35, 3]], '#3A1E10', { seed: seed + 1, amp: 0.2, tailles: 0, trait: 1.3, portee: 0 });
  s += gravure(A, [[-32, -12], [32, -14], [34, 3], [-30, 7]], '#6E3E22', { seed: seed + 2, amp: 0.3, angle: 30, pas: 2, tailles: 1, tailleP: 2, trait: 1.8, portee: 0, lumiere: [-0.5, -0.9] });
  s += trait('M-26,-9.4 L26.6,-11 L28,1.4 L-24.6,4.4 Z', 1.1, '#D8B060');
  for (const [x, y] of [[-31, -11.6], [31, -13.4], [33, 2.2], [-29, 6]]) s += `<circle cx="${x}" cy="${y}" r="2.6" fill="#C8A04A" stroke="${ENCRE}" stroke-width="0.8"/>`;
  s += gravure(A, [[-8, -13], [-4, -13.2], [-3.6, -17], [-7.6, -16.8]], '#B08A3A', { seed: seed + 3, amp: 0.1, tailles: 0, trait: 0.8, portee: 0, noir: false }) + gravure(A, [[6, -13.6], [10, -13.8], [10.4, -17.6], [6.4, -17.4]], '#B08A3A', { seed: seed + 4, amp: 0.1, tailles: 0, trait: 0.8, portee: 0, noir: false });
  SCEAUX.forEach((c, i) => { const [x, y] = sceau(i); s += `<circle cx="${f(x)}" cy="${f(y)}" r="2.5" fill="${c}" stroke="${ENCRE}" stroke-width="0.8"/><circle cx="${f(x - 0.8)}" cy="${f(y - 0.8)}" r="0.7" fill="#FFF4D8" opacity="0.8"/>`; });
  return s;
}
// la place du sceau i sur le plat (centre du livre en (0, 0))
const sceau = i => [-18 + i * 6.2, -4.2 - i * 0.24];
// ouvert à plat sur le sable : deux pages crème, la page du Vent à gauche (sa spirale d'encre, ses lignes), la page de
// droite presque vide (« ses pages ont oublié »), le cuir qui dépasse, l'ombre au creux de la reliure
function livreOuvert(A, seed = 620) {
  let s = `<ellipse cx="0" cy="13" rx="46" ry="6" fill="#000" opacity="0.4"/>`;
  s += gravure(A, [[-42, -8], [0, -4], [42, -10], [44, 8], [0, 14], [-44, 10]], '#4A2614', { seed, amp: 0.3, tailles: 0, trait: 1.6, portee: 0 });
  s += gravure(A, [[-39, -9], [-1, -5], [-1, 11], [-41, 7]], '#EADCB8', { seed: seed + 1, amp: 0.25, angle: 80, pas: 2.2, ombre: 0.6, tailles: 0, trait: 1.3, portee: 0, noir: false, lumiere: [-1, 0] });
  s += gravure(A, [[1, -5], [39, -11], [41, 5], [1, 11]], '#EADCB8', { seed: seed + 2, amp: 0.25, angle: 100, pas: 2.2, ombre: 0.6, tailles: 0, trait: 1.3, portee: 0, noir: false, lumiere: [1, 0] });
  s += trait('M0,-5 L0,11', 1.4, '#6A4A2A');
  s += volute(-20, 0, 5, 1, 1.6, 1.2) + trait('M-34,-4 l9,0.6 M-34,5 l10,0.5 M-12,-3 l8,0.4 M-12,6 l8,0.3', 0.6, '#6A5A40', 0.8);
  s += trait('M8,-4 l12,-1.6 M8,1 l7,-0.9', 0.5, '#6A5A40', 0.4);
  return s;
}

// ——— 03_livre : Brume file au rocher, tire par à-coups le livre caché dans un creux, tombe en arrière avec lui ; le
// livre roule sur le sable devant l'avatar ; elle remonte au-dessus, fière ; ses sept sceaux luisent tour à tour ———
const PIEDS_LIVRE = [156, 354], CREUX = [262, 262], LIVRE = [248, 344], S_LIVRE = 1.15, BR = [262, 258], S_BR = 2.2;
// le creux sombre dans la face du rocher, et sa lèvre (devant le livre tant qu'il y est)
function creux(p) {
  const A = atelier(`${p}c`), [x, y] = CREUX;
  return A.out(gravure(A, ovale(x, y, 22, 14, 18), '#100C14', { seed: 640, amp: 0.5, tailles: 0, trait: 1.8, portee: 0, noir: false }) + gravure(A, ovale(x + 2, y - 2, 15, 8, 14), '#050308', { seed: 641, amp: 0.4, tailles: 0, trait: 0, portee: 0, noir: false }));
}
function levre(p) {
  const A = atelier(`${p}v`), [x, y] = CREUX;
  return A.out(gravure(A, [[x - 23, y - 1], [x - 10, y + 9], [x + 10, y + 9], [x + 23, y - 2], [x + 22, y + 10], [x, y + 16], [x - 22, y + 10]], '#5A5260', { seed: 642, amp: 0.4, angle: 40, pas: 2.4, tailles: 0, trait: 1.6, portee: 0, lumiere: [-0.6, -0.8] }));
}
const posePiece = (A, [x, y], s, corps, r = 0) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})">${corps}</g>`;
const livrePiece = (p, seed) => { const A = atelier(`${p}`); return A.out(posePiece(A, LIVRE, S_LIVRE, livreFerme(A, seed))); };
// le nuage de sable quand il tombe
function poussiere(p) {
  const A = atelier(`${p}s`), [x, y] = LIVRE;
  let s = '';
  for (let i = 0; i < 9; i++) { const a = Math.PI + (i / 8) * Math.PI; s += gravure(A, ovale(x + Math.cos(a) * 30, y + 10 + Math.sin(a) * 9, 5 + hash(i, 3) * 4, 3 + hash(i, 4) * 2, 10), '#C8A060', { seed: 650 + i, amp: 0.4, tailles: 0, trait: 1, portee: 0, noir: false, pas: 2 }); }
  return A.out(s);
}
// sa lueur dorée sur le sable, une fois tombé
const lueurLivre = p => { const A = atelier(`${p}o`), [x, y] = LIVRE; return A.out(`<ellipse cx="${x}" cy="${y + 4}" rx="62" ry="20" fill="${A.rad([[0, '#FFD88A', 0.42], [1, '#FFD88A', 0]], x, y + 4, 62)}"/>`); };
// (vivants, une fois le livre tombé : Brume au-dessus de lui, qui tremble et cligne ; les sceaux qui luisent tour à
// tour ; la lueur qui respire)
const BR_FIN = [250, 300];
function livreVif(p) {
  const A = atelier(`${p}a`), [x, y] = LIVRE;
  let s = `<ellipse cx="${x}" cy="${y + 4}" rx="48" ry="16" fill="${A.rad([[0, '#FFE6A8', 0.4], [1, '#FFE6A8', 0]], x, y + 4, 48)}" opacity="0"><animate attributeName="opacity" values="0;0.9;0" dur="3.4s" repeatCount="indefinite"/></ellipse>`;
  s += `<g transform="translate(${x} ${y}) rotate(4) scale(${S_LIVRE})">` + SCEAUX.map((c, i) => { const [sx, sy] = sceau(i); return `<circle cx="${f(sx)}" cy="${f(sy)}" r="4.6" fill="${c}" opacity="0"><animate attributeName="opacity" values="0;0.85;0;0" keyTimes="0;0.07;0.16;1" dur="4.2s" begin="${f(0.4 + i * 0.36)}s" repeatCount="indefinite"/></circle>`; }).join('') + '</g>';
  s += `<defs>${R.HALO(`${p}a`)}</defs><g transform="translate(${BR_FIN[0]} ${BR_FIN[1]})"><g><animateTransform attributeName="transform" type="translate" values="0 0;0 -3;0 0" dur="1.7s" calcMode="spline" keyTimes="0;0.5;1" keySplines="0.45 0 0.55 1;0.45 0 0.55 1" repeatCount="indefinite"/><circle cx="0" cy="-12" r="62" fill="url(#${p}aH)"/>${R.brumeVive(`${p}a`, S_BR * 1.05, 'content', [3.6, 2.2])}</g></g>`;
  return A.out(s);
}
function livre03() {
  const p = 'li', D0 = 4400, D1 = 4200;
  const plans = [
    ...R.decorSoir(p),
    // (le rocher, net, devant la brume du bas : comme à la fin de 02_rocher)
    { id: 'rocher-devant', profondeur: 0.6, cadre: [140, 180, 200, 150], dessin: () => R.rocher(`${p}d`) },
    { id: 'reflet', profondeur: 0.6, cadre: [140, 180, 200, 150], dessin: () => R.reflet(p, R.ARETE_HAUT) },
    { id: 'creux', profondeur: 0.6, cadre: [230, 240, 64, 44], dessin: () => creux(p) },
    { id: 'livre', profondeur: 0.6, marge: MARGE, pivot: LIVRE, dessin: () => livrePiece(`${p}l`, 600) },
    { id: 'levre', profondeur: 0.6, cadre: [230, 252, 64, 32], dessin: () => levre(p) },
    { id: 'livre-dehors', profondeur: 0.62, marge: MARGE, pivot: LIVRE, dessin: () => livrePiece(`${p}m`, 600) },
    { id: 'lueur', profondeur: 0.62, cadre: [176, 316, 144, 56], dessin: () => lueurLivre(p) },
    { id: 'poussiere', profondeur: 0.62, cadre: [196, 320, 104, 44], pivot: LIVRE, dessin: () => poussiere(p) },
    // (Brume en trois visages, qui se relaient : curieuse, gênée par l'effort, contente ; tous au même mouvement)
    ...[['brume-c', 'curieuse'], ['brume-g', 'gene'], ['brume-j', 'content']].map(([id, expr]) => ({ id, profondeur: 0.62, marge: MARGE, pivot: BR, dessin: () => R.brumePiece(`${p}${id.slice(-1)}`, BR, S_BR, expr) })),
    { id: 'anime', profondeur: 0.62, dessin: () => livreVif(p) },
    { id: 'avatar', profondeur: 0.7, pivot: PIEDS_LIVRE },
    { id: 'lumiere', profondeur: 0, marge: MARGE, dessin: () => R.lumiereFroide(p, [250, 270]) },
    ...R.brumeDevant(p),
    { id: 'teinte', profondeur: 0, marge: MARGE, dessin: () => teinte(p) }
  ];
  // (Brume : elle surgit de derrière le rocher, file au creux, tire par à-coups, tombe en arrière avec le livre, remonte
  // au-dessus de lui ; le livre : une lueur au fond du creux, il vient par à-coups, saute dehors, tombe, rebondit)
  // (la courbe e d'une clé est celle du segment qui part d'elle)
  const [bx, by] = BR, OUT = 2700, TOMBE = 3100, FIN = { x: BR_FIN[0] - bx, y: BR_FIN[1] - by, s: 1.05, r: 0 };
  const brume = [[0, { x: 212 - bx, y: 170 - by, s: 0.9, o: 0, e: 'ease-out' }], [250, { x: 212 - bx, y: 160 - by, s: 0.92, o: 1, e: 'cubic-bezier(.3,0,.4,1)' }], [800, { x: 0, y: 0, s: 0.95 }],
    [1100, { x: -6, y: 2, s: 0.95, r: -8 }], [1400, { x: 0, y: 0, s: 0.95, r: 0 }], [1700, { x: -9, y: 3, s: 0.95, r: -10 }], [2000, { x: -1, y: 0, s: 0.95, r: 0 }], [2300, { x: -12, y: 4, s: 0.95, r: -12 }], [2600, { x: -2, y: 0, s: 0.95, r: 2, e: 'cubic-bezier(.2,.8,.4,1)' }],
    [OUT, { x: -34, y: 12, s: 0.95, r: -22 }], [TOMBE, { x: -38, y: 30, s: 0.95, r: -8, e: 'ease-out' }], [3800, FIN], [D0, FIN]];
  // (ses trois visages suivent les mêmes clés ; seule leur opacité change, d'un coup, à 800 et à la chute ; à D0, la
  // Brume vivante du calque anime (livreVif) prend le relais du dernier : elles ne se montrent jamais ensemble, sinon
  // on en voyait deux, l'une figée, l'autre qui flotte à peine décalée : retour de l'auteur, 25 oct.)
  const visages = [...brume, [799, valeurA(brume, 799)], [TOMBE - 1, valeurA(brume, TOMBE - 1)], [D0 - 1, valeurA(brume, D0 - 1)]].sort((u, v) => u[0] - v[0]);
  const visage = (de, a) => visages.map(([t, c]) => [t, { ...c, o: t >= de && t < a ? c.o ?? 1 : 0 }]);
  const [lx, ly] = LIVRE, [cx, cy] = CREUX, dedans = { x: cx - lx, y: cy - ly + 4, s: 0.44, r: 0 };
  const livre = [[0, { ...dedans, o: 0 }], [600, { ...dedans, o: 0 }], [900, dedans], [1400, { ...dedans, x: dedans.x - 2, r: -4 }], [2000, { ...dedans, x: dedans.x - 3, r: -6 }], [2600, { ...dedans, x: dedans.x - 5, s: 0.5, r: -8, e: 'cubic-bezier(.2,.8,.4,1)' }],
    [OUT, { x: -4, y: -64, s: 0.72, r: -30, e: 'cubic-bezier(.5,0,.9,.5)' }], [TOMBE, { x: 0, y: 0, s: 1, r: 6, e: 'ease-out' }], [3260, { x: 0, y: -6, s: 1, r: 3, e: 'ease-in' }], [3420, { x: 0, y: 0, s: 1, r: 4 }], [D0, { x: 0, y: 0, s: 1, r: 4 }]];
  // (dans le creux, derrière sa lèvre ; dehors, devant elle : les deux suivent les mêmes clés, l'un prend le relais de l'autre)
  const livres = [...livre, [OUT + 1, valeurA(livre, OUT + 1)]].sort((u, v) => u[0] - v[0]);
  const P = {
    ...R.soirDe(plans, D0, 1, 1),
    'brume-c': visage(0, 800), 'brume-g': visage(800, TOMBE), 'brume-j': visage(TOMBE, D0),
    livre: livres.map(([t, c]) => [t, { ...c, o: t <= OUT ? c.o ?? 1 : 0 }]),
    'livre-dehors': livres.map(([t, c]) => [t, { ...c, o: t > OUT ? 1 : 0 }]),
    poussiere: [[0, { s: 0.6, o: 0 }], [TOMBE, { s: 0.6, o: 0, e: 'linear' }], [TOMBE + 60, { s: 0.8, o: 0.9, e: 'ease-out' }], [TOMBE + 700, { s: 1.5, o: 0 }], [D0, { s: 1.5, o: 0 }]],
    lueur: [[0, { o: 0 }], [3420, { o: 0 }], [D0, { o: 1 }]],
    anime: [[0, { o: 0 }], [D0 - 1, { o: 0, e: 'linear' }], [D0, { o: 1 }]],
    reflet: [[0, { o: 0.5 }], [800, { o: 1 }], [D0, { o: 1 }]],
    lechee: R.lecheeVa(D0),
    // (il sursaute quand le livre tombe à côté de lui, recule d'un pas)
    avatar: [[0, { x: 0, y: 0 }], [TOMBE - 50, { x: 0, y: 0, e: 'ease-out' }], [TOMBE + 150, { x: -6, y: -8, e: 'ease-in' }], [TOMBE + 350, { x: -10, y: 0 }], [D0, { x: -10, y: 0 }]]
  };
  const cam0 = { x: 0, y: 2, z: 1.14 }, cam1 = { x: 12, y: 6, z: 1.2 }, chute = { x: 8, y: 12, z: 1.18 };
  const t0 = { ...unTemps(D0, [[0, cam0], [2600, { ...cam1, e: 'ease-in' }], [TOMBE, chute], ...secoue(TOMBE + 10, chute, 3, 3), [D0, chute]], P),
    acteur: R.joue([0, 'repos', 'bas_droite', 'surprise'], [TOMBE - 50, 'pose_sursaut', 'bas_droite'], [3800, 'repos', 'bas_droite', 'surprise']) };
  // « Regarde. Peut-être que toi, tu comprendras. » : il s'approche du livre ; la caméra se penche sur lui ; Brume, au-
  // dessus, l'y invite (« Toucher le livre »)
  const pres = { x: 30, y: 30, z: 1.32 };
  const t1 = R.tenir(t0, D1, R.joue([0, 'repos', 'bas_droite', 'surprise'], [500, 'marche', 'bas_droite'], [1700, 'arret', 'bas_droite'], [2220, 'repos', 'bas_droite']), {
    avatar: [[0, { x: -10, y: 0 }], [500, { x: -10, y: 0, e: 'linear' }], [1700, { x: 26, y: -6, s: 0.98 }], [D1, { x: 26, y: -6, s: 0.98 }]], lechee: R.lecheeVa(D1)
  });
  t1.camera = [[0, chute], [D1, pres]];
  return { plans, partition: { lumiere: R.FROIDE, temps: [t0, t1], repos: { duree: 10000, camera: { x: 3, y: -2, z: 0.02 }, pistes: { filets1: [9000, { x: -24 }], filets3: [10000, { x: 20 }], filets2: [8000, { x: 22 }], lechee: [2600, { y: 12 }] } } } };
}
// la valeur d'une piste à l'instant t (interpolée linéairement entre ses clés : pour poser une clé de plus sans la
// déplacer)
function valeurA(cles, t) {
  let i = 1;
  while (i < cles.length && cles[i][0] < t) i++;
  if (i >= cles.length) return { ...cles[cles.length - 1][1] };
  const [t0, a] = cles[i - 1], [t1, b] = cles[i], k = t1 > t0 ? (t - t0) / (t1 - t0) : 1, v = {};
  for (const key of new Set([...Object.keys(a), ...Object.keys(b)])) { if (key === 'e') continue; const u = a[key] ?? (key === 's' || key === 'o' ? 1 : 0), w = b[key] ?? (key === 's' || key === 'o' ? 1 : 0); v[key] = u + (w - u) * k; }
  return v;
}



// ——— le soir d'après le vent : le décor commun à 03_vent, 03_ciel, 03_trouee et 03_nuit ———
// des étoiles qui paraissent quand la brume s'ouvre : de petites croix crème cernées d'encre, au-dessus de l'horizon
const ETOILES = Array.from({ length: 22 }, (_, i) => [G + 30 + hash(i, 61) * (D_ - G - 60), 16 + hash(i, 63) * 150, 1.4 + hash(i, 65) * 2.2].map(v => Number(f(v))));
const etoile = (x, y, r) => `<path d="M${x},${f(y - r * 1.8)} Q${f(x + r * 0.3)},${f(y - r * 0.3)} ${f(x + r * 1.8)},${y} Q${f(x + r * 0.3)},${f(y + r * 0.3)} ${x},${f(y + r * 1.8)} Q${f(x - r * 0.3)},${f(y + r * 0.3)} ${f(x - r * 1.8)},${y} Q${f(x - r * 0.3)},${f(y - r * 0.3)} ${x},${f(y - r * 1.8)} Z" fill="#F2ECD8" stroke="${ENCRE}" stroke-width="0.8" stroke-linejoin="round"/>`;
const etoiles = p => { const A = atelier(`${p}s`); return A.out(ETOILES.map(([x, y, r]) => etoile(x, y, r)).join('')); };
// leur scintillement (calque anime) : quelques-unes s'allument et s'éteignent
const scintille = () => ETOILES.filter((e, i) => i % 3 === 0).map(([x, y, r], i) => `<circle cx="${x}" cy="${y}" r="${f(r * 2.4)}" fill="#FFF8E0" opacity="0"><animate attributeName="opacity" values="0;0.5;0" dur="${f(2.4 + hash(i, 67) * 2)}s" begin="${f(-hash(i, 69) * 3)}s" repeatCount="indefinite"/></circle>`).join('');
// la nuit qui tombe : un voile bleu nuit sur toute la scène, plus dense en haut
const nuit = p => { const A = atelier(`${p}n`); return A.out(plein(A, A.lin([[0, '#060A22', 0.62], [0.5, '#0C1230', 0.4], [1, '#080C20', 0.5]], 0, G, 0, D_))); };
// le croissant de lune, gravé, et son halo (03_nuit)
const LUNE = [86, 66];
function lune(p) {
  const A = atelier(`${p}u`), [x, y] = LUNE;
  const bord = [...courbe(t => [x + 17 * Math.cos(Math.PI * (0.5 + t)), y + 17 * Math.sin(Math.PI * (0.5 + t))], 18), ...courbe(t => [x - 6 + 12 * Math.cos(Math.PI * (1.5 - t)), y + 15 * Math.sin(Math.PI * (1.5 - t))], 16)];
  return A.out(`<circle cx="${x}" cy="${y}" r="70" fill="${A.rad([[0, '#DDE6F4', 0.32], [1, '#DDE6F4', 0]], x, y, 70)}"/>` + gravure(A, bord, '#EDE4C8', { seed: 680, amp: 0.3, tailles: 2, tailleP: 2, trait: 1.8, portee: 0, lumiere: [-1, 0] }));
}
// une rafale du Vent : un long ruban de papier qui ondule, crème et lavande, gravé, enroulé en volute à sa tête, des
// traits de vitesse devant lui
function rafale(p, i, y, l = 560, a = 10, w = 13) {
  const A = atelier(`${p}w${i}`), x0 = -80;
  const axe = t => [x0 + l * t, y + a * Math.sin(Math.PI * 2 * (t * 1.1 + i * 0.3))], ep = t => w * Math.sin(Math.PI * t) ** 0.7 + 0.5;
  const pts = courbe(t => t, 48).map(t => { const [x, yy] = axe(t), [x2, y2] = axe(Math.min(1, t + 0.01)), [x1, y1] = axe(Math.max(0, t - 0.01)), n = Math.hypot(x2 - x1, y2 - y1) || 1; return [x, yy, -(y2 - y1) / n, (x2 - x1) / n, ep(t)]; });
  let s = gravure(A, [...pts.map(([x, yy, nx, ny, e]) => [x + nx * e, yy + ny * e]), ...pts.slice().reverse().map(([x, yy, nx, ny, e]) => [x - nx * e * 0.5, yy - ny * e * 0.5])], A.lin([[0, '#FBF6F0'], [1, '#C4BCD8']], 0, y - w, 0, y + w), { seed: 700 + i, amp: 0.3, angle: 6, pas: 2.6, ombre: 0.4, tailles: 0, trait: 2, portee: 0.3, lumiere: [0, -1] });
  const [bx, by] = axe(1), [mx, my] = axe(0.55);
  s += volute(bx + 4, by - 8, 10, 1, 1.7, 1.8) + volute(mx, my - 12, 6, -1, 1.4, 1.3);
  s += [0, 1, 2].map(k => trait(`M${f(bx + 20 + k * 6)},${f(by - 14 + k * 12)} l${26 - k * 6},${f(-1 + k)}`, 1.4, ENCRE, 0.7)).join('');
  return A.out(s);
}
// le livre ouvert, posé sur le sable où il est tombé ; sa lueur dorée
const livreOuvertPiece = p => { const A = atelier(`${p}`); return A.out(posePiece(A, LIVRE, S_LIVRE, livreOuvert(A), 4)); };
const livreFermePiece = p => { const A = atelier(`${p}`); return A.out(posePiece(A, LIVRE, S_LIVRE, livreFerme(A, 600), 4)); };
// (vivants : la lueur du livre qui respire ; des volutes qui montent de ses pages, tant que le Vent souffle ; les étoiles)
function pagesVives(p, volutes, livre = true) {
  const A = atelier(`${p}a`), [x, y] = LIVRE;
  let s = !livre ? '' : `<ellipse cx="${x}" cy="${y + 4}" rx="56" ry="18" fill="${A.rad([[0, '#FFE6A8', 0.45], [1, '#FFE6A8', 0]], x, y + 4, 56)}" opacity="0.3"><animate attributeName="opacity" values="0.3;0.9;0.3" dur="3.4s" repeatCount="indefinite"/></ellipse>`;
  if (volutes) s += [[-10, 0, 1, 3.2, 0], [8, -4, -1, 3.6, 1.2], [-2, -2, 1, 3, 2.2]].map(([dx, dy, sens, dur, beg]) => `<g opacity="0"><animate attributeName="opacity" values="0;0.8;0" dur="${dur}s" begin="${-beg}s" repeatCount="indefinite"/><animateTransform attributeName="transform" type="translate" values="0 0;${sens * 10} -40" dur="${dur}s" begin="${-beg}s" repeatCount="indefinite"/>${volute(x + dx, y - 10 + dy, 6, sens, 1.5, 1.4)}</g>`).join('');
  return A.out(s + scintille());
}
// Brume en figurant (figurants.js) : son tremblement (3 images), avec chaque expression que la partition lui fait jouer,
// son halo ; à sa place (le bas de sa flamme en pos), à l'échelle s
const BRUME_ANIMS = { flotte: { images: 3, dt: 0.28 } };
const brumeImage = (pos, s) => (anim, dir, n, expr) => { const id = `vb${n}${(expr || 'n').slice(0, 3)}`; return `<defs>${R.HALO(id)}</defs><circle cx="${pos[0]}" cy="${f(pos[1] - 8 * s)}" r="${f(28 * s)}" fill="url(#${id}H)"/><g transform="translate(${pos[0]} ${pos[1]}) scale(${s}) translate(-20 -32)">${R.brumeGravee(id, n, expr || 'neutre')}</g>`; };
const brumeFigurant = (temps, pos, s, prof = 0.68) => figurant({ id: 'brume', profondeur: prof, cadre: [pos[0] - 34 * s, pos[1] - 44 * s, 68 * s, 56 * s], pivot: pos }, BRUME_ANIMS, posesDe(temps, 'brume'), brumeImage(pos, s));
const B = (...clips) => clips.map(([t, expr]) => [t, { anim: 'flotte', dir: 'face', expr }]);
// une partition jouée réplique par réplique : [durée, la caméra d'arrivée, l'avatar, Brume, les pistes du temps] ; chaque
// temps part de là où le précédent a laissé la caméra et chaque piste (gravure_rencontre.js : tenir), la caméra y va
// en moins d'une seconde
function repliques(t0, liste) {
  const temps = [t0];
  for (const [D, cam, acteur, brume, pistes = {}] of liste) {
    const prec = temps[temps.length - 1], t = R.tenir(prec, D, acteur, { lechee: R.lecheeVa(D), ...pistes });
    const de = prec.camera[prec.camera.length - 1][1];
    t.camera = [[0, { ...de, e: undefined }], [Math.min(900, D), cam], [D, cam]];
    t.camera.forEach(([, c]) => { if (c.e === undefined) delete c.e; });
    t.jeux = { brume };
    temps.push(t);
  }
  return temps;
}
const PIEDS_VENT = [182, 348], BV = [281, 290], S_BV = 2;
// les plans du soir d'après le vent (avec ou sans la brume basse, que le vent chasse ; le livre ouvert ou fermé), la
// place de Brume, ce qui vit (calque anime)
function decorApres(p, { brumeBasse = false, livre = 'ouvert', nuitee = false, anime }) {
  const base = R.decorSoir(p).filter(q => brumeBasse || !['voile-mer', 'voile1', 'filets1', 'voile3', 'filets3'].includes(q.id));
  base.splice(base.findIndex(q => q.id === 'mer-soir'), 0, { id: 'etoiles', profondeur: 0.1, marge: MARGE, dessin: () => etoiles(p) }, ...(nuitee ? [{ id: 'lune', profondeur: 0.12, cadre: [10, 0, 150, 140], dessin: () => lune(p) }] : []));
  return [
    ...base,
    { id: 'nuit', profondeur: 0, marge: MARGE, dessin: () => nuit(p) },
    ...(livre ? [{ id: 'livre', profondeur: 0.62, marge: MARGE, pivot: LIVRE, dessin: () => (livre === 'ouvert' ? livreOuvertPiece(`${p}l`) : livreFermePiece(`${p}l`)) }] : []),
    { id: 'anime', profondeur: 0.62, dessin: anime }
  ];
}
const fin = (plans, temps, lumiere, repos = {}) => ({ plans, partition: { lumiere, temps, repos: { duree: 10000, camera: { x: 3, y: -2, z: 0.02 }, pistes: { filets0: [12000, { x: 14 }], lechee: [2600, { y: 12 }], ...repos } } } });

// ——— 03_vent : le Vent écrit se lève ; des rafales de papier balaient la plage, la brume basse s'arrache et file, le
// ciel se découvre, les premières étoiles ; au large, le banc tient (l'épave y reste cachée). Brume, ébouriffée, puis
// ravie : « Tu es comme eux ! » ———
function vent03() {
  const p = 've', D0 = 2600;
  const temps0 = [];
  const plans = [
    ...decorApres(p, { brumeBasse: true, anime: () => pagesVives(p, true) }),
    ...[0, 1, 2].map(i => ({ id: `rafale${i}`, profondeur: 0.5 + i * 0.14, cadre: [-200, [130, 236, 322][i] - 40, 800, 80], dessin: () => rafale(p, i, [130, 236, 322][i]) })),
    { id: 'avatar', profondeur: 0.7, pivot: PIEDS_VENT },
    null,
    { id: 'lumiere', profondeur: 0, marge: MARGE, dessin: () => R.lumiereFroide(p, BV) },
    ...R.brumeDevant(p),
    { id: 'teinte', profondeur: 0, marge: MARGE, dessin: () => teinte(p) }
  ];
  // (le vent arrache la brume, du premier plan au large : les filets filent vers la droite ; les voiles, des aplats qui
  // couvrent la scène, s'effacent sur place en dérivant à peine (glissés, leur bord se verrait) ; le banc du large tient)
  const s1 = R.soir(1), file = (id, t0, t1, dx) => { const v = id.startsWith('voile') ? 20 : dx; return [[0, s1[id]], [t0, { ...s1[id], e: 'ease-in' }], [t1, { ...s1[id], x: (s1[id].x || 0) + v, o: 0 }], [D0, { ...s1[id], x: (s1[id].x || 0) + v, o: 0 }]]; };
  const passe = (t0, t1) => [[0, { x: -560, o: 0 }], [t0, { x: -560, o: 1, e: 'cubic-bezier(.35,0,.65,1)' }], [t1, { x: 520, o: 1, e: 'linear' }], [t1 + 1, { x: 520, o: 0 }], [D0, { x: 520, o: 0 }]];
  const P = {
    ...R.soirDe(plans.filter(Boolean), D0, 1, 1),
    voile2: file('voile2', 200, 1200, 300), filets2: file('filets2', 200, 1200, 340),
    voile3: file('voile3', 400, 1500, 280), filets3: file('filets3', 400, 1500, 320),
    voile1: file('voile1', 650, 1900, 260), filets1: file('filets1', 650, 1900, 300),
    'voile-mer': file('voile-mer', 900, 2300, 240),
    voile0: [[0, s1.voile0], [D0, { o: 0.78 }]], filets0: [[0, s1.filets0], [D0, { ...s1.filets0, x: s1.filets0.x + 30 }]],
    nuage0: [[0, { x: 0 }], [D0, { x: 16 }]], nuage1: [[0, { x: 0 }], [D0, { x: 16 }]],
    etoiles: [[0, { o: 0 }], [1300, { o: 0 }], [D0, { o: 1 }]],
    nuit: [[0, { o: 0 }], [D0, { o: 0 }]],
    rafale0: passe(0, 1900), rafale1: passe(250, 2250), rafale2: passe(500, 2550),
    lechee: R.lecheeVa(D0),
    // (Brume secouée par le vent ; lui recule d'un pas sous la rafale)
    brume: [[0, { x: -20, y: 0 }], [400, { x: -10, y: -4, r: 14 }], [900, { x: -26, y: 2, r: -8 }], [1400, { x: -14, y: -2, r: 10 }], [2000, { x: -20, y: 0, r: 0 }], [D0, { x: -20, y: 0 }]],
    avatar: [[0, { x: 0 }], [300, { x: 0, e: 'ease-out' }], [800, { x: -8 }], [D0, { x: -8 }]]
  };
  const t0 = { ...unTemps(D0, [[0, { x: -6, y: 16, z: 1.22 }], [300, { x: -6, y: 16, z: 1.22, e: 'linear' }], ...secoue(320, { x: -6, y: 16, z: 1.22 }, 2.4, 5), [D0, { x: 4, y: 0, z: 1.04 }]], P),
    acteur: R.joue([0, 'repos', 'haut_droite']), jeux: { brume: B([0, 'surpris']) } };
  temps0.push(t0);
  const DEUX = { x: 10, y: 10, z: 1.12 }, SUR_AVATAR = { x: -12, y: 22, z: 1.26 }, GESTE = { x: 10, y: 6, z: 1.12 };
  const temps = repliques(t0, [
    // « Oh ! Mais toi aussi, tu sais commander aux éléments ?! » : elle bondit, deux fois, ravie ; lui se retourne
    [3600, DEUX, R.joue([0, 'repos', 'bas_droite', 'surprise']), B([0, 'surpris'], [700, 'content']), { brume: [[0, { x: -20, y: 0 }], [300, { x: -20, y: -22, e: 'ease-in' }], [600, { x: -20, y: 0, e: 'ease-out' }], [900, { x: -20, y: -16, e: 'ease-in' }], [1200, { x: -20, y: 0 }], [3600, { x: -20, y: 0 }]] }],
    // « Je… J'ignore ce qui s'est passé. C'est moi qui ai fait ça ? »
    [3800, SUR_AVATAR, R.joue([0, 'pose_hausse', 'bas_droite', 'surprise'], [2400, 'repos', 'bas_droite', 'surprise']), B([0, 'curieuse'])],
    // « Oui ! Tu es comme eux ! Tu peux créer… » : elle tourne autour de lui, toute à sa joie
    [4000, DEUX, R.joue([0, 'repos', 'bas_droite', 'surprise'], [1600, 'repos', 'bas_droite']), B([0, 'content']), { brume: [[0, { x: -20, y: 0 }], [700, { x: -48, y: -30, s: 1.06 }], [1400, { x: -70, y: -6, s: 1.04 }], [2100, { x: -52, y: 12, s: 0.98 }], [2900, { x: -20, y: 0, s: 1 }], [4000, { x: -20, y: 0, s: 1 }]] }],
    // « Moi, je ne le comprends pas. Je le garde pour celui qui doit le recevoir… et on dirait que… c'est toi. » : elle
    // se pose au-dessus du livre, l'y invite (« Tourner la page »)
    [4600, GESTE, R.joue([0, 'repos', 'bas_droite']), B([0, 'gene'], [2600, 'content']), { brume: [[0, { x: -20, y: 0 }], [1800, { x: 0, y: 0 }], [4600, { x: 0, y: 0 }]] }]
  ]);
  plans.splice(plans.indexOf(null), 1, ...brumeFigurant(temps, BV, S_BV));
  return fin(plans, temps, R.FROIDE, { brume: [3000, { y: -4 }] });
}

// ——— 03_ciel : « Quel jour ? » ; Brume ne répond pas : elle se retourne et regarde le ciel ; le regard monte avec
// elle, d'elle aux étoiles ; une étoile file, longuement ———
const BC = [200, 352];
const filante = p => { const A = atelier(`${p}e`); return A.out(trait('M150,52 L268,22', 3.4, ENCRE) + trait('M150,52 L268,22', 1.4, '#FFF4D8') + etoile(268, 22, 2.6)); };
function ciel03() {
  const p = 'ci', D = 2200;
  const plans = [
    ...decorApres(p, { livre: null, anime: () => pagesVives(p, false, false) }).filter(q => !['rocher', 'lechee'].includes(q.id)),
    { id: 'filante', profondeur: 0.1, cadre: [130, 0, 160, 70], pivot: [268, 22], dessin: () => filante(p) },
    null,
    { id: 'lumiere', profondeur: 0, marge: MARGE, dessin: () => R.lumiereFroide(p, BC) },
    { id: 'teinte', profondeur: 0, marge: MARGE, dessin: () => teinte(p) }
  ];
  const P = {
    ...R.soirDe(plans.filter(Boolean), D, 1, 1), voile0: [[0, { o: 0.78 }], [D, { o: 0.78 }]], filets0: [[0, { ...R.soir(1).filets0, x: R.soir(1).filets0.x + 30 }], [D, { ...R.soir(1).filets0, x: R.soir(1).filets0.x + 30 }]],
    nuit: [[0, { o: 0.2 }], [D, { o: 0.24 }]], etoiles: [[0, { o: 1 }], [D, { o: 1 }]],
    // (l'étoile file quand le regard est monté : longtemps, lentement)
    filante: [[0, { x: 60, y: -16, o: 0 }], [950, { x: 60, y: -16, o: 0, e: 'linear' }], [1050, { x: 52, y: -14, o: 1, e: 'linear' }], [2000, { x: -40, y: 12, o: 1 }], [D, { x: -56, y: 16, o: 0 }]],
    // (elle se retourne d'un petit bond, puis reste de dos, les yeux au ciel, et s'élève un peu)
    brume: [[0, { y: 0, r: 0 }], [420, { y: 0, r: 0, e: 'ease-out' }], [540, { y: -9, r: -6, e: 'ease-in' }], [680, { y: 0, r: 0 }], [D, { y: -10 }]]
  };
  const t0 = { ...unTemps(D, [[0, { x: 0, y: 70, z: 1.5 }], [650, { x: 0, y: 70, z: 1.5 }], [1500, { x: 0, y: -70, z: 1.24 }], [D, { x: 0, y: -74, z: 1.24 }]], P), jeux: { brume: B([0, 'curieuse'], [540, 'dos']) } };
  plans.splice(plans.indexOf(null), 1, ...brumeFigurant([t0], BC, 2.6, 0.62));
  return fin(plans, [t0], R.FROIDE);
}

// ——— 03_trouee : la brume ouverte autour d'eux, les étoiles, la nuit qui gagne doucement ; ils parlent de ceux
// d'avant ; le livre ouvert sur le sable, ses pages presque vides ———
const LARGE = { x: 4, y: 2, z: 1.06 }, DEUX = { x: 10, y: 10, z: 1.12 }, SUR_AVATAR = { x: -12, y: 22, z: 1.26 }, SUR_BRUME = { x: 26, y: 12, z: 1.28 };
const apresVent = (plans, D, nuitDe, nuitA) => ({
  ...R.soirDe(plans, D, 1, 1), voile0: [[0, { o: 0.78 }], [D, { o: 0.78 }]], filets0: [[0, { ...R.soir(1).filets0, x: R.soir(1).filets0.x + 30 }], [D, { ...R.soir(1).filets0, x: R.soir(1).filets0.x + 30 }]],
  nuit: [[0, { o: nuitDe }], [D, { o: nuitA }]], etoiles: [[0, { o: 1 }], [D, { o: 1 }]], lechee: R.lecheeVa(D)
});
function trouee03() {
  const p = 'tr', D0 = 3400;
  const plans = [
    ...decorApres(p, { anime: () => pagesVives(p, false) }),
    { id: 'avatar', profondeur: 0.7, pivot: PIEDS_VENT },
    null,
    { id: 'lumiere', profondeur: 0, marge: MARGE, dessin: () => R.lumiereFroide(p, BV) },
    { id: 'teinte', profondeur: 0, marge: MARGE, dessin: () => teinte(p) }
  ];
  // « Il y a déjà eu des gens, ici ? » : il regarde autour de lui, vers l'intérieur de l'île, puis se tourne vers elle
  const t0 = { ...unTemps(D0, [[0, LARGE], [D0, LARGE]], { ...apresVent(plans.filter(Boolean), D0, 0, 0.06), brume: [[0, { x: 0, y: 0 }], [D0, { x: 0, y: 0 }]] }),
    acteur: R.joue([0, 'repos', 'haut_gauche'], [1400, 'repos', 'bas_droite']), jeux: { brume: B([0, 'curieuse']) } };
  const nuitee = (D, a, b) => ({ nuit: [[0, { o: a }], [D, { o: b }]] });
  const temps = repliques(t0, [
    // « Ceux d'avant savaient beaucoup… Mais depuis ce jour, je ne me rappelle plus rien. » : elle s'éloigne un peu vers
    // la mer, pâlit
    [5000, SUR_BRUME, R.joue([0, 'repos', 'bas_droite']), B([0, 'content'], [2400, 'triste']), { ...nuitee(5000, 0.06, 0.1), brume: [[0, { x: 0, y: 0, s: 1 }], [3200, { x: 30, y: -14, s: 0.92 }], [5000, { x: 34, y: -16, s: 0.92 }]] }],
    // « Quel jour ? » : il fait un pas vers elle
    [2600, SUR_AVATAR, R.joue([0, 'marche', 'bas_droite'], [800, 'arret', 'bas_droite'], [1320, 'repos', 'bas_droite', 'surprise']), B([0, 'triste']), { ...nuitee(2600, 0.1, 0.12), avatar: [[0, { x: 0, y: 0 }], [800, { x: 16, y: -4, s: 0.98, e: 'linear' }], [2600, { x: 16, y: -4, s: 0.98 }]] }],
    // (03_ciel) « Peu importe. Ce livre a d'autres choses pour toi… il est très gros… » : elle se secoue, file au livre
    [4600, { x: 18, y: 22, z: 1.2 }, R.joue([0, 'repos', 'bas_droite']), B([0, 'gene'], [700, 'content']), { ...nuitee(4600, 0.12, 0.16), brume: [[0, { x: 34, y: -16, s: 0.92 }], [500, { x: 34, y: -34, s: 0.96, e: 'ease-in' }], [1600, { x: -30, y: 28, s: 1 }], [4600, { x: -30, y: 28, s: 1 }]] }],
    // « … et ses pages ont l'air d'avoir oublié, elles aussi, ce qu'elles contenaient. » : elle reste penchée sur la page
    // vide ; lui croise les bras ; puis elle lève les yeux vers le ciel, et le regard monte avec elle (« Lever les yeux »)
    [4400, { x: 0, y: -36, z: 1.1 }, R.joue([0, 'repos', 'bas_droite'], [1200, 'pose_croises', 'bas_droite']), B([0, 'triste'], [2800, 'curieuse']), { ...nuitee(4400, 0.16, 0.2), brume: [[0, { x: -30, y: 28 }], [2800, { x: -30, y: 28, e: 'ease-out' }], [3600, { x: -30, y: 6 }], [4400, { x: -30, y: 6 }]] }]
  ]);
  // (la caméra du dernier temps ne monte vers le ciel qu'à la fin, quand Brume lève les yeux)
  const der = temps[4];
  der.camera = [[0, der.camera[0][1]], [900, { x: 18, y: 22, z: 1.2 }], [2800, { x: 18, y: 22, z: 1.2 }], [4400, { x: 0, y: -36, z: 1.1 }]];
  plans.splice(plans.indexOf(null), 1, ...brumeFigurant(temps, BV, S_BV));
  return fin(plans, temps, R.FROIDE, { brume: [3000, { y: -4 }] });
}

// ——— 03_nuit : la nuit est tombée, froide ; la lune, les étoiles ; il grelotte ; Brume se fait lumière tout près de
// lui ; puis elle se rappelle le vieux cercle de pierres, et l'emmène (« Suivre Brume ») ———
const NUIT = { teinte: '#141C3A', force: 0.32, cote: -1 };
// (son éclat, quand elle se fait lumière pour lui : un grand halo froid autour d'elle)
const eclat = (p, [x, y]) => { const A = atelier(`${p}x`); return A.out(`<circle cx="${x}" cy="${y - 16}" r="120" fill="${A.rad([[0, '#E4F6FF', 0.4], [0.4, '#BFE2F6', 0.16], [1, '#BFE2F6', 0]], x, y - 16, 120)}"/>`); };
function nuit03() {
  const p = 'nu', D0 = 4600;
  const plans = [
    ...decorApres(p, { livre: 'ferme', nuitee: true, anime: () => pagesVives(p, false) }),
    { id: 'eclat', profondeur: 0.68, marge: MARGE, pivot: BV, dessin: () => eclat(p, BV) },
    { id: 'avatar', profondeur: 0.7, pivot: PIEDS_VENT },
    null,
    { id: 'lumiere', profondeur: 0, marge: MARGE, dessin: () => R.lumiereFroide(p, BV) },
    { id: 'teinte', profondeur: 0, marge: MARGE, dessin: () => teinte(p) }
  ];
  const NUIT_O = 0.36;
  // « Oh non… Je sens que la nuit va être froide. Je n'ai ni abri, ni nourriture… » : il grelotte
  const t0 = { ...unTemps(D0, [[0, SUR_AVATAR], [D0, { ...SUR_AVATAR, x: -8 }]], { ...apresVent(plans.filter(Boolean), D0, NUIT_O, NUIT_O + 0.02), brume: [[0, { x: -20, y: 0 }], [D0, { x: -20, y: 0 }]], eclat: [[0, { o: 0 }], [D0, { o: 0 }]] }),
    acteur: R.joue([0, 'pose_frisson', 'bas_droite', 'neutre']), jeux: { brume: B([0, 'curieuse'], [2400, 'triste']) } };
  const PRES = { x: 238 - BV[0], y: 246 - BV[1] };
  const temps = repliques(t0, [
    // « Non, non, ne t'en fais pas. Je ne réchauffe pas beaucoup, mais je brille… » : elle vient tout près de lui et se
    // fait lumière
    [5000, DEUX, R.joue([0, 'pose_frisson', 'bas_droite', 'neutre'], [2600, 'repos', 'bas_droite']), B([0, 'content']), { brume: [[0, { x: -20, y: 0 }], [1400, { ...PRES, s: 1.06 }], [5000, { ...PRES, s: 1.06 }]], eclat: [[0, { o: 0, x: -20, y: 0 }], [1400, { ...PRES, o: 0.4 }], [2400, { ...PRES, o: 1, s: 1.12 }], [5000, { ...PRES, o: 1, s: 1.12 }]] }],
    // « Bon… D'accord, Brume. On suit ton plan… mais je vais quand même mourir de froid ! » : les bras croisés, puis il
    // regrelotte ; elle, gênée : elle avait oublié
    [5000, SUR_AVATAR, R.joue([0, 'pose_croises', 'bas_droite', 'neutre'], [3000, 'pose_frisson', 'bas_droite', 'neutre']), B([0, 'content'], [3000, 'gene'])],
    // « Ah… C'est vrai ! Viens, par là. » : elle sursaute, file vers le haut de la plage, et l'attend (« Suivre Brume »)
    [3600, { x: 0, y: 0, z: 1.04 }, R.joue([0, 'repos', 'bas_droite', 'surprise'], [900, 'repos', 'haut_droite']), B([0, 'surpris'], [600, 'content']), { brume: [[0, { ...PRES, s: 1.06 }], [300, { ...PRES, y: PRES.y - 12, s: 1.06, e: 'cubic-bezier(.3,0,.3,1)' }], [1400, { x: -26, y: -172, s: 0.9 }], [3600, { x: -26, y: -172, s: 0.9 }]], eclat: [[0, { ...PRES, o: 1, s: 1.12 }], [300, { ...PRES, o: 1, s: 1.12, e: 'cubic-bezier(.3,0,.3,1)' }], [1400, { x: -26, y: -172, o: 0.5, s: 0.9 }], [3600, { x: -26, y: -172, o: 0.5, s: 0.9 }]] }]
  ]);
  plans.splice(plans.indexOf(null), 1, ...brumeFigurant(temps, BV, S_BV));
  return fin(plans, temps, NUIT, { brume: [3000, { y: -4 }], eclat: [3000, { y: -4 }] });
}

module.exports = { livre03, vent03, ciel03, trouee03, nuit03, decorApres, B, brumeFigurant, repliques, fin, NUIT };
