// L'avatar du joueur (HISTOIRE.md § 6.17) : un personnage de la troupe qu'on compose soi-même.
// Même repère que la troupe (48 × 64, pieds en (24, 62)), mêmes vues, mêmes poses, mêmes expressions ;
// avatar(choix) rend un personnage pour troupe.frame(), comme aster.js ou rivet.js.
//
// Les choix, les nuanciers et le catalogue des accessoires sont dans avatar_choix.js ; le dessin des accessoires dans
// avatar_accessoires.js. Ici : le corps (taille, corpulence), la tête (visage, yeux, cils, bouche, coupes, mèches), les
// habits (hauts, bas), et l'ordre des couches.
// Poses : repos, marche, salut, et trois gestes du tutoriel : ramasser (trois quarts avant), grelotter et lire (face).
const { OUT, P, E, L, limb, clip, expression, arm, shoe, bareFoot, r2, lerp } = require('./troupe');
const choix = require('./avatar_choix');
const { verifier, couleur, couleursAccessoire, tone, mix, hsl, clarte } = choix;
const { couche, PORTE, capucheRabattue, reperes } = require('./avatar_accessoires');

// ---- le corps : taille et corpulence ----
// Taille : le haut du corps monte ou descend, les pieds restent au sol (les jambes s'allongent ou raccourcissent)
// (grande : -2, pour que rien ne touche le haut du cadre, rebond de la marche compris : voir verif_avatar.mjs)
const TAILLE = { petite: 3.2, moyenne: 0, grande: -2 };
// Corpulence : demi-largeur aux épaules (sw) et aux hanches (hw), ventre (b), épaisseur des bras et des jambes
const CORPS = {
  fine: { sw: 7.6, hw: 9.2, b: 0, arm: 3.4, legW: 5 },
  moyenne: { sw: 8.5, hw: 10.2, b: 0, arm: 3.8, legW: 5.4 },
  large: { sw: 10, hw: 11, b: 0, arm: 4.3, legW: 5.9 },
  ronde: { sw: 8.9, hw: 11.2, b: 1.8, arm: 4.1, legW: 6 }
};
// Torse des épaules aux hanches (hem : bas du haut, plus haut quand il est rentré dans la jupe, la robe ou la salopette)
function torso(k, hem = 46.6) {
  const mx = (k.sw + k.hw) / 2 + k.b, my = (32.6 + hem) / 2;
  return `M${r2(24 - k.sw)},32.6 Q24,30 ${r2(24 + k.sw)},32.6 Q${r2(24 + mx)},${r2(my)} ${r2(24 + k.hw)},${hem}`
    + ` Q24,${r2(hem + 3)} ${r2(24 - k.hw)},${hem} Q${r2(24 - mx)},${r2(my)} ${r2(24 - k.sw)},32.6 Z`;
}

// ---- la tête ----
// Repères communs (ceux de la troupe) : visage centré en 24 (face) ou 22,6 (trois quarts), yeux, bouche, oreilles
const FACE = { front: { fx: 24, rx: 11.6 }, se: { fx: 22.6, rx: 11.2 } };
// Le haut du visage est le même pour tous ; le bas change avec la forme (rond, ovale : menton plus fin, carré : mâchoire)
// Le menton (homme) : doux (celui du visage), fin (plus étroit et un peu pointu), fort (plus large et plus bas),
// fendu (fort, avec une fossette), court (remonté) ; il déplace les points du bas du visage
function menton(d, fx, genre) {
  if (!genre || genre === 'doux') return d;
  const [kx, dy] = { fin: [0.62, 0.7], fort: [1.2, 1.1], fendu: [1.16, 0.9], court: [1.12, -1.4] }[genre];
  return d.replace(/(-?\d+\.?\d*),(-?\d+\.?\d*)/g, (m, x, y) => {
    const t = Math.max(0, Math.min(1, (+y - 25.4) / 7));
    return t ? `${r2(fx + (+x - fx) * (1 + (kx - 1) * t))},${r2(+y + dy * t)}` : m;
  });
}
function faceD(v, forme = 'rond', chin) {
  const { fx, rx } = FACE[v];
  const a = r2(fx - rx), b = r2(fx + rx);
  // femme : rond, ovale, cœur (menton fin) ; homme : carré, anguleux (mâchoire marquée, menton plat), large
  const low = forme === 'ovale' ? `C${a},28.4 ${r2(fx - 4.8)},33.4 ${fx},33.4 C${r2(fx + 4.8)},33.4 ${b},28.4 ${b},21.6`
    : forme === 'coeur' ? `C${a},27 ${r2(fx - 4)},32.4 ${fx},33.6 C${r2(fx + 4)},32.4 ${b},27 ${b},21.6`
      : forme === 'carre' ? `L${a},27.4 Q${r2(a + 0.2)},31.4 ${r2(fx - 4.4)},32.2 L${r2(fx + 4.4)},32.2 Q${r2(b - 0.2)},31.4 ${b},27.4 L${b},21.6`
        : forme === 'anguleux' ? `L${a},25.6 L${r2(fx - 5.4)},31.6 Q${fx},32.8 ${r2(fx + 5.4)},31.6 L${b},25.6 L${b},21.6`
          : forme === 'large' ? `C${a},31 ${r2(fx - 7.8)},32.8 ${fx},32.8 C${r2(fx + 7.8)},32.8 ${b},31 ${b},21.6`
            : chin && chin !== 'doux' ? `C${a},29.4 ${r2(fx - 6.4)},32.4 ${fx},32.4 C${r2(fx + 6.4)},32.4 ${b},29.4 ${b},21.6` : `a${rx},10.4 0 1,0 ${r2(2 * rx)},0`;
  return `M${a},21.6 ${menton(low, fx, chin)} a${rx},10.4 0 1,0 ${r2(-2 * rx)},0 Z`;
}
// La barbe, de la couleur des cheveux, pousse sur la mâchoire : une masse simple et nette, au style des cheveux du kit.
// Un fin favori au bord du visage descend des cheveux ; la barbe s'élargit sur le bas des joues, contourne la bouche
// (qui reste dégagée) et déborde sous le menton, d'autant plus qu'elle est fournie. Les joues restent libres. Elle se
// dessine après le contour du visage : c'est son propre contour qui fait le bas du visage.
//   malRase : une ombre légère sur la mâchoire ;  collier : un fin collier ;  courte : nette, un peu sous le menton ;
//   bouc : une touffe sous la lèvre ;  pleine : fournie, en trois mèches arrondies sous le menton.
function barbe(c, view, face, genre) {
  const { fx, rx } = FACE[view];
  const se = view === 'se', mx = se ? 20.8 : 24;
  const a = r2(fx - rx), b = r2(fx + rx);
  const H = c.cheveux, S = tone(H, 0.7), HI = tone(H, 1.32), D = tone(H, 0.48);
  const id = `${c.uid}barb${view}`;
  const contour = d => `<path d="${d}" fill="none" stroke="${D}" stroke-width="0.75" stroke-linejoin="round"/>`;
  if (genre === 'malRase') {
    // une ombre de la couleur des cheveux sur la mâchoire, plus dense vers le menton (dans le visage)
    const d = `M${a},22.6 C${r2(a + 1)},27.4 ${r2(mx - 4)},28.6 ${mx},29.2 C${r2(mx + 4)},28.6 ${r2(b - 1)},27.4 ${b},22.6 L${b},36 L${a},36 Z`;
    return clip(id, face, `<path d="${d}" fill="${S}" opacity=".32"/><path d="M${a},29 Q${mx},34.6 ${b},29 L${b},36 L${a},36 Z" fill="${S}" opacity=".22"/>`);
  }
  if (genre === 'bouc') {
    // une touffe arrondie sous la lèvre, qui déborde un peu du menton ; deux mèches et un reflet
    const t = `M${r2(mx - 2.5)},29.1 Q${r2(mx - 2.7)},28.1 ${mx},28.3 Q${r2(mx + 2.7)},28.1 ${r2(mx + 2.5)},29.1 Q${r2(mx + 2.4)},32.8 ${mx},33.9 Q${r2(mx - 2.4)},32.8 ${r2(mx - 2.5)},29.1 Z`;
    return `<path d="${t}" fill="${H}"/>` + clip(`${id}b`, t, `<rect x="${r2(mx - 3)}" y="31.6" width="6" height="3" fill="${S}"/>`)
      + `<path d="M${r2(mx - 0.9)},29.8 Q${r2(mx - 1)},31.6 ${r2(mx - 0.4)},33 M${r2(mx + 0.9)},29.8 Q${r2(mx + 1)},31.6 ${r2(mx + 0.4)},33" fill="none" stroke="${S}" stroke-width=".5" stroke-linecap="round"/>`
      + L([mx - 1.5, 29.3], [mx - 0.5, 29.1], HI, 0.6) + contour(t);
  }
  // t : l'épaisseur du favori ; dy : ce qui déborde sous le menton ; yi : le bas de la bouche dégagée
  const { t, dy, yi } = { collier: { t: 0.8, dy: 0.9, yi: 30.2 }, courte: { t: 1.3, dy: 1.9, yi: 29.4 }, pleine: { t: 1.6, dy: 4, yi: 29.2 } }[genre];
  const tg = se ? t * 0.75 : t;
  // le bord intérieur : le long du bord du visage (le favori), puis sur le bas des joues, sous la bouche, et retour
  const interieur = `M${r2(a + tg)},19 C${r2(a + tg)},23.4 ${r2(a + tg + 1.4)},26.6 ${r2(mx - 3.4)},28.2 Q${mx},${yi + 0.8} ${r2(mx + 3.4)},28.2 C${r2(b - t - 1.4)},26.6 ${r2(b - t)},23.4 ${r2(b - t)},19`;
  // le bord extérieur : un peu hors du visage sur la mâchoire, puis sous le menton (en trois mèches pour la pleine)
  const yb = 32.2 + dy;
  const dessous = genre === 'pleine'
    ? ` C${b},30.6 ${r2(mx + 7)},${r2(yb - 2)} ${r2(mx + 4.6)},${r2(yb - 0.6)} Q${r2(mx + 3.4)},${r2(yb + 0.7)} ${r2(mx + 1.7)},${r2(yb - 0.3)} Q${mx},${r2(yb + 1.4)} ${r2(mx - 1.7)},${r2(yb - 0.3)} Q${r2(mx - 3.4)},${r2(yb + 0.7)} ${r2(mx - 4.6)},${r2(yb - 0.6)} C${r2(mx - 7)},${r2(yb - 2)} ${a},30.6 `
    : ` C${b},30.4 ${r2(mx + 6)},${r2(yb)} ${mx},${r2(yb)} C${r2(mx - 6)},${r2(yb)} ${a},30.4 `;
  const forme = interieur + ` L${b},19 L${b},24.4` + dessous + `${a},24.4 L${a},19 Z`;
  // les mèches : quelques traits nets qui suivent le galbe vers le menton ; un reflet sur la joue éclairée
  const meches = genre === 'collier' ? '' : (genre === 'pleine'
    ? [[-4.6, 29.4, -3.6, 33.8], [-2.2, 30.6, -1.6, 34.8], [2.2, 30.6, 1.6, 34.8], [4.6, 29.4, 3.6, 33.8], [0, 31, 0, 35.2]]
    : [[-3.8, 29.6, -3, 32.6], [0, 30.6, 0, 33.4], [3.8, 29.6, 3, 32.6]])
    .map(([x0, y0, x1, y1]) => `M${r2(mx + x0)},${y0} Q${r2(mx + (x0 + x1) / 2 + (x0 > 0 ? 0.4 : -0.4))},${r2((y0 + y1) / 2)} ${r2(mx + x1)},${y1}`).join(' ');
  return `<path d="${forme}" fill="${H}"/>`
    + clip(id, forme, `<path d="M${r2(a - 1)},31 Q${mx},${r2(yb + 3)} ${r2(b + 1)},31 L${r2(b + 1)},40 L${r2(a - 1)},40 Z" fill="${S}"/>`
      + (meches ? `<path d="${meches}" fill="none" stroke="${S}" stroke-width=".55" stroke-linecap="round"/>` : '')
      + `<path d="M${r2(a + tg + 0.6)},25.4 Q${r2(a + tg + 1.4)},28 ${r2(mx - 4.4)},29.6" fill="none" stroke="${HI}" stroke-width=".6" stroke-linecap="round" opacity=".8"/>`)
    + contour(forme);
}
// La moustache, juste au-dessus de la bouche (le haut de la bouche est en y = 27) : deux ailes qui partent du centre.
//   fine : un trait fin ;  epaisse : un chevron épais ;  guidon : fine, les pointes relevées en boucle ;
//   gauloise : épaisse, qui tombe de chaque côté de la bouche.
function moustache(c, view, genre) {
  const se = view === 'se';
  const mx = se ? 20.8 : 24, my = 26.2;
  const H = c.cheveux, S = tone(H, 0.66), HI = tone(H, 1.3);
  // une aile (k : 1 à droite, -1 à gauche) ; de trois quarts, l'aile qui fuit est plus courte
  const aile = k => {
    const w = (genre === 'fine' ? 2.6 : genre === 'guidon' ? 2.8 : genre === 'gauloise' ? 3.2 : 3) * (se && k < 0 ? 0.78 : 1);
    const X = v => r2(mx + k * v);
    if (genre === 'fine') return `M${X(0.2)},${r2(my - 0.3)} Q${X(w * 0.6)},${r2(my - 0.6)} ${X(w)},${r2(my + 0.3)} Q${X(w * 0.55)},${r2(my + 0.1)} ${X(0.2)},${r2(my + 0.25)} Z`;
    if (genre === 'guidon') return `M${X(0.2)},${r2(my - 0.4)} Q${X(w * 0.6)},${r2(my - 0.7)} ${X(w)},${r2(my + 0.1)} Q${X(w + 1.1)},${r2(my - 0.2)} ${X(w + 0.9)},${r2(my - 1.5)} Q${X(w + 0.4)},${r2(my - 0.6)} ${X(w * 0.85)},${r2(my + 0.55)} Q${X(w * 0.5)},${r2(my + 0.3)} ${X(0.2)},${r2(my + 0.35)} Z`;
    if (genre === 'gauloise') return `M${X(0.2)},${r2(my - 0.9)} Q${X(w * 0.7)},${r2(my - 1.2)} ${X(w)},${r2(my + 0.6)} Q${X(w + 0.3)},${r2(my + 2.4)} ${X(w - 0.2)},${r2(my + 3)} Q${X(w - 1.2)},${r2(my + 1.4)} ${X(w * 0.45)},${r2(my + 0.7)} Q${X(0.4)},${r2(my + 0.6)} ${X(0.2)},${r2(my + 0.5)} Z`;
    return `M${X(0.2)},${r2(my - 0.9)} Q${X(w * 0.7)},${r2(my - 1.1)} ${X(w)},${r2(my + 0.7)} Q${X(w * 0.55)},${r2(my + 0.6)} ${X(0.2)},${r2(my + 0.55)} Z`;
  };
  const d = aile(-1) + ' ' + aile(1);
  // le volume : l'ombre dessous, un reflet sur chaque aile, le contour
  // des poils qui partent du centre vers les pointes, en deux tons
  const poils = genre === 'fine' ? '' : [-1, 1].map(k => [0.8, 1.6, 2.4, 3.2].map((v, i) => `<path d="M${r2(mx + k * v)},${r2(my - 0.6)} q${r2(k * 0.6)},${r2(0.5)} ${r2(k * 0.9)},${r2(1.2 + (genre === 'gauloise' ? i * 0.3 : 0))}" stroke="${i % 2 ? S : tone(H, 0.5)}" stroke-width=".35" stroke-linecap="round" fill="none" opacity=".75"/>`).join('')).join('');
  return P(d, H, 0) + clip(`${c.uid}mst${view}`, d, `<rect x="${mx - 6}" y="${r2(my + 0.15)}" width="12" height="4" fill="${S}"/>` + poils)
    + L([mx - 1.8, my - 0.3], [mx - 0.8, my - 0.5], HI, 0.5) + L([mx + 0.8, my - 0.5], [mx + 1.8, my - 0.3], HI, 0.5) + P(d, 'none', 0.55);
}
const BACK = {
  front: 'M11.4,21.6 Q10.4,7.2 24,6.6 Q37.6,7.2 36.6,21.6 Q36.8,26.4 35,27.6 L13,27.6 Q11.2,26.4 11.4,21.6 Z',
  se: 'M12,21.6 Q10.6,7.2 24,6.8 Q38.2,7.2 37.4,21.6 Q37.6,26.4 35.6,27.6 L14,27.6 Q12.2,26.4 12,21.6 Z',
  ne: 'M11,21 C10.6,11.4 15.4,6.4 24,6.4 C32.6,6.4 37.4,11.4 37,21 Q37.2,27 34.6,28.8 Q24,31 13.4,28.8 Q10.8,27 11,21 Z'
};
// Carré : la masse de cheveux descend jusqu'à la mâchoire, coupée droit
const BOB = {
  front: 'M10.6,21.6 C10.2,11.6 15.4,6.6 24,6.6 C32.6,6.6 37.8,11.6 37.4,21.6 Q37.9,27.2 36.9,29.7 Q35.8,31.3 33.6,30.9 L14.4,30.9 Q12.2,31.3 11.1,29.7 Q10.1,27.2 10.6,21.6 Z',
  se: 'M11.4,21.6 C11,11.6 15.8,6.8 24.4,6.8 C33,6.8 38.6,11.6 38.2,21.6 Q38.7,27.2 37.7,29.7 Q36.6,31.3 34.4,30.9 L15,30.9 Q12.8,31.3 11.9,29.7 Q10.9,27.2 11.4,21.6 Z'
};
// Franges : courte (mèches souples, raie de côté), la même un peu plus longue
const BANGS = {
  front: 'M12,19.4 Q11.6,9.6 24,9.2 Q36.4,9.6 36.2,18.6 Q33.4,13.8 28.4,13.4 Q25.4,15.6 21.6,15.2 Q17.4,15 14.6,17.4 Q12.8,18.6 12,19.4 Z',
  se: 'M11.4,19.4 Q11,9.6 23,9 Q35,9.4 35.4,18 Q32.6,13.6 27.6,13.2 Q24.6,15.4 20.6,15 Q16.6,14.8 13.8,17.2 Q12.2,18.4 11.4,19.4 Z'
};
const sx = (d, k) => d.replace(/(-?\d+\.?\d*),(-?\d+\.?\d*)/g, (m, x, y) => `${r2(+x + k)},${y}`);
// symétrique autour de l'axe 24 (la mèche de droite d'après celle de gauche)
const mirror = d => d.replace(/(-?\d+\.?\d*),(-?\d+\.?\d*)/g, (m, x, y) => `${r2(48 - x)},${y}`);
// Les franges des nouvelles coupes, dessinées de face ; le trois quarts les décale vers le côté du regard
const FRANGE = {
  // carré : frange droite, coupée net au-dessus des sourcils
  carre: 'M12.2,19 C11.6,12.4 16,9.2 24,9.2 C32,9.2 36.4,12.4 35.8,19 Q35.3,17.3 34,16.7 Q32.7,17.6 31.3,16.9 Q29.7,17.8 28.1,16.9 Q26.3,17.8 24.5,16.9 Q22.7,17.8 20.9,16.9 Q19.2,17.8 17.6,16.9 Q16.1,17.6 14.6,16.7 Q12.9,17.1 12.2,19 Z',
  // mèche : une grande mèche qui part du sommet et retombe sur le côté du front
  meche: 'M12.4,18.4 Q10.8,8.4 22.4,7.4 Q31,6.4 35,9.8 Q37.2,12.4 36,18 Q34.6,14.4 31.4,13.4 Q25.4,12.6 20.4,14.2 Q15.8,15.6 12.4,18.4 Z',
  // en bataille : frange en pointes
  bataille: 'M12.2,19.2 Q11.6,9.6 24,9.2 Q36.4,9.6 36,18.8 L33.8,15 L32.2,17.4 L29.8,13.6 L27.6,16.6 L25,13.4 L22.6,16.8 L20.2,13.8 L17.8,17 L15.6,14.4 L14,17.6 Z'
};
// les deux chignons portent la frange droite du carré
FRANGE.deuxChignons = FRANGE.carre;
// Les coupes d'homme : la nuque et les oreilles dégagées, les côtés tondus (un duvet de la couleur des cheveux sur la
// peau) ; le dessus fait la coupe. De face, la masse de derrière s'arrête au-dessus des oreilles (COURT_BACK) ; de dos,
// les cheveux s'arrêtent au-dessus de la nuque (COURT_DOS), la tondeuse dessous.
const COURTES = new Set(['courte', 'meche', 'degrade', 'banane', 'raie', 'herisse', 'boucleeCourte', 'chignonHomme', 'pixie']);
const TONDUES = new Set(['degrade', 'herisse', 'boucleeCourte', 'chignonHomme']);
const COURT_BACK = {
  front: 'M12.2,17.8 C11.8,10.6 16.2,6.6 24,6.6 C31.8,6.6 36.2,10.6 35.8,17.8 Q35.4,19 34.6,19 L13.4,19 Q12.6,19 12.2,17.8 Z',
  se: 'M12.8,17.8 C12.2,10.6 16.4,6.8 24,6.8 C32.2,6.8 37.2,10.6 36.8,17.8 Q36.4,19 35.6,19 L14,19 Q13.2,19 12.8,17.8 Z'
};
// de dos, une coupe courte suit le crâne : le dôme rond, puis elle rentre vers la nuque, en pointe douce au milieu ;
// sur les coupes à la tondeuse, les cheveux s'arrêtent plus haut (TONDU_DOS), la tondeuse dessous
const COURT_DOS = 'M11.2,19.6 C10.8,11 15.4,6.2 24,6.2 C32.6,6.2 37.2,11 36.8,19.6 Q36.6,23.8 34.2,26.2 Q30.8,27.8 27.6,27.4 Q25.8,29 24,29.4 Q22.2,29 20.4,27.4 Q17.2,27.8 13.8,26.2 Q11.4,23.8 11.2,19.6 Z';
const TONDU_DOS = 'M11.6,18.4 C11.2,10.6 15.6,6.2 24,6.2 C32.4,6.2 36.8,10.6 36.4,18.4 Q35.6,21.8 32,23 Q28,23.8 24,23.8 Q20,23.8 16,23 Q12.4,21.8 11.6,18.4 Z';
// le crâne de dos, sous une coupe courte ou rasé : rond en haut, il s'affine jusqu'au cou (pas de mâchoire carrée)
const CRANE_DOS = 'M11.6,19.4 C11.2,10.8 15.6,7.4 24,7.4 C32.4,7.4 36.8,10.8 36.4,19.4 Q36.3,24.4 33.4,27.8 Q31.4,29.8 29.6,30.6 L29.8,34.4 L18.2,34.4 L18.4,30.6 Q16.6,29.8 14.6,27.8 Q11.7,24.4 11.6,19.4 Z';
// les tempes tondues (de face, à gauche ; la droite en miroir)
const TEMPE = 'M12.4,19.6 Q12.1,15.2 14.2,12.6 L15.6,15.2 Q14.4,17 14.2,19.6 Z';
FRANGE.degrade = 'M13.4,18.2 Q12.6,8.6 24,7.8 Q35.4,8.6 34.6,18.2 Q33.8,13.8 30.4,12.6 Q24,11.2 17.6,12.6 Q14.2,13.8 13.4,18.2 Z';
FRANGE.banane = 'M13,18.8 Q12.2,10.2 17.4,8.4 Q19.6,4.6 26.6,4.8 Q33.2,5.2 33.8,8.6 Q36,10.6 35.2,18.8 Q34.2,14.4 30.8,13.2 Q27.2,11.6 22.8,12.6 Q17.2,13.4 14.6,15.4 Q13.4,16.6 13,18.8 Z';
FRANGE.raie = 'M12.4,19.2 Q11.8,9 21.6,8.2 L22.8,8.4 Q34.2,8.4 35.8,18.8 Q34,13.2 28.2,12.4 Q24.4,12.2 21.8,10.8 Q19.8,13.2 15.8,14.6 Q13.2,16.4 12.4,19.2 Z';
FRANGE.herisse = 'M13.2,18.4 Q12.6,10.8 14.6,9.4 L13.8,6.8 L17.4,8.2 L18.4,5.6 L21.4,7.6 L23.6,5 L25.8,7.4 L29,5.4 L29.8,8 L33.4,6.8 L33.4,9.4 Q35.4,10.8 34.8,18.4 Q33.8,13.4 29.6,12.8 Q24,11.8 18.4,12.8 Q14.2,13.4 13.2,18.4 Z';
FRANGE.chignonHomme = 'M13,19 Q12.2,8.8 24,8.2 Q35.8,8.8 35,19 Q34,13.6 29.2,12.6 Q24,11.8 18.8,12.6 Q14,13.6 13,19 Z';
FRANGE.boucleeCourte = FRANGE.degrade;
// courte (homme) : une coupe courte texturée, la frange en petites pointes haut sur le front, le front dégagé
FRANGE.courte = 'M12.8,18.2 Q12,8.6 24,8 Q36,8.6 35.2,18.2 Q34.6,15 32.8,13.6 L31.2,14.6 L30,12.6 L28.2,13.8 L26.8,12 L25,13.4 L23.4,11.8 L21.8,13.4 L20,12.2 L18.6,14 L16.8,12.8 L15.6,14.8 Q13.6,15.4 12.8,18.2 Z';
const SENS_FRANGE_COURTE = 'M17.6,13 Q19,10 22.4,9 M22.6,12.4 Q24,9.4 27.4,9.2 M27.8,12.8 Q30,10.6 32.6,12';
// pixie (femme) : court, une longue frange balayée de la raie vers l'autre tempe, où elle finit en pointe ; la tresse de
// côté porte la même frange
FRANGE.pixie = 'M12.8,18.4 C12,10.6 16.4,7.4 24,7.4 C31.6,7.4 36.2,10.8 35.4,17 Q35,19 33.6,19.8 Q32.6,16.2 29.4,14.8 Q24.4,12.8 19.6,13.4 Q17,13.8 16,12.6 Q14,14.8 12.8,18.4 Z';
FRANGE.tresseCote = FRANGE.pixie;
// demi-queue : le dessus tiré en arrière, le front dégagé
FRANGE.demiQueue = 'M12.4,19 C11.6,11 16.4,7.6 24,7.6 C31.6,7.6 36.4,11 35.6,19 Q35,14.4 31.6,12.4 Q28,10.8 24,10.8 Q20,10.8 16.4,12.4 Q13,14.4 12.4,19 Z';
// puffs : les cheveux tirés vers les deux boules, une lisière nette
FRANGE.puffs = 'M12.8,18.6 C12,10.8 16.4,8 24,8 C31.6,8 36,10.8 35.2,18.6 Q34.2,14 31,12.6 Q27.6,11.4 24,11.4 Q20.4,11.4 17,12.6 Q13.8,14 12.8,18.6 Z';
const SENS_NOUVELLES = {
  pixie: 'M17.2,10.6 Q24,9.8 30.6,13.6 Q32.8,15.2 33.4,18 M19.8,9.2 Q27,9.2 32.6,12.8 M16.6,12.2 Q15,13.6 14.2,16',
  demiQueue: 'M16.4,14 Q18,10.6 22.2,9 M24,10.6 L24,8.2 M31.6,14 Q30,10.6 25.8,9',
  puffs: 'M17,13.4 Q16.2,10.8 15.2,9 M31,13.4 Q31.8,10.8 32.8,9 M24,11.2 L24,8.6'
};
SENS_NOUVELLES.tresseCote = SENS_NOUVELLES.pixie;
// le duvet de la lisière des puffs (baby hair) : deux petites volutes aux tempes
const DUVET_PUFFS = 'M13.6,16.4 Q15,15.4 15.2,16.8 Q15.2,17.8 16.4,17.4 M34.4,16.4 Q33,15.4 32.8,16.8 Q32.8,17.8 31.6,17.4';
// En bataille : les épis du sommet (sans chapeau) ; seul le bord en pointes est cerné
const EPIS = {
  front: ['M12.6,13.4 Q12,8.6 14.6,7.4 L13.6,5.6 L17.8,6 L19,4.6 L22.4,6.3 L25.2,4.4 L27.4,6.5 L31.2,5.4 L31,7.4 Q35.6,9.2 35.4,13.4 Z',
    'M12.6,13.4 Q12,8.6 14.6,7.4 L13.6,5.6 L17.8,6 L19,4.6 L22.4,6.3 L25.2,4.4 L27.4,6.5 L31.2,5.4 L31,7.4 Q35.6,9.2 35.4,13.4'],
  ne: ['M12.2,12.6 Q11.6,8.2 14.4,7 L13.4,5.4 L17.6,6.5 L18.8,4.6 L22.4,6.1 L25.2,4.4 L27.6,6.3 L31.4,5.4 L31.4,7.4 Q36,9 35.8,12.6 Z',
    'M12.2,12.6 Q11.6,8.2 14.4,7 L13.4,5.4 L17.6,6.5 L18.8,4.6 L22.4,6.1 L25.2,4.4 L27.6,6.3 L31.4,5.4 L31.4,7.4 Q36,9 35.8,12.6']
};
// Couettes : une touffe de chaque côté, nouée à hauteur des oreilles
const COUETTE = 'M12.8,18 Q5.6,19.2 6.4,28.8 Q8.6,26.6 10.2,27.6 Q9.8,23.2 13,21.2 Z';

