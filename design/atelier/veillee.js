// La veillée au nouveau village, vivante (choix de l'auteur, 15 oct. : « fais-les vivre, tant les scènes que les
// personnages » ; au niveau des images de l'ouverture, en animation continue SMIL). En couches propres, du fond vers
// nous :
//   le ciel (des étoiles qui scintillent, de grandes étoiles en croix, la voie lactée, une étoile filante) ;
//   les collines de l'île, la brume qui dérive entre elles ;
//   la lisière : de grands arbres et des pins, leurs houppiers en volume, bordés de bleu par Brume et d'or par le feu,
//   qui se balancent au vent, des buissons et des fougères à leur pied ;
//   le sol peint : l'herbe et sa lumière, les touffes qui ondulent, des massifs de fleurs, des cailloux, le chemin de
//   terre et ses pierres, des rondins pour s'asseoir ;
//   le village (les dessins du jeu : le Foyer, le Puits agrandi, les coins des naufragés, la torche) sous la nuit ;
//   le feu : des flammes qui dansent, des braises qui montent, une fumée qui s'en va, sa lumière qui vacille ;
//   les personnages du jeu, tels quels, éclairés de nuit (eclairage.js), qui respirent et clignent des yeux, la lumière
//   du feu qui vacille sur eux ;
//   Brume qui flotte et luit, des lucioles qui errent, des herbes au premier plan.
// Rien n'est redessiné : on pose les dessins du jeu et on les éclaire.
const { frame } = require('./troupe');
const { CAST } = require('./naufrages');
const { CAMP } = require('./camp.mjs');
const { lookAt } = require('./port/src/world/looks.js');
const { torche } = require('./torche');
const { poserEclaire } = require('./eclairage');
const { brumeVive, debut } = require('./rencontre');
const { Defs, vaVient, boucle, defile, hash, f } = require('./ouverture');

const W = 400;
const T = Object.fromEntries(CAST.filter(({ base }) => ['Cannelle', 'Rivet', 'Aster', 'Ondin'].includes(base.name)).map(({ base }) => [base.name, base]));
const K = 1.25;
const inner = svg => svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
let pose = 0;
const propre = body => { const t = `_d${pose++}`; return body.replace(/ id="([^"]+)"/g, ` id="$1${t}"`).replace(/url\(#([^)]+)\)/g, `url(#$1${t})`).replace(/href="#([^"]+)"/g, `href="#$1${t}"`); };
const poserDessin = (body, x, y, s) => `<g transform="translate(${f(x)} ${f(y)}) scale(${f(s * K)})">${propre(body)}</g>`;
const batiment = (site, lv) => { const look = lookAt(site, lv); return inner(look.make(undefined).svg) + look.anims.map(a => inner(a.frame(0).svg || a.frame(0))).join(''); };
const coin = key => CAMP[key].draw(0);

// la lumière du feu vacille (la même pour le décor, les personnages et l'avatar : tout respire ensemble)
const VACILLE = values => `<animate attributeName="opacity" values="${values}" dur="1.7s" repeatCount="indefinite"/>`;
const VAC = VACILLE('0.86;1;0.8;0.97;0.9;1;0.86');

