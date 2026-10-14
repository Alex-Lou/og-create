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

// Une réserve de dessins précuits à la demande, pour une scène qui les montre à des tailles qui changent (un poisson
// au large est plus petit) : chaque SVG est lu une fois, puis cuit à chaque taille demandée, arrondie au palier de
// STEP px (quelques tailles par dessin, pas une par image). get rend le dessin cuit, ou null tant qu'il se lit ;
// ratio rend sa proportion (hauteur / largeur), ou null.
const STEP = 8;
export function createSpriteCache(scale, onReady = () => {}) {
  const images = new Map();
  const baked = new Map();
  const load = url => {
    let img = images.get(url);
    if (!img) {
      img = new Image();
      img.onload = onReady;
      img.src = url;
      images.set(url, img);
    }
    return img.complete && img.naturalWidth ? img : null;
  };
  return {
    ratio(url) {
      const img = url && load(url);
      return img ? img.naturalHeight / img.naturalWidth : null;
    },
    get(url, w, h) {
      const img = url && load(url);
      if (!img) return null;
      const bw = Math.max(STEP, Math.ceil(w / STEP) * STEP);
      const bh = Math.max(1, Math.round((bw * h) / w));
      const key = `${url}|${bw}|${bh}`;
      let canvas = baked.get(key);
      if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.width = Math.round(bw * scale);
        canvas.height = Math.round(bh * scale);
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        baked.set(key, canvas);
      }
      return canvas;
    },
    // (une autre densité d'écran : tout se recuit)
    rescale(next) {
      scale = next;
      baked.clear();
    }
  };
}
