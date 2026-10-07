// Lot F — météo et ciel. SVG dans lib/meteo/<groupe>/, index meteo.json (usage de chaque calque, modes de fusion,
// courbe du flash, couleurs des moments, des climats et des saisons), planches PNG, page animée meteo_apercu.html.
const path = require('path');
const { unique, row, sheet, animated, write, shoot } = require('./planche');
const { TILES, SPR, MOMENTS, WEATHERS, CLIMATES, SAISONS, ICONS, ICON_GROUPS } = require('./meteo');

const LIB = path.join(__dirname, 'lib', 'meteo');
const PNG = path.join(__dirname, 'planches');
const r2 = n => Math.round(n * 100) / 100;
const svgOf = (vb, body, w = vb[2], h = vb[3], stretch = false) => `<svg xmlns="http://www.w3.org/2000/svg" width="${r2(w)}" height="${r2(h)}" viewBox="${vb.join(' ')}"${stretch ? ' preserveAspectRatio="none"' : ''}>${body}</svg>`;
let count = 0;
const put = (rel, content) => { write(path.join(LIB, rel), content); count++; return rel; };
const index = {
  _lisez_moi: 'Calques d\'écran : les tuiles se répètent sans couture (background-repeat) et leurs images bouclent ; « étirer » = à poser sur tout l\'écran (preserveAspectRatio none). Teintes des moments : en multiplication (mix-blend-mode: multiply) sur toute la scène. Soleil bas et plein soleil : en « screen ». Sol des saisons (sol/) : une case iso de 80 × 40, ancre au centre de la case, à poser sur les cases sous le reste ; les variantes a, b, c s\'alternent d\'une case à l\'autre. Couleurs et densités du jeu (sky.js, scene.js, climates.js).',
  tuiles: {}, sprites: {}, moments: {}, temps: {}, climats: {}, saisons: {}, icones: {}
};
const GROUP_OF_TILE = { pluie_jour: 'temps', pluie_nuit: 'temps', brume: 'temps', neige: 'climats', rafales: 'climats', brume_marais: 'climats', chaleur: 'climats', averse: 'climats', cendres: 'climats', etoiles: 'ciel', flocons: 'saisons', feuilles: 'saisons', petales: 'saisons', pollen: 'saisons' };
const LABEL = {
  pluie_jour: 'Pluie (jour)', pluie_nuit: 'Pluie (nuit)', brume: 'Brume du matin', neige: 'Neige — les Cimes', rafales: 'Rafales — les Landes', brume_marais: 'Brume tiède — le Marais',
  chaleur: 'Ondes de chaleur — les Dunes', averse: 'Averse tropicale — la Jungle', cendres: 'Cendres et braises — le Volcan', etoiles: 'Étoiles dans la mer (nuit)',
  flocons: 'Flocons — l\'hiver', feuilles: 'Feuilles qui tombent — l\'automne', petales: 'Pétales de cerisier — le printemps', pollen: 'Pollen — le printemps et l\'été'
};
const BG = { pluie_nuit: '#22355C', etoiles: '#1D3557', neige: '#8FA6BF', rafales: '#9DB58A', chaleur: '#E2B46A', cendres: '#7A665A', averse: '#6E9E7E', brume_marais: '#7E9A80', flocons: '#8FA6BF', feuilles: '#9DB58A', petales: '#9FC6E0', pollen: '#7EA86A' };

