// Les bêtes de l'île au trait de la troupe : de profil, tournées vers la droite (le miroir donne la gauche), comme
// src/world/animals.js. Cadres du jeu (SMALL, MID, TALL…) à l'échelle de la troupe (× 1,25), ancre (0, 0) au sol sous
// l'animal. Images : marche 1 et 2, repos, clignement, joie.
const { OUT, P, E, L, clip, r2 } = require('./troupe');

const K = 1.25; // échelle troupe / jeu
const box = (x, y, w, h) => [x * K, y * K, w * K, h * K];
const BOX = { SMALL: box(-12, -18, 24, 20), MID: box(-16, -24, 32, 26), TALL: box(-16, -34, 32, 36), BIG: box(-24, -46, 48, 48) };

const EYE = '#2A2420';
const heartIcon = (x, y, s = 1.4) => P(`M${r2(x)},${r2(y + s * 1.1)} C${r2(x - s * 1.8)},${r2(y - s * 0.1)} ${r2(x - s * 0.9)},${r2(y - s * 1.4)} ${r2(x)},${r2(y - s * 0.5)} C${r2(x + s * 0.9)},${r2(y - s * 1.4)} ${r2(x + s * 1.8)},${r2(y - s * 0.1)} ${r2(x)},${r2(y + s * 1.1)} Z`, '#F27A8A', 0.6);
const line = (a, b, w, color) => `<path d="M${r2(a[0])},${r2(a[1])} L${r2(b[0])},${r2(b[1])}" stroke="${color}" stroke-width="${r2(w)}" stroke-linecap="round"/>`;
const limb = (a, b, w, fill) => line(a, b, w + 2.2, OUT) + line(a, b, w, fill);
const stroke = (d, w, color) => `<path d="${d}" fill="none" stroke="${color}" stroke-width="${r2(w)}" stroke-linecap="round" stroke-linejoin="round"/>`;
const thick = (d, w, fill) => stroke(d, w + 2.2, OUT) + stroke(d, w, fill);

// Œil de bête : ovale sombre + reflet ; fermé (arc) ; joie (arc vers le haut)
function eye(x, y, r, mode) {
  if (mode === 'blink') return P(`M${r2(x - r)},${r2(y)} Q${x},${r2(y + r * 0.9)} ${r2(x + r)},${r2(y)}`, 'none', 0.8);
  if (mode === 'joy') return P(`M${r2(x - r)},${r2(y + r * 0.4)} Q${x},${r2(y - r * 0.9)} ${r2(x + r)},${r2(y + r * 0.4)}`, 'none', 0.9);
  return E(x, y, r * 0.8, r, EYE, 0) + E(x + r * 0.3, y - r * 0.4, r * 0.32, r * 0.32, '#FFFFFF', 0);
}

// ——— Quadrupèdes ———
// cfg : body [cx, cy, rx, ry], head [hx, hy, r], legs { back, front, top, w, len?, paw, hoof }, snout, nose, eye [dx, dy, r],
// ears { kind, ... }, tail { kind, ... }, colors fur, furS, belly ; parts { back(c), body(c), head(c) } pour les pièces propres
function quad(c, pose) {
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
  const leg = (x, dx, near) => {
    if (rest) return '';
    const foot = [x + dx, -(lg.paw ? 0.9 : 0.6)];
    return limb([x, top], foot, lg.w, near ? (lg.color || c.fur) : (lg.colorS || c.furS)) + (lg.hoof ? E(foot[0], foot[1] + 0.2, lg.w * 0.62, 0.9, lg.hoof, 0.8) : lg.paw ? E(foot[0] + 0.4, foot[1] + 0.2, lg.w * 0.7, 0.9, lg.paw, 0.8) : '');
  };
  s += leg(lg.back + 1.4, -a, false) + leg(lg.front + 1.4, a, false);
  s += c.parts?.back ? c.parts.back(ctx) : '';
  s += tail(c, ctx);
  // corps, ventre, ombre du bas
  const bd = `M${r2(bx - brx)},${r2(by)} a${brx},${bry} 0 1,0 ${2 * brx},0 a${brx},${bry} 0 1,0 ${-2 * brx},0 Z`;
  s += P(bd, c.fur) + clip(`q${c.id}${pose}b`, bd, `<ellipse cx="${bx}" cy="${r2(by + bry * 0.95)}" rx="${r2(brx * 0.9)}" ry="${r2(bry * 0.45)}" fill="${c.belly || c.furS}"/>`
    + (c.parts?.coat ? c.parts.coat(ctx) : '') + `<path d="M${r2(bx - brx * 0.6)},${r2(by - bry * 0.62)} Q${bx},${r2(by - bry * 0.95)} ${r2(bx + brx * 0.4)},${r2(by - bry * 0.7)}" fill="none" stroke="#FFFFFF" stroke-width="0.9" stroke-linecap="round" opacity="0.5"/>`) + P(bd, 'none');
  // pattes proches ; au repos, pattes repliées
  if (rest) s += E(bx - brx * 0.55, -0.9, lg.w * 0.9, 1, lg.color || c.fur, 0.9) + E(bx + brx * 0.6, -0.9, lg.w * 0.9, 1, lg.color || c.fur, 0.9);
  else s += leg(lg.back, a, true) + leg(lg.front, -a, true);
  s += c.parts?.body ? c.parts.body(ctx) : '';
  s += headQuad(c, ctx);
  if (pose === 'joie') s += heartIcon(hx + hr * 0.2, hy - hr * 2 - 1.4);
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
    case 'curly': return stroke(`M${x + 0.6},${y} q-2.2,-0.6 -2,-2.2 q0.4,-1.6 1.6,-0.8 q0.8,1 -0.6,1.8`, 2.4, OUT) + stroke(`M${x + 0.6},${y} q-2.2,-0.6 -2,-2.2 q0.4,-1.6 1.6,-0.8 q0.8,1 -0.6,1.8`, 0.9, c.fur);
    case 'short': return P(`M${x + 0.6},${y - 0.6} L${r2(x - 2.2)},${r2(y - 3 + w * 0.5)} L${r2(x + 0.4)},${r2(y + 1)} Z`, t.color || c.fur, 0.9);
    case 'bushy': {
      const L0 = t.len || 9, up = t.up ?? 0.4;
      const tip = [x - L0, y - L0 * up + w];
      const d = `M${r2(x + 1)},${r2(y - 1.4)} Q${r2(x - L0 * 0.5)},${r2(y - L0 * up - 3.6 + w)} ${r2(tip[0])},${r2(tip[1])} Q${r2(x - L0 * 0.4)},${r2(y + 2.6 + w * 0.5)} ${r2(x + 1)},${r2(y + 1.6)} Z`;
      return P(d, c.fur) + clip(`t${c.id}${ph}${walk}`, d, `<circle cx="${r2(tip[0])}" cy="${r2(tip[1])}" r="${r2(L0 * 0.32)}" fill="${t.tip || c.belly}"/>`) + P(d, 'none');
    }
    case 'horse': return thick(`M${x},${y - 1} Q${r2(x - 3)},${r2(y + 1)} ${r2(x - 2.4 + w)},${r2(y + 8)}`, 2.2, t.color) + stroke(`M${r2(x - 1)},${r2(y + 1)} Q${r2(x - 2.6)},${r2(y + 4)} ${r2(x - 2.4 + w)},${r2(y + 7)}`, 0.5, OUT);
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
  let s = '';
  // oreille éloignée
  s += ear(c, e, hx, hy, hr, true);
  s += c.parts?.neck ? c.parts.neck(ctx) : '';
  s += c.parts?.behindHead ? c.parts.behindHead(ctx) : '';
  s += E(hx, hy, hr * (c.headW || 1), hr, c.headC || c.fur);
  s += c.parts?.face ? c.parts.face(ctx) : '';
  if (c.snout) { const [dx, dy, rx, ry, col] = c.snout; s += E(hx + dx, hy + dy, rx, ry, col || c.belly, 0.9); }
  if (c.nose) { const [dx, dy, r, col] = c.nose; s += E(hx + dx, hy + dy, r * 1.1, r * 0.85, col || OUT, 0.6); }
  const [edx, edy, er] = c.eye;
  s += eye(hx + edx, hy + edy, er, mode);
  if (c.blush !== false) s += E(hx + edx - er * 0.4, hy + edy + er * 1.5, er * 0.9, er * 0.45, '#F7A8B0', 0);
  s += ear(c, e, hx, hy, hr, false);
  s += c.parts?.head ? c.parts.head(ctx) : '';
  return s;
}

