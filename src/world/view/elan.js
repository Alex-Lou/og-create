// L'élan de la caméra et ses bords souples (fonctions pures ; camera.js et gestures.js s'en servent). Lâchée en plein
// glissement, la caméra file encore un peu puis ralentit en douceur ; tirée au-delà du bord de l'île, elle résiste
// (de moins en moins loin, très peu), puis revient d'elle-même. Vitesses en pixels d'écran par ms.

// Les derniers points du doigt gardés pour sa vitesse ; un doigt immobile depuis tant ne lance rien
const TRACE_MS = 90;
const IMMOBILE_MS = 60;
// Le freinage (constante de temps), la vitesse sous laquelle on s'arrête, celle qu'on ne dépasse pas
const FREIN_MS = 320;
const ARRET = 0.02;
const VITESSE_MAX = 3.2;
// Les bords : au plus tant de pixels d'écran au-delà, le retour (constante de temps), le freinage contre le bord
export const DEBORD_PX = 22;
const RETOUR_MS = 110;
const BUTEE_MS = 45;

// La trace du doigt, avec ce nouveau point (p : { x, y } à l'écran ; now en ms)
export function noter(trace, p, now) {
  return [...(trace || []).filter(s => now - s.at <= TRACE_MS), { x: p.x, y: p.y, at: now }];
}

// La vitesse du doigt au lâcher ({ vx, vy } en px/ms, plafonnée) : rien s'il ne bougeait plus
export function vitesseOf(trace, now) {
  const pts = (trace || []).filter(s => now - s.at <= TRACE_MS);
  if (pts.length < 2 || now - pts[pts.length - 1].at > IMMOBILE_MS) return { vx: 0, vy: 0 };
  const a = pts[0], b = pts[pts.length - 1];
  const dt = Math.max(1, b.at - a.at);
  let vx = (b.x - a.x) / dt, vy = (b.y - a.y) / dt;
  const v = Math.hypot(vx, vy);
  if (v > VITESSE_MAX) { vx *= VITESSE_MAX / v; vy *= VITESSE_MAX / v; }
  return { vx, vy };
}

// La vitesse après dt ms (contre un bord, elle tombe bien plus vite : le rebond reste léger)
export const freiner = (v, dt, butee = false) => v * Math.exp(-dt / (butee ? BUTEE_MS : FREIN_MS));
export const arretee = (vx, vy) => Math.hypot(vx, vy) < ARRET;

// Un pas de la caméra sur un axe : pos entre min et max ; raw : ce que le doigt (ou l'élan) a tiré au-delà du bord ;
// delta : le mouvement voulu. Revenir vers l'intérieur reprend d'abord ce qui dépassait. { pos, raw }
export function avancer(pos, raw, delta, min, max) {
  if (raw && Math.sign(delta) === -Math.sign(raw)) {
    const left = raw + delta;
    if (Math.sign(left) === Math.sign(raw)) return { pos, raw: left };
    return avancer(pos, 0, left, min, max);
  }
  const p = pos + delta;
  if (p > max) return { pos: max, raw: raw + p - max };
  if (p < min) return { pos: min, raw: raw + p - min };
  return { pos: p, raw };
}

// Ce qui se voit du dépassement (raw en unités du monde, s : l'échelle) : il résiste, sans jamais passer DEBORD_PX à
// l'écran ; en unités du monde
export function debordOf(raw, s) {
  if (!raw) return 0;
  const cap = DEBORD_PX / s;
  return Math.sign(raw) * cap * (1 - Math.exp(-Math.abs(raw) / cap));
}

// Le dépassement gardé ne va pas au-delà de trois fois ce qui se voit (le retour commence tout de suite au lâcher)
export function bornerDebord(raw, s) {
  const max = (3 * DEBORD_PX) / s;
  return Math.max(-max, Math.min(max, raw));
}

// Le dépassement après dt ms de retour vers le bord ; 0 quand il ne se voit plus (moins d'un tiers de pixel)
export function revenir(raw, dt, s) {
  const r = raw * Math.exp(-dt / RETOUR_MS);
  return Math.abs(debordOf(r, s)) * s < 0.33 ? 0 : r;
}
