// Typographie française : espace insécable après « et avant », ?, !, : et ; (le signe ne part jamais seul à la ligne)
export function frenchSpaces(text) {
  return String(text ?? '')
    .replace(/«\s+/g, '« ')
    .replace(/\s+([»?!:;])/g, ' $1');
}
