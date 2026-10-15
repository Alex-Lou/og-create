// Les bancs de poissons, sous la surface des eaux peu profondes (au bord, la mer tout autour : sea.js, seaOf) : vingt
// à trente-six poissons qui se suivent à la file sur le chemin du banc, en un ruban qui ondule, s'élargit et se
// resserre. Quand le ruban vire, un éclat argenté le parcourt, comme des sardines qui accrochent la lumière ; la nuit,
// ce sont des étincelles bleues. Touché du doigt, le banc fuse dans tous les sens, puis se regroupe. De temps en temps,
// un banc se ramasse en boule qui tourne : l'eau bouillonne et scintille, des poissons sautent, et le jour les
// mouettes plongent dedans. Tout se déduit du temps, sauf le toucher (l'instant où l'on a touché le banc).
import { TW, TH, SEA_Z, worldOf } from '../terrain';
import { hash } from '../scene';
import { lueur } from '@/utils/vfx';

const clamp = v => Math.min(1, Math.max(0, v));
const smooth = v => { const k = clamp(v); return k * k * (3 - 2 * k); };

const AMPLE = 0.85; // le chemin du banc s'écarte de son centre (cases)
const RETARD = 0.34; // chaque poisson suit le précédent avec ce retard (s)
const LARGE = 0.62; // la largeur du ruban (cases)
const LOIN = 2.1; // un poisson ne s'écarte jamais plus du centre du banc (cases : il reste dans l'eau)
export const FUITE = 4; // le banc fuse puis se regroupe en ce temps (s)
export const BOULE_EVERY = 180; // secondes entre deux boules de sardines
export const BOULE_FOR = 36; // durée d'une boule
const PRISE = 6; // la boule se forme, puis se défait, en ce temps (s)

// Combien de poissons dans le banc k
export const tailleOf = k => 22 + Math.floor(hash(k, 7) * 15);

// Le chemin du banc k à l'instant u : sa place (cases) et sa vitesse
function chemin(s, k, u) {
  const w1 = 0.16 + hash(k, 3) * 0.1, w2 = 0.13 + hash(k, 5) * 0.1;
  const p1 = u * w1 + k * 1.7, p2 = u * w2 + k * 2.9;
  return { x: s.x + AMPLE * Math.sin(p1), y: s.y + AMPLE * Math.sin(p2), vx: AMPLE * w1 * Math.cos(p1), vy: AMPLE * w2 * Math.cos(p2) };
}
// Un cap dans le plan de la mer (vx, vy en cases), à l'écran
const capOf = (vx, vy) => Math.atan2((vx + vy) / 2, vx - vy);
// L'écart entre deux caps (-π à π)
const ecart = (a, b) => Math.atan2(Math.sin(a - b), Math.cos(a - b));

// La boule de sardines du banc k, à l'instant τ de son passage : { k, x, y (son centre, cases), m (0 : le ruban, 1 :
// la boule), τ }
export function bouleAt(schools, k, τ) {
  const s = schools[k];
  const m = smooth(τ / PRISE) * smooth((BOULE_FOR - τ) / PRISE);
  return { k, x: s.x, y: s.y, m, τ };
}

