// Nathan (anciennement Rivet, Jovin dans HISTOIRE.md ; fichiers du jeu : rivet) : toutes ses animations en jeu, dans
// toutes les directions. dessiner(c, anim, direction, n, expr) rend l'image n d'une animation, prête à poser dans le cadre
// 48 × 64 (le sommeil couché : son propre cadre, CADRE_COUCHE de gestes.js). Les directions comme pour Lorena et Agathe :
// celles de gauche partent de la vue de droite, ses marques passées de l'autre côté (c.miroir), puis l'image est
// retournée ; l'épi et la mèche grise, la brûlure de l'avant-bras, la loupe fêlée et la clé de Tic-Tac restent à sa
// gauche, le cambouis sur sa joue gauche.
const { frame, IMAGES, E, arm, r2 } = require('../troupe');
const G = require('../../atelier/gestes');
const D = require('../../atelier/dormeurs');
const { marcher } = require('./membres');
const { POSES, dessinerPose } = require('./lorena_poses');
const { avec } = require('./nathan_gestes');

// Les directions : la vue du kit, et si l'image est retournée
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

// La poussière soulevée par les pieds : trois petits nuages clairs, cernés de brun
const poussiere = (x, y, k = 1) => [[0, 0, 1.3], [-1.6 * k, 0.5, 0.9], [1.5 * k, 0.4, 0.8]].map(([dx, dy, r]) => E(x + dx, y + dy, r * 1.3, r, '#EFE4CC', 0.5)).join('');
// pencher tout le corps autour de la taille (degrés ; + : le haut vers la droite de l'écran)
const pencher = (deg, s) => (deg ? `<g transform="rotate(${deg} 24 44)">${s}</g>` : s);
// vers l'avant, selon la vue : de trois quarts avant elle va vers la gauche de l'écran, de dos vers la droite
const avant = vue => (vue === 'se' ? -1 : vue === 'ne' ? 1 : 0);

// Les bras tendus pour freiner (l'arrêt) : un peu devant soi, à hauteur de taille
function freiner({ view }) {
  const [a, b] = this.shoulders, k = avant(view);
  return { expr: 'surprise', left: arm(this, a, [a[0] + k * 3 - 2.4, a[1] + 6.4], [a[0] - 2.2, a[1] + 4.2]), right: arm(this, b, [b[0] + k * 3 + 2.4, b[1] + 6.4], [b[0] + 2.2, b[1] + 4.2]) };
}
// un geste de son métier (nathan_gestes.js), quatre images
const metier = (nom, e) => (c, v, n, x) => frame(avec(c, nom), v, 'action', n, x || e);

