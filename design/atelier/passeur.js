// Le Passeur (HISTOIRE.md § 8, acte VII) : grand et silencieux, cape de plumes grises et capuche, visage dans l'ombre où
// luisent deux yeux pâles, lanterne au bout d'une longue perche. Il parle en énigmes.
// Action : il lève sa lanterne, la lumière s'agrandit ; image 2 : des volutes de brume s'enroulent autour.
const { OUT, P, E, L, limb, clip, expression, arm, r2 } = require('./troupe');

const C = {
  skin: '#C9C4BC', skinS: '#A9A39A', shadow: '#3A3F4A', shadowS: '#2A2E37', glowEye: '#F6E7A0',
  feather: '#9AA0A8', featherS: '#7E848C', featherH: '#C2C7CE', pole: '#5A4632', iron: '#3E4248', light: '#FFE08A'
};
const HY = -0.6; // un peu plus grand que les naufragés (la pointe de la capuche reste dans le cadre)

// Rangées de plumes (festons) dans une zone découpée
const featherRows = (x0, x1, ys) => ys.map((y, r) => {
  let d = `M${x0},${y}`;
  for (let x = x0; x < x1; x += 3) d += ` Q${r2(x + 1.5)},${y + 2.2} ${r2(x + 3)},${y}`;
  return `<path d="${d}" fill="none" stroke="${r % 2 ? C.featherS : C.featherH}" stroke-width="0.7"/>`;
}).join('');
// Lanterne accrochée en haut de la perche ; big : lumière agrandie
function lantern(x, y, big = 0) {
  // lueur en dégradé qui s'éteint avant le bord du cadre (pas de coupure nette)
  const id = `pl${Math.round(x * 10)}${Math.round(y * 10)}${big}`;
  return `<defs><radialGradient id="${id}"><stop offset="0" stop-color="rgb(255,224,138)" stop-opacity="${0.6 + big * 0.2}"/><stop offset="1" stop-color="rgb(255,224,138)" stop-opacity="0"/></radialGradient></defs>`
    + `<circle cx="${x}" cy="${y + 4}" r="${5.2 + big * 1.2}" fill="url(#${id})"/>`
    + L([x, y - 2.6], [x, y], OUT, 0.7)
    + P(`M${r2(x - 2.4)},${y} L${r2(x + 2.4)},${y} L${r2(x + 3)},${y + 2} L${r2(x + 3)},${y + 6.4} L${r2(x - 3)},${y + 6.4} L${r2(x - 3)},${y + 2} Z`, C.light, 0.9)
    + L([x - 3, y + 2], [x + 3, y + 2], C.iron, 0.8) + L([x, y + 2], [x, y + 6.4], C.iron, 0.6)
    + P(`M${r2(x - 3.2)},${y + 6.4} L${r2(x + 3.2)},${y + 6.4} L${r2(x + 2.2)},${y + 7.8} L${r2(x - 2.2)},${y + 7.8} Z`, C.iron, 0.6)
    + E(x - 1, y + 3.6, 0.6, 1.2, '#FFFFFF', 0);
}
// Perche tenue en h, qui monte jusqu'en (top) puis un crochet vers la droite où pend la lanterne
function pole(h, top, big = 0) {
  const bottom = [h[0] - (top[0] - h[0]) * 0.18, h[1] + 7];
  return limb(bottom, [top[0], top[1]], 1.4, C.pole)
    + `<path d="M${top[0]},${top[1]} Q${top[0] + 1},${top[1] - 3} ${top[0] + 4.6},${top[1] - 2}" fill="none" stroke="${OUT}" stroke-width="2.6" stroke-linecap="round"/>`
    + `<path d="M${top[0]},${top[1]} Q${top[0] + 1},${top[1] - 3} ${top[0] + 4.6},${top[1] - 2}" fill="none" stroke="${C.pole}" stroke-width="1.2" stroke-linecap="round"/>`
    + lantern(top[0] + 4.6, top[1] + 0.6, big) + E(h[0], h[1], 2.1, 2.1, C.skin); // le poing par-dessus la perche
}

const CAPE = 'M15,33 Q24,29.6 33,33 L37.6,58.6 Q24,62 10.4,58.6 Z';
const ROBE = 'M16.4,33.2 Q24,30.6 31.6,33.2 L34,58 Q24,60.6 14,58 Z';

