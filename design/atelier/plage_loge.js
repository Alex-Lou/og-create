// La plage de Brumelune, la nuit, sous la pluie : le fond de l'éditeur de l'avatar (choix de l'auteur, 15 oct. : « un
// background d'île pluvieuse, avec palmiers, sable, nuit, un peu de pluie, lune, jeux de lumières »). Le joueur vient
// de s'échouer : ses pas montent de la mer jusqu'à lui ; une lanterne rescapée du naufrage, posée sur le sable, le
// chauffe de face ; la lune, à gauche, le découpe en froid.
//
// Une scène de 360 × 360 (unités de la scène), les pieds de l'avatar en (180, 308), posée en cover depuis le bas : au
// téléphone, toute la largeur ; à la tablette (écran haut), toute la hauteur et le milieu (x 60 à 300). Elle est faite
// de calques, chacun à sa place dans la scène (zones.place : x, y, largeur, hauteur), pour que le jeu anime ce qui
// bouge en CSS, sans redessiner : les nuages qui passent (une bande qui boucle), l'éclat de la lune sur la mer (deux
// tirages qui alternent), le flot qui monte et redescend, les palmes qui se balancent, la lanterne, la brume, l'éclair.
// La pluie, elle, tombe dans le jeu (un canvas) : zones.flaques (les flaques où elle fait des ronds).
// Pas de filtre SVG : des dégradés seulement (le moindre filtre coûte cher au téléphone).
const r2 = n => Math.round(n * 100) / 100;
// un hasard figé (le même dessin à chaque tirage)
const h = (a, b = 0) => { const v = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return v - Math.floor(v); };
const pts = a => a.map(([x, y]) => `${r2(x)},${r2(y)}`).join(' ');
const path = (d, fill, extra = '') => `<path d="${d}" fill="${fill}"${extra}/>`;
const poly = (a, fill, extra = '') => `<polygon points="${pts(a)}" fill="${fill}"${extra}/>`;
const ell = (cx, cy, rx, ry, fill, extra = '') => `<ellipse cx="${r2(cx)}" cy="${r2(cy)}" rx="${r2(rx)}" ry="${r2(ry)}" fill="${fill}"${extra}/>`;
const lin = (id, x1, y1, x2, y2, stops) => `<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${stops.map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join('')}</linearGradient>`;
const rad = (id, stops, extra = '') => `<radialGradient id="${id}"${extra}>${stops.map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join('')}</radialGradient>`;
const ink = (w) => ` stroke="${ENCRE}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
const trait = (d, c, w, a = 1) => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"${a < 1 ? ` stroke-opacity="${a}"` : ''}/>`;

// L'encre de la nuit (les contours des choses proches, comme ceux du personnage, en plus doux)
const ENCRE = '#141626';
// Les couleurs de la nuit : le ciel, la mer, le sable mouillé, la lune
const CIEL = ['#070B22', '#121C44', '#24366A', '#40578A'];
const LUNE = '#F6F3E6', LUNE_F = '#C9D8FF';
const MER = ['#22335F', '#1A2850', '#121D3E'];
const SABLE = { mouille: '#3C4870', clair: '#8A8096', sec: '#6A6280', fonce: '#3A3450' };
const VERT = { fonce: '#14242A', corps: '#1F3A38', clair: '#36605A', lune: '#9CC0C4' };
const TRONC = { lune: '#7C7A92', corps: '#4D4A60', ombre: '#2A2738', bague: '#1C1A28' };

// Les points fixes de la scène (en unités de la scène)
const PIEDS = [180, 308];
const HORIZON = 196, RIVAGE = 230;
const LUNE_XY = [70, 54];
const LANTERNE = [236, 320];
// Le panorama : la scène se prolonge des deux côtés (l'écran couché en montre davantage), et le sable descend sous la
// feuille des choix jusqu'à BAS (au téléphone, la page n'en fait qu'une : la plage continue sous elle)
const X0 = -160, X1 = 600, LARGE = X1 - X0, BAS = 640;
// Les flaques (cx, cy, rx, ry) : le sable les dessine, la pluie y fait des ronds
const FLAQUES = [[112, 282, 20, 4.2], [296, 330, 26, 5], [58, 338, 18, 3.8], [214, 266, 12, 2.6]];

