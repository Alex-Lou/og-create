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

// Le même SVG cadré sur box (unités du dessin) : il ne montre plus que cette partie
export function cropTo(svg, box) {
  const { x, y, w, h } = box;
  return svg.replace(/width="[\d.]+" height="[\d.]+" viewBox="[^"]+"/, `width="${w}" height="${h}" viewBox="${x} ${y} ${w} ${h}"`);
}

// Ce que peint un SVG (unités du dessin, à MARGIN près), mesuré sur ses pixels dans le navigateur : un tracé ou une
// ombre légère compte, une forme invisible non. scan : pixels de mesure par unité (2 : au demi-pixel près)
const MARGIN = 1.5;
export async function paintedBox(svg, scan = 2) {
  const [vx, vy, vw, vh] = svg.match(/viewBox="([^"]+)"/)[1].split(' ').map(Number);
  const img = new Image();
  const sized = svg.replace(/width="[\d.]+" height="[\d.]+"/, `width="${vw * scan}" height="${vh * scan}"`);
  img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(sized)}`;
  await img.decode();
  const canvas = document.createElement('canvas');
  canvas.width = vw * scan;
  canvas.height = vh * scan;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let x0 = canvas.width, y0 = canvas.height, x1 = -1, y1 = -1;
  for (let py = 0; py < canvas.height; py++) {
    for (let px = 0; px < canvas.width; px++) {
      if (data[(py * canvas.width + px) * 4 + 3] <= 8) continue;
      x0 = Math.min(x0, px);
      x1 = Math.max(x1, px);
      y0 = Math.min(y0, py);
      y1 = Math.max(y1, py);
    }
  }
  canvas.width = canvas.height = 0;
  if (x1 < 0) throw new Error('dessin vide');
  const round = v => Math.round(v * 10) / 10;
  return {
    x: round(vx + x0 / scan - MARGIN),
    y: round(vy + y0 / scan - MARGIN),
    w: round((x1 + 1 - x0) / scan + 2 * MARGIN),
    h: round((y1 + 1 - y0) / scan + 2 * MARGIN)
  };
}
