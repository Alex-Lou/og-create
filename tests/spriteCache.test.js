// Le cache des dessins de l'île (world/spriteCache.js) : chaque dessin n'est rendu qu'au détail où l'île le montre ;
// un dézoom réduit l'image déjà rendue sans relire le SVG ; la mémoire tient dans son budget ; un dessin qui arrive
// redessine l'île une seule fois, à l'image suivante (world/view/draw/loop.js, repaintSoon). Le navigateur est simulé :
// une image « se lit » à la tâche suivante, à la taille écrite dans son SVG ; un canvas ne fait que retenir sa taille.
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

let decodes = 0;
beforeEach(() => {
  vi.resetModules();
  decodes = 0;
  globalThis.document = { createElement: () => ({ width: 0, height: 0, getContext: () => ({ drawImage() {} }) }) };
  globalThis.Image = class {
    set src(url) {
      decodes++;
      const [, w, h] = decodeURIComponent(url).match(/width="([\d.]+)" height="([\d.]+)"/);
      setTimeout(() => {
        this.naturalWidth = Number(w);
        this.naturalHeight = Number(h);
        this.onload();
      });
    }
  };
  globalThis.requestAnimationFrame = cb => setTimeout(() => cb(performance.now()));
});
afterEach(() => {
  delete globalThis.document;
  delete globalThis.Image;
  delete globalThis.requestAnimationFrame;
});

const settle = () => new Promise(resolve => setTimeout(resolve, 5));
// Un dessin par code de 10 × 20 unités du monde, et un faux contexte qui note la taille des images dessinées
const make = () => ({ svg: '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="20" viewBox="0 0 10 20"/>', box: { x: -5, y: -20, w: 10, h: 20 } });
const ctx = () => ({ drawn: [], drawImage(img) { this.drawn.push(img.width); } });

describe('le cache des dessins', () => {
  it('rend un dessin au détail de l’écran seulement, puis le réduit sans relire le SVG', async () => {
    const cache = await import('@/world/spriteCache');
    cache.setSpriteDetail(1.4);
    const c = ctx();
    expect(cache.drawSprite(c, 'arbre', make, 0, 0)).toBe(false);
    await settle();
    expect(cache.drawSprite(c, 'arbre', make, 0, 0)).toBe(true);
    // Détail 2 (le plus petit au-dessus de 1,4) : 20 × 40 pixels, et non 40 × 80 comme avant
    expect(c.drawn).toEqual([20]);
    expect(decodes).toBe(1);
    // Vu de loin : l'image est réduite tout de suite, sans nouvelle lecture
    cache.setSpriteDetail(0.7);
    expect(cache.drawSprite(c, 'arbre', make, 0, 0)).toBe(true);
    expect(c.drawn).toEqual([20, 10]);
    expect(decodes).toBe(1);
    // De près : le SVG est relu à ce détail ; d'ici là, l'image la plus proche sert
    cache.setSpriteDetail(3);
    expect(cache.drawSprite(c, 'arbre', make, 0, 0)).toBe(true);
    expect(c.drawn.at(-1)).toBe(20);
    await settle();
    cache.setSpriteDetail(3);
    cache.drawSprite(c, 'arbre', make, 0, 0);
    expect(c.drawn.at(-1)).toBe(40);
    expect(decodes).toBe(2);
  });

  it('tient dans son budget : les images qui n’ont pas servi récemment partent', async () => {
    const cache = await import('@/world/spriteCache');
    // Des dessins de 1000 × 1000 unités, rendus au détail 1 : un million de pixels chacun, pour un budget de 16 millions
    const big = () => ({ svg: '<svg width="1000" height="1000"/>', box: { x: 0, y: 0, w: 1000, h: 1000 } });
    for (let i = 0; i < 24; i++) {
      cache.setSpriteDetail(1);
      cache.drawSprite(ctx(), `gros-${i}`, big, 0, 0);
      await settle();
    }
    // Les premiers sont partis (il faut les relire), les derniers sont là
    cache.setSpriteDetail(1);
    expect(cache.drawSprite(ctx(), 'gros-23', big, 0, 0)).toBe(true);
    expect(cache.drawSprite(ctx(), 'gros-0', big, 0, 0)).toBe(false);
  });

  it('un dessin qui arrive redessine l’île une seule fois, à l’image suivante', async () => {
    const cache = await import('@/world/spriteCache');
    const { default: loop } = await import('@/world/view/draw/loop');
    const island = { raf: 0, repaintRaf: 0, draws: 0, draw() { this.draws++; } };
    const repaint = loop.repaintSoon.bind(island);
    cache.setSpriteDetail(1);
    for (const key of ['a', 'b', 'c']) cache.drawSprite(ctx(), key, make, 0, 0, repaint);
    await settle();
    await settle();
    expect(island.draws).toBe(1);
    // La boucle tourne déjà (mouvement non réduit) : elle redessinera d'elle-même
    island.raf = 1;
    cache.drawSprite(ctx(), 'd', make, 0, 0, repaint);
    await settle();
    await settle();
    expect(island.draws).toBe(1);
  });
});