// Une petite boucle dessinée sur la masse : un arc d'ombre dessous, un point de lumière dessus
const bouclette = (x, y, r, c) => `<path d="M${r2(x - r)},${r2(y - r * 0.1)} Q${r2(x - r * 0.9)},${r2(y + r * 0.95)} ${x},${r2(y + r)} Q${r2(x + r * 0.9)},${r2(y + r * 0.95)} ${r2(x + r)},${r2(y - r * 0.1)}" fill="none" stroke="${tone(c.hair, 0.68)}" stroke-width=".6" stroke-linecap="round"/>`
  + `<path d="M${r2(x - r * 0.7)},${r2(y - r * 0.55)} Q${x},${r2(y - r * 1.05)} ${r2(x + r * 0.7)},${r2(y - r * 0.55)}" fill="none" stroke="${tone(c.hair, 1.22)}" stroke-width=".5" stroke-linecap="round"/>`;
// Boucles : un nuage festonné autour d'un centre
function curls(cx, cy, rx, ry, n, bumps = 1.9) {
  let d = '';
  for (let i = 0; i <= n; i++) {
    const t = (i / n) * Math.PI * 2 - Math.PI / 2;
    const x = cx + Math.cos(t) * rx, y = cy + Math.sin(t) * ry;
    if (i === 0) { d += `M${r2(x)},${r2(y)}`; continue; }
    const tm = ((i - 0.5) / n) * Math.PI * 2 - Math.PI / 2;
    d += ` Q${r2(cx + Math.cos(tm) * (rx + bumps))},${r2(cy + Math.sin(tm) * (ry + bumps))} ${r2(x)},${r2(y)}`;
  }
  return d + ' Z';
}
// Tresse le long d'une courbe (p0 -> p2, p1 : point de contrôle) : des mèches en écusson, empilées et serrées, celles
// du haut sur celles du bas ; dans chacune, le trait de la mèche qui passe, tour à tour vers la gauche et vers la droite
// (le V des tresses), et un reflet. w : la demi-largeur en haut (la tresse s'affine vers le bas) ; au bout, l'élastique
// et une petite touffe
function tresse(p0, p1, p2, n, w, c, bout = true) {
  const at = t => [0, 1].map(k => (1 - t) ** 2 * p0[k] + 2 * t * (1 - t) * p1[k] + t * t * p2[k]);
  const axe = t => { const d = [0, 1].map(k => 2 * (1 - t) * (p1[k] - p0[k]) + 2 * t * (p2[k] - p1[k])); return Math.atan2(-d[0], d[1]) * 180 / Math.PI; };
  const long = Math.hypot(p2[0] - p0[0], p2[1] - p0[1]) * (1 + Math.hypot(p1[0] - (p0[0] + p2[0]) / 2, p1[1] - (p0[1] + p2[1]) / 2) / 40), h = long / n;
  let s = '';
  for (let i = n - 1; i >= 0; i--) {
    const t = (i + 0.5) / n, [x, y] = at(t), side = i % 2 ? 1 : -1, wi = r2(w * (1 - 0.3 * t)), hy = r2(h * 0.66);
    const ecu = `M${-wi},${r2(-hy * 0.35)} Q${-wi},${r2(hy * 0.7)} 0,${hy} Q${wi},${r2(hy * 0.7)} ${wi},${r2(-hy * 0.35)} Q${r2(wi * 0.9)},${-hy} 0,${-hy} Q${r2(-wi * 0.9)},${-hy} ${-wi},${r2(-hy * 0.35)} Z`;
    s += `<g transform="translate(${r2(x)} ${r2(y)}) rotate(${r2(axe(t))})">` + P(ecu, i % 2 ? tone(c.cheveux, 0.92) : c.hair, 0.65)
      + P(`M${r2(-side * wi * 0.62)},${r2(-hy * 0.62)} Q${r2(-side * wi * 0.1)},${r2(hy * 0.1)} ${r2(side * wi * 0.16)},${r2(hy * 0.86)}`, 'none', 0.42)
      + L([side * wi * 0.42, -hy * 0.5], [side * wi * 0.5, -hy * 0.05], c.hairH, 0.55) + '</g>'; // un reflet, pour que la tresse se lise même sur des cheveux noirs
  }
  if (!bout) return s;
  const [bx, by] = at(1), a = axe(1);
  return s + `<g transform="translate(${r2(bx)} ${r2(by + 0.3)}) rotate(${r2(a)})">`
    + P('M-1.1,0.2 Q-1.9,1.8 -1.5,3 Q-0.8,2.2 -0.3,2.4 Q0,3.6 0.4,3.6 Q0.7,2.4 1.4,2.8 Q1.8,1.6 1.1,0.2 Z', c.hair, 0.7)
    + E(0, 0, r2(w * 0.6), 0.9, c.tie, 0.7) + L([-0.6, -0.4], [0.2, -0.5], tone(c.tie, 1.35), 0.5) + '</g>';
}
// Lock : une mèche roulée en corde, le long d'une courbe (p0 -> p2, p1 : point de contrôle), qui s'affine vers le bas,
// les bouts arrondis ; quelques plis en travers, un reflet le long du bord ; bague : un anneau doré
function lock(p0, p1, p2, w, c, bague = false) {
  const at = t => [0, 1].map(k => (1 - t) ** 2 * p0[k] + 2 * t * (1 - t) * p1[k] + t * t * p2[k]);
  const nrm = t => { const d = [0, 1].map(k => 2 * (1 - t) * (p1[k] - p0[k]) + 2 * t * (p2[k] - p1[k])), l = Math.hypot(d[0], d[1]); return [-d[1] / l, d[0] / l]; };
  // fine à la racine (elle sort du crâne), pleine ensuite, plus fine au bout
  const pt = (t, k) => { const [x, y] = at(t), [nx, ny] = nrm(t), wi = w * Math.min(1, 0.5 + t * 3.5) * (1 - 0.3 * t) * k; return [x + nx * wi, y + ny * wi]; };
  const f = ([x, y]) => `${r2(x)},${r2(y)}`, ts = [0, 0.1, 0.2, 0.35, 0.5, 0.65, 0.8, 0.9, 1];
  const w1 = r2(w * 0.7);
  const d = `M${ts.map(t => f(pt(t, 1))).join(' L')} A${w1},${w1} 0 0,1 ${f(pt(1, -1))} L${ts.slice().reverse().map(t => f(pt(t, -1))).join(' L')} Z`;
  const travers = (t, k = 0.75) => `M${f(pt(t, k))} Q${f(at(t + 0.035))} ${f(pt(t, -k))}`;
  return P(d, c.hair, 0.6) + `<path d="${[0.42, 0.7].map(t => travers(t)).join(' ')}" fill="none" stroke="${c.hairS}" stroke-width=".55" stroke-linecap="round"/>`
    + L(pt(0.16, -0.4), pt(0.4, -0.4), c.hairH, 0.55)
    + (bague ? P(`M${f(pt(0.6, 1.08))} L${f(pt(0.68, 1.08))} L${f(pt(0.68, -1.08))} L${f(pt(0.6, -1.08))} Z`, '#E2B64A', 0.5) : '');
}
// Les locks par vue : celles de devant, le long des joues (par-dessus) ; [départ, contrôle, bout, épaisseur, bague]
const LOCK_G = [[[12.6, 15.6], [10.4, 24], [11.2, 33.2], 1.65, false], [[15, 16.8], [13.6, 24.6], [14.4, 31], 1.5, true]];
const LOCKS = {
  front: LOCK_G.concat(LOCK_G.map(([a, b, e, w, g]) => [[48 - a[0], a[1]], [48 - b[0], b[1]], [48 - e[0], e[1]], w, !g])),
  se: [[[12.6, 16.6], [10.8, 24], [11.4, 31.4], 1.5, false], [[33.8, 16], [36.6, 25], [36.6, 33.6], 1.65, true]]
};
// les locks longues : les mêmes, qui descendent jusqu'à la poitrine, une de plus sur la joue
const allonge = (l, k) => l.map(([a, b, e, w, g]) => [a, [b[0], b[1] + k * 0.5], [e[0], e[1] + k], w, g]);
const LOCKS_LONGUES = {
  front: allonge(LOCKS.front, 5.4).concat([[[11.6, 19], [9.4, 28], [9.8, 36], 1.45, false], [[36.4, 19], [38.6, 28], [38.2, 36], 1.45, false]]),
  se: allonge(LOCKS.se, 5.4).concat([[[35.8, 18.4], [38.4, 27], [38.4, 36.4], 1.45, false]])
};
// derrière le corps (face, trois quarts) : les locks du dos qui dépassent autour du cou et sur les épaules
const LOCKS_DERRIERE = [[12.4, 22, 35.4], [35.6, 22, 35.4]];
// de dos : toutes les locks, du crâne jusqu'au bas du dos, de longueurs inégales
const LOCKS_DOS = [[13, 34.6], [16.6, 37.4], [20.3, 38.6], [24, 37.6], [27.7, 38.8], [31.4, 37.2], [35, 34.4]];
const dosLock = (c, [x, y1], i) => { const y0 = 6.4 + ((x - 24) / 13) ** 2 * 14.6 + 5.4; return lock([x, y0], [x + (x - 24) * 0.12, (y0 + y1) / 2], [x + (x - 24) * 0.06, y1], 1.75, c, i === 1 || i === 5); };
// Le dessus des locks (de face) : les départs des mèches roulées, en sillons sur la frange
const LOCKS_HAUT = 'M17.4,10.4 Q16.4,13.4 16.8,16.6 M21.6,9.6 Q21,12.6 21.4,15.4 M26.4,9.8 Q26.8,12.4 26.4,14.4 M31,11 Q32,13.4 32.4,15.6';