// Les poissons de tous les bancs à l'instant t : { x, y (cases), a (cap à l'écran), eclat (0 à 1), banc }. touche(k) :
// l'instant où l'on a touché le banc k (sinon rien) ; boule : bouleAt (ou null)
export function bancsOf(schools, t, touche = () => null, boule = null) {
  const out = [];
  schools.forEach((s, k) => {
    const n = tailleOf(k);
    const at = touche(k);
    const u = at === null || at === undefined ? null : t - at;
    const fuite = u !== null && u >= 0 && u < FUITE ? u : null;
    // (le cœur de la fuite : là où était le banc quand on l'a touché)
    const coeur = fuite !== null ? chemin(s, k, at - (n * RETARD) / 2) : null;
    const m = boule && boule.k === k ? boule.m : 0;
    for (let i = 0; i < n; i++) {
      // (chacun à sa place dans la file, un peu en avance ou en retard : le ruban se fait en grappes)
      const v = t - (i + (hash(k, i + 30) - 0.5) * 2.4) * RETARD;
      const c = chemin(s, k, v);
      let a = capOf(c.vx, c.vy);
      // le ruban : chacun un peu à côté du chemin, et le ruban qui respire
      const cote = (hash(k, i + 40) - 0.5) * LARGE * (0.55 + 0.45 * Math.sin(t * 0.5 + i * 0.27 + k));
      const nv = Math.hypot(c.vx, c.vy) || 1;
      let x = c.x - (c.vy / nv) * cote + 0.07 * Math.sin(t * 1.3 + i * 2.1), y = c.y + (c.vx / nv) * cote + 0.07 * Math.cos(t * 1.1 + i * 1.7);
      // l'éclat argenté : là où le ruban vire, en vague le long du banc
      const vire = Math.abs(ecart(capOf(chemin(s, k, v + 0.4).vx, chemin(s, k, v + 0.4).vy), a)) / 0.4;
      let eclat = clamp(vire * 2.2) * (0.55 + 0.45 * Math.sin(t * 3.2 - i * 0.55)) + 0.12 * Math.max(0, Math.sin(t * 0.9 + k * 2 - i * 0.2)) ** 8;
      // la boule : chacun tourne autour du centre, en couches, les uns dans un sens, les autres dans l'autre
      if (m > 0) {
        const r = 0.06 + 0.4 * hash(k, i + 80) ** 0.8;
        const sens = i % 3 ? 1 : -1;
        const θ = sens * t * (1.4 + 0.6 * hash(k, i + 90)) + hash(k, i + 100) * Math.PI * 2;
        const bx = boule.x + r * Math.cos(θ) + 0.06 * Math.sin(t * 0.7), by = boule.y + r * Math.sin(θ) + 0.06 * Math.cos(t * 0.6);
        x += (bx - x) * m;
        y += (by - y) * m;
        if (m > 0.5) a = capOf(-Math.sin(θ) * sens, Math.cos(θ) * sens);
        eclat = Math.max(eclat, m * (0.5 + 0.5 * Math.sin(θ * 3 + t * 4)));
      }
      // la fuite : chacun file loin du cœur, puis revient
      if (fuite !== null) {
        // (la boule fuse depuis son centre)
        const o = m > 0.5 ? boule : coeur;
        const d = Math.hypot(x - o.x, y - o.y) || 0.01;
        const tour = (hash(k, i + 60) - 0.5) * 1.2;
        const dx = ((x - o.x) / d) * Math.cos(tour) - ((y - o.y) / d) * Math.sin(tour);
        const dy = ((x - o.x) / d) * Math.sin(tour) + ((y - o.y) / d) * Math.cos(tour);
        const elan = 1.3 * (1 - Math.exp(-fuite * 9)) * Math.exp(-fuite * 0.95) * (0.6 + 0.6 * hash(k, i + 70));
        x += dx * elan;
        y += dy * elan;
        const w = clamp(elan * 1.6);
        a += ecart(capOf(dx, dy), a) * w;
        eclat = Math.max(eclat, clamp(elan * 1.4));
      }
      // (jamais trop loin du centre du banc : il reste dans l'eau)
      const ox = x - s.x, oy = y - s.y, o = Math.hypot(ox, oy);
      if (o > LOIN) { x = s.x + (ox / o) * LOIN; y = s.y + (oy / o) * LOIN; }
      out.push({ x, y, a: a + Math.sin(t * 7 + i * 1.9) * 0.1, eclat: clamp(eclat), banc: k });
    }
  });
  return out;
}

// Le centre d'un banc, là où on le voit maintenant (pour le toucher)
export function centreOf(s, k, t) {
  return chemin(s, k, t - (tailleOf(k) * RETARD) / 2);
}

// Les poissons sous la surface (avant les eaux peu profondes et le sol, qui passent par-dessus) : leurs ombres, d'un
// seul tracé. Garde pour chacun sa place à l'écran (c), pour son éclat et sa lueur
const TAILLE = 1;
export function drawBancs(ctx, fish, view, night) {
  ctx.fillStyle = `rgba(16,44,66,${(0.44 * (1 - night * 0.6)).toFixed(3)})`;
  ctx.beginPath();
  for (const f of fish) {
    const c = worldOf(f.x, f.y, SEA_Z);
    f.c = c;
    f.vu = c.x > view.x - 10 && c.x < view.x + view.w + 10 && c.y > view.y - 10 && c.y < view.y + view.h + 10;
    if (!f.vu) continue;
    const ca = Math.cos(f.a) * TAILLE, sa = Math.sin(f.a) * TAILLE;
    const p = (u, v) => [c.x + u * ca - v * sa, c.y + u * sa + v * ca];
    const pts = [p(4.4, 0), p(1, -1.5), p(-2.6, -0.9), p(-3.2, 0), p(-5.4, -1.5), p(-4.8, 0), p(-5.4, 1.5), p(-3.2, 0), p(-2.6, 0.9), p(1, 1.5)];
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (let j = 1; j < pts.length; j++) ctx.lineTo(pts[j][0], pts[j][1]);
    ctx.closePath();
  }
  ctx.fill();
}

