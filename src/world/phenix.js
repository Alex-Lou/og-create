// Le vol du Phénix (HISTOIRE.md, acte VI : « Ta flamme, notre vie. » Brume renaît en Phénix). Une fois le Phénix écrit
// au Grimoire, du coucher du soleil à l'aube, de temps en temps : Brume se change en Phénix là où elle flotte (un éclat,
// ses ailes de flamme se déploient), s'envole, fait un grand tour au-dessus de ce qu'on regarde en semant des braises et
// en éclairant le sol, puis revient à sa place et se replie en petite flamme. Avant l'acte VI, rien : on ne dévoile
// rien. Un toucher : elle lâche une gerbe de braises. Tout se déduit du temps.

const clamp = v => Math.min(1, Math.max(0, v));
const smooth = v => { const k = clamp(v); return k * k * (3 - 2 * k); };

export const PHENIX_EVERY = 240; // secondes entre deux vols
export const PHENIX_FOR = 16; // durée d'un vol
export const PHENIX_DECALE = 30; // le premier vol, après ce temps (s)
const ALTITUDE = 150; // hauteur du grand tour au-dessus du sol (unités du monde)
const DEPLIE = 0.07; // part du vol pour se changer en Phénix (et autant pour se replier)
const TRACE = 22; // braises de la traînée
const TRACE_DT = 0.055; // leur écart dans le temps (s)
const SILLAGE = 18; // points du chemin récent, que suivent les plumes de la queue
const SILLAGE_DT = 0.035;

// Du coucher du soleil à l'aube (world/sky.js : le couchant, le crépuscule, la nuit et le début de l'aube)
export const phenixHeure = phase => Boolean(phase) && (phase.night > 0.25 || phase.id === 'sunset' || phase.id === 'dusk');

// Le chemin du vol : depuis sa place (depart : { x, y en l'air, g : le sol sous elle }), elle monte, fait un tour
// complet d'une ellipse autour de centre (le milieu de ce qu'on regardait quand elle s'est envolée ; rayon : son demi-
// grand axe), puis revient. Des points de passage, parcourus en Catmull-Rom à vitesse à peu près constante
function cheminOf(depart, centre, rayon) {
  const rx = rayon, ry = rayon * 0.42;
  // (l'entrée du tour : le point de l'ellipse le plus proche d'elle)
  const a0 = Math.atan2((depart.g - centre.y) / ry, (depart.x - centre.x) / rx);
  const tour = Array.from({ length: 13 }, (_, i) => {
    const a = a0 - (i / 12) * Math.PI * 2; // (dans le sens des aiguilles d'une montre à l'écran)
    const g = centre.y + Math.sin(a) * ry;
    return { x: centre.x + Math.cos(a) * rx, y: g - ALTITUDE, g };
  });
  const monte = { x: depart.x + (tour[0].x - depart.x) * 0.25, y: Math.min(depart.y, tour[0].y) - 30, g: depart.g + (tour[0].g - depart.g) * 0.25 };
  const pts = [depart, monte, ...tour, monte, depart];
  // les instants de passage, au prorata des distances
  const d = [0];
  for (let i = 1; i < pts.length; i++) d.push(d[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y) + 1);
  return { pts, d, total: d[d.length - 1] };
}
const catmull = (p0, p1, p2, p3, u) => {
  const u2 = u * u, u3 = u2 * u;
  return 0.5 * (2 * p1 + (-p0 + p2) * u + (2 * p0 - 5 * p1 + 4 * p2 - p3) * u2 + (-p0 + 3 * p1 - 3 * p2 + p3) * u3);
};
// Le point du chemin à la fraction f (0 au départ, 1 au retour)
function pointOf(ch, f) {
  const at = clamp(f) * ch.total;
  let i = 1;
  while (i < ch.d.length - 1 && ch.d[i] < at) i++;
  const u = (at - ch.d[i - 1]) / (ch.d[i] - ch.d[i - 1]);
  const P = ch.pts, n = P.length - 1;
  const q = [P[Math.max(0, i - 2)], P[i - 1], P[i], P[Math.min(n, i + 1)]];
  return { x: catmull(q[0].x, q[1].x, q[2].x, q[3].x, u), y: catmull(q[0].y, q[1].y, q[2].y, q[3].y, u), g: catmull(q[0].g, q[1].g, q[2].g, q[3].g, u) };
}
// Le temps du vol → la fraction du chemin : elle reste sur place le temps de se changer, accélère, file, ralentit
const fractionOf = k => smooth((k - DEPLIE) / (1 - 2 * DEPLIE)) * 0.15 + clamp((k - DEPLIE) / (1 - 2 * DEPLIE)) * 0.85;

