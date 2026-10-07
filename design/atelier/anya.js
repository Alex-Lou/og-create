// Anya, l'Âme de l'Île (HISTOIRE.md § 8) : deux fois la taille d'un naufragé, élancée et lumineuse. Couronne en bois de
// cerf fleuris où niche un petit oiseau, chevelure de feuilles en cascade, veines dorées, gemme verte au front (la Terre
// du Grimoire), yeux d'or vert, manteau vivant or et vert (une grande feuille aux nervures d'or qui luisent, un col
// de fourrure dorée, des plumes et des papillons), pieds nus qui font éclore des fleurs, halo de lucioles.
// Repère 80 × 128, pieds en bas au centre (40, 125). Vues face, trois quarts avant et dos.
const { OUT, P, E, L, clip, expression, arm, r2 } = require('./troupe');

const C = {
  skin: '#EFE6CF', skinS: '#D6CBB0', vein: '#E8B84A',
  hair: '#79C267', hairS: '#4F9A4C', hairH: '#C8EE9A',
  antler: '#9C7350', antlerS: '#76543A', petal: '#F7C6D9', white: '#FFFFFF', heart: '#F2C94C',
  dress: '#FBF4E2', dressS: '#E8DABA', gold: '#E8B84A',
  fur: '#4E8F4C', furS: '#3D7440', mvein: '#F7D774', collar: '#EBC66E', collarS: '#C99A45', paleG: '#C8EE9A', paleGold: '#F7E3A1',
  wingO: '#F2B53B', wingB: '#FFF3C4', bird: '#5C9CE0', eye: '#4E6B18',
  cheek: '#F2B0A8', mouth: '#7A4A3A', tongue: '#E07A72', glow: '255,225,140'
};
const AR = { armW: 3.8, sleeve: C.skin, cuff: null, skin: C.skin };

