// Registre des bâtiments palier par palier : dessin (avec son skin), lumières de nuit, fumées, parties animées,
// voilier du Ponton, souplesse au vent. Paliers I-II (et Cabane du Foyer) : sprites.js et buildings2.js ;
// paliers suivants : tiers/. Chaque entrée : { make(skin), lights, smoke, anims, boat, sway }.
// Une partie animée marquée tint (ailes de moulin, roue…) prend la teinte du bâtiment ; les effets (feu, eau) non.
import { BUILDINGS, LIGHTS, SMOKE, SHELTER_FIRE, flameFrames, boatSprite } from './sprites';
import { UPGRADES, fountainFrames } from './buildings2';
import { TIERS } from './tiers';
import { tintOf, tintSvg } from './tints';
import { RARE_SPRITES } from './rareSprites';
import { itemLayers } from './shopSprites';
import { sprite } from './iso';

const FLAMES = flameFrames();
const SHELTER_FLAMES = flameFrames(SHELTER_FIRE[0], SHELTER_FIRE[1], 0.75);
const FOUNTAIN = fountainFrames();
// Skins du Puits qui coiffent la Fontaine d'un kiosque : son toit cache les jets d'eau
const KIOSK_SKINS = new Set(['toit-bleu', 'toit-chaume']);
const BOAT_AT = [0.05, 0.5];

const FIRST = {
  foyer: [
    { make: BUILDINGS.foyer[0], lights: LIGHTS.foyer[0], smoke: [SMOKE.foyer[0]], fire: true, anims: [{ key: 'flame', n: FLAMES.length, fps: 9, frame: f => FLAMES[f] }] },
    { make: BUILDINGS.foyer[1], lights: LIGHTS.foyer[1], smoke: [SMOKE.foyer[1]], fire: true, anims: [{ key: 'flame', n: SHELTER_FLAMES.length, fps: 9, frame: f => SHELTER_FLAMES[f] }] },
    { make: BUILDINGS.foyer[2], lights: LIGHTS.foyer[2], smoke: [SMOKE.foyer[2]] }
  ],
  carriere: [{ make: BUILDINGS.carriere[0] }, { make: BUILDINGS.carriere[1] }],
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

// Dessin porté par un skin : recoloré si le skin est une teinte (tints.js), sinon dessiné avec le skin
function tinted(make) {
  return skin => {
    const tint = tintOf(skin);
    if (!tint) return make(skin);
    const drawn = make();
    return { ...drawn, svg: tintSvg(drawn.svg, tint) };
  };
}
const withTints = look => ({
  ...DEFAULTS,
  ...look,
  make: tinted(look.make),
  anims: (look.anims || []).map(anim => (anim.tint ? { ...anim, skinned: true, frame: (f, skin) => tinted(s => anim.frame(f, s))(skin) } : anim))
});
export const LOOKS = Object.fromEntries(Object.entries(FIRST).map(([id, list]) => [id, [...list, ...(TIERS[id] || [])].map(withTints)]));
// Voilier du Ponton, teinté comme son bâtiment
export const boatOf = tinted(boatSprite);

// Dessin d'un bâtiment à un niveau (le plus haut dessiné si le niveau le dépasse)
export function lookAt(siteId, level) {
  const list = LOOKS[siteId];
  return list ? list[Math.max(1, Math.min(level, list.length)) - 1] : null;
}
// Décalage écran du voilier par rapport à sa place d'origine (le sprite du voilier est dessiné en BOAT_AT)
export function boatOffset(at) {
  return [((at[0] - BOAT_AT[0]) - (at[1] - BOAT_AT[1])) * 32, ((at[0] - BOAT_AT[0]) + (at[1] - BOAT_AT[1])) * 16];
}
// Image complète d'un bâtiment pour une vignette : son dessin, ses parties animées (première image), le voilier
// et l'accessoire de la pièce rare qu'il porte (derrière ou devant lui ; le cadre s'agrandit pour le contenir)
export function artMake(siteId, level, skin) {
  const look = lookAt(siteId, level);
  return () => {
    const building = look.make(skin || undefined);
    const inner = s => s.svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
    let extra = look.anims.filter(a => !(a.skip && a.skip(skin))).map(a => inner(a.frame(0, skin))).join('');
    if (look.boat) {
      const [dx, dy] = boatOffset(look.boat);
      extra += `<g transform="translate(${dx} ${dy})">${inner(boatOf(skin || undefined))}</g>`;
    }
    if (!RARE_SPRITES[skin]) return { box: building.box, svg: building.svg.replace(/<\/svg>$/, `${extra}</svg>`) };
    const parts = itemLayers(skin, level, 0).map(layer => ({ ...layer, sprite: layer.make() }));
    const placed = side => parts.filter(p => p.back === side).map(p => `<g transform="translate(${p.offset[0]} ${p.offset[1]})">${inner(p.sprite)}</g>`).join('');
    const boxes = [building.box, ...parts.map(p => ({ ...p.sprite.box, x: p.sprite.box.x + p.offset[0], y: p.sprite.box.y + p.offset[1] }))];
    const x = Math.min(...boxes.map(b => b.x));
    const y = Math.min(...boxes.map(b => b.y));
    const box = { x, y, w: Math.max(...boxes.map(b => b.x + b.w)) - x, h: Math.max(...boxes.map(b => b.y + b.h)) - y };
    return sprite(placed(true) + inner(building) + extra + placed(false), box);
  };
}
