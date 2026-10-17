// L'écran de démarrage, version « survie » : une proposition à part (choix de l'auteur, 17 oct. : chibi mais rude), à
// côté de l'écran du jeu (splash.js), qui ne change pas. Le même splash, la nuit où l'île tient bon :
// - le fond : des égarés du jeu (le fantôme, le zombie, le noyé de l'Hirondelle, la racine errante, l'esprit sylvestre)
//   sortent de la brume sur la mer, autour de l'île ; les tentacules d'un kraken (la couleur de celui du Ponton) se
//   dressent derrière elle, un autre s'enroule près de l'épave ;
// - l'affiche : les sept maîtres de face, en tenue de naufragé, le regard dur ; chacun ses marques de vétéran (une
//   cicatrice recousue, un cache-œil, des griffures, un bandeau…), parfois une bandoulière ou une épaulière cloutée, et
//   une arme de fortune à la main (massue cloutée, pied-de-biche, poignard, couperet, fourche, pistolet de marine,
//   fusée de détresse).
// preview_splash_survie.js l'écrit dans design/atelier/survie/ (avec un aperçu de l'écran entier) ; rien dans public/.
const fs = require('fs');
const path = require('path');
const { fond, affiche, fixe } = require('./splash');
const { frame, OUT } = require('./troupe');
const TR = require('./troupe_refonte');
const { vernis } = require('./vernis');
const { f } = require('./scenes7').outils;

const BIB = path.join(__dirname, '..', 'bibliotheque', 'svg');
const slug = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const trait = (d, c, w, extra = '') => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"${extra}/>`;
const forme = (d, c, w = 0.7) => `<path d="${d}" fill="${c}" stroke="${OUT}" stroke-width="${w}" stroke-linejoin="round"/>`;
const rond = (x, y, r, c, w = 0.5) => `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="${c}" stroke="${OUT}" stroke-width="${w}"/>`;

