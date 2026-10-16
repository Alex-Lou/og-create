// Léo (anciennement Ondin ; fichiers du jeu : ondin) : toutes ses animations en jeu, dans toutes les directions. dessiner(c, anim, direction, n, expr) rend l'image n d'une animation, prête à poser dans le cadre
// 48 × 64 (le sommeil couché : son propre cadre, CADRE_COUCHE de gestes.js). Les directions comme pour Lorena, Agathe et
// Nathan et Robby : celles de gauche partent de la vue de droite, ses marques passées de l'autre côté (c.miroir), puis
// l'image est retournée ; le bocal reste à sa hanche gauche, le nœud de corde à sa droite, l'algue à sa droite.
// Les poses de la troupe (lorena_poses.js) sont calées sur Lorena : Léo est un enfant (les épaules et la tête plus bas,
// HY), elles se jouent chez lui décalées d'autant.
const { frame, IMAGES, E, arm, r2 } = require('../troupe');
const G = require('../../atelier/gestes');
const D = require('../../atelier/dormeurs');
const { marcher } = require('./membres');
const { POSES } = require('./lorena_poses');
const { avec } = require('./leo_gestes');
const { HY } = require('./leo_refonte');

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
// un geste de son métier (leo_gestes.js), quatre images
const metier = (nom, e) => (c, v, n, x) => frame(avec(c, nom), v, 'action', n, x || e);

