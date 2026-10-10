// Aperçu de la troupe : les SVG rangés par personnage (svg/<nom>/), une page animée commune (×5, marches en miroir),
// et, si Playwright est installé, les planches PNG (planches/). CHROMIUM_PATH : un Chromium précis (facultatif).
// Lancer : node design/personnages/apercu.js
const fs = require('fs');
const path = require('path');
const { frame, svg, POSES, EXPRS, IMAGES } = require('./troupe');

const CAST = [require('./aster'), require('./cannelle'), require('./rivet'), require('./ondin'), require('./sylve'), require('./galet'), require('./melisse')];
const LABEL = { face_repos: 'Face · repos', avant_marche: 'Trois quarts avant · marche', dos_marche: 'Trois quarts dos · marche', face_salut: 'Face · salut',
  avant_longuevue: 'Action · longue-vue', face_louche: 'Action · louche brandie', face_loupe: 'Action · loupe et rouage', face_baguette: 'Action · baguette de sourcier', face_chant: 'Action · chant aux graines', face_rune: 'Action · rune gravée', face_graines: 'Action · boîte à graines' };
// identifiant de fichier sans accent (Mélisse → melisse)
const slug = name => name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const XLABEL = { neutre: 'Neutre', content: 'Content', rire: 'Rire', surpris: 'Surpris', triste: 'Triste', fache: 'Fâché', gene: 'Gêné', endormi: 'Endormi' };
const css = `body{margin:0;font-family:system-ui,sans-serif;background:#F4EEDF;color:#3C2819}
h1{font-size:20px;margin:16px 20px 4px}h2{font-size:17px;margin:18px 20px 6px}p{margin:0 20px 12px;font-size:13px}
.row{display:flex;align-items:flex-end;gap:10px;margin:0 20px 14px;padding:10px;border-radius:12px;background:#CFE3B4}
.row b{width:150px;font-size:13px}.cell{text-align:center;font-size:11px}`;
// identifiants des découpes rendus uniques (une même image peut apparaître deux fois dans la page)
let uniq = 0;
const unique = body => { const t = `_${uniq++}`; return body.replace(/id="([^"]+)"/g, `id="$1${t}"`).replace(/url\(#([^)]+)\)/g, `url(#$1${t})`); };

const all = {};
for (const c of CAST) {
  const poses = [...POSES, [c.action[0], c.action[1], 'action', 2]];
  const dir = path.join(__dirname, 'svg', slug(c.name));
  fs.mkdirSync(dir, { recursive: true });
  all[c.name] = poses.map(([name, view, pose, count]) => {
    const frames = [];
    for (let n = 0; n < count; n++) {
      const body = frame(c, view, pose, n);
      fs.writeFileSync(path.join(dir, `${slug(c.name)}_${name}_${n + 1}.svg`), svg(body) + '\n');
      frames.push(body);
    }
    return { name, view, pose, frames };
  });
}

// expressions : face au repos (2 images, un SVG chacune) et trois quarts avant pour la planche
const exprs = {};
for (const c of CAST) {
  const dir = path.join(__dirname, 'svg', slug(c.name));
  exprs[c.name] = EXPRS.map(x => {
    const front = [...Array(IMAGES.repos).keys()].map(n => frame(c, 'front', 'repos', n, x));
    front.forEach((b, n) => fs.writeFileSync(path.join(dir, `${slug(c.name)}_expr_${x}_${n + 1}.svg`), svg(b) + '\n'));
    return { x, front, se: frame(c, 'se', 'repos', 0, x) };
  });
}
const exprSheets = CAST.map(c => {
  const cells = exprs[c.name].map(e => `<div class="row" style="display:inline-flex;margin:0 0 14px 20px"><b style="width:70px">${XLABEL[e.x]}</b>`
    + [...e.front, e.se].map((b, i) => `<div class="cell">${svg(unique(b), 4)}<div>${i < 2 ? 'face ' + (i + 1) : 'trois quarts'}</div></div>`).join('') + '</div>').join('');
  return [`expressions_${slug(c.name)}`, `<!doctype html><meta charset="utf-8"><style>${css}</style><h1>${c.name} — expressions</h1><p>Face au repos (2 images) et trois quarts avant. Chaque expression se combine avec n'importe quelle pose.</p>${cells}`];
});

