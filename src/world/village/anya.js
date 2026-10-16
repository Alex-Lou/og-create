// Le village (world/village.js) : Anya (bible, § 6.14), une fois révélée. Son passage, à l'aube ou au crépuscule,
// avec son cerf blanc et ses lucioles ; ses loutres au bord de l'eau douce ; le bol de soupe « pour la Dame » ; les
// bêtes qui se tournent vers elle ; ce qu'ils disent quand on les touche.
import { anyaHere, anyaVisitClock } from '@/game/anya';
import { BEAST_NAMES } from '@/texts/village';
import { ANYA_TEXTS as T } from '@/texts/world/anya';
import { SEASON } from '../plants';
import { anyaArt, cerfArt, frameOf, durationOf, ANYA_POSES as AP, CERF_POSES as CP, PHRASES } from '../anyaArt';
import { beast, hash, smooth } from './beast';

// Les bêtes qui se tournent vers Anya : à moins de 8 cases d'elle
const ANYA_SIGN_RANGE = 8;

// Son errance (choix de l'auteur, 16 oct.) : autour de son point de visite, dans un petit rayon (WANDER cases) ; une étape
// toutes les LEG secondes : elle se repose (PAUSE), puis flotte jusqu'à la suivante. Son cerf la suit, TRAIL secondes
// derrière elle, à côté (CERF_SIDE)
const WANDER = 2.4;
const LEG = 14;
const PAUSE = 8;
const TRAIL = 2.2;
const CERF_SIDE = [0.8, 0.5];
// Le murmure : rarement (une fois sur MURMURE_ODDS), quand on la touche, une bulle de son écriture de lune
const MURMURE_ODDS = 8;
const MURMURE_S = 3.2;

const stopOf = (center, seed, k) => {
  const a = hash(seed + k * 7.3, k) * 2 * Math.PI;
  const r = WANDER * Math.sqrt(hash(k, seed + 1.7));
  return { x: center.x + Math.cos(a) * r, y: center.y + Math.sin(a) * r };
};
// Où elle est à l'instant t (secondes) : { x, y, dx, dy, moving } (dx, dy : son pas, quand elle flotte)
export function anyaPath(t, center, seed = 0) {
  const k = Math.floor(t / LEG);
  const s = t - k * LEG;
  const a = stopOf(center, seed, k);
  if (s < PAUSE) return { x: a.x, y: a.y, dx: 0, dy: 0, moving: false };
  const b = stopOf(center, seed, k + 1);
  const p = smooth((s - PAUSE) / (LEG - PAUSE));
  return { x: a.x + (b.x - a.x) * p, y: a.y + (b.y - a.y) * p, dx: b.x - a.x, dy: b.y - a.y, moving: true };
}
// La vue d'un pas (vers le bas de l'écran : de trois quarts avant ; vers le haut : de dos) et le miroir (vers la gauche)
const facing = (dx, dy) => ({ view: dx + dy > 0 ? 'avant' : 'dos', flip: dx - dy < 0 });

// Ce qu'Anya joue à l'instant t : { pose, view, flip, n, phrase } ; clock : son passage (anyaVisitClock) ; path : où elle
// est ; touch : depuis quand on l'a touchée (s), ou null. Elle apparaît au début de son passage et disparaît à la fin
// (de face) ; touchée, rarement, elle murmure ; sinon elle flotte, ou se repose de face
export function anyaPose(t, { clock, path, touch, seed = 0 }) {
  if (clock && clock.until < durationOf(AP.disparaitre)) return { pose: 'disparaitre', view: 'face', flip: false, n: frameOf(AP.disparaitre, durationOf(AP.disparaitre) - clock.until, true) };
  if (clock && clock.since < durationOf(AP.apparaitre)) return { pose: 'apparaitre', view: 'face', flip: false, n: frameOf(AP.apparaitre, clock.since, true) };
  const way = path.moving ? facing(path.dx, path.dy) : { view: 'face', flip: false };
  if (touch !== null) {
    const at = Math.round((t - touch) * 10);
    if (hash(at, seed) * MURMURE_ODDS < 1) return { pose: 'murmure', ...way, n: frameOf(AP.murmure, touch, true), phrase: Math.floor(hash(seed, at) * PHRASES) };
  }
  return path.moving ? { pose: 'marche', ...way, n: frameOf(AP.marche, t) } : { pose: 'repos', ...way, n: frameOf(AP.repos, t) };
}

// Anya, ses loutres et le bol de la Dame à l'instant du dessin (f : t, h, phase, rain, tapped, out, dayTime, night) :
// rend son passage ({ x, y }), ou null
export function drawAnya(f, { wild, along }, { anya, banks, dame, home }) {
  const { t, h, phase, rain, tapped, out, dayTime, night } = f;
  // Anya, le jour de son passage, à son moment (l'aube ou le crépuscule) : son cerf blanc, ses lucioles
  const visit = anya && anya.visit && anyaHere(h, phase.rise, phase.set, anya.visit.slot) ? anya.visit : null;
  let here = null;
  if (visit) {
    // (elle erre autour de son point de visite ; ses dessins de la bibliothèque, sinon ceux du code, immobiles)
    const center = { x: visit.x + 0.5, y: visit.y + 0.5 };
    const seed = visit.x * 31 + visit.y;
    const path = anyaPath(t, center, seed);
    here = { x: path.x, y: path.y };
    const hop = tapped('anya:dame', 0.8);
    const z = hop === null ? 0 : Math.sin(hop * Math.PI) * 3;
    const touched = tapped('anya:dame', MURMURE_S);
    const look = anyaPose(t, { clock: anyaVisitClock(h, phase.rise, phase.set, visit.slot), path, touch: touched === null ? null : touched * MURMURE_S, seed });
    const art = anyaArt(look.pose, look.view, look.n, { season: SEASON, phrase: look.phrase || 0 });
    out.push(art
      ? { id: 'anya:dame', kind: 'beast', species: 'anya', x: path.x, y: path.y, z, flip: look.flip, sprite: [art.key, art.make] }
      : beast('anya:dame', 'anya', '', center.x, center.y, z, false, Math.floor(t * 0.5) % 2));
    // son cerf, derrière elle, à côté : il marche quand elle flotte, sinon il se tient debout, tourné vers elle
    const trail = anyaPath(t - TRAIL, center, seed);
    const cx = trail.x + CERF_SIDE[0];
    const cy = trail.y + CERF_SIDE[1];
    const way = trail.moving ? facing(trail.dx, trail.dy) : { view: 'avant', flip: (path.x - cx) - (path.y - cy) < 0 };
    const deer = trail.moving ? cerfArt('marche', way.view, frameOf(CP.marche, t)) : cerfArt('debout', way.view, frameOf(CP.debout, t));
    out.push(deer
      ? { id: 'anya:cerf', kind: 'beast', species: 'deer', x: cx, y: cy, z: 0, flip: way.flip, sprite: [deer.key, deer.make] }
      : beast('anya:cerf', 'deer', 'blanc', center.x + 0.8, center.y + 0.4, 0, true, Math.floor(t / 5) % 2));
    for (let k = 0; k < 6; k++) {
      const a = t * 0.3 + k * 1.05;
      out.push(beast(`anya:luciole:${k}`, 'firefly', '', path.x + Math.cos(a) * 0.9, path.y + Math.sin(a) * 0.6, 18 + k * 4 + Math.sin(t + k) * 3, false, Math.floor(t * 1.4 + k) % 2));
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
