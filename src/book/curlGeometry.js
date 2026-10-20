// La page qui tourne (curlBook.js), en calculs purs : la grille de la feuille, le pli qui suit le doigt, les courbes
// d'animation, et les règles du geste qui donnent au Livre sa sensation au toucher.

// Grille de la feuille : cols × rows cases, sommets en coordonnées de texture (0 à 1), deux triangles par case
export function sheetMesh(cols, rows) {
  const verts = new Float32Array((cols + 1) * (rows + 1) * 2);
  let k = 0;
  for (let r = 0; r <= rows; r++) for (let c = 0; c <= cols; c++) { verts[k++] = c / cols; verts[k++] = r / rows; }
  const idx = new Uint16Array(cols * rows * 6);
  k = 0;
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const a = r * (cols + 1) + c, b = a + 1, d = a + cols + 1, e = d + 1;
    idx[k++] = a; idx[k++] = d; idx[k++] = b; idx[k++] = b; idx[k++] = d; idx[k++] = e;
  }
  return { verts, idx };
}

// Le pli : P0 le point saisi (bord droit), F le doigt, Fend l'arrivée (en miroir à gauche de la reliure), w la largeur
// de la feuille (px de texture). La ligne du pli (lx, ly), sa direction (ux, uy), son rayon r, et le tour fait (0 à 1)
export function curlOf(P0, F, Fend, w) {
  const dx = P0.x - F.x, dy = P0.y - F.y;
  const length = Math.hypot(dx, dy);
  const progress = Math.min(1, Math.max(0, dx / (P0.x - Fend.x)));
  let angle = length > 1 ? Math.atan2(dy, dx) : 0;
  if (dx <= 0) angle = 0;
  const tilt = .55 * (1 - progress);
  angle = Math.max(-tilt, Math.min(tilt, angle));
  // Le rayon du pli s'efface en fin de tour, pour que la feuille retombe à plat sur la gauche
  const r = w * Math.max(.002, .1 * (1 - progress));
  return { lx: (P0.x + F.x) / 2, ly: (P0.y + F.y) / 2, ux: Math.cos(angle), uy: Math.sin(angle), r, progress };
}

// Courbes d'animation : la feuille qui part (freinée à l'arrivée), la feuille qui revient (un léger dépassement)
export const easeOut = t => 1 - Math.pow(1 - t, 3);
export const easeBack = t => { const s = 1.4; return 1 + (s + 1) * Math.pow(t - 1, 3) + s * Math.pow(t - 1, 2); };

// Un doigt posé qui bouge de (dx, dy) px : 'turn' (il tourne la page), 'scroll' (il fait défiler), ou null (trop tôt
// pour le dire). Un geste en diagonale (coin tiré) tourne aussi la page ; seul un geste nettement vertical fait défiler
export function gestureOf(dx, dy) {
  if (Math.abs(dx) > 9 && Math.abs(dx) > Math.abs(dy) * .8) return 'turn';
  if (Math.abs(dy) > 14 && Math.abs(dy) > Math.abs(dx) * 1.25) return 'scroll';
  return null;
}

// Au lâcher, la page tourne-t-elle ? flick : la vitesse du doigt dans le sens du tour (px/ms), progress : le tour fait
// (0 à 1). Un geste vif l'emporte ; sinon, plus de 30 % de la page tournée, sauf un geste vif en sens contraire
export const commits = (flick, progress) => flick > .45 || (flick > -.45 && progress > .3);
