// Les objets de la boutique dessinés dans la bibliothèque (design/bibliotheque/svg/batiments/objets) : un fichier par
// image de chaque calque, ancré à sa place au sol. Sa place à chaque palier (en cases autour du centre du bâtiment),
// son cadre, devant ou derrière le bâtiment et sa cadence viennent de batiments.json ; un calque dessiné autrement à
// partir d'un palier (« _des_palier2 ») y a un groupe d'images par palier. Les places sont celles du jeu : le
// glissement (barque, wagonnet, grimoire…) et les lumières restent ceux du jeu (shopSprites.js). Une pièce rare garde
// ses calques du jeu.
import { reactive } from 'vue';
import DATA from '../../design/bibliotheque/svg/batiments/batiments.json';
import { P } from './iso';
import { fitTo, BLANK } from './library';
import { itemLayers } from './shopSprites';

const FILES = import.meta.glob('/design/bibliotheque/svg/batiments/objets/**/*.svg', { query: '?raw', import: 'default' });
const ROOT = '/design/bibliotheque/svg/batiments/';
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
// La bibliothèque est à l'échelle du jeu × 1,25
const SCALE = 1.25;

// Les images d'un calque à un palier et leur cadre : le groupe du palier quand le calque en a plusieurs (ses fichiers
// « _des_palierN » valent à partir du palier N)
export function framesAt(calque, level) {
  if (!Array.isArray(calque.cadre[0])) return { files: calque.fichiers, cadre: calque.cadre };
  const per = calque.fichiers.length / calque.cadre.length;
  const from = calque.cadre.map((_, g) => Number(calque.fichiers[g * per].match(/_des_palier(\d)/)[1]));
  const g = from.reduce((found, start, i) => (level >= start ? i : found), 0);
  return { files: calque.fichiers.slice(g * per, (g + 1) * per), cadre: calque.cadre[g] };
}

// Les calques d'un objet à un palier : { files, box, back, ms } (box : cadre dans le repère du bâtiment, au jeu), ou
// null si la bibliothèque ne l'a pas à ce palier
function calquesOf(id, level) {
  const lib = DATA.objets[id];
  if (!lib || !lib.calques.every(c => c.place[ROMAN[level - 1]])) return null;
  const calques = lib.calques.map(c => {
    const { files, cadre } = framesAt(c, level);
    const [x, y] = P(...c.place[ROMAN[level - 1]], 0);
    return { files, back: c.derriere, ms: c.ms_par_image, box: { x: x + cadre[0] / SCALE, y: y + cadre[1] / SCALE, w: cadre[2] / SCALE, h: cadre[3] / SCALE } };
  });
  return calques.every(c => c.files.every(file => FILES[ROOT + file])) ? calques : null;
}

// Calques d'un objet prêts à peindre à l'instant t (secondes), comme itemLayers : clé d'image, dessin, devant/derrière,
// décalage écran (le glissement du jeu) ; null si la bibliothèque n'a pas cet objet à ce palier
export function objectLayers(id, level, t = 0) {
  const calques = calquesOf(id, level);
  if (!calques) return null;
  const game = itemLayers(id, level, t);
  return calques.map((c, k) => {
    const f = c.files.length > 1 ? Math.floor((t * 1000) / c.ms) % c.files.length : 0;
    return {
      key: `lib-shop-${id}-${level}-${k}-${f}`,
      make: () => ({ box: c.box, load: () => FILES[ROOT + c.files[f]]().then(svg => fitTo(svg, c.box)) }),
      back: c.back,
      offset: game[k] ? game[k].offset : [0, 0]
    };
  });
}

// Vignette d'un objet pour la boutique : tous ses calques (première image, ceux de derrière d'abord), cadrés au plus
// juste, lus une fois ; une image vide pendant ce temps ; null si la bibliothèque ne l'a pas à ce palier ou si la
// lecture échoue (l'ancienne vignette revient)
const thumbs = reactive({});
const started = new Set();
export function objectThumb(id, level) {
  const calques = calquesOf(id, level);
  if (!calques) return null;
  const key = `${id}-${level}`;
  if (!started.has(key)) {
    started.add(key);
    const ordered = [...calques.filter(c => c.back), ...calques.filter(c => !c.back)];
    Promise.all(ordered.map(c => FILES[ROOT + c.files[0]]())).then(svgs => {
      const x = Math.min(...ordered.map(c => c.box.x));
      const y = Math.min(...ordered.map(c => c.box.y));
      const w = Math.max(...ordered.map(c => c.box.x + c.box.w)) - x;
      const h = Math.max(...ordered.map(c => c.box.y + c.box.h)) - y;
      // Chaque calque, son fichier tel quel, posé à son cadre
      const inner = svgs.map((svg, k) => {
        const b = ordered[k].box;
        return svg.replace(/^<svg /, `<svg x="${b.x}" y="${b.y}" `).replace(/width="[\d.]+" height="[\d.]+"/, `width="${b.w}" height="${b.h}"`);
      });
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x} ${y} ${w} ${h}" width="${w}" height="${h}">${inner.join('')}</svg>`;
      thumbs[key] = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
    }).catch(() => { thumbs[key] = null; });
  }
  return key in thumbs ? thumbs[key] : BLANK;
}
