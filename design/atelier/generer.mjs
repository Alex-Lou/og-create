// L'outil du générateur : il dessine avec les modules publiés (bibliotheque/generateur/<famille>.mjs), les mêmes que le
// jeu importe. Depuis design/atelier/ :
//   node generer.mjs                                   les familles et ce qu'elles exportent
//   node generer.mjs chantiers liste                   tout ce que la famille dessine, avec son fichier
//   node generer.mjs chantiers etapeDuMontage 2x2 toit 1 [--sortie toit.svg]
//                                                       un dessin (sur la sortie standard, ou dans un fichier)
//   node generer.mjs chantiers tout <dossier>          toute la famille, sous ses noms de la bibliothèque
// Les fichiers écrits sont ceux de la bibliothèque, à l'octet près (le SVG, puis un saut de ligne).
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const ici = path.dirname(fileURLToPath(import.meta.url));
const DOSSIER = path.join(ici, '..', 'bibliotheque', 'generateur');
const familles = fs.readdirSync(DOSSIER).filter(f => f.endsWith('.mjs')).map(f => f.replace(/\.mjs$/, '')).sort();
const charger = async f => {
  if (!familles.includes(f)) throw new Error(`famille inconnue : ${f} (${familles.join(', ')})`);
  return import(pathToFileURL(path.join(DOSSIER, `${f}.mjs`)).href);
};
// Les nombres et les booléens passés en texte redeviennent ce qu'ils sont (une image, une taille, l'hiver)
const arg = a => (/^-?\d+(\.\d+)?$/.test(a) ? Number(a) : a === 'true' ? true : a === 'false' ? false : a);

try {
  const [famille, commande, ...reste] = process.argv.slice(2);
  if (!famille) {
    for (const f of familles) {
      const M = await charger(f);
      console.log(`${f} : ${Object.keys(M).filter(k => typeof M[k] === 'function').join(', ')}${M.liste ? ` (${M.liste().length} dessins)` : ''}`);
    }
  } else {
    const M = await charger(famille);
    if (!commande || commande === 'liste') {
      if (!M.liste) throw new Error(`${famille} n'a pas de liste`);
      for (const { fichier, fonction, args } of M.liste()) console.log(`${fichier}  ←  ${fonction}(${args.map(a => JSON.stringify(a)).join(', ')})`);
    } else if (commande === 'tout') {
      const dossier = reste[0];
      if (!dossier) throw new Error('tout : il faut un dossier');
      let n = 0;
      for (const { fichier, fonction, args } of M.liste()) {
        const f = path.join(dossier, fichier);
        fs.mkdirSync(path.dirname(f), { recursive: true });
        fs.writeFileSync(f, M[fonction](...args).svg + '\n');
        n++;
      }
      console.log(`${famille} : ${n} dessins dans ${dossier}`);
    } else {
      if (typeof M[commande] !== 'function') throw new Error(`${famille} n'exporte pas ${commande}`);
      const i = reste.indexOf('--sortie'), sortie = i >= 0 ? reste[i + 1] : null;
      const args = (i >= 0 ? reste.slice(0, i) : reste).map(arg);
      const r = M[commande](...args);
      if (!r || typeof r.svg !== 'string') throw new Error(`${commande} ne rend pas de dessin`);
      if (sortie) { fs.writeFileSync(sortie, r.svg + '\n'); console.log(`${sortie} : cadre ${r.cadre.join(' ')}${r.ms_par_image ? `, ${r.ms_par_image} ms par image` : ''}`); }
      else process.stdout.write(r.svg + '\n');
    }
  }
} catch (e) {
  // une erreur de l'utilisateur (famille, fonction, argument) : son message seul
  console.error(e.message);
  process.exit(1);
}
