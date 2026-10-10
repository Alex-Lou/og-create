// Les bêtes de l'île au trait de la troupe : de profil, tournées vers la droite (le miroir donne la gauche), comme
// src/world/animals.js. Cadres du jeu (SMALL, MID, TALL…) à l'échelle de la troupe (× 1,25), ancre (0, 0) au sol sous
// l'animal. Images : marche 1 et 2, repos, clignement, joie.
const { OUT, P, E, L, clip, r2 } = require('./troupe');

const K = 1.25; // échelle troupe / jeu
const box = (x, y, w, h) => [x * K, y * K, w * K, h * K];
const BOX = { SMALL: box(-12, -18, 24, 20), MID: box(-16, -24, 32, 26), TALL: box(-16, -34, 32, 36), BIG: box(-24, -46, 48, 48) };

const EYE = '#2A2420';
// un ton plus sombre ou plus clair d'une couleur #RRGGBB (k < 1 : plus sombre)
const tone = (hex, k) => '#' + [1, 3, 5].map(i => Math.max(0, Math.min(255, Math.round(parseInt(hex.slice(i, i + 2), 16) * k))).toString(16).padStart(2, '0')).join('').toUpperCase();
const heartIcon = (x, y, s = 1.4) => P(`M${r2(x)},${r2(y + s * 1.1)} C${r2(x - s * 1.8)},${r2(y - s * 0.1)} ${r2(x - s * 0.9)},${r2(y - s * 1.4)} ${r2(x)},${r2(y - s * 0.5)} C${r2(x + s * 0.9)},${r2(y - s * 1.4)} ${r2(x + s * 1.8)},${r2(y - s * 0.1)} ${r2(x)},${r2(y + s * 1.1)} Z`, '#F27A8A', 0.6);
const line = (a, b, w, color) => `<path d="M${r2(a[0])},${r2(a[1])} L${r2(b[0])},${r2(b[1])}" stroke="${color}" stroke-width="${r2(w)}" stroke-linecap="round"/>`;
const limb = (a, b, w, fill) => line(a, b, w + 2.2, OUT) + line(a, b, w, fill);
const stroke = (d, w, color) => `<path d="${d}" fill="none" stroke="${color}" stroke-width="${r2(w)}" stroke-linecap="round" stroke-linejoin="round"/>`;
const thick = (d, w, fill) => stroke(d, w + 2.2, OUT) + stroke(d, w, fill);

// Œil de bête : ovale sombre + reflet ; fermé (arc) ; joie (arc vers le haut)
function eye(x, y, r, mode) {
  if (mode === 'blink') return P(`M${r2(x - r)},${r2(y)} Q${x},${r2(y + r * 0.9)} ${r2(x + r)},${r2(y)}`, 'none', 0.8);
  if (mode === 'joy') return P(`M${r2(x - r)},${r2(y + r * 0.4)} Q${x},${r2(y - r * 0.9)} ${r2(x + r)},${r2(y + r * 0.4)}`, 'none', 0.9);
  // ouvert : grand ovale sombre, un gros reflet en haut et un petit en bas (les yeux de la troupe)
  return E(x, y, r * 0.86, r * 1.12, EYE, 0) + E(x + r * 0.3, y - r * 0.44, r * 0.38, r * 0.38, '#FFFFFF', 0)
    + E(x - r * 0.3, y + r * 0.5, r * 0.17, r * 0.17, '#FFFFFF', 0);
}

// Bouts de pattes : sabot (ovale sombre, un reflet) ; patte à deux doigts (deux petits traits sur le devant)
const hoof = (x, y, rx, col) => E(x, y, rx, 0.9, col, 0.8) + E(x - rx * 0.35, y - 0.2, rx * 0.3, 0.22, '#FFFFFF', 0).replace('fill=', 'fill-opacity="0.45" fill=');
const toes = (x, y, rx) => [0.15, 0.55].map(k => line([x + rx * k, y + 0.05], [x + rx * k, y + 0.75], 0.42, OUT)).join('');
const paw = (x, y, rx, col) => E(x, y, rx, 0.9, col, 0.8) + toes(x, y - 0.1, rx);
// Sabot fendu (ruminants) : le sabot, sa fente, son reflet
const cloven = (x, y, rx, col) => hoof(x, y, rx, col) + line([x + rx * 0.12, y - 0.85], [x + rx * 0.2, y + 0.55], 0.4, '#2A2220');
// Ombre de contact sous un pied posé : le pied touche le sol
const contact = (x, w) => E(x, -0.1, w, 0.55, 'rgba(40,55,20,.24)', 0);
const f2p = q => `${r2(q[0])},${r2(q[1])}`;
// Patte en volume : effilée de la hanche (w0) au pied (w1), pliée au milieu (bend > 0 : le jarret part vers l'arrière,
// < 0 : le genou vers l'avant) ; le haut est arrondi (la cuisse) ; un reflet le long du devant
function legShape(a, b, w0, w1, bend, fill, shine, sw = 1.05) {
  const dx = b[0] - a[0], dy = b[1] - a[1], L0 = Math.hypot(dx, dy) || 1, nx = -dy / L0, ny = dx / L0;
  const m = [a[0] + dx * 0.5 + nx * bend, a[1] + dy * 0.5 + ny * bend], wm = (w0 * 0.45 + w1 * 0.55);
  const off = (q, w, k) => [q[0] + nx * w * 0.5 * k, q[1] + ny * w * 0.5 * k];
  const d = `M${f2p(off(a, w0, 1))} Q${f2p(off(m, wm, 1))} ${f2p(off(b, w1, 1))} L${f2p(off(b, w1, -1))} Q${f2p(off(m, wm, -1))} ${f2p(off(a, w0, -1))} A${r2(w0 / 2)},${r2(w0 / 2)} 0 0,1 ${f2p(off(a, w0, 1))} Z`;
  return P(d, fill, sw) + (shine ? `<path d="M${f2p(off(a, w0 * 0.55, -1))} Q${f2p(off(m, wm * 0.5, -1))} ${f2p(off(b, w1 * 0.4, -1))}" fill="none" stroke="#FFFFFF" stroke-width="${r2(w1 * 0.24)}" stroke-linecap="round" opacity="0.4"/>` : '');
}
// Tache de pelage irrégulière (vache, cochon) : un contour doux à sept bosses, la graine change la forme
function tache(cx, cy, rx, ry, seed, col) {
  const n = 7, pts = [];
  for (let i = 0; i < n; i++) { const t = (i / n) * Math.PI * 2, k = 1 + 0.2 * Math.sin(seed * 3.1 + i * 2.3) + 0.08 * Math.cos(seed + i * 4.1); pts.push([cx + Math.cos(t) * rx * k, cy + Math.sin(t) * ry * k]); }
  let d = `M${f2p([(pts[0][0] + pts[1][0]) / 2, (pts[0][1] + pts[1][1]) / 2])}`;
  for (let i = 1; i <= n; i++) { const p = pts[i % n], q = pts[(i + 1) % n]; d += ` Q${f2p(p)} ${f2p([(p[0] + q[0]) / 2, (p[1] + q[1]) / 2])}`; }
  return `<path d="${d} Z" fill="${col}"/>`;
}

// ——— Quadrupèdes ———
// cfg : body [cx, cy, rx, ry], head [hx, hy, r], legs { back, front, top, w, len?, paw, hoof }, snout, nose, eye [dx, dy, r],
// ears { kind, ... }, tail { kind, ... }, colors fur, furS, belly ; parts { back(c), body(c), head(c) } pour les pièces propres
function quad(c, pose) {
  if (c.profil) return c.profil(c, pose);
  const walk = pose === 'marche1' || pose === 'marche2';
  const rest = pose === 'repos' || pose === 'clignement';
  const ph = pose === 'marche2' ? -1 : 1;
  const drop = rest ? (c.restDrop ?? -c.legs.top * 0.75) : 0;
  const bob = pose === 'marche2' ? -0.4 : 0;
  const [bx, by0, brx, bry] = c.body;
  const by = by0 + drop + bob;
  const [hx, hy0, hr] = c.head;
  const hy = hy0 + drop * (c.headDrop ?? 0.8) + bob;
  const mode = pose === 'clignement' ? 'blink' : pose === 'joie' ? 'joy' : 'open';
  const ctx = { pose, rest, walk, bx, by, hx, hy, hr, ph, mode, drop };
  const lg = c.legs;
  const top = lg.top + drop + bob;
  const a = walk ? 1.6 * ph : 0;
  let s = '';
  // ombre douce au sol
  s += E(bx, -0.2, brx * 0.95, 1.4, 'rgba(40,55,20,.18)', 0);
  // pattes éloignées (plus sombres, derrière)
  const leg = (x, dx, near, back) => {
    if (rest) return '';
    const foot = [x + dx, -(lg.paw ? 0.9 : 0.6)];
    if (lg.shape) {
      // patte en volume : la cuisse arrondie (plus forte derrière), le jarret ou le genou, le sabot ou la patte
      const sh = lg.shape, col = near ? (lg.color || c.fur) : (lg.colorS || c.furS);
      const w0 = lg.w * (back ? sh.haunch ?? 1.5 : sh.arm ?? 1.15), w1 = lg.w * (sh.foot ?? 0.78);
      const hip = [x - (back ? 0.4 : 0), top - (back ? sh.hipUp ?? 1.2 : sh.armUp ?? 0.6)];
      const end = lg.hoof ? (lg.cloven ? cloven : hoof)(foot[0], foot[1] + 0.2, lg.w * 0.62, lg.hoof)
        : lg.paw ? (back && sh.longFoot ? E(foot[0] + 0.9, foot[1] + 0.25, lg.w * sh.longFoot, 0.85, lg.paw, 0.8) + toes(foot[0] + 0.9 + lg.w * 0.4, foot[1] + 0.1, lg.w * 0.7) : paw(foot[0] + 0.4, foot[1] + 0.2, lg.w * 0.7, lg.paw)) : '';
      return (near ? contact(foot[0] + 0.2, lg.w * 0.75) : '') + legShape(hip, foot, w0, w1, back ? sh.hock ?? 0.8 : -(sh.knee ?? 0.3), col, near) + end;
    }
    // patte proche : un reflet le long du devant ; sabot luisant, ou patte à deux doigts
    const shine = near ? line([x - lg.w * 0.2, top + 1.2], [foot[0] - lg.w * 0.2, foot[1] - 1.6], lg.w * 0.26, 'rgba(255,255,255,.35)') : '';
    return limb([x, top], foot, lg.w, near ? (lg.color || c.fur) : (lg.colorS || c.furS)) + shine + (lg.hoof ? hoof(foot[0], foot[1] + 0.2, lg.w * 0.62, lg.hoof) : lg.paw ? paw(foot[0] + 0.4, foot[1] + 0.2, lg.w * 0.7, lg.paw) : '');
  };
  s += leg(lg.back + 1.4, -a, false, true) + leg(lg.front + 1.4, a, false, false);
  // pattes en volume : toutes sortent de sous le corps (le corps cache leur haut), les proches plus claires devant
  if (lg.shape && !rest) s += leg(lg.back, a, true, true) + leg(lg.front, -a, true, false);
  s += c.parts?.back ? c.parts.back(ctx) : '';
  s += tail(c, ctx);
  // corps, ventre, ombre du bas
  const bd = `M${r2(bx - brx)},${r2(by)} a${brx},${bry} 0 1,0 ${2 * brx},0 a${brx},${bry} 0 1,0 ${-2 * brx},0 Z`;
  s += P(bd, c.fur) + clip(`q${c.id}${pose}b`, bd, `<rect x="${r2(bx - brx - 1)}" y="${r2(by - bry - 1)}" width="${r2(brx * 2 + 2)}" height="${r2(bry * 2 + 2)}" fill="${c.furS}"/>`
    + `<ellipse cx="${r2(bx - brx * 0.1)}" cy="${r2(by - bry * 0.16)}" rx="${r2(brx * 0.98)}" ry="${r2(bry * 0.9)}" fill="${c.fur}"/>`
    + `<ellipse cx="${bx}" cy="${r2(by + bry * 0.95)}" rx="${r2(brx * 0.9)}" ry="${r2(bry * 0.45)}" fill="${c.belly || c.furS}"/>`
    + (c.parts?.coat ? c.parts.coat(ctx) : '') + `<path d="M${r2(bx - brx * 0.6)},${r2(by - bry * 0.62)} Q${bx},${r2(by - bry * 0.95)} ${r2(bx + brx * 0.4)},${r2(by - bry * 0.7)}" fill="none" stroke="#FFFFFF" stroke-width="0.9" stroke-linecap="round" opacity="0.5"/>`) + P(bd, 'none');
  // pattes proches ; au repos, pattes repliées
  // au repos, pattes repliées sous le corps : on n'en voit que le bout (doigts ou sabot)
  if (rest) for (const px of [bx - brx * 0.55, bx + brx * 0.6]) {
    s += E(px, -0.9, lg.w * 0.9, 1, lg.color || c.fur, 0.9);
    if (lg.hoof) s += (lg.cloven ? cloven : hoof)(px + lg.w * 0.55, -0.7, lg.w * 0.42, lg.hoof);
    else s += toes(px + lg.w * 0.15, -0.9, lg.w * 0.9);
  }
  else if (!lg.shape) s += leg(lg.back, a, true, true) + leg(lg.front, -a, true, false);

  s += c.parts?.body ? c.parts.body(ctx) : '';
  s += headQuad(c, ctx);
  if (pose === 'joie') s += heartIcon(hx + hr * 0.2, Math.max(hy - hr * 2 - 1.4, BOX[c.size][1] + 2));
  return s;
}

// Les poses des animaux de compagnie (chat, chien), de profil : assis1 et assis2 (assis, la queue enroulée au sol devant,
// son bout se lève à l'image 2), dodo1 et dodo2 (roulé en boule, la tête sur les pattes, les yeux fermés, la queue
// autour ; il respire à l'image 2, un « z » de plus)
function blob(c, id, cx, cy, rx, ry, coat) {
  const d = `M${r2(cx - rx)},${r2(cy)} a${r2(rx)},${r2(ry)} 0 1,0 ${r2(2 * rx)},0 a${r2(rx)},${r2(ry)} 0 1,0 ${r2(-2 * rx)},0 Z`;
  return P(d, c.fur) + clip(id, d, `<rect x="${r2(cx - rx - 1)}" y="${r2(cy - ry - 1)}" width="${r2(rx * 2 + 2)}" height="${r2(ry * 2 + 2)}" fill="${c.furS}"/>`
    + `<ellipse cx="${r2(cx - rx * 0.1)}" cy="${r2(cy - ry * 0.16)}" rx="${r2(rx * 0.98)}" ry="${r2(ry * 0.9)}" fill="${c.fur}"/>`
    + `<ellipse cx="${r2(cx)}" cy="${r2(cy + ry * 0.95)}" rx="${r2(rx * 0.9)}" ry="${r2(ry * 0.45)}" fill="${c.belly || c.furS}"/>` + (coat || '')) + P(d, 'none');
}
// un petit « z » de sommeil en (x, y), taille k
const zed = (x, y, k) => `<path d="M${r2(x)},${r2(y)} h${r2(1.8 * k)} l${r2(-1.8 * k)},${r2(2 * k)} h${r2(1.8 * k)}" fill="none" stroke="#7E8CB0" stroke-width="${r2(0.55 * k + 0.2)}" stroke-linecap="round" stroke-linejoin="round"/>`;
function petPose(c, pose) {
  if (c.id.startsWith('cat')) return chatPose(c, pose);
  const [bx, , brx, bry] = c.body, hr = c.head[2], lg = c.legs, n = /2$/.test(pose) ? 1 : 0, t = c.tail || {};
  const tw = t.w || 1.3;
  let s = '';
  if (/^assis/.test(pose)) {
    const hx0 = bx - brx * 0.3, hy0 = -bry * 0.95, hrx = brx * 0.62, hry = bry * 0.95; // le bassin, posé au sol
    const cx = bx + brx * 0.3, cy = -bry * 1.65, crx = brx * 0.48, cry = bry * 1.15; // le poitrail, droit
    s += E(bx, -0.2, brx * 0.85, 1.4, 'rgba(40,55,20,.18)', 0);
    const patte = (x, near) => limb([x, cy], [x, -0.9], lg.w, near ? c.fur : c.furS) + paw(x + 0.4, -0.7, lg.w * 0.7, lg.paw || c.belly);
    s += patte(cx - crx * 0.05, false);
    s += blob(c, `pp${c.id}${pose}b`, hx0, hy0, hrx, hry, c.parts?.coat ? c.parts.coat({ bx: hx0, by: hy0 + hry * 0.5 }) : '');
    s += blob(c, `pp${c.id}${pose}c`, cx, cy, crx, cry);
    s += thick(`M${r2(hx0 - hrx * 0.95)},${r2(-1.4)} Q${r2(hx0 - hrx * 0.5)},0.3 ${r2(hx0 + hrx * 0.75)},${r2(n ? -2.6 : -0.7)}`, tw, c.fur);
    s += patte(cx + crx * 0.4, true) + E(hx0 + hrx * 0.55, -0.85, lg.w * 1.05, 0.9, c.fur, 0.9) + toes(hx0 + hrx * 0.62, -0.9, lg.w * 0.9);
    s += headQuad(c, { pose, hx: cx + crx * 0.55, hy: cy - cry - hr * 0.3, hr, mode: 'open', bx: cx, by: cy });
    return s;
  }
  // dodo
  const cx = bx - brx * 0.1, ry = bry * 0.8 * (n ? 1.06 : 1), cy = -ry, rx = brx * 1.08;
  const hx = cx + rx * 0.82, hy = -hr * 0.92;
  s += E(cx + rx * 0.2, -0.2, rx * 1.05, 1.4, 'rgba(40,55,20,.18)', 0);
  s += blob(c, `pp${c.id}${pose}b`, cx, cy, rx, ry, c.parts?.coat ? c.parts.coat({ bx: cx, by: cy + ry * 0.5 }) : '');
  s += thick(`M${r2(cx - rx * 0.95)},${r2(-1.6)} Q${r2(cx - rx * 0.3)},0.4 ${r2(cx + rx * 0.5)},${r2(-0.8)}`, tw, c.fur);
  s += E(hx + hr * 0.55, -0.8, lg.w * 1.1, 0.9, c.fur, 0.9) + toes(hx + hr * 0.62, -0.85, lg.w * 0.9);
  s += headQuad(c, { pose, hx, hy, hr, mode: 'blink', bx: cx, by: cy });
  s += zed(hx + hr * 0.7, hy - hr * 1.5, 0.8) + (n ? zed(hx + hr * 1.15, hy - hr * 2.2, 1.05) : '');
  return s;
}

