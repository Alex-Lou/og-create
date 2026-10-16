// Sous les pas des habitants : quand quelqu'un marche, le sol répond. Sable : une bouffée claire ; chemin de terre : une
// poussière brune ; sol mouillé (après la pluie) : de petites éclaboussures ; herbe et prairie sèches : rien. Fonctions
// pures (draw/pas.js dessine).

// Un pas tous les tiers de seconde (la marche dessinée : 4 images à 6 par seconde, un pied posé toutes les 2 images) ;
// ce qu'il soulève vit tant de secondes
const PAS_PAR_S = 3;
const VIE_S = 0.55;

// Ce que soulève un pas sur ce sol (sa lettre : terrain.js) quand l'île est mouillée de tant (0 à 1) : 'sable', 'terre',
// 'eau', ou null
export function solDePas(g, wet = 0) {
  const sable = g === 's' || g === 'd', terre = g === 'p' || g === 'k', herbe = g === 'g' || g === 'm';
  if (wet > 0.35 && (sable || terre)) return 'eau';
  if (wet > 0.6 && herbe) return 'eau';
  if (sable) return 'sable';
  if (terre) return 'terre';
  return null;
}

// Les pas encore visibles à l'instant t (secondes) : [{ age : 0 à 1, cote : -1 pied gauche, 1 pied droit }] ; seed :
// propre à chacun, pour que deux marcheurs ne posent pas le pied ensemble
export function pasOf(t, seed = 0) {
  const out = [];
  const i = Math.floor(t * PAS_PAR_S + seed);
  for (let j = 0; j < Math.ceil(VIE_S * PAS_PAR_S) + 1; j++) {
    const n = i - j;
    const age = (t - (n - seed) / PAS_PAR_S) / VIE_S;
    if (age >= 0 && age < 1) out.push({ age, cote: n % 2 ? 1 : -1 });
  }
  return out;
}

// Les teintes de ce qui se soulève : plus claires que le sol (une poussière se lit par sa clarté)
export const TEINTES = { sable: '255,248,228', terre: '242,228,198', eau: '214,232,246' };

// Ce que soulève un pas d'âge age : des bouffées [{ dx, dy, r, a }] (unités du monde, autour du pied) ; l'eau, des
// gouttes qui sautent et retombent
export function bouffeesOf(sol, age, cote) {
  const out = [];
  const fin = 1 - age;
  if (sol === 'eau') {
    for (let k = 0; k < 3; k++) {
      const dir = (k - 1) * 0.9 + cote * 0.3;
      out.push({ dx: cote * 2.5 + dir * age * 7, dy: -Math.sin(age * Math.PI) * (4 + k), r: 0.9, a: 0.75 * fin });
    }
    // (et un petit rond dans le mouillé)
    out.push({ dx: cote * 2.5, dy: 0.5, r: 2 + age * 5, a: 0.35 * fin, rond: true });
    return out;
  }
  const n = sol === 'sable' ? 3 : 2;
  for (let k = 0; k < n; k++) {
    const side = k - (n - 1) / 2;
    out.push({ dx: cote * 2.5 + side * (2 + age * 5), dy: -age * (4 + k), r: 1.6 + age * 4.5, a: (sol === 'sable' ? 0.6 : 0.55) * fin * Math.min(1, age * 5) });
  }
  return out;
}
