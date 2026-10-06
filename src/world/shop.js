// Boutique d'un bâtiment côté navigateur (le serveur reste seul juge de l'achat) : ses rubriques, l'aperçu d'un
// article, ce qui l'empêche de s'acheter encore. coins : solde connu, ou null (le serveur tranchera)
import { roman } from '@/utils/roman';
import { spriteUrl } from '@/world/spriteCache';
import { artMake } from '@/world/looks';
import { buildingThumb } from '@/world/buildingArt';
import { itemThumb } from '@/world/shopSprites';
import { tintOf } from '@/world/tints';

// Rubriques dans l'ordre de la fiche
const SHOP_GROUPS = [['outil', 'Outils'], ['objet', 'Objets'], ['rare', 'Pièces rares'], ['skin', 'Skins'], ['teinte', 'Teintes']];
// Rubrique d'un article : les skins se partagent entre pièces rares, skins dessinés et teintes
const groupOf = item => (item.rare ? 'rare' : item.kind === 'skin' && tintOf(item.id) ? 'teinte' : item.kind);

// Rubriques de la boutique ; dans chacune, les articles du premier palier au dernier
export function shopGroups(site) {
  const byPalier = (a, b) => a.minLevel - b.minLevel || a.price - b.price;
  return SHOP_GROUPS.map(([kind, label]) => ({ kind, label, items: site.shop.filter(item => groupOf(item) === kind).sort(byPalier) })).filter(group => group.items.length);
}

// Niveau auquel montrer un article ou un skin : celui du bâtiment, ou celui qu'il demande (le toit du Foyer se voit dès l’Abri)
function previewLevel(site, item) {
  const level = Math.max(site.level, item.minLevel, 1);
  return site.id === 'foyer' && groupOf(item) === 'skin' ? Math.max(level, 2) : level;
}

// Aperçu d'un article : un skin ou une teinte sur le dessin de la bibliothèque (une pièce rare sur celui du jeu), un
// outil ou un objet dessiné par le jeu
export function itemArt(site, item) {
  const level = previewLevel(site, item);
  if (item.kind === 'skin') return buildingThumb(site.id, level, 0, item.id) || spriteUrl(`art-${site.id}-${level}-${item.id}`, artMake(site.id, level, item.id));
  return spriteUrl(`thumb-${item.id}-${level}`, () => itemThumb(item.id, level));
}

export function itemNote(site, item) {
  if (groupOf(item) === 'skin' && site.id === 'foyer' && site.level < 2) return 'Se voit dès l’Abri.';
  return item.effect;
}

// Raison pour laquelle un article ne s'achète pas encore (texte du bouton), ou ''
export function itemLock(site, item, coins) {
  if (item.rare) return 'Dans les butins';
  if (!site.level) return 'Bâtis d’abord';
  if (site.level < item.minLevel) return `Palier ${roman(item.minLevel)}`;
  if (coins !== null && coins < item.price) return `Il manque ${item.price - coins}`;
  return '';
}

export function itemBuyable(site, item, coins) {
  return !item.owned && !itemLock(site, item, coins);
}

export function itemBuyLabel(site, item, coins) {
  const lock = itemLock(site, item, coins);
  if (lock) return `${item.name} : ${lock} (toucher : sa fiche)`;
  return `Acheter ${item.name} pour ${item.price} écus (appui long : sa fiche)`;
}