// Les poses du chat, de profil : assis (le dos rond qui monte de la hanche au poitrail, les pattes avant serrées, la
// patte arrière posée devant la hanche, la queue enroulée par-dessus les pattes, son bout se lève à l'image 2) ; dodo
// (roulé en boule, la tête posée sur les pattes, la queue tout autour ; il respire à l'image 2, un « z » de plus)
function chatPose(c, pose) {
  const hr = c.head[2], lg = c.legs, n = /2$/.test(pose) ? 1 : 0, tw = (c.tail || {}).w || 1.3, pc = lg.paw || c.belly;
  const coat = (bx, by) => (c.parts?.coat ? c.parts.coat({ bx, by }) : '');
  let s = '';
  if (/^assis/.test(pose)) {
    const d = 'M-5.4,-0.6 C-6.2,-5.6 -3,-8.2 -0.4,-9.6 C1.6,-10.8 4.4,-9.8 4.4,-7 C4.4,-4.2 3.6,-1.8 3.2,-0.6 Z';
    s += E(-0.6, -0.2, 6.2, 1.4, 'rgba(40,55,20,.18)', 0);
    s += limb([1.5, -6], [1.6, -0.9], lg.w, c.furS) + paw(2, -0.7, lg.w * 0.7, pc);
    s += P(d, c.fur) + clip(`cp${c.id}${pose}`, d, `<rect x="-7" y="-12" width="13" height="13" fill="${c.furS}"/>`
      + `<ellipse cx="-1.4" cy="-5.6" rx="5.6" ry="5.4" fill="${c.fur}"/>` + E(3.6, -5.2, 1.5, 3.2, c.belly || c.furS, 0) + coat(-1.6, -4.2)
      + `<path d="M-3.6,-6.6 Q-1.4,-9 1.4,-9.6" fill="none" stroke="#FFFFFF" stroke-width="0.9" stroke-linecap="round" opacity="0.5"/>`) + P(d, 'none');
    // la cuisse, posée au sol
    s += `<path d="M-0.4,-0.8 Q0.6,-5 -3.2,-6.4" fill="none" stroke="${OUT}" stroke-width="0.8" stroke-linecap="round"/>`;
    s += E(0.4, -0.85, lg.w * 1.15, 0.9, c.fur, 0.9) + toes(0.6, -0.9, lg.w * 0.95);
    s += limb([2.9, -6], [3, -0.9], lg.w, c.fur) + paw(3.4, -0.7, lg.w * 0.7, pc);
    s += thick(n ? 'M-5,-1.4 Q-1,1.6 3.8,0 Q5.4,-0.6 5.6,-2.6' : 'M-5,-1.4 Q-1,1.4 5,-0.4', tw, c.fur);
    s += headQuad(c, { pose, hx: 2.6, hy: -13.4, hr, mode: 'open', bx: 0, by: -5 });
    return s;
  }
  // dodo
  const rx = 6.6, ry = 3.8 * (n ? 1.06 : 1), cx = -1.2, cy = -ry, hx = 4, hy = -hr * 0.95;
  s += E(cx + 1, -0.2, rx * 1.05, 1.4, 'rgba(40,55,20,.18)', 0);
  s += blob(c, `cp${c.id}${pose}`, cx, cy, rx, ry, coat(cx, cy + ry * 0.5));
  s += thick(`M${r2(cx - rx * 0.92)},-1.6 Q${r2(cx + 1)},1.3 ${r2(hx + 1.4)},-0.4`, tw, c.fur);
  s += headQuad(c, { pose, hx, hy, hr, mode: 'blink', bx: cx, by: cy });
  s += E(hx + hr * 0.62, -0.8, lg.w * 1.1, 0.9, c.fur, 0.9) + toes(hx + hr * 0.7, -0.85, lg.w * 0.9);
  s += zed(hx + hr * 0.7, hy - hr * 1.6, 0.8) + (n ? zed(hx + hr * 1.15, hy - hr * 2.3, 1.05) : '');
  return s;
}

function tail(c, { bx, by, ph, walk }) {
  const t = c.tail || {};
  const [, , brx] = c.body;
  const x = bx - brx * 0.92, y = by - c.body[3] * 0.35;
  const w = walk ? ph * 0.8 : 0;
  switch (t.kind) {
    case 'tuft': return thick(`M${x},${y} Q${r2(x - 2.4)},${r2(y + 2)} ${r2(x - 2 + w)},${r2(y + 6)}`, 0.8, c.fur) + E(x - 2 + w, y + 6.6, 1.1, 1.5, t.color || c.furS, 0.8);
    case 'puff': return E(x + 0.4, y, t.r || 1.8, t.r || 1.8, t.color || c.belly || '#FFFFFF', 0.9);
    // la vache : une corde qui pend le long de la croupe, un toupet au bout qui se balance
    case 'rope': {
      const ex = x - 0.5 + w * 0.7, ey = by + c.body[3] * 1.05;
      return thick(`M${r2(x + 0.4)},${r2(y)} Q${r2(x - 2.2)},${r2(y + 2.4)} ${r2(ex)},${r2(ey)}`, 0.75, c.fur)
        + P(`M${r2(ex - 0.9)},${r2(ey - 0.6)} Q${r2(ex - 1.5)},${r2(ey + 1.6)} ${r2(ex + 0.1)},${r2(ey + 2.6)} Q${r2(ex + 1.4)},${r2(ey + 1.4)} ${r2(ex + 0.8)},${r2(ey - 0.6)} Z`, t.color || c.furS, 0.8);
    }
    case 'curly': return stroke(`M${x + 0.6},${y} q-2.2,-0.6 -2,-2.2 q0.4,-1.6 1.6,-0.8 q0.8,1 -0.6,1.8`, 2.4, OUT) + stroke(`M${x + 0.6},${y} q-2.2,-0.6 -2,-2.2 q0.4,-1.6 1.6,-0.8 q0.8,1 -0.6,1.8`, 0.9, c.fur);
    case 'short': return P(`M${x + 0.6},${y - 0.6} L${r2(x - 2.2)},${r2(y - 3 + w * 0.5)} L${r2(x + 0.4)},${r2(y + 1)} Z`, t.color || c.fur, 0.9);
    case 'bushy': {
      const L0 = t.len || 9, up = t.up ?? 0.4;
      const tip = [x - L0, y - L0 * up + w];
      const d = `M${r2(x + 1)},${r2(y - 1.4)} Q${r2(x - L0 * 0.5)},${r2(y - L0 * up - 3.6 + w)} ${r2(tip[0])},${r2(tip[1])} Q${r2(x - L0 * 0.4)},${r2(y + 2.6 + w * 0.5)} ${r2(x + 1)},${r2(y + 1.6)} Z`;
      return P(d, c.fur) + clip(`t${c.id}${ph}${walk}`, d, `<circle cx="${r2(tip[0])}" cy="${r2(tip[1])}" r="${r2(L0 * 0.32)}" fill="${t.tip || c.belly}"/>`) + P(d, 'none');
    }
    case 'horse': return thick(`M${x},${y - 1} Q${r2(x - 3)},${r2(y + 1)} ${r2(x - 2.4 + w)},${r2(y + 8)}`, 2.2, t.color) + stroke(`M${r2(x - 1)},${r2(y + 1)} Q${r2(x - 2.6)},${r2(y + 4)} ${r2(x - 2.4 + w)},${r2(y + 7)}`, 0.5, OUT);
    // le chat : la queue monte en S, le bout recourbé vers l'avant
    case 'chat': return thick(`M${r2(x + 0.4)},${r2(y)} C${r2(x - 3.4)},${r2(y - 0.4)} ${r2(x - 4.6 + w * 0.4)},${r2(y - 4.6)} ${r2(x - 3.6 + w)},${r2(y - 7.4)} Q${r2(x - 3 + w)},${r2(y - 8.8)} ${r2(x - 1.8 + w)},${r2(y - 8.2)}`, t.w || 1.3, c.fur);
    case 'thin': return thick(`M${x},${y} Q${r2(x - 3.6)},${r2(y - 1)} ${r2(x - 3.4 + w)},${r2(y - (t.up || 5))}`, t.w || 1.2, t.color || c.fur);
    case 'lizard': return thick(`M${x + 1},${y + 0.6} Q${r2(x - 4)},${r2(y + 2)} ${r2(x - 6.2 + w)},${r2(-0.9)}`, t.w || 1.8, c.fur);
    case 'spiral': return thick(`M${x + 1},${y + 0.6} Q${r2(x - 4)},${r2(y + 1)} ${r2(x - 4.6)},${r2(y + 4)} Q${r2(x - 4.4)},${r2(y + 6.4)} ${r2(x - 2.4)},${r2(y + 5.6)} Q${r2(x - 1.6)},${r2(y + 4.2)} ${r2(x - 3)},${r2(y + 4)}`, 1.4, c.fur);
    case 'otter': return P(`M${x + 1},${y - 1.2} Q${r2(x - 4)},${r2(y + 0.4)} ${r2(x - 6.4 + w)},${r2(y + 3.4)} Q${r2(x - 3.2)},${r2(y + 3)} ${r2(x + 1)},${r2(y + 1.6)} Z`, c.fur);
    default: return '';
  }
}

function headQuad(c, ctx) {
  const { hx, hy, hr, mode } = ctx;
  const e = c.ears || {};
  // les oreilles de renard et de chat poussent derrière la tête : les deux passent avant elle, le crâne cache leur base
  const derriere = e.kind === 'fox' || e.kind === 'chat';
  let s = '';
  // oreille éloignée
  s += ear(c, e, hx, hy, hr, true, ctx.pose);
  if (derriere) s += ear(c, e, hx, hy, hr, false, ctx.pose);
  s += c.parts?.neck ? c.parts.neck(ctx) : '';
  s += c.parts?.behindHead ? c.parts.behindHead(ctx) : '';
  const hw = hr * (c.headW || 1), hd = `M${r2(hx - hw)},${r2(hy)} a${r2(hw)},${r2(hr)} 0 1,0 ${r2(2 * hw)},0 a${r2(hw)},${r2(hr)} 0 1,0 ${r2(-2 * hw)},0 Z`;
  s += P(hd, c.headC || c.fur) + clip(`q${c.id}${ctx.pose}h`, hd, `<rect x="${r2(hx - hw - 1)}" y="${r2(hy - hr - 1)}" width="${r2(hw * 2 + 2)}" height="${r2(hr * 2 + 2)}" fill="${c.headCS || c.furS}"/>`
    + `<ellipse cx="${r2(hx - hw * 0.12)}" cy="${r2(hy - hr * 0.14)}" rx="${r2(hw * 0.97)}" ry="${r2(hr * 0.92)}" fill="${c.headC || c.fur}"/>`) + P(hd, 'none');
  s += c.parts?.face ? c.parts.face(ctx) : '';
  if (c.snout) { const [dx, dy, rx, ry, col] = c.snout; s += E(hx + dx, hy + dy, rx, ry, col || c.belly, 0.9); }
  if (c.nose) { const [dx, dy, r, col] = c.nose; s += E(hx + dx, hy + dy, r * 1.1, r * 0.85, col || OUT, 0.6); }
  const [edx, edy, er] = c.eye;
  // un iris clair autour de l'œil sur les pelages sombres (chat noir, chien noir et blanc)
  if (c.iris && mode === 'open') s += E(hx + edx, hy + edy, er * 1.1, er * 1.32, c.iris, 0.5);
  s += eye(hx + edx, hy + edy, er, mode);
  if (c.blush !== false) s += E(hx + edx - er * 0.4, hy + edy + er * 1.6, er * 1.05, er * 0.55, '#F7A8B0', 0);
  if (!derriere) s += ear(c, e, hx, hy, hr, false, ctx.pose);
  s += c.parts?.head ? c.parts.head(ctx) : '';
  return s;
}

// Oreille de renard, pointe en haut, base en (x, y) tournée de a degrés ; u : sa taille, w : sa largeur. Un triangle
// doux (côtés bombés, pointe arrondie) qui descend sous la base, caché par la tête ; dedans clair (dedans), bout
// sombre (e.tip), découpé à la forme de l'oreille
function oreilleRenard(e, x, y, u, a, col, dedans, id, w = 1) {
  const forme = (b, h, d, dy) => `M${r2(x - b)},${r2(y + dy + d)} C${r2(x - b * 1.06)},${r2(y + dy - h * 0.42)} ${r2(x - b * 0.34)},${r2(y + dy - h * 0.9)} ${r2(x)},${r2(y + dy - h)} C${r2(x + b * 0.34)},${r2(y + dy - h * 0.9)} ${r2(x + b * 1.06)},${r2(y + dy - h * 0.42)} ${r2(x + b)},${r2(y + dy + d)} Z`;
  const b = u * 0.52 * w, h = u * 1.08, d = forme(b, h, u * 0.5, 0);
  const bout = e.tip ? `<rect x="${r2(x - b - 1)}" y="${r2(y - h - 1)}" width="${r2(2 * b + 2)}" height="${r2(h * 0.3 + 1)}" fill="${e.tip}"/>` : '';
  const creux = dedans ? `<path d="${forme(b * 0.56, h * 0.7, u * 0.3, u * 0.08)}" fill="${e.inner || '#F2C6C0'}"/>` : '';
  return `<g transform="rotate(${r2(a)} ${r2(x)} ${r2(y)})">${P(d, col)}${bout || creux ? clip(id, d, creux + bout) : ''}${P(d, 'none')}</g>`;
}

// Oreille de chat, pointe en haut, base en (x, y) tournée de a degrés ; b : sa demi-largeur, h : sa hauteur. Un
// triangle large à la base, côtés droits, pointe arrondie, qui descend sous la base (le crâne le cache) ; dedans rose
function oreilleChat(x, y, b, h, a, col, dedans, id) {
  const forme = (b, h, dy) => `M${r2(x - b)},${r2(y + h * 0.45)} L${r2(x - b * 0.28)},${r2(y + dy - h * 0.9)} Q${r2(x)},${r2(y + dy - h * 1.06)} ${r2(x + b * 0.28)},${r2(y + dy - h * 0.9)} L${r2(x + b)},${r2(y + h * 0.45)} Z`;
  const d = forme(b, h, 0);
  return `<g transform="rotate(${r2(a)} ${r2(x)} ${r2(y)})">${P(d, col)}${dedans ? clip(id, d, `<path d="${forme(b * 0.52, h * 0.66, h * 0.1)}" fill="${dedans}"/>`) : ''}${P(d, 'none')}</g>`;
}

// Oreilles ; far : celle de derrière (décalée, plus sombre) ; pose : pour nommer les découpes
function ear(c, e, hx, hy, hr, far, pose) {
  const col = far ? (c.headCS || c.furS) : (c.headC || c.fur), inner = e.inner || '#F2C6C0';
  const o = far ? -hr * 0.5 : 0;
  const k = e.size || 1;
  switch (e.kind) {
    case 'pointy': {
      const x = hx - hr * 0.2 + o, y = hy - hr * 0.75;
      return P(`M${r2(x - hr * 0.42 * k)},${r2(y + 0.4)} L${r2(x + hr * 0.05)},${r2(y - hr * 1.05 * k)} L${r2(x + hr * 0.5 * k)},${r2(y + 0.2)} Z`, col, 0.9)
        + (far ? '' : P(`M${r2(x - hr * 0.2 * k)},${r2(y)} L${r2(x + hr * 0.05)},${r2(y - hr * 0.7 * k)} L${r2(x + hr * 0.28 * k)},${r2(y)} Z`, inner, 0));
    }
    // chat : sur le dessus du crâne, assez petites ; celle du fond en retrait, un peu plus petite, sans le rose
    case 'chat': return far ? oreilleChat(hx - hr * 0.38, hy - hr * 0.8, hr * 0.32 * k, hr * 0.56 * k, -8, col, null, '')
      : oreilleChat(hx + hr * 0.16, hy - hr * 0.76, hr * 0.34 * k, hr * 0.6 * k, 8, col, inner, `oc${c.id}${pose}`);
    // renard : derrière la tête (headQuad), celle du fond en retrait, plus petite et plus penchée
    case 'fox': return far ? oreilleRenard(e, hx - hr * 0.5, hy - hr * 0.56, hr * k * 0.88, -18, col, false, `oe${c.id}${pose}f`, e.w)
      : oreilleRenard(e, hx - hr * 0.12, hy - hr * 0.6, hr * k, -6, col, true, `oe${c.id}${pose}n`, e.w);
    case 'round': return E(hx - hr * 0.35 + o, hy - hr * 0.85, hr * 0.38 * k, hr * 0.38 * k, col, 0.9) + (far ? '' : E(hx - hr * 0.35, hy - hr * 0.85, hr * 0.2 * k, hr * 0.2 * k, inner, 0));
    case 'side': {
      const x = hx - hr * 0.55 + o * 0.4, y = hy - hr * 0.45;
      return `<g transform="rotate(${r2((far ? -25 : -10) + (e.tilt || 0))} ${r2(x)} ${r2(y)})">${P(`M${r2(x)},${r2(y)} Q${r2(x - hr * 0.9 * k)},${r2(y - hr * 0.55)} ${r2(x - hr * 1.3 * k)},${r2(y)} Q${r2(x - hr * 0.8 * k)},${r2(y + hr * 0.4)} ${r2(x)},${r2(y + hr * 0.25)} Z`, col, 0.9)}${far ? '' : E(x - hr * 0.75 * k, y, hr * 0.32 * k, hr * 0.14, inner, 0)}</g>`;
    }
    case 'flop': {
      const x = hx - hr * 0.1 + o * 0.6, y = hy - hr * 0.8;
      return P(`M${r2(x - hr * 0.4)},${r2(y + 0.6)} L${r2(x + hr * 0.1)},${r2(y - hr * 0.6 * k)} L${r2(x + hr * 0.75 * k)},${r2(y + hr * 0.25)} Z`, col, 0.9);
    }
    case 'hang': {
      const x = hx - hr * 0.5 + o * 0.5, y = hy - hr * 0.6;
      return P(`M${r2(x + hr * 0.3)},${r2(y)} Q${r2(x - hr * 0.5)},${r2(y - hr * 0.1)} ${r2(x - hr * 0.35)},${r2(y + hr * 1.1 * k)} Q${r2(x + hr * 0.1)},${r2(y + hr * 1.2 * k)} ${r2(x + hr * 0.5)},${r2(y + hr * 0.3)} Z`, far ? c.furS : (e.color || c.furS), 0.9);
    }
    case 'long': {
      const x = hx - hr * 0.3 + o, y = hy - hr * 0.7;
      return `<g transform="rotate(${far ? -28 : -12} ${r2(x)} ${r2(y)})">${P(`M${r2(x - hr * 0.3)},${r2(y)} Q${r2(x - hr * 0.5)},${r2(y - hr * 2.2 * k)} ${r2(x + hr * 0.05)},${r2(y - hr * 2.3 * k)} Q${r2(x + hr * 0.5)},${r2(y - hr * 2.2 * k)} ${r2(x + hr * 0.3)},${r2(y)} Z`, col, 0.9)}${far ? '' : E(x, y - hr * 1.2 * k, hr * 0.14, hr * 0.8 * k, inner, 0)}</g>`;
    }
    default: return '';
  }
}

