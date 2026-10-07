// Gisements (lot 9d), enseignes (lot 4d), îlots, bateaux et objets de la mer, au trait de la troupe. Géométrie reprise
// du jeu (depositSprites.js, nameSigns.js, isletSprites.js, visitors.js, sprites.js, chest.js, nature.js, terrain.js),
// dessinée en pixels du jeu dans un groupe agrandi × 1,25 : les cadres et les ancres du jeu × 1,25 restent justes.
const { OUT, P, E, L, r2 } = require('./troupe');
const { arbre } = require('./arbres');

const K = 1.25;
const W = 0.88; // trait de la troupe (1,1) une fois agrandi
const TAU = Math.PI * 2;
const up = body => `<g transform="scale(${K})">${body}</g>`;
const big = f => f.map(n => r2(n * K));
const gp = (u, v, z = 0) => [(u - v) * 32, (u + v) * 16 - z];
const pg = (pts, fill, w = W, sc = OUT) => `<polygon points="${pts.map(p => `${r2(p[0])},${r2(p[1])}`).join(' ')}" fill="${fill}"${w ? ` stroke="${sc}" stroke-width="${w}" stroke-linejoin="round"` : ''}/>`;
const rr = (x, y, w, h, r, fill, sw = W, sc = OUT, extra = '') => `<rect x="${r2(x)}" y="${r2(y)}" width="${r2(w)}" height="${r2(h)}" rx="${r2(r)}" fill="${fill}"${sw ? ` stroke="${sc}" stroke-width="${sw}" stroke-linejoin="round"` : ''}${extra}/>`;
const line = (d, w, c, extra = '') => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${r2(w)}" stroke-linecap="round" stroke-linejoin="round"${extra}/>`;
const tk = (d, w, c) => line(d, w + 1.76, OUT) + line(d, w, c);
const shade = (x, y, rx, ry, a = 0.22) => E(x, y, rx, ry, `rgba(40,55,20,${a})`, 0);
const star = (x, y, s, o = 1) => `<path d="M${r2(x)},${r2(y - s)} Q${r2(x + s * 0.18)},${r2(y - s * 0.18)} ${r2(x + s)},${r2(y)} Q${r2(x + s * 0.18)},${r2(y + s * 0.18)} ${r2(x)},${r2(y + s)} Q${r2(x - s * 0.18)},${r2(y + s * 0.18)} ${r2(x - s)},${r2(y)} Q${r2(x - s * 0.18)},${r2(y - s * 0.18)} ${r2(x)},${r2(y - s)} Z" fill="#FFFFFF" stroke="${OUT}" stroke-width="0.4" opacity="${o}"/>`;
// Boîte iso en pixels du jeu : dessus, face avant gauche (v = v1), face avant droite (u = u1)
function gbox(u0, v0, u1, v1, z0, z1, c, w = W * 0.8) {
  const q = (u, v, z) => gp(u, v, z);
  return pg([q(u0, v1, z0), q(u1, v1, z0), q(u1, v1, z1), q(u0, v1, z1)], c.left, w)
    + pg([q(u1, v1, z0), q(u1, v0, z0), q(u1, v0, z1), q(u1, v1, z1)], c.right, w)
    + pg([q(u0, v0, z1), q(u1, v0, z1), q(u1, v1, z1), q(u0, v1, z1)], c.top, w);
}
// Boules feuillues fondues en une seule silhouette (le trait ne passe qu'autour)
const blobs = list => list.map(([x, y, r]) => E(x, y, r + 0.7, r + 0.7, OUT, 0)).join('') + list.map(([x, y, r, c]) => E(x, y, r, r, c, 0)).join('');

const WOOD = { top: '#C99A62', left: '#B07A45', right: '#8A5A32' };
const WOOD_DARK = { top: '#8A5E38', left: '#6E4A2C', right: '#55381F' };

/* ================= Gisements : prêt (2 images) ou ramassé ================= */
const ICE = { left: '#BFE7F7', right: '#8CCBE8' };
const OBSIDIAN = { left: '#2C2A34', right: '#1C1A22' };
// Aiguille de cristal : deux facettes, un reflet, un seul trait autour
function spire(x, y, h, w, c, lean = 0) {
  const bl = [x - w, y], fr = [x, y + w * 0.45], br = [x + w, y], tip = [x + lean, y - h];
  return pg([bl, fr, br, tip], c.left, 0) + pg([fr, br, tip], c.right, 0)
    + L([x - w * 0.45 + lean * 0.2, y - h * 0.15], [x - w * 0.15 + lean * 0.7, y - h * 0.75], 'rgba(255,255,255,.8)', 0.8)
    + L(fr, tip, OUT, 0.35) + pg([bl, fr, br, tip], 'none');
}
// Mouton de trois quarts : laineux ou tondu ; head 1 : il broute. Corps près du sol, pattes courtes, tête claire au
// museau, oreille ; tondu : laine rase rosée et quelques bouclettes
function sheep(x, y, woolly, head = 0, flip = false) {
  const s = flip ? -1 : 1;
  const body = woolly ? '#F7F2E6' : '#EBD8CC';
  const hx = x + s * 8.4, hy = y - 7 + head * 3.6;
  let o = shade(x, y + 0.5, 8.6, 2.2) + [-4.2, -1.6, 2, 4.6].map((dx, i) => L([x + s * dx, y - 2.6], [x + s * dx, y - 0.2], i % 2 ? '#3D342E' : '#4A3E36', 1.6)).join('');
  if (woolly) {
    o += E(x, y - 5.6, 8, 4.6, body);
    o += [-5, -1.4, 2.4].map(dx => E(x + s * dx, y - 8.4, 3.6, 3.2, body, W)).join('') + E(x, y - 5, 7, 3.8, body, 0) + E(x + s, y - 3, 6, 1.2, '#E6DECC', 0);
  } else {
    o += P(`M${r2(x - 7)},${r2(y - 4)} Q${r2(x - 7.4)},${r2(y - 9)} ${r2(x - 2)},${r2(y - 9)} L${r2(x + 3)},${r2(y - 9.2)} Q${r2(x + 7.6)},${r2(y - 8.8)} ${r2(x + 7)},${r2(y - 4)} Q${r2(x + 6)},${r2(y - 1.6)} ${r2(x)},${r2(y - 1.8)} Q${r2(x - 6.4)},${r2(y - 1.6)} ${r2(x - 7)},${r2(y - 4)} Z`, body)
      + [[-3.6, -7], [0.4, -7.6], [3.8, -6.8], [-1.6, -4.6], [2.4, -4.4]].map(([dx, dy]) => E(x + s * dx, y + dy, 1, 0.8, '#F6E8DE', 0)).join('') + E(x + s, y - 2.8, 5.4, 0.9, '#DCC4B6', 0);
  }
  return o + E(hx - s * 1.8, hy - 1.6, 1.6, 0.9, '#3D342E', 0.6) + E(hx, hy, 2.8, 2.1, '#3D342E', W) + E(hx + s * 1.2, hy + 0.6, 1.3, 0.9, '#6B5A50', 0) + E(hx + s * 0.6, hy - 0.7, 0.5, 0.5, '#F4ECDC', 0);
}
// Massette : tige qui plie, épi brun
const cattail = (x, y, h, sway, head = true) => line(`M${r2(x)},${r2(y)} q${r2(sway * 0.3)},${r2(-h * 0.5)} ${r2(sway)},${r2(-h)}`, 2.3, OUT) + line(`M${r2(x)},${r2(y)} q${r2(sway * 0.3)},${r2(-h * 0.5)} ${r2(sway)},${r2(-h)}`, 1.1, '#5F8F3C')
  + (head ? E(x + sway, y - h + 2.5, 1.7, 3.6, '#8A5A2E', W * 0.8) : '');
// Cube de sel iso
const cube = (cx, cy, s) => pg([[cx - s, cy], [cx, cy + s * 0.5], [cx, cy - s * 0.9], [cx - s, cy - s * 1.4]], '#F4EEE8', 0)
  + pg([[cx, cy + s * 0.5], [cx + s, cy], [cx + s, cy - s * 1.4], [cx, cy - s * 0.9]], '#DCD2C8', 0)
  + pg([[cx - s, cy - s * 1.4], [cx, cy - s * 0.9], [cx + s, cy - s * 1.4], [cx, cy - s * 1.9]], '#FFFFFF', 0)
  + pg([[cx - s, cy], [cx, cy + s * 0.5], [cx + s, cy], [cx + s, cy - s * 1.4], [cx, cy - s * 1.9], [cx - s, cy - s * 1.4]], 'none', 0.7);
