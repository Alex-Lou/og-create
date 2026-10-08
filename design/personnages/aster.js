// Aster, la navigatrice : ciré jaune, foulard rouge, cheveux roux au vent, queue de cheval à
// ruban, taches de rousseur, longue-vue en laiton. Action : elle regarde dans sa longue-vue (trois quarts avant).
const { P, E, L, clip, expression, arm, r2, lerp } = require('./troupe');
const { capucheRabattue, reperes } = require('./avatar_accessoires');
// la capuche de son ciré relevée sous la pluie (tenues.js : la coiffe marquée capuche) : elle range la queue de cheval
const relevee = c => !!(c.coiffe && c.coiffe.capuche);

const C = {
  skin: '#F2C9A0', skinS: '#DDA982',
  hair: '#B94E3A', hairS: '#8E3328', hairH: '#DE7A57',
  coat: '#F2C04B', coatS: '#CC9A2F', coatH: '#FFE49A',
  scarf: '#C8463A', scarfS: '#9A2F28',
  brass: '#C9A24A', brassS: '#8E6E2C', brassH: '#F0D58A',
  cheek: '#F29E9A', freckle: '#C97B5A', mouth: '#7A3B30'
};

// Longue-vue : à la hanche, ou tenue (rot = angle)
function spyglass(x, y, rot, len = 9) {
  return `<g transform="translate(${r2(x)} ${r2(y)}) rotate(${rot})">`
    + `<rect x="-1.5" y="${-len / 2}" width="3" height="${len}" rx="0.8" fill="${C.brass}" stroke="#3C2819" stroke-width="0.9"/>`
    + `<rect x="-1.1" y="${-len / 2 + 0.6}" width="0.8" height="${len - 1.2}" rx="0.4" fill="${C.brassH}"/>`
    + `<rect x="-1.95" y="${-len / 2 - 0.4}" width="3.9" height="2.1" rx="0.6" fill="${C.brassS}" stroke="#3C2819" stroke-width="0.8"/>`
    + `<line x1="-1.5" y1="0.8" x2="1.5" y2="0.8" stroke="${C.brassS}" stroke-width="0.7"/></g>`;
}

// Longue-vue tenue à l'œil : oculaire en (x, y), le tube part vers la gauche ; ext 0 = repliée, 1 = déployée
function heldGlass(x, y, rot, ext) {
  const seg = [[2.2, 1.15, C.brassS], [1.2 + 3 * ext, 1.5, C.brass], [4.8, 1.9, C.brass]];
  let s = '', x0 = 0;
  for (const [len, h, fill] of seg) {
    s += `<rect x="${r2(x0 - len)}" y="${-h}" width="${r2(len)}" height="${2 * h}" rx="0.5" fill="${fill}" stroke="#3C2819" stroke-width="0.9"/>`
      + `<rect x="${r2(x0 - len + 0.5)}" y="${r2(-h + 0.4)}" width="${r2(Math.max(len - 1, 0.2))}" height="0.6" rx="0.3" fill="${C.brassH}"/>`;
    x0 -= len;
  }
  s += `<rect x="${r2(x0 - 1.6)}" y="-2.35" width="2" height="4.7" rx="0.6" fill="${C.brassS}" stroke="#3C2819" stroke-width="0.9"/>`;
  return `<g transform="translate(${r2(x)} ${r2(y)}) rotate(${rot})">${s}</g>`;
}
// Petit éclat (le large repéré)
const twinkle = (x, y, r) => P(`M${x},${r2(y - r)} Q${r2(x + r * 0.2)},${r2(y - r * 0.2)} ${r2(x + r)},${y} Q${r2(x + r * 0.2)},${r2(y + r * 0.2)} ${x},${r2(y + r)} Q${r2(x - r * 0.2)},${r2(y + r * 0.2)} ${r2(x - r)},${y} Q${r2(x - r * 0.2)},${r2(y - r * 0.2)} ${x},${r2(y - r)} Z`, '#FFF6C8', 0.6);

const COAT = 'M15.5,32.5 Q24,29.8 32.5,32.5 L35,47.5 Q24,51 13,47.5 Z';