// Le bas des cheveux longs, de droite (xd) à gauche (xg) : n pointes souples, plus longues au milieu (un V doux)
function pointesBas(xd, xg, y, n, v = 1.6) {
  const w = (xd - xg) / n, mid = (xd + xg) / 2, half = (xd - xg) / 2;
  const prof = x => y + v * (1 - ((x - mid) / half) ** 2);
  let d = '';
  for (let i = 0; i < n; i++) {
    const x0 = xd - w * i, x1 = x0 - w, xm = x0 - w / 2, yt = prof(xm) + 1;
    d += ` Q${r2(x0 - w * 0.12)},${r2(yt - 0.3)} ${r2(xm - w * 0.06)},${r2(yt)} Q${r2(x1 + w * 0.3)},${r2(yt - 0.6)} ${r2(x1)},${r2(prof(x1) - 0.5)}`;
  }
  return d;
}
// Mi-longue : la masse descend jusqu'aux épaules, les pointes rebiquent
const MILONGUE = {
  front: 'M10.6,21.6 Q9.8,7 24,6.6 Q38.2,7 37.4,21.6 Q37.6,28.6 39.6,32.6 Q37,33.8 35.2,32.2 L12.8,32.2 Q11,33.8 8.4,32.6 Q10.4,28.6 10.6,21.6 Z',
  se: 'M11.2,21.6 Q10.2,7 24,6.8 Q38.8,7 38.2,21.6 Q38.4,28.6 40.4,32.6 Q37.8,33.8 36,32.2 L13.6,32.2 Q11.8,33.8 9.4,32.6 Q11,28.6 11.2,21.6 Z',
  ne: 'M10.8,21 C10.4,11.4 15.4,6.4 24,6.4 C32.6,6.4 37.6,11.4 37.2,21 Q37.4,28.8 39.4,32.8 Q36.6,34.2 34.4,32.6 Q24,34.4 13.6,32.6 Q11.4,34.2 8.6,32.8 Q10.6,28.8 10.8,21 Z'
};
// Les mèches qui tombent devant les joues (de face, à gauche ; la droite en miroir)
const MECHE_LONGUE = 'M14.4,15 Q9.6,22 10.6,31.4 Q11,33.6 12.2,34.8 Q12.6,32.6 14.2,31.2 Q13.4,22 15.6,17.6 Z';
const MECHE_MILONGUE = 'M14.4,15 Q10,21.6 11,28.4 Q10.4,30.4 9.2,31.4 Q12.2,31.4 13.8,29.6 Q13.4,22 15.6,17.6 Z';
const MECHE_ONDULEE = 'M14.4,15 Q9.8,18.6 11.2,22.6 Q12.6,26.4 10.4,30 Q9.2,33.2 11.6,35.6 Q12.4,33.2 14,31.8 Q15.6,28.4 13.6,24.8 Q12.6,21.4 15.6,17.6 Z';
// Queue sur le côté : nouée bas, sous l'oreille, elle tombe sur l'épaule, près du cou (et son trait de mèche)
const QUEUE_COTE = 'M32.4,27.4 C36.8,27.6 38.6,30.6 38.1,34.4 C37.6,38.2 35.4,40.8 33.2,42.4 Q33.6,40.2 33,39 Q32,40.4 30.8,41 C32.6,38 33.8,35 33.4,32.4 Q33.1,30.2 32.2,29.4 Z';
const QUEUE_COTE_SENS = 'M34.4,30 Q36.6,34 34.4,39.6 M33.6,31.8 Q34.6,35.4 32.4,39.4';
// Le sens des cheveux sur la frange (de face ; de trois quarts, décalé) : des traits fins, et les mèches de couleur
const SENS_FRANGE = {
  defaut: 'M24.6,9.8 Q19.4,11.4 16,16.6 M26.4,9.8 Q23,12.4 21.8,15 M28.2,10 Q32,11.6 34.4,16',
  carre: 'M17.4,11.2 Q16.8,13.8 17.6,16.4 M22.6,10 Q22,13.4 22.6,16.6 M27.2,10.2 Q27.8,13.4 27.2,16.6 M31.4,11.4 Q32,13.8 31.2,16.4',
  meche: 'M30.6,9.2 Q25.2,10.4 21,15 M27.4,8.4 Q21.6,10.2 16.2,16.8',
  bataille: 'M18,12.6 L17.8,16.4 M22.6,12 L22.6,16.2 M27.4,12.4 L27.6,16 M31.8,13.2 L32.2,16.6',
  degrade: 'M18.4,12.4 Q21,9.4 24,8.8 M24,12 Q25.4,9.2 29.6,9.6 M29.6,12.6 Q31.6,11 33.2,13.4',
  banane: 'M15.4,14.4 Q17,8.6 22.6,6.4 M20.6,12.6 Q22.6,7.6 28.2,6.4 M25.6,12.2 Q28.4,8 32.6,7.6 M30.4,13 Q32.6,10.6 34.4,12.6',
  raie: 'M21.8,9.2 Q18,10.8 15.2,15.4 M21.8,9.4 Q26.6,9.2 31,11.2 M24.8,9.6 Q30.6,10.6 34.4,16',
  herisse: 'M17.6,12.4 L17.8,9.2 M21.2,12 L21.4,8 M24.4,11.8 L24,7.2 M27.6,12 L27.6,8 M31,12.6 L31.2,9.4',
  chignonHomme: 'M17.4,12.6 Q19.4,9.6 22.4,8.8 M24,12 L24,8.6 M30.6,12.6 Q28.6,9.6 25.6,8.8'
};
const sensFrange = coupe => (coupe === 'locks' || coupe === 'locksLongues' ? LOCKS_HAUT : SENS_NOUVELLES[coupe] ? SENS_NOUVELLES[coupe] : coupe === 'carre' || coupe === 'deuxChignons' ? SENS_FRANGE.carre : coupe === 'boucleeCourte' ? SENS_FRANGE.degrade : coupe === 'courte' ? SENS_FRANGE_COURTE : SENS_FRANGE[coupe] || SENS_FRANGE.defaut);
// De dos : la silhouette des cheveux (d'un seul tenant), et les mèches qui suivent leur sens (vers l'élastique, le
// chignon, la raie, ou tout droit vers les pointes)
// de dos, la tête descend aussi bas que de face : les cheveux couvrent le haut des bras, la nuque se voit au milieu
const TIRES = 'M11,21 C10.6,11.4 15.4,6.4 24,6.4 C32.6,6.4 37.4,11.4 37,21 Q37.2,29.8 36.2,32.6 Q32.6,34 28.6,32.8 Q27,28.6 24,28.6 Q21,28.6 19.4,32.8 Q15.4,34 11.8,32.6 Q10.8,29.8 11,21 Z'; // cheveux tirés, nuque nette en arche
// les locks tombent sur la nuque : pas d'arche, le bas suit leurs racines
const TIRES_PLEIN = 'M11,21 C10.6,11.4 15.4,6.4 24,6.4 C32.6,6.4 37.4,11.4 37,21 Q37.2,29.8 36.2,32.6 Q24,35 11.8,32.6 Q10.8,29.8 11,21 Z';
const NUQUE = 'M11,21 C10.6,11.4 15.4,6.4 24,6.4 C32.6,6.4 37.4,11.4 37,21 Q37.4,27.4 36.2,30.4 L35.8,32.8 L34.2,31.6 L33.2,33.8 L31.6,32 L30.2,33.8 L28.8,31.9 L27.2,33.4 Q25.8,30.4 24,29.2 Q22.2,30.4 20.8,33.4 L19.2,31.9 L18,33.8 L16.6,32 L15,33.8 L13.8,31.6 L12.2,32.8 L11.8,30.4 Q10.6,27.4 11,21 Z'; // courte : mèches, nuque en V
const RAIE = 'M24,7.4 L24,29.4';
const DOS = {
  courte: { forme: COURT_DOS, sens: 'M23.4,9.6 Q18.6,15 17.8,26.4 M25.2,9.4 Q24.6,18 24,28 M27,9.8 Q31,15.6 30.8,26.4' },
  meche: { forme: COURT_DOS, sens: 'M20.6,9.8 Q17,16 17.8,26.4 M24,9.2 Q25,18 24,28 M27.6,9.6 Q32.4,14 31,26.4' },
  degrade: { forme: TONDU_DOS, sens: 'M22,9.6 Q19.4,14 18.6,24 M24,9 L24,25.6 M26,9.6 Q28.6,14 29.4,24' },
  banane: { forme: COURT_DOS, sens: 'M21.4,9.6 Q18.4,15 18,25.6 M24.6,8.6 Q24.8,17 24.2,27.4 M27.4,9.6 Q30.8,15 30.4,25.6' },
  raie: { forme: COURT_DOS, sens: 'M21.6,9.4 Q18,15 17.8,26 M24,9.2 Q24.4,17 24,27.6 M27,9.6 Q30.6,15 30.6,26' },
  herisse: { forme: TONDU_DOS, sens: 'M21.6,10 Q19.4,15 18.8,24.6 M24.2,9.4 L24,26.4 M26.8,10 Q29,15 29.4,24.6' },
  boucleeCourte: { forme: TONDU_DOS, sens: 'M22,10 Q20,15 19.4,24 M26,10 Q28,15 28.6,24' },
  chignonHomme: { forme: TONDU_DOS, sens: 'M16.4,22.6 Q17,14 21.6,10 M24,26.6 Q23.6,17 24,10.4 M31.6,22.6 Q31,14 26.4,10' },
  bataille: {
    forme: 'M11,21 C10.6,11.4 15.4,6.4 24,6.4 C32.6,6.4 37.4,11.4 37,21 Q37.6,26 36.6,29.4 L36.8,32.6 L34.4,31 L33.8,34 L31.2,32 L30.4,34.4 L28.4,31.8 L27.4,33.8 Q25.8,30.6 24,29.2 Q22.2,30.6 20.6,33.8 L19.6,31.8 L17.6,34.4 L16.8,32 L14.2,34 L13.6,31 L11.2,32.6 L11.4,29.4 Q10.4,26 11,21 Z',
    sens: 'M22.6,9.6 Q18.4,16 17.6,28.6 M25,9.2 Q25,19 25.2,30.4 M27.4,9.8 Q31.6,16 31,28.4'
  },
  carre: {
    forme: 'M10.8,21 C10.4,11.4 15.4,6.4 24,6.4 C32.6,6.4 37.6,11.4 37.2,21 Q37.9,27.6 37.6,30.6 Q37.2,33 34.6,33.2 Q29.4,33.9 24,33.7 Q18.6,33.9 13.4,33.2 Q10.8,33 10.4,30.6 Q10.1,27.6 10.8,21 Z',
    sens: 'M21.6,9.8 Q16.6,17 16.4,29.6 M24.4,9.4 Q24.9,19 24.2,30.8 M27.4,9.8 Q32,17 32,29.6 M18.4,12.4 Q13.4,19 13.4,29.4 M30.4,12.4 Q35,19 34.8,29.4',
    detail: 'M11.8,30.4 Q17.6,32.4 24,32.2 Q30.4,32.4 36.2,30.4' // le bas du carré, qui rentre
  },
  milongue: {
    forme: 'M10.8,21 C10.4,11.4 15.4,6.4 24,6.4 C32.6,6.4 37.6,11.4 37.2,21 Q37.4,28.8 39.4,32.8 Q36.6,34.2 34.4,32.6 Q24,34.4 13.6,32.6 Q11.4,34.2 8.6,32.8 Q10.6,28.8 10.8,21 Z',
    sens: 'M21.4,9.8 Q16.6,18 15.8,32 M24.6,9.4 Q25.2,20 24.4,33.4 M27.8,9.8 Q32.6,18 32.6,32'
  },
  longue: {
    forme: 'M11,21 C10.6,11.4 15.4,6.4 24,6.4 C32.6,6.4 37.4,11.4 37,21 Q37.7,28 36.9,32 Q37.8,35.4 37,38.4' + pointesBas(37, 11, 38.4, 7) + ' Q10.2,35.4 11.1,32 Q10.3,28 11,21 Z',
    sens: 'M21.4,9.8 Q16.4,20 16.8,38.6 M24.4,9.4 Q25.4,22 24,40.4 M27.6,9.8 Q32.4,20 31.4,38.6 M18.6,12 Q13.4,22 14.2,37.6 M30,12 Q35,22 34,37.6'
  },
  ondulee: {
    forme: 'M11,21 C10.6,11.4 15.4,6.4 24,6.4 C32.6,6.4 37.4,11.4 37,21 Q38.8,25.4 37,29.2 Q39,33.2 37,37 Q35.8,40.6 32.2,40.2 Q28.2,42 24,40.6 Q19.8,42 15.8,40.2 Q12.2,40.6 11,37 Q9,33.2 11,29.2 Q9.2,25.4 11,21 Z',
    sens: 'M21.2,9.8 Q17.4,15 18.8,21.6 Q20,28 17.2,34.6 Q16.2,37.6 17.6,39.6 M24.6,9.4 Q26,16 24,23 Q22.4,30 24.8,39.8 M28,9.8 Q31.6,15 29.6,21.6 Q28.2,28 31,34.6 Q32,37.6 30.6,39.6'
  },
  queue: { forme: TIRES, sens: 'M14.4,25.4 Q15.4,17.6 21.6,14.2 M33.6,25.4 Q32.6,17.6 26.4,14.2 M19.6,28.6 Q20.4,20 23,15.4 M28.4,28.6 Q27.6,20 25,15.4' },
  queueCote: { forme: TIRES, sens: 'M25.4,7.8 Q18.6,10.8 14.8,25.2 M30.2,9.4 Q21.6,12.6 15.6,26.4 M34.6,14.2 Q24.6,17.2 16.4,27.4 M36.4,21.6 Q27,23.4 17,28.2' },
  couettes: { forme: TIRES, sens: RAIE + ' M23.2,10.6 Q17.2,12.2 13.6,18.2 M23.2,17 Q18,17.4 13.6,19.6 M23,24.6 Q17.6,24.8 13.8,21 M24.8,10.6 Q30.8,12.2 34.4,18.2 M24.8,17 Q30,17.4 34.4,19.6 M25,24.6 Q30.4,24.8 34.2,21' },
  chignon: { forme: TIRES, sens: 'M15.4,26.6 Q15.6,17.6 20.6,11.8 M24,29.4 Q23.4,20 24,13.4 M32.6,26.6 Q32.4,17.6 27.4,11.8' },
  chignonBas: { forme: TIRES, sens: 'M16.6,12 Q17.4,20 21.4,24.6 M24,10 Q24.4,18 24,23.6 M31.4,12 Q30.6,20 26.6,24.6' },
  deuxChignons: { forme: TIRES, sens: RAIE + ' M23.2,25.6 Q18.6,20 17.4,13.2 M23,18 Q19.8,15 18.6,12.4 M24.8,25.6 Q29.4,20 30.6,13.2 M25,18 Q28.2,15 29.4,12.4' },
  couronne: { forme: TIRES, sens: 'M20.6,8.2 Q16.6,12 15.4,17.6 M24,7.4 L24,21.6 M27.4,8.2 Q31.4,12 32.6,17.6 M17.6,24.6 Q17.4,27.4 18.2,30.6 M30.4,24.6 Q30.6,27.4 29.8,30.6' },
  tresses: { forme: TIRES, sens: RAIE + ' M23.2,10.6 Q18.8,15 17.4,25.4 M23,18 Q20.2,21 18.4,25.6 M24.8,10.6 Q29.2,15 30.6,25.4 M25,18 Q27.8,21 29.6,25.6' },
  pixie: { forme: COURT_DOS, sens: 'M20.4,9.6 Q16.6,15 16.8,25.6 M24,9.2 Q25,18 24,28.4 M27.6,9.6 Q32,14.6 31.2,25.6' },
  demiQueue: {
    forme: 'M10.8,21 C10.4,11.4 15.4,6.4 24,6.4 C32.6,6.4 37.6,11.4 37.2,21 Q37.4,28.8 39.4,32.8 Q36.6,34.2 34.4,32.6 Q24,34.4 13.6,32.6 Q11.4,34.2 8.6,32.8 Q10.6,28.8 10.8,21 Z',
    sens: 'M14.4,18.6 Q16,14.6 21.6,13.4 M33.6,18.6 Q32,14.6 26.4,13.4 M17.4,9.8 Q19.6,11.4 22,13 M30.6,9.8 Q28.4,11.4 26,13 M15.4,22.4 Q14.6,27.4 15.4,32 M32.6,22.4 Q33.4,27.4 32.6,32 M19.6,26.6 Q19.4,29.6 19.8,32.8 M28.4,26.6 Q28.6,29.6 28.2,32.8'
  },
  tresseCote: { forme: TIRES, sens: 'M25.4,7.8 Q18.6,10.8 15.2,24.6 M30.2,9.4 Q21.6,12.6 16,26 M34.6,14.2 Q24.6,17.2 16.8,27 M36.4,21.6 Q27,23.4 17.4,28' },
  puffs: { forme: TIRES, sens: 'M14.6,24.6 Q14.6,17 16.2,11.6 M19.6,28.4 Q19.8,18 17.6,11.2 M33.4,24.6 Q33.4,17 31.8,11.6 M28.4,28.4 Q28.2,18 30.4,11.2 M24,28.6 L24,9.6' },
  locksLongues: { forme: TIRES_PLEIN, sens: 'M17.4,10.4 Q15.4,18 15.8,27.6 M21,8.8 Q20,18 20.4,29.2 M24.4,8.4 Q24.6,18 24.4,29.6 M28,8.8 Q29,18 28.4,29.2 M31.4,10.6 Q33.2,18 32.6,27.6' },
  locks: { forme: TIRES_PLEIN, sens: 'M17.4,10.4 Q15.4,18 15.8,27.6 M21,8.8 Q20,18 20.4,29.2 M24.4,8.4 Q24.6,18 24.4,29.6 M28,8.8 Q29,18 28.4,29.2 M31.4,10.6 Q33.2,18 32.6,27.6' }
};