// ——— le ciel ———
function ciel(D, haut) {
  let s = `<rect width="${W}" height="${haut + 4}" fill="${D.lin([[0, '#070D2A'], [0.55, '#15214C'], [1, '#2B416E']], 0, 0, 0, haut)}"/>`;
  // la voie lactée, très douce, en biais
  s += `<ellipse cx="230" cy="40" rx="260" ry="30" transform="rotate(-14 230 40)" fill="${D.rad([[0, '#9FB4E8', 0.16], [0.6, '#7A8EC8', 0.06], [1, '#7A8EC8', 0]], 230, 40, 260)}"/>`;
  for (let i = 0; i < 70; i++) {
    const x = hash(i, 1) * W, y = hash(i, 2) * (haut - 10), r = 0.35 + hash(i, 3) * 0.9;
    const tw = i % 3 === 0 ? boucle('opacity', [0.25, 0.95, 0.5], 2 + hash(i, 4) * 3, hash(i, 5) * 4) : '';
    s += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="#F4F0E0" opacity="${f(0.45 + hash(i, 6) * 0.45)}">${tw}</circle>`;
  }
  // de grandes étoiles en croix, qui pulsent
  for (const [x, y, k, d] of [[48, 30, 1.2, 3.1], [322, 22, 1.4, 2.6], [372, 78, 0.9, 3.7], [128, 64, 0.8, 4.2], [262, 92, 0.7, 3.3]]) {
    s += `<g transform="translate(${x} ${y})"><g>${vaVient('scale', '0.75', '1.15', d)}<circle r="${f(3.2 * k)}" fill="${D.rad([[0, '#FFFFFF', 0.7], [1, '#C8D8FF', 0]], 0, 0, 3.2 * k)}"/>`
      + `<path d="M0,${f(-5 * k)} L${f(0.7 * k)},0 L0,${f(5 * k)} L${f(-0.7 * k)},0 Z M${f(-5 * k)},0 L0,${f(0.7 * k)} L${f(5 * k)},0 L0,${f(-0.7 * k)} Z" fill="#FFFDF0"/></g></g>`;
  }
  // une étoile filante, de temps en temps
  s += `<g opacity="0"><animate attributeName="opacity" values="0;0;1;0;0" keyTimes="0;0.78;0.8;0.86;1" dur="11s" repeatCount="indefinite"/><g>`
    + `<animateTransform attributeName="transform" type="translate" values="0 0;0 0;90 36;90 36" keyTimes="0;0.78;0.86;1" dur="11s" repeatCount="indefinite"/>`
    + `<path d="M60,24 L104,42" stroke="${D.lin([[0, '#FFFFFF', 0], [1, '#FFFFFF', 0.9]], 60, 24, 104, 42)}" stroke-width="1.6" stroke-linecap="round"/></g></g>`;
  return s;
}

// ——— les collines, la brume, la lisière ———
const arbre = (D, x, y, k, i, chaud) => {
  // un arbre rond : un tronc qui s'affine, un houppier en grappes de feuillage modelées (plus claires en haut, du côté de
  // Brume), quelques reflets froids sur le haut, et dorés en bas près du feu
  let s = `<path d="M${f(x - 4 * k)},${f(y)} Q${f(x - 2 * k)},${f(y - 14 * k)} ${f(x - 2.4 * k)},${f(y - 30 * k)} L${f(x + 2.4 * k)},${f(y - 30 * k)} Q${f(x + 2 * k)},${f(y - 14 * k)} ${f(x + 4.5 * k)},${f(y)} Z" fill="${D.lin([[0, '#3A2A26'], [1, '#1C1416']], x - 4 * k, 0, x + 4 * k, 0)}"/>`;
  const grappes = [[0, -44, 20], [-15, -36, 15], [15, -37, 16], [-8, -56, 14], [9, -57, 13], [-20, -48, 11], [21, -49, 11], [0, -66, 10]];
  for (const [dx, dy, r] of grappes) {
    const cx = x + dx * k, cy = y + dy * k, rr = r * k;
    s += `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(rr)}" fill="${D.rad([[0, '#3E7058'], [0.55, '#24483E'], [1, '#14292A']], cx - rr * 0.35, cy - rr * 0.45, rr * 1.15)}"/>`;
  }
  // les reflets froids du haut (Brume), en petites touches
  for (const [dx, dy, r] of [[-6, -70, 4], [6, -66, 3.4], [-14, -60, 3], [14, -62, 3]]) s += `<circle cx="${f(x + dx * k)}" cy="${f(y + dy * k)}" r="${f(r * k)}" fill="#8EB4C8" opacity="0.28"/>`;
  if (chaud) s += `<g opacity="0.5">${boucle('opacity', [0.35, 0.6, 0.3, 0.55], 1.7)}` + [[-18, -30, 5], [0, -26, 6], [18, -30, 5]].map(([dx, dy, r]) => `<circle cx="${f(x + dx * k)}" cy="${f(y + dy * k)}" r="${f(r * k)}" fill="#C8884A" opacity="0.5"/>`).join('') + '</g>';
  return `<g>${vaVient('rotate', `-1.2 ${f(x)} ${f(y)}`, `1.2 ${f(x)} ${f(y)}`, 5 + (i % 4) * 0.9, i * 0.7)}${s}</g>`;
};
// un arbre lointain, en silhouette bleutée (la profondeur)
const loin = (x, y, k) => [[0, -30, 16], [-11, -24, 12], [11, -25, 12], [0, -42, 11]].map(([dx, dy, r]) => `<circle cx="${f(x + dx * k)}" cy="${f(y + dy * k)}" r="${f(r * k)}" fill="#1E3450"/>`).join('') + `<rect x="${f(x - 2 * k)}" y="${f(y - 14 * k)}" width="${f(4 * k)}" height="${f(14 * k)}" fill="#1A2C44"/>`;
const pin = (x, y, k, i) => {
  let s = `<rect x="${f(x - 2 * k)}" y="${f(y - 10 * k)}" width="${f(4 * k)}" height="${f(10 * k)}" fill="#2A1E1C"/>`;
  for (let j = 0; j < 4; j++) {
    const w = (20 - j * 4) * k, yy = y - 8 * k - j * 13 * k;
    s += `<path d="M${f(x - w)},${f(yy)} Q${f(x)},${f(yy - 5 * k)} ${f(x + w)},${f(yy)} L${f(x)},${f(yy - 20 * k)} Z" fill="${j % 2 ? '#183430' : '#1C3B36'}"/>`;
  }
  s += `<path d="M${f(x - 3 * k)},${f(y - 58 * k)} L${f(x)},${f(y - 68 * k)} L${f(x + 3 * k)},${f(y - 58 * k)}" fill="none" stroke="#9EC4E8" stroke-width="${f(1.2 * k)}" opacity="0.5"/>`;
  return `<g>${vaVient('rotate', `-1 ${f(x)} ${f(y)}`, `1 ${f(x)} ${f(y)}`, 6 + (i % 3), i)}${s}</g>`;
};
const buisson = (D, x, y, k) => [[-10, 0, 12], [4, -4, 14], [16, 1, 10]].map(([dx, dy, r]) => `<circle cx="${f(x + dx * k)}" cy="${f(y + dy * k)}" r="${f(r * k)}" fill="${D.rad([[0, '#335F44'], [1, '#183028']], x + dx * k - 3, y + dy * k - 5, r * k)}"/>`).join('');
const fougere = (x, y, k, i) => `<g>${vaVient('rotate', `-4 ${f(x)} ${f(y)}`, `4 ${f(x)} ${f(y)}`, 3 + (i % 3) * 0.6, i * 0.5)}` + [-50, -25, 0, 25, 50].map(a => `<path d="M${f(x)},${f(y)} q${f(Math.sin(a * Math.PI / 180) * 10 * k)},${f(-12 * k)} ${f(Math.sin(a * Math.PI / 180) * 22 * k)},${f(-16 * k + Math.abs(a) * 0.12 * k)}" fill="none" stroke="#2E5A40" stroke-width="${f(2.2 * k)}" stroke-linecap="round"/>`).join('') + '</g>';

