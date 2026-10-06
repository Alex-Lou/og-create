// Gisements (lot 9d), enseignes (lot 4d), îlots, bateaux et objets de la mer, au trait de la troupe. Géométrie reprise
// du jeu (depositSprites.js, nameSigns.js, isletSprites.js, visitors.js, sprites.js, chest.js, nature.js, terrain.js),
// dessinée en pixels du jeu dans un groupe agrandi × 1,25 : les cadres et les ancres du jeu × 1,25 restent justes.
const { OUT, P, E, L, r2 } = require('./troupe');

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
  glace: {
    frames: [[-30, -46, 60, 56], [-24, -16, 48, 26]],
    draw: (spent, f) => spent
      ? E(0, 1, 14, 5, 'rgba(255,255,255,.65)', 0) + spire(-6, 0, 5, 4, ICE) + spire(5, 1, 6, 4, ICE) + spire(0, 3, 4, 3.5, ICE)
      : shade(0, 1, 16, 7, 0.14) + E(0, 1, 18, 7, 'rgba(255,255,255,.75)', 0)
        + spire(-9, -1, 20, 5, ICE, -2) + spire(8, 0, 24, 5.5, ICE, 2) + spire(-1, 3, 34, 6.5, ICE) + spire(3, 6, 16, 4.5, ICE, 1)
        + (f ? star(9, -20, 2.6) + star(-9, -16, 2.2) : star(-1, -31, 3.2))
  },
  laine: {
    frames: [[-30, -26, 60, 34], [-30, -24, 60, 32]],
    draw: (spent, f) => spent ? sheep(-11, -2, false, 1) + sheep(6, 4, false, 0) : sheep(-11, -2, true, f ? 0 : 1) + sheep(6, 4, true, f ? 1 : 0)
  },
  roseau: {
    frames: [[-24, -44, 48, 52], [-20, -14, 40, 22]],
    draw: (spent, f) => {
      if (spent) return E(0, 1, 12, 4, 'rgba(60,90,50,.3)', 0) + [-8, -4, 0, 4, 8].map((dx, k) => { const yb = (k % 2) * 2, h = 5 + (k % 3) * 1.6; return line(`M${dx},${yb} L${dx + 0.3},${r2(yb - h)}`, 2.6, OUT) + line(`M${dx},${yb} L${dx + 0.3},${r2(yb - h)}`, 1.2, '#5F8F3C') + E(dx + 0.3, yb - h, 0.9, 0.5, '#C8DC8A', 0.5); }).join('') + [-6, 2, 6].map(dx => P(`M${dx - 1},2 Q${dx - 1.6},-1 ${dx - 0.4},-4 Q${dx + 0.4},-1 ${dx + 1},2 Z`, '#7FA45A', 0.5)).join('');
      let o = E(0, 1, 14, 4.5, 'rgba(60,90,50,.3)', 0);
      [[-12, 20], [-9, 26], [-5, 32], [-1, 36], [3, 30], [7, 34], [11, 24]].forEach(([dx, h], k) => { o += cattail(dx, (k % 2) * 2, h, (f ? 1.6 : -1.4) * (0.6 + (k % 3) * 0.3)); });
      return o + [-7, 0, 6].map(dx => P(`M${dx - 1.2},2 Q${r2(dx * 1.5 - 1.6)},-3 ${r2(dx * 1.5)},-9 Q${r2(dx * 1.5 + 0.6)},-3 ${dx + 1.2},2 Z`, '#7FA45A', 0.6)).join('');
    }
  },
  sel: {
    frames: [[-30, -26, 60, 36], [-26, -10, 52, 20]],
    draw: (spent, f) => spent
      ? E(0, 1, 20, 8, '#E6DED4', W) + line('M-12,0 l6,2 l5,-3 l7,2 M2,4 l4,-2', 0.8, '#B8AB9A')
      : E(0, 0.4, 22, 8.4, '#FFFFFF', W) + E(6, -1, 9, 3.5, 'rgba(244,198,208,.5)', 0) + cube(-1, -3, 3.5) + cube(12, -2, 3) + cube(-8, 1, 4) + cube(6, 3, 5)
        + (f ? star(-8, -6, 2.4) : star(6, -9, 2.8))
  },
  fruits: {
    frames: [[-24, -50, 48, 58], [-24, -50, 48, 58]],
    draw: (spent, f) => fruitTree(!spent, f)
  },
  obsidienne: {
    frames: [[-28, -38, 56, 48], [-22, -12, 44, 20]],
    draw: (spent, f) => {
      const stone = (x, y, rx, ry) => E(x, y, rx, ry, '#2E2B36', W) + E(x - rx * 0.3, y - ry * 0.35, rx * 0.45, ry * 0.3, '#4A4258', 0);
      if (spent) return stone(-4, 1.4, 4.6, 3) + stone(6, 2.4, 3.8, 2.6) + stone(1, 4.8, 3, 2);
      const g = f ? 1 : 0.45;
      return shade(0, 1, 14, 5, 0.2) + E(0, 1, 15, 5, 'rgba(255,120,50,.28)', 0)
        + spire(-8, 0, 16, 5, OBSIDIAN, -3) + spire(7, 1, 20, 5.5, OBSIDIAN, 2) + stone(7, 6, 4, 2.6) + spire(0, 4, 26, 6, OBSIDIAN)
        + L([-1, -18], [1.5, -6], `rgba(185,166,232,${g})`, 1.2) + L([7, -14], [8, -6], `rgba(185,166,232,${r2(g * 0.7)})`, 1)
        + E(-5, 3, 1.4, 0.8, f ? '#FF8A4A' : '#E8573A', 0) + (f ? star(0, -24, 2.4) : '');
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
  let posts = '';
  for (const [u, v] of [[0.38, -0.18], [-0.38, 0.18], [0.38, 0.18]]) posts += gbox(u - 0.035, v - 0.035, u + 0.035, v + 0.035, -10, 2, WOOD_DARK);
  let planks = '';
  for (let k = -3; k <= 3; k++) planks += L(gp(k * 0.12, -0.2, 5), gp(k * 0.12, 0.2, 5), 'rgba(90,55,25,.45)', 0.8);
  const [cx, cy] = gp(0.3, 0.05, 5);
  const [wx, wy] = gp(0, 0.05, -1);
  return E(wx, wy, 34, 15, 'rgba(255,255,255,.35)', 0) + posts + gbox(-0.42, -0.2, 0.42, 0.2, 2, 5, WOOD) + planks
    + gbox(0.26, 0.01, 0.34, 0.09, 5, 11, WOOD_DARK) + tk(`M${r2(cx)},${r2(cy - 4)} q-6,4 -14,2`, 1, '#D9C08A');
} };
// Barque volante du passeur : coque, mât, voile gonflée selon l'image, lanterne de poupe, lueur de la brume ; vers la droite
M.barque_volante = { frame: [-32, -56, 64, 68], n: 2, draw: f => {
  const belly = f ? 6 : 3;
  return E(0, 6, 22, 5, 'rgba(120,210,255,.3)', 0) + E(-4, 8, 14, 2.6, 'rgba(191,240,255,.45)', 0)
    + P('M-22,-6 L22,-6 Q19,5 9,6 L-12,6 Q-20,4 -22,-6 Z', WOOD.left) + pg([[-22, -6], [22, -6], [19, -2], [-20, -2]], WOOD.top, W * 0.7)
    + L([-14, -1], [12, -1], WOOD_DARK.right, 0.8)
    + tk('M-1,-6 L-1,-46', 1.4, WOOD_DARK.right)
    + P(`M0,-44 Q${16 + belly},-30 0,-12 Z`, '#FFFDF8') + E(5 + belly / 3, -28, 3.2, 3.2, '#5CC8F0', 0.6) + E(5 + belly / 3, -28, 1.4, 1.4, '#FFFFFF', 0)
    + P('M-2,-40 Q-12,-26 -2,-14 Z', '#F2E4C0', W * 0.8)
    + L([-19, -6], [-19, -16], '#3D3A36', 1.2) + rr(-22, -22, 6, 7, 1, '#FFE08A', 0.8, '#3D3A36') + E(-19, -18.4, 1, 1.8, '#FFF4C8', 0);
} };
// Bateau du visiteur : coque, cabine, malle, voile, fanion qui claque ; ancre : ligne de flottaison ; vers la droite
M.bateau_visiteur = { frame: [-30, -56, 62, 64], n: 2, draw: f => {
  const flag = f ? 'M3,-50 L13,-47.6 L3,-45.2 Z' : 'M3,-50 L12,-48.6 L13,-46 L3,-45.2 Z';
  return E(0, 3.6, 27, 3.6, 'rgba(30,70,110,.25)', 0)
    + P('M-26,-6 L26,-6 Q22,4 10,6 L-14,6 Q-24,4 -26,-6 Z', '#8C5A34') + pg([[-26, -6], [26, -6], [23, -2], [-23, -2]], '#FBF6EA', W * 0.7)
    + L([-24, 0.5], [24, 0.5], '#3E6E9C', 1.4)
    + pg([[-18, -6], [-18, -15], [-6, -15], [-6, -6]], '#E9D3A8', W * 0.8) + pg([[-19.5, -15], [-12, -19], [-4.5, -15]], '#C9473A', W * 0.8)
    + rr(-15.6, -12.6, 3.6, 3.4, 0.6, '#7FC4E8', 0.5)
    + rr(9, -11, 9, 5, 1, '#6B4A2E', W * 0.8) + L([9.4, -8.6], [17.6, -8.6], '#E2B347', 1)
    + tk('M2,-6 L2,-50', 1.4, '#5A3A20')
    + P('M3,-44 L3,-9 L22,-11 Z', '#FFFDF8') + `<path d="M3,-30 L14.6,-29 L17,-21 L3,-21 Z" fill="#6FA3D9" opacity=".55"/>` + P(flag, '#E2483A', W * 0.7);
} };
// Voilier amarré au Ponton, dans le cadre du bâtiment, ancré comme dans le jeu ; voile d'origine ou skin
const SAILS = { blanche: ['#FFFDF8', '#F2E4C0'], rouge: ['#E2574C', '#B13A31'], bleue: ['#6FA3D9', '#4C7FB5'], rayee: ['stripes', '#E2574C'] };
M.voilier = { frame: BUILDING_BOX, n: 1, variants: Object.keys(SAILS), draw: (_, sail = 'blanche') => {
  const [x, y] = gp(0.05, 0.5, 0);
  const s = SAILS[sail];
  const main = s[0] === 'stripes' ? '#FFFDF8' : s[0], jib = s[0] === 'stripes' ? '#F2E4C0' : s[1];
  const stripes = s[0] === 'stripes' ? [0, 1, 2].map(k => `<path d="M${x + 1},${y - 40 + k * 10} L${x + 1},${y - 35 + k * 10} L${r2(x + 6 + k * 4.5)},${r2(y - 35.5 + k * 10)} L${r2(x + 4 + k * 4.5)},${r2(y - 40.5 + k * 10)} Z" fill="${s[1]}"/>`).join('') : '';
  return E(x, y + 6, 22, 5, 'rgba(30,70,110,.25)', 0)
    + P(`M${x - 22},${y - 6} L${x + 22},${y - 6} Q${x + 18},${y + 5} ${x + 8},${y + 6} L${x - 12},${y + 6} Q${x - 20},${y + 4} ${x - 22},${y - 6} Z`, WOOD.left)
    + pg([[x - 22, y - 6], [x + 22, y - 6], [x + 19, y - 2], [x - 20, y - 2]], '#FBF6EA', W * 0.7)
    + tk(`M${x},${y - 6} L${x},${y - 46}`, 1.4, WOOD_DARK.right)
    + P(`M${x + 1},${y - 44} L${x + 1},${y - 10} L${x + 20},${y - 12} Z`, main) + stripes + (stripes ? P(`M${x + 1},${y - 44} L${x + 1},${y - 10} L${x + 20},${y - 12} Z`, 'none') : '')
    + P(`M${x - 1},${y - 38} L${x - 1},${y - 12} L${x - 14},${y - 13} Z`, jib, W * 0.8);
} };
// Bouteille échouée : verre vert, bouchon, rouleau de papier ; image 2 : penchée par la vague
M.bouteille = { frame: [-16, -28, 32, 32], n: 2, draw: f => E(0, 0, 9, 2.4, 'rgba(30,50,60,.25)', 0)
  + `<g transform="rotate(${f ? -14 : -6}) translate(0,-4)">`
  + rr(-9, -5, 15, 9, 4.2, '#5FA77A', W * 0.9) + rr(5.5, -2.4, 5, 3.8, 1, '#5FA77A', W * 0.8) + rr(10, -2.2, 3.2, 3.4, 0.8, '#B8875A', 0.6)
  + rr(-6, -2.6, 9, 4.4, 1.6, '#F3E6C4', 0.4) + L([-4.6, -0.4], [1.4, -0.4], '#C9A87A', 0.5)
  + line('M-8,-3.6 Q-2,-5.2 4,-3.8', 1.1, 'rgba(255,255,255,.65)') + '</g>'
  + line(`M-13,${f ? 2 : 3} q3,-1.6 6,0 M7,${f ? 3 : 2} q3,-1.6 6,0`, 0.9, 'rgba(255,255,255,.8)') };
