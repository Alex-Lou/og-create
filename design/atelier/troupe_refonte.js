// La troupe refondue dans la bibliothèque (choix de l'auteur, 16 oct. : les refontes partout où le jeu montrait les
// anciens dessins). Les maîtres et leurs naufragés gardent leurs noms de fichiers (aster, cannelle, rivet, ondin, sylve,
// galet, melisse) : le jeu les charge sans rien changer. Chacun vient de design/personnages/refonte/ : sa tenue de base,
// propre au village, naufragé le jour de son naufrage (<nom>_tenues.js, habiller) ; ses animations (<nom>_anims.js,
// dessiner) pour le repos, la marche, le salut, le geste de son métier, le sommeil ; les gestes communs du kit
// (gestes.js : pêcher, piocher, la lanterne, le parapluie…) se jouent sur son corps refondu.
const { frame } = require('./troupe');
// (des require écrits en toutes lettres : esbuild en fait le module du générateur, build_bundle.js)
const MODULES = {
  lorena: [require('../personnages/refonte/lorena_tenues'), require('../personnages/refonte/lorena_anims')],
  agathe: [require('../personnages/refonte/agathe_tenues'), require('../personnages/refonte/agathe_anims')],
  nathan: [require('../personnages/refonte/nathan_tenues'), require('../personnages/refonte/nathan_anims')],
  leo: [require('../personnages/refonte/leo_tenues'), require('../personnages/refonte/leo_anims')],
  maerys: [require('../personnages/refonte/maerys_tenues'), require('../personnages/refonte/maerys_anims')],
  robby: [require('../personnages/refonte/robby_tenues'), require('../personnages/refonte/robby_anims')],
  maggy: [require('../personnages/refonte/maggy_tenues'), require('../personnages/refonte/maggy_anims')]
};

// Les maîtres : le nom de la bibliothèque (celui des anciens dessins), le module refondu, ses états ; l'action (le
// fichier que le jeu nomme, sa vue) et le travail se jouent avec les gestes de son métier refondus
const MAITRES = [
  { name: 'Aster', refonte: 'lorena', naufrage: 'naufragee', action: ['avant_longuevue', 'se', 'longuevue'], travail: 'peche' },
  { name: 'Cannelle', refonte: 'agathe', naufrage: 'naufragee', action: ['face_louche', 'front', 'touiller'], travail: 'touiller' },
  { name: 'Rivet', refonte: 'nathan', naufrage: 'naufrage', action: ['face_loupe', 'front', 'loupe'], travail: 'visser' },
  { name: 'Ondin', refonte: 'leo', naufrage: 'naufrage', action: ['face_baguette', 'front', 'sourcier'], travail: 'sourcier' },
  { name: 'Sylve', refonte: 'maerys', naufrage: 'naufrage', action: ['face_chant', 'front', 'chanter'], travail: 'chanter', sansDon: true },
  { name: 'Galet', refonte: 'robby', naufrage: 'naufrage', action: ['face_rune', 'front', 'tailler'], travail: 'tailler', sansDon: true },
  { name: 'Mélisse', refonte: 'maggy', naufrage: 'naufrage', action: ['face_graines', 'front', 'boite'], travail: 'semer', pluie: 'pluie' }
];

// la direction des animations refondues pour une vue du kit (le trois quarts avant, de dos : sans miroir)
const DIR = { front: 'face', se: 'bas_gauche', ne: 'haut_droite' };
// deux images d'une animation de quatre : la 2e et la 4e (le geste à son plus fort, puis son retour) ; de deux : les deux
const deux = N => (N >= 4 ? [1, 3] : [0, 1]);

// Un maître refondu (ou son naufragé) : l'objet du kit (habiller), son nom de bibliothèque, et ses animations, pour que
// troupe_liste.js (poses) prenne les siennes là où il en a
function refondu(m, etat, naufrage) {
  const [T, A] = MODULES[m.refonte];
  const c = { ...T.habiller(undefined, null, etat), name: m.name, action: [m.action[0], m.action[1]] };
  const anim = (nom, v, n, expr, cc = c) => A.dessiner(cc, nom, DIR[v], n, expr);
  const joue = (nom, v) => { const X = A.ANIMS[nom]; return X && X.dirs.includes(DIR[v]) ? X : null; };
  c.refonte = {
    module: m.refonte,
    // le repos, la marche, le salut : les siens (le salut n'a que la face : les autres vues gardent celui du kit) ; cc : le
    // même corps dans une autre tenue (l'hiver, la pluie du kit : tenues.js)
    a: (nom, v, n, expr, cc) => (joue(nom, v) ? anim(nom, v, n, expr, cc) : null),
    // sa tenue de pluie, s'il en a une (Maggy) : sinon, le ciré du kit (tenues.js, sousLaPluie)
    pluie: () => (m.pluie ? { ...T.habiller(m.pluie, null, etat), name: m.name } : null),
    // le geste du métier (travail), deux images, dans les trois vues ; l'action (le fichier nommé), deux images
    travail: v => { const X = joue(m.travail, v); return X ? deux(X.images).map(n => anim(m.travail, v, n)) : null; },
    action: () => { const X = A.ANIMS[m.action[2]]; return deux(X.images).map(n => anim(m.action[2], m.action[1], n)); },
    // le sommeil : assis (dort, le cadre 48 × 64) et couché sous sa couverture (couche, le cadre 64 × 48 ; la couverture
    // du kit, troupe_liste.js : la sienne au village, la voile pour le naufragé)
    dort: n => anim('dodo', 'front', n),
    couche: (n, couverture) => anim('dodoCouche', 'front', n, undefined, { ...c, couverture })
  };
  if (naufrage && m.sansDon) c.sansDon = true;
  return c;
}

// Une image d'une pose du kit (troupe.frame : repos, marche, salut…) : celle du maître refondu s'il l'a, sinon le geste
// du kit sur son corps refondu ; cc : le même maître dans une autre tenue (l'hiver, la pluie)
const image = (c, v, pose, n, expr, cc) => (c.refonte && c.refonte.a(pose, v, n, expr, cc)) || frame(cc || c, v, pose, n, expr);

// La troupe refondue, comme le CAST des anciens dessins (naufrages.js) : [{ base, nau }]
const CAST_REFONTE = MAITRES.map(m => ({ base: refondu(m, 'propre', false), nau: refondu(m, m.naufrage, true) }));

module.exports = { CAST_REFONTE, MAITRES, DIR, image };
