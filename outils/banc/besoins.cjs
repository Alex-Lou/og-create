// La soupe de Cannelle au banc : toucher sa bulle la nourrit (la main du coach la montre). Compte de banc local.
const { chromium } = require('playwright');
const { execSync } = require('child_process');
const [port = '8098', food = '10'] = process.argv.slice(2);
const sql = q => execSync(`psql postgres://origins:origins@localhost:5432/origins_test -Atc "${q}"`).toString().trim();
const OUT = `${__dirname}/shots/besoins-${food}`;
execSync(`rm -rf ${OUT} && mkdir -p ${OUT}`);
(async () => {
  const b = await chromium.launch();
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
  });
  const p = await ctx.newPage();
  p.on('pageerror', e => console.log('pageerror', e.message));
  const base = `http://127.0.0.1:${port}`;
  const H = { 'X-Requested-With': 'origins' };
  await p.goto(base + '/');
  const { userId } = await (await p.request.post(base + '/api/auth/register', { data: { email: `besoin-${Date.now()}@local.test`, password: 'Banc-local-2026!' }, headers: H })).json();
  sql(`UPDATE users SET created_at = '2030-01-01' WHERE id = ${userId}`);
  await p.request.get(base + '/api/play/world', { headers: H });
  sql(`UPDATE progress SET infinite_elements = jsonb_build_array('Eau', 'Feu', 'Terre', 'Air', 'Vent', 'Pluie', 'Vapeur', 'Brasier') WHERE user_id = ${userId}`);
  sql(`INSERT INTO world_quests (user_id, quest) SELECT ${userId}, unnest(ARRAY['pages', 'ramasser', 'recolte', 'feu'])`);
  sql(`INSERT INTO world_buildings (user_id, site, level) VALUES (${userId}, 'foyer', 1) ON CONFLICT (user_id, site) DO UPDATE SET level = 1`);
  sql(`UPDATE world_stock SET food = ${food} WHERE user_id = ${userId}`);
  await p.evaluate(id => { localStorage.setItem('user', JSON.stringify({ userId: id, username: 'Banc' })); localStorage.setItem('oc_brume_born', '1'); localStorage.setItem('oc_prologue', JSON.stringify({ started: true, registered: false, seen: ['naufrage', 'arrivee', 'recolte', 'cannelle'] })); }, userId);
  await p.goto(`${base}/?heure=jour&meteo=clair`);
  await p.waitForTimeout(3000);
  const tab = p.locator('.tabbar__item[data-tab="world"]');
  if (await tab.count()) await tab.click().catch(() => {});
  await p.waitForSelector('.world__play', { timeout: 120000 }).catch(() => {});
  await p.waitForTimeout(5000);
  for (let i = 0; i < 8; i++) { const ok = p.locator('button', { hasText: /^(Compris|Suivant|Passer|Je veillerai)$/ }); if (!(await ok.count())) break; await ok.first().click().catch(() => {}); await p.waitForTimeout(900); }
  await p.waitForTimeout(1500);
  await p.screenshot({ path: `${OUT}/01-coach.png` });
  console.log('coach', await p.evaluate(() => (document.querySelector('.coach__say, .coach__lost') || {}).innerText || '-'));
  const at = await p.evaluate(() => {
    const w = window.__find('WorldView'); const bub = (w.needBubbles || []).find(x => x.id === 'foyer');
    if (!bub) return null; const r = w.$refs.canvas.getBoundingClientRect(); const s = w.toScreen(bub.x, bub.y); return { x: r.left + s.x, y: r.top + s.y };
  });
  console.log('bulle', JSON.stringify(at));
  if (at) await p.mouse.click(at.x, at.y);
  await p.waitForTimeout(2500);
  await p.screenshot({ path: `${OUT}/02-apres.png` });
  console.log('quête', await p.evaluate(() => { const w = window.__find('WorldView'); return w.quest ? `${w.quest.id}${w.quest.done ? '✓' : ''}` : '-'; }));
  console.log('bulle info', await p.evaluate(() => (document.querySelector('.world__tip') || {}).innerText || '-'));
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
