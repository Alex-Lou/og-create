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
const forceAt = (x, y, t) => 0.5 + 0.5 * Math.sin(x * 0.13 + y * 0.07 + t * 0.23) * Math.sin(y * 0.11 - x * 0.05 - t * 0.17);
export function sheenAt(x, y, t) {
  const band = Math.sin((x - y) * 0.42 - t * 1.1);
  if (band <= 0) return 0;
  return band ** 8 * forceAt(x, y, t);
}

// Le vent dans l'île (choix de l'auteur, 14 oct. : « le vent dans l'île ») : la même rafale que la lueur sur l'herbe,
// plus large, qui couche les arbres et les plantes à son passage (vers la droite de l'écran) ; 0 à 1
export function gustAt(x, y, t) {
  const band = Math.sin((x - y) * 0.42 - t * 1.1);
  if (band <= 0) return 0;
  return band ** 3 * (0.35 + 0.65 * forceAt(x, y, t));
}
// La force du vent selon le temps : il forcit sous la pluie, plus encore dans l'orage (au plus le double)
export const windStrength = weather => Math.min(2, 1 + 0.5 * ((weather && weather.rain) || 0) + 1.1 * ((weather && weather.storm) || 0));

// Les feuilles qu'une rafale arrache à un arbre (de près seulement) : quelques-unes, chacune née au passage d'une
// rafale, qui file avec le vent en tombant et en tournoyant. (wx, wy) : le pied de l'arbre dans le monde, (x, y) sa
// case, t le temps, h la hauteur de sa ramure ; [{ x, y, a, rot, tone }] en unités du monde. Rien entre deux rafales
const LEAF_LIFE = 2.6;
export function leavesOf(wx, wy, x, y, t, h = 46, count = 4) {
  const out = [];
  for (let i = 0; i < count; i++) {
    const seed = x * 12.9898 + y * 78.233 + i * 37.719;
    const r = v => { const s = Math.sin(seed * (v + 1)) * 43758.5453; return s - Math.floor(s); };
    const clock = t / LEAF_LIFE + r(1);
    const age = clock - Math.floor(clock);
    // (une feuille ne part que si la rafale soufflait fort quand elle est née)
    const born = t - age * LEAF_LIFE;
    const push = gustAt(x, y, born);
    if (push < 0.35) continue;
    const run = (26 + 18 * r(2)) * age * (0.6 + push);
    const fall = (h * 0.8) * age * age + Math.sin(age * Math.PI * 3 + r(3) * 6) * 3;
    const a = Math.min(1, push * 1.4) * Math.min(1, age * 6) * (1 - Math.max(0, (age - 0.7) / 0.3));
    out.push({ x: wx + (r(4) - 0.5) * 22 + run, y: wy - h + (r(5) - 0.3) * 12 + fall, a, rot: age * 9 + r(6) * 6, tone: r(7) });
  }
  return out;
}
// Les feuillus (les sapins et les palmiers gardent les leurs) ; ce qui s'en envole suit la saison des arbres
// (world/plants.js : fleuris au printemps, verts en été, roux en automne, nus en hiver) : des pétales, des feuilles
// vertes, des feuilles rousses et dorées, rien
export const LEAFY = new Set(['tree', 'apple', 'autumn', 'birch']);
const LEAF_TONES = { printemps: ['#F8C8D8', '#FFF4F6'], ete: ['#7CB24A', '#9CC860'], automne: ['#E2683A', '#F2A03D'], hiver: null };
export const leafTones = season => LEAF_TONES[season] || null;
// Les feuilles d'un arbre, dans la transformation du monde
export function drawLeaves(ctx, season, leaves) {
  const tones = leafTones(season);
  if (!tones || !leaves.length) return;
  ctx.save();
  for (const l of leaves) {
    ctx.globalAlpha = l.a;
    ctx.fillStyle = l.tone < 0.5 ? tones[0] : tones[1];
    ctx.beginPath();
    ctx.ellipse(l.x, l.y, 3.4, 1.7, l.rot, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(60,40,25,.55)';
    ctx.lineWidth = 0.5;
    ctx.stroke();
  }
  ctx.restore();
}

// Les vagues à l'écran (view : le rectangle du monde) ; k : leur force (le jour, le beau temps) ; shown(x, y) : 0 où
// rien ne doit briller (un quartier pas encore à soi : draw/air.js, lightGate)
// Les cases sous le rectangle de la vue (île de n × n cases), relief compris : une case haute se dessine plus haut que
// sa place ; { x0, x1, y0, y1 } (bornes comprises)
export function casesVues(view, n) {
  const grid = (wx, wy) => [wy / TH + wx / TW, wy / TH - wx / TW];
  const pts = [grid(view.x, view.y), grid(view.x + view.w, view.y), grid(view.x, view.y + view.h + 6 * HS), grid(view.x + view.w, view.y + view.h + 6 * HS)];
  return {
    x0: Math.max(0, Math.floor(Math.min(...pts.map(p => p[0]))) - 2), x1: Math.min(n - 1, Math.ceil(Math.max(...pts.map(p => p[0]))) + 2),
    y0: Math.max(0, Math.floor(Math.min(...pts.map(p => p[1]))) - 2), y1: Math.min(n - 1, Math.ceil(Math.max(...pts.map(p => p[1]))) + 2)
  };
}

export function drawSheen(ctx, M, view, t, k, shown) {
  if (k < 0.01) return;
  const mask = herbMask(M), n = M.n;
  const { x0, x1, y0, y1 } = casesVues(view, n);
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
