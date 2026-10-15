// Les images nouvelles de l'ouverture (demande de l'auteur du 15 oct. : ecriture/lots/01_ouverture.md § 2,
// 02_tutoriel.md § 1), au niveau qu'il demande désormais : une finition de Final Fantasy Tactics et de Pokémon HGSS, en
// vectoriel. Lumière vraie, matières, palette riche. Chaque scène est en animation continue (SMIL, dans le SVG : à
// afficher en <img> ou en <object>) ; ses mouvements d'entrée se jouent une fois quand le SVG s'affiche, puis elle reste
// vivante en boucle. Le sujet tient au milieu du carré 400 × 400 (le jeu le recadre au centre : sur un téléphone en
// hauteur, on n'en voit que la bande x ≈ 108 à 292). L'heure (choix de l'auteur, 14 oct.) : le joueur se réveille au
// couchant ; la nuit tombe quand il lève les yeux (03_ciel) ; les scènes d'après sont de nuit, jusqu'au feu ; le matin
// d'Hermine est gris et doux. Le nom du joueur, les répliques et les légendes ne sont jamais dessinés.
const { effile } = require('./egares_voile');
const { brumeFrame } = require('./brume');
const { carte: carteEmbarquement } = require('./carte_embarquement');

const W = 400;
const f = n => Math.round(n * 100) / 100;
const hash = (a, b) => { const v = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return v - Math.floor(v); };

// ——— les définitions d'un dessin : dégradés, flous, découpes, nommés d'après son préfixe ———
function Defs(pref) {
  let n = 0;
  const defs = [];
  const id = () => `${pref}${n++}`;
  const stops = list => list.map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}"${a < 1 ? ` stop-opacity="${a}"` : ''}/>`).join('');
  return {
    lin(list, x1, y1, x2, y2) {
      const i = id();
      defs.push(`<linearGradient id="${i}" gradientUnits="userSpaceOnUse" x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}">${stops(list)}</linearGradient>`);
      return `url(#${i})`;
    },
    rad(list, cx, cy, r, fx = cx, fy = cy) {
      const i = id();
      defs.push(`<radialGradient id="${i}" gradientUnits="userSpaceOnUse" cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}" fx="${f(fx)}" fy="${f(fy)}">${stops(list)}</radialGradient>`);
      return `url(#${i})`;
    },
    flou(sd, inner = '') {
      const i = id();
      defs.push(`<filter id="${i}" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="${sd}">${inner}</feGaussianBlur></filter>`);
      return `url(#${i})`;
    },
    clip(d) {
      const i = id();
      defs.push(`<clipPath id="${i}"><path d="${d}"/></clipPath>`);
      return `url(#${i})`;
    },
    out(body) { return `<defs>${defs.join('')}</defs>${body}`; }
  };
}

// ——— les mouvements ———
const SPL = n => Array(n).fill('0.45 0 0.55 1').join(';');
const kt = n => Array.from({ length: n }, (_, i) => f(i / (n - 1))).join(';');
// aller-retour doux, sans fin
const vaVient = (type, a, b, dur, begin = 0) => `<animateTransform attributeName="transform" type="${type}" values="${a};${b};${a}" keyTimes="0;0.5;1" calcMode="spline" keySplines="${SPL(2)}" dur="${f(dur)}s" begin="${f(-begin)}s" repeatCount="indefinite" additive="sum"/>`;
// des valeurs qui se suivent en douceur et bouclent (la première revient à la fin)
const boucle = (attr, values, dur, begin = 0) => {
  const v = [...values, values[0]];
  return `<animate attributeName="${attr}" values="${v.join(';')}" keyTimes="${kt(v.length)}" calcMode="spline" keySplines="${SPL(v.length - 1)}" dur="${f(dur)}s" begin="${f(-begin)}s" repeatCount="indefinite"/>`;
};
// un défilement sans fin
const defile = (from, to, dur, begin = 0) => `<animateTransform attributeName="transform" type="translate" from="${from}" to="${to}" dur="${f(dur)}s" begin="${f(-begin)}s" repeatCount="indefinite" additive="sum"/>`;
// une fois, au chargement (l'état final reste) ; keyTimes de 0 à 1
const uneFois = (type, values, keyTimes, dur, begin = 0) => `<animateTransform attributeName="transform" type="${type}" values="${values}" keyTimes="${keyTimes}" calcMode="spline" keySplines="${SPL(keyTimes.split(';').length - 1)}" dur="${f(dur)}s" begin="${f(begin)}s" fill="freeze" additive="sum"/>`;
const fonduUneFois = (attr, values, keyTimes, dur, begin = 0) => `<animate attributeName="${attr}" values="${values}" keyTimes="${keyTimes}" calcMode="spline" keySplines="${SPL(keyTimes.split(';').length - 1)}" dur="${f(dur)}s" begin="${f(begin)}s" fill="freeze"/>`;

const path = (d, fill, extra = '') => `<path d="${d}" fill="${fill}"${extra ? ' ' + extra : ''}/>`;
const trait = (d, c, w, extra = '') => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${f(w)}" stroke-linecap="round" stroke-linejoin="round"${extra ? ' ' + extra : ''}/>`;