// L'éclat argenté de ceux qui virent (après les eaux peu profondes : il perce le turquoise ; la terre passe encore
// par-dessus) : un trait clair le long du flanc, en trois intensités (trois tracés), moins la nuit (les étincelles
// prennent le relais)
export function drawEclatsBancs(ctx, fish, night) {
  const jour = 1 - night * 0.85;
  if (jour < 0.05) return;
  for (const [lo, hi, a] of [[0.25, 0.5, 0.35], [0.5, 0.75, 0.6], [0.75, 1.01, 0.9]]) {
    ctx.fillStyle = `rgba(232,247,255,${(a * jour).toFixed(3)})`;
    ctx.beginPath();
    for (const f of fish) {
      if (!f.vu || f.eclat < lo || f.eclat >= hi) continue;
      const ca = Math.cos(f.a), sa = Math.sin(f.a), r = 3.6 * TAILLE;
      ctx.moveTo(f.c.x + r * ca, f.c.y + r * sa);
      ctx.ellipse(f.c.x, f.c.y, r, 0.85 * TAILLE, f.a, 0, Math.PI * 2);
    }
    ctx.fill();
  }
}

// La nuit, l'éclat devient une étincelle bleue (après la carte de lumière, qui l'éteindrait ; en 'lighter')
export function drawLueursBancs(ctx, fish, night) {
  if (night < 0.2) return;
  const img = lueur('120,200,255');
  for (const f of fish) {
    if (f.eclat < 0.3 || !f.vu) continue;
    const { x, y } = f.c;
    const r = 3 + 4 * f.eclat;
    ctx.globalAlpha = Math.min(1, f.eclat * night * 0.5);
    ctx.drawImage(img, x - r, y - r, r * 2, r * 2);
  }
  ctx.globalAlpha = 1;
}

