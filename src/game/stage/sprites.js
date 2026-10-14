// Les dessins de la bibliothèque précuits pour la scène : chaque SVG est lu une fois, puis dessiné dans un petit
// canvas à la taille où il sera montré. Un SVG en <img> se redessine à chaque image s'il s'anime (ses boucles) et se
// décode au premier affichage : sur un téléphone, c'était l'essentiel du temps du plateau de la Récolte.

// urls : { clé: url } ; px : la taille d'un dessin à l'écran (px CSS) ; scale : sa densité (devicePixelRatio)
// Rend { clé: canvas } (les dessins qui n'ont pas pu être lus manquent)
export async function bakeSprites(urls, px, scale) {
  const size = Math.max(1, Math.round(px * scale));
  const out = {};
  await Promise.all(Object.entries(urls).map(async ([key, url]) => {
    if (!url) return;
    try {
      const img = new Image();
      img.src = url;
      await img.decode();
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = size;
      canvas.getContext('2d').drawImage(img, 0, 0, size, size);
      out[key] = canvas;
    } catch {
      // un dessin illisible : la scène dessine sa forme de repli
    }
  }));
  return out;
}