function lisiere(D, chauds) {
  let s = '';
  // les collines de l'île, au loin, et la brume qui dérive entre elles
  s += `<path d="M-10,128 Q40,86 96,112 Q150,74 214,104 Q270,80 326,108 Q372,90 410,112 L410,160 L-10,160 Z" fill="#1A2A50"/>`;
  s += `<g>${defile('-40 0', '40 0', 30)}<ellipse cx="200" cy="120" rx="260" ry="10" fill="${D.rad([[0, '#8EA6D0', 0.28], [1, '#8EA6D0', 0]], 200, 120, 260)}"/></g>`;
  s += `<path d="M-10,140 Q60,108 120,130 Q180,104 250,128 Q320,108 410,132 L410,170 L-10,170 Z" fill="#1D3348"/>`;
  // un rang d'arbres lointains, bleutés, puis les arbres et les pins de la lisière
  for (const [x, y, k] of [[20, 150, 0.9], [70, 142, 0.8], [150, 138, 0.75], [210, 136, 0.7], [270, 140, 0.75], [330, 144, 0.8], [384, 148, 0.9]]) s += loin(x, y, k);
  const rang = [['p', -6, 168, 1.15], ['a', 30, 172, 1.05], ['p', 84, 160, 0.95], ['a', 118, 158, 0.85], ['p', 168, 150, 0.8], ['a', 236, 152, 0.85], ['p', 282, 156, 0.95], ['a', 330, 166, 1.05], ['p', 378, 162, 1.1], ['a', 410, 174, 1.15]];
  rang.forEach(([t, x, y, k], i) => { s += t === 'a' ? arbre(D, x, y, k, i, chauds(x)) : pin(x, y, k, i); });
  // les buissons et les fougères au pied
  for (const [x, y, k] of [[10, 182, 1.1], [96, 172, 0.9], [300, 172, 0.9], [392, 186, 1.1], [180, 164, 0.7]]) s += buisson(D, x, y, k);
  [[40, 192, 1], [140, 172, 0.8], [262, 170, 0.8], [360, 194, 1]].forEach(([x, y, k], i) => { s += fougere(x, y, k, i); });
  return s;
}