// La boule à la surface (dans le monde, avec la mer : la terre la cache) : l'eau plus sombre au-dessus du banc serré,
// qui bouillonne d'écume, des scintillements, et des poissons qui sautent
const RX = TW * 0.6, RY = TH * 0.6;
export function drawBoule(ctx, b, t, night) {
  if (!b || b.m < 0.02) return;
  const c = worldOf(b.x, b.y, SEA_Z);
  const m = b.m;
  ctx.save();
  // l'eau sombre au-dessus de la masse de poissons
  const sombre = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, RX * 1.3);
  sombre.addColorStop(0, `rgba(8,26,46,${(0.3 * m).toFixed(3)})`);
  sombre.addColorStop(1, 'rgba(8,26,46,0)');
  ctx.fillStyle = sombre;
  ctx.beginPath();
  ctx.ellipse(c.x, c.y, RX * 1.3, RY * 1.3, 0, 0, Math.PI * 2);
  ctx.fill();
  // l'écume qui bouillonne : de petits ronds qui naissent, s'ouvrent et crèvent
  ctx.lineWidth = 1.1;
  for (let i = 0; i < 34; i++) {
    const u = (t / (0.7 + 0.5 * hash(i, 11)) + hash(i, 13)) % 1;
    const ρ = Math.sqrt(hash(i, 15 + Math.floor(t / 2.4 + hash(i, 13)))), φ = hash(i, 17 + Math.floor(t / 2.4 + hash(i, 13))) * Math.PI * 2;
    const x = c.x + Math.cos(φ) * ρ * RX, y = c.y + Math.sin(φ) * ρ * RY;
    const a = m * (1 - u) * (0.5 + 0.4 * (1 - ρ));
    if (a < 0.03) continue;
    ctx.strokeStyle = `rgba(255,255,255,${(0.75 * a).toFixed(3)})`;
    ctx.beginPath();
    ctx.ellipse(x, y, 1 + u * 4, 0.5 + u * 1.8, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  // les scintillements : argent le jour, bleu la nuit
  ctx.globalCompositeOperation = 'lighter';
  const img = lueur(night > 0.5 ? '120,200,255' : '235,248,255');
  for (let i = 0; i < 14; i++) {
    const k = Math.max(0, Math.sin(t * (5 + 3 * hash(i, 21)) + hash(i, 23) * 9)) ** 6;
    if (k < 0.05) continue;
    const x = c.x + (hash(i, 25) - 0.5) * RX * 1.6, y = c.y + (hash(i, 27) - 0.5) * RY * 1.6;
    const r = 3 + 4 * k;
    ctx.globalAlpha = m * k;
    ctx.drawImage(img, x - r, y - r, r * 2, r * 2);
  }
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = 'source-over';
  // les poissons qui sautent hors de la boule : un petit arc d'argent, des gouttes à l'entrée
  for (let i = 0; i < 5; i++) {
    const per = 1.1 + 0.6 * hash(i, 31);
    const cyc = Math.floor(t / per + hash(i, 33)), u = (t / per + hash(i, 33)) % 1;
    if (u > 0.55) continue;
    const q = u / 0.55;
    const φ = hash(cyc, i + 35) * Math.PI * 2, ρ = 0.2 + 0.6 * hash(cyc, i + 37);
    const sx = c.x + Math.cos(φ) * ρ * RX, sy = c.y + Math.sin(φ) * ρ * RY;
    const sens = hash(cyc, i + 39) < 0.5 ? -1 : 1;
    const x = sx + sens * (q - 0.5) * 12, y = sy - Math.sin(q * Math.PI) * 11;
    const angle = Math.atan2(-Math.cos(q * Math.PI) * 11 * Math.PI, sens * 12);
    ctx.fillStyle = `rgba(214,232,246,${(0.95 * m).toFixed(3)})`;
    ctx.beginPath();
    ctx.ellipse(x, y, 2.6, 0.9, angle, 0, Math.PI * 2);
    ctx.fill();
    if (q > 0.85) {
      ctx.fillStyle = `rgba(255,255,255,${(0.8 * m * (1 - (q - 0.85) / 0.15)).toFixed(3)})`;
      for (let j = 0; j < 4; j++) {
        ctx.beginPath();
        ctx.arc(sx + sens * 6 + (j - 1.5) * 1.6, sy - 1.5 - hash(j, cyc) * 3, 0.7, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
  ctx.restore();
}

// Les mouettes qui plongent dans la boule, le jour : elles tournent au-dessus, plongent l'une après l'autre (un rond
// dans l'eau où elles entrent), restent un instant sous l'eau, puis remontent. { gulls (monde, comme circling),
// rings (cases) }
const PLONGE = 4.2;
export function plongeons(b, t) {
  const out = { gulls: [], rings: [] };
  if (!b || b.m < 0.5) return out;
  const c = worldOf(b.x, b.y, SEA_Z);
  for (let j = 0; j < 4; j++) {
    const u = (t / PLONGE + j / 4) % 1;
    const cyc = Math.floor(t / PLONGE + j / 4);
    const a = t * 0.9 + j * 1.6;
    const tour = { wx: c.x + Math.cos(a) * 46, wy: c.y + Math.sin(a) * 22, alt: 70 + 20 * hash(j, 41) };
    // (où elle entre dans l'eau : dans la boule)
    const ix = (hash(cyc, j + 43) - 0.5) * 1.1, iy = (hash(cyc, j + 45) - 0.5) * 1.1;
    const entree = worldOf(b.x + ix, b.y + iy, SEA_Z);
    if (u < 0.68) out.gulls.push({ ...tour, flip: Math.sin(a) > 0, phase: j * 1.3 });
    else if (u < 0.8) {
      const q = smooth((u - 0.68) / 0.12);
      out.gulls.push({ wx: tour.wx + (entree.x - tour.wx) * q, wy: tour.wy + (entree.y - tour.wy) * q, alt: tour.alt * (1 - q), flip: entree.x < tour.wx, phase: j * 1.3 });
    } else if (u > 0.9) {
      const q = (u - 0.9) / 0.1;
      out.gulls.push({ wx: entree.x + (tour.wx - entree.x) * q * 0.4, wy: entree.y, alt: tour.alt * q * 0.6, flip: false, phase: j * 1.3 });
    }
    if (u >= 0.8) out.rings.push({ x: b.x + ix, y: b.y + iy, k: (u - 0.8) / 0.2 });
  }
  return out;
}
