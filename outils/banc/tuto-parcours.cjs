// Le parcours complet d'un appareil neuf, comme un joueur qui lit et suit la main du coach : splash, ouverture, carte
// d'embarquement, Grimoire, île, Grève, feu, nuit, jour d'Aster, enclos, veillée… jusqu'au matin de Cannelle (ou un
// blocage). Chronologie (s depuis « Entrée »), touchers, boutons qui apparaissent, bulles et consignes du coach (« (main
// seule) » et le compteur « [n / m] » quand la consigne n'est plus redite), une capture par moment. API locale
// seulement ; la page de garde est signée avec une adresse locale et un mot de passe tiré au hasard.
// Usage : NODE_PATH=/opt/node22/lib/node_modules MOBILE=1 node outils/banc/tuto-parcours.cjs <port> <dossier> [maxS]
// (environ 10 min ; la chasse aux poules n'est pas jouée : voir tuto-jour.cjs)
const { chromium } = require('playwright');
const fs = require('fs');
const motDePasseDuBanc = `Banc-${require('crypto').randomBytes(9).toString('base64url')}-Aa1!`;
const [port = '8099', OUT = './shots', maxS = '900'] = process.argv.slice(2);
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
const log = fs.createWriteStream(`${OUT}/chronologie.txt`);
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: Number(process.env.VW || 390), height: Number(process.env.VH || 844) }, deviceScaleFactor: Number(process.env.DSF || 2), hasTouch: Boolean(process.env.MOBILE), isMobile: Boolean(process.env.MOBILE) });
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
  await ctx.addInitScript(() => { window.__sc = []; const o = Element.prototype.scrollIntoView; Element.prototype.scrollIntoView = function (...a) { window.__sc.push(`${Math.round(performance.now())}:${String(this.className).slice(0, 30)}`); return o.apply(this, a); }; });
  const p = await ctx.newPage();
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
  const app = () => p.evaluate(() => { const el = document.querySelector('#app'); const a = el && el.__vue_app__ && el.__vue_app__._instance && el.__vue_app__._instance.proxy; if (!a) return null; return { mode: a.currentMode, quest: a.islandQuest ? `${a.islandQuest.id}${a.islandQuest.done ? '✓' : ''}` : '-', scene: a.prologueScene, locked: (a.lockedTabs || []).join(','), hold: a.islandHold, breath: Boolean(a.breathTimer) }; }).catch(() => null);

  await p.goto(base + '/');
  say('page ouverte');
  // Le splash : « Entrée »
  await p.waitForSelector('#splash-enter', { state: 'visible', timeout: 60000 });
  const loadMs = await p.evaluate(() => Math.round(performance.now()));
  say('splash prêt', `${loadMs} ms après le début de la page`);
  await snap('splash');
  const eb = await p.locator('#splash-enter').boundingBox();
  t0 = Date.now();
  await touch(eb.x + eb.width / 2, eb.y + eb.height / 2);
  say('Entrée touchée');

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
      // (une image à geste n'avance que par son bouton : « Avancer », « Remettre une bûche dans le feu »)
      if (!scene.auto && Date.now() - frameShownAt > reading(scene.text)) { if (scene.gesture) { touches++; await p.locator('.ps__gesture').click(); } else await touch(195, 420); frameShownAt = Date.now() + 99999; }
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
    const coach = await p.evaluate(() => { const c = window.__find('CoachLayer'); const say2 = document.querySelector('.coach__say, .coach__text'); const show = document.querySelector('.coach__show'); const tal = document.querySelector('.coach__tally'); return { hole: c && c.hole && c.ready ? c.hole : null, text: (say2 ? say2.innerText : '(main seule)') + (tal ? ` [${tal.innerText}]` : ''), show: Boolean(show), lesson: c && c.lesson ? `${c.lesson.id}:${c.at}` : '' }; }).catch(() => ({}));
    if (coach.hole || coach.show) {
      const key = `${coach.lesson}|${coach.text}`;
      if (key !== lastCoach) { lastCoach = key; coachTries = 0; coachShownAt = Date.now(); say('coach', `${coach.lesson} · ${coach.text}`); say('  défilement', JSON.stringify(await p.evaluate(() => { const se = document.scrollingElement; const m = document.querySelector('#main-content'); const sc = [...document.querySelectorAll('*')].filter(e => e.scrollHeight > e.clientHeight + 4 && /auto|scroll/.test(getComputedStyle(e).overflowY)).map(e => `${e.className || e.tagName}:${e.scrollTop}/${e.scrollHeight - e.clientHeight}`).slice(0, 4); const calls = window.__sc.length; const last = window.__sc.slice(-4); window.__sc = []; return { y: Math.round(scrollY), max: se.scrollHeight - innerHeight, sc, calls, last }; }))); await snap(`coach-${coach.lesson}`); await diffButtons(); idleSince = Date.now(); }
      if (Date.now() - coachShownAt > reading(coach.text)) {
        coachTries++;
        // Un joueur qui ne trouve pas, après trois essais, cherche ailleurs : « Réclamer », « Dormir » à l'écran
        const fallback = p.locator('button:visible', { hasText: /^(Réclamer|Dormir)/ });
        if (coachTries > 3 && await fallback.count()) { const label = (await fallback.first().innerText()).trim().replace(/\s+/g, ' '); say('REPLI (le coach ne mène pas)', `toucher « ${label} »`); await snap('repli'); const bb = await fallback.first().boundingBox(); await touch(bb.x + bb.width / 2, bb.y + bb.height / 2); coachTries = 0; }
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
    if (st && (st.scene === 'cannelle' || st.quest.startsWith('soupe'))) { say('fin', 'le matin de Cannelle'); break; }
    // Rien à faire : on attend, puis on note le blocage
    const idle = (Date.now() - idleSince) / 1000;
    // La première nuit sans main : un joueur qui tâtonne finit par toucher Brume
    if (idle > 10 && st && ['nuit', 'veille'].includes(st.quest.replace('✓', ''))) {
      const at = await p.evaluate(() => { const w = window.__find('WorldView'); const h = w && w.brumeHit; if (!h) return null; const s = w.toScreen(h.x, h.y); const c = w.canvasPoint(s.x, s.y); return { x: c.x, y: c.y }; }).catch(() => null);
      if (at) { say('REPLI (aucune main la nuit)', 'toucher Brume'); await snap('nuit-sans-main'); await touch(at.x, at.y); idleSince = Date.now(); await p.waitForTimeout(1500); continue; }
    }
    if (idle > 8 && idle < 8.3) { say('rien à toucher depuis 8 s', JSON.stringify(st)); await snap('attente-8s'); await diffButtons(); }
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
