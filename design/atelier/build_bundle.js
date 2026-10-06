// Assemble la bibliothèque complète : svg/, planches/, apercus/, README.md, index.html
const fs = require('fs');
const path = require('path');
const OUT = path.join(__dirname, '..', 'bibliotheque');
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, 'planches'), { recursive: true });
fs.mkdirSync(path.join(OUT, 'apercus'), { recursive: true });
fs.cpSync(path.join(__dirname, 'lib'), path.join(OUT, 'svg'), { recursive: true });
const pngs = [...fs.readdirSync(path.join(__dirname, 'planches')).map(f => ['planches', f]), ...fs.readdirSync(__dirname).filter(f => /^(planche|expressions)_.*\.png$/.test(f)).map(f => ['.', f])];
for (const [d, f] of pngs) fs.copyFileSync(path.join(__dirname, d, f), path.join(OUT, 'planches', f));
const PAGES = [['troupe_apercu.html', 'Les 7 maîtres'], ['vivants_apercu.html', 'Brume, Anya, le cerf, le Passeur'], ['pnj_apercu.html', 'PNJ au petit format'], ['animaux_apercu.html', 'Animaux'], ['decor_apercu.html', 'Décor'], ['batiments_apercu.html', 'Bâtiments'], ['meteo_apercu.html', 'Météo'], ['naufrages_apercu.html', 'Les naufragés'], ['naufrages_pnj_apercu.html', 'Naufragés au petit format'], ['camp_apercu.html', 'Le camp'], ['ruines_apercu.html', 'Ruines des Anciens'], ['betes_orientees_apercu.html', 'Bêtes orientées'], ['coffres_apercu.html', 'Coffres'], ['scenes_apercu.html', 'Scènes de l\'histoire']];
for (const [f] of PAGES) fs.copyFileSync(path.join(__dirname, f), path.join(OUT, 'apercus', f));
fs.copyFileSync(path.join(__dirname, 'bundle_README.md'), path.join(OUT, 'README.md'));
const files = fs.readdirSync(path.join(OUT, 'planches'));
const SECTIONS = [
  ['Personnages', /^(planche|expressions)_(?!en_marche)|^pnj_/], ['Naufragés', /^naufrages_|^expressions_en_marche/], ['Vivants', /^planche_(anya|brume|cerf|passeur)/], ['Animaux', /^animaux_/], ['Plantes et rochers', /^plantes_/],
  ['Décor', /^decor_/], ['Camp et ruines', /^camp_|^ruines_/], ['Coffres', /^coffres/], ['Scènes de l\'histoire', /^scenes_/], ['Bâtiments', /^batiments_/], ['Météo', /^meteo_/]
];
const used = new Set();
let body = '';
for (const [title, rx] of SECTIONS) {
  const list = files.filter(f => rx.test(f) && !used.has(f)).sort();
  if (title === 'Personnages') list.splice(0, list.length, ...list.filter(f => !/anya|brume|cerf|passeur/.test(f)));
  list.forEach(f => used.add(f));
  body += `<h2>${title}</h2><div class="g">${list.map(f => `<a href="planches/${f}"><img src="planches/${f}" loading="lazy" alt="${f}"><span>${f.replace('.png', '').replace(/_/g, ' ')}</span></a>`).join('')}</div>`;
}
const count = (function walk(d) { return fs.readdirSync(d, { withFileTypes: true }).reduce((n, e) => n + (e.isDirectory() ? walk(path.join(d, e.name)) : e.name.endsWith('.svg') ? 1 : 0), 0); })(path.join(OUT, 'svg'));
fs.writeFileSync(path.join(OUT, 'index.html'), `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Assets de l'île</title>
<style>body{margin:0;font-family:system-ui,sans-serif;background:#F4EEDF;color:#3C2819}main{max-width:1200px;margin:0 auto;padding:16px}h1{font-size:24px;margin:8px 0}h2{font-size:18px;margin:22px 0 8px}
p{font-size:14px;line-height:1.5}.p a{display:inline-block;margin:4px 6px 4px 0;padding:6px 12px;border-radius:999px;background:#CFE3B4;color:#3C2819;text-decoration:none;font-size:14px}
.g{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px}.g a{display:block;background:#CFE3B4;border-radius:12px;padding:8px;color:#3C2819;text-decoration:none;font-size:12px}
.g img{width:100%;height:150px;object-fit:cover;object-position:top;border-radius:8px;background:#fff}.g span{display:block;margin-top:4px}</style></head>
<body><main><h1>Assets SVG de l'île</h1><p>${count} dessins au trait de la troupe, calés sur les cadres et les ancres du jeu (× 1,25). Les SVG sont dans <code>svg/</code>, les conventions dans <code>README.md</code>.</p>
<div class="p">${PAGES.map(([f, t]) => `<a href="apercus/${f}">▶ ${t}</a>`).join('')}</div>${body}</main></body></html>\n`);
console.log('ok', count, 'SVG,', files.length, 'planches');
