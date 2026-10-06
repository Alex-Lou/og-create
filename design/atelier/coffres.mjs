// Lot I — les coffres de l'île, au trait de la troupe, pour la fenêtre d'ouverture du jeu (ChestReveal : vue de face,
// cadre 120 × 100, mêmes proportions) : un coffre par rareté (commun, rare, épique, légendaire, couleurs de
// world/chest.js), fermé (2 images : un reflet passe), qui s'ouvre (4 images : il tremble à gauche, à droite, le
// couvercle s'entrouvre et la lumière fuit, il s'ouvre grand), ouvert (2 images : la lueur respire, des étincelles), et
// une petite icône fermée (32 × 32) pour les listes. Vu un peu de trois quarts : la face, le flanc droit, le couvercle
// bombé.
const OUT = '#3C2819';
const f2 = n => Math.round(n * 100) / 100;
const W = ' stroke="#3C2819" stroke-width="1.1" stroke-linejoin="round" stroke-linecap="round"';
const w = (x) => ` stroke="#3C2819" stroke-width="${x}" stroke-linejoin="round" stroke-linecap="round"`;
let uid = 0;
const id = p => `cf${p}${uid++}`;

// Les quatre coffres : bois (face, flanc, dessus), ferrures, serrure, intérieur, lueur ; et leurs ornements
export const RARITIES = {
  commun: { label: 'Commun', glow: '#9DBB6E', wood: ['#D2A06A', '#B07E4E', '#E2B880'], band: ['#9AA0A8', '#767C86'], lock: '#9AA0A8', inner: '#6E4A2C', velvet: '#8A5A36' },
  rare: { label: 'Rare', glow: '#4C8FE8', wood: ['#9A6440', '#7A4C2E', '#B07650'], band: ['#5E86C2', '#40669E'], lock: '#C8D4E2', inner: '#4A3020', velvet: '#2E4E8A' },
  epique: { label: 'Épique', glow: '#A86BE8', wood: ['#7E4E78', '#5E3858', '#94608E'], band: ['#E2B54A', '#B88A2A'], lock: '#F2C94C', inner: '#3A2238', velvet: '#6A3E9E', gem: '#B884F2' },
  legendaire: { label: 'Légendaire', glow: '#F2C04B', wood: ['#F2C64E', '#D2A232', '#FBDC7A'], band: ['#C2543A', '#963C28'], lock: '#FFF4C8', inner: '#7A4A1A', velvet: '#C8463A', gem: '#4FC8C0', runes: true }
};

// Géométrie (pixels du cadre 120 × 100) : face avant, flanc (profondeur vers le haut à droite), couvercle bombé
const X0 = 24, X1 = 90, YT = 52, YB = 86, DX = 12, DY = -6, LH = 13; // LH : hauteur du bombé du couvercle

