// Le grand cerf blanc d'Anya : de profil, tourné vers la droite (le miroir donne la gauche), comme les bêtes du jeu.
// Bois dorés qui luisent, fleurs dans les andouillers, jabot de fourrure, sabots dorés. Repère 80 × 80, sabots au
// sol en y = 77. Images : marche 1 et 2, repos (couché), et un clignement.
const { OUT, P, E, L, clip, r2 } = require('./troupe');

const C = { coat: '#F7F4EC', coatS: '#DCD6C8', shade: '#E6E0D3', belly: '#FFFFFF', antler: '#F2C94C', antlerS: '#D6A63A', hoof: '#E2B85A', hoofS: '#C2953C', nose: '#6A5450', eye: '#2A2420', petal: '#F7C6D9', glow: '255,225,140', spot: '#E2DCCD', inner: '#F2C6C0' };

const seg = (a, b, w, color) => `<path d="M${r2(a[0])},${r2(a[1])} L${r2(b[0])},${r2(b[1])}" stroke="${color}" stroke-width="${r2(w)}" stroke-linecap="round"/>`;
// Patte en deux segments (cuisse ou avant-bras, puis canon) : les contours d'abord, la couleur par-dessus
const leg = ([a, b, c], w0, w1, fill) => seg(a, b, w0 + 2.2, OUT) + seg(b, c, w1 + 2.2, OUT) + seg(a, b, w0, fill) + seg(b, c, w1, fill);
// Sabot posé au sol (y = 77)
const hoof = (x, col) => P(`M${r2(x - 1.9)},77 L${r2(x - 1.5)},75 L${r2(x + 1.6)},75 L${r2(x + 2.2)},77 Z`, col, 0.8);
const tine = (d, w, col) => `<path d="${d}" fill="none" stroke="${OUT}" stroke-width="${w + 1.6}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
const flower = (x, y, r) => [0, 72, 144, 216, 288].map(a => E(x + Math.cos(a * Math.PI / 180) * r, y + Math.sin(a * Math.PI / 180) * r, r * 0.75, r * 0.75, C.petal, 0.4)).join('') + E(x, y, r * 0.5, r * 0.5, '#FFE7A3', 0.3);
const sparkle = (x, y, r) => `<path d="M${r2(x)},${r2(y - r)} Q${r2(x)},${r2(y)} ${r2(x + r)},${r2(y)} Q${r2(x)},${r2(y)} ${r2(x)},${r2(y + r)} Q${r2(x)},${r2(y)} ${r2(x - r)},${r2(y)} Q${r2(x)},${r2(y)} ${r2(x)},${r2(y - r)} Z" fill="#FFF2B8" opacity="0.9"/>`;

// Oreille en feuille, couchée vers l'arrière ; far : celle de derrière, plus sombre
function ear(x, y, rot, far) {
  return `<g transform="rotate(${rot} ${r2(x)} ${r2(y)})">${P(`M${r2(x)},${r2(y)} Q${r2(x - 4.2)},${r2(y - 2.8)} ${r2(x - 7.8)},${r2(y)} Q${r2(x - 4.2)},${r2(y + 2.4)} ${r2(x)},${r2(y + 0.9)} Z`, far ? C.coatS : C.coat, 0.9)}${far ? '' : E(x - 4, y + 0.2, 2.2, 0.8, C.inner, 0)}</g>`;
}

// Tête de profil (museau à droite) ; hx, hy : centre du crâne ; tw : les étincelles qui scintillent (0 | 1) ; k : clé de l'image
function head(hx, hy, blink, tw, k) {
  const at = (dx, dy) => `${r2(hx + dx)},${r2(hy + dy)}`;
  const far = `M${at(2, -5)} C${at(4, -9.6)} ${at(7.6, -12.8)} ${at(9, -18.6)} M${at(4.4, -10)} Q${at(7, -9.8)} ${at(9.2, -10.6)} M${at(6.8, -14)} Q${at(9.6, -14)} ${at(11.8, -15.4)}`;
  const near = `M${at(-1.2, -5)} C${at(-2.4, -11)} ${at(-5.6, -15)} ${at(-4.6, -22.4)} M${at(-2.6, -10.8)} Q${at(-0.6, -12.6)} ${at(0.4, -15)} M${at(-4.4, -15.6)} Q${at(-7.6, -16.8)} ${at(-9.6, -19.4)}`;
  let s = `<path d="${far} ${near}" fill="none" stroke="rgb(${C.glow})" stroke-width="5.4" stroke-linecap="round" stroke-linejoin="round" opacity="0.35"/>`;
  // le bois éloigné et l'oreille éloignée, derrière le crâne
  s += tine(far, 1.4, C.antlerS) + flower(hx + 9, hy - 18.6, 0.8) + flower(hx + 11.8, hy - 15.4, 0.7);
  s += ear(hx + 1.4, hy - 4.2, -52, true);
  // crâne, museau, truffe, bouche
  s += E(hx, hy, 7, 6.3, C.coat);
  s += clip(`ct${k}`, `M${r2(hx - 7)},${r2(hy)} a7,6.3 0 1,0 14,0 a7,6.3 0 1,0 -14,0 Z`, `<ellipse cx="${r2(hx - 1)}" cy="${r2(hy + 6)}" rx="7" ry="2.6" fill="${C.shade}"/>`) + E(hx, hy, 7, 6.3, 'none');
  s += E(hx + 5.2, hy + 2.6, 3.8, 3, C.belly, 0.9) + E(hx + 8.3, hy + 1.7, 1.15, 0.95, C.nose, 0.6);
  s += P(`M${at(6.4, 4.5)} Q${at(7.4, 5.1)} ${at(8.4, 4.3)}`, 'none', 0.6);
  // joue rose, œil (ou paupière fermée), cil
  s += E(hx - 0.6, hy + 2.6, 2, 1, '#F6C2C2', 0);
  s += blink ? P(`M${at(0.3, -0.6)} Q${at(1.8, 1)} ${at(3.3, -0.6)}`, 'none', 0.9)
    : E(hx + 1.8, hy - 0.6, 1.35, 1.75, C.eye, 0) + E(hx + 2.3, hy - 1.4, 0.55, 0.55, '#FFFFFF', 0) + E(hx + 1.3, hy + 0.3, 0.25, 0.25, '#FFFFFF', 0) + L([hx + 2.9, hy - 2.1], [hx + 4, hy - 3], OUT, 0.5);
  // oreille proche, puis le bois proche et ses fleurs
  s += ear(hx - 2.6, hy - 4, -28, false);
  s += tine(near, 1.7, C.antler) + flower(hx - 4.6, hy - 22.4, 1.1) + flower(hx - 9.6, hy - 19.4, 1) + flower(hx + 0.4, hy - 15, 0.85);
  // étincelles autour des bois
  s += tw ? sparkle(hx - 13.4, hy - 13.6, 1.5) + sparkle(hx + 13, hy - 21.6, 1) + sparkle(hx + 3.4, hy - 25.4, 0.85)
    : sparkle(hx - 11.6, hy - 24.2, 1.1) + sparkle(hx + 14, hy - 12.6, 1.4) + sparkle(hx - 1.8, hy - 26.2, 0.75);
  return `<g transform="translate(${r2(hx)} ${r2(hy)}) scale(1.22) translate(${r2(-hx)} ${r2(-hy)})">${s}</g>`;
}

// Jabot de fourrure blanche au bas de la gorge : n festons de (x0, y0) à (x1, y1), qui débordent de bw vers l'avant ;
// le blanc mord un peu dans le cou pour couvrir le trait de la gorge
function ruff(x0, y0, x1, y1, n, bw) {
  const at = (t, dx) => `${r2(x0 + (x1 - x0) * t + dx)},${r2(y0 + (y1 - y0) * t)}`;
  let edge = `M${at(0, 0)}`;
  for (let i = 1; i <= n; i++) edge += ` Q${at((i - 0.5) / n, bw)} ${at(i / n, i < n ? bw * 0.4 : 0)}`;
  return P(`${edge} L${at(1, -1.6)} L${at(0, -1.6)} Z`, C.belly, 0) + P(edge, 'none', 0.8);
}

// Ombre douce du ventre, ligne de la cuisse et de l'épaule, taches argentées, dans la silhouette d
function coat(id, d, under, haunch, shoulder, spots) {
  const line = (p) => `<path d="${p}" fill="none" stroke="${C.coatS}" stroke-width="1.1" stroke-linecap="round"/>`;
  return clip(id, d, `<ellipse cx="${under[0]}" cy="${under[1]}" rx="${under[2]}" ry="${under[3]}" fill="${C.shade}"/>` + line(haunch) + line(shoulder)
    + spots.map(([x, y, rx, ry]) => E(x, y, rx, ry, C.spot, 0)).join(''));
}

const tail = (x, y, rot) => `<g transform="rotate(${rot} ${r2(x)} ${r2(y)})">${P(`M${r2(x + 1.4)},${r2(y - 0.6)} Q${r2(x - 3.2)},${r2(y - 4)} ${r2(x - 3.4)},${r2(y)} Q${r2(x - 2.8)},${r2(y + 3)} ${r2(x + 1)},${r2(y + 2.4)} Z`, C.belly, 0.9)}</g>`;

// pose : 'marche' (n = 0 | 1), 'repos' (couché), blink : yeux fermés
function cerfFrame(pose, n = 0, blink = false) {
  const k = `${pose}${n}${blink ? 1 : 0}`;
  let s = `<defs><radialGradient id="cg${k}"><stop offset="0" stop-color="rgb(${C.glow})" stop-opacity="0.4"/><stop offset="1" stop-color="rgb(${C.glow})" stop-opacity="0"/></radialGradient></defs>`
    + `<ellipse cx="40" cy="44" rx="40" ry="36" fill="url(#cg${k})"/>`;
  if (pose === 'repos') {
    // couché : pattes repliées sous le corps, le cou qui monte du poitrail, tête haute
    const d = 'M24,75.6 C18.6,74.6 17,67.6 20.8,63.4 C24.6,59.6 32.4,58.8 39.6,59 C45,59.2 48.6,58 51,55 C53,52.2 54.2,48.4 55.8,44.4 L61.4,46.6 C60,51 59.4,55.4 59.8,59.6 C60.4,65.4 61.6,70.6 58.6,73.8 C53.4,76.8 33.2,76.9 24,75.6 Z';
    s += E(41, 77, 24, 1.8, 'rgba(40,55,20,.18)', 0) + tail(20.2, 64.4, -10);
    s += P(d, C.coat) + coat(`cb${k}`, d, [40, 77.4, 21, 4.6], 'M22.6,64 Q26,72.6 34.4,75.8', 'M52.4,60 Q54.6,67 51.4,74', [[31.6, 63.4, 1.5, 1], [37.2, 61.6, 1.3, 0.9], [42.6, 63.6, 1.4, 1], [35, 66.6, 1.1, 0.8], [47, 62.2, 1.1, 0.8]]) + P(d, 'none');
    s += ruff(59.4, 55.4, 60.2, 67.4, 3, 2.6);
    // patte arrière repliée le long du sol, patte avant repliée vers l'avant
    s += seg([31.4, 75.4], [35.6, 75.9], 4.6, OUT) + seg([31.4, 75.4], [35.6, 75.9], 2.4, C.coat) + E(37.3, 76, 1.8, 1.2, C.hoof, 0.8);
    s += seg([55.6, 72.8], [62, 75.2], 5, OUT) + seg([55.6, 72.8], [62, 75.2], 2.8, C.coat) + E(63.8, 75.6, 1.9, 1.3, C.hoof, 0.8);
    return s + head(60.6, 41.2, blink, 0, k);
  }
  const step = n ? 1 : -1;
  const by = n ? -0.6 : 0;
  const b = (x, y) => `${r2(x)},${r2(y + by)}`;
  s += E(38, 77, 20, 1.6, 'rgba(40,55,20,.18)', 0);
  // pattes, sous le corps : la paire éloignée plus sombre, puis la proche ; jarret en arrière, genou en avant
  s += leg([[28, 55 + by], [25 + step * 1.2, 65.6], [26.6 - step * 2.6, 75.2]], 4.4, 2.7, C.coatS) + hoof(26.6 - step * 2.6, C.hoofS);
  s += leg([[48, 55 + by], [49.6 + step * 1.2, 65.2], [48.6 + step * 2.6, 75.2]], 4.2, 2.7, C.coatS) + hoof(48.6 + step * 2.6, C.hoofS);
  s += tail(20.2, 46.6 + by, n ? -16 : -4);
  s += leg([[31.4, 55 + by], [28.4 - step * 1.2, 66], [30.4 + step * 2.6, 75.2]], 4.8, 2.9, C.coat) + hoof(30.4 + step * 2.6, C.hoof);
  s += leg([[51.4, 55 + by], [52.6 - step * 1.2, 65.4], [51.4 - step * 2.6, 75.2]], 4.6, 2.9, C.coat) + hoof(51.4 - step * 2.6, C.hoof);
  // corps et cou d'une seule silhouette, ombre du ventre, cuisse, épaule, taches argentées
  const d = `M${b(22.8, 57.8)} C${b(18.6, 55.2)} ${b(18.4, 49.6)} ${b(20.4, 46)} C${b(22.4, 41.8)} ${b(27.4, 40)} ${b(33.4, 40.2)} C${b(39.6, 40.4)} ${b(44.4, 39.6)} ${b(47.5, 37.5)} C${b(50.4, 34.6)} ${b(52.6, 30.4)} ${b(54.4, 26.6)} L${b(59, 28.4)} C${b(57.6, 33.6)} ${b(56.2, 38.6)} ${b(56.6, 44.4)} C${b(57.2, 50.4)} ${b(55.8, 56)} ${b(50.4, 58.8)} C${b(45.6, 60.4)} ${b(40.4, 58.6)} ${b(35.6, 58.8)} C${b(30.6, 59)} ${b(26, 60)} ${b(22.8, 57.8)} Z`;
  s += P(d, C.coat) + coat(`cb${k}`, d, [38, 61.2 + by, 20, 5], `M${b(22.4, 49.6)} Q${b(25, 57)} ${b(33, 59.6)}`, `M${b(51.2, 45.6)} Q${b(52.4, 53)} ${b(48.6, 59.2)}`,
    [[30, 45.2 + by, 1.6, 1.1], [35.6, 43.4 + by, 1.3, 0.9], [40.6, 45.6 + by, 1.4, 1], [33.2, 48.6 + by, 1.1, 0.8], [45.4, 43.6 + by, 1.1, 0.8]]) + P(d, 'none');
  s += ruff(56, 37.4 + by, 56.4, 50.4 + by, 3, 2.6);
  return s + head(58.6, 23.4 + by, blink, n, k);
}

const svgC = (body, scale = 1) => `<svg xmlns="http://www.w3.org/2000/svg" width="${80 * scale}" height="${92 * scale}" viewBox="0 -12 80 92">${body}</svg>`;
module.exports = { cerfFrame, svgC };
