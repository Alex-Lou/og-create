// Lorena (anciennement Hermine ; fichiers du jeu : aster) : toutes ses animations en jeu, dans toutes les directions.
// dessiner(c, anim, direction, n, expr) rend l'image n d'une animation, prête à poser dans le cadre 48 × 64 (le sommeil
// couché : son propre cadre, CADRE_COUCHE de gestes.js). Les quatre directions sont dessinées chacune pour elle-même :
// celles de gauche partent de la vue de droite, ses marques passées de l'autre côté (c.miroir), puis l'image est
// retournée ; le bandage reste à son poignet droit, le sparadrap sur sa joue gauche, la queue de cheval et la longue-vue
// à sa gauche.
const { frame, IMAGES, E, arm } = require('../troupe');
const G = require('../../atelier/gestes');
const D = require('../../atelier/dormeurs');
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
// pencher tout le corps autour de la taille (degrés ; + : le haut vers la droite de l'écran) : la tête part en avant, les
// pieds reculent à peine, et tout reste dans le cadre
const pencher = (deg, s) => (deg ? `<g transform="rotate(${deg} 24 44)">${s}</g>` : s);
// vers l'avant, selon la vue : de trois quarts avant elle va vers la gauche de l'écran, de dos vers la droite
const avant = vue => (vue === 'se' ? -1 : vue === 'ne' ? 1 : 0);

// Les bras tendus pour freiner (l'arrêt) : un peu devant soi, à hauteur de taille
function freiner({ view }) {
  const [a, b] = this.shoulders, k = avant(view);
  return { expr: 'surprise', left: arm(this, a, [a[0] + k * 3 - 2.4, a[1] + 6.4], [a[0] - 2.2, a[1] + 4.2]), right: arm(this, b, [b[0] + k * 3 + 2.4, b[1] + 6.4], [b[0] + 2.2, b[1] + 4.2]) };
}

// Les animations : leurs images, la durée d'une image (s), les directions où elles se jouent, le contexte en jeu
const ANIMS = {
  repos: { nom: 'Repos', images: IMAGES.repos, dt: 0.55, dirs: TOUTES, contexte: 'Elle attend, écoute, regarde autour d\'elle.', img: (c, v, n, e) => frame(c, v, 'repos', n, e) },
  marche: { nom: 'Marche', images: IMAGES.marche, dt: 0.1, dirs: MOUVANTES, contexte: 'Elle se déplace sur l\'île.', img: (c, v, n, e) => frame(c, v, 'marche', n, e) },
  course: {
    nom: 'Course', images: IMAGES.marche, dt: 0.065, dirs: MOUVANTES, contexte: 'L\'urgence : la brume avance, un appel, une créature.',
    // la marche, pliée et pressée : bras qui pompent, le buste penché en avant, le corps qui rebondit, la poussière au
    // contact du pied
    img: (c, v, n, e) => {
      const s = frame({ ...c, course: true }, v, 'marche', n, e || 'decidee');
      // (le rebond s'ajoute à celui de la marche : borné pour que l'épi ne sorte jamais du cadre)
      const up = [0, -0.45, -0.7, -0.45, 0, -0.45, -0.7, -0.45][n % 8];
      const pied = n % 4 === 0 ? poussiere(24 - avant(v) * 6 + (n ? 4 : -4), 61.6, -avant(v) || 1) : '';
      return pied + pencher(avant(v) * 5, `<g transform="translate(0 ${up})">${s}</g>`);
    }
  },
  arret: {
    nom: 'Arrêt', images: 4, dt: 0.13, dirs: MOUVANTES, contexte: 'Elle arrive, freine, puis se pose.',
    // le dernier pas, le buste en arrière ; les bras qui freinent ; le corps qui se tasse ; le repos
    img: (c, v, n, e) => {
      if (n === 0) return poussiere(24 + avant(v) * 6, 61.6, avant(v) || 1) + pencher(-avant(v) * 5, frame(c, v, 'marche', 2, e || 'surprise'));
      if (n === 1) return pencher(-avant(v) * 3, frame({ ...c, uid: `${c.uid}fr`, geste: 'freiner', pose: freiner }, v, 'action', 0, e));
      if (n === 2) return `<g transform="translate(24 62) scale(1.03 0.96) translate(-24 -62)">${frame(c, v, 'repos', 0, e || 'veille')}</g>`;
      return frame(c, v, 'repos', 0, e || 'veille');
    }
  },
  salut: { nom: 'Salut', images: IMAGES.salut, dt: 0.22, dirs: ['face'], contexte: 'Elle salue le joueur, de loin.', img: (c, v, n, e) => frame(c, v, 'salut', n, e) },
  dodo: {
    nom: 'Dodo, assise', images: 2, dt: 1.1, dirs: ['face'], contexte: 'La nuit, au camp : adossée à une caisse repêchée, la longue-vue sur les genoux.',
    img: (c, v, n) => D.seated({ ...c, sansLongueVue: true }, n, D.POSES.Aster)
  },
  dodoCouche: {
    nom: 'Dodo, couchée', images: 2, dt: 1.1, dirs: ['face'], cadre: G.CADRE_COUCHE, contexte: 'La nuit, sous la couverture (cadre couché 64 × 48).',
    img: (c, v, n) => G.couche(c, n, { fond: '#3E5F86', motif: '#C8463A' })
  },
  longuevue: { nom: 'Travail : la longue-vue', images: IMAGES.action, dt: 0.45, dirs: ['bas_gauche', 'bas_droite'], contexte: 'Au Ponton : elle scrute le large.', img: (c, v, n, e) => frame(c, v, 'action', n, e) },
  peche: { nom: 'Travail : la pêche', images: 2, dt: 0.5, dirs: TOUTES, contexte: 'Au Ponton : elle pêche.', img: (c, v, n, e) => frame({ ...G.avecPecher(c), geste: 'pecher' }, v, 'action', n, e || 'veille') },
  porter: { nom: 'Travail : porter une caisse', images: 2, dt: 0.4, dirs: TOUTES, contexte: 'Au camp : elle rapporte ce que la mer a rendu.', img: (c, v, n, e) => frame({ ...G.avecPorter(c), geste: 'porter' }, v, 'action', n, e || 'decidee') },
  journal: { nom: 'Travail : le journal de bord', images: 2, dt: 0.5, dirs: TOUTES, contexte: 'Le soir : elle tient son journal de bord.', img: (c, v, n, e) => frame({ ...G.avecEcrire(c), geste: 'ecrire' }, v, 'action', n, e || 'concentree') }
};
// Les poses (lorena_poses.js) : face et trois quarts, dans les deux sens
for (const [k, p] of Object.entries(POSES)) {
  ANIMS[`pose_${k}`] = { nom: p.nom, images: p.images, dt: p.images === 4 ? 0.2 : 0.42, dirs: ['face', 'bas_gauche', 'bas_droite'], pose: true, contexte: 'Dialogue, réaction (quête, coffre, surprise, froid, victoire).', img: (c, v, n, e) => dessinerPose(c, k, v, n, e) };
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