// ——— le ciel, la lune, la mer au loin ———
function ciel() {
  const [lx, ly] = LUNE_XY;
  let d = lin('pcC', 0, 0, 0, 1, [[0, CIEL[0]], [0.35, CIEL[1]], [0.78, CIEL[2]], [1, CIEL[3]]])
    + rad('pcH', [[0, '#DCE6FF', 0.55], [0.18, '#B9C9F0', 0.32], [0.55, '#7D93C8', 0.12], [1, '#7D93C8', 0]], ` cx="${lx}" cy="${ly}" r="120" gradientUnits="userSpaceOnUse"`)
    + rad('pcL', [[0, '#FFFFFF'], [0.7, LUNE], [1, '#DCD8C8']], ` cx="${lx - 4}" cy="${ly - 4}" r="16" gradientUnits="userSpaceOnUse"`)
    + lin('pcM', 0, 0, 0, 1, [[0, MER[0]], [0.5, MER[1]], [1, MER[2]]])
    + lin('pcB', 0, 0, 0, 1, [[0, '#8FA4D2', 0], [0.5, '#8FA4D2', 0.32], [1, '#8FA4D2', 0]]);
  let s = `<defs>${d}</defs><rect x="${X0}" width="${LARGE}" height="${HORIZON + 1}" fill="url(#pcC)"/>`;
  // les étoiles, dans les trouées (moins près de la lune, qui les mange)
  for (let i = 0; i < 86; i++) {
    const x = X0 + h(i, 1) * LARGE, y = 6 + h(i, 2) * h(i, 2) * 150;
    if (Math.hypot(x - lx, y - ly) < 46) continue;
    const a = 0.25 + 0.6 * h(i, 3), r = 0.35 + 0.55 * h(i, 4);
    s += `<circle cx="${r2(x)}" cy="${r2(y)}" r="${r2(r)}" fill="#E8EEFF" opacity="${r2(a * (1 - y / 190))}"/>`;
    if (h(i, 5) > 0.9) s += trait(`M${r2(x - 2.6)},${r2(y)} L${r2(x + 2.6)},${r2(y)} M${r2(x)},${r2(y - 2.6)} L${r2(x)},${r2(y + 2.6)}`, '#E8EEFF', 0.35, 0.5);
  }
  // le halo de la lune dans l'air mouillé, son anneau (le halo des nuits de pluie), la lune et ses mers
  s += `<rect x="${X0}" width="${LARGE}" height="${HORIZON + 1}" fill="url(#pcH)"/>`;
  s += `<circle cx="${lx}" cy="${ly}" r="44" fill="none" stroke="#C8D6FF" stroke-width="2.4" opacity=".07"/>`;
  s += `<circle cx="${lx}" cy="${ly}" r="13.5" fill="url(#pcL)"/>`;
  s += ell(lx - 4, ly - 2, 4.2, 3, '#D6D3C6', ' opacity=".55"') + ell(lx + 4.5, ly + 3.5, 3, 2.2, '#D6D3C6', ' opacity=".45"') + ell(lx + 2, ly - 6, 2, 1.4, '#D6D3C6', ' opacity=".4"');
  s += `<circle cx="${lx}" cy="${ly}" r="13.5" fill="none" stroke="#FFFFFF" stroke-width=".6" opacity=".6"/>`;
  // les grands nuages de pluie, immobiles : une masse sombre en haut, ourlée de lune du côté de la lune
  s += rayons();
  s += nuage(268, 30, 230, 46, 'pcn1', 3) + nuage(196, 6, 150, 30, 'pcn5', 9, 0.9) + nuage(-10, 16, 120, 34, 'pcn2', 5) + nuage(178, 128, 96, 18, 'pcn3', 7, 0.75) + nuage(338, 150, 90, 16, 'pcn4', 11, 0.7)
    + nuage(-96, 40, 150, 40, 'pcn6', 13) + nuage(-40, 140, 90, 16, 'pcn7', 15, 0.7) + nuage(470, 22, 170, 44, 'pcn8', 17) + nuage(452, 126, 100, 18, 'pcn9', 19, 0.75);
  // la mer : son bleu, la pluie qui la grêle de petits traits, la brume posée sur l'horizon
  s += `<rect x="${X0}" y="${HORIZON}" width="${LARGE}" height="${RIVAGE - HORIZON + 6}" fill="url(#pcM)"/>`;
  for (let i = 0; i < 260; i++) {
    const t = h(i, 7), y = HORIZON + 2 + t * t * (RIVAGE - HORIZON - 2), x = X0 + h(i, 8) * LARGE, w = 1.5 + 5 * t;
    s += trait(`M${r2(x)},${r2(y)} L${r2(x + w)},${r2(y)}`, h(i, 9) > 0.5 ? '#3E5690' : '#0E1734', 0.5 + 0.6 * t, 0.7);
  }
  // les rangs de houle : des crêtes qui prennent la lune, plus larges vers le rivage
  for (let i = 0; i < 30; i++) {
    const t = h(i, 51), y = HORIZON + 5 + t * (RIVAGE - HORIZON - 10), x = X0 + h(i, 52) * (LARGE - 20), w = 10 + 30 * t;
    s += trait(`M${r2(x)},${r2(y + 1)} Q${r2(x + w / 2)},${r2(y - 1.2 - t)} ${r2(x + w)},${r2(y + 1)}`, '#7F95C8', 0.6 + 0.6 * t, r2(0.35 + 0.3 * (1 - Math.abs(x - LUNE_XY[0]) / 360)));
  }
  // l'îlot au loin, ses deux palmiers, sur l'horizon
  s += path(`M232,${HORIZON + 0.5} Q246,${HORIZON - 7} 262,${HORIZON - 8} Q284,${HORIZON - 14} 300,${HORIZON - 9} Q318,${HORIZON - 6} 336,${HORIZON + 0.5} Z`, '#0E1430');
  s += palmierLoin(266, HORIZON - 9, 1) + palmierLoin(290, HORIZON - 12, -1);
  s += path(`M232,${HORIZON + 0.6} L336,${HORIZON + 0.6}`, 'none', ' stroke="#2B3D6E" stroke-width=".8"');
  // (au loin, à gauche, une autre terre, plus basse, dans la brume)
  s += path(`M-150,${HORIZON + 0.5} Q-120,${HORIZON - 5} -86,${HORIZON - 4} Q-60,${HORIZON - 7} -30,${HORIZON + 0.5} Z`, '#141B3A');
  s += `<rect x="${X0}" y="${HORIZON - 12}" width="${LARGE}" height="22" fill="url(#pcB)"/>`;
  return s;
}
// Les rayons de la lune, qui passent entre les nuages et tombent sur la mer : des pans de lumière très pâles
function rayons() {
  const [lx, ly] = LUNE_XY;
  let s = `<defs>${lin('pcR', 0, 0, 0, 1, [[0, '#C8D6FF', 0.075], [1, '#C8D6FF', 0]])}</defs>`;
  for (const [a, w] of [[58, 14], [76, 8], [94, 16]]) {
    const r = (a * Math.PI) / 180, ex = lx + Math.cos(r) * 190, ey = ly + Math.sin(r) * 190, nx = -Math.sin(r), ny = Math.cos(r);
    s += poly([[lx + nx * 2, ly + ny * 2], [lx - nx * 2, ly - ny * 2], [ex - nx * w * 2, ey - ny * w * 2], [ex + nx * w * 2, ey + ny * w * 2]], 'url(#pcR)');
  }
  return s;
}
// Un palmier tout petit, au loin, en ombre chinoise
function palmierLoin(x, y, m) {
  const top = [x + 3 * m, y - 15];
  let s = trait(`M${x},${y} Q${x + 0.5 * m},${y - 8} ${top[0]},${top[1]}`, '#0E1430', 1.1);
  for (const [a, l] of [[-150, 7], [-120, 6], [-60, 6], [-30, 7], [-95, 5], [10, 5], [170, 5]]) {
    const r = (a * Math.PI) / 180, ex = top[0] + Math.cos(r) * l, ey = top[1] + Math.sin(r) * l * 0.6 + 2.4;
    s += trait(`M${top[0]},${top[1]} Q${r2((top[0] + ex) / 2)},${r2(top[1] - 1.6)} ${r2(ex)},${r2(ey)}`, '#0E1430', 0.9);
  }
  return s;
}
// Un nuage de pluie : des bosses en grappe (un dessous bosselé, pas plat), le ventre sombre, le dessus pris par la lune
// (côté gauche) ; un voile un peu plus grand derrière lui adoucit son bord. (x, y) : le milieu de sa base ; w, ht : sa
// largeur et sa hauteur
function nuage(x, y, w, ht, id, graine, a = 1) {
  const c = [];
  const n = Math.max(4, Math.round(w / 13));
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1), bosse = Math.sin(Math.PI * (0.08 + 0.84 * t));
    const r = ht * (0.32 + 0.42 * bosse) * (0.75 + 0.5 * h(i, graine));
    c.push([x - w / 2 + t * w + (h(i, graine + 1) - 0.5) * 8, y - r * 0.55 - ht * 0.18 * bosse, r]);
  }
  for (let i = 0; i < n + 1; i++) c.push([x - w / 2 + 6 + (i / n) * (w - 12), y - ht * 0.06 + h(i, graine + 2) * 2, ht * (0.2 + 0.1 * h(i, graine + 3))]);
  const corps = c.map(([cx, cy, r]) => `<circle cx="${r2(cx)}" cy="${r2(cy)}" r="${r2(r)}"/>`).join('');
  let s = `<defs>${lin(id, 0, 0, 0, 1, [[0, '#46598C'], [0.45, '#2A3965'], [1, '#141C3C']])}<clipPath id="${id}c">${corps}</clipPath></defs>`;
  s += `<g fill="#5A6EA2" opacity="${r2(0.16 * a)}" transform="translate(${r2(x)} ${r2(y)}) scale(1.06 1.1) translate(${r2(-x)} ${r2(-y)})">${corps}</g>`;
  s += `<g opacity="${a}"><g fill="url(#${id})">${corps}</g>`;
  s += `<g clip-path="url(#${id}c)"><g fill="#B4C4EC" opacity=".7">${corps}</g><g fill="url(#${id})" transform="translate(2.4 3.2)">${corps}</g>`;
  return s + '</g></g>';
}

