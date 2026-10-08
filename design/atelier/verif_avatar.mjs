// Fiabilité du kit d'avatar : aucun choix ne doit casser le dessin ni sortir du cadre.
// - 400 avatars tirés au hasard (accessoires et teintures à gagner compris), et leur version naufragée pour 150 d'entre
//   eux, dans les vues et les poses de la bibliothèque ;
// - chaque accessoire avec chaque coupe, en grande taille et en carrure large (le cas le plus serré pour le cadre).
// Chaque image est chargée dans un vrai navigateur (une image mal formée ne se charge pas), puis on vérifie qu'aucun
// pixel ne touche le bord du cadre 48 × 64. Usage : node verif_avatar.mjs (sort en erreur au moindre défaut).
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { frame } = require('./troupe.js');
const A = require('../personnages/avatar.js');
const { avatarNaufrage } = require('./avatar_naufrage.js');

const VUES = [['front', 'repos', 0], ['front', 'repos', 2], ['front', 'repos', 3], ['se', 'marche', 0], ['se', 'marche', 2], ['se', 'marche', 5], ['ne', 'marche', 2], ['ne', 'marche', 6], ['front', 'salut', 0], ['front', 'salut', 2],
  ['se', 'action', 1, 'ramasser'], ['front', 'action', 0, 'grelotter'], ['front', 'action', 1, 'lire'], ['front', 'repos', 1, null, 'endormi']];
const svg = body => `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="128" viewBox="0 0 48 64">${body}</svg>`;
const cas = [];
const ajoute = (nom, c, vues = VUES) => {
  for (const [v, p, f, geste, expr] of vues) {
    const s = svg(frame(geste ? { ...c, geste } : c, v, p, f, expr || undefined));
    cas.push({ nom: `${nom} · ${v} ${p} ${f}${geste ? ' ' + geste : ''}${expr ? ' ' + expr : ''}`, s });
  }
};
let erreurs = [];
for (let g = 1; g <= 400; g++) {
  const o = A.auHasard(g, { gratuit: false });
  try {
    ajoute(`hasard ${g}`, A.avatar(o, { uid: `h${g}` }));
    if (g <= 150) ajoute(`hasard ${g} naufragé`, avatarNaufrage(o, { uid: `h${g}` }), VUES.slice(0, 5));
  } catch (e) { erreurs.push(`hasard ${g} : ${e.message}`); }
}
const pire = { taille: 'grande', silhouette: 'large' };
for (const [id, a] of Object.entries(A.ACCESSOIRES)) {
  for (const coupe of Object.keys(A.FORMES.coupe)) {
    try { ajoute(`${id} + ${coupe}`, A.avatar({ ...pire, coupe, accessoires: { [a.emplacement]: { id } } }, { uid: `m${id}${coupe}` }), VUES.slice(0, 6)); } catch (e) { erreurs.push(`${id} + ${coupe} : ${e.message}`); }
  }
}
// valeurs manquantes dans le dessin
for (const { nom, s } of cas) if (/undefined|NaN|null/.test(s)) erreurs.push(`${nom} : valeur manquante dans le SVG`);

const { chromium } = require('/opt/node-tools/node_modules/playwright');
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const page = await b.newPage();
await page.setContent('<canvas id="c" width="96" height="128"></canvas>');
for (let i = 0; i < cas.length; i += 400) {
  const lot = cas.slice(i, i + 400);
  const res = await page.evaluate(async list => {
    const cv = document.getElementById('c'), ctx = cv.getContext('2d');
    const out = [];
    for (const { nom, s } of list) {
      const img = new Image();
      const ok = await new Promise(r => { img.onload = () => r(true); img.onerror = () => r(false); img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(s); });
      if (!ok) { out.push(`${nom} : image mal formée`); continue; }
      ctx.clearRect(0, 0, 96, 128); ctx.drawImage(img, 0, 0);
      const d = ctx.getImageData(0, 0, 96, 128).data;
      const bord = [];
      for (let x = 0; x < 96; x++) for (const y of [0, 127]) if (d[(y * 96 + x) * 4 + 3] > 24) bord.push(y ? 'bas' : 'haut');
      for (let y = 0; y < 128; y++) for (const x of [0, 95]) if (d[(y * 96 + x) * 4 + 3] > 24) bord.push(x ? 'droite' : 'gauche');
      if (bord.length) out.push(`${nom} : touche le bord (${[...new Set(bord)].join(', ')})`);
    }
    return out;
  }, lot);
  erreurs = erreurs.concat(res);
}
await b.close();
console.log(`${cas.length} images vérifiées`);
if (erreurs.length) {
  console.log(`${erreurs.length} défaut(s) :`);
  for (const e of erreurs.slice(0, 60)) console.log(' - ' + e);
  process.exit(1);
}
console.log('aucun défaut');
