// Les tuiles de la Récolte dessinées dans la bibliothèque (design/bibliotheque/svg/minijeux/recolte, minijeux.json) :
// la tuile au repos et choisie (boucles animées dans le SVG), cueillie (4 images, 90 ms), qui atterrit (2 images,
// 140 ms), et l'éclat d'une longue chaîne (4 images, 90 ms). Cadre d'une tuile : 32 × 32 ; cueillie et l'éclat :
// 48 × 48 centrés sur la tuile. Les sortes gardent les noms du jeu (stone, wood, water, food, fish)
const URLS = import.meta.glob('/design/bibliotheque/svg/minijeux/recolte/*.svg', { query: '?url', import: 'default', eager: true });
const DIR = '/design/bibliotheque/svg/minijeux/recolte/';

export const PICK_MS = 90;
export const PICK_FRAMES = 4;
export const LAND_MS = 140;
export const LAND_FRAMES = 2;
// Une chaîne d'au moins ce nombre de tuiles éclate
export const LONG_CHAIN = 5;

const url = name => URLS[`${DIR}${name}.svg`] || null;
// La tuile d'une sorte : au repos, choisie, ou une image de sa cueillette (n : 1 à 4) ou de son atterrissage (1 à 2)
export const tileArt = (kind, state = 'tuile', n = 0) => url(n ? `${state}-${kind}_${n}` : `${state}-${kind}`);
// L'éclat d'une longue chaîne (n : 1 à 4)
export const chainArt = n => url(`chaine_${n}`);
// L'image d'une suite à l'instant now, commencée à start (1 à frames ; au-delà, la dernière)
export const frameAt = (start, now, ms, frames) => Math.min(frames, Math.max(1, Math.floor((now - start) / ms) + 1));