// ——— les nuages qui passent : une bande de 1440 de large qui boucle (le dessin se répète tous les 360) ———
function nuages() {
  let s = `<defs>${lin('pnN', 0, 0, 0, 1, [[0, '#4A5C8C', 0.85], [1, '#1E2A4E', 0.85]])}</defs>`;
  const un = (x0) => {
    let t = '';
    for (const [x, y, w, k] of [[40, 64, 70, 1], [150, 30, 54, 0.8], [250, 86, 80, 1.1], [330, 44, 40, 0.7]]) {
      // une traîne effilée, plus claire dessus
      const X = x0 + x;
      t += path(`M${r2(X - w)},${y} Q${r2(X - w * 0.5)},${r2(y - 9 * k)} ${r2(X)},${r2(y - 7 * k)} Q${r2(X + w * 0.4)},${r2(y - 12 * k)} ${r2(X + w)},${y} Q${r2(X)},${r2(y + 5 * k)} ${r2(X - w)},${y} Z`, 'url(#pnN)');
      t += trait(`M${r2(X - w * 0.8)},${r2(y - 2)} Q${r2(X - w * 0.4)},${r2(y - 8 * k)} ${r2(X + w * 0.1)},${r2(y - 7 * k)}`, '#A9BBE4', 0.8, 0.45);
    }
    return t;
  };
  return s + un(0) + un(360) + un(720) + un(1080);
}

// ——— l'éclat de la lune sur la mer : une colonne de traits qui s'évase vers le rivage ; deux tirages qui alternent ———
function eclat(tirage) {
  const [lx] = LUNE_XY;
  let s = '';
  for (let i = 0; i < 46; i++) {
    const t = i / 45, y = 2 + t * (RIVAGE - HORIZON - 4);
    if (h(i, tirage + 3) < 0.28) continue;
    const large = 6 + 34 * t, x = lx - large / 2 + h(i, tirage) * large * 0.6, w = 2 + 10 * t * h(i, tirage + 5);
    const a = 0.85 - 0.45 * t;
    s += trait(`M${r2(x)},${r2(y)} L${r2(x + w)},${r2(y)}`, i % 5 ? '#DCE6FF' : '#FFFFFF', 0.6 + 0.9 * t, r2(a));
  }
  return s;
}

// ——— le flot : l'écume qui monte sur le sable puis redescend (le jeu l'anime) ———
function flot() {
  const ondule = (y, a) => { let d = `M-4,${y}`; for (let x = 0; x <= LARGE + 4; x += 12) d += ` Q${x + 6},${r2(y - a - h(x, y) * a)} ${x + 12},${y}`; return d; };
  let s = `<defs>${lin('pfE', 0, 0, 0, 1, [[0, '#DCE6FA', 0.9], [0.4, '#9CB0DA', 0.45], [1, '#5E6E9E', 0]])}</defs>`;
  s += path(`${ondule(8, 2.4)} L${LARGE + 4},30 L-4,30 Z`, 'url(#pfE)');
  s += trait(ondule(8, 2.4), '#F2F6FF', 1.2, 0.85);
  // la dentelle d'écume : des petits trous, des bulles
  for (let i = 0; i < 76; i++) s += ell(h(i, 11) * LARGE, 11 + h(i, 12) * 8, 1.2 + 2.4 * h(i, 13), 0.5 + 0.6 * h(i, 14), '#F2F6FF', ` opacity="${r2(0.25 + 0.4 * h(i, 15))}"`);
  return s;
}