// ════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 01_racines — sous la surface, dans le faisceau d'un projecteur qui tangue : des racines sombres et lentes, grandes
// comme le navire. Elles bougent comme une ombre bouge, sans bruit. Puis l'une se ramasse et frappe la coque (choix de
// l'auteur, 15 oct., à la place de « elles ne frappent pas ») : la coque tremble, le faisceau vacille, un éclair, des
// bulles ; trois secondes, puis le noir.
// ════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// Une racine : une ligne de Bézier (base hors du cadre → pointe), épaisse à la base, fine au bout, avec des nœuds ;
// son contour lissé, le côté pris par la lumière (en haut), trois stries d'écorce. Le tracé garde la même forme d'une
// pose à l'autre : le morphing reste fluide
const bez = (p0, p1, p2, p3, t) => { const u = 1 - t; return [0, 1].map(j => u * u * u * p0[j] + 3 * u * u * t * p1[j] + 3 * u * t * t * p2[j] + t * t * t * p3[j]); };
const g1 = n => Math.round(n * 10) / 10;
const lisse = pts => `M${pts[0].map(g1).join(',')}` + pts.slice(1).map((p, i) => { const q = pts[i + 2]; return q ? ` Q${p.map(g1).join(',')} ${g1((p[0] + q[0]) / 2)},${g1((p[1] + q[1]) / 2)}` : ` L${p.map(g1).join(',')}`; }).join('');
function racineForme(p0, c1, c2, p3, w0, noeuds = [0.3, 0.58]) {
  const N = 16, cote = [], autre = [], lum = [], ecorce = [[], []];
  for (let i = 0; i <= N; i++) {
    const t = i / N, p = bez(p0, c1, c2, p3, t), q = bez(p0, c1, c2, p3, Math.min(1, t + 0.01)), o = bez(p0, c1, c2, p3, Math.max(0, t - 0.01));
    const dx = q[0] - o[0], dy = q[1] - o[1], l = Math.hypot(dx, dy) || 1;
    let nx = -dy / l, ny = dx / l;
    if (ny > 0) { nx = -nx; ny = -ny; } // (n : vers le haut, vers la lumière)
    let w = Math.max(1.2, (w0 / 2) * (1 - t) ** 0.8);
    for (const k of noeuds) w += (w0 / 2) * 0.16 * Math.exp(-(((t - k) / 0.035) ** 2));
    cote.push([p[0] + nx * w, p[1] + ny * w]);
    autre.push([p[0] - nx * w, p[1] - ny * w]);
    lum.push([p[0] + nx * w * 0.3, p[1] + ny * w * 0.3]);
    [-0.4, 0.3].forEach((k, j) => ecorce[j].push([p[0] + nx * w * k, p[1] + ny * w * k]));
  }
  return {
    corps: lisse([...cote, ...autre.reverse()]) + ' Z',
    lumiere: lisse([...cote, ...lum.reverse()]) + ' Z',
    ecorce: ecorce.map(l => lisse(l.slice(2, N - 2)))
  };
}
// une racine qui ondule : ses trois poses
function racine(r, k) {
  const ph = (k / 3) * Math.PI * 2;
  const o = (a, amp) => amp * Math.sin(ph + a);
  const c1 = [r.c1[0] + o(r.s, 10), r.c1[1] + o(r.s + 1, 8)];
  const c2 = [r.c2[0] + o(r.s + 2, 16), r.c2[1] + o(r.s + 3, 12)];
  const b = [r.pointe[0] + o(r.s + 4, 22), r.pointe[1] + o(r.s + 5, 16)];
  return { ...racineForme(r.base, c1, c2, b, r.w, r.noeuds), c1, c2, b };
}
function racines01() {
  const D = Defs('rac');
  // l'eau : plus claire sous la surface, noire au fond
  let s = `<rect width="${W}" height="${W}" fill="${D.lin([[0, '#1B4A5C'], [0.22, '#0E2B3A'], [0.6, '#061722'], [1, '#010508']], 0, 0, 0, W)}"/>`;
  // la surface vue d'en dessous : un plafond de lumière qui ondule
  const surf = k => `M0,0 L400,0 L400,${f(22 + 4 * Math.sin(k))} ` + Array.from({ length: 9 }, (_, i) => { const x = 400 - (i + 1) * 50; return `Q${f(x + 25)},${f(30 + 6 * Math.sin(k + i * 1.3))} ${x},${f(22 + 5 * Math.sin(k + i * 0.9 + 1))}`; }).join(' ') + ' Z';
  s += `<path d="${surf(0)}" fill="${D.lin([[0, '#7FC4C8', 0.55], [1, '#3E8A98', 0.18]], 0, 0, 0, 36)}">${boucle('d', [surf(0), surf(2.1), surf(4.2)], 3.6)}</path>`;
  // les reflets qui dansent sous la surface
  for (let i = 0; i < 7; i++) {
    const x = 20 + i * 56;
    s += `<path d="M${x},${f(30 + 4 * hash(i, 1))} q14,-5 28,0 q12,4 24,-1" fill="none" stroke="#BFF0EE" stroke-width="1.2" stroke-linecap="round" opacity="0.35">${boucle('opacity', [0.1, 0.45, 0.2], 1.4 + hash(i, 3), hash(i, 5) * 2)}</path>`;
  }
  // les racines du fond : pâles, floues, immenses
  const loin = [
    { base: [-60, 430], c1: [40, 300], c2: [110, 220], pointe: [178, 120], w: 120, s: 0.3 },
    { base: [470, 460], c1: [380, 330], c2: [330, 240], pointe: [276, 140], w: 110, s: 1.7 }
  ];
  const flouLoin = D.flou(3.2);
  for (const r of loin) {
    const k = [0, 1, 2].map(i => racine(r, i).corps);
    s += `<path d="${k[0]}" fill="#0C2230" opacity="0.85" filter="${flouLoin}">${boucle('d', k, 7.5, r.s)}</path>`;
  }
  // la coque de l'Hirondelle, petite, tout là-haut : elle tangue ; son projecteur balaie l'eau
  const CHOC = 2.45; // l'instant où la racine touche la coque (s)
  const tremble = `<animateTransform attributeName="transform" type="translate" values="0 0;0 0;5 -4;-6 3;4 -2;-2 1;0 0" keyTimes="0;${f(CHOC / 3)};${f((CHOC + 0.05) / 3)};${f((CHOC + 0.12) / 3)};${f((CHOC + 0.2) / 3)};${f((CHOC + 0.3) / 3)};1" dur="3s" fill="freeze" additive="sum"/>`;
  const vacille = `<animate attributeName="opacity" values="1;1;0.15;0.9;0.1;0.7;0.2" keyTimes="0;${f(CHOC / 3)};${f((CHOC + 0.04) / 3)};${f((CHOC + 0.1) / 3)};${f((CHOC + 0.16) / 3)};${f((CHOC + 0.26) / 3)};1" dur="3s" fill="freeze"/>`;
  const coque = `<g>${tremble}<g>${vaVient('rotate', '-3 150 40', '3.4 150 40', 3.2)}` +
    path('M62,10 Q66,40 104,52 L196,56 Q232,52 246,26 L250,8 Z', D.lin([[0, '#163240'], [1, '#04101A']], 0, 8, 0, 56)) +
    path('M70,26 Q80,44 108,50 L192,53 Q222,50 238,30', 'none', 'stroke="#2E5C68" stroke-width="1.2" opacity="0.6"') +
    // l'hélice et le gouvernail
    path('M232,30 L248,46 L240,52 L226,38 Z', '#061520') +
    `<circle cx="126" cy="52" r="3.4" fill="#F4FFF4"/><circle cx="126" cy="52" r="9" fill="#DFFFF4" opacity="0.35"/>` +
    // le faisceau : un cône de lumière qui tangue avec la coque, très doux sur ses bords
    `<g>${vacille}${vaVient('rotate', '-14 126 52', '10 126 52', 3.4, 0.6)}` +
    `<path d="M126,52 L18,430 L238,430 Z" fill="${D.lin([[0, '#DFFFF2', 0.5], [0.55, '#9FE0D2', 0.24], [1, '#6FBFB0', 0.04]], 126, 52, 128, 430)}" filter="${D.flou(9)}"/>` +
    `<path d="M126,52 L86,430 L170,430 Z" fill="${D.lin([[0, '#F4FFF8', 0.55], [0.5, '#BFF2E4', 0.14], [1, '#BFF2E4', 0]], 126, 52, 128, 430)}" filter="${D.flou(4)}"/>` +
    '</g></g></g>';
  // les racines proches, devant : sombres, en volume, leur dos pris dans la lumière du faisceau, l'écorce striée, des
  // radicelles qui ondulent ; l'une traverse le faisceau en ombre chinoise
  const pres = [
    { base: [-90, 360], c1: [30, 320], c2: [150, 300], pointe: [250, 196], w: 104, s: 0.9, noeuds: [0.26, 0.52] },
    { base: [500, 330], c1: [400, 290], c2: [320, 330], pointe: [246, 292], w: 92, s: 2.4, noeuds: [0.3, 0.6] },
    { base: [120, 490], c1: [150, 420], c2: [230, 400], pointe: [186, 318], w: 120, s: 4.1, noeuds: [0.34] }
  ];
  let devant = '';
  pres.forEach((r, i) => {
    const k = [0, 1, 2].map(j => racine(r, j));
    const dur = 7 + i * 0.8;
    const corps = D.lin([[0, '#010407'], [0.55, '#06131B'], [1, '#0E2430']], r.base[0], r.base[1], r.pointe[0], r.pointe[1]);
    devant += `<path d="${k[0].corps}" fill="${corps}">${boucle('d', k.map(x => x.corps), dur, r.s)}</path>`;
    devant += `<path d="${k[0].lumiere}" fill="#2E6268" opacity="0.4">${boucle('d', k.map(x => x.lumiere), dur, r.s)}${boucle('opacity', [0.18, 0.5, 0.26], 3.4, 0.6 + i * 0.4)}</path>`;
    for (let j = 0; j < 2; j++) devant += `<path d="${k[0].ecorce[j]}" fill="none" stroke="${j === 0 ? '#0B1E28' : '#1E4048'}" stroke-width="1.2" stroke-linecap="round" opacity="0.7">${boucle('d', k.map(x => x.ecorce[j]), dur, r.s)}</path>`;
    // les radicelles : elles partent de la racine et ondulent à leur rythme
    for (let j = 0; j < 2; j++) {
      const rad = [0, 1, 2].map(m => {
        const q = k[m], t = 0.42 + j * 0.18;
        const [px, py] = bez(r.base, q.c1, q.c2, q.b, t);
        const a = (j % 2 ? -1 : 1) * (1 + 0.35 * Math.sin(m * 2.1 + i + j)) + (j === 2 ? 0.6 : 0);
        return racineForme([px, py], [px + 26 * Math.cos(a), py - 26 * Math.sin(a) - 8], [px + 42 * Math.cos(a), py - 46], [px + 50 * Math.cos(a + 0.5 * Math.sin(m + j)), py - 60 + 10 * Math.sin(m + j)], 12 - j * 2, []).corps;
      });
      devant += `<path d="${rad[0]}" fill="#061620">${boucle('d', rad, 6.2 + j * 0.7, r.s + j)}</path>`;
    }
  });
  // la racine qui frappe : elle ondule au fond, se ramasse en arrière, puis fouette jusqu'à la quille
  const frappe = [
    racineForme([-40, 430], [30, 360], [80, 330], [128, 318], 86, [0.32]),
    racineForme([-40, 430], [24, 368], [70, 338], [112, 330], 86, [0.32]),
    racineForme([-40, 430], [10, 380], [30, 360], [58, 352], 86, [0.32]),
    racineForme([-40, 430], [20, 300], [196, 230], [166, 60], 86, [0.32])
  ];
  const kt4 = `0;${f(1.4 / 3)};${f(2.1 / 3)};${f(CHOC / 3)};1`;
  const anim = k => `<animate attributeName="d" values="${frappe.map(x => x[k]).concat([frappe[3][k]]).join(';')}" keyTimes="${kt4}" calcMode="spline" keySplines="0.45 0 0.55 1;0.4 0 0.6 1;0.8 0 1 1;0 0 1 1" dur="3s" fill="freeze"/>`;
  devant += `<path d="${frappe[0].corps}" fill="${D.lin([[0, '#010407'], [0.6, '#071620'], [1, '#12303A']], -40, 430, 166, 60)}">${anim('corps')}</path>`;
  devant += `<path d="${frappe[0].lumiere}" fill="#3E7A78" opacity="0.45">${anim('lumiere')}</path>`;
  // au choc : l'éclair dans l'eau, l'onde, les bulles qui jaillissent de la quille
  const t0 = f(CHOC);
  devant += `<circle cx="166" cy="58" r="10" fill="none" stroke="#DFFFF4" stroke-width="3" opacity="0"><animate attributeName="r" values="10;90" begin="${t0}s" dur="0.5s" fill="freeze"/><animate attributeName="opacity" values="0.9;0" begin="${t0}s" dur="0.5s" fill="freeze"/></circle>`;
  for (let i = 0; i < 16; i++) {
    const a = -Math.PI / 2 + (hash(i, 71) - 0.5) * 2.6, v = 30 + hash(i, 73) * 70;
    devant += `<circle cx="166" cy="60" r="${f(1.2 + hash(i, 75) * 2.4)}" fill="none" stroke="#E8FFF8" stroke-width="0.9" opacity="0"><animateTransform attributeName="transform" type="translate" values="0 0;${f(Math.cos(a) * v)} ${f(Math.sin(a) * v * 0.6 + 30)}" begin="${t0}s" dur="0.55s" fill="freeze"/><animate attributeName="opacity" values="0.9;0" begin="${t0}s" dur="0.55s" fill="freeze"/></circle>`;
  }
  // la neige marine qui dérive dans le faisceau, et les bulles qui remontent vers la coque
  let neige = '';
  for (let i = 0; i < 46; i++) {
    const x = f(20 + hash(i, 11) * 340), y = f(60 + hash(i, 13) * 330), r = f(0.6 + hash(i, 15) * 1.4);
    neige += `<circle cx="${x}" cy="${y}" r="${r}" fill="#CFF6EE" opacity="${f(0.25 + hash(i, 17) * 0.5)}">${defile('0 0', `${f(-6 + hash(i, 19) * 12)} -26`, 6 + hash(i, 21) * 5, hash(i, 23) * 6)}</circle>`;
  }
  let bulles = '';
  for (let i = 0; i < 12; i++) {
    const x = f(100 + hash(i, 31) * 60), r = f(1.4 + hash(i, 33) * 2.6), d = f(1.8 + hash(i, 35) * 1.4);
    bulles += `<circle cx="${x}" cy="150" r="${r}" fill="none" stroke="#DFFFF8" stroke-width="0.8" opacity="0.7">${defile('0 0', `${f(-8 + hash(i, 37) * 16)} -110`, d, hash(i, 39) * d)}${boucle('opacity', [0, 0.8, 0.5], d, hash(i, 39) * d)}</circle>`;
  }
  // la lueur que le faisceau allume dans l'eau, derrière la grande racine (elle s'y découpe en ombre chinoise)
  const halo = `<ellipse cx="138" cy="262" rx="110" ry="70" fill="${D.rad([[0, '#8FD8C8', 0.32], [1, '#8FD8C8', 0]], 138, 262, 110)}">${boucle('opacity', [0.6, 1, 0.75], 3.4, 0.6)}</ellipse>`;
  s += coque + halo + neige + devant + bulles;
  // le voile d'eau, plus épais vers le bas, et le noir qui tombe à trois secondes
  s += `<rect width="${W}" height="${W}" fill="${D.rad([[0, '#000000', 0], [0.7, '#000000', 0.35], [1, '#000000', 0.8]], 160, 160, 330)}"/>`;
  s += `<rect width="${W}" height="${W}" fill="#DFFFF4" opacity="0"><animate attributeName="opacity" values="0;0.45;0" keyTimes="0;0.25;1" begin="${t0}s" dur="0.35s" fill="freeze"/></rect>`;
  s += `<rect width="${W}" height="${W}" fill="#000" opacity="0">${fonduUneFois('opacity', '0;0;1', `0;${f((CHOC + 0.15) / 3)};1`, 3)}</rect>`;
  return D.out(s);
}


