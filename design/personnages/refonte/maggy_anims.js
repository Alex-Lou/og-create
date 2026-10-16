// Maggy (anciennement Mélisse ; fichiers du jeu : melisse) : toutes ses animations en jeu, dans toutes les directions.
// dessiner(c, anim, direction, n, expr) rend l'image n d'une animation, prête à poser dans le cadre 48 × 64 (le sommeil
// couché : son propre cadre, CADRE_COUCHE de gestes.js). Les directions comme pour toute la troupe refondue : celles de
// gauche partent de la vue de droite, ses marques passées de l'autre côté (c.miroir), puis l'image est retournée ; la
// tresse reste sur son épaule gauche, la boîte au creux de son bras droit, le bouquet du chapeau à sa droite.
// Elle a la carrure de Lorena : les poses de la troupe (lorena_poses.js) se jouent chez elle telles quelles.
const { frame, IMAGES, E, arm, r2 } = require('../troupe');
const G = require('../../atelier/gestes');
const D = require('../../atelier/dormeurs');
const { marcher } = require('./membres');
const { POSES } = require('./lorena_poses');
const { avec } = require('./maggy_gestes');
const { boite, pal } = require('./maggy_refonte');

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
// un geste (maggy_gestes.js), quatre images
const metier = (nom, e) => (c, v, n, x) => frame(avec(c, nom), v, 'action', n, x || e);

