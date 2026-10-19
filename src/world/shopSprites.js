// Articles de la boutique des ateliers, dessinés aux abords de leur bâtiment (planche 3).
// Repère : celui de l'emprise du bâtiment (u, v ∈ [-1, 1], ancrage au centre), même projection et même lumière.
// Un article est fait de calques. Chaque calque a :
// - sa place (u, v), qui peut changer avec le niveau du bâtiment ;
// - un cadre serré autour de cette place, car les images sont gardées à 4× en mémoire ;
// - soit un dessin fixe, soit n images d'animation à peine différentes jouées à fps images/s ;
// - en option : back (dessiné avant le bâtiment, donc derrière) et motion (glissement continu dans le temps).
import { P, sprite } from './iso';
import { tools } from './spriteKit';
import { RARE_SPRITES } from './rareSprites';
import potager from './shopItems/potager';
import carriere from './shopItems/carriere';
import bosquet from './shopItems/bosquet';
import puits from './shopItems/puits';
import ponton from './shopItems/ponton';
import atelier from './shopItems/atelier';
import foyer from './shopItems/foyer';

// Catalogue : id d'article (celui du serveur) → calques, bâtiment par bâtiment (shopItems/)
export const SHOP_SPRITES = {
  ...potager,
  ...carriere,
  ...bosquet,
  ...puits,
  ...ponton,
  ...atelier,
  ...foyer,
  // Pièces rares (skins) : leur accessoire se dessine comme un article quand le bâtiment les porte
  ...RARE_SPRITES
};

// Emprise de 3 × 3 cases à partir de ce palier : les articles s'écartent d'autant (leur taille ne change pas)
const BIG_FROM = 4;
const spread = level => (level >= BIG_FROM ? 1.5 : 1);
// Place d'un calque selon le niveau du bâtiment : celle du niveau (paliers 1 à 3), repli sur le niveau 2 puis 1,
// écartée de moitié en plus quand l'emprise passe à 3 × 3
function placeOf(layer, level) {
  const at = layer.at;
  const base = typeof at[0] === 'number' ? at : at[Math.min(level, 3)] || at[2] || at[1];
  const k = spread(level);
  return [base[0] * k, base[1] * k];
}
function boxOf(layer, level) {
  const [u, v] = placeOf(layer, level);
  const [sx, sy] = P(u, v, 0);
  // Cadre fixe, ou propre au niveau (pièces rares qui suivent la hauteur du bâtiment)
  const [x, y, w, h] = typeof layer.frame === 'function' ? layer.frame(level) : layer.frame;
  return { x: sx + x, y: sy + y, w, h };
}
function bodyOf(id, k, layer, level, f) {
  const [u, v] = placeOf(layer, level);
  const T = tools(u, v, `${id}-${k}`);
  return layer.n ? layer.draw(T, level, f, layer.n) : layer.draw(T, level);
}

// Calques d'un article prêts à peindre à l'instant t (secondes) : clé d'image, dessin, devant/derrière, décalage écran
export function itemLayers(id, level, t = 0) {
  const item = SHOP_SPRITES[id];
  if (!item) return [];
  return item.layers.map((layer, k) => {
    const f = layer.n ? Math.floor(t * layer.fps) % layer.n : 0;
    const [mu, mv, dz] = layer.motion ? layer.motion(t, level) : [0, 0, 0];
    const du = mu * spread(level);
    const dv = mv * spread(level);
    return {
      key: `shop-${id}-${level}-${k}-${f}`,
      make: () => sprite(bodyOf(id, k, layer, level, f), boxOf(layer, level)),
      back: Boolean(layer.back),
      offset: [((du - dv) * 64) / 2, ((du + dv) * 32) / 2 - dz]
    };
  });
}

// Lumière de nuit d'un article : [u, v, z, rayon, couleur « r,g,b » ou rien pour la lueur chaude] dans le repère du bâtiment, ou null
export function itemLight(id, level) {
  const item = SHOP_SPRITES[id];
  if (!item || !item.light) return null;
  const [u, v, z, r, color] = item.light(level);
  return [u * spread(level), v * spread(level), z, r, color];
}

// Vignette d'un article pour la boutique : tous ses calques (première image), cadrés au plus juste
export function itemThumb(id, level) {
  const item = SHOP_SPRITES[id];
  if (!item) return null;
  const boxes = item.layers.map(layer => boxOf(layer, level));
  const x = Math.min(...boxes.map(b => b.x));
  const y = Math.min(...boxes.map(b => b.y));
  const w = Math.max(...boxes.map(b => b.x + b.w)) - x;
  const h = Math.max(...boxes.map(b => b.y + b.h)) - y;
  const back = item.layers.map((layer, k) => (layer.back ? bodyOf(id, k, layer, level, 0) : '')).join('');
  const front = item.layers.map((layer, k) => (layer.back ? '' : bodyOf(id, k, layer, level, 0))).join('');
  return sprite(back + front, { x, y, w, h });
}

