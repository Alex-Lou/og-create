// L'interface du joueur (perso.js) : un SVG par pièce dans lib/perso/ (taille déclarée HD fois plus grande que
// l'affichage), leur index (perso.json : le nom, où le jeu s'en sert, la taille d'affichage, la tranche du 9-slice, les
// zones), une planche (chaque pièce en grand, les cadres étirés en border-image, puis en situation : l'éditeur de
// l'avatar, la page du Sceau, la carte d'embarquement).
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { piece } from './generateur_perso.mjs';

const require = createRequire(import.meta.url);
const DIR = path.dirname(fileURLToPath(import.meta.url));
const { row, sheet, write, shoot } = require('./planche.js');
const { PIECES, HD } = require('./perso.js');
const { ICONES } = require('./interface.js');
const LIB = path.join(DIR, 'lib', 'perso');
const PNG = path.join(DIR, 'planches');

const index = { _lisez_moi: [
  'L\'interface du joueur en bois et parchemin, comme le HUD (svg/hud/) : l\'éditeur de l\'avatar (estrade de l\'aperçu, onglets, pastilles de choix, cadres des nuanciers, boutons « tourner » et « Au hasard », panneau), la page du Sceau (ruban du nom, tuile d\'un compteur, ligne de menu, barre de progression) et la carte d\'embarquement du prologue.',
  `Haute définition : chaque fichier déclare une taille ${HD} fois plus grande que sa taille d'affichage (taille, en pixels d'affichage), pour rester net sur un canvas. En CSS, l'afficher à sa taille d'affichage.`,
  `Les cadres extensibles ont une tranche (haut, droite, bas, gauche, en pixels d'affichage) : à poser en border-image (border-width : la tranche ; découpe : tranche_fichier, la tranche × ${HD} ; fill stretch). Les pièces sans tranche sont entières.`,
  'zones : où le jeu pose ce qui vient de lui, en pixels d\'affichage de la pièce. L\'estrade : les pieds de l\'avatar (pieds) ; à poser en background-size: cover, le plateau en bas au centre. La carte d\'embarquement : la fenêtre de la photo (photo : x, y, largeur, hauteur) et la ligne du nom (nom : x, y, largeur, hauteur). Le cadre d\'un nuancier a le centre vide : la couleur, en CSS, dessous (un rond de 22 px).'
], pieces: {} };

const fichier = id => piece(id).svg;
const url = id => `data:image/svg+xml;base64,${Buffer.from(fichier(id)).toString('base64')}`;
const P_ = id => PIECES.find(p => p[0] === id);
const grand = (id, k = 2.4) => { const [w, h] = P_(id)[2]; return `<img src="${url(id)}" width="${r(w * k)}" height="${r(h * k)}" alt="">`; };
const r = n => Math.round(n);
const cadre = (id, w, h, html = '', style = '') => {
  const t = P_(id)[3];
  return `<div style="box-sizing:border-box;width:${w}px;height:${h}px;border-style:solid;border-width:${t.map(v => v + 'px').join(' ')};border-image:url(${url(id)}) ${t.map(v => v * HD).join(' ')} fill stretch;display:flex;align-items:center;justify-content:center;gap:5px;${style}">${html}</div>`;
};
const fixe = (id, html = '', extra = '', k = 1) => { const [w, h] = P_(id)[2]; return `<div style="position:relative;width:${w * k}px;height:${h * k}px;background:url(${url(id)}) center/100% 100% no-repeat;display:grid;place-items:center;${extra}">${html}</div>`; };
const ic = (id, px) => `<svg xmlns="http://www.w3.org/2000/svg" width="${px}" height="${px}" viewBox="0 0 32 32">${ICONES.find(i => i[0] === id)[2]()}</svg>`;
const AVATAR = path.join(DIR, '..', 'bibliotheque', 'svg', 'personnages', 'avatar', 'avatar-03', 'avatar-03_avant_marche_1.svg');
const avatar = fs.existsSync(AVATAR) ? `data:image/svg+xml;base64,${fs.readFileSync(AVATAR).toString('base64')}` : '';
const texte = 'font:800 13px system-ui;color:#3C2819';

const cells = [];
for (const [id, nom, [w, h], tranche, , sert, zones] of PIECES) {
  write(path.join(LIB, `${id}.svg`), fichier(id)); // le fichier sort du générateur : le jeu dessine le même
  index.pieces[id] = { nom, sert, cadre: [0, 0, w, h], taille: [w, h], tranche, tranche_fichier: tranche && tranche.map(v => v * HD), ...(zones ? { zones } : {}), fichiers: [`${id}.svg`] };
  const etire = tranche ? [[cadre(id, r(w * 1.8), h), '× 1,8 en largeur'], [cadre(id, r(w * 2.6), r(h * 1.4)), '× 2,6 × 1,4']] : [];
  cells.push(row(nom, [[grand(id), tranche ? `tranche ${tranche.join(' ')}` : 'pièce entière'], [grand(id, 1), 'à sa taille'], ...etire]));
}
write(path.join(LIB, 'perso.json'), JSON.stringify(index, null, 1));

