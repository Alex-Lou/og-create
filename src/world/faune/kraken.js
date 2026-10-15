// Le Kraken : la clé du dernier palier du Ponton, la légende du large. Pour tous, de temps en temps, un présage : au
// large, l'eau s'assombrit sur une ombre immense aux bras qui ondulent (on ne la mesure qu'en dézoomant), des bulles
// crèvent, un œil d'ambre s'ouvre une seconde à fleur d'eau, une pointe de tentacule sort, s'enroule et replonge.
// Une fois le Kraken écrit au Grimoire, le spectacle : cinq tentacules sortent de l'eau l'un après l'autre, se dressent,
// s'enroulent et ruissellent, l'écume tourne en spirale au-dessus de lui, l'œil s'ouvre deux fois ; la nuit, des
// lueurs courent le long de ses bras. Il n'attaque jamais : il passe. Il ne croise jamais le Géant des profondeurs.
// Tout se déduit du temps.
import { TH, TW, SEA_Z, worldOf } from '../terrain';
import { hash } from '../scene';
import { GEANT_EVERY, GEANT_FOR, repere, poser } from './geant';

const clamp = v => Math.min(1, Math.max(0, v));
const smooth = v => { const k = clamp(v); return k * k * (3 - 2 * k); };

// (deux passages du Géant entre deux du Kraken, et le Kraken dans le creux entre deux Géants : ils ne se croisent jamais)
export const KRAKEN_EVERY = 300; // secondes entre deux passages
export const KRAKEN_FOR = 40; // durée d'un passage
export const KRAKEN_DECALE = 80; // le premier passage, après ce temps (s)
const DERIVE = 3; // il dérive de tant de cases pendant son passage

// Le passage du cycle croise-t-il celui du Géant (une marge de 6 s de chaque côté) ? Alors il n'a pas lieu (une garde,
// si les rythmes changent)
export function croiseGeant(cycle) {
  const a = KRAKEN_DECALE + cycle * KRAKEN_EVERY - 6, b = a + KRAKEN_FOR + 12;
  for (let m = Math.floor(a / GEANT_EVERY) - 1; m * GEANT_EVERY <= b; m++) {
    if (m * GEANT_EVERY < b && m * GEANT_EVERY + GEANT_FOR > a) return true;
  }
  return false;
}

// Les fenêtres de l'œil (fractions du passage) ; ses bras : [début, durée, hauteur (monde), angle, rayon (cases)]
const OEIL = { presage: [[0.42, 0.06]], ecrit: [[0.36, 0.07], [0.62, 0.06]] };
const BRAS = {
  presage: [[0.5, 0.16, 30, 0.9, 1.3]],
  ecrit: [0, 1, 2, 3, 4].map(i => [0.2 + i * 0.05, 0.42, 110 + 60 * hash(i, 5), 0.5 + i * 1.257 + 0.3 * hash(i, 7), 1.5 + 0.6 * hash(i, 9)])
};

// Le Kraken à l'instant τ de son passage (spot, dir : la case d'eau libre et la direction, comme le Géant ; ecrit :
// le joueur a écrit le Kraken au Grimoire) : { x, y (son centre, en cases), dx, dy, vis, haut (0 au fond, 1 près de la
// surface), oeil (0 à 1 : ouvert), bras [{ x, y (cases), e (0 à 1 : hors de l'eau), h, cote, phase }], ecrit, k }
export function krakenAt(spot, dir, τ, ecrit = false) {
  const [dx, dy] = dir;
  const k = τ / KRAKEN_FOR;
  const along = (k - 0.5) * DERIVE;
  const x = spot.x + dx * along, y = spot.y + dy * along;
  const vis = smooth(k / 0.14) * smooth((1 - k) / 0.14);
  const haut = 0.25 + 0.75 * Math.exp(-(((k - 0.5) / 0.22) ** 2));
  let oeil = 0;
  for (const [a, d] of OEIL[ecrit ? 'ecrit' : 'presage']) {
    const u = (k - a) / d;
    // (il s'ouvre, reste, cligne, puis se ferme)
    if (u > 0 && u < 1) oeil = Math.max(oeil, smooth(u / 0.25) * smooth((1 - u) / 0.25) * (Math.abs(u - 0.55) < 0.04 ? 0.15 : 1));
  }
  const bras = BRAS[ecrit ? 'ecrit' : 'presage'].map(([a, d, h, angle, r], i) => {
    const u = (k - a) / d;
    const e = u > 0 && u < 1 ? smooth(u / 0.2) * smooth((1 - u) / 0.22) : 0;
    // (il s'enroule vers l'extérieur, du côté où il sort à l'écran : deux bras voisins ne se croisent pas)
    const ecran = Math.cos(angle) - Math.sin(angle);
    return { x: x + Math.cos(angle) * r, y: y + Math.sin(angle) * r, e, h, cote: ecran < 0 ? -1 : 1, phase: i * 1.7 + 0.4 };
  });
  return { x, y, dx, dy, vis, haut, oeil: oeil * vis, bras, ecrit, k };
}

