// Gravures du Cabinet : cadres (anneau extérieur du sceau) et emblèmes (cœur du sceau).
// Repère 480 × 480 centré en (240, 240), comme utils/sigil.js. Le corps vivant du sceau occupe
// le disque de rayon ~196 (réduit par GSigil) ; un cadre vit entre 200 et 238, un emblème sous 30
// (agrandi de EMBLEM_SCALE au rendu, il remplace le cœur d'or).
// Les clés sont les `image_path` des objets en base (noms, prix et déblocage restent côté serveur).
// Chaque gravure est une liste de traits : { d, w (épaisseur), o (opacité), gold, fill }.

const C = 240;
const f = x => x.toFixed(1);
const polar = (r, a) => [C + r * Math.cos(a), C + r * Math.sin(a)];
const circle = (r, x = C, y = C) => `M${f(x - r)} ${f(y)}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`;
const angles = (n, offset = -Math.PI / 2) => Array.from({ length: n }, (_, i) => offset + (i * 2 * Math.PI) / n);
const polygon = points => points.map(([x, y], i) => `${i ? 'L' : 'M'}${f(x)} ${f(y)}`).join('') + 'Z';

// Traits radiaux de r1 à r2
function ticks(n, r1, r2, offset) {
  return angles(n, offset).map(a => {
    const [x1, y1] = polar(r1, a);
    const [x2, y2] = polar(r2, a);
    return `M${f(x1)} ${f(y1)}L${f(x2)} ${f(y2)}`;
  }).join('');
}

// Petits disques répartis sur un cercle
function beads(n, r, size, offset) {
  return angles(n, offset).map(a => circle(size, ...polar(r, a))).join('');
}

// Un motif local (traits en coordonnées x tangent, y radial) posé et tourné sur le cercle
function placed(n, r, motif, offset) {
  return angles(n, offset).map((a, i) => {
    const cos = Math.cos(a);
    const sin = Math.sin(a);
    const [cx, cy] = polar(r, a);
    // x suit la tangente, y pointe vers l'extérieur
    const at = (x, y) => [cx - x * sin + y * cos, cy + x * cos + y * sin];
    return motif(i).map(stroke => stroke.map(([x, y], k) => {
      const [px, py] = at(x, y);
      return `${k ? 'L' : 'M'}${f(px)} ${f(py)}`;
    }).join('')).join('');
  }).join('');
}

// Étoile à branches : n pointes, rayons extérieur / intérieur
function star(n, outer, inner, x = C, y = C, offset = -Math.PI / 2) {
  const points = [];
  for (let i = 0; i < n * 2; i++) {
    const a = offset + (i * Math.PI) / n;
    const r = i % 2 ? inner : outer;
    points.push([x + r * Math.cos(a), y + r * Math.sin(a)]);
  }
  return polygon(points);
}

// Runes du cadre mystique : six signes gravés, répétés
const RUNES = [
  [[[0, -7], [0, 7]], [[0, -2], [5, -7]]],
  [[[-3, -7], [-3, 7]], [[-3, -7], [4, -1]], [[4, -1], [-3, 4]]],
  [[[0, -7], [0, 7]], [[-5, -3], [5, 3]]],
  [[[-4, 7], [0, -7], [4, 7]], [[-2, 1], [2, 1]]],
  [[[-4, -7], [4, 7]], [[4, -7], [-4, 7]]],
  [[[0, -7], [0, 7]], [[0, -7], [5, -3]], [[0, 0], [5, 4]]]
];

