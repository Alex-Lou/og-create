// Les ponts de la rivière : une passerelle de bois en dos d'âne, d'une rive à l'autre (choix de l'auteur, 12 oct.).
// Chaque case de pont (« k ») dessine sa tranche d'un même tablier : ombre sur l'eau, pieux et leur remous, planches en
// travers du passage, poutre de rive, garde-corps arrondis sur poteaux, et une lanterne à chaque bout côté rive (sa
// lueur de nuit : draw/air.js). La bosse se calcule sur toute la traversée : les tranches se raccordent sans couture,
// et ceux qui passent montent et descendent avec elle (WorldView : liftAt). Un pont de deux cases de large ne garde
// ses garde-corps que sur ses bords. Calculs purs (mis de côté par carte : la carte d'une île ne change pas), dessin
// Canvas 2D en unités du monde.
import { worldOf, lampGlowOf } from './terrain';

// Le tablier au-dessus de l'eau du pont (paliers) : posé au bord, sa bosse au milieu (selon la longueur)
const LIFT = 0.08;
const HUMP = len => Math.min(0.42, 0.2 + 0.1 * (len - 1));
// Demi-largeur du tablier entre deux garde-corps (en cases), épaisseur de la poutre (unités du monde), hauteur du
// garde-corps (paliers)
const HALF = 0.3;
const THICK = 2.4;
const RAIL = 0.5;
// Les bois : planches, poutre, poteaux et main courante, cernes ; le remous et l'ombre sur l'eau
const PLANKS = ['#C99459', '#BD8650', '#D3A066', '#C48C55'];
const BEAM = '#8B5A2B';
const POST = '#9A6436';
const CAP = '#B97B45';
const RAIL_HI = '#C89058';
const INK = '#5A3818';
const SEAM = 'rgba(90, 56, 28, .75)';
const EDGE_HI = '#E2B27A';

// Ce qui borde le pont : une rive (ni eau, ni mer, ni pont)
const bank = (M, x, y) => M.land(x, y) && !'wk~b'.includes(M.ground(x, y));
const isBridge = (M, x, y) => M.ground(x, y) === 'k';

// Le pont d'une case : { axis ('x' | 'y' : le sens du passage), u, v (la case dans ce sens et en travers), start,
// end (premières et dernières cases du passage), startBank, endBank (une rive au bout), openBack, openFront (le
// tablier continue en travers : pas de garde-corps), base (hauteur de l'eau du pont, paliers) }, ou null
const spans = new WeakMap();
export function bridgeOf(M, x, y) {
  if (!isBridge(M, x, y)) return null;
  let known = spans.get(M);
  if (!known) spans.set(M, (known = new Map()));
  const key = y * M.n + x;
  if (!known.has(key)) known.set(key, measure(M, x, y));
  return known.get(key);
}
function measure(M, x, y) {
  const run = (dx, dy) => {
    let a = 0, b = 0;
    while (isBridge(M, x - dx * (a + 1), y - dy * (a + 1))) a++;
    while (isBridge(M, x + dx * (b + 1), y + dy * (b + 1))) b++;
    const startBank = bank(M, x - dx * (a + 1), y - dy * (a + 1)), endBank = bank(M, x + dx * (b + 1), y + dy * (b + 1));
    return { a, b, startBank, endBank, ends: startBank + endBank };
  };
  const rx = run(1, 0), ry = run(0, 1);
  // (le sens du passage : celui qui relie deux rives ; à égalité, le plus court)
  const axis = rx.ends !== ry.ends ? (rx.ends > ry.ends ? 'x' : 'y') : rx.a + rx.b <= ry.a + ry.b ? 'x' : 'y';
  const r = axis === 'x' ? rx : ry;
  const u = axis === 'x' ? x : y, v = axis === 'x' ? y : x;
  const across = dv => (axis === 'x' ? isBridge(M, x, y + dv) : isBridge(M, x + dv, y));
  return { axis, u, v, start: u - r.a, end: u + r.b, startBank: r.startBank, endBank: r.endBank, openBack: across(-1), openFront: across(1), base: M.surface(x, y) };
}

