// Portraits de la troupe hors de l'île (scènes du tutoriel, bulles du guide) : les dessins de la bibliothèque
// (masterArt.js), en naufragé ou en maître ; à défaut, le générateur de l'île (world/villagers.js) avec des couleurs
// fixes (sur l'île, peau et cheveux suivent le tirage du village).
import { villagerSprite, ROLES } from './villagers';
import { masterPortrait } from './masterArt';

const LOOKS = {
  ponton: { skin: '#F2C9A0', hair: '#B94E3A' },
  foyer: { skin: '#E9B98F', hair: '#7A4E2C' },
  atelier: { skin: '#F6D3B3' },
  puits: { skin: '#C98B5E', hair: '#3A2A1E' }
};

// Image d'un membre de la troupe : l'adresse de son dessin de la bibliothèque (castaway : en naufragé), ou une data URL
// SVG du générateur ; options : celles de villagerSprite (pose, view, frame)
export function faceHref(id, { castaway = false, ...options } = {}) {
  const art = masterPortrait(id, castaway, { view: options.view, pose: options.pose });
  if (art) return art;
  const { svg } = villagerSprite({ skin: '#F2C9A0', hair: '#3A2A1E', ...LOOKS[id], ...ROLES[id] }, { pose: 'idle', view: 'front', ...options });
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

// Le portrait d'un maître dans une bulle (design/bibliotheque/svg/portraits, portraits.json) : le buste de face, en 21
// expressions (mood : neutre, content, rire, surpris, triste, fache, gene, endormi, emu, effraye, boude, determine,
// emerveille, adore, etourdi, crocodile, pensif, malicieux, fier, fatigue, degoute), animé dans son SVG ; à défaut, son
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
export const NAMES = { ponton: 'Aster', foyer: 'Cannelle', atelier: 'Rivet', puits: 'Ondin', bosquet: 'Sylve', carriere: 'Galet', potager: 'Mélisse' };

// Les maîtres dont le bâtiment est fondé (state.villagers du serveur : built) ; les autres sont encore naufragés
export function builtOf(villagers) {
  return (villagers || []).filter(v => v.seed === undefined && v.built !== false).map(v => v.id);
}
