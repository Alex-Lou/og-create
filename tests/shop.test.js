// La boutique d'un bâtiment côté navigateur : rubriques, verrous et libellés d'achat (le serveur reste seul juge)
import { describe, it, expect } from 'vitest';
import { shopGroups, itemArt, itemNote, itemLock, itemBuyable, itemBuyLabel } from '@/world/shop';

const item = (id, extra = {}) => ({ id, name: id, kind: 'outil', minLevel: 1, price: 100, effect: `effet de ${id}`, ...extra });
const site = (extra = {}) => ({ id: 'carriere', level: 3, ...extra });

describe('itemLock', () => {
  it('dans l’ordre : pièce rare, bâtiment à bâtir, palier, écus', () => {
    expect(itemLock(site({ level: 0 }), item('a', { rare: true, minLevel: 9 }), 0)).toBe('Dans les butins');
    expect(itemLock(site({ level: 0 }), item('a', { minLevel: 9 }), 0)).toBe('Bâtis d’abord');
    expect(itemLock(site(), item('a', { minLevel: 5 }), 0)).toBe('Palier V');
    expect(itemLock(site(), item('a', { price: 130 }), 100)).toBe('Il manque 30');
    expect(itemLock(site(), item('a', { price: 100 }), 100)).toBe('');
  });
  it('solde inconnu : le serveur tranchera', () => {
    expect(itemLock(site(), item('a', { price: 1e9 }), null)).toBe('');
  });
});

describe('itemBuyable et itemBuyLabel', () => {
  it('un article déjà à soi ou verrouillé ne s’achète pas', () => {
    expect(itemBuyable(site(), item('a'), 500)).toBe(true);
    expect(itemBuyable(site(), item('a', { owned: true }), 500)).toBe(false);
    expect(itemBuyable(site(), item('a', { price: 600 }), 500)).toBe(false);
  });
  it('le libellé dit le prix, ou ce qui bloque', () => {
    expect(itemBuyLabel(site(), item('Pioche', { price: 80 }), 500)).toBe('Acheter Pioche pour 80 écus (appui long : sa fiche)');
    expect(itemBuyLabel(site(), item('Pioche', { minLevel: 4 }), 500)).toBe('Pioche : Palier IV (toucher : sa fiche)');
  });
});

describe('shopGroups', () => {
  it('rubriques dans l’ordre de la fiche, articles du premier palier au dernier puis du moins cher', () => {
    const shop = [
      item('skin-b', { kind: 'skin', minLevel: 2 }),
      item('objet', { kind: 'objet' }),
      item('outil-cher', { minLevel: 2, price: 300 }),
      item('outil-bon', { minLevel: 2, price: 50 }),
      item('outil-un', { minLevel: 1, price: 900 }),
      item('rare', { kind: 'skin', rare: true }),
      item('craie-carriere', { kind: 'skin' })
    ];
    const groups = shopGroups({ shop });
    expect(groups.map(g => g.kind)).toEqual(['outil', 'objet', 'rare', 'skin', 'teinte']);
    expect(groups.map(g => g.label)).toEqual(['Outils', 'Objets', 'Pièces rares', 'Skins', 'Teintes']);
    expect(groups[0].items.map(i => i.id)).toEqual(['outil-un', 'outil-bon', 'outil-cher']);
    expect(groups[4].items.map(i => i.id)).toEqual(['craie-carriere']);
  });
  it('une rubrique vide ne se montre pas', () => {
    expect(shopGroups({ shop: [item('a')] }).map(g => g.kind)).toEqual(['outil']);
  });
});

describe('itemNote et itemArt', () => {
  it('un skin du Foyer ne se voit qu’à partir de l’Abri ; une teinte, elle, dit son effet', () => {
    expect(itemNote(site({ id: 'foyer', level: 1 }), item('toit', { kind: 'skin' }))).toBe('Se voit dès l’Abri.');
    expect(itemNote(site({ id: 'foyer', level: 2 }), item('toit', { kind: 'skin' }))).toBe('effet de toit');
    expect(itemNote(site({ id: 'foyer', level: 1 }), item('craie-foyer', { kind: 'skin' }))).toBe('effet de craie-foyer');
  });
  it('l’aperçu est une image SVG, la même à chaque fois', () => {
    const art = itemArt(site(), item('pioche'));
    expect(art).toMatch(/^data:image\/svg\+xml/);
    expect(itemArt(site(), item('pioche'))).toBe(art);
  });
});
