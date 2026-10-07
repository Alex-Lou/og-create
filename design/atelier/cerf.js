// Le grand cerf blanc d'Anya : de profil, tourné vers la droite (le miroir donne la gauche), comme les bêtes du jeu,
// et de trois quarts avant et dos, comme Anya (voir cerf3 plus bas). Bois dorés qui luisent, fleurs dans les
// andouillers, jabot de fourrure, sabots dorés. Repère 80 × 80, sabots au sol en y = 77. Images : marche 1 et 2,
// repos (couché), et un clignement (pas de clignement de dos : les yeux ne se voient pas).
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

// pose : 'marche' (n = 0 | 1), 'repos' (couché), blink : yeux fermés ; view : 'profil' (défaut), 'avant' ou 'dos'
function cerfFrame(pose, n = 0, blink = false, view = 'profil') {
  if (view !== 'profil') return cerf3(view, pose, n, blink);
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

// ——— Trois quarts, comme Anya et les bêtes orientées : « avant » (il vient vers nous, en bas à droite) et « dos » (il
// s'éloigne, en haut à droite) ; le miroir donne les deux autres directions. Même repère ; le sabot le plus proche
// touche y = 77, les autres sont un peu plus haut (plus loin). Côté proche : à gauche de face, à droite de dos.
const DEG = Math.PI / 180;
// Corps en œuf incliné de a degrés ; egg > 0 : le bout droit plus gros (le poitrail de face), < 0 : le gauche (la croupe de dos)
function eggPath(cx, cy, rx, ry, a, egg) {
  const c = Math.cos(a * DEG), s = Math.sin(a * DEG), pts = [];
  for (let i = 0; i < 64; i++) {
    const t = (i / 64) * Math.PI * 2, x = Math.cos(t) * rx, y = Math.sin(t) * ry * (1 + egg * Math.cos(t));
    pts.push(`${r2(cx + x * c - y * s)},${r2(cy + x * s + y * c)}`);
  }
  return `M${pts.join(' L')} Z`;
}
// Sabot vu de biais (de face : la fente au milieu)
const hoof3 = (x, y, col, cleft) => P(`M${r2(x - 2)},${r2(y)} L${r2(x - 1.6)},${r2(y - 1.9)} L${r2(x + 1.6)},${r2(y - 1.9)} L${r2(x + 2)},${r2(y)} Z`, col, 0.8) + (cleft ? L([x, y - 1.5], [x, y - 0.2], OUT, 0.5) : '');
// Oreille tournée vers dir (-1 : à gauche, 1 : à droite), relevée de rot degrés ; back : vue de derrière (sans le rose)
function ear3(x, y, rot, dir, far, back) {
  const fill = far ? C.coatS : C.coat;
  return `<g transform="translate(${r2(x)} ${r2(y)}) scale(${-dir} 1) rotate(${rot})">${P('M0,0 Q-4.2,-2.8 -7.8,0 Q-4.2,2.4 0,0.9 Z', fill, 0.9)}${far || back ? '' : E(-4, 0.2, 2.2, 0.8, C.inner, 0)}</g>`;
}
// Bois de trois quarts : la perche, l'andouiller intérieur et l'extérieur, une fleur à chaque pointe ; dir : côté
function antler3(hx, hy, dir, col, w, k) {
  const at = (dx, dy) => `${r2(hx + dir * dx)},${r2(hy + dy)}`;
  const d = `M${at(2.4, -5)} C${at(4, -10.4)} ${at(8.2, -13.4)} ${at(8.4, -20.6)} M${at(4.2, -9.8)} Q${at(3, -12.6)} ${at(3.4, -15.8)} M${at(6.8, -14.2)} Q${at(10.2, -15)} ${at(12.6, -17.8)}`;
  return { d, svg: tine(d, w, col) + flower(hx + dir * 8.4, hy - 20.6, 1.05 * k) + flower(hx + dir * 3.4, hy - 15.8, 0.8 * k) + flower(hx + dir * 12.6, hy - 17.8, 0.9 * k) };
}
// Tête : de trois quarts avant (deux yeux, le museau vers nous, en bas à droite) ou de dos (la nuque, le bout du museau
// qui dépasse à droite) ; mêmes bois dorés fleuris, même lueur, mêmes étincelles qu'au profil
function head3(view, hx, hy, blink, tw, k) {
  const at = (dx, dy) => `${r2(hx + dx)},${r2(hy + dy)}`;
  const se = view === 'avant';
  // de face le bois proche est à gauche ; de dos, à droite
  const near = antler3(hx, hy, se ? -1 : 1, C.antler, 1.7, 1), far = antler3(hx, hy, se ? 1 : -1, C.antlerS, 1.4, 0.85);
  let s = `<path d="${near.d} ${far.d}" fill="none" stroke="rgb(${C.glow})" stroke-width="5.4" stroke-linecap="round" stroke-linejoin="round" opacity="0.35"/>`;
  const skull = `M${r2(hx - 6.8)},${r2(hy)} a6.8,6.2 0 1,0 13.6,0 a6.8,6.2 0 1,0 -13.6,0 Z`;
  if (se) {
    s += far.svg + ear3(hx + 4.6, hy - 3.6, 26, 1, true, false);
    s += E(hx, hy, 6.8, 6.2, C.coat) + clip(`ct${k}`, skull, `<ellipse cx="${r2(hx - 1.4)}" cy="${r2(hy + 6.2)}" rx="7" ry="2.4" fill="${C.shade}"/>`) + E(hx, hy, 6.8, 6.2, 'none');
    // museau qui pointe vers nous, truffe, bouche
    s += E(hx + 2.4, hy + 3.3, 3.7, 2.9, C.belly, 0.9) + E(hx + 3.1, hy + 2.1, 1.3, 0.95, C.nose, 0.6) + E(hx + 2.7, hy + 1.8, 0.4, 0.25, '#FFFFFF', 0);
    s += P(`M${at(1.4, 4.7)} Q${at(2.5, 5.5)} ${at(3.8, 4.6)}`, 'none', 0.6);
    // joues roses, yeux (ou paupières fermées), cils vers l'extérieur
    s += E(hx - 3.9, hy + 2.3, 1.8, 0.9, '#F6C2C2', 0) + E(hx + 5.6, hy + 1.2, 1.1, 0.8, '#F6C2C2', 0);
    s += blink
      ? P(`M${at(-4, -0.8)} Q${at(-2.6, 0.8)} ${at(-1.2, -0.8)} M${at(2.2, -1.4)} Q${at(3.4, 0)} ${at(4.6, -1.4)}`, 'none', 0.9)
      : E(hx - 2.6, hy - 0.7, 1.35, 1.75, C.eye, 0) + E(hx - 2.1, hy - 1.5, 0.55, 0.55, '#FFFFFF', 0) + E(hx - 3, hy + 0.2, 0.25, 0.25, '#FFFFFF', 0) + L([hx - 3.7, hy - 2.1], [hx - 4.7, hy - 2.9], OUT, 0.5)
        + E(hx + 3.4, hy - 1.3, 1.15, 1.55, C.eye, 0) + E(hx + 3.8, hy - 2, 0.48, 0.48, '#FFFFFF', 0) + L([hx + 4.3, hy - 2.6], [hx + 5.2, hy - 3.3], OUT, 0.5);
    s += ear3(hx - 4.6, hy - 3.4, 22, -1, false, false) + near.svg;
  } else {
    // le bout du museau qui dépasse derrière la joue, le crâne, l'ombre de la nuque, les oreilles de dos, puis les bois
    s += E(hx + 5.6, hy + 1.6, 2.6, 2.1, C.belly, 0.9) + E(hx + 7.4, hy + 0.9, 0.7, 0.6, C.nose, 0);
    s += ear3(hx - 4.4, hy - 3, 24, -1, true, true);
    s += E(hx, hy, 6.8, 6.2, C.coat) + clip(`ct${k}`, skull, `<ellipse cx="${r2(hx - 0.8)}" cy="${r2(hy + 5.6)}" rx="6.2" ry="3.4" fill="${C.shade}"/><path d="M${at(-3.4, -4.4)} Q${at(0, -6.4)} ${at(3.4, -4.4)}" fill="none" stroke="#FFFFFF" stroke-width="0.9" stroke-linecap="round" opacity="0.6"/>`) + E(hx, hy, 6.8, 6.2, 'none');
    s += E(hx + 5.2, hy + 2.6, 1.3, 0.7, '#F6C2C2', 0);
    s += ear3(hx + 4.6, hy - 3.2, 24, 1, false, true) + far.svg + near.svg;
  }
  s += tw ? sparkle(hx - 14, hy - 13, 1.5) + sparkle(hx + 14.2, hy - 20.4, 1) + sparkle(hx + 1, hy - 25.6, 0.85)
    : sparkle(hx - 11.4, hy - 24.4, 1.1) + sparkle(hx + 15, hy - 12.4, 1.4) + sparkle(hx - 2, hy - 26.4, 0.75);
  return `<g transform="translate(${r2(hx)} ${r2(hy)}) scale(1.22) translate(${r2(-hx)} ${r2(-hy)})">${s}</g>`;
}
// Jabot vu de face : un écusson de fourrure sur le poitrail, festonné en arc par le bas
function bib(x0, x1, y0, y1, n) {
  const xc = (x0 + x1) / 2, hw = (x1 - x0) / 2;
  const pt = (t) => [xc - hw + 2 * hw * t, y1 - 3.2 * (2 * t - 1) ** 2];
  let edge = `M${pt(0).map(r2)}`;
  for (let i = 1; i <= n; i++) {
    const [ax, ay] = pt((i - 1) / n), [bx, by] = pt(i / n), [mx, my] = pt((i - 0.5) / n);
    edge += ` Q${r2(mx + (mx - xc) * 0.08)},${r2(my + 2)} ${r2(bx)},${r2(by)}`;
  }
  const [lx, ly] = pt(0), [rx, ry] = pt(1);
  const d = `M${r2(xc - hw * 0.6)},${r2(y0)} C${r2(xc - hw * 1.04)},${r2(y0 + 2.6)} ${r2(lx - 0.4)},${r2(ly - 3)} ${r2(lx)},${r2(ly)}${edge.replace(/^M[^ ]+/, '')} C${r2(rx + 0.4)},${r2(ry - 3)} ${r2(xc + hw * 1.04)},${r2(y0 + 2.6)} ${r2(xc + hw * 0.6)},${r2(y0)} Z`;
  const tufts = [[0.3, 0.45], [0.62, 0.4], [0.46, 0.7]].map(([tx, ty]) => `M${r2(x0 + 2 * hw * tx - 0.8)},${r2(y0 + (y1 - y0) * ty)} q0.8,1.3 1.6,0`).join(' ');
  return P(d, C.belly, 0) + P(edge, 'none', 0.8) + `<path d="${tufts}" fill="none" stroke="${C.coatS}" stroke-width="0.7" stroke-linecap="round"/>`;
}
// Collier de fourrure vu de dos, sous la tête : une rangée de festons (le haut passe sous la tête)
function collar(x0, x1, y, n) {
  const w = x1 - x0;
  let edge = `M${r2(x0)},${r2(y)}`;
  for (let i = 1; i <= n; i++) edge += ` Q${r2(x0 + w * (i - 0.5) / n)},${r2(y + 1.8)} ${r2(x0 + w * i / n)},${r2(y - (i === n ? 0.6 : 0))}`;
  return P(`${edge} L${r2(x1 - 0.6)},${r2(y - 4)} L${r2(x0 + 0.6)},${r2(y - 4)} Z`, C.belly, 0) + P(edge, 'none', 0.8);
}

// view : 'avant' | 'dos' ; pose : 'marche' (n = 0 | 1) ou 'repos' (couché) ; blink : yeux fermés (de face)
function cerf3(view, pose, n, blink) {
  const se = view === 'avant';
  const k = `${view}${pose}${n}${blink ? 1 : 0}`;
  const rest = pose === 'repos';
  const by = !rest && n ? -0.6 : 0, ph = n ? -1 : 1;
  let s = `<defs><radialGradient id="cg${k}"><stop offset="0" stop-color="rgb(${C.glow})" stop-opacity="0.4"/><stop offset="1" stop-color="rgb(${C.glow})" stop-opacity="0"/></radialGradient></defs>`
    + `<ellipse cx="40" cy="44" rx="40" ry="36" fill="url(#cg${k})"/>`;
  // le corps : de face le poitrail est en bas à droite (plus gros, plus près), de dos la croupe en bas à gauche
  const a = se ? 16 : -16;
  const [cx, cy, rx, ry] = rest ? [se ? 36 : 38, 67.4, 15, 8.2] : [se ? 35.6 : 38, 49.4 + by, se ? 13.8 : 14.6, 9.2];
  const d = eggPath(cx, cy, rx, ry, rest ? a * 0.6 : a, se ? 0.1 : -0.1);
  const [hx, hy] = rest ? (se ? [52.2, 44.6] : [51, 47.6]) : (se ? [52.6, 25.6 + by] : [50.8, 27.6 + by]);
  s += `<ellipse cx="${se ? 37 : 39}" cy="${rest ? 76.4 : 73.6}" rx="${rest ? 19 : 20}" ry="${rest ? 2.6 : 4.4}" fill="rgba(40,55,20,.18)" transform="rotate(${se ? 8 : -8} ${se ? 37 : 39} ${rest ? 76.4 : 73.6})"/>`;
  // les pattes : du plus loin (plus haut) au plus proche ; la paire en diagonale avance pendant que l'autre recule
  if (!rest) {
    const st = 1.4 * ph;
    const L4 = se
      ? [{ hip: [30, 50.6], foot: [29.4, 69], hind: 1, near: 0, sw: st }, { hip: [24.4, 52.4], foot: [23, 71.2], hind: 1, near: 1, sw: -st },
        { hip: [49.4, 56], foot: [50.6, 74.6], hind: 0, near: 0, sw: -st }, { hip: [43.4, 58], foot: [44, 77], hind: 0, near: 1, sw: st }]
      : [{ hip: [45.4, 49.6], foot: [45.4, 68.6], hind: 0, near: 0, sw: st }, { hip: [50.4, 51.4], foot: [52, 70.6], hind: 0, near: 1, sw: -st },
        { hip: [24.4, 55.4], foot: [23.6, 74.6], hind: 1, near: 0, sw: -st }, { hip: [29.6, 57.2], foot: [30.5, 77], hind: 1, near: 1, sw: st }];
    for (const l of L4) {
      const fx = l.foot[0] + l.sw * 0.9, fy = l.foot[1] + l.sw * (se ? 0.32 : -0.32);
      const hip = [l.hip[0], l.hip[1] + by], mid = [(hip[0] + fx) / 2 + (l.hind ? -1.3 : 0.6), (hip[1] + fy) / 2 + 0.6];
      const [w0, w1] = l.near ? (l.hind ? [4.6, 2.9] : [4.8, 3]) : [4.2, 2.6];
      s += leg([hip, mid, [fx, fy - 1.6]], w0, w1, l.near ? C.coat : C.coatS) + hoof3(fx, fy, l.near ? C.hoof : C.hoofS, se);
    }
  }
  // de dos, le cou et la tête sont plus loin que le corps : on les dessine avant lui
  const neckD = se
    ? (rest ? [[42.6, 64], [44.2, 57.4], [46.8, 51.6], [55.8, 51], [55, 56.4], [55, 64]] : [[42.4, 47.6], [43.8, 40.6], [46.6, 34.4], [56.4, 32.4], [55.2, 37.8], [55.4, 47.6]])
    : (rest ? [[44.6, 63], [45.2, 58], [46.4, 54], [56, 52.6], [55.6, 57.6], [53.6, 63.4]] : [[44.2, 42.6], [45, 37.4], [46.2, 33.4], [55.8, 32], [55.4, 37.4], [52.4, 44.8]]);
  const nk = neckD.map(([x, y]) => [x, rest ? y : y + by]);
  const neckPath = `M${nk[0].map(r2)} C${nk[1].map(r2)} ${nk[2].map(r2)} ${r2(nk[2][0] + 0.4)},${r2(nk[2][1] - 1.2)} L${r2(nk[3][0])},${r2(nk[3][1] - 1)} C${nk[3].map(r2)} ${nk[4].map(r2)} ${nk[5].map(r2)} Z`;
  const neckLines = `M${nk[0].map(r2)} C${nk[1].map(r2)} ${nk[2].map(r2)} ${r2(nk[2][0] + 0.4)},${r2(nk[2][1] - 1.2)} M${r2(nk[3][0])},${r2(nk[3][1] - 1)} C${nk[3].map(r2)} ${nk[4].map(r2)} ${nk[5].map(r2)}`;
  const neck = P(neckPath, C.coat, 0) + P(neckLines, 'none');
  if (!se) s += neck + collar(hx - 5.6, hx + 5.4, hy + 7.4, 4) + head3(view, hx, hy, false, n, k);
  // queue : de face elle dépasse derrière la croupe (en haut à gauche) ; de dos elle pend sur la croupe, devant
  if (se) s += rest ? tail(21.8, 62.4, 12) : tail(21.6, 43.8 + by, n ? 4 : 16);
  // le corps : ombre du ventre, cuisse, épaule, taches argentées, reflet sur le dos ; de dos, la croupe plus claire
  const u = (t, v) => { const c = Math.cos((rest ? a * 0.6 : a) * DEG), sn = Math.sin((rest ? a * 0.6 : a) * DEG); const x = t * rx, y = v * ry; return [r2(cx + x * c - y * sn), r2(cy + x * sn + y * c)]; };
  const haunch = se ? `M${u(-0.62, -0.5)} Q${u(-0.82, 0.3)} ${u(-0.4, 0.86)}` : `M${u(-0.2, -0.62)} Q${u(0.06, 0.2)} ${u(-0.24, 0.9)}`;
  const shoulder = se ? `M${u(0.48, -0.56)} Q${u(0.7, 0.2)} ${u(0.5, 0.92)}` : `M${u(0.56, -0.7)} Q${u(0.74, 0.1)} ${u(0.58, 0.82)}`;
  const spots = (se ? [[-0.4, -0.5], [-0.05, -0.62], [0.3, -0.44], [-0.2, -0.18], [0.12, -0.12]] : [[-0.5, -0.4], [-0.12, -0.6], [0.26, -0.52], [-0.28, -0.12], [0.1, -0.2]])
    .map(([t, v], i) => { const [x, y] = u(t, v); return [x, y, [1.6, 1.3, 1.4, 1.1, 1.1][i], [1.1, 0.9, 1, 0.8, 0.8][i]]; });
  s += P(d, C.coat) + clip(`cb${k}`, d, `<ellipse cx="${u(0.05, 1)[0]}" cy="${u(0.05, 1)[1] + 1.4}" rx="${r2(rx * 1.2)}" ry="${r2(ry * 0.56)}" fill="${C.shade}"/>`
    + (se ? '' : `<ellipse cx="${u(-0.86, 0.1)[0]}" cy="${u(-0.86, 0.1)[1]}" rx="${r2(rx * 0.36)}" ry="${r2(ry * 0.66)}" fill="${C.belly}"/>`)
    + `<path d="${haunch}" fill="none" stroke="${C.coatS}" stroke-width="1.1" stroke-linecap="round"/><path d="${shoulder}" fill="none" stroke="${C.coatS}" stroke-width="1.1" stroke-linecap="round"/>`
    + spots.map(([x, y, sx, sy]) => E(x, y, sx, sy, C.spot, 0)).join('')
    + `<path d="M${u(-0.5, -0.86)} Q${u(0, -1.12)} ${u(0.42, -0.9)}" fill="none" stroke="#FFFFFF" stroke-width="0.9" stroke-linecap="round" opacity="0.55"/>`) + P(d, 'none');
  // couché : les pattes repliées sous le corps, côté proche
  if (rest) s += se
    ? seg([24.6, 73.8], [30.6, 75.8], 4.6, OUT) + seg([24.6, 73.8], [30.6, 75.8], 2.4, C.coat) + E(32.4, 76, 1.8, 1.2, C.hoof, 0.8)
      + seg([44, 73.4], [49.8, 75.4], 5, OUT) + seg([44, 73.4], [49.8, 75.4], 2.8, C.coat) + E(51.6, 75.8, 1.9, 1.3, C.hoof, 0.8)
    : seg([31.4, 74.6], [37.6, 76], 4.8, OUT) + seg([31.4, 74.6], [37.6, 76], 2.6, C.coat) + E(39.4, 76.2, 1.8, 1.2, C.hoof, 0.8);
  // de dos, la queue sur la croupe
  if (!se) {
    const [tx, ty] = u(-0.92, -0.4), w = rest ? 0 : ph * 0.5;
    s += P(`M${r2(tx + 0.6)},${r2(ty - 2.2)} Q${r2(tx - 3.6 + w)},${r2(ty + 0.2)} ${r2(tx - 1 + w)},${r2(ty + 4.8)} Q${r2(tx + 3)},${r2(ty + 2.6)} ${r2(tx + 0.6)},${r2(ty - 2.2)} Z`, C.belly, 0.9)
      + `<path d="M${r2(tx - 0.2)},${r2(ty)} q-0.6,1.6 -0.2,3" fill="none" stroke="${C.coatS}" stroke-width="0.6" stroke-linecap="round"/>`;
  }
  // de face, le cou devant le corps, le jabot sur le poitrail, puis la tête
  if (se) s += neck + (rest ? bib(43.6, 55.2, 55.4, 65.4, 5) : bib(43.2, 55.2, 38.6 + by, 49.6 + by, 5)) + head3(view, hx, hy, blink, n, k);
  return s;
}

const svgC = (body, scale = 1) => `<svg xmlns="http://www.w3.org/2000/svg" width="${80 * scale}" height="${92 * scale}" viewBox="0 -12 80 92">${body}</svg>`;
module.exports = { cerfFrame, svgC };
