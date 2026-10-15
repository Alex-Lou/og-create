// Les mouvements de la refonte, pour tout personnage aux membres à deux os (membres.js : l'avatar que le joueur crée,
// les visiteurs) : les mêmes que ceux de Lorena, Agathe, Nathan et Robby (lorena_anims.js), dans toutes les directions.
// dessiner(c, anim, direction, n, expr) rend l'image n d'une animation, prête à poser dans le cadre 48 × 64.
// Les directions de gauche sont celles de droite, l'image retournée (le personnage n'a pas de marques à passer de
// l'autre côté : ce qui n'est pas symétrique sur lui se retourne avec l'image).
// (Choix de l'auteur, 15 oct. : les mouvements de la refonte, repris pour tous les personnages que le joueur peut créer.)
const { frame, IMAGES, E, arm } = require('../troupe');
const { marcher, avecOs } = require('./membres');
const { POSES, dessinerPose } = require('./lorena_poses');

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

// La poussière soulevée par les pieds : trois petits nuages clairs, cernés de brun
const poussiere = (x, y, k = 1) => [[0, 0, 1.3], [-1.6 * k, 0.5, 0.9], [1.5 * k, 0.4, 0.8]].map(([dx, dy, r]) => E(x + dx, y + dy, r * 1.3, r, '#EFE4CC', 0.5)).join('');
// pencher tout le corps autour de la taille (degrés ; + : le haut vers la droite de l'écran)
const pencher = (deg, s) => (deg ? `<g transform="rotate(${deg} 24 44)">${s}</g>` : s);
// vers l'avant, selon la vue : de trois quarts avant vers la gauche de l'écran, de dos vers la droite
const avant = vue => (vue === 'se' ? -1 : vue === 'ne' ? 1 : 0);
// Les bras tendus pour freiner (l'arrêt) : un peu devant soi, à hauteur de taille
function freiner({ view }) {
  const [a, b] = this.shoulders, k = avant(view);
  return { expr: 'surprise', left: arm(this, a, [a[0] + k * 3 - 2.4, a[1] + 6.4], [a[0] - 2.2, a[1] + 4.2]), right: arm(this, b, [b[0] + k * 3 + 2.4, b[1] + 6.4], [b[0] + 2.2, b[1] + 4.2]) };
}

// Les animations : leurs images, la durée d'une image (s), les directions où elles se jouent
const ANIMS = {
  repos: { nom: 'Repos', images: IMAGES.repos, dt: 0.55, dirs: TOUTES, img: (c, v, n, e) => frame(c, v, 'repos', n, e) },
  marche: { nom: 'Marche', images: IMAGES.marche, dt: 0.1, dirs: MOUVANTES, img: (c, v, n, e) => marcher(c, v, n, e) },
  course: {
    nom: 'Course', images: IMAGES.marche, dt: 0.065, dirs: MOUVANTES,
    // la marche, pressée : bras qui pompent, le buste penché en avant, le corps qui rebondit, la poussière au contact
    img: (c, v, n, e) => {
      const s = marcher({ ...c, course: true }, v, n, e || 'decidee');
      const up = [0, -0.45, -0.7, -0.45, 0, -0.45, -0.7, -0.45][n % 8];
      const pied = n % 4 === 0 ? poussiere(24 - avant(v) * 6 + (n ? 4 : -4), 61.6, -avant(v) || 1) : '';
      return pied + pencher(avant(v) * 5, `<g transform="translate(0 ${up})">${s}</g>`);
    }
  },
  arret: {
    nom: 'Arrêt', images: 4, dt: 0.13, dirs: MOUVANTES,
    // le dernier pas, le buste en arrière ; les bras qui freinent ; le corps qui se tasse ; le repos
    img: (c, v, n, e) => {
      if (n === 0) return poussiere(24 + avant(v) * 6, 61.6, avant(v) || 1) + pencher(-avant(v) * 5, marcher(c, v, 2, e || 'surprise'));
      if (n === 1) return pencher(-avant(v) * 3, frame({ ...c, uid: `${c.uid}fr`, geste: 'freiner', pose: freiner }, v, 'action', 0, e));
      if (n === 2) return `<g transform="translate(24 62) scale(1.03 0.96) translate(-24 -62)">${frame(c, v, 'repos', 0, e || 'veille')}</g>`;
      return frame(c, v, 'repos', 0, e || 'veille');
    }
  },
  salut: { nom: 'Salut', images: IMAGES.salut, dt: 0.22, dirs: ['face'], img: (c, v, n, e) => frame(c, v, 'salut', n, e) }
};
// Les poses (lorena_poses.js) : face et trois quarts, dans les deux sens
for (const [k, p] of Object.entries(POSES)) {
  ANIMS[`pose_${k}`] = { nom: p.nom, images: p.images, dt: p.images === 4 ? 0.2 : 0.42, dirs: ['face', 'bas_gauche', 'bas_droite'], pose: true, img: (c, v, n, e) => dessinerPose(c, k, v, n, e) };
}

// Les expressions des visages de la refonte, dans celles que la tête de l'avatar connaît ; les calmes prennent
// l'expression que le joueur a choisie pour son avatar au repos (c.repos) ; les autres passent telles quelles
const VERS_KIT = { veille: null, decidee: null, concentree: null, mefiante: null, surprise: 'surpris', cri: 'surpris', peur: 'surpris', froid: 'triste', ironique: 'content' };
const versKit = (e, repos) => (e in VERS_KIT ? VERS_KIT[e] || repos || 'neutre' : e);

// L'image n de l'animation, dans la direction voulue (un personnage du kit sans les membres de la refonte les prend)
function dessiner(c, anim, direction, n, expr) {
  const A = ANIMS[anim], d = DIRECTIONS[direction];
  if (!A) throw new Error(`animation inconnue : ${anim}`);
  if (!d) throw new Error(`direction inconnue : ${direction}`);
  const o = c.os ? c : avecOs(c), tete = o.head;
  const cc = { ...o, uid: `${c.uid}${direction.slice(0, 2)}${direction.slice(-1)}`, head: (k, ctx, act) => tete(k, { ...ctx, expr: versKit(ctx.expr, o.repos) }, act) };
  const s = A.img(cc, d.vue, n % A.images, expr);
  return d.miroir ? `<g transform="translate(48 0) scale(-1 1)">${s}</g>` : s;
}

module.exports = { ANIMS, DIRECTIONS, dessiner };
