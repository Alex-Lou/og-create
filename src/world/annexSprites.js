// Annexes des bâtiments (lot 4c) : 21 constructions posées par le joueur sur une case, autour de leur bâtiment, les
// maisons du Foyer (lot 7d), où s'installent les visiteurs, et les 6 annexes de climat (lot 9d).
// Repère : celui de la case (u, v ∈ [-0,5 ; 0,5], ancrage au centre), même projection et même lumière que le reste de
// l'île. Une annexe est faite de calques, comme les articles de la boutique : un cadre serré (images gardées à 4× en
// mémoire), un dessin fixe ou n images d'animation jouées à fps images/s. variant : le n° d'exemplaire (0, 1, 2) d'une
// petite annexe, qui change ce qui y pousse (blé, carottes, citrouilles…).
import { sprite } from './iso';
import { tools } from './spriteKit';
import { SHOP_SPRITES } from './shopSprites';
import { annexArtLayer, annexArtThumb } from './decorArt';
import { objectAnnexLayer, objectAnnexThumb } from './objectArt';
import { spriteUrl } from './spriteCache';
import { champ, grenier, enclos } from './annexItems/potager';
import { filon, depot, taille } from './annexItems/carriere';
import { coupe, remise, pepiniere } from './annexItems/bosquet';
import { citerne, reservoir, eolienne } from './annexItems/puits';
import { vivier, fumoir, huitres } from './annexItems/ponton';
import { jardin, four, belvedere, maison } from './annexItems/foyer';
import { charbon, hangar, fourneau } from './annexItems/atelier';
import { glaciere, metier, hutte, saline, serre, fonderie } from './annexItems/climats';

// Le poulailler d’Agathe, annexe du Feu (le jour d’Agathe) : celui du Potager, sans les poules qu'il dessine (les
// siennes, vivantes, picorent autour : village.js) ; dans la bibliothèque, l'objet de la boutique (objectArt.js)
const poulailler = { layers: [SHOP_SPRITES.poulailler.layers[0]] };

const FROM_SHOP = new Set(['poulailler']);

export const ANNEX_SPRITES = {
  champ, grenier, enclos, filon, depot, taille, coupe, remise, pepiniere,
  citerne, reservoir, eolienne, vivier, fumoir, huitres, jardin, four, belvedere, charbon, hangar, fourneau, maison,
  glaciere, metier, hutte, saline, serre, fonderie, poulailler
};

// Calques d'une annexe prêts à peindre à l'instant t (secondes) : clé d'image et dessin. Le dessin de la bibliothèque
// d'abord (decorArt.js), sinon celui-ci
export function annexLayers(id, variant = 0, t = 0) {
  const art = annexArtLayer(id, variant, t) || (FROM_SHOP.has(id) ? objectAnnexLayer(id) : null);
  if (art) return [art];
  const annex = ANNEX_SPRITES[id];
  if (!annex) return [];
  return annex.layers.map((layer, k) => {
    const f = layer.n ? Math.floor(t * layer.fps) % layer.n : 0;
    const [x, y, w, h] = layer.frame;
    return {
      key: `annex-${id}-${variant}-${k}-${f}`,
      make: () => sprite(layer.draw(tools(0, 0, `${id}-${variant}-${k}`), f, layer.n || 1, variant), { x, y, w, h })
    };
  });
}

// Lumière de nuit d'une annexe : [u, v, z, rayon, couleur « r,g,b » ou rien (lueur chaude), feu qui vacille], ou null
export function annexLight(id) {
  const annex = ANNEX_SPRITES[id];
  return annex && annex.light ? annex.light() : null;
}

// Son image, telle que l'île la peint (annexLayers) : le dessin de la bibliothèque (decorArt.js), l'objet de la
// boutique (le poulailler d’Agathe), sinon celui-ci (annexThumb) ; pour sa fiche, le choix des annexes, sa pose et son
// assemblage
export function annexPicture(id, variant = 0) {
  return annexArtThumb(id, variant)
    ?? (FROM_SHOP.has(id) ? objectAnnexThumb(id) : null)
    ?? spriteUrl(`annex-thumb-${id}-${variant}`, () => annexThumb(id, variant));
}

// Vignette d'une annexe pour sa fiche : tous ses calques (première image), cadrés au plus juste
export function annexThumb(id, variant = 0) {
  const annex = ANNEX_SPRITES[id];
  if (!annex) return null;
  const frames = annex.layers.map(l => l.frame);
  const x = Math.min(...frames.map(fr => fr[0]));
  const y = Math.min(...frames.map(fr => fr[1]));
  const w = Math.max(...frames.map(fr => fr[0] + fr[2])) - x;
  const h = Math.max(...frames.map(fr => fr[1] + fr[3])) - y;
  const body = annex.layers.map((layer, k) => layer.draw(tools(0, 0, `${id}-${variant}-${k}-t`), 0, layer.n || 1, variant)).join('');
  return sprite(body, { x, y, w, h });
}
