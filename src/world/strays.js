// Les égarés d'une nuit sur l'île (HISTOIRE.md § 6.15 ; serveur : services/nights.js). Le serveur décide de tout (d'où
// ils sortent, leur chemin, leur sort) ; ici, seulement où est chacun à un instant et ce qu'il fait. Un égaré sort de
// la brume à son heure (at) et marche d'une case toutes les 2 minutes (pace : son pas, chacun sa manière) ; à sa case
// d'arrêt (step) :
// - une lumière le change en luciole, qui luit sur place jusqu'au matin ;
// - une clôture le barre, le coq le chasse, un camarade le renvoie, un toucher le repousse : il boude, puis retourne
//   dans la brume ; le Dormeur, lui, s'endort contre la clôture ('dort') jusqu'au matin (au tutoriel, jusqu'à wakeAt) ;
// - arrivé à son bâtiment, il s'y fond (le bâtiment est embrumé au matin).
// Le Noyé sort de la mer et l'Esprit revient (back) en sortant de la brume (sa pose brume, à l'envers) ; la Racine
// passe sous les clôtures (sa pose terre).

import { NIGHT_RECAP } from '@/texts/world/nights';

export const MS_PER_CELL = 2 * 60 * 1000;
// Bouderie (deux images à 500 ms, deux fois), puis retour dans la brume (trois images à 220 ms), luciole (quatre à 200)
const SULK_MS = 2000;
const MIST_MS = 660;
const GLOW_MS = 800;
// Le Dormeur endormi respire (deux images)
const DOZE_MS = 700;

// La Racine sous une clôture (under(x, y) : une clôture sur cette case) : l'image de sa pose terre (1 à 3 : enfoncée),
// ou null (dehors). from, to : les cases entre lesquelles elle est, k : où (0 à 1)
function sinkOf(under, from, to, k) {
  const inFrom = under(from.x, from.y);
  const inTo = under(to.x, to.y);
  if (inFrom && inTo) return 3;
  if (inTo) return k < 0.4 ? null : Math.min(3, Math.floor((k - 0.4) / 0.2) + 1);
  if (inFrom) return k >= 0.6 ? null : 3 - Math.floor(k / 0.2);
  return null;
}

// La pose d'une fois à l'instant since (ms depuis son début) : { pose, n } ou null (finie)
function onceAt(since, pose, frames, ms) {
  const n = Math.floor(since / ms) + 1;
  return n <= frames ? { pose, n } : null;
}

