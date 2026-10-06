// PNJ du jeu au petit format (générateur src/world/villagers.js) : les 7 maîtres tels qu'ils marchent sur l'île, et
// 12 visiteurs types (tirés d'une graine, comme dans le jeu). Vues de face, 3/4 avant (se), 3/4 dos (ne) ; le miroir
// donne les deux autres. SVG dans lib/personnages/{habitants,visiteurs}/, index, planche, page animée.
import path from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { villagerSprite, ROLES, VILLAGER_BOX } from './port/src/world/villagers.js';
import { visitorLook } from './port/src/world/visitors.js';

const require = createRequire(import.meta.url);
const DIR = path.dirname(fileURLToPath(import.meta.url));
const { unique, row, sheet, animated, write, shoot } = require('./planche.js');
const LIB = path.join(DIR, 'lib', 'personnages');
const PNG = path.join(DIR, 'planches');
const r2 = n => Math.round(n * 100) / 100;
const K = 1.25;
const inner = s => s.svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
const BOX = [VILLAGER_BOX.x, VILLAGER_BOX.y, VILLAGER_BOX.w, VILLAGER_BOX.h].map(n => r2(n * K));
const WIDE = [-26, -66, 56, 72].map(n => r2(n * K)); // parapluie et lanterne débordent du cadre serré
const SLEEP = [-21, -24, 42, 28].map(n => r2(n * K)); // allongé : plus large, plus bas
const svgOf = (frame, body, s = 1) => `<svg xmlns="http://www.w3.org/2000/svg" width="${r2(frame[2] * s)}" height="${r2(frame[3] * s)}" viewBox="${frame.join(' ')}">${body}</svg>`;
const VIEW_FR = { front: 'face', se: 'trois_quarts', ne: 'dos' };
const MASTERS = { potager: 'Mélisse', carriere: 'Galet', bosquet: 'Sylve', puits: 'Ondin', ponton: 'Aster', atelier: 'Rivet', foyer: 'Cannelle' };
const SLUG = { potager: 'melisse', carriere: 'galet', bosquet: 'sylve', puits: 'ondin', ponton: 'aster', atelier: 'rivet', foyer: 'cannelle' };
const SEEDS = Array.from({ length: 12 }, (_, i) => (i + 1) * 7919);

const index = { _lisez_moi: 'Petit format du jeu (VILLAGER_BOX × 1,25), ancre aux pieds (0, 0). Vues : face, trois_quarts (avance vers le joueur, se), dos (s\'éloigne, ne) ; miroir horizontal pour les deux autres directions. Marche 4 images (≈ 160 ms), repos 2 (clignement), salut 2, travail 2 (maîtres), dort 2, lanterne et parapluie : marche de trois quarts dans un cadre élargi. Visiteurs : visitorLook(graine) du jeu.', habitants: {}, visiteurs: {} };
let count = 0;
const anim = [['Les maîtres, petit format', []], ['Visiteurs types', []]];
const cells = [[], []];

function person(look, dir, key, label, work, group) {
  const files = {};
  const out = (pose, view, frames, opts = {}, frame = BOX) => {
    const name = `${key}_${pose}${view ? '_' + VIEW_FR[view] : ''}`;
    files[name] = frames.map(f => {
      const s = villagerSprite(look, { pose: opts.pose || pose, view: view || 'front', frame: f, lantern: !!opts.lantern, umbrella: !!opts.umbrella });
      const rel = `${dir}/${name}_${f + 1}.svg`;
      write(path.join(LIB, rel), svgOf(frame, `<g transform="scale(${K})">${inner(s)}</g>`));
      count++;
      return { rel, body: `<g transform="scale(${K})">${inner(s)}</g>` };
    });
    return files[name];
  };
  for (const v of ['front', 'se', 'ne']) {
    out('marche', v, [0, 1, 2, 3]);
    out('repos', v, [0, 1]);
    out('salut', v, [0, 1]);
    if (work) out('travail', v, [0, 1]);
  }
  out('dort', null, [0, 1], { pose: 'sleep' }, SLEEP);
  out('lanterne', 'se', [0, 1, 2, 3], { pose: 'walk', lantern: true }, WIDE);
  out('parapluie', 'se', [0, 1, 2, 3], { pose: 'walk', umbrella: true }, WIDE);
  const entry = { nom: label, fichiers: Object.fromEntries(Object.entries(files).map(([k, v]) => [k, v.map(x => x.rel)])) };
  // planche : repos de face, marche 3/4, dos, salut, (travail), dort, parapluie
  const pick = [`${key}_repos_face`, `${key}_marche_trois_quarts`, `${key}_marche_dos`, `${key}_salut_face`, ...(work ? [`${key}_travail_trois_quarts`] : []), `${key}_dort`, `${key}_parapluie_trois_quarts`];
  cells[group].push(row(label, pick.map(n => { const f = files[n][1] || files[n][0]; const fr = /parapluie|lanterne/.test(n) ? WIDE : /dort/.test(n) ? SLEEP : BOX; return [svgOf(fr, unique(f.body), 2), n.replace(`${key}_`, '').replace(/_/g, ' ')]; })));
  const walk = files[`${key}_marche_trois_quarts`];
  anim[group][1].push({ label, frames: walk.map(f => svgOf(BOX, unique(f.body), 2.4)), timings: [160], w: r2(BOX[2] * 2.4), h: r2(BOX[3] * 2.4) });
  anim[group][1].push({ label: `${label} (miroir)`, frames: walk.map(f => svgOf(BOX, unique(f.body), 2.4)), timings: [160], w: r2(BOX[2] * 2.4), h: r2(BOX[3] * 2.4), mirror: true });
  return entry;
}

for (const [site, name] of Object.entries(MASTERS)) {
  const look = { skin: '#F2C9A0', hair: '#7A4E2C', ...ROLES[site] };
  index.habitants[SLUG[site]] = { ...person(look, `habitants/${SLUG[site]}`, SLUG[site], `${name} — ${ROLES[site].label}`, true, 0), batiment: site };
}
SEEDS.forEach((seed, i) => {
  const key = `visiteur_${String(i + 1).padStart(2, '0')}`;
  index.visiteurs[key] = { ...person(visitorLook(seed), `visiteurs/${key}`, key, `Visiteur ${i + 1}`, false, 1), graine: seed };
});
write(path.join(LIB, 'pnj_jeu.json'), JSON.stringify(index, null, 1));
write(path.join(DIR, 'pnj_apercu.html'), animated('Les PNJ du jeu en marche', 'Petit format du jeu : les maîtres et des visiteurs types, de trois quarts et en miroir.', anim));
await shoot([
  [path.join(PNG, 'pnj_habitants.png'), sheet('PNJ — les maîtres au petit format du jeu', 'Générateur du jeu (villagers.js) : face, trois quarts, dos, salut, travail, sommeil, parapluie. Ancre aux pieds.', cells[0]), 1150],
  [path.join(PNG, 'pnj_visiteurs.png'), sheet('PNJ — visiteurs types', 'Allures tirées d\'une graine comme dans le jeu (graine dans pnj_jeu.json).', cells[1]), 1150]
]);
console.log('ok', count, 'SVG');
