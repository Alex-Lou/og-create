// Le client HTTP (services/http.js) face à un serveur qui dort ou qui peine : une lecture (GET) sans réponse, ou
// répondue 502/503/504, est refaite après 1, 2, 4, 8 puis 15 s, dans un budget de 90 s ; une écriture n'est jamais
// refaite ; une vraie réponse d'erreur (500, 404…) non plus. Le réseau est simulé par l'adaptateur d'axios.
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import http from '@/services/http';

// Réponses à donner, dans l'ordre : un statut, ou 'reseau' (aucune réponse) ; les appels reçus sont notés
let script = [];
let calls = [];
beforeEach(() => {
  vi.useFakeTimers();
  calls = [];
  http.defaults.adapter = config => {
    calls.push(config.method);
    const next = script.shift();
    if (next === 'reseau') return Promise.reject(Object.assign(new Error('Network Error'), { code: 'ERR_NETWORK', config }));
    const response = { data: { ok: next === 200 }, status: next, statusText: '', headers: {}, config };
    return next < 400 ? Promise.resolve(response) : Promise.reject(Object.assign(new Error(`HTTP ${next}`), { response, config }));
  };
});
afterEach(() => {
  vi.useRealTimers();
});

// Laisse passer le temps simulé tant que la demande n'est pas réglée
async function settle(promise) {
  let result;
  promise.then(value => { result = { value }; }, error => { result = { error }; });
  for (let i = 0; i < 200 && !result; i++) await vi.advanceTimersByTimeAsync(1000);
  return result;
}

describe('le client HTTP face à un serveur qui dort', () => {
  it('refait une lecture restée sans réponse, ou répondue 503, jusqu’à la réponse', async () => {
    script = ['reseau', 503, 'reseau', 200];
    const { value } = await settle(http.get('/play/state'));
    expect(value.data).toEqual({ ok: true });
    expect(calls).toEqual(['get', 'get', 'get', 'get']);
  });

  it('ne refait jamais une écriture, ni une lecture répondue par une vraie erreur', async () => {
    script = ['reseau'];
    const post = await settle(http.post('/play/combine', {}));
    expect(post.error.code).toBe('ERR_NETWORK');
    script = [500];
    const get = await settle(http.get('/play/book'));
    expect(get.error.response.status).toBe(500);
    expect(calls).toEqual(['post', 'get']);
  });

  it('abandonne passé le budget de 90 s', async () => {
    script = Array(20).fill('reseau');
    const { error } = await settle(http.get('/play/state'));
    expect(error.code).toBe('ERR_NETWORK');
    // 1 + 2 + 4 + 8 + 15 × 5 = 90 s : la première demande et 9 nouveaux essais
    expect(calls.length).toBe(10);
  });
});