const aster = {
  name: 'Aster', uid: 'as', teintes: [C.hair, C.coat, C.scarf, C.brass],
  skin: C.skin, sleeve: C.coat, cuff: null, armW: 3.9,
  leg: '#2F5684', legS: '#22416A', legW: 5.4, hip: 44.5, ground: 56.5,
  shoe: '#5E3A22', shoeS: '#43281A', shoeH: '#80583A',
  legX: { front: [20.5, 27.5], se: [20, 27.6], ne: [21, 28] },
  shoulders: [[16, 34], [32, 34]], hands: [[14.2, 45.2], [33.8, 45.2]],
  action: ['avant_longuevue', 'se'],

  // derrière le corps : capuche (face, trois quarts) ; longue-vue (de dos)
  backItems(c, { view }) {
    if (view === 'ne') return spyglass(15.4, 44, 18);
    return relevee(c) ? '' : capucheRabattue(c.uid, view, reperes(c), C.coat, C.coatS);
  },

  body(c, { view, pose }) {
    const shadeX = view === 'se' ? 26 : 27.5;
    let s = P(COAT, C.coat);
    s += clip(`${c.uid}c`, COAT, `<rect x="${shadeX}" y="30" width="10" height="22" fill="${C.coatS}"/>`
      + `<path d="M13,47 Q24,50.2 35,47 L35,52 L13,52 Z" fill="${C.coatS}"/>`
      + `<rect x="14.6" y="34" width="1.4" height="12" rx="0.7" fill="${C.coatH}"/>`);
    s += P(COAT, 'none');
    if (view === 'ne') {
      s += P('M24,34 L24,49.4', 'none', 0.7);
      // capuche rabattue sur le dos (la même pour tous : avatar_accessoires.js), sauf relevée sous la pluie
      if (!relevee(c)) s += capucheRabattue(c.uid, view, reperes(c), C.coat, C.coatS);
      return s;
    }
    const o = view === 'front' ? 24 : 21.5;
    s += P(`M${o},33.2 L${o + (view === 'se' ? -0.6 : 0)},49.6`, 'none', 0.9);
    for (const y of [37, 41, 45]) s += E(o + 1.6, y, 0.75, 0.75, C.coatS, 0.6);
    s += P(`M${view === 'se' ? 15.8 : 16.2},42.5 L${view === 'se' ? 19.2 : 20},42.3`, 'none', 0.8);
    if (pose !== 'action') s += spyglass(29.4, 44.8, -14);
    return s;
  },

  neck(c, { view }) {
    if (view === 'ne') {
      return P('M16.5,31 Q24,34.6 31.5,31 L32,34 Q24,37.6 16,34 Z', C.scarf)
        + P('M28.5,34.6 L31.4,41.2 L28.4,41.6 L27,35.4 Z', C.scarf) + P('M29,36 L30.6,40.4', 'none', 0.6);
    }
    const kx = view === 'se' ? 18.2 : 20.5;
    return P('M16.5,31 Q24,34.8 31.5,31 L32,34 Q24,38 16,34 Z', C.scarf)
      + P('M17.4,33.6 Q24,36.8 30.8,33.4', 'none', 0.6)
      + P(`M${kx},35.2 L${kx - 2},42 L${kx + 1.2},41.4 L${kx + 1.6},36 Z`, C.scarf)
      + E(kx + 0.6, 35.6, 1.9, 1.5, C.scarfS, 0.9);
  },

  head(c, ctx) {
    const { view } = ctx;
    const tufts = P('M23.4,7.8 Q27.4,1.6 34.6,3.4 Q30,4.6 27.8,8.8 Z', C.hair) + P('M19.8,8.6 Q18.6,5.6 16.2,5.8 Q18.2,7 18.6,9.2 Z', C.hair);
    let s = '';
    if (view === 'ne') {
      const back = 'M11,21 Q10,6 24,6 Q38,6 37,21 Q37.4,30.4 34.2,32.4 Q24,34.6 13.8,32.4 Q10.6,30.4 11,21 Z';
      s += (c.coiffe ? '' : tufts) + E(12.6, 23, 1.6, 2.2, C.skin);
      s += P(back, C.hair) + clip(`${c.uid}h`, back, `<rect x="8" y="4" width="34" height="32" fill="${C.hairS}"/><ellipse cx="22.4" cy="17.4" rx="14" ry="12.8" fill="${C.hair}"/>`) + P(back, 'none');
      s += P('M17,11 Q24,7.6 31,11', 'none', 0.8) + P('M19.6,12.6 Q18.8,20 20.4,27.6', 'none', 0.6) + P('M24.4,11.8 Q25.2,19.4 24.2,28.4', 'none', 0.6);
      s += L([18, 9.6], [23.4, 8.8], C.hairH, 1.3);
      if (!relevee(c)) s += P('M14.6,11.6 Q6.6,10.8 6.4,19 Q8.6,16.8 12.6,17.8 Z', C.hair) + E(13.4, 13.4, 1.5, 1.4, C.scarf, 0.9);
      if (c.coiffe) s += c.coiffe(c, ctx, 'tete');
      return s;
    }
    const se = view === 'se';
    const back = se ? 'M12,22 Q10.5,7 24,6.4 Q38.5,7 37.4,22 Q37.6,30 34.2,31.2 L15,31.2 Q12.2,29.8 12,22 Z'
      : 'M11,22 Q10,7 24,6 Q38,7 37,22 Q37,30 34,31 L14,31 Q11,30 11,22 Z';
    const fx = se ? 22.6 : 24;
    const face = `M${fx - (se ? 11.2 : 11.6)},21.6 a${se ? 11.2 : 11.6},10.4 0 1,0 ${2 * (se ? 11.2 : 11.6)},0 a${se ? 11.2 : 11.6},10.4 0 1,0 ${-2 * (se ? 11.2 : 11.6)},0 Z`;
    const bangs = se ? 'M11.6,19 Q12,8.6 23,8 Q34.6,7.8 35.4,17.6 L32.6,14.8 L31,18.6 L27.6,13.8 L24.4,18 L21.4,13.6 L18.2,17.8 L15.6,14.2 L13.4,19.4 Z'
      : 'M12,18.6 Q13,8 24,8 Q35,8 36,18.6 L33,15 L31,19 L28,14 L25,18.4 L22,14 L19,18 L16,14.4 L14,19.2 Z';
    // queue de cheval (côté gauche du personnage), mèches, cheveux de derrière ombrés
    if (!relevee(c)) s += P('M33.4,11.6 Q41.4,10.8 41.6,19 Q39.4,16.8 35.4,17.8 Z', C.hair) + E(34.6, 13.4, 1.5, 1.4, C.scarf, 0.9);
    if (!c.coiffe) s += tufts;
    s += P(back, C.hair) + clip(`${c.uid}h`, back, `<rect x="8" y="25" width="32" height="8" fill="${C.hairS}"/>`) + P(back, 'none');
    if (se) s += E(35, 23.2, 1.5, 2.1, C.skin);
    // visage : ombre sous la frange, joues et taches de rousseur découpées par le visage (rien ne dépasse)
    const fr = se ? [[15.8, 24.7], [17, 25.4], [14.9, 25.2], [26.8, 24.8], [27.8, 25.4]]
      : [[17.6, 24.8], [18.8, 25.5], [16.6, 25.3], [30.4, 24.8], [29.2, 25.5], [31.4, 25.3]];
    const cheeks = se ? [[15.2, 1.9], [28.2, 1.5]] : [[16.6, 2], [31.4, 2]];
    s += P(face, C.skin);
    s += clip(`${c.uid}f`, face, `<path d="${bangs}" fill="${C.skinS}" transform="translate(0 1.4)"/>`
      + cheeks.map(([x, rx]) => E(x, 26.2, rx * (ctx.expr === 'gene' ? 1.3 : 1), ctx.expr === 'gene' ? 1.6 : 1.15, C.cheek, 0)).join('')
      + fr.map(([x, y]) => E(x, y, 0.38, 0.38, C.freckle, 0)).join(''));
    s += P(face, 'none');
    s += P(bangs, C.hair) + L(se ? [15.6, 11.4] : [17, 11.2], se ? [22.6, 9.6] : [24, 9.6], C.hairH, 1.3);
    if (c.coiffe) s += c.coiffe(c, ctx, 'tete');
    // expression : sourcils par-dessus la frange ; au repos, petit sourire en coin (sûre d'elle)
    s += expression({
      eyes: se ? [[17.2, 22.6, 1.55], [25.2, 22.6, 1.35]] : [[19.4, 22.6, 1.6], [28.6, 22.6, 1.6]], ry: 2.35,
      brow: '#6B2620', browY: -4.1, browW: 1.05,
      mouth: [se ? 20.8 : 24, 27], mw: 1.7, mouthC: C.mouth, tongue: '#E07A72',
      neutral: (mx, my) => `M${r2(mx - 1.3)},${r2(my + 0.4)} Q${r2(mx + 0.3)},${r2(my + 1.2)} ${r2(mx + 1.6)},${my}`,
      cheeks, cheekY: 26.2, temple: [se ? 12.6 : 13.4, 12.4], anger: [40, 6.8], zz: [36.4, 5.8]
    }, ctx);
    return s;
  },

  pose({ pose, n, k }) {
    if (pose === 'salut') {
      return { open: true, right: arm(this, [32, 34], lerp([37.4, 25.4], [38.8, 27.4], k)) };
    }
    // action : longue-vue collée à l'œil proche, pointée vers le large, l'autre œil fermé ;
    // image 1 : repliée, image 2 : déployée, un éclat au loin ;
    // coude levé sur le côté, la main sous le tube ; l'autre poing sur la hanche, coude sorti
    const ext = n === 0 ? 0 : 1;
    const near = arm(this, [15.4, 33.2], [12.6, 24.8], [10.2, 31.4]); // attaché au coin de l'épaule, coude à hauteur d'épaule
    const hip = arm(this, [32, 34], [32.6, 42.8], [37.4, 38.4]);
    return { expr: 'neutre', eyeMode: 'wink', left: '', right: hip, over: heldGlass(16.4, 22.8, 4, ext) + near + (ext ? twinkle(2.8, 18.6, 1.9) : '') };
  }
};
module.exports = aster;