// Le corps du coffre (face + flanc), ses ferrures, sa serrure
function body(r, st = {}) {
  const [face, side] = r.wood;
  let o = '';
  // flanc droit
  o += `<path d="M${X1},${YT} L${X1 + DX},${YT + DY} L${X1 + DX},${YB + DY} L${X1},${YB} Z" fill="${side}"${W}/>`;
  // face avant, ses planches
  o += `<rect x="${X0}" y="${YT}" width="${X1 - X0}" height="${YB - YT}" rx="2" fill="${face}"${W}/>`;
  for (const y of [YT + 12, YT + 24]) o += `<path d="M${X0 + 1},${y} L${X1 - 1},${y}" stroke="rgba(60,40,25,.35)" stroke-width="0.8"/>`;
  for (const y of [YT + 11, YT + 23]) o += `<path d="M${X1 + 0.6},${y} L${X1 + DX - 0.6},${y + DY}" stroke="rgba(60,40,25,.35)" stroke-width="0.8"/>`;
  // ferrures : deux montants, une ceinture, coins
  const [bl, bd] = r.band;
  for (const x of [X0 + 7, X1 - 13]) o += `<rect x="${x}" y="${YT}" width="6" height="${YB - YT}" fill="${bl}"${w(0.9)}/>`;
  o += `<path d="M${X1 + 1.5},${YT - 0.8} L${X1 + 4.5},${YT - 2.6} L${X1 + 4.5},${YB - 2.6} L${X1 + 1.5},${YB - 0.8} Z" fill="${bd}"${w(0.8)}/>`;
  o += `<rect x="${X0}" y="${YT + 18}" width="${X1 - X0}" height="5" fill="${bl}"${w(0.9)}/>`;
  o += `<path d="M${X1},${YT + 18} L${X1 + DX},${YT + 18 + DY} L${X1 + DX},${YT + 23 + DY} L${X1},${YT + 23} Z" fill="${bd}"${w(0.8)}/>`;
  for (const [x, y] of [[X0 + 10, YT + 4], [X0 + 10, YB - 4], [X1 - 10, YT + 4], [X1 - 10, YB - 4], [X0 + 4, YT + 20.5], [X1 - 4, YT + 20.5]]) o += `<circle cx="${x}" cy="${y}" r="0.9" fill="${bd}"/>`;
  // ornements : gemme (épique, légendaire), runes (légendaire)
  if (r.runes) o += runes(st.lit ?? 0.5, YT + 9, r);
  // la serrure
  const cx = (X0 + X1) / 2;
  o += `<path d="M${cx - 7},${YT} L${cx + 7},${YT} L${cx + 7},${YT + 13} Q${cx},${YT + 17} ${cx - 7},${YT + 13} Z" fill="${r.lock}"${W}/>`;
  o += `<circle cx="${cx}" cy="${YT + 6}" r="1.6" fill="${OUT}"/><path d="M${cx - 0.9},${YT + 7} L${cx + 0.9},${YT + 7} L${cx + 0.5},${YT + 10.6} L${cx - 0.5},${YT + 10.6} Z" fill="${OUT}"/>`;
  if (r.gem) o += `<circle cx="${cx}" cy="${YT + 21}" r="2.6" fill="${r.gem}"${w(0.8)}/><circle cx="${cx - 0.8}" cy="${YT + 20.2}" r="0.8" fill="#FFFFFF" opacity=".8"/>`;
  // le reflet du dessus de la face
  o += `<path d="M${X0 + 2},${YT + 2} L${X1 - 16},${YT + 2}" stroke="rgba(255,255,255,.35)" stroke-width="1.1"/>`;
  return o;
}
// runes qui luisent sur la face du coffre légendaire
function runes(o, y, r) {
  const g = (x, d) => `<path d="${d}" transform="translate(${x} ${y})" fill="none" stroke="rgba(79,200,192,${f2(0.35 + o * 0.6)})" stroke-width="0.9" stroke-linecap="round"/>`;
  return g(X0 + 3.6, 'M0,-2 L0,2 M0,-0.6 L1.6,-2') + g(X0 + 18, 'M-1.4,0 a1.4,1.4 0 1 1 1.4,1.4') + g(X1 - 17, 'M-1.6,1.6 L0,-1.6 L1.6,1.6') + g(X1 - 3.6, 'M0,-2 L0,2 M-1.4,0 L1.4,0');
}
// Le couvercle fermé (face bombée, flanc, dessus), posé sur YT ; lift : soulevé de l'avant (entrouvert). La face du
// couvercle a le même arc que le bord avant du dessus bombé ; les ferrures suivent l'arc puis passent sur le dessus.
function lid(r, lift = 0) {
  const [face, side, top] = r.wood, [bl, bd] = r.band;
  const y0 = YT - lift, yT = y0 - 9, cx = (X0 + X1) / 2;
  const arcY = x => { const t = (x - X0) / (X1 - X0); return yT - 2 * t * (1 - t) * LH; };
  let o = '';
  // dessus bombé (entre l'arc avant et l'arc arrière, décalé de la profondeur)
  o += `<path d="M${X0},${yT} Q${cx},${yT - LH} ${X1},${yT} L${X1 + DX},${yT + DY} Q${cx + DX},${yT - LH + DY} ${X0 + DX},${yT + DY} Z" fill="${top}"${W}/>`;
  // flanc du couvercle
  o += `<path d="M${X1},${y0} L${X1},${yT} L${X1 + DX},${yT + DY} L${X1 + DX},${YT + DY - lift} Z" fill="${side}"${W}/>`;
  // face du couvercle : même arc que le bord avant du dessus
  o += `<path d="M${X0},${y0} L${X0},${yT} Q${cx},${yT - LH} ${X1},${yT} L${X1},${y0} Z" fill="${face}"${W}/>`;
  // ferrures : sur la face jusqu'à l'arc, puis sur le dessus jusqu'à l'arc arrière
  for (const x of [X0 + 7, X1 - 13]) {
    const a1 = arcY(x), a2 = arcY(x + 6);
    o += `<path d="M${x},${y0} L${x},${f2(a1)} L${x + 6},${f2(a2)} L${x + 6},${y0} Z" fill="${bl}"${w(0.9)}/>`;
    o += `<path d="M${x},${f2(a1)} L${x + DX},${f2(a1 + DY)} L${x + 6 + DX},${f2(a2 + DY)} L${x + 6},${f2(a2)} Z" fill="${bd}"${w(0.9)}/>`;
  }
  o += `<path d="M${X0 + 0.6},${y0 - 0.8} L${X1 - 0.6},${y0 - 0.8}" stroke="${bd}" stroke-width="1.4"/>`;
  // reflet sur le bombé
  o += `<path d="M${X0 + 16},${f2(arcY(X0 + 16) - 2.6)} Q${cx - 4},${f2(arcY(cx) - 3.4)} ${cx + 8},${f2(arcY(cx + 8) - 3)}" fill="none" stroke="rgba(255,255,255,.45)" stroke-width="1.2" stroke-linecap="round"/>`;
  // le moraillon de la serrure
  o += `<rect x="${cx - 4}" y="${y0 - 6}" width="8" height="7" rx="1.6" fill="${r.lock}"${w(0.9)}/>`;
  if (r.runes) o += `<path d="M${cx - 18},${f2(arcY(cx - 18) + 3.4)} Q${cx},${f2(arcY(cx) + 4.4)} ${cx + 18},${f2(arcY(cx + 18) + 3.4)}" fill="none" stroke="rgba(79,200,192,.75)" stroke-width="0.8" stroke-dasharray="1.6 1.4"/>`;
  return o;
}
// Couvercle grand ouvert, rabattu vers l'arrière : on voit son dedans (bois plus sombre) et l'arc de son dessus
function lidOpen(r) {
  const [face, side, top] = r.wood, [bl] = r.band;
  const hx0 = X0 + DX, hx1 = X1 + DX, hy = YT + DY; // charnière (arête arrière du dessus)
  const up = 30, back = 6;
  let o = '';
  // le dedans du couvercle (planches) et son épaisseur bombée en haut
  o += `<path d="M${hx0},${hy} L${hx0 - back},${hy - up} Q${(hx0 + hx1) / 2 - back},${hy - up - 9} ${hx1 - back},${hy - up} L${hx1},${hy} Z" fill="${r.inner}"${W}/>`;
  o += `<path d="M${hx0 - back},${hy - up} Q${(hx0 + hx1) / 2 - back},${hy - up - 9} ${hx1 - back},${hy - up} L${hx1 - back + 3},${hy - up - 3} Q${(hx0 + hx1) / 2 - back + 3},${hy - up - 12} ${hx0 - back + 3},${hy - up - 3} Z" fill="${top}"${W}/>`;
  for (const k of [0.33, 0.66]) o += `<path d="M${f2(hx0 + (hx1 - hx0) * k)},${hy - 1} L${f2(hx0 + (hx1 - hx0) * k - back)},${hy - up + 2}" stroke="rgba(0,0,0,.25)" stroke-width="0.8"/>`;
  for (const x of [hx0 + 7, hx1 - 13]) o += `<path d="M${x},${hy} L${x - back},${hy - up - 1.6} L${x - back + 6},${hy - up - 1.6} L${x + 6},${hy} Z" fill="${bl}" opacity=".9"${w(0.8)}/>`;
  // le flanc du couvercle ouvert
  o += `<path d="M${hx1},${hy} L${hx1 - back},${hy - up} L${hx1 - back + 3},${hy - up - 3} L${hx1 + 3},${hy - 2} Z" fill="${side}"${W}/>`;
  return o;
}
// La bouche du coffre ouvert : le velours, les pièces, la lueur
function mouth(r, glow = 1) {
  const g = id('m');
  let o = `<defs><radialGradient id="${g}" cx=".5" cy=".6" r=".6"><stop offset="0" stop-color="#FFFBEA" stop-opacity="${f2(0.95 * glow)}"/><stop offset=".55" stop-color="${r.glow}" stop-opacity="${f2(0.7 * glow)}"/><stop offset="1" stop-color="${r.velvet}" stop-opacity="1"/></radialGradient></defs>`;
  o += `<path d="M${X0},${YT} L${X1},${YT} L${X1 + DX},${YT + DY} L${X0 + DX},${YT + DY} Z" fill="${r.velvet}"${W}/>`;
  o += `<path d="M${X0 + 2},${YT - 0.4} L${X1 - 1},${YT - 0.4} L${X1 + DX - 2},${YT + DY + 0.6} L${X0 + DX + 1},${YT + DY + 0.6} Z" fill="url(#${g})"/>`;
  // pièces d'or qui dépassent
  for (const [x, y] of [[44, YT - 1.4], [50, YT - 2.6], [57, YT - 1.8], [64, YT - 3], [71, YT - 1.6], [78, YT - 2.4]]) o += `<ellipse cx="${x}" cy="${y}" rx="3" ry="1.6" fill="#F2C94C"${w(0.6)}/>`;
  return o;
}
// Rayons et halo derrière le coffre ouvert
function rays(r, k = 1, phase = 0) {
  const cx = (X0 + X1) / 2 + DX / 2, cy = YT + DY / 2;
  let o = `<defs><radialGradient id="${id('h')}"></radialGradient></defs>`;
  const g = id('halo');
  o = `<defs><radialGradient id="${g}"><stop offset="0" stop-color="${r.glow}" stop-opacity="${f2(0.55 * k)}"/><stop offset="1" stop-color="${r.glow}" stop-opacity="0"/></radialGradient></defs><ellipse cx="${cx}" cy="${cy - 8}" rx="${f2(50 * k)}" ry="${f2(38 * k)}" fill="url(#${g})"/>`;
  const n = 9;
  for (let i = 0; i < n; i++) {
    const a = -Math.PI * (0.15 + 0.7 * (i / (n - 1))) + phase;
    const L = (i % 2 ? 36 : 44) * k, s = 0.07;
    o += `<path d="M${cx},${cy} L${f2(cx + Math.cos(a - s) * L)},${f2(cy + Math.sin(a - s) * L)} L${f2(cx + Math.cos(a + s) * L)},${f2(cy + Math.sin(a + s) * L)} Z" fill="${r.glow}" opacity="${f2(0.5 * k)}"/>`;
  }
  return o;
}
// étincelles : petites étoiles à quatre branches
const spark = (x, y, s, col = '#FFFBEA') => `<path d="M${x},${y - s} L${f2(x + s * 0.28)},${f2(y - s * 0.28)} L${x + s},${y} L${f2(x + s * 0.28)},${f2(y + s * 0.28)} L${x},${y + s} L${f2(x - s * 0.28)},${f2(y + s * 0.28)} L${x - s},${y} L${f2(x - s * 0.28)},${f2(y - s * 0.28)} Z" fill="${col}" stroke="${OUT}" stroke-width="0.4"/>`;
const shadow = (k = 1) => `<ellipse cx="${(X0 + X1) / 2 + 6}" cy="${YB + 2}" rx="${f2(46 * k)}" ry="5" fill="rgba(40,30,20,.22)"/>`;

