// Registre des bâtiments palier par palier : dessin (avec son skin), lumières de nuit, fumées, parties animées,
// voilier du Ponton, souplesse au vent. Paliers I-II (et Maison du Foyer) : sprites.js et buildings2.js ;
// paliers suivants : tiers/. Chaque entrée : { make(skin), lights, smoke, anims, boat, sway }.
import { BUILDINGS, LIGHTS, SMOKE, flameFrames, boatSprite } from './sprites';
import { UPGRADES, fountainFrames } from './buildings2';
import { TIERS } from './tiers';

const FLAMES = flameFrames();
const FOUNTAIN = fountainFrames();
// Skins du Puits qui coiffent la Fontaine d'un kiosque : son toit cache les jets d'eau
const KIOSK_SKINS = new Set(['toit-bleu', 'toit-chaume']);
const BOAT_AT = [0.05, 0.5];

const FIRST = {
  foyer: [
    { make: BUILDINGS.foyer[0], lights: LIGHTS.foyer[0], smoke: [SMOKE.foyer[0]], fire: true, anims: [{ key: 'flame', n: FLAMES.length, fps: 9, frame: f => FLAMES[f] }] },
    { make: BUILDINGS.foyer[1], lights: LIGHTS.foyer[1] },
    { make: BUILDINGS.foyer[2], lights: LIGHTS.foyer[2], smoke: [SMOKE.foyer[2]] }
  ],
  carriere: [{ make: BUILDINGS.carriere[0] }, { make: UPGRADES.carriere, lights: [[0.04, -0.23, 34, 18]] }],
  bosquet: [{ make: BUILDINGS.bosquet[0], sway: 0.03 }, { make: UPGRADES.bosquet, sway: 0.03 }],
  puits: [
    { make: BUILDINGS.puits[0] },
    { make: UPGRADES.puits, anims: [{ key: 'fountain', n: FOUNTAIN.length, fps: 6, frame: f => FOUNTAIN[f], skip: skin => KIOSK_SKINS.has(skin) }] }
  ],
  potager: [{ make: BUILDINGS.potager[0] }, { make: UPGRADES.potager }],
  atelier: [
    { make: BUILDINGS.atelier[0], lights: LIGHTS.atelier[0], smoke: [SMOKE.atelier[0]] },
    { make: UPGRADES.atelier, lights: [[0.88, -0.05, 7, 30]], smoke: [[0.55, -0.2, 58]] }
  ],
  ponton: [{ make: BUILDINGS.ponton[0], boat: BOAT_AT }, { make: UPGRADES.ponton, boat: BOAT_AT, lights: [[0.82, 0.14, 37, 16]] }]
};
const DEFAULTS = { lights: [], smoke: [], anims: [], boat: null, sway: 0, fire: false };
export const LOOKS = Object.fromEntries(Object.entries(FIRST).map(([id, list]) => [id, [...list, ...(TIERS[id] || [])].map(look => ({ ...DEFAULTS, ...look }))]));

// Dessin d'un bâtiment à un niveau (le plus haut dessiné si le niveau le dépasse)
export function lookAt(siteId, level) {
  const list = LOOKS[siteId];
  return list ? list[Math.max(1, Math.min(level, list.length)) - 1] : null;
}
// Décalage écran du voilier par rapport à sa place d'origine (le sprite du voilier est dessiné en BOAT_AT)
export function boatOffset(at) {
  return [((at[0] - BOAT_AT[0]) - (at[1] - BOAT_AT[1])) * 32, ((at[0] - BOAT_AT[0]) + (at[1] - BOAT_AT[1])) * 16];
}
// Image complète d'un bâtiment pour une vignette : son dessin, ses parties animées (première image) et le voilier
export function artMake(siteId, level, skin) {
  const look = lookAt(siteId, level);
  return () => {
    const building = look.make(skin || undefined);
    const inner = s => s.svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
    let extra = look.anims.filter(a => !(a.skip && a.skip(skin))).map(a => inner(a.frame(0, skin))).join('');
    if (look.boat) {
      const [dx, dy] = boatOffset(look.boat);
      extra += `<g transform="translate(${dx} ${dy})">${inner(boatSprite(skin || undefined))}</g>`;
    }
    return { box: building.box, svg: building.svg.replace(/<\/svg>$/, `${extra}</svg>`) };
  };
}
