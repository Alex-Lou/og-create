// Le village (world/village.js) : Anya (bible, § 6.14), une fois révélée. Son passage, à l'aube ou au crépuscule,
// avec son cerf blanc et ses lucioles ; ses loutres au bord de l'eau douce ; le bol de soupe « pour la Dame » ; les
// bêtes qui se tournent vers elle ; ce qu'ils disent quand on les touche.
import { anyaHere } from '@/game/anya';
import { BEAST_NAMES } from '@/texts/village';
import { ANYA_TEXTS as T } from '@/texts/world/anya';
import { beast } from './beast';

// Les bêtes qui se tournent vers Anya : à moins de 8 cases d'elle
const ANYA_SIGN_RANGE = 8;

// Anya, ses loutres et le bol de la Dame à l'instant du dessin (f : t, h, phase, rain, tapped, out, dayTime, night) :
// rend son passage ({ x, y }), ou null
export function drawAnya(f, { wild, along }, { anya, banks, dame, home }) {
  const { t, h, phase, rain, tapped, out, dayTime, night } = f;
  // Anya, le jour de son passage, à son moment (l'aube ou le crépuscule) : son cerf blanc, ses lucioles
  const here = anya && anya.visit && anyaHere(h, phase.rise, phase.set, anya.visit.slot) ? anya.visit : null;
  if (here) {
    const hop = tapped('anya:dame', 0.8);
    out.push(beast('anya:dame', 'anya', '', here.x + 0.5, here.y + 0.5, hop === null ? 0 : Math.sin(hop * Math.PI) * 3, false, Math.floor(t * 0.5) % 2));
    out.push(beast('anya:cerf', 'deer', 'blanc', here.x + 1.3, here.y + 0.9, 0, true, Math.floor(t / 5) % 2));
    for (let k = 0; k < 6; k++) {
      const a = t * 0.3 + k * 1.05;
      out.push(beast(`anya:luciole:${k}`, 'firefly', '', here.x + 0.5 + Math.cos(a) * 0.9, here.y + 0.5 + Math.sin(a) * 0.6, 18 + k * 4 + Math.sin(t + k) * 3, false, Math.floor(t * 1.4 + k) % 2));
    }
  }
  if (anya && banks.length) {
    [0, 1].forEach(k => wild(`anya:otter:${k}`, 'otter', k ? banks.slice().reverse() : banks, dayTime && rain < 0.6, c => {
      const up = (t + k * 2) % 6 < 1.2;
      const flip = Math.cos(t * 0.2 + k) < 0;
      return { x: c.x + Math.sin(t * 0.2 + k) * 0.3, y: c.y, frame: up ? 1 : 0, flip, look: along(flip, up ? 1 : 0) };
    }));
  }
  // Le bol de soupe « pour la Dame », posé chaque soir au bord du Foyer
  if (dame && home && (night || h >= phase.set + 0.4)) out.push(beast('dame:bol', 'soup', '', home.x + 0.45, home.y + 0.35, 0, false, Math.floor(t * 1.5) % 2));
  return here;
}

  // Le signe de son passage (§ 6.14) : les bêtes alentour se tournent toutes vers Anya (les poissons non)
  export function anyaSign(out, here) {
  if (!here) return;
  {
    for (const b of out) {
      if (b.id.startsWith('anya:') || b.species === 'koi' || Math.hypot(b.x - here.x, b.y - here.y) > ANYA_SIGN_RANGE) continue;
      b.flip = (here.x - b.x) - (here.y - b.y) < 0;
    }
  }
}

// Anya, son cerf, ses lucioles, ses loutres ; le bol de la Dame (toucher : ce qu'ils disent ; appui long : leur fiche)
export function storyInfo(who, long) {
  if (who.id === 'anya:dame') return { title: 'Anya', text: long ? T.dame.sheet : T.dame.says, ...(long ? { hint: T.dame.hint } : {}) };
  if (who.id === 'anya:cerf') return { title: 'Le cerf blanc', text: long ? T.cerf.sheet : T.cerf.says, ...(long ? { hint: T.cerf.hint } : {}) };
  if (who.id === 'dame:bol') return { title: 'Un bol de soupe', text: T.bol.text, ...(long ? { hint: T.bol.hint } : {}) };
  if (who.id.startsWith('anya:otter')) return long ? { title: 'Loutre', text: BEAST_NAMES.otter[1], hint: T.otter.hint } : null;
  return long ? { title: 'Luciole', text: T.luciole.text, hint: T.luciole.hint } : null;
}
