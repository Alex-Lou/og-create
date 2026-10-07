// Les groupes d'images du lot M, en un seul endroit : le bâtiment embrumé et sa guérison, le petit nuage, l'icône
// « Réparer », la cage aux poules et l'œuf, le crabe de la Grève, les signes d'Anya, l'éclat du souvenir et les sept
// sceaux. preview_lot_m.mjs les publie (cadres ajustés), le générateur du décor (generateur_decor.mjs) les dessine.
// Chaque groupe : { dir (sous lib/), nom (le fichier, sans numéro), base (le cadre de départ), images : [() => dessin] }.
const M = require('./lot_m');

const n3 = (f, k = 3) => Array.from({ length: k }, (_, i) => () => f(i));
const GROUPES = [];
for (const n of [1, 2, 3]) {
  const a = 40 * n, h = 34 + 40 * n, base = [-a - 14, -h - 14, 2 * a + 28, h + 20 * n + 26];
  GROUPES.push({ dir: 'decor/embrume', nom: `embrume_${n}x${n}`, base, images: n3(f => M.embrume(n, f)) });
  GROUPES.push({ dir: 'decor/embrume', nom: `embrume_${n}x${n}_guerison`, base, images: n3(f => M.guerison(n, f)) });
}
GROUPES.push(
  { dir: 'decor/embrume', nom: 'embrume_nuage', base: [-24, -34, 48, 40], images: n3(f => M.nuage(f)) },
  { dir: 'decor/embrume', nom: 'reparer_icone', base: [0, 0, 32, 32], images: [() => M.reparerIcone()] },
  { dir: 'decor/camp/poules', nom: 'cage_poules_coincee', base: [-50, -50, 100, 72], images: [() => M.cage('coincee', 0), () => M.cage('coincee', 1)] },
  { dir: 'decor/camp/poules', nom: 'cage_poules_ouverte', base: [-50, -50, 100, 72], images: [() => M.cage('ouverte', 0)] },
  { dir: 'decor/camp/poules', nom: 'oeuf', base: [-10, -14, 20, 17], images: [() => M.oeuf()] },
  { dir: 'decor/camp/poules', nom: 'oeuf_icone', base: [0, 0, 32, 32], images: [() => M.oeufIcone()] },
  { dir: 'decor/signes', nom: 'fleurs_ouverture', base: [-30, -40, 60, 50], images: n3(f => M.fleurs(f), 4) },
  { dir: 'decor/signes', nom: 'lucioles_rassemblees', base: [-30, -52, 60, 58], images: n3(f => M.lucioles(f), 4) },
  { dir: 'decor/souvenir', nom: 'eclat', base: [-14, -14, 28, 28], images: n3(f => M.eclat(f), 4) },
  { dir: 'decor/souvenir', nom: 'arrivee', base: [-24, -72, 48, 76], images: n3(f => M.arrivee(f), 5) }
);
for (const [i, [cle]] of M.SCEAUX.entries()) {
  GROUPES.push({ dir: 'decor/souvenir', nom: `sceau_${cle}_eteint`, base: [-15, -15, 30, 30], images: [() => M.sceau(i, false)] });
  GROUPES.push({ dir: 'decor/souvenir', nom: `sceau_${cle}_allume`, base: [-15, -15, 30, 30], images: [0, 1].map(f => () => M.sceau(i, true, f)) });
}
// le crabe de la Grève : un cadre commun à ses cinq poses (des bêtes de profil)
const POSES_CRABE = ['marche1', 'marche2', 'repos', 'clignement', 'joie'];
const CRABE = { dir: 'animaux/mer/crabe', base: [-14, -22, 28, 24], poses: POSES_CRABE, dessin: p => M.crabe(p) };

module.exports = { GROUPES, CRABE };
