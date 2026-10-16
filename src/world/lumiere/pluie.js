// Pluie, dans le monde : chaque goutte a son point de chute sur l'île ou la mer (par carreaux autour de la vue :
// climates.js, tuilesOf), tombe de haut jusqu'à lui, penchée par le vent, et y éclabousse en couronne. Elle grossit
// avec le zoom et reste à sa place quand on glisse ; dessinée avant la lumière de l'heure, elle s'allume d'elle-même
// en traversant le halo d'une lanterne ou d'une fenêtre. La nuit, le sol mouillé reflète chaque lumière en une longue
// traînée qui ondule, posée au pied de la lumière (drawRefletsPluie). Tout se déduit du temps.
import { hash } from '../scene';
import { tuilesOf, TUILE } from '../tuiles';
import { frac, lisse } from '../maths';
import { texture, rond } from '../textures';

// Trois sortes de gouttes : fines et pâles, moyennes, longues et nettes (longueur, épaisseur, force)
const SORTES = [{ len: 10, w: 0.8, a: 0.3 }, { len: 16, w: 1.1, a: 0.45 }, { len: 26, w: 1.5, a: 0.6 }];
// Gouttes par carreau à pleine pluie, et la hauteur d'où elles tombent (unités du monde)
const PAR_CARREAU = 70;
const HAUT = 300;

// Chaque goutte visible à l'instant t, une à une : vu(x, y (le point de chute), z (l'altitude), sorte, ph (0 au départ
// de sa chute, 1 à l'arrivée ; elle vient d'éclabousser quand ph est petit)). dens : la densité (la qualité de
// l'appareil, et le zoom : de loin, moins de gouttes). Rien n'est gardé : des milliers de gouttes par image
function chaqueGoutte(view, t, rain, dens, vu) {
  if (rain <= 0.02) return;
  const n = Math.round(PAR_CARREAU * rain * dens);
  for (const T of tuilesOf(view, HAUT)) {
    for (let k = 0; k < n; k++) {
      const x = T.X + hash(T.n + k, 61) * TUILE, y = T.Y + hash(T.n + k, 62) * TUILE;
      const ph = frac(t / (0.5 + 0.25 * hash(T.n + k, 63)) + hash(T.n + k, 64));
      vu(x, y, HAUT * (1 - ph), k % 3, ph);
    }
  }
}
// (une goutte sur trois éclabousse en arrivant : on la voit juste après sa chute)
const eclabousse = (sorte, ph) => sorte === 0 && ph < 0.14;

// Les gouttes visibles à l'instant t : [{ x, y (le point de chute), z (l'altitude), sorte }], et les éclaboussures
// [{ x, y, age (0 à 1) }]
export function gouttesOf(view, t, rain, dens = 1) {
  const gouttes = [], eclats = [];
  chaqueGoutte(view, t, rain, dens, (x, y, z, sorte, ph) => {
    gouttes.push({ x, y, z, sorte });
    if (eclabousse(sorte, ph)) eclats.push({ x, y, age: ph / 0.14 });
  });
  return { gouttes, eclats };
}

// Les gouttes et leurs éclaboussures, dans la transformation du monde (avant la lumière de l'heure), en un seul
// parcours : chaque goutte va dans le tracé de sa sorte. night : 0 à 1 ; flash : l'éclair (0 à 1) ; opts : { slant (la
// pente du vent), dens (la densité) }
export function drawPluie(ctx, view, t, rain, night, flash, { slant = 0.24, dens = 1 } = {}) {
  if (rain <= 0.02) return;
  const traits = SORTES.map(() => new Path2D()), eclats = new Path2D();
  chaqueGoutte(view, t, rain, dens, (x0, y0, z, sorte, ph) => {
    const len = SORTES[sorte].len, x = x0 + z * slant, y = y0 - z;
    traits[sorte].moveTo(x, y);
    traits[sorte].lineTo(x + len * slant, y - len);
    if (!eclabousse(sorte, ph)) return;
    // Éclaboussure : une couronne qui s'ouvre au point de chute, deux gouttelettes qui retombent
    const age = ph / 0.14, r = 1.5 + age * 4.5;
    eclats.moveTo(x0 + r, y0);
    eclats.ellipse(x0, y0, r, r * 0.38, 0, 0, Math.PI * 2);
    if (age < 0.6) {
      const up = Math.sin(age * Math.PI) * 4;
      eclats.moveTo(x0 - 1.5, y0 - 0.5); eclats.lineTo(x0 - 3 - age * 2, y0 - up);
      eclats.moveTo(x0 + 1.5, y0 - 0.5); eclats.lineTo(x0 + 3 + age * 2, y0 - up);
    }
  });
  const lit = flash > 0.05;
  // (de jour, des gouttes plus sombres que le ciel pour qu'on les voie ; la nuit, claires : la lumière de l'heure les
  // assombrit ensuite, sauf là où une lumière les prend)
  const base = lit ? '235,240,255' : night > 0.5 ? '226,236,255' : '96,116,148';
  ctx.save();
  ctx.lineCap = 'round';
  SORTES.forEach((sorte, i) => {
    ctx.strokeStyle = `rgba(${base},${Math.min(0.95, sorte.a * (lit ? 1.7 : 1) * (night > 0.5 ? 1.3 : 1)).toFixed(3)})`;
    ctx.lineWidth = sorte.w;
    ctx.stroke(traits[i]);
  });
  ctx.strokeStyle = `rgba(${base},${(lit ? 0.85 : 0.55).toFixed(3)})`;
  ctx.lineWidth = 0.9;
  ctx.stroke(eclats);
  ctx.restore();
}

