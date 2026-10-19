// Le sol de la très grande île en relief (Canvas 2D, unités du monde) : chaque case a un sol (herbe, sable, prairie,
// forêt, roche, chemin, eau, et ceux des climats : neige, lac gelé, lande, marais, jungle, cendre, lave ; 'u' : terre
// encore inconnue) et une hauteur de 0 à 6 ; ses faces avant (vers +x et +y) descendent jusqu'au voisin, ou jusqu'à
// la mer. Le sol est préparé en carrés alignés sur l'écran, gardés en images (TerrainCache) : seuls les
// carrés visibles sont dessinés, les nouveaux préparés dans un budget de temps par image.
// L'eau douce (reflets, cascades) est animée par-dessus, case par case visible ; la mer vit dans sea.js.
// Ce fichier réunit les modules de terrain/ (un sujet chacun) sous les noms qu'utilise le reste du jeu.

export { TW, TH, HS, SEA_Z, SHALLOW, SEA_PAD, SEA_FAR, CELL_ABOVE_MAX, CELL_BELOW, CRUST, underAt, islandOf, worldOf, bridgeLamp, lampGlowOf } from './terrain/geo';
export { paintColor, paintSmooth } from './terrain/paint';
export { pathDraws, pavedAt, pathMask, pathGrass } from './terrain/paths';
export { drawCell } from './terrain/cell';
export { FEATHER, featheredVeil } from './terrain/veil';
export { NEAR_BAKE, STALE_GAP_MS, TerrainCache, resOf, cellsBox } from './terrain/cache';
export { liveOf, strokeBatch, drawLive } from './terrain/live';
