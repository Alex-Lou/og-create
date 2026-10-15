// Le coût de chaque dessin de scène du tutoriel (design/bibliotheque/svg/scenes/tutoriel), seul : une <img> de
// 390 × 390 px CSS, écran ×3 (un téléphone), processeur ralenti ×4 ; images par seconde et plus longue tâche sur 3 s,
// avec ce qui coûte dans le SVG (animations, fusions, masques, découpes, tracés). Sans serveur : les fichiers sont lus
// sur le disque. Cible (choix de l'auteur, 15 oct.) : 58 images/s au moins et aucune longue tâche pour chaque fichier.
// Usage : NODE_PATH=/opt/node22/lib/node_modules node outils/banc/scenes.cjs [motif]   (ex. : 12_veillee)
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '../../design/bibliotheque/svg/scenes/tutoriel');
const only = process.argv[2] || '';
const count = (svg, re) => (svg.match(re) || []).length;

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3 });
  const p = await ctx.newPage();
  const cdp = await ctx.newCDPSession(p);
  await p.goto(`file://${ROOT}/scenes.json`);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  const files = fs.readdirSync(ROOT).filter(d => fs.statSync(path.join(ROOT, d)).isDirectory())
    .flatMap(d => fs.readdirSync(path.join(ROOT, d)).filter(f => f.endsWith('.svg')).map(f => `${d}/${f}`))
    .filter(f => f.includes(only));
  const rows = [];
  for (const f of files) {
    const svg = fs.readFileSync(path.join(ROOT, f), 'utf8');
    const cost = await p.evaluate(async src => {
      document.body.innerHTML = `<img src="${src}" style="width:390px;height:390px;display:block">`;
      await new Promise(resolve => { const img = document.querySelector('img'); img.onload = img.onerror = resolve; });
      await new Promise(resolve => setTimeout(resolve, 800));
      let longest = 0;
      const po = new PerformanceObserver(list => { for (const e of list.getEntries()) longest = Math.max(longest, e.duration); });
      po.observe({ type: 'longtask' });
      let n = 0;
      const t0 = performance.now();
      await new Promise(resolve => { const step = () => { n++; if (performance.now() - t0 < 3000) requestAnimationFrame(step); else resolve(); }; requestAnimationFrame(step); });
      po.disconnect();
      return { fps: Math.round(n / 3), longest: Math.round(longest) };
    }, `file://${path.join(ROOT, f)}`);
    rows.push([cost.fps, cost.longest, Math.round(svg.length / 1024), count(svg, /<animate/g), count(svg, /mix-blend/g), count(svg, /<mask/g), count(svg, /<clipPath/g), count(svg, /<path/g), f]);
  }
  rows.sort((x, y) => x[0] - y[0]);
  console.log(['i/s', 'longue', 'Ko', 'anim', 'fusion', 'masques', 'découpes', 'tracés', 'fichier'].join('\t'));
  for (const row of rows) console.log(row.join('\t') + (row[0] < 58 || row[1] > 0 ? '\t← au-dessus du budget' : ''));
  await b.close();
})();
