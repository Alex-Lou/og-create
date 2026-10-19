// Le Géant des profondeurs : une baleine colossale qui glisse sous la mer, de temps en temps, près de ce qu'on
// regarde. De près, on ne voit que l'eau qui s'assombrit, des bulles qui crèvent, un renflement, un sillage ; en
// dézoomant, on découvre sa silhouette, plus grande qu'une plage. Elle monte des profondeurs, souffle un geyser irisé à
// mi-chemin, puis replonge. La nuit, des taches de lumière s'allument le long de son dos, en vague de la tête à la
// queue. Elle est du décor (pour tous) ; tout se déduit du temps.
import { TW, TH, SEA_Z, worldOf } from '../terrain';
import { hash } from '../scene';
import { clamp, lisse as smooth } from '../maths';
import { IRIS } from '../lumiere/arcEnCiel';

export const GEANT_EVERY = 420; // secondes entre deux passages (rare : choix de l'auteur, 18 oct.)
export const GEANT_FOR = 48; // durée d'un passage
const CHEMIN = 24; // cases parcourues
const SOUFFLE = [0.5, 0.6]; // le geyser, en fraction du passage

// Le Géant à l'instant τ de son passage (spot, dir : la case d'eau libre et la direction, view/draw/life.js :
// passageOf) : { x, y (sa tête, en cases), dx, dy, vis (il paraît, puis s'efface), haut (0 au fond, 1 à fleur d'eau),
// souffle (0 à 1 pendant le geyser, sinon null) }
export function geantAt(spot, dir, τ) {
  const [dx, dy] = dir;
  const k = τ / GEANT_FOR;
  const along = (k - 0.5) * CHEMIN;
  const vis = smooth(k / 0.12) * smooth((1 - k) / 0.12);
  const haut = 0.3 + 0.7 * Math.exp(-(((k - 0.55) / 0.16) ** 2));
  const souffle = k >= SOUFFLE[0] && k < SOUFFLE[1] ? (k - SOUFFLE[0]) / (SOUFFLE[1] - SOUFFLE[0]) : null;
  return { x: spot.x + dx * along, y: spot.y + dy * along, dx, dy, vis, haut, souffle };
}

// Son repère sur la mer : sa tête (monde), l'angle de sa nage dans le plan de la mer (avant l'écrasement de la vue)
export function repere(g) {
  const c = worldOf(g.x, g.y, SEA_Z);
  return { x: c.x, y: c.y, angle: Math.atan2(g.dx + g.dy, g.dx - g.dy) };
}
// Pose le repère du Géant : le plan de la mer, écrasé comme la vue (TH / TW), tourné dans sa nage ; +x vers sa tête
export function poser(ctx, r) {
  ctx.translate(r.x, r.y);
  ctx.scale(1, TH / TW);
  ctx.rotate(r.angle);
}

// Sa silhouette, composée à chaque image sur un petit calque (demi-résolution, dans son repère : de la queue, x =
// -760, au museau, x = 40) : nageoires qui battent, corps, queue qui ondule, d'un seul ton, aux bords adoucis ; puis
// posée en transparence (sans coutures entre les morceaux)
const L0 = -760, LW = 800, LH = 360;
let calque = null;
function silhouette(t, ton) {
  if (!calque) { calque = document.createElement('canvas'); calque.width = LW / 2; calque.height = LH / 2; }
  const g = calque.getContext('2d');
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.clearRect(0, 0, calque.width, calque.height);
  g.setTransform(0.5, 0, 0, 0.5, -L0 * 0.5, (LH / 2) * 0.5);
  g.fillStyle = ton;
  g.shadowColor = ton;
  g.shadowBlur = 9;
  // les nageoires, longues et souples, qui battent lentement
  for (const s of [-1, 1]) {
    g.save();
    g.translate(-130, s * 55);
    g.rotate(s * (0.5 + 0.22 * Math.sin(t * 0.8 + (s > 0 ? 0 : 0.6))));
    g.beginPath();
    g.ellipse(-70, s * 18, 95, 22, s * 0.25, 0, Math.PI * 2);
    g.fill();
    g.restore();
  }
  // le corps, du museau rond au pédoncule fin
  g.beginPath();
  g.moveTo(36, 0);
  g.bezierCurveTo(30, -50, -60, -78, -170, -78);
  g.bezierCurveTo(-330, -76, -470, -48, -600, -14);
  g.lineTo(-600, 14);
  g.bezierCurveTo(-470, 48, -330, 76, -170, 78);
  g.bezierCurveTo(-60, 78, 30, 50, 36, 0);
  g.fill();
  // la queue, qui ondule
  g.save();
  g.translate(-595, 0);
  g.rotate(0.2 * Math.sin(t * 1.1));
  g.beginPath();
  g.moveTo(10, 0);
  g.bezierCurveTo(-30, -20, -70, -90, -120, -118);
  g.bezierCurveTo(-110, -70, -100, -30, -82, 0);
  g.bezierCurveTo(-100, 30, -110, 70, -120, 118);
  g.bezierCurveTo(-70, 90, -30, 20, 10, 0);
  g.fill();
  g.restore();
  return calque;
}

