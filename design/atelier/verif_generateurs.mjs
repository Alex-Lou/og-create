// Les modules du générateur par famille (bibliotheque/generateur/<famille>.mjs, sauf avatar.mjs : verif_generateur.mjs)
// dessinent-ils la bibliothèque à l'octet près ? Pour chaque famille : chaque dessin de sa liste() est rendu par le
// module publié et comparé au fichier de la bibliothèque (qui finit par un saut de ligne, que le SVG rendu n'a pas) ; les exports sont ceux de la source ; le module ne demande
// rien à Node. Usage : node verif_generateurs.mjs (sort en erreur au moindre écart). À lancer après build_bundle.js.
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const ici = path.dirname(fileURLToPath(import.meta.url));
const BIB = path.join(ici, '..', 'bibliotheque');
const FAMILLES = ['chantiers'];
const erreurs = [];
let n = 0;
for (const f of FAMILLES) {
  const fichier = path.join(BIB, 'generateur', `${f}.mjs`);
  const src = await import(pathToFileURL(path.join(ici, `generateur_${f}.mjs`)).href);
  const mod = await import(pathToFileURL(fichier).href);
  const noms = M => Object.keys(M).sort().join(' ');
  if (noms(src) !== noms(mod)) erreurs.push(`${f} : exports ${noms(mod)} au lieu de ${noms(src)}`);
  if (/[^\w$]require\s*\(|typeof require/.test(fs.readFileSync(fichier, 'utf8'))) erreurs.push(`${f} : le module appelle encore require`);
  const liste = mod.liste();
  if (!liste.length) erreurs.push(`${f} : liste vide`);
  for (const { fichier: rel, fonction, args } of liste) {
    n++;
    const ou = path.join(BIB, 'svg', rel);
    if (!fs.existsSync(ou)) { erreurs.push(`${f} : ${rel} manque dans la bibliothèque`); continue; }
    let r;
    try { r = mod[fonction](...args); } catch (e) { erreurs.push(`${f} : ${rel} (${e.message})`); continue; }
    if (r.svg + '\n' !== fs.readFileSync(ou, 'utf8')) erreurs.push(`${f} : ${rel} diffère`);
    const vb = r.svg.match(/viewBox="([^"]+)"/)[1].split(' ').map(Number);
    if (vb.join(' ') !== r.cadre.join(' ')) erreurs.push(`${f} : ${rel}, cadre ${r.cadre} au lieu de ${vb}`);
  }
}
if (erreurs.length) { console.error(`${erreurs.length} écarts sur ${n} dessins :\n` + erreurs.slice(0, 40).join('\n')); process.exit(1); }
console.log(`générateurs : ${FAMILLES.join(', ')} — ${n} dessins identiques à la bibliothèque`);
