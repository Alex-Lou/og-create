// Ce qui bouge sur le sol : l'eau douce (reflets, cascades) et l'écume au bord de la mer, animées par-dessus les carrés.
import { TW, HS, worldOf } from './geo';
import { rnd } from './paint';

// Ce qui bouge sur le sol, précalculé une fois par île : cases d'eau douce, faces de cascade, bords de mer devant
// (shore : la mer en +y, côté 0, ou en +x, côté 1) et derrière (back : la mer en −y, côté 0, ou en −x, côté 1) ;
// rien autour de l'île flottante
export function liveOf(M) {
  const water = [], falls = [], shore = [], back = [];
  for (let y = 0; y < M.n; y++) {
    for (let x = 0; x < M.n; x++) {
      const g = M.ground(x, y);
      if (g === 'w') {
        water.push({ x, y });
        const top = M.surface(x, y);
        for (const [dx, dy, side] of [[0, 1, 0], [1, 0, 1]]) {
          const ng = M.ground(x + dx, y + dy);
          if ((ng === 'w' || ng === 'k') && M.surface(x + dx, y + dy) < top - 0.5) falls.push({ x, y, side, drop: (top - M.surface(x + dx, y + dy)) * HS });
        }
      }
      if (M.land(x, y) && !M.floats(x, y)) {
        for (const [dx, dy, side] of [[0, 1, 0], [1, 0, 1]]) if (M.ground(x + dx, y + dy) === '~') shore.push({ x, y, side });
        for (const [dx, dy, side] of [[0, -1, 0], [-1, 0, 1]]) if (M.ground(x + dx, y + dy) === '~') back.push({ x, y, side });
      }
    }
  }
  return { water, falls, shore, back };
}

// Traits blancs regroupés : ceux de même teinte et de même épaisseur partent en un seul tracé (de loin, toute la côte et
// toute l'eau douce sont à l'écran : un millier de traits). Teinte au 1/50 et épaisseur au 1/10 près, l'œil n'y voit
// pas de différence. add(alpha, largeur, tracé) : tracé(ctx) ajoute ses segments au chemin ; flush(ctx) dessine tout
export function strokeBatch() {
  const groups = new Map();
  return {
    add(alpha, width, trace) {
      const a = Math.round(alpha * 50) / 50, w = Math.round(width * 10) / 10;
      if (a <= 0) return;
      const key = `${a}|${w}`;
      if (!groups.has(key)) groups.set(key, { a, w, traces: [] });
      groups.get(key).traces.push(trace);
    },
    flush(ctx) {
      for (const { a, w, traces } of groups.values()) {
        ctx.strokeStyle = `rgba(255,255,255,${a})`;
        ctx.lineWidth = w;
        ctx.beginPath();
        for (const trace of traces) trace(ctx);
        ctx.stroke();
      }
      groups.clear();
    }
  };
}

// Animation de l'eau douce sur les cases visibles : reflets qui glissent, cascades qui tombent (la mer : sea.js)
export function drawLive(ctx, M, live, view, t) {
  const seen = c => c.x > view.x - TW && c.x < view.x + view.w + TW && c.y > view.y - TW * 2 && c.y < view.y + view.h + TW;
  ctx.lineCap = 'round';
  const glints = strokeBatch();
  for (const cell of live.water) {
    const c = worldOf(cell.x, cell.y, M.surface(cell.x, cell.y));
    if (!seen(c)) continue;
    const k = (t * 0.35 + rnd(cell.x, cell.y) ) % 1;
    glints.add(0.45 * Math.sin(k * Math.PI), 1.4, x => {
      x.moveTo(c.x - 10 + k * 8, c.y - 3 + k * 4);
      x.quadraticCurveTo(c.x - 2 + k * 8, c.y - 6 + k * 4, c.x + 6 + k * 8, c.y - 3 + k * 4);
    });
  }
  glints.flush(ctx);
  // (les cascades, le courant et les poissons : world/eauDouce.js)
}
