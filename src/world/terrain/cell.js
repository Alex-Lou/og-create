// Le dessin d'une case : ses faces, son dessus, ses détails, ses chemins, son pont.
import { CLEAR_GRASS } from '../pathArt';
import { drawRiverBridge } from '../pontRiviere';
import { TW, TH, HS, worldOf, diamond } from './geo';
import { rnd, paintColor, paintSmooth, paintTop, RANK } from './paint';
import { spill, grassSeed, jungleSeed, waterBanks, wetSand } from './details';
import { topColor, face, hangingFace } from './faces';
import { seaBridge } from './seaBridge';
import { paintPath } from './paths';

// Liseré en haut des faces des sols des climats : [gauche, droite]
const LIPS = { n: ['#F4F7FA', '#E3EAF1'], v: ['#DDEFF7', '#CFE5F0'], l: ['#8E6F86', '#7E6277'] };

// Une case : faces avant puis dessus, détails du sol, voile de brume (quartier à acheter)
export function drawCell(ctx, M, x, y, veil = 0) {
  const g = M.ground(x, y);
  if (g === '~') return;
  if (g === 'b') { seaBridge(ctx, M, x, y); return; }
  const h = M.height(x, y);
  const top = M.surface(x, y);
  const c = worldOf(x, y, top);
  const odd = (x + y) % 2;
  const grassy = 'gtmfjx'.includes(g) || LIPS[g] || false;
  const kindOf = (nx, ny) => {
    if (g === 'w') return M.ground(nx, ny) === 'w' || M.ground(nx, ny) === 'k' ? 'fall' : 'earth';
    if ((g === 'p' || g === 'k') && 'pk'.includes(M.ground(nx, ny))) return 'stairs';
    if (g === 's' || g === 'd') return 'sand';
    if (g === 'r' || g === 'n' || g === 'v') return 'rock';
    if (g === 'a' || g === 'o') return 'basalt';
    if (g === 'u') return 'fog';
    return h >= 2 && !'gtmfjx'.includes(g) ? 'rock' : 'earth';
  };
  const zl = M.surface(x, y + 1), zr = M.surface(x + 1, y);
  // Île flottante : côté mer, la face est suspendue (croûte et roche en pointes) ; son contour sert au voile
  const hangL = M.floats(x, y) && !M.land(x, y + 1), hangR = M.floats(x, y) && !M.land(x + 1, y);
  let outlineL = null, outlineR = null;
  if (hangL) outlineL = hangingFace(ctx, M, c.x - TW / 2, c.y, c.x, c.y + TH / 2, [x - 0.5, y + 0.5], [x + 0.5, y + 0.5], 0, grassy, x * 61 + y);
  else if (zl < top) face(ctx, c.x - TW / 2, c.y, c.x, c.y + TH / 2, (top - zl) * HS, kindOf(x, y + 1), 0, grassy, !M.land(x, y + 1));
  if (hangR) outlineR = hangingFace(ctx, M, c.x, c.y + TH / 2, c.x + TW / 2, c.y, [x + 0.5, y + 0.5], [x + 0.5, y - 0.5], 1, grassy, x * 61 + y);
  else if (zr < top) face(ctx, c.x, c.y + TH / 2, c.x + TW / 2, c.y, (top - zr) * HS, kindOf(x + 1, y), 1, grassy, !M.land(x + 1, y));
  // (un chemin : celui de la bibliothèque dans l'herbe de la case, sinon, le temps qu'il se lise, l'ancien chemin)
  const grass = g === 'p' ? topColor('g', h, odd) : null;
  // (sols naturels : peints sans damier, avec le débord de leurs voisins ; sous un chemin, l'herbe de ses voisines, que
  // son dessin laisse voir ; eau, terre inconnue : à plat)
  const painted = RANK[g] !== undefined && g !== 'w';
  const smooth = (painted || g === 'p') && paintSmooth(ctx, M, x, y, c);
  if (painted) {
    if (!smooth) paintTop(ctx, g, h, x, y, c);
    spill(ctx, M, x, y, c, top);
  } else if (!smooth) {
    diamond(ctx, c.x, c.y);
    ctx.fillStyle = grass || topColor(g, h, odd);
    ctx.fill();
  }
  if (g === 'w') waterBanks(ctx, M, x, y, c);
  const drawn = grass && paintPath(ctx, M, x, y, c, smooth ? CLEAR_GRASS : grass);
  if (grass && !drawn) {
    diamond(ctx, c.x, c.y);
    ctx.fillStyle = topColor(g, h, odd);
    ctx.fill();
  }
  // Détails : cailloux du chemin, fleurs de la prairie, ondulations du sable, brins d'herbe, fissures de la roche
  // (le chemin de la bibliothèque a déjà ses cailloux)
  if (g === 'p' && !drawn) {
    ctx.fillStyle = 'rgba(120, 90, 50, .28)';
    for (let k = 0; k < 4; k++) ctx.fillRect(c.x - 14 + rnd(x, y, k) * 28, c.y - 5 + rnd(x, y, k + 9) * 10, 2, 2);
  } else if ('gmt'.includes(g) && M.jungle && M.jungle(x, y)) {
    jungleSeed(ctx, x, y, c);
  } else if (g === 'm') {
    // la prairie : des brins, et ses fleurs en nappes (plus souvent que dans l'herbe)
    grassSeed(ctx, x, y, c, paintColor(g, h, x, y), 0.44);
  } else if (g === 'g' || g === 't') {
    grassSeed(ctx, x, y, c, paintColor(g, h, x, y));
  } else if (g === 's' || g === 'd') {
    wetSand(ctx, M, x, y, c);
    ctx.strokeStyle = 'rgba(190, 150, 90, .25)';
    ctx.lineWidth = 1;
    const k = rnd(x, y, 2) * 8 - 4;
    ctx.beginPath();
    ctx.moveTo(c.x - 12, c.y + k);
    ctx.quadraticCurveTo(c.x, c.y + k - 3, c.x + 12, c.y + k);
    ctx.stroke();
  } else if (g === 'r') {
    // Roche : une dalle claire, une dalle sombre, une fissure, des cailloux
    for (let k = 0; k < 2; k++) {
      const ox = c.x - 9 + rnd(x, y, k + 30) * 18, oy = c.y - 3 + rnd(x, y, k + 33) * 6, sz = 5 + rnd(x, y, k + 36) * 4;
      ctx.fillStyle = k ? 'rgba(255, 255, 255, .16)' : 'rgba(55, 45, 35, .13)';
      ctx.beginPath();
      ctx.moveTo(ox - sz, oy);
      ctx.lineTo(ox - sz * 0.2, oy - sz * 0.45);
      ctx.lineTo(ox + sz, oy - sz * 0.1);
      ctx.lineTo(ox + sz * 0.3, oy + sz * 0.42);
      ctx.closePath();
      ctx.fill();
    }
    ctx.strokeStyle = 'rgba(70, 60, 50, .3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(c.x - 10 + rnd(x, y) * 6, c.y - 4);
    ctx.lineTo(c.x + rnd(x, y, 1) * 4, c.y + 1);
    ctx.lineTo(c.x + 8, c.y - 2 + rnd(x, y, 2) * 5);
    ctx.stroke();
    ctx.fillStyle = 'rgba(80, 70, 60, .4)';
    for (let k = 0; k < 3; k++) ctx.fillRect(c.x - 13 + rnd(x, y, k + 40) * 26, c.y - 5 + rnd(x, y, k + 44) * 10, 1.8, 1.4);
  } else if (g === 'n' || g === 'v') {
    // Neige : un reflet bleuté, quelques scintillements ; lac gelé : des fêlures claires
    ctx.fillStyle = 'rgba(160, 190, 220, .25)';
    ctx.beginPath();
    ctx.ellipse(c.x - 6 + rnd(x, y, 5) * 12, c.y + 2, 9, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255, 255, 255, .95)';
    for (let k = 0; k < 3; k++) ctx.fillRect(c.x - 14 + rnd(x, y, k + 50) * 28, c.y - 5 + rnd(x, y, k + 53) * 10, 1.6, 1.6);
    if (g === 'v') {
      ctx.strokeStyle = 'rgba(255, 255, 255, .7)';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(c.x - 12, c.y - 2 + rnd(x, y, 6) * 4);
      ctx.lineTo(c.x - 2, c.y + 1);
      ctx.lineTo(c.x + 10, c.y - 3 + rnd(x, y, 7) * 5);
      ctx.stroke();
    }
  } else if (g === 'l') {
    // Lande : touffes de bruyère mauve et d'ajonc doré
    for (let k = 0; k < 6; k++) {
      ctx.fillStyle = k % 3 === 2 ? 'rgba(232, 196, 78, .8)' : 'rgba(150, 92, 160, .55)';
      ctx.beginPath();
      ctx.arc(c.x - 15 + rnd(x, y, k + 60) * 30, c.y - 5 + rnd(x, y, k + 66) * 10, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (g === 'x') {
    // Marais : une flaque d'eau dormante et des brins de joncs
    ctx.fillStyle = 'rgba(70, 120, 120, .45)';
    ctx.beginPath();
    ctx.ellipse(c.x - 4 + rnd(x, y, 8) * 8, c.y + rnd(x, y, 9) * 4 - 2, 8 + rnd(x, y, 10) * 4, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(40, 80, 30, .45)';
    for (let k = 0; k < 4; k++) ctx.fillRect(c.x - 14 + rnd(x, y, k + 70) * 28, c.y - 6 + rnd(x, y, k + 74) * 10, 1.2, 4);
  } else if (g === 'j') {
    // Jungle : sous-bois sombre, feuilles larges
    for (let k = 0; k < 4; k++) {
      ctx.fillStyle = k % 2 ? 'rgba(20, 70, 30, .4)' : 'rgba(110, 170, 80, .35)';
      ctx.beginPath();
      ctx.ellipse(c.x - 12 + rnd(x, y, k + 80) * 24, c.y - 4 + rnd(x, y, k + 84) * 8, 4, 1.8, rnd(x, y, k + 88) * 3, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (g === 'a' || g === 'o') {
    // Cendre : fissures sombres (la lave, elle, rougeoie dans ses fissures)
    ctx.strokeStyle = g === 'o' ? 'rgba(255, 214, 120, .85)' : 'rgba(30, 26, 24, .45)';
    ctx.lineWidth = g === 'o' ? 1.4 : 1;
    ctx.beginPath();
    ctx.moveTo(c.x - 12 + rnd(x, y, 11) * 5, c.y - 3);
    ctx.lineTo(c.x - 1, c.y + 1 + rnd(x, y, 12) * 2);
    ctx.lineTo(c.x + 11, c.y - 2 + rnd(x, y, 13) * 4);
    ctx.stroke();
    if (g === 'a') {
      ctx.fillStyle = 'rgba(200, 190, 180, .25)';
      for (let k = 0; k < 3; k++) ctx.fillRect(c.x - 13 + rnd(x, y, k + 90) * 26, c.y - 5 + rnd(x, y, k + 93) * 10, 1.6, 1.2);
    }
  } else if (g === 'u') {
    // Terre inconnue : des volutes de brume légère ; on devine le relief dessous, pas ce qu'il cache
    ctx.fillStyle = 'rgba(255, 255, 255, .4)';
    ctx.beginPath();
    ctx.arc(c.x - 7 + rnd(x, y, 14) * 6, c.y - 1, 6 + rnd(x, y, 15) * 3, 0, Math.PI * 2);
    ctx.arc(c.x + 4 + rnd(x, y, 16) * 6, c.y + 1, 5 + rnd(x, y, 17) * 3, 0, Math.PI * 2);
    ctx.fill();
  }
  // Pont de bois sur la rivière : sa tranche de la passerelle (world/pontRiviere.js)
  if (g === 'k') drawRiverBridge(ctx, M, x, y, veil);
  if (veil > 0) {
    const outline = pts => { ctx.beginPath(); ctx.moveTo(...pts[0]); pts.slice(1).forEach(p => ctx.lineTo(...p)); ctx.closePath(); ctx.fill(); };
    const paint = () => {
      diamond(ctx, c.x, c.y, TW + 1, TH + 1);
      ctx.fill();
      if (outlineL) outline(outlineL);
      else if (zl < top) outline([[c.x - TW / 2, c.y], [c.x, c.y + TH / 2], [c.x, c.y + TH / 2 + (top - zl) * HS], [c.x - TW / 2, c.y + (top - zl) * HS]]);
      if (outlineR) outline(outlineR);
      else if (zr < top) outline([[c.x, c.y + TH / 2], [c.x + TW / 2, c.y], [c.x + TW / 2, c.y + (top - zr) * HS], [c.x, c.y + TH / 2 + (top - zr) * HS]]);
    };
    // La brume froide (choix de l'auteur, 15 oct.) : légère et claire au bord de la terre dégagée, plus dense et
    // bleu-gris au loin ; la partie vivante de l'île reste la plus lumineuse de l'écran, et la nuit la brume reste
    // bleue (la brume vivante passe par-dessus, world/voile.js)
    const k = Math.min(1, Math.max(0, (veil - 0.3) / 0.55));
    const mix = (p, q) => Math.round(p + (q - p) * k);
    ctx.fillStyle = `rgba(${mix(232, 150)}, ${mix(238, 166)}, ${mix(246, 192)}, ${(veil * (0.66 + 0.3 * k)).toFixed(3)})`;
    paint();
  }
}
