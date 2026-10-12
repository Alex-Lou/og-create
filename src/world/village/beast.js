// Le village (world/village.js) : petits outils partagés (tirage stable, bornes, adoucissement) et le dessin d'une
// bête prêt à peindre.
import { beastSprite, lookOf } from '../beastArt';
import { ANIMAL_SPRITES } from '../animals';

export const hash = (a, b) => {
  const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
  return s - Math.floor(s);
};
export const clamp = (n, a = 0, b = 1) => Math.max(a, Math.min(b, n));
export const smooth = k => k * k * (3 - 2 * k);

// Une bête prête à dessiner : le dessin de la bibliothèque (beastArt.js ; look : sa vue, sa pose et son image, sinon
// déduits de l'image du jeu, de profil), sinon celui du code (clé d'image par sorte, variante et image)
// (dessinée de face, le hibou ou un papillon, elle ne se retourne jamais ; une luciole luit, plus fort quand elle
// s'allume : glow)
export function beast(id, species, variant, x, y, z, flip, frame, look = null) {
  const art = beastSprite(species, variant, look || lookOf(frame, species));
  return {
    id, kind: 'beast', species, x, y, z, flip: art && art.face ? false : flip,
    sprite: art ? [art.key, art.make] : [`beast-${species}-${variant}-${frame}`, () => ANIMAL_SPRITES[species](frame, variant)],
    ...(species === 'firefly' ? { glow: frame === 1 ? 1 : 0.55 } : {})
  };
}
