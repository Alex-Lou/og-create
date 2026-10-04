// Brume, l'esprit de la brume (quêtes de l'île) : un feu follet, une petite flamme bleutée qui vacille, avec deux
// yeux et rien d'autre ; dorée, avec une pastille « ! », quand la récompense attend. Il flotte près de l'objectif de la
// quête active. Unités du monde, en fonction du temps : rien à garder, rien à nettoyer. Le même feu follet en SVG
// (fiches, Livre) : components/ui/BrumeWisp.vue, mêmes couleurs (WISP).

// Hauteur de vol au-dessus du sol (unités du monde) et rayon de toucher
export const BRUME_ALT = 46;
export const BRUME_REACH = 24;

// Couleurs du feu follet : cœur, flamme, bord, halo ; au repos (bleuté) et récompense prête (doré)
export const WISP = {
  calm: { core: '#FFFFFF', flame: '#BFF0FF', edge: '#5CC8F0', halo: '120,210,255' },
  ready: { core: '#FFFDF2', flame: '#FFE7A3', edge: '#F2B23B', halo: '255,200,90' },
  eye: '#1D3557'
};

// Flottement autour du point d'ancrage : petit va-et-vient, bornes ±6 en x, ±4 en y
export function floatOf(t) {
  return { dx: Math.sin(t * 0.7) * 6, dy: Math.sin(t * 1.6) * 4 };
}

// Contour de la flamme : une goutte ronde en bas, une pointe qui vacille en haut (r : rayon du bas)
function flame(ctx, x, y, r, t, k) {
  const sway = Math.sin(t * 5.3) * r * 0.32 + Math.sin(t * 8.1) * r * 0.1;
  const top = r * (2.05 + 0.18 * Math.sin(t * 6.7)) * k;
  ctx.beginPath();
  ctx.moveTo(x, y + r);
  ctx.bezierCurveTo(x + r * 1.3, y + r, x + r * 1.15, y - r * 0.45, x + sway, y - top);
  ctx.bezierCurveTo(x - r * 1.15, y - r * 0.45, x - r * 1.3, y + r, x, y + r);
  ctx.closePath();
}

// Brume en (x, y) (centre du bas de la flamme) ; ready : récompense à réclamer ; scale : échelle de la caméra (taille
// minimale à l'écran quand on voit toute l'île) ; ground : le point au sol sous lui (son ombre)
export function drawBrume(ctx, x, y, ground, t, ready, scale) {
  const k = Math.max(1, 0.6 / scale);
  const tone = ready ? WISP.ready : WISP.calm;
  const pulse = 0.5 + 0.5 * Math.sin(t * 3);
  const r = 8 * k;
  ctx.fillStyle = 'rgba(30,40,60,.12)';
  ctx.beginPath();
  ctx.ellipse(ground.x, ground.y, 7 * k, 2.6 * k, 0, 0, Math.PI * 2);
  ctx.fill();
  // Halo
  const reach = (ready ? 30 + pulse * 6 : 26) * k;
  const halo = ctx.createRadialGradient(x, y - r * 0.4, 0, x, y - r * 0.4, reach);
  halo.addColorStop(0, `rgba(${tone.halo},${(ready ? 0.5 + 0.2 * pulse : 0.4).toFixed(3)})`);
  halo.addColorStop(1, `rgba(${tone.halo},0)`);
  ctx.fillStyle = halo;
  ctx.fillRect(x - reach, y - r * 0.4 - reach, reach * 2, reach * 2);
  // Étincelles qui montent et s'éteignent
  for (let i = 0; i < 3; i++) {
    const p = (t * 0.6 + i / 3) % 1;
    ctx.fillStyle = `rgba(${tone.halo},${(0.9 * (1 - p)).toFixed(3)})`;
    ctx.beginPath();
    ctx.arc(x + Math.sin(t * 2 + i * 2.1) * r * 0.9, y - r * (1.2 + p * 2.4), (1.4 - p * 0.8) * k, 0, Math.PI * 2);
    ctx.fill();
  }
  // Flamme : bord coloré, puis le cœur clair
  const body = ctx.createRadialGradient(x, y + r * 0.2, r * 0.2, x, y - r * 0.3, r * 2.2);
  body.addColorStop(0, tone.core);
  body.addColorStop(0.45, tone.flame);
  body.addColorStop(1, tone.edge);
  ctx.fillStyle = body;
  flame(ctx, x, y, r, t, 1);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.75)';
  flame(ctx, x, y + r * 0.25, r * 0.55, t + 0.4, 0.9);
  ctx.fill();
  // Deux yeux, et rien d'autre (un clignement toutes les 4 s)
  const blink = t % 4 < 0.12 ? 0.2 : 1;
  ctx.fillStyle = WISP.eye;
  for (const side of [-1, 1]) {
    ctx.beginPath();
    ctx.ellipse(x + side * 2.9 * k, y - r * 0.1, 1.25 * k, 1.75 * k * blink, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  if (!ready) return;
  // Pastille « ! » : la récompense attend
  const bx = x + r * 1.2, by = y - r * 2.1 - pulse * 2 * k;
  ctx.fillStyle = '#F2C04B';
  ctx.beginPath();
  ctx.arc(bx, by, 5.4 * k, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#4A3426';
  ctx.font = `900 ${(7.6 * k).toFixed(1)}px Nunito, system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('!', bx, by + 0.4 * k);
  ctx.textBaseline = 'alphabetic';
}
