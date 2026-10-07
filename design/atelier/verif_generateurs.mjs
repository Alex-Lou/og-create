// Les modules du générateur par famille (bibliotheque/generateur/<famille>.mjs, sauf avatar.mjs : verif_generateur.mjs)
// dessinent-ils la bibliothèque à l'octet près ? Pour chaque famille : chaque dessin de sa liste(), dans un ordre
// mélangé, est rendu par le module publié et comparé au fichier de la bibliothèque (qui finit par un saut de ligne, que
// le SVG rendu n'a pas), sa vitesse à celle du catalogue ; les exports sont ceux de la source ; le module ne demande
// rien à Node. Usage : node verif_generateurs.mjs (sort en erreur au moindre écart). À lancer après build_bundle.js.
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const ici = path.dirname(fileURLToPath(import.meta.url));
const BIB = path.join(ici, '..', 'bibliotheque');
// La vitesse de chaque fichier, d'après le catalogue (la règle de catalogue.js, ou l'index du lot)
const VITESSE = new Map();
for (const e of JSON.parse(fs.readFileSync(path.join(BIB, 'catalogue.json'), 'utf8')).entrees) for (const x of e.fichiers) VITESSE.set(x.replace(/^svg\//, ''), e.ms_par_image ?? null);
const FAMILLES = ['chantiers', 'betes', 'interface', 'objets', 'plantes', 'meteo', 'coffres', 'decor', 'batiments', 'vivants', 'scenes', 'personnages', 'exemples'];
const erreurs = [];
let n = 0;
for (const f of FAMILLES) {
  const fichier = path.join(BIB, 'generateur', `${f}.mjs`);
  const src = await import(pathToFileURL(path.join(ici, `generateur_${f}.mjs`)).href);
  const mod = await import(pathToFileURL(fichier).href);
  const noms = M => Object.keys(M).sort().join(' ');
  if (noms(src) !== noms(mod)) erreurs.push(`${f} : exports ${noms(mod)} au lieu de ${noms(src)}`);
  if (/[^\w$]require\s*\(|typeof require/.test(fs.readFileSync(fichier, 'utf8'))) erreurs.push(`${f} : le module appelle encore require`);
  // dans un ordre mélangé (graine fixe) : un dessin ne doit pas dépendre de ce qu'on a dessiné avant lui
  const liste = mod.liste();
  let graine = 7; const hasard = () => (graine = (graine * 16807) % 2147483647) / 2147483647;
  for (let i = liste.length - 1; i > 0; i--) { const j = Math.floor(hasard() * (i + 1)); [liste[i], liste[j]] = [liste[j], liste[i]]; }
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
    if (!VITESSE.has(rel)) erreurs.push(`${f} : ${rel} manque dans le catalogue`);
    else if (JSON.stringify(r.ms_par_image ?? null) !== JSON.stringify(VITESSE.get(rel))) erreurs.push(`${f} : ${rel}, vitesse ${JSON.stringify(r.ms_par_image)} au lieu de ${JSON.stringify(VITESSE.get(rel))}`);
  }
}
// La couverture : la part des SVG de la bibliothèque que les générateurs par famille savent redessiner
const lister = d => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => (e.isDirectory() ? lister(path.join(d, e.name)) : e.name.endsWith('.svg') ? [path.join(d, e.name)] : []));
const couverts = new Set();
for (const f of FAMILLES) for (const { fichier } of (await import(pathToFileURL(path.join(BIB, 'generateur', `${f}.mjs`)).href)).liste()) couverts.add(fichier);
const total = lister(path.join(BIB, 'svg')).length;
if (erreurs.length) { console.error(`${erreurs.length} écarts sur ${n} dessins :\n` + erreurs.slice(0, 40).join('\n')); process.exit(1); }
console.log(`générateurs : ${FAMILLES.join(', ')} — ${n} dessins identiques à la bibliothèque`);
console.log(`couverture : ${couverts.size} des ${total} SVG de la bibliothèque (l'avatar composé à partir de choix se vérifie à part : verif_generateur.mjs)`);