// ——— Espèces quadrupèdes ———
const spots = (list, col) => list.map(([x, y, rx, ry]) => E(x, y, rx, ry, col, 0)).join('');
const horn = (d) => thick(d, 1.1, '#F2E6C8');
const Q = {};
Q.cow = (v) => {
  const patch = v === 'rousse' ? '#B8643A' : '#3E3A3A';
  // une corne en volume, de la base (dans le crâne) à la pointe, le bout plus foncé
  const corne = (b, t, col) => {
    // un croissant : base large dans le crâne, il monte puis se recourbe vers l'avant ; la pointe plus foncée
    const dx = t[0] - b[0], dy = t[1] - b[1], L0 = Math.hypot(dx, dy), nx = -dy / L0, ny = dx / L0, w = 1.35;
    const m = [b[0] + dx * 0.5 - nx * 1.1, b[1] + dy * 0.5 - ny * 1.1];
    const d = `M${r2(b[0] - nx * w)},${r2(b[1] - ny * w)} Q${r2(m[0] - nx * w * 0.9)},${r2(m[1] - ny * w * 0.9)} ${r2(t[0])},${r2(t[1])} Q${r2(m[0] + nx * w * 0.35)},${r2(m[1] + ny * w * 0.35)} ${r2(b[0] + nx * w)},${r2(b[1] + ny * w)} Z`;
    return P(d, col, 0.9) + `<path d="M${r2(t[0] - dx * 0.06)},${r2(t[1] - dy * 0.06)} L${r2(t[0] - dx * 0.2 - nx * 0.25)},${r2(t[1] - dy * 0.2 - ny * 0.25)}" stroke="#C9B48E" stroke-width="0.7" stroke-linecap="round"/>`;
  };
  return {
    id: 'cow' + (v || ''), size: 'MID', fur: '#FFFFFF', furS: '#E2DED6', belly: '#F2EEE6',
    // chibi : grosse tête ronde, corps dodu, pattes courtes et trapues aux cuisses rondes, sabots fendus
    body: [-2, -9.8, 9.4, 6.6], head: [8.4, -14.6, 6.9], headW: 1.02,
    legs: { back: -6.6, front: 4.2, top: -6.2, w: 3.3, hoof: '#5A5250', cloven: true, shape: { haunch: 1.2, arm: 1.1, hock: 0.6, knee: 0.2, foot: 0.9, hipUp: 2.4, armUp: 2 } },
    snout: [4.2, 2.6, 3.7, 2.8, '#F6BDB6'], eye: [1.3, -1.4, 1.55],
    ears: { kind: 'side', size: 0.82, tilt: 22, inner: '#F6BDB6' }, tail: { kind: 'rope', color: patch },
    parts: {
      coat: ({ bx, by }) => tache(bx - 4, by - 2.4, 3.8, 2.8, 1, patch) + tache(bx + 4, by + 0.6, 3, 2.3, 2, patch) + tache(bx - 7.8, by + 1.6, 1.9, 1.7, 3, patch),
      face: ({ hx, hy, hr }) => tache(hx - hr * 0.3, hy - hr * 0.46, hr * 0.42, hr * 0.32, 4, patch),
      // les deux cornes, derrière la tête (le crâne cache leur base) : celle du fond plus sombre
      behindHead: ({ hx, hy, hr }) => corne([hx - hr * 0.62, hy - hr * 0.72], [hx - hr * 0.42, hy - hr - 3.4], '#DCCDAA')
        + corne([hx - hr * 0.1, hy - hr * 0.84], [hx + hr * 0.3, hy - hr - 3.6], '#F2E6C8'),
      // le naseau et la bouche sur le mufle, les cils
      head: ({ hx, hy, mode }) => {
        const [sx, sy, srx] = [hx + 4.2, hy + 2.6, 3.7];
        const [ex, ey, er] = [hx + 1.3, hy - 1.4, 1.55];
        return `<ellipse cx="${r2(sx + srx * 0.5)}" cy="${r2(sy - 0.5)}" rx="0.62" ry="0.9" fill="#B5625C" transform="rotate(-20 ${r2(sx + srx * 0.5)} ${r2(sy - 0.5)})"/>`
          + stroke(`M${r2(sx + 0.6)},${r2(sy + 1.4)} Q${r2(sx + 1.6)},${r2(sy + 2)} ${r2(sx + 2.8)},${r2(sy + 1.3)}`, 0.5, OUT)
          + (mode === 'open' ? stroke(`M${r2(ex - er * 0.55)},${r2(ey - er * 0.95)} l-0.7,-0.7 M${r2(ex - er * 0.05)},${r2(ey - er * 1.12)} l-0.35,-0.85`, 0.45, OUT) : '');
      },
      // le pis, rose, entre les pattes arrière et le ventre (les pattes proches passent devant)
      back: ({ bx, by, rest }) => {
        if (rest) return '';
        const x = bx - 1.4, y0 = by + 6.6 * 0.82;
        return P(`M${r2(x - 2.3)},${r2(y0)} Q${r2(x - 2.3)},${r2(y0 + 2.4)} ${r2(x)},${r2(y0 + 2.5)} Q${r2(x + 2.3)},${r2(y0 + 2.4)} ${r2(x + 2.3)},${r2(y0)} Z`, '#F6BDB6', 0.8)
          + E(x - 1, y0 + 2.6, 0.38, 0.6, '#E89A94', 0.5) + E(x + 1.1, y0 + 2.6, 0.38, 0.6, '#E89A94', 0.5);
      }
    }
  };
};
Q.sheep = (v) => {
  const wool = v === 'noir' ? '#5A5458' : '#F8F4EC', woolS = v === 'noir' ? '#443F43' : '#DCD5C8', face = v === 'noir' ? '#2E2A2E' : '#5E5660';
  // la laine : un nuage de bouclettes par-dessus le corps
  const puffs = (cx, cy, rx, ry) => {
    let s = '';
    for (let i = 0; i < 10; i++) { const a = (i / 10) * Math.PI * 2; s += E(cx + Math.cos(a) * rx, cy + Math.sin(a) * ry, 2.6, 2.4, wool, 0.9); }
    return s + E(cx, cy, rx + 0.4, ry + 0.2, wool, 0) + E(cx - 1.6, cy - 2.6, 3, 1.4, '#FFFFFF', 0).replace('fill=', 'fill-opacity="0.4" fill=') + E(cx + 1, cy + 2.6, rx * 0.7, 1.4, woolS, 0).replace('fill=', 'fill-opacity="0.6" fill=');
  };
  return {
    id: 'sheep' + (v || ''), size: 'MID', fur: wool, furS: woolS, belly: woolS, headC: face, headCS: face,
    // chibi : grosse tête, nuage de laine dodu, pattes courtes
    body: [-1.4, -9.4, 7.8, 5.6], head: [7.8, -13.6, 5.6],
    legs: { back: -5.2, front: 3.6, top: -5.4, w: 2.2, hoof: '#2E2A2E', color: face, colorS: v === 'noir' ? '#1E1A1E' : '#463F48' },
    snout: [3.4, 2, 2.8, 2.1, face], nose: [5, 1.2, 0.5, '#1E1A1E'], eye: [1.1, -0.9, 1.35],
    ears: { kind: 'side', size: 0.8, inner: '#8A7A80' }, tail: { kind: 'puff', color: wool, r: 2 },
    parts: {
      body: ({ bx, by }) => puffs(bx, by, 7.4, 5.4),
      head: ({ hx, hy, hr }) => E(hx - 1.2, hy - hr * 0.78, 2.4, 1.8, wool, 0.9) + E(hx + 0.6, hy - hr * 0.95, 1.6, 1.3, wool, 0.9)
    }
  };
};
Q.pig = (v) => ({
  id: 'pig' + (v || ''), size: 'MID', fur: '#F6BCBC', furS: '#E39C9E', belly: '#FAD2D0',
  // chibi : tout rond, grosse tête, petites pattes
  body: [-1.4, -8.8, 8.6, 6.4], head: [7.4, -12.8, 6.4],
  legs: { back: -5.2, front: 3.8, top: -4.4, w: 2.6, hoof: '#C77A7C' },
  snout: [5.6, 1.4, 2.2, 2.5, '#F29EA0'], eye: [1.4, -1.6, 1.4], blush: true,
  ears: { kind: 'flop', size: 0.85 }, tail: { kind: 'curly' },
  parts: {
    coat: ({ bx, by }) => v === 'tachete' ? spots([[bx - 3, by - 2, 2.8, 2.2], [bx + 4, by + 0.4, 2, 1.8], [bx - 6.6, by + 1.6, 1.4, 1.2]], '#8A5A5A') : '',
    face: ({ hx, hy, hr }) => v === 'tachete' ? E(hx - hr * 0.4, hy - hr * 0.32, hr * 0.32, hr * 0.26, '#8A5A5A', 0) : '',
    head: ({ hx, hy }) => E(hx + 5.1, hy + 1.6, 0.42, 0.66, '#B8686A', 0) + E(hx + 6.2, hy + 1.6, 0.42, 0.66, '#B8686A', 0)
  }
});
Q.goat = (v) => {
  const fur = v === 'brune' ? '#9A6A44' : '#F4F0E8', furS = v === 'brune' ? '#7A5232' : '#D8D2C6';
  return {
    id: 'goat' + (v || ''), size: 'MID', fur, furS, belly: v === 'brune' ? '#C49A72' : '#FFFFFF',
    // chibi : grosse tête, corps court, pattes courtes
    body: [-1.6, -10.2, 8, 5.6], head: [8, -15.6, 6],
    legs: { back: -5.8, front: 3.8, top: -6.6, w: 2.2, hoof: '#4A3C34' },
    snout: [3.8, 2.2, 3, 2.4, v === 'brune' ? '#B48660' : '#EDE6DA'], nose: [5.6, 1.4, 0.55, '#4A3C34'], eye: [1.1, -1.2, 1.35],
    ears: { kind: 'side', size: 0.8 }, tail: { kind: 'short' },
    parts: {
      neck: ({ hx, hy, bx, by }) => P(`M${r2(bx + 5.4)},${r2(by - 3.6)} L${r2(hx - 2.6)},${r2(hy - 1)} L${r2(hx + 0.6)},${r2(hy + 3.4)} L${r2(bx + 8.4)},${r2(by + 1)} Z`, fur, 0.9),
      head: ({ hx, hy, hr }) => thick(`M${r2(hx - 1)},${r2(hy - hr * 0.8)} Q${r2(hx - 2.6)},${r2(hy - hr - 2.6)} ${r2(hx - 4.6)},${r2(hy - hr - 1.4)}`, 1.1, '#B8A88C')
        + P(`M${r2(hx + hr * 0.45)},${r2(hy + hr * 0.74)} L${r2(hx + hr * 0.27)},${r2(hy + hr * 1.36)} L${r2(hx + hr * 0.73)},${r2(hy + hr * 0.78)} Z`, furS, 0.7)
    }
  };
};
Q.deer = () => ({
  id: 'deer', size: 'TALL', fur: '#C98A50', furS: '#A86E3A', belly: '#F2DEC0',
  // chibi : grosse tête de faon, corps rond, pattes plus courtes
  body: [-1.6, -14.6, 8.6, 6], head: [8.4, -24.4, 6],
  legs: { back: -6.6, front: 4.4, top: -10.4, w: 2, hoof: '#4A3C34' },
  snout: [3.8, 2.2, 3, 2.2, '#E8C9A0'], nose: [5.9, 1.4, 0.6, OUT], eye: [1.1, -1.1, 1.4],
  ears: { kind: 'side', size: 1 }, tail: { kind: 'puff', color: '#FFFFFF', r: 1.6 },
  parts: {
    coat: ({ bx, by }) => spots([[bx - 4, by - 3.4, 0.8, 0.6], [bx - 1, by - 4, 0.8, 0.6], [bx + 2, by - 3.6, 0.8, 0.6], [bx - 2.6, by - 1.8, 0.7, 0.5], [bx + 0.6, by - 2, 0.7, 0.5]], '#FFF4E0'),
    neck: ({ hx, hy, bx, by }) => P(`M${r2(bx + 5)},${r2(by - 4)} L${r2(hx - 2.8)},${r2(hy - 0.4)} L${r2(hx + 0.6)},${r2(hy + 3.6)} L${r2(bx + 8.6)},${r2(by + 1)} Z`, '#C98A50', 0.9),
    head: ({ hx, hy, hr }) => thick(`M${r2(hx - 1.4)},${r2(hy - hr * 0.85)} Q${r2(hx - 2.6)},${r2(hy - hr - 3)} ${r2(hx - 1.4)},${r2(hy - hr - 5.6)} M${r2(hx - 2.2)},${r2(hy - hr - 2.6)} L${r2(hx - 4.6)},${r2(hy - hr - 3.8)}`, 0.9, '#E6D2A8')
  }
});
Q.fox = () => ({
  id: 'fox', size: 'MID', fur: '#E8803A', furS: '#C8642A', belly: '#FFF4E6',
  // chibi : grosse tête, corps court, pattes courtes, queue en panache (le renard polaire en hérite)
  body: [-1.4, -8.2, 7.4, 4.8], head: [7.2, -12.6, 5.8],
  legs: { back: -4.8, front: 3.8, top: -4.6, w: 1.8, paw: '#3A2A24' },
  snout: [3.8, 2, 3.1, 1.9, '#FFF4E6'], nose: [6.4, 1.3, 0.62, OUT], eye: [1.2, -1.2, 1.35],
  ears: { kind: 'fox', size: 1.1, inner: '#FFF1E2', tip: '#4A3020' }, tail: { kind: 'bushy', len: 10, up: 0.3, tip: '#FFFFFF' },
  parts: { face: ({ hx, hy, hr }) => E(hx + hr * 0.2917, hy + hr * 0.3333, hr * 0.5417, hr * 0.4167, '#FFF4E6', 0) }
});
// Mousse, le renardeau de Sylve (familier) : chibi, grosse tête, petit corps, pattes courtes, queue en panache
Q.kit = () => ({ ...Q.fox(), id: 'kit', size: 'SMALL', body: [-0.8, -5.6, 4.8, 3.4], head: [4.6, -9.6, 4.8], legs: { back: -3, front: 2.4, top: -3, w: 1.4, paw: '#3A2A24' }, snout: [2.6, 1.8, 2.2, 1.4, '#FFF4E6'], nose: [4.6, 1.1, 0.5, OUT], eye: [1.1, -0.8, 1.3], tail: { kind: 'bushy', len: 7, up: 0.5, tip: '#FFFFFF' } });
Q.snowFox = () => ({ ...Q.fox(), id: 'snowFox', fur: '#F6F8FC', furS: '#C9D4E2', belly: '#FFFFFF', ears: { kind: 'fox', size: 0.78, inner: '#F4D8DC' }, tail: { kind: 'bushy', len: 10, up: 0.4, tip: '#DCE6F2' }, nose: [5.2, 0.9, 0.55, '#3A3A48'], parts: {} });
// fennec (chibi : grosse tête, ses grandes oreilles un peu moins hautes pour rester dans le cadre)
Q.fennec = () => ({ ...Q.fox(), id: 'fennec', size: 'SMALL', fur: '#EDCB94', furS: '#CFA870', belly: '#FFF6E6', body: [-0.8, -5.6, 4.8, 3.4], head: [4.6, -9.4, 4.6], legs: { back: -3, front: 2.4, top: -3, w: 1.2, paw: '#CFA870' }, snout: [2.6, 1.7, 2.1, 1.35, '#FFF6E6'], nose: [4.4, 1, 0.5, OUT], eye: [1.1, -0.8, 1.3], ears: { kind: 'fox', size: 1.45, w: 1.15, inner: '#F6D2C8' }, tail: { kind: 'bushy', len: 7, up: 0.3, tip: '#5A4232' }, parts: {} });
Q.rabbit = () => ({
  id: 'rabbit', size: 'SMALL', fur: '#D8C4AE', furS: '#B8A288', belly: '#FFFFFF',
  // chibi : grosse tête ronde, corps en boule, longues oreilles un peu plus courtes
  body: [-0.6, -5.2, 5, 4], head: [4, -9.2, 4.6], restDrop: 0.8,
  legs: { back: -2.4, front: 2.4, top: -2.2, w: 1.8, paw: '#FFFFFF' },
  snout: [2.9, 1.5, 1.8, 1.4, '#FFFFFF'], nose: [4.3, 0.6, 0.45, '#E88A90'], eye: [1.2, -0.9, 1.3],
  ears: { kind: 'long', size: 0.8 }, tail: { kind: 'puff', color: '#FFFFFF', r: 1.6 }
});
Q.hedgehog = () => ({
  id: 'hedgehog', size: 'SMALL', fur: '#E8D2B0', furS: '#C8B08C', belly: '#F4E6CC',
  // chibi : la tête plus grosse et ronde devant son dôme de piquants
  body: [-0.6, -4.4, 6, 3.6], head: [4.6, -4.8, 3.4], restDrop: 0.6,
  legs: { back: -3, front: 2.4, top: -1.6, w: 1.2, paw: '#5A4232' },
  snout: [2.6, 1, 2.1, 1.3, '#E8D2B0'], nose: [4.5, 0.6, 0.55, OUT], eye: [0.7, -0.7, 1.05],
  ears: { kind: 'round', size: 0.7 }, tail: {},
  parts: {
    // dôme de piquants
    body: ({ bx, by }) => {
      let d = `M${r2(bx + 3.6)},${r2(by + 2.6)}`;
      for (let i = 0; i <= 10; i++) { const a = Math.PI * (0.05 + i * 0.09); const r = i % 2 ? 6.4 : 8; d += ` L${r2(bx - 0.6 - Math.cos(a) * r)},${r2(by + 1.6 - Math.sin(a) * r * 0.9)}`; }
      d += ` L${r2(bx - 6.6)},${r2(by + 3.2)} Z`;
      return P(d, '#8A6440') + stroke(`M${r2(bx - 3)},${r2(by - 2)} L${r2(bx - 2)},${r2(by - 4)} M${r2(bx)},${r2(by - 2.4)} L${r2(bx + 0.6)},${r2(by - 4.6)}`, 0.6, '#B88A5A');
    }
  }
});
Q.squirrel = () => ({
  id: 'squirrel', size: 'SMALL', fur: '#C8642E', furS: '#A84E22', belly: '#F6E2C8',
  // chibi : grosse tête ronde, petit corps, queue en panache
  body: [-0.4, -5.8, 4.2, 3.8], head: [3.4, -10.4, 4.4], restDrop: 0.4,
  legs: { back: -2, front: 2.1, top: -2.4, w: 1.4, paw: '#A84E22' },
  snout: [2.4, 1.5, 1.8, 1.3, '#F6E2C8'], nose: [3.9, 0.8, 0.42, OUT], eye: [1, -0.9, 1.25],
  ears: { kind: 'pointy', size: 0.9, inner: '#F2C6C0' }, tail: { kind: 'bushy', len: 7.6, up: 1.55, tip: '#E07E44' },
  profil: (c, pose) => ecureuil(c, pose),
  trois: (c, view, pose) => require('./betes3.js').ecureuil3(c, view, pose),
  parts: { head: ({ hx, hy, hr, rest }) => rest ? E(hx + hr * 0.4, hy + hr * 1.1, 1.3, 1.5, '#A8743F', 0.7) + E(hx + hr * 0.4, hy + hr * 1.1 - 1.2, 1.4, 0.7, '#7E5530', 0.6) : '' }
});
Q.ibex = () => ({
  id: 'ibex', size: 'TALL', fur: '#A8906E', furS: '#86704F', belly: '#E8DCC4',
  // chibi : grosse tête sous ses grandes cornes, corps rond, pattes plus courtes
  body: [-1.6, -14, 8.6, 6.2], head: [8.4, -21.6, 5.8],
  legs: { back: -6.6, front: 4.4, top: -9.4, w: 2, hoof: '#3E3430' },
  snout: [3.6, 2, 3, 2.4, '#C8B496'], nose: [5.6, 1.3, 0.55, OUT], eye: [1, -1, 1.35],
  ears: { kind: 'side', size: 0.7 }, tail: { kind: 'short', color: '#5A4A3A' },
  parts: {
    neck: ({ hx, hy, bx, by }) => P(`M${r2(bx + 5.4)},${r2(by - 4)} L${r2(hx - 2.8)},${r2(hy - 0.6)} L${r2(hx + 0.6)},${r2(hy + 3.6)} L${r2(bx + 8.8)},${r2(by + 1.2)} Z`, '#A8906E', 0.9),
    head: ({ hx, hy, hr }) => {
      const d = `M${r2(hx - 0.6)},${r2(hy - hr * 0.8)} Q${r2(hx - 2)},${r2(hy - hr - 6)} ${r2(hx - 7.6)},${r2(hy - hr - 6.4)} Q${r2(hx - 11.4)},${r2(hy - hr - 5.4)} ${r2(hx - 10.6)},${r2(hy - hr - 1.6)}`;
      return thick(d, 2, '#C8B48E') + [0.25, 0.45, 0.65].map(t => E(hx - 2 - t * 8, hy - hr - 5.2 - Math.sin(t * Math.PI) * 1.2, 1.2, 0.35, '#8A7656', 0)).join('')
        + P(`M${r2(hx + hr * 0.43)},${r2(hy + hr * 0.7)} L${r2(hx + hr * 0.17)},${r2(hy + hr * 1.39)} L${r2(hx + hr * 0.7)},${r2(hy + hr * 0.78)} Z`, '#5A4A3A', 0.7);
    }
  }
});
Q.pony = () => ({
  id: 'pony', size: 'TALL', fur: '#C07A44', furS: '#9E5E30', belly: '#E0B08A',
  // chibi : grosse tête, corps dodu, pattes plus courtes, crinière blonde
  body: [-1.6, -13.4, 9, 6.6], head: [8.6, -21.4, 6.4], headW: 1.05,
  legs: { back: -6.8, front: 4.6, top: -8.8, w: 2.4, hoof: '#3E3430' },
  snout: [4.2, 2.8, 3.6, 2.8, '#E8C9A8'], nose: [6.6, 2, 0.55, OUT], eye: [0.8, -1.2, 1.5],
  ears: { kind: 'pointy', size: 0.75, inner: '#E8B0A0' }, tail: { kind: 'horse', color: '#F2D28A' },
  parts: {
    neck: ({ hx, hy, bx, by }) => P(`M${r2(bx + 5)},${r2(by - 4.4)} L${r2(hx - 3.4)},${r2(hy - 1)} L${r2(hx + 0.6)},${r2(hy + 4.2)} L${r2(bx + 9.4)},${r2(by + 1.4)} Z`, '#C07A44', 0.9),
    head: ({ hx, hy, hr, bx, by }) => thick(`M${r2(hx - 1)},${r2(hy - hr * 0.9)} Q${r2(hx - 6)},${r2(hy - 2)} ${r2(bx + 4.6)},${r2(by - 5.2)}`, 2.6, '#F2D28A') + P(`M${r2(hx - 0.4)},${r2(hy - hr * 0.95)} Q${r2(hx + 2.6)},${r2(hy - hr * 0.7)} ${r2(hx + 2)},${r2(hy - 1.4)} Q${r2(hx)},${r2(hy - 2.4)} ${r2(hx - 2)},${r2(hy - hr * 0.5)} Z`, '#F2D28A', 0.8)
  }
});
Q.camel = () => ({
  id: 'camel', size: 'TALL', fur: '#D8AE70', furS: '#B88E52', belly: '#EBCB98',
  // chibi : grosse tête au bout du long cou, corps rond, pattes plus courtes
  body: [-1.6, -15.4, 8.8, 6], head: [10.2, -24.2, 4.8], headW: 1.2,
  legs: { back: -6.8, front: 4.4, top: -11.4, w: 1.8, hoof: '#8A6A44' },
  snout: [4.4, 1.3, 2.6, 2.1, '#E8C48E'], nose: [6.4, 0.6, 0.45, OUT], eye: [0.8, -1, 1.25],
  ears: { kind: 'round', size: 0.6 }, tail: { kind: 'tuft', color: '#8A6A44' },
  parts: {
    back: ({ bx, by }) => E(bx - 0.6, by - 5.6, 5, 4.4, '#D8AE70'),
    neck: ({ hx, hy, bx, by }) => thick(`M${r2(bx + 6.4)},${r2(by - 1)} Q${r2(bx + 11)},${r2(by - 2)} ${r2(hx - 1.6)},${r2(hy + 1.6)}`, 3, '#D8AE70')
  }
});
Q.chameleon = () => ({
  id: 'chameleon', size: 'SMALL', fur: '#7CC46A', furS: '#5AA04C', belly: '#C8EE9A',
  // chibi : la tête plus grosse, le grand œil en tourelle
  body: [-0.6, -6, 5.4, 3.2], head: [5, -7, 3.6], headW: 1.15, restDrop: 0.4, headDrop: 0.6,
  legs: { back: -2.8, front: 2.6, top: -3.4, w: 1.1, paw: '#5AA04C' },
  eye: [0.7, -0.5, 1.3], blush: false, ears: {}, tail: { kind: 'spiral' },
  parts: {
    coat: ({ bx, by }) => [-3, -0.4, 2.2].map(x => `<path d="M${r2(bx + x)},${r2(by - 3)} L${r2(bx + x + 0.8)},${r2(by + 2)}" stroke="#F2C94C" stroke-width="0.8"/>`).join(''),
    behindHead: ({ hx, hy }) => P(`M${r2(hx - 2.6)},${r2(hy - 1.6)} L${r2(hx - 1.4)},${r2(hy - 4.4)} L${r2(hx + 1)},${r2(hy - 2.4)} Z`, '#7CC46A', 0.8),
    face: ({ hx, hy, mode }) => E(hx + 0.7, hy - 0.5, 2.1, 2.1, '#5AA04C', 0.7) + P(`M${r2(hx + 2.2)},${r2(hy + 1.5)} Q${r2(hx + 3.5)},${r2(hy + 1.7)} ${r2(hx + 4.2)},${r2(hy + 0.8)}`, 'none', 0.5)
  }
});
Q.salamander = () => ({
  id: 'salamander', size: 'SMALL', fur: '#E8584A', furS: '#B83E34', belly: '#F6A060',
  // chibi : la tête plus grosse et ronde
  body: [-0.6, -3.2, 5.6, 2.2], head: [5, -4, 3.2], headW: 1.12, restDrop: 0.4, headDrop: 0.5,
  legs: { back: -3, front: 2.6, top: -1.6, w: 1, paw: '#B83E34' },
  eye: [0.7, -0.9, 1.05], ears: {}, tail: { kind: 'lizard', w: 1.6 },
  parts: { coat: ({ bx, by }) => spots([[bx - 3, by - 1, 0.9, 0.7], [bx, by - 1.4, 0.8, 0.6], [bx + 2.6, by - 0.8, 0.7, 0.6]], '#F2C94C') }
});
Q.tortoise = () => ({
  id: 'tortoise', size: 'SMALL', fur: '#B8B07A', furS: '#9A9260', belly: '#D8D0A0',
  // chibi : la tête plus grosse et ronde sous sa carapace
  body: [-0.6, -3.4, 5.8, 2.4], head: [5.8, -5, 3.1], headW: 1.12, restDrop: 0.4, headDrop: 0.4,
  legs: { back: -3.2, front: 2.6, top: -1.6, w: 1.6, paw: '#9A9260' },
  eye: [0.7, -0.6, 1.08], ears: {}, tail: { kind: 'short', color: '#B8B07A' },
  parts: {
    // carapace bombée à écailles
    body: ({ bx, by }) => {
      const d = `M${r2(bx - 6.6)},${r2(by + 1.4)} Q${r2(bx - 6)},${r2(by - 7)} ${r2(bx)},${r2(by - 7.2)} Q${r2(bx + 6)},${r2(by - 7)} ${r2(bx + 6.6)},${r2(by + 1.4)} Z`;
      return P(d, '#7E9A4A') + clip(`sh${Math.round(by * 10)}`, d, [[-3.4, -3.6], [0, -5], [3.4, -3.6], [-1.6, -1], [1.8, -1]].map(([x, y]) => `<path d="M${r2(bx + x - 1.6)},${r2(by + y)} l1.6,-1.2 l1.6,1.2 l0,1.6 l-1.6,1.2 l-1.6,-1.2 Z" fill="#9AB85E" stroke="${OUT}" stroke-width="0.5"/>`).join('')) + P(d, 'none')
        + P(`M${r2(bx - 6.6)},${r2(by + 1.4)} L${r2(bx + 6.6)},${r2(by + 1.4)}`, 'none', 0.9);
    }
  }
});
Q.otter = () => ({
  id: 'otter', size: 'SMALL', fur: '#8A5A36', furS: '#6E4428', belly: '#E8D2B0',
  // chibi : grosse tête ronde au museau blanc, corps fuselé
  body: [-0.8, -4.6, 6.2, 3.2], head: [5.2, -6.8, 4], restDrop: 0.6,
  legs: { back: -3.4, front: 2.6, top: -2.4, w: 1.5, paw: '#6E4428' },
  snout: [2.2, 1.4, 2.3, 1.6, '#E8D2B0'], nose: [3.9, 0.5, 0.55, OUT], eye: [0.7, -1, 1.15],
  ears: { kind: 'round', size: 0.6, inner: '#6E4428' }, tail: { kind: 'otter' },
  parts: { face: ({ hx, hy, hr }) => E(hx + hr * 0.25, hy + hr * 0.38, hr * 0.75, hr * 0.56, '#E8D2B0', 0) + L([hx + hr * 0.8, hy + hr * 0.38], [hx + hr * 1.38, hy + hr * 0.2], OUT, 0.35) + L([hx + hr * 0.8, hy + hr * 0.5], [hx + hr * 1.38, hy + hr * 0.58], OUT, 0.35) }
});
// Les pelages du chat : roux tigré (par défaut), noir, gris tigré, blanc taché (taches rousses et noires)
const CHATS = {
  roux: { fur: '#E8A050', furS: '#C8803A', belly: '#FFF2E0', rayures: true },
  noir: { fur: '#45454F', furS: '#30303A', belly: '#5A5A66', rayures: false, moustache: '#D8D8E2', iris: '#E8C850' },
  gris: { fur: '#A2A2AC', furS: '#7A7A86', belly: '#ECECF2', rayures: true },
  blanc: { fur: '#F6F2EA', furS: '#D8D0C2', belly: '#FFFFFF', rayures: false, taches: ['#E8A050', '#45454F'] }
};
Q.cat = (v) => ({
  id: 'cat' + (v || ''), size: 'SMALL', ...CHATS[v || 'roux'],
  // chibi : grosse tête ronde, corps souple, pattes fines ; petites oreilles sur le dessus du crâne, queue en S
  body: [-1.2, -6.4, 5.6, 3.3], head: [4.8, -10.8, 4.4], restDrop: 2.2,
  legs: { back: -3.6, front: 2.6, top: -3.8, w: 1.4, paw: '#FFF2E0' },
  snout: [2.2, 1.5, 1.8, 1.25, '#FFF2E0'], nose: [3.3, 0.7, 0.4, '#E88A90'], eye: [1, -0.7, 1.2],
  ears: { kind: 'chat', inner: '#F2B0B0' }, tail: { kind: 'chat', w: 1.3 },
  parts: {
    coat: ({ bx, by }) => {
      const C = CHATS[v || 'roux'];
      if (C.taches) return E(bx - 1.6, by - 2.2, 2.2, 1.6, C.taches[0], 0) + E(bx + 2, by - 2.6, 1.4, 1.1, C.taches[1], 0);
      return C.rayures ? [-3, -0.6, 1.8].map(x => `<path d="M${r2(bx + x)},${r2(by - 3.6)} q0.6,1.6 0,3" fill="none" stroke="${C.furS}" stroke-width="0.9"/>`).join('') : '';
    },
    face: ({ hx, hy }) => { const m = CHATS[v || 'roux'].moustache || OUT; return L([hx + 3.2, hy + 1.5], [hx + 5.6, hy + 1], m, 0.35) + L([hx + 3.2, hy + 2], [hx + 5.6, hy + 2.4], m, 0.35); }
  }
});
// Les pelages du chien : beige (par défaut), noir et blanc, brun, roux ; les oreilles d'un ton plus sombre
const CHIENS = {
  beige: { fur: '#E0B880', furS: '#C49A62', belly: '#FFF2DE', oreille: '#A8784A' },
  noir: { fur: '#3E3E48', furS: '#2C2C34', belly: '#F4F2EE', oreille: '#26262E', museau: '#F4F2EE', iris: '#C8924A' },
  brun: { fur: '#8E5E38', furS: '#704828', belly: '#EAD0AC', oreille: '#5A3A22' },
  roux: { fur: '#D47C3E', furS: '#B0602C', belly: '#FFE8D2', oreille: '#9A4C22' }
};
Q.dog = (v) => ({
  id: 'dog' + (v || ''), size: 'MID', ...(({ oreille, museau, ...r }) => r)(CHIENS[v || 'beige']),
  // chibi : grosse tête, oreilles tombantes, pattes courtes
  body: [-1.2, -7.6, 6.6, 4.6], head: [6, -12, 5.6], restDrop: 1.4,
  legs: { back: -4, front: 3.4, top: -4, w: 2.1, paw: '#FFF2DE' },
  snout: [3.4, 2, 2.8, 2.1, CHIENS[v || 'beige'].museau || CHIENS[v || 'beige'].belly], nose: [5.6, 1.2, 0.68, OUT], eye: [1.1, -1.1, 1.35],
  ears: { kind: 'hang', size: 1, color: CHIENS[v || 'beige'].oreille }, tail: { kind: 'thin', up: 5, w: 1.4 },
  parts: { neck: ({ hx, hy, hr }) => P(`M${r2(hx - hr * 0.82)},${r2(hy + hr * 0.55)} Q${r2(hx - hr * 0.22)},${r2(hy + hr * 1.1)} ${r2(hx + hr * 0.36)},${r2(hy + hr * 0.82)}`, 'none', 0).replace('stroke="none"', 'stroke="#E0483C" stroke-width="1.4" stroke-linecap="round"') + E(hx - hr * 0.1, hy + hr * 1.04, 0.7, 0.7, '#F2C94C', 0.5) }
});
// La grenouille : assise, saute en marchant
Q.frog = () => ({
  id: 'frog', size: 'SMALL', fur: '#7CC46A', furS: '#5AA04C', belly: '#E8F2B0',
  // chibi : toute ronde, grosse tête, les yeux sur deux bosses
  body: [-0.4, -3.8, 5.2, 3.8], head: [2.4, -7.6, 4.4], headW: 1.15, restDrop: 0,
  legs: { back: -3, front: 2.6, top: -1.6, w: 1.4, paw: '#5AA04C' },
  eye: [1.2, -3.1, 1.3], blush: true, ears: {}, tail: {},
  parts: {
    behindHead: ({ hx, hy }) => E(hx - 1.9, hy - 3.3, 2.1, 2.1, '#7CC46A') + E(hx + 1.9, hy - 3.3, 2.1, 2.1, '#7CC46A'),
    face: ({ hx, hy }) => P(`M${r2(hx - 1.6)},${r2(hy + 1.2)} Q${r2(hx + 1.8)},${r2(hy + 3)} ${r2(hx + 4.4)},${r2(hy + 0.5)}`, 'none', 0.6),
    head: ({ hx, hy, mode }) => eye(hx - 1.9, hy - 3.3, 1.12, mode)
  }
});

