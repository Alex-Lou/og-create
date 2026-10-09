// Les scènes plein écran du tutoriel, en animation continue (SMIL) : un seul dessin par calque, qui bouge en douceur
// dans le SVG (la pluie qui tombe, la mer qui roule, la brume qui dérive, Brume qui flotte, le feu qui danse). Les
// moments qui arrivent une fois (le tampon, la vague, le feu qui prend, le vent qui chasse la brume) se jouent une fois
// au chargement de la scène, puis la scène reste vivante en boucle. Mêmes cadrages et mêmes places d'avatar que
// scenes6.js, qui appelle ce module avec ses décors (carte, ruines, grimoire, rochers, débris) et remplace ainsi ses
// scènes à images par celles-ci. Les scènes avec les autres personnages (07 à 12) restent celles de scenes6.js.
const { OUT, P, E, L } = require('./troupe');
const { brumeFrame } = require('./brume');

const W = 400;
const f = n => Math.round(n * 100) / 100;
const lin = (id, stops, x2 = 0, y2 = 1) => `<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}">${stops.map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join('')}</linearGradient>`;
const rad = (id, stops, cx = 0.5, cy = 0.5, r = 0.5) => `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}">${stops.map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join('')}</radialGradient>`;
const trait = (d, c, w, extra = '') => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"${extra ? ' ' + extra : ''}/>`;
const rnd = s => { let x = s; return () => (x = (x * 16807) % 2147483647) / 2147483647; };

// ——— les mouvements ———
// aller-retour doux (ease-in-out)
const SPLINE = 'keySplines="0.45 0 0.55 1;0.45 0 0.55 1" keyTimes="0;0.5;1" calcMode="spline"';
const vaVient = (type, a, b, dur, begin = 0) => `<animateTransform attributeName="transform" type="${type}" values="${a};${b};${a}" ${SPLINE} dur="${f(dur)}s" begin="${f(-begin)}s" repeatCount="indefinite" additive="sum"/>`;
// défilement sans fin (de « from » à « to », puis on recommence)
const defile = (from, to, dur, begin = 0) => `<animateTransform attributeName="transform" type="translate" from="${from}" to="${to}" dur="${f(dur)}s" begin="${f(-begin)}s" repeatCount="indefinite"/>`;
// une fois, au chargement : valeurs, instants (0..1), durée ; l'état final reste
const uneFois = (type, values, keyTimes, dur, begin = 0) => `<animateTransform attributeName="transform" type="${type}" values="${values}" keyTimes="${keyTimes}" dur="${f(dur)}s" begin="${f(begin)}s" fill="freeze" additive="sum"/>`;
const fondu = (values, keyTimes, dur, begin = 0) => `<animate attributeName="opacity" values="${values}" keyTimes="${keyTimes}" dur="${f(dur)}s" begin="${f(begin)}s" fill="freeze"/>`;
const palpite = (attr, values, dur, begin = 0) => `<animate attributeName="${attr}" values="${values}" dur="${f(dur)}s" begin="${f(-begin)}s" repeatCount="indefinite"/>`;

// ——— les palettes ———
const NUIT = { ciel: ['#0B1028', '#26355C'], mer: { haut: '#1E3552', bas: '#2C4A6E', vague: '#3E6890', ecume: '#9FB8D2' }, sable: { haut: '#5E5A56', bas: '#3A3634', ecume: '#8FA9C4', galet: '#3E4352', galetH: '#6A7286', grain: '#7A746C' }, roche: ['#545B6E', '#3E4352', '#2E3240'] };
const TEMPETE = { ciel: ['#070B1C', '#1E2A52'], mer: { haut: '#142844', bas: '#22406A', vague: '#3E6890', ecume: '#A8C0DA' } };

