// La composition de la jungle du départ (choix de l'auteur, 18 oct. : « c'est trop stickers collés sur la map, pas
// d'harmonie, pas de pose » ; le joueur doit voir que c'est dense et qu'il faudra défricher). Pas une plante tirée au
// hasard par case : un champ de densité, doux, dessine des massifs et des clairières ; il s'ouvre autour du camp et
// des lieux (une clairière taillée dans la jungle) et se referme en s'éloignant. Dans un massif, la silhouette
// s'étage : les grands arbres au cœur, les plantes moyennes autour, les basses en lisière ; les clairières restent à
// la mousse. Les verts dominent ; les couleurs vives sont rares et groupées, une famille par massif (héliconias,
// crotons, caladiums ou broméliacées), des orchidées au bord des clairières. Fixe pour une île donnée.

import { ZONES } from './zones';

// Bruit de valeur lissé (0 à 1), continu d'une case à l'autre
const rnd = (x, y, k) => { const v = Math.sin(x * 12.9898 + y * 78.233 + k * 37.719) * 43758.5453; return v - Math.floor(v); };
const smooth = t => t * t * (3 - 2 * t);
function vnoise(x, y, k) {
  const xi = Math.floor(x), yi = Math.floor(y), u = smooth(x - xi), v = smooth(y - yi);
  const a = rnd(xi, yi, k), b = rnd(xi + 1, yi, k), c = rnd(xi, yi + 1, k), d = rnd(xi + 1, yi + 1, k);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
const clamp01 = v => Math.max(0, Math.min(1, v));
const ramp = (a, b, v) => smooth(clamp01((v - a) / (b - a)));

// Le noyau (choix de l'auteur, 18 oct. : « juste garde le noyau central et densifie autour » ; un petit carré au
// bord de la plage, le joueur découvre la suite lui-même) : les deux premières zones de l'île à la plage, celle du Feu
// et celle de Lorena contre l'épave (world/zones.js, mêmes cases) ; tout autour, la jungle serrée, sous la brume tant
// qu'elle n'est pas découverte
const CORE_ZONES = ['plage', 'aster'];
export const CLEARINGS = ZONES.filter(z => CORE_ZONES.includes(z.id)).map(z => z.rect);
// (la distance d'une case au noyau, en cases : 0 dedans)
const outsideOf = (x, y, [rx, ry, w, h]) => Math.max(rx - x, x - (rx + w - 1), ry - y, y - (ry + h - 1), 0);
const outside = (x, y) => Math.min(...CLEARINGS.map(r => outsideOf(x, y, r)));
// La jungle couvre le cœur, et déborde autour du noyau sur BAND cases, quel que soit le quartier : le noyau est fermé
// de tous côtés ; plus loin, l'île garde sa flore
const BAND = 10;
export const inJungle = (x, y, coeur) => coeur || outside(x, y) <= BAND;

// L'épaisseur de la jungle en une case (0 : clairière, 1 : cœur d'un massif)
export function thicknessAt(x, y) {
  const d = outside(x, y);
  // (dans le noyau : la mousse ; au bord, une lisière basse qui adoucit le passage)
  if (d === 0) return outside(x - 1, y) + outside(x + 1, y) + outside(x, y - 1) + outside(x, y + 1) > 0 ? 0.3 : 0;
  const field = 0.62 * vnoise(x * 0.16 + 3, y * 0.16 + 11, 401) + 0.38 * vnoise(x * 0.42 + 7, y * 0.42 + 1, 402);
  // (dès le bord du noyau, serrée, des massifs plus hauts que d'autres, jamais de trouée ; elle s'éclaircit au bout de
  // la bande, où l'île reprend sa flore)
  return clamp01((0.6 + 0.2 * ramp(0.5, 2, d) + (field - 0.45) * 0.6) * (1 - 0.5 * ramp(BAND - 2, BAND + 2, d)));
}

// Les étages : [épaisseur à partir de laquelle il pousse, ce qui y pousse]
const CORE = 0.7, MID = 0.46, EDGE = 0.24;
// Les familles d'accent (une par massif) et les verts
const ACCENTS = ['heliconia', 'croton', 'caladium', 'bromelia'];
const TALL = ['banana', 'treefern'];

// Ce qui pousse sur une case de jungle : [{ kind, dx, dy }] (décalage en cases dans la case, du fond vers nous). Rien de
// bas ne pousse seul au milieu de la mousse (choix de l'auteur, 18 oct. : « les croissants, quand ils sont tous seuls,
// c'est pas génial ») : les crosses de fougère ne viennent qu'au pied des autres, dans les massifs ; en lisière, une
// plante basse ne pousse que collée à un massif ; les orchidées vont par touffes
export function jungleAt(x, y) {
  const t = thicknessAt(x, y);
  const r = rnd(x, y, 410), r2 = rnd(y, x, 411), r3 = rnd(x + 5, y, 412);
  const family = ACCENTS[Math.floor(vnoise(x * 0.11 + 40, y * 0.11 + 9, 403) * ACCENTS.length * 0.999)];
  // (des bosquets de bananiers et des bosquets de fougères, pas mélangés)
  const tall = TALL[vnoise(x * 0.2 + 17, y * 0.2 + 5, 404) < 0.5 ? 0 : 1];
  const mid = r2 < 0.28 ? family : 'monstera';
  const under = r3 < 0.32 ? family : 'fiddlehead';
  if (t >= CORE) {
    return [
      { kind: t > 0.9 && r < 0.22 ? 'kapok' : tall, dx: -0.12, dy: -0.14 },
      { kind: mid, dx: 0.24, dy: 0.16 },
      ...(r3 < 0.6 ? [{ kind: under, dx: -0.22, dy: 0.3 }] : [])
    ];
  }
  if (t >= MID) return [{ kind: r < 0.3 ? tall : mid, dx: 0, dy: -0.05 }, ...(r2 < 0.55 ? [{ kind: under, dx: 0.26, dy: 0.24 }] : [])];
  // (la lisière : collée à un massif, sa famille d'accent ou un monstera)
  const rim = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([a, b]) => thicknessAt(x + a, y + b) >= MID);
  if (t >= EDGE) return rim && r < 0.75 ? [{ kind: r2 < 0.45 ? family : 'monstera', dx: (r2 - 0.5) * 0.3, dy: (r3 - 0.5) * 0.3 }] : [];
  // (la clairière : de la mousse ; au bord, de rares touffes d'orchidées)
  return t > EDGE * 0.6 && r < 0.1 ? [{ kind: 'orchid', dx: -0.18, dy: -0.06 }, { kind: 'orchid', dx: 0.16, dy: 0.12 }, ...(r2 < 0.5 ? [{ kind: 'orchid', dx: -0.02, dy: 0.3 }] : [])] : [];
}

// La lueur de nuit d'une plante (0 à 1) : pas tout ne luit, sinon plus rien ne brille ; quelques massifs ont leur cœur
// lumineux, les autres restent dans l'ombre ; les fleurs vives gardent une lueur douce
const GREENS = new Set(['monstera', 'fiddlehead', 'banana', 'treefern', 'kapok']);
export function glowAt(kind, x, y) {
  const heart = ramp(0.5, 0.72, vnoise(x * 0.13 + 70, y * 0.13 + 20, 405));
  return Math.max(heart, GREENS.has(kind) ? 0 : 0.45) * (0.6 + 0.4 * rnd(x, y, 413));
}
