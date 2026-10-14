// Verdict d'un mélange visé sur une page à portée : combien d'ingrédients sont justes, jamais lesquels.
// aim = { tried: [noms essayés], right, of, misses (null pour un invité), need, freeInk }. Les phrases : texts/book/aim.js
import { AIM as T } from '@/texts/book/aim';

const verdict = aim => (aim.right
  ? T.verdict(aim.right, aim.of)
  : T.none);

// Ligne courte peinte sur la page
export function aimNote(aim, misses, need) {
  if (aim) {
    const count = aim.tried.length !== aim.of ? T.count(aim.of) : '';
    return `${aim.tried.join(' + ')} → ${verdict(aim)}${count}`;
  }
  if (misses && need && misses < need) return T.misses(misses, need);
  return '';
}

// Phrase de l'Athanor quand le mélange visé ne donne rien
export function aimMessage(aim) {
  const count = aim.tried.length !== aim.of ? T.size(aim.of) : '';
  let ink = '';
  if (aim.freeInk) ink = T.freeInk;
  else if (aim.misses !== null && aim.need) {
    const left = aim.need - aim.misses;
    ink = T.left(left);
  }
  return T.message(verdict(aim), count, ink);
}
