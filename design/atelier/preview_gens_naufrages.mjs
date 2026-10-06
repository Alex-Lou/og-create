// Lot G2 : les naufragés au petit format du jeu (générateur src/world/villagers.js, option look.castaway) :
// les 7 maîtres avant leur souvenir retrouvé, et 8 nouveaux naufragés de l'épilogue (acte VII : un navire perdu voit
// la lumière du phare et accoste ; ils sont cette fois accueillis). Habits délavés, lambeaux, pieds nus, pas de
// sceau (il s'allume au souvenir retrouvé), et pour chacun ce qui le distingue (voile, couverture, sac de jute,
// bandage, cape ou châle perdus, algue dans les cheveux).
import path from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { villagerSprite, ROLES, VILLAGER_BOX, personOf } from './port/src/world/villagers.js';

const require = createRequire(import.meta.url);
const DIR = path.dirname(fileURLToPath(import.meta.url));
const { unique, row, sheet, animated, write, shoot } = require('./planche.js');
const { fade } = require('./naufrage.js');
const LIB = path.join(DIR, 'lib', 'personnages');
const PNG = path.join(DIR, 'planches');
const r2 = n => Math.round(n * 100) / 100;
const K = 1.25;
const inner = s => s.svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
const BOX = [VILLAGER_BOX.x, VILLAGER_BOX.y, VILLAGER_BOX.w, VILLAGER_BOX.h].map(n => r2(n * K));
const SLEEP = [-21, -24, 42, 28].map(n => r2(n * K));
const svgOf = (frame, body, s = 1) => `<svg xmlns="http://www.w3.org/2000/svg" width="${r2(frame[2] * s)}" height="${r2(frame[3] * s)}" viewBox="${frame.join(' ')}">${body}</svg>`;
const VIEW_FR = { front: 'face', se: 'trois_quarts', ne: 'dos' };
const MASTERS = { ponton: 'Aster', foyer: 'Cannelle', atelier: 'Rivet', puits: 'Ondin', bosquet: 'Sylve', carriere: 'Galet', potager: 'Mélisse' };
const SLUG = { potager: 'melisse', carriere: 'galet', bosquet: 'sylve', puits: 'ondin', ponton: 'aster', atelier: 'rivet', foyer: 'cannelle' };
// même tissu qu'au grand format : voile (Aster, Rivet), couverture (Cannelle), sac de jute (Galet)
const CLOTH = { ponton: '#E6DCC3', foyer: '#93A9C2', carriere: '#C2A574' };
const STRENGTH = { ponton: 0.6 }; // Aster garde son jaune

// over : ce que chacun a perdu ou gagné (comme au grand format) : Sylve a perdu sa cape, Mélisse porte son châle à la
// taille (on ne le voit plus sur les épaules), Rivet a un bandage ; algues pour certains seulement
function castawayLook(look, cloth, k = 1, over = {}) {
  const f = c => (c ? fade(c, k) : c);
  const { weed = true, bandage = false, ...rest } = over;
  return { ...look, top: f(look.top), bottom: f(look.bottom), apron: f(look.apron), shawl: f(look.shawl), neckerchief: f(look.neckerchief), cape: look.cape ? fade(look.cape, 0.8) : look.cape,
    barefoot: true, boots: false, seal: false, pack: null, ...rest, castaway: { sail: cloth || null, weed, bandage } };
}
const OVER = { ponton: {}, foyer: { weed: false }, atelier: { weed: false, bandage: true }, puits: {}, bosquet: { weed: false, cape: null }, carriere: { weed: false }, potager: { shawl: null } };

const index = { _lisez_moi: 'Petit format du jeu (VILLAGER_BOX × 1,25), ancre aux pieds (0, 0), comme habitants/ et visiteurs/. Look du naufragé : option castaway du générateur (lambeaux, voile nouée, algue), couleurs délavées, pieds nus, pas de sceau. Les maîtres le quittent au souvenir retrouvé. Vues : face, trois_quarts (se), dos (ne), miroir pour les deux autres. Marche 4 images, repos 2, salut 2, travail 2 (maîtres), dort 2 (couché, cadre élargi). Pas de lanterne ni de parapluie : ils n\'en ont pas encore.', maitres: {}, epilogue: {} };
let count = 0;
const anim = [['Les maîtres naufragés, petit format', []], ['Nouveaux naufragés de l\'épilogue', []]];
const cells = [[], []];