// ——— le sol peint ———
function sol(D, feu, chemin) {
  let s = `<path d="M-10,166 Q100,158 200,166 T410,162 L410,410 L-10,410 Z" fill="${D.lin([[0, '#2E4A34'], [0.4, '#3A5E3C'], [1, '#2A4630']], 0, 166, 0, 400)}"/>`;
  // la lumière peinte : chaude près du feu, l'herbe plus fraîche loin de lui
  s += `<ellipse cx="${feu[0]}" cy="${feu[1]}" rx="220" ry="120" fill="${D.rad([[0, '#8AA048', 0.55], [0.5, '#5E7E3C', 0.25], [1, '#5E7E3C', 0]], feu[0], feu[1], 220)}"/>`;
  // des plaques de trèfle, plus claires
  for (let i = 0; i < 9; i++) {
    const x = hash(i, 21) * W, y = 196 + hash(i, 22) * 200;
    s += `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(18 + hash(i, 23) * 22)}" ry="${f(5 + hash(i, 24) * 5)}" fill="#4E7A44" opacity="0.45"/>`;
  }
  // le chemin de terre, ses bords et ses pierres plates
  s += `<path d="${chemin}" fill="none" stroke="${D.lin([[0, '#8E7452'], [1, '#B8986A']], 0, 180, 0, 400)}" stroke-width="22" stroke-linecap="round" opacity="0.8"/>`;
  s += `<path d="${chemin}" fill="none" stroke="#C8AE80" stroke-width="10" stroke-linecap="round" opacity="0.35"/>`;
  for (let i = 0; i < 14; i++) {
    const x = 160 + hash(i, 31) * 90, y = 190 + hash(i, 32) * 210;
    s += `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(1.6 + hash(i, 33) * 2.4)}" ry="${f(1 + hash(i, 34) * 1.2)}" fill="#7E6A58" stroke="#3C2819" stroke-width="0.4" opacity="0.8"/>`;
  }
  // des touffes d'herbe en trois tons ; une sur trois ondule au vent
  for (let i = 0; i < 110; i++) {
    const x = hash(i, 41) * W, y = 176 + hash(i, 42) * 228, k = 0.7 + hash(i, 43) * 0.8;
    const c = ['#5E8C48', '#4A7A3E', '#76A052'][i % 3];
    const brins = `<path d="M${f(x)},${f(y)} q${f(-2 * k)},${f(-6 * k)} ${f(-1 * k)},${f(-10 * k)} M${f(x)},${f(y)} q${f(1 * k)},${f(-7 * k)} ${f(3 * k)},${f(-10 * k)} M${f(x)},${f(y)} q${f(3 * k)},${f(-4 * k)} ${f(7 * k)},${f(-6 * k)}" fill="none" stroke="${c}" stroke-width="${f(1.1 * k)}" stroke-linecap="round"/>`;
    s += i % 3 === 0 ? `<g>${vaVient('skewX', '-6', '6', 2.4 + hash(i, 44) * 1.6, hash(i, 45) * 2)}<g transform="translate(${f(x)} ${f(y)})"><g transform="translate(${f(-x)} ${f(-y)})">${brins}</g></g></g>` : brins;
  }
  // des massifs de fleurs, rares, dessinés
  for (const [x, y, c] of [[52, 300, '#F4EEDC'], [356, 252, '#E8C860'], [96, 214, '#B8A0E0'], [330, 380, '#F4EEDC']]) {
    for (let j = 0; j < 7; j++) {
      const fx = x + (hash(j, x) - 0.5) * 26, fy = y + (hash(j, y) - 0.5) * 10;
      s += `<path d="M${f(fx)},${f(fy + 6)} L${f(fx)},${f(fy)}" stroke="#3E6A38" stroke-width="0.8"/><circle cx="${f(fx)}" cy="${f(fy)}" r="1.6" fill="${c}"/><circle cx="${f(fx)}" cy="${f(fy)}" r="0.6" fill="#E8A040"/>`;
    }
  }
  return s;
}

