// Petits formats d'affichage partagés par les écrans de l'Expédition

const ROMAN = [[10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];

// Numéro de carte en chiffres romains (1 → I, 12 → XII) ; au-delà de 39, le chiffre arabe
export function toRoman(value) {
  let n = Math.floor(Number(value) || 0);
  if (n <= 0 || n >= 40) return String(value ?? '');
  let out = '';
  ROMAN.forEach(([v, s]) => {
    while (n >= v) {
      out += s;
      n -= v;
    }
  });
  return out;
}
