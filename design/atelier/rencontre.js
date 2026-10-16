// La rencontre (02_lueur, 02_approche, 02_rocher, 03_livre), refaite au niveau des images de l'ouverture (ouverture.js) :
// en animation continue (SMIL), lumière vraie, matières. L'heure suit le récit : le soleil vient de se coucher derrière
// la mer (02_plage) ; d'une scène à l'autre le ciel se refroidit jusqu'à l'heure bleue du vent (03_vent), avant que la
// nuit tombe (03_ciel). La brume couvre la plage ; Brume y erre, pâle et tremblante (stade 0), et sa lumière froide
// prend sur le sable, la brume et la roche. Le sujet tient dans la bande x ≈ 108 à 292 (un téléphone en hauteur).
const { brumeFrame } = require('./brume');
const O = require('./ouverture');
const { vif } = require('./figer');
const { Defs, vaVient, boucle, defile, uneFois, fonduUneFois, path, trait, hash, f, W, galet, coquillage, algue, etoileDeMer } = O;

// ——— l'heure : t = 0 juste après le coucher, t = 1 l'heure bleue (celle de 03_vent) ———
const hex = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16));
const mix = (a, b, t) => '#' + hex(a).map((v, i) => Math.round(v + (hex(b)[i] - v) * t).toString(16).padStart(2, '0')).join('');
const APRES = { haut: '#2A2052', mi: '#6A3C72', bas: '#D8664A', horizon: '#FFC27E', nuage: '#6E4272', lisere: '#FFB27A', merLoin: '#5E4A7A', merPres: '#2B3558', ride: '#8E7AAE', mouille: '#9C6A62', sable: '#C29274', ombre: '#7E5848', grain: '#F2CFA6', brume: '#F2D4D0', roche: '#5E4C5E', rocheH: '#A2848E' };
const BLEUE = { haut: '#1A2250', mi: '#3A3A78', bas: '#8A5A8A', horizon: '#E8906A', nuage: '#3E3470', lisere: '#F2A08A', merLoin: '#5A4A80', merPres: '#22305A', ride: '#9A8AC0', mouille: '#7A6A80', sable: '#8E7E8A', ombre: '#4A4050', grain: '#B8AAC0', brume: '#D8D4EC', roche: '#403C56', rocheH: '#7E7496' };
const heure = t => Object.fromEntries(Object.keys(APRES).map(k => [k, mix(APRES[k], BLEUE[k], t)]));

// ——— Brume, vivante : ses images tremblent en boucle (0, 1, 2, 1), le bas de sa flamme en (0, 0), à l'échelle s ———
// (ses identifiants sont numérotés à partir de zéro dans chaque scène : debut(préfixe), pour un dessin toujours identique)
let nb = 0, pre = 'bv';
const debut = p => { nb = 0; pre = p; };
function brumeVive(expr, s, opacite = 1, cligne = null) {
  const p = `${pre}${nb++}`;
  const ordre = [0, 1, 2, 1];
  let imgs = [0, 1, 2].map(n => {
    const v = ordre.map(k => (k === n ? 1 : 0)).join(';');
    return `<g opacity="${n ? 0 : 1}"><animate attributeName="opacity" values="${v}" keyTimes="0;0.25;0.5;0.75" calcMode="discrete" dur="0.84s" repeatCount="indefinite"/>${brumeFrame('s0', n, expr).replace(/bhs0(\d)/g, `${p}h$1`)}</g>`;
  }).join('');
  // un clignement (cligne : [période, instant] en secondes) : les yeux se ferment 0,14 s
  if (cligne) {
    const [per, t0] = cligne, k = `0;${f(t0 / per)};${f((t0 + 0.14) / per)}`;
    imgs = `<g><animate attributeName="opacity" values="1;0;1" keyTimes="${k}" calcMode="discrete" dur="${per}s" repeatCount="indefinite"/>${imgs}</g>`
      + `<g opacity="0"><animate attributeName="opacity" values="0;1;0" keyTimes="${k}" calcMode="discrete" dur="${per}s" repeatCount="indefinite"/>${brumeFrame('s0', 0, 'cligne').replace(/bhs0(\d)/g, `${p}c$1`)}</g>`;
  }
  return `<g transform="scale(${f(s)}) translate(-20 -32)"${opacite < 1 ? ` opacity="${opacite}"` : ''}>${imgs}</g>`;
}
// sa lumière : un grand halo froid autour d'elle (centré au milieu de la flamme)
const halo = (D, r, a = 0.5) => `<circle cx="0" cy="${f(-r * 0.12)}" r="${f(r)}" fill="${D.rad([[0, '#E4F6FF', a], [0.35, '#BFE2F6', a * 0.45], [1, '#BFE2F6', 0]], 0, -r * 0.12, r)}"/>`;
// des valeurs de translation (points absolus) et leurs instants, en boucle
const chemin = (pts, kts, dur, x = true, y = true) => `<animateTransform attributeName="transform" type="translate" values="${pts.map(([a, b]) => `${x ? f(a) : 0} ${y ? f(b) : 0}`).join(';')}" keyTimes="${kts.join(';')}" calcMode="spline" keySplines="${Array(pts.length - 1).fill('0.45 0 0.55 1').join(';')}" dur="${dur}s" repeatCount="indefinite"/>`;

