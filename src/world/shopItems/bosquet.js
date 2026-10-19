// Les articles de la boutique du Bosquet, dessinés aux abords du bâtiment (shopSprites.js les réunit ; repère et
// calques : voir son en-tête).
import { WOOD, WOOD_DARK } from '../palette';
import { IRON, STUMP, BARK, wave, star, wheel, bird, f2, ln, ell, dot } from '../spriteKit';

const hache = {
  layers: [{
    at: [-0.42, 0.84],
    frame: [-24, -32, 46, 38],
    draw: T => {
      const [x, y] = T.p(0, 0, 9);
      const log = (a, b, z) => T.box(a, b, a + 0.2, b + 0.065, z, z + 4.6, BARK) + ell(...T.p(a + 0.2, b + 0.032, z + 2.3), 1.1, 1.6, 'none', ' stroke="#C9935E" stroke-width="0.5"');
      return T.shadow(-0.1, 0.04, 0.2, 0.2)
        // Bûches fendues empilées à gauche du billot
        + log(-0.36, -0.06, 0) + log(-0.36, 0.01, 0) + log(-0.36, 0.08, 0) + log(-0.34, -0.025, 4.6) + log(-0.34, 0.045, 4.6)
        + T.cyl(0, 0, 0, 9, 0.11, STUMP, 'block')
        + ell(x, y, 3.4, 1.7, 'none', ' stroke="#B98552" stroke-width="0.6"') + ell(x, y, 1.4, 0.7, 'none', ' stroke="#B98552" stroke-width="0.5"')
        + [-3, 0, 3].map(dx => ln([x + dx, y + 1.6], [x + dx + 0.4, y + 8], 'rgba(60,40,25,.25)', 0.6)).join('')
        // Hache plantée de biais
        + ln([x + 0.6, y - 1.6], [x + 9.5, y - 17], WOOD.right, 2) + ln([x + 0.3, y - 1.8], [x + 9.2, y - 17.2], WOOD.top, 0.6)
        + `<path d="M${f2(x - 3.2)},${f2(y + 0.6)} L${f2(x + 3.6)},${f2(y - 1.2)} L${f2(x + 2.6)},${f2(y - 4.8)} L${f2(x - 2.2)},${f2(y - 4.6)} Q${f2(x - 4.4)},${f2(y - 2)} ${f2(x - 3.2)},${f2(y + 0.6)} Z" fill="${IRON.left}" stroke="${IRON.right}" stroke-width="0.6"/>`
        + `<path d="M${f2(x - 3.2)},${f2(y + 0.6)} Q${f2(x - 4.4)},${f2(y - 2)} ${f2(x - 2.2)},${f2(y - 4.6)}" stroke="${IRON.top}" stroke-width="0.8" fill="none"/>`
        + [[6, 3], [-5, 4], [8, 1], [3, 5]].map(([dx, dy]) => `<path d="M${f2(x + dx)},${f2(y + 9 + dy)} l1.6,-0.6 l0.4,0.9 Z" fill="#E7C08A"/>`).join('');
    }
  }]
};
const scie = {
  layers: [{
    at: [0.78, -0.74],
    frame: [-26, -34, 52, 40],
    draw: T => {
      const leg = (du, s) => ln(T.p(du, -0.09 * s, 0), T.p(du, 0.09 * s, 14), WOOD_DARK.right, 2);
      const [b0x, b0y] = T.p(0.02, -0.13, 15);
      const [b1x, b1y] = T.p(0.02, 0.13, 15);
      const teeth = Array.from({ length: 9 }, (_, k) => `${k ? 'L' : 'M'}${f2(b0x + ((b1x - b0x) * k) / 8)},${f2(b0y + ((b1y - b0y) * k) / 8 + (k % 2 ? 1 : 0))}`).join(' ');
      const [dx, dy] = T.p(0.03, 0.02, 0);
      return T.shadow(0, 0, 0.24, 0.18)
        + ell(dx, dy, 6, 2, '#EBCB93') + [[-3, 0.5], [2, 1], [4, -0.4]].map(([a, b]) => dot(dx + a, dy + b, 0.5, '#C9A16A')).join('')
        + leg(-0.15, 1) + leg(-0.15, -1)
        + T.box(-0.26, -0.055, 0.24, 0.055, 12, 19, BARK)
        + ell(...T.p(0.24, 0, 15.5), 1.6, 2.4, 'none', ' stroke="#C9935E" stroke-width="0.5"')
        + leg(0.15, 1) + leg(0.15, -1)
        // Scie à cadre plantée dans l'entaille : lame dentée, montants, traverse, corde de tension
        + `<path d="${teeth}" stroke="${IRON.right}" stroke-width="0.7" fill="none"/>`
        + ln([b0x, b0y], [b1x, b1y], IRON.left, 1.4)
        + ln([b0x, b0y], [b0x + 1.5, b0y - 14], WOOD.right, 1.6) + ln([b1x, b1y], [b1x + 1.5, b1y - 14], WOOD.right, 1.6)
        + ln([b0x + 0.8, b0y - 7], [b1x + 0.8, b1y - 7], WOOD.left, 1.2)
        + ln([b0x + 1.5, b0y - 14], [b1x + 1.5, b1y - 14], '#C9A16A', 0.7, ' stroke-dasharray="1 0.8"')
        + T.cyl(-0.3, 0.12, 0, 4, 0.06, STUMP, 'round1') + T.cyl(-0.22, 0.16, 0, 3, 0.05, STUMP, 'round2');
    }
  }]
};
// Nichoir sur son poteau ; un rouge-gorge et une mésange sautillent devant le Bosquet
const nichoir = {
  layers: [{
    at: [0.86, 0.12],
    frame: [-14, -54, 28, 60],
    draw: T => {
      const [hx, hy] = T.p(0, 0.065, 41);
      return T.shadow(0, 0, 0.08, 0.2) + T.pebble(0.04, 0.04, 2.2)
        + T.box(-0.02, -0.02, 0.02, 0.02, 0, 35, WOOD_DARK)
        + T.box(-0.07, -0.065, 0.07, 0.065, 35, 46, { top: '#FBF3DF', left: '#F3E4C4', right: '#D8C39B' })
        + dot(hx, hy, 2, '#3A2A1E')
        + ln([hx, hy + 4], [hx - 2.4, hy + 5.2], WOOD_DARK.right, 1)
        + T.gable(-0.07, -0.065, 0.07, 0.065, 46, 8, { front: '#6FA3D9', back: '#4C7FB5', gable: '#D8C39B' }, 0.03)
        + `<path d="M${f2(hx - 4)},${f2(hy - 4)} l1.4,-1 l1.4,1" stroke="#F7A8C8" stroke-width="0.8" fill="none"/>`;
    }
  }, {
    at: [0.75, 0.42],
    frame: [-26, -18, 52, 24],
    n: 8,
    fps: 4,
    draw: (T, level, f) => {
      const [x1, y1] = T.p(-0.14, 0.05, 0);
      const [x2, y2] = T.p(0.2, -0.12, 0);
      return bird(x1 + (f >= 4 ? 2 : 0), y1, { body: '#8B6A4E', breast: '#E8743F', wing: '#6F5238', flip: f >= 4, hop: f === 3 || f === 7 ? 2.6 : 0, peck: f === 1 || f === 5 ? 1 : 0, flap: f === 3 || f === 7 ? 1 : 0 })
        + bird(x2, y2, { body: '#5E92C8', breast: '#F2D35A', wing: '#456F9C', flip: f % 4 >= 2, hop: f === 6 ? 2.4 : 0, peck: f === 0 || f === 2 ? 1 : 0, flap: f === 6 ? 1 : 0 });
    }
  }]
};
const charrette = {
  layers: [{
    at: { 1: [0.62, 0.78], 2: [0.25, 0.84] },
    frame: [-30, -34, 62, 42],
    draw: T => {
      const log = (dv, z) => T.box(-0.22, dv - 0.035, 0.1, dv + 0.035, z, z + 5, BARK) + ell(...T.p(0.1, dv, z + 2.5), 1.2, 1.8, 'none', ' stroke="#C9935E" stroke-width="0.5"');
      return T.shadow(-0.04, 0, 0.3, 0.18)
        + wheel(T, -0.08, -0.13, 9, 0.12, 'u', { rim: '#5E3A22', spokes: 8, width: 2 })
        + ln(T.p(0.1, -0.09, 10), T.p(0.42, -0.09, 1), WOOD.right, 1.6)
        + T.box(-0.24, -0.12, 0.12, 0.12, 9, 12, WOOD)
        + log(-0.07, 12) + log(0, 12) + log(0.07, 12) + log(-0.035, 17) + log(0.035, 17)
        + T.box(-0.24, 0.115, 0.12, 0.13, 12, 17, WOOD_DARK)
        + [-0.2, -0.04, 0.1].map(du => T.box(du, 0.11, du + 0.025, 0.135, 9, 18, WOOD_DARK)).join('')
        + ln(T.p(0.1, 0.09, 10), T.p(0.42, 0.09, 1), WOOD.right, 1.6) + ln(T.p(0.1, 0.09, 10.6), T.p(0.42, 0.09, 1.6), WOOD.top, 0.6)
        + wheel(T, -0.08, 0.14, 9, 0.12, 'u', { rim: '#4A2E1A', spokes: 8, width: 2.2 })
        + T.disc(-0.08, 0.15, 9, 0.02, '#C9A16A');
    }
  }]
};
// Scie passe-partout posée en travers d'un gros tronc entaillé, sur ses cales, tas de sciure (palier V)
const passePartout = {
  layers: [{
    at: [0.9, 0.62],
    frame: [-30, -32, 58, 40],
    draw: T => {
      const [b0x, b0y] = T.p(0.1, -0.24, 13);
      const [b1x, b1y] = T.p(0.1, 0.26, 13);
      const sag = 2.4;
      const blade = `M${f2(b0x)},${f2(b0y)} Q${f2((b0x + b1x) / 2)},${f2((b0y + b1y) / 2 + sag)} ${f2(b1x)},${f2(b1y)} L${f2(b1x)},${f2(b1y + 3)} Q${f2((b0x + b1x) / 2)},${f2((b0y + b1y) / 2 + sag + 5)} ${f2(b0x)},${f2(b0y + 3)} Z`;
      const teeth = Array.from({ length: 13 }, (_, k) => {
        const t = k / 12;
        const tx = b0x + (b1x - b0x) * t;
        const ty = b0y + (b1y - b0y) * t + 3 + (sag + 2) * 4 * t * (1 - t);
        return `${k ? 'L' : 'M'}${f2(tx)},${f2(ty + (k % 2 ? 1.2 : 0))}`;
      }).join(' ');
      const grip = (gx, gy) => ln([gx, gy + 1], [gx, gy - 8], WOOD.right, 2) + ln([gx - 0.4, gy + 1], [gx - 0.4, gy - 8], WOOD.top, 0.6) + ln([gx - 2.2, gy - 7], [gx + 2.2, gy - 7], WOOD_DARK.right, 1.4);
      const [dx, dy] = T.p(0.05, 0.14, 0);
      return T.shadow(0, 0, 0.3, 0.18)
        + T.box(-0.17, -0.09, -0.11, 0.09, 0, 3, WOOD_DARK) + T.box(0.11, -0.09, 0.17, 0.09, 0, 3, WOOD_DARK)
        + T.box(-0.34, -0.065, 0.3, 0.065, 3, 12, BARK)
        + ell(...T.p(0.3, 0, 7.5), 2.2, 3.4, 'none', ' stroke="#C9935E" stroke-width="0.6"') + ell(...T.p(0.3, 0, 7.5), 0.9, 1.4, 'none', ' stroke="#C9935E" stroke-width="0.5"')
        + [5.4, 8.2, 10.4].map((z, k) => ln(T.p(-0.32 + k * 0.05, 0.065, z), T.p(0.26 - k * 0.04, 0.065, z + 0.3), 'rgba(60,35,20,.3)', 0.6)).join('')
        + ln(T.p(-0.3, -0.03, 12), T.p(0.26, -0.03, 12), 'rgba(255,230,190,.35)', 0.8)
        + T.face([[0.05, 0.065, 12], [0.15, 0.065, 12], [0.1, 0.065, 7.4]], '#F1D3A1') + T.face([[0.05, -0.065, 12], [0.15, -0.065, 12], [0.15, 0.065, 12], [0.05, 0.065, 12]], '#E7C08A')
        + ell(dx, dy, 6.4, 2.2, '#EBCB93') + [[-3, 0.5], [2, 1], [4, -0.4]].map(([a, b]) => dot(dx + a, dy + b, 0.5, '#C9A16A')).join('')
        + `<path d="${blade}" fill="${IRON.left}" stroke="${IRON.right}" stroke-width="0.6"/>`
        + `<path d="${teeth}" stroke="${IRON.right}" stroke-width="0.7" fill="none"/>`
        + ln([b0x + 3, b0y + 0.8], [b1x - 3, b1y + 0.8], 'rgba(255,255,255,.5)', 0.6)
        + grip(b0x, b0y) + grip(b1x, b1y);
    }
  }]
};
// Écureuil roux sur sa souche : il grignote une noisette, sa queue en panache ondule, il sautille (palier VI)
const acorn = (x, y, s = 1) => ell(x, y, 1.6 * s, 1.9 * s, '#B98552') + `<path d="M${f2(x - 1.8 * s)},${f2(y - 0.8 * s)} q${f2(1.8 * s)},${f2(-2.2 * s)} ${f2(3.6 * s)},0 Z" fill="#7A4E30"/>`
  + ln([x, y - 1.9 * s], [x + 0.4 * s, y - 2.8 * s], '#5E3A22', 0.5);
