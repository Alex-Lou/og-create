// Les pièces des mini-jeux dessinées dans la bibliothèque (design/bibliotheque/svg/minijeux, minijeux.json) : une pièce
// par son nom, et l'image d'une suite à un instant (ms_par_image ; une suite qui ne boucle pas s'arrête sur sa dernière
// image). Les boucles animées dans le SVG (SMIL) tournent seules dans un <img>
import DATA from '../../design/bibliotheque/svg/minijeux/minijeux.json';

const URLS = import.meta.glob('/design/bibliotheque/svg/minijeux/*/*.svg', { query: '?url', import: 'default', eager: true });
const ROOT = '/design/bibliotheque/svg/minijeux/';

// L'adresse d'une pièce d'un jeu (cueillette, filon, peche, recolte), ou null
export function gamePiece(game, name) {
  const piece = DATA.jeux[game] && DATA.jeux[game].pieces[name];
  return (piece && URLS[ROOT + piece.fichier]) || null;
}

// L'adresse de l'image d'une suite d'un jeu, ms après son début, ou null
export function gameFrame(game, suite, ms) {
  const s = DATA.jeux[game] && DATA.jeux[game].suites && DATA.jeux[game].suites[suite];
  if (!s) return null;
  const n = s.fichiers.length;
  const k = Math.max(0, Math.floor(ms / s.ms_par_image));
  return URLS[ROOT + s.fichiers[s.boucle ? k % n : Math.min(n - 1, k)]] || null;
}

// Durée d'une suite (ms), 0 si elle manque
export function gameSuiteMs(game, suite) {
  const s = DATA.jeux[game] && DATA.jeux[game].suites && DATA.jeux[game].suites[suite];
  return s ? s.ms_par_image * s.fichiers.length : 0;
}

// Toutes les adresses d'un jeu (pour les précharger dans un canvas)
export function gameUrls(game) {
  const prefix = `${ROOT}${game}/`;
  return Object.keys(URLS).filter(k => k.startsWith(prefix)).map(k => URLS[k]);
}
