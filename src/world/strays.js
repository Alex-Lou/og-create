// Les égarés d'une nuit sur l'île (HISTOIRE.md § 6.15 ; serveur : services/nights.js). Le serveur décide de tout (d'où
// ils sortent, leur chemin, leur sort) ; ici, seulement où est chacun à un instant et ce qu'il fait. Un égaré sort de
// la brume à son heure (at) et marche d'une case toutes les 2 minutes ; à sa case d'arrêt (step) :
// - une lumière le change en luciole, qui luit sur place jusqu'au matin ;
// - une clôture le barre, un camarade le renvoie, un toucher le repousse : il boude, puis retourne dans la brume ;
// - arrivé à son bâtiment, il s'y fond (le bâtiment est embrumé au matin).

export const MS_PER_CELL = 2 * 60 * 1000;
// Bouderie (deux images à 500 ms, deux fois), puis retour dans la brume (trois images à 220 ms), luciole (quatre à 200)
const SULK_MS = 2000;
const MIST_MS = 660;
const GLOW_MS = 800;

// La pose d'une fois à l'instant since (ms depuis son début) : { pose, n } ou null (finie)
function onceAt(since, pose, frames, ms) {
  const n = Math.floor(since / ms) + 1;
  return n <= frames ? { pose, n } : null;
}

// L'état d'un égaré à l'instant now (ms) : { x, y, view, flip, pose, n, glow? } (glow : la luciole qui luit), ou null
// (pas encore sorti, ou reparti). c : l'égaré vu du serveur ({ id, path, at, step, end }) ; repelledAt : l'instant où
// le joueur l'a repoussé sur cet appareil (sa bouderie s'y joue), sinon null
export function strayAt(c, now, repelledAt = null) {
  if (now < c.at || !c.path || !c.path.length) return null;
  const touched = c.end === 'touche' || repelledAt !== null;
  if (touched && repelledAt === null) return null;
  const stopAt = touched ? repelledAt : c.at + c.step * MS_PER_CELL;
  const e = (Math.min(now, stopAt) - c.at) / MS_PER_CELL;
  const last = c.path.length - 1;
  const i = Math.min(Math.max(0, Math.floor(e)), last);
  const from = c.path[i];
  const to = c.path[Math.min(i + 1, last)];
  const k = Math.min(1, e - i);
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  // De trois quarts avant quand il descend vers l'écran, de dos quand il remonte ; le miroir pour l'autre côté
  const base = { x: from.x + dx * k, y: from.y + dy * k, view: dx + dy < 0 ? 'dos' : 'avant', flip: dx - dy < 0 };
  if (now < stopAt) return { ...base, pose: 'marche', n: (Math.floor((now - c.at) / 240) % 2) + 1 };
  const since = now - stopAt;
  const front = { ...base, view: 'avant' };
  if (!touched && c.end === 'luciole') return since < GLOW_MS ? { ...front, ...onceAt(since, 'luciole', 4, 200) } : { ...front, pose: null, glow: true };
  if (!touched && c.end === 'arrive') {
    const mist = onceAt(since, 'brume', 3, 220);
    return mist ? { ...front, ...mist } : null;
  }
  // Barré, renvoyé ou repoussé : il boude, puis retourne dans la brume
  if (since < SULK_MS) return { ...front, pose: 'bouderie', n: (Math.floor(since / 500) % 2) + 1 };
  const mist = since < SULK_MS + MIST_MS ? onceAt(since - SULK_MS, 'brume', 3, 220) : null;
  return mist ? { ...front, ...mist } : null;
}

// La nuit est-elle là (les égarés dehors) : nights vu du serveur ({ night: { start, end } }) à l'instant now
export const nightNow = (nights, now) => Boolean(nights && nights.started && nights.night && now >= nights.night.start && now < nights.night.end);

// Ce que Brume dit au matin d'une nuit finie (last : { counts, panne }) ; siteName : le nom d'un bâtiment. [lignes]
export function recapOf(last, siteName) {
  const { luciole, barre, camarade, touche, arrive } = last.counts;
  const total = luciole + barre + camarade + touche + arrive;
  if (!total) return [];
  const s = n => (n > 1 ? 's' : '');
  const lines = [`Cette nuit, ${total} égaré${s(total)} ${total > 1 ? 'sont sortis' : 'est sorti'} de la brume.`];
  if (luciole) lines.push(`${luciole} ${luciole > 1 ? 'sont devenus des lucioles' : 'est devenu luciole'} près de tes lumières.`);
  if (barre) lines.push(`${barre} ${barre > 1 ? 'ont boudé' : 'a boudé'} devant une clôture.`);
  if (camarade) lines.push(`Tes camarades en ont renvoyé ${camarade}.`);
  if (touche) lines.push(`Tu en as repoussé ${touche} toi-même.`);
  lines.push(last.panne ? `Un bâtiment est embrumé (${siteName(last.panne)}) : répare-le depuis sa fiche.` : 'Rien n’a été embrumé : le camp a tenu.');
  return lines;
}
