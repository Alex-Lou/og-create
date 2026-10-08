// Le camp des naufragés dessiné dans la bibliothèque (design/bibliotheque/svg/decor/camp, camp.json) : l'épave de
// l'Hirondelle, les coins des maîtres (débris, abri, cabanon), la tente et le hamac des voyageurs, les objets. Le
// serveur dit quoi poser et où (state.camp : { art, x, y, w, h }) ; chaque dessin est au cadre du jeu × 1,25, ancré au
// centre de son emprise au sol (2 × 2 ou 1 case).
import CAMP from '../../design/bibliotheque/svg/decor/camp/camp.json';
import { librarySprite, frameAt } from './library';

const FILES = import.meta.glob('/design/bibliotheque/svg/decor/camp/**/*.svg', { query: '?raw', import: 'default' });
const ROOT = '/design/bibliotheque/svg/decor/camp/';
const SCALE = 1.25;
const boxOf = ([x, y, w, h]) => ({ x: x / SCALE, y: y / SCALE, w: w / SCALE, h: h / SCALE });

const makes = new Map();
// Le calque d'un dessin du camp à l'instant t (secondes) : { key, make }, ou null si la bibliothèque ne l'a pas
export function campLayer(art, t = 0) {
  const entry = CAMP.objets[art];
  if (!entry) return null;
  const f = frameAt({ fichiers: entry.fichiers, ms_par_image: entry.ms || 1000 }, t);
  const path = ROOT + entry.fichiers[f];
  if (!FILES[path]) return null;
  if (!makes.has(path)) makes.set(path, librarySprite(FILES[path], boxOf(entry.cadre)));
  return { key: `camp-${art}-${f}`, make: makes.get(path) };
}

// Son nom (« Épave de l'Hirondelle », « Aster · abri »…), pour la bulle au toucher
export const campName = art => (CAMP.objets[art] && CAMP.objets[art].nom) || '';
