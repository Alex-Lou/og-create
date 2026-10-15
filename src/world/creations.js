// Les créations d'île dessinées dans la bibliothèque (design/bibliotheque/svg/decor/creations) : chaque création du jeu
// prend son dessin et son animation (decor.json : fichiers dans l'ordre, ms_par_image), au cadre des décors du jeu
// × 1,25. Les défenses de la nuit (decor/defenses : la torche, allumée) se posent comme elles. Une création que la
// bibliothèque n'a pas garde son dessin par code (craftSprites.js).
import { reactive } from 'vue';
import DECOR from '../../design/bibliotheque/svg/decor/decor.json';
import DEFENSES from '../../design/bibliotheque/svg/decor/defenses/defenses.json';
import { PROP_BOX } from './palette';
import { librarySprite, cropTo, paintedBox, BLANK, frameAt } from './library';

// Chargés à la demande, un fichier à la fois (le jeu ne lit que ce qui est posé sur l'île)
const FILES = import.meta.glob('/design/bibliotheque/svg/decor/{creations,defenses}/*.svg', { query: '?raw', import: 'default' });
const ROOT = '/design/bibliotheque/svg/decor/';
// Le dessin d'une création : { fichiers (chemins sous ROOT), ms_par_image }, ou null. Celui de decor.json, sinon celui
// des défenses (la torche de Nathan, allumée : choix de l'auteur, 13 oct.)
function artOf(id) {
  if (DECOR.creations[id]) return DECOR.creations[id];
  const defense = DEFENSES.defenses[id];
  return defense ? { ...defense.allumee, fichiers: defense.allumee.fichiers.map(f => `defenses/${f}`) } : null;
}
// La lumière de nuit d'une défense de la bibliothèque (sa flamme) : [u, v, z, rayon, couleur], ou null
export function defenseLight(id) {
  const light = DEFENSES.defenses[id] && DEFENSES.defenses[id].lumiere;
  return light ? [light.u, light.v, light.z, light.rayon, light.couleur, ...(light.jour ? [true] : [])] : null;
}

// Lumière de nuit recalée sur le dessin de la bibliothèque (u, v, z du jeu, mesurés sur le dessin) : la flamme de la
// lanterne, la porte de l'igloo. Les autres tombent déjà juste (brasero, fontaine, kiosque, obélisque)
export const ART_LIGHTS = { lanterne: [0, 0, 41], igloo: [0.11, 0.21, 6] };

const makes = new Map();
// Le calque d'une création à l'instant t (secondes) : { key, make }, ou null si la bibliothèque ne l'a pas
export function creationLayer(id, t = 0) {
  const art = artOf(id);
  if (!art) return null;
  const f = frameAt(art, t);
  const path = ROOT + art.fichiers[f];
  if (!FILES[path]) return null;
  if (!makes.has(path)) makes.set(path, librarySprite(FILES[path], PROP_BOX));
  return { key: `creation-${id}-${f}`, make: makes.get(path) };
}

// Vignette d'une création (établi, gabarit, aperçu du Foyer) : la première image de son dessin, recadrée sur ce
// qu'elle peint. Lue et mesurée une fois, à la première demande ; une image vide pendant ce temps (l'ancienne vignette
// ne passe pas en éclair). null si la bibliothèque ne l'a pas ou si la lecture échoue : l'ancienne vignette reste
const started = new Set();
const thumbs = reactive({});
export function creationThumb(id) {
  const art = artOf(id);
  const load = art && FILES[ROOT + art.fichiers[0]];
  if (!load) return null;
  if (!started.has(id)) {
    started.add(id);
    load()
      .then(svg => paintedBox(svg).then(box => cropTo(svg, box)))
      .then(svg => { thumbs[id] = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`; }, () => { thumbs[id] = null; });
  }
  return id in thumbs ? thumbs[id] : BLANK;
}