module.exports = { BOX, K, quad, Q, eye, heartIcon, limb, thick, stroke, line, hoof, paw, oreilleRenard, oreilleChat, petPose, blob, zed, toes, legShape, cloven, contact, tache };

// ——— Oiseaux (profil, tournés vers la droite) ———
// cfg : body [cx, cy, rx, ry], head [hx, hy, r], beak { kind, len, color }, eye [dx, dy, r], colors body, wing, belly, head,
// legs { xs, top, color }, tail { kind, color }, parts { back(c), body(c), head(c) }
function beakOf(b, hx, hy, hr) {
  const x = hx + hr * 0.85, y = hy + (b.dy || 0.4), L0 = b.len || 2.4;
  switch (b.kind) {
    case 'long': return P(`M${r2(x - 0.4)},${r2(y - 0.9)} L${r2(x + L0)},${r2(y + 0.2)} L${r2(x - 0.4)},${r2(y + 0.9)} Z`, b.color, 0.8);
    case 'big': return P(`M${r2(x - 0.8)},${r2(y - 2.4)} Q${r2(x + L0 * 0.7)},${r2(y - 2.8)} ${r2(x + L0)},${r2(y + 0.6)} Q${r2(x + L0 * 0.5)},${r2(y + 1)} ${r2(x - 0.6)},${r2(y + 1.6)} Z`, b.color, 0.9)
      + `<path d="M${r2(x + L0 - 1.2)},${r2(y - 0.6)} L${r2(x + L0)},${r2(y + 0.6)}" stroke="${b.tip || OUT}" stroke-width="1.2"/>` + `<path d="M${r2(x - 0.6)},${r2(y - 0.2)} Q${r2(x + L0 * 0.5)},${r2(y - 0.6)} ${r2(x + L0 * 0.95)},${r2(y + 0.2)}" fill="none" stroke="${OUT}" stroke-width="0.5"/>`;
    case 'puffin': return P(`M${r2(x - 0.6)},${r2(y - 2.2)} Q${r2(x + L0)},${r2(y - 1.4)} ${r2(x + L0)},${r2(y + 0.4)} Q${r2(x + L0 * 0.6)},${r2(y + 1.8)} ${r2(x - 0.6)},${r2(y + 1.8)} Z`, '#F07A3A', 0.9)
      + P(`M${r2(x - 0.6)},${r2(y - 2.2)} L${r2(x + 0.6)},${r2(y - 2)} L${r2(x + 0.6)},${r2(y + 1.7)} L${r2(x - 0.6)},${r2(y + 1.8)} Z`, '#3E6FB8', 0) + `<path d="M${r2(x + 1.4)},${r2(y - 1.5)} Q${r2(x + 2.2)},${r2(y)} ${r2(x + 1.4)},${r2(y + 1.5)}" fill="none" stroke="#F2C94C" stroke-width="0.6"/>`;
    default: return P(`M${r2(x - 0.4)},${r2(y - 0.9)} L${r2(x + L0)},${r2(y + 0.1)} L${r2(x - 0.4)},${r2(y + 1)} Z`, b.color || '#F2B33B', 0.8);
  }
}
// Plumes de queue en faucille (poule, coq) : chacune une plume effilée qui monte vers l'arrière et se recourbe ;
// racine en (x, y) (le corps cache le haut), k : sens (1 : vers la gauche, l'arrière de profil)
function faucilles(x, y, cols, up = 1, k = 1, sway = 0) {
  return [[-5.4, -2.4, 2.8, 1], [-4.6, -5.4, 3.1, 0], [-2.4, -6.6, 2.6, 1]].map(([dx, dy, w, i]) =>
    legShape([x, y], [x + dx * k + sway, y + dy * up], w, 0.6, -1.3 * k, cols[i % cols.length], false, 0.75)
    + stroke(`M${r2(x - dx * 0.05 * k)},${r2(y)} Q${r2(x + dx * 0.55 * k + 0.6 * k)},${r2(y + dy * up * 0.45)} ${r2(x + dx * 0.85 * k + sway)},${r2(y + dy * up * 0.88)}`, 0.35, 'rgba(255,255,255,.45)')).join('');
}
// Aile repliée à plumes : bord d'attaque arrondi devant (épaule), trois rémiges en festons derrière, une bande de
// couvertures plus claire, les tiges des plumes ; a : épaule, b : bout de l'aile (vers l'arrière), h : sa hauteur
function ailePlume(a, b, h, col, id) {
  const dx = b[0] - a[0], dy = b[1] - a[1];
  const pt = (t, v) => [a[0] + dx * t, a[1] + dy * t + h * v];
  const f = q => `${r2(q[0])},${r2(q[1])}`;
  const [p0, p1, p2, p3, p4, p5] = [pt(0, -0.1), pt(0.55, -0.42), pt(1, 0), pt(0.78, 0.55), pt(0.5, 0.78), pt(0.15, 0.62)];
  const d = `M${f(p0)} Q${f(pt(0.25, -0.62))} ${f(p1)} Q${f(pt(0.85, -0.35))} ${f(p2)} Q${f(pt(0.98, 0.42))} ${f(p3)} Q${f(pt(0.7, 0.86))} ${f(p4)} Q${f(pt(0.36, 0.95))} ${f(p5)} Q${f(pt(-0.08, 0.55))} ${f(p0)} Z`;
  const light = tone(col, 1.22);
  return P(d, col, 0.9) + clip(id, d, `<path d="M${f(pt(-0.1, -0.2))} Q${f(pt(0.4, -0.75))} ${f(pt(1.1, -0.1))} L${f(pt(1.1, 0.18))} Q${f(pt(0.45, -0.25))} ${f(pt(-0.1, 0.25))} Z" fill="${light}"/>`)
    + [[0.62, 0.05, 0.9, 0.4], [0.42, 0.25, 0.66, 0.66], [0.22, 0.3, 0.38, 0.72]].map(([t0, v0, t1, v1]) => stroke(`M${f(pt(t0, v0))} Q${f(pt((t0 + t1) / 2 + 0.06, (v0 + v1) / 2))} ${f(pt(t1, v1))}`, 0.45, 'rgba(60,40,25,.55)')).join('');
}
function bird(c, pose) {
  const walk = pose === 'marche1' || pose === 'marche2';
  const rest = pose === 'repos' || pose === 'clignement';
  const ph = pose === 'marche2' ? -1 : 1;
  const lg = c.legs;
  const drop = rest ? -lg.top * 0.85 : 0;
  const bob = pose === 'marche2' ? -0.4 : 0;
  const [bx, by0, brx, bry] = c.body;
  const by = by0 + drop + bob;
  const [hx, hy0, hr] = c.head;
  const hy = hy0 + drop + bob + (walk ? ph * 0.3 : 0);
  const mode = pose === 'clignement' ? 'blink' : pose === 'joie' ? 'joy' : 'open';
  const ctx = { pose, rest, walk, bx, by, hx, hy, hr, ph, mode };
  let s = E(bx, -0.2, brx * 0.9, 1.3, 'rgba(40,55,20,.18)', 0);
  // pattes fines et doigts
  if (!rest) for (const [i, x] of lg.xs.entries()) {
    const dx = walk ? (i ? -ph : ph) * 1 : 0;
    if (lg.fine) {
      // patte écailleuse : la jambe, deux écailles, trois doigts devant et l'ergot derrière ; ombre de contact
      const col = i ? lg.color : tone(lg.color, 0.86), fx = x + dx;
      const toe = (x1, y1) => stroke(`M${r2(fx)},-0.5 L${r2(x1)},${r2(y1)}`, 1.6, OUT) + stroke(`M${r2(fx)},-0.5 L${r2(x1)},${r2(y1)}`, 0.7, col);
      s += contact(fx + 0.4, 1.4) + limb([x, by + bry * 0.55], [fx, -0.6], lg.w || 0.75, col) + toe(fx - 1, -0.3) + toe(fx + 1.6, -0.3) + toe(fx + 0.8, 0.05)
        + [0.35, 0.6].map(t => line([x + (fx - x) * t - 0.4, by + bry * 0.55 + (-0.6 - by - bry * 0.55) * t], [x + (fx - x) * t + 0.4, by + bry * 0.55 + (-0.6 - by - bry * 0.55) * t + 0.2], 0.3, 'rgba(60,40,25,.6)')).join('');
    } else s += limb([x, by + bry * 0.7], [x + dx, -0.6], lg.w || 0.7, lg.color) + line([x + dx - 0.8, -0.4], [x + dx + 1.4, -0.4], 1.6, OUT) + line([x + dx - 0.8, -0.4], [x + dx + 1.4, -0.4], 0.7, lg.color);
  }
  s += c.parts?.back ? c.parts.back(ctx) : '';
  // queue
  const t = c.tail || {};
  const tx = bx - brx * 0.85, ty = by - bry * 0.1;
  if (t.kind === 'fan') s += P(`M${r2(tx + 1)},${r2(ty + 1)} L${r2(tx - (t.len || 3.6))},${r2(ty - (t.up || 4.6))} Q${r2(tx - (t.len || 3.6) + 1.6)},${r2(ty - (t.up || 4.6) - 1.2)} ${r2(tx + 1.4)},${r2(ty - 1.4)} Z`, t.color || c.wing);
  if (t.kind === 'long') s += P(`M${r2(tx + 1)},${r2(ty - 0.6)} L${r2(tx - (t.len || 4))},${r2(ty + 0.6)} L${r2(tx + 1)},${r2(ty + 1.8)} Z`, t.color || c.wing);
  if (t.kind === 'sickle') s += faucilles(tx + 1.2, ty - 0.4, t.colors, 0.95, 1, walk ? ph * 0.4 : 0);
  // corps, ventre, aile
  const bd = `M${r2(bx - brx)},${r2(by)} a${brx},${bry} 0 1,0 ${2 * brx},0 a${brx},${bry} 0 1,0 ${-2 * brx},0 Z`;
  // volume : ombre propre en bas et à droite, la lumière vient d'en haut à gauche
  s += P(bd, c.color) + clip(`b${c.id}${pose}`, bd, `<rect x="${r2(bx - brx - 1)}" y="${r2(by - bry - 1)}" width="${r2(brx * 2 + 2)}" height="${r2(bry * 2 + 2)}" fill="${tone(c.color, 0.86)}"/>`
    + `<ellipse cx="${r2(bx - brx * 0.1)}" cy="${r2(by - bry * 0.16)}" rx="${r2(brx * 0.98)}" ry="${r2(bry * 0.9)}" fill="${c.color}"/>`
    + `<ellipse cx="${r2(bx + brx * 0.35)}" cy="${r2(by + bry * 0.4)}" rx="${r2(brx * 0.75)}" ry="${r2(bry * 0.75)}" fill="${c.belly || c.color}"/>`
    + (c.parts?.coat ? c.parts.coat(ctx) : '')) + P(bd, 'none');
  const wingUp = walk && ph < 0 ? -0.6 : 0;
  if (c.wingKind === 'plume') s += ailePlume([bx + brx * 0.42, by - bry * 0.2 + wingUp], [bx - brx * 0.92, by + bry * 0.12 + wingUp], bry * 0.78, c.wing, `ap${c.id}${pose}`);
  else s += P(`M${r2(bx - brx * 0.6)},${r2(by - bry * 0.35 + wingUp)} Q${r2(bx + brx * 0.2)},${r2(by - bry * 0.75 + wingUp)} ${r2(bx + brx * 0.45)},${r2(by - bry * 0.05)} Q${r2(bx)},${r2(by + bry * 0.65)} ${r2(bx - brx * 0.95)},${r2(by + bry * 0.25)} Z`, c.wing, 0.9);
  s += c.parts?.body ? c.parts.body(ctx) : '';
  // tête
  if (c.neck) s += thick(c.neck(ctx), c.neckW || 2.4, c.headColor || c.color);
  s += c.parts?.behindHead ? c.parts.behindHead(ctx) : '';
  const hcol = c.headColor || c.color, hd = `M${r2(hx - hr)},${r2(hy)} a${r2(hr)},${r2(hr)} 0 1,0 ${r2(2 * hr)},0 a${r2(hr)},${r2(hr)} 0 1,0 ${r2(-2 * hr)},0 Z`;
  s += P(hd, hcol) + clip(`b${c.id}${pose}h`, hd, `<rect x="${r2(hx - hr - 1)}" y="${r2(hy - hr - 1)}" width="${r2(hr * 2 + 2)}" height="${r2(hr * 2 + 2)}" fill="${tone(hcol, 0.88)}"/>`
    + `<ellipse cx="${r2(hx - hr * 0.12)}" cy="${r2(hy - hr * 0.14)}" rx="${r2(hr * 0.97)}" ry="${r2(hr * 0.92)}" fill="${hcol}"/>`) + P(hd, 'none');
  s += c.parts?.face ? c.parts.face(ctx) : '';
  s += beakOf(c.beak, hx, hy, hr);
  const [edx, edy, er] = c.eye;
  s += eye(hx + edx, hy + edy, er, mode);
  if (c.blush !== false) s += E(hx + edx - er * 0.2, hy + edy + er * 1.5, er * 0.8, er * 0.4, '#F7A8B0', 0);
  s += c.parts?.head ? c.parts.head(ctx) : '';
  if (pose === 'joie') s += heartIcon(hx, Math.max(hy - hr - 2.4, BOX[c.size][1] + 2), 1.2);
  return s;
}

