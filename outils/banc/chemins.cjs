// Le premier chemin au banc : île neuve (sentier seul), Puits bâti ; la main du coach, le bouton, le tracé au doigt
// du Puits au Feu, « Tracer », le creusement. Compte de banc local. Usage : node chemins.cjs <port>
const { chromium } = require('playwright');
const { execSync } = require('child_process');
const [port = '8098'] = process.argv.slice(2);
const sql = q => execSync(`psql postgres://origins:origins@localhost:5432/origins_test -Atc "${q}"`).toString().trim();
const OUT = `${__dirname}/shots/chemins`;
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
  const { userId } = await (await p.request.post(base + '/api/auth/register', { data: { email: `chemin-${Date.now()}@local.test`, password: 'Banc-local-2026!' }, headers: H })).json();
  sql(`UPDATE users SET created_at = '2030-01-01' WHERE id = ${userId}`);
  await p.request.get(base + '/api/play/world', { headers: H });
  sql(`UPDATE progress SET infinite_elements = jsonb_build_array('Eau', 'Feu', 'Terre', 'Air', 'Vent', 'Pluie', 'Vapeur', 'Boue', 'Brique', 'Puits', 'Brasier', 'Colline', 'Source') WHERE user_id = ${userId}`);
  sql(`INSERT INTO world_quests (user_id, quest) SELECT ${userId}, unnest(ARRAY['pages', 'ramasser', 'recolte', 'feu', 'soupe', 'poules', 'deco', 'achat-source', 'eveil-ondin', 'souvenir-ondin', 'puits-ondin'])`);
  sql(`INSERT INTO world_zones (user_id, zone) VALUES (${userId}, 'source') ON CONFLICT DO NOTHING`);
  sql(`INSERT INTO world_buildings (user_id, site, level) VALUES (${userId}, 'foyer', 1), (${userId}, 'puits', 1) ON CONFLICT (user_id, site) DO UPDATE SET level = EXCLUDED.level`);
  sql(`UPDATE world_stock SET stone = 3 WHERE user_id = ${userId}`);
  await p.evaluate(id => { localStorage.setItem('user', JSON.stringify({ userId: id, username: 'Banc' })); localStorage.setItem('oc_brume_born', '1'); localStorage.setItem('oc_prologue', JSON.stringify({ started: true, registered: true, named: true, seen: ['naufrage', 'arrivee', 'souffle', 'sceau', 'cannelle', 'rivet', 'ondin'] })); }, userId);
  await p.goto(`${base}/?heure=jour&meteo=clair`);
  await p.waitForTimeout(3000);
  let shot = 0;
  // Les répliques de Brume, lues (elles viennent deux par deux, avec un souffle entre)
  const quiet = async () => { for (let i = 0; i < 8; i++) { const ok = p.locator('button', { hasText: /^(Compris|Je veillerai|Plus tard)$/ }); if (await ok.count()) { await ok.first().click().catch(() => {}); await p.waitForTimeout(400); } else await p.waitForTimeout(500); } };
  const snap = name => p.screenshot({ path: `${OUT}/${String(++shot).padStart(2, '0')}-${name}.png` });
  const quest = () => p.evaluate(() => { const w = window.__find('WorldView'); const q = w && w.quest; return q ? `${q.id}${q.done ? '✓' : ''}` : '-'; });
  // Vers l'île (le coach montre l'onglet), les répliques lues
  const tab = p.locator('.tabbar__item[data-tab="world"]');
  if (await tab.count()) await tab.click().catch(() => {});
  await p.waitForSelector('.world__play', { timeout: 120000 }).catch(() => {});
  await p.waitForTimeout(5000);
  for (let i = 0, idle = 0; i < 14 && idle < 5; i++) {
    const ok = p.locator('button', { hasText: /^(Compris|Suivant|Passer|Je veillerai|Plus tard)$/ });
    if (!(await ok.count())) { idle++; await p.waitForTimeout(1000); continue; }
    idle = 0;
    await snap(`bulle-${i}`);
    await ok.first().click().catch(() => {});
    await p.waitForTimeout(1200);
  }
  console.log('quête', await quest());
  console.log('bulle de Brume', await p.evaluate(() => (document.querySelector('.guide') || {}).innerText || '-'));
  await p.waitForTimeout(800);
  console.log('coach à 0,8 s', await p.evaluate(() => (document.querySelector('.coach__say') || {}).innerText || '-'));
  await p.waitForTimeout(1200);
  await snap('coach-bouton');
  console.log('coach', await p.evaluate(() => (document.querySelector('.coach__say, .coach__lost') || {}).innerText || '-'));
  await p.locator('[data-coach="road"]').click();
  for (let k = 0; k < 8; k++) {
    await p.waitForTimeout(300);
    console.log(`  t+${(k + 1) * 300}`, JSON.stringify(await p.evaluate(() => { const c = window.__find('CoachLayer'); const w = window.__find('WorldView'); return c ? { at: c.at, ready: c.ready, hole: Boolean(c.hole), lesson: c.lesson.id, s: +w.cam.s.toFixed(2), say: (document.querySelector('.coach__say') || {}).innerText || '-', op: getComputedStyle(document.querySelector('.coach__say') || document.body).opacity } : '-'; })));
  }
  await snap('mode-chemin');
  console.log('coach', await p.evaluate(() => (document.querySelector('.coach__say, .coach__lost') || {}).innerText || '-'));
  const cam = () => p.evaluate(() => { const w = window.__find('WorldView'); return { ...w.cam, lay: w.roadMode ? w.roadMode.lay.length : -1, guide: w.roadGuide.length, linked: w.roadLinked }; });
  console.log('caméra à l’ouverture', JSON.stringify(await cam()));
  const screenOf = ([x, y]) => p.evaluate(([cx, cy]) => {
    const w = window.__find('WorldView');
    const r = w.$refs.canvas.getBoundingClientRect();
    const g = w.ground(cx, cy); const s = w.toScreen(g.x, g.y);
    return { x: r.left + s.x, y: r.top + s.y, on: s.x > 30 && s.y > 120 && s.x < r.width - 30 && s.y < r.height - 150 };
  }, [x, y]);
  // Un doigt qui glisse (sans appui long) : l'île bouge, aucune case ne se pose
  const before = await cam();
  await p.mouse.move(200, 400); await p.mouse.down();
  for (let k = 1; k <= 10; k++) await p.mouse.move(200 + k * 6, 400 + k * 4);
  await p.mouse.up();
  const after = await cam();
  console.log('glisser : île bougée', Math.round(after.x - before.x), Math.round(after.y - before.y), '· cases', after.lay);
  // Les cases en pointillés, touchées une à une (un doigt glisse l'île quand la suivante sort de l'écran)
  for (let k = 0; k < 40; k++) {
    const next = await p.evaluate(() => { const w = window.__find('WorldView'); const c = w.roadGuide[0]; return c && !w.roadLinked ? [c.x, c.y] : null; });
    if (!next) break;
    let pt = await screenOf(next);
    if (!pt.on) {
      const r = await p.evaluate(() => { const b = window.__find('WorldView').$refs.canvas.getBoundingClientRect(); return { cx: b.left + b.width / 2, cy: b.top + b.height / 2 }; });
      await p.mouse.move(pt.x, pt.y); await p.mouse.down();
      // (glisser le point vers le centre, sans s'arrêter : pas d'appui long)
      await p.mouse.move(pt.x + (r.cx - pt.x) / 2, pt.y + (r.cy - pt.y) / 2, { steps: 3 });
      await p.mouse.move(r.cx, r.cy, { steps: 3 }); await p.mouse.up();
      pt = await screenOf(next);
    }
    await p.mouse.click(pt.x, pt.y);
    await p.waitForTimeout(80);
    if (k === 2) { await p.waitForTimeout(1600); await snap('touches-3'); }
  }
  await p.waitForTimeout(800);
  await snap('trace-fini');
  console.log('après les touchers', JSON.stringify(await cam()));
  // Un appui long puis un glissé : tout un trait ; ↶ en retire
  const st = await cam();
  await p.mouse.move(80, 300); await p.mouse.down(); await p.waitForTimeout(400);
  for (let k = 1; k <= 8; k++) await p.mouse.move(80 + k * 18, 300 + k * 2);
  await p.mouse.up();
  const drawn = (await cam()).lay - st.lay;
  console.log('appui long + glisser : cases', drawn);
  for (let k = 0; k < drawn; k++) await p.locator('.world__road-undo').click();
  console.log('après ↶ ×', drawn, JSON.stringify(await cam()));
  console.log('bandeau', await p.evaluate(() => (document.querySelector('.world__banner--road') || {}).innerText || '-'));
  console.log('coach', await p.evaluate(() => (document.querySelector('.coach__say, .coach__lost') || {}).innerText || '-'));
  await snap('pret');
  await quiet();
  await p.locator('[data-coach="road-go"]').click();
  for (const ms of [150, 350, 600, 1400]) { await p.waitForTimeout(ms === 150 ? 150 : 250); await snap(`creuse-${ms}`); }
  await p.waitForTimeout(2000);
  console.log('quête', await quest());
  await snap('fin');
  // Réclamer le premier chemin : Aster débarque, sa scène, puis le Campement
  await p.evaluate(async () => { await window.__find('WorldView').questAct(); });
  for (let k = 0; k < 14; k++) {
    await p.waitForTimeout(400);
    console.log(`  t+${(k + 1) * 400}`, JSON.stringify(await p.evaluate(() => { const a = document.querySelector('#app').__vue_app__._instance.proxy; const w = window.__find('WorldView'); const l = w && w.village ? w.village.at(performance.now() / 1000, w.phase || w.skyAt(w.skyDate())).list : []; return { run: a.prologueRunning, guided: a.accountGuided, visit: a.guidedVisit, q: a.islandQuest && a.islandQuest.id, hold: a.islandHold, fin: a.prologue.finished, seen: a.tutorialState.seen.join(','), breath: Boolean(a.breathTimer), world: a.isWorldActive, scene: a.prologueScene, aster: (l.find(b => b.role === 'ponton') || {}).x, tip: (document.querySelector('.world__tip') || {}).innerText }; })));
  }
  await snap('aster');
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
