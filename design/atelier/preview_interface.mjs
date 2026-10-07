// Les icônes de l'interface (interface.js) : un SVG 32 × 32 par icône dans lib/interface/, leur index
// (interface.json : le nom, où le jeu s'en sert), une planche (chacune en grand, puis à 32, 24 et 16 px sur le papier,
// le verre sombre des boutons de l'île et l'or d'un bouton actif ; puis en situation : la barre du bas, le haut de l'île).
import path from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { icone } from './generateur_interface.mjs';

const require = createRequire(import.meta.url);
const DIR = path.dirname(fileURLToPath(import.meta.url));
const { unique, row, sheet, write, shoot } = require('./planche.js');
const { ICONES } = require('./interface.js');
const LIB = path.join(DIR, 'lib', 'interface');
const PNG = path.join(DIR, 'planches');
const svgOf = (body, px = 32) => `<svg xmlns="http://www.w3.org/2000/svg" width="${px}" height="${px}" viewBox="0 0 32 32">${body}</svg>`;

const index = { _lisez_moi: [
  'Les icônes de l\'interface, au trait de la bibliothèque : la barre du bas (Grimoire, Île, Défis, Sceau, et le sac, les tâches et le menu de la v6, HISTOIRE.md § 9, étapes 4 et 6), l\'écu, les ressources, les boutons de l\'île ; les fiches (besoins, humeurs, amitié, verrou, inconnu, étincelle, chapitre, plan, carte, pousse) et les trouvailles des climats.',
  'Carré 32 × 32, sans marge à retirer : les afficher de 16 à 32 px (en <img>, ou en SVG en ligne). Elles se lisent sur le papier clair comme sur le verre sombre des boutons de l\'île. Pour un onglet inactif ou un cœur pas encore gagné, les éteindre en CSS (opacity, filter: saturate(.4) ou grayscale(1)) plutôt que de les redessiner.',
  'sert : où le jeu s\'en sert. Les petites commandes (fermer, flèches, zoom, plein écran) restent des pictos au trait du jeu. L\'heure et la météo ont déjà leurs icônes : svg/meteo/icones (temps, moments).'
], icones: {} };
const cells = [];
let k = 0;
const fonds = [['#FBF5E8', 'papier'], ['rgb(30,22,16)', 'verre'], ['#E0A93A', 'or']];
for (const [id, nom, dessin, sert] of ICONES) {
  const body = dessin();
  const rel = `${id}_icone.svg`;
  write(path.join(LIB, rel), icone(id).svg); // le fichier sort du générateur des icônes : le jeu dessine le même
  k++;
  index.icones[id] = { nom: `${nom} (icône)`, sert, cadre: [0, 0, 32, 32], fichiers: [rel] };
  const petits = fonds.map(([bg, lab]) => [`<div style="display:flex;gap:6px;align-items:center;padding:6px 8px;border-radius:8px;background:${bg}">${[32, 24, 16].map(px => svgOf(unique(body), px)).join('')}</div>`, lab]);
  cells.push(row(nom, [[svgOf(unique(body), 96), '× 3'], ...petits]));
}
write(path.join(LIB, 'interface.json'), JSON.stringify(index, null, 1));

// En situation : la barre du bas (les quatre onglets d'aujourd'hui, puis les quatre boutons de la v6) et le haut de l'île
const ic = (id, px) => svgOf(unique(ICONES.find(i => i[0] === id)[2]()), px);
const barre = (ids, actif) => `<div style="display:flex;gap:4px;padding:6px 10px;border-radius:14px;background:rgb(52,36,26)">${ids.map(([id, lab]) => `<div style="width:70px;text-align:center;color:rgba(251,235,192,.85);font:600 11px system-ui">`
  + `<div style="margin:0 auto 2px;width:40px;height:34px;border-radius:12px;display:flex;align-items:center;justify-content:center;background:${id === actif ? '#E0A93A' : 'rgba(251,235,192,.12)'}">${ic(id, 24)}</div>${lab}</div>`).join('')}</div>`;
