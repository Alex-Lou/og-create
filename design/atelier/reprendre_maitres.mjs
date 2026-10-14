// Reprendre les dessins de base des maîtres depuis la bibliothèque publiée. Le script qui les dessinait (preview2.js :
// marche, repos, salut, travail, action, les 8 expressions, et leurs planches) n'existe plus ; les autres lots
// (preview_quotidien.mjs, preview_naufrages.js) n'écrivent que le reste. À lancer après tous les preview_* et avant
// build_bundle.js : il remet dans lib/ chaque SVG publié qu'aucun lot n'a écrit (sous le même nom, que renommer
// garde), en défaisant le miroir que build_bundle.js pose sur le trois quarts avant du grand format (vérifié réversible
// à l'octet), et remet à côté de lui troupe_apercu.html et les planches des maîtres (planche_<prénom>.png,
// expressions_<prénom>.png), que build_bundle.js recopie. Il s'arrête si autre chose qu'un maître manque.
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const C = require('./catalogue.js');
const ICI = path.dirname(fileURLToPath(import.meta.url));
const LIB = path.join(ICI, 'lib');
const BIB = path.join(ICI, '..', 'bibliotheque');
const MIROIR = /^(<svg[^>]*>)<g transform="translate\([^)]*\) scale\(-1 1\)">([\s\S]*)<\/g>(<\/svg>\s*)$/;

const publies = new Set(C.lister(LIB).filter(f => f.endsWith('.svg')).map(f => C.renommer(f)));
const manquent = C.lister(path.join(BIB, 'svg')).filter(f => f.endsWith('.svg') && !publies.has(f));
const autres = manquent.filter(f => !f.startsWith('personnages/maitres/'));
if (autres.length) throw new Error(`il manque dans lib/ autre chose que des maîtres (un lot n'a pas tourné ?) : ${autres.slice(0, 5).join(', ')}…`);

let miroirs = 0;
for (const f of manquent) {
  if (C.renommer(f) !== f) throw new Error(`nom qui ne se garde pas : ${f}`);
  const publie = fs.readFileSync(path.join(BIB, 'svg', f), 'utf8');
  let svg = publie;
  if (C.MIROIR_KIT.test(f)) {
    const m = publie.match(MIROIR);
    if (!m) throw new Error(`miroir introuvable : ${f}`);
    svg = m[1] + m[2] + m[3];
    if (C.miroir(svg) !== publie) throw new Error(`miroir qui ne se défait pas à l'octet : ${f}`);
    miroirs++;
  }
  fs.mkdirSync(path.dirname(path.join(LIB, f)), { recursive: true });
  fs.writeFileSync(path.join(LIB, f), svg);
}

// la page animée des maîtres et leurs planches, si aucun lot ne les a écrites
const pages = [];
if (!fs.existsSync(path.join(ICI, 'troupe_apercu.html'))) {
  fs.copyFileSync(path.join(BIB, 'apercus', 'troupe_apercu.html'), path.join(ICI, 'troupe_apercu.html'));
  pages.push('troupe_apercu.html');
}
for (const f of fs.readdirSync(path.join(BIB, 'planches')).filter(f => /^(planche|expressions)_[a-z]+\.png$/.test(f))) {
  if (fs.existsSync(path.join(ICI, f)) || fs.existsSync(path.join(ICI, 'planches', f))) continue;
  fs.copyFileSync(path.join(BIB, 'planches', f), path.join(ICI, f));
  pages.push(f);
}
console.log(`maîtres repris : ${manquent.length} SVG (dont ${miroirs} miroirs défaits) ; ${pages.length} page et planches`);
