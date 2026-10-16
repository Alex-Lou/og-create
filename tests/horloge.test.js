// L'horloge d'une partie chronométrée (game/stage/horloge.js) : elle se met en pause quand la page est cachée
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { horlogeDePartie } from '@/game/stage/horloge';

// (une page qu'on cache et qu'on montre : les tests tournent sans navigateur)
let page;
const basculer = cachee => {
  page.hidden = cachee;
  page.dispatchEvent(new Event('visibilitychange'));
};

describe('horloge de partie', () => {
  beforeEach(() => {
    page = Object.assign(new EventTarget(), { hidden: false });
    vi.stubGlobal('document', page);
  });
  afterEach(() => vi.unstubAllGlobals());

  it('ne compte rien avant le départ, puis le temps écoulé', () => {
    let t = 1000;
    const h = horlogeDePartie(() => t);
    expect(h.started).toBe(false);
    expect(h.elapsed()).toBe(0);
    h.start();
    t = 4000;
    expect(h.started).toBe(true);
    expect(h.elapsed()).toBe(3000);
    h.stop();
  });

  it('s’arrête tant que la page est cachée (un appel, une notification), puis reprend où elle en était', () => {
    let t = 0;
    const h = horlogeDePartie(() => t);
    h.start();
    t = 5000;
    basculer(true);
    t = 65000;
    expect(h.elapsed()).toBe(5000);
    basculer(false);
    t = 67000;
    expect(h.elapsed()).toBe(7000);
    h.stop();
  });

  it('ne s’occupe plus de la page une fois arrêtée', () => {
    let t = 0;
    const h = horlogeDePartie(() => t);
    h.start();
    h.stop();
    t = 1000;
    basculer(true);
    t = 3000;
    expect(h.elapsed()).toBe(3000);
  });
});
