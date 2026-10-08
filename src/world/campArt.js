// Le camp des naufragés dessiné dans la bibliothèque (design/bibliotheque/svg/decor/camp, camp.json) : l'épave de
// l'Hirondelle, les coins des maîtres (débris, abri, cabanon), la tente et le hamac des voyageurs, les objets. Le
// serveur dit quoi poser et où (state.camp : { art, x, y, w, h }) ; chaque dessin est au cadre du jeu × 1,25, ancré au
// centre de son emprise au sol (2 × 2 ou 1 case). La cage aux poules de Cannelle et l'œuf (camp/poules, poules.json) :
// coincée sous les rochers (elle remue), puis ouverte ; l'œuf au sol, près de la poule qui l'a pondu.
import CAMP from '../../design/bibliotheque/svg/decor/camp/camp.json';
import POULES from '../../design/bibliotheque/svg/decor/camp/poules/poules.json';
import { librarySprite, frameAt } from './library';

const FILES = import.meta.glob('/design/bibliotheque/svg/decor/camp/**/*.svg', { query: '?raw', import: 'default' });
const ROOT = '/design/bibliotheque/svg/decor/camp/';
const SCALE = 1.25;
const boxOf = ([x, y, w, h]) => ({ x: x / SCALE, y: y / SCALE, w: w / SCALE, h: h / SCALE });

// Les dessins du camp, la cage comprise (cage_coincee, cage_ouverte : le nom que le serveur envoie)
const OBJETS = {
  ...CAMP.objets,
  ...Object.fromEntries(Object.entries(POULES.poules).map(([id, e]) => [id, { ...e, ms: e.ms_par_image, fichiers: e.fichiers.map(f => `poules/${f}`) }]))
};

const makes = new Map();
// Le calque d'un dessin du camp à l'instant t (secondes) : { key, make }, ou null si la bibliothèque ne l'a pas
export function campLayer(art, t = 0) {
  const entry = OBJETS[art];
  if (!entry) return null;
  const f = frameAt({ fichiers: entry.fichiers, ms_par_image: entry.ms || 1000 }, t);
  const path = ROOT + entry.fichiers[f];
  if (!FILES[path]) return null;
  if (!makes.has(path)) makes.set(path, librarySprite(FILES[path], boxOf(entry.cadre)));
  return { key: `camp-${art}-${f}`, make: makes.get(path) };
}

// Son nom (« Épave de l'Hirondelle », « Aster · abri »…), pour la bulle au toucher
export const campName = art => (OBJETS[art] && OBJETS[art].nom) || '';
// Ce que dit un élément du camp quand on le touche : { title, text }
const CAMP_LINES = {
  hirondelle: 'Ce qu’il reste de l’Hirondelle, le navire de croisière.',
  cannelle_debris: 'La cuisine de l’épave : Cannelle y fait chauffer sa marmite.',
  aster: 'Le coin d’Aster, en attendant son Ponton.',
  rivet: 'Le coin de Rivet, en attendant son Atelier.',
  tente: 'La tente des voyageurs.',
  hamac: 'Le hamac des voyageurs, entre deux poteaux.',
  sos: 'Un grand SOS de galets, pour qui passerait au large.',
  caisses: 'Des caisses repêchées dans les vagues.',
  filet: 'Un filet de pêche qui sèche au vent.',
  rondins: 'Des rondins pour le feu.',
  cage_ouverte: 'La cage des poules de Cannelle, grande ouverte.'
};
export const campInfo = art => ({ title: campName(art), text: CAMP_LINES[art] || CAMP_LINES[art.split('_')[0]] || '' });
// L'œuf posé au sol (ancre au centre de sa case)
export const eggLayer = () => campLayer('oeuf');
