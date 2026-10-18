// La veillée du conseil (choix de l'auteur, 16 oct. : « cette scène est dégueulasse… tous souriants et plats », dessinée
// à nouveau, hors de la bibliothèque) : le premier conseil de la troupe, sous l'orage qui vient. Le ciel encore étoilé à
// gauche, avalé à droite par un front d'orage qui arrive de la mer ; au large, l'îlot et la silhouette de sa tour (Léo la
// montre) ; autour du feu, chacun à sa place et à son humeur : Agathe inquiète, Lorena debout qui scrute les nuages,
// Nathan pensif, les mains au feu, Léo qui montre l'îlot ; Brume, grave ; l'avatar de dos, au premier plan, les mains
// tendues vers le feu. La lumière chaude du feu d'un côté, la lumière froide de l'orage de l'autre.
//
// Les dessins viennent de la bibliothèque, lus sans y rien écrire : la troupe refondue (design/personnages/refonte :
// habiller), la pose assise (design/atelier/assis.js), l'éclairage de nuit, le feu, les rondins, les arbres et le sol
// de la veillée (design/atelier/veillee.js, ses dessins internes), le fond figé et le calque animé (figer.js : separer).
//
//   node outils/scenes/conseil.cjs
//
// écrit dans src/assets/scenes/conseil/ : conseil_fond.svg (immobile), conseil_anime.svg (la flamme, Brume, l'éclair dans
// les nuages), conseil_devant.svg (la lumière sur l'avatar), conseil.json (sa hauteur, la place de l'avatar ;
// game/sceneArt.js). La scène est en hauteur, 400 × 600 (choix de l'auteur, 16 oct. : elle remplit un téléphone, le carré
// laissait une bande vide) : le carré de la veillée (y de 0 à 400) et, au-dessus, 200 de ciel et la tour de l'orage.
const fs = require('fs');
const path = require('path');
const Module = require('module');

const DESIGN = path.join(__dirname, '../../design');
const OUT = path.join(__dirname, '../../src/assets/scenes/conseil');
const need = file => require(path.join(DESIGN, file));

// Les dessins internes de la veillée (veillee.js n'exporte que la scène entière) : le fichier lu tel quel, qui les
// exporte en plus, dans ce seul processus ; un nom qui disparaît est une erreur (le générateur s'arrête)
function internes(file, names) {
  const full = path.join(DESIGN, file);
  const m = new Module(full, module);
  m.filename = full;
  m.paths = Module._nodeModulePaths(path.dirname(full));
  m._compile(`${fs.readFileSync(full, 'utf8')}\nmodule.exports.__internes = { ${names.join(', ')} };`, full);
  return m.exports.__internes;
}
const V = internes('atelier/veillee.js', ['feuVivant', 'lumiereDuFeu', 'rondin', 'ombreAuSol', 'premierPlan', 'branche', 'arbre', 'pin', 'loin', 'buisson', 'fougere', 'sol', 'devantAvatar', 'VAC']);
const { Defs, vaVient, boucle, hash, f } = need('atelier/ouverture');
const { brumeVive, debut } = need('atelier/rencontre');
const { vif, separer } = need('atelier/figer');
const { tendre } = need('atelier/gestes');
const { assis: poseAssise } = need('atelier/assis');
const { poserEclaire } = need('atelier/eclairage');
const { arm, E, L, OUT: TRAIT } = need('atelier/troupe');
const LORENA = need('personnages/refonte/lorena_anims');

const W = 400;
// Le haut de la scène au-dessus du carré de la veillée, sa hauteur
const TOP = -200;
const H = 600;
// Le feu, et la place de l'avatar (le jeu le pose entre le fond et le devant : de dos, assis, les mains tendues vers le
// feu, qui est devant lui ; game/sceneArt.js)
const FEU = [202, 312];
const AVATAR = { x: 104, y: 400, echelle: 2.75, vue: 'dos', pose: 'assis-mains-tendues', naufrage: false };
// La tour au large, sur son îlot (le bas de la tour)
const TOUR = [326, 150];