// ═══ les armes ═══
// Chacune dessinée la poignée en (0, 0), dans la main ; inclinée vers le bas, elle pend sous le bras ; levée (a > 0),
// elle passe devant lui. Repère
// du kit (48 × 64). a : son inclinaison (degrés), autour de la main ; k : sa taille (pour qu'elle se lise de loin)
const ARMES = {
  // la massue : un gourdin de bois, plus épais vers le bout, des clous qui dépassent
  massue: { a: -26, k: 1.35, d: () => forme('M-1.2,-3 L1.2,-3 L2.4,8 Q4.6,19 3,23.4 Q0,25.6 -3,23.4 Q-4.6,19 -2.4,8 Z', '#B07C48')
    + trait('M1.4,6 Q3,16 1.8,22.4', '#8A5A34', 1.1) + trait('M-1.4,8 Q-2.8,16 -1.8,21.6', '#D49A62', 0.7) + trait('M-1.2,-1 L1.2,-1 M-1.3,1 L1.3,1', '#3C2819', 0.5)
    + [[-3.6, 13, -1], [3.8, 15, 1], [-3.8, 19.4, -1], [3.6, 20.6, 1], [0.4, 24.8, 0]].map(([x, y, s]) => forme(s ? `M${x},${y - 0.8} L${x + s * 2.2},${y} L${x},${y + 0.8} Z` : `M${x - 0.8},${y} L${x},${y + 2} L${x + 0.8},${y} Z`, '#C9CED6', 0.4)).join('') },
  // le pied-de-biche : une barre d'acier peinte en rouge, son crochet fendu en bas
  barre: { a: -16, k: 1.15, d: () => forme('M-0.9,-9 L0.9,-9 L0.9,17 Q1,21.4 4.2,22.2 L4,23.8 Q-0.9,23.4 -0.9,18 Z', '#B8342C', 0.6)
    + trait('M0.2,-8 L0.2,16', '#E06A5E', 0.5) + forme('M-1,-9 L1,-9 L0.6,-11.4 L-0.6,-11.4 Z', '#9AA3AE', 0.5) },
  // le poignard : un manche lacé, une garde de laiton, une lame qui luit
  poignard: { a: -14, k: 1.3, d: () => forme('M-1,-3.2 L1,-3.2 L1,3 L-1,3 Z', '#3A2A20', 0.5) + trait('M-1,-1.6 L1,-0.8 M-1,0.6 L1,1.4', '#7A5A40', 0.5)
    + forme('M-3.2,3 L3.2,3 L3.2,4.4 L-3.2,4.4 Z', '#C9A04A', 0.5) + forme('M-1.5,4.4 L1.5,4.4 L0.6,15 L0,16.6 L-0.6,15 Z', '#DCE2EA', 0.5)
    + trait('M0,5.4 L0,14.6', '#FFFFFF', 0.4, ' opacity=".8"') },
  // le couperet de cuisine : une lame large et carrée, percée en haut
  couperet: { a: -18, k: 1.3, d: () => forme('M-1,-4 L1,-4 L1,3.4 L-1,3.4 Z', '#6B4A30', 0.5) + forme('M-1.6,3 L7,3 L7.4,13.4 L-1.6,12.6 Z', '#C8D0D8', 0.6)
    + trait('M-1.4,12.4 L7.2,13.2', '#8C969F', 0.8) + rond(5.2, 5.2, 0.9, '#3A3F46', 0.3) + trait('M0,4.6 L5.4,4.6', '#FFFFFF', 0.4, ' opacity=".7"') },
  // la fourche : un long manche qui monte au-dessus de la tête, trois dents d'acier
  fourche: { a: 12, d: () => forme('M-0.8,10 L0.8,10 L0.8,-30 L-0.8,-30 Z', '#9B6B3E', 0.5)
    + forme('M-3.4,-30 L3.4,-30 Q3.6,-32 3.2,-33 L-3.2,-33 Q-3.6,-32 -3.4,-30 Z', '#7E8792', 0.5)
    + [-2.8, 0, 2.8].map(x => forme(`M${x - 0.5},-33 L${x + 0.5},-33 L${x + 0.2},-40.4 L${x},-41.2 L${x - 0.2},-40.4 Z`, '#B4BEC8', 0.4)).join('') },
  // le pistolet de marine : la crosse de bois dans la main, le canon d'acier levé, ses bagues de laiton, le chien
  pistolet: { a: 24, k: 1.7, d: () => forme('M-1.6,3.4 Q-2.6,0 -1.2,-2.4 L1.6,-2.4 Q2.4,0.4 1.4,3.6 Z', '#7A4A2A', 0.5)
    + forme('M-1.1,-2.4 L1.3,-2.4 L1.1,-15 L-0.9,-15 Z', '#7E8792', 0.5) + forme('M-1.4,-15 L1.6,-15 L1.5,-16.4 L-1.3,-16.4 Z', '#5A636C', 0.4)
    + [-6, -11].map(y => forme(`M-1.3,${y} L1.5,${y} L1.5,${y - 1} L-1.3,${y - 1} Z`, '#C9A04A', 0.3)).join('')
    + forme('M1.3,-3.6 L3.4,-5 L3.8,-4.2 L2.2,-2.6 Z', '#3D3A36', 0.4) },
  // la fusée de détresse : un pistolet orange levé, la fusée qui flambe au bout du canon
  fusee: { a: 18, k: 1.55, d: () => `<circle cx="0" cy="-17" r="9" fill="url(#svFlamme)"/>`
    + forme('M-1.8,3.6 Q-2.6,0.4 -1.4,-2.4 L1.8,-2.4 Q2.6,0.6 1.6,3.8 Z', '#E8762C', 0.5) + forme('M-2,-2.4 L2.2,-2.4 L2,-13 L-1.8,-13 Z', '#F0913C', 0.5)
    + forme('M-2.4,-13 L2.6,-13 L2.4,-14.6 L-2.2,-14.6 Z', '#C2561E', 0.4) + rond(0.1, -16.4, 1.6, '#FFF2C8', 0.3)
    + [[-2.6, -20, 0.7], [2.4, -21.4, 0.6], [0.4, -23.4, 0.5], [-1.4, -24.6, 0.4]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#FFE08A"/>`).join('') }
};
const arme = (nom, flip) => (cc, h) => {
  const A = ARMES[nom], k = A.k || 1;
  return `<g transform="translate(${f(h[0])} ${f(h[1])}) rotate(${f(flip ? -A.a : A.a)}) scale(${f(flip ? -k : k)} ${f(k)})">${A.d()}</g>`;
};

// ═══ les marques de vétéran ═══
// Sur le visage de face : ses yeux en (19,4, ey) et (28,6, ey) (troupe_refonte.js, YEUX : la hauteur des yeux de chaque
// tête refondue) ; le buste, plus bas d'autant que la tête (dy)
const PEAU_CIC = '#C46A5E';
const couture = (x0, y0, x1, y1, n) => {
  const dx = x1 - x0, dy = y1 - y0, l = Math.hypot(dx, dy), nx = -dy / l, ny = dx / l;
  return trait(`M${f(x0)},${f(y0)} L${f(x1)},${f(y1)}`, PEAU_CIC, 0.8) + [...Array(n).keys()].map(i => {
    const t = (i + 1) / (n + 1), x = x0 + dx * t, y = y0 + dy * t;
    return trait(`M${f(x - nx * 0.9)},${f(y - ny * 0.9)} L${f(x + nx * 0.9)},${f(y + ny * 0.9)}`, '#7A3A34', 0.35);
  }).join('');
};
const MARQUES = {
  // une cicatrice recousue qui coupe le sourcil
  sourcil: ey => couture(17.6, ey - 6.4, 19.2, ey - 2.6, 2) + couture(19.9, ey + 2.2, 20.7, ey + 4.6, 1),
  // une balafre recousue sur la joue
  joue: ey => couture(27.6, ey + 2.6, 31.4, ey + 6.2, 3),
  // un cache-œil de cuir, sa lanière en travers du front
  'cache-oeil': ey => trait(`M14.6,${f(ey - 3.4)} Q24,${f(ey - 7.6)} 33.6,${f(ey - 4.6)}`, '#2A1C18', 0.7)
    + `<ellipse cx="19.4" cy="${f(ey + 0.2)}" rx="2.7" ry="2.5" fill="#2A1C18" stroke="${OUT}" stroke-width="0.5"/>` + trait(`M18.2,${f(ey - 1)} Q19.4,${f(ey - 1.6)} 20.6,${f(ey - 1)}`, '#5A4A44', 0.4),
  // trois griffures sur la joue
  griffures: ey => [0, 1.3, 2.6].map(d => trait(`M${f(15.8 + d)},${f(ey + 2.2 + d * 0.3)} L${f(17.6 + d)},${f(ey + 5.4 + d * 0.3)}`, PEAU_CIC, 0.55)).join(''),
  // un bandeau de toile autour du front, une tache de sang qui a séché
  bandeau: ey => forme(`M14.4,${f(ey - 7.4)} Q24,${f(ey - 10.6)} 33.6,${f(ey - 7.4)} L33.6,${f(ey - 5.2)} Q24,${f(ey - 8.4)} 14.4,${f(ey - 5.2)} Z`, '#E8DCC0', 0.5)
    + `<ellipse cx="29.8" cy="${f(ey - 6.8)}" rx="1.3" ry="0.9" fill="#A8443C" opacity=".85"/>` + trait(`M33.4,${f(ey - 6.4)} l2.6,2.2 M33.4,${f(ey - 6.2)} l1.6,3`, '#E8DCC0', 0.8),
  // un pansement en croix sur le nez
  nez: ey => forme(`M22.2,${f(ey + 1.6)} L25.8,${f(ey + 0.6)} L26.2,${f(ey + 1.8)} L22.6,${f(ey + 2.8)} Z`, '#F0D6B0', 0.4)
    + forme(`M23.4,${f(ey + 0.2)} L24.6,${f(ey - 0.1)} L25,${f(ey + 3.2)} L23.8,${f(ey + 3.5)} Z`, '#F0D6B0', 0.4),
  // une petite cicatrice au menton
  menton: ey => couture(25.4, ey + 7.6, 27.4, ey + 9.4, 2)
};
const EQUIPEMENT = {
  // une bandoulière de cuir en travers du buste, ses cartouches de laiton
  bandouliere: dy => trait(`M16.6,${f(35.6 + dy)} L31.4,${f(50 + dy)}`, '#3C2819', 3) + trait(`M16.6,${f(35.6 + dy)} L31.4,${f(50 + dy)}`, '#6A4630', 2.2)
    + [0.2, 0.36, 0.52, 0.68, 0.84].map(t => { const x = 16.6 + 14.8 * t, y = 35.6 + 14.4 * t + dy; return `<rect x="${f(x - 0.6)}" y="${f(y - 1.4)}" width="1.2" height="1.8" rx="0.3" fill="#D8AE4E" stroke="${OUT}" stroke-width="0.3" transform="rotate(44 ${f(x)} ${f(y)})"/>`; }).join(''),
  // une épaulière de cuir cloutée sur l'épaule gauche (à l'écran)
  epauliere: dy => forme(`M11.4,${f(37.4 + dy)} Q13.6,${f(33 + dy)} 18.6,${f(34 + dy)} L18.8,${f(37.4 + dy)} Q14.8,${f(37 + dy)} 12.4,${f(40 + dy)} Z`, '#5A3A26', 0.6)
    + [[13.4, 36.6], [15.4, 35.2], [17.4, 35.4]].map(([x, y]) => rond(x, y + dy, 0.55, '#C9CED6', 0.3)).join('')
};

// ═══ les survivants ═══
// Un maître de face, en tenue de naufragé, au repos (la 1re image), dans son expression, avec ses marques, son
// équipement et son arme ; prefixe : ses identifiants. (qui, pose, expr : comme splash.js ; o : { arme, marques, equipement })
const YEUX = { lorena: 22.7, agathe: 22.8, nathan: 22.6, leo: 27.7, maerys: 22.8, robby: 26.7, maggy: 22.8 };
function dessinSurvivant(qui, pose, expr, prefixe, o = {}) {
  const i = TR.MAITRES.findIndex(m => slug(m.name) === qui);
  const c = TR.CAST_REFONTE[i].nau, ey = YEUX[TR.MAITRES[i].refonte], dy = ey - 22.7;
  const tient = o.arme ? { ...c, hold: arme(o.arme), holdOver: ARMES[o.arme].a > 0 } : c;
  const corps = frame(tient, 'front', 'repos', 0, expr)
    + (o.equipement || []).map(e => EQUIPEMENT[e](dy)).join('') + (o.marques || []).map(m => MARQUES[m](ey)).join('');
  return corps.replace(/id="([^"]+)"/g, `id="${prefixe}$1"`).replace(/url\(#([^)]+)\)/g, `url(#${prefixe}$1)`).replace(/href="#([^"]+)"/g, `href="#${prefixe}$1"`);
}
// La troupe de la survie : les places de l'affiche du jeu (splash.js, TROUPE), tous de face ; chacun son regard, ses
// marques, son arme (deux voisins jamais le même regard)
const TROUPE_SURVIE = [
  [['ondin', 'face_repos', 'colere', { arme: 'barre', marques: ['nez'], equipement: ['bandouliere'] }], 112, 640, 4, 0.4, 0.4],
  [['sylve', 'face_repos', 'ironique', { arme: 'poignard', marques: ['griffures'] }], 268, 610, 3.8, 0.42, 1.3],
  [['cannelle', 'face_repos', 'mefiante', { arme: 'couperet', marques: ['bandeau'] }], 640, 600, 3.6, 0.42, 2.1],
  [['galet', 'face_repos', 'mefiante', { arme: 'massue', marques: ['cache-oeil'], equipement: ['epauliere'] }], 250, 790, 5.2, 0.2, 0.8],
  [['melisse', 'face_repos', 'decidee', { arme: 'fourche', marques: ['menton'] }], 655, 790, 5.2, 0.2, 1.7],
  [['aster', 'face_repos', 'decidee', { arme: 'fusee', marques: ['sourcil'], equipement: ['bandouliere'] }], 158, 995, 6.4, 0, 2.6],
  [['rivet', 'face_repos', 'ironique', { arme: 'pistolet', marques: ['joue'], equipement: ['epauliere'] }], 744, 995, 6.4, 0, 0.2]
];
// la flamme de la fusée : ses dégradés, une fois pour toute l'affiche
const DEFS_AFFICHE = '<defs><radialGradient id="svFlamme"><stop offset="0" stop-color="#FFF4C8"/><stop offset=".25" stop-color="#FF8A3A" stop-opacity=".9"/>'
  + '<stop offset=".6" stop-color="#E8402C" stop-opacity=".35"/><stop offset="1" stop-color="#E8402C" stop-opacity="0"/></radialGradient></defs>';
const afficheSurvie = () => affiche(TROUPE_SURVIE, dessinSurvivant).replace(/(<svg[^>]*>)/, `$1${DEFS_AFFICHE}`);

// ═══ le fond : la nuit des égarés ═══
// Un dessin de la bibliothèque posé : son ancrage (le sol) en (x, y), à l'échelle k, verni comme l'île (vernis.js) ;
// miroir : tourné vers la gauche ; voile : son opacité
function poser(rel, prefixe, x, y, k, { miroir = false, voile = 1 } = {}) {
  const src = fs.readFileSync(path.join(BIB, rel), 'utf8');
  const box = src.match(/viewBox="([^"]+)"/)[1].split(/\s+/).map(Number);
  const corps = src.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '')
    .replace(/id="([^"]+)"/g, `id="${prefixe}$1"`).replace(/url\(#([^)]+)\)/g, `url(#${prefixe}$1)`).replace(/href="#([^"]+)"/g, `href="#${prefixe}$1"`);
  return `<g transform="translate(${f(x)} ${f(y)}) scale(${f(miroir ? -k : k)} ${f(k)})" opacity="${f(voile)}">${vernis(corps, `${prefixe}v`, box, { cote: miroir ? 1 : -1, nuit: 0.24 })}</g>`;
}
// Les égarés, à demi sortis de la brume sur la mer, de chaque côté de l'île, entre elle et les tentacules (ils flottent :
// leur pied se perd dans la brume du large) : [qui, x, y, échelle, miroir, voile]
const EGARES = [['fantome', 640, 452, 1.5, false, 0.95], ['noye-de-l-hirondelle', 600, 470, 1.1, false, 0.8], ['zombie', 688, 470, 1.15, false, 0.88],
  ['esprit-sylvestre', 962, 452, 1.45, true, 0.95], ['racine-errante', 1000, 474, 1.15, true, 0.85], ['zombie', 912, 474, 1.05, true, 0.8]];
