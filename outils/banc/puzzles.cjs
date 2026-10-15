// Le puzzle d'assemblage de chaque création, seul, à l'écran d'un téléphone (390 × 844, ×2) : vide, résolu (toutes les
// pièces à leur place : le dessin doit s'y lire en entier, net), puis fabriqué. Les pièces sont celles du serveur
// (services/crafts.js : piecesOf, graine fixe). Sans compte : la page outils/banc/puzzles.html, servie par Vite.
// L'établi aussi (ETABLI=1) : chaque onglet, ses vignettes (le même cadrage que le puzzle).
// Usage : NODE_PATH=/opt/node22/lib/node_modules [ETABLI=1] node outils/banc/puzzles.cjs <port> <dossier> [création,création…]
const { chromium } = require('playwright');
const fs = require('fs');
const crafts = require('/home/user/og-create-backend/src/services/crafts');
const [port = '8099', OUT = './puzzles', only = ''] = process.argv.slice(2);
fs.mkdirSync(OUT, { recursive: true });
const SEED = 1234;
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const p = await ctx.newPage();
  const errors = [];
  p.on('pageerror', e => errors.push(e.message));
  await p.goto(`http://127.0.0.1:${port}/outils/banc/puzzles.html`);
  await p.waitForFunction(() => typeof window.__show === 'function', null, { timeout: 60000 });
  if (process.env.ETABLI) {
    const catalog = crafts.CRAFTS.map(c => ({ id: c.id, name: c.name, tier: c.tier, cost: c.cost, finds: c.finds, after: c.after, elements: c.elements.map(name => ({ name, have: true, pages: 1 })), place: '', block: null, open: true, made: 0 }));
    const stock = { wood: 999, stone: 999, water: 999, food: 999 };
    for (const tier of crafts.TIERS) {
      await p.evaluate(([cat, st, t]) => window.__bench({ epreuves: { have: 10, need: 10 }, open: ['start', 'I', 'II', 'III', 'climat'], locks: {}, catalog: cat.map(c => ({ ...c, tutorial: c.tier === t && c === cat.find(x => x.tier === t) })), placed: [] }, st, t), [catalog, stock, tier]);
      await p.waitForTimeout(1500);
      await p.screenshot({ path: `${OUT}/etabli-${tier}.png` });
      // chaque vignette, seule
      const arts = p.locator('.bench__art');
      for (let k = 0; k < await arts.count(); k++) {
        const id = catalog.filter(c => c.tier === tier)[k].id;
        await arts.nth(k).scrollIntoViewIfNeeded();
        await arts.nth(k).screenshot({ path: `${OUT}/vignette-${id}.png` });
      }
    }
    console.log('établi · erreurs', JSON.stringify(errors.slice(0, 5)));
    await b.close();
    return;
  }
  const list = crafts.CRAFTS.filter(c => !only || only.split(',').includes(c.id));
  for (const c of list) {
    const run = { id: `${c.id}-${SEED}`, craft: c.id, shape: c.shape, pieces: crafts.piecesOf(c.shape, SEED, c.tier), turned: Boolean(crafts.TURNED[c.tier]) };
    for (const state of ['vide', 'resolu', 'fabrique']) {
      await p.evaluate(([r, n, s]) => window.__show(r, n, { solved: s === 'resolu', made: s === 'fabrique' }), [run, c.name, state]);
      await p.waitForTimeout(state === 'vide' ? 1200 : 1600);
      await p.screenshot({ path: `${OUT}/${c.id}-${state}.png` });
    }
  }
  console.log(list.length, 'créations · erreurs', JSON.stringify(errors.slice(0, 5)));
  await b.close();
})();
