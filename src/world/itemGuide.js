// Mode d'emploi d'un article de la boutique : où il se trouve, comment s'en servir, pourquoi l'avoir.
// Tiré de ce que l'article fait (effet du serveur, sorte, teinte ou pièce rare) : rien à tenir à jour à la main.
import { tintOf } from './tints';
import { HOW, CHAPTER_HOW, WHY, WHERE } from '@/texts/world/items';

// Sorte d'article pour le mode d'emploi (une carte d'aide s'affiche au premier achat de chaque sorte)
export function guideKind(item) {
  if (item.rare) return 'rare';
  if (item.kind === 'skin') return tintOf(item.id) ? 'teinte' : 'skin';
  const gain = item.gain || {};
  if (gain.prod) return 'prod';
  if (gain.coins) return 'coins';
  if (gain.moves) return 'moves';
  if (gain.charges) return 'charges';
  if (gain.regenMs) return 'regen';
  return 'compagnon';
}

// { kind, where, how, why } pour un article de la boutique d'un bâtiment
export function guideOf(item, site) {
  const kind = guideKind(item);
  const name = site ? WHERE.named(site.name) : WHERE.unnamed;
  const where = kind === 'skin' || kind === 'teinte'
    ? WHERE.skin(name)
    : kind === 'rare'
      ? WHERE.rare(name)
      : WHERE.other(name);
  return { kind, where, how: kind === 'rare' && item.chapter ? CHAPTER_HOW(item.chapter) : HOW[kind], why: WHY[kind] };
}
