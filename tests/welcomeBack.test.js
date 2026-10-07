// Retour d'un compte en pause ou en partance : la connexion répond back ('suspendu' ou 'suppression'), l'appareil le
// garde le temps du rechargement (services/authService.js), puis Brume accueille le joueur (App/account.js, BACK_LINES)
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import http from '@/services/http';
import AuthService, { BACK_KEY } from '@/services/authService';
import { BACK_LINES } from '@/components/App/App/account';

let memory;
let answer;
beforeEach(() => {
  memory = new Map();
  vi.stubGlobal('localStorage', { getItem: k => (memory.has(k) ? memory.get(k) : null), setItem: (k, v) => memory.set(k, String(v)), removeItem: k => memory.delete(k) });
  vi.stubGlobal('window', { location: { reload: vi.fn(), href: 'http://localhost/' } });
  http.defaults.adapter = config => Promise.resolve({ data: answer, status: 200, statusText: '', headers: {}, config });
});
afterEach(() => {
  vi.unstubAllGlobals();
});

describe('retour d’un compte', () => {
  it('garde « suspendu » ou « suppression » le temps du rechargement', async () => {
    answer = { userId: 7, username: 'banc', back: 'suppression' };
    await AuthService.login('banc@exemple.fr', 'Banc-local-2026!');
    expect(JSON.parse(memory.get(BACK_KEY))).toBe('suppression');
    expect(window.location.reload).toHaveBeenCalled();
  });

  it('ne garde rien pour une connexion ordinaire', async () => {
    answer = { userId: 7, username: 'banc' };
    await AuthService.login('banc@exemple.fr', 'Banc-local-2026!');
    expect(memory.has(BACK_KEY)).toBe(false);
  });

  it('Brume a un mot pour chaque retour', () => {
    expect(Object.keys(BACK_LINES).sort()).toEqual(['suppression', 'suspendu']);
    Object.values(BACK_LINES).forEach(line => expect(line).toMatch(/^Te revoilà/));
  });
});
