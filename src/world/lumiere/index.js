// Éclairage de l'île, seul point d'entrée du dossier. Dans l'ordre où la scène s'en sert (view/draw/loop.js) :
// ombres portées, carte de lumière, heure dorée, éclair, pluie, ambiance (rayons, éclats, vignettage), halos.
export { shadowLight, drawShadows, shadowTint, moonOf } from './ombres';
export { drawLightmap, ambientOf } from './carte';
export { eclairAt, drawEclair } from './eclairs';
export { drawPluie } from './pluie';
export { rainFelt, slantOf, wetnessAt, rainQuality, zoomOfRain, puddlesOf, drawPuddles, drawRipples, rippleSpotsOf } from './averse';
export { drawHalos, hazeOf } from './halos';
export { drawRays, drawMotes, drawVignette, raysOf, motesOf } from './ambiance';
export { goldenOf, drawGolden, rimOf, rimImage, clearRims } from './heureDoree';