// Couronne de ronces : tige ondulante, feuilles alternées, épines
function vine() {
  const waves = 18;
  const steps = 360;
  let stem = '';
  for (let i = 0; i <= steps; i++) {
    const a = -Math.PI / 2 + (i / steps) * 2 * Math.PI;
    const r = 222 + 7 * Math.sin(a * waves);
    const [x, y] = polar(r, a);
    stem += `${i ? 'L' : 'M'}${f(x)} ${f(y)}`;
  }
  const leaf = i => {
    const side = i % 2 ? 1 : -1;
    return [[[0, 0], [-4, side * 6], [0, side * 13], [4, side * 6], [0, 0]], [[0, 0], [0, side * 10]]];
  };
  const thorn = () => [[[-2, 0], [0, -6], [2, 0]]];
  return { stem, leaves: placed(waves, 222, leaf, -Math.PI / 2 + Math.PI / (2 * waves)), thorns: placed(waves, 214, thorn, -Math.PI / 2) };
}

// Rouages : couronne dentée et boulons
function gear() {
  const teeth = 40;
  const points = [];
  angles(teeth).forEach(a => {
    const half = Math.PI / teeth;
    [[220, a - half], [220, a - half * 0.55], [234, a - half * 0.4], [234, a + half * 0.4], [220, a + half * 0.55]]
      .forEach(([r, b]) => points.push(polar(r, b)));
  });
  return polygon(points);
}

// Ouroboros : le serpent fait le tour et se mord la queue (tête en haut)
function serpent() {
  // La queue part juste sous la tête
  const start = -Math.PI / 2 + 0.05;
  const end = -Math.PI / 2 + 2 * Math.PI - 0.07;
  // Le corps s'affine vers la queue
  let outer = '';
  let inner = '';
  const steps = 240;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const a = start + t * (end - start);
    const width = 3 + 6 * Math.min(1, t * 1.6);
    const [ox, oy] = polar(226 + width, a);
    const [ix, iy] = polar(226 - width, a);
    outer += `${i ? 'L' : 'M'}${f(ox)} ${f(oy)}`;
    inner += `${i ? 'L' : 'M'}${f(ix)} ${f(iy)}`;
  }
  const scale = () => [[[-3, -3], [0, 2], [3, -3]]];
  const [hx, hy] = polar(226, end + 0.03);
  return {
    body: outer + inner,
    scales: placed(48, 226, scale, start + 0.12),
    head: circle(11, hx, hy),
    eye: circle(2.6, ...polar(229, end + 0.05))
  };
}

const vineArt = vine();
const serpentArt = serpent();

export const FRAME_ART = {
  // Cadre basique : un filet simple
  'basicCadre.png': [{ d: circle(222), w: 1.5, o: 0.55 }],
  // Cadre argenté : double filet gradué
  'silverFrame.png': [
    { d: circle(212) + circle(232), w: 1.2, o: 0.75 },
    { d: ticks(72, 216, 224), w: 1, o: 0.55 },
    { d: ticks(12, 214, 230), w: 1.4, o: 0.9 }
  ],
  // Cadre doré : filet d'or perlé
  'goldFrame.png': [
    { d: circle(214), w: 1, o: 0.6, gold: true },
    { d: circle(225), w: 2.6, gold: true },
    { d: beads(24, 234, 2.8), fill: true, gold: true }
  ],
  // Cadre mystique : douze runes entre deux filets
  'customCadre1.png': [
    { d: circle(209) + circle(237), w: 1, o: 0.6 },
    { d: placed(12, 223, i => RUNES[i % RUNES.length]), w: 1.6, o: 0.95 }
  ],
  // Orbe céleste : orbite pointillée, étoiles et une planète d'or
  orbe: [
    { d: circle(222), w: 1, o: 0.55 },
    { d: beads(90, 233, 0.9), fill: true, o: 0.6 },
    { d: angles(8).map(a => star(4, 9, 2.4, ...polar(222, a))).join(''), fill: true, o: 0.9 },
    { d: circle(6, ...polar(233, -Math.PI / 6)), fill: true, gold: true }
  ],
  // Couronne de ronces : tige, feuilles et épines
  ronces: [
    { d: vineArt.stem, w: 1.4, o: 0.85 },
    { d: vineArt.leaves, w: 1.1, o: 0.8 },
    { d: vineArt.thorns, w: 1, o: 0.55 }
  ],
  // Rouages : couronne dentée boulonnée
  rouages: [
    { d: gear(), w: 1.4, o: 0.85 },
    { d: circle(210), w: 1, o: 0.5 },
    { d: beads(8, 215, 2.6, -Math.PI / 2 + Math.PI / 8), fill: true, gold: true }
  ],
  // Ouroboros : le serpent qui se mord la queue
  ouroboros: [
    { d: serpentArt.body, w: 1.3, gold: true },
    { d: serpentArt.scales, w: 1, o: 0.7, gold: true },
    { d: serpentArt.head, w: 1.6, gold: true },
    { d: serpentArt.eye, fill: true }
  ]
};

