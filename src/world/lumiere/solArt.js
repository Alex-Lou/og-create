// Le sol du temps et des saisons dessiné dans la bibliothèque (design/bibliotheque/svg/meteo/sol ; meteo.json : sprites) :
// flaques, flaque gelée, glace, neige au sol, givre. Chaque dessin est une case iso de 80 × 40 de la bibliothèque (le jeu
// × 1,25), ancrée en son centre : une case du jeu, pour le cache des sprites (spriteCache.js : drawSprite). Lus à la
// demande, un fichier à la fois.
import METEO from '../../../design/bibliotheque/svg/meteo/meteo.json';
import { librarySprite, frameAt, textsOf } from '../library';

const FILES = textsOf(import.meta.glob('/design/bibliotheque/svg/meteo/sol/*.svg', { query: '?url', import: 'default', eager: true }));
const ROOT = '/design/bibliotheque/svg/meteo/';
const SCALE = 1.25;
const sprites = new Map();

// Le dessin nom (meteo.json : sprites), à l'image de son animation à l'instant t (s) : { key, make }, ou null si la
// bibliothèque ne l'a pas
export function solArt(nom, t = 0) {
  const art = METEO.sprites[nom];
  if (!art) return null;
  const f = frameAt(art, t);
  const file = art.fichiers[f];
  if (!FILES[ROOT + file]) return null;
  const key = `sol-${nom}-${f}`;
  if (!sprites.has(key)) {
    const [x, y, w, h] = art.cadre;
    sprites.set(key, { key, make: librarySprite(FILES[ROOT + file], { x: x / SCALE, y: y / SCALE, w: w / SCALE, h: h / SCALE }) });
  }
  return sprites.get(key);
}