// ════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// La grève au crépuscule : le ciel et ses nuages lisérés, la lueur du soleil couché, la mer, le sable mouillé qui
// reflète le ciel, la vague, le sable sec et ses petites choses. o : { t, horizon, rivage, soleil (x de la lueur),
// objets }
// ════════════════════════════════════════════════════════════════════════════════════════════════════════════════
function greve(D, o) {
  const C = heure(o.t), h = o.horizon, ri = o.rivage, sx = o.soleil;
  let s = `<rect width="${W}" height="${f(h + 2)}" fill="${D.lin([[0, C.haut], [0.48, C.mi], [0.84, C.bas], [1, C.horizon]], 0, 0, 0, h)}"/>`;
  s += `<rect width="${W}" height="${f(h + 2)}" fill="${D.rad([[0, C.horizon, 0.7 - o.t * 0.3], [0.3, C.bas, 0.3], [1, C.bas, 0]], sx, h + 8, 210)}"/>`;
  // les nuages en traîne, lisérés par en dessous, que le vent du soir tire lentement
  const nuage = (x, y, w, k) => `<g>${defile('0 0', `${f(26 * k)} 0`, 46, hash(x, y) * 46)}<path d="M${f(x)},${f(y)} q${f(w * 0.28)},-8 ${f(w * 0.58)},-2 q${f(w * 0.24)},-6 ${f(w * 0.5)},3 q-${f(w * 0.5)},6 -${f(w * 1.08)},-1 Z" fill="${C.nuage}" opacity="0.85"/><path d="M${f(x + w * 0.08)},${f(y + 0.6)} q${f(w * 0.45)},3.6 ${f(w * 0.9)},1.2" fill="none" stroke="${C.lisere}" stroke-width="1.5" stroke-linecap="round" opacity="${f(0.85 - o.t * 0.3)}"/></g>`;
  s += nuage(-10, h - 128, 140, 1) + nuage(214, h - 150, 170, -1) + nuage(120, h - 76, 100, 0.6) + nuage(300, h - 48, 90, -0.7);
  // des oiseaux qui rentrent, très loin
  s += `<g>${defile('0 0', '70 -10', 30)}${trait(`M40,${f(h - 98)} q4,-4 8,0 q4,-4 8,0 M66,${f(h - 108)} q3,-3 6,0 q3,-3 6,0 M58,${f(h - 86)} q2.6,-2.6 5.2,0 q2.6,-2.6 5.2,0`, '#2A2040', 1.1)}</g>`;
  // la mer et le reflet de la dernière lueur
  s += `<rect y="${h}" width="${W}" height="${f(ri - h + 10)}" fill="${D.lin([[0, C.merLoin], [1, C.merPres]], 0, h, 0, ri)}"/>`;
  s += `<path d="M0,${f(h + 0.6)} L400,${f(h + 0.6)}" stroke="${C.horizon}" stroke-width="1.2" opacity="0.7"/>`;
  for (let i = 0; i < 18; i++) {
    const t = i / 18, y = h + 3 + (ri - h - 12) * t ** 1.3, w = 8 + 30 * t + 8 * hash(i, 3), x = sx + (hash(i, 5) - 0.5) * (20 + 64 * t);
    s += `<rect x="${f(x - w / 2)}" y="${f(y)}" width="${f(w)}" height="${f(1 + 1.2 * t)}" rx="0.6" fill="${C.horizon}" opacity="0.4">${boucle('opacity', [0.1, 0.6 - o.t * 0.25, 0.2], 1.3 + hash(i, 7) * 1.4, hash(i, 9) * 2)}</rect>`;
  }
  for (let i = 0; i < 5; i++) s += `<g>${defile('0 0', '0 6', 3.4, i * 0.6)}<path d="M-10,${f(h + 8 + i * ((ri - h) / 6))} q40,-3 80,0 t80,0 t80,0 t80,0 t80,0" fill="none" stroke="${C.ride}" stroke-width="${f(0.8 + i * 0.2)}" opacity="0.5">${boucle('opacity', [0.1, 0.55, 0.1], 3.4, i * 0.6)}</path></g>`;
  // le sable mouillé qui reflète le ciel, le sable sec, son grain
  s += `<path d="M0,${f(ri)} Q100,${f(ri - 6)} 200,${f(ri + 2)} T400,${f(ri - 4)} L400,400 L0,400 Z" fill="${D.lin([[0, C.mouille], [0.3, mix(C.mouille, C.sable, 0.5)], [0.62, C.sable], [1, C.ombre]], 0, ri, 0, 400)}"/>`;
  s += `<ellipse cx="${sx}" cy="${f(ri + 8)}" rx="26" ry="14" fill="${D.rad([[0, C.horizon, 0.36], [1, C.horizon, 0]], sx, ri + 8, 26)}"/>`;
  const vague = k => `M-10,${f(ri - 2 + k)} Q60,${f(ri + 10 + k)} 130,${f(ri + 4 + k)} T260,${f(ri + 9 + k)} T410,${f(ri + 2 + k)} L410,${f(ri - 6)} L-10,${f(ri - 6)} Z`;
  s += `<path d="${vague(0)}" fill="${C.ride}" opacity="0.5">${boucle('d', [vague(-4), vague(13), vague(5)], 5.4)}</path>`;
  const ecume = k => `M-10,${f(ri - 2 + k)} Q60,${f(ri + 10 + k)} 130,${f(ri + 4 + k)} T260,${f(ri + 9 + k)} T410,${f(ri + 2 + k)}`;
  s += `<path d="${ecume(0)}" fill="none" stroke="#F6EAF0" stroke-width="2" stroke-linecap="round" stroke-dasharray="14 5 3 6" opacity="0.8">${boucle('d', [ecume(-4), ecume(13), ecume(5)], 5.4)}${boucle('opacity', [0.45, 0.9, 0.65], 5.4)}</path>`;
  for (let i = 0; i < 64; i++) {
    const x = hash(i, 41) * 400, y = ri + 16 + hash(i, 43) * (400 - ri - 16);
    s += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(0.5 + hash(i, 45) * 1.1)}" fill="${hash(i, 47) < 0.5 ? C.grain : C.ombre}" opacity="0.55"/>`;
  }
  return s + (o.objets || '');
}
// des nappes de brume, floues, qui dérivent (list : [x, y, rx, ry, opacité, sens])
const nappes = (D, list, couleur, flou = 7) => {
  const fl = D.flou(flou);
  return list.map(([x, y, rx, ry, a, k], i) => `<g>${vaVient('translate', '0 0', `${f(26 * k)} ${f(2 * k)}`, 11 + i * 1.7, i * 2.3)}<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${couleur}" opacity="${a}" filter="${fl}"/></g>`).join('');
};
// un banc de brume : un dessus bosselé, pris par la lueur du couchant, qui s'efface vers le bas ; il dérive et respire
// (y : le haut du banc, h : son épaisseur, a : opacité, seed : la forme, k : sens et ampleur de la dérive)
function banc(D, C, y, h, a, seed, k = 1, x0 = -80, x1 = 480) {
  const n = 9, w = (x1 - x0) / n;
  const dessus = j => Array.from({ length: n }, (_, i) => { const xa = x0 + i * w, b = 4 + hash(i + seed, j + 1) * h * 0.5; return `Q${f(xa + w / 2)},${f(y - b)} ${f(xa + w)},${f(y + (hash(i, seed) - 0.5) * 4)}`; }).join(' ');
  const d = j => `M${x0},${f(y + 2)} ${dessus(j)} L${x1},${f(y + h)} L${x0},${f(y + h)} Z`;
  const fill = D.lin([[0, mix(C.brume, '#FFE2C8', 0.35), a], [0.35, C.brume, a * 0.85], [1, C.brume, 0]], 0, y - h * 0.4, 0, y + h);
  return `<g>${vaVient('translate', '0 0', `${f(24 * k)} 0`, 14 + (seed % 5) * 2, seed % 7)}<path d="${d(0)}" fill="${fill}" filter="${D.flou(3.4)}">${boucle('d', [d(0), d(3)], 9 + (seed % 4), seed % 3)}</path></g>`;
}
// la lumière de Brume posée sur le sable (une tache froide, aplatie)
const flaque = (D, rx, a = 0.4) => `<ellipse cx="0" cy="0" rx="${rx}" ry="${f(rx * 0.24)}" fill="${D.rad([[0, '#D8F0FF', a], [1, '#D8F0FF', 0]], 0, 0, rx)}"/>`;
// l'ombre de l'avatar à ses pieds (le jeu le pose par-dessus) : x, y ses pieds, k son échelle
const ombre = (D, x, y, k) => `<ellipse cx="${x}" cy="${f(y - 1)}" rx="${f(16 * k)}" ry="${f(4.4 * k)}" fill="${D.rad([[0, '#140A1A', 0.42], [0.65, '#140A1A', 0.18], [1, '#140A1A', 0]], x, y - 1, 16 * k)}"/>`;
// la lumière tiède du couchant qui baigne la scène, et le bord, plus sombre
const ambiance = (D, t, sx) => `<rect width="${W}" height="${W}" fill="${D.rad([[0, mix('#FFC27A', '#E8906A', t), 0.16 - t * 0.08], [1, '#FFC27A', 0]], sx, 200, 280)}"/><rect width="${W}" height="${W}" fill="${D.rad([[0, '#000', 0], [0.7, '#140A20', 0.1], [1, '#0A0614', 0.45]], 200, 220, 300)}"/>`;
// un rocher en volume : la masse, le côté du ciel pris par la lueur, le côté de l'ombre, des fissures, du lichen
// (facettes : [tracé, 'haut' | 'cote' | 'ombre'] découpées dans la masse ; arete : le bord du haut, pris par le couchant)
function rocher(D, C, d, facettes, fissures, arete) {
  const clip = D.clip(d);
  const ton = { haut: [mix(C.rocheH, C.lisere, 0.12), 0.42], cote: [C.rocheH, 0.28], ombre: [mix(C.roche, '#0A0612', 0.6), 0.55] };
  let s = `<path d="${d}" fill="${D.lin([[0, C.rocheH], [0.4, C.roche], [1, mix(C.roche, '#0A0612', 0.5)]], 0, 170, 40, 340)}"/>`;
  s += `<g clip-path="${clip}">` + facettes.map(([q, k]) => `<path d="${q}" fill="${ton[k][0]}" opacity="${ton[k][1]}"/>`).join('');
  // le grain de la roche : des points clairs et sombres, et le pied mouillé, plus sombre
  for (let i = 0; i < 40; i++) s += `<circle cx="${f(150 + hash(i, 61) * 260)}" cy="${f(160 + hash(i, 63) * 170)}" r="${f(0.6 + hash(i, 65) * 1.2)}" fill="${hash(i, 67) < 0.5 ? C.rocheH : '#140E1A'}" opacity="0.5"/>`;
  s += `<rect x="140" y="290" width="280" height="60" fill="${D.lin([[0, '#140E1A', 0], [1, '#140E1A', 0.55]], 0, 290, 0, 330)}"/></g>`;
  s += `<path d="${d}" fill="none" stroke="#1A1422" stroke-width="1.6" stroke-linejoin="round"/>`;
  s += fissures.map(q => trait(q, '#1A1422', 1.2, 'opacity="0.75"') + trait(q, C.rocheH, 0.6, 'opacity="0.4" transform="translate(1 1)"')).join('');
  return s + trait(arete, C.lisere, 1.4, 'opacity="0.5"');
}