// ════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// La plage au couchant (01_paupieres, 01_carte, 02_plage) : un ciel violet qui s'embrase à l'horizon, le soleil à
// moitié couché et son chemin d'or sur la mer, les vagues qui montent sur le sable mouillé (il reflète le ciel) et
// redescendent, le sable sec, des étoiles de mer, des coquillages, des algues ; au loin, des débris. o : { soleil (x),
// horizon (y), rivage (y : là où meurent les vagues), debris }
// ════════════════════════════════════════════════════════════════════════════════════════════════════════════════
const COUCHANT = { haut: '#241E4A', mi: '#5E3A6E', bas: '#D8664A', horizon: '#FFD98E', soleil: '#FFF4CC', merLoin: '#5B4878', merPres: '#2B3558', sableMouille: '#9C6A62', sable: '#D6A77E', sableOmbre: '#8E6450' };
function etoileDeMer(x, y, r, a, c = '#E8744A') {
  let d = '';
  for (let i = 0; i < 5; i++) {
    const t = a + (i / 5) * Math.PI * 2, t2 = t + Math.PI / 5;
    d += `${i ? 'L' : 'M'}${f(x + Math.cos(t) * r)},${f(y + Math.sin(t) * r * 0.62)} Q${f(x + Math.cos(t2) * r * 0.32)},${f(y + Math.sin(t2) * r * 0.2)} `;
  }
  return path(d + 'Z', c, 'stroke="#7A2E1E" stroke-width="0.9" stroke-linejoin="round"') + `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r * 0.16)}" fill="#FFB68A"/>`;
}
const coquillage = (x, y, r, c = '#F2DCC8') => path(`M${f(x - r)},${f(y)} Q${f(x)},${f(y - r * 1.4)} ${f(x + r)},${f(y)} Q${f(x)},${f(y + r * 0.4)} ${f(x - r)},${f(y)} Z`, c, 'stroke="#8E6A5A" stroke-width="0.6"') + trait(`M${f(x)},${f(y + r * 0.2)} L${f(x)},${f(y - r)} M${f(x - r * 0.5)},${f(y + r * 0.1)} L${f(x - r * 0.2)},${f(y - r * 0.9)} M${f(x + r * 0.5)},${f(y + r * 0.1)} L${f(x + r * 0.2)},${f(y - r * 0.9)}`, '#B89A86', 0.5);
const algue = (x, y, s, c = '#3E4A2A') => trait(`M${f(x)},${f(y)} q${f(6 * s)},${f(-4 * s)} ${f(14 * s)},${f(-1 * s)} t${f(12 * s)},${f(-2 * s)} t${f(10 * s)},${f(2 * s)}`, c, 2.2 * s) + trait(`M${f(x + 4 * s)},${f(y + 2 * s)} q${f(8 * s)},${f(2 * s)} ${f(16 * s)},${f(-3 * s)}`, '#5E6A3A', 1.4 * s);
const galet = (D, x, y, rx, ry, c = '#6E5E62') => `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(rx)}" ry="${f(ry)}" fill="${D.lin([[0, '#B89A9A'], [0.4, c], [1, '#3A2E36']], x - rx, y - ry, x + rx * 0.4, y + ry)}"/><ellipse cx="${f(x - rx * 0.3)}" cy="${f(y - ry * 0.4)}" rx="${f(rx * 0.35)}" ry="${f(ry * 0.22)}" fill="#FFE2C4" opacity="0.45"/>`;
// une valise éventrée, une planche, un morceau de coque blanche à liseré rouge (l'Hirondelle)
const valise = (x, y, s) => `<g transform="translate(${f(x)} ${f(y)}) scale(${f(s)})">${path('M-14,0 L14,0 L13,-12 L-13,-12 Z', '#7A4A30', 'stroke="#3A2016" stroke-width="1"')}${path('M-13,-12 L-6,-22 L18,-20 L13,-12 Z', '#8E5A3A', 'stroke="#3A2016" stroke-width="1"')}${trait('M-6,-6 l4,-1 l3,2 l5,-1', '#E8D8C8', 1.4)}${path('M-2,-12 L2,-12 L2,-14 L-2,-14 Z', '#C8A050')}</g>`;
const planche = (x, y, w, a) => `<g transform="rotate(${a} ${f(x)} ${f(y)})"><rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(w * 0.13)}" rx="1.5" fill="#8A6648" stroke="#3E2A1C" stroke-width="0.8"/>${trait(`M${f(x + 3)},${f(y + w * 0.06)} l${f(w - 6)},0`, '#A8846A', 0.6)}</g>`;
const coque = (x, y, s, a = 0) => `<g transform="translate(${f(x)} ${f(y)}) rotate(${a}) scale(${f(s)})">${path('M-22,0 L22,-4 L18,-14 L-20,-10 Z', '#E8E4DC', 'stroke="#4A3A34" stroke-width="1"')}${path('M-21,-3 L21,-7 L20.4,-9.6 L-21.4,-5.6 Z', '#C8463A')}<circle cx="2" cy="-10" r="2" fill="#4A5A6E" stroke="#4A3A34" stroke-width="0.6"/></g>`;

function plageCouchant(D, o) {
  const C = COUCHANT, sx = o.soleil, h = o.horizon, ri = o.rivage;
  // le ciel et ses nuages, lisérés d'or par en dessous
  let s = `<rect width="${W}" height="${f(h + 2)}" fill="${D.lin([[0, C.haut], [0.45, C.mi], [0.82, C.bas], [1, C.horizon]], 0, 0, 0, h)}"/>`;
  s += `<circle cx="${sx}" cy="${h}" r="150" fill="${D.rad([[0, '#FFE6A8', 0.75], [0.25, '#FFB070', 0.35], [1, '#FF8060', 0]], sx, h, 150)}"/>`;
  const nuage = (x, y, w, k) => `<g>${defile('0 0', `${f(30 * k)} 0`, 40, hash(x, y) * 40)}${vaVient('translate', '0 0', `${f(-15 * k)} 0`, 20)}<path d="M${f(x)},${f(y)} q${f(w * 0.2)},${f(-9)} ${f(w * 0.45)},-2 q${f(w * 0.25)},-7 ${f(w * 0.55)},3 q-${f(w * 0.4)},6 -${f(w)},-1 Z" fill="#7A4A78" opacity="0.85"/><path d="M${f(x + w * 0.1)},${f(y + 0.5)} q${f(w * 0.4)},4 ${f(w * 0.85)},1.4" fill="none" stroke="#FFB27A" stroke-width="1.6" stroke-linecap="round" opacity="0.85"/></g>`;
  s += nuage(20, h - 120, 120, 1) + nuage(230, h - 140, 150, -1) + nuage(150, h - 70, 90, 0.6) + nuage(300, h - 52, 80, -0.7);
  // des oiseaux, très loin
  s += `<g>${defile('0 0', '60 -8', 26)}${trait(`M60,${f(h - 96)} q4,-4 8,0 q4,-4 8,0 M84,${f(h - 104)} q3,-3 6,0 q3,-3 6,0`, '#3A2440', 1.1)}</g>`;
  // le soleil, à moitié couché, qui palpite à peine
  s += `<g>${D.clip ? '' : ''}<circle cx="${sx}" cy="${f(h + 4)}" r="22" fill="${D.rad([[0, '#FFFFF0'], [0.6, C.soleil], [1, '#FFC27A']], sx, h, 22)}" clip-path="${D.clip(`M0,0 L400,0 L400,${h} L0,${h} Z`)}">${boucle('r', [22, 22.8, 22.2], 4)}</circle></g>`;
  // la mer : sombre et violette au loin, le chemin d'or sous le soleil qui scintille
  s += `<rect y="${h}" width="${W}" height="${f(ri - h + 10)}" fill="${D.lin([[0, C.merLoin], [0.5, '#45406E'], [1, C.merPres]], 0, h, 0, ri)}"/>`;
  for (let i = 0; i < 26; i++) {
    const t = i / 26, y = h + 3 + (ri - h - 10) * t ** 1.4, w = 8 + 34 * t + 10 * hash(i, 3), x = sx + (hash(i, 5) - 0.5) * (18 + 70 * t);
    s += `<rect x="${f(x - w / 2)}" y="${f(y)}" width="${f(w)}" height="${f(1 + 1.6 * t)}" rx="1" fill="#FFE2A0" opacity="0.6">${boucle('opacity', [0.15, 0.85, 0.35], 1 + hash(i, 7) * 1.6, hash(i, 9) * 2)}</rect>`;
  }
  // les rides de la mer, qui roulent vers la plage
  for (let i = 0; i < 6; i++) {
    const y = h + 6 + i * ((ri - h) / 7);
    s += `<g>${defile('0 0', '0 6', 3.2, i * 0.5)}<path d="M-10,${f(y)} q40,-3 80,0 t80,0 t80,0 t80,0 t80,0" fill="none" stroke="#8E7AAE" stroke-width="${f(0.8 + i * 0.2)}" opacity="0.5">${boucle('opacity', [0.1, 0.55, 0.1], 3.2, i * 0.5)}</path></g>`;
  }
  // le sable mouillé, qui reflète le ciel, puis le sable sec
  s += `<path d="M0,${f(ri)} Q100,${f(ri - 6)} 200,${f(ri + 2)} T400,${f(ri - 4)} L400,400 L0,400 Z" fill="${D.lin([[0, C.sableMouille], [0.35, '#B8806A'], [0.7, C.sable], [1, C.sableOmbre]], 0, ri, 0, 400)}"/>`;
  s += `<ellipse cx="${sx}" cy="${f(ri + 10)}" rx="24" ry="16" fill="${D.rad([[0, '#FFE2A0', 0.45], [1, '#FFE2A0', 0]], sx, ri + 10, 24)}"/>`;
  // la vague qui monte sur le sable, son écume, et la nappe d'eau qui se retire
  const vague = k => `M-10,${f(ri - 2 + k)} Q60,${f(ri + 10 + k)} 130,${f(ri + 4 + k)} T260,${f(ri + 9 + k)} T410,${f(ri + 2 + k)} L410,${f(ri - 6)} L-10,${f(ri - 6)} Z`;
  s += `<path d="${vague(0)}" fill="#8E86B8" opacity="0.55">${boucle('d', [vague(-4), vague(14), vague(6)], 5.2)}</path>`;
  const ecume = k => `M-10,${f(ri - 2 + k)} Q60,${f(ri + 10 + k)} 130,${f(ri + 4 + k)} T260,${f(ri + 9 + k)} T410,${f(ri + 2 + k)}`;
  s += `<path d="${ecume(0)}" fill="none" stroke="#FFF0DC" stroke-width="2.2" stroke-linecap="round" stroke-dasharray="14 5 3 6" opacity="0.85">${boucle('d', [ecume(-4), ecume(14), ecume(6)], 5.2)}${boucle('opacity', [0.5, 0.95, 0.7], 5.2)}</path>`;
  // le grain du sable, des galets, des coquillages, des étoiles de mer, des algues
  for (let i = 0; i < 70; i++) {
    const x = hash(i, 41) * 400, y = ri + 14 + hash(i, 43) * (400 - ri - 14);
    s += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(0.5 + hash(i, 45) * 1.1)}" fill="${hash(i, 47) < 0.5 ? '#F2CFA6' : '#7A5242'}" opacity="0.6"/>`;
  }
  s += (o.objets || '');
  return s;
}
// les objets du premier plan de la plage au couchant
const objetsPlage = D => galet(D, 70, 342, 10, 6) + galet(D, 330, 360, 13, 7) + galet(D, 300, 322, 6, 3.6) + coquillage(150, 340, 5) + coquillage(262, 372, 4, '#F6C8B8') + etoileDeMer(232, 336, 11, 0.3) + etoileDeMer(96, 380, 8, 1.1, '#D85A6A') + algue(24, 318, 1.1) + algue(308, 300, 0.8);