// Ce qu'un chapeau couvre : le haut de la tête (pas d'épis ni de chignon au sommet dessous)
const COUVRE_HAUT = new Set(['bonnet', 'paille', 'casquette', 'bandana', 'beret']);
// Les coupes qui cachent les oreilles, par vue (les boucles d'oreilles ne se voient pas dessous)
const OREILLES_CACHEES = { front: new Set(['longue', 'carre', 'milongue', 'ondulee', 'demiQueue']), se: new Set(['carre', 'milongue', 'demiQueue']) };
// Pointes colorées : de quelle hauteur à quelle hauteur la seconde couleur monte, par coupe (repère de la tête)
const POINTES = {
  courte: [12, 19.4], meche: [11, 19.4], bataille: [10, 18.4], carre: [19, 30], milongue: [21, 33.4], longue: [24, 40], ondulee: [24, 41],
  queue: [16, 38], queueCote: [26, 41], couettes: [20, 29], chignon: [18, 30], deuxChignons: [18, 30], couronne: [18, 30], tresses: [26, 38],
  bouclee: [12, 30], locks: [22, 38], degrade: [9, 16], banane: [4, 14], raie: [9, 17], herisse: [5, 14], boucleeCourte: [8, 14], chignonHomme: [5, 16],
  pixie: [10, 19.6], demiQueue: [21, 33.4], tresseCote: [26, 43], puffs: [9, 1], locksLongues: [24, 42]
};
// Les cheveux en une ou deux couleurs : h, le personnage avec la peinture des cheveux (couleur ou dégradé) ; defs, le dégradé
// De dos, les pointes sont à la nuque ou au bas des cheveux longs
const POINTES_DOS = {
  courte: [22, 30], meche: [22, 30], bataille: [22, 31], carre: [24, 31.6], milongue: [26, 34], longue: [28, 41], ondulee: [28, 42],
  queue: [20, 33], queueCote: [24, 41], couettes: [20, 30], chignon: [22, 30], deuxChignons: [22, 30], couronne: [22, 30], tresses: [26, 40],
  bouclee: [16, 30], locks: [24, 40], degrade: [18, 28], banane: [18, 28], raie: [18, 28], herisse: [16, 28], boucleeCourte: [16, 28], chignonHomme: [10, 28],
  pixie: [22, 30.6], demiQueue: [26, 34], tresseCote: [26, 40], puffs: [12, 2], locksLongues: [26, 44]
};
function peinture(c, view) {
  const o = c.o;
  if (o.meches !== 'pointes' || o.coupe === 'rasee') return { h: c, defs: '' };
  const [y0, y1] = (view === 'ne' ? POINTES_DOS : POINTES)[o.coupe];
  const g = (id, a, b) => `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="0" y1="${y0}" x2="0" y2="${y1}"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`;
  const idH = `${c.uid}hg`, idS = `${c.uid}hs`;
  return { h: { ...c, hair: `url(#${idH})`, hairS: `url(#${idS})` }, defs: `<defs>${g(idH, c.hair, c.meche)}${g(idS, c.hairS, c.mecheS)}</defs>` };
}
// Mèches de couleur : le long du sens des cheveux, découpées dans leur forme
const meches = (c, view, d, sens) => clip(`${c.uid}mc${view}`, d, `<path d="${sens}" fill="none" stroke="${mix(c.meche, c.cheveux, 0.2)}" stroke-width="1.3" stroke-linecap="round"/>`);
// Couronne tressée : la tresse fait le tour de la tête ; de face, elle passe sur le dessus, d'une oreille à l'autre ;
// de dos, elle traverse l'arrière de la tête en arc
function couronneTresse(c, view) {
  if (view === 'ne') return tresse([11.8, 14.6], [24, 30.4], [36.2, 14.6], 9, 2.1, c, false);
  const k = view === 'se' ? -1.2 : 0;
  return tresse([12.4 + k, 17.6], [24 + k, 0.8], [35.6 + k, 17.6], 9, 2, c, false);
}

// Ce que chaque coupe met derrière le corps (cheveux longs)
function hairBehindBody(c0, view) {
  const { h: c } = peinture(c0, view);
  const coupe = c.o.coupe;
  if (view === 'ne') return '';
  if (coupe === 'longue') return P(view === 'se' ? 'M36.4,22 Q37.6,34 35.4,39' + pointesBas(35.4, 13.4, 39, 6) + ' Q11,34 12.4,22 Z' : 'M36.4,22 Q37.8,34 35.6,39.2' + pointesBas(35.6, 12.4, 39.2, 6) + ' Q10.2,34 11.6,22 Z', c.hairS);
  if (coupe === 'locks' || coupe === 'locksLongues') return LOCKS_DERRIERE.map(([x, y0, y1]) => lock([view === 'se' ? x + 0.6 : x, y0], [x + (x - 24) * 0.06, (y0 + y1) / 2], [x, coupe === 'locks' ? y1 : y1 + 6], 1.7, c)).join('');
  if (coupe === 'ondulee') {
    const d = 'M11.4,22 Q8.4,26.4 10.4,30.6 Q8.2,34.8 10.6,38.6 Q11.8,42.4 15.6,41.8 Q19.6,43.4 24,41.8 Q28.4,43.4 32.4,41.8 Q36.2,42.4 37.4,38.6 Q39.8,34.8 37.6,30.6 Q39.6,26.4 36.6,22 Z';
    return P(view === 'se' ? sx(d, 0.4) : d, c.hairS);
  }
  return '';
}
// Derrière la tête : chignons, queue de cheval, nuage de boucles
function hairBack(c, view) {
  const { coupe } = c.o;
  const H = c.hair, S = c.hairS;
  let s = '';
  if (view === 'ne') return s; // de dos : tout se dessine avec la silhouette (head)
  if (coupe === 'chignon' && !c.couvert) {
    s += E(view === 'se' ? 25.4 : 24, 7.8, 4.4, 3.6, H) + P(`M${view === 'se' ? 22 : 20.6},6.8 Q${view === 'se' ? 25.4 : 24},5 ${view === 'se' ? 28.8 : 27.4},6.8`, 'none', 0.6);
  }
  if (coupe === 'deuxChignons' && !c.couvert && !c.oreillesPortees) {
    const xs = view === 'se' ? [14.6, 32] : [15.4, 32.6];
    s += xs.map(x => E(x, 8.8, 3.7, 3.4, H) + P(`M${r2(x - 1.9)},8.8 Q${x},6.2 ${r2(x + 1.9)},8.6`, 'none', 0.55)).join('');
  }
  if (coupe === 'queue') {
    // queue haute : nouée derrière la tête, elle retombe sur le côté
    const q = 'M31.4,9.6 C36.6,6.6 42,9.8 41.8,16.4 C41.6,21.8 39.8,26 37.4,30.4 Q37.4,27.6 36.8,26 Q36,28.2 34.6,29.2 C36.2,25 37.2,21 36.8,17.4 C36.4,14 34.8,12.4 32.6,12.6 Z';
    const k = view === 'se' ? 0.6 : 0;
    s += P(sx(q, k), H) + clip(`${c.uid}qf${view}`, sx(q, k), `<path d="${sx('M44,17 Q38,20 34,30 L44,32 Z', k)}" fill="${S}"/>`) + P(sx(q, k), 'none')
      + P(sx('M35.4,10.6 Q39.8,12.6 39.4,19 Q39,23.4 37.6,26.6 M34.6,12.8 Q37.6,15.4 37.4,20.4', k), 'none', 0.5) + L([35.6 + k, 9.6], [38.6 + k, 10.4], c.hairH, 0.9)
      + E(32.8 + k, 11.6, 1.7, 1.5, c.tie, 0.85) + L([32.2 + k, 11], [33.2 + k, 10.8], tone(c.tie, 1.35), 0.5);
  }
  if (coupe === 'puffs' && !c.couvert && !c.oreillesPortees) {
    const k = view === 'se' ? -0.8 : 0;
    s += puff(c, `${c.uid}pf1${view}`, 14.2 + k, 9.6, 4.8, 16.4 + k, 11.6) + puff(c, `${c.uid}pf2${view}`, 33.8 + k, 9.6, 4.8, 31.6 + k, 11.6);
  }
  if (coupe === 'demiQueue' && !c.couvert) {
    // demi-queue : la petite queue nouée derrière le sommet dépasse en plumet
    const k = view === 'se' ? 0.8 : 0, q = 'M25,8.8 C25.6,5.8 30.4,4.8 32.8,6.8 Q31.2,6.6 30.4,7.6 Q31.8,8 32.4,9.4 Q29.4,8.2 27.2,9.8 Z';
    s += P(sx(q, k), c.hair) + P(sx('M27,7.8 Q29,6.2 31.4,6.4', k), 'none', 0.45) + E(25.8 + k, 8.8, 1.6, 1.2, c.tie, 0.75);
  }
  // la tresse du fond, de trois quarts : derrière le visage, elle ne se voit que sous la mâchoire
  if (coupe === 'tresses' && view === 'se') s += tresse([13.4, 24.6], [12, 32.4], [13.8, 40.2], 5, 2.6, c);
  if (coupe === 'bouclee') {
    const cl = curls(view === 'se' ? 23.6 : 24, 17.6, 15.4, 11.6, 14);
    s += P(cl, H) + clip(`${c.uid}cb${view}`, cl, `<rect x="4" y="22" width="40" height="14" fill="${S}"/>`) + P(cl, 'none');
  }
  return s;
}

// Un puff : une boule de boucles, plus sombre dessous, deux petites boucles et un reflet ; l'élastique à sa base (bx, by)
function puff(c, id, x, y, r, bx, by) {
  const cl = curls(x, y, r, r * 0.92, 9, 1.1);
  return P(cl, c.hair) + clip(id, cl, `<ellipse cx="${r2(x + r * 0.3)}" cy="${r2(y + r * 0.7)}" rx="${r2(r * 1.2)}" ry="${r2(r * 0.7)}" fill="${c.hairS}"/>`) + P(cl, 'none')
    + bouclette(r2(x - r * 0.3), r2(y - r * 0.1), r * 0.36, c) + bouclette(r2(x + r * 0.35), r2(y + r * 0.25), r * 0.32, c)
    + L([x - r * 0.6, y - r * 0.55], [x - r * 0.15, y - r * 0.8], c.hairH, 0.9) + E(bx, by, 1.5, 1, c.tie, 0.7);
}
// Les deux couettes, de face (de trois quarts, celle du fond se décale vers la nuque)
const couettes = (c, view) => {
  const left = view === 'se' ? sx(COUETTE, -0.6) : COUETTE;
  const right = view === 'se' ? sx(mirror(COUETTE), 0.6) : mirror(COUETTE);
  const ties = view === 'se' ? [[11.6, 19.6], [36.8, 19.6]] : [[12.2, 19.6], [35.8, 19.6]];
  return P(left, c.hair) + P(right, c.hair) + P(sx('M8.6,22.4 Q8,25.4 8.4,27.6', view === 'se' ? -0.6 : 0), 'none', 0.5)
    + ties.map(([x, y]) => E(x, y, 1.5, 1.3, c.tie, 0.8)).join('');
};

