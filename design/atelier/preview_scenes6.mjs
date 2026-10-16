// Lot J2 : les scènes plein écran du tutoriel v6 (scenes6.js). Pour chaque scène, ses calques en SVG 400 × 400 dans
// lib/scenes/tutoriel/<id>/ : <id>_fond_<n> (derrière l'avatar), <id>_anime_<n> (ce qui vit par-dessus le fond figé d'une
// scène lourde, s'il y en a) et <id>_devant_<n> (devant l'avatar, s'il y en a) ; l'index
// scenes.json donne l'étape, la vitesse et la place de l'avatar. Deux planches et une page animée montrent les scènes avec
// un avatar d'exemple posé à sa place (le jeu y pose celui du joueur). Les fichiers sortent du générateur des scènes
// (generateur_scenes.mjs) : le jeu dessine les mêmes.
import path from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { scene } from './generateur_scenes.mjs';

const require = createRequire(import.meta.url);
const DIR = path.dirname(fileURLToPath(import.meta.url));
const { unique, row, sheet, animated, write, shoot } = require('./planche.js');
const { SCENES, W } = require('./scenes6.js');
const { frame } = require('./troupe');
const { avatar } = require('../personnages/avatar.js');
const { avatarNaufrage } = require('./avatar_naufrage.js');
const LIB = path.join(DIR, 'lib', 'scenes', 'tutoriel');
const PNG = path.join(DIR, 'planches');
const r2 = n => Math.round(n * 100) / 100;
const svgOf = (body, s = 1) => `<svg xmlns="http://www.w3.org/2000/svg" width="${r2(W * s)}" height="${r2(W * s)}" viewBox="0 0 ${W} ${W}">${body}</svg>`;

// L'avatar d'exemple des planches (celui de l'essai) : le jeu pose à sa place l'avatar du joueur
const EXEMPLE = { taille: 'moyenne', coupe: 'queueCote', cheveux: 'chocolat', haut: 'tshirt', couleurHaut: 'soleil', bas: 'pantalon', couleurBas: 'jean' };
const VUE = { face: 'front', avant: 'se', dos: 'ne' };
const GESTES = new Set(['grelotter', 'lire', 'ramasser']);
function avatarPose(a, f, uid) {
  if (!a) return '';
  const opts = { uid, geste: GESTES.has(a.pose) ? a.pose : undefined };
  const c = a.naufrage ? avatarNaufrage(EXEMPLE, opts) : avatar(EXEMPLE, opts);
  const corps = frame(c, VUE[a.vue], opts.geste ? 'action' : a.pose, f % 2);
  // le trois quarts avant du kit regarde à gauche : la bibliothèque le publie en miroir (« avant » regarde à droite)
  const m = (a.vue === 'avant' ? -1 : 1) * (a.miroir ? -1 : 1), s = a.echelle;
  let g = `<g transform="translate(${r2(a.x - 24 * s * m)} ${r2(a.y - 62 * s)}) scale(${r2(s * m)} ${r2(s)})">${corps}</g>`;
  if (a.cadre) { const [x, y, w, h] = a.cadre; g = `<defs><clipPath id="photo${uid}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4"/></clipPath></defs><g clip-path="url(#photo${uid})">${g}</g>`; }
  return g;
}

