import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { load, save, loadText, saveText } from '../src/utils/storage';

// Une mémoire de l'appareil de banc : un Map derrière l'API de localStorage
function memoryStorage() {
  const map = new Map();
  return {
    map,
    getItem: key => (map.has(key) ? map.get(key) : null),
    setItem: (key, value) => map.set(key, String(value)),
    removeItem: key => map.delete(key)
  };
}

describe('la mémoire de l’appareil', () => {
  let store;
  beforeEach(() => {
    store = memoryStorage();
    vi.stubGlobal('localStorage', store);
  });
  afterEach(() => vi.unstubAllGlobals());

  it('en JSON : ce qu’on garde se relit, la valeur par défaut sinon', () => {
    save('oc_wrecks', ['lisiere']);
    expect(store.map.get('oc_wrecks')).toBe('["lisiere"]');
    expect(load('oc_wrecks', [])).toEqual(['lisiere']);
    expect(load('oc_absent', [])).toEqual([]);
  });
  it('en texte brut : le format déjà écrit sur les appareils ne change pas (pas de guillemets JSON)', () => {
    store.map.set('oc_night_told', 'nuit-3');
    expect(loadText('oc_night_told')).toBe('nuit-3');
    saveText('oc_arrival_seen', String(42));
    expect(store.map.get('oc_arrival_seen')).toBe('42');
    expect(loadText('oc_absent')).toBe(null);
  });
  it('stockage bloqué : la lecture rend null, l’écriture ne lève pas', () => {
    vi.stubGlobal('localStorage', {
      getItem() { throw new Error('bloqué'); },
      setItem() { throw new Error('bloqué'); }
    });
    expect(loadText('oc_night_told')).toBe(null);
    expect(() => saveText('oc_night_told', 'nuit-3')).not.toThrow();
    expect(load('oc_wrecks', [])).toEqual([]);
  });
});
