// Lorena (anciennement Hermine ; fichiers du jeu : aster) : ses poses, des expressions du corps à la façon chibi.
// Même branchement que les gestes de l'atelier (atelier/gestes.js) : poser(c, nom) rend Lorena prête à passer à
// troupe.frame(…, vue, 'action', n) ; dessinerPose(c, nom, vue, n) y ajoute le petit bond des poses qui sautent.
// Chaque pose a ses images (POSES[nom].images), son expression (que l'appel peut remplacer), et ses vues : de face et de
// trois quarts avant ; de dos, les bras restent le long du corps (les poses se jouent face à nous).
// Les bras passent par troupe.arm, donc par les manches de Lorena (lorena_bras.js).
const { OUT, E, P, L, r2, arm, frame } = require('../troupe');
const { paume } = require('../../atelier/gestes');

// Le poing qui montre : le poing, l'index tendu vers (dx, dy), le pouce replié
function index(c, [x, y], dx, dy) {
  const f = c.hand || c.skin, len = Math.hypot(dx, dy) || 1, ux = dx / len, uy = dy / len;
  const tip = [x + ux * 3.4, y + uy * 3.4], base = [x + ux * 1.2, y + uy * 1.2];
  return `<path d="M${r2(base[0])},${r2(base[1])} L${r2(tip[0])},${r2(tip[1])}" fill="none" stroke="${OUT}" stroke-width="2.5" stroke-linecap="round"/>`
    + `<path d="M${r2(base[0])},${r2(base[1])} L${r2(tip[0])},${r2(tip[1])}" fill="none" stroke="${f}" stroke-width="1.3" stroke-linecap="round"/>`
    + E(x, y, 2, 2, f) + L([x - uy * 0.9 + ux * 0.4, y + ux * 0.9 + uy * 0.4], [x - uy * 0.2 + ux * 1.1, y + ux * 0.2 + uy * 1.1], OUT, 0.45);
}
// La main à plat, de chant, tenue en visière (k : +1, les doigts vers la gauche de l'écran ; -1, vers la droite) :
// la tranche de la main, les doigts serrés, le pouce replié dessous
function visiereMain(c, [x, y], k) {
  const f = c.hand || c.skin, x1 = x - k * 4.6;
  return P(`M${r2(x + k * 0.8)},${r2(y - 1.1)} L${r2(x1 + k * 0.6)},${r2(y - 0.9)} Q${r2(x1)},${r2(y - 0.6)} ${r2(x1 + k * 0.3)},${r2(y + 0.5)} L${r2(x + k * 0.8)},${r2(y + 1.1)} Q${r2(x + k * 1.8)},${y} ${r2(x + k * 0.8)},${r2(y - 1.1)} Z`, f, 0.9)
    + L([x - k * 1.2, y + 0.05], [x1 + k * 1, y + 0.1], OUT, 0.4) + E(x - k * 0.6, y + 1.2, 0.9, 0.6, f, 0.7);
}
// La paume tournée vers le ciel (le haussement d'épaules), vue de face : une main en coupe, le pouce vers le dehors
function paumeCiel(c, [x, y], k) {
  const f = c.hand || c.skin;
  return P(`M${r2(x - 2.2)},${r2(y - 0.6)} Q${x},${r2(y + 0.4)} ${r2(x + 2.2)},${r2(y - 0.6)} Q${r2(x + 2.1)},${r2(y + 1.9)} ${x},${r2(y + 2)} Q${r2(x - 2.1)},${r2(y + 1.9)} ${r2(x - 2.2)},${r2(y - 0.6)} Z`, f, 0.9)
    + E(x + k * 2.2, y - 0.4, 0.8, 1, f, 0.75) + L([x - 1.2, y + 0.9], [x + 1.2, y + 0.9], OUT, 0.35);
}
// Les traits de surprise, au-dessus de la tête (le « ! » du chibi, sans texte) : trois traits qui rayonnent
const eclats = (x, y, n) => [[-0.75, -0.65], [0, -1], [0.75, -0.65]].map(([a, b]) => {
  const k = n ? 1.12 : 1, p = [x + a * 1.6 * k, y + b * 1.6 * k], q = [x + a * 3.8 * k, y + b * 3.8 * k];
  return L(p, q, OUT, 1.7) + L(p, q, '#FFF6CC', 0.7);
}).join('');

// Un point que la main peut atteindre : depuis l'épaule a, dans la direction (dx, dy), à k fois la longueur du bras (le
// bras a deux os de longueur fixe, membres.js : une main ne va jamais plus loin que le bras tendu)
function atteint(c, a, dx, dy, k = 0.95) {
  const g = a[0] < 24, h = c.hands[g ? 0 : 1], e = c.shoulders[g ? 0 : 1], L = Math.hypot(h[0] - e[0], h[1] - e[1]), d = Math.hypot(dx, dy) || 1;
  return [r2(a[0] + dx / d * L * k), r2(a[1] + dy / d * L * k)];
}

