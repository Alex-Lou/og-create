// Les calques de la carte voyagent une fois (services/http.js) : gardés en mémoire avec leur clé, envoyée au serveur
// (X-Map-Key) ; une vue reçue sans eux, seule ou dans une réponse d'action, les retrouve ; une autre clé les remplace
import { describe, it, expect, beforeEach } from 'vitest';
import http from '@/services/http';

const LAYERS = { grid: ['0'], height: ['1'], ground: ['g'], region: ['a'] };
let answer;
let sent;
beforeEach(() => {
  http.defaults.adapter = config => {
    sent = config.headers['X-Map-Key'];
    return Promise.resolve({ data: JSON.parse(JSON.stringify(answer)), status: 200, statusText: '', headers: {}, config });
  };
});

describe('calques de la carte', () => {
  it('gardés à la première vue, puis remis dans les vues qui arrivent sans eux', async () => {
    answer = { size: 1, map: { key: '5:', zones: [], ...LAYERS } };
    const first = (await http.get('/play/world')).data;
    expect(first.map.ground).toEqual(['g']);
    answer = { size: 1, map: { key: '5:', zones: [{ id: 'coeur' }] } };
    const light = (await http.get('/play/world')).data;
    expect(sent).toBe('5:');
    expect(light.map).toEqual({ key: '5:', zones: [{ id: 'coeur' }], ...LAYERS });
  });

  it('dans une réponse d’action aussi', async () => {
    answer = { coins: 3, world: { size: 1, map: { key: '5:', zones: [] } } };
    const done = (await http.post('/play/world/zone', {})).data;
    expect(done.world.map.region).toEqual(['a']);
  });

  it('une nouvelle clé (un quartier découvert) remplace les calques gardés', async () => {
    answer = { size: 1, map: { key: '5:x', zones: [], ...LAYERS, ground: ['l'] } };
    await http.get('/play/world');
    answer = { size: 1, map: { key: '5:x', zones: [] } };
    const light = (await http.get('/play/world')).data;
    expect(sent).toBe('5:x');
    expect(light.map.ground).toEqual(['l']);
  });

  it('une vue sans calques ni clé connue reste telle quelle', async () => {
    answer = { size: 1, map: { key: 'autre', zones: [] } };
    const view = (await http.get('/play/world')).data;
    expect(view.map.ground).toBeUndefined();
  });
});
