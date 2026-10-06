// Détecte ce qui dépasse du cadre : chaque SVG est rendu dans un cadre agrandi (marge m), puis on compte les pixels
// opaques (alpha > seuil) hors du cadre d'origine. node clipcheck.js <dossier> [filtre] [exclure]
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node-tools/node_modules/playwright');
const [dir, flt, excl] = process.argv.slice(2);
const RX = new RegExp(flt || '.'), EX = excl ? new RegExp(excl) : null;
const walk = d => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : e.name.endsWith('.svg') ? [path.join(d, e.name)] : []);
const files = walk(dir).filter(f => RX.test(f) && !(EX && EX.test(f))).sort();
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage();
  await p.setContent('<canvas id="c"></canvas>');
  const out = [];
  for (const f of files) {
    const svg = fs.readFileSync(f, 'utf8');
    const res = await p.evaluate(async (svg) => {
      const m0 = svg.match(/viewBox="([^"]+)"/); const [x, y, w, h] = m0[1].split(/[ ,]+/).map(Number);
      const m = Math.max(w, h) * 0.5, S = 4;
      const big = svg.replace(/viewBox="[^"]+"/, `viewBox="${x - m} ${y - m} ${w + 2 * m} ${h + 2 * m}"`).replace(/ width="[^"]+"/, ` width="${(w + 2 * m) * S}"`).replace(/ height="[^"]+"/, ` height="${(h + 2 * m) * S}"`).replace(/ preserveAspectRatio="none"/, '');
      const img = new Image();
      await new Promise((ok, ko) => { img.onload = ok; img.onerror = ko; img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(big); });
      const c = document.getElementById('c'); c.width = Math.round((w + 2 * m) * S); c.height = Math.round((h + 2 * m) * S);
      const g = c.getContext('2d'); g.clearRect(0, 0, c.width, c.height); g.drawImage(img, 0, 0, c.width, c.height);
      const d = g.getImageData(0, 0, c.width, c.height).data;
      const x0 = Math.floor(m * S), y0 = Math.floor(m * S), x1 = Math.ceil((m + w) * S), y1 = Math.ceil((m + h) * S);
      const side = { haut: 0, bas: 0, gauche: 0, droite: 0 };
      for (let j = 0; j < c.height; j++) for (let i = 0; i < c.width; i++) {
        if (i >= x0 && i < x1 && j >= y0 && j < y1) continue;
        if (d[(j * c.width + i) * 4 + 3] > 60) { if (j < y0) side.haut++; else if (j >= y1) side.bas++; else if (i < x0) side.gauche++; else side.droite++; }
      }
      return side;
    }, svg);
    const tot = res.haut + res.bas + res.gauche + res.droite;
    if (tot > 12) out.push(`${path.relative(dir, f)}  ${Object.entries(res).filter(([, v]) => v > 3).map(([k, v]) => `${k}:${v}`).join(' ')}`);
  }
  await b.close();
  console.log(`${files.length} fichiers, ${out.length} qui dépassent`);
  console.log(out.join('\n'));
})();