// ════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 02_lueur — « Une lueur erre dans la brume » : juste après le coucher, la brume monte sur la plage. Au loin, une
// petite lueur pâle y erre : elle avance, s'arrête, hésite, repart. Sa lumière froide prend dans la brume et se reflète
// sur le sable mouillé. Le joueur, de dos, la voit (« Aaah ! Mais c'est quoi, ça ?! »)
// ════════════════════════════════════════════════════════════════════════════════════════════════════════════════
function lueur02() {
  const D = Defs('lue');
  debut('lueb');
  const t = 0.04, C = heure(t);
  const objets = galet(D, 318, 352, 11, 6, '#6E5E62') + galet(D, 300, 336, 6, 3.4) + coquillage(262, 362, 4.6) + etoileDeMer(352, 384, 9, 0.6) + algue(226, 334, 1) + galet(D, 60, 330, 9, 5);
  let s = greve(D, { t, horizon: 196, rivage: 262, soleil: 236, objets });
  // la brume du large et celle qui couvre la plage, derrière la lueur
  s += banc(D, C, 198, 26, 0.7, 3, 1) + banc(D, C, 226, 40, 0.6, 11, -0.8);
  s += ombre(D, 120, 384, 3.4);
  // la lueur qui erre : elle va, s'arrête, hésite, repart (10 s, en boucle)
  const pts = [[288, 240], [288, 240], [258, 230], [258, 230], [270, 222], [234, 238], [234, 238], [250, 246], [288, 240]];
  const kts = [0, 0.12, 0.3, 0.42, 0.5, 0.66, 0.78, 0.88, 1];
  s += `<g>${chemin(pts, kts, 10, true, false)}<g transform="translate(0 258)">${flaque(D, 46, 0.5)}</g></g>`;
  s += `<g>${chemin(pts, kts, 10)}<g>${vaVient('translate', '0 0', '0 -3', 1.7)}${halo(D, 52, 0.6)}${brumeVive('neutre', 1.25, 1, [4.2, 2.6])}</g></g>`;
  // la brume qui passe devant elle (elle y luit, comme dans du coton), puis celle du premier plan
  s += banc(D, C, 244, 34, 0.42, 17, 1);
  s += `<g>${chemin(pts, kts, 10)}<circle cx="0" cy="6" r="34" fill="${D.rad([[0, '#E4F6FF', 0.3], [1, '#E4F6FF', 0]], 0, 6, 34)}"/></g>`;
  s += banc(D, C, 296, 50, 0.34, 23, -1);
  s += ambiance(D, t, 236);
  return D.out(s);
}
// le devant : la brume qui passe au ras du sable, devant l'avatar
function brumeDevant(pref, t, y) {
  const D = Defs(pref), C = heure(t);
  return D.out(banc(D, C, y - 24, 60, 0.3, 29, 1.4));
}