// Cils : au coin extérieur de l'œil ouvert, ou au bout du trait de l'œil fermé
const MODES = { rire: 'joy', endormi: 'blink', surpris: 'big', gene: 'squeeze', triste: 'sad', fache: 'angry' };
function cils(c, eyes, ey, ctx) {
  const o = c.o;
  if (o.cils === 'sans') return '';
  const rest = ctx.expr === 'neutre' && o.formeYeux === 'paisibles' ? 'sleepy' : 'open';
  const mode = ctx.eyeMode || MODES[ctx.expr] || (ctx.blink ? 'blink' : rest);
  const cx = (eyes[0][0] + eyes[1][0]) / 2;
  const angles = o.cils === 'recourbes' ? [28, 52, 74] : [50, 74], len = o.cils === 'recourbes' ? 1.25 : 1;
  let s = '';
  for (const [x, y, rx] of eyes) {
    const m = cx > x ? -1 : 1; // vers l'extérieur du visage
    if (mode === 'open' || mode === 'big') {
      const ry = mode === 'big' ? ey + 0.1 : ey, rr = mode === 'big' ? rx + 0.25 : rx;
      for (const a of angles) {
        const t = a * Math.PI / 180, bx = x + m * rr * Math.sin(t), by = y - ry * Math.cos(t), t2 = t + 0.45;
        s += P(`M${r2(bx)},${r2(by)} Q${r2(bx + m * len * 0.55 * Math.sin(t2))},${r2(by - len * 0.8 * Math.cos(t2) - 0.15)} ${r2(bx + m * len * Math.sin(t2 + 0.25))},${r2(by - len * Math.cos(t2 + 0.25))}`, 'none', 0.6);
      }
    } else if (mode === 'blink' || mode === 'sleepy' || mode === 'joy') {
      const ex = x + m * (mode === 'sleepy' ? rx + 0.4 : 1.7), eyy = mode === 'joy' ? y + 1 : mode === 'sleepy' ? y + 0.5 : y + 0.4;
      for (let i = 0; i < angles.length; i++) s += L([ex - m * 0.35 * i, eyy + 0.15 * i], [ex + m * (0.55 + 0.2 * i), eyy + 0.95 - 0.1 * i], OUT, 0.55);
    }
  }
  return s;
}
// Lèvres teintées : la bouche au repos (et le sourire, la moue triste) de la couleur choisie
function levres(c, ctx, mx, my) {
  if (!c.levres) return '';
  let d = null;
  if (ctx.expr === 'neutre') d = BOUCHE[c.o.bouche](mx, my);
  else if (ctx.expr === 'content' && !ctx.open) d = `M${r2(mx - 1.7)},${my} Q${mx},${r2(my + 1.6)} ${r2(mx + 1.7)},${my}`;
  else if (ctx.expr === 'triste') d = `M${r2(mx - 1.4)},${r2(my + 1.1)} Q${mx},${r2(my - 0.1)} ${r2(mx + 1.4)},${r2(my + 1.1)}`;
  return d ? `<path d="${d}" fill="none" stroke="${tone(c.levres, 0.82)}" stroke-width="1.15" stroke-linecap="round"/>` : '';
}

// De dos, le cou relie la tête au buste : la nuque se voit sous les cheveux courts ou tirés (derrière le col)
function nuque(c) {
  const d = 'M19.2,24.6 L28.8,24.6 L29.2,33.6 L18.8,33.6 Z';
  return P(d, c.skinS);
}

