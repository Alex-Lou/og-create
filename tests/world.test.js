import { describe, it, expect } from 'vitest';
import { P, TW, TH, box, boulder, mixHex } from '@/world/iso';
import { phaseAt } from '@/world/scene';
import { sunTimes, weatherAt, clockText } from '@/world/sky';
import { NATURE } from '@/world/sprites';
import { NATURE2, CRITTERS } from '@/world/nature';
import { SHOP_SPRITES, itemLayers, itemLight, itemThumb } from '@/world/shopSprites';
import { LOOKS, lookAt } from '@/world/looks';
import { buildingArt, buildingThumb } from '@/world/buildingArt';
import { TINTS, TINT_IDS, RARE_TINTS, tintOf, tintSvg } from '@/world/tints';
import { RARE_SPRITES, FORGE_CHIMNEYS, crestOf, rareLights } from '@/world/rareSprites';

const at = (h, m = 0) => {
  const d = new Date(2026, 9, 4, h, m);
  return phaseAt(d);
};

describe('géométrie isométrique', () => {
  it('projette une case en losange 2:1, z vers le haut', () => {
    expect(P(0, 0, 0)).toEqual([0, 0]);
    expect(P(1, 0, 0)).toEqual([TW / 2, TH / 2]);
    expect(P(0, 1, 0)).toEqual([-TW / 2, TH / 2]);
    expect(P(0, 0, 10)).toEqual([0, -10]);
  });
  it('une boîte ne montre que ses trois faces visibles', () => {
    expect(box(0, 0, 1, 1, 0, 10, { top: '#a', left: '#b', right: '#c' }).match(/<polygon/g)).toHaveLength(3);
  });
});

describe('rochers à facettes', () => {
  const ROCK = { top: '#CCCCCC', left: '#999999', right: '#666666' };
  it('même graine, même rocher ; seules les facettes tournées vers le joueur sont tracées, le dessus en dernier', () => {
    const a = boulder(0, 0, 0.3, 0.25, 12, ROCK, 3);
    expect(a).toBe(boulder(0, 0, 0.3, 0.25, 12, ROCK, 3));
    expect(a).not.toBe(boulder(0, 0, 0.3, 0.25, 12, ROCK, 4));
    const faces = a.match(/<polygon/g).length;
    expect(faces).toBeGreaterThan(4);
    expect(faces).toBeLessThan(2 * 8 + 1);
    expect(a.endsWith(`fill="${ROCK.top}"${' stroke="rgba(60,40,25,.28)" stroke-width="0.8" stroke-linejoin="round"'}/>`)).toBe(true);
  });
  it('mélange de couleurs', () => {
    expect(mixHex('#000000', '#FFFFFF', 0)).toBe('#000000');
    expect(mixHex('#000000', '#FFFFFF', 1)).toBe('#ffffff');
    expect(mixHex('#102030', '#305070', 0.5)).toBe('#203850');
  });
  it('trois rochers différents pour le sol rocheux', () => {
    ['rock', 'rocks', 'crag'].forEach(kind => expect(NATURE[kind]().svg).toContain('<polygon'));
  });
});

describe('sprites', () => {
  it('chaque élément de nature donne un SVG cadré', () => {
    const all = [...Object.values(NATURE), ...Object.values(NATURE2), ...Object.values(CRITTERS).flat()];
    for (const make of all) {
      const { svg, box: frame } = make();
      expect(svg.startsWith('<svg')).toBe(true);
      expect(frame.w).toBeGreaterThan(0);
      expect(svg).not.toMatch(/NaN|undefined/);
    }
  });
});

// Articles de la boutique vendus par le serveur (outils et objets ; les skins changent le dessin du bâtiment)
const SHOP_ITEMS = {
  potager: ['pelle', 'arrosoir', 'poulailler', 'ruche', 'brouette', 'epouvantail', 'citrouille'],
  carriere: ['pioche', 'wagonnet', 'lanterne-mine', 'rails', 'casque', 'geode', 'golem'],
  bosquet: ['hache', 'scie', 'nichoir', 'charrette', 'passe-partout', 'ecureuil', 'cerf'],
  puits: ['seau-cuivre', 'poulie', 'abreuvoir', 'pompe', 'sourcier', 'canards', 'naiade'],
  ponton: ['canne', 'filet', 'casier', 'barque', 'harpon', 'pelican', 'sirene'],
  atelier: ['etabli', 'enclume', 'soufflet', 'alambic', 'marteau-pilon', 'automate', 'athanor'],
  foyer: ['cuisine', 'lit', 'chat', 'chien', 'sablier', 'hibou', 'grimoire']
};
// Articles des paliers V à VII (les trois derniers de chaque boutique) : ils ne se montrent qu'aux grandes emprises (3 × 3)
const LATE_ITEMS = Object.values(SHOP_ITEMS).flatMap(ids => ids.slice(-3));