// ——— le feu vivant ———
function feuVivant(D, x, y, s) {
  let o = `<ellipse cx="${f(x)}" cy="${f(y - 8 * s)}" rx="${f(14 * s)}" ry="${f(16 * s)}" fill="${D.rad([[0, '#FFF2C0', 0.9], [0.5, '#FFB050', 0.45], [1, '#FF7A30', 0]], x, y - 8 * s, 16 * s)}">${boucle('opacity', [0.8, 1, 0.7, 0.95], 0.9)}</ellipse>`;
  const flamme = (dx, h, w, fill, dur, beg, trace = true) => `<g transform="translate(${f(x + dx * s)} ${f(y)})"><g>${vaVient('scale', '1 1', '0.88 1.14', dur, beg)}${vaVient('skewX', '-6', '6', dur * 1.7, beg)}<path d="M${f(-w * s)},0 C${f(-w * s * 1.1)},${f(-h * s * 0.45)} ${f(-w * s * 0.3)},${f(-h * s * 0.7)} ${f(w * s * 0.15)},${f(-h * s)} C${f(w * s * 0.1)},${f(-h * s * 0.7)} ${f(w * s * 1.1)},${f(-h * s * 0.5)} ${f(w * s)},0 C${f(w * s * 0.8)},${f(w * s * 0.5)} ${f(-w * s * 0.8)},${f(w * s * 0.5)} ${f(-w * s)},0 Z" fill="${fill}"${trace ? ` stroke="#7A2A12" stroke-width="${f(0.7 * s)}" stroke-linejoin="round"` : ''}/></g></g>`;
  const rouge = D.lin([[0, '#FFB040'], [0.55, '#F2662A'], [1, '#C8321E']], 0, y - 26 * s, 0, y);
  const orange = D.lin([[0, '#FFE070'], [0.6, '#FF9A30'], [1, '#E8562A']], 0, y - 22 * s, 0, y);
  const jaune = D.lin([[0, '#FFFBE0'], [1, '#FFD050']], 0, y - 14 * s, 0, y);
  o += flamme(-6, 18, 5.5, rouge, 0.72, 0) + flamme(6, 20, 5.5, rouge, 0.64, 0.3) + flamme(-2, 26, 6.5, orange, 0.82, 0.1) + flamme(3, 22, 5, orange, 0.58, 0.45)
    + flamme(0, 15, 3.8, jaune, 0.5, 0.2, false) + flamme(0, 8, 2.2, '#FFFFF0', 0.42, 0.35, false);
  // les braises qui montent en tournant et s'éteignent
  for (let i = 0; i < 12; i++) {
    const d = 1.4 + hash(i, 51) * 1.4, bx = (hash(i, 52) - 0.5) * 14 * s, hh = 50 + hash(i, 53) * 60, beg = hash(i, 54) * d;
    o += `<circle cx="${f(x + bx)}" cy="${f(y - 10 * s)}" r="${f(0.7 + hash(i, 55) * 0.9)}" fill="#FFD27A"><animateTransform attributeName="transform" type="translate" values="0 0;${f(hash(i, 56) * 12 - 6)} ${f(-hh * 0.5)};${f(hash(i, 57) * 18 - 9)} ${f(-hh)}" dur="${f(d)}s" begin="${f(-beg)}s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0.8;0" dur="${f(d)}s" begin="${f(-beg)}s" repeatCount="indefinite"/></circle>`;
  }
  // la fumée, qui monte et s'en va avec le vent
  for (let i = 0; i < 4; i++) {
    const d = 5 + i * 0.8;
    o += `<ellipse cx="${f(x)}" cy="${f(y - 34 * s)}" rx="${f(5 * s)}" ry="${f(4 * s)}" fill="${D.rad([[0, '#B8C0D8', 0.35], [1, '#B8C0D8', 0]], x, y - 34 * s, 6 * s)}"><animateTransform attributeName="transform" type="translate" values="0 0;8 -40;22 -80" dur="${d}s" begin="${f(-i * d / 4)}s" repeatCount="indefinite"/><animate attributeName="rx" values="${f(5 * s)};${f(12 * s)};${f(20 * s)}" dur="${d}s" begin="${f(-i * d / 4)}s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.8;0.5;0" dur="${d}s" begin="${f(-i * d / 4)}s" repeatCount="indefinite"/></ellipse>`;
  }
  return o;
}
// sa lumière : un grand dégradé qui respire, la flaque au sol, les reflets sur l'herbe proche
function lumiereDuFeu(D, x, y, s) {
  let o = `<g>${VAC}<circle cx="${x}" cy="${f(y - 16 * s)}" r="${f(150 * s)}" fill="${D.rad([[0, '#FFE6A8', 0.5], [0.18, '#FFC070', 0.3], [0.45, '#FF9A50', 0.12], [1, '#FF8A40', 0]], x, y - 16 * s, 150 * s)}"/>`
    + `<ellipse cx="${x}" cy="${f(y + 4 * s)}" rx="${f(95 * s)}" ry="${f(30 * s)}" fill="${D.rad([[0, '#FFC27A', 0.55], [0.5, '#FF9A50', 0.22], [1, '#FF8A40', 0]], x, y + 4 * s, 95 * s)}"/></g>`;
  o += [[-38, 10], [30, 14], [-60, 4], [52, 6], [-14, 22], [18, -4], [70, 18], [-80, 16]].map(([dx, dy], i) => { const k = 1 - Math.hypot(dx, dy) / 95; return `<ellipse cx="${f(x + dx * s)}" cy="${f(y + dy * s)}" rx="${f(2.2 * s)}" ry="${f(0.8 * s)}" fill="#FFD9A0" opacity="0.3">${boucle('opacity', [f(0.15 * k), f(0.6 * k), f(0.25 * k)], 0.9 + (i % 3) * 0.35, i * 0.2)}</ellipse>`; }).join('');
  return o;
}

