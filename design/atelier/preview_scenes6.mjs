// Lot J2 : les scènes plein écran du tutoriel v6 (scenes6.js). Pour chaque scène, ses calques en SVG 400 × 400 dans
// lib/scenes/tutoriel/<id>/ : <id>_fond_<n> (derrière l'avatar) et <id>_devant_<n> (devant lui, s'il y en a) ; l'index
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
  'Les scènes plein écran du tutoriel v6 (HISTOIRE.md § 9), dans le carré 400 × 400 de PrologueArt (preserveAspectRatio="xMidYMid slice" : le sujet reste au milieu). Chaque scène a un fond (derrière l\'avatar) et parfois un devant (ce qui passe devant lui : pluie, brume, Brume quand elle s\'approche) ; ses images tournent en boucle à ms_par_image. Les répliques, le nom du joueur et la légende ne sont pas dessinés : le jeu les écrit.',
  'L\'avatar n\'est pas dessiné : le jeu pose entre le fond et le devant l\'avatar du joueur (design/bibliotheque/svg/personnages/avatar, ou son générateur), à la place notée dans « avatar » : ses pieds en (x, y) du carré, le cadre 48 × 64 de l\'avatar agrandi « echelle » fois ; « vue » face, avant (trois quarts avant, regarde vers la droite) ou dos (trois quarts dos, regarde vers le haut à droite) ; « miroir » : retourné, il regarde vers la gauche ; « pose » repos, salut ou grelotter (le geste de face) ; « naufrage » : sa tenue naufragée (jusqu\'au Campement) ou sa tenue de croisière ; « cadre » (la carte d\'embarquement) : l\'avatar n\'est visible que dans ce rectangle, la photo. Ses images suivent celles de la scène (image n de la scène → image n de l\'avatar, en boucle). « avatar » vaut null quand il n\'est pas à l\'écran.',
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
  if (sc.devant) calques.devant = { nom: `${nom} (devant l'avatar)`, fichiers: fichiers('devant') };
  index.scenes[id] = { nom, etape, cadre: [0, 0, W, W], images: n, ms_par_image: sc.ms, avatar: sc.avatar, calques };

  // la planche et la page animée : les calques et l'avatar d'exemple, dans l'ordre du jeu
  const images = Array.from({ length: n }, (_, f) => unique(sc.fond(f) + avatarPose(sc.avatar, f, `${id}${f}`) + (sc.devant ? sc.devant(f) : '')));
  parties[+id.slice(0, 2) >= 5 ? 1 : 0].push(row(`${etape} — ${sc.titre}`, images.map((b, f) => [svgOf(b, 0.46), `image ${f + 1}`])));
  anim.push({ label: `${etape} — ${sc.titre}`, frames: images.map(b => svgOf(unique(b), 0.6)), timings: [sc.ms], w: r2(W * 0.6), h: r2(W * 0.6) });
}
write(path.join(LIB, 'scenes.json'), JSON.stringify(index, null, 1));

write(path.join(DIR, 'scenes_apercu.html'), animated('Les scènes du tutoriel', 'Les 28 scènes plein écran du tutoriel v6, en boucle, avec un avatar d\'exemple posé à sa place (le jeu y pose celui du joueur).', [['Tutoriel v6', anim]]));
const sous = 'Le fond, l\'avatar d\'exemple à sa place, puis le devant ; carré 400 × 400 (PrologueArt).';
await shoot([
  [path.join(PNG, 'scenes_tutoriel_1.png'), sheet('Les scènes du tutoriel (1) : la carte, le naufrage, Brume, le Grimoire', sous, parties[0]), 1100],
  [path.join(PNG, 'scenes_tutoriel_2.png'), sheet('Les scènes du tutoriel (2) : le feu, les camarades, la veillée', sous, parties[1]), 1100]
]);
console.log('ok', count, 'SVG,', Object.keys(SCENES).length, 'scènes');
