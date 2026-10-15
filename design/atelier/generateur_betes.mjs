// Le générateur des bêtes, pour le jeu et pour l'outil (generer.mjs) : build_bundle.js en fait un module ESM, publié dans
// la bibliothèque (generateur/betes.mjs). Chaque fonction rend { svg, cadre, ms_par_image } : le SVG complet, identique
// à l'octet au fichier de la bibliothèque (le fichier y ajoute un saut de ligne ; verif_generateurs.mjs le vérifie), son
// cadre, et la vitesse de son animation quand l'image en fait partie. Les bêtes sont nommées comme dans la bibliothèque
// (renard, poule-rousse, koi-or, fennec-de-brume…), leurs poses comme dans les listes (betes_liste.js : marche1, vol2,
// repos…). Les cadres des bêtes orientées et des égarés, mesurés à la génération, viennent des index de la bibliothèque.
import Bt from './betes.js';
import B3 from './betes3.js';
import G from './egares_voile.js';
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
const ORIENTEES = Object.fromEntries(L.ORIENTEES.map(([groupe, dossier, nom, { c, bird, pet, dessin }]) => [hyph(dossier), { nom, groupe, dossier, cadre: orientees.betes[hyph(dossier)].cadre, fiche: c, oiseau: bird, compagnie: !!pet, dessin }]));
// les poses d'une bête orientée : la marche, plus assis et dodo pour les animaux de compagnie
const posesOrientee = (b, vue) => [...(vue === 'avant' ? L.AVANT : L.DOS), ...(b.compagnie ? L.PET : [])];
// Les icônes des bêtes (32 × 32) : nom rangé -> { groupe, dossier, dessin }
const ICONES = Object.fromEntries(L.ICONES.map(([groupe, dossier, dessin]) => [hyph(dossier), { groupe, dossier, dessin }]));
// Les égarés : clé du manifeste -> { nom, cadre, dessin, dossier, poses } (les poses en plus de certains : dort, terre)
const EGARES = Object.fromEntries(L.EGARES.map(([dossier, nom, dessin, , cle, plus]) => [cle, { nom, cadre: egares.egares[cle].cadre, dessin, dossier, poses: { avant: [...G.POSES.avant, ...plus], dos: G.POSES.dos } }]));

// Ce qu'on peut demander : les bêtes de chaque sorte, leurs poses, leurs vues
export const BETES = {
  profil: Object.fromEntries(Object.entries(PROFILS).map(([k, b]) => [k, { nom: b.nom, groupe: b.groupe, cadre: b.cadre, poses: b.poses }])),
  orientees: Object.fromEntries(Object.entries(ORIENTEES).map(([k, b]) => [k, { nom: b.nom, groupe: b.groupe, cadre: b.cadre, poses: { avant: posesOrientee(b, 'avant'), dos: posesOrientee(b, 'dos') } }])),
  egares: Object.fromEntries(Object.entries(EGARES).map(([k, b]) => [k, { nom: b.nom, cadre: b.cadre, poses: b.poses }])),
  icones: Object.keys(ICONES)
};

const prendre = (table, quoi, nom) => { const b = table[nom]; if (!b) throw new Error(`${quoi} : ${nom} (${Object.keys(table).join(', ')})`); return b; };
const dans = (liste, quoi, x) => { if (!liste.includes(x)) throw new Error(`${quoi} inconnue : ${x} (${liste.join(', ')})`); };
const fichierProfil = (b, pose) => N.nomBete(`animaux/${b.groupe}/${b.dossier}/${b.dossier}_${suffixe(pose)}.svg`);
const fichierOrientee = (b, vue, pose) => N.nomBete(`animaux/${b.groupe}/${b.dossier}/${b.dossier}_${vue}_${pose}.svg`);
const fichierEgare = (b, vue, pose) => N.nomBete(`egares/${b.dossier}/${b.dossier}_${vue}_${pose}.svg`);

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
  dans(posesOrientee(b, vue), 'pose', pose);
  const corps = b.dessin ? b.dessin(vue, pose) : (L.PET.includes(pose) ? B3.petPose3 : b.oiseau ? B3.bird3 : B3.quad3)(b.fiche, vue, pose);
  return { svg: svgOf(b.cadre, corps), cadre: b.cadre, ms_par_image: vitesse(fichierOrientee(b, vue, pose)) };
}
// L'icône d'une bête (32 × 32, pour les fiches) : celles de BETES.icones
const ICONE = [0, 0, 32, 32];
export function iconeBete(bete) {
  const b = prendre(ICONES, 'icône inconnue', bete);
  return { svg: svgOf(ICONE, b.dessin()), cadre: ICONE, ms_par_image: null };
}
// Un égaré (sa clé dans egares.json : fantome, zombie, noye, racine, esprit, lapin-de-brume…) : vue 'avant' ou 'dos',
// une de ses poses (BETES.egares[clé].poses)
export function egare(sujet, vue, pose) {
  const b = prendre(EGARES, 'égaré inconnu', sujet);
  dans(Object.keys(b.poses), 'vue', vue);
  dans(b.poses[vue], 'pose', pose);
  return { svg: svgOf(b.cadre, b.dessin(vue, pose)), cadre: b.cadre, ms_par_image: vitesse(fichierEgare(b, vue, pose)) };
}

// Tout ce que la famille sait dessiner, avec le fichier de la bibliothèque qui lui correspond (sous svg/)
export function liste() {
  const out = [];
  for (const [k, b] of Object.entries(PROFILS)) for (const p of b.poses) out.push({ fichier: fichierProfil(b, p), fonction: 'profil', args: [k, p] });
  for (const [k, b] of Object.entries(ORIENTEES)) for (const v of ['avant', 'dos']) for (const p of posesOrientee(b, v)) out.push({ fichier: fichierOrientee(b, v, p), fonction: 'orientee', args: [k, v, p] });
  for (const [k, b] of Object.entries(ICONES)) out.push({ fichier: N.nomBete(`animaux/${b.groupe}/${b.dossier}/${b.dossier}_icone.svg`), fonction: 'iconeBete', args: [k] });
  for (const [k, b] of Object.entries(EGARES)) for (const [v, poses] of Object.entries(b.poses)) for (const p of poses) out.push({ fichier: fichierEgare(b, v, p), fonction: 'egare', args: [k, v, p] });
  return out;
}