// Les poses. this : Lorena ; view, n : la vue et l'image. Rendent { expr, left, right, over } comme les gestes du kit.
// (a, b : ses épaules, à gauche et à droite de l'écran)
const POSES = {
  // les poings sur les hanches, coudes sortis : fière, décidée ; l'image 2, le menton relevé d'un rien (les coudes s'ouvrent)
  poings: {
    nom: 'Poings sur les hanches', expr: 'decidee', images: 2,
    fn({ view, n }) {
      const [a, b] = this.shoulders, o = n ? 0.4 : 0;
      // (les poings posés sur le bord des hanches, là où le vêtement s'arrête sur les côtés)
      if (view === 'se') return { left: arm(this, a, [14.6, 42.8], [9.8 - o, 38.2]), right: arm(this, b, [30.4, 42.8], [34.8 + o, 38]) };
      return { left: arm(this, a, [15.2, 42.8], [10.2 - o, 38.4]), right: arm(this, b, [32.8, 42.8], [37.8 + o, 38.4]) };
    }
  },
  // les bras croisés : méfiante, ou elle boude ; l'image 2, les doigts tapotent le bras
  croises: {
    nom: 'Bras croisés', expr: 'mefiante', images: 2,
    fn({ view, n }) {
      const [a, b] = this.shoulders, t = n ? 0.5 : 0, d = view === 'se' ? -1.6 : 0;
      // le bras droit de l'écran passe dessous, le gauche par-dessus ; chaque main se cache sous le coude d'en face (les
      // mains à portée des bras, membres.js : les avant-bras se croisent au milieu de la poitrine)
      const hd = atteint(this, b, -9.8 + d, 4.4, 0.97), hg = atteint(this, a, 9.8 + d, 4.6 - t, 0.97);
      const dessous = arm(this, b, hd, [b[0] + 1.4 + d * 0.6, b[1] + 6.8], '');
      const dessus = arm(this, a, hg, [a[0] - 1.4 + d, a[1] + 6.8], E(hg[0], hg[1], 1.9, 1.9, this.hand || this.skin));
      return { left: '', right: dessous, over: dessus };
    }
  },
  // la main en visière, elle scrute le large ; l'autre poing sur la hanche ; l'image 2, la main glisse d'un cran
  visiere: {
    nom: 'Main en visière', expr: 'veille', images: 2,
    fn({ view, n }) {
      const [a, b] = this.shoulders, s = n ? 0.5 : 0;
      // (un bras de chibi n'atteint pas le front : la main monte au bord du visage, à hauteur des yeux, le coude haut et en
      // dehors, et la main à plat se lève en biais vers le sourcil : elle fait de l'ombre aux yeux)
      // de trois quarts, c'est le bras proche qui monte, l'autre poing sur la hanche
      if (view === 'se') {
        const h = atteint(this, a, -2.4 + s, -10.4, 0.97);
        return { left: '', right: arm(this, b, [30.4, 42.8], [34.8, 38]), over: arm(this, a, h, [a[0] - 4.6, a[1] - 3.4], `<g transform="rotate(-32 ${h[0]} ${h[1]})">${visiereMain(this, h, -1)}</g>`) };
      }
      const h = atteint(this, b, 3 - s, -10.4, 0.97);
      return { left: arm(this, a, [15.2, 42.8], [10.2, 38.4]), right: '', over: arm(this, b, h, [b[0] + 4.6, b[1] - 3.4], `<g transform="rotate(32 ${h[0]} ${h[1]})">${visiereMain(this, h, 1)}</g>`) };
    }
  },
  // elle montre du doigt, l'ordre lancé : « Là ! » ; l'image 2, le bras se tend un peu plus
  pointe: {
    nom: 'Montre du doigt', expr: 'cri', images: 2,
    fn({ view, n }) {
      const [a, b] = this.shoulders, k = n ? 0.8 : 0;
      if (view === 'se') {
        const h = [8.4 - k, 30.4];
        return { left: arm(this, a, h, [12.6, 35.2], index(this, h, -1, -0.35)), right: arm(this, b, [27.6, 42.6], [32.6, 39]) };
      }
      const h = [39.4 + k, 30.2];
      return { left: arm(this, a, [17.6, 42.4], [11.2, 39.4]), right: arm(this, b, h, [35.6, 35.6], index(this, h, 1, -0.4)) };
    }
  },
  // le sursaut : les bras s'écartent, les mains ouvertes, un petit bond ; les traits de surprise au-dessus de la tête
  sursaut: {
    nom: 'Sursaut', expr: 'surprise', images: 2, bond: [0, -0.9],
    fn({ view, n }) {
      const [a, b] = this.shoulders, u = n ? 1 : 0, d = view === 'se' ? -1.2 : 0;
      const l = [9.6 + d, 30.4 - u], r = [38.4 + d, 30.4 - u];
      return {
        left: arm(this, a, l, [11.8 + d, 36.4], paume(this, [l[0], l[1] - 0.4], 1)),
        right: arm(this, b, r, [36.2 + d, 36.4], paume(this, [r[0], r[1] - 0.4], -1)),
        over: eclats(39.4, 9.4, n)
      };
    }
  },
  // les mains sur la tête : la panique, le désespoir ; l'image 2, les mains serrent un peu plus
  tete: {
    nom: 'Mains aux tempes', expr: 'peur', images: 2,
    fn({ view, n }) {
      // (les mains plaquées de chaque côté de la tête, les coudes levés en dehors : un bras de chibi n'atteint pas le
      // sommet ; l'image 2, les mains serrent un peu plus)
      const [a, b] = this.shoulders, s = n ? 0.4 : 0, d = view === 'se' ? -1 : 0;
      const l = atteint(this, a, -3.2 + s + d, -9.6, 0.96), r = atteint(this, b, 3.2 - s + d, -9.6, 0.96);
      return {
        left: '', right: '',
        over: arm(this, a, l, [a[0] - 6, a[1] - 3], paume(this, l, 1, 1.05)) + arm(this, b, r, [b[0] + 6, b[1] - 3], paume(this, r, -1, 1.05))
      };
    }
  },
  // elle grelotte : les bras serrés croisés devant elle, les mains se frottent ; quatre images, les mains vont et viennent
  frisson: {
    nom: 'Grelotte', expr: 'froid', images: 4,
    fn({ view, n }) {
      // (les bras serrés et croisés devant le ventre, les mains se rejoignent au milieu et frottent : un bras de chibi ne
      // va pas jusqu'à l'épaule d'en face)
      const [a, b] = this.shoulders, f = [0, 0.6, 0, -0.6][n % 4], d = view === 'se' ? -1.4 : 0;
      const hd = atteint(this, b, -9.4 + d, 4.6 + f, 0.95), hg = atteint(this, a, 9.4 + d, 4.4 - f, 0.95);
      const dessous = arm(this, b, hd, [b[0] - 1.2, b[1] + 8.4], E(hd[0], hd[1], 1.9, 1.9, this.hand || this.skin));
      const dessus = arm(this, a, hg, [a[0] + 1.2, a[1] + 8.4], E(hg[0], hg[1], 1.9, 1.9, this.hand || this.skin));
      return { left: '', right: dessous, over: dessus };
    }
  },
  // la joie : les deux bras au ciel, poings fermés, elle saute ; quatre images (prend son élan, saute, en l'air, retombe)
  joie: {
    nom: 'Joie', expr: 'rire', images: 4, bond: n => [0, [0, -0.6, -1.1, -0.4][n % 4]],
    fn({ view, n }) {
      const [a, b] = this.shoulders, u = [0, 1, 1.6, 0.8][n % 4], d = view === 'se' ? -1.2 : 0;
      // (les bras levés en V de chaque côté de la tête, les poings à hauteur des oreilles, comme un « banzaï » de chibi :
      // le bras tendu n'atteint pas plus haut ; il se lève un peu plus à chaque image)
      return {
        left: arm(this, a, atteint(this, a, -4.6 + d * 0.5 - u * 0.4, -10, 0.92 + u * 0.05)),
        right: arm(this, b, atteint(this, b, 4.6 + d * 0.5 + u * 0.4, -10, 0.92 + u * 0.05))
      };
    }
  },
  // le haussement d'épaules : les paumes ouvertes vers le ciel, « que veux-tu » ; l'image 2, les mains montent
  hausse: {
    nom: 'Haussement d\'épaules', expr: 'ironique', images: 2,
    fn({ view, n }) {
      const [a, b] = this.shoulders, u = n ? 0.8 : 0, d = view === 'se' ? -1 : 0;
      const l = [10.2 + d, 38.8 - u], r = [37.8 + d, 38.8 - u];
      return {
        left: arm(this, a, l, [13.4 + d, 41.6], paumeCiel(this, l, -1)),
        right: arm(this, b, r, [34.6 + d, 41.6], paumeCiel(this, r, 1))
      };
    }
  }
};

// Lorena dans une pose : à passer à troupe.frame(…, vue, 'action', n). De dos, les bras restent le long du corps.
function poser(c, nom) {
  const p = POSES[nom];
  if (!p) throw new Error(`pose inconnue : ${nom}`);
  return {
    ...c, uid: `${c.uid}${nom.slice(0, 3)}`, geste: nom,
    pose(ctx) {
      if (ctx.view === 'ne') return { expr: p.expr };
      return { expr: p.expr, ...p.fn.call(this, ctx) };
    }
  };
}
// La pose dessinée, bond compris (le corps entier, jambes comprises, monte d'un rien ; tout reste dans le cadre)
function dessinerPose(c, nom, view, n, expr) {
  const p = POSES[nom], s = frame(poser(c, nom), view, 'action', n, expr);
  const bond = typeof p.bond === 'function' ? p.bond(n) : p.bond && n % 2 ? p.bond : null;
  return bond && (bond[0] || bond[1]) ? `<g transform="translate(${bond[0]} ${bond[1]})">${s}</g>` : s;
}

module.exports = { POSES, poser, dessinerPose, index };