function fruitTree(fruits, f) {
  const sw = fruits ? (f ? 1.2 : -1.2) : 0;
  let o = shade(0, 1, 13, 5, 0.18) + P('M-2,0 Q-3,-12 0,-22 L3,-22 Q2,-10 3,0 Q0.5,1.4 -2,0 Z', WOOD_DARK.left, W);
  o += blobs([[-9 + sw, -26, 9, '#2F7A3A'], [9 + sw, -27, 9, '#2F7A3A'], [0 + sw, -34, 11, '#3E8A48']]);
  o += E(-4 + sw, -28, 8, 8, '#5FAE5A', 0) + E(5 + sw, -31, 6, 6, '#8FD06E', 0) + E(-1 + sw, -38, 4, 3, '#A8DC84', 0);
  if (fruits) for (const [dx, dy] of [[-8, -22], [7, -24], [-2, -28], [10, -31], [-10, -30], [2, -20]]) o += E(dx + sw, dy, 2.3, 2.8, '#F2B23C', W * 0.7) + E(dx + sw - 0.6, dy - 1, 0.7, 0.7, '#FFE39A', 0);
  return o;
}
// frames : cadres du jeu [prêt, ramassé], × 1,25 à l'export
const G = {
  // Cristaux de glace : une plaque de neige aux bords bosselés, des grappes d'aiguilles à facettes (pan clair, pan d'ombre,
  // pointe éclairée, reflet) qui scintillent ; ramassés, des moignons dans la neige
  glace: {
    frames: [[-30, -46, 60, 56], [-24, -16, 48, 26]],
    draw: (spent, f) => {
      const neige = (rx, ry) => { const n = 14, pts = Array.from({ length: n }, (_, i) => { const t = (i / n) * TAU, r = 1 + (i % 2 ? 0.06 : -0.03); return [Math.cos(t) * rx * r, 1 + Math.sin(t) * ry * r]; }); const m = i => { const p = pts[i % n], q = pts[(i + 1) % n]; return `${r2((p[0] + q[0]) / 2)},${r2((p[1] + q[1]) / 2)}`; }; let d = `M${m(n - 1)}`; for (let i = 0; i < n; i++) d += ` Q${r2(pts[i][0])},${r2(pts[i][1])} ${m(i)}`; return P(d + ' Z', '#FFFFFF', W) + E(rx * 0.15, 2, rx * 0.7, ry * 0.5, '#E2EEF6', 0); };
      const facette = (x, y, h, w, lean = 0) => { const tip = [x + lean, y - h], bl = [x - w, y], br = [x + w, y], fb = [x, y + w * 0.45];
        return pg([bl, tip, fb], '#C9ECFA', 0) + pg([fb, tip, br], '#8CCBE8', 0) + pg([tip, [bl[0] + (tip[0] - bl[0]) * 0.72, bl[1] + (tip[1] - bl[1]) * 0.72], [fb[0] + (tip[0] - fb[0]) * 0.72, fb[1] + (tip[1] - fb[1]) * 0.72]], '#F6FDFF', 0)
          + L([x - w * 0.45, y - h * 0.12], [x - w * 0.15 + lean * 0.6, y - h * 0.6], 'rgba(255,255,255,.9)', 0.7) + pg([bl, tip, br, fb], 'none', W * 0.9); };
      if (spent) return neige(14, 5) + facette(-6, 1, 5, 3.4, -1) + facette(5, 1.6, 6, 3.6, 1) + facette(0, 3.4, 4, 3);
      return shade(0, 2, 18, 6, 0.12) + neige(19, 7)
        + facette(-12, 0, 13, 3.6, -3) + facette(-7, -1, 21, 4.6, -1.5) + facette(9, -1, 15, 4, 2.6) + facette(13, 1.4, 9, 3, 3)
        + facette(-1, 2.4, 33, 6.2, 0.6) + facette(5, 4.6, 18, 4.4, 1.6) + facette(-5, 5, 10, 3.2, -1)
        + E(-1, 6.4, 9, 1.8, '#FFFFFF', 0) + (f ? star(9, -17, 2.6) + star(-8, -22, 2.2) : star(0, -31, 3.2) + star(14, -8, 1.8));
    }
  },
  // Moutons à tondre : un pré aux bords bosselés, ses touffes et ses fleurettes ; deux brebis laineuses en bouclettes
  // cernées d'un seul trait, tête noire, oreilles, œil, queue, qui broutent tour à tour ; tondues, rosées et lisses, elles
  // broutent au milieu des flocons de laine tombés
  laine: {
    frames: [[-30, -26, 60, 34], [-30, -24, 60, 32]],
    draw: (spent, f) => {
      const pre = () => { const n = 16, rx = 25, ry = 6.4, pts = Array.from({ length: n }, (_, i) => { const t = (i / n) * TAU, r = 1 + (i % 2 ? 0.05 : -0.03); return [Math.cos(t) * rx * r, 0.4 + Math.sin(t) * ry * r]; }); const m = i => { const p = pts[i % n], q = pts[(i + 1) % n]; return `${r2((p[0] + q[0]) / 2)},${r2((p[1] + q[1]) / 2)}`; }; let d = `M${m(n - 1)}`; for (let i = 0; i < n; i++) d += ` Q${r2(pts[i][0])},${r2(pts[i][1])} ${m(i)}`; return P(d + ' Z', '#9CC874', W) + E(-3, 0.2, 18, 4, '#AED486', 0); };
      const brebis = (x, y, laineux, broute, flip = false) => {
        const s = flip ? -1 : 1, Lc = laineux ? '#F7F2E6' : '#EFDCCF', LS = laineux ? '#E2D8C4' : '#DCC4B6';
        let o = shade(x, y + 1.4, 8.6, 2.2) + E(x - s * 7.4, y - 6, 1.7, 1.6, Lc, W * 0.8)
          + [-4.4, -1.8, 2, 4.6].map((dx, i) => line(`M${r2(x + s * dx)},${r2(y - 2.6)} L${r2(x + s * dx)},${r2(y + 1.2)}`, 1.8, OUT) + line(`M${r2(x + s * dx)},${r2(y - 2.6)} L${r2(x + s * dx)},${r2(y + 0.8)}`, 1, i % 2 ? '#4A3E36' : '#3D342E')).join('');
        if (laineux) {
          const B = [[-6, -6.4, 3.1], [-3.4, -9.2, 3.3], [0.4, -9.8, 3.5], [4, -8.8, 3.2], [6.2, -6.2, 2.9], [3.4, -4.6, 3.3], [-1, -4.4, 3.5], [-5, -4.6, 2.9]];
          o += B.map(([dx, dy, r]) => E(x + s * dx, y + dy, r + W, r + W, OUT, 0)).join('') + B.map(([dx, dy, r]) => E(x + s * dx, y + dy, r, r, Lc, 0)).join('')
            + E(x + s * 0.5, y - 3.4, 6, 1.5, LS, 0) + [[-3.6, -7.2], [0.6, -7.8], [3.8, -6.6], [-1.6, -4.8], [2.6, -4.4], [-5, -5]].map(([dx, dy]) => line(`M${r2(x + s * dx - 1)},${r2(y + dy)} q1,-1.2 2,0`, 0.6, LS)).join('')
            + E(x - s * 1.4, y - 9.6, 2, 0.8, '#FFFFFF', 0);
        } else {
          o += P(`M${r2(x - 6.8)},${r2(y - 4)} Q${r2(x - 7.2)},${r2(y - 8.6)} ${r2(x - 2)},${r2(y - 8.8)} L${r2(x + 3)},${r2(y - 9)} Q${r2(x + 7.4)},${r2(y - 8.6)} ${r2(x + 6.8)},${r2(y - 4)} Q${r2(x + 6)},${r2(y - 1.6)} ${x},${r2(y - 1.8)} Q${r2(x - 6.2)},${r2(y - 1.6)} ${r2(x - 6.8)},${r2(y - 4)} Z`, Lc, W)
            + [[-3.6, -6.8], [0.4, -7.4], [3.8, -6.6], [-1.6, -4.4], [2.4, -4.2]].map(([dx, dy]) => E(x + s * dx, y + dy, 0.9, 0.7, '#F8EAE0', 0)).join('') + E(x + s, y - 2.8, 5.2, 0.9, LS, 0);
        }
        const hx = x + s * 8.6, hy = y - 7 + (broute ? 4.4 : 0);
        return o + E(hx - s * 2, hy - 1.2, 1.9, 0.9, '#3D342E', 0.6) + E(hx, hy, 2.9, 2.3, '#3D342E', W) + E(hx + s * 1.3, hy + 0.7, 1.3, 0.95, '#6B5A50', 0)
          + E(hx + s * 0.3, hy - 0.8, 0.75, 0.75, '#FFFFFF', 0) + E(hx + s * 0.45, hy - 0.8, 0.38, 0.38, '#1E1814', 0) + E(hx + s * 1.9, hy - 1.7, 1.3, 0.6, '#3D342E', 0.5)
          + (laineux ? E(hx - s * 0.6, hy - 2.2, 1.9, 1.2, Lc, 0.6) : '')
          + (broute ? line(`M${r2(hx + s * 1.6)},${r2(hy + 3.2)} l${-s * 0.6},-2.6 M${r2(hx + s * 2.6)},${r2(hy + 3.2)} l${s * 0.6},-2.2`, 0.8, '#5F8F3C') : '');
      };
      const deco = tuft(-23, 3) + tuft(19, 4.6) + tuft(-4, 5.6) + flower(-17, 4.6, 1.1, '#FFFFFF') + flower(21, 0.6, 1.1, '#F7B6C8') + flower(12, 5.6, 1, '#FFFFFF');
      if (spent) return pre() + deco + [[-20, 0], [-2, 5], [16, -1], [0, -4]].map(([x, y]) => E(x, y, 1.6, 1.1, '#F7F2E6', 0.6) + E(x + 1.2, y - 0.4, 1, 0.8, '#F7F2E6', 0.5)).join('') + brebis(-11, -2, false, 1) + brebis(6, 4, false, 0);
      return pre() + deco + brebis(-11, -2, true, f ? 0 : 1) + brebis(6, 4, true, f ? 1 : 0);
    }
  },
  // Roseaux : une petite mare à la berge herbue, ses reflets et ses ronds ; une touffe de massettes cernées aux épis
  // bruns éclairés et à la pointe fine, de longues feuilles en lame, un nénuphar fleuri ; elles ondulent ; coupés, des
  // tiges courtes au biseau clair
  roseau: {
    frames: [[-24, -44, 48, 52], [-20, -14, 40, 22]],
    draw: (spent, f) => {
      const mare = (rx, ry) => E(0, 1.4, rx + 2.4, ry + 1.6, '#86B852', W) + E(0, 1.4, rx, ry, '#7FC0E2', W) + E(-rx * 0.25, 0.8, rx * 0.55, ry * 0.45, '#A6D8F0', 0) + line(`M${r2(-rx * 0.5)},${r2(ry * 0.5)} l4,-0.5 M${r2(rx * 0.2)},${r2(ry * 0.8)} l3,-0.4`, 0.8, '#FFFFFF');
      const lame = (x, y, h, sw, c) => { const d = `M${r2(x - 1.1)},${y} Q${r2(x + sw * 0.4 - 1)},${r2(y - h * 0.55)} ${r2(x + sw)},${r2(y - h)} Q${r2(x + sw * 0.4 + 1.2)},${r2(y - h * 0.5)} ${r2(x + 1.1)},${y} Z`; return P(d, c, W * 0.8) + line(`M${x},${y - 1} Q${r2(x + sw * 0.4)},${r2(y - h * 0.5)} ${r2(x + sw * 0.9)},${r2(y - h * 0.92)}`, 0.5, '#4E7A30'); };
      const massette = (x, y, h, sw) => { const tx = x + sw, ty = y - h; return tk(`M${r2(x)},${r2(y)} q${r2(sw * 0.3)},${r2(-h * 0.5)} ${r2(sw)},${r2(-h)}`, 1.1, '#5F8F3C')
        + rr(tx - 1.8, ty + 1.5, 3.6, 7.4, 1.8, '#8A5A2E', W * 0.8) + line(`M${r2(tx - 0.7)},${r2(ty + 2.8)} L${r2(tx - 0.7)},${r2(ty + 7.6)}`, 0.7, '#B88552') + line(`M${r2(tx)},${r2(ty + 1.5)} l${r2(sw * 0.08)},-3.4`, 0.7, '#5F8F3C'); };
      if (spent) return mare(12, 4) + [-8, -4, 0, 4, 8].map((dx, k) => { const yb = (k % 2) * 2, h = 5 + (k % 3) * 1.6; return tk(`M${dx},${yb} L${r2(dx + 0.3)},${r2(yb - h)}`, 1.2, '#5F8F3C') + pg([[dx - 0.8, yb - h + 0.6], [dx + 1.4, yb - h - 0.6], [dx + 1.4, yb - h + 0.4]], '#C8DC8A', 0); }).join('') + lame(-6, 2, 5, -1.4, '#7FA45A') + lame(6, 2.4, 6, 1.6, '#8FB866');
      const sw = k => (f ? 1.6 : -1.4) * (0.6 + (k % 3) * 0.3);
      let o = shade(0, 2, 17, 5, 0.12) + mare(14, 4.6);
      o += lame(-11, 1, 16, -4 + sw(0) * 0.5, '#7FA45A') + lame(9, 1.4, 18, 4 + sw(1) * 0.5, '#7FA45A');
      [[-12, 20], [-9, 26], [-5, 32], [-1, 36], [3, 30], [7, 34], [11, 24]].forEach(([dx, h], k) => { o += massette(dx, (k % 2) * 2, h, sw(k)); });
      o += lame(-7, 2.4, 12, -2.4 + sw(2) * 0.4, '#8FB866') + lame(1, 3, 14, 1.4 + sw(3) * 0.4, '#8FB866') + lame(6, 2.6, 10, 2.6 + sw(4) * 0.4, '#9CC470');
      return o + P('M8,4.4 a3.4,1.3 0 1 1 1,1 Z', '#6FAE4E', W * 0.7) + E(8.6, 3.6, 1.1, 0.8, '#F7B6CE', 0.5) + `<ellipse cx="-6" cy="5" rx="${2.4 + f}" ry="${0.8 + f * 0.3}" fill="none" stroke="#E2F4FC" stroke-width="0.6"/>`;
    }
  },
  // Croûte de sel : une plaque blanche aux bords bosselés, craquelée en alvéoles, une flaque de saumure rosée ; des cubes de
  // sel empilés qui accrochent le soleil ; ramassée, une croûte grise grattée, ses fentes et quelques grains
  sel: {
    frames: [[-30, -26, 60, 36], [-26, -10, 52, 20]],
    draw: (spent, f) => {
      const plaque = (rx, ry, fill, edge) => { const n = 16, pts = Array.from({ length: n }, (_, i) => { const t = (i / n) * TAU, r = 1 + (i % 2 ? 0.05 : -0.03); return [Math.cos(t) * rx * r, 0.6 + Math.sin(t) * ry * r]; }); const m = i => { const p = pts[i % n], q = pts[(i + 1) % n]; return `${r2((p[0] + q[0]) / 2)},${r2((p[1] + q[1]) / 2)}`; }; let d = `M${m(n - 1)}`; for (let i = 0; i < n; i++) d += ` Q${r2(pts[i][0])},${r2(pts[i][1])} ${m(i)}`; return P(d + ' Z', fill, W) + E(rx * 0.12, ry * 0.25, rx * 0.8, ry * 0.55, edge, 0); };
      const alveoles = c => line('M-16,-1 l5,-2 l6,1 l4,-2 l7,1 M-11,-3 l1,4 l-4,3 M-5,-2 l2,4 l6,1 l2,3 M3,-3 l1,4 l7,1 M11,2 l3,-3 M-8,4 l5,1', 0.7, c);
      if (spent) return plaque(20, 7.6, '#E2DAD0', '#D6CCC0') + alveoles('#B8AB9A') + line('M-12,-1 q4,2 8,0 M4,3 q4,-1.6 8,0', 0.9, '#C8BCAC') + [[-6, 1], [7, -1], [1, 4]].map(([x, y]) => E(x, y, 1, 0.7, '#FFFFFF', 0.4)).join('');
      return shade(0, 2, 22, 7, 0.12) + plaque(22, 8.4, '#FFFFFF', '#F2EEE8') + E(7, 0.4, 8.6, 3, '#F4C6D0', 0.5) + E(5.6, -0.2, 4.6, 1.3, '#FBE2E8', 0) + alveoles('#DDD3C8')
        + cube(-13, 0.6, 2.2) + cube(-2, -2.6, 2.8) + cube(11, -2, 2.4) + cube(-7, 3, 3.2) + cube(3.6, 3.4, 3.8) + cube(14, 3, 1.9) + cube(-15, 4, 1.5)
        + (f ? star(-8, -6, 2.4) + star(14, -7, 1.6) : star(4, -8, 2.8) + star(-13, -3, 1.6));
    }
  },
  // Arbre à fruits : un petit manguier (l'arbre refait, en vert profond) chargé de mangues dorées, rosies au soleil, qui
  // se balance ; cueilli, il garde ses feuilles
  fruits: {
    frames: [[-24, -50, 48, 58], [-24, -50, 48, 58]],
    draw: (spent, f) => {
      const mangue = (x, y, s, i) => P(`M${r2(x)},${r2(y - 2.4 * s)} Q${r2(x + 2.5 * s)},${r2(y - 2 * s)} ${r2(x + 2.1 * s)},${r2(y + 0.9 * s)} Q${r2(x + 1.3 * s)},${r2(y + 3 * s)} ${r2(x - 0.4 * s)},${r2(y + 2.7 * s)} Q${r2(x - 2.5 * s)},${r2(y + 1.7 * s)} ${r2(x - 1.9 * s)},${r2(y - 0.6 * s)} Q${r2(x - 1.3 * s)},${r2(y - 2.6 * s)} ${r2(x)},${r2(y - 2.4 * s)} Z`, '#F6C443', 0.9)
        + E(x + 0.7 * s, y + 1.1 * s, 1.2 * s, 0.9 * s, i % 3 ? '#F2924A' : '#EE7A5A', 0) + E(x - 0.8 * s, y - 0.9 * s, 0.45 * s, 0.7 * s, '#FFF6D0', 0)
        + line(`M${r2(x)},${r2(y - 2.3 * s)} q0.3,-1.4 1,-2`, 0.9, OUT);
      const fruits = spent ? '' : [[-20, -38], [-11, -45], [-25, -45], [-5, -36], [3, -51], [10, -39], [18, -35], [21, -43], [-2, -59], [12, -56]].map(([x, y], i) => mangue(x, y, 1.15, i)).join('');
      return `<g transform="rotate(${spent ? 0 : f ? 1.2 : -1.2}) scale(${r2(0.87 / K)})">${arbre({ vert: 'profond', petit: true })}${fruits}</g>`;
    }
  },
  // Éclats d'obsidienne : une plaque de cendre aux bords bosselés et ses fentes de braise ; des lames noires à facettes au
  // reflet violet, qui luisent de braises au pied ; ramassés, des cailloux sombres dans la cendre
  obsidienne: {
    frames: [[-28, -38, 56, 48], [-22, -12, 44, 20]],
    draw: (spent, f) => {
      const cendre = (rx, ry) => { const n = 14, pts = Array.from({ length: n }, (_, i) => { const t = (i / n) * TAU, r = 1 + (i % 2 ? 0.06 : -0.03); return [Math.cos(t) * rx * r, 1 + Math.sin(t) * ry * r]; }); const m = i => { const p = pts[i % n], q = pts[(i + 1) % n]; return `${r2((p[0] + q[0]) / 2)},${r2((p[1] + q[1]) / 2)}`; }; let d = `M${m(n - 1)}`; for (let i = 0; i < n; i++) d += ` Q${r2(pts[i][0])},${r2(pts[i][1])} ${m(i)}`; return P(d + ' Z', '#6E6460', W) + E(rx * 0.1, 1.6, rx * 0.7, ry * 0.5, '#7C726C', 0); };
      const caillou = (x, y, rx, ry) => E(x, y, rx, ry, '#2E2B36', W) + E(x - rx * 0.3, y - ry * 0.35, rx * 0.45, ry * 0.3, '#4A4258', 0) + E(x - rx * 0.4, y - ry * 0.45, rx * 0.15, ry * 0.12, '#B9A6E8', 0);
      const lame = (x, y, h, w, lean = 0) => { const tip = [x + lean, y - h], bl = [x - w, y], br = [x + w, y], fb = [x, y + w * 0.45];
        return pg([bl, tip, fb], '#3A3644', 0) + pg([fb, tip, br], '#1E1C24', 0) + pg([tip, [bl[0] + (tip[0] - bl[0]) * 0.7, bl[1] + (tip[1] - bl[1]) * 0.7], [fb[0] + (tip[0] - fb[0]) * 0.7, fb[1] + (tip[1] - fb[1]) * 0.7]], '#5A5068', 0)
          + L([x - w * 0.45, y - h * 0.1], [x - w * 0.12 + lean * 0.6, y - h * 0.62], `rgba(185,166,232,${f ? 0.95 : 0.55})`, 0.9) + pg([bl, tip, br, fb], 'none', W * 0.9); };
      const braises = line('M-12,3 l3,1.4 l3,-1 M6,4 l3,-1.2 l3,1', 1.2, '#E0602E') + line('M-12,3 l3,1.4 l3,-1 M6,4 l3,-1.2 l3,1', 0.5, '#FFC46A');
      if (spent) return cendre(14, 5) + caillou(-4, 1.4, 4.6, 3) + caillou(6, 2.4, 3.8, 2.6) + caillou(1, 4.8, 3, 2);
      return shade(0, 2, 16, 5, 0.18) + cendre(17, 6) + braises + E(0, 2, 13, 3.6, `rgba(255,120,50,${f ? 0.3 : 0.18})`, 0)
        + lame(-10, 0, 13, 4, -3) + lame(-6, -1, 19, 4.6, -1.4) + lame(8, 0, 17, 4.6, 2.4) + lame(12, 2, 9, 3, 2.6)
        + caillou(7, 6, 4, 2.6) + lame(0, 3.4, 26, 5.8, 0.4) + lame(-4, 5, 10, 3.2, -1)
        + E(-5, 4, 1.4, 0.8, f ? '#FF8A4A' : '#E8573A', 0) + E(4, 6.4, 1, 0.6, f ? '#FFB04A' : '#E8573A', 0) + (f ? star(0, -24, 2.4) + star(-7, -17, 1.6) : star(9, -15, 1.8));
    }
  }
};