// Les taches de rousseur : quelques-unes, sur les joues, denses (joues et nez), ou seulement en travers du nez
function rousseur(genre, se, fr, quelques, col) {
  if (genre === 'non') return '';
  const nx = se ? 20.6 : 24;
  const nez = [[nx - 1.6, 24.6], [nx - 0.6, 24.2], [nx + 0.6, 24.2], [nx + 1.6, 24.6], [nx - 1.1, 25.3], [nx + 1.1, 25.3]];
  const pts = genre === 'nez' ? nez : genre === 'legere' ? fr.filter((p, i) => quelques.includes(i))
    : genre === 'dense' ? fr.concat(nez, fr.map(([x, y]) => [x + 0.9, y + 0.7])) : fr;
  return pts.map(([x, y], i) => E(x, y, i % 3 ? 0.36 : 0.44, i % 3 ? 0.34 : 0.42, col, 0)).join('');
}
// Les marques de l'âge : mûr, les pattes d'oie et un pli au front ; âgé, en plus, les plis des joues et un second pli
function rides(age, se, col) {
  if (age !== 'mur' && age !== 'age') return '';
  const t = (d, w = 0.5) => `<path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round"/>`;
  const yeux = se ? [[13.4, -1], [28.4, 1]] : [[15.4, -1], [32.6, 1]];
  let s = yeux.map(([x, k]) => t(`M${r2(x)},${22.2} l${r2(k * 1.1)},-0.6 M${r2(x)},${23.2} l${r2(k * 1.2)},0.1 M${r2(x)},${24.1} l${r2(k * 1)},0.7`, 0.42)).join('');
  const mx = se ? 21.4 : 24;
  s += t(`M${r2(mx - 3.4)},16.4 Q${mx},15.6 ${r2(mx + 3.4)},16.4`, 0.45);
  if (age === 'age') {
    s += t(`M${r2(mx - 2.6)},17.6 Q${mx},17 ${r2(mx + 2.6)},17.6`, 0.4)
      + t(`M${r2(mx - 3.6)},25.2 Q${r2(mx - 4.4)},26.8 ${r2(mx - 3.6)},28.4 M${r2(mx + 3.6)},25.2 Q${r2(mx + 4.4)},26.8 ${r2(mx + 3.6)},28.4`, 0.5);
  }
  return s;
}
// Une cicatrice : en travers du sourcil, sur la joue, sur l'arête du nez, ou au coin de la lèvre ; claire, ses points
function cicatrice(ou, se, peau) {
  if (!ou || ou === 'sans') return '';
  const P0 = { sourcil: se ? [15.8, 19.4, 17, 22.2] : [18.2, 19.2, 19.6, 22.2], joue: se ? [14.2, 25.4, 16.4, 27.4] : [30.4, 25, 32.6, 27.2],
    nez: se ? [19.6, 23.4, 21.4, 24.6] : [23, 23.2, 25, 24.4], levre: se ? [22, 27.6, 22.8, 29.6] : [25.6, 27.4, 26.4, 29.6] }[ou];
  const [x0, y0, x1, y1] = P0, pale = mix(peau, '#FFFFFF', 0.35), S = tone(peau, 0.66);
  const mx = (x0 + x1) / 2, my = (y0 + y1) / 2, nx = -(y1 - y0) * 0.22, ny = (x1 - x0) * 0.22;
  return `<path d="M${x0},${y0} L${x1},${y1}" stroke="${S}" stroke-width="1" stroke-linecap="round"/><path d="M${x0},${y0} L${x1},${y1}" stroke="${pale}" stroke-width=".48" stroke-linecap="round"/>`
    + `<path d="M${r2(mx - nx)},${r2(my - ny)} L${r2(mx + nx)},${r2(my + ny)}" stroke="${S}" stroke-width=".38" stroke-linecap="round"/>`;
}
function head(c0, ctx) {
  const { view } = ctx;
  const { h: c, defs } = peinture(c0, view);
  const o = c.o, H = c.hair, S = c.hairS, HI = c0.hairH;
  const coupe = o.coupe, couvert = c0.couvert;
  const avecMeches = o.meches === 'meches' && coupe !== 'rasee';
  let s = defs + (ctx.sway ? `<g transform="translate(${r2(-ctx.sway * 1.2)} 0)">${hairBack(c, view)}</g>` : hairBack(c, view));
  // --- de dos : l'arrière de la tête ---
  if (view === 'ne') {
    // ombre de la masse : plus sombre vers la nuque et à droite ; la zone claire descend avec les cheveux longs
    const longs = coupe === 'longue' || coupe === 'ondulee' || coupe === 'milongue';
    const ombre = forme => clip(`${c.uid}h`, forme, `<rect x="8" y="4" width="34" height="40" fill="${S}"/><ellipse cx="22.4" cy="${longs ? 21 : 18.4}" rx="13.8" ry="${longs ? 16.4 : 12.8}" fill="${H}"/>`);
    if (coupe === 'rasee') {
      // crâne rasé : un duvet de la couleur des cheveux sur la peau, la nuque dégagée, les oreilles de chaque côté
      const tete = CRANE_DOS;
      const duvet = 'M8,4 L40,4 L40,27.4 Q34.6,29.6 31,28.6 Q27.6,30.4 24,29.8 Q20.4,30.4 17,28.6 Q13.4,29.6 8,27.4 Z';
      s += P(tete, c.skin) + clip(`${c.uid}rz`, tete, `<path d="M8,31.6 Q24,34.4 40,31.6 L40,40 L8,40 Z" fill="${c.skinS}"/><path d="${duvet}" fill="${c.buzz}"/>` + P('M14,28.8 Q17.4,30 20.4,29.4 M27.6,29.4 Q30.6,30 34,28.8', 'none', 0.45)
        + [[17.4, 12], [21.4, 10.4], [26.6, 10.6], [30.6, 12.4], [19, 17], [24, 16.2], [29, 17.2], [16.4, 21.4], [31.6, 21.4]].map(([x, y]) => L([x, y], [x + 0.4, y + 1], c.buzzS, 0.5)).join('')
        + L([17, 10.6], [21.4, 8.8], tone(c.buzz, 1.25), 1.1)) + P(tete, 'none');
      s += E(11.8, 21.6, 1.5, 2.1, c.skin) + E(36.2, 21.6, 1.5, 2.1, c.skin);
      return s + couche(c0, 'cheveux', ctx) + couche(c0, 'tete', ctx);
    }
    if (COURTES.has(coupe)) {
      // sous une coupe courte, le crâne : la nuque se voit, ombrée en bas ; tondue (un duvet) sur les coupes à la tondeuse,
      // juste effilée sur les autres
      const tete = CRANE_DOS;
      s += P(tete, c.skin) + clip(`${c.uid}nq`, tete, `<path d="M8,31 Q24,34 40,31 L40,40 L8,40 Z" fill="${c.skinS}"/>`
        + (TONDUES.has(coupe) ? `<path d="M8,4 L40,4 L40,30.4 Q24,32.4 8,30.4 Z" fill="${c.buzz}"/>` : `<path d="M10,25 Q24,31.6 38,25 L38,29.6 Q24,32 10,29.6 Z" fill="${c.buzz}" opacity=".7"/>`)) + P(tete, 'none');
    }
    s += COURTES.has(coupe) ? E(11.8, 21.6, 1.55, 2.15, c.skin) + E(36.2, 21.6, 1.55, 2.15, c.skin) : E(12.6, 23, 1.6, 2.2, c.skin) + E(35.4, 23, 1.6, 2.2, c.skin);
    if (coupe === 'bouclee') {
      // un nuage de boucles, plus sombre vers la nuque, de petites boucles dessinées dessus
      // une rangée de boucles à la nuque, dans l'ombre du nuage : elle pose la tête sur les épaules
      const bas = curls(24, 27.8, 13.4, 6, 10, 1.7);
      s += P(bas, S) + P(bas, 'none');
      const cl = curls(24, 17.6, 15.4, 11.6, 14);
      s += P(cl, H) + ombre(cl) + P(cl, 'none')
        + [[18, 12], [24, 10.4], [30, 12], [15.4, 18], [21.4, 17], [27, 17.4], [32.6, 18.6], [18.4, 23.6], [24.4, 24.4], [30.2, 23.4]].map(([x, y]) => bouclette(x, y, 1.8, c0)).join('')
        + L([16.4, 11], [20.6, 9], HI, 1.2);
      if (avecMeches) s += meches(c0, view, cl, 'M17,10 Q15.4,17 17,25 M24,8.4 Q24.6,17 23.8,27 M31,10 Q32.6,17 31,25');
      return s + couche(c0, 'cheveux', ctx) + couche(c0, 'tete', ctx);
    }
    const dos = DOS[coupe === 'chignon' && couvert ? 'chignonBas' : coupe];
    s += P(dos.forme, H) + ombre(dos.forme) + P(dos.forme, 'none') + clip(`${c.uid}hs`, dos.forme, P(dos.sens + (dos.detail ? ' ' + dos.detail : ''), 'none', 0.55)) + L([16.4, 10.6], [21.6, 8.6], HI, 1.3);
    if (avecMeches) s += meches(c0, view, dos.forme, dos.sens);
    if (coupe === 'locks' || coupe === 'locksLongues') s += [0, 2, 4, 6, 1, 3, 5].map(i => { const [x, y] = LOCKS_DOS[i]; return dosLock(c, [x, coupe === 'locks' ? y : y + 5.6], i); }).join('');
    if ((coupe === 'bataille' || coupe === 'herisse') && !couvert) s += P(EPIS.ne[0], H, 0) + P(EPIS.ne[1], 'none', 1) + L([16.6, 7.4], [21.4, 6.6], HI, 1.1);
    if (coupe === 'boucleeCourte' && !couvert) { const cl = curls(24, 13.4, 11.6, 6.6, 12, 1.4); s += P(cl, H) + ombre(cl) + P(cl, 'none') + L([16.6, 9.6], [21, 8], HI, 1.1); }
    if (coupe === 'chignonHomme' && !couvert) s += E(24, 10.2, 3.2, 2.7, H) + P('M21.6,9.6 Q24,7.6 26.4,9.6', 'none', 0.55) + E(24, 12.6, 1.6, 0.8, c.tie, 0.6) + L([22.2, 8.4], [23.8, 7.6], HI, 0.9);
    if (coupe === 'queue') {
      const queue = 'M22.4,13.4 C18,15.4 17.8,22.4 19.4,27.6 C20.6,31.4 20.6,35 22.4,38.8 Q23,36.6 24.2,35.8 Q24.8,37.8 26.6,39.2 C26.8,35.6 28.8,31.4 29.2,26.4 C29.6,21 29.4,15.4 25.6,13.4 Z';
      s += P(queue, H) + clip(`${c.uid}qd`, queue, `<path d="M25.4,12 Q31,22 26,40 L32,40 L32,12 Z" fill="${S}"/>`) + P(queue, 'none')
        + P('M22.6,16.4 Q20.4,22.4 21.6,28.6 Q22.4,32.4 22.8,35.6 M25.2,16.2 Q26.8,22.6 25.6,29 Q25,33 25.6,36.6', 'none', 0.5) + L([21.4, 16.6], [20.6, 21.4], c.hairH, 0.9)
        + E(24, 13.6, 2.7, 1.6, c.tie, 0.85) + L([22.8, 13.1], [24.4, 12.8], tone(c.tie, 1.35), 0.5);
    }
    if (coupe === 'demiQueue' && !couvert) {
      const q = 'M22.2,13.2 C19.4,15.4 19.8,20.6 21.4,24.6 Q22.8,27 24,27.6 Q25.2,27 26.6,24.6 C28.2,20.6 28.6,15.4 25.8,13.2 Z';
      s += P(q, H) + clip(`${c.uid}dq`, q, `<rect x="24.4" y="12" width="5" height="17" fill="${S}"/>`) + P(q, 'none') + P('M23,16.4 Q22.4,21 23.4,25.4 M25.2,16.4 Q25.8,21 24.8,25.4', 'none', 0.45)
        + E(24, 13.4, 2.4, 1.4, c.tie, 0.8) + L([22.8, 12.9], [24.2, 12.7], tone(c.tie, 1.35), 0.5);
    }
    if (coupe === 'tresseCote') s += tresse([15.2, 26.2], [12.4, 31.4], [12.8, 40.6], 5, 2.9, c);
    if (coupe === 'puffs' && !couvert && !c0.oreillesPortees) s += puff(c, `${c.uid}pf1ne`, 14.6, 9.6, 4.8, 17, 12) + puff(c, `${c.uid}pf2ne`, 33.4, 9.6, 4.8, 31, 12);
    if (coupe === 'queueCote') s += P(mirror(QUEUE_COTE), H) + P(mirror(QUEUE_COTE_SENS), 'none', 0.5) + E(13.8, 28.4, 1.6, 1.4, c.tie, 0.8);
    if (coupe === 'couettes') s += couettes(c, 'front');
    if (coupe === 'chignon') {
      s += couvert ? E(24, 25.4, 3.8, 3.2, H) + P('M21.2,24.6 Q24,23 26.8,24.6', 'none', 0.55)
        : E(24, 9.6, 5.2, 4.2, H) + P('M20.4,9.4 Q24,6.6 27.6,9.4', 'none', 0.6) + L([20.8, 7.8], [23.4, 6.8], HI, 1.1);
    }
    if (coupe === 'deuxChignons' && !couvert && !c0.oreillesPortees) s += [16.8, 31.2].map(x => E(x, 10.4, 3.7, 3.4, H) + P(`M${r2(x - 1.9)},10.4 Q${x},7.8 ${r2(x + 1.9)},10.2`, 'none', 0.55)).join('');
    if (coupe === 'couronne' && !couvert) s += couronneTresse(c, view);
    if (coupe === 'tresses') s += tresse([15, 26.4], [13.6, 34], [15.4, 41.6], 5, 2.8, c) + tresse([33, 26.4], [34.4, 34], [32.6, 41.6], 5, 2.8, c);
    return s + couche(c0, 'cheveux', ctx) + couche(c0, 'tete', ctx);
  }
  // --- de face ou de trois quarts ---
  const se = view === 'se';
  const face = faceD(view, o.visage, o.genre === 'homme' ? o.menton : 'doux');
  const back = coupe === 'carre' ? BOB[view] : coupe === 'milongue' || coupe === 'demiQueue' ? MILONGUE[view] : COURTES.has(coupe) || coupe === 'puffs' ? COURT_BACK[view] : BACK[view];
  if (coupe === 'chignonHomme' && !couvert) s += E(se ? 25 : 24, 7.4, 3.2, 2.4, H) + P(`M${se ? 22.8 : 21.8},7.2 Q${se ? 25 : 24},5.6 ${se ? 27.2 : 26.2},7.2`, 'none', 0.55);
  if (coupe !== 'rasee' && coupe !== 'bouclee') s += P(back, H) + clip(`${c.uid}h`, back, `<rect x="8" y="24.6" width="32" height="10" fill="${S}"/>`) + P(back, 'none');
  // oreilles (cachées par les cheveux longs de face, par le carré et la mi-longue)
  const oreilles = !OREILLES_CACHEES[view].has(coupe);
  if (oreilles) s += se ? E(35, 23.2, 1.5, 2.1, c.skin) : E(11.8, 22.8, 1.5, 2.1, c.skin) + E(36.2, 22.8, 1.5, 2.1, c.skin);
  const fr = se ? [[15.8, 24.7], [17, 25.4], [14.9, 25.2], [26.8, 24.8], [27.8, 25.4]]
    : [[17.6, 24.8], [18.8, 25.5], [16.6, 25.3], [30.4, 24.8], [29.2, 25.5], [31.4, 25.3]];
  const quelques = se ? [0, 1, 3] : [0, 1, 3, 4];
  const cheeks = se ? [[15.2, 1.8], [28.2, 1.5]] : [[16.6, 1.9], [31.4, 1.9]];
  // la frange de la coupe (de trois quarts, décalée vers le côté du regard)
  // sous un chapeau, la banane et la hérissée se couchent (la frange plate du dégradé)
  const fk = couvert && (coupe === 'banane' || coupe === 'herisse') ? 'degrade' : coupe;
  const frange = coupe === 'rasee' || coupe === 'bouclee' ? null
    : FRANGE[fk] ? (se ? sx(FRANGE[fk], -1) : FRANGE[fk]) : BANGS[view];
  s += P(face, c.skin);
  s += clip(`${c.uid}f`, face, (frange ? `<path d="${frange}" fill="${c.skinS}" transform="translate(0 1.4)"/>` : '')
    + (o.joues === 'sans' && ctx.expr !== 'gene' ? '' : cheeks.map(([x, rx]) => E(x, 26.2, rx * (ctx.expr === 'gene' ? 1.3 : 1), ctx.expr === 'gene' ? 1.6 : 1.1, c.cheek, 0)).join(''))
    + rousseur(o.rousseur, se, fr, quelques, c.freckle));
  s += P(face, 'none');
  if (o.genre === 'homme' && o.menton === 'fendu') { const mx = view === 'se' ? 20.8 : 24; s += `<path d="M${mx},31.9 Q${r2(mx + 0.25)},32.5 ${mx},33.1" fill="none" stroke="${c.skinS}" stroke-width=".7" stroke-linecap="round"/>`; }
  s += rides(o.age, se, tone(c0.skin, 0.72));
  // la barbe et la moustache, par-dessus le contour du visage (la barbe fait elle-même le bas du visage)
  if (o.barbe !== 'sans') s += barbe(c0, view, face, o.barbe);
  if (o.moustache !== 'sans') s += moustache(c0, view, o.moustache);
  if (o.grain !== 'non') { const [x, y] = GRAIN[o.grain][view]; s += E(x, y, 0.45, 0.45, c.mole, 0); }
  // l'homme : un petit trait de nez, l'ombre de l'arête
  if (o.genre === 'homme') { const nx = se ? 20.4 : 24; s += `<path d="M${r2(nx + 0.4)},23.8 Q${r2(nx + 1)},25.1 ${r2(nx - 0.2)},25.4" fill="none" stroke="${c.skinS}" stroke-width=".7" stroke-linecap="round"/>`; }
  s += couche({ ...c0, oreillesVisibles: oreilles }, 'oreilles', ctx) + couche(c0, 'joues', ctx);
  // le dessus de la tête selon la coupe
  if (coupe === 'rasee') {
    const cap = se ? 'M11.8,19.6 Q11.6,8.4 23,7.8 Q34.8,8.2 35.4,19 Q33,14.2 23.2,13.8 Q14.6,14 11.8,19.6 Z' : 'M12.4,19.8 Q12.2,8.2 24,7.8 Q35.8,8.2 35.6,19.8 Q33.4,13.8 24,13.6 Q14.6,13.8 12.4,19.8 Z';
    s += P(cap, c.buzz, 0.9) + L(se ? [15.4, 11.4] : [17, 11], se ? [21.4, 9.6] : [23, 9.4], tone(c.buzz, 1.25), 1);
  } else if (coupe === 'bouclee') {
    // une rangée de boucles rondes sur le front, celles des côtés plus bas
    const k = se ? -1 : 0;
    const rang = [[13.8, 15.2, 2.7], [34.2, 15.2, 2.7], [18.4, 11.4, 3.3], [29.6, 11.4, 3.3], [24, 9.8, 3.4]];
    const top = rang.map(([x, y, r]) => curls(x + k, y, r, r * 0.86, 7, 0.8)).join(' ');
    s += rang.map(([x, y, r], i) => { const d = curls(x + k, y, r, r * 0.86, 7, 0.8); return P(d, H, 0.65) + P(`M${r2(x + k - r * 0.5)},${r2(y + r * 0.3)} Q${r2(x + k)},${r2(y + r * 0.75)} ${r2(x + k + r * 0.5)},${r2(y + r * 0.3)}`, 'none', 0.4) + L([x + k - r * 0.45, y - r * 0.35], [x + k - r * 0.05, y - r * 0.5], HI, 0.7); }).join('')
      + L(se ? [16, 10.6] : [17, 10.4], se ? [18.6, 9.2] : [19.6, 9], HI, 1);
    if (avecMeches) s += meches(c, view, top, sx('M17,9 Q16.6,11.6 17.4,14 M24,7.4 Q24.4,10 24,12.6 M31,9 Q31.4,11.6 30.6,14', k));
  } else {
    if (coupe === 'bataille' && !couvert) s += P(se ? sx(EPIS.front[0], -1) : EPIS.front[0], H, 0) + P(se ? sx(EPIS.front[1], -1) : EPIS.front[1], 'none', 1);
    // les tempes tondues des coupes à la tondeuse (de trois quarts, seule celle du côté de l'oreille se voit)
    if (TONDUES.has(coupe)) s += se ? P(sx(mirror(TEMPE), -0.6), c.buzz, 0.5) : P(TEMPE, c.buzz, 0.5) + P(mirror(TEMPE), c.buzz, 0.5);
    // les autres coupes d'homme : un favori court devant l'oreille, les côtés nets au-dessus d'elle
    // le pixie : une fine mèche en pointe devant l'oreille, au lieu du favori
    else if (coupe === 'pixie') { const m = 'M12.8,17 Q12,20.4 13.4,22.8 Q13.6,20.4 14.4,18.2 Z'; s += se ? P(sx(mirror(m), -0.6), H, 0.5) : P(m, H, 0.5) + P(mirror(m), H, 0.5); }
    else if (COURTES.has(coupe)) { const fav = 'M12.6,17 Q12.5,18.8 12.9,20 L13.7,20 Q13.6,18.6 14.1,16.8 Z'; s += se ? P(sx(mirror(fav), -0.6), H, 0.5) : P(fav, H, 0.5) + P(mirror(fav), H, 0.5); }
    // la frange, le sens de ses mèches (traits fins), le reflet ; les mèches de couleur suivent le même sens
    const sens = se ? sx(sensFrange(coupe), -1) : sensFrange(coupe);
    s += P(frange, H) + clip(`${c.uid}sf`, frange, P(sens, 'none', 0.5)) + L(se ? [15.6, 11.4] : [17, 11.2], se ? [22.6, 9.6] : [24, 9.6], HI, 1.3);
    if (avecMeches) s += meches(c, view, frange, sens);
    if (coupe === 'boucleeCourte' && !couvert) { const top = curls(se ? 23 : 24, 10.4, 10.2, 3.4, 10, 1.3); s += P(top, H) + L(se ? [16.2, 8.6] : [17.6, 8.4], se ? [20.6, 7.2] : [22, 7], HI, 1); }
    // mèches qui tombent le long des joues (devant les oreilles)
    const long = { longue: MECHE_LONGUE, milongue: MECHE_MILONGUE, ondulee: MECHE_ONDULEE, demiQueue: MECHE_MILONGUE }[coupe];
    if (long) s += se ? P(sx(mirror(long), -0.6), H) : P(long, H) + P(mirror(long), H);
    if (coupe === 'carre') {
      // le carré encadre le visage : une mèche de chaque côté, coupée droit à la mâchoire
      const lk = 'M14.4,15.2 Q10.4,19.6 10.7,26.4 Q10.9,29.8 13.3,30.9 Q15,31.4 15.9,30.2 Q13.8,28.8 13.8,24.6 Q13.8,20.2 16,17.6 Z';
      s += se ? P(sx(mirror(lk), -0.4), H) : P(lk, H) + P(mirror(lk), H);
    }
    if (coupe === 'queueCote') s += P(se ? sx(QUEUE_COTE, 0.4) : QUEUE_COTE, H) + P(se ? sx(QUEUE_COTE_SENS, 0.4) : QUEUE_COTE_SENS, 'none', 0.5) + E(se ? 34.6 : 34.2, 28.4, 1.6, 1.4, c.tie, 0.8);
    if (coupe === 'couronne' && !couvert) s += couronneTresse(c, view);
    if (coupe === 'tresses') s += se ? tresse([35.6, 25], [37, 32.4], [35.6, 40.2], 5, 2.8, c)
      : tresse([12, 25], [10.6, 32.4], [12.6, 40.6], 5, 2.8, c) + tresse([36, 25], [37.4, 32.4], [35.4, 40.6], 5, 2.8, c);
    if (coupe === 'couettes') s += couettes(c, view);
    if (coupe === 'puffs') s += `<path d="${se ? sx(DUVET_PUFFS, -1) : DUVET_PUFFS}" fill="none" stroke="${H}" stroke-width=".55" stroke-linecap="round"/>`;
    // tresse de côté : les cheveux rassemblés sous l'oreille, la tresse épaisse tombe devant l'épaule
    if (coupe === 'tresseCote') {
      const k = se ? 0.4 : 0;
      s += P(sx('M33.6,19.4 Q37.6,20.8 37,25.6 Q35.4,27 33.6,26 Q34.4,22.6 33.6,19.4 Z', k), H, 0.6) + tresse([35.4 + k, 25.4], [37.4 + k, 33], [32.6 + k, 41.4], 6, 3, c);
    }
    if (coupe === 'locks' || coupe === 'locksLongues') s += (coupe === 'locks' ? LOCKS : LOCKS_LONGUES)[view].map(([a, b, e, w, g]) => lock(a, b, e, w, c, g)).join('');
  }
  s += couche(c0, 'cheveux', ctx);
  // expression : sourcils de la couleur des cheveux (plus foncés), yeux de la couleur et de la forme choisies
  const brow = { fins: [1, -4.1], epais: [1.6, -4.2], doux: [0.95, -3.7] }[o.sourcils];
  // l'homme : des yeux un peu moins hauts ; jeune : un peu plus grands
  const [ex, ey0] = YEUX[o.formeYeux], ey = r2(ey0 * (o.genre === 'homme' ? 0.88 : 1) * (o.age === 'jeune' ? 1.08 : 1));
  const eyes = se ? [[17.2, 22.6, r2(1.55 * ex)], [25.2, 22.6, r2(1.35 * ex)]] : [[19.4, 22.6, r2(1.6 * ex)], [28.6, 22.6, r2(1.6 * ex)]];
  const mouth = [se ? 20.8 : 24, 27];
  s += expression({
    eyes, ry: ey, eyeColor: c.eye, restEyes: o.formeYeux === 'paisibles' ? 'sleepy' : undefined,
    brow: tone(c0.hair, 0.55), browY: brow[1] - Math.max(0, ey - 2.35) * 0.6, browW: brow[0],
    mouth, mw: 1.7, mouthC: '#7A3B30', tongue: '#E07A72',
    neutral: BOUCHE[o.bouche],
    cheeks, cheekY: 26.2, temple: [se ? 12.6 : 13.4, 12.4], anger: [40, 6.8], zz: [36.4, 7.4 - Math.min(c.dy, 0)]
  }, ctx);
  // yeux ouverts (au repos ou contents) : la paupière des yeux rieurs, le trait des yeux en amande
  const open = !ctx.blink && !ctx.eyeMode && (ctx.expr === 'content' || (ctx.expr === 'neutre' && o.formeYeux !== 'paisibles'));
  if (open && o.formeYeux === 'rieurs') {
    for (const [x, y, rx] of eyes) {
      const t = y + ey * 0.42;
      s += `<path d="M${r2(x - rx - 0.5)},${r2(t + 0.5)} Q${x},${r2(t - 0.7)} ${r2(x + rx + 0.5)},${r2(t + 0.5)} L${r2(x + rx + 0.5)},${r2(y + ey + 0.7)} L${r2(x - rx - 0.5)},${r2(y + ey + 0.7)} Z" fill="${c.skin}"/>`
        + P(`M${r2(x - rx - 0.3)},${r2(t + 0.4)} Q${x},${r2(t - 0.6)} ${r2(x + rx + 0.3)},${r2(t + 0.4)}`, 'none', 0.8);
    }
  }
  if (open && o.formeYeux === 'amande') {
    // une paupière fine au-dessus de l'œil, qui file un peu vers la tempe
    const cx = (eyes[0][0] + eyes[1][0]) / 2;
    for (const [x, y, rx] of eyes) {
      const m = cx > x ? -1 : 1; // vers l'extérieur du visage
      s += P(`M${r2(x - m * rx * 0.9)},${r2(y - ey * 0.55)} Q${r2(x - m * rx * 0.1)},${r2(y - ey * 1.45)} ${r2(x + m * (rx + 0.7))},${r2(y - ey * 0.5)}`, 'none', 0.7);
    }
  }
  s += cils(c0, eyes, ey, ctx) + levres(c0, ctx, mouth[0], mouth[1]);
  s += cicatrice(o.cicatrice, se, c0.skin); // par-dessus la frange et le sourcil
  s += couche(c0, 'visage', ctx) + couche(c0, 'tete', ctx);
  return s;
}

// Formes des yeux : largeur (facteur) et hauteur (rayon vertical)
const YEUX = { ronds: [1, 2.35], amande: [1.12, 1.95], grands: [1.16, 2.75], rieurs: [1, 2.35], paisibles: [1, 2.35] };
// Bouche au repos (l'expression « neutre ») ; les autres expressions sont celles de la troupe
const BOUCHE = {
  douce: (mx, my) => `M${r2(mx - 1.4)},${r2(my + 0.3)} Q${mx},${r2(my + 1.3)} ${r2(mx + 1.4)},${r2(my + 0.3)}`,
  sourire: (mx, my) => `M${r2(mx - 2)},${r2(my)} Q${mx},${r2(my + 1.9)} ${r2(mx + 2)},${r2(my)}`,
  malice: (mx, my) => `M${r2(mx - 1.5)},${r2(my + 0.7)} Q${r2(mx + 0.3)},${r2(my + 1.3)} ${r2(mx + 1.7)},${r2(my - 0.2)}`,
  serieuse: (mx, my) => `M${r2(mx - 1.3)},${r2(my + 0.7)} Q${mx},${r2(my + 1)} ${r2(mx + 1.3)},${r2(my + 0.7)}`
};
// Grain de beauté : sur la joue, ou au coin de la lèvre
const GRAIN = { joue: { front: [31, 27.2], se: [26.8, 27] }, levre: { front: [26.4, 28.6], se: [23, 28.6] } };

