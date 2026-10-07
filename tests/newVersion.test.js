// Une mise à jour en ligne (utils/newVersion.js) : version.json relu au retour sur l'onglet et toutes les 10 minutes ;
// une autre empreinte est dite une seule fois
import { describe, it, expect, vi, afterEach } from 'vitest';
import { watchVersion } from '@/utils/newVersion';

const page = () => {
  const listeners = new Set();
  return {
    hidden: false,
    addEventListener: (type, fn) => listeners.add(fn),
    removeEventListener: (type, fn) => listeners.delete(fn),
    back() { listeners.forEach(fn => fn()); },
    listeners
  };
};
const served = version => vi.fn(async () => ({ ok: true, json: async () => ({ version }) }));
const settle = () => new Promise(resolve => setTimeout(resolve, 0));

describe('une nouvelle version en ligne', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it('se dit au retour sur l’onglet, une seule fois ; la même version ne dit rien', async () => {
    const doc = page();
    vi.stubGlobal('document', doc);
    const same = served('a1');
    const quiet = vi.fn();
    watchVersion(quiet, { current: 'a1', fetcher: same });
    doc.back();
    await settle();
    expect(same).toHaveBeenCalledTimes(1);
    expect(same.mock.calls[0][0]).toMatch(/^\/version\.json\?t=\d+$/);
    expect(same.mock.calls[0][1]).toEqual({ cache: 'no-store' });
    expect(quiet).not.toHaveBeenCalled();

    const fresh = served('b2');
    const told = vi.fn();
    const stop = watchVersion(told, { current: 'a1', fetcher: fresh });
    doc.back();
    await settle();
    doc.back();
    await settle();
    expect(told).toHaveBeenCalledTimes(1);
    expect(told).toHaveBeenCalledWith('b2');
    stop();
  });

  it('relit toutes les 10 minutes ; rien quand l’onglet est caché, hors ligne, ou sans empreinte (développement)', async () => {
    vi.useFakeTimers();
    const doc = page();
    vi.stubGlobal('document', doc);
    const fresh = served('b2');
    const told = vi.fn();
    const stop = watchVersion(told, { current: 'a1', fetcher: fresh });
    doc.hidden = true;
    await vi.advanceTimersByTimeAsync(10 * 60000);
    expect(fresh).not.toHaveBeenCalled();
    doc.hidden = false;
    await vi.advanceTimersByTimeAsync(10 * 60000);
    expect(told).toHaveBeenCalledWith('b2');
    stop();
    expect(doc.listeners.size).toBe(0);

    const offline = vi.fn(async () => { throw new Error('hors ligne'); });
    const never = vi.fn();
    watchVersion(never, { current: 'a1', fetcher: offline });
    doc.back();
    await vi.advanceTimersByTimeAsync(0);
    expect(never).not.toHaveBeenCalled();

    const dev = vi.fn();
    watchVersion(never, { current: undefined, fetcher: dev });
    await vi.advanceTimersByTimeAsync(20 * 60000);
    expect(dev).not.toHaveBeenCalled();
  });
});
