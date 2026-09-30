// Numéro de famille ou d'épreuve en chiffres romains (1 à 39)
const TENS = ['', 'X', 'XX', 'XXX'];
const UNITS = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'];

export function roman(value) {
  const n = Number(value);
  if (!Number.isInteger(n) || n < 1 || n > 39) return String(value ?? '');
  return TENS[Math.floor(n / 10)] + UNITS[n % 10];
}