// ════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 01_paupieres — vue subjective : des paupières qui battent (le noir qui s'ouvre et se referme deux fois), du flou,
// puis la plage au couchant. On est couché sur le sable : l'horizon penche à peine
// ════════════════════════════════════════════════════════════════════════════════════════════════════════════════
function paupieres01() {
  const D = Defs('pau');
  // la plage, nette ; par-dessus, la même plage floue qui s'efface quand le regard se fait (le flou va, revient, part)
  const plage = `<g transform="translate(200 210) rotate(-5) scale(1.12) translate(-200 -210)">${plageCouchant(D, { soleil: 236, horizon: 186, rivage: 252, objets: objetsPlage(D) + valise(330, 268, 0.7) + planche(40, 262, 40, -8) })}</g>`;
  let s = plage + `<g filter="${D.flou(7)}">${fonduUneFois('opacity', '1;1;0.75;0.9;0.45;0.6;0', '0;0.15;0.32;0.45;0.62;0.75;1', 5.2)}${plage}</g>`;
  // tout près de l'œil, de gros grains de sable flous
  for (let i = 0; i < 9; i++) s += `<ellipse cx="${f(20 + hash(i, 61) * 360)}" cy="${f(372 + hash(i, 63) * 30)}" rx="${f(6 + hash(i, 65) * 8)}" ry="${f(4 + hash(i, 67) * 5)}" fill="#C89A72" opacity="0.6" filter="${D.flou(2.5)}"/>`;
  // la lumière chaude qui entre par les cils
  s += `<rect width="${W}" height="${W}" fill="${D.rad([[0, '#FFD8A0', 0], [0.7, '#5A2E3A', 0.2], [1, '#1A0E18', 0.75]], 200, 200, 290)}"/>`;
  // les paupières : elles s'ouvrent un peu, se referment, s'ouvrent plus, se referment, puis s'ouvrent pour de bon
  const lids = flouL => {
    const haut = `<g filter="${flouL}">${uneFois('translate', '0 0;0 0;0 -86;0 0;0 -176;0 -6;0 -6;0 -330', '0;0.17;0.31;0.42;0.58;0.69;0.78;1', 3.6)}<path d="M-40,-420 L440,-420 L440,186 Q200,246 -40,186 Z" fill="#0A0508"/><path d="M-40,182 Q200,242 440,182" fill="none" stroke="#3A1A1E" stroke-width="8" opacity="0.8"/></g>`;
    const bas = `<g filter="${flouL}">${uneFois('translate', '0 0;0 0;0 70;0 0;0 150;0 4;0 4;0 300', '0;0.17;0.31;0.42;0.58;0.69;0.78;1', 3.6)}<path d="M-40,224 Q200,176 440,224 L440,820 L-40,820 Z" fill="#0A0508"/></g>`;
    return haut + bas;
  };
  s += lids(D.flou(5));
  return D.out(s);
}

// ════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 01_carte — vue subjective : quelque chose de blanc sur le sable, au loin ; puis, de près, la carte d'embarquement
// trempée. Elle remplace 01_gilet dans l'ouverture
// ════════════════════════════════════════════════════════════════════════════════════════════════════════════════
function carte01() {
  const D = Defs('car');
  const cx = 214, cy = 300;
  // au loin : la plage au couchant, une tache blanche sur le sable qui accroche la lumière
  const blanc = `<g transform="rotate(-12 ${cx} ${cy})"><rect x="${cx - 6}" y="${cy - 3.6}" width="12" height="7.2" rx="0.8" fill="#F6EEDC" stroke="#8A7A64" stroke-width="0.6"/><rect x="${cx - 6}" y="${cy - 3.6}" width="12" height="2.2" fill="#2E4E8C"/></g>` +
    `<circle cx="${cx + 4}" cy="${cy - 2}" r="2" fill="#FFFFFF">${boucle('opacity', [0.2, 1, 0.4], 1.6)}${boucle('r', [1.4, 3.2, 1.8], 1.6)}</circle>`;
  const loin = plageCouchant(D, { soleil: 150, horizon: 182, rivage: 250, objets: objetsPlage(D) + coque(70, 276, 0.8, 6) + planche(300, 270, 46, 10) + valise(352, 262, 0.6) + blanc });
  // le regard s'approche de la tache blanche (3,2 s), puis le gros plan prend la place
  let s = `<g transform="translate(${cx} ${cy})"><g>${uneFois('scale', '1;1;7', '0;0.6;1', 5.2)}<g transform="translate(${-cx} ${-cy})">${loin}</g></g>${fonduUneFois('opacity', '1;1;0', '0;0.78;1', 5.2)}</g>`;
  // de près : le sable mouillé, doré par le couchant, ses rides ; la carte trempée, à moitié dans une flaque
  let pres = `<rect width="${W}" height="${W}" fill="${D.lin([[0, '#C8906C'], [0.5, '#B07A60'], [1, '#7A4E44']], 0, 0, 120, 400)}"/>`;
  for (let i = 0; i < 9; i++) pres += trait(`M-10,${30 + i * 44} q60,-10 120,0 t120,0 t120,0 t120,0`, '#8E5E4E', 3, 'opacity="0.35"') + trait(`M-10,${27 + i * 44} q60,-10 120,0 t120,0 t120,0 t120,0`, '#E8B890', 1.2, 'opacity="0.4"');
  for (let i = 0; i < 90; i++) pres += `<circle cx="${f(hash(i, 81) * 400)}" cy="${f(hash(i, 83) * 400)}" r="${f(0.6 + hash(i, 85) * 1.4)}" fill="${hash(i, 87) < 0.5 ? '#F2CFA6' : '#6A443A'}" opacity="0.55"/>`;
  // la lumière du couchant, rasante, depuis la gauche
  pres += `<rect width="${W}" height="${W}" fill="${D.rad([[0, '#FFD08A', 0.45], [1, '#FFD08A', 0]], 40, 60, 360)}"/>`;
  // l'ombre de la carte, la carte (le dessin de la bibliothèque, état trempé)
  pres += `<g transform="translate(200 206) rotate(-14) scale(0.62) translate(-160 -105)"><rect x="6" y="10" width="320" height="210" rx="10" fill="#3A2016" opacity="0.35" filter="${D.flou(6)}"/>${carteEmbarquement('trempee')}</g>`;
  // la flaque qui recouvre le coin de la carte : elle monte, redescend ; son bord d'écume, ses reflets
  const flaque = k => `M-10,${f(300 + k)} Q90,${f(270 + k)} 180,${f(292 + k)} T410,${f(262 + k)} L410,410 L-10,410 Z`;
  pres += `<path d="${flaque(0)}" fill="${D.lin([[0, '#9EB8D0', 0.5], [1, '#5A6E8E', 0.75]], 0, 260, 0, 400)}">${boucle('d', [flaque(10), flaque(-14), flaque(2)], 6)}</path>`;
  const bord = k => `M-10,${f(300 + k)} Q90,${f(270 + k)} 180,${f(292 + k)} T410,${f(262 + k)}`;
  pres += `<path d="${bord(0)}" fill="none" stroke="#FFF4E6" stroke-width="2.6" stroke-linecap="round" stroke-dasharray="18 6 4 8" opacity="0.9">${boucle('d', [bord(10), bord(-14), bord(2)], 6)}</path>`;
  for (let i = 0; i < 10; i++) pres += `<circle cx="${f(40 + hash(i, 91) * 320)}" cy="${f(320 + hash(i, 93) * 60)}" r="${f(1.2 + hash(i, 95) * 2)}" fill="none" stroke="#FFFFFF" stroke-width="0.8" opacity="0.6">${boucle('opacity', [0, 0.7, 0.3], 2 + hash(i, 97) * 2, hash(i, 99) * 3)}</circle>`;
  // des éclats de soleil sur le papier mouillé
  for (let i = 0; i < 5; i++) pres += `<circle cx="${f(150 + hash(i, 101) * 110)}" cy="${f(170 + hash(i, 103) * 70)}" r="1.6" fill="#FFFFFF">${boucle('opacity', [0, 0.9, 0], 1.8 + hash(i, 105), hash(i, 107) * 2)}</circle>`;
  s += `<g opacity="0">${fonduUneFois('opacity', '0;0;1', '0;0.74;1', 5.4)}<g transform="translate(200 206)"><g>${uneFois('scale', '1.18;1.18;1', '0;0.74;1', 5.6)}<g transform="translate(-200 -206)">${pres}</g></g></g></g>`;
  return D.out(s);
}

