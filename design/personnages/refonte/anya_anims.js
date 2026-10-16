// Anya : toutes ses animations, dans toutes les directions (choix de l'auteur, 16 oct. : celles de la Révélation, puis
// souffler, apparaître et disparaître). dessiner(c, anim, direction, n) rend l'image n d'une animation, prête à poser
// dans son cadre 80 × 128 (c : anya_tenues.js, habiller). Les directions comme pour toute la troupe refondue : celles de
// gauche partent de la vue de droite, puis l'image est retournée (c.miroir : l'oiseau des bois change de côté avant).
// Le manteau suit la saison de c dans toutes ses animations.
const { E, P, r2, OUT } = require('../troupe');
const { anya, fleur, luciole, etoile, lueur } = require('./anya_refonte');

const DIRECTIONS = {
  face: { nom: 'De face', vue: 'front', miroir: false },
  bas_gauche: { nom: 'Vers le bas, à gauche', vue: 'se', miroir: false },
  bas_droite: { nom: 'Vers le bas, à droite', vue: 'se', miroir: true },
  haut_droite: { nom: 'Vers le haut, à droite', vue: 'ne', miroir: false },
  haut_gauche: { nom: 'Vers le haut, à gauche', vue: 'ne', miroir: true }
};
const MOUVANTES = ['bas_gauche', 'bas_droite', 'haut_droite', 'haut_gauche'];
const TOUTES = ['face', ...MOUVANTES];
const DEVANT = ['face', 'bas_gauche', 'bas_droite'];

const lerp = (a, b, k) => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
// le décalage des épaules de trois quarts (anya_refonte.js : kb)
const kbOf = vue => (vue === 'se' ? -0.8 : 0);
// vers l'avant, selon la vue : de trois quarts avant elle va vers la gauche de l'écran, de dos vers la droite
const avant = vue => (vue === 'se' ? -1 : vue === 'ne' ? 1 : 0);
// les mains au repos (anya_refonte.js : repos)
const REPOS = { g: [26.4, 79.4], d: [53.6, 79.4] };
// une image d'Anya : la saison de c, les réglages de l'image (l'état est celui de l'animation : etat, ci-dessous)
const image = (c, v, n, o = {}) => anya(c, v, { n, lev: 2, ...o });

// un pétale qui tombe ou monte en tournant
const petale = (x, y, rot, col) => `<g transform="translate(${r2(x)} ${r2(y)}) rotate(${r2(rot)})">${P('M0,-1.4 Q1.2,0 0,1.4 Q-1.2,0 0,-1.4 Z', col, 0.4)}</g>`;
// le petit oiseau bleu de ses bois (celui de la couronne), en vol ; sx : son sens
const oiseau = (x, y, sx, aile) => `<g transform="translate(${r2(x)} ${r2(y)}) scale(${sx} 1)">`
  + P(`M-0.6,-0.4 Q-2.6,${r2(-2.6 * aile)} -4.2,${r2(-1.4 * aile)} Q-2.4,-0.2 -0.6,0.4 Z`, '#4E78B4', 0.5)
  + E(0, 0, 2.2, 1.7, '#7FA9E0', 0.6) + E(0.5, 0.6, 1.1, 0.8, '#FFFFFF', 0) + E(1, -0.6, 0.32, 0.32, OUT, 0) + P('M2,-0.4 L3.3,-0.1 L2,0.3 Z', '#E8C27A', 0.35) + '</g>';
// une pousse qui sort de ses mains : la tige, deux feuilles, le bouton qui s'ouvre (k : 0 → 1)
const pousse = (x, y, k) => `<path d="M${r2(x)},${r2(y)} Q${r2(x - 0.6)},${r2(y - 3 * k)} ${r2(x)},${r2(y - 5.6 * k)}" fill="none" stroke="${OUT}" stroke-width="1.6" stroke-linecap="round"/><path d="M${r2(x)},${r2(y)} Q${r2(x - 0.6)},${r2(y - 3 * k)} ${r2(x)},${r2(y - 5.6 * k)}" fill="none" stroke="#6E9A6A" stroke-width="0.7" stroke-linecap="round"/>`
  + P(`M${r2(x)},${r2(y - 2.4 * k)} Q${r2(x - 2.6 * k)},${r2(y - 3.6 * k)} ${r2(x - 3 * k)},${r2(y - 2 * k)} Q${r2(x - 1.4 * k)},${r2(y - 1.4 * k)} ${r2(x)},${r2(y - 2.4 * k)} Z`, '#8CC48A', 0.45)
  + P(`M${r2(x)},${r2(y - 3.4 * k)} Q${r2(x + 2.6 * k)},${r2(y - 4.6 * k)} ${r2(x + 3 * k)},${r2(y - 3 * k)} Q${r2(x + 1.4 * k)},${r2(y - 2.4 * k)} ${r2(x)},${r2(y - 3.4 * k)} Z`, '#8CC48A', 0.45)
  + (k > 0.6 ? fleur(x, y - 6.2 * k, 0.6 + 0.8 * (k - 0.6) / 0.4, '#FFFFFF', '#FFE7A3') : '');