function person(look, dir, key, label, work, group, compare) {
  const files = {};
  const out = (pose, view, frames, opts = {}, frame = BOX) => {
    const name = `${key}_${pose}${view ? '_' + VIEW_FR[view] : ''}`;
    files[name] = frames.map(f => {
      const s = villagerSprite(look, { pose: opts.pose || pose, view: view || 'front', frame: f });
      const body = `<g transform="scale(${K})">${inner(s)}</g>`;
      const rel = `${dir}/${name}_${f + 1}.svg`;
      write(path.join(LIB, rel), svgOf(frame, body));
      count++;
      return { rel, body };
    });
  };
  for (const v of ['front', 'se', 'ne']) {
    out('marche', v, [0, 1, 2, 3]);
    out('repos', v, [0, 1]);
    out('salut', v, [0, 1]);
    if (work) out('travail', v, [0, 1]);
  }
  out('dort', null, [0, 1], { pose: 'sleep' }, SLEEP);
  const pick = [`${key}_repos_face`, `${key}_marche_trois_quarts`, `${key}_marche_dos`, `${key}_salut_face`, ...(work ? [`${key}_travail_trois_quarts`] : []), `${key}_dort`];
  const before = compare ? [[svgOf(BOX, unique(`<g transform="scale(${K})">${inner(villagerSprite(compare, { pose: 'idle', view: 'front', frame: 0 }))}</g>`), 2), 'maître']] : [];
  cells[group].push(row(label, [...before, ...pick.map(n => { const f = files[n][1] || files[n][0]; return [svgOf(/dort/.test(n) ? SLEEP : BOX, unique(f.body), 2), n.replace(`${key}_`, '').replace(/_/g, ' ')]; })]));
  const walk = files[`${key}_marche_trois_quarts`];
  anim[group][1].push({ label, frames: walk.map(f => svgOf(BOX, unique(f.body), 2.4)), timings: [160], w: r2(BOX[2] * 2.4), h: r2(BOX[3] * 2.4) });
  anim[group][1].push({ label: `${label} (miroir)`, frames: walk.map(f => svgOf(BOX, unique(f.body), 2.4)), timings: [160], w: r2(BOX[2] * 2.4), h: r2(BOX[3] * 2.4), mirror: true });
  return { nom: label, fichiers: Object.fromEntries(Object.entries(files).map(([k, v]) => [k, v.map(x => x.rel)])) };
}

for (const [site, name] of Object.entries(MASTERS)) {
  const base = { skin: '#F2C9A0', hair: '#7A4E2C', ...ROLES[site] };
  const s = SLUG[site];
  index.maitres[s] = { ...person(castawayLook(base, CLOTH[site], STRENGTH[site] || 1, OVER[site]), `naufrages/petit_format/${s}`, `${s}_naufrage`, `${name} naufragé${/^(Aster|Cannelle|Sylve|Mélisse)$/.test(name) ? 'e' : ''}`, true, 0, base), batiment: site };
}
// nouveaux naufragés de l'épilogue : des allures tirées d'une graine (adultes et enfants), la moitié avec une voile
const SEEDS = Array.from({ length: 8 }, (_, i) => i * 104729 + 17);
const SAILS = ['#E6DCC3', null, '#93A9C2', null, '#C2A574', '#E6DCC3', null, '#D9B8A0'];
SEEDS.forEach((seed, i) => {
  const key = `naufrage_${String(i + 1).padStart(2, '0')}`;
  const look = castawayLook(personOf(seed, { label: 'Naufragé' }), SAILS[i], 1, { weed: i % 2 === 0 });
  index.epilogue[key] = { ...person(look, `naufrages/epilogue/${key}`, key, `Naufragé ${i + 1}`, false, 1), graine: seed };
});
write(path.join(LIB, 'naufrages', 'petit_format.json'), JSON.stringify(index, null, 1));
write(path.join(DIR, 'naufrages_pnj_apercu.html'), animated('Les naufragés au petit format', 'Les maîtres avant leur souvenir retrouvé, et les nouveaux naufragés de l\'épilogue, de trois quarts et en miroir.', anim));
await shoot([
  [path.join(PNG, 'naufrages_petit_format.png'), sheet('Naufragés — petit format du jeu', 'Le maître, puis son naufragé : face, trois quarts, dos, salut, travail, sommeil. Pas de sceau : il s\'allume au souvenir retrouvé.', cells[0]), 1150],
  [path.join(PNG, 'naufrages_epilogue.png'), sheet('Nouveaux naufragés de l\'épilogue', 'Acte VII : le navire perdu voit la lumière du phare ; ils sont cette fois accueillis. Allures tirées d\'une graine (dans petit_format.json).', cells[1]), 1150]
]);
console.log('ok', count, 'SVG');
