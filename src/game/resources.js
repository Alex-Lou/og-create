// Ressources de l'île : glyphe et nom. Le poisson de la Récolte n'est pas une ressource : il nourrit (× 3).
export const RESOURCES = [
  { id: 'stone', glyph: '🪨', label: 'pierre' },
  { id: 'wood', glyph: '🪵', label: 'bois' },
  { id: 'water', glyph: '💧', label: 'eau' },
  { id: 'food', glyph: '🍎', label: 'nourriture' }
];
export const GLYPH = { ...Object.fromEntries(RESOURCES.map(r => [r.id, r.glyph])), fish: '🐟' };
export const LABEL = Object.fromEntries(RESOURCES.map(r => [r.id, r.label]));
