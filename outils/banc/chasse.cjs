// L'attrapage des poules au banc : un compte à la quête « poules », la cage ouverte ; captures en rafale autour de
// chaque toucher (le premier : elle s’esquive ; le second : prise). Compte local, mot de passe au hasard. Mesure aussi la
// fluidité (images par seconde ; CPU=4 ralentit le processeur, PROFILE=1 profile). Usage : NODE_PATH=/opt/node22/lib/node_modules
// [CPU=4] node outils/banc/chasse.cjs <dossier>
const { chromium } = require('playwright');
const { execSync } = require('child_process');
const pass = `Banc-${require('crypto').randomBytes(9).toString('base64url')}-Aa1!`;
const sql = q => execSync(`psql postgres://origins:origins@localhost:5432/origins_test -Atc "${q}"`).toString().trim();
const OUT = process.argv[2] || './chasse';
execSync(`rm -rf ${OUT} && mkdir -p ${OUT}`);
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, hasTouch: true, isMobile: true });
  await ctx.addInitScript(() => {
    const find = (vnode, name, depth = 0) => {
      if (!vnode || depth > 400) return null;
      if (vnode.component) { if (vnode.component.type.name === name) return vnode.component.proxy; const r = find(vnode.component.subTree, name, depth + 1); if (r) return r; }
      if (vnode.suspense) { const r = find(vnode.suspense.activeBranch, name, depth + 1); if (r) return r; }
      if (Array.isArray(vnode.children)) for (const ch of vnode.children) { const r = find(ch, name, depth + 1); if (r) return r; }
      return null;
    };
    window.__find = name => { const el = document.querySelector('#app'); return el && el._vnode ? find(el._vnode, name) : null; };
  });
  const p = await ctx.newPage();
  // (un téléphone plus lent : le processeur ralenti, CPU=4 ou 6)
  const cdp = await ctx.newCDPSession(p);
  await cdp.send('Performance.enable');
  if (process.env.CPU) await cdp.send('Emulation.setCPUThrottlingRate', { rate: Number(process.env.CPU) });
  const metrics = async () => Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map(m => [m.name, m.value]));
  const errors = [];
  p.on('pageerror', e => errors.push(e.message));
  const base = 'http://127.0.0.1:8099', H = { 'X-Requested-With': 'origins' };
  await p.goto(base + '/');
  const { userId } = await (await p.request.post(base + '/api/auth/register', { data: { email: `attrape-${Date.now()}@local.test`, password: pass }, headers: H })).json();
  await p.request.get(base + '/api/play/world', { headers: H });
  const order = require('/home/user/og-create-backend/src/services/quests').QUESTS.map(q => q.id);
  const before = order.slice(0, order.indexOf('poules'));
  sql(`INSERT INTO world_quests (user_id, quest) SELECT ${userId}, unnest(ARRAY['${before.join("','")}'])`);
  sql(`INSERT INTO world_buildings (user_id, site, level) VALUES (${userId}, 'foyer', 1), (${userId}, 'ponton', 1) ON CONFLICT (user_id, site) DO UPDATE SET level = 1`);
  sql(`UPDATE progress SET infinite_elements = '[\\"Vent\\", \\"Brasier\\"]'::jsonb WHERE user_id = ${userId}`);
  await p.request.post(base + '/api/play/world/beasts/cage', { data: {}, headers: H });
  await p.evaluate(id => { localStorage.setItem('user', JSON.stringify({ userId: id, username: 'Banc' })); localStorage.setItem('oc_brume_born', '1'); localStorage.setItem('oc_tracker_open', 'false'); localStorage.setItem('oc_prologue', JSON.stringify({ started: true, registered: true, named: true, signed: true, seen: ['naufrage', 'arrivee', 'souffle', 'nuit', 'recolte', 'aster-caisse', 'longue-vue', 'cannelle', 'cannelle-parle', 'cage-vue'] })); }, userId);
  await p.goto(base + '/?heure=jour&meteo=clair');
  await p.waitForSelector('#splash-enter', { state: 'visible', timeout: 60000 });
  await p.click('#splash-enter');
  await p.waitForTimeout(2500);
  await p.evaluate(() => window.__find('App').handleModeSelect('world'));
  await p.waitForSelector('.world__canvas', { timeout: 60000 });
  await p.waitForTimeout(5000);
  for (let k = 0; k < 10; k++) { const g = p.locator('.guide__btn').first(); if (await g.count()) await g.click({ timeout: 1500 }).catch(() => {}); await p.waitForTimeout(400); }
  const info = await p.evaluate(() => { const w = window.__find('WorldView'); return { quest: w.quest && w.quest.id, loose: [...w.looseHens.keys()], lesson: (window.__find('CoachLayer') || {}).step ? window.__find('CoachLayer').step.text : '-' }; });
  console.log('état :', JSON.stringify(info));
  // La chasse : toucher une poule échappée l'ouvre
  await p.evaluate(id => window.__find('WorldView').tapHen(id), info.loose[0]);
  await p.waitForSelector('.chase__arena', { timeout: 10000 });
  await p.waitForTimeout(800);
  await p.screenshot({ path: `${OUT}/01-ouverture.png` });
  if (process.env.PLUS_TARD) {
    const before = await p.evaluate(() => (window.__find('CoachLayer') || {}).step ? 'main' : 'aucune');
    await p.locator('.chase .scene__later').click();
    await p.waitForTimeout(1500);
    console.log('plus tard :', JSON.stringify(await p.evaluate(() => { const w = window.__find('WorldView'); const c = window.__find('CoachLayer'); return { chase: Boolean(document.querySelector('.chase')), loose: [...w.looseHens.keys()].length, coach: c && c.step ? c.step.text : '-', boucle: Boolean(w.raf) }; })), '| coach pendant :', before);
    await b.close();
    return;
  }
  // Les images : on compte les intervalles entre deux images pendant toute la partie
  await p.evaluate(() => { window.__dts = []; let last = performance.now(); const tick = now => { window.__dts.push(now - last); last = now; if (window.__dts.length < 100000) requestAnimationFrame(tick); }; requestAnimationFrame(tick); });
  await p.click('.chase .scene__btn');
  await p.waitForTimeout(600);
  const m0 = await metrics();
  if (process.env.PROFILE) {
  await cdp.send('Profiler.enable');
  await cdp.send('Profiler.setSamplingInterval', { interval: 200 });
  await cdp.send('Profiler.start');
  await p.waitForTimeout(4000);
  const { profile } = await cdp.send('Profiler.stop');
  const self = new Map();
  const byId = new Map(profile.nodes.map(n => [n.id, n]));
  const counts = new Map();
  for (const id of profile.samples) counts.set(id, (counts.get(id) || 0) + 1);
  for (const [id, c] of counts) { const n = byId.get(id); const f = n.callFrame; const key = `${f.functionName || '(anon)'} ${(f.url || '').split('/').slice(-2).join('/')}:${f.lineNumber}`; self.set(key, (self.get(key) || 0) + c); }
  const total = profile.samples.length;
  console.log('PROFIL (auto, %) :', [...self].sort((a, b) => b[1] - a[1]).slice(0, 18).map(([k, c]) => `${(100 * c / total).toFixed(1)}% ${k}`).join('\n  '));
  }
  const box = await p.locator('.chase__arena').boundingBox();
  const tapAt = async (x, y) => p.touchscreen.tap(box.x + box.width * x / 100, box.y + box.height * y / 100);
  // Une esquive : toucher une poule en pleine course
  const hen = async id => p.evaluate(id => { const b = document.querySelector(`.chase__hen[aria-label^="${id}"]`); return null; }, id);
  const first = p.locator('.chase__hen').first();
  const fb = await first.boundingBox();
  await p.touchscreen.tap(fb.x + fb.width / 2, fb.y + fb.height / 2);
  await p.waitForTimeout(250);
  await p.screenshot({ path: `${OUT}/02-esquive.png` });
  // Du grain, puis on guette celle qui picore (« ! ») et on la touche
  let shot = 3;
  for (let round = 0; round < 40; round++) {
    const st = await p.evaluate(() => ({ count: document.querySelector('.chase .scene__eyebrow').innerText, end: Boolean(document.querySelector('.chase .scene__talk')) }));
    if (st.end) break;
    const pecking = p.locator('.chase__hen.is-peck').first();
    if (await pecking.count()) {
      const pb = await pecking.boundingBox();
      if (shot === 3) { await p.screenshot({ path: `${OUT}/03-picore.png` }); shot++; }
      await p.touchscreen.tap(pb.x + pb.width / 2, pb.y + pb.height / 2);
      await p.waitForTimeout(400);
      if (shot === 4) { await p.screenshot({ path: `${OUT}/04-prise.png` }); shot++; }
      continue;
    }
    // (le grain au milieu des poules)
    const hens = await p.evaluate(() => [...document.querySelectorAll('.chase__hen:not(.is-caught):not(.is-home)')].map(e => { const r = e.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height * 0.9]; }));
    if (hens.length) { const [hx, hy] = hens[round % hens.length]; await p.touchscreen.tap(hx + (hx > 200 ? -60 : 60), hy); }
    await p.waitForTimeout(500);
  }
  await p.waitForTimeout(1600);
  await p.screenshot({ path: `${OUT}/05-fin.png` });
  const m1 = await metrics();
  const d = k => ((m1[k] - m0[k]) * 1000).toFixed(0);
  console.log('ms pendant la chasse : tâches', d('TaskDuration'), '| script', d('ScriptDuration'), '| styles', d('RecalcStyleDuration'), '| mise en page', d('LayoutDuration'), '| sur', ((m1.Timestamp - m0.Timestamp) * 1000).toFixed(0), 'ms');
  const dts = await p.evaluate(() => window.__dts.slice(5));
  dts.sort((a, b) => a - b);
  const avg = dts.reduce((a, b) => a + b, 0) / dts.length;
  console.log('images :', dts.length, '| moyenne', avg.toFixed(1), 'ms | 95e', dts[Math.floor(dts.length * 0.95)].toFixed(1), 'ms | pire', dts[dts.length - 1].toFixed(1), 'ms | > 50 ms :', dts.filter(d => d > 50).length);
  console.log('fin :', await p.evaluate(() => (document.querySelector('.chase .scene__talk') || {}).innerText || '-'), '|', await p.evaluate(() => document.querySelector('.chase .scene__eyebrow').innerText));
  await p.click('.chase .scene__btn');
  await p.waitForTimeout(3000);
  console.log('après :', JSON.stringify(await p.evaluate(() => { const w = window.__find('WorldView'); return { chase: Boolean(document.querySelector('.chase')), loose: [...w.looseHens.keys()], guide: (document.querySelector('.guide__text') || {}).innerText || '-' }; })));
  console.log('erreurs :', errors.length ? errors.join(' | ') : 'aucune');
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