// L'état d'un égaré à l'instant now (ms) : { x, y, view, flip, pose, n, glow? } (glow : la luciole qui luit), ou null
// (pas encore sorti, ou reparti). c : l'égaré vu du serveur ({ id, kind, path, at, pace, step, end, back? }) ;
// repelledAt : l'instant où le joueur l'a repoussé sur cet appareil (sa bouderie s'y joue), sinon null ; under(x, y) :
// une clôture sur cette case (la Racine passe dessous), ou null
export function strayAt(c, now, repelledAt = null, under = null) {
  if (now < c.at || !c.path || !c.path.length) return null;
  const touched = c.end === 'touche' || repelledAt !== null;
  if (touched && repelledAt === null) return null;
  // (l'égaré du tutoriel, qui montre la clôture, marche plus vite : cellMs)
  const cell = c.cellMs || c.pace || MS_PER_CELL;
  const stopAt = touched ? repelledAt : c.at + c.step * cell;
  const e = (Math.min(now, stopAt) - c.at) / cell;
  const last = c.path.length - 1;
  const i = Math.min(Math.max(0, Math.floor(e)), last);
  const from = c.path[i];
  const to = c.path[Math.min(i + 1, last)];
  const k = Math.min(1, e - i);
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  // De trois quarts avant quand il descend vers l'écran, de dos quand il remonte ; le miroir pour l'autre côté
  const base = { x: from.x + dx * k, y: from.y + dy * k, view: dx + dy < 0 ? 'dos' : 'avant', flip: dx - dy < 0 };
  const front = { ...base, view: 'avant' };
  if (now < stopAt) {
    const out = now - c.at;
    if ((c.kind === 'noye' || c.back) && out < MIST_MS) return { ...front, pose: 'brume', n: 3 - Math.floor(out / 220) };
    const sink = c.kind === 'racine' && under ? sinkOf(under, from, to, k) : null;
    if (sink) return { ...front, pose: 'terre', n: sink };
    return { ...base, pose: 'marche', n: (Math.floor(out / 240) % 2) + 1 };
  }
  const since = now - stopAt;
  if (!touched && c.end === 'luciole') return since < GLOW_MS ? { ...front, ...onceAt(since, 'luciole', 4, 200) } : { ...front, pose: null, glow: true };
  if (!touched && c.end === 'arrive') {
    const mist = onceAt(since, 'brume', 3, 220);
    return mist ? { ...front, ...mist } : null;
  }
  // Le Dormeur dodeline, puis dort contre la clôture ; réveillé (wakeAt), il boude et rentre
  if (!touched && c.end === 'dort' && !(c.wakeAt && now >= c.wakeAt)) {
    if (since < SULK_MS) return { ...front, pose: 'bouderie', n: (Math.floor(since / 500) % 2) + 1 };
    return { ...front, pose: 'dort', n: (Math.floor((since - SULK_MS) / DOZE_MS) % 2) + 1 };
  }
  if (!touched && c.end === 'dort') return sulkAt(front, now - c.wakeAt);
  // Barré, chassé par le coq, renvoyé ou repoussé : il boude, puis retourne dans la brume
  return sulkAt(front, since);
}
// Il boude, puis retourne dans la brume (since : ms depuis qu'il s'est arrêté), ou null (reparti)
function sulkAt(front, since) {
  if (since < SULK_MS) return { ...front, pose: 'bouderie', n: (Math.floor(since / 500) % 2) + 1 };
  const mist = since < SULK_MS + MIST_MS ? onceAt(since - SULK_MS, 'brume', 3, 220) : null;
  return mist ? { ...front, ...mist } : null;
}

// Les cases d'un trait de a à b (Bresenham), a et b compris : le chemin d'un égaré (serveur : nights.js, lineOf)
export function lineOf(a, b) {
  const out = [];
  let { x, y } = a;
  const dx = Math.abs(b.x - x);
  const dy = -Math.abs(b.y - y);
  const sx = x < b.x ? 1 : -1;
  const sy = y < b.y ? 1 : -1;
  let err = dx + dy;
  for (;;) {
    out.push({ x, y });
    if (x === b.x && y === b.y) return out;
    const e2 = 2 * err;
    if (e2 >= dy) {
      err += dy;
      x += sx;
    }
    if (e2 <= dx) {
      err += dx;
      y += sy;
    }
  }
}

// La nuit est-elle là (les égarés dehors) : nights vu du serveur ({ night: { start, end } }) à l'instant now
export const nightNow = (nights, now) => Boolean(nights && nights.started && nights.night && now >= nights.night.start && now < nights.night.end);

// Ce que Brume dit au matin d'une nuit finie (last : { counts, panne }) ; siteName : le nom d'un bâtiment. [lignes]
// (le Dormeur endormi contre une clôture compte avec ceux qu'elle a barrés ; l'Esprit revenu compte une sortie de plus :
// les textes propres à chacun viendront avec la refonte du ton, choix de l'auteur, 14 oct.)
export function recapOf(last, siteName) {
  const { luciole, barre: barred, dort = 0, coq = 0, camarade, touche, arrive } = last.counts;
  const barre = barred + dort;
  const total = luciole + barre + coq + camarade + touche + arrive;
  if (!total) return [];
  const lines = [NIGHT_RECAP.out(total)];
  if (luciole) lines.push(NIGHT_RECAP.luciole(luciole));
  if (barre) lines.push(NIGHT_RECAP.barre(barre));
  // (le coq, une fois par nuit : choix de l'auteur, 14 oct., texte validé)
  if (coq) lines.push(NIGHT_RECAP.coq);
  if (camarade) lines.push(NIGHT_RECAP.camarade(camarade));
  if (touche) lines.push(NIGHT_RECAP.touche(touche));
  lines.push(last.panne ? NIGHT_RECAP.panne(siteName(last.panne)) : NIGHT_RECAP.held);
  return lines;
}
