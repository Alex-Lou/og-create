// Double page du Livre (grand écran) : la double page s montre la page 2s − 1 à gauche et la page 2s à droite.
// À gauche de la première, la page −1 est la garde (le revers de la couverture) ; une page paire est toujours
// à droite, une impaire toujours à gauche (sa peinture tient compte de la reliure, du bon côté).
export const spreadOf = index => Math.floor((index + 1) / 2);
export const pagesOf = spread => ({ left: 2 * spread - 1, right: 2 * spread });
export const sideOf = index => (index % 2 === 0 ? 'right' : 'left');
export const spreadCount = count => spreadOf(count - 1) + 1;

// Zones d'une page (en u, la page fait 100 u de large) ramenées sur la double page, 200 u de large :
// x et w deviennent des pourcentages de la double page ; y ne change pas (même hauteur). L'identifiant
// porte le côté, pour rester unique sur la double page.
export function spreadSpots(spots, side) {
  const offset = side === 'right' ? 50 : 0;
  return spots.map(spot => ({ ...spot, id: `${side}:${spot.id}`, side, x: offset + spot.x / 2, w: spot.w / 2 }));
}