// ——— les personnages : éclairés, qui respirent et clignent ———
// deux images du jeu (repos, les yeux ouverts ; et l'image du clignement), éclairées, qui se relaient ; le tout respire
// (un léger gonflement depuis les pieds) et se balance à peine
// l'ombre au sol d'un personnage : le contact sous ses pieds, et l'ombre portée à l'opposé du feu, qui vacille avec lui
function ombreAuSol(D, x, y, s, feu) {
  const dx = x - feu[0], dy = y - feu[1], d = Math.hypot(dx, dy) || 1, ux = dx / d, uy = dy / d;
  const a = Math.atan2(uy, ux) * 180 / Math.PI, long = 26 * s * Math.min(1.4, 90 / Math.max(40, d) + 0.5);
  return `<g>${VACILLE('0.8;1;0.75;0.95;0.85;1;0.8')}<ellipse cx="${f(x + ux * long * 0.55)}" cy="${f(y + uy * long * 0.25)}" rx="${f(long * 0.6)}" ry="${f(5 * s)}" transform="rotate(${f(a * 0.35)} ${f(x)} ${f(y)})" fill="${D.rad([[0, '#0A1020', 0.45], [1, '#0A1020', 0]], x + ux * long * 0.55, y + uy * long * 0.25, long * 0.6)}"/></g>`
    + `<ellipse cx="${f(x)}" cy="${f(y - 1)}" rx="${f(15 * s)}" ry="${f(3.6 * s)}" fill="${D.rad([[0, '#0A1020', 0.55], [0.7, '#0A1020', 0.2], [1, '#0A1020', 0]], x, y - 1, 15 * s)}"/>`;
}
function vivant(c, view, x, y, s, m, id, L, i, expr, plus = '') {
  const ouvert = poserEclaire(frame(c, view, 'repos', 0, expr) + plus, x, y, s, m, `${id}o`, L);
  const ferme = poserEclaire(frame(c, view, 'repos', 3, expr) + plus, x, y, s, m, `${id}f`, { ...L, silhouette: `${id}oS` });
  const per = 3.6 + (i % 3) * 0.9, t0 = f(1 + i * 0.7);
  const cl = (on) => `<animate attributeName="opacity" values="${on ? '1;0;1' : '0;1;0'}" keyTimes="0;${f(t0 / per)};${f((t0 + 0.16) / per)}" calcMode="discrete" dur="${f(per)}s" repeatCount="indefinite"/>`;
  return `<g>${vaVient('rotate', `-0.8 ${f(x)} ${f(y)}`, `0.8 ${f(x)} ${f(y)}`, 4.4 + i * 0.5, i)}<g transform="translate(${f(x)} ${f(y)})"><g>${vaVient('scale', '1 1', '1.008 1.018', 2.8 + i * 0.3, i * 0.6)}<g transform="translate(${f(-x)} ${f(-y)})">`
    + `<g>${cl(true)}${ouvert}</g><g opacity="0">${cl(false)}${ferme}</g></g></g></g></g>`;
}

