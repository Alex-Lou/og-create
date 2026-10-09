import { describe, it, expect } from 'vitest';
import gestures from '@/world/view/gestures';
import { TW } from '@/world/view/constants';

// Une île réduite à ce qui se touche : le monde se confond avec l'écran (zoom s), rien n'est posé sauf ce qu'on donne
function islandWith(parts = {}, s = 1) {
  return {
    cam: { s, x: 0, y: 0 },
    geo: { width: 0, height: 0 },
    toWorld: (px, py) => ({ x: px / s, y: py / s }),
    brumeHit: null, needBubbles: [], bubbles: [], seaHits: [], landHits: [], nameSignHits: [], itemHits: [], signs: [],
    state: { sites: [], annexes: [], camp: [] }, crafted: [], groundFinds: [], shownLandmarks: [],
    centerOf: site => ({ x: site.cx, y: site.cy }), ground: (x, y) => ({ x, y }),
    tileAt: () => null,
    ...parts,
    // (les bâtiments qui se voient : WorldView/terrain.js)
    shownSites() { return this.state.sites.filter(site => !site.hidden); }
  };
}
const hitAt = (island, x, y) => gestures.hitAt.call(island, x * island.cam.s, y * island.cam.s);

describe('le toucher sur l’île : ce qui est le plus près du doigt', () => {
  const puits = { id: 'puits', w: 2, x: 0, y: 0, cx: 0, cy: 0 };

  it('un habitant devant son bâtiment se touche, le bâtiment autour de lui aussi', () => {
    const ondin = { key: 'vil:puits', kind: 'villager', who: { id: 'vil:puits' }, x: 0, y: -3, r: 24 };
    const island = islandWith({ landHits: [ondin], state: { sites: [puits], annexes: [], camp: [] } });
    expect(hitAt(island, 4, -2).animal).toBe(ondin);
    // Loin de lui, mais dans le volume dessiné du bâtiment : le bâtiment
    expect(hitAt(island, 0, -TW * 1.4).site).toBe(puits);
  });

  it('un dormeur couché sur l’emprise de son puits se touche partout sur son corps, même près du cœur du bâtiment', () => {
    const ondin = { key: 'vil:puits', kind: 'villager', who: { id: 'vil:puits', pose: 'sleep' }, x: 10, y: -10, r: 24 };
    const island = islandWith({ landHits: [ondin], state: { sites: [puits], annexes: [], camp: [] } });
    // Au bord de son corps, tout contre le centre du puits : toujours lui
    expect(hitAt(island, 0, -14).animal).toBe(ondin);
    expect(hitAt(island, 30, -12).animal).toBe(ondin);
    // Hors de son corps : le puits
    expect(hitAt(island, -30, -TW * 1.2).site).toBe(puits);
  });

  it('un panneau de quartier ne vole pas le toucher d’un habitant tout proche', () => {
    const cannelle = { key: 'vil:foyer', kind: 'villager', who: { id: 'vil:foyer' }, x: 0, y: 0, r: 15 };
    const sign = { zone: { id: 'source' }, x: 20, y: 0, r: 22 };
    const island = islandWith({ landHits: [cannelle], signs: [sign] });
    expect(hitAt(island, 4, 0).animal).toBe(cannelle);
    expect(hitAt(island, 18, 0).zone).toBe(sign.zone);
  });

  it('entre une enseigne et un article posé, le plus proche gagne', () => {
    const nameSign = { site: { id: 'foyer' }, x: 0, y: 0, r: 18 };
    const item = { item: { id: 'banc' }, site: { id: 'foyer' }, x: 22, y: 0, r: 16 };
    const island = islandWith({ nameSignHits: [nameSign], itemHits: [item] });
    expect(hitAt(island, 3, 0).nameSign).toBe(nameSign.site);
    expect(hitAt(island, 19, 0).item).toBe(item.item);
  });

  it('une petite cible reste touchable dézoomée (44 px au doigt)', () => {
    const gull = { key: 'gull', kind: 'gull', x: 0, y: 0, r: 6 };
    const island = islandWith({ seaHits: [gull] }, 0.5);
    // 16 px d'écran du centre : hors de son rayon dessiné (3 px), dans le rayon minimal (22 px)
    expect(hitAt(island, 32, 0).animal).toBe(gull);
  });

  it('les bulles et Brume passent avant tout', () => {
    const bubble = { x: 0, y: 0, w: 30, h: 20 };
    const ondin = { key: 'vil:puits', kind: 'villager', who: { id: 'vil:puits' }, x: 0, y: 0, r: 24 };
    expect(hitAt(islandWith({ bubbles: [bubble], landHits: [ondin] }), 2, 0).bubble).toBe(bubble);
    expect(hitAt(islandWith({ brumeHit: { x: 0, y: 0, r: 20 }, landHits: [ondin] }), 2, 0).brume).toBe(true);
  });
});
