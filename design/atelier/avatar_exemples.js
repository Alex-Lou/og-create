// Les exemples d'avatar de la bibliothèque et leurs poses (une seule source pour preview_avatar.mjs et le générateur des
// exemples, generateur_exemples.mjs) : douze exemples, qui couvrent ensemble les formes, les nuanciers et des
// accessoires de chaque emplacement, deux en tenue de saison (sur les planches seulement), les poses de la troupe et
// les gestes.
const { frame } = require('./troupe.js');
const { assis } = require('./assis.js');
const { tendre, avecMainsTendues, applaudir, avecApplaudir, avecPecher, avecPiocher, avecCueillir, avecArroser, avecBecher, avecPorter, reparer, avecReparer, avecRepousser, ecrire, avecEcrire } = require('./gestes.js');

const ac = (place, id, couleurs) => ({ [place]: couleurs ? { id, couleurs } : { id } });

// Douze exemples, qui couvrent ensemble les formes, les nuanciers et des accessoires de chaque emplacement ; puis deux
// en tenue de saison (l'hiver, la pluie), sur les planches seulement : le jeu prend chaque exemple de la bibliothèque
// pour un avatar à choisir, avec sa tenue naufragée (src/game/sceneArt.js), et la mer prend les tenues de saison
const EXEMPLES = [
  {},
  { taille: 'petite', silhouette: 'fine', coupe: 'deuxChignons', cheveux: 'bonbon', cils: 'recourbes', levres: 'rose', formeYeux: 'grands', haut: 'tshirt', couleurHaut: 'creme', bas: 'robe', couleurBas: 'framboise', chaussures: 'blanc', accessoires: { ...ac('joues', 'coeurs'), ...ac('cheveux', 'noeud', ['blanc']) } },
  { taille: 'grande', silhouette: 'large', coupe: 'bouclee', cheveux: 'jais', peau: 'cacao', visage: 'ovale', sourcils: 'epais', bouche: 'serieuse', haut: 'chemise', couleurHaut: 'ciel', couleurBas: 'sable', accessoires: { ...ac('visage', 'lunettesRondes', ['or']), ...ac('dos', 'besace') } },
  { coupe: 'queueCote', cheveux: 'platine', peau: 'nacre', yeux: 'azur', formeYeux: 'amande', cils: 'legers', grain: 'levre', haut: 'veste', couleurHaut: 'marine', bas: 'jupe', couleurBas: 'rosepale', accessoires: { ...ac('tete', 'paille', ['framboise']), ...ac('oreilles', 'pendantsEtoile') } },
  { coupe: 'locks', cheveux: 'noir', peau: 'cannelle', yeux: 'noisette', formeYeux: 'rieurs', bouche: 'sourire', haut: 'tshirt', couleurHaut: 'soleil', bas: 'short', couleurBas: 'olive', chaussures: 'rouge', accessoires: { ...ac('tete', 'bandana', ['lagon']), ...ac('dos', 'sacDos') } },
  { silhouette: 'ronde', coupe: 'chignon', cheveux: 'nuit', peau: 'miel', formeYeux: 'paisibles', sourcils: 'doux', levres: 'prune', haut: 'pull', couleurHaut: 'lavande', bas: 'robe', couleurBas: 'creme', accessoires: { ...ac('tete', 'couronneFleurs', ['rose']), ...ac('cou', 'perles') } },
  { taille: 'grande', silhouette: 'large', coupe: 'rasee', cheveux: 'gris', peau: 'ebene', visage: 'carre', yeux: 'grisbleu', bouche: 'malice', haut: 'sweat', couleurHaut: 'foret', couleurBas: 'noir', accessoires: { ...ac('tete', 'casquette', ['rouge']), ...ac('oreilles', 'anneaux', ['argent']) } },
  { taille: 'petite', coupe: 'meche', cheveux: 'blanc', meches: 'meches', couleurMeches: 'ciel', sourcils: 'epais', joues: 'discretes', haut: 'pull', couleurHaut: 'creme', couleurBas: 'bordeaux', chaussures: 'jean', accessoires: { ...ac('tete', 'bonnet', ['rouge']), ...ac('cou', 'echarpe', ['rouge', 'creme']) } },
  { coupe: 'carre', cheveux: 'chocolat', peau: 'doree', visage: 'ovale', formeYeux: 'amande', cils: 'recourbes', levres: 'framboise', haut: 'mariniere', couleurHaut: 'marine', bas: 'jupe', couleurBas: 'rouge', chaussures: 'noir', accessoires: { ...ac('visage', 'lunettesPapillon', ['noir']), ...ac('oreilles', 'puces') } },
  { taille: 'petite', coupe: 'bataille', cheveux: 'cuivre', peau: 'rosee', rousseur: 'oui', formeYeux: 'grands', bouche: 'malice', haut: 'sweat', couleurHaut: 'abricot', bas: 'short', couleurBas: 'charbon', accessoires: { ...ac('tete', 'oreillesChat', ['cuir']), ...ac('joues', 'pansement') } },
  { taille: 'grande', silhouette: 'fine', coupe: 'ondulee', cheveux: 'lilas', meches: 'pointes', couleurMeches: 'menthe', peau: 'bronze', yeux: 'violet', cils: 'legers', haut: 'chemise', couleurHaut: 'blanc', bas: 'robe', couleurBas: 'lavande', chaussures: 'creme', accessoires: { ...ac('dos', 'ailes', ['menthe']), ...ac('cheveux', 'barrettes', ['nacre']) } },
  { silhouette: 'ronde', coupe: 'couronne', cheveux: 'roux', peau: 'porcelaine', rousseur: 'legere', yeux: 'vert', formeYeux: 'rieurs', haut: 'mariniere', couleurHaut: 'rouge', bas: 'salopette', couleurBas: 'jean', accessoires: { ...ac('main', 'peluche'), ...ac('cou', 'papillon', ['soleil']) } },
  { coupe: 'deuxChignons', cheveux: 'chatain', peau: 'rosee', formeYeux: 'grands', haut: 'pull', couleurHaut: 'creme', bas: 'pantalon', couleurBas: 'jean',
    accessoires: { ...ac('tete', 'bonnet', ['rouge']), ...ac('cou', 'echarpe'), ...ac('dessus', 'manteau'), ...ac('pieds', 'bottesFourrees'), ...ac('mains', 'moufles') } },
  { taille: 'petite', coupe: 'couettes', cheveux: 'roux', rousseur: 'oui', yeux: 'vert', bouche: 'sourire', haut: 'mariniere', couleurHaut: 'marine', bas: 'short', couleurBas: 'jean',
    accessoires: { ...ac('dessus', 'cire'), ...ac('pieds', 'bottesPluie') } }
];
const nom = i => `avatar-${String(i + 1).padStart(2, '0')}`;