const haut = `<div style="display:flex;gap:10px;align-items:center;padding:6px 12px;border-radius:999px;background:rgba(30,22,16,.86);color:#FBF5E8;font:800 13px system-ui">`
  + `<span style="display:flex;gap:4px;align-items:center">${ic('ecu', 18)}1 250</span>` + ['pierre', 'bois', 'eau', 'nourriture'].map((id, i) => `<span style="display:flex;gap:3px;align-items:center">${ic(id, 17)}${[12, 30, 8, 21][i]}</span>`).join('') + '</div>';
const boutons = `<div style="display:flex;gap:8px">${['ramasser', 'carnet', 'trouvailles', 'expedition'].map((id, i) => `<div style="width:46px;height:46px;border-radius:12px;display:flex;align-items:center;justify-content:center;background:${i ? 'rgba(30,22,16,.86)' : '#E0A93A'}">${ic(id, 26)}</div>`).join('')}`
  + `<div style="height:46px;padding:0 16px;border-radius:12px;display:flex;gap:6px;align-items:center;background:#E0A93A;color:#3C2819;font:800 14px system-ui">${ic('recolte', 26)}Récolte</div></div>`;
cells.push(row('En situation', [[barre([['grimoire', 'Grimoire'], ['ile', 'Île'], ['defis', 'Défis'], ['sceau', 'Sceau']], 'ile'), 'la barre d\'aujourd\'hui, l\'île active'],
  [barre([['grimoire', 'Grimoire'], ['sac', 'Sac'], ['taches', 'Tâches'], ['menu', 'Menu']], 'grimoire'), 'la barre de la v6 (étape 6)']]));
cells.push(row('', [[`<div style="padding:12px;border-radius:12px;background:#9CC97A;display:flex;flex-direction:column;gap:10px;align-items:flex-start">${haut}${boutons}</div>`, 'le haut de l\'île, les boutons (ceux qui attendent sont dorés)']]));
// La fiche d'un camarade (humeur, besoins, amitié : les cœurs vides sont les mêmes, éteints en CSS) et les trouvailles
const pastille = (id, px, bord) => `<div style="width:${px + 10}px;height:${px + 10}px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:#FFF4E5;box-shadow:inset 0 0 0 2px ${bord}">${ic(id, px)}</div>`;
const fiche = `<div style="padding:12px 14px;border-radius:14px;background:#FBF5E8;display:flex;gap:14px;align-items:center;font:700 13px system-ui;color:#3C2819">`
  + `<div style="display:flex;flex-direction:column;gap:6px;align-items:center">${pastille('humeur_joie', 24, '#E0A93A')}<span>Cannelle</span></div>`
  + `<div style="display:flex;flex-direction:column;gap:6px"><div style="display:flex;gap:6px">${['nourriture', 'outils', 'fleur'].map((id, i) => pastille(id, 22, i ? '#E8D8B8' : '#F0A84A')).join('')}</div>`
  + `<div style="display:flex;gap:2px">${[1, 1, 1, 0, 0].map(on => `<span style="${on ? '' : 'filter:grayscale(1);opacity:.35'}">${ic('coeur', 18)}</span>`).join('')}</div></div>`
  + `<div style="display:flex;gap:6px">${['humeur_calme', 'humeur_bouderie'].map(id => pastille(id, 22, '#E8D8B8')).join('')}</div></div>`;
const tuiles = `<div style="display:flex;gap:8px;padding:12px;border-radius:14px;background:#FBF5E8">${['glace', 'laine', 'roseau', 'sel', 'fruits', 'obsidienne'].map(id => `<div style="width:44px;height:44px;border-radius:10px;display:flex;align-items:center;justify-content:center;background:#F4EAD5">${ic(id, 28)}</div>`).join('')}</div>`;
cells.push(row('', [[fiche, 'la fiche d\'un camarade : humeur, besoins (le plus pressant cerclé d\'orange), amitié'], [tuiles, 'les trouvailles des climats']]));

await shoot([[path.join(PNG, 'interface_icones.png'), sheet('Les icônes de l\'interface', 'Au trait de la bibliothèque, 32 × 32 : chacune en grand, puis à 32, 24 et 16 px sur le papier, le verre sombre des boutons de l\'île et l\'or d\'un bouton actif ; puis en situation.', cells), 1100]]);
console.log(`${k} icônes de l'interface`);
