// Brume, l'esprit de la brume (quêtes de l'île) : un petit souffle lumineux qui flotte près de l'objectif de la quête
// active, avec sa traîne, ses yeux qui clignent, et un éclat doré quand la récompense attend. Unités du monde, en
// fonction du temps : rien à garder, rien à nettoyer.

// Hauteur de vol au-dessus du sol (unités du monde) et rayon de toucher
export const BRUME_ALT = 46;
export const BRUME_REACH = 24;

// Flottement autour du point d'ancrage : petit va-et-vient, bornes ±6 en x, ±4 en y
export function floatOf(t) {
  return { dx: Math.sin(t * 0.7) * 6, dy: Math.sin(t * 1.6) * 4 };
}

// Brume en (x, y) (centre du corps) ; ready : récompense à réclamer ; scale : échelle de la caméra (taille minimale à
// l'écran quand on voit toute l'île) ; ground : le point au sol sous lui (son ombre)
export function drawBrume(ctx, x, y, ground, t, ready, scale) {
  const k = Math.max(1, 0.6 / scale);
  const pulse = 0.5 + 0.5 * Math.sin(t * 3);
  ctx.fillStyle = 'rgba(30,40,60,.12)';
  ctx.beginPath();
  ctx.ellipse(ground.x, ground.y, 8 * k, 3 * k, 0, 0, Math.PI * 2);
  ctx.fill();
  // Halo : bleuté, doré quand la récompense attend
  const r = (ready ? 30 + pulse * 6 : 26) * k;
  const tone = ready ? '255,214,120' : '205,230,255';
  const halo = ctx.createRadialGradient(x, y, 0, x, y, r);
  halo.addColorStop(0, `rgba(${tone},${(ready ? 0.5 + 0.25 * pulse : 0.38).toFixed(3)})`);
  halo.addColorStop(1, `rgba(${tone},0)`);
  ctx.fillStyle = halo;
  ctx.fillRect(x - r, y - r, r * 2, r * 2);
  // Traîne de brume qui ondule sous le corps
  for (let i = 3; i >= 1; i--) {
    ctx.fillStyle = `rgba(238,245,255,${(0.62 - i * 0.12).toFixed(2)})`;
    ctx.beginPath();
    ctx.arc(x - i * 3.6 * k + Math.sin(t * 2.2 + i) * 2 * k, y + i * 5 * k, (7.4 - i * 1.6) * k, 0, Math.PI * 2);
    ctx.fill();
  }
  // Corps, reflet, yeux (un clignement toutes les 4 s)
  ctx.fillStyle = 'rgba(250,252,255,.95)';
  ctx.beginPath();
  ctx.arc(x, y, 9 * k, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(x - 3 * k, y - 3.6 * k, 3 * k, 0, Math.PI * 2);
  ctx.fill();
  const blink = t % 4 < 0.12 ? 0.2 : 1;
  ctx.fillStyle = '#2B3550';
  for (const side of [-1, 1]) {
    ctx.beginPath();
    ctx.ellipse(x + side * 3.2 * k, y + 0.6 * k, 1.3 * k, 1.7 * k * blink, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  if (!ready) return;
  // Pastille « ! » : la récompense attend
  const bx = x + 9 * k, by = y - 12 * k - pulse * 2 * k;
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
