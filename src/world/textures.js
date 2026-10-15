// Les petites images des effets de l'île (lueurs, points, bulles, bancs de brume), chacune dessinée une fois puis
// recopiée : un seul endroit pour les faire et les garder. Leurs clés sont bornées : une par sorte, et par teinte prise
// dans les données du jeu.
const images = new Map();

// L'image de clé cle, w × h, dessinée une fois par dessin(g, w, h)
export function texture(cle, w, h, dessin) {
  let c = images.get(cle);
  if (c) return c;
  c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  dessin(c.getContext('2d'), w, h);
  images.set(cle, c);
  return c;
}

// Un dégradé rond, du centre au bord, en taille × taille ; arrets : [[position (0 à 1), couleur], …]
export const rond = (cle, taille, arrets) => texture(cle, taille, taille, g => {
  const r = taille / 2;
  const grad = g.createRadialGradient(r, r, 0, r, r, r);
  for (const [p, c] of arrets) grad.addColorStop(p, c);
  g.fillStyle = grad;
  g.fillRect(0, 0, taille, taille);
});