const B = {};
B.hen = (v) => {
  const col = { blanche: '#FFFFFF', rousse: '#C8642E', noire: '#3A3A42', grise: '#B4B4B8' }[v || 'rousse'];
  const wing = { blanche: '#E6E2DA', rousse: '#A84E22', noire: '#2A2A32', grise: '#8E8E94' }[v || 'rousse'];
  const queue = v === 'noire' ? ['#2E7A66', '#22584C'] : v === 'blanche' ? ['#F4F1EA', '#DCD7CC'] : v === 'grise' ? ['#8E8E96', '#AEAEB4'] : ['#9A4520', '#C2622E'];
  return {
    id: 'hen' + (v || ''), size: 'SMALL', color: col, wing, wingKind: 'plume', belly: v === 'noire' ? '#4A4A54' : v === 'rousse' ? '#E08A4E' : col,
    // chibi : grosse tête ronde sur un corps dodu, une aile à plumes, une queue en faucilles, des pattes écailleuses
    body: [-0.6, -6.6, 4.8, 4.2], head: [3.2, -11.4, 3.7], t3: { lenDos: 1.02 },
    beak: { kind: 'cone', len: 1.9, color: '#F2B33B' }, eye: [0.9, -0.5, 0.98],
    legs: { xs: [-1.4, 0.8], top: -2.6, color: '#F2B33B', fine: true, w: 1.15 }, tail: { kind: 'sickle', colors: queue },
    parts: {
      // la crête à quatre lobes, les deux barbillons, l'oreillon clair
      head: ({ hx, hy, hr }) => {
        const y0 = hy - hr + 0.7;
        const lobes = [[-1.5, 1.5], [-0.5, 2.2], [0.5, 2], [1.4, 1.4]].map(([dx, h], k) => `${k ? 'Q' : 'M'}${k ? `${r2(hx + dx - 0.5)},${r2(y0 - h - 0.6)} ` : ''}${r2(hx + dx)},${r2(y0 - h)}`).join(' ');
        return P(`M${r2(hx - 1.9)},${r2(y0 + 0.4)} Q${r2(hx - 2.3)},${r2(y0 - 1.4)} ${r2(hx - 1.5)},${r2(y0 - 1.5)} Q${r2(hx - 1.2)},${r2(y0 - 2.6)} ${r2(hx - 0.5)},${r2(y0 - 2.2)} Q${r2(hx - 0.1)},${r2(y0 - 2.9)} ${r2(hx + 0.5)},${r2(y0 - 2)} Q${r2(hx + 1.2)},${r2(y0 - 2.3)} ${r2(hx + 1.4)},${r2(y0 - 1.4)} Q${r2(hx + 2)},${r2(y0 - 0.8)} ${r2(hx + 1.5)},${r2(y0 + 0.5)} Z`, '#E8483C', 0.7)
          + E(hx + hr * 0.82, hy + hr * 0.66, 0.62, 0.95, '#E8483C', 0.6) + E(hx + hr * 1.08, hy + hr * 0.58, 0.5, 0.8, '#D63A30', 0.6)
          + (lobes ? '' : '');
      },
      coat: ({ bx, by }) => v === 'grise' ? [[-2, -1], [0.6, -2], [2, 0.6], [-1, 1.4]].map(([x, y]) => E(bx + x, by + y, 0.5, 0.5, '#FFFFFF', 0)).join('') : ''
    }
  };
};
B.chick = () => ({
  id: 'chick', size: 'SMALL', color: '#FFE16A', wing: '#F6C93E', belly: '#FFF0A0',
  body: [-0.3, -3.4, 3.2, 2.9], head: [1.6, -6.8, 3],
  beak: { kind: 'cone', len: 1.2, color: '#F29A3B' }, eye: [0.75, -0.4, 0.86],
  legs: { xs: [-0.8, 0.8], top: -1.2, color: '#F29A3B', w: 0.6 }, tail: {},
  parts: { head: ({ hx, hy, hr }) => P(`M${r2(hx - 0.4)},${r2(hy - hr + 0.2)} Q${r2(hx - 0.6)},${r2(hy - hr - 1.4)} ${r2(hx + 0.6)},${r2(hy - hr - 0.6)}`, 'none', 0.6) }
});
B.heron = () => ({
  id: 'heron', size: 'TALL', color: '#A8B4C2', wing: '#7E8C9E', belly: '#E8EEF4', headColor: '#E8EEF4',
  // chibi : grosse tête ronde au bout du long cou
  body: [-1, -17, 6, 4], head: [4.4, -30, 3.3],
  beak: { kind: 'long', len: 4.8, color: '#F2C94C', dy: 0.5 }, eye: [0.7, -0.4, 1],
  legs: { xs: [-1.6, 0.6], top: -13, color: '#C8A85A', w: 0.8 }, tail: { kind: 'long', len: 3.4 },
  neck: ({ bx, by, hx, hy }) => `M${r2(bx + 4)},${r2(by - 2)} Q${r2(bx + 9)},${r2(by - 6)} ${r2(hx - 1)},${r2(hy + 6)} Q${r2(hx - 2.4)},${r2(hy + 3)} ${r2(hx)},${r2(hy + 1)}`, neckW: 2.2,
  parts: {
    // la calotte noire passe sous l'œil, l'aigrette par-dessus la tête
    face: ({ hx, hy, hr }) => E(hx + hr * 0.05, hy - hr * 0.55, hr * 0.78, hr * 0.36, '#3A3A48', 0),
    head: ({ hx, hy, hr }) => thick(`M${r2(hx - hr * 0.6)},${r2(hy - hr * 0.42)} Q${r2(hx - hr * 1.7)},${r2(hy - hr * 0.6)} ${r2(hx - hr * 2.2)},${r2(hy + hr * 0.25)}`, 0.6, '#3A3A48')
  }
});
B.puffin = () => ({
  id: 'puffin', size: 'SMALL', color: '#2E2E38', wing: '#22222A', belly: '#FFFFFF',
  // chibi : grosse tête ronde sur un petit corps
  body: [-0.4, -5.6, 3.8, 4.4], head: [1.6, -10.8, 4],
  beak: { kind: 'puffin', len: 2.6 }, eye: [0.75, -0.5, 0.95],
  legs: { xs: [-1, 0.8], top: -1.8, color: '#F07A3A', w: 0.9 }, tail: { kind: 'long', len: 2 },
  parts: {
    face: ({ hx, hy, hr }) => E(hx + 0.6, hy + 0.2, hr * 0.85, hr * 0.8, '#F4F4F4', 0),
    // Bosco est bougon : un sourcil froncé
    head: ({ hx, hy, hr, mode }) => mode === 'open' ? `<path d="M${r2(hx - hr * 0.1)},${r2(hy - hr * 0.6)} L${r2(hx + hr * 0.58)},${r2(hy - hr * 0.4)}" stroke="${OUT}" stroke-width="0.75" stroke-linecap="round"/>` : ''
  }
});
B.toucan = () => ({
  id: 'toucan', size: 'SMALL', color: '#2A2A30', wing: '#1E1E24', belly: '#2A2A30',
  // chibi : grosse tête ronde, son grand bec
  body: [-1.4, -7.2, 4, 4.8], head: [1.2, -11.6, 3.6],
  beak: { kind: 'big', len: 6, color: '#F6A23B', tip: '#E8483C', dy: 0.6 }, eye: [0.5, -0.7, 0.95], blush: false,
  legs: { xs: [-2, 0], top: -2.6, color: '#5C8FD8', w: 0.8 }, tail: { kind: 'long', len: 3.6 },
  parts: { face: ({ hx, hy, hr }) => E(hx + hr * 0.21, hy + hr * 0.57, hr * 0.79, hr * 0.71, '#FFF4C8', 0) + E(hx + 0.5, hy - 0.75, 1.65, 1.55, '#7CD0E8', 0) }
});
B.crow = () => ({
  id: 'crow', size: 'SMALL', color: '#2E2E38', wing: '#3E4A6A', belly: '#3A3A46',
  // chibi : grosse tête ronde sur un corps dodu
  body: [-0.6, -6.2, 4.4, 3.8], head: [3, -10.2, 3.5],
  beak: { kind: 'long', len: 3, color: '#5A5A64' }, eye: [0.75, -0.5, 0.95],
  legs: { xs: [-1.4, 0.6], top: -2.4, color: '#4A4A52' }, tail: { kind: 'long', len: 3.6 },
  parts: { body: ({ bx, by }) => `<path d="M${r2(bx - 2)},${r2(by - 2.4)} Q${r2(bx)},${r2(by - 3.4)} ${r2(bx + 2)},${r2(by - 2.2)}" fill="none" stroke="#6E80B0" stroke-width="0.6" opacity="0.8"/>` }
});
B.bird = () => ({
  id: 'bird', size: 'SMALL', color: '#5C9CE0', wing: '#4A84C8', belly: '#FFE16A', headColor: '#FFFFFF',
  // chibi : grosse tête ronde sur un corps dodu
  body: [-0.2, -4, 3.2, 3], head: [2.3, -7.5, 3],
  beak: { kind: 'cone', len: 1.1, color: '#3A3A44' }, eye: [0.8, -0.25, 0.85],
  legs: { xs: [-0.6, 0.8], top: -1.4, color: '#7E7E8A', w: 0.55 }, tail: { kind: 'long', len: 2.6, color: '#4A84C8' },
  parts: { head: ({ hx, hy, hr }) => P(`M${r2(hx - hr)},${r2(hy - 0.4)} Q${r2(hx - hr * 0.6)},${r2(hy - hr)} ${r2(hx + hr * 0.8)},${r2(hy - hr * 0.55)} Q${r2(hx)},${r2(hy - hr * 0.35)} ${r2(hx - hr)},${r2(hy - 0.4)} Z`, '#5C9CE0', 0) + `<path d="M${r2(hx - hr * 0.7)},${r2(hy + hr * 0.09)} L${r2(hx + hr * 0.52)},${r2(hy - hr * 0.17)}" stroke="#2A3A5A" stroke-width="0.5"/>` }
});
B.gull = () => ({
  id: 'gull', size: 'SMALL', color: '#FFFFFF', wing: '#A8B4C2', belly: '#FFFFFF',
  // chibi : grosse tête ronde sur un corps dodu
  body: [-0.8, -6.2, 4.6, 3.9], head: [3.2, -11, 3.5],
  beak: { kind: 'long', len: 2.6, color: '#F2C94C' }, eye: [0.85, -0.5, 0.95],
  legs: { xs: [-1.6, 0.6], top: -2.6, color: '#F2B33B' }, tail: { kind: 'long', len: 3, color: '#3A3A44' },
  parts: { head: ({ hx, hy, hr }) => E(hx + hr * 0.85 + 2.1, hy + 0.7, 0.4, 0.35, '#E8483C', 0) }
});

