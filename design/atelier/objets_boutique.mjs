// Les objets de la boutique, calque par calque : les paliers où chacun se vend, ses variantes (un dessin qui change selon
// le palier), leurs images et leurs noms de fichier. preview_batiments.mjs les publie, le générateur des objets
// (generateur_objets.mjs) les dessine : une seule façon de les découper.
import { SHOP_SPRITES, tools } from './port/src/world/shopSprites.js';

// Articles de la boutique par bâtiment (les trois derniers ne se montrent qu'aux paliers V à VII)
export const SHOP_ITEMS = {
  potager: ['pelle', 'arrosoir', 'poulailler', 'ruche', 'brouette', 'epouvantail', 'citrouille'],
  carriere: ['pioche', 'wagonnet', 'lanterne-mine', 'rails', 'casque', 'geode', 'golem'],
  bosquet: ['hache', 'scie', 'nichoir', 'charrette', 'passe-partout', 'ecureuil', 'cerf'],
  puits: ['seau-cuivre', 'poulie', 'abreuvoir', 'pompe', 'sourcier', 'canards', 'naiade'],
  ponton: ['canne', 'filet', 'casier', 'barque', 'harpon', 'pelican', 'sirene'],
  atelier: ['etabli', 'enclume', 'soufflet', 'marteau-pilon', 'automate', 'athanor'],
  foyer: ['cuisine', 'lit', 'chat', 'chien', 'sablier', 'hibou', 'grimoire']
};

// Les paliers où l'objet se vend
export function paliers(site, id) {
  const ids = SHOP_ITEMS[site], rank = ids.indexOf(id);
  const late = rank >= ids.length - 3 && ids.length === 7 ? true : rank >= ids.length - 3;
  return { late, levels: late ? [5, 6, 7] : [1, 2, 3, 4, 5, 6, 7] };
}

// Les calques d'un objet : pour chacun, ses variantes { from (le premier palier du dessin), frames (les images, en px du
// jeu), frame (le cadre de départ, en px du jeu) }, celle d'un palier (variante(palier)), et le nom de fichier de chaque
// image (sans le dossier)
export function calques(site, id) {
  const item = SHOP_SPRITES[id], { levels } = paliers(site, id);
  return item.layers.map((layer, k) => {
    const seen = new Map(), dessinDu = {};
    for (const lv of levels) {
      const frames = Array.from({ length: layer.n || 1 }, (_, f) => (layer.n ? layer.draw(tools(0, 0, `${id}-${k}`), lv, f, layer.n) : layer.draw(tools(0, 0, `${id}-${k}`), lv)));
      const key = frames.join('|');
      if (!seen.has(key)) seen.set(key, { from: lv, frames, frame: typeof layer.frame === 'function' ? layer.frame(lv) : layer.frame });
      dessinDu[lv] = seen.get(key);
    }
    const variantes = [...seen.values()];
    const nom = (vr, f) => id + (item.layers.length > 1 ? `_calque${k + 1}` : '') + (variantes.length > 1 ? `_des_palier${vr.from}` : '') + (vr.frames.length > 1 ? `_${f + 1}` : '');
    return { k, layer, levels, variantes, nom, variante: lv => dessinDu[lv] };
  });
}
