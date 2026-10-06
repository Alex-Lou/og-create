// Les créations d'île dessinées dans la bibliothèque (design/bibliotheque/svg/decor/creations) : chaque création du jeu
// prend son dessin et son animation (decor.json : fichiers dans l'ordre, ms_par_image), au cadre des décors du jeu
// × 1,25. Une création que la bibliothèque n'a pas garde son dessin par code (craftSprites.js).
import DECOR from '../../design/bibliotheque/svg/decor/decor.json';
import { PROP_BOX } from './palette';
import { librarySprite } from './library';

// Chargés à la demande, un fichier à la fois (le jeu ne lit que ce qui est posé sur l'île)
const FILES = import.meta.glob('/design/bibliotheque/svg/decor/creations/*.svg', { query: '?raw', import: 'default' });
const ROOT = '/design/bibliotheque/svg/decor/';

// Lumière de nuit recalée sur le dessin de la bibliothèque (u, v, z du jeu, mesurés sur le dessin) : la flamme de la
// lanterne, la porte de l'igloo. Les autres tombent déjà juste (brasero, fontaine, kiosque, obélisque)
export const ART_LIGHTS = { lanterne: [0, 0, 41], igloo: [0.11, 0.21, 6] };

// L'image d'une animation à l'instant t (secondes) : ms_par_image est une durée, ou une durée par image
function frameAt(art, t) {
  const n = art.fichiers.length;
  if (n < 2) return 0;
  const durations = Array.isArray(art.ms_par_image) ? art.ms_par_image : Array(n).fill(art.ms_par_image);
  let r = (t * 1000) % durations.reduce((a, b) => a + b, 0);
  for (let f = 0; f < n; f++) {
    if (r < durations[f]) return f;
    r -= durations[f];
  }
  return n - 1;
}

const makes = new Map();
// Le calque d'une création à l'instant t (secondes) : { key, make }, ou null si la bibliothèque ne l'a pas
export function creationLayer(id, t = 0) {
  const art = DECOR.creations[id];
  if (!art) return null;
  const f = frameAt(art, t);
  const path = ROOT + art.fichiers[f];
  if (!FILES[path]) return null;
  if (!makes.has(path)) makes.set(path, librarySprite(FILES[path], PROP_BOX));
  return { key: `creation-${id}-${f}`, make: makes.get(path) };
}
