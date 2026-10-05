// Portraits de la troupe hors de l'île (scènes du tutoriel, bulles du guide) : le générateur de l'île
// (world/villagers.js) avec des couleurs fixes (sur l'île, peau et cheveux suivent le tirage du village).
import { villagerSprite, ROLES } from './villagers';

const LOOKS = {
  ponton: { skin: '#F2C9A0', hair: '#B94E3A' },
  foyer: { skin: '#E9B98F', hair: '#7A4E2C' },
  atelier: { skin: '#F6D3B3' },
  puits: { skin: '#C98B5E', hair: '#3A2A1E' }
};

// Image (data URL SVG) d'un membre de la troupe ; options : celles de villagerSprite (pose, view, frame)
export function faceHref(id, options = {}) {
  const { svg } = villagerSprite({ skin: '#F2C9A0', hair: '#3A2A1E', ...LOOKS[id], ...ROLES[id] }, { pose: 'idle', view: 'front', ...options });
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

// Prénoms de la troupe (HISTOIRE.md, § 8.1), pour les bulles
export const NAMES = { ponton: 'Aster', foyer: 'Cannelle', atelier: 'Rivet', puits: 'Ondin', bosquet: 'Sylve', carriere: 'Galet', potager: 'Mélisse' };
