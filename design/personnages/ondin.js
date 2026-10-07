// Ondin, le petit sourcier : 10 ans, ciré bleu trop grand aux manches retroussées, bonnet de nuit, pieds nus,
// baguette de noisetier fourchue, bocal vide à la ceinture de corde ; toujours à moitié endormi.
// Action : baguette tenue à deux mains, pointe en l'air ; image 2 : elle plonge vers le sol et il se réveille d'un coup.
const { OUT, P, E, L, limb, clip, expression, arm, bareFoot, r2 } = require('./troupe');

const C = {
  skin: '#F5CFA8', skinS: '#E0AE86',
  hair: '#E2B45A', hairS: '#B98A3A', hairH: '#F6D58E', brow: '#8C6526',
  coat: '#3D7CC9', coatS: '#2E5F9E', coatH: '#7DB0E8', lining: '#A9CBEF',
  cap: '#BFD3F2', capS: '#93AEDB', cream: '#F4EEDF',
  rope: '#D8C08A', wood: '#A8743F', leaf: '#7BB661',
  glass: '#D6ECF2', cork: '#B07E4C', water: '#A9DCFF',
  cheek: '#F6A0A0', mouth: '#7A3B30', tongue: '#E07A72'
};
const HY = 4.4; // tête d'enfant : même taille que les adultes, posée plus bas sur un corps plus court

// Corde : contour fin puis couleur, le long d'un chemin
const cord = (d, w, color) => `<path d="${d}" fill="none" stroke="${OUT}" stroke-width="${w + 1.4}" stroke-linecap="round"/>`
  + `<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/>`;
// Goutte d'eau
const drop = (x, y, r) => P(`M${r2(x)},${r2(y - r * 1.7)} Q${r2(x + r * 1.5)},${r2(y + r * 0.2)} ${r2(x)},${r2(y + r)} Q${r2(x - r * 1.5)},${r2(y + r * 0.2)} ${r2(x)},${r2(y - r * 1.7)} Z`, C.water, 0.6);

// Baguette de noisetier fourchue, tenue par une branche en h ; side 1 : la tige part à droite, -1 : à gauche
function rod(h, side = 1) {
  const j = [h[0] + side * 0.6, h[1] + 2.4], b = [h[0] + side * 3.2, h[1] + 0.6], tip = [h[0] + side * 1.6, h[1] + 9];
  return limb(h, j, 1.1, C.wood) + limb(j, b, 1.1, C.wood) + limb(j, tip, 1.2, C.wood)
    + `<g transform="rotate(${side * -35} ${r2(b[0])} ${r2(b[1])})">${E(b[0] + side * 1.1, b[1], 1.3, 0.65, C.leaf, 0.6)}</g>`;
}

// Bocal vide : verre transparent (le ciré se voit au travers), bouchon de liège
function jar(x, y) {
  const d = `M${r2(x - 1.6)},${r2(y - 1.6)} L${r2(x + 1.6)},${r2(y - 1.6)} Q${r2(x + 2.1)},${r2(y - 1.2)} ${r2(x + 2)},${y} L${r2(x + 1.9)},${r2(y + 1.9)} Q${x},${r2(y + 2.6)} ${r2(x - 1.9)},${r2(y + 1.9)} L${r2(x - 2)},${y} Q${r2(x - 2.1)},${r2(y - 1.2)} ${r2(x - 1.6)},${r2(y - 1.6)} Z`;
  return `<path d="${d}" fill="${C.glass}" fill-opacity="0.65" stroke="${OUT}" stroke-width="0.8" stroke-linejoin="round"/>`
    + `<path d="M${r2(x - 1.1)},${r2(y - 0.6)} L${r2(x - 1.1)},${r2(y + 1.3)}" stroke="#FFFFFF" stroke-width="0.6" stroke-linecap="round"/>`
    + `<rect x="${r2(x - 1.3)}" y="${r2(y - 2.8)}" width="2.6" height="1.3" rx="0.4" fill="${C.cork}" stroke="${OUT}" stroke-width="0.7"/>`;
}

