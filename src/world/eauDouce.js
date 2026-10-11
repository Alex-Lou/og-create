// L'eau douce de l'île, vivante : la lumière au fond (caustiques, comme la mer), le courant des rivières (des reflets
// qui glissent vers l'aval), des cascades en voile translucide avec leur écume et leur brume, et des petites carpes
// poissons de plusieurs espèces qui vivent dans l'eau chacune à sa façon (une ombre sous eux, la queue qui ondule ;
// parfois un rond quand l'un remonte).
// freshOf(M, live) se calcule une fois par île ; le reste se déduit du temps.
import { TW, TH, worldOf, strokeBatch } from './terrain';
import { hash } from './scene';
import { fillCaustics } from './rivage';

const frac = v => v - Math.floor(v);
const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]];

// L'eau d'une île : pour chaque case, le sens du courant (vers une cascade ou la mer, le plus court chemin dans
// l'eau ; null dans une mare sans sortie), et les poissons (environ une case d'eau calme sur cinq)
export function freshOf(M, live) {
  const key = (x, y) => y * M.n + x;
  const isWater = (x, y) => M.ground(x, y) === 'w';
  const falls = new Set(live.falls.map(f => key(f.x, f.y)));
  const dist = new Map();
  const queue = [];
  for (const c of live.water) {
    const sink = falls.has(key(c.x, c.y)) || DIRS.some(([dx, dy]) => M.ground(c.x + dx, c.y + dy) === '~');
    if (sink) { dist.set(key(c.x, c.y), 0); queue.push(c); }
  }
  for (let i = 0; i < queue.length; i++) {
    const c = queue[i], d = dist.get(key(c.x, c.y));
    for (const [dx, dy] of DIRS) {
      const nx = c.x + dx, ny = c.y + dy;
      if (!isWater(nx, ny) || dist.has(key(nx, ny))) continue;
      dist.set(key(nx, ny), d + 1);
      queue.push({ x: nx, y: ny });
    }
  }
  const cells = live.water.map(c => {
    const d = dist.get(key(c.x, c.y));
    let flow = null;
    if (d !== undefined && d > 0) {
      const next = DIRS.find(([dx, dy]) => dist.get(key(c.x + dx, c.y + dy)) === d - 1);
      if (next) flow = next;
    } else if (d === 0) {
      const fall = live.falls.find(f => f.x === c.x && f.y === c.y);
      flow = fall ? (fall.side ? [1, 0] : [0, 1]) : null;
    }
    return { x: c.x, y: c.y, z: M.surface(c.x, c.y), flow };
  });
  // (une case d'eau calme sur cinq a son poisson ; l'espèce se tire au hasard fixe de la case, la truite seulement
  // dans le courant)
  const fish = cells.filter(c => !falls.has(key(c.x, c.y)) && hash(c.x * 3.1, c.y * 1.7) < 0.2)
    .map(c => ({ ...c, species: speciesOf(hash(c.x + 0.5, c.y * 2.3), Boolean(c.flow)), phase: hash(c.x, c.y + 9) * 40, speed: 0.3 + hash(c.y, c.x) * 0.25 }));
  return { cells, fish };
}