// ——— la troupe refondue, rafistolée au camp ———
const habiller = (nom, tenue, etat) => need(`personnages/refonte/${nom}_tenues`).habiller(tenue, null, etat);
const TROUPE = {
  lorena: habiller('lorena', 'cire', 'rafistolee'),
  agathe: habiller('agathe', 'robe', 'rafistolee'),
  nathan: habiller('nathan', 'atelier', 'rafistole'),
  leo: habiller('leo', 'cire', 'rafistole')
};
// Des regards à eux (les expressions du kit, le regard tourné là où ils regardent) : Léo, les yeux ronds, vers l'îlot ;
// Agathe inquiète, vers Lorena ; Nathan, pensif, dans le feu. Lorena scrute la mer et l'orage à sa longue-vue (son geste
// de navigatrice, lorena_anims.js : longuevue, l'éclat sur le laiton)
const EXPRS = {
  agathe: ['personnages/refonte/agathe_refonte', 'souci', 'inquiete', { look: [0.6, -0.15] }],
  nathan: ['personnages/refonte/nathan_refonte', 'braises', 'pensive', { look: [-0.55, 0.55], browL: [-0.6, -0.2, -0.4] }],
  leo: ['personnages/refonte/leo_refonte', 'voit', 'surprise', { look: [0.8, -0.45] }]
};
for (const [file, name, base, plus] of Object.values(EXPRS)) {
  const E2 = need(file).EXPR;
  E2[name] = { ...E2[base], ...plus };
}

// Léo montre l'îlot : le bras du côté de la mer levé, l'index tendu ; l'autre main posée sur son genou (assis.js : un
// geste fait assis, depuis les épaules descendues)
const doigt = (c, b, ux, uy) => {
  const t = [b[0] + ux * 3.4, b[1] + uy * 3.4];
  return E(b[0], b[1], 2.1, 2.1, c.hand || c.skin) + L(b, t, TRAIT, 2.1) + L(b, t, c.hand || c.skin, 1.2);
};
function montrer({ view }) {
  const [a, b] = this.shoulders;
  if (view !== 'front') throw new Error('montrer : de face seulement');
  const main = [b[0] + 8.6, b[1] - 7.2];
  const u = [0.78, -0.62];
  return { right: arm(this, b, main, [b[0] + 5.2, b[1] - 1.6], doigt(this, main, u[0], u[1])), left: null };
}