// Poses de la troupe et gestes du tutoriel (et les expressions pour le premier exemple)
const POSES = [['face_repos', 'front', 'repos', 2], ['avant_marche', 'se', 'marche', 4], ['dos_marche', 'ne', 'marche', 4], ['face_salut', 'front', 'salut', 2],
  ['avant_ramasser', 'se', 'action', 2, 'ramasser'], ['face_grelotter', 'front', 'action', 2, 'grelotter'], ['face_lire', 'front', 'action', 2, 'lire'],
  ['face_assis', 'front', 'assis', 2], ['avant_assis', 'se', 'assis', 2], ['dos_assis', 'ne', 'assis', 2],
  ['face_mains-tendues', 'front', 'tendre', 2], ['avant_mains-tendues', 'se', 'tendre', 2], ['dos_mains-tendues', 'ne', 'tendre', 2],
  ['face_assis-mains-tendues', 'front', 'assis-tendre', 2], ['avant_assis-mains-tendues', 'se', 'assis-tendre', 2], ['dos_assis-mains-tendues', 'ne', 'assis-tendre', 2],
  ['face_applaudir', 'front', 'applaudir', 2], ['avant_applaudir', 'se', 'applaudir', 2], ['dos_applaudir', 'ne', 'applaudir', 2],
  ['face_assis-applaudir', 'front', 'assis-applaudir', 2], ['avant_assis-applaudir', 'se', 'assis-applaudir', 2], ['dos_assis-applaudir', 'ne', 'assis-applaudir', 2],
  ['face_pecher', 'front', 'pecher', 2], ['avant_pecher', 'se', 'pecher', 2], ['dos_pecher', 'ne', 'pecher', 2],
  ['face_piocher', 'front', 'piocher', 2], ['avant_piocher', 'se', 'piocher', 2], ['dos_piocher', 'ne', 'piocher', 2],
  ['face_cueillir', 'front', 'cueillir', 2], ['avant_cueillir', 'se', 'cueillir', 2], ['dos_cueillir', 'ne', 'cueillir', 2],
  ['face_arroser', 'front', 'arroser', 2], ['avant_arroser', 'se', 'arroser', 2], ['dos_arroser', 'ne', 'arroser', 2],
  ['face_becher', 'front', 'becher', 2], ['avant_becher', 'se', 'becher', 2], ['dos_becher', 'ne', 'becher', 2],
  ['face_porter', 'front', 'porter', 2], ['avant_porter', 'se', 'porter', 2], ['dos_porter', 'ne', 'porter', 2],
  ['face_reparer', 'front', 'reparer', 2], ['avant_reparer', 'se', 'reparer', 2], ['dos_reparer', 'ne', 'reparer', 2],
  ['face_assis-reparer', 'front', 'assis-reparer', 2], ['avant_assis-reparer', 'se', 'assis-reparer', 2], ['dos_assis-reparer', 'ne', 'assis-reparer', 2],
  ['face_repousser', 'front', 'repousser', 2], ['avant_repousser', 'se', 'repousser', 2], ['dos_repousser', 'ne', 'repousser', 2],
  ['face_ecrire', 'front', 'ecrire', 2], ['avant_ecrire', 'se', 'ecrire', 2], ['dos_ecrire', 'ne', 'ecrire', 2],
  ['face_assis-ecrire', 'front', 'assis-ecrire', 2], ['avant_assis-ecrire', 'se', 'assis-ecrire', 2], ['dos_assis-ecrire', 'ne', 'assis-ecrire', 2]];