// ——— le ciel, la lune, les étoiles qui scintillent, une étoile filante de temps en temps ———
const ciel = (id, [haut, bas], y1 = W) => `<defs>${lin(id, [[0, haut], [1, bas]])}</defs><rect x="0" y="0" width="${W}" height="${y1}" fill="url(#${id})"/>`;
function etoiles(n, yMax, seed = 3, filante = false) {
  const g = rnd(seed);
  let s = '';
  for (let i = 0; i < n; i++) {
    const x = f(g() * W), y = f(g() * yMax), r = f(0.6 + g() * 1.2), d = f(1.8 + g() * 2.6);
    s += `<circle cx="${x}" cy="${y}" r="${r}" fill="#FFF6DC">${palpite('opacity', '1;0.25;1', d, g() * d)}</circle>`;
    if (r > 1.55) s += `<path d="M${x},${f(y - r * 3)} L${x},${f(y + r * 3)} M${f(x - r * 3)},${y} L${f(x + r * 3)},${y}" stroke="#FFF6DC" stroke-width="0.5" opacity=".55"/>`;
  }
  if (filante) s += `<g opacity="0"><animate attributeName="opacity" values="0;0;1;0;0" keyTimes="0;0.8;0.83;0.9;1" dur="9s" repeatCount="indefinite"/><animateTransform attributeName="transform" type="translate" values="0 0;0 0;120 50;120 50" keyTimes="0;0.8;0.9;1" dur="9s" repeatCount="indefinite"/>${trait(`M${f(W * 0.2)},30 l-34,-14`, '#FFF6DC', 1.6)}<circle cx="${f(W * 0.2)}" cy="30" r="1.8" fill="#FFFFFF"/></g>`;
  return s;
}
function lune(id, x, y, r = 16) {
  return `<defs>${rad(id, [[0, '#FFF6D8', 0.55], [1, '#FFF6D8', 0]])}</defs><circle cx="${x}" cy="${y}" r="${f(r * 2.8)}" fill="url(#${id})">${palpite('opacity', '0.8;1;0.8', 6)}</circle>` + E(x, y, r, r, '#F6EED6', 1.6) + E(x - r * 0.35, y - r * 0.25, r * 0.2, r * 0.16, '#E2D8BC') + E(x + r * 0.3, y + r * 0.35, r * 0.26, r * 0.2, '#E2D8BC') + trait(`M${f(x - r * 0.7)},${f(y - r * 0.3)} Q${f(x - r * 0.6)},${f(y - r * 0.75)} ${f(x - r * 0.15)},${f(y - r * 0.85)}`, '#FFFFFF', 1.2, 'opacity=".7"');
}
// ——— la mer : un dégradé, des rangées de vagues qui défilent sans fin ———
function mer(id, y0, y1, c, vitesse = 1) {
  let s = `<defs>${lin(id, [[0, c.haut], [1, c.bas]])}</defs><rect x="0" y="${y0}" width="${W}" height="${y1 - y0}" fill="url(#${id})"/>`;
  for (let i = 0; i < 5; i++) {
    const y = f(y0 + (y1 - y0) * (0.12 + i * 0.2)), per = 60 + i * 14, h = 2 + i * 1.1, d = (6 - i * 0.7) / vitesse;
    const vague = Array.from({ length: Math.ceil(W / per) + 3 }, (_, k) => `M${k * per - per},${y} q${f(per / 4)},-${f(h)} ${f(per / 2)},0`).join(' ');
    s += `<g>${defile('0 0', `${per} 0`, d, i * 0.7)}${trait(vague, i % 2 ? c.vague : c.ecume, f(1.2 + i * 0.45), `opacity="${f(0.42 + i * 0.12)}"`)}</g>`;
  }
  return s;
}
// le reflet de la lune sur la mer : des traits qui scintillent
const reflet = (x, y0, n = 5) => [...Array(n).keys()].map(i => `<rect x="${f(x - 12 - i * 3)}" y="${f(y0 + i * 10)}" width="${24 + i * 6}" height="2" rx="1" fill="#F6EED6" opacity=".4">${palpite('opacity', '0.12;0.6;0.12', 1.4 + i * 0.3, i * 0.4)}</rect>`).join('');
// ——— le sable : une plage de Brumelune en pente douce, ombrée, des galets, du grain ; l'écume qui va et vient au bord ———
function sable(id, y, c = NUIT.sable, seed = 5) {
  let s = `<defs>${lin(id, [[0, c.haut], [1, c.bas]])}</defs>` + P(`M0,${y} Q${W * 0.3},${y - 14} ${W * 0.55},${y - 6} Q${W * 0.8},${y + 2} ${W},${y - 10} L${W},${W} L0,${W} Z`, `url(#${id})`, 2);
  s += `<g>${vaVient('translate', '0 -3', '0 4', 4.6)}${trait(`M-10,${y + 3} Q${W * 0.3},${y - 11} ${W * 0.55},${y - 3} Q${W * 0.8},${y + 5} ${W + 10},${y - 7}`, c.ecume, 2.2, 'opacity=".55"')}</g>`;
  const g = rnd(seed);
  for (let i = 0; i < 14; i++) { const x = f(g() * W), yy = f(y + 20 + g() * (W - y - 30)), r = f(2 + g() * 6); s += E(x, yy, r, r * 0.6, c.galet, 1.2) + E(x - r * 0.3, yy - r * 0.25, r * 0.35, r * 0.2, c.galetH, 0); }
  for (let i = 0; i < 34; i++) s += `<circle cx="${f(g() * W)}" cy="${f(y + 10 + g() * (W - y))}" r="0.7" fill="${c.grain}"/>`;
  return s;
}
// ——— la brume : de longues nappes qui dérivent ———
const nappe = (y, a, dur, dx = 30, k = 1, rgb = '220,230,242') => `<g>${vaVient('translate', `${-dx} 0`, `${dx} 0`, dur)}${[[-40, 0, 230], [170, 8, 260], [380, -4, 210]].map(([x, dy, rx]) => `<ellipse cx="${x}" cy="${f(y + dy)}" rx="${rx}" ry="${f(26 * k)}" fill="rgb(${rgb})" opacity="${a}"/>`).join('')}</g>`;
// ——— la pluie : chaque goutte tombe en biais, sans fin ———
function pluie(n, a, seed = 7, w = 1.4) {
  const g = rnd(seed);
  let s = '';
  for (let i = 0; i < n; i++) {
    const x = f(g() * 520), d = 0.45 + g() * 0.25, l = f(14 + g() * 10);
    s += `<path d="M${x},-30 l${f(-l * 0.55)},${l}" stroke="rgb(200,216,238)" stroke-width="${w}" stroke-linecap="round" opacity="${a}">${defile('0 0', '-240 460', d, g() * d)}</path>`;
  }
  return s;
}
// ——— une lueur douce qui respire ———
const halo = (id, x, y, r, rgb = '200,225,240', a = 0.45, dur = 2.6) => `<defs>${rad(id, [[0, `rgb(${rgb})`, a], [1, `rgb(${rgb})`, 0]])}</defs><circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="url(#${id})">${palpite('r', `${f(r * 0.85)};${f(r * 1.1)};${f(r * 0.85)}`, dur)}</circle>`;
// ——— Brume : posée (bas de sa flamme en 0, 0), échelle s ; flotte doucement ———
const brumeCorps = (s, expr = 'neutre') => `<g transform="translate(${f(-20 * s)} ${f(-32 * s)}) scale(${f(s)})">${brumeFrame('s0', 0, expr)}</g>`;
const brume = (id, x, y, s, expr = 'neutre', dur = 2.6, lueur = 0.45) => halo(id, x, y - 16 * s, 26 * s, '220,236,250', lueur, dur)
  + `<g transform="translate(${f(x)} ${f(y)})"><g>${vaVient('translate', '0 0', `0 ${f(-3.2 * s)}`, dur)}${vaVient('rotate', '-3', '3', dur * 1.6)}${brumeCorps(s, expr)}</g></g>`;

