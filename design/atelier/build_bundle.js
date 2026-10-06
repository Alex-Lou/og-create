// Assemble la bibliothèque complète : svg/ (noms rangés), catalogue.json, planches/, apercus/, README.md, index.html
const fs = require('fs');
const path = require('path');
const C = require('./catalogue.js');

const LIB = path.join(__dirname, 'lib');
const OUT = path.join(__dirname, '..', 'bibliotheque');
const SVG = path.join(OUT, 'svg');
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, 'planches'), { recursive: true });
fs.mkdirSync(path.join(OUT, 'apercus'), { recursive: true });

// 1. Les SVG, sous leur nom rangé (catalogue.js), et une carte ancien -> nouveau
const tous = C.lister(LIB);
const carte = new Map();
const pris = new Map();
for (const f of tous.filter(f => f.endsWith('.svg'))) {
  const neuf = C.renommer(f);
  if (pris.has(neuf)) throw new Error(`deux dessins pour ${neuf} : ${pris.get(neuf)} et ${f}`);
  pris.set(neuf, f);
  carte.set(f, neuf);
}
// Clés des index qui portaient un ancien nom de groupe ou de sujet (seulement quand c'est sans ambiguïté)
const groupe = f => path.posix.basename(f, '.svg').replace(/_?\d+$/, '');
const sujet = f => path.posix.basename(path.posix.dirname(f));
const candidats = new Map();
const ajouter = (a, b) => { if (!candidats.has(a)) candidats.set(a, new Set()); candidats.get(a).add(b); };
for (const [a, b] of carte) { ajouter(groupe(a), groupe(b)); ajouter(sujet(a), sujet(b)); }
const groupes = new Map([...candidats].filter(([a, s]) => s.size === 1 && !s.has(a)).map(([a, s]) => [a, [...s][0]]));

for (const f of tous) {
  const src = path.join(LIB, f);
  if (f.endsWith('.svg')) {
    const dst = path.join(SVG, carte.get(f));
    fs.mkdirSync(path.dirname(dst), { recursive: true });
    if (C.MIROIR_KIT.test(carte.get(f))) fs.writeFileSync(dst, C.miroir(fs.readFileSync(src, 'utf8')));
    else fs.copyFileSync(src, dst);
  } else if (f.endsWith('.json')) {
    const avant = JSON.parse(fs.readFileSync(src, 'utf8'));
    const json = C.reecrireIndex(avant, path.posix.dirname(f), carte, groupes);
    if (JSON.stringify(json) !== JSON.stringify(avant) && json._lisez_moi) {
      const note = 'Noms rangés à l\'assemblage (README, catalogue.json) : <sujet>_<vue>_<pose>_<n>.svg, vues face, avant (l\'ancien « trois_quarts »), dos, profil ; les chemins ci-dessous suivent ces noms.';
      json._lisez_moi = [].concat(json._lisez_moi, note);
    }
    fs.mkdirSync(path.dirname(path.join(SVG, f)), { recursive: true });
    fs.writeFileSync(path.join(SVG, f), JSON.stringify(json, null, 1) + "\n");
  } else {
    fs.mkdirSync(path.dirname(path.join(SVG, f)), { recursive: true });
    fs.copyFileSync(src, path.join(SVG, f));
  }
}

