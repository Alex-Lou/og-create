// La Récolte avec les tuiles de la bibliothèque : une partie, une chaîne jouée, captures. Compte de banc local.
const { chromium } = require('playwright');
// Le mot de passe du compte de banc, tiré au hasard à chaque lancement : aucun secret écrit dans le dépôt
const motDePasseDuBanc = `Banc-${require('crypto').randomBytes(9).toString('base64url')}-Aa1!`;
const [port = '8098'] = process.argv.slice(2);
const OUT = `${__dirname}/shots/recolte`;
require('child_process').execSync(`rm -rf ${OUT} && mkdir -p ${OUT}`);
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
  const { userId } = await (await p.request.post(base + '/api/auth/register', { data: { email: `recolte-${Date.now()}@local.test`, password: motDePasseDuBanc }, headers: H })).json();
  await p.request.get(base + '/api/play/world', { headers: H });
  await p.evaluate(id => { localStorage.setItem('user', JSON.stringify({ userId: id, username: 'Banc' })); localStorage.setItem('oc_brume_born', '1'); localStorage.setItem('oc_prologue', JSON.stringify({ skipped: true })); }, userId);
  await p.goto(`${base}/?heure=jour&meteo=clair`);
  await p.waitForTimeout(1500);
  await p.locator('.tabbar__item[data-tab="world"]').click();
  await p.waitForSelector('.world__play', { timeout: 120000 });
  await p.waitForTimeout(7000);
  await p.locator('.world__play').click();
  await p.waitForSelector('.harvest__board', { timeout: 20000 });
  await p.waitForTimeout(800);
  await p.screenshot({ path: `${OUT}/01-plateau.png` });
  // Une chaîne : la plus longue suite de tuiles identiques voisines, par un parcours simple
  const path = await p.evaluate(() => {
    const g = window.__find('HarvestGame').game.board; const n = g.length; let best = [];
    const walk = (x, y, kind, seen) => { let out = [...seen]; for (const [dx, dy] of [[1,0],[0,1],[-1,0],[0,-1],[1,1],[-1,-1],[1,-1],[-1,1]]) { const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= n || ny >= n || g[ny][nx] !== kind || seen.some(([a, c]) => a === nx && c === ny)) continue; const r = walk(nx, ny, kind, [...seen, [nx, ny]]); if (r.length > out.length) out = r; if (out.length >= 6) break; } return out; };
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) { const r = walk(x, y, g[y][x], [[x, y]]); if (r.length > best.length) best = r; }
    return best.slice(0, 6);
  });
  console.log('chaîne', path.length);
  const box = await p.locator('.harvest__board').boundingBox();
  const at = ([x, y]) => [box.x + (x + 0.5) * box.width / 6, box.y + (y + 0.5) * box.height / 6];
  await p.mouse.move(...at(path[0])); await p.mouse.down();
  for (const c of path.slice(1)) { await p.mouse.move(...at(c), { steps: 4 }); await p.waitForTimeout(60); }
  await p.screenshot({ path: `${OUT}/02-choisie.png` });
  await p.mouse.up();
  for (let i = 0; i < 4; i++) { await p.waitForTimeout(90); await p.screenshot({ path: `${OUT}/03-cueillie-${i}.png` }); }
  await p.waitForTimeout(700);
  await p.screenshot({ path: `${OUT}/04-apres.png` });
  console.log('images', await p.evaluate(() => [...document.querySelectorAll('.harvest__art')].length));
  // Encore des chaînes, puis « Rentrer la récolte » : le bilan du niveau
  for (let k = 0; k < 7; k++) {
    const more = await p.evaluate(() => {
      const g = window.__find('HarvestGame').game.board; const n = g.length; let best = [];
      const walk = (x, y, kind, seen) => { let out = [...seen]; for (const [dx, dy] of [[1,0],[0,1],[-1,0],[0,-1],[1,1],[-1,-1],[1,-1],[-1,1]]) { const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= n || ny >= n || g[ny][nx] !== kind || seen.some(([a, c]) => a === nx && c === ny)) continue; const r = walk(nx, ny, kind, [...seen, [nx, ny]]); if (r.length > out.length) out = r; if (out.length >= 6) break; } return out; };
      for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) { const r = walk(x, y, g[y][x], [[x, y]]); if (r.length > best.length) best = r; }
      return best.slice(0, 6);
    });
    await p.mouse.move(...at(more[0])); await p.mouse.down();
    for (const c of more.slice(1)) { await p.mouse.move(...at(c), { steps: 3 }); await p.waitForTimeout(40); }
    await p.mouse.up();
    await p.waitForTimeout(900);
  }
  await p.screenshot({ path: `${OUT}/05-objectif.png` });
  await p.locator('.harvest__end').click();
  await p.waitForTimeout(3500);
  await p.screenshot({ path: `${OUT}/06-bilan.png` });
  console.log('bilan', await p.evaluate(() => (document.querySelector('.harvest__result') || {}).innerText || '-'));
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