const index = { _lisez_moi: [
  'Les scènes plein écran du tutoriel v6 (HISTOIRE.md § 9), dans le carré 400 × 400 de PrologueArt (preserveAspectRatio="xMidYMid slice" : le sujet reste au milieu). Chaque scène a un fond (derrière l\'avatar) et parfois un devant (ce qui passe devant lui : pluie, brume, Brume quand elle s\'approche) . Les scènes 00 à 06 sont en animation continue : une seule image par calque (images = 1), qui bouge d\'elle-même (SMIL, dans le SVG : à afficher en <img> ou en <object>, jamais en dessin figé) ; ses mouvements d\'entrée (le tampon, la vague, le gilet, Brume qui approche, le vent, le feu qui prend) se jouent une fois quand le SVG s\'affiche. Les scènes 07 à 12 ont plusieurs images, qui tournent en boucle à ms_par_image. Les répliques, le nom du joueur et la légende ne sont pas dessinés : le jeu les écrit.',
  'L\'avatar n\'est pas dessiné : le jeu pose entre le fond et le devant l\'avatar du joueur (design/bibliotheque/svg/personnages/avatar, ou son générateur), à la place notée dans « avatar » : ses pieds en (x, y) du carré, le cadre 48 × 64 de l\'avatar agrandi « echelle » fois ; « vue » face, avant (trois quarts avant, regarde vers la droite) ou dos (trois quarts dos, regarde vers le haut à droite) ; « miroir » : retourné, il regarde vers la gauche ; « pose » repos, salut ou grelotter (le geste de face) ; « naufrage » : sa tenue naufragée (jusqu\'au Campement) ou sa tenue de croisière ; « cadre » (la carte d\'embarquement) : l\'avatar n\'est visible que dans ce rectangle, la photo. Quand la scène a plusieurs images, celles de l\'avatar les suivent (image n de la scène → image n de l\'avatar, en boucle). Quand elle n\'en a qu\'une (animation continue), l\'avatar tourne seul ses images à ms_par_image (320 ms pour grelotter, 900 ms au repos : c\'est la scène qui est fluide, l\'avatar reste calme). « avatar » vaut null quand il n\'est pas à l\'écran.',
  'Les scènes lourdes (demande de l\'auteur du 16 oct. : 30_phare_porte, 12_veillee, 12_veillee_longuevue, 12_habits, 01_racines, 01_paupieres, 05_feu, 01_pont, 05_cercle, 03_livre, 06_silhouette, 01_carte, 02_rocher) : le jeu peint chaque scène une seule fois, figée et nette, pour qu\'elle reste fluide sur téléphone. Leur fond n\'a plus aucune animation : il est posé dans son état final (le feu pris, les yeux ouverts sur la plage, la carte de près, le livre sur le sable ; les racines, elles, avant le noir). Leur calque « anime », transparent, au même cadre 400 × 400, ne garde que l\'essentiel vivant (la flamme, Brume et sa lueur, quelques lucioles, étincelles ou poussières de lumière), au plus 30 animations en boucle, sans filtre ; le jeu le joue tel quel entre le fond et l\'avatar (design/atelier/figer.js).',
  'Le papier découpé (choix de l\'auteur, 16 oct. : l\'effet de la porte du phare, partout) : une scène refaite en pièces de papier coupées aux ciseaux, ses plans posés les uns sur les autres avec leur ombre, ses personnages en marionnettes (design/atelier/papier.js) porte « camera » : true ; le jeu s\'y avance alors lentement, en recadrant dans le carré (SceneArt). Refaites : 12_veillee, 12_veillee_longuevue, 12_habits (le camp des naufragés, veillee_papier.js).',
  'Les images de l\'ouverture (demande de l\'auteur du 15 oct. : ecriture/lots/01_ouverture.md § 2, 02_tutoriel.md § 1), en animation continue elles aussi, au niveau Final Fantasy Tactics / Pokémon HGSS : 01_racines (sous la surface, les racines dans le faisceau d\'un projecteur qui tangue ; trois secondes, puis le noir), 01_paupieres (vue subjective : les paupières battent deux fois, le flou, puis la plage au couchant), 01_carte (vue subjective : une tache blanche au loin, puis la carte d\'embarquement trempée ; elle remplace 01_gilet dans l\'ouverture), 02_plage (l\'avatar de dos face à la mer, au couchant ; du sable devant lui pour « Avancer »), 03_ciel (Brume lève les yeux ; la nuit tombe, sans étoile encore), 05_cercle (de nuit, le cercle de pierres noircies, Brume au-dessus ; au large, l\'épave dans la brume), 10_epave (le premier matin, gris et doux : l\'épave contre les rochers, Hermine qui nage vers la plage). Le sujet tient au milieu du carré : sur un téléphone en hauteur, le jeu n\'en montre que la bande x ≈ 108 à 292.',
  'La rencontre (rencontre.js), refaite au même niveau : 02_lueur (une lueur pâle erre dans la brume, s\'arrête, repart), 02_approche (elle fond sur l\'avatar, la brume s\'écarte ; tout près, elle penche la tête et l\'examine), 02_rocher (elle bondit par-dessus un rocher, retombe derrière et passe la tête ; « T\'approcher » vise ses yeux), 03_livre (elle tire par à-coups le livre aux sept sceaux d\'un creux du rocher ; il tombe sur le sable, entre l\'avatar et le rocher, et ses sceaux luisent tour à tour). L\'heure suit le récit : le soleil vient de se coucher (02_plage), le ciel se refroidit d\'une scène à l\'autre jusqu\'à l\'heure bleue du vent (03_vent), puis la nuit tombe (03_ciel).',
  'Étapes : 00_carte (0a-0b : l\'écran d\'avatar ; la photo se compose dans le cadre, le nom s\'écrit sur la ligne « Nom »), 00_tampon (0c), 01 le naufrage, 02 Brume, 03 le Grimoire (3b à 3d sont dans le Grimoire lui-même), 05_feu (5d), 06_silhouette (6h, fin de la partie 1), 07 Cannelle, 09_rivet, 10_aster, 11 Ondin, 12 la veillée (12k, 12l : Cannelle tend à l\'avatar ses habits recousus, le jeu passe ensuite l\'avatar en tenue). Les autres temps du tutoriel se jouent sur l\'île.'
], scenes: {} };

