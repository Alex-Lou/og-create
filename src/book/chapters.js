// Les 7 chapitres du Livre côté navigateur : couleurs, et famille → chapitre (mêmes regroupements que le serveur,
// services/bookPages.js). Sert aux pages peintes et aux tuiles d'élément, partout dans le jeu.
export const CHAPTER_STYLE = {
  I: { color: '#CFE6F5', ink: '#2F6286', wax: '#5B8DB8' },
  II: { color: '#F2DDB0', ink: '#86591C', wax: '#B8792F' },
  III: { color: '#DCD3F2', ink: '#5A4A8C', wax: '#7D6BB5' },
  IV: { color: '#D3E8C8', ink: '#3E6B2E', wax: '#5E9446' },
  V: { color: '#F6D5C3', ink: '#9A4B2A', wax: '#C46E45' },
  VI: { color: '#D2DCE4', ink: '#3E5568', wax: '#62788C' },
  VII: { color: '#F1D3D8', ink: '#8C3D52', wax: '#B5637A' }
};

export const CHAPTER_FAMILIES = {
  I: ['Elements Fondamentaux', 'Phénomènes Naturels'],
  II: ['Matériaux', 'Chimie', 'Physique'],
  III: ['Cosmos', 'Formations Naturelles'],
  IV: ['Flore', 'Biologie', 'Vie et Créatures'],
  V: ['Corps et Esprit', 'Créations Humaines'],
  VI: ['Histoire', 'Technologie'],
  VII: ['Légendes']
};
const FAMILY_CHAPTER = Object.fromEntries(
  Object.entries(CHAPTER_FAMILIES).flatMap(([id, families]) => families.map(family => [family, id]))
);

// Chapitre d'une famille (I par défaut, pour une famille inconnue)
export const chapterOfFamily = family => FAMILY_CHAPTER[family] || 'I';
export const styleOfFamily = family => CHAPTER_STYLE[chapterOfFamily(family)];

// Teinte de chaque famille, dans la couleur de son chapitre : fond des tuiles d'élément et des cases inscrites du
// Livre (card), liseré du bas de la tuile (edge) et encre du losange (ink). Varie les cases sans perdre le chapitre.
export const FAMILY_TINT = {
  'Elements Fondamentaux': { card: '#DCEAF6', edge: '#A9C3D8', ink: '#2F6286' },
  'Phénomènes Naturels': { card: '#D3ECEE', edge: '#9DC6CA', ink: '#2A6C76' },
  'Matériaux': { card: '#F0DFBA', edge: '#CDB585', ink: '#86591C' },
  'Chimie': { card: '#F6D9BF', edge: '#D6AF8C', ink: '#9A5420' },
  'Physique': { card: '#ECE2B4', edge: '#C9BC82', ink: '#75621E' },
  'Cosmos': { card: '#E0D8F4', edge: '#B5AAD6', ink: '#5A4A8C' },
  'Formations Naturelles': { card: '#E8DCE8', edge: '#C4B1C5', ink: '#6B4C78' },
  'Flore': { card: '#D9ECCB', edge: '#A9C798', ink: '#3E6B2E' },
  'Biologie': { card: '#CFEADB', edge: '#98C6AD', ink: '#2D6A50' },
  'Vie et Créatures': { card: '#E3E7C2', edge: '#BCC28E', ink: '#566526' },
  'Corps et Esprit': { card: '#F7DAD0', edge: '#D9AE9F', ink: '#9A4B3A' },
  'Créations Humaines': { card: '#F3D7BF', edge: '#D4AD8C', ink: '#91502A' },
  'Histoire': { card: '#E4DCCD', edge: '#BFB39C', ink: '#5E5240' },
  'Technologie': { card: '#D4DFE8', edge: '#A3B5C4', ink: '#3E5568' },
  'Légendes': { card: '#F2D6DC', edge: '#D3A9B3', ink: '#8C3D52' }
};
// Famille inconnue : le vélin des tuiles, à l'encre de son chapitre
export const tintOfFamily = family => FAMILY_TINT[family] || { card: '#FBF5E8', edge: '#E3D3B5', ink: styleOfFamily(family).ink };

// Nom du grimoire (titre du sommaire et de l'en-tête du Livre)
export const BOOK_TITLE = 'Codex Mundi';