// ——— le sable : le rivage mouillé, la plage, la dune et son palmier, les restes du naufrage, les pas ———
function sol() {
  const [px, py] = PIEDS;
  let d = lin('psM', 0, 0, 0, 1, [[0, '#5B6890'], [1, SABLE.mouille]])
    + `<linearGradient id="psS" x1="0" y1="${RIVAGE}" x2="0" y2="${BAS}" gradientUnits="userSpaceOnUse">${[[0, SABLE.mouille], [0.08, SABLE.clair], [0.3, SABLE.sec], [0.4, SABLE.fonce], [0.7, '#24203A'], [1, '#141224']].map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join('')}</linearGradient>`
    + lin('psR', 0, 0, 0, 1, [[0, '#E4ECFF', 0.55], [1, '#E4ECFF', 0]])
    + lin('psD', 0, 0, 1, 1, [[0, '#8A8296'], [1, '#4A4258']])
    + lin('psF', 0, 0, 0, 1, [[0, '#2C3D6C'], [1, '#1A2448']])
    + lin('psT', 0, 0, 1, 0, [[0, TRONC.lune], [0.35, TRONC.corps], [1, TRONC.ombre]])
    + rad('psO', [[0, '#120E1C', 0.5], [1, '#120E1C', 0]]);
  let s = `<defs>${d}</defs>`;
  // le sable mouillé du rivage, qui renvoie le ciel, et la lune dedans (une traînée sous la colonne de la mer)
  s += `<rect x="${X0}" y="${RIVAGE}" width="${LARGE}" height="40" fill="url(#psM)"/>`;
  s += path(`M${LUNE_XY[0] - 10},${RIVAGE} L${LUNE_XY[0] + 10},${RIVAGE} L${LUNE_XY[0] + 22},${RIVAGE + 38} L${LUNE_XY[0] - 18},${RIVAGE + 38} Z`, 'url(#psR)', ' opacity=".55"');
  // la plage, qui monte du sable mouillé (un bord ondulé) jusqu'au devant
  let bord = `M${X0 - 4},${RIVAGE + 16}`;
  for (let x = X0; x <= X1 + 4; x += 20) bord += ` Q${x + 10},${r2(RIVAGE + 12 + h(x, 3) * 6)} ${x + 20},${r2(RIVAGE + 15 + h(x, 4) * 4)}`;
  s += path(`${bord} L${X1 + 24},${BAS} L${X0 - 4},${BAS} Z`, 'url(#psS)');
  // le grain du sable, les rides du vent, de petits coquillages qui prennent la lune
  for (let i = 0; i < 520; i++) {
    const t = h(i, 21), x = X0 + h(i, 22) * LARGE, y = RIVAGE + 18 + t * (BAS - 60 - RIVAGE - 18);
    s += `<circle cx="${r2(x)}" cy="${r2(y)}" r="${r2(0.3 + 0.5 * t)}" fill="${h(i, 23) > 0.5 ? '#9A90A6' : '#3E384C'}" opacity=".55"/>`;
  }
  for (let i = 0; i < 40; i++) {
    const x = X0 + h(i, 31) * (LARGE - 20), y = RIVAGE + 26 + h(i, 32) * 220, w = 14 + 18 * h(i, 33);
    s += trait(`M${r2(x)},${r2(y)} Q${r2(x + w / 2)},${r2(y - 2)} ${r2(x + w)},${r2(y)}`, '#857C92', 0.6, 0.5);
  }
  for (const [x, y, r] of [[148, 264, 1.6], [92, 316, 1.9], [318, 300, 1.5], [36, 290, 1.4]]) {
    s += ell(x, y, r * 1.3, r * 0.8, '#B9AFC2', ink(0.5)) + trait(`M${x - r * 0.6},${y} L${x + r * 0.6},${y - r * 0.4}`, ENCRE, 0.35, 0.6) + `<circle cx="${x - r * 0.5}" cy="${y - r * 0.4}" r=".45" fill="#FFFFFF"/>`;
  }
  // les flaques : le ciel dedans, un bord de sable plus sombre, la lune qui y tremble
  FLAQUES.forEach(([cx, cy, rx, ry], i) => {
    s += ell(cx, cy + 0.8, rx + 1.6, ry + 1, SABLE.fonce, ' opacity=".7"') + ell(cx, cy, rx, ry, 'url(#psF)');
    s += trait(`M${r2(cx - rx * 0.5)},${r2(cy - ry * 0.25)} L${r2(cx - rx * 0.1)},${r2(cy - ry * 0.25)} M${r2(cx + rx * 0.05)},${r2(cy + ry * 0.2)} L${r2(cx + rx * 0.35)},${r2(cy + ry * 0.2)}`, '#B9C9F2', 0.7, 0.7);
    if (i === 0) s += ell(cx - rx * 0.55, cy - ry * 0.1, 2.2, 0.9, LUNE_F, ' opacity=".9"');
  });
  // les pas du naufragé, du flot jusqu'à lui : creux, avec un peu d'eau dedans
  for (let i = 0; i < 9; i++) {
    const t = i / 9, x = 118 + (px - 6 - 118) * t + (i % 2 ? 4 : -4), y = RIVAGE + 12 + (py - 14 - RIVAGE - 12) * t;
    const k = 0.7 + 0.5 * t;
    s += ell(x, y, 2.2 * k, 1 * k, '#3C3550', ' opacity=".75"') + ell(x + 0.3, y - 0.3 * k, 1.2 * k, 0.4 * k, '#8EA2D0', ' opacity=".45"');
  }
  // la dune de gauche, ses herbes, et le tronc du petit palmier (ses palmes : palmes_g)
  s += path('M-6,250 Q20,232 46,240 Q70,250 92,272 Q60,276 -6,280 Z', 'url(#psD)', ink(1));
  s += trait('M6,244 Q30,236 52,244', '#B2A9C2', 0.9, 0.6);
  s += tronc([[36, 262], [40, 214], [52, 168]], 5.2, 3.2, 'psT', 0.9);
  for (let i = 0; i < 11; i++) {
    const x = 4 + i * 7.6 + h(i, 41) * 3, y = 250 + Math.abs(x - 40) * 0.12 + h(i, 42) * 3;
    s += herbe(x, y, 8 + 7 * h(i, 43), i);
  }
  // les restes du naufrage : une caisse à demi enterrée, une planche, une corde, une bouteille, des algues
  s += caisse(262, 276) + planche() + corde(296, 292) + bouteille(96, 268) + tonneau(440, 284) + rame();
  // plus près, sous la feuille des choix : le sable dans l'ombre, des flaques qui prennent un peu de ciel, des algues
  for (const [x, y, rx] of [[120, 420, 30], [250, 470, 40], [40, 520, 34], [330, 560, 30], [-60, 440, 26], [440, 430, 30]]) s += ell(x, y, rx, rx * 0.18, '#2A3660', ' opacity=".55"') + trait(`M${x - rx * 0.4},${y - 0.6} L${x},${y - 0.6}`, '#6E82B8', 0.8, 0.5);
  for (const [x, y] of [[180, 400], [300, 500], [60, 470], [-20, 380], [400, 380]]) s += trait(`M${x},${y} Q${x + 10},${y - 5} ${x + 22},${y} Q${x + 30},${y + 4} ${x + 40},${y}`, '#2C4A3E', 1.4, 0.8);
  s += trait('M126,296 Q138,290 150,296 Q160,302 172,298', '#2C4A3E', 1.4) + trait('M128,298 Q140,293 148,298', '#4E7666', 0.6, 0.7);
  s += trait('M300,262 Q312,256 322,262', '#2C4A3E', 1.2);
  // le pied du grand palmier de droite (son tronc : palmier_d), son ombre sur le sable
  s += ell(334, 302, 26, 4.4, 'url(#psO)');
  // l'ombre que la lune pose derrière les choses : vers la droite
  s += ell(px + 4, py + 1, 30, 5.2, 'url(#psO)');
  return s;
}
// Une touffe d'herbe de dune : des brins fins, sombres, le bout pris par la lune
function herbe(x, y, l, i) {
  let s = '';
  for (let j = 0; j < 5; j++) {
    const a = -1.2 + j * 0.6 + (h(i, j) - 0.5) * 0.4, ex = x + Math.sin(a) * l * 0.6, ey = y - Math.cos(a * 0.6) * l;
    s += trait(`M${r2(x)},${r2(y)} Q${r2(x + (ex - x) * 0.3)},${r2(y - l * 0.6)} ${r2(ex)},${r2(ey)}`, j % 2 ? VERT.corps : VERT.fonce, 0.9);
    if (j === 1 || j === 3) s += trait(`M${r2(x + (ex - x) * 0.7)},${r2(y - l * 0.8)} L${r2(ex)},${r2(ey)}`, VERT.lune, 0.5, 0.55);
  }
  return s;
}
// Un tronc de palmier : une courbe (trois points), large du pied (w0) au sommet (w1), éclairé à gauche (la lune),
// cerclé de bagues
function tronc(c, w0, w1, grad, kInk) {
  const [[ax, ay], [bx, by], [cx, cy]] = c;
  const at = t => [(1 - t) * (1 - t) * ax + 2 * (1 - t) * t * bx + t * t * cx, (1 - t) * (1 - t) * ay + 2 * (1 - t) * t * by + t * t * cy];
  const n = 18, G = [], D = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n, [x, y] = at(t), [x2, y2] = at(Math.min(1, t + 0.02)), [x0, y0] = at(Math.max(0, t - 0.02));
    const tx = x2 - x0, ty = y2 - y0, l = Math.hypot(tx, ty) || 1, nx = -ty / l, ny = tx / l, w = w0 + (w1 - w0) * t;
    G.push([x - nx * w, y - ny * w]);
    D.push([x + nx * w, y + ny * w]);
  }
  const corps = [...G, ...D.reverse()];
  let s = poly(corps, `url(#${grad})`, ink(kInk));
  // les bagues : des arcs serrés, sombres, avec une lèvre claire côté lune
  for (let i = 1; i < 17; i++) {
    const t = i / 17, [x, y] = at(t), [x2, y2] = at(Math.min(1, t + 0.02)), [x0, y0] = at(t - 0.02);
    const tx = x2 - x0, ty = y2 - y0, l = Math.hypot(tx, ty), nx = -ty / l, ny = tx / l, w = (w0 + (w1 - w0) * t) * 0.92;
    s += trait(`M${r2(x - nx * w)},${r2(y - ny * w)} Q${r2(x + tx / l * 1.4)},${r2(y + ty / l * 1.4)} ${r2(x + nx * w)},${r2(y + ny * w)}`, TRONC.bague, 0.7, 0.8);
    s += trait(`M${r2(x - nx * w)},${r2(y - ny * w)} L${r2(x - nx * w * 0.45)},${r2(y - ny * w * 0.45 + 0.8)}`, '#A9A8C0', 0.5, 0.6);
  }
  return s;
}
function caisse(x, y) {
  const B = { lune: '#7E6E6A', corps: '#5A4A4C', ombre: '#3A2E36' };
  let s = poly([[x - 22, y + 6], [x - 18, y - 16], [x + 6, y - 20], [x + 6, y + 4]], B.corps, ink(1.1));
  s += poly([[x + 6, y - 20], [x + 24, y - 14], [x + 22, y + 8], [x + 6, y + 4]], B.ombre, ink(1.1));
  s += poly([[x - 18, y - 16], [x - 2, y - 24], [x + 22, y - 20], [x + 6, y - 20]], B.lune, ink(1.1));
  s += trait(`M${x - 20},${y - 6} L${x + 6},${y - 9} M${x - 19},${y - 11} L${x + 6},${y - 14}`, '#2A2030', 0.7, 0.8);
  s += trait(`M${x + 7},${y - 8} L${x + 23},${y - 3}`, '#1E1826', 0.7, 0.8);
  s += trait(`M${x - 14},${y - 18} L${x + 4},${y - 22}`, '#B8A8A0', 0.6, 0.6);
  // une planche arrachée, le sable qui l'avale
  s += poly([[x - 4, y - 21], [x + 3, y - 30], [x + 8, y - 27], [x + 2, y - 19]], B.lune, ink(0.9));
  s += path(`M${x - 26},${y + 8} Q${x},${y + 1} ${x + 28},${y + 9} L${x + 28},${y + 12} L${x - 26},${y + 12} Z`, SABLE.clair);
  s += trait(`M${x - 26},${y + 8} Q${x},${y + 1} ${x + 28},${y + 9}`, '#9A90A6', 0.6, 0.7);
  return s;
}
function planche() {
  let s = poly([[44, 312], [112, 300], [114, 306], [46, 319]], '#56484A', ink(1));
  s += trait('M50,313 L108,302', '#857270', 0.6, 0.7) + trait('M64,313 L70,312 M86,308 L92,307', '#2A2030', 0.6);
  s += `<circle cx="57" cy="313.5" r=".9" fill="#2A2030"/><circle cx="101" cy="305" r=".9" fill="#2A2030"/>`;
  return s + path('M40,318 Q76,312 116,306 L118,310 Q80,318 40,322 Z', SABLE.sec, ' opacity=".8"');
}
function corde(x, y) {
  let s = ell(x, y, 9, 3.4, 'none', ' stroke="#2A2030" stroke-width="3.2"') + ell(x, y, 9, 3.4, 'none', ' stroke="#8E7E6A" stroke-width="1.8"');
  s += ell(x, y - 0.6, 5.6, 2, 'none', ' stroke="#2A2030" stroke-width="3"') + ell(x, y - 0.6, 5.6, 2, 'none', ' stroke="#A89480" stroke-width="1.6"');
  return s + trait(`M${x + 8},${y + 1} Q${x + 16},${y + 6} ${x + 26},${y + 4}`, '#2A2030', 3) + trait(`M${x + 8},${y + 1} Q${x + 16},${y + 6} ${x + 26},${y + 4}`, '#8E7E6A', 1.6);
}
function bouteille(x, y) {
  let s = `<g transform="rotate(-62 ${x} ${y})">` + path(`M${x - 3},${y + 7} L${x - 3},${y - 3} Q${x - 3},${y - 6} ${x - 1.4},${y - 7} L${x - 1.4},${y - 11} L${x + 1.4},${y - 11} L${x + 1.4},${y - 7} Q${x + 3},${y - 6} ${x + 3},${y - 3} L${x + 3},${y + 7} Z`, '#3E6A6A', ink(0.8) + ' fill-opacity=".85"');
  s += trait(`M${x - 1.6},${y + 5} L${x - 1.6},${y - 3}`, '#CDEBEA', 0.8, 0.8) + `<rect x="${x - 1.6}" y="${y - 13}" width="3.2" height="2.4" fill="#7A5A44"${ink(0.6)}/></g>`;
  return s + path(`M${x - 4},${y + 3} Q${x + 2},${y - 1} ${x + 9},${y + 3} L${x + 9},${y + 5} L${x - 4},${y + 5} Z`, SABLE.clair);
}