const flower = (x, y, r, petal = C.petal) => [0, 72, 144, 216, 288].map(a => E(x + Math.cos(a * Math.PI / 180) * r, y + Math.sin(a * Math.PI / 180) * r, r * 0.75, r * 0.75, petal, 0.5)).join('') + E(x, y, r * 0.55, r * 0.55, C.heart, 0.4);
const firefly = (x, y, k = 1) => `<circle cx="${r2(x)}" cy="${r2(y)}" r="${r2(2.6 * k)}" fill="rgb(255,236,150)" fill-opacity="0.35"/>` + E(x, y, 0.9 * k, 0.9 * k, '#FFF3A8', 0.4);
const branch = (d, w) => `<path d="${d}" fill="none" stroke="${OUT}" stroke-width="${w + 1.6}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${C.antler}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
const leaf = (x, y, len, w, rot, fill = C.hair) => `<g transform="translate(${r2(x)} ${r2(y)}) rotate(${rot})">${P(`M0,0 Q${w},${r2(len / 2)} 0,${len} Q${-w},${r2(len / 2)} 0,0 Z`, fill, 0.6)}</g>`;
const feather = (x, y, rot, fill) => `<g transform="translate(${r2(x)} ${r2(y)}) rotate(${rot})">${P('M0,0 Q2.4,4 0,9 Q-2.4,4 0,0 Z', fill, 0.6)}${L([0, 1], [0, 8], OUT, 0.35)}</g>`;
const butterfly = (x, y, open, fill) => `<g transform="translate(${r2(x)} ${r2(y)})">${P(`M0,0 Q${r2(-3.2 * open)},-3.4 ${r2(-3.4 * open)},-0.4 Q${r2(-2.6 * open)},1.6 0,0.6 Z`, fill, 0.5)}${P(`M0,0 Q${r2(3.2 * open)},-3.4 ${r2(3.4 * open)},-0.4 Q${r2(2.6 * open)},1.6 0,0.6 Z`, fill, 0.5)}${L([0, -1.2], [0, 1.4], OUT, 0.6)}</g>`;
const bird = (x, y, m = 1) => `<g transform="translate(${x} ${y}) scale(${m} 1)">` + E(0, 0, 2.6, 2.1, C.bird, 0.7) + E(0.6, 0.8, 1.4, 1, C.white, 0) + P('M2.4,-0.6 L4,-0.2 L2.4,0.4 Z', C.heart, 0.4) + E(1.1, -0.8, 0.4, 0.4, OUT, 0) + P('M-2.2,-0.4 L-4.2,-1.2 L-3.6,0.6 Z', C.bird, 0.5) + '</g>';

// Couronne de bois de cerf fleuris (mirror 1/-1 pour le côté), un oiseau sur la droite
function antlers(k, birdSide = 1) {
  let s = '<g transform="translate(40 19.4) scale(0.86) translate(-40 -19.4)">';
  for (const m of [-1, 1]) {
    const X = x => r2(40 + k + m * (x - 40));
    s += branch(`M${X(34)},19.4 Q${X(30)},13 ${X(26.4)},10 Q${X(23.6)},7.6 ${X(21.8)},4.2`, 2);
    s += branch(`M${X(28.8)},11.8 Q${X(27.6)},7.6 ${X(28.8)},4.2`, 1.4) + branch(`M${X(25)},9.2 Q${X(21.8)},10.4 ${X(19.2)},9.6`, 1.3);
    s += flower(+X(21.8), 4, 1.2) + flower(+X(28.8), 4, 1.1, C.white) + flower(+X(19.2), 9.6, 1, C.white) + flower(+X(26.6), 9.8, 0.9) + leaf(+X(31.2), 14.4, 2.6, 1, m * 70, C.hair);
  }
  return s + bird(r2(40 + k + birdSide * 15.6), 8.6, birdSide) + '</g>';
}

// Une image d'Anya. view : front | se | ne ; pose : repos | marche | salut (bénédiction) | action (éveil) ; n ; expr
function anyaFrame(view, pose, n, expr) {
  const walk = pose === 'marche';
  const bob = walk && n % 2 ? -1 : 0;
  const sway = walk ? [1.4, 0, -1.4, 0][n] : 0;
  const glowK = pose === 'action' ? (n ? 1.25 : 1.1) : pose === 'repos' && n === 1 ? 1.05 : 1;
  const k = view === 'se' ? -2.4 : 0;
  const uid = `an${view}${pose}${n}`;
  let s = '';
  // halo doré
  s += `<defs><radialGradient id="${uid}g"><stop offset="0" stop-color="rgb(${C.glow})" stop-opacity="${r2(0.6 * glowK)}"/><stop offset="1" stop-color="rgb(${C.glow})" stop-opacity="0"/></radialGradient></defs>`
    + `<ellipse cx="40" cy="62" rx="${r2(40 * glowK)}" ry="${r2(62 * glowK)}" fill="url(#${uid}g)"/>`;
  // lucioles : moitié arrière
  const flies = [0, 1, 2, 3, 4].map(i => {
    const a = (n / 4 + i / 5) * Math.PI * 2;
    return { x: 40 + Math.cos(a) * 30, y: 66 + Math.sin(a * 2) * 10 + Math.sin(a) * 24, back: Math.sin(a) < 0 };
  });
  s += flies.filter(f => f.back).map(f => firefly(f.x, f.y)).join('');
  let g = '';
  // fleurs au sol : là où elle a posé le pied
  const ground = walk ? flower(n < 2 ? 34 : 46, 125.6, 1.3) + (n % 2 ? flower(n < 2 ? 47 : 33, 126, 0.9, C.white) : '')
    : pose === 'action' ? [[24, 123.4], [32, 124.8], [48, 124.8], [56, 123.4], [40, 125.4]].slice(0, n ? 5 : 3).map(([x, y], i) => flower(x, y, 1.4, i % 2 ? C.white : C.petal)).join('') : flower(46, 126, 1.1);
  // chevelure arrière (le dos de la tête et la cascade autour du cou)
  const hairBack = view === 'ne'
    ? 'M28.2,30 Q27.8,14.8 40,14.6 Q52.2,14.8 51.8,30 Q51.4,36.4 47.4,39 Q49.4,50 49,62 Q48.8,74 47,84 Q45.4,80.4 43.6,86.6 Q41.8,81.6 40,89 Q38.2,81.6 36.4,86.6 Q34.6,80.4 33,84 Q31.2,74 31,62 Q30.6,50 32.6,39 Q28.6,36.4 28.2,30 Z'
    : 'M28.6,24 Q27.6,40 28.4,56 L51.6,56 Q52.4,40 51.4,24 Z';
  // manteau vivant
  const cloak = `M29,45.4 Q40,40.6 51,45.4 Q60,70 ${r2(66 + sway)},119.6 Q${r2(53 + sway)},126 40,124.8 Q${r2(27 + sway)},126 ${r2(14 + sway)},119.6 Q20,70 29,45.4 Z`;
  const feathers = [15.6, 20.2, 24.8, 29.4, 34, 38.6, 43.2, 47.8, 52.4, 57, 61.6].map((x, i) => feather(x + sway * 0.8, 111.4 + (i % 2) * 1.6, (i - 5) * 4, [C.gold, C.paleG, C.paleGold][i % 3])).join('')
    + [18.4, 23, 27.6, 52.4, 57, 61.6].map((x, i) => feather(x + sway * 0.6, 101 + (i % 2) * 1.4, (i < 3 ? -8 : 8), [C.paleGold, C.gold, C.paleG][i % 3])).join('')
    + [[19, 70], [24, 82], [58, 66], [61, 90]].map(([x, y], i) => leaf(x, y, 4, 1.6, i % 2 ? 30 : -30, i % 2 ? C.paleG : C.gold)).join('')
    + [[22.4, 62], [59.6, 78], [17.6, 92]].map(([x, y]) => flower(x, y, 1.1, C.white)).join('');
  const wing = 0.6 + 0.4 * Math.abs(Math.sin((n / 4) * Math.PI * 2 + 1));
  // manteau de feuille : vert, l'ombre à droite, des nervures d'or qui luisent (une perche de chaque côté, des
  // nervures qui s'en écartent vers l'ourlet), un ourlet doré sous les plumes
  const veinD = [-1, 1].map(m => {
    const X = (x, lo) => r2(40 + m * (x - 40) + (lo ? sway * 0.6 : 0));
    let d = `M${X(30)},50 Q${X(23)},80 ${X(18.6, 1)},114`;
    for (const [y, x, dx, dy] of [[62, 26.6, -4.2, 6], [76, 23.6, -5, 7.4], [90, 21.2, -5.2, 8], [103, 19.6, -4.6, 7.6], [70, 25, 3.4, 6.4], [86, 22, 3.8, 7]]) d += ` M${X(x, y > 95)},${y} Q${X(x + dx * 0.3, y > 95)},${r2(y + dy * 0.7)} ${X(x + dx, y + dy > 95)},${r2(y + dy)}`;
    return d;
  }).join(' ') + (view === 'ne' ? ` M40,46 L${r2(40 + sway * 0.4)},118` : '');
  const cloakVeins = `<path d="${veinD}" fill="none" stroke="rgb(255,220,120)" stroke-width="2.2" stroke-linecap="round" opacity="0.35"/><path d="${veinD}" fill="none" stroke="${C.mvein}" stroke-width="0.75" stroke-linecap="round"/>`
    + `<path d="M${r2(12 + sway)},118.6 Q40,128.4 ${r2(68 + sway)},118.6" fill="none" stroke="${C.gold}" stroke-width="2.4"/>`;
  const cloakTex = clip(`${uid}c`, cloak, `<rect x="49" y="40" width="20" height="90" fill="${C.furS}"/>${cloakVeins}${feathers}`)
    + (view === 'ne' ? butterfly(30, 86, wing, C.wingO) + butterfly(51, 74, 1.2 - wing * 0.5, C.wingB) + butterfly(46, 98, wing, C.wingO)
      : butterfly(20.6, 78, wing, C.wingO) + butterfly(60, 72, 1.2 - wing * 0.5, C.wingB) + butterfly(62.4, 102, wing, C.wingO) + butterfly(18.4, 104, 1.2 - wing * 0.5, C.wingB));
  // bras : au repos le long du manteau ; bénédiction : main droite levée ; éveil : bras ouverts
  const swing = walk ? [1, 0, -1, 0][n] : 0;
  let armL = arm(AR, [31.6, 48.4], [27.6 + swing, 84 - swing * 1.4], [29.2, 66]);
  let armR = arm(AR, [48.4, 48.4], [52.4 - swing, 84 + swing * 1.4], [50.8, 66]);
  let over = '';
  if (pose === 'salut') {
    const h = n ? [57.4, 44.6] : [57, 47.4];
    armR = arm(AR, [48.4, 48.4], h, [57.2, 60]);
    over += E(h[0], h[1] - 4.4, 3.4, 3.4, 'rgb(255,236,150)', 0).replace('fill=', 'fill-opacity="0.45" fill=') + flower(h[0] - 1.4, h[1] - 6 - n * 2.4, 1.1) + flower(h[0] + 2.4, h[1] - 3.4 - n * 3.4, 0.9, C.white) + (n ? firefly(h[0] - 3.6, h[1] - 10) : '');
  }
  if (pose === 'action') {
    armL = arm(AR, [31.6, 48.4], [14.4, 72], [22.6, 60]);
    armR = arm(AR, [48.4, 48.4], [65.6, 72], [57.4, 60]);
    over += firefly(12.4, 66, 1.2) + firefly(67.6, 66, 1.2) + (n ? firefly(16, 58) + firefly(64, 58) : '');
  }
  const veinsArm = pose === 'repos' || walk ? L([28.6 + swing * 0.6, 70], [28.2 + swing * 0.8, 78], C.vein, 0.5) + L([51.4 - swing * 0.6, 70], [51.8 - swing * 0.8, 78], C.vein, 0.5) : '';

  if (view === 'ne') {
    // de dos : manteau, puis la cascade de feuilles par-dessus, la couronne
    g += `<g transform="translate(0 -2)">${antlers(0, -1)}</g>`;
    g += P(cloak, C.fur) + cloakTex + P(cloak, 'none') + ground;
    g += [36, 44].map((x, i) => E(x + (walk ? (i ? -sway : sway) * 0.6 : 0), 123.4, 2.4, 1.6, C.skin, 0.8)).join('');
    g += armL + armR;
    // longue chevelure vue de dos : elle s'affine en trois mèches ondulées ; mèches dessinées par des traits, ombre à droite
    const strands = `M40,15.6 Q32,22 31.4,32 M40,15.6 Q48,22 48.6,32 M35.4,40 Q34,56 34.6,72 Q35,80 36.4,85 M40,38 Q40.4,60 40,88 M44.6,40 Q46,56 45.4,72 Q45,80 43.6,85`;
    g += P(hairBack, C.hair) + clip(`${uid}h`, hairBack, `<rect x="45.4" y="14" width="16" height="96" fill="${C.hairS}"/>`
      + `<path d="${strands}" fill="none" stroke="${C.hairS}" stroke-width="0.8" stroke-linecap="round" opacity="0.9"/>`
      + `<path d="M33.6,19.6 Q30.6,26 30.8,33 M36.4,17.4 Q34.4,22 34,28 M33.6,46 Q32.8,58 33.2,70" fill="none" stroke="${C.hairH}" stroke-width="1.3" stroke-linecap="round"/>`) + P(hairBack, 'none');
    // couronne de fleurs à l'arrière de la tête : elle marque la tête et coupe la chevelure
    g += P('M29.4,31.4 Q40,36.6 50.6,31.4', 'none', 2.6).replace(`stroke="${OUT}"`, `stroke="${C.hairS}"`)
      + [[30.4, 31.6, -40], [35, 34, -15], [45, 34, 15], [49.6, 31.6, 40]].map(([x, y, r]) => leaf(x, y, 3, 1.3, r, C.hairH)).join('')
      + [[32.6, 33, C.white], [37.6, 34.8, C.petal], [42.4, 34.8, C.white], [47.4, 33, C.petal]].map(([x, y, c]) => flower(x, y, 1.1, c)).join('');
    g += [[37.4, 54, 14], [43.2, 66, -14]].map(([x, y, r], i) => leaf(x, y, 3.4, 1.4, r, i % 2 ? C.hairH : C.hairS)).join('');
    g += [[40.4, 19, 1], [33, 60, 0.8]].map(([x, y, r]) => flower(x, y, r, C.white)).join('');
  } else {
    g += P(hairBack, C.hair) + P(hairBack, 'none');
    g += P(cloak, C.fur) + cloakTex + P(cloak, 'none') + ground;
    // pieds nus sous l'ourlet
    g += [[36, 0], [44, 1]].map(([x, i]) => {
      const fwd = walk ? ((n < 2) === !i ? 1 : -0.6) : 0;
      return E(x + k * 0.3, 123.2 + fwd, 2.6, 1.7, C.skin, 0.8) + L([x + k * 0.3 - 1, 124 + fwd], [x + k * 0.3 - 1, 124.8 + fwd], OUT, 0.4) + L([x + k * 0.3 + 0.4, 124.2 + fwd], [x + k * 0.3 + 0.4, 124.9 + fwd], OUT, 0.4);
    }).join('');
    // robe claire, liserés d'or, nervures de lumière
    const dress = `M${r2(34.6 + k * 0.4)},46 Q${r2(40 + k * 0.4)},44.4 ${r2(45.4 + k * 0.4)},46 L${r2(49.4 + sway * 0.6)},121.4 Q40,124.6 ${r2(30.6 + sway * 0.6)},121.4 Z`;
    g += P(dress, C.dress) + clip(`${uid}d`, dress, `<rect x="${44 + k * 0.4}" y="40" width="12" height="90" fill="${C.dressS}"/>`
      + `<path d="M26,117.4 Q40,121 54,117.4" fill="none" stroke="${C.gold}" stroke-width="1"/>`
      + `<path d="M${40 + k * 0.4},52 Q${38 + k * 0.4},70 ${41 + k * 0.4},90 Q${39 + k * 0.4},104 ${40 + k * 0.4},116" fill="none" stroke="${C.gold}" stroke-width="0.6" opacity="0.8"/>`
      + leaf(36 + k * 0.4, 70, 3, 1.1, 40, C.hairH) + leaf(44 + k * 0.4, 84, 3, 1.1, -40, C.hairH)) + P(dress, 'none');
    // col de fourrure festonné
    g += P(`M27.6,45 Q40,39.6 52.4,45 L53.6,51.4 Q50.6,54.4 47.6,52 Q44,55.2 40,52.6 Q36,55.2 32.4,52 Q29.4,54.4 26.4,51.4 Z`, C.collar)
      + P(`M30,47.6 Q33,50 36,48.6 M44,48.6 Q47,50 50,47.6`, 'none', 0.6);
    g += armL + armR + veinsArm;
    g += `<rect x="${37.6 + k * 0.5}" y="38" width="4.8" height="8.4" fill="${C.skin}"/>` + L([37.6 + k * 0.5, 38], [37.6 + k * 0.5, 45], OUT, 1) + L([42.4 + k * 0.5, 38], [42.4 + k * 0.5, 45], OUT, 1);
    // tête
    const fx = 40 + k, face = `M${fx - 12},31 a12,12.6 0 1,0 24,0 a12,12.6 0 1,0 -24,0 Z`;
    g += `<g transform="translate(0 -2)">${antlers(k, 1)}</g>` + P(`M${27.4 + k},31 Q${27 + k},15 ${40 + k},14.6 Q${53 + k},15 ${52.6 + k},31 Z`, C.hair);
    const veins = `M${29.6 + k},33.4 Q${32 + k},36 ${33.8 + k},39.6 M${31.8 + k},36.4 L${30.2 + k},38 M${50.4 + k},33.4 Q${48 + k},36 ${46.2 + k},39.6 M${48.2 + k},36.4 L${49.8 + k},38`;
    g += P(face, C.skin) + clip(`${uid}f`, face, `<rect x="${45 + k}" y="18" width="14" height="28" fill="${C.skinS}" opacity="0.5"/>`
      + E(31.8 + k, 37, 2.2, 1.2, C.cheek, 0) + E(48.2 + k, 37, 2.2, 1.2, C.cheek, 0)
      + `<path d="${veins}" fill="none" stroke="rgb(255,220,120)" stroke-width="1.8" stroke-linecap="round" opacity="0.35"/><path d="${veins}" fill="none" stroke="${C.vein}" stroke-width="0.7" stroke-linecap="round"/>`) + P(face, 'none');
    // mèches de feuilles qui coulent devant les épaules, frange partagée, gemme au front
    const lockL = `M${29 + k},26 Q${25.8 + k},46 ${28 + k},62 Q${29.6 + k},68 ${31.4 + k},73 Q${32 + k},60 ${32.4 + k},48 Q${32.6 + k},36 ${31.8 + k},28 Z`;
    const lockR = `M${51 + k},26 Q${54.2 + k},46 ${52 + k},62 Q${50.4 + k},68 ${48.6 + k},73 Q${48 + k},60 ${47.6 + k},48 Q${47.4 + k},36 ${48.2 + k},28 Z`;
    g += P(lockL, C.hair) + P(lockR, C.hair) + leaf(30 + k, 50, 3.8, 1.5, 20) + leaf(30.4 + k, 62, 3.8, 1.5, -15, C.hairH) + leaf(50 + k, 50, 3.8, 1.5, -20) + leaf(49.6 + k, 62, 3.8, 1.5, 15, C.hairH);
    g += P(`M${28.2 + k},29 Q${28.4 + k},17 ${40 + k},16.6 Q${51.6 + k},17 ${51.8 + k},29 Q${48.8 + k},22.4 ${42.4 + k},21.8 L${40 + k},24.6 L${37.6 + k},21.8 Q${31.2 + k},22.4 ${28.2 + k},29 Z`, C.hair)
      + L([31.2 + k, 21.4], [35.8 + k, 19.2], C.hairH, 1.1);
    g += P(`M${40 + k},19.6 L${41.8 + k},21.6 L${40 + k},23.8 L${38.2 + k},21.6 Z`, '#3FA866', 0.7) + E(39.5 + k, 21.1, 0.4, 0.55, C.white, 0);
    g += expression({
      eyes: view === 'se' ? [[34.6 + k + 1.2, 32.4, 1.9], [43 + k + 1.2, 32.4, 1.7]] : [[35, 32.4, 2], [45, 32.4, 2]], ry: 2.8, eyeColor: C.eye,
      brow: C.hairS, browY: -4.8, browW: 0.9, restEyes: 'sleepy',
      mouth: [40 + k + (view === 'se' ? 0.4 : 0), 38.4], mw: 1.8, mouthC: C.mouth, tongue: C.tongue,
      neutral: (mx, my) => `M${r2(mx - 1.4)},${r2(my + 0.3)} Q${mx},${r2(my + 1.2)} ${r2(mx + 1.4)},${r2(my + 0.3)}`,
      cheeks: [[31.8 + k, 2.2], [48.2 + k, 2.2]], cheekY: 37, temple: [26.4 + k, 30], anger: [60, 18], zz: [56, 14]
    }, { expr, n, id: uid, blink: pose === 'repos' && n === 1, open: pose === 'salut' && expr === 'content' ? false : false });
  }
  s += `<g transform="translate(0 ${bob})">${g}${over}</g>`;
  s += flies.filter(f => !f.back).map(f => firefly(f.x, f.y)).join('');
  return s;
}

const POSES_A = [['face_repos', 'front', 'repos', 2], ['avant_marche', 'se', 'marche', 4], ['dos_marche', 'ne', 'marche', 4], ['face_benediction', 'front', 'salut', 2], ['face_eveil', 'front', 'action', 2]];
const EXPR_OF = { repos: 'neutre', marche: 'neutre', salut: 'content', action: 'content' };
const svgA = (body, scale = 1) => `<svg xmlns="http://www.w3.org/2000/svg" width="${80 * scale}" height="${128 * scale}" viewBox="0 0 80 128">${body}</svg>`;
module.exports = { anyaFrame, POSES_A, EXPR_OF, svgA };