// ════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 02_approche — elle approche d'un coup (une seconde et demie à l'écran) : la lueur fond sur l'avatar à travers la
// brume, qui s'écarte en tourbillons ; elle s'arrête tout près, penche la tête et l'examine, cligne des yeux. Sa
// lumière éclabousse le sable
// ════════════════════════════════════════════════════════════════════════════════════════════════════════════════
function approche02() {
  const D = Defs('app');
  debut('appb');
  const t = 0.08, C = heure(t);
  const objets = galet(D, 318, 352, 11, 6, '#6E5E62') + coquillage(262, 368, 4.6) + etoileDeMer(352, 384, 9, 0.6) + algue(226, 340, 1);
  let s = greve(D, { t, horizon: 196, rivage: 262, soleil: 236, objets });
  s += banc(D, C, 198, 26, 0.7, 3, 1);
  // la brume de la plage : elle s'écarte d'un coup sur son passage, puis se referme lentement
  const ecarte = (x, y, rx, ry, a, dx) => `<g>${uneFois('translate', `0 0;${dx} -6;${f(dx * 0.6)} -3`, '0;0.12;1', 3.2)}<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${C.brume}" opacity="${a}" filter="${D.flou(7)}"/></g>`;
  s += ombre(D, 108, 376, 3.6);
  s += ecarte(150, 238, 170, 26, 0.6, -80) + ecarte(340, 244, 150, 24, 0.55, 80) + ecarte(250, 292, 130, 24, 0.4, 60);
  // l'éclaboussure de lumière sur le sable, qui la suit
  const vol = (pts, kts, dur) => `<animateTransform attributeName="transform" type="translate" values="${pts.map(([a, b]) => `${a} ${b}`).join(';')}" keyTimes="${kts}" calcMode="spline" keySplines="0.7 0 0.9 0.6;0.2 0.8 0.4 1;0.45 0 0.55 1" dur="${dur}s" fill="freeze"/>`;
  const echelle = (vals, kts, dur) => `<animateTransform attributeName="transform" type="scale" values="${vals}" keyTimes="${kts}" calcMode="spline" keySplines="0.7 0 0.9 0.6;0.2 0.8 0.4 1;0.45 0 0.55 1" dur="${dur}s" fill="freeze"/>`;
  const KT = '0;0.32;0.5;1';
  s += `<g transform="translate(282 250)">${vol([[282, 250], [252, 318], [244, 312], [244, 314]], KT, 1.2)}<g transform="scale(0.4)">${echelle('0.4;1.6;1.4;1.4', KT, 1.2)}${flaque(D, 60, 0.55)}</g></g>`;
  // la traînée de sa course, qui s'efface
  s += `<path d="M284,232 Q270,262 248,286" fill="none" stroke="#E4F6FF" stroke-width="16" stroke-linecap="round" opacity="0" filter="${D.flou(5)}">${fonduUneFois('opacity', '0;0;0.5;0', '0;0.3;0.42;1', 1.2)}</path>`;
  // Brume : de loin, toute petite, puis là, tout près, les yeux ronds ; elle recule d'un rien, et flotte
  s += `<g transform="translate(284 238)">${vol([[284, 238], [250, 300], [244, 292], [244, 296]], KT, 1.2)}<g transform="scale(0.36)">${echelle('0.36;3.3;2.9;3', KT, 1.2)}<g>${vaVient('translate', '0 0', '0 -2.4', 1.4)}<g>${uneFois('rotate', '0;0;-11', '0;0.45;1', 2)}${halo(D, 30, 0.6)}${brumeVive('curieuse', 1, 1, [3.2, 1])}</g></g></g></g>`;
  // le souffle de son passage : un anneau de brume qui s'ouvre
  s += `<ellipse cx="248" cy="296" rx="20" ry="8" fill="none" stroke="${C.brume}" stroke-width="5" opacity="0" filter="${D.flou(2)}"><animate attributeName="rx" values="20;120" begin="0.4s" dur="0.8s" fill="freeze"/><animate attributeName="ry" values="8;30" begin="0.4s" dur="0.8s" fill="freeze"/><animate attributeName="opacity" values="0.7;0" begin="0.4s" dur="0.8s" fill="freeze"/></ellipse>`;
  s += ambiance(D, t, 236);
  return D.out(s);
}

