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

const CHAPTER_FAMILIES = {
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
