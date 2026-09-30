// Sceau vivant : géométrie déterministe calculée depuis la progression du joueur.
// Une branche par famille entamée (longueur = part découverte), des ramifications par palier,
// une pointe dorée quand la famille est complète, un anneau par palier de succès.
// Rien n'est stocké : le même état redonne toujours le même sceau.

const C = 240; // centre du repère 480 × 480
const R0 = 38; // rayon du cœur
const REACH = 150; // longueur maximale d'une branche
const TWIG_STEPS = [0.35, 0.6, 0.82];

const f = x => x.toFixed(1);
const circle = (x, y, r) => `M${f(x - r)} ${f(y)}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`;

/**
 * @param {number[]} shares part découverte (0..1) de chaque famille, dans un ordre stable
 * @param {number} rings nombre d'anneaux (paliers de succès)
 */
export function sigilPaths(shares, rings = 0) {
  const started = shares.filter(share => share > 0);
  const n = Math.max(3, started.length);
  const values = [...started, ...Array(n - started.length).fill(0)];
  let branches = '';
  let twigs = '';
  let tips = '';
  let gold = '';
  let web = '';
  let core = '';
  const ends = [];

  values.forEach((share, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    const cos = Math.cos(a);
    const sin = Math.sin(a);
    const length = 22 + share * REACH;
    const [x0, y0] = [C + R0 * cos, C + R0 * sin];
    const [x1, y1] = [C + (R0 + length) * cos, C + (R0 + length) * sin];
    branches += `M${f(x0)} ${f(y0)}L${f(x1)} ${f(y1)}`;
    TWIG_STEPS.forEach((step, k) => {
      if (share < step) return;
      const bx = C + (R0 + length * step) * cos;
      const by = C + (R0 + length * step) * sin;
      const twig = length * (0.32 - k * 0.07);
      [-1, 1].forEach(side => {
        const b = a + side * 0.55;
        const tx = bx + twig * Math.cos(b);
        const ty = by + twig * Math.sin(b);
        twigs += `M${f(bx)} ${f(by)}L${f(tx)} ${f(ty)}`;
        tips += circle(tx, ty, 2);
      });
    });
    if (share >= 1) gold += circle(x1, y1, 6);
    else tips += circle(x1, y1, 4);
    ends.push([x1, y1]);
    core += `${i ? 'L' : 'M'}${f(C + R0 * cos)} ${f(C + R0 * sin)}`;
  });

  ends.forEach(([ax, ay], i) => {
    const [bx, by] = ends[(i + 2) % n];
    web += `M${f(ax)} ${f(ay)}L${f(bx)} ${f(by)}`;
  });

  let ringPath = '';
  for (let k = 0; k < rings; k++) ringPath += circle(C, C, 206 + k * 9);

  return { branches, twigs, tips, gold, web, core: `${core}Z`, rings: ringPath, halo: circle(C, C, 212 + rings * 9) };
}

// Un anneau par palier de 5 succès débloqués, 4 au plus
export function ringsFor(unlockedAchievements) {
  return Math.min(4, Math.floor(unlockedAchievements / 5));
}