const ecureuil = {
  layers: [{
    at: [-0.12, 0.94],
    frame: [-18, -38, 36, 44],
    n: 8,
    fps: 5,
    draw: (T, level, f, n) => {
      const [sx, sy] = T.p(0, 0, 8);
      const hop = f === 6 ? 2.6 : f === 7 ? 1 : 0;
      const nib = f % 2 && f < 6 ? 0.6 : 0;
      const tail = wave(f, n, 1.2);
      const x = sx - 1;
      const y = sy - 0.6 - hop;
      return T.shadow(0, 0, 0.13, 0.22)
        + T.cyl(0, 0, 0, 8, 0.1, STUMP, 'stump')
        + ell(sx, sy, 3, 1.4, 'none', ' stroke="#B98552" stroke-width="0.6"') + ell(sx, sy, 1.2, 0.6, 'none', ' stroke="#B98552" stroke-width="0.5"')
        + acorn(...T.p(0.16, 0.06, 1.6)) + acorn(...T.p(0.1, 0.16, 1.6), 0.9)
        // Queue en panache, derrière
        + `<path d="M${f2(x - 2)},${f2(y - 2)} C${f2(x - 9)},${f2(y - 2)} ${f2(x - 10 + tail)},${f2(y - 12)} ${f2(x - 6 + tail)},${f2(y - 17)} C${f2(x - 3 + tail)},${f2(y - 20)} ${f2(x + 1.4 + tail)},${f2(y - 16)} ${f2(x - 1 + tail * 0.6)},${f2(y - 13)} C${f2(x - 4)},${f2(y - 10)} ${f2(x - 4)},${f2(y - 5)} ${f2(x + 0.5)},${f2(y - 3)} Z" fill="#D9743A" stroke="#A9521F" stroke-width="0.5"/>`
        + `<path d="M${f2(x - 4)},${f2(y - 4)} C${f2(x - 8)},${f2(y - 6)} ${f2(x - 7 + tail)},${f2(y - 13)} ${f2(x - 4.6 + tail)},${f2(y - 15.6)}" stroke="#F2A266" stroke-width="1" fill="none"/>`
        // Corps assis, ventre clair, cuisse
        + ell(x + 0.6, y - 4.6, 3.6, 4.6, '#E0823F', ' stroke="rgba(120,50,20,.35)" stroke-width="0.5"')
        + ell(x + 2, y - 4, 1.8, 3.2, '#F6D7B0')
        + ell(x - 0.6, y - 1.6, 2.8, 1.8, '#C8662E')
        // Tête, oreille à pinceau, œil, museau
        + dot(x + 2.6, y - 10 + nib * 0.4, 2.8, '#E0823F')
        + `<path d="M${f2(x + 1.2)},${f2(y - 12)} l0.2,-3.2 l1.8,2.6 Z" fill="#C8662E"/>` + ln([x + 1.4, y - 15.2], [x + 1, y - 16.4], '#A9521F', 0.6)
        + ell(x + 3.8, y - 9 + nib * 0.4, 1.6, 1.2, '#F6D7B0')
        + dot(x + 3.4, y - 10.8 + nib * 0.4, 0.65, '#1E1A17') + dot(x + 5.2, y - 9.4 + nib * 0.4, 0.5, '#5E3A22')
        // Pattes avant et noisette
        + acorn(x + 4.4, y - 6.6 + nib, 0.9)
        + ell(x + 3.4, y - 6 + nib, 1, 0.8, '#C8662E') + ell(x + 5.2, y - 6.2 + nib, 1, 0.8, '#C8662E');
    }
  }]
};
// Cerf blanc aux bois dorés : il broute, relève la tête, des lucioles dansent dans ses bois ; il luit la nuit (palier VII)
const STAG_AT = [0.9, -0.3];
const antler = (x, y, s, c, w = 1.2) => `<path d="M${f2(x)},${f2(y)} q${-1 * s},-5 ${2 * s},-9 q${2 * s},-3 ${1 * s},-7 M${f2(x + 0.5 * s)},${f2(y - 4)} q${-3 * s},-1 ${-4 * s},-4.4 M${f2(x + 1.6 * s)},${f2(y - 8.4)} q${-3 * s},-1 ${-3.6 * s},-4.2 M${f2(x + 2.2 * s)},${f2(y - 10.6)} q${2 * s},-1 ${3 * s},-4.2" stroke="${c}" stroke-width="${w}" fill="none" stroke-linecap="round"/>`;
const cerf = {
  light: () => [STAG_AT[0], STAG_AT[1], 28, 18, '255,236,190'],
  layers: [{
    at: STAG_AT,
    frame: [-26, -50, 50, 56],
    n: 8,
    fps: 3,
    draw: (T, level, f, n) => {
      const [x, y] = T.p(0, 0, 0);
      const graze = f >= 3 && f <= 5 ? 1 : 0;
      const hx = x - 9 - graze * 1.6;
      const hy = y - 22 + graze * 13;
      const coat = '#FBF8F2';
      const shade = '#E2DBCD';
      const motes = [0, 1, 2].map(k => star(hx + 2 + Math.cos(k * 2.1 + f * 0.8) * 6, hy - 10 - k * 3 + wave(f, n, 1.5, k), 1.3, '#FFF2B0', 0.4 + Math.max(0, wave(f, n, 0.6, k * 2)))).join('');
      return ell(x, y + 0.5, 11, 2.6, 'rgba(40,55,20,.24)')
        + [[-5.4, 0, shade], [3.6, 0, shade], [-3, 0.8, coat], [6, 0.8, coat]].map(([dx, dy, c]) => ln([x + dx, y - 10], [x + dx, y + dy - 0.6], c, 1.7) + `<rect x="${f2(x + dx - 0.9)}" y="${f2(y + dy - 1)}" width="1.8" height="1.4" fill="#5E4A3A"/>`).join('')
        + `<path d="M${f2(x + 8.6)},${f2(y - 14.4)} q${f % 2 ? 2.6 : 1.8},${f % 2 ? -1.6 : -2.4} 1.4,-3.6" stroke="${coat}" stroke-width="2" stroke-linecap="round" fill="none"/>`
        + ell(x + 0.6, y - 12.6, 9.4, 4.8, coat, ' stroke="rgba(120,105,80,.3)" stroke-width="0.6"')
        + ell(x + 1.4, y - 9.6, 7, 1.6, shade)
        + `<path d="M${f2(x - 6)},${f2(y - 16)} L${f2(hx + 1)},${f2(hy - 1)} L${f2(hx + 3)},${f2(hy + 2)} L${f2(x - 4.6)},${f2(y - 10.4)} Z" fill="${coat}"/>`
        + antler(hx + 2.4, hy - 2.2, 1, 'rgba(255,236,170,.35)', 3)
        + antler(hx + 2.4, hy - 2.2, 1, '#C8962E')
        + ell(hx, hy, 3.8, 2.5, coat, ' stroke="rgba(120,105,80,.3)" stroke-width="0.5"')
        + ell(hx - 2.6, hy + 0.9, 1.9, 1.4, shade) + dot(hx - 4.2, hy + 0.6, 0.8, '#5E4A3A')
        + dot(hx - 0.6, hy - 0.6, 0.65, '#2A2420')
        + `<ellipse cx="${f2(hx + 3.2)}" cy="${f2(hy - 1.4)}" rx="2.4" ry="1" fill="${coat}" stroke="rgba(120,105,80,.3)" stroke-width="0.4" transform="rotate(${f === 1 ? -45 : -20} ${f2(hx + 3.2)} ${f2(hy - 1.4)})"/>`
        + antler(hx + 0.4, hy - 2, -1, 'rgba(255,236,170,.35)', 3)
        + antler(hx + 0.4, hy - 2, -1, '#E9BF4E')
        + motes;
    }
  }]
};

export default {
  hache,
  scie,
  nichoir,
  charrette,
  'passe-partout': passePartout,
  ecureuil,
  cerf
};