/* ================= Enseignes : le nom n'est pas dessiné (le jeu l'écrit dans le cadre du texte) ================= */
const SW = { light: '#D39A5E', mid: '#B07A45', dark: '#7E5230', deep: '#5E3B22' };
const IRON = '#3B3C42';
function stake(x, y0, y1, w = 3.2, sharp = false, c = SW) {
  const h = w / 2;
  return pg([[x - h, y0], [x - h, y1], ...(sharp ? [[x, y1 - 2.4]] : []), [x + h, y1], [x + h, y0]], c.mid) + L([x + h * 0.4, y0 - 0.4], [x + h * 0.4, y1 + 0.8], c.dark, h * 0.6);
}
const tuft = (x, y) => tk(`M${x},${y} l-2.2,-3.6 M${x + 0.6},${y} l0.2,-4.4 M${x + 1.2},${y} l1.8,-3.2`, 0.8, '#7DBF55');
function flower(x, y, r, color) {
  let o = '';
  for (let k = 0; k < 5; k++) { const a = (k / 5) * TAU - Math.PI / 2; o += E(x + Math.cos(a) * r * 0.9, y + Math.sin(a) * r * 0.9, r * 0.62, r * 0.62, color, 0.4); }
  return o + E(x, y, r * 0.48, r * 0.48, '#F6C443', 0.3);
}
const leaf = (x, y, a, color) => `<ellipse cx="${r2(x)}" cy="${r2(y)}" rx="2.6" ry="1.2" fill="${color}" stroke="${OUT}" stroke-width="0.4" transform="rotate(${r2((a * 180) / Math.PI)} ${r2(x)} ${r2(y)})"/>`;
function butterfly(x, y, open, color) {
  const w = open ? 2.4 : 0.9;
  return E(x - w * 0.62, y, w, 1.9, color, 0.5) + E(x + w * 0.62, y, w, 1.9, color, 0.5) + L([x, y - 1.6], [x, y + 1.6], '#3A2A20', 0.7);
}
// Planche entourée d'un liseré de couleur, et du trait de la troupe juste autour
const framed = (x, y, w, h, r, fill, edge, ew) => rr(x, y, w, h, r, 'none', ew + 1.5, OUT) + rr(x, y, w, h, r, fill, ew, edge);