/* ---------- Tuiles animées ---------- */
const tileBoxes = { temps: [], climats: [], ciel: [], saisons: [] };
const tileCells = [];
for (const [id, t] of Object.entries(TILES)) {
  const g = GROUP_OF_TILE[id];
  const frames = Array.from({ length: t.n }, (_, k) => t.draw(k));
  const files = frames.map((body, k) => put(`${g}/${id}_${k + 1}.svg`, svgOf([0, 0, t.w, t.h], body)));
  index.tuiles[id] = { nom: LABEL[id], fichiers: files, tuile: [t.w, t.h], ms_par_image: t.ms };
  // aperçu : tuile répétée 2 × 2 sur un fond qui rappelle le sol
  const rep = body => [[0, 0], [t.w, 0], [0, t.h], [t.w, t.h]].map(([x, y]) => `<g transform="translate(${x} ${y})">${body.replace(/id="([^"]+)"/g, `id="$1-${x}-${y}"`).replace(/url\(#([^)]+)\)/g, `url(#$1-${x}-${y})`)}</g>`).join('');
  const view = b => svgOf([0, 0, 2 * t.w, 2 * t.h], `<rect width="${2 * t.w}" height="${2 * t.h}" fill="${BG[id] || '#7FA9C9'}"/>${unique(rep(b))}`, t.w * 0.9, t.h * 0.9);
  tileBoxes[g].push({ label: LABEL[id], frames: frames.map(view), timings: [t.ms], w: r2(t.w * 0.9), h: r2(t.h * 0.9) });
  tileCells.push([view(frames[0]), `${LABEL[id]}<br><i>${t.n} images, ${t.ms} ms</i>`]);
}

/* ---------- Sprites ---------- */
const SPR_LABEL = { arc_en_ciel: 'Arc-en-ciel', eclair: 'Éclair', flash: 'Flash d\'orage (écran)', soleil_bas_matin: 'Soleil bas du matin (écran, screen)', soleil_bas_soir: 'Soleil bas du soir (écran, screen)', luciole: 'Luciole', halo_chaud: 'Halo chaud (fenêtres, feux)', ombre_nuage: 'Ombre de nuage', plein_soleil: 'Plein soleil d\'été (écran, screen)',
  neige_sol_a: 'Neige au sol (a)', neige_sol_b: 'Neige au sol (b)', neige_sol_c: 'Neige au sol (c)', neige_fondante_a: 'Neige fondante (a)', neige_fondante_b: 'Neige fondante (b)', givre: 'Givre', flaque_petite: 'Petite flaque', flaque_grande: 'Grande flaque', flaque_pluie: 'Flaque sous la pluie' };
const sprCells = { nuages: [], ciel: [], lumieres: [], sol: [] }, sprBoxes = [];
for (const [id, s] of Object.entries(SPR)) {
  const frames = Array.from({ length: s.n }, (_, k) => s.draw(k));
  const files = frames.map((body, k) => put(`${s.group}/${id}${s.n > 1 ? `_${k + 1}` : ''}.svg`, svgOf(s.frame, body, s.frame[2], s.frame[3], s.stretch)));
  const label = SPR_LABEL[id] || id.replace(/^nuage(\d)_(\w+)$/, (m, n, c) => `Nuage ${n} — ${{ jour: 'jour', dore: 'doré', nuit: 'nuit', pluie: 'pluie' }[c]}`);
  index.sprites[id] = { nom: label, fichiers: files, cadre: s.frame, ...(s.stretch ? { etirer: true } : { ancre: 'centre (0, 0)' }), ...(s.n > 1 ? { ms_par_image: s.ms || 300 } : {}) };
  const z = Math.min(1.6, 200 / Math.max(s.frame[2], s.frame[3]));
  const dark = /nuit|luciole|halo|eclair|flash/.test(id);
  // le sol des saisons se montre sur une case d'herbe ; le reste sur un ciel (ou une nuit)
  const fond = s.group === 'sol' ? `<rect x="${s.frame[0]}" y="${s.frame[1]}" width="${s.frame[2]}" height="${s.frame[3]}" fill="#CFE3B4"/><path d="M0,-20 L40,0 L0,20 L-40,0 Z" fill="#93C76E"/>`
    : `<rect x="${s.frame[0]}" y="${s.frame[1]}" width="${s.frame[2]}" height="${s.frame[3]}" fill="${dark ? '#2B3566' : '#9FC6E0'}"/>`;
  const view = b => svgOf(s.frame, `${fond}${unique(b)}`, s.frame[2] * z, s.frame[3] * z, s.stretch);
  sprCells[s.group].push([view(frames[0]), label]);
  if (s.n > 1) sprBoxes.push({ label, frames: frames.map(view), timings: [s.ms || 300], w: r2(s.frame[2] * z), h: r2(s.frame[3] * z) });
}

/* ---------- Moments du jour : teinte (multiplier) et mer ---------- */
const momentCells = [];
for (const [id, label, when, m] of MOMENTS) {
  const tint = put(`moments/teinte_${id}.svg`, svgOf([0, 0, 640, 360], `<rect width="640" height="360" fill="${m.tint}"/>`, 640, 360, true));
  const sea = put(`moments/mer_${id}.svg`, svgOf([0, 0, 640, 360], `<defs><linearGradient id="m" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${m.sea[0]}"/><stop offset="1" stop-color="${m.sea[1]}"/></linearGradient></defs><rect width="640" height="360" fill="url(#m)"/>`, 640, 360, true));
  index.moments[id] = { nom: label, quand: when, teinte: m.tint, mer: m.sea, nuit: m.night, chaleur: m.warm, fichiers: [tint, sea] };
  // aperçu : la mer, puis une île témoin teintée en multiplication
  momentCells.push([svgOf([0, 0, 160, 100], unique(`<defs><linearGradient id="m" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${m.sea[0]}"/><stop offset="1" stop-color="${m.sea[1]}"/></linearGradient></defs><rect width="160" height="100" fill="url(#m)"/>`
    + `<g><polygon points="80,30 140,58 80,86 20,58" fill="#9FD07A"/><polygon points="20,58 80,86 80,94 20,66" fill="#B07A45"/><polygon points="80,86 140,58 140,66 80,94" fill="#8A5A32"/><polygon points="64,40 84,50 84,66 64,56" fill="#F3E4C4"/><polygon points="84,50 96,44 96,60 84,66" fill="#D8C39B"/><polygon points="60,40 74,33 88,40 74,47" fill="#E06E52"/></g><rect width="160" height="100" fill="${m.tint}" style="mix-blend-mode:multiply"/>`), 160, 100), `${label}<br><i>${when}</i>`]);
}

/* ---------- Temps et climats : quels calques, quelles valeurs ---------- */
index.temps = Object.fromEntries(Object.entries(WEATHERS).map(([id, w]) => [id, { nom: w.label, couverture: w.cover, pluie: w.rain, orage: w.storm, brume: w.mist, calques: {
  clair: ['ciel/soleil_bas_matin ou soleil_bas_soir quand le soleil est bas', 'nuages/nuage*_jour (5 nuages)'],
  voile: ['nuages : jusqu\'à 9 nuages', 'la teinte du moment grisaille (≈ 58 % vers un gris)'],
  brume: ['temps/brume_* (le matin seulement)', 'nuages : 7'],
  pluie: ['temps/pluie_jour_* ou pluie_nuit_*', 'temps/brume_* à 25 %', 'nuages/nuage*_pluie (10)', 'ciel/arc_en_ciel juste après'],
  orage: ['temps/pluie_*', 'ciel/flash selon la courbe ci-dessous', 'ciel/eclair (facultatif : le jeu ne montre que le flash)', 'nuages/nuage*_pluie (11)']
}[id] }]));
index.temps.flash_orage = { periode_s: 9.7, chance: 0.65, courbe: 'opacité 1 → 0 en 0,12 s, rien jusqu\'à 0,22 s, puis 0,7 → 0 jusqu\'à 0,45 s (× 0,42)' };
index.climats = Object.fromEntries(Object.entries(CLIMATES).map(([id, c]) => {
  const f = put(`climats/teinte_${id}.svg`, svgOf([0, 0, 640, 360], `<rect width="640" height="360" fill="${c.teinte}"/>`, 640, 360, true));
  return [id, { nom: c.nom, teinte: c.teinte, air: `climats/${c.air}_*`, fichiers: [f] }];
}));

// Saisons : la teinte de la scène (comme les climats), l'air (calques saisons/), le sol (sprites sol/), le ciel
const saisonCells = [];
index.saisons = Object.fromEntries(Object.entries(SAISONS).map(([id, c]) => {
  const f = put(`saisons/teinte_${id}.svg`, svgOf([0, 0, 640, 360], `<rect width="640" height="360" fill="${c.teinte}"/>`, 640, 360, true));
  // aperçu : l'île témoin, la teinte de la saison, son air par-dessus
  const air = c.air.map(a => TILES[a].draw(0)).join('');
  saisonCells.push([svgOf([0, 0, 256, 160], unique(`<rect width="256" height="160" fill="#7CC4E6"/><g transform="translate(48 30) scale(1)"><polygon points="80,30 140,58 80,86 20,58" fill="#9FD07A"/><polygon points="20,58 80,86 80,94 20,66" fill="#B07A45"/><polygon points="80,86 140,58 140,66 80,94" fill="#8A5A32"/><polygon points="64,40 84,50 84,66 64,56" fill="#F3E4C4"/><polygon points="84,50 96,44 96,60 84,66" fill="#D8C39B"/><polygon points="60,40 74,33 88,40 74,47" fill="#E06E52"/></g>`
    + `<rect width="256" height="160" fill="${c.teinte}"/>${c.ciel ? `<g style="mix-blend-mode:screen" transform="scale(0.4 0.4444)">${SPR[c.ciel[0]].draw(0)}</g>` : ''}<g>${air}</g>`), 256, 160), c.nom]);
  return [id, { nom: c.nom, teinte: c.teinte, air: c.air.map(a => `saisons/${a}_*`), ...(c.sol ? { sol: c.sol.map(x => `sol/${x}`) } : {}), ...(c.ciel ? { ciel: c.ciel.map(x => `ciel/${x}`) } : {}), fichiers: [f] }];
}));

/* ---------- Icônes ---------- */
const iconRows = [];
for (const [g, ids] of Object.entries(ICON_GROUPS)) {
  index.icones[g] = ids.map(id => put(`icones/${g}/${id}.svg`, svgOf([0, 0, 48, 48], ICONS[id]())));
  iconRows.push(row({ temps: 'Temps', moments: 'Moments', climats: 'Climats', saisons: 'Saisons' }[g], ids.map(id => [svgOf([0, 0, 48, 48], unique(ICONS[id]()), 72, 72), id.replace(/_/g, ' ')])));
}
write(path.join(LIB, 'meteo.json'), JSON.stringify(index, null, 1));

/* ---------- Planches et page animée ---------- */
const shots = [
  [path.join(PNG, 'meteo_calques.png'), sheet('Météo — calques d\'écran', 'Tuiles sans couture (répétées 2 × 2 ici), images en boucle : temps de l\'île, air des climats, étoiles de la nuit.', [row('', tileCells)]), 1250],
  [path.join(PNG, 'meteo_ciel.png'), sheet('Météo — ciel, nuages et lumières', 'Nuages au trait adouci (4 couleurs : jour, doré, nuit, pluie), arc-en-ciel, éclair, flash, soleil bas, lucioles, halo.', [row('Nuages', sprCells.nuages), row('Ciel', sprCells.ciel), row('Lumières', sprCells.lumieres)]), 1250],
  [path.join(PNG, 'meteo_saisons.png'), sheet('Météo — les saisons', 'La teinte de chaque saison sur l\'île témoin, son air par-dessus (et le plein soleil de l\'été) ; puis le sol des saisons, une case iso : neige (3 variantes), neige fondante (2), givre, flaques.', [row('Saisons', saisonCells), row('Sol', sprCells.sol)]), 1250],
  [path.join(PNG, 'meteo_moments.png'), sheet('Météo — les moments du jour', 'La mer du moment et une île témoin teintée en multiplication (teinte_*.svg). Heures relatives au lever et au coucher du soleil.', [row('', momentCells)]), 1250],
  [path.join(PNG, 'meteo_icones.png'), sheet('Météo — icônes', 'Au trait de la troupe, 48 × 48.', iconRows), 1100]
];
write(path.join(__dirname, 'meteo_apercu.html'), animated('La météo en mouvement', 'Lot F : calques d\'écran en boucle (vitesse proche du jeu), éclair et lucioles.', [['Temps de l\'île', tileBoxes.temps], ['Air des climats', tileBoxes.climats], ['Air des saisons', tileBoxes.saisons], ['Nuit', tileBoxes.ciel], ['Ciel, lumières et flaques', sprBoxes]]));
shoot(shots).then(() => console.log('ok', count, 'SVG'));