// ════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 02_plage — on se voit enfin : l'avatar en tenue de naufragé, de dos, face à la mer, au couchant. Du sable devant lui
// (le geste « Avancer », au milieu de l'image, un peu sous l'horizon)
// ════════════════════════════════════════════════════════════════════════════════════════════════════════════════
function plage02() {
  const D = Defs('pla');
  let s = plageCouchant(D, { soleil: 236, horizon: 196, rivage: 262, objets: objetsPlage(D) + coque(352, 300, 0.9, -8) + valise(46, 300, 0.85) + planche(300, 282, 50, 6) });
  // la lumière du couchant qui baigne la scène, et l'ombre longue de l'avatar (vers le spectateur, à gauche)
  s += `<rect width="${W}" height="${W}" fill="${D.rad([[0, '#FFC27A', 0.22], [1, '#FFC27A', 0]], 236, 196, 260)}"/>`;
  s += `<ellipse cx="136" cy="384" rx="26" ry="7" fill="#3A2030" opacity="0.4"/><path d="M146,382 L104,400 L80,400 L132,378 Z" fill="#3A2030" opacity="0.25"/>`;
  return D.out(s);
}

// ════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 03_ciel — Brume lève les yeux vers le ciel et ne dit rien. Le ciel du couchant, sans étoile encore ; la nuit tombe
// ════════════════════════════════════════════════════════════════════════════════════════════════════════════════
function ciel03() {
  const D = Defs('cie');
  const h = 318;
  let s = `<rect width="${W}" height="${W}" fill="${D.lin([[0, '#1E1A44'], [0.4, '#4A3470'], [0.75, '#C2586A'], [1, '#F2A070']], 0, 0, 0, h)}"/>`;
  // les grands nuages en traîne, lisérés de rose, qui s'éteignent
  const traine = (x, y, w, c, k) => `<g>${defile('0 0', `${f(24 * k)} 0`, 30, hash(x, 1) * 30)}<path d="M${x},${y} q${f(w * 0.3)},-14 ${f(w * 0.6)},-4 q${f(w * 0.25)},-10 ${f(w * 0.5)},4 q-${f(w * 0.5)},12 -${f(w * 1.1)},0 Z" fill="${c}" opacity="0.9"/><path d="M${f(x + 8)},${f(y + 2)} q${f(w * 0.5)},8 ${f(w * 0.95)},2" fill="none" stroke="#FF9A8A" stroke-width="2" stroke-linecap="round">${fonduUneFois('opacity', '0.9;0.25', '0;1', 2.2)}</path></g>`;
  s += traine(10, 120, 170, '#3A2A5E', 1) + traine(220, 90, 190, '#33285A', -1) + traine(120, 200, 140, '#5A3A6E', 0.6) + traine(260, 240, 120, '#6A3E6E', -0.5);
  // la dernière lueur au ras de l'horizon, qui baisse
  s += `<rect width="${W}" height="${h}" fill="${D.rad([[0, '#FFD08A', 0.7], [0.5, '#FF9A70', 0.25], [1, '#FF8A6A', 0]], 200, h + 40, 230)}">${fonduUneFois('opacity', '1;0.35', '0;1', 2.2)}</rect>`;
  // la mer et la plage, en bas, presque noires
  s += `<rect y="${h}" width="${W}" height="30" fill="${D.lin([[0, '#3E3060'], [1, '#1E1A34']], 0, h, 0, h + 30)}"/>`;
  s += `<path d="M0,${h + 2} Q200,${h - 2} 400,${h + 2}" fill="none" stroke="#FFB08A" stroke-width="1.2" opacity="0.6"/>`;
  s += `<path d="M0,348 Q120,336 210,344 T400,338 L400,400 L0,400 Z" fill="${D.lin([[0, '#3A2A38'], [1, '#140E18']], 0, 336, 0, 400)}"/>`;
  // les rochers du bout de la plage, en ombres chinoises, qui cadrent le ciel
  s += path('M0,352 L0,262 Q14,250 30,256 Q44,236 62,250 Q78,262 84,300 Q92,330 112,352 Z', '#1A1426') + path('M400,348 L400,276 Q384,262 368,272 Q352,258 340,276 Q326,300 306,348 Z', '#1A1426');
  s += trait('M30,256 Q44,236 62,250', '#FF9A8A', 1.2, 'opacity="0.5"') + trait('M368,272 Q352,258 340,276', '#FF9A8A', 1.2, 'opacity="0.5"');
  // Brume, de dos, toute petite, qui lève les yeux : sa lueur sur le sable
  s += `<ellipse cx="200" cy="350" rx="60" ry="14" fill="${D.rad([[0, '#BFE6FF', 0.45], [1, '#BFE6FF', 0]], 200, 350, 60)}"/>`;
  s += `<g transform="translate(200 342)"><g>${vaVient('translate', '0 0', '0 -4', 2.4)}<g transform="rotate(-8) scale(1.5) translate(-20 -32)">${brumeFrame('s0', 0, 'neutre', false)}</g></g></g>`;
  // la nuit qui tombe : le ciel s'assombrit (sans étoile encore)
  s += `<rect width="${W}" height="${W}" fill="#0A0C24" opacity="0">${fonduUneFois('opacity', '0;0.45', '0;1', 2.2)}</rect>`;
  return D.out(s);
}