// ════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 02_rocher — Brume sursaute aussi, file derrière un rocher et passe la tête : seuls le haut de sa flamme et ses yeux
// gênés dépassent ; sa lueur borde la roche. Par moments, elle se cache, puis repasse la tête (« T'approcher » vise
// ses yeux : x ≈ 56 %, y ≈ 46 % de l'écran)
// ════════════════════════════════════════════════════════════════════════════════════════════════════════════════
function rocher02() {
  const D = Defs('roc');
  debut('rocb');
  const t = 0.22, C = heure(t);
  const objets = galet(D, 330, 372, 9, 5, '#6E5E62') + coquillage(150, 340, 4.4) + etoileDeMer(352, 392, 8, 1.1, '#D85A6A') + algue(118, 318, 1);
  let s = greve(D, { t, horizon: 182, rivage: 248, soleil: 236, objets });
  s += nappes(D, [[120, 192, 220, 14, 0.48, 1], [330, 200, 180, 12, 0.42, -1], [200, 236, 260, 18, 0.36, -0.8]], C.brume);
  s += ombre(D, 116, 366, 3.4);
  // Brume : elle sursaute (là où elle était), file vers le rocher et plonge derrière ; puis elle repasse la tête,
  // se cache par moments et revient
  // elle sursaute, bondit par-dessus le rocher, retombe derrière, attend, puis passe la tête ; ensuite une boucle de
  // 7 s : elle regarde, se cache, revient. Devant le rocher jusqu'au haut de son bond (surprise), derrière ensuite (gênée)
  const SAUT = 2.8, BASCULE = f(SAUT * 0.25);
  const sp = '0.2 0.8 0.4 1;0.4 0 0.6 1;0.5 0 0.8 1;0 0 1 1;0.3 0 0.4 1;0 0 1 1', KTS = '0;0.1;0.25;0.4;0.6;0.85;1';
  const sursaut = `<animateTransform attributeName="transform" type="translate" values="244 296;244 258;228 166;212 250;212 250;212 194;212 194" keyTimes="${KTS}" calcMode="spline" keySplines="${sp}" dur="${SAUT}s" fill="freeze"/>`;
  const taille = `<animateTransform attributeName="transform" type="scale" values="3;3.1;2.6;2.3;2.3;2.3;2.3" keyTimes="${KTS}" calcMode="spline" keySplines="${sp}" dur="${SAUT}s" fill="freeze"/>`;
  const cache = `<animateTransform attributeName="transform" type="translate" values="0 0;0 0;0 30;0 30;0 0;0 0" keyTimes="0;0.5;0.56;0.66;0.74;1" calcMode="spline" keySplines="0 0 1 1;0.5 0 0.8 1;0 0 1 1;0.3 0 0.4 1;0 0 1 1" dur="7s" begin="${SAUT}s" repeatCount="indefinite" additive="sum"/>`;
  const regard = `<animateTransform attributeName="transform" type="rotate" values="0;-6;0;5;0" keyTimes="0;0.25;0.5;0.75;1" calcMode="spline" keySplines="0.45 0 0.55 1;0.45 0 0.55 1;0.45 0 0.55 1;0.45 0 0.55 1" dur="4.6s" repeatCount="indefinite" additive="sum"/>`;
  const brumeRoc = (devant, expr) => `<g opacity="${devant ? 1 : 0}"><set attributeName="opacity" to="${devant ? 0 : 1}" begin="${BASCULE}s" fill="freeze"/><g transform="translate(244 296)">${sursaut}<g>${cache}<g transform="scale(3)">${taille}<g>${regard}${halo(D, 26, 0.6)}${brumeVive(expr, 1)}</g></g></g></g></g>`;
  // le rocher : un gros bloc à moitié enfoui, devant elle ; sa lueur froide en borde le haut
  const bloc = 'M164,306 Q156,262 176,232 Q190,206 214,204 Q236,190 262,198 Q296,204 312,232 Q330,262 326,306 Q290,316 244,314 Q196,316 164,306 Z';
  // (vivante, au calque anime de la scène figée, par-dessus le rocher : découpée hors de lui, elle s'y cache encore ;
  // figer.js)
  s += vif(`<g clip-path="${D.clip(`M-10,-10 L-10,410 L410,410 L410,-10 Z ${bloc}`)}">${brumeRoc(false, 'gene')}</g>`);
  s += `<ellipse cx="246" cy="310" rx="96" ry="12" fill="#1A1020" opacity="0.4" filter="${D.flou(3)}"/>`;
  s += rocher(D, C, bloc, [['M176,232 Q190,206 214,204 Q236,190 262,198 Q296,204 312,232 L286,238 L254,222 L222,230 L196,244 Z', 'haut'], ['M222,230 L254,222 L262,262 L236,270 Z', 'cote'], ['M150,320 L164,250 L196,244 L214,300 L200,330 Z', 'cote'], ['M286,238 L312,232 L340,260 L340,330 L270,330 L278,280 Z', 'ombre']],
    ['M226,206 q4,20 -2,40 q-4,16 4,30', 'M290,236 q-6,14 0,28', 'M190,250 q10,6 12,22'], 'M176,232 Q190,206 214,204 Q236,190 262,198 Q296,204 312,232');
  // (vivante, au calque anime de la scène figée : sa lueur sur l'arête ; figer.js)
  s += vif(`<path d="M180,230 Q196,204 222,200 Q244,190 266,198 Q292,204 306,226" fill="none" stroke="#DFF4FF" stroke-width="2.4" stroke-linecap="round" opacity="0.6">${boucle('opacity', [0.4, 0.75, 0.5], 2.6)}</path>`
    + `<ellipse cx="214" cy="204" rx="54" ry="16" fill="${D.rad([[0, '#E4F6FF', 0.35], [1, '#E4F6FF', 0]], 214, 204, 54)}">${boucle('opacity', [0.7, 1, 0.8], 2.6)}</ellipse>`);
  for (const [x, y, r] of [[250, 270, 7], [282, 252, 5], [198, 284, 6], [300, 290, 4]]) s += `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${f(r * 0.6)}" fill="#7E8A5A" opacity="0.5"/><ellipse cx="${x + 3}" cy="${y + 1}" rx="${f(r * 0.5)}" ry="${f(r * 0.3)}" fill="#A6A86A" opacity="0.4"/>`;
  s += brumeRoc(true, 'surpris');
  s += nappes(D, [[160, 318, 260, 22, 0.26, 1], [340, 330, 180, 18, 0.22, -1]], C.brume, 9);
  s += ambiance(D, t, 236);
  return D.out(s);
}

