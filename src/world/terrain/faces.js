// Les faces avant d'une case (vers +x et +y) : terre, roche, basalte, sable, brume, escaliers de chemin, cascades,
// détails des falaises, et le dessous en pointes de l'île flottante.
import { HS, CRUST, underAt } from './geo';
import { rnd, TOPS } from './paint';

const topColor = (g, h, odd) => {
  const key = g === 't' ? 'g' : g === 'd' ? 's' : g === 'k' ? 'w' : g;
  const set = TOPS[key] || TOPS.g;
  return set[Math.min(set.length - 1, Math.max(0, h))][odd ? 1 : 0];
};

// Faces : terre (sous l'herbe), sable, roche, eau qui tombe, marches de pierre ; [gauche, droite]
const FACES = {
  earth: ['#9C6A3A', '#7E5229'],
  sand: ['#D2B47A', '#BC9C63'],
  rock: ['#8E8578', '#766D61'],
  fall: ['#9AD3F0', '#86C6E8'],
  stairs: ['#9C6A3A', '#7E5229'],
  basalt: ['#4C4744', '#3B3734'],
  // Falaises d'une terre inconnue : assez sombres pour lire le relief sous le voile
  fog: ['#B4BCC0', '#A0A8AF']
};

// grassy : liseré en haut de la face (true : herbe ; ou une couleur [gauche, droite] : neige, bruyère…)
function face(ctx, x0, y0, x1, y1, drop, kind, side, grassy, wet = false) {
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  ctx.lineTo(x1, y1 + drop);
  ctx.lineTo(x0, y0 + drop);
  ctx.closePath();
  // Une teinte qui descend du clair au sombre (la face n'est plus un aplat : elle se lit en relief)
  const base = FACES[kind][side];
  const dark = '#' + base.slice(1).match(/../g).map(c => Math.round(parseInt(c, 16) * 0.72).toString(16).padStart(2, '0')).join('');
  const grad = ctx.createLinearGradient(0, Math.min(y0, y1), 0, Math.min(y0, y1) + drop);
  grad.addColorStop(0, base);
  grad.addColorStop(1, dark);
  ctx.fillStyle = grad;
  ctx.fill();
  if (kind === 'fall' || kind === 'fog') return;
  cliffDetail(ctx, x0, y0, x1, y1, drop, kind, side, grassy, wet);
}

// La face d'une falaise travaillée : Strates ondulées, cailloux pris dans la terre (clairs dessus),
// ombre au pied ; au bord de la mer, le bas mouillé (plus sombre, un filet luisant) ; en haut, l'herbe qui pend
function cliffDetail(ctx, x0, y0, x1, y1, drop, kind, side, grassy, wet) {
  const seed = Math.round(x0 * 7 + y0 * 13);
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.lineTo(x1, y1 + drop); ctx.lineTo(x0, y0 + drop); ctx.closePath();
  ctx.clip();
  ctx.strokeStyle = kind === 'sand' ? 'rgba(120, 90, 45, .22)' : 'rgba(52, 30, 14, .24)';
  ctx.lineWidth = 1;
  for (let z = HS * 0.35, i = 0; z < drop - 2; z += HS * (0.38 + rnd(seed, i, 1) * 0.14), i++) {
    ctx.beginPath();
    for (let k = 0; k <= 6; k++) {
      const t = k / 6;
      const wob = Math.sin(t * Math.PI * 2 + rnd(seed, i, 2) * 6) * 1.6;
      const px = x0 + (x1 - x0) * t, py = y0 + (y1 - y0) * t + z + wob;
      if (k) ctx.lineTo(px, py); else ctx.moveTo(px, py);
    }
    ctx.stroke();
  }
  if (kind !== 'sand') {
    const stones = Math.min(5, Math.floor(drop / 9));
    for (let k = 0; k < stones; k++) {
      const t = 0.12 + rnd(seed, k, 5) * 0.76, z = 5 + rnd(seed, k, 6) * (drop - 9);
      const px = x0 + (x1 - x0) * t, py = y0 + (y1 - y0) * t + z, r = 1.8 + rnd(seed, k, 7) * 1.8;
      ctx.fillStyle = kind === 'rock' || kind === 'basalt' ? 'rgba(40, 34, 30, .35)' : 'rgba(150, 140, 125, .9)';
      ctx.beginPath(); ctx.ellipse(px, py, r * 1.3, r, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(255, 250, 235, .35)';
      ctx.beginPath(); ctx.ellipse(px - r * 0.3, py - r * 0.35, r * 0.6, r * 0.35, 0, 0, Math.PI * 2); ctx.fill();
    }
  }
  // ombre au pied
  const foot = ctx.createLinearGradient(0, Math.min(y0, y1) + drop * 0.55, 0, Math.max(y0, y1) + drop);
  foot.addColorStop(0, 'rgba(30, 18, 8, 0)');
  foot.addColorStop(1, 'rgba(30, 18, 8, .22)');
  ctx.fillStyle = foot;
  ctx.fillRect(Math.min(x0, x1), Math.min(y0, y1), Math.abs(x1 - x0), drop + Math.abs(y1 - y0));
  if (wet) {
    const wz = Math.min(drop, HS * 0.55);
    ctx.fillStyle = 'rgba(40, 55, 70, .28)';
    ctx.beginPath();
    ctx.moveTo(x0, y0 + drop - wz); ctx.lineTo(x1, y1 + drop - wz); ctx.lineTo(x1, y1 + drop); ctx.lineTo(x0, y0 + drop); ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, .5)';
    ctx.lineWidth = 0.9;
    ctx.beginPath(); ctx.moveTo(x0, y0 + drop - wz); ctx.lineTo(x1, y1 + drop - wz); ctx.stroke();
  }
  ctx.restore();
  if (grassy) {
    // liseré d'herbe, et quelques brins qui pendent par-dessus le bord
    const tint = Array.isArray(grassy) ? grassy[side] : side ? '#6B8C55' : '#7A9C62';
    ctx.fillStyle = tint;
    ctx.beginPath();
    ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.lineTo(x1, y1 + 3.5); ctx.lineTo(x0, y0 + 3.5);
    ctx.closePath();
    ctx.fill();
    if (!Array.isArray(grassy)) {
      for (let k = 0; k < 5; k++) {
        const t = 0.08 + k * 0.2 + rnd(seed, k, 8) * 0.08, len = 3 + rnd(seed, k, 9) * 5;
        const px = x0 + (x1 - x0) * t, py = y0 + (y1 - y0) * t + 3;
        ctx.beginPath(); ctx.moveTo(px - 1.6, py); ctx.lineTo(px, py + len); ctx.lineTo(px + 1.6, py); ctx.closePath();
        ctx.fill();
      }
    }
  }
}