// des lucioles qui errent, leur lueur
function lucioles(D, pts) {
  return pts.map(([x, y, rx, ry], i) => {
    const d = 7 + hash(i, 61) * 5;
    const chemin = `M${x},${y} q${rx},${-ry} ${rx * 2},0 t${-rx * 2},0`;
    return `<g><animateMotion path="${chemin}" dur="${f(d)}s" begin="${f(-hash(i, 62) * d)}s" repeatCount="indefinite"/>`
      + `<circle r="6" fill="${D.rad([[0, '#FFF3A0', 0.6], [1, '#FFF3A0', 0]], 0, 0, 6)}">${boucle('opacity', [0.2, 1, 0.4], 1.6 + hash(i, 63), hash(i, 64) * 2)}</circle><circle r="1.1" fill="#FFF6C0"/></g>`;
  }).join('');
}
// des herbes hautes au premier plan, sombres, qui ondulent (la profondeur)
const premierPlan = (x, y, k, sens, i) => `<g>${vaVient('rotate', `-3 ${x} ${y}`, `3 ${x} ${y}`, 3.4 + i * 0.4, i)}` + [-30, -12, 0, 14, 32].map((a, j) => `<path d="M${f(x + j * 4 * sens)},${f(y)} q${f(Math.sin(a * Math.PI / 180) * 14 * k)},${f(-26 * k)} ${f(Math.sin(a * Math.PI / 180) * 30 * k)},${f(-46 * k - j * 4)}" fill="none" stroke="#12241E" stroke-width="${f(3 * k)}" stroke-linecap="round"/>`).join('') + '</g>';