// ════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 05_cercle — de nuit : un cercle de pierres noircies, à moitié enfoui dans le sable, en haut de la plage ; Brume
// au-dessus, toute petite. Au large, la brume, et l'épave cachée dedans
// ════════════════════════════════════════════════════════════════════════════════════════════════════════════════
const NUIT = { haut: '#070B22', bas: '#1E2C52', mer: '#14223E', sable: '#4A4650', sableBas: '#24222C' };
function etoiles(D, n, yMax, seed) {
  let s = '';
  for (let i = 0; i < n; i++) {
    const x = hash(i, seed) * 400, y = hash(i, seed + 1) * yMax, r = 0.5 + hash(i, seed + 2) * 1.2, d = 1.8 + hash(i, seed + 3) * 2.6;
    s += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="#FFF6DC">${boucle('opacity', [1, 0.3, 0.8], d, hash(i, seed + 4) * d)}</circle>`;
  }
  return s;
}
function cercle05() {
  const D = Defs('cer');
  const h = 132;
  // le ciel de la première nuit, ses étoiles, la lune voilée
  let s = `<rect width="${W}" height="${h + 2}" fill="${D.lin([[0, NUIT.haut], [1, NUIT.bas]], 0, 0, 0, h)}"/>` + etoiles(D, 34, h - 16, 7);
  s += `<circle cx="324" cy="44" r="46" fill="${D.rad([[0, '#E8F0FF', 0.45], [1, '#E8F0FF', 0]], 324, 44, 46)}"/><circle cx="324" cy="44" r="10" fill="#F2F4E8"/><circle cx="321" cy="41" r="2.2" fill="#DCE0D4"/><circle cx="328" cy="47" r="1.5" fill="#DCE0D4"/>`;
  // la mer, et sur elle le banc de brume ; l'épave cachée dedans, qu'on devine quand la brume s'éclaircit
  s += `<rect y="${h}" width="${W}" height="34" fill="${D.lin([[0, '#1E3456'], [1, NUIT.mer]], 0, h, 0, h + 34)}"/>`;
  s += `<path d="M150,${h + 12} L250,${h + 12}" stroke="#C8D8F0" stroke-width="1" opacity="0.3"/>`;
  s += `<g opacity="0.4">${boucle('opacity', [0.2, 0.62, 0.32], 9)}<g transform="translate(176 ${h + 1}) rotate(-7) scale(1.4)">${path('M-34,0 L36,0 L28,-9 L-30,-9 Z', '#2A3550')}${path('M-14,-9 L10,-9 L8,-17 L-12,-17 Z', '#2A3550')}${path('M2,-17 L6,-17 L6,-27 L2,-27 Z', '#2A3550')}${trait('M-36,-1 L40,-1', '#5A6A8E', 0.8)}</g></g>`;
  for (let i = 0; i < 4; i++) s += `<g>${defile('0 0', `${i % 2 ? -40 : 40} 0`, 26 + i * 4, i * 5)}<ellipse cx="${100 + i * 70}" cy="${h + 2 - i * 3}" rx="${150 - i * 10}" ry="${12 + i * 2}" fill="#C8D4E8" opacity="${f(0.16 + i * 0.03)}"/></g>`;
  // la plage, une bande de sable pâle sous la lune, puis la lisière : l'herbe du début du jeu, là où sera le hameau
  s += `<path d="M0,${h + 30} Q200,${h + 24} 400,${h + 30} L400,${h + 60} L0,${h + 60} Z" fill="${D.lin([[0, '#8E8A90'], [1, '#5E5A64']], 0, h + 24, 0, h + 60)}"/>`;
  const lisiere = `M0,${h + 50} Q40,${h + 40} 80,${h + 48} T160,${h + 44} T240,${h + 50} T320,${h + 42} T400,${h + 48} L400,400 L0,400 Z`;
  // (le vert vivant de l'île, sous la lune : bleui, assombri, plus clair là où la lumière de Brume le touche)
  s += `<path d="${lisiere}" fill="${D.lin([[0, '#3E6448'], [0.45, '#2E5038'], [1, '#18301F']], 0, h + 40, 0, 400)}"/>`;
  s += `<path d="M0,${h + 50} Q40,${h + 40} 80,${h + 48} T160,${h + 44} T240,${h + 50} T320,${h + 42} T400,${h + 48}" fill="none" stroke="#7FA88A" stroke-width="1.4" opacity="0.5"/>`;
  // les grandes nappes de l'herbe, chaudes et fraîches (comme sur l'île)
  for (const [x, y, rx, ry, c] of [[60, 250, 110, 30, '#355C40'], [330, 230, 120, 26, '#2A4C36'], [200, 360, 160, 40, '#2A4A32']]) s += `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${c}" opacity="0.6"/>`;
  // la lumière de Brume sur l'herbe, autour du cercle
  const bx = 220, by = 300;
  s += `<ellipse cx="${bx}" cy="${by}" rx="150" ry="58" fill="${D.rad([[0, '#BFE6FF', 0.42], [0.55, '#8FBFE8', 0.14], [1, '#8FBFE8', 0]], bx, by, 150)}">${boucle('opacity', [0.8, 1, 0.85], 2.4)}</ellipse>`;
  // les touffes d'herbe (trois brins, comme sur l'île), un trèfle, des fleurettes ; elles bougent dans le vent de la nuit
  let herbe = '';
  for (let i = 0; i < 46; i++) {
    const x = hash(i, 21) * 400, y = h + 56 + hash(i, 23) ** 0.8 * (400 - h - 56), k = 0.6 + (y - h) / 260;
    if (Math.hypot((x - bx) / 92, (y - by) / 30) < 1) continue; // (rien dans le cercle)
    const clair = Math.hypot((x - bx) / 150, (y - by) / 58) < 1;
    const c1 = clair ? '#8FC6A0' : '#4E7A58', c2 = clair ? '#5E9070' : '#2E5038';
    herbe += `<g>${vaVient('rotate', `-4 ${f(x)} ${f(y)}`, `4 ${f(x)} ${f(y)}`, 2.6 + hash(i, 25) * 1.6, hash(i, 27) * 3)}` +
      trait(`M${f(x)},${f(y)} q${f(-3 * k)},${f(-6 * k)} ${f(-5 * k)},${f(-12 * k)} M${f(x)},${f(y)} q${f(1 * k)},${f(-8 * k)} ${f(0.5 * k)},${f(-15 * k)} M${f(x)},${f(y)} q${f(3 * k)},${f(-5 * k)} ${f(6 * k)},${f(-10 * k)}`, c2, 2 * k) +
      trait(`M${f(x)},${f(y)} q${f(1 * k)},${f(-8 * k)} ${f(0.5 * k)},${f(-15 * k)}`, c1, 1 * k) + '</g>';
    if (i % 9 === 0) herbe += `<circle cx="${f(x + 8)}" cy="${f(y - 2)}" r="${f(1.6 * k)}" fill="#E8EEF8"/><circle cx="${f(x + 8)}" cy="${f(y - 2)}" r="${f(0.6 * k)}" fill="#F2D88A"/>`;
    if (i % 7 === 3) herbe += [0, 2.1, 4.2].map(a => `<circle cx="${f(x - 10 + Math.cos(a) * 2.2 * k)}" cy="${f(y - 1 + Math.sin(a) * 1.4 * k)}" r="${f(1.8 * k)}" fill="${c2}"/>`).join('');
  }
  // le cercle de pierres (celui du Foyer, sur l'île : des pierres pâles, noircies par les feux d'autrefois), le bois sec
  // déjà dressé dedans, un rondin pour s'asseoir : tout est prêt, il ne manque que la flamme
  let fond = '', avant = '';
  const pierre = (a, i) => {
    const x = bx + Math.cos(a) * 56, y = by + Math.sin(a) * 19, r = 9.5 + hash(i, 3) * 3.5, ht = 0.6 + hash(i, 5) * 0.25;
    const g = D.lin([[0, '#C8C8CC'], [0.35, '#8E8C94'], [0.75, '#3E3A44'], [1, '#1A1820']], x - r, y - r * ht * 2, x + r * 0.4, y + 2);
    const k1 = 0.7 + hash(i, 7) * 0.5, k2 = 0.5 + hash(i, 8) * 0.6, k3 = 0.6 + hash(i, 9) * 0.5;
    return `<ellipse cx="${f(x + 2)}" cy="${f(y + 2)}" rx="${f(r * 1.1)}" ry="${f(r * 0.35)}" fill="#0E1A12" opacity="0.6"/>` +
      `<path d="M${f(x - r)},${f(y)} L${f(x - r * 0.9)},${f(y - r * ht * k1)} Q${f(x - r * 0.55)},${f(y - r * ht * 1.8)} ${f(x - r * 0.1)},${f(y - r * ht * 1.75)} L${f(x + r * 0.35)},${f(y - r * ht * (1.4 + k2 * 0.3))} Q${f(x + r * 0.9)},${f(y - r * ht * k3 * 1.2)} ${f(x + r)},${f(y)} Q${f(x)},${f(y + r * 0.3)} ${f(x - r)},${f(y)} Z" fill="${g}" stroke="#141218" stroke-width="1" stroke-linejoin="round"/>` +
      `<path d="M${f(x - r * 0.5)},${f(y - r * ht * 1.55)} q${f(r * 0.35)},${f(-1.2)} ${f(r * 0.6)},${f(0.6)}" fill="none" stroke="#E8F4FF" stroke-width="1.3" opacity="0.7"/>` +
      `<path d="M${f(x - r * 0.6)},${f(y - r * 0.2)} q${f(r * 0.6)},${f(r * 0.25)} ${f(r * 1.2)},0" fill="none" stroke="#141014" stroke-width="2.6" opacity="0.55"/>`;
  };
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2 + 0.15; (Math.sin(a) < 0 ? (fond += pierre(a, i)) : (avant += pierre(a, i))); }
  // dedans : la vieille cendre, et le bois sec dressé en cône (prêt)
  let bois = `<ellipse cx="${bx}" cy="${by}" rx="46" ry="13" fill="${D.rad([[0, '#2A2626'], [0.75, '#1C1A1C'], [1, '#2E3A30']], bx, by, 46)}"/>`;
  const buche = (x0, y0, x1, y1, w) => `<path d="M${f(x0)},${f(y0)} L${f(x1)},${f(y1)}" stroke="#2A1A12" stroke-width="${f(w + 1.6)}" stroke-linecap="round"/><path d="M${f(x0)},${f(y0)} L${f(x1)},${f(y1)}" stroke="${D.lin([[0, '#9A7452'], [1, '#5E4230']], x0, y0, x1, y1)}" stroke-width="${f(w)}" stroke-linecap="round"/><path d="M${f(x0 + (x1 - x0) * 0.2)},${f(y0 + (y1 - y0) * 0.2 - w * 0.25)} L${f(x0 + (x1 - x0) * 0.8)},${f(y0 + (y1 - y0) * 0.8 - w * 0.25)}" stroke="#C8DCF0" stroke-width="0.9" opacity="0.5" stroke-linecap="round"/>`;
  for (const [dx, dy] of [[-30, 6], [28, 5], [-18, -8], [20, -9], [-4, 9]]) bois += buche(bx + dx, by + dy, bx + dx * 0.12, by - 34 + dy * 0.1, 5);
  bois += buche(bx - 30, by + 4, bx + 30, by + 2, 4.4);
  bois += trait(`M${bx - 6},${by - 30} l-4,-8 M${bx + 4},${by - 31} l5,-7`, '#7A5A40', 1.4);
  // le rondin pour s'asseoir, couché sur l'herbe à droite
  const rondin = `<g transform="rotate(-14 ${bx + 104} ${by + 22})"><ellipse cx="${bx + 104}" cy="${by + 30}" rx="40" ry="7" fill="#0E1A12" opacity="0.5"/><rect x="${bx + 70}" y="${by + 10}" width="70" height="18" rx="9" fill="${D.lin([[0, '#A07A58'], [1, '#4E3424']], 0, by + 10, 0, by + 28)}" stroke="#2A1A12" stroke-width="1.4"/><ellipse cx="${bx + 140}" cy="${by + 19}" rx="5" ry="9" fill="#C8A47A" stroke="#2A1A12" stroke-width="1.2"/><ellipse cx="${bx + 140}" cy="${by + 19}" rx="2.4" ry="4.6" fill="none" stroke="#7A5A3E" stroke-width="0.8"/>${trait(`M${bx + 76},${by + 14} l58,0`, '#D8E8F8', 1, 'opacity="0.45"')}</g>`;
  s += herbe + fond + bois + avant + rondin;
  // Brume au-dessus du cercle, toute petite, qui flotte et luit
  s += `<g transform="translate(${bx} ${by - 66})"><g>${vaVient('translate', '0 0', '0 -6', 2.6)}<circle cx="0" cy="-12" r="28" fill="${D.rad([[0, '#E0F4FF', 0.6], [1, '#E0F4FF', 0]], 0, -12, 28)}"/><g transform="scale(1.1) translate(-20 -32)">${brumeFrame('s0', 0, 'neutre')}</g></g></g>`;
  // des lucioles de brume qui montent de l'herbe, une à une
  for (let i = 0; i < 6; i++) s += `<circle cx="${f(120 + hash(i, 81) * 200)}" cy="${f(330 + hash(i, 83) * 40)}" r="1.4" fill="#DFF2FF" opacity="0">${defile('0 0', `${f(-10 + hash(i, 85) * 20)} -70`, 5 + hash(i, 87) * 3, hash(i, 89) * 6)}${boucle('opacity', [0, 0.8, 0], 5 + hash(i, 87) * 3, hash(i, 89) * 6)}</circle>`;
  return D.out(s);
}