// ---- les habits ----
// Jupe (et bas de la robe) : de la taille au genou, un peu évasée ; elle suit la marche d'un rien
function skirt(c, view, sway, top, hem) {
  const { hw } = c.k;
  const a = hw + 0.2, b = hw + 2.4 + (hem - top) * 0.1;
  const d = `M${r2(24 - a)},${top} L${r2(24 + a)},${top} L${r2(24 + b + sway)},${hem} Q${r2(24 + sway)},${r2(hem + 1.8)} ${r2(24 - b + sway)},${hem} Z`;
  const shadeX = view === 'se' ? 25.4 : 27.2;
  const pleats = [-0.45, 0.1].map(t => L([24 + t * a, top + 2.4], [24 + t * b * 1.1 + sway, hem + 0.4], c.basS, 0.6)).join('');
  const mo = c.o.motifBas === 'raye' || c.o.motifBas === 'pois' ? motif(c.o.motifBas, c.bas2, c.uid, 14) : '';
  return P(d, c.bas) + clip(`${c.uid}sk`, d, mo + `<path d="M${shadeX},${top} L48,${top} L48,${hem + 3} L${r2(shadeX + 1 + sway)},${hem + 3} Z" fill="${c.basS}"/>` + pleats
    + L([24 - a + 1, top + 1], [24 - b + 1.6 + sway, hem - 0.4], c.basH, 0.9)) + P(d, 'none');
}
// Jambe de short (par-dessus la jambe nue, elle la suit) : appelée par le pied de la troupe (c.foot)
function shortLeg(c, x, frayed = false) {
  const w = c.legW + 1.8, y0 = c.hip - 0.4, y1 = c.hip + c.shortLen;
  let s = `<rect x="${r2(x - w / 2)}" y="${r2(y0)}" width="${r2(w)}" height="${r2(y1 - y0)}" rx="1.2" fill="${c.bas}" stroke="${OUT}" stroke-width="1.1"/>`
    + `<rect x="${r2(x + w / 2 - 1.9)}" y="${r2(y0 + 0.6)}" width="1.2" height="${r2(y1 - y0 - 1.2)}" rx="0.5" fill="${c.basS}"/>`;
  s += frayed
    ? P(`M${r2(x - w / 2 + 0.2)},${r2(y1 - 0.2)} L${r2(x - w / 4)},${r2(y1 + 1.2)} L${x},${r2(y1 + 0.2)} L${r2(x + w / 4)},${r2(y1 + 1.4)} L${r2(x + w / 2 - 0.2)},${r2(y1 - 0.2)}`, 'none', 0.8)
    : L([x - w / 2 + 0.7, y1 - 1.2], [x + w / 2 - 0.7, y1 - 1.2], c.basS, 0.6);
  return s;
}

// Les pièces nouvelles se dessinent comme une pièce de leur famille, puis ajoutent leurs détails (familleHaut,
// familleBas) : le polo et le débardeur comme le t-shirt, le col roulé comme le pull, le gilet comme la veste ;
// le bermuda comme le short, la jupe plissée comme la jupe, la robe longue comme la robe
const FAMILLE_HAUT = { polo: 'tshirt', debardeur: 'tshirt', colRoule: 'pull', gilet: 'veste' };
const FAMILLE_BAS = { bermuda: 'short', jupePlissee: 'jupe', robeLongue: 'robe' };
const familleHaut = h => FAMILLE_HAUT[h] || h;
const familleBas = b => FAMILLE_BAS[b] || b;
// Les motifs d'un habit, découpés dans sa forme : des rayures ou des pois de la seconde couleur
function motif(genre, col, uid, dy = 0) {
  if (genre === 'raye') return [30, 33, 36, 39, 42, 45, 48, 51, 54, 57, 60].map(y => `<rect x="0" y="${r2(y + dy)}" width="48" height="1.3" fill="${col}"/>`).join('');
  if (genre === 'pois') return Array.from({ length: 60 }, (_, i) => { const x = 6 + (i % 10) * 4 + (Math.floor(i / 10) % 2) * 2, y = 30 + dy + Math.floor(i / 10) * 4.4; return E(x, y, 0.75, 0.75, col, 0); }).join('');
  return '';
}
// Les chaussures, par forme (de la couleur choisie) : souliers, baskets, bottines, bottes, sandales, ballerines, sabots.
// Elles se posent sur le pied de la troupe (x, y : le bas de la jambe ; dir : -1 à gauche, 0 de face, 1 de dos)
function chaussure(c, forme, x, y, dir, tilt) {
  const S = c.shoeS, H = c.shoeH, toe = dir < 0 ? 1.4 : 0;
  const pivot = s => (tilt ? `<g transform="rotate(${tilt} ${r2(x - (dir < 0 ? 3 : -3))} ${r2(y + 4.5)})">${s}</g>` : s);
  const tige = h => { const w = c.legW + 0.8, d = `M${r2(x - w / 2)},${r2(y - h)} L${r2(x + w / 2)},${r2(y - h)} L${r2(x + w / 2 + 0.2)},${r2(y + 1.4)} L${r2(x - w / 2 - 0.2)},${r2(y + 1.4)} Z`;
    return P(d, c.shoe) + clip(`${c.uid}tg${Math.round(x * 10)}${Math.round(y * 10)}`, d, `<rect x="${r2(x + w / 2 - 1.6)}" y="${r2(y - h)}" width="2" height="${r2(h + 2)}" fill="${S}"/>`) + P(d, 'none')
      + `<path d="M${r2(x - w / 2 + 0.2)},${r2(y - h + 0.9)} L${r2(x + w / 2 - 0.2)},${r2(y - h + 0.9)}" stroke="${S}" stroke-width=".6"/>`; };
  if (forme === 'sandales') return pivot(bareFoot(c, x, y, 0) + `<path d="M${r2(x - 2.4)},${r2(y + 1.2)} L${r2(x + 2.4)},${r2(y + 1.2)} M${r2(x - 2)},${r2(y + 2.8)} L${r2(x + 2)},${r2(y + 2.8)}" stroke="${OUT}" stroke-width="1.5"/><path d="M${r2(x - 2.4)},${r2(y + 1.2)} L${r2(x + 2.4)},${r2(y + 1.2)} M${r2(x - 2)},${r2(y + 2.8)} L${r2(x + 2)},${r2(y + 2.8)}" stroke="${c.shoe}" stroke-width=".8"/>`
    + `<path d="M${r2(x - 3 - toe)},${r2(y + 4.5)} L${r2(x + 2.8)},${r2(y + 4.5)}" stroke="${S}" stroke-width="1.1" stroke-linecap="round"/>`);
  if (forme === 'ballerines') { const d = `M${r2(x - 2.8)},${r2(y + 1.6)} Q${x},${r2(y + 2.6)} ${r2(x + 2.8)},${r2(y + 1.6)} L${r2(x + 3)},${r2(y + 3.8)} Q${r2(x - 0.4)},${r2(y + 5.2)} ${r2(x - 3 - toe)},${r2(y + 3.9)} Z`;
    return pivot(bareFoot(c, x, y, 0).replace(/<line[^>]*>/g, '') + P(d, c.shoe) + E(x - 0.6, y + 2.4, 0.9, 0.55, H, 0.4) + P(`M${r2(x - 1.2)},${r2(y + 2)} l-.9,-.6 l0,1.2 Z M${r2(x - 1.2)},${r2(y + 2)} l.9,-.6 l0,1.2 Z`, S, 0.35)); }
  let s = shoe(c, x, y, dir, 0);
  if (forme === 'baskets') s += `<path d="M${r2(x - 3.4 - toe)},${r2(y + 4.2)} Q${r2(x - 0.4)},${r2(y + 5.6)} ${r2(x + 3.4)},${r2(y + 4)} L${r2(x + 3.4)},${r2(y + 5.6)} L${r2(x - 3.4 - toe)},${r2(y + 5.6)} Z" fill="#FFFDF6" stroke="${OUT}" stroke-width=".8"/>`
    + (dir <= 0 ? `<path d="M${r2(x - 1.4)},${r2(y + 0.8)} l2.4,.4 M${r2(x - 1.4)},${r2(y + 1.9)} l2.4,.4" stroke="#FFFDF6" stroke-width=".6"/>` : '');
  if (forme === 'sabots') s += `<path d="M${r2(x - 3.4 - toe)},${r2(y + 4)} L${r2(x + 3.4)},${r2(y + 3.8)} L${r2(x + 3.4)},${r2(y + 5.5)} L${r2(x - 3.4 - toe)},${r2(y + 5.5)} Z" fill="#B08458" stroke="${OUT}" stroke-width=".8"/>`;
  if (forme === 'bottines') s = tige(3.2) + s;
  if (forme === 'bottes') s = tige(7.4) + s;
  return pivot(s);
}
function body(c, ctx) {
  const { view, n, walk } = ctx;
  const k = c.k, bas = familleBas(c.o.bas), vrai = c.o.haut;
  // la robe d'une pièce remplace le haut : le buste est de la couleur de la robe
  const robeE = bas === 'robeEntiere', haut = robeE ? null : familleHaut(c.o.haut);
  const ne = view === 'ne', se = view === 'se';
  const tucked = bas === 'jupe' || bas === 'salopette' || bas === 'robe' || robeE;
  const hem = tucked ? 44.8 : 46.6;
  const T = torso(k, hem);
  const top = robeE ? c.bas : c.top, topS = robeE ? c.basS : c.topS, topH = robeE ? c.basH : c.topH;
  const o = se ? 21.6 : 24; // le milieu du devant
  const sway = ctx.sway || 0;
  let s = '';
  // 1. ce qui passe sous le haut : la jupe, le bas de la robe, le fond du short
  if (bas === 'jupe') s += skirt(c, view, sway, 43.6, c.skirtHem);
  if (bas === 'robe' || robeE) s += skirt(c, view, sway, 43.6, c.robeHem);
  if (bas === 'short') s += `<rect x="21.6" y="44.4" width="4.8" height="4.6" fill="${c.bas}"/>`;
  // 2. le haut
  const mar = haut === 'mariniere';
  s += P(T, mar ? c.base : top);
  let inner = mar
    ? [35.2, 38, 40.8, 43.6, 46.4].map(y => `<rect x="8" y="${y}" width="32" height="1.3" fill="${c.stripe}"/>`).join('')
      + `<rect x="${se ? 25.4 : 27.2}" y="30" width="14" height="22" fill="rgba(60,40,25,.13)"/>`
    : `<rect x="${se ? 25.4 : 27.2}" y="30" width="14" height="22" fill="${topS}"/><path d="M8,${hem - 0.6} Q24,${hem + 2.4} 40,${hem - 0.6} L40,52 L8,52 Z" fill="${topS}"/>`
      + `<rect x="${r2(24 - k.sw + 0.1)}" y="34" width="1.3" height="10" rx="0.6" fill="${topH}"/>`;
  if (haut === 'pull' || haut === 'sweat') inner += `<rect x="6" y="${hem - 2}" width="36" height="2" fill="${topS}"/>`
    + (haut === 'pull' ? [17, 20, 23, 26, 29, 32].map(x => L([x, hem - 1.8], [x, hem], tone(top, 0.7), 0.4)).join('') : '');
  // la veste ouverte laisse voir ce qu'il y a dessous : le t-shirt, ou la robe, la salopette
  const under = bas === 'robe' || bas === 'salopette' ? c.bas : c.tee;
  if (haut === 'veste' && !ne) {
    inner += `<path d="M${o - 3.4},31.6 L${o + 3.4},31.6 L${o + 3},49 L${o - 3},49 Z" fill="${under}"/>` + L([o - 3.3, 32], [o - 2.9, 48.8], OUT, 0.8) + L([o + 3.3, 32], [o + 2.9, 48.8], OUT, 0.8);
  }
  if (haut === 'sweat' && !ne) {
    const pk = `M${o - 5.2},40.6 L${o + 5.2},40.6 L${o + 6.4},${hem - 1.4} L${o - 6.4},${hem - 1.4} Z`;
    inner += P(pk, tone(top, 0.92), 0.7) + P(`M${o - 5.2},40.6 Q${o - 5.4},43 ${o - 6.4},${hem - 1.4} M${o + 5.2},40.6 Q${o + 5.4},43 ${o + 6.4},${hem - 1.4}`, 'none', 0.6);
  }
  // les motifs du haut ; le col roulé, les côtes du bas du gilet
  if (!robeE && !mar && (c.o.motifHaut === 'raye' || c.o.motifHaut === 'pois')) inner = inner.replace(/^/, motif(c.o.motifHaut, c.top2, c.uid));
  if (vrai === 'gilet') inner += `<rect x="6" y="${hem - 2}" width="36" height="2" fill="${topS}"/>` + [17, 20, 23, 26, 29, 32].map(x => L([x, hem - 1.8], [x, hem], tone(top, 0.7), 0.4)).join('');
  s += clip(`${c.uid}t`, T, inner) + P(T, 'none');
  // le plissé de la jupe plissée
  if (c.o.bas === 'jupePlissee') s += [-6, -3, 0, 3, 6].map(d => L([24 + d * 0.9, 44.6], [24 + d * 1.25 + (ctx.sway || 0), c.skirtHem - 0.2], c.basS, 0.55)).join('');
  // 3. le col et les détails du devant ; de dos, la couture et la capuche
  if (ne) {
    s += P('M24,33.8 L24,47.4', 'none', 0.5);
    if (haut === 'chemise' || haut === 'veste') s += P('M17.6,31.4 Q24,34.4 30.4,31.4 L30,33.6 Q24,36.2 18,33.6 Z', topS, 0.8);
    // la capuche du sweat, posée dans le dos (la même pour tous) ; sous un manteau, on ne la voit pas
    if (haut === 'sweat' && !c.o.accessoires.dessus) s += capucheRabattue(c.uid, view, reperes(c), top, topS);
    if (robeE) s += P('M17.6,31.4 Q24,34 30.4,31.4 L30,33.2 Q24,35.8 18,33.2 Z', '#FFFDF6', 0.8);
  } else if (robeE) {
    // col Claudine : deux pans arrondis, blancs
    s += P(`M${o - 0.3},32.6 Q${o - 4.4},30.8 ${o - 5.4},32.8 Q${o - 4.6},35.8 ${o - 0.5},34.4 Z`, '#FFFDF6', 0.8)
      + P(`M${o + 0.3},32.6 Q${o + 4.4},30.8 ${o + 5.4},32.8 Q${o + 4.6},35.8 ${o + 0.5},34.4 Z`, '#FFFDF6', 0.8);
  } else if (haut === 'chemise') {
    s += P(`M${o - 4.6},31.2 L${o},34.8 L${o - 1.6},36.4 Z`, '#FFFDF6', 0.8) + P(`M${o + 4.6},31.2 L${o},34.8 L${o + 1.6},36.4 Z`, '#FFFDF6', 0.8);
    s += L([o, 35], [o + (se ? -0.4 : 0), hem + 1], OUT, 0.6) + [38.4, 41.8, 45].filter(y => y < hem).map(y => E(o + 1, y, 0.55, 0.55, '#FFFDF6', 0.5)).join('');
  } else if (haut === 'pull') {
    s += P(`M${o - 4},31.4 Q${o},34.6 ${o + 4},31.4 L${o + 4},32.8 Q${o},36 ${o - 4},32.8 Z`, topS, 0.8);
  } else if (haut === 'veste') {
    s += P(`M${o - 3.4},31.6 L${o - 1.2},36.4 L${o - 4.6},34 Z`, topS, 0.8) + P(`M${o + 3.4},31.6 L${o + 1.2},36.4 L${o + 4.6},34 Z`, topS, 0.8);
  } else if (mar) {
    s += P(`M${o - 5.4},31.8 Q${o},33.4 ${o + 5.4},31.8`, 'none', 0.8); // encolure bateau
  } else if (vrai === 'polo') {
    // le col du polo et sa patte boutonnée
    s += P(`M${o - 4.2},31.2 L${o},33.6 L${o - 1.8},35.4 Z`, tone(top, 0.92), 0.8) + P(`M${o + 4.2},31.2 L${o},33.6 L${o + 1.8},35.4 Z`, tone(top, 0.92), 0.8)
      + L([o, 33.8], [o, 38.4], OUT, 0.55) + E(o + 0.9, 35.4, 0.5, 0.5, '#FFFDF6', 0.45) + E(o + 0.9, 37.4, 0.5, 0.5, '#FFFDF6', 0.45);
  } else if (vrai === 'debardeur') {
    // l'encolure profonde du débardeur, la peau dessous
    s += P(`M${o - 3.8},31.2 Q${o},37 ${o + 3.8},31.2 Z`, c.skin, 0.8);
  } else if (haut === 'tshirt') {
    s += P(`M${o - 3.2},31.4 Q${o},34.4 ${o + 3.2},31.4`, 'none', 0.8);
  }
  // le col roulé, par-dessus l'encolure du pull (de dos aussi)
  if (vrai === 'colRoule') s += P(`M${o - 4.2},29.4 L${o + 4.2},29.4 L${o + 4.6},33.4 Q${o},34.6 ${o - 4.6},33.4 Z`, top, 0.8) + [-2.4, -0.8, 0.8, 2.4].map(d => L([o + d, 29.8], [o + d * 1.08, 33.4], topS, 0.45)).join('');
  // les boutons du gilet, sur ses deux bords
  if (vrai === 'gilet' && !ne) s += [36.6, 39.8, 43].map(y => E(o + 3.6, y, 0.55, 0.55, topH, 0.45)).join('');
  // 4. par-dessus le haut : la salopette (bavette et bretelles), le corsage de la robe (sauf sous la veste ouverte)
  if (bas === 'salopette') {
    s += P(`M${r2(24 - k.hw + 0.2)},43.2 L${r2(24 + k.hw - 0.2)},43.2 L${r2(24 + k.hw)},46.6 Q24,48 ${r2(24 - k.hw)},46.6 Z`, c.bas)
      + P(`M${r2(24 - k.hw + 1)},43.4 L${r2(24 - k.hw + 1.4)},46.2`, 'none', 0.5);
    if (haut !== 'veste' || ne) s += bretelles(c, view, o, true);
  }
  if (robeE) {
    // la ceinture de la robe, nouée dans le dos
    const band = 'M0,42.4 L48,42.4 L48,44.4 L0,44.4 Z';
    s += clip(`${c.uid}rc`, T, P(band, c.basS, 0.6)) + P(T, 'none');
    if (ne) {
      s += P('M24,43.4 L22.6,47.6 L24.2,47 L25,47.8 Z', c.basS, 0.6) + P('M24,43.4 L25.6,47.4 L24.4,46.8 Z', c.basS, 0.6)
        + E(21.6, 42.9, 2.1, 1.25, c.basS, 0.7) + E(26.4, 42.9, 2.1, 1.25, c.basS, 0.7) + E(24, 43.3, 0.95, 0.95, c.bas, 0.6);
    }
  }
  if (bas === 'robe' && (haut !== 'veste' || ne)) {
    const d = ne ? 'M0,40.2 Q24,41.6 48,40.2 L48,50 L0,50 Z' : `M${o - 6.6},36.6 Q${o},37.8 ${o + 6.6},36.6 L${r2(o + k.hw + 1.6)},45.8 L${r2(o - k.hw - 1.6)},45.8 Z`;
    s += clip(`${c.uid}rb`, T, P(d, c.bas) + `<rect x="${se ? 25.4 : 27.2}" y="36" width="14" height="12" fill="${c.basS}" opacity="0.7"/>`) + P(T, 'none')
      + bretelles(c, view, o, false);
  }
  // 5. par-dessus tout le reste : le manteau ou le ciré
  return s + couche(c, 'dessus', ctx);
}
// Bretelles de la salopette (avec la bavette) ou de la robe ; de dos, elles se croisent
function bretelles(c, view, o, bavette) {
  const { sw } = c.k;
  if (view === 'ne') {
    return limb([24 - sw + 2, 32.4], [27.4, bavette ? 43.4 : 40.6], 1.6, c.bas) + limb([24 + sw - 2, 32.4], [20.6, bavette ? 43.4 : 40.6], 1.6, c.bas);
  }
  let s = '';
  if (bavette) {
    const bib = `M${o - 5},37.2 L${o + 5},37.2 L${o + 5.4},44 L${o - 5.4},44 Z`;
    s += P(bib, c.bas) + clip(`${c.uid}bv`, bib, `<rect x="${o + 2.4}" y="36" width="5" height="9" fill="${c.basS}"/>`) + P(bib, 'none')
      + P(`M${o - 2.4},39.2 L${o + 2.4},39.2 L${o + 2.2},42 L${o - 2.2},42 Z`, 'none', 0.6);
  }
  const y0 = bavette ? 37.8 : 37.2, x0 = bavette ? 4.2 : 5.4;
  s += limb([o - x0, y0], [24 - sw + 1.8, 32.2], 1.6, c.bas) + limb([o + x0, y0], [24 + sw - 1.8, 32.2], 1.6, c.bas);
  if (bavette) s += E(o - x0, y0 + 0.2, 0.8, 0.8, '#E8C46A', 0.6) + E(o + x0, y0 + 0.2, 0.8, 0.8, '#E8C46A', 0.6);
  return s;
}