// La mouette qui s'envole et qui vole, de profil, tournée vers la droite (le miroir donne la gauche) ; ancre (0, 0) au
// sol sous elle. envol1 : accroupie, les ailes s'ouvrent ; envol2 : le saut, ailes en haut ; envol3 : elle décolle, ailes
// en bas, pattes repliées. vol1 à vol4 : le battement en boucle, le corps à 16 au-dessus de l'ancre (le jeu ajoute
// l'altitude et l'ombre). plane : ailes tendues, sans battre.
const GULL_POSES = {
  envol1: { h: 4.4, ailes: 'milieuHaut', pattes: 'pliees', ombre: 1 },
  envol2: { h: 9, ailes: 'haut', pattes: 'pendantes', ombre: 0.7 },
  envol3: { h: 13, ailes: 'bas', pattes: 'repliees', ombre: 0.45 },
  vol1: { h: 16, ailes: 'haut', pattes: 'repliees' }, vol2: { h: 16.6, ailes: 'milieu', pattes: 'repliees' },
  vol3: { h: 17, ailes: 'bas', pattes: 'repliees' }, vol4: { h: 16.4, ailes: 'milieuHaut', pattes: 'repliees' },
  plane: { h: 16, ailes: 'plane', pattes: 'repliees' }
};
// le bout de chaque aile (proche, lointaine) depuis l'épaule, pour chaque position
const AILES = {
  haut: [[-3.6, -13.4], [-1.4, -14]], milieuHaut: [[-8, -8.4], [-5.8, -9.6]], milieu: [[-10.8, -1.4], [-9.2, -3.6]],
  bas: [[-5, 8.4], null], plane: [[-11.4, -3.6], [-9.6, -5.6]]
};
function gullFly(pose) {
  const c = B.gull(), g = GULL_POSES[pose], y = -g.h;
  const [near, far] = AILES[g.ailes];
  const sh = [0.6, y - 1.6]; // l'épaule
  // une aile : large à l'épaule, effilée au bout ; bord d'attaque bombé vers l'avant, bord de fuite qui revient ; le bout
  // noir, une tache blanche
  const aile = ([dx, dy], col, k) => {
    const tip = [sh[0] + dx * k, sh[1] + dy * k], L0 = Math.hypot(dx * k, dy * k), ux = dx * k / L0, uy = dy * k / L0;
    let n = [-uy, ux]; if (n[0] < 0 || (Math.abs(n[0]) < 0.2 && n[1] > 0)) n = [-n[0], -n[1]]; // vers l'avant
    const w = 2.6, at = (t, o) => [sh[0] + dx * k * t + n[0] * o, sh[1] + dy * k * t + n[1] * o];
    const a = at(0, w), b = at(0, -w * 0.8), c1 = at(0.5, w * 1.5), c2 = at(0.62, -w * 0.9);
    const bez = (p0, c, p1, t) => [0, 1].map(i => (1 - t) ** 2 * p0[i] + 2 * t * (1 - t) * c[i] + t * t * p1[i]);
    const d = `M${r2(a[0])},${r2(a[1])} Q${r2(c1[0])},${r2(c1[1])} ${r2(tip[0])},${r2(tip[1])} Q${r2(c2[0])},${r2(c2[1])} ${r2(b[0])},${r2(b[1])} Z`;
    const p1 = bez(a, c1, tip, 0.6), p2 = bez(tip, c2, b, 0.42);
    const sp = [p1[0] + (tip[0] - p1[0]) * 0.35 + (p2[0] - p1[0]) * 0.3, p1[1] + (tip[1] - p1[1]) * 0.35 + (p2[1] - p1[1]) * 0.3];
    return P(d, col, 0.9) + clip(`gv${pose}${k}`, d, P(`M${r2(p1[0])},${r2(p1[1])} L${r2(tip[0] + ux * 2)},${r2(tip[1] + uy * 2)} L${r2(p2[0])},${r2(p2[1])} Z`, '#2A2A32', 0))
      + E(sp[0], sp[1], 0.5, 0.45, '#FFFFFF', 0) + P(d, 'none', 0.9);
  };
  let s = g.ombre ? E(0, -0.2, 4.6 * g.ombre, 1.2 * g.ombre, 'rgba(40,55,20,.18)', 0) : '';
  // pattes : pliées au sol, pendantes au saut, repliées sous la queue en vol
  const leg = (x, to) => limb([x, y + 2.4], to, 0.65, '#F2B33B');
  if (g.pattes === 'pliees') s += leg(-1.4, [-1.8, -0.6]) + leg(0.6, [0.4, -0.6]) + line([-2.6, -0.4], [-0.8, -0.4], 1.5, OUT) + line([-0.4, -0.4], [1.4, -0.4], 1.5, OUT);
  if (g.pattes === 'pendantes') s += leg(-1.2, [-1.6, y + 6]) + leg(0.6, [0.4, y + 6.2]);
  if (g.pattes === 'repliees') s += leg(-1, [-5, y + 3]) + leg(0.4, [-4.4, y + 3.6]);
  if (far) s += aile(far, tone(c.wing, 0.86), 0.92);
  // la queue, le corps allongé (blanc), le ventre
  s += P(`M${r2(-3.8)},${r2(y - 0.6)} L${r2(-8.4)},${r2(y - 0.2 + (pose === 'plane' ? -0.6 : 0))} L${r2(-8)},${r2(y + 1.4)} L${r2(-3.8)},${r2(y + 1.6)} Z`, '#F4F4F4')
    + P(`M${r2(-7.4)},${r2(y - 0.3)} L${r2(-8.4)},${r2(y - 0.2)} L${r2(-8)},${r2(y + 1.4)} L${r2(-7.2)},${r2(y + 1.3)} Z`, '#3A3A44', 0);
  const bd = `M${r2(-5)},${r2(y)} a5,3.2 0 1,0 10,0 a5,3.2 0 1,0 -10,0 Z`;
  s += P(bd, c.color) + clip(`gv${pose}`, bd, `<ellipse cx="0.6" cy="${r2(y + 1.6)}" rx="5" ry="1.8" fill="${tone(c.color, 0.9)}"/>`) + P(bd, 'none');
  // la tête, le bec, l'œil
  const hx = 4.8, hy = y - 2.4, hr = 3.1, hd = `M${r2(hx - hr)},${r2(hy)} a${hr},${hr} 0 1,0 ${r2(2 * hr)},0 a${hr},${hr} 0 1,0 ${r2(-2 * hr)},0 Z`;
  s += P(hd, c.color) + clip(`gv${pose}h`, hd, `<ellipse cx="${r2(hx + 0.3)}" cy="${r2(hy + hr * 0.5)}" rx="${r2(hr)}" ry="${r2(hr * 0.6)}" fill="${tone(c.color, 0.9)}"/>`) + P(hd, 'none');
  s += beakOf(c.beak, hx, hy, hr) + E(hx + hr * 0.85 + 2.1, hy + 0.7, 0.4, 0.35, '#E8483C', 0);
  s += eye(hx + 0.8, hy - 0.5, 0.9, 'open') + E(hx + 0.6, hy + 0.9, 0.7, 0.35, '#F7A8B0', 0);
  if (near) s += aile(near, c.wing, 1);
  return s;
}
BOX.GULL_FLY = box(-14, -28, 28, 30);