const S = {};
S.bois = { n: 1, draw: () => shade(0, 0.6, 19, 4)
  + stake(-15, 1, -33, 3.2, true) + stake(15, 1, -33, 3.2, true)
  + rr(-20, -29.6, 42, 17, 2, SW.deep, 0) + rr(-21, -31, 42, 17, 2, SW.light)
  + L([-20.4, -22.5], [20.4, -22.5], SW.dark, 0.9) + L([-19, -29.7], [19, -29.7], 'rgba(255,255,255,.3)', 0.8) + L([-19, -21.4], [19, -21.4], 'rgba(255,255,255,.2)', 0.7)
  + L([-14, -26], [-6, -26.3], 'rgba(126,82,48,.35)', 0.5) + L([7, -17.4], [16, -17.1], 'rgba(126,82,48,.35)', 0.5)
  + [[-18.6, -28.6], [18.6, -28.6], [-18.6, -16.4], [18.6, -16.4]].map(([x, y]) => E(x, y, 0.85, 0.85, '#4E3626', 0)).join('')
  + tuft(-18, 1) + tuft(13.5, 1.4) };
S.ardoise = { n: 1, draw: () => {
  const chalk = 'rgba(244,241,232,.85)';
  return shade(0, 0.6, 21, 4)
    + tk('M-12,-37 L-17,1 M12,-37 L17,1', 1.8, SW.deep)
    + pg([[-15.5, -38], [15.5, -38], [20, -6], [-20, -6]], SW.mid)
    + pg([[-13.2, -35.6], [13.2, -35.6], [17.2, -8.6], [-17.2, -8.6]], '#2F3533', 0.6, '#1E2221')
    + L([-12.6, -34.4], [12, -34.4], 'rgba(255,255,255,.08)', 1.2)
    + rr(-21, -7, 42, 2.6, 1, SW.dark, 0.6) + tk('M-19.5,-4.4 L-20.5,1 M19.5,-4.4 L20.5,1', 1.6, SW.mid)
    + line('M-10,-20.5 q2.5,-2 5,0 t5,0 t5,0 t5,0', 0.8, chalk) + `<path d="M0,-17.2 l0.9,1.9 2,.2 -1.5,1.3 .5,2 -1.9,-1 -1.9,1 .5,-2 -1.5,-1.3 2,-.2z" fill="${chalk}"/>`
    + E(-7, -14, 0.6, 0.6, chalk, 0) + E(7, -14, 0.6, 0.6, chalk, 0) + E(-9.5, -12, 0.5, 0.5, chalk, 0)
    + rr(5, -8.3, 5, 1.4, 0.6, '#F7F4EC', 0.4) + L([-14, -9.6], [-6, -9.4], 'rgba(244,241,232,.25)', 0.6);
} };
const FER_PIVOT = [0, -43];
S.fer = { n: 4, draw: f => {
  const deg = 0.06 * Math.sin((f / 4) * TAU) * 180 / Math.PI;
  const chain = x => `<line x1="${x}" y1="-42.8" x2="${x}" y2="-35.2" stroke="${IRON}" stroke-width="1.2" stroke-dasharray="1.5 0.9"/>`;
  return shade(-20, 0.6, 6, 2.6) + shade(0, 0.6, 13, 2.8)
    + E(-20, 0.2, 4.2, 1.6, '#55565C', W * 0.7) + rr(-21.3, -47, 2.6, 47.5, 0.8, IRON, W * 0.6) + L([-19.6, -46], [-19.6, 0], 'rgba(255,255,255,.2)', 0.6)
    + E(-20, -48.6, 2.1, 2.1, IRON, W * 0.6) + E(-20.6, -49.2, 0.7, 0.7, 'rgba(255,255,255,.4)', 0)
    + rr(-20, -44.4, 40, 2.2, 1, IRON, W * 0.6) + E(20.4, -43.3, 1.5, 1.5, IRON, W * 0.6)
    + line('M-19.6,-33 C-12,-33.5 -8,-37 -6.5,-42.4', 1.4, IRON) + `<circle cx="-12.4" cy="-37.6" r="2.3" fill="none" stroke="${IRON}" stroke-width="1.1"/>` + E(-11.2, -38.2, 0.7, 0.7, IRON, 0)
    + `<g transform="rotate(${r2(deg)} ${FER_PIVOT[0]} ${FER_PIVOT[1]})">` + chain(-12) + chain(12)
    + rr(-16.2, -34, 34, 16, 2.5, '#3E2716', 0) + framed(-17, -35, 34, 16, 2.5, '#5B3B24', '#D9A441', 1.3)
    + rr(-15.2, -33.2, 30.4, 12.4, 1.6, 'none', 0.6, 'rgba(255,222,150,.3)')
    + E(-12, -34.6, 1.1, 1.1, '#D9A441', 0.4) + E(12, -34.6, 1.1, 1.1, '#D9A441', 0.4) + '</g>';
} };
S.laiton = { n: 2, draw: f => {
  const stone = '#BDB5A8';
  return '<defs><linearGradient id="laiton-brass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FBE29A"/><stop offset=".45" stop-color="#E2B04B"/><stop offset="1" stop-color="#B57F24"/></linearGradient>'
    + '<clipPath id="laiton-plaque"><rect x="-18" y="-28" width="36" height="16" rx="1.6"/></clipPath></defs>'
    + shade(0, 0.6, 25, 4.5)
    + rr(-23, -5, 46, 5.6, 1.4, '#A39B8E', W * 0.8) + rr(-21, -31, 42, 27, 2, stone)
    + L([-21, -17.5], [-18.2, -17.5], 'rgba(90,80,70,.4)', 0.6) + L([18.2, -12], [21, -12], 'rgba(90,80,70,.4)', 0.6)
    + L([-8, -4.6], [-8, -10.6], 'rgba(90,80,70,.35)', 0.6) + L([9, -4.6], [9, -10.6], 'rgba(90,80,70,.35)', 0.6)
    + rr(-24, -34.4, 48, 4.6, 1.6, '#D3CCC0') + L([-22, -33.2], [22, -33.2], 'rgba(255,255,255,.55)', 0.7)
    + framed(-18, -28, 36, 16, 1.6, 'url(#laiton-brass)', '#8A6418', 0.9)
    + rr(-16.4, -26.4, 32.8, 12.8, 1, 'none', 0.6, 'rgba(255,248,220,.65)')
    + [[-16.2, -26.2], [16.2, -26.2], [-16.2, -13.8], [16.2, -13.8]].map(([x, y]) => E(x, y, 0.95, 0.95, '#FFF1C2', 0) + E(x + 0.2, y + 0.25, 0.45, 0.45, '#A9781F', 0)).join('')
    + E(-20, -2.4, 1.6, 1.6, '#7FA65A', 0.5) + E(-17.4, -1.6, 1.1, 1.1, '#9BC46E', 0.5) + E(19.6, -2, 1.3, 1.3, '#7FA65A', 0.5)
    + (f ? `<g clip-path="url(#laiton-plaque)"><polygon points="4,-28 9,-28 3,-12 -2,-12" fill="rgba(255,255,240,.6)"/><polygon points="11,-28 12.4,-28 6.4,-12 5,-12" fill="rgba(255,255,240,.45)"/></g>` : '');
} };
const PETALS = ['#F7A8C8', '#FFFFFF', '#FFD166', '#C9A7EB'];
S.fleurie = { n: 2, draw: f => {
  let garland = '';
  for (let k = 0; k <= 12; k++) { const x = -24 + k * 4; garland += leaf(x, -30.4 - 1.8 * Math.sin((Math.PI * (x + 24)) / 48) + 0.6, k % 2 ? 0.5 : -0.5, k % 2 ? '#6FAE4E' : '#8FCB6A'); }
  for (let k = 0; k <= 6; k++) { const x = -22 + k * 7.3; garland += flower(x, -31.4 - 1.8 * Math.sin((Math.PI * (x + 24)) / 48), 1.9, PETALS[k % 4]); }
  const bunch = (x, y) => leaf(x - 2, y - 1, -0.8, '#6FAE4E') + leaf(x + 2.2, y - 1.2, 0.8, '#8FCB6A') + flower(x - 1.6, y - 3.6, 1.6, '#F7A8C8') + flower(x + 1.8, y - 2.8, 1.4, '#FFFFFF');
  const a = f ? Math.PI : 0;
  return shade(0, 0.6, 20, 4)
    + stake(-17, 1, -28, 3, false, { mid: '#F3EBDD', dark: '#D6CBB8' }) + stake(17, 1, -28, 3, false, { mid: '#F3EBDD', dark: '#D6CBB8' })
    + rr(-20.2, -28, 42, 17, 3, '#D9C9A8', 0) + framed(-21, -29.2, 42, 17, 3, '#FFF4DC', '#7FA866', 1.2)
    + rr(-19, -27.2, 38, 13, 2, 'none', 0.6, 'rgba(127,168,102,.55)', ' stroke-dasharray="1.6 1.2"')
    + garland + bunch(-17, 1.4) + bunch(16.6, 1.6)
    + butterfly(-24 + 3 * Math.cos(a), -38 + 2.2 * Math.sin(2 * a), !f, '#F59AC0') + butterfly(22 + 2.6 * Math.cos(a + 2.2), -35.5 + 2 * Math.sin(2 * a + 1), !!f, '#9CC8F2');
} };
S.lanterne = { n: 2, draw: f => {
  const one = (x, kk) => pg([[x - 3.6, -38.6], [x + 3.6, -38.6], [x + 2.4, -40.6], [x - 2.4, -40.6]], IRON, 0.5)
    + rr(x - 3.2, -38.6, 6.4, 8.4, 1, `rgba(255,${r2(205 + 25 * kk)},${r2(120 + 30 * kk)},.95)`, 0.9, IRON)
    + E(x, -33.8, 1.3 + 0.3 * kk, 2.4 + 0.7 * kk, '#FFF4C8', 0) + L([x, -38.6], [x, -30.2], 'rgba(59,60,66,.6)', 0.6)
    + pg([[x - 3, -30.2], [x + 3, -30.2], [x + 1.4, -28.8], [x - 1.4, -28.8]], IRON, 0.5);
  return shade(0, 0.6, 24, 4)
    + stake(-19, 1, -42, 3.2, false, { mid: SW.dark, dark: SW.deep }) + stake(19, 1, -42, 3.2, false, { mid: SW.dark, dark: SW.deep })
    + pg([[-27, -43.6], [0, -50.4], [27, -43.6]], '#8A5536') + rr(-27, -44.6, 54, 3.6, 1.2, SW.mid, W * 0.8) + L([-25, -43.6], [25, -43.6], 'rgba(255,255,255,.25)', 0.6)
    + rr(-16.2, -35.2, 34, 17, 2, '#1E2B4A', 0) + framed(-17, -36.4, 34, 17, 2, '#2F3F68', '#E2B546', 1.3)
    + star(-14, -33.4, 1.2) + star(13.6, -33, 1) + E(-13.4, -22.6, 0.45, 0.45, '#F4E3A8', 0) + E(14, -22.2, 0.55, 0.55, '#F4E3A8', 0)
    + L([-24, -41], [-24, -38.6], IRON, 0.8) + L([24, -41], [24, -38.6], IRON, 0.8)
    + one(-24, f ? 1 : 0) + one(24, f ? 0 : 1);
} };
// Cadre du nom (centre, largeur, hauteur max) et corps de police du jeu, × 1,25 ; lumières de nuit × 1,25
const SIGN_TEXT = {
  bois: { x: 0, y: -22.5, w: 34, h: 12, size: 9.5, font: 'Fraunces 800', color: '#4A2C16' },
  ardoise: { x: 0, y: -27.6, w: 26, h: 10, size: 8.6, font: 'Nunito 800', color: '#F4F1E8' },
  fer: { x: 0, y: -27, w: 28, h: 11, size: 9, font: 'Fraunces 700', color: '#F3DC9C', pivot: FER_PIVOT },
  laiton: { x: 0, y: -19.8, w: 31, h: 10, size: 9, font: 'Fraunces 800', color: '#5A3A10' },
  fleurie: { x: 0, y: -20.6, w: 34, h: 10, size: 9, font: 'Fraunces 700', color: '#3F6B35' },
  lanterne: { x: 0, y: -27.9, w: 28, h: 11, size: 9, font: 'Fraunces 700', color: '#F4D27A', light: [[-24, -34, 18], [24, -34, 18]] }
};
for (const t of Object.values(SIGN_TEXT)) {
  for (const k of ['x', 'y', 'w', 'h', 'size']) t[k] = r2(t[k] * K);
  if (t.pivot) t.pivot = big(t.pivot);
  if (t.light) t.light = t.light.map(big);
}
const SIGN_FRAME = [-32, -56, 64, 62];