// De combien le tablier est au-dessus de l'eau du pont (paliers), en un point u du passage
export function riseOf(b, u) {
  const s = Math.min(1, Math.max(0, (u - (b.start - 0.5)) / (b.end - b.start + 1)));
  return LIFT + HUMP(b.end - b.start + 1) * Math.sin(Math.PI * s);
}
// … en un point de l'île (x, y fractionnaires) : 0 hors d'un pont
export function bridgeRise(M, x, y) {
  const b = bridgeOf(M, Math.round(x), Math.round(y));
  return b ? riseOf(b, b.axis === 'x' ? x : y) : 0;
}

// Les lanternes des ponts : une à chaque bout qui touche une rive, sur le garde-corps de devant ({ x, y, z } : la case,
// fractionnaire, et la hauteur du tablier, comme celles du pont de l'Îlot aux Mouettes : terrain.js, lampGlowOf)
export function riverLampsOf(M) {
  const out = [];
  for (let y = 0; y < M.n; y++) for (let x = 0; x < M.n; x++) {
    const b = bridgeOf(M, x, y);
    if (!b || b.openFront) continue;
    if (b.u === b.start && b.startBank) out.push(lampAt(b, b.start - 0.5 + 0.1));
    if (b.u === b.end && b.endBank) out.push(lampAt(b, b.end + 0.5 - 0.1));
  }
  return out;
}
function lampAt(b, u) {
  const v = b.v + HALF, z = b.base + riseOf(b, u);
  return b.axis === 'x' ? { x: u, y: v, z } : { x: v, y: u, z };
}

