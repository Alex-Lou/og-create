// Mode d'emploi d'un article de la boutique : où il se trouve, comment s'en servir, pourquoi l'avoir.
// Tiré de ce que l'article fait (effet du serveur, sorte, teinte ou pièce rare) : rien à tenir à jour à la main.
import { tintOf } from './tints';

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

const HOW = {
  prod: 'Rien à faire : il travaille tout seul. Touche la bulle au-dessus du bâtiment pour encaisser.',
  coins: 'Rien à faire : les écus s’ajoutent à la production du bâtiment. Touche sa bulle pour les encaisser.',
  moves: 'Lance une Récolte (bouton Récolte, en haut de l’île) : chaque partie a des coups en plus.',
  charges: 'Une partie de Récolte de plus t’attend en réserve : tu peux en enchaîner davantage.',
  regen: 'Les parties de Récolte reviennent plus vite, même quand tu n’es pas là.',
  compagnon: 'Rien à faire : il vit sa vie près du bâtiment. Touche-le sur l’île pour le saluer.',
  skin: 'Porté dès l’achat. Pour changer : Boutique, puis Porter ou Ôter.',
  teinte: 'Portée dès l’achat. Pour changer : Boutique, puis Porter ou Ôter.',
  rare: 'Trouve-la dans un coffre légendaire (Récolte, coffre du jour, quêtes de Brume), puis porte-la depuis la Boutique (Porter ou Ôter).'
};
// Pièce rare offerte par un chapitre du Livre : son coffre attend dans les Coffres de l'île
const chapterHow = chapter => `Ouvre le chapitre ${chapter} du Livre : son coffre l’offre (bouton Coffres de l’île). Porte-la ensuite depuis la Boutique.`;
const WHY = {
  prod: 'Le bâtiment produit plus de ressources et d’écus, jusqu’à +100 %.',
  coins: 'Des écus en plus chaque heure, même quand tu ne joues pas.',
  moves: 'Plus de coups, ce sont de plus belles Récoltes.',
  charges: 'Jouer plus de Récoltes d’affilée.',
  regen: 'Attendre moins entre deux Récoltes.',
  compagnon: 'Pour la compagnie : il anime ton île.',
  skin: 'Pour le plaisir des yeux : l’apparence change, pas la production.',
  teinte: 'Pour le plaisir des yeux : la teinte vaut pour tous les paliers du bâtiment.',
  rare: 'Une pièce rare : un accessoire animé que peu d’îles ont.'
};

// { kind, where, how, why } pour un article de la boutique d'un bâtiment
export function guideOf(item, site) {
  const kind = guideKind(item);
  const name = site ? `« ${site.name} »` : 'son bâtiment';
  const where = kind === 'skin' || kind === 'teinte'
    ? `Sur ${name} lui-même, à tous ses paliers.`
    : kind === 'rare'
      ? `Sur ${name} : sa teinte et son accessoire animé.`
      : `Posé à côté de ${name}, sur ton île.`;
  return { kind, where, how: kind === 'rare' && item.chapter ? chapterHow(item.chapter) : HOW[kind], why: WHY[kind] };
}