// Un tonneau échoué, couché, ses cercles ; une rame brisée, à demi dans le sable (au loin, sur les côtés du panorama)
function tonneau(x, y) {
  let s = ell(x - 12, y, 6, 9, '#4A3C3E', ink(1.1)) + path(`M${x - 12},${y - 9} L${x + 12},${y - 10} Q${x + 18},${y} ${x + 12},${y + 10} L${x - 12},${y + 9} Z`, '#5E4C4A', ink(1.1));
  s += trait(`M${x - 4},${y - 9.4} Q${x + 1},${y} ${x - 4},${y + 9.4} M${x + 6},${y - 9.8} Q${x + 11},${y} ${x + 6},${y + 9.8}`, '#2A2030', 1.6) + trait(`M${x - 2},${y - 7} L${x + 10},${y - 7.6}`, '#8A7672', 0.7, 0.7);
  return s + ell(x - 12, y, 3.6, 6, '#3A2E36') + path(`M${x - 22},${y + 9} Q${x},${y + 4} ${x + 22},${y + 10} L${x + 22},${y + 13} L${x - 22},${y + 13} Z`, SABLE.clair);
}
function rame() {
  return poly([[-110, 318], [-46, 292], [-44, 296], [-108, 322]], '#5A4A4C', ink(1)) + path('M-46,292 Q-30,284 -22,290 Q-28,300 -44,296 Z', '#6A5856', ink(1))
    + trait('M-104,318 L-50,296', '#8A7672', 0.6, 0.7) + path('M-120,322 Q-80,314 -40,300 L-38,304 Q-80,320 -120,326 Z', SABLE.sec, ' opacity=".85"');
}