// Les animations : leurs images, la durée d'une image (s), les directions où elles se jouent, le contexte en jeu
const ANIMS = {
  repos: { nom: 'Repos', images: IMAGES.repos, dt: 0.55, dirs: TOUTES, contexte: 'Il attend, ailleurs : il pense déjà à autre chose.', img: (c, v, n, e) => frame(c, v, 'repos', n, e) },
  marche: { nom: 'Marche', images: IMAGES.marche, dt: 0.1, dirs: MOUVANTES, contexte: 'Il va de l\'établi au camp, le nez en l\'air.', img: (c, v, n, e) => marcher(c, v, n, e) },
  course: {
    nom: 'Course', images: IMAGES.marche, dt: 0.065, dirs: MOUVANTES, contexte: 'L\'urgence : une clôture qui cède, la brume, Tic-Tac qui file.',
    // la marche, pliée et pressée : bras qui pompent, le buste penché en avant, le corps qui rebondit, la poussière au
    // contact du pied
    img: (c, v, n, e) => {
      const s = marcher({ ...c, course: true }, v, n, e || 'inquiete');
      // (penché, le haut de l'épi monte : tout le corps descend d'autant, pour que l'épi reste dans le cadre)
      const up = [0, -0.3, -0.5, -0.3, 0, -0.3, -0.5, -0.3][n % 8] + (avant(v) ? 0.8 : 0.3);
      const pied = n % 4 === 0 ? poussiere(24 - avant(v) * 6 + (n ? 4 : -4), 61.6, -avant(v) || 1) : '';
      return pied + pencher(avant(v) * 5, `<g transform="translate(0 ${r2(up)})">${s}</g>`);
    }
  },
  arret: {
    nom: 'Arrêt', images: 4, dt: 0.13, dirs: MOUVANTES, contexte: 'Il arrive, freine, puis se pose (« Attends… Non. Si. »).',
    img: (c, v, n, e) => {
      if (n === 0) return poussiere(24 + avant(v) * 6, 61.6, avant(v) || 1) + pencher(-avant(v) * 4, marcher(c, v, 2, e || 'surprise'));
      if (n === 1) return pencher(-avant(v) * 3, frame({ ...c, uid: `${c.uid}fr`, geste: 'freiner', pose: freiner }, v, 'action', 0, e));
      if (n === 2) return `<g transform="translate(24 62) scale(1.03 0.96) translate(-24 -62)">${frame(c, v, 'repos', 0, e || 'pensive')}</g>`;
      return frame(c, v, 'repos', 0, e || 'veille');
    }
  },
  salut: { nom: 'Salut', images: IMAGES.salut, dt: 0.22, dirs: ['face'], contexte: 'Il salue le joueur, de loin.', img: (c, v, n, e) => frame(c, v, 'salut', n, e || 'sourire') },
  loupe: { nom: 'Travail : la loupe', images: IMAGES.action, dt: 0.45, dirs: TOUTES, contexte: 'Il examine un rouage à la loupe ; il tourne : eurêka.', img: (c, v, n, e) => frame(c, v, 'action', n, e) },
  visser: { nom: 'Travail : visser', images: 4, dt: 0.24, dirs: TOUTES, contexte: 'À l\'établi : créer (le puzzle, l\'assemblage) ; « clic ».', img: metier('visser') },
  forger: { nom: 'Travail : forger', images: 4, dt: 0.2, dirs: TOUTES, contexte: 'Au Faubourg, sa forge : le marteau, l\'enclume, le fer rougi.', img: metier('forger') },
  remonter: { nom: 'Travail : remonter Tic-Tac', images: 4, dt: 0.4, dirs: DEVANT, contexte: 'Tic-Tac s\'envole… et s\'arrête au mauvais moment.', img: metier('remonter') },
  trier: { nom: 'Travail : trier ses vis', images: 4, dt: 0.45, dirs: DEVANT, contexte: 'Son arrivée : il trie ses vis, sous sa voile.', img: metier('trier') },
  dodo: {
    nom: 'Dodo, assis', images: 2, dt: 1.1, dirs: ['face'], contexte: 'La nuit, au camp : sa boîte de vis sur les genoux, des vis tombées par terre.',
    // (assis, le corps descend : la transformation du naufrage y tient les lambeaux dans le cadre, avec une marge pour
    // les fils qui pendent au bout ; la chemise trempée ne goutte plus)
    // (les mains de chaque côté de la boîte, à portée de ses bras, membres.js)
    img: (c, v, n) => D.seated({ ...c, body: (cc, ctx) => c.body(cc, { ...ctx, seatDy: D.POSES.Rivet.dy + 1.2 }) }, n, {
      ...D.POSES.Rivet,
      arms: (cc, [l, r]) => arm(cc, l, [19.4, 52.8], [13.4, 50.4]) + arm(cc, r, [28.6, 52.8], [34.6, 50.4])
    })
  },
  dodoCouche: {
    nom: 'Dodo, couché', images: 2, dt: 1.1, dirs: ['face'], cadre: G.CADRE_COUCHE, contexte: 'La nuit, sous une couverture rapiécée (cadre couché 64 × 48).',
    img: (c, v, n) => G.couche(c, n, { fond: '#7A6250', motif: '#C9A24A' })
  }
};
// Les poses (lorena_poses.js, les mêmes pour toute la troupe refondue) : face et trois quarts, dans les deux sens
for (const [k, p] of Object.entries(POSES)) {
  ANIMS[`pose_${k}`] = { nom: p.nom, images: p.images, dt: p.images === 4 ? 0.2 : 0.42, dirs: DEVANT, pose: true, contexte: 'Dialogue, réaction (quête, surprise, froid, victoire).', img: (c, v, n, e) => dessinerPose(c, k, v, n, e) };
}

// L'image n de l'animation, dans la direction voulue
function dessiner(c, anim, direction, n, expr) {
  const A = ANIMS[anim], d = DIRECTIONS[direction];
  if (!A) throw new Error(`animation inconnue : ${anim}`);
  if (!d) throw new Error(`direction inconnue : ${direction}`);
  const cc = { ...c, miroir: d.miroir, uid: `${c.uid}${direction.slice(0, 2)}${direction.slice(-1)}` };
  const s = A.img(cc, d.vue, n % A.images, expr);
  const w = A.cadre ? A.cadre[2] : 48;
  return d.miroir ? `<g transform="translate(${w} 0) scale(-1 1)">${s}</g>` : s;
}

module.exports = { ANIMS, DIRECTIONS, dessiner };
