import { describe, it, expect, afterEach } from 'vitest';
import gestures from '@/world/view/gestures';
import { coach } from '@/game/coach';
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

describe('le cercle doré d’une étape du tutoriel se touche tout entier', () => {
  afterEach(() => coach.state.lesson = null);
  it('un doigt dans le cercle, à côté du dessin de la cible : la cible ; hors du cercle : rien', () => {
    const cuisine = { id: 'cannelle', art: 'cannelle_debris', w: 1, x: 0, y: 0 };
    const island = islandWith({
      state: { sites: [], annexes: [], camp: [cuisine] },
      thickMist: () => true,
      coachWorld: name => (name === 'coin:cannelle' ? { x: 0, y: -20, r: 30 } : null),
      toScreen: (x, y) => ({ x, y }),
      tapAllowed: hit => Boolean(hit.campItem),
      hitAt(...args) { return gestures.hitAt.apply(this, args); }
    });
    coach.state.lesson = { steps: [{ target: 'île:coin:cannelle' }, { target: '.world__tip-btn' }] };
    // (le cercle : 30 de rayon, plus sa marge de 8 px)
    expect(gestures.ringHit.call(island, 34, -20).campItem).toBe(cuisine);
    expect(gestures.ringHit.call(island, 60, -20)).toBeNull();
    coach.state.lesson = null;
    expect(gestures.ringHit.call(island, 34, -20)).toBeNull();
  });
});

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

  it('une trouvaille de la plage posée devant l’épave se touche, même près du cœur de l’épave', () => {
    // (l'épave, 2 × 2 : son volume couvre les trouvailles posées juste devant elle ; elle ne fait que dire ce qu'elle est)
    const epave = { id: 'hirondelle', art: 'hirondelle', w: 2, x: 0, y: 0, cx: 0, cy: 0 };
    // (une case devant elle, comme greve-bois-2 : sur le haut de son dessin, plus près du cœur de l'épave que du sien)
    const bois = { id: 'greve-bois-2', pickup: true, x: TW / 2, y: TW / 4 };
    const island = islandWith({ state: { sites: [], annexes: [], camp: [epave] }, groundFinds: [bois] });
    expect(hitAt(island, TW / 2, -40).deposit).toBe(bois);
    // Loin de la trouvaille, toujours dans l'épave : l'épave
    expect(hitAt(island, -20, -TW).campItem).toBe(epave);
  });

  it('la caisse de Lorena garde son rang : la plus proche du doigt gagne', () => {
    const caisse = { id: 'caisses', art: 'caisses', w: 1, x: 0, y: 0 };
    const bois = { id: 'greve-bois', pickup: true, x: 40, y: 0 };
    const island = islandWith({ state: { sites: [], annexes: [], camp: [caisse] }, groundFinds: [bois] });
    expect(hitAt(island, 2, -4).campItem).toBe(caisse);
    expect(hitAt(island, 38, -4).deposit).toBe(bois);
  });

  it('ce qu’on accepte seulement (ok) : on touche ce qu’une mouette posée cache, la cage du tutoriel', () => {
    const cage = { id: 'cage', art: 'cage_coincee', w: 1, x: 0, y: 0 };
    const gull = { key: 'perch:0,0', kind: 'gull', x: 0, y: -6, r: 12 };
    const island = islandWith({ landHits: [gull], state: { sites: [], annexes: [], camp: [cage] } });
    expect(hitAt(island, 0, -6).animal).toBe(gull);
    expect(gestures.hitAt.call(island, 0, -6, hit => Boolean(hit.cage)).cage).toBe(cage);
  });

  it('une clôture ou une trouvaille devant le coin d’Agathe : la cible de l’étape se touche quand même', () => {
    const cuisine = { id: 'cannelle', art: 'cannelle_debris', w: 2, h: 2, x: 0, y: 0, cx: 0, cy: 0 };
    const cloture = { craft: 'cloture', x: 10, y: -10 };
    const galet = { id: 'greve-galet', pickup: true, x: -40, y: -6 };
    const island = islandWith({ state: { sites: [], annexes: [], camp: [cuisine] }, crafted: [cloture], groundFinds: [galet] });
    // (sans filtre, ce qui est devant gagne ; avec, le coin)
    expect(hitAt(island, 10, -14).craft).toBe(cloture);
    expect(gestures.hitAt.call(island, 10, -14, hit => Boolean(hit.campItem)).campItem).toBe(cuisine);
    expect(hitAt(island, -40, -10).deposit).toBe(galet);
    expect(gestures.hitAt.call(island, -40, -10, hit => Boolean(hit.campItem)).campItem).toBe(cuisine);
    // (rien d'accepté sous le doigt : rien)
    expect(gestures.hitAt.call(island, 10, -14, () => false)).toBeNull();
  });

  it('la cage vide, le poulailler posé, garde son rang devant un coquillage voisin ; sans poulailler, elle cède', () => {
    const cage = { id: 'cage', art: 'cage_ouverte', w: 1, x: 0, y: 0 };
    const coquillage = { id: 'greve-coquillage-1', pickup: true, x: 30, y: 0 };
    const withCoop = islandWith({ state: { sites: [], annexes: [{ annex: 'poulailler', x: 500, y: 500 }], camp: [cage] }, groundFinds: [coquillage] });
    expect(hitAt(withCoop, 10, -4).campItem).toBe(cage);
    const withoutCoop = islandWith({ state: { sites: [], annexes: [], camp: [cage] }, groundFinds: [coquillage] });
    expect(hitAt(withoutCoop, 10, -4).deposit).toBe(coquillage);
  });

  it('la cuisine d’Agathe, plus grande sur l’île : le haut de son dessin se touche aussi', () => {
    const cuisine = { id: 'cannelle', art: 'cannelle_debris', w: 2, h: 2, x: 0, y: 0, cx: 0, cy: 0 };
    const island = islandWith({ state: { sites: [], annexes: [], camp: [cuisine] } });
    // (au-dessus de la hauteur d'un coin 2 × 2 à sa taille d'avant, sous la sienne)
    expect(hitAt(island, 0, -TW * 0.85 * 2 * 1.15).campItem).toBe(cuisine);
  });

  it('les bulles et Brume passent avant tout', () => {
    const bubble = { x: 0, y: 0, w: 30, h: 20 };
    const ondin = { key: 'vil:puits', kind: 'villager', who: { id: 'vil:puits' }, x: 0, y: 0, r: 24 };
    expect(hitAt(islandWith({ bubbles: [bubble], landHits: [ondin] }), 2, 0).bubble).toBe(bubble);
    expect(hitAt(islandWith({ brumeHit: { x: 0, y: 0, r: 20 }, landHits: [ondin] }), 2, 0).brume).toBe(true);
  });
});