// La tranche d'une case de pont (après l'eau de la case) ; veil : la brume de sa case (0 à 1), qui l'efface d'autant,
// garde-corps et lanternes compris (le voile de la case, lui, ne couvre que son losange) ; over : redessinée devant une
// cascade qui tombe derrière elle (eauDouce.js), sans son ombre (déjà sur l'eau)
export function drawRiverBridge(ctx, M, x, y, veil = 0, over = false) {
  const b = bridgeOf(M, x, y);
  if (!b || veil >= 1) return;
  const P = (u, v, z) => (b.axis === 'x' ? worldOf(u, v, z) : worldOf(v, u, z));
  const zOf = u => b.base + riseOf(b, u);
  const u0 = b.u - 0.5, u1 = b.u + 0.5;
  const vB = b.v - (b.openBack ? 0.5 : HALF), vF = b.v + (b.openFront ? 0.5 : HALF);
  // (les bouts du garde-corps : un peu en retrait de la rive)
  const r0 = b.u === b.start ? b.start - 0.5 + 0.06 : u0, r1 = b.u === b.end ? b.end + 0.5 - 0.06 : u1;
  const STEPS = 4;
  const along = (from, to, at) => Array.from({ length: STEPS + 1 }, (_, i) => at(from + ((to - from) * i) / STEPS));
  const path = pts => {
    ctx.beginPath();
    pts.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
  };
  ctx.save();
  ctx.globalAlpha = 1 - veil * 0.8;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  // 1. son ombre sur l'eau, un peu vers l'avant
  if (!over) {
    path([P(u0, vB + 0.06, b.base), P(u1, vB + 0.06, b.base), P(u1, vF + 0.12, b.base), P(u0, vF + 0.12, b.base)]);
    ctx.fillStyle = 'rgba(20, 44, 62, .22)';
    ctx.fill();
  }

  // 2. les pieux au milieu de la case, sous chaque bord, et leur remous
  for (const [vE, open] of [[vB, b.openBack], [vF, b.openFront]]) {
    if (open) continue;
    const top = P(b.u, vE, zOf(b.u)), foot = P(b.u, vE, b.base);
    ctx.fillStyle = BEAM;
    ctx.fillRect(top.x - 1.5, top.y, 3, foot.y - top.y + 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, .5)';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.ellipse(foot.x, foot.y + 1.5, 4, 1.6, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  // 3. le garde-corps de derrière (sous le tablier à l'écran : il se dessine avant)
  if (!b.openBack) rail(vB);

  // 4. le tablier : des planches en travers du passage, de teintes un peu différentes, leurs joints, ses deux bords
  const PLANK = 0.2;
  const k0 = Math.round((u0 - (b.start - 0.5)) / PLANK);
  for (let k = 0; k < 1 / PLANK; k++) {
    const ua = u0 + k * PLANK, ub = ua + PLANK;
    path([P(ua, vB, zOf(ua)), P(ub, vB, zOf(ub)), P(ub, vF, zOf(ub)), P(ua, vF, zOf(ua))]);
    ctx.closePath();
    ctx.fillStyle = PLANKS[(k0 + k) % PLANKS.length];
    ctx.fill();
    if (k) {
      path([P(ua, vB, zOf(ua)), P(ua, vF, zOf(ua))]);
      ctx.strokeStyle = SEAM;
      ctx.lineWidth = 0.7;
      ctx.stroke();
    }
  }
  if (!b.openBack) {
    path(along(u0, u1, u => P(u, vB, zOf(u))));
    ctx.strokeStyle = INK;
    ctx.lineWidth = 0.8;
    ctx.stroke();
  }

  // 5. la poutre de rive, devant
  if (!b.openFront) {
    const topEdge = along(u0, u1, u => P(u, vF, zOf(u)));
    path([...topEdge, ...topEdge.slice().reverse().map(p => ({ x: p.x, y: p.y + THICK }))]);
    ctx.closePath();
    ctx.fillStyle = BEAM;
    ctx.fill();
    path(topEdge);
    ctx.strokeStyle = EDGE_HI;
    ctx.lineWidth = 0.9;
    ctx.stroke();
    path(topEdge.map(p => ({ x: p.x, y: p.y + THICK })));
    ctx.strokeStyle = INK;
    ctx.lineWidth = 0.8;
    ctx.stroke();
  }

  // 6. le garde-corps de devant, et les lanternes des bouts
  if (!b.openFront) {
    rail(vF);
    if (b.u === b.start && b.startBank) lantern(b.start - 0.5 + 0.1);
    if (b.u === b.end && b.endBank) lantern(b.end + 0.5 - 0.1);
  }
  ctx.restore();

  // Un garde-corps le long d'un bord : deux poteaux par case (au quart et aux trois quarts, plus un à chaque bout du
  // pont), une main courante arrondie et une lisse à mi-hauteur qui suivent la bosse
  function rail(vE) {
    const posts = [b.u - 0.25, b.u + 0.25];
    if (b.u === b.start) posts.unshift(r0);
    if (b.u === b.end) posts.push(r1);
    const top = u => P(u, vE, zOf(u) + RAIL);
    // (la main courante, puis la lisse : un trait sombre, un trait de bois clair dessus)
    for (const [k, lw, color] of [[1, 3, INK], [1, 1.6, RAIL_HI], [0.5, 2, INK], [0.5, 0.9, RAIL_HI]]) {
      path(along(r0, r1, u => P(u, vE, zOf(u) + RAIL * k)));
      ctx.strokeStyle = color;
      ctx.lineWidth = lw;
      ctx.stroke();
    }
    for (const u of posts) {
      const foot = P(u, vE, zOf(u)), head = top(u);
      ctx.fillStyle = POST;
      ctx.strokeStyle = INK;
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.rect(foot.x - 1.4, head.y - 1, 2.8, foot.y - head.y + 1);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = CAP;
      ctx.beginPath();
      ctx.arc(head.x, head.y - 1, 1.9, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
  }
  // Une lanterne sur son poteau : chapeau, verre chaud, socle (sa lueur : lampGlowOf, à la même place)
  function lantern(u) {
    const foot = P(u, vF, zOf(u)), glass = lampGlowOf(lampAt(b, u));
    ctx.fillStyle = POST;
    ctx.strokeStyle = INK;
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.rect(foot.x - 1.5, glass.y + 4, 3, foot.y - glass.y - 4);
    ctx.fill();
    ctx.stroke();
    // (le socle, le verre, le chapeau)
    ctx.fillStyle = '#4A3426';
    ctx.fillRect(glass.x - 3.6, glass.y + 3, 7.2, 2);
    ctx.fillStyle = '#FFE39A';
    ctx.beginPath();
    ctx.roundRect(glass.x - 3, glass.y - 4, 6, 7.4, 1.4);
    ctx.fill();
    ctx.strokeStyle = '#4A3426';
    ctx.stroke();
    ctx.fillStyle = 'rgba(255, 255, 255, .7)';
    ctx.fillRect(glass.x - 1.8, glass.y - 2.6, 1.1, 3.4);
    ctx.fillStyle = '#4A3426';
    ctx.beginPath();
    ctx.moveTo(glass.x - 4.4, glass.y - 4);
    ctx.lineTo(glass.x, glass.y - 7.6);
    ctx.lineTo(glass.x + 4.4, glass.y - 4);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.arc(glass.x, glass.y - 8.4, 1.1, 0, Math.PI * 2);
    ctx.fill();
  }
}
