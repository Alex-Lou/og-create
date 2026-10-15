// Les petits calculs que partagent les effets de l'île (lumière, météo, mer, climats, feux) : écrits une fois ici.

// v borné entre a et b (0 et 1 par défaut)
export const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
// Une montée douce de 0 à 1 (v borné entre 0 et 1, sans à-coup aux deux bouts)
export const lisse = v => { const k = clamp(v); return k * k * (3 - 2 * k); };
// La même montée douce, quand x va de a à b
export const entre = (a, b, x) => lisse((x - a) / (b - a));
// La part après la virgule (toujours entre 0 et 1, même pour un nombre négatif)
export const frac = v => v - Math.floor(v);
