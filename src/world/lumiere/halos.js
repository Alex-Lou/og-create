// Halos : le rayonnement des sources elles-mêmes (celles rangées par drawLights), en addition par-dessus la scène et
// la carte de lumière. Mêmes paliers que l'ancien glow (0,55 au cœur, 0,22 à 0,4, rien au bord), dessinés une fois
// par couleur.
const halos = new Map();
function haloOf(color) {
  let c = halos.get(color);
  if (c) return c;
  c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, `rgba(${color},0.55)`);
  grad.addColorStop(0.4, `rgba(${color},0.22)`);
  grad.addColorStop(1, `rgba(${color},0)`);
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  halos.set(color, c);
  return c;
}

// Les halos des sources, dans la transformation du monde ; le point des lucioles
export function drawHalos(ctx, sources) {
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  for (const s of sources) {
    ctx.globalAlpha = Math.min(1, s.k);
    ctx.drawImage(haloOf(s.color), s.x - s.r, s.y - s.r, s.r * 2, s.r * 2);
    if (s.dot) { ctx.fillStyle = `rgba(255,250,200,${Math.min(1, s.k).toFixed(3)})`; ctx.fillRect(s.x - 1, s.y - 1, 2, 2); }
  }
  ctx.restore();
}
