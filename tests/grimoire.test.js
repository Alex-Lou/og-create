import { describe, expect, it } from 'vitest';
import { spreadOf, pagesOf, sideOf, spreadCount, spreadSpots } from '../src/book/spread';
import { SIGILS, CHAPTER_IDS, coverArt } from '../src/book/grimoire';
import { CHAPTER_STYLE, CHAPTER_FAMILIES, FAMILY_TINT, tintOfFamily } from '../src/book/chapters';

describe('double page du Livre', () => {
  it('la garde puis le sommaire, ensuite les pages deux par deux (impaires à gauche, paires à droite)', () => {
    expect(pagesOf(0)).toEqual({ left: -1, right: 0 });
    expect(pagesOf(3)).toEqual({ left: 5, right: 6 });
    for (let i = -1; i < 40; i++) {
      const { left, right } = pagesOf(spreadOf(i));
      expect([left, right]).toContain(i);
      expect(sideOf(i)).toBe(i === left ? 'left' : 'right');
    }
  });
  it('autant de doubles pages qu’il faut, la dernière garde comprise', () => {
    expect(spreadCount(1)).toBe(1);
    expect(spreadCount(2)).toBe(2);
    expect(spreadCount(3)).toBe(2);
    expect(spreadCount(4)).toBe(3);
  });
  it('les zones d’une page se rangent dans sa moitié, avec un identifiant propre au côté', () => {
    const spots = [{ id: 'ink', x: 54, y: 115.5, w: 37, h: 8, action: 'ink' }];
    const [left] = spreadSpots(spots, 'left');
    const [right] = spreadSpots(spots, 'right');
    expect(left).toMatchObject({ id: 'left:ink', x: 27, w: 18.5, y: 115.5, h: 8, side: 'left', action: 'ink' });
    expect(right).toMatchObject({ id: 'right:ink', x: 77, w: 18.5, y: 115.5, side: 'right' });
    expect(spots[0].id).toBe('ink');
  });
});

describe('le grimoire', () => {
  it('un sigle de planète par chapitre, dans l’ordre des chapitres', () => {
    expect(CHAPTER_IDS).toEqual(Object.keys(CHAPTER_STYLE));
    CHAPTER_IDS.forEach(id => {
      expect(SIGILS[id].name).toBeTruthy();
      expect(SIGILS[id].d).toMatch(/^M[\d.\s,a-zA-Z-]+$/);
    });
  });
  it('la couverture porte les sept sigles en couronne', () => {
    const art = decodeURIComponent(coverArt());
    expect(art.startsWith('url("data:image/svg+xml')).toBe(true);
    CHAPTER_IDS.forEach(id => expect(art).toContain(SIGILS[id].d));
  });
});

describe('teintes des familles', () => {
  const families = Object.values(CHAPTER_FAMILIES).flat();
  it('une teinte pour chacune des 15 familles, et aucune de trop', () => {
    expect(families).toHaveLength(15);
    expect(Object.keys(FAMILY_TINT).sort()).toEqual([...families].sort());
  });
  it('des couleurs valides, toutes différentes', () => {
    const cards = Object.values(FAMILY_TINT).map(t => t.card);
    Object.values(FAMILY_TINT).forEach(t => ['card', 'edge', 'ink'].forEach(k => expect(t[k]).toMatch(/^#[0-9A-F]{6}$/)));
    expect(new Set(cards).size).toBe(cards.length);
  });
  it('une famille inconnue garde le vélin, à l’encre du chapitre I', () => {
    expect(tintOfFamily('Inconnue')).toEqual({ card: '#FBF5E8', edge: '#E3D3B5', ink: CHAPTER_STYLE.I.ink });
    expect(tintOfFamily('Chimie')).toBe(FAMILY_TINT.Chimie);
  });
});