// Les espèces : couleurs (corps, motif, nageoires), taille, motif (taches, bande, aucun), queue (éventail, voile), nage
// (boucle, cercles lents avec pauses, banc par à-coups, face au courant)
const SPECIES = {
  koi: { body: '#FF9A5C', mark: '#FFF4EA', fin: '#FFF4EA', size: 1, marks: 'taches', tail: 'eventail', swim: 'boucle' },
  kohaku: { body: '#FFF6EC', mark: '#F06A4E', fin: '#FFFFFF', size: 1, marks: 'taches', tail: 'eventail', swim: 'boucle' },
  showa: { body: '#3A3236', mark: '#FF8A4C', fin: '#F5EEE6', size: 1, marks: 'taches', tail: 'eventail', swim: 'boucle' },
  rouge: { body: '#FF7A3C', mark: '#FFC48A', fin: '#FFB070', size: 0.85, marks: 'aucun', tail: 'voile', swim: 'cercles' },
  vairons: { body: '#A9C6DA', mark: '#E8F4FF', fin: '#D6E8F5', size: 0.5, marks: 'bande', tail: 'eventail', swim: 'banc' },
  truite: { body: '#8FA36A', mark: '#F2A3A8', fin: '#C9D3A8', size: 1.2, marks: 'bande', tail: 'eventail', swim: 'courant' },
  doree: { body: '#FFD45A', mark: '#FFF2B8', fin: '#FFE58A', size: 1.45, marks: 'taches', tail: 'voile', swim: 'boucle' },
  // (le saumon ne vit pas dans l'eau calme : on ne le voit que remonter les cascades d'un bond)
  saumon: { body: '#D9A0A4', mark: '#F6E4E2', fin: '#B98A8E', size: 1.3, marks: 'bande', tail: 'eventail', swim: 'saut' }
};
function speciesOf(h, current) {
  if (current && h < 0.22) return 'truite';
  if (h > 0.96) return 'doree';
  return ['koi', 'kohaku', 'showa', 'koi', 'kohaku', 'rouge', 'vairons', 'rouge', 'vairons'][Math.floor(h * 9) % 9];
}

