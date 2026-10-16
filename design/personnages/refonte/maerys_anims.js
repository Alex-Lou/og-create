// Maerys (anciennement Sylve ; fichiers du jeu : sylve) : toutes ses animations en jeu, dans toutes les directions.
// dessiner(c, anim, direction, n, expr) rend l'image n d'une animation, prête à poser dans le cadre 48 × 64 (le sommeil
// couché : son propre cadre, CADRE_COUCHE de gestes.js). Les directions comme pour Lorena, Agathe, Nathan, Robby et Léo :
// celles de gauche partent de la vue de droite, ses marques passées de l'autre côté (c.miroir), puis l'image est
// retournée ; la plume de geai reste à sa gauche, le nœud de la liane à sa hanche droite, la pièce cousue à sa hanche gauche.
// Elle a la carrure de Lorena : les poses de la troupe (lorena_poses.js) se jouent chez elle telles quelles.
const { frame, IMAGES, E, P, clip, arm, r2 } = require('../troupe');
const G = require('../../atelier/gestes');
const D = require('../../atelier/dormeurs');
const { marcher } = require('./membres');
const { POSES } = require('./lorena_poses');
const { avec } = require('./maerys_gestes');

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
// un geste (maerys_gestes.js), quatre images
const metier = (nom, e) => (c, v, n, x) => frame(avec(c, nom), v, 'action', n, x || e);

// Le dodo assis : adossée à la vieille souche moussue d'un chêne de La Lisière, cassée net par une tempête (le bord en
// éclats, le bois clair dedans), les racines ; derrière la souche dépasse la queue rousse de Mousse, le renardeau qui se
// cache (on n'en voit que la queue : HISTOIRE.md), qui remue en dormant
// (la souche est plus large qu'elle : on la voit de chaque côté ; X : les abscisses élargies autour du milieu)
const X = x => r2(24 + (x - 24) * 1.4);
const larges = d => d.replace(/(-?\d+\.?\d*),(-?\d+\.?\d*)/g, (m, x, y) => `${X(+x)},${y}`);
function tronc(uid) {
  const d = larges('M10.4,63.4 Q11.8,56 12.2,44 Q12.4,34 12.6,26.4 L15.4,23.4 L17.8,25.6 L20.8,21.8 L23.6,24.6 L27,20.8 L29.6,24.2 L32.4,22.4 L35.4,26.2 Q35.6,34 35.8,44 Q36.2,56 37.6,63.4 Z');
  return P(d, '#7A5636') + clip(`${uid}tr`, d, `<rect x="${X(27.4)}" y="18" width="18" height="48" fill="#5A3E26"/>`
    // le bois clair des éclats, au bord cassé
    + `<path d="${larges('M12.6,26.4 L15.4,23.4 L17.8,25.6 L20.8,21.8 L23.6,24.6 L27,20.8 L29.6,24.2 L32.4,22.4 L35.4,26.2 L35.4,27.6 L32.4,24.2 L29.6,26 L27,22.8 L23.6,26.4 L20.8,23.8 L17.8,27.2 L15.4,25.2 L12.6,28 Z')}" fill="#C9A27A"/>`
    + ['M16.4,30 Q15.6,40 16.6,52', 'M21.2,29 Q22,38 20.8,48', 'M29.6,29 Q30.6,40 29.4,50', 'M33,31 Q32.4,40 33.4,48'].map(p => `<path d="${larges(p)}" fill="none" stroke="#4A3220" stroke-width="0.55" opacity=".7"/>`).join('')
    + `<rect x="${X(12.6)}" y="28" width="1.4" height="24" rx="0.7" fill="#9A7652"/>`
    + E(24.6, 33, 1.6, 2.2, '#5A3E26', 0.5) + E(24.4, 32.7, 0.7, 1, '#3E2A1A', 0)
    + [[14.2, 36, 2.2], [33.2, 30.4, 1.8], [15, 48, 1.6]].map(([x, y, r]) => E(X(x), y, r, r * 0.7, '#6E9A4A', 0)).join('')) + P(d, 'none')
    // les racines, de chaque côté
    + P('M7.8,63.4 Q5.4,62.4 3.4,62.9 Q5,60.4 9.4,59.4 Z', '#7A5636', 0.8) + P('M40.2,63.4 Q42.6,62.2 44.6,62.7 Q43,60.2 38.6,59.2 Z', '#5A3E26', 0.8);
}
function queueDeMousse(n) {
  // (elle remue d'une image à l'autre, le bout blanc)
  const d = n ? 'M35.6,58.2 Q41.4,57.4 43,52.6 Q43.8,49.4 41.8,48.4 Q40.4,51.8 37.6,53.8 Q35.6,55 35.2,56.4 Z' : 'M35.6,58.2 Q41.6,58.4 43.6,54.4 Q44.8,51.4 43,50 Q41.2,53 38,54.6 Q35.8,55.6 35.2,56.6 Z';
  const bout = n ? 'M43,52.6 Q43.8,49.4 41.8,48.4 Q41.2,50.2 41.6,51.6 Z' : 'M43.6,54.4 Q44.8,51.4 43,50 Q42.2,51.8 42.6,53.2 Z';
  return P(d, '#D2692E', 0.8) + `<path d="${d}" fill="none" stroke="#A84E20" stroke-width="0.4" opacity=".5" transform="translate(0.4 0.6)"/>` + P(bout, '#F4EEDF', 0.6);
}

