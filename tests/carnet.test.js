import { describe, expect, it } from 'vitest';
import { clearCarnet, readCarnet, writeCarnet } from '@/utils/carnet';

const memory = () => {
  const data = {};
  return {
    getItem: key => (key in data ? data[key] : null),
    setItem: (key, value) => { data[key] = String(value); },
    removeItem: key => { delete data[key]; }
  };
};

const STATE = { elements: ['Eau', 'Feu', 'Vapeur'], known: { Vapeur: { emoji: '♨️', family: 'Matériaux' } }, families: { Matériaux: 48 } };

describe('carnet sur l’appareil', () => {
  it('rend le carnet du même compte', () => {
    const storage = memory();
    writeCarnet(7, STATE, storage);
    expect(readCarnet(7, storage)).toEqual(STATE);
  });
  it('ne montre jamais le carnet d’un autre compte', () => {
    const storage = memory();
    writeCarnet(7, STATE, storage);
    expect(readCarnet(8, storage)).toBeNull();
  });
  it('ignore une copie absente, illisible ou effacée', () => {
    const storage = memory();
    expect(readCarnet(7, storage)).toBeNull();
    storage.setItem('oc_carnet', '{pas du json');
    expect(readCarnet(7, storage)).toBeNull();
    writeCarnet(7, STATE, storage);
    clearCarnet(storage);
    expect(readCarnet(7, storage)).toBeNull();
  });
  it('un stockage indisponible ne casse rien', () => {
    const broken = { getItem: () => { throw new Error('bloqué'); }, setItem: () => { throw new Error('plein'); }, removeItem: () => { throw new Error('bloqué'); } };
    expect(() => writeCarnet(7, STATE, broken)).not.toThrow();
    expect(readCarnet(7, broken)).toBeNull();
    expect(() => clearCarnet(broken)).not.toThrow();
  });
});