const INK = 'rgba(60, 40, 25, .75)';
// Un poisson vu de dessus, tourné vers +x, à sa taille : ombre sur le fond, queue qui ondule, nageoires, corps à
// motif, œil brillant
function drawFish(ctx, sp, wag) {
  ctx.save();
  ctx.scale(sp.size, sp.size);
  ctx.fillStyle = 'rgba(20, 50, 70, .22)';
  ctx.beginPath(); ctx.ellipse(1.5, 3, 6.5, 2.6, 0, 0, Math.PI * 2); ctx.fill();
  ctx.save();
  ctx.translate(-5, 0);
  ctx.rotate(wag * 0.45);
  ctx.fillStyle = sp.fin;
  ctx.strokeStyle = INK;
  ctx.lineWidth = 0.6;
  ctx.beginPath();
  if (sp.tail === 'voile') {
    // grande queue en voile, deux lobes souples
    ctx.moveTo(0, 0); ctx.bezierCurveTo(-3, -5, -8, -4.5, -7.5, -1.5); ctx.quadraticCurveTo(-5.5, 0, -7.5, 1.5); ctx.bezierCurveTo(-8, 4.5, -3, 5, 0, 0);
  } else {
    ctx.moveTo(0, 0); ctx.quadraticCurveTo(-4, -3.6, -5.2, -2.6); ctx.quadraticCurveTo(-3.6, 0, -5.2, 2.6); ctx.quadraticCurveTo(-4, 3.6, 0, 0);
  }
  ctx.fill(); ctx.stroke();
  ctx.restore();
  ctx.fillStyle = sp.fin;
  ctx.beginPath(); ctx.ellipse(1, -2.6, 1.8, 0.9, -0.6 + wag * 0.2, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(1, 2.6, 1.8, 0.9, 0.6 - wag * 0.2, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = sp.body;
  ctx.strokeStyle = INK;
  ctx.lineWidth = 0.7;
  ctx.beginPath(); ctx.ellipse(0, 0, 5.8, 2.7, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.save();
  ctx.beginPath(); ctx.ellipse(0, 0, 5.5, 2.4, 0, 0, Math.PI * 2); ctx.clip();
  ctx.fillStyle = sp.mark;
  if (sp.marks === 'taches') {
    ctx.beginPath(); ctx.ellipse(-0.8, -0.5, 2.1, 1.3, 0.4, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(2.6, 0.9, 1.1, 0.8, 0, 0, Math.PI * 2); ctx.fill();
  } else if (sp.marks === 'bande') {
    ctx.fillRect(-6, -0.45, 12, 0.9);
    ctx.fillStyle = 'rgba(40, 30, 20, .35)';
    for (const [dx, dy] of [[-2.5, -1.4], [0, -1.6], [2.2, -1.2], [-1.2, 1.3]]) ctx.fillRect(dx, dy, 0.6, 0.6);
  }
  ctx.restore();
  ctx.fillStyle = '#2B1C12';
  ctx.beginPath(); ctx.arc(3.6, -0.9, 0.65, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.9)';
  ctx.fillRect(3.7, -1.2, 0.35, 0.35);
  ctx.restore();
}

// Un poisson tout prêt : chaque espèce dessinée une fois en WAGS images de queue, à SPRITE fois sa taille (net quand
// on zoome), puis posée telle quelle ; centre du poisson en (CX, CY) de l'image
const WAGS = 8, SPRITE = 3, CX = 13, CY = 9;
const sprites = new Map();
function fishSprite(species, wag) {
  const step = Math.round(((Math.max(-1, Math.min(1, wag)) + 1) / 2) * (WAGS - 1));
  const key = `${species}:${step}`;
  let c = sprites.get(key);
  if (c) return c;
  const sp = SPECIES[species];
  c = document.createElement('canvas');
  c.width = Math.ceil(CX * 2 * SPRITE * sp.size); c.height = Math.ceil(CY * 2 * SPRITE * sp.size);
  const g = c.getContext('2d');
  g.scale(SPRITE, SPRITE);
  g.translate(CX * sp.size, CY * sp.size);
  drawFish(g, sp, (step / (WAGS - 1)) * 2 - 1);
  sprites.set(key, c);
  return c;
}
function placeFish(ctx, species, wag) {
  const sp = SPECIES[species];
  const img = fishSprite(species, wag);
  ctx.drawImage(img, -CX * sp.size, -CY * sp.size, CX * 2 * sp.size, CY * 2 * sp.size);
}

// Où sont les poissons d'une case à l'instant t (en cases autour de son centre), avec leur cap à l'écran et le battement
// de leur queue : une boucle douce (koï), de petits cercles lents qui marquent des pauses (poisson rouge), un banc de
// trois qui file par à-coups (vairons), face au courant en tenant sa place (truite)
const capOf = (du, dv) => Math.atan2((du + dv) * TH / 2, (du - dv) * TW / 2);
export function fishAt(f, t) {
  const sp = SPECIES[f.species];
  if (sp.swim === 'courant') {
    const [fx, fy] = f.flow || [1, 0];
    const sway = Math.sin(t * 1.1 + f.phase) * 0.12;
    return [{ u: -fx * 0.1 - fy * sway, v: -fy * 0.1 + fx * sway, heading: capOf(-fx, -fy), wag: Math.sin(t * 9 + f.phase) * 0.8 }];
  }
  if (sp.swim === 'cercles') {
    // avance par moments, s'arrête et ondule sur place
    const a = t * f.speed * 0.8 + f.phase + Math.sin(t * 0.6 + f.phase) * 0.9;
    const r = 0.22;
    return [{ u: Math.cos(a) * r, v: Math.sin(a) * r, heading: capOf(-Math.sin(a), Math.cos(a)), wag: Math.sin(t * 5 + f.phase) }];
  }
  if (sp.swim === 'banc') {
    // le banc file par à-coups ; chacun suit un peu en retrait, décalé
    const a = t * f.speed * 1.4 + f.phase + Math.sin(t * 1.7 + f.phase) * 0.8;
    return [0, 1, 2].map(k => {
      const b = a - k * 0.22;
      const u = Math.cos(b) * 0.3 + (k - 1) * 0.04, v = Math.sin(2 * b) * 0.15 + (k === 1 ? 0.05 : -0.03 * k);
      return { u, v, heading: capOf(-Math.sin(b) * 0.3, Math.cos(2 * b) * 0.3), wag: Math.sin(t * 14 + k + f.phase) };
    });
  }
  const a = t * f.speed + f.phase;
  return [{ u: Math.cos(a) * 0.3, v: Math.sin(2 * a) * 0.16, heading: capOf(-Math.sin(a) * 0.3, Math.cos(2 * a) * 0.32), wag: Math.sin(t * 7 + f.phase) }];
}

// Bouffée de brume au pied d'une cascade : un rond blanc fondu, dessiné une fois
let puffImage = null;
function mistPuff() {
  if (puffImage) return puffImage;
  const c = document.createElement('canvas');
  c.width = c.height = 32;
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(16, 16, 0, 16, 16, 16);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 32, 32);
  puffImage = c;
  return c;
}
// Un bond : de (x0, y0) à (x1, y1) en arc de hauteur h, k de 0 à 1 ; le poisson suit sa trajectoire (cap tangent)
function leapAt(x0, y0, x1, y1, h, k) {
  const x = x0 + (x1 - x0) * k, y = y0 + (y1 - y0) * k - 4 * h * k * (1 - k);
  const dx = x1 - x0, dy = y1 - y0 - 4 * h * (1 - 2 * k);
  return { x, y, heading: Math.atan2(dy, dx) };
}
// Une gerbe d'eau : un rond qui s'ouvre et quelques gouttes qui retombent (k de 0 à 1)
function splash(ctx, x, y, k, size = 1) {
  if (k < 0 || k > 1) return;
  ctx.strokeStyle = `rgba(255,255,255,${(0.75 * (1 - k)).toFixed(3)})`;
  ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.ellipse(x, y, (4 + k * 11) * size, (4 + k * 11) * size * 0.42, 0, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = `rgba(255,255,255,${(0.9 * (1 - k)).toFixed(3)})`;
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 + 0.4;
    const r = (3 + k * 9) * size, up = Math.sin(Math.PI * k) * 7 * size * (0.6 + hash(i, 3) * 0.6);
    const gx = x + Math.cos(a) * r, gy = y + Math.sin(a) * r * 0.42 - up;
    ctx.moveTo(gx + 1.1, gy); ctx.arc(gx, gy, 1.1, 0, Math.PI * 2);
  }
  ctx.fill();
}
// Les bonds de l'instant : un saumon remonte chaque cascade de temps en temps (une fois sur trois, il retombe), une
// truite saute parfois hors du courant. Chacun a son rythme, tiré de sa place : rien à garder d'une image à l'autre
const LEAP = 1.1;
// Où en est le saut d'une truite (0 → 1 en l'air, au-delà : la gerbe de l'arrivée, puis rien) ; même horloge pour la
// truite qui nage, qu'on ne dessine pas pendant qu'elle est en l'air
export const hopOf = (f, t) => {
  const every = 11 + hash(f.x * 2, f.y) * 9;
  return (((t / every + hash(f.y, f.x * 3)) % 1) * every) / 0.75;
};
function drawLeaps(ctx, M, live, fresh, seen, t) {
  for (const f of live.falls) {
    const c = worldOf(f.x, f.y, M.surface(f.x, f.y));
    if (!seen(c)) continue;
    const every = 9 + hash(f.x, f.y) * 7;
    const clock = t / every + hash(f.y, f.x);
    const k = (clock - Math.floor(clock)) * every / LEAP;
    const round = Math.floor(clock);
    const [x0, y0, x1, y1] = f.side ? [c.x, c.y + TH / 2, c.x + TW / 2, c.y] : [c.x - TW / 2, c.y, c.x, c.y + TH / 2];
    const foot = [(x0 + x1) / 2 + 4, (y0 + y1) / 2 + f.drop + 2], lip = [(x0 + x1) / 2 - 6, (y0 + y1) / 2 - 3];
    const misses = hash(round, f.x + f.y) < 0.33;
    splash(ctx, foot[0], foot[1], k / 0.5);
    if (k >= 1) { if (!misses) splash(ctx, lip[0], lip[1], (k - 1) / 0.4, 0.7); else splash(ctx, foot[0] + 3, foot[1], (k - 1) / 0.5, 0.8); continue; }
    // le raté : il monte aux trois quarts de la chute et retombe dans l'écume
    const to = misses ? [foot[0] + 3, foot[1]] : lip;
    const h = misses ? f.drop * 0.75 + 6 : 12;
    const p = leapAt(foot[0], foot[1], to[0], to[1], h, k);
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.heading);
    placeFish(ctx, 'saumon', Math.sin(t * 22));
    ctx.restore();
  }
  for (const f of fresh.fish) {
    if (f.species !== 'truite') continue;
    const c = worldOf(f.x, f.y, f.z);
    if (!seen(c)) continue;
    const k = hopOf(f, t);
    if (k > 1.5) continue;
    const [fx, fy] = f.flow || [1, 0];
    const dx = (-fx + fy) * TW * 0.12, dy = (-fx - fy) * TH * 0.12;
    const a = [c.x - dx, c.y - dy], b = [c.x + dx, c.y + dy];
    splash(ctx, a[0], a[1], k / 0.5, 0.7);
    if (k >= 1) { splash(ctx, b[0], b[1], (k - 1) / 0.5, 0.7); continue; }
    const p = leapAt(a[0], a[1], b[0], b[1], 13, k);
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.heading);
    placeFish(ctx, 'truite', Math.sin(t * 20));
    ctx.restore();
  }
}

// Tout ce qui vit dans l'eau douce à l'écran : poissons, caustiques, courant, cascades, bonds ; still : mouvement réduit
// (l'eau reste calme : ni bond ni rond)
export function drawFresh(ctx, M, live, fresh, view, t, light, still = false) {
  const seen = c => c.x > view.x - TW && c.x < view.x + view.w + TW && c.y > view.y - TW * 2 && c.y < view.y + view.h + TW;
  // 1. Poissons (sous la surface : un peu voilés), et le rond quand l'un remonte
  ctx.save();
  ctx.globalAlpha = 0.92;
  for (const f of fresh.fish) {
    const c = worldOf(f.x, f.y, f.z);
    if (!seen(c)) continue;
    const sp = SPECIES[f.species];
    if (!still && f.species === 'truite' && hopOf(f, t) < 1) continue;
    let head = null;
    for (const p of fishAt(f, t)) {
      const x = c.x + (p.u - p.v) * TW / 2, y = c.y + (p.u + p.v) * TH / 2;
      head = head || [x, y];
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(p.heading);
      ctx.scale(1, 0.8);
      placeFish(ctx, f.species, p.wag);
      ctx.restore();
    }
    const rise = frac(t / 7 + f.phase * 0.13);
    if (!still && rise < 0.18 && sp.swim !== 'banc') {
      const k = rise / 0.18;
      ctx.strokeStyle = `rgba(255,255,255,${(0.7 * (1 - k)).toFixed(3)})`;
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.ellipse(head[0], head[1], 3 + k * 10, (3 + k * 10) * 0.45, 0, 0, Math.PI * 2); ctx.stroke();
    }
  }
  ctx.restore();
  // 2. La lumière au fond de l'eau douce : une nappe, posée dans les cases d'eau visibles
  const path = new Path2D();
  let any = false;
  for (const cell of fresh.cells) {
    const c = worldOf(cell.x, cell.y, cell.z);
    if (!seen(c)) continue;
    path.moveTo(c.x, c.y - TH / 2 - 0.5); path.lineTo(c.x + TW / 2 + 0.5, c.y); path.lineTo(c.x, c.y + TH / 2 + 0.5); path.lineTo(c.x - TW / 2 - 0.5, c.y);
    any = true;
  }
  if (any) fillCaustics(ctx, path, t, light * 0.85, 1);
  // 3. Le courant : de longs reflets clairs qui glissent vers l'aval et s'effacent (groupés par intensité : quelques
  // tracés par image)
  ctx.save();
  ctx.lineCap = 'round';
  ctx.strokeStyle = 'rgb(235,250,255)';
  const streaks = strokeBatch();
  for (const cell of fresh.cells) {
    if (!cell.flow) continue;
    const c = worldOf(cell.x, cell.y, cell.z);
    if (!seen(c)) continue;
    const [fx, fy] = cell.flow;
    const sx = (fx - fy) * TW / 2, sy = (fx + fy) * TH / 2;
    for (let k = 0; k < 2; k++) {
      const s = frac(t * 0.45 + hash(cell.x + k, cell.y));
      const ox = (hash(cell.y, cell.x + k) - 0.5) * 0.5;
      const x0 = c.x + sx * (s - 0.6) * 0.8 - sy * ox * 0.6, y0 = c.y + sy * (s - 0.6) * 0.8 + sx * ox * 0.6;
      streaks.add(Math.sin(Math.PI * s) * 0.5, 1.4, x => { x.moveTo(x0, y0); x.lineTo(x0 + sx * 0.22, y0 + sy * 0.22); });
    }
  }
  streaks.flush(ctx);
  ctx.restore();
  // 4. Cascades : voile translucide, filets de vitesses et largeurs différentes, écume en ronds et petite brume au pied
  for (const f of live.falls) {
    const c = worldOf(f.x, f.y, M.surface(f.x, f.y));
    if (!seen(c)) continue;
    const [x0, y0, x1, y1] = f.side ? [c.x, c.y + TH / 2, c.x + TW / 2, c.y] : [c.x - TW / 2, c.y, c.x, c.y + TH / 2];
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.lineTo(x1, y1 + f.drop); ctx.lineTo(x0, y0 + f.drop);
    ctx.closePath();
    const sheet = ctx.createLinearGradient(0, Math.min(y0, y1), 0, Math.max(y0, y1) + f.drop);
    sheet.addColorStop(0, 'rgba(235,250,255,.75)');
    sheet.addColorStop(0.5, 'rgba(150,215,240,.55)');
    sheet.addColorStop(1, 'rgba(235,250,255,.85)');
    ctx.fillStyle = sheet;
    ctx.fill();
    ctx.clip();
    ctx.lineCap = 'round';
    for (let k = 0; k < 9; k++) {
      const u = (k + 0.5) / 9 + (hash(k, f.x) - 0.5) * 0.06;
      const sx = x0 + (x1 - x0) * u, sy = y0 + (y1 - y0) * u;
      const speed = 55 + hash(k, f.y) * 50, len = 6 + hash(f.x, k) * 10;
      const off = ((t * speed + k * 23) % (f.drop + len)) - len;
      ctx.strokeStyle = `rgba(255,255,255,${(0.55 + 0.4 * hash(k, 7)).toFixed(3)})`;
      ctx.lineWidth = 1 + hash(k, 3) * 1.6;
      ctx.beginPath(); ctx.moveTo(sx, sy + off); ctx.lineTo(sx, sy + off + len); ctx.stroke();
    }
    ctx.restore();
    // pied : ronds d'écume qui s'ouvrent, bouillon blanc, brume qui monte
    const fx = (x0 + x1) / 2, fy = (y0 + y1) / 2 + f.drop;
    for (let k = 0; k < 3; k++) {
      const g = frac(t * 0.9 + k / 3);
      ctx.strokeStyle = `rgba(255,255,255,${(0.6 * (1 - g)).toFixed(3)})`;
      ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.ellipse(fx, fy + 1, 8 + g * 12, (8 + g * 12) * 0.42, 0, 0, Math.PI * 2); ctx.stroke();
    }
    ctx.fillStyle = 'rgba(255,255,255,.85)';
    ctx.beginPath();
    for (let k = 0; k < 6; k++) {
      const r = 2.2 + hash(k, f.x + 1) * 2.4 + Math.sin(t * 8 + k) * 0.6;
      const bx = fx + (k - 2.5) * 3.2, by = fy + Math.sin(t * 5 + k * 2) * 0.8;
      ctx.moveTo(bx + r, by); ctx.ellipse(bx, by, r, r * 0.6, 0, 0, Math.PI * 2);
    }
    ctx.fill();
    const puff = mistPuff();
    for (let k = 0; k < 4; k++) {
      const m = frac(t * 0.35 + k / 4 + f.x * 0.1);
      const r = 5 + m * 9;
      ctx.globalAlpha = 0.35 * (1 - m);
      ctx.drawImage(puff, fx + (k - 1.5) * 4 - r, fy - m * 18 - r, r * 2, r * 2);
    }
    ctx.globalAlpha = 1;
  }
  // 5. Les bonds, par-dessus l'eau et les cascades (pas en mouvement réduit)
  if (!still) drawLeaps(ctx, M, live, fresh, seen, t);
}

// Les espèces, et un poisson seul (aperçus, tests)
export const SPECIES_IDS = Object.keys(SPECIES);
export const drawSpecies = (ctx, species, wag = 0) => drawFish(ctx, SPECIES[species], wag);