/* ================= Îlots, bateaux, objets de la mer ================= */
const PROP_BOX = [-40, -92, 80, 112];
const BUILDING_BOX = [-76, -124, 152, 168];
const M = {};
// Nid de la colonie de mouettes : couronne de paille, trois œufs mouchetés
M.nid = { frame: PROP_BOX, n: 1, draw: () => {
  const straw = back => {
    let o = '';
    for (let k = 0; k < 14; k++) {
      const a = (k / 14) * TAU;
      if ((Math.sin(a) < 0) !== back) continue;
      const r = 9 + (k % 3);
      o += tk(`M${r2(Math.cos(a) * r)},${r2(Math.sin(a) * r * 0.5)} q${r2(Math.cos(a + 1.4) * 5)},${r2(Math.sin(a + 1.4) * 2)} ${r2(Math.cos(a + 2) * 7)},${r2(Math.sin(a + 2) * 3)}`, 1.3, k % 2 ? '#C9A45A' : '#E2C27A');
    }
    return o;
  };
  const egg = (dx, dy, c) => E(dx, dy, 2.7, 3.4, c, W * 0.7) + E(dx + 0.8, dy - 0.6, 0.5, 0.5, '#8C8270', 0) + E(dx - 0.9, dy + 0.9, 0.4, 0.4, '#8C8270', 0) + E(dx - 0.8, dy - 1.4, 0.7, 1, '#FFFFFF', 0);
  return shade(1, 1.5, 13, 6, 0.18) + E(0, 0, 10.5, 5, '#B08A48') + E(0, -0.6, 7, 3.2, '#7A5A30', 0.5) + straw(true)
    + egg(-2.6, -2.6, '#EEF3F2') + egg(2.4, -2.2, '#DCEBEE') + egg(0, -0.8, '#F4F1E6') + straw(false);
} };
// Ponton d'amarrage au ras de l'eau : pilotis, plancher, bitte et cordage
M.ponton = { frame: BUILDING_BOX, n: 1, draw: () => {
  const [wx, wy] = gp(0, 0.05, -1);
  let o = E(wx, wy, 36, 15, 'rgba(255,255,255,.32)', 0) + E(wx - 4, wy - 1, 24, 8, 'rgba(255,255,255,.22)', 0);
  // les pieux qui plongent, chacun avec son rond dans l'eau
  for (const [u, v] of [[0.38, -0.18], [-0.38, 0.18], [0.38, 0.18], [0, 0.18]]) { const [px, py] = gp(u, v, -10); o += `<ellipse cx="${r2(px)}" cy="${r2(py + 1)}" rx="4.4" ry="1.6" fill="none" stroke="rgba(255,255,255,.8)" stroke-width="0.7"/>` + gbox(u - 0.035, v - 0.035, u + 0.035, v + 0.035, -10, 2, WOOD_DARK); }
  // le tablier : ses planches en travers, leurs joints et leurs clous
  o += gbox(-0.42, -0.2, 0.42, 0.2, 2, 5, WOOD);
  for (let k = -3; k <= 3; k++) o += L(gp(k * 0.12 + 0.06, -0.2, 5), gp(k * 0.12 + 0.06, 0.2, 5), 'rgba(90,55,25,.5)', 0.8) + E(...gp(k * 0.12, 0.16, 5), 0.5, 0.35, '#5A3A20', 0) + E(...gp(k * 0.12, -0.16, 5), 0.5, 0.35, '#5A3A20', 0);
  o += L(gp(-0.42, 0.2, 3.5), gp(0.42, 0.2, 3.5), 'rgba(90,55,25,.35)', 0.6);
  // l'échelle qui descend dans l'eau
  const [l0x, l0y] = gp(-0.1, 0.21, 4), [l1x, l1y] = gp(-0.1, 0.21, -9);
  o += tk(`M${r2(l0x - 3)},${r2(l0y)} L${r2(l1x - 3)},${r2(l1y)} M${r2(l0x + 3)},${r2(l0y)} L${r2(l1x + 3)},${r2(l1y)}`, 0.9, WOOD_DARK.left) + [3, 7, 11].map(d => L([l0x - 3, l0y + d], [l0x + 3, l0y + d], WOOD_DARK.left, 0.9)).join('');
  // la bitte d'amarrage, sa corde enroulée et la corde qui file à l'eau
  const [cx, cy] = gp(0.3, 0.05, 5);
  o += gbox(0.26, 0.01, 0.34, 0.09, 5, 11, WOOD_DARK) + E(cx, cy - 6.4, 3.2, 1.4, WOOD_DARK.top, W * 0.7)
    + E(cx - 1, cy - 2.4, 4, 1.6, 'none', 0).replace('fill="none" stroke="none"', `fill="none" stroke="#D9C08A" stroke-width="1.2"`)
    + tk(`M${r2(cx + 2)},${r2(cy - 4)} q6,2 9,8 q2,5 6,9`, 1, '#D9C08A');
  // un seau sur les planches
  const [bx, by] = gp(-0.28, -0.05, 5);
  return o + P(`M${r2(bx - 3)},${r2(by - 6)} L${r2(bx + 3)},${r2(by - 6)} L${r2(bx + 2.4)},${r2(by)} L${r2(bx - 2.4)},${r2(by)} Z`, '#8A9AA8', W * 0.8) + E(bx, by - 6, 3, 1, '#5E6E7A', W * 0.6);
} };
// Barque volante du passeur : une coque bordée à la proue enroulée en volute, son liseré clair ; le mât, la voile
// gonflée selon l'image avec son œil bleu, le foc ; la lanterne de poupe et sa flamme ; sous la coque, la brume qui la
// porte, en volutes lumineuses et en étincelles ; vers la droite
M.barque_volante = { frame: [-32, -56, 64, 68], n: 2, draw: f => {
  const belly = f ? 6 : 3;
  const coque = 'M-22,-6 L20,-6 Q24,-7 25,-12 Q27,-14 26,-9 Q24,4 9,6 L-12,6 Q-20,4 -22,-6 Z';
  const volute = (x, y, r, a) => `<path d="M${r2(x - r)},${y} a${r},${r} 0 1 1 ${r2(r * 0.9)},${r2(r * 0.6)} a${r2(r * 0.5)},${r2(r * 0.5)} 0 1 1 ${r2(-r * 0.4)},${r2(-r * 0.7)}" fill="none" stroke="rgba(214,244,255,${a})" stroke-width="1.2" stroke-linecap="round"/>`;
  return E(0, 7, 23, 5, 'rgba(120,210,255,.28)', 0) + E(-4, 8.6, 15, 2.6, 'rgba(191,240,255,.45)', 0)
    + volute(-14 + (f ? 2 : 0), 8, 2.4, 0.75) + volute(6 - (f ? 2 : 0), 8.6, 2, 0.6) + volute(16, 7 + (f ? 1 : 0), 1.7, 0.5)
    + star(-20 + (f ? 3 : 0), 9.4, 1.3, 0.9) + star(13 - (f ? 2 : 0), 10, 1.1, 0.8)
    + line('M-1,-45 L-20,-6.6 M-1,-45 L23,-9', 0.5, WOOD_DARK.right)
    + `<defs><clipPath id="barque-coque"><path d="${coque}"/></clipPath></defs><path d="${coque}" fill="${WOOD.left}"/><g clip-path="url(#barque-coque)">`
    + '<path d="M-24,1.4 Q0,4.4 28,0 L28,10 L-24,10 Z" fill="' + WOOD.right + '"/>' + line('M-22,-1.8 Q0,-0.4 25,-3', 0.6, WOOD.right) + '</g>'
    + `<path d="${coque}" fill="none" stroke="${OUT}" stroke-width="${W}" stroke-linejoin="round"/>`
    + pg([[-22, -6], [20, -6], [19, -3], [-20.6, -2.6]], WOOD.top, W * 0.7) + `<path d="M24.6,-11 a1.6,1.6 0 1 1 1.4,1.6" fill="none" stroke="${WOOD_DARK.right}" stroke-width="0.8"/>`
    + tk('M-1,-6 L-1,-47', 1.4, WOOD_DARK.right)
    + P(`M0,-44 Q${16 + belly},-30 0,-12 Z`, '#FFFDF8') + line(`M0,-36 Q${r2(7 + belly / 2)},-33 ${r2(9 + belly / 2)},-31 M0,-19 Q${r2(8 + belly / 2)},-20 ${r2(10 + belly / 2)},-21`, 0.5, '#D8D0BE')
    + E(5 + belly / 3, -28, 3.4, 3.4, '#5CC8F0', 0.6) + E(5 + belly / 3, -28, 1.5, 1.5, '#1E5A7A', 0) + E(4.4 + belly / 3, -28.8, 0.6, 0.6, '#FFFFFF', 0)
    + P('M-2,-40 Q-12,-26 -2,-14 Z', '#F2E4C0', W * 0.8)
    + L([-19, -6], [-19, -16], '#3D3A36', 1.2) + pg([[-22.6, -22], [-15.4, -22], [-16.4, -23.6], [-21.6, -23.6]], '#3D3A36', 0.5)
    + rr(-22, -22, 6, 7, 1, '#FFE08A', 0.8, '#3D3A36') + E(-19, -18.4, 1 + f * 0.3, 1.8 + f * 0.5, '#FFF4C8', 0) + E(-19, -18.6, 5 + f, 5 + f, 'rgba(255,224,138,.22)', 0);
} };
// Bateau du visiteur : une coque bordée de planches, son liseré blanc, sa bande bleue et ses hublots ; la cabine, sa
// porte, son hublot et son toit rouge, la cheminée qui fume ; la malle sanglée ; le mât, sa vergue, la grand-voile
// bombée et ses coutures, les haubans ; le fanion qui claque ; l'écume à la proue et à la poupe. Il tangue un
// peu d'une image à l'autre. Ancre : ligne de flottaison ; vers la droite
M.bateau_visiteur = { frame: [-30, -56, 62, 64], n: 2, draw: f => {
  const flag = f ? 'M3,-50.4 Q8,-51.4 13.4,-48 Q8,-46.6 3,-45.6 Z' : 'M3,-50.4 Q7,-49 10,-50 L12.6,-46.8 Q8,-45.6 3,-45.6 Z';
  const coque = 'M-27,-7 L27,-8 Q25.4,3 13,6 L-14,6 Q-25,3.4 -27,-7 Z';
  const bob = f ? -0.5 : 0.3;
  return E(0, 3.6, 28, 3.6, 'rgba(30,70,110,.25)', 0) + line(`M-30,${f ? 4 : 3.4} q3,-1.4 6,0 M24,${f ? 3 : 3.6} q3,-1.6 6,0`, 0.9, 'rgba(255,255,255,.85)')
    + `<g transform="translate(0 ${bob})">`
    // les haubans, derrière les voiles
    + line('M2,-49 L-24,-7.6 M2,-49 L26,-8', 0.5, '#5A3A20')
    // la coque, ses planches, son ombre basse, ses hublots ; le liseré blanc et la bande bleue
    + `<defs><clipPath id="visiteur-coque"><path d="${coque}"/></clipPath></defs><path d="${coque}" fill="#8C5A34"/><g clip-path="url(#visiteur-coque)">`
    + '<path d="M-30,1.4 Q0,4.4 30,0.4 L30,10 L-30,10 Z" fill="#6E4428"/>' + line('M-27,-2.8 Q0,-1 27,-3.8 M-25,1.2 Q0,3 25,-0.4', 0.6, '#6E4428') + '</g>'
    + `<path d="${coque}" fill="none" stroke="${OUT}" stroke-width="${W}" stroke-linejoin="round"/>`
    + [-12, 0, 12].map(x => E(x, -3, 1.3, 1.3, '#A8D8F0', W * 0.7) + E(x - 0.4, -3.4, 0.4, 0.4, '#FFFFFF', 0)).join('')
    + pg([[-27, -7], [27, -8], [25.4, -4.6], [-25.6, -3.8]], '#FBF6EA', W * 0.7) + L([-25, -4.4], [25, -5.3], '#3E6E9C', 1.3)
    // la cabine : face avant, côté, porte, hublot, toit rouge, cheminée
    + pg([[-19, -7], [-19, -16], [-8, -16], [-8, -7]], '#E9D3A8', W * 0.8) + pg([[-8, -7], [-8, -16], [-5.6, -17.4], [-5.6, -7.6]], '#CDB385', W * 0.8)
    + rr(-17.4, -14.4, 3.6, 7.2, 1.4, '#7A5236', 0.6) + E(-12, -12, 1.6, 1.6, '#7FC4E8', 0.6) + E(-12.4, -12.4, 0.5, 0.5, '#FFFFFF', 0)
    + pg([[-20.6, -16], [-13, -20.6], [-4.4, -17.4], [-6.4, -16]], '#C9473A', W * 0.8) + L([-13, -20.4], [-5.4, -17.2], '#E06A5A', 0.8)
    + rr(-17, -23.6, 2.6, 5, 0.6, '#5A4A40', 0.6) + E(-15.6 + (f ? 1 : 0), -26.4 - (f ? 1.4 : 0), 2 + f * 0.5, 1.5 + f * 0.4, '#F4F1EA', 0.5) + E(-13.6 + f * 1.6, -29 - f * 1.6, 1.4, 1.1, '#F4F1EA', 0.4)
    // la malle sanglée
    + rr(9, -12, 9.4, 5.4, 1.2, '#6B4A2E', W * 0.8) + L([9.4, -9.4], [18, -9.4], '#E2B347', 1) + L([12, -12], [12, -6.6], '#4A321E', 0.8) + L([15.6, -12], [15.6, -6.6], '#4A321E', 0.8)
    // le mât, la vergue, la grand-voile bombée et ses coutures
    + tk('M2,-7 L2,-50', 1.4, '#5A3A20') + tk('M2,-43 L19,-41.6', 0.8, '#5A3A20')
    + P('M3,-42.6 Q14,-30 21,-11 L3,-9 Z', '#FFFDF8', W) + `<path d="M3,-30 Q11,-27 15.6,-26 L18.2,-20 Q10,-21 3,-21 Z" fill="#6FA3D9" opacity=".6"/>`
    + line('M3,-36 Q10,-34 16,-32.6 M3,-15 Q12,-15.6 20,-15.6', 0.5, '#D8D0BE')
    + P(flag, '#E2483A', W * 0.7) + E(2, -50.6, 1.2, 1.2, '#E2B347', 0.5) + '</g>';
} };
// Voilier amarré au Ponton, dans le cadre du bâtiment, ancré comme dans le jeu ; voile d'origine ou skin
const SAILS = { blanche: ['#FFFDF8', '#F2E4C0'], rouge: ['#E2574C', '#B13A31'], bleue: ['#6FA3D9', '#4C7FB5'], rayee: ['stripes', '#E2574C'] };
M.voilier = { frame: BUILDING_BOX, n: 1, variants: Object.keys(SAILS), draw: (_, sail = 'blanche') => {
  const [x, y] = gp(0.05, 0.5, 0);
  const s = SAILS[sail], X = n => r2(x + n), Y = n => r2(y + n);
  const main = s[0] === 'stripes' ? '#FFFDF8' : s[0], jib = s[0] === 'stripes' ? '#F2E4C0' : s[1];
  const voile = `M${X(1)},${Y(-44)} Q${X(13)},${Y(-30)} ${X(20)},${Y(-12)} L${X(1)},${Y(-10)} Z`;
  const stripes = s[0] === 'stripes' ? `<defs><clipPath id="voilier-voile"><path d="${voile}"/></clipPath></defs><g clip-path="url(#voilier-voile)">${[0, 1, 2].map(k => `<path d="M${X(-2)},${Y(-40 + k * 10)} L${X(24)},${Y(-37 + k * 10)} L${X(24)},${Y(-32 + k * 10)} L${X(-2)},${Y(-35 + k * 10)} Z" fill="${s[1]}"/>`).join('')}</g>` : '';
  const coque = `M${X(-23)},${Y(-6)} L${X(23)},${Y(-7)} Q${X(21)},${Y(4)} ${X(10)},${Y(6)} L${X(-12)},${Y(6)} Q${X(-21)},${Y(4)} ${X(-23)},${Y(-6)} Z`;
  return E(x, y + 6, 24, 5, 'rgba(30,70,110,.25)', 0) + line(`M${X(-27)},${Y(5)} q3,-1.4 6,0 M${X(21)},${Y(4.6)} q3,-1.4 6,0`, 0.9, 'rgba(255,255,255,.85)')
    + line(`M${X(0)},${Y(-47)} L${X(-21)},${Y(-6.6)} M${X(0)},${Y(-47)} L${X(22)},${Y(-7)}`, 0.5, '#5A3A20')
    + `<defs><clipPath id="voilier-coque"><path d="${coque}"/></clipPath></defs><path d="${coque}" fill="${WOOD.left}"/><g clip-path="url(#voilier-coque)">`
    + `<path d="M${X(-26)},${Y(1.6)} Q${x},${Y(4.4)} ${X(26)},${Y(0.6)} L${X(26)},${Y(10)} L${X(-26)},${Y(10)} Z" fill="${WOOD.right}"/>` + line(`M${X(-23)},${Y(-2)} Q${x},${Y(-0.4)} ${X(23)},${Y(-3)}`, 0.6, WOOD.right) + '</g>'
    + `<path d="${coque}" fill="none" stroke="${OUT}" stroke-width="${W}" stroke-linejoin="round"/>`
    + [-9, 3].map(n => E(x + n, y - 2.4, 1.2, 1.2, '#A8D8F0', W * 0.7) + E(x + n - 0.4, y - 2.8, 0.4, 0.4, '#FFFFFF', 0)).join('')
    + pg([[x - 23, y - 6], [x + 23, y - 7], [x + 21.4, y - 4], [x - 21.6, y - 3.4]], '#FBF6EA', W * 0.7)
    + tk(`M${x},${Y(-6)} L${x},${Y(-48)}`, 1.4, WOOD_DARK.right) + tk(`M${x},${Y(-41)} L${X(17)},${Y(-39.8)}`, 0.8, WOOD_DARK.right)
    + P(voile, main) + stripes + (stripes ? P(voile, 'none') : '') + line(`M${X(1)},${Y(-34)} Q${X(9)},${Y(-32)} ${X(15)},${Y(-30.6)} M${X(1)},${Y(-18)} Q${X(10)},${Y(-18.4)} ${X(18)},${Y(-18.4)}`, 0.5, 'rgba(120,100,80,.35)')
    + P(`M${X(-1)},${Y(-38)} Q${X(-8)},${Y(-25)} ${X(-14)},${Y(-13)} L${X(-1)},${Y(-12)} Z`, jib, W * 0.8)
    + P(`M${X(0.4)},${Y(-48.4)} Q${X(6)},${Y(-49.4)} ${X(10)},${Y(-46.6)} Q${X(5.6)},${Y(-45.2)} ${X(0.4)},${Y(-44.6)} Z`, s[0] === 'stripes' ? s[1] : jib, W * 0.6) + E(x, y - 48.6, 1.1, 1.1, '#E2B347', 0.5);
} };
// Bouteille échouée qui flotte : un vrai goulot, verre vert translucide où l'on voit le message roulé, son ruban rouge
// et son cachet ; l'eau monte dans le bas du verre, des ronds autour ; image 2 : penchée par la vague, un éclat
M.bouteille = { frame: [-16, -28, 32, 32], n: 2, draw: f => {
  const a = f ? -14 : -6, id = `bouteille-verre-${f}`, rx = f ? 13.4 : 12.4;
  const body = 'M-9,-5 L4,-5 Q7.4,-5 8.6,-2.1 L12,-2.1 L12,2.1 L8.6,2.1 Q7.4,5 4,5 L-9,5 Q-12.4,5 -12.4,0 Q-12.4,-5 -9,-5 Z';
  return E(0, 0.8, 14, 2.6, 'rgba(30,60,80,.22)', 0)
    + line(`M${-rx},0 A${rx},2.4 0 0 1 ${rx},0`, 0.7, 'rgba(255,255,255,.45)')
    + `<g transform="translate(-1.4,-2.4) rotate(${a}) scale(.84)"><defs><clipPath id="${id}"><path d="${body}"/></clipPath></defs>`
    // le message roulé, son ruban rouge et son cachet de cire
    + rr(-8.4, -2.8, 11, 5.6, 2.6, '#F5E8C6', 0.5) + E(2.6, 0, 1.2, 2.8, '#E6D2A4', 0.4) + line('M2.6,-1.6 q-0.8,1.6 0,3.2', 0.4, '#C9A87A')
    + line('M-4.4,-0.9 L1,-0.9 M-4.4,0.8 L-0.4,0.8', 0.4, 'rgba(150,120,80,.6)')
    + line('M-6.4,-2.6 L-6.4,2.6', 1.1, '#D9534A') + E(-6.4, 3.2, 1, 1, '#B8302A', 0) + E(-6.7, 2.9, 0.35, 0.35, 'rgba(255,255,255,.6)', 0)
    // le verre : vert translucide, plus épais en bas, l'eau de mer qui monte dedans
    + P(body, 'rgba(96,180,132,.44)', 0)
    + `<g clip-path="url(#${id})"><path d="M-14,2.6 Q-4,1.4 4,3 L14,3.2 L14,8 L-14,8 Z" fill="rgba(40,110,80,.4)"/>`
    + `<path d="M-24,2.6 q5,-1 10,0 t10,0 t10,0 t10,0 L26,16 L-24,16 Z" fill="rgba(120,190,226,.55)" transform="rotate(${-a})"/></g>`
    + P(body, 'none', W / 0.84)
    + rr(11.6, -2.7, 1.7, 5.4, 0.7, '#8FD0AA', W * 0.7) + rr(13.1, -1.8, 3.4, 3.6, 0.9, '#C08A58', W * 0.7) + line('M14.6,-1.4 L14.6,1.4', 0.4, 'rgba(90,55,30,.5)')
    + line('M-9,-3.6 Q-2,-4.6 4,-3.8', 1.1, 'rgba(255,255,255,.75)') + line('M8.8,-1.4 L11.4,-1.4', 0.6, 'rgba(255,255,255,.6)')
    + E(-10.6, -1.2, 0.5, 1.2, 'rgba(255,255,255,.55)', 0) + '</g>'
    // les ronds de l'eau devant, l'écume, l'éclat
    + line(`M${-rx},0 A${rx},2.4 0 0 0 ${rx},0`, 0.9, 'rgba(255,255,255,.85)')
    + line(`M${-rx - 3},${f ? 1.4 : 2.2} q2,-1.2 4,0 M${rx - 1},${f ? 2.2 : 1.4} q2,-1.2 4,0`, 0.8, 'rgba(255,255,255,.7)')
    + E(-rx + 2, -0.6, 0.7, 0.5, '#FFFFFF', 0) + E(rx - 2.4, -0.4, 0.6, 0.45, '#FFFFFF', 0)
    + (f ? star(-2, -10.4, 2.2) : '');
} };
// Panneau d'un quartier à acheter : poteau planté dans une touffe, planche au liseré foncé (même place : le prix y est
// écrit par l'île), ses clous et son fil du bois ; le cadenas doré suspendu à sa chaînette
M.panneau_quartier = { frame: PROP_BOX, n: 1, draw: () => shade(0, 0, 14, 7, 0.2) + gbox(-0.03, -0.03, 0.03, 0.03, 0, 26, WOOD_DARK)
  + tuft(-5, 1) + tuft(3.4, 1.6)
  + framed(-17, -40, 34, 17, 3, WOOD.top, '#7A4E2C', 1.2) + L([-13, -34], [13, -34], 'rgba(122,78,44,.3)', 0.8)
  + line('M-14,-37.4 q6,-0.8 10,0.2 M5,-26 q5,0.6 9,-0.4', 0.5, 'rgba(122,78,44,.35)')
  + [[-14.6, -37.6], [14.6, -37.6], [-14.6, -25.4], [14.6, -25.4]].map(([x, y]) => E(x, y, 0.8, 0.8, '#5A3A20', 0) + E(x - 0.25, y - 0.25, 0.3, 0.3, '#B88A5A', 0)).join('')
  + line('M0,-40 L0,-42', 0.8, '#8A6A22') + line('M-2.8,-50 v-3 a2.8,2.8 0 0 1 5.6,0 v3', 2.6, OUT) + line('M-2.8,-50 v-3 a2.8,2.8 0 0 1 5.6,0 v3', 1.2, '#8A6A22')
  + rr(-4.5, -50, 9, 8, 1.6, '#E9BF4E', W * 0.9) + L([-3.4, -48.6], [-3.4, -43.4], '#FFE39A', 0.8) + E(0, -46.6, 0.9, 1.1, '#5A4214', 0) + L([0, -46], [0, -44.4], '#5A4214', 0.8) };
