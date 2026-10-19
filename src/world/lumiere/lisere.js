// Le liseré vivant des personnages (papier néon, étape 5 ; choix de l'auteur, 18-19 oct. : « le souffle ») : chacun reçoit
// sur ses bords le liseré de la lumière qui domine là où il se tient, et ce liseré respire doucement. Le feu ou la
// lanterne la plus proche (orangé, il vacille avec la flamme), sinon la lune la nuit (cyan, de son côté : en haut à
// gauche, ombres.js : PLACE_LUNE), sinon le soleil bas de l'aube et du couchant (corail, de son côté : soleil.js) ; en
// plein jour, rien. Trois couleurs fixes : les liserés se gardent avec les images (heureDoree.js : rimImage).
//
// Il se dessine après le voile de la nuit, pour briller vraiment, sans passer devant ce qui cache le personnage : son
// liseré creuse d'abord la couche alpha de l'île là où il tombe (marquerLisere), et tout ce qui se dessine ensuite
// devant lui la rebouche ; avant le voile, ce qui reste creusé dit où il se voit encore (poserLiseres), et l'île est
// rebouchée telle qu'elle était ; après le voile, le liseré s'y ajoute en lumière (drawLiseres).
import { goldenOf, rimImage } from './heureDoree';
import { moonOf } from './ombres';

export const LISERE = { feu: '#FFB45A', lune: '#5CF2E6', soleil: '#FF8A7A' };
// La respiration (s), et l'éclat du liseré de son creux à son plein ; son éclat fixe en mouvement réduit
const SOUFFLE = 3.4;
const CREUX = 0.35;
const PLEIN = 0.9;
const FIXE = 0.62;
// La portée d'une lumière (en rayons de son halo, comme la carte de lumière : carte.js) ; la lune, même pleine, pèse moins
// qu'un feu tout proche ; sous ce seuil, pas de liseré
const PORTEE = 2.6;
// La bande du liseré d'un personnage (en part de son dessin : plus large que celle des bâtiments, il est plus petit)
const EPAISSEUR = 0.035;
const LUNE_FORCE = 0.55;
const SEUIL = 0.08;
// Le haut du corps d'un personnage, au-dessus de ses pieds (unités du monde) : c'est lui que la lumière vise
export const BUSTE = 18;

// La lune qui éclaire l'île (0 à 1) : la nuit, selon sa phase, voilée par les nuages
export const luneOf = (phase, date) => phase.night * (0.45 + 0.55 * moonOf(date).light) * (1 - 0.85 * (phase.weather.cover || 0));

// Le liseré d'un personnage : { color, side (du côté de son image : 1 à droite, -1 à gauche), k (son éclat, 0 à 1) },
// ou null. phase : le ciel ; lune : luneOf ; lumieres : les sources de l'image ({ x, y, r, k, color 'r,g,b' }) ; at :
// le haut de son corps, dans le monde ; flip : son image retournée ; t : le temps (s) ; still : mouvement réduit ;
// graine : sa respiration à lui (tous ne respirent pas ensemble)
export function lisereOf({ phase, lune = 0, lumieres = [], at, flip = false, t = 0, still = false, graine = 0 }) {
  let best = null;
  for (const l of lumieres) {
    if (!(l.k > 0.05)) continue;
    const d = Math.hypot(l.x - at.x, l.y - at.y);
    const s = l.k * Math.max(0, 1 - d / (l.r * PORTEE));
    if (!best || s > best.s) {
      // (une lumière froide, Brume ou un feu bleu, prend la couleur de la lune)
      const [r, , b] = String(l.color || '255,196,110').split(',').map(Number);
      best = { s, side: Math.sign(l.x - at.x) || 1, color: b > r + 20 ? LISERE.lune : LISERE.feu };
    }
  }
  if (lune * LUNE_FORCE > (best ? best.s : 0)) best = { s: lune * LUNE_FORCE, side: -1, color: LISERE.lune };
  const golden = goldenOf(phase);
  if (golden.k > (best ? best.s : 0)) best = { s: golden.k, side: golden.side, color: LISERE.soleil };
  if (!best || best.s < SEUIL) return null;
  const souffle = still ? FIXE : CREUX + (PLEIN - CREUX) * (0.5 - 0.5 * Math.cos((2 * Math.PI * t) / SOUFFLE + graine));
  // (dès qu'une lumière compte, le liseré se voit : il ne s'éteint pas à mi-chemin)
  return { color: best.color, side: flip ? -best.side : best.side, k: Math.min(1, 0.4 + best.s) * souffle };
}

