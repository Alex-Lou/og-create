// Le tissu de la troupe refondue : le fil de couture (point avant) et la ligne qui suit un ourlet (l'auréole de sel, la
// crasse du bas, la reprise). Une seule source pour chaque PNJ refondu (Agathe…).
// (Lorena garde pour l'instant sa propre copie, dans lorena_refonte.js : même dessin.)
const { r2 } = require('../troupe');

const THREAD = '#EFE3C4';
const seam = (d, w = 0.45) => `<path d="${d}" fill="none" stroke="${THREAD}" stroke-width="${w}" stroke-dasharray=".9 .7" stroke-linecap="round"/>`;
// Une ligne qui suit l'ourlet (la courbe de x0 à x1, contrôle au milieu en yc), remontée de off, ondulée de amp
function suitOurlet(x0, x1, y0, yc, off, amp = 0) {
  const pts = [];
  for (let i = 0; i <= 24; i++) {
    const t = i / 24, u = 1 - t, x = x0 + (x1 - x0) * t;
    const y = u * u * y0 + 2 * u * t * yc + t * t * y0 - off + Math.sin(t * Math.PI * 7) * amp;
    pts.push(`${r2(x)},${r2(y)}`);
  }
  return 'M' + pts.join(' L');
}

module.exports = { THREAD, seam, suitOurlet };
