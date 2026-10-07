// Le générateur des bêtes, pour le jeu et pour l'outil (generer.mjs) : build_bundle.js en fait un module ESM, publié dans
// la bibliothèque (generateur/betes.mjs). Chaque fonction rend { svg, cadre, ms_par_image } : le SVG complet, identique
// à l'octet au fichier de la bibliothèque (le fichier y ajoute un saut de ligne ; verif_generateurs.mjs le vérifie), son
// cadre, et la vitesse de son animation quand l'image en fait partie. Les bêtes sont nommées comme dans la bibliothèque
// (renard, poule-rousse, koi-or, fennec-de-brume…), leurs poses comme dans les listes (betes_liste.js : marche1, vol2,
// repos…). Les cadres des bêtes orientées et des égarés, mesurés à la génération, viennent des index de la bibliothèque.
import Bt from './betes.js';
import B3 from './betes3.js';
import G from './egares.js';
import L from './betes_liste.js';
import N from './noms_betes.js';
import orientees from '../bibliotheque/svg/animaux/orientees.json' with { type: 'json' };
import egares from '../bibliotheque/svg/egares/egares.json' with { type: 'json' };

const r2 = n => Math.round(n * 100) / 100;
const svgOf = (cadre, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${r2(cadre[2])}" height="${r2(cadre[3])}" viewBox="${cadre.join(' ')}">${body}</svg>`;
const hyph = s => s.replace(/_/g, '-');
// La vitesse d'une image numérotée (elle fait partie d'une animation), d'après son nom rangé
const vitesse = rel => { const m = rel.match(/^(.*)_([a-z]+)_\d+\.svg$/); return m ? N.vitesseBete(m[1], m[2]) ?? null : null; };
const suffixe = p => (/^\d+$/.test(p) ? `image${+p + 1}` : p); // les poses numérotées (méduse, bocal…) : image1, image2…

// Les bêtes de profil : nom rangé -> { nom, groupe, dossier, cadre, poses, dessin }
const PROFILS = Object.fromEntries(L.PROFILS.map(([groupe, dossier, nom, taille, poses, dessin]) => {
  const [x, y, w, h] = Bt.BOX[taille];
  return [hyph(dossier), { nom, groupe, dossier, cadre: [x, y, w, h], poses, dessin }];
}));
// Les bêtes orientées : nom rangé -> { nom, groupe, dossier, cadre, fiche, oiseau }
const ORIENTEES = Object.fromEntries(L.ORIENTEES.map(([groupe, dossier, nom, { c, bird }]) => [hyph(dossier), { nom, groupe, dossier, cadre: orientees.betes[hyph(dossier)].cadre, fiche: c, oiseau: bird }]));
// Les égarés : sujet -> { nom, cadre, dessin }
const EGARES = Object.fromEntries(L.EGARES.map(([sujet, nom, dessin]) => [sujet, { nom, cadre: egares.egares[sujet].cadre, dessin }]));

// Ce qu'on peut demander : les bêtes de chaque sorte, leurs poses, leurs vues
export const BETES = {
  profil: Object.fromEntries(Object.entries(PROFILS).map(([k, b]) => [k, { nom: b.nom, groupe: b.groupe, cadre: b.cadre, poses: b.poses }])),
  orientees: Object.fromEntries(Object.entries(ORIENTEES).map(([k, b]) => [k, { nom: b.nom, groupe: b.groupe, cadre: b.cadre, poses: { avant: L.AVANT, dos: L.DOS } }])),
  egares: Object.fromEntries(Object.entries(EGARES).map(([k, b]) => [k, { nom: b.nom, cadre: b.cadre, poses: G.POSES }]))
};

const prendre = (table, quoi, nom) => { const b = table[nom]; if (!b) throw new Error(`${quoi} : ${nom} (${Object.keys(table).join(', ')})`); return b; };
const dans = (liste, quoi, x) => { if (!liste.includes(x)) throw new Error(`${quoi} inconnue : ${x} (${liste.join(', ')})`); };
const fichierProfil = (b, pose) => N.nomBete(`animaux/${b.groupe}/${b.dossier}/${b.dossier}_${suffixe(pose)}.svg`);
const fichierOrientee = (b, vue, pose) => N.nomBete(`animaux/${b.groupe}/${b.dossier}/${b.dossier}_${vue}_${pose}.svg`);
const fichierEgare = (sujet, vue, pose) => N.nomBete(`egares/${sujet}/${sujet}_${vue}_${pose}.svg`);

// Une bête de profil, tournée vers la droite (le miroir donne la gauche)
export function profil(bete, pose) {
  const b = prendre(PROFILS, 'bête inconnue', bete);
  dans(b.poses, 'pose', pose);
  const f = fichierProfil(b, pose);
  // le bocal n'a pas de pose dans son nom (bocal-bulle_1) : la vitesse de sa rubrique, s'il s'anime
  const ms = vitesse(f) ?? (/^\d+$/.test(pose) && b.poses.length > 1 ? N.vitesseBete(f) ?? null : null);
  return { svg: svgOf(b.cadre, b.dessin(pose)), cadre: b.cadre, ms_par_image: ms };
}
// Une bête orientée : vue 'avant' (trois quarts avant) ou 'dos' (trois quarts dos)
export function orientee(bete, vue, pose) {
  const b = prendre(ORIENTEES, 'bête inconnue', bete);
  dans(['avant', 'dos'], 'vue', vue);
  dans(vue === 'avant' ? L.AVANT : L.DOS, 'pose', pose);
  return { svg: svgOf(b.cadre, (b.oiseau ? B3.bird3 : B3.quad3)(b.fiche, vue, pose)), cadre: b.cadre, ms_par_image: vitesse(fichierOrientee(b, vue, pose)) };
}
// Un égaré : vue 'avant' ou 'dos', pose de G.POSES
export function egare(sujet, vue, pose) {
  const b = prendre(EGARES, 'égaré inconnu', sujet);
  dans(Object.keys(G.POSES), 'vue', vue);
  dans(G.POSES[vue], 'pose', pose);
  return { svg: svgOf(b.cadre, b.dessin(vue, pose)), cadre: b.cadre, ms_par_image: vitesse(fichierEgare(sujet, vue, pose)) };
}

// Tout ce que la famille sait dessiner, avec le fichier de la bibliothèque qui lui correspond (sous svg/)
export function liste() {
  const out = [];
  for (const [k, b] of Object.entries(PROFILS)) for (const p of b.poses) out.push({ fichier: fichierProfil(b, p), fonction: 'profil', args: [k, p] });
  for (const [k, b] of Object.entries(ORIENTEES)) for (const [v, poses] of [['avant', L.AVANT], ['dos', L.DOS]]) for (const p of poses) out.push({ fichier: fichierOrientee(b, v, p), fonction: 'orientee', args: [k, v, p] });
  for (const k of Object.keys(EGARES)) for (const [v, poses] of Object.entries(G.POSES)) for (const p of poses) out.push({ fichier: fichierEgare(k, v, p), fonction: 'egare', args: [k, v, p] });
  return out;
}
