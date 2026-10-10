// Rapports d'erreur du jeu (utils/errorReport.js) : envoyés une fois chacun, cinq au plus par page, avec l'écran et la
// version ; jamais pour le réseau, une annulation, la boucle de ResizeObserver ou un script d'une autre origine
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { reportError, worthReporting, setErrorMode, resetErrorReport, MAX_PER_PAGE } from '@/utils/errorReport';

// (vi.mock est remonté avant les imports : le module lit ce faux client HTTP)
const post = vi.hoisted(() => vi.fn(() => Promise.resolve({ status: 204 })));
vi.mock('@/services/http', () => ({ default: { post: (...args) => post(...args) } }));

beforeEach(() => {
  vi.stubGlobal('location', { origin: 'https://brumelune.eu' });
  post.mockClear();
  resetErrorReport();
});

describe('rapports d’erreur', () => {
  it('une erreur part une fois, avec l’écran affiché', () => {
    setErrorMode('world');
    expect(reportError({ kind: 'vue', message: 'x is undefined', info: 'render function' })).toBe(true);
    expect(reportError({ kind: 'vue', message: 'x is undefined', info: 'render function' })).toBe(false);
    expect(post).toHaveBeenCalledTimes(1);
    const [route, body] = post.mock.calls[0];
    expect(route).toBe('/client-errors');
    expect(body).toMatchObject({ kind: 'vue', message: 'x is undefined', info: 'render function', mode: 'world' });
    expect(Object.keys(body)).toContain('version');
  });

  it(`${MAX_PER_PAGE} rapports au plus par page`, () => {
    for (let i = 0; i < 9; i++) reportError({ kind: 'error', message: `boom ${i}` });
    expect(post).toHaveBeenCalledTimes(MAX_PER_PAGE);
  });

  it('ni réseau, ni annulation, ni boucle de ResizeObserver, ni script d’une autre origine, ni message vide', () => {
    expect(worthReporting({ message: 'Network Error', error: { isAxiosError: true } })).toBe(false);
    expect(worthReporting({ message: 'canceled', error: { name: 'CanceledError' } })).toBe(false);
    expect(worthReporting({ message: 'ResizeObserver loop completed with undelivered notifications.' })).toBe(false);
    expect(worthReporting({ message: 'x', source: 'chrome-extension://abc/content.js:1:2' })).toBe(false);
    expect(worthReporting({ message: 'x', source: 'https://ailleurs.example/script.js:1:2' })).toBe(false);
    expect(worthReporting({ message: '' })).toBe(false);
    expect(worthReporting({ message: 'x is undefined', source: 'https://brumelune.eu/js/index.js:1:2' })).toBe(true);
    expect(worthReporting({ message: 'x is undefined' })).toBe(true);
  });

  it('un envoi qui échoue ne lève rien', async () => {
    post.mockImplementationOnce(() => Promise.reject(new Error('hors ligne')));
    expect(() => reportError({ kind: 'error', message: 'boom' })).not.toThrow();
    await Promise.resolve();
  });
});
