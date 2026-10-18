// La troupe refondue dans la bibliothèque (choix de l'auteur, 16 oct. : les refontes partout où le jeu montrait les
// anciens dessins). Les maîtres et leurs naufragés gardent leurs noms de fichiers (aster, cannelle, rivet, ondin, sylve,
// galet, melisse) : le jeu les charge sans rien changer. Chacun vient de design/personnages/refonte/ : sa tenue de base,
// propre au village, naufragé le jour de son naufrage (<nom>_tenues.js, habiller) ; ses animations (<nom>_anims.js,
// dessiner) pour le repos, la marche, le salut, le geste de son métier, le sommeil ; les gestes communs du kit
// (gestes.js : pêcher, piocher, la lanterne, le parapluie…) se jouent sur son corps refondu.
const { frame } = require('./troupe');
const { enPersonnage } = require('../personnages/couleurs');
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
// (les têtes refondues : la couleur de leur peau, sous les yeux des portraits qui changent de forme)
const MODULES_REFONTE = {
  lorena: require('../personnages/refonte/lorena_refonte'), agathe: require('../personnages/refonte/agathe_refonte'), nathan: require('../personnages/refonte/nathan_refonte'),
  leo: require('../personnages/refonte/leo_refonte'), maerys: require('../personnages/refonte/maerys_refonte'), robby: require('../personnages/refonte/robby_refonte'), maggy: require('../personnages/refonte/maggy_refonte')
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
  // (ses animations à lui : à l'encre des personnages, comme les images du kit)
  const anim = (nom, v, n, expr, cc = c) => enPersonnage(A.dessiner(cc, nom, DIR[v], n, expr));
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

// Les portraits des bulles (personnages/portraits.js : le buste de face, 38 × 38, affiché en 96 px, déclaré × 4) : le
// visage refondu, dans l'expression refondue la plus proche de chaque humeur (choix de l'auteur, 16 oct.), et par-dessus
// les signes des anciens portraits (larmes, cœurs, Zzz, étoiles ; les yeux en étoiles, en cœurs, en spirales), animés
const P = require('../personnages/portraits');
const HUMEURS = {
  neutre: 'veille', content: 'sourire', rire: 'rire', surpris: 'surprise', triste: 'triste', fache: 'colere', gene: 'genee', endormi: 'endormie',
  emu: 'tendresse', effraye: 'peur', boude: 'boude', determine: 'decidee', emerveille: 'emerveillee', adore: 'tendresse', etourdi: 'douleur',
  crocodile: 'sanglot', pensif: 'pensive', malicieux: 'clin', fier: 'ironique', fatigue: 'epuisee', degoute: 'mefiante', soulage: 'soulagee'
};
// la hauteur des yeux de chaque tête refondue (Léo et Robby, plus petits : la tête posée plus bas) ; le cadre s'y cale,
// comme celui des anciens portraits (les yeux à 22,6 sous le haut du cadre)
const YEUX = { lorena: 22.7, agathe: 22.8, nathan: 22.6, leo: 27.7, maerys: 22.8, robby: 26.7, maggy: 22.8 };
// sa géométrie, pour poser les signes (celle de troupe.visageVide)
const geometrie = ey => ({ eyes: [[19.4, ey, 1.7], [28.6, ey, 1.7]], ry: 2.3, mouth: [24, ey + 4.9], mw: 1.7, cheeks: [[16.8, 1.9], [31.2, 1.9]], cheekY: ey + 3.9, temple: [13.4, ey - 10.2], anger: [40, ey - 15.8], zz: [36.4, ey - 16.8] });
const r2 = n => Math.round(n * 100) / 100;
const affiner = (s, k) => s.replace(/stroke-width="([\d.]+)"/g, (m, w) => `stroke-width="${r2(w * k)}"`);
// au neutre, il cligne des yeux (140 ms toutes les 3 s), comme les anciens portraits
const cligne = (ouverts, fermes) => `<g><animate attributeName="opacity" values="1;0;1" keyTimes="0;0.92;0.966" calcMode="discrete" dur="3s" repeatCount="indefinite"/>${ouverts}</g><g opacity="0"><animate attributeName="opacity" values="0;1;0" keyTimes="0;0.92;0.966" calcMode="discrete" dur="3s" repeatCount="indefinite"/>${fermes}</g>`;
// Le portrait d'un maître refondu (c : celui de CAST_REFONTE) dans une humeur ; fixe : sans animation ; rend { svg, cadre }
function portrait(c, humeur = 'neutre', { fixe = false } = {}) {
  const x = HUMEURS[humeur];
  if (!x) throw new Error(`humeur inconnue : ${humeur} (${Object.keys(HUMEURS).join(', ')})`);
  const m = c.refonte.module, ey = YEUX[m], uid = `${m}p${humeur}`;
  const buste = e => affiner(frame({ ...c, uid: `${uid}${e}` }, 'front', 'repos', 0, e), 0.6);
  const peau = (c.pal && c.pal.skin) || MODULES_REFONTE[m].C.skin;
  const { dessus, bouge } = P.signesSur(geometrie(ey), humeur, { fixe, uid, peau });
  // (la copie aux yeux fermés : ses ids à part, certains dessins en ont de fixes)
  const ferme = () => buste('cligne').replace(/id="/g, 'id="f').replace(/url\(#/g, 'url(#f').replace(/href="#/g, 'href="#f');
  const corps = (x === 'veille' && !fixe ? cligne(buste(x), ferme()) : buste(x)) + dessus;
  const cadre = [5, r2(ey - 22.6), 38, 38], cote = P.TAILLE_PORTRAIT * P.HD_PORTRAIT;
  return { svg: `<svg xmlns="http://www.w3.org/2000/svg" width="${cote}" height="${cote}" viewBox="${cadre.join(' ')}"><g>${bouge}${corps}</g></svg>`, cadre };
}

module.exports = { CAST_REFONTE, MAITRES, DIR, image, HUMEURS, portrait };