// Son ombre, composée sur un petit calque (demi-résolution, dans son repère : le manteau vers l'arrière, huit bras qui
// rayonnent de la tête et ondulent), d'un seul ton, aux bords adoucis
const LW = 960, LH = 960;
let calque = null;
function ombre(t, ton) {
  if (!calque) { calque = document.createElement('canvas'); calque.width = LW / 2; calque.height = LH / 2; }
  const g = calque.getContext('2d');
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.clearRect(0, 0, calque.width, calque.height);
  g.setTransform(0.5, 0, 0, 0.5, LW / 4, LH / 4);
  g.fillStyle = ton;
  g.strokeStyle = ton;
  g.shadowColor = ton;
  g.shadowBlur = 12;
  g.lineCap = 'round';
  // les bras, épais à la tête, fins au bout, qui ondulent
  for (let i = 0; i < 8; i++) {
    const a0 = (i / 8) * Math.PI * 2 + 0.2 * Math.sin(t * 0.5 + i);
    const len = 300 + 90 * hash(i, 3);
    let px = 0, py = 0, a = a0;
    for (let j = 0; j < 14; j++) {
      const s = j / 14;
      a += 0.12 * Math.sin(t * 1.1 + i * 2 + s * 5);
      const nx = px + Math.cos(a) * (len / 14), ny = py + Math.sin(a) * (len / 14);
      g.lineWidth = 46 * (1 - s) + 6;
      g.beginPath();
      g.moveTo(px, py);
      g.lineTo(nx, ny);
      g.stroke();
      px = nx;
      py = ny;
    }
  }
  // la tête et le manteau, vers l'arrière (−x)
  g.beginPath();
  g.ellipse(-150, 0, 210, 108, 0, 0, Math.PI * 2);
  g.fill();
  g.beginPath();
  g.ellipse(0, 0, 90, 90, 0, 0, Math.PI * 2);
  g.fill();
  return calque;
}