// planches
const sheets = CAST.map(c => {
  const rows = all[c.name].map(p => `<div class="row"><b>${LABEL[p.name]}</b>${p.frames.map((b, n) => `<div class="cell">${svg(unique(b), 4)}<div>${n + 1}</div></div>`).join('')}</div>`).join('');
  return [c.name, `<!doctype html><meta charset="utf-8"><style>${css}</style><h1>${c.name} — planche d'essai</h1><p>SVG 48 × 64, pieds en bas au centre. Affiché ×4.</p>${rows}`];
});

// page animée
const T = { repos: [700, 600, 700, 160], salut: [160], marche: [85], action: [700, 1100], expr: [700, 600, 700, 160] };
let boxes = '';
const timings = [];
for (const c of CAST) {
  boxes += `<h2>${c.name}</h2><div class="grid">`;
  for (const p of all[c.name]) {
    const variants = p.pose === 'marche' ? [false, true] : [false];
    for (const mirror of variants) {
      const i = timings.length;
      timings.push(T[p.pose]);
      const imgs = p.frames.map((b, n) => `<div class="f" data-a="${i}" style="display:${n ? 'none' : 'block'}${mirror ? ';transform:scaleX(-1)' : ''}">${svg(unique(b), 5)}</div>`).join('');
      boxes += `<div class="box"><div class="stage">${imgs}</div><div class="lab">${LABEL[p.name]}${mirror ? ' (miroir)' : ''}</div></div>`;
    }
  }
  boxes += '</div><h2>' + c.name + ' — expressions</h2><div class="grid">';
  for (const e of exprs[c.name]) {
    const i = timings.length;
    timings.push(e.x === 'neutre' || e.x === 'content' ? T.repos : T.expr);
    boxes += `<div class="box"><div class="stage">${e.front.map((b, n) => `<div class="f" data-a="${i}" style="display:${n ? 'none' : 'block'}">${svg(unique(b), 5)}</div>`).join('')}</div><div class="lab">${XLABEL[e.x]}</div></div>`;
  }
  boxes += '</div>';
}
const page = `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>La troupe en mouvement</title>
<style>${css}.grid{display:flex;flex-wrap:wrap;gap:14px;margin:0 20px 10px}.box{background:#CFE3B4;border-radius:14px;padding:10px;text-align:center}
.stage{width:240px;height:320px;position:relative}.f{position:absolute;inset:0}.lab{font-size:13px;margin-top:4px}</style></head><body>
<h1>La troupe en mouvement</h1><p>Aperçu animé (×5). Les marches en miroir donnent les quatre directions de l'île.</p>${boxes}
<script>const T=${JSON.stringify(timings)};T.forEach((d,i)=>{let n=0;const fs=[...document.querySelectorAll('.f[data-a="'+i+'"]')];
const tick=()=>{fs[n].style.display='none';n=(n+1)%fs.length;fs[n].style.display='block';setTimeout(tick,d[n]);};setTimeout(tick,d[0]);});</script></body></html>`;
fs.writeFileSync(path.join(__dirname, 'troupe_apercu.html'), page);

let chromium;
try {
  ({ chromium } = require('playwright'));
} catch {
  console.log('Playwright absent : SVG et page animée écrits, planches PNG non générées.');
  process.exit(0);
}
const out = path.join(__dirname, 'planches');
fs.mkdirSync(out, { recursive: true });
(async () => {
  const b = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
  const p = await b.newPage({ viewport: { width: 1060, height: 900 }, deviceScaleFactor: 1 });
  for (const [name, html] of sheets) {
    await p.setContent(html);
    await p.screenshot({ path: path.join(out, `planche_${slug(name)}.png`), fullPage: true });
  }
  await p.setViewportSize({ width: 1440, height: 900 });
  for (const [name, html] of exprSheets) {
    await p.setContent(html);
    await p.screenshot({ path: path.join(out, `${name}.png`), fullPage: true });
  }
  await b.close();
  console.log('ok');
})();
