// Les fêtes de l'île : ce qui se célèbre sur l'île même, posé dans le monde et attaché au bâtiment (la fête suit la
// caméra, comme le décor). Quatre niveaux, du plus discret au plus ample : Pétille, Éclat, Fête, Grand moment. Ce lot
// joue les deux derniers : un bâtiment construit ou qui gagne un palier a sa Fête ; le palier IV, son Grand moment.
// Une Fête suit l'élévation du bâtiment (RAISE_MS, view/draw/sites.js : drawSite) :
//   1. la lumière se rassemble au pied pendant que l'ancien état tremble dans la poussière ;
//   2. une lueur monte avec le bâtiment ;
//   3. au rebond (BURST_MS), l'éclat : un flash au sommet, une couronne d'étincelles, une onde au sol ;
//   4. des lucioles montent, et un mot doré s'élève au-dessus du bâtiment avec son nom et son palier.
// Le Grand moment en plus ample : la caméra s'y pose, l'île autour s'assombrit (un projecteur), une colonne de lumière,
// une pluie d'étoiles, et un ralenti d'un instant au sommet de l'éclat. Un toucher rend la main (le projecteur s'efface).
// Le chef d'orchestre (enqueue, tick) les range : une seule Fête ou un seul Grand moment à la fois, les autres attendent
// leur tour. Tout se déduit du temps écoulé et d'une graine (rien à garder d'une image à l'autre). Mouvement réduit :
// le mot seul, immobile.
import { lueur, etoile } from '@/utils/vfx';
import { roman } from '@/utils/roman';
import { hash } from './scene';
import { TINT, font } from './charte';

// L'élévation d'un bâtiment (ms), et le moment de son rebond : l'éclat
export const RAISE_MS = 2400;
export const BURST_MS = RAISE_MS * 0.85;
// Durée de chaque niveau (ms)
export const DURATION = { fete: 4600, grand: 5600 };
// Le palier qui a son Grand moment
export const GRAND_LEVEL = 4;

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (a, b, x) => { const k = clamp((x - a) / (b - a)); return k * k * (3 - 2 * k); };
const out = k => 1 - (1 - k) ** 3;

// Teintes, en canaux
const OR = '255,214,120', CLAIR = '255,248,226', MENTHE = '206,252,222', LAVANDE = '214,196,255';

/* ---------- Le chef d'orchestre ---------- */
// L'orchestre : { playing, waiting } ; une fête : { id, kind ('fete' | 'grand'), site, from, level, x, y, top, name,
// start } (x, y : le pied du bâtiment dans le monde ; top : sa hauteur)
export const orchestra = () => ({ playing: [], waiting: [] });
// Une fête de plus : elle commence tout de suite si rien d'autre ne joue, sinon elle attend son tour ; rend celles qui
// commencent maintenant
export function enqueue(o, fete, now) {
  if (o.playing.length || o.waiting.length) {
    o.waiting.push(fete);
    return [];
  }
  const started = { ...fete, start: now };
  o.playing.push(started);
  return [started];
}
// À chaque image : les fêtes finies s'en vont, la suivante commence ; rend celles qui commencent maintenant
export function tick(o, now) {
  o.playing = o.playing.filter(f => now - f.start < DURATION[f.kind]);
  if (o.playing.length || !o.waiting.length) return [];
  const next = { ...o.waiting.shift(), start: now };
  o.playing.push(next);
  return [next];
}
// La fête d'un bâtiment qui gagne un palier : Grand moment au palier IV, Fête sinon
export const kindOf = level => (level === GRAND_LEVEL ? 'grand' : 'fete');
// Le mot de la fête (le même pour un bâtiment et un palier donnés), et la ligne en dessous
const WORDS = { fete: ['Bravo !', 'Magnifique !', 'Splendide !', 'Hourra !'], grand: ['Merveilleux !', 'Quelle splendeur !'] };
export function wordsOf(fete) {
  const list = WORDS[fete.kind];
  return { word: list[Math.floor(hash(fete.site.length * 7.1, fete.level * 3.3) * list.length)], line: `${fete.name} · palier ${roman(fete.level)}` };
}

/* ---------- Le dessin (dans le monde, caméra appliquée) ---------- */
// Le ralenti du Grand moment : le temps de l'éclat s'étire au sommet (0,35 × pendant 400 ms), puis reprend
function burstAge(ms, grand) {
  if (!grand || ms <= 0) return ms;
  return ms < 400 ? ms * 0.35 : 140 + (ms - 400);
}

