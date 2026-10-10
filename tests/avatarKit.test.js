import { describe, it, expect } from 'vitest';
import { isCustom, loadKit, customFrames, turnFrame, TURN } from '@/game/avatarKit';
import { CATALOG, freeChoicesOf } from '@/game/avatarCatalog';
import { avatarFrames } from '@/game/sceneArt';

describe('avatar composé', () => {
  it('reconnaît des choix (et non un exemple)', () => {
    expect(isCustom({ coupe: 'courte' })).toBe(true);
    expect(isCustom('avatar-03')).toBe(false);
    expect(isCustom(null)).toBe(false);
    expect(isCustom([])).toBe(false);
  });

  it('part d’un exemple sans rien de ce qui se gagne', () => {
    for (const id of Object.keys(CATALOG.exemples)) {
      const o = freeChoicesOf(id);
      for (const a of Object.values(o.accessoires)) {
        expect(CATALOG.accessoires[a.id].source).toBe('gratuit');
        expect(CATALOG.accessoires[a.id].saison).toBeUndefined();
      }
      for (const key of ['cheveux', 'couleurMeches', 'couleurHaut', 'couleurBas', 'chaussures']) expect(CATALOG.teintures[o[key]]).toBeUndefined();
    }
    // L'exemple 11 porte des ailes (coffre) et des barrettes nacrées (teinture) : les ailes partent, la nacre aussi
    const o = freeChoicesOf('avatar-11');
    expect(o.accessoires.dos).toBeUndefined();
    expect(o.accessoires.cheveux).toEqual({ id: 'barrettes', couleurs: ['soleil'] });
    expect(freeChoicesOf({ ...CATALOG.defaut, coupe: 'locks' }).coupe).toBe('locks');
  });

  it('dessine les poses des scènes et le tour sur soi-même, une fois le générateur chargé', async () => {
    const choices = freeChoicesOf('avatar-05');
    expect(avatarFrames(choices, {})).toEqual([]);
    await loadKit();
    const face = customFrames(choices, { vue: 'face', pose: 'grelotter', naufrage: true });
    expect(face).toHaveLength(2);
    expect(face[0].startsWith('data:image/svg+xml')).toBe(true);
    expect(customFrames(choices, { vue: 'avant', pose: 'repos' })).toHaveLength(1);
    expect(avatarFrames(choices, { vue: 'face', pose: 'salut', naufrage: false })).toHaveLength(2);
    expect(new Set(TURN.map(step => turnFrame(choices, step))).size).toBe(TURN.length);
    // Un choix inconnu ne dessine rien (jamais un dessin faux)
    expect(customFrames({ ...choices, coupe: 'iroquoise' }, {})).toEqual([]);
  });
});

// Le démarrage ne doit pas emporter le catalogue de l'éditeur (avatar.json, ~260 Ko) : seul avatarCatalog.js le lit
describe('catalogue de l’éditeur hors du démarrage', () => {
  it('avatar.json n’est importé que par game/avatarCatalog.js', async () => {
    const { readFileSync, readdirSync, statSync } = await import('node:fs');
    const { join } = await import('node:path');
    const files = [];
    const walk = dir => readdirSync(dir).forEach(name => {
      const path = join(dir, name);
      if (statSync(path).isDirectory()) walk(path);
      else if (/\.(js|vue)$/.test(name)) files.push(path);
    });
    walk(join(__dirname, '../src'));
    const importers = files.filter(f => /avatar\/avatar\.json/.test(readFileSync(f, 'utf8'))).map(f => f.split('/src/')[1]);
    expect(importers).toEqual(['game/avatarCatalog.js']);
  });
});