const egares = () => EGARES.map(([qui, x, y, k, miroir, voile], i) => poser(`egares/${qui}/${qui}_avant_brume_1.svg`, `sve${i}`, x, y, k, { miroir, voile })).join('');

// Un tentacule du kraken (la couleur de celui du Ponton) : il sort de l'eau en (x, y) et monte, sa pointe s'enroule
// (cote : 1 vers la droite, -1 vers la gauche) ; long : sa longueur, large : son épaisseur à la base. Son contour, son
// ventre clair et ses ventouses du côté intérieur, un liseré de lune sur le dos ; l'écume à son pied
const KRAKEN = { dos: '#8E5BB8', ombre: '#5E3A84', ventre: '#C9A2E6', ventouse: '#D6B8F0', bord: '#2A1A3E' };
function tentacule(id, x, y, cote, long, large, enroule = 1) {
  const N = 64, pts = [];
  let px = x, py = y;
  for (let i = 0; i <= N; i++) {
    const u = i / N, th = -Math.PI / 2 + cote * (0.25 * u + 3.4 * enroule * u ** 3);
    pts.push([px, py, th, large * (1 - u) ** 0.85 + 1.2]);
    px += Math.cos(th) * long / N; py += Math.sin(th) * long / N;
  }
  const bord = s => pts.map(([px2, py2, th, w]) => [px2 + Math.cos(th + s * Math.PI / 2) * w / 2, py2 + Math.sin(th + s * Math.PI / 2) * w / 2]);
  const g = bord(-1), d = bord(1), [tx, ty] = pts[N];
  const contour = `M${g.map(([a, b]) => `${f(a)},${f(b)}`).join(' L')} L${f(tx)},${f(ty)} L${d.reverse().map(([a, b]) => `${f(a)},${f(b)}`).join(' L')} Z`;
  // le ventre : la moitié du côté intérieur de la courbe
  const ventre = `M${pts.map(([a, b]) => `${f(a)},${f(b)}`).join(' L')} L${bord(cote).reverse().map(([a, b]) => `${f(a)},${f(b)}`).join(' L')} Z`;
  const ventouses = pts.filter((p, i) => i > 3 && i < N - 6 && i % 4 === 0).map(([a, b, th, w]) => {
    const vx = a + Math.cos(th + cote * Math.PI / 2) * w * 0.26, vy = b + Math.sin(th + cote * Math.PI / 2) * w * 0.26, r = Math.max(0.9, w * 0.17);
    return `<ellipse cx="${f(vx)}" cy="${f(vy)}" rx="${f(r)}" ry="${f(r * 0.8)}" fill="${KRAKEN.ventouse}" stroke="${KRAKEN.bord}" stroke-width="0.8" transform="rotate(${f(th * 180 / Math.PI)} ${f(vx)} ${f(vy)})"/>`
      + `<circle cx="${f(vx)}" cy="${f(vy)}" r="${f(r * 0.4)}" fill="${KRAKEN.ombre}"/>`;
  }).join('');
  const dos = bord(-cote).map(([a, b]) => `${f(a)},${f(b)}`).join(' L');
  return `<defs><linearGradient id="${id}G" gradientUnits="userSpaceOnUse" x1="${f(x)}" y1="${f(y)}" x2="${f(x)}" y2="${f(y - long * 0.8)}"><stop offset="0" stop-color="${KRAKEN.ombre}"/><stop offset="1" stop-color="${KRAKEN.dos}"/></linearGradient></defs>`
    + `<path d="${contour}" fill="url(#${id}G)" stroke="${KRAKEN.bord}" stroke-width="2.4" stroke-linejoin="round"/>`
    + `<path d="${ventre}" fill="${KRAKEN.ventre}" opacity=".55"/>` + ventouses
    + `<path d="M${dos}" fill="none" stroke="#E6D4FF" stroke-width="1.4" stroke-linecap="round" opacity=".5"/>`
    + [[-1, 0.9], [0.4, 1.2], [1.3, 0.7]].map(([dx, k]) => `<ellipse cx="${f(x + dx * large * 0.7)}" cy="${f(y + 2)}" rx="${f(large * 0.5 * k)}" ry="${f(large * 0.12 * k)}" fill="#E8F6FF" opacity=".55"/>`).join('');
}
// Derrière l'île : les égarés et deux grands tentacules ; devant elle : un tentacule près de l'épave, un autre au pied
// du Ponton
const fondSurvie = () => fixe(fond({
  avantIle: tentacule('svk1', 586, 470, 1, 230, 30) + tentacule('svk2', 1016, 472, -1, 250, 32) + egares(),
  apresIle: tentacule('svk3', 600, 592, 1, 92, 14, 1.2) + tentacule('svk4', 1004, 586, -1, 78, 12, 1.3)
}));

module.exports = { fondSurvie, afficheSurvie, dessinSurvivant, TROUPE_SURVIE, ARMES, MARQUES, EQUIPEMENT };