export const EMBLEM_ART = {
  // Pièce : le cœur d'or d'origine
  'coin.png': [
    { d: circle(16), w: 1.2, o: 0.6, gold: true },
    { d: circle(7), fill: true, gold: true }
  ],
  // Goutte d'eau : triangle de l'Eau
  'waterAvatar.png': [{ d: polygon([[C - 22, C - 13], [C + 22, C - 13], [C, C + 25]]), w: 2.2, gold: true }],
  // Flamme : triangle du Feu
  'fireAvatar.png': [{ d: polygon([[C - 22, C + 13], [C + 22, C + 13], [C, C - 25]]), w: 2.2, gold: true }],
  // Nuage : triangle barré de l'Air
  'cloudy.png': [
    { d: polygon([[C - 22, C + 13], [C + 22, C + 13], [C, C - 25]]), w: 2.2, gold: true },
    { d: `M${C - 26} ${C}L${C + 26} ${C}`, w: 2, gold: true }
  ],
  // Lune : croissant
  'moon.png': [{ d: `M${C + 8} ${C - 22.6}A24 24 0 1 0 ${C + 8} ${C + 22.6}A26 26 0 0 1 ${C + 8} ${C - 22.6}Z`, fill: true, gold: true }],
  // Soleil d'or : disque pointé, douze rayons
  soleil: [
    { d: circle(13), w: 2, gold: true },
    { d: circle(3.5), fill: true, gold: true },
    { d: ticks(12, 18, 28), w: 1.8, gold: true }
  ],
  // Arbre de vie : tronc, ramure et racines dans un cercle
  arbre: [
    { d: circle(28), w: 1.4, o: 0.7, gold: true },
    { d: `M${C} ${C + 24}L${C} ${C - 22}M${C} ${C - 6}L${C - 14} ${C - 18}M${C} ${C - 6}L${C + 14} ${C - 18}M${C} ${C + 4}L${C - 18} ${C - 6}M${C} ${C + 4}L${C + 18} ${C - 6}M${C} ${C + 18}L${C - 10} ${C + 26}M${C} ${C + 18}L${C + 10} ${C + 26}`, w: 1.8, gold: true }
  ],
  // Œil du Sage : paupières, iris, pupille d'or
  oeil: [
    { d: `M${C - 28} ${C}Q${C} ${C - 24} ${C + 28} ${C}Q${C} ${C + 24} ${C - 28} ${C}Z`, w: 1.8, gold: true },
    { d: circle(9), w: 1.4, gold: true },
    { d: circle(4), fill: true, gold: true }
  ],
  // Étoile septénaire : heptagramme {7/3}
  septenaire: [{
    d: polygon(Array.from({ length: 7 }, (_, i) => polar(28, -Math.PI / 2 + (i * 3 * 2 * Math.PI) / 7))),
    w: 1.6,
    gold: true
  }]
};

export const BODY_SCALE = 0.84;
export const EMBLEM_SCALE = 1.25;
// Vignette du Cabinet (emblème seul) : l'emblème remplit le cercle au lieu d'en occuper le cœur
export const BARE_EMBLEM_SCALE = 3.6;
export const DEFAULT_FRAME = 'basicCadre.png';
export const DEFAULT_EMBLEM = 'coin.png';