// Le Phénix à l'instant τ de son vol : { x, y (en l'air), g (le sol sous lui), vx, vy (sa vitesse à l'écran), ailes
// (0 replié à 1 déployé), forme (0 : la petite flamme de Brume, 1 : le Phénix), eclat (l'éclair du changement, 0 à 1),
// trace [{ x, y, a }] (les braises semées derrière lui, la plus récente d'abord), k (0 à 1 : le vol) } ; null hors vol
export function phenixAt(depart, centre, rayon, τ) {
  if (!(τ >= 0 && τ < PHENIX_FOR)) return null;
  const k = τ / PHENIX_FOR;
  const ch = cheminOf(depart, centre, rayon);
  const p = pointOf(ch, fractionOf(k));
  const q = pointOf(ch, fractionOf(Math.min(1, k + 0.004)));
  const forme = smooth(k / DEPLIE) * smooth((1 - k) / DEPLIE);
  const eclat = Math.max(0, 1 - Math.abs(k - DEPLIE * 0.5) / (DEPLIE * 0.5)) + Math.max(0, 1 - Math.abs(k - (1 - DEPLIE * 0.5)) / (DEPLIE * 0.5));
  const trace = [];
  for (let i = 1; i <= TRACE; i++) {
    const kb = k - (i * TRACE_DT) / PHENIX_FOR;
    if (kb <= DEPLIE * 0.5) break;
    const b = pointOf(ch, fractionOf(kb));
    // (les braises retombent doucement et s'éteignent)
    trace.push({ x: b.x, y: b.y + i * 0.9, a: (1 - i / TRACE) * forme });
  }
  // le chemin récent (le plus récent d'abord), sur lequel ondule la queue
  const sillage = [{ x: p.x, y: p.y }];
  for (let i = 1; i <= SILLAGE; i++) {
    const b = pointOf(ch, fractionOf(Math.max(0, k - (i * SILLAGE_DT) / PHENIX_FOR)));
    sillage.push({ x: b.x, y: b.y });
  }
  return { x: p.x, y: p.y, g: p.g, vx: q.x - p.x, vy: q.y - p.y, ailes: smooth((forme - 0.25) / 0.75), forme, eclat: Math.min(1, eclat), trace, sillage, k };
}

// Sa lumière sur le sol (une source de la carte de lumière : world/lumiere) : chaude, plus forte la nuit
export function lumierePhenix(ph, night, s = 1) {
  const r = (50 + 30 * ph.forme) * Math.max(1, 0.6 / s);
  return { x: ph.x, y: ph.y, gy: ph.g, r, k: (0.18 + 0.42 * night) * (0.4 + 0.6 * ph.forme) + ph.eclat * 0.3, color: '255,140,60', pool: true };
}