// Où on le touche (il entre au Bestiaire), tant qu'on le voit bien : le milieu de son corps (dans le monde), ou null
export function toucherGeant(g) {
  if (g.vis < 0.3) return null;
  const r = repere(g);
  return { x: r.x - Math.cos(r.angle) * 300, y: r.y - Math.sin(r.angle) * 300 * (TH / TW), r: 170 };
}
// Son portrait (le Bestiaire) : sa silhouette vue de dessus, d'un bleu de grand fond, en adresse d'image (tirée une fois)
let portrait = null;
export function portraitGeant() {
  if (!portrait) portrait = silhouette(0, 'rgb(30,62,98)').toDataURL();
  return portrait;
}

// Le Géant sous la mer (dans le monde, avec la mer : la terre le cache) : sa silhouette et ce qu'il fait à la surface
// (renflement, sillage, bulles). night : la nuit (0 à 1)
export function drawGeant(ctx, g, t, night) {
  if (!g || g.vis < 0.01) return;
  const r = repere(g);
  ctx.save();
  poser(ctx, r);
  // la silhouette : plus sombre et plus nette à fleur d'eau, pâle au fond
  ctx.globalAlpha = (0.16 + 0.34 * g.haut) * g.vis;
  ctx.drawImage(silhouette(t, night > 0.5 ? 'rgb(6,16,34)' : 'rgb(14,40,72)'), L0, -LH / 2, LW, LH);
  // l'eau qui se bombe au-dessus de sa tête
  const bombe = ctx.createRadialGradient(-60, 0, 0, -60, 0, 160);
  bombe.addColorStop(0, `rgba(220,240,255,${(0.14 * g.haut * g.vis).toFixed(3)})`);
  bombe.addColorStop(1, 'rgba(220,240,255,0)');
  ctx.fillStyle = bombe;
  ctx.fillRect(-220, -160, 320, 320);
  // le sillage d'écume, en V, quand il nage à fleur d'eau
  const sillage = clamp((g.haut - 0.55) / 0.35) * g.vis;
  if (sillage > 0.02) {
    ctx.strokeStyle = `rgba(255,255,255,${(0.35 * sillage).toFixed(3)})`;
    ctx.lineWidth = 5;
    ctx.setLineDash([26, 18]);
    ctx.lineDashOffset = t * 60;
    for (const s of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(40, 0);
      ctx.quadraticCurveTo(-120, s * 60, -340, s * 170);
      ctx.stroke();
    }
    ctx.setLineDash([]);
  }
  // les bulles qui montent de son dos et crèvent en surface
  for (let i = 0; i < 22; i++) {
    const u = (t / (2.2 + hash(i, 71)) + hash(i, 73)) % 1;
    const x = -20 - hash(i, 75) * 560, y = (hash(i, 77) - 0.5) * 120 * (1 - (-x) / 900);
    const a = g.vis * (0.3 + 0.7 * g.haut) * (u < 0.8 ? u / 0.8 : 1 - (u - 0.8) / 0.2);
    if (a < 0.03) continue;
    const rr = u < 0.8 ? 3 + 3 * hash(i, 79) : 3 + 14 * (u - 0.8) / 0.2;
    ctx.strokeStyle = `rgba(255,255,255,${(0.6 * a).toFixed(3)})`;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.arc(x, y, rr, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
}

// La nuit, ses taches de lumière, en vague de la tête à la queue (dans le monde, après la carte de lumière qui les
// éteindrait, comme le plancton et les méduses)
export function drawLueursGeant(ctx, g, t, night) {
  if (!g || g.vis < 0.01 || night < 0.2) return;
  ctx.save();
  poser(ctx, repere(g));
  ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 16; i++) {
    const x = -40 - i * 34, y = (i % 2 ? 1 : -1) * (14 + 10 * hash(i, 61)) * (1 - i / 22);
    const a = (0.5 + 0.5 * Math.sin(t * 2.4 - i * 0.55)) * night * g.vis * (0.4 + 0.6 * g.haut);
    if (a < 0.03) continue;
    const rr = 7 + 4 * hash(i, 63);
    const lum = ctx.createRadialGradient(x, y, 0, x, y, rr * 2.2);
    lum.addColorStop(0, `rgba(150,240,255,${(0.9 * a).toFixed(3)})`);
    lum.addColorStop(1, 'rgba(150,240,255,0)');
    ctx.fillStyle = lum;
    ctx.fillRect(x - rr * 2.2, y - rr * 2.2, rr * 4.4, rr * 4.4);
  }
  ctx.restore();
}

// Le geyser (dans le monde, par-dessus l'île : il se voit même derrière une côte) : une colonne d'embruns qui monte puis
// retombe en gouttes, une brume irisée à son sommet, des ronds autour de l'évent
const HAUT_GEYSER = 150;
export function drawGeyser(ctx, g) {
  if (!g || g.souffle === null || g.vis < 0.01) return;
  const r = repere(g);
  // (l'évent : un peu derrière la tête, dans son repère)
  const ev = { x: r.x + Math.cos(r.angle) * -60, y: r.y + Math.sin(r.angle) * -60 * (TH / TW) };
  const k = g.souffle;
  const monte = smooth(k / 0.3), tombe = smooth((k - 0.45) / 0.55);
  ctx.save();
  // les ronds autour de l'évent
  for (const lag of [0, 0.2, 0.4]) {
    const q = k - lag;
    if (q <= 0 || q >= 1) continue;
    ctx.strokeStyle = `rgba(255,255,255,${(0.6 * (1 - q) * g.vis).toFixed(3)})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(ev.x, ev.y, 20 + q * 90, (20 + q * 90) * (TH / TW), 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  // la colonne
  const h = HAUT_GEYSER * monte * (1 - 0.35 * tombe);
  const col = ctx.createLinearGradient(ev.x, ev.y, ev.x, ev.y - h);
  col.addColorStop(0, `rgba(255,255,255,${(0.75 * (1 - tombe) * g.vis).toFixed(3)})`);
  col.addColorStop(1, 'rgba(235,245,255,0)');
  ctx.fillStyle = col;
  ctx.beginPath();
  ctx.ellipse(ev.x, ev.y - h / 2, 14 + 10 * monte, h / 2 + 1, 0, 0, Math.PI * 2);
  ctx.fill();
  // la brume irisée au sommet
  ctx.globalCompositeOperation = 'screen';
  IRIS.forEach((c, i) => {
    const a = Math.sin(Math.PI * clamp(k * 1.2)) * 0.22 * g.vis;
    if (a < 0.01) return;
    const x = ev.x + (i - 3) * 9, y = ev.y - h * 0.85 + Math.abs(i - 3) * 4;
    const m = ctx.createRadialGradient(x, y, 0, x, y, 34);
    m.addColorStop(0, `rgba(${c},${a.toFixed(3)})`);
    m.addColorStop(1, `rgba(${c},0)`);
    ctx.fillStyle = m;
    ctx.fillRect(x - 34, y - 34, 68, 68);
  });
  ctx.globalCompositeOperation = 'source-over';
  // les gouttes : lancées vers le haut, elles retombent en arc
  const u = k * 2.6;
  for (let i = 0; i < 46; i++) {
    const a = -Math.PI / 2 + (hash(i, 81) - 0.5) * 1.1;
    const v = 120 + hash(i, 83) * 110;
    const x = ev.x + Math.cos(a) * v * u * 0.6;
    const y = ev.y + Math.sin(a) * v * u + 140 * u * u;
    if (y > ev.y + 6) continue;
    const s = 2 + 2.5 * hash(i, 85);
    ctx.fillStyle = `rgba(240,248,255,${(0.85 * (1 - k) * g.vis).toFixed(3)})`;
    ctx.beginPath();
    ctx.arc(x, y, s, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}