// Les animations : leurs images, la durée d'une image (s), les directions où elles se jouent, le contexte en jeu
const ANIMS = {
  repos: { nom: 'Repos', images: IMAGES.repos, dt: 0.55, dirs: TOUTES, contexte: 'Elle attend, sur ses gardes : le regard de côté, prête à filer.', img: (c, v, n, e) => frame(c, v, 'repos', n, e) },
  marche: { nom: 'Marche', images: IMAGES.marche, dt: 0.11, dirs: MOUVANTES, contexte: 'Elle va pieds nus, sans bruit, de La Lisière au Bosquet.', img: (c, v, n, e) => marcher(c, v, n, e) },
  course: {
    nom: 'Course', images: IMAGES.marche, dt: 0.06, dirs: MOUVANTES, contexte: 'Elle file comme une bête des bois : un feu, une bête perdue, la brume.',
    // la marche, pressée : bras qui pompent, le buste penché en avant, le corps qui rebondit (légère, elle bondit plus
    // haut qu'Agathe), la poussière au contact du pied
    img: (c, v, n, e) => {
      const s = marcher({ ...c, course: true }, v, n, e || 'decidee');
      const up = [0, -0.4, -0.65, -0.4, 0, -0.4, -0.65, -0.4][n % 8] + (avant(v) ? 0.6 : 0.2);
      const pied = n % 4 === 0 ? poussiere(24 - avant(v) * 6 + (n ? 4 : -4), 61.6, -avant(v) || 1) : '';
      return pied + pencher(avant(v) * 4, `<g transform="translate(0 ${r2(up)})">${s}</g>`);
    }
  },
  arret: {
    nom: 'Arrêt', images: 4, dt: 0.13, dirs: MOUVANTES, contexte: 'Elle arrive, freine, puis se pose, aux aguets.',
    img: (c, v, n, e) => {
      if (n === 0) return poussiere(24 + avant(v) * 6, 61.6, avant(v) || 1) + pencher(-avant(v) * 4, marcher(c, v, 2, e || 'surprise'));
      if (n === 1) return pencher(-avant(v) * 3, frame({ ...c, uid: `${c.uid}fr`, geste: 'freiner', pose: freiner }, v, 'action', 0, e));
      if (n === 2) return `<g transform="translate(24 62) scale(1.03 0.96) translate(-24 -62)">${frame(c, v, 'repos', 0, e || 'mefiante')}</g>`;
      return frame(c, v, 'repos', 0, e || 'veille');
    }
  },
  salut: { nom: 'Salut', images: IMAGES.salut, dt: 0.24, dirs: ['face'], contexte: 'Un petit signe de la main, farouche, puis de moins en moins (les cœurs).', img: (c, v, n, e) => frame(c, v, 'salut', n, e) },
  chanter: { nom: 'Travail : chanter aux graines', images: 4, dt: 0.42, dirs: TOUTES, contexte: 'Au Bosquet : elle chante à la graine, la pousse sort (naufragée : son don oublié, rien ne pousse).', img: metier('chanter') },
  oiseau: { nom: 'Parler aux bêtes', images: 4, dt: 0.4, dirs: TOUTES, contexte: 'Un rouge-gorge se pose sur son doigt et chante (le Bestiaire, plus tard).', img: metier('oiseau') },
  cachee: { nom: 'Se cacher', images: 4, dt: 0.36, dirs: TOUTES, contexte: 'Farouche : le joueur s\'approche trop tôt (avant d\'être apprivoisée).', img: metier('cachee') },
  lanterne: { nom: 'La lanterne des Anciens', images: 4, dt: 0.5, dirs: TOUTES, contexte: 'La première lanterne de La Lisière (acte I) : la lumière avant le feu.', img: metier('lanterne') },
  bois: { nom: 'Travail : le bois mort', images: 4, dt: 0.42, dirs: TOUTES, contexte: 'Quand le bois manque : elle rapporte le bois mort (on ne coupe pas ses arbres).', img: metier('bois') },
  dodo: {
    nom: 'Dodo, assise', images: 2, dt: 1.1, dirs: ['face'], contexte: 'La nuit, à La Lisière : adossée à un vieux chêne ; la queue rousse de Mousse dépasse.',
    // (assise, le corps descend ; la tunique trempée ne goutte plus) ; (les mains posées sur ses genoux)
    img: (c, v, n) => D.seated({ ...c, body: (cc, ctx) => c.body(cc, { ...ctx, seatDy: 8.4 }) }, n, {
      dy: 8.4, tilt: 9, hy: 0.6, feet: [19.6, 28.4], footY: 59.6,
      back: cc => tronc(cc.uid),
      arms: (cc, [l, r]) => arm(cc, l, [20.4, 53.4], [13.4, 50.4]) + arm(cc, r, [27.6, 53.4], [34.6, 50.4]),
      front: () => queueDeMousse(n)
    })
  },
  dodoCouche: {
    nom: 'Dodo, couchée', images: 2, dt: 1.1, dirs: ['face'], cadre: G.CADRE_COUCHE, contexte: 'La nuit, au camp, sous une couverture vert mousse (cadre couché 64 × 48).',
    img: (c, v, n) => G.couche(c, n, c.couverture || { fond: '#4E6E3A', motif: '#C9D9A0' })
  }
};
// Les poses (lorena_poses.js, les mêmes pour toute la troupe refondue) : face et trois quarts, dans les deux sens. Ses
// cheveux sont plus larges que ses épaules : dans les poses où les mains montent, les bras passent par-dessus (devant
// ses cheveux, sinon ils s'y cachaient) ; de dos, les bras restent le long du corps
const LEVEES = new Set(['joie', 'sursaut', 'visiere', 'tete', 'pointe']);
function poserMaerys(c, nom) {
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
      const s = frame(poserMaerys(c, k), v, 'action', n, e);
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