// ——— le feu : galets, bois flotté, flammes rondes qui dansent, braises qui montent ; « prend » : il grandit une fois ———
function feu(id, x, y, s, prend = false) {
  let o = `<defs>${rad(id + 'g', [[0, '#FFD27A', 0.75], [0.45, '#FF9A3A', 0.3], [1, '#FF7A2A', 0]])}${lin(id + 'f1', [[0, '#FFE680'], [0.6, '#FF8A2E'], [1, '#E8402A']])}${lin(id + 'f2', [[0, '#FFF6C8'], [1, '#FFC23A']])}${rad(id + 'p', [[0, '#B8B2A6'], [1, '#6E6A62']], 0.35, 0.3, 0.8)}${lin(id + 'b', [[0, '#C08A5A'], [1, '#6A4428']])}</defs>`;
  const lueur = `<ellipse cx="${x}" cy="${f(y - 8 * s)}" rx="${f(90 * s)}" ry="${f(60 * s)}" fill="url(#${id}g)">${palpite('opacity', '0.85;1;0.75;0.95;0.85', 1.3)}</ellipse>`;
  o += prend ? `<g opacity="0">${fondu('0;0.6;1', '0;0.5;1', 1.6)}${lueur}</g>` : lueur;
  o += [-17, -9, 0, 9, 17].map((dx, i) => E(x + dx * s, y + (i % 2 ? 2 : 3.2) * s, 4.8 * s, 3.2 * s, `url(#${id}p)`, 1.2)).join('');
  for (const [a, b, c, d] of [[-13, 1, 12, -3], [-11, -3, 13, 1]]) o += L([x + a * s, y + b * s], [x + c * s, y + d * s], OUT, 7 * s) + L([x + a * s, y + b * s], [x + c * s, y + d * s], `url(#${id}b)`, 5 * s);
  o += E(x + 12 * s, y - 3 * s, 2 * s, 2.6 * s, '#E8A06A', 0.8) + E(x - 11 * s, y - 3 * s, 2 * s, 2.6 * s, '#E8A06A', 0.8);
  const flamme = (dx, h, w, fill, dur, beg, trace = true) => `<g transform="translate(${f(x + dx * s)} ${f(y - 1 * s)})"><g>${vaVient('scale', '1 1', '0.93 1.09', dur, beg)}${vaVient('skewX', '-3.5', '3.5', dur * 1.9, beg)}<path d="M${f(-w * s)},${f(-w * s * 0.2)} C${f(-w * s * 1.05)},${f(-h * s * 0.5)} ${f(-w * s * 0.35)},${f(-h * s * 0.72)} 0,${f(-h * s)} C${f(w * s * 0.35)},${f(-h * s * 0.72)} ${f(w * s * 1.05)},${f(-h * s * 0.5)} ${f(w * s)},${f(-w * s * 0.2)} C${f(w * s * 0.9)},${f(w * s * 0.5)} ${f(-w * s * 0.9)},${f(w * s * 0.5)} ${f(-w * s)},${f(-w * s * 0.2)} Z" fill="${fill}"${trace ? ` stroke="${OUT}" stroke-width="${f(1.3 * s / 1.8)}" stroke-linejoin="round"` : ''}/></g></g>`;
  let fl = flamme(-5.5, 24, 8, `url(#${id}f1)`, 0.7, 0) + flamme(5.5, 27, 8, `url(#${id}f1)`, 0.62, 0.25) + flamme(0, 31, 9.5, `url(#${id}f1)`, 0.8, 0.1) + flamme(0, 21, 6.4, `url(#${id}f2)`, 0.56, 0.15, false) + flamme(0, 11, 3.4, '#FFFBE6', 0.46, 0.3, false);
  const g = rnd(11);
  for (let i = 0; i < 9; i++) {
    const d = 1.4 + g() * 1.2, bx = (g() - 0.5) * 14 * s, hh = 40 + g() * 40, beg = g() * d;
    fl += `<circle cx="${f(x + bx)}" cy="${f(y - 12 * s)}" r="${f(0.9 + g() * 0.8)}" fill="#FFE07A"><animateTransform attributeName="transform" type="translate" values="0 0;${f(g() * 10 - 5)} ${f(-hh * 0.5)};${f(g() * 14 - 7)} ${f(-hh)}" dur="${f(d)}s" begin="${f(-beg)}s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0.8;0" dur="${f(d)}s" begin="${f(-beg)}s" repeatCount="indefinite"/></circle>`;
  }
  if (prend) fl = `<g transform="translate(${x} ${y})"><g>${uneFois('scale', '0.1;0.45;1', '0;0.4;1', 1.6)}<g transform="translate(${-x} ${-y})">${fl}</g></g></g>`;
  return o + fl;
}
// ——— l'épave de l'Hirondelle au loin, qui roule doucement ———
const epave = (x, y, s, a) => `<g transform="translate(${x} ${y})"><g>${vaVient('rotate', '-16', '-12', 5.2)}${vaVient('translate', '0 0', '0 2.4', 3.4)}<g transform="scale(${s})" opacity="${a}">` + P('M-60,0 L56,0 L66,-14 L-66,-14 Z', '#C8C4BA', 2) + P('M-58,0 L54,0 L60,8 L-50,8 Z', '#8A3A30', 2) + P('M-40,-14 L34,-14 L30,-30 L-36,-30 Z', '#D8D4CA', 2) + `<rect x="6" y="-48" width="14" height="18" fill="#C8A04B" stroke="${OUT}" stroke-width="2"/><rect x="6" y="-44" width="14" height="4" fill="#3E5A8C"/>` + [-50, -36, -22, -8, 6, 20, 34, 48].map(px => E(px, -7, 3, 3, '#3E5A7E', 1.2)).join('') + '</g></g></g>';
// ——— un rocher massif ombré (pied gauche en x, y ; largeur w ; hauteur h) ———
function rocher(id, x, y, w, h, c = NUIT.roche) {
  const d = `M${x},${y} Q${f(x - w * 0.06)},${f(y - h * 0.7)} ${f(x + w * 0.3)},${f(y - h)} Q${f(x + w * 0.6)},${f(y - h * 1.12)} ${f(x + w * 0.86)},${f(y - h * 0.8)} Q${f(x + w * 1.04)},${f(y - h * 0.4)} ${f(x + w)},${y} Z`;
  return `<defs>${lin(id, [[0, c[0]], [0.6, c[1]], [1, c[2]]], 0.6, 1)}</defs>` + P(d, `url(#${id})`, 2.4)
    + P(`M${f(x + w * 0.58)},${f(y - h * 1.04)} Q${f(x + w * 0.9)},${f(y - h * 0.8)} ${f(x + w)},${y} L${f(x + w * 0.66)},${y} Q${f(x + w * 0.74)},${f(y - h * 0.5)} ${f(x + w * 0.58)},${f(y - h * 1.04)} Z`, 'rgba(0,0,0,.2)', 0)
    + trait(`M${f(x + w * 0.2)},${f(y - h * 0.8)} L${f(x + w * 0.4)},${f(y - h * 0.96)}`, '#8A90A4', 3, 'opacity=".8"') + trait(`M${f(x + w * 0.15)},${f(y - h * 0.3)} q${f(w * 0.1)},-6 ${f(w * 0.22)},-2`, c[2], 1.2, 'opacity=".7"');
}
// la plage de Brumelune de nuit : ciel, étoiles, mer, brume, sable (la base des scènes de l'étape 2)
const greve = (id, horizon = 250, seed = 3) => ciel(id + 'c', NUIT.ciel, horizon) + etoiles(26, horizon - 70, seed) + mer(id + 'm', horizon - 54, horizon, NUIT.mer) + nappe(horizon - 40, 0.2, 14) + sable(id + 's', horizon);