// Le projecteur du Grand moment : l'île s'assombrit autour du bâtiment ; calm : le moment où un toucher l'a apaisé
export function spotlightOf(fete, now, calm = null) {
  if (!fete || fete.kind !== 'grand') return 0;
  const ms = now - fete.start;
  const k = smooth(0, 900, ms) * (1 - smooth(DURATION.grand - 800, DURATION.grand, ms));
  return calm && calm > fete.start ? k * (1 - smooth(calm, calm + 400, now)) : k;
}
export function drawSpotlight(ctx, fete, view, k) {
  if (k < 0.01) return;
  const cx = fete.x, cy = fete.y - fete.top * 0.5;
  const g = ctx.createRadialGradient(cx, cy, 90, cx, cy, 420);
  g.addColorStop(0, 'rgba(14,16,36,0)');
  g.addColorStop(1, `rgba(14,16,36,${(0.38 * k).toFixed(3)})`);
  ctx.save();
  ctx.fillStyle = g;
  ctx.fillRect(view.x, view.y, view.w, view.h);
  ctx.restore();
}

// La lumière d'une fête à l'instant now (après la lumière de l'heure : elle brille)
export function drawFete(ctx, fete, now) {
  const ms = now - fete.start;
  const grand = fete.kind === 'grand';
  const amp = grand ? 1.45 : 1;
  const { x, y, top } = fete;
  const crown = y - top;
  const seed = fete.site.length * 13 + fete.level;
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  // 1. la lumière se rassemble au pied (des grains qui convergent en spirale)
  if (ms < 1100) {
    const n = grand ? 22 : 14;
    for (let i = 0; i < n; i++) {
      const k = clamp((ms - hash(i, seed) * 300) / 800);
      if (k <= 0 || k >= 1) continue;
      const a = hash(i, seed + 1) * Math.PI * 2 + k * 2.2;
      const r = (70 + 40 * hash(i, seed + 2)) * amp * (1 - out(k));
      ctx.globalAlpha = Math.sin(k * Math.PI) * 0.9;
      const s = 6 + 4 * hash(i, seed + 3);
      ctx.drawImage(lueur(i % 3 ? OR : CLAIR), x + Math.cos(a) * r - s / 2, y + Math.sin(a) * r * 0.5 - s / 2, s, s);
    }
  }
  // 2. une lueur au pied, qui monte avec le bâtiment
  if (ms < BURST_MS + 300) {
    const k = smooth(300, 1000, ms) * (1 - smooth(BURST_MS, BURST_MS + 300, ms));
    const rise = smooth(RAISE_MS * 0.35, BURST_MS, ms);
    const r = 46 * amp;
    ctx.globalAlpha = 0.55 * k;
    ctx.drawImage(lueur(OR), x - r, y - top * rise - r * 0.6, r * 2, r * 1.2);
  }
  // colonne de lumière du Grand moment
  if (grand && ms > BURST_MS - 300 && ms < BURST_MS + 2200) {
    const k = smooth(BURST_MS - 300, BURST_MS, ms) * (1 - smooth(BURST_MS + 1200, BURST_MS + 2200, ms));
    // (assez légère pour qu'on voie le bâtiment à travers)
    const h = top + 260, w = 54;
    const g = ctx.createLinearGradient(0, y, 0, y - h);
    g.addColorStop(0, `rgba(${CLAIR},${(0.22 * k).toFixed(3)})`);
    g.addColorStop(0.5, `rgba(${OR},${(0.14 * k).toFixed(3)})`);
    g.addColorStop(1, `rgba(${OR},0)`);
    ctx.globalAlpha = 1;
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(x, y - h / 2, w / 2, h / 2, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  // 3. l'éclat : flash au sommet, couronne d'étincelles, onde au sol
  const b = burstAge(ms - BURST_MS, grand);
  if (b >= 0 && b < 1400) {
    if (b < 360) {
      const r = (40 + 60 * out(b / 360)) * amp;
      ctx.globalAlpha = 0.6 * (1 - b / 360);
      ctx.drawImage(lueur(CLAIR), x - r, crown - r, r * 2, r * 2);
    }
    if (b < 800) {
      const k = b / 800;
      ctx.globalAlpha = 0.7 * (1 - k);
      ctx.strokeStyle = `rgb(${OR})`;
      ctx.lineWidth = 3 * (1 - k) + 0.5;
      ctx.beginPath();
      ctx.ellipse(x, y, (30 + 120 * out(k)) * amp, (15 + 60 * out(k)) * amp, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    const n = grand ? 30 : 18;
    for (let i = 0; i < n; i++) {
      const life = 800 + hash(i, seed + 4) * 500;
      if (b > life) continue;
      const k = b / life;
      const a = (i / n) * Math.PI * 2 + hash(i, seed + 5) * 0.4;
      const v = (70 + 80 * hash(i, seed + 6)) * amp;
      const px = x + Math.cos(a) * v * out(k);
      const py = crown + Math.sin(a) * v * 0.6 * out(k) + 60 * k * k;
      const s = (5 + 7 * hash(i, seed + 7)) * (1 - k * 0.6);
      ctx.globalAlpha = 1 - k;
      ctx.drawImage(i % 4 ? lueur(i % 2 ? OR : CLAIR) : etoile(OR), px - s / 2, py - s / 2, s, s);
    }
  }
  // pluie d'étoiles du Grand moment
  if (grand && b >= 0 && b < 2600) {
    for (let i = 0; i < 28; i++) {
      const delay = hash(i, seed + 8) * 1200;
      const k = (b - delay) / 1400;
      if (k <= 0 || k >= 1) continue;
      const px = x + (hash(i, seed + 9) - 0.5) * 300;
      const py = crown - 160 + k * (200 + 80 * hash(i, seed + 10));
      const s = 7 + 6 * hash(i, seed + 11);
      ctx.globalAlpha = Math.sin(k * Math.PI) * (0.6 + 0.4 * Math.sin(now / 90 + i));
      ctx.drawImage(etoile(i % 2 ? OR : LAVANDE), px - s / 2, py - s / 2, s, s);
    }
  }
  // 4. des lucioles montent autour du bâtiment
  if (b >= 0) {
    const n = grand ? 16 : 10;
    for (let i = 0; i < n; i++) {
      const k = (b - hash(i, seed + 12) * 600) / 2200;
      if (k <= 0 || k >= 1) continue;
      const px = x + (hash(i, seed + 13) - 0.5) * 140 * amp + Math.sin(k * 6 + i) * 8;
      const py = y - 10 - k * (top + 70);
      const s = 5 + 4 * hash(i, seed + 14);
      ctx.globalAlpha = Math.sin(k * Math.PI) * 0.85;
      ctx.drawImage(lueur(i % 3 ? MENTHE : OR), px - s / 2, py - s / 2, s, s);
    }
  }
  ctx.restore();
}

// Le mot de la fête au-dessus du bâtiment (après les noms et les bulles : rien ne le cache). still : mouvement
// réduit (le mot seul, immobile, tout le temps de la fête). k : 1 / le zoom (le mot garde sa taille à l'écran)
export function drawFeteWords(ctx, fete, now, k = 1, still = false) {
  const ms = still ? BURST_MS + 600 : now - fete.start;
  const from = BURST_MS + 60, end = DURATION[fete.kind];
  if (!still && (ms < from || ms > end)) return;
  const shown = still ? 1 : smooth(from, from + 260, ms) * (1 - smooth(end - 500, end, ms));
  const pop = still ? 1 : 0.7 + 0.3 * out(clamp((ms - from) / 260)) + 0.06 * Math.sin(clamp((ms - from) / 400) * Math.PI);
  const rise = still ? 0 : 24 * out(clamp((ms - from) / (end - from)));
  const { word, line } = wordsOf(fete);
  const grand = fete.kind === 'grand';
  const x = fete.x, y = fete.y - fete.top - 34 * k - rise * k;
  ctx.save();
  ctx.globalAlpha = shown;
  ctx.translate(x, y);
  ctx.scale(pop * k, pop * k);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.lineJoin = 'round';
  ctx.font = font(900, grand ? 26 : 22);
  ctx.lineWidth = 5;
  ctx.strokeStyle = TINT.ink;
  ctx.strokeText(word, 0, 0);
  const g = ctx.createLinearGradient(0, -12, 0, 12);
  g.addColorStop(0, TINT.gold100);
  g.addColorStop(1, TINT.gold400);
  ctx.fillStyle = g;
  ctx.fillText(word, 0, 0);
  ctx.font = font(800, 12);
  ctx.lineWidth = 3.5;
  ctx.strokeText(line, 0, 22);
  ctx.fillStyle = TINT.vellum;
  ctx.fillText(line, 0, 22);
  ctx.restore();
}