// Pont de planches sur la mer : une case, le long de u ; ses piles et leurs ronds dans l'eau, son tablier aux planches
// clouées, ses garde-corps de corde ; lanterne au bout côté terre, avec son halo (bout_avant / bout_arriere)
const HS = 22;
M.pont = { frame: [-40, -46, 80, 86], n: 1, variants: ['segment', 'bout_avant', 'bout_arriere'], draw: (_, kind = 'segment') => {
  const z = 0.15 * HS;
  let o = E(0, 22, 30, 7, 'rgba(255,255,255,.3)', 0);
  // piles qui plongent dans la mer, puis tablier (une bande le long de u) et planches en travers
  for (const [u, v] of [[0.4, -0.26], [-0.4, 0.26], [0.4, 0.26]]) { const p = gp(u, v, z - 2.4); o += `<ellipse cx="${r2(p[0])}" cy="${r2(p[1] - 1 + HS * 1.2)}" rx="4.6" ry="1.6" fill="none" stroke="rgba(255,255,255,.8)" stroke-width="0.7"/>` + rr(p[0] - 2, p[1] - 1, 4, HS * 1.2, 0.6, '#6B4A2A', W * 0.8) + L([p[0] - 0.8, p[1]], [p[0] - 0.8, p[1] - 2 + HS * 1.2], '#8A6238', 0.6); }
  o += gbox(-0.5, -0.3, 0.5, 0.3, z - 2.4, z, { top: '#A47A4A', left: '#8A6238', right: '#7A5530' });
  for (let k = -4; k <= 4; k++) o += L(gp(k * 0.11, -0.3, z), gp(k * 0.11, 0.3, z), 'rgba(90,55,25,.5)', 0.7) + E(...gp(k * 0.11 - 0.055, 0.24, z), 0.45, 0.3, '#5A3A20', 0) + E(...gp(k * 0.11 - 0.055, -0.24, z), 0.45, 0.3, '#5A3A20', 0);
  const post = (u, v, h) => { const p = gp(u, v, z); return { s: rr(p[0] - 1.2, p[1] - h, 2.4, h, 0.6, '#5C3F24', 0.6), x: p[0], y: p[1] - h }; };
  const rope = (a, b) => tk(`M${r2(a.x)},${r2(a.y + 1)} Q${r2((a.x + b.x) / 2)},${r2((a.y + b.y) / 2 + 4)} ${r2(b.x)},${r2(b.y + 1)}`, 0.9, '#D9C08A');
  const lamp = u => { const t = post(u, 0.27, 24); return t.s + E(t.x, t.y - 3, 7, 7, 'rgba(255,224,138,.22)', 0) + rr(t.x - 3.4, t.y - 8, 6.8, 2, 0.6, '#3D3A36', 0.5) + rr(t.x - 2.6, t.y - 6, 5.2, 6, 0.8, '#FFE08A', 0.8, '#3D3A36') + E(t.x, t.y - 3, 1, 1.8, '#FFF4C8', 0) + L([t.x, t.y - 6], [t.x, t.y], '#3D3A36', 0.4); };
  for (const v of [-0.27, 0.27]) {
    const a = post(-0.46, v, 12), b = post(0.46, v, 12);
    if (v > 0 && kind === 'bout_arriere') o += lamp(-0.46);
    o += a.s + b.s + rope(a, b);
  }
  if (kind === 'bout_avant') o += lamp(0.46);
  return o;
} };
// Épaves du prologue (la nuit du naufrage) : radeau de bois flotté, caboteur chargé de pierres, barque pleine de graines.
// En couleur ; le jeu les montre en silhouette (variante « silhouette », #070E1E)
M.epave_radeau = { frame: [-40, -56, 80, 64], n: 1, draw: () => {
  const rondin = (y, x0, x1, c) => rr(x0, y, x1 - x0, 6, 3, c.left, W) + E(x1 - 2.6, y + 3, 2, 2.6, c.top, W * 0.7) + E(x1 - 2.6, y + 3, 0.9, 1.3, c.right, 0) + L([x0 + 4, y + 1.6], [x1 - 7, y + 1.4], c.top, 0.7);
  return `<g transform="rotate(-9)">` + rondin(-5, -30, 30, WOOD) + rondin(-11, -26, 27, { left: '#C99A62', top: '#E0B47A', right: '#8A5A32' })
    + [-16, 0, 16].map(x => rr(x - 1.4, -11.6, 2.8, 13, 0.8, '#D9C08A', W * 0.7)).join('')
    + P('M-4,-11 L3,-40 L5.4,-39.4 L1.4,-11 Z', WOOD_DARK.left) + P('M3.6,-41 L5.6,-44 L6.4,-39.8 Z', WOOD_DARK.right, W * 0.6)
    + P('M4.6,-37 Q14,-36 21,-30 L17,-28.6 L19,-26 Q12,-25.4 5.6,-24.6 Z', '#E8E2D2', W * 0.8) + line('M7,-33 l6,0.6 M7,-28.6 l5,0.2', 0.5, '#C8BFA8')
    + line('M-24,-5 q-3,4 -1,8 M22,-4 q4,3 2,7', 0.9, '#D9C08A') + '</g>';
} };
M.epave_bateau = { frame: [-54, -72, 108, 90], n: 1, draw: () => {
  const coque = 'M-46,-10 L46,-10 L34,6 L-36,6 Z';
  return `<g transform="rotate(12)">`
    + `<defs><clipPath id="epave-coque"><path d="${coque}"/></clipPath></defs><path d="${coque}" fill="#7A5A3E"/><g clip-path="url(#epave-coque)">`
    + '<path d="M-50,0 L50,0 L50,10 L-50,10 Z" fill="#5E4430"/>' + L([-42, -5], [40, -5], '#5A3E28', 0.8) + L([-40, 0], [38, 0], '#5A3E28', 0.6)
    + P('M12,-6 L20,-7 L22,0 L16,3 L11,0 Z', '#2E2218', 0.6) + L([13, -6], [10, -9], '#7A5A3E', 1.4) + L([21, -7], [24, -10], '#7A5A3E', 1.2) + '</g>'
    + `<path d="${coque}" fill="none" stroke="${OUT}" stroke-width="${W}" stroke-linejoin="round"/>` + pg([[-46, -10], [46, -10], [44, -7.4], [-44, -7.4]], '#A8825A', W * 0.7)
    + P('M-6,-10 L-2,-46 L-1,-50 L1,-46 L2,-48.6 L2.6,-44 L2,-10 Z', WOOD_DARK.left)
    + P('M2,-44 L-30,-36 L-26,-34 L-29,-31 L-22,-30.6 L2,-30 Z', '#E8E2D2', W * 0.8) + line('M-4,-40 l-14,3.6 M-4,-34 l-16,2', 0.5, '#C8BFA8')
    + line('M-2,-42 Q-14,-26 -40,-10', 0.7, '#D9C08A') + line('M2,-30 q6,6 4,14', 0.8, '#D9C08A')
    + rr(-26, -18, 12, 8, 1, '#BDB5A8', W * 0.8) + rr(-10, -18, 10, 8, 1, '#A39B8E', W * 0.8) + rr(8, -16, 8, 6, 1, '#BDB5A8', W * 0.8)
    + L([-24, -15.6], [-16, -15.6], '#D3CCC0', 0.6) + L([-8, -15.4], [-2, -15.4], '#BDB5A8', 0.6) + '</g>';
} };
M.epave_barque = { frame: [-40, -32, 80, 44], n: 1, draw: () => {
  const coque = 'M-30,-8 Q0,6 30,-8 L24,2 Q0,12 -24,2 Z';
  const sac = (x, y, c) => P(`M${x - 4},${y + 2} Q${x - 4.6},${y - 3} ${x - 1.6},${y - 4.4} L${x - 2.2},${y - 6} L${x + 2.2},${y - 6} L${x + 1.6},${y - 4.4} Q${x + 4.6},${y - 3} ${x + 4},${y + 2} Q${x},${y + 3.4} ${x - 4},${y + 2} Z`, c, W * 0.8) + L([x - 1.8, y - 4.6], [x + 1.8, y - 4.6], '#8A6A3A', 0.8);
  return `<g transform="rotate(-16)">`
    + `<defs><clipPath id="epave-barque"><path d="${coque}"/></clipPath></defs><path d="${coque}" fill="${WOOD.left}"/><g clip-path="url(#epave-barque)">`
    + `<path d="M-32,1 Q0,10 32,-1 L32,14 L-32,14 Z" fill="${WOOD.right}"/>` + line('M-28,-3 Q0,9 28,-3', 0.6, WOOD.right) + P('M6,1 L12,0 L13,5 L7,6 Z', '#2E2218', 0.5) + '</g>'
    + `<path d="${coque}" fill="none" stroke="${OUT}" stroke-width="${W}" stroke-linejoin="round"/>`
    + sac(-10, -2, '#D9C08A') + sac(-1, 0, '#E2CC98') + P('M8,-4 L14,-7 L16,-3 L10,0 Z', '#C9AE78', W * 0.8)
    + E(-8, -3.8, 2.2, 2.2, '#C9A45A', W * 0.7) + E(2, -3, 1.8, 1.8, '#8A5A2E', W * 0.7) + E(12, -6.4, 1.6, 1.6, '#E2C27A', W * 0.6) + E(16, -4.6, 1.2, 1.2, '#7FA65A', 0.5) + E(19, -2.4, 1, 1, '#C9A45A', 0.5) + E(-3, -2.6, 1.2, 1.2, '#7FA65A', 0.5)
    + tk('M-26,-10 L-6,2', 1, WOOD_DARK.left) + P('M-6,1 L-2,4 L-1,2.4 L-4,-0.6 Z', WOOD_DARK.left, W * 0.6)
    + line('M-27,-5 Q0,8 27,-5', 1.4, WOOD.top) + '</g>';
} };
const silhouette = body => body.replace(/fill="(?!none)[^"]*"/g, 'fill="#070E1E"').replace(/stroke="(?!none)[^"]*"/g, 'stroke="#070E1E"');

module.exports = { K, up, big, G, S, SIGN_TEXT, SIGN_FRAME, M, silhouette };