// La respiration propre d'un personnage, d'après son identité (0 à 2π)
export function graineOf(id) {
  let h = 0;
  for (const ch of String(id)) h = (h * 31 + ch.charCodeAt(0)) % 9973;
  return (h / 9973) * Math.PI * 2;
}

// Juste après son dessin, dans sa transformation : son liseré creuse la couche alpha de l'île là où il tombe, et se
// note dans liste (img, box : son image et son cadre, celles qu'il vient de dessiner ; l : lisereOf). Rien si son
// liseré n'est pas encore fait (il viendra à une image suivante : heureDoree.js) ou s'il est à demi effacé
export function marquerLisere(ctx, img, box, l, liste) {
  if (ctx.globalAlpha < 0.99) return;
  const rim = rimImage(img, l.side, l.color, EPAISSEUR);
  if (!rim) return;
  ctx.save();
  ctx.globalCompositeOperation = 'destination-out';
  ctx.drawImage(rim, box.x, box.y, box.w, box.h);
  ctx.restore();
  liste.push({ img, rim, box, k: l.k, m: ctx.getTransform() });
}

// L'encre du trait des personnages : elle rebouche ce que le liseré a creusé au bord du dessin
const ENCRE = '#0A0418';
let couche = null;
// Avant le voile de la nuit : ce que les liserés de liste éclairent encore (leur lumière, là où l'île reste creusée) ;
// puis l'île rebouchée telle qu'elle était. { canvas, x, y } (pixels de l'appareil), ou null
export function poserLiseres(ctx, liste) {
  if (!liste.length) return null;
  const W = ctx.canvas.width, H = ctx.canvas.height;
  let x0 = W, y0 = H, x1 = 0, y1 = 0;
  for (const { box, m } of liste) {
    for (const [u, v] of [[box.x, box.y], [box.x + box.w, box.y], [box.x, box.y + box.h], [box.x + box.w, box.y + box.h]]) {
      const px = m.a * u + m.c * v + m.e, py = m.b * u + m.d * v + m.f;
      x0 = Math.min(x0, px); y0 = Math.min(y0, py); x1 = Math.max(x1, px); y1 = Math.max(y1, py);
    }
  }
  x0 = Math.max(0, Math.floor(x0)); y0 = Math.max(0, Math.floor(y0));
  x1 = Math.min(W, Math.ceil(x1)); y1 = Math.min(H, Math.ceil(y1));
  const w = x1 - x0, h = y1 - y0;
  if (w <= 0 || h <= 0) return null;
  if (!couche) couche = document.createElement('canvas');
  if (couche.width < w || couche.height < h) { couche.width = Math.max(couche.width, w); couche.height = Math.max(couche.height, h); }
  const g = couche.getContext('2d');
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.globalCompositeOperation = 'source-over';
  g.globalAlpha = 1;
  g.clearRect(0, 0, w, h);
  g.globalCompositeOperation = 'lighter';
  for (const { rim, box, k, m } of liste) {
    g.setTransform(m.a, m.b, m.c, m.d, m.e - x0, m.f - y0);
    g.globalAlpha = k;
    g.drawImage(rim, box.x, box.y, box.w, box.h);
  }
  // (là où quelque chose s'est dessiné devant, l'île n'est plus creusée : son liseré y disparaît)
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.globalAlpha = 1;
  g.globalCompositeOperation = 'destination-out';
  g.drawImage(ctx.canvas, x0, y0, w, h, 0, 0, w, h);
  // (puis l'île rebouchée : chaque dessin derrière lui-même, le reste à l'encre du trait)
  ctx.save();
  ctx.globalCompositeOperation = 'destination-over';
  for (const { img, box, m } of liste) {
    ctx.setTransform(m);
    ctx.drawImage(img, box.x, box.y, box.w, box.h);
  }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = ENCRE;
  ctx.fillRect(x0, y0, w, h);
  ctx.restore();
  return { canvas: couche, x: x0, y: y0, w, h };
}

// Après le voile : les liserés posés (poserLiseres) s'ajoutent en lumière à l'image
export function drawLiseres(ctx, pose) {
  if (!pose) return;
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalCompositeOperation = 'lighter';
  ctx.drawImage(pose.canvas, 0, 0, pose.w, pose.h, pose.x, pose.y, pose.w, pose.h);
  ctx.restore();
}