// ——— L'écureuil, dessiné à part (son allure ne suit pas le gabarit des quadrupèdes) ———
// Assis sur sa grosse cuisse, le long pied à plat, les petites mains contre la poitrine, la tête ronde au museau clair,
// les oreilles arrondies à pinceau, le grand panache en S. Profil tourné vers la droite, ancre (0, 0) au sol.
// marche1 : il bondit, les mains au sol devant ; marche2 : ramassé ; repos, clignement : assis, il grignote un gland ;
// joie : dressé, les mains levées.
const ovale = (cx, cy, rx, ry, a = 0) => { const pts = []; for (let i = 0; i < 32; i++) { const t = (i / 32) * Math.PI * 2; pts.push(rot2(cx + Math.cos(t) * rx, cy + Math.sin(t) * ry, cx, cy, a)); } return 'M' + pts.map(f2p).join(' L') + ' Z'; };
const rot2 = (x, y, cx, cy, a) => { const c = Math.cos(a), s = Math.sin(a); return [cx + (x - cx) * c - (y - cy) * s, cy + (x - cx) * s + (y - cy) * c]; };
// Courbe de Bézier cubique échantillonnée
const bez = (p0, p1, p2, p3, n) => Array.from({ length: n }, (_, i) => { const t = i / (n - 1), u = 1 - t; return [0, 1].map(k => u * u * u * p0[k] + 3 * u * u * t * p1[k] + 3 * u * t * t * p2[k] + t * t * t * p3[k]); });
// Le panache : une épaisseur le long d'une ligne (largeurs w), un bord ébouriffé en festons, un bout arrondi, une raie
// plus claire au milieu, l'ombre sous la courbe
function panache(ligne, w, col, clair, sombre, id) {
  const n = ligne.length, G = [], D = [];
  ligne.forEach((p, i) => {
    const a = ligne[Math.max(0, i - 1)], b = ligne[Math.min(n - 1, i + 1)], tx = b[0] - a[0], ty = b[1] - a[1], L0 = Math.hypot(tx, ty) || 1;
    G.push([p[0] - ty / L0 * w[i], p[1] + tx / L0 * w[i]]); D.push([p[0] + ty / L0 * w[i], p[1] - tx / L0 * w[i]]);
  });
  const fest = (pts, k) => pts.slice(1).map((q, i) => { const p = pts[i], m = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2], c = ligne[pts === G ? i : n - 2 - i] || m, o = [m[0] + (m[0] - c[0]) * 0.16 * k, m[1] + (m[1] - c[1]) * 0.16 * k]; return `Q${f2p(o)} ${f2p(q)}`; }).join(' ');
  const Dr = D.slice().reverse(), bout = ligne[n - 1], fin = w[n - 1];
  const d = `M${f2p(G[0])} ${fest(G, 1)} A${r2(fin)},${r2(fin)} 0 0,1 ${f2p(Dr[0])} ${fest(Dr, 0.35)} Z`;
  const raie = 'M' + ligne.slice(1, -1).map(f2p).join(' L');
  return P(d, col, 0.95) + clip(id, d, `<path d="${'M' + D.map(f2p).join(' L')}" fill="none" stroke="${sombre}" stroke-width="${r2(Math.max(...w) * 0.9)}" stroke-linejoin="round" opacity="0.55"/>`
    + `<path d="${raie}" fill="none" stroke="${clair}" stroke-width="${r2(Math.max(...w) * 0.55)}" stroke-linecap="round" stroke-linejoin="round" opacity="0.7"/>`
    + E(bout[0], bout[1], fin * 0.9, fin * 0.9, clair, 0).replace('fill=', 'opacity="0.6" fill=')) + P(d, 'none', 0.95);
}
// Oreille d'écureuil : arrondie, l'intérieur rose, un pinceau de poils sombres au bout ; base en (x, y), penchée de a
function oreilleEcureuil(x, y, k, a, col, dedans, pinceau) {
  const d = `M${r2(x - 1.4 * k)},${r2(y + 0.6)} Q${r2(x - 1.6 * k)},${r2(y - 2.4 * k)} ${r2(x - 0.1 * k)},${r2(y - 3.4 * k)} Q${r2(x + 1.5 * k)},${r2(y - 2.3 * k)} ${r2(x + 1.4 * k)},${r2(y + 0.6)} Z`;
  const tip = [x - 0.1 * k, y - 3.4 * k];
  return `<g transform="rotate(${r2(a)} ${r2(x)} ${r2(y)})">` + P(d, col, 0.9) + (dedans ? `<path d="M${r2(x - 0.7 * k)},${r2(y + 0.2)} Q${r2(x - 0.8 * k)},${r2(y - 1.8 * k)} ${r2(x - 0.1 * k)},${r2(y - 2.4 * k)} Q${r2(x + 0.7 * k)},${r2(y - 1.7 * k)} ${r2(x + 0.7 * k)},${r2(y + 0.2)} Z" fill="${dedans}"/>` : '')
    + [-0.6, 0, 0.6].map(dx => stroke(`M${r2(tip[0])},${r2(tip[1] + 0.4)} q${r2(dx * 0.7)},-0.9 ${r2(dx * 1.1)},-1.6`, 0.55, pinceau)).join('') + '</g>';
}
const GLAND = (x, y) => E(x, y + 0.5, 1.1, 1.35, '#B98552', 0.7) + P(`M${r2(x - 1.35)},${r2(y - 0.1)} Q${r2(x)},${r2(y - 1.6)} ${r2(x + 1.35)},${r2(y - 0.1)} Z`, '#7E5530', 0.7) + line([x, y - 1.1], [x + 0.3, y - 1.8], 0.45, '#5A3A1E');
function ecureuil(c, pose) {
  const walk = pose === 'marche1' || pose === 'marche2', rest = pose === 'repos' || pose === 'clignement';
  const mode = pose === 'clignement' ? 'blink' : pose === 'joie' ? 'joy' : 'open';
  const S = {
    marche1: { b: [1, -4.6, -0.62], h: [4.2, -8.8], m: [[4.6, -0.7], [3.9, -0.6]], pied: -1.6, q: 0.22 },
    marche2: { b: [0.2, -5.4, -0.3], h: [2.7, -10.4], m: [[3, -4.6], [2.5, -5]], pied: 0.2, q: 0 },
    repos: { b: [0, -5.6, -0.14], h: [2.2, -10.8], m: [[3.4, -7.2], [2.9, -7.6]], pied: 0.4, q: -0.08 },
    joie: { b: [0.1, -5.8, -0.18], h: [2.4, -11.1], m: [[3.6, -8.6], [3.1, -9.2]], pied: 0.4, q: -0.05 }
  }[rest ? 'repos' : pose];
  const [bx, by, ba] = S.b, [hx, hy] = S.h, hr = 3.9, fur = c.fur, furS = c.furS, belly = c.belly;
  let s = E(-0.4, -0.15, 5.2, 1.2, 'rgba(40,55,20,.18)', 0);
  // le panache, derrière tout le reste ; il tourne autour de sa racine selon la pose
  const base = [-3.2, -2.4];
  const ligne = [...bez(base, [-7.4, -3.2], [-7.8, -10.4], [-5, -13.8], 9), ...bez([-5, -13.8], [-2.8, -16.8], [0.4, -16.6], [-0.3, -14], 6).slice(1)]
    .map(([x, y]) => rot2(x, y, base[0], base[1], S.q + (walk && pose === 'marche2' ? 0.04 : 0)));
  const w = ligne.map((_, i) => 1.1 + Math.sin(Math.min(1, i / 8) * Math.PI / 2) * 2.1 - Math.max(0, i - 10) * 0.18);
  s += panache(ligne, w, fur, c.tail.tip, furS, `ec${pose}q`);
  // main du fond
  const main = ([x, y], col) => E(x, y, 0.95, 0.75, col, 0.8) + toes(x + 0.1, y - 0.2, 0.8);
  s += main(S.m[1], furS);
  // le corps en poire penché, l'ombre du dos, le ventre clair
  const bd = ovale(bx, by, 3.2, 4.1, ba);
  const [vx, vy] = rot2(bx + 1.6, by + 0.6, bx, by, ba);
  s += P(bd, fur) + clip(`ec${pose}b`, bd, `<path d="${ovale(bx - 1.2, by + 0.4, 3.2, 4.4, ba)}" fill="${furS}"/>` + `<path d="${ovale(bx + 0.2, by - 0.3, 3, 4, ba)}" fill="${fur}"/>` + E(vx, vy, 1.7, 3, belly, 0)) + P(bd, 'none');
  // la grosse cuisse et le long pied à plat
  const [cx, cy] = rot2(bx - 1, by + 2.3, bx, by, ba * 0.5);
  s += contact(S.pied + 0.6, 2.2) + E(S.pied + 0.6, -0.75, 2.6, 0.85, furS, 0.8) + toes(S.pied + 2.4, -0.85, 0.9);
  const cd = ovale(cx, cy, 2.5, 2.1, -0.3);
  s += P(cd, fur) + clip(`ec${pose}c`, cd, `<path d="${ovale(cx - 0.6, cy + 0.7, 2.5, 2.1, -0.3)}" fill="${furS}"/>` + `<path d="${ovale(cx + 0.2, cy - 0.2, 2.3, 1.9, -0.3)}" fill="${fur}"/>`) + P(cd, 'none');
  // la tête : oreille du fond, crâne, joue et museau clairs, truffe, œil, oreille proche
  s += oreilleEcureuil(hx - 1.6, hy - hr * 0.62, 0.95, -18, furS, null, tone(furS, 0.6));
  // l'oreille proche aussi passe derrière le crâne : il cache sa base
  s += oreilleEcureuil(hx - 0.3, hy - hr * 0.66, 1.08, -6, fur, '#F2C6C0', tone(furS, 0.6));
  const hd = `M${r2(hx - hr)},${r2(hy)} a${hr},${hr} 0 1,0 ${2 * hr},0 a${hr},${hr} 0 1,0 ${-2 * hr},0 Z`;
  s += P(hd, fur) + clip(`ec${pose}h`, hd, `<rect x="${r2(hx - hr - 1)}" y="${r2(hy - hr - 1)}" width="${r2(hr * 2 + 2)}" height="${r2(hr * 2 + 2)}" fill="${furS}"/>` + E(hx - hr * 0.12, hy - hr * 0.14, hr * 0.97, hr * 0.92, fur, 0)
    + E(hx + hr * 0.5, hy + hr * 0.55, hr * 0.62, hr * 0.45, belly, 0)) + P(hd, 'none');
  s += E(hx + hr * 0.78, hy + hr * 0.18, 1.55, 1.15, belly, 0.8) + E(hx + hr * 1.12, hy - hr * 0.02, 0.5, 0.42, OUT, 0.4)
    + stroke(`M${r2(hx + hr * 0.82)},${r2(hy + hr * 0.42)} q0.5,0.4 1,0.05`, 0.45, OUT);
  s += eye(hx + hr * 0.3, hy - hr * 0.22, 1.18, mode) + E(hx + hr * 0.12, hy + hr * 0.32, 0.95, 0.5, '#F7A8B0', 0);
  // le gland, tenu à deux mains contre la bouche (il grignote) ; la main proche
  if (rest) s += GLAND(hx + hr * 0.62, hy + hr * 0.95);
  s += main(S.m[0], fur);
  if (pose === 'joie') s += heartIcon(hx + 0.6, Math.max(hy - hr - 4.6, BOX[c.size][1] + 2));
  return s;
}
module.exports.ecureuil = ecureuil;
module.exports.panache = panache;
module.exports.oreilleEcureuil = oreilleEcureuil;
module.exports.ovale = ovale;
module.exports.bez = bez;
module.exports.GLAND = GLAND;
module.exports.bird = bird;
module.exports.faucilles = faucilles;
module.exports.ailePlume = ailePlume;
module.exports.B = B;
module.exports.gullFly = gullFly;

// ——— Petites bêtes et mer : cadres propres (jeu × 1,25) ———
Object.assign(BOX, {
  BUTTERFLY: box(-6, -9, 12, 9), FIREFLY: box(-5, -5, 10, 10), BEE: box(-5, -7, 10, 8), OWL: box(-6, -14, 12, 15), TICTAC: box(-6, -10, 12, 11),
  KOI: box(-10, -4, 20, 8), FISH: box(-16, -28, 32, 32), DOLPHIN: box(-26, -22, 52, 36), WHALE_BACK: box(-50, -18, 100, 27), WHALE_FLUKE: box(-26, -30, 52, 38),
  BOWL: box(-6, -10, 12, 11), JELLY: box(-8, -12, 16, 16)
});
// son nom vient de ses réglages (pas d'un compteur) : un même dessin porte le même nom, dans quelque ordre qu'on dessine
const glowDot = (x, y, r, rgb, a = 0.45) => { const id = `lueur-bete_${[x, y, r, a].map(r2).join('_')}_${rgb}`.replace(/,/g, '-').replace(/\./g, 'p'); return `<defs><radialGradient id="${id}"><stop offset="0" stop-color="rgb(${rgb})" stop-opacity="${r2(Math.min(0.9, a * 1.7))}"/><stop offset="1" stop-color="rgb(${rgb})" stop-opacity="0"/></radialGradient></defs><circle cx="${r2(x)}" cy="${r2(y)}" r="${r2(r)}" fill="url(#${id})"/>`; };
const water = (x, y, w) => `<path d="M${r2(x - w)},${r2(y)} Q${r2(x - w / 2)},${r2(y - 1.2)} ${x},${r2(y)} Q${r2(x + w / 2)},${r2(y + 1.2)} ${r2(x + w)},${r2(y)}" fill="none" stroke="#FFFFFF" stroke-width="1" stroke-linecap="round" opacity="0.85"/>`;
const splash = (x, y, k = 1) => [[-3, -2.6], [0, -3.6], [3, -2.4]].map(([dx, dy]) => E(x + dx * k, y + dy * k, 0.7 * k, 0.9 * k, '#BFE6FF', 0.5)).join('');