// ——— le grand palmier de droite : le tronc (immobile), puis les palmes (qui se balancent) ———
const COURONNE_D = [298, 70], COURONNE_G = [52, 168];
function palmierD() {
  const d = `<defs>${lin('ppT', 0, 0, 1, 0, [[0, TRONC.lune], [0.3, TRONC.corps], [1, TRONC.ombre]])}</defs>`;
  return d + tronc([[340, 304], [340, 170], [COURONNE_D[0], COURONNE_D[1]]], 11, 6.5, 'ppT', 1.3);
}
// Une palme : une nervure en arche qui retombe ; de longues folioles qui pendent en rideau de part et d'autre, chacune
// une lame effilée (celles de derrière sombres, celles de devant prises par la lune), la nervure claire dessus
function palme(ox, oy, ang, L, chute, larg, id, lune = 0.55) {
  const a = (ang * Math.PI) / 180, ex = ox + Math.cos(a) * L, ey = oy + Math.sin(a) * L + chute;
  const cx = ox + Math.cos(a) * L * 0.45, cy = oy + Math.sin(a) * L * 0.45 - L * 0.22;
  const at = t => [(1 - t) * (1 - t) * ox + 2 * (1 - t) * t * cx + t * t * ex, (1 - t) * (1 - t) * oy + 2 * (1 - t) * t * cy + t * t * ey];
  const n = 15, lames = [[], []];
  for (let i = 1; i <= n; i++) {
    const t = (i - 0.3) / n, [x, y] = at(t), [x2, y2] = at(Math.min(1, t + 0.01)), [x0, y0] = at(Math.max(0, t - 0.01));
    const l = Math.hypot(x2 - x0, y2 - y0) || 1, ux = (x2 - x0) / l, uy = (y2 - y0) / l;
    const len = larg * 2.4 * Math.pow(Math.sin(Math.PI * Math.min(0.98, 0.15 + t * 0.9)), 0.8);
    [1, -1].forEach((k, j) => {
      const nx = -uy * k, ny = ux * k;
      // la lame : vers l'avant, un peu de côté, et la pesanteur qui la tire en bas (plus fort au bout)
      let dx = ux * 0.75 + nx * 0.55, dy = uy * 0.75 + ny * 0.55 + 0.9;
      const dl = Math.hypot(dx, dy); dx /= dl; dy /= dl;
      const tx = x + dx * len, ty = y + dy * len + len * 0.18, mx = x + dx * len * 0.55 - nx * 0.6, my = y + dy * len * 0.5;
      const b = 1.1 + larg * 0.06;
      lames[j].push(`M${r2(x - ux * b)},${r2(y - uy * b)} Q${r2(mx - ux * b * 0.9)},${r2(my - uy * b * 0.9)} ${r2(tx)},${r2(ty)} Q${r2(mx + ux * b * 0.9)},${r2(my + uy * b * 0.9)} ${r2(x + ux * b)},${r2(y + uy * b)} Z`);
    });
  }
  const nerv = Array.from({ length: 13 }, (_, i) => at(i / 12));
  const ligne = a => 'M' + a.map(([x, y]) => `${r2(x)},${r2(y)}`).join(' L');
  let s = `<path d="${lames[1].join(' ')}" fill="#0F1E22"${ink(0.6)}/>`;
  s += trait(ligne(nerv), ENCRE, 2.2) + trait(ligne(nerv), '#2C4A44', 1.1);
  s += `<path d="${lames[0].join(' ')}" fill="url(#${id})"${ink(0.6)}/>`;
  s += trait(ligne(nerv.slice(1, 9)), VERT.lune, 0.8, lune);
  return s;
}
function palmesD() {
  const [x, y] = COURONNE_D;
  let s = `<defs>${lin('pdA', 0, 0, 1, 1, [[0, VERT.clair], [0.5, VERT.corps], [1, VERT.fonce]])}${lin('pdB', 0, 0, 1, 1, [[0, VERT.corps], [1, '#0E1A1E']])}</defs>`;
  // les palmes de derrière, plus sombres ; puis celles de devant ; les noix de coco au cœur
  for (const [a, L, c, w] of [[-62, 52, 10, 8], [-118, 54, 12, 8], [-14, 60, 24, 9], [-92, 46, 6, 7], [-165, 70, 22, 9]]) s += palme(x, y, a, L, c, w, 'pdB', 0.25);
  for (const [a, L, c, w] of [[-176, 88, 40, 11], [-200, 74, 44, 10], [152, 66, 38, 10], [10, 58, 36, 9.5], [-140, 70, 20, 10], [-40, 56, 18, 9], [120, 50, 34, 9], [60, 40, 30, 8]]) s += palme(x, y, a, L, c, w, 'pdA');
  for (const [cx, cy] of [[x - 4, y + 5], [x + 3, y + 6], [x - 0.5, y + 10]]) s += `<circle cx="${cx}" cy="${cy}" r="4.2" fill="#3A2C26"${ink(0.9)}/><circle cx="${cx - 1.4}" cy="${cy - 1.5}" r="1.1" fill="#8A7A84" opacity=".7"/>`;
  return s;
}
function palmesG() {
  const [x, y] = COURONNE_G;
  let s = `<defs>${lin('pgA', 0, 0, 1, 1, [[0, VERT.clair], [0.55, VERT.corps], [1, VERT.fonce]])}${lin('pgB', 0, 0, 1, 1, [[0, VERT.corps], [1, '#0E1A1E']])}</defs>`;
  for (const [a, L, c, w] of [[-118, 30, 6, 5], [-64, 32, 8, 5]]) s += palme(x, y, a, L, c, w, 'pgB', 0.25);
  for (const [a, L, c, w] of [[-156, 38, 16, 6], [-24, 42, 18, 6.5], [18, 34, 22, 6], [168, 32, 20, 6], [-92, 26, 4, 5], [130, 26, 18, 5]]) s += palme(x, y, a, L, c, w, 'pgA');
  s += `<circle cx="${x - 1}" cy="${y + 3}" r="2.6" fill="#3A2C26"${ink(0.7)}/><circle cx="${x + 2.4}" cy="${y + 3.6}" r="2.4" fill="#3A2C26"${ink(0.7)}/>`;
  return s;
}