// une boule de lumière qui grandit (r), son halo
const lumiere = (x, y, r) => `<circle cx="${r2(x)}" cy="${r2(y)}" r="${r2(r * 2.2)}" fill="rgb(220,238,255)" opacity=".32"/><circle cx="${r2(x)}" cy="${r2(y)}" r="${r2(r)}" fill="#F4FAFF" opacity=".95"/>`
  + etoile(x, y, r * 1.5, '#FFFFFF');
// l'onde de lumière de l'éveil : un anneau qui s'élargit (k : 0 → 1), dans le cadre
const onde = (k, y = 66) => `<circle cx="40" cy="${y}" r="${r2(8 + k * 28)}" fill="none" stroke="#DCEEFF" stroke-width="${r2(3 * (1 - k) + 0.6)}" opacity="${r2(0.85 * (1 - k))}"/>`;
// les fleurs qui éclosent au sol (k : leur ouverture), à des places fixes
const fleursSol = (places, k) => places.map(([x, y, r], i) => (k[i] > 0.05 ? fleur(x, y, r * (0.5 + 0.5 * k[i]), i % 2 ? '#FFFFFF' : '#CFE3FF', '#FFE7A3') : '')).join('');

// Les animations : leurs images, la durée d'une image (s), les directions où elles se jouent, l'état où elles se jouent
// (endormie sous le Voile : voile, et l'éveil qui en sort ; éveillée : toutes les autres), le contexte en jeu
const ANIMS = {
  voile: {
    nom: 'Endormie sous le Voile', images: 2, dt: 1.4, dirs: TOUTES, etat: 'voilee',
    contexte: 'Avant la Révélation : au centre du Cercle, la statue grise, la mousse et le lierre, ses fleurs fermées. Le Voile respire.',
    // (la statue ne bouge pas : seules des poussières grises dérivent autour d'elle)
    img: (c, v, n) => image(c, v, n, { pierre: 1, lierre: 1, lev: 0, eclos: 0, glow: 0 })
      + [[18, 70], [62, 58], [30, 40], [54, 96]].map(([x, y], i) => E(x + (n ? 1.2 : -0.6) * (i % 2 ? 1 : -1), y - n * 2.4, 0.7, 0.7, '#B9BEC8', 0).replace('/>', ' opacity=".6"/>')).join('')
  },
  eveil: {
    nom: 'L\'éveil', images: 8, dt: 0.32, dirs: DEVANT, etat: 'voilee',
    contexte: 'La Révélation : le centre du Cercle fleurit, la couleur revient, les fleurs du lierre s\'ouvrent ; une onde de lumière, et Anya se lève.',
    img: (c, v, n) => {
      const pierre = [1, 1, 0.85, 0.6, 0.35, 0.1, 0, 0][n], eclos = [0, 0.2, 0.45, 0.7, 0.9, 1, 1, 1][n];
      const lierre = [1, 1, 1, 1, 0.85, 0.6, 0.3, 0][n], lev = [0, 0, 0.2, 0.6, 1.2, 1.8, 2.2, 2][n];
      const glow = [0, 0, 0.2, 0.5, 0.9, 1.4, 1.2, 1][n];
      const expr = n < 5 ? 'recueillie' : n === 5 ? 'veille' : 'bienveillante';
      const kb = kbOf(v), ouvre = [0, 0, 0, 0, 0, 0.6, 1, 0.3][n];
      const bras = ouvre ? { g: [lerp([REPOS.g[0] + kb, REPOS.g[1]], [17 + kb, 68], ouvre), -1, ouvre > 0.5 ? 'paume' : 'repos'], d: [lerp([REPOS.d[0] + kb, REPOS.d[1]], [63 + kb, 68], ouvre), 1, ouvre > 0.5 ? 'paume' : 'repos'] } : undefined;
      // le Cercle fleurit sous elle, l'onde de lumière quand la couleur revient, des pétales qui tombent
      const fleurs = fleursSol([[24, 123.4, 1.4], [32, 124.8, 1.2], [48, 124.8, 1.2], [56, 123.4, 1.4], [40, 125.2, 1.5], [17, 122, 1.1], [63, 122, 1.1]], [0, 1, 2, 3, 4, 5, 6].map(i => Math.max(0, Math.min(1, (n - 1 - i * 0.5) / 2))));
      const s = image(c, v, n, { pierre, lierre, lev, eclos, glow, expr, bras, fleurs });
      const pet = n >= 4 ? [[22, 20], [58, 30], [34, 8], [66, 50], [14, 44]].map(([x, y], i) => petale(x + (n - 4) * 1.6 * (i % 2 ? 1 : -1), y + (n - 4) * 9, (n * 40 + i * 70) % 360, i % 2 ? '#FFFFFF' : '#F7D6E6')).join('') : '';
      return s + (n === 5 ? onde(0.35) : n === 6 ? onde(0.8) : '') + pet;
    }
  },
  repos: {
    nom: 'Repos', images: 4, dt: 0.6, dirs: TOUTES, contexte: 'Elle flotte au-dessus du sol, sereine ; sa chevelure, son manteau et ses lucioles bougent sans cesse.',
    img: (c, v, n) => image(c, v, n, { lev: [2, 2.5, 2.8, 2.5][n], blink: n === 3 })
  },
  flotter: {
    nom: 'Se déplacer, en flottant', images: 8, dt: 0.16, dirs: MOUVANTES,
    contexte: 'Elle glisse au-dessus du sol, penchée vers où elle va ; sa chevelure et son manteau traînent derrière elle, des fleurs s\'ouvrent sur son chemin.',
    img: (c, v, n) => {
      const t = n / 8, k = avant(v), arr = -k;
      const lev = 2.2 + 0.5 * Math.sin(t * Math.PI * 2);
      // (les fleurs qui s'ouvrent derrière elle, là où elle vient de passer : elles naissent et s'effacent)
      const fleurs = [0, 1, 2].map(i => {
        const age = ((n + i * 8 / 3) % 8) / 8, x = 40 + arr * (6 + age * 22);
        return age < 0.9 ? fleur(x, 123.6 + i % 2 * 1.2, 0.6 + Math.min(1, age * 3) * 0.8, i % 2 ? '#FFFFFF' : '#CFE3FF', '#FFE7A3') : '';
      }).join('');
      return image(c, v, n, { lev, sw: r2(arr * (0.9 + 0.2 * Math.sin(t * Math.PI * 4))), lean: k * 3, fleurs });
    }
  },
  benediction: {
    nom: 'La bénédiction', images: 4, dt: 0.36, dirs: DEVANT,
    contexte: 'Elle lève la main : une lumière, des pétales qui montent. Sa Bénédiction sur l\'île (HISTOIRE.md § 6.14).',
    img: (c, v, n) => {
      const k = [0.35, 1, 1, 0.5][n], kb = kbOf(v);
      const h = lerp([REPOS.g[0] + kb, REPOS.g[1]], [15 + kb, 56], k);
      const over = k > 0.6 ? lumiere(h[0], h[1] - 4.6, 1 + n * 0.3) + [[-2.6, -9], [2.2, -11], [0, -14]].map(([dx, dy], i) => petale(h[0] + dx + (n - 1) * (i - 1), h[1] + dy - (n - 1) * 3, n * 50 + i * 90, i % 2 ? '#FFFFFF' : '#F7D6E6')).join('') + luciole(h[0] + 4, h[1] - 8 - n, 0.8) : '';
      return image(c, v, n, { lev: 2.4, expr: 'bienveillante', bras: { g: [h, -1, k > 0.6 ? 'paume' : 'repos'] }, over });
    }
  },
  creer: {
    nom: 'Créer', images: 4, dt: 0.5, dirs: DEVANT,
    contexte: 'Elle crée : ses mains en coupe, une lumière y naît, une pousse y fleurit, puis un petit oiseau bleu s\'envole. Ses créatures n\'existent qu\'avec elle.',
    img: (c, v, n) => {
      const kb = kbOf(v), mx = 40 + kb, k = 1;
      const g = lerp([REPOS.g[0] + kb, REPOS.g[1]], [36.8 + kb, 73], k), d = lerp([REPOS.d[0] + kb, REPOS.d[1]], [43.2 + kb, 73], k);
      let over = '';
      if (n === 1) over = lumiere(mx, 70.4, 1.6);
      if (n === 2) over = lumiere(mx, 71.2, 1.1) + pousse(mx, 71.6, 1);
      if (n === 3) over = pousse(mx, 71.6, 1) + oiseau(mx + 9, 54, 1, 1) + etoile(mx + 3.4, 63, 0.8, '#FFFFFF') + etoile(mx + 6.2, 58.6, 0.6, '#FFFFFF');
      return image(c, v, n, { lev: 2.2, expr: n < 2 ? 'recueillie' : 'bienveillante', brasDevant: true, bras: { g: [g, 1, 'coupe', false], d: [d, -1, 'coupe', false] }, over });
    }
  },
  parler: {
    nom: 'Parler', images: 4, dt: 0.3, dirs: TOUTES,
    contexte: 'Elle parle, doucement ; une main ouverte accompagne ses mots (« L\'île le sent. »).',
    img: (c, v, n) => {
      const kb = kbOf(v), k = [0, 0.7, 1, 0.4][n];
      const bras = v === 'ne' ? undefined : { d: [lerp([REPOS.d[0] + kb, REPOS.d[1]], [56 + kb, 66], k), 1, k > 0.5 ? 'paume' : 'repos'] };
      return image(c, v, n, { lev: [2, 2.3, 2.5, 2.3][n], expr: n % 2 ? 'parle' : 'bienveillante', bras });
    }
  },
  souffler: {
    nom: 'Souffler', images: 4, dt: 0.4, dirs: DEVANT,
    contexte: 'Elle souffle sur le Grimoire (la Révélation), ou donne son Souffle quand on la croise : ses paumes ouvertes devant elle, elle souffle dessus, un souffle de lumière et de pétales part.',
    img: (c, v, n) => {
      const kb = kbOf(v), k = 1, a = avant(v);
      const g = lerp([REPOS.g[0] + kb, REPOS.g[1]], [37.2 + kb, 52.6], k), d = lerp([REPOS.d[0] + kb, REPOS.d[1]], [42.8 + kb, 52.6], k);
      // le souffle part devant elle : vers nous de face (il descend et s'ouvre), vers la gauche de trois quarts
      const sx = 40 + kb + a * 4, sy = 50;
      const souffle = n >= 2 ? [0, 1, 2, 3, 4].map(i => {
        const p = (i + (n - 2) * 2.5) / 7;
        const x = sx + (a ? a * p * 26 : (i - 2) * p * 9), y = sy + (a ? (i - 2) * p * 4 : p * 18);
        return i % 2 ? petale(x, y, i * 70 + n * 30, i % 4 ? '#FFFFFF' : '#F7D6E6') : etoile(x, y, 0.9 - p * 0.3, '#FFFFFF');
      }).join('') + lueur(a ? `M${r2(sx)},${sy} Q${r2(sx + a * 12)},${sy - 2} ${r2(sx + a * 24)},${sy + 1}` : `M${r2(sx)},${sy} Q${r2(sx - 3)},${sy + 8} ${r2(sx)},${sy + 16}`, '#DCEEFF', 0.5, n === 2 ? 0.9 : 0.5) : '';
      return image(c, v, n, { lev: 2.2, expr: n === 1 ? 'recueillie' : n === 2 ? 'parle' : 'bienveillante', brasDevant: true, bras: { g: [g, 1, 'coupe', false], d: [d, -1, 'coupe', false] }, over: souffle });
    }
  },
  apparaitre: {
    nom: 'Apparaître', images: 6, dt: 0.26, dirs: TOUTES,
    contexte: 'Son errance : à l\'aube ou au crépuscule, les lucioles se rassemblent et elle se forme en elles, pour un court moment.',
    img: (c, v, n) => apparition(c, v, n)
  },
  disparaitre: {
    nom: 'Disparaître', images: 6, dt: 0.26, dirs: TOUTES,
    contexte: 'Elle se défait en lucioles, qui s\'éparpillent.',
    img: (c, v, n) => apparition(c, v, 5 - n)
  }
};
// L'apparition, image k (0 : des lucioles éparses ; 5 : elle est là) : les lucioles se rassemblent vers elle, elle se
// forme (opacité), un éclat quand elle est entière
function apparition(c, v, k) {
  const vis = [0, 0.12, 0.35, 0.65, 1, 1][k];
  const flies = [...Array(12).keys()].map(i => {
    const a = i * 2.4, R = 34 * (1 - k / 5) + 6, x = 40 + Math.cos(a) * R * 0.8, y = 70 + Math.sin(a) * R * 1.3;
    return k < 5 ? luciole(x, y, 0.9) : '';
  }).join('');
  const s = vis ? `<g opacity="${vis}">${image(c, v, k, { lev: 2.4, glow: vis })}</g>` : '';
  return s + flies + (k === 4 ? onde(0.5, 64) : '');
}

// L'image n de l'animation, dans la direction voulue
function dessiner(c, anim, direction, n) {
  const A = ANIMS[anim], d = DIRECTIONS[direction];
  if (!A) throw new Error(`animation inconnue : ${anim}`);
  if (!d) throw new Error(`direction inconnue : ${direction}`);
  const cc = { ...c, miroir: d.miroir, uid: `${c.uid}${direction.slice(0, 2)}${direction.slice(-1)}${anim.slice(0, 3)}` };
  const s = A.img(cc, d.vue, n % A.images);
  return d.miroir ? `<g transform="translate(80 0) scale(-1 1)">${s}</g>` : s;
}

for (const A of Object.values(ANIMS)) A.etat = A.etat || 'eveillee';

module.exports = { ANIMS, DIRECTIONS, dessiner };
