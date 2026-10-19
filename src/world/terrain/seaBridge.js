// Le pont de planches sur la mer (vers l'Îlot aux Mouettes).
import { TW, TH, HS, worldOf, diamond, bridgeLamp, LAMP_H } from './geo';

// Pont de planches sur la mer (vers l'Îlot aux Mouettes), posé au ras de la terre : piles, tablier, rambardes de corde
// sur poteaux des deux côtés, une lanterne à chaque bout (sa lueur de nuit : WorldView)
function seaBridge(ctx, M, x, y) {
  const c = worldOf(x, y, 0.15);
  ctx.fillStyle = '#6B4A2A';
  for (const [dx, dy] of [[-0.35, -0.35], [0.35, 0.35]]) {
    const p = worldOf(x + dx, y + dy, 0.15);
    ctx.fillRect(p.x - 2, p.y, 4, HS * 1.5);
  }
  diamond(ctx, c.x, c.y, TW * 0.92, TH * 0.6);
  ctx.fillStyle = '#A47A4A';
  ctx.fill();
  ctx.strokeStyle = '#7A5530';
  ctx.lineWidth = 1;
  for (let k = -3; k <= 3; k++) {
    ctx.beginPath();
    ctx.moveTo(c.x + k * 6 - 9, c.y + k * 3 - 4.5 + (k * 0.2));
    ctx.lineTo(c.x + k * 6 + 9, c.y + k * 3 + 4.5 - (k * 0.2));
    ctx.stroke();
  }
  const alongX = 'b'.includes(M.ground(x - 1, y)) || 'b'.includes(M.ground(x + 1, y)) || M.land(x - 1, y) || M.land(x + 1, y);
  const post = (u, v, h) => {
    const p = worldOf(u, v, 0.15);
    ctx.fillStyle = '#5C3F24';
    ctx.fillRect(p.x - 1.2, p.y - h, 2.4, h);
    return { x: p.x, y: p.y - h };
  };
  // Rambarde : de l'arrière (-1) puis de l'avant (+1), corde qui pend un peu entre deux poteaux
  for (const side of [-1, 1]) {
    const a = alongX ? post(x - 0.5, y + side * 0.32, 12) : post(x + side * 0.32, y - 0.5, 12);
    const b = alongX ? post(x + 0.5, y + side * 0.32, 12) : post(x + side * 0.32, y + 0.5, 12);
    ctx.strokeStyle = '#D9C08A';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y + 1);
    ctx.quadraticCurveTo((a.x + b.x) / 2, (a.y + b.y) / 2 + 4, b.x, b.y + 1);
    ctx.stroke();
  }
  for (const [dx, dy] of alongX ? [[-1, 0], [1, 0]] : [[0, -1], [0, 1]]) {
    if (!M.land(x + dx, y + dy)) continue;
    const lamp = bridgeLamp(x, y, dx, dy);
    const top = post(lamp.x, lamp.y, LAMP_H);
    ctx.fillStyle = '#3D3A36';
    ctx.fillRect(top.x - 3.4, top.y - 8, 6.8, 2);
    ctx.fillStyle = '#FFE08A';
    ctx.fillRect(top.x - 2.6, top.y - 6, 5.2, 6);
    ctx.strokeStyle = '#3D3A36';
    ctx.lineWidth = 0.8;
    ctx.strokeRect(top.x - 2.6, top.y - 6, 5.2, 6);
  }
}

export { seaBridge };