// Face avant d'une case de l'île flottante, côté mer : la croûte de terre, puis la roche suspendue jusqu'à un bord
// en pointes (profondeur aux coins ca, cb : continue d'une case à l'autre). Renvoie le contour complet (voile de brume)
const JAG = [0, 0.2, 0.55, 0.25, 0];

function hangingFace(ctx, M, x0, y0, x1, y1, ca, cb, side, grassy, seed) {
  const crust = CRUST * HS;
  face(ctx, x0, y0, x1, y1, crust, 'earth', side, grassy);
  const dA = (CRUST + underAt(M.float, ...ca)) * HS, dB = (CRUST + underAt(M.float, ...cb)) * HS;
  const bottom = JAG.map((jag, k) => {
    const t = k / (JAG.length - 1);
    return [x0 + (x1 - x0) * t, y0 + (y1 - y0) * t + dA + (dB - dA) * t + jag * HS * (0.7 + rnd(seed, side, k) * 0.9)];
  });
  ctx.beginPath();
  ctx.moveTo(x0, y0 + crust);
  ctx.lineTo(x1, y1 + crust);
  for (let k = bottom.length - 1; k >= 0; k--) ctx.lineTo(...bottom[k]);
  ctx.closePath();
  ctx.fillStyle = FACES.rock[side];
  ctx.fill();
  // Ombre qui s'épaissit vers les pointes, une fissure
  const shade = ctx.createLinearGradient(0, Math.min(y0, y1) + crust, 0, Math.max(y0 + dA, y1 + dB) + HS * 0.6);
  shade.addColorStop(0, 'rgba(30, 24, 18, 0)');
  shade.addColorStop(1, 'rgba(30, 24, 18, .38)');
  ctx.fillStyle = shade;
  ctx.fill();
  ctx.strokeStyle = 'rgba(40, 32, 25, .3)';
  ctx.lineWidth = 1;
  const k = 0.3 + rnd(seed, side, 9) * 0.4;
  ctx.beginPath();
  ctx.moveTo(x0 + (x1 - x0) * k, y0 + (y1 - y0) * k + crust + 2);
  ctx.lineTo(x0 + (x1 - x0) * (k + 0.06), y0 + (y1 - y0) * k + crust + (dA + dB) * 0.3);
  ctx.stroke();
  return [[x0, y0], [x1, y1], ...bottom.reverse()];
}

export { topColor, face, hangingFace };
