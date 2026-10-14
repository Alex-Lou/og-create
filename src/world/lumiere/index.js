// Éclairage de l'île, seul point d'entrée du dossier. Dans l'ordre où la scène s'en sert (view/draw/loop.js) :
// vent sur l'herbe, ombres portées, carte de lumière, heure dorée, éclair et tonnerre, arc-en-ciel, pluie, ambiance (rayons, éclats, vignettage),
// halos.
export { drawSheen, sheenAt, herbMask, gustAt, windStrength, leavesOf, leafTones, drawLeaves, LEAFY } from './vent';
export { shadowLight, drawShadows, shadowTint, moonOf } from './ombres';
export { drawLightmap, ambientOf, flashTint } from './carte';
export { eclairAt, drawEclair, eclairRimOf } from './eclairs';
export { eclatAt, lueurOf, drawEclat } from './eclat';
export { tonnerreAt } from './tonnerre';
export { seuilOf, nuitOf, allumage, drawAllumages } from './allumage';
export { pluieOf, cielOf, filanteAt, teteOf, drawFilante, drawPaillettes, FILANTE_TOUCHE } from './filantes';
export { arcApresAverse, arcForce, eveilOf, arcGeometrie, drawArcEnCiel, drawRefletArc } from './arcEnCiel';
export { drawPluie } from './pluie';
export { rainFelt, slantOf, wetnessAt, rainQuality, zoomOfRain, puddlesOf, drawPuddles, drawRipples, rippleSpotsOf } from './averse';
export { drawHalos, hazeOf } from './halos';
export { drawRays, drawMotes, drawVignette, raysOf, motesOf, motesIn } from './ambiance';
export { goldenOf, drawGolden, rimOf, rimImage, clearRims } from './heureDoree';
export { aigrettesOf, aigrettesIn, drawAigrettes, braisesFor, braisesIn, drawBraises } from './petiteVie';
export { wetKinds, darkOf, drawWetGround } from './mouille';