describe('boutique des ateliers', () => {
  it('chaque article du catalogue a son dessin, à chaque niveau de son bâtiment', () => {
    const ids = Object.values(SHOP_ITEMS).flat();
    expect(Object.keys(SHOP_SPRITES).filter(id => !RARE_SPRITES[id]).sort()).toEqual([...ids].sort());
    for (const id of ids) {
      for (const level of LATE_ITEMS.includes(id) ? [5, 6, 7] : [1, 2, 3, 4, 7]) {
        const reach = level >= 4 ? 112 : 80;
        const layers = itemLayers(id, level, 0);
        expect(layers.length).toBeGreaterThan(0);
        for (const layer of layers) {
          const { svg, box: frame } = layer.make();
          expect(svg).toMatch(/^<svg [^>]*viewBox=/);
          expect(svg).not.toMatch(/NaN|undefined/);
          // Cadre serré (mémoire) et dans l'emprise du bâtiment
          expect(frame.w * frame.h).toBeLessThanOrEqual(70 * 70);
          expect(frame.x).toBeGreaterThanOrEqual(-reach);
          expect(frame.x + frame.w).toBeLessThanOrEqual(reach);
        }
        expect(itemThumb(id, level).svg).not.toMatch(/NaN|undefined/);
      }
    }
  });
  it('les objets vivants s’animent : images différentes et clés distinctes, mouvement continu', () => {
    const hens = [0, 0.3, 0.6].map(t => itemLayers('poulailler', 1, t)[1]);
    expect(new Set(hens.map(l => l.key)).size).toBe(3);
    expect(new Set(hens.map(l => l.make().svg)).size).toBe(3);
    const wagon = [0, 3, 4.5].map(t => itemLayers('rails', 2, t)[1].offset[1]);
    expect(new Set(wagon).size).toBeGreaterThan(1);
    expect(itemLayers('barque', 2, 0)[0].back).toBe(true);
  });
  it('la lanterne, le four et la pièce rougie éclairent la nuit, d’une lueur chaude', () => {
    for (const [id, level] of [['lanterne-mine', 1], ['cuisine', 2], ['enclume', 2]]) {
      const light = itemLight(id, level);
      expect(light.slice(0, 4).every(Number.isFinite)).toBe(true);
      expect(light[4]).toBeUndefined();
    }
    expect(itemLight('pelle', 1)).toBeNull();
  });
  it('les pièces enchantées des paliers VI et VII luisent la nuit, chacune de sa couleur, dans l’emprise 3 × 3', () => {
    for (const id of ['citrouille', 'geode', 'golem', 'cerf', 'naiade', 'sirene', 'athanor', 'grimoire']) {
      const [u, v, z, r, color] = itemLight(id, 7);
      expect(Math.max(Math.abs(u), Math.abs(v))).toBeLessThan(1.5);
      expect(z).toBeGreaterThan(0);
      expect(r).toBeGreaterThan(0);
      if (color !== undefined) expect(color).toMatch(/^\d{1,3},\d{1,3},\d{1,3}$/);
    }
    expect(itemLight('golem', 7)[4]).toBe('120,230,255');
  });
  it('les nouveaux objets vivent : le grimoire flotte, le marteau-pilon frappe, la cane fait le tour de sa mare', () => {
    const book = [0, 1, 2].map(t => itemLayers('grimoire', 7, t)[1].offset[1]);
    expect(new Set(book).size).toBe(3);
    const hammer = [0, 0.5].map(t => itemLayers('marteau-pilon', 5, t)[0].make().svg);
    expect(hammer[0]).not.toBe(hammer[1]);
    const ducks = [0, 2, 4].map(t => itemLayers('canards', 6, t)[0].key);
    expect(new Set(ducks).size).toBe(3);
  });
});