// Les images
export function closed(key, n = 0) {
  const r = RARITIES[key];
  let o = shadow() + body(r, { lit: n ? 0.9 : 0.4 }) + lid(r);
  // un reflet qui passe sur le couvercle (image 2) ; le légendaire luit doucement
  if (n) o += `<path d="M${X0 + 20},${YT - 10} L${X0 + 26},${YT - 21} L${X0 + 30},${YT - 21} L${X0 + 24},${YT - 10} Z" fill="#FFFFFF" opacity=".45"/>` + spark(X1 - 4, YT - 22, 3);
  return o;
}
export function opening(key, n) {
  const r = RARITIES[key];
  if (n === 0 || n === 1) {
    const dx = n ? 1.6 : -1.6, rot = n ? 2.5 : -2.5;
    return shadow() + `<g transform="translate(${dx} 0) rotate(${rot} ${(X0 + X1) / 2} ${YB})">${body(r) + lid(r)}</g>`
      + `<path d="M${n ? X1 + 18 : X0 - 8},${YT - 6} l${n ? 4 : -4},-2 M${n ? X1 + 18 : X0 - 8},${YT + 2} l${n ? 5 : -5},0" stroke="${OUT}" stroke-width="1" stroke-linecap="round"/>`;
  }
  if (n === 2) {
    // entrouvert : le couvercle se soulève, la lumière fuit par la fente
    return shadow() + body(r) + `<path d="M${X0 + 1},${YT - 0.5} L${X1 - 1},${YT - 0.5} L${X1 + DX - 1},${YT + DY - 0.5} L${X0 + DX},${YT + DY - 0.5} Z" fill="#FFFBEA"/>`
      + `<g transform="rotate(-6 ${X1 + DX} ${YT + DY})">${lid(r, 2)}</g>`;
  }
  return shadow() + lidOpen(r) + body(r, { lit: 1 }) + mouth(r, 1) + spark(40, 24, 3.4) + spark(86, 18, 2.8) + spark(66, 10, 2.4);
}
export function open(key, n) {
  const r = RARITIES[key];
  return shadow() + lidOpen(r) + body(r, { lit: n ? 0.7 : 1 }) + mouth(r, n ? 0.8 : 1)
    + (n ? spark(36, 30, 2.6) + spark(92, 22, 3.2) + spark(60, 14, 2) : spark(44, 20, 3) + spark(84, 28, 2.4) + spark(70, 8, 2.8));
}
// Calque de lumière à poser derrière le coffre ouvert (le jeu a déjà ses rayons en CSS : ce calque est facultatif) ;
// 2 images, les rayons tournent un peu
export function glow(key, n) { return rays(RARITIES[key], n ? 0.92 : 1, n ? 0.08 : 0); }
// Petite icône fermée (cadre 32 × 32) : le coffre fermé, réduit
export function icon(key) {
  return `<g transform="translate(-3.2 -9.6) scale(0.34)">${body(RARITIES[key]) + lid(RARITIES[key])}</g>`;
}