// ——— le dessin ———
const R2 = n => Math.round(n * 100) / 100;
// Une plume de flamme : une goutte effilée de la base (0, 0) vers la pointe (L, 0), large de w, la pointe qui ondule
function plume(ctx, L, w, ond) {
  ctx.beginPath();
  ctx.moveTo(0, -w * 0.5);
  ctx.bezierCurveTo(L * 0.35, -w * 0.75, L * 0.75, -w * 0.3 + ond, L, ond);
  ctx.bezierCurveTo(L * 0.7, w * 0.35 + ond, L * 0.3, w * 0.7, 0, w * 0.5);
  ctx.closePath();
}
// Une aile de flamme vue de trois quarts, depuis l'épaule (0, 0) : six plumes en éventail, du cœur doré aux pointes
// pourpres, qui vacillent ; ouverte (0 à 1), bat (-1 en bas à 1 en haut), loin : l'aile de derrière (plus courte, plus
// sombre)
function aile(ctx, r, ouverte, bat, t, loin) {
  const L = r * (loin ? 2.9 : 3.5) * ouverte;
  if (L < 0.5) return;
  const base = -0.5 - bat * 0.75; // (l'angle de l'aile : vers l'arrière et le haut quand elle monte)
  const grad = ctx.createRadialGradient(0, 0, r * 0.2, 0, 0, L);
  grad.addColorStop(0, loin ? '#FFD98A' : '#FFF6D2');
  grad.addColorStop(0.45, loin ? '#F2903E' : '#FFB24A');
  grad.addColorStop(1, loin ? '#B8301C' : '#E8482A');
  for (let i = 5; i >= 0; i--) {
    const a = base - 0.95 + i * 0.36;
    const len = L * (0.62 + 0.38 * Math.sin(((i + 0.5) / 6) * Math.PI)) * (1 + 0.06 * Math.sin(t * 11 + i * 2.1));
    ctx.save();
    ctx.rotate(-a - Math.PI);
    plume(ctx, len, r * (0.95 - i * 0.05), Math.sin(t * 9 + i * 1.3) * r * 0.18);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.lineWidth = Math.max(0.5, r * 0.08);
    ctx.strokeStyle = loin ? 'rgba(96,20,12,.7)' : 'rgba(120,28,14,.85)';
    ctx.stroke();
    ctx.restore();
  }
  // le liseré clair du bord d'attaque
  if (!loin) {
    ctx.save();
    ctx.rotate(-(base - 0.95 + 5 * 0.36) - Math.PI);
    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = 'rgba(255,240,200,.55)';
    ctx.lineWidth = Math.max(0.5, r * 0.12);
    ctx.beginPath();
    ctx.moveTo(r * 0.3, -r * 0.3);
    ctx.quadraticCurveTo(L * 0.5, -r * 0.55, L * 0.9, -r * 0.1);
    ctx.stroke();
    ctx.restore();
  }
}
// La goutte du corps (bas rond en (0, 0), pointe en haut, rayon r)
function goutte(ctx, r, sway) {
  ctx.beginPath();
  ctx.moveTo(0, r);
  ctx.bezierCurveTo(r * 1.3, r, r * 1.15, -r * 0.45, sway, -r * 2.1);
  ctx.bezierCurveTo(-r * 1.15, -r * 0.45, -r * 1.3, r, 0, r);
  ctx.closePath();
}
// Les plumes de la queue : trois rubans qui suivent le chemin récent (sillage, dans le monde), ondulent de part et
// d'autre, s'effilent et s'éteignent ; au bout des deux longues, un orbe de flamme
function queue(ctx, ph, r, t) {
  const pts = ph.sillage;
  if (!pts || pts.length < 3 || ph.forme < 0.05) return;
  const plumes = [[1, 0, 1], [0.8, 1.9, -1], [0.62, 3.7, 1]];
  for (const [long, ph0, sens] of plumes) {
    const n = Math.max(3, Math.round((pts.length - 1) * long * ph.forme));
    const gauche = [], droite = [];
    for (let i = 0; i <= n; i++) {
      const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
      let nx = -(b.y - a.y), ny = b.x - a.x;
      const l = Math.hypot(nx, ny) || 1;
      nx /= l; ny /= l;
      const u = i / n;
      const ond = Math.sin(t * 7 - u * 5 + ph0) * r * 1.1 * u * sens;
      const w = r * 0.55 * (1 - u) ** 0.9 + r * 0.06;
      const c = { x: pts[i].x + nx * ond, y: pts[i].y + ny * ond + r * 0.4 };
      gauche.push([c.x + nx * w, c.y + ny * w]);
      droite.push([c.x - nx * w, c.y - ny * w]);
    }
    const fin = pts[n];
    const g = ctx.createLinearGradient(pts[0].x, pts[0].y, fin.x, fin.y);
    g.addColorStop(0, 'rgba(255,236,170,.95)');
    g.addColorStop(0.4, 'rgba(255,150,60,.85)');
    g.addColorStop(1, 'rgba(200,40,30,0)');
    ctx.beginPath();
    ctx.moveTo(gauche[0][0], gauche[0][1]);
    for (const [x, y] of gauche.slice(1)) ctx.lineTo(x, y);
    for (const [x, y] of droite.reverse()) ctx.lineTo(x, y);
    ctx.closePath();
    ctx.fillStyle = g;
    ctx.fill();
    if (long > 0.75) {
      const [ox, oy] = [(gauche[gauche.length - 1][0] + droite[0][0]) / 2, (gauche[gauche.length - 1][1] + droite[0][1]) / 2];
      const o = ctx.createRadialGradient(ox, oy, 0, ox, oy, r * 0.9);
      o.addColorStop(0, `rgba(255,248,220,${R2(0.9 * ph.forme)})`);
      o.addColorStop(0.5, `rgba(255,150,60,${R2(0.6 * ph.forme)})`);
      o.addColorStop(1, 'rgba(232,72,40,0)');
      ctx.fillStyle = o;
      ctx.beginPath();
      ctx.arc(ox, oy, r * 0.9, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

// Le Phénix en vol (au-dessus de tout : il luit lui-même), à l'échelle du monde ; s : le zoom (il grossit un peu de loin,
// comme Brume) ; touche : l'instant (s) du dernier toucher, ou null
export function drawPhenix(ctx, ph, t, s = 1, touche = null) {
  const z = Math.max(1, 0.6 / s);
  const r = 8 * z * (1 + 0.5 * ph.forme);
  const cy = ph.y - r * 0.5;
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  // le voile large et doux, puis la lueur serrée
  const voile = ctx.createRadialGradient(ph.x, cy, 0, ph.x, cy, r * 7);
  voile.addColorStop(0, `rgba(255,150,70,${R2(0.2 + 0.25 * ph.eclat)})`);
  voile.addColorStop(1, 'rgba(255,110,50,0)');
  ctx.fillStyle = voile;
  ctx.fillRect(ph.x - r * 7, cy - r * 7, r * 14, r * 14);
  // la queue, sur le chemin parcouru
  queue(ctx, ph, r, t);
  // la traînée de braises, qui retombent et palpitent ; quelques éclats pâles (la brume qu'elle était)
  ph.trace.forEach((b, i) => {
    const fl = 0.6 + 0.4 * Math.sin(t * 19 + i * 2.3);
    const pale = i % 7 === 3;
    const dx = Math.sin(t * 3 + i) * r * 0.6;
    ctx.fillStyle = pale ? `rgba(200,236,255,${R2(0.7 * b.a * fl)})` : `rgba(255,${Math.round(140 + 90 * b.a)},70,${R2(0.8 * b.a * fl)})`;
    ctx.beginPath();
    ctx.arc(b.x + dx, b.y + (i % 3) * r * 0.3, (0.5 + 1.6 * b.a) * z, 0, Math.PI * 2);
    ctx.fill();
  });
  // l'éclair du changement : un anneau qui s'ouvre
  if (ph.eclat > 0.01) {
    ctx.strokeStyle = `rgba(255,236,190,${R2(ph.eclat * 0.8)})`;
    ctx.lineWidth = r * 0.35 * ph.eclat;
    ctx.beginPath();
    ctx.arc(ph.x, cy, r * (4.5 - 3 * ph.eclat), 0, Math.PI * 2);
    ctx.stroke();
  }
  // la gerbe de braises d'un toucher (1,2 s)
  const dt = touche === null ? -1 : t - touche;
  if (dt >= 0 && dt < 1.2) {
    for (let i = 0; i < 22; i++) {
      const a = (i / 22) * Math.PI * 2 + i * 0.37, v = r * (3 + (i % 5) * 0.7) * Math.sqrt(dt / 1.2);
      ctx.fillStyle = i % 6 === 2 ? `rgba(200,236,255,${R2(0.9 * (1 - dt / 1.2))})` : `rgba(255,${180 + (i % 3) * 25},90,${R2(0.9 * (1 - dt / 1.2))})`;
      ctx.beginPath();
      ctx.arc(ph.x + Math.cos(a) * v, cy + Math.sin(a) * v + dt * dt * r * 2.5, r * 0.2 * (1 - dt / 1.6), 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
  // le Phénix : tourné vers où il va, penché avec sa pente
  const dir = ph.vx < -0.01 ? -1 : 1;
  const pente = Math.max(-0.4, Math.min(0.4, Math.atan2(ph.vy, Math.abs(ph.vx) + 1e-3) * 0.5));
  const bat = Math.sin(t * (6.5 + Math.max(0, -ph.vy) * 0.5));
  ctx.save();
  ctx.translate(ph.x, ph.y);
  ctx.scale(dir, 1);
  ctx.rotate(pente * ph.forme);
  // l'aile de derrière
  ctx.save();
  ctx.translate(-r * 0.15, -r * 0.55);
  ctx.scale(-0.82, 0.9);
  aile(ctx, r, ph.ailes, bat * 0.9, t, true);
  ctx.restore();
  // le corps : la goutte de Brume, son bord feu, son cœur clair ; la crête, trois petites flammes qui s'enroulent
  const sway = Math.sin(t * 5) * r * 0.25 - r * 0.35 * ph.forme;
  for (let i = 0; i < 3; i++) {
    ctx.save();
    ctx.translate(sway * 0.8 - i * r * 0.28, -r * (1.85 - i * 0.18));
    ctx.rotate(-2.3 - i * 0.35 + Math.sin(t * 6 + i) * 0.15);
    plume(ctx, r * (1.2 - i * 0.25) * ph.forme, r * 0.42, Math.sin(t * 8 + i) * r * 0.1);
    ctx.fillStyle = i === 0 ? '#FFB24A' : '#F27A36';
    ctx.fill();
    ctx.lineWidth = Math.max(0.5, r * 0.07);
    ctx.strokeStyle = 'rgba(120,28,14,.8)';
    ctx.stroke();
    ctx.restore();
  }
  const body = ctx.createRadialGradient(r * 0.15, r * 0.1, r * 0.15, 0, -r * 0.3, r * 2.2);
  body.addColorStop(0, '#FFFDF0');
  body.addColorStop(0.42, '#FFD27A');
  body.addColorStop(0.8, '#FF8A3C');
  body.addColorStop(1, '#E8482A');
  ctx.fillStyle = body;
  goutte(ctx, r, sway);
  ctx.fill();
  ctx.lineWidth = Math.max(0.6, r * 0.1);
  ctx.strokeStyle = 'rgba(120,28,14,.85)';
  ctx.stroke();
  ctx.save();
  ctx.translate(r * 0.12, r * 0.3);
  ctx.fillStyle = 'rgba(255,255,240,.8)';
  goutte(ctx, r * 0.52, sway * 0.5);
  ctx.fill();
  ctx.restore();
  // ses yeux (le visage de la bibliothèque : ovales bleu nuit, deux reflets), tournés vers l'avant ; les joues
  const k = r / 8;
  for (const [ex, sc] of [[r * 0.05, 0.92], [r * 0.62, 1]]) {
    const ey = -r * 0.08;
    ctx.fillStyle = '#1D3557';
    ctx.beginPath();
    ctx.ellipse(ex, ey, 1.35 * k * sc, 1.95 * k * sc, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.ellipse(ex - 0.4 * k, ey - 0.8 * k, 0.55 * k, 0.6 * k, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(ex + 0.45 * k, ey + 0.8 * k, 0.26 * k, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = 'rgba(247,140,120,.55)';
  ctx.beginPath();
  ctx.ellipse(r * 0.9, r * 0.32, 1.4 * k, 0.8 * k, 0, 0, Math.PI * 2);
  ctx.fill();
  // l'aile de devant
  ctx.save();
  ctx.translate(r * 0.1, -r * 0.4);
  aile(ctx, r, ph.ailes, bat, t, false);
  ctx.restore();
  // la lueur serrée par-dessus (le cœur qui brûle)
  ctx.globalCompositeOperation = 'lighter';
  const coeur = ctx.createRadialGradient(r * 0.1, -r * 0.2, 0, r * 0.1, -r * 0.2, r * 2.6);
  coeur.addColorStop(0, `rgba(255,236,190,${R2(0.35 + 0.4 * ph.eclat)})`);
  coeur.addColorStop(1, 'rgba(255,170,90,0)');
  ctx.fillStyle = coeur;
  ctx.beginPath();
  ctx.arc(r * 0.1, -r * 0.2, r * 2.6, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}
