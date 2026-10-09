// L'écran de démarrage (utils/splash.js) : il reste au moins SPLASH_MIN_MS, montre « Entrée » quand le jeu est prêt,
// attend la partie au-delà de SPLASH_MAX_MS, et ne s'efface en fondu qu'au toucher d'« Entrée » (le jeu attend ce moment)
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Un #splash minimal : classes, étapes, barre, retrait de la page
function fakeSplash() {
  const classes = new Set();
  const items = Object.fromEntries(['code', 'fonts', 'carnet', 'ile'].map(step => [step, { classes: new Set(), mark: { textContent: '…' }, hidden: step === 'ile' }]));
  const el = {
    removed: false,
    classList: {
      add: name => classes.add(name),
      has: name => classes.has(name),
      remove: name => classes.delete(name)
    },
    style: { setProperty: vi.fn() },
    querySelector: selector => {
      const step = /data-step="(\w+)"/.exec(selector)?.[1];
      const item = items[step];
      return item && { classList: { add: name => item.classes.add(name) }, querySelector: () => item.mark, set hidden(v) { item.hidden = v; } };
    },
    remove() { this.removed = true; }
  };
  return { el, classes, items };
}

let now = 0;
let splash;
let present;
async function load() {
  vi.resetModules();
  return import('../src/utils/splash.js');
}

beforeEach(() => {
  vi.useFakeTimers();
  now = 0;
  splash = fakeSplash();
  present = true;
  vi.stubGlobal('performance', { now: () => now });
  vi.stubGlobal('document', { getElementById: id => (id === 'splash' && present && !splash.el.removed ? splash.el : null) });
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});
// Le temps passe (horloge de la page et minuteries ensemble)
const advance = ms => { now += ms; vi.advanceTimersByTime(ms); };

describe('écran de démarrage', () => {
  it('prêt en 300 ms : il reste jusqu’à 2,5 s, montre « Entrée », puis le toucher l’efface en fondu', async () => {
    const { splashStep, splashDone, SPLASH_MIN_MS, whenSplashGone } = await load();
    expect(SPLASH_MIN_MS).toBe(2500);
    let gone = false;
    whenSplashGone().then(() => { gone = true; });
    advance(300);
    ['code', 'fonts', 'carnet'].forEach(splashStep);
    expect(splash.items.carnet.mark.textContent).toBe('✓');
    expect(splash.el.style.setProperty).toHaveBeenLastCalledWith('--splash-p', '100%');
    advance(2100);
    await Promise.resolve();
    expect([splash.classes.has('is-ready'), gone]).toEqual([false, false]);
    advance(100);
    await Promise.resolve();
    expect([splash.classes.has('is-ready'), splash.classes.has('is-gone'), gone]).toEqual([true, false, false]);
    // Le joueur touche « Entrée » : l'écran s'efface alors en fondu et quitte la page
    splashDone();
    await Promise.resolve();
    expect([splash.classes.has('is-gone'), gone, splash.el.removed]).toEqual([true, true, false]);
    advance(400);
    expect(splash.el.removed).toBe(true);
  });

  it('prêt après 2,5 s : « Entrée » paraît aussitôt', async () => {
    const { splashStep } = await load();
    advance(3200);
    ['code', 'fonts', 'carnet'].forEach(splashStep);
    expect(splash.classes.has('is-ready')).toBe(true);
  });

  it('partie revenue mais polices lentes : « Entrée » à 6 s ; sans partie, il dit que le serveur se réveille', async () => {
    const first = await load();
    first.splashDeadline();
    first.splashStep('code');
    first.splashStep('carnet');
    advance(5999);
    expect(splash.classes.has('is-ready')).toBe(false);
    advance(1);
    expect(splash.classes.has('is-ready')).toBe(true);

    splash = fakeSplash();
    now = 0;
    const second = await load();
    second.splashDeadline();
    second.splashStep('code');
    advance(6000);
    expect([splash.classes.has('is-slow'), splash.classes.has('is-ready')]).toEqual([true, false]);
    // La partie finit par revenir : « Entrée » paraît
    advance(3000);
    second.splashStep('carnet');
    expect(splash.classes.has('is-ready')).toBe(true);
  });

  it('la partie ne revient pas : il reste et propose de réessayer ; rien ne se joue dessous', async () => {
    const { splashFailed, whenSplashGone } = await load();
    let gone = false;
    whenSplashGone().then(() => { gone = true; });
    splashFailed();
    advance(10000);
    await Promise.resolve();
    expect([splash.classes.has('is-failed'), splash.classes.has('is-ready'), gone]).toEqual([true, false, false]);
  });

  it('sans écran de démarrage (déjà retiré) : la promesse se tient tout de suite', async () => {
    present = false;
    const { whenSplashGone } = await load();
    await expect(whenSplashGone()).resolves.toBeUndefined();
  });

  it('un compte : il attend aussi l’île (sa pastille paraît), jusqu’à ce qu’elle soit prête', async () => {
    const { splashStep, splashExpect, splashDeadline } = await load();
    splashDeadline();
    splashExpect('ile');
    expect(splash.items.ile.hidden).toBe(false);
    advance(3000);
    ['code', 'fonts', 'carnet'].forEach(splashStep);
    expect(splash.classes.has('is-ready')).toBe(false);
    // Passé 6 s, la partie revenue ne suffit pas : l'île est attendue (sans « le serveur se réveille »)
    advance(4000);
    expect([splash.classes.has('is-ready'), splash.classes.has('is-slow')]).toEqual([false, false]);
    splashStep('ile');
    expect(splash.classes.has('is-ready')).toBe(true);
  });
});