// 2. Le catalogue : ce que savent les index des lots (nom, cadre, vitesse), puis une entrée par dessin
const metas = new Map();
for (const f of C.lister(SVG).filter(f => f.endsWith('.json'))) C.collecterMeta(JSON.parse(fs.readFileSync(path.join(SVG, f), 'utf8')), path.posix.dirname(f), metas);
const entrees = C.construire(SVG, metas);
const catalogue = {
  _lisez_moi: [
    'Le catalogue unique de la bibliothèque : une entrée par dessin (fixe, ou animé avec ses images dans l\'ordre), rangées dans l\'ordre du parcours du joueur (HISTOIRE.md, version 6).',
    'Chemins relatifs au dossier de la bibliothèque. cadre = viewBox [x, y, largeur, hauteur] autour de l\'ancre (0, 0), à l\'échelle du jeu × 1,25. ms_par_image : un nombre, ou une durée par image.',
    'vue : face, avant (trois quarts avant), dos (trois quarts dos), profil ; regarde : où le dessin regarde ; miroir : true si le miroir horizontal donne l\'autre côté.',
    'parcours : le chapitre où le dessin sert d\'abord (voir chapitres). statut : ok, ou a-revoir avec une note (corrections prévues).',
    'Les index de chaque lot (decor.json, batiments.json…) restent la référence pour les détails propres à un lot : places des objets de boutique, lumières des paliers, cadres du nom des enseignes, teintes.'
  ],
  regles: {
    noms: '<sujet>_<vue>_<pose>[_<variante>]_<n>.svg pour les personnages et les bêtes ; <sujet>_<état>_<n>.svg ailleurs. Un dessin fixe n\'a pas de numéro.',
    directions: 'avant : vient vers le bas à droite ; dos : s\'éloigne vers le haut à droite ; profil : tourné vers la droite. Le miroir (scaleX(-1)) donne le bas à gauche, le haut à gauche, la gauche. Les trois quarts avant du grand format (maîtres, naufragés, Anya, le Passeur) sortent du kit tournés vers le bas à gauche : ils sont publiés en miroir pour suivre cette règle.',
    lumiere: 'En haut à gauche. Trait brun #3C2819 ; les égarés, eux, ont le trait bleu nuit #3B4763 de la famille de la brume.'
  },
  chapitres: C.CHAPITRES.map(([id, titre, resume]) => ({ id, titre, resume })),
  manquants: C.MANQUANTS.map(([parcours, quoi]) => ({ parcours, quoi })),
  entrees
};
fs.writeFileSync(path.join(OUT, 'catalogue.json'), JSON.stringify(catalogue, null, 1) + '\n');

// 3. Planches, pages animées, README
const pngs = [...fs.readdirSync(path.join(__dirname, 'planches')).map(f => ['planches', f]), ...fs.readdirSync(__dirname).filter(f => /^(planche|expressions)_.*\.png$/.test(f)).map(f => ['.', f])];
for (const [d, f] of pngs) fs.copyFileSync(path.join(__dirname, d, f), path.join(OUT, 'planches', f));
const PAGES = [['troupe_apercu.html', 'Les 7 maîtres'], ['vivants_apercu.html', 'Brume, Anya, le cerf, le Passeur'], ['pnj_apercu.html', 'PNJ au petit format'], ['animaux_apercu.html', 'Animaux'], ['decor_apercu.html', 'Décor'], ['batiments_apercu.html', 'Bâtiments'], ['meteo_apercu.html', 'Météo'], ['naufrages_apercu.html', 'Les naufragés'], ['naufrages_pnj_apercu.html', 'Naufragés au petit format'], ['camp_apercu.html', 'Le camp'], ['ruines_apercu.html', 'Ruines des Anciens'], ['betes_orientees_apercu.html', 'Bêtes orientées'], ['coffres_apercu.html', 'Coffres'], ['avatar_apercu.html', 'L\'avatar du joueur'], ['egares_apercu.html', 'Les égarés'], ['lot_m_apercu.html', 'Le bâtiment embrumé, la cage aux poules, le crabe, les signes d\'Anya']];
for (const [f] of PAGES) fs.copyFileSync(path.join(__dirname, f), path.join(OUT, 'apercus', f));
fs.copyFileSync(path.join(__dirname, 'bundle_README.md'), path.join(OUT, 'README.md'));

