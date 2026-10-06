// Outils communs des planches d'essai et des pages animées (tous les lots d'assets).
const fs = require('fs');
const path = require('path');

const css = `body{margin:0;font-family:system-ui,sans-serif;background:#F4EEDF;color:#3C2819}
h1{font-size:20px;margin:16px 20px 4px}h2{font-size:17px;margin:18px 20px 6px}p{margin:0 20px 12px;font-size:13px}
.row{display:flex;flex-wrap:wrap;align-items:flex-end;gap:10px;margin:0 20px 14px;padding:10px;border-radius:12px;background:#CFE3B4}
.row b{width:150px;font-size:13px}.row b:empty{display:none}.cell{text-align:center;font-size:11px}
.grid{display:flex;flex-wrap:wrap;gap:14px;margin:0 20px 10px}.box{background:#CFE3B4;border-radius:14px;padding:10px;text-align:center}
.stage{position:relative}.f{position:absolute;inset:0}.lab{font-size:13px;margin-top:4px}`;

// identifiants des découpes et dégradés rendus uniques (une même image peut apparaître plusieurs fois)
let uniq = 0;
const unique = body => { const t = `_${uniq++}`; return body.replace(/id="([^"]+)"/g, `id="$1${t}"`).replace(/url\(#([^)]+)\)/g, `url(#$1${t})`); };
const slug = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');

// Une rangée de la planche : libellé + images (svgOf(body) → <svg>)
const row = (label, cells) => `<div class="row"><b>${label}</b>${cells.map(([html, cap]) => `<div class="cell">${html}<div>${cap}</div></div>`).join('')}</div>`;
const sheet = (title, sub, rows) => `<!doctype html><meta charset="utf-8"><style>${css}</style><h1>${title}</h1><p>${sub}</p>${rows.join('')}`;

// Page animée : boxes = [{ label, frames: [svgHtml], timings: [ms], w, h, mirror }]
function animated(title, sub, sections) {
  let html = '';
  const timings = [];
  for (const [name, boxes] of sections) {
    html += `<h2>${name}</h2><div class="grid">`;
    for (const b of boxes) {
      const i = timings.length;
      timings.push(b.timings);
      html += `<div class="box"><div class="stage" style="width:${b.w}px;height:${b.h}px">${b.frames.map((f, n) => `<div class="f" data-a="${i}" style="display:${n ? 'none' : 'block'}${b.mirror ? ';transform:scaleX(-1)' : ''}">${f}</div>`).join('')}</div><div class="lab">${b.label}</div></div>`;
    }
    html += '</div>';
  }
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><style>${css}</style></head><body>
<h1>${title}</h1><p>${sub}</p>${html}
<script>const T=${JSON.stringify(timings)};T.forEach((d,i)=>{let n=0;const fs=[...document.querySelectorAll('.f[data-a="'+i+'"]')];if(fs.length<2)return;
const tick=()=>{fs[n].style.display='none';n=(n+1)%fs.length;fs[n].style.display='block';setTimeout(tick,d[n%d.length]);};setTimeout(tick,d[0]);});</script></body></html>`;
}

// Écrit un SVG (dossier créé au besoin)
function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content + '\n');
}

// Captures PNG des planches : shots = [[fichier, html, largeur]]
async function shoot(shots) {
  const { chromium } = require('/opt/node-tools/node_modules/playwright');
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage({ viewport: { width: 1100, height: 900 }, deviceScaleFactor: 1 });
  for (const [file, html, width] of shots) {
    await p.setViewportSize({ width: width || 1100, height: 900 });
    await p.setContent(html);
    await p.screenshot({ path: file, fullPage: true });
  }
  await b.close();
}

module.exports = { css, unique, slug, row, sheet, animated, write, shoot };
