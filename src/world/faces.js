// Portraits de la troupe hors de l'île (scènes du tutoriel, bulles du guide) : les dessins de la bibliothèque
// (masterPortraits.js), en naufragé ou en maître.
import { masterPortrait } from './masterPortraits';

// Image d'un membre de la troupe : l'adresse de son dessin de la bibliothèque (castaway : en naufragé ; view, pose : celles
// de masterPortrait) ; sans cette vue, son portrait de face ; null pour qui n'est pas de la troupe
export function faceHref(id, { castaway = false, view, pose } = {}) {
  return masterPortrait(id, castaway, { view, pose }) || masterPortrait(id, castaway);
}

// Le portrait d'un maître dans une bulle (design/bibliotheque/svg/portraits, portraits.json) : le buste de face, en 22
// expressions (mood : neutre, content, rire, surpris, triste, fache, gene, endormi, emu, effraye, boude, determine,
// emerveille, adore, etourdi, crocodile, pensif, malicieux, fier, fatigue, degoute, soulage), animé dans son SVG ; à défaut, son
// dessin en pied (faceHref). { face, bust } pour guide.say
const PORTRAITS = import.meta.glob('/design/bibliotheque/svg/portraits/*/*-portrait_*.svg', { query: '?url', import: 'default', eager: true });
const PORTRAIT_OF = { ponton: 'aster', foyer: 'cannelle', atelier: 'rivet', puits: 'ondin', bosquet: 'sylve', carriere: 'galet', potager: 'melisse' };
const portraitUrl = (name, mood) => PORTRAITS[`/design/bibliotheque/svg/portraits/${name}/${name}-portrait_${mood}.svg`];
export function bubbleFace(id, { castaway = false, mood = 'neutre' } = {}) {
  const name = PORTRAIT_OF[id];
  const url = name && (portraitUrl(name, mood) || portraitUrl(name, 'neutre'));
  return url ? { face: url, bust: true } : { face: faceHref(id, { castaway }) };
}

// Prénoms de la troupe (HISTOIRE.md, § 8.1), pour les bulles
export const NAMES = { ponton: 'Lorena', foyer: 'Agathe', atelier: 'Nathan', puits: 'Léo', bosquet: 'Maerys', carriere: 'Robby', potager: 'Maggy' };
// Leurs prénoms d'avant (choix de l'auteur, 14 oct. : chacun porte désormais celui de son astre), que la bibliothèque
// (design/) garde dans ses manifestes : le jeu dit les nouveaux (campArt.js)
export const LIBRARY_NAMES = { ponton: 'Aster', foyer: 'Cannelle', atelier: 'Rivet', puits: 'Ondin', bosquet: 'Sylve', carriere: 'Galet', potager: 'Mélisse' };
const ID_OF = Object.fromEntries(Object.entries(NAMES).map(([id, name]) => [name, id]));

// Le portrait d'une réplique de scène (PrologueScene), comme dans les bulles de l'île : { face, bust } d'un membre de la
// troupe (who : son prénom), en naufragé tant que son bâtiment n'est pas fondé (built), avec l'expression de la réplique
// (mood) ; le portrait donné par la réplique (face) ; sinon null (une pensée, Brume et sa flamme, le haut-parleur)
export function lineFace({ who, thought, face, mood } = {}, built = []) {
  if (!who || thought) return null;
  if (face) return { face };
  const id = ID_OF[who];
  return id ? bubbleFace(id, { castaway: !built.includes(id), mood }) : null;
}

// Les maîtres dont le bâtiment est fondé (state.villagers du serveur : built) ; les autres sont encore naufragés
export function builtOf(villagers) {
  return (villagers || []).filter(v => v.seed === undefined && v.built !== false).map(v => v.id);
}