// 4. La page : le catalogue, chapitre après chapitre ; un toucher (ou le survol) anime un dessin
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const parChapitre = new Map(C.CHAPITRES.map(([id]) => [id, []]));
for (const e of entrees) parChapitre.get(e.parcours).push(e);
const nbAReVoir = entrees.filter(e => e.statut === 'a-revoir').length;
const carteHtml = e => {
  const ms = Array.isArray(e.ms_par_image) ? e.ms_par_image.join(',') : (e.ms_par_image || '');
  const info = [e.images > 1 ? `${e.images} images` : 'fixe', e.vue && (e.miroir ? `${e.vue} (+ miroir)` : e.vue), e.batiment].filter(Boolean).join(' · ');
  return `<figure class="c${e.statut === 'a-revoir' ? ' r' : ''}" data-f="${esc(e.fichiers.join('|'))}" data-ms="${ms}" data-q="${esc((e.titre + ' ' + e.id).toLowerCase())}">`
    + `<div class="v"><img src="${esc(e.fichiers[0])}" loading="lazy" alt=""></div>`
    + `<figcaption><b>${esc(e.titre)}</b><span>${esc(info)}</span><code>${esc(e.id.split('/').pop())}</code>${e.note ? `<em>${esc(e.note)}</em>` : ''}</figcaption></figure>`;
};
let body = '';
for (const [id, titre, resume] of C.CHAPITRES) {
  const list = parChapitre.get(id);
  const manque = C.MANQUANTS.filter(([p]) => p === id);
  if (!list.length && !manque.length) continue;
  body += `<section id="${id}"><h2>${esc(titre)} <small>${list.length} dessin${list.length > 1 ? 's' : ''}</small></h2><p class="res">${esc(resume)}</p>`;
  if (manque.length) body += `<ul class="m">${manque.map(([, q]) => `<li>À dessiner : ${esc(q)}</li>`).join('')}</ul>`;
  body += `<div class="g">${list.map(carteHtml).join('')}</div></section>`;
}
const nav = C.CHAPITRES.filter(([id]) => parChapitre.get(id).length).map(([id, t]) => `<a href="#${id}">${esc(t.replace(/ — .*/, ''))}</a>`).join('');
const nbSvg = carte.size;
fs.writeFileSync(path.join(OUT, 'index.html'), `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Bibliothèque de l'île</title>
<style>
:root{--fond:#F4EEDF;--encre:#3C2819;--carte:#FFFDF6;--vert:#CFE3B4;--alerte:#C8743C}
*{box-sizing:border-box}body{margin:0;font-family:system-ui,sans-serif;background:var(--fond);color:var(--encre)}
header{padding:14px 16px 4px}.barre{position:sticky;top:0;z-index:2;background:var(--fond);padding:8px 16px;border-bottom:1px solid #e3d8bf}
h1{font-size:22px;margin:0 0 4px}header p{margin:0 0 8px;font-size:13px;line-height:1.45}
nav{display:flex;gap:6px;overflow-x:auto;padding-bottom:4px}nav a{flex:none;padding:5px 10px;border-radius:999px;background:var(--vert);color:var(--encre);text-decoration:none;font-size:13px}
.outils{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:6px;font-size:13px}.outils input[type=search]{flex:1;min-width:180px;padding:7px 10px;border-radius:10px;border:1px solid #d9cba8;background:#fff;font:inherit}
main{max-width:1280px;margin:0 auto;padding:8px 16px 40px}section{scroll-margin-top:96px}h2{font-size:18px;margin:26px 0 2px}h2 small{font-weight:400;font-size:13px;opacity:.7}
.res{margin:0 0 10px;font-size:13px;opacity:.85}.m{margin:0 0 10px;padding:8px 12px 8px 28px;border-radius:10px;background:#FBE6CF;font-size:13px}
.g{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px}
.c{margin:0;background:var(--carte);border-radius:12px;padding:8px;box-shadow:0 1px 0 #e3d8bf;cursor:pointer}.c.r{box-shadow:inset 0 0 0 2px var(--alerte)}
.v{height:120px;display:flex;align-items:center;justify-content:center;background:repeating-conic-gradient(#f3efe4 0 25%,#fff 0 50%) 0 0/16px 16px;border-radius:8px;overflow:hidden}
.v img{width:100%;height:100%;object-fit:contain}.c.miroir .v img{transform:scaleX(-1)}
figcaption{font-size:12px;line-height:1.35;margin-top:6px}figcaption b{display:block}figcaption span{display:block;opacity:.75}figcaption code{display:block;font-size:10.5px;opacity:.6;word-break:break-all}figcaption em{display:block;color:#8A4A1E;font-style:normal;margin-top:3px}
.cache{display:none}
</style></head><body>
<header><h1>Bibliothèque de l'île</h1>
<p>${nbSvg} dessins au trait de la troupe, ${entrees.length} entrées, rangées dans l'ordre du parcours du joueur. Survoler ou toucher un dessin l'anime. Les fichiers sont dans <code>svg/</code>, la liste complète dans <code>catalogue.json</code>, les conventions dans <code>README.md</code>. Bordure orange : ${nbAReVoir} entrées à revoir (la note dit pourquoi).</p></header>
<div class="barre"><nav>${nav}<a href="#planches">Planches</a></nav>
<div class="outils"><input type="search" id="q" placeholder="Chercher : poule, Aster, palier, nuit…"><label><input type="checkbox" id="r"> à revoir seulement</label><label><input type="checkbox" id="mi"> miroir</label></div></div>
<main>${body}
<section id="planches"><h2>Planches et pages animées</h2><p class="res">${PAGES.map(([f, t]) => `<a href="apercus/${f}">${esc(t)}</a>`).join(' · ')}</p>
<div class="g">${fs.readdirSync(path.join(OUT, 'planches')).sort().map(f => `<a class="c" href="planches/${f}"><div class="v"><img src="planches/${f}" loading="lazy" alt=""></div><figcaption>${esc(f.replace('.png', '').replace(/_/g, ' '))}</figcaption></a>`).join('')}</div></section>
</main>
<script>
const cards=[...document.querySelectorAll('figure.c')];let actif=null,minuteur=null;
function jouer(c){arreter();const f=c.dataset.f.split('|');if(f.length<2)return;const ms=(c.dataset.ms||'200').split(',').map(Number);const img=c.querySelector('img');let i=0;actif=c;
const pas=()=>{i=(i+1)%f.length;img.src=f[i];minuteur=setTimeout(pas,ms[i%ms.length]||200)};minuteur=setTimeout(pas,ms[0]||200)}
function arreter(){if(!actif)return;clearTimeout(minuteur);actif.querySelector('img').src=actif.dataset.f.split('|')[0];actif=null}
cards.forEach(c=>{c.addEventListener('mouseenter',()=>jouer(c));c.addEventListener('mouseleave',arreter);c.addEventListener('click',()=>actif===c?arreter():jouer(c))});
const q=document.getElementById('q'),r=document.getElementById('r'),mi=document.getElementById('mi');
function filtrer(){const t=q.value.trim().toLowerCase();cards.forEach(c=>c.classList.toggle('cache',(t&&!c.dataset.q.includes(t))||(r.checked&&!c.classList.contains('r'))));
document.querySelectorAll('main section[id]').forEach(s=>{if(s.id==='planches')return;const vis=s.querySelectorAll('figure.c:not(.cache)').length;s.classList.toggle('cache',(t||r.checked)&&!vis)})}
q.addEventListener('input',filtrer);r.addEventListener('change',filtrer);mi.addEventListener('change',()=>cards.forEach(c=>c.classList.toggle('miroir',mi.checked)));
</script></body></html>
`);
console.log('ok', nbSvg, 'SVG,', entrees.length, 'entrées,', nbAReVoir, 'à revoir,', fs.readdirSync(path.join(OUT, 'planches')).length, 'planches');