// ——— le devant : des feuilles sombres dans les coins, plus près que tout (la lanterne en dore le bord, à droite) ———
function devant() {
  let s = `<defs>${lin('pvA', 0, 0, 0, 1, [[0, '#1C2E34'], [1, '#0A1216']])}</defs>`;
  // à gauche, de grandes feuilles en cœur (des taros de rivage), pointe en bas, nervures, la lune sur leur bord
  const feuille = (x, y, r, rot) => {
    const d = `M0,${r2(r)} Q${r2(-r * 1.15)},${r2(r * 0.2)} ${r2(-r * 0.75)},${r2(-r * 0.55)} Q${r2(-r * 0.4)},${r2(-r * 0.95)} 0,${r2(-r * 0.5)} Q${r2(r * 0.4)},${r2(-r * 0.95)} ${r2(r * 0.75)},${r2(-r * 0.55)} Q${r2(r * 1.15)},${r2(r * 0.2)} 0,${r2(r)} Z`;
    let f = `<g transform="translate(${x} ${y}) rotate(${rot})">` + path(d, 'url(#pvA)', ink(1.2));
    f += trait(`M0,${r2(-r * 0.5)} L0,${r2(r * 0.9)}`, '#060C10', 1);
    for (const k of [-1, 1]) for (const t of [0.05, 0.35, 0.62]) f += trait(`M0,${r2(-r * 0.4 + t * r * 1.2)} Q${r2(k * r * 0.35)},${r2(-r * 0.5 + t * r * 1.2)} ${r2(k * r * 0.62)},${r2(-r * 0.62 + t * r * 1.25)}`, '#060C10', 0.7, 0.8);
    f += trait(`M${r2(-r * 0.9)},${r2(r * 0.05)} Q${r2(-r * 0.85)},${r2(-r * 0.6)} ${r2(-r * 0.2)},${r2(-r * 0.62)}`, VERT.lune, 1, 0.55);
    return f + '</g>';
  };
  s += trait('M-4,360 Q20,330 34,318 M10,360 Q40,336 58,330 M30,362 Q60,346 80,344', '#0A1216', 2.2);
  s += feuille(-2, 318, 22, 40) + feuille(30, 330, 26, 14) + feuille(64, 348, 20, -18) + feuille(8, 352, 18, 70);
  // à droite, une palme tombée et une touffe d'herbe ; leur bord gauche pris par la lanterne
  s += palme(374, 352, -164, 92, 10, 9, 'pvA');
  for (let i = 0; i < 6; i++) s += herbe(304 + i * 9, 362, 22 + 10 * h(i, 61), i + 20);
  s += trait('M300,350 Q312,330 318,322 M314,356 Q324,334 332,326', '#FFB46A', 0.9, 0.45);
  return s;
}

// ——— la lanterne de bord, rescapée : laiton, verre, la flamme (le jeu fait vaciller sa lueur) ———
function lanterne() {
  // dessinée dans 28 × 40, le pied en (14, 38) ; un rien penchée
  const L = { lune: '#B0957A', corps: '#7E6248', ombre: '#4A3828' };
  let s = `<defs>${rad('plV', [[0, '#FFF6D6'], [0.35, '#FFD48A'], [0.75, '#F0A04E'], [1, '#B4682E']], ' cx="14" cy="24" r="10" gradientUnits="userSpaceOnUse"')}${rad('plF', [[0, '#FFFFFF'], [0.5, '#FFF0B0'], [1, '#FFB040', 0]], ' cx="14" cy="24" r="4.6" gradientUnits="userSpaceOnUse"')}</defs><g transform="rotate(5 14 38)">`;
  // l'anse
  s += trait('M8,9 Q14,0 20,9', ENCRE, 2.6) + trait('M8,9 Q14,0 20,9', L.corps, 1.2);
  // le chapeau, le verre (allumé), les barreaux, le pied
  s += path('M6,12 L22,12 L19,7.5 L9,7.5 Z', L.corps, ink(1.1)) + trait('M9.5,8.6 L15,8.6', L.lune, 0.8, 0.8);
  s += path('M7.5,13 L20.5,13 L21.5,32 L6.5,32 Z', 'url(#plV)', ink(1.1));
  s += ell(14, 25, 2.4, 4.6, 'url(#plF)');
  s += path('M14,19.5 Q12,23.5 13.2,26.5 Q14,28 14.8,26.5 Q16,23.5 14,19.5 Z', '#FFFDF2');
  s += trait('M10.5,13.4 L10,31.6 M17.5,13.4 L18,31.6', L.ombre, 1, 0.9) + trait('M7.2,20 L20.8,20', L.ombre, 0.8, 0.7);
  s += trait('M8.6,14.6 L8.2,30', '#FFFFFF', 0.7, 0.55);
  s += path('M5,32 L23,32 L24,37 L4,37 Z', L.corps, ink(1.1)) + trait('M6.2,33.6 L14,33.6', L.lune, 0.8, 0.7);
  s += '</g>';
  // le sable qui chausse le pied
  return s + path('M1,38.5 Q14,34.5 27,38.5 L27,40 L1,40 Z', '#8E7E86');
}