// Papillon (vu de profil-dessus) ; v : jaune | bleu | lune ; pose : vol1 | vol2 | repos | joie
function butterfly(v, pose) {
  const col = { jaune: ['#F6D04A', '#E8A83A', '#FFE9A8'], bleu: ['#6AB4F0', '#3E7FC1', '#D2E8FC'], lune: ['#CFF2D8', '#8ACB9E'] }[v];
  const open = pose === 'vol2' ? 0.45 : pose === 'repos' ? 0.25 : 1;
  const y = pose === 'repos' ? -3.6 : -5;
  const wing = (m) => `<g transform="translate(0 ${y}) scale(${r2(m * open)} 1)">${P('M0,0 Q2.6,-5.4 5.6,-3.6 Q6.6,-1 2.4,0.4 Q5.2,1.6 4,3.6 Q1.6,4.4 0,1 Z', col[0])}${E(3.4, -2.6, 0.9, 0.7, col[1], 0)}${v === 'lune' ? E(3, -2.4, 0.5, 0.5, '#FFFFFF', 0) : ''}</g>`;
  if (pose === 'repos') {
    // posé sur une fleur, ailes repliées vers le haut (vu de côté)
    const fl = [0, 72, 144, 216, 288].map(a => E(Math.cos(a * Math.PI / 180) * 1.6, -1.4 + Math.sin(a * Math.PI / 180) * 0.8, 1.2, 0.8, '#F7C6D9', 0.5)).join('') + E(0, -1.4, 0.8, 0.6, '#F2C94C', 0.4);
    return '<g transform="translate(0 -1.3)">' + limb([0, -1.2], [0, 0], 0.6, '#6CAE5A') + fl + P('M0,-2.6 Q-1.4,-8.6 2.6,-9.6 Q4.6,-6.4 0.6,-2.4 Z', col[0], 0.7) + E(2, -7, 0.8, 0.6, col[1], 0)
      + (v === 'lune'
        // Lunette, de côté : corps duveteux, tête ronde, un œil, une joue, l'antenne en plume
        ? limb([-0.6, -2.4], [0.6, -4.2], 1.1, '#EDE5D2') + stroke('M1.2,-5.4 Q2,-6.6 3,-6.8', 0.35, OUT) + stroke('M1.7,-6.1 l0.3,0.4 M2.3,-6.6 l0.2,0.45', 0.3, OUT)
          + E(1, -4.9, 1.05, 0.95, '#F4EEDF', 0.7) + eye(1.35, -5, 0.38, 'open') + E(1.05, -4.3, 0.3, 0.16, '#F7A8B0', 0)
        // de côté : corps dodu, tête ronde, un œil, une joue, l'antenne
        : limb([-0.6, -2.4], [0.6, -4.2], 1, '#4A3A30') + stroke('M1.2,-5.5 Q2,-6.8 3,-6.9', 0.35, OUT) + E(3, -6.9, 0.3, 0.3, OUT, 0)
          + E(1, -4.9, 1, 0.92, col[2], 0.7) + eye(1.35, -5, 0.38, 'open') + E(1.05, -4.3, 0.3, 0.16, '#F7A8B0', 0)) + '</g>';
  }
  let s = wing(-1) + wing(1);
  if (v === 'lune') {
    // Lunette (familier) : corps duveteux crème, tête ronde, deux yeux de la troupe, une joue, antennes en plumes
    const feather = (m) => stroke(`M${r2(m * 0.4)},${r2(y - 3.6)} Q${r2(m * 1.2)},${r2(y - 5.2)} ${r2(m * 2)},${r2(y - 5.6)}`, 0.4, OUT)
      + [0.35, 0.65].map(k => stroke(`M${r2(m * (0.4 + 1.6 * k))},${r2(y - 3.6 - 2 * k)} l${r2(m * 0.5)},0.3`, 0.3, OUT)).join('');
    s += feather(-1) + feather(1) + E(0, y + 0.4, 1, 2.4, '#EDE5D2', 0.7) + L([-0.7, y + 0.6], [0.7, y + 0.6], '#C9BFA8', 0.35) + L([-0.6, y + 1.6], [0.6, y + 1.6], '#C9BFA8', 0.35)
      + E(0, y - 2.5, 1.45, 1.3, '#F4EEDF', 0.7) + eye(-0.55, y - 2.55, 0.42, pose === 'joie' ? 'joy' : 'open') + eye(0.55, y - 2.55, 0.42, pose === 'joie' ? 'joy' : 'open')
      + E(-0.95, y - 1.85, 0.32, 0.17, '#F7A8B0', 0) + E(0.95, y - 1.85, 0.32, 0.17, '#F7A8B0', 0);
  } else {
    // chibi : corps dodu, tête ronde, deux yeux de la troupe, deux joues, antennes à boule
    const m = pose === 'joie' ? 'joy' : 'open';
    s += stroke(`M-0.3,${r2(y - 3.2)} Q-1,${r2(y - 4.8)} -1.8,${r2(y - 5.2)} M0.3,${r2(y - 3.2)} Q1,${r2(y - 4.8)} 1.8,${r2(y - 5.2)}`, 0.4, OUT)
      + E(-1.8, y - 5.2, 0.32, 0.32, OUT, 0) + E(1.8, y - 5.2, 0.32, 0.32, OUT, 0)
      + E(0, y + 0.5, 0.8, 2.2, '#4A3A30', 0.6) + E(0, y - 2.4, 1.3, 1.15, col[2], 0.6) + E(-0.45, y - 2.95, 0.5, 0.28, '#FFFFFF', 0).replace('fill=', 'fill-opacity="0.6" fill=')
      + eye(-0.5, y - 2.45, 0.38, m) + eye(0.5, y - 2.45, 0.38, m) + E(-0.9, y - 1.8, 0.3, 0.16, '#F7A8B0', 0) + E(0.9, y - 1.8, 0.3, 0.16, '#F7A8B0', 0);
  }
  if (pose === 'joie') s += heartIcon(4.6, y - 4.4, 0.9);
  return s;
}
// Luciole : abdomen qui luit (pulse)
function firefly(pose) {
  const on = pose !== 'vol2';
  let s = on ? glowDot(-1.6, -3, 4.4, '255,236,150', 0.4) : glowDot(-1.6, -3, 2.6, '255,236,150', 0.25);
  s += E(-1.6, -3, 1.8, 1.4, on ? '#FFF3A0' : '#E8D880', 0.7) + E(0.6, -3.4, 1.4, 1.2, '#4A3A30', 0.7);
  // chibi : grosse tête ronde, deux antennes, un grand œil à reflets, une joue
  // antennes courtes : la luciole des égarés (image luciole 4) reste dans le cadre du petit fantôme
  s += stroke('M1.6,-4.9 Q1.3,-5.7 0.5,-5.8 M2.6,-5 Q3,-5.7 3.9,-5.75', 0.35, OUT);
  s += E(2.1, -3.9, 1.35, 1.25, '#F2B48A', 0.6) + E(1.6, -4.5, 0.5, 0.3, '#FFD8BC', 0) + eye(2.55, -4, 0.52, pose === 'joie' ? 'joy' : 'open') + E(2.3, -3.05, 0.42, 0.22, '#F7A8B0', 0);
  s += P('M-0.4,-4 Q-1.6,-6.6 -3.4,-5.4 Q-2,-4.4 -0.4,-3.8 Z', '#E8F2FA', 0.5).replace('fill=', 'fill-opacity="0.8" fill=');
  if (pose === 'joie') s += heartIcon(3.2, -6, 0.8);
  return `<g transform="translate(0 1)">${s}</g>`;
}
// Abeille rayée et duveteuse ; Tic-Tac : laiton, rivets, clé de remontoir
function bee(pose, meca = false) {
  const flap = pose === 'vol2' ? 0.4 : 1;
  const y = pose === 'repos' ? -2.8 : -4.2;
  let s = '';
  s += `<g transform="translate(-0.4 ${y - 1.6}) scale(1 ${flap})">${P('M0,0 Q-2.2,-3.8 0.4,-4 Q1.6,-2.4 0.6,0 Z', meca ? '#D8EEF6' : '#E8F2FA', 0.5).replace('fill=', 'fill-opacity="0.85" fill=')}</g>`;
  s += E(0, y, 3, 2.2, meca ? '#D4A84A' : '#F6C83E');
  s += clip(`bee${meca ? 'm' : ''}${pose}`, `M-3,${y} a3,2.2 0 1,0 6,0 a3,2.2 0 1,0 -6,0 Z`, [-1.2, 0.6].map(x => `<rect x="${x}" y="${y - 3}" width="0.9" height="6" fill="${meca ? '#8E6E2C' : '#3A2A24'}"/>`).join(''));
  s += E(0, y, 3, 2.2, 'none');
  if (meca) {
    // Tic-Tac (familier) : grosse tête ronde d'acier, un grand œil à reflets, une joue, un rivet sur le front
    s += E(2.7, y - 0.8, 1.95, 1.8, '#B8C0C8', 0.8) + E(2.1, y - 1.5, 0.7, 0.45, '#E2E8EE', 0)
      + eye(3.2, y - 0.95, 0.72, pose === 'joie' ? 'joy' : 'open') + E(2.8, y + 0.35, 0.55, 0.3, '#F7A8B0', 0) + E(1.5, y - 2.1, 0.28, 0.28, '#F0D58A', 0.3);
  } else {
    // chibi : grosse tête ronde, deux antennes, un grand œil à reflets, une joue
    s += stroke(`M2.3,${r2(y - 2.3)} Q2.1,${r2(y - 3.7)} 1.2,${r2(y - 4)} M3.1,${r2(y - 2.4)} Q3.5,${r2(y - 3.6)} 4.4,${r2(y - 3.8)}`, 0.35, OUT);
    s += E(2.7, y - 0.8, 1.9, 1.8, '#FFE07A', 0.8) + E(2.1, y - 1.55, 0.65, 0.4, '#FFF2C0', 0)
      + eye(3.25, y - 0.95, 0.72, pose === 'joie' ? 'joy' : 'open') + E(2.85, y + 0.35, 0.55, 0.3, '#F7A8B0', 0);
  }
  if (meca) s += limb([-1, y - 2.2], [-1.6, y - 4], 0.5, '#C9A24A') + E(-2.4, y - 4.4, 1, 0.6, '#C9A24A', 0.5) + E(-0.8, y - 4.4, 1, 0.6, '#C9A24A', 0.5) + E(0.9, y + 0.6, 0.3, 0.3, '#F0D58A', 0);
  else s += P(`M-3.2,${r2(y + 0.4)} L-4.2,${r2(y + 0.8)} L-3.2,${r2(y + 1.2)} Z`, '#3A2A24', 0);
  // le cœur de l'abeille passe au-dessus de ses antennes
  if (pose === 'joie') s += meca ? heartIcon(2.6, y - 4, 0.8) : heartIcon(2.8, y - 4.9, 0.8);
  return `<g transform="translate(0 ${pose === 'repos' ? 1.2 : 1.6})">${s}</g>`;
}
// L'amie de Tic-Tac (acte IV, quand on écrit Abeille, Rivet la fabrique) : une abeille mécanique plus ronde, en cuivre
// rosé rayé de cuivre sombre, ailes de verre rosé, grand œil à cil, une antenne fleurie, clé de remontoir en cœur
function beeFriend(pose) {
  const flap = pose === 'vol2' ? 0.4 : pose === 'repos' ? 0.55 : 1;
  const y = pose === 'repos' ? -2.8 : -4.2;
  const glass = (d) => P(d, '#F6DDE6', 0.5).replace('fill=', 'fill-opacity="0.85" fill=');
  let s = '';
  s += `<g transform="translate(-0.6 ${y - 1.6}) scale(1 ${flap})">${glass('M0,0 Q-2.6,-4 0.2,-4.4 Q1.8,-2.6 0.6,0 Z')}${glass('M-0.6,0.2 Q-3.6,-2.2 -2.6,-3.4 Q-1,-2.8 -0.2,0 Z')}</g>`;
  // la clé de remontoir en cœur, sur le dos
  s += limb([-0.8, y - 2], [-1.4, y - 3.8], 0.5, '#C9A24A') + heartIcon(-1.6, y - 4.6, 0.75).replace('#F27A8A', '#E2C26A');
  // le corps rond, ses rayures, un reflet, deux rivets, la pointe de laiton
  s += E(0, y, 2.9, 2.4, '#D98B5F');
  s += clip(`amie${pose}`, `M-2.9,${y} a2.9,2.4 0 1,0 5.8,0 a2.9,2.4 0 1,0 -5.8,0 Z`, [-1.3, 0.4].map(x => `<rect x="${x}" y="${y - 3}" width="0.85" height="6" fill="#A85A3A"/>`).join('') + `<ellipse cx="-0.6" cy="${y - 1.3}" rx="1.4" ry="0.6" fill="#FFFFFF" fill-opacity="0.45"/>`);
  s += E(0, y, 2.9, 2.4, 'none') + E(-2, y + 0.8, 0.28, 0.28, '#F0D58A', 0) + E(1.2, y + 1.5, 0.28, 0.28, '#F0D58A', 0);
  s += P(`M-2.8,${r2(y + 0.2)} L-3.9,${r2(y + 0.6)} L-2.8,${r2(y + 1)} Z`, '#C9A24A', 0.5);
  // la tête, l'œil à cil (fermé de joie), la joue, les antennes (l'une fleurie)
  const hx = 2.7, hy = y - 0.7;
  s += stroke(`M${hx - 0.2},${r2(hy - 1.3)} Q${hx - 0.6},${r2(hy - 3)} ${hx - 1.6},${r2(hy - 3.2)}`, 0.35, OUT) + stroke(`M${hx + 0.4},${r2(hy - 1.3)} Q${hx + 1},${r2(hy - 2.8)} ${hx + 1.8},${r2(hy - 2.8)}`, 0.35, OUT);
  s += E(hx - 1.7, hy - 3.2, 0.4, 0.4, '#E2C26A', 0.3) + [0, 72, 144, 216, 288].map(a => E(hx + 1.8 + Math.cos(a * Math.PI / 180) * 0.55, hy - 2.8 + Math.sin(a * Math.PI / 180) * 0.55, 0.42, 0.42, '#F7C6D9', 0.25)).join('') + E(hx + 1.8, hy - 2.8, 0.25, 0.25, '#F2C94C', 0);
  s += E(hx, hy, 1.95, 1.8, '#EBB08A', 0.8) + E(hx - 0.6, hy - 0.75, 0.7, 0.42, '#F6CFB4', 0);
  s += eye(hx + 0.5, hy - 0.15, 0.72, pose === 'joie' ? 'joy' : 'open') + (pose === 'joie' ? '' : L([hx + 1.05, hy - 0.85], [hx + 1.5, hy - 1.25], OUT, 0.3));
  s += E(hx + 0.1, hy + 1, 0.6, 0.32, '#F7A8B0', 0);
  if (pose === 'joie') s += heartIcon(2.8, y - 4.6, 0.8);
  return `<g transform="translate(0 ${pose === 'repos' ? 1.2 : 1.6})">${s}</g>`;
}
// Hibou de face (comme le jeu) ; marche1/2 : tête penchée ; repos : endormi
function owl(pose) {
  const tilt = pose === 'marche1' ? -6 : pose === 'marche2' ? 6 : 0;
  const m = pose === 'clignement' || pose === 'repos' ? 'blink' : pose === 'joie' ? 'joy' : 'open';
  let s = limb([-5, -0.6], [5, -0.6], 0.9, '#7E5530');
  s += `<g transform="rotate(${tilt} 0 -8)">`;
  s += E(0, -7.2, 5.2, 6.4, '#A8784A') + E(0, -5.6, 3.4, 4, '#F2DEC0', 0);
  s += [-1.6, 0, 1.6].map(x => P(`M${x - 0.6},-5 L${x},-4.2 L${x + 0.6},-5`, 'none', 0.4)).join('') + [-1, 1].map(x => P(`M${x - 0.6},-3.4 L${x},-2.6 L${x + 0.6},-3.4`, 'none', 0.4)).join('');
  s += P('M-4.4,-11 L-4.8,-14.6 L-2.4,-12 Z', '#A8784A', 0.8) + P('M4.4,-11 L4.8,-14.6 L2.4,-12 Z', '#A8784A', 0.8);
  s += E(-2, -9.6, 2, 2, '#FFF4E0', 0.7) + E(2, -9.6, 2, 2, '#FFF4E0', 0.7) + eye(-2, -9.6, 1.2, m) + eye(2, -9.6, 1.2, m);
  s += P('M-0.6,-8.4 L0.6,-8.4 L0,-6.8 Z', '#F2B33B', 0.6) + `</g>`;
  s += E(-1.4, -0.8, 0.9, 0.5, '#F2B33B', 0.5) + E(1.4, -0.8, 0.9, 0.5, '#F2B33B', 0.5);
  if (pose === 'joie') s += heartIcon(4.6, -14, 0.9);
  return s;
}
// Koï vu de dessus ; v : orange | blanc | or ; pose : nage1 | nage2 | joie
function koi(v, pose) {
  const [base, spot] = { orange: ['#F08A3A', '#FFFFFF'], blanc: ['#FFFFFF', '#E8483C'], or: ['#F2C04B', '#FFF4C8'] }[v];
  const sw = pose === 'nage2' ? -1 : 1;
  let s = `<ellipse cx="0" cy="0" rx="11" ry="3.6" fill="#7FC4E8" fill-opacity="0.25"/>`;
  s += P(`M-6,0 Q${-9},${-2.8 * sw} ${-10.4},${-3 * sw} Q${-9.6},0 ${-10.4},${3 * sw} Q${-9},${2.8 * sw} -6,0 Z`.replace(/-?\d+\.?\d*e?-?\d*/g, n => r2(+n)), base, 0.8);
  s += P(`M-6.4,0 Q-4,${r2(-2.6 + sw * 0.3)} 1.6,-2.2 Q6.6,-1.4 7.4,0 Q6.6,1.4 1.6,2.2 Q-4,${r2(2.6 + sw * 0.3)} -6.4,0 Z`, base);
  s += E(-1, -0.6, 1.6, 1, spot, 0) + E(3.6, 0.6, 1.2, 0.8, spot, 0) + eye(5.4, -1, 0.58, 'open') + eye(5.4, 1, 0.58, 'open');
  s += P('M1.6,-2.1 Q0.4,-4.6 -1.4,-4.2 Q-0.4,-3 0,-2.2 Z', base, 0.6) + P('M1.6,2.1 Q0.4,4.6 -1.4,4.2 Q-0.4,3 0,2.2 Z', base, 0.6);
  if (pose === 'joie') s += E(9.4, -1.6, 0.7, 0.7, '#E8F6FF', 0.4) + E(11, -3.4, 0.45, 0.45, '#E8F6FF', 0.4) + heartIcon(10.6, 2.2, 0.8);
  return s;
}
// Poisson qui saute hors de l'eau ; v : sardine | dorade | volant ; n : 0 (sortie) | 1 (en l'air)
function fish(v, n) {
  const [col, colS, fin] = { sardine: ['#A8C4D8', '#6E8CA8', '#8AAAC4'], dorade: ['#F2C27A', '#E8906A', '#F29A8A'], volant: ['#7EAEE0', '#4A7AB8', '#BFE0FF'] }[v];
  const y = n ? -20 : -12, rot = n ? -10 : -40;
  let s = water(0, -0.6, 10) + (n ? '' : splash(-2, -1.4, 1.4));
  s += `<g transform="translate(0 ${y}) rotate(${rot})">`;
  if (v === 'volant') s += P('M0,-1 Q-2,-9 -5,-10 Q-3,-4 -2,0 Z', fin, 0.7) + P('M0,1 Q-2,8 -4.4,8.6 Q-2.6,3.6 -2,0.6 Z', fin, 0.7);
  s += P('M-6,0 L-10,-3.4 L-9.2,0 L-10,3.4 Z', colS, 0.8);
  s += E(0, 0, 6.6, v === 'dorade' ? 3.8 : 2.6, col);
  s += P(`M-5.4,0.8 Q0,${v === 'dorade' ? 3.6 : 2.4} 5.4,0.8`, 'none', 0).replace('stroke="none"', `stroke="${colS}" stroke-width="1"`);
  s += P('M-1,-2.4 L1,-4 L2.2,-2 Z', fin, 0.6) + eye(3.8, -0.5, 1.05, 'open') + E(3.4, 0.9, 0.8, 0.4, '#F7A8B0', 0);
  s += '</g>';
  return s;
}
// Dauphin : n 0 (jaillit), 1 (au sommet), 2 (replonge)
function dolphin(n) {
  const pos = [[-8, -10, -35], [0, -16.2, 0], [8, -10, 35]][n];
  let s = water(0, -0.6, 22) + (n !== 1 ? splash(n ? 12 : -12, -1.4, 1.6) : '');
  s += `<g transform="translate(${pos[0]} ${pos[1]}) rotate(${pos[2]})">`;
  s += P('M-11,0 L-17,-4 L-15.6,0 L-17,4 Z', '#5A8AC0', 0.9);
  s += P('M-12,0 Q-8,-6.6 2,-6 Q10,-5.4 13,-1.6 L16.6,-0.6 Q15.6,1 13,1.2 Q8,5.2 -2,4.8 Q-9,4 -12,0 Z', '#7EAEE0');
  s += clip(`dol${n}`, 'M-12,0 Q-8,-6.6 2,-6 Q10,-5.4 13,-1.6 L16.6,-0.6 Q15.6,1 13,1.2 Q8,5.2 -2,4.8 Q-9,4 -12,0 Z', '<ellipse cx="2" cy="4.4" rx="12" ry="3" fill="#E8F2FA"/>');
  s += P('M-1,-5.8 L-4,-10.4 L3,-5.8 Z', '#5A8AC0', 0.9) + P('M1,2.6 L-2,6.4 L4,3.4 Z', '#5A8AC0', 0.8);
  s += eye(8.8, -2, 1.3, 'open') + P('M11.4,0.6 Q13,1.4 14.6,0.6', 'none', 0.6) + E(8.1, 0.5, 1.1, 0.55, '#F7A8B0', 0);
  s += '</g>';
  return s;
}
// Baleine : le dos qui affleure et souffle (n : jet petit / grand) ; la queue qui plonge (n : haute / qui s'enfonce)
function whaleBack(n) {
  let s = `<ellipse cx="0" cy="-1" rx="56" ry="4" fill="#5E8EC0" fill-opacity="0.25"/>`;
  s += P('M-52,0 Q-30,-11.4 0,-12.4 Q34,-11.4 54,0 Z', '#4A6E9E') + clip(`wb${n}`, 'M-52,0 Q-30,-11.4 0,-12.4 Q34,-11.4 54,0 Z', '<ellipse cx="-6" cy="-10.8" rx="40" ry="3.4" fill="#6A8EBE"/>' + [-20, -6, 10].map(x => `<ellipse cx="${x}" cy="-6.4" rx="2" ry="1.2" fill="#3A5A86"/>`).join(''));
  s += eye(30, -5.4, 1.6, 'open') + E(28.6, -2.8, 1.7, 0.8, '#F7A8B0', 0) + P('M34,-3.6 Q38,-2.4 42,-3.6', 'none', 0.7);
  s += water(-40, -0.4, 10) + water(40, -0.4, 10);
  const h = n ? 7.4 : 5;
  s += [-3, 0, 3].map((dx, i) => thick(`M${16 + dx * 0.3},-11.6 Q${16 + dx},${r2(-11.6 - h * 0.6)} ${16 + dx * 2.2},${r2(-11.6 - h + i % 2)}`, 1.4, '#E8F6FF')).join('') + E(16, -11.6 - h, 3, 1.6, '#E8F6FF', 0.7);
  return s;
}
function whaleFluke(n) {
  const y = n ? -8 : -18;
  let s = `<ellipse cx="0" cy="-1" rx="28" ry="3.4" fill="#5E8EC0" fill-opacity="0.25"/>` + water(0, -0.6, 22);
  s += P(`M-3,0 Q-2,${y + 8} 0,${y + 4} Q2,${y + 8} 3,0 Z`, '#4A6E9E', 0.9);
  s += P(`M0,${y + 5} Q-10,${y + 5} -19,${y - 6} Q-17,${y - 7} -14,${y - 5} Q-9,${y - 2} -5,${y - 1} Q-2,${y - 1} 0,${y + 1} Q2,${y - 1} 5,${y - 1} Q9,${y - 2} 14,${y - 5} Q17,${y - 7} 19,${y - 6} Q10,${y + 5} 0,${y + 5} Z`, '#4A6E9E')
    + P(`M-15,${y - 4} Q-9,${y} -3,${y + 1}`, 'none', 0).replace('stroke="none"', 'stroke="#6A8EBE" stroke-width="1" stroke-linecap="round"');
  s += [-14, -6, 6, 14].map((x, i) => E(x, y + 2 + (i % 2) * 2, 0.6, 1, '#BFE6FF', 0.4)).join('') + splash(0, -1.2, 1.6);
  return s;
}
// Bocal de Bulle : vide, ou avec le poisson rouge (2 images)
function bowl(v, n) {
  let s = P('M-4.6,-10.4 L4.6,-10.4 L4.2,-9.4 Q7.4,-6.6 6.4,-3 Q5.2,0 0,0 Q-5.2,0 -6.4,-3 Q-7.4,-6.6 -4.2,-9.4 Z', '#E6F4FA', 0.9).replace('fill=', 'fill-opacity="0.75" fill=');
  s += P('M-6.2,-5.6 Q0,-4.6 6.2,-5.6 Q6.4,-3.6 5.6,-2.4 Q3.8,-0.6 0,-0.6 Q-3.8,-0.6 -5.6,-2.4 Q-6.4,-3.6 -6.2,-5.6 Z', '#9ED4F0', 0).replace('fill=', 'fill-opacity="0.7" fill=');
  if (v === 'bulle') {
    const x = n ? 1 : -1;
    // Bulle (familier) : un petit poisson tout rond, un grand œil à reflets, une joue, une nageoire
    s += `<g transform="translate(${x} -3.2) scale(${n ? -1 : 1} 1)">${P('M-1.9,0 L-3.7,-1.4 L-3.2,0 L-3.7,1.4 Z', '#F08A3A', 0.5)}${E(0, 0, 2.3, 1.8, '#F6A04A', 0.6)}`
      + `${E(-0.4, -0.7, 1, 0.45, '#FFC78A', 0)}${P('M-0.6,0.4 Q0.2,1.6 0.9,0.6 Z', '#F08A3A', 0.4)}${eye(1.05, -0.35, 0.62, 'open')}${E(0.75, 0.55, 0.45, 0.22, '#F7A8B0', 0)}</g>` + E(2.6, -7 - n, 0.5, 0.5, '#FFFFFF', 0.4);
  }
  s += `<path d="M-4.4,-8.6 Q-5.6,-6 -4.8,-3.6" fill="none" stroke="#FFFFFF" stroke-width="0.8" stroke-linecap="round" opacity="0.9"/>`;
  return s;
}
// Méduse qui luit (n : contractée / déployée)
function jelly(n) {
  const k = n ? 1 : 0.9;
  let s = glowDot(0, -8, 7.6, '210,180,255', 0.45);
  s += [-3, -1, 1, 3].map((x, i) => stroke(`M${x},-7 Q${x + (i % 2 ? 1.4 : -1.4) * (n ? 1 : -1)},-3 ${x},${n ? 0 : -1.6}`, 0.7, '#C8A8F0')).join('');
  s += `<g transform="translate(0 -8) scale(${n ? 1 : 1.1} ${k})">${P('M-5.4,1 Q-5.4,-6 0,-6.2 Q5.4,-6 5.4,1 Q2.8,0 0,1 Q-2.8,0 -5.4,1 Z', '#E6D4FF')}${E(-1.6, -3.4, 1.4, 0.9, '#FFFFFF', 0).replace('fill=', 'fill-opacity="0.6" fill=')}${eye(-1.8, -1.6, 0.7, 'open')}${eye(1.8, -1.6, 0.7, 'open')}${E(0, -0.4, 0.6, 0.35, '#F7A8B0', 0)}</g>`;
  return s;
}

Object.assign(module.exports, { butterfly, firefly, bee, beeFriend, owl, koi, fish, dolphin, whaleBack, whaleFluke, bowl, jelly });
