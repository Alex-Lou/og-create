// Carnet invité (services/playService.js) : un appareil neuf le crée avant sa première requête (pas de 401 NO_PLAYER),
// un appareil connu n'en redemande pas, et un cookie expiré est rattrapé par un seul nouvel essai
import { describe, it, expect, vi, beforeEach } from 'vitest';
import playService from '@/services/playService';

const http = vi.hoisted(() => ({ get: vi.fn(), post: vi.fn() }));
vi.mock('@/services/http', () => ({ default: http }));

const NO_PLAYER = { response: { status: 401, data: { code: 'NO_PLAYER' } } };
let store;

beforeEach(() => {
  store = new Map();
  vi.stubGlobal('localStorage', { getItem: k => (store.has(k) ? store.get(k) : null), setItem: (k, v) => store.set(k, v) });
  http.get.mockReset();
  http.post.mockReset();
  http.post.mockResolvedValue({ data: { kind: 'guest' } });
});

describe('carnet invité', () => {
  it('un appareil neuf crée un seul carnet avant ses requêtes, même en parallèle', async () => {
    http.get.mockResolvedValue({ data: { ok: true } });
    await Promise.all([playService.state(), playService.book()]);
    expect(http.post).toHaveBeenCalledTimes(1);
    expect(http.post).toHaveBeenCalledWith('/play/guest');
    expect(http.post.mock.invocationCallOrder[0]).toBeLessThan(http.get.mock.invocationCallOrder[0]);
    expect(http.get).toHaveBeenCalledTimes(2);
  });

  it('un appareil connu ne redemande pas de carnet', async () => {
    store.set('oc_player_known', '1');
    http.get.mockResolvedValue({ data: { ok: true } });
    await playService.state();
    expect(http.post).not.toHaveBeenCalled();
  });

  it('un cookie expiré : un carnet, puis un seul nouvel essai', async () => {
    store.set('oc_player_known', '1');
    http.get.mockRejectedValueOnce(NO_PLAYER).mockResolvedValueOnce({ data: { ok: true } });
    expect(await playService.state()).toEqual({ ok: true });
    expect(http.post).toHaveBeenCalledTimes(1);
    expect(http.get).toHaveBeenCalledTimes(2);
  });

  it('un carnet impossible à créer laisse la requête dire ce qui ne va pas', async () => {
    http.post.mockRejectedValue({ response: { status: 429 } });
    http.get.mockRejectedValue({ response: { status: 500 } });
    await expect(playService.state()).rejects.toEqual({ response: { status: 500 } });
  });
});

// L'expression de l'avatar (choix du 15 oct.) : la neutre, celle par défaut, ne part pas (le serveur ne connaît le choix
// qu'à partir de son correctif) ; une autre part telle quelle ; un exemple part par son nom
describe('avatar : l\'expression', () => {
  it('la neutre ne part pas, une autre si', async () => {
    store.set('oc_player_known', '1');
    http.post.mockResolvedValue({ data: { ok: true } });
    await playService.worldAvatar({ genre: 'femme', expression: 'neutre' });
    expect(http.post).toHaveBeenLastCalledWith('/play/world/avatar', { choices: { genre: 'femme' } });
    await playService.worldAvatar({ genre: 'femme', expression: 'triste' });
    expect(http.post).toHaveBeenLastCalledWith('/play/world/avatar', { choices: { genre: 'femme', expression: 'triste' } });
    await playService.worldAvatar('avatar-03');
    expect(http.post).toHaveBeenLastCalledWith('/play/world/avatar', { look: 'avatar-03' });
  });
});
