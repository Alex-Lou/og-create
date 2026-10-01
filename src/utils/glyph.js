// Glyphe d'un élément : un emoji, ou un dessin du jeu (« svg:phare » → /icons/elements/phare.svg).
// Le nom du dessin est filtré strictement : une valeur reçue ne peut jamais devenir une adresse arbitraire.
const DRAWING = /^svg:([a-z0-9-]{1,40})$/;

export function glyphSrc(glyph) {
  const match = typeof glyph === 'string' ? DRAWING.exec(glyph) : null;
  return match ? `/icons/elements/${match[1]}.svg` : null;
}