module.exports = function scenesAnimees(H) {
  const S = {};
  // ===== 0a-0b — la carte d'embarquement (elle reste immobile : l'avatar s'y compose dans la photo) =====
  S['00_carte'] = {
    fond: () => ciel('c0', NUIT.ciel) + etoiles(30, 400, 31, true) + `<defs>${lin('c0r', [[0, '#FFFFFF', 0], [0.5, '#FFFFFF', 0.55], [1, '#FFFFFF', 0]], 1, 0)}<clipPath id="c0k"><rect x="70" y="96" width="260" height="196" rx="10"/></clipPath></defs>`
      + `<ellipse cx="200" cy="300" rx="150" ry="14" fill="#000000" opacity=".25"/>` + H.carte(false)
      // un reflet qui passe sur la carte, de temps en temps
      + `<g clip-path="url(#c0k)"><rect x="-80" y="80" width="60" height="240" fill="url(#c0r)" transform="skewX(-20)">${`<animateTransform attributeName="transform" type="translate" values="0 0;0 0;460 0" keyTimes="0;0.6;1" dur="5s" repeatCount="indefinite" additive="sum"/>`}</rect></g>`
  };
  // ===== 0c — le tampon claque, puis le vent emporte la carte (une fois) =====
  S['00_tampon'] = {
    fond: () => {
      let s = ciel('c1', NUIT.ciel) + etoiles(30, 400, 31);
      // les traits du vent, qui passent sans fin
      s += [0, 1, 2].map(i => `<g opacity=".5">${defile('-260 0', '460 0', 2.6, i * 0.9)}${trait(`M0,${240 + i * 40} q60,-30 120,-10 q60,20 120,-20`, 'rgb(220,230,242)', 3)}</g>`).join('');
      // la carte : le tampon y claque (il arrive grand et s'écrase), puis le vent l'emporte ; elle reste au loin, à flotter
      const tampon = `<g transform="rotate(-14 250 266)" opacity="0"><animate attributeName="opacity" values="0;0;1" keyTimes="0;0.5;1" dur="0.5s" fill="freeze"/><g transform="translate(250 265)"><g>${uneFois('scale', '1.6;1.6;0.62', '0;0.5;1', 0.5)}<g transform="translate(-250 -265)">${H.tamponSeul()}</g></g></g></g>`;
      s += `<g transform="translate(200 200)"><g>${uneFois('translate', '0 0;0 0;40 -30;100 -80;130 -110', '0;0.3;0.5;0.75;1', 3.4)}${uneFois('rotate', '0;0;10;24;30', '0;0.3;0.5;0.75;1', 3.4)}${uneFois('scale', '1;1;0.8;0.55;0.45', '0;0.3;0.5;0.75;1', 3.4)}<g>${vaVient('translate', '0 -6', '0 6', 2.4)}${vaVient('rotate', '-5', '5', 3.2)}<g transform="translate(-200 -200)">${H.carte(false)}${tampon}</g></g></g></g>`;
      return s;
    }
  };
  // ===== 1a — le pont de l'Hirondelle dans la tempête =====
  S['01_pont'] = {
    fond: () => {
      let s = `<defs>${lin('poC', [[0, '#080C1E'], [0.6, '#16224A'], [1, '#2A3A62']])}${lin('poP', [[0, '#7A5A3E'], [1, '#4A3322']])}${lin('poM', [[0, '#D8C8A8'], [1, '#A8987A']], 1, 0)}${rad('poL', [[0, '#FFE6A0', 0.55], [1, '#FFE6A0', 0]])}${rad('poB', [[0, '#FF8A5A'], [0.7, '#E8562E'], [1, '#B83A1E']], 0.4, 0.35, 0.7)}</defs>`;
      s += `<rect x="0" y="0" width="400" height="300" fill="url(#poC)"/>`;
      const nuage = (x, y, k, c, dur, dx) => `<g>${vaVient('translate', `${-dx} 0`, `${dx} 0`, dur)}<g transform="translate(${x} ${y}) scale(${k})">${[[-40, 0, 46, 22], [0, -12, 52, 28], [44, -2, 48, 24], [80, 8, 36, 16], [-74, 10, 34, 14]].map(([cx, cy, rx, ry]) => E(cx, cy, rx, ry, c)).join('')}</g></g>`;
      s += nuage(80, 60, 1.2, '#1A2448', 14, 20) + nuage(300, 40, 1.4, '#141C3A', 18, 26) + nuage(200, 110, 1, '#222E58', 11, 14);
      // l'éclair : un éclat bref et doux du ciel, et le trait, une fois toutes les 9 s
      s += `<g opacity="0"><animate attributeName="opacity" values="0;0;0.8;0.15;0.6;0;0" keyTimes="0;0.78;0.79;0.81;0.83;0.88;1" dur="9s" repeatCount="indefinite"/><rect x="0" y="0" width="400" height="300" fill="#B8C8F0" opacity=".22"/>${trait('M262,0 L248,40 L262,46 L240,96 L254,100 L236,150', '#FFFFFF', 3)}${trait('M262,0 L248,40 L262,46 L240,96 L254,100 L236,150', '#B8D0FF', 7, 'opacity=".35"')}</g>`;
      let m = mer('poMe', 190, 300, TEMPETE.mer, 1.6);
      m += `<g>${defile('0 0', '170 0', 4.4)}${P('M-340,240 Q-260,170 -170,214 Q-100,246 -40,206 Q20,170 0,214 Q60,250 130,206 Q200,168 170,214 Q230,250 300,206 Q370,168 340,214 Q400,250 470,206 L470,300 L-340,300 Z', '#1E3A5E', 2)}${trait('M-260,192 q30,-12 60,6 M-90,198 q30,-12 60,6 M80,198 q30,-12 60,6 M250,198 q30,-12 60,6', '#C8DAEE', 2.2)}</g>`;
      s += `<g>${vaVient('translate', '0 -8', '0 8', 3.2)}${vaVient('rotate', '-1.6 200 300', '1.6 200 300', 6.4)}${m}</g>`;
      s += `<g opacity="0"><animate attributeName="opacity" values="0;0;0.9;0" keyTimes="0;0.55;0.62;0.85" dur="3.2s" repeatCount="indefinite"/><animateTransform attributeName="transform" type="translate" values="0 20;0 20;0 -16;0 -30" keyTimes="0;0.55;0.65;0.85" dur="3.2s" repeatCount="indefinite"/>${[[30, 238, 10], [60, 230, 14], [100, 236, 9], [380, 236, 12], [350, 228, 9]].map(([x, y, r]) => E(x, y, r, r * 0.7, '#E8F2FC') + E(x - r * 0.3, y - r * 0.3, r * 0.3, r * 0.2, '#FFFFFF')).join('')}</g>`;
      s += P('M0,300 L400,300 L400,400 L0,400 Z', 'url(#poP)', 2) + [318, 342, 370].map(y => L([0, y], [400, y], '#3A2818', 2)).join('');
      s += [[60, 330], [190, 360], [300, 326], [120, 386]].map(([x, y], i) => `<ellipse cx="${x}" cy="${y}" rx="22" ry="3" fill="#FFE6A0" opacity=".18">${palpite('opacity', '.1;.26;.1', 2 + i * 0.4)}</ellipse>`).join('');
      s += `<rect x="330" y="14" width="13" height="292" fill="url(#poM)" stroke="${OUT}" stroke-width="2"/>` + trait('M336,20 L400,120 M336,20 L270,250', '#3A2A1A', 1.4, 'opacity=".8"');
      const guirlande = (x0, y0, x1, y1, creux, dur, beg) => {
        let g = trait(`M${x0},${y0} Q${(x0 + x1) / 2},${(y0 + y1) / 2 + creux} ${x1},${y1}`, OUT, 1.6);
        const cols = ['#FFD15A', '#F27A5A', '#7EC4E8', '#9BE07A'];
        for (let k = 1; k < 8; k++) {
          const t = k / 8, x = f((1 - t) ** 2 * x0 + 2 * t * (1 - t) * ((x0 + x1) / 2) + t * t * x1), y = f((1 - t) ** 2 * y0 + 2 * t * (1 - t) * ((y0 + y1) / 2 + creux) + t * t * y1 + 6);
          g += `<circle cx="${x}" cy="${y}" r="10" fill="url(#poL)">${palpite('opacity', '1;0.6;1', 1.6 + k * 0.23)}</circle>` + E(x, y, 3.6, 4.6, cols[k % 4], 1.2) + E(x - 1.1, y - 1.6, 1, 1.4, '#FFFFFF').replace('/>', ' opacity=".7"/>');
        }
        return `<g>${vaVient('rotate', `-2.4 ${x1} ${y1}`, `2.4 ${x1} ${y1}`, dur, beg)}${g}</g>`;
      };
      s += guirlande(-10, 60, 336, 40, 40, 1.8, 0) + guirlande(-10, 130, 336, 110, 46, 2.2, 0.6);
      s += [0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => `<rect x="${i * 50 + 4}" y="250" width="7" height="58" fill="#EDE6D8" stroke="${OUT}" stroke-width="1.6"/><path d="M${i * 50 + 6},254 L${i * 50 + 6},304" stroke="#FFFFFF" stroke-width="1" opacity=".6"/>`).join('');
      s += `<rect x="-4" y="244" width="408" height="12" rx="4" fill="#F4EEDF" stroke="${OUT}" stroke-width="2"/>` + L([0, 247], [400, 247], '#FFFFFF', 1.4);
      s += `<g>${vaVient('rotate', '-6 84 248', '6 84 248', 2.6)}${trait('M84,248 L84,252', '#C8A86A', 2)}<circle cx="84" cy="270" r="22" fill="url(#poB)" stroke="${OUT}" stroke-width="2.4"/><circle cx="84" cy="270" r="11" fill="#4A3322" stroke="${OUT}" stroke-width="2"/>${[45, 135, 225, 315].map(a => `<rect x="80" y="248" width="8" height="10" fill="#F4EEDF" stroke="${OUT}" stroke-width="0.8" transform="rotate(${a} 84 270)"/>`).join('')}${trait('M68,258 Q74,252 82,250', '#FFFFFF', 2, 'opacity=".6"')}</g>`;
      return s + pluie(60, 0.38, 7, 1.3);
    },
    devant: () => pluie(34, 0.28, 13, 1.8)
  };
  // ===== 1b — la vague énorme monte et couvre l'écran (une fois), puis l'écume roule =====
  S['01_vague'] = {
    fond: () => {
      let s = ciel('vgC', TEMPETE.ciel) + `<rect x="0" y="250" width="400" height="150" fill="#6B4E36"/><rect x="-4" y="244" width="408" height="12" rx="4" fill="#F4EEDF" stroke="${OUT}" stroke-width="2"/>`;
      s += `<defs>${lin('vgV', [[0, '#3E6890'], [0.4, '#1E3A60'], [1, '#0E1E38']])}</defs>`;
      const v = P('M-30,560 L-30,270 Q120,150 260,190 Q340,204 368,250 Q340,270 300,262 Q330,300 420,320 L420,560 Z', 'url(#vgV)', 3)
        + trait('M10,250 Q130,150 250,200', '#9FB6CF', 4) + trait('M260,190 Q330,200 362,244', '#E8F0F8', 6)
        + [[300, 240, 8], [330, 250, 6], [350, 232, 5], [272, 230, 5]].map(([x, y, r]) => E(x, y, r, r * 0.8, '#E8F0F8', 1)).join('');
      // elle monte de 330 au-dessus du bas jusqu'à tout couvrir, puis roule sur place
      s += `<g transform="translate(0 260)"><g>${uneFois('translate', '0 0;0 -150;0 -330', '0;0.45;1', 1.6)}<g>${vaVient('translate', '-8 0', '8 4', 1.8)}${v}</g></g></g>`;
      return s + pluie(50, 0.35, 17);
    }
  };
  // ===== 1b — le noir ; la mer, très loin =====
  S['01_noir'] = {
    fond: () => `<rect x="0" y="0" width="400" height="400" fill="#05080F"/>`
      + `<g>${defile('0 0', '70 0', 7)}${trait('M-80,300 q35,-3 70,0 t70,0 t70,0 t70,0 t70,0 t70,0 t70,0', 'rgb(120,150,190)', 2, 'opacity=".32"')}</g>`
      + `<g>${defile('60 0', '0 0', 9)}${trait('M-60,312 q30,-2 60,0 t60,0 t60,0 t60,0 t60,0 t60,0 t60,0 t60,0', 'rgb(120,150,190)', 1.6, 'opacity=".18"')}</g>`
      + `<g opacity="0">${palpite('opacity', '0;0.3;0', 5)}<ellipse cx="200" cy="304" rx="120" ry="10" fill="rgb(120,150,190)"/></g>`
  };
  // ===== 1c — la plage de Brumelune, la nuit, dans la brume ; des débris, la chaise longue retournée =====
  S['01_greve'] = {
    fond: () => ciel('gcC', NUIT.ciel, 240) + etoiles(20, 170, 41) + lune('gcL', 300, 70) + mer('gcM', 190, 250, NUIT.mer) + reflet(300, 196)
      + nappe(200, 0.18, 15) + sable('gcS', 250) + H.planche(40, 296, 96, -8) + H.planche(300, 326, 70, 12) + H.chaiseLongue(300, 286, 168) + nappe(300, 0.14, 19, 26, 1.2),
    devant: () => nappe(370, 0.16, 17, 34, 1.4)
  };
  // ===== 1d — la vague dépose le gilet de sauvetage à ses pieds, puis lèche le sable sans fin =====
  S['01_gilet'] = {
    fond: () => {
      let s = ciel('glC', NUIT.ciel, 150) + etoiles(16, 120, 51) + mer('glM', 130, 214, NUIT.mer) + `<defs>${lin('glS', [[0, NUIT.sable.haut], [1, NUIT.sable.bas]])}</defs>` + P('M0,214 Q200,200 400,210 L400,400 L0,400 Z', 'url(#glS)', 2);
      // la nappe d'eau qui monte et redescend sur le sable
      s += `<g>${vaVient('translate', '0 -4', '0 14', 3.6)}${P('M0,214 Q100,206 200,218 Q300,230 400,212 L400,208 Q200,198 0,212 Z', 'rgba(220,232,245,.5)', 0)}${trait('M0,214 Q100,206 200,218 Q300,230 400,212', '#E8F2FC', 1.6, 'opacity=".7"')}</g>`;
      // le gilet, posé par la vague, qui bouge encore un peu au ressac
      const gilet = `<g transform="scale(0.9)">` + P('M-60,-36 Q-62,-48 -40,-50 L-14,-50 Q-8,-30 0,-30 Q8,-30 14,-50 L40,-50 Q62,-48 60,-36 L56,34 Q56,46 40,46 L-40,46 Q-56,46 -56,34 Z', '#F28A2E', 3)
        + L([0, -30], [0, 46], '#C86A1E', 2) + `<rect x="-56" y="-4" width="112" height="9" fill="#E8E4DA" stroke="${OUT}" stroke-width="1.6"/>` + H.texte(0, 28, 'L’HIRONDELLE', 10.5, '#3C2819', 'font-weight="bold" letter-spacing="0.6" opacity="0.75"') + trait('M-48,-38 Q-46,-46 -36,-46', '#FFC88A', 2.4) + '</g>';
      s += `<g transform="translate(266 312)"><g>${uneFois('translate', '20 -60;6 -16;0 0', '0;0.6;1', 2.2)}${uneFois('rotate', '-30;-6;-9', '0;0.6;1', 2.2)}<g>${vaVient('rotate', '-1.5', '1.5', 3.6)}${gilet}</g></g></g>`;
      return s + nappe(170, 0.16, 16);
    }
  };
  // ===== 2a — une lueur erre dans la brume, s'arrête, repart =====
  S['02_lueur'] = {
    fond: () => greve('lu', 240, 61) + halo('luH', 300, 186, 44)
      + `<g><animateMotion dur="9s" repeatCount="indefinite" calcMode="spline" keyPoints="0;0.25;0.5;0.75;1" keyTimes="0;0.25;0.5;0.75;1" keySplines="0.45 0 0.55 1;0.45 0 0.55 1;0.45 0 0.55 1;0.45 0 0.55 1" path="M0,0 C-20,-10 -44,-20 -38,-16 C-30,-28 -10,-30 -8,-28 C10,-24 28,-12 30,-10 C20,0 6,4 0,0"/>${halo('luB', 300, 182, 40, '200,225,240', 0.5)}${brume('luR', 300, 196, 1.2)}</g>`
      + nappe(232, 0.2, 13, 30, 1.3),
    devant: () => nappe(370, 0.14, 18, 34, 1.4)
  };
  // ===== 2b — elle approche d'un coup : une flamme, deux grands yeux =====
  S['02_approche'] = {
    fond: () => greve('ap', 260, 71) + `<g transform="translate(270 300)"><g>${uneFois('scale', '0.3;1.08;1', '0;0.7;1', 0.55)}<g transform="translate(-270 -300)">${halo('apH', 270, 200, 110, '200,225,240', 0.4)}${brume('apB', 270, 300, 3.8, 'surpris', 1.8)}</g></g></g>`,
    devant: () => nappe(384, 0.14, 15, 30, 1.4)
  };
  // ===== 2c — Brume se cache derrière un rocher et passe la tête =====
  S['02_rocher'] = {
    fond: () => greve('ro', 250, 81) + `<g>${vaVient('translate', '0 14', '0 -6', 3.2)}${halo('roH', 290, 186, 60)}${brume('roB', 290, 200, 2.4, 'gene', 3.2, 0.3)}</g>` + rocher('roR', 216, 300, 160, 86)
  };
  // ===== 2d — elle tourne autour de l'avatar, bien trop près (derrière lui, puis devant) =====
  const TOUR_DUR = 6;
  const tour = (devant) => {
    // une ellipse autour de l'avatar ; derrière lui sur la moitié haute du tour (calque fond), devant sur la moitié basse
    const path = 'M100,0 A100,58 0 0 0 -100,0 A100,58 0 0 0 100,0';
    const vis = devant ? '0;0;1;1;0' : '1;1;0;0;1';
    return `<g transform="translate(200 300)"><g opacity="${devant ? 0 : 1}"><animate attributeName="opacity" values="${vis}" keyTimes="0;0.49;0.5;0.99;1" calcMode="discrete" dur="${TOUR_DUR}s" repeatCount="indefinite"/><animateMotion dur="${TOUR_DUR}s" repeatCount="indefinite" path="${path}"/>${halo(devant ? 'exH2' : 'exH1', 0, -40, 50)}${brume(devant ? 'exB2' : 'exB1', 0, 0, devant ? 2.4 : 2.2, 'surpris', 1.6)}</g></g>`;
  };
  S['02_examine'] = { fond: () => greve('ex', 250, 91) + tour(false), devant: () => tour(true) };
  // ===== 2e — elle se pose à hauteur de ses yeux =====
  S['02_yeux'] = {
    fond: () => ciel('byC', ['#141C36', '#2E3C5C']) + etoiles(30, 200, 101) + nappe(260, 0.2, 14) + nappe(340, 0.16, 18) + halo('byH', 250, 170, 150, '200,220,235', 0.35, 3.6),
    devant: () => brume('byB', 250, 192, 5.4, 'neutre', 3.2, 0.25)
  };
  // ===== 2f — sa lueur s'avive et perce la brume : un village en ruine =====
  S['02_village'] = {
    fond: () => ciel('viC', NUIT.ciel, 260) + etoiles(24, 180, 111) + sable('viS', 250) + `<g opacity="0">${fondu('0;1', '0;1', 2.4)}${halo('viH', 200, 210, 180, '210,230,240', 0.32, 4)}</g>` + H.ruines()
      + `<g>${fondu('1;0.35', '0;1', 2.4)}${nappe(236, 0.3, 15)}${nappe(300, 0.22, 19, 26, 1.2)}</g>` + brume('viB', 226, 150, 2.2, 'neutre', 3)
  };
  // ===== 2g — elle se tourne vers la mer ; l'épave, à peine visible =====
  S['02_epave'] = {
    fond: () => ciel('epC', NUIT.ciel, 220) + etoiles(26, 150, 121) + mer('epM', 170, 260, NUIT.mer) + epave(270, 192, 0.9, 0.5) + nappe(186, 0.32, 16) + nappe(214, 0.24, 20) + sable('epS', 260) + brume('epB', 176, 232, 2, 'triste', 3.4)
  };
  // ===== 2h — elle revient près de l'avatar, toute petite =====
  S['02_proche'] = {
    fond: () => greve('pr', 250, 131) + halo('prH', 258, 252, 46),
    devant: () => brume('prB', 258, 272, 1.3, 'content', 2.2)
  };
  // ===== 3a — Brume tire du creux d'un rocher, à grand-peine, le livre aux sept sceaux =====
  S['03_livre'] = {
    fond: () => greve('li', 250, 141) + rocher('liR', 214, 330, 180, 140) + E(318, 262, 32, 20, '#1A1E2B', 2)
      // elle tire, le livre sort un peu, retombe, ressort : un effort qui recommence
      + `<g>${vaVient('translate', '0 0', '-26 8', 2.4)}${vaVient('rotate', '0 316 264', '6 316 264', 2.4)}${H.grimoire(316, 264, 0.95, -6)}</g>`
      + `<g>${vaVient('translate', '0 0', '-18 2', 2.4)}${brume('liB', 268, 266, 2.2, 'gene', 1.2)}</g>`
  };
  // ===== 3e — un vent se lève et chasse la brume : la plage de Brumelune, l'épave, le bois flotté, les rochers =====
  S['03_vent'] = {
    fond: () => {
      let s = ciel('veC', NUIT.ciel, 220) + etoiles(26, 150, 151) + lune('veL', 80, 60, 12) + mer('veM', 170, 240, NUIT.mer) + `<g opacity=".4">${fondu('0.4;0.95', '0;1', 3)}${epave(300, 186, 0.8, 1)}</g>` + sable('veS', 240)
        + H.planche(40, 282, 80, -10) + H.planche(290, 304, 60, 8) + rocher('veR1', 4, 276, 76, 44) + rocher('veR2', 330, 262, 70, 34);
      // la brume part vers la droite et s'efface (une fois)
      s += `<g>${uneFois('translate', '0 0;420 0', '0;1', 3.2)}${fondu('1;0.6;0', '0;0.6;1', 3.2)}${nappe(200, 0.5, 9)}${nappe(260, 0.5, 11, 30, 1.3)}${nappe(330, 0.4, 13, 30, 1.2)}</g>`;
      // les traits du vent, sans fin
      return s + [0, 1, 2].map(i => `<g>${defile('-200 0', '460 0', 2.2, i * 0.7)}${trait(`M0,${110 + i * 60} q60,-16 120,0 q30,8 60,-6`, 'rgb(230,240,250)', 3, 'opacity=".55"')}</g>`).join('');
    }
  };
  // ===== 5d — le feu prend ; la brume recule ; l'avatar tend les mains =====
  S['05_feu'] = {
    fond: () => ciel('feC', NUIT.ciel, 240) + etoiles(40, 170, 9, true) + lune('feL', 70, 64) + mer('feM', 176, 242, NUIT.mer) + reflet(70, 184) + epave(330, 202, 0.6, 0.55) + sable('feS', 240)
      + `<g>${uneFois('scale', '1 1;1.12 1', '0;1', 2.4)}${nappe(232, 0.22, 16, 34)}${nappe(302, 0.16, 21, 26)}</g>` + feu('feF', 222, 334, 1.8, true) + brume('feB', 270, 300, 1.8, 'content')
  };
  // ===== 6h — la nuit autour du feu ; au loin, sur les rochers, une silhouette regarde la lueur =====
  S['06_silhouette'] = {
    fond: () => ciel('siC', NUIT.ciel, 230) + etoiles(30, 160, 161, true) + mer('siM', 170, 230, NUIT.mer) + nappe(200, 0.2, 16) + sable('siS', 230) + rocher('siR', 270, 236, 120, 70)
      + `<g>${vaVient('translate', '0 0', '0 -0.8', 4)}${P('M330,164 L331,140 Q332,132 340,131 Q348,132 349,140 L350,164 L345,164 L344,150 L336,150 L335,164 Z', '#0C101C', 0)}${E(340, 124, 5.6, 6.2, '#0C101C', 0)}</g>`
      + `<g>${palpite('opacity', '0.4;0.8;0.5;0.75;0.4', 1.3)}${trait('M331,162 L332,140 Q333,133 339,132 M335.2,121 Q336,119 338,118.4', 'rgb(255,190,120)', 1.2)}</g>`
      + feu('siF', 176, 336, 1.6) + brume('siB', 226, 300, 1.5, 'surpris')
  };
  return S;
};
