// Ressources de l'île : glyphe et nom. Le poisson de la Récolte n'est pas une ressource : il nourrit (× 3).
export const RESOURCES = [
  { id: 'stone', glyph: 'ui:stone', label: 'pierre' },
  { id: 'wood', glyph: 'ui:wood', label: 'bois' },
  { id: 'water', glyph: 'ui:water', label: 'eau' },
  { id: 'food', glyph: 'ui:food', label: 'nourriture' }
];
export const GLYPH = { ...Object.fromEntries(RESOURCES.map(r => [r.id, r.glyph])), fish: 'ui:fish' };
export const LABEL = Object.fromEntries(RESOURCES.map(r => [r.id, r.label]));