// Les animations : leurs images, la durée d'une image (s), les directions où elles se jouent, le contexte en jeu
// les « z » que G.couche dessine en dernier (troupe.zee : deux traits par « z », deux « z »)
const ZEDS_FIN = /(?:<path d="M[\d.]+,[\d.]+ L[\d.]+,[\d.]+ L[\d.]+,[\d.]+ L[\d.]+,[\d.]+" fill="none"[^>]*\/>){4}$/;
const ANIMS = {
  repos: { nom: 'Repos', images: IMAGES.repos, dt: 0.6, dirs: TOUTES, contexte: 'Il attend, à moitié endormi ; il regarde la lune.', img: (c, v, n, e) => frame(c, v, 'repos', n, e) },
  marche: { nom: 'Marche', images: IMAGES.marche, dt: 0.11, dirs: MOUVANTES, contexte: 'Il va à La Source, à petits pas pieds nus.', img: (c, v, n, e) => marcher(c, v, n, e) },
  course: {
    nom: 'Course', images: IMAGES.marche, dt: 0.065, dirs: MOUVANTES, contexte: 'L\'urgence : la baguette qui tire, la brume, Bulle.',
    // la marche, pressée : bras qui pompent, le buste penché en avant, le corps qui rebondit (un enfant : plus haut que
    // Robby), la poussière au contact du pied
    img: (c, v, n, e) => {
      const s = marcher({ ...c, course: true }, v, n, e || 'decidee');
      const up = [0, -0.45, -0.7, -0.45, 0, -0.45, -0.7, -0.45][n % 8] + (avant(v) ? 0.6 : 0.2);
      const pied = n % 4 === 0 ? poussiere(24 - avant(v) * 6 + (n ? 4 : -4), 61.6, -avant(v) || 1) : '';
      return pied + pencher(avant(v) * 4, `<g transform="translate(0 ${r2(up)})">${s}</g>`);
    }
  },
  arret: {
    nom: 'Arrêt', images: 4, dt: 0.13, dirs: MOUVANTES, contexte: 'Il arrive, freine, puis se pose (et bâille).',
    img: (c, v, n, e) => {
      if (n === 0) return poussiere(24 + avant(v) * 6, 61.6, avant(v) || 1) + pencher(-avant(v) * 4, marcher(c, v, 2, e || 'surprise'));
      if (n === 1) return pencher(-avant(v) * 3, frame({ ...c, uid: `${c.uid}fr`, geste: 'freiner', pose: freiner }, v, 'action', 0, e));
      if (n === 2) return `<g transform="translate(24 62) scale(1.03 0.96) translate(-24 -62)">${frame(c, v, 'repos', 0, e || 'epuisee')}</g>`;
      return frame(c, v, 'repos', 0, e || 'veille');
    }
  },
  salut: { nom: 'Salut', images: IMAGES.salut, dt: 0.22, dirs: ['face'], contexte: 'Il agite la main, réveillé un instant.', img: (c, v, n, e) => frame(c, v, 'salut', n, e) },
  sourcier: { nom: 'Travail : la baguette de sourcier', images: 4, dt: 0.32, dirs: TOUTES, contexte: 'À La Source : la baguette frémit, tremble, plonge ; l\'eau jaillit (« Là ! Ça tire ! »).', img: metier('sourcier') },
  chercher: { nom: 'Travail : chercher ce qui est perdu', images: 4, dt: 0.4, dirs: TOUTES, contexte: 'La baguette trouve aussi les choses perdues (la clé du phare, acte VI).', img: metier('chercher') },
  bulle: { nom: 'Bulle, dans son bocal', images: 4, dt: 0.5, dirs: DEVANT, contexte: 'Il regarde Bulle nager ; ou le bocal vide (« Bulle est retourné dans la mer. »).', img: metier('bulle') },
  lune: { nom: 'Parler à la lune', images: 4, dt: 0.55, dirs: TOUTES, contexte: 'La nuit : la lune lui parle, il lui chuchote.', img: metier('lune') },
  bailler: { nom: 'Bâiller', images: 4, dt: 0.5, dirs: TOUTES, contexte: 'La brume le tient encore : il s\'endort debout, puis sursaute.', img: metier('bailler') },
  dodo: {
    nom: 'Dodo, assis', images: 2, dt: 1.1, dirs: ['face'], contexte: 'La nuit, à La Source : assis contre un rocher, le bocal renversé, une bulle au nez.',
    // (assis, le corps descend : la transformation du naufrage y tient les lambeaux dans le cadre ; le ciré trempé ne
    // goutte plus) ; (les mains à portée de ses bras courts, posées sur ses genoux ; la baguette, contre le rocher)
    img: (c, v, n) => D.seated({ ...c, body: (cc, ctx) => c.body(cc, { ...ctx, seatDy: D.POSES.Ondin.dy }) }, n, {
      ...D.POSES.Ondin,
      arms: (cc, [l, r]) => arm(cc, l, [20.6, 53.6], [13.4, 50.8]) + arm(cc, r, [27.4, 53.6], [34.6, 50.8])
    })
  },
  dodoCouche: {
    nom: 'Dodo, couché', images: 2, dt: 1.1, dirs: ['face'], cadre: G.CADRE_COUCHE, contexte: 'La nuit, au camp, sous une couverture bleue rayée de crème (cadre couché 64 × 48).',
    // (couché, le pompon de son bonnet monte juste sous les « z » : ils partent un peu plus à droite, au-dessus de la couverture)
    img: (c, v, n) => G.couche(c, n, { fond: '#3E5A8C', motif: '#F4EEDF' }).replace(ZEDS_FIN, z => `<g transform="translate(4.6 0)">${z}</g>`)
  }
};
// Les poses de la troupe (lorena_poses.js), décalées de HY : ses épaules et sa tête sont plus bas que celles de Lorena,
// les mains retombent ainsi sur sa ceinture, sur son bonnet ou au ras de ses sourcils
const decale = s => (s ? `<g transform="translate(0 ${HY})">${s}</g>` : s);
function poserLeo(c, nom) {
  const p = POSES[nom];
  return {
    ...c, uid: `${c.uid}${nom.slice(0, 3)}`, geste: nom,
    pose(ctx) {
      if (ctx.view === 'ne') return { expr: p.expr };
      if (nom === 'joie') {
        // (sa tête d'enfant descend plus bas que ses épaules : le V s'ouvre davantage, les poings sortent de chaque côté)
        const [a, b] = this.shoulders, u = [0, 1, 1.6, 0.8][ctx.n % 4];
        return { expr: p.expr, left: arm(this, a, [r2(a[0] - 7.6 - u * 0.4), r2(a[1] - 5.6 - u * 0.6)]), right: arm(this, b, [r2(b[0] + 7.6 + u * 0.4), r2(b[1] - 5.6 - u * 0.6)]) };
      }
      const r = p.fn.call({ ...this, shoulders: this.shoulders.map(([x, y]) => [x, y - HY]), hands: this.hands.map(([x, y]) => [x, y - HY]) }, ctx);
      return { expr: p.expr, left: decale(r.left), right: decale(r.right), over: decale(r.over), under: decale(r.under) };
    }
  };
}
for (const [k, p] of Object.entries(POSES)) {
  ANIMS[`pose_${k}`] = {
    nom: p.nom, images: p.images, dt: p.images === 4 ? 0.22 : 0.45, dirs: DEVANT, pose: true, contexte: 'Dialogue, réaction (quête, surprise, froid, victoire).',
    img: (c, v, n, e) => {
      const s = frame(poserLeo(c, k), v, 'action', n, e);
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
