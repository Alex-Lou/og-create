// Banc des arrivées : île neuve au feu accompli (Brume seule) ; on réclame le feu auprès de Brume : Cannelle débarque à
// pied depuis l'épave, la caméra la suit, une bulle le dit ; pas de bêtes des bois pendant le tutoriel. Compte de banc
// local. Usage : node arrivees.cjs <port>
const { chromium } = require('playwright');
// Le mot de passe du compte de banc, tiré au hasard à chaque lancement : aucun secret écrit dans le dépôt
const motDePasseDuBanc = `Banc-${require('crypto').randomBytes(9).toString('base64url')}-Aa1!`;
const { execSync } = require('child_process');
const [port = '8099'] = process.argv.slice(2);
const sql = q => execSync(`psql postgres://origins:origins@localhost:5432/origins_test -Atc "${q}"`).toString().trim();
const OUT = `${__dirname}/shots/arrivees`;
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
  const { userId } = await (await p.request.post(base + '/api/auth/register', { data: { email: `arrivee-${Date.now()}@local.test`, password: motDePasseDuBanc }, headers: H })).json();
  await p.request.get(base + '/api/play/world', { headers: H });
  sql(`UPDATE progress SET infinite_elements = jsonb_build_array('Eau', 'Feu', 'Terre', 'Air', 'Vent', 'Pluie', 'Brasier') WHERE user_id = ${userId}`);
  sql(`INSERT INTO world_quests (user_id, quest) SELECT ${userId}, unnest(ARRAY['pages', 'ramasser', 'recolte'])`);
  sql(`INSERT INTO world_buildings (user_id, site, level) VALUES (${userId}, 'foyer', 1) ON CONFLICT (user_id, site) DO UPDATE SET level = EXCLUDED.level`);
  await p.evaluate(id => { localStorage.setItem('user', JSON.stringify({ userId: id, username: 'Banc' })); localStorage.setItem('oc_brume_born', '1'); localStorage.setItem('oc_prologue', JSON.stringify({ started: true, registered: false, seen: ['naufrage', 'arrivee', 'souffle', 'sceau'] })); }, userId);
  await p.goto(`${base}/?heure=jour&meteo=clair`);
  await p.waitForTimeout(2500);
  const tab = p.locator('.tabbar__item[data-tab="world"]');
  if (await tab.count()) await tab.click().catch(() => {});
  await p.waitForSelector('.world__play', { timeout: 120000 }).catch(() => {});
  await p.waitForTimeout(4000);
  let shot = 0;
  const snap = name => p.screenshot({ path: `${OUT}/${String(++shot).padStart(2, '0')}-${name}.png` });
  const life = () => p.evaluate(() => {
    const w = window.__find('WorldView');
    const l = w.village ? w.village.at(performance.now() / 1000, w.phase || w.skyAt(w.skyDate())) : { list: [] };
    return { people: l.list.filter(b => b.kind === 'villager').map(b => `${b.role}@${b.x.toFixed(1)},${b.y.toFixed(1)}`), beasts: [...new Set(l.list.filter(b => b.kind !== 'villager').map(b => b.species))], quest: w.quest && `${w.quest.id}${w.quest.done ? '✓' : ''}`, known: localStorage.getItem('oc_arrived') };
  });
  console.log('avant', JSON.stringify(await life()));
  for (let i = 0, idle = 0; i < 12 && idle < 4; i++) {
    const ok = p.locator('button', { hasText: /^(Compris|Suivant|Passer|Je veillerai)$/ });
    if (!(await ok.count())) { idle++; await p.waitForTimeout(1000); continue; }
    idle = 0;
    await ok.first().click().catch(() => {});
    await p.waitForTimeout(900);
  }
  await snap('avant');
  // Réclamer le feu : toucher Brume
  const claimed = await p.evaluate(async () => { const w = window.__find('WorldView'); await w.questAct(); return w.quest && w.quest.id; });
  console.log('réclamé, quête', claimed, JSON.stringify(await p.evaluate(() => { const a = document.querySelector('#app').__vue_app__._instance.proxy; return { breath: Boolean(a.breathTimer), running: a.prologueRunning, guided: a.accountGuided, q: a.islandQuest, scene: a.prologueScene }; })));
  for (let k = 0; k < 16; k++) {
    await p.waitForTimeout(300);
    console.log(`  t+${(k + 1) * 300}`, JSON.stringify(await p.evaluate(() => { const a = document.querySelector('#app').__vue_app__._instance.proxy; return { breath: Boolean(a.breathTimer), q: a.islandQuest && a.islandQuest.id, scene: a.prologueScene }; })));
  }
  for (const ms of []) {
    await p.waitForTimeout(ms - (ms === 600 ? 0 : [600, 1200, 2000, 3000, 4500][[600, 1200, 2000, 3000, 4500].indexOf(ms) - 1]));
    const l = await life();
    const tip = await p.evaluate(() => (document.querySelector('.world__tip') || {}).innerText || '-');
    console.log(`+${ms}`, l.people.join(' '), '| bulle', tip.replace(/\n/g, ' '), '| scène', await p.evaluate(() => Boolean(document.querySelector('.prologue-scene, [class*="scene"]'))));
    await snap(`t${ms}`);
  }
  console.log('après', JSON.stringify(await life()));
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
