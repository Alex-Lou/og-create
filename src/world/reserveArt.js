// Les réserves des bâtiments (design/bibliotheque/svg/batiments/reserves, reserves.json) : ce que chaque bâtiment a
// produit, posé à côté de lui, vide, à moitié ou plein (plein : deux images, elle brille). Au cadre du jeu × 1,25,
// autour de l'ancre (le centre de la case)
import DATA from '../../design/bibliotheque/svg/batiments/reserves/reserves.json';
import { librarySprite, frameAt } from './library';

const FILES = import.meta.glob('/design/bibliotheque/svg/batiments/reserves/*/*.svg', { query: '?raw', import: 'default' });
const ROOT = '/design/bibliotheque/svg/batiments/reserves/';
const SCALE = 1.25;
const boxOf = ([x, y, w, h]) => ({ x: x / SCALE, y: y / SCALE, w: w / SCALE, h: h / SCALE });

// L'état de la réserve d'un bâtiment : rien à ramasser (vide), plein (sa réserve ne produit plus : fullIn écoulé), sinon
// à moitié. elapsed : ms depuis le chargement de la vue
export function reserveState(site, elapsed = 0) {
  const made = site.pending;
  const some = made && Object.values(made).some(n => n > 0);
  if (!some) return 'vide';
  return site.fullIn !== null && site.fullIn !== undefined && site.fullIn <= elapsed ? 'plein' : 'moitie';
}

const makes = new Map();
// Le calque de la réserve d'un bâtiment dans un état, à l'instant t (secondes) : { key, make }, ou null si la
// bibliothèque n'en a pas
export function reserveLayer(siteId, state, t = 0) {
  const art = DATA.reserves[siteId] && DATA.reserves[siteId].etats[state];
  if (!art) return null;
  const f = frameAt(art, t);
  const path = ROOT + art.fichiers[f];
  if (!FILES[path]) return null;
  if (!makes.has(path)) makes.set(path, librarySprite(FILES[path], boxOf(art.cadre)));
  return { key: `lib-reserve-${siteId}-${state}-${f}`, make: makes.get(path) };
}