// Sous la mer (dans le monde, avec la mer : la terre le cache) : son ombre, l'eau qui s'assombrit, les bulles, l'œil à
// fleur d'eau, l'écume qui tourne au-dessus de lui et les remous au pied des bras. night : la nuit (0 à 1)
export function drawKraken(ctx, kr, t, night) {
  if (!kr || kr.vis < 0.01) return;
  const r = repere(kr);
  ctx.save();
  poser(ctx, r);
  // (pâle et lointaine pour le présage, plus sombre pour le spectacle)
  ctx.globalAlpha = (kr.ecrit ? 0.12 + 0.26 * kr.haut : 0.07 + 0.17 * kr.haut) * kr.vis;
  ctx.drawImage(ombre(t, night > 0.5 ? 'rgb(8,6,22)' : 'rgb(20,22,52)'), -LW / 2, -LH / 2, LW, LH);
  ctx.globalAlpha = 1;
  // les bulles qui montent de lui et crèvent en surface, par grappes
  ctx.lineWidth = 2.2;
  for (let i = 0; i < 26; i++) {
    const u = (t / (1.8 + hash(i, 71)) + hash(i, 73)) % 1;
    const grappe = Math.floor(hash(i, 74) * 5);
    const ax = Math.cos(grappe * 1.9) * 160 + (hash(i, 75) - 0.5) * 70, ay = Math.sin(grappe * 1.9) * 130 + (hash(i, 77) - 0.5) * 70;
    const a = kr.vis * (0.3 + 0.7 * kr.haut) * (u < 0.8 ? u / 0.8 : 1 - (u - 0.8) / 0.2);
    if (a < 0.03) continue;
    const rr = u < 0.8 ? 3 + 3 * hash(i, 79) : 3 + 16 * (u - 0.8) / 0.2;
    ctx.strokeStyle = `rgba(235,245,255,${(0.6 * a).toFixed(3)})`;
    ctx.beginPath();
    ctx.arc(ax, ay, rr, 0, Math.PI * 2);
    ctx.stroke();
  }
  // l'écume qui tourne en spirale au-dessus de lui (le spectacle) : des traînées d'écume inégales, qui s'étirent
  if (kr.ecrit) {
    const tour = smooth((kr.k - 0.15) / 0.15) * smooth((0.85 - kr.k) / 0.15) * kr.vis;
    if (tour > 0.02) {
      ctx.lineCap = 'round';
      for (let i = 0; i < 34; i++) {
        const j0 = hash(i, 51) * 70, long = 3 + 6 * hash(i, 53);
        const a0 = j0 * 0.16 + t * 0.6;
        ctx.strokeStyle = `rgba(255,255,255,${(tour * (0.18 + 0.4 * hash(i, 55))).toFixed(3)})`;
        ctx.lineWidth = 2 + 4 * hash(i, 57);
        ctx.beginPath();
        for (let j = 0; j <= long; j++) {
          const aa = a0 + j * 0.16, rr = 30 + (j0 + j) * 3.2 + 6 * Math.sin(t * 0.8 + i);
          if (j) ctx.lineTo(Math.cos(aa) * rr, Math.sin(aa) * rr); else ctx.moveTo(Math.cos(aa) * rr, Math.sin(aa) * rr);
        }
        ctx.stroke();
      }
    }
  }
  ctx.restore();
  // l'œil, à fleur d'eau (devant sa tête) : une amande d'ambre, la pupille fendue, des ronds autour
  if (kr.oeil > 0.02) {
    const e = worldOf(kr.x + kr.dx * 0.5, kr.y + kr.dy * 0.5, SEA_Z);
    drawOeil(ctx, e.x, e.y, kr.oeil, t);
  }
  // les remous au pied des bras
  for (const b of kr.bras) {
    if (b.e < 0.02) continue;
    const c = worldOf(b.x, b.y, SEA_Z), w = largeur(b.h);
    for (const lag of [0, 0.33, 0.66]) {
      const q = (t * 0.8 + lag + b.phase) % 1;
      ctx.strokeStyle = `rgba(255,255,255,${(0.55 * (1 - q) * b.e).toFixed(3)})`;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.ellipse(c.x, c.y, w * (1 + q * 2.4), w * (1 + q * 2.4) * (TH / TW), 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.fillStyle = `rgba(255,255,255,${(0.5 * b.e).toFixed(3)})`;
    ctx.beginPath();
    ctx.ellipse(c.x, c.y, w * 1.2, w * 1.2 * (TH / TW), 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawOeil(ctx, x, y, o, t) {
  const w = 24, h = 11 * o;
  ctx.save();
  // le remous autour
  ctx.strokeStyle = `rgba(255,255,255,${(0.45 * o).toFixed(3)})`;
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.ellipse(x, y, w * 1.5, w * 0.6, 0, 0, Math.PI * 2);
  ctx.stroke();
  // l'amande
  ctx.beginPath();
  ctx.moveTo(x - w, y);
  ctx.quadraticCurveTo(x, y - h * 1.6, x + w, y);
  ctx.quadraticCurveTo(x, y + h * 1.6, x - w, y);
  ctx.closePath();
  const iris = ctx.createRadialGradient(x, y, 0, x, y, w);
  iris.addColorStop(0, '#FFE69A');
  iris.addColorStop(0.45, '#E8A030');
  iris.addColorStop(1, '#7A3C10');
  ctx.fillStyle = iris;
  ctx.fill();
  ctx.strokeStyle = 'rgba(20,10,24,0.9)';
  ctx.lineWidth = 1.6;
  ctx.stroke();
  // la pupille fendue, qui se resserre
  ctx.fillStyle = '#120A16';
  ctx.beginPath();
  ctx.ellipse(x + Math.sin(t * 0.7) * 2, y, 2.4 + 1.2 * Math.sin(t * 1.3), h * 1.25, 0, 0, Math.PI * 2);
  ctx.fill();
  // le reflet
  ctx.fillStyle = 'rgba(255,255,255,0.8)';
  ctx.beginPath();
  ctx.ellipse(x - w * 0.35, y - h * 0.45, 2.6, 1.4 * o, -0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

const largeur = h => 5 + 15 * (h / 120);

// Ses bras, du plus lointain au plus proche (celui de devant passe devant celui de derrière)
export const brasDuFond = kr => [...kr.bras].sort((a, b) => a.x + a.y - (b.x + b.y));

// Un bras hors de l'eau : son épine (points dans le monde), de la surface à la pointe ; il se dresse, ondule, s'enroule
// au bout (cote : de quel côté)
function epine(b, t) {
  const c = worldOf(b.x, b.y, SEA_Z);
  const L = b.h * b.e, N = 22, pts = [{ x: c.x, y: c.y, a: -Math.PI / 2 }];
  let a = -Math.PI / 2 + b.cote * 0.18 + 0.12 * Math.sin(t * 0.7 + b.phase);
  for (let j = 1; j <= N; j++) {
    const s = j / N;
    a += b.cote * (0.05 + 0.5 * s ** 3 * (0.4 + 0.6 * b.e)) + 0.06 * Math.sin(t * 1.6 + b.phase - s * 4);
    const p = pts[j - 1];
    pts.push({ x: p.x + Math.cos(a) * (L / N), y: p.y + Math.sin(a) * (L / N), a });
  }
  return pts;
}

// Les bras hors de l'eau (dans le monde, après le sol et ce qui s'y tient : en eau libre, rien ne se dresse devant eux ;
// la carte de lumière passe ensuite) : un corps violet sombre, le ventre plus clair, les ventouses, un reflet mouillé, et
// l'eau qui ruisselle et retombe en gouttes
export function drawBras(ctx, kr, t) {
  if (!kr || kr.vis < 0.01) return;
  for (const b of brasDuFond(kr)) {
    if (b.e < 0.03) continue;
    const pts = epine(b, t), W = largeur(b.h);
    const n = p => ({ x: -Math.sin(p.a), y: Math.cos(p.a) });
    const bord = (sens, k) => pts.map((p, j) => { const w = W * (1 - 0.88 * (j / (pts.length - 1))) * k; const q = n(p); return { x: p.x + q.x * w * sens, y: p.y + q.y * w * sens }; });
    const g = pts[0], h = pts[pts.length - 1];
    const corps = ctx.createLinearGradient(g.x, g.y, h.x, h.y);
    corps.addColorStop(0, '#22182E');
    corps.addColorStop(0.6, '#4A3358');
    corps.addColorStop(1, '#6E4C70');
    ctx.save();
    ctx.globalAlpha = Math.min(1, b.e * 1.4) * kr.vis;
    const forme = [...bord(1, 0.5), ...bord(-1, 0.5).reverse()];
    ctx.beginPath();
    forme.forEach((p, j) => (j ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
    ctx.closePath();
    ctx.fillStyle = corps;
    ctx.fill();
    ctx.strokeStyle = '#140C1C';
    ctx.lineWidth = 1.2;
    ctx.stroke();
    // le ventre, plus clair, du côté où il s'enroule
    const ventre = [...bord(b.cote, 0.48), ...bord(b.cote, 0.12).reverse()];
    ctx.beginPath();
    ventre.forEach((p, j) => (j ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
    ctx.closePath();
    ctx.fillStyle = 'rgba(176,128,150,0.75)';
    ctx.fill();
    // les ventouses
    ctx.fillStyle = '#EBD0DA';
    ctx.strokeStyle = 'rgba(40,20,40,0.7)';
    ctx.lineWidth = 0.6;
    for (let j = 2; j < pts.length - 3; j += 2) {
      const p = pts[j], q = n(p), w = W * (1 - 0.88 * (j / (pts.length - 1)));
      ctx.beginPath();
      ctx.ellipse(p.x + q.x * w * 0.3 * b.cote, p.y + q.y * w * 0.3 * b.cote, Math.max(0.6, w * 0.16), Math.max(0.5, w * 0.12), p.a, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
    // le reflet mouillé, du côté de la lumière
    ctx.strokeStyle = 'rgba(214,232,248,0.5)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    bord(-b.cote, 0.36).forEach((p, j) => (j ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
    ctx.stroke();
    // l'eau qui ruisselle : des gouttes qui se détachent et tombent dans la mer
    ctx.fillStyle = 'rgba(232,244,255,0.85)';
    for (let i = 0; i < 9; i++) {
      const u = (t / (0.9 + 0.5 * hash(i, b.phase * 10)) + hash(i, 13)) % 1;
      const j = 2 + Math.floor(hash(i, 17 + Math.floor(t)) * (pts.length - 4));
      const p = pts[j];
      const y = p.y + u * u * (g.y - p.y + 4);
      if (y > g.y + 2) continue;
      ctx.globalAlpha = (1 - u * 0.6) * b.e * kr.vis;
      ctx.beginPath();
      ctx.ellipse(p.x + (hash(i, 19) - 0.5) * 3, y, 1, 1.6, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}

// La nuit (après la carte de lumière, qui les éteindrait ; en 'lighter') : l'œil qui luit, et des lueurs qui courent le
// long des bras, de la surface à la pointe
export function drawLueursKraken(ctx, kr, t, night) {
  if (!kr || kr.vis < 0.01) return;
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  if (kr.oeil > 0.02) {
    const e = worldOf(kr.x + kr.dx * 0.5, kr.y + kr.dy * 0.5, SEA_Z);
    const a = kr.oeil * (0.35 + 0.65 * night);
    const lum = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, 60);
    lum.addColorStop(0, `rgba(255,190,90,${(0.55 * a).toFixed(3)})`);
    lum.addColorStop(1, 'rgba(255,190,90,0)');
    ctx.fillStyle = lum;
    ctx.fillRect(e.x - 60, e.y - 60, 120, 120);
  }
  if (night > 0.2) {
    for (const b of kr.bras) {
      if (b.e < 0.05) continue;
      const pts = epine(b, t), W = largeur(b.h);
      for (let j = 3; j < pts.length; j++) {
        const s = j / (pts.length - 1);
        const a = (0.5 + 0.5 * Math.sin(t * 3 - s * 9 + b.phase)) ** 2 * night * b.e * kr.vis;
        if (a < 0.04) continue;
        // (sur le flanc, de petites lueurs qui courent, pas une nappe)
        const p = pts[j], q = { x: -Math.sin(p.a), y: Math.cos(p.a) }, w = W * (1 - 0.88 * s);
        const x = p.x - q.x * w * 0.25 * b.cote, y = p.y - q.y * w * 0.25 * b.cote, rr = 1.5 + w * 0.22;
        const lum = ctx.createRadialGradient(x, y, 0, x, y, rr * 2);
        lum.addColorStop(0, `rgba(150,250,232,${(0.6 * a).toFixed(3)})`);
        lum.addColorStop(1, 'rgba(150,250,232,0)');
        ctx.fillStyle = lum;
        ctx.fillRect(x - rr * 2, y - rr * 2, rr * 4, rr * 4);
      }
    }
  }
  ctx.restore();
}
