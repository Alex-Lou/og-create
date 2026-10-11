// Éclairage de l'île, seul point d'entrée du dossier. Dans l'ordre où la scène s'en sert (view/draw/loop.js) :
// ombres portées, carte de lumière, éclair, pluie, halos.
export { shadowLight, drawShadows, moonOf } from './ombres';
export { drawLightmap, ambientOf } from './carte';
export { eclairAt, drawEclair } from './eclairs';
export { drawPluie } from './pluie';
export { drawHalos } from './halos';