// En situation. L'éditeur : l'estrade (cover), l'avatar debout sur le plateau, les boutons, les onglets, le panneau
const swatch = (col, id = 'nuancier_repos') => `<div style="position:relative;width:34px;height:34px"><div style="position:absolute;left:6px;top:6px;width:22px;height:22px;border-radius:50%;background:${col}"></div>${fixe(id, '', 'position:absolute;inset:0')}</div>`;
const editeur = `<div style="width:340px;display:flex;flex-direction:column;gap:0">`
  + `<div style="position:relative;height:250px;background:url(${url('estrade')}) center bottom/cover;border-radius:14px 14px 0 0;overflow:hidden">`
  + (avatar ? `<img src="${avatar}" style="position:absolute;left:50%;bottom:${r(250 * 26 / 180)}px;height:170px;transform:translateX(-50%)" alt="">` : '')
  + `<div style="position:absolute;left:8px;top:110px">${fixe('tourner_gauche')}</div><div style="position:absolute;right:8px;top:110px">${fixe('tourner_droite')}</div>`
  + `<div style="position:absolute;right:8px;top:34px">${cadre('hasard', 136, 40, `<span style="${texte};font-size:14px">Au hasard</span>`)}</div></div>`
  + `<div style="display:flex;gap:2px;margin-top:6px;align-items:flex-end">${['Corps', 'Visage', 'Cheveux', 'Tenue', 'Objets'].map((t, i) => cadre(i === 2 ? 'onglet_actif' : 'onglet_repos', 66, i === 2 ? 40 : 36, `<span style="${texte};font-size:12px">${t}</span>`, 'align-items:flex-end;padding-bottom:4px')).join('')}</div>`
  + cadre('panneau', 340, 190, `<div style="display:flex;flex-direction:column;gap:6px;width:100%">`
    + `<span style="${texte};font-size:12px">Coupe</span><div style="display:flex;gap:4px;flex-wrap:wrap">${['Courte', 'Carré', 'Nattes', 'Chignon'].map((t, i) => cadre(i === 1 ? 'choix_actif' : 'choix_repos', 72, 34, `<span style="${texte};font-size:12px">${t}</span>`)).join('')}</div>`
    + `<span style="${texte};font-size:12px">Couleur</span><div style="display:flex;gap:4px">${swatch('#2A2420')}${swatch('#7A4A2A', 'nuancier_actif')}${swatch('#C8783A')}${swatch('#E8C060')}${swatch('#B8B8C0')}${fixe('nuancier_aucun')}</div></div>`, 'align-items:flex-start;justify-content:flex-start')
  + '</div>';
// La page du Sceau : le sceau (l'icône du Sceau, en grand), le ruban du nom, trois compteurs, des lignes, une barre
const sceau = `<div style="width:330px;display:flex;flex-direction:column;gap:8px;align-items:center">`
  + cadre('panneau', 330, 170, `<div style="display:flex;flex-direction:column;align-items:center;gap:2px">${ic('sceau', 92)}${cadre('ruban', 180, 40, '<span style="font:700 16px Georgia,serif;color:#FFF4DE">Alex</span>', 'padding-bottom:6px')}</div>`)
  + `<div style="display:flex;gap:6px">${[['Registre', '128 / 400'], ['Succès', '12 / 60'], ['Records', '3']].map(([a, b]) => cadre('tuile_compteur', 104, 60, `<div style="text-align:center;${texte}"><div style="font-size:10px;opacity:.7">${a}</div><div style="font-size:15px">${b}</div></div>`)).join('')}</div>`
  + [['Mon compte', 'Nom, photo, adresse'], ['Le Cabinet', 'Cadres et emblèmes'], ['Succès', '12 sceaux rompus sur 60']].map(([a, b], i) => cadre(i === 1 ? 'ligne_appuye' : 'ligne_repos', 330, 52, `<div style="width:100%;${texte}"><div>${a}</div><div style="font-weight:600;font-size:11px;opacity:.7">${b}</div></div>`, 'justify-content:flex-start')).join('')
  + `<div style="width:300px;${texte};font-size:11px">Branche I · Les flots<div style="position:relative;margin-top:3px">${cadre('barre_fond', 300, 14)}<div style="position:absolute;left:0;top:0">${cadre('barre_plein', 190, 14)}</div></div></div>`
  + '</div>';
// La carte d'embarquement : la photo dans sa fenêtre (à mi-corps), le nom sur sa ligne
const k = 1.6, [px, py, pw, ph] = P_('carte_embarquement')[6].photo, [nx, ny, nw, nh] = P_('carte_embarquement')[6].nom;
const carte = `<div style="position:relative;width:${240 * k}px;height:${150 * k}px;background:url(${url('carte_embarquement')}) center/100% 100%">`
  + (avatar ? `<div style="position:absolute;left:${px * k}px;top:${py * k}px;width:${pw * k}px;height:${ph * k}px;overflow:hidden"><img src="${avatar}" style="position:absolute;left:50%;top:6px;height:${ph * k * 1.7}px;transform:translateX(-50%)" alt=""></div>` : '')
  + `<div style="position:absolute;left:${nx * k}px;top:${ny * k}px;width:${nw * k}px;height:${nh * k}px;font:italic 700 ${r(12 * k)}px Georgia,serif;color:#2E4A7A;line-height:${nh * k}px">Alex</div></div>`;
cells.push(row('En situation', [[`<div style="padding:14px;border-radius:14px;background:#9CC97A">${editeur}</div>`, 'l\'éditeur de l\'avatar'], [`<div style="padding:14px;border-radius:14px;background:#9CC97A">${sceau}</div>`, 'la page du Sceau']]));
cells.push(row('', [[`<div style="padding:14px;border-radius:14px;background:#5E7FA8">${carte}</div>`, 'la carte d\'embarquement : la photo et le nom posés par le jeu']]));

await shoot([[path.join(PNG, 'perso.png'), sheet('L\'interface du joueur', `Bois et parchemin, comme le HUD. Chaque pièce en grand, à sa taille, puis les cadres étirés en border-image ; les fichiers déclarent une taille × ${HD} (haute définition). Puis en situation.`, cells), 1250]]);
console.log(`${PIECES.length} pièces de l'interface du joueur`);
