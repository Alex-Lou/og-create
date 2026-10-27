// Une étape du tutoriel au banc, sans rejouer tout le début : un compte local (mot de passe au hasard) dont les quêtes
// d'avant DEPART sont faites (par la base locale) ; on entre sur l'île et on suit la main du coach, comme un joueur
// (le trait d'un enclos compris : appui long, puis glisser sur chaque case de l'anneau), jusqu'au matin de Rivet, à
// FIN_AT, ou à un blocage. Chronologie, touchers, boutons, bulles, une capture par moment.
// Usage : NODE_PATH=/opt/node22/lib/node_modules [ENV] node outils/banc/tuto-jour.cjs <port> <dossier> [maxS]
// ENV : DEPART=<quête> (défaut soupe) ; FIN_AT=<quête> (s'arrête quand elle devient active, compte les clôtures
// posées) ; CAISSE=1 (ouvre la caisse d'Aster : ses 13 piquets) ; PIQUETS=1 (les pose autour du Feu) ;
// STOCK="wood = 200, stone = 30" (le stock, en SQL) ; PLUS_LOIN=1 (jusqu'à la scène de Rivet) ; DUMP=1 (la file du
// guide au démarrage). Ex. : DEPART=clotures CAISSE=1 FIN_AT=soupe ; DEPART=abri-cannelle CAISSE=1 PIQUETS=1
// STOCK="wood = 200, stone = 30" FIN_AT=nuit-cannelle. (Au démarrage, la sonde referme d'elle-même les premières
// bulles sans les noter : regarder DUMP=1 pour les voir.) La chasse aux poules est jouée comme un joueur (du grain près
// d'une poule, puis celle qui picore). La marmite de Cannelle
// (la soupe) l'est, comme un joueur : le seau tenu au-dessus, chaque ingrédient glissé, trois tours, la louche tenue au-dessus du bol ; ses images comptées
// (CPU=4 : le processeur ralenti pendant la marmite). Ex. : DEPART=soupe FIN_AT=cage CPU=4. VUS="cannelle,rivet" : des
// scènes déjà vues en plus (un départ après elles). Ex. : DEPART=nuit-rivet VUS="cannelle,cannelle-parle,rivet" FIN_AT=souvenir-ondin
// COINS=<n> : les écus du compte ; ELEMS="Pluie,…" : des éléments écrits en plus du Vent et du Brasier ; BATIS="puits,…" :
// des bâtiments au palier I en plus du Feu et du Ponton ; FIN_SCENE=<scène> : s'arrête quand elle se joue (conseil-suite :
// le conseil joué jusqu'au bout) ; RELOAD_ON=<leçon> : ferme et rouvre l'appli quand cette leçon du coach paraît (la
// reprise au milieu d'un geste). Ex. : DEPART=chemin BATIS=puits ELEMS=Pluie COINS=250 FIN_SCENE=conseil-suite ;
// DEPART=torches-rivet RELOAD_ON=quest-torches-rivet:2 FIN_AT=outil-rivet. Bloqué, le banc écrit l'état interne du tutoriel.
// SNAP_AFTER=<leçon> : six captures rapprochées après le toucher de cette leçon (une animation : l'abri qui s'élève). Ex. :
// DEPART=abri-cannelle CAISSE=1 SNAP_AFTER=quest-abri-cannelle:1 FIN_AT=barriere.
const { chromium } = require('playwright');
const fs = require('fs');
const motDePasseDuBanc = `Banc-${require('crypto').randomBytes(9).toString('base64url')}-Aa1!`;
const [port = '8099', OUT = './shots', maxS = '900'] = process.argv.slice(2);
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
const log = fs.createWriteStream(`${OUT}/chronologie.txt`);
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: false });
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
  if (process.env.SUIVI_FERME) await ctx.addInitScript(() => { if (!sessionStorage.getItem('banc')) { sessionStorage.setItem('banc', '1'); localStorage.setItem('oc_tracker_open', 'false'); } });
  const p = await ctx.newPage();
  const cdp = await ctx.newCDPSession(p);
  const errors = [];
  p.on('pageerror', e => errors.push(e.message));
  p.on('console', m => { if (m.type() === 'error') errors.push(m.text().slice(0, 200)); });
  const base = `http://127.0.0.1:${port}`;
  p.on('response', r => { if (r.status() >= 400) say('  ! requête', `${r.status()} ${r.request().method()} ${r.url().replace(base, '')}`); });
  let t0 = 0; let touches = 0; let shot = 0; let lastSay = '';
  const now = () => (t0 ? ((Date.now() - t0) / 1000).toFixed(1) : '0.0');
  const say = (kind, text = '') => { const line = `${now().padStart(6)} s · ${String(touches).padStart(3)} t · ${kind}${text ? ' · ' + text : ''}`; if (line.slice(16) === lastSay) return; lastSay = line.slice(16); console.log(line); log.write(line + '\n'); };
  const snap = async name => { const f = `${String(++shot).padStart(3, '0')}-${name.replace(/[^a-z0-9-]+/gi, '_').slice(0, 40)}.png`; await Promise.race([p.screenshot({ path: `${OUT}/${f}`, timeout: 8000 }).catch(() => {}), new Promise(r => setTimeout(r, 9000))]); return f; };
  const touch = async (x, y) => { touches++; await p.mouse.click(x, y); };
  // Appui long (déplacer une création) : le doigt reste posé
  const press = async (x, y) => { touches++; await p.mouse.move(x, y); await p.mouse.down(); await p.waitForTimeout(900); await p.mouse.up(); };
  const reading = text => 700 + 40 * (text || '').length;
  // Les boutons visibles (texte ou aria-label), pour voir ce qui apparaît sans avoir été enseigné
  const visibleButtons = () => p.evaluate(() => [...document.querySelectorAll('button, [role="button"], .tabbar__item')].filter(el => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el); return r.width > 4 && r.height > 4 && r.bottom > 0 && r.top < innerHeight && s.visibility !== 'hidden' && s.opacity !== '0' && !el.closest('[hidden]'); }).map(el => ((el.getAttribute('aria-label') || el.innerText || el.className || '').trim().replace(/\s+/g, ' ').slice(0, 40) + (el.disabled ? ' (grisé)' : ''))).filter(Boolean));
  let seenButtons = new Set();
  const diffButtons = async () => { const now2 = await visibleButtons(); const fresh = now2.filter(x => !seenButtons.has(x)); const gone = [...seenButtons].filter(x => !now2.includes(x)); seenButtons = new Set(now2); if (fresh.length) say('  + boutons', fresh.join(' | ')); if (gone.length) say('  - boutons', gone.join(' | ')); };
  const app = () => p.evaluate(() => { const el = document.querySelector('#app'); const a = el && el.__vue_app__ && el.__vue_app__._instance && el.__vue_app__._instance.proxy; if (!a) return null; return { mode: a.currentMode, quest: a.islandQuest ? `${a.islandQuest.id}${a.islandQuest.done ? '✓' : ''}` : '-', scene: a.prologueScene, locked: (a.lockedTabs || []).join(','), hold: a.islandHold, breath: Boolean(a.breathTimer), troupe: ((window.__find('WorldView') || {}).state || {}).villagers?.map(v => v.id).join(',') || '', dort: ((window.__find('WorldView') || {}).tutoStrays || []).filter(c => c.end === 'dort').map(c => (c.wakeAt ? 'réveillé' : 'endormi')).join(',') }; }).catch(() => null);

  const { execSync } = require('child_process');
  const sql = q => execSync(`psql postgres://origins:origins@localhost:5432/origins_test -Atc "${q}"`).toString().trim();
  const H = { 'X-Requested-With': 'origins' };
  await p.goto(base + '/');
  const { userId } = await (await p.request.post(base + '/api/auth/register', { data: { email: `cannelle-${Date.now()}@local.test`, password: motDePasseDuBanc }, headers: H })).json();
  if (!userId) throw new Error('Le compte de banc n’a pas pu être créé (l’API locale limite les requêtes après de nombreux bancs : la relancer, services.sh)');
  sql(`UPDATE users SET created_at = '2030-01-01' WHERE id = ${userId}`);
  await p.request.get(base + '/api/play/world', { headers: H });
  sql(`UPDATE progress SET infinite_elements = jsonb_build_array('Eau', 'Feu', 'Terre', 'Air', 'Vent', 'Brasier'${process.env.ELEMS ? ", '" + process.env.ELEMS.split(',').join("', '") + "'" : ''}) WHERE user_id = ${userId}`);
  const order = require('/home/user/og-create-backend/src/services/quests').QUESTS.map(q => q.id);
  const before = order.slice(0, order.indexOf(process.env.DEPART || 'soupe'));
  sql(`INSERT INTO world_quests (user_id, quest) SELECT ${userId}, unnest(ARRAY['${before.join("','")}'])`);
  sql(`INSERT INTO world_buildings (user_id, site, level) VALUES (${userId}, 'foyer', 1), (${userId}, 'ponton', 1)${(process.env.BATIS || '').split(',').filter(Boolean).map(b => `, (${userId}, '${b}', 1)`).join('')} ON CONFLICT (user_id, site) DO UPDATE SET level = 1`);
  if (process.env.STOCK) sql(`UPDATE world_stock SET ${process.env.STOCK} WHERE user_id = ${userId}`);
  if (process.env.COINS) sql(`UPDATE progress SET coins = ${Number(process.env.COINS)} WHERE user_id = ${userId}`);
  if (process.env.CAISSE) say('caisse', String((await p.request.post(base + '/api/play/world/chest', { data: { source: 'caisse:aster' }, headers: H })).status()));
  // (PIQUETS : posés plus bas, l'île chargée : l'anneau de l'enclos se calcule dans la page, game/prologue.js : enclosOf)
  say('compte préparé', `${before.length} quêtes faites, départ : ${process.env.DEPART || 'soupe'}`);
  await p.evaluate(([id, vus]) => { localStorage.setItem('user', JSON.stringify({ userId: id, username: 'Banc' })); localStorage.setItem('oc_brume_born', '1'); localStorage.setItem('oc_tracker_open', 'false'); localStorage.setItem('oc_prologue', JSON.stringify({ started: true, registered: true, named: true, provisional: true, signed: true, seen: ['naufrage', 'arrivee', 'souffle', 'nuit', 'recolte', 'aster-caisse', 'longue-vue', ...vus] })); }, [userId, (process.env.VUS || '').split(',').filter(Boolean)]);
  await p.goto(base + '/?heure=jour&meteo=clair');
  await p.waitForSelector('#splash-enter', { state: 'visible', timeout: 60000 });
  const eb = await p.locator('#splash-enter').boundingBox();
  t0 = Date.now();
  await touch(eb.x + eb.width / 2, eb.y + eb.height / 2);
  say('Entrée touchée');
  if (process.env.DUMP) { for (const ms of [3000, 3000, 3000, 3000]) { await p.waitForTimeout(ms); say('  guide', JSON.stringify(await p.evaluate(() => { const a = document.querySelector('#app').__vue_app__._instance.proxy; const g = window.__find('BrumeGuide'); return { q: a.islandQuest, seen: a.prologue && a.prologue.seen, run: a.prologueRunning, world: a.isWorldActive, breath: Boolean(a.breathTimer), scene: a.prologueScene, hold: a.islandHold, cur: g && g.current ? g.current.id : null }; }).catch(e => e.message)).slice(0, 600)); say('  file', JSON.stringify(await p.evaluate(async () => { const m = await import('/src/game/guide.js'); return { q: m.guide.state.queue.map(e => e.id), seen: [...m.guide.state.seen].filter(x => /marmite|plaint|onglet/.test(x)), held: m.guide.state.held, resting: m.guide.state.resting, island: m.guide.state.island, tuto: m.guide.state.tutorial }; }).catch(e => e.message))); } }

  await p.waitForTimeout(9000);
  // Les piquets de la caisse posés sur l'anneau de l'enclos du Feu (celui de la leçon des clôtures), puis l'île relue
  if (process.env.PIQUETS) {
    const ring = await p.evaluate(async () => {
      const { enclosOf } = await import('/src/game/prologue.js');
      const w = window.__find('WorldView');
      const foyer = w.state.sites.find(s => s.id === 'foyer');
      const fence = w.state.crafts.catalog.find(c => c.id === 'cloture');
      return enclosOf(foyer, fence.spots || []).map(c => [c.x, c.y]);
    });
    const ids = sql(`SELECT id FROM world_crafts WHERE user_id = ${userId} AND craft = 'cloture' ORDER BY id`).split('\n').filter(Boolean);
    ids.slice(0, ring.length).forEach((id, i) => sql(`UPDATE world_crafts SET x = ${ring[i][0]}, y = ${ring[i][1]} WHERE id = ${id}`));
    // (la page rechargée relit l'île ; l'écran d'accueil, de nouveau)
    await p.reload();
    await p.waitForSelector('#splash-enter', { state: 'visible', timeout: 60000 });
    await p.locator('#splash-enter').click();
    await p.waitForTimeout(9000);
    say('enclos du Feu', `${Math.min(ids.length, ring.length)} piquets sur ${ring.length} cases`);
  }
  for (let i = 0; i < 20; i++) { const btn = p.locator('button:visible').filter({ hasText: /Passer la scène|Compris|Continuer|D’accord|Plus tard|Super/ }); if (await btn.count()) await btn.first().click({ force: true }).catch(() => {}); else break; await p.waitForTimeout(600); }
  if (process.env.DEBUG_ANNEX) {
  const r = await p.evaluate(async () => {
    const w = window.__find('WorldView');
    const site = w.state.sites.find(s => s.id === 'foyer');
    w.openSite ? w.openSite(site) : (w.site = site);
    await new Promise(r => setTimeout(r, 800));
    const tab = document.querySelector('[data-coach="tab-annexes"]');
    if (tab) tab.click();
    await new Promise(r => setTimeout(r, 800));
    await new Promise(r => setTimeout(r, 2500));
    const btn = document.querySelector('[data-coach="annex-poulailler"]');
    const br = btn && btn.getBoundingClientRect();
    const cl = (window.__find('CoachLayer') || {});
    const top = br && document.elementsFromPoint(br.left + br.width / 2, br.top + br.height / 2).filter(el => !cl.$el || !cl.$el.contains(el)).slice(0, 3).map(el => el.className || el.tagName);
    const sc = []; for (let el = btn; el; el = el.parentElement) { const st = getComputedStyle(el); if (/(auto|scroll)/.test(st.overflowY)) sc.push({ cls: String(el.className).slice(0, 40), sh: el.scrollHeight, ch: el.clientHeight, st: el.scrollTop }); }
    window.__dbg = { rect: br && { y: Math.round(br.top), h: Math.round(br.height) }, ih: innerHeight, top, sc, bottom: cl.bottomEdge ? cl.bottomEdge(btn) : null };
    const s2 = w.state.sites.find(s => s.id === 'foyer');
    return { siteOpen: Boolean(w.site), tab: w.siteTab, tabBtn: Boolean(tab), btn: btn ? { disabled: btn.disabled, text: btn.innerText, w: btn.getBoundingClientRect().width } : null, spots: (s2.spots || []).length, level: s2.level, coins: w.coinsPaid, coach: (window.__find('CoachLayer') || {}).hole || null, lesson: (document.querySelector('.coach__text, .coach__say') || {}).innerText, dbg: window.__dbg };
  });
  console.log(JSON.stringify(r));
  await b.close(); return;
  }
  let reloaded = false;
  let idleSince = Date.now(); let lastState = ''; let lastScene = ''; let lastFrame = -1; let lastGuide = ''; let lastCoach = ''; let harvestDone = 0; let coachTries = 0; let restarted = false;
  let frameShownAt = 0; let guideShownAt = 0; let coachShownAt = 0;
  const end = Date.now() + Number(maxS) * 1000;
  while (Date.now() < end) {
    await p.waitForTimeout(250);
    // Après un rechargement (« Recommencer l'île ») : le splash revient, « Entrée »
    if (await p.locator('#splash-enter:visible').count()) { const sb = await p.locator('#splash-enter').boundingBox().catch(() => null); if (sb) { say('splash (relance)'); await touch(sb.x + sb.width / 2, sb.y + sb.height / 2); idleSince = Date.now(); } continue; }
    const st = await app();
    // RESTART_AT=<quête> : « Recommencer l'île » (Mon compte), une fois, en arrivant à cette quête ; STOP_AT=<quête> : fin
    if (process.env.RESTART_AT && !restarted && st && st.quest.replace('✓', '') === process.env.RESTART_AT) {
      restarted = true; say('RECOMMENCER L’ÎLE', `à la quête ${st.quest}`); await snap('avant-recommencer');
      await p.evaluate(async () => { const { default: play } = await import('/src/services/playService.js'); await play.worldRestart('RECOMMENCER'); const el = document.querySelector('#app'); el.__vue_app__._instance.proxy.islandRestarted(); });
      await p.waitForTimeout(3000); idleSince = Date.now(); continue;
    }
    if (process.env.STOP_AT && restarted && st && st.quest.replace('✓', '') === process.env.STOP_AT) { say('fin', `quête ${st.quest} après recommencement`); await snap('stop'); break; }
    // Sur l'île, la barre d'onglets doit toujours se voir (sinon le joueur est coincé)
    if (st && st.mode === 'world' && !(await p.locator('.tabbar:visible').count()) && !(await p.locator('.ps').count())) { if (lastGuide !== 'sans-onglets') { lastGuide = 'sans-onglets'; say('BUG', 'sur l’île sans barre d’onglets'); await snap('ile-sans-onglets'); const dump = await p.evaluate(() => { const a = document.querySelector('#app').__vue_app__._instance.proxy; const t = document.querySelector('.tabbar'); return { mode: a.currentMode, world: a.isWorldActive, sceau: a.isSceauActive, timer: a.isTimerActive, bare: a.bareBook, cls: document.querySelector('#game-container')?.className, tab: t ? getComputedStyle(t).display + '/' + getComputedStyle(t).visibility + '/' + t.getBoundingClientRect().top : 'absent', book: Boolean(document.querySelector('.book-view')), worldEl: Boolean(document.querySelector('.world')), step: a.tutorialState && a.tutorialState.seen }; }).catch(e => String(e)); say('BUG détail', JSON.stringify(dump)); } }
    const sline = JSON.stringify(st);
    if (sline !== lastState) { say('état', sline); lastState = sline; if (st && st.quest === 'veille' && st.breath) { await p.waitForTimeout(600); await snap('jour-passe'); } }
    // Une scène plein écran
    const scene = await p.evaluate(() => { const s = window.__find('PrologueScene'); if (!s || !document.querySelector('.ps')) return null; const f = s.frame || {}; return { k: s.k !== undefined ? s.k : s.index, scene: f.scene || f.art, text: f.text || f.caption || '', auto: f.auto || 0, who: f.who || (f.thought ? 'pensée' : ''), gesture: Boolean(f.gesture) }; }).catch(() => null);
    if (scene) {
      const key = `${scene.scene}#${scene.k}`;
      if (key !== lastFrame) { lastFrame = key; frameShownAt = Date.now(); say('scène', `${scene.scene} · ${scene.who ? scene.who + ' : ' : ''}${scene.text}${scene.auto ? ` (auto ${scene.auto} ms)` : ''}`); if (scene.scene !== lastScene) { lastScene = scene.scene; await snap(`scene-${scene.scene}`); } idleSince = Date.now(); }
      if (!scene.auto && Date.now() - frameShownAt > reading(scene.text)) { if (scene.gesture) { touches++; await p.locator('.ps__gesture').click().catch(() => {}); } else await touch(195, 420); frameShownAt = Date.now() + 99999; }
      continue;
    }
    // La chasse aux poules : du grain près d'une poule, puis on touche celle qui picore (son « ! »)
    if (await p.locator('.chase').count()) {
      const phase = await p.evaluate(() => (window.__find('HenChase') || {}).phase || '?').catch(() => '?');
      if (lastGuide !== `chase-${phase}`) { lastGuide = `chase-${phase}`; say('chasse', phase); idleSince = Date.now(); await p.waitForTimeout(800); await snap(`chasse-${phase}`); }
      if (phase === 'intro' || phase === 'end') { touches++; await p.locator('.chase .scene__btn').click(); }
      else if (phase === 'play') {
        const pecking = await p.locator('.chase__hen.is-peck').first().boundingBox().catch(() => null);
        if (pecking) { touches++; await p.mouse.click(pecking.x + pecking.width / 2, pecking.y + pecking.height * 0.62); say('  prise', await p.locator('.chase .scene__eyebrow').innerText()); }
        else {
          const hens = await p.evaluate(() => [...document.querySelectorAll('.chase__hen:not(.is-caught):not(.is-home)')].map(e => { const r = e.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height * 0.9]; }));
          if (hens.length) { const [hx, hy] = hens[touches % hens.length]; touches++; await p.mouse.click(hx + (hx > 200 ? -60 : 60), hy); }
        }
        idleSince = Date.now();
      }
      await p.waitForTimeout(450);
      continue;
    }
    // La marmite de Cannelle (sa soupe) : on la joue comme un joueur ; ses images comptées
    if (await p.locator('.cook').count()) {
      const ph = await p.evaluate(() => { const c = window.__find('CookingPot'); return c ? c.phase + (c.paying ? '…' : '') : '?'; }).catch(() => '?');
      if (lastGuide !== `cook-${ph}`) {
        lastGuide = `cook-${ph}`; say('marmite', ph); idleSince = Date.now();
        if (ph === 'intro') { if (process.env.CPU) await cdp.send('Emulation.setCPUThrottlingRate', { rate: Number(process.env.CPU) }); await p.evaluate(() => { window.__dts = []; let last = performance.now(); const tick = now => { window.__dts.push(now - last); last = now; if (document.querySelector('.cook')) requestAnimationFrame(tick); }; requestAnimationFrame(tick); }); }
        await p.waitForTimeout(ph === 'intro' ? 1500 : 300); await snap(`marmite-${ph}`); await diffButtons();
      }
      const center = async sel => { const bb = await p.locator(sel).first().boundingBox(); return bb && [bb.x + bb.width / 2, bb.y + bb.height / 2]; };
      const slide = async (from, to) => { touches++; await p.mouse.move(...from); await p.mouse.down(); await p.mouse.move(...to, { steps: 12 }); await p.mouse.up(); };
      // (les places de l'aire de jeu, en unités de sa largeur : game/cooking.js)
      const ar = await p.locator('.cook__arena').boundingBox();
      const at = (x, y) => [ar.x + (x * ar.width) / 100, ar.y + (y * ar.width) / 100];
      // Tenir une pièce, la porter, la garder là ms, la lâcher
      const carry = async (from, to, ms, name) => { touches++; await p.mouse.move(...from); await p.mouse.down(); await p.mouse.move(...to, { steps: 14 }); await p.waitForTimeout(ms / 2); if (name) await snap(name); await p.waitForTimeout(ms / 2); await p.mouse.up(); };
      if (ph === 'intro') { touches++; await p.locator('.cook .scene__btn').click(); }
      else if (ph === 'verser') await carry(at(20, 101), at(66, 26), 2400, 'marmite-verse');
      else if (ph === 'jeter') await slide(await center('.cook__piece:visible'), at(58, 52));
      else if (ph === 'touiller') {
        const [cx, cy] = at(58, 54); const r = (12 * ar.width) / 100;
        touches++; await p.mouse.move(cx + r, cy); await p.mouse.down();
        for (let i = 1; i <= 80 && await p.locator('.cook__arena[data-phase="touiller"]').count(); i++) { const a = (i / 24) * 2 * Math.PI; await p.mouse.move(cx + Math.cos(a) * r, cy + Math.sin(a) * r); await p.waitForTimeout(30); if (i === 30) await snap('marmite-touille'); }
        await p.mouse.up();
      }
      else if (ph === 'servir') await carry(at(66, 48), at(82, 88), 1800, 'marmite-sert');
      else if (ph === 'fin') {
        await p.waitForTimeout(1800); await snap('marmite-servie');
        const dts = (await p.evaluate(() => window.__dts || [])).slice(5).sort((a, b) => a - b);
        if (dts.length) say('  images', `${dts.length} | moyenne ${(dts.reduce((a, b) => a + b, 0) / dts.length).toFixed(1)} ms | 95e ${dts[Math.floor(dts.length * 0.95)].toFixed(1)} ms | pire ${dts[dts.length - 1].toFixed(1)} ms | > 50 ms : ${dts.filter(d => d > 50).length}${process.env.CPU ? ` (CPU ×${process.env.CPU})` : ''}`);
        if (process.env.CPU) await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
        touches++; await p.locator('.cook .scene__btn').click();
      }
      await p.waitForTimeout(600);
      continue;
    }
    // La carte d'embarquement (l'avatar, puis le nom)
    if (await p.locator('.pav').count()) {
      const step = await p.evaluate(() => { const v = window.__find('PrologueAvatar'); return v ? v.step : '?'; });
      if (lastGuide !== `pav-${step}`) { lastGuide = `pav-${step}`; say('carte d’embarquement', step); await snap(`avatar-${step}`); await diffButtons(); await p.waitForTimeout(2500); }
      const input = p.locator('.pav input[type="text"]:visible');
      if (await input.count() && !(await input.first().inputValue())) { touches++; await input.first().fill('Banc'); say('nom écrit', 'Banc'); }
      const ok = p.locator('.pav__ok:visible, .pav button[type="submit"]:visible');
      if (await ok.count()) { const bb = await ok.first().boundingBox(); await touch(bb.x + bb.width / 2, bb.y + bb.height / 2); await p.waitForTimeout(800); }
      idleSince = Date.now();
      continue;
    }
    // La page de garde (signer le compte : une adresse locale, un mot de passe au hasard)
    if (await p.locator('.pn').count()) {
      if (lastGuide !== 'pn') { lastGuide = 'pn'; say('page de garde'); await snap('page-de-garde'); await diffButtons(); await p.waitForTimeout(3000); }
      const name = p.locator('.pn input[type="text"]'); if (await name.count() && !(await name.inputValue())) { touches++; await name.fill('Banc'); }
      const mail = p.locator('.pn input[type="email"]'); if (await mail.count() && !(await mail.inputValue())) { touches++; await mail.fill(`parcours-${Date.now()}@local.test`); }
      const pw = p.locator('.pn input[type="password"]'); if (await pw.count() && !(await pw.inputValue())) { touches++; await pw.fill(motDePasseDuBanc); }
      const sub = p.locator('.pn button[type="submit"]'); if (await sub.count()) { touches++; await sub.first().click(); say('page de garde signée'); await p.waitForTimeout(2500); }
      idleSince = Date.now();
      continue;
    }
    // La Récolte (plateau) : des chaînes, puis « Rentrer »
    if (await p.locator('.harvest__board').count()) {
      if (lastGuide !== 'harvest') { lastGuide = 'harvest'; say('Récolte', 'plateau ouvert'); await snap('recolte-plateau'); await diffButtons(); }
      const path = await p.evaluate(() => {
        const h = window.__find('HarvestGame'); if (!h || h.finished || h.animating) return null; const g = h.game.board; const n = g.length; let best = [];
        const walk = (x, y, kind, seen) => { let out = [...seen]; for (const [dx, dy] of [[1,0],[0,1],[-1,0],[0,-1],[1,1],[-1,-1],[1,-1],[-1,1]]) { const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= n || ny >= n || g[ny][nx] !== kind || seen.some(([a, c]) => a === nx && c === ny)) continue; const r = walk(nx, ny, kind, [...seen, [nx, ny]]); if (r.length > out.length) out = r; if (out.length >= 6) break; } return out; };
        for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) { const r = walk(x, y, g[y][x], [[x, y]]); if (r.length > best.length) best = r; }
        return { path: best.slice(0, 6), n };
      }).catch(() => null);
      if (path && path.path.length >= 3) {
        const box = await p.locator('.harvest__board').boundingBox();
        const at = ([x, y]) => [box.x + (x + 0.5) * box.width / path.n, box.y + (y + 0.5) * box.height / path.n];
        touches++;
        await p.mouse.move(...at(path.path[0])); await p.mouse.down();
        for (const c of path.path.slice(1)) { await p.mouse.move(...at(c), { steps: 3 }); await p.waitForTimeout(50); }
        await p.mouse.up();
        harvestDone++;
        await p.waitForTimeout(900);
      } else await p.waitForTimeout(500);
      idleSince = Date.now();
      // (la suite : le bilan, par les boutons ci-dessous)
    }
    // L'annonce d'un naufrage (jours 6 à 8) : lue, puis un toucher n'importe où
    const wreckText = await p.evaluate(() => { const w = document.querySelector('.world__wreck-text'); return w ? w.innerText : null; }).catch(() => null);
    if (wreckText) {
      if (lastGuide !== `wreck-${wreckText}`) { lastGuide = `wreck-${wreckText}`; guideShownAt = Date.now(); say('naufrage', wreckText); await snap('naufrage'); await diffButtons(); }
      if (Date.now() - guideShownAt > reading(wreckText)) { const bb = await p.locator('.world__wreck').boundingBox(); if (bb) await touch(bb.x + bb.width / 2, bb.y + bb.height / 3); guideShownAt = Date.now() + 99999; await p.waitForTimeout(1200); }
      idleSince = Date.now();
      continue;
    }
    // La bulle de Brume (ou d'un personnage)
    const guide = await p.evaluate(() => { const g = document.querySelector('.guide'); if (!g) return null; return { who: (g.querySelector('.guide__name') || {}).innerText, text: (g.querySelector('.guide__text') || {}).innerText, action: (g.querySelector('.guide__btn:not(.guide__btn--quiet)') || {}).innerText || '' }; }).catch(() => null);
    if (guide && guide.text) {
      if (guide.text !== lastGuide) { lastGuide = guide.text; guideShownAt = Date.now(); say('bulle', `${guide.who} : ${guide.text}${guide.action ? ` [${guide.action}]` : ''}`); await snap(`bulle-${guide.who}`); if (guide.who === 'ASTER' || /^Un ponton/.test(guide.text)) { await p.waitForTimeout(2500); await snap(`camera-${guide.who}`); } await diffButtons(); idleSince = Date.now(); }
      if (Date.now() - guideShownAt > reading(guide.text)) {
        const btn = p.locator(guide.action ? '.guide__btn:not(.guide__btn--quiet)' : '.guide__btn--quiet');
        const bb = await btn.first().boundingBox().catch(() => null);
        if (bb) { await touch(bb.x + bb.width / 2, bb.y + bb.height / 2); guideShownAt = Date.now() + 99999; await p.waitForTimeout(400); }
      }
      continue;
    }
    // La main du coach : toucher le centre de sa cible
    const coach = await p.evaluate(() => { const c = window.__find('CoachLayer'); const say2 = document.querySelector('.coach__say, .coach__text'); const show = document.querySelector('.coach__show'); const w = window.__find('WorldView'); return { hole: c && c.hole && c.ready ? c.hole : null, text: (say2 ? say2.innerText : '(main seule)'), show: Boolean(show), lesson: c && c.lesson ? `${c.lesson.id}:${c.at}` : '', target: c && c.step ? c.step.target : '' }; }).catch(() => ({}));
    if (coach.hole || coach.show) {
      const key = `${coach.lesson}|${coach.text}`;
      if (process.env.RELOAD_ON && !reloaded && coach.lesson.includes(process.env.RELOAD_ON)) { reloaded = true; await p.waitForTimeout(1500); say('FERMETURE DE L’APPLI', coach.lesson); await snap('avant-fermeture'); await p.reload(); say('appli rouverte'); lastCoach = ''; lastState = ''; continue; }
      if (key !== lastCoach) { lastCoach = key; coachTries = 0; coachShownAt = Date.now(); say('coach', `${coach.lesson} · ${coach.text}`); if (coach.lesson.startsWith('quest-rivet-brume')) { await p.waitForTimeout(1500); say('  caméra', JSON.stringify(await p.evaluate(() => { const w = window.__find('WorldView'); const c = window.__find('CoachLayer'); return { cam: w && w.cam ? [Math.round(w.cam.x), Math.round(w.cam.y)] : null, hole: c && c.hole ? [Math.round(c.hole.x), Math.round(c.hole.y)] : null }; }))); } say('  défilement', JSON.stringify(await p.evaluate(() => { const se = document.scrollingElement; const m = document.querySelector('#main-content'); const sc = [...document.querySelectorAll('*')].filter(e => e.scrollHeight > e.clientHeight + 4 && /auto|scroll/.test(getComputedStyle(e).overflowY)).map(e => `${e.className || e.tagName}:${e.scrollTop}/${e.scrollHeight - e.clientHeight}`).slice(0, 4); return { y: Math.round(scrollY), max: se.scrollHeight - innerHeight, sc }; }))); await snap(`coach-${coach.lesson}`); await diffButtons(); idleSince = Date.now(); }
      if (Date.now() - coachShownAt > reading(coach.text)) {
        coachTries++;
        // Un joueur qui ne trouve pas, après trois essais, cherche ailleurs : « Réclamer », « Dormir » à l'écran
        const fallback = p.locator('button:visible', { hasText: /^(Réclamer|Dormir)/ });
        if (coachTries > 3 && await fallback.count()) { const label = (await fallback.first().innerText()).trim().replace(/\s+/g, ' '); say('REPLI (le coach ne mène pas)', `toucher « ${label} »`); await snap('repli'); const bb = await fallback.first().boundingBox(); await touch(bb.x + bb.width / 2, bb.y + bb.height / 2); coachTries = 0; }
        else if (coach.hole && coach.target === 'île:trace') {
          // L'enclos d'un trait : appui long sur la première case, puis le doigt glisse sur chaque case de l'anneau
          const pts = await p.evaluate(() => { const w = window.__find('WorldView'); const r = document.querySelector('canvas').getBoundingClientRect(); const cells = w.craftTrace ? w.craftTrace.cells : []; return (w.barrier || w.enclos || []).filter(sp => !cells.some(c => c.x === sp.x && c.y === sp.y)).map(sp => { const g = w.ground(sp.x, sp.y); const s2 = w.toScreen(g.x, g.y); return { x: r.left + s2.x, y: r.top + s2.y }; }); });
          say('  trait', `${pts.length} cases`);
          touches++;
          await p.mouse.move(pts[0].x, pts[0].y); await p.mouse.down(); await p.waitForTimeout(800);
          for (const q of pts.slice(1)) { await p.mouse.move(q.x, q.y, { steps: 6 }); await p.waitForTimeout(60); }
          await p.mouse.up();
          say('  trait posé', JSON.stringify(await p.evaluate(() => { const w = window.__find('WorldView'); return { cells: w.craftTrace ? w.craftTrace.cells.length : 0, full: w.lineFull, banner: w.lineBanner }; })));
          await snap('trait');
        }
        else if (coach.hole) {
          // Sur l'étagère du Grimoire, un joueur touche l'élément que l'Encre a révélé, pas le milieu de l'étagère
          const h = coach.hole;
          const tile = await p.evaluate(hh => { const t = [...document.querySelectorAll('[aria-label*="révélé par l’Encre"]')].map(el => el.getBoundingClientRect()).find(r => r.width && r.left >= hh.x - 2 && r.right <= hh.x + hh.w + 2 && r.top >= hh.y - 2 && r.bottom <= hh.y + hh.h + 2); return t ? { x: t.left + t.width / 2, y: t.top + t.height / 2 } : null; }, h);
          if (tile) await touch(tile.x, tile.y);
          else if (coach.lesson.startsWith('quest-deplacer:0')) await press(h.x + h.w / 2, h.y + h.h / 2);
          else {
            const probe = await p.evaluate(([x, y]) => { const w = window.__find('WorldView'); if (!w || !w.$refs) return null; const cv = document.querySelector('canvas'); const r = cv ? cv.getBoundingClientRect() : { left: 0, top: 0 }; try { const hit = w.hitAt(x - r.left, y - r.top); const a = window.__find('App'); const ap = a ? { run: a.prologueRunning, acts: Object.keys(a.islandTaps || {}).join(','), lesson: a.$options && (window.__coachLesson || '') } : null; return { app: ap, hit: hit ? Object.keys(hit).join(',') + (hit.campItem ? ':' + hit.campItem.art : '') + (hit.mark ? ':' + hit.mark : '') + (hit.animal && hit.animal.who ? ':' + hit.animal.who.id : '') : null, acts: Object.keys(w.acts || {}).join(','), busy: w.busy }; } catch (e) { return { err: e.message }; } }, [h.x + h.w / 2, h.y + h.h / 2]).catch(e => ({ err: e.message }));
            if (coach.lesson.startsWith('quest-')) say('  sous le doigt', JSON.stringify(probe));
            await touch(h.x + h.w / 2, h.y + h.h / 2);
            if (process.env.SNAP_AFTER && coach.lesson.startsWith(process.env.SNAP_AFTER)) { for (let k = 0; k < 6; k++) { await p.waitForTimeout(350); await snap(`rafale-${k}`); } }
            // (ce que le toucher a fait : la bulle d'un choix, la fiche d'un quartier et son achat, le geste du coach)
            if (coach.lesson.startsWith('quest-')) { await p.waitForTimeout(700); say('  après le toucher', JSON.stringify(await p.evaluate(() => { const w = window.__find('WorldView'); const tip = document.querySelector('.world__tip-btn'); const buy = document.querySelector('[data-coach="zone-buy"]'); const c = window.__find('CoachLayer'); return { tip: tip ? `${tip.dataset.pick}:${tip.innerText}` : null, picked: w && w.picked ? w.picked.key : null, zone: w && w.zone ? w.zone.id : null, buy: buy ? { disabled: buy.disabled, text: buy.innerText } : null, at: c ? c.at : null }; }).catch(e => String(e)))); }
          }
        }
        else { const bb = await p.locator('.coach__show').boundingBox(); if (bb) await touch(bb.x + bb.width / 2, bb.y + bb.height / 2); }
        coachShownAt = Date.now() - reading(coach.text) + 1500; // (si rien ne change, retoucher 1,5 s plus tard)
        await p.waitForTimeout(500);
      }
      continue;
    }
    // Ce qui attend un toucher, sans coach : bilans, fiches (une liste courte de boutons connus)
    const generic = p.locator('button:visible', { hasText: /^(Super\s?!|Compris|Continuer|Merci, Brume|Je veillerai|Fermer|Rentrer|OK|D’accord|Retour à l’île)$/ });
    if (await generic.count()) {
      const label = (await generic.first().innerText()).trim();
      if (lastGuide !== `btn-${label}-${now()}`) { say('bouton', label); await snap(`bouton-${label}`); await diffButtons(); }
      const bb = await generic.first().boundingBox(); if (bb) await touch(bb.x + bb.width / 2, bb.y + bb.height / 2);
      await p.waitForTimeout(700); idleSince = Date.now();
      continue;
    }
    if (process.env.FIN_SCENE && st && st.scene === process.env.FIN_SCENE) { say('fin', `scène ${process.env.FIN_SCENE}`); await snap('fin-scene'); break; }
    if (process.env.FIN_AT && st && st.quest.replace('✓', '') === process.env.FIN_AT) { say('fin', `quête ${process.env.FIN_AT}`); say('égarés du tuto', JSON.stringify(await p.evaluate(() => { const w = window.__find('WorldView'); return (w.tutoStrays || []).map(c => `${c.kind}:${c.end}${c.wakeAt ? ':réveillé' : ''}`); }))); await snap('fin-quete'); say('enclos', sql(`SELECT count(*) FROM world_crafts WHERE user_id = ${userId} AND craft = 'cloture' AND x IS NOT NULL`)); break; }
    // (sans FIN_AT : on s'arrête au matin de Rivet)
    if (st && !process.env.FIN_AT && (process.env.PLUS_LOIN ? st.scene === 'rivet' : (st.scene === 'rivet' || st.quest.startsWith('deco')))) { say('fin', process.env.PLUS_LOIN ? 'la scène de Rivet' : 'le matin de Rivet'); await snap('matin-rivet'); say('poulailler', sql(`SELECT annex || ' ' || x || ',' || y FROM world_annexes WHERE user_id = ${userId}`)); say('caméra', JSON.stringify(await p.evaluate(() => { const w = window.__find('WorldView'); return w && w.cam ? { x: Math.round(w.cam.x), y: Math.round(w.cam.y), s: w.cam.s } : null; }))); break; }
    // Rien à faire : on attend, puis on note le blocage
    const idle = (Date.now() - idleSince) / 1000;
    // La première nuit sans main : un joueur qui tâtonne finit par toucher Brume
    if (idle > 10 && st && ['nuit', 'veille', 'nuit-cannelle', 'nuit-rivet'].includes(st.quest.replace('✓', ''))) {
      const at = await p.evaluate(() => { const w = window.__find('WorldView'); const h = w && w.brumeHit; if (!h) return null; const s = w.toScreen(h.x, h.y); const c = w.canvasPoint(s.x, s.y); return { x: c.x, y: c.y }; }).catch(() => null);
      if (at) { say('REPLI (aucune main la nuit)', 'toucher Brume'); await snap('nuit-sans-main'); await touch(at.x, at.y); idleSince = Date.now(); await p.waitForTimeout(1500); continue; }
    }
    // Une fiche restée ouverte, que rien ne guide : un joueur finit par toucher sa croix (pas celle du coach)
    if (idle > 20) {
      const cross = p.locator('.g-modal__close:visible');
      if (await cross.count()) { say('REPLI (fiche ouverte, rien ne guide)', 'toucher la croix'); await snap('repli-croix'); const bb = await cross.first().boundingBox(); if (bb) await touch(bb.x + bb.width / 2, bb.y + bb.height / 2); idleSince = Date.now(); await p.waitForTimeout(1200); continue; }
    }
    if (idle > 8 && idle < 8.3) { say('rien à toucher depuis 8 s', JSON.stringify(st)); await snap('attente-8s'); await diffButtons(); }
    if (idle > 30) { say('ÉTAT INTERNE', JSON.stringify(await p.evaluate(() => { const a = document.querySelector('#app').__vue_app__._instance.proxy; return { prologue: a.prologue, arcScenes: a.arcScenes, arcPlayed: a.arcPlayed, arcFlight: a.arcFlight, arcWaiting: a.arcWaiting, vigilsSeen: a.vigilsSeen, prologueScene: a.prologueScene, breath: Boolean(a.breathTimer), veillee: a.veilleeOn, hold: a.islandHold, world: a.isWorldActive, tutorialState: a.tutorialState }; }).catch(e => String(e)))); }
    if (idle > 30) { say('BLOQUÉ', `30 s sans rien à toucher · ${JSON.stringify(st)}`); await snap('bloque'); await diffButtons(); break; }
  }
  // La scène d'Aster, si elle est là
  await p.waitForTimeout(1500);
  await snap('fin');
  say('fin du banc', `${touches} touchers, ${harvestDone} chaînes de Récolte`);
  if (errors.length) { say('erreurs de la page', ''); [...new Set(errors)].slice(0, 15).forEach(e => say('  !', e)); }
  log.end();
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