const passeur = {
  name: 'Le Passeur', uid: 'pa',
  skin: C.skin, skinS: C.skinS, sleeve: C.feather, cuff: C.featherS, armW: 4,
  leg: '#3A3F4A', legS: '#2A2E37', legW: 4.6, hip: 50, ground: 56.6,
  shoe: '#2E3138', shoeS: '#1E2026', shoeH: '#4A4E56',
  legX: { front: [20.6, 27.4], se: [20.2, 27.4], ne: [21, 27.8] },
  shoulders: [[16, 34.4], [32, 34.4]], hands: [[14.4, 45.6], [33.6, 45.6]],
  action: ['face_lanterne', 'front'],

  // la perche ne quitte pas sa main droite ; elle passe devant la capuche (à côté du visage)
  holdOver: true,
  hold(c, h) { return pole(h, [h[0] + 5.2, h[1] - 39]); },

  backItems(c, { view }) {
    if (view === 'ne') return '';
    return P(CAPE, C.feather) + clip(`${c.uid}k`, CAPE, `<rect x="27" y="30" width="12" height="32" fill="${C.featherS}"/>${featherRows(9, 39, [38, 43, 48, 53, 57])}`) + P(CAPE, 'none');
  },

  body(c, { view }) {
    const shape = view === 'ne' ? CAPE : ROBE;
    let s = P(shape, C.feather) + clip(`${c.uid}r`, shape, `<rect x="${view === 'se' ? 26 : 27.6}" y="30" width="12" height="32" fill="${C.featherS}"/>${featherRows(9, 39, [37, 41.4, 45.8, 50.2, 54.6])}`) + P(shape, 'none');
    if (view !== 'ne') s += P(`M${view === 'se' ? 22.4 : 24},34.4 L${view === 'se' ? 21.8 : 24},59`, 'none', 0.8);
    return s;
  },

  head(c, ctx) {
    const { view } = ctx;
    // capuche pointue de plumes, et dans l'ombre deux yeux qui luisent
    const hood = 'M10.6,30.4 Q9.6,14.6 18,8.6 Q23,4.8 27.2,3.4 Q27,6.8 30,8.4 Q38.4,13.2 37.4,30.4 Q36.6,34 33,34.6 L15,34.6 Q11.4,34 10.6,30.4 Z';
    let s = '';
    s += P(hood, C.feather) + clip(`${ctx.id}h`, hood, `<rect x="27.4" y="0" width="14" height="36" fill="${C.featherS}"/>${featherRows(8, 40, [12, 17, 22, 27, 32])}`) + P(hood, 'none');
    if (view === 'ne') return `<g transform="translate(0 ${HY})">${s}</g>`;
    const k = view === 'se' ? -1.6 : 0;
    const opening = `M${14.4 + k},30 Q${13.6 + k},14.6 ${24 + k},13.4 Q${34.4 + k},14.6 ${33.6 + k},30 Q${24 + k},34.4 ${14.4 + k},30 Z`;
    s += P(opening, C.shadow) + clip(`${ctx.id}o`, opening, `<ellipse cx="${24 + k}" cy="14" rx="12" ry="4.6" fill="${C.shadowS}"/>`) + P(opening, 'none');
    s += expression({
      eyes: view === 'se' ? [[20.4 + k + 1.4, 22.8, 1.25], [27.4 + k + 1.4, 22.8, 1.1]] : [[20.2, 22.8, 1.3], [27.8, 22.8, 1.3]], ry: 1.7, eyeColor: C.glowEye,
      brow: 'none', browY: -3.4, browW: 0.8,
      mouth: [24 + k, 27.4], mw: 1.4, mouthC: C.shadowS, tongue: C.shadowS,
      neutral: () => '',
      cheeks: [], cheekY: 26, temple: [9.4, 22], anger: [9.4, 11], zz: [4.6, 13]
    }, ctx);
    return `<g transform="translate(0 ${HY})">${s}</g>`;
  },

  pose({ pose, n }) {
    if (pose === 'salut') {
      // il lève lentement la main gauche ; la perche reste dans la droite
      const h = this.hands[1];
      return { left: arm(this, [16, 34.4], n === 0 ? [10.6, 26.6] : [9.6, 28.4]), right: arm(this, [32, 34.4], h), over: pole(h, [h[0] + 5.2, h[1] - 39]) };
    }
    // action : la perche levée, la lanterne flamboie ; image 2 : volutes de brume
    const h = n ? [34.4, 36.4] : [34, 38.6];
    const wisps = n ? ['M8,20 Q4,14 10,10 Q15,8 13,4', 'M40,40 Q46,36 43,30', 'M6,44 Q2,40 6,36'].map(d => `<path d="${d}" fill="none" stroke="#E6EEF5" stroke-width="1.6" stroke-linecap="round" opacity="0.8"/>`).join('') : '';
    return { expr: n ? 'surpris' : 'neutre', right: arm(this, [32, 34.4], h, [36.4, 40.4]), over: pole(h, [h[0] + 4.2, 5.6], 1) + wisps };
  }
};
passeur.pose = passeur.pose.bind(passeur);
module.exports = passeur;