// ════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 03_livre — Brume file vers un creux du rocher et en tire, à grand-peine, un livre lourd fermé de sept sceaux : elle
// tire par à-coups, le livre vient, résiste, puis cède ; il tombe sur le sable dans un petit nuage. Elle flotte au-dessus,
// fière et essoufflée ; les sept sceaux luisent tour à tour (« Toucher le livre »)
// ════════════════════════════════════════════════════════════════════════════════════════════════════════════════
const SCEAUX = ['#E8584A', '#F2C04B', '#7EC45B', '#5EA8E8', '#B07EE0', '#F28A2E', '#E8E4DA'];
// le livre, posé à plat (vu d'un peu au-dessus) : centre en (0, 0), 64 de large
function livre(D, vivant) {
  let s = `<ellipse cx="2" cy="16" rx="38" ry="7" fill="#1A1020" opacity="0.45"/>`;
  // l'épaisseur : la tranche des pages et le cuir
  s += path('M-32,-12 L32,-14 L34,8 L-30,12 Z', '#3E2216', 'stroke="#1E0E08" stroke-width="1.4" stroke-linejoin="round"');
  s += path('M-30,8 L-36,9 Q-39,12 -35,15.6 L-29,15 Z', '#5A321E', 'stroke="#1E0E08" stroke-width="1"');
  s += path('M-30,10 L34,6 L34,11 L-29,15 Z', '#E8DCC0', 'stroke="#1E0E08" stroke-width="1"');
  s += trait('M-28,12.4 L33,8.4', '#B8A88A', 0.6);
  // le plat : du cuir brun, un cadre doré, des coins de laiton, deux fermoirs, vu d'un peu au-dessus
  s += '<g transform="translate(0 4) scale(1 0.72) translate(0 -4)">';
  s += path('M-32,-14 L32,-16 L34,6 L-30,10 Z', D.lin([[0, '#8A5236'], [0.5, '#6B3E24'], [1, '#4E2A18']], -32, -16, 30, 10), 'stroke="#1E0E08" stroke-width="1.6" stroke-linejoin="round"');
  s += path('M-26,-10.6 L26.4,-12.2 L28,3.4 L-24.4,6.4 Z', 'none', 'stroke="#C8A052" stroke-width="1.2" stroke-linejoin="round"');
  s += trait('M-30,-12 L30,-14', '#B07A56', 1, 'opacity="0.7"');
  for (const [x, y] of [[-31, -13], [31, -15], [33, 5], [-29, 9]]) s += `<circle cx="${x}" cy="${y}" r="3" fill="${D.rad([[0, '#FFE8A0'], [1, '#A07A2E']], x - 1, y - 1, 3)}" stroke="#4A3010" stroke-width="0.7"/>`;
  s += path('M-8,-15.4 L-4,-15.6 L-3.4,-20 L-7.6,-19.8 Z', '#A07A2E', 'stroke="#4A3010" stroke-width="0.6"') + path('M6,-15.8 L10,-16 L10.6,-20.4 L6.4,-20.2 Z', '#A07A2E', 'stroke="#4A3010" stroke-width="0.6"');
  // les sept sceaux de cire, en ligne au milieu du plat ; ils luisent tour à tour
  s += path('M-32,-14 Q-38,-3 -30,10 L-25,9.4 Q-32,-2 -27,-13.6 Z', '#4E2A18', 'stroke="#1E0E08" stroke-width="1"') + trait('M-30.6,-8 l4,-0.2 M-31.6,-2 l4.4,-0.2 M-31,4 l4.6,-0.2', '#B07A56', 0.9);
  SCEAUX.forEach((c, i) => {
    const x = -18 + i * 6.2, y = -3 - i * 0.24;
    s += `<circle cx="${f(x)}" cy="${f(y)}" r="2.7" fill="${c}" stroke="#2A160C" stroke-width="0.7"/><circle cx="${f(x - 0.8)}" cy="${f(y - 0.9)}" r="0.8" fill="#FFFFFF" opacity="0.7"/>`;
    if (vivant) s += `<circle cx="${f(x)}" cy="${f(y)}" r="5" fill="${c}" opacity="0"><animate attributeName="opacity" values="0;0.75;0" keyTimes="0;0.5;1" dur="0.9s" begin="${f(4.4 + i * 0.5)}s;${f(4.4 + i * 0.5)}s+3.5s" fill="freeze"/></circle>`;
  });
  return s + '</g>';
}
function livre03() {
  const D = Defs('liv');
  debut('livb');
  const t = 0.6, C = heure(t);
  const objets = coquillage(150, 346, 4.4) + etoileDeMer(196, 388, 8, 1.1, '#D85A6A') + algue(118, 320, 1) + galet(D, 172, 330, 7, 4);
  let s = greve(D, { t, horizon: 172, rivage: 238, soleil: 236, objets });
  s += nappes(D, [[120, 182, 220, 14, 0.48, 1], [330, 190, 180, 12, 0.42, -1], [180, 228, 240, 18, 0.34, -0.8]], C.brume);
  s += ombre(D, 108, 384, 3.4);
  // le grand rocher, à droite, et son creux sombre
  const bloc = 'M206,330 Q198,280 214,236 Q230,186 272,172 Q316,160 352,176 Q392,194 410,240 L410,334 Q330,342 266,338 Q226,338 206,330 Z';
  s += `<ellipse cx="300" cy="334" rx="110" ry="12" fill="#1A1020" opacity="0.45" filter="${D.flou(3)}"/>`;
  s += rocher(D, C, bloc, [['M214,236 Q230,186 272,172 Q316,160 352,176 Q392,194 410,240 L380,232 L340,214 L300,212 L256,222 L230,246 Z', 'haut'], ['M300,212 L340,214 L350,256 L312,262 Z', 'cote'], ['M200,340 L206,260 L230,246 L248,300 L236,340 Z', 'cote'], ['M380,232 L420,240 L420,340 L340,340 L352,280 Z', 'ombre']],
    ['M300,176 q-6,24 2,40', 'M362,204 q8,20 0,44 q-6,18 4,36', 'M228,280 q12,4 16,22'], 'M214,236 Q230,186 272,172 Q316,160 352,176 Q392,194 410,240');
  s += `<ellipse cx="270" cy="256" rx="30" ry="19" fill="#0E0A14"/><ellipse cx="270" cy="252" rx="26" ry="14" fill="#06040A"/>`;
  // le livre : caché au fond du creux, il vient par à-coups, résiste, cède ; il tombe sur le sable, rebondit à peine
  const DUR = 4.2;
  const kts = '0;0.24;0.32;0.4;0.48;0.56;0.66;0.74;0.84;0.9;1';
  const pts = '272 262;272 262;266 256;270 258;262 252;268 255;256 250;240 262;242 330;242 324;242 328';
  const rots = '0;0;-4;-2;-7;-4;-10;-30;8;4;6';
  const sc = '0.6;0.6;0.66;0.64;0.72;0.7;0.8;0.96;1.3;1.3;1.3';
  const sp = Array(10).fill('0.45 0 0.55 1').join(';');
  const anim = (type, values) => `<animateTransform attributeName="transform" type="${type}" values="${values}" keyTimes="${kts}" calcMode="spline" keySplines="${sp}" dur="${DUR}s" fill="freeze"${type === 'translate' ? '' : ' additive="sum"'}/>`;
  s += `<g transform="translate(272 262)">${anim('translate', pts)}${anim('rotate', rots)}${anim('scale', sc)}<g opacity="0">${fonduUneFois('opacity', '0;0;1;1', '0;0.22;0.3;1', DUR)}${livre(D, true)}</g></g>`;
  // la lèvre du creux, devant le livre tant qu'il y est
  s += `<path d="M240,258 Q256,276 286,272 Q300,268 300,256 Q302,282 270,284 Q246,282 240,258 Z" fill="${mix(C.roche, '#000000', 0.2)}" stroke="#1A1422" stroke-width="1.2"/>`;
  // le petit nuage de sable quand il tombe
  for (let i = 0; i < 7; i++) {
    const a = Math.PI + (i / 6) * Math.PI, v = 18 + hash(i, 3) * 14;
    s += `<circle cx="242" cy="336" r="${f(3 + hash(i, 5) * 3)}" fill="${C.sable}" opacity="0"><animateTransform attributeName="transform" type="translate" values="0 0;${f(Math.cos(a) * v)} ${f(Math.sin(a) * v * 0.4)}" begin="${f(DUR * 0.84)}s" dur="0.7s" fill="freeze"/><animate attributeName="opacity" values="0.8;0" begin="${f(DUR * 0.84)}s" dur="0.7s" fill="freeze"/></circle>`;
  }
  // la lueur dorée du livre, une fois sur le sable : elle respire
  s += `<ellipse cx="242" cy="328" rx="52" ry="20" fill="${D.rad([[0, '#FFD88A', 0.4], [1, '#FFD88A', 0]], 242, 328, 52)}" opacity="0">${fonduUneFois('opacity', '0;1', '0;1', 1, DUR)}</ellipse>`;
  // (vivantes, au calque anime de la scène figée : cette lueur, et Brume ; figer.js)
  s += vif(`<ellipse cx="242" cy="328" rx="40" ry="16" fill="${D.rad([[0, '#FFE6A8', 0.35], [1, '#FFE6A8', 0]], 242, 328, 40)}" opacity="0"><animate attributeName="opacity" values="0;0.9;0.3" keyTimes="0;0.5;1" dur="3.5s" begin="${DUR}s" repeatCount="indefinite"/></ellipse>`);
  // Brume : elle file au creux, tire par à-coups (gênée, une goutte au front), puis tombe en arrière avec le livre et
  // remonte au-dessus de lui, fière et essoufflée
  const bkts = '0;0.2;0.24;0.32;0.4;0.48;0.56;0.66;0.74;0.84;1';
  const bpts = '150 230;262 244;250 246;242 240;248 242;238 236;246 238;232 234;214 242;262 288;272 282';
  const bsc = '1.6;2;2;2;2;2;2;2;2.1;2.4;2.4';
  const banim = (type, values) => `<animateTransform attributeName="transform" type="${type}" values="${values}" keyTimes="${bkts}" calcMode="spline" keySplines="${sp}" dur="${DUR}s" fill="freeze"${type === 'translate' ? '' : ' additive="sum"'}/>`;
  // ses visages se relaient d'un coup (curieuse, puis gênée par l'effort, puis contente), de..a : en secondes
  const visage = (expr, de, a, cligne) => `<g opacity="${de ? 0 : 1}">${de ? `<set attributeName="opacity" to="1" begin="${f(de)}s" fill="freeze"/>` : ''}${a ? `<set attributeName="opacity" to="0" begin="${f(a)}s" fill="freeze"/>` : ''}${brumeVive(expr, 1, 1, cligne)}</g>`;
  s += `<g transform="translate(150 230)">${banim('translate', bpts)}${banim('scale', bsc)}${vif(`<g>${vaVient('translate', '0 0', '0 -1.6', 1.1)}${halo(D, 24, 0.6)}${visage('curieuse', 0, DUR * 0.22, [3, 0.5])}${visage('gene', DUR * 0.22, DUR * 0.86)}${visage('content', DUR * 0.86, 0, [3.6, 2.2])}</g>`)}</g>`;
  s += nappes(D, [[140, 312, 260, 20, 0.22, 1], [360, 326, 180, 18, 0.2, -1]], C.brume, 9);
  s += ambiance(D, t, 236);
  return D.out(s);
}

module.exports = { lueur02, approche02, rocher02, livre03, brumeDevant, heure, brumeVive, debut };