function neck(c, ctx) {
  const { view } = ctx;
  const o = view === 'se' ? 21.6 : 24;
  let s = '';
  // la capuche du sweat, roulée autour du cou, et ses deux cordons (rentrés sous la robe ou la bavette ; sous un manteau,
  // on ne la voit pas)
  if (c.o.haut === 'sweat' && c.o.bas !== 'robeEntiere' && view !== 'ne' && !c.o.accessoires.dessus) {
    const dessous = familleBas(c.o.bas) === 'robe' || c.o.bas === 'salopette';
    s += P(`M${o - 6.4},31 Q${o},35.6 ${o + 6.4},31 L${o + 8.2},32.6 Q${o},39 ${o - 8.2},32.6 Z`, c.topS, 0.9);
    if (!dessous) s += [-1.8, 1.8].map(d => L([o + d, 35.2], [o + d * 1.2, 40], OUT, 1.5) + L([o + d, 35.2], [o + d * 1.2, 40], c.tee, 0.6) + E(o + d * 1.2, 40.3, 0.6, 0.6, c.tee, 0.5)).join('');
  }
  // les accessoires du cou, et ce que les accessoires du dos posent sur le buste (bretelles, cordon)
  return s + couche(c, 'cou', ctx);
}

// ---- les gestes ----
// Le Grimoire tenu ouvert contre soi (lire) : couverture brune, pages claires
function book(x, y) {
  return P(`M${x - 6},${y} L${x + 6},${y} L${x + 6},${y + 6.4} L${x - 6},${y + 6.4} Z`, '#7A4E2C', 0.9)
    + P(`M${x - 5.2},${y - 0.6} Q${x - 2.6},${y - 1.6} ${x},${y} Q${x + 2.6},${y - 1.6} ${x + 5.2},${y - 0.6} L${x + 5.2},${y + 5.4} Q${x + 2.6},${y + 4.6} ${x},${y + 5.8} Q${x - 2.6},${y + 4.6} ${x - 5.2},${y + 5.4} Z`, '#FBF4E2', 0.8)
    + L([x, y], [x, y + 5.8], OUT, 0.6) + [1.6, 2.8, 4].map(d => L([x - 4.2, y + d], [x - 1.2, y + d], '#C9B98F', 0.45) + L([x + 1.2, y + d], [x + 4.2, y + d], '#C9B98F', 0.45)).join('');
}

// Les gestes suivent la taille (dy) et la largeur des épaules (e : écart à la corpulence moyenne)
function pose({ pose, n, k }) {
  const dy = this.dy, e = this.k.sw - 8.5;
  const [shL, shR] = this.shoulders;
  if (pose === 'salut') return { open: true, right: arm(this, shR, lerp([37.4 + e * 0.64, 25.4 + dy], [38.8 + e * 0.64, 27.4 + dy], k)) };
  if (this.geste === 'grelotter') {
    // bras croisés, les mains sur les bras ; il tremble (un demi-pixel d'une image à l'autre)
    const d = n ? 0.5 : -0.5;
    const left = arm(this, shL, [27.4 + d, 38.6 + dy], [19 + d - e * 0.5, 41 + dy]);
    const right = arm(this, shR, [20.6 + d, 38.2 + dy], [29 + d + e * 0.5, 40.6 + dy]);
    return { expr: 'triste', left: '', right: '', over: left + right };
  }
  if (this.geste === 'lire') {
    const left = arm(this, shL, [19.6, 41.4 + dy], [15.6 - e * 0.5, 41.4 + dy]);
    const right = arm(this, shR, [28.4, 41.4 + dy], [32.4 + e * 0.5, 41.4 + dy]);
    return { expr: n ? 'surpris' : 'neutre', left: '', right: '', over: book(24, 37.4 + dy) + left + right };
  }
  // ramasser (trois quarts avant) : le bras de devant descend vers le sol, la main ouverte, la tête suit
  const reach = n ? [13.2, 50.4 + dy * 0.6] : [14.4, 47 + dy * 0.6];
  return { expr: 'content', left: arm(this, shL, reach, [14.2 - e * 0.6, 40.6 + dy]) };
}

// ---- l'avatar ----
// Le haut du corps (tête, buste, ce qui passe derrière) se décale avec la taille
const up = (f, dy) => (dy ? (cc, ctx, act) => { const s = f(cc, ctx, act); return s ? `<g transform="translate(0 ${dy})">${s}</g>` : ''; } : f);

function avatar(choixAvatar = {}, opts = {}) {
  const o = verifier(choixAvatar);
  const k0 = CORPS[o.silhouette], dy = TAILLE[o.taille];
  // l'homme : les épaules plus larges, les hanches plus étroites, les bras un peu plus forts
  const k = o.genre === 'homme' ? { ...k0, sw: r2(k0.sw + 0.9), hw: r2(k0.hw - 0.5), arm: r2(k0.arm + 0.25) } : k0;
  const skin = couleur('peau', o.peau);
  const hair = { mur: mix(couleur('cheveux', o.cheveux), '#CFCBC6', 0.22), age: mix(couleur('cheveux', o.cheveux), '#DAD7D2', 0.62) }[o.age] || couleur('cheveux', o.cheveux), meche = couleur('cheveux', o.couleurMeches);
  const top = couleur('tissus', o.couleurHaut);
  const bas = couleur('tissus', o.couleurBas);
  const shoeC = couleur('tissus', o.chaussures);
  // jambes nues sous le short, la jupe et la robe
  const fb = familleBas(o.bas);
  const nues = fb === 'short' || fb === 'jupe' || fb === 'robe' || o.bas === 'robeEntiere';
  const sp = (k.hw - 10.2) * 0.45;
  const legLen = 56.5 - (44.5 + dy);
  // marinière : rayures de la couleur choisie sur fond écru ; des rayures claires se posent sur un fond marine
  // la robe d'une pièce remplace le haut : manches courtes de la couleur de la robe, bordées de blanc
  const robe = o.bas === 'robeEntiere';
  const mar = !robe && o.haut === 'mariniere';
  const claires = clarte(top) > 0.8;
  const base = mar ? (claires ? '#2E3E66' : '#F4EEDF') : top;
  // l'élastique des cheveux : rouge, ou bleu sur des cheveux déjà rouges ou roses
  const [hh, hs] = hsl(hair);
  const acc = Object.fromEntries(Object.entries(o.accessoires).map(([place, a]) => [place, couleursAccessoire(a)]));
  const c = {
    name: 'Avatar', uid: opts.uid || 'av', o, k, dy, geste: opts.geste, acc,
    couvert: !!(o.accessoires.tete && COUVRE_HAUT.has(o.accessoires.tete.id)),
    // des oreilles de chat ou de lapin prennent la place des deux chignons
    oreillesPortees: !!(o.accessoires.tete && /^oreilles/.test(o.accessoires.tete.id)),
    skin, skinS: tone(skin, 0.88), mole: tone(skin, 0.5),
    hair, cheveux: hair, hairS: tone(hair, 0.74), hairH: tone(hair, 1.32), buzz: mix(hair, skin, 0.38), buzzS: tone(mix(hair, skin, 0.38), 0.78),
    meche, mecheS: tone(meche, 0.74), tie: hs > 0.35 && (hh < 25 || hh > 320) ? '#3E5A8C' : '#C8463A',
    eye: couleur('yeux', o.yeux), cheek: o.joues === 'roses' ? '#F29E9A' : tone('#F29E9A', 1.18), freckle: tone(skin, 0.7),
    levres: o.levres === 'naturelles' ? null : couleur('levres', o.levres),
    top, topS: tone(top, 0.82), topH: tone(top, 1.28), tee: '#F4EEDF', base, stripe: top,
    bas, basS: tone(bas, 0.78), basH: tone(bas, 1.25),
    sleeve: robe ? bas : base, armW: k.arm,
    cuff: robe ? '#FFFDF6' : { pull: tone(top, 0.82), sweat: tone(top, 0.82), veste: tone(top, 0.82), chemise: '#FFFDF6', mariniere: top, colRoule: tone(top, 0.82), gilet: tone(top, 0.82), polo: tone(top, 0.92) }[o.haut] || null,
    sleeves: robe || o.haut === 'tshirt' || o.haut === 'polo' || mar ? 'court' : undefined,
    top2: couleur('tissus', o.couleurHaut2), bas2: couleur('tissus', o.couleurBas2),
    leg: nues ? skin : bas, legS: nues ? tone(skin, 0.88) : tone(bas, 0.78), legW: nues ? k.legW - 0.9 : k.legW,
    hip: r2(44.5 + dy), ground: 56.5,
    skirtHem: r2(44.5 + legLen * 0.6), robeHem: r2(44.5 + legLen * (o.bas === 'robeLongue' ? 0.9 : 0.66)), shortLen: r2(legLen * (o.bas === 'bermuda' ? 0.84 : 0.64)), coatHem: r2(44.5 + legLen * 0.45),
    shoe: shoeC, shoeS: tone(shoeC, 0.72), shoeH: tone(shoeC, 1.25),
    legX: { front: [20.5 - sp, 27.5 + sp], se: [20 - sp, 27.6 + sp], ne: [21 - sp, 28 + sp] },
    shoulders: [[24 - (k.sw - 0.5), 34 + dy], [24 + (k.sw - 0.5), 34 + dy]],
    hands: [[24 - (k.hw - 0.4 + k.b * 0.6), 45.2 + dy], [24 + (k.hw - 0.4 + k.b * 0.6), 45.2 + dy]],
    backItems: up((cc, ctx) => (ctx.view === 'ne' ? nuque(cc) : '') + (ctx.sway ? `<g transform="translate(${r2(-ctx.sway * 1.6)} 0)">${hairBehindBody(cc, ctx.view)}</g>` : hairBehindBody(cc, ctx.view)) + couche(cc, 'derriere', ctx), dy),
    overArms: up((cc, ctx) => couche(cc, 'surBras', ctx), dy),
    body: up(body, dy), neck: up(neck, dy), head: up(head, dy), pose
  };
  // les habits en dégradé : le haut du col à la taille, le bas de la taille aux chevilles (lumiere, troupe.js)
  c.degrades = {};
  if (o.motifHaut === 'degrade' && top !== bas) c.degrades[top.toUpperCase()] = [couleur('tissus', o.couleurHaut2), r2(31 + dy), r2(47 + dy)];
  if (o.motifBas === 'degrade' && !c.degrades[bas.toUpperCase()]) c.degrades[bas.toUpperCase()] = [couleur('tissus', o.couleurBas2), r2(44 + dy), 60];
  // le débardeur laisse les bras nus
  if (o.haut === 'debardeur' && !robe) Object.assign(c, { sleeve: skin, cuff: null, sleeves: undefined });
  // la forme des chaussures (les souliers sont le pied de la troupe)
  if (o.formeChaussures && o.formeChaussures !== 'souliers') c.foot = (cc, x, y, dir, tilt) => (fb === 'short' ? shortLeg(cc, x) : '') + chaussure(cc, o.formeChaussures, x, y, dir, tilt);
  else if (fb === 'short') c.foot = (cc, x, y, dir, tilt) => shortLeg(cc, x) + shoe(cc, x, y, dir, tilt);
  // les tenues de saison : les manches du manteau ou du ciré, puis les moufles (leur revers passe sur la manche) ;
  // les bottes à la place des chaussures, sur le bas de la jambe (sous le short)
  for (const place of ['dessus', 'mains']) { const a = o.accessoires[place]; if (a && PORTE[a.id]) Object.assign(c, PORTE[a.id](acc[place], c)); }
  if (o.accessoires.pieds) c.foot = (cc, x, y, dir, tilt) => (fb === 'short' ? shortLeg(cc, x) : '') + couche(cc, 'pieds', {}, [x, y, dir, tilt]);
  // ce qu'on tient à la main (la main est déjà à sa place : pas de décalage de taille)
  if (o.accessoires.main) { c.hold = (cc, hand, ctx) => couche(cc, 'main', ctx, hand); c.hold.derriereDeDos = true; }
  return c;
}

module.exports = { avatar, shortLeg, familleHaut, familleBas, ...choix };