// ——— les deux scènes ———
// o : { feu, coins [[clé, x, y, k]], puits [x, y], torche [x, y] ou null, gens [[nom, vue, x, y, s, m, expr]], brume
// [x, y, s, expr], lumieres, chemin, lucioles }
function village(pref, o) {
  const D = Defs(pref);
  pose = 0;
  debut(`${pref}b`);
  const [fx, fy] = o.feu;
  const chauds = x => Math.abs(x - fx) < 150;
  let s = ciel(D, 150) + lisiere(D, chauds) + sol(D, o.feu, o.chemin);
  // le village : les dessins du jeu
  for (const [key, x, y, k] of o.coins) s += poserDessin(coin(key), x, y, k);
  s += poserDessin(batiment('puits', 2), o.puits[0], o.puits[1], 0.72);
  s += poserDessin(batiment('foyer', 1), fx, fy, 0.95);
  if (o.torche) s += `<g transform="translate(${o.torche[0]} ${o.torche[1]}) scale(1.3)">${torche('allumee', 0)}</g>`;
  // des rondins pour s'asseoir autour du feu
  for (const [x, y, k] of o.rondins || []) s += poserDessin(coin('rondins'), x, y, k);
  // la nuit sur le décor, plus légère près du feu ; puis la lumière du feu qui vacille
  s += `<rect width="${W}" height="${W}" fill="${D.rad([[0, '#14204A', 0.1], [0.35, '#14204A', 0.34], [1, '#0A1232', 0.58]], fx, fy, 270)}"/>`;
  s += lumiereDuFeu(D, fx, fy - 6, 1.5);
  if (o.torche) s += `<circle cx="${o.torche[0]}" cy="${o.torche[1] - 30}" r="46" fill="${D.rad([[0, '#FFC070', 0.4], [1, '#FF9A50', 0]], o.torche[0], o.torche[1] - 30, 46)}">${boucle('opacity', [0.8, 1, 0.75], 1.2)}</circle>`;
  s += feuVivant(D, fx, fy - 10, 1.25);
  // les personnages, du fond vers nous
  const L = { ...o.lumieres, vacille: VAC };
  // les ombres au sol de tous (l'avatar compris, que le jeu pose par-dessus)
  for (const [, , x, y, k] of [...o.gens, ...(o.gensDevant || [])]) s += ombreAuSol(D, x, y, k, o.feu);
  if (o.avatar) s += ombreAuSol(D, o.avatar.x, o.avatar.y, o.avatar.echelle, o.feu);
  o.gens.forEach(([nom, vue, x, y, k, m, expr], i) => { s += vivant(T[nom], vue, x, y, k, m, `${pref}${nom.slice(0, 2)}`, L, i, expr); });
  for (const p of o.poules || []) s += p;
  // ceux du premier rang, devant les poules
  (o.gensDevant || []).forEach(([nom, vue, x, y, k, m, expr, plus], i) => { s += vivant(T[nom], vue, x, y, k, m, `${pref}${nom.slice(0, 2)}`, L, i + 3, expr, plus); });
  // Brume : elle flotte, sa lueur respire
  const [bx, by, bs, bexpr] = o.brume;
  s += `<g transform="translate(${bx} ${by})"><g>${vaVient('translate', '0 0', '0 -6', 2.8)}<circle cx="0" cy="-12" r="${f(bs * 26)}" fill="${D.rad([[0, '#E4F6FF', 0.5], [0.4, '#BFE2F6', 0.18], [1, '#BFE2F6', 0]], 0, -12, bs * 26)}">${boucle('opacity', [0.8, 1, 0.85], 3)}</circle>${brumeVive(bexpr, bs, 1, [4, 2.2])}</g></g>`;
  s += lucioles(D, o.lucioles);
  // la brume basse qui passe au ras de l'herbe, les herbes du premier plan, le bord du cadre plus sombre
  s += `<g>${defile('-60 0', '60 0', 26)}<ellipse cx="200" cy="392" rx="240" ry="16" fill="${D.rad([[0, '#9EB0D8', 0.16], [1, '#9EB0D8', 0]], 200, 392, 240)}"/></g>`;
  s += premierPlan(-4, 404, 1.2, 1, 0) + premierPlan(404, 404, 1.2, -1, 1);
  s += `<rect width="${W}" height="${W}" fill="${D.rad([[0, '#000', 0], [0.72, '#060A1E', 0.08], [1, '#060A1E', 0.42]], 200, 250, 300)}"/>`;
  return D.out(s);
}

// le calque devant : la lumière du feu et la nuit sur la place de l'avatar (le jeu le pose entre le fond et le
// devant), qui vacillent avec le feu ; dans le cadre 400 × 400
function devantAvatar(pref, a, feu) {
  const D = Defs(pref);
  const k = a.echelle, y0 = a.y - 62 * k, w = 48 * k, h = 64 * k, vers = feu[0] > a.x ? 1 : -1;
  const cxA = a.x + vers * w * 0.5, cyA = y0 + h * 0.62, cxN = a.x - vers * w * 0.4, cyN = y0 + h * 0.4;
  return `<svg width="${W}" height="${W}" viewBox="0 0 ${W} ${W}">` + D.out(`<circle cx="${f(cxN)}" cy="${f(cyN)}" r="${f(w * 0.7)}" fill="${D.rad([[0, '#14204A', 0.4], [1, '#14204A', 0]], cxN, cyN, w * 0.7)}"/>`
    + `<g>${VAC}<circle cx="${f(cxA)}" cy="${f(cyA)}" r="${f(w * 0.75)}" fill="${D.rad([[0, '#FFB868', 0.36], [1, '#FFB868', 0]], cxA, cyA, w * 0.75)}"/></g>`) + '</svg>';
}

module.exports = { village, devantAvatar, T };
