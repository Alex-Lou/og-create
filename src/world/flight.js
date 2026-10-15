// Le vol de la caméra du conseil (l'arc du Phare, choix de l'auteur, 15 oct. : ecriture/arc_phare.md § 3, point 6) :
// d'un seul mouvement, une courbe douce par des points du monde (Catmull-Rom), lente au départ et à l'arrivée. Pur.

// Le point de la courbe qui passe par pts ([{ x, y }], deux au moins) à la fraction u (0 à 1) du vol
export function along(pts, u) {
  const n = pts.length - 1;
  if (n < 1) return { ...pts[0] };
  const t = Math.max(0, Math.min(1, u)) * n;
  const i = Math.min(n - 1, Math.floor(t));
  const k = t - i;
  const p = j => pts[Math.max(0, Math.min(n, j))];
  const [a, b, c, d] = [p(i - 1), p(i), p(i + 1), p(i + 2)];
  const spline = key => 0.5 * ((2 * b[key]) + (-a[key] + c[key]) * k + (2 * a[key] - 5 * b[key] + 4 * c[key] - d[key]) * k * k + (-a[key] + 3 * b[key] - 3 * c[key] + d[key]) * k * k * k);
  return { x: spline('x'), y: spline('y') };
}

// Doux au départ, doux à l'arrivée (0 à 1)
export const ease = k => (k < 0.5 ? 4 * k * k * k : 1 - (-2 * k + 2) ** 3 / 2);

// Le trajet adouci : les points du milieu tirés de k vers la ligne droite du premier au dernier (l'ordre reste ; la
// caméra frôle chaque quartier au lieu de zigzaguer de l'un à l'autre)
export function softPath(pts, k = 0.5) {
  if (pts.length < 3) return pts.map(p => ({ ...p }));
  const a = pts[0];
  const b = pts[pts.length - 1];
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len2 = dx * dx + dy * dy || 1;
  return pts.map((p, i) => {
    if (i === 0 || i === pts.length - 1) return { ...p };
    const t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / len2));
    const on = { x: a.x + dx * t, y: a.y + dy * t };
    return { x: p.x + (on.x - p.x) * k, y: p.y + (on.y - p.y) * k };
  });
}
