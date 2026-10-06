// La bibliothèque de dessins (design/bibliotheque) dans le cadre du jeu. Chaque SVG y est calé sur le cadre du jeu
// × 1,25, autour de la même ancre (README de la bibliothèque) : il se pose tel quel, ramené à la taille du cadre du
// jeu. Le jeu ne fait que lire la bibliothèque : un dessin refait là-bas arrive au prochain build.

// Le SVG ramené au cadre du jeu : seule sa taille d'affichage change (son viewBox reste celui de la bibliothèque)
export function fitTo(svg, box) {
  return svg.replace(/width="[\d.]+" height="[\d.]+"/, `width="${box.w}" height="${box.h}"`);
}

// Le sprite d'un fichier de la bibliothèque, pour le cache des sprites : son cadre tout de suite, son dessin à la demande
export function librarySprite(loader, box) {
  return () => ({ box, load: () => loader().then(svg => fitTo(svg, box)) });
}