describe('paliers des bâtiments', () => {
  const SKINS_OF = {
    foyer: ['toit-rouge', 'toit-bleu-foyer', 'toit-chaume-foyer'], carriere: ['roche-ocre', 'roche-granit', 'roche-cristal'],
    bosquet: ['printemps', 'automne', 'givre'], puits: ['toit-bleu', 'toit-chaume', 'pierre-blanche'],
    potager: ['cloture-blanche', 'cloture-pierre', 'cloture-fleurie'], atelier: ['enseigne-doree', 'toit-ardoise', 'toit-cuivre'], ponton: ['voile-rouge', 'voile-rayee', 'voile-bleue']
  };
  // Le jeu n'a plus d'autre dessin que celui de la bibliothèque : elle doit tout avoir
  it('la bibliothèque a chaque palier de chaque bâtiment, sous chaque skin et chaque teinte vendue, et sa vignette', () => {
    for (const [site, skins] of Object.entries(SKINS_OF)) {
      expect(LOOKS[site]).toHaveLength(7);
      for (let level = 1; level <= 7; level++) {
        for (const skin of ['', ...skins, ...TINT_IDS.map(tint => `${tint}-${site}`)]) {
          expect(buildingArt(site, level, skin), `${site} ${level} ${skin}`).not.toBeNull();
        }
        expect(buildingThumb(site, level), `${site} ${level}`).toBeTruthy();
        const look = lookAt(site, level);
        look.lights.forEach(light => expect(light).toHaveLength(4));
        look.smoke.forEach(at => expect(at).toHaveLength(3));
      }
    }
  });
  it('les réglages du jeu tiennent au dessin : feu au Foyer I-II, voilier au Ponton, animation cachée ou teinte là où il y en a une', () => {
    for (const [site, list] of Object.entries(LOOKS)) {
      list.forEach((look, i) => {
        const key = `${site} ${i + 1}`;
        expect(look.fire, key).toBe(site === 'foyer' && i < 2);
        expect(Boolean(look.boat), key).toBe(site === 'ponton');
        expect(Boolean(look.boat), key).toBe(Boolean(buildingArt(site, i + 1).boat));
        const animated = Boolean(buildingArt(site, i + 1).anim);
        if (look.animTint || look.animSkip('toit-bleu')) expect(animated, key).toBe(true);
      });
    }
  });
  it('l’hiver, chaque palier prend ses toits sous la neige (son jumeau de la bibliothèque) ; un skin garde son dessin', () => {
    for (const site of Object.keys(SKINS_OF)) {
      for (let level = 1; level <= 7; level++) {
        const ete = buildingArt(site, level);
        const hiver = buildingArt(site, level, '', true);
        const key = `${site} ${level}`;
        expect(hiver.base.key, key).not.toBe(ete.base.key);
        expect(Boolean(hiver.anim), key).toBe(Boolean(ete.anim));
        if (ete.anim) expect(hiver.anim.n, key).toBe(ete.anim.n);
        expect(Boolean(hiver.boat), key).toBe(Boolean(ete.boat));
        const skin = SKINS_OF[site][0];
        expect(buildingArt(site, level, skin, true), `${key} ${skin}`).toBe(buildingArt(site, level, skin));
      }
    }
  });
  it('au-delà du dernier dessin, le plus haut palier sert', () => {
    expect(lookAt('foyer', 9)).toBe(LOOKS.foyer[6]);
    expect(lookAt('carriere', 0)).toBe(LOOKS.carriere[0]);
  });
});

