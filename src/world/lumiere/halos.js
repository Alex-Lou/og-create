// Halos : le rayonnement des sources elles-mêmes (celles rangées par drawLights), en addition par-dessus la scène et
// la carte de lumière. Mêmes paliers que l'ancien glow (0,55 au cœur, 0,22 à 0,4, rien au bord), dessinés une fois
// par couleur. Dans la brume ou sous un ciel voilé, chaque source s'entoure en plus d'un grand halo diffus qui frémit,
// comme une lanterne dans le brouillard ; la nuit, ceux d'un village se fondent en une lueur douce.
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

// Le halo diffus de la brume : sans cœur, très étalé
const diffuse = new Map();
function diffuseOf(color) {
  let c = diffuse.get(color);
  if (c) return c;
  c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, `rgba(${color},0.5)`);
  grad.addColorStop(0.35, `rgba(${color},0.24)`);
  grad.addColorStop(0.7, `rgba(${color},0.06)`);
  grad.addColorStop(1, `rgba(${color},0)`);
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  diffuse.set(color, c);
  return c;
}

// L'air chargé (0 à 1) : la brume, ou un ciel voilé (moins sous la pluie, qui lave l'air)
export function hazeOf(phase) {
  const { weather } = phase;
  return Math.min(1, Math.max(weather.mist || 0, weather.cover * 0.45 * (1 - weather.rain * 0.5)));
}

// Les halos des sources, dans la transformation du monde ; le point des lucioles. haze : l'air chargé (hazeOf), t :
// le temps (le frémissement ; 0 en mouvement réduit)
export function drawHalos(ctx, sources, haze = 0, t = 0) {
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  if (haze > 0.03) {
    for (const s of sources) {
      const r = s.r * (2 + 1.6 * haze);
      ctx.globalAlpha = Math.min(1, s.k * 0.32 * haze * (0.92 + 0.08 * Math.sin(t * 1.6 + s.x * 0.05)));
      ctx.drawImage(diffuseOf(s.color), s.x - r, s.y - r, r * 2, r * 2);
    }
  }
  for (const s of sources) {
    ctx.globalAlpha = Math.min(1, s.k);
    ctx.drawImage(haloOf(s.color), s.x - s.r, s.y - s.r, s.r * 2, s.r * 2);
    if (s.dot) { ctx.fillStyle = `rgba(255,250,200,${Math.min(1, s.k).toFixed(3)})`; ctx.fillRect(s.x - 1, s.y - 1, 2, 2); }
  }
  ctx.restore();
}
