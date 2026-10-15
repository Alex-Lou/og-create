// La nuit du conseil (choix de l'auteur, 15 oct.) : le conseil se tient la nuit, autour du feu ; le vol de la caméra
// qui le suit, du feu jusqu'au phare éteint (WorldView, phare.js : flyToLighthouse), garde cette nuit, quelle que soit
// l'heure du jeu. Au départ, l'île glisse vers la nuit ; après le retour au feu, elle revient à son heure. Les deux
// ciels se mêlent (on ne fait pas défiler les heures : un couchant clignoterait au passage).
import { mixHex } from '../iso';

// La nuit du vol : le même jour, à cette heure-là (pleine nuit pour tous les soleils du jeu)
const NUIT_H = 23;
const NUIT_MIN = 30;
export const nuitDe = date => new Date(date.getFullYear(), date.getMonth(), date.getDate(), NUIT_H, NUIT_MIN);

// Le fondu : vers la nuit au départ du vol, vers l'heure du jeu après le retour (ms)
const VERS_NUIT_MS = 900;
const VERS_JOUR_MS = 1400;

// La part de nuit à l'instant now ({ k, at } de l'image d'avant, ou null) : elle monte pendant le vol, redescend après ;
// d'un coup en mouvement réduit
export function nuitVolOf(prev, enVol, now, still = false) {
  const cible = enVol ? 1 : 0;
  if (still) return { k: cible, at: now };
  const k0 = prev ? prev.k : 0;
  const dt = prev ? Math.max(0, now - prev.at) : 0;
  const pas = dt / (enVol ? VERS_NUIT_MS : VERS_JOUR_MS);
  const k = cible > k0 ? Math.min(cible, k0 + pas) : Math.max(cible, k0 - pas);
  return { k, at: now };
}

// La courbe du fondu (douce aux deux bouts)
const doux = k => k * k * (3 - 2 * k);
const lerp = (a, b, k) => a + (b - a) * k;

// Deux ciels mêlés (sky.js : skyAt), a vers b de k (0 à 1) : teintes, mer, nuages, nuit, chaleur, lumières, soleil. Le
// temps qu'il fait reste celui de a (il pleut toujours s'il pleut) ; le moment et son nom, ceux du plus proche
export function mixPhase(a, b, k) {
  const m = doux(Math.min(1, Math.max(0, k)));
  if (m <= 0) return a;
  return {
    ...(m < 0.5 ? a : b),
    weather: a.weather,
    tint: mixHex(a.tint, b.tint, m),
    sea: [0, 1].map(i => mixHex(a.sea[i], b.sea[i], m)),
    cloud: mixHex(a.cloud, b.cloud, m),
    night: lerp(a.night, b.night, m),
    warm: lerp(a.warm, b.warm, m),
    lit: lerp(a.lit, b.lit, m),
    sun: { progress: m < 0.5 ? a.sun.progress : b.sun.progress, up: lerp(a.sun.up, b.sun.up, m) }
  };
}

// La lune sur la tour pendant le vol : une lumière froide à mi-hauteur du phare (phare : son pied dans le monde, draw/
// sites.js : phareSpot), dans la carte de lumière seulement (pas de halo : on la sent, on ne la voit pas), pour que la
// tour éteinte se détache de la nuit ; k : la part de nuit du vol. null sans vol ni phare
export const LUNE = '176,198,255';
export const LISERE_LUNE = '#D6E4FF';
export function luneDuVol(k, phare) {
  if (!phare || !(k > 0.02)) return null;
  return { x: phare.x, y: phare.y - 260, r: 130, k: 0.55 * k, color: LUNE, pool: false, gy: phare.y };
}
