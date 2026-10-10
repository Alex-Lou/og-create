// Banc de performance de l'île : chargement, mémoire (après ramasse-miettes) au repos et après des allers-retours,
// écouteurs et nœuds, images par seconde au glisser, réponses du serveur. Compte de banc local.
// Usage : node perf.cjs <port> [secondes de repos]
const { chromium } = require('playwright');
// Le mot de passe du compte de banc, tiré au hasard à chaque lancement : aucun secret écrit dans le dépôt
const motDePasseDuBanc = `Banc-${require('crypto').randomBytes(9).toString('base64url')}-Aa1!`;
const [port = '8098', idle = '20'] = process.argv.slice(2);
(async () => {
  const b = await chromium.launch({ args: ['--enable-precise-memory-info', '--js-flags=--expose-gc'] });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => {
    const find = (vnode, name, depth = 0) => {
      if (!vnode || depth > 400) return null;
      if (vnode.component) { if (vnode.component.type.name === name) return vnode.component.proxy; const r = find(vnode.component.subTree, name, depth + 1); if (r) return r; }
      if (vnode.suspense) { const r = find(vnode.suspense.activeBranch, name, depth + 1); if (r) return r; }
      if (Array.isArray(vnode.children)) for (const ch of vnode.children) { const r = find(ch, name, depth + 1); if (r) return r; }
      return null;
    };
    window.__find = name => find(document.querySelector('#app')._vnode, name);
    // Images par seconde : les écarts entre deux images
    window.__frames = [];
    const tick = t => { window.__frames.push(t); requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  });
  const p = await ctx.newPage();
  p.on('pageerror', e => console.log('pageerror', e.message));
  const cdp = await ctx.newCDPSession(p);
  await cdp.send('Performance.enable');
  const api = [];
  p.on('requestfinished', async req => {
    if (!req.url().includes('/api/')) return;
    const t = req.timing();
    const res = await req.response();
    const body = res ? await res.body().catch(() => Buffer.alloc(0)) : Buffer.alloc(0);
    api.push({ url: req.url().replace(/.*\/api/, ''), ms: Math.round(t.responseEnd), kb: Math.round(body.length / 1024) });
  });
  const metrics = async label => {
    await cdp.send('HeapProfiler.collectGarbage');
    await p.waitForTimeout(300);
    const { metrics: m } = await cdp.send('Performance.getMetrics');
    const v = n => (m.find(x => x.name === n) || {}).value;
    console.log(label.padEnd(26), 'tas', (v('JSHeapUsedSize') / 1048576).toFixed(1), 'Mo · nœuds', v('Nodes'), '· écouteurs', v('JSEventListeners'), '· docs', v('Documents'));
  };
  const fps = async (label, run) => {
    await p.evaluate(() => { window.__frames = []; });
    await run();
    const d = await p.evaluate(() => window.__frames.slice(1).map((t, i) => t - window.__frames[i]));
    const s = [...d].sort((a, c) => a - c);
    const q = k => (s[Math.floor(k * (s.length - 1))] || 0).toFixed(1);
    console.log(label.padEnd(26), 'images', d.length, '· écart p50', q(0.5), 'ms · p95', q(0.95), 'ms · max', (s[s.length - 1] || 0).toFixed(0), 'ms');
  };
  const profile = async (label, run) => {
    await cdp.send('Profiler.enable');
    await cdp.send('Profiler.setSamplingInterval', { interval: 200 });
    await cdp.send('Profiler.start');
    await run();
    const { profile: prof } = await cdp.send('Profiler.stop');
    const self = new Map();
    const dt = prof.timeDeltas; const byId = new Map(prof.nodes.map(n => [n.id, n]));
    prof.samples.forEach((id, i) => { const n = byId.get(id); const f = n.callFrame; const key = `${f.functionName || '(anon)'} ${f.url.split('/').pop().split('?')[0]}:${f.lineNumber + 1}`; self.set(key, (self.get(key) || 0) + (dt[i] || 0)); });
    const total = [...self.values()].reduce((a, c) => a + c, 0);
    console.log(`-- profil ${label} (${(total / 1000).toFixed(0)} ms)`);
    [...self.entries()].sort((a, c) => c[1] - a[1]).slice(0, 14).forEach(([k, v]) => console.log('   ', (100 * v / total).toFixed(1).padStart(5), '%', k));
  };
  const base = `http://127.0.0.1:${port}`;
  const H = { 'X-Requested-With': 'origins' };
  await p.goto(base + '/');
  const { userId } = await (await p.request.post(base + '/api/auth/register', { data: { email: `perf-${Date.now()}@local.test`, password: motDePasseDuBanc }, headers: H })).json();
  await p.request.get(base + '/api/play/world', { headers: H });
  await p.evaluate(id => { localStorage.setItem('user', JSON.stringify({ userId: id, username: 'Banc' })); localStorage.setItem('oc_brume_born', '1'); localStorage.setItem('oc_prologue', JSON.stringify({ skipped: true })); }, userId);
  const t0 = Date.now();
  await p.goto(`${base}/?heure=jour&meteo=clair`);
  await p.waitForSelector('.tabbar__item[data-tab="world"]');
  console.log('app prête en', Date.now() - t0, 'ms');
  await metrics('app (Grimoire)');
  const t1 = Date.now();
  await p.locator('.tabbar__item[data-tab="world"]').click();
  await p.waitForSelector('.world__play', { timeout: 120000 });
  await p.waitForFunction(() => { const w = window.__find('WorldView'); return w && w.state && w.terrain; });
  console.log('île affichée en', Date.now() - t1, 'ms');
  await p.waitForTimeout(3000);
  for (let i = 0; i < 6; i++) { const ok = p.locator('button', { hasText: /^(Compris|Passer|Je veillerai)$/ }); if (await ok.count()) { await ok.first().click().catch(() => {}); await p.waitForTimeout(600); } }
  await metrics('île chargée');
  await fps(`repos ${idle} s`, () => p.waitForTimeout(Number(idle) * 1000));
  if (process.env.PROFILE) await profile('repos 6 s', () => p.waitForTimeout(6000));
  await metrics('île après repos');
  const canvas = await p.locator('canvas.world__canvas, .world canvas').first().boundingBox();
  await fps('glisser 10 fois', async () => {
    for (let k = 0; k < 10; k++) {
      await p.mouse.move(canvas.x + 200, canvas.y + 400);
      await p.mouse.down();
      for (let s = 0; s < 20; s++) await p.mouse.move(canvas.x + 200 + (k % 2 ? -1 : 1) * s * 8, canvas.y + 400 + s * 5);
      await p.mouse.up();
    }
  });
  if (process.env.PROFILE) {
    await profile('glisser', async () => {
      for (let k = 0; k < 6; k++) {
        await p.mouse.move(canvas.x + 200, canvas.y + 400);
        await p.mouse.down();
        for (let s = 0; s < 20; s++) await p.mouse.move(canvas.x + 200 + (k % 2 ? -1 : 1) * s * 8, canvas.y + 400 + s * 5);
        await p.mouse.up();
      }
    });
  }
  await fps('zoom molette', async () => { for (let k = 0; k < 20; k++) { await p.mouse.wheel(0, k % 4 < 2 ? -120 : 120); await p.waitForTimeout(60); } });
  await metrics('après glisser + zoom');
  // Allers-retours : le Grimoire et l'île, dix fois (une fuite se verrait au tas, aux écouteurs, aux nœuds)
  for (let k = 0; k < 10; k++) {
    await p.locator('.tabbar__item[data-tab="infinite"]').click().catch(() => {});
    await p.waitForTimeout(700);
    await p.locator('.tabbar__item[data-tab="world"]').click().catch(() => {});
    await p.waitForTimeout(1200);
  }
  await metrics('après 10 allers-retours');
  await p.waitForTimeout(1500);
  await metrics('allers-retours + 1,5 s');
  const slow = api.filter(a => a.ms > 0).sort((a, c) => c.ms - a.ms).slice(0, 6);
  console.log('serveur (les plus lents) :', slow.map(a => `${a.url} ${a.ms} ms ${a.kb} Ko`).join(' | '));
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