// Oreilles ; far : celle de derrière (décalée, plus sombre)
function ear(c, e, hx, hy, hr, far) {
  const col = far ? (c.headCS || c.furS) : (c.headC || c.fur), inner = e.inner || '#F2C6C0';
  const o = far ? -hr * 0.5 : 0;
  const k = e.size || 1;
  switch (e.kind) {
    case 'pointy': {
      const x = hx - hr * 0.2 + o, y = hy - hr * 0.75;
      return P(`M${r2(x - hr * 0.42 * k)},${r2(y + 0.4)} L${r2(x + hr * 0.05)},${r2(y - hr * 1.05 * k)} L${r2(x + hr * 0.5 * k)},${r2(y + 0.2)} Z`, col, 0.9)
        + (far ? '' : P(`M${r2(x - hr * 0.2 * k)},${r2(y)} L${r2(x + hr * 0.05)},${r2(y - hr * 0.7 * k)} L${r2(x + hr * 0.28 * k)},${r2(y)} Z`, inner, 0));
    }
    case 'round': return E(hx - hr * 0.35 + o, hy - hr * 0.85, hr * 0.38 * k, hr * 0.38 * k, col, 0.9) + (far ? '' : E(hx - hr * 0.35, hy - hr * 0.85, hr * 0.2 * k, hr * 0.2 * k, inner, 0));
    case 'side': {
      const x = hx - hr * 0.55 + o * 0.4, y = hy - hr * 0.45;
      return `<g transform="rotate(${far ? -25 : -10} ${r2(x)} ${r2(y)})">${P(`M${r2(x)},${r2(y)} Q${r2(x - hr * 0.9 * k)},${r2(y - hr * 0.55)} ${r2(x - hr * 1.3 * k)},${r2(y)} Q${r2(x - hr * 0.8 * k)},${r2(y + hr * 0.4)} ${r2(x)},${r2(y + hr * 0.25)} Z`, col, 0.9)}${far ? '' : E(x - hr * 0.75 * k, y, hr * 0.32 * k, hr * 0.14, inner, 0)}</g>`;
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
  return {
    id: 'cow' + (v || ''), size: 'MID', fur: '#FFFFFF', furS: '#E2DED6', belly: '#F2EEE6',
    body: [-1.6, -11.6, 11.2, 7], head: [10.6, -16.2, 5.4], headW: 1.02,
    legs: { back: -8.4, front: 5.4, top: -8, w: 2.6, hoof: '#5A5250' },
    snout: [3.6, 2, 3.4, 2.6, '#F6BDB6'], nose: [5.2, 1.4, 0.55, '#C77A74'], eye: [1.2, -1, 1.1],
    ears: { kind: 'side', size: 0.9 }, tail: { kind: 'tuft', color: patch },
    parts: {
      coat: ({ bx, by }) => spots([[bx - 4, by - 2.4, 3.6, 2.6], [bx + 4, by + 0.6, 2.8, 2.2], [bx - 7.6, by + 1.6, 1.8, 1.6]], patch),
      face: ({ hx, hy, hr }) => E(hx - 1.6, hy - 2.6, 2.2, 1.6, patch, 0),
      head: ({ hx, hy, hr }) => horn(`M${r2(hx - 1.6)},${r2(hy - hr * 0.85)} Q${r2(hx - 2.2)},${r2(hy - hr - 2)} ${r2(hx - 0.6)},${r2(hy - hr - 2.6)}`),
      body: ({ bx, by, rest }) => rest ? '' : E(bx + 2.6, by + 6.6, 1.8, 1.1, '#F6BDB6', 0.7)
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
    body: [-1, -11, 8.4, 5.4], head: [9.4, -14.4, 4.2],
    legs: { back: -6.4, front: 4.4, top: -7, w: 1.9, hoof: '#2E2A2E', color: face, colorS: v === 'noir' ? '#1E1A1E' : '#463F48' },
    snout: [2.6, 1.4, 2.2, 1.6, face], nose: [3.8, 0.8, 0.4, '#1E1A1E'], eye: [0.9, -0.6, 1],
    ears: { kind: 'side', size: 0.8, inner: '#8A7A80' }, tail: { kind: 'puff', color: wool, r: 2 },
    parts: {
      body: ({ bx, by }) => puffs(bx, by, 8, 5.2),
      head: ({ hx, hy, hr }) => E(hx - 1.2, hy - hr * 0.78, 2.4, 1.8, wool, 0.9) + E(hx + 0.6, hy - hr * 0.95, 1.6, 1.3, wool, 0.9)
    }
  };
};
Q.pig = (v) => ({
  id: 'pig' + (v || ''), size: 'MID', fur: '#F6BCBC', furS: '#E39C9E', belly: '#FAD2D0',
  body: [-1, -9.6, 9.6, 6.6], head: [8.6, -12.4, 5],
  legs: { back: -6, front: 4.6, top: -5, w: 2.2, hoof: '#C77A7C' },
  snout: [4.6, 1, 1.8, 2, '#F29EA0'], eye: [1.2, -1.2, 1], blush: true,
  ears: { kind: 'flop', size: 1.1 }, tail: { kind: 'curly' },
  parts: {
    coat: ({ bx, by }) => v === 'tachete' ? spots([[bx - 3, by - 2, 2.8, 2.2], [bx + 4, by + 0.4, 2, 1.8], [bx - 6.6, by + 1.6, 1.4, 1.2]], '#8A5A5A') : '',
    face: ({ hx, hy }) => v === 'tachete' ? E(hx - 2, hy - 1.6, 1.6, 1.3, '#8A5A5A', 0) : '',
    head: ({ hx, hy }) => E(hx + 4.2, hy + 0.4, 0.35, 0.55, '#B8686A', 0) + E(hx + 5.1, hy + 0.4, 0.35, 0.55, '#B8686A', 0)
  }
});
Q.goat = (v) => {
  const fur = v === 'brune' ? '#9A6A44' : '#F4F0E8', furS = v === 'brune' ? '#7A5232' : '#D8D2C6';
  return {
    id: 'goat' + (v || ''), size: 'MID', fur, furS, belly: v === 'brune' ? '#C49A72' : '#FFFFFF',
    body: [-1.4, -12, 9, 5.8], head: [9.2, -17, 4.4],
    legs: { back: -7, front: 4.6, top: -8.6, w: 1.8, hoof: '#4A3C34' },
    snout: [2.8, 1.6, 2.4, 1.9, v === 'brune' ? '#B48660' : '#EDE6DA'], nose: [4.4, 1, 0.45, '#4A3C34'], eye: [0.8, -0.8, 1],
    ears: { kind: 'side', size: 0.8 }, tail: { kind: 'short' },
    parts: {
      neck: ({ hx, hy, bx, by }) => P(`M${r2(bx + 5.4)},${r2(by - 3.6)} L${r2(hx - 2.6)},${r2(hy - 1)} L${r2(hx + 0.6)},${r2(hy + 3.4)} L${r2(bx + 8.4)},${r2(by + 1)} Z`, fur, 0.9),
      head: ({ hx, hy, hr }) => thick(`M${r2(hx - 1)},${r2(hy - hr * 0.8)} Q${r2(hx - 2.6)},${r2(hy - hr - 2.6)} ${r2(hx - 4.6)},${r2(hy - hr - 1.4)}`, 1.1, '#B8A88C')
        + P(`M${r2(hx + 2)},${r2(hy + 3.2)} L${r2(hx + 1.2)},${r2(hy + 6)} L${r2(hx + 3.2)},${r2(hy + 3.4)} Z`, furS, 0.7)
    }
  };
};
Q.deer = () => ({
  id: 'deer', size: 'TALL', fur: '#C98A50', furS: '#A86E3A', belly: '#F2DEC0',
  body: [-1.6, -17, 9.4, 6], head: [9.6, -28, 4.6],
  legs: { back: -7.4, front: 4.8, top: -13, w: 1.6, hoof: '#4A3C34' },
  snout: [3, 1.6, 2.4, 1.8, '#E8C9A0'], nose: [4.6, 1, 0.5, OUT], eye: [0.8, -0.8, 1.1],
  ears: { kind: 'side', size: 1 }, tail: { kind: 'puff', color: '#FFFFFF', r: 1.6 },
  parts: {
    coat: ({ bx, by }) => spots([[bx - 4, by - 3.4, 0.8, 0.6], [bx - 1, by - 4, 0.8, 0.6], [bx + 2, by - 3.6, 0.8, 0.6], [bx - 2.6, by - 1.8, 0.7, 0.5], [bx + 0.6, by - 2, 0.7, 0.5]], '#FFF4E0'),
    neck: ({ hx, hy, bx, by }) => P(`M${r2(bx + 5)},${r2(by - 4)} L${r2(hx - 2.8)},${r2(hy - 0.4)} L${r2(hx + 0.6)},${r2(hy + 3.6)} L${r2(bx + 8.6)},${r2(by + 1)} Z`, '#C98A50', 0.9),
    head: ({ hx, hy, hr }) => thick(`M${r2(hx - 1.4)},${r2(hy - hr * 0.85)} Q${r2(hx - 2.6)},${r2(hy - hr - 3)} ${r2(hx - 1.4)},${r2(hy - hr - 5.6)} M${r2(hx - 2.2)},${r2(hy - hr - 2.6)} L${r2(hx - 4.6)},${r2(hy - hr - 3.8)}`, 0.9, '#E6D2A8')
  }
});
Q.fox = () => ({
  id: 'fox', size: 'MID', fur: '#E8803A', furS: '#C8642A', belly: '#FFF4E6',
  body: [-1, -9.4, 8.6, 5], head: [8.4, -13, 4.6],
  legs: { back: -5.6, front: 4.6, top: -6, w: 1.6, paw: '#3A2A24' },
  snout: [3, 1.6, 2.6, 1.6, '#FFF4E6'], nose: [5.2, 0.9, 0.55, OUT], eye: [1, -1, 1],
  ears: { kind: 'pointy', size: 1.1, inner: '#3A2A24' }, tail: { kind: 'bushy', len: 10, up: 0.3, tip: '#FFFFFF' },
  parts: { face: ({ hx, hy }) => E(hx + 1.4, hy + 1.6, 2.6, 2, '#FFF4E6', 0) }
});
Q.kit = () => ({ ...Q.fox(), id: 'kit', size: 'SMALL', body: [-0.6, -6.4, 5.4, 3.4], head: [5.6, -9.6, 3.9], legs: { back: -3.4, front: 2.8, top: -4, w: 1.3, paw: '#3A2A24' }, snout: [2.4, 1.4, 2, 1.3, '#FFF4E6'], nose: [4.2, 0.8, 0.45, OUT], eye: [0.9, -0.6, 0.95], tail: { kind: 'bushy', len: 7, up: 0.5, tip: '#FFFFFF' } });
Q.snowFox = () => ({ ...Q.fox(), id: 'snowFox', fur: '#F6F8FC', furS: '#C9D4E2', belly: '#FFFFFF', ears: { kind: 'round', size: 1, inner: '#C9D4E2' }, tail: { kind: 'bushy', len: 10, up: 0.4, tip: '#DCE6F2' }, nose: [5.2, 0.9, 0.55, '#3A3A48'], parts: {} });
Q.fennec = () => ({ ...Q.fox(), id: 'fennec', size: 'SMALL', fur: '#EDCB94', furS: '#CFA870', belly: '#FFF6E6', body: [-0.6, -6.4, 5.6, 3.4], head: [5.8, -9.6, 3.8], legs: { back: -3.4, front: 3, top: -4, w: 1.2, paw: '#CFA870' }, snout: [2.4, 1.3, 2, 1.2, '#FFF6E6'], nose: [4.2, 0.8, 0.45, OUT], eye: [0.9, -0.6, 0.95], ears: { kind: 'pointy', size: 1.9, inner: '#F2C6C0' }, tail: { kind: 'bushy', len: 7, up: 0.3, tip: '#5A4232' }, parts: {} });
Q.rabbit = () => ({
  id: 'rabbit', size: 'SMALL', fur: '#D8C4AE', furS: '#B8A288', belly: '#FFFFFF',
  body: [-0.6, -5.6, 5.6, 4.2], head: [4.6, -9, 3.8], restDrop: 0.8,
  legs: { back: -2.6, front: 2.6, top: -2.4, w: 1.8, paw: '#FFFFFF' },
  snout: [2.4, 1.2, 1.5, 1.2, '#FFFFFF'], nose: [3.6, 0.4, 0.4, '#E88A90'], eye: [1, -0.8, 1],
  ears: { kind: 'long', size: 1 }, tail: { kind: 'puff', color: '#FFFFFF', r: 1.6 }
});
Q.hedgehog = () => ({
  id: 'hedgehog', size: 'SMALL', fur: '#E8D2B0', furS: '#C8B08C', belly: '#F4E6CC',
  body: [-0.6, -4.4, 6, 3.6], head: [4.8, -4.6, 2.8], restDrop: 0.6,
  legs: { back: -3, front: 2.4, top: -1.6, w: 1.2, paw: '#5A4232' },
  snout: [2.2, 0.8, 1.8, 1.1, '#E8D2B0'], nose: [3.8, 0.5, 0.5, OUT], eye: [0.6, -0.6, 0.85],
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
  body: [-0.4, -6, 4.4, 3.8], head: [3.6, -10.4, 3.6], restDrop: 0.4,
  legs: { back: -2, front: 2.2, top: -2.6, w: 1.3, paw: '#A84E22' },
  snout: [2, 1.2, 1.5, 1.1, '#F6E2C8'], nose: [3.2, 0.6, 0.38, OUT], eye: [0.8, -0.7, 0.95],
  ears: { kind: 'pointy', size: 0.9, inner: '#F2C6C0' }, tail: { kind: 'bushy', len: 7.6, up: 1.55, tip: '#E07E44' },
  parts: { head: ({ hx, hy, hr, rest }) => rest ? E(hx + 1.6, hy + 4.6, 1.3, 1.5, '#A8743F', 0.7) + E(hx + 1.6, hy + 3.4, 1.4, 0.7, '#7E5530', 0.6) : '' }
});
Q.ibex = () => ({
  id: 'ibex', size: 'TALL', fur: '#A8906E', furS: '#86704F', belly: '#E8DCC4',
  body: [-1.4, -16, 9.6, 6.4], head: [9.6, -24, 4.6],
  legs: { back: -7.4, front: 5, top: -11.6, w: 2, hoof: '#3E3430' },
  snout: [2.8, 1.6, 2.4, 1.9, '#C8B496'], nose: [4.4, 1, 0.45, OUT], eye: [0.8, -0.8, 1],
  ears: { kind: 'side', size: 0.7 }, tail: { kind: 'short', color: '#5A4A3A' },
  parts: {
    neck: ({ hx, hy, bx, by }) => P(`M${r2(bx + 5.4)},${r2(by - 4)} L${r2(hx - 2.8)},${r2(hy - 0.6)} L${r2(hx + 0.6)},${r2(hy + 3.6)} L${r2(bx + 8.8)},${r2(by + 1.2)} Z`, '#A8906E', 0.9),
    head: ({ hx, hy, hr }) => {
      const d = `M${r2(hx - 0.6)},${r2(hy - hr * 0.8)} Q${r2(hx - 2)},${r2(hy - hr - 6)} ${r2(hx - 7.6)},${r2(hy - hr - 6.4)} Q${r2(hx - 11.4)},${r2(hy - hr - 5.4)} ${r2(hx - 10.6)},${r2(hy - hr - 1.6)}`;
      return thick(d, 2, '#C8B48E') + [0.25, 0.45, 0.65].map(t => E(hx - 2 - t * 8, hy - hr - 5.2 - Math.sin(t * Math.PI) * 1.2, 1.2, 0.35, '#8A7656', 0)).join('')
        + P(`M${r2(hx + 2)},${r2(hy + 3.2)} L${r2(hx + 0.8)},${r2(hy + 6.4)} L${r2(hx + 3.2)},${r2(hy + 3.6)} Z`, '#5A4A3A', 0.7);
    }
  }
});
Q.pony = () => ({
  id: 'pony', size: 'TALL', fur: '#C07A44', furS: '#9E5E30', belly: '#E0B08A',
  body: [-1.4, -15, 10, 6.6], head: [9.8, -23.4, 5.2], headW: 1.05,
  legs: { back: -7.6, front: 5.2, top: -10.4, w: 2.4, hoof: '#3E3430' },
  snout: [3.4, 2.2, 3, 2.4, '#E8C9A8'], nose: [5.4, 1.6, 0.45, OUT], eye: [0.6, -1, 1.2],
  ears: { kind: 'pointy', size: 0.75, inner: '#E8B0A0' }, tail: { kind: 'horse', color: '#F2D28A' },
  parts: {
    neck: ({ hx, hy, bx, by }) => P(`M${r2(bx + 5)},${r2(by - 4.4)} L${r2(hx - 3.4)},${r2(hy - 1)} L${r2(hx + 0.6)},${r2(hy + 4.2)} L${r2(bx + 9.4)},${r2(by + 1.4)} Z`, '#C07A44', 0.9),
    head: ({ hx, hy, hr, bx, by }) => thick(`M${r2(hx - 1)},${r2(hy - hr * 0.9)} Q${r2(hx - 6)},${r2(hy - 2)} ${r2(bx + 4.6)},${r2(by - 5.2)}`, 2.6, '#F2D28A') + P(`M${r2(hx - 0.4)},${r2(hy - hr * 0.95)} Q${r2(hx + 2.6)},${r2(hy - hr * 0.7)} ${r2(hx + 2)},${r2(hy - 1.4)} Q${r2(hx)},${r2(hy - 2.4)} ${r2(hx - 2)},${r2(hy - hr * 0.5)} Z`, '#F2D28A', 0.8)
  }
});
Q.camel = () => ({
  id: 'camel', size: 'TALL', fur: '#D8AE70', furS: '#B88E52', belly: '#EBCB98',
  body: [-1.6, -17.4, 9.4, 6], head: [11.4, -27, 3.8], headW: 1.25,
  legs: { back: -7.4, front: 4.8, top: -13, w: 1.8, hoof: '#8A6A44' },
  snout: [3.6, 1, 2.2, 1.8, '#E8C48E'], nose: [5.2, 0.4, 0.4, OUT], eye: [0.6, -0.8, 0.95],
  ears: { kind: 'round', size: 0.6 }, tail: { kind: 'tuft', color: '#8A6A44' },
  parts: {
    back: ({ bx, by }) => E(bx - 0.6, by - 5.6, 5, 4.4, '#D8AE70'),
    neck: ({ hx, hy, bx, by }) => thick(`M${r2(bx + 6.4)},${r2(by - 1)} Q${r2(bx + 11)},${r2(by - 2)} ${r2(hx - 1.6)},${r2(hy + 1.6)}`, 3, '#D8AE70')
  }
});
Q.chameleon = () => ({
  id: 'chameleon', size: 'SMALL', fur: '#7CC46A', furS: '#5AA04C', belly: '#C8EE9A',
  body: [-0.6, -6, 5.4, 3.2], head: [5.2, -6.8, 3], headW: 1.2, restDrop: 0.4, headDrop: 0.6,
  legs: { back: -2.8, front: 2.6, top: -3.4, w: 1.1, paw: '#5AA04C' },
  eye: [0.6, -0.4, 1.1], blush: false, ears: {}, tail: { kind: 'spiral' },
  parts: {
    coat: ({ bx, by }) => [-3, -0.4, 2.2].map(x => `<path d="M${r2(bx + x)},${r2(by - 3)} L${r2(bx + x + 0.8)},${r2(by + 2)}" stroke="#F2C94C" stroke-width="0.8"/>`).join(''),
    behindHead: ({ hx, hy }) => P(`M${r2(hx - 2.6)},${r2(hy - 1.6)} L${r2(hx - 1.4)},${r2(hy - 4.4)} L${r2(hx + 1)},${r2(hy - 2.4)} Z`, '#7CC46A', 0.8),
    face: ({ hx, hy, mode }) => E(hx + 0.6, hy - 0.4, 1.8, 1.8, '#5AA04C', 0.7) + P(`M${r2(hx + 1.8)},${r2(hy + 1.2)} Q${r2(hx + 3)},${r2(hy + 1.4)} ${r2(hx + 3.6)},${r2(hy + 0.6)}`, 'none', 0.5)
  }
});
Q.salamander = () => ({
  id: 'salamander', size: 'SMALL', fur: '#E8584A', furS: '#B83E34', belly: '#F6A060',
  body: [-0.6, -3.2, 5.6, 2.2], head: [5.2, -3.6, 2.6], headW: 1.15, restDrop: 0.4, headDrop: 0.5,
  legs: { back: -3, front: 2.6, top: -1.6, w: 1, paw: '#B83E34' },
  eye: [0.6, -0.8, 0.85], ears: {}, tail: { kind: 'lizard', w: 1.6 },
  parts: { coat: ({ bx, by }) => spots([[bx - 3, by - 1, 0.9, 0.7], [bx, by - 1.4, 0.8, 0.6], [bx + 2.6, by - 0.8, 0.7, 0.6]], '#F2C94C') }
});
Q.tortoise = () => ({
  id: 'tortoise', size: 'SMALL', fur: '#B8B07A', furS: '#9A9260', belly: '#D8D0A0',
  body: [-0.6, -3.4, 5.8, 2.4], head: [6, -4.6, 2.4], headW: 1.15, restDrop: 0.4, headDrop: 0.4,
  legs: { back: -3.2, front: 2.6, top: -1.6, w: 1.6, paw: '#9A9260' },
  eye: [0.5, -0.5, 0.85], ears: {}, tail: { kind: 'short', color: '#B8B07A' },
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
  body: [-0.8, -4.6, 6.4, 3.2], head: [5.6, -6.4, 3.2], restDrop: 0.6,
  legs: { back: -3.6, front: 2.8, top: -2.4, w: 1.4, paw: '#6E4428' },
  snout: [1.8, 1.1, 1.9, 1.3, '#E8D2B0'], nose: [3.2, 0.4, 0.5, OUT], eye: [0.5, -0.8, 0.9],
  ears: { kind: 'round', size: 0.6, inner: '#6E4428' }, tail: { kind: 'otter' },
  parts: { face: ({ hx, hy }) => E(hx + 0.8, hy + 1.2, 2.4, 1.8, '#E8D2B0', 0) + L([hx + 2.6, hy + 1.2], [hx + 4.4, hy + 0.6], OUT, 0.35) + L([hx + 2.6, hy + 1.6], [hx + 4.4, hy + 1.8], OUT, 0.35) }
});
Q.cat = () => ({
  id: 'cat', size: 'SMALL', fur: '#E8A050', furS: '#C8803A', belly: '#FFF2E0',
  body: [-0.6, -6, 5.6, 3.4], head: [5, -9.4, 3.8], restDrop: 1,
  legs: { back: -3.4, front: 3, top: -3.4, w: 1.3, paw: '#FFF2E0' },
  snout: [1.8, 1.2, 1.6, 1.1, '#FFF2E0'], nose: [2.8, 0.5, 0.38, '#E88A90'], eye: [0.9, -0.6, 1],
  ears: { kind: 'pointy', size: 0.95, inner: '#F2B0B0' }, tail: { kind: 'thin', up: 7, w: 1.3 },
  parts: {
    coat: ({ bx, by }) => [-3, -0.6, 1.8].map(x => `<path d="M${r2(bx + x)},${r2(by - 3.6)} q0.6,1.6 0,3" fill="none" stroke="#C8803A" stroke-width="0.9"/>`).join(''),
    face: ({ hx, hy }) => L([hx + 2.6, hy + 1.4], [hx + 4.6, hy + 1], OUT, 0.35) + L([hx + 2.6, hy + 1.8], [hx + 4.6, hy + 2.2], OUT, 0.35)
  }
});
Q.dog = () => ({
  id: 'dog', size: 'MID', fur: '#E0B880', furS: '#C49A62', belly: '#FFF2DE',
  body: [-1, -8.6, 7.4, 4.6], head: [7, -12.4, 4.4], restDrop: 1.4,
  legs: { back: -4.6, front: 4, top: -5, w: 1.8, paw: '#FFF2DE' },
  snout: [2.8, 1.6, 2.4, 1.8, '#FFF2DE'], nose: [4.6, 0.8, 0.6, OUT], eye: [0.9, -0.9, 1.05],
  ears: { kind: 'hang', size: 1, color: '#A8784A' }, tail: { kind: 'thin', up: 5, w: 1.4 },
  parts: { neck: ({ hx, hy }) => P(`M${r2(hx - 3.6)},${r2(hy + 2.4)} Q${r2(hx - 1)},${r2(hy + 4.8)} ${r2(hx + 1.6)},${r2(hy + 3.6)}`, 'none', 0).replace('stroke="none"', 'stroke="#E0483C" stroke-width="1.4" stroke-linecap="round"') + E(hx - 0.4, hy + 4.6, 0.7, 0.7, '#F2C94C', 0.5) }
});
// La grenouille : assise, saute en marchant
Q.frog = () => ({
  id: 'frog', size: 'SMALL', fur: '#7CC46A', furS: '#5AA04C', belly: '#E8F2B0',
  body: [-0.4, -4, 5, 3.6], head: [2.6, -7.4, 3.8], headW: 1.15, restDrop: 0,
  legs: { back: -3, front: 2.6, top: -1.6, w: 1.4, paw: '#5AA04C' },
  eye: [1, -2.6, 1.1], blush: true, ears: {}, tail: {},
  parts: {
    behindHead: ({ hx, hy }) => E(hx - 1.6, hy - 2.8, 1.8, 1.8, '#7CC46A') + E(hx + 1.6, hy - 2.8, 1.8, 1.8, '#7CC46A'),
    face: ({ hx, hy }) => P(`M${r2(hx - 1.4)},${r2(hy + 1)} Q${r2(hx + 1.6)},${r2(hy + 2.6)} ${r2(hx + 3.8)},${r2(hy + 0.4)}`, 'none', 0.6),
    head: ({ hx, hy, mode }) => eye(hx - 1.6, hy - 2.8, 0.95, mode)
  }
});

module.exports = { BOX, K, quad, Q, eye, heartIcon, limb, thick, stroke, line };

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
    s += limb([x, by + bry * 0.7], [x + dx, -0.6], lg.w || 0.7, lg.color) + line([x + dx - 0.8, -0.4], [x + dx + 1.4, -0.4], 1.6, OUT) + line([x + dx - 0.8, -0.4], [x + dx + 1.4, -0.4], 0.7, lg.color);
  }
  s += c.parts?.back ? c.parts.back(ctx) : '';
  // queue
  const t = c.tail || {};
  const tx = bx - brx * 0.85, ty = by - bry * 0.1;
  if (t.kind === 'fan') s += P(`M${r2(tx + 1)},${r2(ty + 1)} L${r2(tx - (t.len || 3.6))},${r2(ty - (t.up || 4.6))} Q${r2(tx - (t.len || 3.6) + 1.6)},${r2(ty - (t.up || 4.6) - 1.2)} ${r2(tx + 1.4)},${r2(ty - 1.4)} Z`, t.color || c.wing);
  if (t.kind === 'long') s += P(`M${r2(tx + 1)},${r2(ty - 0.6)} L${r2(tx - (t.len || 4))},${r2(ty + 0.6)} L${r2(tx + 1)},${r2(ty + 1.8)} Z`, t.color || c.wing);
  // corps, ventre, aile
  const bd = `M${r2(bx - brx)},${r2(by)} a${brx},${bry} 0 1,0 ${2 * brx},0 a${brx},${bry} 0 1,0 ${-2 * brx},0 Z`;
  s += P(bd, c.color) + clip(`b${c.id}${pose}`, bd, `<ellipse cx="${r2(bx + brx * 0.35)}" cy="${r2(by + bry * 0.4)}" rx="${r2(brx * 0.75)}" ry="${r2(bry * 0.75)}" fill="${c.belly || c.color}"/>`
    + (c.parts?.coat ? c.parts.coat(ctx) : '')) + P(bd, 'none');
  const wingUp = walk && ph < 0 ? -0.6 : 0;
  s += P(`M${r2(bx - brx * 0.6)},${r2(by - bry * 0.35 + wingUp)} Q${r2(bx + brx * 0.2)},${r2(by - bry * 0.75 + wingUp)} ${r2(bx + brx * 0.45)},${r2(by - bry * 0.05)} Q${r2(bx)},${r2(by + bry * 0.65)} ${r2(bx - brx * 0.95)},${r2(by + bry * 0.25)} Z`, c.wing, 0.9);
  s += c.parts?.body ? c.parts.body(ctx) : '';
  // tête
  if (c.neck) s += thick(c.neck(ctx), c.neckW || 2.4, c.headColor || c.color);
  s += c.parts?.behindHead ? c.parts.behindHead(ctx) : '';
  s += E(hx, hy, hr, hr, c.headColor || c.color);
  s += c.parts?.face ? c.parts.face(ctx) : '';
  s += beakOf(c.beak, hx, hy, hr);
  const [edx, edy, er] = c.eye;
  s += eye(hx + edx, hy + edy, er, mode);
  if (c.blush !== false) s += E(hx + edx - er * 0.2, hy + edy + er * 1.5, er * 0.8, er * 0.4, '#F7A8B0', 0);
  s += c.parts?.head ? c.parts.head(ctx) : '';
  if (pose === 'joie') s += heartIcon(hx, hy - hr - 2.4, 1.2);
  return s;
}

const B = {};
B.hen = (v) => {
  const col = { blanche: '#FFFFFF', rousse: '#C8642E', noire: '#3A3A42', grise: '#B4B4B8' }[v || 'rousse'];
  const wing = { blanche: '#E6E2DA', rousse: '#A84E22', noire: '#2A2A32', grise: '#8E8E94' }[v || 'rousse'];
  return {
    id: 'hen' + (v || ''), size: 'SMALL', color: col, wing, belly: v === 'noire' ? '#4A4A54' : v === 'rousse' ? '#E08A4E' : col,
    body: [-0.6, -6.2, 5, 4.2], head: [3.6, -11, 2.8],
    beak: { kind: 'cone', len: 1.8, color: '#F2B33B' }, eye: [0.7, -0.4, 0.75],
    legs: { xs: [-1.4, 0.8], top: -2.4, color: '#F2B33B' }, tail: { kind: 'fan', len: 3, up: 5, color: v === 'noire' ? '#2A6A5A' : wing },
    parts: {
      head: ({ hx, hy, hr }) => P(`M${r2(hx - 1.4)},${r2(hy - hr + 0.6)} Q${r2(hx - 1.2)},${r2(hy - hr - 1.6)} ${r2(hx - 0.2)},${r2(hy - hr - 0.4)} Q${r2(hx + 0.4)},${r2(hy - hr - 2)} ${r2(hx + 1.2)},${r2(hy - hr - 0.2)} Q${r2(hx + 1.8)},${r2(hy - hr - 1.2)} ${r2(hx + 1.6)},${r2(hy - hr + 0.8)} Z`, '#E8483C', 0.7)
        + E(hx + hr * 0.9, hy + 1.8, 0.7, 1, '#E8483C', 0.6),
      coat: ({ bx, by }) => v === 'grise' ? [[-2, -1], [0.6, -2], [2, 0.6], [-1, 1.4]].map(([x, y]) => E(bx + x, by + y, 0.5, 0.5, '#FFFFFF', 0)).join('') : ''
    }
  };
};
B.chick = () => ({
  id: 'chick', size: 'SMALL', color: '#FFE16A', wing: '#F6C93E', belly: '#FFF0A0',
  body: [-0.2, -3.6, 3.4, 3], head: [1.8, -6.8, 2.4],
  beak: { kind: 'cone', len: 1.2, color: '#F29A3B' }, eye: [0.6, -0.3, 0.7],
  legs: { xs: [-0.8, 0.8], top: -1.2, color: '#F29A3B', w: 0.6 }, tail: {},
  parts: { head: ({ hx, hy, hr }) => P(`M${r2(hx - 0.4)},${r2(hy - hr + 0.2)} Q${r2(hx - 0.6)},${r2(hy - hr - 1.4)} ${r2(hx + 0.6)},${r2(hy - hr - 0.6)}`, 'none', 0.6) }
});
B.heron = () => ({
  id: 'heron', size: 'TALL', color: '#A8B4C2', wing: '#7E8C9E', belly: '#E8EEF4', headColor: '#E8EEF4',
  body: [-1, -17, 6, 4], head: [4.2, -31, 2.2],
  beak: { kind: 'long', len: 5.4, color: '#F2C94C', dy: 0.2 }, eye: [0.5, -0.4, 0.7], blush: false,
  legs: { xs: [-1.6, 0.6], top: -13, color: '#C8A85A', w: 0.8 }, tail: { kind: 'long', len: 3.4 },
  neck: ({ bx, by, hx, hy }) => `M${r2(bx + 4)},${r2(by - 2)} Q${r2(bx + 9)},${r2(by - 6)} ${r2(hx - 1)},${r2(hy + 6)} Q${r2(hx - 2.4)},${r2(hy + 3)} ${r2(hx)},${r2(hy + 1)}`, neckW: 2.2,
  parts: { head: ({ hx, hy }) => thick(`M${r2(hx - 1.4)},${r2(hy - 1)} Q${r2(hx - 4)},${r2(hy - 1.4)} ${r2(hx - 5)},${r2(hy + 0.6)}`, 0.6, '#3A3A48') + E(hx + 0.2, hy - 0.9, 1.6, 0.8, '#3A3A48', 0) }
});
B.puffin = () => ({
  id: 'puffin', size: 'SMALL', color: '#2E2E38', wing: '#22222A', belly: '#FFFFFF',
  body: [-0.4, -6, 4, 4.6], head: [1.6, -11.4, 3.2],
  beak: { kind: 'puffin', len: 2.4 }, eye: [0.6, -0.4, 0.75],
  legs: { xs: [-1, 0.8], top: -1.8, color: '#F07A3A', w: 0.9 }, tail: { kind: 'long', len: 2 },
  parts: {
    face: ({ hx, hy, hr }) => E(hx + 0.6, hy + 0.2, hr * 0.85, hr * 0.8, '#F4F4F4', 0),
    // Bosco est bougon : un sourcil froncé
    head: ({ hx, hy, mode }) => mode === 'open' ? `<path d="M${r2(hx - 0.4)},${r2(hy - 1.8)} L${r2(hx + 1.8)},${r2(hy - 1.2)}" stroke="${OUT}" stroke-width="0.7" stroke-linecap="round"/>` : ''
  }
});
B.toucan = () => ({
  id: 'toucan', size: 'SMALL', color: '#2A2A30', wing: '#1E1E24', belly: '#2A2A30',
  body: [-1.4, -7.4, 4, 4.8], head: [1.2, -12.2, 2.8],
  beak: { kind: 'big', len: 6.4, color: '#F6A23B', tip: '#E8483C', dy: 0.6 }, eye: [0.4, -0.6, 0.75], blush: false,
  legs: { xs: [-2, 0], top: -2.6, color: '#5C8FD8', w: 0.8 }, tail: { kind: 'long', len: 3.6 },
  parts: { face: ({ hx, hy }) => E(hx + 0.6, hy + 1.6, 2.2, 2, '#FFF4C8', 0) + E(hx + 0.4, hy - 0.6, 1.3, 1.2, '#7CD0E8', 0) }
});
B.crow = () => ({
  id: 'crow', size: 'SMALL', color: '#2E2E38', wing: '#3E4A6A', belly: '#3A3A46',
  body: [-0.6, -6.4, 4.6, 3.8], head: [3.2, -10.4, 2.7],
  beak: { kind: 'long', len: 2.8, color: '#5A5A64' }, eye: [0.6, -0.4, 0.75],
  legs: { xs: [-1.4, 0.6], top: -2.4, color: '#4A4A52' }, tail: { kind: 'long', len: 3.6 },
  parts: { body: ({ bx, by }) => `<path d="M${r2(bx - 2)},${r2(by - 2.4)} Q${r2(bx)},${r2(by - 3.4)} ${r2(bx + 2)},${r2(by - 2.2)}" fill="none" stroke="#6E80B0" stroke-width="0.6" opacity="0.8"/>` }
});
B.bird = () => ({
  id: 'bird', size: 'SMALL', color: '#5C9CE0', wing: '#4A84C8', belly: '#FFE16A', headColor: '#FFFFFF',
  body: [-0.2, -4.2, 3.4, 2.8], head: [2.6, -6.8, 2.3],
  beak: { kind: 'cone', len: 1.1, color: '#3A3A44' }, eye: [0.6, -0.2, 0.62],
  legs: { xs: [-0.6, 0.8], top: -1.4, color: '#7E7E8A', w: 0.55 }, tail: { kind: 'long', len: 2.6, color: '#4A84C8' },
  parts: { head: ({ hx, hy, hr }) => P(`M${r2(hx - hr)},${r2(hy - 0.4)} Q${r2(hx - hr * 0.6)},${r2(hy - hr)} ${r2(hx + hr * 0.8)},${r2(hy - hr * 0.55)} Q${r2(hx)},${r2(hy - hr * 0.35)} ${r2(hx - hr)},${r2(hy - 0.4)} Z`, '#5C9CE0', 0) + `<path d="M${r2(hx - 1.6)},${r2(hy + 0.2)} L${r2(hx + 1.2)},${r2(hy - 0.4)}" stroke="#2A3A5A" stroke-width="0.5"/>` }
});
B.gull = () => ({
  id: 'gull', size: 'SMALL', color: '#FFFFFF', wing: '#A8B4C2', belly: '#FFFFFF',
  body: [-0.8, -6.4, 5, 3.6], head: [3.4, -10.4, 2.6],
  beak: { kind: 'long', len: 2.8, color: '#F2C94C' }, eye: [0.6, -0.4, 0.7],
  legs: { xs: [-1.6, 0.6], top: -2.6, color: '#F2B33B' }, tail: { kind: 'long', len: 3, color: '#3A3A44' },
  parts: { head: ({ hx, hy, hr }) => E(hx + hr * 0.85 + 2.2, hy + 0.7, 0.4, 0.35, '#E8483C', 0) }
});

module.exports.bird = bird;
module.exports.B = B;

// ——— Petites bêtes et mer : cadres propres (jeu × 1,25) ———
Object.assign(BOX, {
  BUTTERFLY: box(-6, -9, 12, 9), FIREFLY: box(-5, -5, 10, 10), BEE: box(-5, -7, 10, 8), OWL: box(-6, -14, 12, 15), TICTAC: box(-6, -10, 12, 11),
  KOI: box(-10, -4, 20, 8), FISH: box(-16, -28, 32, 32), DOLPHIN: box(-26, -22, 52, 36), WHALE_BACK: box(-50, -18, 100, 27), WHALE_FLUKE: box(-26, -30, 52, 38),
  BOWL: box(-6, -10, 12, 11), JELLY: box(-8, -12, 16, 16)
});
let glowN = 0;
const glowDot = (x, y, r, rgb, a = 0.45) => { const id = `lueur-bete${glowN++}`; return `<defs><radialGradient id="${id}"><stop offset="0" stop-color="rgb(${rgb})" stop-opacity="${r2(Math.min(0.9, a * 1.7))}"/><stop offset="1" stop-color="rgb(${rgb})" stop-opacity="0"/></radialGradient></defs><circle cx="${r2(x)}" cy="${r2(y)}" r="${r2(r)}" fill="url(#${id})"/>`; };
const water = (x, y, w) => `<path d="M${r2(x - w)},${r2(y)} Q${r2(x - w / 2)},${r2(y - 1.2)} ${x},${r2(y)} Q${r2(x + w / 2)},${r2(y + 1.2)} ${r2(x + w)},${r2(y)}" fill="none" stroke="#FFFFFF" stroke-width="1" stroke-linecap="round" opacity="0.85"/>`;
const splash = (x, y, k = 1) => [[-3, -2.6], [0, -3.6], [3, -2.4]].map(([dx, dy]) => E(x + dx * k, y + dy * k, 0.7 * k, 0.9 * k, '#BFE6FF', 0.5)).join('');

// Papillon (vu de profil-dessus) ; v : jaune | bleu | lune ; pose : vol1 | vol2 | repos | joie
function butterfly(v, pose) {
  const col = { jaune: ['#F6D04A', '#E8A83A'], bleu: ['#6AB4F0', '#3E7FC1'], lune: ['#CFF2D8', '#8ACB9E'] }[v];
  const open = pose === 'vol2' ? 0.45 : pose === 'repos' ? 0.25 : 1;
  const y = pose === 'repos' ? -3.6 : -5;
  const wing = (m) => `<g transform="translate(0 ${y}) scale(${r2(m * open)} 1)">${P('M0,0 Q2.6,-5.4 5.6,-3.6 Q6.6,-1 2.4,0.4 Q5.2,1.6 4,3.6 Q1.6,4.4 0,1 Z', col[0])}${E(3.4, -2.6, 0.9, 0.7, col[1], 0)}${v === 'lune' ? E(3, -2.4, 0.5, 0.5, '#FFFFFF', 0) : ''}</g>`;
  if (pose === 'repos') {
    // posé sur une fleur, ailes repliées vers le haut (vu de côté)
    const fl = [0, 72, 144, 216, 288].map(a => E(Math.cos(a * Math.PI / 180) * 1.6, -1.4 + Math.sin(a * Math.PI / 180) * 0.8, 1.2, 0.8, '#F7C6D9', 0.5)).join('') + E(0, -1.4, 0.8, 0.6, '#F2C94C', 0.4);
    return '<g transform="translate(0 -1.3)">' + limb([0, -1.2], [0, 0], 0.6, '#6CAE5A') + fl + P('M0,-2.6 Q-1.4,-8.6 2.6,-9.6 Q4.6,-6.4 0.6,-2.4 Z', col[0], 0.7) + E(2, -7, 0.8, 0.6, col[1], 0)
      + limb([-0.6, -2.4], [0.8, -4.6], 0.6, '#3A2A24') + stroke('M0.8,-4.6 Q1.6,-6 2.6,-6.2', 0.35, OUT) + '</g>';
  }
  let s = wing(-1) + wing(1);
  s += limb([0, y - 2.4], [0, y + 2.4], 0.6, '#3A2A24') + stroke(`M0,${r2(y - 2.4)} Q-1,${r2(y - 4.6)} -1.8,${r2(y - 5)} M0,${r2(y - 2.4)} Q1,${r2(y - 4.6)} 1.8,${r2(y - 5)}`, 0.4, OUT);
  if (pose === 'joie') s += heartIcon(4.6, y - 4.4, 0.9);
  return s;
}
// Luciole : abdomen qui luit (pulse)
function firefly(pose) {
  const on = pose !== 'vol2';
  let s = on ? glowDot(-1.6, -3, 4.4, '255,236,150', 0.4) : glowDot(-1.6, -3, 2.6, '255,236,150', 0.25);
  s += E(-1.6, -3, 1.8, 1.4, on ? '#FFF3A0' : '#E8D880', 0.7) + E(0.6, -3.4, 1.4, 1.2, '#4A3A30', 0.7) + E(1.8, -3.8, 0.9, 0.9, '#2A2420', 0.6);
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
  s += E(2.6, y - 0.6, 1.5, 1.4, meca ? '#B8C0C8' : '#3A2A24', 0.8) + E(3, y - 1, 0.45, 0.45, meca ? '#3A2A24' : '#FFFFFF', 0);
  if (meca) s += limb([-1, y - 2.2], [-1.6, y - 4], 0.5, '#C9A24A') + E(-2.4, y - 4.4, 1, 0.6, '#C9A24A', 0.5) + E(-0.8, y - 4.4, 1, 0.6, '#C9A24A', 0.5) + E(0.9, y + 0.6, 0.3, 0.3, '#F0D58A', 0);
  else s += P(`M-3.2,${r2(y + 0.4)} L-4.2,${r2(y + 0.8)} L-3.2,${r2(y + 1.2)} Z`, '#3A2A24', 0);
  if (pose === 'joie') s += heartIcon(2.6, y - 4, 0.8);
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
  s += E(hx, hy, 1.65, 1.5, '#EBB08A', 0.8);
  s += pose === 'joie' ? P(`M${hx - 0.2},${r2(hy - 0.1)} Q${hx + 0.45},${r2(hy - 0.8)} ${hx + 1.1},${r2(hy - 0.1)}`, 'none', 0.45)
    : E(hx + 0.45, hy - 0.2, 0.55, 0.7, EYE, 0) + E(hx + 0.6, hy - 0.45, 0.22, 0.22, '#FFFFFF', 0) + L([hx + 0.95, hy - 0.8], [hx + 1.35, hy - 1.15], OUT, 0.25);
  s += E(hx + 0.1, hy + 0.75, 0.5, 0.25, '#F7A8B0', 0);
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
  s += E(-1, -0.6, 1.6, 1, spot, 0) + E(3.6, 0.6, 1.2, 0.8, spot, 0) + E(5.6, -1.2, 0.5, 0.5, EYE, 0) + E(5.6, 1.2, 0.5, 0.5, EYE, 0);
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
  s += P('M-1,-2.4 L1,-4 L2.2,-2 Z', fin, 0.6) + E(4, -0.6, 0.8, 0.8, EYE, 0) + E(4.2, -0.9, 0.3, 0.3, '#FFFFFF', 0);
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
  s += E(9, -2, 0.9, 1.1, EYE, 0) + E(9.3, -2.4, 0.35, 0.35, '#FFFFFF', 0) + P('M11.4,0.6 Q13,1.4 14.6,0.6', 'none', 0.6) + E(8.4, 0.4, 1, 0.5, '#F7A8B0', 0);
  s += '</g>';
  return s;
}
// Baleine : le dos qui affleure et souffle (n : jet petit / grand) ; la queue qui plonge (n : haute / qui s'enfonce)
function whaleBack(n) {
  let s = `<ellipse cx="0" cy="-1" rx="56" ry="4" fill="#5E8EC0" fill-opacity="0.25"/>`;
  s += P('M-52,0 Q-30,-11.4 0,-12.4 Q34,-11.4 54,0 Z', '#4A6E9E') + clip(`wb${n}`, 'M-52,0 Q-30,-11.4 0,-12.4 Q34,-11.4 54,0 Z', '<ellipse cx="-6" cy="-10.8" rx="40" ry="3.4" fill="#6A8EBE"/>' + [-20, -6, 10].map(x => `<ellipse cx="${x}" cy="-6.4" rx="2" ry="1.2" fill="#3A5A86"/>`).join(''));
  s += E(30, -6.2, 1.3, 1.5, EYE, 0) + E(30.4, -6.7, 0.5, 0.5, '#FFFFFF', 0) + P('M34,-3.6 Q38,-2.4 42,-3.6', 'none', 0.7);
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
    s += `<g transform="translate(${x} -3.2) scale(${n ? -1 : 1} 1)">${P('M-1.6,0 L-3.2,-1.2 L-2.8,0 L-3.2,1.2 Z', '#F08A3A', 0.5)}${E(0, 0, 2, 1.4, '#F6A04A', 0.6)}${E(1, -0.3, 0.35, 0.35, EYE, 0)}</g>` + E(2.6, -7 - n, 0.5, 0.5, '#FFFFFF', 0.4);
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
