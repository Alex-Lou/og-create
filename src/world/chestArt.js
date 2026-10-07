// Les coffres dessinés dans la bibliothèque (design/bibliotheque/svg/coffres, coffres.json) : un par rareté, au cadre
// du coffre du jeu (120 × 100). L'ouverture s'enchaîne une fois (il tremble à gauche, à droite, s'entrouvre, s'ouvre
// grand : 140, 140, 220 puis 220 ms), puis le coffre ouvert respire (deux images de 700 ms, en boucle). Les rayons et la
// lueur restent ceux du jeu (CSS). L'icône (32 × 32, fermé) sert aux listes.
import { coffres as CHESTS } from '../../design/bibliotheque/svg/coffres/coffres.json';

const URLS = import.meta.glob('/design/bibliotheque/svg/coffres/*/*.svg', { query: '?url', import: 'default', eager: true });
const ROOT = '/design/bibliotheque/svg/coffres/';
const OPENING_MS = [140, 140, 220, 220];
const OPEN_MS = 700;

// Les images d'un coffre de cette rareté : { opening: [{ src, ms }], open: [{ src, ms }] }, ou null si la bibliothèque
// ne l'a pas
export function chestFrames(rarity) {
  const art = CHESTS[rarity];
  if (!art) return null;
  const opening = art.fichiers.ouverture.map((file, k) => ({ src: URLS[ROOT + file], ms: OPENING_MS[k] || OPENING_MS.at(-1) }));
  const open = art.fichiers.ouvert.map(file => ({ src: URLS[ROOT + file], ms: OPEN_MS }));
  return [...opening, ...open].every(frame => frame.src) ? { opening, open } : null;
}

// L'icône d'un coffre de cette rareté (fermé, 32 × 32), ou null
export function chestIcon(rarity) {
  const art = CHESTS[rarity];
  return (art && URLS[ROOT + art.fichiers.icone]) || null;
}
