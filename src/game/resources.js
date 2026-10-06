// Ressources de l'île : glyphe et nom. Le poisson de la Récolte n'est pas une ressource : il nourrit (× 3).
export const RESOURCES = [
  { id: 'stone', glyph: 'ui:stone', label: 'pierre' },
  { id: 'wood', glyph: 'ui:wood', label: 'bois' },
  { id: 'water', glyph: 'ui:water', label: 'eau' },
  { id: 'food', glyph: 'ui:food', label: 'nourriture' }
];
export const GLYPH = { ...Object.fromEntries(RESOURCES.map(r => [r.id, r.glyph])), fish: 'ui:fish' };
export const LABEL = Object.fromEntries(RESOURCES.map(r => [r.id, r.label]));

// Ce que coûte une chose, en toutes lettres (lecteurs d'écran) : ressources, trouvailles de climat, puis écus s'il y en a
export function costLabel(cost, finds = {}, coins = null) {
  return [
    ...Object.entries(cost || {}).map(([r, n]) => `${n} ${LABEL[r]}`),
    ...Object.entries(finds || {}).map(([f, n]) => `${n} ${f}`),
    ...(coins === null ? [] : [`${coins} écus`])
  ].join(', ');
}