describe('teintes (skins qui recolorent un bâtiment à tous ses paliers)', () => {
  it('un skin dit sa teinte : teinte vendue « <teinte>-<bâtiment> », pièce rare, ou aucune', () => {
    expect(tintOf('sakura-foyer')).toBe('sakura');
    expect(tintOf('nuit-etoilee-carriere')).toBe('nuit-etoilee');
    expect(tintOf('or-royal-ponton')).toBe('or-royal');
    expect(tintOf('lampions')).toBe('lampions');
    expect(tintOf('toit-bleu')).toBeNull();
    expect(tintOf('givre')).toBeNull();
    expect(tintOf('')).toBeNull();
    expect(TINT_IDS).toHaveLength(12);
  });
  it('une teinte recolore, et garde la lueur des vitres', () => {
    expect(tintSvg('<rect fill="#FFE6A3"/><rect fill="#E06E52"/>', 'nuit-etoilee')).toMatch(/^<rect fill="#FFE6A3"\/><rect fill="#(?!E06E52)/);
    expect(tintSvg('<rect fill="#E06E52"/>', 'inconnue')).toBe('<rect fill="#E06E52"/>');
  });
  it('les mécanismes animés prennent la teinte ; le feu et l’eau non', () => {
    expect(lookAt('potager', 5).animTint).toBe(true);
    expect(lookAt('puits', 6).animTint).toBe(true);
    expect(lookAt('foyer', 1).animTint).toBe(false);
    expect(lookAt('puits', 2).animTint).toBe(false);
  });
  it('les teintes vendues et celles des pièces rares sont toutes définies', () => {
    expect(Object.keys(RARE_TINTS).sort()).toEqual(Object.keys(RARE_SPRITES).sort());
    for (const tint of [...Object.values(TINTS), ...Object.values(RARE_TINTS)]) {
      expect(Object.keys(tint).every(key => ['name', 'all', 'warm', 'leaf', 'cool', 'violet'].includes(key))).toBe(true);
    }
  });
});

describe('pièces rares (accessoire animé à tous les paliers)', () => {
  const RARE_SITE = {
    papillons: 'potager', tournesols: 'potager', 'filon-or': 'carriere', 'coeur-lave': 'carriere', fees: 'bosquet', petales: 'bosquet',
    'arc-en-ciel': 'puits', nenuphars: 'puits', pavois: 'ponton', mouettes: 'ponton', etincelles: 'atelier', engrenages: 'atelier', lampions: 'foyer', lierre: 'foyer'
  };
  it('chaque pièce se dessine à chaque palier, en calques légers', () => {
    expect(Object.keys(RARE_SPRITES).sort()).toEqual(Object.keys(RARE_SITE).sort());
    for (const [id, site] of Object.entries(RARE_SITE)) {
      for (let level = 1; level <= 7; level++) {
        expect(buildingArt(site, level, id), `${id} ${level}`).not.toBeNull();
        const layers = itemLayers(id, level, 1.3);
        expect(layers.length).toBeGreaterThan(0);
        RARE_SPRITES[id].layers.forEach((spec, k) => {
          const { svg, box: frame } = layers[k].make();
          expect(svg).not.toMatch(/NaN|undefined/);
          // Images gardées à 4× en mémoire : une image par animation petite, une image seule (décor, guirlande) bornée
          if (spec.n) expect(frame.w * frame.h).toBeLessThanOrEqual(60 * 60);
          expect(frame.w * frame.h).toBeLessThanOrEqual(240 * 240);
          expect(frame.x).toBeGreaterThanOrEqual(-140);
          expect(frame.x + frame.w).toBeLessThanOrEqual(140);
        });
      }
    }
  });
  it('les petites bêtes bougent, la crête suit chaque palier, la forge crache par sa cheminée', () => {
    const fly = [0, 1, 2].map(t => itemLayers('papillons', 4, t)[1].offset.join());
    expect(new Set(fly).size).toBe(3);
    expect(crestOf('foyer', 7)[1]).toBeLessThan(crestOf('foyer', 1)[1]);
    expect(crestOf('foyer', 9)).toEqual(crestOf('foyer', 7));
    FORGE_CHIMNEYS.forEach((at, i) => expect(lookAt('atelier', i + 1).smoke).toContainEqual(at));
  });
  it('certaines pièces luisent la nuit ; les lucioles déplacent leur lueur', () => {
    for (const id of ['lampions', 'lierre', 'fees', 'coeur-lave', 'filon-or', 'etincelles', 'engrenages']) {
      const lights = rareLights(id, 5, 0.7);
      expect(lights.length).toBeGreaterThan(0);
      lights.forEach(([x, y, r, color, strength]) => {
        expect([x, y, r, strength].every(Number.isFinite)).toBe(true);
        expect(color).toMatch(/^\d{1,3},\d{1,3},\d{1,3}$/);
      });
    }
    expect(rareLights('lierre', 2, 0)[0]).not.toEqual(rareLights('lierre', 2, 3)[0]);
    expect(rareLights('papillons', 2, 0)).toEqual([]);
    expect(rareLights('toit-bleu', 2, 0)).toEqual([]);
  });
});

describe('heure de l’île', () => {
  const day = new Date(2026, 9, 4);
  const { rise, set, noon } = sunTimes(day);
  const clear = h => phaseAt(new Date(2026, 9, 4, 0, Math.round(h * 60)), { weather: 'clair' });
  it('le soleil se lève et se couche selon la date (France) : journées longues l’été, courtes l’hiver', () => {
    expect(rise).toBeLessThan(noon);
    expect(set).toBeGreaterThan(noon);
    expect(set - rise).toBeGreaterThan(10.8);
    expect(set - rise).toBeLessThan(11.6);
    const june = sunTimes(new Date(2026, 5, 21));
    const december = sunTimes(new Date(2026, 11, 21));
    expect(june.set - june.rise).toBeGreaterThan(15.5);
    expect(december.set - december.rise).toBeLessThan(8.8);
  });
  it('une averse passe sur un ciel clair (la Pluie écrite) : elle monte, culmine en pluie, et repart', () => {
    const at = shower => phaseAt(new Date(2026, 9, 4, 13), { weather: 'clair', shower }).weather;
    expect(at(0)).toEqual(at(undefined));
    expect(at(0.3)).toMatchObject({ kind: 'clair' });
    expect(at(0.3).rain).toBeCloseTo(0.3);
    expect(at(1)).toMatchObject({ kind: 'pluie', rain: 1, storm: 0 });
  });
  it('la journée passe par tous ses moments : nuit, aube, matin, midi, après-midi, couchant, crépuscule', () => {
    expect(at(2).id).toBe('night');
    expect(clear(rise - 0.3).id).toBe('dawn');
    expect(clear(rise + 1).id).toBe('morning');
    expect(clear(noon).id).toBe('noon');
    expect(clear(set - 2).id).toBe('afternoon');
    expect(clear(set - 0.1).id).toBe('sunset');
    expect(clear(set + 0.6).id).toBe('dusk');
    expect(at(23, 30).id).toBe('night');
    expect(clear(set - 0.1).label).toBe('Couchant');
  });
  it('la lumière change doucement : midi blanc, couchant orangé, crépuscule rosé, nuit bleue ; les lumières suivent', () => {
    const noonSky = clear(noon);
    expect(noonSky.tint).toBe('#ffffff');
    expect(noonSky.night).toBe(0);
    expect(noonSky.lit).toBe(0);
    const sunset = clear(set - 0.1).tint;
    const [r, g, b] = [1, 3, 5].map(i => parseInt(sunset.slice(i, i + 2), 16));
    expect(r).toBeGreaterThan(g);
    expect(g).toBeGreaterThan(b);
    const dusk = clear(set + 0.4).tint;
    expect(parseInt(dusk.slice(5, 7), 16)).toBeGreaterThan(parseInt(dusk.slice(3, 5), 16));
    expect(at(0).night).toBe(1);
    expect(at(0).lit).toBe(1);
    // Minute après minute, pas de saut de couleur
    for (let h = 0; h < 24; h += 1 / 30) {
      const a = clear(h).tint;
      const b = clear(h + 1 / 60).tint;
      [1, 3, 5].forEach(i => expect(Math.abs(parseInt(a.slice(i, i + 2), 16) - parseInt(b.slice(i, i + 2), 16))).toBeLessThan(12));
    }
  });
  it('la météo de l’île : même temps pour une même date, quelques jours de pluie, des transitions douces', () => {
    const date = new Date(2026, 9, 4, 15, 0);
    expect(weatherAt(date)).toEqual(weatherAt(new Date(date)));
    const kinds = {};
    for (let d = 0; d < 365; d++) {
      const w = weatherAt(new Date(2026, 0, 1 + d, 15, 0));
      kinds[w.kind] = (kinds[w.kind] || 0) + 1;
    }
    expect(kinds.clair).toBeGreaterThan(90);
    expect(kinds.pluie).toBeGreaterThan(15);
    expect(kinds.orage || 0).toBeLessThan(40);
    for (let m = 0; m < 24 * 60; m += 3) {
      const a = weatherAt(new Date(2026, 9, 4, 0, m));
      const b = weatherAt(new Date(2026, 9, 4, 0, m + 1));
      expect(Math.abs(a.cover - b.cover)).toBeLessThan(0.06);
      expect(Math.abs(a.rain - b.rain)).toBeLessThan(0.06);
    }
    // La brume ne tient que le matin ; un temps imposé reste imposé
    expect(weatherAt(new Date(2026, 9, 4, 0, Math.round((rise + 0.8) * 60)), 'brume').mist).toBeGreaterThan(0.9);
    expect(weatherAt(new Date(2026, 9, 4, 17, 0), 'brume').mist).toBe(0);
    expect(weatherAt(date, 'orage')).toMatchObject({ kind: 'orage', rain: 1, storm: 1 });
  });
  it('un ciel couvert grisaille la lumière et allume les fenêtres plus tôt', () => {
    const grey = phaseAt(new Date(2026, 9, 4, 0, Math.round(noon * 60)), { weather: 'orage' });
    expect(grey.tint).not.toBe('#ffffff');
    expect(grey.lit).toBeGreaterThan(0.2);
    expect(grey.weather.label).toBe('Orage');
    expect(grey.warm).toBeLessThan(0.1);
  });
  it('l’horloge affiche l’heure sur deux chiffres', () => {
    expect(clockText(new Date(2026, 9, 4, 7, 5))).toBe('07:05');
    expect(clockText(new Date(2026, 9, 4, 19, 42))).toBe('19:42');
  });
});