// Panneau d'un quartier à acheter : poteau, planche (le prix y est écrit par l'île), cadenas
M.panneau_quartier = { frame: PROP_BOX, n: 1, draw: () => shade(0, 0, 14, 7, 0.2) + gbox(-0.03, -0.03, 0.03, 0.03, 0, 26, WOOD_DARK)
  + framed(-17, -40, 34, 17, 3, WOOD.top, '#7A4E2C', 1.2) + L([-13, -34], [13, -34], 'rgba(122,78,44,.3)', 0.8)
  + line('M-2.8,-50 v-3 a2.8,2.8 0 0 1 5.6,0 v3', 2.6, OUT) + line('M-2.8,-50 v-3 a2.8,2.8 0 0 1 5.6,0 v3', 1.2, '#8A6A22')
  + rr(-4.5, -50, 9, 8, 1.6, '#E9BF4E', W * 0.9) + E(0, -46.6, 0.9, 1.1, '#5A4214', 0) };
// Pont de planches sur la mer : une case, le long de u ; lanterne au bout côté terre (bout_avant / bout_arriere)
const HS = 22;
M.pont = { frame: [-40, -46, 80, 86], n: 1, variants: ['segment', 'bout_avant', 'bout_arriere'], draw: (_, kind = 'segment') => {
  const z = 0.15 * HS;
  let o = E(0, 22, 30, 7, 'rgba(255,255,255,.3)', 0);
  // piles qui plongent dans la mer, puis tablier (une bande le long de u) et planches en travers
  for (const [u, v] of [[0.4, -0.26], [-0.4, 0.26], [0.4, 0.26]]) { const p = gp(u, v, z - 2.4); o += rr(p[0] - 2, p[1] - 1, 4, HS * 1.2, 0.6, '#6B4A2A', W * 0.8); }
  o += gbox(-0.5, -0.3, 0.5, 0.3, z - 2.4, z, { top: '#A47A4A', left: '#8A6238', right: '#7A5530' });
  for (let k = -4; k <= 4; k++) o += L(gp(k * 0.11, -0.3, z), gp(k * 0.11, 0.3, z), 'rgba(90,55,25,.5)', 0.7);
  const post = (u, v, h) => { const p = gp(u, v, z); return { s: rr(p[0] - 1.2, p[1] - h, 2.4, h, 0.6, '#5C3F24', 0.6), x: p[0], y: p[1] - h }; };
  const rope = (a, b) => tk(`M${r2(a.x)},${r2(a.y + 1)} Q${r2((a.x + b.x) / 2)},${r2((a.y + b.y) / 2 + 4)} ${r2(b.x)},${r2(b.y + 1)}`, 0.9, '#D9C08A');
  const lamp = u => { const t = post(u, 0.27, 24); return t.s + rr(t.x - 3.4, t.y - 8, 6.8, 2, 0.6, '#3D3A36', 0.5) + rr(t.x - 2.6, t.y - 6, 5.2, 6, 0.8, '#FFE08A', 0.8, '#3D3A36') + E(t.x, t.y - 3, 1, 1.8, '#FFF4C8', 0); };
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
M.epave_radeau = { frame: [-40, -56, 80, 64], n: 1, draw: () => `<g transform="rotate(-9)">`
  + rr(-30, -5, 60, 6, 3, WOOD.left) + [-20, -8, 4, 16].map(x => L([x, -4.6], [x, 0.6], WOOD.right, 0.7)).join('')
  + rr(-26, -11, 52, 6, 3, WOOD.top) + [-14, -2, 10].map(x => L([x, -10.6], [x, -5.4], WOOD.left, 0.7)).join('')
  + tk('M-22,-8 L22,-2', 0.6, '#D9C08A') + P('M-4,-11 L4,-44 L7,-43 L1,-11 Z', WOOD_DARK.left) + P('M5,-40 L22,-30 L6,-26 Z', '#E8E2D2', W * 0.8) + '</g>' };
M.epave_bateau = { frame: [-54, -72, 108, 90], n: 1, draw: () => `<g transform="rotate(12)">`
  + P('M-46,-10 L46,-10 L34,6 L-36,6 Z', '#7A5A3E') + L([-42, -5], [40, -5], '#5A3E28', 0.8) + pg([[-46, -10], [46, -10], [44, -7.4], [-44, -7.4]], '#A8825A', W * 0.7)
  + P('M-6,-10 L-2,-58 L2,-58 L2,-10 Z', WOOD_DARK.left) + P('M2,-52 L-30,-40 L2,-34 Z', '#E8E2D2', W * 0.8)
  + rr(-26, -18, 12, 8, 1, '#BDB5A8', W * 0.8) + rr(-10, -18, 10, 8, 1, '#A39B8E', W * 0.8) + rr(8, -16, 8, 6, 1, '#BDB5A8', W * 0.8) + '</g>' };
M.epave_barque = { frame: [-40, -32, 80, 44], n: 1, draw: () => `<g transform="rotate(-16)">`
  + P('M-30,-8 Q0,6 30,-8 L24,2 Q0,12 -24,2 Z', WOOD.left) + line('M-27,-5 Q0,8 27,-5', 0.8, WOOD.top)
  + E(-8, -3.8, 2.4, 2.4, '#C9A45A', W * 0.7) + E(2, -3, 2, 2, '#8A5A2E', W * 0.7) + E(10, -4, 2.2, 2.2, '#E2C27A', W * 0.7) + E(-3, -2.6, 1.4, 1.4, '#7FA65A', 0.5) + E(6, -2.4, 1.3, 1.3, '#C9A45A', 0.5)
  + line('M-27,-5 Q0,8 27,-5', 1.4, WOOD.left) + '</g>' };
const silhouette = body => body.replace(/fill="(?!none)[^"]*"/g, 'fill="#070E1E"').replace(/stroke="(?!none)[^"]*"/g, 'stroke="#070E1E"');

module.exports = { K, up, big, G, S, SIGN_TEXT, SIGN_FRAME, M, silhouette };