const COAT = 'M15.8,37.4 Q24,35 32.2,37.4 L35,52.4 Q24,55 13,52.4 Z';

// Bonnet de nuit rayé, la pointe retombe à droite de l'écran (miroir pour le dos)
const CAP = 'M12,13.8 Q12.6,4.6 23.4,3.8 Q34.4,3.2 39.6,10.8 Q42.8,16 41.8,23.4 Q40.2,17 36.4,13.6 Q30,11.4 24,11.6 Q17,11.6 12,13.8 Z';
function cap(uid) {
  const stripes = [20, 28, 36, 44].map(x => `<path d="M${x},0 L${x + 2.6},0 L${x - 5.4},22 L${x - 8},22 Z" fill="${C.cream}"/>`).join('');
  return P(CAP, C.cap) + clip(`${uid}k`, CAP, `<rect x="8" y="0" width="38" height="22" fill="${C.capS}"/><ellipse cx="22" cy="5.6" rx="17" ry="9.4" fill="${C.cap}"/>${stripes}`)
    + P(CAP, 'none') + E(41.6, 24.4, 2.2, 2.2, C.cream) + E(42.2, 25.2, 0.8, 0.7, '#DCCDB5', 0);
}

const ondin = {
  name: 'Ondin', uid: 'on',
  skin: C.skin, skinS: C.skinS, sleeve: C.coat, cuff: C.lining, armW: 4.4,
  leg: C.skin, legS: C.skinS, legW: 4.2, hip: 50.4, ground: 56.8, foot: bareFoot,
  legX: { front: [21, 27], se: [20.6, 27.2], ne: [21.4, 27.6] },
  shoulders: [[16.4, 38.8], [31.6, 38.8]], hands: [[14.8, 48.2], [33.2, 48.2]],
  action: ['face_baguette', 'front'],

  // la baguette ne quitte pas sa main droite (repos et marche)
  hold(c, h) { return rod(h, 1); },

  body(c, { view }) {
    const se = view === 'se';
    let s = P(COAT, C.coat) + clip(`${c.uid}c`, COAT, `<rect x="${se ? 26.2 : 27.8}" y="34" width="10" height="22" fill="${C.coatS}"/>`
      + `<path d="M12,52 Q24,54.8 36,52 L36,57 L12,57 Z" fill="${C.coatS}"/>`
      + `<rect x="14.6" y="39" width="1.3" height="11" rx="0.65" fill="${C.coatH}"/>`) + P(COAT, 'none');
    if (view === 'ne') {
      // de dos : couture, capuche rabattue, ceinture de corde
      s += P('M24,42.4 L24,53.8', 'none', 0.7);
      s += P('M16.8,37.6 Q24,41.6 31.2,37.6 L31.8,42.4 Q24,45.6 16.2,42.4 Z', C.coat) + P('M17.8,41.2 Q24,44 30.2,41.2', 'none', 0.7);
      return s + cord('M13.9,46.4 Q24,48.6 34.1,46.4', 1.1, C.rope);
    }
    const k = se ? -1.6 : 0;
    // grand col rabattu, ouverture, chevilles de bois
    s += P(`M${17 + k},37.2 Q${21 + k},37.4 ${24 + k},40.2 L${20.6 + k},42 Z`, C.coatS, 0.8)
      + P(`M${31 + k},37.2 Q${27 + k},37.4 ${24 + k},40.2 L${27.4 + k},42 Z`, C.coatS, 0.8);
    s += P(`M${24 + k},40 L${24 + k + (se ? -0.6 : 0)},53.8`, 'none', 0.9);
    for (const y of [42.6, 50.4]) s += `<rect x="${r2(24.5 + k)}" y="${y - 0.5}" width="2.4" height="1" rx="0.5" fill="${C.wood}" stroke="${OUT}" stroke-width="0.5"/>`;
    // ceinture de corde nouée, bocal vide qui pend
    s += cord('M13.9,45.6 Q24,47.6 34.1,45.6', 1.1, C.rope);
    s += cord(`M${20.2 + k},47 L${19.4 + k},49.6`, 0.8, C.rope) + cord(`M${20.8 + k},47 L${21.4 + k},49.4`, 0.8, C.rope) + E(20.5 + k, 46.9, 1.1, 0.9, C.rope, 0.7);
    s += L([27.6 + k, 47.1], [27.6 + k, 48.4], OUT, 0.6) + jar(27.6 + k, 50.6);
    return s;
  },

  // de dos : la nuque (dans l'ombre) entre les boucles, rentrée sous le col du ciré
  neck(c, { view }) {
    if (view !== 'ne') return '';
    return P('M19.8,30.4 L28.2,30.4 L28.4,36.55 Q24,35.85 19.6,36.55 Z', C.skinS, 0) + P('M19.6,36.55 Q24,35.85 28.4,36.55', 'none');
  },

  head(c, ctx) {
    const { view } = ctx;
    let s = '';
    if (view === 'ne') {
      // de dos, la tête descend aussi bas que de face : les boucles couvrent le haut des bras et le col du ciré,
      // la nuque se voit entre celles du milieu (elle est dessinée sous le col : neck)
      const back = 'M11,21 Q10,8.6 24,8.4 Q38,8.6 37,21 Q37.4,28 36,31 L35.6,33.2 L34,32 L33,34 L31.4,32.4 L30,34 L28.6,32.4 L27.2,33.8 Q25.8,30.4 24,29.2 Q22.2,30.4 20.8,33.8 L19.4,32.4 L18,34 L16.6,32.4 L15,34 L14,32 L12.4,33.2 L12,31 Q10.6,28 11,21 Z';
      s += E(12.6, 23, 1.6, 2.2, C.skin);
      s += P(back, C.hair) + clip(`${c.uid}h`, back, `<rect x="8" y="6" width="34" height="30" fill="${C.hairS}"/><ellipse cx="22.4" cy="19.4" rx="13.8" ry="12" fill="${C.hair}"/>`) + P(back, 'none');
      s += P('M18.4,19 Q17.8,25.4 19.2,31.4', 'none', 0.6) + P('M28.8,19 Q29.8,25.4 28.6,31.4', 'none', 0.6);
      // bonnet vu de dos : le revers fait le tour du crâne, la pointe retombe à gauche de l'écran
      s += `<g transform="translate(48 0) scale(-1 1)">${cap(c.uid)}</g>`;
      s += P('M11.2,13.4 Q24,16.8 36.8,13.4 L37,15.6 Q24,19 11,15.6 Z', C.cream, 0.9);
      return `<g transform="translate(0 ${HY})">${s}</g>`;
    }
    const se = view === 'se';
    const k = se ? -1.4 : 0;
    const sx = d => d.replace(/(-?\d+\.?\d*),(-?\d+\.?\d*)/g, (m, x, y) => `${r2(+x + k)},${y}`);
    const back = se ? 'M12,21.6 Q10.6,10.6 24,10.4 Q38.2,10.6 37.4,21.6 Q37.6,26.4 35.6,27.2 L14,27.2 Q12.2,26.4 12,21.6 Z'
      : 'M11.4,21 Q10.6,11 24,10.6 Q37.4,11 36.6,21 Q36.8,25.4 35,26.6 L13,26.6 Q11.2,25.4 11.4,21 Z';
    const fx = se ? 22.6 : 24, rx = se ? 11.2 : 11.6;
    const face = `M${fx - rx},21.6 a${rx},10.4 0 1,0 ${2 * rx},0 a${rx},10.4 0 1,0 ${-2 * rx},0 Z`;
    // frange en boucles douces sous le revers du bonnet ; mèches qui s'échappent sur les côtés
    const bangs = sx('M12,19.4 Q11.8,12.4 24,12.2 Q36.2,12.4 36,19.4 Q34.4,15.8 31.6,15.8 Q30,18 27.6,17.6 Q26.4,15.4 24,15.6 Q21.6,15.4 20.4,17.6 Q18,18 16.4,15.8 Q13.6,15.8 12,19.4 Z');
    s += (se ? '' : P('M11.8,17.4 Q8.4,18 8.8,21.2 Q10.2,19.6 11.8,19.8 Z', C.hair)) + P(sx('M36.2,17.4 Q39.6,18 39.2,21.2 Q37.8,19.6 36.2,19.8 Z'), C.hair);
    s += P(back, C.hair) + clip(`${c.uid}h`, back, `<rect x="8" y="24.2" width="32" height="6" fill="${C.hairS}"/>`) + P(back, 'none');
    if (se) s += E(35, 23.2, 1.5, 2.1, C.skin);
    const cheeks = se ? [[15, 2], [28.2, 1.6]] : [[16.4, 2.2], [31.6, 2.2]];
    s += P(face, C.skin);
    s += clip(`${c.uid}f`, face, `<path d="${bangs}" fill="${C.skinS}" transform="translate(0 1.4)"/>`
      + cheeks.map(([x, r]) => E(x, 26.2, r * (ctx.expr === 'gene' ? 1.3 : 1), ctx.expr === 'gene' ? 1.6 : 1.2, C.cheek, 0)).join(''));
    s += P(face, 'none');
    s += P(bangs, C.hair) + L([16.4 + k, 14.6], [21.2 + k, 13.9], C.hairH, 1);
    s += `<g transform="translate(${k} 0)">${cap(c.uid)}${P('M11.6,13 Q24,8.6 36.4,13 L36.6,15.2 Q24,10.8 11.4,15.2 Z', C.cream, 0.9)}</g>`;
    s += expression({
      eyes: se ? [[17.2, 22.6, 1.65], [25.2, 22.6, 1.45]] : [[19.4, 22.6, 1.7], [28.6, 22.6, 1.7]], ry: 2.5,
      brow: C.brow, browY: -4.3, browW: 1,
      // au repos : les yeux mi-clos (la brume le tient encore), une toute petite bouche
      restEyes: 'sleepy',
      mouth: [se ? 20.8 : 24, 27.2], mw: 1.5, mouthC: C.mouth, tongue: C.tongue,
      neutral: (mx, my) => `M${r2(mx - 0.9)},${r2(my + 0.4)} Q${mx},${r2(my + 1.1)} ${r2(mx + 0.9)},${r2(my + 0.4)}`,
      cheeks, cheekY: 26.2, temple: [se ? 13.4 : 12.4, 22.6], anger: [8.4, 8.6], zz: [6.6, 6.4]
    }, ctx);
    return `<g transform="translate(0 ${HY})">${s}</g>`;
  },

  pose({ pose, n }) {
    if (pose === 'salut') {
      // il salue de la main droite ; la baguette passe dans la gauche
      return { open: true, left: rod(this.hands[0], -1) + arm(this, this.shoulders[0], this.hands[0]), right: arm(this, [31.6, 38.8], n === 0 ? [36.6, 30.6] : [38, 32.6]) };
    }
    // action : baguette à deux mains, pointe en l'air ; image 2 : elle plonge vers le sol (« Là ! Ça tire ! »)
    const j = [24, 45.2], hl = [19.4, 47.4], hr = [28.6, 47.4];
    const tip = n === 0 ? [24.4, 38] : [24.8, 53.6];
    const stick = limb(hl, j, 1.1, C.wood) + limb(hr, j, 1.1, C.wood) + limb(j, tip, 1.2, C.wood)
      + (n ? L([21.6, 48.6], [20.8, 50.6], OUT, 0.6) + L([27.6, 48.6], [28.4, 50.6], OUT, 0.6) + drop(20.8, 55, 0.9) + drop(28.8, 54.8, 0.9) : '');
    return {
      expr: n ? 'surpris' : 'neutre',
      left: stick + arm(this, [16.4, 38.8], hl, [12, 44.2]),
      right: arm(this, [31.6, 38.8], hr, [36, 44.2])
    };
  }
};
module.exports = ondin;