// ——— le ciel, et l'orage qui vient ———
function ciel(D) {
  let s = `<rect y="${TOP}" width="${W}" height="${190 - TOP}" fill="${D.lin([[0, '#02040F'], [0.45, '#060B22'], [0.8, '#111C44'], [1, '#26365E']], 0, TOP, 0, 190)}"/>`;
  // la voie lactée, très douce, en biais, là où le ciel est encore dégagé
  s += `<ellipse cx="70" cy="-90" rx="180" ry="26" transform="rotate(-24 70 -90)" fill="${D.rad([[0, '#9FB4E8', 0.14], [0.6, '#7A8EC8', 0.05], [1, '#7A8EC8', 0]], 70, -90, 180)}"/>`;
  // les étoiles, à gauche seulement : à droite, l'orage les a déjà mangées
  for (let i = 0; i < 90; i++) {
    const x = hash(i, 1) * 230, y = TOP + hash(i, 2) * (128 - TOP), r = 0.35 + hash(i, 3) * 0.85;
    s += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="#F4F0E0" opacity="${f((0.35 + hash(i, 6) * 0.5) * (1 - x / 300))}"/>`;
  }
  for (const [x, y, k] of [[34, 26, 1.1], [118, 58, 0.8], [182, 18, 0.7], [56, -150, 1.3], [146, -110, 0.9], [22, -62, 0.8]]) {
    s += `<g transform="translate(${x} ${y})"><circle r="${f(3 * k)}" fill="${D.rad([[0, '#FFFFFF', 0.6], [1, '#C8D8FF', 0]], 0, 0, 3 * k)}"/>`
      + `<path d="M0,${f(-4.6 * k)} L${f(0.6 * k)},0 L0,${f(4.6 * k)} L${f(-0.6 * k)},0 Z M${f(-4.6 * k)},0 L0,${f(0.6 * k)} L${f(4.6 * k)},0 L0,${f(-0.6 * k)} Z" fill="#FFFDF0" opacity="0.85"/></g>`;
  }
  return s;
}
// une masse de nuage, d'un seul tenant : des boules qui se fondent en une silhouette ; seul son bord du haut accroche la
// lueur de l'orage (la silhouette claire, puis la même, sombre, un peu plus bas : il reste un liseré), puis un modelé de
// haut en bas sur toute la masse (le dessus plus clair, le ventre qui s'assombrit)
const rond = ([x, y, r]) => `M${f(x - r)},${f(y)} a${f(r)},${f(r)} 0 1,0 ${f(2 * r)},0 a${f(r)},${f(r)} 0 1,0 ${f(-2 * r)},0 Z`;
function nuage(D, pts, { corps, liseré, haut, ventre }, decale = [-2.2, 3.2]) {
  const forme = pts.map(rond).join(' ');
  const ys = pts.map(([, y, r]) => [y - r, y + r]).flat();
  const y0 = Math.min(...ys), y1 = Math.max(...ys);
  return `<path d="${forme}" fill="${liseré}"/>`
    + `<path d="${pts.map(([x, y, r]) => rond([x + decale[0], y + decale[1], r])).join(' ')}" fill="${corps}" clip-path="${D.clip(forme)}"/>`
    + `<path d="${forme}" fill="${D.lin([[0, haut, 0.5], [0.45, haut, 0], [0.7, ventre, 0], [1, ventre, 0.55]], 0, y0, 0, y1)}"/>`;
}
function orage(D) {
  let s = '';
  // la tour de l'orage, très haute au-dessus du front, et son enclume qui s'étale vers nous en haut de l'image : la plus
  // lointaine, la plus éclairée par l'éclair qui couve dedans
  s += `<ellipse cx="350" cy="-70" rx="120" ry="110" fill="${D.rad([[0, '#8EA4E8', 0.35], [1, '#5A6EB8', 0]], 350, -70, 120)}"/>`;
  s += nuage(D, [[150, -168, 14], [182, -172, 18], [216, -176, 22], [252, -178, 26], [292, -176, 30], [334, -170, 32], [378, -166, 34], [416, -160, 32]], { corps: '#26325C', liseré: '#B4C2F6', haut: '#6C80C0', ventre: '#121A36' }, [-1.6, 2.6]);
  s += nuage(D, [[300, -140, 30], [346, -126, 38], [394, -134, 36], [322, -96, 34], [372, -84, 42], [414, -98, 34], [300, -52, 30], [346, -40, 40], [398, -50, 40], [318, -10, 32], [366, 2, 38], [412, -6, 34]], { corps: '#2A3764', liseré: '#C8D4FF', haut: '#8094D8', ventre: '#141C3A' });
  // la lueur de l'orage derrière les nuages (l'éclair qui couve), et son reflet sur la mer
  s += `<ellipse cx="318" cy="96" rx="150" ry="90" fill="${D.rad([[0, '#8EA4E8', 0.45], [0.5, '#5A6EB8', 0.18], [1, '#3A4A8A', 0]], 318, 96, 150)}"/>`;
  // le front d'orage : trois rangs, du plus lointain (clair, bleuté) au plus proche (sombre, bas, qui avance sur nous)
  s += nuage(D, [[256, 40, 30], [292, 22, 40], [336, 30, 44], [384, 16, 46], [222, 56, 20], [416, 52, 36]], { corps: '#2C3A68', liseré: '#C4D0FF', haut: '#7C90D4', ventre: '#141C3A' });
  s += nuage(D, [[232, 80, 24], [266, 70, 32], [306, 76, 36], [352, 66, 38], [398, 80, 38], [204, 92, 16]], { corps: '#202A54', liseré: '#A6B6F2', haut: '#5466A8', ventre: '#10162E' });
  // (la lueur de l'éclair qui couve, entre deux rangs)
  s += `<ellipse cx="318" cy="96" rx="64" ry="18" fill="${D.rad([[0, '#B4C4FF', 0.42], [1, '#9FB2F0', 0]], 318, 96, 64)}"/>`;
  s += nuage(D, [[246, 110, 22], [280, 104, 28], [320, 112, 30], [362, 102, 32], [404, 114, 32], [218, 118, 14]], { corps: '#151C38', liseré: '#6A7EC0', haut: '#34447A', ventre: '#0A0F24' });
  // sous le front, une bande claire à l'horizon : la lueur de l'orage sur la mer, où la tour se découpe en contre-jour
  s += `<ellipse cx="318" cy="146" rx="128" ry="16" fill="${D.rad([[0, '#8EA4E8', 0.55], [0.6, '#6A80C8', 0.2], [1, '#6A80C8', 0]], 318, 146, 128)}"/>`;
  // le bas du front, presque noir, et les rideaux de pluie qui tombent déjà sur la mer
  s += `<path d="M196,122 Q232,112 262,122 Q300,112 334,124 Q372,112 410,124 L410,132 Q360,128 320,133 Q270,127 230,131 Q210,128 196,128 Z" fill="${D.lin([[0, '#141A34'], [1, '#1C2444', 0.3]], 0, 112, 0, 133)}"/>`;
  for (let i = 0; i < 26; i++) {
    const x = 236 + hash(i, 81) * 170, h = 16 + hash(i, 82) * 18;
    s += `<path d="M${f(x)},${f(128 + hash(i, 83) * 6)} l${f(-h * 0.22)},${f(h)}" stroke="#8A9CC8" stroke-width="${f(0.5 + hash(i, 84) * 0.5)}" opacity="${f(0.16 + hash(i, 85) * 0.18)}"/>`;
  }
  return s;
}
// l'éclair qui couve dans les nuages (calque animé) : une lueur qui s'allume d'un coup, deux fois, puis rien longtemps ;
// une fois dans le front, une fois haut dans la tour, jamais ensemble
function eclairCouve(D) {
  const lueur = (x, y, rx, ry) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${D.rad([[0, '#E4ECFF', 0.85], [0.4, '#B4C4FF', 0.4], [1, '#8EA4E8', 0]], x, y, rx)}"/>`;
  const eclat = (keys, corps) => vif(`<g opacity="0"><animate attributeName="opacity" values="0;0;0.9;0.15;0.75;0;0" keyTimes="${keys}" dur="7.4s" repeatCount="indefinite"/>${corps}</g>`);
  return eclat('0;0.62;0.64;0.66;0.68;0.74;1', lueur(336, 74, 62, 40)) + eclat('0;0.2;0.22;0.24;0.26;0.32;1', lueur(360, -80, 70, 60));
}

// ——— la mer, l'îlot et sa tour, la côte ———
function mer(D) {
  let s = `<path d="M150,150 L410,148 L410,214 L150,214 Z" fill="${D.lin([[0, '#1A2846'], [0.4, '#121E36'], [1, '#0C1628']], 0, 148, 0, 214)}"/>`;
  // le reflet de la lueur de l'orage sous les nuages, en traits couchés
  for (let i = 0; i < 18; i++) {
    const y = 154 + hash(i, 91) * 40, x = 250 + hash(i, 92) * 140, w = 6 + hash(i, 93) * 16;
    s += `<path d="M${f(x - w)},${f(y)} L${f(x + w)},${f(y)}" stroke="#7E92CC" stroke-width="0.7" opacity="${f(0.12 + (1 - (y - 154) / 40) * 0.28)}"/>`;
  }
  // l'îlot : un rocher bas, et sa tour, éteinte, en silhouette contre la lueur ; son liseré froid du côté de l'orage
  const [tx, ty] = TOUR;
  const SIL = '#0A1120', LIS = '#A4B6EC';
  s += `<path d="M${tx - 30},${ty + 1} Q${tx - 22},${ty - 5} ${tx - 12},${ty - 5} Q${tx - 4},${ty - 9} ${tx + 6},${ty - 6} Q${tx + 16},${ty - 6} ${tx + 28},${ty + 1} Z" fill="${SIL}"/>`;
  s += `<path d="M${tx - 22},${ty - 4.6} Q${tx - 12},${ty - 5.6} ${tx - 4},${ty - 8.6} Q${tx + 6},${ty - 6} ${tx + 16},${ty - 5.6}" stroke="${LIS}" stroke-width="0.5" fill="none" opacity="0.5"/>`;
  // la tour : un fût qui s'affine, la galerie, la lanterne éteinte, son toit ; le liseré froid du côté de l'orage
  s += `<path d="M${tx - 2.7},${ty - 7} L${tx - 1.8},${ty - 26} L${tx + 1.8},${ty - 26} L${tx + 2.7},${ty - 7} Z M${tx - 3},${ty - 26} L${tx + 3},${ty - 26} L${tx + 3},${ty - 27.2} L${tx - 3},${ty - 27.2} Z M${tx - 1.7},${ty - 27.2} L${tx + 1.7},${ty - 27.2} L${tx + 1.7},${ty - 30.4} L${tx - 1.7},${ty - 30.4} Z M${tx - 2.2},${ty - 30.4} Q${tx},${ty - 33.6} ${tx + 2.2},${ty - 30.4} Z" fill="${SIL}"/>`;
  s += `<path d="M${tx + 1.9},${ty - 26} L${tx + 2.8},${ty - 7} M${tx + 1.8},${ty - 30.2} L${tx + 1.8},${ty - 27.4}" stroke="${LIS}" stroke-width="0.55" opacity="0.8"/>`;
  // l'écume au pied de l'îlot
  s += `<path d="M${tx - 32},${ty + 1.6} Q${tx},${ty - 0.4} ${tx + 30},${ty + 1.6}" stroke="#C8D4F0" stroke-width="0.8" fill="none" opacity="0.5"/>`;
  return s;
}
// la côte : le promontoire du camp s'arrête au-dessus de la mer, à droite ; son bord, l'écume en bas
const BORD = 'M150,174 Q206,170 252,180 Q300,190 340,186 Q376,184 410,196';
function cote(D) {
  let s = `<path d="${BORD} L410,214 L150,214 Z" fill="#0E1828"/>`;
  s += `<path d="M150,180 Q212,180 254,190 Q300,200 342,196 Q378,194 410,206" stroke="#B8C8E8" stroke-width="1" fill="none" opacity="0.35"/>`;
  return s;
}

// ——— la lisière, à gauche ———
function lisiere(D) {
  let s = `<path d="M-10,138 Q40,112 96,130 Q140,116 176,134 L176,180 L-10,180 Z" fill="#17284A"/>`;
  s += [[16, 150, 0.85], [64, 144, 0.75], [118, 142, 0.7], [160, 150, 0.6]].map(([x, y, k]) => V.loin(x, y, k)).join('');
  const rang = [['p', -8, 172, 1.15], ['a', 30, 176, 1.05], ['p', 78, 166, 0.95], ['a', 116, 168, 0.85], ['p', 152, 166, 0.75]];
  s += rang.map(([t, x, y, k], i) => (t === 'a' ? V.arbre(D, x, y, k, i, Math.abs(x - FEU[0]) < 150) : V.pin(x, y, k, i))).join('');
  s += [[12, 184, 1.1], [92, 176, 0.9], [160, 174, 0.7]].map(([x, y, k]) => V.buisson(D, x, y, k)).join('');
  [[44, 194, 1], [142, 178, 0.8]].forEach(([x, y, k], i) => { s += V.fougere(x, y, k, i); });
  return s;
}

// ——— la scène ———
function conseil() {
  const pref = 'cv';
  const D = Defs(pref);
  debut(`${pref}b`);
  const [fx, fy] = FEU;
  let s = ciel(D) + orage(D) + mer(D) + cote(D) + lisiere(D);
  // le sol du promontoire : celui de la veillée (l'herbe, sa lumière, le chemin, les touffes), découpé au bord de la côte
  const terre = D.clip(`M-10,170 Q60,160 150,170 Q206,170 252,180 Q300,190 340,186 Q376,184 410,196 L410,410 L-10,410 Z`);
  s += `<g clip-path="${terre}">${V.sol(D, FEU, 'M150,410 Q160,372 178,346 Q194,322 200,300')}</g>`;
  s += `<path d="${BORD}" stroke="#2A4430" stroke-width="2.4" fill="none" opacity="0.9"/>`;
  // la nuit sur tout, moins forte près du feu ; la lumière froide de l'orage sur la droite de l'image
  s += `<rect y="${TOP}" width="${W}" height="${H}" fill="${D.rad([[0, '#14204A', 0.04], [0.32, '#14204A', 0.38], [0.7, '#0A1232', 0.6], [1, '#060C26', 0.72]], fx, fy, 300)}"/>`;
  s += `<rect y="${TOP}" width="${W}" height="${H}" fill="${D.lin([[0, '#8EA4E8', 0], [0.6, '#8EA4E8', 0], [1, '#8EA4E8', 0.1]], 0, 0, W, 0)}"/>`;
  s += V.lumiereDuFeu(D, fx, fy - 6, 1.45);
  s += V.feuVivant(D, fx, fy - 10, 1.25);
  // les éclairages des personnages : le feu, et le froid de l'orage, en haut à droite
  const L2 = { chauds: [{ x: fx, y: fy - 10, portee: 200, force: 1 }], froid: { x: 360, y: 70, couleur: '#B8C8FF' }, vacille: V.VAC };
  // les ombres au sol de tous, l'avatar compris
  const assis = [
    ['agathe', 'se', 140, 292, 2, -1, 'souci', null],
    ['nathan', 'se', 286, 300, 2.05, 1, 'braises', tendre],
    ['leo', 'front', 336, 352, 2.35, 1, 'voit', montrer]
  ];
  const debout = [['lorena', 226, 272, 1.95]];
  for (const [, , x, y, k] of [...assis, ...debout]) s += V.ombreAuSol(D, x, y, k, FEU);
  s += V.ombreAuSol(D, AVATAR.x, AVATAR.y, AVATAR.echelle, FEU);
  s += V.rondin(D, AVATAR.x, AVATAR.y - 6.2 * AVATAR.echelle, AVATAR.echelle, FEU, `${pref}av`);
  // Brume, grave, à hauteur des visages, entre Agathe et Lorena : sa lueur, puis elle
  const brume = [178, 214, 1.7];
  s += `<circle cx="${brume[0]}" cy="${brume[1] - 12}" r="44" fill="${D.rad([[0, '#CFE8FF', 0.28], [1, '#CFE8FF', 0]], brume[0], brume[1] - 12, 44)}"/>`;
  // les personnages, du fond vers nous, éclairés (le fond est figé : ni souffle ni clignement à dessiner) ; Lorena
  // debout, au fond ; Brume ; puis ceux qui sont assis sur leur rondin, un peu penchés vers le feu
  for (const [nom, x, y, k] of debout) s += poserEclaire(LORENA.dessiner({ ...TROUPE[nom], uid: `${pref}${nom}` }, 'longuevue', 'bas_droite', 1, 'decidee'), x, y, k, 1, `${pref}${nom}`, L2);
  s += vif(`<g transform="translate(${brume[0]} ${brume[1]})"><g>${vaVient('translate', '0 0', '0 -4', 3.2)}${brumeVive('neutre', brume[2], 1, [4.6, 1.8])}</g></g>`);
  for (const [nom, vue, x, y, k, m, expr, geste] of assis) {
    const siege = y - 8.4 * k, vers = FEU[0] > x ? 1 : -1;
    s += V.rondin(D, x, siege + 2.2 * k, k, FEU, `${pref}${nom}r`);
    const corps = poserEclaire(poseAssise({ ...TROUPE[nom], uid: `${pref}${nom}` }, vue, 0, expr, geste), x, y, k, m, `${pref}${nom}`, L2);
    s += `<g transform="rotate(${f(vers * 1.6)} ${f(x)} ${f(siege)})">${corps}</g>`;
  }
  // l'éclair qui couve, les herbes du premier plan, une branche en haut à gauche, le bord du cadre plus sombre
  s += eclairCouve(D);
  s += V.premierPlan(-4, 404, 1.2, 1, 0) + V.premierPlan(404, 404, 1.1, -1, 1) + V.branche(-6, TOP + 6, 1, 0);
  s += `<rect y="${TOP}" width="${W}" height="${H}" fill="${D.rad([[0, '#000', 0], [0.7, '#060A1E', 0.08], [1, '#060A1E', 0.45]], 200, 140, 380)}"/>`;
  return D.out(s);
}

// (tout le jeu en papier néon, choix de l'auteur, 18 oct. : ses couleurs ravivées sans changer de teinte (ses personnages gardent les leurs), design/atelier/neon_reveil.js ;
// l'avatar y est rendu en néon, game/acteur.js : gravee)
const { ravivee, LUMIERES } = need('atelier/neon_reveil');
const svg = body => `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 ${TOP} ${W} ${H}">${ravivee(body)}</svg>`;
const { fond, anime } = separer(conseil(), Infinity);
fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'conseil_fond.svg'), svg(fond));
fs.writeFileSync(path.join(OUT, 'conseil_anime.svg'), svg(anime));
fs.writeFileSync(path.join(OUT, 'conseil_devant.svg'), svg(V.devantAvatar('cva', AVATAR, FEU).replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '')));
// (la place de l'avatar, depuis le haut de la scène)
fs.writeFileSync(path.join(OUT, 'conseil.json'), `${JSON.stringify({ nom: 'Le conseil, sous l’orage qui vient', images: 1, ms_par_image: 1100, hauteur: H, avatar: { ...AVATAR, y: AVATAR.y - TOP, neon: true, lumiere: { ...LUMIERES.feu, cote: -1 } } }, null, 2)}\n`);
const anims = (anime.match(/<animate/g) || []).length;
console.log(`conseil : fond ${Math.round(fond.length / 1024)} Ko, calque animé ${Math.round(anime.length / 1024)} Ko (${anims} animations)`);