// ════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 10_epave — le premier matin, gris et doux. Contre les rochers au bout de la plage, un morceau de l'Hirondelle : une
// moitié de pont, un canot retourné, des caisses prises dans les cordages. Au pied de l'épave, quelqu'un nage vers la
// plage (Hermine)
// ════════════════════════════════════════════════════════════════════════════════════════════════════════════════
function epave10() {
  const D = Defs('epa');
  const h = 168;
  let s = `<rect width="${W}" height="${W}" fill="${D.lin([[0, '#8E9AB0'], [0.55, '#C8C6CC'], [1, '#E8D8D0']], 0, 0, 0, h)}"/>`;
  s += `<ellipse cx="120" cy="${h}" rx="200" ry="60" fill="${D.rad([[0, '#FFE8D8', 0.6], [1, '#FFE8D8', 0]], 120, h, 200)}"/>`;
  // la mer, calme et grise, ses rides
  s += `<rect y="${h}" width="${W}" height="${280 - h}" fill="${D.lin([[0, '#A6AEBE'], [0.5, '#7E8EA2'], [1, '#5E7088']], 0, h, 0, 280)}"/>`;
  for (let i = 0; i < 7; i++) { const y = h + 8 + i * 15; s += `<g>${defile('0 0', '0 4', 4, i * 0.6)}<path d="M-10,${y} q40,-2 80,0 t80,0 t80,0 t80,0 t80,0" fill="none" stroke="#D8DEE8" stroke-width="${f(0.6 + i * 0.15)}" opacity="0.5"/></g>`; }
  // les rochers au bout de la plage (à droite) et l'épave posée contre eux
  const roc = (x, y, w, hh) => `<path d="M${x},${y} Q${f(x + w * 0.05)},${f(y - hh * 0.8)} ${f(x + w * 0.35)},${f(y - hh)} Q${f(x + w * 0.7)},${f(y - hh * 1.1)} ${f(x + w)},${f(y - hh * 0.3)} L${f(x + w)},${y} Z" fill="${D.lin([[0, '#8A8690'], [0.5, '#5E5A66'], [1, '#34303A']], x, y - hh, x + w * 0.6, y)}" stroke="#2A2630" stroke-width="1.2"/>` + `<path d="M${f(x + w * 0.2)},${f(y - hh * 0.8)} q${f(w * 0.15)},${f(-hh * 0.15)} ${f(w * 0.3)},${f(-hh * 0.1)}" fill="none" stroke="#C8C4CC" stroke-width="1.4" opacity="0.6"/>`;
  s += roc(250, 262, 170, 96) + roc(200, 270, 80, 40);
  // la moitié de pont : bordage blanc au liseré rouge, hublots, plancher qui penche, garde-corps tordu
  let ep = `<g>${vaVient('rotate', '-0.6 300 230', '0.6 300 230', 5)}`;
  ep += path('M196,250 L330,214 L352,236 L214,276 Z', D.lin([[0, '#F2EEE6'], [1, '#B8B2AA']], 196, 214, 214, 276), 'stroke="#3A3236" stroke-width="1.4"');
  ep += path('M198,256 L336,220 L340,226 L202,262 Z', '#C8463A');
  for (let i = 0; i < 4; i++) ep += `<circle cx="${f(224 + i * 30)}" cy="${f(258 - i * 8)}" r="3.4" fill="#4A5A6E" stroke="#2A2630" stroke-width="1"/>`;
  ep += path('M196,250 L330,214 L318,196 L190,230 Z', D.lin([[0, '#A88A68'], [1, '#6E5440']], 190, 196, 196, 250), 'stroke="#3A2A20" stroke-width="1.2"');
  for (let i = 1; i < 6; i++) ep += trait(`M${f(192 + i * 2)},${f(232 + i * 3.6)} L${f(320 + i * 2)},${f(198 + i * 3.4)}`, '#5A4434', 0.8, 'opacity="0.7"');
  for (let i = 0; i < 6; i++) ep += trait(`M${f(196 + i * 24)},${f(229 - i * 6.4)} l${f(i === 4 ? 6 : 0)},-16`, '#E8E4DC', 1.8);
  ep += trait('M196,213 L262,196 Q280,186 300,190 L326,180', '#E8E4DC', 1.8);
  // le canot retourné, sur les rochers ; les caisses prises dans les cordages
  ep += path('M286,186 Q320,166 364,176 L370,190 Q326,182 288,196 Z', D.lin([[0, '#F2F0EA'], [1, '#C8C2BA']], 286, 166, 290, 196), 'stroke="#3A3236" stroke-width="1.2"') + path('M288,196 Q326,184 370,190 L368,194 Q326,188 290,200 Z', '#E8743A');
  for (const [x, y, c] of [[214, 214, 0], [234, 206, 1], [250, 222, 2]]) ep += `<g transform="rotate(${-8 + c * 6} ${x} ${y})"><rect x="${x - 10}" y="${y - 10}" width="20" height="18" fill="${D.lin([[0, '#B8946A'], [1, '#7A5A3E']], x - 10, y - 10, x + 10, y + 8)}" stroke="#3A2A20" stroke-width="1"/>${trait(`M${x - 10},${y - 4} l20,0 M${x - 10},${y + 2} l20,0`, '#5A4430', 0.8)}</g>`;
  ep += trait('M204,206 Q226,226 246,200 Q262,212 258,232 M222,196 Q240,214 262,214', '#D8C8A0', 1.4);
  ep += '</g>';
  s += ep;
  // l'écume qui bat les rochers et l'épave
  const bat = k => `M190,${f(278 + k)} Q240,${f(270 + k)} 290,${f(266 + k)} T400,${f(260 + k)}`;
  s += `<path d="${bat(0)}" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" stroke-dasharray="10 6 3 7" opacity="0.8">${boucle('d', [bat(0), bat(-6), bat(2)], 3.8)}</path>`;
  // Hermine qui nage vers la plage : sa tête, ses bras qui tournent, le sillage et les éclaboussures
  const nx = 160, ny = 250;
  let nage = `<g>${uneFois('translate', '0 0;-34 18', '0;1', 40)}`;
  nage += `<path d="M${nx + 6},${ny + 2} q22,4 44,-2 M${nx + 6},${ny + 4} q22,10 46,6" fill="none" stroke="#F2F4F8" stroke-width="1.2" opacity="0.7"/>`;
  nage += `<ellipse cx="${nx}" cy="${ny + 3}" rx="12" ry="3.4" fill="#5E7088" opacity="0.6"/>`;
  nage += `<g>${vaVient('translate', '0 0', '0 1.6', 0.9)}<circle cx="${nx}" cy="${ny - 3}" r="5" fill="#E8B898" stroke="#3A2A28" stroke-width="0.9"/><path d="M${nx - 5},${ny - 4} Q${nx - 1},${ny - 11} ${nx + 5},${ny - 5} Q${nx + 7},${ny - 9} ${nx + 4},${ny - 11} Q${nx - 2},${ny - 13} ${nx - 5},${ny - 4} Z" fill="#3A2420"/></g>`;
  // les deux bras, l'un après l'autre (crawl)
  const bras = (dx, begin) => `<path d="M${nx + dx},${ny} q-6,-14 -16,-12" fill="none" stroke="#E8B898" stroke-width="2.6" stroke-linecap="round" opacity="0">${`<animate attributeName="opacity" values="0;1;1;0;0" keyTimes="0;0.1;0.4;0.5;1" dur="1.4s" begin="${begin}s" repeatCount="indefinite"/>`}</path>` + `<circle cx="${nx + dx - 14}" cy="${ny - 2}" r="2" fill="#FFFFFF" opacity="0"><animate attributeName="opacity" values="0;0;0.9;0;0" keyTimes="0;0.38;0.48;0.6;1" dur="1.4s" begin="${begin}s" repeatCount="indefinite"/></circle>`;
  nage += bras(-2, 0) + bras(4, -0.7) + '</g>';
  s += nage;
  // la plage, au premier plan
  s += `<path d="M0,300 Q120,284 220,296 T400,290 L400,400 L0,400 Z" fill="${D.lin([[0, '#B8A496'], [0.4, '#D8C4AE'], [1, '#A89480']], 0, 284, 0, 400)}"/>`;
  const ec = k => `M-10,${f(298 + k)} Q120,${f(288 + k)} 220,${f(298 + k)} T410,${f(292 + k)}`;
  s += `<path d="${ec(0)}" fill="none" stroke="#FFFFFF" stroke-width="2" opacity="0.8">${boucle('d', [ec(-2), ec(6), ec(1)], 5)}</path>`;
  s += galet(D, 70, 340, 10, 5, '#7E7680') + galet(D, 330, 352, 12, 6, '#7E7680') + coquillage(160, 330, 4) + planche(260, 320, 44, -6);
  // la brume du matin qui traîne, et deux mouettes
  for (let i = 0; i < 3; i++) s += `<g>${defile('0 0', `${i % 2 ? -50 : 50} 0`, 30 + i * 6, i * 7)}<ellipse cx="${80 + i * 120}" cy="${h + 10 + i * 30}" rx="170" ry="16" fill="#F4F2F4" opacity="${f(0.28 - i * 0.05)}"/></g>`;
  s += `<g>${defile('0 0', '-80 10', 18)}${trait('M260,90 q5,-5 10,0 q5,-5 10,0 M296,78 q4,-4 8,0 q4,-4 8,0', '#4A4A5A', 1.4)}</g>`;
  return D.out(s);
}

// ════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 01_greve (refaite, 15 oct.) — vue subjective : la plage de Brumelune au couchant, « paradisiaque, même si rien ne
// l'est dans la situation » : l'horizon doré, les galets, les étoiles de mer, les algues. Le regard glisse, de l'horizon
// vers les débris : des valises éventrées, des morceaux de coque, une bouée
// ════════════════════════════════════════════════════════════════════════════════════════════════════════════════
const bouee = (x, y, s) => `<g transform="translate(${f(x)} ${f(y)}) scale(${f(s)})"><ellipse cx="0" cy="0" rx="14" ry="6" fill="#F2EEE6" stroke="#4A3A34" stroke-width="1"/><ellipse cx="0" cy="-0.6" rx="6" ry="2.4" fill="#9C6A62"/>${[0, 1, 2, 3].map(k => { const a = (k / 4) * Math.PI * 2 + 0.4; return `<path d="M${f(Math.cos(a) * 7)},${f(Math.sin(a) * 3)} L${f(Math.cos(a) * 14)},${f(Math.sin(a) * 6)}" stroke="#C8463A" stroke-width="4.2"/>`; }).join('')}<ellipse cx="0" cy="0" rx="14" ry="6" fill="none" stroke="#4A3A34" stroke-width="1"/></g>`;
// une valise éventrée, ses habits répandus sur le sable
const valiseOuverte = (x, y, s) => `<g transform="translate(${f(x)} ${f(y)}) scale(${f(s)})"><ellipse cx="2" cy="3" rx="30" ry="6" fill="#5A3A40" opacity="0.35"/>${path('M-18,0 L16,0 L14,-10 L-16,-10 Z', '#7A4A30', 'stroke="#3A2016" stroke-width="1"')}${path('M-16,-10 L-26,-26 L8,-30 L14,-10 Z', '#8E5A3A', 'stroke="#3A2016" stroke-width="1"')}${path('M-14,-10 Q-6,-16 2,-11 Q8,-15 13,-10 Z', '#E8E0D4')}${path('M10,-2 Q22,-6 30,2 Q22,6 12,4 Z', '#4E7AB8', 'stroke="#2A3A5A" stroke-width="0.6"')}${path('M-22,-2 Q-30,2 -36,0 Q-30,-6 -20,-6 Z', '#E8B84A', 'stroke="#7A5A20" stroke-width="0.6"')}${trait('M-12,-4 l20,0', '#5A3420', 1)}</g>`;
function greve01() {
  const D = Defs('gre');
  const objets = objetsPlage(D) + etoileDeMer(186, 352, 9, 0.8, '#F08A5A') + coquillage(120, 300, 4.4, '#FFE0D0') + galet(D, 176, 300, 7, 4)
    + coque(300, 300, 1.3, -10) + valiseOuverte(352, 330, 1.1) + bouee(248, 288, 0.9) + planche(290, 262, 60, 8) + valise(380, 276, 0.8) + coque(392, 352, 0.9, 14);
  const plage = plageCouchant(D, { soleil: 120, horizon: 186, rivage: 254, objets });
  // le regard glisse : de l'horizon doré (à gauche) jusqu'aux débris (à droite), lentement, puis il se pose et respire
  let s = `<g transform="translate(200 200)"><g>${uneFois('translate', '60 0;60 0;-56 6', '0;0.18;1', 6.4)}<g>${vaVient('translate', '0 0', '-4 2', 7, 0)}<g transform="scale(1.32) translate(-200 -200)">${plage}</g></g></g></g>`;
  // la chaleur du couchant qui baigne tout, et le bord du regard, plus sombre
  s += `<rect width="${W}" height="${W}" fill="${D.rad([[0, '#FFD8A0', 0], [0.75, '#3A1E2E', 0.18], [1, '#1A0E18', 0.55]], 200, 210, 300)}"/>`;
  return D.out(s);
}

