// Réglages des bâtiments palier par palier, à côté de leur dessin (celui de la bibliothèque : buildingArt.js) :
// lumières de nuit et fumées (lues dans la bibliothèque), feu de camp, souplesse au vent, voilier du Ponton, et
// animations qu'un skin cache ou que la teinte du bâtiment recolore.
import DATA from '../../design/bibliotheque/svg/batiments/batiments.json';

// La bibliothèque est à l'échelle du jeu × 1,25
const SCALE = 1.25;
const unscale = n => Math.round((n / SCALE) * 100) / 100;

// Par bâtiment, les paliers (1 à 7) qui ont le réglage
const FIRE = { foyer: [1, 2] };
// La taille du dessin d'un palier sur l'île (son cadre, ses lumières et ses fumées avec lui) : le feu de camp un peu plus
// discret à côté de la cuisine d’Agathe (choix de l'auteur, 16 oct.)
const ART_SCALE = { foyer: { 1: 0.88 } };
const SWAY = { bosquet: { 1: 0.03, 2: 0.03, 3: 0.015, 4: 0.012 } };
// Place du voilier [u, v] : le bercement tourne autour d'elle
const BOAT = { ponton: { 1: [0.05, 0.5], 2: [0.05, 0.5], 3: [0.05, 0.5], 4: [0.08, 0.75], 5: [0.08, 0.75], 6: [0.08, 0.75], 7: [0.08, 0.75] } };
// Skins du Puits qui coiffent la Fontaine d'un kiosque : son toit cache les jets d'eau
const KIOSK = { puits: [2, 4] };
const KIOSK_SKINS = new Set(['toit-bleu', 'toit-chaume']);
// Mécanismes animés (bûche, roue, ailes de moulin) que la teinte recolore ; le feu et l'eau gardent leur couleur
const TINTED = { bosquet: [6], puits: [6], potager: [5] };

const has = (table, siteId, level) => Boolean(table[siteId] && table[siteId].includes(level));

function lookOf(siteId, level) {
  const art = DATA.paliers[`${siteId}_palier${level}`];
  const kiosk = has(KIOSK, siteId, level);
  const k = (ART_SCALE[siteId] && ART_SCALE[siteId][level]) || 1;
  return {
    scale: k,
    lights: (art.lumieres || []).map(l => [l.u * k, l.v * k, unscale(l.z) * k, unscale(l.rayon) * k]),
    smoke: (art.fumees || []).map(f => [f.u * k, f.v * k, unscale(f.z) * k]),
    fire: has(FIRE, siteId, level),
    sway: (SWAY[siteId] && SWAY[siteId][level]) || 0,
    boat: (BOAT[siteId] && BOAT[siteId][level]) || null,
    animSkip: skin => kiosk && KIOSK_SKINS.has(skin),
    animTint: has(TINTED, siteId, level)
  };
}

// { bâtiment: [réglages du palier 1, …, du palier 7] }
const SITES = [...new Set(Object.keys(DATA.paliers).map(key => key.split('_palier')[0]))];
export const LOOKS = Object.fromEntries(SITES.map(id => {
  const levels = Object.keys(DATA.paliers).filter(key => key.startsWith(`${id}_palier`)).length;
  return [id, Array.from({ length: levels }, (_, i) => lookOf(id, i + 1))];
}));

// Réglages d'un bâtiment à un niveau (le plus haut palier si le niveau le dépasse)
export function lookAt(siteId, level) {
  const list = LOOKS[siteId];
  return list ? list[Math.max(1, Math.min(level, list.length)) - 1] : null;
}