// ——— la brume : une nappe douce (des voiles ronds, sans filtre), pour le lever et le retour, et celle des pieds ———
// (chaque voile tient dans le cadre, et s'efface avant son bord : la nappe n'a pas d'arête, même étirée)
function brume() {
  let s = `<defs>${rad('pbV', [[0, '#C8D3EE', 0.62], [0.4, '#AFBCDE', 0.4], [0.75, '#94A2CA', 0.12], [1, '#8E9CC6', 0]])}</defs>`;
  for (let i = 0; i < 26; i++) {
    const rx = 34 + 30 * h(i, 73), ry = 16 + 14 * h(i, 74);
    const x = rx + h(i, 71) * (360 - 2 * rx), y = ry + 4 + h(i, 72) * (100 - 2 * ry - 8);
    s += ell(x, y, rx, ry, 'url(#pbV)');
  }
  return s;
}

// ——— l'éclair, au loin, à gauche : un trait blanc qui se fend, dans un halo bleu ———
function eclair() {
  const z = [[34, 0], [28, 18], [36, 26], [24, 48], [32, 54], [18, 82], [26, 88], [14, 110]];
  const br = [[28, 18], [18, 30], [14, 42]], br2 = [[24, 48], [36, 64], [40, 76]];
  const d = a => 'M' + a.map(([x, y]) => `${x},${y}`).join(' L');
  let s = '';
  for (const [w, c, o] of [[9, '#6E8CFF', 0.12], [5, '#9FB6FF', 0.25], [2.4, '#DDE6FF', 0.8], [1, '#FFFFFF', 1]]) s += trait(d(z), c, w, o) + trait(d(br), c, w * 0.6, o) + trait(d(br2), c, w * 0.5, o);
  return s;
}

// Les calques de la scène : [id, nom, [largeur, hauteur], dessin, sa place dans la scène [x, y, largeur, hauteur], ce
// qu'en fait le jeu]. (largeur, hauteur : la taille du dessin, en unités de la scène)
const CALQUES = [
  ['plage_ciel', 'Plage de nuit : le ciel, la lune, la mer au loin', [LARGE, HORIZON + 40], () => `<g transform="translate(${-X0} 0)">${ciel()}</g>`, [X0, 0, LARGE, HORIZON + 40], 'le fond : le ciel de pluie, la lune et son halo, les étoiles des trouées, la mer grêlée de pluie, l\'îlot à l\'horizon'],
  ['plage_nuages', 'Plage de nuit : les nuages qui passent', [1440, 110], nuages, [-180, 0, 1440, 110], 'une bande qui boucle : elle glisse vers la gauche de 720 (la moitié de sa largeur), sans fin, devant la lune'],
  ['plage_eclat_a', 'Plage de nuit : l\'éclat de la lune sur la mer (1)', [120, RIVAGE - HORIZON], () => eclat(1), [LUNE_XY[0] - 60, HORIZON, 120, RIVAGE - HORIZON], 'l\'éclat qui tremble : les deux tirages alternent (fondu)'],
  ['plage_eclat_b', 'Plage de nuit : l\'éclat de la lune sur la mer (2)', [120, RIVAGE - HORIZON], () => eclat(2), [LUNE_XY[0] - 60, HORIZON, 120, RIVAGE - HORIZON], 'l\'autre tirage de l\'éclat'],
  ['plage_flot', 'Plage de nuit : le flot', [LARGE, 30], flot, [X0, RIVAGE - 10, LARGE, 30], 'l\'écume qui monte sur le sable et redescend (translation, écrasement, fondu) ; deux, décalés'],
  ['plage_sol', 'Plage de nuit : le sable, la dune, les restes du naufrage', [LARGE, BAS - 150], () => `<g transform="translate(${-X0} -150)">${sol()}</g>`, [X0, 150, LARGE, BAS - 150], 'la plage : le sable mouillé, les flaques, les pas, la dune et le tronc du petit palmier, la caisse, la planche, la corde, la bouteille'],
  ['plage_palmes_g', 'Plage de nuit : les palmes du petit palmier', [100, 70], () => `<g transform="translate(-2 -128)">${palmesG()}</g>`, [2, 128, 100, 70], 'elles se balancent autour du haut du tronc (origine : zones.origine)'],
  ['plage_palmier_d', 'Plage de nuit : le tronc du grand palmier', [80, 250], () => `<g transform="translate(-280 -60)">${palmierD()}</g>`, [280, 60, 80, 250], 'le tronc, immobile'],
  ['plage_palmes_d', 'Plage de nuit : les palmes du grand palmier', [200, 150], () => `<g transform="translate(-200 -10)">${palmesD()}</g>`, [200, 10, 200, 150], 'elles se balancent autour du haut du tronc (origine : zones.origine)'],
  ['plage_devant', 'Plage de nuit : le devant (feuilles dans les coins)', [360, 90], () => `<g transform="translate(0 -270)">${devant()}</g>`, [0, 270, 360, 90], 'par-dessus le personnage (rien devant ses pieds)'],
  ['plage_lanterne', 'Plage de nuit : la lanterne', [28, 40], lanterne, [LANTERNE[0] - 14, LANTERNE[1] - 38, 28, 40], 'devant le personnage, à sa droite ; sa lueur vacille dans le jeu'],
  ['plage_brume', 'Plage de nuit : une nappe de brume', [360, 100], brume, [0, 230, 360, 100], 'le lever (elle s\'ouvre sur le personnage) et le retour (au salut) ; une nappe basse, à ses pieds, qui dérive'],
  ['plage_eclair', 'Plage de nuit : l\'éclair au loin', [44, 112], eclair, [40, 84, 44, 112], 'il paraît un instant, au lever (avec l\'éclat blanc de la scène)']
];
// Où les choses sont dans la scène, pour le jeu (en unités de la scène)
const SCENE = {
  taille: [360, 360], panorama: [X0, X1], bas: BAS, pieds: PIEDS, lanterne: LANTERNE, lune: LUNE_XY, horizon: HORIZON, rivage: RIVAGE, flaques: FLAQUES,
  origines: { plage_palmes_g: COURONNE_G, plage_palmes_d: COURONNE_D }
};

module.exports = { CALQUES, SCENE };
