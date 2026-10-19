// Les chemins : les dessins de la bibliothèque d'une case de chemin, leur raccord vers les voisines, le pavé.
import { pathFile, pathImage } from '../pathArt';
import { TW, TH, diamond } from './geo';
import { rnd } from './paint';
import { topColor } from './faces';

// Les dessins de chemin d'une case de chemin (pathArt.js) : [{ file, dx, dy }] (décalage depuis son centre, unités du
// monde) et clip (les peindre dans son losange seulement). Un chemin d'une case : son raccord vers ses voisines. Les
// parties plus larges : un seul chemin, au milieu, posé sur les coins que quatre cases de chemin se partagent (même
// hauteur) ; une case large où arrive un chemin d'une case trace aussi le bout qui les relie. Les gués (k) comptent
// comme chemin pour les raccords
const MASK_DIRS = [[0, -1, 1], [1, 0, 2], [0, 1, 4], [-1, 0, 8]];

export function pathDraws(M, x, y) {
  const isPath = (a, b) => 'pk'.includes(M.ground(a, b));
  const top = M.surface(x, y);
  const corner = (a, b) => [[a, b], [a + 1, b], [a, b + 1], [a + 1, b + 1]].every(([u, v]) => M.ground(u, v) === 'p' && M.surface(u, v) === top);
  const wideAt = (a, b) => corner(a, b) || corner(a - 1, b) || corner(a, b - 1) || corner(a - 1, b - 1);
  const maskOf = is => MASK_DIRS.reduce((m, [dx, dy, bit]) => (is(dx, dy) ? m | bit : m), 0);
  const alt = (a, b) => rnd(a, b, 40) < 0.5;
  // (une case pavée : le pavé pour tous ses dessins ; serve.js, M.isPaved)
  const pave = pavedAt(M, x, y);
  if (!wideAt(x, y)) return { clip: false, draws: [{ file: pathFile(maskOf((dx, dy) => isPath(x + dx, y + dy)), alt(x, y), pave), dx: 0, dy: 0 }] };
  const draws = [];
  // Les coins de cette case où passe le chemin du milieu : centre du coin (x + i − ½, y + j − ½)
  for (const [i, j] of [[0, 0], [1, 0], [0, 1], [1, 1]]) {
    const a = x + i - 1, b = y + j - 1;
    if (!corner(a, b)) continue;
    const mask = maskOf((dx, dy) => corner(a + dx, b + dy));
    draws.push({ file: pathFile(mask, alt(a, b), pave), dx: ((i - j) * TW) / 2, dy: ((i + j - 1) * TH) / 2 });
  }
  // Un chemin d'une case qui arrive ici : le bout jusqu'au chemin du milieu (vers la voisine large d'à côté)
  const narrow = MASK_DIRS.filter(([dx, dy]) => isPath(x + dx, y + dy) && !wideAt(x + dx, y + dy));
  if (narrow.length) {
    const across = MASK_DIRS.filter(([dx, dy]) => narrow.some(n => n[0] !== dx && n[1] !== dy) && wideAt(x + dx, y + dy)).slice(0, 1);
    const mask = [...narrow, ...across].reduce((m, [, , bit]) => m | bit, 0);
    draws.push({ file: pathFile(mask, alt(x, y), pave), dx: 0, dy: 0 });
  }
  return { clip: true, draws };
}

// Une case de chemin pavée ? (la carte du jeu : serve.js, M.isPaved, d'après state.roads.paved ; le pavé : choix de
// l'auteur, 16 oct.)
export const pavedAt = (M, x, y) => Boolean(M.isPaved && M.isPaved(x, y));

// Le raccord d'une case de chemin vers ses voisines (masque : NE 1, SE 2, SO 4, NO 8), et l'herbe où il est peint
// (le creusement d'un chemin qu'on vient de tracer : roads.js)
export const pathMask = (M, x, y) => MASK_DIRS.reduce((m, [dx, dy, bit]) => ('pk'.includes(M.ground(x + dx, y + dy)) ? m | bit : m), 0);

export const pathGrass = (M, x, y) => topColor('g', M.height(x, y), (x + y) % 2);

// Peint les chemins d'une case dans son herbe (grass) ; faux si une image n'est pas encore prête (rien n'est peint)
function paintPath(ctx, M, x, y, c, grass) {
  const { clip, draws } = pathDraws(M, x, y);
  const imgs = draws.map(d => pathImage(d.file, grass));
  if (imgs.some(img => !img)) return false;
  ctx.save();
  if (clip) {
    diamond(ctx, c.x, c.y);
    ctx.clip();
  }
  draws.forEach((d, i) => ctx.drawImage(imgs[i], c.x + d.dx - TW / 2, c.y + d.dy - TH / 2, TW, TH));
  ctx.restore();
  return true;
}

export { paintPath };
