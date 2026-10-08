// Le HUD de l'île (hud.js) : un SVG par pièce dans lib/hud/ (taille déclarée HD fois plus grande que l'affichage), leur
// index (hud.json : le nom, où le jeu s'en sert, la taille d'affichage, la tranche du 9-slice), une planche (chaque
// pièce en grand, les cadres étirés à plusieurs tailles en border-image, puis le HUD monté en situation).
import path from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { piece } from './generateur_hud.mjs';

const require = createRequire(import.meta.url);
const DIR = path.dirname(fileURLToPath(import.meta.url));
const { row, sheet, write, shoot } = require('./planche.js');
const { PIECES, HD } = require('./hud.js');
const { ICONES } = require('./interface.js');
const LIB = path.join(DIR, 'lib', 'hud');
const PNG = path.join(DIR, 'planches');

const index = { _lisez_moi: [
  'Le HUD de l\'île en bois et parchemin : la barre du haut (bourse d\'écus, tuiles des réserves, boutons Récolte et « Tout ramasser »), les boutons posés sur l\'île (coffres, carnet, trouvailles, boussole, zoom, plein écran, la pastille de compte), l\'horloge (cadre, cadran de jour et de nuit, soleil, lune) et la barre d\'onglets (barre, médaillon, point « nouveau »). Les icônes par-dessus sont celles de svg/interface/.',
  `Haute définition : chaque fichier déclare une taille ${HD} fois plus grande que sa taille d'affichage (taille, en pixels d'affichage), pour rester net sur un canvas. En CSS (<img>, background), l'afficher à sa taille d'affichage.`,
  `Les cadres extensibles ont une tranche (haut, droite, bas, gauche, en pixels d'affichage) : à poser en border-image, par exemple « border-style: solid; border-width: 12px 16px 15px 16px; border-image: url(bourse.svg) 48 64 60 64 fill stretch; » (la découpe en pixels du fichier : tranche_fichier, la tranche × ${HD}). Leurs coins ne bougent pas, leurs bords et leur milieu s'étirent. Les pièces sans tranche sont entières : les afficher à leur taille.`,
  'États : repos, appuye, desactive (Récolte, « Tout ramasser »), pret (un bouton de l\'île quand quelque chose attend), accelere (l\'horloge en accéléré), actif (l\'onglet ouvert). Les chiffres (écus, réserves, pastille) et les libellés restent du texte, en CSS, par-dessus.'
], pieces: {} };

const fichier = id => piece(id).svg;
const url = id => `data:image/svg+xml;base64,${Buffer.from(fichier(id)).toString('base64')}`;
const grand = (id, k = 3) => { const [w, h] = PIECES.find(p => p[0] === id)[2]; return `<img src="${url(id)}" width="${w * k}" height="${h * k}" alt="">`; };
// un cadre extensible en border-image, à la taille demandée ; html : son contenu
const cadre = (id, w, h, html = '', style = '') => {
  const t = PIECES.find(p => p[0] === id)[3];
  return `<div style="box-sizing:border-box;width:${w}px;height:${h}px;border-style:solid;border-width:${t.map(v => v + 'px').join(' ')};border-image:url(${url(id)}) ${t.map(v => v * HD).join(' ')} fill stretch;display:flex;align-items:center;justify-content:center;gap:5px;${style}">${html}</div>`;
};
const ic = (id, px) => `<svg xmlns="http://www.w3.org/2000/svg" width="${px}" height="${px}" viewBox="0 0 32 32">${ICONES.find(i => i[0] === id)[2]()}</svg>`;
const fixe = (id, html = '', extra = '') => { const [w, h] = PIECES.find(p => p[0] === id)[2]; return `<div style="position:relative;width:${w}px;height:${h}px;background:url(${url(id)}) center/100% 100% no-repeat;display:grid;place-items:center;${extra}">${html}</div>`; };
const texte = 'font:900 14px system-ui;color:#3C2819;font-variant-numeric:tabular-nums';

const cells = [];
for (const [id, nom, [w, h], tranche, , sert] of PIECES) {
  write(path.join(LIB, `${id}.svg`), fichier(id)); // le fichier sort du générateur du HUD : le jeu dessine le même
  index.pieces[id] = { nom, sert, cadre: [0, 0, w, h], taille: [w, h], tranche, tranche_fichier: tranche && tranche.map(v => v * HD), fichiers: [`${id}.svg`] };
  const etire = tranche ? [[cadre(id, Math.round(w * 1.8), h), '× 1,8 en largeur'], [cadre(id, Math.round(w * 2.8), Math.round(h * 1.3)), '× 2,8 × 1,3']] : [];
  cells.push(row(nom, [[grand(id), tranche ? `tranche ${tranche.join(' ')}` : 'pièce entière'], [grand(id, 1), 'à sa taille'], ...etire]));
}
write(path.join(LIB, 'hud.json'), JSON.stringify(index, null, 1));

