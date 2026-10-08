// Le module ESM du générateur (bibliotheque/generateur/avatar.mjs, assemblé par build_bundle.js) dessine-t-il comme les
// sources ? On compare, octet par octet :
// - les exports : les mêmes noms que generateur.mjs, les mêmes données (catalogue, nuanciers, prix, cadres) ;
// - 60 avatars tirés au hasard (dont 20 parmi les objets gratuits), dans les trois vues : repos, marche, salut, les trois
//   gestes du tutoriel, une expression ; leur version naufragée ; chaque geste de travail ; la lanterne, le parapluie et
//   la valise en marche ; couché ; assis, seul et avec chaque geste qui s'y prête ;
// - chaque icône d'objet, aux couleurs par défaut et à d'autres couleurs.
// Et le module ne doit rien demander à Node (aucun require restant). Usage : node verif_generateur.mjs (sort en erreur
// au moindre écart). À lancer après build_bundle.js.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ici = path.dirname(fileURLToPath(import.meta.url));
const fichier = path.join(ici, '..', 'bibliotheque', 'generateur', 'avatar.mjs');
const src = await import('./generateur.mjs');
const mod = await import(fichier);

const erreurs = [];
let n = 0;
const compare = (nom, f) => {
  n++;
  let a, b;
  try { a = f(src); } catch (e) { erreurs.push(`${nom} : les sources échouent (${e.message})`); return; }
  try { b = f(mod); } catch (e) { b = `erreur : ${e.message}`; }
  if (typeof a !== 'string' || !a) erreurs.push(`${nom} : rien à comparer`);
  else if (a !== b) erreurs.push(nom);
};

// Les exports
const noms = M => Object.keys(M).sort().join(' ');
if (noms(src) !== noms(mod)) erreurs.push(`exports : ${noms(mod)} au lieu de ${noms(src)}`);
for (const k of Object.keys(src).filter(k => typeof src[k] !== 'function')) compare(`donnée ${k}`, M => JSON.stringify(M[k]));
// (__require est le nom qu'esbuild donne à l'enveloppe de chaque source : un require resté sans solution, lui, s'écrit
// require(…) ou passe par « typeof require »)
if (/[^\w$]require\s*\(|typeof require/.test(fs.readFileSync(fichier, 'utf8'))) erreurs.push('le module appelle encore require');

// Les avatars
const POSES = [['repos', 2], ['marche', 4], ['salut', 2]];
const GESTES = { front: ['grelotter', 'lire'], se: ['ramasser'], ne: [] };
const TRAVAIL = ['avecMainsTendues', 'avecApplaudir', 'avecPecher', 'avecPiocher', 'avecCueillir', 'avecArroser', 'avecBecher', 'avecSemer', 'avecPorter', 'avecReparer', 'avecRepousser', 'avecEcrire'];
const EN_MARCHE = [['avecLanterne'], ['avecParapluie', '#3E78C8'], ['avecValise', '#5E3A22']];
const ASSIS = [null, 'tendre', 'applaudir', 'reparer', 'ecrire'];
for (let g = 1; g <= 60; g++) {
  const opts = g <= 20 ? { gratuit: true } : undefined;
  const perso = (M, geste) => M.avatar(M.verifier(M.auHasard(g, opts)), { uid: `a${g}`, geste });
  const naufrage = M => M.avatarNaufrage(M.auHasard(g, opts), { uid: `n${g}` });
  compare(`choix ${g}`, M => JSON.stringify(M.verifier(M.auHasard(g, opts))));
  for (const vue of ['front', 'se', 'ne']) {
    for (const [pose, k] of POSES) {
      for (let i = 0; i < k; i++) {
        compare(`avatar ${g} ${vue} ${pose} ${i}`, M => M.frame(perso(M), vue, pose, i));
        compare(`naufragé ${g} ${vue} ${pose} ${i}`, M => M.frame(naufrage(M), vue, pose, i));
      }
    }
    for (const geste of GESTES[vue]) compare(`avatar ${g} ${vue} ${geste}`, M => M.frame(perso(M, geste), vue, 'action', 1));
    compare(`avatar ${g} ${vue} expression`, M => M.frame(perso(M), vue, 'repos', 0, M.EXPRS[g % M.EXPRS.length]));
    for (const f of TRAVAIL) compare(`avatar ${g} ${vue} ${f}`, M => M.frame(M[f](perso(M)), vue, 'action', g % 2));
    for (const [f, col] of EN_MARCHE) compare(`avatar ${g} ${vue} ${f}`, M => M.frame(M[f](perso(M), col), vue, 'marche', g % 4));
    for (const geste of ASSIS) compare(`avatar ${g} ${vue} assis ${geste || ''}`, M => M.assis(perso(M), vue, g % 2, null, geste ? M[geste] : undefined));
  }
  compare(`avatar ${g} couché`, M => M.couche(perso(M), g % 2));
}

// Les icônes
for (const id of Object.keys(src.ICONES)) {
  compare(`icône ${id}`, M => M.icone(id));
  compare(`icône ${id} en couleurs`, M => M.icone(id, ['#7A3E5E', '#E3C27A', '#3E78C8'].slice(0, M.ACCESSOIRES[id].zones.length)));
}

console.log(`${n} comparaisons`);
if (erreurs.length) {
  console.log(`${erreurs.length} écart(s) :`);
  for (const e of erreurs.slice(0, 60)) console.log(' - ' + e);
  process.exit(1);
}
console.log('aucun écart : le module dessine comme les sources');