// Les animations : leurs images, la durée d'une image (s), les directions où elles se jouent, le contexte en jeu
const ANIMS = {
  repos: { nom: 'Repos', images: IMAGES.repos, dt: 0.6, dirs: TOUTES, contexte: 'Elle attend, calme absolu : rien ne la presse.', img: (c, v, n, e) => frame(c, v, 'repos', n, e) },
  marche: { nom: 'Marche', images: IMAGES.marche, dt: 0.12, dirs: MOUVANTES, contexte: 'Elle va du Potager à la lisière, lentement, en sabots.', img: (c, v, n, e) => marcher(c, v, n, e) },
  course: {
    nom: 'Course', images: IMAGES.marche, dt: 0.07, dirs: MOUVANTES, contexte: 'Rare : son arrivée (on la poursuivait), une averse sur les semis.',
    // la marche, pressée : bras qui pompent, le buste penché en avant, le corps qui rebondit, la poussière au contact du
    // pied (en sabots : le rebond plus court) ; (penchée, le grand chapeau monte : le corps descend d'autant)
    img: (c, v, n, e) => {
      const s = marcher({ ...c, course: true }, v, n, e || 'essoufflee');
      const up = [0, -0.2, -0.35, -0.2, 0, -0.2, -0.35, -0.2][n % 8] + (avant(v) ? 0.8 : 0.2);
      const pied = n % 4 === 0 ? poussiere(24 - avant(v) * 6 + (n ? 4 : -4), 61.6, -avant(v) || 1) : '';
      return pied + pencher(avant(v) * 4, `<g transform="translate(0 ${r2(up)})">${s}</g>`);
    }
  },
  arret: {
    nom: 'Arrêt', images: 4, dt: 0.14, dirs: MOUVANTES, contexte: 'Elle arrive, freine, puis se pose (et sourit en coin).',
    img: (c, v, n, e) => {
      if (n === 0) return poussiere(24 + avant(v) * 6, 61.6, avant(v) || 1) + pencher(-avant(v) * 4, marcher(c, v, 2, e || 'surprise'));
      if (n === 1) return pencher(-avant(v) * 3, frame({ ...c, uid: `${c.uid}fr`, geste: 'freiner', pose: freiner }, v, 'action', 0, e));
      if (n === 2) return `<g transform="translate(24 62) scale(1.03 0.96) translate(-24 -62)">${frame(c, v, 'repos', 0, e || 'essoufflee')}</g>`;
      return frame(c, v, 'repos', 0, e || 'veille');
    }
  },
  salut: { nom: 'Salut', images: IMAGES.salut, dt: 0.28, dirs: ['face'], contexte: 'Elle lève la main, lentement : « Chaque chose en sa lune. »', img: (c, v, n, e) => frame(c, v, 'salut', n, e) },
  boite: { nom: 'La boîte à graines', images: 4, dt: 0.5, dirs: TOUTES, contexte: 'Elle ouvre sa boîte : des graines lumineuses s\'envolent, comme de petites lunes.', img: metier('boite') },
  semer: { nom: 'Travail : semer à la lune', images: 4, dt: 0.45, dirs: TOUTES, contexte: 'Au Potager : une graine dans la terre, la terre luit.', img: metier('semer') },
  arroser: { nom: 'Travail : arroser', images: 4, dt: 0.36, dirs: TOUTES, contexte: 'Au Potager : l\'arrosoir de fer, la pluie fine.', img: metier('arroser') },
  herbes: { nom: 'Travail : cueillir les herbes', images: 4, dt: 0.45, dirs: TOUTES, contexte: 'Les herbes des potions d\'Agathe : elle cueille, respire, met au panier.', img: metier('herbes') },
  lunette: { nom: 'Lunette', images: 4, dt: 0.5, dirs: TOUTES, contexte: 'Lunette, son papillon de nuit, se pose sur son chapeau.', img: metier('lunette') },
  dodo: {
    nom: 'Dodo, assise', images: 2, dt: 1.2, dirs: ['face'], contexte: 'La nuit, au Potager : assise, la boîte sur les genoux, endormie dessus sous son grand chapeau.',
    // (assise, le corps descend ; la robe trempée ne goutte plus) ; la boîte sur les genoux, les bras croisés dessus ; la
    // tête penchée, le chapeau qui la cache à moitié (dormeurs.js, POSES.Mélisse)
    img: (c, v, n) => D.seated({ ...c, restLeft: undefined, body: (cc, ctx) => c.body(cc, { ...ctx, seatDy: D.POSES['Mélisse'].dy }) }, n, {
      ...D.POSES['Mélisse'],
      // (la boîte, à l'échelle de ses genoux : deux fois la boîte qu'elle serre au repos, vue de plus près)
      arms: (cc, [l, r]) => `<g transform="translate(24 50.4) scale(2) translate(-24 -50.4)">${boite(pal(cc), 24, 50.4)}</g>` + arm(cc, l, [27.8, 46.2], [12.8, 46]) + arm(cc, r, [20.2, 46.4], [35.2, 46.2])
    })
  },
  dodoCouche: {
    nom: 'Dodo, couchée', images: 2, dt: 1.2, dirs: ['face'], cadre: G.CADRE_COUCHE, contexte: 'La nuit, au camp, sous une couverture couleur nuit (cadre couché 64 × 48).',
    img: (c, v, n) => G.couche(c, n, { fond: '#2E3A6B', motif: '#F4EEDF' })
  }
};
// Les poses (lorena_poses.js, les mêmes pour toute la troupe refondue) : face et trois quarts, dans les deux sens. Ses
// grand chapeau descend sur ses épaules : dans les poses où les mains montent, les bras passent par-dessus (devant
// le bord du chapeau et la tresse, sinon ils s'y cachaient) ; de dos, les bras restent le long du corps
const LEVEES = new Set(['joie', 'sursaut', 'visiere', 'tete', 'pointe']);
function poserMaggy(c, nom) {
  const p = POSES[nom];
  return {
    ...c, uid: `${c.uid}${nom.slice(0, 3)}`, geste: nom,
    pose(ctx) {
      if (ctx.view === 'ne') return { expr: p.expr };
      const r = p.fn.call(this, ctx);
      if (!LEVEES.has(nom)) return { expr: p.expr, ...r };
      return { expr: p.expr, left: '', right: '', under: r.under, over: (r.left || '') + (r.right || '') + (r.over || '') };
    }
  };
}
for (const [k, p] of Object.entries(POSES)) {
  ANIMS[`pose_${k}`] = {
    nom: p.nom, images: p.images, dt: p.images === 4 ? 0.2 : 0.42, dirs: DEVANT, pose: true, contexte: 'Dialogue, réaction (quête, surprise, froid, victoire).',
    img: (c, v, n, e) => {
      const s = frame(poserMaggy(c, k), v, 'action', n, e);
      const bond = typeof p.bond === 'function' ? p.bond(n) : p.bond && n % 2 ? p.bond : null;
      return bond && (bond[0] || bond[1]) ? `<g transform="translate(${bond[0]} ${bond[1]})">${s}</g>` : s;
    }
  };
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