// En situation : la barre du haut, les boutons de l'île, la barre d'onglets
const pastilleSur = (n) => `<div style="position:absolute;right:-6px;top:-6px">${fixe('pastille', `<span style="font:900 11px system-ui;color:#fff">${n}</span>`)}</div>`;
const horloge = cadre('horloge_jour', 132, 38, fixe('cadran_jour', `<div style="position:absolute;left:21px;top:3px">${fixe('soleil')}</div>`) + `<span style="${texte}">14:20</span>`);
const haut = `<div style="display:flex;gap:8px;align-items:center">${horloge}${cadre('bourse', 96, 34, ic('ecu', 18) + `<span style="${texte}">1 250</span>`)}`
  + cadre('bouton_ramasser_repos', 176, 44, ic('ramasser', 24) + `<span style="${texte};font-size:13px">Tout ramasser<br><span style="font-size:11px">+12 écus +3 bois</span></span>`) + '</div>';
const reserves = `<div style="display:flex;gap:6px;align-items:stretch">${['pierre', 'bois', 'eau', 'nourriture'].map((id, i) => cadre('tuile_reserve', 62, 48, ic(id, 20) + `<span style="${texte};font-size:15px">${[12, 30, 8, 21][i]}</span>`)).join('')}`
  + cadre('bouton_recolte_repos', 120, 52, `<span style="text-align:center;font:700 16px Georgia,serif;color:#3C2819;line-height:1.1">Récolte<br><span style="font:800 11px system-ui">3 parties</span></span>`) + '</div>';
const boutons = `<div style="display:flex;gap:10px;align-items:center">${fixe('bouton_ile_pret', ic('coffre', 28) + pastilleSur(2))}${fixe('bouton_ile_repos', ic('carnet', 26))}${fixe('bouton_ile_repos', ic('trouvailles', 26) + pastilleSur(1))}`
  + cadre('etiquette', 92, 34, ic('expedition', 20) + '<span style="font:900 12px system-ui;color:#FFF4C8">2 h 10</span>')
  + `<div style="display:flex;flex-direction:column;gap:6px;margin-left:16px">${fixe('bouton_zoom_repos', ic('zoom_plus', 24))}${fixe('bouton_zoom_repos', ic('zoom_moins', 24))}${fixe('bouton_zoom_appuye', ic('plein_ecran', 22))}</div></div>`;
const onglets = cadre('barre_onglets', 420, 74, [['grimoire', 'Grimoire'], ['ile', 'Île'], ['defis', 'Défis'], ['sceau', 'Sceau']].map(([id, lab], i) => `<div style="width:84px;text-align:center;font:800 11px system-ui;color:#FFF4DE">`
  + `<div style="position:relative;margin:0 auto 2px;width:44px">${fixe(i === 1 ? 'medaillon_actif' : 'medaillon_repos', ic(id, 24))}${i === 2 ? `<div style="position:absolute;right:-4px;top:-4px">${fixe('point_nouveau')}</div>` : ''}</div>${lab}</div>`).join(''), 'align-items:flex-start;padding-top:2px');
const nuit = `<div style="display:flex;gap:10px;align-items:center">${cadre('horloge_accelere', 132, 38, fixe('cadran_nuit', `<div style="position:absolute;left:8px;top:5px">${fixe('lune')}</div>`) + `<span style="${texte}">23:40</span>`)}<span style="font:12px system-ui">la nuit, journée en accéléré</span></div>`;
cells.push(row('En situation', [[`<div style="padding:14px;border-radius:14px;background:#9CC97A;display:flex;flex-direction:column;gap:12px;align-items:flex-start">${haut}${reserves}${boutons}${nuit}${onglets}</div>`, 'le HUD monté : les cadres en border-image, les icônes de svg/interface par-dessus']]));

await shoot([[path.join(PNG, 'hud.png'), sheet('Le HUD de l\'île', `Bois et parchemin. Chaque pièce en grand (× 3), à sa taille, puis les cadres étirés en border-image ; les fichiers déclarent une taille × ${HD} (haute définition). Puis le HUD monté.`, cells), 1250]]);
console.log(`${PIECES.length} pièces du HUD`);
