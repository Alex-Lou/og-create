// Brume dessinée dans la bibliothèque (design/bibliotheque/svg/vivants/brume) : un dessin par stade (s0 pâle et
// tremblante à s7 la couronne dorée), pâlie (s6pale), l'éclat du Phénix (s6phenix), le soleil du phare (s7soleil) et la
// récompense prête (pret, sa pastille « ! ») ; quatre images à 220 ms (la cadence des vivants de la bibliothèque). Cadre
// 40 × 48, le centre du bas de la flamme en (20, 32), rayon 9. Ce que la bibliothèque n'a pas garde le feu follet par
// code (brume.js).
import { librarySprite, frameAt } from './library';
import { drawSprite } from './spriteCache';

const ROOT = '/design/bibliotheque/svg/vivants/brume/';
const FILES = import.meta.glob('/design/bibliotheque/svg/vivants/brume/brume_*.svg', { query: '?raw', import: 'default' });
const URLS = import.meta.glob('/design/bibliotheque/svg/vivants/brume/brume_*.svg', { query: '?url', import: 'default', eager: true });

export const BRUME_FRAMES = 4;
export const BRUME_MS = 220;
// Le dessin en unités de la bibliothèque, autour du centre du bas de la flamme ; son rayon
const BOX = { x: -20, y: -32, w: 40, h: 48 };
export const ART_R = 9;

// Le dessin d'un regard de Brume (game/opus.js : brumeLook) ; ready : la récompense attend
export function brumeArtId(look = {}, ready = false) {
  if (ready) return 'pret';
  if (look.burst) return 's6phenix';
  if (look.pale) return 's6pale';
  if (look.sun) return 's7soleil';
  return `s${look.stage ?? 1}`;
}

const pathOf = (id, n) => `${ROOT}brume_${id}_${n + 1}.svg`;
const ART = { fichiers: Array.from({ length: BRUME_FRAMES }, (_, n) => n), ms_par_image: BRUME_MS };
const makes = new Map();
// Le calque de Brume à l'instant t (secondes) : { key, make }, ou null si la bibliothèque n'a pas ce dessin
export function brumeArtLayer(look, ready, t = 0) {
  const id = brumeArtId(look, ready);
  const n = frameAt(ART, t);
  const path = pathOf(id, n);
  if (!FILES[path]) return null;
  if (!makes.has(path)) makes.set(path, librarySprite(FILES[path], BOX));
  return { key: `brume-${id}-${n}`, make: makes.get(path) };
}

// Les adresses des quatre images d'un stade (fiches, Livre), ou null si la bibliothèque ne l'a pas
export function brumeArtUrls(look, ready) {
  const id = brumeArtId(look, ready);
  const urls = Array.from({ length: BRUME_FRAMES }, (_, n) => URLS[pathOf(id, n)]);
  return urls.every(Boolean) ? urls : null;
}

// Une image de Brume a déjà paru : pendant la lecture de la suivante, la dernière reste à l'écran (drawSprite, hold)
let shown = false;
// Brume sur l'île en (x, y) (centre du bas de la flamme), au rayon r (unités du monde), son ombre sous elle (ground) ;
// false tant qu'aucune de ses images n'est prête (l'île dessine alors le feu follet par code)
export function drawBrumeArt(ctx, layer, x, y, ground, r, onReady) {
  const k = r / ART_R;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(k, k);
  shown = drawSprite(ctx, layer.key, layer.make, 0, 0, onReady, 'brume') || shown;
  ctx.restore();
  if (!shown) return false;
  ctx.fillStyle = 'rgba(30,40,60,.12)';
  ctx.beginPath();
  ctx.ellipse(ground.x, ground.y, r * 0.875, r * 0.325, 0, 0, Math.PI * 2);
  ctx.fill();
  return true;
}
