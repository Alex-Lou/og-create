// Brume vivante des terres voilées : au-dessus de chaque terre encore sous la brume, des
// nappes douces (trois formes, dessinées une fois) qui dérivent lentement et respirent ; elles débordent un peu sur
// les bords, qui ne sont plus des losanges nets. Dessinées dans le monde, avant la lumière (la nuit les assombrit).
import { worldOf, TW } from './terrain';

const hash = (x, y) => { const v = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return v - Math.floor(v); };

// Une nappe : quelques bulles radiales mêlées (un petit cumulus couché), blanc bleuté
const textures = [];
function nappe(k) {
  if (textures[k]) return textures[k];
  const c = document.createElement('canvas');
  c.width = 192; c.height = 112;
  const g = c.getContext('2d');
  const blobs = [[[60, 66, 44], [104, 56, 52], [146, 68, 38]], [[52, 62, 40], [92, 70, 46], [132, 54, 48]], [[74, 58, 50], [124, 66, 44]]][k];
  for (const [x, y, r] of blobs) {
    const grad = g.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, 'rgba(246, 248, 252, .9)');
    grad.addColorStop(0.55, 'rgba(240, 243, 249, .45)');
    grad.addColorStop(1, 'rgba(236, 240, 247, 0)');
    g.fillStyle = grad;
    g.fillRect(0, 0, c.width, c.height);
  }
  textures[k] = c;
  return c;
}

// Les nappes d'une île : une terre voilée sur deux environ porte la sienne (veilAt : voile de la case, 0 à 1) ; près
// d'une terre dégagée, elles sont plus petites et plus légères (la brume s'effiloche au bord, sans déborder). zoneOf :
// le quartier d'une case (une nappe s'efface avec le sien quand on l'achète)
export function fogPuffs(M, veilAt, zoneOf = () => null) {
  const list = [];
  for (let y = 0; y < M.n; y++) {
    for (let x = 0; x < M.n; x++) {
      if (!M.land(x, y)) continue;
      const a = veilAt(x, y);
      if (a <= 0) continue;
      const h = hash(x, y);
      if (h > 0.55) continue;
      let clear = 0;
      for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) if (M.land(x + dx, y + dy) && veilAt(x + dx, y + dy) <= 0) clear = Math.max(clear, 3 - Math.max(Math.abs(dx), Math.abs(dy)));
      const c = worldOf(x, y, Math.max(0, M.surface(x, y)));
      const edge = 1 - clear / 3;
      list.push({ x: c.x, y: c.y, a: a * (0.35 + 0.65 * edge), r: (0.55 + hash(y, x) * 0.35) * (0.5 + 0.5 * edge), k: Math.floor(h * 5.4) % 3, p: h * 40, zone: zoneOf(x, y) });
    }
  }
  return list;
}

// Les nappes à l'écran (view : rectangle du monde), à l'instant t ; fade(p) : ce qu'il en reste (0 à 1)
export function drawFog(ctx, puffs, view, t, fade = null) {
  ctx.save();
  for (const p of puffs) {
    const w = TW * 2.1 * p.r, h = w * 0.58;
    if (p.x + w < view.x || p.x - w > view.x + view.w || p.y + h < view.y || p.y - h * 1.4 > view.y + view.h) continue;
    const dx = Math.sin(t * 0.06 + p.p) * 10 * p.r, dy = Math.cos(t * 0.045 + p.p) * 3;
    const k = fade ? fade(p) : 1;
    if (k <= 0) continue;
    ctx.globalAlpha = Math.min(1, k * p.a * 0.55 * (0.82 + 0.18 * Math.sin(t * 0.22 + p.p)));
    ctx.drawImage(nappe(p.k), p.x + dx - w / 2, p.y + dy - h * 0.8, w, h);
  }
  ctx.restore();
}
