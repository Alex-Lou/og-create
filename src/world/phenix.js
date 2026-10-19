// Le vol du Phénix (HISTOIRE.md, acte VI : « Ta flamme, notre vie. » Brume renaît en Phénix). Une fois le Phénix écrit
// au Grimoire, du coucher du soleil à l'aube, de temps en temps : Brume se change en Phénix là où elle flotte (un éclat,
// ses ailes de flamme se déploient), s'envole, fait un grand tour au-dessus de ce qu'on regarde en semant des braises et
// en éclairant le sol, puis revient à sa place et se replie en petite flamme. Avant l'acte VI, rien : on ne dévoile
// rien. Un toucher : elle lâche une gerbe de braises. Tout se déduit du temps.

import { clamp, lisse as smooth } from './maths';

export const PHENIX_EVERY = 240; // secondes entre deux vols
export const PHENIX_FOR = 16; // durée d'un vol
export const PHENIX_DECALE = 30; // le premier vol, après ce temps (s)
const ALTITUDE = 150; // hauteur du grand tour au-dessus du sol (unités du monde)
const DEPLIE = 0.07; // part du vol pour se changer en Phénix (et autant pour se replier)
const TRACE = 22; // braises de la traînée
const TRACE_DT = 0.055; // leur écart dans le temps (s)
const SILLAGE = 26; // points du chemin récent, que suivent les plumes de la queue
const SILLAGE_DT = 0.055;

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
// Un grand oiseau de feu, à l'échelle du Kraken et du Géant : de longues ailes de plumes de flamme, un cou, une tête à
// bec et à crête, une traîne de plumes qui suit son vol ; tout est lumière (rendu additif, comme la nuit dans Ori) ; au
// cœur de sa poitrine, la petite flamme de Brume, pâle, qui bat.
const R2 = n => Math.round(n * 100) / 100;
const lerp = (a, b, u) => a + (b - a) * u;
// Une aile, dessinée relevée (l'épaule en (0, 0), le poignet, la pointe vers le haut et l'arrière), puis aplatie par f
// (1 : levée, 0 : de profil, -1 : abaissée sous le corps) : le bord d'attaque doré, le bord de fuite en sept plumes de
// flamme qui vacillent, le dégradé or, orange, pourpre, le trait sombre, les rachis clairs ; a : l'intensité (l'aile de
// derrière, plus sombre)
function aile(ctx, R, f, t, loin) {
  const k = Math.sign(f || 1) * Math.max(0.12, Math.abs(f));
  ctx.save();
  ctx.scale(1, k);
  const W = [-R * 0.55, -R * 1.25], P = [-R * 1.7, -R * 2.55];
  ctx.beginPath();
  ctx.moveTo(R * 0.25, -R * 0.05);
  ctx.bezierCurveTo(R * 0.1, -R * 0.75, W[0] + R * 0.25, W[1] - R * 0.15, W[0], W[1]);
  ctx.bezierCurveTo(W[0] - R * 0.35, W[1] - R * 0.5, P[0] + R * 0.35, P[1] + R * 0.1, P[0], P[1]);
  // le bord de fuite : de la pointe vers le corps, des plumes en flamme
  const plumes = 7;
  let prev = P;
  for (let i = 1; i <= plumes; i++) {
    const u = i / plumes;
    const base = [lerp(P[0], -R * 0.9, u) + R * 0.35 * Math.sin(u * Math.PI), lerp(P[1], R * 0.2, u)];
    const vac = Math.sin(t * 9 + i * 1.7) * R * 0.08;
    const pointe = [lerp(prev[0], base[0], 0.5) - R * (0.55 - 0.25 * u) + vac, lerp(prev[1], base[1], 0.5) + R * 0.25];
    ctx.quadraticCurveTo(pointe[0] + R * 0.15, pointe[1] - R * 0.25, pointe[0], pointe[1]);
    ctx.quadraticCurveTo(base[0] - R * 0.1, base[1] - R * 0.05, base[0], base[1]);
    prev = base;
  }
  ctx.quadraticCurveTo(-R * 0.3, R * 0.25, R * 0.25, -R * 0.05);
  ctx.closePath();
  const g = ctx.createLinearGradient(R * 0.1, -R * 0.4, -R * 1.6, -R * 1.2);
  g.addColorStop(0, loin ? '#E8A04A' : '#FFE9A8');
  g.addColorStop(0.4, loin ? '#D0662E' : '#FFA040');
  g.addColorStop(1, loin ? '#8E2418' : '#D83A24');
  ctx.fillStyle = g;
  ctx.fill();
  ctx.lineWidth = Math.max(1, R * 0.05);
  ctx.strokeStyle = loin ? 'rgba(70,14,10,.8)' : 'rgba(96,18,10,.9)';
  ctx.stroke();
  // les rachis des rémiges, et le liseré lumineux du bord d'attaque
  ctx.lineCap = 'round';
  ctx.strokeStyle = loin ? 'rgba(255,210,150,.25)' : 'rgba(255,236,190,.55)';
  ctx.lineWidth = Math.max(0.6, R * 0.035);
  for (let i = 1; i < 6; i++) {
    const u = i / 6;
    ctx.beginPath();
    ctx.moveTo(lerp(W[0], R * 0.1, 1 - u) , lerp(W[1], -R * 0.2, 1 - u));
    ctx.lineTo(lerp(P[0], -R * 0.9, u) - R * 0.25, lerp(P[1], R * 0.2, u) + R * 0.1);
    ctx.stroke();
  }
  if (!loin) {
    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = 'rgba(255,240,200,.6)';
    ctx.lineWidth = Math.max(1, R * 0.07);
    ctx.beginPath();
    ctx.moveTo(R * 0.2, -R * 0.15);
    ctx.bezierCurveTo(R * 0.05, -R * 0.75, W[0] + R * 0.2, W[1] - R * 0.15, W[0], W[1]);
    ctx.bezierCurveTo(W[0] - R * 0.3, W[1] - R * 0.45, P[0] + R * 0.35, P[1] + R * 0.12, P[0], P[1]);
    ctx.stroke();
  }
  ctx.restore();
}
// Une plume de crête : effilée, de la base (0, 0) vers la pointe (L, c)
function plume(ctx, L, w, c, couleur) {
  if (L < 0.5) return;
  ctx.beginPath();
  ctx.moveTo(0, -w * 0.5);
  ctx.bezierCurveTo(L * 0.3, -w * 0.62, L * 0.7, c - w * 0.3, L, c);
  ctx.bezierCurveTo(L * 0.7, c + w * 0.22, L * 0.3, w * 0.55, 0, w * 0.5);
  ctx.closePath();
  ctx.fillStyle = couleur;
  ctx.fill();
  ctx.stroke();
}
// La traîne : cinq plumes qui suivent le chemin récent (sillage, dans le monde), ondulent et s'effilent ; au bout des
// deux longues, un œil de flamme
function traine(ctx, ph, R, t) {
  if (!ph.sillage || ph.sillage.length < 3 || ph.forme < 0.05) return;
  // (elle part de l'arrière du corps : le chemin, reculé d'un corps)
  const v = Math.hypot(ph.vx, ph.vy) || 1, bx = -(ph.vx / v) * R * 0.8, by = -(ph.vy / v) * R * 0.8 + R * 0.02;
  const pts = ph.sillage.map(q => ({ x: q.x + bx, y: q.y + by }));
  const plumes = [[0.55, 5.6, 1, 0.2], [0.66, 4.4, -1, 0.24], [0.78, 3.1, 1, 0.28], [0.9, 1.7, -1, 0.32], [1, 0, 1, 0.38]];
  for (const [long, ph0, sens, large] of plumes) {
    const n = Math.max(3, Math.round((pts.length - 1) * long * ph.forme));
    const g1 = [], g2 = [];
    for (let i = 0; i <= n; i++) {
      const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
      let nx = -(b.y - a.y), ny = b.x - a.x;
      const l = Math.hypot(nx, ny) || 1;
      nx /= l; ny /= l;
      const u = i / n;
      const ond = Math.sin(t * 4.5 - u * 4 + ph0) * R * 0.6 * u * sens;
      const w = R * large * (0.7 + 0.3 * Math.sin(Math.min(1, u * 3) * Math.PI * 0.5)) * (1 - u) ** 0.65 + R * 0.04;
      const cx = pts[i].x + nx * ond, cy = pts[i].y + ny * ond + R * 0.1;
      g1.push([cx + nx * w, cy + ny * w]);
      g2.push([cx - nx * w, cy - ny * w]);
    }
    const fin = pts[n];
    const g = ctx.createLinearGradient(pts[0].x, pts[0].y, fin.x, fin.y);
    g.addColorStop(0, '#FFC660');
    g.addColorStop(0.55, 'rgba(240,100,44,.92)');
    g.addColorStop(1, 'rgba(180,30,30,0)');
    ctx.beginPath();
    ctx.moveTo(g1[0][0], g1[0][1]);
    for (const [x, y] of g1.slice(1)) ctx.lineTo(x, y);
    for (const [x, y] of g2.reverse()) ctx.lineTo(x, y);
    ctx.closePath();
    ctx.fillStyle = g;
    ctx.fill();
    // la veine claire de la plume
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.beginPath();
    g1.forEach(([x, y], i) => { const [x2, y2] = g2[g2.length - 1 - i]; if (i) ctx.lineTo((x + x2) / 2, (y + y2) / 2); else ctx.moveTo((x + x2) / 2, (y + y2) / 2); });
    ctx.strokeStyle = 'rgba(255,236,180,.45)';
    ctx.lineWidth = Math.max(0.8, R * large * 0.25);
    ctx.lineCap = 'round';
    ctx.stroke();
    ctx.restore();
    if (long > 0.85) {
      const [ox, oy] = [(g1[g1.length - 1][0] + g2[0][0]) / 2, (g1[g1.length - 1][1] + g2[0][1]) / 2];
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      const o = ctx.createRadialGradient(ox, oy, 0, ox, oy, R * 0.45);
      o.addColorStop(0, `rgba(255,240,200,${R2(0.85 * ph.forme)})`);
      o.addColorStop(0.5, `rgba(255,140,60,${R2(0.45 * ph.forme)})`);
      o.addColorStop(1, 'rgba(232,72,40,0)');
      ctx.fillStyle = o;
      ctx.beginPath();
      ctx.arc(ox, oy, R * 0.45, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }
}
// Des langues de flamme qui lèchent un bord (pts : leurs pieds) et montent en vacillant (additif)
function langues(ctx, R, t, pts) {
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  pts.forEach(([x, y], i) => {
    const h = R * (0.35 + 0.2 * Math.sin(t * 11 + i * 2.3)), w = R * 0.14, sw = Math.sin(t * 8 + i) * R * 0.08;
    const g = ctx.createLinearGradient(x, y, x, y - h);
    g.addColorStop(0, 'rgba(255,200,110,.55)');
    g.addColorStop(1, 'rgba(255,120,60,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(x - w, y);
    ctx.quadraticCurveTo(x - w * 0.5, y - h * 0.6, x + sw, y - h);
    ctx.quadraticCurveTo(x + w * 0.5, y - h * 0.6, x + w, y);
    ctx.closePath();
    ctx.fill();
  });
  ctx.restore();
}
// La petite flamme de Brume (pointe en haut, bas rond en (0, 0), rayon r)
function goutte(ctx, r, sway) {
  ctx.beginPath();
  ctx.moveTo(0, r);
  ctx.bezierCurveTo(r * 1.3, r, r * 1.15, -r * 0.45, sway, -r * 2.1);
  ctx.bezierCurveTo(-r * 1.15, -r * 0.45, -r * 1.3, r, 0, r);
  ctx.closePath();
}

// Le Phénix en vol (au-dessus de tout : il luit lui-même), à l'échelle du monde ; s : le zoom (il grossit un peu de loin,
// comme Brume) ; touche : l'instant (s) du dernier toucher, ou null
export function drawPhenix(ctx, ph, t, s = 1, touche = null) {
  const z = Math.max(1, 0.6 / s);
  const R = 34 * z * (0.2 + 0.8 * ph.forme); // (la taille de l'oiseau ; envergure ≈ 6 R)
  const cy = ph.y - R * 0.2;
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  // le voile de lumière autour de lui
  const voile = ctx.createRadialGradient(ph.x, cy, 0, ph.x, cy, R * 4);
  voile.addColorStop(0, `rgba(255,140,60,${R2(0.18 + 0.3 * ph.eclat)})`);
  voile.addColorStop(1, 'rgba(255,100,50,0)');
  ctx.fillStyle = voile;
  ctx.fillRect(ph.x - R * 4, cy - R * 4, R * 8, R * 8);
  ctx.globalCompositeOperation = 'source-over';
  traine(ctx, ph, R, t);
  ctx.globalCompositeOperation = 'lighter';
  // les braises semées, qui retombent et palpitent ; quelques éclats pâles (la brume qu'elle était)
  ph.trace.forEach((b, i) => {
    const fl = 0.55 + 0.45 * Math.sin(t * 19 + i * 2.3);
    const pale = i % 6 === 3;
    ctx.fillStyle = pale ? `rgba(196,232,255,${R2(0.7 * b.a * fl)})` : `rgba(255,${Math.round(140 + 90 * b.a)},70,${R2(0.85 * b.a * fl)})`;
    ctx.beginPath();
    ctx.arc(b.x + Math.sin(t * 3 + i) * R * 0.5, b.y + (i % 4) * R * 0.12, (0.6 + 1.8 * b.a) * z, 0, Math.PI * 2);
    ctx.fill();
  });
  // l'éclair du changement : un anneau de flamme qui s'ouvre
  if (ph.eclat > 0.01) {
    ctx.strokeStyle = `rgba(255,226,170,${R2(ph.eclat * 0.85)})`;
    ctx.lineWidth = 6 * z * ph.eclat;
    ctx.beginPath();
    ctx.arc(ph.x, cy, 8 * z + 70 * z * (1 - ph.eclat), 0, Math.PI * 2);
    ctx.stroke();
  }
  // la gerbe de braises d'un toucher (1,2 s)
  const dt = touche === null ? -1 : t - touche;
  if (dt >= 0 && dt < 1.2) {
    for (let i = 0; i < 26; i++) {
      const a = (i / 26) * Math.PI * 2 + i * 0.37, v = R * (1.2 + (i % 5) * 0.35) * Math.sqrt(dt / 1.2);
      ctx.fillStyle = i % 6 === 2 ? `rgba(196,232,255,${R2(0.9 * (1 - dt / 1.2))})` : `rgba(255,${180 + (i % 3) * 25},90,${R2(0.9 * (1 - dt / 1.2))})`;
      ctx.beginPath();
      ctx.arc(ph.x + Math.cos(a) * v, cy + Math.sin(a) * v + dt * dt * R * 0.8, 2.2 * z * (1 - dt / 1.6), 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
  // l'oiseau : tourné vers où il va, penché avec sa pente ; un battement ample et lent, puis un glissé
  const dir = ph.vx < -0.01 ? -1 : 1;
  const pente = Math.max(-0.35, Math.min(0.35, Math.atan2(ph.vy, Math.abs(ph.vx) + 1e-3) * 0.5));
  const cycle = (t * 0.9) % 1;
  const f = cycle < 0.7 ? Math.cos((cycle / 0.7) * Math.PI * 2) : 0.75;
  const corps = ph.forme;
  ctx.save();
  ctx.translate(ph.x, ph.y);
  ctx.scale(dir, 1);
  ctx.rotate(pente * corps);
  ctx.globalAlpha = Math.min(1, corps * 1.6);
  if (corps > 0.02) {
    ctx.lineJoin = 'round';
    // l'aile de derrière, un peu décalée, plus sombre
    ctx.save();
    ctx.translate(R * 0.15, -R * 0.42);
    ctx.scale(0.86 * ph.ailes, 0.86 * ph.ailes);
    aile(ctx, R, f * 0.95 + 0.05, t + 0.3, true);
    ctx.restore();
    // le corps : un fuseau de flamme, la gorge, le cou qui monte vers la tête
    const body = ctx.createLinearGradient(-R, R * 0.2, R, -R * 0.8);
    body.addColorStop(0, '#E8562E');
    body.addColorStop(0.5, '#FFA845');
    body.addColorStop(1, '#FFE9A8');
    ctx.fillStyle = body;
    ctx.strokeStyle = 'rgba(96,18,10,.9)';
    ctx.lineWidth = Math.max(1, R * 0.05);
    ctx.beginPath();
    ctx.moveTo(-R * 1.15, R * 0.02);
    ctx.bezierCurveTo(-R * 0.55, -R * 0.5, R * 0.25, -R * 0.55, R * 0.62, -R * 0.66);
    ctx.bezierCurveTo(R * 0.68, -R * 0.95, R * 0.95, -R * 1.06, R * 1.12, -R * 0.94);
    ctx.bezierCurveTo(R * 1.18, -R * 0.72, R * 1.02, -R * 0.5, R * 0.9, -R * 0.3);
    ctx.bezierCurveTo(R * 0.75, R * 0.3, -R * 0.25, R * 0.45, -R * 1.15, R * 0.02);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = 'rgba(200,70,30,.55)';
    ctx.lineWidth = Math.max(0.8, R * 0.035);
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(R * (0.15 - i * 0.32), -R * (0.2 - i * 0.05));
      ctx.quadraticCurveTo(R * (0.3 - i * 0.32), R * (0.02 + i * 0.02), R * (0.55 - i * 0.32), -R * (0.08 - i * 0.04));
      ctx.stroke();
    }
    ctx.strokeStyle = 'rgba(96,18,10,.9)';
    ctx.lineWidth = Math.max(1, R * 0.05);
    langues(ctx, R, t, [[-R * 0.9, -R * 0.12], [-R * 0.45, -R * 0.42], [0, -R * 0.52], [R * 0.4, -R * 0.62]]);
    // la crête : trois flammes qui s'enroulent vers l'arrière
    for (let i = 2; i >= 0; i--) {
      ctx.save();
      ctx.translate(R * (0.9 - i * 0.1), -R * (1.0 - i * 0.03));
      ctx.rotate(Math.PI + 0.5 + i * 0.3 + Math.sin(t * 5 + i) * 0.1);
      plume(ctx, R * (0.9 - i * 0.18), R * 0.2, Math.sin(t * 7 + i) * R * 0.1, i === 0 ? '#FFD27A' : '#FF8A3C');
      ctx.restore();
    }
    // le bec, l'œil d'or
    ctx.fillStyle = '#FFF0C8';
    ctx.beginPath();
    ctx.moveTo(R * 1.08, -R * 0.98);
    ctx.lineTo(R * 1.42, -R * 0.84);
    ctx.lineTo(R * 1.12, -R * 0.78);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#3A1208';
    ctx.beginPath();
    ctx.ellipse(R * 0.97, -R * 0.88, R * 0.075, R * 0.1, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(R * 0.955, -R * 0.91, R * 0.03, 0, Math.PI * 2);
    ctx.fill();
  }
  // au cœur de sa poitrine, la petite flamme de Brume, pâle, qui bat ; seule visible quand il se replie
  ctx.globalAlpha = 1;
  const bat = 1 + 0.08 * Math.sin(t * 6);
  const rb = 8 * z * lerp(1, 0.45, corps) * bat;
  ctx.save();
  ctx.translate(R * 0.5 * corps, -R * 0.12 * corps);
  ctx.globalCompositeOperation = 'lighter';
  const lueur = ctx.createRadialGradient(0, -rb * 0.5, 0, 0, -rb * 0.5, rb * 3);
  lueur.addColorStop(0, `rgba(225,245,255,${R2(0.7 - 0.3 * corps)})`);
  lueur.addColorStop(1, 'rgba(160,215,255,0)');
  ctx.fillStyle = lueur;
  ctx.beginPath();
  ctx.arc(0, -rb * 0.5, rb * 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = `rgba(235,248,255,${R2(0.95 - 0.25 * corps)})`;
  goutte(ctx, rb, Math.sin(t * 5) * rb * 0.3);
  ctx.fill();
  ctx.restore();
  // l'aile de devant
  if (corps > 0.02) {
    ctx.globalAlpha = Math.min(1, corps * 1.6);
    ctx.save();
    ctx.translate(R * 0.05, -R * 0.38);
    ctx.scale(ph.ailes, ph.ailes);
    aile(ctx, R, f, t, false);
    ctx.restore();
  }
  ctx.restore();
  // la lueur par-dessus : le corps qui brûle
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  const coeur = ctx.createRadialGradient(ph.x, ph.y - R * 0.5, 0, ph.x, ph.y - R * 0.5, R * 2);
  coeur.addColorStop(0, `rgba(255,200,120,${R2((0.22 + 0.4 * ph.eclat) * Math.max(0.3, corps))})`);
  coeur.addColorStop(1, 'rgba(255,140,60,0)');
  ctx.fillStyle = coeur;
  ctx.beginPath();
  ctx.arc(ph.x, ph.y - R * 0.5, R * 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}
