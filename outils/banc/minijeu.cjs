// Un mini-jeu au banc : bâtiment au palier III, partie lancée, quelques touchers, captures. Compte de banc local.
// Usage : node minijeu.cjs <port> <cueillette|filon|peche>
const { chromium } = require('playwright');
const { execSync } = require('child_process');
const [port = '8098', game = 'cueillette'] = process.argv.slice(2);
const SITE = { cueillette: ['bosquet', 'lisiere'], filon: ['carriere', 'colline'], peche: ['ponton', 'crique'] }[game];
const sql = q => execSync(`psql postgres://origins:origins@localhost:5432/origins_test -Atc "${q}"`).toString().trim();
const OUT = `${__dirname}/shots/jeu-${game}`;
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
  const { userId } = await (await p.request.post(base + '/api/auth/register', { data: { email: `jeu-${Date.now()}@local.test`, password: 'Banc-local-2026!' }, headers: H })).json();
  sql(`UPDATE users SET created_at = '2026-01-01' WHERE id = ${userId}`);
  await p.request.get(base + '/api/play/world', { headers: H });
  sql(`INSERT INTO world_zones (user_id, zone) SELECT ${userId}, unnest(ARRAY['source', 'lisiere', 'colline', 'crique']) ON CONFLICT DO NOTHING`);
  sql(`INSERT INTO world_buildings (user_id, site, level) VALUES (${userId}, '${SITE[0]}', 3) ON CONFLICT (user_id, site) DO UPDATE SET level = EXCLUDED.level`);
  await p.evaluate(id => { localStorage.setItem('user', JSON.stringify({ userId: id, username: 'Banc' })); localStorage.setItem('oc_brume_born', '1'); localStorage.setItem('oc_prologue', JSON.stringify({ skipped: true })); localStorage.setItem('oc_guide_seen', JSON.stringify(['welcome', 'island', 'friends', 'savoirs', 'needs', 'games', 'annexes'])); }, userId);
  await p.goto(`${base}/?heure=jour&meteo=clair`);
  await p.waitForTimeout(1500);
  await p.locator('.tabbar__item[data-tab="world"]').click();
  await p.waitForSelector('.world__play', { timeout: 120000 });
  await p.waitForTimeout(6000);
  for (let i = 0; i < 6; i++) { const skip = p.locator('button', { hasText: /^Passer$/ }); if (await skip.count()) { await skip.first().click().catch(() => {}); await p.waitForTimeout(1200); } }
  await p.evaluate(g => window.__find('WorldView').openGame(g), game);
  await p.waitForTimeout(1200);
  await p.screenshot({ path: `${OUT}/01-intro.png` });
  for (let i = 0; i < 4; i++) { const ok = p.locator('button', { hasText: /^Compris$/ }); if (await ok.count()) { await ok.first().click().catch(() => {}); await p.waitForTimeout(800); } }
  await p.locator('.mini__btn').click();
  await p.waitForTimeout(4200);
  await p.waitForTimeout(1500); await p.screenshot({ path: `${OUT}/015-avant.png` });
  const board = await p.locator('.mini__stage').boundingBox();
  for (let i = 0; i < (game === 'peche' ? 30 : game === 'filon' ? 40 : 14); i++) {
    const bushes = p.locator(game === 'filon' ? '.vein__block.is-reach' : game === 'peche' ? '.fishing__lane' : '.picking__bush.has-mure, .picking__bush.has-fraise, .picking__bush.has-myrtille');
    const n = await bushes.count();
    if (n) await bushes.nth(i % n).click({ force: true, timeout: 1000 }).catch(() => {});
    else await p.mouse.click(board.x + board.width * (0.2 + 0.6 * Math.random()), board.y + board.height * (0.3 + 0.4 * Math.random()));
    await p.waitForTimeout(game === 'peche' ? (i % 4 === 1 ? 60 + (i % 3) * 120 : 420) : 140);
    if (i % 4 === 1) await p.screenshot({ path: `${OUT}/02-jeu-${i}.png` });
  }
  // La fin : « Arrêter », puis le bilan du niveau
  const stop = p.locator('.mini__end', { hasText: 'Arrêter' });
  if (await stop.count()) await stop.first().click().catch(() => {});
  await p.waitForTimeout(3500);
  await p.screenshot({ path: `${OUT}/03-bilan.png` });
  console.log('bilan', await p.evaluate(() => (document.querySelector('.mini__result') || {}).innerText || '-'));
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
