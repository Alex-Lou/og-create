// Les chemins de l'île dessinés dans la bibliothèque (design/bibliotheque/svg/chemins, chemins.json) : une case de
// chemin au format des cases du terrain (losange TW × TH), le chemin partant du centre vers les côtés où la voisine est
// aussi un chemin. Masque : NE 1 (x, y − 1), SE 2 (x + 1, y), SO 4 (x, y + 1), NO 8 (x − 1, y) ; deux variantes de
// terre, alternées. Leur herbe prend la teinte de la case où ils sont peints (aucun losange ne se voit). Le sol est
// peint d'un seul tenant (terrain.js, drawCell) : une image pas encore lue laisse l'ancien chemin, et le sol des
// chemins est repeint dès qu'elle l'est (onPathsLoaded)
import DATA from '../../design/bibliotheque/svg/chemins/chemins.json';

const FILES = import.meta.glob('/design/bibliotheque/svg/chemins/chemin_*.svg', { query: '?raw', import: 'default' });
const ROOT = '/design/bibliotheque/svg/chemins/';
// L'herbe des dessins (un dégradé), remplacée par celle de la case
const GRASS = /#8CC868|#6EAE50/gi;

const texts = new Map();
const images = new Map();
let listener = null;
let timer = 0;
// (plusieurs images arrivent ensemble : le sol n'est repeint qu'une fois)
const loaded = () => {
  clearTimeout(timer);
  timer = setTimeout(() => listener && listener(), 120);
};

// Le dessin d'un masque (alt : la seconde variante de terre)
export const pathFile = (mask, alt = false) => DATA.raccords[mask] && DATA.raccords[mask][alt ? 'terre_b' : 'terre'];

function textOf(file) {
  if (!texts.has(file)) {
    texts.set(file, null);
    const load = FILES[ROOT + file];
    if (load) load().then(text => { texts.set(file, text); loaded(); });
  }
  return texts.get(file);
}

// L'image d'un dessin dans l'herbe d'une teinte, ou null tant qu'elle n'est pas prête (elle se lit alors)
export function pathImage(file, grass) {
  if (!file || typeof Image === 'undefined') return null;
  const key = `${file}${grass}`;
  let img = images.get(key);
  if (!img) {
    const text = textOf(file);
    if (!text) return null;
    img = new Image();
    img.onload = loaded;
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(text.replace(GRASS, grass))}`;
    images.set(key, img);
  }
  return img.complete && img.naturalWidth ? img : null;
}

// fn, quand des images de chemins viennent d'être lues (le sol des chemins est à repeindre)
export function onPathsLoaded(fn) {
  listener = fn;
}
