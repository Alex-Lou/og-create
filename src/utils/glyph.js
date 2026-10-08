import { iconSrc } from './icons';

// Glyphe d'un élément : un emoji, un dessin du jeu (« svg:phare » → /icons/elements/phare.svg) ou une icône de
// l'interface (« ui:coin », utils/icons.js). Le nom du dessin est filtré strictement : une valeur reçue ne peut
// jamais devenir une adresse arbitraire.
const DRAWING = /^svg:([a-z0-9-]{1,40})$/;
const ICON = /^ui:([a-z_]{1,20})$/;

export function glyphSrc(glyph) {
  if (typeof glyph !== 'string') return null;
  const drawing = DRAWING.exec(glyph);
  if (drawing) return `/icons/elements/${drawing[1]}.svg`;
  const icon = ICON.exec(glyph);
  return icon ? iconSrc(icon[1]) : null;
}
