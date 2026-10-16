// Éclairage de l'île, seul point d'entrée du dossier. Dans l'ordre où la scène s'en sert (view/draw/loop.js) :
// vent sur l'herbe, ombres portées, carte de lumière, heure dorée, éclair et tonnerre, arc-en-ciel, pluie, étalonnage, ambiance (rayons, éclats),
// halos ; les ciels rares (l'aurore sur les sommets, le halo de lune sur la mer).
export { drawSheen, sheenAt, herbMask, gustAt, windStrength, leavesOf, leafTones, drawLeaves, LEAFY } from './vent';
export { shadowLight, drawShadows, shadowTint, moonOf, PLACE_LUNE } from './ombres';
export { drawLightmap, ambientOf, flashTint } from './carte';
export { eclairAt, drawEclair, eclairRimOf } from './eclairs';
export { eclatAt, lueurOf, drawEclat } from './eclat';
export { tonnerreAt } from './tonnerre';
export { seuilOf, nuitOf, allumage, drawAllumages } from './allumage';
export { pluieOf, cielOf, filanteAt, refletOf, teteOf, cielDe, drawFilante, drawPaillettes, FILANTE_TOUCHE } from './filantes';
export { arcApresAverse, arcForce, eveilOf, arcGeometrie, drawArcEnCiel, drawRefletArc } from './arcEnCiel';
export { drawPluie, drawRefletsPluie } from './pluie';
export { rainFelt, slantOf, wetnessAt, puddlesOf, drawPuddles, drawRipples, rippleSpotsOf } from './averse';
export { drawHalos, hazeOf } from './halos';
export { drawRays, drawFaisceaux, drawMotes, raysOf, motesOf, motesIn } from './ambiance';
export { goldenOf, drawGolden, rimOf, rimImage, clearRims, imageSuivanteRims } from './heureDoree';
export { etalonnageOf, drawEtalonnage } from './etalonnage';
export { aigrettesOf, aigrettesIn, drawAigrettes, braisesFor, braisesIn, drawBraises } from './petiteVie';
export { wetKinds, darkOf, drawWetGround } from './mouille';
export { aTapis, aTourbillons, drawTapis, tourbillonsOf, drawTourbillons, tourbillonForce, brumeAutomne, drawNeige, givreOf, drawGivre, roseeOf, drawRosee, chaleurOf, drawChaleurEte } from './saisons';
export { SOMMET, auroreOf, creteDe, colonnesOf, lumieresAurore, drawAurore, libererAurore, haloOf, drawHalo } from './aurore';
