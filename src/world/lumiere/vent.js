// Le vent sur l'herbe (choix de l'auteur, 12 oct. : « fais vivre ») : de temps en temps, une vague de lumière très douce
// passe sur l'herbe dans le sens du vent, comme quand il couche les brins. Dessinée dans le monde, sur le sol (sous ce
// qui s'y tient), et seulement dans l'herbe : une lueur n'est posée qu'au milieu d'une herbe dont les quatre voisines
// sont aussi de l'herbe à la même hauteur (elle ne déborde ni sur l'eau, ni sur un chemin, ni par-dessus une falaise).
// Ni la nuit, ni sous la pluie, ni vue de loin, ni en mouvement réduit (draw/loop.js). Calculs purs (le masque de
// l'herbe : une fois par carte, la carte d'une île ne change pas), dessin Canvas 2D en unités du monde.
import { TW, TH, HS, worldOf } from '../terrain';
import { lueur } from '@/utils/vfx';

// Les sols d'herbe (prairie, fleurs, forêt claire)
const HERB = new Set(['g', 't', 'm', 'f']);
// La teinte de la vague : un blanc de soleil, à peine doré
const SHEEN = '255,250,214';

// Les cases où une vague peut se poser : 1 au milieu d'une herbe (Uint8Array, une case par octet)
const masks = new WeakMap();
export function herbMask(M) {
  let mask = masks.get(M);
  if (mask) return mask;
  const n = M.n;
  mask = new Uint8Array(n * n);
  const herb = (x, y) => M.land(x, y) && HERB.has(M.ground(x, y));
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      if (!herb(x, y)) continue;
      const top = M.surface(x, y);
      mask[y * n + x] = [[1, 0], [-1, 0], [0, 1], [0, -1]].every(([dx, dy]) => herb(x + dx, y + dy) && Math.abs(M.surface(x + dx, y + dy) - top) < 0.01) ? 1 : 0;
    }
  }
  masks.set(M, mask);
  return mask;
}

// La vague en une case (x, y) à l'instant t (s), de 0 à 1 : des bandes étroites qui avancent vers la droite de l'écran,
// plus ou moins fortes selon des rafales qui dérivent lentement
export function sheenAt(x, y, t) {
  const band = Math.sin((x - y) * 0.42 - t * 1.1);
  if (band <= 0) return 0;
  const gust = 0.5 + 0.5 * Math.sin(x * 0.13 + y * 0.07 + t * 0.23) * Math.sin(y * 0.11 - x * 0.05 - t * 0.17);
  return band ** 8 * gust;
}

// Les vagues à l'écran (view : le rectangle du monde) ; k : leur force (le jour, le beau temps) ; shown(x, y) : 0 où
// rien ne doit briller (un quartier pas encore à soi : draw/air.js, lightGate)
export function drawSheen(ctx, M, view, t, k, shown) {
  if (k < 0.01) return;
  const mask = herbMask(M), n = M.n;
  // (les cases sous le rectangle de l'écran, relief compris : une case haute se dessine plus haut que sa place)
  const grid = (wx, wy) => [wy / TH + wx / TW, wy / TH - wx / TW];
  const pts = [grid(view.x, view.y), grid(view.x + view.w, view.y), grid(view.x, view.y + view.h + 6 * HS), grid(view.x + view.w, view.y + view.h + 6 * HS)];
  const x0 = Math.max(0, Math.floor(Math.min(...pts.map(p => p[0]))) - 2), x1 = Math.min(n - 1, Math.ceil(Math.max(...pts.map(p => p[0]))) + 2);
  const y0 = Math.max(0, Math.floor(Math.min(...pts.map(p => p[1]))) - 2), y1 = Math.min(n - 1, Math.ceil(Math.max(...pts.map(p => p[1]))) + 2);
  const img = lueur(SHEEN);
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  // (une case sur deux, en quinconce : chaque lueur couvre ses voisines, les vagues restent continues)
  for (let y = y0; y <= y1; y += 2) {
    for (let x = x0 + ((y >> 1) & 1); x <= x1; x += 2) {
      if (!mask[y * n + x]) continue;
      const v = sheenAt(x, y, t);
      if (v < 0.04) continue;
      const a = v * k * shown(x, y);
      if (a < 0.01) continue;
      const c = worldOf(x, y, M.surface(x, y));
      ctx.globalAlpha = a;
      ctx.drawImage(img, c.x - TW * 1.3, c.y - TH * 1.1, TW * 2.6, TH * 2.2);
    }
  }
  ctx.restore();
}