let count = 0;
const parties = [[], []], anim = [];
for (const [id, sc] of Object.entries(SCENES)) {
  const etape = sc.etapes.join(', ');
  const nom = `Scène ${etape} : ${sc.titre}`;
  const n = sc.images;
  const fichiers = calque => Array.from({ length: n }, (_, f) => {
    const rel = `${id}/${id}_${calque}_${f + 1}.svg`;
    write(path.join(LIB, rel), scene(id, calque, f + 1).svg); count++;
    return rel;
  });
  const calques = { fond: { nom: `${nom} (fond)`, fichiers: fichiers('fond') } };
  if (sc.anime) calques.anime = { nom: `${nom} (ce qui vit sur le fond figé)`, fichiers: fichiers('anime') };
  if (sc.devant) calques.devant = { nom: `${nom} (devant l'avatar)`, fichiers: fichiers('devant') };
  index.scenes[id] = { nom, etape, cadre: [0, 0, W, W], images: n, ms_par_image: sc.ms, avatar: sc.avatar, ...(sc.camera ? { camera: true } : {}), calques };

  // la planche et la page animée : les calques et l'avatar d'exemple, dans l'ordre du jeu
  const images = Array.from({ length: n }, (_, f) => unique(sc.fond(f) + (sc.anime ? sc.anime(f) : '') + avatarPose(sc.avatar, f, `${id}${f}`) + (sc.devant ? sc.devant(f) : '')));
  parties[+id.slice(0, 2) >= 5 ? 1 : 0].push(row(`${etape} — ${sc.titre}`, images.map((b, f) => [svgOf(b, 0.46), `image ${f + 1}`])));
  anim.push({ label: `${etape} — ${sc.titre}`, frames: images.map(b => svgOf(unique(b), 0.6)), timings: [sc.ms], w: r2(W * 0.6), h: r2(W * 0.6) });
}
write(path.join(LIB, 'scenes.json'), JSON.stringify(index, null, 1));

write(path.join(DIR, 'scenes_apercu.html'), animated('Les scènes du tutoriel', `Les ${Object.keys(SCENES).length} scènes plein écran du tutoriel v6 (00 à 06 et les images de l'ouverture en animation continue), en boucle, avec un avatar d'exemple posé à sa place (le jeu y pose celui du joueur).`, [['Tutoriel v6', anim]]));
const sous = 'Le fond, ce qui vit dessus, l\'avatar d\'exemple à sa place, puis le devant ; carré 400 × 400 (PrologueArt).';
await shoot([
  [path.join(PNG, 'scenes_tutoriel_1.png'), sheet('Les scènes du tutoriel (1) : la carte, le naufrage, Brume, le Grimoire', sous, parties[0]), 1100],
  [path.join(PNG, 'scenes_tutoriel_2.png'), sheet('Les scènes du tutoriel (2) : le feu, les camarades, la veillée', sous, parties[1]), 1100]
]);
console.log('ok', count, 'SVG,', Object.keys(SCENES).length, 'scènes');