// Le reflet d'une lumière sur le sol mouillé, dessiné une fois par couleur : une longue ellipse qui pâlit vers le bas
const refletImg = color => texture(`reflet-pluie:${color}`, 32, 128, g => {
  const grad = g.createLinearGradient(0, 0, 0, 128);
  grad.addColorStop(0, `rgba(${color},0.62)`);
  grad.addColorStop(0.45, `rgba(${color},0.22)`);
  grad.addColorStop(1, `rgba(${color},0)`);
  g.fillStyle = grad;
  g.beginPath();
  g.ellipse(16, 64, 16, 64, 0, 0, Math.PI * 2);
  g.fill();
});

// Sous la neige, la lumière ne se reflète pas en traînée (la neige n'est pas un miroir) : elle se pose au pied de la
// lumière en une flaque ronde et douce, à plat, où quelques cristaux scintillent tour à tour (toujours aux mêmes places
// pour une même lumière). La flaque est dessinée une fois par couleur
const lueurNeigeImg = color => rond(`lueur-neige:${color}`, 64, [[0, `rgba(${color},0.5)`], [0.55, `rgba(${color},0.16)`], [1, `rgba(${color},0)`]]);
const CRISTAUX = 5;
function lueurNeige(ctx, l, y, t, a) {
  const rx = l.r * 0.9, ry = rx * 0.42;
  ctx.globalAlpha = a;
  ctx.drawImage(lueurNeigeImg(l.color), l.x - rx, y - ry, rx * 2, ry * 2);
  const g = hash(l.x * 0.13, y * 0.07);
  ctx.fillStyle = 'rgb(255,250,240)';
  for (let j = 0; j < CRISTAUX; j++) {
    const eclat = Math.max(0, Math.sin(t * 1.6 + j * 2.4 + g * 40)) ** 6;
    if (eclat < 0.05) continue;
    const ang = (g + j / CRISTAUX) * Math.PI * 2, d = 0.25 + 0.6 * hash(g * 31 + j, 3);
    ctx.globalAlpha = Math.min(1, a * eclat * 1.6);
    ctx.beginPath();
    ctx.arc(l.x + Math.cos(ang) * rx * d, y + Math.sin(ang) * ry * d, 1.1, 0, Math.PI * 2);
    ctx.fill();
  }
}

// La nuit, sous la pluie : chaque lumière se reflète sur le sol mouillé en une traînée qui ondule, posée à son pied
// (lights : les sources de la carte de lumière, { x, gy, r, k, color, pool }), dans la transformation du monde, après
// la lumière de l'heure. neige : en hiver, une flaque de lumière sur la neige au lieu de la traînée (lueurNeige)
export function drawRefletsPluie(ctx, view, t, rain, night, lights, s = 1, neige = false) {
  // (un reflet est un détail de près : vu de loin, il s'efface)
  const pres = lisse((s - 0.35) / 0.3);
  if (rain <= 0.02 || night <= 0.2 || pres <= 0.02 || !lights || !lights.length) return;
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  const base = ctx.globalAlpha * pres * 0.75;
  for (const [i, l] of lights.entries()) {
    // (seulement d'une lumière dont le pied est connu : sinon le reflet partirait de la flamme, en l'air ; air.js, emit)
    if (l.pool === false || !l.sol || l.k < 0.05) continue;
    const y = l.gy;
    if (neige) {
      if (l.x + l.r > view.x && l.x - l.r < view.x + view.w && y + l.r > view.y && y - l.r < view.y + view.h) lueurNeige(ctx, l, y, t, base * Math.min(1, l.k * rain));
      continue;
    }
    const len = l.r * 2, wid = Math.max(3, l.r * 0.32);
    if (l.x < view.x - wid || l.x > view.x + view.w + wid || y > view.y + view.h || y + len < view.y) continue;
    const sway = Math.sin(t * 2.3 + i) * wid * 0.25;
    ctx.globalAlpha = base * Math.min(1, l.k * rain);
    ctx.drawImage(refletImg(l.color), l.x + sway - wid, y, wid * 2, len);
  }
  ctx.restore();
}