// ════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 03_vent (refaite, 15 oct.) — à l'heure bleue, juste après le coucher du soleil (la nuit tombera quand il lèvera les
// yeux, 03_ciel). Le vent se lève pour de vrai et ouvre une trouée dans la brume : la plage proche se découvre, le bois
// flotté, des pierres noircies ; au large, la brume tient, et l'épave y reste cachée. Brume, à droite de l'avatar, qui
// le regarde (« Suivre Brume ») ; le haut du ciel reste libre (« Lever les yeux »)
// ════════════════════════════════════════════════════════════════════════════════════════════════════════════════
function vent03() {
  const D = Defs('ven');
  const h = 204;
  // le ciel de l'heure bleue : bleu profond en haut, une bande de feu qui s'éteint sur l'horizon
  let s = `<rect width="${W}" height="${h + 2}" fill="${D.lin([[0, '#1A2250'], [0.5, '#3A3A78'], [0.8, '#8A5A8A'], [0.93, '#E8906A'], [1, '#FFC88A']], 0, 0, 0, h)}"/>`;
  s += `<rect width="${W}" height="${h}" fill="${D.rad([[0, '#FFB070', 0.45], [1, '#FFB070', 0]], 110, h + 10, 200)}"/>`;
  // des nuages effilés que le vent tire vers la droite
  for (const [x, y, w, k] of [[-20, 70, 170, 1], [180, 46, 200, 1.3], [60, 128, 140, 0.8], [250, 150, 130, 1.1]]) {
    s += `<g>${defile('0 0', `${f(60 * k)} 0`, 16 / k, hash(x, y) * 10)}<path d="M${x},${y} q${f(w * 0.3)},-7 ${f(w * 0.62)},-2 q${f(w * 0.24)},-4 ${f(w * 0.48)},3 q-${f(w * 0.55)},5 -${f(w * 1.1)},-1 Z" fill="#3E3470" opacity="0.8"/><path d="M${f(x + 6)},${f(y + 0.5)} q${f(w * 0.5)},3 ${f(w)},0" fill="none" stroke="#F2A08A" stroke-width="1.2" opacity="0.6"/></g>`;
  }
  // la mer, ses reflets de la dernière lueur
  s += `<rect y="${h}" width="${W}" height="${f(256 - h)}" fill="${D.lin([[0, '#5A4A80'], [1, '#22305A']], 0, h, 0, 256)}"/>`;
  for (let i = 0; i < 14; i++) {
    const t = i / 14, y = h + 3 + 44 * t ** 1.3, w = 10 + 30 * t;
    s += `<rect x="${f(110 + (hash(i, 5) - 0.5) * (20 + 60 * t) - w / 2)}" y="${f(y)}" width="${f(w)}" height="1.3" rx="0.6" fill="#FFC890" opacity="0.5">${boucle('opacity', [0.1, 0.6, 0.25], 1.4 + hash(i, 7), hash(i, 9) * 2)}</rect>`;
  }
  for (let i = 0; i < 4; i++) s += `<g>${defile('0 0', '0 5', 3, i * 0.7)}<path d="M-10,${h + 10 + i * 11} q40,-3 80,0 t80,0 t80,0 t80,0 t80,0" fill="none" stroke="#9A8AC0" stroke-width="${f(0.8 + i * 0.25)}" opacity="0.5"/></g>`;
  // au large, le banc de brume tient : l'épave y reste cachée (on devine à peine un mât, par moments)
  s += `<g opacity="0.35">${boucle('opacity', [0.1, 0.4, 0.15], 8)}${trait(`M318,${h - 22} L318,${h + 4} M312,${h - 14} L326,${h - 12}`, '#2A2A50', 1.6)}</g>`;
  for (let i = 0; i < 3; i++) s += `<g>${defile('0 0', `${i % 2 ? -30 : 30} 0`, 22 + i * 5, i * 6)}<ellipse cx="${300 - i * 40}" cy="${h + 2 - i * 4}" rx="${170 - i * 20}" ry="${16 - i * 3}" fill="#D8D4EC" opacity="${f(0.32 - i * 0.06)}"/></g>`;
  // la plage proche, découverte : le sable bleui, le bois flotté, des pierres noircies (le vieux cercle n'est pas loin)
  const ri = 256;
  s += `<path d="M0,${ri} Q100,${ri - 6} 200,${ri + 2} T400,${ri - 4} L400,400 L0,400 Z" fill="${D.lin([[0, '#7A6A80'], [0.4, '#8E7E8A'], [1, '#4A4050']], 0, ri, 0, 400)}"/>`;
  const ec = k => `M-10,${f(ri + k)} Q60,${f(ri + 9 + k)} 130,${f(ri + 3 + k)} T260,${f(ri + 8 + k)} T410,${f(ri + 1 + k)}`;
  s += `<path d="${ec(0)}" fill="none" stroke="#E8E0F4" stroke-width="2" stroke-dasharray="14 5 3 6" opacity="0.8">${boucle('d', [ec(-3), ec(10), ec(4)], 5.2)}</path>`;
  for (let i = 0; i < 60; i++) s += `<circle cx="${f(hash(i, 41) * 400)}" cy="${f(ri + 14 + hash(i, 43) * (400 - ri - 14))}" r="${f(0.5 + hash(i, 45))}" fill="${hash(i, 47) < 0.5 ? '#B8AAC0' : '#3A3044'}" opacity="0.6"/>`;
  // le bois flotté, blanchi
  const flotte = (x, y, w, a) => `<g transform="rotate(${a} ${x} ${y})"><path d="M${x},${y} q${f(w * 0.3)},-4 ${f(w * 0.6)},-1 q${f(w * 0.25)},2 ${f(w * 0.4)},-3 l2,4 q-${f(w * 0.2)},4 -${f(w * 0.45)},3 q-${f(w * 0.3)},-2 -${f(w * 0.57)},3 Z" fill="${D.lin([[0, '#D8CEC8'], [1, '#8E827C']], x, y - 5, x, y + 4)}" stroke="#3A3040" stroke-width="0.9"/>${trait(`M${x + 6},${y - 1} l${f(w * 0.5)},-1`, '#F2ECE8', 0.7, 'opacity="0.7"')}</g>`;
  s += flotte(30, 300, 90, -8) + flotte(296, 314, 70, 10) + flotte(160, 348, 50, 4);
  for (const [x, y, r] of [[80, 330, 9], [98, 336, 7], [70, 342, 6], [330, 286, 7], [346, 290, 5]]) s += galet(D, x, y, r, r * 0.55, '#3A3440') + `<ellipse cx="${x}" cy="${y - r * 0.3}" rx="${r * 0.5}" ry="${r * 0.2}" fill="#1A1418" opacity="0.6"/>`;
  // Brume, à droite de l'avatar, qui le regarde, sa lueur sur le sable
  s += `<ellipse cx="236" cy="300" rx="70" ry="18" fill="${D.rad([[0, '#BFE6FF', 0.35], [1, '#BFE6FF', 0]], 236, 300, 70)}"/>`;
  s += `<g transform="translate(236 216)"><g>${vaVient('translate', '0 0', '0 -7', 2.6)}<circle cx="0" cy="-14" r="30" fill="${D.rad([[0, '#E0F4FF', 0.6], [1, '#E0F4FF', 0]], 0, -14, 30)}"/><g transform="scale(1.5) translate(-20 -32)">${brumeFrame('s0', 0, 'content')}</g></g></g>`;
  // la brume qui couvrait la plage : le vent l'emporte vers la droite et l'ouvre (une fois), puis elle reste en lisière
  s += `<g>${uneFois('translate', '0 0;440 -10', '0;1', 3.4)}${fonduUneFois('opacity', '1;0.7;0', '0;0.6;1', 3.4)}` +
    [[200, 90, 260, 30, 0.55], [80, 300, 240, 36, 0.5], [300, 340, 230, 34, 0.45], [150, 380, 280, 30, 0.4]].map(([x, y, rx, ry, a]) => `<ellipse cx="${x}" cy="${y + 120}" rx="${rx}" ry="${ry}" fill="#D8D4EC" opacity="${a}" filter="${D.flou(6)}"/>`).join('') + '</g>';
  s += `<g>${defile('0 0', '30 0', 14)}<ellipse cx="-30" cy="380" rx="120" ry="18" fill="#D8D4EC" opacity="0.18"/><ellipse cx="430" cy="372" rx="110" ry="16" fill="#D8D4EC" opacity="0.16"/></g>`;
  // les traits du vent, sans fin
  for (let i = 0; i < 4; i++) s += `<g>${defile('-220 0', '460 0', 2.4 + i * 0.3, i * 0.7)}${trait(`M0,${f(120 + i * 52)} q60,-14 120,0 q30,8 60,-6`, '#F2F0FA', 2.2, 'opacity="0.45"')}</g>`;
  return D.out(s);
}
module.exports = { greve01, vent03, racines01, paupieres01, carte01, plage02, ciel03, cercle05, epave10, Defs, vaVient, boucle, defile, uneFois, fonduUneFois, path, trait, hash, f, W, galet, coquillage, algue, etoileDeMer, planche };
