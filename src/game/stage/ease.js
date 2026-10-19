// Les courbes des mouvements de la scène (t de 0 à 1) : celles des moteurs de jeu, pour que rien ne bouge en ligne droite
export const clamp01 = t => (t < 0 ? 0 : t > 1 ? 1 : t);
export const outCubic = t => 1 - (1 - t) ** 3;
export const inCubic = t => t * t * t;
// Dépasse un peu sa cible, puis revient (un objet qui se pose avec élan)
export const outBack = (t, s = 1.70158) => 1 + (s + 1) * (t - 1) ** 3 + s * (t - 1) ** 2;
// Rebondit sur sa cible (une tuile qui tombe)
export function outBounce(t) {
  const n = 7.5625, d = 2.75;
  if (t < 1 / d) return n * t * t;
  if (t < 2 / d) return n * (t -= 1.5 / d) * t + 0.75;
  if (t < 2.5 / d) return n * (t -= 2.25 / d) * t + 0.9375;
  return n * (t -= 2.625 / d) * t + 0.984375;
}
// Un ressort amorti (une étiquette qui claque à l'écran)
export const outElastic = t => (t === 0 || t === 1 ? t : 2 ** (-10 * t) * Math.sin((t * 10 - 0.75) * (2 * Math.PI / 3)) + 1);
export const lerp = (a, b, t) => a + (b - a) * t;
