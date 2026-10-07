import { describe, it, expect } from 'vitest';
import { LANDMARK_SPRITES, landmarkLayers, landmarkLight, landmarkThumb, landmarkTop, landmarkScale } from '@/world/landmarkSprites';
import { landmarksShown, landmarksWaiting, landmarkTip } from '@/world/landmarks';

// Les 13 lieux remarquables du serveur (services/landmarks.js), mêmes identifiants
const IDS = ['grotte', 'lac', 'col', 'menhirs', 'arche', 'saule', 'pilotis', 'oasis', 'pyramide', 'arbre', 'cascade', 'geyser', 'cratere'];

describe('lieux remarquables : dessins', () => {
  it('chaque lieu du serveur a son dessin animé, propre à chaque image', () => {
    expect(Object.keys(LANDMARK_SPRITES).sort()).toEqual([...IDS].sort());
    for (const id of IDS) {
      const keys = new Set();
      for (const t of [0, 0.37, 1.9, 3.3]) {
        const layers = landmarkLayers(id, t);
        expect(layers.length).toBeGreaterThan(0);
        // Le dessin de la bibliothèque (lu à la demande : load, decorArt.js), sinon les calques du code (svg)
        for (const layer of layers) {
          const { svg, load, box } = layer.make();
          expect(Boolean(svg || load)).toBe(true);
          if (svg) expect(svg).not.toMatch(/NaN|undefined|Infinity/);
          expect(box.w).toBeGreaterThan(0);
          expect(layer.key).toMatch(new RegExp(`landmark-${id}|lieu-${id}`));
          keys.add(layer.key);
        }
      }
      // Animé : plusieurs images au fil du temps
      expect(keys.size).toBeGreaterThan(1);
      expect(landmarkThumb(id).svg).toContain('<svg');
      expect(landmarkTop(id)).toBeLessThan(-30);
    }
    // Plus grands que leur case, sauf la cascade, qui suit sa falaise
    expect(landmarkScale('arbre')).toBeGreaterThan(1);
    expect(landmarkScale('cascade')).toBe(1);
    expect(landmarkLayers('nulle-part')).toEqual([]);
    expect(landmarkThumb('nulle-part')).toBeNull();
  });
  it('lumières de nuit : la grotte, les menhirs, la cabane ; la lave brûle même de jour', () => {
    expect(landmarkLight('cratere')[5]).toBe(true);
    for (const id of ['grotte', 'menhirs', 'pilotis']) expect(landmarkLight(id)[5]).toBe(false);
    expect(landmarkLight('arche')).toBeNull();
    for (const id of IDS) {
      const light = landmarkLight(id);
      if (light) expect(light[4]).toMatch(/^\d+,\d+,\d+$/);
    }
  });
});

describe('lieux remarquables : ce que montre l’île', () => {
  const state = {
    map: { zones: [{ id: 'menhirs', owned: true }, { id: 'falaises', owned: false }, { id: 'neiges', known: false }] },
    landmarks: [
      { id: 'menhirs', zone: 'menhirs', x: 13, y: 22, found: false },
      { id: 'arche', zone: 'falaises', x: 3, y: 14, found: false },
      { id: 'grotte', zone: 'neiges', known: false }
    ]
  };
  it('les lieux des quartiers connus ; à découvrir : ceux d’un quartier à soi', () => {
    expect(landmarksShown(state).map(l => l.id)).toEqual(['menhirs', 'arche']);
    expect(landmarksWaiting(state).map(l => l.id)).toEqual(['menhirs']);
    expect(landmarksWaiting({ ...state, landmarks: [{ ...state.landmarks[0], found: true }] })).toEqual([]);
    expect(landmarksShown(null)).toEqual([]);
    expect(landmarksShown({ map: { zones: [] } })).toEqual([]);
  });
  it('Brume dit un mot à chaque découverte, une seule fois par lieu', () => {
    for (const id of IDS) {
      const tip = landmarkTip({ id });
      expect(tip.id).toBe(`landmark-${id}`);
      expect(tip.text).toMatch(/Carnet d’explorateur/);
    }
    expect(landmarkTip({ id: 'nulle-part' })).toBeNull();
  });
});