// une image d'une pose : celles du kit, assis, et les gestes de la veillée (debout ou assis)
const dessin = (cc, view, p, n) => p === 'assis' ? assis(cc, view, n) : p === 'assis-tendre' ? assis(cc, view, n, null, tendre)
  : p === 'assis-applaudir' ? assis(cc, view, n, null, applaudir) : p === 'tendre' ? frame(avecMainsTendues(cc), view, 'action', n)
  : p === 'applaudir' ? frame(avecApplaudir(cc), view, 'action', n) : p === 'pecher' ? frame(avecPecher(cc), view, 'action', n) : p === 'piocher' ? frame(avecPiocher(cc), view, 'action', n) : p === 'cueillir' ? frame(avecCueillir(cc), view, 'action', n) : p === 'arroser' ? frame(avecArroser(cc), view, 'action', n) : p === 'becher' ? frame(avecBecher(cc), view, 'action', n) : p === 'porter' ? frame(avecPorter(cc), view, 'action', n) : p === 'reparer' ? frame(avecReparer(cc), view, 'action', n) : p === 'repousser' ? frame(avecRepousser(cc), view, 'action', n) : p === 'ecrire' ? frame(avecEcrire(cc), view, 'action', n)
  : p === 'assis-reparer' ? assis(cc, view, n, null, reparer) : p === 'assis-ecrire' ? assis(cc, view, n, null, ecrire) : frame(cc, view, p, n);

module.exports = { ac, EXEMPLES, nom, POSES, dessin };
